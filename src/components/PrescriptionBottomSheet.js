import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet, Modal, TouchableWithoutFeedback, TouchableHighlight, Keyboard, FlatList, TextInput, ScrollView, } from "react-native";

import { Colors, Font } from "../Provider/Colorsfont";
import { windowWidth, windowHeight, LangProvider, config } from "../Provider/Utils/Utils";
import { Cross, dummyUser, Edit } from "../Icons/Index";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import { useSelector } from "react-redux";



const PrescriptionBottomSheet = ({
    visible,
    onRequestClose,
    data
}) => {

    const { languageIndex } = useSelector(state => state.StorageReducer)

    return (
        <View style={{ flex: 1 }} >
            <Modal
                animationType='slide'
                visible={visible}
                transparent
                presentationStyle='overFullScreen'
            >


                <View style={[styles.mainContainer]}>

                    <View style={[styles.subContainer]}>
                        <TouchableOpacity
                            onPress={onRequestClose}
                            underlayColor={Colors.Highlight}
                            style={styles.closeContainer}
                        >
                           <SvgXml xml={Cross} height={vs(12)} width={s(12)} />
                        </TouchableOpacity>
                        <View style={styles.modalContainer}>
                            <Text
                                style={{
                                    fontSize: Font.large,
                                    fontFamily: Font.SemiBold,
                                    alignSelf: 'flex-start',
                                    color: Colors.darkText,
                                    paddingHorizontal:s(13)

                                }}>{LangProvider.PRESCRIPTION[languageIndex]}
                            </Text>

                            <Image
                                source={{
                                    uri: data,
                                }}
                                style={{
                                    resizeMode: "cover",
                                    width: "100%",
                                    height: (windowHeight * 25) / 100,
                                }}
                                resizeMode='contain'
                            />

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
        height: windowHeight / 2.1,
        position: 'absolute',
        bottom: 0,
        zIndex: 9999,
    },
    modalContainer: {
        width: windowWidth,
        height: windowHeight / 2.5,
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

});

export default PrescriptionBottomSheet;


