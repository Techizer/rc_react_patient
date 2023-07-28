import React, { useEffect, useState } from "react";
import { Text, Platform, TouchableOpacity, Image, View, StyleSheet, Modal, TouchableHighlight, PermissionsAndroid } from "react-native";
import RNFetchBlob from "rn-fetch-blob";
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
} from "react-native-audio-recorder-player";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import { useSelector } from "react-redux";
import { Cross, Icons } from "../Icons/Index";
import { Colors, Font } from "../Provider/Colorsfont";
import { LangProvider } from "../Provider/Language_provider";
import { Button, msgProvider, windowHeight, windowWidth } from "../Provider/Utils/Utils";
import { AudioPlayer } from "./AudioPlayer";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioRecorder = ({
  visible,
  onRequestClose,
  recordedAudioUri = () => { }
}) => {

  var dirs = RNFetchBlob.fs.dirs;
  var path = Platform.select({
    ios: "audio.m4a",
    android: `${dirs.CacheDir}/audio.mp3`,
  });
  audioRecorderPlayer.setSubscriptionDuration(0.1); // optional. Default is 0.5

  const audioSet = {
    AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
    AudioSourceAndroid: AudioSourceAndroidType.MIC,
    AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
    AVNumberOfChannelsKeyIOS: 2,
    AVFormatIDKeyIOS: AVEncodingOption.aac,
  };
  const { languageIndex, appLanguage } = useSelector(state => state.StorageReducer)

  const [isRecording, setIsRecording] = useState(false)
  const [audioFile, setAudioFile] = useState(null)
  const [recordTime, setRecordTime] = useState(null)
  const [forceStop, setForceStop] = useState(false)
  const insets = useSafeAreaInsets()
  // useEffect(() => {
  //   if (forceStop) {
  //     console.log('.,.,.,..');
  //     onStopRecord()
  //     setTimeout(() => {
  //       resetState()
  //     }, 350);
  //   }
  // }, [forceStop])

  const resetState = () => {
    setIsRecording(false)
    setAudioFile(null)
    setRecordTime(null)
  }

  const CheckStoragePermission = async () => {
    const grants = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    ]);

    console.log("write external storage", grants);

    if (
      grants["android.permission.WRITE_EXTERNAL_STORAGE"] ===
      PermissionsAndroid.RESULTS.GRANTED &&
      grants["android.permission.READ_EXTERNAL_STORAGE"] ===
      PermissionsAndroid.RESULTS.GRANTED
    ) { onStartRecord() }
    else {
      msgProvider.showError('Please grant storage permissions first.')
    }
  }

  const onStartRecord = async () => {
    try {
      setAudioFile(null);
      setRecordTime(null)
      setIsRecording(true)
      const uri = await audioRecorderPlayer.startRecorder(path, audioSet);
      audioRecorderPlayer.addRecordBackListener((e) => {
        setRecordTime(
          audioRecorderPlayer.mmss(Math.floor(e.currentPosition / 1000))
        );
        // console.log("uri . . . ", uri);
        return;
      });
    } catch (err) {
      console.log('onStartRecord-error...', err);
      return;

    }
  };

  const onStopRecord = async () => {
    setIsRecording(false)
    setRecordTime(null)
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setAudioFile(result);
    console.log("audio-result ", result);
  };

  return (

    <View style={{ flex: 1 }}>
      <Modal
        animationType='slide'
        visible={visible}
        transparent
        presentationStyle='overFullScreen'
      >
        {/* <BlurView
          style={{
            flex: 1,
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          }}
          blurType='ultraThinMaterialDark'
          blurAmount={15}
          reducedTransparencyFallbackColor="white"
        /> */}

        <View style={styles.mainContainer}>

          <View style={styles.subContainer}>

            {
              !isRecording &&
              <TouchableOpacity
                onPress={() => {
                  onRequestClose()
                  resetState()
                }}
                style={styles.closeContainer}
              >
                <SvgXml xml={Cross} height={vs(12)} width={s(12)} />
              </TouchableOpacity>
            }
            <View style={styles.modalContainer}>

              <View style={{
                paddingHorizontal: s(13)
              }}>
                <Text
                  style={{
                    fontSize: Font.large,
                    fontFamily: Font.SemiBold,
                    alignSelf: 'flex-start',
                    color: Colors.darkText

                  }}>{LangProvider.Record_Symptom[languageIndex]}</Text>


                {
                  !isRecording &&
                  <TouchableOpacity
                    onPress={() => {
                      Platform.OS == 'ios' ?
                        onStartRecord()
                        :
                        CheckStoragePermission()
                    }}
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      alignSelf: 'center',
                      marginTop: (windowWidth * 5) / 100

                    }}>
                    <Image
                      resizeMode="contain"
                      source={Icons.mic}
                      style={{
                        width: (windowWidth * 10) / 100,
                        height: (windowWidth * 10) / 100,
                        borderColor: Colors.Theme,
                      }}
                    />
                  </TouchableOpacity>
                }
                {
                  isRecording &&
                  <TouchableOpacity
                    onPress={() => {
                      onStopRecord()
                    }}
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      alignSelf: 'center',
                      marginTop: (windowWidth * 5) / 100

                    }}>
                    <Image
                      resizeMode="contain"
                      source={Icons.stop}
                      style={{
                        width: (windowWidth * 10) / 100,
                        height: (windowWidth * 10) / 100,
                        borderColor: Colors.Theme,
                      }}
                    />
                  </TouchableOpacity>
                }

                {
                  isRecording &&
                  <Text
                    style={{
                      fontSize: Font.medium,
                      fontFamily: Font.Regular,
                      alignSelf: 'center',
                      color: Colors.DarkGrey,
                      marginTop: 5

                    }}>{recordTime}</Text>
                }


                {
                  audioFile != null &&
                  <AudioPlayer
                    url={audioFile}
                    containerStyle={{
                      marginTop: (windowWidth * 5) / 100
                    }}
                  />
                }

              </View>
              {
                audioFile != null &&
                <View
                  style={{
                    width: "100%",
                    position: 'absolute',
                    bottom: Platform.OS == 'ios' ? insets.bottom - 15 : 0,
                    paddingHorizontal: s(13),
                    backgroundColor: Colors.White,
                    paddingVertical: (windowWidth * 2) / 100,
                    alignItems: "center",
                    borderTopWidth: 1,
                    borderTopColor: Colors.Border,
                  }}>
                  <Button
                    text={LangProvider.Save[languageIndex]}
                    onPress={() => {
                      onRequestClose()
                      recordedAudioUri(audioFile)
                    }} />
                </View>

              }
            </View>


          </View>

        </View>



      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({

  mainContainer: {
    width: windowWidth,
    height: windowHeight,
    position: 'absolute',
    bottom: 0,
    zIndex: 9999,
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
  subContainer: {
    width: windowWidth,
    height: windowHeight / 2.27,
    position: 'absolute',
    bottom: 0,
    zIndex: 9999,
  },
  modalContainer: {
    width: windowWidth,
    height: windowHeight / 2.8,
    backgroundColor: Colors.White,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: vs(20),
    position: 'absolute',
    bottom: 0,
    zIndex: 9999

  },
  closeContainer: {
    height: s(35),
    width: s(35),
    borderRadius: s(50),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.LightBlack,
    zIndex: 999
  },
  viewWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
});

export default AudioRecorder;
