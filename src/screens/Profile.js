import {
  Text,
  Modal,
  Alert,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { Component, Profiler, useEffect } from "react";
import { DrawerActions } from "@react-navigation/native";
import { useDrawerStatus } from '@react-navigation/drawer'

import { Colors } from "../Provider/Colorsfont";


const Profile = ({ navigation }) => {

  const isDrawerOpen = useDrawerStatus();

  useEffect(() => {
    navigation.addListener('focus', () => {
      // when screen is focused (navigated to)
      navigation.dispatch(DrawerActions.openDrawer());
    });
  }, [navigation])

  useEffect(() => {
    if (isDrawerOpen === 'closed') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      })
    }
    console.log(isDrawerOpen);
  }, [isDrawerOpen])

  return (
    <View style={{ flex: 1, backgroundColor: Colors.White }}>

    </View>
  );
}

export default Profile;
