import React, { Component, useEffect } from "react";
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    Platform,
} from "react-native";
import { SkypeIndicator } from "react-native-indicators";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
    Colors,
    Font,
    config,
    windowHeight,
    windowWidth,
    deviceHeight,
    LangProvider,
    StatusbarHeight,
} from "../Provider/Utils/Utils";

import { leftArrow, rightArrow, Notification, dummyUser, Icons, redNoti } from "../Icons/Index";
import { SvgXml } from "react-native-svg";
import { s, vs } from "react-native-size-matters";
import { useSelector } from "react-redux";

let headerHeight = deviceHeight - windowHeight;
headerHeight += (Platform.OS === 'ios') ? 28 : -50


// console.log('Status Bar Height', StatusbarHeight + '   ' + Platform.OS);
// console.log(headerHeight + '   ' + Platform.OS);
// console.log(deviceHeight + '   ' + Platform.OS);
// console.log(windowHeight + '   ' + Platform.OS);

export const ScreenHeader = ({
    onBackPress,
    title,
    navigation,
    rightIcon,
    leftIcon,
    defaultAddress,
    isLoading,
    renderHeaderWOBack
}) => {

    const insets = useSafeAreaInsets()


    const { languageIndex, notiCount, guest, address } = useSelector(state => state.StorageReducer)

    return (
        title != LangProvider.Home[config.language] ?
            (
                <View
                    style={{
                        width: windowWidth,
                        height: (windowWidth * 25) / 100,
                        // height: headerHeight + insets,
                        paddingTop: insets.top,
                        paddingBottom: (windowWidth * 0.5) / 100,
                        backgroundColor: Colors.White,
                        borderBottomWidth: 0.9,
                        borderBottomColor: Colors.Border
                    }}>
                    <View
                        style={{
                            flexDirection: "row",
                            width: "100%",
                            height: '100%',
                            alignSelf: "center",
                            alignItems: "center",
                        }}>
                        {
                            (leftIcon && isLoading) ?
                                <View
                                    style={{
                                        width: "14%",
                                        height: '100%',
                                        alignSelf: "center",
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }} >
                                    <SkypeIndicator color={Colors.Theme} size={20} />
                                </View>
                                :
                                leftIcon ?
                                    <TouchableHighlight
                                        underlayColor={Colors.Highlight}
                                        activeOpacity={0.7}
                                        onPress={onBackPress}
                                        style={{
                                            width: "14%",
                                            height: '100%',
                                            alignSelf: "center",
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }} >
                                        <SvgXml xml={
                                            languageIndex == 0 ?
                                                leftArrow : rightArrow
                                        } height={vs(17.11)} width={s(9.72)} fill={'red'} fillOpacity={1} />

                                    </TouchableHighlight>
                                    :
                                    <View style={{ width: '14%' }}></View>
                        }

                        {
                            !renderHeaderWOBack ?
                            <View style={{ flexDirection: 'row', width:'100%',height: '100%', }}>
                                <View
                                    style={{
                                        width: "72%",
                                        height: '80%',
                                        justifyContent: 'center'
                                    }}>
                                    <Text
                                        style={{
                                            textAlign: "center",
                                            fontFamily: Font.Medium,
                                            fontSize: (windowWidth * 4) / 100,
                                            color: Colors.darkText
                                        }}>{title}</Text>
                                </View>

                                {
                                    rightIcon ?
                                        <TouchableHighlight
                                            underlayColor={Colors.Highlight}
                                            onPress={() => {
                                                navigation.navigate("Notifications");
                                            }}
                                            style={{
                                                width: "14%",
                                                height: '100%',
                                                justifyContent: 'center',
                                                alignItems: 'center',

                                            }}>
                                            <SvgXml xml={notiCount > 0 ? redNoti : Notification} height={vs(20.26)} width={s(16.21)} />
                                        </TouchableHighlight>
                                        :
                                        <View style={{ width: '14%' }}></View>
                                }
                            </View>
                            :
                            renderHeaderWOBack()
                        }

                    </View>
                </View>
            )
            :
            (<View style={{
                width: windowWidth,
                // height: headerHeight + StatusbarHeight,
                // paddingTop: StatusbarHeight + 10,
                height: (windowWidth * 25) / 100,
                paddingTop: insets.top,
                paddingBottom: (windowWidth * 0.5) / 100,
                // paddingTop: (windowWidth * 10) / 100,
                backgroundColor: Colors.White,
                borderBottomWidth: 0.9,
                borderBottomColor: Colors.Border
            }}>
                <View
                    style={{
                        flexDirection: "row",
                        width: "100%",
                        height: '100%',
                        alignSelf: "center",
                        // alignItems: "center",
                    }}>
                    <View
                        style={{
                            width: "13%",
                            height: '100%',
                            alignSelf: "center",
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingLeft: s(8)
                        }}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.toggleDrawer();
                            }}>

                            {
                                (leftIcon == "NA" || leftIcon == "" || leftIcon == null) ?
                                    <SvgXml xml={dummyUser} height={s(29)} width={s(29)} />
                                    :
                                    <Image
                                        source={{ uri: leftIcon }}
                                        style={{ height: s(29), width: s(29), borderRadius: s(29), backgroundColor: Colors.backgroundcolor, alignSelf: 'center' }}
                                    />

                            }

                        </TouchableOpacity>
                    </View>
                    <View style={{
                        width: "74%",
                        height: '100%',
                        justifyContent: 'center',
                        paddingHorizontal: s(6),
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                if (!guest) {
                                    navigation.navigate("ManageAddress");
                                }
                            }}
                            style={{
                                flexDirection: "row",
                                width: "100%",
                                alignItems: "center",
                            }}>
                            <Text
                                numberOfLines={1}
                                style={{
                                    fontFamily: Font.Regular,
                                    fontSize: Font.small,
                                    maxWidth: '25%',
                                }}>
                                {(address?.title != '' && address?.title != null && address?.title != undefined) ? address?.title : LangProvider.MyDashboard[languageIndex]}
                            </Text>
                            <Image
                                source={Icons.downarrow}
                                style={{
                                    marginLeft: (windowWidth * 2) / 100,
                                    width: 11,
                                    height: 11,
                                    tintColor: "#17181A",
                                }}
                            />
                        </TouchableOpacity>
                        {(defaultAddress != null && defaultAddress != "") ? (
                            <Text
                                onPress={() => {
                                    if (!guest) {
                                        navigation.navigate("ManageAddress");
                                    }
                                }}
                                numberOfLines={1}
                                style={{
                                    color: Colors.dullGrey,
                                    fontFamily: Font.Regular,
                                    fontSize: Font.small,
                                    textAlign: config.textRotate,
                                    width: '60%',
                                    marginTop: vs(3)


                                }}
                            >
                                {defaultAddress}
                            </Text>
                        ) : (
                            null
                        )}
                    </View>

                    {
                        rightIcon ?
                            <>
                                <TouchableHighlight
                                    underlayColor={Colors.Highlight}
                                    onPress={() => {
                                        navigation.navigate("Notifications");
                                    }}
                                    style={{
                                        width: "14%",
                                        height: '100%',
                                        justifyContent: 'center',
                                        alignItems: 'center',

                                    }}>
                                    <SvgXml xml={notiCount > 0 ? redNoti : Notification} height={vs(20.26)} width={s(16.21)} />
                                </TouchableHighlight>
                            </>
                            :
                            <></>
                    }
                    {/* <View
                        style={{
                            width: "10%",
                            paddingTop: (windowWidth * 2) / 100,
                            justifyContent: "center",
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate("Notifications");
                            }}
                        >
                            <Image
                                source={
                                    this.state.notification_count > 0
                                        ? Icons.notifications
                                        : Icons.notifications_sec
                                }
                                style={{
                                    alignSelf: "flex-end",
                                    resizeMode: "contain",
                                    width: (windowWidth * 6) / 100,
                                    height: (windowWidth * 6) / 100,
                                }}
                            />
                        </TouchableOpacity>
                    </View> */}
                </View>
            </View>)
    )
}


