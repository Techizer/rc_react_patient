import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableHighlight, Keyboard, FlatList, TextInput, Pressable, } from "react-native";
import Modal from "react-native-modal";

import { Colors, Font } from "../Provider/Colorsfont";
import { windowWidth, deviceHeight, Lang_chg, config, Button, Icons, msgProvider, windowHeight } from "../Provider/utilslib/Utils";
import { Cross, dummyUser, Edit } from "../Icons/Index";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import StarRating from "react-native-star-rating";



const RatingBottomSheet = ({
    visible,
    onRequestClose,
    onSelectRating = () => { },
    value,
    reviewValue,
    onChangeText,
    rateProvider
}) => {

    const [reviewText, setReviewText] = useState('')
    const [textLength, setTextLength] = useState(0)
    const inputRef = useRef()

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
                        textAlign: config.textRotate,
                        color: Colors.darkText

                    }}>{Lang_chg.Rate_Appointment[config.language]}</Text>

                <KeyboardAwareScrollView
                    // keyboardOpeningTime={200}
                    extraScrollHeight={50}
                    enableOnAndroid={true}
                    keyboardShouldPersistTaps='handled'
                    contentContainerStyle={{
                        justifyContent: 'center',
                        paddingBottom: vs(15),
                    }}
                    showsVerticalScrollIndicator={false}>

                    <View style={{ marginTop: vs(15) }}>

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
                                        textAlign: config.textalign,
                                        // height: '100%',
                                        fontFamily: Font.Regular,
                                    }}
                                    maxLength={200}
                                    multiline
                                    placeholder={Lang_chg.Write_review[config.language]}
                                    placeholderTextColor={Colors.lightGrey}
                                    onChangeText={onChangeText}
                                    value={reviewValue}
                                    keyboardType="default"
                                    returnKeyLabel="done"
                                    returnKeyType="done"
                                    onSubmitEditing={() => Keyboard.dismiss()}
                                />

                                {/* {this.state.emailfocus == true && (
                                        <View
                                            style={{
                                                position: "absolute",
                                                backgroundColor: "White",
                                                left: (windowWidth * 4) / 100,
                                                top: (-windowWidth * 3) / 100,
                                                paddingHorizontal: (windowWidth * 1) / 100,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: "#0057A5",
                                                    textAlign: config.textalign,
                                                }}
                                            >
                                                {Lang_chg.Write_review[config.language]}
                                            </Text>
                                        </View>
                                    )} */}
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

                            <Button
                                text={Lang_chg.submitbtntext[config.language]}
                                onPress={() => {
                                    if (value == '' || reviewValue == '') {
                                        msgProvider.showError('Please give rating and write a review');
                                    } else {
                                        rateProvider()
                                        onRequestClose()
                                    }

                                }}
                                btnStyle={{ marginTop: vs(30) }}
                            />
                        </View>
                    </View>


                </KeyboardAwareScrollView>
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
    },

    textInput: {
        borderColor: Colors.Border,
        backgroundColor: Colors.White,
        borderWidth: 1,
        borderRadius: 6,
        marginTop: (windowWidth * 7) / 100,
        paddingHorizontal: s(7),
        paddingVertical: s(0),
        height: (windowWidth * 30) / 100
    },

});

export default RatingBottomSheet;


