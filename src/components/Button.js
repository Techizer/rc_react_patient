import React, { useEffect } from "react";
import { StyleSheet, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { Colors, Icons, Font, windowHeight, config, windowWidth } from '../Provider/Utils/Utils';
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';
export const Button = ({
  text,
  customStyles,
  onPress,
  image,
  onLoading,
  btnStyle,
  disable
}) => {
  return (
    <TouchableOpacity
      disabled={disable}
      onPress={onPress}
      style={[styles.mainContainer, { backgroundColor: disable ? Colors.Border : Colors.Theme, }, btnStyle]}>
      {
        onLoading ?
          <SkypeIndicator color={Colors.White} size={16} count={3} />
          :
          <Text style={[styles.buttonText]}>{text}</Text>
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
    fontSize: Font.medium,
    textAlign: config.textalign,
    alignSelf: 'center',
  },
  buttonText1: {
    color: Colors.Blue,
    fontFamily: Font.Medium,
    fontSize: Font.medium,
    textAlign: config.textalign,
    alignSelf: 'center',
  }
});

