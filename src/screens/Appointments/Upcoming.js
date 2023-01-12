
import {
  FlatList,
  Text,
  View,
} from "react-native";
import React, { Component, useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Colors,
  Font,
  config,
  apifuntion,
  Lang_chg,
} from "../../Provider/utilslib/Utils";
import AppointmentContainer from "../../components/AppointmentContainer";
import { vs } from "react-native-size-matters";
import { useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";



const Past = (props) => {

  const { loggedInUserDetails, guest, appLanguage } = useSelector(state => state.StorageReducer)

  const [appointments, setAppointments] = useState(guest ? [] : [1, 2, 3, 4, 5, 6, 7])
  const [isLoading, setIsLoading] = useState(guest ? false : true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const isFocused = useIsFocused()
  const insets = useSafeAreaInsets()
  useEffect(() => {
    if (!guest) {
      getAppointments()
    }
  }, [isRefreshing, isFocused])



  const getAppointments = async (page) => {

    let url = config.baseURL + "api-patient-upcoming-appointment";

    var data = new FormData();
    data.append("lgoin_user_id", loggedInUserDetails.user_id);
    data.append("service_type", 'all');
    data.append("page_count", 1);

    // consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        // console.log("getAppointments-response...", obj);
        if (obj.status == true) {
          setTimeout(() => {
            setIsRefreshing(false)
            setIsLoading(false)
            setAppointments(obj.result)
          }, 250);
        } else {
          setIsRefreshing(false)
          setIsLoading(false)
          setAppointments([])
          return false;
        }
      }).catch((error) => {
        setIsRefreshing(false)
        setIsLoading(false)
        setAppointments([])
        console.log("getAppointments-error ------- " + error);
      });
  };



  return (
    //
    <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor, }}>

      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: vs(90) }}
        data={appointments}
        ItemSeparatorComponent={() => {
          return (
            <View style={{ height: vs(7) }}></View>
          )
        }}
        renderItem={({ item, index }) => {
          return (
            <AppointmentContainer
              Index={index}
              Item={item}
              navigation={props.navigation}
              isLoading={isLoading}

            />
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
              }}>{guest ? Lang_chg.guestAppoitmentTitle[appLanguage == 'en' ? 0 : 1] : Lang_chg.noAppoitmentTitle[appLanguage == 'en' ? 0 : 1]}</Text>
              <Text style={{
                fontSize: Font.medium,
                fontFamily: Font.Regular,
                color: Colors.lightGrey,
                textAlign: 'center',
                marginTop: vs(10)
              }}>{guest ? Lang_chg.guestAppoitmentDesc[appLanguage == 'en' ? 0 : 1] : Lang_chg.noAppoitmentDesc[appLanguage == 'en' ? 0 : 1]}</Text>
            </View>
          )
        }}
        refreshing={isRefreshing}
        onRefresh={() => setIsRefreshing(true)}
      />


    </View>
  );
}

export default Past;