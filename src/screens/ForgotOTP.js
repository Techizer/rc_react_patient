import {
  Text,
  View,
  BackHandler,
  Alert,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  TouchableHighlight,
} from "react-native";
import React, { Component } from "react";
import OTPTextInput from "react-native-otp-textinput";
import {
  Colors,
  Icons,
  Font,
  config,
  windowWidth,
  Lang_chg,
  apifuntion,
  msgProvider,
  msgText,
  consolepro,
  StatusbarHeight,
} from "../Provider/utilslib/Utils";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import { leftArrow, rightArrow } from "../icons/SvgIcons/Index";
import { AuthInputBoxSec, Button } from "../components";

export default class ForgotOTP extends Component {
  _didFocusSubscription;
  _willBlurSubscription;

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: this.props?.route?.params?.email || '',
      mobile: "",
      password: "",
      device_lang: "AR",
      mobile: "",
      fcm_token: 123456,
      otp: "",
      isSecurePassword: true,
    };
    this._didFocusSubscription = props.navigation.addListener(
      "focus",
      (payload) =>
        BackHandler.addEventListener("hardwareBackPress", this.handleBackPress)
    );
  }
  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener(
      "blur",
      (payload) =>
        BackHandler.removeEventListener(
          "hardwareBackPress",
          this.handleBackPress
        )
    );
  }
  handleBackPress = () => {
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
          onPress: () => this.props.navigation.navigate("Login"),
        },
      ],
      {
        cancelable: false,
      }
    ); // works best when the goBack is async
    return true;
  };

  sendagain = async () => {
    let regemail =
      /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (this.state.email.length <= 0 || this.state.email.trim().length <= 0) {
      msgProvider.showError(msgText.emptyEmail[config.language]);
      return false;
    }

    if (regemail.test(this.state.email) !== true) {
      msgProvider.showError(msgText.validEmail[config.language]);
      return false;
    }
    let email_new = this.state.email;
    let url = config.baseURL + "api-forgot-password-email";

    var data = new FormData();
    data.append("emailId", this.state.email);
    consolepro.consolelog("data", data);

    apifuntion
      .postApi(url, data)
      .then((obj) => {
        consolepro.consolelog("obj", obj);
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
        consolepro.consolelog("-------- error ------- " + error);
        this.setState({ loading: false });
      });
  };

  otpVerify = async () => {
    if (
      this.state.password.length <= 0 ||
      this.state.password.trim().length <= 0
    ) {
      msgProvider.showError(msgText.emptyPasswordblank[config.language]);
      return false;
    }
    if (this.state.password.length < 8) {
      msgProvider.showError(msgText.emptyPasswordValid[config.language]);
      return false;
    }

    let url = config.baseURL + "api-forgot-change-password";

    var data = new FormData();

    data.append("emailId", this.state.email);

    data.append("code", this.state.otp);
    data.append("password", this.state.password);

    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        consolepro.consolelog("obj", obj);
        if (obj.status == true) {
          setTimeout(() => {
            msgProvider.showSuccess(obj.message);
            this.props.navigation.navigate("Login");
          }, 500);
        } else {
          setTimeout(() => {
            msgProvider.showError(obj.message);
          }, 500);
          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
        this.setState({ loading: false });
      });
  };
  render() {
    return (

      <View
        style={{ flex: 1, backgroundColor: Colors.White, paddingTop: StatusbarHeight }}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{
            justifyContent: 'center',
            paddingBottom: vs(30),
          }}
          showsVerticalScrollIndicator={false} >

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
                this.props.navigation.pop();
              }}
              style={{ position: 'absolute', left: 0, height: vs(40), width: s(40), justifyContent: 'center', alignItems: 'center' }}
            >
              <SvgXml xml={
                config.textalign == "right"
                  ? rightArrow : leftArrow
              } height={vs(17.11)} width={s(9.72)} />
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
                textAlign: config.textRotate,
                color: Colors.darkText
              }}>
              {Lang_chg.otp[config.language]}
            </Text>

            <Text
              style={{
                textAlign: config.textRotate,
                fontSize: Font.medium,
                fontFamily: Font.Regular,
                color: Colors.inActiveText,
                marginTop: vs(4)
              }}>
              {Lang_chg.otptext[config.language]}
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
                ref={(e) => (this.otpInput = e)}
                numberOfInputs={4}
                cellTextLength={1}
                handleTextChange={(text) => this.setState({ otp: text })}
                tintColor={Colors.Blue}
                offTintColor="#f5f5ff"
                keyboardType={"number-pad"}
                backgroundColor={Colors.backgroundcolor}
              />
            </View>

            <AuthInputBoxSec
              mainContainer={{ marginTop: vs(8), width: "100%", }}
              lableText={this.state.passwordfocus != true
                ? Lang_chg.create_new_pass[config.language]
                : null}
              // inputRef={(ref) => {
              //   this.confirmInput = ref;
              // }}
              onChangeText={(val) => this.setState({ password: val })}
              value={this.state.password}
              keyboardType="default"
              autoCapitalize="none"
              returnKeyLabel="next"
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
                // this.signup_click()
              }}
              editable
            />

            <Text
              style={{
                textAlign: config.textRotate,
                fontSize: Font.textsize,
                fontFamily: Font.Regular,
                color: Colors.lightGrey,
                marginTop: vs(8)
              }}
            >
              {Lang_chg.Signuptext3[config.language]}
            </Text>

          <Button
              text={Lang_chg.submitbtntext[config.language]}
              onPress={() => this.otpVerify()}
              btnStyle={{ marginTop: vs(30) }}
            />
            <Text
              style={{
                textAlign: config.textRotate,
                fontSize: Font.small,
                fontFamily: Font.Regular,
                color: Colors.DarkGrey,
                paddingVertical: vs(20)
              }}>
              {Lang_chg.OtpTime[config.language]}
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
                textAlign: config.textalign,
                fontSize: Font.medium,
                fontFamily: Font.Regular,
                color: Colors.DarkGrey,
              }} >
              {Lang_chg.notrectext[config.language]}
            </Text>
            <Text
              onPress={() => {
                this.sendagain();
              }}
              style={{
                textAlign: config.textalign,
                fontSize: Font.medium,
                fontFamily: Font.Medium,
                color: Colors.Blue,
              }}>
              {Lang_chg.sendagaintext[config.language]}
            </Text>
          </View>

          

          

        </KeyboardAwareScrollView>
      </View>

    );
  }
}
