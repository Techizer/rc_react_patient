import React, { Component, useEffect } from "react";
import { I18nManager, Platform, StatusBar, AppState } from "react-native";
import NetInfo from '@react-native-community/netinfo'

import MainStack from "./src/Provider/Stacks/MainStack";

import RNRestart from "react-native-restart";
import { useDispatch, useSelector } from "react-redux";
import { AppLanguage, ContentAlign, DeviceConnection, LanguageIndex, Restart } from "./src/Redux/Actions";
import NoInternet from "./src/Components/NoInternet";

import * as Sentry from '@sentry/react-native';
import VideoCall from "./src/Components/VideoCall";

console.reportErrorsAsExceptions = false;

const App = () => {
  const { appLanguage, restart, deviceConnection, isVideoCall } = useSelector(state => state.StorageReducer)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(Restart(false))
    language_set()
  }, [appLanguage])

  useEffect(() => {
    NetInfo.fetch().then(state => {
      dispatch(DeviceConnection(state.isConnected))
    }).catch((err) => {
      console.log('GetConnectivityStatus-err', err);
    })
    const checkConnectivity = NetInfo.addEventListener(state => {
      // console.log("Connection type", state.type);
      // console.log("Is connected ? ", state.isConnected);
      if (state.isConnected == false) {
        dispatch(DeviceConnection(state.isConnected))
      }
    });
    return () => {
      checkConnectivity()
    }
  }, [])

  useEffect(() => {
    // appStateSubscription = AppState.addEventListener(
    //   "change",
    //   nextAppState => {
    //     console.log("nextAppState", nextAppState);
    //     setState({ appState: nextAppState });
    //     if (nextAppState == 'inactive' || nextAppState == 'background') {
    //       if (statesData.isPaymentInitiate == true) {
    //         startTime = '';
    //       }
    //     }
    //     if (nextAppState === "active") {
    //       var endTime = new Date();
    //       var difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds
    //       var resultInMinutes = Math.round(difference / 60000);
    //       console.log({ resultInMinutes });
    //       if (resultInMinutes >= 1) {
    //         remove_cart('auto')
    //       }
    //     }

    //   }
    // );

  }, [])

  const language_set = async () => {
    console.log('setting layout direction.......');
    // console.log({ restart });
    if (appLanguage == 'en') {
      if (I18nManager.isRTL) {
        console.log("Left To Right");
        if (restart == false) {
          I18nManager.forceRTL(false);
          I18nManager.allowRTL(false);
          dispatch(Restart(true))
          setTimeout(() => {
            RNRestart.Restart();
          }, 450);
        }

      } else {
        I18nManager.forceRTL(false);
        I18nManager.allowRTL(false);
      }
      dispatch(LanguageIndex(0))
      dispatch(ContentAlign('left'))
    } else {
      if (restart == false) {
        I18nManager.forceRTL(true);
        I18nManager.allowRTL(true);
        dispatch(Restart(true))
        setTimeout(() => {
          RNRestart.Restart();
        }, 450);
      }
      dispatch(ContentAlign('right'))
      dispatch(LanguageIndex(1))
    }
  }

  ((Platform.OS === 'android') ? () => {
    StatusBar.setTranslucent(true)
    StatusBar.setBackgroundColor('transparent')
    StatusBar.setBarStyle('dark-content')
  } : () => { })()
  return (
    restart == true ?
      null
      :
      <>
        <MainStack />
        {
          isVideoCall &&
          <VideoCall
            isVisible={isVideoCall}
          />
        }
        {/* <NoInternet
          visible={!deviceConnection}
        /> */}
      </>
  );
}

// throw new Error("My first Sentry error!");
export default App;
// export default Sentry.wrap(App);