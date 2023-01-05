import React, { Component } from "react";
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
  windowWidth,
  localStorage,
  consolepro,
  Lang_chg,
  apifuntion,
  ScreenHeader
} from "../Provider/utilslib/Utils";

import { leftArrow, Notification } from "../Icons/Index";
import { s, vs } from "react-native-size-matters";
import ServiceProviderContainer from "../components/ServiceProviderContainer";
import SearchInput from "../components/SearchInput";
import FilterBottomSheet from "../components/FilterBottomSheet";

export default class AllServiceProviderListing extends Component {
  _didFocusSubscription;
  _willBlurSubscription;

  constructor(props) {
    super(props);
    this.state = {
      pass_status: this.props.route.params.pass_status,
      enableFor: this.props.route.params.enableFor,
      nurse_data: "",
      message: "",
      notification_count: "",
      searchProvider: "",
      isHospitalDoctorList: false,
      hospitalName: "",
      hospitalId: "",
      specialtyData: "",
      specialtyArr: [],
      specialtyMessage: "",
      specialtyModal: false,
      availableDoctorsUnderHospital: [],
      availableDoctorsMessage: "",
      providersList: [1, 2, 3, 4, 5, 6, 7],
      availability: [],
      isLoading: true,
      isFilter: false
    };
    screens = "Login";
  }
  componentDidMount() {
    this.props.navigation.addListener("focus", () => {
      this.get_Services();
    });
  }

