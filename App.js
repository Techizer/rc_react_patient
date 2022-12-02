import React, { Component } from "react";
import { I18nManager } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { AppProvider, AppConsumer } from "./src/Provider/context/AppProvider";
import Stacknav from "./src/Provider/Routenavigation";
import { firebapushnotification } from "./src/firbase_pushnotification";
import {
  localStorage,
} from "./src/Provider/utilslib/Utils";
import FlashMessage from "react-native-flash-message";
global.MapAddress = "NA";
global.screens = "Splash";
global.fcmtoken = "123456";
global.isLogin = true;
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
          console.log("HI Vikas");
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
    //// I18nManager.forceRTL(false);
    // config.language = value;
  };
  render() {
    return (
        <NavigationContainer>
          <AppProvider {...this.props}>
            <AppConsumer>
              {(funcs) => {
                global.props = { ...funcs };
                return <Stacknav {...funcs} />;
              }}
            </AppConsumer>
            <FlashMessage
              // style={{
              //   marginTop: Platform.OS == "ios" ? 0 : StatusBar.currentHeight,
              // }}
              position="top"
              animated={true}
              // titleStyle={{
              //   fontFamily: Font.fontregular,
              //   fontSize: 20
              // }}
            />
          </AppProvider>
        </NavigationContainer>
    );
  }
}

export default App;
