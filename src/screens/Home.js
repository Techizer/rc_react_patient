import React, { Component } from "react";
import {
  Text,
  FlatList,
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Platform,
} from "react-native";
import {
  Colors,
  Font,
  config,
  mobileW,
  localStorage,
  localimag,
  consolepro,
  Lang_chg,
  apifuntion,
  mobileH,
} from "../Provider/utilslib/Utils";
import Styles from "../Styles";
import messaging from "@react-native-firebase/messaging";
import { Appheading } from "../Allcomponents";
import Footer from "../Footer";
import PushNotification, { Importance } from "react-native-push-notification";
import HideWithKeyboard from "react-native-hide-with-keyboard";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
global.current_lat_long = "NA";
global.myLatitude = "NA";
global.myLongitude = "NA";
global.post_location = "NA";
global.cart_customer = [];
const HomeHealthcareServiceAppointments = [
  {
    id: 1,
    img: localimag.nurse,
    star: " 5.0",
    arabic_title: "حجز ممرضة  ",
    title: "Book a Nurse",
    arabic_details: "متاح للحجز بنظام الساعة أو الحجز بنظام المهمة  ",
    details: "Open for Hourly or Task Based Booking",
    status: 0,
    pass_status: "nurse",
    arabic_status: 1,
  },
  {
    id: 2,
    img: localimag.Physiotherapist,
    star: "4.7",
    title: "Book a ",
    arabic_title: "حجز علاج طبيعي  ",
    title2: "Physiotherapist",
    arabic_title2: "اخصائي علاج طبيعي",
    details: "for 30 mins",
    arabic_details: "لمدة 30 دقيقة",
    status: 1,
    pass_status: "physiotherapy",
    arabic_status: 1,
  },
  {
    id: 3,
    img: localimag.NurseAssistant,
    star: "4.3",
    title: "Book Nurse",
    arabic_title: "حجز مساعدة ممرضة ",
    title2: "Assistant",
    arabic_title2: "مساعد",
    details: "Available 2,4,6,8 hrs",
    arabic_details: "متاح 8،6،4،2 ساعة  ",
    pass_status: "caregiver",
    status: 1,
    arabic_status: 1,
  },
  {
    id: 4,
    img: localimag.Babysitter,
    star: "4.3",
    title: "Book a",
    arabic_title: "حجز ",
    arabic_title2: "جليسة أطفال  ",
    title2: "Babysitter",
    pass_status: "babysitter",
    arabic_details: "متاح 8،6،4،2 ساعة  ",
    details: "Available 2,4,6,8 hrs",
    status: 1,
    arabic_status: 0,
  },
];

const DoctorAppointment = [
  {
    id: 1,
    img: localimag.InstantVideoConsultation,
    star: "5.0",
    title: "Instant Video Consultation",
    arabic_title: "استشارة فيديو فورية",
    details: "15-30 mins",
    arabic_details: "30-15 دقيقة",
    pass_status: "doctor",
  },
  {
    id: 2,
    img: localimag.HomeVisitConsultation,
    star: "5.0",
    title: "Home Visit Consultation",
    arabic_title: "استشارة زيارة منزلية  ",
    arabic_details: "لمدة 30 دقيقة    ",
    details: "for 30 mins",
    pass_status: "doctor",
  },
];

