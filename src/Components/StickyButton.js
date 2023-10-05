
import React, { useEffect } from "react";
import { StyleSheet, Text, Image, TouchableOpacity, View, Platform } from "react-native";
import { Colors, Icons, Font, windowHeight, config, windowWidth } from '../Provider/Utils/Utils';
import {
    BallIndicator,
    BarIndicator,
    DotIndicator,
    MaterialIndicator,
    PacmanIndicator,
    PulseIndicator,
    SkypeIndicator,
    UIActivityIndicator,
    WaveIndicator,
} from 'react-native-indicators';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { vs } from "react-native-size-matters";
export const StickyButton = ({
    text,
    customStyles,
    onPress,
    image,
    onLoading,
    btnStyle,
    disable
}) => {
    const insets = useSafeAreaInsets()

    return (
        <View
            style={{
                width: "100%",
                position: 'absolute',
                bottom: 0,
                backgroundColor: Colors.white_color,
                paddingTop: (windowWidth * 2) / 100,
                paddingBottom: Platform.OS == 'ios' ? insets.bottom - vs(5) : (windowWidth * 2) / 100,
                alignItems: "center",
                zIndex: 99999,
            }}>
            <TouchableOpacity
                disabled={disable}
                onPress={onPress}
                style={[styles.mainContainer, { backgroundColor: disable ? Colors.Border : Colors.Theme, }, btnStyle]}>
                {
                    onLoading ?
                        <SkypeIndicator color={Colors.White} size={16} count={3} />
                        :
                        <Text style={[styles.buttonText]}>{text}</Text>
                }

            </TouchableOpacity>
        </View>
    );
};
StickyButton.defaultProps = { customStyles: {} };

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        height: 40,
        alignSelf: 'center',
        borderRadius: (windowWidth * 2) / 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: Colors.White,
        fontFamily: Font.Medium,
        fontSize: Font.medium,
        textAlign: config.textalign,
        alignSelf: 'center',
    },
    buttonText1: {
        color: Colors.Blue,
        fontFamily: Font.Medium,
        fontSize: Font.medium,
        textAlign: config.textalign,
        alignSelf: 'center',
    }
});

