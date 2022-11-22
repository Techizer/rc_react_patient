import {
  Alert,
  Text,
  View,
  Image,
  StatusBar,
  Modal,
  TouchableOpacity,
  Linking,
} from "react-native";
import React, { Component } from "react";
import {
  Colors,
  localimag,
  Font,
  config,
  mobileW,
  localStorage,
  Lang_chg,
  apifuntion,
  consolepro,
} from "../Provider/utilslib/Utils";
global.add_location = "NA";
global.amount_total = 0;
global.username = "NA";
import HTMLView from "react-native-htmlview";
import DeviceInfo from "react-native-device-info";
const appVersion = DeviceInfo.getVersion();

export default class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      engbtn: true,
      device_lang: "AR",
      fcm_token: 123456,
      language: 1,
      openAppScreen: undefined,
      modalVisible3: false,
    };

    this.language_fun();
    add_location = "NA";

    console.log("App Version", appVersion);
  }
  componentDidMount() {}
  language_fun = async () => {
    let textalign = await localStorage.getItemObject("language");

    if (textalign != null) {
      if (textalign == 1) {
        config.textalign = "right";
        // config.textalign = 'left';
        config.language = 1;
        this.setState(
          {
            language: 1,
          },
          () => {
            this.authenticateSession();
          }
        );
      } else {
        localStorage.setItemObject("languagesetenglish", 3);
        localStorage.setItemObject("languagecathc", 0);
        config.textalign = "left";
        config.language = 0;
        this.setState({ language: 0 }, () => {
          this.authenticateSession();
        });
      }
    } else {
      config.textalign = "right";
      config.language = 1;
      localStorage.setItemObject("language", 1);
      this.setState({ language: 1 }, () => {
        this.authenticateSession();
      });
    }
  };
  authenticateSession = async () => {
    this.apiIosPatientUpdate();
    // setTimeout(() => {
    //   if (this.state.openAppScreen == undefined) {
    //     this.apiIosPatientUpdate()
    //   }
    //   // this.new_authenticatesessinon()
    // }, 2000);
  };

  apiIosPatientUpdate = async () => {
    let lang = this.state.language == 1 ? "AR" : "ENG";
    let url =
      config.baseURL + "api-ios-patient-update" + "?divice_lang=" + lang;
    console.log("url", url, config.language);
    // var data = new FormData();
    // data.append('divice_lang',"AR")

    // consolepro.consolelog('data', data)
    apifuntion
      .getApi(url, 1)
      .then((obj) => {
        consolepro.consolelog("obj", obj);
        if (obj.status == true) {
          if (parseFloat(obj.result.appVer) > parseFloat(appVersion)) {
            this.setState({
              appVer: obj.result.appVer,
              updTitle: "<h3>" + obj.result.updTitle + "</h3>",
              updText: "<p>" + obj.result.updText + "</p>",
              skipFlag: obj.result.skipFlag,
              skipText: obj.result.skipText,
              rdrTo: obj.result.rdrTo,
              rdrUrl: obj.result.rdrUrl,
              showHelp: obj.result.showHelp,
              helpTitle: obj.result.helpTitle,
              helpUrl: obj.result.helpUrl,
              modalVisible3: true,
            });
          } else {
            this.checkAuth();
          }

          console.log("get area", obj.result);
        } else {
          this.checkAuth();
          return false;
        }
      })
      .catch((error) => {
        this.checkAuth();
        console.log("-------- error ------- " + error);
      });
  };

  checkAuth = () => {
    setTimeout(() => {
      this.new_authenticatesessinon();
    }, 2000);
  };

  new_authenticatesessinon = async () => {
    let result = await localStorage.getItemObject("user_arr");
    let logindetail = await localStorage.getItemObject("user_login");
    console.log("splasedata", logindetail);
    if (result != null) {
      console.log("result ", result);
      //  if(result.otp_verify == 1)
      //  {
      //&& result.profile_complete==0

      let result1 = await localStorage.getItemObject("user_signup");

      let email = logindetail.email_phone;
      let password = logindetail.password;
      let user_type = result.user_type;
      var device_lang;
      if (config.language == 0) {
        device_lang = "ENG";
      } else {
        device_lang = "AR";
      }
      let url = config.baseURL + "api-patient-login";
      var data = new FormData();

      data.append("email_phone", email);
      data.append("password", password);
      data.append("device_type", config.device_type);
      data.append("device_lang", device_lang);
      data.append("fcm_token", fcmtoken);

      console.log("data", data);
      apifuntion
        .postApi(url, data)
        .then((obj) => {
          console.log("obj", obj);
          if (obj.status == true) {
            var user_details = obj.result;
            localStorage.setItemObject("user_arr", user_details);

            this.props.navigation.reset({
              index: 0,
              routes: [{ name: "Home" }],
            });

            // this.props.navigation.navigate("Home");
          } else {
            // this.props.navigation.navigate("Login");
            this.props.navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          }
        })
        .catch((error) => {
          console.log("-------- error ------- " + error);
        });
    } else {
      this.props.navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
      // this.props.navigation.navigate("Login");
    }
  };

  openAppStoreUrl = async (url) => {
    const supported = await Linking.canOpenURL(url);
    console.log("supported:: ", supported, url);
    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
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

        <Image
          style={{
            height: (mobileW * 80) / 100,
            width: (mobileW * 95) / 100,
            resizeMode: "contain",
            alignSelf: "center",
            marginTop: (mobileW * 15) / 100,
          }}
          source={localimag.splashlogo}
        ></Image>

        <View
          style={{
            width: "50%",
            alignSelf: "center",
            borderColor: Colors.bordercolor,
            borderBottomWidth: (mobileW * 0.3) / 100,
            marginTop: (mobileW * 6) / 100,
          }}
        ></View>

        <View
          style={{
            width: "50%",
            alignSelf: "center",
            marginTop: (mobileW * 3) / 100,
          }}
        >
          <Text
            style={{
              marginTop: (mobileW * 0.5) / 100,
              fontSize: (mobileW * 4) / 100,
              color: Colors.splashtextcolor,
              fontFamily: Font.fontregular,
              alignSelf: "center",
              textAlign: "center",
            }}
          >
            {Lang_chg.Splashtext1[this.state.language]}{" "}
          </Text>
          {/* <Text style={{marginTop:mobileW*0.5/100,fontSize:mobileW*4/100,color:Colors.splashtextcolor,fontFamily:Font.fontregular,alignSelf:'center',textAlign:'center',marginTop:mobileW*4/100}}>{Lang_chg.Splashtext_two[this.state.language]} </Text> 
              <Text style={{marginTop:mobileW*0.5/100,fontSize:mobileW*4/100,color:Colors.splashtextcolor,fontFamily:Font.fontregular,alignSelf:'center',textAlign:'center'}}>{Lang_chg.Splashtext_three[this.state.language]} </Text>  */}
        </View>

        <View
          style={{
            width: "50%",
            alignSelf: "center",
            borderColor: Colors.bordercolor,
            borderBottomWidth: (mobileW * 0.3) / 100,
            marginTop: (mobileW * 6) / 100,
          }}
        ></View>

        <View
          style={{
            width: "63%",
            alignSelf: "center",
            marginTop: (mobileW * 4) / 100,
          }}
        >
          <Text
            style={{
              marginTop: (mobileW * 0.5) / 100,
              fontSize: (mobileW * 4) / 100,
              color: Colors.splashtextcolor,
              fontFamily: Font.fontregular,
              alignSelf: "center",
              textAlign: "center",
            }}
          >
            {Lang_chg.Splashtext2[this.state.language]}{" "}
          </Text>
        </View>
        {/* <View style={{alignSelf:'center',borderColor:Colors.bordercolor,borderWidth:0.5,paddingVertical:mobileW*8/100,marginTop:mobileW*2/100,marginBottom:mobileW*2/100}}>


            </View>
             <Text style={{textAlign:config.textalign,fontSize:mobileW*4/100,marginTop:mobileW*4/100,color:Colors.splashtextcolor,fontFamily:Font.fontmedium,alignSelf:'center',textAlign:'center'}}>V1.0</Text>  */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible3}
          onRequestClose={() => {
            this.setState({ modalVisible3: false });
          }}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            disabled={true}
            onPress={() => {
              // this.setState({ modalVisible3: false })
            }}
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
                    width: (mobileW * 80) / 100,
                    height: (mobileW * 14) / 100,
                    paddingVertical: (mobileW * 3) / 100,
                    marginTop: (mobileW * 2) / 100,
                    paddingLeft: (mobileW * 4) / 100,
                    flexDirection: "row",
                    //  backgroundColor: 'red'
                  }}
                >
                  {/* <Image style={{ 
                    width: mobileW * 6 / 100, 
                    height: mobileW * 6 / 100 }} source={require('./icons/logo.png')}></Image> */}
                  {/* <Text style={{ fontFamily: Font.fontmedium, color: '#000', fontSize: mobileW * 5 / 100, paddingLeft: mobileW * 4 / 100 }}>{this.state.updTitle}</Text> */}
                  <HTMLView
                    value={this.state.updTitle}
                    stylesheet={{
                      h3: {
                        fontFamily: Font.fontregular,
                        color: Colors.textblack, //'#000',
                        fontSize: (mobileW * 4.8) / 100,
                        opacity: 0.9,
                        // color: '#FF3366', // make links coloured pink
                      },

                      paddingLeft: (mobileW * 4) / 100,
                    }}
                  />
                </View>
                <View
                  style={{
                    alignSelf: "flex-start",
                    paddingVertical: (mobileW * 1) / 100,
                    paddingLeft: (mobileW * 4) / 100,
                    paddingRight: (mobileW * 4) / 100,
                    flexDirection: "row",
                    alignItems: "center",
                    // backgroundColor: 'red'
                  }}
                >
                  {/* <Text style={{ fontFamily: Font.fontregular, color: '#000', fontSize: mobileW * 4 / 100, }}>{Lang_chg.logut_msg[config.language]}</Text> */}
                  <HTMLView
                    value={this.state.updText}
                    stylesheet={{
                      p: {
                        fontFamily: Font.fontregular,
                        color: Colors.textblack, //'#515C6F', //Colors.placeholder_text,
                        fontSize: (mobileW * 4) / 100,
                        textAlign: "left",
                        opacity: 0.9,
                        // color: '#FF3366', // make links coloured pink
                      },
                    }}
                  />
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: this.state.skipFlag
                      ? "space-between"
                      : "flex-end",
                    width: "70%",
                    paddingBottom: (mobileW * 5) / 100,
                    marginTop: (mobileW * 9) / 100,
                    alignSelf: "flex-end",
                    right: 16,
                    // backgroundColor: 'red'
                  }}
                >
                  {this.state.skipFlag && (
                    <TouchableOpacity
                      onPress={() => {
                        this.setState(
                          {
                            modalVisible3: false,
                          },
                          () => {
                            this.new_authenticatesessinon();
                          }
                        );
                      }}
                      style={{
                        width: (mobileW * 35) / 100,
                        flexDirection: "row",
                        alignSelf: "center",
                        justifyContent: "flex-end",
                        //backgroundColor: 'blue',
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: Font.fontregular,
                          fontSize: (mobileW * 3.8) / 100,
                          color: Colors.terms_text_color_blue, //Colors.bordercolorblue,
                          alignSelf: "center",
                        }}
                      >
                        {this.state.skipText}
                      </Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={() => {
                      // this.setState({ modalVisible3: false }),
                      this.openAppStoreUrl(this.state.rdrUrl);
                    }}
                    activeOpacity={0.8}
                    style={{
                      width: (mobileW * 22) / 100,
                      height: (mobileW * 8) / 100,
                      justifyContent: "center",
                      backgroundColor: "#549E36",
                      alignSelf: "flex-end",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Font.fontregular,
                        fontSize: (mobileW * 3.8) / 100,
                        color: Colors.white_color,
                        alignSelf: "center",
                      }}
                    >
                      {Lang_chg.Update[config.language]}
                    </Text>
                  </TouchableOpacity>
                </View>
                {this.state.showHelp && (
                  <View
                    style={{
                      borderTopWidth: 1,
                      borderTopColor: Colors.gray5,
                      height: (mobileW * 15) / 100,
                      // backgroundColor: 'red',
                      // justifyContent: 'flex-start',
                      // alignContent: 'center',
                      flexDirection: "row",
                      alignItems: "center",
                      // alignContent:'center',
                      // flex:1,
                      marginLeft: (mobileW * 4) / 100,
                      marginRight: (mobileW * 4) / 100,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Font.fontsemibold,
                        fontSize: (mobileW * 3.5) / 100,
                        color: Colors.placeholder_border,
                        // alignSelf: 'flex-start',
                        // justifyContent: 'flex-start',
                      }}
                    >
                      {Lang_chg.Help[config.language]}
                    </Text>
                    <Text
                      style={{
                        fontFamily: Font.fontsemibold,
                        fontSize: (mobileW * 3.5) / 100,
                        color: Colors.terms_text_color_blue,
                        marginLeft: 6,
                        // alignSelf: 'flex-start',
                        // justifyContent: 'flex-start',
                        // textalign: 'left'
                      }}
                      onPress={() => {
                        this.openAppStoreUrl(this.state.helpUrl);
                      }}
                    >
                      {this.state.helpUrl}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}
