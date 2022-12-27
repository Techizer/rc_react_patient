import React, { useEffect } from "react";
import { Platform, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DrawerActions } from '@react-navigation/native';


import TabItem from '../../components/TabItem'
import Home from "../../screens/Home";
import AppointmentIndex from '../../screens/Appointments/Index'
import ConsultIndex from "../../screens/Consultations/Index";
import Profile from "../../screens/Profile";
import LabTestIndex from "../../screens/LabTests/Index";

import Drawerscreen from "../../components/Drawerscreen";


import App_payment from "../../App_payment";



import { Colors } from "../Colorsfont";
import { Lang_chg } from "../Language_provider";
import { config } from "../configProvider";
import { vs } from "react-native-size-matters";
import { localStorage } from "../localStorageProvider";
import { apifuntion } from "../Apicallingprovider/apiProvider";
import { consolepro } from "../Messageconsolevalidationprovider/Consoleprovider";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
let appoinmentList = []
let consultList = []
let labList = []
let isGuest = ''

function ProfileDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: { width: "100%", backgroundColor: Colors.White },
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
        drawerStyle: { width: "100%", backgroundColor: Colors.White },
        drawerType: "front",
        headerShown: false,
      }}
      drawerContent={(props) => <Drawerscreen {...props} />}
    >
      <Drawer.Screen
        name="HomeDrawer"
        component={Home}
      />

      {/* <Drawer.Screen
        options={{
          swipeEnabled: false
        }}
        name="AllServiceProviderListing"
        component={AllServiceProviderListing}
      /> */}
    </Drawer.Navigator>
  );
}

const getAppointments = async () => {
  let user_details = await localStorage.getItemObject("user_arr");
  let user_id = user_details["user_id"];

  let url = config.baseURL + "api-patient-today-appointment";

  var data = new FormData();
  data.append("lgoin_user_id", user_id);
  data.append("service_type", 'all');
  data.append("page_count", 1);

  // consolepro.consolelog("data", data);
  apifuntion
    .postApi(url, data, 1)
    .then((obj) => {
      // consolepro.consolelog("getAppointments-response...", obj);
      if (obj.status == true) {
        appoinmentList = obj.result
      } else {
        appoinmentList = []
        return false;
      }
    }).catch((error) => {
      consolepro.consolelog("getAppointments-error ------- " + error);
    });
};

const getConsultations = async () => {
  let user_details = await localStorage.getItemObject("user_arr");
  let user_id = user_details["user_id"];

  let url = config.baseURL + "api-patient-today-appointment";

  var data = new FormData();
  data.append("lgoin_user_id", user_id);
  data.append("service_type", 'doctor');
  data.append("page_count", 1);

  apifuntion
    .postApi(url, data, 1)
    .then((obj) => {
      // consolepro.consolelog("getConsultations-response...", obj);
      if (obj.status == true) {
        consultList = obj.result
      } else {
        consultList = []
        return false;
      }
    }).catch((error) => {
      consolepro.consolelog("getConsultations-error ------- " + error);
    });
};

const getTests = async () => {
  let user_details = await localStorage.getItemObject("user_arr");
  let user_id = user_details["user_id"];

  let url = config.baseURL + "api-patient-today-appointment";

  var data = new FormData();
  data.append("lgoin_user_id", user_id);
  data.append("service_type", 'lab');
  data.append("page_count", 1);

  apifuntion
    .postApi(url, data, 1)
    .then((obj) => {
      // consolepro.consolelog("getTests-response...", obj);
      if (obj.status == true) {
        labList = obj.result
      } else {
        labList = []
        return false;
      }
    }).catch((error) => {
      consolepro.consolelog("getTests-error ------- " + error);
    });
};

const checkUserType = async () => {
  isGuest = await localStorage.getItemString('Guest')
}


const DashboardStack = ({ navigation }) => {

  useEffect(() => {
    getAppointments()
    getConsultations()
    getTests()
    checkUserType()
  }, [])

  return (
    <Tab.Navigator
      sceneContainerStyle={{
        backgroundColor: Colors.White
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
            backgroundColor: Colors.White,
            borderTopWidth: 1,
            borderTopColor: Colors.Border
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
        component={AppointmentIndex}
        initialParams={{ todaysLength: appoinmentList.length, isGuest: isGuest }}
      />

      <Tab.Screen
        name={'Consultation'}
        component={ConsultIndex}
        initialParams={{ todaysLength: consultList.length, isGuest: isGuest }}
      />
      <Tab.Screen
        name={'LabTest'}
        component={LabTestIndex}
        initialParams={{ todaysLength: labList.length, isGuest: isGuest }}
      />
      <Tab.Screen
        name={'Profile'}
        component={ProfileDrawer}
        initialParams={{ isGuest: isGuest }}
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
