import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { TabbyProductSnippetCreditCard } from 'tabby-react-native-sdk';
import { SkypeIndicator } from "react-native-indicators";
import { SvgXml } from "react-native-svg";
import { dummyUser, GoldStar } from "../../../Icons/Index";
import { Font } from "../../../Provider/Colorsfont";
import {
  Colors,
  config,
  LangProvider,
  Icons,
  mediaprovider,
  windowWidth,
  apifuntion,
  Button,
  Cameragallery,
  msgProvider
} from "../../../Provider/Utils/Utils";
import { s, vs } from "react-native-size-matters";
import { useDispatch, useSelector } from "react-redux";
import LoadingSkeleton from "../../../Components/LoadingSkeleton";
import { useIsFocused } from "@react-navigation/native";
import { request, check, PERMISSIONS, RESULTS } from "react-native-permissions";
import { TabbyPaymentStatus } from "../../../Redux/Actions";
import AudioRecorder from "../../../Components/AudioRecorder";
import moment from "moment";
import { AudioPlayer } from "../../../Components/AudioPlayer";
import { useSafeAreaInsets } from "react-native-safe-area-context";



const HomeVisit = ({ navigation }) => {

  const { selectedProvider, loggedInUserDetails, languageIndex, appLanguage } = useSelector(state => state.StorageReducer)
  const dispatch = useDispatch()
  const [statesData, setStatesData] = useState({
    bookingDetails: null,
    time_Arr: [],
    bookingDetails: null,
    set_date: "",
    Error_popup: false,
    selectedTime: "",
    vatPrice: "",
    totalPrice: "",
    currency_symbol: loggedInUserDetails?.currency_symbol,
    subTotal: '',
    check_currentdate: '',
    date_array: [],
    isLoadingDetails: true,
    prescriptionsImage: null,
    symptomsRecording: null,
    symptomText: '',
    isAddingToCart: false,
    isLoadingDates: false
  })
  const isFocused = useIsFocused()
  const [inputFocus, setInputFocus] = useState(false);
  const [mediaModal, setMedialModal] = useState(false);
  const [isShowRecordingPanle, setIsShowRecordingPanel] = useState(false)
  const [isRecordAudio, setIsRecordAudio] = useState(false)
  const insets = useSafeAreaInsets()

  useEffect(() => {
    if (isFocused) {
      resetState()
      const promise1 = getDoctorServices();
      const promise2 = getDay();
      Promise.all([promise1, promise2]).then(res => {

      }).catch(err => {
        console.log('promises error', err);
        setState({ isLoadingDetails: false })
      })
    }
  }, [isFocused]);

  useEffect(() => {
    if (statesData.bookingDetails) {
      setState({ isLoadingDetails: false })
    }
  }, [statesData.bookingDetails])

  const resetState = () => {
    setIsShowRecordingPanel(false)
    setState({
      bookingDetails: null,
      time_Arr: [],
      bookingDetails: null,
      set_date: "",
      Error_popup: false,
      selectedTime: "",
      vatPrice: "",
      totalPrice: "",
      currency_symbol: loggedInUserDetails?.currency_symbol,
      subTotal: '',
      check_currentdate: '',
      date_array: [],
      isLoadingDetails: true,
      prescriptionsImage: null,
      symptomsRecording: null,
      symptomText: '',
      isAddingToCart: false,
      isLoadingDates: false
    })
  }

  const CheckMicrophonePermission = () => {
    check(Platform.OS === 'ios' ? (PERMISSIONS.IOS.MICROPHONE) : PERMISSIONS.ANDROID.RECORD_AUDIO)
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log('This feature is not available (on this device / in this context)');
            break;
          case RESULTS.DENIED:
            console.log('The permission has not been requested / is denied but requestable');
            GetMicrophonePermission()
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            setState({
              symptomsRecording: null
            })
            setIsRecordAudio(true)
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            msgProvider.showError('Please grant microphone permissions from phone settings')
            break;
        }
      })
      .catch((error) => {
        console.log("locationPermission-error", error);
      });
  }

  const GetMicrophonePermission = () => {
    request(Platform.OS === 'ios' ? (PERMISSIONS.IOS.MICROPHONE) : PERMISSIONS.ANDROID.RECORD_AUDIO)
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log('This feature is not available (on this device / in this context)');
            break;
          case RESULTS.DENIED:
            console.log('The permission has not been requested / is denied but requestable');
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            setState({
              symptomsRecording: null
            })
            setIsRecordAudio(true)
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch((error) => {
        console.log("locationPermission-error", error);
      });
  }

  const setState = payload => {
    setStatesData(prev => ({
      ...prev,
      ...payload
    }))
  }

  const customStyle = inputFocus ? styles.textInputFocus : styles.textInput;

  const Camerapopen = async () => {
    mediaprovider
      .launchCamera()
      .then((obj) => {
        // console.log('Camerapopen', obj);
        setMedialModal(false);
        let imageObj = {
          uri: obj.path,
          type: "image/jpg",
          name: obj.path.substring(obj.path.lastIndexOf("/") + 1, obj.length)
        }
        setState({ prescriptionsImage: imageObj })
      }).catch((error) => {
        setMedialModal(false);
      });
  };

  const Galleryopen = () => {
    mediaprovider
      .launchGellery()
      .then((obj) => {
        // console.log('Galleryopen', obj);
        setMedialModal(false);
        let imageObj = {
          uri: obj.path,
          type: "image/jpg",
          name: obj.path.substring(obj.path.lastIndexOf("/") + 1, obj.length)
        }
        setState({ prescriptionsImage: imageObj })
      }).catch((error) => {
        setMedialModal(false);
      });
  };

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
    // getDoctorTimeDate(date1_show, date1_show)
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

  const getDoctorTimeDate = async (selectedDate, currentData = '') => {
    setState({
      isLoadingDates: true,
      time_Arr: [],
      final_one: [],
      final_two: [],
    })
    let url = config.baseURL + "api-patient-doctor-next-date-time";

    var data = new FormData();
    data.append("provider_id", selectedProvider ?selectedProvider?.providerId: '');
    data.append("date", selectedDate);
    data.append("service_type", selectedProvider.providerType);

    apifuntion
      .postApi(url, data)
      .then((obj) => {
        console.log("getDoctorTimeDate....... ", obj);
        if (obj.status == true) {
          if (obj.result.home_visit_time != "") {
            var names = obj.result.home_visit_time;
            var nameArr = names.split(",");

            const newTimeSlot = [];
            const Arr1 = [];
            const Arr2 = [];
            var home_visit_ar1 = false;
            var home_visit_ar2 = true;
            for (let l = 0; l < nameArr.length; l++) {
              if (currentData == selectedDate) {
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
                  newTimeSlot.push({
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
                newTimeSlot.push({ time: nameArr[l], time_status: false });
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
            setState({
              time_Arr: newTimeSlot,
              final_one: Arr1,
              final_two: Arr2,
            });
            setTimeout(() => {
              setState({ isLoadingDates: false })
            }, 1000);
          } else {
            setTimeout(() => {
              setState({ isLoadingDates: false })
            }, 1000);
            setState({ time_Arr: obj.result.home_visit_time });
          }
        } else {
          return false;
        }

      })
      .catch((error) => {
        console.log("getDoctorTimeDate-error ------- " + error);
      });
  };

  const getDoctorServices = async () => {

    var current = new Date();
    let min =
      current.getMinutes() < 10
        ? "0" + current.getMinutes()
        : current.getMinutes();
    let hour =
      current.getHours() < 10 ? "0" + current.getHours() : current.getHours();
    var timcurrent = hour + ":" + min;
    setState({ timcurrent_for_check: timcurrent });
    if (loggedInUserDetails?.image != null) {
      setState({
        profile_img: loggedInUserDetails?.image
      });
    }
    let url = config.baseURL + "api-patient-doctor-booking-init-details";

    var data = new FormData();
    data.append("provider_id", selectedProvider ?selectedProvider?.providerId: '');
    data.append("lgoin_user_id", loggedInUserDetails?.user_id);
    data.append("service_type", selectedProvider.providerType);

    apifuntion
      .postApi(url, data)
      .then((obj) => {
        console.log('getDoctorServices-response.....', obj.result);
        if (obj.status == true) {
          let subTotal = 0;
          let vatPrice = 0;
          let Total = 0;
          subTotal = subTotal + parseInt(obj.result.home_visit_task[0].task_price) + parseInt(obj.result?.distance_fare)
          vatPrice = parseFloat(obj.result.online_base_task[0].task_price * JSON.parse(obj.result.vat_price)) / 100
          Total = subTotal + vatPrice
          setState({
            bookingDetails: obj.result,
            message: obj.message,
            hourList: obj.result.hour_base_task,
            vatPrice: vatPrice,
            subTotal: subTotal,
            totalPrice: Total
          });
          if (obj.result.home_visit_time != undefined && obj.result.home_visit_time != "") {
            var names = obj.result.home_visit_time;
            var nameArr = names.split(",");

            const newTimeSlot = [];
            const Arr2 = [];
            const Arr1 = [];
            var ar1 = false;
            var ar2 = true;

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
                newTimeSlot.push({ time: nameArr[l], time_status: false });


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
            setState({
              time_Arr: newTimeSlot,
              final_one: Arr1,
              final_two: Arr2,
            });

          } else {

          }

        } else {
          msgProvider.showError(obj.message);
          return false;
        }
      })
      .catch((error) => {
        setTimeout(() => {
          setState({ isLoadingDetails: false })
        }, 250);
        setTimeout(() => {
          setState({ Error_popup: true });
        }, 700);

        console.log("getDoctorServices-error ------- " + error);
      });
  };

  const AddToCart = async () => {
    Keyboard.dismiss();
    dispatch(TabbyPaymentStatus(false))
    if (statesData.selectedTime == '' || statesData.selectedTime == null) {
      msgProvider.showError(LangProvider.EmptyTime[languageIndex]);
      return false;
    }
    // if (statesData.bookingDetails.distancelogic == 0) {
    //   msgProvider.showError('Please recheck your address or book a different provider.');
    //   return false;
    // }
    setState({ isAddingToCart: true })
    let url = config.baseURL + "api-patient-insert-cart";
    var data = new FormData();

    data.append("hospital_id", selectedProvider.hospitalId);
    data.append("service_type", selectedProvider.providerType);
    data.append("login_user_id", loggedInUserDetails?.user_id);
    data.append("currency_symbol", statesData.currency_symbol);
    data.append("family_member_id", selectedProvider.family_member_id);
    data.append("provider_id", selectedProvider ?selectedProvider?.providerId: '');
    data.append("task_id", statesData.bookingDetails?.home_visit_task[0].id);
    data.append("task_price", statesData.bookingDetails?.home_visit_task[0].task_price);
    data.append("task_type", 'home_visit');
    data.append("from_date", statesData.set_date);
    data.append("from_time", statesData.selectedTime);
    data.append("appointment_type", 'online');
    data.append("task_price_total", statesData.bookingDetails?.home_visit_task[0].task_price);
    data.append("vat_percent_used", "" + statesData.bookingDetails?.vat_price);
    data.append("vat_price", statesData.vatPrice);
    data.append("distance_fare", statesData.bookingDetails?.distance_fare);
    data.append("sub_total_price", statesData.subTotal);
    data.append("total_price", statesData.totalPrice);
    data.append("symptom_text", statesData.symptomText);

    if (statesData.bookingDetails?.distancetext != '' && statesData.bookingDetails?.distancetext != null && statesData.bookingDetails?.distancetext != undefined) {
      data.append('distance', statesData.bookingDetails?.distancetext)
    } else {
      data.append('distance', '')
    }


    if (statesData.prescriptionsImage != null) {
      data.append("upload_prescription", statesData.prescriptionsImage);
    }

    if (statesData.symptomsRecording != null) {
      data.append("symptom_recording", statesData.symptomsRecording);
    }


    // console.log('body data', data);
    // console.log('body data', statesData.prescriptionsImage);
    // console.log('body data', statesData.symptomsRecording);
    // return
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        setState({ isAddingToCart: false })
        if (obj.status == true) {
          setTimeout(() => {
            navigation.navigate("CartDetails");
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
        setState({ isAddingToCart: false })
        console.log("AddToCart-error ------- " + error);
        setState({ loading: false });
      });
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

  var Details = statesData.bookingDetails;

  if (statesData.isLoadingDetails) {
    return (
      <LoadingSkeleton />
    );
  } else {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor, }}>

        <ScrollView
          // style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: (windowWidth * 30) / 100 }}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}>

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
                  (Details?.image == "NA" || Details?.image == null || Details?.image == "") ?
                    <SvgXml xml={dummyUser} height={s(75)} width={s(75)} style={{ borderColor: Colors.Border }} />
                    :
                    <Image
                      source={{ uri: config.img_url3 + Details?.image }}
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
                  {Details?.provider_name}
                </Text>
                {
                  Details && Details?.hospital_name != '' &&
                  <Text
                    style={{
                      fontFamily: Font.Medium,
                      fontSize: Font.small,
                      alignSelf: 'flex-start',
                      color: Colors.Theme,
                      marginTop: vs(2)
                    }}>
                    {Details?.hospital_name}
                  </Text>
                }
                {
                  selectedProvider.providerType != 'lab' &&
                  <Text
                    style={{
                      fontFamily: Font.Regular,
                      fontSize: Font.small,
                      alignSelf: 'flex-start',
                      color: Colors.lightGrey,
                      marginTop: vs(2)
                    }}>
                    {Details?.qualification}
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
                  {Details?.speciality}
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
                  {selectedProvider.providerType === 'lab' ? LangProvider.ESTABLISHED[languageIndex] : LangProvider.Experience[languageIndex]}
                </Text>
                <Text
                  style={{
                    fontFamily: Font.Medium,
                    fontSize: Font.xlarge,
                    alignSelf: 'flex-start',
                    color: Colors.detailTitles,
                    marginTop: vs(5)
                  }}>
                  {Details?.experience ? Details?.experience : '-'}
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
                  {LangProvider.Bookings[languageIndex]}
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
                  {Details?.booking_count ? Details?.booking_count : '-'}
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
                  {LangProvider.Rating[languageIndex]}
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
                    {Details?.avg_rating ? `${Details?.avg_rating}.0` : 'NA'}
                  </Text>
                </View>

              </View>
            </View>

            {/* -------------------Desc Container-------------------- */}

            {
              Details?.description &&
              <View style={styles.descContainer}>
                <Text
                  style={{
                    fontFamily: Font.Regular,
                    fontSize: Font.small,
                    alignSelf: 'flex-start',
                    color: Colors.detailTitles,
                  }}>
                  {Details?.description}
                </Text>
              </View>
            }
          </View>


          <View style={{ paddingVertical: vs(9), marginTop: vs(7), paddingHorizontal: s(13), width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.White }}>

            <View>
              <Text
                style={{
                  fontFamily: Font.Medium,
                  fontSize: Font.medium,
                  alignSelf: 'flex-start',
                  color: Colors.detailTitles
                }}>
                {LangProvider.TalkToDoctor[languageIndex]}
              </Text>
              <Text
                style={{
                  fontFamily: Font.Regular,
                  fontSize: Font.small,
                  alignSelf: 'flex-start',
                  color: Colors.lightGrey,
                }}>
                {LangProvider.Optional[languageIndex]}
              </Text>
            </View>

            <TouchableHighlight
              onPress={() => {
                setIsShowRecordingPanel(!isShowRecordingPanle)
                console.log(isShowRecordingPanle);
              }}
              underlayColor={Colors.Highlight}
              style={{
                height: 30,
                width: 30,
                borderRadius: 6,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <Image
                style={{
                  height: s(15),
                  width: vs(15),
                  transform: [{ rotate: isShowRecordingPanle ? "180deg" : "0deg" }]
                }}
                resizeMode='contain'
                source={Icons.Down}
              />
            </TouchableHighlight>


          </View>

          {/* <View style={{ width: '100%', alignSelf: 'center', height: vs(7), backgroundColor: Colors.backgroundcolor, marginTop: vs(6) }}></View> */}

          {
            isShowRecordingPanle &&
            <View style={{ paddingVertical: vs(9), width: '100%', backgroundColor: Colors.White }}>
              <View style={{ paddingHorizontal: s(13), }}>
                {/* <Text
                  style={{
                    fontFamily: Font.Medium,
                    fontSize: Font.medium,
                    alignSelf: 'flex-start',
                    color: Colors.detailTitles
                  }}>
                  {LangProvider.TalkToDoctor[languageIndex]}
                </Text> */}


                {/* --------------Recoring Container-------------- */}

                <TouchableOpacity
                  onPress={() => {
                    CheckMicrophonePermission()
                  }}
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    alignSelf: 'center'

                  }}>
                  <Image
                    resizeMode="contain"
                    source={Icons.mic}
                    style={{
                      width: (windowWidth * 10) / 100,
                      height: (windowWidth * 10) / 100,
                      borderColor: Colors.Theme,
                    }}
                  />
                </TouchableOpacity>

                {
                  statesData.symptomsRecording != null &&

                  <AudioPlayer
                    url={statesData.symptomsRecording.uri}
                    containerStyle={{
                      marginTop: (windowWidth * 5) / 100
                    }}
                  />

                }
              </View>



              <View style={{ width: '100%', alignSelf: 'center', height: vs(1.5), backgroundColor: Colors.backgroundcolor, marginTop: vs(6) }}></View>

              <View
                style={{
                  alignItems: "flex-start",
                  alignSelf: "auto",
                  paddingTop: vs(14),
                  paddingHorizontal: s(13)
                }}>
                <View
                  style={{
                    width: "100%",
                    alignSelf: "center",
                  }}>
                  <Text
                    style={{
                      fontFamily: Font.Regular,
                      alignSelf: 'flex-start',
                      alignSelf: "baseline",
                      fontSize: Font.medium,
                    }}
                  >
                    {LangProvider.TalkToUs[languageIndex]}
                  </Text>

                  {/* ----------------Input------------- */}

                  <View style={customStyle}>
                    <TextInput
                      placeholder="Example symptoms… I am felling down, my head is paining from last 2 days."
                      onChangeText={(text) => {
                        setState({ symptomText: text })
                      }}
                      onFocus={() => setInputFocus(true)}
                      onBlur={() => setInputFocus(false)}
                      returnKeyLabel="done"
                      returnKeyType="done"
                      onSubmitEditing={() => {
                        Keyboard.dismiss();
                      }}
                      style={styles.textInputArea}
                      numberOfLines={10}
                      multiline={true}
                    />
                  </View>


                  <TouchableOpacity
                    onPress={() => {
                      setMedialModal(true);
                    }}
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      alignItems: 'center',
                      alignSelf: "center",
                      marginTop: vs(10)
                    }}>
                    <Image
                      resizeMode="contain"
                      source={Icons.Attachment}
                      style={{
                        width: 16,
                        height: 16,
                        marginRight: (windowWidth * 3) / 100,
                        borderColor: Colors.Theme,
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: Font.Regular,
                        fontSize: Font.small,
                        color: Colors.darkText,
                        alignSelf: 'flex-start',
                      }}>
                      {statesData.prescriptionsImage == null
                        ? LangProvider.Upload[languageIndex]
                        : statesData.prescriptionsImage.name}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

            </View>
          }

          {/* ------------------Date Time--------------- */}
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
                  {LangProvider.Appointmentschedule[languageIndex]}
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
                  fontSize: Font.medium,
                  alignSelf: 'flex-start',
                  color: Colors.detailTitles,
                }}
              >
                {LangProvider.SelectDate[languageIndex]}
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
                          })
                          getDoctorTimeDate(item.date1, statesData.check_currentdate),
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

            </View>

            <View
              style={{
                width: "100%",
                alignSelf: "center",
                paddingTop: vs(7),
                paddingHorizontal: s(11)
              }}>
              <Text
                style={{
                  fontFamily: Font.Regular,
                  fontSize: Font.medium,
                  color: Colors.detailTitles,
                  alignSelf: 'flex-start',
                }}
              >
                {LangProvider.Select_start_time[languageIndex]}
              </Text>

              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <View style={{ width: "100%", alignItems: "center" }}>

                  <View style={{ width: "100%", alignItems: "center" }}>
                    {statesData.time_Arr.length > 0 ? (
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
                                      selectedTime: item.time,
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
                                          Font.Regular,
                                        fontSize: Font.small,
                                        padding: (windowWidth * 2) / 100,
                                        paddingHorizontal:
                                          (windowWidth * 3.3) / 100,
                                      },
                                      item.time ==
                                        statesData.selectedTime
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
                            data={statesData.final_two}
                            renderItem={({ item, index }) => {
                              return (
                                <TouchableOpacity
                                  onPress={() => {
                                    setState({
                                      selectedTime: item.time,
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
                                          Font.Regular,
                                        fontSize:
                                          Font.small,
                                        padding: (windowWidth * 2) / 100,
                                        paddingHorizontal:
                                          (windowWidth * 3.3) / 100,
                                      },
                                      item.time ==
                                        statesData.selectedTime
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
                    ) :
                      statesData.isLoadingDates ?
                        (
                          <View style={{ width: windowWidth, paddingVertical: (windowWidth * 3) / 100 }}>
                            <SkypeIndicator color={Colors.Theme} size={20} />
                          </View>
                        )
                        :
                        (
                          <Text
                            style={{
                              fontFamily: Font.MediumItalic,
                              fontSize: Font.medium,
                              alignSelf: "center",
                              paddingVertical: (windowWidth * 3) / 100,
                              textAlign: "center",
                              marginLeft: (windowWidth * 25) / 100,
                            }}>
                            {LangProvider.noTime[languageIndex]}
                          </Text>
                        )}
                  </View>


                </View>
              </ScrollView>
            </View>
          </View>

          {/* ----------------Promo------------------- */}

          <TabbyProductSnippetCreditCard
            lang={languageIndex == 0 ? 'en' : "ar"}
            currency={loggedInUserDetails?.currency_symbol}
            price={statesData.totalPrice}
            containerStyle={{ marginTop: vs(7) }}
          />

          {/* Payment section */}
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
                fontSize: Font.large,
                color: Colors.Theme,
                alignSelf: 'flex-start',
              }}>
              {LangProvider.Payment[languageIndex]}
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems:'center',
                justifyContent: "space-between",
                paddingVertical: (windowWidth * 2) / 100,
                borderBottomWidth: 1.5,
                borderBottomColor: Colors.backgroundcolor,
                marginTop: (windowWidth * 2) / 100,
              }}
            >
              <Text
                style={{
                  fontFamily: Font.Regular,
                  fontSize: Font.small,
                  color: Colors.detailTitles,
                }}>
                {Details?.home_visit_task[0].duration}
              </Text>
              <Text
                style={{
                  fontFamily: Font.Regular,
                  fontSize: Font.small,
                  color: Colors.detailTitles,
                }}>
                {`${Details?.home_visit_task[0].task_price} ${statesData.currency_symbol}`}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems:'center',
                justifyContent: "space-between",
                paddingVertical: (windowWidth * 2) / 100,
                // borderTopWidth: 1.5,
                // borderTopColor: Colors.backgroundcolor,
                marginTop: (windowWidth * 2) / 100,
              }}
            >
              <Text
                style={{
                  fontFamily: Font.Regular,
                  fontSize: Font.small,
                  color: Colors.detailTitles,
                }}>
                {`${Details?.distance_fare_text} ${Details?.distancetext == '' ? '' : `(${Details?.distancetext})`}`}
              </Text>
              <Text
                style={{
                  fontFamily: Font.Regular,
                  fontSize: Font.small,
                  color: Colors.detailTitles,
                }}>
                {`${Details?.distance_fare} ${statesData.currency_symbol}`}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems:'center',
                justifyContent: "space-between",
                paddingVertical: (windowWidth * 2) / 100,
                borderTopWidth: 1.5,
                borderTopColor: Colors.backgroundcolor,
              }}>
              <Text
                style={{
                  fontFamily: Font.Medium,
                  fontSize: Font.medium,
                  color: Colors.Theme,
                }}>
                {LangProvider.subTotal[languageIndex]}
              </Text>
              <Text
                style={{
                  fontFamily: Font.Medium,
                  fontSize: Font.medium,
                  color: Colors.Theme,
                }}>
                {`${statesData.subTotal} ${statesData.currency_symbol}`}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems:'center',
                justifyContent: "space-between",
                borderColor: Colors.bordercolor,
                marginBottom: (windowWidth * 2) / 100,
              }}>
              <Text
                style={{
                  fontFamily: Font.Regular,
                  fontSize: Font.small,
                  color: Colors.detailTitles,
                }}>
                {Details?.vat_text}
              </Text>
              <Text
                style={{
                  fontFamily: Font.Regular,
                  fontSize: Font.small,
                  color: Colors.detailTitles,
                }}>
                {`${statesData.vatPrice} ${statesData.currency_symbol}`}
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
                  fontSize: Font.medium,
                  color: Colors.Theme,
                }}>
                {LangProvider.Total[languageIndex]}
              </Text>
              <Text
                style={{
                  fontFamily: Font.Medium,
                  fontSize: Font.medium,
                  color: Colors.Theme,
                }}>
                {`${statesData.totalPrice} ${statesData.currency_symbol}`}
              </Text>
            </View>

          </View>

        </ScrollView>

        {/* ------------------Checkout------------- */}
        <View
          style={{
            width: "100%",
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: Colors.White,
            paddingTop: (windowWidth * 2) / 100,
            paddingBottom: Platform.OS == 'ios' ? insets.bottom - 15 : (windowWidth * 2) / 100,
            alignItems: "center",
            paddingHorizontal: '10%',
            borderTopWidth: 1,
            borderTopColor: Colors.Border,
            position: 'absolute',
            bottom: 0,
          }}>

          <View style={{ alignItems: 'flex-start' }}>
            <Text
              style={{
                fontFamily: Font.Medium,
                fontSize: Font.xxlarge,
                color: Colors.Theme,
              }}>
              {`${statesData.totalPrice} ${statesData.currency_symbol}`}
            </Text>
            <Text
              style={{
                fontFamily: Font.Regular,
                fontSize: Font.small,
                color: Colors.detailTitles,
              }}>
              {LangProvider.Amount_Payable[languageIndex]}
            </Text>
          </View>

          <Button
            onLoading={statesData.isAddingToCart}
            btnStyle={{ width: windowWidth / 2.5 }}
            text={LangProvider.ProceedToPay[languageIndex]}
            onPress={() => {
              AddToCart()
            }}
          />

        </View>

        <Cameragallery
          mediamodal={mediaModal}
          Camerapopen={() => {
            Camerapopen();
          }}
          Galleryopen={() => {
            Galleryopen();
          }}
          Canclemedia={() => {
            setMedialModal(false);
          }}
        />

        <AudioRecorder
          visible={isRecordAudio}
          onRequestClose={() => {
            setIsRecordAudio(false)
          }}
          recordedAudioUri={(uri) => {
            let audioObj = {
              uri: uri,
              type: "audio/m4a",
              name: moment().format('x') + '.m4a',
            }
            // console.log(audioObj);
            setState({
              symptomsRecording: audioObj
            })
          }}
        />
      </View>

    )
  }
};
const styles = StyleSheet.create({
  textInputFocus: {
    borderColor: Colors.Blue,
    backgroundColor: Colors.White,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: s(5),
    paddingVertical: vs(5),
    borderRadius: 8,
    marginTop: 10,
    width: '100%'
  },
  textInput: {
    borderColor: Colors.lightGrey,
    backgroundColor: Colors.White,
    borderWidth: 1,
    borderColor: Colors.Border,
    marginBottom: 10,
    paddingHorizontal: s(5),
    paddingVertical: vs(3),
    borderRadius: 8,
    marginTop: 10,
    width: '100%'

  },
  textInputArea: {
    fontSize: Font.small,
    fontFamily: Font.Regular,
    color: Colors.detailTitles,
    height: 100,
    width: "100%",
    justifyContent: "flex-start",
    textAlignVertical: "top",
    alignSelf: 'flex-start',
  },
  viewBarWrapper: {
    marginTop: -15,
    // marginHorizontal: 28,
    alignSelf: "stretch",
  },
  viewBar: {
    backgroundColor: "#ccc",
    height: 4,
    alignSelf: "stretch",
  },
  viewBarPlay: {
    backgroundColor: "blue",
    height: 4,
    width: 0,
  },
  infoContainer: {
    paddingVertical: vs(11),
    backgroundColor: Colors.White,
    marginTop: vs(7),
    zIndex: 999
  },
  experienceContainer: {
    width: '100%',
    paddingTop: vs(18),
    flexDirection: 'row',
    paddingHorizontal: s(11),
    marginBottom: vs(7)
  },
  descContainer: {
    borderTopWidth: 1.5,
    borderTopColor: Colors.backgroundcolor,
    paddingHorizontal: s(11),
    paddingTop: vs(7)
  },
  timeContainer: {
    flexDirection: 'row',
    marginTop: vs(11),
    paddingHorizontal: s(11),
  },
});
export default HomeVisit;
