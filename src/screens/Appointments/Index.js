import {
  Platform,
  Text,
  View,
} from "react-native";
import React, { Component, useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import {
  Colors,
  Font,
  config,
  windowWidth,
  Lang_chg,
  deviceHeight,
  windowHeight,
  StatusbarHeight,
  ScreenHeader
} from "../../Provider/utilslib/Utils";
import Upcoming from "./Upcoming";
import OnGoing from "./OnGoing";
import Past from "./Past";

const Tabs = createMaterialTopTabNavigator()

let isGuest = ''


const AppoitmentIndex = ({ navigation, route }) => {

  let headerHeight = (deviceHeight - windowHeight) + StatusbarHeight;
  headerHeight += (Platform.OS === 'ios') ? (windowWidth * 3.5) / 100 : -50
  let finalPosition = headerHeight + (windowWidth * 13) / 100



  return (
    //
    <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>

      <ScreenHeader
        title={Lang_chg.MyAppointments[config.language]}
        navigation={navigation}
        onBackPress={() => navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })}
        leftIcon
        rightIcon
      />

      {/* <View style={{
        flexDirection: 'row',
        width: '12%',
        backgroundColor: Colors.backgroundcolor,
        height: (windowWidth * 12) / 100,
        alignSelf: 'flex-end',
        position: 'absolute',
        top: headerHeight + (windowWidth * 11) / 100,
        justifyContent: 'center',
        alignItems: 'center'
      }}>

        <SvgXml xml={BlackFilter} height={vs(15)} width={s(17.29)} />

      </View> */}


      <Tabs.Navigator
        initialRouteName={route?.params?.todaysLength > 0 ? 'Ongoing' : 'Upcoming'}
        screenOptions={{
          tabBarStyle: { height: (windowWidth * 10.5) / 100, width: '100%', backgroundColor: Colors.backgroundcolor, borderWidth: 0, },
          tabBarItemStyle: { width: windowWidth / 3, },
          tabBarScrollEnabled: true,
          tabBarActiveTintColor: Colors.Theme,
          tabBarInactiveTintColor: Colors.lightGrey,
          tabBarIndicatorContainerStyle: {
            height: '100%',
            borderWidth: 0
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
        <Tabs.Screen
          name={'Upcoming'} component={Upcoming} initialParams={{ isGuest: route?.params?.isGuest }} />
        <Tabs.Screen name={'Ongoing'} component={OnGoing} initialParams={{ isGuest: route?.params?.isGuest }} />
        <Tabs.Screen name={'Past'} component={Past} initialParams={{ isGuest: route?.params?.isGuest }} />

      </Tabs.Navigator>





    </View>
  );
}

export default AppoitmentIndex;