import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet, ActivityIndicator, TouchableHighlight, Keyboard, FlatList, Alert, Platform, } from "react-native";
import Modal from "react-native-modal";
import {
    SkypeIndicator,
} from 'react-native-indicators';
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




const IncomingCallPopup = ({
    visible,
    onRequestClose,
    type,
    addressDetails,
    deletedAddress = () => { },
    editedAddress = () => { },
    length
}) => {

    const { address, loggedInUserDetails, guest, appLanguage, languageIndex, deviceType, contentAlign, } = useSelector(state => state.StorageReducer)
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

    useEffect(() => {

        console.log('addressDetails............', addressDetails);
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


    return (
        <Modal
            isVisible={visible}
            statusBarTranslucent={true}
            animationIn='fadeInUpBig'
            animationOut='fadeOutDownBig'
            animationInTiming={350}
            animationOutTimixng={350}
            avoidKeyboard={false}
            // onBackButtonPress={onRequestClose}
            hasBackdrop={true}
            useNativeDriver={true}
            useNativeDriverForBackdrop={true}
        // backdropColor='rgba(0,0,0,0.8)'
        >


            <View style={styles.modalContainer}>


                {/* <Text
                    style={{
                        fontSize: Font.large,
                        fontFamily: Font.SemiBold,
                        alignSelf: 'flex-start',
                        color: Colors.darkText

                    }}>{type === 'editAddress' ? LangProvider.Edit_Address[languageIndex] : type === 'addAddress' ? LangProvider.Add_Address[languageIndex] : ''}</Text>

               */}

            </View>

        </Modal >



    )
}
const styles = StyleSheet.create({

    modalContainer: {
        width: windowWidth,
        height: (windowHeight / 1.5),
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

export default IncomingCallPopup;


