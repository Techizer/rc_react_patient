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
} from "react-native";
import {
  Colors,
  Font,
  config,
  mobileW,
  localStorage,
  localimag,
  consolepro,
  Lang_chg,
  apifuntion,
} from "../Provider/utilslib/Utils";

import Styles from "../Styles";
import Footer from "../Footer";
import HideWithKeyboard from "react-native-hide-with-keyboard";
import Icon from "react-native-vector-icons/AntDesign";
import { Col } from "ionic-angular";

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

    let url =
      config.baseURL +
      (this.state.pass_status === "hospital"
        ? "api-patient-hospital-list"
        : "api-patient-service-provider-list");
    console.log("url", url);

    var data = new FormData();
    var user_id = "0"
    if (global.isLogin == false) {
      data.append("work_area", "Saudi Arabia");
    } else {
      let user_details = await localStorage.getItemObject("user_arr");
      user_id = user_details["user_id"];
      data.append("work_area", user_details["work_area"]);
    }

    data.append("login_user_id", user_id);
    data.append("service_type", this.state.pass_status);
    data.append("page_count", 1);

    if (this.state.pass_status !== "hospital") {
      data.append("provider_name", this.state.provider_name);
    }

    if (this.state.pass_status === "doctor") {
      data.append("docEnableFor", this.state.enableFor);
    }

    if (this.state.pass_status === "hospital") {
      data.append("hospital_name", this.state.provider_name);
    }

    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        consolepro.consolelog("obj provider data: ", JSON.stringify(obj));

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
      <View style={Styles.container1}>
        <View style={{ backgroundColor: "#f1f2f4", flex: 1 }}>
          {/* <Text>Home</Text> */}
          <View
            style={{
              backgroundColor: "#fff",
              paddingVertical: (mobileW * 2) / 100,
              borderBottomWidth: 1,
              borderBottomColor: Colors.LIGHT_CLIENT_BORDER,
            }}
          >
            <View
              style={{
                padding: (mobileW * 2.5) / 100,
                flexDirection: "row",
                width: "99%",
                alignSelf: "center",
                paddingTop: (mobileW * 3) / 100,
                backgroundColor: Colors.white_color,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: "10%",
                  // backgroundColor: 'pink',
                  alignSelf: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.state.isHospitalDoctorList
                      ? this.setState({
                        isHospitalDoctorList:
                          !this.state.isHospitalDoctorList,
                        availableDoctorsUnderHospital: [],
                      })
                      : this.props.navigation.goBack();
                  }}
                >
                  <Image
                    source={
                      config.textalign == "right"
                        ? localimag.arabic_back
                        : localimag.backarrow
                    }
                    style={{
                      resizeMode: "contain",
                      width: (mobileW * 9) / 100,
                      alignSelf: "center",
                      height: (mobileW * 9) / 100,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  // backgroundColor: 'yellow',
                  width: "80%",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontFamily: Font.fontmedium,
                    fontSize: (mobileW * 4) / 100,
                  }}
                >
                  {this.state.isHospitalDoctorList
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
                                : Lang_chg.Lab[config.language]}
                </Text>
              </View>
              <View
                style={{
                  width: "10%",
                  alignSelf: "center",
                  // backgroundColor: 'red',
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("Notifications");
                  }}
                >
                  <Image
                    // tintColor="#fff"
                    source={
                      this.state.notification_count > 0
                        ? localimag.notifications
                        : localimag.notifications_sec
                    }
                    style={{
                      alignSelf: "center",
                      resizeMode: "contain",
                      width: (mobileW * 6) / 100,
                      height: (mobileW * 6) / 100,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <ScrollView>
            <View style={{ backgroundColor: "#f1f2f4" }}>
              {this.state.pass_status === "hospital" && (
                <View
                  style={{
                    marginTop: (mobileW * 3) / 100,
                    width: "100%",
                    marginStart: (mobileW * 5) / 100,
                    marginBottom: (mobileW * 2) / 100,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "left",
                      fontFamily: Font.fontmedium,
                      fontSize: (mobileW * 4) / 100,
                    }}
                  >
                    {this.state.isHospitalDoctorList
                      ? this.state.hospitalName
                      : Lang_chg.DoctorsUnderHospital[config.language]}
                  </Text>
                </View>
              )}
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
                        borderRadius: (mobileW * 1) / 100,
                        paddingVertical: (mobileW * 3.5) / 100,
                        marginTop: (mobileW * 2) / 100,
                        marginBottom: (mobileW * 2) / 100,
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
                            fontSize: (mobileW * 3.7) / 100,
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
                              height: (mobileW * 4) / 100,
                              width: (mobileW * 4) / 100,
                              alignSelf: "flex-end",
                            }}
                            source={localimag.downarrow}
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
                    marginTop: (mobileW * 1.5) / 100,
                    marginBottom: (mobileW * 2) / 100,
                    alignSelf: "center",
                    backgroundColor: Colors.textwhite,
                    padding: (mobileW * 1) / 100,
                    borderRadius: (mobileW * 1) / 100,
                    alignItems: "center",
                  }}
                >
                  {/* search box */}

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
                    placeholderTextColor={Colors.searchPlaceholder}
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
                        color: "#000",
                        width: "83%",
                        marginLeft: (mobileW * 1) / 100,
                        fontFamily: Font.fontregular,
                        paddingVertical: (mobileW * 2) / 100,
                        textAlign: config.textalign,
                      },
                      this.state.pass_status == "physiotherapy" || "caregiver"
                        ? { fontSize: (mobileW * 3.7) / 100 }
                        : { fontSize: (mobileW * 4) / 100 },
                    ]}
                  />
                  <View style={{ width: "5%" }} />
                  <TouchableOpacity
                    onPress={() => {
                      this.get_Services();
                    }}
                  >
                    <View
                      style={{
                        alignSelf: "center",
                      }}
                    >
                      <Image
                        source={localimag.searchiocn2}
                        style={{
                          width: (mobileW * 10) / 100,
                          height: (mobileW * 10) / 100,
                          // (mobileW * 5.5) / 100,
                          borderRadius: (mobileW * 1.5) / 100,
                          alignSelf: "center",
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            {this.state.isHospitalDoctorList ? (
              <FlatList
                contentContainerStyle={{
                  paddingBottom: (mobileW * 25) / 100,
                }}
                showsVerticalScrollIndicator={false}
                data={this.state.availableDoctorsUnderHospital}
                renderItem={({ item, index }) => {
                  if (item.user_type === "doctor") {
                    return (
                      <View
                        style={{
                          width: (mobileW * 100) / 100,
                          backgroundColor: "#fff",
                          alignSelf: "center",
                          alignItems: "center",
                          marginTop: (mobileW * 2) / 100,
                        }}
                      >
                        <View
                          style={{
                            width: (mobileW * 90) / 100,
                            alignSelf: "center",
                            paddingVertical: (mobileW * 2) / 100,
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
                                    width: (mobileW * 22) / 100,
                                    height: (mobileW * 22) / 100,
                                    borderRadius: (mobileW * 11) / 100,
                                  }}
                                />
                              </TouchableOpacity>
                            </View>
                            <View
                              style={{
                                width: "60%",
                                marginTop: (mobileW * 1) / 100,
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
                                      color: Colors.theme_color,
                                      fontSize: Font.subtext,
                                      textAlign: config.textRotate,
                                      paddingVertical: (mobileW * 0.5) / 100,
                                    }}
                                  >
                                    {item.speciality}
                                  </Text>
                                )}
                              <Text
                                style={{
                                  paddingVertical: (mobileW * 0.5) / 100,
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
                                  paddingVertical: (mobileW * 2) / 100,
                                  borderRadius: (mobileW * 1) / 100,
                                  alignItems: "center",
                                }}
                              >
                                {config.language == 0 ? (
                                  <Image
                                    source={localimag.clock}
                                    style={{
                                      resizeMode: "contain",
                                      width: (mobileW * 4) / 100,
                                      height: (mobileW * 4) / 100,
                                    }}
                                  />
                                ) : (
                                  <Image
                                    source={localimag.clock_arabic_gray}
                                    style={{
                                      resizeMode: "contain",
                                      width: (mobileW * 4) / 100,
                                      height: (mobileW * 4) / 100,
                                    }}
                                  />
                                )}
                                <Text
                                  style={{
                                    fontFamily: Font.fontregular,
                                    fontSize: (mobileW * 2.5) / 100,
                                    color: Colors.regulartextcolor,
                                    marginLeft: (mobileW * 1.5) / 100,
                                  }}
                                >
                                  {item.av_text}
                                </Text>

                                <View
                                  style={{
                                    alignSelf: "center",
                                    marginTop: (mobileW * 0.4) / 100,
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: Colors.theme_color,
                                      fontFamily: Font.fontmedium,
                                      fontSize: (mobileW * 2.5) / 100,
                                      marginLeft: (mobileW * 1) / 100,
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
                                borderBottomLeftRadius: (mobileW * 2) / 100,
                                paddingVertical: 3,
                              }}
                            >
                              <Text
                                style={{
                                  color: "#fff",
                                  fontFamily: Font.fontmedium,
                                  fontSize: (mobileW * 2.5) / 100,
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
                              borderRadius: (mobileW * 2) / 100,
                              alignItems: "center",
                              flexDirection: "row",
                              alignSelf: "center",
                              paddingBottom: (mobileW * 2) / 100,
                            }}
                          >
                            <View
                              style={{
                                width: "12%",
                                alignSelf: "center",
                                backgroundColor: Colors.buttoncolorhgreen,
                                flexDirection: "row",
                                // paddingHorizontal: (mobileW * 1.5) / 100,
                                paddingVertical: (mobileW * 0.5) / 100,
                                borderRadius: 4,
                                alignItems: "center",
                              }}
                            >
                              <Image
                                source={localimag.starrating}
                                style={{
                                  tintColor: "#fff",
                                  width: (mobileW * 3) / 100,
                                  height: (mobileW * 3) / 100,
                                  alignSelf: "center",
                                  marginLeft: (mobileW * 1) / 100,
                                }}
                              />
                              <Text
                                style={{
                                  fontFamily: Font.fontregular,
                                  fontSize: (mobileW * 3) / 100,
                                  color: Colors.white_color,
                                  marginLeft: (mobileW * 1) / 100,
                                }}
                              >
                                {item.avg_rating}.0
                              </Text>
                            </View>

                            <Text
                              style={{
                                fontFamily: Font.fontmedium,
                                fontSize: (mobileW * 3) / 100,
                                marginLeft: (mobileW * 1.5) / 100,
                              }}
                            >
                              {item.booking_count}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              backgroundColor: Colors.white_color,
                              paddingVertical: (mobileW * 2) / 100,
                              borderTopWidth: (mobileW * 0.3) / 100,
                              borderColor: Colors.bordercolor,
                              justifyContent: "space-between",
                            }}
                          >
                            <View
                              style={{
                                flex: 1,
                                paddingVertical: (mobileW * 2) / 100,
                              }}
                            >
                              <Text
                                style={{
                                  color: (item.provider_available == "0") ? Colors.buttoncolorhgreen : Colors.regulartextcolor,
                                  fontSize: (mobileW * 3) / 100,
                                  fontFamily: Font.fontmedium,
                                  textAlign: config.textRotate,
                                }}
                              >
                                {item.bavi_text}
                              </Text>
                            </View>
                            {
                              (item.provider_available == "0") &&
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
                                  backgroundColor: Colors.buttoncolorblue2,
                                  borderRadius: (mobileW * 1) / 100,
                                  justifyContent: "center",
                                  paddingHorizontal: (mobileW * 2) / 100,
                                  paddingVertical: (mobileW * 0.5) / 100,
                                }}
                              >
                                <Text
                                  style={{
                                    color: Colors.white_color,
                                    fontSize: (mobileW * 2.5) / 100,
                                    fontFamily: Font.fontmedium,
                                    textAlign: "center",
                                  }}
                                >
                                  {Lang_chg.BOOKAPPOINTMENT[config.language]}
                                </Text>
                              </TouchableOpacity>
                            }
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
                    <View style={{
                      marginTop: (mobileW * 55) / 100,
                      width: '75%',
                      alignSelf: 'center'
                    }}>
                      <Text
                        style={{
                          fontFamily: Font.fontregular,
                          fontSize: Font.regulartext_size,
                          textAlign: "center",
                          color: Colors.theme_color,
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
                      paddingBottom: (mobileW * 25) / 100,
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
                              width: (mobileW * 100) / 100,
                              backgroundColor: "#fff",
                              alignSelf: "center",
                              alignItems: "center",
                              marginTop: (mobileW * 2) / 100,
                            }}
                          >
                            <View
                              style={{
                                width: (mobileW * 90) / 100,
                                alignSelf: "center",
                                paddingVertical: (mobileW * 2) / 100,
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
                                        width: (mobileW * 22) / 100,
                                        height: (mobileW * 22) / 100,
                                        borderRadius: (mobileW * 11) / 100,
                                      }}
                                    />
                                  </TouchableOpacity>
                                </View>
                                <View
                                  style={{
                                    width: "60%",
                                    marginTop: (mobileW * 1) / 100,
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
                                              color: Colors.theme_color,
                                              fontSize: Font.subtext,
                                              textAlign: config.textRotate,
                                              paddingVertical:
                                                (mobileW * 0.5) / 100,
                                            }}
                                          >
                                            {item.speciality}
                                          </Text>
                                        )}
                                      <Text
                                        style={{
                                          paddingVertical:
                                            (mobileW * 0.5) / 100,
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
                                            marginTop: (mobileW * 1) / 100,
                                          },
                                        ]}
                                      >
                                        <View
                                          style={{
                                            paddingRight: (mobileW * 3) / 100,
                                            borderRadius: (mobileW * 1) / 100,
                                            paddingHorizontal:
                                              (mobileW * 1) / 100,
                                            paddingVertical:
                                              (mobileW * 1.4) / 100,
                                            backgroundColor: Colors.gray6,
                                            flexDirection: "row",
                                          }}
                                        >
                                          <Image
                                            source={localimag.location}
                                            style={{
                                              resizeMode: "contain",
                                              width: (mobileW * 4) / 100,
                                              height: (mobileW * 4) / 100,
                                              marginLeft: (mobileW * 1.5) / 100,
                                              tintColor: Colors.theme_color,
                                            }}
                                          />
                                          <Text
                                            style={{
                                              marginLeft: (mobileW * 1) / 100,
                                              fontFamily: Font.fontregular,
                                              fontSize: Font.ssubtext,
                                              textAlign: config.textRotate,
                                              color: Colors.regulartextcolor,
                                            }}
                                          >
                                            {item.loc_text},
                                            <Text
                                              style={{
                                                color: Colors.theme_color,
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
                                            marginTop: (mobileW * 1) / 100,
                                            marginBottom: (mobileW * 4.5) / 100,
                                          },
                                        ]}
                                      >
                                        <View
                                          style={{
                                            paddingRight: (mobileW * 3) / 100,
                                            borderRadius: (mobileW * 1) / 100,
                                            paddingHorizontal:
                                              (mobileW * 1) / 100,
                                            paddingVertical:
                                              (mobileW * 1.4) / 100,
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
                                                color: Colors.white_color,
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
                                            color: Colors.theme_color,
                                            fontFamily: Font.fontregular,
                                            paddingVertical:
                                              (mobileW * 2.5) / 100,
                                            fontSize: (mobileW * 3.5) / 100,
                                            marginLeft: (mobileW * 1) / 100,
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
                                      paddingVertical: (mobileW * 2) / 100,
                                      borderRadius: (mobileW * 1) / 100,
                                      alignItems: "center",
                                    }}
                                  >
                                    {config.language == 0 ? (
                                      <Image
                                        source={localimag.clock}
                                        style={{
                                          resizeMode: "contain",
                                          width: (mobileW * 4) / 100,
                                          height: (mobileW * 4) / 100,
                                        }}
                                      />
                                    ) : (
                                      <Image
                                        source={localimag.clock_arabic_gray}
                                        style={{
                                          resizeMode: "contain",
                                          width: (mobileW * 4) / 100,
                                          height: (mobileW * 4) / 100,
                                        }}
                                      />
                                    )}
                                    <Text
                                      style={{
                                        fontFamily: Font.fontregular,
                                        fontSize: (mobileW * 2.5) / 100,
                                        color: Colors.regulartextcolor,
                                        marginLeft: (mobileW * 1.5) / 100,
                                      }}
                                    >
                                      {item.av_text}
                                    </Text>

                                    <View
                                      style={{
                                        alignSelf: "center",
                                        marginTop: (mobileW * 0.4) / 100,
                                      }}
                                    >
                                      <Text
                                        style={{
                                          color: Colors.theme_color,
                                          fontFamily: Font.fontmedium,
                                          fontSize: (mobileW * 2.5) / 100,
                                          marginLeft: (mobileW * 1) / 100,
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
                                        (mobileW * 2) / 100,
                                      paddingVertical: 3,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        color: "#fff",
                                        fontFamily: Font.fontmedium,
                                        fontSize: (mobileW * 2.5) / 100,
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
                                  borderRadius: (mobileW * 2) / 100,
                                  alignItems: "center",
                                  flexDirection: "row",
                                  alignSelf: "center",
                                  paddingBottom: (mobileW * 2) / 100,
                                }}
                              >
                                <View
                                  style={{
                                    width: "12%",
                                    alignSelf: "center",
                                    backgroundColor: Colors.buttoncolorhgreen,
                                    flexDirection: "row",
                                    // paddingHorizontal: (mobileW * 1.5) / 100,
                                    paddingVertical: (mobileW * 0.5) / 100,
                                    borderRadius: 4,
                                    alignItems: "center",
                                  }}
                                >
                                  <Image
                                    source={localimag.starrating}
                                    style={{
                                      tintColor: "#fff",
                                      width: (mobileW * 3) / 100,
                                      height: (mobileW * 3) / 100,
                                      alignSelf: "center",
                                      marginLeft: (mobileW * 1) / 100,
                                    }}
                                  />
                                  <Text
                                    style={{
                                      fontFamily: Font.fontregular,
                                      fontSize: (mobileW * 3) / 100,
                                      color: Colors.white_color,
                                      marginLeft: (mobileW * 1) / 100,
                                    }}
                                  >
                                    {item.avg_rating}.0
                                  </Text>
                                </View>

                                <Text
                                  style={{
                                    fontFamily: Font.fontmedium,
                                    fontSize: (mobileW * 3) / 100,
                                    marginLeft: (mobileW * 1.5) / 100,
                                  }}
                                >
                                  {item.booking_count}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  backgroundColor: Colors.white_color,
                                  paddingVertical: (mobileW * 2) / 100,
                                  borderTopWidth: (mobileW * 0.3) / 100,
                                  borderColor: Colors.bordercolor,
                                  justifyContent: "space-between",
                                }}
                              >
                                <View
                                  style={{
                                    flex: 1,
                                    paddingVertical: (mobileW * 2) / 100,
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: (item.provider_available == "0") ? Colors.buttoncolorhgreen : Colors.regulartextcolor,
                                      fontSize: (mobileW * 3) / 100,
                                      fontFamily: Font.fontmedium,
                                      textAlign: config.textRotate,
                                    }}
                                  >
                                    {item.bavi_text}
                                  </Text>
                                </View>
                                {
                                  (item.provider_available == "0") &&
                                  <TouchableOpacity
                                    onPress={() =>
                                      this.props.navigation.navigate("Booking", {
                                        pass_status: this.state.pass_status,
                                        nurse_id: item.user_id,
                                        indexPosition: 0,
                                      })
                                    }
                                    style={{
                                      backgroundColor: Colors.buttoncolorblue2,
                                      borderRadius: (mobileW * 1) / 100,
                                      justifyContent: "center",
                                      paddingHorizontal: (mobileW * 2) / 100,
                                      paddingVertical: (mobileW * 0.5) / 100,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        color: Colors.white_color,
                                        fontSize: (mobileW * 2.5) / 100,
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
                                }

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
                      paddingBottom: (mobileW * 25) / 100,
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
                              width: (mobileW * 100) / 100,
                              backgroundColor: "#fff",
                              alignSelf: "center",
                              alignItems: "center",
                              marginTop: (mobileW * 2) / 100,
                            }}
                          >
                            <View
                              style={{
                                width: (mobileW * 90) / 100,
                                alignSelf: "center",
                                paddingVertical: (mobileW * 2) / 100,
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
                                        width: (mobileW * 18) / 100,
                                        height: (mobileW * 18) / 100,
                                        borderRadius: (mobileW * 9) / 100,
                                      }}
                                    />
                                  </TouchableOpacity>
                                </View>
                                <View
                                  style={{
                                    width: "69%",
                                    marginTop: (mobileW * 1) / 100,
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
                                      borderRadius: (mobileW * 2) / 100,
                                      alignItems: "center",
                                      flexDirection: "row",
                                      marginTop: (mobileW * 1) / 50,
                                      alignSelf: "center",
                                      paddingBottom: (mobileW * 2) / 100,
                                    }}
                                  >
                                    <View
                                      style={{
                                        width: "20%",
                                        alignSelf: "center",
                                        backgroundColor:
                                          Colors.buttoncolorhgreen,
                                        flexDirection: "row",
                                        // paddingHorizontal: (mobileW * 1.5) / 100,
                                        paddingVertical: (mobileW * 0.5) / 100,
                                        borderRadius: 4,
                                        alignItems: "center",
                                      }}
                                    >
                                      <Image
                                        source={localimag.starrating}
                                        style={{
                                          tintColor: "#fff",
                                          width: (mobileW * 3) / 100,
                                          height: (mobileW * 3) / 100,
                                          alignSelf: "center",
                                          marginLeft: (mobileW * 1) / 100,
                                        }}
                                      />
                                      <Text
                                        style={{
                                          fontFamily: Font.fontregular,
                                          fontSize: (mobileW * 3) / 100,
                                          color: Colors.white_color,
                                          marginLeft: (mobileW * 1) / 100,
                                        }}
                                      >
                                        {item.avg_rating}.0
                                      </Text>
                                    </View>
                                    <Text
                                      style={{
                                        fontFamily: Font.fontmedium,
                                        fontSize: (mobileW * 3) / 100,
                                        marginLeft: (mobileW * 1.5) / 100,
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
                                    marginTop: (mobileW * 4) / 100,
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
                                              width: (mobileW * 44) / 100,
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
                                                width: (mobileW * 40) / 100,
                                                height: 190,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                borderWidth: 1,
                                                borderColor:
                                                  Colors.LIGHT_CLIENT_BORDER,
                                                backgroundColor: "#fff",
                                                borderRadius:
                                                  (mobileW * 2) / 100,
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
                                                  width: (mobileW * 26) / 100,
                                                  height: (mobileW * 26) / 100,
                                                  borderRadius:
                                                    (mobileW * 13) / 100,
                                                }}
                                              />

                                              <View
                                                style={{
                                                  borderRadius:
                                                    (mobileW * 1) / 100,
                                                  marginTop: -15,
                                                  paddingHorizontal:
                                                    (mobileW * 2) / 100,
                                                  paddingVertical:
                                                    (mobileW * 1) / 100,
                                                  flexDirection: "row",
                                                  alignItems: "center",
                                                  justifyContent: "center",
                                                  backgroundColor:
                                                    Colors.buttoncolorhgreen,
                                                }}
                                              >
                                                <Image
                                                  source={localimag.starrating}
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
                                                      (mobileW * 2.5) / 100,
                                                    color: Colors.white_color,
                                                    marginLeft:
                                                      (mobileW * 1.2) / 100,
                                                  }}
                                                >
                                                  {item.avg_rating}.0
                                                </Text>
                                              </View>
                                              <View
                                                style={{
                                                  marginTop:
                                                    (mobileW * 1) / 100,
                                                  width: "90%",
                                                  alignItems: "center",
                                                  justifyContent: "center",
                                                }}
                                              >
                                                <Text
                                                  style={{
                                                    color: "#000",
                                                    fontSize:
                                                      (mobileW * 3) / 100,
                                                    marginTop:
                                                      (mobileW * 1) / 100,
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
                                                    Colors.white_color,
                                                  paddingVertical:
                                                    (mobileW * 2) / 100,
                                                  borderTopWidth:
                                                    (mobileW * 0.3) / 100,
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
                                                    color: Colors.theme_color,
                                                    fontSize:
                                                      (mobileW * 3) / 100,
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
                                  backgroundColor: Colors.white_color,
                                  justifyContent: "space-between",
                                }}
                              >
                                <View
                                  style={{
                                    flex: 1,
                                    paddingVertical: (mobileW * 2) / 100,
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: Colors.gray4,
                                      fontSize: (mobileW * 3) / 100,
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
                                    borderRadius: (mobileW * 1) / 100,
                                    justifyContent: "center",
                                    paddingHorizontal: (mobileW * 2) / 100,
                                    paddingVertical: (mobileW * 0.5) / 100,
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: Colors.white_color,
                                      fontSize: (mobileW * 2.5) / 100,
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
        </View>

        <HideWithKeyboard>
          <Footer
            activepage="Home"
            usertype={1}
            footerpage={[
              {
                name: "Home",
                fname: Lang_chg.home_footer[config.language],
                countshow: false,
                image: localimag.Home,
                activeimage: localimag.Home,
              },
              {
                name: "Appointment",
                fname: Lang_chg.Appointment_footer[config.language],
                countshow: false,
                image: localimag.Appointment,
                activeimage: localimag.Appointment,
              },
              {
                name: "Cart",
                fname: Lang_chg.Cart_footer[config.language],
                countshow: false,
                image: localimag.Cart,
                activeimage: localimag.Cart,
              },
              {
                name: "More",
                fname: Lang_chg.More_footer[config.language],
                countshow: false,
                image: localimag.More,
                activeimage: localimag.More,
              },
            ]}
            navigation={this.props.navigation}
            imagestyle1={{
              width: 25,
              height: 25,
              paddingBottom: (mobileW * 5.4) / 100,
              backgroundColor: "white",
              countcolor: "red",
              countbackground: "red",
            }}
          />
        </HideWithKeyboard>

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
                  paddingVertical: (mobileW * 2) / 100,
                }}
              >
                <Text
                  style={{
                    paddingLeft: (mobileW * 4.5) / 100,
                    paddingRight: (mobileW * 4.5) / 100,
                    textAlign: config.textRotate,
                    fontFamily: Font.fontregular,
                    fontSize: (mobileW * 4) / 100,
                    color: Colors.textwhite,
                  }}
                >
                  {Lang_chg.selectSpecialty[config.language]}
                </Text>
              </View>

              <View style={{ width: "100%", alignSelf: "center" }}>
                <FlatList
                  contentContainerStyle={{ paddingBottom: (mobileW * 2) / 100 }}
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
                                paddingVertical: (mobileW * 2) / 100,
                                marginLeft: (mobileW * 5) / 100,
                              },
                              item.line == 0
                                ? { borderBottomColor: "#0000001F" }
                                : { borderBottomColor: "#fff" },
                            ]}
                          >
                            <Text
                              style={{
                                color: Colors.textblack,
                                fontSize: (mobileW * 4) / 100,
                                paddingLeft: (mobileW * 2) / 100,
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
