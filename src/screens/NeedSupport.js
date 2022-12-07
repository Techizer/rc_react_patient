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
  Font,
  msgProvider,
  msgText,
  config,
  localStorage,
  Lang_chg,
  apifuntion,
  msgTitle,
  consolepro,
  Icons,
  windowWidth,
} from "../Provider/utilslib/Utils";
import { AuthInputBoxSec, Button, DropDownboxSec } from "../components";
// import { Nodata_foundimage } from './Provider/Nodata_foundimage';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ScreenHeader from "../components/ScreenHeader";
import { leftArrow } from "../icons/SvgIcons/Index";
import { s, vs } from "react-native-size-matters";

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
          alignSelf: "center",
          flex: 1,
          backgroundColor: Colors.White,
        }} >

        <ScreenHeader
          title={Lang_chg.NeedSupport[config.language]}
          navigation={this.props.navigation}
          onBackPress={() => this.props.navigation.pop()}
          leftIcon
          rightIcon
        />


        <KeyboardAwareScrollView
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{
            justifyContent: 'center',
            paddingBottom: vs(50),
          }}
          showsVerticalScrollIndicator={false}>


          <View
            style={{
              width: "90%",
              alignSelf: "center",
            }}>
            <View
              style={{
                alignItems: "center",
                width: "100%",
                alignSelf: "center",
                flexDirection: "row",
                marginTop: vs(10),
              }}>
              <View style={{ width: "8%", alignSelf: "center" }}>
                <Image
                  style={{ width: 20, height: 20, resizeMode: "contain" }}
                  source={Icons.needsupportimg} />
              </View>

              <Text
                style={{
                  textAlign: config.textalign,
                  fontSize: Font.large,
                  color: Colors.Black,
                  fontFamily: Font.Medium,
                }}>
                {Lang_chg.needsupport[config.language]}{" "}
              </Text>
            </View>

            <View style={{ width: '100%', alignSelf: 'center', height: 1.5, backgroundColor: Colors.backgroundcolor, marginVertical: vs(10) }}></View>



            <Text
              style={{
                textAlign: config.textRotate,
                // fontSize: (windowWidth * 3.5) / 100,
                color: Colors.DarkGrey,
                fontFamily: Font.Regular,
              }} >
              {Lang_chg.need_text[config.language]}{" "}
            </Text>

            <Text
              style={{
                textAlign: config.textRotate,
                fontSize: Font.medium,
                color: Colors.Black,
                fontFamily: Font.Medium,
                marginTop: vs(10)
              }} >
              {Lang_chg.select_topic_text[config.language]}{" "}
            </Text>


            <DropDownboxSec
              lableText={
                this.state.select.length <= 0
                  ? Lang_chg.select_issues_text[config.language]
                  : this.state.select
              }
              boxPressAction={() => {
                this.setState({
                  selectmodal: true,
                  selectissuefocus: false
                });
              }}
              mainContainer={{ marginTop: vs(10) }}
            />

            <View
              style={{
                width: "100%",
                alignSelf: "center",
                marginTop: vs(15),
                borderColor: this.state.selectissuefocus ? Colors.Theme : Colors.Border,
                borderWidth: 1,
                borderRadius: 6,
                height: vs(125),
                paddingHorizontal: s(8),
                paddingVertical: s(4),
              }}>

              <TextInput
                style={{
                  width: "100%",
                  color: Colors.Black,
                  fontSize: Font.medium,
                  textAlign: config.textalign,
                  fontFamily: Font.Regular,
                }}
                maxLength={250}
                multiline={true}
                placeholder={Lang_chg.text_input_topic[config.language]}
                placeholderTextColor={Colors.MediumGrey}
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

            <Button
              text={Lang_chg.submitbtntext[config.language]}
              onPress={() => this.submit_click()}
            />

          </View>

        </KeyboardAwareScrollView>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.selectmodal}
          onRequestClose={() => { }}
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
              marginTop: (windowWidth * 3) / 100,
              paddingBottom: (windowWidth * 8) / 100,
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
                }}
              >
                <View
                  style={{ width: "45%", paddingVertical: (windowWidth * 3) / 100 }}
                >
                  <Text
                    style={{
                      textAlign: config.textalign,
                      fontFamily: Font.Regular,
                      fontSize: (windowWidth * 4) / 100,
                      alignSelf: "center",
                      color: Colors.White,
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
                                paddingVertical: (windowWidth * 2.5) / 100,
                                marginLeft: (windowWidth * 5) / 100,
                              }}
                            >
                              <Text
                                style={{
                                  color: Colors.Black,
                                  textAlign: config.textRotate,
                                  fontSize: (windowWidth * 4) / 100,
                                  paddingLeft: (windowWidth * 2) / 100,
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
          onRequestClose={() => { }}>
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
            }} >
            <View
              style={{
                width: "100%",
                backgroundColor: "White",
                borderRadius: (windowWidth * 4) / 100,
                position: "absolute",
                bottom: 0,
                alignItems: "center",
                justifyContent: "center",
                paddingBottom: (windowWidth * 5) / 100,
                alignSelf: "center",
              }}
            >
              {config.language == 0 ? (
                <Image
                  style={{
                    width: (windowWidth * 17) / 100,
                    height: (windowWidth * 17) / 100,
                    alignSelf: "center",
                    marginTop: (windowWidth * -7) / 100,
                    resizeMode: "contain",
                  }}
                  source={require("../icons/greentick.png")}
                />
              ) : (
                <Image
                  style={{
                    width: (windowWidth * 17) / 100,
                    height: (windowWidth * 17) / 100,
                    alignSelf: "center",
                    marginTop: (windowWidth * -7) / 100,
                    resizeMode: "contain",
                  }}
                  source={require("../icons/ryt_opp.png")}
                />
              )}
              <Text
                style={{
                  fontSize: (windowWidth * 8) / 100,
                  marginTop: (windowWidth * 5) / 100,
                  fontFamily: Font.Medium,
                  textAlign: config.textalign,
                }}
              >
                {Lang_chg.thank[config.language]}
              </Text>
              <Text
                style={{
                  fontSize: (windowWidth * 3.5) / 100,
                  marginTop: (windowWidth * 5) / 100,
                  fontFamily: Font.Medium,
                  textAlign: config.textalign,
                }}
              >
                {Lang_chg.success[config.language]}
              </Text>

              <Text
                style={{
                  fontSize: (windowWidth * 3) / 100,
                  marginTop: (windowWidth * 2) / 100,
                  fontFamily: Font.Medium,
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
                  borderColor: Colors.Blue,
                  borderWidth: 1,
                  paddingVertical: (windowWidth * 2) / 100,
                  marginTop: (windowWidth * 5) / 100,
                  borderRadius: (windowWidth * 3) / 100,
                }}
              >
                <Text
                  style={{
                    fontSize: (windowWidth * 3) / 100,
                    alignSelf: "center",
                    fontFamily: Font.Medium,
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
      </View>
    );
  }
}
