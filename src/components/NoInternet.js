
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
import { DeviceConnection, setNoInternet } from "../Redux/Actions";


const NoInternet = ({
    visible,
    onRequestClose,

}) => {

    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()
    
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
            backgroundColor: Colors.White,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingVertical: vs(20),
            position: 'absolute',
            bottom: 0,
            zIndex: 9999,
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
            fontSize: Font.large,
            fontFamily: Font.Medium,
            color: Colors.White,
        }
    });




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

        <View style={{ flex: 1, position:'absolute', zIndex:9999 }}>

            <Modal
                animationType='fade'
                visible={visible}
                transparent
                presentationStyle='overFullScreen'
            >

                <View style={styles.mainContainer}>
                    <View style={styles.subContainer}>

                        <View style={styles.modalContainer}>
                            <SvgXml xml={NoInternetConnection} height={(windowWidth * 20) / 100} width={(windowWidth * 20) / 100} />
                            {/* <SvgXml xml={Plug} style={{ marginTop: (windowWidth * 10) / 100 }} /> */}
                            <Image source={Icons.Connect} style={{
                                height: (windowWidth * 60) / 100,
                                width: (windowWidth * 60) / 100,
                                marginTop: -(windowWidth * 20) / 100
                            }}
                                resizeMode='contain'
                                resizeMethod='scale'
                            />

                            <View style={{
                                width: '100%',
                                alignItems: 'center',
                                marginTop: -(windowWidth * 20) / 100
                            }}>
                                <Text style={styles.Title}>{'Ooops! No Internet'}</Text>
                                <Text style={styles.Desc}>{'Please check your internet connection and try again.'}</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        dispatch(setNoInternet(false))
                                        console.log('hehehhe');
                                    }}
                                    activeOpacity={0.8}
                                    style={styles.Btn}>
                                    {
                                        isLoading ?
                                            <SkypeIndicator color={Colors.White} size={16} count={3} />
                                            :
                                            <Text style={styles.BtnTitle}>{'OK'}</Text>
                                    }
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </View>

            </Modal >
        </View>


    )
}

export default NoInternet;



