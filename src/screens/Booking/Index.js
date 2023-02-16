import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { Component, useEffect, useState } from "react";
import {
  Colors,
  Font,
  windowWidth,
  LangProvider,
} from "../../Provider/Utils/Utils";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useSelector } from "react-redux";
import TaskBase from "./Others/TaskBase";
import TestBase from "./Labs/TestBase";
import Hourly from "./Others/Hourly";
import Online from "./Doctors/Online";
import HomeVisit from "./Doctors/HomeVisit";
import { vs, s } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PackageBase from "./Labs/PackageBase";

const BookingIndex = ({ navigation, route }) => {

  const styles = StyleSheet.create({

    infoContainer: {
      paddingVertical: vs(11),
      backgroundColor: Colors.White,
      marginTop: vs(7),
      zIndex: 999
    },
    experienceContainer: {
      width: '100%',
      paddingVertical: vs(18),
      flexDirection: 'row',
      paddingHorizontal: s(11),
    },
    descContainer: {
      borderBottomWidth: 1.5,
      borderTopWidth: 1.5,
      borderBottomColor: Colors.backgroundcolor,
      borderTopColor: Colors.backgroundcolor,
      paddingTop: vs(11),
      paddingBottom: vs(15),
      paddingHorizontal: s(11),
    },
  });
  const { languageIndex, appLanguage, selectedProvider } = useSelector(state => state.StorageReducer)

  const [statesData, setStatesData] = useState({
    details: null,
    errorModal: false
  })
  const insets = useSafeAreaInsets()
  const setState = payload => {
    setStatesData(prev => ({
      ...prev,
      ...payload
    }))
  }

  useEffect(() => {
    // console.log({ selectedProvider });
  }, [])


  return (
    <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor, }}>

      <ScreenHeader
        title={
          ((selectedProvider && selectedProvider.providerType == 'nurse' && selectedProvider.bookingType == 'task') || selectedProvider.providerType == 'physiotherapy') ?
            LangProvider.TaskBaseTitle[languageIndex]
            :
            ((selectedProvider && selectedProvider.providerType == 'nurse' && selectedProvider.bookingType == 'hour') || selectedProvider.providerType == 'caregiver' || selectedProvider.providerType == 'babysitter') ?
              LangProvider.HourBaseTitle[languageIndex]
              :
              (selectedProvider && selectedProvider.providerType == 'doctor' && selectedProvider.docType == 'ONLINE_CONSULT') ?
                LangProvider.OnlineConsultation[languageIndex]
                :
                (selectedProvider && selectedProvider.providerType == 'doctor' && selectedProvider.docType == 'HOME_VISIT_CONSULT') ?
                  LangProvider.HomeVisitConsultation[languageIndex]
                  :
                  (selectedProvider && selectedProvider.providerType == 'lab' && selectedProvider.bookingType == 'test') ?
                    LangProvider.Lab_Test_Booking[languageIndex]
                    :
                    LangProvider.Lab_Package_Booking[languageIndex]
        }
        navigation={navigation}
        onBackPress={() => navigation.pop()}
        leftIcon
      />

      {/* <ScrollView contentContainerStyle={{ flex: 0.8 }}> */}


      {
        ((selectedProvider.providerType == 'nurse' && selectedProvider.bookingType == 'task') || selectedProvider.providerType == 'physiotherapy') ?

          <TaskBase navigation={navigation} route={route} />
          :

          ((selectedProvider.providerType == 'nurse' && selectedProvider.bookingType == 'hour') || selectedProvider.providerType == 'caregiver' || selectedProvider.providerType == 'babysitter') ?
            <Hourly navigation={navigation} route={route} />
            :
            (selectedProvider.providerType == 'doctor' && selectedProvider.docType == 'ONLINE_CONSULT') ?
              <Online navigation={navigation} route={route} />
              :
              (selectedProvider.providerType == 'doctor' && selectedProvider.docType == 'HOME_VISIT_CONSULT') ?

                <HomeVisit navigation={navigation} route={route} />
                :
                (selectedProvider.providerType == 'lab' && selectedProvider.bookingType == 'test') ?
                  <TestBase navigation={navigation} route={route} />
                  :
                  <PackageBase navigation={navigation} route={route} />
      }

      {/* </ScrollView> */}


    </View>
  );

}

export default BookingIndex;