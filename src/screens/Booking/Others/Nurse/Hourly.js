import React, { Component, useEffect, useState } from "react";
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
  windowWidth,
  config,
  consolepro,
  Lang_chg,
  apifuntion,
  Icons,
  Button,
  ScreenHeader
} from "../Provider/utilslib/Utils";
import Styles from "../Styles";

import DoctorSymptomsAppointment from "../components/DoctorSymptomsAppointment";
import LabAppointment from "../components/LabAppointment";
import { dummyUser, GoldStar, leftArrow, Notification } from "../Icons/Index";
import { SvgXml } from "react-native-svg";
import { s, vs } from "react-native-size-matters";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";

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

const Booking = ({ navigation, route }) => {

  const { providerType, providerId, isFromHospital, indexPosition, family_member_id } = route.params
  const { address, loggedInUserDetails, guest, appLanguage } = useSelector(state => state.StorageReducer)

  const [statesData, setStatesData] = useState({
    languageIndex: appLanguage == 'en' ? 0 : 1,
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
    subTotal: '',
    hour_base_task_new: ''
  })
  const isFocused = useIsFocused()
  useEffect(() => {
    if (route.params.display != undefined) {
      let display = route.params.display;
      setState({
        display: display,
        set_task: (display == "taskbooking") ? "task_base" : "hour_base"
      });
    }
    providerType === "lab" ?
      getLabServices()
      : providerType === "doctor" ?
        getDoctorServices()
        : getServices();
    getDay();
    getPerson()
    resetState()
  }, [isFocused])

  const setState = payload => {
    setStatesData(prev => ({
      ...prev,
      ...payload
    }))
  }

  const resetState = () => {
    setState({
      // display: "taskbooking",
      task_base_task: "",
      task_base_task1: "",
      new_task_arr: "",
      // set_date: "",
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
      subTotal: '',
      hour_base_task_new: ''
    })
  }

  const getDay = () => {
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
    setState({ set_date: date1_show, check_currentdate: date1_show });

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
    setState({ date_array: arr });
  };

  const getDoctorTimeDate = async () => {
    let url = config.baseURL + "api-patient-doctor-next-date-time";

    var data = new FormData();
    data.append("provider_id", providerId);
    data.append("date", statesData.set_date);
    data.append("service_type", providerType);

    apifuntion
      .postApi(url, data)
      .then((obj) => {
        console.log("getDoctorTimeDate....... ", obj);
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
                if (statesData.check_currentdate == statesData.set_date) {
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
                  if (finaltime >= statesData.timcurrent_for_check) {
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

            setState({
              time_Arr: new_time_home,
              final_one: Arr1,
              final_arr2: Arr2,
            });
            let real_total = "";
            let real_total_show = "";
            let real_total_final = "";
            let show_real_price = "";
            let vat_price_new = statesData.booking_data.vat_price;
            let homeSubTotal = "";
            let homeVisitTotalPrice = "";
            let homeVat = "";

            if (vat_price_new != 0) {
              if (obj.result.home_visit_time != "") {
                console.log('If..............');
                if (statesData.booking_data.distance_fare != 0) {
                  console.log('If distance_fare..............');
                  real_total = "";
                  real_total_show = "";
                  real_total_final = "";
                  show_real_price = "";
                  homeSubTotal = parseFloat(
                    Number(
                      statesData.booking_data?.home_visit_task[0]?.task_price
                    ) + Number(statesData.booking_data.distance_fare)
                  ).toFixed(1);
                  // console.log("sub_total home_visit_task :: ", homeSubTotal);
                  real_total_show =
                    (parseFloat(
                      homeSubTotal +
                      Number(statesData.booking_data.distance_fare)
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
                  console.log('No distance_fare..............');
                  real_total = "";
                  real_total_show = "";
                  real_total_final = "";
                  show_real_price = "";
                  homeSubTotal = parseFloat(Number(statesData.booking_data?.home_visit_task[0]?.task_price)).toFixed(1);
                  real_total_show = (parseFloat(homeSubTotal) / 100) * vat_price_new;

                  real_total_final = real_total_show.toFixed(1);

                  // console.log("real_total_final home_visit_task:: ", real_total_final);
                  real_total = parseFloat(Number(homeSubTotal) + Number(real_total_final)).toFixed(1);

                  show_real_price = parseFloat(vat_price_new).toFixed(1);
                  homeVisitTotalPrice = real_total;
                  homeVat = real_total_final;
                }
              }
            } else {
              real_total_show =
                (statesData.booking_data.distance_fare / 100) * vat_price_new;
              real_total_final = real_total_show.toFixed(1);
              real_total = (
                parseFloat(vat_price_new) +
                parseFloat(statesData.booking_data.distance_fare)
              ).toFixed(1);
              show_real_price = parseFloat(vat_price_new).toFixed(1);
            }

            let sun_total = parseFloat(real_total).toFixed(1);

            setState({
              homeVisitSubTotalPrice: homeSubTotal,
              homeVisitVat: homeVat, //0.0,
              booking_data: statesData.booking_data,
              message: statesData.booking_data.message,
              vat_price: vat_price_new,
              distance_fare: statesData.booking_data.distance_fare,
              final_total_price: sun_total,
              homeVisitTaskPrice: homeVisitTotalPrice,
              hour_total_price: sun_total,
              vat_percent_used: statesData.booking_data.vat_text,
              hour_time: new_time_online,
              vat_price_show: real_total,
              vat_price_show_hourly: 0.0,
              distance_fare_pass: statesData.booking_data.distance_fare,
              final_one: Arr1,
              final_arr2: Arr2,
              only_vatprice_show: show_real_price,
            });
          } else {
            setState({ time_Arr: obj.result.home_visit_time });
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
              if (statesData.check_currentdate == statesData.set_date) {
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
                if (finaltime_hour >= statesData.timcurrent_for_check) {
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
            setState({
              hour_time: new_time_online,
              final_hour_one: online_Arr1,
              final_hour_two: online_Arr2,
            });
            let real_total = "";
            let real_total_show = "";
            let real_total_final = "";
            let show_real_price = "";
            let vat_price_new = statesData.booking_data.vat_price;
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
                  Number(statesData.booking_data.online_base_task[0].task_price)
                ).toFixed(1);
                // console.log("sub_total online_base_task :: ", onlineSubTotal);
                real_total_show = (onlineSubTotal / 100) * vat_price_new;
                real_total_final = parseFloat(real_total_show).toFixed(1);
                real_total = parseFloat(
                  Number(onlineSubTotal) + Number(real_total_final)
                ).toFixed(1);
                show_real_price = parseFloat(vat_price_new).toFixed(1);
                onlineTotalPrice = real_total;
                onlineVat = real_total_final;
              }
              if (isFromHospital) {
                onlineSubTotal = "";
                real_total = "";
                real_total_show = "";
                real_total_final = "";
                show_real_price = "";
                onlineSubTotal = parseFloat(
                  Number(statesData.booking_data.online_base_task[0].task_price)
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
                (statesData.booking_data.distance_fare / 100) * vat_price_new;
              real_total_final = real_total_show.toFixed(1);
              real_total = (
                parseFloat(vat_price_new) +
                parseFloat(statesData.booking_data.distance_fare)
              ).toFixed(1);
              show_real_price = parseFloat(vat_price_new).toFixed(1);
            }
            let sun_total = parseFloat(real_total).toFixed(1);

            setState({
              onlineSubTotalPrice: onlineSubTotal,
              onlineVisitVat: onlineVat, //0.0,
              booking_data: statesData.booking_data,
              message: statesData.booking_data.message,
              vat_price: vat_price_new,
              distance_fare: statesData.booking_data.distance_fare,
              final_total_price: sun_total,
              onlineTaskPrice: onlineTotalPrice,
              hour_total_price: sun_total,
              vat_percent_used: statesData.booking_data.vat_text,
              hour_time: new_time_online,
              vat_price_show: real_total,
              vat_price_show_hourly: 0.0,
              distance_fare_pass: statesData.booking_data.distance_fare,
              final_hour_one: online_Arr1,
              final_hour_two: online_Arr2,
              only_vatprice_show: show_real_price,
            });
          } else {
            setState({
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

  const getLabTimeDate = async () => {
    let url = config.baseURL + "api-patient-lab-next-date-time";

    var data = new FormData();
    data.append("provider_id", providerId);
    data.append("date", statesData.set_date);
    data.append("service_type", providerType);

    apifuntion
      .postApi(url, data)
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
                if (statesData.check_currentdate == statesData.set_date) {
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
                  if (finaltime >= statesData.timcurrent_for_check) {
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

            setState({
              time_Arr: newTaskTime,
              final_one: Arr1,
              final_arr2: Arr2,
            });
          } else {
            setState({
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

  const getTimeDate = async () => {
    let url = config.baseURL + "api-patient-next-date-time";

    var data = new FormData();
    data.append("provider_id", providerId);
    data.append("date", statesData.set_date);
    data.append("task_type", statesData.set_task);
    data.append("service_type", providerType);

    console.log('getTimeDate request.....', data);

    apifuntion
      .postApi(url, data)
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
                if (statesData.check_currentdate == statesData.set_date) {
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

                  if (finaltime >= statesData.timcurrent_for_check) {
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

            setState({
              time_Arr: new_time_dlot,
              final_one: Arr1,
              final_arr2: Arr2,
            });
          } else {
            setState({ time_Arr: obj.result.task_time });
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
              if (statesData.check_currentdate == statesData.set_date) {
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
                if (finaltime_hour >= statesData.timcurrent_for_check) {
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
            setState({
              hour_time: new_time_hourl,
              final_hour_one: hour_Arr1,
              final_hour_two: hour_Arr2,
            });
          } else {
            setState({
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

  const getPerson = async () => {
    let url = config.baseURL + "api-patient-family-member";

    var data = new FormData();
    data.append("user_id", loggedInUserDetails.user_id);

    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {

        if (obj.status == true) {
          setState({ person_arr: obj.result });
        } else {
          setState({ person_arr: obj.result });
          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
      });
  };

  const delete_click = async () => {
    let url = config.baseURL + "api-delete-patient-family-member";
    var data = new FormData();
    data.append("id", statesData.id);
    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {

        if (obj.status == true) {
          getPerson();
        } else {
          msgProvider.showError(obj.message);
          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
      });
  };

  const getData = (value) => {
    if (value.text != null) {
      statesData.symptomText = value.text;
    }
    if (value.audio != null) {
      statesData.symptomsRecording = value.audio;
    }
    if (value.tab != null) {
      setState({ indexPosition: value.tab, time_take_data: "" });
    }
    if (value.image != null) {
      statesData.prescriptionsImage = value.image;
    }
  }

  const getLabServices = async () => {
    setState({
      name: loggedInUserDetails.first_name,
      currency_symbol: loggedInUserDetails.currency_symbol
    });

    var current = new Date();
    let min =
      current.getMinutes() < 10
        ? "0" + current.getMinutes()
        : current.getMinutes();
    let hour =
      current.getHours() < 10 ? "0" + current.getHours() : current.getHours();
    var timcurrent = hour + ":" + min;
    setState({ timcurrent_for_check: timcurrent });
    if (loggedInUserDetails.image != null) {
      setState({
        profile_img: loggedInUserDetails.image
      });
    }
    let url =
      config.baseURL +
      (providerId !== "497"
        ? "api-patient-lab-booking-init-details"
        : "api-patient-rclab-booking-init-details");

    var data = new FormData();
    data.append("provider_id", providerId);
    data.append("lgoin_user_id", loggedInUserDetails.user_id);
    data.append("service_type", providerType);

    apifuntion
      .postApi(url, data)
      .then((obj) => {
        if (obj.status == true) {
          if (obj.result.task_base_task.length === 0) {
            setState({
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

          setState({
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
            setState({ display: "hourlybooking" });
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

          setState({
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
          setState({ Error_popup: true });
        }, 700);

        consolepro.consolelog("-------- error ------- " + error);
      });
  };

  const getDoctorServices = async () => {

    setState({
      name: loggedInUserDetails.first_name,
      currency_symbol: loggedInUserDetails.currency_symbol
    });

    var current = new Date();
    let min =
      current.getMinutes() < 10
        ? "0" + current.getMinutes()
        : current.getMinutes();
    let hour =
      current.getHours() < 10 ? "0" + current.getHours() : current.getHours();
    var timcurrent = hour + ":" + min;
    setState({ timcurrent_for_check: timcurrent });
    if (loggedInUserDetails.image != null) {
      setState({
        profile_img: loggedInUserDetails.image
      });
    }
    let url = config.baseURL + "api-patient-doctor-booking-init-details";

    var data = new FormData();
    data.append("provider_id", providerId);
    data.append("lgoin_user_id", loggedInUserDetails.user_id);
    data.append("service_type", providerType);

    apifuntion
      .postApi(url, data)
      .then((obj) => {
        console.log('getDoctorServices-response.....', obj.result);
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
                homeSubTotal = parseFloat(
                  Number(obj.result.home_visit_task[0].task_price) +
                  Number(obj.result.distance_fare)
                ).toFixed(1);

                console.log('..................homeSubTotal', homeSubTotal);
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
              } else {
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
            if (isFromHospital) {
              console.log('calculating hospital doc fare....');
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

          setState({
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
            setState({ display: "hourlybooking" });
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

          setState({
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
          setState({ Error_popup: true });
        }, 700);

        consolepro.consolelog("-------- error ------- " + error);
      });
  };

  const getServices = async () => {

    setState({
      name: loggedInUserDetails.first_name,
      currency_symbol: loggedInUserDetails.currency_symbol
    });

    var current = new Date();
    let min =
      current.getMinutes() < 10
        ? "0" + current.getMinutes()
        : current.getMinutes();
    let hour =
      current.getHours() < 10 ? "0" + current.getHours() : current.getHours();
    var timcurrent = hour + ":" + min;
    setState({ timcurrent_for_check: timcurrent });
    if (loggedInUserDetails.image != null) {
      setState({
        profile_img: loggedInUserDetails.image
      });
    }
    let url = config.baseURL + "api-patient-booking-init-details";

    var data = new FormData();
    data.append("provider_id", providerId);
    data.append("lgoin_user_id", loggedInUserDetails.user_id);
    data.append("service_type", providerType);

    apifuntion
      .postApi(url, data)
      .then((obj) => {
        console.log('getServices-res**********', obj.result);
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
            console.log('vat_price_new != 0');
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
            console.log('vat_price_new == 0');
            console.log({ real_total_show });
            real_total_show = (obj.result.distance_fare / 100) * vat_price_new;
            real_total_final = real_total_show.toFixed(1);
            console.log({ real_total_final });
            real_total = (parseFloat(vat_price_new) + parseFloat(obj.result.distance_fare)).toFixed(1);
            console.log({ real_total });
            show_real_price = parseFloat(vat_price_new).toFixed(1);
            console.log({ show_real_price });

          }
          let sun_total = parseFloat(real_total).toFixed(2);
          console.log({ sun_total });
          setState({
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
            setState({ display: "hourlybooking" });
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

          setState({
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
          setState({ Error_popup: true });
        }, 700);

        consolepro.consolelog("getServices-error ------- " + error);
      });
  };

  const submitButtonForDoctor = async () => {
    Keyboard.dismiss();
    let subTotalPrice =
      indexPosition === 0
        ? statesData.onlineSubTotalPrice
        : statesData.homeVisitSubTotalPrice;
    let vatPrice =
      indexPosition === 0
        ? statesData.onlineVisitVat
        : statesData.homeVisitVat;
    let totalPrice =
      indexPosition === 0
        ? statesData.onlineTaskPrice
        : statesData.homeVisitTaskPrice;
    let distance =
      indexPosition === 0 ? "" : statesData.distance_fare_pass;
    let taskType =
      indexPosition === 0 ? "online_task" : "home_visit";
    let appointmentType = indexPosition === 0 ? "online" : "offline";


    if (statesData.time_take_data.length <= 0) {
      msgProvider.showError(msgText.EmptyTime[statesData.languageIndex]);
      return false;
    }


    let url = config.baseURL + "api-patient-insert-cart";
    var data = new FormData();

    data.append(
      "hospital_id",
      isFromHospital ? hospitalId : ""
    );
    data.append("service_type", providerType);
    data.append("login_user_id", loggedInUserDetails.user_id);
    data.append("currency_symbol", statesData.currency_symbol);
    data.append("family_member_id", family_member_id);
    data.append("provider_id", providerId);
    data.append("task_id", statesData.final_data);
    data.append("task_price", statesData.set_price);
    data.append("task_type", taskType);
    data.append("from_date", statesData.set_date);
    data.append("from_time", statesData.time_take_data);
    data.append("appointment_type", appointmentType);
    data.append("vat_percent_used", "" + statesData.vat_price);
    data.append("task_price_total", statesData.set_price);
    data.append("vat_price", vatPrice);
    data.append("distance_fare", distance);
    data.append("sub_total_price", subTotalPrice);
    data.append("total_price", totalPrice);
    data.append("symptom_text", statesData.symptomText);

    if (statesData.booking_data.distancetext != '' && statesData.booking_data.distancetext != null && statesData.booking_data.distancetext != undefined) {
      data.append('distance', statesData.booking_data.distancetext)
    } else {
      data.append('distance', '')
    }


    if (statesData.prescriptionsImage != "") {
      data.append("upload_prescription", {
        uri: statesData.prescriptionsImage,
        type: "image/jpg",
        name: statesData.prescriptionsImage,
      });
    }

    if (statesData.symptomsRecording != "") {
      data.append("symptom_recording", {
        uri: statesData.symptomsRecording,
        type: "audio/m4a",
        name: statesData.symptomsRecording,
      });
    }

    // console.log('submitButtonForDoctor', data);
    // return
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        if (obj.status == true) {
          // localStorage.setItemString('cartTime', moment().format('x'))
          setTimeout(() => {
            navigation.navigate("Cart", { providerType: providerType });
          }, 700);
        } else {
          // if (obj.active_status == msgTitle.deactivate[statesData.languageIndex] || obj.msg[statesData.languageIndex] == msgTitle.usererr[statesData.languageIndex]) {
          //   usernotfound.loginFirst(props, obj.msg[statesData.languageIndex])
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
        setState({ loading: false });
      });
  };

  const submit_btn = async () => {
    Keyboard.dismiss();
    if (providerType === "lab") {
      if (indexPosition === 0) {
        if (statesData.select_task.length <= 0) {
          msgProvider.showError(msgText.EmptyTask[statesData.languageIndex]);
          return false;
        }
      } else {
        if (statesData.hour_id.length <= 0) {
          msgProvider.showError(msgText.EmptyTask[statesData.languageIndex]);
          return false;
        }
      }
    } else {
      if (statesData.select_task.length <= 0) {
        msgProvider.showError(msgText.EmptyTask[statesData.languageIndex]);
        return false;
      }
    }

    if (statesData.time_take_data.length <= 0) {
      msgProvider.showError(msgText.EmptyTime[statesData.languageIndex]);
      return false;
    }

    let url = config.baseURL + "api-patient-insert-cart";
    var data = new FormData();



    if (providerType === "lab") {
      data.append("hospital_id", statesData.booking_data.hospital_id);
    }
    data.append("service_type", providerType);
    data.append("login_user_id", loggedInUserDetails.user_id);
    data.append("currency_symbol", statesData.currency_symbol);
    data.append("family_member_id", family_member_id);
    data.append("provider_id", providerId);
    data.append("task_id", statesData.final_data);
    data.append("task_price", statesData.set_price);
    data.append("task_type", "task_base");
    data.append("from_date", statesData.set_date);
    data.append("from_time", statesData.time_take_data);
    data.append("appointment_type", "online");
    data.append("vat_percent_used", statesData.vat_price);

    data.append("vat_price", statesData.vat_price_show);
    data.append("distance_fare", statesData.distance_fare_pass);
    data.append("task_price_total", statesData.total_price_show);
    data.append("sub_total_price", statesData.subTotal);
    data.append("total_price", statesData.final_total_price);

    if (statesData.booking_data.distancetext != '' && statesData.booking_data.distancetext != null && statesData.booking_data.distancetext != undefined) {
      data.append('distance', statesData.booking_data.distancetext)
    } else {
      data.append('distance', '')
    }

    apifuntion
      .postApi(url, data)
      .then((obj) => {
        if (obj.status == true) {
          // localStorage.setItemString('cartTime', moment().format('x'))
          // msgProvider.toast(msgText.sucess_message_login[statesData.languageIndex])
          setTimeout(() => {
            navigation.navigate("Cart", { providerType: providerType })
          }, 700);
        } else {
          // if (obj.active_status == msgTitle.deactivate[statesData.languageIndex] || obj.msg[statesData.languageIndex] == msgTitle.usererr[statesData.languageIndex]) {
          //   usernotfound.loginFirst(props, obj.msg[statesData.languageIndex])
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
        setState({ loading: false });
      });
  };

  const submit_btn_hourly = async () => {
    Keyboard.dismiss();
    if (statesData.hour_id.length <= 0) {
      msgProvider.showError(msgText.EmptyTask[statesData.languageIndex]);
      return false;
    }

    if (statesData.time_take_data_hour.length <= 0) {
      msgProvider.showError(msgText.EmptyTime[statesData.languageIndex]);
      return false;
    }

    var taskBase = providerType === "lab" ? "package_base" : "hour_base";

    let url = config.baseURL + "api-patient-insert-cart";
    var data = new FormData();

    if (providerType === "lab") {
      data.append("hospital_id", statesData.booking_data.hospital_id);
    }
    data.append("service_type", providerType);
    data.append("login_user_id", loggedInUserDetails.user_id);
    data.append("currency_symbol", statesData.currency_symbol);
    data.append("family_member_id", family_member_id);
    data.append("provider_id", providerId);
    data.append("task_id", statesData.hour_id);
    data.append("task_price", statesData.hour_price);
    data.append("task_type", taskBase);
    data.append("from_date", statesData.set_date);
    data.append("from_time", statesData.time_take_data_hour);
    data.append("appointment_type", "online");
    data.append("vat_percent_used", statesData.vat_price);

    data.append("vat_price", statesData.vat_price_show_hourly);
    data.append("distance_fare", statesData.distance_fare_pass);
    data.append("task_price_total", statesData.hour_total_amount);
    data.append("sub_total_price", statesData.subTotal);
    data.append("total_price", statesData.hour_total_price);

    if (statesData.booking_data.distancetext != '' && statesData.booking_data.distancetext != null && statesData.booking_data.distancetext != undefined) {
      data.append('distance', statesData.booking_data.distancetext)
    } else {
      data.append('distance', '')
    }
    // console.log(data);
    // return false
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        if (obj.status == true) {
          // localStorage.setItemString('cartTime', moment().format('x'))
          // msgProvider.toast(msgText.sucess_message_login[statesData.languageIndex])
          setTimeout(() => {
            navigation.navigate("Cart", { providerType: providerType })
          }, 700);
        } else {
          // if (obj.active_status == msgTitle.deactivate[statesData.languageIndex] || obj.msg[statesData.languageIndex] == msgTitle.usererr[statesData.languageIndex]) {
          //   usernotfound.loginFirst(props, obj.msg[statesData.languageIndex])
          // } else {
          setTimeout(() => {
            msgProvider.alert("", obj.message, false);
          }, 700);
          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
        setState({ loading: false });
      });
  };

  const searchFilterFunction = (text) => {
    setState({ name_new: text });

    //  let task_base_task1=statesData.task_base_task
    let data1 = statesData.task_base_task1;
    if (data1 != "") {
      const newData = data1.filter((item) => {
        //applying filter for the inserted text in search bar

        const textData = text.toLowerCase();
        return item.name.toLowerCase().indexOf(textData) >= 0;
      });
      if (newData.length > 0) {
        setState({ task_base_task: newData });
      } else if (newData.length <= 0) {
        setState({ task_base_task: "" });
      }
    }
  };



  const hourbooking = (item, index) => {
    let data = statesData.hour_base_task;

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
      statesData.only_vatprice_show == 0 ||
      statesData.only_vatprice_show == "0.0"
    ) {
      show_total_price = 0 //statesData.vat_price_show;
      subTotal = parseFloat(
        parseInt(statesData.distance_fare_pass) + parseInt(prize)
      ).toFixed(1);
      hour_add = parseFloat(
        parseInt(statesData.distance_fare_pass) +
        parseInt(prize)
        // parseFloat(statesData.vat_price_show)
      ).toFixed(1);
    } else {

      let vat_sum_per = prize;
      subTotal = parseFloat(
        parseInt(statesData.distance_fare_pass) + parseInt(vat_sum_per)
      ).toFixed(1);
      real_total_show = (subTotal / 100) * statesData.vat_price;
      real_total_final = real_total_show.toFixed(2);
      real_total = Number(real_total_final);
      show_total_price = real_total;
      hour_add = parseFloat(
        parseInt(statesData.distance_fare_pass) +
        parseInt(prize) +
        parseFloat(show_total_price)
      ).toFixed(1);
    }
    setState({
      hour_base_task: data,
      hour_base_task_new: data,
      hour_total_amount: prize,
      vat_price_show_hourly: show_total_price,
      hour_total_price: hour_add,
      subTotal: subTotal,
    });
  };

  const check_all = (index) => {
    let data = statesData.task_base_task;
    let totalSelected = 0;
    let comma_arr = [];
    let price_arr = [];
    if (index != -1) {
      if (data[index].status == true) {
        data[index].status = false;
      } else {
        if (data[index].status == false) {
          data[index].status = true;
        }
      }
      for (let i = 0; i < data.length; i++) {
        if (data[i].status == true) {
          totalSelected = totalSelected + 1
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
        parseFloat(sum) + parseFloat(statesData.distance_fare_pass); //sum
      subTotal = vat_sum_per.toFixed(1);

      if (
        statesData.only_vatprice_show == 0 ||
        statesData.only_vatprice_show == "0.0"
      ) {
        real_total = 0 //parseFloat(statesData.vat_price_show_display).toFixed(1);
        show_total_price = parseFloat(
          parseInt(statesData.distance_fare_pass) + sum
        ).toFixed(1);
      } else {
        real_total_show = (vat_sum_per / 100) * statesData.vat_price;
        real_total_final = real_total_show.toFixed(2);
        real_total = real_total_final;
        show_total_price = parseFloat(
          parseInt(statesData.distance_fare_pass) + parseFloat(real_total) + sum
        ).toFixed(2);
      }

      let final_data = comma_arr.toString();
      let set_price = price_arr.toString();
      let total_sum = parseInt(sum);

      setState({
        subTotal: subTotal,
        task_base_task: data,
        select_task: comma_arr,
        final_data: final_data,
        set_price: set_price,
        sum_arr: price_arr,
        total_price_show: total_sum,
        vat_price_show: real_total,
        vat_price_show_display: real_total,
        distance_fare: show_total_price,
        final_total_price: show_total_price,
      })
      if (totalSelected != 0) {
        console.log('totalSelected', totalSelected);
        setState({
          new_task_arr: data
        })
      } else {
        setState({
          new_task_arr: ''
        })
      }
    }
  };
  const checkDate = (item, index) => {
    let data = statesData.date_array;

    for (let i = 0; i < data.length; i++) {
      if (i == index) {
        data[i].tick = 1;
      } else {
        data[i].tick = 0;
      }
    }
    setState({ date_array: data });
  };

  const time_tick = (item, index) => {
    let data = statesData.time_Arr;

    for (let i = 0; i < data.length; i++) {
      if (i == index) {
        data[i].time_status = true;
      } else {
        data[i].time_status = false;
      }
    }
    setState({ time_Arr: data });
  };

  const hour_time_tick = (item, index) => {
    let data = statesData.hour_time;

    for (let i = 0; i < data.length; i++) {
      if (i == index) {
        data[i].time_status = true;
      } else {
        data[i].time_status = false;
      }
    }
    setState({ hour_time: data });
  };


  const check_all_false = (index) => {
    let totalSelected = 0;
    let price_arr = [];
    let data = statesData.new_task_arr;

    if (index != -1) {
      if (data[index].status == true) {
        data[index].status = false;
      } else {
        if (data[index].status == false) {
          data[index].status = true;
        }
      }
      for (let i = 0; i < data.length; i++) {
        if (data[i].status == true) {
          totalSelected = totalSelected + 1
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
      setState({
        task_base_task: data,
        total_price_show: sum,
      });
      if (totalSelected != 0) {
        setState({
          new_task_arr: data
        })
      } else {
        setState({
          new_task_arr: ''
        })
      }
    }
  };

  const unCheck_all = (tab) => {
    let data = tab === 0 ? statesData.new_task_arr : statesData.booking_data.hour_base_task;

    for (let i = 0; i < data.length; i++) {
      if (data[i].status == true) {
        data[i].status = false;
      }
    }

    setState({
      // task_base_task: data,
      new_task_arr: data,
    });

  };

  if (statesData.booking_data != "" && statesData.booking_data != null) {

    var item = statesData.booking_data;
    if (providerType === "doctor") {
      statesData.set_task =
        indexPosition === 0
          ? item.online_base_text
          : item.home_visit_text;

      statesData.final_data =
        indexPosition === 0
          ? item.online_base_task[0].id
          : item.home_visit_task[0].id;

      statesData.set_price =
        indexPosition === 0
          ? item.online_base_task[0].task_price
          : item.home_visit_task[0].task_price;
    }


    return (
      <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>

        <ScreenHeader
          title={Lang_chg.Booking[statesData.languageIndex]}
          navigation={navigation}
          onBackPress={() => navigation.pop()}
          leftIcon
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
                    color: Colors.detailTitles,
                    alignSelf: 'flex-start'
                  }}>
                  {item.provider_name}
                </Text>
                {
                  providerType != 'lab' &&
                  <Text
                    style={{
                      fontFamily: Font.Regular,
                      fontSize: Font.small,
                      alignSelf: 'flex-start',
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
                    alignSelf: 'flex-start',
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
                    alignSelf: 'flex-start',
                    color: Colors.lightGrey,
                    marginTop: vs(2)
                  }}>
                  {providerType === 'lab' ? Lang_chg.ESTABLISHED[statesData.languageIndex] : Lang_chg.Experience[statesData.languageIndex]}
                </Text>
                <Text
                  style={{
                    fontFamily: Font.Medium,
                    fontSize: Font.xlarge,
                    alignSelf: 'flex-start',
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
                    alignSelf: 'flex-start',
                    color: Colors.lightGrey,
                    marginTop: vs(2),
                    paddingHorizontal: s(15)
                  }}>
                  {Lang_chg.Bookings[statesData.languageIndex]}
                </Text>
                <Text
                  style={{
                    fontFamily: Font.Medium,
                    fontSize: Font.xlarge,
                    alignSelf: 'flex-start',
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
                    alignSelf: 'flex-start',
                    color: Colors.lightGrey,
                    marginTop: vs(2),
                    paddingHorizontal: s(15)
                  }}>
                  {Lang_chg.Rating[statesData.languageIndex]}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(15), marginTop: vs(5), }}>
                  <SvgXml xml={GoldStar} height={s(14)} width={s(14)} style={{}} />
                  <Text
                    style={{
                      fontFamily: Font.Medium,
                      fontSize: Font.xlarge,
                      alignSelf: 'flex-start',
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
                    alignSelf: 'flex-start',
                    color: Colors.detailTitles,
                  }}>
                  {item.description}
                </Text>
              </View>
            }

          </View>



          {providerType === "doctor" && (
            <DoctorSymptomsAppointment
              navigation={navigation}
              indexPosition={indexPosition}
              isFromHospital={isFromHospital}
              sendData={(val) => {
                getData(val)
              }}
              resetState={() => {
                providerType === "lab" ?
                  getLabServices()
                  : providerType === "doctor" ?
                    getDoctorServices()
                    : getServices();
                getDay();
                getPerson()
                resetState()
              }}
            />
          )}

          {providerType === "lab" && (
            <LabAppointment
              navigation={navigation}
              indexPosition={indexPosition}
              data={item}
              sendData={(val) => {
                getData(val)
              }}
              resetState={() => {
                providerType === "lab" ?
                  getLabServices()
                  : providerType === "doctor" ?
                    getDoctorServices()
                    : getServices();
                getDay();
                getPerson()
                resetState()
              }}
            />
          )}

          {providerType === "lab" ? (
            <View>
              {indexPosition === 0 && (
                <View
                  style={{
                    width: "100%",
                    alignSelf: "center",
                    backgroundColor: Colors.White,
                  }}>
                  <View
                    style={{
                      width: "100%",
                      backgroundColor: Colors.White,
                      right: 0,
                      alignSelf: "flex-end",
                    }}>
                    <FlatList
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingHorizontal: s(13) }}
                      data={statesData.new_task_arr}
                      renderItem={({ item, index }) => {
                        if (statesData.new_task_arr != "") {
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
                                      check_all_false(item, index);
                                    }}
                                  >

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
                    }}>
                    <View
                      style={{
                        width: "100%",
                        alignSelf: "center",
                        flexDirection: "row",
                        paddingHorizontal: s(11)
                      }}>
                      <TextInput
                        ref={(text) => {
                          textdata = text;
                        }}
                        maxLength={50}
                        onChangeText={(text) => {
                          searchFilterFunction(text);
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
                          textAlign: statesData.languageIndex == 0 ? 'left' : 'right',
                        }}
                        placeholderTextColor={"#8F98A7"}
                        placeholder={Lang_chg.SearchTests[statesData.languageIndex]}
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

                  {statesData.task_base_task != "" &&
                    statesData.task_base_task != null && (
                      <>

                        <View
                          style={[
                            {
                              width: "100%",
                              alignSelf: "center",
                              marginTop: (windowWidth * 2) / 100,
                            },
                            statesData.task_base_task.length >= 4
                              ? { height: 200 }
                              : null,
                          ]}>
                          <FlatList
                            data={statesData.task_base_task}
                            scrollEnabled={true}
                            nestedScrollEnabled={true}
                            renderItem={({ item, index }) => {
                              if (statesData.task_base_task != "") {
                                return (
                                  <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => {
                                      check_all(index);
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
                                        onPress={() => {
                                          check_all(index);
                                        }}
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
                                          alignSelf: 'flex-start',
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
                                      {statesData.currency_symbol}
                                    </Text>
                                  </TouchableOpacity>
                                );
                              }
                            }}
                          />
                        </View>
                      </>

                    )}
                </View>
              )}
              {indexPosition === 1 && (
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
                    ItemSeparatorComponent={() => {
                      return (
                        <View style={{ width: s(10) }}></View>
                      )
                    }}
                    renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            hourbooking(item, index),
                              getLabTimeDate(),
                              setState({
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
                                borderColor: Colors.Theme,
                                borderWidth: 1.5,
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
                              alignSelf: 'flex-start',
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
                      textAlign: 'left',
                      fontSize: (windowWidth * 3.5) / 100,
                    }}
                  >
                    {Lang_chg.Appointmentschedule[statesData.languageIndex]}
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
                        marginLeft: (windowWidth * 1) / 100,

                      }}
                    >
                      {statesData.set_date}
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
                      alignSelf: 'flex-start',
                      color: "#000",
                    }}
                  >
                    {Lang_chg.SelectDate[statesData.languageIndex]}
                  </Text>
                  <View style={{ width: "100%" }}>
                    <FlatList
                      horizontal={true}
                      data={statesData.date_array}
                      showsHorizontalScrollIndicator={false}
                      renderItem={({ item, index }) => {
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              setState({
                                set_date: item.date1,
                                set_task: "task_base",
                                time_take_data: "",
                              })
                              getLabTimeDate(),
                                checkDate(item, index)
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
                      alignSelf: 'flex-start',
                    }}
                  >
                    {Lang_chg.Select_start_time[statesData.languageIndex]}
                  </Text>

                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  >
                    <View style={{ width: "100%", alignItems: "center" }}>
                      <View style={{ width: "100%", alignItems: "center" }}>
                        {statesData.time_Arr != "" ? (
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
                                data={statesData.final_one}
                                renderItem={({ item, index }) => {
                                  return (
                                    <TouchableOpacity
                                      onPress={() => {
                                        indexPosition === 0
                                          ? setState({
                                            time_take_data: item.time,
                                          })
                                          : setState({
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
                                            (indexPosition === 0
                                              ? statesData.time_take_data
                                              : statesData.time_take_data_hour)
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
                                data={statesData.final_arr2}
                                renderItem={({ item, index }) => {
                                  return (
                                    <TouchableOpacity
                                      onPress={() => {
                                        indexPosition === 0
                                          ? setState({
                                            time_take_data: item.time,
                                          })
                                          : setState({
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
                                            (indexPosition === 0
                                              ? statesData.time_take_data
                                              : statesData.time_take_data_hour)
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
                            {Lang_chg.noTime[statesData.languageIndex]}
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

                {/* Payment section for labs*/}
                <View
                  style={{
                    width: "100%",
                    paddingVertical: vs(9),
                    marginTop: vs(7),
                    backgroundColor: Colors.White,
                  }}>
                  <View
                    style={{
                      width: "90%",
                      alignSelf: "center",
                    }}>
                    <View>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: (windowWidth * 4) / 100,
                          color: Colors.theme_color,
                          alignSelf: 'flex-start',
                        }}
                      >
                        {Lang_chg.Payment[statesData.languageIndex]}
                      </Text>
                    </View>

                    {statesData.new_task_arr != "" && (
                      <FlatList
                        data={statesData.new_task_arr}
                        renderItem={({ item, index }) => {
                          if (statesData.new_task_arr != "") {
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
                                        alignSelf: 'flex-start',
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
                                      {statesData.currency_symbol}
                                    </Text>
                                  </View>
                                )}
                              </View>
                            );
                          }
                        }}
                      />
                    )}
                    {statesData.hour_base_task_new != "" && (
                      <FlatList
                        data={statesData.hour_base_task_new}
                        renderItem={({ item, index }) => {
                          if (statesData.hour_base_task_new != "") {
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
                                        alignSelf: 'flex-start',
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
                                      {statesData.currency_symbol}
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
                      }}>
                      <Text
                        style={{
                          fontFamily: Font.ques_fontfamily,
                          fontSize: Font.sregulartext_size,
                          color: "#000",
                        }}
                      >
                        {`${item.distance_fare_text} ${item?.distancetext == '' ? '' : `(${item.distancetext})`}`}

                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.ques_fontfamily,
                          fontSize: Font.sregulartext_size,
                          color: "#000",
                        }}>
                        {(statesData.new_task_arr != "" || statesData.hour_base_task_new != '') ? `${item.distance_fare}.0  ${statesData.currency_symbol}` : `${statesData.currency_symbol}`}

                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingVertical: (windowWidth * 2) / 100,
                        borderTopWidth: 1.5,
                        borderColor: Colors.backgroundcolor,
                      }}>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: (windowWidth * 3.7) / 100,
                          color: Colors.theme_color,
                        }}>
                        {Lang_chg.subTotal[statesData.languageIndex]}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: (windowWidth * 3.7) / 100,
                          color: Colors.theme_color,
                        }}>
                        {(statesData.new_task_arr != "" || statesData.hour_base_task_new != '') ? `${statesData.subTotal}.0  ${statesData.currency_symbol}` : `${statesData.currency_symbol}`}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: (windowWidth * 1) / 100,
                        borderColor: Colors.backgroundcolor,
                        marginBottom: (windowWidth * 2) / 100,
                      }}>
                      <Text
                        style={{
                          fontFamily: Font.ques_fontfamily,
                          fontSize: Font.sregulartext_size,
                          color: "#000",
                        }}>
                        {item.vat_text}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.ques_fontfamily,
                          fontSize: Font.sregulartext_size,
                          color: "#000",
                        }}>

                        {
                          ((statesData.new_task_arr != "" || statesData.hour_base_task_new != '') && indexPosition === 0) ?
                            `${statesData.vat_price_show_display} ${statesData.currency_symbol}`
                            :
                            ((statesData.new_task_arr != "" || statesData.hour_base_task_new != '') && indexPosition === 1) ?
                              `${statesData.vat_price_show_hourly} ${statesData.currency_symbol}`
                              :
                              ` ${statesData.currency_symbol}`
                        }

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
                      }}>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: (windowWidth * 3.7) / 100,
                          color: Colors.theme_color,
                        }}>
                        {Lang_chg.Total[statesData.languageIndex]}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: (windowWidth * 3.7) / 100,
                          color: Colors.theme_color,
                        }}>
                        {
                          ((statesData.new_task_arr != "" || statesData.hour_base_task_new != '') && indexPosition === 0) ?
                            `${statesData.final_total_price} ${statesData.currency_symbol}`
                            :
                            ((statesData.new_task_arr != "" || statesData.hour_base_task_new != '') && indexPosition === 1) ?
                              `${statesData.hour_total_price} ${statesData.currency_symbol}`
                              :
                              ` ${statesData.currency_symbol}`
                        }
                      </Text>
                    </View>


                  </View>
                </View>

              </View>
            </View>
          ) : providerType === "doctor" ? (
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
                        textAlign: 'left',
                        color: Colors.detailTitles
                      }}
                    >
                      {Lang_chg.Appointmentschedule[statesData.languageIndex]}
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
                        {statesData.set_date}
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
                      alignSelf: 'flex-start',
                      color: Colors.detailTitles,
                    }}
                  >
                    {Lang_chg.SelectDate[statesData.languageIndex]}
                  </Text>
                  {indexPosition === 1 ? (
                    <View style={{ width: "100%" }}>
                      <FlatList
                        horizontal={true}
                        data={statesData.date_array}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                          return (
                            <TouchableOpacity
                              onPress={() => {
                                setState({
                                  set_date: item.date1,
                                  set_task: item.home_visit_text,
                                  time_take_data: "",
                                }, () => {
                                  getDoctorTimeDate(),
                                    checkDate(item, index)
                                })
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
                        data={statesData.date_array}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                          return (
                            <TouchableOpacity
                              onPress={() => {
                                setState({
                                  set_date: item.date1,
                                  set_task: item.online_base_text,
                                  time_take_data_hour: "",
                                }, () => {
                                  getDoctorTimeDate(),
                                    checkDate(item, index)
                                })
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
                      alignSelf: 'flex-start',
                    }}
                  >
                    {Lang_chg.Select_start_time[statesData.languageIndex]}
                  </Text>

                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  >
                    <View style={{ width: "100%", alignItems: "center" }}>
                      {indexPosition === 1 ? (
                        <View
                          style={{ width: "100%", alignItems: "center" }}
                        >
                          {statesData.time_Arr != "" ? (
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
                                  data={statesData.final_one}
                                  renderItem={({ item, index }) => {
                                    return (
                                      <TouchableOpacity
                                        onPress={() => {
                                          setState({
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
                                              statesData.time_take_data
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
                                  data={statesData.final_arr2}
                                  renderItem={({ item, index }) => {
                                    return (
                                      <TouchableOpacity
                                        onPress={() => {
                                          setState({
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
                                              statesData.time_take_data
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
                                fontSize: Font.medium,
                                alignSelf: "center",
                                paddingVertical: (windowWidth * 3) / 100,
                                textAlign: "center",
                                marginLeft: (windowWidth * 25) / 100,
                              }}
                            >
                              {Lang_chg.noTime[statesData.languageIndex]}
                            </Text>
                          )}
                        </View>
                      ) : (
                        <View
                          style={{ width: "100%", alignItems: "center" }}
                        >
                          {statesData.hour_time != "" ? (
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
                                  data={statesData.final_hour_one}
                                  renderItem={({ item, index }) => {
                                    return (
                                      <TouchableOpacity
                                        onPress={() => {
                                          setState({
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
                                              statesData.time_take_data
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
                                  data={statesData.final_hour_two}
                                  renderItem={({ item, index }) => {
                                    return (
                                      <TouchableOpacity
                                        onPress={() => {
                                          setState({
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
                                              statesData.time_take_data
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
                                fontSize: Font.medium,
                                alignSelf: "center",
                                paddingVertical: (windowWidth * 3) / 100,
                                textAlign: "center",
                                marginLeft: (windowWidth * 25) / 100,
                              }}
                            >
                              {Lang_chg.noTime[statesData.languageIndex]}
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  </ScrollView>
                </View>
              </View>

              <View>


                {/* Payment section for Docs */}
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
                          alignSelf: 'flex-start',
                        }}
                      >
                        {Lang_chg.Payment[statesData.languageIndex]}
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
                            alignSelf: 'flex-start',
                          }} >
                          {indexPosition === 0
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
                          {indexPosition === 0
                            ? item.online_base_task[0].task_price
                            : item.home_visit_task[0].task_price}{" "}
                          {statesData.currency_symbol}
                        </Text>
                      </View>
                      {indexPosition === 1 && (
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingVertical: vs(10),
                            marginTop: (windowWidth * 2) / 100,
                          }}>
                          <Text
                            style={{
                              fontFamily: Font.Regular,
                              fontSize: Font.small,
                              color: Colors.detailTitles,
                            }}>
                            {`${item.distance_fare_text} ${item?.distancetext == '' ? '' : `(${item.distancetext})`}`}

                          </Text>
                          <Text
                            style={{
                              fontFamily: Font.ques_fontfamily,
                              fontSize: Font.sregulartext_size,
                              color: "#000",
                            }}>
                            {item.distance_fare}.0{" "}
                            {statesData.currency_symbol}
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
                          {Lang_chg.subTotal[statesData.languageIndex]}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: (windowWidth * 3.7) / 100,
                            color: Colors.theme_color,
                          }}>
                          {indexPosition === 0
                            ? statesData.onlineSubTotalPrice
                            : statesData.homeVisitSubTotalPrice}{" "}
                          {statesData.currency_symbol}
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
                          {indexPosition === 0
                            ? statesData.onlineVisitVat
                            : statesData.homeVisitVat}{" "}
                          {statesData.currency_symbol}
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
                          {Lang_chg.Total[statesData.languageIndex]}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: (windowWidth * 3.7) / 100,
                            color: Colors.theme_color,
                          }}
                        >
                          {indexPosition === 0
                            ? statesData.onlineTaskPrice
                            : statesData.homeVisitTaskPrice}{" "}
                          {statesData.currency_symbol}
                        </Text>
                      </View>
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
                }}>
                {/* ------------Appoitment Tabs---------- */}

                {item.task_base_enable == 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setState({
                        display: "taskbooking",
                        set_task: "task_base",
                      });
                      providerType === "lab" ?
                        getLabServices()
                        : providerType === "doctor" ?
                          getDoctorServices()
                          : getServices();
                      getDay();
                      getPerson()
                      resetState()
                    }}
                    style={{ width: "50%", alignSelf: "center" }}
                  >
                    <View style={{ width: "100%" }}>
                      <Text
                        style={
                          statesData.display == "taskbooking"
                            ? {
                              color: Colors.Blue,
                              fontFamily: Font.Medium,
                              fontSize: (windowWidth * 4) / 100,
                              alignSelf: 'flex-start',
                              alignSelf: "center",
                              paddingVertical: (windowWidth * 3) / 100,
                            }
                            : {
                              color: Colors.tablightcolo,
                              fontFamily: Font.Medium,
                              fontSize: (windowWidth * 4) / 100,
                              alignSelf: 'flex-start',
                              alignSelf: "center",
                              paddingVertical: (windowWidth * 3) / 100,
                            }
                        }
                      >
                        {Lang_chg.TaskBooking[statesData.languageIndex]}
                      </Text>

                      <View
                        style={
                          statesData.display == "taskbooking"
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
                      setState({
                        display: "hourlybooking",
                        set_task: "hour_base",
                      });
                      providerType === "lab" ?
                        getLabServices()
                        : providerType === "doctor" ?
                          getDoctorServices()
                          : getServices();
                      getDay();
                      getPerson()
                      resetState()
                    }}
                    style={{ width: "50%", alignSelf: "center" }}
                  >
                    <View style={{ width: "100%" }}>
                      <Text
                        style={
                          statesData.display == "hourlybooking"
                            ? {
                              color: Colors.Blue,

                              fontFamily: Font.Medium,
                              fontSize: (windowWidth * 4) / 100,
                              alignSelf: 'flex-start',
                              alignSelf: "center",
                              paddingVertical: (windowWidth * 3) / 100,
                            }
                            : {
                              color: Colors.tablightcolo,
                              fontFamily: Font.Medium,
                              fontSize: (windowWidth * 4) / 100,
                              alignSelf: 'flex-start',
                              alignSelf: "center",
                              paddingVertical: (windowWidth * 3) / 100,
                            }
                        }
                      >
                        {Lang_chg.HourlyBooking[statesData.languageIndex]}
                      </Text>

                      <View
                        style={
                          statesData.display == "hourlybooking"
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

                {/* -------------------------------------- */}

              </View>

              {/* ------------Appoitment Tabs Data---------- */}
              {statesData.display == "taskbooking" && (
                <View
                  style={{
                    width: "100%",
                    alignSelf: "center",
                    backgroundColor: "#fff",
                  }} >
                  <View
                    style={{
                      width: "95%",
                      right: 0,
                      alignSelf: "flex-end",
                    }}>
                    {/* ----------------Selected Tasks--------------- */}
                    <FlatList
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      data={statesData.new_task_arr}
                      renderItem={({ item, index }) => {
                        if (statesData.new_task_arr != "") {
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
                                      check_all_false(item, index);
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
                          textdata = text;
                        }}
                        maxLength={50}
                        onChangeText={(text) => {
                          searchFilterFunction(text);
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
                          textAlign: statesData.languageIndex == 0 ? 'left' : 'right',
                        }}
                        placeholderTextColor={"#8F98A7"}
                        placeholder={Lang_chg.Searchtask[statesData.languageIndex]}
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

                  {statesData.task_base_task != "" &&
                    statesData.task_base_task != null && (
                      <View
                        style={[
                          {
                            width: "100%",
                            alignSelf: "center",
                            marginTop: (windowWidth * 2) / 100,
                          },
                          statesData.task_base_task.length >= 4
                            ? { height: 200 }
                            : null,
                        ]}
                      >
                        <FlatList
                          data={statesData.task_base_task}
                          scrollEnabled={true}
                          nestedScrollEnabled={true}
                          renderItem={({ item, index }) => {
                            if (statesData.task_base_task != "") {
                              return (
                                <TouchableOpacity
                                  activeOpacity={0.9}
                                  onPress={() => {
                                    check_all(index);
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
                                      onPress={() => {
                                        check_all(index);
                                      }}
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
                                        alignSelf: 'flex-start',
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
                                    {statesData.currency_symbol}
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

              {statesData.display == "hourlybooking" && (
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
                            hourbooking(item, index),
                              getTimeDate(),
                              setState({
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
                                borderColor: Colors.Theme,
                                borderWidth: 1.5,
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
                            {item.price} {statesData.currency_symbol}
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
                          // alignSelf: 'flex-start',
                          textAlign: 'left',
                          color: Colors.detailTitles
                        }}
                      >
                        {Lang_chg.Appointmentschedule[statesData.languageIndex]}
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
                          {statesData.set_date}
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
                        alignSelf: 'flex-start',
                        color: Colors.detailTitles,
                      }}
                    >
                      {Lang_chg.SelectDate[statesData.languageIndex]}
                    </Text>
                    {statesData.display == "taskbooking" ? (
                      <View style={{ width: "100%" }}>
                        <FlatList
                          horizontal={true}
                          data={statesData.date_array}
                          showsHorizontalScrollIndicator={false}
                          renderItem={({ item, index }) => {
                            return (
                              <TouchableOpacity
                                onPress={() => {
                                  setState({
                                    set_date: item.date1,
                                    set_task: "task_base",
                                    time_take_data: "",
                                  })
                                  getTimeDate(),
                                    checkDate(item, index)
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
                          data={statesData.date_array}
                          showsHorizontalScrollIndicator={false}
                          renderItem={({ item, index }) => {
                            return (
                              <TouchableOpacity
                                onPress={() => {
                                  setState({
                                    set_date: item.date1,
                                    set_task: "hour_base",
                                    time_take_data_hour: "",
                                  })
                                  getTimeDate(),
                                    checkDate(item, index)
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
                        alignSelf: 'flex-start',
                      }}
                    >
                      {Lang_chg.Select_start_time[statesData.languageIndex]}
                    </Text>

                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                    >
                      <View style={{ width: "100%", alignItems: "center" }}>
                        {statesData.display == "taskbooking" ? (
                          <View style={{ width: "100%", alignItems: "center" }}>
                            {statesData.time_Arr != "" ? (
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
                                    data={statesData.final_one}
                                    renderItem={({ item, index }) => {
                                      return (
                                        <TouchableOpacity
                                          onPress={() => {
                                            setState({
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
                                                statesData.time_take_data
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
                                    data={statesData.final_arr2}
                                    renderItem={({ item, index }) => {
                                      return (
                                        <TouchableOpacity
                                          onPress={() => {
                                            setState({
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
                                                statesData.time_take_data
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
                                  fontSize: Font.medium,
                                  alignSelf: "center",
                                  paddingVertical: (windowWidth * 3) / 100,
                                  textAlign: "center",
                                  marginLeft: (windowWidth * 25) / 100,
                                }}
                              >
                                {Lang_chg.noTime[statesData.languageIndex]}
                              </Text>
                            )}
                          </View>
                        ) : (
                          <View
                            style={{ width: "100%", alignItems: "center" }}
                          >
                            {statesData.hour_time != "" ? (
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
                                    data={statesData.final_hour_one}
                                    renderItem={({ item, index }) => {
                                      return (
                                        <TouchableOpacity
                                          onPress={() => {
                                            setState({
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
                                                statesData.time_take_data_hour
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
                                    data={statesData.final_hour_two}
                                    renderItem={({ item, index }) => {
                                      return (
                                        <TouchableOpacity
                                          onPress={() => {
                                            setState({
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
                                                statesData.time_take_data_hour
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
                                  fontSize: Font.medium,
                                  alignSelf: "center",
                                  paddingVertical: (windowWidth * 3) / 100,
                                  textAlign: "center",
                                  marginLeft: (windowWidth * 25) / 100,
                                }}
                              >
                                {Lang_chg.noTime[statesData.languageIndex]}
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

                {/* Payment section for task and hour */}
                {statesData.display == "taskbooking" && (
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
                        alignSelf: 'flex-start',
                      }} >
                      {Lang_chg.Payment[statesData.languageIndex]}
                    </Text>
                    {statesData.new_task_arr != "" && (
                      <FlatList
                        data={statesData.new_task_arr}
                        renderItem={({ item, index }) => {
                          if (statesData.new_task_arr != "") {
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
                                        alignSelf: 'flex-start',
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
                                      {statesData.currency_symbol}
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
                        {`${item.distance_fare_text} ${item?.distancetext == '' ? '' : `(${item.distancetext})`}`}

                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.ques_fontfamily,
                          fontSize: Font.sregulartext_size,
                          color: "#000",
                        }}
                      >
                        {statesData.new_task_arr != '' ? `${item.distance_fare}.0 ${statesData.currency_symbol}` : `${statesData.currency_symbol}`}
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
                        {Lang_chg.subTotal[statesData.languageIndex]}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: (windowWidth * 3.7) / 100,
                          color: Colors.theme_color,
                          // marginTop: windowWidth * 1 / 100,
                        }}>
                        {statesData.new_task_arr != '' ? `${statesData.subTotal} ${statesData.currency_symbol}` : `${statesData.currency_symbol}`}

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
                        }}>
                        {statesData.new_task_arr != '' ? `${statesData.vat_price_show_display} ${statesData.currency_symbol}` : `${statesData.currency_symbol}`}
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
                        {Lang_chg.Total[statesData.languageIndex]}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: (windowWidth * 3.7) / 100,
                          color: Colors.theme_color,
                        }} >
                        {statesData.new_task_arr != '' ? `${statesData.final_total_price} ${statesData.currency_symbol}` : `${statesData.currency_symbol}`}
                      </Text>
                    </View>

                    {/* <Appbtn
                            onPresshandler={() => {
                              submit_btn();
                            }}
                            title={Lang_chg.PROCEEDTOcheckout[statesData.languageIndex]}
                          /> */}
                  </View>
                )}
                {statesData.display == "hourlybooking" && (
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
                        alignSelf: 'flex-start',
                      }}
                    >
                      {Lang_chg.Payment[statesData.languageIndex]}
                    </Text>
                    {statesData.hour_base_task_new != "" && (
                      <FlatList
                        data={statesData.hour_base_task_new}
                        renderItem={({ item, index }) => {
                          if (statesData.hour_base_task_new != "") {
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
                                    }}>
                                    <Text
                                      style={{
                                        fontFamily: Font.ques_fontfamily,
                                        fontSize: Font.sregulartext_size,
                                        color: "#000",
                                        alignSelf: 'flex-start',
                                      }}>
                                      {item.duration}
                                    </Text>
                                    <Text
                                      style={{
                                        fontFamily: Font.ques_fontfamily,
                                        fontSize: Font.sregulartext_size,
                                        color: "#000",
                                        width: "30%",
                                        textAlign: "right",
                                      }}>
                                      {item.price}{" "}
                                      {statesData.currency_symbol}
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
                        }}>
                        {`${item.distance_fare_text} ${item?.distancetext == '' ? '' : `(${item.distancetext})`}`}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.ques_fontfamily,
                          fontSize: Font.sregulartext_size,
                          color: "#000",
                        }}>
                        {statesData.hour_base_task_new != '' ? `${item.distance_fare} ${statesData.currency_symbol}` : `${statesData.currency_symbol}`}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingVertical: (windowWidth * 2) / 100,
                        borderTopWidth: 1.5,
                        borderTopColor: Colors.backgroundcolor,
                      }}>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: (windowWidth * 3.7) / 100,
                          color: Colors.theme_color,
                        }}>
                        {Lang_chg.subTotal[statesData.languageIndex]}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: (windowWidth * 3.7) / 100,
                          color: Colors.theme_color,
                        }}>
                        {statesData.hour_base_task_new != '' ? `${statesData.subTotal} ${statesData.currency_symbol}` : `${statesData.currency_symbol}`}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        borderColor: Colors.bordercolor,
                        marginBottom: (windowWidth * 2) / 100,
                      }}>
                      <Text
                        style={{
                          fontFamily: Font.ques_fontfamily,
                          fontSize: Font.sregulartext_size,
                          color: "#000",
                        }}>
                        {item.vat_text}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.ques_fontfamily,
                          fontSize: Font.sregulartext_size,
                          color: "#000",
                        }}>
                        {statesData.hour_base_task_new != '' ? `${statesData.vat_price_show_hourly} ${statesData.currency_symbol}` : `${statesData.currency_symbol}`}
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
                      }}>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: (windowWidth * 3.7) / 100,
                          color: Colors.theme_color,
                        }}>
                        {Lang_chg.Total[statesData.languageIndex]}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: (windowWidth * 3.7) / 100,
                          color: Colors.theme_color,
                        }}>
                        {statesData.hour_base_task_new != '' ? `${statesData.hour_total_price} ${statesData.currency_symbol}` : `${statesData.currency_symbol}`}
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
          visible={statesData.modalVisible3}
          onRequestClose={() => {
            setState({ modalVisible3: false });
          }}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              setState({ modalVisible3: false });
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
                      alignSelf: 'flex-start',
                    }}
                    numberOfLines={2}
                  >
                    {Lang_chg.DeleteMember[statesData.languageIndex]}{statesData.first_name} {statesData.last_name}
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
                      alignSelf: 'flex-start',
                    }}
                  >
                    {Lang_chg.delete_msg[statesData.languageIndex]}
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
                      setState({ modalVisible3: false });
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
                        alignSelf: 'flex-start',
                      }}
                    >
                      {Lang_chg.no_txt[statesData.languageIndex]}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setTimeout(() => {
                        setState({ modalVisible3: false }),
                          delete_click();
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
                        alignSelf: 'flex-start',
                      }}
                    >
                      {Lang_chg.Delete[statesData.languageIndex]}
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

          <Button
            text={Lang_chg.PROCEEDTOcheckout[statesData.languageIndex]}
            onPress={() => {
              providerType === "doctor"
                ? submitButtonForDoctor()
                : providerType === "lab"
                  ? indexPosition === 0
                    ? submit_btn()
                    : submit_btn_hourly()
                  : statesData.display == "hourlybooking"
                    ? submit_btn_hourly()
                    : submit_btn();
            }}
          />

        </View>
      </View>


    );
  } else {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>
        <ScreenHeader
          title={Lang_chg.Booking[statesData.languageIndex]}
          navigation={navigation}
          onBackPress={() => navigation.pop()}
          leftIcon
        />
        {/* ============================error================================= */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={statesData.Error_popup}
          onRequestClose={() => {
            setState({ Error_popup: false });
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
                  {Lang_chg.we_wii_back[statesData.languageIndex]}
                </Text>
                {statesData.languageIndex == 0 && (
                  <Text
                    style={{
                      fontFamily: Font.Medium,
                      fontSize: (windowWidth * 5) / 100,
                      color: Colors.theme_color,
                      alignSelf: "center",
                    }}
                  >
                    {Lang_chg.promise[statesData.languageIndex]}
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
                  {Lang_chg.our_sincere[statesData.languageIndex]}
                </Text>
                <Text
                  style={{
                    fontFamily: Font.Regular,
                    color: "#000",
                    fontSize: (windowWidth * 5) / 100,
                    textAlign: "center",
                    marginTop: (windowWidth * 5) / 100,
                  }}>
                  {Lang_chg.Bad_gateway[statesData.languageIndex]}
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
                    setState({ Error_popup: false });
                    setTimeout(() => {
                      navigation.goBack();
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
                    {Lang_chg.Go_back[statesData.languageIndex]}
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

export default Booking;