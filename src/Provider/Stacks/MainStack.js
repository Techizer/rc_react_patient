import React, { useEffect, useMemo, useRef } from 'react'
import { Alert, AppState, Platform } from 'react-native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'
import { NavigationContainer, useNavigationContainerRef, } from '@react-navigation/native';
import messaging from "@react-native-firebase/messaging";
import PushNotification, { Importance } from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';

import Splash from '../../screens/Splash';
import AuthStack from './AuthStack';
import DashboardStack from './DashboardStack';
import ManageAddress from '../../screens/ManageAddress';
import Notifications from '../../screens/Notifications';
import CovidPackageDetails from '../../screens/CovidPackageDetails';
import AllServiceProviderListing from '../../screens/AllServiceProviderListing';
import SupportandMore from '../../screens/SupportandMore';
import EditProfile from '../../screens/EditProfile/Index';
import FindAddress from '../../screens/FindAddress';
import ServiceProviderDetails from '../../screens/ServiceProviderDetails';
import LabPackageListing from '../../screens/LabPackageListing';
import LabPackageDetails from '../../screens/LabPackageDetails';
import TermsAndConditions from '../../screens/TermsAndConditions';
import NeedSupport from '../../screens/NeedSupport';
import HealthRecord from '../../screens/HealthRecord';
import CartDetails from '../../screens/Cart'
import AppointmentDetails from '../../screens/AppointmentDetails';
import Orders from '../../screens/Orders';
import BookingIndex from '../../screens/Booking/Index';
import TabbyPayment from '../../screens/TabbyPayment';
import Chat from '../../screens/Chat';

import { CurrentRoute, DeviceConnection, onLogout, setAppState, setVideoCall, setVideoCallData, setVideoCallStatus } from '../../Redux/Actions';
import { config } from '../../Provider/configProvider';
import { apifuntion } from '../../Provider/APIProvider';
import { callRejectNotification, CheckSession, get_notification, Network } from '../../Provider/APIFunctions';
import FileView from '../../screens/FileView';


const Stack = createStackNavigator()

