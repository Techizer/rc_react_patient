import {
  Alert,
  Text,
  View,
  Image,
  Modal,
  TouchableOpacity,
  Linking,
  StatusBar,
} from "react-native";
import React, { Component } from "react";
import {
  Colors,
  Icons,
  Font,
  config,
  windowWidth,
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
import { SvgXml } from "react-native-svg";
import { Logo, Splash_Logo } from "../icons/SvgIcons/Index";
import { vs } from "react-native-size-matters";
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
  componentDidMount() { }
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

  checkAuthUserLogin = async (result, logindetail) => {
    // let result1 = await localStorage.getItemObject("user_signup");

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
          global.isLogin = true
          this.props.navigation.reset({
            index: 0,
            routes: [{ name: "DashboardStack" }],
          });

          // this.props.navigation.navigate("Home");
        } else {
          // this.props.navigation.navigate("Login");
          global.isLogin = false
          global.isPage = ""
          this.props.navigation.reset({
            index: 0,
            routes: [{ name: "AuthStack" }],
          });
        }
      })
      .catch((error) => {
        console.log("-------- error ------- " + error);
      });
  }

  checkLogout = async (result, logindetail) => {
    let user_id = result.user_id;
    let url = config.baseURL + "api-check-login";
    var data = new FormData();
    data.append("user_id", user_id);
    data.append("fcm_token", fcmtoken);
    console.log("url", url);
    console.log("data", data);
    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        console.log("obj checkLogout: ", obj);
        if (obj.result == true) {
          this.checkAuthUserLogin(result, logindetail);
        } else {
          this.logout()
        }
      })
      .catch((error) => {
        console.log("-------- error ------- " + error);
      });
  }

  logout = async () => {
    await localStorage.removeItem("user_arr");
    await localStorage.removeItem("user_login");
    global.isLogin = false
    global.isPage = ""
    this.props.navigation.reset({
      index: 0,
      routes: [{ name: "AuthStack" }],
    });
  };

  new_authenticatesessinon = async () => {
    let result = await localStorage.getItemObject("user_arr");
    let logindetail = await localStorage.getItemObject("user_login");
    console.log("splasedata", logindetail);
    if (result != null) {
      console.log("result ", result);
      this.checkLogout(result, logindetail)
    } else {
      global.isLogin = false
      global.isPage = ""
      this.props.navigation.reset({
        index: 0,
        routes: [{ name: "AuthStack" }],
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
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.White,
        }}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Colors.White}
          hidden={false}
          translucent={false}
          networkActivityIndicatorVisible={true}
        />
        {/* <SvgXml xml={Splash_Logo} /> */}

        <Image source={Icons.splashLogo} style={{height:windowWidth-100, height: windowWidth-100}} resizeMode='contain' />

        <View style={{ width: '50%', height: 1.5, backgroundColor: Colors.backgroundcolor, marginTop: vs(40) }}></View>

        <View
          style={{
            width: "50%",
            alignSelf: "center",
          }}>
          <Text
            style={{
              paddingVertical: vs(14),
              fontSize: Font.xlarge,
              color: Colors.lightGrey,
              fontFamily: Font.Regular,
              alignSelf: "center",
              textAlign: "center",
            }}
          >
            {Lang_chg.Splashtext1[this.state.language]}{" "}
          </Text>
        </View>

        <View style={{ width: '50%', height: 1.5, backgroundColor: Colors.backgroundcolor, marginTop: vs(15) }}></View>

        <View
          style={{
            width: "63%",
            alignSelf: "center",
            marginTop: vs(35),
          }}
        >
          <Text
            style={{
              fontSize: Font.medium,
              color: Colors.lightGrey,
              fontFamily: Font.Regular,
              alignSelf: "center",
              textAlign: "center",
            }}
          >
            {Lang_chg.Splashtext2[this.state.language]}{" "}
          </Text>
        </View>

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
                    width: (windowWidth * 80) / 100,
                    height: (windowWidth * 14) / 100,
                    paddingVertical: (windowWidth * 3) / 100,
                    marginTop: (windowWidth * 2) / 100,
                    paddingLeft: (windowWidth * 4) / 100,
                    flexDirection: "row",
                    //  backgroundColor: 'red'
                  }}
                >
                  {/* <Image style={{ 
                    width: windowWidth * 6 / 100, 
                    height: windowWidth * 6 / 100 }} source={require('./icons/logo.png')}></Image> */}
                  {/* <Text style={{ fontFamily: Font.Medium, color: '#000', fontSize: windowWidth * 5 / 100, paddingLeft: windowWidth * 4 / 100 }}>{this.state.updTitle}</Text> */}
                  <HTMLView
                    value={this.state.updTitle}
                    stylesheet={{
                      h3: {
                        fontFamily: Font.Regular,
                        color: Colors.Black, //'#000',
                        fontSize: (windowWidth * 4.8) / 100,
                        opacity: 0.9,
                        // color: '#FF3366', // make links coloured pink
                      },

                      paddingLeft: (windowWidth * 4) / 100,
                    }}
                  />
                </View>
                <View
                  style={{
                    alignSelf: "flex-start",
                    paddingVertical: (windowWidth * 1) / 100,
                    paddingLeft: (windowWidth * 4) / 100,
                    paddingRight: (windowWidth * 4) / 100,
                    flexDirection: "row",
                    alignItems: "center",
                    // backgroundColor: 'red'
                  }}
                >
                  {/* <Text style={{ fontFamily: Font.Regular, color: '#000', fontSize: windowWidth * 4 / 100, }}>{Lang_chg.logut_msg[config.language]}</Text> */}
                  <HTMLView
                    value={this.state.updText}
                    stylesheet={{
                      p: {
                        fontFamily: Font.Regular,
                        color: Colors.Black, //'#515C6F', //Colors.DarkGrey,
                        fontSize: (windowWidth * 4) / 100,
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
                    paddingBottom: (windowWidth * 5) / 100,
                    marginTop: (windowWidth * 9) / 100,
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
                        width: (windowWidth * 35) / 100,
                        flexDirection: "row",
                        alignSelf: "center",
                        justifyContent: "flex-end",
                        //backgroundColor: 'blue',
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: Font.Regular,
                          fontSize: (windowWidth * 3.8) / 100,
                          color: Colors.Theme, //Colors.Blue,
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
                      width: (windowWidth * 22) / 100,
                      height: (windowWidth * 8) / 100,
                      justifyContent: "center",
                      backgroundColor: "#549E36",
                      alignSelf: "flex-end",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Font.Regular,
                        fontSize: (windowWidth * 3.8) / 100,
                        color: Colors.White,
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
                      borderTopColor: Colors.lightGrey,
                      height: (windowWidth * 15) / 100,
                      // backgroundColor: 'red',
                      // justifyContent: 'flex-start',
                      // alignContent: 'center',
                      flexDirection: "row",
                      alignItems: "center",
                      // alignContent:'center',
                      // flex:1,
                      marginLeft: (windowWidth * 4) / 100,
                      marginRight: (windowWidth * 4) / 100,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Font.SemiBold,
                        fontSize: (windowWidth * 3.5) / 100,
                        color: Colors.placeholder_border,
                        // alignSelf: 'flex-start',
                        // justifyContent: 'flex-start',
                      }}
                    >
                      {Lang_chg.Help[config.language]}
                    </Text>
                    <Text
                      style={{
                        fontFamily: Font.SemiBold,
                        fontSize: (windowWidth * 3.5) / 100,
                        color: Colors.Theme,
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
