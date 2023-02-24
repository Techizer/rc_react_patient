import React, { useEffect, useRef, useState } from "react";
import { Text, Modal, TouchableOpacity, View, ScrollView, StyleSheet, TouchableHighlight, Keyboard, FlatList, Platform, } from "react-native";
import { SvgXml } from "react-native-svg";
import { s, vs } from "react-native-size-matters";

import { Colors, Font } from "../Provider/Colorsfont";
import { windowWidth, windowHeight, Button, LangProvider } from "../Provider/Utils/Utils";
import { Cross, dummyUser, Edit } from "../Icons/Index";
import { useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";



const BookingTypePopup = ({
    visible,
    onRequestClose,
    providerType,
    onselect = () => { },
    data
}) => {
    const { languageIndex } = useSelector(state => state.StorageReducer)
    const [isBtnOneDisable, setIsBtnOneDisable] = useState(false)
    const [isBtnTwoDisable, setIsBtnTwoDisable] = useState(false)
    const insets = useSafeAreaInsets()
    useEffect(() => {
        // console.log(data?.task_base_enable);
        // console.log(data?.hour_base_enable);
        // console.log(data?.task_base_enable);
        // console.log(data?.packagebase_enable);

        if (providerType == 'nurse') {
            if (data?.task_base_enable == '0') {
                setIsBtnOneDisable(false)
            } else {
                setIsBtnOneDisable(true)
            }
            if (data?.hour_base_enable == '0') {
                setIsBtnTwoDisable(false)
            } else {
                setIsBtnTwoDisable(true)
            }
        } else {
            if (data?.task_base_enable == '0') {
                setIsBtnOneDisable(false)
            } else {
                setIsBtnOneDisable(true)
            }
            if (data?.packagebase_enable == '0') {
                setIsBtnTwoDisable(false)
            } else {
                setIsBtnTwoDisable(true)
            }
        }
    }, [providerType])


    return (

        <View style={{ flex: 1 }}>
            <Modal
                animationType='slide'
                visible={visible}
                transparent
                presentationStyle='overFullScreen'
            >

                <View style={styles.mainContainer}>

                    <View style={styles.subContainer}>
                        <TouchableOpacity
                            onPress={onRequestClose}
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
                                    paddingHorizontal: s(13),

                                }}>{LangProvider.SelectAppointmentType[languageIndex]}</Text>


                            <View style={{
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
                                    text={providerType == 'nurse' ? LangProvider.TaskBase[languageIndex] : LangProvider.Lab_Test_Booking[languageIndex]}
                                    onPress={() => {
                                        providerType == 'nurse' ? onselect('task') : onselect('test')
                                    }}
                                    btnStyle={{ marginBottom: vs(10) }}
                                    disable={isBtnOneDisable}
                                />

                                <Button
                                    text={providerType == 'nurse' ? LangProvider.HourBase[languageIndex] : LangProvider.Lab_Package_Booking[languageIndex]}
                                    onPress={() => {
                                        providerType == 'nurse' ? onselect('hour') : onselect('package')
                                    }}
                                    disable={isBtnTwoDisable}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal >
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
        height: windowHeight / 3,
        position: 'absolute',
        bottom: 0,
        zIndex: 9999,
    },
    modalContainer: {
        width: windowWidth,
        height: windowHeight / 3.8,
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


export default BookingTypePopup;


