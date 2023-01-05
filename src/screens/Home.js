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

import { s, vs } from "react-native-size-matters"
import { ScreenHeader } from "../Provider/utilslib/Utils";
import Styles from "../Styles";
import BannerCrousel from "../components/BannerCrousel";
import moment from "moment";
global.current_lat_long = "NA";
global.myLatitude = "NA";
global.myLongitude = "NA";

const type = 'notification';

const HomeHealthcareServiceAppointments = [
  {
    id: 1,
    img: Icons.nurse,
    title: "Book a Nurse",
    arabic_title: "حجز ممرضة  ",
    details: "Open for Hourly or Task Based Booking",
    arabic_details: "متاح للحجز بنظام الساعة أو الحجز بنظام المهمة",
    pass_status: "nurse",
  },
  {
    id: 2,
    img: Icons.Physiotherapist,
    title: "Book a Physiotherapist ",
    arabic_title: "حجز علاج طبيعي اخصائي علاج طبيعي",
    details: "For 30 mins",
    arabic_details: "لمدة 30 دقيقة",
    pass_status: "physiotherapy",
  },
  {
    id: 3,
    img: Icons.NurseAssistant,
    title: "Book Nurse Assistant",
    arabic_title: "حجز مساعدة ممرضة مساعد",
    details: "Available 2,4,6,8 hrs",
    arabic_details: "متاح 8،6،4،2 ساعة  ",
    pass_status: "caregiver",
  },
  {
    id: 4,
    img: Icons.Babysitter,
    title: "Book a Babysitter",
    arabic_title: "حجز جليسة أطفال",
    pass_status: "babysitter",
    details: "Available 2,4,6,8 hrs",
    arabic_details: "متاح 8،6،4،2 ساعة  ",
  },
];

const DoctorConsultation = [
  {
    id: 1,
    img: Icons.InstantVideoConsultation,
    title: "Instant Video Consultation",
    arabic_title: "استشارة فيديو فورية",
    details: "5-15 mins",
    arabic_details: "15-5 دقيقة",
    pass_status: "doctor",
    enableFor: 'ONLINE_CONSULT'
  },
  {
    id: 2,
    img: Icons.HomeVisitConsultation,
    title: "Home Visit Consultation",
    arabic_title: "استشارة زيارة منزلية",
    details: "for 45 mins",
    arabic_details: "لمدة 45 دقيقة",
    pass_status: "doctor",
    enableFor: 'HOME_VISIT_CONSULT'
  },
];

