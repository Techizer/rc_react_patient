import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  Keyboard,
  Modal,
  ScrollView,
  TouchableHighlight,
} from "react-native";
import {
  config,
  LangProvider,
} from "../Provider/Utils/Utils";

import Styles from "../Styles";
import { ScreenHeader } from "../components/ScreenHeader";

const LabTests = ({navigation}) => {


  return (
    <View style={Styles.container1}>

      <ScreenHeader
        title={LangProvider.Lab_Test[config.language]}
        navigation={navigation}
        onBackPress={() => navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })}
        leftIcon
      />


    </View>
  );

}

export default LabTests;
