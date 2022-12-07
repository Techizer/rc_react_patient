import React, { Component } from "react";
import HTMLView from "react-native-htmlview";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  Platform,
  PermissionsAndroid,
} from "react-native";
import {
  Colors,
  Font,
  windowHeight,
  msgProvider,
  msgText,
  config,
  windowWidth,
  localStorage,
  Icons,
  consolepro,
  Lang_chg,
  apifuntion,
} from "../Provider/utilslib/Utils";
import { CarAppHeader2 } from "../Allcomponents";
import StarRating from "react-native-star-rating";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AuthInputBoxSec } from "../components";
import moment from "moment-timezone";
import Slider from "@react-native-community/slider";
import SoundPlayer from "react-native-sound-player";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import RNFetchBlob from "rn-fetch-blob";
import { TextInput } from "react-native";
var Sound = require("react-native-sound");

export default class AppointmentDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      send_id: this.props.route.params.send_id,
      status_pass: this.props.route.params.status,
      appointment_id: this.props.route.params.appoinment_id,
      booking_type: this.props.route.params.booking_type,
      modalVisible: false,
      modalPatientPrescription: false,
      viewPrescriptionImage: "",
      appoinment_detetails: "",
      slot_booking_id: "",
      task_details: "",
      time_take_data: "",
      rating: 0,
      emailfocus: false,
      textLength: 0,
      email: 0,
      modalVisiblerating: false,
      new_task_type: "",
      playState: "paused", //playing, paused
      playSeconds: 0,
      duration: 0,
      showPatientDetails: false,
    };
    this.sliderEditing = false;
    Sound.setCategory("Playback", true); // true = mixWithOthers
    this.sound = null;
  }
  

  componentDidMount() {
    FontAwesome.getImageSource("circle", 20, Colors.Theme).then(
      (source) => this.setState({ sliderIcon: source })
    );
    this.getAllDetails(0);
    this.get_day();

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
  }

  onSliderEditStart = () => {
    this.sliderEditing = true;
  };

  onSliderEditEnd = () => {
    this.sliderEditing = false;
  };

  onSliderEditing = (value) => {
    console.log('value value:: ', value, this.sliderEditing);
    if (this.sound && this.state.playState == "pause" && !this.sliderEditing) {
      this.sound.setCurrentTime(value);
      this.setState({ playSeconds: value });
    }
  };

  onStartPlay = async (isPlay = false) => {
    if (this.sound != null) {
      this.playMusic();
      this.sound.play(this.playComplete);
      this.setState({ playState: "playing" });
    } else {
      let recordingUrl =
        config.img_url3 + this.state.appoinment_detetails.symptom_recording;
      console.log("onStartPlay", recordingUrl);

      this.sound = new Sound(recordingUrl, "", (error) => {
        if (error) {
          console.log("failed to load the sound", error);
          return;
        }
        // loaded successfully
        console.log(
          "duration in seconds: " +
            this.sound.getDuration() +
            "number of channels: " +
            this.sound.getNumberOfChannels()
        );
        this.setState(
          {
            playState: isPlay ? "playing" : "paused",
            duration: this.sound.getDuration(),
          },
          () => {}
        );
        if (isPlay) {
          // Play the sound with an onEnd callback
          this.playMusic();
          this.sound.play(this.playComplete);
        }
      });
    }
  };

  playComplete = (success) => {
    if (success) {
      console.log('successfully finished playing');
    } else {
      console.log('playback failed due to audio decoding errors');
      Alert.alert('Notice', 'audio file error. (Error code : 2)');
    }
    if (this.timeout) {
      clearInterval(this.timeout);
    }
    this.setState({ playState: 'paused', playSeconds: 0 });
    this.sound.setCurrentTime(0);
  };

  playMusic = () => {
    console.log(this.sound, this.sound.isLoaded());
    this.timeout = setInterval(() => {

      if (this.sound != null && this.sound.isLoaded() && !this.sliderEditing) {
        this.sound.getCurrentTime((seconds, isPlaying) => {
          this.setState({
            playSeconds: seconds
          });
        })
      }
    }, 100);
  }

  pause = () => {
    if (this.sound != null) {
      this.sound.pause();
    }

    this.setState({ playState: "paused" });
  };

  jumpPrev15Seconds = () => {
    this.jumpSeconds(-15);
  };

  jumpNext15Seconds = () => {
    this.jumpSeconds(15);
  };

  jumpSeconds = (secsDelta) => {
    if (sound) {
      sound.getCurrentTime((secs, isPlaying) => {
        let nextSecs = secs + secsDelta;
        if (nextSecs < 0) nextSecs = 0;
        else if (nextSecs > this.state.duration) nextSecs = this.state.duration;
        sound.setCurrentTime(nextSecs);
        this.setState({ playSeconds: nextSecs });
      });
    }
  };

  getAllDetails = async (page) => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];

    // this.setState({ name: user_details['first_name'], currency_symbol: user_details['currency_symbol'] })

    let url = config.baseURL + "api-patient-appointment-details";
    console.log("url", url);

    var data = new FormData();
    data.append("id", this.state.appointment_id);

    data.append("service_type", this.state.status_pass);

    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data, page)
      .then((obj) => {
        consolepro.consolelog("obj", obj);

        if (obj.status == true) {
          this.setState(
            {
              appoinment_detetails: obj.result,
              message: obj.message,
            },
            () => {
              if (this.state.appoinment_detetails.symptom_recording != "")
                this.onStartPlay(false);
            }
          );
          console.log("obj.result", obj.result);
        } else {
          this.setState({ nurse_data: obj.result, message: obj.message });
          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
      });
  };
  rescdule_click = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];
    let url =
      config.baseURL +
      (this.state.status_pass === "lab"
        ? "api-patient-lab-reschedule-appointment"
        : this.state.status_pass === "doctor"
        ? "api-patient-doctor-reschedule-appointment"
        : "api-patient-reschedule-appointment");
    console.log("url", url);

    var data = new FormData();
    data.append("login_user_id", user_id);
    data.append("order_id", this.state.order_id);
    data.append("service_type", this.state.status_pass);
    if (this.state.status_pass === "lab") {
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
            set_date: obj.result.app_date,
            rescdule_data: obj.result,
            slot_booking_id: obj.result.slot_booking_id,
            message: obj.message,
            task_details: obj.result.task_details,
            new_task_type: obj.result.task_type,
          });

          setTimeout(() => {
            this.setState({ modalVisible: true });
          }, 700);

          console.log("obj.result", obj.result);
        } else {
          this.setState({ rescdule_data: obj.result, message: obj.message });
          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
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
    data.append("service_type", this.state.status_pass);

    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        console.log("misdhfbs ", obj);

        if (obj.status == true) {
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
                    console.log(
                      "finaltime: ",
                      finaltime,
                      " this.state.timcurrent_for_check",
                      this.state.timcurrent_for_check
                    );
                    console.log(
                      "check: ",
                      finaltime >= this.state.timcurrent_for_check,
                      l,
                      nameArr[l]
                    );
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
    data.append("service_type", this.state.status_pass);

    console.log("data", data);
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
          if (
            this.state.slot_booking_id == "TESTS_BOOKING" ||
            this.state.slot_booking_id == "PACKAGE_BOOKING"
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
    data.append("service_type", this.state.status_pass);
    console.log("data", data);
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
          if (this.state.slot_booking_id == "TASK_BOOKING") {
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
                }
              }
              this.setState({
                time_Arr: new_time_hourl,
                final_one: Arr_hour,
                final_arr_two: Arr2_hour,
              });
            } else {
              this.setState({ time_Arr: obj.result.hourly_time });
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

  submit_btn = async () => {
    if (this.state.time_take_data.length <= 0) {
      msgProvider.showError(msgText.EmptyTime[config.language]);
      return false;
    }

    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];

    let url =
      config.baseURL +
      (this.state.status_pass === "lab"
        ? "api-patient-update-lab-reschedule-appointment"
        : this.state.status_pass === "doctor"
        ? "api-patient-update-doctor-reschedule-appointment"
        : "api-patient-update-reschedule-appointment");
    console.log("url", url);
    var data = new FormData();
    console.log("data", data);

    data.append("service_type", this.state.status_pass);
    data.append("order_id", this.state.order_id);
    data.append("from_date", this.state.set_date);
    data.append("from_time", this.state.time_take_data);

    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        if (obj.status == true) {
          this.setState({ modalVisible: false });
          setTimeout(() => {
            msgProvider.showSuccess(obj.message);
            this.getAllDetails(1);
          }, 700);
        } else {
          setTimeout(() => {
            msgProvider.showError(obj.message);
          }, 700);
          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
        this.setState({ loading: false });
      });
  };

  rating_btn = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details.user_id;

    let url = config.baseURL + "api-patient-insert-review";
    console.log("url", url);
    var data = new FormData();
    console.log("data", data);
    data.append("lgoin_user_id", user_id);
    data.append("service_type", this.state.status_pass);
    data.append("order_id", this.state.set_order);
    data.append("rating", this.state.rating);
    data.append("review", this.state.email);
    data.append("provider_id", this.state.send_id);

    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        if (obj.status == true) {
          this.setState({ modalVisiblerating: false });
          setTimeout(() => {
            msgProvider.showSuccess(obj.message);
            this.getAllDetails(1);
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

  downloadPrescription = (imgUrl, filename) => {
    this.permissionFunc(imgUrl, filename);
  };

  permissionFunc = async (imgUrl, filename) => {
    if (Platform.OS == "ios") {
      this.actualDownload(imgUrl, filename);
    } else {
      // if (downloaded) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.actualDownload(imgUrl, filename);
        } else {
          // global.props.hideLoader();
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

  actualDownload = (imgUrl, filename) => {
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

  // downloadPrescription = (imgUrl) => {
  //   if (Platform.OS == "android") {
  //     RNFetchBlob.config({
  //       fileCache: true,
  //       appendExt: "png",
  //       indicator: true,
  //       IOSBackgroundTask: true,
  //       path: path,
  //       addAndroidDownloads: {
  //         useDownloadManager: true,
  //         notification: true,
  //         path: path,
  //         description: "Image",
  //       },
  //     })
  //       .fetch("GET", imgUrl)
  //       .then((res) => {
  //         console.log(res, "end downloaded");
  //       });
  //   } else {
  //     CameraRoll.save(imgUrl)
  //       .then(() => {
  //         msgProvider.showSuccess("Prescription downloaded successfully");
  //       })
  //       .catch((err) => {
  //         console.log("err:", err);
  //         msgProvider.showError(err);
  //       });
  //   }
  // };

  getAudioTimeString(seconds) {
    console.log("seconds:: ", seconds);
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

  render() {
    var item = this.state.appoinment_detetails;
    const currentTimeString = this.getAudioTimeString(this.state.playSeconds);
    const durationString = this.getAudioTimeString(this.state.duration);
    console.log("durationString:: ", durationString);
    if (
      this.state.appoinment_detetails != "" &&
      this.state.appoinment_detetails != null
    ) {
      /* check video call button enable or not */
      var videoCallButton = false;
      var currentDate = moment().unix();
      var appointmentDate = moment(item.app_date).format("YYYY-MM-DD");
      var appointmentTime = item.from_time;
      var isSameDay = moment().isSame(appointmentDate, "day");
      console.log("isSameDay => ", isSameDay);
      var myDate = moment(
        appointmentDate + " " + appointmentTime,
        "YYYY-MM-DD hh:mm A"
      ).unix();
      if (isSameDay) {
        if (currentDate < myDate) {
          let diff = (myDate - currentDate) / 60; //mins
          console.log("CurrentDate < MyDate:: ", diff);
          if (diff <= 10) {
            videoCallButton = true;
          }
        } else {
          videoCallButton = true;
        }
      } else {
        videoCallButton = false;
      }
      console.log("videoCallButton:: ", videoCallButton);

      /* check video call button enable or not */

      return (
        <View style={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1 }} />

          <CarAppHeader2
            navigation={this.props.navigation}
            title={Lang_chg.AppointmentDetails[config.language]}
          />
          <Modal
            backdropOpacity={3}
            //  style={{backgroundColor: Colors.dim_grey}}
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
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
                  height: (windowHeight * 80) / 100,
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
                          // fontSize: (windowWidth * 4) / 100,
                          fontSize: Font.name,
                        }}
                      >
                        {Lang_chg.Reschedule[config.language]}
                      </Text>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={{
                            color: Colors.Theme,
                            fontFamily: Font.Medium,
                            fontSize: Font.name,
                            paddingRight: (windowWidth * 4) / 100,
                          }}
                        >
                          {item.order_id}
                        </Text>

                        <TouchableOpacity
                          onPress={() => this.setState({ modalVisible: false })}
                        >
                          <Image
                            source={Icons.cross}
                            style={{
                              resizeMode: "contain",
                              // backgroundColor: Colors.White,
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
                        marginVertical: (windowWidth * 1) / 100,
                      }}
                    />
                    <View
                      style={{
                        width: "90%",
                        alignSelf: "center",
                        paddingVertical: (windowWidth * 4) / 100,
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: (windowWidth * 3.9) / 100,
                            color: Colors.Theme,
                            textAlign: config.textRotate,
                            paddingBottom: (windowWidth * 1.5) / 100,
                          }}
                        >
                          {this.state.status_pass === "doctor"
                            ? this.state.new_task_type === "Online"
                              ? Lang_chg.OnlineCons[config.language]
                              : Lang_chg.HomeVisit[config.language]
                            : this.state.status_pass === "lab"
                            ? this.state.slot_booking_id === "PACKAGE_BOOKING"
                              ? Lang_chg.HealthPackages[config.language]
                              : Lang_chg.Tests[config.language]
                            : this.state.new_task_type}
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
                        {this.state.status_pass === "doctor" ? (
                          <FlatList
                            data={this.state.task_details}
                            scrollEnabled={true}
                            nestedScrollEnabled={true}
                            renderItem={({ item, index }) => {
                              if (
                                this.state.task_details != "" &&
                                this.state.task_details != null
                              ) {
                                return (
                                  <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => {
                                      // this.check_all(item, index);
                                    }}
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
                                  </TouchableOpacity>
                                );
                              }
                            }}
                          />
                        ) : this.state.slot_booking_id == "TASK_BOOKING" ? (
                          <FlatList
                            data={this.state.task_details}
                            scrollEnabled={true}
                            nestedScrollEnabled={true}
                            renderItem={({ item, index }) => {
                              if (
                                this.state.task_details != "" &&
                                this.state.task_details != null
                              ) {
                                return (
                                  <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => {
                                      // this.check_all(item, index);
                                    }}
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
                                  </TouchableOpacity>
                                );
                              }
                            }}
                          />
                        ) : this.state.slot_booking_id == "TESTS_BOOKING" ||
                          this.state.slot_booking_id == "PACKAGE_BOOKING" ? (
                          <FlatList
                            data={this.state.task_details}
                            scrollEnabled={true}
                            nestedScrollEnabled={true}
                            renderItem={({ item, index }) => {
                              if (
                                this.state.task_details != "" &&
                                this.state.task_details != null
                              ) {
                                return (
                                  <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => {
                                      // this.check_all(item, index);
                                    }}
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
                                  </TouchableOpacity>
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
                                  }}
                                >
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
                            textAlign: config.textRotate,
                          }}
                        >
                          {Lang_chg.Appointmentschedule[config.language]}
                        </Text>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Image
                            source={Icons.calendarimg}
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
                                    this.setState(
                                      {
                                        set_date: item.date1,
                                        set_task: "task_base",
                                        time_take_data: "",
                                      },
                                      () => {
                                        this.state.status_pass === "lab"
                                          ? this.getLabTimeDate()
                                          : this.state.status_pass === "doctor"
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
                                        item.tick == 1
                                          ? "#0787D2"
                                          : Colors.lightGrey,
                                      color: item.tick == 1 ? "White" : "black",
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
                                              this.state.time_take_data
                                                ? {
                                                    backgroundColor:
                                                      Colors.Theme,
                                                    color: "#fff",
                                                  }
                                                : {
                                                    backgroundColor:
                                                      Colors.lightGrey,
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
                                              this.state.time_take_data
                                                ? {
                                                    backgroundColor:
                                                      Colors.Theme,
                                                    color: "#fff",
                                                  }
                                                : {
                                                    backgroundColor:
                                                      Colors.lightGrey,
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
                          backgroundColor: Colors.Theme,
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

          {/* -------------------------------------rating review modal------------------------------ */}

          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <KeyboardAwareScrollView>
              <Modal
                backdropOpacity={3}
                //  style={{backgroundColor: Colors.dim_grey}}
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisiblerating}
                presentationStyle="overFullScreen"
                onRequestClose={() => {
                  this.setState({ modalVisiblerating: false });
                }}
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#00000090",

                    borderRadius: 0,
                  }}
                >
                  <View
                    style={{
                      width: "98%",
                      backgroundColor: Colors.White,
                      marginTop: (windowWidth * 50) / 100,
                      alignSelf: "center",
                      borderRadius: (windowWidth * 10) / 100,

                      borderWidth: (windowWidth * 0.3) / 100,
                      borderColor: Colors.gainsboro,
                      elevation: 5,
                      height: (windowHeight * 40) / 100,
                    }}
                  >
                    {/* task booking section */}

                    <View
                      style={{
                        width: "90%",
                        alignSelf: "center",
                        marginTop: (windowWidth * 4) / 100,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: (windowWidth * 4.5) / 100,
                          fontFamily: Font.Regular,
                          color: "#000",
                          textAlign: config.textRotate,
                        }}
                      >
                        {Lang_chg.rate_appointment[config.language]}
                      </Text>
                      <View
                        style={{
                          width: "65%",
                          alignSelf: "center",
                          marginTop: (windowWidth * 5) / 100,
                          justifyContent: "center",
                        }}
                      >
                        <StarRating
                          disabled={false}
                          fullStar={Icons.filledStar}
                          emptyStar={Icons.unFilledStar}
                          maxStars={5}
                          starSize={45}
                          rating={this.state.rating}
                          selectedStar={(rating) => {
                            this.setState({ rating: rating });
                          }}
                        />
                      </View>
                      {/* <View style={customStyle}>
                        <TextInput
                          onChangeText={(text) => {
                          }}
                          onFocus={() => {
                              this.setState({ emailfocus: true });
                            }}
                            onBlur={() => {
                              this.setState({
                                emailfocus: this.state.email.length > 0 ? true : false,
                              });
                            }}
                          returnKeyLabel="done"
                          returnKeyType="done"
                          onSubmitEditing={() => {
                            Keyboard.dismiss();
                          }}
                          style={styles.textInputArea}
                          numberOfLines={10}
                          multiline={true}
                        /> */}

                      <View
                        style={
                          this.state.emailfocus
                            ? styles.textInputFocus
                            : styles.textInput
                        }
                      >
                        <TextInput
                          style={{
                            width: "100%",
                            color: Colors.Black,
                            fontSize: Font.placeholdersize,
                            textAlign: config.textalign,
                            height: (windowWidth * 20) / 100,
                            paddingLeft: (windowWidth * 3) / 100,
                            fontFamily: Font.placeholderfontfamily,
                            borderRadius: (windowWidth * 1) / 100,
                            justifyContent: "flex-start",
                            textAlign: config.textalign,
                            textAlignVertical: "top",
                          }}
                          caretHidden={false}
                          maxLength={200}
                          placeholder={
                            this.state.emailfocus != true
                              ? Lang_chg.Write_review[config.language]
                              : null
                          }
                          DarkGrey={Colors.DarkGrey}
                          onChangeText={(txt) => {
                            this.setState({ email: txt, textLength: txt });
                          }}
                          onFocus={() => {
                            this.setState({ emailfocus: true });
                          }}
                          onBlur={() => {
                            this.setState({
                              emailfocus:
                                this.state.email.length > 0 ? true : false,
                            });
                          }}
                          ref={(input) => {
                            this.textinput = input;
                          }}
                          keyboardType="email-address"
                          returnKeyLabel="done"
                          returnKeyType="done"
                        />

                        {this.state.emailfocus == true && (
                          <View
                            style={{
                              position: "absolute",
                              backgroundColor: "White",
                              left: (windowWidth * 4) / 100,
                              top: (-windowWidth * 3) / 100,
                              paddingHorizontal: (windowWidth * 1) / 100,
                            }}
                          >
                            <Text
                              style={{
                                color: "#0057A5",
                                textAlign: config.textalign,
                              }}
                            >
                              {Lang_chg.Write_review[config.language]}
                            </Text>
                          </View>
                        )}
                      </View>
                      {this.state.textLength.length > 0 && (
                        <Text
                          style={{
                            fontSize: 10,
                            color: "#515C6F",
                            textAlign: "right",
                          }}
                        >
                          {" "}
                          {this.state.textLength.length}/200{" "}
                        </Text>
                      )}
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginTop: (windowWidth * 8) / 100,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({
                              modalVisiblerating: false,
                              emailfocus: false,
                            });
                          }}
                          style={{
                            width: "45%",
                            paddingVertical: (windowWidth * 2) / 100,
                            alignItems: "center",
                            borderWidth: 1,
                            borderRadius: (windowWidth * 1.5) / 100,
                            borderColor: "#515C6F",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: (windowWidth * 4) / 100,
                              fontFamily: Font.Medium,
                              color: Colors.Theme,
                              textTransform: "uppercase",
                            }}
                          >
                            {Lang_chg.cancelmedia[config.language]}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            this.rating_btn();
                          }}
                          style={{
                            width: "45%",
                            paddingVertical: (windowWidth * 2) / 100,
                            alignItems: "center",
                            borderRadius: (windowWidth * 1.5) / 100,
                            backgroundColor: Colors.Theme,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: (windowWidth * 4) / 100,
                              fontFamily: Font.Medium,
                              color: "#fff",
                              textTransform: "uppercase",
                            }}
                          >
                            {Lang_chg.submitbtntext[config.language]}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>
              <View
                style={{
                  flex: 1,
                  backgroundColor: Colors.White,
                  marginTop: (windowWidth * 2) / 100,
                  marginBottom: (windowWidth * 40) / 100,
                  shadowOpacity: 0.3,
                  shadowColor: "#000",
                  shadowOffset: { width: 2, height: 2 },
                  elevation: 2,
                }}
              >
                <View style={{}}>
                  {/* booking heading */}

                  <View>
                    {/* // heading */}
                    <View
                      style={{
                        width: "90%",
                        alignSelf: "center",
                        justifyContent: "space-between",
                        flexDirection: "row",
                        borderBottomWidth: (windowWidth * 0.3) / 100,
                        borderColor: Colors.gainsboro,
                        paddingVertical: (windowWidth * 3) / 100,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: Font.regulartext_size,
                            color: Colors.DarkGrey,
                          }}
                        >
                          {Lang_chg.BookingID[config.language]}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: Font.regulartext_size,
                            color: Colors.Theme,
                            marginLeft: (windowWidth * 2) / 100,
                          }}
                        >
                          {item.order_id}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={{
                            color: "#FCFFFE",
                            backgroundColor:
                              item.acceptance_status == "Rejected"
                                ? "#FF4500"
                                : item.acceptance_status == "Pending"
                                ? Colors.gold
                                : Colors.Green,
                            fontFamily: Font.Medium,
                            fontSize: (windowWidth * 3) / 100,
                            padding: (windowWidth * 2) / 100,
                            textTransform: "uppercase",
                            paddingVertical: (windowWidth * 0.6) / 100,
                          }}
                        >
                          {item.acceptance_status}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        padding: (windowWidth * 5) / 100,
                        alignItems: "center",
                        paddingVertical: (windowWidth * 4) / 100,
                      }}
                    >
                      <View style={{ width: "28%", alignSelf: "center" }}>
                        <Image
                          source={
                            item.provider_image == "NA" ||
                            item.provider_image == null ||
                            item.provider_image == ""
                              ? Icons.p1
                              : { uri: config.img_url3 + item.provider_image }
                          }
                          style={{
                            width: (windowWidth * 21) / 100,
                            height: (windowWidth * 21) / 100,
                            borderWidth: 1,
                            borderColor: Colors.Theme,
                            borderRadius: (windowWidth * 11.5) / 100,
                          }}
                        />
                      </View>

                      <View
                        style={{
                          width: "60%",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: Font.Medium,
                              color: Colors.Theme,
                              fontSize: (windowWidth * 3.6) / 100,
                              textTransform: "uppercase",
                              textAlign: config.textRotate,
                            }}
                          >
                            {item.service_type}
                          </Text>
                          {item.hospital_id != "" && (
                            <Text
                              style={{
                                color: "#FCFFFE",
                                backgroundColor: "#FFA800",
                                fontFamily: Font.Medium,
                                fontSize: (windowWidth * 3) / 100,
                                padding: (windowWidth * 2) / 100,
                                marginTop: -3,
                                marginLeft: 10,
                                paddingVertical: (windowWidth * 0.6) / 100,
                              }}
                            >
                              {Lang_chg.Hospital[config.language]}
                            </Text>
                          )}
                        </View>
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: (windowWidth * 3.5) / 100,
                            paddingVertical: (windowWidth * 1.1) / 100,
                            color: Colors.DarkGrey,
                            textAlign: config.textRotate,
                          }}
                        >
                          {item.provider_name}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.Regular,
                            fontSize: (windowWidth * 3.5) / 100,
                            color: Colors.cardlighgray,
                            textAlign: config.textRotate,
                          }}
                        >
                          {item.speciality}
                        </Text>
                      </View>
                    </View>
                    {/* appointment details */}
                    <View
                      style={{
                        backgroundColor: Colors.appointmentdetaillightblue,
                        padding: (windowWidth * 5) / 100,
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: Font.headingfont_booking,
                            color: Colors.Theme,
                            textAlign: config.textRotate,
                            paddingBottom: (windowWidth * 3) / 100,
                          }}
                        >
                          {Lang_chg.appointment_schedule[config.language]}
                        </Text>
                      </View>
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          {/* image and store name */}

                          <View
                            style={{
                              width: "50%",
                              marginTop: (windowWidth * 1) / 100,
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: Font.Medium,
                                color: Colors.Theme,
                                fontSize: Font.regulartext_size,
                                textAlign: config.textRotate,
                              }}
                            >
                              {Lang_chg.AppointmentDate[config.language]}
                            </Text>
                            <Text
                              style={{
                                fontFamily: Font.Medium,
                                fontSize: Font.ssubtext,
                                color: Colors.DarkGrey,
                                textAlign: config.textRotate,
                                paddingTop: (windowWidth * 1) / 100,
                              }}
                            >
                              {item.app_date}
                            </Text>

                            <View
                              style={{
                                marginTop: (windowWidth * 3) / 100,
                                borderRadius: (windowWidth * 1) / 100,
                                borderWidth: 1,
                                width: "75%",
                                paddingVertical: (windowWidth * 1) / 100,
                                backgroundColor: "#fff",
                                borderColor: Colors.Theme,
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: Font.Medium,
                                  fontSize: (windowWidth * 3) / 100,
                                  color: Colors.Theme,
                                  textAlign: "center",
                                }}
                              >
                                {item.task_type}
                              </Text>
                            </View>
                          </View>

                          <View
                            style={{
                              width: "50%",
                              alignItems: "flex-end",
                            }}
                          >
                            <View>
                              <Text
                                style={{
                                  fontFamily: Font.Medium,
                                  color: Colors.Theme,
                                  fontSize: Font.regulartext_size,
                                  textAlign: config.textRotate,
                                }}
                              >
                                {Lang_chg.AppointmentTime[config.language]}
                              </Text>
                              <Text
                                style={{
                                  fontFamily: Font.Medium,
                                  fontSize: Font.ssubtext,
                                  textAlign: config.textRotate,
                                  color: Colors.DarkGrey,
                                  paddingTop: (windowWidth * 1) / 100,
                                }}
                              >
                                {item.app_time}
                              </Text>

                              <View
                                style={{
                                  width: "100%",
                                  flexDirection: "row",
                                  marginTop: (windowWidth * 3) / 100,
                                }}
                              >
                                {config.language == 0 ? (
                                  <Image
                                    source={Icons.clock}
                                    style={{
                                      tintColor: Colors.Theme,
                                      resizeMode: "contain",
                                      width: (windowWidth * 4) / 100,
                                      height: (windowWidth * 4) / 100,
                                    }}
                                  />
                                ) : (
                                  <Image
                                    source={Icons.clock_arabic}
                                    style={{
                                      tintColor: Colors.Theme,
                                      resizeMode: "contain",
                                      width: (windowWidth * 4) / 100,
                                      height: (windowWidth * 4) / 100,
                                    }}
                                  />
                                )}

                                <Text
                                  style={{
                                    color: Colors.Theme,
                                    fontFamily: Font.Medium,
                                    textAlign: config.textRotate,
                                    fontSize: (windowWidth * 3.3) / 100,
                                    marginLeft: (windowWidth * 2) / 100,
                                  }}
                                >
                                  {item.task_time}
                                </Text>
                              </View>
                            </View>
                          </View>
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
                            paddingVertical: (windowWidth * 4.5) / 100,
                          }}
                        >
                          <View
                            style={{
                              width: "90%",
                              alignSelf: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: Font.Medium,
                                fontSize: Font.headingfont_booking,
                                color: Colors.Theme,
                                textAlign: config.textRotate,
                                paddingBottom: (windowWidth * 2) / 100,
                              }}
                            >
                              {Lang_chg.PATIENT_SYMPTOM[config.language]}
                            </Text>
                          </View>
                          {item.symptom_recording != "" && (
                            <View
                              style={{
                                width: "90%",
                                alignSelf: "center",
                                // justifyContent: 'space-between',
                                // flexDirection: 'row',
                                borderBottomWidth:
                                  item.symptom_text != ""
                                    ? (windowWidth * 0.3) / 100
                                    : 0,
                                borderColor: Colors.gainsboro,
                                paddingVertical: (windowWidth * 4.5) / 100,
                              }}
                            >
                              {/* <TouchableOpacity onPress={() => {
                              this.onStartPlay(true)
                            }}>
                              <Text>Start -- {this.state.duration}</Text>
                            </TouchableOpacity> */}
                              <View
                                style={{
                                  // marginVertical: 15,
                                  // marginHorizontal: 15,
                                  flexDirection: "row",
                                }}
                              >
                                {/* <Text style={{ color: 'black', alignSelf: 'center' }}>{currentTimeString}</Text> */}
                                <TouchableOpacity
                                  onPress={() => {
                                    this.state.playState == "paused"
                                      ? this.onStartPlay(true)
                                      : this.pause();
                                  }}
                                >
                                  <Image
                                    source={
                                      this.state.playState == "paused"
                                        ? Icons.play
                                        : Icons.pause
                                    }
                                    style={{
                                      width: (windowWidth * 10) / 100,
                                      height: (windowWidth * 10) / 100,
                                      // borderWidth: 1,
                                      // borderColor: Colors.gainsboro,
                                      // borderRadius: 15, //(windowWidth * 11.5) / 100,
                                    }}
                                  />
                                </TouchableOpacity>
                                <Slider
                                  onTouchStart={this.onSliderEditStart}
                                  onTouchEnd={this.onSliderEditEnd}
                                  onValueChange={this.onSliderEditing}
                                  value={this.state.playSeconds}
                                  maximumValue={this.state.duration}
                                  maximumTrackTintColor="gray"
                                  minimumTrackTintColor={Colors.Theme}
                                  thumbImage={this.state.sliderIcon}
                                  style={{
                                    flex: 1,
                                    alignSelf: "center",
                                    marginHorizontal: Platform.select({
                                      ios: 5,
                                    }),
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
                            <View
                              style={{
                                width: "90%",
                                alignSelf: "center",
                                paddingVertical: (windowWidth * 3.5) / 100,
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: Font.Medium,
                                  fontSize: Font.headingfont_booking,
                                  color: Colors.DarkGrey,
                                  textAlign: config.textRotate,
                                  marginTop: (windowWidth * 3) / 100,
                                  marginBottom: (windowWidth * 3.5) / 100,
                                }}
                              >
                                {Lang_chg.SYMPTOM_DESCRIPTION[config.language]}
                              </Text>
                              <Text
                                style={{
                                  fontFamily: Font.Regular,
                                  fontSize: Font.sregulartext_size,
                                  color: Colors.DarkGrey,
                                  textAlign: config.textRotate,
                                }}
                              >
                                {item.symptom_text}
                              </Text>
                            </View>
                          )}
                          {item.patient_prescription != "" && (
                            <View
                              style={{
                                width: "90%",
                                justifyContent: "flex-start",
                                flexDirection: "row",
                                alignSelf: "center",
                              }}
                            >
                              <Image
                                resizeMode="contain"
                                source={Icons.upload}
                                style={{
                                  width: "5%",
                                  height: 15,
                                  marginRight: (windowWidth * 2) / 100,
                                  borderColor: Colors.Theme,
                                }}
                              />
                              <Text
                                style={{
                                  width: "75%",
                                  fontFamily: Font.Regular,
                                  fontSize: (windowWidth * 3) / 100,
                                  textAlign: "auto",
                                  alignItems: "flex-start",
                                  marginTop: (windowWidth * 0.5) / 100,
                                }}
                              >
                                {item.patient_prescription}
                              </Text>
                              <Text
                                onPress={() => {
                                  this.setState(
                                    {
                                      viewPrescriptionImage:
                                        config.img_url3 +
                                        item.patient_prescription,
                                      modalPatientPrescription: true,
                                    },
                                    () => {
                                      console.log(
                                        "viewPrescriptionImage ",
                                        this.state.viewPrescriptionImage
                                      );
                                    }
                                  );
                                }}
                                style={{
                                  width: Platform.OS === "ios" ? "10%" : "15%",
                                  fontFamily: Font.SemiBold,
                                  fontSize: Font.regulartext_size,
                                  color: Colors.Theme,
                                  marginLeft: (windowWidth * 7) / 100,
                                  marginRight: (windowWidth * 3) / 100,
                                  marginTop: (windowWidth * 0.3) / 100,
                                }}
                              >
                                {Lang_chg.VIEW[config.language]}
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                    {/* // prescription doctor */}
                    {item.acceptance_status == "Completed" &&
                      item.service_type == "Doctor" && (
                        <View
                          style={{
                            width: "90%",
                            alignSelf: "center",
                            // justifyContent: 'space-between',
                            // flexDirection: 'row',
                            borderBottomWidth: (windowWidth * 0.3) / 100,
                            borderColor: Colors.gainsboro,
                            paddingVertical: (windowWidth * 4.5) / 100,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: Font.Medium,
                              fontSize: Font.headingfont_booking,
                              color: Colors.Theme,
                              textAlign: config.textRotate,
                              paddingBottom: (windowWidth * 4) / 100,
                            }}
                          >
                            {Lang_chg.PRESCRIPTION[config.language]}
                          </Text>
                          <View
                            style={{
                              flexDirection: "row",
                              width: "100%",
                            }}
                          >
                            <View
                              style={{
                                width: "25%",
                                // backgroundColor: 'red'
                              }}
                            >
                              <Image
                                source={Icons.prescription}
                                style={{
                                  width: (windowWidth * 20.5) / 100,
                                  height: (windowWidth * 17.2) / 100,
                                  // borderWidth: 1,
                                  // borderColor: Colors.gainsboro,
                                  // borderRadius: 15, //(windowWidth * 11.5) / 100,
                                }}
                              />
                            </View>
                            <View
                              style={{
                                width: "75%",
                                // backgroundColor: 'blue'
                              }}
                            >
                              <Text
                                numberOfLines={1}
                                style={{
                                  fontFamily: Font.Medium,
                                  fontSize: Font.smallheadingfont,
                                  color: Colors.DarkGrey,
                                  textAlign: config.textRotate,
                                  marginTop: (windowWidth * 2) / 100,
                                  marginBottom: (windowWidth * 2) / 100,
                                }}
                              >
                                {item.provider_prescription}
                              </Text>
                              <Text
                                style={{
                                  fontFamily: Font.Medium,
                                  fontSize: Font.ssubtext,
                                  color: Colors.Theme,
                                  textAlign: config.textRotate,
                                  marginBottom: (windowWidth * 1) / 100,
                                }}
                              >
                                {item.provider_upd}
                              </Text>
                              <TouchableOpacity
                                onPress={() => {
                                  if (item.provider_prescription != "") {
                                    this.downloadPrescription(
                                      config.img_url3 +
                                        item.provider_prescription,
                                      item.provider_prescription
                                    );
                                  }
                                }}
                              >
                                <Text
                                  style={{
                                    textAlign: "right",
                                    fontFamily: Font.Medium,
                                    fontSize: Font.tabtextsize,
                                    color: Colors.Theme,
                                    marginBottom: (windowWidth * 3) / 100,
                                  }}
                                >
                                  {Lang_chg.DOWNLOAD[config.language]}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      )}
                    {/* // report lab */}
                    {item.acceptance_status == "Completed" &&
                      item.service_type == "Lab" && (
                        <View
                          style={{
                            width: "90%",
                            alignSelf: "center",
                            // justifyContent: 'space-between',
                            // flexDirection: 'row',
                            borderBottomWidth: (windowWidth * 0.3) / 100,
                            borderColor: Colors.gainsboro,
                            paddingVertical: (windowWidth * 2.5) / 100,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: Font.Medium,
                              fontSize: Font.regulartext_size,
                              color: Colors.Theme,
                              textAlign: config.textRotate,
                              paddingBottom: (windowWidth * 4) / 100,
                            }}
                          >
                            {Lang_chg.ReportAttachment[config.language]}
                          </Text>
                          <FlatList
                            data={item.report}
                            scrollEnabled={true}
                            nestedScrollEnabled={true}
                            ItemSeparatorComponent={({}) => {
                              return (
                                <View
                                  style={{
                                    height: 1,
                                    width: "100%",
                                    backgroundColor: Colors.gainsboro,
                                  }}
                                />
                              );
                            }}
                            renderItem={({ item, index }) => {
                              if (item.report != "") {
                                return (
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      width: "100%",
                                      paddingVertical: (windowWidth * 3.5) / 100,
                                    }}
                                  >
                                    <View
                                      style={{
                                        width: "30%",
                                      }}
                                    >
                                      <Image
                                        source={Icons.report}
                                        style={{
                                          width: (windowWidth * 14) / 100,
                                          height: (windowWidth * 16) / 100,
                                          // borderWidth: 1,
                                          // borderColor: Colors.gainsboro,
                                          // borderRadius: 15, //(windowWidth * 11.5) / 100,
                                        }}
                                      />
                                    </View>
                                    <View
                                      style={{
                                        width: "70%",
                                      }}
                                    >
                                      <Text
                                        numberOfLines={1}
                                        style={{
                                          fontFamily: Font.Medium,
                                          fontSize: Font.smallheadingfont,
                                          color: Colors.DarkGrey,
                                          textAlign: config.textRotate,
                                          marginTop: (windowWidth * 2) / 100,
                                          marginBottom: (windowWidth * 2) / 100,
                                        }}
                                      >
                                        {item.report}
                                      </Text>
                                      <Text
                                        style={{
                                          fontFamily: Font.Medium,
                                          fontSize: Font.ssubtext,
                                          color: Colors.lightGrey,
                                          textAlign: config.textRotate,
                                          marginBottom: (windowWidth * 1) / 100,
                                        }}
                                      >
                                        {item.upload_date}
                                      </Text>
                                      <TouchableOpacity
                                        onPress={() => {
                                          if (item.report != "") {
                                            this.downloadPrescription(
                                              config.img_url3 + item.report,
                                              item.report
                                            );
                                          }
                                        }}
                                      >
                                        <Text
                                          style={{
                                            textAlign: "right",
                                            fontFamily: Font.Medium,
                                            fontSize: Font.tabtextsize,
                                            color: Colors.Theme,
                                            marginBottom: (windowWidth * 3) / 100,
                                          }}
                                        >
                                          {Lang_chg.DOWNLOAD[config.language]}
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                );
                              }
                            }}
                          />
                        </View>
                      )}
                    {/* // heading */}
                    <View
                      style={{
                        width: "90%",
                        alignSelf: "center",
                        justifyContent: "space-between",
                        flexDirection: "row",
                        borderBottomWidth: (windowWidth * 0.3) / 100,
                        borderColor: Colors.gainsboro,
                        paddingVertical: (windowWidth * 4.5) / 100,
                      }}
                    >
                      <View
                        style={{
                          width: "100%",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Font.Regular,
                            fontSize: Font.regulartext_size,
                            color: Colors.DarkGrey,
                          }}
                        >
                          {Lang_chg.BookingOn[config.language]}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: (windowWidth * 3.2) / 100,
                            color: Colors.lightGrey,
                            textTransform: "uppercase",
                            marginLeft: (windowWidth * 2) / 100,
                          }}
                        >
                          {item.booking_date}
                        </Text>
                      </View>
                    </View>

                    {/* Prescription */}

                    {/* patient details */}
                    <View
                      style={{
                        width: "90%",
                        alignSelf: "center",
                        // paddingTop: (windowWidth * 3) / 100,
                        paddingBottom: (windowWidth * 3) / 100,
                      }}
                    >
                      <View
                        style={{
                          width: "100%",
                          // backgroundColor: 'red',
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: Font.headingfont_booking,
                            color: Colors.Theme,
                            textAlign: config.textRotate,
                            paddingBottom: 15,
                            paddingTop: 15,
                          }}
                        >
                          {Lang_chg.patient_details[config.language]}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({
                              showPatientDetails:
                                !this.state.showPatientDetails,
                            });
                          }}
                        >
                          <View
                            style={{
                              padding: 15,
                              backgroundColor:
                                Colors.appointmentdetaillightgray,
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
                                this.state.showPatientDetails
                                  ? Icons.upArrow
                                  : Icons.downarrow
                              }
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                      {this.state.showPatientDetails && (
                        <>
                          <Text
                            style={{
                              color: Colors.lightGrey,
                              fontFamily: Font.Medium,
                              fontSize: Font.regulartext_size,
                              textAlign: config.textalign,
                              textAlign: config.textRotate,
                              marginTop: (windowWidth * 1) / 100,
                            }}
                          >
                            {item.patient_name}
                          </Text>

                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: (windowWidth * 1.5) / 100,
                              width: "100%",
                            }}
                          >
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
                                color: Colors.lightGrey,
                                fontFamily: Font.Medium,
                                fontSize: Font.sregulartext_size,
                                textAlign: config.textRotate,
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
                            }}
                          >
                            {config.language == 0 ? (
                              <Image
                                source={require("../icons/ic_settings_phone_24px3x.png")}
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
                                color: Colors.lightGrey,
                                fontFamily: Font.Medium,
                                fontSize: Font.sregulartext_size,
                                textAlign: config.textalign,
                                marginHorizontal: (windowWidth * 3) / 100,
                              }}
                            >
                              {item.patient_contact}
                            </Text>
                          </View>
                        </>
                      )}
                    </View>
                    {item.acceptance_status == "Accepted" &&
                      item.service_type != "Doctor" &&
                      item.service_type != "Lab" && (
                        <View
                          style={{
                            width: "90%",
                            alignSelf: "center",
                            paddingVertical: (windowWidth * 2) / 100,
                            flexDirection: "row",
                            borderTopWidth: 1,
                            borderTopColor: Colors.bordercolor,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: (windowWidth * 3.5) / 100,
                              color: Colors.lightGrey,
                              width: "75%",
                              textAlign: config.textRotate,
                              fontFamily: Font.Medium,
                            }}
                          >
                            {
                              Lang_chg.appointment_accepted_otp_text[
                                config.language
                              ]
                            }
                          </Text>
                          <Text
                            style={{
                              fontSize: (windowWidth * 3.5) / 100,
                              color: Colors.lightGrey,
                              width: "25%",
                              textAlign: "right",
                              fontFamily: Font.Medium,
                            }}
                          >
                            {item.OTP}
                          </Text>
                        </View>
                      )}
                    {item.acceptance_status == "Completed" &&
                      item.service_type != "Doctor" &&
                      item.service_type != "Lab" && (
                        <View
                          style={{
                            width: "90%",
                            alignSelf: "center",
                            paddingVertical: (windowWidth * 2) / 100,
                            flexDirection: "row",
                            borderTopWidth: 1,
                            borderTopColor: Colors.bordercolor,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: (windowWidth * 3.5) / 100,
                              color: Colors.Green,
                              width: "75%",
                              textAlign: config.textRotate,
                              fontFamily: Font.Regular,
                            }}
                          >
                            {
                              Lang_chg.appointment_closed_otp_text[
                                config.language
                              ]
                            }
                          </Text>
                          <Text
                            style={{
                              fontSize: (windowWidth * 3.5) / 100,
                              color: Colors.Green,
                              width: "25%",
                              textAlign: "right",
                              fontFamily: Font.Regular,
                            }}
                          >
                            {item.OTP}
                          </Text>
                        </View>
                      )}
                    {/* payment details */}
                    <View
                      style={{
                        backgroundColor: Colors.appointmentdetaillightgray,
                        width: "100%",
                      }}
                    >
                      <View
                        style={{
                          paddingTop: (windowWidth * 3) / 100,
                          width: "91%",
                          alignSelf: "center",
                        }}
                      >
                        <View>
                          <Text
                            style={{
                              fontFamily: Font.Medium,
                              fontSize: Font.headingfont_booking,
                              textAlign: config.textRotate,
                              color: Colors.Theme,
                            }}
                          >
                            {Lang_chg.Payment[config.language]}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingVertical: (windowWidth * 2) / 100,
                            borderBottomWidth: (windowWidth * 0.3) / 100,
                            borderColor: Colors.bordercolor,
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
                                      // this.check_all(item, index);
                                    }}
                                    style={{
                                      alignItems: "center",
                                      width: "100%",
                                      alignSelf: "center",
                                      backgroundColor: "#F8F8F8",
                                      paddingVertical: (windowWidth * 1.7) / 100,
                                      flexDirection: "row",
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
                                }}
                              >
                                {Lang_chg.distanceFare[config.language]}
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
                                fontSize: (windowWidth * 3.6) / 100,
                                color: "#000",
                              }}
                            >
                              {Lang_chg.distanceFare[config.language]}
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
                        )}
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingVertical: (windowWidth * 2) / 100,
                            borderTopWidth: (windowWidth * 0.3) / 100,
                            borderColor: Colors.bordercolor,
                            // marginTop: windowWidth * 1 / 100,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: Font.Medium,
                              fontSize: (windowWidth * 3.7) / 100,
                              color: Colors.Theme,
                              // marginTop: windowWidth * 1 / 100,
                            }}
                          >
                            {Lang_chg.subTotal[config.language]}
                          </Text>
                          <Text
                            style={{
                              fontFamily: Font.Medium,
                              fontSize: (windowWidth * 3.7) / 100,
                              color: Colors.Theme,
                              // marginTop: windowWidth * 1 / 100,
                            }}
                          >
                            {item.sub_total_price}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingVertical: (windowWidth * 1) / 100,
                            // borderBottomWidth: (windowWidth * 0.3) / 100,
                            borderColor: Colors.bordercolor,
                            marginTop: (windowWidth * 1) / 100,
                            marginBottom: (windowWidth * 3) / 100,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: Font.Regular,
                              fontSize: (windowWidth * 3.6) / 100,
                              color: "#000",
                            }}
                          >
                            {item.vat_percent}
                          </Text>
                          <Text
                            style={{
                              fontFamily: Font.Regular,
                              fontSize: (windowWidth * 3.6) / 100,
                              color: "#000",
                            }}
                          >
                            {item.vat}
                          </Text>
                        </View>

                        {/* <View
                            style={{
                              
                              paddingVertical: (windowWidth * 3) / 100,
                              borderTopWidth: (windowWidth * 0.3) / 100,
                              borderColor: Colors.bordercolor,
                            }}>
                           
                            <Text
                              style={{
                                fontFamily: Font.Medium,
                                fontSize: Font.regulartext_size,
                                color: Colors.Theme,
                                textAlign:'right'
                              }}>{item.price}
                             
                            </Text>
                          </View> */}
                      </View>
                    </View>
                    {/* last button */}
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
                        {config.language == 0 ? (
                          <Image
                            source={Icons.purse}
                            style={{
                              resizeMode: "contain",
                              width: 15,
                              height: 15,
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
                            fontSize: (windowWidth * 3.7) / 100,
                            fontFamily: Font.Medium,
                            marginTop: 0.5,
                            marginLeft: (windowWidth * 2) / 100,
                          }}
                        >
                          {item.price}
                        </Text>
                      </View>
                      {item.acceptance_status == "Pending" && (
                        <TouchableOpacity
                          onPress={() => {
                            this.rescdule_click(),
                              this.get_day(),
                              this.setState({
                                order_id: item.id,
                                time_take_data: "",
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
                            {Lang_chg.Reschedule[config.language]}
                          </Text>
                        </TouchableOpacity>
                      )}
                      {item.acceptance_status == "Accepted" &&
                        item.service_type == "Doctor" &&
                        videoCallButton == true && (
                          <>
                            <TouchableOpacity
                              onPress={() => {
                                // this.setState({
                                //   id: item.id,
                                // }, () => {
                                //   this.updateProviderAppointmentStatus("Accept")
                                // })
                                this.props.navigation.navigate("VideoCall", {
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
                                {Lang_chg.VIDEO_CALL[config.language]}
                              </Text>
                            </TouchableOpacity>
                          </>
                        )}
                      {item.acceptance_status == "Completed" && (
                        <View style={{ alignItems: "flex-end" }}>
                          {item.avg_rating != "" && item.avg_rating != 0 ? (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                paddingLeft: "2%",
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
                                {Lang_chg.rated[config.language]}
                              </Text>
                              <StarRating
                                disabled={false}
                                fullStar={Icons.filledStar}
                                emptyStar={Icons.unFilledStar}
                                maxStars={5}
                                starSize={15}
                                rating={item.avg_rating}
                              />
                            </View>
                          ) : (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({
                                  modalVisiblerating: true,
                                  set_order: item.order_id,
                                });
                              }}
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                paddingVertical: (windowWidth * 2) / 100,
                                paddingHorizontal: (windowWidth * 2) / 100,
                                backgroundColor: "#FFA800",
                                borderRadius: (windowWidth * 2) / 100,
                              }}
                            >
                              <Image
                                source={Icons.unFilledStar}
                                style={{
                                  resizeMode: "contain",
                                  width: (windowWidth * 4.5) / 100,
                                  height: (windowWidth * 4.5) / 100,
                                  tintColor: "#fff",
                                  alignSelf: "center",
                                }}
                              />

                              <Text
                                style={{
                                  fontFamily: Font.SemiBold,
                                  color: "#fff",
                                  fontSize: (windowWidth * 4) / 100,
                                  marginLeft: (windowWidth * 1) / 100,
                                }}
                              >
                                {Lang_chg.rate_appointment[config.language]}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      )}
                      {item.acceptance_status == "Rejected" &&
                        item.rf_text != "" && (
                          <View
                            style={{
                              backgroundColor: "#FF4500",
                              width: (windowWidth * 24) / 100,
                              borderRadius: 1,
                              paddingVertical: (windowWidth * 1) / 100,
                              justifyContent: "center",
                              marginLeft: (windowWidth * 2) / 100,
                            }}
                          >
                            <Text
                              style={{
                                textAlign: "center",
                                color: Colors.White,
                                textTransform: "uppercase",
                                fontFamily: Font.SemiBold,
                                fontSize: (windowWidth * 2.5) / 100,
                              }}
                            >
                              {Lang_chg.Refunde[config.language]}
                            </Text>
                          </View>
                        )}
                    </View>
                    <View
                      style={{
                        width: "90%",
                        paddingBottom: (windowWidth * 2) / 100,
                        alignSelf: "center",
                        alignItems: "flex-start",
                      }}
                    >
                      <HTMLView value={item.rf_text} stylesheet={HTMLstyles} />
                    </View>
                  </View>
                </View>
              </View>
              <Modal
                backdropOpacity={3}
                //  style={{backgroundColor: Colors.dim_grey}}
                animationType="slide"
                transparent={true}
                visible={this.state.modalPatientPrescription}
                presentationStyle="overFullScreen"
                onRequestClose={() => {
                  this.setState({ modalPatientPrescription: false });
                }}
              >
                <View
                  style={{
                    width: "96%",
                    backgroundColor: Colors.White,
                    margin: (windowWidth * 15) / 100,
                    borderRadius: (windowWidth * 2) / 100,
                    borderWidth: 1,
                    borderColor: Colors.lightGrey,
                    shadowOpacity: 0.5,
                    shadowColor: "#000",
                    shadowOffset: { width: 2, height: 2 },
                    elevation: 5,
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    flex: 1,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      top: -10,
                      right: -5,
                    }}
                    onPress={() => {
                      this.setState({
                        modalPatientPrescription: false,
                      });
                    }}
                  >
                    <Image
                      source={Icons.cross}
                      style={{
                        resizeMode: "contain",
                        width: 30,
                        height: 30,
                        alignSelf: "center",
                      }}
                    />
                  </TouchableOpacity>
                  <Image
                    source={{
                      uri: this.state.viewPrescriptionImage,
                    }}
                    style={{
                      resizeMode: "cover",
                      width: "100%",
                      height: (windowHeight * 40) / 100,
                    }}
                  />
                </View>
              </Modal>
            </KeyboardAwareScrollView>
          </ScrollView>
        </View>
      );
    } else {
      return <View />;
    }
  }
}
const styles = StyleSheet.create({
  textInputFocus: {
    borderColor: Colors.Blue,
    backgroundColor: Colors.white2,
    borderBottomWidth: 1,
    borderWidth: 1,
    marginTop: 20,
    paddingLeft: 5,
    paddingRight: 5,
  },
  textInput: {
    borderColor: Colors.lightGrey,
    backgroundColor: Colors.white2,
    borderBottomWidth: 1,
    borderWidth: 1,
    marginTop: 20,
    paddingLeft: 5,
    paddingRight: 5,
  },
  textInputArea: {
    fontSize: (windowWidth * 4) / 100,
    fontFamily: Font.ques_fontfamily,
    color: "#8F98A7",
    height: 100,
    width: "90%",
    justifyContent: "flex-start",
    textAlign: "center",
    textAlignVertical: "top",
    color: "#000",
    // paddingTop: 10,
    paddingVertical: (windowWidth * 2) / 100,
    textAlign: config.textalign,
  },
});
const HTMLstyles = StyleSheet.create({
  font: {
    color: "#FF0000",
  },
  
});
