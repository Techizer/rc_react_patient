import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, ScrollView, StyleSheet, TouchableHighlight, Keyboard, FlatList, } from "react-native";
import Modal from "react-native-modal";
import HTMLView from "react-native-htmlview";
import { SvgXml } from "react-native-svg";
import { s, vs } from "react-native-size-matters";

import { Colors, Font } from "../Provider/Colorsfont";
import { windowWidth, deviceHeight, Lang_chg, config, localStorage, Icons, windowHeight } from "../Provider/utilslib/Utils";
import { Cross, dummyUser, Edit } from "../icons/SvgIcons/Index";



const FilterBottomSheet = ({
    visible,
    onRequestClose,
    data
}) => {

    const [docType, setDocType] = useState(-1)
    const [consultType, setConsultType] = useState(-1)
    const [experience, setExperience] = useState(-1)

    return (
        <Modal
            isVisible={visible}
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
                        textAlign: config.textRotate,
                        color: Colors.darkText

                    }}>{Lang_chg.Advance_Filter[config.language]}</Text>

                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginTop: vs(20), marginBottom: vs(20) }}>

                    {/* <Text
                        style={{
                            fontSize: Font.small,
                            fontFamily: Font.Regular,
                            textAlign: config.textRotate,
                            color: Colors.lightGrey,
                            paddingRight: s(20)

                        }}>{Lang_chg.Gender[config.language]}</Text> */}

                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        data={['All', 'Doctor', 'Hospital Doctor']}
                        ItemSeparatorComponent={() => {
                            return (
                                <View style={{ width: s(25) }} />
                            )
                        }}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            setDocType(index)
                                        }}
                                        style={{
                                            height: s(16),
                                            width: s(16),
                                            borderRadius: s(16),
                                            borderWidth: index === docType ? 5 : 1,
                                            borderColor: index === docType ? Colors.Blue : Colors.lightGrey
                                        }}>

                                    </TouchableOpacity>
                                    <Text
                                        style={{
                                            fontSize: Font.small,
                                            fontFamily: Font.Regular,
                                            textAlign: config.textRotate,
                                            color: Colors.lightGrey,
                                            marginLeft: s(8)

                                        }}>{item}</Text>
                                </View>

                            );
                        }}
                    />
                </View>

                {/* -------------------- */}

                <Text
                    style={{
                        fontSize: Font.small,
                        fontFamily: Font.Regular,
                        textAlign: config.textRotate,
                        color: Colors.darkText,
                        marginBottom: vs(12)

                    }}>{Lang_chg.Consult_Type[config.language]}</Text>
                <View style={styles.dropdownContainer}>

                    <Text
                        style={{
                            fontSize: Font.small,
                            fontFamily: Font.Regular,
                            textAlign: config.textRotate,
                            color: Colors.darkText,

                        }}>{'All Speciality'}</Text>
                </View>

                {/* -------------------- */}

                <View style={{ width: '100%', marginTop: vs(20), }}>
                    <Text
                        style={{
                            fontSize: Font.small,
                            fontFamily: Font.Regular,
                            textAlign: config.textRotate,
                            color: Colors.darkText,
                            marginBottom: vs(12)

                        }}>{Lang_chg.Consult_Type[config.language]}</Text>

                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        data={['All', 'Online', 'Home Visit']}
                        ItemSeparatorComponent={() => {
                            return (
                                <View style={{ width: s(25) }} />
                            )
                        }}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            setConsultType(index)
                                        }}
                                        style={{
                                            height: s(16),
                                            width: s(16),
                                            borderRadius: s(16),
                                            borderWidth: index === consultType ? 5 : 1,
                                            borderColor: index === consultType ? Colors.Blue : Colors.lightGrey
                                        }}>

                                    </TouchableOpacity>
                                    <Text
                                        style={{
                                            fontSize: Font.small,
                                            fontFamily: Font.Regular,
                                            textAlign: config.textRotate,
                                            color: Colors.lightGrey,
                                            marginLeft: s(8)

                                        }}>{item}</Text>
                                </View>

                            );
                        }}
                    />

                </View>

                {/* -------------------- */}

                <View style={{ width: '100%', marginTop: vs(20), }}>
                    <Text
                        style={{
                            fontSize: Font.small,
                            fontFamily: Font.Regular,
                            textAlign: config.textRotate,
                            color: Colors.darkText,
                            marginBottom: vs(12)

                        }}>{Lang_chg.Doc_Exp[config.language]}</Text>

                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        data={['All', '5 Yr+', '10 Yr+', '15 Yr+', '25 Yr+']}
                        ItemSeparatorComponent={() => {
                            return (
                                <View style={{ width: s(16) }} />
                            )
                        }}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            setExperience(index)
                                        }}
                                        style={{
                                            height: s(16),
                                            width: s(16),
                                            borderRadius: s(16),
                                            borderWidth: index === experience ? 5 : 1,
                                            borderColor: index === experience ? Colors.Blue : Colors.lightGrey
                                        }}>

                                    </TouchableOpacity>
                                    <Text
                                        style={{
                                            fontSize: Font.small,
                                            fontFamily: Font.Regular,
                                            textAlign: config.textRotate,
                                            color: Colors.lightGrey,
                                            marginLeft: s(8)

                                        }}>{item}</Text>
                                </View>

                            );
                        }}
                    />

                </View>
            </View>

        </Modal>



    )
}
const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
        backdropColor: 'pink',
    },
    modalContainer: {
        width: windowWidth,
        height: deviceHeight - 300,
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
        height: s(30),
        width: s(30),
        borderRadius: s(50),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: vs(30),
        right: s(11),
    },
    dropdownContainer: {
        width: '100%',
        height: vs(35),
        backgroundColor: Colors.White,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.Border,
        paddingHorizontal:s(10),
        justifyContent:'center'
    }


});

export default FilterBottomSheet;


