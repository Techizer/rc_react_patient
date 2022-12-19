import React, { useEffect, useRef, useState } from "react";
import { Text, TextInput, View, Image, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableHighlight, Keyboard, FlatList, } from "react-native";
import Modal from "react-native-modal";

import { Colors, Font } from "../Provider/Colorsfont";
import { windowWidth, deviceHeight, Lang_chg, config, localStorage, Icons, msgProvider, consolepro, apifuntion } from "../Provider/utilslib/Utils";
import { Cross, dummyUser, Edit } from "../icons/SvgIcons/Index";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import AuthInputBoxSec from "./AuthInputBoxSec";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Button from "./Button";
import Member from "./Member";
import OutlinedButton from "./OutlinedButton";
import NonEditableInput from "./NonEditableInput";



const ContactUsBottomSheet = ({
    visible,
    onRequestClose,
    Id
}) => {

    const [subject, setSubject] = useState('')
    const [desc, setDesc] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const subjectRef = useRef()
    const descRef = useRef()

    const submitIssue = async () => {
        let user_details = await localStorage.getItemObject("user_arr");
        let user_id = user_details["user_id"];
        let user_type = user_details["user_type"];
        if (!subject) {
            msgProvider.showError('Please write your subject');
            return false;
        }
        if (!desc) {
            msgProvider.showError('Please write your description');
            return false;
        }
        setIsLoading(true)
        let url = config.baseURL + "api-app-insert-need-help";
        var data = new FormData();
        data.append("user_id", user_id);
        data.append("service_type", user_type);
        data.append("subject", subject);
        data.append("order_id", Id);
        data.append("message", desc);

        // consolepro.consolelog("data", data);
        apifuntion.postApi(url, data, 1)
            .then((obj) => {
                setIsLoading(false)
                consolepro.consolelog("submitIssue-response...", obj);
                if (obj.status == true) {
                    msgProvider.showSuccess(obj.message);
                    setTimeout(() => {
                        onRequestClose()
                        setSubject('')
                        setDesc('')
                    }, 350);
                } else {
                    onRequestClose()
                    msgProvider.alert(
                        msgTitle.information[config.language],
                        obj.message[config.language],
                        false
                    );
                    return false;
                }
            })
            .catch((error) => {
                setIsLoading(false)
                consolepro.consolelog("submitIssue-error ------- " + error);
            });
    };

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

                    }}
                >{Lang_chg.Appoitment_Issue[config.language]}</Text>

                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps='handled'
                    contentContainerStyle={{
                        justifyContent: 'center',
                        paddingBottom: vs(15),
                    }}
                    showsVerticalScrollIndicator={false}>



                    <View style={{ marginTop: vs(15) }}>

                        <NonEditableInput data={Id} />

                        <AuthInputBoxSec
                            mainContainer={{ width: '100%' }}
                            inputFieldStyle={{ height: vs(35) }}
                            lableText={Lang_chg.Subject[config.language]}
                            inputRef={subjectRef}
                            onChangeText={(val) => setSubject(val)}
                            value={subject}
                            keyboardType="default"
                            autoCapitalize="none"
                            returnKeyType="next"
                            onSubmitEditing={() => {
                                descRef.current.focus();
                            }}
                            editable
                        />

                        <View
                            style={{
                                width: "100%",
                                alignSelf: "center",
                                marginTop: vs(10),
                                borderColor: Colors.Border,
                                borderWidth: 1,
                                borderRadius: 6,
                                height: vs(125),
                                paddingHorizontal: s(8),
                                paddingVertical: s(4),
                            }}>

                            <TextInput
                                ref={descRef}
                                style={{
                                    width: "100%",
                                    color: Colors.Black,
                                    fontSize: Font.medium,
                                    textAlign: config.textalign,
                                    fontFamily: Font.Regular,
                                }}
                                maxLength={250}
                                multiline={true}
                                placeholder={Lang_chg.Description[config.language]}
                                placeholderTextColor={Colors.MediumGrey}
                                onChangeText={(txt) => {
                                    setDesc(txt)
                                }}
                                keyboardType="default"
                                returnKeyLabel="done"
                            />
                        </View>


                        <View style={{ marginTop: vs(35) }}>

                            <Button
                                text={Lang_chg.submitbtntext[config.language]}
                                onPress={() => { submitIssue() }}
                                onLoading={isLoading}
                            />
                        </View>


                    </View>


                </KeyboardAwareScrollView>
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

export default ContactUsBottomSheet;


