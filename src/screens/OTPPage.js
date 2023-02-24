import {
  Text,
  View,
  Modal,
  BackHandler,
  Alert,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  Platform,
  Keyboard,
} from "react-native";
import React, { Component, useEffect, useRef, useState } from "react";
import OTPTextInput from "react-native-otp-textinput";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Colors,
  Icons,
  Font,
  config,
  windowWidth,
  LangProvider,
  apifuntion,
  msgProvider,
  Button
} from "../Provider/Utils/Utils";
import { leftArrow, rightArrow } from "../Icons/Index";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import { Address, Guest, UserDetails } from "../Redux/Actions";

const OTPPage = ({ navigation, route }) => {

  const {
    id_number,
    password,
    confirm_password,
    phone_number,
    name,
    email,
    work_area,
    country_name
  } = route?.params

  const { appLanguage, deviceToken, deviceType, contentAlign, languageIndex, address } = useSelector(state => state.StorageReducer)
  const dispatch = useDispatch()
  const [otpData, setOtpData] = useState({
    otpSuccessModal: false,
    message: "",
    otp: '',
    status: false,
    isLoading: false
  })
  const otpRef = useRef()
  const insets = useSafeAreaInsets()
  useEffect(() => {
    navigation.addListener('focus', payload => {
      console.log('event is registered...');
      return BackHandler.addEventListener('hardwareBackPress', handleBackPress)
    }
    );
    navigation.addListener('blur', payload => {
      console.log('event is removed...');
      return BackHandler.removeEventListener('hardwareBackPress', handleBackPress)
    }
    );
  }, [])

  const handleBackPress = () => {
    Alert.alert(
      "Exit App",
      "Do you want to exit app",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "Yes",
        },
        {
          text: "Yes",
          onPress: () => BackHandler.exitApp(),
        },
      ],
      {
        cancelable: false,
      }
    ); // works best when the goBack is async
    return true;
  };

  const otpVerify = async () => {
    Keyboard.dismiss()
    if (otpData.otp.length <= 0 || otpData.otp.trim().length <= 0) {
      msgProvider.showError(LangProvider.emptyOtpMsg[languageIndex]);
      return false;
    }
    setOtpData(prevState => ({
      ...prevState,
      isLoading: true
    }))
    let url = config.baseURL + "api-patient-registration-otp-check";
    var data = new FormData();
    data.append("first_name", name);
    data.append("email", email);
    data.append("phone_number", phone_number);
    data.append("id_number", id_number);
    data.append("work_area", country_name);
    data.append("code", otpData.otp);
    data.append("password", password);
    data.append("last_name", "");
    data.append("confirm_password", confirm_password);
    data.append("device_type", deviceType);
    data.append("device_lang", appLanguage == 'en' ? 'ENG' : 'AR');
    data.append("fcm_token", deviceToken);
    console.log("otpVerify-------", data);
    // return
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        setOtpData(prevState => ({
          ...prevState,
          isLoading: false
        }))
        console.log("otpVerify-------", obj);
        if (obj.status == true) {
          UpdateAddress(obj?.result?.user_id)
          dispatch(UserDetails(obj?.result))
          setTimeout(() => {
            setOtpData(prevState => ({
              ...prevState,
              otpSuccessModal: true,
              message: obj?.message
            }))
          }, 500);
        } else {
          setTimeout(() => {
            msgProvider.showError(obj?.message);
          }, 500);
          return false;
        }
      })
      .catch((error) => {
        setOtpData(prevState => ({
          ...prevState,
          isLoading: false
        }))
        console.log("otpVerify-error ------- ", error);
      });
  };

  const UpdateAddress = async (userId) => {

    let url = config.baseURL + "api-patient-address-update";
    var data = new FormData();
    data.append("user_id", userId);
    data.append("current_address", address.address);
    data.append("lat", address.latitude);
    data.append("lng", address.longitude);
    data.append("landmark", '');
    data.append("building_name", '');
    data.append("title", '');
    data.append("default", '0');

    console.log(data);
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        console.log("updateAddress-res----", obj);
        let newAddressDetails = null
        if (obj.status == true) {
          newAddressDetails = {
            latitude: obj?.result?.latitude,
            longitude: obj?.result?.longitudes,
            address: obj?.result?.current_address,
            isAddressAdded: true
          }
          dispatch(Address(newAddressDetails))
        } else {
          newAddressDetails = {
            latitude: '',
            longitude: '',
            address: '',
            isAddressAdded: false
          }
          dispatch(Address(newAddressDetails))
          return false;
        }
      }).catch((error) => {
        console.log("UpdateAddress-error ------- " + error);
      });
  };

  const loginUser = () => {
    dispatch(Guest(false))
    setOtpData(prevState => ({
      ...prevState,
      otpSuccessModal: false,
    }))
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: "DashboardStack" }],
      });
    }, 700);
  }
  const sendagain = async () => {

    let url = config.baseURL + "api-resend-otp";
    var data = new FormData();
    data.append("phone_no", phone_number);
    console.log(data);
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        console.log("sendagain: ", obj);
        if (obj.status == true) {
          msgProvider.showSuccess(obj.message);
        } else {
          msgProvider.showError(obj.message);
          return false;
        }
      }).catch((error) => {
        console.log("sendagain-error ------- ", error);
      });
  };

  return (
    <View
      pointerEvents={otpData.isLoading ? 'none' : 'auto'}
      style={{ flex: 1, backgroundColor: Colors.White, paddingTop: insets.top, paddingBottom: insets.bottom }}>

      <KeyboardAwareScrollView
        // keyboardOpeningTime={200}
        extraScrollHeight={50}
        enableOnAndroid={true}
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{
          justifyContent: 'center',
          paddingBottom: vs(50),
        }}
        showsVerticalScrollIndicator={false}>

        <View
          style={{
            width: "100%",
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: vs(40),
          }}>
          <View style={{ justifyContent: 'center' }}>
            {/* <SvgXml xml={Logo} /> */}
            <Image source={Icons.logo} style={{ height: windowWidth - 297, height: windowWidth - 297 }} resizeMode='contain' />

          </View>

          <TouchableHighlight
            underlayColor={Colors.Highlight}
            onPress={() => {
              navigation.pop();
            }}
            style={{ position: 'absolute', left: 0, height: vs(40), width: s(40), justifyContent: 'center', alignItems: 'center' }}
          >
            <SvgXml xml={contentAlign == "right" ? rightArrow : leftArrow} height={vs(17.11)} width={s(9.72)} />
          </TouchableHighlight>
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
              textAlign: contentAlign,
              color: Colors.darkText
            }}>
            {LangProvider.otp[languageIndex]}
          </Text>

          <Text
            style={{
              textAlign: contentAlign,
              fontSize: Font.medium,
              fontFamily: Font.Regular,
              color: Colors.inActiveText,
              marginTop: vs(4)
            }}>
            {LangProvider.otptext[languageIndex]}
          </Text>


          <View style={{ marginTop: vs(25) }}>
            <OTPTextInput
              style={{
                height: (windowWidth * 14) / 100,
                width: (windowWidth * 20) / 100,
                color: "#000",
                alignSelf: "center",
                fontFamily: Font.Regular,
                fontSize: (windowWidth * 5) / 100,
                borderWidth: 2,
                borderColor: Colors.Border,
                borderRadius: (windowWidth * 2) / 100,
                textAlign: "center",
              }}
              ref={otpRef}
              numberOfInputs={4}
              cellTextLength={1}
              handleTextChange={(val) => {
                setOtpData(prevState => ({
                  ...prevState,
                  otp: val
                }))
              }}
              tintColor={Colors.Blue}
              offTintColor="#f5f5ff"
              keyboardType={"number-pad"}
              backgroundColor={Colors.backgroundcolor}
            />
          </View>

          <Button
            text={LangProvider.submitbtntext[languageIndex]}
            onPress={() => otpVerify()}
            btnStyle={{ marginTop: vs(30) }}
            onLoading={otpData.isLoading}
          />
          <Text
            style={{
              textAlign: contentAlign,
              fontSize: Font.small,
              fontFamily: Font.Regular,
              color: Colors.DarkGrey,
              paddingVertical: vs(20)
            }}>
            {LangProvider.OtpTime[languageIndex]}
          </Text>
        </View>

        <View style={{ width: '100%', height: 1.5, backgroundColor: Colors.backgroundcolor }}></View>

        <View
          style={{
            width: "90%",
            alignSelf: "center",
            marginTop: vs(18),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              textAlign: contentAlign,
              fontSize: Font.medium,
              fontFamily: Font.Regular,
              color: Colors.DarkGrey,
            }} >
            {LangProvider.notrectext[languageIndex]}
          </Text>
          <Text
            onPress={() => {
              sendagain();
            }}
            style={{
              textAlign: contentAlign,
              fontSize: Font.medium,
              fontFamily: Font.Medium,
              color: Colors.Blue,
            }}>
            {LangProvider.sendagaintext[languageIndex]}
          </Text>
        </View>

      </KeyboardAwareScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={otpData.otpSuccessModal}
        onRequestClose={() => {
          setOtpData(prevState => ({
            ...prevState,
            otpSuccessModal: false
          }))
        }}
      >
        <View
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
                  paddingVertical: (windowWidth * 3) / 100,
                  marginTop: (windowWidth * 2) / 100,
                  paddingLeft: (windowWidth * 4) / 100,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  style={{
                    width: (windowWidth * 6) / 100,
                    height: (windowWidth * 6) / 100,
                  }}
                  source={Icons.logoPlain}
                />
                <Text
                  style={{
                    fontFamily: Font.Medium,
                    color: "#000",
                    fontSize: (windowWidth * 5) / 100,
                    paddingLeft: (windowWidth * 4) / 100,
                  }}
                >
                  {LangProvider.registration[languageIndex]}
                </Text>
              </View>

              <View
                style={{
                  paddingLeft: (windowWidth * 4) / 100,
                  width: "95%",
                  alignSelf: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: Font.Light,
                    color: "#000",
                    fontSize: (windowWidth * 4) / 100,
                  }}
                >
                  {otpData.message}
                </Text>
              </View>

              <View
                style={{
                  paddingBottom: (windowWidth * 5) / 100,
                  marginTop: (windowWidth * 9) / 100,
                  alignSelf: "flex-end",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setTimeout(() => {
                      loginUser()
                    }, 200);
                  }}
                  style={{
                    width: (windowWidth * 15) / 100,
                    flexDirection: "row",
                    alignSelf: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Font.Regular,
                      fontSize: (windowWidth * 4) / 100,
                      color: Colors.Theme,
                      alignSelf: "center",
                      textAlign: contentAlign,
                    }}
                  >
                    {LangProvider.OK[languageIndex]}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

    </View>

  );

}

export default OTPPage;
