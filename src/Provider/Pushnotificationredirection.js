import {
  Alert,
} from "react-native";
import OneSignal from "react-native-onesignal";
import { localStorage } from "./localStorageProvider";
// import { msgProvider, msgTitle, msgText } from './messageProvider';
global.propsnavigation;
global.notification_alert_show = 0;
global.page_name = "";

class Pushnotificationredirection {
  //----------------- message buttons
  constructor() {}
  redirectfun(props) {
    propsnavigation = props;
    OneSignal.setLocationShared(true);
    OneSignal.inFocusDisplaying(2);
    OneSignal.addEventListener("ids", this.onIds.bind(this));
    OneSignal.addEventListener("opened", this.onOpened);
    // OneSignal.addEventListener('received', this.onReceived);
  }

  onOpened = async (openResult) => {
    let navigation = propsnavigation;
    console.log("openResult: ", openResult.notification.payload.body);

    var datajson =
      openResult.notification.payload.additionalData.p2p_notification
        .action_json;
    var user_id = datajson.user_id;
    var other_user_id = datajson.other_user_id;
    var action_id = datajson.action_id;
    var action = datajson.action;
    var userdata = await localStorage.getItemObject("user_arr");
    console.log("datajson_user_id", datajson.user_id);

    if (userdata.user_id == other_user_id) {
      other_user_id = datajson.user_id;
    }

    // this.setState({loading:false})
    if (userdata != null) {
      if (userdata.user_id != other_user_id) {
        console.log("navigation run");
        if (action == "chat_single") {
          navigation.navigation.navigate("Chat", {
            data: {
              other_user_id: other_user_id,
              other_user_name: datajson.other_user_name,
              image: datajson.image,
              title: datajson.title,
              ratecount: datajson.ratecount,
              avgrate: datajson.avgrate,
            },
          });
        }
      }
    } else {
      navigation.navigation.navigate("Login");
    }
  };
  async onReceived(openResult) {
    let navigation = propsnavigation;
    console.log(
      "onReceived result: ",
      openResult.payload.additionalData.p2p_notification.action_json
    );

    var datajson =
      openResult.payload.additionalData.p2p_notification.action_json;
    var user_id = datajson.user_id;
    var other_user_id = datajson.other_user_id;
    var action_id = datajson.action_id;
    var action = datajson.action;
    var userdata = await localStorage.getItemObject("user_arr");
    console.log("datajson_user_id", datajson.user_id);

    if (userdata.user_id == other_user_id) {
      other_user_id = datajson.user_id;
    }

    // this.setState({loading:false})
    if (userdata != null) {
      if (userdata.user_id != other_user_id) {
        console.log("navigation run himanshu");
        // console.log('himanshu route 88',navigation.route.name);
        // console.log('himanshu route 89',navigation);
        if (page_name == "Search_map") {
          if (connection_manage == 1) {
            if (notification_alert_show == 0) {
              if (action == "chat_single") {
                notification_alert_show = 1;
                Alert.alert("Provider", datajson.other_user_name, [
                  {
                    text: "Cancel",
                    onPress: () => null,
                    style: "cancel",
                  },
                  {
                    text: "START CHAT",
                    onPress: () => {
                      navigation.navigation.navigate("Chat", {
                        data: {
                          other_user_id: other_user_id,
                          other_user_name: datajson.other_user_name,
                          image: datajson.image,
                          title: datajson.title,
                          ratecount: datajson.ratecount,
                          avgrate: datajson.avgrate,
                        },
                      });
                    },
                  },
                ]);
              }
            }
          }
        }
      }
    } else {
      navigation.navigation.navigate("Login");
    }
  }
  onIds(device) {
    console.log("Device info: ", device);
    player_id_me1 = device.userId;
  }
}

export const pushnotification = new Pushnotificationredirection();