const LabTest = [
  {
    id: 1,
    img: Icons.BookaLabTest,
    title: "Book a Lab Test",
    arabic_title: "احجز اختبارًا معمليًا",
    details: "Get test report within 24 hours of sample collected. All Rootscare labs are 100% safe.",
    arabic_details: "احصل على تقرير الاختبار في غضون 24 ساعة من جمع العينة. جميع معامل Rootscare آمنة بنسبة 100٪.",
    status: '1 day report guaranteed.',
    arabic_status: 'تقرير ليوم واحد مضمون.',
    terms: "T&C Apply",
    arabic_terms: 'تطبق الشروط والأحكام',
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
      address: "",
      notification_count: "",
      app_status: "",
      bannersList: []
    };
  }
  componentDidMount() {

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this.props.navigation.addListener("focus", () => {
      // if (global.isLogin == false) {
      if (global.isLogin == true) {
        this.getNotificationCount();
        this.getTopBanners()
      }
      this.getAddress();
      this.removeExpiredCart()
    });
    // PushNotification.getChannels(function (channel_ids) {
    //   console.log(channel_ids); 
    // });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  removeExpiredCart = async () => {
    let cartId = await localStorage.getItemString('cartId')
    let cartTime = await localStorage.getItemString('cartTime')
    console.log({ cartId });
    if (cartId != null && cartId != '' && cartId != undefined) {
      let currentTime = moment().format('x')
      currentTime = JSON.parse(currentTime)
      currentTime = moment(currentTime).format('HH:mm:ss')
      cartTime = JSON.parse(cartTime)
      cartTime = moment(cartTime).format('HH:mm:ss')
      console.log('cart time...', cartTime);
      let currentSplitTime = currentTime.split(':')
      let cartSplitTime = cartTime.split(':')

      let hourDiff = currentSplitTime[0] - cartSplitTime[0]
      let minsDiff = currentSplitTime[1] - cartSplitTime[1]
      let secDiff = currentSplitTime[2] - cartSplitTime[2]

      console.log(hourDiff);
      console.log(minsDiff);
      console.log(secDiff);
      // return false

      if (hourDiff > 0 || (minsDiff > 0)) {
        console.log('Time is greater than 1 min');
        this.remove_cart(cartId).then(() => {
          localStorage.removeItem('cartId')
          localStorage.removeItem('cartTime')
        })
      }

    }
  }

  remove_cart = async (cartId) => {
    let url = config.baseURL + "api-patient-remove-cart";
    var data = new FormData();
    data.append("cart_id", cartId)

    consolepro.consolelog("remove_cart-data", data);
    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        consolepro.consolelog("remove_cart-response...", obj);
        if (obj.status == true) {
        } else {
          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("remove_cart- error ------- " + error);
      });
  };

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
    // console.log('Back button is pressed', this.props.route.name);
    if (this.props.route.name == "Home") {
      return true;
    } else {
      return false;
    }

  }


  getTopBanners = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];

    let url = config.baseURL + "api-patient-dashboard";
    var data = new FormData();
    data.append("login_user_id", user_id);

    apifuntion.postApi(url, data, 1)
      .then((obj) => {
        // consolepro.consolelog("getTopBanners-response.............", obj.result?.bannerimage);
        if (obj.status == true) {
          this.setState({ bannersList: obj.result?.bannerimage })
        } else {
          return false;
        }
      }).catch((error) => {
        console.log("getTopBanners-error ------- " + error);
      });
  };

  getNotificationCount = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];

    let url = config.baseURL + "api-notification-count";
    var data = new FormData();
    data.append("login_user_id", user_id);

    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        // consolepro.consolelog("getNotificationCount-response", obj);
        if (obj.status == true) {
          localStorage.setItemString('notiCount', JSON.stringify(obj?.result))
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log("getNotificationCount- error ------- " + error);
      });
  };



  getAddress = async () => {
    let addDetails = await localStorage.getItemObject("addressDetails");

    if (addDetails != null && addDetails != '' && addDetails != undefined) {
      this.setState({
        address: addDetails.address,
      });
    }
    if (global.isLogin == false) {
      this.setState({
        profile_img: '',
      });
    } else {
      let user_details = await localStorage.getItemObject("user_arr");

      if (user_details.image != null) {
        this.setState({
          profile_img: config.img_url3 + user_details["image"],
        });
      }
    }

  };



  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={Styles.container3}>


          <ScreenHeader
            navigation={this.props.navigation}
            title={Lang_chg.Home[config.language]}
            leftIcon={this.state.profile_img}
            rightIcon={global.isLogin}
            address={this.state.address}
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
              {
                this.state.bannersList.length > 0 &&
                <BannerCrousel data={this.state.bannersList} navigation={this.props.navigation} />
              }

              {/* FlatList 1 */}
              <View style={{ paddingHorizontal: s(12), marginTop: vs(7), width: '100%', backgroundColor: Colors.White, justifyContent: 'center', paddingVertical: vs(9) }}>
                <Text style={{
                  fontSize: Font.medium,
                  fontFamily: Font.Medium,
                  color: Colors.darkText,
                  marginBottom: vs(7),
                  textAlign: config.textRotate
                }}>
                  {Lang_chg.HomeHealthcareServiceAppointments[config.language]}
                </Text>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  data={HomeHealthcareServiceAppointments}
                  ItemSeparatorComponent={() => {
                    return (
                      <View style={{ width: s(8) }}>

                      </View>
                    )
                  }}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate(
                            "AllServiceProviderListing",
                            { pass_status: item.pass_status }
                          )
                        }
                        style={[
                          {
                            borderRadius: 10,
                            width: s(140),
                            backgroundColor: Colors.White,
                            borderColor: Colors.Border,
                            borderWidth: 1,
                            paddingBottom: vs(10)
                          }]}>
                        <View style={{ width: '100%', }}>
                          <Image
                            style={{
                              borderTopLeftRadius: 9,
                              borderTopRightRadius: 9,
                              width: "100%",
                              height: vs(110),
                              alignSelf: "center",
                            }}
                            source={item.img}
                          />
                        </View>

                        <View style={{ width: '100%', paddingVertical: vs(7), paddingHorizontal: s(6) }}>
                          <Text style={Styles.cardtitle}>
                            {config.language == 0 ? item.title : item?.arabic_title}
                          </Text>
                        </View>
                        <Text style={{
                          textAlign: config.textalign,
                          fontSize: Font.small,
                          fontFamily: Font.Regular,
                          color: Colors.Black,
                          paddingHorizontal: s(6)
                        }}>
                          {config.language == 0 ? item.details : item?.arabic_details}
                        </Text>

                      </TouchableOpacity>
                    );
                  }}
                />
              </View>

              {/* FlatList 2 */}
              <View style={{ paddingHorizontal: s(12), marginTop: vs(7), width: '100%', backgroundColor: Colors.White, justifyContent: 'center', paddingVertical: vs(9), }}>
                <Text style={{
                  fontSize: Font.medium,
                  fontFamily: Font.Medium,
                  color: Colors.darkText,
                  marginBottom: vs(7),
                  textAlign: config.textRotate
                }}>
                  {Lang_chg.DoctorConsultation[config.language]}
                </Text>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  data={DoctorConsultation}
                  ItemSeparatorComponent={() => {
                    return (
                      <View style={{ width: s(8) }}>

                      </View>
                    )
                  }}
                  renderItem={({ item, index }) => {
                    return (
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
                        style={[
                          {
                            borderRadius: 10,
                            width: s(140),
                            backgroundColor: Colors.White,
                            borderColor: Colors.Border,
                            borderWidth: 1,
                            paddingBottom: vs(10)
                          }]}>
                        <View style={{ width: '100%', }}>
                          <Image
                            style={{
                              borderTopLeftRadius: 9,
                              borderTopRightRadius: 9,
                              width: "100%",
                              height: vs(110),
                              alignSelf: "center",
                            }}
                            source={item.img}
                          />
                        </View>

                        <View style={{ width: '100%', paddingVertical: vs(7), paddingHorizontal: s(6) }}>
                          <Text style={Styles.cardtitle}>
                            {config.language == 0 ? item.title : item?.arabic_title}
                          </Text>
                        </View>

                        <Text style={{
                          textAlign: config.textalign,
                          fontSize: Font.small,
                          fontFamily: Font.Regular,
                          color: Colors.Black,
                          paddingHorizontal: s(6)
                        }}>
                          {config.language == 0 ? item.details : item?.arabic_details}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>


              {/* FlatList 3 */}
              <View style={{ paddingHorizontal: s(12), marginTop: vs(7), width: '100%', backgroundColor: Colors.White, justifyContent: 'center', paddingVertical: vs(9), marginBottom: vs(30) }}>
                <Text style={{
                  fontSize: Font.medium,
                  fontFamily: Font.Medium,
                  color: Colors.darkText,
                  marginBottom: vs(7),
                  textAlign: config.textRotate
                }}>
                  {Lang_chg.Lab_Test_Booking[config.language]}
                </Text>
                <FlatList
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  data={LabTest}
                  ItemSeparatorComponent={() => {
                    return (
                      <View style={{ width: s(8) }}>

                      </View>
                    )
                  }}
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
                        style={{
                          width: windowWidth,
                          flexDirection: 'row'
                        }}>

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
                                color: Colors.Blue,
                                textAlign: config.textRotate
                              }}
                            >{Lang_chg.Find_Labs[config.language]}</Text>
                          </TouchableOpacity>
                        </View>

                        <View style={{ width: '48%', }}>

                          <View style={{ width: '100%', height: (windowWidth * 35) / 100, paddingVertical: vs(5), justifyContent: 'center' }}>

                            <Text style={Styles.cardtitle}>{config.language == 0 ? item.title : item.arabic_title}</Text>
                            <Text style={{
                              textAlign: config.textRotate,
                              fontSize: Font.small,
                              fontFamily: Font.Regular,
                              color: Colors.Black,
                              marginTop: vs(7),
                            }}>
                              {config.language == 0 ? item.details : item.arabic_details}
                            </Text>

                            <Text style={[{
                              textAlign: config.textRotate,
                              fontSize: Font.xsmall,
                              fontFamily: Font.Regular,
                              color: Colors.Blue,
                              marginTop: vs(8)
                            }]}>
                              {config.language == 0 ? item.status : item.arabic_status}
                            </Text>

                            <Text style={[{
                              textAlign: config.textRotate,
                              fontSize: Font.xsmall,
                              fontFamily: Font.Regular,
                              color: Colors.Blue,
                              marginTop: vs(8),
                              color: Colors.Black,
                              marginTop: vs(4),
                            }]}>
                              {config.language == 0 ? item.terms : item.arabic_terms}
                            </Text>
                          </View>
                        </View>

                      </TouchableOpacity>
                    );
                  }}
                />
              </View>

            </View>


          </ScrollView>
        </View >





      </View >
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
