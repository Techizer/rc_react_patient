import React from "react";
import { Platform, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DrawerActions } from '@react-navigation/native';


import TabItem from '../../components/TabItem'
import EditProfile from "../../screens/EditProfile";
import Home from "../../screens/Home";
import Appointment from "../../screens/Appointment";
import Cart from "../../screens/Cart";
import Profile from "../../screens/Profile";
import DoctorConsultations from '../../screens/DoctorConsultations';
import LabTests from '../../screens/LabTests';
import AllServiceProviderListing from "../../screens/AllServiceProviderListing";
import Booking from "../../screens/Booking";

import Drawerscreen from "../../Drawerscreen";
import Cart2 from "../../Cart2";

import Office_address from "../../Office_address";
import Show_currentlocation from "../../Show_currentlocation";
import App_payment from "../../App_payment";

import AddPatient from "../../screens/AddPatient";
import ShowOtherAppointments from "../../screens/ShowOtherAppointments";
import AppointmentDetails from "../../screens/AppointmentDetails";
import ServiceProviderDetails from "../../screens/ServiceProviderDetails";
import VideoCall from "../../screens/VideoCall";
import LabPackageListing from "../../screens/LabPackageListing";
import LabPackageDetails from "../../screens/LabPackageDetails";
import TermsAndConditions from "../../screens/TermsAndConditions";
import CovidPackageDetails from "../../screens/CovidPackageDetails";
import ForgotPage from "../../screens/ForgotPage";
import NeedSupport from "../../screens/NeedSupport";
import Notifications from "../../screens/Notifications";
import ForgotOTP from "../../screens/ForgotOTP";
import { Colors } from "../Colorsfont";
import { Icons } from "../Localimage";
import { Lang_chg } from "../Language_provider";
import { config } from "../configProvider";
import { vs } from "react-native-size-matters";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function ProfileDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: { width: "100%", backgroundColor: Colors.white },
        drawerType: "front",
      }}
      drawerContent={(props) => <Drawerscreen {...props} />}
    >
      <Drawer.Screen
        name="ProfileDrawer"
        options={{
          headerShown: false,
        }}

        component={Profile}
      />
    </Drawer.Navigator>
  );
}

function HomeDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: { width: "100%", backgroundColor: Colors.white },
        drawerType: "front",
      }}
      drawerContent={(props) => <Drawerscreen {...props} />}
    >
      <Drawer.Screen
        name="HomeDrawer"
        options={{
          headerShown: false,
        }}
        component={Home}
      />
    </Drawer.Navigator>
  );
}

