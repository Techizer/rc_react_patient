import {
  Platform,
  Text,
  View,
} from "react-native";
import React, { Component, useEffect } from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import {
  Colors,
  Font,
  windowWidth,
  Lang_chg,
  deviceHeight,
  windowHeight,
  StatusbarHeight,
} from "../../Provider/utilslib/Utils";
import { ScreenHeader } from "../../components/ScreenHeader";
import Upcoming from "./Upcoming";
import OnGoing from "./OnGoing";
import Past from "./Past";
import { useSelector } from "react-redux";

const Tabs = createMaterialTopTabNavigator()

const ConsultIndex = ({ navigation, route }) => {

  const { todayConsultations, appLanguage } = useSelector(state => state.StorageReducer)


  let headerHeight = (deviceHeight - windowHeight) + StatusbarHeight;
  headerHeight += (Platform.OS === 'ios') ? (windowWidth * 3.5) / 100 : -50
  let finalPosition = headerHeight + (windowWidth * 13) / 100



  return (
    //
    <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>

      <ScreenHeader
        title={Lang_chg.Doctor_Consultations[appLanguage == 'en' ? 0 : 1]}
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
        position:'absolute',
        top:headerHeight + (windowWidth * 11) / 100,
        justifyContent:'center',
        alignItems:'center'
      }}>

        <SvgXml xml={BlackFilter} height={vs(15)} width={s(17.29)} />

      </View> */}


      <Tabs.Navigator
        initialRouteName={todayConsultations?.length > 0 ? Lang_chg.Ongoing[appLanguage == 'en' ? 0 : 1] : Lang_chg.Upcoming[appLanguage == 'en' ? 0 : 1]}
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
        <Tabs.Screen name={Lang_chg.Upcoming[appLanguage == 'en' ? 0 : 1]} component={Upcoming} />
        <Tabs.Screen name={Lang_chg.Ongoing[appLanguage == 'en' ? 0 : 1]} component={OnGoing} />
        <Tabs.Screen name={Lang_chg.Past[appLanguage == 'en' ? 0 : 1]} component={Past} />

      </Tabs.Navigator>





    </View>
  );
}

export default ConsultIndex;