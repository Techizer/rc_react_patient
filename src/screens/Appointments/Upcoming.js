import {
  FlatList,
  Text,
  View,
} from "react-native";
import React, { Component, useEffect, useState } from "react";

import {
  Colors,
  Font,
  config,
  localStorage,
  apifuntion,
  consolepro,
  Lang_chg,
} from "../../Provider/utilslib/Utils";
import AppointmentContainer from "../../components/AppointmentContainer";
import { vs } from "react-native-size-matters";
import { useIsFocused } from "@react-navigation/native";


const Upcoming = (props) => {

  const [appointments, setAppointments] = useState(props?.route?.params?.isGuest === 'true' ? [] : [1, 2, 3, 4, 5, 6, 7])
  const [isLoading, setIsLoading] = useState(props?.route?.params?.isGuest === 'true' ? false : true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const isFocused = useIsFocused()



  useEffect(() => {
    // console.log('******************************', props?.route?.params?.isGuest);
    if (props?.route?.params?.isGuest === 'false') {
      getAppointments()
    }
  }, [isRefreshing, isFocused])



  const getAppointments = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];

    let url = config.baseURL + "api-patient-upcoming-appointment";

    var data = new FormData();
    data.append("lgoin_user_id", user_id);
    data.append("service_type", 'all');
    data.append("page_count", 1);

    // consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        // consolepro.consolelog("getAppointments-response...", obj);
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
        setAppointments([])
        setIsLoading(false)
        setIsRefreshing(false)
        consolepro.consolelog("getAppointments-error ------- " + error);
      });
  };



  return (
    //
    <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>

      <FlatList
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `Appointment # ${index}`}
        contentContainerStyle={{ paddingBottom: vs(100) }}
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
              }}>{props?.route?.params?.isGuest === 'true' ? Lang_chg.guestAppoitmentTitle[config.language] : Lang_chg.noAppoitmentTitle[config.language]}</Text>
              <Text style={{
                fontSize: Font.medium,
                fontFamily: Font.Regular,
                color: Colors.lightGrey,
                textAlign: 'center',
                marginTop: vs(10)
              }}>{props?.route?.params?.isGuest === 'true' ? Lang_chg.guestAppoitmentDesc[config.language] : Lang_chg.noAppoitmentDesc[config.language]}</Text>
            </View>
          )
        }}
        refreshing={isRefreshing}
        onRefresh={() => setIsRefreshing(true)}
      />


    </View>
  );
}

export default Upcoming;