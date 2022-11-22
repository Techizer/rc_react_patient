/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

 import React, { Component } from 'react';
 import {I18nManager} from 'react-native';
 import { NavigationContainer } from '@react-navigation/native';
 import { AppProvider, AppConsumer } from './src/Provider/context/AppProvider';
 import Stacknav from './src/Provider/Routenavigation';

global.MapAddress='NA';


export default class App extends React.Component{
  // componentDidMount=()=>{
  //   firebaseprovider.getAllUsers()
  // }
  render() {
 
  return (
  <NavigationContainer >
      <AppProvider {...this.props}>
         <AppConsumer>{funcs => {
           global.props = { ...funcs }
           return <Stacknav {...funcs} />
         }}
       </AppConsumer>
     </AppProvider>
  </NavigationContainer>

  );
}
}

