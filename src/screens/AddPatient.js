import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Keyboard,
  FlatList,
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
import { AuthInputBoxSec, Button } from "../components";
import ScreenHeader from "../components/ScreenHeader";
import { s, vs } from "react-native-size-matters";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SvgXml } from "react-native-svg";
import { dummyUser, Edit } from "../icons/SvgIcons/Index";

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
      gender: -1,
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
            profile_img:  obj.path,
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

    const { gender, profile_image } = this.state
    return (
      <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>

        <ScreenHeader
          title={Lang_chg.AddPatient[config.language]}
          navigation={this.props.navigation}
          onBackPress={() => this.props.navigation.pop()}
          leftIcon
          rightIcon
        />
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{
            justifyContent: 'center',
            paddingBottom: vs(30),
          }}
          showsVerticalScrollIndicator={false}>

          <View
            style={{
              width: "100%",
              marginTop: vs(7),
              paddingVertical: vs(9),
              backgroundColor: Colors.White
            }}>

            <View style={{ flexDirection: 'row', width: '21%', alignSelf: 'center' }}>
              {
                (profile_image != '' && profile_image != null) ?
                  <Image source={{uri:profile_image}} style={{
                    height: s(65),
                    width: s(65),
                    borderRadius: s(100)
                  }} />
                  :
                  <SvgXml xml={dummyUser} height={s(65)} width={s(65)} />
              }
              <TouchableOpacity
                onPress={() => {
                  this.setState({ mediamodal: true })
                }}
                style={{ height: s(23), width: s(23), borderRadius: s(40), backgroundColor: Colors.White, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: vs(2), right: s(6), borderWidth: 1.2, borderColor: Colors.Blue }}>
                <SvgXml xml={Edit} />
              </TouchableOpacity>
            </View>

            <View
              style={{
                alignSelf: "center",
                width: "90%",
                alignItems: "center",
              }}>


              {/* first name */}
              <AuthInputBoxSec
                mainContainer={{ marginTop: vs(18), width: '100%' }}
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
                returnKeyType="next"
                editable
              />


              {/* last name */}

              <AuthInputBoxSec
                mainContainer={{ marginTop: vs(8), width: '100%' }}
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
                returnKeyType="next"
                editable
              />

              {/* PatientEmail */}

              <AuthInputBoxSec
                mainContainer={{ marginTop: vs(8), width: '100%' }}
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
                returnKeyType="next"
                editable
              />

              {/* PatientAge */}

              <AuthInputBoxSec
                mainContainer={{ marginTop: vs(8), width: '100%' }}
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
                editable
              />


              {/* gender option */}

              <View style={{ width: '100%', height: vs(20), flexDirection: 'row', alignItems: 'center', marginVertical: vs(20), paddingHorizontal: s(15) }}>

                <Text
                  style={{
                    fontSize: Font.small,
                    fontFamily: Font.Regular,
                    textAlign: config.textRotate,
                    color: Colors.lightGrey,
                    paddingRight: s(20)

                  }}>{Lang_chg.Gender[config.language]}</Text>

                <FlatList
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  data={['Male', 'Female']}
                  ItemSeparatorComponent={() => {
                    return (
                      <View style={{ width: s(25) }} />
                    )
                  }}
                  renderItem={({ item, index }) => {
                    return (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            this.setState({ gender: index })
                          }}
                          style={{
                            height: s(16),
                            width: s(16),
                            borderRadius: s(16),
                            borderWidth: index === gender ? 5 : 1,
                            borderColor: index === gender ? Colors.Blue : Colors.lightGrey
                          }}>

                        </TouchableOpacity>
                        <Text
                          style={{
                            fontSize: Font.small,
                            fontFamily: Font.Regular,
                            textAlign: config.textRotate,
                            color: Colors.darkText,
                            marginLeft: s(8)

                          }}>{item}</Text>
                      </View>

                    );
                  }}
                />

              </View>

              <Button
                text={Lang_chg.SAVEPATIENT[config.language]}
                onPress={() => this.submit_click()}
              />

            </View>
          </View>
        </KeyboardAwareScrollView>

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
      </View>
    );
  }
}
