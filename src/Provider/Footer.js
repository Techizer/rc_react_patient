import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Alert,
  FlatList,
} from "react-native";
import { Colors } from "./Colorsfont";
import Icon1 from "react-native-vector-icons/Entypo";
import DeviceInfo from "react-native-device-info";
import { localStorage } from "./localStorageProvider";
import {
  msgTitle,
} from "./Messageconsolevalidationprovider/messageProvider";
import { windowWidth } from "./utilslib/Utils";

const screenHeight = Math.round(Dimensions.get("window").height);
const screenWidth = Math.round(Dimensions.get("window").width);
export default class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "",
      modalVisible1: false,
      loading: false,
      isConnected: true,
      user_img: "NA",
      notch_check: DeviceInfo.hasNotch(),
    };
    // BackHandler.removeEventListener('hardwareBackPress', () => {
    //   return true;
    // });
  }

  componentDidMount = () => {
    //   let hasNotch = DeviceInfo.hasNotch();
    // alert(hasNotch)
  };

  getData = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    console.log("config.user_details", user_details);
    let user_id = user_details["user_id"];
    if (user_details != null && user_details.img_arr != "NA") {
      let user_image = user_details.img_arr[0];
      this.setState({ user_img: user_image });
      console.log("config.user_img", this.state.user_img);
    }
  };

  usercheckbtn = async (page) => {
    const navigation = this.props.navigation;
    navigation.navigate(page);
    return false;
  };
  //   if (page == "Home") {
  //     navigation.navigate(page);
  //     return false;
  //   } else if (page == "Nearest") {
  //     navigation.navigate(page);
  //     return false;
  //   }

  //   this.props.functionremove;

  //   let userdata = await localStorage.getItemObject("user_arr");
  //   console.log("userdata", userdata);
  //   if (userdata != null) {
  //     if (this.props.usertype == 1) {
  //       navigation.navigate(page);
  //     } else {
  //       if (userdata.profile_complete == 0 && userdata.otp_verify == 1) {
  //         for (let i = 0; i < this.props.footerpage.length; i++) {
  //           if (page == this.props.footerpage[i].name) {
  //             navigation.navigate(page);
  //           }
  //         }
  //       } else {
  //         this.setState({ modalVisible1: true });
  //       }
  //     }
  //   } else {
  //     this.setState({ modalVisible1: true });
  //   }
  // };

  Checkuser = () => {
    Alert.alert(
      "confirm",
      "please first login",
      [
        {
          text: msgTitle.cancel[0],
        },
        {
          text: msgTitle.ok[0],
          onPress: () => {
            this.props.navigation.navigate("login");
          },
        },
      ],
      { cancelable: false }
    );
  };

  render() {
    const navigation = this.props.navigation;
    let footerwidth = parseInt(100 / this.props.footerpage.length);

    return (
      <View
        style={[
          style1.footercontainer,
          { backgroundColor: this.props.imagestyle1.backgroundColor },
        ]}
      >
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible1}
          onRequestClose={() => {
            this.setState({ modalVisible1: false });
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#00000040",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                width: (screenWidth * 100) / 100,
                alignContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  paddingHorizontal: 20,
                  paddingTop: 15,
                  alignContent: "center",
                  alignItems: "center",
                  elevation: 5,
                  borderRadius: 5,
                  width: (screenWidth * 80) / 100,
                }}
              >
                <View style={{ position: "absolute", left: -13, top: -13 }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "White",
                      borderRadius: 30,
                      alignSelf: "center",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      this.setState({ modalVisible1: false });
                    }}
                  >
                    <Icon1
                      name="circle-with-cross"
                      size={25}
                      color={Colors.buttoncolor}
                      style={{
                        alignSelf: "center",
                        padding: 1.5,
                        paddingBottom: 0,
                      }}
                    />
                  </TouchableOpacity>
                </View>

                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    color: "black",
                    alignSelf: "flex-start",
                  }}
                >
                  information
                </Text>
                <Text
                  style={{
                    fontFamily: "Cabin-Regular",
                    color: "grey",
                    fontSize: 15,
                    paddingTop: 13,
                    lineHeight: 22,
                    alignSelf: "center",
                  }}
                >
                  Please login first
                </Text>
                <View
                  style={{
                    backgroundColor: Colors.buttoncolor,
                    marginVertical: 20,
                    width: "95%",
                    borderRadius: 40,
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                      this.setState({ modalVisible1: false });
                      this.props.navigation.navigate("Login");
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        paddingVertical: 13,
                        color: "#FFFFFF",
                        fontFamily: "Cabin-SemiBold",
                        fontSize: 13.5,
                        letterSpacing: 1,
                      }}
                    >
                      Login
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <FlatList
          data={this.props.footerpage}
          scrollEnabled={false}
          numColumns={this.props.footerpage.length}
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  width: (screenWidth * footerwidth) / 100,
                  alignSelf: "center",
                  alignItems: "center",
                }}
              >
                {item.name == this.props.activepage ? (
                  <TouchableOpacity
                    onPress={() => {
                      this.usercheckbtn(item.name);
                    }}
                    activeOpacity={0.8}
                    style={style1.footericon}
                  >
                    <View style={[style1.footericonview]}>
                      <Image
                        source={item.activeimage}
                        resizeMethod="resize"
                        style={[
                          style1.footerimage,
                          {
                            width: this.props.imagestyle1.width,
                            height: this.props.imagestyle1.height,
                          },
                        ]}
                      />
                      {item.pagename == "Chat" && (
                        <View
                          style={{
                            marginLeft: (windowWidth * 4) / 100,
                            position: "absolute",
                            borderRadius: (windowWidth * 2) / 100,
                            width: (windowWidth * 3.2) / 100,
                            height: (windowWidth * 3.2) / 100,
                            backgroundColor: Colors.texttheme,
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              bottom: 2,
                              fontSize: (windowWidth * 2.8) / 100,
                              alignSelf: "center",
                              color: "#fff",
                            }}
                          >
                            2
                          </Text>
                        </View>
                      )}
                      <Text
                        style={{
                          fontFamily: "Inter-Regular",
                          color: "#d32323",
                          fontSize: (windowWidth * 2.8) / 100,
                        }}
                      >
                        {item.pagename}
                      </Text>
                      {item.countshow != false && (
                        <View
                          style={{
                            position: "absolute",
                            top: 5,
                            right: 7,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <View
                            style={{
                              alignSelf: "center",
                              width: 6,
                              height: 6,
                              borderRadius: 5,
                              backgroundColor:
                                this.props.imagestyle1.countbackground,
                              justifyContent: "center",
                              alignContent: "center",
                              alignItems: "center",
                            }}
                          />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[style1.footericon]}
                    onPress={() => {
                      this.usercheckbtn(item.name);
                    }}
                  >
                    <View style={style1.footericonview}>
                      <Image
                        source={item.image}
                        resizeMethod="resize"
                        style={[
                          style1.footerimage,
                          {
                            width: this.props.imagestyle1.width,
                            height: this.props.imagestyle1.height,
                          },
                        ]}
                      />
                      {item.pagename == "Chat" && (
                        <View
                          style={{
                            marginLeft: (windowWidth * 4) / 100,
                            position: "absolute",
                            borderRadius: (windowWidth * 2) / 100,
                            width: (windowWidth * 3.2) / 100,
                            height: (windowWidth * 3.2) / 100,
                            backgroundColor: Colors.texttheme,
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              bottom: 2,
                              fontSize: (windowWidth * 2.8) / 100,
                              alignSelf: "center",
                              color: "#fff",
                            }}
                          >
                            2
                          </Text>
                        </View>
                      )}
                      <Text
                        style={{
                          fontFamily: "Inter-Regular",
                          color: "gray",
                          fontSize: (windowWidth * 2.8) / 100,
                        }}
                      >
                        {item.pagename}
                      </Text>
                      {item.countshow != false && this.props.count_inbox != 0 && (
                        <View
                          style={{
                            position: "absolute",
                            top: 3,
                            right: 0,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <View
                            style={{
                              alignSelf: "center",
                              width: 20,
                              height: 20,
                              borderRadius: 10,
                              backgroundColor:
                                this.props.imagestyle1.countbackground,
                              justifyContent: "center",
                              alignContent: "center",
                              alignItems: "center",
                            }}
                          />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}
const style1 = StyleSheet.create({
  footercontainer: {
    flexDirection: "row",
    width: (screenWidth * 100) / 100,
    // height: (screenHeight * 8) / 100,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    alignContent: "center",
    position: "absolute",
    bottom: 0,
    // elevation: 20,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    borderTopColor: Colors.greyColor,
    borderTopWidth: 1,
  },
  footericon: {
    width: (screenWidth * 25) / 100,
    paddingTop: 8,
    paddingBottom: 6,
  },
  footericonview: {
    alignSelf: "center",
    paddingVertical: 3,
  },
  footertext: {
    color: "gray",
    fontSize: 13,
  },
  footerimage: {
    alignSelf: "center",
    resizeMode: "contain",
  },
});
