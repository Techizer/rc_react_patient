import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Keyboard,
  Modal,
  ScrollView,
  TouchableHighlight,
} from "react-native";
import {
  Colors,
  Font,
  config,
  windowWidth,
  localStorage,
  Icons,
  consolepro,
  Lang_chg,
  apifuntion,
} from "../Provider/utilslib/Utils";

import Styles from "../Styles";
import { leftArrow, rightArrow, Notification } from "../icons/SvgIcons/Index";
import { s, vs } from "react-native-size-matters";
import ScreenHeader from "../components/ScreenHeader";

const LabTests = ({navigation}) => {


  return (
    <View style={Styles.container1}>

      <ScreenHeader
        title={Lang_chg.Lab_Test[config.language]}
        navigation={navigation}
        onBackPress={() => navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })}
        rightIcon={Notification}
        leftIcon={true}
      />


    </View>
  );

}

export default LabTests;