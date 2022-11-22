import {
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
  TextInput,
} from "react-native";
import React, { Component } from "react";
import {
  Colors,
  localimag,
  Font,
  msgProvider,
  msgText,
  config,
  mobileW,
  localStorage,
  Lang_chg,
  apifuntion,
  msgTitle,
  consolepro,
} from "../Provider/utilslib/Utils";
import { AuthInputBoxSec, DropDownboxSec } from "../components";
// import { Nodata_foundimage } from './Provider/Nodata_foundimage';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Select_arr = [
  {
    id: 1,
    select: "Account Issue",
  },
  {
    id: 2,
    select: "Transaction Issue",
  },
  {
    id: 3,
    select: "Withdrawal",
  },
  {
    id: 4,
    select: "Booking Issue",
  },
  {
    id: 5,
    select: "Account Issue",
  },
  {
    id: 6,
    select: "Login Issue",
  },
  {
    id: 7,
    select: "Signup Issue",
  },
  {
    id: 8,
    select: "Mobile OTP Issue",
  },
  {
    id: 9,
    select: "Other",
  },
];

export default class NeedSupport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Select_arr: "NA",
      selectmodal: false,

      message: "",
      selectissuefocus: false,
      select: "",
      selectissue: "",

      successmodal: false,
    };
  }
  componentDidMount() {
    this.props.navigation.addListener("focus", () => {
      this.get_all_topic();
    });
  }

  get_all_topic = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    console.log("user_details user_details", user_details);
    let user_id = user_details["user_id"];

    let url = config.baseURL + "api-patient-need-help-topic";
    console.log("url", url);
    var data = new FormData();
    data.append("login_user_id", user_id);

    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        consolepro.consolelog("obj", obj);
        if (obj.status == true) {
          console.log("result", obj.result);
          let result = obj.result;
          this.setState({ Select_arr: obj.result });
        } else {
          msgProvider.alert(
            msgTitle.information[config.language],
            obj.message[config.language],
            false
          );

          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
        this.setState({ loading: false });
      });
  };
  submit_click = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    console.log("user_details user_details", user_details);
    let user_id = user_details["user_id"];
    let user_type = user_details["user_type"];
    if (this.state.select.length <= 0) {
      msgProvider.showError(msgText.emptySelecttopic[config.language]);
      return false;
    }
    let url = config.baseURL + "api-insert-need-help";
    console.log("url", url);
    var data = new FormData();
    data.append("user_id", user_id);
    data.append("issue_topic", this.state.select);
    data.append("message", this.state.message);
    data.append("service_type", user_type);
    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        consolepro.consolelog("obj", obj);
        if (obj.status == true) {
          console.log("result", obj.result);
          let result = obj.result;
          setTimeout(() => {
            this.setState({ successmodal: true });
          }, 700);
        } else {
          msgProvider.alert(
            msgTitle.information[config.language],
            obj.message[config.language],
            false
          );

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
        style={{
          width: "100%",
          alignSelf: "center",
          flex: 1,
          backgroundColor: Colors.white_color,
        }}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Colors.statusbarcolor}
          hidden={false}
          translucent={false}
          networkActivityIndicatorVisible={true}
        />

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.selectmodal}
          onRequestClose={() => {}}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              this.setState({ selectmodal: false });
            }}
            style={{
              flex: 1,
              alignSelf: "center",
              justifyContent: "center",
              backgroundColor: "#00000080",
              width: "100%",
              marginTop: (mobileW * 3) / 100,
              paddingBottom: (mobileW * 8) / 100,
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
                }}
              >
                <View
                  style={{ width: "45%", paddingVertical: (mobileW * 3) / 100 }}
                >
                  <Text
                    style={{
                      textAlign: config.textalign,
                      fontFamily: Font.fontregular,
                      fontSize: (mobileW * 4) / 100,
                      alignSelf: "center",
                      color: Colors.textwhite,
                    }}
                  >
                    {Lang_chg.select_topic_text[config.language]}
                  </Text>
                </View>
              </View>
              <View style={{ width: "100%" }}>
                <FlatList
                  data={this.state.Select_arr}
                  renderItem={({ item, index }) => {
                    return (
                      <View>
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({
                              selectmodal: false,
                              select: item.name,
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
                              style={{
                                width: "95%",
                                borderBottomColor: "#0000001F",
                                borderBottomWidth: 1,
                                paddingVertical: (mobileW * 2.5) / 100,
                                marginLeft: (mobileW * 5) / 100,
                              }}
                            >
                              <Text
                                style={{
                                  color: Colors.textblack,
                                  textAlign: config.textRotate,
                                  fontSize: (mobileW * 4) / 100,
                                  paddingLeft: (mobileW * 2) / 100,
                                }}
                              >
                                {item.name}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.successmodal}
          onRequestClose={() => {}}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              this.setState({ successmodel: false });
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
                width: "100%",
                backgroundColor: "white",
                borderRadius: (mobileW * 4) / 100,
                position: "absolute",
                bottom: 0,
                alignItems: "center",
                justifyContent: "center",
                paddingBottom: (mobileW * 5) / 100,
                alignSelf: "center",
              }}
            >
              {config.language == 0 ? (
                <Image
                  style={{
                    width: (mobileW * 17) / 100,
                    height: (mobileW * 17) / 100,
                    alignSelf: "center",
                    marginTop: (mobileW * -7) / 100,
                    resizeMode: "contain",
                  }}
                  source={require("../icons/greentick.png")}
                />
              ) : (
                <Image
                  style={{
                    width: (mobileW * 17) / 100,
                    height: (mobileW * 17) / 100,
                    alignSelf: "center",
                    marginTop: (mobileW * -7) / 100,
                    resizeMode: "contain",
                  }}
                  source={require("../icons/ryt_opp.png")}
                />
              )}
              <Text
                style={{
                  fontSize: (mobileW * 8) / 100,
                  marginTop: (mobileW * 5) / 100,
                  fontFamily: Font.fontmedium,
                  textAlign: config.textalign,
                }}
              >
                {Lang_chg.thank[config.language]}
              </Text>
              <Text
                style={{
                  fontSize: (mobileW * 3.5) / 100,
                  marginTop: (mobileW * 5) / 100,
                  fontFamily: Font.fontmedium,
                  textAlign: config.textalign,
                }}
              >
                {Lang_chg.success[config.language]}
              </Text>

              <Text
                style={{
                  fontSize: (mobileW * 3) / 100,
                  marginTop: (mobileW * 2) / 100,
                  fontFamily: Font.fontmedium,
                  textAlign: config.textalign,
                  color: Colors.textgray,
                }}
              >
                {Lang_chg.text_of_modal[config.language]}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  this.setState({ successmodal: false }),
                    this.props.navigation.goBack();
                }}
                style={{
                  width: "15%",
                  alignSelf: "center",
                  borderColor: Colors.bordercolorblue,
                  borderWidth: 1,
                  paddingVertical: (mobileW * 2) / 100,
                  marginTop: (mobileW * 5) / 100,
                  borderRadius: (mobileW * 3) / 100,
                }}
              >
                <Text
                  style={{
                    fontSize: (mobileW * 3) / 100,
                    alignSelf: "center",
                    fontFamily: Font.fontmedium,
                    textAlign: config.textalign,
                    alignSelf: "center",
                    color: Colors.terms_text_color_blue,
                  }}
                >
                  {Lang_chg.close_txt[config.language]}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        <View
          style={{
            width: "100%",
            alignSelf: "center",
            paddingVertical: (mobileW * 3) / 100,
            shadowOpacity: 0.3,
            marginBottom: 0.9,
            shadowColor: "#000",
            shadowOffset: { width: 1, height: 1 },
            elevation: 5,
            backgroundColor: "white",
          }}
        >
          <View
            style={{
              alignItems: "center",
              width: "90%",
              alignSelf: "center",
              flexDirection: "row",
            }}
          >
            <View style={{ width: "5%" }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
                }}
                style={{ width: "100%" }}
              >
                <Image
                  style={{
                    width: (mobileW * 8) / 100,
                    height: (mobileW * 8) / 100,
                    alignSelf: "center",
                  }}
                  source={
                    config.textalign == "right"
                      ? localimag.arabic_back
                      : localimag.backarrow
                  }
                ></Image>
              </TouchableOpacity>
            </View>
            <View style={{ width: "95%", alignSelf: "center" }}>
              <Text
                style={{
                  textAlign: config.textalign,
                  fontSize: (mobileW * 4.5) / 100,
                  color: Colors.textblack,
                  fontFamily: Font.buttonfontfamily,
                  alignSelf: "center",
                }}
              >
                {Lang_chg.supporttext[config.language]}{" "}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={{
            width: "100%",
            alignSelf: "center",
            flex: 1,
            backgroundColor: Colors.white_color,
          }}
        >
          <KeyboardAwareScrollView>
            <View
              style={{
                width: "100%",
                backgroundColor: Colors.tab_background_color,
                paddingVertical: (mobileW * 2) / 100,
              }}
            ></View>

            <View
              style={{
                alignItems: "center",
                width: "90%",
                alignSelf: "center",
                flexDirection: "row",
                marginTop: (mobileW * 3) / 100,
              }}
            >
              <View style={{ width: "8%", alignSelf: "center" }}>
                <Image
                  style={{
                    width: (mobileW * 5) / 100,
                    height: (mobileW * 5) / 100,
                    resizeMode: "contain",
                  }}
                  source={localimag.needsupportimg}
                ></Image>
              </View>

              <Text
                style={{
                  textAlign: config.textalign,
                  fontSize: (mobileW * 3.7) / 100,
                  color: Colors.textblack,
                  fontFamily: Font.buttonfontfamily,
                }}
              >
                {Lang_chg.needsupport[config.language]}{" "}
              </Text>
            </View>

            <View
              style={{
                width: "90%",
                alignSelf: "center",
                borderColor: Colors.bordercolor,
                borderBottomWidth: (mobileW * 0.3) / 100,
                marginTop: (mobileW * 3) / 100,
              }}
            />

            <View
              style={{
                width: "90%",
                alignSelf: "center",
                marginTop: (mobileW * 2) / 100,
              }}
            >
              <Text
                style={{
                  textAlign: config.textRotate,
                  fontSize: (mobileW * 3.5) / 100,
                  color: "#707070",
                  fontFamily: Font.fontregular,
                }}
              >
                {Lang_chg.need_text[config.language]}{" "}
              </Text>
            </View>

            <View
              style={{
                width: "90%",
                alignSelf: "center",
                marginTop: (mobileW * 4) / 100,
              }}
            >
              <Text
                style={{
                  textAlign: config.textRotate,
                  fontSize: (mobileW * 3.7) / 100,
                  color: Colors.textblack,
                  fontFamily: Font.buttonfontfamily,
                }}
              >
                {Lang_chg.select_topic_text[config.language]}{" "}
              </Text>
            </View>

            <View
              style={{
                width: "100%",
                alignSelf: "center",
                marginTop: (mobileW * 1) / 100,
                //flexDirection: 'row',
                // borderColor: Colors.bordercolor,
                // borderWidth: 1,
                // borderRadius: mobileW * 1 / 100
              }}
            >
              <DropDownboxSec
                lableText={
                  this.state.select.length <= 0
                    ? Lang_chg.select_issues_text[config.language]
                    : this.state.select
                }
                boxPressAction={() => {
                  this.setState({ selectmodal: true });
                }}
                // isDisabled={true}
              />
              {/* <TouchableOpacity onPress={() => {
                this.setState({ selectmodal: true });
              }}
                style={{ width: '100%', backgroundColor: Colors.backgroundcolor, borderRadius: mobileW * 1 / 100 }}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '95%', alignSelf: 'center' }}>
                  <Text
                    style={{ alignSelf: 'center', color: Colors.textblack, fontSize: Font.placeholdersize, textAlign: config.textRotate, paddingVertical: mobileW * 4 / 100, fontFamily: Font.placeholderfontfamily }}

                  >{this.state.select.length <= 0 ? Lang_chg.select_issues_text[config.language] : this.state.select}</Text>
                  <View style={{ width: '10%', alignSelf: 'center' }}>
                    <Image
                      source={localimag.downarrow}
                      style={{ height: mobileW * 4 / 100, width: mobileW * 4 / 100, alignSelf: 'flex-end' }}>
                    </Image>
                  </View>
                </View>
              </TouchableOpacity> */}
            </View>

            {/* <View
              style={{
                width: "90%",
                alignSelf: "center",
                marginTop: (mobileW * 3) / 100,
                // borderColor: this.state.selectissuefocus == true ? '#0057A5' : Colors.bordercolor, borderWidth: mobileW * 0.3 / 100, borderRadius: mobileW * 2 / 100, height: mobileW * 40 / 100
              }}
            >
            <AuthInputBoxSec
                mainContainer={{
                  width: "100%",
                }}
                inputFieldStyle={{
                  // marginTop: mobileW * 1 / 100,
                  // backgroundColor: "red",
                  width: "100%",
                  // height: (mobileW * 40) / 100,
                  color: Colors.textblack,
                  fontSize: Font.placeholdersize,
                  textAlign: config.textalign,
                  fontFamily: Font.placeholderfontfamily,
                  justifyContent: "flex-start",
                  textAlignVertical: "top",
                  // paddingVertical: mobileW * 3 / 100,
                }}
                // icon={layer9_icon}
                lableText={
                  this.state.selectissuefocus != true
                    ? Lang_chg.text_input_topic[config.language]
                    : null
                }
                inputRef={(ref) => {
                  this.messageInput = ref;
                }}
                onChangeText={(text) => this.setState({ message: text })}
                value={this.state.message}
                maxLength={250}
                multiline={true}
                keyboardType="default"
                autoCapitalize="none"
                returnKeyType="next"
                // onSubmitEditing={() => {
                //   this.emailInput.focus();
                // }}
              /> */}
            <View
              style={{
                width: "90%",
                alignSelf: "center",
                marginTop: (mobileW * 6) / 100,
                borderColor:
                  this.state.selectissuefocus == true
                    ? "#0057A5"
                    : Colors.bordercolor,
                borderWidth: (mobileW * 0.3) / 100,
                borderRadius: (mobileW * 2) / 100,
                height: (mobileW * 40) / 100,
              }}
            >
              <View style={{ width: "95%", alignSelf: "center" }}>
                <TextInput
                  style={{
                    // marginTop: (mobileW * 1) / 100,
                    backgroundColor: "#fff",
                    width: "100%",
                    color: Colors.textblack,
                    fontSize: Font.placeholdersize,
                    textAlign: config.textalign,
                    fontFamily: Font.placeholderfontfamily,
                    paddingVertical: (mobileW * 3) / 100,
                  }}
                  maxLength={250}
                  multiline={true}
                  placeholder={
                    this.state.selectissuefocus != true
                      ? Lang_chg.text_input_topic[config.language]
                      : null
                  }
                  placeholderTextColor={Colors.placeholder_text}
                  onChangeText={(txt) => {
                    this.setState({ message: txt });
                  }}
                  onFocus={() => {
                    this.setState({ selectissuefocus: true });
                  }}
                  onBlur={() => {
                    this.setState({
                      selectissuefocus:
                        this.state.message.length > 0 ? true : false,
                    });
                  }}
                  keyboardType="default"
                  returnKeyLabel="done"
                />
              </View>
              {this.state.selectissuefocus == true && (
                <View
                  style={{
                    position: "absolute",
                    backgroundColor: "white",
                    left: (mobileW * 4) / 100,
                    top: (-mobileW * 2) / 100,
                    paddingHorizontal: (mobileW * 1) / 100,
                  }}
                >
                  <Text
                    style={{ color: "#0057A5", textAlign: config.textalign }}
                  >
                    {Lang_chg.text_input_topic[config.language]}
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={() => {
                this.submit_click();
              }}
              style={{
                width: "90%",
                alignSelf: "center",
                borderRadius: (mobileW * 2) / 100,
                backgroundColor: Colors.buttoncolorblue,
                paddingVertical: (mobileW * 4) / 100,
                marginTop: (mobileW * 45) / 100,
              }}
            >
              <Text
                style={{
                  color: Colors.textwhite,
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
          </KeyboardAwareScrollView>
        </ScrollView>
      </View>
    );
  }
}
