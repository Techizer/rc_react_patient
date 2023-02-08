import React, { Component, useEffect } from "react";
import { I18nManager, Platform, StatusBar, AppState } from "react-native";

// import { Settings } from 'react-native-fbsdk-next';
import * as Sentry from "@sentry/react-native";
import { Tabby } from 'tabby-react-native-sdk'
import MainStack from "./src/Provider/Stacks/MainStack";

import RNRestart from "react-native-restart";
import { useDispatch, useSelector } from "react-redux";
import { AppLanguage, ContentAlign, LanguageIndex, Restart } from "./src/Redux/Actions";

Tabby.setApiKey('pk_test_aa6a4bab-8837-4017-a513-98235fe49e4c')
console.reportErrorsAsExceptions = false;

// Sentry.init({
//   dsn: "https://1c13f9143d964a7b9615a947ac616d4f@o4504395052482560.ingest.sentry.io/4504592054091776",
//   // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
//   // We recommend adjusting this value in production.
//   tracesSampleRate: 1.0,
// });

// Settings.setAppID('386042973026214');
const App = () => {
  const { appLanguage, restart } = useSelector(state => state.StorageReducer)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(Restart(false))
    language_set()
  }, [appLanguage])

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
      <MainStack />
  );
}

// throw new Error("My first Sentry error!");
export default App;
// export default Sentry.wrap(App);