import { Component } from "react";
import { Alert } from "react-native";
import { CommonActions } from "@react-navigation/native";
//import { appleAuth,AppleButton } from '@invertase/react-native-apple-authentication';
import {
  msgProvider,
  msgText,
  msgTitle,
  config,
  localStorage,
  apifuntion,
} from "../utilslib/Utils";
// import {GoogleSignin,statusCodes,} from 'react-native-google-signin';
// import { LoginManager , AccessToken,GraphRequest, GraphRequestManager,} from 'react-native-fbsdk'
global.navigatefunction = "";
var user_typefunc = "";

class SocialLoginProvider extends Component {
  constructor(props) {
    super(props);
    GoogleSignin.configure({
      webClientId:
        "897378735052-e9t592j7oaj6s79f4dutbfv549sp8cfs.apps.googleusercontent.com",
    });
  }

  goHomePage = (navigation) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: "Home" }],
      })
    );
  };

  Socialfunction = (navigation, btn, user_type, type) => {
    console.log("usertype", user_type);
    if (type == "normal") {
      var social_type = btn;
      var login_type = btn;
      var social_id = "001942.7f1a8d2b59354833977cc59e439459a3.0507";
      var social_name = "UploadingApp";
      var social_first_name = "UploadingApp";
      var social_middle_name = "";
      var social_last_name = "YoungDecade";
      var social_email = "uploadingapp.youngdecade@gmail.com";
      // var social_image_url = 'img/no_image_found.png';
      var social_image_url =
        "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200";
      var result = {
        social_id: social_id,
        social_type: social_type,
        login_type: login_type,
        social_name: social_name,
        social_first_name: social_first_name,
        social_last_name: social_last_name,
        social_middle_name: social_middle_name,
        social_email: social_email,
        social_image: social_image_url,
      };
      this.callsocailweb(result, navigation, user_type);
    } else {
      if (btn == "1") {
        this.FacebookLogin(navigation, user_type);
      } else if (btn == "2") {
        this.GoogleLogin(navigation, user_type);
      } else if (btn == "apple") {
        this.Applelogin(navigation, user_type);
      }
    }
  };
  socaillogout = async (type, navigation) => {
    if (type == "1") {
      LoginManager.logOut();
      localStorage.clear();
      navigation.navigate("Login");
    } else if (type == "2") {
      try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      } catch (error) {
        console.log("errorr");
      }
      localStorage.clear();
      navigation.navigate("Login");
    }
  };
  FacebookLogin = async (navigation, user_type) => {
    navigatefunction = navigation;
    user_typefunc = user_type;
    LoginManager.logInWithPermissions(["public_profile", "email"]).then(
      (result) => {
        if (result.isCancelled) {
          console.log("Login cancelled");
          // alert('login cancel')
        } else {
          AccessToken.getCurrentAccessToken().then((data) => {
            const processRequest = new GraphRequest(
              "/me?fields=id,name,email,first_name,middle_name,last_name,picture.type(large)",
              null,
              this.get_Response_Info
            );
            console.log("sdafdsfsdf", processRequest);
            new GraphRequestManager().addRequest(processRequest).start();
          });
        }
      }
    );
  };
  get_Response_Info = (error, result) => {
    if (error) {
      Alert.alert("Error fetching data: " + error.toString());
    } else {
      console.log("aa gya kya bhai", result);
      var socaildata = {
        social_id: result.id,
        social_name: result.name,
        social_first_name: result.first_name,
        social_last_name: result.last_name,
        social_middle_name: "",
        social_email: result.email,
        social_image: result.picture.data.url,
        social_type: "facebook",
        logintype: "1",
      };
      this.callsocailweb(socaildata, navigatefunction, user_typefunc);
    }
  };

  GoogleLogin = async (navigation, user_type) => {
    //Prompts a modal to let the user sign in into your application.
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      console.log("User Info --> ", userInfo);
      var result = {
        social_name: userInfo.user.name,
        social_first_name: userInfo.user.givenName,
        social_last_name: userInfo.user.familyName,
        social_email: userInfo.user.email,
        social_image: userInfo.user.photo,
        social_type: "google",
        logintype: "2",
        social_id: userInfo.user.id,
      };
      this.callsocailweb(result, navigation, user_type);
    } catch (error) {
      // alert('Message'+error.message)
      console.log("Message", error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User Cancelled the Login Flow");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Signing In");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Play Services Not Available or Outdated");
      } else {
        console.log("Some Other Error Happened");
      }
    }
  };
  Applelogin = async (navigation, user_type) => {
    await appleAuth
      .performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      })
      .then(
        (res) => {
          var result = {
            social_name: res.fullName.familyName,
            social_first_name: res.fullName.givenName,
            social_last_name: res.fullName.familyName,
            social_email: res.email,
            social_image: "NA",
            social_type: "apple",
            logintype: "apple",
            social_id: userInfo.user,
          };
          this.callsocailweb(result, navigation);
        },
        (error) => {
          console.log(error);
        }
      );

    // TODO: Send the token to backend
  };
  callsocailweb = (result, navigation, user_type) => {
    console.log("result", result);
    console.log("result", navigation);
    var data = new FormData();
    data.append("social_email", result.social_email);
    data.append("social_id", result.social_id);
    data.append("device_type", config.device_type);
    data.append("player_id", player_id_me1);
    data.append("social_type", result.social_type);
    localStorage.setItemObject("socialdata", result);
    var url = config.baseURL + "social_login.php";
    console.log("home", data);
    console.log("url", url);

    apifuntion
      .postApi(url, data)
      .then((obj) => {
        console.log(obj, "sociladataaadad");
        if (obj.success == "true") {
          //  if(obj.user_exist=='yes'){
          if (obj.user_details.user_type == 1) {
            localStorage.setItemObject("user_arr", obj.user_details);
            localStorage.setItemObject("user_login", "yes");
            var user_details = obj.user_details;

            var user_roles = user_details.user_role;
            var signup_step = user_details.signup_step;
            var aprove_flag = user_details.approve_flag;

            let login_ype = user_details.login_type;
            config.login_type = login_ype;
            console.log("user_roles", config.login_type);
            if (user_roles == 0) {
              config.login = 1;
            } else if (user_roles == 1 && aprove_flag == 1) {
              config.login = 2;
            } else if (user_roles == 1 && aprove_flag == 0) {
              config.login = 1;
            }
            if (user_roles == 1 && signup_step == 1) {
              navigation.navigate("Personal_detail");
            } else if (user_roles == 1 && signup_step == 2) {
              navigation.navigate("Select_service");
            } else if (user_roles == 1 && signup_step == 3) {
              navigation.navigate("Your_work_photos");
            } else {
              navigation.navigate("Home");
            }
          } else {
            navigation.navigate("Signup");
            // navigation.push('Signup',)
          }
        } else {
          if (
            obj.msg[config.language] == msgTitle.deactivate[config.language] ||
            obj.msg[config.language] == msgTitle.usernotexit[0]
          ) {
            this.socaillogout(result.social_type, navigation);
          }
          msgProvider.alert(
            msgTitle.information[config.language],
            obj.msg[config.language],
            false
          );
        }
      })
      .catch((error) => {
        console.log("-------- error ------- " + error);
        msgProvider.alert(
          msgTitle.server[config.language],
          msgText.servermessage[config.language],
          false
        );
        this.setState({ loading: false });
      });
  };
}

export const SocialLogin = new SocialLoginProvider();