const HospitalAppointment = [
  {
    id: 1,
    img: localimag.HoptlInstantVideoConsultation,
    star: "5.0",
    title: "Instant Video Consultation",
    arabic_title: " استشارة فيديو فورية  ",
    details: "15-30 mins",
    arabic_details: "30-15 دقيقة",
    status: true,
    pass_status: "hospital",
  },
  {
    id: 2,
    img: localimag.BookaLabTest,
    star: "5.0",
    title: "Book a Lab Test",
    arabic_title: "حجز فحص مختبر  ",
    details: "Get the sample collected today",
    arabic_details: "احجز لجمع العينات اليوم  ",
    arabic_condition: "ونضمن لك الحصول على النتائج في نفس اليوم  ",
    condition: "within 1 day report guaranteed",
    status: false,
    pass_status: "lab",
  },
];

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible3: false,
      latdelta: "0.0922",
      longdelta: "0.0421",
      profile_img: "",
      title: "Booking",
      body: "",
      address_new: "",
      address_old: "",
      notification_count: "",
      app_status: "",
    };
    screens = "Home";
  }
  componentDidMount() {
    // this.getnotification();
    var that = this;
    PushNotification.configure({
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
        if (!notification.userInteraction) {
          // Handle notification click
          console.log("PushNotification.configure", notification);

          if (notification.data?.type == "doctor_to_patient_video_call") {
            let data;
            if (Platform.OS === "ios") {
              data = JSON.parse(notification.data.notidata);
            } else {
              data = notification.data;
              console.log("data", data);
            }
            Alert.alert(
              "Video call",
              "video call from " + data?.fromUserName,
              [
                {
                  text: "Reject",
                  onPress: () => {
                    console.log("Cancel Pressed");
                    that.callRejectNotification(data);
                  },
                  style: "cancel",
                },
                {
                  text: "Accept",
                  onPress: () => {
                    console.log("Accept Pressed");
                    // val messageBody = json.optString("message")
                    // val roomName = json.getString("room_name")
                    // val fromUserName = json.optString("fromUserName")
                    // val fromUserId = json.getString("fromUserId")
                    // val toUserName = json.getString("toUserName")
                    // val toUserId = json.getString("toUserId")
                    // val orderId = json.getString("order_id")
                    that.showVideoCallAlert(data);
                  },
                  style: "default",
                },
              ],
              {
                cancelable: true,
                // onDismiss: () =>
                //   Alert.alert(
                //     "This alert was dismissed by tapping outside of the alert dialog."
                //   ),
              }
            );
          }
        }

        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
    });

    this.messageListener();

    this.props.navigation.addListener("focus", () => {
      this.getAllCount();
    });
  }

  getNotificationCall = async () => {
    PushNotification.createChannel(
      {
        channelId: "rootscares1", // (required)
        channelName: "rootscare messasge", // (required)

        importance: Importance.HIGH, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        priority: "high",
        soundName: "default",
        playSound: true,
        ignoreInForeground: false,
        smallIcon: "app_icon",
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );

    // consolepro.consolelog('logmy',remoteMessage.notification.body)
    // consolepro.consolelog('logmy',remoteMessage.notification.title)
  };

  // messageListener = async () => {
  //   //alert('come')
  //   // console.log('inside message listener ****** ')
  //   PushNotification.createChannel(
  //     {
  //       channelId: "rootscares1", // (required)
  //       channelName: "rootscare messasge", // (required)

  //       importance: 4, // (optional) default: 4. Int value of the Android notification importance
  //       vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
  //     },
  //     (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  //   );
  //   messaging().onMessage(async (remoteMessage) => {
  //     console.log("hello", JSON.stringify(remoteMessage));
  //     console.log("remoteMessage", JSON.stringify(remoteMessage.data));
  //     // console.log("remoteMessage ", JSON.parse(remoteMessage.data?.notidata));
  //     var notificationData = JSON.parse(remoteMessage.data?.notidata);
  //     if (notificationData.type == "doctor_to_patient_video_call") {
  //       Alert.alert(
  //         notificationData.body,
  //         notificationData.message,
  //         [
  //           {
  //             text: "Reject",
  //             onPress: () => {
  //               console.log("Cancel Pressed");
  //               this.callRejectNotification(notificationData);
  //             },
  //             style: "cancel",
  //           },
  //           {
  //             text: "Accept",
  //             onPress: () => {
  //               console.log("Accept Pressed onMessage");
  //               this.showVideoCallAlert(notificationData);
  //             },
  //             style: "default",
  //           },
  //         ],
  //         {
  //           cancelable: true,
  //           // onDismiss: () =>
  //           //   Alert.alert(
  //           //     "This alert was dismissed by tapping outside of the alert dialog."
  //           //   ),
  //         }
  //       );
  //     }
  //     //alert(JSON.stringify(remoteMessage));

  //     PushNotification.localNotification({
  //       channelId: "rootscares1", //his must be same with channelid in createchannel
  //       title: remoteMessage.data.title, //'Appointment Booking',
  //       message: remoteMessage.data.body,
  //       userInfo: remoteMessage.data,
  //     });
  //   });
  // };

  messageListener = async () => {
    //alert('come')
    // console.log('inside message listener ****** ')
    PushNotification.createChannel(
      {
        channelId: "rootscares1", // (required)
        channelName: "rootscare messasge", // (required)

        smallIcon: "app_icon",
        importance: Importance.HIGH, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        ignoreInForeground: false,
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
    messaging().onMessage(async (remoteMessage) => {
      console.log("hello", JSON.stringify(remoteMessage));
      //alert(JSON.stringify(remoteMessage));
      // if (remoteMessage.data?.type !== "doctor_to_patient_video_call") {
      PushNotification.localNotification({
        channelId: "rootscares1", //his must be same with channelId in create channel
        title: remoteMessage.data.title, //'Appointment Booking',
        message: remoteMessage.data.body,
        userInfo: remoteMessage.data,
      });
      // }
      // msgProvider.showSuccess("yes call coming")
    });
  };

  showVideoCallAlert = (data) => {
    console.log("showVideoCallAlert", data);
    var myData = {
      fromUserId: data.fromUserId,
      fromUserName: data.fromUserName,
      order_id: data.order_id,
      room_name: data.room_name,
      toUserId: data.toUserId,
      toUserName: data.toUserName,
      type: data.type,
      isPage: "accept",
    };
    this.props.navigation.navigate("VideoCall", {
      item: myData,
    });
  };

  callRejectNotification = async (data) => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];
    let apiName = "api-get-video-access-token-with-push-notification";
    let url = config.baseURL + apiName;

    var data = new FormData();
    data.append("fromUserId", user_id);
    data.append("fromUserName", data.toUserName);
    data.append("order_id", data.order_id);
    data.append("room_name", data.room_name);
    data.append("toUserId", data.fromUserId);
    data.append("toUserName", data.fromUserName);
    data.append("type", "patient_to_doctor_video_call_reject");

    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        consolepro.consolelog("obj", obj);
        if (obj.status == true) {
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log("-------- error ------- " + error);
      });
  };

  getAllCount = async () => {
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
          console.log("notification_count", obj.result);
          this.getProfile();
        } else {
          return false;
        }
      })
      .catch((error) => {
        this.getProfile();
        console.log("-------- error ------- " + error);
      });
  };

  getProfile = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    let address_arr = await localStorage.getItemObject("address_arr");
    console.log("user_details user_details", user_details);
    console.log("address_arr", address_arr);
    this.setState({
      address_show: address_arr,
      address_old: user_details.current_address,
    });

    if (user_details.image != null) {
      this.setState({
        profile_img: config.img_url3 + user_details["image"],
      });
    }
  };

  render() {
    // const height = (mobileH * 18) / 100;
    // console.log("mobileH", height);
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={Styles.container3}>
          <View style={styles_new.headerstyle}>
            <View
              style={{
                padding: (mobileW * 2.5) / 100,
                flexDirection: "row",
                width: "95%",
                alignSelf: "center",
                paddingTop: (mobileW * 3) / 100,
                backgroundColor: Colors.white_color,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: "10%",
                  backgroundColor: "#fff",
                  justifyContent: "center",
                  alignSelf: "center",
                  paddingTop: (mobileW * 1.5) / 100,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.toggleDrawer();
                  }}
                >
                  <Image
                    source={
                      this.state.profile_img == null ||
                        this.state.profile_img == ""
                        ? localimag.p1
                        : { uri: this.state.profile_img }
                    }
                    style={{
                      // resizeMode: 'contain',
                      width: (mobileW * 9) / 100,
                      height: (mobileW * 9) / 100,
                      borderRadius: (mobileW * 4.5) / 100,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: "80%",
                  alignSelf: "center",
                  paddingTop: (mobileW * 1.5) / 100,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("Show_currentlocation");
                  }}
                  style={{
                    flexDirection: "row",
                    width: "25%",
                    alignItems: "center",
                    marginLeft: (mobileW * 2) / 100,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Font.fontmedium,
                      fontSize: (mobileW * 3.5) / 100,
                    }}
                  >
                    {Lang_chg.MyDashboard[config.language]}
                  </Text>
                  <Image
                    source={require("../icons/back-svg.png")}
                    style={{
                      marginLeft: (mobileW * 2) / 100,
                      width: 8.5,
                      height: 8.5,
                      tintColor: "#000",
                    }}
                  />
                </TouchableOpacity>
                {this.state.address_old != null &&
                  this.state.address_old != "" ? (
                  <Text
                    onPress={() => {
                      this.props.navigation.navigate("Show_currentlocation");
                    }}
                    numberOfLines={1}
                    style={{
                      color: "#6D737E",
                      fontFamily: Font.fontregular,
                      fontSize: Font.sregulartext_size,
                      textAlign: config.textRotate,
                      marginLeft: (mobileW * 2) / 100,
                      width: "50%",
                    }}
                  >
                    {this.state.address_show}
                  </Text>
                ) : (
                  <Text
                    numberOfLines={1}
                    style={{
                      color: "#6D737E",
                      fontFamily: Font.fontregular,
                      fontSize: Font.sregulartext_size,
                      textAlign: config.textRotate,
                      marginLeft: (mobileW * 2) / 100,
                      width: "50%",
                    }}
                  >
                    NA
                  </Text>
                )}
              </View>
              <View
                style={{
                  width: "10%",
                  paddingTop: (mobileW * 2) / 100,
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("Notifications");
                  }}
                >
                  {/* <TouchableOpacity onPress={()=>{this.notificationfunctoion()}}> */}
                  <Image
                    // tintColor="#fff"
                    source={
                      this.state.notification_count > 0
                        ? localimag.notifications
                        : localimag.notifications_sec
                    }
                    style={{
                      alignSelf: "flex-end",
                      resizeMode: "contain",
                      width: (mobileW * 6) / 100,
                      height: (mobileW * 6) / 100,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ------------------------Lists */}
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, backgroundColor: Colors.backgroundcolor }}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                width: "100%",
                alignSelf: "center",
                paddingTop: (mobileW * 1.7) / 100,
              }}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("CovidPackageDetails")
                }
                style={{
                  paddingLeft: (mobileW * 5) / 100,
                  paddingRight: (mobileW * 5) / 100,
                  height: (mobileW * 36.5) / 100,
                  backgroundColor: Colors.white_color,
                  alignItems: 'center',
                  width: "100%",
                  alignSelf: "center",
                }}
              >
                <Image
                  source={
                    config.language == 0
                      ? localimag.covid_test_banner
                      : localimag.covid_test_banner_ar
                  }
                  style={{
                    width: "100%",
                    resizeMode: "stretch",
                    height: (mobileH * 17.9) / 100,
                  }}
                />
              </TouchableOpacity>

              <View style={Styles.containerbody}>
                {/* FlatList 1 */}
                <View style={{
                  paddingTop: (mobileW * 1.7) / 100,
                  
                }}>
                  <Appheading
                    title={
                      Lang_chg.HomeHealthcareServiceAppointments[config.language]
                    }
                  />
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    data={HomeHealthcareServiceAppointments}
                    renderItem={({ item, index }) => {
                      // consolepro.consolelog("item nurse ------", item);
                      return (
                        <View
                          style={[
                            { width: (mobileW * 36) / 100 },
                            config.language == 1
                              ? { marginLeft: (mobileW * 1) / 100 }
                              : null,
                          ]}
                        >
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate(
                                "AllServiceProviderListing",
                                { pass_status: item.pass_status }
                              )
                            }
                            style={{
                              width: (mobileW * 32.5) / 100,
                              marginRight: (mobileW * 4) / 100,
                              // shadowOpacity: 0.3,
                              // shadowColor:'#000',
                              // shadowOffset:{width:1,height:1},
                              // elevation:5,
                              // shadowRadius: 2,
                              backgroundColor: "#fff",
                              borderColor: "#DFDFDF",
                              borderWidth: 1,
                              borderRadius: (mobileW * 2) / 100,
                              paddingBottom: (mobileW * 3) / 100,
                              marginBottom: 3,
                              // alignItems:'center'
                            }}
                          >
                            <ImageBackground
                              imageStyle={{
                                borderTopLeftRadius: (mobileW * 1) / 100,
                                borderTopRightRadius: (mobileW * 1) / 100,
                              }}
                              style={{
                                borderRadius: (mobileW * 2) / 100,
                                width: "100%",
                                height: (mobileW * 28) / 100,
                                alignSelf: "center",
                              }}
                              source={item.img}
                            />
                            <View
                              style={{
                                paddingTop: (mobileW * 2) / 100,
                                paddingHorizontal: (mobileW * 3) / 100,
                              }}
                            >
                              {config.language == 1 ? (
                                <Text style={Styles.cardtitle}>
                                  {item.arabic_title}
                                </Text>
                              ) : (
                                <Text style={Styles.cardtitle}>{item.title}</Text>
                              )}
                              {item.status != 0 && (
                                <View>
                                  {config.language != 1 && (
                                    <Text style={Styles.cardtitle}>
                                      {item.title2}
                                    </Text>
                                  )}
                                  {config.language == 1 &&
                                    item.arabic_status == 0 && (
                                      <Text style={Styles.cardtitle}>
                                        {item.arabic_title2}
                                      </Text>
                                    )}
                                </View>
                              )}
                              {config.language == 1 ? (
                                <Text style={Styles.details}>
                                  {item.arabic_details}
                                </Text>
                              ) : (
                                <Text style={Styles.details}>{item.details}</Text>
                              )}
                            </View>
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                  />
                </View>

                {/* FlatList 2 */}
                <Appheading
                  title={Lang_chg.DoctorAppointment[config.language]}
                />
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  data={DoctorAppointment}
                  renderItem={({ item, index }) => {
                    // consolepro.consolelog("item Doctor ------", item);
                    return (
                      <View style={{ width: (mobileW * 36) / 100 }}>
                        <TouchableOpacity
                          activeOpacity={0.9}
                          onPress={() => {
                            this.props.navigation.navigate(
                              "AllServiceProviderListing",
                              {
                                pass_status: item.pass_status,
                                enableFor:
                                  index === 0
                                    ? "ONLINE_CONSULT"
                                    : "HOME_VISIT_CONSULT",
                              }
                            );
                          }}
                          style={{
                            width: (mobileW * 32.3) / 100,
                            marginRight: (mobileW * 4) / 100,
                            // shadowOpacity: 0.3,
                            // shadowColor:'#000',
                            // shadowOffset:{width:1,height:1},
                            // elevation:5,
                            backgroundColor: "#fff",
                            // shadowRadius:2,
                            borderColor: Colors.LIGHT_CLIENT_BORDER,
                            borderWidth: 1,
                            borderRadius: (mobileW * 2) / 100,
                            paddingBottom: (mobileW * 3) / 100,
                            marginBottom: 3,
                          }}
                        >
                          <ImageBackground
                            imageStyle={{
                              borderTopLeftRadius: (mobileW * 1.5) / 100,
                              borderTopRightRadius: (mobileW * 1.5) / 100,
                            }}
                            style={{
                              borderRadius: (mobileW * 2) / 100,
                              width: "100%",
                              height: (mobileW * 28) / 100,
                              alignSelf: "center",
                            }}
                            source={item.img}
                          />
                          <View
                            style={{
                              paddingTop: (mobileW * 2) / 100,
                              paddingHorizontal: (mobileW * 3) / 100,
                            }}
                          >
                            {config.language == 1 ? (
                              <Text style={Styles.cardtitle}>
                                {item.arabic_title}
                              </Text>
                            ) : (
                              <Text style={Styles.cardtitle}>{item.title}</Text>
                            )}
                            {config.language == 1 ? (
                              <Text style={Styles.details}>
                                {item.arabic_details}
                              </Text>
                            ) : (
                              <Text style={Styles.details}>{item.details}</Text>
                            )}
                          </View>
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                />

                {/* FlatList 3 */}
                <Appheading
                  title={Lang_chg.HospitalAppointment[config.language]}
                />
                <View>
                  <FlatList
                    contentContainerStyle={{
                      paddingBottom: (mobileW * 30) / 100,
                    }}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    data={HospitalAppointment}
                    renderItem={({ item, index }) => {
                      consolepro.consolelog("item hospital ------", item);
                      return (
                        <View
                          style={{
                            width:
                              item.status == false
                                ? (mobileW * 68) / 100
                                : (mobileW * 33) / 100,
                            marginRight: (mobileW * 4) / 100,
                            backgroundColor: "#fff",
                            // shadowOpacity: 0.3,
                            // shadowColor: '#000',
                            // shadowRadius: 2,
                            paddingBottom: (mobileW * 1) / 100,
                            borderColor: Colors.LIGHT_CLIENT_BORDER,
                            borderWidth: 1,
                            // shadowOffset: {width: 2, height: 2},
                            // elevation:2,
                            alignItems: "center",
                            borderRadius: (mobileW * 2) / 100,
                            marginBottom: 3,
                          }}
                        >
                          <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => {
                              this.props.navigation.navigate(
                                "AllServiceProviderListing",
                                {
                                  pass_status: item.pass_status,
                                }
                              );
                              // msgProvider.showSuccess(
                              //   msgText.emptyComingsoon[config.language]
                              // );
                            }}
                            style={{
                              width:
                                item.status == false
                                  ? (mobileW * 67.5) / 100
                                  : (mobileW * 32.5) / 100,

                              borderRadius: (mobileW * 2) / 100,
                            }}
                          >
                            <ImageBackground
                              imageStyle={{
                                borderTopLeftRadius: (mobileW * 1.5) / 100,
                                borderTopRightRadius: (mobileW * 1.5) / 100,
                              }}
                              style={{
                                width: "100%",
                                height: (mobileW * 28) / 100,
                                alignSelf: "center",
                              }}
                              source={item.img}
                            >
                              {item.status == true && (
                                <View>
                                  {config.language == 0 ? (
                                    <View
                                      style={{
                                        backgroundColor: "#FFA800",
                                        width: "50%",
                                        borderTopLeftRadius:
                                          (mobileW * 2) / 100,
                                        paddingVertical: (mobileW * 0.5) / 100,
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
                                  ) : (
                                    <View
                                      style={{
                                        backgroundColor: "#FFA800",
                                        width: "50%",
                                        borderTopRightRadius:
                                          (mobileW * 2) / 100,
                                        paddingVertical: (mobileW * 0.5) / 100,
                                        alignSelf: "flex-end",
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
                              )}
                            </ImageBackground>
                            <View
                              style={{
                                paddingTop: (mobileW * 2) / 100,
                                paddingHorizontal: (mobileW * 3) / 100,
                              }}
                            >
                              {config.language == 1 ? (
                                <Text style={Styles.cardtitle}>
                                  {item.arabic_title}
                                </Text>
                              ) : (
                                <Text style={Styles.cardtitle}>
                                  {item.title}
                                </Text>
                              )}
                              {config.language == 1 ? (
                                <Text style={Styles.details}>
                                  {item.arabic_details}
                                </Text>
                              ) : (
                                <Text style={Styles.details}>
                                  {item.details}
                                </Text>
                              )}
                              {config.language == 1 ? (
                                <Text
                                  style={{
                                    color: Colors.textblue,
                                    textAlign: config.textRotate,
                                    fontSize: (mobileW * 2.7) / 100,
                                    fontFamily: Font.fontregular,

                                    lineHeight: (mobileW * 3.9) / 100,
                                  }}
                                >
                                  {item.arabic_condition}
                                </Text>
                              ) : (
                                <Text
                                  style={{
                                    color: Colors.textblue,
                                    textAlign: config.textRotate,
                                  }}
                                >
                                  {item.condition}
                                </Text>
                              )}
                            </View>
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                  />
                </View>
              </View>

            </View>
          </ScrollView>
        </View>
        {/* </ScrollView> */}


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
      </View>
    );
  }
}
const styles_new = StyleSheet.create({
  headerstyle: {
    backgroundColor: "#fff",
    paddingVertical: (mobileW * 2) / 100,
    borderBottomColor: Colors.LIGHT_CLIENT_BORDER,
    borderBottomWidth: 1,
    // shadowOpacity: 0.3,
    // shadowColor:'#000',
    // shadowOffset: {width:1,height:1},
    // elevation:5,
  },
  headerstyle_new: {
    backgroundColor: "red",
    shadowOpacity: 0.3,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    elevation: 10,
    width: "100%",
    paddingVertical: (mobileW * 2) / 100,
  },
  icons: {
    width: (mobileW * 13) / 100,
    height: (mobileW * 13) / 100,
    borderRadius: (mobileW * 5) / 50,
  },
  notebox: {
    backgroundColor: "#fff",
    padding: (mobileW * 4) / 100,
    marginTop: (mobileW * 2) / 100,
    borderRadius: (mobileW * 2) / 100,
  },
  noteboxtxt: {
    fontFamily: Font.fontregular,
    lineHeight: (mobileW * 5) / 100,
  },
  notecard: {
    paddingTop: (mobileW * 3) / 100,
  },
  checkboxcontainer: {
    paddingTop: (mobileW * 3) / 100,
  },
  allcheckbox: {
    width: "93%",
    alignSelf: "flex-end",
  },

  checkboxview: {
    // paddingVertical: (mobileW * 1.5) / 100,

    alignItems: "center",
    alignSelf: "center",
    // backgroundColor: 'red',
    paddingVertical: (mobileW * 1.3) / 100,
    flexDirection: "row",
    // alignItems: 'center',
    justifyContent: "space-between",
  },
  checkboximg: {
    width: (mobileW * 7) / 100,
    height: (mobileW * 7) / 100,
    borderRadius: (mobileW * 0.4) / 100,
    marginRight: (mobileW * 2) / 100,
    resizeMode: "contain",
    alignSelf: "flex-start",
    flex: 0.1,
  },
  uncheckboximg: {
    resizeMode: "contain",
    width: (mobileW * 6) / 100,
    height: (mobileW * 6) / 100,
    borderRadius: (mobileW * 0.4) / 100,
    marginRight: (mobileW * 2.9) / 100,
    marginLeft: (mobileW * 0.6) / 100,
    flex: 0.1,
  },
  checkboxtext: {
    color: "#666666",
    fontSize: Font.smalltextsize,
    fontFamily: Font.fontbold,
    // fontSize: Font.smalltextsize,
    fontFamily: Font.fontbold,
    flex: 0.88,
  },
  buttonstyle: {
    width: "70%",
    alignSelf: "center",
    marginVertical: (mobileW * 9) / 100,
  },
  buttontext: {
    paddingVertical: (mobileW * 3) / 100,
    paddingHorizontal: (mobileW * 3) / 100,
    borderRadius: (mobileW * 2) / 100,
    textAlign: "center",
    backgroundColor: "#4C94DB",
    textAlign: "center",
    color: Colors.whiteColor,
    fontFamily: Font.fontextrabold,
    fontSize: (mobileW * 4.2) / 100,
  },

  profilecontainer: {
    marginVertical: (mobileW * 1.2) / 100,
  },
  profileinfo: {
    backgroundColor: "#fff",
    marginVertical: (mobileW * 1.2) / 100,
    padding: (mobileW * 3) / 100,
    borderRadius: (mobileW * 1) / 100,
  },
  profileinfowithimg: {
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "#fff",
    marginVertical: (mobileW * 1.2) / 100,
    padding: (mobileW * 3) / 100,
    paddingVertical: (mobileW * 2) / 100,
    borderRadius: (mobileW * 1) / 100,
    // backgroundColor: 'red',
  },
  infoimgicon: {
    resizeMode: "contain",
    width: (mobileW * 8) / 100,
    height: (mobileW * 8) / 100,
    borderRadius: (mobileW * 10) / 100,
    marginRight: (mobileW * 2) / 100,
    alignSelf: "center",
  },
  infosmalltext: {
    // width: '90%',
    // alignSelf: 'flex-end',
    alignSelf: "center",
    fontSize: Font.ssregulartext_size,
    fontFamily: Font.fontlight,
    // backgroundColor: 'red',
    // color: Colors.gray3,
    // color: 'red',
    flex: 0.86,
  },

  notes: {},

  icons: {
    width: (mobileW * 13) / 100,
    height: (mobileW * 13) / 100,
    borderRadius: (mobileW * 5) / 50,
  },
  notebox: {
    backgroundColor: "#fff",
    padding: (mobileW * 6) / 100,
    marginTop: (mobileW * 2) / 100,
    borderRadius: (mobileW * 2) / 100,
  },
  noteboxtxt: {
    fontFamily: Font.fontbold,
    fontSize: (mobileW * 3.8) / 100,
    lineHeight: (mobileW * 5) / 100,
  },
  notecard: {
    paddingTop: (mobileW * 3) / 100,
  },
  checkboxcontainer: {
    paddingTop: (mobileW * 3) / 100,
  },

  notecardheading: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addoptioncontainer: { marginTop: (mobileW * 9) / 100 },

  imgboxcontainer: {
    borderRadius: (mobileW * 1) / 100,
  },
  imgbox: {
    height: (mobileW * 30) / 100,
    width: (mobileW * 39) / 100,
    padding: (mobileW * 2) / 100,
    borderWidth: (mobileW * 0.6) / 100,
    borderRadius: (mobileW * 3) / 100,
    borderColor: Colors.gainsboro,
    overflow: "hidden",
    marginRight: (mobileW * 4) / 100,
    marginBottom: (mobileW * 4) / 100,
  },
  imgboxstyle: { borderRadius: (mobileW * 3) / 100 },
  insideview: {
    marginTop: (mobileW * 2) / 100,
  },
  insideviewtext: {
    alignSelf: "flex-end",
    fontFamily: Font.fontextrabold,
    fontSize: Font.bigheadingfont,
    color: "#4B4B4B",
    marginRight: (mobileW * 0.2) / 100,
  },
  insideviewimg: {
    alignSelf: "center",
    height: (mobileW * 8.5) / 100,
    width: (mobileW * 8.2) / 100,
    alignSelf: "center",
    marginBottom: (mobileW * 2.5) / 100,
    resizeMode: "center",
  },
  insideviewname: {
    alignSelf: "center",
    fontFamily: Font.fontextrabold,
    fontSize: Font.mini,
    color: "#4B4B4B",
  },
});
