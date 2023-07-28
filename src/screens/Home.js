import React, { Component, useEffect, useState } from "react";
import {
  Text,
  FlatList,
  View,
  ScrollView,
  BackHandler,
  Image,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Platforms,
  Platform
} from "react-native";
import {
  Colors,
  Font,
  config,
  windowWidth,
  Icons,
  LangProvider,
  apifuntion,
  msgProvider,
} from "../Provider/Utils/Utils";
import { useFocusEffect } from '@react-navigation/native';
import { TabbyProductSnippetCreditCard,TabbySplititSnippet } from 'tabby-react-native-sdk';
import { s, vs } from "react-native-size-matters"
import { ScreenHeader } from "../Provider/Utils/Utils";
import Styles from "../Styles";
import BannerCrousel from "../components/BannerCrousel";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { CurrentRoute, IsLanguageUpdated, UnReadNotifications, TodaysAppointments, TodaysConsultations, TodaysLabTests, UserProfile } from "../Redux/Actions";
import HomeLoadingSkeleton from "../components/HomeLoadingSkeleton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AudioPlayer } from "../components/AudioPlayer";
import NoInternet from "../components/NoInternet";
import AboutAppBottomSheet from "../components/AboutAppBottomSheet";

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
    details: "For 60 mins",
    arabic_details: "لمدة 60 دقيقة",
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
    img: Icons.BabyCare,
    title: "Book a Baby Care",
    arabic_title: "عناية الطفل",
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

  const {
    address,
    loggedInUserDetails,
    guest,
    appLanguage,
    languageIndex,
    isLanguageUpdated,
    deviceConnection,
    currentRoute,
    deviceToken
  } = useSelector(state => state.StorageReducer)
  const dispatch = useDispatch()
  const [homeData, setHomeData] = useState({
    profileImg: "",
    address: '',
    bannersList: [],
    isLoadingDetails: true
  })
  const isFocused = useIsFocused()
  useEffect(() => {
    if (isFocused) {
      setTimeout(() => {
        setHomeData(prevState => ({
          ...prevState,
          isLoadingDetails: false
        }))
      }, 1000);
      if (!guest) {
        if (deviceConnection) {
          getAppointments()
          getConsultations()
          getTests()
          getNotificationCount();
          getTopBanners()
          CartId()
          getProfile()
          if (isLanguageUpdated) {
            UpdateLanguage()
          }
        }
      }
    }
  }, [deviceConnection])


  const getAppointments = async () => {
    let url = config.baseURL + "api-patient-today-appointment";
    var data = new FormData();
    data.append("lgoin_user_id", loggedInUserDetails?.user_id);
    data.append("service_type", 'all');
    data.append("page_count", 1);

    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        // console.log("getAppointments-response...", obj);
        if (obj.status == true) {
          if (obj.result != null && obj.result.length > 0 && obj.result.length > 1) {
            dispatch(TodaysAppointments(obj?.result.length))
          } else {
            dispatch(TodaysAppointments(0))
          }
        } else {
          dispatch(TodaysAppointments(0))
          return false;
        }
      }).catch((error) => {
        dispatch(TodaysAppointments(0))
        console.log("getAppointments-error ------- " + error);
      });
  };

  const getConsultations = async () => {
    let url = config.baseURL + "api-patient-today-appointment";
    var data = new FormData();
    data.append("lgoin_user_id", loggedInUserDetails?.user_id);
    data.append("service_type", 'doctor');
    data.append("page_count", 1);

    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        // console.log("getConsultations-response...", obj);
        if (obj.status == true) {
          if (obj.result != null && obj.result.length > 0 && obj.result.length > 1) {
            dispatch(TodaysConsultations(obj?.result.length))
          } else {
            dispatch(TodaysConsultations(0))
          }
        } else {
          dispatch(TodaysConsultations(0))
          return false;
        }
      }).catch((error) => {
        dispatch(TodaysConsultations(0))
        console.log("getConsultations-error ------- " + error);
      });
  };

  const getTests = async () => {
    let url = config.baseURL + "api-patient-today-appointment";
    var data = new FormData();
    data.append("lgoin_user_id", loggedInUserDetails?.user_id);
    data.append("service_type", 'lab');
    data.append("page_count", 1);
    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        // console.log("getTests-response...", obj);
        if (obj.status == true) {
          if (obj.result != null && obj.result.length > 0 && obj.result.length > 1) {
            dispatch(TodaysLabTests(obj?.result.length))
          } else {
            dispatch(TodaysLabTests(0))
          }
        } else {
          dispatch(TodaysLabTests(0))
          return false;
        }
      }).catch((error) => {
        dispatch(TodaysLabTests(0))
        console.log("getTests-error ------- " + error);
      });
  };

  const getProfile = async () => {
    let url = config.baseURL + "api-patient-profile";
    var data = new FormData();
    data.append("user_id", loggedInUserDetails?.user_id);

    apifuntion.postApi(url, data)
      .then((obj) => {
        // console.log("getProfile...", obj);
        if (obj.status == true) {
          dispatch(UserProfile(obj?.result))
        } else {
          msgProvider.alert(
            LangProvider.information[languageIndex],
            obj.message[languageIndex],
            false
          );
          return false;
        }
      }).catch((error) => {
        console.log("getProfile-error ------- " + error);
      });
  };

  const CartId = async () => {
    let Id = await AsyncStorage.getItem('cartId')
    if (Id != null) {
      RemoveCart(Id)
    }
  };

  const RemoveCart = async (Id) => {
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
    data.append("login_user_id", loggedInUserDetails?.user_id);

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
    data.append("login_user_id", loggedInUserDetails?.user_id);

    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        // console.log("getNotificationCount-response", obj);
        if (obj.status == true) {
          dispatch(UnReadNotifications(obj?.result))
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log("getNotificationCount- error ------- " + error);
      });
  };

  const UpdateLanguage = async (language) => {
    let url = config.baseURL + "api-language-update";
    var data = new FormData();
    data.append("login_user_id", loggedInUserDetails?.user_id);
    data.append("device_lang", appLanguage == 'en' ? 'ENG' : 'AR');
    console.log(data);
    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        console.log("UpdateLanguage", obj);
        if (obj.status == true) {
          dispatch(IsLanguageUpdated(false))
        } else {
          msgProvider.showError(obj.message)
          return false;
        }
      }).catch((error) => {
        msgProvider.showError(error)
        console.log("UpdateLanguage-error ------- " + error);
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={Styles.container3}>


        <ScreenHeader
          navigation={navigation}
          // title={LangProvider.Home[languageIndex]}
          leftIcon={(loggedInUserDetails && loggedInUserDetails.image != '' && loggedInUserDetails.image != null) ? (config.img_url3 + loggedInUserDetails?.image) : ''}
          rightIcon={!guest}
          defaultAddress={address?.address}
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
            <View style={{ paddingHorizontal: s(12), marginTop: vs(7), width: '100%', backgroundColor: Colors.White, justifyContent: 'center', paddingVertical: vs(9), }}>
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

          {/* ----------------Promo------------------- */}
          <TabbyProductSnippetCreditCard
            lang={languageIndex == 0 ? 'en' : "ar"}
            currency={loggedInUserDetails.currency_symbol}
            price={'0'}
            containerStyle={{ marginBottom: vs(30), marginTop: vs(7) }}
          />

          {/* <TabbySplititSnippet
            currency="SAR"
            // price="6000"
            lang="en"
            containerStyle={{ marginBottom: vs(30), marginTop: vs(7) }}
          /> */}
        </ScrollView>

        <NoInternet
          visible={!deviceConnection}
        />

      </View >

    </View >
  );

}


export default Home;