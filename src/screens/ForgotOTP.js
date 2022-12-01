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
} from "../Provider/utilslib/Utils";

export default class ForgotOTP extends Component {
  _didFocusSubscription;
  _willBlurSubscription;

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: this.props.route.params.email,
      mobile: "",
      password: "",
      device_lang: "AR",
      mobile: "",
      fcm_token: 123456,
      otp: "",
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
      <ScrollView
        style={{ flex: 1, backgroundColor: "White" }}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <View>

          <View style={{ paddingBottom: (windowWidth * 8) / 100 }}>
            <View
              style={{
                width: "95%",
                alignSelf: "center",
                marginTop: (windowWidth * 5) / 100,
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  width: "10%",
                  alignSelf: "center",
                  marginTop: (windowWidth * 25) / 100,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("Login");
                  }}
                  style={{ width: "100%" }}
                >
                  <Image
                    style={{
                      width: (windowWidth * 10) / 100,
                      height: (windowWidth * 10) / 100,
                      resizeMode: "contain",
                    }}
                    source={
                      config.textalign == "right"
                        ? Icons.arabic_back
                        : Icons.backarrow
                    }
                  ></Image>
                </TouchableOpacity>
              </View>
              <View style={{ width: "80%", alignSelf: "center" }}>
                <Image
                  style={{
                    width: (windowWidth * 50) / 100,
                    height: (windowWidth * 40) / 100,
                    alignSelf: "center",
                    resizeMode: "contain",
                  }}
                  source={Icons.Forgotlogo}
                ></Image>
              </View>
            </View>
            <View
              style={{
                width: "90%",
                alignSelf: "center",
                marginTop: (windowWidth * 10) / 100,
              }}
            >
              <Text
                style={{
                  fontSize: Font.headingblack,
                  fontFamily: Font.fontsemibold,
                  textAlign: config.textRotate,
                }}
              >
                {Lang_chg.opt[config.language]}
              </Text>
            </View>

            <View
              style={{
                width: "90%",
                alignSelf: "center",
                marginTop: (windowWidth * 1) / 100,
              }}
            >
              <View style={{ width: "90%" }}>
                <Text
                  style={{
                    fontSize: Font.headinggray,
                    fontFamily: Font.headingfontfamily,
                    color: Colors.DarkGrey,
                    textAlign: config.textRotate,
                  }}
                >
                  {Lang_chg.opttext_forget[config.language]}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: "70%",

