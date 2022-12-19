import {
  FlatList,
  Text,
  View,
} from "react-native";
import React, { Component, useEffect, useState } from "react";
import { vs, s } from "react-native-size-matters";

import {
  Colors,
  Font,
  config,
  windowWidth,
  Lang_chg,
  localStorage,
  apifuntion,
  consolepro,
} from "../Provider/utilslib/Utils";
import ScreenHeader from "../components/ScreenHeader";



const Orders = ({ navigation }) => {

  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(false)









  return (
    //
    <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>

      <ScreenHeader
        title={Lang_chg.Orders[config.language]}
        navigation={navigation}
        onBackPress={() => navigation.pop()}
        leftIcon
        rightIcon
      />

      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: vs(100) }}
        data={appointments}
        ItemSeparatorComponent={() => {
          return (
            <View style={{ height: vs(7) }}></View>
          )
        }}
        renderItem={({ item, index }) => {
          return (
            null
          )
        }}
        ListEmptyComponent={() => {
          return (
            <View style={{ marginTop: vs(140), alignSelf: 'center', paddingHorizontal: '10%' }}>
              <Text style={{
                fontSize: Font.xlarge,
                fontFamily: Font.Regular,
                color: Colors.darkText,
                textAlign: 'center'
              }}>{'Buy Home Medical Supplies & Equipment online'}</Text>
              <Text style={{
                fontSize: Font.medium,
                fontFamily: Font.Regular,
                color: Colors.lightGrey,
                textAlign: 'center',
                marginTop:vs(10)
              }}>{'We are coming soon in your location with this option'}</Text>
            </View>
          )
        }}
        refreshing={isLoading}
        onRefresh={() => setIsLoading(true)}
      />


    </View>
  );
}

export default Orders;