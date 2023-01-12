import React, { Component, useEffect, useState } from "react";
import HTMLView from "react-native-htmlview";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
  PermissionsAndroid,
  TouchableHighlight,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {
  Colors,
  Font,
  windowHeight,
  msgProvider,
  msgText,
  config,
  windowWidth,
  Icons,
  consolepro,
  Lang_chg,
  apifuntion,
  deviceHeight,
  Button,
  ScreenHeader
} from "../Provider/utilslib/Utils";
import StarRating from "react-native-star-rating";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import moment from "moment-timezone";
import Slider from "@react-native-community/slider";
import SoundPlayer from "react-native-sound-player";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import RNFetchBlob from "rn-fetch-blob";
import { s, vs } from "react-native-size-matters";
import Modal from "react-native-modal";
import { SvgXml } from "react-native-svg";
import { contactUs, Cross, Info, rightBlue, whiteStar } from "../Icons/Index";
import RatingBottomSheet from "../components/RatingBottomSheet";
import PrescriptionBottomSheet from "../components/PrescriptionBottomSheet";
import ContactUsBottomSheet from "../components/ContactUsBottomSheet";
import { useSelector } from "react-redux";

var Sound = require("react-native-sound");

export default AppointmentDetails = ({ navigation, route }) => {

  const { loggedInUserDetails, guest, appLanguage } = useSelector(state => state.StorageReducer)

  const { appointment_id, send_id, booking_type, status } = route?.params
  const [classStateData, setClassStateData] = useState({
    languageIndex: appLanguage == 'en' ? 0 : 1,
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
    playState: "paused", //playing, paused
    playSeconds: 0,
    duration: 0,
    showPatientDetails: false,
    isContactUsModal: false,
    isLoading: false,
    isScheduleagain: false,
    isPlay: false,
    isLoadingDetails: true,
  })

  let recordingUrl = '';
  const insets = useSafeAreaInsets()
  const [sound, setSound] = useState(null)
  const setState = payload => {
    setClassStateData(prev => ({
      ...prev,
      ...payload
    }))
  }

  let sliderEditing = false;
  Sound.setCategory("Playback", true); // true = mixWithOthers

  useEffect(() => {
    get_day();

  }, [classStateData.modalVisible])
  useEffect(() => {
    FontAwesome.getImageSource("circle", 20, Colors.Theme).then(
      (source) => setState({ sliderIcon: source })
    );
    getAllDetails(0);

    _onFinishedPlayingSubscription = SoundPlayer.addEventListener(
      "FinishedPlaying",
      ({ success }) => {
        console.log("finished playing", success);
      }
    );
    _onFinishedLoadingSubscription = SoundPlayer.addEventListener(
      "FinishedLoading",
      ({ success }) => {
        console.log("finished loading", success);
      }
    );
    _onFinishedLoadingFileSubscription = SoundPlayer.addEventListener(
      "FinishedLoadingFile",
      ({ success, name, type }) => {
        console.log("finished loading file", success, name, type);
        SoundPlayer.play();
      }
    );
    _onFinishedLoadingURLSubscription = SoundPlayer.addEventListener(
      "FinishedLoadingURL",
      ({ success, url }) => {
        console.log("finished loading url", success, url);
      }
    );
  }, [])


  const onSliderEditStart = () => {
    sliderEditing = true;
  };

  const onSliderEditEnd = () => {
    sliderEditing = false;
  };

  const onSliderEditing = (value) => {
    console.log('value value:: ', value, sliderEditing);
    if (sound && classStateData.playState == "pause" && !sliderEditing) {
      sound.setCurrentTime(value);
      setState({ playSeconds: value });
    }
  };

  const onStartPlay = async (isPlay = false) => {
    setState({ isPlay: isPlay })
    console.log({ sound });
    if (sound != null) {
      playMusic();
      sound.play(playComplete);
      setState({ playState: "playing", duration: sound.getDuration() });
    } else {
      setState(
        {
          playState: isPlay ? "playing" : "paused",
          duration: sound.getDuration(),
        }
      );
      if (isPlay) {
        // Play the sound with an onEnd callback
        playMusic();
        sound.play(playComplete);
      }

    }

  };

  const playComplete = (success) => {
    if (success) {
      console.log('successfully finished playing');
    } else {
      console.log('playback failed due to audio decoding errors');
      // Alert.alert('Notice', 'audio file error. (Error code : 2)');
    }
    if (timeout) {
      clearInterval(timeout);
    }
    setState({ playState: 'paused', playSeconds: 0 });
    sound.setCurrentTime(0);
  };

  const playMusic = () => {
    timeout = setInterval(() => {

      if (sound != null && sound.isLoaded() && !sliderEditing) {
        sound.getCurrentTime((seconds, isPlaying) => {
          setState({
            playSeconds: seconds
          });
        })
      }
    }, 100);
  }

  const pause = () => {
    if (sound != null) {
      sound.pause();
    }

    setState({ playState: "paused" });
  };


  const getAllDetails = async (page) => {
    let url = config.baseURL + "api-patient-appointment-details";

    var data = new FormData();
    data.append("id", appointment_id);

    data.append("service_type", status);

    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data, page)
      .then((obj) => {
        consolepro.consolelog("getAllDetails....", obj);

        if (obj.status == true) {
          recordingUrl = config.img_url3 + obj.result.symptom_recording;
          const tempSound = new Sound(recordingUrl, "", (error) => {
            if (error) {
              console.log("failed to load the sound", error);
              return;
            }
          })
          setSound(tempSound)
          setState(
            {
              appointmentDetails: obj.result,
              message: obj.message,
            });
          if (classStateData.appointmentDetails.symptom_recording != "") onStartPlay(false);
          // console.log("obj.result", obj.result);
          setTimeout(() => {
            setState(
              {
                isLoadingDetails: false
              });
          }, 750);
        } else {
          setState({ nurse_data: obj.result, message: obj.message, isLoadingDetails: false });
          return false;
        }
      })
      .catch((error) => {
        setState({ isLoadingDetails: false });
        consolepro.consolelog("-------- error ------- " + error);
      });
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
    data.append("login_user_id", loggedInUserDetails.user_id);
    data.append("order_id", appointment_id);
    data.append("service_type", status);
    if (status === "lab") {
      data.append("task_type", booking_type);
    }

    // consolepro.consolelog("data", data);
    // return
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        consolepro.consolelog("rescdule_click:....", JSON.stringify(obj));

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
        consolepro.consolelog("-------- error ------- " + error);
      });
  };

  const getDoctorTimeDate = async () => {
    setState({ isLoading: true })
    let url = config.baseURL + "api-patient-doctor-next-date-time";
    var data = new FormData();
    data.append("provider_id", send_id);
    data.append("date", classStateData.set_date);
    data.append("service_type", status);

    // consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        setState({ isLoading: false })
        if (obj.status == true) {
          consolepro.consolelog("obj.result", obj.result);
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
        consolepro.consolelog("-------- error ------- " + error);
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
          consolepro.consolelog("obj.result", obj.result);
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
        consolepro.consolelog("-------- error ------- " + error);
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
          consolepro.consolelog("obj.result", obj.result);
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
        consolepro.consolelog("-------- error ------- " + error);
      });
  };

  const check_date = (item, index) => {
    let data = classStateData.date_array;
    console.log("new data", data);

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
    console.log(',,,,,,,,,,,,,,,,', arr);
    setState({ date_array: arr });
  };


  const submit_btn = async () => {

    if (classStateData.time_take_data.length <= 0) {
      msgProvider.showError(msgText.EmptyTime[classStateData.languageIndex]);
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
        consolepro.consolelog("-------- error ------- " + error);
        setState({ loading: false });
      });
  };

  const rateProvider = async () => {

    let url = config.baseURL + "api-patient-insert-review";
    var data = new FormData();
    console.log("data", data);
    data.append("lgoin_user_id", loggedInUserDetails.user_id);
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
          // if (obj.active_status == msgTitle.deactivate[classStateData.languageIndex] || obj.msg[classStateData.languageIndex] == msgTitle.usererr[classStateData.languageIndex]) {
          //   usernotfound.loginFirst(props, obj.msg[classStateData.languageIndex])
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

  const downloadPrescription = (imgUrl, filename) => {
    permissionFunc(imgUrl, filename);
  };

  const permissionFunc = async (imgUrl, filename) => {
    if (Platform.OS == "ios") {
      actualDownload(imgUrl, filename);
    } else {
      // if (downloaded) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          actualDownload(imgUrl, filename);
        } else {
          // global.hideLoader();
          msgProvider.showError(
            "You need to give storage permission to download the file"
          );
        }
      } catch (err) {
        // global.props.hideLoader();
        console.warn(err);
      }
      // }
      // else {
      //   // global.props.hideLoader();
      //   msgProvider.showSuccess('File is already downloaded.');
      // }
    }
  };

  const actualDownload = (imgUrl, filename) => {
    const { dirs } = RNFetchBlob.fs;
    const dirToSave =
      Platform.OS == "ios" ? dirs.DocumentDir : dirs.DownloadDir;
    const configfb = {
      fileCache: true,
      useDownloadManager: true,
      notification: true,
      mediaScannable: true,
      title: filename,
      path: `${dirToSave}/${filename}`,
    };
    const configOptions = Platform.select({
      ios: {
        fileCache: configfb.fileCache,
        title: configfb.title,
        path: configfb.path,
        //appendExt: 'pdf',
      },
      android: configfb,
    });

    console.log("The file saved to 23233", configfb, dirs);

    RNFetchBlob.config(configOptions)
      .fetch("GET", imgUrl, {})
      .then((res) => {
        if (Platform.OS === "ios") {
          RNFetchBlob.fs.writeFile(configfb.path, res.data, "base64");
          RNFetchBlob.ios.previewDocument(configfb.path);
        }
        // setisdownloaded(false)
        // global.props.hideLoader();
        if (Platform.OS == "android") {
          msgProvider.showSuccess("File downloaded");
        }
        console.log("The file saved to ", res);
      })
      .catch((e) => {
        // setisdownloaded(true)
        // global.props.hideLoader();
        msgProvider.showError(e.message);
        console.log("The file saved to ERROR", e.message);
      });
  };


  const getAudioTimeString = (seconds) => {
    // console.log("seconds:: ", seconds);
    const h = parseInt(seconds / (60 * 60));
    const m = parseInt((seconds % (60 * 60)) / 60);
    const s = parseInt(seconds % 60);

    return (
      (h < 10 ? "0" + h : h) +
      ":" +
      (m < 10 ? "0" + m : m) +
      ":" +
      (s < 10 ? "0" + s : s)
    );
  }


  var item = classStateData.appointmentDetails;
  const currentTimeString = getAudioTimeString(classStateData.playSeconds);
  const durationString = getAudioTimeString(classStateData.duration);

  if (classStateData.isLoadingDetails) {

    return (
      <View style={{ flex: 1, paddingBottom: insets.bottom }}>
        <ScreenHeader
          title={status === 'doctor' ? Lang_chg.Consultation_Details[classStateData.languageIndex] : status === 'lab' ? Lang_chg.Lab_Test_Details[classStateData.languageIndex] : Lang_chg.Appointment_Details[classStateData.languageIndex]}
          navigation={navigation}
          onBackPress={() => {
            navigation.pop()
            pause()
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
          <View style={{ width: '100%', height: 1.5, backgroundColor: Colors.backgroundcolor, marginTop: vs(7),marginBottom:vs(7) }}></View>

          <View>
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item width={(windowWidth * 12) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
            </SkeletonPlaceholder>

            <View style={{ flexDirection: 'row', marginTop:vs(7) }}>

              <View style={{ flex: 1 }}>
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width={(windowWidth * 10) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                </SkeletonPlaceholder>
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width={(windowWidth * 20) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} style={{marginTop:vs(5)}} />
                </SkeletonPlaceholder>
              </View>

              <View style={{ flex: 1 }}>
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width={(windowWidth * 10) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                </SkeletonPlaceholder>
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width={(windowWidth * 20) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} style={{marginTop:vs(5)}} />
                </SkeletonPlaceholder>
              </View>

              <View style={{ flex: 1 }}>
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width={(windowWidth * 10) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                </SkeletonPlaceholder>
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width={(windowWidth * 20) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} style={{marginTop:vs(5)}} />
                </SkeletonPlaceholder>
              </View>

            </View>
          </View>
        </View>
      </View>
    )

  } else {
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
      let OTP = item?.OTP?.split('')
      for (let index = 0; index < item?.OTP.length; index++) {
        tempArr.push(OTP[index])
      }
      otpList = tempArr
      // console.log(tempArr);
    }

    return (
      <View style={{ flex: 1, paddingBottom: insets.bottom }}>

        <ScreenHeader
          title={status === 'doctor' ? Lang_chg.Consultation_Details[classStateData.languageIndex] : status === 'lab' ? Lang_chg.Lab_Test_Details[classStateData.languageIndex] : Lang_chg.Appointment_Details[classStateData.languageIndex]}
          navigation={navigation}
          onBackPress={() => {
            navigation.pop()
            pause()
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
                      style={{ height: s(75), width: s(75), borderRadius: s(85), borderWidth: 0.5, bordercolor: Colors.Highlight }}
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
                      {Lang_chg.Hospital[classStateData.languageIndex]}
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
                {Lang_chg.appointment_schedule[classStateData.languageIndex]}
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
                    {Lang_chg.Date[classStateData.languageIndex]}
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
                    {Lang_chg.Time[classStateData.languageIndex]}
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
                    {Lang_chg.Type[classStateData.languageIndex]}
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
                    {Lang_chg.BookingOn[classStateData.languageIndex]}
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
            {item.service_type == "Doctor" &&
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
                    {Lang_chg.PATIENT_SYMPTOM[classStateData.languageIndex]}
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
                        {Lang_chg.Voice_Recording[classStateData.languageIndex]}
                      </Text>

                      <View
                        style={{
                          width: '70%',
                          flexDirection: "row",
                          alignItems: 'center'
                        }}>
                        {/* <Text style={{ color: 'black', alignSelf: 'center' }}>{currentTimeString}</Text> */}
                        <TouchableOpacity
                          onPress={() => {
                            classStateData.playState == "paused"
                              ? onStartPlay(true)
                              : pause();
                          }}>
                          <Image
                            source={
                              classStateData.playState == "paused"
                                ? Icons.play
                                : Icons.pause
                            }
                            style={{
                              transform: [{ rotate: (Icons.pause && classStateData.languageIndex == 1) ? "180deg" : "0deg" }],
                              width: (windowWidth * 8) / 100,
                              height: (windowWidth * 8) / 100,
                            }}
                          />
                        </TouchableOpacity>

                        <Slider
                          onTouchStart={onSliderEditStart}
                          onTouchEnd={onSliderEditEnd}
                          onValueChange={onSliderEditing}
                          value={classStateData.playSeconds}
                          maximumValue={classStateData.duration}
                          maximumTrackTintColor="gray"
                          minimumTrackTintColor={Colors.Theme}
                          thumbImage={classStateData.sliderIcon}
                          style={{
                            flex: 1,
                            alignSelf: "center",
                            marginHorizontal: Platform.select({ ios: 5 }),
                            height: (windowWidth * 10) / 100,
                            // transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }]
                          }}
                        />
                        <Text
                          style={{
                            color: "black",
                            alignSelf: "center",
                          }}
                        >
                          {durationString}
                        </Text>
                      </View>
                    </View>
                  )}

                  {item.symptom_text != "" && (
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
                        {Lang_chg.Description[classStateData.languageIndex]}
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
                            borderColor: Colors.Theme,
                          }}
                        />
                        <Text
                          numberOfLines={1}
                          style={{
                            fontFamily: Font.Regular,
                            fontSize: Font.small,
                            color: Colors.detailTitles,
                            textAlign: "auto",
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
                              },
                              () => {
                                console.log(
                                  "viewPrescriptionImage ",
                                  classStateData.viewPrescriptionImage
                                );
                              }
                            );
                          }}
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: Font.small,
                            color: Colors.Theme,
                          }} >
                          {Lang_chg.VIEW[classStateData.languageIndex]}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              )}
            {/* // prescription doctor */}
            {item.acceptance_status == "Completed" &&
              item.service_type == "Doctor" && (
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
                    {Lang_chg.PRESCRIPTION[classStateData.languageIndex]}
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

                        <TouchableOpacity
                          onPress={() => {
                            if (item.provider_prescription != "") {
                              downloadPrescription(
                                config.img_url3 +
                                item.provider_prescription,
                                item.provider_prescription
                              );
                            }
                          }}>
                          <Text
                            style={{
                              textAlign: "right",
                              fontFamily: Font.Regular,
                              fontSize: Font.xsmall,
                              color: Colors.Theme,
                            }}>
                            {Lang_chg.DOWNLOAD[classStateData.languageIndex]}
                          </Text>
                        </TouchableOpacity>
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
                      fontSize: Font.regulartext_size,
                      color: Colors.Theme,
                      alignSelf: 'flex-start',
                      paddingBottom: (windowWidth * 4) / 100,
                    }}
                  >
                    {Lang_chg.ReportAttachment[classStateData.languageIndex]}
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

                                <TouchableOpacity
                                  onPress={() => {
                                    if (item.report != "") {
                                      downloadPrescription(
                                        config.img_url3 + item.report,
                                        item.report
                                      );
                                    }
                                  }}>
                                  <Text
                                    style={{
                                      textAlign: "right",
                                      fontFamily: Font.Regular,
                                      fontSize: Font.xsmall,
                                      color: Colors.Theme,
                                    }}>
                                    {Lang_chg.DOWNLOAD[classStateData.languageIndex]}
                                  </Text>
                                </TouchableOpacity>
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




            {/* Prescription */}

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
                    alignSelf: 'flex-start',
                  }}
                >
                  {Lang_chg.patient_details[classStateData.languageIndex]}
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
                      padding: 15,
                      backgroundColor: Colors.backgroundcolor,
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      style={{
                        height: (windowWidth * 4.5) / 100,
                        width: (windowWidth * 4.5) / 100,
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
                        alignSelf: 'flex-start',
                        marginLeft: (windowWidth * 3) / 100,
                        width: "96%",
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
                    {classStateData.languageIndex == 0 ? (
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


            {item.acceptance_status == "Accepted" &&
              item.service_type != "Doctor" &&
              item.service_type != "Lab" && (
                <View
                  style={{
                    width: "100%",
                    alignSelf: "center",
                    paddingVertical: (windowWidth * 2) / 100,
                    flexDirection: "row",
                    borderTopWidth: 1,
                    borderTopColor: Colors.backgroundcolor,
                    paddingHorizontal: s(13)
                  }}>
                  <Text
                    style={{
                      fontSize: Font.small,
                      color: Colors.DarkGrey,
                      width: "75%",
                      alignSelf: 'flex-start',
                      fontFamily: Font.Regular,
                    }}>
                    {
                      Lang_chg.appointment_accepted_otp_text[
                      classStateData.languageIndex
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
                    contentContainerStyle={{ paddingHorizontal: s(5), }}
                  />

                </View>
              )}
            {item.acceptance_status == "Completed" &&
              item.service_type != "Doctor" &&
              item.service_type != "Lab" && (
                <View
                  style={{
                    width: "100%",
                    alignSelf: "center",
                    paddingVertical: (windowWidth * 2) / 100,
                    flexDirection: "row",
                    borderTopWidth: 1,
                    borderTopColor: Colors.backgroundcolor,
                    paddingHorizontal: s(13)
                  }} >
                  <Text
                    style={{
                      fontSize: Font.small,
                      color: Colors.Green,
                      width: "75%",
                      alignSelf: 'flex-start',
                      fontFamily: Font.Regular,
                    }}
                  >
                    {
                      Lang_chg.appointment_closed_otp_text[
                      classStateData.languageIndex
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
                    contentContainerStyle={{ paddingHorizontal: s(5), }}
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
                  {Lang_chg.Payment[classStateData.languageIndex]}
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

                {item.service_type == "Doctor" ? (
                  item.task_type === "Home Visit" && (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingVertical: (windowWidth * 2) / 100,
                        // borderBottomWidth: (windowWidth * 0.3) / 100,
                        borderColor: Colors.bordercolor,
                        // marginTop: windowWidth * 2 / 100,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: Font.Regular,
                          fontSize: (windowWidth * 3.6) / 100,
                          color: "#000",
                        }}>
                        { }
                        {`${Lang_chg.distanceFare[classStateData.languageIndex]} ${item?.distance == '' ? '' : `(${item.distancetext})`}`}
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
                ) : (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingVertical: (windowWidth * 2) / 100,
                      // borderBottomWidth: (windowWidth * 0.3) / 100,
                      borderColor: Colors.bordercolor,
                      // marginTop: windowWidth * 2 / 100,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Font.Regular,
                        fontSize: Font.small,
                        color: Colors.DarkGrey,
                      }}>
                      {`${Lang_chg.distanceFare[classStateData.languageIndex]} ${item?.distance == '' ? '' : `(${item.distancetext})`}`}

                    </Text>
                    <Text
                      style={{
                        fontFamily: Font.Regular,
                        fontSize: Font.small,
                        color: Colors.DarkGrey,
                      }}
                    >
                      {item.distance_fee}
                    </Text>
                  </View>
                )}
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
                    {Lang_chg.subTotal[classStateData.languageIndex]}
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
                {classStateData.languageIndex == 0 ? (
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
                    <ActivityIndicator size={'small'} color={Colors.Border} />
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
                    >{Lang_chg.Reschedule[classStateData.languageIndex]}</Text>
                  </TouchableOpacity>

              )}

              {item.acceptance_status == "Accepted" &&
                item.service_type == "Doctor" &&
                videoCallButton == true && (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        // setState({
                        //   id: item.id,
                        // }, () => {
                        //   updateProviderAppointmentStatus("Accept")
                        // })
                        navigation.navigate("VideoCall", {
                          item: item,
                        });
                      }}
                      style={{
                        backgroundColor: Colors.Green,
                        width: (windowWidth * 26) / 100,
                        borderRadius: (windowWidth * 1) / 100,
                        paddingVertical: (windowWidth * 2) / 100,
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          color: Colors.White,
                          textTransform: "uppercase",
                          fontFamily: Font.SemiBold,
                          fontSize: (windowWidth * 3) / 100,
                        }}
                      >
                        {Lang_chg.VIDEO_CALL[classStateData.languageIndex]}
                      </Text>
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
                          {Lang_chg.rated[classStateData.languageIndex]}
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
                        >{Lang_chg.Rate_Appointment[classStateData.languageIndex]}</Text>
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
                    {Lang_chg.Refunded[classStateData.languageIndex]}
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

                }}>{Lang_chg.Booking_Note[classStateData.languageIndex]}</Text>
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

                  }}>{Lang_chg.Booking_Desc[classStateData.languageIndex]}</Text>

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

                }}>{Lang_chg.Consultation_Help[classStateData.languageIndex]}</Text>
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

                  }}>{Lang_chg.ContactUs[classStateData.languageIndex]}</Text>
                <SvgXml xml={rightBlue} style={{ transform: [{ rotate: (classStateData.languageIndex == 1) ? "180deg" : "0deg" }], marginLeft: s(6) }} height={vs(9)} width={s(5)} />

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
                <ActivityIndicator size={'small'} color={Colors.Theme} />
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

                }}>{Lang_chg.Reschedule[classStateData.languageIndex]}</Text>

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
                        fontSize: Font.name,
                        alignSelf: 'flex-start',
                      }}
                    >
                      {Lang_chg.Appointmentschedule[classStateData.languageIndex]}
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
                          fontSize: Font.name,
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
                        fontSize: Font.subtext,
                        alignSelf: 'flex-start',
                        color: "#000",
                      }}
                    >
                      {Lang_chg.SelectDate[classStateData.languageIndex]}
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
                        alignSelf: 'flex-start',
                      }}
                    >
                      {Lang_chg.Select_start_time[classStateData.languageIndex]}
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
                                              Font.ques_fontfamily,
                                            fontSize:
                                              Font.sregulartext_size,
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
                                              Font.ques_fontfamily,
                                            fontSize:
                                              Font.sregulartext_size,
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
                            {Lang_chg.noTime[classStateData.languageIndex]}
                          </Text>
                        )}
                      </View>
                    </ScrollView>
                  </View>

                  <Button
                    text={Lang_chg.SAVECHANGERESCHEDULE[classStateData.languageIndex]}
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
          data={item.order_id}
          route={'AppointmentDetails'}
        />

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
