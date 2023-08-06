import React, { Component, useEffect, useState } from "react";
import HTMLView from "react-native-htmlview";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
  PermissionsAndroid,
  TouchableHighlight,
} from "react-native";
import firestore from '@react-native-firebase/firestore'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { SkypeIndicator } from "react-native-indicators";
import {
  Colors,
  Font,
  windowHeight,
  msgProvider,
  config,
  windowWidth,
  Icons,
  LangProvider,
  apifuntion,
  Button,
  ScreenHeader
} from "../Provider/Utils/Utils";
import StarRating from "react-native-star-rating";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import moment from "moment-timezone";
import RNFetchBlob from "rn-fetch-blob";
import { s, vs } from "react-native-size-matters";
import Modal from "react-native-modal";
import { SvgXml } from "react-native-svg";
import { Chat, contactUs, Cross, dummyUser, Info, rightBlue, VideoCall, whiteStar } from "../Icons/Index";
import RatingBottomSheet from "../components/RatingBottomSheet";
import PrescriptionBottomSheet from "../components/PrescriptionBottomSheet";
import ContactUsBottomSheet from "../components/ContactUsBottomSheet";
import { useDispatch, useSelector } from "react-redux";
import { AudioPlayer } from "../components/AudioPlayer";
import NoInternet from "../components/NoInternet";
import Loader from "../components/Loader";
import { getISChatImplemented } from "../Provider/AppFunctions";
import { setVideoCall, setVideoCallData } from "../Redux/Actions";


