import React, { useEffect } from "react";
import { StyleSheet, Text, Image, TouchableOpacity } from "react-native";
// import Spinner from "react-native-spinkit";
// import { Colors } from "react-native/Libraries/NewAppScreen";
// import { color } from "react-native-reanimated";
// import { Color, Fonts } from "../utils";
// import { RF } from "../utils/responsive";
import { Colors, localimag, Font, mobileH, config, mobileW, Lang_chg, apifuntion, msgText, msgTitle, consolepro, msgProvider, localStorage } from '../Provider/utilslib/Utils';
const Button = ({
  text,
  customStyles,
  onPress,
  image,
  onLoading,
  isSingle,
  isBlank,
}) => {
  return (
    <>

      {
        (isBlank != undefined && isBlank === true) ?
          <TouchableOpacity
            onPress={onPress}
            style={[styles.mainContainer1, customStyles.mainContainer]}>
            <Text style={[styles.buttonText1, customStyles.buttonText]}>
              {text}
            </Text>
          </TouchableOpacity>
          :
          <TouchableOpacity
            onPress={onPress}
            style={[styles.mainContainer, customStyles.mainContainer]}>
            <Text style={[styles.buttonText, customStyles.buttonText]}>
              {text}
            </Text>
          </TouchableOpacity>
      }
     
    </>
  );
};
Button.defaultProps = { customStyles: {} };

const styles = StyleSheet.create({
  mainContainer: {
    width: '90%',
    height:40,
    alignSelf: 'center',
    borderRadius: (mobileW * 2) / 100,
    backgroundColor: Colors.buttoncolorblue,
    justifyContent:'center',
    alignItems:'center',
    // paddingVertical: (mobileW * 4) / 100,
    marginTop: (mobileW * 8) / 100,
  },
  mainContainer1: {
    width: '90%',
    alignSelf: 'center',
    borderColor: Colors.bordercolorblue,
    borderWidth: 2,
    borderRadius: (mobileW * 2) / 100,
    backgroundColor: Colors.buttoncolorlight,
    paddingVertical: (mobileW * 3) / 100,
    marginTop: (mobileW * 4) / 100,
    marginBottom: (mobileW * 4) / 100,
  },
  buttonText: {
    color: Colors.textwhite,
    fontFamily: Font.fontmedium,
    fontSize: Font.buttontextsize,
    textAlign: config.textalign,
    alignSelf: 'center',
  },
  buttonText1: {
    color: Colors.textblue,
    fontFamily: Font.fontmedium,
    fontSize: Font.buttontextsize,
    textAlign: config.textalign,
    alignSelf: 'center',
  },
  img: {
    // width: 25,
    // height: 25,
    marginRight: 10,
  },
});

export default Button;
