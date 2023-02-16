
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
import { useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";
import NoInternet from "../../components/NoInternet";



const OnGoing = (props) => {

  const { loggedInUserDetails, guest, deviceConnection, languageIndex } = useSelector(state => state.StorageReducer)

  const [appointments, setAppointments] = useState(guest ? [] : [1, 2, 3, 4, 5, 6, 7])
  const [isLoading, setIsLoading] = useState(guest ? false : true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const isFocused = useIsFocused()


  useEffect(() => {
    if (!guest && deviceConnection) {
      getLabTest()
    }
  }, [isRefreshing, isFocused, deviceConnection])



  const getLabTest = async (page) => {

    let url = config.baseURL + "api-patient-past-appointment";

    var data = new FormData();
    data.append("lgoin_user_id", loggedInUserDetails.user_id);
    data.append("service_type", 'lab');
    data.append("page_count", 1);

    // console.log("data", data);
    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        // console.log("getLabTest-response...", obj);
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
              }}>{guest ? LangProvider.guestLabsTitle[languageIndex] : LangProvider.noLabsTitle[languageIndex]}</Text>
              <Text style={{
                fontSize: Font.medium,
                fontFamily: Font.Regular,
                color: Colors.lightGrey,
                textAlign: 'center',
                marginTop: vs(10)
              }}>{guest ? LangProvider.guestLabsDesc[languageIndex] : LangProvider.noLabsTestsDesc[languageIndex]}</Text>
            </View>
          )
        }}
        refreshing={isRefreshing}
        onRefresh={() => setIsRefreshing(true)}
      />

      <NoInternet
        visible={!deviceConnection}
      />
    </View>
  );
}

export default OnGoing;