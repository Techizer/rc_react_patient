import {
  Text,
  View,
} from "react-native";
import React, { Component } from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import {
  Colors,
  Font,
  config,
  windowWidth,
  Lang_chg,
  ScreenHeader
} from "../../Provider/utilslib/Utils";
import { leftArrow, Notification } from "../../Icons/Index";
import Personal from "./Personal";
import Medical from "./Medical";
import LifeStyle from "./LifeStyle";

const Tabs = createMaterialTopTabNavigator()




const Index = ({navigation}) => {

  return (
    //
    <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>

      <View style={{ flex: 1, }}>
        <ScreenHeader
          title={Lang_chg.Editprofile[config.language]}
          navigation={navigation}
          onBackPress={() => navigation.pop()}
          leftIcon
        />

        <Tabs.Navigator
          screenOptions={{
            tabBarItemStyle: { width: windowWidth / 3, },
            tabBarScrollEnabled: true,
            tabBarActiveTintColor: Colors.Theme,
            tabBarInactiveTintColor: Colors.lightGrey,
            tabBarIndicatorContainerStyle: {
              backgroundColor: Colors.tabsBackground,
              // marginTop:vs(7)
            },
            tabBarIndicatorStyle: {
              backgroundColor: Colors.Theme,

            },
            tabBarLabelStyle: {
              textTransform: 'none',
              fontSize: Font.medium,
              fontFamily: Font.Medium
            }
          }}>
          <Tabs.Screen name={'Personal'} component={Personal} />
          <Tabs.Screen name={'Medical'} component={Medical} />
          <Tabs.Screen name={'LifeStyle'} component={LifeStyle} />

        </Tabs.Navigator>

      </View>
    </View>
  );
}

export default Index;