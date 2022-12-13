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
  windowWidth,
  localStorage,
  localimag,
  consolepro,
  Lang_chg,
  apifuntion,
} from "../Provider/utilslib/Utils";

import Styles from "../Styles";

import moment from "moment-timezone";
import ScreenHeader from "../components/ScreenHeader";
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

export default class Appointment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: Lang_chg.MyAppointments[config.language],
      modalVisible: false,
      All: true,
      Nurse: false,
      Babysitter: false,
      Listenquiries: false,
      Physiotherapist: false,
      service_status: "",
      manageTab: "All",
      appoinment_detetails: "",
      pass_status: "all",
      time_take_data: "",
      rescdule_data: "",
      notification_count: "",
      date_array: "",
      send_id: "",
      message: "",
      api_status: 3,
      tabheadings: tabheadings,
      task_details: "",
    };
  }
  componentDidMount() {
    if (this.props.route.params != undefined) {
      let title = this.props.route.params.title;
      let api_status = this.props.route.params.api_status;
      this.setState({ title: title, api_status: api_status });
      console.log(title);
    }
    this.props.navigation.addListener("focus", () => {
      this.get_Services(1);
      this.get_all_notification();
    });
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

    let apishow = "api-patient-all-appointment";

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
        this.setState({ appoinment_detetails: "" });
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
    let url =
      config.baseURL +
      (this.state.service_status === "lab"
        ? "api-patient-update-lab-reschedule-appointment"
        : this.state.service_status === "doctor"
          ? "api-patient-update-doctor-reschedule-appointment"
          : "api-patient-update-reschedule-appointment");

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
          console.log("muskan", obj);
          this.setState({ modalVisible: false });
          setTimeout(() => {
            this.get_Services(1);
            msgProvider.showSuccess(obj.message);
          }, 700);
        } else {
          setTimeout(() => {
            msgProvider.alert("", obj.message, false);
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
    consolepro.consolelog("service_status", this.state.service_status);
    console.log("appoinment_detetails", this.state.appoinment_detetails);
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];
    let url =
      config.baseURL +
      (this.state.service_status === "lab"
        ? "api-patient-lab-reschedule-appointment"
        : this.state.service_status === "doctor"
          ? "api-patient-doctor-reschedule-appointment"
          : "api-patient-reschedule-appointment");
    console.log("url", url);

    var data = new FormData();
    data.append("login_user_id", user_id);
    data.append("order_id", this.state.order_id);
    data.append("service_type", this.state.service_status);
    if (this.state.service_status === "lab") {
      data.append("task_type", this.state.booking_type);
    }

    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        consolepro.consolelog("obj", JSON.stringify(obj));

        if (obj.status == true) {
          var cureent = new Date();
          let min =
            cureent.getMinutes() < 10
              ? "0" + cureent.getMinutes()
              : cureent.getMinutes();
          let hour =
            cureent.getHours() < 10
              ? "0" + cureent.getHours()
              : cureent.getHours();
          var timcurrent = hour + ":" + min;
          this.setState({ timcurrent_for_check: timcurrent });

          if (obj.result.task_time != "") {
            var names = obj.result.task_time;
            var nameArr = names.split(",");

            const new_time_dlot = [];
            const Arr1 = [];
            const Arr2 = [];
            var ar1 = false;
            var ar2 = true;
            if (names != "") {
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
                  if (finaltime >= timcurrent) {
                    new_time_dlot.push({
                      time: nameArr[l],
                      time_status: false,
                    });
                    // if ((l + 2) % 2 == 0) {
                    //   Arr1.push({ time: nameArr[l], time_status: false });
                    // } else {
                    //   Arr2.push({ time: nameArr[l], time_status: false });
                    // }
                    if (!ar1) {
                      ar1 = true;
                      ar2 = false;
                      Arr1.push({ time: nameArr[l], time_status: false });
                    } else {
                      ar1 = false;
                      ar2 = true;
                      Arr2.push({ time: nameArr[l], time_status: false });
                    }
                  }
                } else {
                  new_time_dlot.push({ time: nameArr[l], time_status: false });
                  if (!ar1) {
                    ar1 = true;
                    ar2 = false;
                    Arr1.push({ time: nameArr[l], time_status: false });
                  } else {
                    ar1 = false;
                    ar2 = true;
                    Arr2.push({ time: nameArr[l], time_status: false });
                  }
                  // if ((l + 2) % 2 == 0) {
                  //   Arr1.push({ time: nameArr[l], time_status: false });
                  // } else {
                  //   Arr2.push({ time: nameArr[l], time_status: false });
                  // }
                }
              }
            }
            consolepro.consolelog("new_time_dlot---->>>> ", new_time_dlot);
            this.setState({
              time_Arr: new_time_dlot,
              final_one: Arr1,
              final_arr_two: Arr2,
            });
          } else {
            this.setState({
              time_Arr: [],
              final_one: [],
              final_arr_two: [],
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

  getDoctorTimeDate = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];

    let url = config.baseURL + "api-patient-doctor-next-date-time";
    console.log("url", url);

    var data = new FormData();
    data.append("provider_id", this.state.send_id);
    data.append("date", this.state.set_date);
    data.append("service_type", this.state.service_status);

    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        console.log("misdhfbs ", obj);

        if (obj.status == true) {
          var cureent = new Date();
          let min =
            cureent.getMinutes() < 10
              ? "0" + cureent.getMinutes()
              : cureent.getMinutes();
          let hour =
            cureent.getHours() < 10
              ? "0" + cureent.getHours()
              : cureent.getHours();
          var timcurrent = hour + ":" + min;
          this.setState({ timcurrent_for_check: timcurrent });
          consolepro.consolelog("obj.result", obj.result);
          if (
            this.state.rescdule_data.slot_booking_id === "HOMEVISIT_BOOKING"
          ) {
            if (obj.result.home_visit_time != "") {
              var names = obj.result.home_visit_time;
              var nameArr = names.split(",");

              console.log("Arr2", Arr2);

              const new_time_home = [];
              const Arr1 = [];
              const Arr2 = [];
              var home_visit_ar1 = false;
              var home_visit_ar2 = true;
              if (names != "") {
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
                      new_time_home.push({
                        time: nameArr[l],
                        time_status: false,
                      });
                      // if ((l + 2) % 2 == 0) {
                      if (!home_visit_ar1) {
                        home_visit_ar1 = true;
                        home_visit_ar2 = false;
                        Arr1.push({ time: nameArr[l], time_status: false });
                      } else {
                        home_visit_ar1 = false;
                        home_visit_ar2 = true;
                        Arr2.push({ time: nameArr[l], time_status: false });
                      }
                    }
                  } else {
                    new_time_home.push({
                      time: nameArr[l],
                      time_status: false,
                    });
                    // if ((l + 2) % 2 == 0) {
                    if (!home_visit_ar1) {
                      home_visit_ar1 = true;
                      home_visit_ar2 = false;
                      Arr1.push({ time: nameArr[l], time_status: false });
                    } else {
                      home_visit_ar1 = false;
                      home_visit_ar2 = true;
                      Arr2.push({ time: nameArr[l], time_status: false });
                    }
                  }
                }
              }

              this.setState({
                time_Arr: new_time_home,
                final_one: Arr1,
                final_arr_two: Arr2,
              });
            } else {
              this.setState({ time_Arr: obj.result.home_visit_time });
            }
          } else {
            if (obj.result.online_task_time != "") {
              var names_time = obj.result.online_task_time;
              var nameArr_time = names_time.split(",");
            }

            const new_time_online = [];
            const online_Arr1 = [];
            const online_Arr2 = [];
            var ar1 = false;
            var ar2 = true;
            if (obj.result.online_task_time != "") {
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
                  if (finaltime_hour >= this.state.timcurrent_for_check) {
                    new_time_online.push({
                      time: nameArr_time[m],
                      time_status: false,
                    });
                    consolepro.consolelog(
                      "-------- new_time_online if ------- " + new_time_online
                    );
                    // if ((m + 2) % 2 == 0) {
                    //   online_Arr1.push({ time: nameArr_time[m] });
                    // } else {
                    //   online_Arr2.push({ time: nameArr_time[m] });
                    // }
                    if (!ar1) {
                      ar1 = true;
                      ar2 = false;
                      online_Arr1.push({ time: nameArr_time[m] });
                    } else {
                      ar1 = false;
                      ar2 = true;
                      online_Arr2.push({ time: nameArr_time[m] });
                    }
                  }
                } else {
                  new_time_online.push({
                    time: nameArr_time[m],
                    time_status: false,
                  });
                  // consolepro.consolelog("-------- new_time_online else  ------- " + new_time_online);
                  if (!ar1) {
                    ar1 = true;
                    ar2 = false;
                    online_Arr1.push({ time: nameArr_time[m] });
                  } else {
                    ar1 = false;
                    ar2 = true;
                    online_Arr2.push({ time: nameArr_time[m] });
                  }
                  // if ((m + 2) % 2 == 0) {
                  //   online_Arr1.push({ time: nameArr_time[m] });
                  // } else {
                  //   online_Arr2.push({ time: nameArr_time[m] });
                  // }
                }
              }
              this.setState({
                time_Arr: new_time_online,
                // final_hour_one: online_Arr1,
                // final_hour_two: online_Arr2,
                final_one: online_Arr1,
                final_arr_two: online_Arr2,
              });
            } else {
              this.setState({
                time_Arr: obj.result.online_task_time,
                final_one: online_Arr1,
                final_arr_two: online_Arr2,
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

  getLabTimeDate = async () => {
    let url = config.baseURL + "api-patient-lab-next-date-time";
    console.log("url", url);

    var data = new FormData();
    data.append("provider_id", this.state.send_id);
    data.append("date", this.state.set_date);
    data.append("service_type", this.state.service_status);

    apifuntion
      .postApi(url, data)
      .then((obj) => {
        if (obj.status == true) {
          var cureent = new Date();
          let min =
            cureent.getMinutes() < 10
              ? "0" + cureent.getMinutes()
              : cureent.getMinutes();
          let hour =
            cureent.getHours() < 10
              ? "0" + cureent.getHours()
              : cureent.getHours();
          var timcurrent = hour + ":" + min;
          this.setState({ timcurrent_for_check: timcurrent });
          consolepro.consolelog("obj.result", JSON.stringify(obj));
          consolepro.consolelog("check_booking ", this.state.check_booking);
          if (this.state.check_booking == "TESTS_BOOKING") {
            if (obj.result.task_time != "") {
              var names = obj.result.task_time;
              var nameArr = names.split(",");

              const new_time_dlot = [];
              const Arr1 = [];
              const Arr2 = [];
              var task_ar1 = false;
              var task_ar2 = true;
              if (names != "") {
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
                      if (!task_ar1) {
                        task_ar1 = true;
                        task_ar2 = false;
                        Arr1.push({ time: nameArr[l], time_status: false });
                      } else {
                        task_ar1 = false;
                        task_ar2 = true;
                        Arr2.push({ time: nameArr[l], time_status: false });
                      }
                    }
                  } else {
                    new_time_dlot.push({
                      time: nameArr[l],
                      time_status: false,
                    });
                    if (!task_ar1) {
                      task_ar1 = true;
                      task_ar2 = false;
                      Arr1.push({ time: nameArr[l], time_status: false });
                    } else {
                      task_ar1 = false;
                      task_ar2 = true;
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
            if (obj.result.task_time != "") {
              var names = obj.result.task_time;
              var nameArr = names.split(",");

              const new_time_dlot = [];
              const Arr1 = [];
              const Arr2 = [];
              var task_ar1 = false;
              var task_ar2 = true;
              if (names != "") {
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
                      if (!task_ar1) {
                        task_ar1 = true;
                        task_ar2 = false;
                        Arr1.push({ time: nameArr[l], time_status: false });
                      } else {
                        task_ar1 = false;
                        task_ar2 = true;
                        Arr2.push({ time: nameArr[l], time_status: false });
                      }
                    }
                  } else {
                    new_time_dlot.push({
                      time: nameArr[l],
                      time_status: false,
                    });
                    if (!task_ar1) {
                      task_ar1 = true;
                      task_ar2 = false;
                      Arr1.push({ time: nameArr[l], time_status: false });
                    } else {
                      task_ar1 = false;
                      task_ar2 = true;
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
          }
        } else {
          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
      });
  };

  getTimeDate = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];

    let url = config.baseURL + "api-patient-next-date-time";
    console.log("url", url);

    var data = new FormData();
    data.append("provider_id", this.state.send_id);
    data.append("date", this.state.set_date);
    data.append("task_type", this.state.set_task);
    data.append("service_type", this.state.service_status);
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        if (obj.status == true) {
          var cureent = new Date();
          let min =
            cureent.getMinutes() < 10
              ? "0" + cureent.getMinutes()
              : cureent.getMinutes();
          let hour =
            cureent.getHours() < 10
              ? "0" + cureent.getHours()
              : cureent.getHours();
          var timcurrent = hour + ":" + min;
          this.setState({ timcurrent_for_check: timcurrent });
          consolepro.consolelog("obj.result", obj.result);
          if (this.state.check_booking == "TASK_BOOKING") {
            if (obj.result.task_time != "") {
              var names = obj.result.task_time;
              var nameArr = names.split(",");

              const new_time_dlot = [];
              const Arr1 = [];
              const Arr2 = [];
              var task_ar1 = false;
              var task_ar2 = true;
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
                      if (!task_ar1) {
                        task_ar1 = true;
                        task_ar2 = false;
                        Arr1.push({ time: nameArr[l], time_status: false });
                      } else {
                        task_ar1 = false;
                        task_ar2 = true;
                        Arr2.push({ time: nameArr[l], time_status: false });
                      }
                    }
                  } else {
                    new_time_dlot.push({
                      time: nameArr[l],
                      time_status: false,
                    });
                    if (!task_ar1) {
                      task_ar1 = true;
                      task_ar2 = false;
                      Arr1.push({ time: nameArr[l], time_status: false });
                    } else {
                      task_ar1 = false;
                      task_ar2 = true;
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
            var ar1 = false;
            var ar2 = true;
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
                  if (finaltime_hour >= this.state.timcurrent_for_check) {
                    new_time_hourl.push({
                      time: nameArr_time[m],
                      time_status: false,
                    });
                    if (!ar1) {
                      ar1 = true;
                      ar2 = false;
                      Arr_hour.push({
                        time: nameArr_time[m],
                        time_status: false,
                      });
                    } else {
                      ar1 = false;
                      ar2 = true;
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

                  if (!ar1) {
                    ar1 = true;
                    ar2 = false;
                    Arr_hour.push({
                      time: nameArr_time[m],
                      time_status: false,
                    });
                  } else {
                    ar1 = false;
                    ar2 = true;
                    Arr2_hour.push({
                      time: nameArr_time[m],
                      time_status: false,
                    });
                  }
                  // if ((m + 2) % 2 == 0) {
                  //   Arr_hour.push({
                  //     time: nameArr_time[m],
                  //     time_status: false,
                  //   });
                  // } else {
                  //   Arr2_hour.push({
                  //     time: nameArr_time[m],
                  //     time_status: false,
                  //   });
                  // }
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
      <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>

        <ScreenHeader
          navigation={this.props.navigation}
          title={Lang_chg.MyAppointments[config.language]}
          onBackPress={() => this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          })}
          leftIcon
          rightIcon
        />
       

        {/* tabheadings */}

        {/* <View
              style={{
                backgroundColor: Colors.theme_color,
                paddingTop: (windowWidth * 1.5) / 100,
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
                          }),
                            this.get_Services(0);
                        }}
                        style={
                          item.name == this.state.manageTab
                            ? {
                                borderColor: "#1b56ee",
                                justifyContent: "center",
                                height: (mobileH * 4.3) / 100,
                                marginHorizontal: (windowWidth * 4) / 100,
                              }
                            : {
                                height: (mobileH * 4.3) / 100,
                                justifyContent: "center",
                                marginHorizontal: (windowWidth * 4) / 100,
                              }
                        }
                      >
                        {config.language == 0 ? (
                          <Text
                            style={[
                              {
                                fontSize: (windowWidth * 3.8) / 100,
                                textAlign: "center",
                                fontFamily: Font.SemiBold,
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
                                fontSize: (windowWidth * 3.8) / 100,
                                textAlign: "center",
                                fontFamily: Font.SemiBold,
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
                            borderTopLeftRadius: (windowWidth * 2.2) / 100,
                            borderTopRightRadius: (windowWidth * 2.2) / 100,
                            backgroundColor: "#fff",
                            alignSelf: "center",
                          }}
                        />
                      )}
                    </View>
                  );
                }}
              />
            </View> */}

        {this.state.appoinment_detetails == "" ||
          (this.state.appoinment_detetails == null && (
            <Text
              style={{
                textAlign: "center",
                color: Colors.Theme,
                fontFamily: Font.Medium,
                fontSize: (windowWidth * 3.5) / 100,
                marginTop: (windowWidth * 60) / 100,
              }}
            >
              {this.state.message}
            </Text>
          ))}

        {/* --------------------Main List------------ */}


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
                backgroundColor: Colors.White,
                // marginTop: (windowWidth * 50) / 100,
                position: "absolute",
                bottom: 0,
                borderTopLeftRadius: (windowWidth * 10) / 100,
                borderTopRightRadius: (windowWidth * 10) / 100,
                borderWidth: (windowWidth * 0.3) / 100,
                borderColor: Colors.gainsboro,
                elevation: 5,
                height: (mobileH * 80) / 100,
              }}
            >
              {/* task booking section */}
              <ScrollView
                style={{
                  marginTop: (windowWidth * 2) / 100,
                  borderTopRightRadius: (windowWidth * 5) / 100,
                  borderTopLeftRadius: (windowWidth * 5) / 100,
                }}
                showsVerticalScrollIndicator={false}
              >
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: (windowWidth * 90) / 100,
                      // backgroundColor:'red',
                      alignSelf: "center",
                      paddingTop: (windowWidth * 4) / 100,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Font.Medium,
                        fontSize: (windowWidth * 4) / 100,
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
                          fontFamily: Font.Medium,
                          fontSize: Font.name,
                          paddingRight: (windowWidth * 4) / 100,
                        }}
                      >
                        {rescdule.order_id}
                      </Text>

                      <TouchableOpacity
                        onPress={() => this.setState({ modalVisible: false })}
                      >
                        {/* <Image
                          source={localimag.cross}
                          style={{
                            resizeMode: "contain",
                            width: 20,
                            height: 20,

                            alignSelf: "center",
                          }}
                        /> */}
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
                      marginVertical: (windowWidth * 2) / 100,
                    }}
                  />
                  <View
                    style={{
                      width: "90%",
                      alignSelf: "center",
                      paddingVertical: (windowWidth * 4) / 100,
                    }}
                  >
                    <View style={{ paddingBottom: (windowWidth * 1.5) / 100 }}>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: (windowWidth * 3.5) / 100,
                          textAlign: config.textRotate,
                          color: Colors.theme_color,
                        }}
                      >
                        {/* {rescdule.provider_type === "doctor"
                          ? rescdule.task_type === "Online"
                            ? Lang_chg.OnlineCons[config.language]
                            : Lang_chg.HomeVisit[config.language]
                          : rescdule.task_type} */}
                        {rescdule.provider_type === "doctor"
                          ? rescdule.task_type === "Online"
                            ? Lang_chg.OnlineCons[config.language]
                            : Lang_chg.HomeVisit[config.language]
                          : rescdule.provider_type === "lab"
                            ? rescdule.slot_booking_id === "PACKAGE_BOOKING"
                              ? Lang_chg.HealthPackages[config.language]
                              : Lang_chg.Tests[config.language]
                            : rescdule.task_type}
                      </Text>
                    </View>
                    <View
                      style={[
                        {
                          paddingVertical: (windowWidth * 3) / 100,
                          borderTopWidth: (windowWidth * 0.3) / 100,
                          borderColor: Colors.bordercolor,
                        },
                        this.state.task_details.length >= 3
                          ? { height: (windowWidth * 40) / 100 }
                          : { paddingVertical: (windowWidth * 1.5) / 100 },
                      ]}
                    >
                      {rescdule.provider_type === "doctor" ? (
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
                                    paddingVertical: (windowWidth * 1.7) / 100,
                                    flexDirection: "row",
                                    marginTop: (windowWidth * 0.3) / 100,
                                  }}
                                >
                                  <Text
                                    style={{
                                      width: "70%",
                                      textAlign: config.textRotate,
                                      alignSelf: "center",
                                      fontSize: (windowWidth * 3.6) / 100,
                                      fontFamily: Font.Regular,
                                      color: "#000",
                                    }}
                                  >
                                    {item.name}
                                  </Text>
                                  <Text
                                    style={{
                                      width: "30%",
                                      fontSize: (windowWidth * 3.6) / 100,
                                      fontFamily: Font.Regular,
                                      color: "#000",
                                      textAlign: "right",
                                    }}
                                  >
                                    {item.price}
                                  </Text>
                                </View>
                              );
                            } else {
                              return <View />;
                            }
                          }}
                        />
                      ) : rescdule.slot_booking_id == "TASK_BOOKING" ? (
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

                                    paddingVertical: (windowWidth * 1.7) / 100,
                                    flexDirection: "row",
                                    marginTop: (windowWidth * 0.3) / 100,
                                  }}
                                >
                                  <Text
                                    style={{
                                      width: "70%",
                                      textAlign: config.textRotate,
                                      alignSelf: "center",
                                      fontSize: (windowWidth * 3.6) / 100,
                                      fontFamily: Font.Regular,

                                      color: "#000",
                                    }}
                                  >
                                    {item.name}
                                  </Text>
                                  <Text
                                    style={{
                                      width: "30%",

                                      fontSize: (windowWidth * 3.6) / 100,
                                      fontFamily: Font.Regular,
                                      color: "#000",

                                      textAlign: "right",
                                    }}
                                  >
                                    {item.price}
                                  </Text>
                                </View>
                              );
                            } else {
                              return <View />;
                            }
                          }}
                        />
                      ) : rescdule.slot_booking_id == "TESTS_BOOKING" ||
                        rescdule.slot_booking_id == "PACKAGE_BOOKING" ? (
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
                                    paddingVertical: (windowWidth * 1.7) / 100,
                                    flexDirection: "row",
                                    marginTop: (windowWidth * 0.3) / 100,
                                  }}
                                >
                                  <Text
                                    style={{
                                      width: "70%",
                                      textAlign: config.textRotate,
                                      alignSelf: "center",
                                      fontSize: (windowWidth * 3.6) / 100,
                                      fontFamily: Font.Regular,

                                      color: "#000",
                                    }}
                                  >
                                    {item.name}
                                  </Text>
                                  <Text
                                    style={{
                                      width: "30%",

                                      fontSize: (windowWidth * 3.6) / 100,
                                      fontFamily: Font.Regular,
                                      color: "#000",

                                      textAlign: "right",
                                    }}
                                  >
                                    {item.price}
                                  </Text>
                                </View>
                              );
                            } else {
                              return <View />;
                            }
                          }}
                        />
                      ) : (
                        <FlatList
                          showsHorizontalScrollIndicator={false}
                          horizontal={true}
                          data={rescdule.task_details}
                          renderItem={({ item, index }) => {
                            return (
                              <View
                                style={{
                                  borderRadius: (windowWidth * 2) / 100,
                                  marginRight: (windowWidth * 2) / 100,
                                  marginTop: (windowWidth * 2) / 100,
                                  borderColor: "#0168B3",
                                  borderWidth: 2,

                                  width: (windowWidth * 30) / 100,
                                  backgroundColor: "#fff",
                                }}
                              >
                                <View
                                  style={{
                                    backgroundColor: "#0168B3",
                                    borderTopLeftRadius: (windowWidth * 1.2) / 100,
                                    borderTopRightRadius: (windowWidth * 1.2) / 100,
                                    width: "100%",
                                  }}
                                >
                                  <Text
                                    style={{
                                      // backgroundColor:'red',
                                      // paddingHorizontal: (windowWidth * 5) / 100,
                                      paddingVertical: (windowWidth * 1.5) / 100,
                                      color: Colors.White,
                                      fontFamily: Font.Medium,
                                      fontSize: (windowWidth * 3) / 100,
                                      textAlign: "center",
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    {item.name}
                                  </Text>
                                </View>
                                <Text
                                  style={{
                                    paddingVertical: (windowWidth * 2) / 100,
                                    fontFamily: Font.Medium,
                                    textAlign: "center",
                                    fontSize: Font.sregulartext_size,
                                  }}
                                >
                                  {item.price}
                                </Text>
                              </View>
                            );
                          }}
                        />
                      )}
                    </View>

                    {/* hourlybooking */}

                    <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignSelf: "center",
                        paddingTop: (windowWidth * 4) / 100,
                        // paddingBottom: (windowWidth * 4) / 100,
                        // borderBottomWidth: (windowWidth * 0.3) / 100,
                        borderColor: Colors.gainsboro,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: Font.name,
                          textAlign: config.textRotate,
                        }}
                      >
                        {Lang_chg.Appointmentschedule[config.language]}
                      </Text>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        {/* <Image
                          source={localimag.calendarimg}
                          style={{
                            resizeMode: "contain",
                            width: 20,
                            height: 20,
                            alignSelf: "center",
                          }}
                        /> */}

                        <Text
                          style={{
                            color: Colors.theme_color,
                            fontFamily: Font.Medium,
                            fontSize: Font.name,
                            marginLeft: (windowWidth * 1) / 100,
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
                        marginTop: (windowWidth * 2) / 100,
                      }}
                    />
                    <View
                      style={{
                        width: "100%",
                        alignSelf: "center",
                        paddingTop: (windowWidth * 3) / 100,
                        paddingBottom: (windowWidth * 3) / 100,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: Font.Regular,
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
                                  this.setState(
                                    {
                                      set_date: item.date1,
                                      set_task: "task_base",
                                      time_take_data: "",
                                    },
                                    () => {
                                      this.state.service_status === "lab"
                                        ? this.getLabTimeDate()
                                        : this.state.service_status === "doctor"
                                          ? this.getDoctorTimeDate()
                                          : this.getTimeDate(),
                                        this.check_date(item, index);
                                    }
                                  );
                                }}
                                style={{ width: (windowWidth * 15) / 100 }}
                              >
                                <Text
                                  style={{
                                    marginRight: (windowWidth * 3) / 100,
                                    marginTop: (windowWidth * 3) / 100,
                                    backgroundColor:
                                      item.tick == 1 ? "#0787D2" : Colors.lightGrey,
                                    color: item.tick == 1 ? Colors.White : "black",
                                    textAlign: "center",
                                    paddingVertical: (windowWidth * 2) / 100,
                                    fontFamily: Font.ques_fontfamily,
                                    fontSize: Font.sregulartext_size,

                                    lineHeight: (windowWidth * 5) / 100,
                                  }}
                                >
                                  {item.day}
                                  {"\n"}

                                  {item.datenew}
                                </Text>
                              </TouchableOpacity>
                            );
                          }}
                        />
                      </View>
                    </View>

                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: Colors.gainsboro,
                        width: "100%",
                        marginTop: (windowWidth * 1.5) / 100,
                        marginBottom: (windowWidth * 1.5) / 100,
                      }}
                    />
                    <View
                      style={{
                        width: "100%",
                        alignSelf: "center",
                        paddingVertical: (windowWidth * 3) / 100,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: Font.Regular,
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
                                              marginRight: (windowWidth * 3) / 100,
                                              marginTop: (windowWidth * 3) / 100,
                                              fontFamily: Font.ques_fontfamily,
                                              fontSize: Font.sregulartext_size,
                                              padding: (windowWidth * 2) / 100,
                                              paddingHorizontal:
                                                (windowWidth * 3.3) / 100,
                                            },
                                            item.time ==
                                              this.state.time_take_data
                                              ? {
                                                backgroundColor:
                                                  Colors.theme_color,
                                                color: "#fff",
                                              }
                                              : {
                                                backgroundColor: Colors.lightGrey,
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
                                              marginRight: (windowWidth * 3) / 100,
                                              marginTop: (windowWidth * 3) / 100,
                                              fontFamily: Font.ques_fontfamily,
                                              fontSize: Font.sregulartext_size,
                                              padding: (windowWidth * 2) / 100,
                                              paddingHorizontal:
                                                (windowWidth * 3.3) / 100,
                                            },
                                            item.time ==
                                              this.state.time_take_data
                                              ? {
                                                backgroundColor:
                                                  Colors.theme_color,
                                                color: "#fff",
                                              }
                                              : {
                                                backgroundColor: Colors.lightGrey,
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
                                fontFamily: Font.MediumItalic,
                                fontSize: (windowWidth * 4) / 100,
                                alignSelf: "center",
                                marginTop: (windowWidth * 3) / 100,
                                textAlign: "center",
                                marginLeft: (windowWidth * 32) / 100,
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
                        borderRadius: (windowWidth * 2) / 100,
                        backgroundColor: Colors.theme_color,
                        paddingVertical: (windowWidth * 2.8) / 100,
                        marginVertical: (windowWidth * 6) / 100,
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.White,
                          fontFamily: Font.Medium,
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
