import {
  Alert,
  Text,
  View,
  Image,
  Modal,
  TouchableOpacity,
  Linking,
  StatusBar,
  Platform,
} from "react-native";
import React, { Component, useEffect, useState } from "react";
import {
  Colors,
  Icons,
  Font,
  config,
  windowWidth,
  LangProvider,
  apifuntion,
} from "../Provider/Utils/Utils";
import HTMLView from "react-native-htmlview";
import messaging from "@react-native-firebase/messaging";
import DeviceInfo from "react-native-device-info";
import { SvgXml } from "react-native-svg";
import { Logo, Splash_Logo } from "../Icons/Index";
import { vs } from "react-native-size-matters";
import { useDispatch, useSelector } from "react-redux";
import { AppLanguage, AppVersion, ContentAlign, DeviceID, DeviceName, DeviceToken, DeviceType, onLogout, UserDetails } from "../Redux/Actions";


const Splash = ({ navigation }) => {

  const {
    appLanguage,
    deviceToken,
    deviceName,
    deviceId,
    languageIndex,
    deviceType,
    contentAlign,
    appVersion,
    loggedInUserDetails,
    address,
    credentials,
    rememberMe,
    isLanguageUpdated,
    deviceConnection
  } = useSelector(state => state.StorageReducer)
  const dispatch = useDispatch()
  const [splashData, setSplashData] = useState({
    email: '',
    password: '',
    language: 'AR',
    fcmToken: deviceToken,
  })
  const [updateData, setUpdateData] = useState({
    appVer: '',
    updTitle: '',
    updText: '',
    skipFlag: '',
    skipText: '',
    rdrTo: '',
    rdrUrl: '',
    showHelp: '',
    helpTitle: '',
    helpUrl: '',
    modalVisible3: false
  })

  useEffect(() => {
    const promise1 = getLanguage();
    const promise2 = requestNotificationPermission();
    const promise3 = getFcmToken();
    const promise4 = getDeviceID();
    const promise5 = getDeviceName();
    const promise6 = getDeviceType();
    const promise7 = getAppVersion();
    Promise.all([promise1, promise2, promise3, promise4, promise5, promise6, promise7]).then((data) => {
      // console.log('promises resolved');
    }).catch((error) => {
      console.log(error);
    })

  }, [])

  const requestNotificationPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // console.log("Authorization status:", authStatus);
      getFcmToken();
    }
  };
  const getFcmToken = async () => {
    try {
      const fcmToken = await messaging().getToken()
      if (fcmToken) {
        console.log({fcmToken});
        dispatch(DeviceToken(fcmToken))
      } else {
        dispatch(DeviceToken(null))
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDeviceID = async () => {
    let deviceId = DeviceInfo.getDeviceId()
    dispatch(DeviceID(deviceId))
  }

  const getDeviceName = async () => {
    DeviceInfo.getDeviceName().then((data) => {
      dispatch(DeviceName(data))
    });
  }

  const getAppVersion = async () => {
    let appVersion = DeviceInfo.getVersion();
    dispatch(AppVersion(appVersion))
  }

  const getDeviceType = async () => {
    dispatch(DeviceType(Platform.OS))
  }
  const getLanguage = async () => {
    if (appLanguage != null) {
      if (appLanguage == 'ar') {
        dispatch(AppLanguage('ar'))
        dispatch(ContentAlign('right'))
        checkAppVersion();
      } else {
        dispatch(AppLanguage('en'))
        dispatch(ContentAlign('left'))
        checkAppVersion();
      }
    } else {
      dispatch(AppLanguage('ar'))
      dispatch(ContentAlign('right'))
      checkAppVersion();
    }
  };

  const checkAppVersion = async () => {
    let language = appLanguage == 'en' ? 'ENG' : 'AR'
    let url = config.baseURL + (Platform.OS == 'ios' ? `api-ios-patient-update?divice_lang=${language}` : `api-android-patient-update?divice_lang=${language}`)
    // console.log("url", url, Configurations.language)
    apifuntion.getApi(url, 1).then((obj) => {
      // console.log('checkAppVersion-res', obj);
      if (obj.status == true) {

        // console.log({
        //   MyVersion: appVersion,
        //   FromApiVersion: obj?.result?.appVer,
        //   Platform: Platform.OS
        // });

        const newCode = obj?.result?.appVer?.split('.').map((i, _i) => (`${i}`.length > 0 && _i !== 0) ? `${i}`.charAt(0) : `${i}`).join('')
        const myCode = appVersion.split('.').map((i, _i) => (`${i}`.length > 0 && _i !== 0) ? `${i}`.charAt(0) : `${i}`).join('')

        // console.log({ newCode, myCode });

        if (parseInt(newCode) > parseInt(myCode)) {
          setUpdateData(prev => ({
            ...prev,
            appVer: obj.result.appVer,
            updTitle: '<h3>' + obj.result.updTitle + '</h3>',
            updText: '<p>' + obj.result.updText + '</p>',
            skipFlag: obj.result.skipFlag,
            skipText: obj.result.skipText,
            rdrTo: obj.result.rdrTo,
            rdrUrl: obj.result.rdrUrl,
            showHelp: obj.result.showHelp,
            helpTitle: obj.result.helpTitle,
            helpUrl: obj.result.helpUrl,
            modalVisible3: true
          }))
        } else {
          setTimeout(() => {
            CheckOldSession()
          }, 1000);
        }

      } else {
        setTimeout(() => {
          CheckOldSession()
        }, 1000);
        return false;
      }
    }).catch((error) => {
      CheckOldSession()
      console.log("checkAppVersion-error ------- " + error);
    })

  }

  const CheckOldSession = () => {

    if (loggedInUserDetails) {
      let url = config.baseURL + `api-check-login`;
      var data = new FormData();
      data.append("fcm_token", deviceToken);
      data.append("user_id", loggedInUserDetails?.user_id);

      apifuntion
        .postApi(url, data)
        .then((obj) => {
          // console.log("CheckOldSession....... ", obj);
          if (obj.result == true) {
            if (credentials) {
              LoginNewSession()
            } else {
              Logout()
            }
          } else {
            Logout()
          }

        }).catch((error) => {
          console.log("CheckOldSession-error ------- " + error);
        });
    } else {
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'AuthStack' }],
        })
      }, 350);
    }

  }

  const LoginNewSession = () => {
    let url = config.baseURL + "api-patient-login";
    var data = new FormData();

    data.append("email_phone", credentials.email);
    data.append("password", credentials.password);
    data.append("device_type", deviceType);
    data.append("device_lang", appLanguage == 'en' ? 'ENG' : 'AR');
    data.append("fcm_token", deviceToken);


    apifuntion
      .postApi(url, data)
      .then((obj) => {
        // console.log('login response.....', obj);
        if (obj.status == true) {
          dispatch(UserDetails(obj?.result))
          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: "DashboardStack" }],
            });
          }, 700);
        } else {
          setTimeout(() => {
            msgProvider.showError(obj.message);
          }, 700);
          return false;
        }
      }).catch((error) => {
        console.log("LoginUser-error ------- " + error);
      });
  }

  const Logout = async () => {
    let url = config.baseURL + "api-logout";
    var data = new FormData();
    data.append("user_id", loggedInUserDetails?.user_id);
    data.append("fcm_token", deviceToken);
    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        // console.log("logout response", obj);
        if (obj.status == true) {
          dispatch(onLogout())
          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'AuthStack' }],
            })
          }, 350);
        } else {
          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'AuthStack' }],
            })
          }, 350);
          return false;
        }
      }).catch((error) => {
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'AuthStack' }],
          })
        }, 350);
        console.log("Logout-error ------- " + error);
      });
  };

  const openAppStoreUrl = async (url) => {
    const supported = await Linking.canOpenURL(url);
    // console.log("supported:: ", supported, url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };
  return (
    <View
      style={{
        width: "100%",
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.White,
      }}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.White}
        hidden={false}
        translucent={false}
        networkActivityIndicatorVisible={true}
      />
      {/* <SvgXml xml={Splash_Logo} /> */}

      <Image source={Icons.splashLogo} style={{ height: windowWidth - 100, height: windowWidth - 100 }} resizeMode='contain' />

      <View style={{ width: '50%', height: 1.5, backgroundColor: Colors.backgroundcolor, marginTop: vs(40) }}></View>

      <View
        style={{
          width: "50%",
          alignSelf: "center",
        }}>
        <Text
          style={{
            paddingVertical: vs(14),
            fontSize: Font.xlarge,
            color: Colors.lightGrey,
            fontFamily: Font.Regular,
            alignSelf: "center",
            textAlign: "center",
          }}
        >
          {LangProvider.Splashtext1[languageIndex]}
        </Text>
      </View>

      <View style={{ width: '50%', height: 1.5, backgroundColor: Colors.backgroundcolor, marginTop: vs(15) }}></View>

      <View
        style={{
          width: "63%",
          alignSelf: "center",
          marginTop: vs(15),
        }}
      >
        <Text
          style={{
            fontSize: Font.medium,
            color: Colors.lightGrey,
            fontFamily: Font.Regular,
            alignSelf: "center",
            textAlign: "center",
          }}
        >
          {LangProvider.Splashtext2[languageIndex]}
        </Text>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={updateData.modalVisible3}
        onRequestClose={() => {
          setUpdateData(pre => ({
            ...pre,
            modalVisible3: false
          }))
        }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={true}
          onPress={() => {
          }}
          style={{
            backgroundColor: "#00000080",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
            marginTop: -50,
          }}
        >
          <View
            style={{
              borderRadius: 20,
              width: (windowWidth * 90) / 100,
              position: "absolute",
              alignSelf: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 2,
                width: "100%",
              }}
            >
              <View
                style={{
                  width: '100%',
                  // paddingVertical: (windowWidth * 3) / 100,
                  marginTop: (windowWidth * 2) / 100,
                  paddingLeft: (windowWidth * 4) / 100,
                  flexDirection: "row",
                  //  backgroundColor: 'red'
                }}
              >
                {/* <Image source={Icons.splashLogo} style={{ height: (windowWidth*10)/100, height: (windowWidth*10)/100 }} resizeMode='contain' /> */}
                <HTMLView
                  value={updateData.updTitle}
                  stylesheet={{
                    h3: {
                      fontFamily: Font.Regular,
                      color: Colors.Black, //'#000',
                      fontSize: (windowWidth * 4.8) / 100,
                      opacity: 0.9,
                    },

                    paddingLeft: (windowWidth * 4) / 100,
                  }}
                />
              </View>
              <View
                style={{
                  alignSelf: "flex-start",
                  paddingVertical: (windowWidth * 1) / 100,
                  paddingLeft: (windowWidth * 4) / 100,
                  paddingRight: (windowWidth * 4) / 100,
                  flexDirection: "row",
                  alignItems: "center",
                }} >

                <HTMLView
                  value={updateData.updText}
                  stylesheet={{
                    p: {
                      fontFamily: Font.Regular,
                      color: Colors.Black, //'#515C6F', //Colors.DarkGrey,
                      fontSize: Font.medium,
                      textAlign: contentAlign,
                      opacity: 0.9,
                      // color: '#FF3366', // make links coloured pink
                    },
                  }}
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: updateData.skipFlag
                    ? "space-between"
                    : "flex-end",
                  width: "70%",
                  paddingBottom: (windowWidth * 5) / 100,
                  marginTop: (windowWidth * 9) / 100,
                  alignSelf: "flex-end",
                  right: 16,
                }}>
                {
                  updateData.skipFlag && (
                    <TouchableOpacity
                      onPress={() => {
                        setUpdateData(pre => ({
                          ...pre,
                          modalVisible3: false
                        }))
                        CheckOldSession()
                      }}
                      style={{
                        width: (windowWidth * 35) / 100,
                        flexDirection: "row",
                        alignSelf: "center",
                        justifyContent: "flex-end",
                      }}>
                      <Text
                        style={{
                          fontFamily: Font.Regular,
                          fontSize: Font.medium,
                          color: Colors.Theme, //Colors.Blue,
                          alignSelf: "center",
                        }}
                      >
                        {updateData.skipText}
                      </Text>
                    </TouchableOpacity>
                  )
                }

                <TouchableOpacity
                  onPress={() => {
                    openAppStoreUrl(updateData.rdrUrl);
                  }}
                  activeOpacity={0.8}
                  style={{
                    width: (windowWidth * 22) / 100,
                    height: (windowWidth * 8) / 100,
                    justifyContent: "center",
                    backgroundColor: "#549E36",
                    alignSelf: "flex-end",
                  }}>
                  <Text
                    style={{
                      fontFamily: Font.Regular,
                      fontSize: Font.medium,
                      color: Colors.White,
                      alignSelf: "center",
                    }}
                  >
                    {LangProvider.Update[languageIndex]}
                  </Text>
                </TouchableOpacity>
              </View>
              {updateData.showHelp && (
                <View
                  style={{
                    borderTopWidth: 1,
                    borderTopColor: Colors.lightGrey,
                    height: (windowWidth * 15) / 100,
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: (windowWidth * 4) / 100,
                    marginRight: (windowWidth * 4) / 100,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Font.SemiBold,
                      fontSize: (windowWidth * 3.5) / 100,
                      color: Colors.placeholder_border,
                    }}>
                    {LangProvider.Help[languageIndex]}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Font.SemiBold,
                      fontSize: (windowWidth * 3.5) / 100,
                      color: Colors.Theme,
                      marginLeft: 6,
                    }}
                    onPress={() => {
                      openAppStoreUrl(updateData.helpUrl);
                    }}
                  >
                    {updateData.helpUrl}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );

}

export default Splash;