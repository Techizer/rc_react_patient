import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet, TouchableHighlight, } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { SvgXml } from "react-native-svg";
import { s, vs } from "react-native-size-matters";

import { Colors, Font } from "../Provider/Colorsfont";
import { windowWidth, deviceHeight, Lang_chg, config } from "../Provider/utilslib/Utils";
import { Cross, dummyUser, Edit, Menu, roundCheck } from "../Icons/Index";
import { useSelector } from "react-redux";



const Member = ({
    type,
    index,
    patientDetails,
    navigation,
    propsData,
    showModal = () => { },
    selected,
    selectedMember = () => { },
    editable = () => { },
    isLoading
}) => {

    const { loggedInUserDetails, appLanguage } = useSelector(state => state.StorageReducer)

    useEffect(() => {
        // console.log({ patientDetails });
    }, [])
    return (
        isLoading ?
            (
                <View style={{
                    height: vs(100),
                    width: windowWidth,
                    backgroundColor: Colors.White,
                    alignItems: "center",
                    marginTop: vs(7),
                    paddingVertical: vs(8)
                }}>

                    <View
                        style={{ flexDirection: 'row', width: '100%', alignSelf: 'center', marginTop: vs(6) }}>
                        <View style={{ width: '20%' }}>
                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item width={s(55)} height={s(55)} borderRadius={s(55)} />
                            </SkeletonPlaceholder>
                        </View>

                        <View style={{ width: '80%', borderBottomWidth: type ? 0 : 1, borderBottomColor: Colors.Border, paddingBottom: vs(20) }}>

                            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                <View style={{ width: '94%', }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <SkeletonPlaceholder>
                                            <SkeletonPlaceholder.Item width={(windowWidth * 35) / 100} height={s(10)} borderRadius={s(4)} />
                                        </SkeletonPlaceholder>
                                    </View>
                                </View>
                            </View>

                            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: vs(10) }}>
                                <View style={{ width: '94%', flexDirection: 'row' }}>
                                    <View style={{ flex: 1, borderEndWidth: 1, borderEndColor: Colors.Border }}>
                                        <SkeletonPlaceholder>
                                            <SkeletonPlaceholder.Item width={(windowWidth * 20) / 100} height={(windowWidth * 7) / 100} borderRadius={s(4)} />
                                        </SkeletonPlaceholder>
                                        <SkeletonPlaceholder>
                                            <SkeletonPlaceholder.Item width={(windowWidth * 14) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} style={{ marginTop: vs(5) }} />
                                        </SkeletonPlaceholder>
                                    </View>

                                    <View style={{ flex: 1, borderEndWidth: 1, borderEndColor: Colors.Border, justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{ width: '80%' }}>
                                            <SkeletonPlaceholder>
                                                <SkeletonPlaceholder.Item width={(windowWidth * 20) / 100} height={(windowWidth * 7) / 100} borderRadius={s(4)} />
                                            </SkeletonPlaceholder>
                                            <SkeletonPlaceholder>
                                                <SkeletonPlaceholder.Item width={(windowWidth * 14) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} style={{ marginTop: vs(5) }} />
                                            </SkeletonPlaceholder>
                                        </View>
                                    </View>

                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{ width: '80%' }}>
                                            <SkeletonPlaceholder>
                                                <SkeletonPlaceholder.Item width={(windowWidth * 20) / 100} height={(windowWidth * 7) / 100} borderRadius={s(4)} />
                                            </SkeletonPlaceholder>
                                            <SkeletonPlaceholder>
                                                <SkeletonPlaceholder.Item width={(windowWidth * 14) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} style={{ marginTop: vs(5) }} />
                                            </SkeletonPlaceholder>
                                        </View>
                                    </View>

                                </View>
                            </View>

                        </View>
                    </View>
                </View>
            )
            :

            <TouchableOpacity
                style={{ backgroundColor: (type && selected === -1 && (propsData.isPage == "providerList" || propsData.isPage == 'providerDetails')) ? Colors.appointmentdetaillightblue : (!type && selected === index && (propsData.isPage == "providerList" || propsData.isPage == 'providerDetails')) ? Colors.appointmentdetaillightblue : Colors.White }}
                onPress={() => {
                    selectedMember(type ? -1 : index)
                }}>


                <View style={{ borderBottomWidth: type ? 1 : 0, borderBottomColor: Colors.Border, paddingTop: type ? 0 : vs(5) }}>
                    {
                        ((type || index === 0)) &&
                        <Text style={{ alignSelf: 'flex-start', fontSize: Font.xsmall, fontFamily: Font.Medium, color: Colors.lightGrey }}>{type ? 'You' : 'Other Members'}</Text>
                    }
                    {
                        ((type && selected === -1 && (propsData.isPage == "providerList" || propsData.isPage == 'providerDetails')) || (!type && selected === index && (propsData.isPage == "providerList" || propsData.isPage == 'providerDetails'))) &&
                        (
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', width: '16%', position: 'absolute', right: 10, paddingVertical: (windowWidth * 2) / 100 }}>
                                <SvgXml xml={roundCheck} />
                                <Text style={{ alignSelf: 'flex-start', fontSize: Font.xsmall, fontFamily: Font.Medium, color: Colors.Theme }}>{Lang_chg.Default[appLanguage == 'en' ? 0 : 1]}</Text>
                            </View>
                        )
                    }
                    <View
                        style={{ flexDirection: 'row', width: '100%', alignSelf: 'center', marginTop: vs(6) }}>
                        <View style={{ width: '22%' }}>
                            {
                                (patientDetails?.image != '' && patientDetails?.image != null) ?
                                    <Image source={{ uri: config.img_url3 + patientDetails?.image }} style={{
                                        height: vs(55),
                                        width: vs(55),
                                        borderRadius: vs(55),
                                    }} />
                                    :
                                    <SvgXml xml={dummyUser} height={vs(55)} width={s(55)} />
                            }
                        </View>

                        <View style={{ width: '78%', borderBottomWidth: type ? 0 : 1, borderBottomColor: Colors.Border, paddingBottom: vs(20) }}>

                            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                <View style={{ width: '70%', }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ width: '20%'}}>
                                            <Text numberOfLines={1} style={{ alignSelf: 'flex-start', fontSize: Font.small, fontFamily: Font.Medium, color: Colors.darkText, }}>{patientDetails?.name}</Text>
                                        </View>
                                        <View style={{ width: '80%', flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 3.5, color: Colors.lightGrey, marginLeft: (windowWidth * 2) / 100 }}>{'\u2B24'}</Text>
                                            <Text style={{ alignSelf: 'flex-start', fontSize: Font.small, fontFamily: Font.Medium, color: Colors.lightGrey, marginLeft: (windowWidth * 2) / 100 }}>{(patientDetails?.gender === '0' ? "Male" : 'Female') + ', ' + patientDetails?.age + (type ? '' : ' Year')}</Text>
                                        </View>
                                    </View>
                                </View>
                                {
                                    (propsData?.isPage != "providerList" && propsData?.isPage != 'providerDetails') &&
                                    <TouchableHighlight
                                        onPress={() => {
                                            if (!type) {
                                                showModal(true)
                                                selectedMember(index)
                                                editable(false)
                                            } else {
                                                navigation.navigate("EditProfile")
                                            }
                                        }}
                                        underlayColor={Colors.Highlight}
                                        style={{ width: '6%', height: vs(15), borderRadius: 3, alignItems: 'center', justifyContent: 'center' }}>
                                        <SvgXml xml={Menu} height={vs(11)} width={s(2.85)} />

                                    </TouchableHighlight>
                                }

                            </View>

                            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: vs(10) }}>
                                <View style={{ width: '94%', flexDirection: 'row' }}>
                                    <View style={{ flex: 1, borderEndWidth: 1, borderEndColor: Colors.Border }}>
                                        <Text style={{ alignSelf: 'flex-start', fontSize: Font.xsmall, fontFamily: Font.Regular, color: Colors.lightGrey, height: vs(20) }}>{'Appointent Bookings'}</Text>
                                        <Text style={{ alignSelf: 'flex-start', fontSize: Font.medium, fontFamily: Font.Medium, marginTop: vs(4), color: Colors.detailTitles }}>{patientDetails?.appointment_count}</Text>
                                    </View>

                                    <View style={{ flex: 1, borderEndWidth: 1, borderEndColor: Colors.Border, alignItems: 'center' }}>
                                        <View style={{ width: '80%' }}>
                                            <Text style={{ alignSelf: 'flex-start', fontSize: Font.xsmall, fontFamily: Font.Regular, color: Colors.lightGrey, height: vs(20) }}>{'Doctor Consul.'}</Text>
                                            <Text style={{ alignSelf: 'flex-start', fontSize: Font.medium, fontFamily: Font.Medium, marginTop: vs(4), color: Colors.detailTitles }}>{patientDetails?.dc_count}</Text>
                                        </View>
                                    </View>

                                    <View style={{ flex: 1, alignItems: 'center' }}>
                                        <View style={{ width: '80%' }}>
                                            <Text style={{ alignSelf: 'flex-start', fontSize: Font.xsmall, fontFamily: Font.Regular, color: Colors.lightGrey, height: vs(20) }}>{'Lab Tests'}</Text>
                                            <Text style={{ alignSelf: 'flex-start', fontSize: Font.medium, fontFamily: Font.Medium, marginTop: vs(4), color: Colors.detailTitles }}>{patientDetails?.lab_count}</Text>
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

export default Member;


