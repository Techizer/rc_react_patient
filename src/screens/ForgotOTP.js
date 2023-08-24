import {
  Text,
  View,
  BackHandler,
  Alert,
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
  apifuntion,
  msgProvider,
  LangProvider,
  Button
} from "../Provider/Utils/Utils";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import { leftArrow, rightArrow } from "../Icons/Index";
import AuthInputBoxSec from "../Components/AuthInputBoxSec";
import { useSelector } from "react-redux";

const ForgotOTP = ({ navigation, route }) => {

  const { appLanguage, contentAlign,languageIndex } = useSelector(state => state.StorageReducer)

  const [forgotOtpData, setForgotOtpData] = useState({
    email: route?.params?.email || '',
    password: "",
    otp: "",
    isSecurePassword: true,
    isLoading: false
  })
  const passRef = useRef()
  const otpRef = useRef()
  const insets = useSafeAreaInsets()
  
  useEffect(() => {
    navigation.addListener('focus', payload =>
      {
        console.log('event is registered...');
       return BackHandler.addEventListener('hardwareBackPress', handleBackPress)
      }
    );
    navigation.addListener('blur', payload =>
      {
        console.log('event is removed...');
        return BackHandler.removeEventListener('hardwareBackPress', handleBackPress)
      }
    );
  }, [])

  const handleBackPress = () => {
    Alert.alert(
      "Exit App",
      "Do you want to goback",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "Yes",
        },
        {
          text: "Yes",
          onPress: () => navigation.reset({
            index: 0,
            routes: [{ name: "AuthStack" }],
          })
        },
      ],
      {
        cancelable: false,
      }
    ); // works best when the goBack is async
    return true;
  };

  const sendagain = async () => {
    let regemail =
      /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (forgotOtpData.email == '' || forgotOtpData.email == null || forgotOtpData.email == undefined) {
      msgProvider.showError(LangProvider.emptyEmail[languageIndex]);
      return false;
    }

    if (regemail.test(forgotOtpData.email) !== true) {
      msgProvider.showError(LangProvider.validEmail[languageIndex]);
      return false;
    }
    let url = config.baseURL + "api-forgot-password-email";

    var data = new FormData();
    data.append("emailId", forgotOtpData.email);

    apifuntion
      .postApi(url, data)
      .then((obj) => {
        if (obj.status == true) {
          setTimeout(() => {
            msgProvider.showSuccess(obj.message);
            //  this.props.navigation.navigate("ForgotOTP", { email: email_new });
          }, 300);
        } else {
          setTimeout(() => {
            msgProvider.showError(obj.message);
          }, 300);
          return false;
        }
      })
      .catch((error) => {
        console.log("sendagain-error ------- " + error);
      });
  };

  const otpVerify = async () => {
    Keyboard.dismiss()

    if (forgotOtpData.password == '' || forgotOtpData.password == null || forgotOtpData.password == undefined) {
      msgProvider.showError(LangProvider.emptyPasswordblank[languageIndex]);
      return false;
    }
    if (forgotOtpData.password.length < 8) {
      msgProvider.showError(LangProvider.emptyPasswordValid[languageIndex]);
      return false;
    }

    setForgotOtpData(prevState => ({
      ...prevState,
      isLoading: true
    }))
    let url = config.baseURL + "api-forgot-change-password";

    var data = new FormData();

    data.append("emailId", forgotOtpData.email);
    data.append("code", forgotOtpData.otp);
    data.append("password", forgotOtpData.password);

    console.log("data", data);
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        // console.log("obj", obj);
        setForgotOtpData(prevState => ({
          ...prevState,
          isLoading: false
        }))
        if (obj.status == true) {
          setTimeout(() => {
            msgProvider.showSuccess(obj.message);
            navigation.reset({
              index: 0,
              routes: [{ name: "AuthStack" }],
            })
          }, 500);
        } else {
          setTimeout(() => {
            msgProvider.showError(obj.message);
          }, 500);
          return false;
        }
      })
      .catch((error) => {
        setForgotOtpData(prevState => ({
          ...prevState,
          isLoading: false
        }))
        console.log("otpVerify-error ------- " + error);
      });
  };

  return (

    <View
      pointerEvents={forgotOtpData.isLoading ? 'none' : 'auto'}
      style={{ flex: 1, backgroundColor: Colors.White,  paddingTop: insets.top, paddingBottom: insets.bottom }}>
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
              alignSelf: 'flex-start',
              color: Colors.darkText
            }}>
            {LangProvider.otp[languageIndex]}
          </Text>

          <Text
            style={{
              alignSelf: 'flex-start',
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
                setForgotOtpData(prevState => ({
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

          <AuthInputBoxSec
            mainContainer={{ marginTop: vs(8), width: "100%", }}
            lableText={LangProvider.create_new_pass[languageIndex]}
            inputRef={passRef}
            onChangeText={(val) => {
              setForgotOtpData(prevState => ({
                ...prevState,
                password: val
              }))
            }}
            value={forgotOtpData.password}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="next"
            returnKeyType="done"
            secureTextEntry={forgotOtpData.isSecurePassword}
            disableImg={true}
            iconName={forgotOtpData.isSecurePassword ? "eye-off" : "eye"}
            iconPressAction={() => {
              setForgotOtpData(prevState => ({
                ...prevState,
                isSecurePassword: !isSecurePassword
              }))
            }}
            onSubmitEditing={() => {
              // this.signup_click()
            }}
            editable
          />

          <Text
            style={{
              alignSelf: 'flex-start',
              fontSize: Font.xsmall,
              fontFamily: Font.Regular,
              color: Colors.lightGrey,
              marginTop: vs(8)
            }}
          >
            {LangProvider.Signuptext3[languageIndex]}
          </Text>

          <Button
            text={LangProvider.submitbtntext[languageIndex]}
            onPress={() => otpVerify()}
            btnStyle={{ marginTop: vs(30) }}
            onLoading={forgotOtpData.isLoading}
          />
          <Text
            style={{
              textAlign: 'center',
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
          }} >
          <Text
            style={{
              alignSelf: 'flex-start',
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
              alignSelf: 'flex-start',
              fontSize: Font.medium,
              fontFamily: Font.Medium,
              color: Colors.Blue,
            }}>
            {LangProvider.sendagaintext[languageIndex]}
          </Text>
        </View>





      </KeyboardAwareScrollView>
    </View>

  );

}

export default ForgotOTP;