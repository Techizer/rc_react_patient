import React, { Component, useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  ScrollView,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import {
  Colors,
  Font,
  config,
  windowWidth,
  Icons,
  consolepro,
  Lang_chg,
  apifuntion,
  ScreenHeader
} from "../Provider/utilslib/Utils";
import { leftArrow } from "../Icons/Index";
import { s, vs } from "react-native-size-matters";
import { useSelector } from "react-redux";

const Notifications = ({ navigation }) => {

  const { loggedInUserDetails, guest, appLanguage } = useSelector(state => state.StorageReducer)

  const [statesData, setStatesData] = useState({
    isLoading: true,
    languageIndex: appLanguage == 'en' ? 0 : 1,
    notificat_id: "",
    notificationdata: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    modalVisible: false,
    body_name: "",
    message: "",
  })
  const insets = useSafeAreaInsets()

  const setState = payload => {
    setStatesData(prev => ({
      ...prev,
      ...payload
    }))
  }

  useEffect(() => {
    get_notification()
  }, [])

  const get_notification = async (page) => {
    let apishow = "api-get-all-notification";

    let url = config.baseURL + apishow;

    var data = new FormData();
    data.append("id", loggedInUserDetails.user_id);
    apifuntion
      .postApi(url, data, page)
      .then((obj) => {

        if (obj.status == true) {
          setState({ notificationdata: obj.result, message: obj.message, isLoading: false });
        } else {
          setState({ notificationdata: obj.result, message: obj.message, isLoading: false });
          return false;
        }
      })
      .catch((error) => {
        setState({ notificationdata: [], isLoading: false });
        consolepro.consolelog("-------- error ------- " + error);
      });
  };

  const update_notification = async () => {
    let apishow = "api-update-notification";
    let url = config.baseURL + apishow;

    var data = new FormData();
    data.append("id", statesData.notificat_id);
    data.append("read", 1);
    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {

        get_notification(1);
        if (obj.status == true) {
          // setTimeout(() => {
          //  },100);
        } else {
          setState({
            appoinment_detetails: obj.result,
            message: obj.message,
          });
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
        flex: 1,
        // backgroundColor: Colors.White
      }}>

      <ScreenHeader
        title={Lang_chg.NotificationsList[statesData.languageIndex]}
        navigation={navigation}
        onBackPress={() => navigation.pop()}
        leftIcon
      />

      {
        statesData.isLoading ?


          <FlatList
            data={statesData.notificationdata}
            // contentContainerStyle={{  paddingBottom: insets.bottom }}
            renderItem={({ item, index }) => {
              return (
                <View style={{
                  // height: vs(100),
                  width: windowWidth,
                  backgroundColor: Colors.White,
                  paddingHorizontal: s(11),
                  paddingVertical: vs(9),
                  marginTop: vs(7),
                }}>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: 'center',
                      width: "100%",
                      alignSelf: "center",
                      borderBottomWidth: 1.5,
                      borderBottomColor: Colors.backgroundcolor,
                      paddingBottom: vs(5)
                    }} >
                    <SkeletonPlaceholder>
                      <SkeletonPlaceholder.Item width={(windowWidth * 7) / 100} height={(windowWidth * 7) / 100} borderRadius={s(20)} />
                    </SkeletonPlaceholder>

                    <SkeletonPlaceholder>
                      <SkeletonPlaceholder.Item width={(windowWidth * 70) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} style={{marginLeft:s(15)}} />
                    </SkeletonPlaceholder>
                  </View>

                  <View style={{
                    flexDirection: "row",
                    alignItems: 'center',
                    width: "100%",
                    alignSelf: "center",
                    marginTop: vs(7),
                  }}>

                      <SkeletonPlaceholder>
                        <SkeletonPlaceholder.Item width={(windowWidth * 30) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                      </SkeletonPlaceholder>

                    
                  </View>
                </View>
              );
            }}
          />
          :
          <View
            style={{
              flex: 1,
              paddingBottom: insets.bottom,
              backgroundColor: Colors.Highlight
            }}>

            {statesData.notificationdata == "" ||
              (statesData.notificationdata == null && (
                <View>
                  <Text
                    style={{
                      textAlign: "center",
                      color: Colors.Theme,
                      fontFamily: Font.Medium,
                      fontSize: (windowWidth * 3.5) / 100,
                      marginTop: (windowWidth * 60) / 100,
                    }}
                  >
                    {statesData.message}
                  </Text>
                </View>
              ))}

            {statesData.notificationdata != "" &&
              statesData.notificationdata != null && (
                <FlatList
                  data={statesData.notificationdata}
                  // contentContainerStyle={{  paddingBottom: insets.bottom }}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => {
                          update_notification(),
                            setState({
                              body_name: item.body,
                              notificat_id: item.id,
                              modalVisible: true,
                            });
                        }}
                        style={{
                          flexDirection: "row",
                          backgroundColor: Colors.White,
                          marginTop: vs(7),
                          backgroundColor: "#fff",
                          shadowOpacity: 0.1,
                          shadowColor: Colors.DarkGrey,
                          shadowOffset: { width: 1, height: 1 },
                          // elevation: 5,
                        }}
                      >
                        <View
                          style={[
                            {
                              width: s(4),
                            },
                            item.read == "1"
                              ? { backgroundColor: "#515C6F" }
                              : { backgroundColor: Colors.Theme },
                          ]}
                        />
                        <View
                          style={{
                            width: "15%",
                            paddingTop: (windowWidth * 4) / 100,
                            paddingRight: (windowWidth * 2) / 100,
                          }}>
                          {/* <SvgXml xml={notiCount > 0 ? redNoti : Notification} height={vs(20.26)} width={s(16.21)} /> */}
                          <Image
                            source={Icons.Notification}
                            style={{
                              alignSelf: "center",
                              width: s(16.21),
                              height: vs(20.26),
                              tintColor: item.read == "0" ? Colors.Blue : Colors.DarkGrey
                            }}
                            resizeMode={'contain'}
                          />
                        </View>
                        <View
                          style={{
                            width: "80%",
                            paddingTop: (windowWidth * 4) / 100,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: Font.Regular,
                              fontSize: Font.sregulartext_size,
                              lineHeight: (windowWidth * 4.2) / 100,
                              alignSelf: 'flex-start',
                              textAlign: 'left',
                              color: Colors.lightGrey,
                              paddingBottom: (windowWidth * 2.1) / 100,
                            }}
                          >
                            {item.body}
                          </Text>
                          <View
                            style={{
                              flexDirection: "row",
                              borderTopWidth: (windowWidth * 0.3) / 100,
                              borderColor: Colors.gainsboro,
                              alignSelf: "flex-start",
                              paddingVertical: (windowWidth * 2) / 100,
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: Font.Regular,
                                fontSize: Font.sregulartext_size,
                                color: Colors.lightGrey,
                              }}
                            >
                              {item.datetime}
                              {"  •  "}
                              {item.date}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
              )}
          </View>
      }





      <Modal
        animationType="slide"
        transparent={true}
        visible={statesData.modalVisible}
        onRequestClose={() => {
          setState({ modalVisible: false });
        }}
      >
        <View
          style={{
            backgroundColor: "#00000080",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
            marginTop: -50,
          }}
        >
          <View
            style={{
              borderRadius: 20,
              width: (windowWidth * 90) / 100,
              position: "absolute",
              alignSelf: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 2,
                width: "100%",
                paddingVertical: (windowWidth * 3) / 100,
              }}
            >
              <View
                style={{
                  alignSelf: "flex-start",
                  width: (windowWidth * 50) / 100,
                  paddingBottom: (windowWidth * 3) / 100,
                  marginTop: (windowWidth * 2) / 100,
                  paddingLeft: (windowWidth * 4) / 100,
                  flexDirection: "row",
                }}
              >
                <Image
                  style={{
                    width: (windowWidth * 6) / 100,
                    height: (windowWidth * 6) / 100,
                  }}
                  source={Icons.logoPlain}
                />
                <Text
                  style={{
                    fontFamily: Font.Medium,
                    color: "#000",
                    fontSize: (windowWidth * 5) / 100,
                    paddingLeft: (windowWidth * 4) / 100,
                  }}
                >
                  {Lang_chg.Notification[statesData.languageIndex]}
                </Text>
              </View>
              <View
                style={{
                  alignSelf: "flex-start",
                  paddingVertical: (windowWidth * 1) / 100,
                  paddingLeft: (windowWidth * 4) / 100,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: Font.Regular,
                    color: "#000",
                    fontSize: (windowWidth * 4) / 100,
                    width: "90%",
                  }}
                >
                  {statesData.body_name}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  setState({ modalVisible: false });
                }}
                activeOpacity={0.8}
                style={{
                  width: (windowWidth * 20) / 100,
                  justifyContent: "flex-end",
                  alignSelf: "flex-end",
                  marginTop: (windowWidth * 3) / 100,
                }}
              >
                <Text
                  style={{
                    fontFamily: Font.Regular,
                    fontSize: (windowWidth * 4) / 100,
                    color: Colors.Blue,
                    alignSelf: "center",
                  }}
                >
                  {Lang_chg.OK[statesData.languageIndex]}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


    </View>
  );

}

export default Notifications;