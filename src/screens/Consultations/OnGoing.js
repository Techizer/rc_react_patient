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
  LangProvider,
  apifuntion,
} from "../../Provider/Utils/Utils";
import AppointmentContainer from "../../components/AppointmentContainer";
import { vs } from "react-native-size-matters";
import moment from "moment-timezone";
import { useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";


const OnGoing = (props) => {

  const { loggedInUserDetails, guest, languageIndex } = useSelector(state => state.StorageReducer)

  const [appointments, setAppointments] = useState(guest ? [] : [1, 2, 3, 4, 5, 6, 7])
  const [isLoading, setIsLoading] = useState(guest ? false : true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const isFocused = useIsFocused()

  useEffect(() => {
    if (!guest) {
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
              // videoCall: false
              videoCall: true
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
          // videoCall: false
          videoCall: true
        })
      }
    }
    setAppointments(tempArr)
  }

  const getAppointments = async (page) => {
    let url = config.baseURL + "api-patient-today-appointment";

    var data = new FormData();
    data.append("lgoin_user_id", loggedInUserDetails.user_id);
    data.append("service_type", 'doctor');
    data.append("page_count", 1);

    // console.log("data", data);
    apifuntion
      .postApi(url, data, 1)
      .then(async (obj) => {
        // console.log("getAppointments-response...", obj);
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
        console.log("getAppointments-error ------- " + error);
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
              }}>{guest ? LangProvider.guestConsultTitle[languageIndex] : LangProvider.noConsultTitle[languageIndex]}</Text>
              <Text style={{
                fontSize: Font.medium,
                fontFamily: Font.Regular,
                color: Colors.lightGrey,
                textAlign: 'center',
                marginTop: vs(10)
              }}>{guest ? LangProvider.guestConsultDesc[languageIndex] : LangProvider.noConsultDesc[languageIndex]}</Text>
            </View>
          )
        }}
        refreshing={isRefreshing}
        onRefresh={() => setIsRefreshing(true)}
      />


    </View>
  );
}

export default OnGoing;