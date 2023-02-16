
import React, { useEffect, useState, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, PermissionsAndroid, Platform, Image } from 'react-native';
import { TwilioVideoLocalView, TwilioVideoParticipantView, TwilioVideo } from "react-native-twilio-video-webrtc";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { useSelector } from 'react-redux';
import {
  config,
  apifuntion,
  StatusbarHeight,
} from "../Provider/Utils/Utils";
import { SvgXml } from 'react-native-svg';
import { dummyUser } from '../Icons/Index';

var countTimeInterval
var timerId

const CallType = {
  Incoming: 111,
  Outgoing: 222,
  Unknown: -1
}

/**
 * Similar Conditions (Calling, Connecting, NotAnswered, Ended)
 */
const Statuses = {
  Disconnected: 0,
  Calling: 1,
  RoomConnected: 2,
  ParticipantReceivedCall: 3,
  Ended: 4,
  NotAnswered: 5,
  NoInternet: 6,
  CallConnected: 7,
  Connecting: 8,
  Unknown: -1
}

const NullTrackData = {
  trackSid: null,
  participantSid: null,
}

const DefaultTime = {
  minutes: 0,
  seconds: 0,
  hours: 0
}

const VideoCall = (props) => {

  const { loggedInUserDetails, languageIndex, appLanguage } = useSelector(state => state.StorageReducer)

  var runtimeSecondsToDisconnectOnNoAnswer = 0
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [status, setStatus] = useState(Statuses.Disconnected);
  const [trackData, setTrackData] = useState(NullTrackData)
  const [token, setToken] = useState("");
  const [callDetails, setCallDetails] = useState({});
  const twilioVideo = useRef(null);
  const [callTime, setCallTime] = useState(DefaultTime)
  const [started, setStarted] = useState(false);
  const [isMyVideoVisible, setIsMyVideoVisible] = useState(true);
  const [callType, setCallType] = useState(CallType.Unknown)


  useEffect(() => {
    if (props.route.params.item.isPage == "accept") {
      getIncomingCallTokenFromAPI('doctor_to_patient_video_call')
      setStatus(Statuses.Connecting)
      setCallType(CallType.Incoming)
    } else {
      getOutgoingCallTokenFromAPI('patient_to_doctor_video_call')
      setStatus(Statuses.Calling)
      setCallType(CallType.Outgoing)
    }

    return () => {
      console.log('countTimeInterval', countTimeInterval, 'timerId', timerId);
      clearInterval(countTimeInterval)
      clearInterval(timerId)
    }
  }, []);


  useEffect(() => {
    if (token != "") {
      try {
        twilioVideo.current.disconnect()
      } catch (error) {

      } finally {
        startCall()
      }

    }

  }, [token]);

  useEffect(() => {
    if (started) {
      timerId = setInterval(() => {

        if (callTime.seconds > 58) {
          setCallTime(time => ({
            ...time,
            seconds: 0,
            minutes: time.minutes + 1
          }))
        } else if (callTime.minutes > 58) {
          setCallTime(time => ({
            ...time,
            seconds: time.seconds + 1,
            minutes: 0,
            hours: time.hours + 1
          }))
        } else {
          setCallTime(time => ({
            ...time,
            seconds: time.seconds + 1,
          }))
        }
      }, 1000);
    } else {
      clearInterval(timerId);
    }
    return () => clearInterval(timerId);
  }, [started, callTime.seconds, callTime.minutes, callTime.hours]);

  const startCall = async () => {
    if (Platform.OS === "android") {
      await _requestAudioPermission();
      await _requestCameraPermission();
    }
    twilioVideo.current.connect({
      accessToken: token,
      enableNetworkQualityReporting: true,
      dominantSpeakerEnabled: true
    });
  };

  const _requestAudioPermission = () => {
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: "Need permission to access microphone",
        message:
          "To run this demo we need permission to access your microphone",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
  };

  const _requestCameraPermission = () => {
    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: "Need permission to access camera",
      message: "To run this demo we need permission to access your camera",
      buttonNegative: "Cancel",
      buttonPositive: "OK",
    });
  };


  const getOutgoingCallTokenFromAPI = async (callType) => {
    let url = config.baseURL + "api-get-video-access-token-with-push-notification";
    var data = new FormData();
    data.append("fromUserId", loggedInUserDetails.user_id);
    data.append("fromUserName", props.route.params.item.patient_name);
    data.append("order_id", props.route.params.item.order_id);
    data.append(
      "room_name",
      "rootvideo_room_" + props.route.params.item.provider_id + "_" + loggedInUserDetails.user_id
    );
    data.append("toUserId", props.route.params.item.provider_id);
    data.append("toUserName", props.route.params.item.provider_name);
    data.append("type", callType);
    data.append('callStatus', '')

    apifuntion
      .postApi(url, data)
      .then((obj) => {
        if (obj.status == true) {
          console.log("getOutgoingCallTokenFromAPI-result", obj.result);
          setToken(obj.result.token)
          setCallDetails(obj.result)
        } else {
          console.log("obj.result", obj.result);
          return false;
        }
      }).catch((error) => {
        console.log("getOutgoingCallTokenFromAPI- error ------- " + error);
      });
  };

  const getIncomingCallTokenFromAPI = async (callType) => {

    let url = config.baseURL + "api-get-video-access-token";

    var data = new FormData();
    data.append("identity", loggedInUserDetails.user_id);
    data.append("fromUserId", props.route.params.item.fromUserId);
    data.append("fromUserName", props.route.params.item.fromUserName);
    data.append("order_id", props.route.params.item.order_id);
    data.append("room_name", props.route.params.item.room_name);
    data.append("toUserId", props.route.params.item.toUserId);
    data.append("toUserName", props.route.params.item.toUserName);
    data.append("type", props.route.params.item.type);

    apifuntion
      .postApi(url, data)
      .then((obj) => {
        if (obj.status == true) {
          // console.log("obj.result", obj.result);
          setToken(obj.result)
          setCallDetails(obj.result)
        } else {
          console.log("getIncomingCallTokenFromAPI-result", obj.result);
          return false;
        }
      }).catch((error) => {
        console.log("getIncomingCallTokenFromAPI-error ------- " + error);
      });
  };

  const endCall = () => {
    twilioVideo.current.disconnect();
    setTimeout(() => {
      //   props?.navigation?.reset({
      //     index: 0,
      //     routes: [{ name: "DashboardStack" }],
      // });
      props.navigation.goBack()
    }, 1000);
  };

  const oponentImage = (props?.route?.params?.item?.image != '' && props?.route?.params?.item?.image != null) ? config.img_url3 + props?.route?.params?.item?.image : ''
  return (
    <View style={styles.container}>

      {
        (status === Statuses.Calling || status === Statuses.Connecting || status === Statuses.NotAnswered || status === Statuses.Ended) &&
        <>
          <Image
            source={{ uri: oponentImage }}
            style={{
              height: 140,
              width: 140,
              borderRadius: 140,
              alignSelf: 'center',
              marginTop: 50
            }} />
          <Text style={{
            color: "#515C6F",
            marginTop: 10,
            alignSelf: 'center'
          }}>{status === Statuses.Calling ? 'Calling...'
            :
            (status === Statuses.Connecting ?
              'Connecting...'
              :
              (status === Statuses.NotAnswered ?
                'Not answered'
                :
                'Call ended'))
            }</Text>
          <View style={[styles.optionsContainer, { justifyContent: 'center', alignItems: 'center' }]}>
            <View style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text style={{
                color: "#515C6F",
                alignSelf: 'center',
                marginBottom: 12
              }}>Video Consultation {props.route.params.item.order_id}</Text>
              <TouchableOpacity
                style={styles.optionButtonEnd}
                onPress={() => {
                  setStatus(Statuses.Ended)
                  endCall()
                }}>
                <MaterialIcons style={{ alignSelf: 'center' }}
                  name={"call-end"}
                  size={28}
                  color={'#FFF'} />
              </TouchableOpacity>
            </View>
          </View>
        </>
      }

      {(status === Statuses.CallConnected && trackData.trackSid && trackData.participantSid) &&
        <View style={styles.callContainer}>
          <View style={styles.remoteGrid}>
            <TwilioVideoParticipantView
              style={styles.remoteVideo}
              key={trackData?.trackSid}
              trackIdentifier={{
                participantSid: trackData?.participantSid,
                videoTrackSid: trackData?.trackSid
              }}
            />
          </View>
          <View style={styles.optionsContainer}>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 15,
              marginBottom: 25
            }}>
              <Text style={{
                color: "#515C6F"
              }}>Video Consultation {props.route.params.item.order_id}</Text>

              {started &&
                <View style={{
                  flexDirection: 'row',
                  marginLeft: 15
                }}>
                  <Entypo style={{ alignSelf: 'center' }}
                    name={"back-in-time"}
                    size={15}
                    color={'#515C6F'} />
                  <Text style={{
                    color: "#E2E7EE",
                    marginLeft: 5
                  }}>{callTime.minutes < 10 && 0}{callTime.minutes}:{callTime.seconds < 10 && 0}{callTime.seconds}</Text>
                </View>
              }
            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'center'
            }}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => {
                  twilioVideo.current.flipCamera();
                }}
              >
                <MaterialCommunityIcons style={{ alignSelf: 'center' }}
                  name={"camera-flip"}
                  size={28}
                  color={'#FFF'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => {
                  twilioVideo.current.setLocalAudioEnabled(!isAudioEnabled).then((isEnabled) => setIsAudioEnabled(isEnabled));
                }}
              >
                {/* <Text style={{ fontSize: 12 }}>
                  {isAudioEnabled ? "Mute" : "Unmute"}
                </Text> */}
                <Ionicons style={{ alignSelf: 'center' }}
                  name={isAudioEnabled ? "mic" : "mic-off"}
                  size={28}
                  color={'#FFF'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButtonEnd}
                onPress={() => {
                  setStatus(Statuses.Ended)
                  endCall()
                }}
              >
                <MaterialIcons style={{ alignSelf: 'center' }}
                  name={"call-end"}
                  size={28}
                  color={'#FFF'} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.localVideo}>
            {
              (isMyVideoVisible) &&
              <TwilioVideoLocalView enabled={true} style={{
                width: 150,
                height: 150,
                backgroundColor: 'black'
              }} />
            }

          </View>
        </View>
      }

      {(status === Statuses.RoomConnected) &&
        <View style={styles.callContainer}>
          <View style={styles.remoteGrid}>
            <TwilioVideoLocalView
              style={styles.remoteVideo}
              enabled={true} />
          </View>
          <View style={styles.optionsContainer}>
            <View style={{
              flexDirection: 'column',
              justifyContent: 'center',
              marginTop: 15,
              marginBottom: 25
            }}>
              <Text style={{
                color: "#515C6F",
                marginTop: 4,
                alignSelf: 'center'
              }}>{`Ringing...`}</Text>
              <Text style={{
                color: "#515C6F",
                alignSelf: 'center'
              }}>Video Consultation {props.route.params.item.order_id}</Text>


            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'center'
            }}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => {
                  twilioVideo.current.flipCamera();
                }}
              >
                <MaterialCommunityIcons style={{ alignSelf: 'center' }}
                  name={"camera-flip"}
                  size={28}
                  color={'#FFF'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => {
                  twilioVideo.current.setLocalAudioEnabled(!isAudioEnabled).then((isEnabled) => setIsAudioEnabled(isEnabled));
                }}>
                <Ionicons style={{ alignSelf: 'center' }}
                  name={isAudioEnabled ? "mic" : "mic-off"}
                  size={28}
                  color={'#FFF'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButtonEnd}
                onPress={() => {
                  setStatus(Statuses.Ended)
                  endCall()
                }}>
                <MaterialIcons style={{ alignSelf: 'center' }}
                  name={"call-end"}
                  size={28}
                  color={'#FFF'} />
              </TouchableOpacity>
            </View>

          </View>

          <View style={[styles.localVideo, { backgroundColor: '#f2f2f2' }]}>
            <View style={{
              width: 150,
              height: 150,
              backgroundColor: 'black',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {
                oponentImage != '' ?
                  <Image source={{ uri: oponentImage }} style={{
                    height: 75,
                    width: 75,
                    borderRadius: 75
                  }} />
                  :
                  <SvgXml xml={dummyUser} height={55} width={55} />
              }


            </View>
          </View>
        </View>
      }

      <TwilioVideo
        ref={twilioVideo}
        onRoomDidConnect={(props) => {
          console.log({ VideoCall: '_onRoomDidConnect' });
          setStatus(Statuses.RoomConnected)
          countTimeInterval = setInterval(() => {
            runtimeSecondsToDisconnectOnNoAnswer = parseInt(runtimeSecondsToDisconnectOnNoAnswer) + parseInt(1)
            if (runtimeSecondsToDisconnectOnNoAnswer > 30) {
              setStatus(Statuses.NotAnswered)
              endCall()
              clearInterval(countTimeInterval)
            }
          }, 1000);
        }}
        onRoomDidDisconnect={({ error }) => {
          console.log("ERROR _onRoomDidDisconnect: ", error);
          if (error) {
            setStatus(Statuses.Disconnected)
          }
          else {
            setStatus(Statuses.Ended);
          }
        }}
        onRoomDidFailToConnect={(props) => {
          console.log({ VideoCall: '_onRoomDidFailToConnect' });
          setStatus(Statuses.Disconnected);
        }}
        onParticipantAddedVideoTrack={({ participant, track }) => {
          console.log({ VideoCall: '_onParticipantAddedVideoTrack' });
          setStatus(Statuses.CallConnected);
          setTrackData({
            trackSid: track.trackSid,
            participantSid: participant.sid,
          })
          clearInterval(countTimeInterval)
          setStarted(true)
        }}
        onParticipantRemovedVideoTrack={() => {
          console.log({ VideoCall: '_onParticipantRemovedVideoTrack' });
          setStatus(Statuses.Ended)
          setTrackData(NullTrackData)

          setCallTime(DefaultTime)
          clearInterval(timerId)

          setStatus(Statuses.Ended)
          endCall()
        }}
        onNetworkQualityLevelsChanged={({ participant, isLocalUser, quality }) => {
          if (isLocalUser == false && isMyVideoVisible == false) {
          }
        }}
        onRoomParticipantDidConnect={({ participant, roomName, roomSid }) => {
          console.log(`Participant ${participant.sid} connected with ${roomName}`);
        }}
        onRoomParticipantDidDisconnect={({ participant, roomName, roomSid }) => {
          console.log(`Participant ${participant.sid} disconnected with ${roomName}`);
        }}
      />
    </View>
  );
};

export default VideoCall;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "black",
  },
  callContainer: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  },
  welcome: {
    fontSize: 30,
    textAlign: "center",
    paddingTop: 40,
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginRight: 70,
    marginLeft: 70,
    marginTop: 50,
    textAlign: "center",
    backgroundColor: "white",
  },
  button: {
    marginTop: 100,
  },
  localVideo: {
    flex: 1,
    width: 150,
    height: 150,
    position: "absolute",
    right: 15,
    top: StatusbarHeight + 30,
    backgroundColor: 'black'
  },
  remoteGrid: {
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
  },
  optionsContainer: {
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    height: 170,
    backgroundColor: "#041A27",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25
  },
  optionButton: {
    width: 60,
    height: 60,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 100 / 2,
    backgroundColor: "#515C6F",
    justifyContent: "center",
    alignItems: "center",
  },
  optionButtonEnd: {
    width: 60,
    height: 60,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 100 / 2,
    backgroundColor: "#FF4E00",
    justifyContent: "center",
    alignItems: "center",
  },

})
