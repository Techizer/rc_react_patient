import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";

import {
  Colors,
  Font,
  mobileH,
  msgProvider,
  msgText,
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
import moment from "moment-timezone";

const tabheadings = [
  {
    id: 1,
    name: "All",
    arbic_name: "الجميع ",
    pass_status: "all",
    status: true,
  },
  {
    id: 2,
    name: "Nurse",
    arbic_name: "ممرضة  ",
    pass_status: "nurse",
    status: false,
  },
  {
    id: 3,
    name: "Nurse Assistant",
    arbic_name: "مساعد ممرض   ",
    pass_status: "caregiver",
    status: false,
  },
  {
    id: 4,
    name: "Babysitter",
    arbic_name: "جليسه اطفال  ",
    pass_status: "babysitter",
    status: false,
  },
  {
    id: 5,
    name: "Physiotherapist",
    arbic_name: "اخصائي العلاج الطبيعي   ",
    pass_status: "physiotherapy",
    status: false,
  },
  {
    id: 6,
    name: "Doctor",
    arbic_name: "طبيب",
    pass_status: "doctor",
    status: false,
  },
  {
    id: 7,
    name: "Lab",
    arbic_name: "مختبر",
    pass_status: "lab",
    status: false,
  },
];

export default class ShowOtherAppointments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: Lang_chg.MyAppointments[config.language],
      modalVisible: false,
      All: true,
      appoinment_detetails: "",
      Nurse: false,
      Babysitter: false,
      Listenquiries: false,
      Physiotherapist: false,
      service_status: "",
      manageTab: "All",
      pass_status: "all",
      time_take_data: "",
      rescdule_data: "",
      date_array: "",
      send_id: "",
      message: "",
      api_status: 3,
      tabheadings: tabheadings,
      task_details: "",
      notification_count: "",
    };
  }
  componentDidMount() {
    if (this.props.route.params != undefined) {
      let title = this.props.route.params.title;
      let api_status = this.props.route.params.api_status;
      this.setState({ title: title, api_status: api_status });
      console.log(title);
    }
    this.get_Services(0);
    this.get_all_notification();
    this.get_day();
  }
  check_date = (item, index) => {
    let data = this.state.date_array;
    console.log("new data", data);

    for (let i = 0; i < data.length; i++) {
      if (i == index) {
        data[i].tick = 1;
      } else {
        data[i].tick = 0;
      }
    }
    // }
    this.setState({ date_array: data });
  };
  get_day = () => {
    var today = new Date();
    var nextweek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 28
    );
    let datenew_show = today.getDate();
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let month_show = today.getMonth() + 1;
    let year_show = today.getFullYear();
    let show_month1 = "";
    let show_get_date = "";
    if (month_show <= 9) {
      show_month1 = "0" + month_show;
    } else {
      show_month1 = month_show;
    }
    if (datenew_show <= 9) {
      show_get_date = "0" + datenew_show;
    } else {
      show_get_date = datenew_show;
    }
    let date1_show = year_show + "-" + show_month1 + "-" + show_get_date;
    this.setState({ set_date: date1_show, check_currentdate: date1_show });

    for (
      var arr = [], dt = new Date(today);
      dt <= new Date(nextweek);
      dt.setDate(dt.getDate() + 1)
    ) {
      let date_final = new Date(dt);
      let month = date_final.getMonth() + 1;
      let year = date_final.getFullYear();
      var dayName = days[date_final.getDay()];
      let final_date = date_final.getDate();
      let datenew = "";
      let show_month = "";
      if (final_date <= 9) {
        datenew = "0" + final_date;
      } else {
        datenew = final_date;
      }
      if (month <= 9) {
        show_month = "0" + month;
      } else {
        show_month = month;
      }
      let date1 = year + "-" + show_month + "-" + datenew;
      let tick = 0;
      if (date1 == date1_show) {
        tick = 1;
      }

      arr.push({ date1: date1, datenew: datenew, day: dayName, tick: tick });
    }
    this.setState({ date_array: arr });
    console.log("check date muskan", arr);
  };

  get_Services = async (page) => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];
    let apishow = "api-patient-upcoming-appointment";
    if (this.state.api_status == 0) {
      apishow = "api-patient-upcoming-appointment";
    } else if (this.state.api_status == 1) {
      apishow = "api-patient-today-appointment";
    } else if (this.state.api_status == 2) {
      apishow = "api-patient-past-appointment";
    } else {
      apishow = "api-patient-upcoming-appointment";
    }
    let url = config.baseURL + apishow;
    console.log("url", url);

    var data = new FormData();
    data.append("lgoin_user_id", user_id);

    data.append("service_type", this.state.pass_status);

    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data, page)
      .then((obj) => {
        consolepro.consolelog("obj", obj);

        if (obj.status == true) {
          this.setState({
            appoinment_detetails: obj.result,
            message: obj.message,
          });
          console.log("obj.result", obj.result);
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

  submit_btn = async () => {
    if (this.state.time_take_data.length <= 0) {
      msgProvider.showError(msgText.EmptyTime[config.language]);
      return false;
    }

    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];

    let url = config.baseURL + "api-patient-update-reschedule-appointment";
    console.log("url", url);
    var data = new FormData();
    console.log("data", data);

    data.append("service_type", this.state.service_status);
    data.append("order_id", this.state.order_id);
    data.append("from_date", this.state.set_date);
    data.append("from_time", this.state.time_take_data);

    apifuntion
      .postApi(url, data)
      .then((obj) => {
        if (obj.status == true) {
          this.setState({ modalVisible: false });
          setTimeout(() => {
            this.get_Services(1);
            msgProvider.showSuccess(obj.message);
          }, 700);
        } else {
          setTimeout(() => {
            msgProvider.showError(obj.message);
            //  msgProvider.alert('',obj.message, false);
          }, 700);

          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
        this.setState({ loading: false });
      });
  };

  rescdule_click = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];
    let url = config.baseURL + "api-patient-reschedule-appointment";
    console.log("url", url);

    var data = new FormData();
    data.append("order_id", this.state.order_id);

    data.append("service_type", this.state.service_status);

    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        consolepro.consolelog("obj", obj);

        if (obj.status == true) {
          if (obj.result.task_time != "") {
            var names = obj.result.task_time;
            var nameArr = names.split(",");

            const new_time_dlot = [];
            const Arr1 = [];
            const Arr2 = [];
            if (obj.result.task_time != "") {
              for (let l = 0; l < nameArr.length; l++) {
                new_time_dlot.push({ time: nameArr[l], time_status: false });
                if ((l + 2) % 2 == 0) {
                  Arr1.push({ time: nameArr[l], time_status: false });
                } else {
                  Arr2.push({ time: nameArr[l], time_status: false });
                }
              }
            }
            this.setState({
              time_Arr: new_time_dlot,
              final_one: Arr1,
              final_arr_two: Arr2,
            });
          }

          this.setState({
            rescdule_data: obj.result,
            message: obj.message,
            set_date: obj.result.app_date,
            check_booking: obj.result.slot_booking_id,
          });

          this.setState({ modalVisible: true });

          console.log("obj.result", obj.result);
        } else {
          this.setState({
            rescdule_data: obj.result,
            message: obj.message,
            task_details: obj.result.task_details,
          });
          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
      });
  };
  get_all_notification = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    console.log("user_details user_details", user_details);
    let user_id = user_details["user_id"];

    let url = config.baseURL + "api-notification-count";
    console.log("url", url);
    var data = new FormData();
    data.append("login_user_id", user_id);

    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        consolepro.consolelog("obj", obj);
        if (obj.status == true) {
          this.setState({ notification_count: obj.result });
          console.log("obj nationaltity", obj);
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log("-------- error ------- " + error);
      });
  };
  get_time_date = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];

    let url = config.baseURL + "api-patient-next-date-time";
    console.log("url", url);

    var data = new FormData();
    data.append("provider_id", this.state.send_id);
    data.append("date", this.state.set_date);
    data.append(" task_type", this.state.set_task);
    data.append("service_type", this.state.service_status);
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        if (obj.status == true) {
          var cureent = new Date();
          var timcurrent = cureent.getHours() + ":" + cureent.getMinutes();
          this.setState({ timcurrent_for_check: timcurrent });
          consolepro.consolelog("obj.result", obj.result);
          if (this.state.check_booking == "TASK_BOOKING") {
            if (obj.result.task_time != "") {
              var names = obj.result.task_time;
              var nameArr = names.split(",");

              const new_time_dlot = [];
              const Arr1 = [];
              const Arr2 = [];
              if (obj.result.task_time != "") {
                for (let l = 0; l < nameArr.length; l++) {
                  if (this.state.check_currentdate == this.state.set_date) {
                    const timeStr = nameArr[l];

                    const convertTime = (timeStr) => {
                      const [time, modifier] = timeStr.split(" ");
                      let [hours, minutes] = time.split(":");
                      if (hours === "12") {
                        hours = "00";
                      }
                      if (modifier === "PM") {
                        hours = parseInt(hours, 10) + 12;
                      }
                      return `${hours}:${minutes}`;
                    };
                    var finaltime = convertTime(timeStr);
                    if (finaltime >= this.state.timcurrent_for_check) {
                      new_time_dlot.push({
                        time: nameArr[l],
                        time_status: false,
                      });
                      if ((l + 2) % 2 == 0) {
                        Arr1.push({ time: nameArr[l], time_status: false });
                      } else {
                        Arr2.push({ time: nameArr[l], time_status: false });
                      }
                    }
                  } else {
                    new_time_dlot.push({
                      time: nameArr[l],
                      time_status: false,
                    });
                    if ((l + 2) % 2 == 0) {
                      Arr1.push({ time: nameArr[l], time_status: false });
                    } else {
                      Arr2.push({ time: nameArr[l], time_status: false });
                    }
                  }
                }
              }

              this.setState({
                time_Arr: new_time_dlot,
                final_one: Arr1,
                final_arr_two: Arr2,
              });
            } else {
              this.setState({ time_Arr: obj.result.task_time });
            }
          } else {
            if (obj.result.hourly_time != "") {
              var names_time = obj.result.hourly_time;
              var nameArr_time = names_time.split(",");
            }

            const new_time_hourl = [];
            const Arr_hour = [];
            const Arr2_hour = [];
            if (obj.result.hourly_time != "") {
              for (let m = 0; m < nameArr_time.length; m++) {
                const timeStr_hour = nameArr_time[m];
                if (this.state.check_currentdate == this.state.set_date) {
                  const convertTime_hour = (timeStr_hour) => {
                    const [time, modifier] = timeStr_hour.split(" ");
                    let [hours, minutes] = time.split(":");
                    if (hours === "12") {
                      hours = "00";
                    }
                    if (modifier === "PM") {
                      hours = parseInt(hours, 10) + 12;
                    }
                    return `${hours}:${minutes}`;
                  };
                  var finaltime_hour = convertTime_hour(timeStr_hour);
                  if (finaltime_hour >= timcurrent) {
                    new_time_hourl.push({
                      time: nameArr_time[m],
                      time_status: false,
                    });

                    if ((m + 2) % 2 == 0) {
                      Arr_hour.push({
                        time: nameArr_time[m],
                        time_status: false,
                      });
                    } else {
                      Arr2_hour.push({
                        time: nameArr_time[m],
                        time_status: false,
                      });
                    }
                  }
                } else {
                  new_time_hourl.push({
                    time: nameArr_time[m],
                    time_status: false,
                  });
                  if ((m + 2) % 2 == 0) {
                    Arr_hour.push({
                      time: nameArr_time[m],
                      time_status: false,
                    });
                  } else {
                    Arr2_hour.push({
                      time: nameArr_time[m],
                      time_status: false,
                    });
                  }
                }
              }
              this.setState({
                time_Arr: new_time_hourl,
                final_arr_two: Arr2_hour,
                final_one: Arr_hour,
              });
            } else {
              this.setState({
                time_Arr: obj.result.hourly_time,
                final_arr_two: Arr2_hour,
                final_one: Arr_hour,
              });
            }
          }
        } else {
          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
      });
  };
  time_tick = (item, index) => {
    let data = this.state.time_Arr;
    console.log("new data", data);
    // if(data[index].time_status==true)
    // {
    //     data[index].time_status=false
    // }
    // else
    // {
    for (let i = 0; i < data.length; i++) {
      if (i == index) {
        data[i].time_status = true;
      } else {
        data[i].time_status = false;
      }
      // }
    }
    this.setState({ time_Arr: data });
  };
  render() {
    const { modalVisible } = this.state;
    var rescdule = this.state.rescdule_data;

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingBottom: (mobileW * 10) / 100 }}>
          <View style={{ flex: 1, marginBottom: (mobileW * 10) / 100 }}>
            {/* <Text>Home</Text> */}

            {/* header */}
            <View style={{ backgroundColor: "white" }}>
              <View
                style={{
                  flexDirection: "row",
                  width: "98%",
                  alignSelf: "center",
                  paddingVertical: (mobileW * 3) / 100,
                  backgroundColor: Colors.white_color,
                  alignItems: "center",
                  // backgroundColor: 'red',
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
                      this.props.navigation.goBack();
                    }}
                  >
                    {config.language == 0 ? (
                      <Image
                        source={localimag.leftarrow}
                        style={{
                          resizeMode: "contain",
                          width: (mobileW * 9) / 100,
                          alignSelf: "center",
                          height: (mobileW * 9) / 100,
                        }}
                      ></Image>
                    ) : (
                      <Image
                        source={localimag.arabic_back}
                        style={{
                          resizeMode: "contain",
                          width: (mobileW * 9) / 100,
                          alignSelf: "center",
                          height: (mobileW * 9) / 100,
                        }}
                      ></Image>
                    )}
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    // backgroundColor: 'yellow',
                    width: "80%",
                  }}
                >
                  <Text style={Styles.headertext}>
                    {this.state.title == "undefined"
                      ? Lang_chg.MyAppointments[config.language]
                      : this.state.title}

                    {/* {Lang_chg.MyAppointments[config.language]} */}
                  </Text>
                </View>
                <View
                  style={{
                    width: "10%",
                    alignSelf: "center",
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
                    ></Image>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* tabheadings */}
            <View
              style={{
                backgroundColor: Colors.theme_color,
                paddingTop: (mobileW * 1.5) / 100,
              }}
            >
              <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={this.state.tabheadings}
                renderItem={({ item, index }) => {
                  return (
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            manageTab: item.name,
                            pass_status: item.pass_status,
                            appoinment_detetails: "",
                          }),
                            this.get_Services(0);
                        }}
                        style={
                          item.name == this.state.manageTab
                            ? {
                                borderColor: "#1b56ee",
                                justifyContent: "center",
                                height: (mobileH * 4.3) / 100,
                                marginHorizontal: (mobileW * 4) / 100,
                              }
                            : {
                                height: (mobileH * 4.3) / 100,
                                justifyContent: "center",
                                marginHorizontal: (mobileW * 4.3) / 100,
                              }
                        }
                      >
                        {config.language == 0 ? (
                          <Text
                            style={[
                              {
                                fontSize: (mobileW * 3.8) / 100,
                                textAlign: "center",
                                fontFamily: Font.fontsemibold,
                              },
                              item.name == this.state.manageTab
                                ? { color: "#fff" }
                                : { color: Colors.drawertextblue },
                            ]}
                          >
                            {item.name}
                          </Text>
                        ) : (
                          <Text
                            style={[
                              {
                                fontSize: (mobileW * 3.8) / 100,
                                textAlign: "center",
                                fontFamily: Font.fontsemibold,
                              },
                              item.name == this.state.manageTab
                                ? { color: "#fff" }
                                : { color: Colors.drawertextblue },
                            ]}
                          >
                            {item.arbic_name}
                          </Text>
                        )}
                      </TouchableOpacity>
                      {item.name == this.state.manageTab && (
                        <View
                          style={{
                            width: "70%",
                            borderWidth: 2.2,
                            borderColor: "#fff",
                            borderTopLeftRadius: (mobileW * 2.2) / 100,
                            borderTopRightRadius: (mobileW * 2.2) / 100,
                            backgroundColor: "#fff",
                            alignSelf: "center",
                          }}
                        ></View>
                      )}
                    </View>
                  );
                }}
              />
            </View>
            {this.state.appoinment_detetails == "" ||
              (this.state.appoinment_detetails == null && (
                <Text
                  style={{
                    textAlign: "center",
                    color: Colors.theme_color,
                    fontFamily: Font.fontmedium,
                    fontSize: (mobileW * 3.5) / 100,
                    marginTop: (mobileW * 60) / 100,
                  }}
                >
                  {this.state.message}
                </Text>
              ))}

            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: (mobileW * 5) / 100 }}
              data={this.state.appoinment_detetails}
              renderItem={({ item, index }) => {
                if (
                  this.state.appoinment_detetails != "" &&
                  this.state.appoinment_detetails != null
                ) {
                  if (item.provider_type === "doctor") {
                    /* check video call button enable or not */
                    var videoCallButton = false;
                    var currentDate = moment().unix();
                    var appointmentDate = moment(item.app_date).format(
                      "YYYY-MM-DD"
                    );
                    var appointmentTime = item.app_time;
                    var isSameDay = moment().isSame(appointmentDate, "day");
                    // console.log("isSameDay => ", isSameDay);
                    var myDate = moment(
                      appointmentDate + " " + appointmentTime,
                      "YYYY-MM-DD hh:mm A"
                    ).unix();
                    if (isSameDay) {
                      if (currentDate < myDate) {
                        let diff = (myDate - currentDate) / 60; //mins
                        // console.log("CurrentDate < MyDate:: ", diff);
                        if (diff <= 10) {
                          videoCallButton = true;
                        }
                      } else {
                        videoCallButton = true;
                      }
                    } else {
                      videoCallButton = false;
                    }
                    /* check video call button enable or not */

                    // var videoCallButton = false;

                    // var currentDate = moment().unix();
                    // var myDate = moment(
                    //   item.appoitment_date + " " + item.app_time,
                    //   "YYYY-MM-DD hh:mm A"
                    // ).unix();
                    // // var date = moment(item.app_time, "h:mm:ss A")
                    // //   .add(item.slot_time.split(" ")[0], "minutes")
                    // //   .format("LTS");
                    // // console.log("date:: ", date);
                    // var endDate = moment(item.appoitment_date)
                    //   .add(1, "days")
                    //   .format("YYYY-MM-DD");
                    // //returns the tomorrow date
                    // // console.log("endDate => ", endDate);
                    // var myEndDate = moment(
                    //   endDate,
                    //   "YYYY-MM-DD hh:mm A"
                    // ).unix();
                    // // var myEndDate = moment(
                    // //   item.appoitment_date + " " + date,
                    // //   "YYYY-MM-DD hh:mm A"
                    // // ).unix();
                    // // console.log(
                    // //   "CurrentDate:: ",
                    // //   currentDate,
                    // //   "MyDate:: ",
                    // //   myDate,
                    // //   "-- ",
                    // //   currentDate - myDate
                    // // );

                    // if (currentDate < myDate) {
                    //   let diff = (myDate - currentDate) / 60; //mins
                    //   // console.log("CurrentDate < MyDate:: ", diff);
                    //   if (diff <= 10) {
                    //     videoCallButton = true;
                    //   }
                    //   // } else if (currentDate > myDate) {
                    //   //   let diff = (currentDate - myDate) / 60; //mins
                    //   //   console.log("CurrentDate > MyDate:: ", diff);
                    //   //   if (diff < 16) {
                    //   //     videoCallButton = true;
                    //   //   }
                    // }
                    // if (currentDate > myEndDate) {
                    //   // console.log("CurrentDate > myEndDate:: ");
                    //   videoCallButton = false;
                    // } else if (currentDate < myEndDate) {
                    //   videoCallButton = true;
                    // }
                    // /* check video call button enable or not */
                  }
                  return (
                    <View
                      style={{
                        marginTop: (mobileW * 2) / 100,
                        backgroundColor: "#fff",
                        shadowOpacity: 0.3,
                        shadowColor: "#000",
                        shadowOffset: { width: 1, height: 1 },
                        elevation: 5,
                        shadowRadius: 2,
                      }}
                    >
                      <View
                        style={{
                          width: "98%",
                          alignSelf: "center",
                          marginTop:
                            item.provider_type == "doctor" &&
                            item.hospital_id !== ""
                              ? 20
                              : 0,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            width: "100%",
                            alignSelf: "center",
                            padding: (mobileW * 2) / 100,
                            // justifyContent: 'space-between',
                          }}
                        >
                          {/* image and store name */}

                          <View style={{ width: "42%" }}>
                            <Text
                              style={{
                                fontFamily: Font.fontmedium,
                                fontSize: Font.sregulartext_size,
                                color: Colors.theme_color,
                                textAlign: config.textRotate,
                                textTransform: "uppercase",
                              }}
                            >
                              {item.dispaly_provider_type}
                            </Text>
                            <Text
                              style={{
                                paddingTop: (mobileW * 2) / 100,
                                fontFamily: Font.fontmedium,
                                fontSize: Font.sregulartext_size,
                                color: Colors.darkgraytextheading,
                                textAlign: config.textRotate,
                              }}
                            >
                              {item.provider_name}
                            </Text>
                            <Text
                              style={{
                                paddingTop: (mobileW * 1) / 100,
                                fontFamily: Font.fontregular,
                                fontSize: Font.sregulartext_size,
                                color: Colors.darkgraytextheading,
                                textAlign: config.textRotate,
                              }}
                            >
                              {item.speciality}
                            </Text>
                            <View
                              style={{
                                marginTop: (mobileW * 2) / 100,
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: Font.fontmedium,
                                  fontSize: Font.sregulartext_size,
                                  color: Colors.theme_color,
                                  textAlign: config.textRotate,
                                }}
                              >
                                {Lang_chg.Patient[config.language]}
                              </Text>
                              <Image
                                source={localimag.dots}
                                style={{
                                  width: 25,
                                  height: 13,
                                  resizeMode: "contain",
                                  marginLeft: (mobileW * 1.5) / 100,
                                }}
                              />
                            </View>
                            <Text
                              style={{
                                fontFamily: Font.fontmedium,
                                fontSize: Font.sregulartext_size,
                                marginTop: (mobileW * 1) / 100,
                                color: Colors.darkgraytextheading,
                                textAlign: config.textRotate,
                              }}
                            >
                              {item.patient_name}
                            </Text>
                            <View
                              style={{
                                marginTop: (mobileW * 2.8) / 100,
                                flexDirection: "row",
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: Font.fontregular,
                                  fontSize: Font.sregulartext_size,
                                  color: Colors.darkgraytextheading,
                                  textAlign: config.textRotate,
                                }}
                              >
                                {Lang_chg.Booked[config.language]}
                              </Text>
                              <Text
                                style={{
                                  fontFamily: Font.fontmedium,
                                  fontSize: Font.sregulartext_size,
                                  color: Colors.darkgraytextheading,
                                  textAlign: config.textRotate,
                                  textTransform: "uppercase",
                                  marginLeft: (mobileW * 1.5) / 100,
                                }}
                              >
                                {item.booking_date}
                              </Text>
                            </View>
                          </View>

                          <View
                            style={{
                              width: "36%",
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: Font.fontmedium,
                                fontSize: Font.regulartext_size,
                                color: Colors.theme_color,
                                textAlign: config.textRotate,
                              }}
                            >
                              {item.order_id}
                            </Text>
                            <Text
                              style={{
                                paddingTop: (mobileW * 1) / 100,
                                fontFamily: Font.fontmedium,
                                fontSize: Font.sregulartext_size,
                                color: Colors.darkgraytextheading,
                                textAlign: config.textRotate,
                              }}
                            >
                              {Lang_chg.Appointment_footer[config.language]}
                            </Text>
                            <Text
                              style={{
                                paddingTop: (mobileW * 1) / 100,
                                fontFamily: Font.fontmedium,
                                color: Colors.theme_color,
                                fontSize: Font.sregulartext_size,
                                textAlign: config.textRotate,
                              }}
                            >
                              {Lang_chg.Date[config.language]}
                            </Text>
                            <Text
                              style={{
                                paddingTop: (mobileW * 1) / 100,
                                fontFamily: Font.fontmedium,
                                fontSize: Font.sregulartext_size,
                                color: Colors.darkgraytextheading,
                                textAlign: config.textRotate,
                                textTransform: "uppercase",
                              }}
                            >
                              {item.app_date}
                            </Text>

                            <View
                              style={{
                                flexDirection: "row",
                                marginTop: (mobileW * 2) / 100,
                                paddingVertical: (mobileW * 0.5) / 100,
                                paddingHorizontal: (mobileW * 1) / 100,
                                borderWidth: 1,
                                borderRadius: (mobileW * 1) / 100,
                                borderColor: Colors.theme_color,
                                alignSelf: "flex-start",
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: Font.fontmedium,
                                  fontSize: Font.sregulartext_size,
                                  color: Colors.theme_color,
                                }}
                              >
                                {item.appointment_type}
                              </Text>
                            </View>
                          </View>

                          <View
                            style={{
                              width: "22%",
                            }}
                          >
                            <View
                              style={{
                                borderRadius: (mobileW * 0.5) / 100,
                                width: "100%",
                                alignItems: "center",
                                paddingVertical: (mobileW * 1) / 100,
                                backgroundColor:
                                  item.acceptance_status == "Rejected"
                                    ? "#FF4500"
                                    : item.acceptance_status == "Pending"
                                    ? Colors.gold
                                    : Colors.buttoncolorhgreen,
                              }}
                            >
                              <Text
                                style={{
                                  color: "#FCFFFE",
                                  fontFamily: Font.fontmedium,
                                  fontSize: (mobileW * 2.7) / 100,
                                  textAlign: "center",
                                  textTransform: "uppercase",
                                }}
                              >
                                {item.acceptance_status}
                              </Text>
                            </View>
                            <Text
                              style={{
                                marginTop: (mobileW * 6.5) / 100,
                                fontFamily: Font.fontmedium,
                                color: Colors.theme_color,
                                fontSize: Font.sregulartext_size,
                                textAlign: config.textRotate,
                              }}
                            >
                              {Lang_chg.Time[config.language]}
                            </Text>
                            <Text
                              style={{
                                paddingTop: (mobileW * 1) / 100,
                                fontFamily: Font.fontmedium,
                                fontSize: Font.sregulartext_size,
                                color: Colors.darkgraytextheading,
                                textAlign: config.textRotate,
                              }}
                            >
                              {item.app_time}
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
                                    tintColor: Colors.theme_color,
                                    resizeMode: "contain",
                                    width: (mobileW * 3.5) / 100,
                                    height: (mobileW * 3.5) / 100,
                                  }}
                                />
                              ) : (
                                <Image
                                  source={localimag.clock_arabic}
                                  style={{
                                    tintColor: Colors.theme_color,
                                    resizeMode: "contain",
                                    width: (mobileW * 3.5) / 100,
                                    height: (mobileW * 3.5) / 100,
                                  }}
                                ></Image>
                              )}

                              <Text
                                style={{
                                  color: Colors.theme_color,
                                  fontFamily: Font.fontregular,
                                  fontSize: (mobileW * 3) / 100,
                                  marginLeft: (mobileW * 1) / 100,
                                  textAlign: config.textRotate,
                                }}
                              >
                                {item.slot_time}
                              </Text>
                            </View>
                          </View>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",

                            paddingVertical: (mobileW * 2) / 100,
                            borderTopWidth: (mobileW * 0.3) / 100,
                            borderColor: Colors.bordercolor,
                            width: "95%",
                            alignItems: "center",
                            alignSelf: "center",
                          }}
                        >
                          <View
                            style={{
                              alignItems: "center",
                              flexDirection: "row",

                              width: "35%",

                              paddingVertical: (mobileW * 1.5) / 100,
                            }}
                          >
                            {config.language == 0 ? (
                              <Image
                                source={localimag.purse}
                                style={{
                                  resizeMode: "contain",
                                  width: 15,
                                  height: 15,
                                }}
                              ></Image>
                            ) : (
                              <Image
                                source={localimag.purse_arbic}
                                style={{
                                  resizeMode: "contain",
                                  width: 15,
                                  height: 15,
                                }}
                              ></Image>
                            )}
                            <Text
                              style={{
                                color: Colors.theme_color,
                                fontSize: (mobileW * 3.7) / 100,
                                fontFamily: Font.fontmedium,
                                alignSelf: "center",
                                marginLeft: (mobileW * 1) / 100,
                                marginTop: 0.5,
                              }}
                            >
                              {item.price}
                            </Text>
                          </View>
                          <View
                            style={{
                              alignItems: "flex-end",
                              flexDirection: "row",
                              width: "65%",
                              justifyContent: "flex-end",
                              paddingVertical: (mobileW * 1.5) / 100,
                            }}
                          >
                            {item.acceptance_status == "Accepted" &&
                              item.provider_type == "doctor" &&
                              item.appointment_type == "Online consultation" &&
                              videoCallButton === true && (
                                <TouchableOpacity
                                  onPress={() => {
                                    this.setState(
                                      {
                                        id: item.id,
                                        index: index,
                                      },
                                      () => {
                                        this.props.navigation.navigate(
                                          "VideoCall",
                                          { item: item }
                                        );
                                      }
                                    );
                                  }}
                                  style={{
                                    backgroundColor: Colors.buttoncolorhgreen,
                                    width: "35%",
                                    borderRadius: (mobileW * 1) / 100,
                                    justifyContent: "center",
                                    paddingVertical: (mobileW * 2) / 100,
                                    marginRight: 10,
                                  }}
                                >
                                  <Text
                                    style={{
                                      textAlign: "center",
                                      color: Colors.white_color,
                                      textTransform: "uppercase",
                                      fontFamily: Font.fontmedium,
                                      fontSize: (mobileW * 3) / 100,
                                    }}
                                  >
                                    VIDEO CALL
                                  </Text>
                                </TouchableOpacity>
                              )}
                            {item.acceptance_status == "Pending" ? (
                              <TouchableOpacity
                                onPress={() => {
                                  this.rescdule_click(),
                                    this.get_day(),
                                    this.setState({
                                      order_id: item.id,
                                      service_status: item.provider_type,
                                      send_id: item.provider_id,
                                      time_take_data: "",
                                    });
                                }}
                                style={{
                                  backgroundColor: Colors.buttoncolorhgreen,
                                  width: "48%",
                                  borderRadius: (mobileW * 1) / 100,
                                  justifyContent: "center",
                                  paddingVertical: (mobileW * 2) / 100,
                                  marginRight: 10,
                                }}
                              >
                                <Text
                                  style={{
                                    textAlign: "center",
                                    color: Colors.white_color,
                                    textTransform: "uppercase",
                                    fontFamily: Font.fontmedium,
                                    fontSize: (mobileW * 3) / 100,
                                  }}
                                >
                                  {Lang_chg.Reschedule[config.language]}
                                </Text>
                              </TouchableOpacity>
                            ) : item.acceptance_status == "Accepted" &&
                              item.provider_type == "doctor" &&
                              item.appointment_type ==
                                "Online consultation" ? null : (
                              <View style={{ width: "48%" }} />
                            )}

                            <TouchableOpacity
                              onPress={() => {
                                this.props.navigation.navigate(
                                  "AppointmentDetails",
                                  {
                                    status: item.provider_type,
                                    appoinment_id: item.id,
                                    send_id: item.provider_id,
                                  }
                                );
                              }}
                              style={{
                                backgroundColor: Colors.lbluebtn,
                                width: "48%",
                                borderRadius: (mobileW * 1) / 100,
                                justifyContent: "center",
                                paddingVertical: (mobileW * 2) / 100,
                              }}
                            >
                              <Text
                                style={{
                                  alignSelf: "center",
                                  textAlign: "center",
                                  color: Colors.white_color,
                                  //  paddingHorizontal: (mobileW * 2) / 100,
                                  fontFamily: Font.fontmedium,
                                  fontSize: (mobileW * 3) / 100,
                                }}
                              >
                                {Lang_chg.VIEWDETAILS[config.language]}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                      {item.provider_type == "doctor" &&
                        item.hospital_id !== "" && (
                          <View
                            style={{
                              backgroundColor: "#FFA800",
                              position: "absolute",
                              right: 0,
                              top: 0,
                              // borderTopLeftRadius : (mobileW * 2) / 100,
                              borderBottomLeftRadius: (mobileW * 2) / 100,
                              paddingVertical: 3,
                              paddingHorizontal: 10,
                              marginBottom: 10,
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
                  );
                }
              }}
            />
          </View>
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

        {/* code for modal */}
        <Modal
          backdropOpacity={3}
          //  style={{backgroundColor: Colors.dim_grey}}
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          presentationStyle="overFullScreen"
          onRequestClose={() => {
            this.setState({ modalVisible: false });
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#00000090",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 0,
            }}
          >
            <View
              style={{
                width: "100%",
                backgroundColor: Colors.white_color,
                // marginTop: (mobileW * 50) / 100,
                position: "absolute",
                bottom: 0,
                borderTopLeftRadius: (mobileW * 10) / 100,
                borderTopRightRadius: (mobileW * 10) / 100,
                borderWidth: (mobileW * 0.3) / 100,
                borderColor: Colors.gainsboro,
                elevation: 5,
                height: (mobileH * 80) / 100,
              }}
            >
              {/* task booking section */}
              <ScrollView
                style={{
                  marginTop: (mobileW * 2) / 100,
                  borderTopRightRadius: (mobileW * 5) / 100,
                  borderTopLeftRadius: (mobileW * 5) / 100,
                }}
                showsVerticalScrollIndicator={false}
              >
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: (mobileW * 90) / 100,
                      // backgroundColor:'red',
                      alignSelf: "center",
                      paddingTop: (mobileW * 4) / 100,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Font.fontmedium,
                        fontSize: (mobileW * 4) / 100,
                      }}
                    >
                      {Lang_chg.Reschedule[config.language]}
                    </Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          color: Colors.theme_color,
                          fontFamily: Font.fontmedium,
                          fontSize: Font.name,
                          paddingRight: (mobileW * 4) / 100,
                        }}
                      >
                        {rescdule.order_id}
                      </Text>

                      <TouchableOpacity
                        onPress={() => this.setState({ modalVisible: false })}
                      >
                        <Image
                          source={localimag.cross}
                          style={{
                            resizeMode: "contain",
                            // backgroundColor: Colors.white_color,
                            width: 20,
                            height: 20,

                            alignSelf: "center",
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  {/* border */}
                  <View
                    style={{
                      borderTopWidth: 1,
                      borderColor: Colors.gainsboro,
                      width: "90%",
                      alignSelf: "center",
                      marginVertical: (mobileW * 2) / 100,
                    }}
                  ></View>
                  <View
                    style={{
                      width: "90%",
                      alignSelf: "center",
                      paddingVertical: (mobileW * 4) / 100,
                    }}
                  >
                    <View style={{ paddingBottom: (mobileW * 1.5) / 100 }}>
                      <Text
                        style={{
                          fontFamily: Font.fontmedium,
                          fontSize: (mobileW * 3.5) / 100,
                          textAlign: config.textRotate,
                          color: Colors.theme_color,
                        }}
                      >
                        {rescdule.task_type}
                      </Text>
                    </View>
                    <View
                      style={[
                        {
                          paddingVertical: (mobileW * 3) / 100,
                          borderTopWidth: (mobileW * 0.3) / 100,
                          borderColor: Colors.bordercolor,
                        },
                        this.state.task_details.length >= 3
                          ? { height: (mobileW * 40) / 100 }
                          : { paddingVertical: (mobileW * 1.5) / 100 },
                      ]}
                    >
                      {rescdule.slot_booking_id == "TASK_BOOKING" ? (
                        <FlatList
                          data={rescdule.task_details}
                          scrollEnabled={true}
                          nestedScrollEnabled={true}
                          renderItem={({ item, index }) => {
                            if (
                              rescdule.task_details != "" &&
                              rescdule.task_details != null
                            ) {
                              return (
                                <View
                                  style={{
                                    alignItems: "center",
                                    width: "100%",
                                    alignSelf: "center",

                                    paddingVertical: (mobileW * 1.7) / 100,
                                    flexDirection: "row",
                                    marginTop: (mobileW * 0.3) / 100,
                                  }}
                                >
                                  <Text
                                    style={{
                                      width: "70%",
                                      textAlign: config.textRotate,
                                      alignSelf: "center",
                                      fontSize: (mobileW * 3.6) / 100,
                                      fontFamily: Font.fontregular,

                                      color: "#000",
                                    }}
                                  >
                                    {item.name}
                                  </Text>
                                  <Text
                                    style={{
                                      width: "30%",

                                      fontSize: (mobileW * 3.6) / 100,
                                      fontFamily: Font.fontregular,
                                      color: "#000",

                                      textAlign: "right",
                                    }}
                                  >
                                    {item.price}
                                  </Text>
                                </View>
                              );
                            } else {
                              return <View></View>;
                            }
                          }}
                        ></FlatList>
                      ) : (
                        <FlatList
                          showsHorizontalScrollIndicator={false}
                          horizontal={true}
                          data={rescdule.task_details}
                          renderItem={({ item, index }) => {
                            return (
                              <View
                                style={{
                                  borderRadius: (mobileW * 2) / 100,
                                  marginRight: (mobileW * 2) / 100,
                                  marginTop: (mobileW * 2) / 100,
                                  borderColor: "#0168B3",
                                  borderWidth: 2,

                                  width: (mobileW * 30) / 100,
                                  backgroundColor: "#fff",
                                }}
                              >
                                <View
                                  style={{
                                    backgroundColor: "#0168B3",

                                    borderTopLeftRadius: (mobileW * 1.2) / 100,
                                    borderTopRightRadius: (mobileW * 1.2) / 100,
                                    width: "100%",
                                  }}
                                >
                                  <Text
                                    style={{
                                      // backgroundColor:'red',
                                      // paddingHorizontal: (mobileW * 5) / 100,
                                      paddingVertical: (mobileW * 1.5) / 100,
                                      color: Colors.white_color,
                                      fontFamily: Font.fontmedium,
                                      fontSize: (mobileW * 3) / 100,
                                      textAlign: "center",
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    {item.name}
                                  </Text>
                                </View>
                                <Text
                                  style={{
                                    paddingVertical: (mobileW * 2) / 100,
                                    fontFamily: Font.fontmedium,
                                    textAlign: "center",
                                    fontSize: Font.sregulartext_size,
                                  }}
                                >
                                  {item.price}
                                </Text>
                              </View>
                            );
                          }}
                        ></FlatList>
                      )}
                    </View>

                    {/* hourlybooking */}

                    <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignSelf: "center",
                        paddingTop: (mobileW * 4) / 100,
                        // paddingBottom: (mobileW * 4) / 100,
                        // borderBottomWidth: (mobileW * 0.3) / 100,
                        borderColor: Colors.gainsboro,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: Font.fontmedium,
                          fontSize: Font.name,
                          textAlign: config.textRotate,
                        }}
                      >
                        {Lang_chg.Appointmentschedule[config.language]}
                      </Text>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Image
                          source={localimag.calendarimg}
                          style={{
                            resizeMode: "contain",
                            // backgroundColor: Colors.white_color,
                            width: 20,
                            height: 20,

                            alignSelf: "center",
                          }}
                        ></Image>

                        <Text
                          style={{
                            color: Colors.theme_color,
                            fontFamily: Font.fontmedium,
                            fontSize: Font.name,
                            marginLeft: (mobileW * 1) / 100,
                          }}
                        >
                          {this.state.set_date}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: Colors.gainsboro,
                        width: "100%",
                        marginTop: (mobileW * 2) / 100,
                      }}
                    ></View>
                    <View
                      style={{
                        width: "100%",
                        alignSelf: "center",
                        paddingTop: (mobileW * 3) / 100,
                        paddingBottom: (mobileW * 3) / 100,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: Font.fontregular,
                          fontSize: Font.subtext,
                          color: "#000",
                          textAlign: config.textRotate,
                        }}
                      >
                        {Lang_chg.SelectDate[config.language]}
                      </Text>

                      <View style={{ width: "100%" }}>
                        <FlatList
                          horizontal={true}
                          data={this.state.date_array}
                          showsHorizontalScrollIndicator={false}
                          renderItem={({ item, index }) => {
                            return (
                              <TouchableOpacity
                                onPress={() => {
                                  this.setState({
                                    set_date: item.date1,
                                    set_task: "task_base",
                                    time_take_data: "",
                                  }),
                                    this.get_time_date(),
                                    this.check_date(item, index);
                                }}
                                style={{ width: (mobileW * 15) / 100 }}
                              >
                                <Text
                                  style={{
                                    marginRight: (mobileW * 3) / 100,
                                    marginTop: (mobileW * 3) / 100,
                                    backgroundColor:
                                      item.tick == 1 ? "#0787D2" : Colors.gray6,
                                    color: item.tick == 1 ? "white" : "black",
                                    textAlign: "center",
                                    paddingVertical: (mobileW * 2) / 100,
                                    fontFamily: Font.ques_fontfamily,
                                    fontSize: Font.sregulartext_size,

                                    lineHeight: (mobileW * 5) / 100,
                                  }}
                                >
                                  {item.day}
                                  {"\n"}

                                  {item.datenew}
                                </Text>
                              </TouchableOpacity>
                            );
                          }}
                        ></FlatList>
                      </View>
                    </View>

                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: Colors.gainsboro,
                        width: "100%",
                        marginTop: (mobileW * 1.5) / 100,
                        marginBottom: (mobileW * 1.5) / 100,
                      }}
                    ></View>
                    <View
                      style={{
                        width: "100%",
                        alignSelf: "center",
                        paddingVertical: (mobileW * 3) / 100,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: Font.fontregular,
                          fontSize: Font.subtext,
                          textAlign: config.textRotate,
                        }}
                      >
                        {Lang_chg.Select_start_time[config.language]}
                      </Text>
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                      >
                        <View style={{ width: "100%" }}>
                          {this.state.time_Arr != "" ? (
                            <View style={{ width: "100%" }}>
                              <View style={{ width: "100%" }}>
                                <FlatList
                                  horizontal={true}
                                  showsHorizontalScrollIndicator={false}
                                  data={this.state.final_one}
                                  renderItem={({ item, index }) => {
                                    return (
                                      <TouchableOpacity
                                        onPress={() => {
                                          this.setState({
                                            time_take_data: item.time,
                                          });
                                        }}
                                      >
                                        <Text
                                          style={[
                                            {
                                              marginRight: (mobileW * 3) / 100,
                                              marginTop: (mobileW * 3) / 100,

                                              fontFamily: Font.ques_fontfamily,
                                              fontSize: Font.sregulartext_size,
                                              padding: (mobileW * 2) / 100,
                                              paddingHorizontal:
                                                (mobileW * 3.3) / 100,
                                            },
                                            item.time ==
                                            this.state.time_take_data
                                              ? {
                                                  backgroundColor:
                                                    Colors.theme_color,
                                                  color: "#fff",
                                                }
                                              : {
                                                  backgroundColor: Colors.gray6,
                                                  color: "#000",
                                                },
                                          ]}
                                        >
                                          {item.time}
                                        </Text>
                                      </TouchableOpacity>
                                    );
                                  }}
                                ></FlatList>
                              </View>
                              <View style={{ width: "100%" }}>
                                <FlatList
                                  horizontal={true}
                                  showsHorizontalScrollIndicator={false}
                                  data={this.state.final_arr_two}
                                  renderItem={({ item, index }) => {
                                    return (
                                      <TouchableOpacity
                                        onPress={() => {
                                          this.setState({
                                            time_take_data: item.time,
                                          });
                                        }}
                                      >
                                        <Text
                                          style={[
                                            {
                                              marginRight: (mobileW * 3) / 100,
                                              marginTop: (mobileW * 3) / 100,

                                              fontFamily: Font.ques_fontfamily,
                                              fontSize: Font.sregulartext_size,
                                              padding: (mobileW * 2) / 100,
                                              paddingHorizontal:
                                                (mobileW * 3.3) / 100,
                                            },
                                            item.time ==
                                            this.state.time_take_data
                                              ? {
                                                  backgroundColor:
                                                    Colors.theme_color,
                                                  color: "#fff",
                                                }
                                              : {
                                                  backgroundColor: Colors.gray6,
                                                  color: "#000",
                                                },
                                          ]}
                                        >
                                          {item.time}
                                        </Text>
                                      </TouchableOpacity>
                                    );
                                  }}
                                />
                              </View>
                            </View>
                          ) : (
                            <Text
                              style={{
                                fontFamily: Font.fontMediumItalic,
                                fontSize: (mobileW * 4) / 100,
                                alignSelf: "center",
                                marginTop: (mobileW * 3) / 100,
                                textAlign: "center",
                                marginLeft: (mobileW * 32) / 100,
                              }}
                            >
                              {Lang_chg.no_data_Found[config.language]}
                            </Text>
                          )}
                        </View>
                      </ScrollView>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        this.submit_btn();
                      }}
                      style={{
                        width: "98%",
                        alignSelf: "center",
                        borderRadius: (mobileW * 2) / 100,
                        backgroundColor: Colors.theme_color,
                        paddingVertical: (mobileW * 2.8) / 100,
                        marginVertical: (mobileW * 6) / 100,
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.textwhite,
                          fontFamily: Font.fontmedium,
                          fontSize: Font.subtext,
                          alignSelf: "flex-end",
                          textAlign: config.textalign,
                          alignSelf: "center",
                        }}
                      >
                        {Lang_chg.SAVECHANGERESCHEDULE[config.language]}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
