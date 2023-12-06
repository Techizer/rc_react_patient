import React, { useEffect, useMemo, useRef, useState } from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet, TextInput, Keyboard, Pressable } from "react-native";
import { SvgXml } from "react-native-svg";
import { s, vs } from "react-native-size-matters";

import { Colors, Font } from "../Provider/Colorsfont";
import { windowWidth, deviceHeight, LangProvider, countries } from "../Provider/Utils/Utils";
import { Icons, rightArrow, } from "../Icons/Index";
import { useSelector } from "react-redux";



const NumberInput = ({
    details,
    onOpen = () => { },
    onSelect = () => { },
    onChangeText = () => { }
}) => {

    const {
        contentAlign,
        languageIndex,
        loggedInUserDetails,
    } = useSelector(state => state.StorageReducer)

    const numberRef = useRef()

    const styles = useMemo(() => {
        return StyleSheet.create({

            inputMainContainer: {
                width: "90%",
                height: windowWidth / 6,
                alignItems: 'flex-end',
                alignSelf: 'center',
                flexDirection: 'row',
                // alignItems:'center',
                marginTop: windowWidth / 10,
                zIndex: 999
            },
            inputContainer: {
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                height: windowWidth / 7.5,
                borderColor: Colors.Border,
                borderRadius: 8,
                borderBottomLeftRadius: details.showCountries ? 0 : 8,
                borderWidth: 1,
                backgroundColor: Colors.White
            },

            codeContainer: {
                width: '32%',
                height: '100%',
            },

            numberContainer: {
                width: '65%',
                height: '100%',
                justifyContent: 'center',
                paddingHorizontal: '2%'
            },
            separator: {
                width: 1,
                height: '65%',
                backgroundColor: Colors.Border
            },

            titleContainer: {
                position: 'absolute',
                paddingHorizontal: 5,
                // paddingVertical: 1,
                backgroundColor: Colors.White,
                top: 5,
                left: '3%',
                zIndex: 9999
            },
            title: {
                fontSize: Font.small,
                fontFamily: Font.Regular,
                includeFontPadding: false,
                color: Colors.Primary
            },
            flag: {
                height: windowWidth / 14,
                width: windowWidth / 14,
            },
            inputText: {
                fontSize: Font.medium,
                fontFamily: Font.Regular,
                includeFontPadding: false,
                color: Colors.Black
            },
            countryContainer: {
                paddingVertical: 10,
                // height: 100,
                width: '100%',
                position: 'absolute',
                top: '99%',
                left: -1,
                backgroundColor: Colors.White,
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                borderLeftColor: Colors.Border,
                borderRightColor: Colors.Border,
                borderBottomColor: Colors.Border,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderBottomWidth: 1

            }
        });
    }, [])


    return (

        <View style={[styles.inputMainContainer,]}>
            <View style={styles.titleContainer}>
                <Text allowFontScaling={false} style={styles.title}>{'Phone Number'}</Text>
            </View>

            <View style={[styles.inputContainer]}>

                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => onOpen()}
                    style={[styles.codeContainer]}>

                    <View style={{
                        height: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: '10%',
                        justifyContent: 'space-between',
                    }}>
                        <Image source={details.code === '966' ? Icons.Saudia : Icons.UAE} style={styles.flag} />
                        <Text
                            allowFontScaling={false}
                            style={styles.inputText}>
                            {`+${details.code}`}

                        </Text>
                        <SvgXml xml={rightArrow} height={s(13)} width={s(13)} style={{ transform: [{ rotate: details.showCountries ? "270deg" : "90deg" }] }} />
                    </View>

                    {
                        details.showCountries &&
                        <View style={styles.countryContainer}>
                            {
                                countries.map((item, index) => {
                                    return (
                                        <Pressable
                                            key={item.code}
                                            onPress={() => {
                                                onSelect(item)
                                            }}
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                paddingHorizontal: '10%',
                                                marginTop: index == 0 ? 0 : 5
                                            }}>
                                            <Image source={item.icon} style={styles.flag} />
                                            <Text
                                                allowFontScaling={false}
                                                style={styles.inputText}>
                                                {`+${item.code}`}

                                            </Text>
                                        </Pressable>
                                    )
                                })
                            }
                        </View>
                    }

                </TouchableOpacity>

                <View style={{ justifyContent: 'center' }}>
                    <View style={[styles.separator]} />
                </View>

                <View style={[styles.numberContainer]}>

                    <TextInput
                        maxLength={9}
                        ref={numberRef}
                        style={{ textAlign: contentAlign, }}
                        onChangeText={(val) => onChangeText(val)}
                        placeholder={LangProvider.Phone[languageIndex]}
                        editable={true}
                        blurOnSubmit={false}
                        autoCapitalize="none"
                        value={details.number}
                        allowFontScaling={false}
                        keyboardType='decimal-pad'
                        returnKeyType='done'
                        onSubmitEditing={() => Keyboard.dismiss()}
                    />
                </View>

            </View>
        </View>

    )
}


export default NumberInput;


