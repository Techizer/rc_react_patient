import React, { Component, useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Keyboard,
  Modal,
  Platform,
} from "react-native";
import {
  Colors,
  Font,
  config,
  LangProvider,
  apifuntion,
  ScreenHeader,
  windowWidth
} from "../Provider/Utils/Utils";

import { leftArrow, Notification } from "../Icons/Index";
import { s, vs } from "react-native-size-matters";
import ServiceProviderContainer from "../components/ServiceProviderContainer";
import SearchInput from "../components/SearchInput";
import FilterBottomSheet from "../components/FilterBottomSheet";
import { useSelector } from "react-redux";
import BookingTypePopup from "../components/BookingTypePopup";
import NoInternet from "../components/NoInternet";

const AllServiceProviderListing = ({ navigation, route }) => {

  const { pass_status, enableFor } = route.params || ''
  const { address, loggedInUserDetails, guest, appLanguage, languageIndex, deviceConnection } = useSelector(state => state.StorageReducer)

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [providersData, setProvidersData] = useState({
    message: "",
    searchProvider: "",
    isHospitalDoctorList: false,
    specialtyData: "",
    specialtyArr: [],
    specialtyModal: false,
    providersList: [1, 2, 3, 4, 5, 6, 7],
    isLoading: true,
    isFilter: false,
    isSearch: false,
    languageIndex: appLanguage == 'ar' ? 1 : 0,
  })
  const insets = useSafeAreaInsets()
  useEffect(() => {
    if (!guest && deviceConnection) {
      getProvidersList()
    }
  }, [deviceConnection, isRefreshing])

  const getProvidersList = async (search = null) => {
    if (search != '' && search != null) {
      setProvidersData(prevState => ({
        ...prevState,
        isLoading: true,
        providersList: [1, 2, 3, 4, 5, 6, 7],
        isSearch: true,
      }))
    }

    let url =
      config.baseURL + "api-patient-service-provider-list"

    var data = new FormData();
    if (pass_status === "doctor") {
      data.append("docEnableFor", enableFor);
    }
    if (guest) {
      data.append("login_user_id", 0);
      data.append("service_type", pass_status);
      data.append("provider_name", "");
      data.append("device_lang", appLanguage == 'en' ? 'ENG' : 'Ar');
      data.append("latitude", address.latitude);
      data.append("longitudes", address.longitude);
      data.append("page_count", 1);
    } else {
      data.append("login_user_id", loggedInUserDetails.user_id);
      data.append("service_type", pass_status);
      data.append("work_area", loggedInUserDetails.work_area);
      data.append("page_count", 1);

      // --------When Search anything--------
      if (search != '' && search != null) {
        data.append("provider_name", providersData.searchProvider);
      } else {
        data.append("provider_name", '');
      }
    }
    // console.log(data);
    // return
    apifuntion.postApi(url, data, 1).then((res) => {
      // console.log("get_Services-response ", res)
      if (res.status == true) {
        setIsRefreshing(false)
        setTimeout(() => {
          setProvidersData(prevState => ({
            ...prevState,
            providersList: res.result,
            message: res.message,
            isLoading: false

          }))
        }, 1000);

        //   if (this.state.pass_status !== "hospital") {
        //     let hour_task = obj.result;
        //     if (obj.result != null && obj.result != "") {
        //       for (let k = 0; k < obj.result.length; k++) {
        //         let availability = hour_task[k].availability;
        //         for (let l = 0; l < availability.length; l++) {
        //           hour_task[k].availability[l] = availability[l].slot_day;
        //         }
        //         hour_task[k].new_availablity = hour_task[k].availability.toString();
        //       }
        //     }
        //     console.log("hour_task", hour_task);
        //     this.setState({ nurse_data: hour_task });
        //   }
        // } else {
        //   this.setState({ nurse_data: obj.result, message: obj.message });
        //   return false;

      } else {
        setProvidersData(prevState => ({
          ...prevState,
          providersList: [],
          message: res.message,
          isLoading: false

        }))
      }
    })
      .catch((error) => {
        setProvidersData(prevState => ({
          ...prevState,
          providersList: [],
          isLoading: false
        }))
        console.log("getProvidersList-error ------- " + error);
      });
  };

  const listHeader = (type) => {
    return (
      <SearchInput
        placeholder={
          type == "nurse"
            ? LangProvider.SearchNurse[languageIndex]
            : type == "physiotherapy"
              ? LangProvider.Searchphysi[languageIndex]
              : type == "caregiver"
                ? LangProvider.Searchseassistent[languageIndex]
                : type == "babysitter"
                  ? LangProvider.SearchBabyCare[languageIndex]
                  : type == "doctor"
                    ? LangProvider.SearchDoctor[languageIndex]
                    : type == "hospital"
                      ? LangProvider.SearchHospital[languageIndex]
                      : LangProvider.SearchLab[languageIndex]
        }
        onChangeText={(val) => {
          setProvidersData(prevState => ({
            ...prevState,
            searchProvider: val
          }))
        }}
        value={providersData.searchProvider}
        onSubmitEditing={() => {
          Keyboard.dismiss();
        }}
        onPressSearch={() => getProvidersList(providersData.searchProvider)}
        onCrossPress={() => {
          setProvidersData(prevState => ({
            ...prevState,
            isSearch: false,
            isLoading: true,
            searchProvider: '',
            providersList: [1, 2, 3, 4, 5, 6, 7]
          }))
          getProvidersList(null)
        }}
        isSearch={providersData.isSearch}
        onFilterPress={() => {
          setProvidersData(prevState => ({
            ...prevState,
            isFilter: true
          }))
        }}
      />
    )
  }

  return (
    <View style={{ backgroundColor: Colors.backgroundcolor, flex: 1, }}>
      <ScreenHeader
        title={
          pass_status == "nurse"
            ? LangProvider.Nurse[languageIndex]
            : pass_status == "physiotherapy"
              ? LangProvider.Physiotherapist[languageIndex]
              : pass_status == "caregiver"
                ? LangProvider.Nurse_assistant[languageIndex]
                : pass_status == "babysitter"
                  ? LangProvider.BabyCare[languageIndex]
                  : pass_status == "doctor"
                    ? LangProvider.Doctor[languageIndex]
                    : LangProvider.Lab[languageIndex]
        }
        navigation={navigation}
        onBackPress={() => navigation.pop()}
        leftIcon
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={providersData.providersList}
        keyExtractor={(item, index) => `Provider ${index}`}
        ListHeaderComponent={providersData.providersList.length > 0 ? listHeader(pass_status) : null}
        contentContainerStyle={{ paddingBottom: (windowWidth * 15) / 100 }}
        ListEmptyComponent={() => {
          return (
            <View style={{ marginTop: vs(140), alignSelf: 'center', paddingHorizontal: '10%' }}>
              <Text style={{
                fontSize: Font.xlarge,
                fontFamily: Font.Regular,
                color: Colors.darkText,
                textAlign: 'center'
              }}>{
                  pass_status == "nurse"
                    ? LangProvider.noNursesTitle[languageIndex]
                    : pass_status == "physiotherapy"
                      ? LangProvider.noPhysiotherapistsTitle[languageIndex]
                      : pass_status == "caregiver"
                        ? LangProvider.noNurseAssisTitle[languageIndex]
                        : pass_status == "babysitter"
                          ? LangProvider.noBabyCareTitle[languageIndex]
                          : pass_status == "doctor"
                            ? LangProvider.noDocsTitle[languageIndex]
                            : LangProvider.noLabsTitle[languageIndex]
                }</Text>
              <Text style={{
                fontSize: Font.medium,
                fontFamily: Font.Regular,
                color: Colors.lightGrey,
                textAlign: 'center',
                marginTop: vs(10)
              }}>{
                  pass_status == "nurse"
                    ? LangProvider.noNursesDesc[languageIndex]
                    : pass_status == "physiotherapy"
                      ? LangProvider.noPhysiotherapistsDesc[languageIndex]
                      : pass_status == "caregiver"
                        ? LangProvider.noNurseAssisDesc[languageIndex]
                        : pass_status == "babysitter"
                          ? LangProvider.noBabyCareDesc[languageIndex]
                          : pass_status == "doctor"
                            ? LangProvider.noDocsDesc[languageIndex]
                            : LangProvider.noLabsDesc[languageIndex]
                }</Text>
            </View>
          )
        }}
        renderItem={({ item, index }) => {
          return (
            <ServiceProviderContainer
              Item={item}
              navigation={navigation}
              isLoading={providersData.isLoading}
              providerType={pass_status}
              Index={index}
              docType={enableFor}
            />
          );
        }}
        refreshing={isRefreshing}
        onRefresh={() => setIsRefreshing(true)}
      />

      <NoInternet
        visible={!deviceConnection}
      />
      {/* <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.specialtyModal}
          onRequestClose={() => { }}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              this.setState({ specialtyModal: false });
            }}
            style={{
              flex: 1,
              alignSelf: "center",
              justifyContent: "center",
              backgroundColor: "#00000080",
              width: "100%",
            }}
          >
            <View
              style={{
                width: "70%",
                backgroundColor: "White",
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
              }}
            >
              <View
                style={{
                  width: "100%",
                  backgroundColor: Colors.backgroundcolorblue,
                  paddingVertical: (windowWidth * 2) / 100,
                }}
              >
                <Text
                  style={{
                    paddingLeft: (windowWidth * 4.5) / 100,
                    paddingRight: (windowWidth * 4.5) / 100,
                    textAlign: config.textRotate,
                    fontFamily: Font.Regular,
                    fontSize: (windowWidth * 4) / 100,
                    color: Colors.White,
                  }}
                >
                  {LangProvider.selectSpecialty[config.language]}
                </Text>
              </View>

              <View style={{ width: "100%", alignSelf: "center" }}>
                <FlatList
                  contentContainerStyle={{ paddingBottom: (windowWidth * 2) / 100 }}
                  data={this.state.specialtyArr}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          this.setState(
                            {
                              specialtyModal: false,
                              specialtyData: item.name,
                            },
                            () => {
                              this.getHospitalDoctorList();
                            }
                          );
                        }}
                      >
                        <View
                          style={{
                            width: "100%",
                            backgroundColor: "#fff",
                            alignSelf: "center",
                            justifyContent: "flex-end",
                          }}
                        >
                          <View
                            style={[
                              {
                                width: "95%",
                                borderBottomWidth: 1,
                                paddingVertical: (windowWidth * 2) / 100,
                                marginLeft: (windowWidth * 5) / 100,
                              },
                              item.line == 0
                                ? { borderBottomColor: "#0000001F" }
                                : { borderBottomColor: "#fff" },
                            ]}
                          >
                            <Text
                              style={{
                                color: Colors.Black,
                                fontSize: (windowWidth * 4) / 100,
                                paddingLeft: (windowWidth * 2) / 100,
                                textAlign: config.textRotate,
                              }}
                            >
                              {item.name}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </View>
          </TouchableOpacity>
        </Modal> */}

      {/* <FilterBottomSheet
        visible={providersData.isFilter}
        onRequestClose={() => {
          setProvidersData(prevState => ({
            ...prevState,
            isFilter: false
          }))
        }}
      /> */}


    </View >
  );

}

export default AllServiceProviderListing;