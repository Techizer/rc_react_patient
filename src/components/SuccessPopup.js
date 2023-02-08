import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableHighlight, Keyboard, FlatList, } from "react-native";
import Modal from "react-native-modal";

import { Colors, Font } from "../Provider/Colorsfont";
import {
    windowWidth, LangProvider, Icons,
} from "../Provider/Utils/Utils";
import { s, vs } from "react-native-size-matters";
import OutlinedButton from "./OutlinedButton";
import { useSelector } from "react-redux";




const SuccessPopup = ({
    visible,
    onRequestClose,
    type,
    navigation
}) => {

    const { languageIndex } = useSelector(state => state.StorageReducer)

    useEffect(() => {
        // console.log('........................',type);
    })


    return (
        <Modal
            isVisible={visible}
            animationIn='fadeInRightBig'
            animationOut='fadeOutLeftBig'
            deviceWidth={windowWidth}
            animationInTiming={350}
            animationOutTimixng={350}
            // onBackButtonPress={onRequestClose}
            hasBackdrop={true}
            useNativeDriver={true}
            useNativeDriverForBackdrop={true}
        // backdropColor='rgba(0,0,0,0.8)'
        >


            <View style={styles.modalContainer}>
                {/* <TouchableHighlight
                    onPress={onRequestClose}
                    underlayColor={Colors.Highlight}
                    style={styles.closeContainer}
                >
                    <SvgXml xml={Cross} height={vs(19)} width={s(18)} />
                </TouchableHighlight> */}


                <Image
                    style={{
                        width: (windowWidth * 15) / 100,
                        height: (windowWidth * 15) / 100,
                        alignSelf: "center",
                    }}
                    resizeMode='contain'
                    source={Icons.Success}
                />
                <Text
                    style={{
                        fontSize: Font.xxlarge,
                        marginTop: (windowWidth * 5) / 100,
                        fontFamily: Font.Medium,
                        color: Colors.detailTitles,
                        alignSelf: 'center'
                    }}>
                    {LangProvider.thank[languageIndex]}
                </Text>

                <Text
                    style={{
                        fontSize: Font.small,
                        marginTop: (windowWidth * 3) / 100,
                        fontFamily: Font.Regular,
                        alignSelf: 'flex-start',
                        color: Colors.lightGrey,
                    }}>
                    {LangProvider.Appoinment_Success[languageIndex]}
                </Text>


                <OutlinedButton
                    text={type === 'doctor' ? LangProvider.GoToConslt[languageIndex] : type === 'lab' ? LangProvider.GoToLabs[languageIndex] : LangProvider.GoToAppointment[languageIndex]}
                    btnStyle={{ marginTop: (windowWidth * 6) / 100, height: (windowWidth * 8) / 100, width: (windowWidth * 40) / 100 }}
                    onPress={() => {
                        onRequestClose()
                        navigation.navigate(type === 'doctor' ? 'Consultation' : type === 'lab' ? 'LabTest' : 'Apointment')
                    }}
                />
            </View>



        </Modal>



    )
}
const styles = StyleSheet.create({

    modalContainer: {
        width: (windowWidth * 90) / 100,
        height: (windowWidth * 60) / 100,
        backgroundColor: Colors.White,
        borderRadius: 12,
        paddingVertical: (windowWidth * 10) / 100,
        paddingHorizontal: s(13),
        zIndex: 999,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'

    },
    closeContainer: {
        height: s(35),
        width: s(35),
        borderRadius: s(50),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: vs(30),
        right: s(11),
        zIndex: 999
    },
    Title: {
        fontSize: 20,
        fontFamily: Font.Regular,
        color: Colors.Black,
    },
    Desc: {
        fontSize: 16,
        fontFamily: Font.Regular,
        color: Colors.Secondary,
    },
});

export default SuccessPopup;


