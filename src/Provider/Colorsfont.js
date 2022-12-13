import { Dimensions } from "react-native";
import { s, vs, ms, mvs } from 'react-native-size-matters'
const windowWidth = Dimensions.get("window").width;

export const Colors = {


  optboxcolor: "#F1F2F4",
  discountBox: "#D1ECC8",
  precautionText: "#041A27",
  placholderactive: "#0057A5",
  white2: "#f8f8f8",

  gainsboro: "#e5e5e5",

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
  textGreenColor: "#26720B",


  bordercolor_light_blue: "lightblue",
  tab_background_color: "#F1F2F4",
  allergic_heading_color: "black",
  // yesnobtn_color:'gray',
  ques_color: "red",
  field_border_color: "#CCCCCC",
  bordercolor_light_blue: "lightblue",
  //-------------------------------04/03 gunjan
  textgray_que: "#354052",
  textGender: "#63666b",

  // ----------------------------Ahsan
  backgroundcolor: "#f1f2f4",
  Theme:'#0168B3',
  Primary:'#38ABEC',
  Blue:'#0888D1',
  lightBlue:'#C5EAFF',
  Green:'#4FB82A',
  inActiveTab: '#505B6E',
  tabBackground: '#E5F6FF',
  DarkGrey:'#515C6F',
  MediumGrey:'#6E7786',
  lightGrey:'#8F98A7',
  dullGrey:'#6D737E',
  Border:'#DFDFDF',
  Highlight:'#E2E7EE82',
  Black: "#000000",
  White:'#ffffff',
  orange: "#FFA800",
  inActiveText:'#0C1016',
  ButtonBorder:'#E2EBF0',
  darkText:'#17181A',
  detailTitles:'#354052',
  tabsBackground:'#F1F2F4'


};
export const Font = {
  Medium: "Rubik-Medium",
  MediumItalic: "Rubik-MediumItalic",
  Italic: "Rubik-Italic",
  ItalicBlack: "Rubik-BlackItalic",
  BoldItalic: "Rubik-BoldItalic",
  LightItalic: "Rubik-LightItalic",
  Bold: "Rubik-Bold",
  Regular: "Rubik-Regular",
  Light: "Rubik-Light",
  Black: "Rubik-Black",
  ExtraBold: "Rubik-ExtraBold",
  SemiBold: "Rubik-SemiBold",
  SemiBoldItalic: "Rubik-SemiBoldItalic",

  // ----------------------Font Sizes-----------------

  xsmall: s(9),  //----10
  small: s(11),  //----12
  medium: s(13),  //----14
  large: s(14),  //----15
  xlarge: s(15),  //----16
  xxlarge: s(17),  //----18
  xxxlarge: s(19),  //----20


  headingfont: (windowWidth * 4.5) / 100,
  headingfont_booking: (windowWidth * 4.2) / 100,
  smallheadingfont: (windowWidth * 4.2) / 100,
  regulartext_size: (windowWidth * 3.8) / 100,
  buttontextsize: (windowWidth * 3.5) / 100,

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
