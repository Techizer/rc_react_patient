import {
  Text,
  View,
} from "react-native";
import React, { Component } from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import {
  Colors,
  Font,
  windowWidth,
  LangProvider,
  ScreenHeader
} from "../../Provider/Utils/Utils";
import Personal from "./Personal";
import Medical from "./Medical";
import LifeStyle from "./LifeStyle";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const Tabs = createMaterialTopTabNavigator()

const Index = () => {

  const { appLanguage } = useSelector(state => state.StorageReducer)
  const { canGoBack, goBack, reset } = useNavigation()
  const navigation = useNavigation()
  return (
    //
    <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>

      <View style={{ flex: 1, }}>
        <ScreenHeader
          title={LangProvider.Editprofile[appLanguage == 'en' ? 0 : 1]}
          navigation={navigation}
          onBackPress={
            () => canGoBack() ? goBack() :
              reset({
                index: 0,
                routes: [{ name: "DashboardStack" }],
              })
          }
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
          <Tabs.Screen name={LangProvider.Personal[appLanguage == 'en' ? 0 : 1]} component={Personal} />
          <Tabs.Screen name={LangProvider.Medical[appLanguage == 'en' ? 0 : 1]} component={Medical} />
          <Tabs.Screen name={LangProvider.LifeStyle[appLanguage == 'en' ? 0 : 1]} component={LifeStyle} />

        </Tabs.Navigator>

      </View>
    </View>
  );
}

export default Index;