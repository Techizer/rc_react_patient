import React, { Component, useEffect, useState } from "react";
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
  Platform, BackHandler, AppState
} from "react-native";
import {
  Colors,
  Font,
  config,
  windowWidth,
  localStorage,
  Icons,
  LangProvider,
  apifuntion,
} from "../Provider/Utils/Utils";

import { s, vs } from "react-native-size-matters"
import { ScreenHeader } from "../Provider/Utils/Utils";
import Styles from "../Styles";
import BannerCrousel from "../components/BannerCrousel";
import moment from "moment";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { Notifications } from "../Redux/Actions";
import HomeLoadingSkeleton from "../components/HomeLoadingSkeleton";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const Home = ({ navigation }) => {

  const { address, loggedInUserDetails, guest, appLanguage, languageIndex, deviceType, contentAlign, } = useSelector(state => state.StorageReducer)
  const dispatch = useDispatch()
  const [homeData, setHomeData] = useState({
    profileImg: "",
    address: '',
    bannersList: [],
    isLoadingDetails: true
  })
  const isFocused = useIsFocused()

  useEffect(() => {
    // console.log(address.address);
    // console.log(loggedInUserDetails);


    setTimeout(() => {
      setHomeData(prevState => ({
        ...prevState,
        isLoadingDetails: false
      }))
    }, 1000);
    if (guest == false) {
      getNotificationCount();
      getTopBanners()
    }
    RemoveCart()
  }, [])



  const RemoveCart = async (type) => {
    let Id = await AsyncStorage.getItem('cartId')
    let url = config.baseURL + "api-patient-remove-cart";
    var data = new FormData();
    data.append("cart_id", Id);
    console.log('RemoveCart', data);
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        console.log("RemoveCart-response...", obj);
        if (obj.status == true) {
          AsyncStorage.removeItem('cartId')
        } else {
          AsyncStorage.removeItem('cartId')
          return false;
        }
      })
      .catch((error) => {
        console.log("RemoveCart-error ------- " + error);
      });
  };

  const getTopBanners = async () => {

    let url = config.baseURL + "api-patient-dashboard";
    var data = new FormData();
    data.append("login_user_id", loggedInUserDetails.user_id);

    apifuntion.postApi(url, data, 1)
      .then((obj) => {
        // console.log("getTopBanners-response.............", obj.result?.bannerimage);
        if (obj.status == true) {
          setHomeData(prevState => ({
            ...prevState,
            bannersList: obj.result?.bannerimage
          }))
        } else {
          return false;
        }
      }).catch((error) => {
        console.log("getTopBanners-error ------- " + error);
      });
  };

  const getNotificationCount = async () => {

    let url = config.baseURL + "api-notification-count";
    var data = new FormData();
    data.append("login_user_id", loggedInUserDetails.user_id);

    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        // console.log("getNotificationCount-response", obj);
        if (obj.status == true) {
          dispatch(Notifications(obj?.result))
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log("getNotificationCount- error ------- " + error);
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={Styles.container3}>


        <ScreenHeader
          navigation={navigation}
          // title={LangProvider.Home[languageIndex]}
          leftIcon={loggedInUserDetails ? config.img_url3 + loggedInUserDetails?.image : ''}
          rightIcon={!guest}
          defaultAddress={address.address}
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
              homeData.bannersList.length > 0 &&
              <BannerCrousel data={homeData.bannersList} navigation={navigation} />
            }

            {/* FlatList 1 */}
            <View style={{ paddingHorizontal: s(12), marginTop: vs(7), width: '100%', backgroundColor: Colors.White, justifyContent: 'center', paddingVertical: vs(9) }}>
              <Text style={{
                fontSize: Font.medium,
                fontFamily: Font.Medium,
                color: Colors.darkText,
                marginBottom: vs(7),
                alignSelf: 'flex-start',
                textAlign: 'left',
              }}>
                {LangProvider.HomeHealthcareServiceAppointments[languageIndex]}
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
                    homeData.isLoadingDetails ?
                      <HomeLoadingSkeleton />
                      :
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate(
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
                            {languageIndex == 0 ? item.title : item?.arabic_title}
                          </Text>
                        </View>
                        <Text style={{
                          alignSelf: 'flex-start',
                          textAlign: 'left',
                          fontSize: Font.small,
                          fontFamily: Font.Regular,
                          color: Colors.Black,
                          paddingHorizontal: s(6)
                        }}>
                          {languageIndex == 0 ? item.details : item?.arabic_details}
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
                alignSelf: 'flex-start',
                textAlign: 'left',
              }}>
                {LangProvider.DoctorConsultation[languageIndex]}
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
                    homeData.isLoadingDetails ?
                      <HomeLoadingSkeleton />
                      :
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate(
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
                            {languageIndex == 0 ? item.title : item?.arabic_title}
                          </Text>
                        </View>

                        <Text style={{
                          alignSelf: 'flex-start',
                          textAlign: 'left',
                          fontSize: Font.small,
                          fontFamily: Font.Regular,
                          color: Colors.Black,
                          paddingHorizontal: s(6)
                        }}>
                          {languageIndex == 0 ? item.details : item?.arabic_details}
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
                alignSelf: 'flex-start',
                textAlign: 'left',
              }}>
                {LangProvider.Lab_Test_Booking[languageIndex]}
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
                    homeData.isLoadingDetails ?
                      <HomeLoadingSkeleton />
                      :
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() =>
                          navigation.navigate(
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
                            onPress={() => navigation.navigate(
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
                              }}
                            >{LangProvider.Find_Labs[languageIndex]}</Text>
                          </TouchableOpacity>
                        </View>

                        <View style={{ width: '48%', }}>

                          <View style={{ width: '100%', height: (windowWidth * 35) / 100, paddingVertical: vs(5), justifyContent: 'center' }}>

                            <Text style={Styles.cardtitle}>{languageIndex == 0 ? item.title : item.arabic_title}</Text>
                            <Text style={{
                              alignSelf: 'flex-start',
                              textAlign: 'left',
                              fontSize: Font.small,
                              fontFamily: Font.Regular,
                              color: Colors.Black,
                              marginTop: vs(7),
                            }}>
                              {languageIndex == 0 ? item.details : item.arabic_details}
                            </Text>

                            <Text style={[{
                              alignSelf: 'flex-start',
                              textAlign: 'left',
                              fontSize: Font.xsmall,
                              fontFamily: Font.Regular,
                              color: Colors.Blue,
                              marginTop: vs(8)
                            }]}>
                              {languageIndex == 0 ? item.status : item.arabic_status}
                            </Text>

                            <Text style={[{
                              alignSelf: 'flex-start',
                              textAlign: 'left',
                              fontSize: Font.xsmall,
                              fontFamily: Font.Regular,
                              color: Colors.Blue,
                              marginTop: vs(8),
                              color: Colors.Black,
                              marginTop: vs(4),
                            }]}>
                              {languageIndex == 0 ? item.terms : item.arabic_terms}
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


export default Home;