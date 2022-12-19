import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Modal,
  Platform,
} from "react-native";
import {
  Colors,
  Font,
  msgProvider,
  config,
  windowWidth,
  localStorage,
  Icons,
  consolepro,
  Lang_chg,
  apifuntion,
} from "./Provider/utilslib/Utils";
import Styles from "./Styles";
import { dummyUser, leftArrow, rightArrow, Appointment, Consultations, AccountSetting, ManageAddress, HealthRecord, LabTest, LikeUs, SignOut, Orders, Support } from "./icons/SvgIcons/Index";
// ----------------------------------------
import { DrawerActions } from "@react-navigation/native";
import { ms, s, vs } from "react-native-size-matters";
import { SvgXml, SvgUri } from 'react-native-svg';
import DrawerItemContainer from "./components/DrawerItem";
let isGuest = false;

global.add_location = "NA";
export default class Drawerscreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      address_new: "NA",
      address_old: "",
      profile_img: null
    };

    //    add_location='NA'
  }
  componentDidMount() {
    this.props.navigation.addListener("focus", () => {
      consolepro.consolelog(" add_location = data2", add_location);
      if (add_location != "NA") {
        this.setState({
          address_new: add_location.address,
          latitude: add_location.latitude,
          longitude: add_location.longitude,
        });
      }
      console.log("address_new", add_location.address);
      this.getProfile();
      this.checkUserType()
    });
  }

  checkUserType = async () => {
    isGuest = await localStorage.getItemString('Guest')
  }
  getProfile = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    let address_arr = await localStorage.getItemObject("address_arr");
    console.log("user_details user_details", user_details);
    console.log("address_arr", address_arr);
    this.setState({ address_new: address_arr });

    // console.log('...................', user_details.image);
    this.setState({
      name: user_details["first_name"],
      email: user_details["email"],

      mobile: user_details["phone_number"],
      address_old: user_details["current_address"],
    });
    if (user_details.image != null) {
      this.setState({
        profile_img: config.img_url3 + user_details["image"],
      });
    }
  };

  confirm_click = async () => {
    this.logoutApi();
  };
  logout = async () => {
    await localStorage.removeItem("user_arr");
    await localStorage.removeItem("user_login");
    await localStorage.removeItem('Guest')
    // await localStorage.removeItem('password');
    // await localStorage.clear();
    this.props.navigation.reset({
      index: 0,
      routes: [{ name: 'AuthStack' }],
    })
  };
  logoutApi = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    console.log("user_details", user_details);
    let user_id = user_details["user_id"];

    let url = config.baseURL + "api-logout";
    var data = new FormData();
    data.append("user_id", user_id);


    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        consolepro.consolelog("logout response", obj);

        if (obj.status == true) {
          this.logout();
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

  render() {
    return (
      <SafeAreaView style={{ flex: 1, }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, backgroundColor: Colors.backgroundcolor, paddingBottom: Platform.OS === 'ios' ? vs(150) : vs(65), }}
        >
          <View
            style={{
              flex: 1,
              width: "100%",
              // paddingHorizontal: s(15),
              paddingBottom: Platform.OS === 'ios' ? vs(90) : vs(80),
            }}
          >
            {/* user Profile */}
            <TouchableOpacity
              disabled={isGuest === 'true' ? true : false}
              onPress={() => this.props.navigation.navigate("EditProfile")}
              activeOpacity={0.7}
              style={{ width: '100%', alignItems: "center", flexDirection: 'row', paddingTop: vs(20), height: vs(140), backgroundColor: Colors.White }}>

              <View style={{ width: '31%', height: '100%' }} >
                {
                  (this.state.profile_img == "NA" || this.state.profile_img == "" || this.state.profile_img == null) ?
                    <SvgXml xml={dummyUser} style={{
                      alignSelf: "center",
                      marginTop: vs(5)
                    }} />
                    :
                    // <SvgUri uri={this.state.profile_img} />
                    <Image
                      source={{ uri: this.state.profile_img }}
                      style={{ height: s(85), width: s(85), borderRadius: s(85), backgroundColor: Colors.backgroundcolor, marginTop: vs(5), alignSelf: 'center' }}
                    />

                }
              </View>

              <View style={{ width: '69%', height: '100%', }} >

                <View style={{ width: '100%', height: '60%', flexDirection: 'row' }} >
                  <View style={{ width: '80%', height: '100%', justifyContent: 'center' }}>
                    <Text
                      style={{
                        color: Colors.Black,
                        fontFamily: Font.Medium,
                        fontSize: Font.xxxlarge,
                        textAlign: config.textRotate,
                        opacity: (isGuest === 'true') ? 0.3 : 1
                      }}
                    >
                      {/* {'this.state.name'} */}
                      {config.language == 0 ? 'Layth Ghassan Alkharouf' : 'ليث غسان الخروف'}
                    </Text>
                  </View>
                  <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
                    <SvgXml xml={
                      config.textalign == "right"
                        ? leftArrow : rightArrow
                    } height={vs(11.98)} width={s(6.42)} />
                  </View>
                </View>

                <View style={{ width: '100%', height: '40%' }}>
                  <TouchableOpacity
                    disabled={isGuest === 'true' ? true : false}
                    activeOpacity={0.7}
                    onPress={() => {
                      // this.props.navigation.dispatch(DrawerActions.toggleDrawer())
                      setTimeout(() => {
                        this.props.navigation.navigate("EditProfile")
                      }, 350);
                    }}
                  >
                    <Text
                      style={{
                        color: Colors.Primary,
                        fontFamily: Font.Medium,
                        fontSize: Font.medium,
                        textAlign: config.textRotate,
                        opacity: (isGuest === 'true') ? 0.3 : 1

                      }}
                    >
                      {config.language == 0 ? 'View & edit profile' : 'عرض وتحرير الملف الشخصي'}
                    </Text>
                  </TouchableOpacity>

                  {
                    isGuest === 'false' &&
                    <Text
                      style={{
                        color: Colors.DarkGrey,
                        fontFamily: Font.Regular,
                        fontSize: Font.small,
                        textAlign: config.textRotate,
                        marginTop: vs(4)
                      }}
                    >
                      {/* {'this.state.name'} */}
                      {config.language == 0 ? '25% Completed' : '25٪ اكتمل'}
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
                    textAlign: config.textRotate,
                  }}>
                  {Lang_chg.All_Consultations[config.language]}
                </Text>
              </View>

              <DrawerItemContainer
                title={Lang_chg.Appointment_Bookings[config.language]}
                subtitle={Lang_chg.Appointment_Booking_Details[config.language]}
                rightIcon={
                  config.textalign == "right"
                    ? leftArrow : rightArrow
                }
                leftIcon={Appointment}
                onPress={() => {
                  // this.props.navigation.dispatch(DrawerActions.toggleDrawer())
                  this.props.navigation.navigate(
                    "Apointment",
                    {
                      title: Lang_chg.upcoming_heading[config.language],
                      api_status: 0,
                    }
                  )
                }}
                disable={isGuest === 'true' ? true : false}
              />

              <DrawerItemContainer
                title={Lang_chg.Doctor_Consultations[config.language]}
                subtitle={Lang_chg.Doctor_Consultation_Details[config.language]}
                rightIcon={
                  config.textalign == "right"
                    ? leftArrow : rightArrow
                }
                leftIcon={Consultations}
                onPress={() => {
                  // this.props.navigation.dispatch(DrawerActions.toggleDrawer())
                  this.props.navigation.navigate(
                    "Consultation",
                    {
                      title: Lang_chg.upcoming_heading[config.language],
                      api_status: 0,
                    }
                  )
                }}
                disable={isGuest === 'true' ? true : false}
              />

              <DrawerItemContainer
                title={Lang_chg.Lab_Test_Booking[config.language]}
                subtitle={Lang_chg.Lab_Test_Booking_Details[config.language]}
                rightIcon={
                  config.textalign == "right"
                    ? leftArrow : rightArrow
                }
                leftIcon={LabTest}
                onPress={() => {
                  // this.props.navigation.dispatch(DrawerActions.toggleDrawer())
                  this.props.navigation.navigate(
                    "LabTest",
                    {
                      title: Lang_chg.upcoming_heading[config.language],
                      api_status: 0,
                    }
                  )
                }}
                disable={isGuest === 'true' ? true : false}
              />

              <DrawerItemContainer
                title={Lang_chg.Orders[config.language]}
                subtitle={Lang_chg.Order_Details[config.language]}
                rightIcon={
                  config.textalign == "right"
                    ? leftArrow : rightArrow
                }
                leftIcon={Orders}
                disable={isGuest === 'true' ? true : false}
              />

              <View style={{ width: '92%', height: 1.5, backgroundColor: Colors.backgroundcolor, marginVertical: vs(22) }}></View>

              <View style={{ paddingHorizontal: vs(19) }}>
                <Text
                  style={{
                    color: Colors.Black,
                    fontFamily: Font.Medium,
                    fontSize: Font.medium,
                    textAlign: config.textRotate,
                  }}>
                  {Lang_chg.Acccount_and_More[config.language]}
                </Text>
              </View>

              <DrawerItemContainer
                title={Lang_chg.Acccount_Setting[config.language]}
                rightIcon={
                  config.textalign == "right"
                    ? leftArrow : rightArrow
                }
                leftIcon={AccountSetting}
                onPress={() => {
                  this.props.navigation.navigate("EditProfile")
                }}
                disable={isGuest === 'true' ? true : false}
              />

              <DrawerItemContainer
                title={Lang_chg.Manage_Address[config.language]}
                rightIcon={
                  config.textalign == "right"
                    ? leftArrow : rightArrow
                }
                leftIcon={ManageAddress}
                disable={isGuest === 'true' ? true : false}
                onPress={() => {
                  this.props.navigation.navigate('Show_currentlocation')
                }}
              />

              <DrawerItemContainer
                title={Lang_chg.Health_Record[config.language]}
                rightIcon={
                  config.textalign == "right"
                    ? leftArrow : rightArrow
                }
                leftIcon={HealthRecord}
                disable={isGuest === 'true' ? true : false}
                onPress={()=>{
                  this.props.navigation.navigate('HealthRecord',{
                    isPage: "drawer"
                  })
                }}
              />

              <DrawerItemContainer
                title={Lang_chg.Support_and_More[config.language]}
                rightIcon={
                  config.textalign == "right"
                    ? leftArrow : rightArrow
                }
                leftIcon={Support}
                onPress={() => {
                  // this.props.navigation.dispatch(DrawerActions.toggleDrawer())
                  this.props.navigation.navigate(
                    "SupportandMore",
                    {
                      title: Lang_chg.upcoming_heading[config.language],
                      api_status: 0,
                    }
                  )
                }}
                disable={false}
              />

              <DrawerItemContainer
                title={Lang_chg.Like_Us[config.language]}
                rightIcon={
                  config.textalign == "right"
                    ? leftArrow : rightArrow
                }
                leftIcon={LikeUs}
                disable={false}
              />

              <View style={{ width: '92%', height: 1.5, backgroundColor: Colors.backgroundcolor, marginTop: vs(22) }}></View>

              <DrawerItemContainer
                title={Lang_chg.SignOut[config.language]}
                rightIcon={
                  config.textalign == "right"
                    ? leftArrow : rightArrow
                }
                leftIcon={SignOut}
                disable={isGuest === 'true' ? true : false}
                onPress={() => this.setState({ modalVisible: true })}
              />
            </View>

            <View style={{ paddingLeft: s(19), paddingRight: s(100), marginTop: vs(35) }}>
              <Text
                style={{
                  color: Colors.DarkGrey,
                  fontFamily: Font.Medium,
                  fontSize: Font.medium,
                  textAlign: config.textRotate,
                }}>
                {Lang_chg.About_App[config.language]}
              </Text>

              <Text
                style={{
                  color: Colors.MediumGrey,
                  fontFamily: Font.Regular,
                  fontSize: Font.small,
                  textAlign: config.textRotate,
                  marginTop: vs(5)
                }}>
                {Lang_chg.About_App_Details[config.language]}
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
              visible={this.state.modalVisible}
              onRequestClose={() => {
                this.setState({ modalVisible: false });
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
                        {Lang_chg.Logout[config.language]}
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
                        {Lang_chg.logut_msg[config.language]}
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
                          this.setState({ modalVisible: false });
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
                          {Lang_chg.no_txt[config.language]}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ modalVisible: false }),
                            this.confirm_click();
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
                          {Lang_chg.Logout[config.language]}
                        </Text>
                      </TouchableOpacity>

                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
