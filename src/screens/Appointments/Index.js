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
} from "../../Provider/utilslib/Utils";
import ScreenHeader from "../../components/ScreenHeader";
import { leftArrow, Notification } from "../../icons/SvgIcons/Index";
import Upcoming from "./Upcoming";
import OnGoing from "./OnGoing";
import Past from "./Past";

const Tabs = createMaterialTopTabNavigator()




const Index = ({navigation}) => {

  return (
    //
    <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>

      <View style={{ flex: 1, }}>
        <ScreenHeader
          title={Lang_chg.MyAppointments[config.language]}
          navigation={navigation}
          onBackPress={() => navigation.pop()}
          leftIcon={leftArrow}
          rightIcon={Notification}
        />

        <Tabs.Navigator
          screenOptions={{
            tabBarItemStyle: { width: windowWidth / 3.4, },
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
          <Tabs.Screen name={'Upcoming'} component={Upcoming} />
          <Tabs.Screen name={'OnGoing'} component={OnGoing} />
          <Tabs.Screen name={'Past'} component={Past} />

        </Tabs.Navigator>

      </View>
    </View>
  );
}

export default Index;