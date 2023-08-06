import React, { Component, useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
  FlatList,
  Modal,
} from "react-native";
import { TabbyProductSnippetCreditCard } from 'tabby-react-native-sdk';
import { SkypeIndicator } from "react-native-indicators";
import {
  Colors,
  Font,
  msgProvider,
  windowWidth,
  config,
  LangProvider,
  apifuntion,
  Icons,
  Button,
} from '../../../Provider/Utils/Utils';
import { Capsule, dummyUser, GoldStar, leftArrow, Notification } from '../../../Icons/Index';
import { SvgXml } from "react-native-svg";
import { s, vs } from "react-native-size-matters";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import LoadingSkeleton from "../../../components/LoadingSkeleton";
import { TabbyPaymentStatus } from "../../../Redux/Actions";
import { useSafeAreaInsets } from "react-native-safe-area-context";



const TestBase = ({ navigation, route }) => {


  const { selectedProvider, loggedInUserDetails, languageIndex, appLanguage } = useSelector(state => state.StorageReducer)
  const dispatch = useDispatch()

  const [statesData, setStatesData] = useState({
    bookingDetails: null,
    tasksList: [],
    searchedTasks: [],
    selectedTasks: [],
    selectedTasksIds: [],
    selectedTasksPrices: [],
    time_Arr: [],
    tasksTotalPrice: '',
    keyword: '',
    set_date: "",
    Error_popup: false,
    task_price_total: "",
    selectedTime: "",
    vatPrice: "",
    totalPrice: "",
    currency_symbol: "",
    subTotal: '',
    isLoadingDetails: true,
    isAddingToCart: false,
    isLoadingDates: false
  })
  const isFocused = useIsFocused()
  const insets = useSafeAreaInsets()
  const inputRef = useRef()
  useEffect(() => {
    if (isFocused) {
      resetState()
      getServices();
      getDay();
    }
  }, [isFocused])

  useEffect(() => {
    if (statesData.bookingDetails && statesData.tasksList) {
      setState({ isLoadingDetails: false })
    }
  }, [statesData.bookingDetails])

  const resetState = () => {
    setState({
      bookingDetails: null,
      tasksList: [],
      searchedTasks: [],
      selectedTasks: [],
      selectedTasksIds: [],
      selectedTasksPrices: [],
      time_Arr: [],
      tasksTotalPrice: '',
      keyword: '',
      set_date: "",
      Error_popup: false,
      task_price_total: "",
      selectedTime: "",
      vatPrice: "",
      totalPrice: "",
      currency_symbol: "",
      subTotal: '',
      isLoadingDetails: true,
      isAddingToCart: false,
      isLoadingDates: false
    })
  }

  const setState = payload => {
    setStatesData(prev => ({
      ...prev,
      ...payload
    }))
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

  const getServices = async () => {

    setState({
      name: loggedInUserDetails.first_name,
      currency_symbol: loggedInUserDetails?.currency_symbol
    });

    var current = new Date();
    let min =
      current.getMinutes() < 10
        ? "0" + current.getMinutes()
        : current.getMinutes();
    let hour =
      current.getHours() < 10 ? "0" + current.getHours() : current.getHours();
    var timcurrent = hour + ":" + min;
    setState({ currentTime: timcurrent });
    if (loggedInUserDetails.image != null) {
      setState({
        profile_img: loggedInUserDetails.image
      });
    }
    let url = config.baseURL + "api-patient-lab-booking-init-details";

    var data = new FormData();
    data.append("provider_id", selectedProvider ?selectedProvider?.providerId: '');
    data.append("lgoin_user_id", loggedInUserDetails?.user_id);
    data.append("service_type", selectedProvider.providerType);

    apifuntion
      .postApi(url, data)
      .then((obj) => {
        console.log('getServices-res**********', obj.result);
        if (obj.status == true) {
          var names = obj.result.task_time;
          var nameArr = names.split(",");
          const newTimeSlot = [];
          const Arr2 = [];
          const Arr1 = [];
          var task_ar1 = false;
          var task_ar2 = true;
          let newTasksArray = []
          newTasksArray = obj.result.task_base_task
          for (let i = 0; i < obj.result.task_base_task.length; i++) {
            newTasksArray[i].status = false;
          }
          setState({
            bookingDetails: obj.result,
            message: obj.message,
            tasksList: newTasksArray,
          });
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
                newTimeSlot.push({ time: nameArr[l], time_status: false });

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

            setState({

              time_Arr: newTimeSlot,
              final_one: Arr1,
              final_arr2: Arr2,
            });

          } else {
            // msgProvider.showError(obj.message);
            return false;
          }
        }
      }).catch((error) => {
        setTimeout(() => {
          setState({ Error_popup: true, isLoadingDetails: false });
        }, 700);

        console.log("getServices-error ------- " + error);
      });
  };

  const getTimeDate = async (selectedDate, currentData = '') => {

    setState({
      isLoadingDates: true,
      time_Arr: [],
      final_one: [],
      final_arr2: [],
    })
    let url = config.baseURL + "api-patient-lab-next-date-time";

    var data = new FormData();
    data.append("provider_id", selectedProvider ?selectedProvider?.providerId: '');
    data.append("date", selectedDate);
    data.append("task_type", 'task_base');
    data.append("service_type", selectedProvider.providerType);

    // console.log('getTimeDate request.....', data);

    apifuntion
      .postApi(url, data)
      .then((obj) => {
        console.log("getTimeDate ", obj);

        if (obj.status == true) {
          if (obj.result.task_time != "") {
            var names = obj.result.task_time;
            var nameArr = names.split(",");

            const newTimeSlot = [];
            const Arr1 = [];
            const Arr2 = [];
            var task_ar1 = false;
            var task_ar2 = true;
            if (obj.result.task_time != "") {
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

                  if (finaltime >= statesData.currentTime) {
                    newTimeSlot.push({
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
                  newTimeSlot.push({ time: nameArr[l], time_status: false });
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
              time_Arr: newTimeSlot,
              final_one: Arr1,
              final_arr2: Arr2,
            });
            setTimeout(() => {
              setState({ isLoadingDates: false })
            }, 1000);
          } else {
            setTimeout(() => {
              setState({ isLoadingDates: false })
            }, 1000);
            setState({ time_Arr: obj.result.task_time });
          }
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log("getTimeDate-error ------- " + error);
      });
  };

  const check_all = (index) => {
    const Details = statesData.bookingDetails
    let data = statesData.tasksList;
    let selectedTasks = [];
    let selectedTasksIds = [];
    let selectedTasksPrice = [];
    let subTotal = 0;
    let total = 0;
    let vatPrice = 0

    if (index != -1) {
      if (data[index].status == true) {
        data[index].status = false;
      } else {
        if (data[index].status == false) {
          data[index].status = true;
        }
      }

      for (const iterator of data) {
        if (iterator.status == true) {
          selectedTasks.push(iterator)
        }
      }

      for (let i = 0; i < data.length; i++) {
        if (data[i].status == true) {
          selectedTasksIds.push(data[i].id);
          selectedTasksPrice.push(data[i].price);
          subTotal = subTotal + parseInt(data[i].price)
        }
      }
      setState({ tasksTotalPrice: subTotal })
      subTotal = parseFloat(subTotal + parseFloat(Details?.distance_fare))
      console.log({ subTotal });
      if (Details.vat_price != 0) {
        console.log('vat exists');
        vatPrice = parseFloat((parseInt(subTotal) - parseInt(Details?.distance_fare)) * Details?.vat_price) / 100
      }

      total = (subTotal + vatPrice)
      console.log({ total });
      setState({
        subTotal: subTotal,
        tasksList: data,
        selectedTasks: selectedTasks,
        selectedTasksIds: selectedTasksIds.toString(),
        selectedTasksPrices: selectedTasksPrice.toString(),
        vatPrice: vatPrice,
        totalPrice: total,
      })

    }
  };

  const AddToCart = async () => {
    Keyboard.dismiss();
    dispatch(TabbyPaymentStatus(false))
    if (statesData.selectedTasks.length <= 0) {
      msgProvider.showError(LangProvider.EmptyTask[languageIndex]);
      return false;
    }

    if (statesData.selectedTime.length <= 0) {
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
    data.append('task_id', statesData.selectedTasksIds);
    data.append('task_price', statesData.selectedTasksPrices);
    data.append("task_type", "task_base");
    data.append("from_date", statesData.set_date);
    data.append("from_time", statesData.selectedTime);
    data.append("appointment_type", "online");
    data.append("vat_percent_used", statesData.bookingDetails.vat_price);
    data.append("vat_price", statesData.vatPrice);
    data.append("distance_fare", statesData.bookingDetails.distance_fare);
    data.append("task_price_total", statesData.tasksTotalPrice);
    data.append("sub_total_price", statesData.subTotal);
    data.append("total_price", statesData.totalPrice);

    if (statesData.bookingDetails.distancetext != '' && statesData.bookingDetails.distancetext != null && statesData.bookingDetails.distancetext != undefined) {
      data.append('distance', statesData.bookingDetails.distancetext)
    } else {
      data.append('distance', '')
    }
    // console.log(data);
    // return

    apifuntion
      .postApi(url, data)
      .then((obj) => {
        setState({ isAddingToCart: false })
        if (obj.status == true) {
          setTimeout(() => {
            navigation.navigate("CartDetails")
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

  const searchFilterFunction = (text) => {
    setState({ keyword: text });

    let data = statesData.tasksList;
    if (data != "") {
      const newData = data.filter((item) => {
        const textData = text.toLowerCase();
        return item.name.toLowerCase().indexOf(textData) >= 0;
      });
      if (newData.length > 0) {
        setState({ searchedTasks: newData });
      } else if (newData.length <= 0) {
        setState({ searchedTasks: "" });
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

  var Details = statesData.bookingDetails;

  if (statesData.isLoadingDetails) {
    return (
      <LoadingSkeleton />
    );
  } else {
    return (
      <View
        pointerEvents={statesData.isAddingToCart ? 'none' : 'auto'}
        style={{ flex: 1, backgroundColor: Colors.backgroundcolor, }}>

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
                  paddingTop: vs(3),
                  justifyContent: 'center',
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
                  (Details && Details?.iso_text != '') &&
                  <View style={{ flexDirection: 'row', marginTop: vs(2), alignItems: 'center' }}>
                    <SvgXml xml={Capsule} height={vs(18)} width={s(55)} />
                    <Text
                      style={{
                        fontFamily: Font.Medium,
                        fontSize: Font.small,
                        color: Colors.Theme,
                        marginLeft: 5
                      }}
                    >
                      {Details?.iso_text}
                    </Text>
                  </View>
                }
                {
                  Details?.speciality ?
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
                    :
                    null
                }
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

          {/* ----------------Search Input--------------- */}
          {
            (statesData.tasksList != "" && statesData.tasksList != null) &&
            <View
              style={{
                width: "100%",
                alignSelf: "center",
                backgroundColor: Colors.backgroundcolor,
                height: (windowWidth * 12) / 100,
                alignItems: "center",
              }}>
              <View
                style={{
                  width: "100%",
                  alignSelf: "center",
                  flexDirection: "row",
                  paddingHorizontal: s(11)
                }}>
                <TextInput
                  ref={inputRef}
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
                    fontSize: Font.large,
                    fontFamily: Font.Regular,
                    color: "#8F98A7",
                    width: "90%",
                    paddingVertical: (windowWidth * 3.5) / 100,
                    textAlign: languageIndex == 0 ? 'left' : 'right',
                  }}
                  placeholderTextColor={"#8F98A7"}
                  placeholder={LangProvider.Searchtask[languageIndex]}
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
          }


          {/* ----------------Selected Tasks--------------- */}
          {
            (statesData.selectedTasks.length > 0) &&
            <View style={{ height: (windowWidth * 10) / 100, width: '100%', backgroundColor: Colors.White, marginBottom: vs(7) }}>
              <FlatList
                horizontal={true}
                contentContainerStyle={{ paddingHorizontal: (windowWidth * 3.5) / 100 }}
                showsHorizontalScrollIndicator={false}
                data={statesData.selectedTasks}
                renderItem={({ item, index }) => {
                  if (statesData.selectedTasks != "") {
                    return (
                      <View style={{ alignSelf: "center" }}>
                        {item.status == true && (
                          <View
                            style={{
                              backgroundColor: Colors.Theme,
                              paddingVertical: (windowWidth * 0.8) / 100,
                              flexDirection: "row",
                              paddingHorizontal: (windowWidth * 2.5) / 100,
                              // marginTop: (windowWidth * 2) / 100,
                              justifyContent: "space-between",
                              alignItems: "center",
                              borderRadius: (windowWidth * 1) / 100,
                              marginRight: (windowWidth * 2) / 100,
                            }}
                          >
                            <Text
                              style={{
                                color: Colors.White,
                                fontSize: Font.small,
                                fontFamily: Font.Light,
                              }}
                            >
                              {item.name}
                            </Text>
                          </View>
                        )}
                      </View>
                    );
                  }
                }}
              />
            </View>
          }

          {/* ----------------Tasks List------------ */}
          {(statesData.tasksList.length > 0) && (
            <View
              style={{
                width: "100%",
                backgroundColor: Colors.White,
                maxHeight: (windowWidth * 90) / 100
              }} >

              <FlatList
                data={statesData.keyword == '' ? statesData.tasksList : statesData.searchedTasks}
                scrollEnabled={true}
                nestedScrollEnabled={true}
                renderItem={({ item, index }) => {
                  if (statesData.tasksList != "") {
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
                        <View style={{ flexDirection: 'row', width: '80%' }}>
                          <TouchableOpacity
                            onPress={() => {
                              check_all(index);
                              inputRef.current.blur()
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
                            }}>
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
                              fontSize: Font.medium,
                              fontFamily: Font.Regular,
                              color: "#000",
                              marginLeft: s(10),
                              textAlign: 'left'
                            }}>
                            {item.name}
                          </Text>
                        </View>
                        <View style={{ width: '20%' }}>
                          <Text
                            style={{
                              fontSize: Font.medium,
                              fontFamily: Font.Regular,
                              color: Colors.Black,
                              textAlign: "right",
                            }}
                          >
                            {item.price}{" "}
                            {statesData.currency_symbol}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }
                }}
              />
            </View>
          )
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
                          getTimeDate(item.date1, statesData.check_currentdate),
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
                            data={statesData.final_arr2}
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
                        ) :
                        (
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
            price={(statesData.selectedTasks != '' && statesData.selectedTasks != null) ? statesData.totalPrice : '0'}
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
            {statesData.selectedTasks != "" && (
              <FlatList
                data={statesData.selectedTasks}

                renderItem={({ item, index }) => {
                  return (
                    <View>
                      {item.status == true && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: 'center',
                            width: "100%",
                            paddingTop: (windowWidth * 1.3) / 100,
                            justifyContent: "space-between",
                            alignSelf: "center",
                          }}>
                          <Text
                            style={{
                              fontFamily: Font.Regular,
                              fontSize: Font.small,
                              color: Colors.detailTitles,
                            }}>
                            {item.name}
                          </Text>
                          <Text
                            style={{
                              fontFamily: Font.Regular,
                              fontSize: Font.small,
                              color: Colors.detailTitles,
                            }}>
                            {item.price}{" "}
                            {statesData.currency_symbol}
                          </Text>
                        </View>
                      )}
                    </View>
                  )

                }}
              />
            )}

            <View
              style={{
                flexDirection: "row",
                alignItems:'center',
                justifyContent: "space-between",
                paddingVertical: (windowWidth * 2) / 100,
                borderTopWidth: 1.5,
                borderTopColor: Colors.backgroundcolor,
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
                {`${statesData.selectedTasks.length > 0 ? Details?.distance_fare : ''} ${statesData.currency_symbol}`}
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
                {`${statesData.selectedTasks.length > 0 ? statesData.subTotal : ''} ${statesData.currency_symbol}`}
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
                {`${statesData.selectedTasks.length > 0 ? statesData.vatPrice : ''} ${statesData.currency_symbol}`}
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
                {statesData.selectedTasks.length > 0 ? `${statesData.totalPrice} ${statesData.currency_symbol}` : `${statesData.currency_symbol}`}
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
              {(statesData.selectedTasks != '' && statesData.selectedTasks != null) ? `${statesData.totalPrice} ${statesData.currency_symbol}` : `0 ${statesData.currency_symbol}`}
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
      </View>

    )
  }
}

const styles = StyleSheet.create({

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

export default TestBase;