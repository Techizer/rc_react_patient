import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity } from "react-native";
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

const LabPackageDetails = ({navigation, route}) => {
  
  const { packageId, providerId } = route.params;
  const [labDetailsData, setLabDetailsData] = useState();
  const [showTaskDetails, isShowTaskDetails] = useState(false);
  console.log("providerId ", packageId);

  useEffect(() => {
    getPackageList();
  }, []);

  const getPackageList = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];
    let url = config.baseURL + "api-get-package-details";
    console.log("url", url);

    var data = new FormData();
    data.append("lgoin_user_id", user_id);
    data.append("provider_id", providerId);
    data.append("package_id", packageId);

    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data, 0)
      .then((obj) => {
        consolepro.consolelog("response ---> ", JSON.stringify(obj));

        if (obj.status == true) {
          setLabDetailsData(obj.result);
        } else {
          msgProvider.showError(obj.message);
          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
      });
  };

  return (
    <View style={Styles.container1}>
      <View style={{ backgroundColor: "#f1f2f4", flex: 1 }}>

        <ScreenHeader
          title={'Package Details'}
          navigation={navigation}
          onBackPress={() => navigation.pop()}
          leftIcon={leftArrow}
          rightIcon={Notification}
        />
        {labDetailsData != null && labDetailsData != "" && (
          <>
              <View
                style={{
                  backgroundColor: "pink",
                  paddingHorizontal:s(11)
                }}>
                <Text
                  style={{
                    width: "100%",
                    marginTop: vs(9),
                    color: Colors.Black,
                    fontFamily: Font.Medium,
                    fontSize: Font.xxlarge,
                    textAlign: "left",
                  }}
                >
                  {labDetailsData.name}
                </Text>
                <Text
                  style={{
                    paddingVertical: vs(6),
                    fontFamily: Font.Regular,
                    textAlign: "left",
                    color: Colors.Theme,
                    fontSize: Font.sregulartext_size,
                  }}
                >
                  {labDetailsData.task_count}
                </Text>
                <Text
                  style={{
                    paddingTop: vs(7),
                    textAlign: config.textalign,
                    fontFamily: Font.Medium,
                    fontSize: Font.xxlarge,
                  }}
                >
                  {labDetailsData.price}
                </Text>
                
                <View style={{ width: '100%', height: 1.5, backgroundColor: Colors.backgroundcolor, marginVertical: vs(10) }}></View>

                {labDetailsData.task_content != null && (
                  <>
                    <Text
                      style={{
                        fontFamily: Font.Regular,
                        fontSize: Font.large,
                        textAlign: config.textRotate,
                        color: Colors.lightGrey,
                      }}
                    >
                      {labDetailsData.task_heading}
                    </Text>
                    <HTMLView
                      value={labDetailsData.task_content}
                      stylesheet={{
                        p: {
                          fontSize: Font.medium,
                          color: Colors.lightGrey,
                          marginTop: vs(8),
                          fontFamily: Font.Regular,
                        },
                      }}
                    />
                  </>
                )}
                {labDetailsData.task_sub_content != null && (
                  <View
                    style={{
                      width: "100%",
                      alignSelf: "flex-start",
                      backgroundColor: "#FFF2D9",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Font.Regular,
                        fontSize: Font.headingfont_booking,
                        color: Colors.precautionText,
                        marginTop: (windowWidth * 2) / 100,
                        textAlign: config.textRotate,
                      }}
                    >
                      {labDetailsData.task_sub_heading}
                    </Text>
                    <HTMLView
                      value={labDetailsData.task_sub_content}
                      stylesheet={{
                        p: {
                          fontSize: Font.subtext,
                          color: Colors.lightGrey,
                          marginTop: (windowWidth * 2) / 100,
                          fontFamily: Font.Regular,
                        },
                      }}
                    />
                  </View>
                )}
              </View>

            <View
              style={{
                width:'100%',
                backgroundColor: "red",
                alignSelf: "center",
                alignItems: "flex-start",
                marginTop: vs(7),
                paddingHorizontal:s(11),
                paddingVertical:vs(10)
              }}
            >
              <Text
                style={{
                  width: "100%",
                  color: Colors.Black,
                  fontFamily: Font.Regular,
                  fontSize: Font.large,
                  textAlign: "left",
                }}
              >
                {Lang_chg.TestsIncluded[config.language]}
              </Text>
              <FlatList
                data={labDetailsData.task_name}
                contentContainerStyle={{
                  paddingBottom: (windowWidth * 10) / 100,
                }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => {
                  if (
                    labDetailsData.task_name != "" &&
                    labDetailsData.task_name != null &&
                    labDetailsData.task_name.length !== 0
                  ) {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          if (item.subtask !== "" && item.subtask !== null) {
                            isShowTaskDetails(!showTaskDetails);
                          }
                        }}
                      >
                        <View
                          style={{
                            width: "100%",
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            // paddingVertical: (windowWidth * 1) / 100,
                            marginTop: (windowWidth * 3) / 100,
                          }}
                        >
                          <Text
                            style={{
                              width: "90%",
                              fontSize: Font.subtext,
                              color: Colors.Theme,
                              fontFamily: Font.Medium,
                              textAlign: "left",
                            }}
                          >
                            {item.name}
                          </Text>
                          {item.subtask !== "" && item.subtask !== null && (
                            <View
                              style={{
                                width: "10%",
                              }}
                            >
                              <Image
                                style={{
                                  height: (windowWidth * 4.5) / 100,
                                  width: (windowWidth * 4.5) / 100,
                                }}
                                source={
                                  showTaskDetails
                                    ? Icons.upArrow
                                    : Icons.downarrow
                                }
                              />
                            </View>
                          )}
                        </View>
                        {showTaskDetails && (
                          <Text
                            style={{
                              paddingTop: (windowWidth * 2) / 100,
                              paddingHorizontal: (windowWidth * 4) / 100,
                              fontFamily: Font.Regular,
                              textAlign: "left",
                              color: Colors.subTaskColor,
                              fontSize: Font.sregulartext_size,
                            }}
                          >
                            {item.subtask}
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  }
                }}
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default LabPackageDetails;
