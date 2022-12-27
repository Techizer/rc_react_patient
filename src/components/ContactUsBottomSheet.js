import React, { useEffect, useRef, useState } from "react";
import { Text, TextInput, View, Image, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableHighlight, Keyboard, FlatList, Platform, } from "react-native";
import Modal from "react-native-modal";
import DeviceInfo from "react-native-device-info";

import { Colors, Font } from "../Provider/Colorsfont";
import { windowWidth, deviceHeight, Lang_chg, config, localStorage, Button, msgProvider, consolepro, apifuntion, windowHeight, } from "../Provider/utilslib/Utils";
import { Cross, } from "../Icons/Index";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import AuthInputBoxSec from "./AuthInputBoxSec";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import NonEditableInput from "./NonEditableInput";

const EMAIL_REG = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
let deviceId = ''
let deviceName = ''

const ContactUsBottomSheet = ({
    visible,
    onRequestClose,
    data,
    route
}) => {

    const [subject, setSubject] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [desc, setDesc] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [keyboardOffset, setKeyboardOffset] = useState(0);
    const subjectRef = useRef()
    const emailRef = useRef()
    const phoneRef = useRef()
    const descRef = useRef()

    const onKeyboardShow = event => setKeyboardOffset(event.endCoordinates.height);
    const onKeyboardHide = () => setKeyboardOffset(0);
    const keyboardDidShowListener = useRef();
    const keyboardDidHideListener = useRef();

    const getDeviceID = async () => {
        deviceId = DeviceInfo.getDeviceId()
    }

    const getDeviceName = async () => {
        DeviceInfo.getDeviceName().then((data) => {
            deviceName = data
        });
    }

    useEffect(() => {
        getDeviceID()
        getDeviceName()
    }, [route])

    useEffect(() => {
        keyboardDidShowListener.current = Keyboard.addListener('keyboardWillShow', onKeyboardShow);
        keyboardDidHideListener.current = Keyboard.addListener('keyboardWillHide', onKeyboardHide);

        return () => {
            keyboardDidShowListener.current.remove();
            keyboardDidHideListener.current.remove();
        };
    }, []);

    const submitLoginIssue = async () => {
        if (!email) {
            msgProvider.showError('Please write your email');
            return false;
        }

        if (EMAIL_REG.test(email) == false) {
            msgProvider.showError('Please write a valid email');
            return false;
        }

        if (!phone) {
            msgProvider.showError('Please write your phone number');
            return false;
        }

        if (!desc) {
            msgProvider.showError('Please write your description');
            return false;
        }

        setIsLoading(true)
        let url = config.baseURL + "api-login-issue";
        var data = new FormData();
        data.append("subject", route == 'Login' ? Lang_chg.LoginIssue[config.language] : subject);
        data.append("phone", phone);
        data.append("email", email);
        data.append("message", desc);
        data.append("deviceId", deviceId);
        data.append("deviceName", deviceName);

        // consolepro.consolelog("data", data);
        // return
        apifuntion.postApi(url, data, 1)
            .then((obj) => {
                setIsLoading(false)
                consolepro.consolelog("submitLoginIssue-response...", obj);
                if (obj.status == true) {
                    msgProvider.showSuccess(obj.message);
                    setTimeout(() => {
                        onRequestClose()
                        setSubject('')
                        setDesc('')
                        setEmail('')
                        setPhone('')
                    }, 350);
                } else {
                    onRequestClose()
                    msgProvider.showError(obj.message);
                    setSubject('')
                    setDesc('')
                    setEmail('')
                    setPhone('')
                    return false;
                }
            })
            .catch((error) => {
                setIsLoading(false)
                consolepro.consolelog("submitLoginIssue-error ------- " + error);
            });
    };
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
                    onPress={() => {
                        Keyboard.dismiss()
                        onRequestClose()
                    }}
                    underlayColor={Colors.Highlight}
                    style={styles.closeContainer}>
                    <SvgXml xml={Cross} height={vs(19)} width={s(18)} />
                </TouchableHighlight>

                <Text
                    style={{
                        fontSize: Font.large,
                        fontFamily: Font.SemiBold,
                        textAlign: config.textRotate,
                        color: Colors.darkText

                    }}>{route == 'Login' ? Lang_chg.Login_Issue[config.language] : Lang_chg.Appoitment_Issue[config.language]}</Text>

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


                        <NonEditableInput
                            title={route == 'Login' ? Lang_chg.Subject[config.language] : Lang_chg.OrderId[config.language]}
                            data={route == 'Login' ? Lang_chg.LoginIssue[config.language] : data} />


                        {
                            !route == 'Login' &&
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
                                    descRef.current.focus()
                                }}
                                blurOnSubmit={Platform.OS === 'ios' ? true : false}
                                editable
                            />
                        }

                        {
                            route == 'Login' &&
                            <>
                                <AuthInputBoxSec
                                    mainContainer={{ width: '100%' }}
                                    inputFieldStyle={{ height: vs(35) }}
                                    lableText={Lang_chg.Email[config.language]}
                                    inputRef={emailRef}
                                    onChangeText={(val) => setEmail(val)}
                                    value={email}
                                    keyboardType='email-address'
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        phoneRef.current.focus();
                                    }}
                                    blurOnSubmit={Platform.OS === 'ios' ? true : false}
                                    editable
                                />

                                <AuthInputBoxSec
                                    mainContainer={{ width: '100%' }}
                                    inputFieldStyle={{ height: vs(35) }}
                                    lableText={Lang_chg.PhoneNumber[config.language]}
                                    inputRef={phoneRef}
                                    onChangeText={(val) => setPhone(val)}
                                    value={phone}
                                    keyboardType="numeric"
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        descRef.current.focus();
                                    }}
                                    blurOnSubmit={Platform.OS === 'ios' ? true : false}
                                    editable
                                />
                            </>
                        }

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
                                paddingVertical: s(2),
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
                                returnKeyType="done"
                                onSubmitEditing={() => {
                                    Keyboard.dismiss()
                                }}
                            />
                        </View>


                        <View style={{ marginTop: vs(35) }}>

                            <Button
                                text={Lang_chg.submitbtntext[config.language]}
                                onPress={() => {
                                    if (route == 'Login') {
                                        submitLoginIssue()

                                    } else {
                                        submitIssue()
                                    }
                                }}
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
    modalContainer: {
        width: windowWidth,
        height: windowHeight - 200,
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


