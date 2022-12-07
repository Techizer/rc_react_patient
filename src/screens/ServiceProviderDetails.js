import React, { Component } from "react";
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

import {
  Colors,
  Font,
  windowHeight,
  msgProvider,
  config,
  windowWidth,
  localStorage,
  Icons,
  consolepro,
  Lang_chg,
  apifuntion,
} from "../Provider/utilslib/Utils";
import HTMLView from "react-native-htmlview";
import ScreenHeader from "../components/ScreenHeader";
import { Clock, dummyDoc, dummyUser, GoldStar, leftArrow, Notification } from "../icons/SvgIcons/Index";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import { Button } from "../components";

const rootcaresteps = [
  {
    id: 1,
    detail:
      "Choose from wide range of providers list available on home/dashboard window.(You can chose among Nurse, NurseAssistant, Babysitter, Physiotherapist,Doctor, Hospital & Labs, etc)",
  },
  {
    id: 2,
    detail:
      "According to your location preference you will get the providers list whom you can chose from, and move forward to booking |screen. ;",
  },
  {
    id: 3,
    detail: "Select a date and time slot for your booking. ",
  },
  {
    id: 4,
    detail: "Make the payment to confirm booking.",
  },
  {
    id: 5,
    detail:
      "Wait for the RootsCare Service Provider to come to your location for your booking.",
  },
  {
    id: 6,
    detail:
      "Confirm OTP after our medical professional completes their service.",
  },
  {
    id: 7,
    detail:
      "Provide a review/feedback to our professional after the completion of the service sharing your experience.  ",
  },
  {
    id: 8,
    detail:
      "You can contact us from Help & Support if you face any issues during the entire process. We are available 24x7 to help you. |",
  },
];

