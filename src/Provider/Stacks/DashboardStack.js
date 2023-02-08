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

import { Colors } from "../Colorsfont";
import { LangProvider } from '../Utils/Utils';
import { config } from "../configProvider";
import { vs } from "react-native-size-matters";
import { apifuntion } from "../APIProvider";
import { useDispatch, useSelector } from "react-redux";
import { TodaysAppointments, TodaysConsultations, TodaysLabTests } from "../../Redux/Actions";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
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

    </Drawer.Navigator>
  );
}


const DashboardStack = ({ navigation }) => {

  const { loggedInUserDetails, appLanguage, } = useSelector(state => state.StorageReducer)
  const dispatch = useDispatch()

  const getAppointments = async () => {

    let url = config.baseURL + "api-patient-today-appointment";

    var data = new FormData();
    data.append("lgoin_user_id", loggedInUserDetails.user_id);
    data.append("service_type", 'all');
    data.append("page_count", 1);

    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        // console.log("getAppointments-response...", obj);
        if (obj.status == true) {
          dispatch(TodaysAppointments(obj?.result))
        } else {
          dispatch(TodaysAppointments([]))
          return false;
        }
      }).catch((error) => {
        console.log("getAppointments-error ------- " + error);
      });
  };

  const getConsultations = async () => {
    let url = config.baseURL + "api-patient-today-appointment";
    var data = new FormData();
    data.append("lgoin_user_id", loggedInUserDetails.user_id);
    data.append("service_type", 'doctor');
    data.append("page_count", 1);

    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        // console.log("getConsultations-response...", obj);
        if (obj.status == true) {
          dispatch(TodaysConsultations(obj?.result))
        } else {
          dispatch(TodaysConsultations([]))
          return false;
        }
      }).catch((error) => {
        console.log("getConsultations-error ------- " + error);
      });
  };

  const getTests = async () => {
    let url = config.baseURL + "api-patient-today-appointment";
    var data = new FormData();
    data.append("lgoin_user_id", loggedInUserDetails.user_id);
    data.append("service_type", 'lab');
    data.append("page_count", 1);

    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        // console.log("getTests-response...", obj);
        if (obj.status == true) {
          dispatch(TodaysLabTests(obj?.result))
        } else {
          dispatch(TodaysLabTests([]))
          return false;
        }
      }).catch((error) => {
        console.log("getTests-error ------- " + error);
      });
  };

  useEffect(() => {
    if (loggedInUserDetails != null) {
      getAppointments()
      getConsultations()
      getTests()
    }
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
              title={LangProvider.Home[appLanguage == 'en' ? 0 : 1]} />

            <TabItem
              reset
              index={1}
              activeIndex={state.index}
              navigation={navigation}
              path={'Apointment'}
              title={LangProvider.Appointment[appLanguage == 'en' ? 0 : 1]} />

            <TabItem
              reset
              index={2}
              activeIndex={state.index}
              navigation={navigation}
              path={'Consultation'}
              title={LangProvider.Consultation[appLanguage == 'en' ? 0 : 1]} />

            <TabItem
              reset
              index={3}
              activeIndex={state.index}
              navigation={navigation}
              path={'LabTest'}
              title={LangProvider.Lab_Test[appLanguage == 'en' ? 0 : 1]} />

            <TabItem
              reset
              index={4}
              activeIndex={state.index}
              navigation={navigation}
              path={'Profile'}
              title={LangProvider.Profile[appLanguage == 'en' ? 0 : 1]} />


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
      />

      <Tab.Screen
        name={'Consultation'}
        component={ConsultIndex}
      />
      <Tab.Screen
        name={'LabTest'}
        component={LabTestIndex}
      />
      <Tab.Screen
        name={'Profile'}
        component={ProfileDrawer}
      />

    </Tab.Navigator>


  )
}

export default DashboardStack;
