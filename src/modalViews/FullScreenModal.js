import React from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import Modal from 'react-native-modal'
import { View, StyleSheet, Platform, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useDispatch } from 'react-redux';

import { useState, useMemo, useEffect } from 'react';
import { Colors, Font } from '../Provider/Colorsfont';
import { windowHeight, windowWidth } from '../Provider/Utils/Utils';


const FullScreenModal = ({
    isVisible,
    onClose,
    children
}) => {

  

    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();


    const styles = useMemo(() => {
        return StyleSheet.create({
            modalContainer: {
                width: windowWidth,
                height: windowHeight,
                backgroundColor: Colors.light,
                zIndex: 9999

            },
            contentContainer: {
                flex: 1,
                paddingBottom: Platform.OS == 'ios' ? insets.bottom + (155) : insets.bottom - (30),
            },

            title: {
                color: Colors.dark,
                fontSize: (16),
                fontFamily: Font.Bold,
            },
            desc: {
                color: Colors.detailTitles,
                fontSize: (14),
                fontFamily: Font.Regular,
            },
            promotion: {
                width: '100%',
                paddingVertical: (22),
                paddingHorizontal: (19),
                borderWidth: 1,
                borderColor: Colors.secondary,
                borderRadius: (10)
            },
            orderBtn: {
                width: (90),
                paddingVertical: (5),
                borderRadius: (50),
                backgroundColor: Colors.White,
                alignItems: 'center'
            },
            details: {
                color: Colors.lightv1,
                fontSize: (12),
                fontFamily: Font.SemiBold,
                paddingHorizontal: (12)
            },
        });
    }, [])




    return (

        <Modal
            visible={isVisible}
            animationType='slide'
        >
            <View style={[styles.modalContainer]}>


                {children}
            </View>

        </Modal>

    );
};

export default FullScreenModal;