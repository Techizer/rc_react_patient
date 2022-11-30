import { Dimensions } from "react-native";
import { s, vs, ms, mvs } from 'react-native-size-matters'
const windowWidth = Dimensions.get("window").width;

export const Colors = {
  internettextcolor: "#FFFFFF",
  onlinetextcolor: "#fff",
  mediabackground: "#FFFFFF",
  mediatextcolor: "black",
  cancletextcolor: "black",
  headingtextboldcolor: "black",

  textwhite: "white",
  textblack: "black",

  textblue: "#0888D1",
  buttoncolorhgreen: "#4FB82A",
  DarkGrey: "#979ea9",
  placeholder_border: "#707070",
  optboxcolor: "#F1F2F4",
  discountBox: "#D1ECC8",
  precautionText: "#041A27",

  //26-02

  mediabackground: "#FFFFFF",
  mediatextcolor: "black",
  cancletextcolor: "black",
  lightGrey: "#9EA6B2",
  headingtextboldcolor: "black",
  textwhite: "white",
  lightGrey: "gray",
  textblue: "#0888D1",
  Theme2: "#0888d1",
  buttoncolorhgreen: "#4FB82A",

  buttoncolorlight: "#F1F2F4",
  bordercolorblue: "#0888D1",
  placholderactive: "#0057A5",
  optboxcolor: "#0000001F",
  whitebackgroundcolor: "white",

  txt_light: "#D0CECE",
  // -------------------------r---------
  // txt_light: "#D0CECE",
  ligh_background: "#bcbcbc",
  white: "#ffffff",
  white2: "#f8f8f8",

  blue2: "#d1e9f6",

  //28 radhekrishan
  lightgraytext: "#354052",
  gray4: "#7d8490",
  gray5: "#e7e7e7",
  gray6: "#e9e9e9",
  gainsboro: "#e5e5e5",
  backgroundcolor: "#f1f2f4",
  orange: "#FFA800",

  //01-03 radhekrishan
  drawerblue: "#57A7DB",
  drawertextblue: "#7dbfe6",
  lbluebtn: "#84cbff",
  gold: "#f9d800",
  arrowcolor: "#7dbfe6",
  searchPlaceholder: "#9baac4",
  //03-03 radhekrsiha
  cardlighgray: "#677181",
  //04-03 radhekrsiha
  appointmentdetaillightblue: "#e9f7ff",
  appointmentdetaillightgray: "#f5f5f5",

  //28 gunja
  backgroundcolorblue: "#0057A5",
  buttonbackgoungcolorlightblue: "#C5EAFF",
  textGreenColor: "#26720B",

  //----------------------------------------------gunajn(02-03-22)

  bordercolor_light_blue: "lightblue",
  tab_background_color: "#F1F2F4",
  allergic_heading_color: "black",
  // yesnobtn_color:'gray',
  ques_color: "red",
  field_border_color: "#CCCCCC",
  textblue: "#0888D1",
  bordercolor_light_blue: "lightblue",
  //-------------------------------04/03 gunjan
  textgray_que: "#354052",
  textGender: "#63666b",

  // ----------------------------Ahsan
  Theme:'#0168B3',
  Primary:'#38ABEC',
  inActiveTab: '#505B6E',
  tabBackground: '#E5F6FF',
  DarkGrey:'#515C6F',
  MediumGrey:'#6E7786',
  lightGrey:'#8F98A7',
  dullGrey:'#6D737E',
  Border:'#DFDFDF',
  Highlight:'#E2E7EE82',
  Black: "black",
  inActiveText:'#0C1016',
  ButtonBorder:'#E2EBF0'


};
export const Font = {
  fontmedium: "Rubik-Medium",
  fontMediumItalic: "Rubik-MediumItalic",
  fontitalic: "Rubik-Italic",
  fontitaclicblack: "Rubik-BlackItalic",
  fontbolditalic: "Rubik-BoldItalic",
  fontlightitalic: "Rubik-LightItalic",
  fontbold: "Rubik-Bold",
  fontregular: "Rubik-Regular",
  fontthin: "Rubik-Light",
  fontlight: "Rubik-Light",
  fontblack: "Rubik-Black",
  fontextrabold: "Rubik-ExtraBold",
  fontsemibold: "Rubik-SemiBold",
  headerfamily: "Rubik-SemiBold",
  fontSemiBoldItalic: "Rubik-SemiBoldItalic",
  placeholderstyle: "Rubik-Medium",
  button_font: "Rubik-SemiBold",

  // ----------------------Font Sizes-----------------

  xsmall: s(9),  //----10
  small: s(11),  //----12
  medium: s(13),  //----14
  large: s(14),  //----15
  xlarge: s(15),  //----16
  xxlarge: s(19),  //----20


  headerfont: (windowWidth * 5) / 100,
  headingfont: (windowWidth * 4.5) / 100,
  headingfont_booking: (windowWidth * 4.2) / 100,
  headingfont2: (windowWidth * 6) / 100,
  smallheadingfont: (windowWidth * 4.2) / 100,
  serachplaceholdersize: (windowWidth * 4) / 100,

  search_size: (windowWidth * 4) / 100,

  regulartext_size: (windowWidth * 3.8) / 100,
  fontsizetermcondition: (windowWidth * 2.7) / 100,
  headerpeding: (windowWidth * 2) / 100,

  buttontextsize: (windowWidth * 3.5) / 100,

  //28-02
  sregulartext_size: (windowWidth * 3) / 100,

  // 03-01-2022------------------//
  blackheadingfontfamily: "Rubik-Medium",
  headingblack: (windowWidth * 5.7) / 100,

  headinggray: (windowWidth * 3.5) / 100,
  headingfontfamily: "Rubik-Regular",

  placeholdersize: (windowWidth * 3.5) / 100,
  placeholderfontfamily: "Rubik-Light",
  DarkGrey: "black",

  terms_text_font_family: "Rubik-SemiBold",

  buttontext_size: (windowWidth * 3.8) / 100,
  buttonfontfamily: "Rubik-Medium",
  Remember: (windowWidth * 3.5) / 100,
  Forgot: (windowWidth * 3.5) / 100,

  textsize: (windowWidth * 2.8) / 100,
  //----------------------------------------------gunajn(02-03-22)

  tabtextsize: (windowWidth * 4) / 100,
  allergies_txt_size_edit: (windowWidth * 4) / 100,
  allergies_heading_fontfamily: "Rubik-Regular",
  allergies_heading_size: (windowWidth * 3.5) / 100,

  quessize: (windowWidth * 3.5) / 100,
  headingblack_txt_size_edit: (windowWidth * 4) / 100,
  ques_fontfamily: "Rubik-Regular",

  //2march radhekrishan
  ssregulartext_size: (windowWidth * 3.3) / 100,

  //3march radhekrishan
  //nurse flatlist
  name: (windowWidth * 3.5) / 100,
  subtext: (windowWidth * 3.4) / 100,
  ssubtext: (windowWidth * 3.2) / 100,

  //nurse details
  name: (windowWidth * 3.5) / 100,
  //modal
  modalheading: (windowWidth * 4.3) / 100,

  //4march radhekrishan
  appointmentbtn: (windowWidth * 3) / 100,
  appointmentdetailname: (windowWidth * 3.7) / 100,

  //cart2
  cart2heading: (windowWidth * 4.1) / 100,
  cart2subtext: (windowWidth * 3.5) / 100,
  cart2ssubtext: (windowWidth * 3.2) / 100,
  text_height: (windowWidth * 2.5) / 100,

  placeholder_height: (windowWidth * 12) / 100,
};
