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
  Icons,
  localStorage,
  windowWidth,
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
            padding: (windowWidth * 2.5) / 100,
            flexDirection: "row",
            width: "99%",
            alignSelf: "center",
            paddingTop: (windowWidth * 3) / 100,
            backgroundColor: Colors.White,
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
                    ? Icons.arabic_back
                    : Icons.backarrow
                }
                style={{
                  resizeMode: "contain",
                  width: (windowWidth * 9) / 100,
                  alignSelf: "center",
                  height: (windowWidth * 9) / 100,
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
                fontSize: (windowWidth * 4) / 100,
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
                    marginVertical: (windowWidth * 3) / 100,
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
                          marginTop: (windowWidth * 3) / 100,
                          paddingHorizontal: (windowWidth * 4) / 100,
                          color: Colors.lightGrey,
                          fontFamily: Font.fontmedium,
                          fontSize: (windowWidth * 4.5) / 100,
                          textAlign: "left",
                        }}
                      >
                        {covidTestDetailsData.cheading}
                      </Text>
                      {covidTestDetailsData.ctitle != null && (
                        <Text
                          style={{
                            fontFamily: Font.fontregular,
                            marginTop: (windowWidth * 2) / 100,
                            paddingHorizontal: (windowWidth * 4) / 100,
                            fontSize: Font.buttontext_size,
                            textAlign: config.textRotate,
                            color: Colors.lightGrey,
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
                        marginTop: (windowWidth * 2) / 100,
                      }}
                    >
                      {/* image and store name */}

                      <View style={{ width: "33%" }}>
                        <Image
                          source={
                            covidTestDetailsData.lab_image == "NA" ||
                            covidTestDetailsData.lab_image == null ||
                            covidTestDetailsData.lab_image == ""
                              ? Icons.p1
                              : {
                                  uri:
                                    config.img_url3 +
                                    covidTestDetailsData.lab_image,
                                }
                          }
                          style={{
                            width: (windowWidth * 15) / 100,
                            height: (windowWidth * 15) / 100,
                            borderWidth: 1,
                            borderColor: "#0888D1",
                            borderRadius: (windowWidth * 10) / 100,
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
                            color: Colors.lightGrey,
                            textAlign: config.textRotate,
                          }}
                        >
                          {covidTestDetailsData.lab_name}
                        </Text>
                        <Text
                          style={{
                            paddingVertical: (windowWidth * 1.5) / 100,
                            fontFamily: Font.fontregular,
                            fontSize: Font.subtext,
                            color: Colors.Theme,
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
                          paddingHorizontal: (windowWidth * 4) / 100,
                          color: Colors.lightGrey,
                          marginTop: (windowWidth * 3) / 100,
                          marginBottom: (windowWidth * 3) / 100,
                          fontFamily: Font.fontregular,
                        },
                      }}
                    />
                  )}
                </View>
              </View>

              <View
                style={{
                  width: (windowWidth * 100) / 100,
                  alignSelf: "center",
                  alignItems: "flex-start",
                }}
              >
                <FlatList
                  data={taskDetails}
                  extraData={taskDetails}
                  contentContainerStyle={{
                    paddingBottom: (windowWidth * 10) / 100,
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
                              paddingTop: (windowWidth * 3) / 100,
                              backgroundColor: "#fff",
                              marginBottom: (windowWidth * 3) / 100,
                            }}
                          >
                            <Text
                              style={{
                                width: "90%",
                                fontSize: Font.subtext,
                                color: Colors.lightGrey,
                                fontFamily: Font.fontmedium,
                                paddingHorizontal: (windowWidth * 2) / 100,
                                textAlign: "left",
                              }}
                            >
                              {item.name}
                            </Text>

                            <Text
                              style={{
                                width: "90%",
                                fontSize: Font.subtext,
                                color: Colors.lightGrey,
                                marginTop: (windowWidth * 1) / 100,
                                fontFamily: Font.fontmedium,
                                paddingHorizontal: (windowWidth * 2) / 100,
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
                                marginTop: (windowWidth * 3) / 100,
                                paddingHorizontal: (windowWidth * 2) / 100,
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
                                    marginTop: (windowWidth * 3) / 100,
                                    color: Colors.lightGrey,
                                    textDecorationLine: "line-through",
                                    textDecorationStyle: "solid",
                                  }}
                                >
                                  {item.offerprice !== "" ? item.price : ""}
                                </Text>

                                <View
                                  style={{
                                    paddingVertical: (windowWidth * 2) / 100,
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
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
                                    {item.offerprice !== ""
                                      ? item.offerprice
                                      : item.price}
                                  </Text>

                                  {item.dis_off !== "" && (
                                    <View
                                      style={{
                                        paddingVertical: (windowWidth * 0.5) / 100,
                                        paddingHorizontal: (windowWidth * 3) / 100,
                                        marginHorizontal: (windowWidth * 4) / 100,
                                        borderColor: Colors.Green,
                                        color: Colors.Green,
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
                                    marginTop: (windowWidth * 3) / 100,
                                    color: Colors.lightGrey,
                                  }}
                                >
                                  {item.result_text}
                                </Text>

                                <Text
                                  style={{
                                    paddingVertical: (windowWidth * 2) / 100,
                                    textAlign: config.textalign,
                                    fontFamily: Font.fontmedium,
                                    fontSize: (windowWidth * 4) / 100,
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
                                      // marginTop: (windowWidth * 2) / 100,
                                      paddingHorizontal: (windowWidth * 2) / 100,
                                      paddingVertical: (windowWidth * 2) / 100,
                                      textAlign: config.textRotate,
                                    }}
                                  >
                                    {item.pheading}
                                  </Text>
                                  {item.status && (
                                    <View
                                      style={{
                                        paddingHorizontal: (windowWidth * 2) / 100,
                                      }}
                                    >
                                      <HTMLView
                                        value={item.pcontent}
                                        stylesheet={{
                                          p: {
                                            fontSize: Font.subtext,
                                            color: Colors.lightGrey,
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
                                    marginTop: (windowWidth * 3) / 100,
                                    // paddingVertical: (windowWidth * 2) / 100,
                                  }}
                                >
                                  <Image
                                    style={{
                                      height: (windowWidth * 4.5) / 100,
                                      width: (windowWidth * 4.5) / 100,
                                    }}
                                    source={
                                      item.status
                                        ? Icons.upArrow
                                        : Icons.downarrow
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
                backgroundColor: Colors.White,
                paddingHorizontal: (windowWidth * 5) / 100,
                paddingVertical: (windowWidth * 2) / 100,
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
                  borderRadius: (windowWidth * 3) / 100,
                  backgroundColor: Colors.Theme,
                  paddingVertical: (windowWidth * 3) / 100,
                }}
              >
                <Text
                  style={{
                    color: Colors.White,
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
