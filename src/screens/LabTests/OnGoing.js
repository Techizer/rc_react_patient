
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

const OnGoing = (props) => {

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

  const PaginatedData = (data) => {
    let tempArr = []
    let newArr = data.result
    let lastIndex = null
    if (data.result && data.result.length > 0) {
      lastIndex = data.result[data.result.length - 1]
      newArr.pop()
      if (lastIndex.currentpage === 1) {
        setTotalPage(lastIndex.lastpage === 1)
        setAppointments(data.result)
      } else {
        tempArr = appointments
        tempArr.push(...data.result)
        setAppointments(tempArr)
      }

    }
  }

  const getAppointments = async (page) => {
    let url = config.baseURL + "api-patient-today-appointment";

    var data = new FormData();
    data.append("lgoin_user_id", loggedInUserDetails?.user_id);
    data.append("service_type", 'lab');
    data.append("page_count", page);

    // console.log("data", data);
    apifuntion
      .postApi(url, data, 1)
      .then(async (obj) => {
        // console.log("getAppointments-response...", obj);
        // return
        if (obj.status == true) {
          PaginatedData(obj)
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
              }}>{guest ? LangProvider.guestLabsTitle[languageIndex] : LangProvider.noLabTestsTitle[languageIndex]}</Text>
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
          if (!onEndReachedCalledDuringMomentum && !isLoading) {
            console.log('onEndReached');
            setLoadMore(true)
            let newPage = pageCount + 1
            setPageCount(newPage)
            getAppointments(newPage)
            onEndReachedCalledDuringMomentum = true;
          }

        }}
      />


    </View>
  );
}

export default OnGoing;