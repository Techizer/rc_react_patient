import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  ScrollView,
  SafeAreaView,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import {
  Colors,
  Font,
  config,
  windowWidth,
  localStorage,
  Icons,
  consolepro,
  Lang_chg,
  apifuntion,
} from "../Provider/utilslib/Utils";
import { AppHeader4 } from "../Allcomponents";

export default class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notificat_id: "",
      notificationdata: "",
      modalVisible3: false,
      body_name: "",
      fbtn: "",
      message: "",
      mabtn: true,
    };
  }
  componentDidMount() {
    this.get_notification(0);
  }
  get_notification = async (page) => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];
    let apishow = "api-get-all-notification";

    let url = config.baseURL + apishow;
    console.log("url", url);

    var data = new FormData();
    data.append("id", user_id);
    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data, page)
      .then((obj) => {
        consolepro.consolelog("obj", obj);

        if (obj.status == true) {
          this.setState({ notificationdata: obj.result, message: obj.message });
          console.log("obj.result", obj.result);
        } else {
          this.setState({ notificationdata: obj.result, message: obj.message });
          console.log("obj.result", obj.result);
          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
      });
  };
  update_notification = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];
    let apishow = "api-update-notification";

    let url = config.baseURL + apishow;
    console.log("url", url);

    var data = new FormData();
    data.append("id", this.state.notificat_id);
    data.append("read", 1);
    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        consolepro.consolelog("obj", obj);

        this.get_notification(1);
        if (obj.status == true) {
          // setTimeout(() => {
          //  },100);
        } else {
          this.setState({
            appoinment_detetails: obj.result,
            message: obj.message,
          });
          console.log("obj.result", obj.result);
          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
      });
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          width: "100%",
          alignSelf: "center",
        }}
      >
        <SafeAreaView style={{ flex: 0 }}></SafeAreaView>

        <AppHeader4
          handlarrowpress={() => {
            this.props.navigation.goBack();
          }}
          title={Lang_chg.NotificationsList[config.language]}
        />

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
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
                    paddingVertical: (windowWidth * 3) / 100,
                  }}
                >
                  <View
                    style={{
                      alignSelf: "flex-start",
                      width: (windowWidth * 50) / 100,
                      paddingBottom: (windowWidth * 3) / 100,
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
                        paddingLeft: (windowWidth * 4) / 100,
                      }}
                    >
                      {Lang_chg.Notification[config.language]}
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
                        fontFamily: Font.fontregular,
                        color: "#000",
                        fontSize: (windowWidth * 4) / 100,
                        width: "90%",
                      }}
                    >
                      {this.state.body_name}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ modalVisible3: false });
                    }}
                    activeOpacity={0.8}
                    style={{
                      width: (windowWidth * 20) / 100,
                      justifyContent: "flex-end",
                      alignSelf: "flex-end",
                      marginTop: (windowWidth * 3) / 100,
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
                      {Lang_chg.OK[config.language]}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          {this.state.notificationdata == "" ||
            (this.state.notificationdata == null && (
              <View>
                <Text
                  style={{
                    textAlign: "center",
                    color: Colors.Theme,
                    fontFamily: Font.fontmedium,
                    fontSize: (windowWidth * 3.5) / 100,
                    marginTop: (windowWidth * 60) / 100,
                  }}
                >
                  {this.state.message}
                </Text>
              </View>
            ))}

          {this.state.notificationdata != "" &&
            this.state.notificationdata != null && (
              <FlatList
                data={this.state.notificationdata}
                contentContainerStyle={{ paddingBottom: (windowWidth * 10) / 100 }}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => {
                        this.update_notification(),
                          this.setState({
                            body_name: item.body,
                            notificat_id: item.id,
                            modalVisible3: true,
                          });
                      }}
                      style={{
                        flexDirection: "row",
                        backgroundColor: Colors.white,
                        marginTop: (windowWidth * 2) / 100,
                        backgroundColor: "#fff",
                        shadowOpacity: 0.3,
                        shadowColor: "#000",
                        shadowOffset: { width: 1, height: 1 },
                        elevation: 5,
                        //   paddingtop: (windowWidth * 3) / 100,
                      }}
                    >
                      <View
                        style={[
                          {
                            width: (windowWidth * 1.5) / 100,
                          },
                          item.read == "1"
                            ? { backgroundColor: "#515C6F" }
                            : { backgroundColor: Colors.Theme },
                        ]}
                      />
                      <View
                        style={{
                          width: "15%",
                          paddingTop: (windowWidth * 4) / 100,
                          paddingRight: (windowWidth * 2) / 100,
                        }}
                      >
                        <Image
                          source={
                            item.read == "0"
                              ? Icons.rocketicon
                              : Icons.rocket_gray
                          }
                          style={{
                            alignSelf: "center",
                            width: (windowWidth * 8) / 100,
                            height: (windowWidth * 8) / 100,
                          }}
                        />
                      </View>
                      <View
                        style={{
                          width: "80%",
                          paddingTop: (windowWidth * 4) / 100,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Font.fontregular,
                            fontSize: Font.sregulartext_size,
                            lineHeight: (windowWidth * 4.2) / 100,
                            textAlign: config.textRotate,
                            color: Colors.lightgraytext,
                            paddingBottom: (windowWidth * 2.1) / 100,
                          }}
                        >
                          {item.body}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            borderTopWidth: (windowWidth * 0.3) / 100,
                            borderColor: Colors.gainsboro,
                            alignSelf: "flex-start",
                            paddingVertical: (windowWidth * 2) / 100,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: Font.fontregular,
                              fontSize: Font.sregulartext_size,
                              color: Colors.lightgraytext,
                            }}
                          >
                            {item.datetime}
                            {"  •  "}
                            {item.date}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            )}
        </ScrollView>
      </View>
    );
  }
}
