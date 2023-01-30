import React, { useEffect } from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet, Dimensions, } from "react-native";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from 'react-native-svg';
import { useSelector } from "react-redux";

import { Colors } from "../Provider/Colorsfont";
import { Font } from "../Provider/Colorsfont";



const DrawerItemContainer = ({
    leftIcon,
    rightIcon,
    title,
    subtitle,
    onPress,
    disable = false
}) => {

    const {
        contentAlign,
        guest,
        loggedInUserDetails,
    } = useSelector(state => state.StorageReducer)

    const styles = StyleSheet.create({
        mainContainer: {
            width: '100%',
            justifyContent: 'center',
            flexDirection: 'row',
            marginTop: vs(22),
            paddingLeft: vs(19),

        },
        rightContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '87%',
        },
        leftContainer: {
            width: '13%',

        },
        title: {
            color: Colors.Black,
            fontFamily: Font.Medium,
            fontSize: Font.medium,
            alignSelf: 'flex-start',
            textAlign: contentAlign,
            opacity: (disable == true) ? 0.3 : 1
        },
        desc: {
            color: Colors.DarkGrey,
            fontFamily: Font.Regular,
            fontSize: Font.small,
            alignSelf: 'flex-start',
            textAlign: 'left',
            marginTop: vs(4),
            opacity: (disable == true) ? 0.3 : 1
        }


    });

    return (
        <TouchableOpacity
            disabled={disable}
            activeOpacity={0.6}
            onPress={onPress ? onPress : () => { }}
            style={styles.mainContainer}>

            <View style={styles.leftContainer}>
                <SvgXml xml={leftIcon} />
            </View>


            <View style={styles.rightContainer}>
                <View style={{ width: '68%', justifyContent: 'center' }}>
                    <Text style={styles.title}>{title}</Text>
                    {
                        subtitle &&
                        <Text style={styles.desc}>{subtitle}</Text>

                    }
                </View>
                <View style={{ width: '19%', justifyContent: 'center', alignItems: 'center' }}>
                    <SvgXml xml={rightIcon} height={vs(11.98)} width={s(6.42)} />
                </View>
            </View>
        </TouchableOpacity>

    )
}


export default DrawerItemContainer;


