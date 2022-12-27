import React, { useEffect } from 'react'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';

import Splash from '../../screens/Splash';
import AuthStack from './AuthStack';
import DashboardStack from './DashboardStack';
import VideoCall from '../../screens/VideoCall';
import ManageAddress from '../../screens/ManageAddress';
import Notifications from '../../screens/Notifications';
import CovidPackageDetails from '../../screens/CovidPackageDetails';
import AllServiceProviderListing from '../../screens/AllServiceProviderListing';
import SupportandMore from '../../screens/SupportandMore';
import EditProfile from '../../screens/EditProfile/Index';
import FindAddress from '../../screens/FindAddress';
import Booking from '../../screens/Booking';
import ServiceProviderDetails from '../../screens/ServiceProviderDetails';
import LabPackageListing from '../../screens/LabPackageListing';
import LabPackageDetails from '../../screens/LabPackageDetails';
import TermsAndConditions from '../../screens/TermsAndConditions';
import NeedSupport from '../../screens/NeedSupport';
import HealthRecord from '../../screens/HealthRecord';
// -----------------------------------------
import { Colors } from '../Colorsfont';
import AddPatient from '../../screens/AddPatient';
import Cart from '../../screens/Cart';
import AppointmentDetails from '../../screens/AppointmentDetails';
import Orders from '../../screens/Orders';


let isGuest = '';

const Stack = createStackNavigator()

const MainStack = () => {

    const checkUserType = async () => {
        isGuest = await localStorage.getItemString('Guest')
    }

    useEffect(() => {
        checkUserType()
    }, [])

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
                    name="HealthRecord"
                    component={HealthRecord}
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
                    initialParams={{ isGuest: isGuest }}
                />

                <Stack.Screen
                    name="EditProfile"
                    component={EditProfile}
                />

                <Stack.Screen
                    name="ManageAddress"
                    component={ManageAddress}
                />

                <Stack.Screen
                    name="FindAddress"
                    component={FindAddress}
                />

                <Stack.Screen
                    name="Booking"
                    component={Booking}
                />

                <Stack.Screen
                    name="ServiceProviderDetails"
                    component={ServiceProviderDetails}
                />

                <Stack.Screen
                    name="LabPackageListing"
                    component={LabPackageListing}
                />

                <Stack.Screen
                    name="LabPackageDetails"
                    component={LabPackageDetails}
                />

                <Stack.Screen
                    name="Tremsandcondition"
                    component={TermsAndConditions}
                />

                <Stack.Screen
                    name="NeedSupport"
                    component={NeedSupport}
                />

                <Stack.Screen
                    name="AddPatient"
                    component={AddPatient}
                />

                <Stack.Screen
                    name="Cart"
                    component={Cart}
                />

                <Stack.Screen
                    name="AppointmentDetails"
                    component={AppointmentDetails}
                />

                <Stack.Screen
                    name="Orders"
                    component={Orders}
                />

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MainStack;