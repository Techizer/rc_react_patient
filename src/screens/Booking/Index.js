import {
  Platform,
  Text,
  View,
} from "react-native";
import React, { Component, useEffect, useState } from "react";

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
import { useSelector } from "react-redux";


const BookingIndex = ({ navigation, route }) => {

  const { todayConsultations, appLanguage } = useSelector(state => state.StorageReducer)

  const [statesData, setStatesData] = useState({
    languageIndex: appLanguage == 'en' ? 0 : 1
  })

  let headerHeight = (deviceHeight - windowHeight) + StatusbarHeight;
  headerHeight += (Platform.OS === 'ios') ? (windowWidth * 3.5) / 100 : -50
  let finalPosition = headerHeight + (windowWidth * 13) / 100



  return (
    //
    <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>

      <ScreenHeader
        title={Lang_chg.Booking[statesData.languageIndex]}
        navigation={navigation}
        onBackPress={() => navigation.pop()}
        leftIcon
      />







    </View>
  );
}

export default BookingIndex;