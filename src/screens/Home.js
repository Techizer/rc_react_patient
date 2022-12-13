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
  Platform, BackHandler
} from "react-native";
import {
  Colors,
  Font,
  config,
  windowWidth,
  localStorage,
  Icons,
  consolepro,
  Lang_chg,
  apifuntion,
  windowHeight,
} from "../Provider/utilslib/Utils";
import messaging from "@react-native-firebase/messaging";
import PushNotification, { Importance } from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { s, vs } from "react-native-size-matters"
import { SvgXml, SvgUri } from "react-native-svg";
;
import Styles from "../Styles";
import { Appheading } from "../Allcomponents";
import { BannerOne, BannerTwo, dummyUser } from "../icons/SvgIcons/Index";
import Footer from "../Footer";
import { Images } from "../Provider/Localimage";
import BannerCrousel from "../components/BannerCrousel";
import ScreenHeader from "../components/ScreenHeader";
global.current_lat_long = "NA";
global.myLatitude = "NA";
global.myLongitude = "NA";
global.post_location = "NA";
global.cart_customer = [];

const bannersList = [
  {
    id: '1',
    image: Images.BannerOne
  },
  {
    id: '2',
    image: Images.BannerTwo
  },
  {
    id: '3',
    image: Images.BannerTwo
  },
]
const HomeHealthcareServiceAppointments = [
  {
    id: 1,
    img: Icons.nurse,
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
    img: Icons.Physiotherapist,
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
    img: Icons.NurseAssistant,
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
    img: Icons.Babysitter,
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

const DoctorConsultation = [
  {
    id: 1,
    img: Icons.InstantVideoConsultation,
    star: "5.0",
    title: "Instant Video Consultation",
    arabic_title: "استشارة فيديو فورية",
    details: "15-30 mins",
    arabic_details: "30-15 دقيقة",
    pass_status: "doctor",
    enableFor: 'ONLINE_CONSULT'
  },
  {
    id: 2,
    img: Icons.HomeVisitConsultation,
    star: "5.0",
    title: "Home Visit Consultation",
    arabic_title: "استشارة زيارة منزلية  ",
    arabic_details: "لمدة 30 دقيقة    ",
    details: "for 30 mins",
    pass_status: "doctor",
    enableFor: 'HOME_VISIT_CONSULT'
  },
];

const LabTest = [
  {
    id: 1,
    img: Icons.BookaLabTest,
    star: "5.0",
    title: "Book a Lab Test",
    arabic_title: "احجز اختبارًا معمليًا",
    details: "Get test report within 24 hours of sample collected. All Rootscare labs are 100% safe.",
    arabic_details: "30-15 دقيقة",
    status: '1 day report guaranteed.',
    terms: "T&C Apply",
    pass_status: "lab",
  },
  // {
  //   id: 2,
  //   img: Icons.BookaLabTest,
  //   star: "5.0",
  //   title: "Book a Lab Test",
  //   arabic_title: "احجز اختبارًا معمليًا",
  //   details: "Get test report within 24 hours of sample collected. All Rootscare labs are 100% safe.",
  //   arabic_details: "30-15 دقيقة",
  //   status: '1 day report guaranteed.',
  //   pass_status: "T&C Apply",
  // },
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

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    var that = this;

    PushNotification.configure({
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
        if (notification.userInteraction) {
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
      if (global.isLogin == false) {
        this.getProfile();
      } else {
        this.getAllCount();
      }
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  logout = async () => {
    await localStorage.removeItem("user_arr");
    await localStorage.removeItem("user_login");
    // await localStorage.removeItem('password');
    // await localStorage.clear();
    // this.setState({ show: false });
    global.isLogin = false
    this.props.navigation.reset({
      index: 0,
      routes: [{ name: "AuthStack" }],
    });
  };
  handleBackButton = () => {
    console.log('Back button is pressed', this.props.route.name);
    if (this.props.route.name == "Home") {
      return true;
    } else {
      return false;
    }

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
    var that = this;
    messaging().onMessage(async (remoteMessage) => {
      console.log("hello", JSON.stringify(remoteMessage));
      //alert(JSON.stringify(remoteMessage));
      console.log('remoteMessage.data?.type', remoteMessage.data?.type)
      if (remoteMessage.data?.type == "Logout") {
        that.logout();
      }
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
    console.log("user_details user_details count", user_details);
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
    if (global.isLogin == false) {
      let address_arr = await localStorage.getItemObject("address_arr");
      console.log("address_arr", address_arr);
      this.setState({
        address_show: address_arr,
        address_old: null,
      }, () => {
        console.log("global.isLogin", global.isLogin);
        console.log("this.state.address_old", this.state.address_old);
        console.log("this.state.address_show", this.state.address_show);
      });

      // if (user_details.image != null) {
      //   this.setState({
      //     profile_img: config.img_url3 + user_details["image"],
      //   });
      // }
    } else {
      let user_details = await localStorage.getItemObject("user_arr");
      let address_arr = await localStorage.getItemObject("address_arr");
      console.log("user_details user_details else", user_details);
      console.log("address_arr", address_arr);
      this.setState({
        address_show: address_arr,
        address_old: user_details.current_address,
      }, () => {
        console.log("global.isLogin", global.isLogin);
        console.log("this.state.address_old", this.state.address_old);
        console.log("this.state.address_show", this.state.address_show);
        if (global.isLogin == true && this.state.address_old == null ||
          this.state.address_old == "") {
          this.updateAddress()
        }
      });

      if (user_details.image != null) {
        this.setState({
          profile_img: config.img_url3 + user_details["image"],
        });
      }
    }

  };

  updateAddress = async () => {
    var user_details = await localStorage.getItemObject("user_arr");
    console.log("user_details user_details address", user_details);

    let address_arr = await localStorage.getItemObject("addressDetails");
    console.log("addressDetailsaddressDetails", address_arr);
    let user_id = user_details["user_id"];

    let url = config.baseURL + "api-patient-address-update";
    console.log("url", url);
    var data = new FormData();
    data.append("user_id", user_id);
    data.append("lat", address_arr.latitude);
    data.append("lng", address_arr.longitude);

    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        consolepro.consolelog("obj", obj);
        if (obj.status == true) {
          this.setState({ address_old: obj.result.current_address });
          localStorage.setItemObject("address_arr", obj.result.current_address);
          user_details['current_address'] = obj.result.current_address
          localStorage.setItemObject("user_arr", user_details);
        } else {
          return false;
        }
      })
      .catch((error) => {
        this.getProfile();
        console.log("-------- error ------- " + error);
      });
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={Styles.container3}>

          
          <ScreenHeader
            navigation={this.props.navigation}
            title={'Home'}
            leftIcon={this.state.profile_img}
            rightIcon={true}
            addressOld={this.state.address_old}
            addressShow={this.state.address_show}
            notiCount={this.state.notification_count}
          />

          <ScrollView
            contentContainerStyle={{ flexGrow: 1, backgroundColor: Colors.backgroundcolor, paddingBottom: Platform.OS === 'ios' ? vs(80) : vs(70) }}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                width: "100%",
                alignSelf: "center",
              }}>
              {/* -----------------Header Banner----------------- */}
              <BannerCrousel data={bannersList} navigation={this.props.navigation} />

              {/* FlatList 1 */}
              <View style={{ paddingHorizontal: s(12), marginTop: vs(7), width: '100%', backgroundColor: Colors.White, justifyContent: 'center', paddingVertical: vs(9) }}>
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
                    return (
                      <View
                        style={[
                          { width: (windowWidth * 43) / 100 },
                          config.language == 1
                            ? { marginLeft: (windowWidth * 1) / 100 }
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
                            width: (windowWidth * 40) / 100,
                            marginRight: (windowWidth * 4) / 100,
                            // shadowOpacity: 0.3,
                            // shadowColor:'#000',
                            // shadowOffset:{width:1,height:1},
                            // elevation:5,
                            // shadowRadius: 2,
                            backgroundColor: "#fff",
                            borderColor: "#DFDFDF",
                            borderWidth: 1,
                            borderRadius: (windowWidth * 2) / 100,
                            paddingBottom: (windowWidth * 3) / 100,
                            marginBottom: 3,
                            // alignItems:'center'
                          }}
                        >
                          <Image

                            style={{
                              borderTopLeftRadius: (windowWidth * 1.5) / 100,
                              borderTopRightRadius: (windowWidth * 1.5) / 100,
                              width: "100%",
                              height: (windowWidth * 28) / 100,
                              alignSelf: "center",
                            }}
                            source={item.img}
                          />
                          <View
                            style={{
                              paddingTop: (windowWidth * 2) / 100,
                              paddingHorizontal: (windowWidth * 3) / 100,
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
              <View style={{ paddingHorizontal: s(12), marginTop: vs(7), width: '100%', backgroundColor: Colors.White, justifyContent: 'center', paddingVertical: vs(9), }}>
                <Appheading
                  title={
                    Lang_chg.DoctorConsultation[config.language]
                  }
                />
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  data={DoctorConsultation}
                  renderItem={({ item, index }) => {
                    return (
                      <View
                        style={[
                          { width: (windowWidth * 43) / 100 },
                          config.language == 1
                            ? { marginLeft: (windowWidth * 1) / 100 }
                            : null,
                        ]}
                      >
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.navigate(
                              "AllServiceProviderListing",
                              {
                                pass_status: item.pass_status,
                                enableFor: item.enableFor
                              }
                            )
                          }
                          style={{
                            width: (windowWidth * 40) / 100,
                            marginRight: (windowWidth * 4) / 100,
                            // shadowOpacity: 0.3,
                            // shadowColor:'#000',
                            // shadowOffset:{width:1,height:1},
                            // elevation:5,
                            // shadowRadius: 2,
                            backgroundColor: "#fff",
                            borderColor: "#DFDFDF",
                            borderWidth: 1,
                            borderRadius: (windowWidth * 2) / 100,
                            paddingBottom: (windowWidth * 3) / 100,
                            marginBottom: 3,
                            // alignItems:'center'
                          }}>
                          <Image
                            style={{
                              borderTopLeftRadius: (windowWidth * 1.5) / 100,
                              borderTopRightRadius: (windowWidth * 1.5) / 100,
                              width: "100%",
                              height: (windowWidth * 28) / 100,
                              alignSelf: "center",
                            }}
                            source={item.img}
                          />
                          <View
                            style={{
                              paddingTop: (windowWidth * 2) / 100,
                              paddingHorizontal: (windowWidth * 3) / 100,
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


              {/* FlatList 3 */}
              <View style={{ paddingHorizontal: s(12), marginTop: vs(7), width: '100%', backgroundColor: Colors.White, justifyContent: 'center', paddingVertical: vs(9), marginBottom: vs(30) }}>
                <Appheading
                  title={
                    Lang_chg.Lab_Test_Booking[config.language]
                  }
                />
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  data={LabTest}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() =>
                          this.props.navigation.navigate(
                            "AllServiceProviderListing",
                            { pass_status: item.pass_status }
                          )
                        }
                        style={[
                          { width: windowWidth },
                          // { backgroundColor: 'pink' },
                          { flexDirection: 'row' },
                          config.language == 1
                            ? { marginLeft: (windowWidth * 1) / 100 }
                            : null,
                        ]}
                      >


                        <View style={{ width: '42%', justifyContent: 'center' }}>
                          <Image
                            style={{
                              borderRadius: (windowWidth * 2) / 100,
                              width: (windowWidth * 40) / 100,
                              height: (windowWidth * 35) / 100,
                            }}
                            source={item.img}
                          />
                          <TouchableOpacity
                            onPress={() => this.props.navigation.navigate(
                              "AllServiceProviderListing",
                              { pass_status: item.pass_status }
                            )}
                            style={{
                              borderRadius: (windowWidth * 2) / 100,
                              width: (windowWidth * 40) / 100,
                              height: (windowWidth * 9) / 100,
                              marginTop: vs(8),
                              marginHorizontal: s(1),
                              marginBottom: vs(4),
                              backgroundColor: Colors.White,
                              borderWidth: 0.8,
                              borderColor: Colors.ButtonBorder,
                              shadowOpacity: 0.3,
                              shadowColor: '#000',
                              shadowOffset: { width: 1, height: 1 },
                              elevation: 2,
                              shadowRadius: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={{
                                fontSize: Font.small,
                                fontFamily: Font.Medium,
                                color: Colors.Blue
                              }}
                            >{Lang_chg.Find_Labs[config.language]}</Text>
                          </TouchableOpacity>
                        </View>

                        <View style={{ width: '48%', }}>

                          <View style={{ width: '100%', height: (windowWidth * 35) / 100, paddingVertical: vs(5), justifyContent: 'center' }}>
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

                            {config.language == 1 ? (
                              <Text style={[Styles.subDetails, { color: Colors.Blue, marginTop: vs(8), }]}>
                                {item.status}
                              </Text>
                            ) : (
                              <Text style={[Styles.subDetails, { color: Colors.Blue, marginTop: vs(8), }]}>{item.status}</Text>
                            )}

                            {config.language == 1 ? (
                              <Text style={[Styles.subDetails, { color: Colors.Black, marginTop: vs(4), }]}>
                                {item.terms}
                              </Text>
                            ) : (
                              <Text style={[Styles.subDetails, { color: Colors.Black, marginTop: vs(4), }]}>{item.terms}</Text>
                            )}

                          </View>
                        </View>

                      </TouchableOpacity>
                    );
                  }}
                />
              </View>

            </View>


          </ScrollView>
        </View>





      </View>
    );
  }
}
const styles_new = StyleSheet.create({

  icons: {
    width: (windowWidth * 13) / 100,
    height: (windowWidth * 13) / 100,
    borderRadius: (windowWidth * 5) / 50,
  },
  notebox: {
    backgroundColor: "#fff",
    padding: (windowWidth * 4) / 100,
    marginTop: (windowWidth * 2) / 100,
    borderRadius: (windowWidth * 2) / 100,
  },
  noteboxtxt: {
    fontFamily: Font.Regular,
    lineHeight: (windowWidth * 5) / 100,
  },
  notecard: {
    paddingTop: (windowWidth * 3) / 100,
  },
  checkboxcontainer: {
    paddingTop: (windowWidth * 3) / 100,
  },
  allcheckbox: {
    width: "93%",
    alignSelf: "flex-end",
  },

  checkboxview: {
    // paddingVertical: (windowWidth * 1.5) / 100,

    alignItems: "center",
    alignSelf: "center",
    // backgroundColor: 'red',
    paddingVertical: (windowWidth * 1.3) / 100,
    flexDirection: "row",
    // alignItems: 'center',
    justifyContent: "space-between",
  },
  checkboximg: {
    width: (windowWidth * 7) / 100,
    height: (windowWidth * 7) / 100,
    borderRadius: (windowWidth * 0.4) / 100,
    marginRight: (windowWidth * 2) / 100,
    resizeMode: "contain",
    alignSelf: "flex-start",
    flex: 0.1,
  },
  uncheckboximg: {
    resizeMode: "contain",
    width: (windowWidth * 6) / 100,
    height: (windowWidth * 6) / 100,
    borderRadius: (windowWidth * 0.4) / 100,
    marginRight: (windowWidth * 2.9) / 100,
    marginLeft: (windowWidth * 0.6) / 100,
    flex: 0.1,
  },
  checkboxtext: {
    color: "#666666",
    fontSize: Font.smalltextsize,
    fontFamily: Font.Bold,
    // fontSize: Font.smalltextsize,
    fontFamily: Font.Bold,
    flex: 0.88,
  },
  buttonstyle: {
    width: "70%",
    alignSelf: "center",
    marginVertical: (windowWidth * 9) / 100,
  },
  buttontext: {
    paddingVertical: (windowWidth * 3) / 100,
    paddingHorizontal: (windowWidth * 3) / 100,
    borderRadius: (windowWidth * 2) / 100,
    textAlign: "center",
    backgroundColor: "#4C94DB",
    textAlign: "center",
    color: Colors.whiteColor,
    fontFamily: Font.ExtraBold,
    fontSize: (windowWidth * 4.2) / 100,
  },

  profilecontainer: {
    marginVertical: (windowWidth * 1.2) / 100,
  },
  profileinfo: {
    backgroundColor: "#fff",
    marginVertical: (windowWidth * 1.2) / 100,
    padding: (windowWidth * 3) / 100,
    borderRadius: (windowWidth * 1) / 100,
  },
  profileinfowithimg: {
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "#fff",
    marginVertical: (windowWidth * 1.2) / 100,
    padding: (windowWidth * 3) / 100,
    paddingVertical: (windowWidth * 2) / 100,
    borderRadius: (windowWidth * 1) / 100,
    // backgroundColor: 'red',
  },
  infoimgicon: {
    resizeMode: "contain",
    width: (windowWidth * 8) / 100,
    height: (windowWidth * 8) / 100,
    borderRadius: (windowWidth * 10) / 100,
    marginRight: (windowWidth * 2) / 100,
    alignSelf: "center",
  },
  infosmalltext: {
    // width: '90%',
    // alignSelf: 'flex-end',
    alignSelf: "center",
    fontSize: Font.ssregulartext_size,
    fontFamily: Font.Light,
    // backgroundColor: 'red',
    // color: Colors.gray3,
    // color: 'red',
    flex: 0.86,
  },

  notes: {},

  icons: {
    width: (windowWidth * 13) / 100,
    height: (windowWidth * 13) / 100,
    borderRadius: (windowWidth * 5) / 50,
  },
  notebox: {
    backgroundColor: "#fff",
    padding: (windowWidth * 6) / 100,
    marginTop: (windowWidth * 2) / 100,
    borderRadius: (windowWidth * 2) / 100,
  },
  noteboxtxt: {
    fontFamily: Font.Bold,
    fontSize: (windowWidth * 3.8) / 100,
    lineHeight: (windowWidth * 5) / 100,
  },
  notecard: {
    paddingTop: (windowWidth * 3) / 100,
  },
  checkboxcontainer: {
    paddingTop: (windowWidth * 3) / 100,
  },

  notecardheading: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addoptioncontainer: { marginTop: (windowWidth * 9) / 100 },

  imgboxcontainer: {
    borderRadius: (windowWidth * 1) / 100,
  },
  imgbox: {
    height: (windowWidth * 30) / 100,
    width: (windowWidth * 39) / 100,
    padding: (windowWidth * 2) / 100,
    borderWidth: (windowWidth * 0.6) / 100,
    borderRadius: (windowWidth * 3) / 100,
    borderColor: Colors.gainsboro,
    overflow: "hidden",
    marginRight: (windowWidth * 4) / 100,
    marginBottom: (windowWidth * 4) / 100,
  },
  imgboxstyle: { borderRadius: (windowWidth * 3) / 100 },
  insideview: {
    marginTop: (windowWidth * 2) / 100,
  },
  insideviewtext: {
    alignSelf: "flex-end",
    fontFamily: Font.ExtraBold,
    fontSize: Font.bigheadingfont,
    color: "#4B4B4B",
    marginRight: (windowWidth * 0.2) / 100,
  },
  insideviewimg: {
    alignSelf: "center",
    height: (windowWidth * 8.5) / 100,
    width: (windowWidth * 8.2) / 100,
    alignSelf: "center",
    marginBottom: (windowWidth * 2.5) / 100,
    resizeMode: "center",
  },
  insideviewname: {
    alignSelf: "center",
    fontFamily: Font.ExtraBold,
    fontSize: Font.mini,
    color: "#4B4B4B",
  },
});
