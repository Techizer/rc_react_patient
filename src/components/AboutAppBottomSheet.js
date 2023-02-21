import React from "react";
import { Text, TouchableOpacity, View, ScrollView, StyleSheet, TouchableHighlight, Keyboard, FlatList, } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import HTMLView from "react-native-htmlview";
import { SvgXml } from "react-native-svg";
import { s, vs } from "react-native-size-matters";

import { Colors, Font } from "../Provider/Colorsfont";
import { windowWidth, windowHeight } from "../Provider/Utils/Utils";
import { Cross} from "../Icons/Index";



const AboutAppBottomSheet = ({
    visible,
    onRequestClose,
    data
}) => {
    const Backdrop = () => (
        <View style={{
            flex:1,
            backgroundColor:'pink'
        }}  />
      );
    return (

        <RBSheet
            // animationType='slide'
            BackdropComponent={Backdrop}
            closeOnPressBack={false}
            ref={visible}
            height={windowHeight / 1.5}
            openDuration={350}
            closeDuration={350}
            customStyles={{
                wrapper: {
                    backgroundColor: "rgba(0,0,0,0.6)",
                    
                },
                container: {
                    justifyContent: "center",
                    alignItems: "center",
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    paddingTop: vs(55),
                    paddingBottom: vs(20),
                    paddingHorizontal: s(13),
                }
            }}>
            <TouchableHighlight
                onPress={onRequestClose}
                underlayColor={Colors.Highlight}
                style={styles.closeContainer}
            >
                <SvgXml xml={Cross} height={vs(19)} width={s(18)} />
            </TouchableHighlight>

            <ScrollView
                showsVerticalScrollIndicator={true}>
                <View
                    style={{
                        paddingBottom: (windowWidth * 15) / 100,
                        paddingTop: (windowWidth * 2) / 100,
                    }}
                >
                    <HTMLView
                        value={data}
                        stylesheet={HTMLstyles}
                    />
                </View>
            </ScrollView>
        </RBSheet>

    )
}
const styles = StyleSheet.create({

    modalContainer: {
        width: windowWidth,
        height: windowHeight / 1.5,
        backgroundColor: Colors.White,
        borderRadius: 25,
        paddingTop: vs(55),
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
        top: vs(0),
        right: s(0),
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

export default AboutAppBottomSheet;


