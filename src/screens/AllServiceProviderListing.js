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
  Platform,
} from "react-native";
import {
  Colors,
  Font,
  config,
  windowWidth,
  localStorage,
  consolepro,
  Lang_chg,
  apifuntion,
} from "../Provider/utilslib/Utils";

import Styles from "../Styles";
import ScreenHeader from "../components/ScreenHeader";
import { Clock, dummyUser, leftArrow, Location, Notification, Star } from "../icons/SvgIcons/Index";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import ServiceProviderContainer from "../components/ServiceProviderContainer";

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
      providersList: [1, 2, 3, 4, 5, 6, 7],
      availability: [],
      isLoading: true
    };
    screens = "Login";
  }
  componentDidMount() {
    this.props.navigation.addListener("focus", () => {
      this.get_Services();
      // this.get_all_notification();
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
      (this.state.pass_status === "hospital" ? "api-patient-hospital-list" : "api-patient-service-provider-list");

    var data = new FormData();
    data.append("login_user_id", user_id);
    data.append("service_type", this.state.pass_status);
    data.append("work_area", user_details["work_area"]);
    data.append("page_count", 1);

    // --------When Search anything--------
    if (this.state.pass_status !== "hospital")
      data.append("provider_name", this.state.provider_name);
    // -------------------------------------

    if (this.state.pass_status === "doctor") data.append("docEnableFor", this.state.enableFor);

    // if (this.state.pass_status === "hospital") {
    //   data.append("hospital_name", this.state.provider_name);
    // }

    // consolepro.consolelog("get_Services-query-data......", data);
    // return false;
    apifuntion.postApi(url, data, 1).then((res) => {
      consolepro.consolelog("get_Services-response ", JSON.stringify(res));

      if (res.status == true) {
        this.setState({
          providersList: res.result,
          message: res.message,
        });

        if (this.state.providersList.length > 0) {
          this.setState({
            isLoading: false
          })
        } else {
          setTimeout(() => {
            this.setState({ isLoading: false })
          }, 2000);
        }
        //   if (this.state.pass_status !== "hospital") {
        //     let hour_task = obj.result;
        //     if (obj.result != null && obj.result != "") {
        //       for (let k = 0; k < obj.result.length; k++) {
        //         let availability = hour_task[k].availability;
        //         for (let l = 0; l < availability.length; l++) {
        //           hour_task[k].availability[l] = availability[l].slot_day;
        //         }
        //         hour_task[k].new_availablity = hour_task[k].availability.toString();
        //       }
        //     }
        //     console.log("hour_task", hour_task);
        //     this.setState({ nurse_data: hour_task });
        //   }
        // } else {
        //   this.setState({ nurse_data: obj.result, message: obj.message });
        //   return false;
      }
    })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
      });
  };

  render() {

    const { isLoading, providersList, pass_status } = this.state
    return (
      <View style={{ backgroundColor: Colors.backgroundcolor, flex: 1 }}>

        <ScreenHeader
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
                        : Lang_chg.Lab[config.language]
          }
          navigation={this.props.navigation}
          onBackPress={() => this.props.navigation.pop()}
          leftIcon={leftArrow}
          rightIcon={Notification}
        />

        {/* <ScrollView> */}
        <FlatList
          contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? vs(80) : vs(70) }}
          showsVerticalScrollIndicator={false}
          data={providersList}
          keyExtractor={(item, index) => `Provider ${index}`}
          renderItem={({ item, index }) => {
            return (
              <ServiceProviderContainer
                Item={item}
                navigation={this.props.navigation}
                isLoading={isLoading}
                providerType={pass_status} />
            );
          }
          }
        />
        {/* </ScrollView> */}


        {/* <View
            style={{
              backgroundColor: "#fff",
              paddingVertical: (windowWidth * 2) / 100,
              borderBottomWidth: 1,
              borderBottomColor: Colors.LIGHT_CLIENT_BORDER,
            }}
          >
            <View
              style={{
                padding: (windowWidth * 2.5) / 100,
                flexDirection: "row",
                width: "99%",
                alignSelf: "center",
                paddingTop: (windowWidth * 3) / 100,
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
                      width: (windowWidth * 9) / 100,
                      alignSelf: "center",
                      height: (windowWidth * 9) / 100,
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
                    fontSize: (windowWidth * 4) / 100,
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
                      width: (windowWidth * 6) / 100,
                      height: (windowWidth * 6) / 100,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View> */}





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
                    color: Colors.White,
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
                                color: Colors.Black,
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
      </View >
    );
  }
}
