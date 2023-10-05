import React, { useEffect, useMemo, useRef, useState } from "react";
import { Modal, Text, TouchableOpacity, View, Image, StyleSheet, TouchableHighlight, Keyboard, FlatList, Alert, Platform, ActivityIndicator, } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SvgXml } from "react-native-svg";
import { s, vs } from "react-native-size-matters";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from 'react-native-toast-message'

import { Colors, Font } from "../Provider/Colorsfont";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StickyButton } from "./StickyButton";
import OTPInput from "./OTPInput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { config } from "../Provider/configProvider";
import { apifuntion } from "../Provider/APIProvider";
import { msgProvider } from "../Provider/messageProvider";
import { windowHeight, windowWidth } from "../Provider/Utils/Utils";
import { leftArrow } from "../Icons/Index";
import { Address, Guest, UserCredentials, UserDetails } from "../Redux/Actions";


const OTP = ({
    visible,
    onRequestClose,
    contact,
    type,
    countryCode,
    status = () => { }
}) => {

    const insets = useSafeAreaInsets()
    const dispatch = useDispatch();
    const { navigate, reset } = useNavigation()

    const {
        appLanguage,
        deviceToken,
        deviceType,
        address,
        rememberMe,
    } = useSelector(state => state.StorageReducer)

    const styles = useMemo(() => {
        return StyleSheet.create({

            mainContainer: {
                width: windowWidth,
                height: windowHeight,
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
                height: windowHeight,
                backgroundColor: Colors.White,
                position: 'absolute',
                bottom: 0,
                zIndex: 9999,
                // paddingTop: insets.top

            },
            title: {
                fontSize: (windowWidth * 6) / 100,
                fontFamily: Font.Regular,
                color: Colors.Black
            },
            desc: {
                fontSize: Font.small,
                fontFamily: Font.Regular,
                color: Colors.lightGrey,
                marginTop: vs(5)
            },
        });
    }, [])

    const [secondsRemaining, setSecondsRemaining] = useState(60);

    const [classStateData, setClassStateData] = useState({
        OTP: '',
        sendOTP: false,
        isOTPSent: true,
        isVerifying: false,
        isVerified: false,
    })

    let timerInterval;

    useEffect(() => {
        let timerInterval;
        let isPaused = false;

        if (visible && !classStateData.isVerifying) {
            timerInterval = setInterval(() => {
                if (!isPaused) {
                    setSecondsRemaining((lastSec) => {
                        if (lastSec <= 1) {
                            clearInterval(timerInterval);
                        }
                        return lastSec - 1;
                    });
                }
            }, 1000);
        }

        return () => clearInterval(timerInterval);

    }, [visible, classStateData.isVerifying, secondsRemaining]);


    const setState = (payload) => {
        setClassStateData(prev => ({ ...prev, ...payload }))
    }

    const resetState = () => {
        clearInterval(timerInterval)
        onRequestClose()
        setSecondsRemaining(60)
        setState({
            OTP: '',
            sendOTP: false,
            isOTPSent: true,
            isVerifying: false,
            isVerified: false,
        })
    }

    const secureEmail = (email) => {

        const [username, domain] = email.split('@');
        const firstThree = username.slice(0, 3);

        const securedEmail = `${firstThree}****@${domain}`;

        return securedEmail;
    }


    const secureNumber = (phoneNumber) => {

        const firstThree = phoneNumber.slice(0, 3);
        const lastThree = phoneNumber.slice(-3);

        const securedPhoneNumber = `${firstThree}******${lastThree}`;
        return securedPhoneNumber;
    }



    const SendOTP = async () => {
        setState({ OTP: '' })
        let conditionsFailed = false;
        Keyboard.dismiss()

        if (conditionsFailed) {
            return false
        } else {

            setState({ sendOTP: true })
            let url = '';
            var data = new FormData();
            if (type == 'Login') {
                url = config.baseURL + "api-login-send-otp";
                data.append('countrycode', countryCode)
                data.append('phone_number', `${contact}`)
                data.append('type', `patient`)
            }

            apifuntion.postApi(url, data, 1).then((obj) => {

                console.log('Send OTP Response', obj)
                if (obj.status == true) {
                    setState({ isOTPSent: true })
                    msgProvider.showSuccess('OTP sent to your email')
                    setSecondsRemaining(60)

                } else {
                    msgProvider.showError(obj?.message)
                }
            }).catch((error) => {
                msgProvider.showError('Something went wrong, please try again later.')
                console.log("Send OTP-error ------- ", error)
            }).finally(() => {
                setState({ sendOTP: false })
            })
        }

    }


    const VerifyOTP = async () => {
        clearInterval(timerInterval)
        let conditionsFailed = false;
        Keyboard.dismiss()


        if (classStateData.OTP == '' && classStateData.isOTPSent) {
            msgProvider.showError(`Please enter OTP sent to your Phone`)
            conditionsFailed = true;
            return
        }

        if (conditionsFailed) {
            return false
        } else {
            setState({ isVerifying: true })

            let url = config.baseURL + "api-verification";
            var data = new FormData();


            data.append('otptype', 'mobile')
            data.append('phone_number', contact)
            data.append('code', classStateData.OTP)

            apifuntion.post(url, data, 1).then((obj) => {

                console.log('Verify OTP Response', obj)

                if (obj.status == true) {
                    setState({ isVerifying: false, isVerified: true })
                    status(true)
                    onRequestClose()
                    resetState()
                } else {
                    setState({ isVerifying: false })
                    msgProvider.showError(obj?.message)
                    status(false)
                }
            }).catch((error) => {
                setState({ isVerifying: false })
                console.log("verify OTP-error ------- ", error)
            })
        }


    }

    const updateAddress = async (userId) => {

        let url = config.baseURL + "api-patient-address-update";
        var data = new FormData();
        data.append("user_id", userId);
        data.append("current_address", address.address);
        data.append("lat", address.latitude);
        data.append("lng", address.longitude);
        data.append("landmark", '');
        data.append("building_name", '');
        data.append("title", '');
        data.append("default", '0');

        apifuntion
            .postApi(url, data, 1)
            .then((obj) => {
                // console.log("updateAddress-res----", obj);
                let newAddressDetails = null
                if (obj.status == true) {
                    newAddressDetails = {
                        latitude: obj?.result?.latitude,
                        longitude: obj?.result?.longitudes,
                        address: obj?.result?.current_address,
                        title: 'Home'
                    }
                    dispatch(Address(newAddressDetails))
                } else {
                    newAddressDetails = {
                        latitude: '',
                        longitude: '',
                        address: '',
                        title: ''
                    }
                    dispatch(Address(newAddressDetails))
                    return false;
                }
            })
            .catch((error) => {
                console.log("updateAddress-error ------- " + error);
            });
    };

    const Login = async () => {
        clearInterval(timerInterval)
        let conditionsFailed = false;
        Keyboard.dismiss()


        if (classStateData.OTP == '' && classStateData.isOTPSent) {
            msgProvider.showError(`Please enter OTP sent to your Phone`)
            conditionsFailed = true;
            return
        }

        if (conditionsFailed) {
            return false
        } else {
            setState({ isVerifying: true })
            let url = config.baseURL + "api-patient-login";
            var data = new FormData();


            data.append("email_phone", contact);
            data.append("device_type", deviceType);
            data.append("device_lang", appLanguage == 'en' ? 'ENG' : 'AR');
            data.append("fcm_token", deviceToken);
            data.append("code", classStateData.OTP);

            // console.log(data._parts);

            apifuntion.postApi(url, data, 1).then((obj) => {
                setState({ isVerifying: false })
                if (obj.status == true) {

                    AsyncStorage.setItem('userId', obj?.result?.user_id)
                    if (obj.result?.current_address == '' || obj.result?.current_address == null || obj.result?.current_address == undefined) {
                        updateAddress(obj?.result?.user_id)
                    }
                    const credentials = {
                        phone: contact,
                    };

                    let newAddressDetails = {
                        latitude: obj?.result?.latitude,
                        longitude: obj?.result?.longitudes,
                        address: obj?.result?.current_address,
                        title: obj?.result?.address_title
                    }
                    dispatch(Address(newAddressDetails))
                    dispatch(Guest(false))

                    dispatch(UserCredentials(credentials))

                    dispatch(UserDetails(obj?.result))
                    resetState()
                    setTimeout(() => {
                        reset({
                            index: 0,
                            routes: [{ name: "DashboardStack" }],
                        });
                    }, 700);
                } else {
                    setTimeout(() => {
                        msgProvider.showError(obj.message);
                    }, 700);
                    return false;
                }
            }).catch((error) => {
                setState({ isVerifying: false })
                msgProvider.showError('Something went wrong, please try again later')
                console.log("Login------ error ------- ", error)

            })
        }

    }


    return (

        <View style={{ flex: 1, }}>
            <Modal
                animationType='slide'
                visible={visible}
                transparent
                presentationStyle='overFullScreen'
            >



                <View style={[styles.mainContainer]}>

                    <View style={[styles.modalContainer]}>

                        <KeyboardAwareScrollView
                            // keyboardOpeningTime={200}
                            extraScrollHeight={50}
                            enableOnAndroid={true}
                            keyboardShouldPersistTaps='handled'
                            contentContainerStyle={{
                                height: windowHeight,
                                // paddingTop: Platform.OS == 'ios' ? insets.top : 0
                            }}
                            showsVerticalScrollIndicator={false}>



                            <View
                                style={{
                                    width: "100%",
                                    height: (windowWidth * 30) / 100,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingTop: Platform.OS == 'ios' ? insets.top : 0,
                                }}>

                                {
                                    secondsRemaining <= 0 &&

                                    <TouchableHighlight
                                        underlayColor={Colors.Highlight}
                                        onPress={() => {
                                            resetState()
                                        }}
                                        style={{ height: vs(40), width: s(40), justifyContent: 'center', alignItems: 'center' }}
                                    >
                                        <SvgXml xml={leftArrow} height={vs(17.11)} width={s(9.72)} fill={'red'} fillOpacity={1} />

                                    </TouchableHighlight>


                                }
                            </View>

                            <Toast />


                            <View style={{ paddingHorizontal: s(16), zIndex: -1 }}>

                                <Text style={styles.title}>{'Phone Verification'}</Text>

                                <Text style={styles.desc}>{`We have sent code to your Phone:  +${secureNumber(contact)}`}</Text>

                                <View style={{ paddingHorizontal: s(25), marginTop: (windowWidth * 8) / 100, }}>

                                    <OTPInput
                                        onComplete={(code) => {
                                            setState({ OTP: code })
                                        }}
                                        reset={classStateData.sendOTP}
                                    />
                                </View>

                                < View style={{ width: '100%', alignItems: 'center', }}>

                                    {
                                        ((secondsRemaining > 0 && classStateData.isOTPSent && !classStateData.isVerifying)) &&
                                        <Text
                                            style={{
                                                fontSize: Font.medium,
                                                fontFamily: Font.Regular,
                                                color: Colors.Theme
                                            }}
                                        >{secondsRemaining}</Text>
                                    }
                                    {

                                        <View style={{ width: '100%', alignItems: 'center' }}>
                                            <View
                                                style={{
                                                    height: windowHeight / 20,
                                                    justifyContent: 'center'
                                                }}
                                            >

                                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                    <Text
                                                        style={{
                                                            fontSize: Font.xlarge,
                                                            fontFamily: Font.Regular,
                                                            color: Colors.DarkGrey
                                                        }}
                                                    >{`Didn't receive code? `}
                                                    </Text>

                                                    {
                                                        classStateData.sendOTP ?
                                                            <ActivityIndicator size={'small'} color={Colors.DarkGrey} />
                                                            :
                                                            <TouchableOpacity
                                                                disabled={(secondsRemaining > 0 && classStateData.isOTPSent)}
                                                                activeOpacity={0.6}
                                                                onPress={() => {
                                                                    SendOTP()
                                                                }}>
                                                                <Text
                                                                    style={{
                                                                        fontSize: Font.xlarge,
                                                                        fontFamily: Font.Regular,
                                                                        color: (secondsRemaining > 0 && classStateData.isOTPSent) ? Colors.DarkGrey : Colors.Theme
                                                                    }}
                                                                >{'Resend'}</Text>
                                                            </TouchableOpacity>
                                                    }

                                                </View>

                                            </View>



                                        </View>
                                    }
                                </View>

                            </View>



                        </KeyboardAwareScrollView>

                        <View style={{ width: '90%', alignSelf: 'center' }}>

                            <StickyButton
                                text={'VERIFY'}
                                onPress={() => {
                                    type == 'Login' ? Login() : VerifyOTP()
                                }}
                                onLoading={classStateData.isVerifying}
                            />
                        </View>

                    </View>

                </View>
            </Modal>
        </View>




    )
}


export default OTP;


