import {
  Alert,
  Text,
  View,
  Image,
  Modal,
  TouchableOpacity,
  Linking,
  StatusBar,
} from "react-native";
import React, { Component, useEffect, useState } from "react";
import {
  Colors,
  Icons,
  Font,
  config,
  windowWidth,
  Lang_chg,
  apifuntion,
} from "../Provider/utilslib/Utils";
import HTMLView from "react-native-htmlview";
import messaging from "@react-native-firebase/messaging";
import DeviceInfo from "react-native-device-info";
import { SvgXml } from "react-native-svg";
import { Logo, Splash_Logo } from "../Icons/Index";
import { vs } from "react-native-size-matters";
import { useDispatch, useSelector } from "react-redux";
import { AppLanguage, AppVersion, ContentAlign, DeviceID, DeviceName, DeviceToken, DeviceType } from "../Redux/Actions";


const Splash = ({ navigation }) => {

  const { appLanguage, deviceToken, deviceType, contentAlign, appVersion, loggedInUserDetails } = useSelector(state => state.StorageReducer)
  const dispatch = useDispatch()
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    language: 'AR',
    fcmToken: deviceToken,
    languageIndex: appLanguage == 'ar' ? 1 : 0
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
  })
  const [updateAppModal, setUpdateAppModal] = useState(false)

  useEffect(() => {
    const promise1 = getLanguage();
    const promise2 = requestNotificationPermission();
    const promise3 = getFcmToken();
    const promise4 = getDeviceID();
    const promise5 = getDeviceName();
    const promise6 = getDeviceType();
    const promise7 = getAppVersion();
    Promise.all([promise1, promise2, promise3, promise4, promise5, promise6, promise7]).then((data) => {
      console.log('promises resolved');
    }).catch((error) => {
      console.log(error);
    })

  }, [])

  const requestNotificationPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    console.log({ enabled });
    if (enabled) {
      // console.log("Authorization status:", authStatus);
      getFcmToken();
    }
  };
  const getFcmToken = async () => {
    try {
      const fcmToken = await messaging().getToken()
      if (fcmToken) {
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
        updateAppVersion();
      } else {
        dispatch(AppLanguage('en'))
        dispatch(ContentAlign('left'))
        updateAppVersion();
      }
    } else {
      dispatch(AppLanguage('ar'))
      dispatch(ContentAlign('right'))
      updateAppVersion();
    }
  };

  const updateAppVersion = async () => {
    let language = appLanguage == 'en' ? 'ENG' : 'AR'
    let url = config.baseURL + `api-ios-patient-update?divice_lang=${language}`;
    apifuntion.getApi(url, 1)
      .then((obj) => {
        console.log("updateAppVersion-res...", obj);
        if (obj.status == true) {
          if (parseFloat(obj.result.appVer) > parseFloat(appVersion)) {
            setUpdateData(prevState => ({
              ...prevState,
              appVer: obj.result.appVer,
              updTitle: "<h3>" + obj.result.updTitle + "</h3>",
              updText: "<p>" + obj.result.updText + "</p>",
              skipFlag: obj.result.skipFlag,
              skipText: obj.result.skipText,
              rdrTo: obj.result.rdrTo,
              rdrUrl: obj.result.rdrUrl,
              showHelp: obj.result.showHelp,
              helpTitle: obj.result.helpTitle,
              helpUrl: obj.result.helpUrl,
            }))
            setUpdateAppModal(true)
          } else {
            new_authenticatesessinon();
          }
        } else {
          new_authenticatesessinon();
          return false;
        }
      }).catch((error) => {
        new_authenticatesessinon();
        console.log("updateAppVersion-error ------- " + error);
      });
  };

  const new_authenticatesessinon = async () => {
    if (loggedInUserDetails != null) {
      navigation.reset({
        index: 0,
        routes: [{ name: "DashboardStack" }],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: "AuthStack" }],
      });
    }
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
          {Lang_chg.Splashtext1[loginData.languageIndex]}
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
          {Lang_chg.Splashtext2[loginData.languageIndex]}
        </Text>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={updateAppModal}
        onRequestClose={() => {
          setUpdateAppModal(false)
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
                  alignSelf: "flex-start",
                  width: (windowWidth * 80) / 100,
                  height: (windowWidth * 14) / 100,
                  paddingVertical: (windowWidth * 3) / 100,
                  marginTop: (windowWidth * 2) / 100,
                  paddingLeft: (windowWidth * 4) / 100,
                  flexDirection: "row",
                  //  backgroundColor: 'red'
                }}
              >
                {/* <Image style={{ 
                    width: windowWidth * 6 / 100, 
                    height: windowWidth * 6 / 100 }} source={require('./icons/logo.png')}></Image> */}
                {/* <Text style={{ fontFamily: Font.Medium, color: '#000', fontSize: windowWidth * 5 / 100, paddingLeft: windowWidth * 4 / 100 }}>{this.state.updTitle}</Text> */}
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
                      fontSize: (windowWidth * 4) / 100,
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
                }}
              >
                {updateData.skipFlag && (
                  <TouchableOpacity
                    onPress={() => {
                      setUpdateAppModal(false)
                      new_authenticatesessinon()
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
                )}

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
                    {Lang_chg.Update[loginData.languageIndex]}
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
                    {Lang_chg.Help[loginData.languageIndex]}
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