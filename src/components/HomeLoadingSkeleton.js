import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet, } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import { Colors, Font } from "../Provider/Colorsfont";
import {
    windowWidth,
} from "../Provider/Utils/Utils";
import { s, vs } from "react-native-size-matters";

const HomeLoadingSkeleton = ({ }) => {

    return (
        <View style={{
            borderRadius: 10,
            width: s(140),
            backgroundColor: Colors.White,
            borderColor: Colors.Border,
            borderWidth: 1,
            paddingBottom: vs(10)
        }}>

            <View style={{ width: '100%', }}>
                <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item width={s(140)} height={s(110)} borderTopLeftRadius={9}  borderTopRightRadius={9}/>
                </SkeletonPlaceholder>
            </View>

            <View style={{ width: '100%', paddingTop: vs(7), paddingHorizontal: s(6) }}>
                <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item width={s(70)} height={vs(10)} borderRadius={4} />
                </SkeletonPlaceholder>
            </View>
            <View style={{ width: '100%', paddingTop: vs(7), paddingHorizontal: s(6) }}>
                <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item width={s(100)} height={vs(10)} borderRadius={4} />
                </SkeletonPlaceholder>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    infoContainer: {
        backgroundColor: Colors.White,
        marginTop: vs(7),
        zIndex: 999
    },
    experienceContainer: {
        width: '100%',
        paddingTop: vs(18),
        flexDirection: 'row',
        paddingHorizontal: s(11),
        marginBottom: vs(7)
    },
    descContainer: {
        borderTopWidth: 1.5,
        borderTopColor: Colors.backgroundcolor,
        paddingHorizontal: s(11),
        paddingTop: vs(7)
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: vs(11),
        paddingHorizontal: s(11),
    },

});

export default HomeLoadingSkeleton;


