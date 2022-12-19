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
import { s, vs } from "react-native-size-matters";
import ScreenHeader from "../components/ScreenHeader";
import { leftArrow, Notification } from "../icons/SvgIcons/Index";
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

const CovidPackageDetails = ({ navigation }) => {

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
    <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>

      <ScreenHeader
        title={Lang_chg.PackageDetails[config.language]}
        navigation={navigation}
        onBackPress={() => navigation.pop()}
        leftIcon={leftArrow}
        rightIcon={Notification}
      />


      {covidTestDetailsData != null && covidTestDetailsData != "" && (
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                backgroundColor: Colors.White,
                marginTop: vs(7),
                paddingHorizontal: s(13),
                paddingVertical: vs(10)
              }}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                }}>
                <View style={{ width: "45%" }}>
                  <Text
                    style={{
                      width: "100%",
                      color: Colors.detailTitles,
                      fontFamily: Font.Medium,
                      fontSize: Font.xlarge,
                      textAlign: "left",
                    }}>
                    {covidTestDetailsData.cheading}
                  </Text>
                  {covidTestDetailsData.ctitle != null && (
                    <Text
                      style={{
                        fontFamily: Font.Regular,
                        marginTop: vs(5),
                        fontSize: Font.medium,
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
                    alignItems: 'center'
                  }}>
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
                        fontFamily: Font.Medium,
                        fontSize: Font.name,
                        color: Colors.detailTitles,
                        textAlign: config.textRotate,
                      }}
                    >
                      {covidTestDetailsData.lab_name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: Font.Regular,
                        fontSize: Font.medium,
                        color: Colors.Theme,
                        textAlign: config.textRotate,
                        marginTop: vs(5),
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
                      fontSize: Font.medium,
                      color: Colors.DarkGrey,
                      marginTop: vs(9),
                      fontFamily: Font.Regular,
                    },
                  }}
                />
              )}
            </View>


            <View
              style={{
                width: windowWidth,
                alignSelf: "center",
                marginTop: vs(7),
              }}>
              <FlatList
                data={taskDetails}
                extraData={taskDetails}
                contentContainerStyle={{
                  paddingBottom: (windowWidth * 10) / 100,
                }}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => {
                  return (
                    <View style={{ height: vs(7) }}></View>
                  )
                }}
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
                            backgroundColor: Colors.White,
                            paddingHorizontal: s(13),
                            paddingVertical: vs(10),
                          }}>
                          <Text
                            style={{
                              width: "90%",
                              fontSize: Font.medium,
                              color: Colors.lightGrey,
                              fontFamily: Font.Medium,
                              textAlign: "left",
                            }}>
                            {item.name}
                          </Text>

                          {
                            item.sub_heading ?
                              <Text
                                style={{
                                  width: "90%",
                                  fontSize: Font.medium,
                                  color: Colors.lightGrey,
                                  marginTop: (windowWidth * 1) / 100,
                                  fontFamily: Font.Medium,
                                  textAlign: config.textRotate,
                                }}>
                                {item.sub_heading}
                              </Text>
                              :
                              null
                          }

                          <View
                            style={{
                              width: "100%",
                              flexDirection: "row",
                              justifyContent: "flex-start",
                              marginTop: (windowWidth * 3) / 100,
                              
                            }} >
                            <View
                              style={{
                                width: "50%",
                              }} >
                              <Text
                                style={{
                                  fontFamily: Font.Regular,
                                  textAlign: "left",
                                  fontSize: Font.medium,
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
                                }} >
                                <Text
                                  style={{
                                    textAlign: config.textalign,
                                    fontFamily: Font.Medium,
                                    fontSize: (windowWidth * 4) / 100,
                                  }} >
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
                                        fontFamily: Font.Regular,
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
                                width: "50%"
                              }}>
                              <Text
                                style={{
                                  fontFamily: Font.Regular,
                                  textAlign: "left",
                                  fontSize: Font.sregulartext_size,
                                  marginTop: (windowWidth * 3) / 100,
                                  color: Colors.lightGrey,
                                }}>
                                {item.result_text}
                              </Text>

                              <Text
                                style={{
                                  paddingVertical: (windowWidth * 2) / 100,
                                  textAlign: config.textRotate,
                                  fontFamily: Font.Medium,
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
                                    fontFamily: Font.Regular,
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
                                          fontFamily: Font.Regular,
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
                  nurse_id: "497", //live "595", //demo "497",
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
                  fontFamily: Font.Medium,
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
  );
};
export default CovidPackageDetails;
