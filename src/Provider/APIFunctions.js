
import messaging from '@react-native-firebase/messaging';
import { apifuntion } from './APIProvider';
import { config } from './configProvider';
import { getReduxState, setConnection, setLogout, setUserData } from './ReduxStates';

const Network = (state) => {
  setConnection(state.isConnected)
}

const logout = async () => {
  const { loggedInUserDetails, deviceToken } = getReduxState();

  let url = config.baseURL + "api-logout";
  var data = new FormData();
  data.append("user_id", loggedInUserDetails?.user_id);
  data.append("fcm_token", deviceToken);

  apifuntion.postApi(url, data, 1).finally(() => {
    setLogout()
  })

};

const CheckSession = async () => {
  // console.log(getReduxState());
  let authStatus = false;
  const { loggedInUserDetails, credentials, deviceType, appLanguage, deviceToken } = getReduxState();

  if (loggedInUserDetails !== null) {
    let url = config.baseURL + "api-check-login";
    var data = new FormData();
    data.append("user_id", loggedInUserDetails?.user_id);
    data.append("fcm_token", deviceToken);

    await apifuntion.postApi(url, data, 1)
      .then((obj) => {
        if (obj.result == true) {
          authStatus = true;

          // if (credentials) {

          //   let url = config.baseURL + "api-patient-login";
          //   var data = new FormData();

          //   data.append("email_phone", credentials.email);
          //   data.append("password", credentials.password);
          //   data.append("device_type", deviceType);
          //   data.append("device_lang", appLanguage == 'en' ? 'ENG' : 'AR');
          //   data.append("fcm_token", deviceToken);


          //   apifuntion.postApi(url, data, 1).then((obj) => {
          //     if (obj.status == true) {
          //       setUserData(deviceToken, obj.result)
          //       authStatus = true;

          //     }
          //     else {
          //       authStatus = false;
          //       logout()
          //     }
          //   }).catch((error) => {
          //     console.log('catch');
          //     authStatus = false;
          //     console.log("-------- error relogin ------- " + error);
          //   });

          // } else {
          //   console.log('second else');
          //   authStatus = false;
          //   logout()
          // }

        } else {
          authStatus = false;
          logout()
        }
      })
      .catch((error) => {
        console.log("-------- error check login ------- " + error);
      });

  }
  else {

  }
  return authStatus;
}

const callRejectNotification = async (details) => {

  console.log({ details });
  let apiName = "api-video-call-reject-notification";
  let url = config.baseURL + apiName;

  var data = new FormData();
  data.append("fromUserId", details?.fromUserId);
  data.append("fromUserName", details.fromUserName);
  data.append("order_id", details.order_id);
  data.append("room_name", details.room_name);
  data.append("toUserId", details.toUserId);
  data.append("toUserName", details.toUserName);
  data.append("type", "doctor_to_patient_video_call_reject");
  data.append('callStatus', 'reject')


  apifuntion.postApi(url, data, 1)
    .then((obj) => {
      if (obj.status == true) {
      } else {
        return false;
      }
    }).catch((error) => {
      console.log("callRejectNotification-error ------- " + error);
    });
};

export {
  CheckSession,
  callRejectNotification,
  Network
}
