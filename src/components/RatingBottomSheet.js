import React, { useEffect, useRef, useState } from "react";
import { Text, Modal, View, Image, StyleSheet, TouchableOpacity, Keyboard, FlatList, TextInput, Pressable, } from "react-native";

import { Colors, Font } from "../Provider/Colorsfont";
import { windowWidth, LangProvider, Button, Icons, msgProvider, windowHeight } from "../Provider/Utils/Utils";
import { Cross, } from "../Icons/Index";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import StarRating from "react-native-star-rating";
import { useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";



const RatingBottomSheet = ({
    visible,
    onRequestClose,
    onSelectRating = () => { },
    value,
    reviewValue,
    onChangeText,
    rateProvider
}) => {

    const { languageIndex } = useSelector(state => state.StorageReducer)
    const insets = useSafeAreaInsets()
    const inputRef = useRef()

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
                                Keyboard.dismiss()
                                onRequestClose()
                            }}
                            style={styles.closeContainer}>
                            <SvgXml xml={Cross} height={vs(12)} width={s(12)} />
                        </TouchableOpacity>

                        <View style={styles.modalContainer}>


                            <KeyboardAwareScrollView
                                // keyboardOpeningTime={200}
                                extraScrollHeight={50}
                                enableOnAndroid={true}
                                keyboardShouldPersistTaps='handled'
                                contentContainerStyle={{
                                    justifyContent: 'center',
                                    paddingBottom: vs(15),
                                    paddingHorizontal: s(13),
                                }}
                                showsVerticalScrollIndicator={false}>
                                <Text
                                    style={{
                                        fontSize: Font.large,
                                        fontFamily: Font.SemiBold,
                                        alignSelf: 'flex-start',
                                        color: Colors.darkText

                                    }}>{LangProvider.Rate_Appointment[languageIndex]}</Text>
                                <View style={{ marginTop: vs(25) }}>

                                    <View
                                        style={{
                                            width: "100%",
                                            alignSelf: "center",
                                        }}>

                                        <View
                                            style={{
                                                width: "55%",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <StarRating
                                                disabled={false}
                                                fullStar={Icons.fillStar}
                                                emptyStar={Icons.outlineStar}
                                                maxStars={5}
                                                starSize={40}
                                                rating={parseInt(value)}
                                                selectedStar={(rating) => {
                                                    onSelectRating(rating)
                                                }}
                                            />
                                        </View>


                                        <Pressable
                                            onPress={() => inputRef.current.focus()}
                                            style={styles.textInput}>
                                            <TextInput
                                                ref={inputRef}
                                                style={{
                                                    color: Colors.Black,
                                                    fontSize: Font.medium,
                                                    alignSelf: 'flex-start',
                                                    // height: '100%',
                                                    fontFamily: Font.Regular,
                                                }}
                                                maxLength={200}
                                                multiline
                                                placeholder={LangProvider.Write_review[languageIndex]}
                                                placeholderTextColor={Colors.lightGrey}
                                                onChangeText={onChangeText}
                                                value={reviewValue}
                                                keyboardType="default"
                                                returnKeyLabel="done"
                                                returnKeyType="done"
                                                onSubmitEditing={() => Keyboard.dismiss()}
                                            />

                                        </Pressable>

                                        <Text
                                            style={{
                                                fontSize: 10,
                                                color: reviewValue.length == 200 ? Colors.Red : Colors.DarkGrey,
                                                alignSelf: 'flex-end',
                                                marginTop: vs(5)
                                            }}>
                                            {reviewValue.length}/200{" "}
                                        </Text>
                                    </View>
                                </View>


                            </KeyboardAwareScrollView>

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
                                    text={LangProvider.submitbtntext[languageIndex]}
                                    onPress={() => {
                                        if (value == '' || reviewValue == '') {
                                            msgProvider.showError('Please give rating and write a review');
                                        } else {
                                            rateProvider()
                                            onRequestClose()
                                        }

                                    }}
                                />
                            </View>
                        </View>
                    </View>

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
    textInput: {
        borderColor: Colors.Border,
        backgroundColor: Colors.White,
        borderWidth: 1,
        borderRadius: 6,
        marginTop: (windowWidth * 7) / 100,
        paddingHorizontal: s(7),
        paddingVertical: s(0),
        height: (windowWidth * 30) / 100,
        // backgroundColor:'pink'
    },

});

export default RatingBottomSheet;


