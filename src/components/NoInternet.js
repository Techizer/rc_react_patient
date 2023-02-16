import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet, Modal, } from "react-native";
import NetInfo from '@react-native-community/netinfo'
import { SvgXml } from "react-native-svg";

import {
    SkypeIndicator,
} from 'react-native-indicators';
import { Colors, Font } from "../Provider/Colorsfont";
import {
    windowWidth, LangProvider, config, Icons, Button, apifuntion, msgProvider, windowHeight,
} from "../Provider/Utils/Utils";
import { Cross, dummyUser, Edit, NoInternetConnection, Plug } from "../Icons/Index";
import { s, vs } from "react-native-size-matters";
import { useDispatch } from "react-redux";
import { DeviceConnection } from "../Redux/Actions";


const NoInternet = ({
    visible,
    onRequestClose,

}) => {

    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()

    // useEffect(() => {
    //     console.log(isLoading);
    // }, [isLoading])
    const GetConnectivityStatus = () => {
        setIsLoading(true)
        NetInfo.fetch().then(state => {
            // console.log("Connection type", state.type);
            // console.log("Is connected?", state.isConnected);
            setTimeout(() => {
                setIsLoading(false)
            }, 1500);
            dispatch(DeviceConnection(state.isConnected))
            // else{
            //     msgProvider.showError('Please check your connection and try again')
            // }
        }).catch((err) => {
            console.log('GetConnectivityStatus-err', err);
        })
    }


    return (
        <Modal
            visible={visible}
        // onRequestClose={onRequestClose}
        >


            <View style={styles.modalContainer}>

                <SvgXml xml={NoInternetConnection} />
                {/* <SvgXml xml={Plug} style={{ marginTop: (windowWidth * 10) / 100 }} /> */}
                <Image source={Icons.Connect} style={{
                    height: 340,
                    width: 340,
                    marginTop:-(windowWidth*25)/100
                }}
                    resizeMode='contain'
                    resizeMethod='scale'
                    />

                <View style={{
                    width: '100%',
                    alignItems: 'center',
                    marginTop:-(windowWidth*20)/100
                }}>
                    <Text style={styles.Title}>{'Ooops! No Internet'}</Text>
                    <Text style={styles.Desc}>{'Please check your internet connection and try again.'}</Text>
                    <TouchableOpacity
                        onPress={() => {
                            GetConnectivityStatus()
                        }}
                        activeOpacity={0.8}
                        style={styles.Btn}>
                        {
                            isLoading ?
                                <SkypeIndicator color={Colors.White} size={16} count={3} />
                                :
                                <Text style={styles.BtnTitle}>{'TRY AGAIN'}</Text>
                        }
                    </TouchableOpacity>
                </View>
            </View>

        </Modal >



    )
}
const styles = StyleSheet.create({

    modalContainer: {
        width: windowWidth,
        height: windowHeight,
        backgroundColor: Colors.White,
        paddingHorizontal: s(13),
        zIndex: 999,
        justifyContent: 'center',
        alignItems: 'center'

    },
    Title: {
        fontSize: Font.xxlarge,
        fontFamily: Font.Medium,
        color: Colors.darkText,
    },
    Desc: {
        fontSize: Font.medium,
        fontFamily: Font.Regular,
        color: Colors.DarkGrey,
        paddingHorizontal: (windowWidth * 6) / 100,
        textAlign: 'center',
        marginTop: (windowWidth * 4) / 100,
    },
    Btn: {
        width: '40%',
        height: 40,
        alignSelf: 'center',
        borderRadius: (windowWidth * 2) / 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.Theme,
        marginTop: (windowWidth * 7) / 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    BtnTitle: {
        fontSize: Font.small,
        fontFamily: Font.Medium,
        color: Colors.White,
    }
});

export default NoInternet;


