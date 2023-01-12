import React, { Component, useEffect, useState } from "react";
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
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Colors,
  Font,
  msgProvider,
  config,
  windowWidth,
  ScreenHeader,
  consolepro,
  Lang_chg,
  apifuntion,
  Button
} from "../Provider/utilslib/Utils";
import { Clock, dummyDoc, dummyUser, GoldStar, leftArrow, Notification } from "../Icons/Index";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import AboutAppBottomSheet from '../components/AboutAppBottomSheet'
import { useSelector } from "react-redux";



export default ServiceProviderDetails = ({ navigation, route }) => {

  const { loggedInUserDetails, address, guest, appLanguage } = useSelector(state => state.StorageReducer)

  const [statesData, setStatesData] = useState({
    isLoading: true,
    languageIndex: appLanguage == 'en' ? 0 : 1,
    providerType: route?.params?.providerType,
    providerId: route?.params?.providerId,
    isFromHospital: route?.params?.isFromHospital,
    hospitaId: route?.params?.hospitalId,
    provider_details: "",
    message: "",
    modalVisible: false,
    modal2Visible: false,
    how_work_value: "",
    available_days: "",
    availability_arr: []
  })
  const insets = useSafeAreaInsets()
  useEffect(() => {
    get_Services()
  }, [])

  const setState = payload => {
    setStatesData(prev => ({
      ...prev,
      ...payload
    }))
  }

  const setModalVisible = (visible) => {
    setState({ modalVisible: visible });
  };

  const getAvailableProviderDetails = async (userId) => {
    setState({
      isLoading: true
    });
    let url = config.baseURL + "api-patient-service-provider-details";

    var data = new FormData();
    data.append("id", userId);
    data.append("login_user_id", loggedInUserDetails.user_id);
    data.append("service_type", statesData.providerType);
    data.append("work_area", loggedInUserDetails.work_area);

    // consolepro.consolelog("get_Services-query-data......", data);
    // return false
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        consolepro.consolelog("get_Service-details-response", JSON.stringify(obj));

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
          // consolepro.consolelog("how_work", how_work);

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
        consolepro.consolelog("-------- error ------- " + error);
      });
  };

  const get_Services = async () => {
    let url = config.baseURL + "api-patient-service-provider-details";
    var data = new FormData();
    if (guest == true) {
      console.log('if');
      data.append("id", statesData.providerId);
      data.append("login_user_id", 0);
      data.append("service_type", statesData.providerType);
      data.append("device_lang", statesData.languageIndex == 0 ? 'ENG' : 'AR');
      data.append("latitude", address?.latitude);
      data.append("longitudes", address?.longitude);
    } else {
      data.append("id", statesData.providerId);
      data.append("login_user_id", loggedInUserDetails.user_id);
      data.append("service_type", statesData.providerType);
      data.append("work_area", loggedInUserDetails.work_area);
    }
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        // consolepro.consolelog("get_Service-details-response", JSON.stringify(obj));

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
          // consolepro.consolelog("how_work", how_work);

          let result_new = how_work.replace('<font color="#0888D1">', "");
          result_new = result_new.replace("<h4>", '<h4 color="#0168b3">');
          result_new = result_new.replace(/<\/h5>/g, "</h5><br>");
          let result_new_tag = result_new.replace(/<\/p><p>/g, "</p>");
          htmlData = htmlData + result_new_tag + htmlDataClosed;

          // consolepro.consolelog("htmlData", htmlData);
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
        consolepro.consolelog("get_Services-error ------- " + error);
      });
  };


  const { modalVisible, provider_details, available_days, providerType, providerId, isFromHospital, hospitaId } = statesData;
  return (
    <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor, paddingBottom: insets.bottom }}>

      <ScreenHeader
        title={
          statesData.providerType == "nurse"
            ? Lang_chg.Nurse[statesData.languageIndex]
            : statesData.providerType == "physiotherapy"
              ? Lang_chg.Physiotherapist[statesData.languageIndex]
              : statesData.providerType == "caregiver"
                ? Lang_chg.Nurse_assistant[statesData.languageIndex]
                : statesData.providerType == "babysitter"
                  ? Lang_chg.Babysitter[statesData.languageIndex]
                  : statesData.providerType == "doctor"
                    ? Lang_chg.Doctor[statesData.languageIndex]
                    : Lang_chg.Lab[statesData.languageIndex]
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
                <View style={{ flex: 1, borderEndWidth: 1, borderEndColor: Colors.backgroundcolor }}>
                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item width={(windowWidth * 20) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                  </SkeletonPlaceholder>
                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item width={(windowWidth * 15) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} style={{ marginTop: vs(7) }} />
                  </SkeletonPlaceholder>
                </View>

                <View style={{ flex: 1, borderEndWidth: 1, borderEndColor: Colors.backgroundcolor }}>
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


            {/* <View style={[styles.aboutContainer, { backgroundColor: Colors.White }]}>

              <View style={{ flexDirection: 'row', width: '70%', height: '100%', alignItems: 'center' }}>
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width={(windowWidth * 7) / 100} height={(windowWidth * 7) / 100} borderRadius={s(20)} />
                </SkeletonPlaceholder>
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width={(windowWidth * 15) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                </SkeletonPlaceholder>
                <View style={{ height: '40%', borderWidth: 0.8, borderColor: Colors.backgroundcolor }}></View>
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width={(windowWidth * 15) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                </SkeletonPlaceholder>
              </View>

              <View style={{ width: '30%', height: '100%', justifyContent: 'center' }}>
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width={(windowWidth * 15) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                </SkeletonPlaceholder>
              </View>

            </View> */}

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
                  <Text
                    style={{
                      fontFamily: Font.Medium,
                      fontSize: Font.small,
                      alignSelf: 'flex-start',
                      color: Colors.Blue,
                      marginTop: vs(5)
                    }}>
                    {providerType === 'lab' ? provider_details?.iso_text : provider_details.speciality}
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
                    {providerType === 'lab' ? Lang_chg.ESTABLISHED[statesData.languageIndex] : Lang_chg.Experience[statesData.languageIndex]}
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
                    {Lang_chg.Bookings[statesData.languageIndex]}
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
                    {Lang_chg.Rating[statesData.languageIndex]}
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



                {
                  (providerType === "doctor" && isFromHospital) ?
                    <Button
                      text={Lang_chg.BookOnlineAppointment[statesData.languageIndex]}
                      btnStyle={{ marginTop: 0, backgroundColor: Colors.Green }}
                      onPress={() => {

                        if (global.isLogin == false) {
                          global.isPage = "providerDetails"
                          navigation.navigate("AuthStack", {
                            providerType: providerType,
                            providerId: providerId,
                            display: "taskbooking",
                            isFromHospital: isFromHospital,
                            hospitalId: hospitaId,
                            indexPosition: 0,
                            isPage: 'providerDetails'
                          })
                        } else {
                          //HealthRecord
                          navigation.navigate("HealthRecord", {
                            providerType: providerType,
                            providerId: providerId,
                            display: "taskbooking",
                            isFromHospital: isFromHospital,
                            hospitalId: hospitaId,
                            indexPosition: 0,
                            isPage: 'providerDetails'
                          })
                        }
                      }}
                    />
                    :
                    (providerType === "doctor") ?
                      <Button
                        text={Lang_chg.BookOnlineAppointment[statesData.languageIndex]}
                        btnStyle={{ marginTop: 0, backgroundColor: Colors.Green }}
                        onPress={() => {
                          if (global.isLogin == false) {
                            global.isPage = "providerDetails"
                            // navigation.push("Login");
                            navigation.navigate("AuthStack", {
                              providerType: providerType,
                              providerId: providerId,
                              display: "taskbooking",
                              isFromHospital: isFromHospital,
                              hospitalId: hospitaId,
                              indexPosition: 0
                            })
                          } else {
                            navigation.navigate("HealthRecord", {
                              providerType: providerType,
                              providerId: providerId,
                              display: "taskbooking",
                              isFromHospital: isFromHospital,
                              hospitalId: hospitaId,
                              indexPosition: 0,
                              isPage: 'providerDetails'
                            })
                          }
                        }}
                      />
                      :
                      (providerType === "lab") ?
                        <Button
                          text={Lang_chg.BOOKLABTESTAPPOINTMENT[statesData.languageIndex]}
                          btnStyle={{ marginTop: 0, backgroundColor: Colors.Green }}
                          onPress={() => {
                            if (global.isLogin == false) {
                              global.isPage = "providerDetails"
                              navigation.navigate("AuthStack", {
                                providerType: providerType,
                                providerId: providerId,
                                display: "testBooking",
                                indexPosition: 0
                              })
                            } else {
                              navigation.navigate("HealthRecord", {
                                providerType: providerType,
                                providerId: providerId,
                                display: "testBooking",
                                indexPosition: 0,
                                isPage: 'providerDetails'
                              })
                            }
                          }}
                        />
                        :
                        provider_details?.task_base_enable == 0 ? (
                          <Button
                            text={Lang_chg.BOOKTASKBASEDAPPOINTMENT[statesData.languageIndex]}
                            btnStyle={{ marginTop: 0, backgroundColor: Colors.Green }}
                            onPress={() => {
                              if (global.isLogin == false) {
                                global.isPage = "providerDetails"
                                navigation.navigate("AuthStack", {
                                  providerType: providerType,
                                  providerId: providerId,
                                  display: "taskbooking",
                                  indexPosition: 0
                                })
                              } else {
                                navigation.navigate("HealthRecord", {
                                  providerType: providerType,
                                  providerId: providerId,
                                  display: "taskbooking",
                                  isPage: 'providerDetails'
                                })
                              }
                            }}
                          />
                        )
                          : null


                }
                {
                  (providerType === "doctor" && !isFromHospital) ? (
                    <Button
                      text={Lang_chg.BookHomeVisitAppointment[statesData.languageIndex]}
                      btnStyle={{ marginTop: 10, backgroundColor: Colors.Theme }}
                      onPress={() => {
                        if (global.isLogin == false) {
                          global.isPage = "providerDetails"
                          navigation.navigate("AuthStack", {
                            providerType: statesData.providerType,
                            providerId: providerId,
                            display: "hourlybooking",
                            isFromHospital: isFromHospital,
                            hospitalId: hospitaId,
                            indexPosition: 1
                          })
                        } else {
                          navigation.navigate("HealthRecord", {
                            providerType: providerType,
                            providerId: providerId,
                            display: "hourlybooking",
                            indexPosition: 1,
                            isPage: 'providerDetails'
                          })
                        }
                      }}
                    />
                  )
                    :
                    (
                      provider_details?.hour_base_enable == 0 && (
                        <Button
                          text={Lang_chg.BOOKHOURLYAPPOINTMENT[statesData.languageIndex]}
                          btnStyle={{ marginTop: 10, backgroundColor: Colors.Theme }}
                          onPress={() => {
                            if (global.isLogin == false) {
                              global.isPage = "providerDetails"
                              navigation.navigate("AuthStack", {
                                providerType: providerType,
                                providerId: providerId,
                                display: "hourlybooking",
                                isFromHospital: isFromHospital,
                                hospitalId: hospitaId,
                                indexPosition: 0
                              })
                            } else {
                              navigation.navigate("HealthRecord", {
                                providerType: providerType,
                                providerId: providerId,
                                display: "hourlybooking",
                                isFromHospital: isFromHospital,
                                hospitalId: hospitaId,
                                indexPosition: 0,
                                isPage: 'providerDetails'
                              })
                            }
                          }}
                        />
                      )
                    )
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
                  {(statesData.providerType == "nurse"
                    ? Lang_chg.Nurse[statesData.languageIndex]
                    : statesData.providerType == "physiotherapy"
                      ? Lang_chg.Physiotherapist[statesData.languageIndex]
                      : statesData.providerType == "caregiver"
                        ? Lang_chg.Nurse_assistant[statesData.languageIndex]
                        : statesData.providerType == "babysitter"
                          ? Lang_chg.Babysitter[statesData.languageIndex]
                          : statesData.providerType == "doctor"
                            ? Lang_chg.Doctor[statesData.languageIndex]
                            : Lang_chg.Lab[statesData.languageIndex]) + ' ' + Lang_chg.Booking[statesData.languageIndex]
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
                  {Lang_chg.RootsCare[statesData.languageIndex]}
                </Text>
              </View>

              <View style={{ width: '30%', height: '100%', justifyContent: 'center' }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setModalVisible(true)}
                >
                  <Text
                    style={{
                      fontFamily: Font.Medium,
                      fontSize: Font.small,
                      alignSelf: 'flex-start',
                      color: Colors.White,
                      alignSelf: 'flex-end'
                    }}>
                    {Lang_chg.Howitworks[statesData.languageIndex]}
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

                    {Lang_chg.HealthPackages[statesData.languageIndex]}
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
                    {Lang_chg.See_all[statesData.languageIndex]}
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
                              if (global.isLogin == false) {
                                global.isPage = "providerDetails"
                                // navigation.push("Login");
                                navigation.navigate("AuthStack", {
                                  providerType: providerType,
                                  providerId: providerId,
                                  display: "packageBooking",
                                  // isFromHospital: true,
                                  // hospitalId: Item?.hospital_id,
                                  indexPosition: 0
                                })
                              } else {
                                navigation.navigate(
                                  "Booking",
                                  {
                                    providerType: providerType,
                                    nurse_id: providerId,
                                    display: "packageBooking",
                                    indexPosition: 1,
                                  }
                                );
                              }
                            }}
                            style={{
                              fontFamily: Font.SemiBold,
                              fontSize: Font.medium,
                              color: Colors.Theme,
                              textTransform: "uppercase",
                            }}
                          >
                            {Lang_chg.Book[statesData.languageIndex]}
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
                    {`${providerType === 'nurse' ? Lang_chg.AvailableNurse[statesData.languageIndex] : providerType === 'physiotherapy' ? Lang_chg.Availablephysotharpst[statesData.languageIndex] : providerType === 'caregiver' ? Lang_chg.Availableassistent[statesData.languageIndex] : providerType === 'babysitter' ? Lang_chg.Availablebabysitter[statesData.languageIndex] : providerType === 'doctor' ? Lang_chg.AvailableDoctor[statesData.languageIndex] : Lang_chg.AvailableLab[statesData.languageIndex]}`}
                  </Text>
                  <TouchableOpacity onPress={() => navigation.pop()}>
                    <Text
                      style={{
                        fontFamily: Font.Medium,
                        fontSize: Font.medium,
                        color: Colors.Blue,
                      }}
                    >
                      {Lang_chg.See_all[statesData.languageIndex]}
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


          </ScrollView>
      }



      <AboutAppBottomSheet
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
        data={statesData.how_work_value}
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
