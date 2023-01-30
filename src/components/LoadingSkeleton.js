import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet, TouchableHighlight, Keyboard, FlatList, Alert, Platform, } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import { Colors, Font } from "../Provider/Colorsfont";
import {
    windowWidth,
} from "../Provider/Utils/Utils";
import { Cross, dummyUser, Edit } from "../Icons/Index";
import { s, vs } from "react-native-size-matters";




const LoadingSkeleton = ({ }) => {

    return (
        <View style={{
            width: windowWidth,
            backgroundColor: Colors.White,
            paddingHorizontal: s(11),
            paddingVertical: vs(9),
        }}>

            <View style={styles.infoContainer}>
                <View
                    style={{
                        flexDirection: "row",
                        width: '100%',
                        paddingHorizontal: s(11),
                    }}>
                    <View style={{ width: "30%", }}>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item width={s(75)} height={s(75)} borderRadius={s(100)} />
                        </SkeletonPlaceholder>
                    </View>
                    <View
                        style={{
                            width: "70%",
                            alignSelf: "center",
                            height: '100%',
                            paddingTop: vs(3)
                        }} >
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item width={(windowWidth * 30) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                        </SkeletonPlaceholder>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item width={(windowWidth * 15) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} style={{ marginTop: vs(7) }} />
                        </SkeletonPlaceholder>
                    </View>
                </View>

                <View style={styles.experienceContainer}>
                    <View style={{ flex: 1, borderEndColor: Colors.backgroundcolor }}>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item width={(windowWidth * 20) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                        </SkeletonPlaceholder>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item width={(windowWidth * 15) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} style={{ marginTop: vs(7) }} />
                        </SkeletonPlaceholder>
                    </View>

                    <View style={{ flex: 1, borderEndColor: Colors.backgroundcolor }}>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item width={(windowWidth * 20) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                        </SkeletonPlaceholder>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item width={(windowWidth * 15) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} style={{ marginTop: vs(7) }} />
                        </SkeletonPlaceholder>
                    </View>

                    <View style={{ flex: 1, }}>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item width={(windowWidth * 20) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                        </SkeletonPlaceholder>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item width={(windowWidth * 15) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} style={{ marginTop: vs(7) }} />
                        </SkeletonPlaceholder>
                    </View>
                </View>

                <View style={styles.descContainer}>
                    <SkeletonPlaceholder>
                        <SkeletonPlaceholder.Item width={(windowWidth * 80) / 100} height={(windowWidth * 8) / 100} borderRadius={s(4)} />
                    </SkeletonPlaceholder>
                </View>


                <View style={styles.timeContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item width={(windowWidth * 7) / 100} height={(windowWidth * 7) / 100} borderRadius={s(20)} />
                        </SkeletonPlaceholder>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item width={(windowWidth * 15) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} style={{ marginLeft: s(7) }} />
                        </SkeletonPlaceholder>
                    </View>

                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item width={(windowWidth * 15) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                        </SkeletonPlaceholder>
                </View>

                {/* <View style={{ width: '100%', height: 1.5, backgroundColor: Colors.backgroundcolor, marginTop: vs(18) }}></View> */}

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
        justifyContent:'space-between',
        alignItems:'center',
        marginTop: vs(11),
        paddingHorizontal: s(11),
    },

});

export default LoadingSkeleton;


