import React, { useEffect } from "react";
import { StyleSheet, Text, Image, TouchableOpacity } from "react-native";
// import Spinner from "react-native-spinkit";
// import { Colors } from "react-native/Libraries/NewAppScreen";
// import { color } from "react-native-reanimated";
// import { Color, Fonts } from "../utils";
// import { RF } from "../utils/responsive";
import { Colors, Icons, Font, windowHeight, config, windowWidth, Lang_chg, apifuntion, msgText, msgTitle, consolepro, msgProvider, localStorage } from '../Provider/utilslib/Utils';
const Button = ({
  text,
  customStyles,
  onPress,
  image,
  onLoading,
  isSingle,
  isBlank,
  btnStyle
}) => {
  return (
    <>

      {
        (isBlank != undefined && isBlank === true) ?
          <TouchableOpacity
            onPress={onPress}
            style={[styles.mainContainer1, btnStyle]}>
            <Text style={[styles.buttonText1, customStyles.buttonText]}>
              {text}
            </Text>
          </TouchableOpacity>
          :
          <TouchableOpacity
            onPress={onPress}
            style={[styles.mainContainer, btnStyle]}>
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
    borderRadius: (windowWidth * 2) / 100,
    backgroundColor: Colors.Theme,
    justifyContent:'center',
    alignItems:'center',
    // paddingVertical: (windowWidth * 4) / 100,
    marginTop: (windowWidth * 8) / 100,
  },
  mainContainer1: {
    width: '90%',
    alignSelf: 'center',
    borderColor: Colors.Blue,
    borderWidth: 2,
    borderRadius: (windowWidth * 2) / 100,
    backgroundColor: Colors.buttoncolorlight,
    paddingVertical: (windowWidth * 3) / 100,
    marginTop: (windowWidth * 4) / 100,
    marginBottom: (windowWidth * 4) / 100,
  },
  buttonText: {
    color: Colors.White,
    fontFamily: Font.fontmedium,
    fontSize: Font.buttontextsize,
    textAlign: config.textalign,
    alignSelf: 'center',
  },
  buttonText1: {
    color: Colors.Blue,
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
