import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity } from "react-native";
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

const LabPackageDetails = (props) => {
  const { navigation } = props;
  const { packageId, providerId } = props.route.params;
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
        <View
          style={{
            backgroundColor: "#fff",
            paddingVertical: (mobileW * 2) / 100,
            borderBottomWidth: 1,
            borderBottomColor: Colors.LIGHT_CLIENT_BORDER,
          }}
        >
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
        </View>
        {labDetailsData != null && labDetailsData != "" && (
          <>
            <View>
              <View
                style={{
                  backgroundColor: "#fff",
                }}
              >
                <Text
                  style={{
                    width: "100%",
                    marginTop: (mobileW * 3) / 100,
                    paddingHorizontal: (mobileW * 4) / 100,
                    color: "#000",
                    fontFamily: Font.fontmedium,
                    fontSize: (mobileW * 4.5) / 100,
                    textAlign: "left",
                  }}
                >
                  {labDetailsData.name}
                </Text>
                <Text
                  style={{
                    paddingVertical: (mobileW * 2) / 100,
                    paddingHorizontal: (mobileW * 4) / 100,
                    fontFamily: Font.fontregular,
                    textAlign: "left",
                    color: Colors.theme_color,
                    fontSize: Font.sregulartext_size,
                  }}
                >
                  {labDetailsData.task_count}
                </Text>
                <Text
                  style={{
                    paddingVertical: (mobileW * 2) / 100,
                    paddingHorizontal: (mobileW * 4) / 100,
                    textAlign: config.textalign,
                    fontFamily: Font.fontmedium,
                    fontSize: (mobileW * 5) / 100,
                  }}
                >
                  {labDetailsData.price}
                </Text>
                <View
                  style={{
                    width: "100%",
                    paddingHorizontal: (mobileW * 4) / 100,
                    alignSelf: "center",
                    borderColor: Colors.bordercolor,
                    borderBottomWidth: (mobileW * 0.2) / 100,
                    marginTop: (mobileW * 1) / 100,
                  }}
                />
                {labDetailsData.task_content != null && (
                  <>
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
                      {labDetailsData.task_heading}
                    </Text>
                    <HTMLView
                      value={labDetailsData.task_content}
                      stylesheet={{
                        p: {
                          fontSize: Font.subtext,
                          paddingHorizontal: (mobileW * 4) / 100,
                          color: Colors.lightgraytext,
                          marginTop: (mobileW * 2) / 100,
                          fontFamily: Font.fontregular,
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
                        fontFamily: Font.fontregular,
                        fontSize: Font.headingfont_booking,
                        color: Colors.precautionText,
                        paddingHorizontal: (mobileW * 4) / 100,
                        marginTop: (mobileW * 2) / 100,
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
                          paddingHorizontal: (mobileW * 4) / 100,
                          color: Colors.lightgraytext,
                          marginTop: (mobileW * 2) / 100,
                          fontFamily: Font.fontregular,
                        },
                      }}
                    />
                  </View>
                )}
              </View>
            </View>
            <View
              style={{
                width: (mobileW * 100) / 100,
                backgroundColor: "#fff",
                alignSelf: "center",
                alignItems: "flex-start",
                marginTop: (mobileW * 2) / 100,
              }}
            >
              <Text
                style={{
                  width: "100%",
                  marginTop: (mobileW * 3) / 100,
                  paddingHorizontal: (mobileW * 2) / 100,
                  color: "#000",
                  fontFamily: Font.fontregular,
                  fontSize: (mobileW * 4) / 100,
                  textAlign: "left",
                }}
              >
                {Lang_chg.TestsIncluded[config.language]}
              </Text>
              <FlatList
                data={labDetailsData.task_name}
                contentContainerStyle={{
                  paddingBottom: (mobileW * 10) / 100,
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
                            // paddingVertical: (mobileW * 1) / 100,
                            marginTop: (mobileW * 3) / 100,
                            paddingHorizontal: (mobileW * 2) / 100,
                          }}
                        >
                          <Text
                            style={{
                              width: "90%",
                              fontSize: Font.subtext,
                              color: Colors.theme_color,
                              fontFamily: Font.fontmedium,
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
                                  height: (mobileW * 4.5) / 100,
                                  width: (mobileW * 4.5) / 100,
                                }}
                                source={
                                  showTaskDetails
                                    ? localimag.upArrow
                                    : localimag.downarrow
                                }
                              />
                            </View>
                          )}
                        </View>
                        {showTaskDetails && (
                          <Text
                            style={{
                              paddingTop: (mobileW * 2) / 100,
                              paddingHorizontal: (mobileW * 4) / 100,
                              fontFamily: Font.fontregular,
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
