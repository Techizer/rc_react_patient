import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, TouchableHighlight } from "react-native";
import { View } from "react-native-animatable";
import HTMLView from "react-native-htmlview";
import { s, vs } from "react-native-size-matters";
import { useSelector } from "react-redux";
import LoadingSkeleton from "../Components/LoadingSkeleton";
import NoInternet from "../Components/NoInternet";
import { ScreenHeader } from "../Components/ScreenHeader";
import { config } from "../Provider/configProvider";
import {
  apifuntion,
  Colors,
  Font,
  LangProvider,
  Icons,
  windowWidth,
  msgProvider,
} from "../Provider/Utils/Utils";

const LabPackageDetails = ({ navigation, route }) => {

  const { loggedInUserDetails,deviceConnection, guest, appLanguage, languageIndex } = useSelector(state => state.StorageReducer)

  const { packageId, providerId } = route.params;
  const [labDetailsData, setLabDetailsData] = useState();
  const [showTaskDetails, isShowTaskDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if(deviceConnection){
      getPackageDetails();
    }
  }, [deviceConnection]);

  const getPackageDetails = async () => {

    let url = config.baseURL + "api-get-package-details";

    var data = new FormData();
    data.append("lgoin_user_id", loggedInUserDetails?.user_id);
    data.append("provider_id", providerId);
    data.append("package_id", packageId);
    apifuntion
      .postApi(url, data, 0)
      .then((obj) => {
        setIsLoading(false)
        console.log("getPackageDetails-response ---> ", JSON.stringify(obj));
        if (obj.status == true) {
          setLabDetailsData(obj.result);
        } else {
          msgProvider.showError(obj.message);
          return false;
        }
      }).catch((error) => {
        setIsLoading(false)
        console.log("LabPackageDetails-error ------- " + error);
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>

      <ScreenHeader
        title={'Package Details'}
        navigation={navigation}
        onBackPress={() => navigation.pop()}
        leftIcon
      />

      {
        (labDetailsData != null && labDetailsData != "" && !isLoading) ? (
          <>
            <View
              style={{
                width: '100%',
                paddingTop: s(9),
                paddingBottom: labDetailsData.task_sub_content != null ? 0 : vs(9),
                backgroundColor: Colors.White,
                marginTop: vs(7)
              }}>
              <View style={{
                paddingHorizontal: s(13),
              }}>

                <Text
                  style={{
                    width: "100%",
                    color: Colors.detailTitles,
                    fontFamily: Font.Medium,
                    fontSize: Font.xlarge,
                    textAlign: "left",
                  }}>
                  {labDetailsData.name}
                </Text>
                <Text
                  style={{
                    fontFamily: Font.Regular,
                    textAlign: "left",
                    color: Colors.Theme,
                    fontSize: Font.small,
                    marginTop: vs(5)
                  }}
                >
                  {labDetailsData.task_count}
                </Text>
                <Text
                  style={{
                    marginTop: vs(10),
                    alignSelf: 'flex-start',
                    fontFamily: Font.Regular,
                    fontSize: Font.medium,
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
                        fontSize: Font.medium,
                        alignSelf: 'flex-start',
                        color: Colors.detailTitles,
                      }}>
                      {labDetailsData.task_heading}
                    </Text>
                    <HTMLView
                      value={labDetailsData.task_content}
                      stylesheet={{
                        p: {
                          fontSize: Font.xsmall,
                          color: Colors.detailTitles,
                          marginTop: vs(8),
                          fontFamily: Font.Regular,
                        },
                      }}
                    />
                  </>
                )}
              </View>

              {/* ----------------Precautions------------------ */}

              {labDetailsData.task_sub_content != null && (
                <View
                  style={{
                    width: "100%",
                    alignSelf: "flex-start",
                    backgroundColor: "#FFF2D9",
                    paddingHorizontal: s(13),
                    paddingVertical: vs(9),
                    marginTop: vs(7)
                  }}>
                  <Text
                    style={{
                      fontFamily: Font.Bold,
                      fontSize: Font.xsmall,
                      color: Colors.precautionText,
                      alignSelf: 'flex-start'
                    }}>
                    {labDetailsData.task_sub_heading}
                  </Text>
                  <HTMLView
                    value={labDetailsData.task_sub_content}
                    stylesheet={{
                      p: {
                        fontSize: Font.xsmall,
                        color: Colors.detailTitles,
                        marginTop: vs(4),
                        fontFamily: Font.Regular,
                      },
                    }}
                  />
                </View>
              )}
            </View>

            {
              labDetailsData.task_name.length > 0 &&
              <View
                style={{
                  width: '100%',
                  alignSelf: "center",
                  alignItems: "flex-start",
                  marginTop: vs(7),
                  paddingHorizontal: s(13),
                  paddingVertical: vs(10),
                  backgroundColor: Colors.White
                }}>
                <Text
                  style={{
                    width: "100%",
                    color: Colors.detailTitles,
                    fontFamily: Font.Regular,
                    fontSize: Font.xlarge,
                    textAlign: "left",
                  }}>
                  {LangProvider.TestsIncluded[languageIndex]}
                </Text>

                <FlatList
                  data={labDetailsData.task_name}
                  contentContainerStyle={{
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
                          }}>
                          <View
                            style={{
                              width: "100%",
                              flexDirection: "row",
                              justifyContent: 'space-between',
                              marginTop: (windowWidth * 2) / 100,
                            }}>
                            <Text
                              style={{
                                width: "92%",
                                fontSize: Font.small,
                                color: Colors.Theme,
                                fontFamily: Font.Regular,
                                textAlign: "left",
                              }} >
                              {item.name}
                            </Text>
                            {item.subtask !== "" && item.subtask !== null && (
                              <TouchableHighlight
                                underlayColor={Colors.Highlight}
                                onPress={() => {
                                  if (item.subtask !== "" && item.subtask !== null) {
                                    isShowTaskDetails(!showTaskDetails);
                                  }
                                }}
                                style={{
                                  width: "8%",
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  height: vs(15)
                                }}>
                                <Image
                                  style={{
                                    height: (windowWidth * 4) / 100,
                                    width: (windowWidth * 4) / 100,
                                  }}
                                  source={
                                    showTaskDetails
                                      ? Icons.upArrow
                                      : Icons.downarrow
                                  }
                                />
                              </TouchableHighlight>
                            )}
                          </View>
                          {showTaskDetails && (
                            <Text
                              style={{
                                paddingVertical: vs(2),
                                paddingHorizontal: s(15),
                                fontFamily: Font.Regular,
                                textAlign: "left",
                                color: Colors.dullGrey,
                                fontSize: Font.xsmall,
                              }}>
                              {item.subtask}
                            </Text>
                          )}
                        </TouchableOpacity>
                      );
                    }
                  }}
                />
              </View>
            }
          </>
        )
          :
          <LoadingSkeleton />
      }
     
    </View>
  );
};

export default LabPackageDetails;
