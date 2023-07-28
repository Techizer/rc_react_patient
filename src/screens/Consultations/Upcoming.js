
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
  windowWidth,
} from "../../Provider/Utils/Utils";
import AppointmentContainer from "../../components/AppointmentContainer";
import { vs } from "react-native-size-matters";
import moment from "moment-timezone";
import { useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";
import NoInternet from "../../components/NoInternet";
import { SkypeIndicator } from "react-native-indicators";

let onEndReachedCalledDuringMomentum = true

const Upcoming = (props) => {

  const { loggedInUserDetails, guest, languageIndex, deviceConnection } = useSelector(state => state.StorageReducer)

  const [dummy, setDummy] = useState(guest ? [] : [1, 2, 3, 4, 5, 6, 7])
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(guest ? false : true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [loadMore, setLoadMore] = useState(false)
  const [pageCount, setPageCount] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const isFocused = useIsFocused()

  useEffect(() => {
    if (!guest && deviceConnection && isFocused) {
      getAppointments(pageCount)
    }
  }, [isFocused, deviceConnection])

  useEffect(() => {
    if (!guest && deviceConnection && isRefreshing) {
      getAppointments(pageCount)
    }
  }, [isRefreshing])

  const checkVideoCallStatus = (data) => {
    let tempArr = []
    let newArr = data.result
    let lastIndex = null
    if (data.result && data.result.length > 0) {
      lastIndex = data.result[data.result.length - 1]
      // console.log({ lastIndex });
      newArr.pop()
      // console.log({ newArr });
      // return
      if (lastIndex.currentpage === 1) {
        setTotalPage(lastIndex.lastpage === 1)
        for (const iterator of newArr) {
          var currentTime = moment().unix();
          var appointmentDate = moment(iterator.appoitment_date).format("YYYY-MM-DD");
          var appointmentTime = iterator.app_time;
          var isSameDay = moment().isSame(appointmentDate, "day");
          appointmentTime = moment(appointmentDate + " " + appointmentTime, "YYYY-MM-DD hh:mm A").unix();
          if (isSameDay) {
            if (currentTime < appointmentTime) {
              let diff = (appointmentTime - currentTime) / 60; //mins
              if (diff <= 10) {
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
            }
          } else {
            tempArr.push({
              ...iterator,
              videoCall: false
            })
          }
        }
        setAppointments(tempArr)
      } else {
        console.log('**************');
        tempArr = appointments
        for (const iterator of newArr) {
          var currentTime = moment().unix();
          var appointmentDate = moment(iterator.appoitment_date).format("YYYY-MM-DD");
          var appointmentTime = iterator.app_time;
          var isSameDay = moment().isSame(appointmentDate, "day");
          appointmentTime = moment(appointmentDate + " " + appointmentTime, "YYYY-MM-DD hh:mm A").unix();
          if (isSameDay) {
            if (currentTime < appointmentTime) {
              let diff = (appointmentTime - currentTime) / 60; //mins
              if (diff <= 10) {
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

    }
  }

  const getAppointments = async (page) => {
    let url = config.baseURL + "api-patient-upcoming-appointment";

    var data = new FormData();
    data.append("lgoin_user_id", loggedInUserDetails?.user_id);
    data.append("service_type", 'doctor');
    data.append("page_count", page);

    // console.log("data", data);
    apifuntion
      .postApi(url, data, 1)
      .then(async (obj) => {
        // console.log("getAppointments-response...", obj);
        // return
        if (obj.status == true) {
          checkVideoCallStatus(obj)
        } else {
          if (appointments.length > 0) {
            setAppointments([...appointments])
          } else {
            setAppointments([])
          }
          return false;
        }
      }).catch((error) => {
        setAppointments([])
        console.log("getAppointments-error ------- " + error);
      }).finally(() => {
        setIsRefreshing(false)
        setIsLoading(false)
        setLoadMore(false)
        setDummy([])
      })
  };



  return (
    //
    <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>

      <FlatList
        initialNumToRender={6}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: appointments.length > 6 ? vs(125) : 100 }}
        data={isLoading ? dummy : appointments}
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
        ListFooterComponent={() => {
          if (loadMore) {
            return (
              <View style={{ paddingVertical: (windowWidth * 5) / 100 }}>
                <SkypeIndicator color={Colors.Theme} size={25} />
              </View>
            )
          }
          return null
        }}
        refreshing={isRefreshing}
        onRefresh={() => {
          if (!isLoading) {
            setPageCount(1)
            setIsLoading(true)
            setIsRefreshing(true)
            setDummy([1, 2, 3, 4, 5, 6, 7])
          }
        }}
        onEndReachedThreshold={0.1}
        onMomentumScrollBegin={() => { onEndReachedCalledDuringMomentum = false; }}
        onEndReached={val => {
          if (!onEndReachedCalledDuringMomentum) {
            console.log('onEndReached');
            setLoadMore(true)
            let newPage = pageCount + 1
            setPageCount(newPage)
            getAppointments(newPage)
            onEndReachedCalledDuringMomentum = true;
          }

        }}
      />

      <NoInternet
        visible={!deviceConnection}
      />

    </View>
  );
}

export default Upcoming;