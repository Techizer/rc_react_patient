import React, { Component, useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ImageBackground,
  Modal,
  FlatList,
} from "react-native";
import { TabbyProductSnippetCreditCard,TabbySplititSnippet } from 'tabby-react-native-sdk';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Colors,
  Font,
  msgProvider,
  config,
  windowWidth,
  ScreenHeader,
  LangProvider,
  apifuntion,
  Button
} from "../Provider/Utils/Utils";
import { Capsule, Clock, dummyDoc, dummyUser, GoldStar, leftArrow, Notification } from "../Icons/Index";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import AboutAppBottomSheet from '../components/AboutAppBottomSheet'
import { useDispatch, useSelector } from "react-redux";
import { SelectedProvider } from "../Redux/Actions";
import NoInternet from "../components/NoInternet";



export default ServiceProviderDetails = ({ navigation, route }) => {

  const { loggedInUserDetails, address, guest, deviceConnection, appLanguage, languageIndex } = useSelector(state => state.StorageReducer)
  const dispatch = useDispatch()
  const { docType, providerType, providerId, isFromHospital, hospitalId } = route?.params
  const [statesData, setStatesData] = useState({
    isLoading: true,
    provider_details: "",
    message: "",
    modalVisible: false,
    modal2Visible: false,
    how_work_value: "",
    available_days: "",
    availability_arr: [],
  })
  const insets = useSafeAreaInsets()

  useEffect(() => {
    if (deviceConnection) {
      getProviderDetails()
    }
  }, [deviceConnection])

  const setState = payload => {
    setStatesData(prev => ({
      ...prev,
      ...payload
    }))
  }

  const getAvailableProviderDetails = async (userId) => {
    setState({
      isLoading: true
    });
    let url = config.baseURL + "api-patient-service-provider-details";

    var data = new FormData();
    if (guest == true) {
      data.append("id", userId);
      data.append("login_user_id", 0);
      data.append("service_type", providerType);
      data.append("device_lang", languageIndex == 0 ? 'ENG' : 'AR');
      data.append("latitude", address?.latitude);
      data.append("longitudes", address?.longitude);

    } else {
      data.append("id", userId);
      data.append("login_user_id", loggedInUserDetails.user_id);
      data.append("service_type", providerType);
      data.append("work_area", loggedInUserDetails.work_area);
    }
    if (providerType === "doctor") {
      data.append("docEnableFor", docType);
    }
    // return false
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        console.log("get_Service-details-response", JSON.stringify(obj));

        if (obj.status == true) {
          let htmlData = '<!DOCTYPE html><html><body style="color:#0168b3">';
          let htmlDataClosed = "</body></html>";

          setTimeout(() => {
            setState({
              provider_details: obj.result,
              message: obj.message,
              availability_arr: obj.result.availability,
              isLoading: false
            });
          }, 450);

          let how_work = obj.result.how_work_value;

          let result_new = how_work.replace('<font color="#0888D1">', "");
          result_new = result_new.replace("<h4>", '<h4 color="#0168b3">');
          result_new = result_new.replace(/<\/h5>/g, "</h5><br>");
          let result_new_tag = result_new.replace(/<\/p><p>/g, "</p>");
          htmlData = htmlData + result_new_tag + htmlDataClosed;

          setState({ how_work_value: htmlData });
          let hour_task = obj.result.availability;
          if (
            obj.result.availability != null &&
            obj.result.availability != ""
          ) {
            for (let k = 0; k < obj.result.availability.length; k++) {
              hour_task[k] = hour_task[k].slot_day;
            }
          }
          setState({ available_days: hour_task.toString() });
        } else {
          msgProvider.showError(obj.message);
          return false;
        }
      })
      .catch((error) => {
        setState({
          isLoading: false
        });
        console.log("getAvailableProviderDetails-error ------- " + error);
      });
  };

  const getProviderDetails = async () => {
    let url = config.baseURL + "api-patient-service-provider-details";
    var data = new FormData();
    if (guest == true) {
      data.append("id", providerId);
      data.append("login_user_id", 0);
      data.append("service_type", providerType);
      data.append("device_lang", languageIndex == 0 ? 'ENG' : 'AR');
      data.append("latitude", address?.latitude);
      data.append("longitudes", address?.longitude);

    } else {
      data.append("id", providerId);
      data.append("login_user_id", loggedInUserDetails.user_id);
      data.append("service_type", providerType);
      data.append("work_area", loggedInUserDetails.work_area);
    }
    if (providerType === "doctor") {
      data.append("docEnableFor", docType);
    }
    // console.log(data);
    // return
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        console.log('getProviderDetails:....', obj.result);
        if (obj.status == true) {
          let htmlData = '<!DOCTYPE html><html><body style="color:#0168b3">';
          let htmlDataClosed = "</body></html>";

          setTimeout(() => {
            setState({
              provider_details: obj.result,
              message: obj.message,
              availability_arr: obj.result.availability,
              isLoading: false
            });
          }, 350);
          let how_work = obj.result.how_work_value;

          let result_new = how_work.replace('<font color="#0888D1">', "");
          result_new = result_new.replace("<h4>", '<h4 color="#0168b3">');
          result_new = result_new.replace(/<\/h5>/g, "</h5><br>");
          let result_new_tag = result_new.replace(/<\/p><p>/g, "</p>");
          htmlData = htmlData + result_new_tag + htmlDataClosed;

          setState({ how_work_value: htmlData });
          let hour_task = obj.result.availability;
          if (
            obj.result.availability != null &&
            obj.result.availability != ""
          ) {
            for (let k = 0; k < obj.result.availability.length; k++) {
              hour_task[k] = hour_task[k].slot_day;
            }
          }
          // console.log("availability-days", hour_task.toString());
          setState({ available_days: hour_task.toString() });
        } else {
          msgProvider.showError(obj.message);
          return false;
        }
      })
      .catch((error) => {
        setState({
          isLoading: false
        });
        console.log("getProviderDetails-error ------- " + error);
      });
  };


  const { modalVisible, provider_details, available_days } = statesData;
  return (
    <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor, }}>

      <ScreenHeader
        title={
          providerType == "nurse"
            ? LangProvider.Nurse[languageIndex]
            : providerType == "physiotherapy"
              ? LangProvider.Physiotherapist[languageIndex]
              : providerType == "caregiver"
                ? LangProvider.Nurse_assistant[languageIndex]
                : providerType == "babysitter"
                  ? LangProvider.BabyCare[languageIndex]
                  : providerType == "doctor"
                    ? LangProvider.Doctor[languageIndex]
                    : LangProvider.Lab[languageIndex]
        }
        navigation={navigation}
        onBackPress={() => navigation.pop()}
        leftIcon
      />

      {
        statesData.isLoading ?
          <View style={{
            width: windowWidth,
            backgroundColor: Colors.White,
            paddingHorizontal: s(11),
            paddingVertical: vs(9)
          }}>

            <View style={styles.infoContainer}>
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
                <View
                  style={{
                    width: "70%",
                    alignSelf: "center",
                    height: '100%',
                    paddingTop: vs(3)
                  }} >
                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item width={(windowWidth * 30) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                  </SkeletonPlaceholder>
                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item width={(windowWidth * 15) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} style={{ marginTop: vs(7) }} />
                  </SkeletonPlaceholder>
                </View>
              </View>

              <View style={styles.experienceContainer}>
                <View style={{ flex: 1, borderEndColor: Colors.backgroundcolor }}>
                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item width={(windowWidth * 20) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                  </SkeletonPlaceholder>
                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item width={(windowWidth * 15) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} style={{ marginTop: vs(7) }} />
                  </SkeletonPlaceholder>
                </View>

                <View style={{ flex: 1, borderEndColor: Colors.backgroundcolor }}>
                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item width={(windowWidth * 20) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                  </SkeletonPlaceholder>
                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item width={(windowWidth * 15) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} style={{ marginTop: vs(7) }} />
                  </SkeletonPlaceholder>
                </View>

                <View style={{ flex: 1, }}>
                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item width={(windowWidth * 20) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                  </SkeletonPlaceholder>
                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item width={(windowWidth * 15) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} style={{ marginTop: vs(7) }} />
                  </SkeletonPlaceholder>
                </View>
              </View>

              <View style={styles.descContainer}>
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width={(windowWidth * 80) / 100} height={(windowWidth * 8) / 100} borderRadius={s(4)} />
                </SkeletonPlaceholder>
              </View>


              <View style={styles.timeContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '30%', }}>
                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item width={(windowWidth * 7) / 100} height={(windowWidth * 7) / 100} borderRadius={s(20)} />
                  </SkeletonPlaceholder>
                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item width={(windowWidth * 15) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} style={{ marginLeft: s(7) }} />
                  </SkeletonPlaceholder>
                </View>

                <View style={{ alignItems: 'flex-end', width: '70%', }}>
                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item width={(windowWidth * 15) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                  </SkeletonPlaceholder>
                </View>
              </View>

              {/* <View style={{ width: '100%', height: 1.5, backgroundColor: Colors.backgroundcolor, marginTop: vs(18) }}></View> */}

            </View>

          </View>
          :
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: vs(30)
            }}>

            {/* -------------------Info Container-------------------- */}

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
                    (provider_details.image == "NA" || provider_details.image == null || provider_details.image == "") ?
                      <SvgXml xml={dummyUser} height={s(75)} width={s(75)} style={{ borderColor: Colors.Border }} />
                      :
                      <Image
                        source={{ uri: config.img_url3 + provider_details.image }}
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
                      alignSelf: 'flex-start',
                      color: Colors.darkText
                    }}>
                    {provider_details.provider_name}
                  </Text>

                  {
                    provider_details.hospital_name != '' &&
                    <Text
                      style={{
                        fontFamily: Font.Medium,
                        fontSize: Font.small,
                        alignSelf: 'flex-start',
                        color: Colors.Theme,
                        marginTop: vs(2)
                      }}>
                      {provider_details.hospital_name}
                    </Text>
                  }

                  {
                    providerType != 'lab' &&
                    <Text
                      style={{
                        fontFamily: Font.Regular,
                        fontSize: Font.small,
                        alignSelf: 'flex-start',
                        color: Colors.lightGrey,
                        marginTop: vs(2)
                      }}>
                      {provider_details.qualification}
                    </Text>
                  }
                  <View style={{ flexDirection: 'row', marginTop: vs(2), alignItems: 'center' }}>
                    {
                      providerType === 'lab' &&
                      <SvgXml xml={Capsule} height={vs(18)} width={s(55)} />
                    }
                    <Text
                      style={{
                        fontFamily: Font.Medium,
                        fontSize: Font.small,
                        color: Colors.Theme,
                        marginLeft: providerType === 'lab' ? 5 : 0
                      }}
                    >
                      {providerType === 'lab' ? provider_details?.iso_text : provider_details.speciality}
                    </Text>
                  </View>

                  {/* <Text
                    style={{
                      fontFamily: Font.Medium,
                      fontSize: Font.small,
                      alignSelf: 'flex-start',
                      color: Colors.Theme,
                      marginTop: vs(5)
                    }}>
                    {providerType === 'lab' ? provider_details?.iso_text : provider_details.speciality}
                  </Text> */}

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
                    {providerType === 'lab' ? LangProvider.ESTABLISHED[languageIndex] : LangProvider.Experience[languageIndex]}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Font.Medium,
                      fontSize: Font.xlarge,
                      alignSelf: 'flex-start',
                      color: Colors.darkText,
                      marginTop: vs(5)
                    }}>
                    {provider_details.experience ? provider_details.experience : '-'}
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
                      color: Colors.darkText,
                      marginTop: vs(5),
                      paddingHorizontal: s(15)
                    }}>
                    {provider_details.booking_count}
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
                        color: Colors.darkText,
                        marginLeft: s(5)
                      }}>
                      {provider_details.avg_rating ? `${provider_details.avg_rating}.0` : 'NA'}
                    </Text>
                  </View>

                </View>
              </View>

              {/* -------------------Desc Container-------------------- */}

              {
                provider_details.description ?
                  <View style={styles.descContainer}>
                    <Text
                      style={{
                        fontFamily: Font.Regular,
                        fontSize: Font.xsmall,
                        alignSelf: 'flex-start',
                        color: Colors.detailTitles,
                      }}>
                      {provider_details.description}
                    </Text>
                  </View>
                  :
                  null
              }

              {/* -------------------Time Container-------------------- */}

              <View style={styles.timeContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '30%', }}>
                  <SvgXml xml={Clock} height={s(15)} width={s(15)} style={{ marginRight: s(9) }} />
                  <Text
                    style={{
                      fontFamily: Font.Regular,
                      fontSize: Font.medium,
                      color: Colors.darkText,
                    }}>
                    {'Availability'}
                  </Text>
                </View>

                <View style={{ alignItems: 'flex-end', width: '70%', }}>
                  <Text
                    style={{
                      fontFamily: Font.Medium,
                      color: Colors.Blue,
                      fontSize: Font.small,
                    }}>
                    {available_days}
                  </Text>
                </View>
              </View>

              <View style={{ width: '100%', height: 1.5, backgroundColor: Colors.backgroundcolor, marginTop: vs(18) }}></View>

              {/* -------------------Btns Container-------------------- */}

              <View style={styles.btnContainer}>

                {/* -------------Doctor------------- */}

                {
                  (provider_details?.provider_available == '0' && providerType == "doctor" && provider_details?.online_enable == '0') &&
                  <Button
                    text={LangProvider.BookOnlineAppointment[languageIndex]}
                    btnStyle={{ marginTop: 0, backgroundColor: Colors.Green }}
                    onPress={() => {
                      if (guest) {
                        dispatch(SelectedProvider({
                          currentScreen: 'providerList',
                        }))
                        setTimeout(() => {
                          navigation.navigate("AuthStack")
                        }, 250);
                      } else {
                        dispatch(SelectedProvider({
                          currentScreen: 'providerDetails',
                          providerType: providerType,
                          providerId: providerId,
                          isFromHospital: isFromHospital,
                          hospitalId: hospitalId,
                          bookingType: '',
                          docType: 'ONLINE_CONSULT',
                          packageId: ''
                        }))
                        setTimeout(() => {
                          navigation.navigate("HealthRecord")
                        }, 250);
                      }
                    }}
                  />
                }

                {
                  (provider_details?.provider_available == '0' && providerType == "doctor" && provider_details?.home_visit_enable == '0') &&
                  <Button
                    text={LangProvider.BookHomeVisitAppointment[languageIndex]}
                    btnStyle={{ marginTop: 10, backgroundColor: Colors.Theme }}
                    onPress={() => {
                      if (guest) {
                        dispatch(SelectedProvider({
                          currentScreen: 'providerList',
                        }))
                        setTimeout(() => {
                          navigation.navigate("AuthStack")
                        }, 250);
                      } else {
                        dispatch(SelectedProvider({
                          currentScreen: 'providerDetails',
                          providerType: providerType,
                          providerId: providerId,
                          isFromHospital: isFromHospital,
                          hospitalId: hospitalId,
                          bookingType: '',
                          docType: 'HOME_VISIT_CONSULT',
                          packageId: ''
                        }))
                        setTimeout(() => {
                          navigation.navigate("HealthRecord")
                        }, 250);
                      }
                    }}
                  />
                }

                {/* -------------Lab------------- */}

                {
                  (provider_details?.provider_available == '0' && providerType == 'lab' && provider_details?.task_base_enable == '0') &&
                  <Button
                    text={LangProvider.BOOKLABTESTAPPOINTMENT[languageIndex]}
                    btnStyle={{ marginTop: 0, backgroundColor: Colors.Green }}
                    onPress={() => {
                      if (guest) {
                        dispatch(SelectedProvider({
                          currentScreen: 'providerList',
                        }))
                        setTimeout(() => {
                          navigation.navigate("AuthStack")
                        }, 250);
                      } else {
                        dispatch(SelectedProvider({
                          currentScreen: 'providerDetails',
                          providerType: providerType,
                          providerId: providerId,
                          isFromHospital: isFromHospital,
                          hospitalId: hospitalId,
                          bookingType: 'test',
                          docType: '',
                          packageId: ''
                        }))
                        setTimeout(() => {
                          navigation.navigate("HealthRecord")
                        }, 250);
                      }
                    }}
                  />
                }

                {
                  (provider_details?.provider_available == '0' && providerType == 'lab' && provider_details?.packagebase_enable == '0') &&
                  <Button
                    text={LangProvider.BookLabPackage[languageIndex]}
                    btnStyle={{ marginTop: 10, backgroundColor: Colors.Theme }}
                    onPress={() => {
                      if (guest) {
                        dispatch(SelectedProvider({
                          currentScreen: 'providerList',
                        }))
                        setTimeout(() => {
                          navigation.navigate("AuthStack")
                        }, 250);
                      } else {
                        dispatch(SelectedProvider({
                          currentScreen: 'providerDetails',
                          providerType: providerType,
                          providerId: providerId,
                          isFromHospital: isFromHospital,
                          hospitalId: hospitalId,
                          bookingType: 'package',
                          docType: '',
                          packageId: ''
                        }))
                        setTimeout(() => {
                          navigation.navigate("HealthRecord")
                        }, 250);
                      }
                    }}
                  />
                }

                {/* -------------Others------------- */}


                {
                  ((providerType != 'lab' && providerType != 'doctor') && provider_details?.provider_available == '0' && provider_details?.task_base_enable == '0') &&
                  <Button
                    text={LangProvider.BOOKTASKBASEDAPPOINTMENT[languageIndex]}
                    btnStyle={{ marginTop: 0, backgroundColor: Colors.Green }}
                    onPress={() => {
                      if (guest) {
                        dispatch(SelectedProvider({
                          currentScreen: 'providerList',
                        }))
                        setTimeout(() => {
                          navigation.navigate("AuthStack")
                        }, 250);
                      } else {
                        dispatch(SelectedProvider({
                          currentScreen: 'providerDetails',
                          providerType: providerType,
                          providerId: providerId,
                          isFromHospital: isFromHospital,
                          hospitalId: hospitalId,
                          bookingType: 'task',
                          docType: '',
                          packageId: ''
                        }))
                        setTimeout(() => {
                          navigation.navigate("HealthRecord")
                        }, 250);
                      }
                    }}
                  />
                }

                {

                  ((providerType != 'lab' && providerType != 'doctor') && provider_details?.provider_available == '0' && provider_details?.hour_base_enable == '0') &&
                  <Button
                    text={LangProvider.BOOKHOURLYAPPOINTMENT[languageIndex]}
                    btnStyle={{ marginTop: 10, backgroundColor: Colors.Theme }}
                    onPress={() => {
                      if (guest) {
                        dispatch(SelectedProvider({
                          currentScreen: 'providerList',
                        }))
                        setTimeout(() => {
                          navigation.navigate("AuthStack")
                        }, 250);
                      } else {
                        dispatch(SelectedProvider({
                          currentScreen: 'providerDetails',
                          providerType: providerType,
                          providerId: providerId,
                          isFromHospital: isFromHospital,
                          hospitalId: hospitalId,
                          bookingType: 'hour',
                          docType: '',
                          packageId: ''
                        }))
                        setTimeout(() => {
                          navigation.navigate("HealthRecord")
                        }, 250);
                      }
                    }}
                  />
                }

              </View>
            </View>

            {/* -------------------About Container-------------------- */}


            <View style={styles.aboutContainer}>

              <View style={{ flexDirection: 'row', width: '70%', height: '100%', alignItems: 'center' }}>
                <SvgXml xml={dummyDoc} height={s(23)} width={s(23)} style={{}} />
                <Text
                  style={{
                    fontFamily: Font.Regular,
                    fontSize: Font.small,
                    color: Colors.White,
                    paddingLeft: s(7),
                    paddingRight: s(14),
                  }}>
                  {(providerType == "nurse"
                    ? LangProvider.Nurse[languageIndex]
                    : providerType == "physiotherapy"
                      ? LangProvider.Physiotherapist[languageIndex]
                      : providerType == "caregiver"
                        ? LangProvider.Nurse_assistant[languageIndex]
                        : providerType == "babysitter"
                          ? LangProvider.BabyCare[languageIndex]
                          : providerType == "doctor"
                            ? LangProvider.Doctor[languageIndex]
                            : LangProvider.Lab[languageIndex]) + ' ' + LangProvider.Booking[languageIndex]
                  }
                </Text>
                <View style={{ height: '40%', borderWidth: 0.8, borderColor: Colors.backgroundcolor }}></View>
                <Text
                  style={{
                    fontFamily: Font.Regular,
                    fontSize: Font.small,
                    color: Colors.White,
                    paddingLeft: s(12),
                  }}>
                  {LangProvider.RootsCare[languageIndex]}
                </Text>
              </View>

              <View style={{ width: '30%', height: '100%', justifyContent: 'center' }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setState({ modalVisible: true })}
                >
                  <Text
                    style={{
                      fontFamily: Font.Medium,
                      fontSize: Font.small,
                      alignSelf: 'flex-start',
                      color: Colors.White,
                      alignSelf: 'flex-end'
                    }}>
                    {LangProvider.Howitworks[languageIndex]}
                  </Text>
                </TouchableOpacity>
              </View>

            </View>

            {/* -----------------Available--------------- */}

            {
              provider_details?.available_package &&
              <View style={styles.availableContainer}>
                <View style={{ width: "100%", flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: s(11) }}>
                  <Text
                    style={{
                      alignSelf: 'flex-start',
                      fontFamily: Font.Regular,
                      fontSize: Font.xlarge,
                      color: Colors.darkText
                    }}
                  >

                    {LangProvider.HealthPackages[languageIndex]}
                  </Text>
                  <Text
                    onPress={() => {
                      navigation.navigate(
                        "LabPackageListing",
                        { providerId: providerId }
                      );
                    }}
                    style={{
                      fontFamily: Font.Medium,
                      fontSize: Font.medium,
                      color: Colors.Blue,
                    }}
                  >
                    {LangProvider.See_all[languageIndex]}
                  </Text>

                </View>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  // data={[1, 2, 3, 4]}
                  data={provider_details?.available_package}
                  contentContainerStyle={{ paddingHorizontal: s(14), marginTop: vs(15) }}
                  ItemSeparatorComponent={() => {
                    return (
                      <View style={{ width: s(8) }}>

                      </View>
                    )
                  }}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate(
                            "LabPackageDetails",
                            {
                              packageId: item.pid,
                              providerId: providerId,
                            })
                        }}
                        style={[
                          {
                            borderRadius: 10,
                            width: s(135),
                            // height: vs(150),
                            backgroundColor: Colors.White,
                            borderColor: Colors.Border,
                            borderWidth: 1,
                            paddingHorizontal: s(6),
                            paddingVertical: vs(7)
                          }]}>
                        <Text
                          style={{
                            fontFamily: Font.Regular,
                            alignSelf: 'flex-start',
                            fontSize: Font.small,
                            color: Colors.detailTitles
                          }}>{item?.name}</Text>

                        <Text
                          style={{
                            fontFamily: Font.Regular,
                            alignSelf: 'flex-start',
                            fontSize: Font.small,
                            color: Colors.Blue,
                            marginTop: vs(5)
                          }}>{item?.iso_certificate}</Text>


                        <View style={{ width: '92%', height: 1.5, backgroundColor: Colors.backgroundcolor, marginVertical: vs(10), alignSelf: 'center' }}></View>

                        <Text
                          style={{
                            paddingVertical: vs(3),
                            fontFamily: Font.Regular,
                            alignSelf: 'flex-start',
                            color: Colors.Green,
                            fontSize: Font.small,
                          }}
                        >
                          {item.dis_off}
                        </Text>

                        <Text
                          style={{
                            fontFamily: Font.Regular,
                            alignSelf: 'flex-start',
                            fontSize: Font.small,
                            textDecorationLine: "line-through",
                            textDecorationStyle: "solid",
                            color: Colors.Black
                          }}
                        >
                          {item.maxprice}
                        </Text>


                        <View
                          style={{
                            paddingVertical: (windowWidth * 2) / 100,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItem: "center",
                          }}>
                          <Text
                            style={{
                              alignSelf: 'flex-start',
                              fontFamily: Font.Medium,
                              fontSize: Font.medium,
                            }}>
                            {item.price}
                          </Text>

                          <Text
                            onPress={() => {
                              // console.log(item.pid );
                              if (guest) {
                                dispatch(SelectedProvider({
                                  currentScreen: 'providerList',
                                }))
                                setTimeout(() => {
                                  navigation.navigate("AuthStack")
                                }, 250);
                              } else {
                                dispatch(SelectedProvider({
                                  currentScreen: 'providerDetails',
                                  providerType: providerType,
                                  providerId: providerId,
                                  isFromHospital: isFromHospital,
                                  hospitalId: hospitalId,
                                  bookingType: 'package',
                                  docType: '',
                                  packageId: item.pid
                                }))
                                setTimeout(() => {
                                  navigation.navigate("HealthRecord")
                                }, 250);
                              }
                            }}
                            style={{
                              fontFamily: Font.SemiBold,
                              fontSize: Font.medium,
                              color: Colors.Theme,
                              textTransform: "uppercase",
                            }}
                          >
                            {LangProvider.Book[languageIndex]}
                          </Text>
                        </View>

                      </TouchableOpacity>
                    );
                  }}
                />

              </View>

            }

            {
              provider_details?.available_provider &&
              <View style={styles.availableContainer}>
                <View style={{ width: "100%", flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: s(11) }}>
                  <Text
                    style={{
                      alignSelf: 'flex-start',
                      fontFamily: Font.Regular,
                      fontSize: Font.xlarge,
                      color: Colors.darkText
                    }}
                  >
                    {`${providerType === 'nurse' ? LangProvider.AvailableNurse[languageIndex] : providerType === 'physiotherapy' ? LangProvider.Availablephysotharpst[languageIndex] : providerType === 'caregiver' ? LangProvider.Availableassistent[languageIndex] : providerType === 'babysitter' ? LangProvider.Availablebabycare[languageIndex] : providerType === 'doctor' ? LangProvider.AvailableDoctor[languageIndex] : LangProvider.AvailableLab[languageIndex]}`}
                  </Text>
                  <TouchableOpacity onPress={() => navigation.pop()}>
                    <Text
                      style={{
                        fontFamily: Font.Medium,
                        fontSize: Font.medium,
                        color: Colors.Blue,
                      }}
                    >
                      {LangProvider.See_all[languageIndex]}
                    </Text>
                  </TouchableOpacity>

                </View>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  data={provider_details?.available_provider}
                  // data={[1, 2, 3, 4, 5, 6]}
                  contentContainerStyle={{ paddingHorizontal: s(14), marginTop: vs(15) }}
                  ItemSeparatorComponent={() => {
                    return (
                      <View style={{ width: s(8) }}>

                      </View>
                    )
                  }}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          getAvailableProviderDetails(item?.user_id)
                        }}
                        style={[
                          {
                            borderRadius: 10,
                            width: s(135),
                            height: vs(150),
                            backgroundColor: Colors.White,
                            borderColor: Colors.Border,
                            borderWidth: 1,
                          }]}>

                        <View style={{ height: '60%', width: '100%', backgroundColor: Colors.backgroundcolor, borderRadius: 9 }}>
                          <ImageBackground
                            source={{ uri: config.img_url3 + item.image }}
                            style={{ height: '100%', width: '100%' }}
                            imageStyle={{ borderTopLeftRadius: 9, borderTopRightRadius: 9 }}
                          />
                        </View>

                        <View style={{ height: '40%', paddingHorizontal: s(6), justifyContent: 'center' }}>
                          {
                            (item?.provider_name) ?
                              <Text
                                style={{
                                  color: Colors.detailTitles,
                                  fontFamily: Font.Medium,
                                  fontSize: Font.small,
                                  alignSelf: 'flex-start',
                                }}>
                                {item?.provider_name}
                              </Text>
                              :
                              null
                          }

                          {
                            (item?.iso_text) ?
                              <Text
                                style={{
                                  color: Colors.Theme,
                                  fontFamily: Font.Regular,
                                  fontSize: Font.xsmall,
                                  alignSelf: 'flex-start',
                                  marginTop: vs(3)
                                }}>
                                {item?.iso_text}
                              </Text>
                              :
                              null
                          }

                          {
                            (item?.qualification) ?
                              <Text
                                style={{
                                  color: Colors.lightGrey,
                                  fontFamily: Font.Regular,
                                  fontSize: Font.xsmall,
                                  alignSelf: 'flex-start',
                                  marginTop: vs(3)
                                }}>
                                {item?.qualification}
                              </Text>
                              :
                              null
                          }

                          {
                            (item?.speciality) ?
                              <Text
                                style={{
                                  color: Colors.Blue,
                                  fontFamily: Font.Regular,
                                  fontSize: Font.xsmall,
                                  alignSelf: 'flex-start',
                                  marginTop: vs(6)
                                }}>
                                {item?.speciality}
                              </Text>
                              :
                              null
                          }
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />

              </View>

            }

            <TabbyProductSnippetCreditCard
              lang={languageIndex == 0 ? 'en' : "ar"}
              currency={loggedInUserDetails.currency_symbol}
              price={'0'}
              containerStyle={{ marginBottom: vs(30), marginTop: vs(7) }}
            />

          </ScrollView>
      }



      <AboutAppBottomSheet
        visible={modalVisible}
        onRequestClose={() => {
          setState({ modalVisible: false })
        }}
        data={statesData.how_work_value}
      />

      <NoInternet
        visible={!deviceConnection}
      />
    </View>
  );

}


