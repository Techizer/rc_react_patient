import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, ScrollView, StyleSheet, TouchableHighlight, Keyboard, FlatList, } from "react-native";
import Modal from "react-native-modal";
import HTMLView from "react-native-htmlview";
import { SvgXml } from "react-native-svg";
import { s, vs } from "react-native-size-matters";

import { Colors, Font } from "../Provider/Colorsfont";
import { windowWidth, config, windowHeight } from "../Provider/Utils/Utils";
import { Cross, dummyUser, Edit } from "../Icons/Index";



const ListBottomSheet = ({
    visible,
    onRequestClose,
    data,
    title,
    style,
    selectedIssue = () => { }
}) => {

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


            <View style={[styles.modalContainer, style]}>
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
                        textAlign: config.textRotate,
                        color: Colors.darkText

                    }}>{title}</Text>


                <FlatList
                    data={data}
                    contentContainerStyle={{ paddingTop: vs(10) }}
                    renderItem={({ item, index }) => {
                        return (
                            <View>
                                <TouchableOpacity
                                    onPress={() => {
                                        onRequestClose()
                                        selectedIssue(item.name)
                                    }}>
                                    <View
                                        style={{
                                            width: "100%",
                                            alignSelf: "center",
                                            justifyContent: "flex-end",
                                        }}>
                                        <View
                                            style={{
                                                width: "98%",
                                                borderBottomColor: Colors.backgroundcolor,
                                                borderBottomWidth: index === (data.length - 1) ? 0 : 1,
                                                paddingVertical: vs(8),
                                            }}>
                                            <Text
                                                style={{
                                                    color: Colors.Black,
                                                    textAlign: config.textRotate,
                                                    fontSize: Font.large
                                                }} >
                                                {item.name}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                />
            </View>

        </Modal>



    )
}
const styles = StyleSheet.create({

    modalContainer: {
        width: windowWidth,
        height: windowHeight / 1.5,
        backgroundColor: Colors.White,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingTop: vs(40),
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

export default ListBottomSheet;


