import messaging from '@react-native-firebase/messaging';
import { apifuntion } from './APIProvider';
import { config } from './configProvider';
import { FBPushNotifications } from './FirebasePushNotifications';
import { getReduxState, setLogout, setUserData } from './ReduxStates';

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
          console.log('last else');
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

export {
  CheckSession
}