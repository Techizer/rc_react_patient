import { Platform } from "react-native";
import base64 from "react-native-base64";


class configProvider {
 
  // Testing url
  // baseURL = "https://teq-dev-var19.co.in/rootscare/";
  // img_url = "http://teq-dev-var19.co.in/rootscare/images/200X200/";
  // img_url1 = "http://teq-dev-var19.co.in/rootscare/images/400X400/";
  // img_url2 = "http://teq-dev-var19.co.in/rootscare/images/700X700/";
  // img_url3 = "https://teq-dev-var19.co.in/rootscare/uploads/images/";

  
  // Development url
  // baseURL = "https://production.rootscare.net/application/";
  // img_url = "https://production.rootscare.net/application/uploads/images/200X200/";
  // img_url1 = "https://production.rootscare.net/application/uploads/images/400X400/";
  // img_url2 = "https://production.rootscare.net/application/uploads/images/700X700/";
  // img_url3 = "https://production.rootscare.net/application/uploads/images/";

  // live url
  baseURL = "https://rootscare.net/application/";
  img_url = "https://rootscare.net/application/uploads/images/200X200/";
  img_url1 = "https://rootscare.net/application/uploads/images/400X400/";
  img_url2 = "https://rootscare.net/application/uploads/images/700X700/";
  img_url3 = "https://rootscare.net/application/uploads/images/";

  term_url_eng = "https://rootscare.net/application/terms-and-conditions/eng";
  term_url_ar = "https://rootscare.net/application/terms-and-conditions/ar";
  privacy_url_eng = "https://rootscare.net/application/privacy-policy/eng";
  privacy_url_ar = "https://rootscare.net/application/privacy-policy/ar";
  about_url_eng = "https://rootscare.net/application/about-us/eng";
  about_url_ar = "https://rootscare.net/application/about-us/ar";

  mapkey = "AIzaSyDy01zIxPpweSuXDx9Bs4g0GZR9ygB46Zw";

  maplanguage = "en";
  countrycode = "966 ";

  
}
//--------------------------- Config Provider End -----------------------

export const config = new configProvider();