export default AppointmentDetails = ({ navigation, route }) => {

  const { loggedInUserDetails, languageIndex, deviceConnection, contentAlign, selectedProvider } = useSelector(state => state.StorageReducer)
  const dispatch = useDispatch()


  const { appointment_id, send_id, booking_type, status } = route?.params


  const [classStateData, setClassStateData] = useState({
    modalVisible: false,
    modalPatientPrescription: false,
    viewPrescriptionImage: "",
    appointmentDetails: "",
    slot_booking_id: "",
    task_details: "",
    time_take_data: "",
    rating: 0,
    emailfocus: false,
    textLength: 0,
    reviewText: '',
    modalVisiblerating: false,
    new_task_type: "",
    showPatientDetails: false,
    isContactUsModal: false,
    isLoading: false,
    isScheduleagain: false,
    isPlay: false,
    isLoadingDetails: true,
    isChat: false,
  })
  const [isDownloading, setIsDownloading] = useState(false)
  const insets = useSafeAreaInsets()

  const setState = payload => {
    setClassStateData(prev => ({
      ...prev,
      ...payload
    }))
  }

  useEffect(() => {
    get_day();
  }, [classStateData.modalVisible])

  useEffect(() => {
    if (deviceConnection) {
      getAllDetails(0);
    }
  }, [deviceConnection])


  const getAllDetails = async (page) => {
    let url = config.baseURL + "api-patient-appointment-details";
    var data = new FormData();
    data.append("id", appointment_id);
    data.append("service_type", status);

    apifuntion
      .postApi(url, data, page)
      .then((obj) => {
        // console.log("getAllDetails....", obj.result.app_date);
        // console.log("getAllDetails....", obj.result.app_time);
        if (obj.status == true) {
          setState(
            {
              appointmentDetails: obj.result,
              message: obj.message,
            });
          if (obj.result.acceptance_status === 'Accepted' || obj.result.acceptance_status === 'Completed') {
            if (getISChatImplemented(obj.result.app_date, obj.result.app_time)) {
              firestore()
                .collection(`Chats-${config.mode}`)
                .doc(obj.result?.order_id)
                .onSnapshot(documentSnapshot => {
                  if (!documentSnapshot.exists) {
                    setState({ isChat: false })
                  } else {
                    const roomDetails = documentSnapshot.data()
                    setState({ isChat: false })
                  }
                })
            } else {
              setState({ isChat: true })
            }
          } else {
            setState({ isChat: false })
          }
        } else {
          setState({ appointmentDetails: obj.result, message: obj.message, });
          return false;
        }
      })
      .catch((error) => {
        console.log("getAllDetails-error ------- " + error);
      }).finally(() => {
        setState({ isLoadingDetails: false });

      })
  };

  const rescdule_click = async () => {

    setState({ isScheduleagain: true })
    let url =
      config.baseURL +
      (status === "lab"
        ? "api-patient-lab-reschedule-appointment"
        : status === "doctor"
          ? "api-patient-doctor-reschedule-appointment"
          : "api-patient-reschedule-appointment");

    var data = new FormData();
    data.append("login_user_id", loggedInUserDetails?.user_id);
    data.append("order_id", appointment_id);
    data.append("service_type", status);
    if (status === "lab") {
      data.append("task_type", booking_type);
    }

    // console.log("data", data);
    // return
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        // console.log("rescdule_click:....", JSON.stringify(obj));
        if (obj.status == true) {
          var current = new Date();
          let min =
            current.getMinutes() < 10
              ? "0" + current.getMinutes()
              : current.getMinutes();
          let hour =
            current.getHours() < 10
              ? "0" + current.getHours()
              : current.getHours();
          var timcurrent = hour + ":" + min;
          setState({ timcurrent_for_check: timcurrent });
          let time_slot = obj.result.task_time;

          if (obj.result.task_time != "") {
            var names = obj.result.task_time;
            var nameArr = names.split(",");

            const new_time_dlot = [];
            const Arr1 = [];
            const Arr2 = [];
            var ar1 = false;
            var ar2 = true;

            if (obj.result.task_time != "") {
              for (let l = 0; l < nameArr.length; l++) {
                if (classStateData.check_currentdate == classStateData.set_date) {
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
                  console.log({ finaltime });
                  console.log('classStateData.timcurrent_for_check', classStateData.timcurrent_for_check);
                  if (finaltime >= timcurrent) {
                    new_time_dlot.push({
                      time: nameArr[l],
                      time_status: false,
                    });
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
                  if (!ar1) {
                    ar1 = true;
                    ar2 = false;
                    Arr1.push({ time: nameArr[l], time_status: false });
                  } else {
                    ar1 = false;
                    ar2 = true;
                    Arr2.push({ time: nameArr[l], time_status: false });
                  }
                  new_time_dlot.push({ time: nameArr[l], time_status: false });
                }
              }
            }
            console.log({ Arr1 });
            setState({
              time_Arr: new_time_dlot,
              final_one: Arr1,
              final_arr_two: Arr2,
            });

          } else {
            setState({
              time_Arr: [],
              final_one: [],
              final_arr_two: [],
            });
          }

          setState({
            set_date: obj.result.app_date,
            rescdule_data: obj.result,
            slot_booking_id: obj.result.slot_booking_id,
            message: obj.message,
            task_details: obj.result.task_details,
            new_task_type: obj.result.task_type,
          });
          setTimeout(() => {
            setState({ isScheduleagain: false, modalVisible: true })
          }, 700);

        } else {
          setState({ rescdule_data: obj.result, message: obj.message });
          return false;
        }
      })
      .catch((error) => {
        console.log("rescdule_click-error ------- " + error);
      });
  };

  const getDoctorTimeDate = async () => {
    setState({ isLoading: true })
    let url = config.baseURL + "api-patient-doctor-next-date-time";
    var data = new FormData();
    data.append("provider_id", send_id);
    data.append("date", classStateData.set_date);
    data.append("service_type", status);

    // console.log("data", data);
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        setState({ isLoading: false })
        if (obj.status == true) {
          // console.log("obj.result", obj.result);
          if (
            classStateData.rescdule_data.slot_booking_id === "HOMEVISIT_BOOKING"
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
                  if (classStateData.check_currentdate == classStateData.set_date) {
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
                    console.log(
                      "finaltime: ",
                      finaltime,
                      " classStateData.timcurrent_for_check",
                      classStateData.timcurrent_for_check
                    );
                    console.log(
                      "check: ",
                      finaltime >= classStateData.timcurrent_for_check,
                      l,
                      nameArr[l]
                    );
                    if (finaltime >= classStateData.timcurrent_for_check) {
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

              setState({
                time_Arr: new_time_home,
                final_one: Arr1,
                final_arr_two: Arr2,
              });
            } else {
              setState({ time_Arr: obj.result.home_visit_time });
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
                if (classStateData.check_currentdate == classStateData.set_date) {
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
                  if (finaltime_hour >= classStateData.timcurrent_for_check) {
                    new_time_online.push({
                      time: nameArr_time[m],
                      time_status: false,
                    });
                    console.log(
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
                  // console.log("-------- new_time_online else  ------- " + new_time_online);
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
              setState({
                time_Arr: new_time_online,
                // final_hour_one: online_Arr1,
                // final_hour_two: online_Arr2,
                final_one: online_Arr1,
                final_arr_two: online_Arr2,
              });
            } else {
              setState({
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
        setState({ isLoading: false })
        console.log("getDoctorTimeDate-error ------- " + error);
      });
  };

  const getLabTimeDate = async () => {
    setState({ isLoading: true })

    let url = config.baseURL + "api-patient-lab-next-date-time";

    var data = new FormData();
    data.append("provider_id", send_id);
    data.append("date", classStateData.set_date);
    data.append("service_type", status);

    apifuntion
      .postApi(url, data)
      .then((obj) => {
        setState({ isLoading: false })
        if (obj.status == true) {
          var current = new Date();
          let min =
            current.getMinutes() < 10
              ? "0" + current.getMinutes()
              : current.getMinutes();
          let hour =
            current.getHours() < 10
              ? "0" + current.getHours()
              : current.getHours();
          var timcurrent = hour + ":" + min;
          setState({ timcurrent_for_check: timcurrent });
          console.log("obj.result", obj.result);
          if (
            classStateData.slot_booking_id == "TESTS_BOOKING" ||
            classStateData.slot_booking_id == "PACKAGE_BOOKING"
          ) {
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
                  if (classStateData.check_currentdate == classStateData.set_date) {
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
                    if (finaltime >= classStateData.timcurrent_for_check) {
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

              setState({
                time_Arr: new_time_dlot,
                final_one: Arr1,
                final_arr_two: Arr2,
              });
            } else {
              setState({ time_Arr: obj.result.task_time });
            }
          }
        } else {
          return false;
        }
      })
      .catch((error) => {
        setState({ isLoading: false })
        console.log("getLabTimeDate-error ------- " + error);
      });
  };

  const getTimeDate = async () => {
    setState({ isLoading: true })
    let url = config.baseURL + "api-patient-next-date-time";

    var data = new FormData();
    data.append("provider_id", send_id);
    data.append("date", classStateData.set_date);
    data.append("task_type", classStateData.set_task);
    data.append("service_type", status);
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        setState({ isLoading: false })
        if (obj.status == true) {
          var current = new Date();
          let min =
            current.getMinutes() < 10
              ? "0" + current.getMinutes()
              : current.getMinutes();
          let hour =
            current.getHours() < 10
              ? "0" + current.getHours()
              : current.getHours();
          var timcurrent = hour + ":" + min;
          setState({ timcurrent_for_check: timcurrent });
          console.log("obj.result", obj.result);
          if (classStateData.slot_booking_id == "TASK_BOOKING") {
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
                  if (classStateData.check_currentdate == classStateData.set_date) {
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
                    if (finaltime >= classStateData.timcurrent_for_check) {
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

              setState({
                time_Arr: new_time_dlot,
                final_one: Arr1,
                final_arr_two: Arr2,
              });
            } else {
              setState({ time_Arr: obj.result.task_time });
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
                if (classStateData.check_currentdate == classStateData.set_date) {
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
                  if (finaltime_hour >= classStateData.timcurrent_for_check) {
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
                }
              }
              setState({
                time_Arr: new_time_hourl,
                final_one: Arr_hour,
                final_arr_two: Arr2_hour,
              });
            } else {
              setState({ time_Arr: obj.result.hourly_time });
            }
          }
        } else {
          return false;
        }
      })
      .catch((error) => {
        setState({ isLoading: false })
        console.log("getTimeDate-error ------- " + error);
      });
  };

  const check_date = (item, index) => {
    let data = classStateData.date_array;
    // console.log("new data", data);

    for (let i = 0; i < data.length; i++) {
      if (i == index) {
        data[i].tick = 1;
      } else {
        data[i].tick = 0;
      }
    }

    setState({ date_array: data });
  };

  const get_day = () => {
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

  const submit_btn = async () => {

    if (classStateData.time_take_data.length <= 0) {
      msgProvider.showError(LangProvider.EmptyTime[languageIndex]);
      return false;
    }

    setState({ isScheduleagain: true })
    let url =
      config.baseURL +
      (status === "lab"
        ? "api-patient-update-lab-reschedule-appointment"
        : status === "doctor"
          ? "api-patient-update-doctor-reschedule-appointment"
          : "api-patient-update-reschedule-appointment");
    var data = new FormData();

    data.append("service_type", status);
    data.append("order_id", appointment_id);
    data.append("from_date", classStateData.set_date);
    data.append("from_time", classStateData.time_take_data);

    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        setState({ isScheduleagain: false })
        if (obj.status == true) {
          setState({ modalVisible: false });
          setTimeout(() => {
            msgProvider.showSuccess(obj.message);
            getAllDetails(1);
          }, 700);
        } else {
          setTimeout(() => {
            msgProvider.showError(obj.message);
          }, 700);
          return false;
        }
      })
      .catch((error) => {
        setState({ isScheduleagain: false })
        console.log("submit_btn-error ------- " + error);
        setState({ loading: false });
      });
  };

  const rateProvider = async () => {

    let url = config.baseURL + "api-patient-insert-review";
    var data = new FormData();
    console.log("data", data);
    data.append("lgoin_user_id", loggedInUserDetails?.user_id);
    data.append("service_type", status);
    data.append("order_id", classStateData.set_order);
    data.append("rating", classStateData.rating);
    data.append("review", classStateData.reviewText);
    data.append("provider_id", send_id);

    // console.log(data);

    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        if (obj.status == true) {
          setState({ modalVisiblerating: false });
          setTimeout(() => {
            msgProvider.showSuccess(obj.message);
            getAllDetails(1);
          }, 700);
        } else {
          // if (obj.active_status == LangProvider.deactivate[languageIndex] || obj.msg[languageIndex] == LangProvider.usererr[languageIndex]) {
          //   usernotfound.loginFirst(props, obj.msg[languageIndex])
          // } else {

          setTimeout(() => {
            msgProvider.alert("", obj.message, false);
          }, 700);
          // }
          return false;
        }
      })
      .catch((error) => {
        console.log("rateProvider-error ------- " + error);
        setState({ loading: false });
      });
  };

  const downloadPrescription = (imgUrl, filename) => {
    permissionFunc(imgUrl, filename);
  };

  const permissionFunc = async (imgUrl, filename) => {
    if (Platform.OS == "ios") {
      setIsDownloading(true)
      setTimeout(() => {
        actualDownload(imgUrl, filename);
      }, 1500);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setIsDownloading(true)
          setTimeout(() => {
            actualDownload(imgUrl, filename);
          }, 1500);
        } else {
          msgProvider.showError(
            "Grant storage permission to download the file"
          );
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const actualDownload = (imgUrl, filename) => {
    // console.log(imgUrl);
    // return
    const { dirs } = RNFetchBlob.fs;
    const dirToSave =
      Platform.OS == "ios" ? dirs.DocumentDir : dirs.DownloadDir;
    const AndroidConfig = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
        notification: true,
        mediaScannable: true,
        title: filename,
        path: `${dirToSave}/${filename}`,
      }
    };

    const IosConfig = {
      fileCache: true,
      title: filename,
      path: `${dirToSave}/${filename}`,
    };
    const configOptions = Platform.OS == 'ios' ? IosConfig : AndroidConfig

    RNFetchBlob.config(configOptions)
      .fetch("GET", imgUrl, {})
      .then((res) => {
        console.log('RNFetchBlob', res);
        if (Platform.OS === "ios") {
          msgProvider.showSuccess("File downloaded");
          setTimeout(() => {
            RNFetchBlob.fs.writeFile(IosConfig.path, res.data, "base64");
            RNFetchBlob.ios.previewDocument(IosConfig.path);
          }, 1000);
        }
        if (Platform.OS == "android") {
          msgProvider.showSuccess("File downloaded");
        }
        console.log("The file saved to ", res);
        // RNFetchBlob.fs.unlink(res)
      }).catch((e) => {
        msgProvider.showError(e.message);
        console.log("actualDownload-error", e.message);
      }).finally(() => {
        setIsDownloading(false)
      })
  };


  var item = classStateData.appointmentDetails;
  if (classStateData.isLoadingDetails) {

    return (
      <View style={{ flex: 1, }}>
        <ScreenHeader
          title={status === 'doctor' ? LangProvider.Consultation_Details[languageIndex] : status === 'lab' ? LangProvider.Lab_Test_Details[languageIndex] : LangProvider.Appointment_Details[languageIndex]}
          navigation={navigation}
          onBackPress={() => {
            navigation.pop()
          }}
          leftIcon
          rightIcon
        />
        <View style={{
          width: windowWidth,
          backgroundColor: Colors.White,
          paddingHorizontal: s(11),
          paddingVertical: vs(9),
          marginTop: vs(7)
        }}>

          <View
            style={{
              flexDirection: "row",
              width: '100%',
              paddingHorizontal: s(11),
            }}>
            <View style={{ width: "30%", }}>
              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item width={s(75)} height={s(75)} borderRadius={s(100)} />
              </SkeletonPlaceholder>
            </View>

            <View style={{ justifyContent: 'center' }}>
              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item width={(windowWidth * 20) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
              </SkeletonPlaceholder>
              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item width={(windowWidth * 30) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} style={{ marginTop: vs(7) }} />
              </SkeletonPlaceholder>
              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item width={(windowWidth * 20) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} style={{ marginTop: vs(7) }} />
              </SkeletonPlaceholder>
            </View>
          </View>
          <View style={{ width: '100%', height: 1.5, backgroundColor: Colors.backgroundcolor, marginTop: vs(7), marginBottom: vs(7) }}></View>

          <View>
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item width={(windowWidth * 12) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
            </SkeletonPlaceholder>

            <View style={{ flexDirection: 'row', marginTop: vs(7) }}>

              <View style={{ flex: 1 }}>
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width={(windowWidth * 10) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                </SkeletonPlaceholder>
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width={(windowWidth * 20) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} style={{ marginTop: vs(5) }} />
                </SkeletonPlaceholder>
              </View>

              <View style={{ flex: 1 }}>
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width={(windowWidth * 10) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                </SkeletonPlaceholder>
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width={(windowWidth * 20) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} style={{ marginTop: vs(5) }} />
                </SkeletonPlaceholder>
              </View>

              <View style={{ flex: 1 }}>
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width={(windowWidth * 10) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                </SkeletonPlaceholder>
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width={(windowWidth * 20) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} style={{ marginTop: vs(5) }} />
                </SkeletonPlaceholder>
              </View>

            </View>
          </View>
        </View>
      </View>
    )

  } else {
    const chatOptions = {
      provider: {
        id: item.provider_id,
        name: item?.provider_name,
        image: config.img_url3 + item?.provider_image,
        service: item?.service_type,
      },
      patient: {
        id: item?.patient_id,
        name: item?.patient_name,
        image: config.img_url3 + loggedInUserDetails?.image,
        address: item?.patient_address
      },
      appointment: {
        id: item?.id,
        order: item?.order_id,
        date: item?.app_date,
        status: item?.acceptance_status
      }

    }
    /* check video call button enable or not */
    var videoCallButton = false;
    var currentDate = moment().unix();
    var appointmentDate = moment(item.app_date).format("YYYY-MM-DD");
    var appointmentTime = item.from_time;
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
    // console.log("videoCallButton:: ", videoCallButton);

    /* check video call button enable or not */

    let tempArr = []
    var otpList = [];
    if ((item?.OTP != null && item?.OTP != '')) {
      let OTP = item?.OTP
      if (languageIndex == 1) {
        OTP = OTP.split("").reverse().join("");
      }
      OTP = OTP?.split('')
      for (let index = 0; index < OTP.length; index++) {
        tempArr.push(OTP[index])
      }
      otpList = tempArr
    }

    return (
      <View pointerEvents={isDownloading ? 'none' : 'auto'} style={{ flex: 1 }}>

        <ScreenHeader
          title={status === 'doctor' ? LangProvider.Consultation_Details[languageIndex] : status === 'lab' ? LangProvider.Lab_Test_Details[languageIndex] : LangProvider.Appointment_Details[languageIndex]}
          navigation={navigation}
          onBackPress={() => {
            navigation.pop()
          }}
          leftIcon
          rightIcon
        />

        <KeyboardAwareScrollView
          // keyboardOpeningTime={200}
          extraScrollHeight={50}
          enableOnAndroid={true}
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{
            justifyContent: 'center',
            paddingBottom: vs(30),
          }}
          showsVerticalScrollIndicator={false}>

          <View
            style={{
              paddingVertical: vs(9),
              backgroundColor: Colors.White,
              marginTop: vs(7),
            }}
          >

            {/* booking heading */}

            <View
              style={{
                flexDirection: "row",
                justifyContent: 'space-between',
                width: "100%",
                alignSelf: "center",
                borderBottomWidth: 1.5,
                borderBottomColor: Colors.backgroundcolor,
                paddingBottom: vs(5),
                paddingHorizontal: s(13),
              }}>
              <Text
                style={{
                  fontSize: Font.small,
                  fontFamily: Font.Medium,
                  color: Colors.Theme
                }}
              >
                {item.order_id}
              </Text>
              <Text
                style={{
                  fontSize: Font.small,
                  fontFamily: Font.Medium,
                  color: item?.acceptance_status === 'Pending' ? Colors.Yellow : (item?.acceptance_status === 'Completed' || item?.acceptance_status === 'Accepted') ? Colors.Green : Colors.Red,
                }}
              >
                {item.acceptance_status}
              </Text>
            </View>

            {/* --------------User Info------------ */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: vs(11),
                paddingHorizontal: s(13),
              }}>
              <View style={{ width: "28%", alignSelf: "center" }}>
                {
                  (item.provider_image == "NA" || item.provider_image == null || item.provider_image == "") ?
                    <SvgXml xml={dummyUser} style={{
                      alignSelf: "center",
                      marginTop: vs(5)
                    }} />
                    :
                    <Image
                      source={{ uri: config.img_url3 + item.provider_image }}
                      style={{ height: s(75), width: s(75), borderRadius: s(85), borderWidth: 0.5, borderColor: Colors.Highlight }}
                    />
                }
              </View>

              <View
                style={{
                  width: "60%",
                }}>
                <View
                  style={{
                    flexDirection: "row",
                  }}>
                  <Text
                    style={{
                      fontFamily: Font.Medium,
                      color: Colors.Theme,
                      fontSize: Font.small,
                      alignSelf: 'flex-start',
                    }}>
                    {item.service_type}
                  </Text>
                  {item.hospital_id != "" && (
                    <Text
                      style={{
                        color: "#FCFFFE",
                        backgroundColor: "#FFA800",
                        fontFamily: Font.Medium,
                        fontSize: Font.medium,
                        padding: (windowWidth * 2) / 100,
                        marginTop: -3,
                        marginLeft: 10,
                        paddingVertical: (windowWidth * 0.6) / 100,
                      }}
                    >
                      {LangProvider.Hospital[languageIndex]}
                    </Text>
                  )}
                </View>
                <Text
                  style={{
                    fontFamily: Font.Medium,
                    fontSize: Font.medium,
                    paddingVertical: (windowWidth * 1.1) / 100,
                    color: Colors.DarkGrey,
                    alignSelf: 'flex-start',
                  }}
                >
                  {item.provider_name}
                </Text>
                <Text
                  style={{
                    fontFamily: Font.Regular,
                    fontSize: Font.small,
                    color: Colors.DarkGrey,
                    alignSelf: 'flex-start',
                  }}
                >
                  {item.speciality}
                </Text>
              </View>
            </View>

            {/* -------------------- appointment details--------------------- */}
            <View
              style={{
                backgroundColor: Colors.appointmentdetaillightblue,
                paddingHorizontal: s(13),
                paddingVertical: vs(10)
              }}>
              <Text
                style={{
                  fontFamily: Font.Medium,
                  fontSize: Font.small,
                  color: Colors.darkText,
                  alignSelf: 'flex-start',
                  paddingBottom: (windowWidth * 3) / 100,
                }}
              >
                {LangProvider.appointment_schedule[languageIndex]}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}>

                <View
                  style={{
                    flex: 1,
                    marginTop: (windowWidth * 1) / 100,
                  }}>
                  <Text
                    style={{
                      fontFamily: Font.Regular,
                      fontSize: Font.small,
                      color: Colors.detailTitles,
                      alignSelf: 'flex-start',
                    }}
                  >
                    {LangProvider.Date[languageIndex]}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Font.Medium,
                      fontSize: Font.small,
                      color: Colors.detailTitles,
                      alignSelf: 'flex-start',
                      marginTop: vs(5)
                    }} >
                    {item.app_date}
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1.35,
                    marginTop: (windowWidth * 1) / 100,
                  }}>
                  <Text
                    style={{
                      fontFamily: Font.Regular,
                      fontSize: Font.small,
                      color: Colors.detailTitles,
                      alignSelf: 'flex-start',
                    }}
                  >
                    {LangProvider.Time[languageIndex]}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Font.Medium,
                      fontSize: Font.small,
                      color: Colors.detailTitles,
                      alignSelf: 'flex-start',
                      marginTop: vs(5)
                    }} >
                    {item.app_time}
                  </Text>
                </View>

                <View
                  style={{
                    flex: 0.65,
                    marginTop: (windowWidth * 1) / 100,
                  }}>
                  <Text
                    style={{
                      fontFamily: Font.Regular,
                      fontSize: Font.small,
                      color: Colors.detailTitles,
                      alignSelf: 'flex-start',
                    }}
                  >
                    {LangProvider.Type[languageIndex]}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Font.Medium,
                      fontSize: Font.small,
                      color: Colors.detailTitles,
                      alignSelf: 'flex-start',
                      textAlign: 'left',
                      marginTop: vs(5)
                    }} >
                    {item?.task_type}
                  </Text>
                </View>

              </View>

              <View
                style={{
                  width: "100%",
                  alignSelf: "center",
                  borderTopWidth: 1.5,
                  borderTopColor: '#D8D8D8',
                  marginTop: vs(10),
                  paddingTop: vs(8)
                }}>

                <View
                  style={{
                    width: "42%",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: 'center'
                  }}>
                  <Text
                    style={{
                      fontFamily: Font.Regular,
                      fontSize: Font.small,
                      color: Colors.DarkGrey,
                    }}>
                    {LangProvider.BookingOn[languageIndex]}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Font.Medium,
                      fontSize: Font.small,
                      color: Colors.DarkGrey,
                      textTransform: "uppercase",
                    }}>
                    {item.booking_date}
                  </Text>
                </View>
              </View>
            </View>



            {/* // patient symptom doctor */}
            {item.service_type == LangProvider.Doctor[languageIndex] &&
              (item.symptom_recording != "" ||
                item.symptom_text != "") && (
                <View
                  style={{
                    width: "100%",
                    alignSelf: "center",
                    backgroundColor: "#FDF7EB",
                    paddingVertical: vs(9),
                    paddingHorizontal: s(13)
                  }}>
                  <Text
                    style={{
                      fontFamily: Font.Medium,
                      fontSize: Font.small,
                      color: Colors.Theme,
                      alignSelf: 'flex-start',
                    }}>
                    {LangProvider.PATIENT_SYMPTOM[languageIndex]}
                  </Text>

                  {item.symptom_recording != "" && (
                    <View
                      style={{
                        width: "100%",
                        alignSelf: "center",
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderBottomWidth: 1.5,
                        borderColor: Colors.gainsboro,
                        paddingVertical: vs(5)
                      }}>
                      <Text
                        style={{
                          width: '30%',
                          fontFamily: Font.Medium,
                          fontSize: Font.small,
                          color: Colors.detailTitles,
                          textAlign: 'left',
                        }}
                      >
                        {LangProvider.Voice_Recording[languageIndex]}
                      </Text>

                      <View style={{ width: '70%' }}>
                        <AudioPlayer
                          url={config.img_url3 + item.symptom_recording}
                        />
                      </View>

                    </View>
                  )}

                  {(item.symptom_text != "" && item.symptom_text != null && item.symptom_text != undefined) && (
                    <View style={{
                      borderBottomWidth: 1.5,
                      borderColor: Colors.gainsboro,
                      paddingVertical: vs(9)
                    }}>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: Font.small,
                          color: Colors.detailTitles,
                          alignSelf: 'flex-start',
                          marginBottom: (windowWidth * 3.5) / 100,
                        }}
                      >
                        {LangProvider.Description[languageIndex]}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.Regular,
                          fontSize: Font.small,
                          color: Colors.detailTitles,
                          alignSelf: 'flex-start',
                        }}
                      >
                        {item.symptom_text}
                      </Text>
                    </View>
                  )}

                  {item.patient_prescription != "" && (
                    <View
                      style={{
                        width: "100%",
                        justifyContent: 'space-between',
                        flexDirection: "row",
                        alignItems: 'center',
                        alignSelf: "center",
                        paddingTop: vs(9)
                      }}>

                      <View
                        style={{
                          width: "90%",
                          flexDirection: "row",
                          alignItems: 'center',
                        }}>

                        <Image
                          resizeMode="contain"
                          source={Icons.Attachment}
                          style={{
                            width: "5%",
                            height: 15,
                            marginRight: (windowWidth * 2) / 100,
                          }}
                        />
                        <Text
                          numberOfLines={1}
                          style={{
                            fontFamily: Font.Regular,
                            fontSize: Font.small,
                            color: Colors.detailTitles,
                            textAlign: "auto",
                            width: '80%'
                          }}>
                          {item.patient_prescription}
                        </Text>
                      </View>

                      <View
                        style={{
                          width: "10%",
                          flexDirection: "row",
                          justifyContent: 'flex-end',
                        }}>
                        <Text
                          onPress={() => {
                            setState(
                              {
                                viewPrescriptionImage:
                                  config.img_url3 +
                                  item.patient_prescription,
                                modalPatientPrescription: true,
                              });
                          }}
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: Font.small,
                            color: Colors.Theme,
                          }} >
                          {LangProvider.VIEW[languageIndex]}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              )}
            {/* // prescription doctor */}
            {item.acceptance_status == "Completed" &&
              item.service_type == LangProvider.Doctor[languageIndex] && (
                <View
                  style={{
                    width: "100%",
                    alignSelf: "center",
                    paddingVertical: vs(10),
                    paddingHorizontal: s(13),
                  }}>
                  <Text
                    style={{
                      fontFamily: Font.Medium,
                      fontSize: Font.small,
                      color: Colors.Theme,
                      alignSelf: 'flex-start',
                      paddingBottom: (windowWidth * 4) / 100,
                    }}>
                    {LangProvider.PRESCRIPTION[languageIndex]}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      paddingVertical: vs(10),
                      borderBottomWidth: 1,
                      borderBottomColor: Colors.Border
                    }}>
                    <View
                      style={{
                        width: "17%",
                      }}>
                      <Image
                        source={Icons.prescription}
                        style={{
                          width: vs(40),
                          height: s(40)
                        }}
                        resizeMode='contain'
                      />
                    </View>
                    <View
                      style={{
                        width: "83%",
                      }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text
                          numberOfLines={1}
                          style={{
                            fontFamily: Font.Regular,
                            fontSize: Font.small,
                            color: Colors.detailTitles,
                            alignSelf: 'flex-start',
                            width: '70%'
                          }} >
                          {item.provider_prescription}
                        </Text>

                        {
                          item.provider_prescription != "" &&
                          <TouchableOpacity
                            onPress={() => {
                              downloadPrescription(
                                config.img_url3 + item.provider_prescription,
                                item.provider_prescription
                              );
                            }}>
                            <Text
                              style={{
                                textAlign: "right",
                                fontFamily: Font.Regular,
                                fontSize: Font.xsmall,
                                color: Colors.Theme,
                              }}>
                              {LangProvider.DOWNLOAD[languageIndex]}
                            </Text>
                          </TouchableOpacity>
                        }
                      </View>

                      <Text
                        style={{
                          fontFamily: Font.Regular,
                          fontSize: Font.xsmall,
                          color: Colors.lightGrey,
                          alignSelf: 'flex-start',
                          marginTop: vs(3)
                        }}>
                        {item.provider_upd}
                      </Text>

                    </View>
                  </View>
                </View>
              )}

            {/* // report lab */}
            {item.acceptance_status == "Completed" &&
              item.service_type == "Lab" && (
                <View
                  style={{
                    width: "100%",
                    alignSelf: "center",
                    paddingHorizontal: s(13),
                    borderBottomWidth: (windowWidth * 0.3) / 100,
                    borderColor: Colors.gainsboro,
                    paddingVertical: (windowWidth * 2.5) / 100,
                  }}>
                  <Text
                    style={{
                      fontFamily: Font.Medium,
                      fontSize: Font.medium,
                      color: Colors.Theme,
                      alignSelf: 'flex-start',
                      paddingBottom: (windowWidth * 4) / 100,
                    }}
                  >
                    {LangProvider.ReportAttachment[languageIndex]}
                  </Text>
                  <FlatList
                    data={item.report}
                    scrollEnabled={true}
                    nestedScrollEnabled={true}
                    renderItem={({ item, index }) => {
                      if (item.report != "") {
                        return (
                          <View
                            style={{
                              flexDirection: "row",
                              width: "100%",
                              paddingVertical: vs(10),
                              borderBottomWidth: index == classStateData.appointmentDetails?.report.length - 1 ? 0 : 1,
                              borderBottomColor: Colors.Border
                            }}>
                            <View
                              style={{
                                width: "17%",
                              }}>
                              <Image
                                source={Icons.report}
                                style={{
                                  width: vs(40),
                                  height: s(40),
                                }}
                              />
                            </View>
                            <View
                              style={{
                                width: "83%",
                              }}>
                              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text
                                  numberOfLines={1}
                                  style={{
                                    fontFamily: Font.Regular,
                                    fontSize: Font.small,
                                    color: Colors.detailTitles,
                                    alignSelf: 'flex-start',
                                    width: '70%'
                                  }}>
                                  {item.report}
                                </Text>

                                {
                                  item.report != "" &&
                                  <TouchableOpacity
                                    onPress={() => {
                                      downloadPrescription(
                                        config.img_url3 + item.report,
                                        item.report
                                      );
                                    }}>
                                    <Text
                                      style={{
                                        textAlign: "right",
                                        fontFamily: Font.Regular,
                                        fontSize: Font.xsmall,
                                        color: Colors.Theme,
                                      }}>
                                      {LangProvider.DOWNLOAD[languageIndex]}
                                    </Text>
                                  </TouchableOpacity>
                                }
                              </View>

                              <Text
                                style={{
                                  fontFamily: Font.Regular,
                                  fontSize: Font.xsmall,
                                  color: Colors.lightGrey,
                                  alignSelf: 'flex-start',
                                  marginTop: vs(3)
                                }}>
                                {item.upload_date}
                              </Text>

                            </View>
                          </View>
                        );
                      }
                    }}
                  />
                </View>
              )}


            {/* patient details */}
            <View
              style={{
                width: "100%",
                alignSelf: "center",
                paddingVertical: (windowWidth * 3) / 100,
              }}>
              <View
                style={{
                  width: "100%",
                  paddingHorizontal: s(13),
                  flexDirection: "row",
                  alignItems: 'center',
                  justifyContent: "space-between",
                }}>
                <Text
                  style={{
                    fontFamily: Font.Medium,
                    fontSize: Font.small,
                    color: Colors.darkText,
                  }}
                >
                  {LangProvider.patient_details[languageIndex]}
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    setState({
                      showPatientDetails:
                        !classStateData.showPatientDetails,
                    });
                  }}
                >
                  <View
                    style={{
                      padding: 8,
                      backgroundColor: Colors.backgroundcolor,
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      style={{
                        height: (windowWidth * 4) / 100,
                        width: (windowWidth * 4) / 100,
                        // backgroundColor: 'red'
                        // position: "absolute",
                        // top: (dHeight) ? 4 : 15,
                        // right: 5,
                      }}
                      source={
                        classStateData.showPatientDetails
                          ? Icons.upArrow
                          : Icons.downarrow
                      }
                    />
                  </View>
                </TouchableOpacity>
              </View>

              {classStateData.showPatientDetails && (
                <View
                  style={{
                    width: "100%",
                    paddingHorizontal: s(13),
                  }}>
                  <Text
                    style={{
                      color: Colors.DarkGrey,
                      fontFamily: Font.Medium,
                      fontSize: Font.small,
                      textAlign: config.textalign,
                      alignSelf: 'flex-start',
                      marginTop: (windowWidth * 1) / 100,
                    }}>
                    {item.patient_name}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: (windowWidth * 1.5) / 100,
                      width: "100%",
                    }}>
                    <Image
                      source={Icons.location}
                      style={{
                        marginTop: (windowWidth * 1) / 100,
                        width: (windowWidth * 3.5) / 100,
                        height: (windowWidth * 3.5) / 100,
                        resizeMode: "contain",
                        tintColor: Colors.Theme,
                      }}
                    />

                    <Text
                      style={{
                        color: Colors.DarkGrey,
                        fontFamily: Font.Regular,
                        fontSize: Font.small,
                        textAlign: contentAlign,
                        marginHorizontal: (windowWidth * 3) / 100,
                      }}
                    >
                      {item.patient_address}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: (windowWidth * 1.5) / 100,
                    }}>
                    {languageIndex == 0 ? (
                      <Image
                        source={Icons.arabic_call}
                        style={{
                          width: (windowWidth * 3.5) / 100,
                          height: (windowWidth * 3.5) / 100,
                          resizeMode: "contain",
                          tintColor: Colors.Theme,
                        }}
                      />
                    ) : (
                      <Image
                        source={Icons.arabic_call}
                        style={{
                          width: (windowWidth * 3.5) / 100,
                          height: (windowWidth * 3.5) / 100,
                          resizeMode: "contain",
                          tintColor: Colors.Theme,
                        }}
                      />
                    )}
                    <Text
                      style={{
                        color: Colors.DarkGrey,
                        fontFamily: Font.Regular,
                        fontSize: Font.small,
                        textAlign: config.textalign,
                        marginHorizontal: (windowWidth * 3) / 100,
                      }}
                    >
                      {item.patient_contact}
                    </Text>
                  </View>
                </View>
              )}
            </View>



            {/* --------------OTP-------------- */}
            {
              ((item?.service_type != LangProvider.Doctor[languageIndex]
                &&
                item?.service_type != LangProvider.Lab[languageIndex])
                &&
                item.acceptance_status == "Accepted")
              && (
                <View
                  style={{
                    width: "100%",
                    paddingVertical: (windowWidth * 2) / 100,
                    flexDirection: "row",
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTopWidth: 1,
                    borderTopColor: Colors.backgroundcolor,
                    paddingHorizontal: s(13),
                  }} >
                  <Text
                    style={{
                      fontSize: Font.small,
                      color: Colors.DarkGrey,
                      fontFamily: Font.Regular,
                    }}
                  >
                    {
                      LangProvider.appointment_accepted_otp_text[
                      languageIndex
                      ]
                    }
                  </Text>
                  <FlatList
                    horizontal
                    data={otpList}
                    renderItem={({ item, index }) => {
                      return (
                        <View style={{
                          height: 18,
                          width: 18,
                          borderRadius: 2,
                          backgroundColor: Colors.detailTitles,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}>
                          <Text
                            style={{
                              fontSize: Font.medium,
                              fontFamily: Font.SemiBold,
                              color: Colors.White
                            }}
                          >{item}</Text>
                        </View>
                      )
                    }}
                    ItemSeparatorComponent={() => {
                      return (
                        <View style={{ width: s(3) }}></View>
                      )
                    }}
                    contentContainerStyle={{ paddingHorizontal: s(20) }}
                  />
                </View>
              )}


            {/* payment details */}
            <View
              style={{
                backgroundColor: Colors.appointmentdetaillightgray,
                width: "100%",
                paddingHorizontal: s(13),
                paddingVertical: vs(9)
              }}>
              <View
                style={{
                  width: "100%",
                  alignSelf: "center",
                }}>
                <Text
                  style={{
                    fontFamily: Font.Medium,
                    fontSize: Font.small,
                    alignSelf: 'flex-start',
                    color: Colors.darkText,
                  }}>
                  {LangProvider.Payment[languageIndex]}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: (windowWidth * 2) / 100,
                    borderBottomWidth: 1.5,
                    borderColor: '#CCCCCC',
                  }}
                >
                  <FlatList
                    data={item.task_details}
                    scrollEnabled={true}
                    nestedScrollEnabled={true}
                    renderItem={({ item, index }) => {
                      if (item.task_details != "") {
                        return (
                          <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => {
                              // check_all(item, index);
                            }}
                            style={{
                              alignItems: "center",
                              width: "100%",
                              paddingVertical: (windowWidth * 1.7) / 100,
                              flexDirection: "row",
                              justifyContent: 'space-between'
                            }}
                          >
                            <Text
                              style={{
                                alignSelf: "center",
                                fontSize: Font.small,
                                fontFamily: Font.Regular,
                                color: Colors.DarkGrey,
                              }}
                            >
                              {item.name}
                            </Text>
                            <Text
                              style={{
                                fontSize: Font.small,
                                fontFamily: Font.Regular,
                                color: Colors.DarkGrey,
                              }}>
                              {item.price}
                            </Text>
                          </TouchableOpacity>
                        );
                      }
                    }}
                  />
                </View>

                {
                  item.task_type != "Online consultation" && (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingVertical: (windowWidth * 2) / 100,
                        borderColor: Colors.bordercolor,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: Font.Regular,
                          fontSize: (windowWidth * 3.6) / 100,
                          color: "#000",
                        }}>
                        { }
                        {`${LangProvider.distanceFare[languageIndex]} ${item?.distancetext == '' ? '' : `(${item.distancetext})`}`}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.Regular,
                          fontSize: (windowWidth * 3.6) / 100,
                          color: "#000",
                        }}
                      >
                        {item.distance_fee}
                      </Text>
                    </View>
                  )
                }
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: (windowWidth * 2) / 100,
                  }}>
                  <Text
                    style={{
                      fontFamily: Font.Medium,
                      fontSize: Font.small,
                      color: Colors.darkText,
                    }}>
                    {LangProvider.subTotal[languageIndex]}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Font.Medium,
                      fontSize: Font.small,
                      color: Colors.darkText,
                    }}>
                    {item.sub_total_price}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: (windowWidth * 1) / 100,
                    borderColor: Colors.bordercolor,
                    marginTop: (windowWidth * 1) / 100,
                    marginBottom: (windowWidth * 3) / 100,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Font.Regular,
                      fontSize: Font.small,
                      color: Colors.DarkGrey,
                    }}
                  >
                    {item.vat_percent}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Font.Regular,
                      fontSize: Font.small,
                      color: Colors.DarkGrey,
                    }}
                  >
                    {item.vat}
                  </Text>
                </View>


              </View>
            </View>

            {/* Amount and ReSchedule */}
            <View
              style={[
                {
                  width: "90%",
                  alignSelf: "center",
                  flexDirection: "row",
                  backgroundColor: Colors.White,
                  paddingTop: (windowWidth * 2.5) / 100,
                  paddingBottom: (windowWidth * 1) / 100,
                  alignItems: "center",
                  // borderTopWidth: (windowWidth * 0.3) / 100,
                  borderColor: Colors.bordercolor,
                },
                item.acceptance_status != "Rejected"
                  ? { justifyContent: "space-between" }
                  : null,
              ]}
            >
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                {languageIndex == 0 ? (
                  <Image
                    source={Icons.purse}
                    style={{
                      resizeMode: "contain",
                      width: 15,
                      height: 15,
                      tintColor: Colors.Theme
                    }}
                  />
                ) : (
                  <Image
                    source={Icons.purse_arbic}
                    style={{
                      resizeMode: "contain",
                      width: 15,
                      height: 15,
                    }}
                  />
                )}
                <Text
                  style={{
                    color: Colors.Theme,
                    fontSize: Font.medium,
                    fontFamily: Font.Medium,
                    marginTop: 0.5,
                    marginLeft: (windowWidth * 2) / 100,
                  }}
                >
                  {item.price}
                </Text>
              </View>

              {item.acceptance_status == "Pending" && (

                classStateData.isScheduleagain ?
                  <View style={{
                    paddingHorizontal: s(8),
                    paddingVertical: vs(4),
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <SkypeIndicator color={Colors.Theme} size={20} />
                  </View>
                  :

                  <TouchableOpacity
                    onPress={() => {
                      rescdule_click(),
                        // get_day(),
                        setState({
                          order_id: item.id,
                          time_take_data: "",
                        });
                    }}
                    activeOpacity={0.8}
                    style={{
                      paddingHorizontal: s(8),
                      paddingVertical: vs(4),
                      borderWidth: 0.8,
                      borderColor: Colors.Green,
                      borderRadius: 5
                    }} >

                    <Text
                      style={{
                        fontSize: Font.small,
                        fontFamily: Font.Regular,
                        color: Colors.Green
                      }}
                    >{LangProvider.Reschedule[languageIndex]}</Text>
                  </TouchableOpacity>

              )}

              {(
                item.acceptance_status == "Accepted"
                &&
                item.service_type == LangProvider.Doctor[languageIndex]
                &&
                item.task_type == LangProvider.OnlineConsultation[languageIndex]
                &&
                videoCallButton == true) && (
                  <>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {

                        var videoDetails = {
                          fromUserId: loggedInUserDetails?.user_id,
                          fromUserName: loggedInUserDetails?.first_name,
                          order_id: item?.order_id,
                          room_name: "rootvideo_room_" + loggedInUserDetails?.user_id + "_" + item?.provider_id,
                          toUserId: item?.provider_id,
                          toUserName: item?.provider_name,
                          type: 'patient_to_doctor_video_call',
                          image: item?.provider_image,
                          isPage: "outGoing",
                        };
                        dispatch(setVideoCallData(videoDetails))
                        setTimeout(() => {
                          dispatch(setVideoCall(true))
                        }, 500);
                      }}
                      style={{
                        paddingHorizontal: s(8),
                        paddingVertical: vs(4),
                        backgroundColor: Colors.Green,
                        borderRadius: 5,
                        flexDirection: 'row',
                        alignItems: 'center'
                      }} >
                      <SvgXml xml={VideoCall} />
                      <Text
                        style={{
                          fontSize: Font.small,
                          fontFamily: Font.SemiBold,
                          color: Colors.White,
                          marginLeft: s(7)
                        }}
                      >{LangProvider.VIDEO_CALL[languageIndex]}</Text>
                    </TouchableOpacity>

                  </>
                )}

              {item.acceptance_status == "Completed" && (
                <View style={{ alignItems: "flex-end" }}>
                  {
                    item.avg_rating != "" && item.avg_rating != 0 ? (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Font.Regular,
                            color: "#000",
                            fontSize: (windowWidth * 3.5) / 100,
                            marginRight: (windowWidth * 2) / 100,
                          }}
                        >
                          {LangProvider.rated[languageIndex]}
                        </Text>
                        <StarRating
                          disabled={false}
                          fullStar={Icons.fillStar}
                          emptyStar={Icons.outlineStar}
                          maxStars={5}
                          starSize={15}
                          rating={item.avg_rating}
                        />
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          setState({ modalVisiblerating: true, set_order: item?.order_id })
                        }}
                        activeOpacity={0.8}
                        style={{
                          paddingHorizontal: s(8),
                          paddingVertical: vs(4),
                          backgroundColor: Colors.Yellow,
                          borderRadius: 5,
                          flexDirection: 'row',
                          alignItems: 'center'
                        }} >
                        <SvgXml xml={whiteStar} />
                        <Text
                          style={{
                            fontSize: Font.small,
                            fontFamily: Font.SemiBold,
                            color: Colors.White,
                            marginLeft: s(7)
                          }}
                        >{LangProvider.Rate_Appointment[languageIndex]}</Text>
                      </TouchableOpacity>
                    )}
                </View>
              )}

              {item.acceptance_status == "Rejected" &&
                item.rf_text != "" && (

                  <Text
                    style={{
                      textAlign: "center",
                      color: Colors.Red,
                      fontFamily: Font.Medium,
                      fontSize: Font.xsmall,
                      marginLeft: s(8)
                    }}>
                    {LangProvider.Refunded[languageIndex]}
                  </Text>

                )}
            </View>


            <View
              style={{
                width: "90%",
                alignSelf: "center",
                alignItems: "flex-start",
              }}>
              <HTMLView value={item.rf_text} stylesheet={HTMLstyles} />
            </View>
          </View>

          {/* --------------------Chat----------------- */}

          {
            ((item.acceptance_status == "Accepted" || item.acceptance_status == "Completed") && item.service_type == LangProvider.Doctor[languageIndex]) &&
            <View style={{ marginTop: vs(7), backgroundColor: Colors.White, paddingHorizontal: s(13), paddingVertical: vs(9), }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <SvgXml xml={Chat} />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    navigation.navigate('Chat', { chatOptions: chatOptions, isEnabled: (classStateData.isChat) })
                  }}
                  style={{ marginLeft: s(10) }}>
                  <Text
                    style={{
                      fontSize: Font.small,
                      fontFamily: Font.Medium,
                      alignSelf: 'flex-start',
                      color: Colors.detailTitles

                    }}>{LangProvider.ChatNote[languageIndex]}</Text>
                  <View
                    style={{ flexDirection: 'row', alignItems: 'center', marginTop: vs(3) }}>
                    <Text
                      style={{
                        fontSize: Font.small,
                        fontFamily: Font.Regular,
                        alignSelf: 'flex-start',
                        color: Colors.Theme

                      }}>{LangProvider.Chat[languageIndex]}</Text>
                    <SvgXml xml={rightBlue} style={{ transform: [{ rotate: (languageIndex == 1) ? "180deg" : "0deg" }], marginLeft: s(6) }} height={vs(9)} width={s(5)} />

                  </View>
                </TouchableOpacity>

              </View>
              <View style={{ marginTop: vs(15) }}>
                <Text
                  style={{
                    fontSize: Font.xsmall,
                    fontFamily: Font.Regular,
                    alignSelf: 'flex-start',
                    color: Colors.lightGrey

                  }}>{LangProvider.ChatInit[languageIndex]}</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  underlayColor={Colors.Highlight}
                  onPress={() => {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "DashboardStack" }],
                    });
                  }}
                  style={{ flexDirection: 'row', alignItems: 'center', marginTop: vs(3) }}>
                  <Text
                    style={{
                      fontSize: Font.small,
                      fontFamily: Font.Medium,
                      alignSelf: 'flex-start',
                      color: Colors.Theme

                    }}>{LangProvider.BookNew[languageIndex]}</Text>
                  <SvgXml xml={rightBlue} style={{ transform: [{ rotate: (languageIndex == 1) ? "180deg" : "0deg" }], marginLeft: s(6) }} height={vs(9)} width={s(5)} />

                </TouchableOpacity>
              </View>
            </View>
          }

          {/* --------------------Note----------------- */}

          <View style={{ marginTop: vs(7), backgroundColor: Colors.White, paddingHorizontal: s(13), paddingVertical: vs(9), flexDirection: 'row', alignItems: 'center' }}>

            <SvgXml xml={Info} />

            <View style={{ marginLeft: s(10) }}>
              <Text
                style={{
                  fontSize: Font.small,
                  fontFamily: Font.Medium,
                  alignSelf: 'flex-start',
                  color: Colors.detailTitles

                }}>{LangProvider.Booking_Note[languageIndex]}</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                underlayColor={Colors.Highlight}
                onPress={() => {
                  setState({ isContactUsModal: true })
                }}
                style={{ flexDirection: 'row', alignItems: 'center', marginTop: vs(3) }}>
                <Text
                  style={{
                    fontSize: Font.small,
                    fontFamily: Font.Regular,
                    alignSelf: 'flex-start',
                    color: Colors.detailTitles

                  }}>{LangProvider.Booking_Desc[languageIndex]}</Text>

              </TouchableOpacity>
            </View>
          </View>

          {/* -----------------Contact Us---------------- */}
          <View style={{ marginTop: vs(7), backgroundColor: Colors.White, paddingHorizontal: s(13), paddingVertical: vs(9), flexDirection: 'row', alignItems: 'center' }}>

            <SvgXml xml={contactUs} />

            <View style={{ marginLeft: s(10) }}>
              <Text
                style={{
                  fontSize: Font.small,
                  fontFamily: Font.Regular,
                  alignSelf: 'flex-start',
                  color: Colors.detailTitles

                }}>{LangProvider.Consultation_Help[languageIndex]}</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                underlayColor={Colors.Highlight}
                onPress={() => {
                  setState({ isContactUsModal: true })
                }}
                style={{ flexDirection: 'row', alignItems: 'center', marginTop: vs(3) }}>
                <Text
                  style={{
                    fontSize: Font.small,
                    fontFamily: Font.Regular,
                    alignSelf: 'flex-start',
                    color: Colors.Theme

                  }}>{LangProvider.ContactUs[languageIndex]}</Text>
                <SvgXml xml={rightBlue} style={{ transform: [{ rotate: (languageIndex == 1) ? "180deg" : "0deg" }], marginLeft: s(6) }} height={vs(9)} width={s(5)} />

              </TouchableOpacity>
            </View>

          </View>



        </KeyboardAwareScrollView>


        {/* ---------------------------------------------------------- */}



        {/* -------------------ReSchedule----------------- */}

        <Modal
          isVisible={classStateData.modalVisible}
          animationIn='fadeInUpBig'
          animationOut='fadeOutDownBig'
          deviceWidth={windowWidth}
          animationInTiming={350}
          animationOutTimixng={350}
          // onBackButtonPress={onRequestClose}
          hasBackdrop={true}
          useNativeDriver={true}
          useNativeDriverForBackdrop={true}
          // backdropColor='rgba(0,0,0,0.8)'
          style={{ margin: 0 }} >



          <View style={styles.modalContainer}>

            {
              classStateData?.isLoading &&
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.3)',
                // opacity: 0.8,
                width: windowWidth,
                height: windowHeight - 200,
                borderRadius: 25,
                position: 'absolute',
                bottom: 0,
                zIndex: 999,
              }}>
                <SkypeIndicator color={Colors.Theme} size={20} />
              </View>
            }

            {/* task booking section */}
            <ScrollView
              pointerEvents={(classStateData.isLoading || classStateData.isScheduleagain) ? 'none' : 'auto'}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: (windowWidth * 7) / 100,
                paddingTop: vs(35),
              }}>

              <TouchableHighlight
                onPress={() => {
                  setState({ modalVisible: false })
                }}
                underlayColor={Colors.Highlight}
                style={styles.closeContainer}
              >
                <SvgXml xml={Cross} height={vs(19)} width={s(18)} />
              </TouchableHighlight>

              <Text
                style={{
                  fontSize: Font.large,
                  fontFamily: Font.SemiBold,
                  alignSelf: 'flex-start',
                  color: Colors.darkText

                }}>{LangProvider.Reschedule[languageIndex]}</Text>

              <View style={{ marginTop: vs(15) }}>

                <View
                  style={{
                    width: "100%",
                    alignSelf: "center",
                  }}>

                  <View style={{ paddingBottom: vs(9), flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text
                      style={{
                        fontFamily: Font.Medium,
                        fontSize: Font.medium,
                        alignSelf: 'flex-start',
                        color: Colors.Theme,
                      }} >
                      {item?.order_id}
                    </Text>
                    <Text
                      style={{
                        fontFamily: Font.Medium,
                        fontSize: Font.medium,
                        alignSelf: 'flex-start',
                        color: Colors.Theme,
                      }} >
                      {item?.task_type}
                    </Text>
                  </View>

                  {/* ----------Ordered Task--------- */}

                  <View
                    style={[
                      {
                        paddingVertical: vs(9),
                        borderTopWidth: 1.5,
                        borderColor: Colors.backgroundcolor,
                      },
                      classStateData.task_details?.length >= 3
                        ? { height: (windowWidth * 40) / 100 }
                        : { paddingVertical: vs(5) },
                    ]}
                  >
                    {status === "doctor" ? (
                      <FlatList
                        data={classStateData.task_details}
                        scrollEnabled={true}
                        nestedScrollEnabled={true}
                        renderItem={({ item, index }) => {
                          if (
                            classStateData.task_details != "" &&
                            classStateData.task_details != null
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
                                    alignSelf: 'flex-start',
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
                          }
                        }}
                      />
                    ) : classStateData.slot_booking_id == "TASK_BOOKING" ? (
                      <FlatList
                        data={classStateData.task_details}
                        scrollEnabled={true}
                        nestedScrollEnabled={true}
                        renderItem={({ item, index }) => {
                          if (
                            classStateData.task_details != "" &&
                            classStateData.task_details != null
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
                                }} >
                                <Text
                                  style={{
                                    width: "70%",
                                    alignSelf: 'flex-start',
                                    alignSelf: "center",
                                    fontSize: (windowWidth * 3.6) / 100,
                                    fontFamily: Font.Regular,
                                    color: "#000",
                                  }}>
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
                          }
                        }}
                      />
                    ) : classStateData.slot_booking_id == "TESTS_BOOKING" ||
                      classStateData.slot_booking_id == "PACKAGE_BOOKING" ? (
                      <FlatList
                        data={classStateData.task_details}
                        scrollEnabled={true}
                        nestedScrollEnabled={true}
                        renderItem={({ item, index }) => {
                          if (
                            classStateData.task_details != "" &&
                            classStateData.task_details != null
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
                                }}>
                                <Text
                                  style={{
                                    width: "70%",
                                    alignSelf: 'flex-start',
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
                          }
                        }}
                      />
                    ) : (
                      <FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        data={item.task_details}
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
                              }}>
                              <View
                                style={{
                                  backgroundColor: "#0168B3",
                                  borderTopLeftRadius:
                                    (windowWidth * 1.2) / 100,
                                  borderTopRightRadius:
                                    (windowWidth * 1.2) / 100,
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
                                  fontSize: Font.small,
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

                  {/* ----------Ordered Task--------- */}

                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignSelf: "center",
                      paddingTop: (windowWidth * 4) / 100,
                      borderColor: Colors.gainsboro,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Font.Medium,
                        fontSize: Font.medium,
                        alignSelf: 'flex-start',
                      }}
                    >
                      {LangProvider.Appointmentschedule[languageIndex]}
                    </Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Image
                        source={Icons.Calendar}
                        style={{
                          resizeMode: "contain",
                          // backgroundColor: Colors.White,
                          width: 20,
                          height: 20,
                          alignSelf: "center",
                        }}
                      />

                      <Text
                        style={{
                          color: Colors.Theme,
                          fontFamily: Font.Medium,
                          fontSize: Font.medium,
                          marginLeft: (windowWidth * 1) / 100,
                        }}
                      >
                        {classStateData.set_date}
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
                        fontSize: Font.medium,
                        alignSelf: 'flex-start',
                        color: "#000",
                      }}
                    >
                      {LangProvider.SelectDate[languageIndex]}
                    </Text>

                    <View style={{ width: "100%" }}>
                      <FlatList
                        horizontal={true}
                        data={classStateData.date_array}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                          return (
                            <TouchableOpacity
                              onPress={() => {
                                setState({
                                  set_date: item.date1,
                                  set_task: "task_base",
                                  time_take_data: "",
                                });
                                status === "lab"
                                  ? getLabTimeDate()
                                  : status === "doctor"
                                    ? getDoctorTimeDate()
                                    : getTimeDate(),
                                  check_date(item, index)
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
                        fontSize: Font.medium,
                        alignSelf: 'flex-start',
                      }}
                    >
                      {LangProvider.Select_start_time[languageIndex]}
                    </Text>
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                    >
                      <View style={{ width: "100%" }}>
                        {classStateData.time_Arr != "" ? (
                          <View style={{ width: "100%" }}>
                            <View style={{ width: "100%" }}>
                              <FlatList
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                data={classStateData.final_one}
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
                                            marginTop: (windowWidth * 3) / 100,

                                            fontFamily:
                                              Font.Regular,
                                            fontSize:
                                              Font.small,
                                            padding: (windowWidth * 2) / 100,
                                            paddingHorizontal:
                                              (windowWidth * 3.3) / 100,
                                          },
                                          item.time ==
                                            classStateData.time_take_data
                                            ? {
                                              backgroundColor:
                                                Colors.Blue,
                                              color: "#fff",
                                            }
                                            : {
                                              backgroundColor:
                                                '#E5E5E5',
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
                                data={classStateData.final_arr_two}
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
                                            marginTop: (windowWidth * 3) / 100,

                                            fontFamily:
                                              Font.Regular,
                                            fontSize:
                                              Font.small,
                                            padding: (windowWidth * 2) / 100,
                                            paddingHorizontal:
                                              (windowWidth * 3.3) / 100,
                                          },
                                          item.time ==
                                            classStateData.time_take_data
                                            ? {
                                              backgroundColor:
                                                Colors.Blue,
                                              color: "#fff",
                                            }
                                            : {
                                              backgroundColor:
                                                '#E5E5E5',
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
                            {LangProvider.noTime[languageIndex]}
                          </Text>
                        )}
                      </View>
                    </ScrollView>
                  </View>

                  <Button
                    text={LangProvider.SAVECHANGERESCHEDULE[languageIndex]}
                    onPress={() => submit_btn()}
                    btnStyle={{ marginTop: vs(25) }}
                    onLoading={classStateData.isScheduleagain}
                  />

                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>




        <RatingBottomSheet
          visible={classStateData.modalVisiblerating}
          onRequestClose={() => {
            setState({ modalVisiblerating: false });
          }}
          value={classStateData.rating}
          onSelectRating={(val) => {
            setState({ rating: val });
          }}
          onChangeText={(txt) => {
            setState({ reviewText: txt, textLength: txt });
          }}
          reviewValue={classStateData.reviewText}
          rateProvider={() => rateProvider()}
        />



        <PrescriptionBottomSheet
          visible={classStateData.modalPatientPrescription}
          onRequestClose={() => {
            setState({ modalPatientPrescription: false });
          }}
          data={classStateData.viewPrescriptionImage}
        />

        <ContactUsBottomSheet
          visible={classStateData.isContactUsModal}
          onRequestClose={() => {
            setState({ isContactUsModal: false })
          }}
          Id={item.order_id}
          route={'AppointmentDetails'}
        />

        <NoInternet
          visible={!deviceConnection}
        />

        <Loader visible={isDownloading} />
      </View>
    );
  }

}
const styles = StyleSheet.create({
  textInputFocus: {
    borderColor: Colors.Blue,
    backgroundColor: Colors.White,
    borderBottomWidth: 1,
    borderWidth: 1,
    marginTop: 20,
    paddingLeft: 5,
    paddingRight: 5,
  },
  modalContainer: {
    width: windowWidth,
    height: windowHeight - 200,
    backgroundColor: Colors.White,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: s(13),
    position: 'absolute',
    bottom: 0,
    zIndex: 999,
  },
  closeContainer: {
    height: s(35),
    width: s(35),
    borderRadius: s(50),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: vs(20),
    right: 0,
    zIndex: 999
  },

});
const HTMLstyles = StyleSheet.create({
  font: {
    color: Colors.Red,
    fontSize: Font.small,
    fontFamily: Font.Regular,
    marginTop: vs(5)
  },

});
