import React, { useEffect, useRef } from 'react'
import { Alert, Platform } from 'react-native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'
import { NavigationContainer, useNavigationContainerRef, } from '@react-navigation/native';
import messaging from "@react-native-firebase/messaging";
import PushNotification, { Importance } from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";

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
import { config } from '../configProvider';
import { apifuntion } from '../Apicallingprovider/apiProvider';
import SimpleToast from 'react-native-simple-toast';


let isGuest = '';
const Stack = createStackNavigator()

const MainStack = () => {

    const routeNameRef = useRef();
    const navigationRef = useNavigationContainerRef();

    const configureNotifications = () => {
        PushNotification.configure({
            onNotification: function (notification) {
                if (notification.userInteraction) {
                    // Handle notification click
                    // console.log("PushNotification.configure", notification);

                    if (notification.data?.type == "doctor_to_patient_video_call") {
                        let data;
                        if (Platform.OS === "ios") {
                            data = JSON.parse(notification.data.notidata);
                        } else {
                            data = notification.data;
                            // console.log("data", data);
                        }
                        Alert.alert(
                            "Video call",
                            "video call from " + data?.fromUserName,
                            [
                                {
                                    text: "Reject",
                                    onPress: () => {
                                        callRejectNotification(data);
                                    },
                                    style: "cancel",
                                },
                                {
                                    text: "Accept",
                                    onPress: () => {
                                        // val messageBody = json.optString("message")
                                        // val roomName = json.getString("room_name")
                                        // val fromUserName = json.optString("fromUserName")
                                        // val fromUserId = json.getString("fromUserId")
                                        // val toUserName = json.getString("toUserName")
                                        // val toUserId = json.getString("toUserId")
                                        // val orderId = json.getString("order_id")
                                        showVideoCallAlert(data);
                                    },
                                    style: "default",
                                },
                            ],
                            {
                                cancelable: true,
                                // onDismiss: () =>
                                //   Alert.alert(
                                //     "This alert was dismissed by tapping outside of the alert dialog."
                                //   ),
                            }
                        );
                    }
                }

                notification.finish(PushNotificationIOS.FetchResult.NoData);
            },
        });

    }

    const getNotificationCall = async () => {
        PushNotification.createChannel(
            {
                channelId: "rootscares1", // (required)
                channelName: "rootscare messasge", // (required)

                importance: Importance.HIGH, // (optional) default: 4. Int value of the Android notification importance
                vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
                priority: "high",
                soundName: "default",
                playSound: true,
                ignoreInForeground: false,
                smallIcon: "app_icon",
            },
            (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );

    };


    const messageListener = async () => {
        PushNotification.createChannel(
            {
                channelId: "rootscares1", // (required)
                channelName: "rootscare messasge", // (required)
                smallIcon: "app_icon",
                importance: Importance.HIGH, // (optional) default: 4. Int value of the Android notification importance
                vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
                ignoreInForeground: false,
            },
            (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );


        messaging().onMessage(async (remoteMessage) => {
            console.log("Notification msg****", JSON.stringify(remoteMessage));
            if (remoteMessage.data?.type == "Logout") {
                //logout();
            }
            // PushNotificationIOS.addEventListener(type, onRemoteNotification);
            // return () => {
            //   PushNotificationIOS.removeEventListener(type);
            // };
            PushNotification.localNotification({
                channelId: "rootscares1",
                title: remoteMessage.data.title,
                message: remoteMessage.data.body,
                userInfo: remoteMessage.data,
            });
        });
    };

    const showVideoCallAlert = (data) => {
        console.log("showVideoCallAlert", data);
        var myData = {
            fromUserId: data.fromUserId,
            fromUserName: data.fromUserName,
            order_id: data.order_id,
            room_name: data.room_name,
            toUserId: data.toUserId,
            toUserName: data.toUserName,
            type: data.type,
            isPage: "accept",
        };
        routeNameRef?.current?.navigate("VideoCall", { item: myData, })
    };

    // const callRejectNotification = async (data) => {
    //     let user_details = await localStorage.getItemObject("user_arr");
    //     let user_id = user_details["user_id"];
    //     let apiName = "api-get-video-access-token-with-push-notification";
    //     let url = config.baseURL + apiName;

    //     var data = new FormData();
    //     data.append("fromUserId", user_id);
    //     data.append("fromUserName", data.toUserName);
    //     data.append("order_id", data.order_id);
    //     data.append("room_name", data.room_name);
    //     data.append("toUserId", data.fromUserId);
    //     data.append("toUserName", data.fromUserName);
    //     data.append("type", "patient_to_doctor_video_call_reject");

    //     apifuntion
    //         .postApi(url, data, 1)
    //         .then((obj) => {
    //             if (obj.status == true) {
    //             } else {
    //                 return false;
    //             }
    //         })
    //         .catch((error) => {
    //             console.log("-------- error ------- " + error);
    //         });
    // };

    // const checkUserType = async () => {
    //     isGuest = await localStorage.getItemString('Guest')
    // }

    // const checkSession = async () => {

    //     let user_details = await localStorage.getItemObject("user_arr");
    //     let token = await localStorage.getItemString('DeviceToken')

    //     if (user_details != null && user_details != undefined && user_details != '') {
    //         let user_id = user_details["user_id"];

    //         let url = config.baseURL + "api-check-login";
    //         var data = new FormData();

    //         data.append("fcm_token", token);
    //         data.append("user_id", user_id);

    //         console.log('on MainStack checkSession ', data);
    //         apifuntion.postApi(url, data, 1).then((obj) => {
    //             console.log("sessionExpire-response...: ", Platform.OS, obj);
    //             if (obj.result == false) {
    //                 logout()
    //             }
    //         }).catch((error) => {
    //             console.log("-------- error ------- " + error);
    //         });
    //     }

    // }

    // const logout = async () => {
    //     await localStorage.removeItem("user_arr");
    //     await localStorage.removeItem("user_login");
    //     global.isLogin = false
    //     global.isPage = ""
    //     // console.log(routeNameRef.current.reset);
    //     // return
    //     SimpleToast.show('Session has expired!')
    //     setTimeout(() => {
    //         routeNameRef?.current?.reset({
    //             index: 0,
    //             routes: [{ name: "AuthStack" }],
    //         });
    //     }, 350);
    // }

    useEffect(() => {
        // checkSession()
        configureNotifications()
        messageListener()
    }, [])

    return (
        <NavigationContainer
            ref={routeNameRef}
            // onReady={() => {
            //     routeNameRef.current = navigationRef.getCurrentRoute().name;
            //     console.log('................',routeNameRef.current)
            // }}
            onStateChange={() => {
                // checkSession()
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