const DashboardStack = ({ navigation }) => {

  return (
    <Tab.Navigator
      sceneContainerStyle={{
        backgroundColor: Colors.whitebackgroundcolor
      }}
      initialRouteName={'Home'}
      activeColor="#fff"
      screenOptions={{
        tabBarStyle: { position: 'absolute' },
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        // style: {
        //   position: 'absolute',
        //   backgroundColor: Colors.Black,
        //   height: 150,
        //   shadowColor: Colors.Black,
        //   shadowOffset: { width: 0, height: 15 },
        //   shadowOpacity: 1,
        //   shadowRadius: 6,  
        //   elevation: 10,
        //   borderTopColor:'#222',
        //   borderTopWidth:1,
        //   borderWidth:1,
        //   borderColor:'#222',
        // },

        // tabBarBackground: () =>
        // (<View style={{
        //   height: 100,
        //   backgroundColor: 'pink',
        //   shadowOffset: { width: 1, height: 1 },
        //   shadowColor: Colors.Black,
        //   shadowRadius: 6
        // }}
        // />)

      }}

      tabBar={(props) => {
        const { navigation, state } = props
        return (

          <View style={{
            flexDirection: "row",
            height: Platform.OS === 'ios' ? vs(75) : vs(65),
            width: "100%",
            elevation: 8,
            position: 'absolute',
            bottom: 0,
            backgroundColor: Colors.white,
            borderTopWidth:1,
            borderTopColor:Colors.Border
          }}>

            <TabItem
              reset
              index={0}
              activeIndex={state.index}
              navigation={navigation}
              path={'Home'}
              title={Lang_chg.Home[config.language]} />

            <TabItem
              reset
              index={1}
              activeIndex={state.index}
              navigation={navigation}
              path={'Apointment'}
              title={Lang_chg.Appointment[config.language]} />

            <TabItem
              reset
              index={2}
              activeIndex={state.index}
              navigation={navigation}
              path={'Consultation'}
              title={Lang_chg.Consultation[config.language]} />

            <TabItem
              reset
              index={3}
              activeIndex={state.index}
              navigation={navigation}
              path={'LabTest'}
              title={Lang_chg.Lab_Test[config.language]} />

            <TabItem
              reset
              index={4}
              activeIndex={state.index}
              navigation={navigation}
              path={'Profile'}
              title={Lang_chg.Profile[config.language]} />


          </View>
        )
      }}

    >

      <Tab.Screen
        name={'Home'}
        component={HomeDrawer}
      />
      <Tab.Screen
        name={'Apointment'}
        component={Appointment}
      />
      <Tab.Screen
        name={'Consultation'}
        component={DoctorConsultations}
      />
      <Tab.Screen
        name={'LabTest'}
        component={LabTests}
      />
      <Tab.Screen
        name={'Profile'}
        component={ProfileDrawer}
      />

    </Tab.Navigator>


  )
}
// const Stacknav = (navigation) => {
//   return (
//     <Stack.Navigator initialRouteName={"Splash"}>

//       <Stack.Screen
//         name="AppointmentDetails"
//         component={AppointmentDetails}
//         options={{ headerShown: false, gestureEnabled: false }}
//       />
//       <Stack.Screen
//         name="Cart2"
//         component={Cart2}
//         options={{ headerShown: false, gestureEnabled: false }}
//       />
//       <Stack.Screen
//         name="NeedSupport"
//         component={NeedSupport}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="Notifications"
//         component={Notifications}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="AddPatient"
//         component={AddPatient}
//         options={{ headerShown: false }}
//       />




//       <Stack.Screen
//         name="Show_currentlocation"
//         component={Show_currentlocation}
//         options={{ headerShown: false, gestureEnabled: false }}
//       />
//       {/* <Stack.Screen
//         name="Splash"
//         component={Splash}
//         options={{ headerShown: false, gestureEnabled: false }}
//       /> */}


//       <Stack.Screen
//         name="EditProfile"
//         component={EditProfile}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="Office_address"
//         component={Office_address}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="Home"
//         component={Mydrawer}
//         options={{ headerShown: false, gestureEnabled: false }}
//       />
//       <Stack.Screen
//         name="Appointment"
//         component={Appointment}
//         options={{ headerShown: false, gestureEnabled: false }}
//       />
//       <Stack.Screen
//         name="Cart"
//         component={Cart}
//         options={{ headerShown: false, gestureEnabled: false }}
//       />

//       <Stack.Screen
//         name="AllServiceProviderListing"
//         component={AllServiceProviderListing}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="Booking"
//         component={Booking}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="ServiceProviderDetails"
//         component={ServiceProviderDetails}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="ForgotOTP"
//         component={ForgotOTP}
//         options={{ headerShown: false, gestureEnabled: false }}
//       />
//       <Stack.Screen
//         name="ShowOtherAppointments"
//         component={ShowOtherAppointments}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="App_payment"
//         component={App_payment}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="VideoCall"
//         component={VideoCall}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="LabPackageListing"
//         component={LabPackageListing}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="LabPackageDetails"
//         component={LabPackageDetails}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="CovidPackageDetails"
//         component={CovidPackageDetails}
//         options={{ headerShown: false }}
//       />
//     </Stack.Navigator>
//   );
// };
export default DashboardStack;
