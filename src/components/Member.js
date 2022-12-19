import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableHighlight, Keyboard, } from "react-native";

import { Colors, Font } from "../Provider/Colorsfont";
import { windowWidth, deviceHeight, Lang_chg, config, localStorage } from "../Provider/utilslib/Utils";
import { Cross, dummyUser, Edit, Menu } from "../icons/SvgIcons/Index";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import Button from "./Button";



const Member = ({
    type,
    index,
    showTitle,
    patientDetails,
    navigation,
    propsData,
    showModal = () => { }
}) => {
    return (
        <TouchableOpacity onPress={() => {
            if (propsData.isPage == "providerList") {
                navigation.navigate("Booking", {
                    providerType: propsData.providerType,
                    providerId: propsData.providerId,
                    family_member_id: (patientDetails.patient_id != undefined) ? patientDetails.id : 0,
                    // isFromHospital: true,
                    // hospitalId: Item?.hospital_id,
                    indexPosition: 0
                })
            }

        }}>
            <View style={{ borderBottomWidth: type ? 1 : 0, borderBottomColor: Colors.Border, paddingTop: type ? 0 : vs(5) }}>
                {
                    ((type || index === 0) && showTitle) &&
                    <Text style={{ textAlign: config.textRotate, fontSize: Font.xsmall, fontFamily: Font.Medium, color: Colors.lightGrey }}>{type ? 'You' : 'Other Members'}</Text>
                }
                <View
                    style={{ flexDirection: 'row', width: '100%', alignSelf: 'center', marginTop: vs(6) }}>
                    <View style={{ width: '20%' }}>
                        <SvgXml xml={dummyUser} height={vs(55)} width={s(55)} />
                    </View>

                    <View style={{ width: '80%', borderBottomWidth: type ? 0 : 1, borderBottomColor: Colors.Border, paddingBottom: vs(20) }}>

                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ width: '94%', }}>
                                <View style={{ width: '68%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ textAlign: config.textRotate, fontSize: Font.small, fontFamily: Font.Medium, color: Colors.darkText }}>{patientDetails.name}</Text>
                                    <Text style={{ fontSize: 3.5, color: Colors.lightGrey }}>{'\u2B24'}</Text>
                                    <Text style={{ textAlign: config.textRotate, fontSize: Font.small, fontFamily: Font.Medium, color: Colors.lightGrey }}>{patientDetails.gender + ', ' + patientDetails.age}</Text>

                                </View>
                            </View>
                            <TouchableHighlight
                                onPress={() => {
                                    if (!type) {
                                        showModal(true)
                                    }
                                }}
                                underlayColor={Colors.Highlight}
                                style={{ width: '6%', height: vs(15), borderRadius: 3, alignItems: 'center', justifyContent: 'center' }}>
                                {
                                    showTitle ?
                                        <SvgXml xml={Menu} height={vs(11)} width={s(2.85)} />
                                        :
                                        <SvgXml xml={Edit} />
                                }
                            </TouchableHighlight>
                        </View>

                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: vs(10) }}>
                            <View style={{ width: '94%', flexDirection: 'row' }}>
                                <View style={{ flex: 1, borderEndWidth: 1, borderEndColor: Colors.Border }}>
                                    <Text style={{ textAlign: config.textRotate, fontSize: Font.xsmall, fontFamily: Font.Regular, color: Colors.lightGrey }}>{'Appointent Bookings'}</Text>
                                    <Text style={{ textAlign: config.textRotate, fontSize: Font.medium, fontFamily: Font.Medium, marginTop: vs(4), color: Colors.detailTitles }}>{patientDetails.appointment_count}</Text>
                                </View>

                                <View style={{ flex: 1, borderEndWidth: 1, borderEndColor: Colors.Border, justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ width: '80%' }}>
                                        <Text style={{ textAlign: config.textRotate, fontSize: Font.xsmall, fontFamily: Font.Regular, color: Colors.lightGrey }}>{'Doctor Consul.'}</Text>
                                        <Text style={{ textAlign: config.textRotate, fontSize: Font.medium, fontFamily: Font.Medium, marginTop: vs(4), color: Colors.detailTitles }}>{patientDetails.dc_count}</Text>
                                    </View>
                                </View>

                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ width: '80%' }}>
                                        <Text style={{ textAlign: config.textRotate, fontSize: Font.xsmall, fontFamily: Font.Regular, color: Colors.lightGrey }}>{'Lab Tests'}</Text>
                                        <Text style={{ textAlign: config.textRotate, fontSize: Font.medium, fontFamily: Font.Medium, marginTop: vs(4), color: Colors.detailTitles }}>{patientDetails.lab_count}</Text>
                                    </View>
                                </View>

                            </View>
                        </View>

                    </View>
                </View>
            </View>
        </TouchableOpacity>

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
        paddingTop: vs(40),
        paddingBottom: vs(20),
        paddingHorizontal: s(11),
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

export default Member;


