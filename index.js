/**
 * @format
 */
import React, { Component } from "react";
import { AppRegistry, LogBox, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { PersistGate } from 'redux-persist/lib/integration/react'
import { Provider, useDispatch } from "react-redux";
import { store, persistor } from './src/Redux/Index'
import FlashMessage from "react-native-flash-message";
import { Font } from './src/Provider/Colorsfont';
import { StatusbarHeight, windowWidth } from './src/Provider/Utils/Utils';


export default function Main() {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor} >
                <App />
            </PersistGate>
            <FlashMessage
                hideStatusBar={Platform.OS === 'ios' ? true : false}
                textStyle={{ fontSize: Font.medium, fontFamily: Font.Regular, }}
                titleStyle={{
                    marginTop: Platform.OS === 'ios' ? ((windowWidth * 10) / 100) : StatusbarHeight + 20,
                    fontSize: Font.medium,
                    fontFamily: Font.Medium,
                    alignSelf:'flex-start'
                }}
                position="top"
                animated={true}

            />
        </Provider>
    );
};

AppRegistry.registerComponent(appName, () => Main);

LogBox.ignoreAllLogs(true)
