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
  localStorage,
  msgProvider,
  msgText,
  consolepro,
  StatusbarHeight,
} from "../Provider/utilslib/Utils";
import { leftArrow, rightArrow } from "../icons/SvgIcons/Index";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import { Button } from "../components";

export default class OTPPage extends Component {
  _didFocusSubscription;
  _willBlurSubscription;

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      mobile: "",
      password: "",
      device_lang: "AR",
      mobile: "",
      country_name: this.props.route?.params?.country_name || '',
      fcm_token: 123456,
      otp: "",
      modalVisible3: false,
      error_msg: "",
    };
    this._didFocusSubscription = props.navigation.addListener(
      "focus",
      (_payload) =>
        BackHandler.addEventListener("hardwareBackPress", this.handleBackPress)
    );
  }
  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener(
      "blur",
      (_payload) =>
        BackHandler.removeEventListener(
          "hardwareBackPress",
          this.handleBackPress
        )
    );
  }
  handleBackPress = () => {
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

  otpVerify = async () => {
    if (this.state.otp.length <= 0 || this.state.otp.trim().length <= 0) {
      msgProvider.showError(msgText.emptyOtpMsg[config.language]);
      return false;
    }
    let user_details = await localStorage.getItemObject("user_login");

    let item = user_details;
    let url = config.baseURL + "api-patient-registration-otp-check";
    console.log("url", url);
    var data = new FormData();
    data.append("first_name", item.name);
    data.append("email", item.email);
    data.append("phone_number", item.phone_number);
    data.append("id_number", item.id_number);
    data.append("work_area", this.state.country_name);
    data.append("code", this.state.otp);
    data.append("password", item.password);
    data.append("last_name", "");
    data.append("confirm_password", item.confirm_password);
    data.append("device_type", config.device_type);
    data.append("device_lang", this.state.device_lang);
    data.append("fcm_token", this.state.fcm_token);
    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        consolepro.consolelog("obj", obj);
        if (obj.status == true) {
          this.setState({ error_msg: obj.message });

          setTimeout(() => {
            this.setState({ modalVisible3: true });
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
  sendagain = async () => {
    let user_details = await localStorage.getItemObject("user_login");
    let item = user_details;
    let url = config.baseURL + "api-resend-otp";

    var data = new FormData();
    data.append("phone_no", item.phone_number);
    consolepro.consolelog("data", data);

    apifuntion
      .postApi(url, data)
      .then((obj) => {
        consolepro.consolelog("obj", obj);
        if (obj.status == true) {
          setTimeout(() => {
            msgProvider.showSuccess(obj.message);
            // this.props.navigation.navigate("ForgotOTP", { email: email_new });
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
  render() {
    return (


      <View style={{ flex: 1, backgroundColor: Colors.White, paddingTop: StatusbarHeight + 10 }}>

        <KeyboardAwareScrollView
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
                fontFamily: Font.fontmedium,
                textAlign: config.textRotate,
                color: Colors.darkText
              }}>
              {Lang_chg.otp[config.language]}
            </Text>

            <Text
              style={{
                textAlign: config.textRotate,
                fontSize: Font.medium,
                fontFamily: Font.fontregular,
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
                  fontFamily: Font.fontregular,
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

            <Button
              text={Lang_chg.submitbtntext[config.language]}
              // onLoading={this.state.loading}
              onPress={() => this.otpVerify()}
            // isBlank={false}
            />
            <Text
              style={{
                textAlign: config.textRotate,
                fontSize: Font.small,
                fontFamily: Font.fontregular,
                color: Colors.DarkGrey,
                paddingVertical: vs(20)
              }}>
              {Lang_chg.OtpTime[config.language]}
            </Text>
          </View>

          <View style={{ width: '100%', height: 1.5, backgroundColor: Colors.backgroundcolor }}></View>


          {/* <TouchableOpacity
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

                textAlign: config.textalign,
                alignSelf: "center",
              }}
            >
              {Lang_chg.signupbtntext[config.language]}
            </Text>
          </TouchableOpacity> */}

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
                textAlign: config.textalign,
                fontSize: Font.medium,
                fontFamily: Font.fontregular,
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
                fontFamily: Font.fontmedium,
                color: Colors.Blue,
              }}>
              {Lang_chg.sendagaintext[config.language]}
            </Text>
          </View>

        </KeyboardAwareScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible3}
          onRequestClose={() => {
            this.setState({ modalVisible3: false });
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
                      fontFamily: Font.fontmedium,
                      color: "#000",
                      fontSize: (windowWidth * 5) / 100,
                      paddingLeft: (windowWidth * 4) / 100,
                    }}
                  >
                    {Lang_chg.registration[config.language]}
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
                      fontFamily: Font.fontlight,
                      color: "#000",
                      fontSize: (windowWidth * 4) / 100,
                    }}
                  >
                    {this.state.error_msg}
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
                        this.setState({ modalVisible3: false }),
                          this.props.navigation.navigate("Login");
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
                        fontFamily: Font.fontregular,
                        fontSize: (windowWidth * 4) / 100,
                        color: Colors.Theme,
                        alignSelf: "center",
                        textAlign: config.textalign,
                      }}
                    >
                      {Lang_chg.OK[config.language]}
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
}
