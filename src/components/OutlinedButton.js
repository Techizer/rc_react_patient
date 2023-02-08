import React, { useEffect } from "react";
import { StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { Colors, Icons, Font, windowHeight, config, windowWidth, } from '../Provider/Utils/Utils';
const OutlinedButton = ({
  text,
  customStyles,
  onPress,
  image,
  onLoading,
  isSingle,
  btnStyle
}) => {
  return (

    <TouchableOpacity
      onPress={onPress}
      style={[styles.mainContainer, btnStyle]}>
      <Text style={[styles.buttonText, customStyles.buttonText]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};
OutlinedButton.defaultProps = { customStyles: {} };

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: 40,
    alignSelf: 'center',
    borderRadius: (windowWidth * 2) / 100,
    backgroundColor: Colors.White,
    borderWidth: 1.1,
    borderColor: Colors.Theme,
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
    marginTop: (windowWidth * 4) / 100,
    marginBottom: (windowWidth * 4) / 100,
  },
  buttonText: {
    color: Colors.Theme,
    fontFamily: Font.Medium,
    fontSize: Font.medium,
    textAlign: config.textalign,
    alignSelf: 'center',
  }
});

export default OutlinedButton;