const styles = StyleSheet.create({

  infoContainer: {
    paddingTop: vs(11),
    backgroundColor: Colors.White,
    marginTop: vs(7),
    // shadowColor: Colors.Black,
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 0.3,
    // shadowRadius: 3,
    zIndex: 999
  },
  experienceContainer: {
    width: '100%',
    paddingVertical: vs(18),
    flexDirection: 'row',
    paddingHorizontal: s(11),
  },
  descContainer: {
    borderBottomWidth: 1.5,
    borderTopWidth: 1.5,
    borderBottomColor: Colors.backgroundcolor,
    borderTopColor: Colors.backgroundcolor,
    paddingTop: vs(11),
    paddingBottom: vs(15),
    paddingHorizontal: s(11),
  },
  timeContainer: {
    flexDirection: 'row',
    marginTop: vs(11),
    paddingHorizontal: s(11),
  },
  btnContainer: {
    paddingVertical: vs(17),
    width: '90%',
    alignSelf: 'center'
  },
  aboutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: vs(30),
    width: '100%',
    backgroundColor: Colors.orange,
    paddingHorizontal: s(11),
  },
  availableContainer: {
    marginTop: vs(7),
    paddingVertical: vs(14),
    backgroundColor: Colors.White,
    // shadowColor: Colors.Black,
    // shadowOffset: { width: 1, height: 1.5 },
    // shadowOpacity: 0.2,
    // shadowRadius: 3,
  }


})
