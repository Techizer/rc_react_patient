import {
  Keyboard,
  FlatList,
  Modal,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  StatusBar,
  Platform,
} from "react-native";
import React, { Component } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Colors,
  Icons,
  Font,
  localStorage,
  config,
  windowWidth,
  Lang_chg,
  apifuntion,
  consolepro,
  msgProvider,
  msgText,
  StatusbarHeight,
} from "../Provider/utilslib/Utils";
import { AuthInputBoxSec, Button } from "../components";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import { leftArrow, Logo, rightArrow } from "../icons/SvgIcons/Index";

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSecurePassword: true,
      isSecurePassword1: true,
      namefocus: false,
      name: "",
      emailfocus: false,
      email: "",
      numberfocus: false,
      number: "",
      idfocus: false,
      id: "",
      country_name: "",
      passwordfocus: false,
      password: "",
      confirmpasswordfocus: false,
      confirm: "",
      device_lang: "AR",
      mobile: "",
      fcm_token: 123456,
      modalVisible3: false,
      error_msg: "",
      country_codefocus: false,
      country_code: "",
      bloodModal: false,
      country_short_code: "",
    };
  }
  componentDidMount() {
    // this.getnotification();

    this.props.navigation.addListener("focus", () => {
      this.get_all_count();
    });
  }
  signup_click = async () => {
    Keyboard.dismiss();

    var email = this.state.email.trim();
    var num = this.state.id;
    var digits = num.toString().split("");
    var realDigits = digits.map(Number);
    console.log("realDigits", realDigits[0]);

    if (this.state.name.length <= 0 || this.state.name.trim().length <= 0) {
      msgProvider.showError(msgText.emptyName[config.language]);
      return false;
    }

    let regemail =
      /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (email <= 0) {
      msgProvider.showError(msgText.emptyEmail[config.language]);
      return false;
    }

    if (regemail.test(email) !== true) {
      msgProvider.showError(msgText.validEmail[config.language]);
      return false;
    }
    if (
      this.state.country_code.length <= 0 ||
      this.state.country_code.trim().length <= 0
    ) {
      msgProvider.showError(msgText.emptyCountrycode[config.language]);
      return false;
    }

    if (this.state.mobile.length <= 0 || this.state.mobile.trim().length <= 0) {
      msgProvider.showError(msgText.emptymobileNumber[config.language]);
      return false;
    }
    if (this.state.id.length <= 0 || this.state.id.trim().length <= 0) {
      msgProvider.showError(msgText.emptyid[config.language]);
      return false;
    }
    if (this.state.country_short_code == "UAE") {
      if (
        realDigits[0] == 0 ||
        realDigits[0] == 1 ||
        realDigits[0] == 2 ||
        realDigits[0] == 3 ||
        realDigits[0] == 4 ||
        realDigits[0] == 5 ||
        realDigits[0] == 6 ||
        realDigits[0] == 8 ||
        realDigits[0] == 9
      ) {
        msgProvider.showError(msgText.validIDnumberUAE[config.language]);
        return false;
      }
    } else {
      if (
        realDigits[0] == 0 ||
        realDigits[0] == 3 ||
        realDigits[0] == 4 ||
        realDigits[0] == 5 ||
        realDigits[0] == 6 ||
        realDigits[0] == 7 ||
        realDigits[0] == 8 ||
        realDigits[0] == 9
      ) {
        msgProvider.showError(msgText.validIDnumber[config.language]);
        return false;
      }
    }

    if (this.state.id.length <= 9) {
      msgProvider.showError(msgText.emptyIdValid[config.language]);
      return false;
    }

    let password = this.state.password;
    if (password.length <= 0) {
      msgProvider.showError(msgText.validataionnewpass[config.language]);
      return false;
    }
    if (password.length <= 7) {
      msgProvider.showError(msgText.emptyPasswordValid[config.language]);
      return false;
    }
    let confirmpass = this.state.confirm;
    if (confirmpass.length <= 0) {
      msgProvider.showError(msgText.emptyconfirmPassword[config.language]);
      return false;
    }
    if (confirmpass.length <= 7) {
      msgProvider.showError(msgText.emptyPasswordValid[config.language]);
      return false;
    }

    if (confirmpass != password) {
      msgProvider.showError(msgText.Password_notmatch[config.language]);
      return false;
    }

    let url = config.baseURL + "api-patient-registration-otp-send";
    console.log("url", url);
    var phone_number_send = this.state.country_code + this.state.mobile;
    var data = new FormData();
    data.append("first_name", this.state.name);
    data.append("email", this.state.email);
    data.append("phone_number", phone_number_send);
    data.append("work_area", this.state.country_name);
    data.append("id_number", this.state.id);
    data.append("last_name", "");
    data.append("password", this.state.password);
    data.append("confirm_password", this.state.confirm);
    data.append("device_type", config.device_type);
    data.append("device_lang", this.state.device_lang);
    data.append("fcm_token", this.state.fcm_token);
    // data.append('player_id', player_id_me1)
    // console.log('player_id_me1',player_id_me1)

    consolepro.consolelog("data", data);

    apifuntion
      .postApi(url, data)
      .then((obj) => {
        consolepro.consolelog("obj", obj);
        console.log("obj mess", obj.message);
        if (obj.status == true) {
          // var user_details = obj.user_details;
          const uservalue = {
            id_number: this.state.id,
            confirm_password: this.state.confirm,
            phone_number: phone_number_send,
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            work_area: this.state.country_short_code,
          };
          localStorage.setItemObject("user_login", uservalue);

          setTimeout(() => {
            this.setState({
              error_msg: obj.message,
              status_new: obj.status,
              modalVisible3: true,
            });
            // this.props.navigation.navigate('OTPPage')
          }, 500);
        } else {
          // if (obj.active_status == 0 || obj.msg == msgTitle.user_not_exist[config.language]) {
          //   setTimeout(() => {
          //     msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
          //   }, 200)
          //   config.checkUserDeactivate(this.props.navigation)
          // } else {
          setTimeout(() => {
            this.setState({
              error_msg: obj.message,
              status_new: obj.status,
              modalVisible3: true,
            });
          }, 200);
          // }
          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
        this.setState({ loading: false });
      });
  };

  get_all_count = async () => {
    let url = config.baseURL + "api-medical-service-area";
    console.log("url", url);
    // var data = new FormData();
    // data.append('login_user_id',user_id)

    // consolepro.consolelog('data', data)
    apifuntion
      .getApi(url, 1)
      .then((obj) => {
        consolepro.consolelog("obj", obj);
        if (obj.status == true) {
          this.setState({
            Countryarr: obj.result,
            country_name: obj.result[0].name,
            country_code: obj.result[0].country_code,
            country_short_code: obj.result[0].country_short_code,
          });
          console.log("get area", obj.result);
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log("-------- error ------- " + error);
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
                fontFamily: Font.Medium,
                textAlign: config.textRotate,
                color: Colors.darkText
              }}>
              {Lang_chg.Signup[config.language]}
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
              {Lang_chg.Signuptext1[config.language]}
            </Text>


            {/* ---------------------------------------------------------------------fullname */}

            <AuthInputBoxSec
              mainContainer={{ marginTop: vs(18), width: '100%' }}
              lableText={Lang_chg.textinputname[config.language]}
              inputRef={(ref) => {
                this.nameInput = ref;
              }}
              onChangeText={(text) => this.setState({ name: text })}
              value={this.state.name}
              keyboardType="default"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => {
                this.emailInput.focus();
              }}
              editable
            />


            {/* -----------------------------------------------------------------------------------email */}

            <AuthInputBoxSec
              mainContainer={{ marginTop: vs(8), width: '100%' }}
              lableText={Lang_chg.textinputemails[config.language]}
              inputRef={(ref) => {
                this.emailInput = ref;
              }}
              onChangeText={(text) => this.setState({ email: text })}
              value={this.state.email}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => {
                this.mobileInput.focus();
              }}
              editable
            />

            {/* -----------------------------------------------------------------------------Country Picker- */}


            <TouchableOpacity
              onPress={() => {
                this.setState({ bloodModal: true });
              }}
              style={{
                width: "100%",
                height: 48,
                alignSelf: "center",
                borderColor: Colors.Border,
                borderWidth: 1,
                backgroundColor: Colors.backgroundcolor,
                borderRadius: (windowWidth * 1) / 100,
                justifyContent: 'center',
                marginTop: vs(13),
              }}>
              <View
                style={{
                  width: "95%",
                  alignSelf: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }} >
                <Text
                  style={{
                    fontSize: (windowWidth * 3.7) / 100,
                    fontFamily: Font.Regular,
                    textAlign: config.textRotate,
                  }}>
                  {this.state.country_name.length <= 0
                    ? Lang_chg.select[config.language]
                    : this.state.country_name}
                </Text>

                <View style={{ width: "20%", alignSelf: "center" }}>
                  <Image
                    style={{
                      height: (windowWidth * 4) / 100,
                      width: (windowWidth * 4) / 100,
                      alignSelf: "flex-end",
                    }}
                    source={Icons.downarrow}
                  ></Image>
                </View>
              </View>
            </TouchableOpacity>


            {/* -----------------------------------------------------------------------------no- */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                alignSelf: "center",
                marginTop: vs(4)
              }}>
              <View
                style={{
                  width: "20%",
                }}>
                <AuthInputBoxSec
                  mainContainer={{ width: "100%", }}
                  lableText={Lang_chg.CC_code[config.language]}
                  inputRef={(ref) => {
                    this.country_codeInput = ref;
                  }}
                  onChangeText={(text) =>
                    this.setState({ country_code: text })
                  }
                  maxLength={3}
                  editable={false}
                  value={this.state.country_code}
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    //this.passwordInput.focus();
                  }}
                />
              </View>

              <View
                style={{
                  width: "78%",
                  alignSelf: "center",
                }}>
                <AuthInputBoxSec
                  mainContainer={{ width: '100%' }}
                  lableText={Lang_chg.textinputnumber[config.language]}
                  inputRef={(ref) => {
                    this.mobileInput = ref;
                  }}
                  onChangeText={(text) => this.setState({ mobile: text })}
                  value={this.state.mobile}
                  keyboardType="number-pad"
                  maxLength={9}
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    this.idInput.focus();
                  }}
                  editable
                />

                <Text
                  style={{
                    textAlign: config.textRotate,
                    fontSize: Font.textsize,
                    fontFamily: Font.headingfontfamily,
                    color: Colors.lightGrey,
                    marginTop: vs(8)
                  }}>
                  {Lang_chg.mobletexttitle[config.language]}
                </Text>
              </View>
            </View>
            {/* ---------------------------------------------------------------------------idno */}


            <AuthInputBoxSec
              mainContainer={{ marginTop: vs(8), width: "100%", }}
              // icon={layer9_icon}
              lableText={Lang_chg.textinputnationalid[config.language]}
              inputRef={(ref) => {
                this.idInput = ref;
              }}
              onChangeText={(text) => this.setState({ id: text })}
              value={this.state.id}
              keyboardType="number-pad"
              maxLength={15}
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => {
                this.passwordInput.focus();
              }}
              editable
            />



            {/* --------------------------------------------------------------------------------text */}


            {this.state.country_short_code == "UAE" ? (
              <Text
                style={{
                  textAlign: config.textRotate,
                  fontSize: Font.textsize,
                  fontFamily: Font.headingfontfamily,
                  color: Colors.lightGrey,
                  marginTop: vs(8)
                }}
              >
                {Lang_chg.ProvideUAE[config.language]}
              </Text>
            ) : (
              <Text
                style={{
                  textAlign: config.textRotate,
                  fontSize: Font.textsize,
                  fontFamily: Font.headingfontfamily,
                  color: Colors.lightGrey,
                  marginTop: vs(8)
                }}
              >
                {Lang_chg.Signuptext2[config.language]}
              </Text>
            )}
            {/* ------------------------------------------------------password */}


            <AuthInputBoxSec
              mainContainer={{ marginTop: vs(5), width: "100%", }}
              lableText={Lang_chg.password[config.language]}
              inputRef={(ref) => {
                this.passwordInput = ref;
              }}
              onChangeText={(text) => this.setState({ password: text })}
              value={this.state.password}
              keyboardType="default"
              autoCapitalize="none"
              returnKeyLabel="done"
              returnKeyType="next"
              secureTextEntry={this.state.isSecurePassword}
              disableImg={true}
              iconName={this.state.isSecurePassword ? "eye-off" : "eye"}
              iconPressAction={() => {
                this.setState({
                  isSecurePassword: !this.state.isSecurePassword,
                });
              }}
              onSubmitEditing={() => {
                this.confirmInput.focus();
              }}
              editable
            />

            {/* -----------------------------------------------------------text*/}

            <Text
              style={{
                textAlign: config.textRotate,
                fontSize: Font.textsize,
                fontFamily: Font.headingfontfamily,
                color: Colors.lightGrey,
                marginTop: vs(8)
              }}
            >
              {Lang_chg.Signuptext3[config.language]}
            </Text>

            {/* ----------------------------------------------------------------------confirmpasword */}


            <AuthInputBoxSec
              mainContainer={{ marginTop: vs(8), width: "100%", }}
              lableText={Lang_chg.confirmpassword1[config.language]}
              inputRef={(ref) => {
                this.confirmInput = ref;
              }}
              onChangeText={(text) => this.setState({ confirm: text })}
              value={this.state.confirm}
              keyboardType="default"
              autoCapitalize="none"
              returnKeyLabel="next"
              returnKeyType="done"
              secureTextEntry={this.state.isSecurePassword1}
              disableImg={true}
              iconName={this.state.isSecurePassword1 ? "eye-off" : "eye"}
              iconPressAction={() => {
                this.setState({
                  isSecurePassword1: !this.state.isSecurePassword1,
                });
              }}
              onSubmitEditing={() => {
                // this.signup_click()
              }}
              editable
            />

            {/*   ---------------------------------------------------------------------------- */}


            <Text
              style={{
                textAlign: config.textRotate,
                fontSize: Font.textsize,
                fontFamily: Font.headingfontfamily,
                color: Colors.lightGrey,
                marginTop: vs(8)
              }}
            >
              {Lang_chg.Signuptext4[config.language]}
            </Text>

            <Button
              text={Lang_chg.btntext[config.language]}
              onPress={() => this.signup_click()}
              btnStyle={{ marginTop: vs(15) }}
            />

            <View
              style={{
                width: "90%",
                alignSelf: "center",
                marginTop: vs(12),
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center'
              }}>

              <Text
                style={{
                  textAlign: config.textalign,
                  fontSize: Font.small,
                  fontFamily: Font.Regular,
                  color: Colors.DarkGrey,
                  textAlign: "center",
                  alignSelf: "center",
                }}>
                {Lang_chg.termsandconditiontext1[config.language]}
              </Text>

              <View style={{
                marginTop: vs(2),
                flexDirection: 'row',
                alignSelf: 'center',
              }}>
                <TouchableHighlight
                  onPress={() => {
                    this.props.navigation.navigate("TermsAndConditions", {
                      contantpage: 2,
                      content: config.term_url_eng, //'https://teq-dev-var19.co.in/rootscare/terms-and-conditions/eng',
                      content_ar: config.term_url_ar, //'https://teq-dev-var19.co.in/rootscare/terms-and-conditions/ar'
                    });
                  }}
                  underlayColor={Colors.Highlight}>
                  <Text
                    style={{
                      fontSize: Font.small,
                      fontFamily: Font.Medium,
                      color: Colors.Black,
                      textAlign: 'center'
                    }} >
                    {Lang_chg.termsandconditiontext2[config.language]}
                  </Text>
                </TouchableHighlight>
                <Text
                  style={{
                    textAlign: config.textalign,
                    fontSize: Font.small,
                    fontFamily: Font.Regular,
                    color: Colors.DarkGrey,
                  }}>
                  {Lang_chg.termsandconditiontext3[config.language]}
                </Text>
                <TouchableHighlight
                  onPress={() => {
                    this.props.navigation.navigate("TermsAndConditions", {
                      contantpage: 1,
                      content: config.privacy_url_eng,
                      content_ar: config.privacy_url_ar
                    });
                  }}
                  underlayColor={Colors.Highlight}>
                  <Text
                    style={{
                      textAlign: config.textalign,
                      fontSize: Font.small,
                      fontFamily: Font.Medium,
                      color: Colors.Black,
                    }}>
                    {Lang_chg.termsandconditiontext4[config.language]}
                  </Text>
                </TouchableHighlight>
              </View>

            </View>

            <View style={{ width: '100%', height: 1.5, backgroundColor: Colors.backgroundcolor, marginTop: vs(18), alignSelf: 'center' }}></View>


            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignSelf: "center",
                marginTop: vs(11),
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  textAlign: config.textRotate,
                  fontSize: Font.medium,
                  fontFamily: Font.Regular,
                  color: Colors.DarkGrey,
                }}
              >
                {Lang_chg.allreadyhaveaccounttext[config.language]}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("Login");
                }}
              >
                <Text
                  style={{
                    textAlign: config.textalign,
                    fontSize: Font.medium,
                    fontFamily: Font.Medium,
                    color: Colors.Blue,
                  }}
                >
                  {Lang_chg.loginheretext[config.language]}
                </Text>
              </TouchableOpacity>
            </View>
            {/* -------------------End------------------ */}

          </View>

        </KeyboardAwareScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.bloodModal}
          onRequestClose={() => { }}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              this.setState({ bloodModal: false });
            }}
            style={{
              flex: 1,
              alignSelf: "center",
              justifyContent: "center",
              backgroundColor: "#00000080",
              width: "100%",
            }}
          >
            <View
              style={{
                width: "70%",
                backgroundColor: "White",
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
              }}
            >
              <View
                style={{
                  width: "100%",
                  backgroundColor: Colors.backgroundcolorblue,
                  paddingVertical: (windowWidth * 2) / 100,
                }}
              >
                <Text
                  style={{
                    paddingLeft: (windowWidth * 4.5) / 100,
                    paddingRight: (windowWidth * 4.5) / 100,
                    textAlign: config.textRotate,
                    fontFamily: Font.Regular,
                    fontSize: (windowWidth * 4) / 100,
                    color: Colors.White,
                  }}
                >
                  {Lang_chg.Country_code[config.language]}
                </Text>
              </View>

              <View style={{ width: "100%", alignSelf: "center" }}>
                <FlatList
                  contentContainerStyle={{
                    paddingBottom: (windowWidth * 2) / 100,
                  }}
                  data={this.state.Countryarr}
                  renderItem={({ item, index }) => {
                    if (
                      this.state.Countryarr != "" ||
                      this.state.Countryarr != null
                    ) {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({
                              bloodModal: false,
                              country_code: item.country_code,
                              country_name: item.name,
                              country_short_code: item.country_short_code,
                            });
                          }}
                        >
                          <View
                            style={{
                              width: "100%",
                              backgroundColor: "#fff",
                              alignSelf: "center",
                              justifyContent: "flex-end",
                            }}
                          >
                            <View
                              style={[
                                {
                                  width: "95%",
                                  borderBottomWidth: 1,
                                  paddingVertical: (windowWidth * 2) / 100,
                                  marginLeft: (windowWidth * 5) / 100,
                                  borderBottomColor: "#0000001F",
                                },
                              ]}
                            >
                              <Text
                                style={{
                                  color: Colors.Black,
                                  fontSize: (windowWidth * 4) / 100,
                                  paddingLeft: (windowWidth * 2) / 100,
                                  textAlign: config.textRotate,
                                }}
                              >
                                {item.name}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    }
                  }}
                  keyExtractor={(item, index) => index.toString()}
                ></FlatList>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

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
                    source={Icons.logo}
                  ></Image>
                  <Text
                    style={{
                      fontFamily: Font.Medium,
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
                    alignSelf: "flex-start",
                    paddingLeft: (windowWidth * 4) / 100,
                    width: "90%",
                    marginTop: (windowWidth * 1.5) / 100,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Font.Light,
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
                      if (this.state.status_new == true) {
                        setTimeout(() => {
                          this.setState({ modalVisible3: false }),
                            this.props.navigation.navigate("OTPPage", {
                              country_name: this.state.country_name,
                            });
                        }, 200);
                      } else {
                        this.setState({ modalVisible3: false });
                      }
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
