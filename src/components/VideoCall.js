import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, PermissionsAndroid, Platform, Image, Modal } from 'react-native';
import { TwilioVideoLocalView, TwilioVideoParticipantView, TwilioVideo } from "react-native-twilio-video-webrtc";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { useDispatch, useSelector } from 'react-redux';
import {
    config,
    apifuntion,
    StatusbarHeight,
    windowHeight,
    windowWidth,
    Colors,
} from "../Provider/Utils/Utils";
import { SvgXml } from 'react-native-svg';
import { dummyUser } from '../Icons/Index';
import { vs } from 'react-native-size-matters';
import { setVideoCall, setVideoCallData, setVideoCallStatus } from '../Redux/Actions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LoadingDots from './LoadingDots';


var countTimeInterval
var timerId

const CallType = {
    Incoming: 111,
    Outgoing: 222,
    Unknown: -1
}

/**
 * Similar Conditions (Calling, Connecting, NotAnswered, Ended)
 * Other is Room Connected
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
    Declined: 9,
    Reconnecting: 10,
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

const VideoCall = ({
    isVisible
}) => {
    var runtimeSecondsToDisconnectOnNoAnswer = 0
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [trackData, setTrackData] = useState(NullTrackData)
    const [token, setToken] = useState("");
    const [callDetails, setCallDetails] = useState({});
    const twilioVideo = useRef(null);
    const [callTime, setCallTime] = useState(DefaultTime)
    const [started, setStarted] = useState(false);
    const [isMyVideoVisible, setIsMyVideoVisible] = useState(true);

    const { loggedInUserDetails, currentRoute, languageIndex, appLanguage, videoDetails, callStatus } = useSelector(state => state.StorageReducer)
    const dispatch = useDispatch()
    // const insets = useSafeAreaInsets()

    const styles = StyleSheet.create({


        mainContainer: {
            flex: 1,
            backgroundColor: 'black'
        },
        modalContainer: {
            width: windowWidth,
            height: windowHeight / 1.5,
            backgroundColor: Colors.White,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingVertical: vs(20),
            position: 'absolute',
            bottom: 0,
            zIndex: 9999

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
            top: windowWidth / 8,
            right: windowWidth / 20,
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


    useEffect(() => {
        if (videoDetails?.isPage == "accept") {
            getIncomingCallTokenFromAPI('doctor_to_patient_video_call')
        } else {
            getOutgoingCallTokenFromAPI()
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

    useEffect(() => {
        console.log({callStatus});
        if (callStatus === Statuses.Declined) {
            endCall()
        }
    }, [callStatus])

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

    const getOutgoingCallTokenFromAPI = async () => {

        let url = config.baseURL + "api-get-video-access-token-with-push-notification";
        var data = new FormData();
        data.append("fromUserId", loggedInUserDetails?.user_id);
        data.append("fromUserName", videoDetails?.fromUserName);
        data.append("order_id", videoDetails?.order_id);
        data.append("room_name", "rootvideo_room_" + videoDetails?.room_name);
        data.append("toUserId", videoDetails?.toUserId);
        data.append("toUserName", videoDetails?.toUserName);
        data.append("type", videoDetails?.type);
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

    }

    const getIncomingCallTokenFromAPI = async () => {
        let url = config.baseURL + "api-get-video-access-token";

        var data = new FormData();
        data.append("identity", loggedInUserDetails?.user_id);
        data.append("fromUserId", videoDetails?.fromUserId);
        data.append("fromUserName", videoDetails?.fromUserName);
        data.append("order_id", videoDetails?.order_id);
        data.append("room_name", videoDetails?.room_name);
        data.append("toUserId", videoDetails?.toUserId);
        data.append("toUserName", videoDetails?.toUserName);
        data.append("type", videoDetails?.type);

        apifuntion
            .postApi(url, data)
            .then((obj) => {
                if (obj.status == true) {
                    console.log("getIncomingCallTokenFromAPI", obj.result);
                    setToken(obj.result)
                    setCallDetails(obj.result)
                } else {
                    console.log("getIncomingCallTokenFromAPI-result", obj.result);
                    return false;
                }
            }).catch((error) => {
                console.log("getIncomingCallTokenFromAPI-error ------- " + error);
            });

    }

    const endCall = () => {
        twilioVideo.current.disconnect();
        setTimeout(() => {
            dispatch(setVideoCall(false))
        }, 1000);
       
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


    const TwilioVideoComponent = () => {
        try {
            return (
                <TwilioVideo
                    ref={twilioVideo}
                    // onCameraWasInterrupted={()=>{}}
                    onRoomDidConnect={(props) => {
                        console.log({ VideoCall: '_onRoomDidConnect' });
                        dispatch(setVideoCallStatus(Statuses.RoomConnected))
                        countTimeInterval = setInterval(() => {
                            runtimeSecondsToDisconnectOnNoAnswer = parseInt(runtimeSecondsToDisconnectOnNoAnswer) + parseInt(1)
                            if (runtimeSecondsToDisconnectOnNoAnswer > 75) {
                                dispatch(setVideoCallStatus(Statuses.NotAnswered))
                                endCall()
                                clearInterval(countTimeInterval)
                            }
                        }, 1000);
                    }}
                    onRoomDidDisconnect={({ error }) => {
                        console.log("ERROR _onRoomDidDisconnect: ", error);
                        endCall()
                        if (error) {
                            dispatch(setVideoCallStatus(Statuses.Disconnected))
                        }
                        else {
                            if (callStatus != Statuses.Declined) {
                                dispatch(setVideoCallStatus(Statuses.Ended))
                            }
                        }
                    }}
                    onRoomDidFailToConnect={(props) => {
                        console.log({ VideoCall: '_onRoomDidFailToConnect' });
                        dispatch(setVideoCallStatus(Statuses.Disconnected))
                        endCall()
                    }}
                    onParticipantAddedVideoTrack={({ participant, track }) => {
                        // console.log({ VideoCall: '_onParticipantAddedVideoTrack' });
                        dispatch(setVideoCallStatus(Statuses.CallConnected))
                        setTrackData({
                            trackSid: track.trackSid,
                            participantSid: participant.sid,
                        })
                        clearInterval(countTimeInterval)
                        setTimeout(() => {
                            setStarted(true)
                        }, 2000);
                    }}
                    onParticipantRemovedVideoTrack={() => {
                        console.log({ VideoCall: '_onParticipantRemovedVideoTrack' });
                        if (callStatus != Statuses.Declined) {
                            dispatch(setVideoCallStatus(Statuses.Ended))
                        }
                        setTrackData(NullTrackData)

                        setCallTime(DefaultTime)
                        clearInterval(timerId)

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
            )
        } catch (err) {
            console.log({ TwilioVideoComponent: err });
            return (
                <Text>{'There is some error' + err.message}</Text>
            )
        }
    }

    const oponentImage = config.img_url3 + ((videoDetails?.image != undefined && videoDetails?.image != '') ? videoDetails?.image : callDetails?.Receiver?.message?.image)
    return (

        <Modal
            animationType='slide'
            visible={isVisible}
            transparent
            presentationStyle='overFullScreen'
        >


            <View style={styles.mainContainer}>
                {
                    (
                        callStatus === Statuses.Calling
                        ||
                        callStatus === Statuses.Connecting
                        ||
                        callStatus === Statuses.Disconnected
                        ||
                        callStatus === Statuses.NotAnswered
                        ||
                        callStatus === Statuses.Ended
                        ||
                        callStatus === Statuses.Declined
                        ||
                        callStatus === Statuses.Reconnecting
                    ) &&
                    <>
                        {
                            oponentImage ?
                                <Image
                                    source={{ uri: oponentImage }}
                                    style={{
                                        height: 140,
                                        width: 140,
                                        borderRadius: 140,
                                        alignSelf: 'center',
                                        marginTop: 50,
                                        backgroundColor: Colors.backgroundcolor
                                    }} />
                                :
                                <SvgXml xml={dummyUser} height={140} width={140} />
                        }

                        <Text style={{
                            color: callStatus === Statuses.Declined ? '#d44a5a' : "#515C6F",
                            marginTop: 10,
                            alignSelf: 'center'
                        }}>{callStatus === Statuses.Calling ? 'Calling...'
                            :
                            (callStatus === Statuses.Connecting ? <LoadingDots title={'Connecting'} />
                                :
                                callStatus === Statuses.NotAnswered ? 'Not answered'
                                    :
                                    (callStatus === Statuses.Ended) ? 'Call ended'
                                        :
                                        (callStatus === Statuses.Declined) ? 'Call Declined'

                                            :
                                            (callStatus === Statuses.Reconnecting) ? <LoadingDots title={'Reconnecting'} />
                                                :
                                                (callStatus === Statuses.Disconnected) ? 'Failed to connect'
                                                    :
                                                    ''
                            )
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
                                }}>Video Consultation {videoDetails?.order_id}</Text>
                                {
                                    callStatus != Statuses.Ended &&
                                    <TouchableOpacity
                                        style={styles.optionButtonEnd}
                                        onPress={() => {
                                            dispatch(setVideoCallStatus(Statuses.Ended))
                                            endCall()
                                        }}>
                                        <MaterialIcons style={{ alignSelf: 'center' }}
                                            name={"call-end"}
                                            size={28}
                                            color={'#FFF'} />
                                    </TouchableOpacity>
                                }
                            </View>
                        </View>
                    </>
                }

                {
                    (callStatus === Statuses.CallConnected && trackData.trackSid && trackData.participantSid) &&
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
                                }}>Video Consultation {videoDetails?.order_id}</Text>

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

                                    <Ionicons style={{ alignSelf: 'center' }}
                                        name={isAudioEnabled ? "mic" : "mic-off"}
                                        size={28}
                                        color={'#FFF'} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.optionButtonEnd}
                                    onPress={() => {
                                        dispatch(setVideoCallStatus(Statuses.Ended))
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

                {
                    (callStatus === Statuses.RoomConnected) &&
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

                                <LoadingDots title={'Ringing'} />
                                <Text style={{
                                    color: "#515C6F",
                                    alignSelf: 'center'
                                }}>Video Consultation {videoDetails?.order_id}</Text>


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
                                        dispatch(setVideoCallStatus(Statuses.Ended))
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
                                <Image source={{ uri: oponentImage }} style={{
                                    height: 75,
                                    width: 75,
                                    borderRadius: 75
                                }} />
                            </View>
                        </View>
                    </View>
                }

                {TwilioVideoComponent()}
            </View>

        </Modal>




    );
};

export default VideoCall;


