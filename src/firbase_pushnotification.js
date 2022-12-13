import messaging from "@react-native-firebase/messaging";
class firbase_pushnotification {
  
  requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
      this.getFcmToken();
    }
  };
  getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log("fcmToken", fcmToken);
      fcmtoken = fcmToken;
      global.fcmtoken = fcmtoken
    } else {
      this.showAlert("Failed", "No token received");
    }
  };

  NotificationsListener = async () => {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        "Notification caused app to open from background state:",
        remoteMessage.notification
      );
    });
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification
          );
        }
      });
    messaging().onMessage(async (remoteMessage) => {
      console.log("notification on foreground state", remoteMessage);
    });
  };
}
export const firebapushnotification = new firbase_pushnotification();
