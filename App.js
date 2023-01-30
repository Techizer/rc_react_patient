import React, { Component, useEffect } from "react";
import { I18nManager, Platform, StatusBar } from "react-native";
import { Tabby } from 'tabby-react-native-sdk'
import MainStack from "./src/Provider/Stacks/MainStack";

import RNRestart from "react-native-restart";
import { useDispatch, useSelector } from "react-redux";
import { AppLanguage, ContentAlign, LanguageIndex, Restart } from "./src/Redux/Actions";

Tabby.setApiKey('pk_test_aa6a4bab-8837-4017-a513-98235fe49e4c')
console.reportErrorsAsExceptions = false;
const App = () => {

  const { appLanguage, restart } = useSelector(state => state.StorageReducer)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(Restart(false))
    setTimeout(() => {
      language_set()
    }, 250);
  }, [appLanguage])

  const language_set = async () => {
    console.log('setting layout direction.......');
    console.log({ restart });
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
      dispatch(AppLanguage('en'))
      dispatch(LanguageIndex(0))
      dispatch(ContentAlign('left'))



    } else {
      dispatch(ContentAlign('right'))
      dispatch(LanguageIndex(1))
    }

    // if (languagecathc == 0) {
    //   if (languagesetenglish == 3) {
    //     if (I18nManager.isRTL) {
    //       console.log("HI Vikas");
    //       I18nManager.forceRTL(false);
    //       I18nManager.allowRTL(false);
    //     } else {
    //       I18nManager.forceRTL(false);
    //       I18nManager.allowRTL(false);
    //     }
    //     localStorage.removeItem("languagecathc");
    //     localStorage.setItemObject("language", 0);
    //     localStorage.removeItem("languagesetenglish");
    //     RNRestart.Restart();
    //   }
    //   localStorage.setItemObject("languagesetenglish", 3);
    // }
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


export default App;
