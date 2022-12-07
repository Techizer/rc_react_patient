import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  Keyboard,
} from "react-native";
import React, { Component } from "react";
import Footer from "../Footer";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  consolepro,
  Colors,
  Icons,
  Font,
  config,
  windowWidth,
  Lang_chg,
  localStorage,
  apifuntion,
  msgProvider,
  msgText,
  msgTitle,
  Cameragallery,
  mediaprovider,
} from "../Provider/utilslib/Utils";
import DateTimePicker from "react-native-modal-datetime-picker";
import { AuthInputBoxSec, DropDownboxSec } from "../components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ScreenHeader from "../components/ScreenHeader";
import { leftArrow, Notification } from "../icons/SvgIcons/Index";
const bloodModal_arr = [
  {
    id: 1,
    blood: "A+",
    line: 0,
  },
  {
    id: 2,
    blood: "O+",
    line: 0,
  },
  {
    id: 3,
    blood: "B+",
    line: 0,
  },
  {
    id: 4,
    blood: "AB+",
    line: 0,
  },
  {
    id: 5,
    blood: "A-",
    line: 0,
  },
  {
    id: 5,
    blood: "B-",
    line: 0,
  },
  {
    id: 6,
    blood: "O-",
    line: 0,
  },
  {
    id: 7,
    blood: "AB-",
    line: 1,
  },
];

const occupation_arr = [
  {
    id: 1,
    name: "Technician",
    line: 0,
  },
  {
    id: 2,
    name: "Teacher",
    line: 0,
  },
  {
    id: 3,
    name: "Machinist",
    line: 0,
  },
  {
    id: 4,
    name: "Technologist",
    line: 0,
  },
  {
    id: 5,
    name: "Electrician",
    line: 0,
  },
  {
    id: 6,
    name: "Engineering technician",
    line: 0,
  },
  {
    id: 7,
    name: "Actuary",
    line: 0,
  },
  {
    id: 8,
    name: "Electrician",
    line: 0,
  },
  {
    id: 9,
    name: "Tradesman",
    line: 0,
  },
  {
    id: 10,
    name: "Mediacl laboratory scientist",
    line: 0,
  },
  {
    id: 11,
    name: "Quantity surveyor",
    line: 0,
  },
  {
    id: 12,
    name: "Prosthetist",
    line: 0,
  },
  {
    id: 13,
    name: "Paramedic",
    line: 0,
  },
  {
    id: 14,
    name: "Bricklayer",
    line: 0,
  },
  {
    id: 15,
    name: "Special Education Teacher",
    line: 0,
  },
  {
    id: 16,
    name: "Lawyer",
    line: 0,
  },
  {
    id: 17,
    name: "Physician",
    line: 0,
  },
  {
    id: 18,
    name: "other",
    line: 1,
  },
];

const activity_arr = [
  {
    id: 1,
    name: "Extremely inactive",
    line: 0,
  },
  {
    id: 2,
    name: "Sedentary",
    line: 0,
  },
  {
    id: 3,
    name: "Moderately active",
    line: 0,
  },
  {
    id: 4,
    name: "Vigorously active",
    line: 0,
  },
  {
    id: 5,
    name: "Extremely active",
    line: 1,
  },
];

const food_arr = [
  {
    id: 1,
    name: "Standard",
    line: 0,
  },
  {
    id: 2,
    name: "Pescetarian",
    line: 0,
  },
  {
    id: 3,
    name: "Vegetarian",
    line: 0,
  },
  {
    id: 3,
    name: "Lacto-vegetarian",
    line: 0,
  },
  {
    id: 3,
    name: "Vegan",
    line: 1,
  },
];

