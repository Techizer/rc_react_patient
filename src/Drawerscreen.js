import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ImageBackground,
  Modal,
  StatusBar,
} from "react-native";
import {
  Colors,
  Font,
  msgProvider,
  config,
  mobileW,
  localStorage,
  localimag,
  consolepro,
  Lang_chg,
  apifuntion,
} from "./Provider/utilslib/Utils";
import Styles from "./Styles";
import { DrawerActions } from "@react-navigation/native";
global.add_location = "NA";
export default class Drawerscreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible3: false,
      address_new: "NA",
      address_old: "",
    };

    //    add_location='NA'
  }
  componentDidMount() {
    this.props.navigation.addListener("focus", () => {
      consolepro.consolelog(" add_location = data2", add_location);
      if (add_location != "NA") {
        this.setState({
          address_new: add_location.address,
          latitude: add_location.latitude,
          longitude: add_location.longitude,
        });
      }
      console.log("address_new", add_location.address);
      this.getProfile();
    });
  }

  getProfile = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    let address_arr = await localStorage.getItemObject("address_arr");
    console.log("user_details user_details", user_details);
    console.log("address_arr", address_arr);

    this.setState({
      name: user_details["first_name"],
      email: user_details["email"],
      mobile: user_details["phone_number"],
      address_new: address_arr,
      address_old: user_details["current_address"],
    });
    if (user_details.image != null) {
      this.setState({
        profile_img: config.img_url3 + user_details["image"],
      });
    }
  };

  confirm_click = async () => {
    this.logoutApi();
  };
  logout = async () => {
    await localStorage.removeItem("user_arr");
    await localStorage.removeItem("user_login");
    // await localStorage.removeItem('password');
    // await localStorage.clear();
    this.setState({ show: false });
    this.props.navigation.navigate("Login");
  };
  logoutApi = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    console.log("user_details user_details", user_details);
    let user_id = user_details["user_id"];

    let url = config.baseURL + "api-logout";
    console.log("url", url);
    var data = new FormData();
    data.append("user_id", user_id);

    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        consolepro.consolelog("obj", obj);
        if (obj.status == true) {
          this.logout();
        } else {
          setTimeout(() => {
            // msgProvider.alert('', obj.message, false);
            msgProvider.showError(obj.message);
          }, 700);
          return false;
        }
      })
      .catch((error) => {
        console.log("-------- error ------- " + error);
      });
  };
  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#147dc7" }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, backgroundColor: "#147dc7" }}
        >
          <View
            style={{
              flex: 1,
              width: "90%",
              alignSelf: "center",
              paddingBottom: (mobileW * 15) / 100,
            }}
          >
            {/* user Profile */}
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  borderWidth: 3,
                  borderColor: "#C5EAFF",
                  width: (mobileW * 26) / 100,
                  height: (mobileW * 26) / 100,
                  justifyContent: "center",
                  marginTop: (mobileW * 4) / 100,
                  marginVertical: (mobileW * 1) / 100,
                  borderRadius: (mobileW * 26) / 200,
                }}
              >
                <ImageBackground
                  imageStyle={{ borderRadius: (mobileW * 12.5) / 100 }}
                  style={{
                    width: (mobileW * 25) / 100,
                    height: (mobileW * 25) / 100,
                    alignSelf: "center",
                  }}
                  source={
                    this.state.profile_img == "NA" ||
                    this.state.profile_img == null
                      ? localimag.p1
                      : { uri: this.state.profile_img }
                  }
                >
                  <View
                    style={{
                      marginTop: (mobileW * 18) / 100,
                      marginLeft: (mobileW * 20) / 100,
                      alignSelf: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        width: (mobileW * 6) / 100,
                        height: (mobileW * 6) / 100,
                        borderRadius: (mobileW * 4) / 100,
                        borderWidth: 2,
                        borderColor: Colors.bordercolorblue,
                        justifyContent: "center",
                        backgroundColor: "white",
                      }}
                    >
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => {
                          this.props.navigation.dispatch(
                            DrawerActions.closeDrawer()
                          ),
                            this.props.navigation.navigate("EditProfile");
                        }}
                      >
                        <Image
                          style={{
                            alignSelf: "center",
                            height: (mobileW * 3) / 100,
                            width: (mobileW * 3) / 100,
                            alignSelf: "center",
                          }}
                          source={localimag.camera}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </ImageBackground>
              </View>
              <Text
                style={{
                  color: Colors.white_color,
                  fontFamily: Font.fontsemibold,
                  fontSize: Font.regulartext_size,
                  textAlign: config.textalign,
                  marginTop: (mobileW * 1.5) / 100,
                }}
              >
                {this.state.name}
              </Text>
              <Text
                style={{
                  color: Colors.drawerblue,
                  fontFamily: Font.placeholderfontfamily,
                  fontSize: (mobileW * 3.5) / 100,
                  textAlign: config.textalign,
                  marginTop: (mobileW * 1) / 100,
                }}
              >
                {this.state.email}
              </Text>
              {/* {this.state.address==null || this.state.address=="" ? */}
              <View
                style={{
                  flexDirection: "row",

                  marginTop: (mobileW * 2) / 100,
                }}
              >
                {config.language == 0 && (
                  <Image
                    source={localimag.location}
                    style={{
                      width: (mobileW * 3) / 100,
                      height: (mobileW * 3) / 100,
                      resizeMode: "contain",
                      tintColor: Colors.white_color,
                      alignSelf: "center",
                    }}
                  ></Image>
                )}
                {this.state.address_old != null &&
                this.state.address_old != "" ? (
                  <Text
                    numberOfLines={1}
                    style={{
                      color: Colors.white_color,
                      fontFamily: Font.fontthin,
                      fontSize: Font.sregulartext_size,
                      textAlign: config.textalign,
                      marginLeft: (mobileW * 3) / 100,
                      marginRight: (mobileW * 2) / 100,
                      alignSelf: "center",
                    }}
                  >
                    {this.state.address_old}
                  </Text>
                ) : (
                  <Text
                    numberOfLines={1}
                    style={{
                      color: Colors.white_color,
                      fontFamily: Font.fontthin,
                      fontSize: Font.sregulartext_size,
                      textAlign: config.textalign,
                      marginLeft: (mobileW * 2) / 100,
                      marginRight: (mobileW * 2) / 100,
                      alignSelf: "center",
                    }}
                  >
                    {this.state.address_new}
                  </Text>
                )}
                {config.language == 1 && (
                  <Image
                    source={localimag.location}
                    style={{
                      width: (mobileW * 3) / 100,
                      height: (mobileW * 3) / 100,
                      resizeMode: "contain",
                      tintColor: Colors.white_color,
                      alignSelf: "center",
                    }}
                  ></Image>
                )}
              </View>
              {/* <View
                style={{
                  flexDirection: 'row',
               
                  marginTop: (mobileW * 2) / 100,
                }}>
                <Image
                  source={localimag.location}
                  style={{
                    width: (mobileW * 3) / 100,
                    height: (mobileW * 3) / 100,
                    resizeMode: 'contain',
                    tintColor: Colors.white_color,
                    alignSelf: 'center',
                  }}></Image>
                  <Text
                  numberOfLines={1}
                  style={{
                    color: Colors.white_color,
                    fontFamily: Font.fontthin,
                    fontSize: Font.sregulartext_size,
                    textAlign: config.textalign,
                    marginLeft: (mobileW * 3) / 100,
                    marginRight: (mobileW * 2) / 100,
                    alignSelf: 'center',
                  }}>{this.state.address} 
                 
                </Text>
                <Image
                  source={require('./icons/Group11713x.png')}
                  style={{
                    width: (mobileW * 3) / 100,
                    height: (mobileW * 3) / 100,
                    resizeMode: 'contain',
                    tintColor: Colors.white_color,
                    alignSelf: 'center',
                  }}></Image>
              </View>
              } */}
            </View>

            {/* Appoints and bookings section */}
            <View
              style={{
                marginTop: (mobileW * 8) / 100,
                marginBottom: (mobileW * 4) / 100,
              }}
            >
              <Text
                style={{
                  color: Colors.white_color,
                  fontFamily: Font.fontsemibold,
                  fontSize: Font.regulartext_size,
                  textAlign: config.textRotate,
                }}
              >
                {Lang_chg.heading[config.language]}
              </Text>

              {/* --------------------------------------------------------------------upcoming */}

              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.drawerblue,
                  borderRadius: (mobileW * 3) / 100,
                  marginTop: (mobileW * 2) / 100,
                }}
              >
                <View style={{ width: "96%", alignSelf: "center" }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.dispatch(
                        DrawerActions.closeDrawer()
                      ),
                        this.props.navigation.navigate(
                          "ShowOtherAppointments",
                          {
                            title: Lang_chg.upcoming_heading[config.language],
                            api_status: 0,
                          }
                        );
                    }}
                    style={{
                      flexDirection: "row",

                      paddingTop: (mobileW * 4) / 100,
                    }}
                  >
                    <View style={{ width: "15%" }}>
                      <Image
                        style={Styles.drawercardicon}
                        source={localimag.user2}
                      ></Image>
                    </View>

                    <View
                      style={{
                        width: "85%",
                        marginLeft: (mobileW * 1) / 100,
                        flexDirection: "row",
                        borderBottomWidth: 1,
                        justifyContent: "space-between",
                        borderColor: Colors.drawerblue,
                      }}
                    >
                      <View style={{ width: "83%" }}>
                        <Text
                          style={{
                            color: Colors.white_color,
                            fontFamily: Font.fontsemibold,
                            fontSize: Font.regulartext_size,
                            textAlign: config.textRotate,
                          }}
                        >
                          {Lang_chg.upcoming_heading[config.language]}
                        </Text>
                        <Text
                          style={{
                            color: Colors.gainsboro,

                            fontFamily: Font.fontregular,
                            fontSize: Font.sregulartext_size,
                            textAlign: config.textRotate,
                            marginVertical: (mobileW * 1) / 100,
                            marginBottom: (mobileW * 4) / 100,
                          }}
                        >
                          {Lang_chg.upcoming_text[config.language]}
                        </Text>
                      </View>
                      <View style={{ width: "12%", alignSelf: "center" }}>
                        <Image
                          style={{
                            tintColor: Colors.arrowcolor,
                            alignSelf: "center",
                            resizeMode: "contain",
                            width: (mobileW * 3.5) / 100,
                            height: (mobileW * 3.5) / 100,
                            marginBottom: (mobileW * 2) / 100,
                          }}
                          source={
                            config.textalign == "right"
                              ? localimag.arabic_next
                              : localimag.rightarrow
                          }
                        ></Image>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.dispatch(
                        DrawerActions.closeDrawer()
                      ),
                        this.props.navigation.navigate(
                          "ShowOtherAppointments",
                          {
                            title: Lang_chg.ongoing_heading[config.language],
                            api_status: 1,
                          }
                        );
                    }}
                    style={{
                      flexDirection: "row",
                      paddingTop: (mobileW * 4) / 100,
                    }}
                  >
                    <View style={{ width: "15%" }}>
                      <Image
                        style={Styles.drawercardicon}
                        source={localimag.calender}
                      />
                    </View>
                    <View
                      style={{
                        width: "85%",
                        flexDirection: "row",
                        borderBottomWidth: 1,
                        borderColor: Colors.drawerblue,
                        marginLeft: (mobileW * 1) / 100,
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ width: "83%" }}>
                        <Text
                          style={{
                            color: Colors.white_color,
                            fontFamily: Font.fontsemibold,
                            fontSize: Font.regulartext_size,
                            textAlign: config.textRotate,
                          }}
                        >
                          {Lang_chg.ongoing_heading[config.language]}
                        </Text>
                        <Text
                          style={{
                            color: Colors.gainsboro,
                            fontFamily: Font.fontregular,
                            fontSize: Font.sregulartext_size,
                            textAlign: config.textRotate,
                            marginVertical: (mobileW * 1) / 100,
                            marginBottom: (mobileW * 4) / 100,
                          }}
                        >
                          {Lang_chg.ongoing_text[config.language]}
                        </Text>
                      </View>
                      <View style={{ width: "12%", alignSelf: "center" }}>
                        <Image
                          style={{
                            tintColor: Colors.arrowcolor,
                            alignSelf: "center",
                            resizeMode: "contain",
                            width: (mobileW * 3.5) / 100,
                            height: (mobileW * 3.5) / 100,
                            marginBottom: (mobileW * 2) / 100,
                          }}
                          source={
                            config.textalign == "right"
                              ? localimag.arabic_next
                              : localimag.rightarrow
                          }
                        />
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.dispatch(
                        DrawerActions.closeDrawer()
                      ),
                        this.props.navigation.navigate(
                          "ShowOtherAppointments",
                          {
                            title: Lang_chg.past_heading[config.language],
                            api_status: 2,
                          }
                        );
                    }}
                    style={{
                      flexDirection: "row",
                      paddingTop: (mobileW * 4) / 100,
                    }}
                  >
                    <View style={{ width: "15%" }}>
                      <Image
                        style={Styles.drawercardicon}
                        source={localimag.calender2}
                      />
                    </View>
                    <View
                      style={{
                        width: "85%",
                        flexDirection: "row",
                        marginLeft: (mobileW * 1) / 100,
                        justifyContent: "space-between",
                        // borderBottomWidth: (mobileW * 0.4) / 100,
                        borderColor: Colors.drawerblue,
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            color: Colors.white_color,
                            fontFamily: Font.fontsemibold,
                            fontSize: Font.regulartext_size,
                            textAlign: config.textRotate,
                          }}
                        >
                          {Lang_chg.past_heading[config.language]}
                        </Text>
                        <Text
                          style={{
                            color: Colors.gainsboro,
                            fontFamily: Font.fontregular,
                            fontSize: Font.sregulartext_size,
                            textAlign: config.textRotate,
                            marginVertical: (mobileW * 1) / 100,
                            marginBottom: (mobileW * 4) / 100,
                          }}
                        >
                          {Lang_chg.past_text[config.language]}
                        </Text>
                      </View>
                      <View style={{ width: "12%", alignSelf: "center" }}>
                        <Image
                          style={{
                            tintColor: Colors.arrowcolor,
                            alignSelf: "center",
                            resizeMode: "contain",
                            width: (mobileW * 3.5) / 100,
                            height: (mobileW * 3.5) / 100,
                            marginBottom: (mobileW * 2) / 100,
                          }}
                          source={
                            config.textalign == "right"
                              ? localimag.arabic_next
                              : localimag.rightarrow
                          }
                        ></Image>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <Text
              style={{
                color: Colors.white_color,
                fontFamily: Font.fontsemibold,
                fontSize: Font.regulartext_size,
                textAlign: config.textRotate,
                marginVertical: (mobileW * 1) / 100,
                marginBottom: (mobileW * 2) / 100,
              }}
            >
              {Lang_chg.acccount$more_heading[config.language]}
            </Text>

            {/* --------------------------------------------------------account */}

            <View
              style={{
                borderWidth: 1,
                borderColor: Colors.drawerblue,
                borderRadius: (mobileW * 3) / 100,
              }}
            >
              <View
                style={{
                  width: "95%",
                  alignSelf: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.dispatch(DrawerActions.closeDrawer()),
                      this.props.navigation.navigate("EditProfile");
                  }}
                  style={{
                    // backgroundColor:'red',
                    flexDirection: "row",
                    paddingTop: (mobileW * 1) / 100,
                    alignItems: "center",
                  }}
                >
                  <View style={{ width: "15%" }}>
                    <Image
                      style={Styles.drawercardicon}
                      source={localimag.setting}
                    ></Image>
                  </View>
                  <View
                    style={{
                      alignItems: "center",
                      width: "85%",
                      flexDirection: "row",
                      marginLeft: (mobileW * 1) / 100,
                      borderBottomWidth: 1,
                      borderColor: Colors.drawerblue,
                      paddingVertical: (mobileW * 4) / 100,
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ width: "83%" }}>
                      <Text
                        style={{
                          color: Colors.white_color,
                          fontFamily: Font.fontsemibold,
                          fontSize: Font.regulartext_size,
                          textAlign: config.textRotate,
                        }}
                      >
                        {Lang_chg.acccountsetting_heading[config.language]}
                      </Text>
                    </View>
                    <View style={{ width: "12%", alignSelf: "center" }}>
                      <Image
                        style={{
                          tintColor: Colors.arrowcolor,
                          alignSelf: "center",
                          resizeMode: "contain",
                          width: (mobileW * 3.5) / 100,
                          height: (mobileW * 3.5) / 100,
                        }}
                        source={
                          config.textalign == "right"
                            ? localimag.arabic_next
                            : localimag.rightarrow
                        }
                      ></Image>
                    </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    this.props.navigation.dispatch(DrawerActions.closeDrawer()),
                      this.props.navigation.navigate("More");
                  }}
                  style={{
                    flexDirection: "row",
                    paddingTop: (mobileW * 1) / 100,
                    alignItems: "center",
                  }}
                >
                  <View style={{ width: "15%" }}>
                    <Image
                      style={Styles.drawercardicon}
                      source={localimag.support}
                    ></Image>
                  </View>
                  <View
                    style={{
                      alignItems: "center",
                      width: "85%",
                      flexDirection: "row",
                      marginLeft: (mobileW * 1) / 100,
                      paddingVertical: (mobileW * 4) / 100,
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ width: "83%" }}>
                      <Text
                        style={{
                          color: Colors.white_color,
                          fontFamily: Font.fontsemibold,
                          fontSize: Font.regulartext_size,
                          textAlign: config.textRotate,
                        }}
                      >
                        {Lang_chg.acccountsupport_heading[config.language]}
                      </Text>
                    </View>
                    <View style={{ width: "12%", alignSelf: "center" }}>
                      <Image
                        style={{
                          tintColor: Colors.arrowcolor,
                          alignSelf: "center",
                          resizeMode: "contain",
                          width: (mobileW * 3.5) / 100,
                          height: (mobileW * 3.5) / 100,
                        }}
                        source={
                          config.textalign == "right"
                            ? localimag.arabic_next
                            : localimag.rightarrow
                        }
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Logout */}
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.dispatch(DrawerActions.closeDrawer()),
                  this.setState({ modalVisible3: true });
              }}
              style={{
                borderWidth: 1,
                borderColor: Colors.drawerblue,
                borderRadius: (mobileW * 2) / 100,
                marginTop: (mobileW * 4) / 100,
              }}
            >
              <View style={{ width: "95%", alignSelf: "center" }}>
                <View
                  style={{
                    flexDirection: "row",
                    paddingVertical: (mobileW * 2) / 100,

                    alignItems: "center",
                  }}
                >
                  <View style={{ width: "15%" }}>
                    {config.language == 1 ? (
                      <Image
                        style={Styles.drawercardicon}
                        source={localimag.logout_opp}
                      ></Image>
                    ) : (
                      <Image
                        style={Styles.drawercardicon}
                        source={localimag.logout}
                      ></Image>
                    )}
                  </View>
                  <View
                    style={{
                      width: "85%",
                      flexDirection: "row",
                      marginLeft: (mobileW * 1) / 100,
                      borderColor: Colors.drawerblue,
                      paddingVertical: (mobileW * 3) / 100,
                    }}
                  >
                    <Text
                      style={{
                        color: Colors.drawertextblue,
                        fontFamily: Font.fontsemibold,
                        fontSize: Font.regulartext_size,
                        textAlign: config.textRotate,
                      }}
                    >
                      {Lang_chg.logout_text[config.language]}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {/* version */}
            {/* <Text
              style={{
                textAlign: 'center',
                color: Colors.drawertextblue,
                marginTop: (mobileW * 7) / 100,
              }}>
              {Lang_chg.drawerversion[config.language]}
            </Text> */}
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
                        width: (mobileW * 50) / 100,
                        paddingVertical: (mobileW * 3) / 100,
                        marginTop: (mobileW * 2) / 100,
                        paddingLeft: (mobileW * 4) / 100,
                        flexDirection: "row",
                      }}
                    >
                      <Image
                        style={{
                          width: (mobileW * 6) / 100,
                          height: (mobileW * 6) / 100,
                        }}
                        source={require("./icons/logo.png")}
                      />
                      <Text
                        style={{
                          fontFamily: Font.fontmedium,
                          color: "#000",
                          fontSize: (mobileW * 5) / 100,
                          paddingLeft: (mobileW * 4) / 100,
                        }}
                      >
                        {Lang_chg.Logout[config.language]}
                      </Text>
                    </View>
                    <View
                      style={{
                        alignSelf: "flex-start",
                        paddingVertical: (mobileW * 1) / 100,
                        paddingLeft: (mobileW * 4) / 100,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: Font.fontregular,
                          color: "#000",
                          fontSize: (mobileW * 4) / 100,
                        }}
                      >
                        {Lang_chg.logut_msg[config.language]}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        width: "40%",
                        paddingBottom: (mobileW * 5) / 100,
                        marginTop: (mobileW * 9) / 100,
                        alignSelf: "flex-end",
                        right: 10,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ modalVisible3: false });
                        }}
                        style={{
                          height: (mobileW * 10) / 100,
                          width: (mobileW * 15) / 100,
                          flexDirection: "row",
                          alignSelf: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Font.fontregular,
                            fontSize: (mobileW * 4) / 100,
                            color: Colors.bordercolorblue,
                            alignSelf: "center",
                          }}
                        >
                          {Lang_chg.no_txt[config.language]}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ modalVisible3: false }),
                            this.confirm_click();
                        }}
                        activeOpacity={0.8}
                        style={{
                          height: (mobileW * 10) / 100,
                          width: (mobileW * 40) / 100,
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Font.fontregular,
                            fontSize: (mobileW * 4) / 100,
                            color: Colors.bordercolorblue,
                            alignSelf: "center",
                          }}
                        >
                          {Lang_chg.Logout[config.language]}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
