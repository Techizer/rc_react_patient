import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Keyboard,
  Modal,
  ScrollView,
  TouchableHighlight,
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

import Styles from "../Styles";
import { leftArrow, rightArrow, Notification } from "../icons/SvgIcons/Index";
import Footer from "../Footer";
import HideWithKeyboard from "react-native-hide-with-keyboard";
import Icon from "react-native-vector-icons/AntDesign";
import { SvgXml } from "react-native-svg";
import { s, vs } from "react-native-size-matters";
import ScreenHeader from "../components/ScreenHeader";

export default class AllServiceProviderListing extends Component {
  _didFocusSubscription;
  _willBlurSubscription;

  constructor(props) {
    super(props);
    this.state = {
      pass_status: this.props.route.params.pass_status,
      enableFor: this.props.route.params.enableFor,
      nurse_data: "",
      message: "",
      notification_count: "",
      provider_name: "",
      isHospitalDoctorList: false,
      hospitalName: "",
      hospitalId: "",
      specialtyData: "",
      specialtyArr: [],
      specialtyMessage: "",
      specialtyModal: false,
      availableDoctorsUnderHospital: [],
      availableDoctorsMessage: "",
    };
    screens = "Login";
  }
  componentDidMount() {
    this.props.navigation.addListener("focus", () => {
      this.get_Services();
      this.get_all_notification();
    });
  }
  get_all_notification = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    console.log("user_details user_details", user_details);
    let user_id = user_details["user_id"];

    let url = config.baseURL + "api-notification-count";

