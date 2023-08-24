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
  LangProvider,
  deviceHeight,
  windowHeight,
  StatusbarHeight,
} from "../../Provider/Utils/Utils";
import { ScreenHeader } from "../../Components/ScreenHeader";
import Upcoming from "./Upcoming";
import OnGoing from "./OnGoing";
import Past from "./Past";
import { useSelector } from "react-redux";

const Tabs = createMaterialTopTabNavigator()

const ConsultIndex = ({ navigation, route }) => {

  const { todayConsultations, languageIndex } = useSelector(state => state.StorageReducer)


  let headerHeight = (deviceHeight - windowHeight) + StatusbarHeight;
  headerHeight += (Platform.OS === 'ios') ? (windowWidth * 3.5) / 100 : -50
  let finalPosition = headerHeight + (windowWidth * 13) / 100



  return (
    //
    <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>

      <ScreenHeader
        title={LangProvider.Doctor_Consultations[languageIndex]}
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
        initialRouteName={todayConsultations > 0 ? LangProvider.Ongoing[languageIndex] : LangProvider.Upcoming[languageIndex]}
        // style={{ elevation: 0 }}
        screenOptions={{
          // tabBarStyle: { width: '100%', backgroundColor: Colors.backgroundcolor, borderWidth: 0, },
          tabBarItemStyle: { width: windowWidth / 3, },
          tabBarScrollEnabled: true,
          tabBarActiveTintColor: Colors.Theme,
          tabBarInactiveTintColor: Colors.lightGrey,
          tabBarIndicatorContainerStyle: {
            backgroundColor: Colors.tabsBackground,
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
        <Tabs.Screen name={LangProvider.Upcoming[languageIndex]} component={Upcoming} />
        <Tabs.Screen name={LangProvider.Ongoing[languageIndex]} component={OnGoing} />
        <Tabs.Screen name={LangProvider.Past[languageIndex]} component={Past} />

      </Tabs.Navigator>





    </View>
  );
}

export default ConsultIndex;