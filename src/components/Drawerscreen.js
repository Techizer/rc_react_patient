import React, { Component, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Modal,
  Platform,
  Linking,
} from "react-native";
import {
  Colors,
  Font,
  msgProvider,
  config,
  windowWidth,
  Icons,
  Lang_chg,
  apifuntion,
} from "../Provider/utilslib/Utils";
import { dummyUser, leftArrow, rightArrow, Appointment, Consultations, AccountSetting, ManageAddress, HealthRecord, LabTest, LikeUs, SignOut, Orders, Support, Login } from "../Icons/Index";
// ----------------------------------------
import { DrawerActions } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ms, s, vs } from "react-native-size-matters";
import { SvgXml, SvgUri } from 'react-native-svg';
import DrawerItemContainer from "./DrawerItem";
import { useDispatch, useSelector } from "react-redux";
import { onLogout } from "../Redux/Actions";
let isGuest = false;

const Drawerscreen = ({ navigation }) => {

  const {
    appLanguage,
    deviceToken,
    deviceId,
    deviceName,
    deviceType,
    appVersion,
    contentAlign,
    guest,
    loggedInUserDetails,
    address,
    credentials,
    rememberMe,
  } = useSelector(state => state.StorageReducer)
  const dispatch = useDispatch()
  const insets = useSafeAreaInsets()


  const [drawerData, setDrawerData] = useState({
    languageIndex: appLanguage == 'ar' ? 1 : 0,
    modalVisible: false,
    profileImg: loggedInUserDetails ? config.img_url3 + loggedInUserDetails?.image : '',
    name: loggedInUserDetails ? loggedInUserDetails?.first_name : ''
  })



  const confirm_click = async () => {
    logoutApi();
  };

  const logoutApi = async () => {
    setDrawerData(prevState => ({
      ...prevState,
      modalVisible: false
    }))
    let url = config.baseURL + "api-logout";
    var data = new FormData();
    data.append("user_id", loggedInUserDetails?.user_id);

    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        console.log("logout response", obj);

        if (obj.status == true) {
          dispatch(onLogout({
            appLanguage,
            deviceToken,
            deviceId,
            deviceName,
            deviceType,
            appVersion,
            contentAlign,
            address,
            credentials,
            rememberMe,
          }))
          navigation.reset({
            index: 0,
            routes: [{ name: 'AuthStack' }],
          })
        } else {
          setTimeout(() => {
            // msgProvider.alert('', obj.message, false);
            msgProvider.showError(obj.message);
          }, 700);
          return false;
        }
      })
      .catch((error) => {
        console.log("-------- error ------- " + error);
      });
  };


  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, backgroundColor: Colors.backgroundcolor, paddingBottom: insets.bottom + Platform.OS === 'ios' ? vs(150) : vs(65), }}
      >
        <View
          style={{
            flex: 1,
            width: "100%",
            paddingBottom: Platform.OS === 'ios' ? vs(90) : vs(80),
          }}>
          {/* user Profile */}
          <TouchableOpacity
            disabled={guest ? true : false}
            onPress={() => navigation.navigate("EditProfile")}
            activeOpacity={0.7}
            style={{ width: '100%', alignItems: "center", flexDirection: 'row', paddingTop: vs(20), height: vs(130), backgroundColor: Colors.White }}>

            <View style={{ width: '31%' }} >
              {
                (drawerData.profileImg == "NA" || drawerData.profileImg == "" || drawerData.profileImg == null) ?
                  <SvgXml xml={dummyUser} style={{
                    alignSelf: "center",
                  }} />
                  :
                  // <SvgUri uri={this.state.profileImg} />
                  <Image
                    source={{ uri: drawerData.profileImg }}
                    style={{ height: s(85), width: s(85), borderRadius: s(85), backgroundColor: Colors.backgroundcolor, alignSelf: 'center' }}
                  />

              }
            </View>

            <View style={{ width: '69%' }} >

              <View style={{ width: '100%', flexDirection: 'row', }} >

                <View style={{ width: '80%', justifyContent: 'center' }}>
                  <Text
                    style={{
                      color: Colors.Black,
                      fontFamily: Font.Medium,
                      fontSize: Font.xxxlarge,
                      alignSelf: 'flex-start'

                    }}>
                    {guest ? 'Guest User' : drawerData.name}
                  </Text>
                </View>

                <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                  <SvgXml xml={
                    drawerData.languageIndex == 1
                      ? leftArrow : rightArrow
                  } height={vs(11.98)} width={s(6.42)} />
                </View>
              </View>

              <View style={{ width: '100%', }}>
                <TouchableOpacity
                  disabled={guest ? true : false}
                  activeOpacity={0.7}
                  onPress={() => {
                    setTimeout(() => {
                      navigation.navigate("EditProfile")
                    }, 350);
                  }}>
                  <Text
                    style={{
                      color: Colors.Primary,
                      fontFamily: Font.Medium,
                      fontSize: Font.medium,
                      alignSelf: 'flex-start',
                      opacity: (guest) ? 0.3 : 1,
                      marginTop: vs(5)

                    }}>
                    {drawerData.languageIndex == 0 ? 'View & edit profile' : 'عرض وتحرير الملف الشخصي'}
                  </Text>
                </TouchableOpacity>

                {
                  !guest &&
                  <Text
                    style={{
                      color: Colors.DarkGrey,
                      fontFamily: Font.Regular,
                      fontSize: Font.small,
                      alignSelf: 'flex-start',
                      marginTop: vs(4)
                    }}>
                    {drawerData.languageIndex == 0 ? '25% Completed' : '25٪ اكتمل'}
                  </Text>
                }
              </View>
            </View>
          </TouchableOpacity>

          {/* Appoints and bookings section */}

          <View style={{ width: '100%', paddingVertical: vs(22), marginTop: vs(7), backgroundColor: Colors.White }}>

            <View style={{ paddingHorizontal: vs(19) }}>
              <Text
                style={{
                  color: Colors.Black,
                  fontFamily: Font.Medium,
                  fontSize: Font.medium,
                  alignSelf: 'flex-start',
                }}>
                {Lang_chg.All_Consultations[drawerData.languageIndex]}
              </Text>
            </View>

            <DrawerItemContainer
              title={Lang_chg.Appointment_Bookings[drawerData.languageIndex]}
              subtitle={Lang_chg.Appointment_Booking_Details[drawerData.languageIndex]}
              rightIcon={
                drawerData.languageIndex == 1
                  ? leftArrow : rightArrow
              }
              leftIcon={Appointment}
              onPress={() => {
                navigation.navigate(
                  "Apointment",
                  {
                    title: Lang_chg.upcoming_heading[drawerData.languageIndex],
                    api_status: 0,
                  }
                )
              }}
              disable={guest ? true : false}
            />

            <DrawerItemContainer
              title={Lang_chg.Doctor_Consultations[drawerData.languageIndex]}
              subtitle={Lang_chg.Doctor_Consultation_Details[drawerData.languageIndex]}
              rightIcon={
                drawerData.languageIndex == 1
                  ? leftArrow : rightArrow
              }
              leftIcon={Consultations}
              onPress={() => {
                navigation.navigate(
                  "Consultation",
                  {
                    title: Lang_chg.upcoming_heading[drawerData.languageIndex],
                    api_status: 0,
                  }
                )
              }}
              disable={guest ? true : false}
            />

            <DrawerItemContainer
              title={Lang_chg.Lab_Test_Booking[drawerData.languageIndex]}
              subtitle={Lang_chg.Lab_Test_Booking_Details[drawerData.languageIndex]}
              rightIcon={
                drawerData.languageIndex
                  ? leftArrow : rightArrow
              }
              leftIcon={LabTest}
              onPress={() => {
                navigation.navigate(
                  "LabTest",
                  {
                    title: Lang_chg.upcoming_heading[drawerData.languageIndex],
                    api_status: 0,
                  }
                )
              }}
              disable={guest ? true : false}
            />

            <DrawerItemContainer
              title={Lang_chg.Orders[drawerData.languageIndex]}
              subtitle={Lang_chg.Order_Details[drawerData.languageIndex]}
              rightIcon={
                drawerData.languageIndex == 1
                  ? leftArrow : rightArrow
              }
              leftIcon={Orders}
              onPress={() => {
                navigation.navigate("Orders")
              }}
              disable={guest ? true : false}
            />

            <View style={{ width: '92%', height: 1.5, backgroundColor: Colors.backgroundcolor, marginVertical: vs(22) }}></View>

            <View style={{ paddingHorizontal: vs(19) }}>
              <Text
                style={{
                  color: Colors.Black,
                  fontFamily: Font.Medium,
                  fontSize: Font.medium,
                  alignSelf: 'flex-start'
                }}>
                {Lang_chg.Acccount_and_More[drawerData.languageIndex]}
              </Text>
            </View>

            <DrawerItemContainer
              title={Lang_chg.Acccount_Setting[drawerData.languageIndex]}
              rightIcon={
                drawerData.languageIndex == 1
                  ? leftArrow : rightArrow
              }
              leftIcon={AccountSetting}
              onPress={() => {
                navigation.navigate("EditProfile")
              }}
              disable={guest ? true : false}
            />

            <DrawerItemContainer
              title={Lang_chg.Manage_Address[drawerData.languageIndex]}
              rightIcon={
                drawerData.languageIndex == 1
                  ? leftArrow : rightArrow
              }
              leftIcon={ManageAddress}
              disable={guest ? true : false}
              onPress={() => {
                navigation.navigate('ManageAddress')
              }}
            />

            <DrawerItemContainer
              title={Lang_chg.Health_Record[drawerData.languageIndex]}
              rightIcon={
                drawerData.languageIndex == 1
                  ? leftArrow : rightArrow
              }
              leftIcon={HealthRecord}
              disable={guest ? true : false}
              onPress={() => {
                navigation.navigate('HealthRecord', {
                  isPage: "drawer"
                })
              }}
            />

            <DrawerItemContainer
              title={Lang_chg.Support_and_More[drawerData.languageIndex]}
              rightIcon={
                drawerData.languageIndex == 1
                  ? leftArrow : rightArrow
              }
              leftIcon={Support}
              onPress={() => {
                navigation.navigate(
                  "SupportandMore",
                  {
                    title: Lang_chg.upcoming_heading[drawerData.languageIndex],
                    api_status: 0,
                  }
                )
              }}
              disable={false}
            />

            <DrawerItemContainer
              title={Lang_chg.Like_Us[drawerData.languageIndex]}
              rightIcon={
                drawerData.languageIndex == 1
                  ? leftArrow : rightArrow
              }
              leftIcon={LikeUs}
              disable={false}
              onPress={() => {
                Platform.OS === 'ios' ?
                  Linking.openURL('https://apps.apple.com/in/app/rootscare-for-patients/id1628106272')
                  :
                  Linking.openURL('https://play.google.com/store/apps/details?id=com.rootscare&hl=en')

              }}
            />

            <View style={{ width: '92%', height: 1.5, backgroundColor: Colors.backgroundcolor, marginTop: vs(22) }}></View>

            {
              guest ?
                <DrawerItemContainer
                  title={Lang_chg.loginheretext[drawerData.languageIndex]}
                  rightIcon={
                    drawerData.languageIndex == 1
                      ? leftArrow : rightArrow
                  }
                  leftIcon={Login}
                  disable={false}
                  onPress={() => {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "AuthStack" }],
                    });
                  }}
                />
                :
                <DrawerItemContainer
                  title={Lang_chg.SignOut[drawerData.languageIndex]}
                  rightIcon={drawerData.languageIndex == 1
                    ? leftArrow : rightArrow
                  }
                  leftIcon={SignOut}
                  disable={false}
                  onPress={() => {
                    setDrawerData(prevState => ({
                      ...prevState,
                      modalVisible: true
                    }))
                  }}
                />
            }
          </View>

          <View style={{ paddingLeft: s(19), paddingRight: s(100), marginTop: vs(35) }}>
            <Text
              style={{
                color: Colors.DarkGrey,
                fontFamily: Font.Medium,
                fontSize: Font.medium,
                alignSelf: 'flex-start'
              }}>
              {Lang_chg.About_App[drawerData.languageIndex]}
            </Text>

            <Text
              style={{
                color: Colors.MediumGrey,
                fontFamily: Font.Regular,
                fontSize: Font.small,
                alignSelf: 'flex-start',
                marginTop: vs(5)
              }}>
              {Lang_chg.About_App_Details[drawerData.languageIndex]}
            </Text>
          </View>




          {/* version */}
          {/* <Text
              style={{
                textAlign: 'center',
                color: Colors.drawertextblue,
                marginTop: (windowWidth * 7) / 100,
              }}>
              {Lang_chg.drawerversion[config.language]}
            </Text> */}


          <Modal
            animationType="fade"
            transparent={true}
            visible={drawerData.modalVisible}
            onRequestClose={() => {
              setDrawerData(prevState => ({
                ...prevState,
                modalVisible: false
              }))
            }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                // this.setState({ modalVisible3: false })
              }}
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
                  }}
                >
                  <View
                    style={{
                      alignSelf: "flex-start",
                      width: (windowWidth * 50) / 100,
                      paddingVertical: (windowWidth * 3) / 100,
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
                      source={Icons.logoPlain} />
                    <Text
                      style={{
                        fontFamily: Font.Medium,
                        color: "#000",
                        fontSize: (windowWidth * 5) / 100,
                        paddingLeft: (windowWidth * 4) / 100,
                      }}
                    >
                      {Lang_chg.Logout[drawerData.languageIndex]}
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
                      }}
                    >
                      {Lang_chg.logut_msg[drawerData.languageIndex]}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      width: "40%",
                      paddingBottom: (windowWidth * 5) / 100,
                      marginTop: (windowWidth * 9) / 100,
                      alignSelf: "flex-end",
                      right: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setDrawerData(prevState => ({
                          ...prevState,
                          modalVisible: false
                        }))
                      }}
                      style={{
                        height: (windowWidth * 10) / 100,
                        width: (windowWidth * 15) / 100,
                        flexDirection: "row",
                        alignSelf: "center",
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
                        {Lang_chg.no_txt[drawerData.languageIndex]}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        confirm_click();
                      }}
                      activeOpacity={0.8}
                      style={{
                        height: (windowWidth * 10) / 100,
                        width: (windowWidth * 40) / 100,
                        justifyContent: "center",
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
                        {Lang_chg.Logout[drawerData.languageIndex]}
                      </Text>
                    </TouchableOpacity>

                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      </ScrollView>
    </View>
  );

}

export default Drawerscreen;