export default class ServiceProviderDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      providerType: this.props.route.params.providerType,
      providerId: this.props.route.params.providerId,
      isFromHospital: this.props.route.params.isFromHospital,
      provider_details: "",
      message: "",
      modalVisible: false,
      modal2Visible: false,
      how_work_value: "",
      available_days: "",
    };
    screens = "Login";
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  setModal2Visible = (visible) => {
    this.setState({ modal2Visible: visible });
  };
  componentDidMount() {
    this.props.navigation.addListener("focus", () => {
      this.get_Services();
    });
  }

  get_Services = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];
    let url = config.baseURL + "api-patient-service-provider-details";

    var data = new FormData();
    data.append("id", this.state.providerId);
    data.append("login_user_id", user_id);
    data.append("service_type", this.state.providerType);
    data.append("work_area", user_details["work_area"]);

    consolepro.consolelog("get_Services-query-data......", data);
    // return false
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        consolepro.consolelog("get_Service-details-response", JSON.stringify(obj));

        if (obj.status == true) {
          let htmlData = '<!DOCTYPE html><html><body style="color:#0168b3">';
          let htmlDataClosed = "</body></html>";

          this.setState({
            provider_details: obj.result,
            message: obj.message,
            availability_arr: obj.result.availability,
          });
          let how_work = obj.result.how_work_value;
          // consolepro.consolelog("how_work", how_work);

          let result_new = how_work.replace('<font color="#0888D1">', "");
          result_new = result_new.replace("<h4>", '<h4 color="#0168b3">');
          result_new = result_new.replace(/<\/h5>/g, "</h5><br>");
          let result_new_tag = result_new.replace(/<\/p><p>/g, "</p>");
          htmlData = htmlData + result_new_tag + htmlDataClosed;

          // consolepro.consolelog("htmlData", htmlData);
          this.setState({ how_work_value: htmlData });
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
          this.setState({ available_days: hour_task.toString() });
        } else {
          msgProvider.showError(obj.message);
          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
      });
  };

  render() {
    const { modalVisible } = this.state;
    const { modal2Visible } = this.state;
    const { provider_details, available_days, providerType, providerId } = this.state;
    return (
      <View style={{ flex: 0.98, backgroundColor: Colors.backgroundcolor }}>

        <ScreenHeader
          title={
            this.state.providerType == "nurse"
              ? Lang_chg.Nurse[config.language]
              : this.state.providerType == "physiotherapy"
                ? Lang_chg.Physiotherapist[config.language]
                : this.state.providerType == "caregiver"
                  ? Lang_chg.Nurse_assistant[config.language]
                  : this.state.providerType == "babysitter"
                    ? Lang_chg.Babysitter[config.language]
                    : this.state.providerType == "doctor"
                      ? Lang_chg.Doctor[config.language]
                      : Lang_chg.Lab[config.language]
          }
          navigation={this.props.navigation}
          onBackPress={() => this.props.navigation.pop()}
          leftIcon={leftArrow}
          rightIcon={Notification}
        />


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
                    textAlign: config.textRotate,
                    color: Colors.detailTitles
                  }}>
                  {provider_details.provider_name}
                </Text>
                {
                  providerType != 'lab' &&
                  <Text
                    style={{
                      fontFamily: Font.Regular,
                      fontSize: Font.small,
                      textAlign: config.textRotate,
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
                    textAlign: config.textRotate,
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
                    textAlign: config.textRotate,
                    color: Colors.lightGrey,
                    marginTop: vs(2)
                  }}>
                  {providerType === 'lab' ? Lang_chg.ESTABLISHED[config.language] : Lang_chg.Experience[config.language]}
                </Text>
                <Text
                  style={{
                    fontFamily: Font.Medium,
                    fontSize: Font.xlarge,
                    textAlign: config.textRotate,
                    color: Colors.detailTitles,
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
                    textAlign: config.textRotate,
                    color: Colors.lightGrey,
                    marginTop: vs(2),
                    paddingHorizontal: s(15)
                  }}>
                  {Lang_chg.Bookings[config.language]}
                </Text>
                <Text
                  style={{
                    fontFamily: Font.Medium,
                    fontSize: Font.xlarge,
                    textAlign: config.textRotate,
                    color: Colors.detailTitles,
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
                    textAlign: config.textRotate,
                    color: Colors.lightGrey,
                    marginTop: vs(2),
                    paddingHorizontal: s(15)
                  }}>
                  {Lang_chg.Rating[config.language]}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(15), marginTop: vs(5), }}>
                  <SvgXml xml={GoldStar} height={s(14)} width={s(14)} style={{}} />
                  <Text
                    style={{
                      fontFamily: Font.Medium,
                      fontSize: Font.xlarge,
                      textAlign: config.textRotate,
                      color: Colors.detailTitles,
                      marginLeft: s(5)
                    }}>
                    {provider_details.avg_rating ? `${provider_details.avg_rating}.0` : 'NA'}
                  </Text>
                </View>

              </View>
            </View>

            {/* -------------------Desc Container-------------------- */}

            <View style={styles.descContainer}>
              <Text
                style={{
                  fontFamily: Font.Regular,
                  fontSize: Font.xsmall,
                  textAlign: config.textRotate,
                  color: Colors.detailTitles,
                }}>
                {provider_details.description}
              </Text>
            </View>

            {/* -------------------Time Container-------------------- */}

            <View style={styles.timeContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center', width: '30%', }}>
                <SvgXml xml={Clock} height={s(15)} width={s(15)} style={{ marginRight: s(9) }} />
                <Text
                  style={{
                    fontFamily: Font.Regular,
                    fontSize: Font.medium,
                    textAlign: config.textRotate,
                    color: Colors.DarkGrey,
                  }}>
                  {'Availability'}
                </Text>
              </View>

              <View style={{ alignItems: 'flex-end', width: '70%', }}>
                <Text
                  style={{
                    fontFamily: Font.Medium,
                    color: Colors.Blue,
                    fontSize: Font.medium,
                    textAlign: config.textRotate,
                  }}>
                  {available_days}
                </Text>
              </View>
            </View>

            <View style={{ width: '100%', height: 1.5, backgroundColor: Colors.backgroundcolor, marginTop: vs(18) }}></View>

            {/* -------------------Btns Container-------------------- */}

            <View style={styles.btnContainer}>
              {
                providerType === 'lab' ?
                  <Button
                    text={Lang_chg.BOOKLABTESTAPPOINTMENT[config.language]}
                    btnStyle={{ marginTop: 0, backgroundColor: Colors.Green }}
                    onPress={() => { }}
                  />
                  :
                  <>
                    <Button
                      text={Lang_chg.BOOKTASKBASEDAPPOINTMENT[config.language]}
                      btnStyle={{ marginTop: 0, backgroundColor: Colors.Green }}
                      onPress={() => {
                        this.props.navigation.navigate("Booking", {
                          providerType: providerType,
                          providerId: this.state.providerId,
                          display: "hourlybooking",
                          indexPosition: 1,
                        })
                      }}
                    />

                    <Button
                      text={Lang_chg.BOOKHOURLYAPPOINTMENT[config.language]}
                      btnStyle={{ marginTop: vs(10), backgroundColor: Colors.Theme }}
                      onPress={() => { }}
                    />
                  </>
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
                  textAlign: config.textRotate,
                  color: Colors.White,
                  paddingLeft: s(7),
                  paddingRight: s(14),
                }}>
                {Lang_chg.Nurse_Booking[config.language]}
              </Text>
              <View style={{ height: '40%', borderWidth: 0.8, borderColor: Colors.backgroundcolor }}></View>
              <Text
                style={{
                  fontFamily: Font.Regular,
                  fontSize: Font.small,
                  textAlign: config.textRotate,
                  color: Colors.White,
                  paddingLeft: s(12),
                }}>
                {Lang_chg.RootsCare[config.language]}
              </Text>
            </View>

            <View style={{ width: '30%', height: '100%', justifyContent: 'center' }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => this.setModalVisible(true)}
              >
                <Text
                  style={{
                    fontFamily: Font.Medium,
                    fontSize: Font.small,
                    textAlign: config.textRotate,
                    color: Colors.White,
                    alignSelf: 'flex-end'
                  }}>
                  {Lang_chg.Howitworks[config.language]}
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
                    textAlign: config.textRotate,
                    fontFamily: Font.Regular,
                    fontSize: Font.xlarge,
                    color: Colors.detailTitles
                  }}
                >

                  {Lang_chg.HealthPackages[config.language]}
                </Text>
                <Text
                  onPress={() => {
                    this.props.navigation.navigate(
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
                  {Lang_chg.See_all[config.language]}
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
                        this.props.navigation.navigate(
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
                          textAlign: config.textRotate,
                          fontSize: Font.small,
                          color: Colors.detailTitles
                        }}>{item?.name}</Text>

                      <Text
                        style={{
                          fontFamily: Font.Regular,
                          textAlign: config.textRotate,
                          fontSize: Font.small,
                          color: Colors.Blue,
                          marginTop: vs(5)
                        }}>{item?.iso_certificate}</Text>


                      <View style={{ width: '92%', height: 1.5, backgroundColor: Colors.backgroundcolor, marginVertical: vs(10), alignSelf: 'center' }}></View>

                      <Text
                        style={{
                          paddingVertical: vs(3),
                          fontFamily: Font.Regular,
                          textAlign: config.textRotate,
                          color: Colors.Green,
                          fontSize: Font.small,
                        }}
                      >
                        {item.dis_off}
                      </Text>

                      <Text
                        style={{
                          fontFamily: Font.Regular,
                          textAlign: config.textRotate,
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
                            textAlign: config.textRotate,
                            fontFamily: Font.Medium,
                            fontSize: Font.medium,
                          }}>
                          {item.price}
                        </Text>

                        <Text
                          onPress={() => {
                            this.props.navigation.navigate(
                              "Booking",
                              {
                                providerType: providerType,
                                nurse_id: providerId,
                                display: "packageBooking",
                                indexPosition: 1,
                              }
                            );
                          }}
                          style={{
                            fontFamily: Font.SemiBold,
                            fontSize: Font.medium,
                            color: Colors.Theme,
                            textTransform: "uppercase",
                          }}
                        >
                          {Lang_chg.Book[config.language]}
                        </Text>
                      </View>

                      {/* <View
               style={{
                 width: "90%",
                 alignSelf: "center",
                 borderColor: Colors.bordercolor,
                 borderBottomWidth:
                   (windowWidth * 0.5) / 100,
                 marginTop: (windowWidth * 1) / 100,
               }}
             /> */}







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
                    textAlign: config.textRotate,
                    fontFamily: Font.Regular,
                    fontSize: Font.xlarge,
                    color: Colors.detailTitles
                  }}
                >
                  {`${providerType === 'nurse' ? Lang_chg.AvailableNurse[config.language] : providerType === 'physiotherapy' ? Lang_chg.Availablephysotharpst[config.language] : providerType === 'caregiver' ? Lang_chg.Availableassistent[config.language] : providerType === 'babysitter' ? Lang_chg.Availablebabysitter[config.language] : providerType === 'doctor' ? Lang_chg.AvailableDoctor[config.language] : Lang_chg.AvailableLab[config.language]}`}
                </Text>
                <TouchableOpacity onPress={() => this.props.navigation.pop()}>
                  <Text
                    style={{
                      fontFamily: Font.Medium,
                      fontSize: Font.medium,
                      color: Colors.Blue,
                    }}
                  >
                    {Lang_chg.See_all[config.language]}
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
                        this.props.navigation.navigate(
                          "ServiceProviderDetails",
                          {
                            providerType: providerType,
                            providerId: item.user_id,
                            isFromHospital: false,
                            hospitalId: item?.hospital_id,
                          }
                        );
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
                        <Text
                          style={{
                            color: Colors.detailTitles,
                            fontFamily: Font.Medium,
                            fontSize: Font.small,
                            textAlign: config.textRotate,
                          }}>
                          {item?.provider_name}
                        </Text>

                        <Text
                          style={{
                            color: Colors.lightGrey,
                            fontFamily: Font.Regular,
                            fontSize: Font.xsmall,
                            textAlign: config.textRotate,
                            marginTop: vs(3)
                          }}>
                          {item?.qualification}
                        </Text>

                        <Text
                          style={{
                            color: Colors.Blue,
                            fontFamily: Font.Regular,
                            fontSize: Font.xsmall,
                            textAlign: config.textRotate,
                            marginTop: vs(6)
                          }}>
                          {item?.speciality}
                        </Text>
                      </View>


                      {/* <Text
               style={{
                 paddingVertical: (windowWidth * 2) / 100,
                 paddingHorizontal: (windowWidth * 2) / 100,
                 fontFamily: Font.Regular,
                 textAlign: "left",
                 fontSize: Font.sregulartext_size,
               }}
             >
               {item.iso_certificate}
             </Text> */}

                      {/* <View
               style={{
                 width: "90%",
                 alignSelf: "center",
                 borderColor: Colors.bordercolor,
                 borderBottomWidth:
                   (windowWidth * 0.5) / 100,
                 marginTop: (windowWidth * 1) / 100,
               }}
             /> */}

                      {/* <Text
               style={{
                 paddingVertical: (windowWidth * 2) / 100,
                 paddingHorizontal: (windowWidth * 2) / 100,
                 fontFamily: Font.Regular,
                 textAlign: "left",
                 color: Colors.Green,
                 fontSize: Font.sregulartext_size,
               }}
             >
               {item.dis_off}
             </Text> */}

                      {/* <Text
               style={{
                 paddingHorizontal: (windowWidth * 2) / 100,
                 fontFamily: Font.Regular,
                 textAlign: "left",
                 fontSize: Font.sregulartext_size,
                 textDecorationLine: "line-through",
                 textDecorationStyle: "solid",
               }}
             >
               {item.maxprice}
             </Text> */}

                      {/* <View
               style={{
                 paddingVertical: (windowWidth * 2) / 100,
                 flexDirection: "row",
                 justifyContent: "space-between",
                 paddingHorizontal: (windowWidth * 2) / 100,
                 alignItem: "center",
               }}
             >
               <Text
                 style={{
                   textAlign: config.textalign,
                   fontFamily: Font.Medium,
                   fontSize: (windowWidth * 4) / 100,
                 }}
               >
                 {item.price}
               </Text>

               <Text
                 onPress={() => {
                   this.props.navigation.navigate(
                     "Booking",
                     {
                       pass_status:
                         this.state.pass_status,
                       nurse_id: this.state.nurse_id,
                       display: "packageBooking",
                       indexPosition: 1,
                     }
                   );
                 }}
                 style={{
                   fontFamily: Font.SemiBold,
                   fontSize: Font.regulartext_size,
                   color: Colors.Theme,
                   textTransform: "uppercase",
                 }}
               >
                 {Lang_chg.Book[config.language]}
               </Text>
             </View> */}

                    </TouchableOpacity>
                  );
                }}
              />

            </View>

          }


        </ScrollView>


        {/* code for modal */}
        <Modal
          backdropOpacity={3}
          // style={{backgroundColor: Colors.dim_grey}}
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          presentationStyle="overFullScreen"
          onRequestClose={() => {
            this.setModalVisible(!modalVisible);
          }}
        >
          <View
            // onPress={() => this.setModalVisible(false)}
            style={{
              flex: 1,
              backgroundColor: "#000000aa",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                alignSelf: "center",
                height: (windowHeight * 85) / 100,
              }}
            >
              <View
                // showsVerticalScrollIndicator={false}
                style={{
                  width: "95%",
                  alignSelf: "center",
                  backgroundColor: Colors.White,
                  paddingHorizontal: (windowWidth * 7) / 100,
                  paddingVertical: (windowWidth * 3) / 100,
                  // borderRadius: (windowWidth * 6) / 100,
                  borderRadius: (windowWidth * 4) / 100,
                  height: (windowHeight * 75) / 100,
                }}
              >
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View
                    style={{
                      paddingBottom: (windowWidth * 15) / 100,
                      paddingTop: (windowWidth * 2) / 100,
                    }}
                  >
                    <HTMLView
                      value={this.state.how_work_value}
                      stylesheet={HTMLstyles}
                    />
                  </View>
                </ScrollView>

                <View
                  style={{
                    width: "95%",
                    alignSelf: "flex-end",
                    backgroundColor: Colors.White,
                    paddingVertical: (windowWidth * 2) / 100,
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      alignItems: "flex-end",

                      borderWidth: 1,
                      borderColor: "#0888D1",
                      borderRadius: (windowWidth * 2.5) / 100,
                      paddingVertical: (windowWidth * 1.5) / 100,
                      paddingHorizontal: (windowWidth * 3) / 100,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Font.Regular,
                        color: "#0888D1",
                      }}
                      onPress={() => this.setModalVisible(false)}
                    >
                      {Lang_chg.close_txt[config.language]}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>

      </View>
    );
  }
}
const HTMLstyles = StyleSheet.create({
  h4: {
    color: "#0888D1",
    fontSize: (windowWidth * 4.5) / 100,
  },
  h5: {
    color: "#0888D1",
    fontSize: (windowWidth * 4.3) / 100,
    fontFamily: Font.Medium,
  },
});

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