export default class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pbtn: true,
      mbtn: false,
      lbtn: false,
      country_modal: false,
      country_name: "",
      country_code: "",
      fbtn: false,
      country_short_code: "",
      mabtn: false,
      country_codefocus: false,
      allergies: "No",
      allergiesnobtn: false,
      work_area: "",
      currentyesbtn: false,
      currentnobtn: false,

      pastyesbtn: false,
      pastnobtn: false,

      injuriesyesbtn: false,
      injuriesnobtn: false,

      surgeriesyesbtn: false,
      surgeriesnobtn: false,

      chronicyesbtn: false,
      chronicnobtn: false,
      yesNoModal: false,
      smoking_btn: true,
      smoking: "",
      alcohol: "",

      nationalityModal: false,
      nationality_arr: "",

      bloodModal: false,
      bloodModal_arr: bloodModal_arr,

      occupation_arr: occupation_arr,
      activity_arr: activity_arr,
      food_arr: food_arr,
      activity_level: "",
      food: "",
      occupation: "",
      occ_food_activity: "activity",
      occ_food_activitymodal: false,
      occ_food_activity_arr: activity_arr,

      // modalvalue: false

      //--------------------------txtinput
      namefocus: false,
      name: "",
      emailfocus: false,
      email: "",
      numberfocus: false,
      number: "",
      dobfocus: false,
      dob: "",
      nationalityfocus: false,
      nationality: "",
      addressfocus: false,
      address: "",
      identityfocus: false,
      identity: "",

      allergiesfocus: false,
      allergie: "",
      currentfocus: false,
      current: "",
      pastfocus: false,
      past: "",
      injuriesfocus: false,
      injuries: "",
      sugeriesfocus: false,
      sugeries: "",
      chronicfocus: false,
      chronic: "",
      blood_group: "",
      name: "",

      mobile: "",
      address: "",
      profile_img: "NA",
      id_number: "",
      mediamodal: false,
      isDatePickerVisibletwo: false,
      dob_date: "",
      current_medication: "No",
      chronic_diseases: "No",
      surgeries: "No",
      injuries: "No",
      past_medication: "No",
      past_medication_data: "",
      injuries_data: "",
      surgeries_data: "",
      current_medication_data: "",
      chronic_diseases_data: "",
      nationality: "",
      profile_image: "",
      notification_count: "",
      date_new: new Date(),
    };
    screens = "EditProfile";
  }
  componentDidMount() {
    console.log("jay", this.state.date_new);
    this.props.navigation.addListener("focus", () => {
      this.getProfile();

      this.get_all_nationlity();
      this.get_all_notification();
      //   this. get_all_country()
    });
  }

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
  get_all_nationlity = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    console.log("user_details user_details", user_details);
    let user_id = user_details["user_id"];

    let url = config.baseURL + "api-getnationality";
    console.log("url", url);
    var data = new FormData();
    data.append("login_user_id", user_id);

    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        consolepro.consolelog("obj", obj);
        if (obj.status == true) {
          console.log("obj nationaltity", obj);
          this.setState({ nationality_arr: obj.result });
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log("-------- error ------- " + error);
      });
  };

  setalergy = (item) => {
    console.log("item", item);
    this.setState({ allergies: item });
  };
  setcurrentmadiciens = (item) => {
    console.log("item", item);
    this.setState({ current_medication: item });
  };
  setpastmedician = (item) => {
    console.log("item", item);
    this.setState({ past_medication: item });
  };
  setinjuries = (item) => {
    console.log("item", item);
    this.setState({ injuries: item });
  };
  setsurgeries = (item) => {
    console.log("item", item);
    this.setState({ surgeries: item });
  };
  setchronic_diseases = (item) => {
    console.log("item", item);
    this.setState({ chronic_diseases: item });
  };
  setdatetwo = (res) => {
    let check_month;
    let check_date;
    let date = res.getDate();
    let month = res.getMonth() + 1;
    let year = res.getFullYear();
    if (month < 9) {
      check_month = "0" + month;
    } else {
      check_month = month;
    }
    if (date < 9) {
      check_date = "0" + date;
    } else {
      check_date = date;
    }
    let date1 = year + "-" + check_month + "-" + check_date;
    this.setState({ date_new: new Date(date1) });
    this.setState({ dob_date: date1, isDatePickerVisibletwo: false });
  };

  getProfile = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    console.log("user_details user_details", user_details);
    let user_id = user_details["user_id"];

    let url = config.baseURL + "api-patient-profile";
    console.log("url", url);
    var data = new FormData();
    data.append("user_id", user_id);

    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        consolepro.consolelog("obj", obj);
        if (obj.status == true) {
          console.log("result123456", obj.result);

          let result = obj.result;
          console.log("result.nationality");
          this.setState({
            name: result["first_name"],
            email: result["email"],
            emailfocusget: true,
            user_id: result["user_id"],
            country_code: result["country_code"],
            work_area: result["work_area"],
            address: result["address"],
            identity: result["id_number"],
            identityfocus: true,
            namefocus: true,
            emailfocus: true,
          });

          // if(result['work_area']!=null && result['work_area']!='')
          // {
          //   this.setState({country_name:result['work_area'],country_codefocus:true})
          // }
          if (result["phone_number"] != null && result["phone_number"] != "") {
            this.setState({
              mobile: result["phone_number"],
              numberfocus: true,
            });
          }
          if (result["address"] != null && result["address"] != "") {
            this.setState({ addressfocus: true });
          }

          if (result["dob"] != null && result["dob"] != "") {
            this.setState({ dob_date: result["dob"], dobfocus: true });
            //  this.setState({date_new:new Date(result['dob'])})
            // console.log('date_new:new Date(result[dob])',new Date(result['dob']))
          }

          if (result.nationality != null && result.nationality != "") {
            this.setState({
              nationality: result["nationality"],
              nationalityfocus: true,
            });
          }
          if (result["gender"] != null && result["gender"] != "") {
            this.setState({ gender: result["gender"] });
            if (result["gender"] == "Female") {
              this.setState({ fbtn: true });
            } else {
              this.setState({ mabtn: true });
            }
          }
          if (result["smoking"] != null && result["smoking"] != "") {
            this.setState({ smoking: result["smoking"] });
          }
          if (result["blood_group"] != null) {
            this.setState({ blood_group: result["blood_group"] });
          }
          if (result["food_preference"] != null) {
            this.setState({ food: result["food_preference"] });
          }
          if (result["alcohol"] != null) {
            this.setState({ alcohol: result["alcohol"] });
          }
          if (result["occupation"] != null) {
            this.setState({ occupation: result["occupation"] });
          }
          if (result["activity_level"] != null) {
            this.setState({ activity_level: result["activity_level"] });
          }
          if (
            result["allergies_data"] != null &&
            result["allergies_data"] != ""
          ) {
            this.setState({ allergies_data: result["allergies_data"] });
          }
          if (result["allergies"] != null && result["allergies"] != "") {
            this.setState({ allergies: result["allergies"] });
          }
          if (
            result["chronic_diseases"] != null &&
            result["chronic_diseases"] != ""
          ) {
            this.setState({ chronic_diseases: result["chronic_diseases"] });
          }
          if (
            result["chronic_diseases_data"] != null &&
            result["chronic_diseases_data"] != ""
          ) {
            this.setState({
              chronic_diseases_data: result["chronic_diseases_data"],
            });
          }
          if (
            result["current_medication"] != null &&
            result["current_medication"] != ""
          ) {
            this.setState({ current_medication: result["current_medication"] });
          }
          if (
            result["current_medication_data"] != null &&
            result["current_medication_data"] != ""
          ) {
            this.setState({
              current_medication_data: result["current_medication_data"],
            });
          }
          if (result["injuries"] != null && result["injuries"] != "") {
            this.setState({ injuries: result["injuries"] });
          }
          if (
            result["injuries_data"] != null &&
            result["injuries_data"] != ""
          ) {
            this.setState({ injuries_data: result["injuries_data"] });
          }
          if (
            result["past_medication_data"] != null &&
            result["past_medication_data"] != ""
          ) {
            this.setState({
              past_medication_data: result["past_medication_data"],
            });
          }
          if (
            result["past_medication"] != null &&
            result["past_medication"] != ""
          ) {
            this.setState({ past_medication: result["past_medication"] });
          }
          if (result["surgeries"] != null && result["surgeries"] != "") {
            this.setState({ surgeries: result["surgeries"] });
          }
          if (
            result["surgeries_data"] != null &&
            result["surgeries_data"] != ""
          ) {
            this.setState({ surgeries_data: result["surgeries_data"] });
          }

          if (result.image != null) {
            this.setState({
              profile_img: config.img_url3 + result["image"],
            });
          }
        } else {
          msgProvider.alert(
            msgTitle.information[config.language],
            obj.message[config.language],
            false
          );

          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
        this.setState({ loading: false });
      });
  };

  medical_click = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];
    let url = config.baseURL + "api-edit-patient-profile-medical";
    console.log("url", url);

    var data = new FormData();
    data.append("user_id", user_id);
    data.append("allergies", this.state.allergies);
    data.append("allergies_data", this.state.allergies_data);
    data.append("current_medication", this.state.current_medication);
    data.append("current_medication_data", this.state.current_medication_data);
    data.append("past_medication", this.state.past_medication);
    data.append("past_medication_data", this.state.past_medication_data);
    data.append("injuries", this.state.injuries);
    data.append("injuries_data", this.state.injuries_data);
    data.append("surgeries", this.state.surgeries);
    data.append("surgeries_data", this.state.surgeries_data);
    data.append("chronic_diseases", this.state.chronic_diseases);
    data.append("chronic_diseases_data", this.state.chronic_diseases_data);
    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        consolepro.consolelog("obj", obj);

        if (obj.status == true) {
          let user_details = obj.result;
          localStorage.setItemObject("user_arr", user_details);

          // msgProvider.toast(obj.message,'center')
        } else {
          msgProvider.showError(obj.message);
          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
      });
  };

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

    Keyboard.dismiss();

    if (this.state.name.length <= 0 || this.state.name.trim().length <= 0) {
      msgProvider.showError(msgText.emptyName[config.language]);
      return false;
    }

    let regemail =
      /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (this.state.email.length <= 0 || this.state.email.trim().length <= 0) {
      msgProvider.showError(msgText.emptyEmail[config.language]);
      return false;
    }

    if (regemail.test(this.state.email) !== true) {
      msgProvider.showError(msgText.validEmail[config.language]);
      return false;
    }

    if (this.state.mobile.length <= 0 || this.state.mobile.trim().length <= 0) {
      msgProvider.showError(msgText.emptymobileNumber[config.language]);
      return false;
    }
    if (this.state.mobile.length < 9) {
      msgProvider.showError(msgText.validmobileNumber[config.language]);
      return false;
    }
    if (this.state.mobile.length > 9) {
      msgProvider.showError(msgText.validmobileNumber[config.language]);
      return false;
    }
    if (
      this.state.identity.length <= 0 ||
      this.state.identity.trim().length <= 0
    ) {
      msgProvider.showError(msgText.emptyid[config.language]);
      return false;
    }

    let url = config.baseURL + "api-edit-patient-profile-personal";
    console.log("url", url);
    var phone_number_send = this.state.country_code + this.state.mobile;
    var data = new FormData();
    data.append("user_id", user_id);
    data.append("first_name", this.state.name);
    data.append("phone_number", phone_number_send);
    data.append("gender", this.state.gender);
    data.append("id_number", this.state.identity);
    data.append("dob", this.state.dob_date);
    data.append("address", this.state.address);
    // data.append('country_code',this.state.country_code)
    data.append("work_area", this.state.work_area);
    data.append("nationality", this.state.nationality);
    console.log("this.state.profile_img1234", this.state.profile_image);
    if (this.state.profile_image != "") {
      console.log("this.state.profile_img123409", this.state.profile_img);
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
          let user_details = obj.result;
          localStorage.setItemObject("user_arr", user_details);
          setTimeout(() => {
            msgProvider.showSuccess(obj.message);
          }, 500);
        } else {
          msgProvider.showError(obj.message);
          // msgProvider.alert(obj.message, false);
        }
        return false;
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
        this.setState({ loading: false });
      });
  };
  lifestyle_click = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];

    if (this.state.smoking.length <= 0) {
      msgProvider.showError(msgText.smoking_msg[config.language]);
      return false;
    }
    if (this.state.alcohol.length <= 0) {
      msgProvider.showError(msgText.alcohal_msg[config.language]);
      return false;
    }
    if (this.state.blood_group.length <= 0) {
      msgProvider.showError(msgText.bloodgrp_msg[config.language]);
      return false;
    }
    if (this.state.activity_level.length <= 0) {
      msgProvider.showError(msgText.activity_level[config.language]);
      return false;
    }
    if (this.state.food.length <= 0) {
      msgProvider.showError(msgText.food_preferance[config.language]);
      return false;
    }
    if (this.state.occupation.length <= 0) {
      msgProvider.showError(msgText.occuation[config.language]);
      return false;
    }

    let url = config.baseURL + "api-edit-patient-profile-style";
    console.log("url", url);

    var data = new FormData();
    data.append("user_id", user_id);
    data.append("smoking", this.state.smoking);
    data.append("alcohol", this.state.alcohol);
    data.append("blood_group", this.state.blood_group);
    data.append("activity_level", this.state.activity_level);
    data.append("food_preference", this.state.food);

    data.append("occupation", this.state.occupation);
    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        consolepro.consolelog("obj", obj);

        if (obj.status == true) {
          let user_details = obj.result;
          localStorage.setItemObject("user_arr", user_details);

          // msgProvider.toast(obj.message,'center')
        } else {
          msgProvider.showError(obj.message);
          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
      });
  };
  render() {
    return (
      //
      <View style={{ flex: 1 }}>

        {/* -------------------Yes No MOdal----------------------- */}

        {/* <DatePicker
                     
                     modal          
                     mode="date"
                     date={this.state.date_new}
                     title="Select Date"
                     titleIOS="Select Date"
                     maximumDate={new Date()}
                     open={this.state.isDatePickerVisibletwo}
                     onConfirm={(date)=>{this.setdatetwo(date),this.setState({isDatePickerVisibletwo:false})}}
                     onCancel={()=>{this.setState({isDatePickerVisibletwo:false})}}
                 />

       */}
        <DateTimePicker
          isVisible={this.state.isDatePickerVisibletwo}
          mode="date"
          value={this.state.date_new}
          maximumDate={new Date()}
          onConfirm={(date) => {
            this.setdatetwo(date),
              this.setState({ isDatePickerVisibletwo: false });
          }}
          onCancel={() => {
            this.setState({ isDatePickerVisibletwo: false });
          }}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.yesNoModal}
          onRequestClose={() => {}}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              this.setState({ yesNoModal: false });
            }}
            style={{
              flex: 1,
              alignSelf: "center",
              justifyContent: "center",
              backgroundColor: "#00000080",
              width: "100%",
            }}
          >
            <View
              style={{
                width: "70%",
                backgroundColor: "White",
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
              }}
            >
              <View
                style={{
                  width: "100%",
                  backgroundColor: Colors.backgroundcolorblue,
                }}
              >
                <View
                  style={{ width: "55%", paddingVertical: (windowWidth * 3) / 100 }}
                >
                  <Text
                    style={{
                      textAlign: config.textRotate,
                      fontFamily: Font.Regular,
                      fontSize: (windowWidth * 4) / 100,
                      alignSelf: "center",
                      color: Colors.White,
                    }}
                  >
                    {this.state.smoking_btn == true
                      ? Lang_chg.smoking[config.language]
                      : Lang_chg.Alcohol[config.language]}
                  </Text>
                </View>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    if (this.state.smoking_btn == true) {
                      this.setState({ yesNoModal: false, smoking: "Yes" });
                    } else {
                      this.setState({ yesNoModal: false, alcohol: "Yes" });
                    }
                  }}
                  style={{
                    width: "100%",
                    alignSelf: "center",

                    flexDirection: "row",
                    borderBottomColor: "#0000001F",
                    borderBottomWidth: 1,
                    paddingVertical: (windowWidth * 3) / 100,
                  }}
                >
                  <View style={{ width: "87%", alignSelf: "center" }}>
                    <Text
                      style={{
                        color: Colors.Black,
                        fontSize: (windowWidth * 4) / 100,
                        textAlign: config.textRotate,
                      }}
                    >
                      {Lang_chg.yes_txt_new[config.language]}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (this.state.smoking_btn == true) {
                      this.setState({ yesNoModal: false, smoking: "No" });
                    } else {
                      this.setState({ yesNoModal: false, alcohol: "No" });
                    }
                  }}
                  style={{
                    width: "100%",
                    alignSelf: "center",
                    marginTop: (windowWidth * 3) / 100,
                    flexDirection: "row",
                    borderBottomColor: "#0000001F",
                    borderBottomWidth: 1,
                    paddingVertical: (windowWidth * 3) / 100,
                  }}
                >
                  <View style={{ width: "100%", alignSelf: "center" }}>
                    <View style={{ width: "87%", alignSelf: "center" }}>
                      <Text
                        style={{
                          color: Colors.Black,
                          fontSize: (windowWidth * 4) / 100,
                          textAlign: config.textRotate,
                        }}
                      >
                        {Lang_chg.no_txt_new[config.language]}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* //------------------------nationality modal----- */}

        {/* -------------------Yes No MOdal----------------------- */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.nationalityModal}
          onRequestClose={() => {}}
        >
          <SafeAreaView style={{ flex: 1 }}>
            {/* <View style={{ height: windowHeight * 100 / 100, backgroundColor: '#fff' }}> */}

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                this.setState({ nationalityModal: false });
              }}
              style={{
                flex: 1,
                backgroundColor: "#00000090",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 0,
              }}
            >
              <View
                style={{
                  width: "70%",
                  backgroundColor: "White",
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  marginTop: (windowWidth * 16) / 100,
                  marginBottom: (windowWidth * 10) / 100,
                }}
              >
                <View
                  style={{
                    width: "100%",

                    backgroundColor: Colors.backgroundcolorblue,
                  }}
                >
                  <View
                    style={{
                      width: "35%",
                      paddingVertical: (windowWidth * 3) / 100,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: config.textRotate,
                        fontFamily: Font.Regular,
                        fontSize: (windowWidth * 4) / 100,
                        alignSelf: "center",
                        color: Colors.White,
                      }}
                    >
                      {Lang_chg.nationality[config.language]}
                    </Text>
                  </View>
                </View>
                <View style={{ width: "100%" }}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                      paddingBottom: (windowWidth * 10) / 100,
                    }}
                    data={this.state.nationality_arr}
                    renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({
                              nationalityModal: false,
                              nationality: item.name,
                              nationalityfocus: true,
                            });
                          }}
                        >
                          <View
                            style={{
                              width: "100%",
                              backgroundColor: "#fff",
                              alignSelf: "center",
                              justifyContent: "flex-end",
                            }}
                          >
                            <View
                              style={{
                                width: "95%",
                                borderBottomColor: "#0000001F",
                                borderBottomWidth: 1,
                                paddingVertical: (windowWidth * 2) / 100,
                                marginLeft: (windowWidth * 5) / 100,
                              }}
                            >
                              <Text
                                style={{
                                  color: Colors.Black,
                                  fontSize: (windowWidth * 4) / 100,
                                  textAlign: config.textRotate,
                                }}
                              >
                                {item.name}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    }}
                    keyExtractor={(item, index) => index.toString()}
                  ></FlatList>
                </View>
              </View>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.occ_food_activitymodal}
          onRequestClose={() => {}}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              this.setState({ occ_food_activitymodal: false });
            }}
            style={{
              flex: 1,
              alignSelf: "center",
              justifyContent: "center",
              backgroundColor: "#00000080",
              width: "100%",

              paddingBottom: (windowWidth * 8) / 100,
            }}
          >
            <View
              style={{
                width: "70%",
                backgroundColor: "White",
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
                marginTop: (windowWidth * 20) / 100,
              }}
            >
              <View
                style={{
                  width: "100%",
                  backgroundColor: Colors.backgroundcolorblue,
                }}
              >
                <View
                  style={{
                    marginLeft: (windowWidth * 5) / 100,
                    width: "65%",
                    paddingVertical: (windowWidth * 3) / 100,
                  }}
                >
                  <Text
                    style={{
                      textAlign: config.textRotate,
                      fontFamily: Font.Regular,
                      fontSize: (windowWidth * 4) / 100,

                      color: Colors.White,
                    }}
                  >
                    {this.state.occ_food_activity == "activity"
                      ? Lang_chg.ActivityLevel[config.language]
                      : this.state.occ_food_activity == "food"
                      ? Lang_chg.FoodPreference[config.language]
                      : Lang_chg.Occupation[config.language]}
                  </Text>
                </View>
              </View>
              <View style={{ width: "100%", alignSelf: "center" }}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: (windowWidth * 4) / 100 }}
                  data={this.state.occ_food_activity_arr}
                  renderItem={({ item, index }) => {
                    return (
                      <View>
                        <TouchableOpacity
                          onPress={() => {
                            if (this.state.occ_food_activity == "activity") {
                              this.setState({
                                occ_food_activitymodal: false,
                                activity_level: item.name,
                              });
                            } else if (this.state.occ_food_activity == "food") {
                              this.setState({
                                occ_food_activitymodal: false,
                                food: item.name,
                              });
                            } else {
                              this.setState({
                                occ_food_activitymodal: false,
                                occupation: item.name,
                              });
                            }
                          }}
                        >
                          <View
                            style={{
                              width: "100%",
                              backgroundColor: "#fff",
                              alignSelf: "center",
                              justifyContent: "flex-end",
                            }}
                          >
                            <View
                              style={[
                                {
                                  width: "95%",
                                  borderBottomWidth: 1,
                                  paddingVertical: (windowWidth * 2.5) / 100,
                                  marginLeft: (windowWidth * 5) / 100,
                                },
                                item.line == 0
                                  ? { borderBottomColor: "#0000001F" }
                                  : { borderBottomColor: "#fff" },
                              ]}
                            >
                              <Text
                                style={{
                                  color: Colors.Black,
                                  fontSize: (windowWidth * 4) / 100,
                                  textAlign: config.textRotate,
                                }}
                              >
                                {item.name}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                  keyExtractor={(item, index) => index.toString()}
                ></FlatList>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* ===================================country get===================== */}
        {/*  */}

        {/* --------------------------------------------------------------------------------------bloodmodal */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.bloodModal}
          onRequestClose={() => {}}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              this.setState({ bloodModal: false });
            }}
            style={{
              flex: 1,
              alignSelf: "center",
              justifyContent: "center",
              backgroundColor: "#00000080",
              width: "100%",
            }}
          >
            <View
              style={{
                width: "70%",
                backgroundColor: "White",
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
              }}
            >
              <View
                style={{
                  width: "100%",
                  backgroundColor: Colors.backgroundcolorblue,
                  paddingVertical: (windowWidth * 2) / 100,
                }}
              >
                <Text
                  style={{
                    paddingLeft: (windowWidth * 4.5) / 100,
                    paddingRight: (windowWidth * 4.5) / 100,
                    textAlign: config.textRotate,
                    fontFamily: Font.Regular,
                    fontSize: (windowWidth * 4) / 100,
                    color: Colors.White,
                  }}
                >
                  {Lang_chg.blood[config.language]}
                </Text>
              </View>

              <View style={{ width: "100%", alignSelf: "center" }}>
                <FlatList
                  contentContainerStyle={{ paddingBottom: (windowWidth * 2) / 100 }}
                  data={bloodModal_arr}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            bloodModal: false,
                            blood_group: item.blood,
                          });
                        }}
                      >
                        <View
                          style={{
                            width: "100%",
                            backgroundColor: "#fff",
                            alignSelf: "center",
                            justifyContent: "flex-end",
                          }}
                        >
                          <View
                            style={[
                              {
                                width: "95%",
                                borderBottomWidth: 1,
                                paddingVertical: (windowWidth * 2) / 100,
                                marginLeft: (windowWidth * 5) / 100,
                              },
                              item.line == 0
                                ? { borderBottomColor: "#0000001F" }
                                : { borderBottomColor: "#fff" },
                            ]}
                          >
                            <Text
                              style={{
                                color: Colors.Black,
                                fontSize: (windowWidth * 4) / 100,
                                paddingLeft: (windowWidth * 2) / 100,
                                textAlign: config.textRotate,
                              }}
                            >
                              {item.blood}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* ------------------------------------------------------------------------------------------------------------ */}

        <View style={{ flex: 1, backgroundColor:Colors.backgroundcolor }}>
        <ScreenHeader
          title={Lang_chg.Editprofile[config.language]}
          navigation={this.props.navigation}
          onBackPress={() => this.props.navigation.pop()}
          leftIcon={leftArrow}
          rightIcon={Notification}
        />

          <ScrollView
            style={{ backgroundColor: "White" }}
            contentContainerStyle={{ paddingBottom: (windowWidth * 15) / 100 }}
            showsVerticalScrollIndicator={false}
          >
            <KeyboardAwareScrollView>
              {/* //----------------------------------------------------------------------------tab */}
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
                  backgroundColor: "#F1F2F4",
                  width: "100%",

                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ pbtn: true, mbtn: false, lbtn: false });
                  }}
                  style={{ width: "33%", alignSelf: "center" }}
                >
                  <View style={{ width: "100%" }}>
                    <Text
                      style={
                        this.state.pbtn == true
                          ? {
                              color: Colors.Blue,

                              fontFamily: Font.blackheadingfontfamily,
                              fontSize: Font.tabtextsize,
                              textAlign: config.textalign,
                              alignSelf: "center",
                              paddingVertical: (windowWidth * 3) / 100,
                            }
                          : {
                              color: Colors.lightGrey,
                              fontFamily: Font.blackheadingfontfamily,
                              fontSize: Font.tabtextsize,
                              textAlign: config.textalign,
                              alignSelf: "center",
                            }
                      }
                    >
                      {Lang_chg.tabnameprofile[config.language]}
                    </Text>

                    <View
                      style={
                        this.state.pbtn == true
                          ? {
                              width: (windowWidth * 28) / 100,
                              alignSelf: "center",
                              borderWidth: 2.2,
                              borderColor: Colors.Blue,
                              borderTopLeftRadius: (windowWidth * 2) / 100,
                              borderTopRightRadius: (windowWidth * 2) / 100,
                              backgroundColor: Colors.Blue,
                              alignSelf: "center",
                            }
                          : {
                              width: (windowWidth * 30) / 100,
                              alignSelf: "center",
                              borderColor: Colors.tab_background_color,
                              borderWidth: 2.5,
                            }
                      }
                    ></View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    this.setState({ pbtn: false, mbtn: true, lbtn: false });
                  }}
                  style={{ width: "33%" }}
                >
                  <View style={{ width: "100%" }}>
                    <Text
                      style={
                        this.state.mbtn == true
                          ? {
                              color: Colors.Blue,

                              fontFamily: Font.blackheadingfontfamily,
                              fontSize: Font.tabtextsize,
                              textAlign: config.textalign,
                              alignSelf: "center",
                              paddingVertical: (windowWidth * 3) / 100,
                            }
                          : {
                              color: Colors.lightGrey,
                              fontFamily: Font.blackheadingfontfamily,
                              fontSize: Font.tabtextsize,
                              textAlign: config.textalign,
                              alignSelf: "center",
                            }
                      }
                    >
                      {Lang_chg.tabnamemedical[config.language]}
                    </Text>
                    <View
                      style={
                        this.state.mbtn == true
                          ? {
                              width: (windowWidth * 28) / 100,
                              alignSelf: "center",
                              borderWidth: 2.2,
                              borderColor: Colors.Blue,
                              borderTopLeftRadius: (windowWidth * 2) / 100,
                              borderTopRightRadius: (windowWidth * 2) / 100,
                              backgroundColor: Colors.Blue,
                              alignSelf: "center",
                            }
                          : {
                              width: (windowWidth * 30) / 100,
                              alignSelf: "center",
                              borderColor: Colors.tab_background_color,
                              borderWidth: 2.5,
                            }
                      }
                    ></View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    this.setState({ pbtn: false, mbtn: false, lbtn: true });
                  }}
                  style={{ width: "33%" }}
                >
                  <View style={{ width: "100%" }}>
                    <Text
                      style={
                        this.state.lbtn == true
                          ? {
                              color: Colors.Blue,

                              fontFamily: Font.blackheadingfontfamily,
                              fontSize: Font.tabtextsize,
                              textAlign: config.textalign,
                              alignSelf: "center",
                              paddingVertical: (windowWidth * 3) / 100,
                            }
                          : {
                              color: Colors.lightGrey,
                              fontFamily: Font.blackheadingfontfamily,
                              fontSize: Font.tabtextsize,
                              textAlign: config.textalign,
                              alignSelf: "center",
                            }
                      }
                    >
                      {Lang_chg.tabnamelifestyle[config.language]}
                    </Text>
                  </View>

                  <View
                    style={
                      this.state.lbtn == true
                        ? {
                            width: (windowWidth * 28) / 100,
                            alignSelf: "center",
                            borderWidth: 2.2,
                            borderColor: Colors.Blue,
                            borderTopLeftRadius: (windowWidth * 2) / 100,
                            borderTopRightRadius: (windowWidth * 2) / 100,
                            backgroundColor: Colors.Blue,
                            alignSelf: "center",
                          }
                        : {
                            width: (windowWidth * 30) / 100,
                            alignSelf: "center",
                            borderColor: Colors.tab_background_color,
                            borderWidth: 2.5,
                          }
                    }
                  />
                </TouchableOpacity>
              </View>

              {/* -------------------------------personal-------------------------- */}
              {this.state.pbtn == true && (
                <View>
                  <View
                    style={{
                      width: "90%",
                      alignSelf: "center",
                      marginTop: (windowWidth * 7) / 100,
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ width: "28%", alignSelf: "center" }}>
                      <View
                        style={{
                          width: (windowWidth * 21) / 100,
                          height: (windowWidth * 21) / 100,
                          borderRadius: (windowWidth * 10.5) / 100,
                          borderWidth: 2.5,
                          borderColor: Colors.bordercolor_light_blue,

                          alignItems: "center",
                        }}
                      >
                        <Image
                          style={{
                            width: (windowWidth * 20) / 100,
                            height: (windowWidth * 20) / 100,
                            borderRadius: (windowWidth * 10) / 100,

                            alignSelf: "center",
                          }}
                          source={
                            this.state.profile_img == "NA" ||
                            this.state.profile_img == null ||
                            this.state.profile_img == ""
                              ? Icons.profileimg
                              : { uri: this.state.profile_img }
                          }
                        ></Image>
                      </View>
                    </View>

                    <View style={{ width: "70%", alignSelf: "center" }}>
                      <View style={{ width: "100%", alignSelf: "center" }}>
                        <Text
                          style={{
                            color: Colors.allergic_heading_color,
                            fontFamily: Font.blackheadingfontfamily,
                            fontSize: Font.tabtextsize,
                            textAlign: config.textRotate,
                          }}
                        >
                          {this.state.name}
                        </Text>
                      </View>

                      <View
                        style={{
                          width: "100%",
                          alignSelf: "center",
                          marginTop: (windowWidth * 1) / 100,
                        }}
                      >
                        <Text
                          style={{
                            color: Colors.lightGrey,
                            fontFamily: Font.allergies_heading_fontfamily,
                            fontSize: (windowWidth * 3) / 100,
                            textAlign: config.textRotate,
                          }}
                        >
                          {this.state.email}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View
                    style={{
                      width: "60%",
                      alignSelf: "center",
                      marginTop: (windowWidth * -8) / 100,
                      marginRight: (windowWidth * 4) / 100,
                    }}
                  >
                    <View
                      style={{
                        width: (windowWidth * 8) / 100,
                        height: (windowWidth * 8) / 100,
                        borderRadius: (windowWidth * 4) / 100,
                        borderWidth: 2,
                        borderColor: Colors.bordercolor_light_blue,
                        backgroundColor: "White",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ mediamodal: true });
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
                        ></Image>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* ---------------------------------------------------------------------------textinput */}

                  {/* --------------------------------------------------name */}

                  <View
                    style={{
                      width: "90%",
                      alignSelf: "center",
                      marginTop: (windowWidth * 6) / 100,
                      // borderColor:this.state.namefocus==true?Colors.placholderactive:Colors.placeholder_border,
                      // borderWidth:1,
                      // borderRadius:windowWidth*1/100,
                    }}
                  >
                    <AuthInputBoxSec
                      mainContainer={{
                        width: "100%",
                      }}
                      // icon={layer9_icon}
                      lableText={Lang_chg.textinputname[config.language]}
                      inputRef={(ref) => {
                        this.nameInput = ref;
                      }}
                      onChangeText={(text) => this.setState({ name: text })}
                      maxLength={50}
                      value={this.state.name}
                      keyboardType="default"
                      autoCapitalize="none"
                      returnKeyLabel="done"
                      returnKeyType="done"
                      onSubmitEditing={() => {
                        //this.passwordInput.focus();
                      }}
                    />
                    {/* <View style={{width:'95%',alignSelf:'center',}}>
                  <TextInput
                     style={{
                    width: '100%',
                    color: Colors.Black,
                    fontSize: Font.placeholdersize,
                    textAlign: config.textalign,
                    height: (windowWidth * 12) / 100,
                    fontFamily: Font.placeholderfontfamily,
                    borderRadius: (windowWidth * 1) / 100 ,
                   
                   }}
                    maxLength={50}
                    placeholder={this.state.namefocus!=true?Lang_chg.textinputname[config.language]:null}
                    DarkGrey={Colors.DarkGrey}
                    onChangeText={(txt)=>{this.setState({name:txt})}}
                    value={this.state.name}
                    onFocus={()=>{this.setState({namefocus:true})}}
                    onBlur={()=>{ this.setState({namefocus:this.state.name.length>0?true:false})}}
                    keyboardType='default'
                    returnKeyLabel='done'
                    returnKeyType='done'
                  />
                  </View>
                {this.state.namefocus==true && <View style={{position:'absolute',backgroundColor:'White',left:windowWidth*4/100,top:-windowWidth*2.5/100,paddingHorizontal:windowWidth*1/100}}>
                     <Text style={{color:'#0057A5',textAlign:config.textalign}}>{Lang_chg.textinputname[config.language]}</Text>
                 </View>} */}
                  </View>

                  {/* -----------------------------------------------------------------------------mo no- */}
                  <View
                    style={{
                      width: "100%",
                      alignSelf: "center",
                      marginTop: (windowWidth * 2) / 100,
                    }}
                  >
                    <DropDownboxSec
                      lableText={
                        this.state.work_area.length <= 0
                          ? Lang_chg.select[config.language]
                          : this.state.work_area
                      }
                      boxPressAction={() => {
                        // this.setState({ bloodModal: true });
                      }}
                      isDisabled={true}
                    />
                    {/* <View
                    
                    style={{ width: '100%',
                      alignSelf: 'center',
                      borderColor:'#CCCCCC',
                      borderWidth:1,
                      backgroundColor:Colors.tab_background_color,
                      borderRadius:windowWidth*1/100,
                      paddingVertical: (windowWidth * 3.7) / 100,
                      marginTop: (windowWidth * 3) / 100,}}>
                    <View
                      style={{
                        width: '95%',
                        alignSelf: 'center',
                        flexDirection: 'row',
                        justifyContent:'space-between'
                      }}>
                        <Text style={{fontSize: (windowWidth * 3.7) / 100,fontFamily:Font.Regular, textAlign:config.textRotate}}>
                          {this.state.work_area.length<=0?Lang_chg.select[config.language]:this.state.work_area}
                        </Text>

                      <View style={{width: '20%', alignSelf: 'center'}}>
                        <Image
                          style={{
                            height: (windowWidth * 4) / 100,
                            width: (windowWidth * 4) / 100,
                            alignSelf: 'flex-end',
                          }}
                          source={Icons.downarrow}></Image>
                      </View>
                    </View>
                  </View> */}
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: (windowWidth * 90) / 100,
                      justifyContent: "space-between",
                      alignSelf: "center",
                    }}
                  >
                    <View
                      style={{
                        width: "20%",
                        alignSelf: "center",
                        marginTop: (windowWidth * 2.3) / 100,
                        // borderColor: this.state.country_code.length > 0 ? '#0057A5' : Colors.placeholder_border,
                        // borderWidth: 1,
                        // borderRadius: (windowWidth * 1) / 100,
                      }}
                    >
                      <AuthInputBoxSec
                        mainContainer={{
                          width: "100%",
                        }}
                        inputFieldStyle={{
                          textAlign: "center",
                          marginBottom: (windowWidth * 4) / 100,
                        }}
                        // icon={layer9_icon}
                        lableText={Lang_chg.CC_code[config.language]}
                        inputRef={(ref) => {
                          this.country_codeInput = ref;
                        }}
                        onChangeText={(text) =>
                          this.setState({ country_code: text })
                        }
                        maxLength={3}
                        editable={false}
                        value={this.state.country_code}
                        keyboardType="number-pad"
                        autoCapitalize="none"
                        returnKeyLabel="done"
                        returnKeyType="done"
                        onSubmitEditing={() => {
                          Keyboard.dismiss();
                        }}
                      />
                      {/* <TextInput
                        style={{
                          width: '100%',
                          color: Colors.Black,
                          fontSize: Font.placeholdersize,
                          textAlign: 'center',
                          height: Font.placeholder_height,
                          fontFamily: Font.placeholderfontfamily,

                        }}
                        maxLength={3}
                        editable={false}
                        placeholder={
                          this.state.country_codefocus != true
                            ? Lang_chg.CC_code[config.language]
                            : null
                        }
                        DarkGrey={Colors.DarkGrey}
                        onChangeText={txt => {
                          this.setState({ country_code: txt });
                        }}

                        onFocus={() => {
                          this.setState({ country_codefocus: true });
                        }}
                        onBlur={() => {
                          this.setState({
                            country_codefocus: this.state.country_code.length > 0 ? true : false,
                          });
                        }}

                        value={"" + this.state.country_code + ""}
                        keyboardType="number-pad"
                        returnKeyLabel="done"
                        returnKeyType="done"
                        onSubmitEditing={() => { Keyboard.dismiss() }}
                      />

                      {this.state.country_code.length > 0 &&
                        <View
                          style={{
                            position: 'absolute',
                            backgroundColor: 'White',
                            left: (windowWidth * 5) / 100,
                            top: (-windowWidth * 2) / 100,
                            paddingHorizontal: (windowWidth * 1) / 100,
                          }}>
                          <Text style={{ color: '#0057A5' }}>
                            {Lang_chg.CC_code[config.language]}
                          </Text>
                        </View>
                      } */}
                    </View>
                    <View
                      style={{
                        width: "75%",
                        alignSelf: "center",
                        marginTop: (windowWidth * 2) / 100,
                        // borderColor: this.state.numberfocus == true ? Colors.placholderactive : Colors.placeholder_border,
                        // borderWidth: 1,
                        // borderRadius: windowWidth * 1 / 100,
                      }}
                    >
                      <AuthInputBoxSec
                        mainContainer={{
                          width: "100%",
                        }}
                        // icon={layer9_icon}
                        lableText={Lang_chg.textinputnumber[config.language]}
                        inputRef={(ref) => {
                          this.mobileInput = ref;
                        }}
                        maxLength={9}
                        onChangeText={(text) => this.setState({ mobile: text })}
                        value={this.state.mobile}
                        keyboardType="number-pad"
                        autoCapitalize="none"
                        returnKeyLabel="done"
                        returnKeyType="done"
                        onSubmitEditing={() => {
                          //this.passwordInput.focus();
                        }}
                      />
                      <View
                        style={{
                          width: "89%",
                          // alignSelf: 'center',
                          marginTop: (windowWidth * 0.5) / 100,
                        }}
                      >
                        <Text
                          style={{
                            textAlign: config.textRotate,
                            fontSize: Font.textsize,
                            fontFamily: Font.headingfontfamily,
                            color: Colors.lightGrey,
                          }}
                        >
                          {Lang_chg.mobletexttitle[config.language]}
                        </Text>
                      </View>
                      {/* <TextInput
                        style={{
                          width: '100%',
                          color: Colors.Black,
                          fontSize: Font.placeholdersize,
                          textAlign: config.textalign,
                          height: (windowWidth * 12) / 100,
                          fontFamily: Font.placeholderfontfamily,
                          borderRadius: (windowWidth * 1) / 100,
                          marginLeft: windowWidth * 1.5 / 100

                        }}
                        maxLength={50}
                        placeholder={this.state.numberfocus != true ? Lang_chg.textinputnumber[config.language] : null}
                        DarkGrey={Colors.DarkGrey}
                        onChangeText={(txt) => { this.setState({ mobile: txt }) }}
                        value={this.state.mobile}
                        onFocus={() => { this.setState({ numberfocus: true }) }}
                        onBlur={() => { this.setState({ numberfocus: this.state.mobile.length > 0 ? true : false }) }}
                        keyboardType='number-pad'
                        returnKeyLabel='done'
                        returnKeyType='done'
                      />

                      {this.state.numberfocus == true && <View style={{ position: 'absolute', backgroundColor: 'White', left: windowWidth * 4 / 100, top: -windowWidth * 2.5 / 100, paddingHorizontal: windowWidth * 1 / 100 }}>
                        <Text style={{ color: '#0057A5', textAlign: config.textalign }}>{Lang_chg.textinputnumber[config.language]}</Text>
                      </View>} */}
                    </View>
                  </View>
                  {/* //---------------email */}

                  <View
                    style={{
                      width: "90%",
                      alignSelf: "center",
                      marginTop: (windowWidth * 3) / 100,
                      // borderColor: this.state.emailfocus == true ? Colors.placholderactive : Colors.placeholder_border, borderWidth: 1, borderRadius: (windowWidth * 1) / 100,
                    }}
                  >
                    <AuthInputBoxSec
                      mainContainer={{
                        width: "100%",
                      }}
                      // icon={layer9_icon}
                      lableText={Lang_chg.textinputemails[config.language]}
                      inputRef={(ref) => {
                        this.emailInput = ref;
                      }}
                      maxLength={100}
                      onChangeText={(text) => this.setState({ email: text })}
                      value={this.state.email}
                      editable={false}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        this.mobileInput.focus();
                      }}
                    />
                    {/* <View style={{ width: '95%', alignSelf: 'center', }}>
                      <TextInput
                        style={{
                          width: '100%',
                          color: Colors.Black,
                          fontSize: Font.placeholdersize,
                          textAlign: config.textalign,
                          height: (windowWidth * 12) / 100,
                          fontFamily: Font.placeholderfontfamily,
                          borderRadius: (windowWidth * 1) / 100,

                        }}
                        maxLength={100}
                        placeholder={this.state.emailfocus != true ? Lang_chg.textinputemails[config.language] : null}
                        DarkGrey={Colors.DarkGrey}
                        onChangeText={(txt) => { this.setState({ email: txt }) }}
                        value={this.state.email}
                        editable={false}
                        onFocus={() => { this.setState({ emailfocus: true }) }}
                        onBlur={() => { this.setState({ emailfocus: this.state.email.length > 0 ? true : false }) }}
                        keyboardType='email-address'
                        returnKeyLabel='done'
                        returnKeyType='done'
                      />
                    </View>
                    {this.state.emailfocus == true && <View style={{ position: 'absolute', backgroundColor: 'White', left: windowWidth * 4 / 100, top: -windowWidth * 2.5 / 100, paddingHorizontal: windowWidth * 1 / 100 }}>
                      <Text style={{ color: '#0057A5', textAlign: config.textalign }}>{Lang_chg.textinputemails[config.language]}</Text>
                    </View>} */}
                  </View>

                  {/* ------------------------------------------------------------dob-----------      */}
                  <View
                    style={{
                      width: "90%",
                      alignSelf: "center",
                      marginTop: (windowWidth * 3) / 100,
                      flexDirection: "row",
                      borderColor:
                        this.state.dobfocus == true
                          ? Colors.field_border_color
                          : Colors.field_border_color,
                      borderWidth: 1,
                      borderRadius: (windowWidth * 1) / 100,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ isDatePickerVisibletwo: true });
                      }}
                      style={{ width: "100%", flexDirection: "row" }}
                    >
                      <View style={{ width: "1%" }}></View>
                      <View
                        style={{
                          width: "100%",
                          height: Font.placeholder_height,
                          marginLeft: (windowWidth * 2) / 100,
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        <Text
                          style={{
                            width: "78%",
                            textAlign: config.textRotate,
                            color: Colors.DarkGrey,
                          }}
                        >
                          {this.state.dob_date.length <= 0
                            ? Lang_chg.dob[config.language]
                            : this.state.dob_date}
                        </Text>
                        <View
                          style={{
                            width: "15%",
                            alignSelf: "center",
                            alignItems: "flex-end",
                          }}
                        >
                          <Image
                            source={Icons.dobimg}
                            style={{ height: 25, width: 25 }}
                          ></Image>
                        </View>
                      </View>
                    </TouchableOpacity>

                    {this.state.dobfocus == true && (
                      <View
                        style={{
                          position: "absolute",
                          backgroundColor: "White",
                          left: (windowWidth * 4) / 100,
                          top: (-windowWidth * 2.5) / 100,
                          paddingHorizontal: (windowWidth * 1) / 100,
                        }}
                      >
                        <Text
                          style={{
                            color: "#0057A5",
                            textAlign: config.textalign,
                          }}
                        >
                          {Lang_chg.dob[config.language]}
                        </Text>
                      </View>
                    )}
                  </View>
                  {/* -----------------------------------radiobtn------------------------------- */}

                  <View
                    style={{
                      width: "90%",
                      alignSelf: "center",
                      marginTop: (windowWidth * 3.2) / 100,
                      marginBottom: (windowWidth * 2) / 100,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ width: "23%" }}>
                      <Text
                        style={{
                          color: Colors.textGender,
                          fontFamily: Font.placeholderfontfamily,
                          fontSize: (windowWidth * 4.1) / 100,
                          textAlign: config.textRotate,
                        }}
                      >
                        {Lang_chg.Gender[config.language]}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: "70%",
                        alignSelf: "center",

                        flexDirection: "row",
                      }}
                    >
                      <View
                        style={{
                          width: "30%",
                          alignSelf: "center",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <View
                          style={{
                            width: "100%",
                            alignSelf: "center",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          {this.state.mabtn == false && (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({
                                  mabtn: true,
                                  fbtn: false,
                                  gender: "Male",
                                });
                              }}
                              style={{
                                width: "100%",
                                alignSelf: "center",
                                flexDirection: "row",
                              }}
                            >
                              <Icon
                                style={{ alignSelf: "center" }}
                                name="circle-thin"
                                size={22}
                                color={"#8F98A7"}
                              ></Icon>

                              <View
                                style={{ width: "70%", alignSelf: "center" }}
                              >
                                <Text
                                  style={{
                                    color: Colors.textGender,
                                    fontSize: (windowWidth * 4.1) / 100,
                                    fontFamily: Font.placeholderfontfamily,
                                    marginLeft: (windowWidth * 1.5) / 100,
                                    textAlign: config.textRotate,
                                  }}
                                >
                                  {Lang_chg.male[config.language]}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          )}
                          {this.state.mabtn == true && (
                            <View
                              style={{
                                width: "100%",
                                alignSelf: "center",
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Icon
                                style={{ alignSelf: "center" }}
                                name="dot-circle-o"
                                size={22}
                                color={"#0168B3"}
                              ></Icon>
                              <View
                                style={{ width: "70%", alignSelf: "center" }}
                              >
                                <Text
                                  style={{
                                    color: Colors.textGender,
                                    fontSize: (windowWidth * 4.1) / 100,
                                    fontFamily: Font.placeholderfontfamily,
                                    marginLeft: (windowWidth * 1.5) / 100,
                                    textAlign: config.textRotate,
                                  }}
                                >
                                  {Lang_chg.male[config.language]}
                                </Text>
                              </View>
                            </View>
                          )}
                        </View>
                      </View>

                      <View
                        style={{
                          width: "33%",
                          alignSelf: "center",
                          flexDirection: "row",
                          alignItems: "center",
                          // justifyContent:'space-between'
                        }}
                      >
                        <View
                          style={{
                            width: "100%",
                            alignSelf: "center",
                            marginLeft: (windowWidth * 2) / 100,
                          }}
                        >
                          {this.state.fbtn == false && (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({
                                  fbtn: true,
                                  mabtn: false,
                                  gender: "Female",
                                });
                              }}
                              style={{
                                width: "100%",
                                alignSelf: "center",
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Icon
                                style={{ alignSelf: "center" }}
                                name="circle-thin"
                                size={22}
                                color={"#8F98A7"}
                              ></Icon>

                              <Text
                                style={{
                                  color: Colors.textGender,
                                  textAlign: config.textRotate,
                                  fontSize: (windowWidth * 4.1) / 100,
                                  fontFamily: Font.placeholderfontfamily,
                                  marginLeft: (windowWidth * 1.5) / 100,
                                  // alignSelf: 'center',
                                }}
                              >
                                {Lang_chg.female[config.language]}
                              </Text>
                            </TouchableOpacity>
                          )}
                          {this.state.fbtn == true && (
                            <View
                              style={{
                                width: "100%",
                                alignSelf: "center",
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Icon
                                style={{ alignSelf: "center" }}
                                name="dot-circle-o"
                                size={22}
                                color={"#0168B3"}
                              ></Icon>
                              <Text
                                style={{
                                  color: Colors.textGender,
                                  textAlign: config.textRotate,
                                  fontSize: (windowWidth * 4.1) / 100,
                                  fontFamily: Font.placeholderfontfamily,
                                  marginLeft: (windowWidth * 1.5) / 100,
                                  // alignSelf: 'center',
                                }}
                              >
                                {Lang_chg.female[config.language]}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* ================================nationality======================================= */}
                  <View
                    style={{
                      width: "90%",
                      alignSelf: "center",
                      marginTop: (windowWidth * 3) / 100,
                      flexDirection: "row",
                      borderColor:
                        this.state.nationalityfocus == true
                          ? Colors.field_border_color
                          : Colors.field_border_color,
                      borderWidth: 1,
                      borderRadius: (windowWidth * 1) / 100,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ nationalityModal: true });
                      }}
                    >
                      <View
                        style={{
                          width: "100%",
                          height: 48,
                          alignSelf: "center",
                          flexDirection: "row",
                          alignItems: "center",
                          height: Font.placeholder_height,
                          borderRadius: (windowWidth * 1) / 100,
                          justifyContent: "center",
                        }}
                      >
                        <View style={{ width: "1%" }}></View>
                        <Text
                          style={{
                            width: "77%",
                            alignSelf: "center",
                            color: Colors.Black,
                            fontSize: Font.placeholdersize,
                            textAlign: config.textRotate,
                            fontFamily: Font.placeholderfontfamily,
                          }}
                        >
                          {this.state.nationality.length <= 0
                            ? Lang_chg.nationality[config.language]
                            : this.state.nationality}
                        </Text>
                        <View
                          style={{
                            width: "20%",
                            alignSelf: "center",
                            alignItems: "flex-end",
                          }}
                        >
                          <Image
                            source={Icons.downarrow}
                            style={{ height: 16, width: 16 }}
                          ></Image>
                        </View>
                      </View>
                    </TouchableOpacity>

                    {this.state.nationalityfocus == true && (
                      <View
                        style={{
                          position: "absolute",
                          backgroundColor: "White",
                          left: (windowWidth * 4) / 100,
                          top: (-windowWidth * 2.5) / 100,
                          paddingHorizontal: (windowWidth * 1) / 100,
                        }}
                      >
                        <Text
                          style={{
                            color: "#0057A5",
                            textAlign: config.textRotate,
                          }}
                        >
                          {Lang_chg.nationality[config.language]}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* ===================================address==================================== */}
                  <View
                    style={{
                      width: "90%",
                      alignSelf: "center",
                      marginTop: (windowWidth * 3) / 100,
                      // borderColor: this.state.addressfocus == true ? Colors.placholderactive : Colors.placeholder_border, borderWidth: 1, borderRadius: (windowWidth * 1) / 100,
                    }}
                  >
                    <AuthInputBoxSec
                      mainContainer={{
                        width: "100%",
                      }}
                      // icon={layer9_icon}
                      lableText={Lang_chg.textinputaddress[config.language]}
                      inputRef={(ref) => {
                        this.addressInput = ref;
                      }}
                      onChangeText={(text) => this.setState({ address: text })}
                      maxLength={50}
                      value={this.state.address}
                      // editable={false}
                      keyboardType="default"
                      autoCapitalize="none"
                      returnKeyType="done"
                      onSubmitEditing={() => {
                        // this.mobileInput.focus();
                      }}
                    />
                    {/* <View style={{ width: '95%', alignSelf: 'center', }}>
                      <TextInput
                        style={{
                          width: '100%',
                          color: Colors.Black,
                          fontSize: Font.placeholdersize,
                          textAlign: config.textalign,
                          height: (windowWidth * 12) / 100,
                          fontFamily: Font.placeholderfontfamily,
                          borderRadius: (windowWidth * 1) / 100,

                        }}
                        maxLength={50}
                        placeholder={this.state.addressfocus != true ? Lang_chg.textinputaddress[config.language] : null}
                        DarkGrey={Colors.DarkGrey}
                        onChangeText={(txt) => { this.setState({ address: txt }) }}
                        value={this.state.address}
                        onFocus={() => { this.setState({ addressfocus: true }) }}
                        onBlur={() => { this.setState({ addressfocus: this.state.address.length > 0 ? true : false }) }}
                        keyboardType='default'
                        returnKeyLabel='done'
                        returnKeyType='done'
                      />
                    </View>
                    {this.state.addressfocus == true && <View style={{ position: 'absolute', backgroundColor: 'White', left: windowWidth * 4 / 100, top: -windowWidth * 2.5 / 100, paddingHorizontal: windowWidth * 1 / 100 }}>
                      <Text style={{ color: '#0057A5', textAlign: config.textalign }}>{Lang_chg.textinputaddress[config.language]}</Text>
                    </View>} */}
                  </View>

                  {/* =================================identity================================ */}
                  <View
                    style={{
                      width: "90%",
                      alignSelf: "center",
                      marginTop: (windowWidth * 3) / 100,
                      // borderColor: this.state.identityfocus == true ? Colors.placholderactive : Colors.placeholder_border, borderWidth: 1, borderRadius: (windowWidth * 1) / 100,
                    }}
                  >
                    <AuthInputBoxSec
                      mainContainer={{
                        width: "100%",
                      }}
                      // icon={layer9_icon}
                      lableText={Lang_chg.textinputidentity[config.language]}
                      inputRef={(ref) => {
                        this.addressInput = ref;
                      }}
                      onChangeText={(text) => this.setState({ identity: text })}
                      maxLength={15}
                      value={this.state.identity}
                      editable={false}
                      keyboardType="default"
                      autoCapitalize="none"
                      returnKeyType="done"
                      onSubmitEditing={() => {
                        // this.mobileInput.focus();
                      }}
                    />
                    {/* <View style={{ width: '95%', alignSelf: 'center', }}>
                      <TextInput
                        style={{
                          width: '100%',
                          color: Colors.Black,
                          fontSize: Font.placeholdersize,
                          textAlign: config.textalign,
                          height: (windowWidth * 12) / 100,
                          fontFamily: Font.placeholderfontfamily,
                          borderRadius: (windowWidth * 1) / 100,

                        }}
                        maxLength={15}
                        placeholder={this.state.identityfocus != true ? Lang_chg.textinputidentity[config.language] : null}
                        DarkGrey={Colors.DarkGrey}
                        onChangeText={(txt) => { this.setState({ identity: txt }) }}
                        value={this.state.identity}
                        onFocus={() => { this.setState({ identityfocus: true }) }}
                        onBlur={() => { this.setState({ identityfocus: this.state.identity.length > 0 ? true : false }) }}
                        keyboardType='default'
                        returnKeyLabel='done'
                        returnKeyType='done'
                      />
                    </View>
                    {this.state.identityfocus == true && <View style={{ position: 'absolute', backgroundColor: 'White', left: windowWidth * 4 / 100, top: -windowWidth * 2.5 / 100, paddingHorizontal: windowWidth * 1 / 100 }}>
                      <Text style={{ color: '#0057A5', textAlign: config.textalign }}>{Lang_chg.textinputidentity[config.language]}</Text>
                    </View>} */}
                  </View>

                  {/* ==========================================person btn================================ */}

                  <View style={{ paddingBottom: (windowWidth * 10) / 100 }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.submit_click();
                      }}
                      style={{
                        width: "90%",
                        alignSelf: "center",
                        borderRadius: (windowWidth * 2) / 100,
                        backgroundColor: Colors.Theme,
                        paddingVertical: (windowWidth * 4) / 100,
                        marginTop: (windowWidth * 5) / 100,
                        shadowColor: "#000",
                        shadowOffset: { width: 1, height: 1 },
                        shadowOpacity: 0.5,
                        shadowRadius: 2,
                        elevation: 3,
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
                        {Lang_chg.submitbtntext[config.language]}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* ----------------------------------------------------------------------------------------------medical btn */}

              {this.state.mbtn == true && (
                <View>
                  <View
                    style={{
                      width: "100%",
                      backgroundColor: Colors.tab_background_color,
                    }}
                  >
                    <View
                      style={{
                        width: "90%",
                        alignSelf: "center",
                        marginTop: (windowWidth * 2) / 100,
                        paddingBottom: (windowWidth * 3) / 100,
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.allergic_heading_color,
                          fontFamily: Font.allergies_heading_fontfamily,
                          fontSize: Font.allergies_txt_size_edit,
                          textAlign: config.textRotate,
                          // textAlign:config.textalign,
                        }}
                      >
                        {Lang_chg.allergies[config.language]}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      width: "90%",
                      alignSelf: "center",
                      marginTop: (windowWidth * 2) / 100,
                    }}
                  >
                    <Text
                      style={{
                        color: Colors.textgray_que,
                        fontFamily: Font.allergies_heading_fontfamily,
                        fontSize: Font.quessize,
                        textAlign: config.textRotate,
                        // textAlign:config.textalign,
                      }}
                    >
                      {Lang_chg.q1[config.language]}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: "88%",
                      alignSelf: "center",
                      marginTop: (windowWidth * 3) / 100,
                      flexDirection: "row",
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => {
                        this.setalergy("Yes");
                      }}
                      style={{
                        width: "30%",
                        alignSelf: "center",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ width: "20%", alignSelf: "center" }}>
                        <View
                          style={{
                            width: (windowWidth * 5) / 100,
                            alignSelf: "center",
                            flexDirection: "row",
                          }}
                        >
                          <Icon
                            name={
                              this.state.allergies == "Yes"
                                ? "dot-circle-o"
                                : "circle-thin"
                            }
                            size={22}
                            color={"#0168B3"}
                          ></Icon>
                        </View>
                      </View>

                      <View style={{ width: "35%", alignSelf: "center" }}>
                        <Text
                          style={{
                            color: Colors.textgray_que,
                            textAlign: "center",
                            fontSize: Font.text_height,
                            alignSelf: "center",
                            fontFamily: Font.allergies_heading_fontfamily,
                          }}
                        >
                          {Lang_chg.yes_txt[config.language]}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => {
                        this.setalergy("No");
                      }}
                      style={{
                        width: "30%",
                        alignSelf: "center",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ width: "20%", alignSelf: "center" }}>
                        <View
                          style={{
                            width: "100%",
                            alignSelf: "center",
                            flexDirection: "row",
                          }}
                        >
                          <Icon
                            name={
                              this.state.allergies == "No"
                                ? "dot-circle-o"
                                : "circle-thin"
                            }
                            size={22}
                            color={"#0168B3"}
                          ></Icon>
                        </View>
                      </View>

                      <View style={{ width: "35%", alignSelf: "center" }}>
                        <Text
                          style={{
                            color: Colors.textgray_que,
                            textAlign: "center",
                            fontSize: Font.text_height,
                            fontFamily: Font.allergies_heading_fontfamily,
                            alignSelf: "center",
                          }}
                        >
                          {Lang_chg.no_txt[config.language]}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={{ paddingBottom: (windowWidth * 3) / 100 }}>
                    {this.state.allergies == "Yes" && (
                      <View
                        style={{
                          width: "90%",
                          alignSelf: "center",
                          marginTop: (windowWidth * 6) / 100,
                          // borderColor: this.state.allergiesfocus == true ? Colors.placholderactive : Colors.placeholder_border,
                          // borderWidth: windowWidth * 0.3 / 100,
                          // borderRadius: (windowWidth * 1) / 100
                        }}
                      >
                        <AuthInputBoxSec
                          mainContainer={{
                            width: "100%",
                          }}
                          // icon={layer9_icon}
                          lableText={
                            Lang_chg.textinputallierdies[config.language]
                          }
                          inputRef={(ref) => {
                            this.allergies_dataInput = ref;
                          }}
                          onChangeText={(text) =>
                            this.setState({ allergies_data: text })
                          }
                          maxLength={70}
                          value={this.state.allergies_data}
                          keyboardType="default"
                          autoCapitalize="none"
                          returnKeyType="done"
                          onSubmitEditing={() => {
                            // this.mobileInput.focus();
                          }}
                        />

                        {/* <View style={{ width: '95%', alignSelf: 'center' }}>
                          <TextInput
                            style={{
                              width: '100%',
                              color: Colors.Black,
                              fontSize: Font.placeholdersize,
                              textAlign: config.textalign,
                              height: (windowWidth * 12) / 100,
                              fontFamily: Font.placeholderfontfamily,
                              borderRadius: (windowWidth * 1) / 100,

                            }}
                            maxLength={70}
                            placeholder={this.state.allergiesfocus != true ? Lang_chg.textinputallierdies[config.language] : null}
                            DarkGrey={Colors.DarkGrey}
                            onChangeText={(txt) => { this.setState({ allergies_data: txt }) }}
                            value={this.state.allergies_data}
                            onFocus={() => { this.setState({ allergiesfocus: true }) }}
                            onBlur={() => { this.setState({ allergiesfocus: this.state.allergies_data.length > 0 ? true : false }) }}

                            returnKeyLabel="done"
                            returnKeyType="done"
                          />
                        </View>
                        {this.state.allergiesfocus == true && (
                          <View
                            style={{
                              position: 'absolute',
                              backgroundColor: 'White',
                              left: (windowWidth * 4) / 100,
                              top: (-windowWidth * 2) / 100,
                              paddingHorizontal: (windowWidth * 1) / 100,
                            }}>
                            <Text style={{ color: '#0057A5', textAlign: config.textalign }}>{Lang_chg.textinputallierdies[config.language]}</Text>
                          </View>
                        )} */}
                      </View>
                    )}
                  </View>
                  {/* ---------------------------------------------------------------------------------------q2 */}

                  <View
                    style={{
                      width: "100%",
                      backgroundColor: Colors.tab_background_color,
                    }}
                  >
                    <View
                      style={{
                        width: "90%",
                        alignSelf: "center",
                        marginTop: (windowWidth * 2) / 100,
                        paddingBottom: (windowWidth * 3) / 100,
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.allergic_heading_color,
                          fontFamily: Font.allergies_heading_fontfamily,
                          fontSize: Font.allergies_txt_size_edit,
                          textAlign: config.textRotate,
                        }}
                      >
                        {Lang_chg.current[config.language]}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      width: "90%",
                      alignSelf: "center",
                      marginTop: (windowWidth * 2) / 100,
                    }}
                  >
                    <Text
                      style={{
                        color: Colors.textgray_que,
                        fontFamily: Font.allergies_heading_fontfamily,
                        fontSize: Font.quessize,
                        textAlign: config.textRotate,
                      }}
                    >
                      {Lang_chg.q2[config.language]}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: "88%",
                      alignSelf: "center",
                      marginTop: (windowWidth * 3) / 100,
                      flexDirection: "row",
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => {
                        this.setcurrentmadiciens("Yes");
                      }}
                      style={{
                        width: "30%",
                        alignSelf: "center",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ width: "20%", alignSelf: "center" }}>
                        <View
                          style={{
                            width: (windowWidth * 5) / 100,
                            alignSelf: "center",
                            flexDirection: "row",
                          }}
                        >
                          <Icon
                            name={
                              this.state.current_medication == "Yes"
                                ? "dot-circle-o"
                                : "circle-thin"
                            }
                            size={22}
                            color={"#0168B3"}
                          ></Icon>
                        </View>
                      </View>

                      <View style={{ width: "35%", alignSelf: "center" }}>
                        <Text
                          style={{
                            color: Colors.textgray_que,
                            textAlign: "center",
                            fontSize: Font.text_height,
                            alignSelf: "center",
                            fontFamily: Font.allergies_heading_fontfamily,
                          }}
                        >
                          {Lang_chg.yes_txt[config.language]}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        this.setcurrentmadiciens("No");
                      }}
                      style={{
                        width: "30%",
                        alignSelf: "center",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ width: "20%", alignSelf: "center" }}>
                        <View
                          style={{
                            width: "100%",
                            alignSelf: "center",
                            flexDirection: "row",
                          }}
                        >
                          <Icon
                            name={
                              this.state.current_medication == "No"
                                ? "dot-circle-o"
                                : "circle-thin"
                            }
                            size={22}
                            color={"#0168B3"}
                          ></Icon>
                        </View>
                      </View>

                      <View style={{ width: "35%", alignSelf: "center" }}>
                        <Text
                          style={{
                            color: Colors.textgray_que,
                            textAlign: "center",
                            fontSize: Font.text_height,
                            fontFamily: Font.allergies_heading_fontfamily,
                            alignSelf: "center",
                          }}
                        >
                          {Lang_chg.no_txt[config.language]}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={{ paddingBottom: (windowWidth * 3) / 100 }}>
                    {this.state.current_medication == "Yes" && (
                      <View
                        style={{
                          width: "90%",
                          alignSelf: "center",
                          marginTop: (windowWidth * 5) / 100,
                          // borderColor: this.state.currentfocus == true ? Colors.placholderactive : Colors.placeholder_border,
                          // borderWidth: 1,
                          // borderRadius: (windowWidth * 1) / 100,
                        }}
                      >
                        <AuthInputBoxSec
                          mainContainer={{
                            width: "100%",
                          }}
                          // icon={layer9_icon}
                          lableText={Lang_chg.textinputcurrent[config.language]}
                          inputRef={(ref) => {
                            this.current_medication_dataInput = ref;
                          }}
                          onChangeText={(text) =>
                            this.setState({ current_medication_data: text })
                          }
                          maxLength={50}
                          value={this.state.current_medication_data}
                          keyboardType="default"
                          autoCapitalize="none"
                          returnKeyLabel="done"
                          returnKeyType="done"
                          onSubmitEditing={() => {
                            // this.mobileInput.focus();
                          }}
                        />

                        {/* <View style={{ width: '95%', alignSelf: 'center', }}>
                        <TextInput
                          style={{
                            width: '100%',
                            color: Colors.Black,
                            fontSize: Font.placeholdersize,
                            textAlign: config.textalign,
                            height: (windowWidth * 12) / 100,
                            fontFamily: Font.placeholderfontfamily,
                            borderRadius: (windowWidth * 1) / 100,

                          }}
                          maxLength={50}
                          placeholder={this.state.currentfocus != true ? Lang_chg.textinputcurrent[config.language] : null}
                          DarkGrey={Colors.DarkGrey}
                          onChangeText={(txt) => { this.setState({ current_medication_data: txt }) }}
                          value={this.state.current_medication_data}
                          onFocus={() => { this.setState({ currentfocus: true }) }}
                          onBlur={() => { this.setState({ currentfocus: this.state.current_medication_data.length > 0 ? true : false }) }}
                          keyboardType='default'
                          returnKeyLabel='done'
                          returnKeyType='done'
                        />
                      </View>
                      {this.state.currentfocus == true && <View style={{ position: 'absolute', backgroundColor: 'White', left: windowWidth * 4 / 100, top: -windowWidth * 2.5 / 100, paddingHorizontal: windowWidth * 1 / 100 }}>
                        <Text style={{ color: '#0057A5', textAlign: config.textalign }}>{Lang_chg.textinputcurrent[config.language]}</Text>
                      </View>} */}
                      </View>
                    )}
                  </View>

                  {/* ----------------------------------------------------------------------------q3--------------------- */}
                  <View
                    style={{
                      width: "100%",
                      backgroundColor: Colors.tab_background_color,
                    }}
                  >
                    <View
                      style={{
                        width: "90%",
                        alignSelf: "center",
                        marginTop: (windowWidth * 2) / 100,
                        paddingBottom: (windowWidth * 3) / 100,
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.allergic_heading_color,
                          fontFamily: Font.allergies_heading_fontfamily,
                          fontSize: Font.allergies_txt_size_edit,
                          textAlign: config.textRotate,
                        }}
                      >
                        {Lang_chg.pastmedication[config.language]}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      width: "90%",
                      alignSelf: "center",
                      marginTop: (windowWidth * 2) / 100,
                    }}
                  >
                    <Text
                      style={{
                        color: Colors.textgray_que,
                        fontFamily: Font.allergies_heading_fontfamily,
                        fontSize: Font.quessize,
                        textAlign: config.textRotate,
                      }}
                    >
                      {Lang_chg.q3[config.language]}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: "88%",
                      alignSelf: "center",
                      marginTop: (windowWidth * 3) / 100,
                      flexDirection: "row",
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => {
                        this.setpastmedician("Yes");
                      }}
                      style={{
                        width: "30%",
                        alignSelf: "center",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ width: "20%", alignSelf: "center" }}>
                        <View
                          style={{
                            width: (windowWidth * 5) / 100,
                            alignSelf: "center",
                            flexDirection: "row",
                          }}
                        >
                          <Icon
                            name={
                              this.state.past_medication == "Yes"
                                ? "dot-circle-o"
                                : "circle-thin"
                            }
                            size={22}
                            color={"#0168B3"}
                          ></Icon>
                        </View>
                      </View>

                      <View style={{ width: "35%", alignSelf: "center" }}>
                        <Text
                          style={{
                            color: Colors.textgray_que,
                            textAlign: "center",
                            fontSize: Font.text_height,
                            alignSelf: "center",
                            fontFamily: Font.allergies_heading_fontfamily,
                          }}
                        >
                          {Lang_chg.yes_txt[config.language]}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => {
                        this.setpastmedician("No");
                      }}
                      style={{
                        width: "30%",
                        alignSelf: "center",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ width: "20%", alignSelf: "center" }}>
                        <View
                          style={{
                            width: (windowWidth * 5) / 100,
                            alignSelf: "center",
                            flexDirection: "row",
                          }}
                        >
                          <Icon
                            name={
                              this.state.past_medication == "No"
                                ? "dot-circle-o"
                                : "circle-thin"
                            }
                            size={22}
                            color={"#0168B3"}
                          ></Icon>
                        </View>
                      </View>

                      <View style={{ width: "35%", alignSelf: "center" }}>
                        <Text
                          style={{
                            color: Colors.textgray_que,
                            textAlign: "center",
                            fontSize: Font.text_height,
                            fontFamily: Font.allergies_heading_fontfamily,
                            alignSelf: "center",
                          }}
                        >
                          {Lang_chg.no_txt[config.language]}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={{ paddingBottom: (windowWidth * 3) / 100 }}>
                    {this.state.past_medication == "Yes" && (
                      <View
                        style={{
                          width: "90%",
                          alignSelf: "center",
                          marginTop: (windowWidth * 5) / 100,
                          // borderColor: this.state.pastfocus == true ? Colors.placholderactive : Colors.placeholder_border,
                          // borderWidth: 1,
                          // borderRadius: (windowWidth * 1) / 100,
                        }}
                      >
                        <AuthInputBoxSec
                          mainContainer={{
                            width: "100%",
                          }}
                          // icon={layer9_icon}
                          lableText={
                            Lang_chg.textinputpastmedication[config.language]
                          }
                          inputRef={(ref) => {
                            this.past_medication_dataInput = ref;
                          }}
                          onChangeText={(text) =>
                            this.setState({ past_medication_data: text })
                          }
                          maxLength={50}
                          value={this.state.past_medication_data}
                          keyboardType="default"
                          autoCapitalize="none"
                          returnKeyLabel="done"
                          returnKeyType="done"
                          onSubmitEditing={() => {
                            // this.mobileInput.focus();
                          }}
                        />

                        {/* <View style={{ width: '95%', alignSelf: 'center', }}>
                        <TextInput
                          style={{
                            width: '100%',
                            color: Colors.Black,
                            fontSize: Font.placeholdersize,
                            textAlign: config.textalign,
                            height: (windowWidth * 12) / 100,
                            fontFamily: Font.placeholderfontfamily,
                            borderRadius: (windowWidth * 1) / 100,

                          }}
                          maxLength={50}
                          placeholder={this.state.pastfocus != true ? Lang_chg.textinputpastmedication[config.language] : null}
                          DarkGrey={Colors.DarkGrey}
                          onChangeText={(txt) => { this.setState({ past_medication_data: txt }) }}
                          value={this.state.past_medication_data}
                          onFocus={() => { this.setState({ pastfocus: true }) }}
                          onBlur={() => { this.setState({ pastfocus: this.state.past_medication_data.length > 0 ? true : false }) }}
                          keyboardType='default'
                          returnKeyLabel='done'
                          returnKeyType='done'
                        />
                      </View>
                      {this.state.pastfocus == true && <View style={{ position: 'absolute', backgroundColor: 'White', left: windowWidth * 4 / 100, top: -windowWidth * 2.5 / 100, paddingHorizontal: windowWidth * 1 / 100 }}>
                        <Text style={{ color: '#0057A5', textAlign: config.textalign }}>{Lang_chg.textinputpastmedication[config.language]}</Text>
                      </View>} */}
                      </View>
                    )}
                  </View>
                  {/* ----------------------------------------------------------------------q4----------------------------------- */}

                  <View
                    style={{
                      width: "100%",
                      backgroundColor: Colors.tab_background_color,
                    }}
                  >
                    <View
                      style={{
                        width: "90%",
                        alignSelf: "center",
                        marginTop: (windowWidth * 2) / 100,
                        paddingBottom: (windowWidth * 3) / 100,
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.allergic_heading_color,
                          fontFamily: Font.allergies_heading_fontfamily,
                          fontSize: Font.allergies_txt_size_edit,
                          textAlign: config.textRotate,
                        }}
                      >
                        {Lang_chg.injuries[config.language]}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      width: "90%",
                      alignSelf: "center",
                      marginTop: (windowWidth * 2) / 100,
                    }}
                  >
                    <Text
                      style={{
                        color: Colors.textgray_que,
                        fontFamily: Font.allergies_heading_fontfamily,
                        fontSize: Font.quessize,
                        textAlign: config.textRotate,
                      }}
                    >
                      {Lang_chg.q4[config.language]}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: "88%",
                      alignSelf: "center",
                      marginTop: (windowWidth * 3) / 100,
                      flexDirection: "row",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.setinjuries("Yes");
                      }}
                      style={{
                        width: "30%",
                        alignSelf: "center",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ width: "20%", alignSelf: "center" }}>
                        <View
                          style={{
                            width: (windowWidth * 5) / 100,
                            alignSelf: "center",
                            flexDirection: "row",
                          }}
                        >
                          <Icon
                            name={
                              this.state.injuries == "Yes"
                                ? "dot-circle-o"
                                : "circle-thin"
                            }
                            size={22}
                            color={"#0168B3"}
                          ></Icon>
                        </View>
                      </View>

                      <View style={{ width: "35%", alignSelf: "center" }}>
                        <Text
                          style={{
                            color: Colors.textgray_que,
                            textAlign: "center",
                            fontSize: Font.text_height,
                            alignSelf: "center",
                            fontFamily: Font.allergies_heading_fontfamily,
                          }}
                        >
                          {Lang_chg.yes_txt[config.language]}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => {
                        this.setinjuries("No");
                      }}
                      style={{
                        width: "30%",
                        alignSelf: "center",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ width: "20%", alignSelf: "center" }}>
                        <View
                          style={{
                            width: "100%",
                            alignSelf: "center",
                            flexDirection: "row",
                          }}
                        >
                          <Icon
                            name={
                              this.state.injuries == "No"
                                ? "dot-circle-o"
                                : "circle-thin"
                            }
                            size={22}
                            color={"#0168B3"}
                          ></Icon>
                        </View>
                      </View>

                      <View style={{ width: "35%", alignSelf: "center" }}>
                        <Text
                          style={{
                            color: Colors.textgray_que,
                            textAlign: "center",
                            fontSize: Font.text_height,
                            fontFamily: Font.allergies_heading_fontfamily,
                            alignSelf: "center",
                          }}
                        >
                          {Lang_chg.no_txt[config.language]}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={{ paddingBottom: (windowWidth * 3) / 100 }}>
                    {this.state.injuries == "Yes" && (
                      <View
                        style={{
                          width: "90%",
                          alignSelf: "center",
                          marginTop: (windowWidth * 5) / 100,
                          // borderColor: this.state.injuriesfocus == true ? Colors.placholderactive : Colors.placeholder_border,
                          // borderWidth: 1,
                          // borderRadius: (windowWidth * 1) / 100,
                        }}
                      >
                        <AuthInputBoxSec
                          mainContainer={{
                            width: "100%",
                          }}
                          // icon={layer9_icon}
                          lableText={
                            Lang_chg.textinputinjuries[config.language]
                          }
                          inputRef={(ref) => {
                            this.injuries_dataInput = ref;
                          }}
                          onChangeText={(text) =>
                            this.setState({ injuries_data: text })
                          }
                          maxLength={50}
                          value={this.state.injuries_data}
                          keyboardType="default"
                          autoCapitalize="none"
                          returnKeyLabel="done"
                          returnKeyType="done"
                        />

                        {/* <View style={{ width: '95%', alignSelf: 'center', }}>
                        <TextInput
                          style={{
                            width: '100%',
                            color: Colors.Black,
                            fontSize: Font.placeholdersize,
                            textAlign: config.textalign,
                            height: (windowWidth * 12) / 100,
                            fontFamily: Font.placeholderfontfamily,
                            borderRadius: (windowWidth * 1) / 100,

                          }}
                          maxLength={50}
                          placeholder={this.state.injuriesfocus != true ? Lang_chg.textinputinjuries[config.language] : null}
                          DarkGrey={Colors.DarkGrey}
                          onChangeText={(txt) => { this.setState({ injuries_data: txt }) }}
                          value={this.state.injuries_data}
                          onFocus={() => { this.setState({ injuriesfocus: true }) }}
                          onBlur={() => { this.setState({ injuriesfocus: this.state.injuries_data.length > 0 ? true : false }) }}
                          keyboardType='default'
                          returnKeyLabel='done'
                          returnKeyType='done'
                        />
                      </View>
                      {this.state.injuriesfocus == true && <View style={{ position: 'absolute', backgroundColor: 'White', left: windowWidth * 4 / 100, top: -windowWidth * 2.5 / 100, paddingHorizontal: windowWidth * 1 / 100 }}>
                        <Text style={{ color: '#0057A5', textAlign: config.textalign }}>{Lang_chg.textinputinjuries[config.language]}</Text>
                      </View>} */}
                      </View>
                    )}
                  </View>
                  {/* --------------------------------------------------------------------------------------q5 */}

                  <View
                    style={{
                      width: "100%",
                      backgroundColor: Colors.tab_background_color,
                    }}
                  >
                    <View
                      style={{
                        width: "90%",
                        alignSelf: "center",
                        marginTop: (windowWidth * 2) / 100,
                        paddingBottom: (windowWidth * 3) / 100,
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.allergic_heading_color,
                          fontFamily: Font.allergies_heading_fontfamily,
                          fontSize: Font.allergies_txt_size_edit,
                          textAlign: config.textRotate,
                        }}
                      >
                        {Lang_chg.surgeries[config.language]}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      width: "90%",
                      alignSelf: "center",
                      marginTop: (windowWidth * 2) / 100,
                    }}
                  >
                    <Text
                      style={{
                        color: Colors.textgray_que,
                        fontFamily: Font.allergies_heading_fontfamily,
                        fontSize: Font.quessize,
                        textAlign: config.textRotate,
                      }}
                    >
                      {Lang_chg.q5[config.language]}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: "88%",
                      alignSelf: "center",
                      marginTop: (windowWidth * 3) / 100,
                      flexDirection: "row",
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => {
                        this.setsurgeries("Yes");
                      }}
                      style={{
                        width: "30%",
                        alignSelf: "center",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ width: "20%", alignSelf: "center" }}>
                        <View
                          style={{
                            width: (windowWidth * 5) / 100,
                            alignSelf: "center",
                            flexDirection: "row",
                          }}
                        >
                          <Icon
                            name={
                              this.state.surgeries == "Yes"
                                ? "dot-circle-o"
                                : "circle-thin"
                            }
                            size={22}
                            color={"#0168B3"}
                          ></Icon>
                        </View>
                      </View>

                      <View style={{ width: "35%", alignSelf: "center" }}>
                        <Text
                          style={{
                            color: Colors.textgray_que,
                            textAlign: "center",
                            fontSize: Font.text_height,
                            alignSelf: "center",
                            fontFamily: Font.allergies_heading_fontfamily,
                          }}
                        >
                          {Lang_chg.yes_txt[config.language]}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        this.setsurgeries("No");
                      }}
                      style={{
                        width: "30%",
                        alignSelf: "center",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ width: "20%", alignSelf: "center" }}>
                        <View
                          style={{
                            width: (windowWidth * 5) / 100,
                            alignSelf: "center",
                            flexDirection: "row",
                          }}
                        >
                          <Icon
                            name={
                              this.state.surgeries == "No"
                                ? "dot-circle-o"
                                : "circle-thin"
                            }
                            size={22}
                            color={"#0168B3"}
                          ></Icon>
                        </View>
                      </View>

                      <View style={{ width: "35%", alignSelf: "center" }}>
                        <Text
                          style={{
                            color: Colors.textgray_que,
                            textAlign: "center",
                            fontSize: Font.text_height,
                            fontFamily: Font.allergies_heading_fontfamily,
                            alignSelf: "center",
                          }}
                        >
                          {Lang_chg.no_txt[config.language]}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={{ paddingBottom: (windowWidth * 3) / 100 }}>
                    {this.state.surgeries == "Yes" && (
                      <View
                        style={{
                          width: "90%",
                          alignSelf: "center",
                          marginTop: (windowWidth * 5) / 100,
                          // borderColor: this.state.sugeriesfocus == true ? Colors.placholderactive : Colors.placeholder_border,
                          // borderWidth: 1,
                          // borderRadius: (windowWidth * 1) / 100,
                        }}
                      >
                        <AuthInputBoxSec
                          mainContainer={{
                            width: "100%",
                          }}
                          // icon={layer9_icon}
                          lableText={
                            Lang_chg.textinputsurgeries[config.language]
                          }
                          inputRef={(ref) => {
                            this.surgeries_dataInput = ref;
                          }}
                          onChangeText={(text) =>
                            this.setState({ surgeries_data: text })
                          }
                          maxLength={50}
                          value={this.state.surgeries_data}
                          keyboardType="default"
                          autoCapitalize="none"
                          returnKeyLabel="done"
                          returnKeyType="done"
                        />

                        {/* <View style={{ width: '95%', alignSelf: 'center', }}>
                        <TextInput
                          style={{
                            width: '100%',
                            color: Colors.Black,
                            fontSize: Font.placeholdersize,
                            textAlign: config.textalign,
                            height: (windowWidth * 12) / 100,
                            fontFamily: Font.placeholderfontfamily,
                            borderRadius: (windowWidth * 1) / 100,

                          }}
                          maxLength={50}
                          placeholder={this.state.sugeriesfocus != true ? Lang_chg.textinputsurgeries[config.language] : null}
                          DarkGrey={Colors.DarkGrey}
                          onChangeText={(txt) => { this.setState({ surgeries_data: txt }) }}
                          value={this.state.surgeries_data}
                          onFocus={() => { this.setState({ sugeriesfocus: true }) }}
                          onBlur={() => { this.setState({ sugeriesfocus: this.state.surgeries_data.length > 0 ? true : false }) }}
                          keyboardType='default'
                          returnKeyLabel='done'
                          returnKeyType='done'
                        />
                      </View>
                      {this.state.sugeriesfocus == true && <View style={{ position: 'absolute', backgroundColor: 'White', left: windowWidth * 4 / 100, top: -windowWidth * 2.5 / 100, paddingHorizontal: windowWidth * 1 / 100 }}>
                        <Text style={{ color: '#0057A5', textAlign: config.textalign }}>{Lang_chg.textinputsurgeries[config.language]}</Text>
                      </View>} */}
                      </View>
                    )}
                  </View>

                  {/* --------------------------------------------------------------------------------------q6 */}
                  <View style={{ paddingBottom: (windowWidth * 3) / 100 }}>
                    <View
                      style={{
                        width: "100%",
                        backgroundColor: Colors.tab_background_color,
                      }}
                    >
                      <View
                        style={{
                          width: "90%",
                          alignSelf: "center",
                          marginTop: (windowWidth * 2) / 100,
                          paddingBottom: (windowWidth * 3) / 100,
                        }}
                      >
                        <Text
                          style={{
                            color: Colors.allergic_heading_color,
                            fontFamily: Font.allergies_heading_fontfamily,
                            fontSize: Font.allergies_txt_size_edit,
                            textAlign: config.textRotate,
                          }}
                        >
                          {Lang_chg.chronic[config.language]}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        width: "90%",
                        alignSelf: "center",
                        marginTop: (windowWidth * 2) / 100,
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.textgray_que,
                          fontFamily: Font.allergies_heading_fontfamily,
                          fontSize: Font.quessize,
                          textAlign: config.textRotate,
                        }}
                      >
                        {Lang_chg.q6[config.language]}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: "88%",
                        alignSelf: "center",
                        marginTop: (windowWidth * 3) / 100,
                        flexDirection: "row",
                      }}
                    >
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => {
                          this.setchronic_diseases("Yes");
                        }}
                        style={{
                          width: "30%",
                          alignSelf: "center",
                          flexDirection: "row",
                        }}
                      >
                        <View style={{ width: "20%", alignSelf: "center" }}>
                          <View
                            style={{
                              width: (windowWidth * 5) / 100,
                              alignSelf: "center",
                              flexDirection: "row",
                            }}
                          >
                            <Icon
                              name={
                                this.state.chronic_diseases == "Yes"
                                  ? "dot-circle-o"
                                  : "circle-thin"
                              }
                              size={22}
                              color={"#0168B3"}
                            ></Icon>
                          </View>
                        </View>

                        <View style={{ width: "35%", alignSelf: "center" }}>
                          <Text
                            style={{
                              color: Colors.textgray_que,
                              textAlign: "center",
                              alignSelf: "center",
                              fontSize: Font.text_height,
                              fontFamily: Font.allergies_heading_fontfamily,
                            }}
                          >
                            {Lang_chg.yes_txt[config.language]}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          this.setchronic_diseases("No");
                        }}
                        style={{
                          width: "30%",
                          alignSelf: "center",
                          flexDirection: "row",
                        }}
                      >
                        <View style={{ width: "20%", alignSelf: "center" }}>
                          <View
                            style={{
                              width: (windowWidth * 5) / 100,
                              alignSelf: "center",
                              flexDirection: "row",
                            }}
                          >
                            <Icon
                              name={
                                this.state.chronic_diseases == "No"
                                  ? "dot-circle-o"
                                  : "circle-thin"
                              }
                              size={22}
                              color={"#0168B3"}
                            ></Icon>
                          </View>
                        </View>

                        <View style={{ width: "35%", alignSelf: "center" }}>
                          <Text
                            style={{
                              color: Colors.textgray_que,
                              textAlign: "center",
                              fontSize: Font.text_height,
                              fontFamily: Font.allergies_heading_fontfamily,
                              alignSelf: "center",
                            }}
                          >
                            {Lang_chg.no_txt[config.language]}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View style={{ paddingBottom: (windowWidth * 3) / 100 }}>
                      {this.state.chronic_diseases == "Yes" && (
                        <View
                          style={{
                            width: "90%",
                            alignSelf: "center",
                            marginTop: (windowWidth * 5) / 100,
                            // borderColor: this.state.chronicfocus == true ? Colors.placholderactive : Colors.placeholder_border,
                            // borderWidth: 1,
                            // borderRadius: (windowWidth * 1) / 100,
                          }}
                        >
                          <AuthInputBoxSec
                            mainContainer={{
                              width: "100%",
                            }}
                            // icon={layer9_icon}
                            lableText={
                              Lang_chg.textinputchronic[config.language]
                            }
                            inputRef={(ref) => {
                              this.chronic_diseases_dataInput = ref;
                            }}
                            onChangeText={(text) =>
                              this.setState({ chronic_diseases_data: text })
                            }
                            maxLength={50}
                            value={this.state.chronic_diseases_data}
                            keyboardType="default"
                            autoCapitalize="none"
                            returnKeyLabel="done"
                            returnKeyType="done"
                          />

                          {/* <View style={{ width: '95%', alignSelf: 'center', }}>
                          <TextInput
                            style={{
                              width: '100%',
                              color: Colors.Black,
                              fontSize: Font.placeholdersize,
                              textAlign: config.textalign,
                              height: (windowWidth * 12) / 100,
                              fontFamily: Font.placeholderfontfamily,
                              borderRadius: (windowWidth * 1) / 100,

                            }}
                            maxLength={50}
                            placeholder={this.state.chronicfocus != true ? Lang_chg.textinputchronic[config.language] : null}
                            DarkGrey={Colors.DarkGrey}
                            onChangeText={(txt) => { this.setState({ chronic_diseases_data: txt }) }}
                            value={this.state.chronic_diseases_data}
                            onFocus={() => { this.setState({ chronicfocus: true }) }}
                            onBlur={() => { this.setState({ chronicfocus: this.state.chronic_diseases_data.length > 0 ? true : false }) }}
                            keyboardType='default'
                            returnKeyLabel='done'
                            returnKeyType='done'
                          />
                        </View>
                        {this.state.chronicfocus == true && <View style={{ position: 'absolute', backgroundColor: 'White', left: windowWidth * 4 / 100, top: -windowWidth * 2.5 / 100, paddingHorizontal: windowWidth * 1 / 100 }}>
                          <Text style={{ color: '#0057A5', textAlign: config.textalign }}>{Lang_chg.textinputchronic[config.language]}</Text>
                        </View>} */}
                        </View>
                      )}
                    </View>
                  </View>
                  <View
                    style={{
                      paddingBottom: (windowWidth * 5) / 100,
                      backgroundColor: Colors.tab_background_color,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.medical_click();
                      }}
                      style={{
                        width: "90%",
                        alignSelf: "center",
                        borderRadius: (windowWidth * 2) / 100,
                        backgroundColor: Colors.Theme,
                        paddingVertical: (windowWidth * 4) / 100,
                        marginTop: (windowWidth * 8) / 100,
                        shadowColor: "#000",
                        shadowOffset: { width: 1, height: 1 },
                        shadowOpacity: 0.5,
                        shadowRadius: 2,
                        elevation: 3,
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.White,
                          fontFamily: Font.Medium,
                          fontSize: Font.buttontextsize,
                          alignSelf: "flex-end",

                          alignSelf: "center",
                        }}
                      >
                        {Lang_chg.savebtntext[config.language]}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* ----------------------------------------------------------------------lifebtn */}

              {this.state.lbtn == true && (
                <View
                  style={{
                    backgroundColor: Colors.backgroundcolorlight,
                    paddingBottom: (windowWidth * 15) / 100,
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      backgroundColor: Colors.White,
                    }}
                  >
                    <View
                      style={{
                        width: "90%",
                        marginTop: (windowWidth * 3) / 100,
                        alignSelf: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "black",
                          fontFamily: Font.allergies_heading_fontfamily,
                          fontSize: Font.allergies_txt_size_edit,
                          textAlign: config.textRotate,
                        }}
                      >
                        {Lang_chg.smoking[config.language]}
                      </Text>
                    </View>

                    <View style={{ width: "90%", alignSelf: "center" }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            yesNoModal: true,
                            smoking_btn: true,
                          });
                        }}
                        style={{
                          width: "100%",
                          alignSelf: "center",
                          borderColor: "#CCCCCC",
                          borderWidth: 1,
                          backgroundColor: Colors.tab_background_color,
                          borderRadius: (windowWidth * 1) / 100,
                          paddingVertical: (windowWidth * 3.5) / 100,
                          marginTop: (windowWidth * 3) / 100,
                        }}
                      >
                        <View
                          style={{
                            width: "95%",
                            alignSelf: "center",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          {/* <View style={{width: '80%'}}> */}
                          <Text
                            style={{
                              fontSize: (windowWidth * 3.7) / 100,
                              fontFamily: Font.Regular,
                              textAlign: config.textRotate,
                            }}
                          >
                            {this.state.smoking.length <= 0
                              ? Lang_chg.select[config.language]
                              : this.state.smoking}
                          </Text>
                          {/* </View> */}

                          <View style={{ width: "20%", alignSelf: "center" }}>
                            <Image
                              style={{
                                height: (windowWidth * 4) / 100,
                                width: (windowWidth * 4) / 100,
                                alignSelf: "flex-end",
                              }}
                              source={Icons.downarrow}
                            ></Image>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {/* ------------------------------------------------------------------------------------------------------------------------------------- */}

                  <View
                    style={{
                      width: "100%",
                      backgroundColor: Colors.White,
                    }}
                  >
                    <View
                      style={{
                        width: "90%",
                        marginTop: (windowWidth * 3) / 100,
                        alignSelf: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "black",
                          fontFamily: Font.allergies_heading_fontfamily,
                          fontSize: Font.allergies_txt_size_edit,
                          textAlign: config.textRotate,
                        }}
                      >
                        {Lang_chg.Alcohol[config.language]}
                      </Text>
                    </View>

                    <View style={{ width: "90%", alignSelf: "center" }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            yesNoModal: true,
                            smoking_btn: false,
                          });
                        }}
                        style={{
                          width: "100%",
                          alignSelf: "center",
                          borderColor: "#CCCCCC",
                          borderWidth: 1,
                          backgroundColor: Colors.tab_background_color,
                          borderRadius: (windowWidth * 1) / 100,
                          paddingVertical: (windowWidth * 3.5) / 100,
                          marginTop: (windowWidth * 3) / 100,
                        }}
                      >
                        <View
                          style={{
                            width: "95%",
                            alignSelf: "center",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          {/* <View style={{width: '80%'}}> */}
                          <Text style={{ fontSize: (windowWidth * 3.7) / 100 }}>
                            {this.state.alcohol.length <= 0
                              ? Lang_chg.select[config.language]
                              : this.state.alcohol}
                          </Text>
                          {/* </View> */}

                          <View style={{ width: "20%", alignSelf: "center" }}>
                            <Image
                              style={{
                                height: (windowWidth * 4) / 100,
                                width: (windowWidth * 4) / 100,
                                alignSelf: "flex-end",
                              }}
                              source={Icons.downarrow}
                            />
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* --------------------------------------------------------------------------------------------------------------- */}

                  <View
                    style={{
                      width: "100%",
                      backgroundColor: Colors.White,
                    }}
                  >
                    <View
                      style={{
                        width: "90%",
                        marginTop: (windowWidth * 3) / 100,
                        alignSelf: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "black",
                          fontFamily: Font.allergies_heading_fontfamily,
                          fontSize: Font.allergies_txt_size_edit,
                          textAlign: config.textRotate,
                        }}
                      >
                        {Lang_chg.blood[config.language]}
                      </Text>
                    </View>

                    <View style={{ width: "90%", alignSelf: "center" }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            bloodModal: true,
                            // nationality: item.nationality,
                          });
                        }}
                        style={{
                          width: "100%",
                          alignSelf: "center",
                          borderColor: "#CCCCCC",
                          borderWidth: 1,
                          backgroundColor: Colors.tab_background_color,
                          borderRadius: (windowWidth * 1) / 100,
                          paddingVertical: (windowWidth * 3.5) / 100,
                          marginTop: (windowWidth * 3) / 100,
                        }}
                      >
                        <View
                          style={{
                            width: "95%",
                            alignSelf: "center",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          {/* <View style={{width: '80%'}}> */}
                          <Text
                            style={{
                              fontSize: (windowWidth * 3.7) / 100,
                              textAlign: config.textRotate,
                            }}
                          >
                            {this.state.blood_group.length <= 0
                              ? Lang_chg.select[config.language]
                              : this.state.blood_group}
                          </Text>
                          {/* </View> */}

                          <View style={{ width: "20%", alignSelf: "center" }}>
                            <Image
                              style={{
                                height: (windowWidth * 4) / 100,
                                width: (windowWidth * 4) / 100,
                                alignSelf: "flex-end",
                              }}
                              source={Icons.downarrow}
                            ></Image>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {/* ------------------------------------------------------------------------------------------------------------- */}

                  <View
                    style={{
                      width: "100%",
                      backgroundColor: Colors.White,
                    }}
                  >
                    <View
                      style={{
                        width: "90%",
                        marginTop: (windowWidth * 3) / 100,
                        alignSelf: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "black",
                          fontFamily: Font.allergies_heading_fontfamily,
                          fontSize: Font.allergies_txt_size_edit,
                          textAlign: config.textRotate,
                        }}
                      >
                        {Lang_chg.activity[config.language]}
                      </Text>
                    </View>

                    <View style={{ width: "90%", alignSelf: "center" }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            occ_food_activity: "activity",
                            occ_food_activitymodal: true,
                            occ_food_activity_arr: this.state.activity_arr,
                          });
                        }}
                        style={{
                          width: "100%",
                          alignSelf: "center",
                          borderColor: "#CCCCCC",
                          borderWidth: 1,
                          backgroundColor: Colors.tab_background_color,
                          borderRadius: (windowWidth * 1) / 100,
                          paddingVertical: (windowWidth * 3.5) / 100,
                          marginTop: (windowWidth * 3) / 100,
                        }}
                      >
                        <View
                          style={{
                            width: "95%",
                            alignSelf: "center",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          {/* <View style={{width: '80%'}}> */}
                          <Text
                            style={{
                              fontSize: (windowWidth * 3.7) / 100,
                              textAlign: config.textRotate,
                            }}
                          >
                            {this.state.activity_level.length <= 0
                              ? Lang_chg.select[config.language]
                              : this.state.activity_level}
                          </Text>
                          {/* </View> */}

                          <View style={{ width: "20%", alignSelf: "center" }}>
                            <Image
                              style={{
                                height: (windowWidth * 4) / 100,
                                width: (windowWidth * 4) / 100,
                                alignSelf: "flex-end",
                              }}
                              source={Icons.downarrow}
                            ></Image>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {/* -------------------------------------------------------------------------------------------------- */}

                  <View
                    style={{
                      width: "100%",
                      backgroundColor: Colors.White,
                    }}
                  >
                    <View
                      style={{
                        width: "90%",
                        marginTop: (windowWidth * 3) / 100,
                        alignSelf: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "black",
                          fontFamily: Font.allergies_heading_fontfamily,
                          fontSize: Font.allergies_txt_size_edit,
                          textAlign: config.textRotate,
                        }}
                      >
                        {Lang_chg.food[config.language]}
                      </Text>
                    </View>

                    <View style={{ width: "90%", alignSelf: "center" }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            occ_food_activity: "food",
                            occ_food_activitymodal: true,
                            occ_food_activity_arr: this.state.food_arr,
                          });
                        }}
                        style={{
                          width: "100%",
                          alignSelf: "center",
                          borderColor: "#CCCCCC",
                          borderWidth: 1,
                          backgroundColor: Colors.tab_background_color,
                          borderRadius: (windowWidth * 1) / 100,
                          paddingVertical: (windowWidth * 3.5) / 100,
                          marginTop: (windowWidth * 3) / 100,
                        }}
                      >
                        <View
                          style={{
                            width: "95%",
                            alignSelf: "center",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          {/* <View style={{width: '80%'}}> */}
                          <Text
                            style={{
                              fontSize: (windowWidth * 3.7) / 100,
                              textAlign: config.textRotate,
                            }}
                          >
                            {this.state.food.length <= 0
                              ? Lang_chg.select[config.language]
                              : this.state.food}
                          </Text>
                          {/* </View> */}

                          <View style={{ width: "20%", alignSelf: "center" }}>
                            <Image
                              style={{
                                height: (windowWidth * 4) / 100,
                                width: (windowWidth * 4) / 100,
                                alignSelf: "flex-end",
                              }}
                              source={Icons.downarrow}
                            ></Image>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* ----------------------------------------------------------------------------------------------------- */}
                  <View
                    style={{
                      width: "100%",
                      backgroundColor: Colors.White,
                    }}
                  >
                    <View
                      style={{
                        width: "90%",
                        marginTop: (windowWidth * 3) / 100,
                        alignSelf: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "black",
                          fontFamily: Font.allergies_heading_fontfamily,
                          fontSize: Font.allergies_txt_size_edit,
                          textAlign: config.textRotate,
                        }}
                      >
                        {Lang_chg.occupation[config.language]}
                      </Text>
                    </View>

                    <View style={{ width: "90%", alignSelf: "center" }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            occ_food_activity: "occupation",
                            occ_food_activitymodal: true,
                            occ_food_activity_arr: this.state.occupation_arr,
                          });
                        }}
                        style={{
                          width: "100%",
                          alignSelf: "center",
                          borderColor: "#CCCCCC",
                          borderWidth: 1,
                          backgroundColor: Colors.tab_background_color,
                          borderRadius: (windowWidth * 1) / 100,
                          paddingVertical: (windowWidth * 3.5) / 100,
                          marginTop: (windowWidth * 3) / 100,
                        }}
                      >
                        <View
                          style={{
                            width: "95%",
                            alignSelf: "center",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          {/* <View style={{width: '80%'}}> */}
                          <Text
                            style={{
                              fontSize: (windowWidth * 3.7) / 100,
                              textAlign: config.textRotate,
                            }}
                          >
                            {this.state.occupation.length <= 0
                              ? Lang_chg.select[config.language]
                              : this.state.occupation}
                          </Text>
                          {/* </View> */}

                          <View style={{ width: "20%", alignSelf: "center" }}>
                            <Image
                              style={{
                                height: (windowWidth * 4) / 100,
                                width: (windowWidth * 4) / 100,
                                alignSelf: "flex-end",
                              }}
                              source={Icons.downarrow}
                            ></Image>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View style={{ paddingBottom: (windowWidth * 5) / 100 }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.lifestyle_click();
                        }}
                        style={{
                          width: "90%",
                          alignSelf: "center",
                          borderRadius: (windowWidth * 2) / 100,
                          backgroundColor: Colors.Theme,
                          paddingVertical: (windowWidth * 4) / 100,
                          marginTop: (windowWidth * 8) / 100,
                          shadowColor: "#000",
                          shadowOffset: { width: 1, height: 1 },
                          shadowOpacity: 0.5,
                          shadowRadius: 2,
                          elevation: 3,
                        }}
                      >
                        <Text
                          style={{
                            color: Colors.White,
                            fontFamily: Font.allergies_heading_fontfamily,
                            fontSize: Font.allergies_txt_size_edit,
                            alignSelf: "flex-end",
                            textAlign: config.textalign,
                            alignSelf: "center",
                          }}
                        >
                          {Lang_chg.savebtntext[config.language]}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </KeyboardAwareScrollView>
          </ScrollView>
        </View>
      </View>
    );
  }
}
