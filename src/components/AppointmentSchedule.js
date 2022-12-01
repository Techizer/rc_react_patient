import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { Colors, Font } from "../Provider/Colorsfont";
import { Lang_chg } from "../Provider/Language_provider";
import {
  apifuntion,
  config,
  consolepro,
  Icons,
  localStorage,
  windowWidth,
} from "../Provider/utilslib/Utils";

const AppointmentSchedule = (props) => {
  const {
    set_date,
    providerId,
    serviceType,
    date_array,
    check_currentdate,
    timcurrent_for_check,
  } = props;
  const [date, setDate] = useState(set_date);
  const [timeArr, setTimeArr] = useState([]);
  const [finalOne, setFinalOne] = useState([]);
  const [finalArr2, setFinalArr2] = useState([]);

  useEffect(() => {
    getDoctorTimeDate();
  }, []);

  getDoctorTimeDate = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];

    let url = config.baseURL + "api-patient-doctor-next-date-time";
    console.log("url", url);

    var data = new FormData();
    data.append("provider_id", providerId);
    data.append("date", date);
    data.append("service_type", serviceType);

    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        console.log("misdhfbs ", obj);

        if (obj.status == true) {
          consolepro.consolelog("obj.result", obj.result);
          if (obj.result.home_visit_time != "") {
            var names = obj.result.home_visit_time;
            var nameArr = names.split(",");

            console.log("Arr2", Arr2);

            const new_time_dlot = [];
            const Arr1 = [];
            const Arr2 = [];
            var ar1 = false;
            var ar2 = true;
            if (names != "") {
              for (let l = 0; l < nameArr.length; l++) {
                if (check_currentdate == date) {
                  const timeStr = nameArr[l];

                  const convertTime = (timeStr) => {
                    const [time, modifier] = timeStr.split(" ");
                    let [hours, minutes] = time.split(":");
                    if (hours === "12") {
                      hours = "00";
                    }
                    if (modifier === "PM") {
                      hours = parseInt(hours, 10) + 12;
                    }
                    return `${hours}:${minutes}`;
                  };
                  var finaltime = convertTime(timeStr);
                  console.log(
                    "finaltime: ",
                    finaltime,
                    " this.state.timcurrent_for_check",
                    timcurrent_for_check
                  );
                  console.log(
                    "check: ",
                    finaltime >= timcurrent_for_check,
                    l,
                    nameArr[l]
                  );
                  if (finaltime >= timcurrent_for_check) {
                    new_time_dlot.push({
                      time: nameArr[l],
                      time_status: false,
                    });
                    // if ((l + 2) % 2 == 0) {
                    if (!ar1) {
                      ar1 = true;
                      ar2 = false;
                      Arr1.push({ time: nameArr[l], time_status: false });
                    } else {
                      ar1 = false;
                      ar2 = true;
                      Arr2.push({ time: nameArr[l], time_status: false });
                    }
                  }
                } else {
                  new_time_dlot.push({ time: nameArr[l], time_status: false });
                  // if ((l + 2) % 2 == 0) {
                  if (!ar1) {
                    ar1 = true;
                    ar2 = false;
                    Arr1.push({ time: nameArr[l], time_status: false });
                  } else {
                    ar1 = false;
                    ar2 = true;
                    Arr2.push({ time: nameArr[l], time_status: false });
                  }
                }
              }
            }

            this.setState({
              time_Arr: new_time_dlot,
              final_one: Arr1,
              final_arr2: Arr2,
            });
          } else {
            this.setState({ time_Arr: obj.result.home_visit_time });
          }
        } else {
          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
      });
  };

  return (
    <View
      style={{
        width: "100%",
        shadowOpacity: 0.3,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        elevation: 2,
        shadowRadius: 2,
        marginTop: (windowWidth * 1.5) / 100,
        marginBottom: (windowWidth * 1.5) / 100,
        backgroundColor: "#fff",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "93%",
          alignSelf: "center",
          paddingTop: (windowWidth * 4) / 100,
        }}
      >
        <Text
          style={{
            fontFamily: Font.fontmedium,
            fontSize: Font.name,
            width: "65%",
            textAlign: config.textRotate,
            fontSize: (windowWidth * 3.5) / 100,
          }}
        >
          {Lang_chg.Appointmentschedule[config.language]}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "35%",
            justifyContent: "flex-end",
          }}
        >
          <View style={{ width: "20%", alignSelf: "center" }}>
            <Image
              style={{
                width: (windowWidth * 5) / 100,
                height: (windowWidth * 5) / 100,
                alignSelf: "center",
              }}
              source={Icons.calendarimg}
            />
          </View>

          <Text
            style={{
              color: Colors.Theme,
              fontFamily: Font.fontmedium,
              fontSize: Font.name,
              alignSelf: "center",
              marginLeft: (windowWidth * 1) / 100,
              textAlign: "right",
            }}
          >
            {date}
          </Text>
        </View>
      </View>
      <View
        style={{
          borderWidth: 1,
          borderColor: Colors.gainsboro,
          width: "100%",
          marginTop: (windowWidth * 1.5) / 100,
          marginBottom: (windowWidth * 1.5) / 100,
        }}
      />

      <View
        style={{
          width: "93%",
          alignSelf: "center",
          paddingBottom: (windowWidth * 3) / 100,
        }}
      >
        <Text
          style={{
            fontFamily: Font.fontregular,
            fontSize: Font.subtext,
            textAlign: config.textRotate,
            color: "#000",
          }}
        >
          {Lang_chg.SelectDate[config.language]}
        </Text>
        <View style={{ width: "100%" }}>
          <FlatList
            horizontal={true}
            data={date_array}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setDate(item.date1);
                    getDoctorTimeDate();
                    props.sendData(item, index);
                  }}
                  style={{ width: (windowWidth * 15) / 100 }}
                >
                  <Text
                    style={{
                      marginRight: (windowWidth * 3) / 100,
                      marginTop: (windowWidth * 3) / 100,
                      backgroundColor:
                        item.tick == 1 ? "#0787D2" : Colors.lightGrey,
                      color: item.tick == 1 ? "White" : "black",
                      textAlign: "center",
                      paddingVertical: (windowWidth * 2) / 100,
                      fontFamily: Font.ques_fontfamily,
                      fontSize: Font.sregulartext_size,

                      lineHeight: (windowWidth * 5) / 100,
                    }}
                  >
                    {item.day}
                    {"\n"}

                    {item.datenew}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
      <View
        style={{
          width: "93%",
          alignSelf: "center",
          paddingBottom: (windowWidth * 3) / 100,
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
          {Lang_chg.Select_start_time[config.language]}
        </Text>

        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={{ width: "100%", alignItems: "center" }}>
            <View style={{ width: "100%", alignItems: "center" }}>
              {this.state.time_Arr != "" ? (
                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <View style={{ width: "100%" }}>
                    <FlatList
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      data={this.state.final_one}
                      renderItem={({ item, index }) => {
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({
                                time_take_data: item.time,
                              });
                            }}
                          >
                            <Text
                              style={[
                                {
                                  marginRight: (windowWidth * 3) / 100,
                                  marginTop: (windowWidth * 3) / 100,
                                  fontFamily: Font.ques_fontfamily,
                                  fontSize: Font.sregulartext_size,
                                  padding: (windowWidth * 2) / 100,
                                  paddingHorizontal: (windowWidth * 3.3) / 100,
                                },
                                item.time == this.state.time_take_data
                                  ? {
                                      backgroundColor: Colors.Theme,
                                      color: "#fff",
                                    }
                                  : {
                                      backgroundColor: Colors.lightGrey,
                                      color: "#000",
                                    },
                              ]}
                            >
                              {item.time}
                            </Text>
                          </TouchableOpacity>
                        );
                      }}
                    />
                  </View>
                  <View style={{ width: "100%" }}>
                    <FlatList
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      data={this.state.final_arr2}
                      renderItem={({ item, index }) => {
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({
                                time_take_data: item.time,
                              });
                            }}
                          >
                            <Text
                              style={[
                                {
                                  marginRight: (windowWidth * 3) / 100,
                                  marginTop: (windowWidth * 3) / 100,
                                  fontFamily: Font.ques_fontfamily,
                                  fontSize: Font.sregulartext_size,
                                  padding: (windowWidth * 2) / 100,
                                  paddingHorizontal: (windowWidth * 3.3) / 100,
                                },
                                item.time == this.state.time_take_data
                                  ? {
                                      backgroundColor: Colors.Theme,
                                      color: "#fff",
                                    }
                                  : {
                                      backgroundColor: Colors.lightGrey,
                                      color: "#000",
                                    },
                              ]}
                            >
                              {item.time}
                            </Text>
                          </TouchableOpacity>
                        );
                      }}
                    />
                  </View>
                </View>
              ) : (
                <Text
                  style={{
                    fontFamily: Font.fontMediumItalic,
                    fontSize: (windowWidth * 4) / 100,
                    alignSelf: "center",
                    paddingVertical: (windowWidth * 3) / 100,
                    textAlign: "center",
                    marginLeft: (windowWidth * 32) / 100,
                  }}
                >
                  {Lang_chg.no_data_Found[config.language]}
                </Text>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
export default AppointmentSchedule;