    var data = new FormData();
    data.append("login_user_id", user_id);

    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        consolepro.consolelog("obj", obj);
        if (obj.status == true) {
          this.setState({ notification_count: obj.result });
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log("-------- error ------- " + error);
      });
  };

  getHospitalSpecialties = async () => {
    let url = config.baseURL + "api-hospital-doctor-speciality-list";

    var data = new FormData();
    data.append("hospital_id", this.state.hospitalId);
    data.append("service_type", "doctor");

    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        consolepro.consolelog("obj", obj);
        if (obj.status == true) {
          this.setState({
            specialtyArr: obj.result,
            specialtyMessage: obj.message,
          });
        } else {
          this.setState({
            specialtyArr: obj.result,
            specialtyMessage: obj.message,
          });
          return false;
        }
      })
      .catch((error) => {
        console.log("-------- error ------- " + error);
      });
  };

  getHospitalDoctorList = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    console.log("user_details user_details", user_details);
    let user_id = user_details["user_id"];

    let url = config.baseURL + "api-patient-hospital-doctor-list";

    console.log("url", url);

    var data = new FormData();
    data.append("login_user_id", user_id);
    data.append("hospital_id", this.state.hospitalId);
    data.append("service_type", "doctor");
    data.append("provider_name", "");
    data.append("page_count", 1);
    data.append("work_area", user_details["work_area"]);
    data.append("specility", this.state.specialtyData);

    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        consolepro.consolelog("obj", JSON.stringify(obj));
        if (obj.status == true) {
          this.setState({
            availableDoctorsUnderHospital: obj.result,
            availableDoctorsMessage: obj.message,
          });
          let day_task = obj.result;
          if (obj.result != null && obj.result != "") {
            for (let k = 0; k < obj.result.length; k++) {
              let availability = day_task[k].availability;
              for (let l = 0; l < availability.length; l++) {
                day_task[k].availability[l] = availability[l].slot_day;
              }
              day_task[k].new_availablity = day_task[k].availability.toString();
            }
          }
          console.log("availableDoctorsUnderHospital ", day_task);
          this.setState({ availableDoctorsUnderHospital: day_task });
        } else {
          this.setState({
            availableDoctorsUnderHospital: obj.result,
            availableDoctorsMessage: obj.message,
          });
          return false;
        }
      })
      .catch((error) => {
        console.log("-------- error ------- " + error);
      });
  };

  get_Services = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];
    let url =
      config.baseURL +
      (this.state.pass_status === "hospital"
        ? "api-patient-hospital-list"
        : "api-patient-service-provider-list");
    console.log("url", url);

    var data = new FormData();
    data.append("login_user_id", user_id);
    if (this.state.pass_status !== "hospital")
      data.append("provider_name", this.state.provider_name);
    data.append("service_type", this.state.pass_status);
    data.append("work_area", user_details["work_area"]);
    data.append("page_count", 1);
    if (this.state.pass_status === "doctor")
      data.append("docEnableFor", this.state.enableFor);
    if (this.state.pass_status === "hospital") {
      data.append("hospital_name", this.state.provider_name);
    }

    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        consolepro.consolelog("obj", JSON.stringify(obj));

        if (obj.status == true) {
          console.log("obj.result", obj.result);

          this.setState({
            nurse_data: obj.result,
            message: obj.message,
            availability_arr: obj.result.availability,
          });
          console.log("obj.result", obj.result);
          if (this.state.pass_status !== "hospital") {
            let hour_task = obj.result;
            if (obj.result != null && obj.result != "") {
              for (let k = 0; k < obj.result.length; k++) {
                let availability = hour_task[k].availability;
                for (let l = 0; l < availability.length; l++) {
                  hour_task[k].availability[l] = availability[l].slot_day;
                }
                hour_task[k].new_availablity =
                  hour_task[k].availability.toString();
              }
            }
            console.log("musaknfg", hour_task);
            this.setState({ nurse_data: hour_task });
          }
        } else {
          this.setState({ nurse_data: obj.result, message: obj.message });
          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
      });
  };

  render() {
    return (
      <View style={{ backgroundColor: Colors.backgroundcolor, flex: 1 }}>

        <ScreenHeader
          navigation={this.props.navigation}
          onBackPress={() => this.props.navigation.pop()}
          title={
            this.state.isHospitalDoctorList
              ? Lang_chg.Doctor[config.language]
              : this.state.pass_status == "nurse"
                ? Lang_chg.Nurse[config.language]
                : this.state.pass_status == "physiotherapy"
                  ? Lang_chg.Physiotherapist[config.language]
                  : this.state.pass_status == "caregiver"
                    ? Lang_chg.Nurse_assistant[config.language]
                    : this.state.pass_status == "babysitter"
                      ? Lang_chg.Babysitter[config.language]
                      : this.state.pass_status == "doctor"
                        ? Lang_chg.Doctor[config.language]
                        : this.state.pass_status == "hospital"
                          ? Lang_chg.Hospital[config.language]
                          : Lang_chg.Lab[config.language]
          }
          rightIcon={true}
        />

        <ScrollView>
          <View >
            {/* {this.state.pass_status === "hospital" && (
              <View
                style={{
                  marginTop: (windowWidth * 3) / 100,
                  width: "100%",
                  marginStart: (windowWidth * 5) / 100,
                  marginBottom: (windowWidth * 2) / 100,
                }}
              >
                <Text
                  style={{
                    textAlign: "left",
                    fontFamily: Font.fontmedium,
                    fontSize: (windowWidth * 4) / 100,
                  }}
                >
                  {this.state.isHospitalDoctorList
                    ? this.state.hospitalName
                    : Lang_chg.DoctorsUnderHospital[config.language]}
                </Text>
              </View>
            )
            } */}
            {this.state.isHospitalDoctorList ? (
              <View
                style={{
                  width: "100%",
                }}
              >
                <View style={{ width: "90%", alignSelf: "center" }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        specialtyModal: true,
                      });
                    }}
                    style={{
                      width: "100%",
                      alignSelf: "center",
                      borderColor: "#CCCCCC",
                      borderWidth: 1,
                      backgroundColor: "#fff",
                      borderRadius: (windowWidth * 1) / 100,
                      paddingVertical: (windowWidth * 3.5) / 100,
                      marginTop: (windowWidth * 2) / 100,
                      marginBottom: (windowWidth * 2) / 100,
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
                          fontSize: (windowWidth * 3.7) / 100,
                          fontFamily: Font.fontregular,
                          textAlign: config.textRotate,
                          color: Colors.placeholder_border,
                        }}
                      >
                        {this.state.specialtyData.length <= 0
                          ? Lang_chg.selectSpecialty[config.language]
                          : this.state.specialtyData}
                      </Text>
                      {/* </View> */}

                      <View style={{ width: "20%", alignSelf: "center" }}>
                        <Image
                          style={{
                            height: (windowWidth * 4) / 100,
                            width: (windowWidth * 4) / 100,
                            alignSelf: "flex-end",
                          }}
                          source={Icons.downarrow}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  width: "90%",
                  height: vs(40),
                  marginTop: vs(7),
                  paddingHorizontal: s(7),
                  paddingVertical: vs(4),
                  marginBottom: (windowWidth * 2) / 100,
                  alignSelf: "center",
                  backgroundColor: Colors.textwhite,
                  borderRadius: 6,
                  alignItems: "center",
                }}
              >
                {/* search box */}
                <View style={{
                  height: '100%',
                  width: '88%',
                  justifyContent: 'center'
                }}>
                  <TextInput
                    placeholder={
                      this.state.pass_status == "nurse"
                        ? Lang_chg.SearchNurse[config.language]
                        : this.state.pass_status == "physiotherapy"
                          ? Lang_chg.Searchphysi[config.language]
                          : this.state.pass_status == "caregiver"
                            ? Lang_chg.Searchseassistent[config.language]
                            : this.state.pass_status == "babysitter"
                              ? Lang_chg.SearchBabysitter[config.language]
                              : this.state.pass_status == "doctor"
                                ? Lang_chg.SearchDoctor[config.language]
                                : this.state.pass_status == "hospital"
                                  ? Lang_chg.SearchHospital[config.language]
                                  : Lang_chg.SearchLab[config.language]
                    }
                    onChangeText={(txt) => {
                      this.setState({ provider_name: txt });
                    }}
                    returnKeyLabel="done"
                    returnKeyType="done"
                    onSubmitEditing={() => {
                      Keyboard.dismiss();
                    }}
                    style={[
                      {
                        color: Colors.lightGrey,
                        fontSize: Font.small,
                        fontFamily: Font.fontregular,
                        textAlign: config.textalign,
                      }
                    ]}
                  />
                </View>

                <View style={{ width: "12%", height: '100%' }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.get_Services();
                    }}
                  >
                    <View
                      style={{
                        alignSelf: 'flex-end',
                      }}
                    >
                      <Image
                        source={Icons.searchiocn2}
                        style={{
                          width: (windowWidth * 10) / 100,
                          height: (windowWidth * 10) / 100,
                          // (windowWidth * 5.5) / 100,
                          borderRadius: (windowWidth * 1.5) / 100,
                          alignSelf: "center",
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {this.state.isHospitalDoctorList ? (
            <FlatList
              contentContainerStyle={{
                paddingBottom: (windowWidth * 25) / 100,
              }}
              showsVerticalScrollIndicator={false}
              data={this.state.availableDoctorsUnderHospital}
              renderItem={({ item, index }) => {
                if (item.user_type === "doctor") {
                  return (
                    <View
                      style={{
                        width: (windowWidth * 100) / 100,
                        backgroundColor: "#fff",
                        alignSelf: "center",
                        alignItems: "center",
                        marginTop: (windowWidth * 2) / 100,
                      }}
                    >
                      <View
                        style={{
                          width: (windowWidth * 90) / 100,
                          alignSelf: "center",
                          paddingVertical: (windowWidth * 2) / 100,
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            width: "99%",
                            flexDirection: "row",
                            alignSelf: "center",
                          }}
                        >
                          <View style={{ width: "30%" }}>
                            <TouchableOpacity
                              onPress={() => {
                                this.props.navigation.navigate(
                                  "ServiceProviderDetails",
                                  {
                                    pass_status: "doctor",
                                    nurse_id: item.user_id,
                                    isFromHospital: true,
                                    hospitalId: this.state.hospitalId,
                                  }
                                );
                              }}
                              style={{ width: "100%" }}
                            >
                              <Image
                                source={
                                  item.image == "NA" ||
                                    item.image == null ||
                                    item.image == ""
                                    ? require("../icons/No-Image3x.png")
                                    : {
                                      uri: config.img_url3 + item.image,
                                    }
                                }
                                style={{
                                  // alignSelf: 'center',
                                  borderWidth: 1,
                                  borderColor: "#0888D1",
                                  width: (windowWidth * 22) / 100,
                                  height: (windowWidth * 22) / 100,
                                  borderRadius: (windowWidth * 11) / 100,
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                          <View
                            style={{
                              width: "60%",
                              marginTop: (windowWidth * 1) / 100,
                            }}
                          >
                            <Text
                              onPress={() => {
                                this.props.navigation.navigate(
                                  "ServiceProviderDetails",
                                  {
                                    pass_status: "doctor",
                                    nurse_id: item.user_id,
                                    isFromHospital: true,
                                    hospitalId: this.state.hospitalId,
                                  }
                                );
                              }}
                              style={{
                                fontFamily: Font.fontmedium,
                                fontSize: Font.name,
                                textAlign: config.textRotate,
                              }}
                            >
                              {item.provider_name}
                            </Text>
                            {item.speciality != "" &&
                              item.speciality != null && (
                                <Text
                                  style={{
                                    fontFamily: Font.fontregular,
                                    color: Colors.Theme,
                                    fontSize: Font.subtext,
                                    textAlign: config.textRotate,
                                    paddingVertical: (windowWidth * 0.5) / 100,
                                  }}
                                >
                                  {item.speciality}
                                </Text>
                              )}
                            <Text
                              style={{
                                paddingVertical: (windowWidth * 0.5) / 100,
                                fontFamily: Font.fontregular,
                                fontSize: Font.ssubtext,
                                textAlign: config.textRotate,
                                color: Colors.cardlighgray,
                              }}
                            >
                              {item.experience} | {item.qualification}
                            </Text>

                            <View
                              style={{
                                width: "100%",
                                flexDirection: "row",
                                paddingVertical: (windowWidth * 2) / 100,
                                borderRadius: (windowWidth * 1) / 100,
                                alignItems: "center",
                              }}
                            >
                              {config.language == 0 ? (
                                <Image
                                  source={Icons.clock}
                                  style={{
                                    resizeMode: "contain",
                                    width: (windowWidth * 4) / 100,
                                    height: (windowWidth * 4) / 100,
                                  }}
                                />
                              ) : (
                                <Image
                                  source={Icons.clock_arabic_gray}
                                  style={{
                                    resizeMode: "contain",
                                    width: (windowWidth * 4) / 100,
                                    height: (windowWidth * 4) / 100,
                                  }}
                                />
                              )}
                              <Text
                                style={{
                                  fontFamily: Font.fontregular,
                                  fontSize: (windowWidth * 2.5) / 100,
                                  color: Colors.DarkGrey,
                                  marginLeft: (windowWidth * 1.5) / 100,
                                }}
                              >
                                {item.av_text}
                              </Text>

                              <View
                                style={{
                                  alignSelf: "center",
                                  marginTop: (windowWidth * 0.4) / 100,
                                }}
                              >
                                <Text
                                  style={{
                                    color: Colors.Theme,
                                    fontFamily: Font.fontmedium,
                                    fontSize: (windowWidth * 2.5) / 100,
                                    marginLeft: (windowWidth * 1) / 100,
                                  }}
                                >
                                  {item.new_availablity}
                                </Text>
                              </View>
                            </View>
                          </View>
                          <View
                            style={{
                              backgroundColor: "#FFA800",
                              width: "18%",
                              height: 20,
                              marginTop: -9,
                              borderBottomLeftRadius: (windowWidth * 2) / 100,
                              paddingVertical: 3,
                            }}
                          >
                            <Text
                              style={{
                                color: "#fff",
                                fontFamily: Font.fontmedium,
                                fontSize: (windowWidth * 2.5) / 100,
                                alignSelf: "center",
                              }}
                            >
                              {Lang_chg.Hospital[config.language]}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            width: "100%",
                            borderRadius: (windowWidth * 2) / 100,
                            alignItems: "center",
                            flexDirection: "row",
                            alignSelf: "center",
                            paddingBottom: (windowWidth * 2) / 100,
                          }}
                        >
                          <View
                            style={{
                              width: "12%",
                              alignSelf: "center",
                              backgroundColor: Colors.buttoncolorhgreen,
                              flexDirection: "row",
                              // paddingHorizontal: (windowWidth * 1.5) / 100,
                              paddingVertical: (windowWidth * 0.5) / 100,
                              borderRadius: 4,
                              alignItems: "center",
                            }}
                          >
                            <Image
                              source={Icons.starrating}
                              style={{
                                tintColor: "#fff",
                                width: (windowWidth * 3) / 100,
                                height: (windowWidth * 3) / 100,
                                alignSelf: "center",
                                marginLeft: (windowWidth * 1) / 100,
                              }}
                            />
                            <Text
                              style={{
                                fontFamily: Font.fontregular,
                                fontSize: (windowWidth * 3) / 100,
                                color: Colors.white,
                                marginLeft: (windowWidth * 1) / 100,
                              }}
                            >
                              {item.avg_rating}.0
                            </Text>
                          </View>

                          <Text
                            style={{
                              fontFamily: Font.fontmedium,
                              fontSize: (windowWidth * 3) / 100,
                              marginLeft: (windowWidth * 1.5) / 100,
                            }}
                          >
                            {item.booking_count}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            backgroundColor: Colors.white,
                            paddingVertical: (windowWidth * 2) / 100,
                            borderTopWidth: (windowWidth * 0.3) / 100,
                            borderColor: Colors.bordercolor,
                            justifyContent: "space-between",
                          }}
                        >
                          <View
                            style={{
                              flex: 1,
                              paddingVertical: (windowWidth * 2) / 100,
                            }}
                          >
                            <Text
                              style={{
                                color: Colors.buttoncolorhgreen,
                                fontSize: (windowWidth * 3) / 100,
                                fontFamily: Font.fontmedium,
                                textAlign: config.textRotate,
                              }}
                            >
                              {item.bavi_text}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              this.props.navigation.navigate("Booking", {
                                pass_status: "doctor",
                                nurse_id: item.user_id,
                                indexPosition: 0,
                                isFromHospital: true,
                                hospitalId: this.state.hospitalId,
                              });
                            }}
                            style={{
                              backgroundColor: Colors.Theme2,
                              borderRadius: (windowWidth * 1) / 100,
                              justifyContent: "center",
                              paddingHorizontal: (windowWidth * 2) / 100,
                              paddingVertical: (windowWidth * 0.5) / 100,
                            }}
                          >
                            <Text
                              style={{
                                color: Colors.white,
                                fontSize: (windowWidth * 2.5) / 100,
                                fontFamily: Font.fontmedium,
                                textAlign: "center",
                              }}
                            >
                              {Lang_chg.BOOKAPPOINTMENT[config.language]}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                }
              }}
            />
          ) : (
            <View>
              {this.state.nurse_data == "" ||
                (this.state.nurse_data == null && (
                  <View style={{ marginTop: (windowWidth * 50) / 100 }}>
                    <Text
                      style={{
                        fontFamily: Font.fontregular,
                        fontSize: Font.name,
                        textAlign: "center",
                        color: Colors.Theme,
                      }}
                    >
                      {this.state.message}
                    </Text>
                  </View>
                ))}

              {this.state.pass_status !== "hospital" ? (
                <FlatList
                  data={this.state.nurse_data}
                  contentContainerStyle={{
                    paddingBottom: (windowWidth * 25) / 100,
                  }}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item, index }) => {
                    if (
                      this.state.nurse_data != "" &&
                      this.state.nurse_data != null
                    ) {
                      return (
                        <View
                          style={{
                            width: (windowWidth * 100) / 100,
                            backgroundColor: "#fff",
                            alignSelf: "center",
                            alignItems: "center",
                            marginTop: (windowWidth * 2) / 100,
                          }}
                        >
                          <View
                            style={{
                              width: (windowWidth * 90) / 100,
                              alignSelf: "center",
                              paddingVertical: (windowWidth * 2) / 100,
                              alignItems: "center",
                            }}
                          >
                            <View
                              style={{
                                width: "99%",
                                flexDirection: "row",
                                alignSelf: "center",
                              }}
                            >
                              <View style={{ width: "30%" }}>
                                <TouchableOpacity
                                  onPress={() => {
                                    consolepro.consolelog("image");
                                    this.props.navigation.navigate(
                                      "ServiceProviderDetails",
                                      {
                                        pass_status: this.state.pass_status,
                                        nurse_id: item.user_id,
                                        isFromHospital: false,
                                      }
                                    );
                                  }}
                                  style={{ width: "100%" }}
                                >
                                  <Image
                                    source={
                                      item.image == "NA" ||
                                        item.image == null ||
                                        item.image == ""
                                        ? require("../icons/No-Image3x.png")
                                        : {
                                          uri: config.img_url3 + item.image,
                                        }
                                    }
                                    style={{
                                      // alignSelf: 'center',
                                      borderWidth: 1,
                                      borderColor: "#0888D1",
                                      width: (windowWidth * 22) / 100,
                                      height: (windowWidth * 22) / 100,
                                      borderRadius: (windowWidth * 11) / 100,
                                    }}
                                  />
                                </TouchableOpacity>
                              </View>
                              <View
                                style={{
                                  width: "60%",
                                  marginTop: (windowWidth * 1) / 100,
                                }}
                              >
                                <Text
                                  onPress={() => {
                                    consolepro.consolelog("text");
                                    this.props.navigation.navigate(
                                      "ServiceProviderDetails",
                                      {
                                        pass_status: this.state.pass_status,
                                        nurse_id: item.user_id,
                                        isFromHospital: false,
                                      }
                                    );
                                  }}
                                  style={{
                                    fontFamily: Font.fontmedium,
                                    fontSize: Font.name,
                                    textAlign: config.textRotate,
                                  }}
                                >
                                  {item.provider_name}
                                </Text>
                                {this.state.pass_status !== "lab" ? (
                                  <>
                                    {item.speciality != "" &&
                                      item.speciality != null && (
                                        <Text
                                          style={{
                                            fontFamily: Font.fontregular,
                                            color: Colors.Theme,
                                            fontSize: Font.subtext,
                                            textAlign: config.textRotate,
                                            paddingVertical:
                                              (windowWidth * 0.5) / 100,
                                          }}
                                        >
                                          {item.speciality}
                                        </Text>
                                      )}
                                    <Text
                                      style={{
                                        paddingVertical:
                                          (windowWidth * 0.5) / 100,
                                        fontFamily: Font.fontregular,
                                        fontSize: Font.ssubtext,
                                        textAlign: config.textRotate,
                                        color: Colors.cardlighgray,
                                      }}
                                    >
                                      {item.experience} | {item.qualification}
                                    </Text>
                                    <View
                                      style={[
                                        {
                                          flexDirection: "row",
                                          marginTop: (windowWidth * 1) / 100,
                                        },
                                      ]}
                                    >
                                      <View
                                        style={{
                                          paddingRight: (windowWidth * 3) / 100,
                                          borderRadius: (windowWidth * 1) / 100,
                                          paddingHorizontal:
                                            (windowWidth * 1) / 100,
                                          paddingVertical:
                                            (windowWidth * 1.4) / 100,
                                          backgroundColor: Colors.gray6,
                                          flexDirection: "row",
                                        }}
                                      >
                                        <Image
                                          source={Icons.location}
                                          style={{
                                            resizeMode: "contain",
                                            width: (windowWidth * 4) / 100,
                                            height: (windowWidth * 4) / 100,
                                            marginLeft: (windowWidth * 1.5) / 100,
                                            tintColor: Colors.Theme,
                                          }}
                                        />
                                        <Text
                                          style={{
                                            marginLeft: (windowWidth * 1) / 100,
                                            fontFamily: Font.fontregular,
                                            fontSize: Font.ssubtext,
                                            textAlign: config.textRotate,
                                            color: Colors.DarkGrey,
                                          }}
                                        >
                                          {item.loc_text},
                                          <Text
                                            style={{
                                              color: Colors.Theme,
                                              fontFamily: Font.fontregular,
                                              textAlign: config.textRotate,
                                              fontSize: Font.ssubtext,
                                            }}
                                          >
                                            {" "}
                                            {item.distance}
                                          </Text>
                                        </Text>
                                      </View>
                                    </View>
                                  </>
                                ) : (
                                  <>
                                    <View
                                      style={[
                                        {
                                          flexDirection: "row",
                                          marginTop: (windowWidth * 1) / 100,
                                          marginBottom: (windowWidth * 4.5) / 100,
                                        },
                                      ]}
                                    >
                                      <View
                                        style={{
                                          paddingRight: (windowWidth * 3) / 100,
                                          borderRadius: (windowWidth * 1) / 100,
                                          paddingHorizontal:
                                            (windowWidth * 1) / 100,
                                          paddingVertical:
                                            (windowWidth * 1.4) / 100,
                                          // backgroundColor: Colors.gray6,
                                          flexDirection: "row",
                                        }}
                                      >
                                        <View
                                          style={{
                                            width: 30,
                                            height: 25,
                                            borderTopLeftRadius: 15,
                                            borderBottomLeftRadius: 15,
                                            backgroundColor: "transparent",
                                            justifyContent: "center",
                                            borderWidth: 1,
                                            borderColor: Colors.textblue,
                                          }}
                                        >
                                          <Icon
                                            name="plus"
                                            size={15}
                                            color={Colors.textblue}
                                            style={{
                                              alignContent: "center",
                                              alignSelf: "center",
                                              alignItems: "center",
                                            }}
                                          />
                                        </View>
                                        <View
                                          style={{
                                            width: 50,
                                            height: 25,
                                            borderTopRightRadius: 15,
                                            borderBottomRightRadius: 15,
                                            backgroundColor:
                                              Colors.buttoncolorhgreen,
                                            marginLeft: 5,
                                            justifyContent: "center",
                                            borderWidth: 1,
                                            borderColor: "transparent",
                                          }}
                                        >
                                          <Text
                                            style={{
                                              color: Colors.white,
                                              fontFamily: Font.fontregular,
                                              textAlign: config.textRotate,
                                              fontSize: Font.ssubtext,
                                              alignContent: "center",
                                              alignSelf: "center",
                                              alignItems: "center",
                                            }}
                                          >
                                            {item.safe_text}
                                          </Text>
                                        </View>
                                      </View>
                                      <Text
                                        style={{
                                          color: Colors.Theme,
                                          fontFamily: Font.fontregular,
                                          paddingVertical:
                                            (windowWidth * 2.5) / 100,
                                          fontSize: (windowWidth * 3.5) / 100,
                                          marginLeft: (windowWidth * 1) / 100,
                                        }}
                                      >
                                        {item.iso_certificate}
                                      </Text>
                                    </View>
                                  </>
                                )}

                                <View
                                  style={{
                                    width: "100%",
                                    flexDirection: "row",
                                    paddingVertical: (windowWidth * 2) / 100,
                                    borderRadius: (windowWidth * 1) / 100,
                                    alignItems: "center",
                                  }}
                                >
                                  {config.language == 0 ? (
                                    <Image
                                      source={Icons.clock}
                                      style={{
                                        resizeMode: "contain",
                                        width: (windowWidth * 4) / 100,
                                        height: (windowWidth * 4) / 100,
                                      }}
                                    />
                                  ) : (
                                    <Image
                                      source={Icons.clock_arabic_gray}
                                      style={{
                                        resizeMode: "contain",
                                        width: (windowWidth * 4) / 100,
                                        height: (windowWidth * 4) / 100,
                                      }}
                                    />
                                  )}
                                  <Text
                                    style={{
                                      fontFamily: Font.fontregular,
                                      fontSize: (windowWidth * 2.5) / 100,
                                      color: Colors.DarkGrey,
                                      marginLeft: (windowWidth * 1.5) / 100,
                                    }}
                                  >
                                    {item.av_text}
                                  </Text>

                                  <View
                                    style={{
                                      alignSelf: "center",
                                      marginTop: (windowWidth * 0.4) / 100,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        color: Colors.Theme,
                                        fontFamily: Font.fontmedium,
                                        fontSize: (windowWidth * 2.5) / 100,
                                        marginLeft: (windowWidth * 1) / 100,
                                      }}
                                    >
                                      {item.new_availablity}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                              {item.hospital_id !== "" && (
                                <View
                                  style={{
                                    backgroundColor: "#FFA800",
                                    width: "18%",
                                    height: 20,
                                    marginTop: -9,
                                    borderBottomLeftRadius:
                                      (windowWidth * 2) / 100,
                                    paddingVertical: 3,
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: "#fff",
                                      fontFamily: Font.fontmedium,
                                      fontSize: (windowWidth * 2.5) / 100,
                                      alignSelf: "center",
                                    }}
                                  >
                                    {Lang_chg.Hospital[config.language]}
                                  </Text>
                                </View>
                              )}
                            </View>
                            <View
                              style={{
                                width: "100%",
                                borderRadius: (windowWidth * 2) / 100,
                                alignItems: "center",
                                flexDirection: "row",
                                alignSelf: "center",
                                paddingBottom: (windowWidth * 2) / 100,
                              }}
                            >
                              <View
                                style={{
                                  width: "12%",
                                  alignSelf: "center",
                                  backgroundColor: Colors.buttoncolorhgreen,
                                  flexDirection: "row",
                                  // paddingHorizontal: (windowWidth * 1.5) / 100,
                                  paddingVertical: (windowWidth * 0.5) / 100,
                                  borderRadius: 4,
                                  alignItems: "center",
                                }}
                              >
                                <Image
                                  source={Icons.starrating}
                                  style={{
                                    tintColor: "#fff",
                                    width: (windowWidth * 3) / 100,
                                    height: (windowWidth * 3) / 100,
                                    alignSelf: "center",
                                    marginLeft: (windowWidth * 1) / 100,
                                  }}
                                />
                                <Text
                                  style={{
                                    fontFamily: Font.fontregular,
                                    fontSize: (windowWidth * 3) / 100,
                                    color: Colors.white,
                                    marginLeft: (windowWidth * 1) / 100,
                                  }}
                                >
                                  {item.avg_rating}.0
                                </Text>
                              </View>

                              <Text
                                style={{
                                  fontFamily: Font.fontmedium,
                                  fontSize: (windowWidth * 3) / 100,
                                  marginLeft: (windowWidth * 1.5) / 100,
                                }}
                              >
                                {item.booking_count}
                              </Text>
                            </View>
                            <View
                              style={{
                                flexDirection: "row",
                                backgroundColor: Colors.white,
                                paddingVertical: (windowWidth * 2) / 100,
                                borderTopWidth: (windowWidth * 0.3) / 100,
                                borderColor: Colors.bordercolor,
                                justifyContent: "space-between",
                              }}
                            >
                              <View
                                style={{
                                  flex: 1,
                                  paddingVertical: (windowWidth * 2) / 100,
                                }}
                              >
                                <Text
                                  style={{
                                    color: Colors.buttoncolorhgreen,
                                    fontSize: (windowWidth * 3) / 100,
                                    fontFamily: Font.fontmedium,
                                    textAlign: config.textRotate,
                                  }}
                                >
                                  {item.bavi_text}
                                </Text>
                              </View>
                              <TouchableOpacity
                                onPress={() =>
                                  this.props.navigation.navigate("Booking", {
                                    pass_status: this.state.pass_status,
                                    nurse_id: item.user_id,
                                    indexPosition: 0,
                                  })
                                }
                                style={{
                                  backgroundColor: Colors.Theme2,
                                  borderRadius: (windowWidth * 1) / 100,
                                  justifyContent: "center",
                                  paddingHorizontal: (windowWidth * 2) / 100,
                                  paddingVertical: (windowWidth * 0.5) / 100,
                                }}
                              >
                                <Text
                                  style={{
                                    color: Colors.white,
                                    fontSize: (windowWidth * 2.5) / 100,
                                    fontFamily: Font.fontmedium,
                                    textAlign: "center",
                                  }}
                                >
                                  {this.state.pass_status === "lab"
                                    ? Lang_chg.BOOKTEST[config.language]
                                    : Lang_chg.BOOKAPPOINTMENT[
                                    config.language
                                    ]}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      );
                    }
                  }}
                />
              ) : (
                <FlatList
                  data={this.state.nurse_data}
                  contentContainerStyle={{
                    paddingBottom: (windowWidth * 25) / 100,
                  }}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item, index }) => {
                    if (
                      this.state.nurse_data != "" &&
                      this.state.nurse_data != null &&
                      item.available_provider.length !== 0
                    ) {
                      return (
                        <View
                          style={{
                            width: (windowWidth * 100) / 100,
                            backgroundColor: "#fff",
                            alignSelf: "center",
                            alignItems: "center",
                            marginTop: (windowWidth * 2) / 100,
                          }}
                        >
                          <View
                            style={{
                              width: (windowWidth * 90) / 100,
                              alignSelf: "center",
                              paddingVertical: (windowWidth * 2) / 100,
                              alignItems: "center",
                            }}
                          >
                            <View
                              style={{
                                width: "99%",
                                flexDirection: "row",
                                alignSelf: "center",
                              }}
                            >
                              <View style={{ width: "25%" }}>
                                <TouchableOpacity
                                  onPress={() => {
                                    this.setState(
                                      {
                                        isHospitalDoctorList:
                                          !this.state.isHospitalDoctorList,
                                        hospitalName: item.hospital_name,
                                        hospitalId: item.hospital_id,
                                      },
                                      () => {
                                        this.getHospitalSpecialties();
                                        this.getHospitalDoctorList();
                                      }
                                    );
                                  }}
                                  style={{ width: "100%" }}
                                >
                                  <Image
                                    source={
                                      item.image == "NA" ||
                                        item.image == null ||
                                        item.image == ""
                                        ? require("../icons/No-Image3x.png")
                                        : {
                                          uri: config.img_url3 + item.image,
                                        }
                                    }
                                    style={{
                                      // alignSelf: 'center',
                                      borderWidth: 1,
                                      borderColor: "#0888D1",
                                      width: (windowWidth * 18) / 100,
                                      height: (windowWidth * 18) / 100,
                                      borderRadius: (windowWidth * 9) / 100,
                                    }}
                                  />
                                </TouchableOpacity>
                              </View>
                              <View
                                style={{
                                  width: "69%",
                                  marginTop: (windowWidth * 1) / 100,
                                }}
                              >
                                <Text
                                  onPress={() => {
                                    this.setState(
                                      {
                                        isHospitalDoctorList:
                                          !this.state.isHospitalDoctorList,
                                        hospitalName: item.hospital_name,
                                        hospitalId: item.hospital_id,
                                      },
                                      () => {
                                        this.getHospitalSpecialties();
                                        this.getHospitalDoctorList();
                                      }
                                    );
                                  }}
                                  style={{
                                    fontFamily: Font.fontmedium,
                                    fontSize: Font.name,
                                    textAlign: config.textRotate,
                                  }}
                                >
                                  {item.hospital_name}
                                </Text>
                                <View
                                  style={{
                                    width: "100%",
                                    borderRadius: (windowWidth * 2) / 100,
                                    alignItems: "center",
                                    flexDirection: "row",
                                    marginTop: (windowWidth * 1) / 50,
                                    alignSelf: "center",
                                    paddingBottom: (windowWidth * 2) / 100,
                                  }}
                                >
                                  <View
                                    style={{
                                      width: "20%",
                                      alignSelf: "center",
                                      backgroundColor:
                                        Colors.buttoncolorhgreen,
                                      flexDirection: "row",
                                      // paddingHorizontal: (windowWidth * 1.5) / 100,
                                      paddingVertical: (windowWidth * 0.5) / 100,
                                      borderRadius: 4,
                                      alignItems: "center",
                                    }}
                                  >
                                    <Image
                                      source={Icons.starrating}
                                      style={{
                                        tintColor: "#fff",
                                        width: (windowWidth * 3) / 100,
                                        height: (windowWidth * 3) / 100,
                                        alignSelf: "center",
                                        marginLeft: (windowWidth * 1) / 100,
                                      }}
                                    />
                                    <Text
                                      style={{
                                        fontFamily: Font.fontregular,
                                        fontSize: (windowWidth * 3) / 100,
                                        color: Colors.white,
                                        marginLeft: (windowWidth * 1) / 100,
                                      }}
                                    >
                                      {item.avg_rating}.0
                                    </Text>
                                  </View>
                                  <Text
                                    style={{
                                      fontFamily: Font.fontmedium,
                                      fontSize: (windowWidth * 3) / 100,
                                      marginLeft: (windowWidth * 1.5) / 100,
                                    }}
                                  >
                                    {item.hb_count}
                                  </Text>
                                </View>
                              </View>
                            </View>
                            {item.available_provider != "" && (
                              <View
                                style={{
                                  height: 200,
                                  alignSelf: "flex-start",
                                  marginTop: (windowWidth * 4) / 100,
                                }}
                              >
                                <FlatList
                                  showsHorizontalScrollIndicator={false}
                                  horizontal={true}
                                  data={item.available_provider}
                                  renderItem={({ item, index }) => {
                                    if (item.user_type === "doctor") {
                                      return (
                                        <View
                                          style={{
                                            width: (windowWidth * 44) / 100,
                                          }}
                                        >
                                          <TouchableOpacity
                                            onPress={() => {
                                              this.props.navigation.navigate(
                                                "ServiceProviderDetails",
                                                {
                                                  pass_status: "doctor",
                                                  nurse_id: item.user_id,
                                                  isFromHospital: true,
                                                  hospitalId:
                                                    this.state.hospitalId,
                                                }
                                              );
                                            }}
                                            style={{
                                              width: (windowWidth * 40) / 100,
                                              height: 190,
                                              alignItems: "center",
                                              justifyContent: "center",
                                              borderWidth: 1,
                                              borderColor:
                                                Colors.Border,
                                              backgroundColor: "#fff",
                                              borderRadius:
                                                (windowWidth * 2) / 100,
                                            }}
                                          >
                                            <Image
                                              source={
                                                item.image == "NA" ||
                                                  item.image == null ||
                                                  item.image == ""
                                                  ? require("../icons/No-Image3x.png")
                                                  : {
                                                    uri:
                                                      config.img_url3 +
                                                      item.image,
                                                  }
                                              }
                                              style={{
                                                borderWidth: 1,
                                                borderColor: "#0888D1",
                                                width: (windowWidth * 26) / 100,
                                                height: (windowWidth * 26) / 100,
                                                borderRadius:
                                                  (windowWidth * 13) / 100,
                                              }}
                                            />

                                            <View
                                              style={{
                                                borderRadius:
                                                  (windowWidth * 1) / 100,
                                                marginTop: -15,
                                                paddingHorizontal:
                                                  (windowWidth * 2) / 100,
                                                paddingVertical:
                                                  (windowWidth * 1) / 100,
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                backgroundColor:
                                                  Colors.buttoncolorhgreen,
                                              }}
                                            >
                                              <Image
                                                source={Icons.starrating}
                                                style={{
                                                  tintColor: "#fff",
                                                  width: 10,
                                                  height: 10,
                                                  alignSelf: "center",
                                                }}
                                              />
                                              <Text
                                                style={{
                                                  fontFamily:
                                                    Font.fontregular,
                                                  fontSize:
                                                    (windowWidth * 2.5) / 100,
                                                  color: Colors.white,
                                                  marginLeft:
                                                    (windowWidth * 1.2) / 100,
                                                }}
                                              >
                                                {item.avg_rating}.0
                                              </Text>
                                            </View>
                                            <View
                                              style={{
                                                marginTop:
                                                  (windowWidth * 1) / 100,
                                                width: "90%",
                                                alignItems: "center",
                                                justifyContent: "center",
                                              }}
                                            >
                                              <Text
                                                style={{
                                                  color: "#000",
                                                  fontSize:
                                                    (windowWidth * 3) / 100,
                                                  marginTop:
                                                    (windowWidth * 1) / 100,
                                                  fontFamily: Font.fontmedium,
                                                  textAlign:
                                                    config.textRotate,
                                                }}
                                                numberOfLines={1}
                                              >
                                                {item.qualification}
                                              </Text>
                                            </View>
                                            <View
                                              style={{
                                                flexDirection: "row",
                                                backgroundColor:
                                                  Colors.white,
                                                paddingVertical:
                                                  (windowWidth * 2) / 100,
                                                borderTopWidth:
                                                  (windowWidth * 0.3) / 100,
                                                marginEnd: 10,
                                                marginStart: 10,
                                                marginTop: 10,
                                                borderColor:
                                                  Colors.bordercolor,
                                                justifyContent:
                                                  "space-between",
                                              }}
                                            >
                                              <Text
                                                style={{
                                                  color: Colors.Theme,
                                                  fontSize:
                                                    (windowWidth * 3) / 100,
                                                  fontFamily:
                                                    Font.fontregular,
                                                  textAlign:
                                                    config.textRotate,
                                                  marginTop: 5,
                                                }}
                                              >
                                                {
                                                  Lang_chg.BookConsultation[
                                                  config.language
                                                  ]
                                                }
                                              </Text>
                                            </View>
                                          </TouchableOpacity>
                                        </View>
                                      );
                                    }
                                  }}
                                />
                              </View>
                            )}
                            <View
                              style={{
                                flexDirection: "row",
                                backgroundColor: Colors.white,
                                justifyContent: "space-between",
                              }}
                            >
                              <View
                                style={{
                                  flex: 1,
                                  paddingVertical: (windowWidth * 2) / 100,
                                }}
                              >
                                <Text
                                  style={{
                                    color: Colors.gray4,
                                    fontSize: (windowWidth * 3) / 100,
                                    fontFamily: Font.fontmedium,
                                    textAlign: config.textRotate,
                                  }}
                                >
                                  {
                                    Lang_chg.BookOnlineAppointment[
                                    config.language
                                    ]
                                  }
                                </Text>
                              </View>
                              <TouchableOpacity
                                onPress={() => {
                                  this.setState(
                                    {
                                      isHospitalDoctorList:
                                        !this.state.isHospitalDoctorList,
                                      hospitalName: item.hospital_name,
                                      hospitalId: item.hospital_id,
                                    },
                                    () => {
                                      this.getHospitalSpecialties();
                                      this.getHospitalDoctorList();
                                    }
                                  );
                                }}
                                style={{
                                  backgroundColor: Colors.buttoncolorhgreen,
                                  borderRadius: (windowWidth * 1) / 100,
                                  justifyContent: "center",
                                  paddingHorizontal: (windowWidth * 2) / 100,
                                  paddingVertical: (windowWidth * 0.5) / 100,
                                }}
                              >
                                <Text
                                  style={{
                                    color: Colors.white,
                                    fontSize: (windowWidth * 2.5) / 100,
                                    fontFamily: Font.fontmedium,
                                    textAlign: "center",
                                  }}
                                >
                                  {
                                    Lang_chg.FindSpecialtyDoctor[
                                    config.language
                                    ]
                                  }
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      );
                    }
                  }}
                />
              )}
            </View>
          )}
        </ScrollView>



        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.specialtyModal}
          onRequestClose={() => { }}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              this.setState({ specialtyModal: false });
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
                  paddingVertical: (windowWidth * 2) / 100,
                }}
              >
                <Text
                  style={{
                    paddingLeft: (windowWidth * 4.5) / 100,
                    paddingRight: (windowWidth * 4.5) / 100,
                    textAlign: config.textRotate,
                    fontFamily: Font.fontregular,
                    fontSize: (windowWidth * 4) / 100,
                    color: Colors.textwhite,
                  }}
                >
                  {Lang_chg.selectSpecialty[config.language]}
                </Text>
              </View>

              <View style={{ width: "100%", alignSelf: "center" }}>
                <FlatList
                  contentContainerStyle={{ paddingBottom: (windowWidth * 2) / 100 }}
                  data={this.state.specialtyArr}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          this.setState(
                            {
                              specialtyModal: false,
                              specialtyData: item.name,
                            },
                            () => {
                              this.getHospitalDoctorList();
                            }
                          );
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
                                paddingVertical: (windowWidth * 2) / 100,
                                marginLeft: (windowWidth * 5) / 100,
                              },
                              item.line == 0
                                ? { borderBottomColor: "#0000001F" }
                                : { borderBottomColor: "#fff" },
                            ]}
                          >
                            <Text
                              style={{
                                color: Colors.textblack,
                                fontSize: (windowWidth * 4) / 100,
                                paddingLeft: (windowWidth * 2) / 100,
                                textAlign: config.textRotate,
                              }}
                            >
                              {item.name}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

      </View>
    );
  }
}
