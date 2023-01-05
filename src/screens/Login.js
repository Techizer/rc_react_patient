import {
  Text,
  Dimensions,
  View,
  PermissionsAndroid,
  Platform,
  BackHandler,
  Alert,
  ScrollView,
  TouchableHighlight,
  Image,
  TouchableOpacity,
  Keyboard,
  StatusBar,
} from "react-native";
import React, { Component } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import messaging from '@react-native-firebase/messaging';
import SimpleToast from "react-native-simple-toast";
import { request, check, PERMISSIONS, RESULTS } from "react-native-permissions";
import Geolocation from "react-native-geolocation-service";
import ContactUsBottomSheet from "../components/ContactUsBottomSheet";

import {
  Colors,
  Icons,
  Font,
  config,
  windowWidth,
  Lang_chg,
  apifuntion,
  msgText,
  consolepro,
  msgProvider,
  localStorage,
  StatusbarHeight,
  Button
} from "../Provider/utilslib/Utils";
import { SvgXml } from 'react-native-svg';
import { s, vs } from "react-native-size-matters";

import AuthInputBoxSec from "../components/AuthInputBoxSec";
import { leftWhiteArrow, rightWhiteArrow } from "../Icons/Index";

global.current_lat_long = "NA";
global.myLatitude = "NA";
global.myLongitude = "NA";

var watchID = null
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSecurePassword: true,
      cheackbox: false,
      emailfocus: false,
      email: "",
      passwordfocus: false,
      password: "",
      engbtn: false,
      device_lang: "AR",
      langaugeme: 0,
      remember_me: "",
      fcmToken: '',
      languagechange: false,
      showlanguage: false,
      engbtn_ar: false,
      lat: '',
      lng: '',
      address: '',
      isContactUs: false
    };

    this._didFocusSubscription = props.navigation.addListener(
      "focus",
      (_payload) =>
        BackHandler.addEventListener("hardwareBackPress", this.handleBackPress)
    );
    this.get_language();
    this.checkLocationPermission();
  }
  componentDidMount() {
    this.props.navigation.addListener("focus", () => {
      this.get_rem_data();
      this.get_language();
      this.getFcm()
    });
    this._willBlurSubscription = this.props.navigation.addListener(
      "blur",
      (_payload) =>
        BackHandler.removeEventListener(
          "hardwareBackPress",
          this.handleBackPress
        )
    );
  }
  get_language = async () => {
    let textalign = await localStorage.getItemObject("language");
    if (textalign != null) {
      this.setState({ langaugeme: textalign });
    }
  };

  getFcm = async () => {
    let token = await localStorage.getItemString('DeviceToken')
    console.log('?????????????',token);
    this.setState({ fcmToken: token })
  }


checkLocationPermission = () => {
  check(Platform.OS === 'ios' ? (PERMISSIONS.IOS.LOCATION_WHEN_IN_USE || PERMISSIONS.IOS.LOCATION_ALWAYS) : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
    .then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log('This feature is not available (on this device / in this context)');
          break;
        case RESULTS.DENIED:
          console.log('The permission has not been requested / is denied but requestable');
          this.locationPermission()
          break;
        case RESULTS.LIMITED:
          console.log('The permission is limited: some actions are possible');
          break;
        case RESULTS.GRANTED:
          console.log('The permission is granted');
          this.getCurrentLocation()
          break;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          localStorage.setItemString('permission', 'denied')
          break;
      }
    })
    .catch((error) => {
      console.log("locationPermission-error", error);
    });
}

locationPermission = () => {
  request(Platform.OS === 'ios' ? (PERMISSIONS.IOS.LOCATION_WHEN_IN_USE || PERMISSIONS.IOS.LOCATION_ALWAYS) : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
    .then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log('This feature is not available (on this device / in this context)');
          break;
        case RESULTS.DENIED:
          console.log('The permission has not been requested / is denied but requestable');
          localStorage.setItemString('permission', 'denied')
          break;
        case RESULTS.LIMITED:
          console.log('The permission is limited: some actions are possible');
          break;
        case RESULTS.GRANTED:
          console.log('The permission is granted');
          this.getCurrentLocation()
          break;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          localStorage.setItemString('permission', 'denied')
          break;
      }
    })
    .catch((error) => {
      console.log("locationPermission-error", error);
    });
}

getCurrentLocation = async () => {
  try {
    Geolocation.getCurrentPosition(info => {
      // console.log('current location lat,long', info)
      localStorage.setItemObject("position", info);
      this.getadddressfromlatlong(info)
    });
  } catch (err) {
    console.log('getCurrentLocation-error', err);
  }

};

