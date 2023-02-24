import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet, Modal, TouchableHighlight, Keyboard, Alert, Platform, } from "react-native";
import { BlurView } from "@react-native-community/blur";

import { SkypeIndicator } from 'react-native-indicators';
import { Colors, Font } from "../Provider/Colorsfont";
import {
    windowWidth, LangProvider, config, Icons, Button, apifuntion, msgProvider, windowHeight,
} from "../Provider/Utils/Utils";
import { Cross, dummyUser, Edit } from "../Icons/Index";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import AuthInputBoxSec from "./AuthInputBoxSec";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from "react-redux";
import { Address } from "../Redux/Actions";
import { useSafeAreaInsets } from "react-native-safe-area-context";




const AddEditAddress = ({
    visible,
    onRequestClose,
    type,
    addressDetails,
    deletedAddress = () => { },
    editedAddress = () => { },
    length
}) => {

    const { address, loggedInUserDetails, guest, languageIndex, contentAlign, } = useSelector(state => state.StorageReducer)
    const dispatch = useDispatch()
    const [title, setTitle] = useState('')
    const [googleAddress, setGoogleAddress] = useState('')
    const [nearest, setNearest] = useState('')
    const [building, setBuilding] = useState('')
    const [defaultAddress, setDefaultAddress] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isDelete, setIsDelete] = useState(false)

    const scrollRef = useRef()
    const titleRef = useRef()
    const addressRef = useRef()
    const landmarkRef = useRef()
    const buildingRef = useRef()
    const insets = useSafeAreaInsets()

    useEffect(() => {

        // console.log('addressDetails............', addressDetails);
        if (addressDetails != '' && addressDetails != null && addressDetails != undefined) {
            setGoogleAddress(addressDetails.address != '' ? addressDetails.address : '')

            if (type == 'editAddress') {
                setTitle(addressDetails?.title != '' ? addressDetails?.title : '')
                setNearest(addressDetails?.landmark != '' ? addressDetails?.landmark : '')
                setBuilding(addressDetails?.building_name != '' ? addressDetails?.building_name : '')
                setDefaultAddress((addressDetails?.defult != '' && addressDetails?.defult != '0') ? false : true)


            }
        }

    }, [addressDetails])

    const resetState = () => {
        setTitle('')
        setGoogleAddress('')
        setNearest('')
        setBuilding('')
        setDefaultAddress(false)
    }

    const confirmDelete = () => {
        Alert.alert(
            LangProvider.Delete_Address[languageIndex],
            LangProvider.Sure_Delete_Address[languageIndex],
            [
                {
                    text: LangProvider.no_txt[languageIndex],
                },
                {
                    text: LangProvider.yes_txt[languageIndex],
                    onPress: () => deleteAddress(),
                },
            ],
            { cancelable: false }
        );
    }

    const addAddress = async () => {
        let url = config.baseURL + "api-patient-address-update";

        if (title == '') {
            msgProvider.showError("Please add address title");
            return false;
        }
        var data = new FormData();
        data.append("user_id", loggedInUserDetails.user_id);
        data.append("current_address", addressDetails?.address);
        data.append("lat", addressDetails?.latitude);
        data.append("lng", addressDetails?.longitude);
        data.append("landmark", nearest);
        data.append("building_name", building);
        data.append("title", title);
        data.append("default", defaultAddress ? '0' : '1');


        let newAddress = {
            latitude: addressDetails?.latitude,
            longitude: addressDetails?.longitude,
            address: addressDetails?.address,
            isAddressAdded: true
        }
        dispatch(Address(newAddress))

        setIsLoading(true)
        apifuntion
            .postApi(url, data, 1)
            .then((obj) => {
                console.log("addAddress-res----", obj);
                setIsLoading(false)
                if (obj.status == true) {
                    msgProvider.showSuccess(obj.message)
                    onRequestClose(obj.status)
                } else {
                    return false;
                }
            })
            .catch((error) => {
                setIsLoading(false)
                msgProvider.showError(error.message)
                onRequestClose()
                console.log(" addAddress-error ------- " + error);
            });
    };

    const editAddress = async () => {
        let url = config.baseURL + "api-update-patient-address";

        if (title == '') {
            msgProvider.showError("Please add address title");
            return false;
        }
        var data = new FormData();
        data.append("login_user_id", loggedInUserDetails.user_id);
        data.append("id", addressDetails?.id);
        data.append("current_address", addressDetails?.address);
        data.append("lat", addressDetails?.latitude);
        data.append("lng", addressDetails?.longitude);
        data.append("landmark", nearest);
        data.append("building_name", building);
        data.append("title", title);
        data.append("default", defaultAddress ? '0' : '1');


        setIsLoading(true)
        apifuntion
            .postApi(url, data, 1)
            .then((obj) => {
                console.log("editAddress-res----", obj);
                setIsLoading(false)
                if (obj.status == true) {
                    msgProvider.showSuccess(obj.message)
                    onRequestClose()
                    editedAddress(title)
                } else {
                    return false;
                }
            })
            .catch((error) => {
                setIsLoading(false)
                msgProvider.showError(error.message)
                onRequestClose()
                console.log("editAddress-error ------- " + error);
            });
    };

    const deleteAddress = async () => {
        setIsDelete(true)
        let url = config.baseURL + "api-delete-patient-address";

        var data = new FormData();
        data.append("login_user_id", loggedInUserDetails.user_id);
        data.append("id", addressDetails?.id);

        apifuntion
            .postApi(url, data, 1)
            .then((obj) => {
                setIsDelete(false)
                console.log("deleteAddress-res----", obj);
                setIsLoading(false)
                if (obj.status == true) {
                    msgProvider.showSuccess(obj.message)
                    onRequestClose()
                    deletedAddress(addressDetails?.id)
                } else {
                    return false;
                }
            })
            .catch((error) => {
                setIsLoading(false)
                setIsDelete(false)
                msgProvider.showError(obj.message)
                onRequestClose()
                console.log("deleteAddress-error ------- " + error);
            });
    };
    return (




        <View style={{ flex: 1 }} pointerEvents={(isLoading || isDelete) ? 'none' : 'auto'}>
            <Modal
                animationType='slide'
                visible={visible}
                transparent
                presentationStyle='overFullScreen'
            >
                {/* <BlurView
                    style={{
                        flex: 1,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        // zIndex: 999
                    }}
                    blurType='ultraThinMaterialDark'
                    blurAmount={15}
                    reducedTransparencyFallbackColor="white"
                /> */}

                <View style={styles.mainContainer}>

                    <View style={styles.subContainer}>
                        <TouchableOpacity
                            onPress={onRequestClose}
                            style={styles.closeContainer}
                        >
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
                                    paddingHorizontal: s(13),
                                    paddingBottom: vs(15),
                                }}
                                showsVerticalScrollIndicator={false}>
                                <Text
                                    style={{
                                        fontSize: Font.large,
                                        fontFamily: Font.SemiBold,
                                        alignSelf: 'flex-start',
                                        color: Colors.darkText

                                    }}>{type === 'editAddress' ? LangProvider.Edit_Address[languageIndex] : type === 'addAddress' ? LangProvider.Add_Address[languageIndex] : ''}</Text>

                                <View style={{ marginTop: vs(25) }}>

                                    {

                                        <>
                                            <AuthInputBoxSec
                                                mainContainer={{ width: '100%' }}
                                                inputFieldStyle={{ height: vs(35) }}
                                                lableText={LangProvider.Address_Title[languageIndex]}
                                                inputRef={titleRef}
                                                onChangeText={(val) => setTitle(val)}
                                                value={title}
                                                keyboardType="default"
                                                autoCapitalize="none"
                                                returnKeyType="next"
                                                onSubmitEditing={() => {
                                                    landmarkRef.current.focus();
                                                }}
                                                // onFocus={(event: Event) => {
                                                //     _scrollToInput(event.target)
                                                // }}
                                                blurOnSubmit={Platform.OS === 'ios' ? true : false}
                                                editable
                                            />

                                            <AuthInputBoxSec
                                                mainContainer={{ marginTop: vs(5), width: '100%' }}
                                                inputFieldStyle={{ height: vs(35) }}
                                                lableText={LangProvider.Google_Address[languageIndex]}
                                                inputRef={addressRef}
                                                onChangeText={(val) => setGoogleAddress(val)}
                                                value={googleAddress}
                                                keyboardType="default"
                                                autoCapitalize="none"
                                                returnKeyType="next"
                                                editable={false}
                                                numberOfLines={1}
                                                multiline
                                            />

                                            <AuthInputBoxSec
                                                mainContainer={{ marginTop: vs(5), width: '100%' }}
                                                inputFieldStyle={{ height: vs(35) }}
                                                lableText={LangProvider.Nearest_Address[languageIndex]}
                                                inputRef={landmarkRef}
                                                onChangeText={(val) => setNearest(val)}
                                                value={nearest}
                                                keyboardType="default"
                                                autoCapitalize="none"
                                                returnKeyType="next"
                                                onSubmitEditing={() => {
                                                    buildingRef.current.focus()
                                                }}
                                                blurOnSubmit={Platform.OS === 'ios' ? true : false}
                                                editable
                                            />

                                            <AuthInputBoxSec
                                                mainContainer={{ marginTop: vs(5), width: '100%' }}
                                                inputFieldStyle={{ height: vs(35) }}
                                                lableText={LangProvider.Building_Name[languageIndex]}
                                                inputRef={buildingRef}
                                                onChangeText={(val) => setBuilding(val)}
                                                value={building}
                                                keyboardType="default"
                                                autoCapitalize="none"
                                                returnKeyType="done"
                                                onSubmitEditing={() => {
                                                    Keyboard.dismiss()
                                                }}
                                                blurOnSubmit={Platform.OS === 'ios' ? true : false}
                                                editable
                                            />

                                            <View
                                                style={{
                                                    width: "100%",
                                                    alignSelf: "center",
                                                    marginTop: vs(15),
                                                    flexDirection: "row",
                                                    alignItems: 'center'
                                                }} >

                                                <TouchableOpacity
                                                    disabled={(addressDetails?.defult != '' && addressDetails?.defult != '0') ? false : true}
                                                    activeOpacity={0.8}
                                                    style={{
                                                        width: "37%",
                                                        flexDirection: "row",
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                    }}
                                                    onPress={() => {
                                                        setDefaultAddress(!defaultAddress)
                                                    }}>


                                                    <TouchableOpacity
                                                        disabled={(addressDetails?.defult != '' && addressDetails?.defult != '0') ? false : true}
                                                        onPress={() => {
                                                            setDefaultAddress(!defaultAddress)

                                                        }}
                                                        style={{
                                                            height: 20,
                                                            width: 20,
                                                            borderRadius: 5,
                                                            backgroundColor: defaultAddress ? Colors.Theme : Colors.White,
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            borderWidth: defaultAddress ? 0 : 1.3,
                                                            borderColor: Colors.Border
                                                        }}>
                                                        {
                                                            defaultAddress ?
                                                                <Image
                                                                    style={{
                                                                        height: 14,
                                                                        width: 14,
                                                                        tintColor: Colors.White
                                                                    }}
                                                                    resizeMode="contain"
                                                                    source={Icons.Tick}
                                                                />
                                                                :
                                                                null
                                                        }
                                                    </TouchableOpacity>
                                                    <Text
                                                        style={{
                                                            color: Colors.inActiveText,
                                                            fontFamily: Font.Regular,
                                                            fontSize: Font.medium,
                                                        }}>
                                                        {LangProvider.Default_Address[languageIndex]}
                                                    </Text>

                                                </TouchableOpacity>
                                            </View>

                                        </>

                                    }

                                    {
                                        (type == 'editAddress' && defaultAddress) &&
                                        <Text style={{
                                            fontSize: Font.small,
                                            fontFamily: Font.Regular,
                                            color: Colors.lightGrey,
                                            marginTop: (windowWidth * 4) / 100,
                                        }}>{LangProvider.CantDelete[languageIndex]}</Text>
                                    }






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
                                    text={LangProvider.Save_Address[languageIndex]}
                                    onPress={() => {
                                        if (type == 'editAddress') {
                                            editAddress()
                                        } else {
                                            addAddress()
                                        }
                                    }}
                                    onLoading={isLoading}
                                />

                                {
                                    (type == 'editAddress' && !defaultAddress) &&


                                    <TouchableOpacity
                                        style={{
                                            height: (windowWidth * 6) / 100,
                                            alignSelf: 'center',
                                            // marginBottom: (windowWidth * 2) / 100,
                                            marginTop: (windowWidth * 2) / 100,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            confirmDelete()
                                        }}>
                                        {
                                            isDelete ?
                                                <SkypeIndicator color={Colors.Theme} size={20} />
                                                :
                                                <Text style={{
                                                    fontSize: Font.small,
                                                    fontFamily: Font.Medium,
                                                    color: Colors.Theme,

                                                }}>{LangProvider.Delete[languageIndex]}</Text>
                                        }

                                    </TouchableOpacity>


                                }
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
    viewWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)'
    },

});

export default AddEditAddress;


