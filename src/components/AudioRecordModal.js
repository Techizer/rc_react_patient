import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Platform,
    Modal,
    PermissionsAndroid,
    TouchableHighlight,
    Image,
    ImageBackground
} from 'react-native'
import SoundRecorder from 'react-native-sound-recorder';
import moment from 'moment';

// ----------------------------------------------
import colors from '../../Utilis/Colors';
import { Icons } from '../Icons/Index';

export default class VoiceRecorderScreen extends React.Component {

    recordTimerRef = null

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            isRecording: false,
            isPlayingAudio: false,
            showPausedButton: false,
            progressTime: "00:00",
            progressSeconds: 0,
            uploadingProgress: 0,
            audioURI: null,
            recoding: false
        }
    }

    resetStateToDefault = () => {
        this.setState({
            isLoading: false,
            isRecording: false,
            showPausedButton: false,
            progressTime: "00:00",
            progressSeconds: 0,
            uploadingProgress: 0,
            audioURI: null,
            isPlayingAudio: false
        })
    }

    componentDidMount() {
        if (this.recordTimerRef) clearInterval(this.recordTimerRef)
    }

    componentDidUpdate() {
        if (this.state.progressSeconds > 59) {
            this.onPressStop()
        }
    }
    checkPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                {
                    'title': 'Microphone Permission',
                    'message': 'Broadcast needs access to your microphone, so you can save your recordings.'
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {

                this.onPressRecord()
            }
            else {

                console.log("Microphone Permission Not Granted");

            }
        } catch (err) {
            console.warn(err)
        }
    }

    setProgress = () => {
        const { progressSeconds } = this.state
        const progressMins = Math.floor((progressSeconds + 1) / 60)
        const progressSecs = ((progressSeconds + 1) % 60).toFixed(0)
        const updatedProgressMins = progressMins < 10 ? `0${progressMins}` : progressMins
        const updatedProgressSecs = progressSecs < 10 ? `0${progressSecs}` : progressSecs
        const progressTimeTemp = `${updatedProgressMins}:${updatedProgressSecs}`
        this.setState({ progressTime: progressTimeTemp, progressSeconds: progressSeconds + 1 })
    }

    onPressRecord = () => {
        console.log('record start');
        // this.setState({ isPlayingAudio: false })
        SoundRecorder.start(SoundRecorder.PATH_CACHE + `/BRC_${moment().format("HHSSmmDDMMYYYY")}.m4a`).then(() => {
            this.setState({ recoding: true, showPausedButton: true, audioURI: null }, () => {
                this.recordTimerRef = setInterval(() => {
                    this.setProgress()
                }, 1000)
            })
        }).catch((error) => {
            console.log('onPressRecord', 'SoundRecorder-error', error)
        })
    }


    onPressResume = () => {
        SoundRecorder.resume().then(() => {
            this.setState({ recoding: true })
            this.recordTimerRef = setInterval(() => {
                this.setProgress()
            }, 1000)
        }).catch((error) => {
            console.log('onPressResume', 'SoundRecorder-error', error)
        })
    }

    onPressPause = async () => {
        SoundRecorder.pause().then(() => {
            this.setState({ recoding: false })
            if (this.recordTimerRef) clearInterval(this.recordTimerRef)
        }).catch((error) => {
            console.log('onPressPause', 'SoundRecorder-error', error)
        })
    }

    onPressStop = async () => {
        await SoundRecorder.stop().then(result => {
            console.log('onPressStop', 'SoundRecorder-result', result)
            this.setState({
                recoding: false, showPausedButton: false,

                audioURI: //result.path
                {
                    uri: Platform.OS == "ios" ? result.path : result.path,
                    name: (moment().format('x') + ".m4a"),
                    type: 'audio/x-m4a'
                }

            }, () => {
                setTimeout(() => {
                    this.setState({ isPlayingAudio: true })
                }, 1000);
            })
            if (this.recordTimerRef) clearInterval(this.recordTimerRef)
        }).catch((error) => {
            console.log('onPressStop', 'SoundRecorder-error', error)
        })
    }


    saveAudio = async (audio, save, reset) => {

        this.setState({ isPlayingAudio: false })
        return (
            audio,
            reset,
            save

        )

    }

    render() {
        const { modalVisible, cancelClick, saveClick, userProfileImg, disabled, setAudioRecorded = () => { } } = this.props
        const { isLoading, recoding, showPausedButton, progressTime, audioURI = null } = this.state
        const { checkPermission, onPressRecord, onPressStop } = this


        return (
            <Modal animationType='fade' transparent={true} visible={modalVisible}>
                <View style={{ backgroundColor: colors.midnight, flex: 1 }}>
                    {/* <View style={{ flex: 1 }}> */}
                    <View
                        style={{
                            width: "100%",
                            height: 70,
                            marginTop: 20,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: 10
                        }}>

                        <TouchableOpacity
                            onPress={() => {
                                cancelClick()
                                this.resetStateToDefault()
                            }}

                            style={{
                                width: "15%",
                                height: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 20,
                            }}
                        >
                            <Text style={{ fontSize: 12, fontWeight: '500', color: colors.white }}> Cancel </Text>
                        </TouchableOpacity>
                        <View
                            style={{
                                width: "15%",
                                height: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 20,
                            }}
                            pointerEvents={audioURI != null ? 'auto' : 'none'}>
                            <TouchableOpacity
                                onPress={() => {
                                    setAudioRecorded({
                                        ...audioURI,
                                        duration: this.state.progressSeconds
                                    }),
                                        saveClick(),
                                        this.resetStateToDefault()

                                }}
                            >
                                <Text style={{ fontSize: 12, fontWeight: '500', color: audioURI != null ? colors.white : '#a3a3a3' }}> Select </Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                    <View style={[styles.recording, {
                        height: Platform.OS === 'ios' ? 0 : undefined,
                        flex: Platform.OS === 'ios' ? 1 : 1
                    }]}>

                        <View style={styles.container}>
                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 130,
                                width: "100%",
                            }}>
                                <ImageBackground source={Images.AvatorBackgroundDesign} resizeMode="cover" style={{ width: 140, height: 135, }}>
                                    <Image
                                        source={userProfileImg}
                                        style={{ width: 100, height: 100, alignSelf: 'center', marginTop: 20, resizeMode: 'cover', borderRadius: 100 }} />
                                </ImageBackground>

                            </View>

                            <View style={{ width: "100%", marginTop: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>

                                <Text style={styles.welcome}>{`${progressTime}`}/1:00</Text>
                                <Image source={Images.RecorderVolume} style={{ width: 18, height: 14.73, marginLeft: 7 }} resizeMode='stretch' />
                            </View>
                            {
                                audioURI &&
                                <AudioPlayer
                                    url={audioURI.uri}
                                />
                            }
                            <View style={[styles.buttonsMainContainer, { justifyContent: 'space-evenly' }]}>


                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    style={styles.button}
                                    onPress={() => {

                                        if (showPausedButton) {
                                            onPressStop()
                                        } else {
                                            Platform.OS === 'ios' ?
                                                onPressRecord()
                                                :
                                                checkPermission()
                                            this.resetStateToDefault()
                                        }
                                    }}>

                                    {
                                        this.state.recoding ?
                                            <View style={{ width: '100%', alignItems: 'center' }}>
                                                <View style={{ width: 100, flexDirection: 'row', alignItems: 'center', position: 'absolute', bottom: 65, }}>
                                                    <Image source={Images.RecordingDot} style={{ width: 12, height: 12, }} resizeMode='stretch' />
                                                    <Text style={{ color: colors.white, marginLeft: 8 }}>Recording</Text>
                                                </View>
                                                <Image source={Images.Recording}
                                                    style={{ height: 60, width: 60, }}
                                                />
                                            </View>

                                            :
                                            <Image source={Images.StartRecording}
                                                style={{ height: 60, width: 60, }}
                                            />
                                    }

                                </TouchableOpacity>

                            </View>



                        </View>
                    </View>
                    <Loader
                        visible={isLoading}
                        isShowIndicator={true} />
                </View>
            </Modal>
        )
    }
}
const styles = StyleSheet.create({
    recording: {
        backgroundColor: colors.midnight,
        flex: 1,
        width: '100%',
        color: colors.gray,
    },
    // buttonView: {
    //     width: '100%',
    //     height: 107,

    // },
    cancelBtn: {
        width: "100%",
        height: 107,
        backgroundColor: colors.midnight,
        borderWidth: 1,
        borderBottomColor: colors.grayish
    },
    container: {
        flex: 1,
        backgroundColor: colors.Black,
        // backgroundColor: colors.Black,
        // justifyContent: 'center'
    },
    welcome: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600',
        color: colors.white
    },
    buttonsMainContainer: {
        position: 'absolute',
        left: 0,
        bottom: 62,
        right: 0,
        // height: 100,
        // flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        display: 'flex',
        width: 60,
        height: 60,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 100 / 2,
        // backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: '90%',
        borderRadius: 30,
    },
    loginButton: {
        backgroundColor: colors.midnight,
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
        marginTop: 10,
    },
    Buttontext: {
        color: 'white',
        fontWeight: '500',
        fontSize: 18,
    },
    audioContainer: {
        width: '95%',
        height: 25,
        // padding: 24,
        // borderRadius: 8,
        backgroundColor: 'red',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },



});




