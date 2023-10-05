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
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ellipse from 'react-native-vector-icons/Ionicons';
import RNRestart from "react-native-restart";
import React, { Component, useEffect, useRef, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { request, check, PERMISSIONS, RESULTS } from "react-native-permissions";
import Geolocation from "react-native-geolocation-service";

import ContactUsBottomSheet from "../Components/ContactUsBottomSheet";

import {
  Colors,
  Icons,
  Font,
  config,
  windowWidth,
  apifuntion,
  LangProvider,
  msgProvider,
  Button,
  countries
} from "../Provider/Utils/Utils";
import { SvgXml } from 'react-native-svg';
import { s, vs } from "react-native-size-matters";

import AuthInputBoxSec from "../Components/AuthInputBoxSec";
import { leftWhiteArrow, rightArrow, rightWhiteArrow } from "../Icons/Index";
import { useDispatch, useSelector } from "react-redux";
import { Address, AppLanguage, ContentAlign, Guest, RememberMe, Restart, UserCredentials, UserDetails } from "../Redux/Actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OTP from "../Components/OTP";


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
    code: '966',
    number: '',
    lat: '',
    lng: '',
    address: '',
    isContactUs: false,
    isLoading: false,
    showCountries: false
  })
  const [showOTPModal, setShowOTPModal] = useState(false);

  const insets = useSafeAreaInsets();
  const emailRef = useRef()
  const passRef = useRef()
  const numberRef = useRef()


  const styles = StyleSheet.create({

    inputMainContainer: {
      width: "90%",
      height: windowWidth / 6,
      alignItems: 'flex-end',
      alignSelf: 'center',
      flexDirection: 'row',
      // alignItems:'center',
      marginTop: windowWidth / 10,
      zIndex: 999
    },
    inputContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: windowWidth / 7.5,
      borderColor: Colors.Border,
      borderRadius: 8,
      borderBottomLeftRadius: loginData.showCountries ? 0 : 8,
      borderWidth: 1,
      backgroundColor: Colors.White
    },

    codeContainer: {
      width: '32%',
      height: '100%',
    },

    numberContainer: {
      width: '65%',
      height: '100%',
      justifyContent: 'center',
      paddingHorizontal: '2%'
    },
    separator: {
      width: 1,
      height: '65%',
      backgroundColor: Colors.Border
    },

    titleContainer: {
      position: 'absolute',
      paddingHorizontal: 5,
      // paddingVertical: 1,
      backgroundColor: Colors.White,
      top: 5,
      left: '3%',
      zIndex: 9999
    },
    title: {
      fontSize: Font.small,
      fontFamily: Font.Regular,
      includeFontPadding: false,
      color: Colors.Primary
    },
    flag: {
      height: windowWidth / 14,
      width: windowWidth / 14,
    },
    inputText: {
      fontSize: Font.medium,
      fontFamily: Font.Regular,
      includeFontPadding: false,
      color: Colors.Black
    },
    countryContainer: {
      paddingVertical: 10,
      // height: 100,
      width: '100%',
      position: 'absolute',
      top: '99%',
      left: -1,
      backgroundColor: Colors.White,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      borderLeftColor: Colors.Border,
      borderRightColor: Colors.Border,
      borderBottomColor: Colors.Border,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1

    }
  });


  const setState = (payload) => {
    setLoginData(prev => ({
      ...prev,
      ...payload
    }))
  }

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
      }).finally(() => {
      })
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

      });
  };

  const SendOTP = async () => {

    let conditionsFailed = false;
    Keyboard.dismiss();
    numberRef.current && numberRef.current.blur();

    let number = `${loginData.code}${loginData.number}`
    if (loginData.number.length <= 0 || loginData.number.trim().length <= 0) {
      msgProvider.showError('Please enter your number')
      conditionsFailed = true;
      return
    }
    if (loginData.number.length < 9 || loginData.number.trim().length < 9) {
      msgProvider.showError('Invalid Number')
      conditionsFailed = true;
      return
    }

    if (loginData.number.length > 9 || loginData.number.trim().length > 9) {
      msgProvider.showError('Invalid Number')
      conditionsFailed = true;
      return
    }
    if (conditionsFailed) {
      return false
    } else {

      setState({ isLoading: true })
      let url = config.baseURL + "api-login-send-otp";
      var data = new FormData();
      data.append('countrycode', loginData.code)
      data.append('phone_number', `${loginData.code}${loginData.number}`)
      data.append('type', `patient`)

      // console.log(data._parts);
      apifuntion.postApi(url, data, 1).then((obj) => {

        console.log('Send OTP Response', obj)
        if (obj.status == true) {
          msgProvider.showSuccess('OTP sent to your number')
          setState({ isLoading: false })
          setTimeout(() => {
            setShowOTPModal(true)
          }, 500);


        } else {
          setState({ isLoading: false })
          msgProvider.showError(obj?.message)
        }
      }).catch((error) => {
        setState({ isLoading: false })
        msgProvider.showError('Something went wrong, please try again later.')
        console.log("Send OTP-error ------- ", error)
      })
    }

  }

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
      style={{ flex: 1, backgroundColor: '#e6e6e6', }}>

      {/* <KeyboardAwareScrollView
        // keyboardOpeningTime={200}
        extraScrollHeight={50}
        enableOnAndroid={true}
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{
          paddingVertical: vs(10),
          backgroundColor: Colors.White,
          justifyContent: 'center'
        }}
        showsVerticalScrollIndicator={false}> */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: windowWidth / 5 }}>

        <View style={{ backgroundColor: Colors.White, paddingVertical: vs(10), }}>

          <View
            style={{
              width: "100%",
              alignItems: 'center',
              marginTop: vs(40),
            }}>
            <Image source={Icons.logo} style={{ height: windowWidth - 320, height: windowWidth - 325 }} resizeMode='contain' />
          </View>

          <View
            style={{
              width: "100%",
              alignSelf: "center",
              marginTop: vs(25)
            }}>
            <Text
              style={{
                fontSize: 24,
                fontFamily: Font.Medium,
                alignSelf: 'center',
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
                fontSize: Font.large,
                fontFamily: Font.Regular,
                color: Colors.inActiveText,
                marginTop: vs(6),
                paddingHorizontal: '16%',
                textAlign: 'center'
              }}
            >
              {LangProvider.Logintext[languageIndex]}
            </Text>



            <View style={[styles.inputMainContainer,]}>
              <View style={styles.titleContainer}>
                <Text allowFontScaling={false} style={styles.title}>{'Phone Number'}</Text>
              </View>

              <View style={[styles.inputContainer]}>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setState({ showCountries: !loginData.showCountries })}
                  style={[styles.codeContainer]}>

                  <View style={{
                    height: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: '10%',
                    justifyContent: 'space-between',
                  }}>
                    <Image source={loginData.code === '966' ? Icons.Saudia : Icons.UAE} style={styles.flag} />
                    <Text
                      allowFontScaling={false}
                      style={styles.inputText}>
                      {`+${loginData.code}`}

                    </Text>
                    <SvgXml xml={rightArrow} height={s(13)} width={s(13)} style={{ transform: [{ rotate: loginData.showCountries ? "270deg" : "90deg" }] }} />
                  </View>

                  {
                    loginData.showCountries &&
                    <View style={styles.countryContainer}>
                      {
                        countries.map((item, index) => {
                          return (
                            <Pressable
                              key={item.code}
                              onPress={() => {
                                setState({ showCountries: false, code: item.code })
                              }}
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingHorizontal: '10%',
                                marginTop: index == 0 ? 0 : 5
                              }}>
                              <Image source={item.icon} style={styles.flag} />
                              <Text
                                allowFontScaling={false}
                                style={styles.inputText}>
                                {`+${item.code}`}

                              </Text>
                            </Pressable>
                          )
                        })
                      }
                    </View>
                  }

                </TouchableOpacity>

                <View style={{ justifyContent: 'center' }}>
                  <View style={[styles.separator]} />
                </View>

                <View style={[styles.numberContainer]}>

                  <TextInput
                    maxLength={9}
                    ref={numberRef}
                    style={{ textAlign: contentAlign, }}
                    onChangeText={(val) => setState({ number: val })}
                    placeholder={LangProvider.Phone[languageIndex]}
                    editable={true}
                    blurOnSubmit={false}
                    autoCapitalize="none"
                    value={loginData.number}
                    allowFontScaling={false}
                    keyboardType='decimal-pad'
                    returnKeyType='done'
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                </View>

              </View>
            </View>


            <View style={{ width: '90%', alignSelf: 'center', marginTop: windowWidth / 20, alignItems: 'flex-start' }}>

              <Text
                style={{
                  fontFamily: Font.Regular,
                  fontSize: Font.medium,
                  color: Colors.regulartextcolor,
                  textAlign: contentAlign
                  // fontWeight:'600'
                }}>
                {LangProvider.PhoneInstruction[languageIndex]}

              </Text>

              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 13 }}>
                <Ellipse style={{ alignSelf: 'center' }}
                  name={'ellipse'}
                  size={12}
                  color={Colors.Border}
                />

                <Text
                  style={{
                    fontFamily: Font.Regular,
                    fontSize: Font.medium,
                    color: Colors.regulartextcolor,
                    marginHorizontal: 5
                  }}>
                  {LangProvider.Code[languageIndex]}

                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 13 }}>
                <Ellipse style={{ alignSelf: 'center' }}
                  name={'ellipse'}
                  size={12}
                  color={Colors.Border}
                />

                <Text
                  style={{
                    fontFamily: Font.Regular,
                    fontSize: Font.medium,
                    color: Colors.regulartextcolor,
                    marginHorizontal: 5
                  }}>
                  {LangProvider.Digits[languageIndex]}

                </Text>
              </View>

            </View>


            <Button
              text={LangProvider.Request[languageIndex]}
              onPress={() => SendOTP()}
              btnStyle={{ marginTop: vs(15), width: '90%' }}
              onLoading={loginData.isLoading}
            />

            <Text style={{
              fontSize: Font.xlarge,
              fontFamily: Font.Regular,
              color: Colors.Black,
              alignSelf: 'center',
              marginVertical: windowWidth / 25
            }}>{LangProvider.Or[languageIndex]}</Text>

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
              }}>
              <Text style={{
                fontSize: Font.xlarge,
                fontFamily: Font.Medium,
                color: Colors.Theme,
                alignSelf: 'center'
              }}>{LangProvider.Skip[languageIndex]}</Text>
            </TouchableOpacity>

          </View>


          <View style={{ alignSelf: 'center', flexDirection: 'row', width: '90%', justifyContent: 'space-between', alignItems: 'center', marginTop: windowWidth / 8 }}>
            <Text style={{
              fontSize: Font.xlarge,
              fontFamily: Font.Regular,
              color: Colors.Black,
              alignSelf: 'center',
              marginVertical: windowWidth / 25
            }}>{LangProvider.donot[languageIndex]}</Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Signup')}
            >
              <Text style={{
                fontSize: Font.xlarge,
                fontFamily: Font.Medium,
                color: Colors.Theme,
                alignSelf: 'center'
              }}>{LangProvider.Signup[languageIndex]}</Text>
            </TouchableOpacity>
          </View>

        </View>

        {/* </KeyboardAwareScrollView> */}


        {/* <View
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
      </View> */}

        <TouchableHighlight
          underlayColor={Colors.Highlight}
          onPress={() => {
            setState({
              isContactUs: true
            })
          }}
          style={{ paddingVertical: vs(15), width: '90%', alignSelf: 'center' }}
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


        {/* //--------------------------------------------------------------------------------Language */}

        <View
          style={{
            width: "90%",
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
          <Text
            style={[
              {
                fontSize: Font.large,
                color: Colors.Black,
                fontFamily: Font.Regular,
              }
            ]}
          >
            {LangProvider.languagetxt[languageIndex]}{" "}
          </Text>



          <View style={{ flexDirection: 'row', alignItems: 'center', width: '40%', justifyContent: 'space-between' }}>
            <TouchableOpacity
              onPress={() => {
                ChangeLanguage('en')
              }}
              style={{
                width: "45%",
                backgroundColor: appLanguage == 'en' ? Colors.Theme : Colors.White,
                borderColor: Colors.Theme,
                borderWidth: 1,
                borderRadius: (windowWidth * 2) / 100,
                paddingVertical: (windowWidth * 1.5) / 100,
              }}>

              <Text
                style={{
                  fontSize: Font.medium,
                  color: appLanguage == 'en' ? Colors.White : Colors.Black,
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
                backgroundColor: appLanguage == 'ar' ? Colors.Theme : Colors.White,
                borderColor: Colors.Theme,
                borderWidth: 1,
                borderRadius: (windowWidth * 2) / 100,
                paddingVertical: (windowWidth * 1.5) / 100,
              }}>
              <Text
                style={{
                  fontSize: Font.medium,
                  color: appLanguage == 'ar' ? Colors.White : Colors.Black,
                  fontFamily: Font.Regular,
                  alignSelf: "center",
                }}
              >
                {LangProvider.AR[languageIndex]}
              </Text>
            </TouchableOpacity>
          </View>

        </View>

      </ScrollView>


      <ContactUsBottomSheet
        visible={loginData.isContactUs}
        onRequestClose={() => {
          setState({
            isContactUs: false
          })
        }}
        route={'Login'}
      />

      <OTP
        visible={showOTPModal}
        onRequestClose={() => setShowOTPModal(false)}
        contact={`${loginData?.code}${loginData?.number}`}
        countryCode={`${loginData?.code}`}
        type={'Login'}
      />

    </View>
  );
}

export default Login;