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
var Sound = require("react-native-sound");

const audioRecorderPlayer = new AudioRecorderPlayer();
let arr = [];
var sound = null;

const DoctorSymptomsAppointment = (props) => {
  // console.log("sound ::::", sound);
  const { indexPosition, isFromHospital, sendData } = props;
  const { navigation } = props;
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

  useEffect(() => {
    FontAwesome.getImageSource("circle", 20, Colors.Theme).then(
      (source) => {
        setSliderIcon(source);
        // this.setState({ sliderIcon: source });
      }
    );
    setRoutes();
    _onFinishedPlayingSubscription = SoundPlayer.addEventListener(
      "FinishedPlaying",
      ({ success }) => {
        console.log("finished playing", success);
      }
    );
    _onFinishedLoadingSubscription = SoundPlayer.addEventListener(
      "FinishedLoading",
      ({ success }) => {
        console.log("finished loading", success);
      }
    );
    _onFinishedLoadingFileSubscription = SoundPlayer.addEventListener(
      "FinishedLoadingFile",
      ({ success, name, type }) => {
        console.log("finished loading file", success, name, type);
        SoundPlayer.play();
      }
    );
    _onFinishedLoadingURLSubscription = SoundPlayer.addEventListener(
      "FinishedLoadingURL",
      ({ success, url }) => {
        console.log("finished loading url", success, url);
      }
    );
    return () => {
      sound = null;
    };
  }, []);
  sliderEditing = false;
  const customStyle = isFocused ? styles.textInputFocus : styles.textInput;
  var dirs = RNFetchBlob.fs.dirs;
  var path = Platform.select({
    ios: "hello.m4a",
    android: `${dirs.CacheDir}/hello.mp3`,
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
    console.log('value value:: ', value, sliderEditing);
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

  playMusic = () => {
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
            console.log("isRecording . . . ", e);
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

  Camerapopen = async () => {
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
  Galleryopen = () => {
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
        title: Lang_chg.OnlineConsultation[config.language],
      });
    } else if (!isFromHospital) {
      tabArray.push({
        key: "online",
        title: Lang_chg.OnlineCons[config.language],
      });
      tabArray.push({
        key: "home",
        title: Lang_chg.HomeVisit[config.language],
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
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
      }}
      activeColor={Colors.Blue}
      inactiveColor={Colors.lightGrey}
      style={{ backgroundColor: "#F1F2F4" }}
      labelStyle={{
        textTransform: "capitalize",
        fontSize: (windowWidth * 4) / 100,
        textAlign: config.textalign,
        fontFamily: Font.fontmedium,
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
    <View style={{ flex: 1 }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{
          width: layout.width,
          height: layout.height,
        }}
        renderTabBar={renderTabBar}
      />
      <View
        style={{
          width: "100%",
          shadowOpacity: 0.3,
          shadowColor: "#000",
          shadowOffset: { width: 2, height: 2 },
          elevation: 2,
          shadowRadius: 2,
          // marginTop: (windowWidth * 1.5) / 100,
          marginBottom: (windowWidth * 1.5) / 100,
          backgroundColor: "#fff",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            // alignItems: "center",
            // alignSelf: "center",
            justifyContent: "flex-start",
            paddingTop: (windowWidth * 4) / 100,
          }}
        >
          <View
            style={{
              width: "75%",
              height: isStopped ? 150 : 100,
              marginStart: 20,
            }}
          >
            <Text
              style={{
                fontFamily: Font.fontregular,
                fontSize: Font.name,
                textAlign: config.textRotate,
                alignSelf: "baseline",
                fontSize: (windowWidth * 3.5) / 100,
              }}
            >
              {Lang_chg.TalkToDoctor[config.language]}
            </Text>
            <Text
              style={{
                fontFamily: Font.fontregular,
                fontSize: Font.name,
                textAlign: config.textRotate,
                alignSelf: "baseline",
                color: Colors.lightGrey,
                fontSize: (windowWidth * 3.5) / 100,
              }}
            >
              {Lang_chg.Optional[config.language]}
            </Text>
            {isStopped && (
              <View
                style={{
                  width: "120%",
                  alignSelf: "center",
                  justifyContent: "center",
                  borderBottomWidth: (windowWidth * 0.3) / 100,
                  borderColor: Colors.gainsboro,
                  paddingVertical: (windowWidth * 4.5) / 100,
                  alignItems: "center",
                  alignContent: "center",
                  // flex: 1,
                  flexDirection: "row",
                  marginTop: 60,
                  marginLeft: 50,
                }}
              >
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
                    // transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }]
                  }}
                />
              </View>
            )}
          </View>

          <View
            style={{
              justifyContent: "center",
              width: (windowWidth * 16) / 100,
              alignItems: "center",
              position: "absolute",
              right: 20,
              top: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                isRecording ? onStopRecord() : onStartRecord();
              }}
              style={{
                height: (windowWidth * 20) / 100,
                borderRadius: (windowWidth * 2) / 100,
                borderColor: Colors.Theme,
                width: (windowWidth * 20) / 100,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                backgroundColor: "#d1e9f6",
                alignSelf: "center",
                right: -20,
              }}
            >
              <Image
                resizeMode="contain"
                source={isRecording ? Icons.stop : Icons.mic}
                style={{
                  width: (windowWidth * 10) / 100,
                  height: (windowWidth * 10) / 100,
                  marginLeft: (windowWidth * 3) / 100,
                  marginRight: (windowWidth * 3) / 100,
                  borderColor: Colors.Theme,
                }}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: Font.fontregular,
                fontSize: (windowWidth * 3) / 100,
                alignSelf: "flex-end",
                right: -5,
                marginTop: (windowWidth * 2) / 100,
              }}
            >
              {recordTime}
            </Text>
          </View>
        </View>
        <View
          style={{
            borderWidth: 1,
            borderColor: Colors.gainsboro,
            width: "100%",
            marginTop: (windowWidth * 1.5) / 100,
            marginBottom: (windowWidth * 1.5) / 100,
          }}
        />
        <View
          style={{
            alignItems: "flex-start",
            alignSelf: "auto",
            paddingTop: (windowWidth * 4) / 100,
          }}
        >
          <View
            style={{
              width: "91%",
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                fontFamily: Font.fontregular,
                fontSize: Font.name,
                textAlign: config.textRotate,
                alignSelf: "baseline",
                fontSize: (windowWidth * 3.5) / 100,
              }}
            >
              {Lang_chg.TalkToUs[config.language]}
            </Text>
            <Text
              style={{
                fontFamily: Font.fontregular,
                fontSize: Font.name,
                textAlign: config.textRotate,
                alignSelf: "baseline",
                color: Colors.lightGrey,
                fontSize: (windowWidth * 3.5) / 100,
              }}
            >
              {Lang_chg.Optional[config.language]}
            </Text>
            <View style={customStyle}>
              <TextInput
                // ref={(text) => {
                //   this.textdata = text;
                // }}
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
                height: (windowWidth * 20) / 100,
                justifyContent: "flex-start",
                flexDirection: "row",
                alignSelf: "center",
              }}
            >
              <Image
                resizeMode="contain"
                source={Icons.upload}
                style={{
                  width: 20,
                  height: 20,
                  marginRight: (windowWidth * 3) / 100,
                  borderColor: Colors.Theme,
                }}
              />
              <Text
                style={{
                  fontFamily: Font.fontregular,
                  fontSize: (windowWidth * 3) / 100,
                  textAlign: "auto",
                  alignItems: "baseline",
                  marginTop: 5,
                }}
              >
                {imageName === ""
                  ? Lang_chg.Upload[config.language]
                  : imageName}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    backgroundColor: Colors.white2,
    borderBottomWidth: 1,
    borderWidth: 1,
    marginBottom: 10,
    marginTop: 10,
    paddingLeft: 5,
    paddingRight: 5,
  },
  textInput: {
    borderColor: Colors.lightGrey,
    backgroundColor: Colors.white2,
    borderBottomWidth: 1,
    borderWidth: 1,
    marginBottom: 10,
    marginTop: 10,
    paddingLeft: 5,
    paddingRight: 5,
  },
  textInputArea: {
    fontSize: (windowWidth * 4) / 100,
    fontFamily: Font.ques_fontfamily,
    color: "#8F98A7",
    height: 100,
    width: "90%",
    justifyContent: "flex-start",
    textAlign: "center",
    textAlignVertical: "top",
    color: "#000",
    // paddingTop: 10,
    paddingVertical: (windowWidth * 2) / 100,
    textAlign: config.textalign,
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
