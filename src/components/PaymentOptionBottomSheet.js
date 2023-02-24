import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet, Modal, TouchableHighlight, Keyboard, FlatList, Alert, Platform, } from "react-native";

import { Colors, Font } from "../Provider/Colorsfont";
import {
    windowWidth, LangProvider, config, Icons, Button, apifuntion, msgProvider, windowHeight,
} from "../Provider/Utils/Utils";
import { Cross, dummyUser, Edit, Tabby, Tap } from "../Icons/Index";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";




const PaymentOptionBottomSheet = ({
    visible,
    onRequestClose,
    data,
    selectedPaymentMethod = () => { }
}) => {

    const { loggedInUserDetails, appLanguage, languageIndex, } = useSelector(state => state.StorageReducer)
    const dispatch = useDispatch()
    const insets = useSafeAreaInsets()
    const [title, setTitle] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [method, setMethod] = useState(-1)

    return (
        <View style={{ flex: 1 }}>
            <Modal
                animationType='slide'
                visible={visible}
                transparent
                presentationStyle='overFullScreen'
            >

                <View style={[styles.mainContainer]}>

                    <View style={[styles.subContainer]}>
                        <TouchableOpacity
                            onPress={() => {
                                onRequestClose()
                                // resetState()
                            }}
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
                                    paddingHorizontal: s(13)

                                }}>{LangProvider.Payment_Option[languageIndex]}</Text>

                            <View style={{ marginTop: vs(15), paddingHorizontal: s(13), }}>

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={[styles.paymentContainer, { borderColor: method == 1 ? Colors.Theme : Colors.Border, }]}
                                    onPress={() => {
                                        setMethod(1)
                                    }}
                                >
                                    <View style={[styles.paymentTypeContainer]}>
                                        <SvgXml xml={Tap} height={(windowWidth * 22) / 100} width={(windowWidth * 22) / 100} />
                                    </View>

                                    <View style={{
                                        width: '70%',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingLeft: s(15)
                                    }}>
                                        <View>
                                            <Text
                                                style={{
                                                    fontSize: Font.small,
                                                    fontFamily: Font.Regular,
                                                    color: Colors.detailTitles,
                                                    alignSelf: 'flex-start',
                                                    marginBottom: vs(3)

                                                }}>{LangProvider.PaymentOneTitle[languageIndex]}
                                                <Text
                                                    style={{
                                                        fontSize: Font.small,
                                                        fontFamily: Font.SemiBold,
                                                        color: Colors.detailTitles,
                                                    }}>{'Tap'}
                                                </Text>
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: Font.xsmall,
                                                    fontFamily: Font.Regular,
                                                    color: Colors.lightGrey,
                                                    alignSelf: 'flex-start'

                                                }}>{LangProvider.PaymentOneDesc[languageIndex]}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => {
                                                setMethod(1)
                                            }}
                                            style={{
                                                height: s(16),
                                                width: s(16),
                                                borderRadius: s(16),
                                                borderWidth: method == 1 ? 5 : 1,
                                                borderColor: method == 1 ? Colors.Blue : Colors.lightGrey
                                            }}>

                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={[styles.paymentContainer, { marginTop: (windowWidth * 3) / 100, borderColor: method == 2 ? Colors.Theme : Colors.Border, }]}
                                    onPress={() => {
                                        setMethod(2)
                                    }}
                                >
                                    <View style={[styles.paymentTypeContainer]}>
                                        <SvgXml xml={Tabby} height={(windowWidth * 22) / 100} width={(windowWidth * 22) / 100} />
                                    </View>

                                    <View style={{
                                        width: '70%',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingLeft: s(15)
                                    }}>
                                        <View>
                                            <Text
                                                style={{
                                                    fontSize: Font.small,
                                                    fontFamily: Font.Regular,
                                                    color: Colors.detailTitles,
                                                    alignSelf: 'flex-start',
                                                    marginBottom: vs(3)

                                                }}>{LangProvider.PaymentTwoTitle[languageIndex]}
                                                <Text
                                                    style={{
                                                        fontSize: Font.small,
                                                        fontFamily: Font.SemiBold,
                                                        color: Colors.detailTitles,
                                                    }}>{'Tabby'}
                                                </Text>
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: Font.xsmall,
                                                    fontFamily: Font.Regular,
                                                    color: Colors.lightGrey,
                                                    alignSelf: 'flex-start'

                                                }}>{LangProvider.PaymentTwoDesc[languageIndex]}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => {
                                                setMethod(2)
                                            }}
                                            style={{
                                                height: s(16),
                                                width: s(16),
                                                borderRadius: s(16),
                                                borderWidth: method == 2 ? 5 : 1,
                                                borderColor: method == 2 ? Colors.Blue : Colors.lightGrey
                                            }}>

                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>


                            </View>

                            <View
                                style={{
                                    width: "100%",
                                    flexDirection:'row',
                                    justifyContent:'space-between',
                                    position: 'absolute',
                                    bottom: Platform.OS == 'ios' ? insets.bottom - 15 : 0,
                                    paddingHorizontal: '10%',
                                    backgroundColor: Colors.White,
                                    paddingVertical: (windowWidth * 2) / 100,
                                    alignItems: "center",
                                    borderTopWidth: 1,
                                    borderTopColor: Colors.Border,
                                }}>
                                <View style={{ alignItems: 'flex-start' }}>
                                    <Text
                                        style={{
                                            fontFamily: Font.Medium,
                                            fontSize: Font.xxlarge,
                                            color: Colors.Theme,
                                        }}>
                                        {data}
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: Font.Regular,
                                            fontSize: Font.small,
                                            color: Colors.detailTitles,
                                        }}>
                                        {LangProvider.Amount_Payable[languageIndex]}
                                    </Text>
                                </View>

                                <Button
                                    btnStyle={{ width: windowWidth / 2.5 }}
                                    text={LangProvider.ProceedToPay[languageIndex]}
                                    onPress={() => {
                                        if (method == -1) {
                                            msgProvider.showError('Please select a method to pay!')
                                        } else {
                                            onRequestClose()
                                            selectedPaymentMethod(method)
                                        }
                                    }}
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
        height: windowHeight / 1.9,
        position: 'absolute',
        bottom: 0,
        zIndex: 9999,
    },
    modalContainer: {
        width: windowWidth,
        height: windowHeight / 2.2,
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
    paymentContainer: {
        height: (windowHeight * 12) / 100,
        width: '100%',
        flexDirection: 'row',
        borderRadius: s(6),
        alignItems: 'center',
        // justifyContent:'center',
        borderWidth: 1,
        borderColor: Colors.Border,
        paddingHorizontal: s(6),
        paddingVertical: s(6),
    },
    paymentTypeContainer: {
        height: '100%',
        width: '30%',
        borderRadius: s(4),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E5E5E5'
    },

});

export default PaymentOptionBottomSheet;


