import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import Footer from "../Footer";
import {
  Colors,
  Font,
  Cameragallery,
  mediaprovider,
  msgProvider,
  msgText,
  config,
  windowWidth,
  localStorage,
  Icons,
  consolepro,
  Lang_chg,
  apifuntion,
} from "../Provider/utilslib/Utils";
import Icon from "react-native-vector-icons/FontAwesome";
import HideWithKeyboard from "react-native-hide-with-keyboard";
import { AuthInputBoxSec, Button } from "../components";

export default class AddPatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSecurePassword: true,
      isSecurePassword1: true,

      PatientFirstName: "",
      PatientFirstNamefocus: false,

      PatientLastName: "",
      PatientLastNamefocus: "",

      PatientEmail: "",
      PatientEmailfocus: "",
      PatientAge: "",
      PatientAgefocus: "",
      notification_count: "",
      fbtn: "",
      mabtn: true,
      first_name: "",
      last_name: "",
      age: "",
      email: "",
      mediamodal: false,
      profile_img: "",
      gender: "male",
      profile_image: "",
    };
  }
  Camerapopen = async () => {
    mediaprovider
      .launchCamera(true)
      .then((obj) => {
        console.log(obj);
        console.log(obj.path);
        if (this.state.img_type == 0) {
          this.setState({ cover_img: obj.path, mediamodal: false });
        } else {
          this.setState({
            profile_img: obj.path,
            mediamodal: false,
            profile_image: obj.path,
          });
        }
      })
      .catch((error) => {
        this.setState({ mediamodal: false });
      });
  };
  Galleryopen = () => {
    mediaprovider
      .launchGellery(true)
      .then((obj) => {
        console.log(obj);
        console.log(obj.path);
        // this.editImage(obj.path);
        if (this.state.img_type == 0) {
          this.setState({ cover_img: obj.path, mediamodal: false });
        } else {
          this.setState({
            profile_img: obj.path,
            mediamodal: false,
            profile_image: obj.path,
          });
        }
      })
      .catch((error) => {
        this.setState({ mediamodal: false });
      });
  };

  submit_click = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];
    console.log("dfhvgrtdb ", user_details);
    Keyboard.dismiss();

    if (
      this.state.first_name.length <= 0 ||
      this.state.first_name.trim().length <= 0
    ) {
      msgProvider.showError(msgText.emptyPaitentName[config.language]);
      return false;
    }
    if (
      this.state.last_name.length <= 0 ||
      this.state.last_name.trim().length <= 0
    ) {
      msgProvider.showError(msgText.emptyPaitentLastName[config.language]);
      return false;
    }
    if (this.state.age.length <= 0 || this.state.age.trim().length <= 0) {
      msgProvider.showError(msgText.emptyAge[config.language]);
      return false;
    }
    if (
      this.state.profile_img == "" ||
      this.state.profile_img == "NA" ||
      this.state.profile_img == null
    ) {
      msgProvider.showError(msgText.emptyImage[config.language]);
      return false;
      // }
    }

    let url = config.baseURL + "api-insert-patient-family";
    console.log("url", url);
    var data = new FormData();
    console.log("check data", data);
    data.append("patient_id", user_id);
    data.append("first_name", this.state.first_name);
    data.append("last_name", this.state.last_name);
    data.append("gender", this.state.gender);
    data.append("age", this.state.age);
    data.append("email", this.state.email);

    console.log("this.state.profile_img1234", this.state.profile_image);
    if (this.state.profile_image != "") {
      data.append("image", {
        uri: this.state.profile_img,
        type: "image/jpg",
        name: this.state.profile_img,
      });
    }

    consolepro.consolelog("data", data);
    this.setState({ loading: true });
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        consolepro.consolelog("obj", obj);
        this.setState({ loading: false });
        if (obj.status == true) {
          this.props.navigation.goBack();
          // msgProvider.showError(obj.message,'center')
        } else {
          msgProvider.alert("", obj.message, false);
        }
        return false;
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
        this.setState({ loading: false });
      });
  };
  get_all_notification = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    console.log("user_details user_details", user_details);
    let user_id = user_details["user_id"];

    let url = config.baseURL + "api-notification-count";
    console.log("url", url);
    var data = new FormData();
    data.append("login_user_id", user_id);

    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        consolepro.consolelog("obj", obj);
        if (obj.status == true) {
          this.setState({ notification_count: obj.result });
          console.log("obj nationaltity", obj);
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log("-------- error ------- " + error);
      });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <SafeAreaView style={{ backgroundColor: "#fff", flex: 0 }} />
          <View
            style={{
              backgroundColor: "#fff",
              width: "100%",
              paddingVertical: (windowWidth * 3) / 100,
              borderBottomColor: Colors.Border,
              borderBottomWidth: 1,
              // shadowColor:'#000',
              // shadowOffset:{width:1,height:1},
              // elevation:3,

              // shadowOpacity:0.6,
              // shadowRadius:4,
            }}
          >
            <View
              style={{
                width: "95%",
                alignSelf: "center",
                backgroundColor: "White",
                //  height: (windowWidth * 12) / 100,
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
                }}
                style={{ width: "10%", alignSelf: "center" }}
              >
                <Image
                  source={
                    config.textalign == "right"
                      ? Icons.arabic_back
                      : Icons.backarrow
                  }
                  style={{
                    height: (windowWidth * 8) / 100,
                    width: (windowWidth * 8) / 100,
                  }}
                >
                  {/* {Icons.backarrow} */}
                </Image>
              </TouchableOpacity>

              <View style={{ width: "80%", alignSelf: "center" }}>
                <Text
                  style={{
                    color: Colors.Black,
                    fontFamily: Font.blackheadingfontfamily,
                    fontSize: Font.headingblack_txt_size_edit,
                    alignSelf: "flex-end",

                    alignSelf: "center",
                  }}
                >
                  {Lang_chg.AddPatient[config.language]}
                </Text>
              </View>
              {/* <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("Notifications");
                }}
              >
                <View style={{ width: "10%", alignSelf: "center" }}>
                  <Image
                    source={
                      this.state.notification_count > 0
                        ? Icons.notifications
                        : Icons.notifications_sec
                    }
                    style={{
                      height: (windowWidth * 6) / 100,
                      width: (windowWidth * 6) / 100,
                      resizeMode: "contain",
                    }}
                  >
                  </Image>
                </View>
              </TouchableOpacity> */}
            </View>
          </View>
          <View
            style={{
              flex: 1,
              width: "100%",
              alignSelf: "center",
              backgroundColor: Colors.White,
              marginTop: (windowWidth * 3) / 100,
              paddingBottom: (windowWidth * 10) / 100,
              shadowColor: "#000",
              shadowOffset: { width: 1, height: 1 },
              shadowOpacity: 0.5,
              shadowRadius: 2,
              elevation: 3,
            }}
          >
            {/* user Profile */}
            <View
              style={{
                alignSelf: "center",
                width: "100%",
                alignItems: "center",
              }}
            >
              <Cameragallery
                mediamodal={this.state.mediamodal}
                Camerapopen={() => {
                  this.Camerapopen();
                }}
                Galleryopen={() => {
                  this.Galleryopen();
                }}
                Canclemedia={() => {
                  this.setState({ mediamodal: false });
                }}
              />

              <View
                style={{
                  width: "28%",
                  alignSelf: "center",
                  paddingVertical: (windowWidth * 5) / 100,
                }}
              >
                <View
                  style={{
                    width: (windowWidth * 23) / 100,
                    height: (windowWidth * 23) / 100,
                    borderRadius: (windowWidth * 11.5) / 100,
                    borderWidth: 4,
                    borderColor: Colors.bordercolor_light_blue,
                    // backgroundColor:'red'
                  }}
                >
                  <Image
                    style={{
                      width: (windowWidth * 21) / 100,
                      height: (windowWidth * 21) / 100,
                      borderRadius: (windowWidth * 10.5) / 100,
                    }}
                    source={
                      this.state.profile_img == "NA" ||
                      this.state.profile_img == null ||
                      this.state.profile_img == ""
                        ? Icons.profileimg
                        : { uri: this.state.profile_img }
                    }
                  />
                </View>
              </View>

              <View
                style={{
                  width: "20%",
                  alignSelf: "center",
                  marginTop: (windowWidth * -15) / 100,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ mediamodal: true });
                  }}
                  style={{
                    width: (windowWidth * 8) / 100,
                    height: (windowWidth * 8) / 100,
                    borderRadius: (windowWidth * 4) / 100,
                    borderWidth: 2,
                    borderColor: Colors.bordercolor_light_blue,
                    backgroundColor: "White",
                    alignSelf: "flex-end",
                  }}
                >
                  <Image
                    style={{
                      height: (windowWidth * 3.5) / 100,
                      width: (windowWidth * 3.5) / 100,
                      alignSelf: "center",
                      marginTop: (windowWidth * 1.8) / 100,
                    }}
                    source={Icons.camera}
                  />
                </TouchableOpacity>
              </View>

              {/* first name */}
              <View
                style={{
                  width: "90%",
                  alignSelf: "center",
                  marginTop: (windowWidth * 3) / 100,
                  // borderColor: this.state.PatientFirstNamefocus == true ? Colors.placholderactive : Colors.placeholder_border,
                  // borderWidth: (windowWidth * 0.3) / 100,
                  // borderRadius: (windowWidth * 1) / 100, marginTop: windowWidth * 10 / 100
                }}
              >
                <AuthInputBoxSec
                  mainContainer={{
                    width: "100%",
                  }}
                  // icon={layer9_icon}
                  lableText={Lang_chg.PatientFirstName[config.language]}
                  inputRef={(ref) => {
                    this.first_nameInput = ref;
                  }}
                  maxLength={50}
                  onChangeText={(text) => this.setState({ first_name: text })}
                  value={this.state.first_name}
                  keyboardType="default"
                  autoCapitalize="none"
                  returnKeyLabel="done"
                  returnKeyType="done"
                />
                {/* <View style={{ width: '95%', alignSelf: 'center' }}>
                  <TextInput
                    style={{
                      width: '100%',
                      color: Colors.Black,
                      fontSize: Font.placeholdersize,
                      textAlign: config.textalign,
                      height: Font.placeholder_height,
                      fontFamily: Font.fontlight,
                      padding: windowWidth * 0.5 / 100
                    }}
                    maxLength={50}
                    placeholder={
                      this.state.PatientFirstNamefocus != true
                        ? Lang_chg.PatientFirstName[config.language]
                        : null
                    }
                    DarkGrey={Colors.DarkGrey}
                    onChangeText={txt => {
                      this.setState({ first_name: txt });
                    }}

                    onFocus={() => {
                      this.setState({ PatientFirstNamefocus: true });
                    }}
                    onBlur={() => {
                      this.setState({
                        PatientFirstNamefocus:
                          this.state.first_name.length > 0 ? true : false,
                      });
                    }}
                    keyboardType='default'
                    returnKeyLabel="done"
                    returnKeyType="done"
                  />
                </View>
                {this.state.PatientFirstNamefocus == true && (
                  <View
                    style={{
                      position: 'absolute',
                      backgroundColor: 'White',
                      left: (windowWidth * 4) / 100,
                      top: (-windowWidth * 2.5) / 100,
                      paddingHorizontal: (windowWidth * 1) / 100,
                    }}>
                    <Text style={{ color: '#0057A5' }}>{Lang_chg.PatientFirstName[config.language]}</Text>
                  </View>
                )} */}
              </View>

              {/* last name */}
              <View
                style={{
                  width: "90%",
                  alignSelf: "center",
                  marginTop: (windowWidth * 3) / 100,
                  // borderColor: this.state.PatientLastNamefocus == true ? Colors.placholderactive : Colors.placeholder_border,
                  // borderWidth: (windowWidth * 0.3) / 100,
                  // borderRadius: (windowWidth * 1) / 100,
                }}
              >
                <AuthInputBoxSec
                  mainContainer={{
                    width: "100%",
                  }}
                  // icon={layer9_icon}
                  lableText={Lang_chg.PatientLastName[config.language]}
                  inputRef={(ref) => {
                    this.last_nameInput = ref;
                  }}
                  maxLength={50}
                  onChangeText={(text) => this.setState({ last_name: text })}
                  value={this.state.last_name}
                  keyboardType="default"
                  autoCapitalize="none"
                  returnKeyLabel="done"
                  returnKeyType="done"
                />
                {/* <View style={{ width: '95%', alignSelf: 'center' }}>
                  <TextInput
                    style={{
                      width: '100%',
                      color: Colors.Black,
                      fontSize: Font.placeholdersize,
                      textAlign: config.textalign,
                      height: Font.placeholder_height,
                      fontFamily: Font.fontlight,
                      padding: windowWidth * 0.5 / 100
                    }}
                    maxLength={50}
                    placeholder={
                      this.state.PatientLastNamefocus != true
                        ? Lang_chg.PatientLastName[config.language]
                        : null
                    }
                    DarkGrey={Colors.DarkGrey}
                    onChangeText={txt => {
                      this.setState({ last_name: txt });
                    }}

                    onFocus={() => {
                      this.setState({ PatientLastNamefocus: true });
                    }}
                    onBlur={() => {
                      this.setState({
                        PatientLastNamefocus:
                          this.state.last_name.length > 0 ? true : false,
                      });
                    }}
                    keyboardType='default'
                    returnKeyLabel="done"
                    returnKeyType="done"
                  />
                </View>
                {this.state.PatientLastNamefocus == true && (
                  <View
                    style={{
                      position: 'absolute',
                      backgroundColor: 'White',
                      left: (windowWidth * 4) / 100,
                      top: (-windowWidth * 2.5) / 100,
                      paddingHorizontal: (windowWidth * 1) / 100,
                    }}>
                    <Text style={{ color: '#0057A5' }}>{Lang_chg.PatientLastName[config.language]}</Text>
                  </View>
                )} */}
              </View>

              {/* PatientEmail */}
              <View
                style={{
                  width: "90%",
                  alignSelf: "center",
                  marginTop: (windowWidth * 3) / 100,
                  // borderColor: this.state.PatientEmailfocus == true ? Colors.placholderactive : Colors.placeholder_border,
                  // borderWidth: (windowWidth * 0.3) / 100,
                  // borderRadius: (windowWidth * 1) / 100,
                }}
              >
                <AuthInputBoxSec
                  mainContainer={{
                    width: "100%",
                  }}
                  // icon={layer9_icon}
                  lableText={Lang_chg.PatientEmail[config.language]}
                  inputRef={(ref) => {
                    this.emailInput = ref;
                  }}
                  maxLength={100}
                  onChangeText={(text) => this.setState({ email: text })}
                  value={this.state.email}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyLabel="done"
                  returnKeyType="done"
                />
                {/* <View style={{ width: '95%', alignSelf: 'center' }}>
                  <TextInput
                    style={{
                      width: '100%',
                      color: Colors.Black,
                      fontSize: Font.placeholdersize,
                      textAlign: config.textalign,
                      height: Font.placeholder_height,
                      fontFamily: Font.fontlight,
                      padding: windowWidth * 0.5 / 100
                    }}
                    maxLength={100}
                    placeholder={
                      this.state.PatientEmailfocus != true
                        ? Lang_chg.PatientEmail[config.language]
                        : null
                    }
                    DarkGrey={Colors.DarkGrey}
                    onChangeText={txt => {
                      this.setState({ email: txt });
                    }}

                    onFocus={() => {
                      this.setState({ PatientEmailfocus: true });
                    }}
                    onBlur={() => {
                      this.setState({
                        PatientEmailfocus:
                          this.state.email.length > 0 ? true : false,
                      });
                    }}
                    keyboardType='email-address'
                    returnKeyLabel="done"
                    returnKeyType="done"
                  />
                </View>
                {this.state.PatientEmailfocus == true && (
                  <View
                    style={{
                      position: 'absolute',
                      backgroundColor: 'White',
                      left: (windowWidth * 4) / 100,
                      top: (-windowWidth * 2.5) / 100,
                      paddingHorizontal: (windowWidth * 1) / 100,
                    }}>
                    <Text style={{ color: '#0057A5' }}>{Lang_chg.PatientEmail[config.language]}</Text>
                  </View>
                )} */}
              </View>

              {/* PatientAge */}
              <View
                style={{
                  width: "90%",
                  alignSelf: "center",
                  marginTop: (windowWidth * 3) / 100,
                  // borderColor: this.state.PatientAgefocus == true ? Colors.placholderactive : Colors.placeholder_border,
                  // borderWidth: (windowWidth * 0.3) / 100,
                  // borderRadius: (windowWidth * 1) / 100,
                }}
              >
                <AuthInputBoxSec
                  mainContainer={{
                    width: "100%",
                  }}
                  // icon={layer9_icon}
                  lableText={Lang_chg.PatientAge[config.language]}
                  inputRef={(ref) => {
                    this.ageInput = ref;
                  }}
                  maxLength={3}
                  onChangeText={(text) => this.setState({ age: text })}
                  value={this.state.age}
                  autoCapitalize="none"
                  keyboardType="number-pad"
                  returnKeyLabel="done"
                  returnKeyType="done"
                />
                {/* <View style={{ width: '95%', alignSelf: 'center' }}>
                  <TextInput
                    style={{
                      width: '100%',
                      color: Colors.Black,
                      fontSize: Font.placeholdersize,
                      textAlign: config.textalign,

                      height: Font.placeholder_height,
                      fontFamily: Font.fontlight,
                      padding: windowWidth * 0.5 / 100
                    }}
                    maxLength={3}
                    placeholder={
                      this.state.PatientAgefocus != true
                        ? Lang_chg.PatientAge[config.language]
                        : null
                    }
                    DarkGrey={Colors.DarkGrey}
                    onChangeText={txt => {
                      this.setState({ age: txt });
                    }}

                    onFocus={() => {
                      this.setState({ PatientAgefocus: true });
                    }}
                    onBlur={() => {
                      this.setState({
                        PatientAgefocus:
                          this.state.age.length > 0 ? true : false,
                      });
                    }}
                    keyboardType='number-pad'
                    returnKeyLabel="done"
                    returnKeyType="done"
                  />
                </View>
                {this.state.PatientAgefocus == true && (
                  <View
                    style={{
                      position: 'absolute',
                      backgroundColor: 'White',
                      left: (windowWidth * 4) / 100,
                      top: (-windowWidth * 2.5) / 100,
                      paddingHorizontal: (windowWidth * 1) / 100,
                    }}>
                    <Text style={{ color: '#0057A5' }}>{Lang_chg.PatientAge[config.language]}</Text>
                  </View>
                )} */}
              </View>

              {/* gender option */}

              <View
                style={{
                  width: "88%",
                  alignSelf: "center",
                  marginTop: (windowWidth * 5) / 100,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={{ width: "17%" }}>
                  <Text
                    style={{
                      color: Colors.textGender,
                      fontFamily: Font.placeholderfontfamily,
                      fontSize: (windowWidth * 3.8) / 100,

                      textAlign: config.textRotate,
                      marginTop: (windowWidth * 3) / 100,
                    }}
                  >
                    {Lang_chg.Gender[config.language]}
                  </Text>
                </View>

                <View
                  style={{
                    width: "60%",

                    marginTop: (windowWidth * 3) / 100,
                    flexDirection: "row",
                    marginLeft: (windowWidth * 2) / 100,
                    // justifyContent:'space-evenly',
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ gender: "Female" });
                    }}
                    style={{
                      width: "40%",
                      alignSelf: "center",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ width: "24%", alignSelf: "center" }}>
                      <View
                        style={{
                          width: (windowWidth * 5) / 100,
                          alignSelf: "center",
                          flexDirection: "row",
                        }}
                      >
                        {this.state.gender == "Female" ? (
                          <Icon
                            style={{ alignSelf: "center" }}
                            name="dot-circle-o"
                            size={22}
                            color={"#0168B3"}
                          />
                        ) : (
                          <Icon
                            style={{ alignSelf: "center" }}
                            name="circle-thin"
                            size={22}
                            color={Colors.textGender}
                          ></Icon>
                        )}
                      </View>
                    </View>

                    <Text
                      style={{
                        color: Colors.textGender,
                        marginLeft: (windowWidth * 2) / 100,
                        fontSize: (windowWidth * 3.5) / 100,
                        textAlign: "center",
                        fontFamily: Font.placeholderfontfamily,
                      }}
                    >
                      {Lang_chg.female[config.language]}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                      this.setState({ gender: "Male" });
                    }}
                    style={{
                      width: "40%",
                      alignSelf: "center",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View style={{ width: "24%", alignSelf: "center" }}>
                      <View
                        style={{
                          width: (windowWidth * 5) / 100,
                          alignSelf: "center",
                          flexDirection: "row",
                        }}
                      >
                        {this.state.gender == "Male" ? (
                          <Icon
                            name="dot-circle-o"
                            size={22}
                            color={"#0168B3"}
                          ></Icon>
                        ) : (
                          <Icon
                            name="circle-thin"
                            size={22}
                            color={Colors.textGender}
                          ></Icon>
                        )}
                      </View>
                    </View>

                    <Text
                      style={{
                        color: Colors.textGender,
                        //  width: '50%',
                        textAlign: "center",
                        fontFamily: Font.placeholderfontfamily,
                        alignSelf: "center",
                        fontSize: (windowWidth * 3.5) / 100,
                        marginLeft: (windowWidth * 2) / 100,
                      }}
                    >
                      {Lang_chg.male[config.language]}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Button
                text={Lang_chg.SAVEPATIENT[config.language]}
                // onLoading={this.state.loading}
                customStyles={
                  {
                    // mainContainer: styles.butonContainer
                  }
                }
                onPress={() => this.submit_click()}
                // isBlank={false}
              />

              {/* <Appbtn3 handlarrowpress={() => {
                this.submit_click()
              }} 
              title={Lang_chg.SAVEPATIENT[config.language]} 
              bgcolor={Colors.Theme} /> */}
            </View>
          </View>
        </ScrollView>

        {/* <HideWithKeyboard>
          <Footer
            activepage="More"
            usertype={1}
            footerpage={[
              {
                name: "Home",
                fname: Lang_chg.home_footer[config.language],
                countshow: false,
                image: Icons.Home,
                activeimage: Icons.Home,
              },
              {
                name: "Appointment",
                fname: Lang_chg.Appointment_footer[config.language],
                countshow: false,
                image: Icons.Appointment,
                activeimage: Icons.Appointment,
              },
              {
                name: "Cart",
                fname: Lang_chg.Cart_footer[config.language],
                countshow: false,
                image: Icons.Cart,
                activeimage: Icons.Cart,
              },
              {
                name: "More",
                fname: Lang_chg.More_footer[config.language],
                countshow: false,
                image: Icons.More,
                activeimage: Icons.More,
              },
            ]}
            navigation={this.props.navigation}
            imagestyle1={{
              width: 25,
              height: 25,
              paddingBottom: (windowWidth * 5.4) / 100,
              backgroundColor: "White",
              countcolor: "red",
              countbackground: "red",
            }}
          />
        </HideWithKeyboard> */}
      </View>
    );
  }
}
