import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Keyboard,
  FlatList,
  Modal,
} from "react-native";
import {
  Colors,
  Font,
  msgProvider,
  msgText,
  config,
  windowWidth,
  localStorage,
  localimag,
  consolepro,
  Lang_chg,
  apifuntion,
  Icons,
} from "../Provider/utilslib/Utils";
import Styles from "../Styles";

import DoctorSymptomsAppointment from "../components/DoctorSymptomsAppointment";
import LabAppointment from "../components/LabAppointment";
import ScreenHeader from "../components/ScreenHeader";
import { Clock, dummyUser, GoldStar, leftArrow, Notification } from "../icons/SvgIcons/Index";
import { SvgXml } from "react-native-svg";
import { s, vs } from "react-native-size-matters";

const timedata = [
  {
    id: 0,
    time: "10:30 AM",
  },
  {
    id: 2,
    time: "11:00 AM",
  },
  {
    id: 1,
    time: "11:30 AM",
  },
  {
    id: 1,
    time: "12:00 AM",
  },
  {
    id: 1,
    time: "12:30 PM",
  },
  {
    id: 1,
    time: "01:00 PM",
  },
  {
    id: 1,
    time: "01:30 PM",
  },
  {
    id: 1,
    time: "02:00 PM",
  },
];

export default class Booking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      providerType: this.props?.route?.params?.providerType,
      providerId: this.props?.route?.params?.providerId,
      isFromHospital: this.props?.route?.params?.isFromHospital,
      display: "taskbooking",
      task_base_task: "",
      task_base_task1: "",
      new_task_arr: "",
      set_date: "",
      timedata: timedata,
      distance_fare_pass: "",
      person_arr: "",
      modalVisible3: false,
      Error_popup: false,
      select_task: "",
      time_add: "",
      time_take: "",
      notification_count: "",
      task_price_total: "",
      sub_total_price: "",
      total_price: "",
      family_member_id: "",
      time_take_data: "",
      time_take_data_hour: "",
      total_price_show: "",
      hour_id: "",
      only_vatprice_show: "",
      hour_total_amount: "",
      hour_time: "",
      active_status: true,
      vat_price_show: "",
      final_total_price: "",
      hour_total_price: "",
      vat_price_show_hourly: "",
      vat_price_show_display: "",
      currency_symbol: "",
      indexPosition: this.props.route.params.indexPosition,
      onlineTaskPrice: "",
      homeVisitTaskPrice: "",
      onlineSubTotalPrice: "",
      homeVisitSubTotalPrice: "",
      homeVisitVat: "",
      onlineVisitVat: "",
      symptomsRecording: "",
      symptomText: "",
      prescriptionsImage: "",
      packageId: "",
      packagePrice: "",
    };
  }
  componentDidMount() {
    if (this.props.route.params.display != undefined) {
      let display = this.props.route.params.display;
      this.setState({ display: display });

    }
    this.props.navigation.addListener("focus", () => {
      this.state.providerType === "lab" ?
        this.getLabServices()
        : this.state.providerType === "doctor" ?
          this.getDoctorServices()
          : this.getServices();
      this.getDay();
      this.getAllNotification();
      this.getPerson()
      // console.log('..........................', this.props?.route?.params?.providerType);

    });
  }
  getAllNotification = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];

    let url = config.baseURL + "api-notification-count";
    var data = new FormData();
    data.append("login_user_id", user_id);

    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        // consolepro.consolelog("getAllNotification", obj);
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

  getDay = () => {
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
  };

  getDoctorTimeDate = async () => {

    let url = config.baseURL + "api-patient-doctor-next-date-time";

    var data = new FormData();
    data.append("provider_id", this.state.providerId);
    data.append("date", this.state.set_date);
    data.append("service_type", this.state.providerType);

    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        // console.log("getDoctorTimeDate ", obj);

        if (obj.status == true) {
          if (obj.result.home_visit_time != "") {
            var names = obj.result.home_visit_time;
            var nameArr = names.split(",");

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
                  new_time_home.push({ time: nameArr[l], time_status: false });
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
              final_arr2: Arr2,
            });
            let real_total = "";
            let real_total_show = "";
            let real_total_final = "";
            let show_real_price = "";
            let vat_price_new = this.state.booking_data.vat_price;
            let homeSubTotal = "";
            let homeVisitTotalPrice = "";
            let homeVat = "";

            if (vat_price_new != 0) {
              if (obj.result.home_visit_time != "") {
                if (this.state.booking_data.distance_fare != 0) {
                  real_total = "";
                  real_total_show = "";
                  real_total_final = "";
                  show_real_price = "";
                  homeSubTotal = parseFloat(
                    Number(
                      this.state.booking_data.home_visit_task[0].task_price
                    ) + Number(this.state.booking_data.distance_fare)
                  ).toFixed(1);
                  // console.log("sub_total home_visit_task :: ", homeSubTotal);
                  real_total_show =
                    (parseFloat(
                      homeSubTotal +
                      Number(this.state.booking_data.distance_fare)
                    ) /
                      100) *
                    vat_price_new;
                  real_total_final = real_total_show.toFixed(1);
                  // console.log("real_total_final home_visit_task:: ", real_total_final);
                  real_total = parseFloat(
                    Number(homeSubTotal) + Number(real_total_final)
                  ).toFixed(1);
                  show_real_price = parseFloat(vat_price_new).toFixed(1);
                  homeVisitTotalPrice = real_total;
                  homeVat = real_total_final;
                } else {
                  real_total = "";
                  real_total_show = "";
                  real_total_final = "";
                  show_real_price = "";
                  homeSubTotal = parseFloat(
                    Number(
                      this.state.booking_data.home_visit_task[0].task_price
                    )
                  ).toFixed(1);
                  // console.log("sub_total home_visit_task :: ", homeSubTotal);
                  real_total_show =
                    (parseFloat(homeSubTotal) / 100) * vat_price_new;
                  real_total_final = real_total_show.toFixed(1);
                  // console.log("real_total_final home_visit_task:: ", real_total_final);
                  real_total = parseFloat(
                    Number(homeSubTotal) + Number(real_total_final)
                  ).toFixed(1);
                  show_real_price = parseFloat(vat_price_new).toFixed(1);
                  homeVisitTotalPrice = real_total;
                  homeVat = real_total_final;
                }
              }
            } else {
              real_total_show =
                (this.state.booking_data.distance_fare / 100) * vat_price_new;
              real_total_final = real_total_show.toFixed(1);
              real_total = (
                parseFloat(vat_price_new) +
                parseFloat(this.state.booking_data.distance_fare)
              ).toFixed(1);
              show_real_price = parseFloat(vat_price_new).toFixed(1);
            }

            let sun_total = parseFloat(real_total).toFixed(1);

            this.setState({
              homeVisitSubTotalPrice: homeSubTotal,
              homeVisitVat: homeVat, //0.0,
              booking_data: this.state.booking_data,
              message: this.state.booking_data.message,
              vat_price: vat_price_new,
              distance_fare: this.state.booking_data.distance_fare,
              final_total_price: sun_total,
              homeVisitTaskPrice: homeVisitTotalPrice,
              hour_total_price: sun_total,
              vat_percent_used: this.state.booking_data.vat_text,
              hour_time: new_time_online,
              vat_price_show: real_total,
              vat_price_show_hourly: 0.0,
              distance_fare_pass: this.state.booking_data.distance_fare,
              final_one: Arr1,
              final_arr2: Arr2,
              only_vatprice_show: show_real_price,
            });
          } else {
            this.setState({ time_Arr: obj.result.home_visit_time });
          }

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
            }
            this.setState({
              hour_time: new_time_online,
              final_hour_one: online_Arr1,
              final_hour_two: online_Arr2,
            });
            let real_total = "";
            let real_total_show = "";
            let real_total_final = "";
            let show_real_price = "";
            let vat_price_new = this.state.booking_data.vat_price;
            let onlineSubTotal = "";
            let onlineTotalPrice = "";
            let onlineVat = "";

            if (vat_price_new != 0) {
              if (obj.result.online_task_time != "") {
                onlineSubTotal = "";
                real_total = "";
                real_total_show = "";
                real_total_final = "";
                show_real_price = "";
                onlineSubTotal = parseFloat(
                  Number(this.state.booking_data.online_base_task[0].task_price)
                ).toFixed(1);
                // console.log("sub_total online_base_task :: ", onlineSubTotal);
                real_total_show = (onlineSubTotal / 100) * vat_price_new;
                real_total_final = real_total_show.toFixed(1);
                real_total = parseFloat(
                  Number(onlineSubTotal) + Number(real_total_final)
                ).toFixed(1);
                show_real_price = parseFloat(vat_price_new).toFixed(1);
                onlineTotalPrice = real_total;
                onlineVat = real_total_final;
              }
              if (this.state.isFromHospital) {
                onlineSubTotal = "";
                real_total = "";
                real_total_show = "";
                real_total_final = "";
                show_real_price = "";
                onlineSubTotal = parseFloat(
                  Number(this.state.booking_data.online_base_task[0].task_price)
                ).toFixed(1);
                // console.log("sub_total online_base_task :: ", onlineSubTotal);
                real_total_show = (onlineSubTotal / 100) * vat_price_new;
                real_total_final = real_total_show.toFixed(1);
                real_total = parseFloat(
                  Number(onlineSubTotal) + Number(real_total_final)
                ).toFixed(1);
                show_real_price = parseFloat(vat_price_new).toFixed(1);
                onlineTotalPrice = real_total;
                onlineVat = real_total_final;
              }
            } else {
              real_total_show =
                (this.state.booking_data.distance_fare / 100) * vat_price_new;
              real_total_final = real_total_show.toFixed(1);
              real_total = (
                parseFloat(vat_price_new) +
                parseFloat(this.state.booking_data.distance_fare)
              ).toFixed(1);
              show_real_price = parseFloat(vat_price_new).toFixed(1);
            }
            let sun_total = parseFloat(real_total).toFixed(1);

            this.setState({
              onlineSubTotalPrice: onlineSubTotal,
              onlineVisitVat: onlineVat, //0.0,
              booking_data: this.state.booking_data,
              message: this.state.booking_data.message,
              vat_price: vat_price_new,
              distance_fare: this.state.booking_data.distance_fare,
              final_total_price: sun_total,
              onlineTaskPrice: onlineTotalPrice,
              hour_total_price: sun_total,
              vat_percent_used: this.state.booking_data.vat_text,
              hour_time: new_time_online,
              vat_price_show: real_total,
              vat_price_show_hourly: 0.0,
              distance_fare_pass: this.state.booking_data.distance_fare,
              final_hour_one: online_Arr1,
              final_hour_two: online_Arr2,
              only_vatprice_show: show_real_price,
            });
          } else {
            this.setState({
              hour_time: obj.result.online_task_time,
              final_hour_one: online_Arr1,
              final_hour_two: online_Arr2,
            });
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

    var data = new FormData();
    data.append("provider_id", this.state.providerId);
    data.append("date", this.state.set_date);
    data.append("service_type", this.state.providerType);

    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        console.log("getLabTimeDate", obj);

        if (obj.status == true) {
          if (obj.result.task_time != "") {
            var names = obj.result.task_time;
            var nameArr = names.split(",");

            const newTaskTime = [];
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
                    newTaskTime.push({
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
                  newTaskTime.push({ time: nameArr[l], time_status: false });
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
              time_Arr: newTaskTime,
              final_one: Arr1,
              final_arr2: Arr2,
            });
          } else {
            this.setState({
              time_Arr: obj.result.task_time,
            });
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
    let url = config.baseURL + "api-patient-next-date-time";

    var data = new FormData();
    data.append("provider_id", this.state.providerId);
    data.append("date", this.state.set_date);
    data.append("task_type", this.state.set_task);
    data.append("service_type", this.state.providerType);

    console.log('getTimeDate request.....', data);

    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        console.log("getTimeDate ", obj);

        if (obj.status == true) {
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
                  new_time_dlot.push({ time: nameArr[l], time_status: false });
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
              final_arr2: Arr2,
            });
          } else {
            this.setState({ time_Arr: obj.result.task_time });
          }

          if (obj.result.hourly_time != "") {
            var names_time = obj.result.hourly_time;
            var nameArr_time = names_time.split(",");
          }

          const new_time_hourl = [];
          const hour_Arr1 = [];
          const hour_Arr2 = [];
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
                    hour_Arr1.push({ time: nameArr_time[m] });
                  } else {
                    ar1 = false;
                    ar2 = true;
                    hour_Arr2.push({ time: nameArr_time[m] });
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
                  hour_Arr1.push({ time: nameArr_time[m] });
                } else {
                  ar1 = false;
                  ar2 = true;
                  hour_Arr2.push({ time: nameArr_time[m] });
                }
              }
            }
            this.setState({
              hour_time: new_time_hourl,
              final_hour_one: hour_Arr1,
              final_hour_two: hour_Arr2,
            });
          } else {
            this.setState({
              hour_time: obj.result.hourly_time,
              final_hour_one: hour_Arr1,
              final_hour_two: hour_Arr2,
            });
          }
        } else {
          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
      });
  };

  getPerson = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];
    let url = config.baseURL + "api-patient-family-member";

    var data = new FormData();
    data.append("user_id", user_id);

    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {

        if (obj.status == true) {
          this.setState({ person_arr: obj.result });
        } else {
          this.setState({ person_arr: obj.result });
          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
      });
  };

  delete_click = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];
    let url = config.baseURL + "api-delete-patient-family-member";

    var data = new FormData();
    data.append("id", this.state.id);
    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {

        if (obj.status == true) {
          this.getPerson();
        } else {
          msgProvider.showError(obj.message);
          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
      });
  };

  getData(value) {
    if (value.text != null) {
      this.state.symptomText = value.text;
    }
    if (value.audio != null) {
      this.state.symptomsRecording = value.audio;
    }
    if (value.tab != null) {
      this.setState({ indexPosition: value.tab, time_take_data: "" });
    }
    if (value.image != null) {
      this.state.prescriptionsImage = value.image;
    }
  }

  getLabServices = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];

    this.setState({
      name: user_details["first_name"],
      currency_symbol: user_details["currency_symbol"],
    });

    var current = new Date();
    let min =
      current.getMinutes() < 10
        ? "0" + current.getMinutes()
        : current.getMinutes();
    let hour =
      current.getHours() < 10 ? "0" + current.getHours() : current.getHours();
    var timcurrent = hour + ":" + min;
    this.setState({ timcurrent_for_check: timcurrent });
    if (user_details.image != null) {
      this.setState({
        profile_img: user_details["image"],
      });
    }
    let url =
      config.baseURL +
      (this.state.providerId !== "497"
        ? "api-patient-lab-booking-init-details"
        : "api-patient-rclab-booking-init-details");

    var data = new FormData();
    data.append("provider_id", this.state.providerId);
    data.append("lgoin_user_id", user_id);
    data.append("service_type", this.state.providerType);

    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        if (obj.status == true) {
          if (obj.result.task_base_task.length === 0) {
            this.setState({
              indexPosition: 1,
            });
          }
          if (obj.result.task_time != undefined && obj.result.task_time != "") {
            var names = obj.result.task_time;
            var nameArr = names.split(",");
          }
          const new_time_home = [];
          const Arr2 = [];
          const Arr1 = [];
          var ar1 = false;
          var ar2 = true;
          if (obj.result.task_time != undefined && obj.result.task_time != "") {
            for (let l = 0; l < nameArr.length; l++) {
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
                new_time_home.push({ time: nameArr[l], time_status: false });

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
            }
          }

          let real_total = "";
          let real_total_show = "";
          let real_total_final = "";
          let show_real_price = "";
          let vat_price_new = obj.result.vat_price;

          if (vat_price_new != 0) {
            if (obj.result.distance_fare != 0) {
              real_total_show =
                (obj.result.distance_fare / 100) * vat_price_new;
              real_total_final = real_total_show.toFixed(1);
              real_total = parseFloat(
                parseFloat(obj.result.distance_fare) +
                parseFloat(real_total_final)
              ).toFixed(1);
              show_real_price = parseFloat(vat_price_new).toFixed(1);
            } else {
              real_total_show =
                (obj.result.distance_fare / 100) * vat_price_new;
              real_total_final = real_total_show.toFixed(1);
              real_total = real_total_final;
              show_real_price = parseFloat(vat_price_new).toFixed(1);
            }
          } else {
            real_total_show = (obj.result.distance_fare / 100) * vat_price_new;
            real_total_final = real_total_show.toFixed(1);
            real_total = (
              parseFloat(vat_price_new) + parseFloat(obj.result.distance_fare)
            ).toFixed(1);
            show_real_price = parseFloat(vat_price_new).toFixed(1);
          }
          let sun_total = parseFloat(real_total).toFixed(2);

          this.setState({
            subTotal: obj.result.distance_fare,
            vat_price_show_display: real_total_final, //0.0,
            booking_data: obj.result,
            message: obj.message,
            task_base_task: obj.result.task_base_task,
            task_base_task1: obj.result.task_base_task,
            task_time: obj.result.task_time,
            time_Arr: new_time_home,
            vat_price: vat_price_new,
            distance_fare: obj.result.distance_fare,
            final_total_price: sun_total,
            hour_total_price: sun_total,
            vat_percent_used: obj.result.vat_text,
            hour_time: new_time_home,
            vat_price_show: real_total,
            vat_price_show_hourly: real_total_final,
            distance_fare_pass: obj.result.distance_fare,
            final_one: Arr1,
            final_arr2: Arr2,
            final_hour_one: Arr1,
            final_hour_two: Arr2,
            only_vatprice_show: show_real_price,
          });


          if (
            obj.result.hour_base_enable == 0 &&
            obj.result.task_base_enable == 1
          ) {
            this.setState({ display: "hourlybooking" });
          }

          let time_slot = obj.result.task_base_task;
          if (obj.result.task_base_task != null) {
            for (let j = 0; j < obj.result.task_base_task.length; j++) {
              time_slot[j].status = false;
            }
          }

          let hour_task = obj.result.package_base_task;
          if (
            obj.result.package_base_task != null &&
            obj.result.package_base_task != ""
          ) {
            for (let k = 0; k < obj.result.package_base_task.length; k++) {
              hour_task[k].status = false;
            }
          }

          this.setState({
            task_base_task: time_slot,
            hour_base_task: hour_task,
          });
        } else {
          msgProvider.showError(obj.message);
          return false;
        }
      })
      .catch((error) => {
        setTimeout(() => {
          this.setState({ Error_popup: true });
        }, 700);

        consolepro.consolelog("-------- error ------- " + error);
      });
  };

  getDoctorServices = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];

    this.setState({
      name: user_details["first_name"],
      currency_symbol: user_details["currency_symbol"],
    });

    var current = new Date();
    let min =
      current.getMinutes() < 10
        ? "0" + current.getMinutes()
        : current.getMinutes();
    let hour =
      current.getHours() < 10 ? "0" + current.getHours() : current.getHours();
    var timcurrent = hour + ":" + min;
    this.setState({ timcurrent_for_check: timcurrent });
    if (user_details.image != null) {
      this.setState({
        profile_img: user_details["image"],
      });
    }
    let url = config.baseURL + "api-patient-doctor-booking-init-details";

    var data = new FormData();
    data.append("provider_id", this.state.providerId);
    data.append("lgoin_user_id", user_id);
    data.append("service_type", this.state.providerType);

    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        if (obj.status == true) {
          if (
            obj.result.home_visit_time != undefined &&
            obj.result.home_visit_time != ""
          ) {
            var names = obj.result.home_visit_time;
            var nameArr = names.split(",");
          }
          const new_time_home = [];
          const Arr2 = [];
          const Arr1 = [];
          var ar1 = false;
          var ar2 = true;
          if (
            obj.result.home_visit_time != undefined &&
            obj.result.home_visit_time != ""
          ) {
            for (let l = 0; l < nameArr.length; l++) {
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
                new_time_home.push({ time: nameArr[l], time_status: false });


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
            }
          }

          if (
            obj.result.online_task_time != undefined &&
            obj.result.online_task_time != ""
          ) {
            var names = obj.result.online_task_time;
            var nameArr = names.split(",");
          }

          const online_Arr2 = [];
          const online_Arr1 = [];
          const new_time_online = [];
          var online_ar1 = false;
          var online_ar2 = true;
          if (
            obj.result.online_task_time != undefined &&
            obj.result.online_task_time != ""
          ) {
            for (let l = 0; l < nameArr.length; l++) {
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
                new_time_online.push({ time: nameArr[l], time_status: false });
                // if ((l + 2) % 2 == 0) {
                if (!online_ar1) {
                  online_ar1 = true;
                  online_ar2 = false;
                  online_Arr1.push({ time: nameArr[l], time_status: false });
                } else {
                  online_ar1 = false;
                  online_ar2 = true;
                  online_Arr2.push({ time: nameArr[l], time_status: false });
                }
              }
            }
          }

          let onlineSubTotal = "";
          let homeSubTotal = "";
          let real_total = "";
          let real_total_show = "";
          let real_total_final = "";
          let show_real_price = "";
          let vat_price_new = obj.result.vat_price;
          let onlineTotalPrice = "";
          let homeVisitTotalPrice = "";
          let onlineVat = "";
          let homeVat = "";

          if (vat_price_new != 0) {
            if (obj.result.home_visit_time != "") {
              if (obj.result.distance_fare != 0) {
                real_total = "";
                real_total_show = "";
                real_total_final = "";
                show_real_price = "";
                homeSubTotal = parseFloat(
                  Number(obj.result.home_visit_task[0].task_price) +
                  Number(obj.result.distance_fare)
                ).toFixed(1);
                real_total_show =
                  (parseFloat(homeSubTotal + Number(obj.result.distance_fare)) /
                    100) *
                  vat_price_new;
                real_total_final = real_total_show.toFixed(1);

                real_total = parseFloat(
                  Number(homeSubTotal) + Number(real_total_final)
                ).toFixed(1);
                show_real_price = parseFloat(vat_price_new).toFixed(1);
                homeVisitTotalPrice = real_total;
                homeVat = real_total_final;
              }
            }
            if (obj.result.online_task_time != "") {
              onlineSubTotal = "";
              real_total = "";
              real_total_show = "";
              real_total_final = "";
              show_real_price = "";
              onlineSubTotal = parseFloat(
                Number(obj.result.online_base_task[0].task_price)
              ).toFixed(1);
              real_total_show = (onlineSubTotal / 100) * vat_price_new;
              real_total_final = real_total_show.toFixed(1);
              real_total = parseFloat(
                Number(onlineSubTotal) + Number(real_total_final)
              ).toFixed(1);
              show_real_price = parseFloat(vat_price_new).toFixed(1);
              onlineTotalPrice = real_total;
              onlineVat = real_total_final;
            }
            if (this.state.isFromHospital) {
              onlineSubTotal = "";
              real_total = "";
              real_total_show = "";
              real_total_final = "";
              show_real_price = "";
              onlineSubTotal = parseFloat(
                Number(obj.result.online_base_task[0].task_price)
              ).toFixed(1);
              real_total_show = (onlineSubTotal / 100) * vat_price_new;
              real_total_final = real_total_show.toFixed(1);
              real_total = parseFloat(
                Number(onlineSubTotal) + Number(real_total_final)
              ).toFixed(1);
              show_real_price = parseFloat(vat_price_new).toFixed(1);
              onlineTotalPrice = real_total;
              onlineVat = real_total_final;
            }
          } else {
            real_total_show = (obj.result.distance_fare / 100) * vat_price_new;
            real_total_final = real_total_show.toFixed(1);
            real_total = (
              parseFloat(vat_price_new) + parseFloat(obj.result.distance_fare)
            ).toFixed(1);
            show_real_price = parseFloat(vat_price_new).toFixed(1);
          }
          let sun_total = parseFloat(real_total).toFixed(1);

          this.setState({
            onlineSubTotalPrice: onlineSubTotal,
            homeVisitSubTotalPrice: homeSubTotal,
            homeVisitVat: homeVat, //0.0,
            onlineVisitVat: onlineVat, //0.0,
            booking_data: obj.result,
            message: obj.message,

            time_Arr: new_time_home,
            vat_price: vat_price_new,
            distance_fare: obj.result.distance_fare,
            final_total_price: sun_total,
            onlineTaskPrice: onlineTotalPrice,
            homeVisitTaskPrice: homeVisitTotalPrice,
            hour_total_price: sun_total,
            vat_percent_used: obj.result.vat_text,
            hour_time: new_time_online,
            vat_price_show: real_total,
            vat_price_show_hourly: 0.0,
            distance_fare_pass: obj.result.distance_fare,
            final_one: Arr1,
            final_arr2: Arr2,
            final_hour_one: online_Arr1,
            final_hour_two: online_Arr2,
            only_vatprice_show: show_real_price,
          });

          if (
            obj.result.hour_base_enable == 0 &&
            obj.result.task_base_enable == 1
          ) {
            this.setState({ display: "hourlybooking" });
          }

          let time_slot = obj.result.task_base_task;
          if (obj.result.task_base_task != null) {
            for (let j = 0; j < obj.result.task_base_task.length; j++) {
              time_slot[j].status = false;
            }
          }

          let hour_task = obj.result.hour_base_task;
          if (
            obj.result.hour_base_task != null &&
            obj.result.hour_base_task != ""
          ) {
            for (let k = 0; k < obj.result.hour_base_task.length; k++) {
              hour_task[k].status = false;
            }
          }

          this.setState({
            task_base_task: time_slot,
            hour_base_task: hour_task,
          });
        } else {
          msgProvider.showError(obj.message);
          return false;
        }
      })
      .catch((error) => {
        setTimeout(() => {
          this.setState({ Error_popup: true });
        }, 700);

        consolepro.consolelog("-------- error ------- " + error);
      });
  };

  getServices = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];

    this.setState({
      name: user_details["first_name"],
      currency_symbol: user_details["currency_symbol"],
    });

    var current = new Date();
    let min =
      current.getMinutes() < 10
        ? "0" + current.getMinutes()
        : current.getMinutes();
    let hour =
      current.getHours() < 10 ? "0" + current.getHours() : current.getHours();
    var timcurrent = hour + ":" + min;
    this.setState({ timcurrent_for_check: timcurrent });
    if (user_details.image != null) {
      this.setState({
        profile_img: user_details["image"],
      });
    }
    let url = config.baseURL + "api-patient-booking-init-details";

    var data = new FormData();
    data.append("provider_id", this.state.providerId);
    data.append("lgoin_user_id", user_id);
    data.append("service_type", this.state.providerType);

    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {

        if (obj.status == true) {
          if (obj.result.task_time != "") {
            var names = obj.result.task_time;
            var nameArr = names.split(",");
          }

          const new_time_dlot = [];
          const Arr2 = [];
          const Arr1 = [];
          var task_ar1 = false;
          var task_ar2 = true;
          if (obj.result.task_time != "") {
            for (let l = 0; l < nameArr.length; l++) {
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
                new_time_dlot.push({ time: nameArr[l], time_status: false });

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

          if (obj.result.hourly_time != "" && obj.result.hourly_time != null) {
            var names_time = obj.result.hourly_time;
            var nameArr_time = names_time.split(",");
          }

          const hour_Arr2 = [];
          const hour_Arr1 = [];
          const new_time_hourl = [];
          var ar1 = false;
          var ar2 = true;
          if (obj.result.hourly_time != "" && obj.result.hourly_time != null) {
            for (let m = 0; m < nameArr_time.length; m++) {
              const timeStr_hour = nameArr_time[m];

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

                if (!ar1) {
                  ar1 = true;
                  ar2 = false;
                  hour_Arr1.push({ time: nameArr_time[m] });
                } else {
                  ar1 = false;
                  ar2 = true;
                  hour_Arr2.push({ time: nameArr_time[m] });
                }
              }
            }
          }
          let sub_total = "";
          let real_total = "";
          let real_total_show = "";
          let real_total_final = "";
          let show_real_price = "";
          let vat_price_new = obj.result.vat_price;

          if (vat_price_new != 0) {
            if (obj.result.distance_fare != 0) {
              real_total_show =
                (obj.result.distance_fare / 100) * vat_price_new;
              real_total_final = real_total_show.toFixed(1);
              real_total = parseFloat(
                parseFloat(obj.result.distance_fare) +
                parseFloat(real_total_final)
              ).toFixed(1);
              show_real_price = parseFloat(vat_price_new).toFixed(1);
            } else {
              real_total_show =
                (obj.result.distance_fare / 100) * vat_price_new;
              real_total_final = real_total_show.toFixed(1);
              real_total = real_total_final;
              show_real_price = parseFloat(vat_price_new).toFixed(1);
            }
          } else {
            real_total_show = (obj.result.distance_fare / 100) * vat_price_new;
            real_total_final = real_total_show.toFixed(1);
            real_total = (
              parseFloat(vat_price_new) + parseFloat(obj.result.distance_fare)
            ).toFixed(1);
            show_real_price = parseFloat(vat_price_new).toFixed(1);
          }
          let sun_total = parseFloat(real_total).toFixed(2);

          this.setState({
            subTotal: obj.result.distance_fare,
            vat_price_show_display: real_total_final, //0.0,
            booking_data: obj.result,
            message: obj.message,
            task_base_task: obj.result.task_base_task,
            task_base_task1: obj.result.task_base_task,
            task_time: obj.result.task_time,
            time_Arr: new_time_dlot,
            vat_price: vat_price_new,
            distance_fare: obj.result.distance_fare,
            final_total_price: sun_total,
            hour_total_price: sun_total,
            vat_percent_used: obj.result.vat_text,
            hour_time: new_time_hourl,
            vat_price_show: real_total,
            vat_price_show_hourly: real_total_final,
            distance_fare_pass: obj.result.distance_fare,
            final_one: Arr1,
            final_arr2: Arr2,
            final_hour_one: hour_Arr1,
            final_hour_two: hour_Arr2,
            only_vatprice_show: show_real_price,
          });

          if (
            obj.result.hour_base_enable == 0 &&
            obj.result.task_base_enable == 1
          ) {
            this.setState({ display: "hourlybooking" });
          }

          let time_slot = obj.result.task_base_task;
          if (obj.result.task_base_task != null) {
            for (let j = 0; j < obj.result.task_base_task.length; j++) {
              time_slot[j].status = false;
            }
          }

          let hour_task = obj.result.hour_base_task;
          if (
            obj.result.hour_base_task != null &&
            obj.result.hour_base_task != ""
          ) {
            for (let k = 0; k < obj.result.hour_base_task.length; k++) {
              hour_task[k].status = false;
            }
          }

          this.setState({
            task_base_task: time_slot,
            hour_base_task: hour_task,
          });
        } else {
          msgProvider.showError(obj.message);
          return false;
        }
      })
      .catch((error) => {
        setTimeout(() => {
          this.setState({ Error_popup: true });
        }, 700);

        consolepro.consolelog("-------- error ------- " + error);
      });
  };

  submitButtonForDoctor = async () => {
    Keyboard.dismiss();
    let subTotalPrice =
      this.state.indexPosition === 0
        ? this.state.onlineSubTotalPrice
        : this.state.homeVisitSubTotalPrice;
    let vatPrice =
      this.state.indexPosition === 0
        ? this.state.onlineVisitVat
        : this.state.homeVisitVat;
    let totalPrice =
      this.state.indexPosition === 0
        ? this.state.onlineTaskPrice
        : this.state.homeVisitTaskPrice;
    let distance =
      this.state.indexPosition === 0 ? "" : this.state.distance_fare_pass;
    let taskType =
      this.state.indexPosition === 0 ? "online_task" : "home_visit";
    let appointmentType = this.state.indexPosition === 0 ? "online" : "offline";


    if (this.state.time_take_data.length <= 0) {
      msgProvider.showError(msgText.EmptyTime[config.language]);
      return false;
    }

    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];

    let url = config.baseURL + "api-patient-insert-cart";
    var data = new FormData();

    data.append(
      "hospital_id",
      this.state.isFromHospital ? this.props.route.params.hospitalId : ""
    );
    data.append("service_type", this.state.providerType);
    data.append("login_user_id", user_id);
    data.append("currency_symbol", this.state.currency_symbol);
    data.append("family_member_id", this.state.family_member_id);
    data.append("provider_id", this.state.providerId);
    data.append("task_id", this.state.final_data);
    data.append("task_price", this.state.set_price);
    data.append("task_type", taskType);
    data.append("from_date", this.state.set_date);
    data.append("from_time", this.state.time_take_data);
    data.append("appointment_type", appointmentType);
    data.append("vat_percent_used", "" + this.state.vat_price);
    data.append("task_price_total", this.state.set_price);
    data.append("vat_price", vatPrice);
    data.append("distance_fare", distance);
    data.append("sub_total_price", subTotalPrice);
    data.append("total_price", totalPrice);
    data.append("symptom_text", this.state.symptomText);

    if (this.state.prescriptionsImage != "") {
      data.append("upload_prescription", {
        uri: this.state.prescriptionsImage,
        type: "image/jpg",
        name: this.state.prescriptionsImage,
      });
    }

    if (this.state.symptomsRecording != "") {
      data.append("symptom_recording", {
        uri: this.state.symptomsRecording,
        type: "audio/m4a",
        name: this.state.symptomsRecording,
      });
    }

    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        if (obj.status == true) {

          setTimeout(() => {
            this.props.navigation.navigate("Cart");
          }, 700);
        } else {
          // if (obj.active_status == msgTitle.deactivate[config.language] || obj.msg[config.language] == msgTitle.usererr[config.language]) {
          //   usernotfound.loginFirst(this.props, obj.msg[config.language])
          // } else {
          setTimeout(() => {
            msgProvider.alert("", obj.message, false);
          }, 700);
          // }
          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
        this.setState({ loading: false });
      });
  };

  submit_btn = async () => {
    Keyboard.dismiss();
    if (this.state.providerType === "lab") {
      if (this.state.indexPosition === 0) {
        if (this.state.select_task.length <= 0) {
          msgProvider.showError(msgText.EmptyTask[config.language]);
          return false;
        }
      } else {
        if (this.state.hour_id.length <= 0) {
          msgProvider.showError(msgText.EmptyTask[config.language]);
          return false;
        }
      }
    } else {
      if (this.state.select_task.length <= 0) {
        msgProvider.showError(msgText.EmptyTask[config.language]);
        return false;
      }
    }

    if (this.state.time_take_data.length <= 0) {
      msgProvider.showError(msgText.EmptyTime[config.language]);
      return false;
    }

    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];

    let url = config.baseURL + "api-patient-insert-cart";
    var data = new FormData();



    if (this.state.providerType === "lab") {
      data.append("hospital_id", this.state.booking_data.hospital_id);
    }
    data.append("service_type", this.state.providerType);
    data.append("login_user_id", user_id);
    data.append("currency_symbol", this.state.currency_symbol);
    data.append("family_member_id", this.state.family_member_id);
    data.append("provider_id", this.state.providerId);
    data.append("task_id", this.state.final_data);
    data.append("task_price", this.state.set_price);
    data.append("task_type", "task_base");
    data.append("from_date", this.state.set_date);
    data.append("from_time", this.state.time_take_data);
    data.append("appointment_type", "online");
    data.append("vat_percent_used", this.state.vat_price);

    data.append("vat_price", this.state.vat_price_show);
    data.append("distance_fare", this.state.distance_fare_pass);
    data.append("task_price_total", this.state.total_price_show);
    data.append("sub_total_price", this.state.subTotal);
    data.append("total_price", this.state.final_total_price);

    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        if (obj.status == true) {
          // msgProvider.toast(msgText.sucess_message_login[config.language])
          setTimeout(() => {
            this.props.navigation.navigate("Cart");
          }, 700);
        } else {
          // if (obj.active_status == msgTitle.deactivate[config.language] || obj.msg[config.language] == msgTitle.usererr[config.language]) {
          //   usernotfound.loginFirst(this.props, obj.msg[config.language])
          // } else {
          setTimeout(() => {
            msgProvider.alert("", obj.message, false);
          }, 700);
          // }
          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
        this.setState({ loading: false });
      });
  };

  submit_btn_hourly = async () => {
    Keyboard.dismiss();
    if (this.state.hour_id.length <= 0) {
      msgProvider.showError(msgText.EmptyTask[config.language]);
      return false;
    }

    if (this.state.time_take_data_hour.length <= 0) {
      msgProvider.showError(msgText.EmptyTime[config.language]);
      return false;
    }

    var taskBase = this.state.providerType === "lab" ? "package_base" : "hour_base";

    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];

    let url = config.baseURL + "api-patient-insert-cart";
    var data = new FormData();

    if (this.state.providerType === "lab") {
      data.append("hospital_id", this.state.booking_data.hospital_id);
    }
    data.append("service_type", this.state.providerType);
    data.append("login_user_id", user_id);
    data.append("currency_symbol", this.state.currency_symbol);
    data.append("family_member_id", this.state.family_member_id);
    data.append("provider_id", this.state.providerId);
    data.append("task_id", this.state.hour_id);
    data.append("task_price", this.state.hour_price);
    data.append("task_type", taskBase);
    data.append("from_date", this.state.set_date);
    data.append("from_time", this.state.time_take_data_hour);
    data.append("appointment_type", "online");
    data.append("vat_percent_used", this.state.vat_price);

    data.append("vat_price", this.state.vat_price_show_hourly);
    data.append("distance_fare", this.state.distance_fare_pass);
    data.append("task_price_total", this.state.hour_total_amount);
    data.append("sub_total_price", this.state.subTotal);
    data.append("total_price", this.state.hour_total_price);

    //return false
    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        if (obj.status == true) {

          // msgProvider.toast(msgText.sucess_message_login[config.language])
          setTimeout(() => {
            this.props.navigation.navigate("Cart");
          }, 700);
        } else {
          // if (obj.active_status == msgTitle.deactivate[config.language] || obj.msg[config.language] == msgTitle.usererr[config.language]) {
          //   usernotfound.loginFirst(this.props, obj.msg[config.language])
          // } else {
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

  searchFilterFunction = (text) => {
    this.setState({ name_new: text });

    //  let task_base_task1=this.state.task_base_task
    let data1 = this.state.task_base_task1;
    if (data1 != "") {
      const newData = data1.filter((item) => {
        //applying filter for the inserted text in search bar

        const textData = text.toLowerCase();
        return item.name.toLowerCase().indexOf(textData) >= 0;
      });
      if (newData.length > 0) {
        this.setState({ task_base_task: newData });
      } else if (newData.length <= 0) {
        this.setState({ task_base_task: "" });
      }
    }
  };

  check_all = (item, index) => {
    let data = this.state.task_base_task;
    let comma_arr = [];
    let price_arr = [];
    if (data[index].status == true) {
      data[index].status = false;
    } else {
      if (data[index].status == false) {
        data[index].status = true;
      }
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].status == true) {
        comma_arr.push(data[i].id);
        price_arr.push(data[i].price);
      }
    }

    let result = price_arr.map((i) => Number(i));
    let sum = 0;

    for (let k = 0; k < result.length; k++) {
      sum += result[k];
    }
    let subTotal = "";
    let real_total = "";
    let real_total_show = "";
    let real_total_final = "";
    let show_total_price;


    let vat_sum_per =
      parseFloat(sum) + parseFloat(this.state.distance_fare_pass); //sum
    subTotal = vat_sum_per.toFixed(1);

    if (
      this.state.only_vatprice_show == 0 ||
      this.state.only_vatprice_show == "0.0"
    ) {
      real_total = parseFloat(this.state.vat_price_show_display).toFixed(1);
      show_total_price = parseFloat(
        parseInt(this.state.distance_fare_pass) + sum
      ).toFixed(1);
    } else {
      real_total_show = (vat_sum_per / 100) * this.state.vat_price;
      real_total_final = real_total_show.toFixed(2);
      real_total = real_total_final;
      show_total_price = parseFloat(
        parseInt(this.state.distance_fare_pass) + parseFloat(real_total) + sum
      ).toFixed(2);
    }

    let final_data = comma_arr.toString();
    let set_price = price_arr.toString();
    let total_sum = parseInt(sum);

    this.setState({
      subTotal: subTotal,
      task_base_task: data,
      new_task_arr: data,
      select_task: comma_arr,
      final_data: final_data,
      set_price: set_price,
      sum_arr: price_arr,
      total_price_show: total_sum,
      vat_price_show: real_total,
      vat_price_show_display: real_total,
      distance_fare: show_total_price,
      final_total_price: show_total_price,
    });
  };

  hourbooking = (item, index) => {
    let data = this.state.hour_base_task;

    for (let i = 0; i < data.length; i++) {
      if (i == index) {
        data[i].status = true;
      } else {
        data[i].status = false;
      }
    }

    let prize = Number(item.price);
    let real_total = "";
    let real_total_show = "";
    let real_total_final = "";
    let show_total_price;
    let hour_add = "";
    let subTotal = "";
    if (
      this.state.only_vatprice_show == 0 ||
      this.state.only_vatprice_show == 0.0
    ) {
      show_total_price = this.state.vat_price_show;
      subTotal = parseFloat(
        parseInt(this.state.distance_fare_pass) + parseInt(prize)
      ).toFixed(1);
      hour_add = parseFloat(
        parseInt(this.state.distance_fare_pass) +
        parseInt(prize) +
        parseFloat(this.state.vat_price_show)
      ).toFixed(1);
    } else {
      let vat_sum_per = prize;
      subTotal = parseFloat(
        parseInt(this.state.distance_fare_pass) + parseInt(vat_sum_per)
      ).toFixed(1);
      real_total_show = (subTotal / 100) * this.state.vat_price;
      real_total_final = real_total_show.toFixed(2);
      real_total = Number(real_total_final);
      show_total_price = real_total;
      hour_add = parseFloat(
        parseInt(this.state.distance_fare_pass) +
        parseInt(prize) +
        parseFloat(show_total_price)
      ).toFixed(1);
    }

    this.setState({
      hour_base_task: data,
      hour_base_task_new: data,
      hour_total_amount: prize,
      vat_price_show_hourly: show_total_price,
      hour_total_price: hour_add,
      subTotal: subTotal,
    });
  };

  checkDate = (item, index) => {
    let data = this.state.date_array;

    for (let i = 0; i < data.length; i++) {
      if (i == index) {
        data[i].tick = 1;
      } else {
        data[i].tick = 0;
      }
    }
    this.setState({ date_array: data });
  };

  time_tick = (item, index) => {
    let data = this.state.time_Arr;

    for (let i = 0; i < data.length; i++) {
      if (i == index) {
        data[i].time_status = true;
      } else {
        data[i].time_status = false;
      }
    }
    this.setState({ time_Arr: data });
  };

  hour_time_tick = (item, index) => {
    let data = this.state.hour_time;

    for (let i = 0; i < data.length; i++) {
      if (i == index) {
        data[i].time_status = true;
      } else {
        data[i].time_status = false;
      }
    }
    this.setState({ hour_time: data });
  };

  check_all_false = (item, index) => {
    let price_arr = [];
    let data = this.state.new_task_arr;

    if (data[index].status == true) {
      data[index].status = false;
    } else {
      if (data[index].status == false) {
        data[index].status = true;
      }
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].status == false) {
        price_arr.push(data[i].price);
      }
    }

    let result = price_arr.map((i) => Number(i));
    var sum = 0;

    for (let k = 0; k < result.length; k++) {
      sum -= result[k];
    }
    this.setState({
      task_base_task: data,
      new_task_arr: data,
      total_price_show: sum,
    });
  };

  render() {
    const { providerType } = this.state
    if (this.state.booking_data != "" && this.state.booking_data != null) {

      var item = this.state.booking_data;
      if (this.state.providerType === "doctor") {
        this.state.set_task =
          this.state.indexPosition === 0
            ? item.online_base_text
            : item.home_visit_text;

        this.state.final_data =
          this.state.indexPosition === 0
            ? item.online_base_task[0].id
            : item.home_visit_task[0].id;

        this.state.set_price =
          this.state.indexPosition === 0
            ? item.online_base_task[0].task_price
            : item.home_visit_task[0].task_price;
      }


      return (
        <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>

          <ScreenHeader
            title={Lang_chg.Booking[config.language]}
            navigation={this.props.navigation}
            onBackPress={() => this.props.navigation.pop()}
            leftIcon={leftArrow}
            rightIcon={Notification}
          />

          <ScrollView
            style={Styles.container2}
            contentContainerStyle={{ paddingBottom: (windowWidth * 30) / 100 }}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
          >
            {/* -------------User Info------------- */}

            <View style={styles.infoContainer}>
              <View
                style={{
                  flexDirection: "row",
                  width: '100%',
                  paddingHorizontal: s(11),
                }}>
                {/* image and Name */}

                <View style={{ width: "30%", }}>
                  {
                    (item.image == "NA" || item.image == null || item.image == "") ?
                      <SvgXml xml={dummyUser} height={s(75)} width={s(75)} style={{ borderColor: Colors.Border }} />
                      :
                      <Image
                        source={{ uri: config.img_url3 + item.image }}
                        style={{
                          borderWidth: 2,
                          borderColor: Colors.Border,
                          width: s(75),
                          height: s(75),
                          borderRadius: s(75),
                        }}
                      />
                  }
                </View>
                <View
                  style={{
                    width: "70%",
                    alignSelf: "center",
                    height: '100%',
                    paddingTop: vs(3)
                  }} >
                  <Text
                    style={{
                      fontFamily: Font.Medium,
                      fontSize: Font.xxlarge,
                      textAlign: config.textRotate,
                      color: Colors.detailTitles
                    }}>
                    {item.provider_name}
                  </Text>
                  {
                    providerType != 'lab' &&
                    <Text
                      style={{
                        fontFamily: Font.Regular,
                        fontSize: Font.small,
                        textAlign: config.textRotate,
                        color: Colors.lightGrey,
                        marginTop: vs(2)
                      }}>
                      {item.qualification}
                    </Text>
                  }
                  <Text
                    style={{
                      fontFamily: Font.Medium,
                      fontSize: Font.small,
                      textAlign: config.textRotate,
                      color: Colors.Blue,
                      marginTop: vs(5)
                    }}>
                    {providerType === 'lab' ? item?.iso_text : item.speciality}
                  </Text>
                </View>
              </View>

              {/* -------------------Experience Container-------------------- */}
              <View style={styles.experienceContainer}>
                <View style={{ flex: 1, borderEndWidth: 1, borderEndColor: Colors.backgroundcolor }}>
                  <Text
                    style={{
                      fontFamily: Font.Regular,
                      fontSize: Font.small,
                      textAlign: config.textRotate,
                      color: Colors.lightGrey,
                      marginTop: vs(2)
                    }}>
                    {providerType === 'lab' ? Lang_chg.ESTABLISHED[config.language] : Lang_chg.Experience[config.language]}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Font.Medium,
                      fontSize: Font.xlarge,
                      textAlign: config.textRotate,
                      color: Colors.detailTitles,
                      marginTop: vs(5)
                    }}>
                    {item.experience ? item.experience : '-'}
                  </Text>
                </View>
                <View style={{ flex: 1, borderEndWidth: 1, borderEndColor: Colors.backgroundcolor }}>
                  <Text
                    style={{
                      fontFamily: Font.Regular,
                      fontSize: Font.small,
                      textAlign: config.textRotate,
                      color: Colors.lightGrey,
                      marginTop: vs(2),
                      paddingHorizontal: s(15)
                    }}>
                    {Lang_chg.Bookings[config.language]}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Font.Medium,
                      fontSize: Font.xlarge,
                      textAlign: config.textRotate,
                      color: Colors.detailTitles,
                      marginTop: vs(5),
                      paddingHorizontal: s(15)
                    }}>
                    {item.booking_count ? item.booking_count : '-'}
                  </Text>
                </View>
                <View style={{ flex: 1, }}>
                  <Text
                    style={{
                      fontFamily: Font.Regular,
                      fontSize: Font.small,
                      textAlign: config.textRotate,
                      color: Colors.lightGrey,
                      marginTop: vs(2),
                      paddingHorizontal: s(15)
                    }}>
                    {Lang_chg.Rating[config.language]}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(15), marginTop: vs(5), }}>
                    <SvgXml xml={GoldStar} height={s(14)} width={s(14)} style={{}} />
                    <Text
                      style={{
                        fontFamily: Font.Medium,
                        fontSize: Font.xlarge,
                        textAlign: config.textRotate,
                        color: Colors.detailTitles,
                        marginLeft: s(5)
                      }}>
                      {item.avg_rating ? `${item.avg_rating}.0` : 'NA'}
                    </Text>
                  </View>

                </View>
              </View>

              <View style={{ width: '93%', alignSelf: 'center', height: 1.5, backgroundColor: Colors.backgroundcolor }}></View>

              {/* -------------------Desc Container-------------------- */}

              {
                item.description &&
                <View style={styles.descContainer}>
                  <Text
                    style={{
                      fontFamily: Font.Regular,
                      fontSize: Font.xsmall,
                      textAlign: config.textRotate,
                      color: Colors.detailTitles,
                    }}>
                    {item.description}
                  </Text>
                </View>
              }

            </View>

            {/* ---------------Main------------- */}

            {/* Patient flatlist */}
            {/* {this.state.providerType !== "lab" && (
              <View
                style={{
                  backgroundColor: Colors.White,
                  marginTop: vs(7),
                  flexDirection: "row",
                  paddingVertical: vs(9),
                  paddingLeft: s(11),
                  width: windowWidth
                }}>
                <View style={{ flexDirection: 'row', width: '85%' }}>
                  <View style={{ width: '22%' }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          active_status: true,
                          family_member_id: 0,
                        });
                      }}
                      style={[
                        {
                          width: (windowWidth * 20) / 100,
                          height: (windowWidth * 24) / 100,
                          borderRadius: (windowWidth * 2) / 100,
                          paddingVertical: (windowWidth * 3) / 100,
                          borderColor: 'pink',
                          justifyContent: "center",
                        },
                        this.state.active_status == true
                          ? { backgroundColor: Colors.appointmentdetaillightblue }
                          : { backgroundColor: "#fff" },
                      ]}>
                      <Image
                        source={
                          this.state.profile_img == "NA" ||
                            this.state.profile_img == null
                            ? localimag.user_img
                            : { uri: config.img_url3 + this.state.profile_img }
                        }
                        style={{
                          alignSelf: "center",
                          width: (windowWidth * 16) / 100,
                          height: (windowWidth * 14) / 100,
                          borderRadius: (windowWidth * 2) / 100,
                          borderColor: Colors.theme_color,
                          marginTop: (windowWidth * 2) / 100,
                        }}
                      />
                      <Text
                        style={{
                          alignSelf: "center",
                          fontFamily: Font.Medium,
                          paddingBottom: (windowWidth * 2) / 100,
                          marginTop: (windowWidth * 2) / 100,
                          fontSize: (windowWidth * 3) / 100,
                          paddingHorizontal: (windowWidth * 0.5) / 100,
                        }}
                        numberOfLines={1}
                      >
                        {this.state.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      width: "78%",
                      alignSelf: "center",
                      marginLeft: (windowWidth * 3) / 100,
                      alignItems: "flex-start",
                    }}>
                    <FlatList
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      data={this.state.person_arr}
                      renderItem={({ item, index }) => {
                        if (
                          this.state.person_arr != "" ||
                          this.state.person_arr != null
                        ) {
                          return (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({
                                  family_member_id: item.id,
                                  active_status: false,
                                });
                              }}
                              style={[
                                {
                                  width: (windowWidth * 20) / 100,
                                  height: (windowWidth * 24) / 100,
                                  borderRadius: (windowWidth * 2) / 100,
                                  paddingVertical: (windowWidth * 3) / 100,
                                  borderColor: Colors.theme_color,
                                  justifyContent: "center",
                                  paddingHorizontal: (windowWidth * 0.2) / 100,
                                  marginRight: (windowWidth * 1) / 100,
                                },
                                this.state.family_member_id == item.id
                                  ? { backgroundColor: "#d1e9f6" }
                                  : { backgroundColor: "#fff" },
                              ]}
                            >
                              <View
                                style={{
                                  borderWidth: 2,
                                  borderColor: Colors.gainsboro,
                                  width: (windowWidth * 14) / 100,
                                  alignItems: "center",
                                  marginLeft: (windowWidth * 2.5) / 100,
                                  borderRadius: (windowWidth * 3) / 100,
                                  alignItems: "center",
                                  marginTop: (windowWidth * 2) / 100,
                                }}
                              >
                                <ImageBackground
                                  imageStyle={{
                                    borderRadius: (windowWidth * 2.5) / 100,
                                  }}
                                  source={
                                    item.image == "NA" || item.image == null
                                      ? localimag.user_img
                                      : { uri: config.img_url3 + item.image }
                                  }
                                  style={{
                                    alignSelf: "center",
                                    width: (windowWidth * 13) / 100,
                                    height: (windowWidth * 13) / 100,
                                    alignSelf: "center",
                                  }}
                                >
                                  <TouchableOpacity
                                    onPress={() => {
                                      this.setState({ modalVisible3: true }),
                                        this.setState({
                                          id: item.id,
                                          first_name: item.first_name,
                                          last_name: item.last_name,
                                        });
                                    }}
                                  >
                                    <Image
                                      style={{
                                        width: 20,
                                        height: 20,
                                        alignSelf: "flex-end",
                                        top: 0,
                                      }}
                                      source={localimag.crossimg}
                                    />
                                  </TouchableOpacity>
                                </ImageBackground>
                              </View>
                              <Text
                                style={{
                                  fontFamily: Font.Light,
                                  paddingBottom: (windowWidth * 2) / 100,
                                  textAlign: "center",
                                  marginTop: (windowWidth * 1.2) / 100,
                                  fontSize: (windowWidth * 3.2) / 100,
                                }}
                                numberOfLines={1}
                              >
                                {item.first_name}
                              </Text>
                            </TouchableOpacity>
                          );
                        }
                      }}
                    />
                  </View>
                </View>


                <View style={{ width: '15%', }}>

                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate("AddPatient");
                    }}
                    style={{
                      width: '100%',
                      height: vs(80),
                      borderTopLeftRadius: 10,
                      borderBottomLeftRadius: 10,
                      justifyContent: "center",
                      alignItems: 'center',
                      backgroundColor: Colors.appointmentdetaillightblue,
                    }} >
                    <View style={{
                      height: s(30),
                      width: s(30),
                      borderRadius: s(100),
                      backgroundColor: Colors.Theme,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <Image
                        resizeMode="contain"
                        source={Icons.Add}
                        style={{
                          width: s(15),
                          height: s(15),
                          tintColor: Colors.White,
                        }}
                      />
                    </View>
                    <Text
                      style={{
                        fontFamily: Font.Regular,
                        fontSize: (windowWidth * 3) / 100,
                        textAlign: "center",
                        marginTop: (windowWidth * 2) / 100,
                      }}>
                      {Lang_chg.Add[config.language]}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )} */}

            {this.state.providerType === "doctor" && (
              <DoctorSymptomsAppointment
                navigation={this.props.navigation}
                indexPosition={this.props.route.params.indexPosition}
                isFromHospital={this.props.route.params.isFromHospital}
                sendData={this.getData.bind(this)}
              />
            )}

            {this.state.providerType === "lab" && (
              <LabAppointment
                navigation={this.props.navigation}
                indexPosition={this.props.route.params.indexPosition}
                data={item}
                sendData={this.getData.bind(this)}
              />
            )}

            {this.state.providerType === "lab" ? (
              <View>
                {this.state.indexPosition === 0 && (
                  <View
                    style={{
                      width: "100%",
                      alignSelf: "center",
                      backgroundColor: Colors.White,
                      paddingHorizontal: s(11)
                    }}
                  >
                    <View
                      style={{
                        width: "100%",
                        backgroundColor: Colors.White,
                        right: 0,
                        alignSelf: "flex-end",
                      }}
                    >
                      <FlatList
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={this.state.new_task_arr}
                        renderItem={({ item, index }) => {
                          if (this.state.new_task_arr != "") {
                            return (
                              <View style={{ alignSelf: "center" }}>
                                {item.status == true && (
                                  <View
                                    style={{
                                      backgroundColor: Colors.theme_color,
                                      paddingVertical: (windowWidth * 0.8) / 100,
                                      flexDirection: "row",
                                      paddingHorizontal:
                                        (windowWidth * 1.5) / 100,
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      borderRadius: (windowWidth * 1) / 100,
                                      marginRight: (windowWidth * 2) / 100,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        color: Colors.White,
                                        fontSize: Font.textsize,
                                        fontFamily: Font.Light,
                                      }}
                                    >
                                      {item.name}
                                    </Text>
                                    <TouchableOpacity
                                      onPress={() => {
                                        this.check_all_false(item, index);
                                      }}
                                    >
                                      <Image
                                        source={Icons.cross2}
                                        style={{
                                          alignSelf: "center",
                                          width: (windowWidth * 2) / 100,
                                          height: (windowWidth * 2) / 100,
                                          marginLeft: (windowWidth * 3.5) / 100,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>

                                  // <View
                                  //   style={[
                                  //     {
                                  //       borderRadius: 10,
                                  //       width: s(135),
                                  //       // height: vs(150),
                                  //       backgroundColor: Colors.Blue,
                                  //       borderColor: Colors.Border,
                                  //       borderWidth: 1,
                                  //       paddingHorizontal: s(6),
                                  //       paddingVertical: vs(7)
                                  //     }]}>
                                  //   <Text
                                  //     style={{
                                  //       fontFamily: Font.Regular,
                                  //       textAlign: config.textRotate,
                                  //       fontSize: Font.small,
                                  //       color: Colors.detailTitles
                                  //     }}>{item?.name}</Text>

                                  //   <Text
                                  //     style={{
                                  //       fontFamily: Font.Regular,
                                  //       textAlign: config.textRotate,
                                  //       fontSize: Font.small,
                                  //       color: Colors.Blue,
                                  //       marginTop: vs(5)
                                  //     }}>{item?.iso_certificate}</Text>


                                  //   <View style={{ width: '92%', height: 1.5, backgroundColor: Colors.backgroundcolor, marginVertical: vs(10), alignSelf: 'center' }}></View>

                                  //   <Text
                                  //     style={{
                                  //       paddingVertical: vs(3),
                                  //       fontFamily: Font.Regular,
                                  //       textAlign: config.textRotate,
                                  //       color: Colors.Green,
                                  //       fontSize: Font.small,
                                  //     }}
                                  //   >
                                  //     {item.dis_off}
                                  //   </Text>

                                  //   <Text
                                  //     style={{
                                  //       fontFamily: Font.Regular,
                                  //       textAlign: config.textRotate,
                                  //       fontSize: Font.small,
                                  //       textDecorationLine: "line-through",
                                  //       textDecorationStyle: "solid",
                                  //       color: Colors.Black
                                  //     }}
                                  //   >
                                  //     {item.maxprice}
                                  //   </Text>


                                  //   <View
                                  //     style={{
                                  //       paddingVertical: (windowWidth * 2) / 100,
                                  //       flexDirection: "row",
                                  //       justifyContent: "space-between",
                                  //       alignItem: "center",
                                  //     }}>
                                  //     <Text
                                  //       style={{
                                  //         textAlign: config.textRotate,
                                  //         fontFamily: Font.Medium,
                                  //         fontSize: Font.medium,
                                  //       }}>
                                  //       {item.price}
                                  //     </Text>

                                  //     <Text
                                  //       onPress={() => {
                                  //         this.props.navigation.navigate(
                                  //           "Booking",
                                  //           {
                                  //             providerType: providerType,
                                  //             nurse_id: providerId,
                                  //             display: "packageBooking",
                                  //             indexPosition: 1,
                                  //           }
                                  //         );
                                  //       }}
                                  //       style={{
                                  //         fontFamily: Font.SemiBold,
                                  //         fontSize: Font.medium,
                                  //         color: Colors.Theme,
                                  //         textTransform: "uppercase",
                                  //       }}
                                  //     >
                                  //       {Lang_chg.Book[config.language]}
                                  //     </Text>
                                  //   </View>
                                  // </View>
                                )}
                              </View>
                            );
                          }
                        }}
                      />
                    </View>

                    <View
                      style={{
                        width: "100%",
                        alignSelf: "center",
                        backgroundColor: Colors.tab_background_color,
                        alignItems: "center",
                        marginTop: vs(7),
                      }}
                    >
                      <View
                        style={{
                          width: "98%",
                          alignSelf: "center",
                          flexDirection: "row",
                        }}
                      >
                        <TextInput
                          ref={(text) => {
                            this.textdata = text;
                          }}
                          maxLength={50}
                          onChangeText={(text) => {
                            this.searchFilterFunction(text);
                          }}
                          returnKeyLabel="done"
                          returnKeyType="done"
                          onSubmitEditing={() => {
                            Keyboard.dismiss();
                          }}
                          style={{
                            fontSize: (windowWidth * 4) / 100,
                            fontFamily: Font.ques_fontfamily,
                            color: "#8F98A7",
                            width: "90%",
                            paddingVertical: (windowWidth * 3.5) / 100,
                            textAlign: config.textalign,
                          }}
                          placeholderTextColor={"#8F98A7"}
                          placeholder={Lang_chg.SearchTests[config.language]}
                        />

                        <View style={{ width: "10%", alignSelf: "center" }}>
                          <Image
                            style={{
                              width: (windowWidth * 4) / 100,
                              height: (windowWidth * 4) / 100,
                              tintColor: "#8F98A7",
                              alignSelf: "center",
                            }}
                            source={localimag.search2}
                          />
                        </View>
                      </View>
                    </View>

                    {this.state.task_base_task != "" &&
                      this.state.task_base_task != null && (
                        <View
                          style={[
                            {
                              width: "100%",
                              alignSelf: "center",
                              marginTop: (windowWidth * 2) / 100,
                            },
                            this.state.task_base_task.length >= 7
                              ? { height: 240 }
                              : null,
                          ]} >
                          <FlatList
                            data={this.state.task_base_task}
                            scrollEnabled={true}
                            nestedScrollEnabled={true}
                            renderItem={({ item, index }) => {
                              if (this.state.task_base_task != "") {
                                return (
                                  <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => {
                                      this.check_all(item, index);
                                    }}
                                    style={{
                                      alignItems: "center",
                                      width: "100%",
                                      alignSelf: "center",
                                      backgroundColor: "#F8F8F8",
                                      paddingVertical: (windowWidth * 1.7) / 100,
                                      flexDirection: "row",
                                      marginTop: (windowWidth * 0.3) / 100,
                                    }}
                                  >
                                    <View
                                      style={{
                                        alignSelf: "center",
                                        width: "11%",
                                      }}
                                    >
                                      {item.status == true ? (
                                        // <Image
                                        //   style={{
                                        //     width: (windowWidth * 5) / 100,
                                        //     height: (windowWidth * 5) / 100,
                                        //     borderRadius:
                                        //       (windowWidth * 0.4) / 100,
                                        //     marginRight: (windowWidth * 2) / 100,
                                        //     marginLeft: (windowWidth * 3) / 100,
                                        //     resizeMode: "contain",
                                        //     alignSelf: "flex-start",
                                        //   }}
                                        //   source={localimag.remembertick}
                                        // />
                                        null
                                      ) : (
                                        <Image
                                          style={{
                                            width: (windowWidth * 5) / 100,
                                            height: (windowWidth * 5) / 100,
                                            borderRadius:
                                              (windowWidth * 0.4) / 100,
                                            marginRight: (windowWidth * 2) / 100,
                                            marginLeft: (windowWidth * 3) / 100,
                                            resizeMode: "contain",
                                            alignSelf: "flex-start",
                                          }}
                                          source={require("../icons/graycheckbox.png")}
                                        />
                                      )}
                                    </View>
                                    <Text
                                      style={{
                                        width: "59%",
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
                                        width: "25%",
                                        fontSize: (windowWidth * 3.6) / 100,
                                        fontFamily: Font.Regular,
                                        color: "#000",

                                        textAlign: "right",
                                      }}
                                    >
                                      {item.price}{" "}
                                      {this.state.currency_symbol}
                                    </Text>
                                  </TouchableOpacity>
                                );
                              }
                            }}
                          />
                        </View>
                      )}
                  </View>
                )}
                {this.state.indexPosition === 1 && (
                  <View
                    style={{
                      width: "100%",
                      backgroundColor: Colors.White,
                      paddingHorizontal: s(11),
                      paddingVertical: vs(9),
                    }}>
                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      horizontal={true}
                      data={item.package_base_task}
                      renderItem={({ item, index }) => {
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              this.hourbooking(item, index),
                                this.getLabTimeDate(),
                                this.setState({
                                  hour_id: item.pid,
                                  hour_price: item.price,
                                  time_take_data_hour: "",
                                });
                            }}
                            style={[
                              {
                                borderRadius: 10,
                                width: (windowWidth * 40) / 100,
                                backgroundColor: Colors.White,
                              },
                              item.status == true
                                ? {
                                  borderColor: Colors.Border,
                                  borderWidth: 1,
                                }
                                : { borderColor: Colors.Border, borderWidth: 1 },
                            ]}
                          >
                            <Text
                              style={{
                                width: "100%",
                                paddingVertical: (windowWidth * 1.5) / 100,
                                paddingHorizontal: (windowWidth * 2) / 100,
                                color: Colors.theme_color,
                                fontFamily: Font.Medium,
                                fontSize: (windowWidth * 3.5) / 100,
                                textAlign: "left",
                              }}
                            >
                              {item.name}
                            </Text>

                            <Text
                              style={{
                                paddingVertical: (windowWidth * 2) / 100,
                                paddingHorizontal: (windowWidth * 2) / 100,
                                fontFamily: Font.Regular,
                                textAlign: "left",
                                color: Colors.tablightcolo,
                                fontSize: Font.sregulartext_size,
                              }}
                            >
                              {item.test_count}
                            </Text>
                            <View
                              style={{
                                width: "90%",
                                alignSelf: "center",
                                backgroundColor: Colors.backgroundcolor,
                                height: 1.5,
                                marginTop: (windowWidth * 1) / 100,
                              }}
                            />
                            <Text
                              style={{
                                paddingVertical: (windowWidth * 2) / 100,
                                paddingHorizontal: (windowWidth * 2) / 100,
                                textAlign: config.textalign,
                                fontFamily: Font.Medium,
                                fontSize: (windowWidth * 4) / 100,
                              }}
                            >
                              {item.price}
                            </Text>
                          </TouchableOpacity>
                        );
                      }}
                    />
                  </View>
                )}
                <View
                  style={{
                    width: "100%",
                    marginTop: vs(7),
                    marginBottom: (windowWidth * 1.5) / 100,
                    backgroundColor: "#fff",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: "93%",
                      alignSelf: "center",
                      paddingTop: (windowWidth * 4) / 100,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Font.Medium,
                        fontSize: Font.name,
                        width: "65%",
                        textAlign: config.textRotate,
                        fontSize: (windowWidth * 3.5) / 100,
                      }}
                    >
                      {Lang_chg.Appointmentschedule[config.language]}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: "35%",
                        justifyContent: "flex-end",
                      }}
                    >
                      <View style={{ width: "20%", alignSelf: "center" }}>
                        <Image
                          style={{
                            width: (windowWidth * 5) / 100,
                            height: (windowWidth * 5) / 100,
                            alignSelf: "center",
                          }}
                          source={Icons.Calendar}
                        />
                      </View>

                      <Text
                        style={{
                          color: Colors.theme_color,
                          fontFamily: Font.Medium,
                          fontSize: Font.name,
                          alignSelf: "center",
                          marginLeft: (windowWidth * 1) / 100,
                          textAlign: "right",
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
                      marginTop: (windowWidth * 1.5) / 100,
                      marginBottom: (windowWidth * 1.5) / 100,
                    }}
                  />

                  <View
                    style={{
                      width: "93%",
                      alignSelf: "center",
                      paddingBottom: (windowWidth * 3) / 100,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Font.Regular,
                        fontSize: Font.subtext,
                        textAlign: config.textRotate,
                        color: "#000",
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
                                  this.getLabTimeDate(),
                                  this.checkDate(item, index);
                              }}
                              style={{ width: (windowWidth * 15) / 100 }}
                            >
                              <Text
                                style={{
                                  marginRight: (windowWidth * 3) / 100,
                                  marginTop: (windowWidth * 3) / 100,
                                  backgroundColor: item.tick == 1 ? Colors.Blue : '#E5E5E5',
                                  color: item.tick == 1 ? Colors.White : Colors.Black,
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
                      width: "93%",
                      alignSelf: "center",
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
                      {Lang_chg.Select_start_time[config.language]}
                    </Text>

                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                    >
                      <View style={{ width: "100%", alignItems: "center" }}>
                        <View style={{ width: "100%", alignItems: "center" }}>
                          {this.state.time_Arr != "" ? (
                            <View
                              style={{
                                width: "100%",
                                alignItems: "center",
                              }}
                            >
                              <View style={{ width: "100%" }}>
                                <FlatList
                                  horizontal={true}
                                  showsHorizontalScrollIndicator={false}
                                  data={this.state.final_one}
                                  renderItem={({ item, index }) => {
                                    return (
                                      <TouchableOpacity
                                        onPress={() => {
                                          this.state.indexPosition === 0
                                            ? this.setState({
                                              time_take_data: item.time,
                                            })
                                            : this.setState({
                                              time_take_data_hour:
                                                item.time,
                                            });
                                        }}
                                      >
                                        <Text
                                          style={[
                                            {
                                              marginRight:
                                                (windowWidth * 3) / 100,
                                              marginTop: (windowWidth * 3) / 100,
                                              fontFamily:
                                                Font.ques_fontfamily,
                                              fontSize:
                                                Font.sregulartext_size,
                                              padding: (windowWidth * 2) / 100,
                                              paddingHorizontal:
                                                (windowWidth * 3.3) / 100,
                                            },
                                            item.time ==
                                              (this.state.indexPosition === 0
                                                ? this.state.time_take_data
                                                : this.state
                                                  .time_take_data_hour)
                                              ? {
                                                backgroundColor:
                                                  Colors.Blue,
                                                color: Colors.White,
                                              }
                                              : {
                                                backgroundColor:
                                                  '#E5E5E5',
                                                color: Colors.Black,
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

                              {/* ----------Date Time--------- */}
                              <View style={{ width: "100%" }}>
                                <FlatList
                                  horizontal={true}
                                  showsHorizontalScrollIndicator={false}
                                  data={this.state.final_arr2}
                                  renderItem={({ item, index }) => {
                                    return (
                                      <TouchableOpacity
                                        onPress={() => {
                                          this.state.indexPosition === 0
                                            ? this.setState({
                                              time_take_data: item.time,
                                            })
                                            : this.setState({
                                              time_take_data_hour:
                                                item.time,
                                            });
                                        }}
                                      >
                                        <Text
                                          style={[
                                            {
                                              marginRight:
                                                (windowWidth * 3) / 100,
                                              marginTop: (windowWidth * 3) / 100,
                                              fontFamily:
                                                Font.ques_fontfamily,
                                              fontSize:
                                                Font.sregulartext_size,
                                              padding: (windowWidth * 2) / 100,
                                              paddingHorizontal:
                                                (windowWidth * 3.3) / 100,
                                            },
                                            item.time ==
                                              (this.state.indexPosition === 0
                                                ? this.state.time_take_data
                                                : this.state
                                                  .time_take_data_hour)
                                              ? {
                                                backgroundColor:
                                                  Colors.Blue,
                                                color: Colors.White,
                                              }
                                              : {
                                                backgroundColor:
                                                  '#E5E5E5',
                                                color: Colors.Black,
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
                                paddingVertical: (windowWidth * 3) / 100,
                                textAlign: "center",
                                marginLeft: (windowWidth * 32) / 100,
                              }}
                            >
                              {Lang_chg.no_data_Found[config.language]}
                            </Text>
                          )}
                        </View>
                      </View>
                    </ScrollView>
                  </View>
                  {/* border */}
                </View>

                <View>
                  {/* border */}

                  {/* Payment section */}
                  <View
                    style={{
                      width: "100%",
                      paddingVertical: vs(9),
                      marginTop: vs(7),
                      backgroundColor: Colors.White,
                    }}
                  >
                    <View
                      style={{
                        width: "90%",
                        alignSelf: "center",
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: (windowWidth * 4) / 100,
                            color: Colors.theme_color,
                            textAlign: config.textRotate,
                          }}
                        >
                          {Lang_chg.Payment[config.language]}
                        </Text>
                      </View>
                      {this.state.new_task_arr != "" && (
                        <FlatList
                          data={this.state.new_task_arr}
                          renderItem={({ item, index }) => {
                            if (this.state.new_task_arr != "") {
                              return (
                                <View>
                                  {item.status == true && (
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        width: "100%",
                                        justifyContent: "space-between",
                                        marginTop: (windowWidth * 1.5) / 100,
                                        alignSelf: "center",
                                      }}
                                    >
                                      <Text
                                        style={{
                                          fontFamily: Font.ques_fontfamily,
                                          fontSize: Font.sregulartext_size,
                                          color: "#000",
                                          width: "70%",
                                          textAlign: config.textRotate,
                                        }}
                                      >
                                        {item.name}
                                      </Text>
                                      <Text
                                        style={{
                                          fontFamily: Font.ques_fontfamily,
                                          fontSize: Font.sregulartext_size,
                                          color: "#000",
                                          width: "30%",
                                          textAlign: "right",
                                        }}
                                      >
                                        {item.price}{" "}
                                        {this.state.currency_symbol}
                                      </Text>
                                    </View>
                                  )}
                                </View>
                              );
                            }
                          }}
                        />
                      )}
                      {this.state.hour_base_task_new != "" && (
                        <FlatList
                          data={this.state.hour_base_task_new}
                          renderItem={({ item, index }) => {
                            console.log("item dsdsds - >>>> ", item);
                            if (this.state.hour_base_task_new != "") {
                              return (
                                <View>
                                  {item.status == true && (
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        width: "100%",
                                        paddingVertical: (windowWidth * 3) / 100,
                                        justifyContent: "space-between",
                                        alignSelf: "center",
                                      }}
                                    >
                                      <Text
                                        style={{
                                          fontFamily: Font.ques_fontfamily,
                                          fontSize: Font.sregulartext_size,
                                          color: "#000",
                                          textAlign: config.textRotate,
                                        }}
                                      >
                                        {item.name}
                                      </Text>
                                      <Text
                                        style={{
                                          fontFamily: Font.ques_fontfamily,
                                          fontSize: Font.sregulartext_size,
                                          color: "#000",
                                          width: "30%",
                                          textAlign: "right",
                                        }}
                                      >
                                        {item.price}{" "}
                                        {this.state.currency_symbol}
                                      </Text>
                                    </View>
                                  )}
                                </View>
                              );
                            }
                          }}
                        />
                      )}
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingVertical: (windowWidth * 2) / 100,
                          borderTopWidth: 1.5,
                          borderColor: Colors.backgroundcolor,
                          marginTop: (windowWidth * 2) / 100,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Font.ques_fontfamily,
                            fontSize: Font.sregulartext_size,
                            color: "#000",
                          }}
                        >
                          {item.distance_fare_text}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.ques_fontfamily,
                            fontSize: Font.sregulartext_size,
                            color: "#000",
                          }}
                        >
                          {item.distance_fare}.0 {this.state.currency_symbol}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingVertical: (windowWidth * 2) / 100,
                          borderTopWidth: 1.5,
                          borderColor: Colors.backgroundcolor,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: (windowWidth * 3.7) / 100,
                            color: Colors.theme_color,
                          }}
                        >
                          {Lang_chg.subTotal[config.language]}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: (windowWidth * 3.7) / 100,
                            color: Colors.theme_color,
                          }}
                        >
                          {this.state.subTotal} {this.state.currency_symbol}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginTop: (windowWidth * 1) / 100,
                          borderColor: Colors.backgroundcolor,
                          marginBottom: (windowWidth * 2) / 100,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Font.ques_fontfamily,
                            fontSize: Font.sregulartext_size,
                            color: "#000",
                          }}
                        >
                          {item.vat_text}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.ques_fontfamily,
                            fontSize: Font.sregulartext_size,
                            color: "#000",
                          }}
                        >
                          {this.state.indexPosition === 0
                            ? this.state.vat_price_show_display
                            : this.state.vat_price_show_hourly}{" "}
                          {this.state.currency_symbol}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderTopWidth: 1.5,
                          borderColor: Colors.backgroundcolor,
                          marginBottom: (windowWidth * 2) / 100,
                          paddingVertical: (windowWidth * 2) / 100,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: (windowWidth * 3.7) / 100,
                            color: Colors.theme_color,
                          }}
                        >
                          {Lang_chg.Total[config.language]}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: (windowWidth * 3.7) / 100,
                            color: Colors.theme_color,
                          }}
                        >
                          {this.state.indexPosition === 0
                            ? this.state.final_total_price
                            : this.state.hour_total_price}{" "}
                          {this.state.currency_symbol}
                        </Text>
                      </View>


                    </View>
                  </View>

                </View>
              </View>
            ) : this.state.providerType === "doctor" ? (
              <>
                <View
                  style={{
                    width: "100%",
                    marginTop: vs(7),
                    paddingVertical: vs(9),
                    backgroundColor: Colors.White
                  }} >
                  <View style={{
                    borderBottomWidth: 1.5,
                    borderBottomColor: Colors.backgroundcolor,
                    paddingBottom: vs(5),
                    marginBottom: vs(5)
                  }}>


                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: "100%",
                        alignSelf: "center",
                        paddingHorizontal: s(11)
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: Font.medium,
                          width: "65%",
                          textAlign: config.textRotate,
                          color: Colors.detailTitles
                        }}
                      >
                        {Lang_chg.Appointmentschedule[config.language]}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          width: "35%",
                          justifyContent: "flex-end",
                        }}
                      >
                        <View style={{ width: "20%", alignSelf: "center" }}>
                          <Image
                            style={{
                              width: (windowWidth * 5) / 100,
                              height: (windowWidth * 5) / 100,
                              alignSelf: "center",
                            }}
                            source={Icons.Calendar}
                          />
                        </View>

                        <Text
                          style={{
                            color: Colors.Theme,
                            fontFamily: Font.Medium,
                            fontSize: Font.medium,
                            alignSelf: "center",
                            marginLeft: (windowWidth * 1) / 100,
                            textAlign: "right",
                          }}
                        >
                          {this.state.set_date}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View
                    style={{
                      width: "93%",
                      alignSelf: "center",
                      paddingBottom: (windowWidth * 3) / 100,
                      borderBottomWidth: 1.5,
                      borderBottomColor: Colors.backgroundcolor
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Font.Regular,
                        fontSize: Font.large,
                        textAlign: config.textRotate,
                        color: Colors.detailTitles,
                      }}
                    >
                      {Lang_chg.SelectDate[config.language]}
                    </Text>
                    {this.state.indexPosition === 1 ? (
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
                                    set_task: item.home_visit_text,
                                    time_take_data: "",
                                  }),
                                    this.getDoctorTimeDate(),
                                    this.checkDate(item, index);
                                }}
                                style={{ width: (windowWidth * 15) / 100 }}
                              >
                                <Text
                                  style={{
                                    marginRight: (windowWidth * 3) / 100,
                                    marginTop: (windowWidth * 3) / 100,
                                    backgroundColor: item.tick == 1 ? Colors.Blue : '#E5E5E5',
                                    color: item.tick == 1 ? Colors.White : Colors.Black,
                                    textAlign: "center",
                                    paddingVertical: (windowWidth * 2) / 100,
                                    fontFamily: Font.Regular,
                                    fontSize: Font.small,

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
                    ) : (
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
                                    set_task: item.online_base_text,
                                    time_take_data_hour: "",
                                  }),
                                    this.getDoctorTimeDate(),
                                    this.checkDate(item, index);
                                }}
                                style={{ width: (windowWidth * 15) / 100, }}
                              >
                                <Text
                                  style={{
                                    marginRight: (windowWidth * 3) / 100,
                                    marginTop: (windowWidth * 3) / 100,
                                    backgroundColor: item.tick == 1 ? Colors.Blue : '#E5E5E5',
                                    color: item.tick == 1 ? Colors.White : Colors.Black,
                                    textAlign: "center",
                                    paddingVertical: (windowWidth * 2) / 100,
                                    fontFamily: Font.Regular,
                                    fontSize: Font.small,
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
                    )}
                  </View>


                  <View
                    style={{
                      width: "100%",
                      alignSelf: "center",
                      paddingTop: vs(7),
                      paddingHorizontal: s(11)
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
                      {Lang_chg.Select_start_time[config.language]}
                    </Text>

                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                    >
                      <View style={{ width: "100%", alignItems: "center" }}>
                        {this.state.indexPosition === 1 ? (
                          <View
                            style={{ width: "100%", alignItems: "center" }}
                          >
                            {this.state.time_Arr != "" ? (
                              <View
                                style={{
                                  width: "100%",
                                  alignItems: "center",
                                }}
                              >
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
                                                marginRight:
                                                  (windowWidth * 3) / 100,
                                                marginTop:
                                                  (windowWidth * 3) / 100,

                                                fontFamily:
                                                  Font.ques_fontfamily,
                                                fontSize:
                                                  Font.sregulartext_size,
                                                padding: (windowWidth * 2) / 100,
                                                paddingHorizontal:
                                                  (windowWidth * 3.3) / 100,
                                              },
                                              item.time ==
                                                this.state.time_take_data
                                                ? {
                                                  backgroundColor:
                                                    Colors.Blue,
                                                  color: Colors.White,
                                                }
                                                : {
                                                  backgroundColor:
                                                    '#E5E5E5',
                                                  color: Colors.Black,
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
                                    data={this.state.final_arr2}
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
                                                marginRight:
                                                  (windowWidth * 3) / 100,
                                                marginTop:
                                                  (windowWidth * 3) / 100,

                                                fontFamily:
                                                  Font.ques_fontfamily,
                                                fontSize:
                                                  Font.sregulartext_size,
                                                padding: (windowWidth * 2) / 100,
                                                paddingHorizontal:
                                                  (windowWidth * 3.3) / 100,
                                              },
                                              item.time ==
                                                this.state.time_take_data
                                                ? {
                                                  backgroundColor:
                                                    Colors.Blue,
                                                  color: Colors.White,
                                                }
                                                : {
                                                  backgroundColor:
                                                    '#E5E5E5',
                                                  color: Colors.Black,
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
                                  paddingVertical: (windowWidth * 3) / 100,
                                  textAlign: "center",
                                  marginLeft: (windowWidth * 32) / 100,
                                }}
                              >
                                {Lang_chg.no_data_Found[config.language]}
                              </Text>
                            )}
                          </View>
                        ) : (
                          <View
                            style={{ width: "100%", alignItems: "center" }}
                          >
                            {this.state.hour_time != "" ? (
                              <View
                                style={{
                                  width: "100%",
                                  alignItems: "center",
                                }}
                              >
                                <View style={{ width: "100%" }}>
                                  <FlatList
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    data={this.state.final_hour_one}
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
                                                marginRight:
                                                  (windowWidth * 3) / 100,
                                                marginTop:
                                                  (windowWidth * 3) / 100,
                                                fontFamily:
                                                  Font.ques_fontfamily,
                                                fontSize:
                                                  Font.sregulartext_size,
                                                padding: (windowWidth * 2) / 100,
                                                paddingHorizontal:
                                                  (windowWidth * 3.3) / 100,
                                              },
                                              item.time ==
                                                this.state.time_take_data
                                                ? {
                                                  backgroundColor:
                                                    Colors.Blue,
                                                  color: Colors.White,
                                                }
                                                : {
                                                  backgroundColor:
                                                    '#E5E5E5',
                                                  color: Colors.Black,
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
                                    data={this.state.final_hour_two}
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
                                                marginRight:
                                                  (windowWidth * 3) / 100,
                                                marginTop:
                                                  (windowWidth * 3) / 100,
                                                fontFamily:
                                                  Font.ques_fontfamily,
                                                fontSize:
                                                  Font.sregulartext_size,
                                                padding: (windowWidth * 2) / 100,
                                                paddingHorizontal:
                                                  (windowWidth * 3.3) / 100,
                                              },
                                              item.time ==
                                                this.state.time_take_data
                                                ? {
                                                  backgroundColor:
                                                    Colors.Blue,
                                                  color: Colors.White,
                                                }
                                                : {
                                                  backgroundColor:
                                                    '#E5E5E5',
                                                  color: Colors.Black,
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
                                  paddingVertical: (windowWidth * 3) / 100,
                                  textAlign: "center",
                                  marginLeft: (windowWidth * 32) / 100,
                                }}
                              >
                                {Lang_chg.no_data_Found[config.language]}
                              </Text>
                            )}
                          </View>
                        )}
                      </View>
                    </ScrollView>
                  </View>
                </View>

                <View>


                  {/* Payment section */}
                  <View
                    style={{
                      width: "100%",
                      paddingVertical: vs(9),
                      marginTop: vs(7),
                      marginBottom: vs(50),
                      backgroundColor: Colors.White,
                      paddingHorizontal: s(11)
                    }}>
                    <View
                      style={{
                        width: "100%",
                        alignSelf: "center",
                      }} >
                      <View>
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: (windowWidth * 4) / 100,
                            color: Colors.Blue,
                            textAlign: config.textRotate,
                          }}
                        >
                          {Lang_chg.Payment[config.language]}
                        </Text>
                      </View>
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            width: "100%",
                            justifyContent: "space-between",
                            marginTop: vs(10),
                            alignSelf: "center",
                          }} >
                          <Text
                            style={{
                              fontFamily: Font.Regular,
                              fontSize: Font.small,
                              color: Colors.detailTitles,
                              width: "70%",
                              textAlign: config.textRotate,
                            }} >
                            {this.state.indexPosition === 0
                              ? item.online_base_task[0].duration
                              : item.home_visit_task[0].duration}
                          </Text>
                          <Text
                            style={{
                              fontFamily: Font.Regular,
                              fontSize: Font.small,
                              color: Colors.detailTitles,
                              width: "30%",
                              textAlign: "right",
                            }}>
                            {this.state.indexPosition === 0
                              ? item.online_base_task[0].task_price
                              : item.home_visit_task[0].task_price}{" "}
                            {this.state.currency_symbol}
                          </Text>
                        </View>
                        {this.state.indexPosition === 1 && (
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              paddingVertical: vs(10),
                              borderTopWidth: 1.5,
                              borderBottomWidth: 1.5,
                              borderTopColor: Colors.backgroundcolor,
                              borderBottomColor: Colors.backgroundcolor,
                              marginTop: (windowWidth * 2) / 100,
                            }}>
                            <Text
                              style={{
                                fontFamily: Font.Regular,
                                fontSize: Font.small,
                                color: Colors.detailTitles,
                              }}>
                              {item.distance_fare_text}
                            </Text>
                            <Text
                              style={{
                                fontFamily: Font.ques_fontfamily,
                                fontSize: Font.sregulartext_size,
                                color: "#000",
                              }}>
                              {item.distance_fare}.0{" "}
                              {this.state.currency_symbol}
                            </Text>
                          </View>
                        )}
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingVertical: (windowWidth * 2) / 100,
                            borderTopWidth: 1.5,
                            borderTopColor: Colors.backgroundcolor,
                            marginTop: (windowWidth * 2) / 100,
                          }}>
                          <Text
                            style={{
                              fontFamily: Font.Medium,
                              fontSize: (windowWidth * 3.7) / 100,
                              color: Colors.theme_color,
                            }}>
                            {Lang_chg.subTotal[config.language]}
                          </Text>
                          <Text
                            style={{
                              fontFamily: Font.Medium,
                              fontSize: (windowWidth * 3.7) / 100,
                              color: Colors.theme_color,
                            }}>
                            {this.state.indexPosition === 0
                              ? this.state.onlineSubTotalPrice
                              : this.state.homeVisitSubTotalPrice}{" "}
                            {this.state.currency_symbol}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: (windowWidth * 1) / 100,
                            borderColor: Colors.bordercolor,
                            marginBottom: (windowWidth * 2) / 100,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: Font.ques_fontfamily,
                              fontSize: Font.sregulartext_size,
                              color: "#000",
                            }}
                          >
                            {item.vat_text}
                          </Text>
                          <Text
                            style={{
                              fontFamily: Font.ques_fontfamily,
                              fontSize: Font.sregulartext_size,
                              color: "#000",
                            }}
                          >
                            {this.state.indexPosition === 0
                              ? this.state.onlineVisitVat
                              : this.state.homeVisitVat}{" "}
                            {this.state.currency_symbol}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderTopWidth: 1.5,
                            borderTopColor: Colors.backgroundcolor,
                            marginBottom: (windowWidth * 2) / 100,
                            paddingTop: (windowWidth * 2) / 100,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: Font.Medium,
                              fontSize: (windowWidth * 3.7) / 100,
                              color: Colors.theme_color,
                            }}
                          >
                            {Lang_chg.Total[config.language]}
                          </Text>
                          <Text
                            style={{
                              fontFamily: Font.Medium,
                              fontSize: (windowWidth * 3.7) / 100,
                              color: Colors.theme_color,
                            }}
                          >
                            {this.state.indexPosition === 0
                              ? this.state.onlineTaskPrice
                              : this.state.homeVisitTaskPrice}{" "}
                            {this.state.currency_symbol}
                          </Text>
                        </View>
                        {/* <Appbtn
                            onPresshandler={() => {
                              this.submitButtonForDoctor();
                            }}
                            title={Lang_chg.PROCEEDTOcheckout[config.language]}
                          /> */}
                      </View>
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <View>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  {/* ------------Tabs---------- */}

                  {item.task_base_enable == 0 && (
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ display: "taskbooking" });
                      }}
                      style={{ width: "50%", alignSelf: "center" }}
                    >
                      <View style={{ width: "100%" }}>
                        <Text
                          style={
                            this.state.display == "taskbooking"
                              ? {
                                color: Colors.Blue,
                                fontFamily: Font.Medium,
                                fontSize: (windowWidth * 4) / 100,
                                textAlign: config.textalign,
                                alignSelf: "center",
                                paddingVertical: (windowWidth * 3) / 100,
                              }
                              : {
                                color: Colors.tablightcolo,
                                fontFamily: Font.Medium,
                                fontSize: (windowWidth * 4) / 100,
                                textAlign: config.textalign,
                                alignSelf: "center",
                                paddingVertical: (windowWidth * 3) / 100,
                              }
                          }
                        >
                          {Lang_chg.TaskBooking[config.language]}
                        </Text>

                        <View
                          style={
                            this.state.display == "taskbooking"
                              ? {
                                width: (windowWidth * 42) / 100,
                                alignSelf: "center",
                                paddingVertical: 1,
                                borderWidth: 1,
                                borderColor: Colors.Blue,
                                backgroundColor: Colors.Blue,
                              }
                              : {
                                width: (windowWidth * 42) / 100,
                                alignSelf: "center",
                                borderWidth: 2,
                                borderColor: Colors.tab_background_color,
                                backgroundColor:
                                  Colors.appointmentdetaillightblue,
                              }
                          }
                        />
                      </View>
                    </TouchableOpacity>
                  )}
                  {item.hour_base_enable == 0 && (
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ display: "hourlybooking" });
                      }}
                      style={{ width: "50%", alignSelf: "center" }}
                    >
                      <View style={{ width: "100%" }}>
                        <Text
                          style={
                            this.state.display == "hourlybooking"
                              ? {
                                color: Colors.Blue,

                                fontFamily: Font.Medium,
                                fontSize: (windowWidth * 4) / 100,
                                textAlign: config.textalign,
                                alignSelf: "center",
                                paddingVertical: (windowWidth * 3) / 100,
                              }
                              : {
                                color: Colors.tablightcolo,
                                fontFamily: Font.Medium,
                                fontSize: (windowWidth * 4) / 100,
                                textAlign: config.textalign,
                                alignSelf: "center",
                                paddingVertical: (windowWidth * 3) / 100,
                              }
                          }
                        >
                          {Lang_chg.HourlyBooking[config.language]}
                        </Text>

                        <View
                          style={
                            this.state.display == "hourlybooking"
                              ? {
                                width: (windowWidth * 42) / 100,
                                alignSelf: "center",
                                paddingVertical: 1,
                                borderWidth: 1,
                                borderColor: Colors.Blue,
                                backgroundColor: Colors.Blue,
                              }
                              : {
                                width: (windowWidth * 42) / 100,
                                alignSelf: "center",
                                borderWidth: 2,
                                borderColor: Colors.tab_background_color,
                                backgroundColor:
                                  Colors.tab_background_color,
                              }
                          }
                        />
                      </View>
                    </TouchableOpacity>
                  )}

                  {/* ------------Tabs---------- */}

                </View>

                {this.state.display == "taskbooking" && (
                  <View
                    style={{
                      width: "100%",
                      alignSelf: "center",
                      backgroundColor: "#fff",
                    }}
                  >
                    <View
                      style={{
                        width: "95%",
                        backgroundColor: "#fff",
                        right: 0,
                        alignSelf: "flex-end",
                      }}>
                      {/* ----------------Selected Tasks--------------- */}
                      <FlatList
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={this.state.new_task_arr}
                        renderItem={({ item, index }) => {
                          if (this.state.new_task_arr != "") {
                            return (
                              <View style={{ alignSelf: "center" }}>
                                {item.status == true && (
                                  <View
                                    style={{
                                      backgroundColor: Colors.Theme,
                                      paddingVertical: (windowWidth * 0.8) / 100,
                                      flexDirection: "row",
                                      paddingHorizontal:
                                        (windowWidth * 1.5) / 100,
                                      marginTop: (windowWidth * 2) / 100,
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      borderRadius: (windowWidth * 1) / 100,
                                      marginRight: (windowWidth * 2) / 100,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        color: Colors.White,
                                        fontSize: Font.textsize,
                                        fontFamily: Font.Light,
                                      }}
                                    >
                                      {item.name}
                                    </Text>
                                    <TouchableOpacity
                                      onPress={() => {
                                        this.check_all_false(item, index);
                                      }}
                                    >
                                      {/* <Image
                                          source={localimag.cross2}
                                          style={{
                                            alignSelf: "center",
                                            width: (windowWidth * 2) / 100,
                                            height: (windowWidth * 2) / 100,
                                            marginLeft: (windowWidth * 3.5) / 100,
                                          }}
                                        /> */}
                                    </TouchableOpacity>
                                  </View>
                                )}
                              </View>
                            );
                          }
                        }}
                      />
                    </View>

                    <View
                      style={{
                        width: "100%",
                        alignSelf: "center",
                        backgroundColor: Colors.tab_background_color,
                        alignItems: "center",
                        marginTop: (windowWidth * 3) / 100,
                      }}
                    >
                      <View
                        style={{
                          width: "100%",
                          alignSelf: "center",
                          flexDirection: "row",
                          paddingHorizontal: s(11)
                        }}
                      >
                        <TextInput
                          ref={(text) => {
                            this.textdata = text;
                          }}
                          maxLength={50}
                          onChangeText={(text) => {
                            this.searchFilterFunction(text);
                          }}
                          returnKeyLabel="done"
                          returnKeyType="done"
                          onSubmitEditing={() => {
                            Keyboard.dismiss();
                          }}
                          style={{
                            fontSize: (windowWidth * 4) / 100,
                            fontFamily: Font.ques_fontfamily,
                            color: "#8F98A7",
                            width: "90%",
                            paddingVertical: (windowWidth * 3.5) / 100,
                            textAlign: config.textalign,
                          }}
                          placeholderTextColor={"#8F98A7"}
                          placeholder={Lang_chg.Searchtask[config.language]}
                        />

                        <View style={{ width: "10%", alignSelf: "center" }}>
                          <Image
                            style={{
                              width: (windowWidth * 4) / 100,
                              height: (windowWidth * 4) / 100,
                              tintColor: "#8F98A7",
                              alignSelf: "center",
                            }}
                            source={Icons.search2}
                          />
                        </View>
                      </View>
                    </View>

                    {/* ----------------Tasks List------------ */}

                    {this.state.task_base_task != "" &&
                      this.state.task_base_task != null && (
                        <View
                          style={[
                            {
                              width: "100%",
                              alignSelf: "center",
                              marginTop: (windowWidth * 2) / 100,
                            },
                            this.state.task_base_task.length >= 4
                              ? { height: 200 }
                              : null,
                          ]}
                        >
                          <FlatList
                            data={this.state.task_base_task}
                            scrollEnabled={true}
                            nestedScrollEnabled={true}
                            renderItem={({ item, index }) => {
                              if (this.state.task_base_task != "") {
                                return (
                                  <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => {
                                      this.check_all(item, index);
                                    }}
                                    style={{
                                      width: '100%',
                                      paddingVertical: vs(7),
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                      paddingHorizontal: s(11)
                                    }} >
                                    <View style={{ flexDirection: 'row' }}>
                                      <TouchableOpacity
                                        style={{
                                          height: 20,
                                          width: 20,
                                          borderRadius: 5,
                                          backgroundColor: item.status == true ? Colors.Theme : Colors.White,
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          borderWidth: item.status == true ? 0 : 1.3,
                                          borderColor: Colors.Border
                                        }}
                                      >
                                        {item.status == true ? (
                                          <Image
                                            style={{
                                              height: 14,
                                              width: 14,
                                              tintColor: Colors.White
                                            }}
                                            source={Icons.Tick}
                                          />

                                        ) : null}
                                      </TouchableOpacity>
                                      <Text
                                        style={{
                                          textAlign: config.textRotate,
                                          alignSelf: "center",
                                          fontSize: (windowWidth * 3.6) / 100,
                                          fontFamily: Font.Regular,
                                          color: "#000",
                                          marginLeft: s(10)
                                        }}>
                                        {item.name}
                                      </Text>
                                    </View>
                                    <Text
                                      style={{
                                        fontSize: (windowWidth * 3.6) / 100,
                                        fontFamily: Font.Regular,
                                        color: Colors.Black,
                                        textAlign: "right",
                                      }}
                                    >
                                      {item.price}{" "}
                                      {this.state.currency_symbol}
                                    </Text>
                                  </TouchableOpacity>
                                );
                              }
                            }}
                          />
                        </View>
                      )}
                  </View>
                )}

                {this.state.display == "hourlybooking" && (
                  <View
                    style={{
                      width: "100%",
                      backgroundColor: "#fff",
                      paddingVertical: (windowWidth * 3) / 100,
                      marginBottom: (windowWidth * 1) / 100,
                    }}
                  >
                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      horizontal={true}
                      data={item.hour_base_task}
                      renderItem={({ item, index }) => {
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              this.hourbooking(item, index),
                                this.getTimeDate(),
                                this.setState({
                                  hour_id: item.id,
                                  hour_price: item.price,
                                  time_take_data_hour: "",
                                });
                            }}
                            style={[
                              {
                                borderRadius: (windowWidth * 2) / 100,
                                marginLeft: (windowWidth * 2) / 100,
                                width: (windowWidth * 35) / 100,
                                backgroundColor: "#fff",
                              },
                              item.status == true
                                ? {
                                  borderColor: Colors.theme_color,
                                  borderWidth: 2,
                                }
                                : { borderColor: "#DFDFDF", borderWidth: 1 },
                            ]}
                          >
                            <View
                              style={{
                                backgroundColor: "#0168B3",
                                borderTopLeftRadius: (windowWidth * 1.1) / 100,
                                borderTopRightRadius: (windowWidth * 1.1) / 100,
                                width: "100%",
                              }}
                            >
                              <Text
                                style={{
                                  paddingVertical: (windowWidth * 1.5) / 100,
                                  color: Colors.White,
                                  fontFamily: Font.Medium,
                                  fontSize: (windowWidth * 3) / 100,
                                  textTransform: "uppercase",
                                  textAlign: "center",
                                }}
                              >
                                {item.duration}
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
                              {item.price} {this.state.currency_symbol}
                            </Text>
                          </TouchableOpacity>
                        );
                      }}
                    />
                  </View>
                )}

                {/* ------------------Date Time--------------- */}
                <>
                  <View
                    style={{
                      width: "100%",
                      marginTop: vs(7),
                      paddingVertical: vs(9),
                      backgroundColor: Colors.White
                    }} >
                    <View style={{
                      borderBottomWidth: 1.5,
                      borderBottomColor: Colors.backgroundcolor,
                      paddingBottom: vs(5),
                      marginBottom: vs(5)
                    }}>


                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          width: "100%",
                          alignSelf: "center",
                          paddingHorizontal: s(11)
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: Font.medium,
                            width: "65%",
                            textAlign: config.textRotate,
                            color: Colors.detailTitles
                          }}
                        >
                          {Lang_chg.Appointmentschedule[config.language]}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            width: "35%",
                            justifyContent: "flex-end",
                          }}
                        >
                          <View style={{ width: "20%", alignSelf: "center" }}>
                            <Image
                              style={{
                                width: (windowWidth * 5) / 100,
                                height: (windowWidth * 5) / 100,
                                alignSelf: "center",
                              }}
                              source={Icons.Calendar}
                            />
                          </View>

                          <Text
                            style={{
                              color: Colors.Theme,
                              fontFamily: Font.Medium,
                              fontSize: Font.medium,
                              alignSelf: "center",
                              marginLeft: (windowWidth * 1) / 100,
                              textAlign: "right",
                            }}
                          >
                            {this.state.set_date}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View
                      style={{
                        width: "93%",
                        alignSelf: "center",
                        paddingBottom: (windowWidth * 3) / 100,
                        borderBottomWidth: 1.5,
                        borderBottomColor: Colors.backgroundcolor
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: Font.Regular,
                          fontSize: Font.large,
                          textAlign: config.textRotate,
                          color: Colors.detailTitles,
                        }}
                      >
                        {Lang_chg.SelectDate[config.language]}
                      </Text>
                      {this.state.display == "taskbooking" ? (
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
                                      this.getTimeDate(),
                                      this.checkDate(item, index);
                                  }}
                                  style={{ width: (windowWidth * 15) / 100 }}
                                >
                                  <Text
                                    style={{
                                      marginRight: (windowWidth * 3) / 100,
                                      marginTop: (windowWidth * 3) / 100,
                                      backgroundColor: item.tick == 1 ? Colors.Blue : '#E5E5E5',
                                      color: item.tick == 1 ? Colors.White : Colors.Black,
                                      textAlign: "center",
                                      paddingVertical: (windowWidth * 2) / 100,
                                      fontFamily: Font.Regular,
                                      fontSize: Font.small,
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
                      ) : (
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
                                      set_task: "hour_base",
                                      time_take_data_hour: "",
                                    }),
                                      this.getTimeDate(),
                                      this.checkDate(item, index);
                                  }}
                                  style={{ width: (windowWidth * 15) / 100, }}
                                >
                                  <Text
                                    style={{
                                      marginRight: (windowWidth * 3) / 100,
                                      marginTop: (windowWidth * 3) / 100,
                                      backgroundColor: item.tick == 1 ? Colors.Blue : '#E5E5E5',
                                      color: item.tick == 1 ? Colors.White : Colors.Black,
                                      textAlign: "center",
                                      paddingVertical: (windowWidth * 2) / 100,
                                      fontFamily: Font.Regular,
                                      fontSize: Font.small,
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
                      )}
                    </View>


                    <View
                      style={{
                        width: "100%",
                        alignSelf: "center",
                        paddingTop: vs(7),
                        paddingHorizontal: s(11)
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
                        {Lang_chg.Select_start_time[config.language]}
                      </Text>

                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                      >
                        <View style={{ width: "100%", alignItems: "center" }}>
                          {this.state.display == "taskbooking" ? (
                            <View style={{ width: "100%", alignItems: "center" }}>
                              {this.state.time_Arr != "" ? (
                                <View
                                  style={{
                                    width: "100%",
                                    alignItems: "center",
                                  }}
                                >
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
                                            }}>
                                            <Text
                                              style={[
                                                {
                                                  marginRight:
                                                    (windowWidth * 3) / 100,
                                                  marginTop:
                                                    (windowWidth * 3) / 100,

                                                  fontFamily:
                                                    Font.ques_fontfamily,
                                                  fontSize:
                                                    Font.sregulartext_size,
                                                  padding: (windowWidth * 2) / 100,
                                                  paddingHorizontal:
                                                    (windowWidth * 3.3) / 100,
                                                },
                                                item.time ==
                                                  this.state.time_take_data
                                                  ? {
                                                    backgroundColor:
                                                      Colors.Blue,
                                                    color: Colors.White,
                                                  }
                                                  : {
                                                    backgroundColor:
                                                      '#E5E5E5',
                                                    color: Colors.Black,
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
                                      data={this.state.final_arr2}
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
                                                  marginRight:
                                                    (windowWidth * 3) / 100,
                                                  marginTop:
                                                    (windowWidth * 3) / 100,

                                                  fontFamily:
                                                    Font.ques_fontfamily,
                                                  fontSize:
                                                    Font.sregulartext_size,
                                                  padding: (windowWidth * 2) / 100,
                                                  paddingHorizontal:
                                                    (windowWidth * 3.3) / 100,
                                                },
                                                item.time ==
                                                  this.state.time_take_data
                                                  ? {
                                                    backgroundColor:
                                                      Colors.Blue,
                                                    color: Colors.White,
                                                  }
                                                  : {
                                                    backgroundColor:
                                                      '#E5E5E5',
                                                    color: Colors.Black,
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
                                    paddingVertical: (windowWidth * 3) / 100,
                                    textAlign: "center",
                                    marginLeft: (windowWidth * 32) / 100,
                                  }}
                                >
                                  {Lang_chg.no_data_Found[config.language]}
                                </Text>
                              )}
                            </View>
                          ) : (
                            <View
                              style={{ width: "100%", alignItems: "center" }}
                            >
                              {this.state.hour_time != "" ? (
                                <View
                                  style={{
                                    width: "100%",
                                    alignItems: "center",
                                  }}
                                >
                                  <View style={{ width: "100%" }}>
                                    <FlatList
                                      horizontal={true}
                                      showsHorizontalScrollIndicator={false}
                                      data={this.state.final_hour_one}
                                      renderItem={({ item, index }) => {
                                        return (
                                          <TouchableOpacity
                                            onPress={() => {
                                              this.setState({
                                                time_take_data_hour: item.time,
                                              });
                                            }}
                                          >
                                            <Text
                                              style={[
                                                {
                                                  marginRight:
                                                    (windowWidth * 3) / 100,
                                                  marginTop:
                                                    (windowWidth * 3) / 100,
                                                  fontFamily:
                                                    Font.ques_fontfamily,
                                                  fontSize:
                                                    Font.sregulartext_size,
                                                  padding: (windowWidth * 2) / 100,
                                                  paddingHorizontal:
                                                    (windowWidth * 3.3) / 100,
                                                },
                                                item.time ==
                                                  this.state.time_take_data_hour
                                                  ? {
                                                    backgroundColor:
                                                      Colors.Blue,
                                                    color: Colors.White,
                                                  }
                                                  : {
                                                    backgroundColor:
                                                      '#E5E5E5',
                                                    color: Colors.Black,
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
                                      data={this.state.final_hour_two}
                                      renderItem={({ item, index }) => {
                                        return (
                                          <TouchableOpacity
                                            onPress={() => {
                                              this.setState({
                                                time_take_data_hour: item.time,
                                              });
                                            }}
                                          >
                                            <Text
                                              style={[
                                                {
                                                  marginRight:
                                                    (windowWidth * 3) / 100,
                                                  marginTop:
                                                    (windowWidth * 3) / 100,
                                                  fontFamily:
                                                    Font.ques_fontfamily,
                                                  fontSize:
                                                    Font.sregulartext_size,
                                                  padding: (windowWidth * 2) / 100,
                                                  paddingHorizontal:
                                                    (windowWidth * 3.3) / 100,
                                                },
                                                item.time ==
                                                  this.state.time_take_data_hour
                                                  ? {
                                                    backgroundColor:
                                                      Colors.Blue,
                                                    color: Colors.White,
                                                  }
                                                  : {
                                                    backgroundColor:
                                                      '#E5E5E5',
                                                    color: Colors.Black,
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
                                    paddingVertical: (windowWidth * 3) / 100,
                                    textAlign: "center",
                                    marginLeft: (windowWidth * 32) / 100,
                                  }}
                                >
                                  {Lang_chg.no_data_Found[config.language]}
                                </Text>
                              )}
                            </View>
                          )}
                        </View>
                      </ScrollView>
                    </View>
                  </View>
                </>
                <View style={{}}>

                  {/* Payment section */}
                  {this.state.display == "taskbooking" && (
                    <View
                      style={{
                        width: "100%",
                        paddingVertical: vs(9),
                        marginTop: vs(7),
                        backgroundColor: Colors.White,
                        paddingHorizontal: s(11)
                      }} >
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: (windowWidth * 4) / 100,
                          color: Colors.theme_color,
                          textAlign: config.textRotate,
                        }}
                      >
                        {Lang_chg.Payment[config.language]}
                      </Text>
                      {this.state.new_task_arr != "" && (
                        <FlatList
                          data={this.state.new_task_arr}
                          renderItem={({ item, index }) => {
                            if (this.state.new_task_arr != "") {
                              return (
                                <View>
                                  {item.status == true && (
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        width: "100%",
                                        justifyContent: "space-between",
                                        marginTop: (windowWidth * 1.5) / 100,
                                        alignSelf: "center",
                                      }}
                                    >
                                      <Text
                                        style={{
                                          fontFamily: Font.ques_fontfamily,
                                          fontSize: Font.sregulartext_size,
                                          color: "#000",
                                          width: "70%",
                                          textAlign: config.textRotate,
                                        }}
                                      >
                                        {item.name}
                                      </Text>
                                      <Text
                                        style={{
                                          fontFamily: Font.ques_fontfamily,
                                          fontSize: Font.sregulartext_size,
                                          color: "#000",
                                          width: "30%",
                                          textAlign: "right",
                                        }}
                                      >
                                        {item.price}{" "}
                                        {this.state.currency_symbol}
                                      </Text>
                                    </View>
                                  )}
                                </View>
                              );
                            }
                          }}
                        />
                      )}
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingVertical: (windowWidth * 2) / 100,
                          borderTopWidth: 1.5,
                          borderTopColor: Colors.backgroundcolor,
                          marginTop: (windowWidth * 2) / 100,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Font.ques_fontfamily,
                            fontSize: Font.sregulartext_size,
                            color: "#000",
                          }}
                        >
                          {item.distance_fare_text}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.ques_fontfamily,
                            fontSize: Font.sregulartext_size,
                            color: "#000",
                          }}
                        >
                          {item.distance_fare}.0{" "}
                          {this.state.currency_symbol}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingVertical: (windowWidth * 2) / 100,
                          borderTopWidth: 1.5,
                          borderTopColor: Colors.backgroundcolor,
                          // marginTop: windowWidth * 0.5 / 100,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: (windowWidth * 3.7) / 100,
                            color: Colors.theme_color,
                          }}
                        >
                          {Lang_chg.subTotal[config.language]}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: (windowWidth * 3.7) / 100,
                            color: Colors.theme_color,
                            // marginTop: windowWidth * 1 / 100,
                          }}
                        >
                          {this.state.subTotal} {this.state.currency_symbol}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginTop: (windowWidth * 1) / 100,
                          borderColor: Colors.bordercolor,
                          marginBottom: (windowWidth * 2) / 100,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Font.ques_fontfamily,
                            fontSize: Font.sregulartext_size,
                            color: "#000",
                          }}
                        >
                          {item.vat_text}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.ques_fontfamily,
                            fontSize: Font.sregulartext_size,
                            color: "#000",
                          }}
                        >
                          {this.state.vat_price_show_display}{" "}
                          {this.state.currency_symbol}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderTopWidth: 1.5,
                          borderTopColor: Colors.backgroundcolor,
                          marginBottom: (windowWidth * 2) / 100,
                          paddingVertical: vs(5),
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: (windowWidth * 3.7) / 100,
                            color: Colors.theme_color,
                          }}
                        >
                          {Lang_chg.Total[config.language]}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: (windowWidth * 3.7) / 100,
                            color: Colors.theme_color,
                          }}
                        >
                          {this.state.final_total_price}{" "}
                          {this.state.currency_symbol}
                        </Text>
                      </View>

                      {/* <Appbtn
                            onPresshandler={() => {
                              this.submit_btn();
                            }}
                            title={Lang_chg.PROCEEDTOcheckout[config.language]}
                          /> */}
                    </View>
                  )}
                  {this.state.display == "hourlybooking" && (
                    <View
                      style={{
                        width: "100%",
                        paddingVertical: vs(9),
                        marginTop: vs(7),
                        backgroundColor: Colors.White,
                        paddingHorizontal: s(11)
                      }} >

                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: (windowWidth * 4) / 100,
                          color: Colors.theme_color,
                          textAlign: config.textRotate,
                        }}
                      >
                        {Lang_chg.Payment[config.language]}
                      </Text>
                      {this.state.hour_base_task_new != "" && (
                        <FlatList
                          data={this.state.hour_base_task_new}
                          renderItem={({ item, index }) => {
                            if (this.state.hour_base_task_new != "") {
                              return (
                                <View>
                                  {item.status == true && (
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        width: "100%",
                                        paddingVertical:
                                          (windowWidth * 3) / 100,
                                        justifyContent: "space-between",
                                        alignSelf: "center",
                                      }}
                                    >
                                      <Text
                                        style={{
                                          fontFamily: Font.ques_fontfamily,
                                          fontSize: Font.sregulartext_size,
                                          color: "#000",
                                          textAlign: config.textRotate,
                                        }}
                                      >
                                        {item.duration}
                                      </Text>
                                      <Text
                                        style={{
                                          fontFamily: Font.ques_fontfamily,
                                          fontSize: Font.sregulartext_size,
                                          color: "#000",
                                          width: "30%",
                                          textAlign: "right",
                                        }}
                                      >
                                        {item.price}{" "}
                                        {this.state.currency_symbol}
                                      </Text>
                                    </View>
                                  )}
                                </View>
                              );
                            }
                          }}
                        />
                      )}

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingVertical: (windowWidth * 2) / 100,
                          borderTopWidth: 1.5,
                          borderTopColor: Colors.backgroundcolor,
                          marginTop: (windowWidth * 2) / 100,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Font.ques_fontfamily,
                            fontSize: Font.sregulartext_size,
                            color: "#000",
                          }}
                        >
                          {item.distance_fare_text}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.ques_fontfamily,
                            fontSize: Font.sregulartext_size,
                            color: "#000",
                          }}
                        >
                          {item.distance_fare}.0{" "}
                          {this.state.currency_symbol}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingVertical: (windowWidth * 2) / 100,
                          borderTopWidth: 1.5,
                          borderTopColor: Colors.backgroundcolor,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: (windowWidth * 3.7) / 100,
                            color: Colors.theme_color,
                          }}
                        >
                          {Lang_chg.subTotal[config.language]}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: (windowWidth * 3.7) / 100,
                            color: Colors.theme_color,
                          }}
                        >
                          {this.state.subTotal} {this.state.currency_symbol}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          borderColor: Colors.bordercolor,
                          marginBottom: (windowWidth * 2) / 100,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Font.ques_fontfamily,
                            fontSize: Font.sregulartext_size,
                            color: "#000",
                          }}
                        >
                          {item.vat_text}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.ques_fontfamily,
                            fontSize: Font.sregulartext_size,
                            color: "#000",
                          }}
                        >
                          {this.state.vat_price_show_hourly}{" "}
                          {this.state.currency_symbol}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderTopWidth: 1.5,
                          borderTopColor: Colors.backgroundcolor,
                          marginBottom: (windowWidth * 2) / 100,
                          paddingTop: vs(5)
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: (windowWidth * 3.7) / 100,
                            color: Colors.theme_color,
                          }}
                        >
                          {Lang_chg.Total[config.language]}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: (windowWidth * 3.7) / 100,
                            color: Colors.theme_color,
                          }}
                        >
                          {this.state.hour_total_price}{" "}
                          {this.state.currency_symbol}
                        </Text>
                      </View>

                    </View>
                  )}
                </View>
              </View>
            )}
          </ScrollView>

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
                      paddingVertical: (windowWidth * 3) / 100,
                      marginTop: (windowWidth * 2) / 100,
                      paddingLeft: (windowWidth * 4) / 100,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={{
                        width: (windowWidth * 6) / 100,
                        height: (windowWidth * 6) / 100,
                      }}
                      source={Icons.logoPlain}
                    />
                    <Text
                      style={{
                        fontFamily: Font.Medium,
                        color: "#000",
                        fontSize: (windowWidth * 5) / 100,
                        paddingLeft: (windowWidth * 4) / 100,
                        width: "90%",
                        textAlign: config.textRotate,
                      }}
                      numberOfLines={2}
                    >
                      {Lang_chg.DeleteMember[config.language]}{this.state.first_name} {this.state.last_name}
                    </Text>
                  </View>

                  <View
                    style={{
                      paddingLeft: (windowWidth * 4) / 100,
                      width: "95%",
                      alignSelf: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Font.Regular,
                        color: "#000",
                        fontSize: (windowWidth * 4.4) / 100,
                        textAlign: config.textRotate,
                      }}
                    >
                      {Lang_chg.delete_msg[config.language]}
                    </Text>
                  </View>

                  <View
                    style={{
                      paddingBottom: (windowWidth * 5) / 100,
                      marginTop: (windowWidth * 9) / 100,
                      alignSelf: "flex-end",
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: (windowWidth * 3) / 100,
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
                          fontFamily: Font.Regular,
                          fontSize: (windowWidth * 4) / 100,
                          color: Colors.theme_color,
                          alignSelf: "center",
                          textAlign: config.textalign,
                        }}
                      >
                        {Lang_chg.no_txt[config.language]}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setTimeout(() => {
                          this.setState({ modalVisible3: false }),
                            this.delete_click();
                        }, 200);
                      }}
                      style={{
                        width: (windowWidth * 15) / 100,
                        flexDirection: "row",
                        alignSelf: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: Font.Regular,
                          fontSize: (windowWidth * 4) / 100,
                          color: Colors.theme_color,
                          alignSelf: "center",
                          textAlign: config.textalign,
                        }}
                      >
                        {Lang_chg.Delete[config.language]}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>

          {/* ------------------Checkout------------- */}
          <View
            style={{
              width: "100%",
              alignSelf: "center",
              backgroundColor: Colors.White,
              paddingHorizontal: (windowWidth * 5) / 100,
              paddingVertical: (windowWidth * 2) / 100,
              height: 80,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.state.providerType === "doctor"
                  ? this.submitButtonForDoctor()
                  : this.state.providerType === "lab"
                    ? this.state.indexPosition === 0
                      ? this.submit_btn()
                      : this.submit_btn_hourly()
                    : this.state.display == "hourlybooking"
                      ? this.submit_btn_hourly()
                      : this.submit_btn();
              }}
              style={{
                width: "100%",
                borderRadius: (windowWidth * 3) / 100,
                backgroundColor: Colors.Theme,
                paddingVertical: (windowWidth * 3) / 100,
              }}
            >
              <Text
                style={{
                  color: Colors.White,
                  fontFamily: Font.Medium,
                  fontSize: Font.buttontextsize,
                  alignSelf: "flex-end",
                  textAlign: config.textalign,
                  alignSelf: "center",
                }}
              >
                {Lang_chg.PROCEEDTOcheckout[config.language]}
              </Text>
            </TouchableOpacity>
          </View>
        </View>


      );
    } else {
      return (
        <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>
          <ScreenHeader
            title={Lang_chg.Booking[config.language]}
            navigation={this.props.navigation}
            onBackPress={() => this.props.navigation.pop()}
            leftIcon={leftArrow}
            rightIcon={Notification}
          />
          {/* ============================error================================= */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.Error_popup}
            onRequestClose={() => {
              this.setState({ Error_popup: false });
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
                  width: (windowWidth * 90) / 100,
                  position: "absolute",
                  alignSelf: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 4,
                    width: "100%",
                    paddingVertical: (windowWidth * 6) / 100,
                  }}
                >
                  <Image
                    style={{
                      width: (windowWidth * 15) / 100,
                      height: (windowWidth * 15) / 100,
                      alignSelf: "center",
                    }}
                    source={Icons.logoPlain}
                  />
                  <Text
                    style={{
                      fontFamily: Font.Medium,
                      fontSize: (windowWidth * 5) / 100,
                      color: Colors.theme_color,
                      alignSelf: "center",
                      marginTop: (windowWidth * 6) / 100,
                    }}
                  >
                    {Lang_chg.we_wii_back[config.language]}
                  </Text>
                  {config.language == 0 && (
                    <Text
                      style={{
                        fontFamily: Font.Medium,
                        fontSize: (windowWidth * 5) / 100,
                        color: Colors.theme_color,
                        alignSelf: "center",
                      }}
                    >
                      {Lang_chg.promise[config.language]}
                    </Text>
                  )}

                  <Text
                    style={{
                      fontFamily: Font.Light,
                      color: "#000",
                      fontSize: (windowWidth * 3.8) / 100,
                      textAlign: "center",
                      marginTop: (windowWidth * 3) / 100,
                      width: "90%",
                      alignSelf: "center",
                    }}
                  >
                    {Lang_chg.our_sincere[config.language]}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Font.Regular,
                      color: "#000",
                      fontSize: (windowWidth * 5) / 100,
                      textAlign: "center",
                      marginTop: (windowWidth * 5) / 100,
                    }}
                  >
                    {Lang_chg.Bad_gateway[config.language]}
                  </Text>

                  <TouchableOpacity
                    style={{
                      paddingHorizontal: (windowWidth * 2) / 100,
                      paddingVertical: (windowWidth * 2) / 100,
                      alignSelf: "center",
                      borderWidth: 1,
                      borderColor: "#000",
                      borderRadius: 4,
                      marginTop: (windowWidth * 6) / 100,
                    }}
                    onPress={() => {
                      this.setState({ Error_popup: false });
                      setTimeout(() => {
                        this.props.navigation.goBack();
                      }, 200);
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Font.Regular,
                        fontSize: (windowWidth * 4) / 100,
                        alignSelf: "center",
                        color: "#000",
                      }}
                    >
                      {Lang_chg.Go_back[config.language]}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  agencydetailsheading: {
    backgroundColor: Colors.input_field_digi,

    fontFamily: Font.ques_fontfamily,
    borderRadius: (windowWidth * 1) / 100,
    color: "#4E4E4E",
    fontSize: (windowWidth * 3.5) / 100,
  },
  infoContainer: {
    paddingVertical: vs(11),
    backgroundColor: Colors.White,
    marginTop: vs(7),
    // shadowColor: Colors.Black,
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 0.3,
    // shadowRadius: 3,
    zIndex: 999
  },
  experienceContainer: {
    width: '100%',
    paddingVertical: vs(18),
    flexDirection: 'row',
    paddingHorizontal: s(11),
  },
  descContainer: {
    borderBottomWidth: 1.5,
    borderTopWidth: 1.5,
    borderBottomColor: Colors.backgroundcolor,
    borderTopColor: Colors.backgroundcolor,
    paddingTop: vs(11),
    paddingBottom: vs(15),
    paddingHorizontal: s(11),
  },
  timeContainer: {
    flexDirection: 'row',
    marginTop: vs(11),
    paddingHorizontal: s(11),
  },
});
