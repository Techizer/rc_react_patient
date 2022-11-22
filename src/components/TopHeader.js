import React, { Component } from 'react';
import {
    Platform, Text, View, Image, Alert,
    ActivityIndicator,
    TouchableOpacity, TextInput, SafeAreaView, FlatList, Keyboard, ScrollView
} from 'react-native';
import styles, { ThemeColors } from '../styles/main.style';
import { Images } from '../utils'
import { Actions } from 'react-native-router-flux';

export default function TopHeader({ title, customStyles, onPress, onPressRight, rightIcon, image, onLoading, isMenu }) {
    return (
        <View>
            <View style={styles.topHeaderMain}>
                <View style={styles.topHeaderBackButton}>
                    {
                        (isMenu) ?
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={()=>{
                                    Actions.drawerOpen()
                                }}
                                style={{
                                    marginTop: 5
                                }}
                                >
                                <Image
                                    source={Images.homemenu}
                                />
                            </TouchableOpacity> :
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={onPress}>
                                <Image
                                    source={Images.leftArrow}
                                />
                            </TouchableOpacity>
                    }

                </View>
                <View>
                    <Text style={styles.topHeadingtext}>{title}</Text>
                </View>
                <View style={styles.topHeadingRight}>
                    {
                        (rightIcon) ?
                            rightIcon : null
                    }

                </View>
            </View>
        </View>
    )
}