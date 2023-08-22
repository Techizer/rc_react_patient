import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet, Modal, TouchableHighlight, Keyboard, Alert, Platform, } from "react-native";
import { Colors, Font } from "../Provider/Colorsfont";
import {
    windowWidth, LangProvider, config, Icons, Button, apifuntion, msgProvider, windowHeight,
} from "../Provider/Utils/Utils";
import { Cross, dummyUser, Edit } from "../Icons/Index";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import AuthInputBoxSec from "./AuthInputBoxSec";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from "react-redux";
import { Address } from "../Redux/Actions";
import { useSafeAreaInsets } from "react-native-safe-area-context";




const MediaOptions = ({
    visible,
    onRequestClose,
    selectedOption = () => { }
}) => {

    const { address, loggedInUserDetails, guest, languageIndex, contentAlign, } = useSelector(state => state.StorageReducer)
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false)

    const insets = useSafeAreaInsets()

    const options = [
        {
            id: '1',
            title: 'Document',
            icon: Icons.Document
        },
        {
            id: '2',
            title: 'Camera',
            icon: Icons.Camera
        },
        {
            id: '3',
            title: 'Gallery',
            icon: Icons.Gallery
        },
        // {
        //     id: '4',
        //     title: 'Audio',
        //     icon: Icons.Audio
        // },
    ]

    return (
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
                        // zIndex: 999
                    }}
                    blurType='ultraThinMaterialDark'
                    blurAmount={15}
                    reducedTransparencyFallbackColor="white"
                /> */}

            <View style={styles.mainContainer}>

                <View style={styles.subContainer}>
                    <TouchableOpacity
                        onPress={onRequestClose}
                        style={styles.closeContainer}
                    >
                        <SvgXml xml={Cross} height={vs(12)} width={s(12)} />
                    </TouchableOpacity>
                    <View style={styles.modalContainer}>

                        <View
                            style={{
                                flexDirection: 'row',
                                width: '100%',
                                flexWrap: 'wrap',
                                alignSelf: 'center',
                                justifyContent: 'center'
                            }}>
                            {
                                options.map((item, index) => {
                                    return (
                                        <View key={index} style={{ alignItems: 'center', marginLeft: index == 0 ? 0 : (windowWidth * 8) / 100 }}>
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                onPress={() => {
                                                    selectedOption(item.id)
                                                }}
                                                style={{
                                                    marginBottom: (windowWidth * 2) / 100,
                                                    height: (windowWidth * 14) / 100,
                                                    width: (windowWidth * 14) / 100,
                                                    borderRadius: 100,
                                                    backgroundColor: Colors.backgroundcolor,
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}>

                                                <Image
                                                    resizeMode="contain"
                                                    source={item.icon}
                                                    style={{
                                                        width: (windowWidth * 6) / 100,
                                                        height: (windowWidth * 6) / 100,
                                                    }}
                                                />
                                            </TouchableOpacity>
                                            <Text style={{
                                                fontFamily: Font.Medium,
                                                fontSize: 10,
                                                color: Colors.Black
                                            }}>
                                                {item.title}
                                            </Text>
                                        </View>
                                    )
                                })
                            }
                        </View>

                    </View>
                </View>

            </View>

        </Modal>

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
        height: windowHeight / 3.7,
        position: 'absolute',
        bottom: 0,
        zIndex: 9999,
    },
    modalContainer: {
        width: windowWidth,
        height: windowHeight / 5,
        backgroundColor: Colors.White,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: vs(20),
        paddingHorizontal: s(13),
        alignItems: 'center',
        justifyContent: 'center',
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

export default MediaOptions;


