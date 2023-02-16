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
  LangProvider,
} from "../Provider/Utils/Utils";
import { ScreenHeader } from "../components/ScreenHeader";
import { useSelector } from "react-redux";
import NoInternet from "../components/NoInternet";



const Orders = ({ navigation }) => {

  const { loggedInUserDetails, appLanguage, deviceConnection, } = useSelector(state => state.StorageReducer)

  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)


  return (
    //
    <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>

      <ScreenHeader
        title={LangProvider.Orders[appLanguage == 'en' ? 0 : 1]}
        navigation={navigation}
        onBackPress={() => navigation.pop()}
        leftIcon
      />

      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: vs(100) }}
        data={orders}
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
              }}>{LangProvider.OrdersTitle[appLanguage == 'en' ? 0 : 1]}</Text>
              <Text style={{
                fontSize: Font.medium,
                fontFamily: Font.Regular,
                color: Colors.lightGrey,
                textAlign: 'center',
                marginTop: vs(10)
              }}>{LangProvider.OrdersDesc[appLanguage == 'en' ? 0 : 1]}</Text>
            </View>
          )
        }}
        refreshing={isLoading}
        onRefresh={() => setIsLoading(true)}
      />

      <NoInternet
        visible={!deviceConnection}
      />
    </View>
  );
}

export default Orders;