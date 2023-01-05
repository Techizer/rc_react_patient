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
import moment from "moment-timezone";
import { useIsFocused } from "@react-navigation/native";


const Upcoming = (props) => {

  const [appointments, setAppointments] = useState(props?.route?.params?.isGuest === 'true' ? [] : [1, 2, 3, 4, 5, 6, 7])
  const [isLoading, setIsLoading] = useState(props?.route?.params?.isGuest === 'true' ? false : true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const isFocused = useIsFocused()


  useEffect(() => {
    if (props?.route?.params?.isGuest === 'false') {
      getAppointments()
    }
  }, [isRefreshing, isFocused])

  const checkVideoCallStatus = (list) => {

    let tempArr = []
    for (const iterator of list) {
      var currentTime = moment().unix();
      var appointmentDate = moment(iterator.appoitment_date).format("YYYY-MM-DD");
      var appointmentTime = iterator.app_time;
      var isSameDay = moment().isSame(appointmentDate, "day");
      appointmentTime = moment(appointmentDate + " " + appointmentTime, "YYYY-MM-DD hh:mm A").unix();
      if (isSameDay) {
        // console.log('isSameDay');
        if (currentTime < appointmentTime) {
          // console.log('currentTime < appointmentTime');
          let diff = (appointmentTime - currentTime) / 60; //mins
          if (diff <= 10) {
            // console.log('diff');
            tempArr.push({
              ...iterator,
              videoCall: true
            })
          } else {
            tempArr.push({
              ...iterator,
              videoCall: false
            })
          }
        } else {
          tempArr.push({
            ...iterator,
            videoCall: true
          })
          // console.log('currentTime > appointmentTime');
        }
      } else {
        tempArr.push({
          ...iterator,
          videoCall: false
        })
      }
    }
    setAppointments(tempArr)
  }

  const getAppointments = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];

    let url = config.baseURL + "api-patient-upcoming-appointment";

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
          checkVideoCallStatus(obj.result)
          setTimeout(() => {
            setIsRefreshing(false)
            setIsLoading(false)
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
              }}>{props?.route?.params?.isGuest === 'true' ? 'Oops! No Consultations Found' : 'Sorry, no consultations found'}</Text>
              <Text style={{
                fontSize: Font.medium,
                fontFamily: Font.Regular,
                color: Colors.lightGrey,
                textAlign: 'center',
                marginTop: vs(10)
              }}>{props?.route?.params?.isGuest === 'true' ? 'No Consultations record found, user type is Guest' : 'You can start a new consultation with our qualified doctors!'}</Text>
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