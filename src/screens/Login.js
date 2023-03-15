import {
  Text,
  View,
  Platform,
  BackHandler,
  Alert,
  TouchableHighlight,
  Image,
  TouchableOpacity,
  Keyboard,
  I18nManager,
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RNRestart from "react-native-restart";
import React, { Component, useEffect, useRef, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { request, check, PERMISSIONS, RESULTS } from "react-native-permissions";
import Geolocation from "react-native-geolocation-service";
import ContactUsBottomSheet from "../components/ContactUsBottomSheet";

import {
  Colors,
  Icons,
  Font,
  config,
  windowWidth,
  apifuntion,
  LangProvider,
  msgProvider,
  Button
} from "../Provider/Utils/Utils";
import { SvgXml } from 'react-native-svg';
import { s, vs } from "react-native-size-matters";

import AuthInputBoxSec from "../components/AuthInputBoxSec";
import { leftWhiteArrow, rightWhiteArrow } from "../Icons/Index";
import { useDispatch, useSelector } from "react-redux";
import { Address, AppLanguage, ContentAlign, Guest, RememberMe, Restart, UserCredentials, UserDetails } from "../Redux/Actions";


const Login = ({ navigation }) => {

  const {
    appLanguage,
    deviceToken,
    deviceType,
    credentials,
    languageIndex,
    contentAlign,
    address,
    rememberMe,
    selectedProvider
  } = useSelector(state => state.StorageReducer)
  const dispatch = useDispatch()
  const [loginData, setLoginData] = useState({
    isSecurePassword: true,
    email: rememberMe ? credentials?.email : '',
    password: rememberMe ? credentials?.password : '',
    lat: '',
    lng: '',
    address: '',
    isContactUs: false,
    isLoading: false
  })
  const insets = useSafeAreaInsets();
  const emailRef = useRef()
  const passRef = useRef()

  useEffect(() => {
    navigation.addListener('focus', payload => {
      // console.log('event is registered...');
      return BackHandler.addEventListener('hardwareBackPress', handleBackPress)
    }
    );
    navigation.addListener('blur', payload => {
      // console.log('event is removed...');
      return BackHandler.removeEventListener('hardwareBackPress', handleBackPress)
    }
    );
  }, [])


  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        checkLocationPermission()
      }, 1000);
      return () => {
        checkLocationPermission
      };
    }, [])
  )

  const handleBackPress = () => {
    Alert.alert(
      LangProvider.titleexitapp[languageIndex],
      LangProvider.exitappmessage[languageIndex],
      [
        {
          text: LangProvider.no_txt[languageIndex],
          onPress: () => console.log("Cancel Pressed"),
          style: LangProvider.no_txt[languageIndex],
        },
        {
          text: LangProvider.yes_txt[languageIndex],
          onPress: () => BackHandler.exitApp(),
        },
      ],
      {
        cancelable: false,
      }
    ); // works best when the goBack is async
    return true;
  };

  const checkLocationPermission = () => {
    check(Platform.OS === 'ios' ? (PERMISSIONS.IOS.LOCATION_ALWAYS) : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log('This feature is not available (on this device / in this context)');
            break;
          case RESULTS.DENIED:
            console.log('The permission has not been requested / is denied but requestable');
            locationPermission()
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            getCurrentLocation()
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch((error) => {
        console.log("locationPermission-error", error);
      });
  }

  const locationPermission = () => {
    request(Platform.OS === 'ios' ? (PERMISSIONS.IOS.LOCATION_ALWAYS) : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log('This feature is not available (on this device / in this context)');
            break;
          case RESULTS.DENIED:
            console.log('The permission has not been requested / is denied but requestable');
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            getCurrentLocation()
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch((error) => {
        console.log("locationPermission-error", error);
      });
  }

  const getCurrentLocation = async () => {
    try {
      Geolocation.getCurrentPosition(info => {
        // console.log('current location lat,long', info)
        getadddressfromlatlong(info)
      });
    } catch (err) {
      console.log('getCurrentLocation-error', err);
    }

  };

  const getadddressfromlatlong = (event) => {
    fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      event?.coords?.latitude +
      "," +
      event?.coords?.longitude +
      "&key=" +
      config.mapkey +
      "&language=" +
      appLanguage
    ).then((response) => response.json())
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
          title: 'Home'
        };

        dispatch(Address(addDetails))
        setLoginData(prevState => ({
          ...prevState,
          lat: details.geometry.location.lat,
          lng: details.geometry.location.lng,
          address: details.formatted_address,
        }))
      });
  };


  const updateAddress = async (userId) => {

    let url = config.baseURL + "api-patient-address-update";
    var data = new FormData();
    data.append("user_id", userId);
    data.append("current_address", loginData.address);
    data.append("lat", loginData.lat);
    data.append("lng", loginData.lng);
    data.append("landmark", '');
    data.append("building_name", '');
    data.append("title", '');
    data.append("default", '0');

    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        // console.log("updateAddress-res----", obj);
        let newAddressDetails = null
        if (obj.status == true) {
          newAddressDetails = {
            latitude: obj?.result?.latitude,
            longitude: obj?.result?.longitudes,
            address: obj?.result?.current_address,
            title: 'Home'
          }
          dispatch(Address(newAddressDetails))
        } else {
          newAddressDetails = {
            latitude: '',
            longitude: '',
            address: '',
            title: ''
          }
          dispatch(Address(newAddressDetails))
          return false;
        }
      })
      .catch((error) => {
        console.log("updateAddress-error ------- " + error);
      });
  };

  const LoginUser = async () => {

    Keyboard.dismiss();

    if (loginData.email == '') {
      msgProvider.showError(LangProvider.emptyEmailmobile[languageIndex]);
      return false;
    }

    if (loginData.password == '') {
      msgProvider.showError(LangProvider.emptyPassword[languageIndex]);
      return false;
    }
    setLoginData(prevState => ({
      ...prevState,
      isLoading: true
    }))
    let url = config.baseURL + "api-patient-login";
    var data = new FormData();

    data.append("email_phone", loginData.email);
    data.append("password", loginData.password);
    data.append("device_type", deviceType);
    data.append("device_lang", appLanguage == 'en' ? 'ENG' : 'AR');
    data.append("fcm_token", deviceToken);

    // console.log('login body...', data);

    // return

    apifuntion
      .postApi(url, data)
      .then((obj) => {
        setLoginData(prevState => ({
          ...prevState,
          isLoading: false
        }))
        // console.log('login response.....', obj);
        if (obj.status == true) {
          // msgProvider.showSuccess(obj.message);
          // if (address != null) {
          if (obj.result?.current_address == '' || obj.result?.current_address == null || obj.result?.current_address == undefined) {
            updateAddress(obj?.result?.user_id)
          }
          // }
          const credentials = {
            email: loginData.email,
            password: loginData.password,
          };

          let newAddressDetails = {
            latitude: obj?.result?.latitude,
            longitude: obj?.result?.longitudes,
            address: obj?.result?.current_address,
            title: obj?.result?.address_title
          }
          dispatch(Address(newAddressDetails))
          dispatch(Guest(false))
          if (rememberMe) {
            dispatch(UserCredentials(credentials))
          }
          dispatch(UserDetails(obj?.result))
          setTimeout(() => {
            // if (selectedProvider!=null && (selectedProvider.currentScreen == 'providerList' || selectedProvider.currentScreen == 'providerDetails')) {
            //   navigation.goBack()
            // } else {
            navigation.reset({
              index: 0,
              routes: [{ name: "DashboardStack" }],
            });
            // }
          }, 700);
        } else {
          setTimeout(() => {
            msgProvider.showError(obj.message);
          }, 700);
          return false;
        }
      }).catch((error) => {
        setLoginData(prevState => ({
          ...prevState,
          isLoading: false
        }))
        console.log("LoginUser-error ------- " + error);
      });
  };


  const ChangeLanguage = (lan) => {
    if (lan == 'en') {
      dispatch(AppLanguage('en'))
      // dispatch(Restart(true))
    } else {
      I18nManager.forceRTL(true);
      I18nManager.allowRTL(true);
      dispatch(AppLanguage('ar'))
      setTimeout(() => {
        RNRestart.Restart();
      }, 350);
    }

  }

  return (
    <View
      pointerEvents={loginData.isLoading ? 'none' : 'auto'}
      style={{ flex: 1, justifyContent: 'center', backgroundColor: Colors.White, paddingTop: insets.top, paddingBottom: insets.bottom }}>

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
              alignSelf: 'flex-start',
              // textAlign: contentAlign,
              color: Colors.darkText

            }}
          >
            {LangProvider.Login[languageIndex]}
          </Text>

          <Text
            style={{
              // textAlign: contentAlign,
              alignSelf: 'flex-start',
              fontSize: Font.medium,
              fontFamily: Font.Regular,
              color: Colors.inActiveText,
              marginTop: vs(4)
            }}
          >
            {LangProvider.Logintext[languageIndex]}
          </Text>

          {/* ----------------------------------------email------------------------------------ */}


          <AuthInputBoxSec
            mainContainer={{ marginTop: vs(18), width: '100%' }}
            lableText={LangProvider.Mobileno[languageIndex]}
            inputRef={emailRef}
            onChangeText={(val) => {
              setLoginData(prevState => ({
                ...prevState,
                email: val
              }))
            }}
            value={loginData.email}
            keyboardType="email-address"
            autoCapitalize="none"
            DarkGrey={Colors.DarkGrey}
            returnKeyType="next"
            onSubmitEditing={() => {
              passRef.current.focus();
            }}
            blurOnSubmit={Platform.OS === 'ios' ? true : false}
            editable
          />

          {/* ----------------------------------------------------pssword--- */}

          <AuthInputBoxSec
            mainContainer={{ marginTop: vs(8), width: '100%' }}
            lableText={LangProvider.password[languageIndex]}
            inputRef={passRef}
            onChangeText={(val) => {
              setLoginData(prevState => ({
                ...prevState,
                password: val
              }))
            }}
            value={loginData.password}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="done"
            returnKeyType="done"
            secureTextEntry={loginData.isSecurePassword}
            disableImg={true}
            iconName={loginData.isSecurePassword ? "eye-off" : "eye"}
            iconPressAction={() => {
              setLoginData(prevState => ({
                ...prevState,
                isSecurePassword: !loginData.isSecurePassword
              }))
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
                if (loginData.email != '' && loginData.password != '') {
                  dispatch(RememberMe(!rememberMe))
                  if (!rememberMe) {
                    dispatch(UserCredentials(null))
                  }
                }
              }}>


              <TouchableOpacity
                onPress={() => {
                  if (loginData.email != '' && loginData.password != '') {
                    dispatch(RememberMe(!rememberMe))
                    if (!rememberMe) {
                      dispatch(UserCredentials(null))
                    }
                  }
                }}
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 5,
                  backgroundColor: rememberMe ? Colors.Theme : Colors.White,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: rememberMe ? 0 : 1.3,
                  borderColor: Colors.Border
                }}>
                {
                  rememberMe ?
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
                {LangProvider.Remember[languageIndex]}
              </Text>

            </TouchableOpacity>


            <View style={{ alignSelf: "center", }}>
              <Text
                onPress={() => {
                  navigation.navigate("ForgotPage");
                }}
                style={{
                  color: Colors.Blue,
                  fontFamily: Font.Regular,
                  fontSize: Font.medium,
                  alignSelf: 'flex-end'
                }}
              >
                {LangProvider.Forgotpassword[languageIndex]}
              </Text>
            </View>
          </View>

          <Button
            text={LangProvider.Contiunebtn[languageIndex]}
            onPress={() => LoginUser()}
            btnStyle={{ marginTop: vs(15) }}
            onLoading={loginData.isLoading}
          />

          <TouchableHighlight
            underlayColor={Colors.Highlight}
            onPress={() => {
              setLoginData(prevState => ({
                ...prevState,
                isContactUs: true
              }))
            }}
            style={{ marginTop: vs(25), paddingVertical: vs(5), width: '100%' }}
          >
            <Text
              style={{
                fontSize: Font.medium,
                fontFamily: Font.Regular,
                color: Colors.DarkGrey,
                alignSelf: 'flex-start',
                textDecorationLine: 'underline',

              }}
            >
              {LangProvider.Trouble_SignIn[languageIndex]}
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
              dispatch(UserDetails(null))
              dispatch(Guest(true))
              setTimeout(() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "DashboardStack" }],
                });
              }, 250);
            }}
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              flexDirection: 'row',
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
                  textAlign: contentAlign
                }
              ]}
            >
              {LangProvider.Skip[languageIndex]}
            </Text>

            <SvgXml xml={contentAlign == "right" ? leftWhiteArrow : rightWhiteArrow}
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
              alignSelf: 'flex-start',
              fontFamily: Font.Regular,
              fontSize: Font.medium,
              color: Colors.DarkGrey,
            }}>
            {LangProvider.donot[languageIndex]}
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text
              style={{
                alignSelf: 'flex-start',
                fontFamily: Font.Medium,
                fontSize: Font.medium,
                color: Colors.Blue,
                marginTop: (windowWidth * 2) / 100,
              }}>
              {LangProvider.createnewaccountbtn[languageIndex]}
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
                fontSize: Font.medium,
                color: Colors.Black,
                fontFamily: Font.Regular,
                alignSelf: 'flex-start',
              }
            ]}
          >
            {LangProvider.languagetxt[languageIndex]}{" "}
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
                ChangeLanguage('en')
              }}
              style={{
                width: "45%",
                backgroundColor: appLanguage == 'en' ? Colors.lightBlue : Colors.White,
                borderColor: Colors.lightGrey,
                borderWidth: 1,
                borderRadius: (windowWidth * 2) / 100,
                paddingVertical: (windowWidth * 1.5) / 100,
              }}>

              <Text
                style={{
                  fontSize: Font.medium,
                  color: Colors.Black,
                  fontFamily: Font.Regular,
                  alignSelf: "center",
                }}
              >
                {LangProvider.ENG[languageIndex]}
              </Text>

            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                ChangeLanguage('ar')
              }}
              style={{
                width: "45%",
                alignSelf: "center",
                backgroundColor: appLanguage == 'ar' ? Colors.lightBlue : Colors.White,
                borderColor: Colors.lightGrey,
                borderWidth: 1,
                borderRadius: (windowWidth * 2) / 100,
                paddingVertical: (windowWidth * 1.5) / 100,
              }}>
              <Text
                style={{
                  fontSize: Font.medium,
                  color: Colors.Black,
                  fontFamily: Font.Regular,
                  alignSelf: "center",
                }}
              >
                {LangProvider.AR[languageIndex]}
              </Text>
            </TouchableOpacity>

          </View>


        </View>

      </KeyboardAwareScrollView>


      <ContactUsBottomSheet
        visible={loginData.isContactUs}
        onRequestClose={() => {
          setLoginData(prevState => ({
            ...prevState,
            isContactUs: false
          }))
        }}
        route={'Login'}
      />

    </View>
  );
}

export default Login;