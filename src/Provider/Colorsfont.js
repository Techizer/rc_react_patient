import { Dimensions } from "react-native";
import { s, vs, ms, mvs } from 'react-native-size-matters'
const windowWidth = Dimensions.get("window").width;

export const Colors = {


  gainsboro: "#e5e5e5",

  appointmentdetaillightblue: "#e9f7ff",
  appointmentdetaillightgray: "#f5f5f5",

  backgroundcolorblue: "#0057A5",
  textGreenColor: "#26720B",


  tab_background_color: "#F1F2F4",

  // ----------------------------Ahsan
  LightBlack:'rgba(0,0,0,0.8)',
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
  orange: "#ffa800",
  inActiveText:'#0C1016',
  ButtonBorder:'#E2EBF0',
  darkText:'#17181A',
  detailTitles:'#354052',
  tabsBackground:'#F1F2F4',
  Yellow:'#FFA800',
  Red:'#FF0000',
  precautionText: "#041A27",


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

  xsmall:  (windowWidth*2.67)/100,  //----10
  small: (windowWidth*3.2)/100,  //----12
  medium: (windowWidth*3.7)/100,  //----14
  large: s(14),  //----15
  xlarge: (windowWidth*4.2)/100,  //----16
  xxlarge: (windowWidth*4.7)/100,  //----18
  xxxlarge: (windowWidth*5)/100,  //----20
};
