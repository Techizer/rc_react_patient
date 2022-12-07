import { StyleSheet } from "react-native";
import { vs } from "react-native-size-matters";
import {
  Colors,
  Font,
  windowHeight,
  Mapprovider,
  msgProvider,
  msgText,
  config,
  windowWidth,
  localStorage,
  consolepro,
  handleback,
  Lang_chg,
  apifuntion,
  msgTitle,
} from "./Provider/utilslib/Utils";

export default Styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  container2: {
    flex: 1,
    backgroundColor: "#f1f2f4",
    // paddingBottom: (windowWidth * 90) / 100,
  },
  container3: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container4: {
    flex: 1,
    backgroundColor: "#f1f2f4",
    // paddinsssgBottom: (windowWidth * 30) / 100,
  },
  containerbody: {
    // flex: 1,
    backgroundColor: "#fff",
    width: "100%",
    alignSelf: "center",
    paddingLeft: (windowWidth * 5) / 100,
  },
  headertext: {
    // color: Colors.whiteColor,
    textAlign: "center",
    fontFamily: Font.Medium,
    fontSize: (windowWidth * 4) / 100,
  },
  headingtext: {
    // color: Colors.whiteColor,
    textAlign: config.textalign,
    fontFamily: Font.Medium,
    fontSize: (windowWidth * 3.7) / 100,
  },
  cardtitle: {
    textAlign: config.textalign,
    fontFamily: Font.Medium,
    fontSize: Font.medium,
    color: Colors.Black,
  },
  details: {
    textAlign: config.textalign,
    fontSize: Font.small,
    fontFamily: Font.Regular,
    color: Colors.Black,
    lineHeight: (windowWidth * 3.9) / 100,
    marginTop: vs(7),
  },
  subDetails: {
    textAlign: config.textalign,
    fontSize: Font.xsmall,
    fontFamily: Font.Regular,
    
  },

  ///drawer style
  drawercardicon: {
    //  alignSelf: 'center',
    resizeMode: "contain",
    width: (windowWidth * 6.5) / 100,
    height: (windowWidth * 6.5) / 100,
    marginTop: (windowWidth * 1) / 100,
    alignSelf: "center",
    // marginHorizontal: (windowWidth * 15) / 100,
  },
  placeholder_style: {
    width: "100%",
    color: Colors.Black,
    fontSize: Font.placeholdersize,
    textAlign: config.textRotate,
    height: (windowWidth * 12) / 100,
    fontFamily: Font.placeholderfontfamily,
    paddingLeft: (windowWidth * 2.5) / 100,
    borderRadius: (windowWidth * 1) / 100,
  },
});
