import {
    Text,
    Modal,
    Alert,
    View,
    Image,
    TouchableOpacity,
  } from "react-native";
  import React, { Component } from "react";
  import {
    Colors,
    Icons,
    Font,
    msgProvider,
    config,
    windowWidth,
    localStorage,
    Lang_chg,
    apifuntion,
    msgTitle,
    consolepro,
  } from "../Provider/utilslib/Utils";
  
  export default class SupportandMore extends Component {
    constructor(props) {
      super(props);
      this.state = {
        engbtn: true,
        modalVisible3: false,
        langaugeme: 0,
        device_lang: "AR",
      };
  
      this.get_language();
    }
    get_language = async () => {
      let textalign = await localStorage.getItemObject("language");
      if (textalign != null) {
        this.setState({ langaugeme: textalign });
      }
    };
  
    componentDidMount() {
      this.props.navigation.addListener("focus", () => {
        this.get_language();
      });
    }
    launguage_setbtn = (language) => {
      console.log("Welcome");
      Lang_chg.language_set(language);
      setTimeout(() => {
        this.submit_click();
      }, 700);
      this.setState({
        engbtn: !this.state.engbtn,
        //   engbtn_ar:!this.state.engbtn_ar
      });
    };
  
    submit_click = async () => {
      let user_details = await localStorage.getItemObject("user_arr");
      console.log("user_details user_details", user_details);
      let user_id = user_details["user_id"];
  
      let url = config.baseURL + "api-language-update";
      console.log("url", url);
      var data = new FormData();
      data.append("login_user_id", user_id);
      data.append("device_lang", this.state.device_lang);
  
      consolepro.consolelog("data", data);
      apifuntion
        .postApi(url, data, 1)
        .then((obj) => {
          consolepro.consolelog("obj", obj);
          if (obj.status == true) {
            console.log("result", obj.result);
            let result = obj.result;
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
    confireClick(title, message, callbackOk, callbackCancel) {
      Alert.alert(
        Lang_chg.Delete_account[config.language],
        Lang_chg.Are_you_sure[config.language],
        // "Do you want to logout ?",
        [
          {
            text: Lang_chg.no_txt[config.language],
          },
          {
            text: Lang_chg.yes_txt[config.language],
            onPress: () => this.delete_click(),
          },
        ],
        { cancelable: false }
      );
    }
    delete_click = async () => {
      let user_details = await localStorage.getItemObject("user_arr");
      console.log("user_details user_details", user_details);
      let user_id = user_details["user_id"];
  
      let url = config.baseURL + "api-delete-user";
      console.log("url", url);
      var data = new FormData();
      data.append("user_id", user_id);
  
      consolepro.consolelog("data", data);
      apifuntion
        .postApi(url, data, 1)
        .then((obj) => {
          consolepro.consolelog("obj", obj);
          if (obj.status == true) {
            localStorage.removeItem("user_arr");
            localStorage.removeItem("user_login");
            this.props.navigation.navigate("Login");
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
            backgroundColor: Colors.white,
          }}
        >
  
          <View
            style={{
              width: "90%",
              alignSelf: "center",
              marginTop: (windowWidth * 3) / 100,
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
                    width: (windowWidth * 8) / 100,
                    height: (windowWidth * 8) / 100,
                    alignSelf: "center",
                  }}
                  source={
                    config.textalign == "right"
                      ? Icons.arabic_back
                      : Icons.backarrow
                  }
                ></Image>
              </TouchableOpacity>
            </View>
            <View style={{ width: "95%", alignSelf: "center" }}>
              <Text
                style={{
                  textAlign: config.textalign,
                  fontSize: (windowWidth * 4.5) / 100,
                  color: Colors.textblack,
                  fontFamily: Font.fontmedium,
                  alignSelf: "center",
                }}
              >
                {Lang_chg.supporttext[config.language]}{" "}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: "55%",
              alignSelf: "center",
              marginRight: (windowWidth * 2) / 100,
              marginTop: (windowWidth * 10) / 100,
            }}
          >
            <Image
              style={{
                height: (windowWidth * 30) / 100,
                width: (windowWidth * 45) / 100,
                resizeMode: "contain",
                alignSelf: "center",
                alignItems: "center",
              }}
              source={Icons.Forgotlogo}
            ></Image>
          </View>
  
          <View
            style={{
              width: "45%",
              alignSelf: "center",
              borderColor: Colors.bordercolor,
              borderBottomWidth: (windowWidth * 0.3) / 100,
            }}
          ></View>
  
          <View
            style={{
              width: "45%",
              alignSelf: "center",
              marginTop: (windowWidth * 3) / 100,
            }}
          >
            <View style={{ width: "100%" }}>
              <Text
                style={{
                  fontSize: (windowWidth * 4.2) / 100,
                  color: Colors.lightGrey,
                  fontFamily: Font.fontregular,
                  alignSelf: "center",
                  textAlign: "center",
                  marginTop: (windowWidth * 0.5) / 100,
                }}
              >
                {Lang_chg.the_best_company[config.language]}{" "}
              </Text>
              <Text
                style={{
                  fontSize: (windowWidth * 4.2) / 100,
                  color: Colors.lightGrey,
                  fontFamily: Font.fontregular,
                  alignSelf: "center",
                  textAlign: "center",
                  marginTop: (windowWidth * 0.5) / 100,
                }}
              >
                {Lang_chg.for_mediical[config.language]}{" "}
              </Text>
              <Text
                style={{
                  fontSize: (windowWidth * 4.2) / 100,
                  color: Colors.lightGrey,
                  fontFamily: Font.fontregular,
                  alignSelf: "center",
                  textAlign: "center",
                  marginTop: (windowWidth * 0.5) / 100,
                }}
              >
                {Lang_chg.home_helth[config.language]}{" "}
              </Text>
            </View>
          </View>
  
          <View
            style={{
              width: "45%",
              alignSelf: "center",
              borderColor: Colors.bordercolor,
              borderBottomWidth: (windowWidth * 0.3) / 100,
              marginTop: (windowWidth * 5) / 100,
            }}
          ></View>
  
          {/* <View style={{width:'40%',alignSelf:'center',marginTop:windowWidth*3/100}}>
                          <Text style={{textAlign:config.textalign,fontSize:windowWidth*4/100,color:Colors.Border,fontFamily:Font.fontregular,alignSelf:'center'}}>{Lang_chg.drawerversion[config.language]}</Text> 
                      </View> */}
  
          <View
            style={{
              width: "90%",
              alignSelf: "center",
              marginTop: (windowWidth * 7) / 100,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                textAlign: config.textalign,
                fontSize: (windowWidth * 3.8) / 100,
                color: Colors.DarkGrey,
                fontFamily: Font.ques_fontfamily,
              }}
            >
              {Lang_chg.languagetxt[config.language]}{" "}
            </Text>
  
            <View
              style={{
                width: "40%",
                alignSelf: "flex-end",
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  if (this.state.langaugeme == 1) {
                    this.setState({
                      engbtn: true,
                      modalVisible3: true,
                      device_lang: "ENG",
                    });
                  } else {
                    null;
                  }
                }}
                style={{
                  width: "50%",
                  alignSelf: "center",
                  backgroundColor:
                    this.state.langaugeme == 0
                      ? Colors.buttonbackgoungcolorlightblue
                      : "#fff",
                  borderColor: "black",
                  borderBottomWidth: 1,
                  borderTopWidth: 1,
                  borderLeftWidth: 1,
                  paddingVertical: (windowWidth * 1.5) / 100,
                  borderBottomLeftRadius: (windowWidth * 1) / 100,
                  borderTopLeftRadius: (windowWidth * 1) / 100,
                }}
              >
                {/* <TouchableOpacity onPress={()=>{if(this.state.langaugeme == 1){
                                        this.setState({engbtn:true,modalVisible3:true,device_lang:'ENG'})}
                                   else{
                                     null
                                   }
                                   }}
                                 style={{width:'100%',backgroundColor:'red'}}> */}
                <Text
                  style={{
                    textAlign: config.textalign,
                    fontSize: (windowWidth * 3.5) / 100,
                    color: Colors.DarkGrey,
                    fontFamily: Font.ques_fontfamily,
                    alignSelf: "center",
                  }}
                >
                  ENG
                </Text>
                {/* </TouchableOpacity> */}
              </TouchableOpacity>
  
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  if (this.state.langaugeme == 0) {
                    this.setState({
                      engbtn: false,
                      modalVisible3: true,
                      device_lang: "AR",
                    });
                  } else {
                    null;
                  }
                }}
                style={{
                  width: "50%",
                  alignSelf: "center",
                  backgroundColor:
                    this.state.langaugeme == 0
                      ? "#fff"
                      : Colors.buttonbackgoungcolorlightblue,
                  borderColor: "#fff",
                  borderColor: "black",
                  borderWidth: 1,
                  paddingVertical: (windowWidth * 1.5) / 100,
                  borderTopRightRadius: (windowWidth * 1) / 100,
                  borderBottomRightRadius: (windowWidth * 1) / 100,
                }}
              >
                {/* <TouchableOpacity onPress={()=>{if(this.state.langaugeme == 0){
                                         this.setState({engbtn:false,modalVisible3:true,device_lang:'AR'})}
                                   else{
                                     null
                                   }
                                   }}
                                    style={{width:'100%'}}> */}
  
                <Text
                  style={{
                    textAlign: config.textalign,
                    fontSize: (windowWidth * 3.5) / 100,
                    color: Colors.DarkGrey,
                    fontFamily: Font.ques_fontfamily,
                    alignSelf: "center",
                  }}
                >
                  AR
                </Text>
                {/* </TouchableOpacity> */}
              </TouchableOpacity>
            </View>
          </View>
  
          <View
            style={{
              width: "95%",
              alignSelf: "flex-end",
              borderColor: Colors.bordercolor,
              borderBottomWidth: (windowWidth * 0.3) / 100,
              marginTop: (windowWidth * 5) / 100,
            }}
          ></View>
  
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("Tremsandcondition", {
                contantpage: 2,
                content: config.term_url_eng, //'https://teq-dev-var19.co.in/rootscare/terms-and-conditions/eng',
                content_ar: config.term_url_ar,
              });
            }}
            style={{
              width: "90%",
              justifyContent: "space-between",
              alignSelf: "center",
              marginTop: (windowWidth * 5) / 100,
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                textAlign: config.textalign,
                fontSize: (windowWidth * 3.8) / 100,
                color: Colors.DarkGrey,
                fontFamily: Font.ques_fontfamily,
              }}
            >
              {Lang_chg.termtxt[config.language]}{" "}
            </Text>
  
            <View style={{ width: "5%", alignSelf: "center" }}>
              <View style={{ width: "100%", alignSelf: "center" }}>
                <Image
                  style={{
                    width: (windowWidth * 3.5) / 100,
                    height: (windowWidth * 3.5) / 100,
                    alignSelf: "center",
                    resizeMode: "contain",
                    tintColor: Colors.DarkGrey,
                  }}
                  source={
                    config.textalign == "right"
                      ? Icons.arabic_next
                      : Icons.forwardarrow
                  }
                ></Image>
              </View>
            </View>
          </TouchableOpacity>
  
          <View
            style={{
              width: "95%",
              alignSelf: "flex-end",
              borderColor: Colors.bordercolor,
              borderBottomWidth: (windowWidth * 0.3) / 100,
              marginTop: (windowWidth * 5) / 100,
            }}
          ></View>
  
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("Tremsandcondition", {
                contantpage: 0,
                content: config.about_url_eng,
                content_ar: config.about_url_ar,
              });
            }}
            style={{
              width: "90%",
              alignSelf: "center",
              marginTop: (windowWidth * 5) / 100,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                textAlign: config.textalign,
                fontSize: (windowWidth * 3.8) / 100,
                color: Colors.DarkGrey,
                fontFamily: Font.ques_fontfamily,
              }}
            >
              {Lang_chg.aboutrootcare[config.language]}{" "}
            </Text>
  
            <View style={{ width: "5%", alignSelf: "center" }}>
              <Image
                style={{
                  width: (windowWidth * 3.5) / 100,
                  height: (windowWidth * 3.5) / 100,
                  alignSelf: "center",
                  resizeMode: "contain",
                  tintColor: Colors.DarkGrey,
                }}
                source={
                  config.textalign == "right"
                    ? Icons.arabic_next
                    : Icons.forwardarrow
                }
              ></Image>
            </View>
          </TouchableOpacity>
  
          <View
            style={{
              width: "95%",
              alignSelf: "flex-end",
              borderColor: Colors.bordercolor,
              borderBottomWidth: (windowWidth * 0.3) / 100,
              marginTop: (windowWidth * 5) / 100,
            }}
          ></View>
  
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("Tremsandcondition", {
                contantpage: 1,
                content: config.privacy_url_eng,
                content_ar: config.privacy_url_ar,
              });
            }}
            style={{
              width: "90%",
              alignSelf: "center",
              marginTop: (windowWidth * 5) / 100,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                textAlign: config.textalign,
                fontSize: (windowWidth * 3.8) / 100,
                color: Colors.DarkGrey,
                fontFamily: Font.ques_fontfamily,
              }}
            >
              {Lang_chg.privacy[config.language]}{" "}
            </Text>
  
            <View style={{ width: "5%", alignSelf: "center" }}>
              <View style={{ width: "100%", alignSelf: "center" }}>
                <Image
                  style={{
                    width: (windowWidth * 3.5) / 100,
                    height: (windowWidth * 3.5) / 100,
                    alignSelf: "center",
                    resizeMode: "contain",
                    tintColor: Colors.DarkGrey,
                  }}
                  source={
                    config.textalign == "right"
                      ? Icons.arabic_next
                      : Icons.forwardarrow
                  }
                ></Image>
              </View>
            </View>
          </TouchableOpacity>
  
          <View
            style={{
              width: "95%",
              alignSelf: "flex-end",
              borderColor: Colors.bordercolor,
              borderBottomWidth: (windowWidth * 0.3) / 100,
              marginTop: (windowWidth * 5) / 100,
            }}
          ></View>
          <TouchableOpacity
            onPress={() => {
              this.confireClick();
            }}
            style={{
              width: "90%",
              alignSelf: "center",
              marginTop: (windowWidth * 5) / 100,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                textAlign: config.textalign,
                fontSize: (windowWidth * 3.8) / 100,
                color: Colors.DarkGrey,
                fontFamily: Font.ques_fontfamily,
              }}
            >
              {Lang_chg.Delete_account[config.language]}{" "}
            </Text>
  
            <View style={{ width: "5%", alignSelf: "center" }}>
              <View style={{ width: "100%", alignSelf: "center" }}>
                <Image
                  style={{
                    width: (windowWidth * 3.5) / 100,
                    height: (windowWidth * 3.5) / 100,
                    alignSelf: "center",
                    resizeMode: "contain",
                    tintColor: Colors.DarkGrey,
                  }}
                  source={
                    config.textalign == "right"
                      ? Icons.arabic_next
                      : Icons.forwardarrow
                  }
                ></Image>
              </View>
            </View>
          </TouchableOpacity>
  
          <View
            style={{
              width: "95%",
              alignSelf: "flex-end",
              borderColor: Colors.bordercolor,
              borderBottomWidth: (windowWidth * 0.3) / 100,
              marginTop: (windowWidth * 5) / 100,
            }}
          ></View>
  
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("NeedSupport");
            }}
            style={{
              justifyContent: "space-between",
              width: "90%",
              alignSelf: "center",
              marginTop: (windowWidth * 5) / 100,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: "8%",
                  alignSelf: "center",
                  marginRight: (windowWidth * 3) / 100,
                }}
              >
                <Image
                  style={{ width: 20, height: 20, resizeMode: "contain" }}
                  source={Icons.needsupportimg}
                ></Image>
              </View>
  
              <Text
                style={{
                  textAlign: config.textalign,
                  fontSize: (windowWidth * 4) / 100,
                  color: Colors.textblack,
                  fontFamily: Font.fontsemibold,
                }}
              >
                {Lang_chg.needsupport[config.language]}{" "}
              </Text>
            </View>
            <View style={{ width: "12%", alignSelf: "center" }}>
              <Image
                style={{
                  width: (windowWidth * 3.5) / 100,
                  height: (windowWidth * 3.5) / 100,
                  alignSelf: "flex-end",
                  resizeMode: "contain",
                  tintColor: Colors.DarkGrey,
                }}
                source={
                  config.textalign == "right"
                    ? Icons.arabic_next
                    : Icons.forwardarrow
                }
              ></Image>
            </View>
          </TouchableOpacity>
  
          <View
            style={{
              width: "95%",
              alignSelf: "flex-end",
              borderColor: Colors.bordercolor,
              borderBottomWidth: (windowWidth * 0.3) / 100,
              marginTop: (windowWidth * 5) / 100,
            }}
          ></View>
  
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.modalVisible3}
            onRequestClose={() => {
              this.setState({ modalVisible3: false });
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ modalVisible3: false });
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
                      width: (windowWidth * 60) / 100,
                      paddingVertical: (windowWidth * 3) / 100,
                      marginTop: (windowWidth * 2) / 100,
                      paddingLeft: (windowWidth * 4) / 100,
                      flexDirection: "row",
                    }}
                  >
                    <Image
                      style={{
                        width: (windowWidth * 6) / 100,
                        height: (windowWidth * 6) / 100,
                      }}
                      source={require("../icons/logo.png")}
                    />
                    <Text
                      style={{
                        fontFamily: Font.fontmedium,
                        color: "#000",
                        fontSize: (windowWidth * 5) / 100,
                        paddingLeft: (windowWidth * 3) / 100,
                      }}
                    >
                      {Lang_chg.Lang_change[config.language]}
                    </Text>
                  </View>
  
                  <View
                    style={{
                      alignSelf: "flex-start",
                      paddingVertical: (windowWidth * 1) / 100,
                      paddingLeft: (windowWidth * 4) / 100,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        paddingVertical: (windowWidth * 1) / 100,
                        paddingLeft: (windowWidth * 4) / 100,
                        fontFamily: Font.fontregular,
                        color: "#000",
                        fontSize: (windowWidth * 4) / 100,
                        width: "90%",
                      }}
                    >
                      {Lang_chg.Lang_change_msg[config.language]}
                    </Text>
                  </View>
  
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      width: "40%",
                      paddingBottom: (windowWidth * 5) / 100,
                      marginTop: (windowWidth * 7) / 100,
                      alignSelf: "flex-end",
                      right: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ modalVisible3: false });
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
                          color: Colors.bordercolorblue,
                          alignSelf: "center",
                        }}
                      >
                        {Lang_chg.no_txt[config.language]}
                      </Text>
                    </TouchableOpacity>
  
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ modalVisible3: false });
                        if (this.state.langaugeme == 1) {
                          this.launguage_setbtn(0);
                        } else {
                          this.launguage_setbtn(1);
                        }
                      }}
                      activeOpacity={0.8}
                      style={{
                        width: (windowWidth * 20) / 100,
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: Font.fontregular,
                          fontSize: (windowWidth * 4) / 100,
                          color: Colors.bordercolorblue,
                          alignSelf: "center",
                        }}
                      >
                        {Lang_chg.Restart[config.language]}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      );
    }
  }
  