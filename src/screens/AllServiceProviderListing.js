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
  Lang_chg,
  apifuntion,
  ScreenHeader
} from "../Provider/utilslib/Utils";

import { leftArrow, Notification } from "../Icons/Index";
import { s, vs } from "react-native-size-matters";
import ServiceProviderContainer from "../components/ServiceProviderContainer";
import SearchInput from "../components/SearchInput";
import FilterBottomSheet from "../components/FilterBottomSheet";
import { useSelector } from "react-redux";

const AllServiceProviderListing = ({ navigation, route }) => {

  const { pass_status, enableFor } = route.params || ''
  const { address, loggedInUserDetails, guest, appLanguage, contentAlign, } = useSelector(state => state.StorageReducer)

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
    getProvidersList()
  }, [])
  const getProvidersList = async (search = null) => {
    console.log(search);
    if (search != '' && search != null) {
      console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
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
      data.append("latitude", address?.latitude);
      data.append("longitudes", address?.longitude);
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
    console.log(data);
    // return
    apifuntion.postApi(url, data, 1).then((res) => {
      console.log("get_Services-response ", res)
      if (res.status == true) {
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
        console.log("-------- error ------- " + error);
      });
  };

  const listHeader = (type) => {
    return (
      <SearchInput
        placeholder={
          type == "nurse"
            ? Lang_chg.SearchNurse[providersData.languageIndex]
            : type == "physiotherapy"
              ? Lang_chg.Searchphysi[providersData.languageIndex]
              : type == "caregiver"
                ? Lang_chg.Searchseassistent[providersData.languageIndex]
                : type == "babysitter"
                  ? Lang_chg.SearchBabysitter[providersData.languageIndex]
                  : type == "doctor"
                    ? Lang_chg.SearchDoctor[providersData.languageIndex]
                    : type == "hospital"
                      ? Lang_chg.SearchHospital[providersData.languageIndex]
                      : Lang_chg.SearchLab[providersData.languageIndex]
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
    <View style={{ backgroundColor: Colors.backgroundcolor, flex: 1, paddingBottom: insets.bottom }}>
      <ScreenHeader
        title={
          pass_status == "nurse"
            ? Lang_chg.Nurse[providersData.languageIndex]
            : pass_status == "physiotherapy"
              ? Lang_chg.Physiotherapist[providersData.languageIndex]
              : pass_status == "caregiver"
                ? Lang_chg.Nurse_assistant[providersData.languageIndex]
                : pass_status == "babysitter"
                  ? Lang_chg.Babysitter[providersData.languageIndex]
                  : pass_status == "doctor"
                    ? Lang_chg.Doctor[providersData.languageIndex]
                    : Lang_chg.Lab[providersData.languageIndex]
        }
        navigation={navigation}
        onBackPress={() => navigation.pop()}
        leftIcon
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={providersData.providersList}
        keyExtractor={(item, index) => `Provider ${index}`}
        ListHeaderComponent={listHeader(pass_status)}
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
                    ? Lang_chg.noNursesTitle[providersData.languageIndex]
                    : pass_status == "physiotherapy"
                      ? Lang_chg.noPhysiotherapistsTitle[providersData.languageIndex]
                      : pass_status == "caregiver"
                        ? Lang_chg.noNurseAssisTitle[providersData.languageIndex]
                        : pass_status == "babysitter"
                          ? Lang_chg.noBabySitterTitle[providersData.languageIndex]
                          : pass_status == "doctor"
                            ? Lang_chg.noDocsTitle[providersData.languageIndex]
                            : Lang_chg.noLabsTitle[providersData.languageIndex]
                }</Text>
              <Text style={{
                fontSize: Font.medium,
                fontFamily: Font.Regular,
                color: Colors.lightGrey,
                textAlign: 'center',
                marginTop: vs(10)
              }}>{
                  pass_status == "nurse"
                    ? Lang_chg.noNursesDesc[providersData.languageIndex]
                    : pass_status == "physiotherapy"
                      ? Lang_chg.noPhysiotherapistsDesc[providersData.languageIndex]
                      : pass_status == "caregiver"
                        ? Lang_chg.noNurseAssisDesc[providersData.languageIndex]
                        : pass_status == "babysitter"
                          ? Lang_chg.noBabySitterDesc[providersData.languageIndex]
                          : pass_status == "doctor"
                            ? Lang_chg.noDocsDesc[providersData.languageIndex]
                            : Lang_chg.noLabsDesc[providersData.languageIndex]
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
        }
        }
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
                  {Lang_chg.selectSpecialty[config.language]}
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