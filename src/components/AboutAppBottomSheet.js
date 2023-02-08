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

    return (

        <RBSheet
            // animationType='slide'
            closeOnPressBack={false}
            ref={visible}
            height={windowHeight / 1.5}
            openDuration={250}
            closeDuration={350}
            customStyles={{
                wrapper: {
                    // backgroundColor: "rgba(255,255,255,1)"
                },
                container: {
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 25,
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

export default AboutAppBottomSheet;