                //  paddingHorizontal:windowWidth*1/100,
                paddingVertical: (windowWidth * 1) / 100,
                marginTop: (windowWidth * 10) / 100,
                marginLeft: (windowWidth * 5) / 100,
              }}
            >
              <OTPTextInput
                style={{
                  height: (windowWidth * 14) / 100,
                  width: (windowWidth * 14) / 100,
                  color: "#000",
                  alignSelf: "center",
                  fontFamily: Font.fontregular,
                  fontSize: (windowWidth * 5) / 100,
                  borderWidth: 2,
                  borderColor: "#DFDFDF",
                  borderRadius: (windowWidth * 2) / 100,
                  textAlign: "center",
                }}
                ref={(e) => (this.otpInput = e)}
                numberOfInputs={4}
                cellTextLength={1}
                handleTextChange={(text) => this.setState({ otp: text })}
                keyboardType={"number-pad"}
              />
            </View>
            <View
              style={{
                width: "90%",
                alignSelf: "center",
                marginTop: (windowWidth * 4) / 100,
                flexDirection: "row",
                borderColor:
                  this.state.passwordfocus == true
                    ? Colors.placholderactive
                    : Colors.placeholder_border,
                borderWidth: (windowWidth * 0.3) / 100,
                borderRadius: (windowWidth * 1) / 100,
              }}
            >
              <View style={{ width: "90%", alignSelf: "center" }}>
                <TextInput
                  style={{
                    width: "95%",
                    alignSelf: "center",
                    color: Colors.Black,
                    fontSize: Font.placeholdersize,
                    textAlign: config.textalign,
                    height: (windowWidth * 12) / 100,
                    fontFamily: Font.placeholderfontfamily,
                  }}
                  maxLength={50}
                  placeholder={
                    this.state.passwordfocus != true
                      ? Lang_chg.create_new_pass[config.language]
                      : null
                  }
                  DarkGrey={Colors.DarkGrey}
                  onChangeText={(txt) => {
                    this.setState({ password: txt });
                  }}
                  value={this.state.password}
                  onFocus={() => {
                    this.setState({ passwordfocus: true });
                  }}
                  onBlur={() => {
                    this.setState({
                      passwordfocus: this.state.email.length > 0 ? true : false,
                    });
                  }}
                  returnKeyLabel="done"
                  returnKeyType="done"
                  secureTextEntry={this.state.isSecurePassword}
                />
              </View>
              {this.state.passwordfocus == true && (
                <View
                  style={{
                    position: "absolute",
                    backgroundColor: "White",
                    left: (windowWidth * 4) / 100,
                    top: (-windowWidth * 2) / 100,
                    paddingHorizontal: (windowWidth * 1) / 100,
                  }}
                >
                  <Text
                    style={{ color: "#0057A5", textAlign: config.textalign }}
                  >
                    {Lang_chg.create_new_pass[config.language]}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={{ width: "10%", alignSelf: "center" }}
                onPress={() => {
                  this.setState({
                    isSecurePassword: !this.state.isSecurePassword,
                  });
                }}
              >
                {this.state.isSecurePassword == false ? (
                  <View
                    style={{
                      width: "100%",
                      alignSelf: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Image
                      style={{
                        height: (windowWidth * 6) / 100,
                        width: (windowWidth * 6) / 100,
                      }}
                      source={require("../icons/eye-icon.png")}
                    ></Image>
                  </View>
                ) : (
                  <View
                    style={{
                      width: "100%",
                      alignSelf: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Image
                      style={{
                        height: (windowWidth * 6) / 100,
                        width: (windowWidth * 6) / 100,
                      }}
                      source={require("../icons/eye-icon02.png")}
                    />
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: "89%",
                alignSelf: "center",
                marginTop: (windowWidth * 0.5) / 100,
              }}
            >
              <Text
                style={{
                  textAlign: config.textRotate,
                  fontSize: Font.textsize,
                  fontFamily: Font.headingfontfamily,
                  color: Colors.lightGrey,
                }}
              >
                {Lang_chg.Signuptext3[config.language]}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                this.otpVerify();
              }}
              style={{
                width: "90%",
                alignSelf: "center",
                borderRadius: (windowWidth * 2) / 100,
                backgroundColor: Colors.Theme,
                paddingVertical: (windowWidth * 4) / 100,
                marginTop: (windowWidth * 6) / 100,
                shadowColor: "#000",
                shadowOffset: { width: 1, height: 1 },
                shadowOpacity: 0.5,
                shadowRadius: 2,
                elevation: 3,
              }}
            >
              <Text
                style={{
                  color: Colors.White,
                  fontFamily: Font.fontmedium,
                  fontSize: Font.buttontextsize,
                  alignSelf: "flex-end",
                  textAlign: config.textalign,
                  alignSelf: "center",
                }}
              >
                {Lang_chg.submitbtntext[config.language]}
              </Text>
            </TouchableOpacity>

            <View
              style={{
                width: "89%",
                alignSelf: "center",
                marginTop: (windowWidth * 5) / 100,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  textAlign: config.textalign,
                  fontSize: (windowWidth * 4) / 100,
                  fontFamily: Font.headingfontfamily,
                  color: Colors.lightGrey,
                }}
              >
                {Lang_chg.notrectext[config.language]}
              </Text>
              <Text
                onPress={() => {
                  this.sendagain();
                }}
                style={{
                  textAlign: config.textalign,
                  fontSize: (windowWidth * 4) / 100,
                  fontFamily: Font.fontsemibold,
                  color: Colors.Theme,
                }}
              >
                {Lang_chg.sendagaintext[config.language]}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}
