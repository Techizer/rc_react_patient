import React, { useState, useRef } from "react";
import { Text, View, TouchableOpacity, ActivityIndicator, StyleSheet, LayoutAnimation, UIManager, Image } from "react-native";
import Video from "react-native-video";
import Slider from "@react-native-community/slider";
import { Icons } from "../Icons/Index";
import { Colors, Font, windowWidth } from "../Provider/Utils/Utils";
import { s } from "react-native-size-matters";

UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);

const volumeControlTime = 3000;

export const AudioPlayer = (props) => {
    const { url, containerStyle, repeatOnComponent, repeatOffComponent } = props;
    const [paused, setPaused] = useState(true);

    const videoRef = useRef(null);
    const controlTimer = useRef(0);

    const [totalLength, setTotalLength] = useState(0);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [loading, setLoading] = useState(false);
    const [volume, setVolume] = useState(0.7);
    const [volumeControl, setVolumeControl] = useState(false);
    const [repeat, setRepeat] = useState(false);

    const toHHMMSS = (secs) => {
        const sec_num = parseInt(secs, 10);
        const hours = Math.floor(sec_num / 3600);
        const minutes = Math.floor(sec_num / 60) % 60;
        const seconds = sec_num % 60;

        return [hours, minutes, seconds]
            .map((v) => (v < 10 ? "0" + v : v))
            .filter((v, i) => v !== "00" || i > 0)
            .join(":");
    }


    const onSeek = (time) => {
        // console.log('onseek');
        time = Math.round(time);
        videoRef && videoRef?.current.seek(time);
        setCurrentPosition(time);
        setPaused(false);
    };

    const fixDuration = (data) => {
        setLoading(false);
        setTotalLength(Math.floor(data.duration));
    };

    const setTime = (data) => {
        // console.log('setTime', data.currentTime);
        setCurrentPosition(Math.floor(data.currentTime) + 0.1);
    };

    const togglePlay = () => {
        setPaused(!paused);
    };

    const toggleRepeat = () => {
        setRepeat(!repeat);
    };

    const toggleVolumeControl = () => {
        setVolumeTimer(!volumeControl);
        LayoutAnimation.easeInEaseOut();
        setVolumeControl(!volumeControl);
    };

    const setVolumeTimer = (setTimer = true) => {
        clearTimeout(controlTimer.current);
        controlTimer.current = 0;
        if (setTimer) {
            controlTimer.current = setTimeout(() => {
                LayoutAnimation.easeInEaseOut();
                setVolumeControl(false);
            }, volumeControlTime);
        }
    };

    const onVolumeChange = (vol) => {
        setVolumeTimer();
        setVolume(vol);
    };

    const resetAudio = () => {
        console.log('on end');
        setTimeout(() => {
            setPaused(true);
            setCurrentPosition(0);
            videoRef && videoRef?.current.seek(0);
        }, 350);
    };

    return (
        <View style={[containerStyle]}>
            <Video
                // source={{ uri: 'https://file-examples.com/storage/fe3f7d476663e91319de1d9/2017/11/file_example_MP3_700KB.mp3' }}
                source={{ uri: url }}
                ref={videoRef}
                playInBackground={false}
                audioOnly={true}
                playWhenInactive={false}
                paused={paused}
                onEnd={resetAudio}
                onLoad={fixDuration}
                onLoadStart={() => setLoading(true)}
                onProgress={setTime}
                volume={volume}
                repeat={false}
                style={{ height: 0, width: 0 }}
            />


            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>

                <TouchableOpacity onPress={togglePlay}>
                    <Image
                        source={paused ? Icons.play : Icons.pause}
                        style={styles.playIcon}
                    />
                </TouchableOpacity>

                <View style={styles.sliderContainer}>
                    <Slider
                        minimumValue={0}
                        maximumValue={Math.max(totalLength, 1, currentPosition)}
                        minimumTrackTintColor={Colors.Theme}
                        maximumTrackTintColor={'grey'}
                        onSlidingComplete={onSeek}
                        value={currentPosition}
                    />

                </View>
            </View>
            <View style={styles.durationContainer}>
                <Text style={[styles.timeText, { color: Colors.Theme }]}>
                    {toHHMMSS(currentPosition)}
                </Text>
                <Text style={[styles.timeText, { color: Colors.DarkGrey }]}>
                    {toHHMMSS(totalLength)}
                </Text>
            </View>

        </View>
    );
};



export const styles = StyleSheet.create({
    playBtn: {
        justifyContent: "center",
        alignItems: "center",
    },
    sliderContainer: {
        width: "82%",
    },
    slider: {
        width: "100%",
        height: (windowWidth * 10) / 100,
    },
    durationContainer:
    {
        width: '82%',
        flexDirection: "row",
        justifyContent: "space-between",
        alignSelf: 'flex-end',
    },

    timeText: {
        fontSize: Font.medium,
    },
    playIcon: { height: 35, width: 35, resizeMode: 'contain' },
});
