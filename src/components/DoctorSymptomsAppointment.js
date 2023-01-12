import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Keyboard,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { TabBar, TabView } from "react-native-tab-view";
import { Font } from "../Provider/Colorsfont";
import {
  Cameragallery,
  Colors,
  config,
  Lang_chg,
  Icons,
  mediaprovider,
  windowWidth,
} from "../Provider/utilslib/Utils";
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
} from "react-native-audio-recorder-player";
import RNFetchBlob from "rn-fetch-blob";
import Slider from "@react-native-community/slider";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { AUDIO_STATUS, pausePlayer, startPlayer } from "./AudioManager";
import SoundPlayer from "react-native-sound-player";
import { Alert } from "react-native";
import { s, vs } from "react-native-size-matters";
import { useSelector } from "react-redux";
var Sound = require("react-native-sound");

const audioRecorderPlayer = new AudioRecorderPlayer();
let arr = [];
var sound = null;
let sliderEditing = false;
let timeout = null

const DoctorSymptomsAppointment = (props) => {

  const { address, loggedInUserDetails, guest, appLanguage } = useSelector(state => state.StorageReducer)

  // console.log("sound ::::", sound);
  const { indexPosition, isFromHospital, sendData = () => { } } = props;
  const { navigation } = props;
  const [languageIndex, setLanguageIndex] = useState(appLanguage == 'en' ? 0 : 1,)
  const [isFocused, setFocused] = useState(false);
  const [currentPositionSec, setCurrentPositionSec] = useState(0);
  const [currentDurationSec, setCurrentDurationSec] = useState(0);
  const [playTime, setPlayTime] = useState("00:00");
  // const [duration, setDuration] = useState("00:00");
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState("00:00");
  const [isRecording, setRecording] = useState(false);
  const [isStopped, setStopped] = useState(false);
  const [isPlay, setPlay] = useState(false);
  const [isPause, setPause] = useState(false);
  const [playDuration, setPlayDuration] = useState(0);
  const [playWidth, setPlayWidth] = useState(0);
  const [playerStatus, setPlayerStatus] = useState("");
  const [imageName, setImageName] = useState("");
  const [tabKey, setTabKey] = useState("online");
  const [mediaModal, setMedialModal] = useState(false);
  const [playState, setPlayState] = useState("paused");
  const [playSeconds, setPlaySeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sliderIcon, setSliderIcon] = useState();
  const [audioFile, setAudioFile] = useState();
  const [isShowRecordingPanle, setIsShowRecordingPanel] = useState(false)


  useEffect(() => {
    FontAwesome.getImageSource("circle", 20, Colors.Theme).then(
      (source) => {
        setSliderIcon(source);
        // this.setState({ sliderIcon: source });
      }
    );
    setRoutes();
    let _onFinishedPlayingSubscription = SoundPlayer.addEventListener(
      "FinishedPlaying",
      ({ success }) => {
        console.log("finished playing", success);
      }
    );
    let _onFinishedLoadingSubscription = SoundPlayer.addEventListener(
      "FinishedLoading",
      ({ success }) => {
        console.log("finished loading", success);
      }
    );
    let _onFinishedLoadingFileSubscription = SoundPlayer.addEventListener(
      "FinishedLoadingFile",
      ({ success, name, type }) => {
        console.log("finished loading file", success, name, type);
        SoundPlayer.play();
      }
    );
    let _onFinishedLoadingURLSubscription = SoundPlayer.addEventListener(
      "FinishedLoadingURL",
      ({ success, url }) => {
        console.log("finished loading url", success, url);
      }
    );
    return () => {
      sound = null;
    };
  }, []);
  const customStyle = isFocused ? styles.textInputFocus : styles.textInput;
  var dirs = RNFetchBlob.fs.dirs;
  var path = Platform.select({
    ios: "audio.m4a",
    android: `${dirs.CacheDir}/audio.mp3`,
  });
  audioRecorderPlayer.setSubscriptionDuration(0.1); // optional. Default is 0.5

  Sound.setCategory("Playback", true); // true = mixWithOthers

  const audioSet = {
    AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
    AudioSourceAndroid: AudioSourceAndroidType.MIC,
    AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
    AVNumberOfChannelsKeyIOS: 2,
    AVFormatIDKeyIOS: AVEncodingOption.aac,
  };

  // console.log("audioSet", audioSet);

  const screenWidth = Dimensions.get("screen").width;
  // let playerStatus = "";
  // let playWidth =
  //   (currentPositionSec / currentDurationSec) * (screenWidth - 140);

  // if (!playWidth) {
  //   setPlayWidth(0);
  // }

  const onStatusPress = (e) => {
    const touchX = e.nativeEvent.locationX;
    console.log(`touchX: ${touchX}`);
    const playWidth =
      (currentPositionSec / currentDurationSec) * (screenWidth - 140);
    console.log(`currentPlayWidth: ${playWidth}`);

    const currentPosition = Math.round(currentPositionSec);

    if (playWidth && playWidth < touchX) {
      const addSecs = Math.round(currentPosition + 1000);
      audioRecorderPlayer.seekToPlayer(addSecs);
      console.log(`addSecs: ${addSecs}`);
    } else {
      const subSecs = Math.round(currentPosition - 1000);
      audioRecorderPlayer.seekToPlayer(subSecs);
      console.log(`subSecs: ${subSecs}`);
    }
  };

  const playAudio = async () => {
    await startPlayer(path, (res) => {
      setPlayWidth(0);
      console.log("res ", res);
      const { status } = res;
      switch (status) {
        case AUDIO_STATUS.begin: {
          console.log("BEGIN AUDIO");
          setPlay(true);
          break;
        }
        case AUDIO_STATUS.play: {
          console.log("Play");
          const { currentPosition, duration } = res.data;
          setPlayDuration(currentPosition);
          console.log("currentPosition", currentPosition);
          console.log("duration ", duration);
          setCurrentPositionSec(currentPosition);
          setCurrentDurationSec(duration);
          setPlayWidth((currentPosition / duration) * (screenWidth - 140));
          break;
        }
        case AUDIO_STATUS.pause: {
          console.log("PAUSE AUDIO");
          setPause(true);
          setPlay(false);
          break;
        }
        case AUDIO_STATUS.resume: {
          console.log("RESUME AUDIO");
          setPause(false);
          // setPlay(true);
          break;
        }
        case AUDIO_STATUS.stop: {
          console.log("STOP AUDIO");
          setPlayWidth(0);
          setPlay(false);
          setPause(false);
          break;
        }
      }
    });
  };

  const pauseAudio = async () => {
    console.log("pauseAudio");
    await pausePlayer();
  };

  const onStartPlay1 = async () => {
    console.log("onStartPlay");
    //? Custom path
    const msg = await audioRecorderPlayer.startPlayer(path);

    //? Default path
    // const msg = await audioRecorderPlayer.startPlayer();
    const volume = await audioRecorderPlayer.setVolume(1.0);
    console.log(`file: ${msg}`, `volume: ${volume}`);
    setPlayerStatus("playing");
    audioRecorderPlayer.addPlayBackListener(async (e) => {
      setCurrentPositionSec(e.currentPosition);
      setCurrentDurationSec(e.duration);
      setPlayTime(
        audioRecorderPlayer.mmss(Math.floor(e.currentPosition / 1000))
      );
      setDuration(
        audioRecorderPlayer.mmss(Math.floor(e.currentPosition / 1000))
      );
      setPlayWidth((e.currentPosition / e.duration) * (screenWidth - 140));
      console.log("recordSecs ", recordSecs);
      console.log("duration ", playTime);
      if (e.currentPosition === e.duration) {
        try {
          await stopPlayer();
        } catch (error) {
          console.log("ERROR STOP PLAYER IN LISTENER");
        }
      }
    });
  };

  const onPausePlay = async () => {
    setPlayerStatus("paused");
    await audioRecorderPlayer.pausePlayer();
  };

  const onResumePlay = async () => {
    await audioRecorderPlayer.resumePlayer();
  };

  const onSliderEditStart = () => {
    sliderEditing = true;
  };

  const onSliderEditEnd = () => {
    sliderEditing = false;
  };

  const onSliderEditing = (value) => {
    console.log('onSliderEditing:: ', value, sliderEditing);
    if (sound && playState == 'pause' && !sliderEditing) {
      sound.setCurrentTime(value);
      setPlaySeconds(value);
    }
  };

  // const playMusic = () => {
  //   console.log(sound, sound.isLoaded());
  //   timeout = setInterval(() => {
  //     if (sound != null && sound.isLoaded()) {
  //       sound.getCurrentTime((seconds, isPlaying) => {
  //         setPlaySeconds(seconds);
  //       });
  //     }
  //   }, 100);
  // };

  const onStartPlay = async (isPlay = false) => {
    console.log("path ", audioFile);
    console.log("sound onStartPlay ", sound);
    if (sound != null) {
      playMusic();
      sound.play(playComplete);
      setPlayState("playing");
    } else {
      let recordingUrl = audioFile;
      console.log("onStartPlay", recordingUrl);

      sound = new Sound(recordingUrl, "", (error) => {
        if (error) {
          console.log("failed to load the sound", error);
          return;
        }
        // loaded successfully
        console.log(
          "duration in seconds: " +
          sound.getDuration() +
          "number of channels: " +
          sound.getNumberOfChannels()
        );
        setPlayState(isPlay ? "playing" : "paused");
        setDuration(sound.getDuration());
        if (isPlay) {
          // Play the sound with an onEnd callback
          playMusic();
          sound.play(playComplete);
        }
      });
    }
  };

  const playComplete = (success) => {
    if (success) {
      console.log("successfully finished playing");
    } else {
      console.log("playback failed due to audio decoding errors");
      Alert.alert("Notice", "audio file error. (Error code : 2)");
    }
    if (timeout) {
      clearInterval(timeout);
    }
    setPlayState("paused");
    setPlaySeconds(0);
    sound.setCurrentTime(0);
  }

  const playMusic = () => {
    console.log(sound, sound.isLoaded());
    timeout = setInterval(() => {

      if (sound != null && sound.isLoaded() && !sliderEditing) {
        sound.getCurrentTime((seconds, isPlaying) => {
          setPlaySeconds(seconds);
        });
      }
    }, 100);
  }

  const pause = () => {
    console.log("sound ", sound);
    if (sound != null) {
      sound.pause();
    }
    setPlayState("paused");
  };

  const jumpPrev15Seconds = () => {
    jumpSeconds(-15);
  };

  const jumpNext15Seconds = () => {
    jumpSeconds(15);
  };

  const jumpSeconds = (secsDelta) => {
    if (sound) {
      sound.getCurrentTime((secs, isPlaying) => {
        let nextSecs = secs + secsDelta;
        if (nextSecs < 0) nextSecs = 0;
        else if (nextSecs > duration) nextSecs = duration;
        sound.setCurrentTime(nextSecs);
        setPlaySeconds(nextSecs);
      });
    }
  };

  const stopPlayer = async () => {
    setCurrentPositionSec(0);
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };

  const onStartRecord = async () => {
    console.log("onStartRecord");
    sound = null;
    setPlayWidth(0);
    if (Platform.OS === "android") {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        console.log("write external storage", grants);

        if (
          grants["android.permission.WRITE_EXTERNAL_STORAGE"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
          grants["android.permission.READ_EXTERNAL_STORAGE"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
          grants["android.permission.RECORD_AUDIO"] ===
          PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log("permissions granted");
          // const uri = await audioRecorderPlayer.startRecorder(path, audioSet);
          // audioRecorderPlayer.addRecordBackListener((e) => {
          //   console.log("Recording . . . ", e.currentPosition);
          //   setRecordSecs(e.currentPosition);
          //   setRecordTime(
          //     audioRecorderPlayer.mmss(Math.floor(e.currentPosition / 1000))
          //   );
          //   return;
          // });
          const uri = await audioRecorderPlayer.startRecorder(path, audioSet);
          audioRecorderPlayer.addRecordBackListener((e) => {
            // console.log("Recording . . . ", e.currentPosition);
            // console.log("isRecording . . . ", e);
            setStopped(false);
            setRecording(true);
            setRecordSecs(e.currentPosition);
            setRecordTime(
              audioRecorderPlayer.mmss(Math.floor(e.currentPosition / 1000))
            );
            // console.log("uri . . . ", uri);
            return;
          });
        } else {
          console.log("All required permissions not granted");
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    } else {
      const uri = await audioRecorderPlayer.startRecorder(path, audioSet);
      audioRecorderPlayer.addRecordBackListener((e) => {
        console.log("Recording . . . ", e.currentPosition);
        setStopped(false);
        setRecording(e.isRecording);
        setRecordSecs(e.currentPosition);
        setRecordTime(
          audioRecorderPlayer.mmss(Math.floor(e.currentPosition / 1000))
        );
        console.log("uri . . . ", uri);
        return;
      });
    }
  };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecordSecs(0);
    setRecordTime("00:00");
    setRecording(false);
    setStopped(true);
    setAudioFile(result);
    console.log("result ", result);
    sendData({
      text: null,
      audio: result,
      tab: null,
      image: null,
    });
  };

  const Camerapopen = async () => {
    mediaprovider
      .launchCamera()
      .then((obj) => {
        console.log(obj);
        console.log(obj.path);
        setMedialModal(false);
        var fileName;
        if (Platform.OS === "ios") {
          fileName =
            obj.path !== undefined &&
            obj.path.substring(obj.path.lastIndexOf("/") + 1, obj.length);
          setImageName(fileName);
        } else {
          fileName =
            obj.path !== undefined &&
            obj.path.substring(obj.path.lastIndexOf("/") + 1, obj.length);
          setImageName(fileName);
        }
        sendData({
          text: null,
          audio: null,
          tab: null,
          image: obj.path,
        });
      })
      .catch((error) => {
        setMedialModal(false);
      });
  };

  const Galleryopen = () => {
    mediaprovider
      .launchGellery()
      .then((obj) => {
        console.log(obj);
        console.log(obj.path);
        setMedialModal(false);
        if (Platform.OS === "ios") {
          setImageName(obj.filename);
        } else {
          var fileName =
            obj.path !== undefined &&
            obj.path.substring(obj.path.lastIndexOf("/") + 1, obj.length);
          setImageName(fileName);
        }
        sendData({
          text: null,
          audio: null,
          tab: null,
          image: obj.path,
        });
      })
      .catch((error) => {
        setMedialModal(false);
      });
  };

  const OnlineConsultation = () => <View style={{ flex: 1 }} />;

  const HomeVisit = () => <View style={{ flex: 1 }} />;
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(indexPosition ? indexPosition : 0);
  const [routes, setRoute] = useState([]);

  const setRoutes = () => {
    let tabArray = [];
    if (isFromHospital) {
      tabArray.push({
        key: "online",
        title: Lang_chg.OnlineConsultation[languageIndex],
      });
    } else if (!isFromHospital) {
      tabArray.push({
        key: "online",
        title: Lang_chg.OnlineCons[languageIndex],
      });
      tabArray.push({
        key: "home",
        title: Lang_chg.HomeVisit[languageIndex],
      });
    }
    //set route here
    setRoute(tabArray);
  };

  const renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case "online":
        return (
          <OnlineConsultation
            pageName={"online"}
            jumpTo={jumpTo}
            {...props}
            {...{ navigation }}
          />
        );
      case "home":
        return (
          <HomeVisit
            pageName={"home"}
            jumpTo={jumpTo}
            {...props}
            {...{ navigation }}
          />
        );
    }
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: Colors.Blue,
        height: (windowWidth * 1) / 100,
      }}
      activeColor={Colors.Blue}
      inactiveColor={Colors.lightGrey}
      style={{ backgroundColor: "#F1F2F4" }}
      labelStyle={{
        textTransform: "capitalize",
        fontSize: Font.large,
        alignSelf: 'flex-start',
        fontFamily: Font.Medium,
        alignSelf: "center",
      }}
      onTabPress={({ route, preventDefault }) => {
        console.log(route);
        setTabKey(route.key);
        sendData({
          text: null,
          audio: null,
          tab: route.key === "online" ? 0 : 1,
          image: null,
        });
        if (route.key === "online") {
          // preventDefault();
          // Do something else
        }
      }}
    />
  );
  const getAudioTimeString = (seconds) => {
    // console.log("seconds:: ", seconds);
    const h = parseInt(seconds / (60 * 60));
    const m = parseInt((seconds % (60 * 60)) / 60);
    const s = parseInt(seconds % 60);

    return (
      (h < 10 ? "0" + h : h) +
      ":" +
      (m < 10 ? "0" + m : m) +
      ":" +
      (s < 10 ? "0" + s : s)
    );
  };

  const currentTimeString = getAudioTimeString(playSeconds);
  const durationString = getAudioTimeString(duration);
  return (
    <View style={{ backgroundColor: Colors.White, marginTop: vs(7) }}>
      <View style={{ width: windowWidth, backgroundColor: Colors.backgroundcolor }}>
        <View style={{ paddingHorizontal: s(13), backgroundColor: Colors.backgroundcolor }}>

          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{
              width: layout.width,
              height: layout.height,
            }}
            style={{ height: 40, width: routes.length > 1 ? '100%' : '50%', }}
            renderTabBar={renderTabBar}
          />
        </View>
      </View>


      {/* ----------------------------------------- */}

      <View style={{ paddingVertical: vs(9), marginTop: vs(7), paddingHorizontal: s(13), width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>

        <View>
          <Text
            style={{
              fontFamily: Font.Medium,
              fontSize: Font.medium,
              alignSelf: 'flex-start',
              color: Colors.detailTitles
            }}>
            {Lang_chg.TalkToDoctor[languageIndex]}
          </Text>
          <Text
            style={{
              fontFamily: Font.Regular,
              fontSize: Font.small,
              alignSelf: 'flex-start',
              color: Colors.lightGrey,
            }}>
            {Lang_chg.Optional[languageIndex]}
          </Text>
        </View>

        <TouchableHighlight
          onPress={() => {
            setIsShowRecordingPanel(!isShowRecordingPanle)
            console.log(isShowRecordingPanle);
          }}
          underlayColor={Colors.Highlight}
          style={{
            height: 30,
            width: 30,
            borderRadius: 6,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <Image
            style={{
              height: s(15),
              width: vs(15),
              transform: [{ rotate: isShowRecordingPanle ? "180deg" : "0deg" }]
            }}
            resizeMode='contain'
            source={Icons.Down}
          />
        </TouchableHighlight>


      </View>

      <View style={{ width: '100%', alignSelf: 'center', height: vs(7), backgroundColor: Colors.backgroundcolor, marginTop: vs(6) }}></View>

      {
        isShowRecordingPanle &&
        <View style={{ paddingVertical: vs(9), marginTop: vs(7), width: '100%', }}>
          <View style={{ paddingHorizontal: s(13), }}>
            <Text
              style={{
                fontFamily: Font.Medium,
                fontSize: Font.medium,
                alignSelf: 'flex-start',
                color: Colors.detailTitles
              }}>
              {Lang_chg.TalkToDoctor[languageIndex]}
            </Text>

            <View
              style={{
                paddingVertical: vs(15),
                flexDirection: isStopped ? 'row' : 'column',
                justifyContent: 'space-around',
                alignItems: 'center'
              }}>
              {/* --------------Recoring Container-------------- */}


              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: 'row'
                }} >
                <TouchableOpacity
                  onPress={() => {
                    isRecording ? onStopRecord() : onStartRecord();
                  }}
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    alignSelf: 'center'

                  }}>
                  <Image
                    resizeMode="contain"
                    source={isRecording ? Icons.stop : Icons.mic}
                    style={{
                      width: (windowWidth * 10) / 100,
                      height: (windowWidth * 10) / 100,
                      borderColor: Colors.Theme,
                    }}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: Font.Regular,
                    fontSize: Font.medium,
                    marginLeft: (windowWidth * 1) / 100,
                  }}>
                  {recordTime}
                </Text>
              </View>

              {isStopped && (
                <View
                  style={{
                    width: "65%",
                    alignSelf: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center",
                    flexDirection: "row",
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      playState == "paused" ? onStartPlay(true) : pause();
                    }}
                  >
                    <Image
                      source={
                        playState == "paused" ? Icons.play : Icons.pause
                      }
                      style={{
                        width: (windowWidth * 10) / 100,
                        height: (windowWidth * 10) / 100,
                      }}
                    />
                  </TouchableOpacity>
                  <Slider
                    onTouchStart={onSliderEditStart}
                    onTouchEnd={onSliderEditEnd}
                    onValueChange={onSliderEditing}
                    value={playSeconds}
                    maximumValue={duration}
                    maximumTrackTintColor="gray"
                    minimumTrackTintColor={Colors.Theme}
                    thumbImage={sliderIcon}
                    style={{
                      flex: 1,
                      alignSelf: "center",
                      marginHorizontal: Platform.select({ ios: 5 }),
                      height: (windowWidth * 10) / 100,
                    }}
                  />
                </View>
              )}

            </View>
          </View>

          <View style={{ width: '100%', alignSelf: 'center', height: vs(1.5), backgroundColor: Colors.backgroundcolor, marginTop: vs(6) }}></View>

          <View
            style={{
              alignItems: "flex-start",
              alignSelf: "auto",
              paddingTop: vs(14),
              paddingHorizontal: s(13)
            }}>
            <View
              style={{
                width: "100%",
                alignSelf: "center",
              }}>
              <Text
                style={{
                  fontFamily: Font.Regular,
                  alignSelf: 'flex-start',
                  alignSelf: "baseline",
                  fontSize: Font.medium,
                }}
              >
                {Lang_chg.TalkToUs[languageIndex]}
              </Text>

              {/* ----------------Input------------- */}

              <View style={customStyle}>
                <TextInput
                  placeholder="Example symptoms… I am felling down, my head is paining from last 2 days."
                  onChangeText={(text) => {
                    sendData({
                      text: text,
                      audio: null,
                      tab: null,
                      image: null,
                    });
                    // this.SearchFilterFunction(text);
                  }}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  returnKeyLabel="done"
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                  }}
                  style={styles.textInputArea}
                  numberOfLines={10}
                  multiline={true}
                />
              </View>


              <TouchableOpacity
                onPress={() => {
                  // this.setState({ mediamodal: true });
                  setMedialModal(true);
                }}
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: 'center',
                  alignSelf: "center",
                  marginTop: vs(10)
                }}>
                <Image
                  resizeMode="contain"
                  source={Icons.Attachment}
                  style={{
                    width: 16,
                    height: 16,
                    marginRight: (windowWidth * 3) / 100,
                    borderColor: Colors.Theme,
                  }}
                />
                <Text
                  style={{
                    fontFamily: Font.Regular,
                    fontSize: Font.small,
                    color: Colors.darkText,
                    alignSelf: 'flex-start',
                  }}>
                  {imageName === ""
                    ? Lang_chg.Upload[languageIndex]
                    : imageName}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      }

      <Cameragallery
        mediamodal={mediaModal}
        Camerapopen={() => {
          Camerapopen();
        }}
        Galleryopen={() => {
          Galleryopen();
        }}
        Canclemedia={() => {
          setMedialModal(false);
          // this.setState({ mediamodal: false });
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  textInputFocus: {
    borderColor: Colors.Blue,
    backgroundColor: Colors.White,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: s(5),
    paddingVertical: vs(5),
    borderRadius: 8,
    marginTop: 10,
    width: '100%'
  },
  textInput: {
    borderColor: Colors.lightGrey,
    backgroundColor: Colors.White,
    borderWidth: 1,
    borderColor: Colors.Border,
    marginBottom: 10,
    paddingHorizontal: s(5),
    paddingVertical: vs(3),
    borderRadius: 8,
    marginTop: 10,
    width: '100%'

  },
  textInputArea: {
    fontSize: Font.small,
    fontFamily: Font.Regular,
    color: Colors.detailTitles,
    height: 100,
    width: "100%",
    justifyContent: "flex-start",
    textAlignVertical: "top",
    alignSelf: 'flex-start',
  },
  viewBarWrapper: {
    marginTop: -15,
    // marginHorizontal: 28,
    alignSelf: "stretch",
  },
  viewBar: {
    backgroundColor: "#ccc",
    height: 4,
    alignSelf: "stretch",
  },
  viewBarPlay: {
    backgroundColor: "blue",
    height: 4,
    width: 0,
  },
});
export default DoctorSymptomsAppointment;
