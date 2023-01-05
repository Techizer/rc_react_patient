import React, { Component } from "react";
import { I18nManager, Platform, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { AppProvider, AppConsumer } from "./src/Provider/context/AppProvider";
import MainStack from "./src/Provider/Stacks/MainStack";
import { firebapushnotification } from "./src/firbase_pushnotification";
import {
  Font,
  localStorage,
  StatusbarHeight,
  windowWidth,
} from "./src/Provider/utilslib/Utils";
import FlashMessage from "react-native-flash-message";
global.MapAddress = "NA";
global.screens = "Splash";
global.fcmtoken = "123456";
global.isLogin = true;
global.isPage = ""
import RNRestart from "react-native-restart";
console.reportErrorsAsExceptions = false;

class App extends Component {
  constructor(props) {
    super(props);
    this.language_set();
  }
  componentDidMount() {
    firebapushnotification.requestUserPermission();
    // firebapushnotification.NotificationsListener();
  }
  language_set = async () => {
    let languagecathc = await localStorage.getItemObject("languagecathc");
    let languagesetenglish = await localStorage.getItemObject(
      "languagesetenglish"
    );
    if (languagecathc == 0) {
      if (languagesetenglish == 3) {
        if (I18nManager.isRTL) {
          console.log("Right To Left");
          I18nManager.forceRTL(false);
          I18nManager.allowRTL(false);
        } else {
          I18nManager.forceRTL(false);
          I18nManager.allowRTL(false);
        }
        localStorage.removeItem("languagecathc");
        localStorage.setItemObject("language", 0);
        localStorage.removeItem("languagesetenglish");
        RNRestart.Restart();
      }
      localStorage.setItemObject("languagesetenglish", 3);
    }
  };
  render() {
    ((Platform.OS === 'android') ? () => {
      StatusBar.setTranslucent(true)
      StatusBar.setBackgroundColor('transparent')
      StatusBar.setBarStyle('dark-content')
    } : () => { })()
    return (
      <AppProvider {...this.props}>
        <AppConsumer>
          {(funcs) => {
            global.props = { ...funcs };
            return <MainStack {...funcs} />;
          }}
        </AppConsumer>
        <FlashMessage
          hideStatusBar={Platform.OS === 'ios' ? true : false}
          textStyle={{ fontSize: Font.medium, fontFamily: Font.Regular }}
          titleStyle={{ 
            marginTop: Platform.OS === 'ios' ? ((windowWidth * 10) / 100) : StatusbarHeight+20,
           fontSize: Font.medium,
            fontFamily: Font.Medium 
          }}
          position="top"
          animated={true}

        />
      </AppProvider>
    );
  }
}

export default App;
