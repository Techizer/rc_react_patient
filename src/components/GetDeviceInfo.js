import messaging from "@react-native-firebase/messaging";
import { useDispatch } from "react-redux";
import DeviceInfo from "react-native-device-info";

import { DeviceID, DeviceToken, DeviceName, AppVersion, DeviceType } from "../Redux/Actions";
import { Platform } from "react-native";


export const requestNotificationPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    // console.log("Authorization status:", authStatus);
    getFcmToken();
  }
};
const getFcmToken = async () => {
  const dispatch = useDispatch()
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    dispatch(DeviceToken(fcmToken))
  } else {
    dispatch(DeviceToken(null))
  }
};

export const getDeviceID = async () => {
  const dispatch = useDispatch()
  let deviceId = DeviceInfo.getDeviceId()
  dispatch(DeviceID(deviceId))
}

export const getDeviceName = async () => {
  const dispatch = useDispatch()
  DeviceInfo.getDeviceName().then((data) => {
    dispatch(DeviceName(data))
  });
}

export const getAppVersion = async () => {
  const dispatch = useDispatch()
  let appVersion = DeviceInfo.getVersion();
  dispatch(AppVersion(appVersion))
}

export const getDeviceType = async () => {
  const dispatch = useDispatch()
  dispatch(DeviceType(Platform.OS))
}
