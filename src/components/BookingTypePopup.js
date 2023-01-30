import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, ScrollView, StyleSheet, TouchableHighlight, Keyboard, FlatList, } from "react-native";
import Modal from "react-native-modal";
import HTMLView from "react-native-htmlview";
import { SvgXml } from "react-native-svg";
import { s, vs } from "react-native-size-matters";

import { Colors, Font } from "../Provider/Colorsfont";
import { windowWidth, windowHeight, Button, LangProvider } from "../Provider/Utils/Utils";
import { Cross, dummyUser, Edit } from "../Icons/Index";
import { useSelector } from "react-redux";



const BookingTypePopup = ({
    visible,
    onRequestClose,
    providerType,
    onselect = () => { },
    data
}) => {
    const { languageIndex } = useSelector(state => state.StorageReducer)
    let isBtnOne = false;
    let isBtnTwo = false;
    useEffect(() => {
        if (providerType == 'nurse') {
            isBtnOne = data?.task_base_enable == '0' ? false : true
            isBtnTwo = data?.hour_base_enable == '0' ? false : true
        } else {
            isBtnOne = data?.taskbase_enable == '0' ? false : true
            isBtnTwo = data?.packagebase_enable == '0' ? false : true
        }
    }, [])
    return (
        <Modal
            isVisible={visible}
            statusBarTranslucent={true}
            animationIn='fadeInUpBig'
            animationOut='fadeOutDownBig'
            deviceWidth={windowWidth}
            animationInTiming={350}
            animationOutTimixng={350}
            // onBackButtonPress={onRequestClose}
            hasBackdrop={true}
            useNativeDriver={true}
            useNativeDriverForBackdrop={true}
            // backdropColor='rgba(0,0,0,0.8)'
            style={{ margin: 0 }} >


            <View style={styles.modalContainer}>
                <TouchableHighlight
                    onPress={onRequestClose}
                    underlayColor={Colors.Highlight}
                    style={styles.closeContainer}
                >
                    <SvgXml xml={Cross} height={vs(19)} width={s(18)} />
                </TouchableHighlight>

                <Text
                    style={{
                        fontSize: Font.large,
                        fontFamily: Font.SemiBold,
                        alignSelf: 'flex-start',
                        color: Colors.darkText

                    }}>{LangProvider.SelectAppointmentType[languageIndex]}</Text>


                <Button
                    text={providerType == 'nurse' ? LangProvider.TaskBase[languageIndex] : LangProvider.Lab_Test_Booking[languageIndex]}
                    onPress={() => {
                        providerType == 'nurse' ? onselect('task') : onselect('test')
                    }}
                    btnStyle={{ marginTop: vs(15) }}
                    disable={isBtnOne}
                />

                <Button
                    text={providerType == 'nurse' ? LangProvider.HourBase[languageIndex] : LangProvider.Lab_Package_Booking[languageIndex]}
                    onPress={() => {
                        providerType == 'nurse' ? onselect('hour') : onselect('package')
                    }}
                    btnStyle={{ marginTop: vs(15) }}
                    disable={isBtnTwo}
                />

            </View>

        </Modal>



    )
}
const styles = StyleSheet.create({

    modalContainer: {
        width: windowWidth,
        height: windowHeight / 3,
        backgroundColor: Colors.White,
        borderRadius: 25,
        paddingTop: vs(55),
        paddingBottom: vs(20),
        paddingHorizontal: s(13),
        position: 'absolute',
        bottom: 0,
        zIndex: 999

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
    }
});

const HTMLstyles = StyleSheet.create({
    h4: {
        color: "#0888D1",
        fontSize: (windowWidth * 4.5) / 100,
    },
    h5: {
        color: "#0888D1",
        fontSize: (windowWidth * 4.3) / 100,
        fontFamily: Font.Medium,
    },
});

export default BookingTypePopup;


