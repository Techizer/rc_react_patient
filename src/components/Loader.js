import React from "react";
import { Text, View, StyleSheet, Modal, } from "react-native";
import { SkypeIndicator } from "react-native-indicators";
import ReactNativeModal from "react-native-modal";
import { s, vs } from "react-native-size-matters";

import { Colors, Font } from "../Provider/Colorsfont";
import { windowWidth, windowHeight } from "../Provider/Utils/Utils";



const Loader = ({
    visible,
    onRequestClose,
    data
}) => {

    return (

        <ReactNativeModal
            isVisible={visible}
            statusBarTranslucent={true}
            animationIn='fadeIn'
            animationOut='fadeOut'
            animationInTiming={350}
            animationOutTimixng={350}
            avoidKeyboard={false}
            // onBackButtonPress={onRequestClose}
            hasBackdrop={true}
            useNativeDriver={true}
            useNativeDriverForBackdrop={true}
            backdropColor='rgba(0,0,0,0.2)'
            style={{flex:1, margin: 0, }} >

            <View style={styles.modalContainer}>
                <SkypeIndicator color={Colors.Theme} size={35} />
            </View>
        </ReactNativeModal>

    )
}
const styles = StyleSheet.create({

    modalContainer: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor:'rgba(0,0,0,0.2)'
    },
    closeContainer: {
        height: s(35),
        width: s(35),
        borderRadius: s(50),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: vs(15),
        right: s(11),
        zIndex: 999
    }
});

const HTMLstyles = StyleSheet.create({
    h4: {
        color: "#0888D1",
        fontSize: (windowWidth * 4.5) / 100,
    },
    h5: {
        color: "#0888D1",
        fontSize: (windowWidth * 4.3) / 100,
        fontFamily: Font.Medium,
    },
});

export default Loader;


