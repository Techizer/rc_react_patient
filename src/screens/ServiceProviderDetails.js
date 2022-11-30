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
import { Appbtn2, AppHeader2 } from "../Allcomponents";
import HideWithKeyboard from "react-native-hide-with-keyboard";
import HTMLView from "react-native-htmlview";
import Footer from "../Footer";

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
      pass_status: this.props.route.params.pass_status,
      nurse_id: this.props.route.params.nurse_id,
      isFromHospital: this.props.route.params.isFromHospital,
      nurse_data: "",
      message: "",
      modalVisible: false,
      modal2Visible: false,
      how_work_value: "",
      availability_task: "",
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
    console.log("url", url);

    var data = new FormData();
    data.append("id", this.state.nurse_id);
    data.append("login_user_id", user_id);
    data.append("service_type", this.state.pass_status);
    data.append("work_area", user_details["work_area"]);

    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        consolepro.consolelog("obj", JSON.stringify(obj));

        if (obj.status == true) {
          let htmlData = '<!DOCTYPE html><html><body style="color:#0168b3">';
          let htmlDataClosed = "</body></html>";

          this.setState({
            nurse_data: obj.result,
            message: obj.message,
            availability_arr: obj.result.availability,
          });
          let how_work = obj.result.how_work_value;
          consolepro.consolelog("how_work", how_work);

          let result_new = how_work.replace('<font color="#0888D1">', "");
          result_new = result_new.replace("<h4>", '<h4 color="#0168b3">');
          result_new = result_new.replace(/<\/h5>/g, "</h5><br>");
          let result_new_tag = result_new.replace(/<\/p><p>/g, "</p>");
          htmlData = htmlData + result_new_tag + htmlDataClosed;

          consolepro.consolelog("mfdgf", htmlData);
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
          console.log("musaknfg", hour_task.toString());
          this.setState({ availability_task: hour_task.toString() });
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
    var item = this.state.nurse_data;
    return (
      <View style={{ flex: 1, backgroundColor: "#f1f2f4" }}>
        <SafeAreaView style={{ flex: 0 }} />

        <AppHeader2
          navigation={this.props.navigation}
          title={
            this.state.pass_status == "nurse"
              ? Lang_chg.Nurse[config.language]
              : this.state.pass_status == "physiotherapy"
              ? Lang_chg.Physiotherapist[config.language]
              : this.state.pass_status == "caregiver"
              ? Lang_chg.Nurse_assistant[config.language]
              : this.state.pass_status == "babysitter"
              ? Lang_chg.Babysitter[config.language]
              : this.state.pass_status == "doctor"
              ? Lang_chg.Doctor[config.language]
              : this.state.pass_status == "hospital"
              ? Lang_chg.Hospital[config.language]
              : Lang_chg.Lab[config.language]
          }
        />

        {this.state.nurse_data != null && this.state.nurse_data != "" && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom:
                this.state.pass_status !== "lab"
                  ? (windowWidth * 20) / 100
                  : (windowWidth * 17) / 100,
            }}
          >
            <View style={{ marginVertical: (windowWidth * 3) / 100, flex: 1 }}>
              <View>
                <View
                  style={{
                    backgroundColor: "#fff",
                    paddingBottom: (windowWidth * 5) / 100,
                    paddingHorizontal: (windowWidth * 4) / 100,
                    // alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      paddingVertical: (windowWidth * 1) / 100,
                      marginTop: (windowWidth * 2) / 100,
                    }}
                  >
                    {/* image and store name */}

                    <View style={{ width: "28%" }}>
                      <Image
                        source={
                          item.image == "NA" ||
                          item.image == null ||
                          item.image == ""
                            ? Icons.p1
                            : { uri: config.img_url3 + item.image }
                        }
                        style={{
                          width: (windowWidth * 20) / 100,
                          height: (windowWidth * 20) / 100,
                          borderWidth: 1,
                          borderColor: "#0888D1",
                          borderRadius: (windowWidth * 10) / 100,
                        }}
                      />
                    </View>

                    <View
                      style={{
                        width: "55%",
                        alignSelf: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: Font.fontmedium,
                          fontSize: Font.name,
                          textAlign: config.textRotate,
                        }}
                      >
                        {item.provider_name}
                      </Text>

                      {this.state.pass_status !== "lab" ? (
                        <>
                          <Text
                            style={{
                              paddingVertical: (windowWidth * 1.5) / 100,
                              fontFamily: Font.fontregular,
                              fontSize: Font.subtext,
                              color: Colors.cardlighgray,
                              textAlign: config.textRotate,
                            }}
                          >
                            {item.qualification}
                          </Text>
                          <Text
                            style={{
                              fontFamily: Font.fontmedium,
                              color: Colors.Theme,
                              fontSize: Font.subtext,
                              textAlign: config.textRotate,
                            }}
                          >
                            {item.speciality}
                          </Text>
                        </>
                      ) : (
                        <Text
                          style={{
                            paddingVertical: (windowWidth * 1.5) / 100,
                            fontFamily: Font.fontregular,
                            fontSize: Font.subtext,
                            color: Colors.Theme,
                            textAlign: config.textRotate,
                          }}
                        >
                          {item.iso_text}
                        </Text>
                      )}
                    </View>
                    {this.state.pass_status === "lab" &&
                    item.hospital_id !== "" ? (
                      <View
                        style={{
                          backgroundColor: "#FFA800",
                          width: "17%",
                          height: 20,
                          marginTop: -13,
                          marginLeft: 15,
                          borderBottomLeftRadius: (windowWidth * 2) / 100,
                          paddingVertical: 3,
                        }}
                      >
                        <Text
                          style={{
                            color: "#fff",
                            fontFamily: Font.fontmedium,
                            fontSize: (windowWidth * 2.5) / 100,
                            alignSelf: "center",
                          }}
                        >
                          {Lang_chg.Hospital[config.language]}
                        </Text>
                      </View>
                    ) : (
                      this.state.isFromHospital && (
                        <View
                          style={{
                            backgroundColor: "#FFA800",
                            width: "17%",
                            height: 20,
                            marginTop: -13,
                            marginLeft: 15,
                            // borderTopLeftRadius : (windowWidth * 2) / 100,
                            borderBottomLeftRadius: (windowWidth * 2) / 100,
                            paddingVertical: 3,
                          }}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              fontFamily: Font.fontmedium,
                              fontSize: (windowWidth * 2.5) / 100,
                              alignSelf: "center",
                            }}
                          >
                            {Lang_chg.Hospital[config.language]}
                          </Text>
                        </View>
                      )
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      borderBottomWidth: (windowWidth * 0.3) / 100,
                      paddingBottom: (windowWidth * 4) / 100,
                      borderColor: Colors.gainsboro,
                      paddingTop: (windowWidth * 4) / 100,
                      width: "97%",
                      alignSelf: "center",
                    }}
                  >
                    <View style={{ width: "33.3%" }}>
                      <Text
                        style={{
                          color: Colors.cardlighgray,
                          fontFamily: Font.fontregular,
                          fontSize: Font.subtext,
                          textAlign: config.textRotate,
                        }}
                      >
                        {this.state.pass_status !== "lab"
                          ? Lang_chg.Experience[config.language]
                          : Lang_chg.ESTABLISHED[config.language]}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.fontmedium,
                          fontSize: Font.regulartext_size,
                          paddingTop: (windowWidth * 2) / 100,
                          textAlign: config.textRotate,
                        }}
                      >
                        {item.experience !== "" ? item.experience : "-"}
                      </Text>
                    </View>
                    <View style={{ width: "33.3%" }}>
                      <Text
                        style={{
                          color: Colors.cardlighgray,
                          fontFamily: Font.fontregular,
                          fontSize: Font.subtext,
                          textAlign: config.textRotate,
                        }}
                      >
                        {Lang_chg.Bookings_new[config.language]}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.fontmedium,
                          fontSize: Font.regulartext_size,
                          paddingTop: (windowWidth * 2) / 100,
                          textAlign: config.textRotate,
                        }}
                      >
                        {item.booking_count}
                      </Text>
                    </View>
                    <View style={{ width: "33.3%" }}>
                      <Text
                        style={{
                          color: Colors.cardlighgray,
                          fontFamily: Font.fontregular,
                          fontSize: Font.subtext,
                          textAlign: config.textRotate,
                        }}
                      >
                        {Lang_chg.Rating[config.language]}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          paddingTop: (windowWidth * 2) / 100,
                        }}
                      >
                        <Image
                          source={Icons.starrating}
                          style={{
                            // tintColor: '#fff',
                            width: (windowWidth * 3.3) / 100,
                            height: (windowWidth * 3.3) / 100,
                            alignSelf: "center",
                          }}
                        />
                        <Text
                          style={{
                            fontFamily: Font.fontmedium,
                            fontSize: Font.regulartext_size,
                            marginLeft: (windowWidth * 2) / 100,
                            textAlign: config.textRotate,
                          }}
                        >
                          {item.avg_rating}.0
                        </Text>
                      </View>
                    </View>
                  </View>

                  {this.state.pass_status !== "lab" ? (
                    <View
                      style={{
                        borderBottomWidth: (windowWidth * 0.3) / 100,
                        paddingVertical: (windowWidth * 4) / 100,
                        borderColor: Colors.gainsboro,
                        width: "96%",
                        alignSelf: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: Font.fontregular,
                          fontSize: Font.subtext,
                          color: "#000",
                          textAlign: config.textRotate,
                        }}
                      >
                        {item.description}
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        borderBottomWidth: (windowWidth * 0.3) / 100,
                        paddingVertical: (windowWidth * 4) / 100,
                        borderColor: Colors.gainsboro,
                        width: "96%",
                        alignSelf: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: Font.fontregular,
                          fontSize: Font.subtext,
                          color: "#000",
                          textAlign: config.textRotate,
                        }}
                      >
                        {Lang_chg.AVAILABLE_TESTS[config.language]}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.fontregular,
                          fontSize: Font.subtext,
                          marginTop: (windowWidth * 4) / 100,
                          color: Colors.Theme,
                          textAlign: config.textRotate,
                        }}
                      >
                        {item.available_test}
                      </Text>
                    </View>
                  )}

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: (windowWidth * 2) / 100,
                      borderRadius: (windowWidth * 1) / 100,
                      width: "97%",
                      alignSelf: "center",
                      paddingVertical: (windowWidth * 2) / 100,
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                      }}
                    >
                      {config.language == 0 ? (
                        <Image
                          source={Icons.clock}
                          style={{
                            resizeMode: "contain",
                            width: (windowWidth * 4) / 100,
                            height: (windowWidth * 4) / 100,
                          }}
                        />
                      ) : (
                        <Image
                          source={Icons.clock_arabic_gray}
                          style={{
                            resizeMode: "contain",
                            width: (windowWidth * 4) / 100,
                            height: (windowWidth * 4) / 100,
                          }}
                        />
                      )}
                      <Text
                        style={{
                          marginLeft: (windowWidth * 1.5) / 100,
                          fontFamily: Font.fontregular,
                          fontSize: Font.subtext,
                          color: Colors.DarkGrey,
                        }}
                      >
                        {item.bavi_text}
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          color: Colors.Theme,
                          fontFamily: Font.fontmedium,
                          fontSize: Font.subtext,
                        }}
                      >
                        {this.state.availability_task}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      width: "100%",
                      alignSelf: "center",
                      borderColor: Colors.bordercolor,
                      borderBottomWidth: (windowWidth * 0.3) / 100,
                      marginTop: (windowWidth * 1) / 100,
                    }}
                  />
                  {this.state.isFromHospital ? (
                    <Appbtn2
                      onPressHandler={() => {
                        this.props.navigation.navigate("Booking", {
                          pass_status: this.state.pass_status,
                          nurse_id: this.state.nurse_id,
                          display: "taskbooking",
                          indexPosition: 0,
                          isFromHospital: this.state.isFromHospital,
                          hospitalId: this.props.route.params.hospitalId,
                        });
                      }}
                      bgcolor={Colors.buttoncolorhgreen}
                      title={Lang_chg.BookOnlineAppointment[config.language]}
                    />
                  ) : this.state.pass_status === "doctor" ? (
                    <Appbtn2
                      onPressHandler={() => {
                        this.props.navigation.navigate("Booking", {
                          pass_status: this.state.pass_status,
                          nurse_id: this.state.nurse_id,
                          display: "taskbooking",
                          indexPosition: 0,
                        });
                      }}
                      bgcolor={Colors.buttoncolorhgreen}
                      title={Lang_chg.BookOnlineAppointment[config.language]}
                    />
                  ) : this.state.pass_status === "lab" ? (
                    <Appbtn2
                      onPressHandler={() => {
                        this.props.navigation.navigate("Booking", {
                          pass_status: this.state.pass_status,
                          nurse_id: this.state.nurse_id,
                          display: "testBooking",
                          indexPosition: 0,
                        });
                      }}
                      bgcolor={Colors.buttoncolorhgreen}
                      title={Lang_chg.BOOKLABTESTAPPOINTMENT[config.language]}
                    />
                  ) : (
                    item.task_base_enable == 0 && (
                      <Appbtn2
                        onPressHandler={() => {
                          this.props.navigation.navigate("Booking", {
                            pass_status: this.state.pass_status,
                            nurse_id: this.state.nurse_id,
                            display: "taskbooking",
                          });
                        }}
                        bgcolor={Colors.buttoncolorhgreen}
                        title={
                          Lang_chg.BOOKTASKBASEDAPPOINTMENT[config.language]
                        }
                      />
                    )
                  )}
                  {this.state.pass_status === "doctor" &&
                  !this.state.isFromHospital ? (
                    <Appbtn2
                      onPressHandler={() => {
                        this.props.navigation.navigate("Booking", {
                          pass_status: this.state.pass_status,
                          nurse_id: this.state.nurse_id,
                          display: "hourlybooking",
                          indexPosition: 1,
                        });
                      }}
                      bgcolor={Colors.Theme}
                      title={Lang_chg.BookHomeVisitAppointment[config.language]}
                    />
                  ) : (
                    item.hour_base_enable == 0 && (
                      <Appbtn2
                        onPressHandler={() => {
                          this.props.navigation.navigate("Booking", {
                            pass_status: this.state.pass_status,
                            nurse_id: this.state.nurse_id,
                            display: "hourlybooking",
                          });
                        }}
                        bgcolor={Colors.Theme}
                        title={Lang_chg.BOOKHOURLYAPPOINTMENT[config.language]}
                      />
                    )
                  )}
                  {this.state.pass_status === "lab" && (
                    <>
                      <View
                        style={{
                          width: "120%",
                          alignSelf: "center",
                          borderColor: Colors.bordercolor,
                          borderBottomWidth: (windowWidth * 0.5) / 100,
                          marginTop: (windowWidth * 5) / 100,
                        }}
                      />
                      <View
                        style={{
                          marginTop: (windowWidth * 5) / 100,
                          height:
                            item.available_package !== null
                              ? (windowWidth * 48) / 100
                              : (windowWidth * 20) / 100,
                          // paddingVertical: (windowWidth * 1) / 100,
                          elevation: 5,
                          shadowRadius: 2,
                          backgroundColor: "#fff",
                        }}
                      >
                        <View style={{ width: "100%", alignSelf: "center" }}>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItem: "center",
                            }}
                          >
                            <Text
                              style={{
                                textAlign: config.textalign,
                                fontFamily: Font.fontregular,
                                fontSize: (windowWidth * 4) / 100,
                              }}
                            >
                              {Lang_chg.HealthPackages[config.language]}
                            </Text>

                            {item.available_package !== null && (
                              <Text
                                onPress={() => {
                                  this.props.navigation.navigate(
                                    "LabPackageListing",
                                    { providerId: this.state.nurse_id }
                                  );
                                }}
                                style={{
                                  fontFamily: Font.fontregular,
                                  fontSize: Font.regulartext_size,
                                  color: Colors.Theme,
                                }}
                              >
                                {Lang_chg.See_all[config.language]}
                              </Text>
                            )}
                          </View>
                        </View>
                        <View
                          style={{
                            width: "100%",
                            backgroundColor: "#fff",
                            paddingVertical: (windowWidth * 3) / 100,
                            marginBottom: (windowWidth * 1) / 100,
                          }}
                        >
                          {item.available_package != null ? (
                            <FlatList
                              showsHorizontalScrollIndicator={false}
                              horizontal={true}
                              data={item.available_package}
                              renderItem={({ item, index }) => {
                                return (
                                  <TouchableOpacity
                                    onPress={() => {
                                      this.props.navigation.navigate(
                                        "LabPackageDetails",
                                        {
                                          packageId: item.pid,
                                          providerId: this.state.nurse_id,
                                        }
                                      );
                                    }}
                                    style={[
                                      {
                                        borderRadius: (windowWidth * 2) / 100,
                                        marginLeft: (windowWidth * 2) / 100,
                                        width: (windowWidth * 40) / 100,
                                        height: (windowWidth * 40) / 100,
                                        backgroundColor: "#fff",
                                        borderColor: "#DFDFDF",
                                        borderWidth: 1,
                                      },
                                    ]}
                                  >
                                    <Text
                                      style={{
                                        width: "100%",
                                        paddingVertical: (windowWidth * 1.5) / 100,
                                        paddingHorizontal: (windowWidth * 2) / 100,
                                        color: "#000",
                                        fontFamily: Font.fontmedium,
                                        fontSize: (windowWidth * 3.5) / 100,
                                        textAlign: "left",
                                      }}
                                    >
                                      {item.name}
                                    </Text>

                                    <Text
                                      style={{
                                        paddingVertical: (windowWidth * 2) / 100,
                                        paddingHorizontal: (windowWidth * 2) / 100,
                                        fontFamily: Font.fontregular,
                                        textAlign: "left",
                                        fontSize: Font.sregulartext_size,
                                      }}
                                    >
                                      {item.iso_certificate}
                                    </Text>
                                    <View
                                      style={{
                                        width: "90%",
                                        alignSelf: "center",
                                        borderColor: Colors.bordercolor,
                                        borderBottomWidth:
                                          (windowWidth * 0.5) / 100,
                                        marginTop: (windowWidth * 1) / 100,
                                      }}
                                    />
                                    <Text
                                      style={{
                                        paddingVertical: (windowWidth * 2) / 100,
                                        paddingHorizontal: (windowWidth * 2) / 100,
                                        fontFamily: Font.fontregular,
                                        textAlign: "left",
                                        color: Colors.buttoncolorhgreen,
                                        fontSize: Font.sregulartext_size,
                                      }}
                                    >
                                      {item.dis_off}
                                    </Text>
                                    <Text
                                      style={{
                                        paddingHorizontal: (windowWidth * 2) / 100,
                                        fontFamily: Font.fontregular,
                                        textAlign: "left",
                                        fontSize: Font.sregulartext_size,
                                        textDecorationLine: "line-through",
                                        textDecorationStyle: "solid",
                                      }}
                                    >
                                      {item.maxprice}
                                    </Text>
                                    <View
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
                                          fontFamily: Font.fontmedium,
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
                                          fontFamily: Font.fontsemibold,
                                          fontSize: Font.regulartext_size,
                                          color: Colors.Theme,
                                          textTransform: "uppercase",
                                        }}
                                      >
                                        {Lang_chg.Book[config.language]}
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                );
                              }}
                            />
                          ) : (
                            <Text
                              style={{
                                fontFamily: Font.fontregular,
                                fontSize: (windowWidth * 4) / 100,
                                alignSelf: "center",
                                paddingVertical: (windowWidth * 3) / 100,
                                textAlign: "center",
                                color: Colors.Theme,
                              }}
                            >
                              {Lang_chg.Packages_Unavailable[config.language]}
                            </Text>
                          )}
                        </View>
                      </View>
                    </>
                  )}
                </View>

                <View
                  style={{
                    width: "100%",
                    backgroundColor: Colors.orange,
                    paddingVertical: (windowWidth * 2) / 100,
                  }}
                >
                  <View
                    style={{
                      width: "95%",
                      backgroundColor: Colors.orange,
                      flexDirection: "row",
                      alignSelf: "center",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: "50%",
                      }}
                    >
                      <View style={{ width: "20%", alignSelf: "center" }}>
                        <Image
                          style={{
                            height: (windowWidth * 6) / 100,
                            width: (windowWidth * 6) / 100,
                            alignSelf: "center",
                            borderRadius: (windowWidth * 3) / 100,
                          }}
                          source={
                            this.state.pass_status == "nurse"
                              ? Icons.nurse
                              : this.state.pass_status == "physiotherapy"
                              ? Icons.Physiotherapist
                              : this.state.pass_status == "caregiver"
                              ? Icons.NurseAssistant
                              : this.state.pass_status == "babysitter"
                              ? Icons.Babysitter
                              : this.state.pass_status == "doctor"
                              ? Icons.Doctor
                              : this.state.pass_status == "lab"
                              ? Icons.Lab
                              : Icons.Doctor
                          }
                        />
                      </View>
                      {config.language == 0 ? (
                        <View style={{ width: "79%", alignSelf: "center" }}>
                          {this.state.pass_status == "nurse" ? (
                            <Text
                              style={{
                                color: Colors.white,
                                fontFamily: Font.fontmedium,
                                fontSize: (windowWidth * 3) / 100,
                                textTransform: "capitalize",
                                textAlign: config.textRotate,
                              }}
                            >
                              {Lang_chg.Nurse[config.language]}{" "}
                              {Lang_chg.Booking_detail[config.language]}{" "}
                            </Text>
                          ) : this.state.pass_status == "physiotherapy" ? (
                            <Text
                              style={{
                                color: Colors.white,
                                fontFamily: Font.fontmedium,
                                fontSize: (windowWidth * 3) / 100,
                                textTransform: "capitalize",
                                textAlign: config.textRotate,
                              }}
                            >
                              {Lang_chg.Physiotherapist[config.language]}{" "}
                              {Lang_chg.Booking_detail[config.language]}
                            </Text>
                          ) : this.state.pass_status == "caregiver" ? (
                            <Text
                              style={{
                                color: Colors.white,
                                fontFamily: Font.fontmedium,
                                fontSize: (windowWidth * 3) / 100,
                                textTransform: "capitalize",
                                textAlign: config.textRotate,
                              }}
                            >
                              {Lang_chg.Nurse_assistant[config.language]}{" "}
                              {Lang_chg.Booking_detail[config.language]}{" "}
                            </Text>
                          ) : this.state.pass_status == "babysitter" ? (
                            <Text
                              style={{
                                color: Colors.white,
                                fontFamily: Font.fontmedium,
                                fontSize: (windowWidth * 3) / 100,
                                textTransform: "capitalize",
                                textAlign: config.textRotate,
                              }}
                            >
                              {Lang_chg.Babysitter[config.language]}{" "}
                              {Lang_chg.Booking_detail[config.language]}{" "}
                            </Text>
                          ) : this.state.pass_status == "doctor" ? (
                            <Text
                              style={{
                                color: Colors.white,
                                fontFamily: Font.fontmedium,
                                fontSize: (windowWidth * 3) / 100,
                                textTransform: "capitalize",
                                textAlign: config.textRotate,
                              }}
                            >
                              {Lang_chg.Doctor[config.language]}{" "}
                              {Lang_chg.Booking_detail[config.language]}{" "}
                            </Text>
                          ) : this.state.pass_status === "lab" ? (
                            <Text
                              style={{
                                color: Colors.white,
                                fontFamily: Font.fontmedium,
                                fontSize: (windowWidth * 3) / 100,
                                textTransform: "capitalize",
                                textAlign: config.textRotate,
                              }}
                            >
                              {Lang_chg.Lab[config.language]}{" "}
                              {Lang_chg.Booking_detail[config.language]}{" "}
                            </Text>
                          ) : (
                            <Text
                              style={{
                                color: Colors.white,
                                fontFamily: Font.fontmedium,
                                fontSize: (windowWidth * 3) / 100,
                                textTransform: "capitalize",
                                textAlign: config.textRotate,
                              }}
                            >
                              {Lang_chg.Doctor[config.language]}{" "}
                              {Lang_chg.Booking_detail[config.language]}{" "}
                            </Text>
                          )}
                        </View>
                      ) : (
                        <View style={{ width: "79%", alignSelf: "center" }}>
                          {this.state.pass_status == "nurse" ? (
                            <Text
                              style={{
                                color: Colors.white,
                                fontFamily: Font.fontmedium,
                                fontSize: (windowWidth * 3) / 100,
                                textTransform: "capitalize",
                                textAlign: config.textRotate,
                              }}
                            >
                              {Lang_chg.Booking_detail[config.language]}{" "}
                              {Lang_chg.Nurse[config.language]}
                            </Text>
                          ) : this.state.pass_status == "physiotherapy" ? (
                            <Text
                              style={{
                                color: Colors.white,
                                fontFamily: Font.fontmedium,
                                fontSize: (windowWidth * 3) / 100,
                                textTransform: "capitalize",
                                textAlign: config.textRotate,
                              }}
                            >
                              {Lang_chg.Booking_detail[config.language]}{" "}
                              {Lang_chg.Physiotherapist[config.language]}
                            </Text>
                          ) : this.state.pass_status == "caregiver" ? (
                            <Text
                              style={{
                                color: Colors.white,
                                fontFamily: Font.fontmedium,
                                fontSize: (windowWidth * 3) / 100,
                                textTransform: "capitalize",
                                textAlign: config.textRotate,
                              }}
                            >
                              {Lang_chg.Booking_detail[config.language]}{" "}
                              {Lang_chg.Nurse_assistant[config.language]}{" "}
                            </Text>
                          ) : this.state.pass_status == "babysitter" ? (
                            <Text
                              style={{
                                color: Colors.white,
                                fontFamily: Font.fontmedium,
                                fontSize: (windowWidth * 3) / 100,
                                textTransform: "capitalize",
                                textAlign: config.textRotate,
                              }}
                            >
                              {Lang_chg.Booking_detail[config.language]}{" "}
                              {Lang_chg.Babysitter[config.language]}{" "}
                            </Text>
                          ) : this.state.pass_status == "doctor" ? (
                            <Text
                              style={{
                                color: Colors.white,
                                fontFamily: Font.fontmedium,
                                fontSize: (windowWidth * 3) / 100,
                                textTransform: "capitalize",
                                textAlign: config.textRotate,
                              }}
                            >
                              {Lang_chg.Booking_detail[config.language]}{" "}
                              {Lang_chg.Doctor[config.language]}{" "}
                            </Text>
                          ) : this.state.pass_status === "lab" ? (
                            <Text
                              style={{
                                color: Colors.white,
                                fontFamily: Font.fontmedium,
                                fontSize: (windowWidth * 3) / 100,
                                textTransform: "capitalize",
                                textAlign: config.textRotate,
                              }}
                            >
                              {Lang_chg.Booking_detail[config.language]}{" "}
                              {Lang_chg.Lab[config.language]}{" "}
                            </Text>
                          ) : (
                            <Text
                              style={{
                                color: Colors.white,
                                fontFamily: Font.fontmedium,
                                fontSize: (windowWidth * 3) / 100,
                                textTransform: "capitalize",
                                textAlign: config.textRotate,
                              }}
                            >
                              {Lang_chg.Booking_detail[config.language]}{" "}
                              {Lang_chg.Doctor[config.language]}{" "}
                            </Text>
                          )}
                        </View>
                      )}
                      <View
                        style={{
                          paddingVertical: (windowWidth * 2) / 100,
                          borderRightWidth: 1,
                          borderRightColor: "#fff",
                        }}
                      />
                    </View>
                    <View
                      style={{
                        width: "50%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.white,
                          fontFamily: Font.fontregular,
                          fontSize: Font.subtext,
                          marginLeft: (windowWidth * 3) / 100,
                          textAlign: "center",
                        }}
                      >
                        {Lang_chg.RootsCare[config.language]}
                      </Text>
                      <Text
                        onPress={() => this.setModalVisible(true)}
                        style={{
                          color: Colors.white,
                          fontFamily: Font.fontmedium,
                          fontSize: Font.subtext,
                        }}
                      >
                        {item.how_work_text}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              {this.state.pass_status !== "lab" && (
                <View
                  style={{
                    marginVertical: (windowWidth * 3) / 100,
                    height: (windowWidth * 65) / 100,
                    paddingVertical: (windowWidth * 3) / 100,
                    shadowOpacity: 0.3,
                    shadowColor: "#000",
                    shadowOffset: { width: 1, height: 1 },
                    elevation: 5,
                    shadowRadius: 2,
                    backgroundColor: "#fff",
                  }}
                >
                  <View style={{ width: "90%", alignSelf: "center" }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItem: "center",
                      }}
                    >
                      {this.state.pass_status == "nurse" ? (
                        <Text
                          style={{
                            textAlign: config.textalign,
                            fontFamily: Font.fontmedium,
                            fontSize: (windowWidth * 3.7) / 100,
                          }}
                        >
                          {Lang_chg.AvailableNurse[config.language]}
                        </Text>
                      ) : this.state.pass_status == "physiotherapy" ? (
                        <Text
                          style={{
                            textAlign: config.textalign,
                            fontFamily: Font.fontmedium,
                            fontSize: (windowWidth * 3.7) / 100,
                          }}
                        >
                          {Lang_chg.Availablephysotharpst[config.language]}
                        </Text>
                      ) : this.state.pass_status == "caregiver" ? (
                        <Text
                          style={{
                            textAlign: config.textalign,
                            fontFamily: Font.fontmedium,
                            fontSize: (windowWidth * 3.7) / 100,
                          }}
                        >
                          {Lang_chg.Availableassistent[config.language]}
                        </Text>
                      ) : this.state.pass_status == "babysitter" ? (
                        <Text
                          style={{
                            textAlign: config.textalign,
                            fontFamily: Font.fontmedium,
                            fontSize: (windowWidth * 3.7) / 100,
                          }}
                        >
                          {Lang_chg.Availablebabysitter[config.language]}
                        </Text>
                      ) : this.state.pass_status == "doctor" ? (
                        <Text
                          style={{
                            textAlign: config.textalign,
                            fontFamily: Font.fontmedium,
                            fontSize: (windowWidth * 3.7) / 100,
                          }}
                        >
                          {Lang_chg.AvailableDoctor[config.language]}
                        </Text>
                      ) : this.state.pass_status === "lab" ? (
                        <Text
                          style={{
                            textAlign: config.textalign,
                            fontFamily: Font.fontmedium,
                            fontSize: (windowWidth * 3.7) / 100,
                          }}
                        >
                          {Lang_chg.AvailableLab[config.language]}
                        </Text>
                      ) : (
                        <Text
                          style={{
                            textAlign: config.textalign,
                            fontFamily: Font.fontmedium,
                            fontSize: (windowWidth * 3.7) / 100,
                          }}
                        >
                          {Lang_chg.AvailableDoctor[config.language]}
                        </Text>
                      )}

                      <Text
                        onPress={() => {
                          this.props.navigation.goBack();
                        }}
                        style={{
                          fontFamily: Font.fontsemibold,
                          fontSize: Font.regulartext_size,
                          color: Colors.Theme,
                        }}
                      >
                        {Lang_chg.See_all[config.language]}
                      </Text>
                    </View>
                    {item.available_provider != "" ? (
                      <View
                        style={{
                          alignSelf: "flex-start",
                          marginTop: (windowWidth * 4) / 100,
                        }}
                      >
                        <FlatList
                          showsHorizontalScrollIndicator={false}
                          horizontal={true}
                          data={item.available_provider}
                          renderItem={({ item, index }) => {
                            return (
                              <View style={{ width: (windowWidth * 36) / 100 }}>
                                <TouchableOpacity
                                  activeOpacity={0.9}
                                  onPress={() => {
                                    this.get_Services(),
                                      this.setState({
                                        nurse_id: item.user_id,
                                        isFromHospital: false,
                                      });
                                  }}
                                  style={{
                                    width: (windowWidth * 32) / 100,
                                    marginRight: (windowWidth * 4) / 100,
                                    borderWidth: 1,
                                    borderColor: Colors.Border,
                                    // shadowOpacity: 0.3,
                                    // shadowColor:'#000',
                                    // shadowOffset:{width:1,height:1},
                                    // elevation:5,
                                    // shadowRadius: 2,
                                    backgroundColor: "#fff",
                                    // borderColor:'#DFDFDF',
                                    // borderWidth:1,
                                    borderRadius: (windowWidth * 2) / 100,
                                    paddingBottom: (windowWidth * 3) / 100,
                                    marginBottom: 3,
                                    // alignItems:'center'
                                  }}
                                >
                                  <ImageBackground
                                    imageStyle={{
                                      backgroundColor:
                                        Colors.Border,
                                      borderTopLeftRadius:
                                        (windowWidth * 1.7) / 100,
                                      borderTopRightRadius:
                                        (windowWidth * 1.7) / 100,
                                    }}
                                    style={{
                                      borderRadius: (windowWidth * 2) / 100,
                                      width: "100%",
                                      height: (windowWidth * 28) / 100,
                                      alignSelf: "center",
                                    }}
                                    source={
                                      item.image == "NA" || item.image == null
                                        ? Icons.p1
                                        : { uri: config.img_url3 + item.image }
                                    }
                                  >
                                    <View
                                      style={{
                                        borderRadius: (windowWidth * 1) / 100,
                                        paddingHorizontal: (windowWidth * 2) / 100,
                                        paddingVertical: (windowWidth * 1) / 100,
                                        position: "absolute",
                                        bottom: 3,
                                        left: 5,
                                        flexDirection: "row",
                                        alignItems: "center",

                                        backgroundColor:
                                          Colors.buttoncolorhgreen,
                                      }}
                                    >
                                      <Image
                                        source={Icons.starrating}
                                        style={{
                                          tintColor: "#fff",
                                          width: 10,
                                          height: 10,
                                          alignSelf: "center",
                                        }}
                                      />
                                      <Text
                                        style={{
                                          fontFamily: Font.fontregular,
                                          fontSize: (windowWidth * 2.5) / 100,
                                          color: Colors.white,
                                          marginLeft: (windowWidth * 1.2) / 100,
                                        }}
                                      >
                                        {item.avg_rating}.0
                                      </Text>
                                    </View>
                                  </ImageBackground>
                                  <View
                                    style={{
                                      marginTop: (windowWidth * 1) / 100,
                                      width: "90%",
                                      //  backgroundColor:'red',
                                      alignSelf: "center",
                                    }}
                                  >
                                    <Text
                                      style={{
                                        color: "#000",
                                        fontSize: (windowWidth * 3) / 100,
                                        marginTop: (windowWidth * 1) / 100,
                                        fontFamily: Font.fontmedium,
                                        textAlign: config.textRotate,
                                      }}
                                      numberOfLines={1}
                                    >
                                      {item.provider_name}
                                    </Text>
                                    <Text
                                      style={{
                                        color: "#8F98A7",
                                        fontSize: (windowWidth * 3) / 100,
                                        marginTop: (windowWidth * 1) / 100,
                                        fontFamily: Font.fontregular,
                                        textAlign: config.textRotate,
                                      }}
                                      numberOfLines={1}
                                    >
                                      {item.qualification}
                                    </Text>
                                    <Text
                                      style={{
                                        color: "#0888D1",
                                        fontSize: (windowWidth * 3) / 100,
                                        marginTop: (windowWidth * 1) / 100,
                                        fontFamily: Font.fontregular,
                                        textAlign: config.textRotate,
                                      }}
                                      numberOfLines={1}
                                    >
                                      {item.speciality}
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                              </View>
                            );
                          }}
                        />
                      </View>
                    ) : (
                      <Text
                        style={{
                          fontFamily: Font.fontregular,
                          fontSize: (windowWidth * 3.5) / 100,
                          color: Colors.Theme,
                          textAlign: "center",
                          marginTop: (windowWidth * 5) / 100,
                        }}
                      >
                        {Lang_chg.Not_available_for_booking[config.language]}
                      </Text>
                    )}
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        )}
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
                  backgroundColor: Colors.white,
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
                    backgroundColor: "red",
                    width: "95%",
                    alignSelf: "flex-end",
                    backgroundColor: Colors.white,
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
                        fontFamily: Font.fontregular,
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

        {/* {this.state.nurse_data != null && this.state.nurse_data != "" && (
          <HideWithKeyboard>
            <Footer
              activepage="Home"
              usertype={1}
              footerpage={[
                {
                  name: "Home",
                  fname: Lang_chg.home_footer[config.language],
                  countshow: false,
                  image: Icons.Home,
                  activeimage: Icons.Home,
                },
                {
                  name: "Appointment",
                  fname: Lang_chg.Appointment_footer[config.language],
                  countshow: false,
                  image: Icons.Appointment,
                  activeimage: Icons.Appointment,
                },
                {
                  name: "Cart",
                  fname: Lang_chg.Cart_footer[config.language],
                  countshow: false,
                  image: Icons.Cart,
                  activeimage: Icons.Cart,
                },
                {
                  name: "More",
                  fname: Lang_chg.More_footer[config.language],
                  countshow: false,
                  image: Icons.More,
                  activeimage: Icons.More,
                },
              ]}
              navigation={this.props.navigation}
              imagestyle1={{
                width: 25,
                height: 25,
                paddingBottom: (windowWidth * 5.4) / 100,
                backgroundColor: "white",
                countcolor: "red",
                countbackground: "red",
              }}
            />
          </HideWithKeyboard>
        )} */}
      </View>
    );
  }
}
const HTMLstyles = StyleSheet.create({
  h4: {
    color: "#0888D1",
    fontSize: (windowWidth * 4.5) / 100,
    //marginBottom:20,
    // make links coloured pink
  },
  h5: {
    color: "#0888D1", // make links coloured pink
    fontSize: (windowWidth * 4.3) / 100,
    fontFamily: Font.fontmedium,
    // paddingBottom:20,
  },
});
