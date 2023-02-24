import React, { useEffect, useRef, useState } from "react";
import { Text, TextInput, View, Image, StyleSheet, Dimensions, Modal, TouchableOpacity, Keyboard, FlatList, Platform, Pressable, } from "react-native";
import DeviceInfo from "react-native-device-info";

import { Colors, Font } from "../Provider/Colorsfont";
import { windowWidth, LangProvider, config, Button, msgProvider, apifuntion, windowHeight, } from "../Provider/Utils/Utils";
import { Cross, } from "../Icons/Index";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import AuthInputBoxSec from "./AuthInputBoxSec";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import NonEditableInput from "./NonEditableInput";
import { useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const EMAIL_REG = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
let deviceId = ''
let deviceName = ''

const ContactUsBottomSheet = ({
    visible,
    onRequestClose,
    data,
    route
}) => {

    const { loggedInUserDetails, appLanguage, languageIndex } = useSelector(state => state.StorageReducer)

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
    const insets = useSafeAreaInsets()
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
        data.append("subject", route == 'Login' ? LangProvider.LoginIssue[languageIndex] : subject);
        data.append("phone", phone);
        data.append("email", email);
        data.append("message", desc);
        data.append("deviceId", deviceId);
        data.append("deviceName", deviceName);

        // console.log("data", data);
        // return
        apifuntion.postApi(url, data, 1)
            .then((obj) => {
                setIsLoading(false)
                console.log("submitLoginIssue-response...", obj);
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
                console.log("submitLoginIssue-error ------- " + error);
            });
    };
    const submitIssue = async () => {
        if (!desc) {
            msgProvider.showError('Please write your description');
            return false;
        }
        setIsLoading(true)
        let url = config.baseURL + "api-app-insert-need-help";
        var data = new FormData();
        data.append("user_id", loggedInUserDetails.user_id);
        data.append("service_type", loggedInUserDetails.user_type);
        data.append("subject", subject);
        data.append("order_id", Id);
        data.append("message", desc);

        // console.log("data", data);
        apifuntion.postApi(url, data, 1)
            .then((obj) => {
                setIsLoading(false)
                console.log("submitIssue-response...", obj);
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
                        LangProvider.information[languageIndex],
                        obj.message[languageIndex],
                        false
                    );
                    return false;
                }
            })
            .catch((error) => {
                setIsLoading(false)
                console.log("submitIssue-error ------- " + error);
            });
    };

    return (

        <View style={{ flex: 1 }} pointerEvents={(isLoading) ? 'none' : 'auto'}>
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

                                    }}>{route == 'Login' ? LangProvider.Login_Issue[languageIndex] : LangProvider.Appoitment_Issue[languageIndex]}</Text>

                                <View style={{ marginTop: vs(25) }}>

                                    <NonEditableInput
                                        title={route == 'Login' ? LangProvider.Subject[languageIndex] : LangProvider.OrderId[languageIndex]}
                                        data={route == 'Login' ? LangProvider.LoginIssue[languageIndex] : data} />


                                    {
                                        !route == 'Login' &&
                                        <AuthInputBoxSec
                                            mainContainer={{ width: '100%' }}
                                            inputFieldStyle={{ height: vs(35) }}
                                            lableText={LangProvider.Subject[languageIndex]}
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
                                                lableText={LangProvider.Email[languageIndex]}
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
                                                lableText={LangProvider.PhoneNumber[languageIndex]}
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

                                    <Pressable
                                        onPress={() => descRef.current.focus()}
                                        style={{
                                            width: "100%",
                                            // alignSelf: "center",
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
                                                textAlign: languageIndex == 0 ? 'left' : 'right',
                                                fontFamily: Font.Regular,
                                            }}
                                            maxLength={250}
                                            multiline={true}
                                            placeholder={LangProvider.Description[languageIndex]}
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
                                    </Pressable>
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
});

export default ContactUsBottomSheet;