getadddressfromlatlong = (event) => {
  fetch(
    "https://maps.googleapis.com/maps/api/geocode/json?address=" +
    event?.coords?.latitude +
    "," +
    event?.coords?.longitude +
    "&key=" +
    config.mapkey +
    "&language=" +
    config.maplanguage
  )
    .then((response) => response.json())
    .then((resp) => {
      // console.log("respresp:: ", resp);
      let responseJson = resp.results[0];
      let city = "";
      let administrative_area_level_1 = "";
      for (let i = 0; i < responseJson.address_components.length; i++) {
        if (responseJson.address_components[i].types[0] == "locality") {
          city = responseJson.address_components[i].long_name;
          break;
        } else if (
          responseJson.address_components[i].types[0] ==
          "administrative_area_level_2"
        ) {
          city = responseJson.address_components[i].long_name;
        }
      }
      for (let j = 0; j < responseJson.address_components.length; j++) {
        if (
          responseJson.address_components[j].types[0] ==
          "administrative_area_level_1"
        ) {
          administrative_area_level_1 =
            responseJson.address_components[j].long_name;
        }
      }
      let details = responseJson;
      let addDetails = {
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
        address: details.formatted_address,
        city: city,
        administrative_area_level_1: administrative_area_level_1,
      };

      this.setState({
        lat: details.geometry.location.lat,
        lng: details.geometry.location.lng,
        address: details.formatted_address,
      })

      localStorage.setItemObject("addressDetails", addDetails);
    });
};


handleBackPress = () => {
  Alert.alert(
    Lang_chg.titleexitapp[config.language],
    Lang_chg.exitappmessage[config.language],
    [
      {
        text: Lang_chg.no_txt[config.language],
        onPress: () => console.log("Cancel Pressed"),
        style: Lang_chg.no_txt[config.language],
      },
      {
        text: Lang_chg.yes_txt[config.language],
        onPress: () => BackHandler.exitApp(),
      },
    ],
    {
      cancelable: false,
    }
  ); // works best when the goBack is async
  return true;
};
launguage_setbtn = (language) => {
  Lang_chg.language_set(language);
  this.setState({
    engbtn: !this.state.engbtn,
    engbtn_ar: !this.state.engbtn_ar,
  });
};

get_rem_data = async () => {
  let remeberdata_arr = await localStorage.getItemObject("remeberdata");

  if (remeberdata_arr != null) {
    this.setState({ email: remeberdata_arr.email });
    this.setState({ password: remeberdata_arr.password });
    this.setState({ remember_me: true });
  }
};

remember_me_fun = async () => {
  // if (this.state.email.length <= 0 ||  this.state.email.trim().length <= 0) {
  //   msgProvider.showError(msgText.emptyEmailmobile[config.language])
  //   return false
  // }

  if (this.state.remember_me == false) {
    let data = { email: this.state.email, password: this.state.password };
    localStorage.setItemObject("remeberdata", data);
  } else {
    localStorage.setItemObject("remeberdata", null);
  }
  this.setState({ remember_me: !this.state.remember_me });
  this.setState({ remember_me: true });
};

remove_remember_me_fun = async () => {
  await localStorage.removeItem("remeberdata");
  this.setState({ remember_me: false });
};

updateAddress = async (userId) => {

  let url = config.baseURL + "api-patient-address-update";
  var data = new FormData();
  data.append("user_id", userId);
  data.append("current_address", this.state.address);
  data.append("lat", this.state.lat);
  data.append("lng", this.state.lng);
  data.append("landmark", '');
  data.append("building_name", '');
  data.append("title", '');
  data.append("default", '0');


  apifuntion
    .postApi(url, data, 1)
    .then((obj) => {
      // consolepro.consolelog("updateAddress-res----", obj);
      if (obj.status == true) {
        let newAddressDetails = {
          lat: obj?.result?.latitude,
          lng: obj?.result?.longitudes,
          address: obj?.result?.current_address,
        }

        localStorage.setItemObject("addressDetails", newAddressDetails);
        localStorage.setItemString('isAddressAdded', 'true')
        // user_details['current_address'] = obj.result.current_address
        // localStorage.setItemObject("user_arr", user_details);
      } else {
        localStorage.setItemString('isAddressAdded', 'false')
        return false;
      }
    })
    .catch((error) => {
      console.log("-------- error ------- " + error);
    });
};

