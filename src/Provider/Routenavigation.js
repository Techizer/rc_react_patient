import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Splash from "../screens/Splash";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import OTPPage from "../screens/OTPPage";
import EditProfile from "../screens/EditProfile";
import Home from "../screens/Home";
import Appointment from "../screens/Appointment";
import Cart from "../screens/Cart";
import More from "../screens/More";
import AllServiceProviderListing from "../screens/AllServiceProviderListing";
import Booking from "../screens/Booking";

import Drawerscreen from "../Drawerscreen";
import Cart2 from "../Cart2";

import Office_address from "../Office_address";
import Show_currentlocation from "../Show_currentlocation";
import App_payment from "../App_payment";

import AddPatient from "../screens/AddPatient";
import ShowOtherAppointments from "../screens/ShowOtherAppointments";
import AppointmentDetails from "../screens/AppointmentDetails";
import ServiceProviderDetails from "../screens/ServiceProviderDetails";
import VideoCall from "../screens/VideoCall";
import LabPackageListing from "../screens/LabPackageListing";
import LabPackageDetails from "../screens/LabPackageDetails";
import TermsAndConditions from "../screens/TermsAndConditions";
import CovidPackageDetails from "../screens/CovidPackageDetails";
import ForgotPage from "../screens/ForgotPage";
import NeedSupport from "../screens/NeedSupport";
import Notifications from "../screens/Notifications";
import ForgotOTP from "../screens/ForgotOTP";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function Mydrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: { width: "85%" },
        drawerType: "front",
      }}
      drawerContent={(props) => <Drawerscreen {...props} />}
    >
      <Drawer.Screen
        name="Home"
        options={{
          headerShown: false,
        }}
        component={Home}
      />
    </Drawer.Navigator>
  );
}
const Stacknav = (navigation) => {
  return (
    <Stack.Navigator initialRouteName={"Splash"}>
      {/* 3 march radhekrishan */}

      <Stack.Screen
        name="AppointmentDetails"
        component={AppointmentDetails}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      {/* //2march radhekrishan */}
      <Stack.Screen
        name="Cart2"
        component={Cart2}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="NeedSupport"
        component={NeedSupport}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddPatient"
        component={AddPatient}
        options={{ headerShown: false }}
      />

      {/* */}

      <Stack.Screen
        name="ForgotPage"
        component={ForgotPage}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="TermsAndConditions"
        component={TermsAndConditions}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="Show_currentlocation"
        component={Show_currentlocation}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="OTPPage"
        component={OTPPage}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Office_address"
        component={Office_address}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={Mydrawer}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="Appointment"
        component={Appointment}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="More"
        component={More}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="AllServiceProviderListing"
        component={AllServiceProviderListing}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Booking"
        component={Booking}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ServiceProviderDetails"
        component={ServiceProviderDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotOTP"
        component={ForgotOTP}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="ShowOtherAppointments"
        component={ShowOtherAppointments}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="App_payment"
        component={App_payment}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VideoCall"
        component={VideoCall}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LabPackageListing"
        component={LabPackageListing}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LabPackageDetails"
        component={LabPackageDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CovidPackageDetails"
        component={CovidPackageDetails}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
export default Stacknav;
