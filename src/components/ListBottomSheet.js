import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, Modal, StyleSheet, TouchableHighlight, Keyboard, FlatList, } from "react-native";
import { SvgXml } from "react-native-svg";
import { s, vs } from "react-native-size-matters";

import { Colors, Font } from "../Provider/Colorsfont";
import { windowWidth, config, windowHeight } from "../Provider/Utils/Utils";
import { Cross } from "../Icons/Index";



const ListBottomSheet = ({
    visible,
    onRequestClose,
    data,
    title,
    modal,
    sub,
    selectedIssue = () => { }
}) => {

    return (
        <View style={{ flex: 1 }}>
            <Modal
                animationType='slide'
                visible={visible}
                transparent
                presentationStyle='overFullScreen'
            >

                <View style={[styles.mainContainer]}>

                    <View style={[styles.subContainer, sub]}>
                        <TouchableOpacity
                            onPress={onRequestClose}
                            style={styles.closeContainer}
                        >
                            <SvgXml xml={Cross} height={vs(12)} width={s(12)} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={[styles.modalContainer, modal]}>

                    <Text
                        style={{
                            fontSize: Font.large,
                            fontFamily: Font.SemiBold,
                            alignSelf: 'flex-start',
                            color: Colors.darkText,
                            paddingHorizontal: s(13)

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
                                                        fontSize: Font.large,
                                                        alignSelf: 'flex-start',
                                                        paddingHorizontal: s(13)
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
        height: windowHeight / 1.35,
        position: 'absolute',
        bottom: 0,
        zIndex: 9999,
    },
    modalContainer: {
        width: windowWidth,
        height: windowHeight / 1.5,
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

export default ListBottomSheet;


