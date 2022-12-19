import React, { useEffect } from "react";
import { StyleSheet, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { Colors, Icons, Font, windowHeight, config, windowWidth, Lang_chg, apifuntion, msgText, msgTitle, consolepro, msgProvider, localStorage } from '../Provider/utilslib/Utils';
const Button = ({
  text,
  customStyles,
  onPress,
  image,
  onLoading,
  btnStyle
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.mainContainer, btnStyle]}>
      {
        onLoading ?
          <ActivityIndicator size={'small'} color={Colors.White} />
          :
          <Text style={[styles.buttonText, customStyles.buttonText]}>{text}</Text>
      }

    </TouchableOpacity>
  );
};
Button.defaultProps = { customStyles: {} };

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: 40,
    alignSelf: 'center',
    borderRadius: (windowWidth * 2) / 100,
    backgroundColor: Colors.Theme,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer1: {
    width: '90%',
    alignSelf: 'center',
    borderColor: Colors.Blue,
    borderWidth: 2,
    borderRadius: (windowWidth * 2) / 100,
    backgroundColor: Colors.buttoncolorlight,
    paddingVertical: (windowWidth * 3) / 100,
    marginBottom: (windowWidth * 4) / 100,
  },
  buttonText: {
    color: Colors.White,
    fontFamily: Font.Medium,
    fontSize: Font.buttontextsize,
    textAlign: config.textalign,
    alignSelf: 'center',
  },
  buttonText1: {
    color: Colors.Blue,
    fontFamily: Font.Medium,
    fontSize: Font.buttontextsize,
    textAlign: config.textalign,
    alignSelf: 'center',
  }
});

export default Button;
