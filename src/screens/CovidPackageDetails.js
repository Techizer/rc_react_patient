import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { View } from "react-native-animatable";
import HTMLView from "react-native-htmlview";
import { config } from "../Provider/configProvider";
import {
  apifuntion,
  Colors,
  consolepro,
  Font,
  Lang_chg,
  localimag,
  localStorage,
  mobileW,
  msgProvider,
} from "../Provider/utilslib/Utils";
import Styles from "../Styles";

const CovidPackageDetails = (props) => {
  const { navigation } = props;
  const [covidTestDetailsData, setCovidTestDetailsData] = useState();
  const [taskDetails, setTaskDetails] = useState(false);
  const [index, setIndex] = useState(0);
  const [showTaskDetails, isShowTaskDetails] = useState(false);

  useEffect(() => {
    getCovidPackageList();
  }, []);

  useEffect(() => {
    if (covidTestDetailsData !== undefined) {
      updateStatus(index);
    }
  }, [showTaskDetails]);

  const getCovidPackageList = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];
    let url = config.baseURL + "api-covid-test-details";
    console.log("url", url);

    var data = new FormData();
    data.append("lgoin_user_id", user_id);

    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data, 0)
      .then((obj) => {
        consolepro.consolelog("response ---> ", JSON.stringify(obj));

        if (obj.status == true) {
          setCovidTestDetailsData(obj.result);
          setTaskDetails(obj.result.task_details);
        } else {
          msgProvider.showError(obj.message);
          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
      });
  };

  const updateStatus = (index) => {
    console.log("showTaskDetails", showTaskDetails);
    let data = covidTestDetailsData.task_details;
    console.log("new data", data);
    for (let i = 0; i < data.length; i++) {
      if (i == index) {
        data[i].status = showTaskDetails;
      } else {
        data[i].status = false;
      }
    }
    setTaskDetails([...taskDetails]);
    console.log("taskDetails ", taskDetails);
  };

  return (
    <View style={Styles.container1}>
      <View style={{ backgroundColor: "#f1f2f4", flex: 1 }}>
        <View
          style={{
            padding: (mobileW * 2.5) / 100,
            flexDirection: "row",
            width: "99%",
            alignSelf: "center",
            paddingTop: (mobileW * 3) / 100,
            backgroundColor: Colors.white_color,
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "10%",
              alignSelf: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Image
                source={
                  config.textalign == "right"
                    ? localimag.arabic_back
                    : localimag.backarrow
                }
                style={{
                  resizeMode: "contain",
                  width: (mobileW * 9) / 100,
                  alignSelf: "center",
                  height: (mobileW * 9) / 100,
                }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: "80%",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontFamily: Font.fontmedium,
                fontSize: (mobileW * 4) / 100,
              }}
            >
              {Lang_chg.PackageDetails[config.language]}
            </Text>
          </View>
        </View>
        {covidTestDetailsData != null && covidTestDetailsData != "" && (
          <>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View>
                <View
                  style={{
                    backgroundColor: "#fff",
                    marginVertical: (mobileW * 3) / 100,
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ width: "45%" }}>
                      <Text
                        style={{
                          width: "100%",
                          marginTop: (mobileW * 3) / 100,
                          paddingHorizontal: (mobileW * 4) / 100,
                          color: Colors.lightgraytext,
                          fontFamily: Font.fontmedium,
                          fontSize: (mobileW * 4.5) / 100,
                          textAlign: "left",
                        }}
                      >
                        {covidTestDetailsData.cheading}
                      </Text>
                      {covidTestDetailsData.ctitle != null && (
                        <Text
                          style={{
                            fontFamily: Font.fontregular,
                            marginTop: (mobileW * 2) / 100,
                            paddingHorizontal: (mobileW * 4) / 100,
                            fontSize: Font.buttontext_size,
                            textAlign: config.textRotate,
                            color: Colors.lightgraytext,
                          }}
                        >
                          {covidTestDetailsData.ctitle}
                        </Text>
                      )}
                    </View>
                    <View
                      style={{
                        width: "55%",
                        flexDirection: "row",
                        marginTop: (mobileW * 2) / 100,
                      }}
                    >
                      {/* image and store name */}

                      <View style={{ width: "33%" }}>
                        <Image
                          source={
                            covidTestDetailsData.lab_image == "NA" ||
                            covidTestDetailsData.lab_image == null ||
                            covidTestDetailsData.lab_image == ""
                              ? localimag.p1
                              : {
                                  uri:
                                    config.img_url3 +
                                    covidTestDetailsData.lab_image,
                                }
                          }
                          style={{
                            width: (mobileW * 15) / 100,
                            height: (mobileW * 15) / 100,
                            borderWidth: 1,
                            borderColor: "#0888D1",
                            borderRadius: (mobileW * 10) / 100,
                          }}
                        />
                      </View>

                      <View
                        style={{
                          width: "50%",
                          alignSelf: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Font.fontmedium,
                            fontSize: Font.name,
                            color: Colors.lightgraytext,
                            textAlign: config.textRotate,
                          }}
                        >
                          {covidTestDetailsData.lab_name}
                        </Text>
                        <Text
                          style={{
                            paddingVertical: (mobileW * 1.5) / 100,
                            fontFamily: Font.fontregular,
                            fontSize: Font.subtext,
                            color: Colors.theme_color,
                            textAlign: config.textRotate,
                          }}
                        >
                          {covidTestDetailsData.lab_content}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {covidTestDetailsData.ccontent != null && (
                    <HTMLView
                      value={covidTestDetailsData.ccontent}
                      stylesheet={{
                        p: {
                          fontSize: Font.subtext,
                          paddingHorizontal: (mobileW * 4) / 100,
                          color: Colors.lightgraytext,
                          marginTop: (mobileW * 3) / 100,
                          marginBottom: (mobileW * 3) / 100,
                          fontFamily: Font.fontregular,
                        },
                      }}
                    />
                  )}
                </View>
              </View>

              <View
                style={{
                  width: (mobileW * 100) / 100,
                  alignSelf: "center",
                  alignItems: "flex-start",
                }}
              >
                <FlatList
                  data={taskDetails}
                  extraData={taskDetails}
                  contentContainerStyle={{
                    paddingBottom: (mobileW * 10) / 100,
                  }}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item, index }) => {
                    if (
                      taskDetails != "" &&
                      taskDetails != null &&
                      taskDetails.length !== 0
                    ) {
                      return (
                        <View>
                          <View
                            style={{
                              width: "100%",
                              justifyContent: "flex-start",
                              paddingTop: (mobileW * 3) / 100,
                              backgroundColor: "#fff",
                              marginBottom: (mobileW * 3) / 100,
                            }}
                          >
                            <Text
                              style={{
                                width: "90%",
                                fontSize: Font.subtext,
                                color: Colors.lightgraytext,
                                fontFamily: Font.fontmedium,
                                paddingHorizontal: (mobileW * 2) / 100,
                                textAlign: "left",
                              }}
                            >
                              {item.name}
                            </Text>

                            <Text
                              style={{
                                width: "90%",
                                fontSize: Font.subtext,
                                color: Colors.textgray,
                                marginTop: (mobileW * 1) / 100,
                                fontFamily: Font.fontmedium,
                                paddingHorizontal: (mobileW * 2) / 100,
                                textAlign: "left",
                              }}
                            >
                              {item.sub_heading}
                            </Text>

                            <View
                              style={{
                                width: "100%",
                                flexDirection: "row",
                                justifyContent: "flex-start",
                                marginTop: (mobileW * 3) / 100,
                                paddingHorizontal: (mobileW * 2) / 100,
                              }}
                            >
                              <View
                                style={{
                                  width: "50%",
                                }}
                              >
                                <Text
                                  style={{
                                    fontFamily: Font.fontregular,
                                    textAlign: "left",
                                    fontSize: Font.sregulartext_size,
                                    marginTop: (mobileW * 3) / 100,
                                    color: Colors.tablightcolo,
                                    textDecorationLine: "line-through",
                                    textDecorationStyle: "solid",
                                  }}
                                >
                                  {item.offerprice !== "" ? item.price : ""}
                                </Text>

                                <View
                                  style={{
                                    paddingVertical: (mobileW * 2) / 100,
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    alignItem: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      textAlign: config.textalign,
                                      fontFamily: Font.fontmedium,
                                      fontSize: (mobileW * 4) / 100,
                                    }}
                                  >
                                    {item.offerprice !== ""
                                      ? item.offerprice
                                      : item.price}
                                  </Text>

                                  {item.dis_off !== "" && (
                                    <View
                                      style={{
                                        paddingVertical: (mobileW * 0.5) / 100,
                                        paddingHorizontal: (mobileW * 3) / 100,
                                        marginHorizontal: (mobileW * 4) / 100,
                                        borderColor: Colors.buttoncolorhgreen,
                                        color: Colors.buttoncolorhgreen,
                                        borderRadius: 5,
                                        borderStyle: "dotted",
                                        borderWidth: 1,
                                      }}
                                    >
                                      <Text
                                        style={{
                                          fontFamily: Font.fontregular,
                                          textAlign: "left",
                                          color: Colors.textGreenColor,
                                          fontSize: Font.sregulartext_size,
                                        }}
                                      >
                                        {item.dis_off}
                                      </Text>
                                    </View>
                                  )}
                                </View>
                              </View>

                              <View
                                style={{
                                  width: "50%",
                                }}
                              >
                                <Text
                                  style={{
                                    fontFamily: Font.fontregular,
                                    textAlign: "left",
                                    fontSize: Font.sregulartext_size,
                                    marginTop: (mobileW * 3) / 100,
                                    color: Colors.tablightcolo,
                                  }}
                                >
                                  {item.result_text}
                                </Text>

                                <Text
                                  style={{
                                    paddingVertical: (mobileW * 2) / 100,
                                    textAlign: config.textalign,
                                    fontFamily: Font.fontmedium,
                                    fontSize: (mobileW * 4) / 100,
                                  }}
                                >
                                  {item.result_time}
                                </Text>
                              </View>
                            </View>
                            {item.pcontent != null && item.pcontent !== "" && (
                              <View
                                style={{
                                  width: "100%",
                                  flexDirection: "row",
                                  backgroundColor: "#FFF2D9",
                                }}
                              >
                                <View
                                  style={{
                                    width: "90%",
                                    alignSelf: "flex-start",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontFamily: Font.fontregular,
                                      fontSize: Font.headingfont_booking,
                                      color: Colors.precautionText,
                                      // marginTop: (mobileW * 2) / 100,
                                      paddingHorizontal: (mobileW * 2) / 100,
                                      paddingVertical: (mobileW * 2) / 100,
                                      textAlign: config.textRotate,
                                    }}
                                  >
                                    {item.pheading}
                                  </Text>
                                  {item.status && (
                                    <View
                                      style={{
                                        paddingHorizontal: (mobileW * 2) / 100,
                                      }}
                                    >
                                      <HTMLView
                                        value={item.pcontent}
                                        stylesheet={{
                                          p: {
                                            fontSize: Font.subtext,
                                            color: Colors.lightgraytext,
                                            fontFamily: Font.fontregular,
                                          },
                                        }}
                                      />
                                    </View>
                                  )}
                                </View>
                                <TouchableOpacity
                                  onPress={() => {
                                    console.log("index----> ", index);
                                    if (
                                      item.pcontent !== "" &&
                                      item.pcontent !== null
                                    ) {
                                      isShowTaskDetails(!showTaskDetails);
                                      setIndex(index);
                                    }
                                  }}
                                  style={{
                                    width: "10%",
                                    marginTop: (mobileW * 3) / 100,
                                    // paddingVertical: (mobileW * 2) / 100,
                                  }}
                                >
                                  <Image
                                    style={{
                                      height: (mobileW * 4.5) / 100,
                                      width: (mobileW * 4.5) / 100,
                                    }}
                                    source={
                                      item.status
                                        ? localimag.upArrow
                                        : localimag.downarrow
                                    }
                                  />
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        </View>
                      );
                    }
                  }}
                />
              </View>
            </ScrollView>

            <View
              style={{
                width: "100%",
                alignSelf: "center",
                backgroundColor: Colors.white_color,
                paddingHorizontal: (mobileW * 5) / 100,
                paddingVertical: (mobileW * 2) / 100,
                height: 80,
                justifyContent: "center", //Centered horizontally
                alignItems: "center", //Centered vertically
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Booking", {
                    pass_status: "lab",
                    nurse_id: "497",
                    indexPosition: 0,
                  });
                }}
                style={{
                  width: "100%",
                  borderRadius: (mobileW * 3) / 100,
                  backgroundColor: Colors.buttoncolorblue,
                  paddingVertical: (mobileW * 3) / 100,
                }}
              >
                <Text
                  style={{
                    color: Colors.textwhite,
                    fontFamily: Font.fontmedium,
                    fontSize: Font.buttontextsize,
                    alignSelf: "flex-end",
                    textAlign: config.textalign,
                    alignSelf: "center",
                  }}
                >
                  {Lang_chg.BOOKNOW[config.language]}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
};
export default CovidPackageDetails;
