import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Keyboard,
  TouchableHighlight,
} from "react-native";
import React, { Component } from "react";
import {
  Colors,
  Icons,
  Font,
  config,
  windowWidth,
  consolepro,
  Lang_chg,
  msgProvider,
  msgText,
  apifuntion,
  StatusbarHeight,
} from "../Provider/utilslib/Utils";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AuthInputBoxSec, Button } from "../components";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import { leftArrow, Logo, rightArrow } from "../icons/SvgIcons/Index";

export default class ForgotPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailfocus: false,
      email: "",
    };
  }
  submit_click = async () => {
    Keyboard.dismiss();
    var email = this.state.email.trim();
    let regemail =
      /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (email.length <= 0) {
      msgProvider.showError(msgText.emptyEmail[config.language]);
      return false;
    }

    if (regemail.test(email) !== true) {
      msgProvider.showError(msgText.validEmail[config.language]);
      return false;
    }
    let email_new = this.state.email;
    let url = config.baseURL + "api-forgot-password-email";
    console.log("url", url);

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
            this.props.navigation.navigate("ForgotOTP", { email: email_new });
          }, 300);
        } else {
          console.log("muksna");

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
      <View
        style={{ flex: 1, backgroundColor: Colors.white, paddingTop:StatusbarHeight }}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{
            justifyContent: 'center',
            paddingBottom: vs(30),
          }}
          showsVerticalScrollIndicator={false}
        >

          <View style={{ paddingBottom: (windowWidth * 8) / 100 }}>

            <View
              style={{
                width: "100%",
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: vs(40),
              }}>
              <View style={{ justifyContent: 'center' }}>
                <SvgXml xml={Logo} />
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
                marginTop: (windowWidth * 10) / 100,
              }}>
              <Text
                style={{
                  fontSize: Font.headingblack,
                  fontFamily: Font.hedingfontfamily,
                  color: Colors.textblack,
                  textAlign: config.textRotate,
                }}
              >
                {Lang_chg.Forgot[config.language]}{" "}
              </Text>
            </View>

            <View
              style={{
                width: "90%",
                alignSelf: "center",
                marginTop: (windowWidth * 1) / 100,
              }}
            >
              <Text
                style={{
                  fontSize: Font.headinggray,
                  fontFamily: Font.fontlight,
                  color: Colors.DarkGrey,
                  textAlign: config.textRotate,
                }}
              >
                {Lang_chg.Forgottext[config.language]}
              </Text>
            </View>

            <View
              style={{
                width: "90%",
                alignSelf: "center",
                marginTop: (windowWidth * 6) / 100,
                // borderColor: this.state.emailfocus == true ? Colors.placholderactive : Colors.placeholder_border, borderWidth: windowWidth * 0.3 / 100, borderRadius: windowWidth * 1 / 100
              }}
            >
              <AuthInputBoxSec
                mainContainer={{
                  width: "100%",
                }}
                // icon={layer9_icon}
                lableText={Lang_chg.textinputregistered[config.language]}
                inputRef={(ref) => {
                  this.emailInput = ref;
                }}
                onChangeText={(text) => this.setState({ email: text })}
                value={this.state.email}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyLabel="done"
                returnKeyType="done"
                onSubmitEditing={() => {
                  this.submit_click();
                }}
              />

              {/* <View style={{ width: '95%', alignSelf: 'center', }}>
                  <TextInput
                    style={{ width: '100%', color: '#000', fontSize: Font.placeholdersize, textAlign: config.textalign, fontFamily: Font.fontlight, height: Font.placeholder_height }}
                    maxLength={50}
                    placeholder={this.state.emailfocus != true ? Lang_chg.textinputregistered[config.language] : null}
                    DarkGrey={Colors.DarkGrey}
                    onChangeText={(txt) => { this.setState({ email: txt }) }}
                    value={this.state.email}
                    onFocus={() => { this.setState({ emailfocus: true }) }}
                    onBlur={() => { this.setState({ emailfocus: this.state.email.length > 0 ? true : false }) }}
                    keyboardType='email-address'
                    returnKeyLabel='done'
                    returnKeyType='done'
                  />
                </View>
                {this.state.emailfocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: windowWidth * 4 / 100, top: -windowWidth * 2 / 100, paddingHorizontal: windowWidth * 1 / 100 }}>
                  <Text style={{ color: '#0168B3', textAlign: config.textalign }}>{Lang_chg.textinputregistered[config.language]}</Text>
                </View>} */}
            </View>

            <Button
              text={Lang_chg.forgotbtn[config.language]}
              // onLoading={this.state.loading}
              customStyles={
                {
                  // mainContainer: styles.butonContainer
                }
              }
              onPress={() => this.submit_click()}
            // isBlank={false}
            />

            {/* <TouchableOpacity onPress={() => this.submit_click()}
                style={{ width: '90%', alignSelf: 'center', borderRadius: windowWidth * 2 / 100, backgroundColor: Colors.Theme, paddingVertical: windowWidth * 4 / 100, marginTop: windowWidth * 6 / 100 }}>
                <Text style={{ color: Colors.textwhite, fontFamily: Font.fontmedium, fontSize: Font.buttontextsize, textAlign: config.textalign, alignSelf: 'center' }}>{Lang_chg.forgotbtn[config.language]}</Text>
              </TouchableOpacity> */}
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
