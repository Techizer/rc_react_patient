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
    // flex:1,
    // flexWrap:'wrap'
  },
});