const MainStack = () => {

    const {
        deviceToken,
        loggedInUserDetails,
        currentRoute,
        appState,
        guest
    } = useSelector(state => state.StorageReducer)
    const dispatch = useDispatch()
    const routeNameRef = useRef();
    const navigationRef = useNavigationContainerRef();




    const Logout = async () => {
        let ID = await AsyncStorage.getItem('userId')
        let url = config.baseURL + "api-logout";
        var data = new FormData();
        data.append("user_id", ID);
        data.append("fcm_token", deviceToken);

        console.log(data);
        apifuntion.postApi(url, data, 1)
            .then((obj) => {
                // console.log("logout response", obj);
                if (obj.status == true) {


                } else {
                }
            }).catch((error) => {
                console.log("Logout-error ------- " + error);
            }).finally(() => {
                dispatch(onLogout())
                routeNameRef?.current?.reset({
                    index: 0,
                    routes: [{ name: "AuthStack" }],
                });
            })
    };

    const configureNotifications = () => {
        PushNotification.configure({
            onNotification: async function (notification) {
                let data = (Platform.OS == "ios") ? JSON.parse(notification.data.notidata) : notification.data
                var videoDetails = {
                    fromUserId: data.fromUserId,
                    fromUserName: data.fromUserName,
                    order_id: data.order_id,
                    room_name: data.room_name,
                    toUserId: data.toUserId,
                    toUserName: data.toUserName,
                    type: data.type,
                    image: data.image,
                    isPage: "accept",
                };
                dispatch(setVideoCallData(videoDetails))

                // if (data?.type == "Logout") {
                //     Logout();
                // }

                if (Platform.OS === 'ios') {
                    if (notification.userInteraction) {
                        if (notification.data?.type == "doctor_to_patient_video_call") {
                            Alert.alert(
                                "Incoming Video call",
                                data.message,
                                [
                                    {
                                        text: "Reject",
                                        onPress: () => {
                                            console.log("Cancel Pressed");
                                            callRejectNotification(data)
                                        },
                                        style: "cancel",
                                    },
                                    {
                                        text: "Accept",
                                        onPress: () => {
                                            console.log("Accept Pressed");
                                            setTimeout(() => {
                                                dispatch(setVideoCall(true))
                                                dispatch(setVideoCallStatus(8))
                                            }, 500);
                                        },
                                        style: "default",
                                    },
                                ],
                                {
                                    cancelable: true,
                                }
                            )
                        }
                    }


                } else {
                    if (notification.action === 'Accept') {
                        if (notification.data?.type == "doctor_to_patient_video_call") {

                            setTimeout(() => {
                                dispatch(setVideoCall(true))
                                dispatch(setVideoCallStatus(8))
                            }, 1000);
                        }
                    } else if (notification.action === 'Reject') {
                        callRejectNotification(data);
                    } else {
                        console.log('waiting...');
                    }
                }

                // notification.finish(PushNotificationIOS.FetchResult.NoData);
            },
        });
    }

    const onRemoteNotification = (notification) => {
        // const isClicked = notification.getData().userInteraction === 1;

        // Use the appropriate result based on what you needed to do for this notification
        const result = PushNotificationIOS.FetchResult.NoData;
        notification.finish(result);
    };

    const showNotification = (remoteMessage) => {
        console.log({remoteMessage});
        PushNotification.localNotification({
            channelId: "rootscares1",
            title: remoteMessage.data.title,
            message: remoteMessage.data.body,
            userInfo: remoteMessage.data,
            actions: remoteMessage.data?.type == "doctor_to_patient_video_call" ? '["Accept", "Reject"]' : [],
            playSound: true
        });

    };

    const messageListener = async () => {
        PushNotification.createChannel(
            {
                channelId: "rootscares1",
                channelName: "rootscare messasge",
                smallIcon: "app_icon",
                importance: Importance.HIGH,
                vibrate: true,
                ignoreInForeground: false,
            },
            (created) => console.log(`createChannel returned '${created}'`)
        );


        messaging().onMessage(async (remoteMessage) => {
            console.log("Notification msg****", remoteMessage);

            if (remoteMessage) {
                if (Platform.OS === 'ios' && !remoteMessage.collapseKey) {
                    if (remoteMessage.data?.type == "patient_to_doctor_video_call_reject") {
                        dispatch(setVideoCallStatus(9))
                    } else {
                        console.log('else');
                        showNotification(remoteMessage)
                        if (remoteMessage.data?.type == "Logout") {
                            Logout();
                        }
                    }

                } else {
                    if (remoteMessage.data?.type == "patient_to_doctor_video_call_reject") {
                        dispatch(setVideoCallStatus(9))
                    } else {
                        showNotification(remoteMessage)
                        if (remoteMessage.data?.type == "Logout") {
                            Logout();
                        }
                    }

                }

            }


        });

        // --------------------------------------

        // messaging().setBackgroundMessageHandler(async remoteMessage => {
        //     console.log('setBackgroundMessageHandler', remoteMessage);
        //     if (remoteMessage) {
        //         if (Platform.OS === 'android') showNotification(remoteMessage)
        //     }
        // });


        // When the application is opened from a quit state.
        messaging().getInitialNotification()
            .then(async remoteMessage => {
                console.log('getInitialNotification', remoteMessage);

            });

        // When the application is running, but in the background.
        messaging().onNotificationOpenedApp(async remoteMessage => {
            console.log('AppBackgroundNotification', remoteMessage);

        });
    };

    useEffect(() => {
        configureNotifications()
        messageListener()

    }, [])

    useEffect(() => {
        appStateSubscription = AppState.addEventListener(
            "change",
            async (nextAppState) => {
                console.log("nextAppState", nextAppState);
                dispatch(setAppState(nextAppState))
                if (nextAppState == 'inactive' || nextAppState == 'background') {

                }
                if (nextAppState === "active") {
                }

            }
        );
        return () => appStateSubscription.remove()
    }, [])

    useEffect(() => {
        const type = 'notification';
        PushNotificationIOS.addEventListener(type, onRemoteNotification);
        // if (tab != 'Message') {
        //   PushNotificationIOS.removeEventListener(type);
        // }
        return () => {
            PushNotificationIOS.removeEventListener(type);
        };
    }, []);

    useEffect(() => {
        NetInfo.fetch().then(state => {
            dispatch(DeviceConnection(state.isConnected))
        });
        const checkConnectivity = NetInfo.addEventListener(state => {
            Network(state)
        });
        return () => {
            checkConnectivity()
        }
    }, [])

    // useMemo(() => {
    //     if (appState != '' && appState === 'active') {
    //         console.log('routeName', routeNameRef?.current?.getCurrentRoute()?.name);
    //         const currentRoute = (
    //             routeNameRef?.current?.getCurrentRoute()
    //             &&
    //             routeNameRef?.current?.getCurrentRoute()?.name != 'Splash'
    //             &&
    //             routeNameRef?.current?.getCurrentRoute()?.name != 'Login'
    //             &&
    //             routeNameRef?.current?.getCurrentRoute()?.name != 'Signup'
    //             &&
    //             routeNameRef?.current?.getCurrentRoute()?.name != 'ForgotPage'
    //             &&
    //             routeNameRef?.current?.getCurrentRoute()?.name != 'ForgotOTP'
    //             &&
    //             routeNameRef?.current?.getCurrentRoute()?.name != 'OTPPage'
    //             &&
    //             routeNameRef?.current?.getCurrentRoute()?.name != 'TermsAndConditions'
    //         )
    //         if (!guest) {
    //             CheckSession().then((authStatus) => {
    //                 if (!authStatus) {
    //                     if (currentRoute) {
    //                         routeNameRef?.current.reset({
    //                             index: 0,
    //                             routes: [{ name: 'AuthStack' }],
    //                         });
    //                     }
    //                 }
    //             }).catch((error) => {
    //                 console.log(error);
    //             })
    //         }
    //     }
    // }, [appState])


    return (
        <NavigationContainer
            ref={routeNameRef}
            // onReady={() => {
            //     routeNameRef.current = navigationRef.getCurrentRoute().name;
            //     console.log('................',routeNameRef.current)
            // }}
            onStateChange={(state) => {
                // console.log('New Screen is', state)}
                // console.log('New Screen is', routeNameRef.current.getCurrentRoute().name)
                // get_notification()
                if (routeNameRef.current.getCurrentRoute().name != 'VideoCall') {
                    dispatch(CurrentRoute(routeNameRef.current.getCurrentRoute().name))
                }
                // console.log({currentRoute});
            }}>
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
                    name="CartDetails"
                    component={CartDetails}
                />

                <Stack.Screen
                    name="AppointmentDetails"
                    component={AppointmentDetails}
                />

                <Stack.Screen
                    name="Orders"
                    component={Orders}
                />

                <Stack.Screen
                    name="BookingIndex"
                    component={BookingIndex}
                />

                <Stack.Screen
                    name="TabbyPayment"
                    component={TabbyPayment}
                />

                <Stack.Screen
                    name="Chat"
                    component={Chat}
                />

                <Stack.Screen
                    name="FileView"
                    component={FileView}
                />

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MainStack;