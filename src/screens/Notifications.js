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
  LangProvider,
  apifuntion,
  ScreenHeader,
  msgProvider
} from "../Provider/Utils/Utils";
import { leftArrow } from "../Icons/Index";
import { s, vs } from "react-native-size-matters";
import { useDispatch, useSelector } from "react-redux";
import NoInternet from "../Components/NoInternet";
import { UnReadNotifications } from "../Redux/Actions";

const Notifications = ({ navigation }) => {

  const { loggedInUserDetails, languageIndex, deviceConnection, contentAlign } = useSelector(state => state.StorageReducer)

  const [statesData, setStatesData] = useState({
    isLoading: true,
    notificat_id: "",
    notificationdata: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    modalVisible: false,
    body_name: "",
    message: "",
    isReadAll: true
  })
  const dispatch=useDispatch()
  const insets = useSafeAreaInsets()

  const setState = payload => {
    setStatesData(prev => ({
      ...prev,
      ...payload
    }))
  }

  useEffect(() => {
    if (deviceConnection) {
      get_notification(1)
    }
  }, [deviceConnection])

  const get_notification = async (page) => {
    let apishow = "api-get-all-notification";

    let url = config.baseURL + apishow;

    var data = new FormData();
    data.append("id", loggedInUserDetails?.user_id);
    apifuntion
      .postApi(url, data, page)
      .then((obj) => {

        if (obj.status == true) {
          setState({ notificationdata: obj.result, message: obj.message });
          if (obj.result && obj.result.length > 0) {
            for (const iterator of obj.result) {
              if (iterator.read == '0') {
                console.log('unread');
                setState({ isReadAll: false })
                return
              }
            }
          } else {
            setState({ isReadAll: false })
          }
        } else {
          setState({ notificationdata: obj.result, message: obj.message});
          return false;
        }
      }).catch((error) => {
        setState({ notificationdata: [], isLoading: false });
        console.log("get_notification-error ------- " + error);
      }).finally(()=>{
        setState({isLoading: false });
      })
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
        console.log("update_notification-error ------- " + error);
      });
  };

  const ReadAll = async () => {
    let apishow = "api-update-all-notification";
    let url = config.baseURL + apishow;

    var data = new FormData();
    data.append("login_user_id", loggedInUserDetails?.user_id);
    apifuntion
      .postApi(url, data)
      .then((obj) => {

        if (obj.status == true) {
          dispatch(UnReadNotifications(0))
          msgProvider.showSuccess(obj.message)
          setState({ isReadAll: true })
        } else {
          msgProvider.showError(obj.message)
        }
      }).catch((error) => {
        msgProvider.showError(obj.message)
        console.log("ReadAll-error ------- " + error);
      }).finally(() => {
        get_notification(1)
      })
  };
  return (

    <View
      style={{
        flex: 1,
        // backgroundColor: Colors.White
      }}>

      <ScreenHeader
        title={LangProvider.NotificationsList[languageIndex]}
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
                      <SkeletonPlaceholder.Item width={(windowWidth * 70) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} style={{ marginLeft: s(15) }} />
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
              backgroundColor: Colors.Highlight
            }}>


            {!statesData.isReadAll &&
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={ReadAll}
                style={{
                  width: '40%',
                  height: 30,
                  paddingHorizontal: '4%',
                  justifyContent: 'center',
                  alignItems: 'flex-start'
                }}
              >
                <Text
                  style={{
                    fontSize: Font.large,
                    fontFamily: Font.Medium,
                    color: Colors.Theme,
                    textAlign: contentAlign

                  }}
                >
                  {LangProvider.ReadAll[languageIndex]}
                </Text>
              </TouchableOpacity>}

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
                  contentContainerStyle={{  paddingBottom: insets.bottom }}
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
                              fontSize: Font.small,
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
                                fontSize: Font.small,
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
                  {LangProvider.Notification[languageIndex]}
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
                  {LangProvider.OK[languageIndex]}
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