  getHospitalSpecialties = async () => {
    let url = config.baseURL + "api-hospital-doctor-speciality-list";

    var data = new FormData();
    data.append("hospital_id", this.state.hospitalId);
    data.append("service_type", "doctor");

    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        consolepro.consolelog("obj", obj);
        if (obj.status == true) {
          this.setState({
            specialtyArr: obj.result,
            specialtyMessage: obj.message,
          });
        } else {
          this.setState({
            specialtyArr: obj.result,
            specialtyMessage: obj.message,
          });
          return false;
        }
      })
      .catch((error) => {
        console.log("-------- error ------- " + error);
      });
  };


  get_Services = async () => {
    if (this.state.searchProvider != '') {
      this.setState({
        isLoading: true
      })
    }

    let url =
      config.baseURL +
      (this.state.pass_status === "hospital" ? "api-patient-hospital-list" : "api-patient-service-provider-list");

    var data = new FormData();
    if (this.state.pass_status === "doctor") {
      data.append("docEnableFor", this.state.enableFor);
    }
    if (global.isLogin == false) {

      let addressDetails = await localStorage.getItemObject("addressDetails");
      console.log("addressDetails", addressDetails);
      var device_lang;
      if (config.language == 0) {
        device_lang = "ENG";
      } else {
        device_lang = "AR";
      }

      data.append("login_user_id", 0);
      data.append("service_type", this.state.pass_status);
      data.append("provider_name", "");
      data.append("device_lang", device_lang);
      data.append("latitude", addressDetails?.latitude);
      data.append("longitudes", addressDetails?.longitude);
      data.append("page_count", 1);
    } else {
      let user_details = await localStorage.getItemObject("user_arr");
      let user_id = user_details["user_id"];

      data.append("login_user_id", user_id);
      data.append("service_type", this.state.pass_status);
      data.append("work_area", user_details["work_area"]);
      data.append("page_count", 1);

      // --------When Search anything--------
      if (this.state.searchProvider !== "") {
        data.append("provider_name", this.state.searchProvider);
      } else {
        data.append("provider_name", '');
      }
    }
    // consolepro.consolelog("get_Services-query-data......", data);
    // return
    apifuntion.postApi(url, data, 1).then((res) => {
      consolepro.consolelog("get_Services-response ", JSON.stringify(res));

      if (res.status == true) {
        setTimeout(() => {
          this.setState({
            providersList: res.result,
            message: res.message,
            isLoading: false
          });
        }, 2000);
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
        console.log('else');
        this.setState({
          providersList: [],
          message: res.message,
          isLoading: false
        });
      }
    })
      .catch((error) => {
        this.setState({
          providersList: [],
          isLoading: false
        });
        consolepro.consolelog("-------- error ------- " + error);
      });
  };

  listHeader = (type) => {
    return (
      <SearchInput
        placeholder={
          type == "nurse"
            ? Lang_chg.SearchNurse[config.language]
            : type == "physiotherapy"
              ? Lang_chg.Searchphysi[config.language]
              : type == "caregiver"
                ? Lang_chg.Searchseassistent[config.language]
                : type == "babysitter"
                  ? Lang_chg.SearchBabysitter[config.language]
                  : type == "doctor"
                    ? Lang_chg.SearchDoctor[config.language]
                    : type == "hospital"
                      ? Lang_chg.SearchHospital[config.language]
                      : Lang_chg.SearchLab[config.language]
        }
        onChangeText={(val) => {
          this.setState({ searchProvider: val });
        }}
        onSubmitEditing={() => {
          Keyboard.dismiss();
        }}
        onPressSearch={() => this.get_Services()}
        onFilterPress={() => {
          this.setState({ isFilter: true })
        }}
      />
    )
  }

  render() {

    const { isLoading, providersList, pass_status, message } = this.state

    return (
      <View style={{ backgroundColor: Colors.backgroundcolor, flex: 0.98 }}>
        <ScreenHeader
          title={
            this.state.isHospitalDoctorList
              ? Lang_chg.Doctor[config.language]
              : pass_status == "nurse"
                ? Lang_chg.Nurse[config.language]
                : pass_status == "physiotherapy"
                  ? Lang_chg.Physiotherapist[config.language]
                  : pass_status == "caregiver"
                    ? Lang_chg.Nurse_assistant[config.language]
                    : pass_status == "babysitter"
                      ? Lang_chg.Babysitter[config.language]
                      : pass_status == "doctor"
                        ? Lang_chg.Doctor[config.language]
                        : Lang_chg.Lab[config.language]
          }
          navigation={this.props.navigation}
          onBackPress={() => this.props.navigation.pop()}
          leftIcon
        />
        {/* <View style={{ backgroundColor: Colors.backgroundcolor, flex: 0.97 }}> */}
        <FlatList
          contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? vs(80) : vs(70) }}
          showsVerticalScrollIndicator={false}
          data={providersList}
          keyExtractor={(item, index) => `Provider ${index}`}
          ListHeaderComponent={this.listHeader(pass_status)}
          ListEmptyComponent={() => {
            return (
              <View style={{ marginTop: vs(140), alignSelf: 'center', paddingHorizontal: '10%' }}>
                <Text style={{
                  fontSize: Font.xlarge,
                  fontFamily: Font.Regular,
                  color: Colors.darkText,
                  textAlign: 'center'
                }}>{
                    this.state.pass_status == "nurse"
                      ? Lang_chg.noNursesTitle[config.language]
                      : pass_status == "physiotherapy"
                        ? Lang_chg.noPhysiotherapistsTitle[config.language]
                        : pass_status == "caregiver"
                          ? Lang_chg.noNurseAssisTitle[config.language]
                          : pass_status == "babysitter"
                            ? Lang_chg.noBabySitterTitle[config.language]
                            : pass_status == "doctor"
                              ? Lang_chg.noDocsTitle[config.language]
                              : Lang_chg.noLabsTitle[config.language]
                  }</Text>
                <Text style={{
                  fontSize: Font.medium,
                  fontFamily: Font.Regular,
                  color: Colors.lightGrey,
                  textAlign: 'center',
                  marginTop: vs(10)
                }}>{
                    this.state.pass_status == "nurse"
                      ? Lang_chg.noNursesDesc[config.language]
                      : pass_status == "physiotherapy"
                        ? Lang_chg.noPhysiotherapistsDesc[config.language]
                        : pass_status == "caregiver"
                          ? Lang_chg.noNurseAssisDesc[config.language]
                          : pass_status == "babysitter"
                            ? Lang_chg.noBabySitterDesc[config.language]
                            : pass_status == "doctor"
                              ? Lang_chg.noDocsDesc[config.language]
                              : Lang_chg.noLabsDesc[config.language]
                  }</Text>
              </View>
            )
          }}
          renderItem={({ item, index }) => {
            return (
              <ServiceProviderContainer
                Item={item}
                navigation={this.props.navigation}
                isLoading={isLoading}
                providerType={pass_status}
                Index={index}
                docType={this.state.enableFor}
              />
            );
          }
          }
        />
        {/* </View> */}

        <Modal
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
        </Modal>

        <FilterBottomSheet
          visible={this.state.isFilter}
          onRequestClose={() => {
            this.setState({ isFilter: false })
          }}
        />
      </View >
    );
  }
}
