import AudioRecorderPlayer from "react-native-audio-recorder-player";

let audioRecorderPlayer = undefined;
let currentPath = undefined;
let currentCallback = () => {};
let currentPosition = 0;

const AUDIO_STATUS = {
  play: "play",
  begin: "begin",
  pause: "pause",
  resume: "resume",
  stop: "stop",
};

async function startPlayer(path, callback) {
  console.log({ currentPath, path });

  if (currentPath === undefined) {
    currentPath = path;
    currentCallback = callback;
  } else if (currentPath !== path) {
    if (audioRecorderPlayer !== undefined) {
      try {
        await stopPlayer();
      } catch (error) {
        console.log("ERROR STOP PLAYER TOP");
      }
    }
    currentPath = path;
    currentCallback = callback;
  }

  if (audioRecorderPlayer === undefined) {
    audioRecorderPlayer = new AudioRecorderPlayer();
  }

  try {
    const activePath = await audioRecorderPlayer.startPlayer(currentPath);
    // console.log({ activePath });
    console.log("activePath ", activePath);
    console.log("path ", path);
    console.log("currentPath ", currentPath);
    console.log("currentPosition ", currentPosition);
    currentCallback({
      status:
        currentPath === path && currentPosition > 0
          ? AUDIO_STATUS.resume
          : AUDIO_STATUS.begin,
      data: currentPosition,
    });
    audioRecorderPlayer.addPlayBackListener(async (e) => {
      currentPosition = e.currentPosition;
      currentCallback({
        status: AUDIO_STATUS.play,
        data: e,
      });
      if (e.currentPosition === e.duration) {
        try {
          await stopPlayer();
        } catch (error) {
          console.log("ERROR STOP PLAYER IN LISTENER");
        }
      }
      return;
    });
  } catch (error) {
    console.log({ "ERROR PLAY PLAYER": error });
  }
}

async function pausePlayer() {
  try {
    await audioRecorderPlayer.pausePlayer();
    audioRecorderPlayer.removePlayBackListener(); // <--- add this line
    currentCallback({ status: AUDIO_STATUS.pause });
  } catch (error) {
    console.log({ "ERROR PAUSE PLAYER": error });
  }
}

async function stopPlayer() {
  const isStop = await audioRecorderPlayer.stopPlayer();
  console.log({ isStop });
  audioRecorderPlayer.removePlayBackListener();
  currentPosition = 0;
  currentPath = undefined; // <----- added this line
  currentCallback({ status: AUDIO_STATUS.stop });
  audioRecorderPlayer = undefined;
}

export { AUDIO_STATUS, startPlayer, stopPlayer, pausePlayer };
