import {
  Keyboard,
  FlatList,
  Modal,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { Component } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Colors,
  localimag,
  Font,
  localStorage,
  config,
  mobileW,
  Lang_chg,
  apifuntion,
  consolepro,
  msgProvider,
  msgText,
} from "../Provider/utilslib/Utils";
import { AuthInputBoxSec, Button } from "../components";

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
      <ScrollView
        style={{ flex: 1, backgroundColor: "white" }}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAwareScrollView>
          <View>
            <SafeAreaView
              style={{ backgroundColor: Colors.statusbar_color, flex: 0 }}
            />

            <StatusBar
              barStyle="dark-content"
              backgroundColor={Colors.statusbarcolor}
              hidden={false}
              translucent={false}
              networkActivityIndicatorVisible={true}
            />

            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.bloodModal}
              onRequestClose={() => {}}
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
                    backgroundColor: "white",
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      backgroundColor: Colors.backgroundcolorblue,
                      paddingVertical: (mobileW * 2) / 100,
                    }}
                  >
                    <Text
                      style={{
                        paddingLeft: (mobileW * 4.5) / 100,
                        paddingRight: (mobileW * 4.5) / 100,
                        textAlign: config.textRotate,
                        fontFamily: Font.fontregular,
                        fontSize: (mobileW * 4) / 100,
                        color: Colors.textwhite,
                      }}
                    >
                      {Lang_chg.Country_code[config.language]}
                    </Text>
                  </View>

                  <View style={{ width: "100%", alignSelf: "center" }}>
                    <FlatList
                      contentContainerStyle={{
                        paddingBottom: (mobileW * 2) / 100,
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
                                      paddingVertical: (mobileW * 2) / 100,
                                      marginLeft: (mobileW * 5) / 100,
                                      borderBottomColor: "#0000001F",
                                    },
                                  ]}
                                >
                                  <Text
                                    style={{
                                      color: Colors.textblack,
                                      fontSize: (mobileW * 4) / 100,
                                      paddingLeft: (mobileW * 2) / 100,
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

            <View style={{ paddingBottom: (mobileW * 14) / 100 }}>
              <View
                style={{
                  width: "50%",
                  alignSelf: "center",
                  marginTop: (mobileW * 1) / 100,
                }}
              >
                <Image
                  style={{
                    width: (mobileW * 40) / 100,
                    height: (mobileW * 40) / 100,
                    alignSelf: "center",
                    resizeMode: "contain",
                    alignItems: "center",
                  }}
                  source={localimag.Forgotlogo}
                />
              </View>

              <View
                style={{
                  width: "15%",
                  marginTop: (mobileW * -21) / 100,
                  alignSelf: "flex-start",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.goBack();
                  }}
                  style={{ width: "100%" }}
                >
                  <Image
                    style={{
                      width: (mobileW * 10) / 100,
                      height: (mobileW * 10) / 100,
                      resizeMode: "contain",
                      alignSelf: "center",
                    }}
                    source={
                      config.textalign == "right"
                        ? localimag.arabic_back
                        : localimag.backarrow
                    }
                  />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  width: "90%",
                  alignSelf: "center",
                  marginTop: (mobileW * 14) / 100,
                }}
              >
                <Text
                  style={{
                    fontSize: Font.headingblack,
                    fontFamily: Font.blackheadingfontfamily,
                    textAlign: config.textRotate,
                  }}
                >
                  {Lang_chg.Signup[config.language]}
                </Text>
              </View>

              <View
                style={{
                  width: "90%",
                  alignSelf: "center",
                  marginTop: (mobileW * 1) / 100,
                }}
              >
                <Text
                  style={{
                    textAlign: config.textRotate,
                    fontSize: Font.headinggray,
                    fontFamily: Font.headingfontfamily,
                    color: Colors.placeholder_text,
                  }}
                >
                  {Lang_chg.Signuptext1[config.language]}
                </Text>
              </View>

              {/* ---------------------------------------------------------------------fullname */}
              {/* {this.state.namefocus == true && (
                <View
                  style={{borderBottomColor:'red'
                   
                  }}>
                 
                </View>
              )} */}

              <View
                style={{
                  width: "90%",
                  alignSelf: "center",
                  marginTop: (mobileW * 6) / 100,
                  // borderColor:this.state.namefocus==true?'#0057A5':Colors.placeholder_border,
                  // borderWidth:1,
                  // borderRadius: (mobileW * 1) / 100,
                }}
              >
                <AuthInputBoxSec
                  mainContainer={{
                    width: "100%",
                  }}
                  // icon={layer9_icon}
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
                />
                {/* <View style={{width: '95%', alignSelf: 'center'}}>
                <TextInput
                  style={{
                    width: '100%',
                    color: Colors.textblack,
                    fontSize: Font.placeholdersize,
                    textAlign: config.textalign,
                     height:Font.placeholder_height,
                    fontFamily: Font.placeholderfontfamily,
                  }}
                  maxLength={50}
                  placeholder={this.state.namefocus != true? Lang_chg.textinputname[config.language]: null}
                  placeholderTextColor={Colors.placeholder_text}
                  onChangeText={txt => {this.setState({name: txt});}}
                  value={this.state.name}
                  onFocus={() => { this.setState({namefocus: true});}}
                  onBlur={() => {
                    this.setState({
                      namefocus: this.state.name.length > 0 ? true : false,
                    });
                  }}
                  keyboardType="default"
                  returnKeyLabel="done"
                  returnKeyType="done"
                  onSubmitEditing={() => { Keyboard.dismiss() }}
                  
                />
              </View>
              {this.state.namefocus == true && (
                <View
                  style={{
                    position: 'absolute',
                    backgroundColor: 'white',
                    left: (mobileW * 4) / 100,
                    top: (-mobileW * 2) / 100,
                    paddingHorizontal: (mobileW * 1) / 100,
                  }}>
                  <Text style={{color: '#0057A5'}}>
                    {Lang_chg.textinputname[config.language]}
                  </Text>
                </View>
              )} */}
              </View>

              {/* -----------------------------------------------------------------------------------email */}

              <View
                style={{
                  width: "90%",
                  alignSelf: "center",
                  marginTop: (mobileW * 2) / 100,
                  // borderColor:this.state.emailfocus==true?'#0057A5':Colors.placeholder_border,
                  // borderWidth:1,
                  // borderRadius: (mobileW * 1) / 100,
                }}
              >
                <AuthInputBoxSec
                  mainContainer={{
                    width: "100%",
                  }}
                  // icon={layer9_icon}
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
                />
                {/* <View style={{width: '95%', alignSelf: 'center'}}>
                <TextInput
                  style={{
                    width: '100%',
                    color: Colors.textblack,
                    fontSize: Font.placeholdersize,
                    textAlign: config.textalign,
                     height:Font.placeholder_height,
                    fontFamily: Font.placeholderfontfamily,
                  }}
                  maxLength={100}
                  placeholder={ this.state.emailfocus != true? Lang_chg.textinputemails[config.language]: null }
                  placeholderTextColor={Colors.placeholder_text}
                  onChangeText={txt => {
                    this.setState({email: txt});
                  }}
                  value={this.state.email}
                  onFocus={() => {this.setState({emailfocus: true});}}
                  onBlur={() => { this.setState({emailfocus: this.state.email.length > 0 ? true : false,});}}
                  keyboardType="email-address"
                  returnKeyLabel="done"
                  returnKeyType="done"
                  onSubmitEditing={() => { Keyboard.dismiss() }}
                />
              </View>
              {this.state.emailfocus == true && (
                <View
                  style={{
                    position: 'absolute',
                    backgroundColor: 'white',
                    left: (mobileW * 4) / 100,
                    top: (-mobileW * 2) / 100,
                    paddingHorizontal: (mobileW * 1) / 100,
                  }}>
                  <Text style={{color: '#0057A5'}}>
                    {Lang_chg.textinputemails[config.language]}
                  </Text>
                </View>
              )} */}
              </View>

              <View style={{ width: "90%", alignSelf: "center" }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ bloodModal: true });
                  }}
                  style={{
                    width: "100%",
                    height: 48,
                    alignSelf: "center",
                    borderColor: "#CCCCCC",
                    borderWidth: 1,
                    backgroundColor: Colors.tab_background_color,
                    borderRadius: (mobileW * 1) / 100,
                    paddingVertical: (mobileW * 3.7) / 100,
                    marginTop: (mobileW * 3.5) / 100,
                  }}
                >
                  <View
                    style={{
                      width: "95%",
                      alignSelf: "center",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* <View style={{width: '80%'}}> */}
                    <Text
                      style={{
                        fontSize: (mobileW * 3.7) / 100,
                        fontFamily: Font.fontregular,
                        textAlign: config.textRotate,
                      }}
                    >
                      {this.state.country_name.length <= 0
                        ? Lang_chg.select[config.language]
                        : this.state.country_name}
                    </Text>
                    {/* </View> */}

                    <View style={{ width: "20%", alignSelf: "center" }}>
                      <Image
                        style={{
                          height: (mobileW * 4) / 100,
                          width: (mobileW * 4) / 100,
                          alignSelf: "flex-end",
                        }}
                        source={localimag.downarrow}
                      ></Image>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              {/* -----------------------------------------------------------------------------no- */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "90%",
                  alignSelf: "center",
                }}
              >
                <View
                  style={{
                    width: "20%",
                    alignSelf: "center",
                    marginTop: (mobileW * 2.3) / 100,
                    // borderColor:this.state.country_code.length > 0?'#0057A5':Colors.placeholder_border,
                    // borderWidth:1,
                    // borderRadius: (mobileW * 1) / 100,
                  }}
                >
                  <AuthInputBoxSec
                    mainContainer={{
                      width: "100%",
                    }}
                    inputFieldStyle={{
                      textAlign: "center",
                      marginBottom: (mobileW * 4) / 100,
                    }}
                    // icon={layer9_icon}
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

                  {/* <TextInput
                  style={{
                    width: '100%',
                    color: Colors.textblack,
                    fontSize: Font.placeholdersize,
                    textAlign: 'center',
                     height:Font.placeholder_height,
                    fontFamily: Font.placeholderfontfamily,
                   
                  }}
                  maxLength={3}
                  editable={false}
                  placeholder={
                    this.state.country_codefocus != true
                      ? Lang_chg.CC_code[config.language]
                      : null
                  }
                  placeholderTextColor={Colors.placeholder_text}
                  onChangeText={txt => {
                    this.setState({country_code: txt});
                  }}
                 
                  onFocus={() => {
                    this.setState({country_codefocus: true});
                  }}
                  onBlur={() => {
                    this.setState({
                      country_codefocus: this.state.country_code.length > 0 ? true : false,
                    });
                  }}
                
                      value={""+this.state.country_code+""}
                  keyboardType="number-pad"
                  returnKeyLabel="done"
                  returnKeyType="done"
                  onSubmitEditing={() => { Keyboard.dismiss() }}
                />
            
              {this.state.country_code.length > 0   &&
                <View
                  style={{
                    position: 'absolute',
                    backgroundColor: 'white',
                    left: (mobileW * 5) / 100,
                    top: (-mobileW * 2) / 100,
                    paddingHorizontal: (mobileW * 1) / 100,
                  }}>
                  <Text style={{color: '#0057A5'}}>
                    {Lang_chg.CC_code[config.language]}
                  </Text>
                </View>
              } */}
                </View>

                <View
                  style={{
                    width: "78%",
                    alignSelf: "center",
                    marginTop: (mobileW * 2) / 100,
                    // borderColor: this.state.numberfocus == true ? '#0057A5' : Colors.placeholder_border,
                    // borderWidth: 1,
                    // borderRadius: (mobileW * 1) / 100,
                  }}
                >
                  <AuthInputBoxSec
                    mainContainer={{
                      width: "100%",
                    }}
                    // icon={layer9_icon}
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
                  />
                  <View
                    style={{
                      width: "89%",
                      // alignSelf: 'center',
                      marginTop: (mobileW * 0.5) / 100,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: config.textRotate,
                        fontSize: Font.textsize,
                        fontFamily: Font.headingfontfamily,
                        color: Colors.textgray,
                      }}
                    >
                      {Lang_chg.mobletexttitle[config.language]}
                    </Text>
                  </View>
                  {/* <View style={{width: '95%', alignSelf: 'center'}}>
                <TextInput
                  style={{
                    width: '100%',
                    color: Colors.textblack,
                    fontSize: Font.placeholdersize,
                    textAlign: config.textalign,
                     height:Font.placeholder_height,
                    fontFamily: Font.placeholderfontfamily,
                  
                  }}
                  maxLength={15}
                  placeholder={
                    this.state.numberfocus != true
                      ? Lang_chg.textinputnumber[config.language]
                      : null
                  }
                  placeholderTextColor={Colors.placeholder_text}
                  onChangeText={txt => {
                    this.setState({mobile: txt});
                  }}
                  value={this.state.mobile}
                  onFocus={() => {
                    this.setState({numberfocus: true});
                  }}
                  onBlur={() => {
                    this.setState({
                      numberfocus: this.state.mobile.length > 0 ? true : false,
                    });
                  }}
                

                  keyboardType="number-pad"
                  returnKeyLabel="done"
                  returnKeyType="done"
                  onSubmitEditing={() => { Keyboard.dismiss() }}
                />
              </View>
              {this.state.numberfocus == true && (
                <View
                  style={{
                    position: 'absolute',
                    backgroundColor: 'white',
                    left: (mobileW * 4) / 100,
                    top: (-mobileW * 2) / 100,
                    paddingHorizontal: (mobileW * 1) / 100,
                  }}>
                  <Text style={{color: '#0057A5'}}>
                    {Lang_chg.textinputnumber[config.language]}
                  </Text>
                </View>
              )} */}
                </View>
              </View>
              {/* ---------------------------------------------------------------------------idno */}

              <View
                style={{
                  width: "90%",
                  alignSelf: "center",
                  marginTop: (mobileW * 2) / 100,
                  // borderColor: this.state.idfocus == true ? '#0057A5' : Colors.placeholder_border,
                  // borderWidth: 1,
                  // borderRadius: (mobileW * 1) / 100,
                }}
              >
                <AuthInputBoxSec
                  mainContainer={{
                    width: "100%",
                  }}
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
                />
                {/* <View style={{ width: '95%', alignSelf: 'center' }}>
                  <TextInput
                    style={{
                      width: '100%',
                      color: Colors.textblack,
                      fontSize: Font.placeholdersize,
                      textAlign: config.textalign,
                      height: Font.placeholder_height,
                      fontFamily: Font.placeholderfontfamily,
                    }}
                    maxLength={15}
                    placeholder={
                      this.state.idfocus != true
                        ? Lang_chg.textinputnationalid[config.language]
                        : null
                    }
                    placeholderTextColor={Colors.placeholder_text}
                    onChangeText={txt => {
                      this.setState({ id: txt });
                    }}
                    value={this.state.id}
                    onFocus={() => { this.setState({ idfocus: true }); }}
                    onBlur={() => { this.setState({ idfocus: this.state.id.length > 0 ? true : false }); }}
                    keyboardType="number-pad"
                    returnKeyLabel="done"
                    returnKeyType="done"
                    onSubmitEditing={() => { Keyboard.dismiss() }}
                  />
                </View>
                {this.state.idfocus == true && (
                  <View
                    style={{
                      position: 'absolute',
                      backgroundColor: 'white',
                      left: (mobileW * 4) / 100,
                      top: (-mobileW * 2) / 100,
                      paddingHorizontal: (mobileW * 1) / 100,
                    }}>
                    <Text style={{ color: '#0057A5' }}>
                      {Lang_chg.textinputnationalid[config.language]}
                    </Text>
                  </View>
                )} */}
              </View>

              {/* --------------------------------------------------------------------------------text */}

              <View
                style={{
                  width: "89%",
                  alignSelf: "center",
                  marginTop: (mobileW * 0.5) / 100,
                }}
              >
                {this.state.country_short_code == "UAE" ? (
                  <Text
                    style={{
                      textAlign: config.textRotate,
                      fontSize: Font.textsize,
                      fontFamily: Font.headingfontfamily,
                      color: Colors.textgray,
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
                      color: Colors.textgray,
                    }}
                  >
                    {Lang_chg.Signuptext2[config.language]}
                  </Text>
                )}
              </View>
              {/* ------------------------------------------------------password */}

              <View
                style={{
                  width: "90%",
                  alignSelf: "center",
                  marginTop: (mobileW * 2) / 100,
                  flexDirection: "row",
                  // borderColor: this.state.passwordfocus == true ? '#0057A5' : Colors.placeholder_border,
                  // borderWidth: 1,
                  // borderRadius: (mobileW * 1) / 100,
                }}
              >
                <AuthInputBoxSec
                  mainContainer={{
                    width: "100%",
                  }}
                  // icon={layer9_icon}
                  lableText={Lang_chg.password[config.language]}
                  inputRef={(ref) => {
                    this.passwordInput = ref;
                  }}
                  onChangeText={(text) => this.setState({ password: text })}
                  value={this.state.password}
                  keyboardType="default"
                  autoCapitalize="none"
                  returnKeyLabel="done"
                  returnKeyType="done"
                  secureTextEntry={this.state.isSecurePassword}
                  disableImg={true}
                  iconName={this.state.isSecurePassword ? "eye" : "eye-off"}
                  iconPressAction={() => {
                    this.setState({
                      isSecurePassword: !this.state.isSecurePassword,
                    });
                  }}
                  onSubmitEditing={() => {
                    this.confirmInput.focus();
                  }}
                />
                {/* <View style={{ width: '90%', alignSelf: 'center' }}>
                  <TextInput
                    style={{
                      width: '95%',
                      alignSelf: 'center',
                      color: Colors.textblack,
                      fontSize: Font.placeholdersize,
                      textAlign: config.textalign,
                      height: Font.placeholder_height,
                      fontFamily: Font.placeholderfontfamily,
                    }}
                    maxLength={50}
                    placeholder={
                      this.state.passwordfocus != true
                        ? Lang_chg.password[config.language]
                        : null
                    }
                    placeholderTextColor={Colors.placeholder_text}
                    onChangeText={txt => {
                      this.setState({ password: txt });
                    }}
                    value={this.state.password}
                    onFocus={() => {
                      this.setState({ passwordfocus: true });
                    }}
                    onBlur={() => {
                      this.setState({
                        passwordfocus:
                          this.state.password.length > 0 ? true : false,
                      });
                    }}
                    keyboardType="default"
                    returnKeyLabel="done"
                    returnKeyType="done"
                    secureTextEntry={this.state.isSecurePassword}
                  />
                </View>
                {this.state.passwordfocus == true && (
                  <View
                    style={{
                      position: 'absolute',
                      backgroundColor: 'white',
                      left: (mobileW * 4) / 100,
                      top: (-mobileW * 2) / 100,
                      paddingHorizontal: (mobileW * 1) / 100,
                    }}>
                    <Text style={{ color: '#0057A5' }}>
                      {Lang_chg.password[config.language]}
                    </Text>
                  </View>
                )} 

                <TouchableOpacity
                  style={{ width: '10%', alignSelf: 'center' }}
                  onPress={() => {
                    this.setState({
                      isSecurePassword: !this.state.isSecurePassword,
                    });
                  }}>
                  {this.state.isSecurePassword == false ? (
                    <View
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        justifyContent: 'flex-end',
                      }}>
                      <Image
                        style={{
                          height: (mobileW * 6) / 100,
                          width: (mobileW * 6) / 100,
                        }}
                        source={require('./icons/eye-icon.png')}></Image>
                    </View>
                  ) : (
                    <View
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        justifyContent: 'flex-end',
                      }}>
                      <Image
                        style={{
                          height: (mobileW * 6) / 100,
                          width: (mobileW * 6) / 100,
                        }}
                        source={require('./icons/eye-icon02.png')}></Image>
                    </View>
                  )}
                </TouchableOpacity> */}
              </View>

              {/* -----------------------------------------------------------text*/}

              <View
                style={{
                  width: "89%",
                  alignSelf: "center",
                  marginTop: (mobileW * 0.5) / 100,
                }}
              >
                <Text
                  style={{
                    textAlign: config.textRotate,
                    fontSize: Font.textsize,
                    fontFamily: Font.headingfontfamily,
                    color: Colors.textgray,
                  }}
                >
                  {Lang_chg.Signuptext3[config.language]}
                </Text>
              </View>
              {/* ----------------------------------------------------------------------confirmpasword */}

              <View
                style={{
                  width: "90%",
                  alignSelf: "center",
                  marginTop: (mobileW * 2) / 100,
                  flexDirection: "row",
                  // borderColor: this.state.confirmpasswordfocus == true ? '#0057A5' : Colors.placeholder_border,
                  // borderWidth: 1,
                  // borderRadius: (mobileW * 1) / 100,
                }}
              >
                <AuthInputBoxSec
                  mainContainer={{
                    width: "100%",
                  }}
                  // icon={layer9_icon}
                  lableText={Lang_chg.confirmpassword1[config.language]}
                  inputRef={(ref) => {
                    this.confirmInput = ref;
                  }}
                  onChangeText={(text) => this.setState({ confirm: text })}
                  value={this.state.confirm}
                  keyboardType="default"
                  autoCapitalize="none"
                  returnKeyLabel="next"
                  returnKeyType="next"
                  secureTextEntry={this.state.isSecurePassword1}
                  disableImg={true}
                  iconName={this.state.isSecurePassword1 ? "eye" : "eye-off"}
                  iconPressAction={() => {
                    this.setState({
                      isSecurePassword1: !this.state.isSecurePassword1,
                    });
                  }}
                  onSubmitEditing={() => {
                    // this.signup_click()
                  }}
                />
                {/* <View style={{ width: '90%', alignSelf: 'center' }}>
                  <TextInput
                    style={{
                      width: '95%',
                      alignSelf: 'center',
                      color: Colors.textblack,
                      fontSize: Font.placeholdersize,
                      textAlign: config.textalign,
                      height: Font.placeholder_height,
                      fontFamily: Font.placeholderfontfamily,
                    }}
                    maxLength={50}
                    placeholder={
                      this.state.confirmpasswordfocus != true
                        ? Lang_chg.confirmpassword1[config.language]
                        : null
                    }
                    placeholderTextColor={Colors.placeholder_text}
                    onChangeText={txt => {
                      this.setState({ confirm: txt });
                    }}
                    value={this.state.confirm}
                    onFocus={() => {
                      this.setState({ confirmpasswordfocus: true });
                    }}
                    onBlur={() => {
                      this.setState({
                        confirmpasswordfocus:
                          this.state.confirm.length > 0 ? true : false,
                      });
                    }}
                    keyboardType="default"
                    returnKeyLabel="done"
                    returnKeyType="done"
                    secureTextEntry={this.state.isSecurePassword1}
                  />
                </View>
                {this.state.confirmpasswordfocus == true && (
                  <View
                    style={{
                      position: 'absolute',
                      backgroundColor: 'white',
                      left: (mobileW * 4) / 100,
                      top: (-mobileW * 2) / 100,
                      paddingHorizontal: (mobileW * 1) / 100,
                    }}>
                    <Text style={{ color: '#0057A5' }}>
                      {Lang_chg.confirmpassword1[config.language]}
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  style={{ width: '10%', alignSelf: 'center' }}
                  onPress={() => {
                    this.setState({
                      isSecurePassword1: !this.state.isSecurePassword1,
                    });
                  }}>
                  {this.state.isSecurePassword1 == false ? (
                    <View
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        justifyContent: 'flex-end',
                      }}>
                      <Image
                        style={{
                          height: (mobileW * 6) / 100,
                          width: (mobileW * 6) / 100,
                        }}
                        source={require('./icons/eye-icon.png')}></Image>
                    </View>
                  ) : (
                    <View
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        justifyContent: 'flex-end',
                      }}>
                      <Image
                        style={{
                          height: (mobileW * 6) / 100,
                          width: (mobileW * 6) / 100,
                        }}
                        source={require('./icons/eye-icon02.png')}></Image>
                    </View>
                  )}
                </TouchableOpacity> */}
              </View>
              {/*   ---------------------------------------------------------------------------- */}

              <View
                style={{
                  width: "89%",
                  alignSelf: "center",
                  marginTop: (mobileW * 0.5) / 100,
                }}
              >
                <Text
                  style={{
                    textAlign: config.textRotate,
                    fontSize: Font.textsize,
                    fontFamily: Font.headingfontfamily,
                    color: Colors.textgray,
                  }}
                >
                  {Lang_chg.Signuptext4[config.language]}
                </Text>
              </View>

              <Button
                text={Lang_chg.btntext[config.language]}
                // onLoading={this.state.loading}
                customStyles={
                  {
                    // mainContainer: styles.butonContainer
                  }
                }
                onPress={() => this.signup_click()}
                // isBlank={false}
              />

              {/* <TouchableOpacity
                onPress={() => this.signup_click()}
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  borderRadius: (mobileW * 2) / 100,
                  backgroundColor: Colors.buttoncolorblue,
                  paddingVertical: (mobileW * 4) / 100,
                  marginTop: (mobileW * 6) / 100,
                  shadowColor: '#000',
                  shadowOffset: { width: 1, height: 1 },
                  shadowOpacity: 0.5,
                  shadowRadius: 2,
                  elevation: 3,
                }}>
                <Text
                  style={{
                    color: Colors.textwhite,
                    fontFamily: Font.fontmedium,
                    fontSize: Font.buttontextsize,
                    alignSelf: 'flex-end',
                    textAlign: config.textalign,
                    alignSelf: 'center',
                  }}>
                  {Lang_chg.btntext[config.language]}
                </Text>
              </TouchableOpacity> */}

              <View
                style={{
                  width: "80%",
                  alignSelf: "center",
                  marginTop: (mobileW * 10) / 100,
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    width: "100%",

                    alignSelf: "center",
                  }}
                >
                  <Text
                    style={{
                      textAlign: config.textalign,
                      fontSize: (mobileW * 3.5) / 100,
                      fontFamily: Font.headingfontfamily,
                      color: Colors.placeholder_text,
                      textAlign: "center",
                      alignSelf: "center",
                    }}
                  >
                    {Lang_chg.termsandconditiontext1[config.language]}
                  </Text>
                  <Text
                    onPress={() => {
                      this.props.navigation.navigate("Tremsandcondition", {
                        contantpage: 2,
                        content: config.term_url_eng, //'https://teq-dev-var19.co.in/rootscare/terms-and-conditions/eng',
                        content_ar: config.term_url_ar, //'https://teq-dev-var19.co.in/rootscare/terms-and-conditions/ar'
                      });
                    }}
                    style={{
                      textAlign: config.textalign,
                      fontSize: (mobileW * 3.5) / 100,
                      fontFamily: Font.terms_text_font_family,
                      color: Colors.terms_text_color_blue,
                      flexDirection: "row",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    {Lang_chg.termsandconditiontext2[config.language]}
                    <Text
                      style={{
                        textAlign: config.textalign,
                        fontSize: (mobileW * 3.5) / 100,
                        fontFamily: Font.headingfontfamily,
                        color: Colors.placeholder_text,
                      }}
                    >
                      {Lang_chg.termsandconditiontext3[config.language]}
                    </Text>
                    <Text
                      onPress={() => {
                        this.props.navigation.navigate("Tremsandcondition", {
                          contantpage: 1,
                          content: config.privacy_url_eng, //'https://teq-dev-var19.co.in/rootscare/privacy-policy/eng',
                          content_ar: config.privacy_url_ar, //'https://teq-dev-var19.co.in/rootscare/privacy-policy/ar'
                        });
                      }}
                      style={{
                        textAlign: config.textalign,
                        fontSize: (mobileW * 3.6) / 100,
                        fontFamily: Font.fontsemibold,
                        color: Colors.terms_text_color_blue,
                      }}
                    >
                      {Lang_chg.termsandconditiontext4[config.language]}
                    </Text>
                  </Text>
                </View>
              </View>

              <View
                style={{
                  width: "90%",
                  alignSelf: "center",
                  borderColor: Colors.bordercolor,
                  borderBottomWidth: 1,
                  marginTop: (mobileW * 6) / 100,
                }}
              ></View>

              <View
                style={{
                  width: "90%",
                  flexDirection: "row",
                  alignSelf: "center",
                  marginTop: (mobileW * 5) / 100,
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    textAlign: config.textalign,
                    fontSize: (mobileW * 3.8) / 100,
                    fontFamily: Font.fontmedium,
                    color: Colors.placeholder_text,
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
                      fontSize: (mobileW * 3.5) / 100,
                      fontFamily: Font.terms_text_font_family,
                      color: Colors.textblue,
                      alignSelf: "flex-end",
                    }}
                  >
                    {Lang_chg.loginheretext[config.language]}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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
                <StatusBar
                  backgroundColor={"#fff"}
                  barStyle="default"
                  hidden={false}
                  translucent={false}
                  networkActivityIndicatorVisible={true}
                />
                <View
                  style={{
                    borderRadius: 20,
                    width: (mobileW * 90) / 100,
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
                        paddingVertical: (mobileW * 3) / 100,
                        marginTop: (mobileW * 2) / 100,
                        paddingLeft: (mobileW * 4) / 100,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        style={{
                          width: (mobileW * 6) / 100,
                          height: (mobileW * 6) / 100,
                        }}
                        source={require("../icons/logo.png")}
                      ></Image>
                      <Text
                        style={{
                          fontFamily: Font.fontmedium,
                          color: "#000",
                          fontSize: (mobileW * 5) / 100,
                          paddingLeft: (mobileW * 4) / 100,
                        }}
                      >
                        {Lang_chg.registration[config.language]}
                      </Text>
                    </View>

                    <View
                      style={{
                        alignSelf: "flex-start",
                        paddingLeft: (mobileW * 4) / 100,
                        width: "90%",
                        marginTop: (mobileW * 1.5) / 100,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: Font.fontlight,
                          color: "#000",
                          fontSize: (mobileW * 4) / 100,
                        }}
                      >
                        {this.state.error_msg}
                      </Text>
                    </View>

                    <View
                      style={{
                        paddingBottom: (mobileW * 5) / 100,
                        marginTop: (mobileW * 9) / 100,
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
                          width: (mobileW * 15) / 100,
                          flexDirection: "row",
                          alignSelf: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Font.fontregular,
                            fontSize: (mobileW * 4) / 100,
                            color: Colors.theme_color,
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
        </KeyboardAwareScrollView>
      </ScrollView>
    );
  }
}
