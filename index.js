/**
 * @format
 */
import React, { Component, useEffect } from "react";
import { AppRegistry, LogBox, Platform } from 'react-native';
import messaging from "@react-native-firebase/messaging";
import * as Sentry from "@sentry/react-native";
import { Tabby } from 'tabby-react-native-sdk'
// import { Settings } from 'react-native-fbsdk-next';

import App from './App';
import { name as appName } from './app.json';
import { PersistGate } from 'redux-persist/lib/integration/react'
import { Provider, useDispatch } from "react-redux";
import { store, persistor } from './src/Redux/Index'
import FlashMessage from "react-native-flash-message";
import { Font } from './src/Provider/Colorsfont';
import { config, StatusbarHeight, windowWidth } from './src/Provider/Utils/Utils';

// Sentry.init({
//     dsn: "https://1c13f9143d964a7b9615a947ac616d4f@o4504395052482560.ingest.sentry.io/4504592054091776",
//     // enableNative: false,
//     tracesSampleRate: 1.0,
//     integrations: [
//         new Sentry.ReactNativeTracing({
//             tracingOrigins: ["localhost", config.baseURL, /^\//],
//         }),
//     ],
// });
Tabby.setApiKey('pk_test_aa6a4bab-8837-4017-a513-98235fe49e4c')
// Settings.setAppID('386042973026214');

export default function Main() {

    useEffect(() => {
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('setBackgroundMessageHandler', remoteMessage);
        });
    }, [])
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor} >
                <App />
            </PersistGate>
            <FlashMessage
                hideStatusBar={Platform.OS === 'ios' ? true : false}
                textStyle={{
                    fontSize: Font.xsmall,
                    fontFamily: Font.Regular,
                    // marginTop: Platform.OS === 'ios' ? ((windowWidth * 10) / 100) : StatusbarHeight + 20,
                }}
                titleStyle={{
                    fontSize: Font.xsmall,
                    fontFamily: Font.Medium,
                    alignSelf: 'flex-start'
                }}
                position="top"
                animated={true}
                style={{
                    height: 80,
                    paddingTop: Platform.OS === 'ios' ? 0 : StatusbarHeight + 5,
                }}
            />
        </Provider>
    );
};


// AppRegistry.registerComponent(appName, () => Sentry.wrap(Main));
AppRegistry.registerComponent(appName, () => Main);

LogBox.ignoreAllLogs(true)
