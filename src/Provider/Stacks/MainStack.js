import React, { useEffect } from 'react'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';

import Splash from '../../screens/Splash';
import AuthStack from './AuthStack';
import DashboardStack from './DashboardStack';
import VideoCall from '../../screens/VideoCall';
import Show_currentlocation from '../../Show_currentlocation';
import Notifications from '../../screens/Notifications';
import CovidPackageDetails from '../../screens/CovidPackageDetails';
import AllServiceProviderListing from '../../screens/AllServiceProviderListing';
import SupportandMore from '../../screens/SupportandMore';
import EditProfile from '../../screens/EditProfile';
import Office_address from '../../Office_address';
import Booking from '../../screens/Booking';
import ServiceProviderDetails from '../../screens/ServiceProviderDetails';
// -----------------------------------------
import { Colors } from '../Colorsfont';

const Stack = createStackNavigator()

const MainStack = () => {

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    gestureEnabled: false,
                    gestureDirection: 'horizontal',
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                }} initialRouteName={'Splash'}>

                <Stack.Screen
                    name={'Splash'}
                    component={Splash} />

                <Stack.Screen
                    name={'AuthStack'}
                    component={AuthStack} />

                <Stack.Screen
                    name={'DashboardStack'}
                    component={DashboardStack} />

                <Stack.Screen
                    name="VideoCall"
                    component={VideoCall}
                />

                <Stack.Screen
                    name="Show_currentlocation"
                    component={Show_currentlocation}
                />

                <Stack.Screen
                    name="Notifications"
                    component={Notifications}
                />

                <Stack.Screen
                    name="CovidPackageDetails"
                    component={CovidPackageDetails}
                />

                <Stack.Screen
                    name="AllServiceProviderListing"
                    component={AllServiceProviderListing}
                />
                <Stack.Screen
                    name="SupportandMore"
                    component={SupportandMore}
                />

                <Stack.Screen
                    name="EditProfile"
                    component={EditProfile}
                />
                <Stack.Screen
                    name="Address"
                    component={Office_address}
                />

                <Stack.Screen
                    name="Booking"
                    component={Booking}
                />

                <Stack.Screen
                    name="ServiceProviderDetails"
                    component={ServiceProviderDetails}
                />

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MainStack;