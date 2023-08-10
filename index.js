/**
 * @format
 */
import React, { Component, useEffect } from "react";
import { AppRegistry, LogBox, Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import * as Sentry from "@sentry/react-native";
import { Tabby } from 'tabby-react-native-sdk'
// import { Settings } from 'react-native-fbsdk-next';

import App from './App';
import { name as appName } from './app.json';
import { PersistGate } from 'redux-persist/lib/integration/react'
import messaging from '@react-native-firebase/messaging';
import { Provider, useDispatch } from "react-redux";
import { store, persistor } from './src/Redux/Index'
import PushNotification from "react-native-push-notification";

Sentry.init({
    dsn: "https://1c13f9143d964a7b9615a947ac616d4f@o4504395052482560.ingest.sentry.io/4504592054091776",
    // enableNative: false,
    tracesSampleRate: 1.0,
    // integrations: [
    //     new Sentry.ReactNativeTracing({
    //         tracingOrigins: ["localhost", config.baseURL, /^\//],
    //     }),
    // ],
});
Tabby.setApiKey('pk_test_aa6a4bab-8837-4017-a513-98235fe49e4c')
// Tabby.setApiKey('pk_94369327-33a2-4a25-bdf3-cb04ad59be2f')
// Settings.setAppID('386042973026214');

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background!', remoteMessage);
    PushNotification.localNotification({
        channelId: "rootscares1",
        title: remoteMessage.data.title,
        message: remoteMessage.data.body,
        userInfo: remoteMessage.data,
        actions: remoteMessage.data?.type == "doctor_to_patient_video_call" ? '["Accept", "Reject"]' : [],
    });

});

export default function Main() {

    return (
        <Provider store={store}>
            <PersistGate persistor={persistor} >
                <App />
                <Toast />
            </PersistGate>

        </Provider>
    );
};


AppRegistry.registerComponent(appName, () => Sentry.wrap(Main));
// AppRegistry.registerComponent(appName, () => Main);

LogBox.ignoreAllLogs(true)

