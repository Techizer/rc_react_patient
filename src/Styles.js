import { StyleSheet } from "react-native";
import {
  Colors,
  Font,
  mobileH,
  Mapprovider,
  msgProvider,
  msgText,
  config,
  mobileW,
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
    backgroundColor: "#fff",
  },
  container2: {
    flex: 1,
    backgroundColor: "#f1f2f4",
    // paddingBottom: (mobileW * 90) / 100,
  },
  container3: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container4: {
    flex: 1,
    backgroundColor: "#f1f2f4",
    // paddinsssgBottom: (mobileW * 30) / 100,
  },
  containerbody: {
    // flex: 1,
    backgroundColor: "#fff",
    width: "100%",
    alignSelf: "center",
    paddingLeft: (mobileW * 5) / 100,
  },
  headertext: {
    // color: Colors.whiteColor,
    textAlign: "center",
    fontFamily: Font.fontmedium,
    fontSize: (mobileW * 4) / 100,
  },
  headingtext: {
    // color: Colors.whiteColor,
    textAlign: config.textalign,
    fontFamily: Font.fontmedium,
    fontSize: (mobileW * 3.7) / 100,
  },
  cardtitle: {
    textAlign: config.textalign,
    fontFamily: Font.fontmedium,
    fontSize: (mobileW * 3.3) / 100,
  },
  details: {
    textAlign: config.textalign,
    fontSize: (mobileW * 2.7) / 100,
    fontFamily: Font.fontregular,
    color: Colors.placeholder_text,
    lineHeight: (mobileW * 3.9) / 100,
    paddingTop: (mobileW * 1) / 100,
  },

  ///drawer style
  drawercardicon: {
    //  alignSelf: 'center',
    resizeMode: "contain",
    width: (mobileW * 6.5) / 100,
    height: (mobileW * 6.5) / 100,
    marginTop: (mobileW * 1) / 100,
    alignSelf: "center",
    // marginHorizontal: (mobileW * 15) / 100,
  },
  placeholder_style: {
    width: "100%",
    color: Colors.textblack,
    fontSize: Font.placeholdersize,
    textAlign: config.textRotate,
    height: (mobileW * 12) / 100,
    fontFamily: Font.placeholderfontfamily,
    paddingLeft: (mobileW * 2.5) / 100,
    borderRadius: (mobileW * 1) / 100,
  },
});
