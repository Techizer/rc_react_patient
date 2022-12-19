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
  windowWidth,
  Lang_chg,
  localStorage,
  apifuntion,
  consolepro,
} from "../../Provider/utilslib/Utils";
import AppointmentContainer from "../../components/AppointmentContainer";
import { vs } from "react-native-size-matters";



const OnGoing = ({ navigation }) => {

  const [appointments, setAppointments] = useState([1, 2, 3, 4, 5, 6, 7])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getAppointments()
  }, [isLoading])



  const getAppointments = async (page) => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];

    let url = config.baseURL + "api-patient-today-appointment";

    var data = new FormData();
    data.append("lgoin_user_id", user_id);
    data.append("service_type", 'doctor');
    data.append("page_count", 1);

    // consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        // consolepro.consolelog("getAppointments-response...", obj);
        if (obj.status == true) {
          setTimeout(() => {
            setIsLoading(false)
            setAppointments(obj.result)
          }, 500);
        } else {
          setTimeout(() => {
            setIsLoading(false)
            setAppointments(obj.result)
          }, 500);
          return false;
        }
      }).catch((error) => {
        setIsLoading(false)
        consolepro.consolelog("getAppointments-error ------- " + error);
      });
  };



  return (
    //
    <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>

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
            <AppointmentContainer
              Item={item}
              navigation={navigation}
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
              }}>{'Sorry, no consultations found'}</Text>
              <Text style={{
                fontSize: Font.medium,
                fontFamily: Font.Regular,
                color: Colors.lightGrey,
                textAlign: 'center',
                marginTop: vs(10)
              }}>{'You can start a new consultation with our qualified doctors!'}</Text>
            </View>
          )
        }}
        refreshing={isLoading}
        onRefresh={() => setIsLoading(true)}
      />


    </View>
  );
}

export default OnGoing;