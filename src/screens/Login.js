import {
  Text,
  Dimensions,
  View,
  PermissionsAndroid,
  Platform,
  BackHandler,
  Alert,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Keyboard,
  StatusBar,
} from "react-native";
import React, { Component } from "react";
import { Shareratepro } from "../Provider/Sharerateapp";
import Geolocation from "@react-native-community/geolocation";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Colors,
  Icons,
  Font,
  windowHeight,
  config,
  windowWidth,
  Lang_chg,
  apifuntion,
  msgText,
  consolepro,
  msgProvider,
  localStorage,
  StatusbarHeight,
} from "../Provider/utilslib/Utils";
import GestureRecognizer from "react-native-swipe-gestures";
import { SvgXml } from 'react-native-svg';
import { s, vs } from "react-native-size-matters";

import { AuthInputBoxSec, Button } from "../components";
import { leftArrow, Logo, rightArrow } from "../icons/SvgIcons/Index";
import { TextInput } from "react-native-paper";

global.current_lat_long = "NA";
global.myLatitude = "NA";
global.myLongitude = "NA";

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
      fcm_token: 123456,
      languagechange: false,
      showlanguage: false,
      engbtn_ar: false,
      address_new: "",
    };

    screens = "Login";
    this._didFocusSubscription = props.navigation.addListener(
      "focus",
      (_payload) =>
        BackHandler.addEventListener("hardwareBackPress", this.handleBackPress)
    );
    this.get_language();
  }
  get_language = async () => {
    let textalign = await localStorage.getItemObject("language");
    if (textalign != null) {
      this.setState({ langaugeme: textalign });
    }
    let address_arr = await localStorage.getItemObject("address_arr");
    console.log("jdkfgvy", address_arr);
    this.setState({ address_new: address_arr });
    if (address_arr == "" || address_arr == "NA" || address_arr == null) {
      this.getlatlong();
    }
  };
  componentDidMount() {
    this.props.navigation.addListener("focus", () => {
      this.get_rem_data();
      this.get_language();

      //  this.checkPermission();
      //   this.messageListener();
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

  checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getFcmToken();
    } else {
      this.requestPermission();
    }
  };

  showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
  };

  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
    } catch (error) {
      // User has rejected permissions
    }
  };
  shareApp = () => {
    let url = "NA";

    url = fcmtoken;
    console.log("url", url);

    Shareratepro.sharefunction(url);
  };

  getlatlong = async () => {
    let permission = await localStorage.getItemString("permission");
    if (permission != "denied") {
      var that = this;
      //Checking for the permission just after component loaded
      if (Platform.OS === "ios") {
        this.callLocation(that);
      } else {
        // this.callLocation(that);
        async function requestLocationPermission() {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                title: "Location Access Required",
                message: "This App needs to Access your location",
              }
            );
            console.log("granted", PermissionsAndroid.RESULTS.GRANTED);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              that.callLocation(that);
            } else {
              let position = {
                coords: {
                  latitude: config.latitude,
                  longitude: config.latitude,
                },
              };
              that.getalldata(position);
              localStorage.setItemString("permission", "denied");
            }
          } catch (err) {
            console.warn(err);
          }
        }
        requestLocationPermission();
      }
    } else {
      let position = {
        coords: { latitude: config.latitude, longitude: config.longitude },
      };
      this.getalldata(position);
    }
  };

  callLocation = async (that) => {
    this.setState({ loading: true });
    localStorage.getItemObject("position").then((position) => {
      console.log("position", position);
      if (position != null) {
        var pointcheck1 = 0;
        this.getalldata(position);
        Geolocation.getCurrentPosition(
          //Will give you the current location
          (position) => {
            localStorage.setItemObject("position", position);
            this.getalldata(position);
            pointcheck1 = 1;
          },
          (_error) => {
            let position = {
              coords: {
                latitude: config.latitude,
                longitude: config.longitude,
              },
            };

            this.getalldata(position);
          },
          { enableHighAccuracy: true, timeout: 150000000, maximumAge: 1000 }
        );
        that.watchID = Geolocation.watchPosition((position) => {
          //Will give you the location on location change
          console.log("data", position);

          if (pointcheck1 != 1) {
            localStorage.setItemObject("position", position);
            this.getalldata(position);
          }
        });
      } else {
        console.log("helo gkjodi");
        var pointcheck = 0;
        Geolocation.getCurrentPosition(
          //Will give you the current location
          (position) => {
            localStorage.setItemObject("position", position);

            this.getalldata(position);
            pointcheck = 1;
          },
          (_error) => {
            let position = {
              coords: {
                latitude: config.latitude,
                longitude: config.longitude,
              },
            };

            this.getalldata(position);
          },
          { enableHighAccuracy: true, timeout: 150000000, maximumAge: 1000 }
        );
        that.watchID = Geolocation.watchPosition((position) => {
          //Will give you the location on location change
          console.log("data", position);

          if (pointcheck != 1) {
            localStorage.setItemObject("position", position);
            this.getalldata(position);
          }
        });
      }
    });
  };

  getalldata = (position) => {
    let longitude = position.coords.longitude;
    let latitude = position.coords.latitude;
    console.log("positionlatitude", position.coords);
    console.log("positionlongitude", longitude);
    this.setState({ latitude: latitude, longitude: longitude, loading: false });
    (myLatitude = latitude), (myLongitude = longitude);
    current_lat_long = position;

    let event = {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: this.state.latdelta,
      longitudeDelta: this.state.longdelta,
    };
    this.getadddressfromlatlong(event);
  };

  getadddressfromlatlong = (event) => {
    // alert('hi')

    fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      event.latitude +
      "," +
      event.longitude +
      "&key=" +
      config.mapkey +
      "&language=" +
      config.maplanguage
    )
      .then((response) => response.json())
      .then((resp) => {
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
        let data2 = {
          latitude: details.geometry.location.lat,
          longitude: details.geometry.location.lng,
          address: details.formatted_address,
          city: city,
          administrative_area_level_1: administrative_area_level_1,
        };
        add_location = data2;
        // consolepro.consolelog('responseJson1234', add_location)
        this.GooglePlacesRef &&
          this.GooglePlacesRef.setAddressText(details.formatted_address);
        this.setState({
          latdelta: event.latitudeDelta,
          longdelta: event.longitudeDelta,
          latitude: event.latitude,
          longitude: event.longitude,
          addressselected: details.formatted_address,
        });
        this.setState({ add_my_location: data2 });

        localStorage.setItemObject("address_arr", add_location.address);
        localStorage.setItemObject("addressDetails", data2);
        console.log("dfhhdfgb", data2);
        //   return  this.props.locationget(data2);
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
    console.log("Welcome");
    Lang_chg.language_set(language);
    this.setState({
      engbtn: !this.state.engbtn,
      engbtn_ar: !this.state.engbtn_ar,
    });
  };

  get_rem_data = async () => {
    let remeberdata_arr = await localStorage.getItemObject("remeberdata");

    console.log("config.language", remeberdata_arr);

    if (remeberdata_arr != null) {
      this.setState({ email: remeberdata_arr.email });
      this.setState({ password: remeberdata_arr.password });
      this.setState({ remember_me: true });
      console.log("rembn", this.state.remember_me);
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

  loginbtn = async () => {
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
    console.log("url", url);
    var data = new FormData();

    data.append("email_phone", this.state.email);
    data.append("password", this.state.password);
    data.append("device_type", config.device_type);
    data.append("device_lang", device_lang);
    data.append("fcm_token", fcmtoken);
    console.log("data", data);

    apifuntion
      .postApi(url, data)
      .then((obj) => {
        // alert('muskan')
        consolepro.consolelog("loginAPI", obj);
        consolepro.consolelog("loginAPI-Status", obj.status);
        if (obj.status == true) {
          // this.textinput.clear();
          // this.textinput_mobile.clear();
          var user_details = obj.result;
          this.setState({ emailfocus: false, passwordfocus: false });
          consolepro.consolelog("user_details", user_details);
          const uservalue = {
            email_phone: this.state.email,
            email: this.state.email,
            password: this.state.password,
          };
          localStorage.setItemString('Guest', 'false')
          localStorage.setItemObject("user_login", uservalue);
          localStorage.setItemObject("user_arr", user_details);
          // msgProvider.showError(msgText.sucess_message_login[config.language])
          setTimeout(() => {
            // this.props.navigation.navigate("Home");
            global.isLogin = true
            this.props.navigation.reset({
              index: 0,
              routes: [{ name: "DashboardStack" }],
            });
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

        {/* <GestureRecognizer
          onSwipeLeft={(_state) => {
            this.props.navigation.navigate("Signup");
          }}
          config={config4}
          style={{
            flex: 1,
            backgroundColor: this.state.backgroundColor,
          }}
        > */}
        {/* <StatusBar
          barStyle="dark-content"
          backgroundColor={Colors.White}
          hidden={false}
          translucent={false}
          networkActivityIndicatorVisible={true}
        /> */}

        <KeyboardAwareScrollView
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
                textAlign: config.textRotate,
                color:Colors.darkText

              }}
            >
              {Lang_chg.Login[config.language]}
            </Text>

            <Text
              style={{
                textAlign: config.textRotate,
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
              editable
            />


            {/* ----------------------------------------------------------------------------checkbox */}

            <View
              style={{
                width: "100%",
                alignSelf: "center",
                marginTop: vs(15),
                flexDirection: "row",
                alignItems: 'center'
              }} >

              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  width: "37%",
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
                  }}>
                  {Lang_chg.Remember[config.language]}
                </Text>

              </TouchableOpacity>


              <View style={{ width: "63%", alignSelf: "center", }}>
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
              btnStyle={{marginTop:vs(15)}}
            />

            <Text
              style={{
                fontSize: Font.headinggray,
                fontFamily: Font.headingfontfamily,
                color: Colors.DarkGrey,
                textAlign: config.textRotate,
                textDecorationLine: 'underline',
                marginTop: vs(25),
              }}
            >
              {Lang_chg.Trouble_SignIn[config.language]}
            </Text>

          </View>




          {/* //--------------------------------------------------------------------------------bottom */}

          <View
            style={{
              width: "100%",
              marginTop: vs(35)
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                localStorage.setItemString('Guest', 'true')
                global.isLogin = false
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
                flexDirection: "row",
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

              {/* <SvgXml xml={
                config.textalign == "right"
                  ? leftArrow : rightArrow
              }
                height={vs(11.98)} width={s(6.42)} color={Colors.White} /> */}

              <Image
                source={
                  config.textalign == "right"
                    ? Icons.leftarrow : Icons.arabic_back
                }
                style={{
                  resizeMode: "contain",
                  width: 20,
                  alignSelf: "center",
                  height: 20,
                  tintColor: Colors.White
                }}
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
              alignSelf:'center',
              marginTop:vs(15)
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
        {/* </GestureRecognizer> */}

      </View>
    );
  }
}
