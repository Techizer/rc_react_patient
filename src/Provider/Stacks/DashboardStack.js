import React, { useEffect } from "react";
import { Platform, View, BackHandler, Alert } from "react-native";
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

  const { loggedInUserDetails, appLanguage, languageIndex } = useSelector(state => state.StorageReducer)
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
          if (obj.result != null && obj.result.length > 0 && obj.result.length > 1) {
            console.log('m,m,m,m,m,m,,m,m,m,m,m,m,m,');
            dispatch(TodaysAppointments(obj?.result.length))
          } else {
            dispatch(TodaysAppointments(0))
          }
        } else {
          dispatch(TodaysAppointments(0))
          return false;
        }
      }).catch((error) => {
        dispatch(TodaysAppointments(0))
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
          if (obj.result != null && obj.result.length > 0 && obj.result.length > 1) {
            dispatch(TodaysConsultations(obj?.result.length))
          } else {
            dispatch(TodaysConsultations(0))
          }
        } else {
          dispatch(TodaysConsultations(0))
          return false;
        }
      }).catch((error) => {
        dispatch(TodaysConsultations(0))
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
          if (obj.result != null && obj.result.length > 0 && obj.result.length > 1) {
            dispatch(TodaysLabTests(obj?.result.length))
          } else {
            dispatch(TodaysLabTests(0))
          }
        } else {
          dispatch(TodaysLabTests(0))
          return false;
        }
      }).catch((error) => {
        dispatch(TodaysLabTests(0))
        console.log("getTests-error ------- " + error);
      });
  };

  const handleBackPress = (index, type = 'add', isDone = false) => {
    console.log({ index });
    if (type === 'add') {
      if (!navigation.canGoBack() && index === 0) {
        console.log('handleBackPress');
        Alert.alert(
          LangProvider.titleexitapp[languageIndex],
          LangProvider.exitappmessage[languageIndex],
          [
            {
              text: LangProvider.no_txt[languageIndex],
              onPress: () => console.log("Cancel Pressed"),
              style: LangProvider.no_txt[languageIndex],
            },
            {
              text: LangProvider.yes_txt[languageIndex],
              onPress: () => BackHandler.exitApp(),
            },
          ],
          {
            cancelable: false,
          }
        )
        return true;
      } else {
        navigation.goBack()
        return true;
      }
    } else {
      if (isDone) {
        return true
      } else {
        BackHandler.removeEventListener('hardwareBackPress', () => {
          return handleBackPress(0, 'remove', true)
        })
      }

    }

  };

  // useEffect(() => {
  //   navigation.addListener('blur', payload => {
  //     console.log('event is removed...');
  //     return BackHandler.removeEventListener('hardwareBackPress', () => {
  //       return handleBackPress(0)
  //     })
  //   }
  //   );
  // }, [])

  useEffect(() => {
    if (loggedInUserDetails != null) {
      getAppointments()
      getConsultations()
      getTests()
    }
  }, [])

  return (
    <Tab.Navigator
      screenListeners={{
        state: (s) => {
          // console.log('tab listner...', s.data.state.index);
          if (s.data.state.index == 0 && !navigation.canGoBack()) {
            BackHandler.addEventListener('hardwareBackPress', (st) => {
              // console.log('inner indexe...', s.data.state.index);
              return handleBackPress(s.data.state.index, 'add', true)
            })
          } else {
            // console.log('should remove;;;;;');
            handleBackPress(s.data.state.index, 'remove', false)
            // BackHandler.removeEventListener('hardwareBackPress', () => {
            //   return handleBackPress(0, 'remove', false)
            // })
          }
        }
      }}
      backBehavior='firstRoute'
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
