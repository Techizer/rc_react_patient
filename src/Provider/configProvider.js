import { Platform } from "react-native";
import base64 from "react-native-base64";
import { msgProvider, localStorage } from "./utilslib/Utils";
// import {
//     GoogleSignin,
//    } from 'react-native-google-signin';

global.player_id_me1 = "123456";
// global.fcmtoken='123456';
//--------------------------- Config Provider Start -----------------------
class configProvider {
  // aws production url
  // baseURL = "https://production.rootscare.net/";
  // img_url = "https://production.rootscare.net/images/200X200/";
  // img_url1 = "https://production.rootscare.net/images/400X400/";
  // img_url2 = "https://production.rootscare.net/images/700X700/";
  // img_url3 = "https://production.rootscare.net/uploads/images/";

  // production url
  baseURL = "https://teq-dev-var19.co.in/rootscare/";
  img_url = "http://teq-dev-var19.co.in/rootscare/images/200X200/";
  img_url1 = "http://teq-dev-var19.co.in/rootscare/images/400X400/";
  img_url2 = "http://teq-dev-var19.co.in/rootscare/images/700X700/";
  img_url3 = "https://teq-dev-var19.co.in/rootscare/uploads/images/";

  // live url
  // baseURL = "https://rootscare.net/application/";
  // img_url = "https://rootscare.net/application/uploads/images/200X200/";
  // img_url1 = "https://rootscare.net/application/uploads/images/400X400/";
  // img_url2 = "https://rootscare.net/application/uploads/images/700X700/";
  // img_url3 = "https://rootscare.net/application/uploads/images/";

  term_url_eng = "https://rootscare.net/application/terms-and-conditions/eng";
  term_url_ar = "https://rootscare.net/application/terms-and-conditions/ar";
  privacy_url_eng = "https://rootscare.net/application/privacy-policy/eng";
  privacy_url_ar = "https://rootscare.net/application/privacy-policy/ar";
  about_url_eng = "https://rootscare.net/application/about-us/eng";
  about_url_ar = "https://rootscare.net/application/about-us/ar";

  login_type = "0";
  onesignalappid = "c0b75db1-bad7-4195-9e2a-3c199f296c37";
  mapkey = "AIzaSyDy01zIxPpweSuXDx9Bs4g0GZR9ygB46Zw"; //'AIzaSyDkMuwTf82XUx9wlmS32rcTj2718Aa81bY';

  maplanguage = "en";
  language = 0;
  player_id = "123456";

  countrycode = "966 ";
  player_id_me = "123456";
  fcmtoken_me = "123456";
  device_type = Platform.OS;
  loading_type = false;
  // latitude 	    = 53.4773206;
  // longitude 	    = -2.249042;
  textalign = "left";
  textRotate = "left";
  latitude = 55.9550298;
  longitude = -3.1889288;

  address = "";
  login = 0;

  headersapi = {
    Authorization:
      "Basic " +
      base64.encode(base64.encode("mario") + ":" + base64.encode("carbonell")),
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
    "Cache-Control": "no-cache,no-store,must-revalidate",
    Pragma: "no-cache",
    Expires: 0,
  };

  GetPlayeridfunctin = (player_id) => {
    console.log(player_id, "player_id");
    player_id_me1 = player_id;
  };

  checkUserDeactivate = async (navigation) => {
    msgProvider.showError("Your account has been deactivated by admin");
    setTimeout(() => {
      this.AppLogout(navigation);
    }, 200);
    return false;
  };
  AppLogout = async (navigation) => {
    console.log("AppLogout");
    //----------------------- if get user login type -------------
    var userdata = await localStorage.getItemObject("user_arr");
    var password = await localStorage.getItemString("password");
    var email = await localStorage.getItemString("email");
    var rememberme = await localStorage.getItemString("rememberme");
    var language = await localStorage.getItemString("language");
    console.log(password);
    console.log(email);
    console.log(rememberme);
    console.log(language);
    config.login = 0;
    if (userdata != null) {
      if (userdata.login_type == 0) {
        localStorage.clear();
        if (rememberme == "yes") {
          localStorage.setItemString("password", password);
          localStorage.setItemString("email", email);
          localStorage.setItemString("rememberme", rememberme);
          // /	localStorage.setItemString('language',JSON.stringify(language));
        } else {
          localStorage.setItemString("password", password);
          localStorage.setItemString("email", email);
          localStorage.setItemString("language", JSON.stringify(language));
        }

        navigation.navigate("Login");
      } else if (userdata.login_type == 1) {
        console.log("face boook login");
        LoginManager.logOut();
        localStorage.clear();
        navigation.navigate("Login");
      } else if (userdata.login_type == 2) {
        console.log("google login");
        try {
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
        } catch (error) {
          alert(error);
        }
        localStorage.clear();
        navigation.navigate("Login");
      } else if (userdata.login_type == 5) {
        console.log("face boook login");
      }
    } else {
      console.log("user arr not found");
    }
  };
}
//--------------------------- Config Provider End -----------------------

export const config = new configProvider();