loginbtn = async () => {

  let isAddressAdded = await localStorage.getItemString('isAddressAdded')
  Keyboard.dismiss();
  var email = this.state.email.trim();
  if (email.length <= 0 || email.length <= 0) {
    msgProvider.showError(msgText.emptyEmailmobile[config.language]);
    return false;
  }

  if (
    this.state.password.length <= 0 ||
    this.state.password.trim().length <= 0
  ) {
    msgProvider.showError(msgText.emptyPassword[config.language]);
    return false;
  }
  // if (this.state.password.length < 8) {
  //     msgProvider.showError(msgText.emptyPasswordValid[config.language])
  //     return false
  // }
  var device_lang;
  if (config.language == 0) {
    device_lang = "ENG";
  } else {
    device_lang = "AR";
  }

  let url = config.baseURL + "api-patient-login";
  var data = new FormData();

  data.append("email_phone", this.state.email);
  data.append("password", this.state.password);
  data.append("device_type", config.device_type);
  data.append("device_lang", device_lang);
  data.append("fcm_token", this.state.fcmToken);

  console.log('login body...',data);

  apifuntion
    .postApi(url, data)
    .then((obj) => {
      // console.log('login response.....', obj); 
      if (obj.status == true) {
        if ((isAddressAdded == null || isAddressAdded === 'false') && (obj.result?.current_address == '' || obj.result?.current_address == null || obj.result?.current_address == undefined)) {
          this.updateAddress(obj?.result?.user_id)
        }
        var user_details = obj.result;
        this.setState({ emailfocus: false, passwordfocus: false });
        const uservalue = {
          email_phone: this.state.email,
          email: this.state.email,
          password: this.state.password,
        };

        let newAddressDetails = {
          lat: obj?.result?.latitude,
          lng: obj?.result?.longitudes,
          address: obj?.result?.current_address,
        }

        localStorage.setItemObject("addressDetails", newAddressDetails);
        localStorage.setItemString('Guest', 'false')
        localStorage.setItemObject("user_login", uservalue);
        localStorage.setItemObject("user_arr", user_details);
        localStorage.setItemObject("addressDetails", newAddressDetails);
        // msgProvider.showError(msgText.sucess_message_login[config.language])
        setTimeout(() => {
          // this.props.navigation.navigate("Home");
          global.isLogin = true
          if (global.isPage == "") {
            this.props.navigation.reset({
              index: 0,
              routes: [{ name: "DashboardStack" }],
            });
          } else if (global.isPage == "providerList") {
            this.props.navigation.goBack()
          } else if (global.isPage == "providerDetails") {
            this.props.navigation.goBack()
          }



          // pop(
          //   "AllServiceProviderListing",
          //   //{ pass_status: item.pass_status }
          // )
        }, 700);
      } else {
        // if (obj.active_status == msgTitle.deactivate[config.language] || obj.msg[config.language] == msgTitle.usererr[config.language]) {
        //   usernotfound.loginFirst(this.props, obj.msg[config.language])
        // } else {
        setTimeout(() => {
          // msgProvider.alert('', obj.message, false);
          msgProvider.showError(obj.message);
        }, 700);
        // }
        return false;
      }
    })
    .catch((error) => {
      consolepro.consolelog("-------- error ------- " + error);
      this.setState({ loading: false });
    });
};
render() {
  const config4 = {
    velocityThreshold: 1,
    directionalOffsetThreshold: windowWidth,
    // gestureIsClickThreshold:1
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: Colors.White, paddingTop: StatusbarHeight + 10 }}>



      <KeyboardAwareScrollView
        // keyboardOpeningTime={200}
        extraScrollHeight={50}
        enableOnAndroid={true}
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{
          justifyContent: 'center',
          paddingBottom: vs(30),
        }}
        showsVerticalScrollIndicator={false}>

        <View
          style={{
            width: "100%",
            alignItems: 'center',
            marginTop: vs(40),
          }}>
          <Image source={Icons.logo} style={{ height: windowWidth - 297, height: windowWidth - 297 }} resizeMode='contain' />
        </View>

        <View
          style={{
            width: "90%",
            alignSelf: "center",
            marginTop: vs(25)
          }}>
          <Text
            style={{
              fontSize: Font.xxxlarge,
              fontFamily: Font.Medium,
              textAlign: config.textalign,
              color: Colors.darkText

            }}
          >
            {Lang_chg.Login[config.language]}
          </Text>

          <Text
            style={{
              textAlign: config.textalign,
              fontSize: Font.medium,
              fontFamily: Font.Regular,
              color: Colors.inActiveText,
              marginTop: vs(4)
            }}
          >
            {Lang_chg.Logintext[config.language]}
          </Text>

          {/* ----------------------------------------email------------------------------------ */}


          <AuthInputBoxSec
            mainContainer={{ marginTop: vs(18), width: '100%' }}
            lableText={Lang_chg.Mobileno[config.language]}
            inputRef={(ref) => {
              this.emailInput = ref;
            }}
            onChangeText={(text) => this.setState({ email: text })}
            value={this.state.email}
            keyboardType="email-address"
            autoCapitalize="none"
            DarkGrey={Colors.DarkGrey}
            returnKeyType="next"
            onSubmitEditing={() => {
              this.passwordInput.focus();
            }}
            blurOnSubmit={Platform.OS === 'ios' ? true : false}
            editable
          />

          {/* ----------------------------------------------------pssword--- */}

          <AuthInputBoxSec
            mainContainer={{ marginTop: vs(8), width: '100%' }}
            lableText={Lang_chg.password[config.language]}
            inputRef={(ref) => {
              this.passwordInput = ref;
            }}
            onChangeText={(text) => this.setState({ password: text })}
            value={this.state.password}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="done"
            returnKeyType="done"
            secureTextEntry={this.state.isSecurePassword}
            disableImg={true}
            iconName={this.state.isSecurePassword ? "eye-off" : "eye"}
            iconPressAction={() => {
              this.setState({
                isSecurePassword: !this.state.isSecurePassword,
              });
            }}
            onSubmitEditing={() => {
              Keyboard.dismiss();
            }}
            blurOnSubmit={Platform.OS === 'ios' ? true : false}
            editable
          />


          {/* ----------------------------------------------------------------------------checkbox */}

          <View
            style={{
              width: "100%",
              alignSelf: "center",
              marginTop: vs(15),
              flexDirection: "row",
              alignItems: 'center',
              justifyContent: 'space-between'
            }} >

            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                flexDirection: "row",
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              onPress={() => {
                this.state.remember_me == false ?
                  this.remember_me_fun()
                  :
                  this.remove_remember_me_fun();
              }}>


              <TouchableOpacity
                onPress={() => {
                  this.state.remember_me == false ?
                    this.remember_me_fun()
                    :
                    this.remove_remember_me_fun();
                }}
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 5,
                  backgroundColor: this.state.remember_me ? Colors.Theme : Colors.White,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: this.state.remember_me ? 0 : 1.3,
                  borderColor: Colors.Border
                }}>
                {
                  this.state.remember_me ?
                    <Image
                      style={{
                        height: 14,
                        width: 14,
                        tintColor: Colors.White
                      }}
                      resizeMode="contain"
                      source={Icons.Tick}
                    />
                    :
                    null
                }
              </TouchableOpacity>
              <Text
                style={{
                  color: Colors.inActiveText,
                  fontFamily: Font.Regular,
                  fontSize: Font.medium,
                  marginLeft: s(10)
                }}>
                {Lang_chg.Remember[config.language]}
              </Text>

            </TouchableOpacity>


            <View style={{ alignSelf: "center", }}>
              <Text
                onPress={() => {
                  this.props.navigation.navigate("ForgotPage");
                }}
                style={{
                  color: Colors.Blue,
                  fontFamily: Font.Regular,
                  fontSize: Font.Forgot,
                  textAlign: config.textalign,
                  alignSelf: 'flex-end'
                }}
              >
                {Lang_chg.Forgotpassword[config.language]}
              </Text>
            </View>
          </View>

          <Button
            text={Lang_chg.Contiunebtn[config.language]}
            onPress={() => this.loginbtn()}
            btnStyle={{ marginTop: vs(15) }}
          />

          <TouchableHighlight
            underlayColor={Colors.Highlight}
            onPress={() => this.setState({ isContactUs: true })}
            style={{ marginTop: vs(25), paddingVertical: vs(5), width: '100%' }}
          >
            <Text
              style={{
                fontSize: Font.medium,
                fontFamily: Font.Regular,
                color: Colors.DarkGrey,
                textAlign: config.textalign,
                textDecorationLine: 'underline',

              }}
            >
              {Lang_chg.Trouble_SignIn[config.language]}
            </Text>
          </TouchableHighlight>



        </View>




        {/* //--------------------------------------------------------------------------------bottom */}

        <View
          style={{
            width: "100%",
            marginTop: vs(30)
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              localStorage.setItemString('Guest', 'true')
              localStorage.setItemObject("user_arr", null);
              global.isLogin = false
              global.isPage = ""
              setTimeout(() => {
                this.props.navigation.reset({
                  index: 0,
                  routes: [{ name: "DashboardStack" }],
                });
              }, 350);
            }}
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              flexDirection: config.textalign=='right'?'row-reverse':'row',
              justifyContent: "space-between",
              backgroundColor: Colors.Theme,
              paddingVertical: vs(6),
              paddingHorizontal: (windowWidth * 5) / 100
            }} >
            <Text
              style={[
                {
                  fontSize: Font.small,
                  color: Colors.White,
                  fontFamily: Font.Regular,
                  textAlign: config.textRotate
                }
              ]}
            >
              {Lang_chg.Skip[config.language]}
            </Text>

            <SvgXml xml={
              config.textalign == "right"
                ? leftWhiteArrow : rightWhiteArrow
            }
              height={vs(11.98)} width={s(6.42)} color={Colors.White}
              />


          </TouchableOpacity>

        </View>


        <View
          style={{
            width: "100%",
            paddingVertical: vs(15),
            paddingHorizontal: s(15),
            backgroundColor: Colors.appointmentdetaillightblue
          }} >

          <Text
            style={{
              textAlign: config.textRotate,
              fontFamily: Font.Regular,
              fontSize: Font.headinggray,
              color: Colors.DarkGrey,
            }}
          >
            {Lang_chg.donot[config.language]}
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => this.props.navigation.navigate('Signup')}
          >
            <Text
              style={{
                textAlign: config.textRotate,
                fontFamily: Font.Medium,
                fontSize: Font.medium,
                color: Colors.Blue,
                marginTop: (windowWidth * 2) / 100,
              }}
            >
              {Lang_chg.createnewaccountbtn[config.language]}
            </Text>
          </TouchableOpacity>
        </View>

        {/* //--------------------------------------------------------------------------------Language */}

        <View
          style={{
            width: "90%",
            paddingVertical: (windowWidth * 2) / 100,
            alignSelf: 'center',
            marginTop: vs(15)
          }}>
          <Text
            style={[
              {
                fontSize: (windowWidth * 3.8) / 100,
                color: Colors.Black,
                fontFamily: Font.ques_fontfamily,
              },
              Platform.OS == "ios"
                ? { textAlign: config.textalign }
                : null,
            ]}
          >
            {Lang_chg.languagetxt[config.language]}{" "}
          </Text>

          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: 'space-between',
              paddingVertical: (windowWidth * 5) / 100,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if (this.state.langaugeme == 1) {
                  this.launguage_setbtn(0),
                    this.setState({ device_lang: "ENG" });
                } else {
                  null;
                }
              }}
              style={{
                width: "47%",
                backgroundColor:
                  this.state.langaugeme == 0
                    ? Colors.lightBlue
                    : "#fff",
                borderColor: Colors.lightGrey,
                borderWidth: 1,
                borderRadius: (windowWidth * 2) / 100,
                paddingVertical: (windowWidth * 2) / 100,
              }}>

              <Text
                style={{
                  textAlign: config.textalign,
                  fontSize: (windowWidth * 3.5) / 100,
                  color: Colors.Black,
                  fontFamily: Font.ques_fontfamily,
                  alignSelf: "center",
                }}
              >
                {Lang_chg.ENG[config.language]}
              </Text>

            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (this.state.langaugeme == 0) {
                  this.launguage_setbtn(1),
                    this.setState({ device_lang: "AR" });
                } else {
                  null;
                }
              }}
              style={{
                width: "47%",
                alignSelf: "center",
                backgroundColor:
                  this.state.langaugeme == 1
                    ? Colors.lightBlue
                    : "#fff",
                borderColor: Colors.lightGrey,
                borderWidth: 1,
                borderRadius: (windowWidth * 2) / 100,
                paddingVertical: (windowWidth * 2) / 100,
              }}>
              <Text
                style={{
                  textAlign: config.textalign,
                  fontSize: (windowWidth * 3.5) / 100,
                  color: Colors.Black,
                  fontFamily: Font.ques_fontfamily,
                  alignSelf: "center",
                }}
              >
                {Lang_chg.AR[config.language]}
              </Text>
            </TouchableOpacity>

          </View>


        </View>

      </KeyboardAwareScrollView>


      <ContactUsBottomSheet
        visible={this.state.isContactUs}
        onRequestClose={() => {
          this.setState({ isContactUs: false })
        }}
        route={'Login'}
      />

    </View>
  );
}
}
