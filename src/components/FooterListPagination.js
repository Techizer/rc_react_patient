import React, { Component } from 'react';
import {
    Platform, Text, View, Image, Alert,
    ActivityIndicator,
    TouchableOpacity, TextInput, SafeAreaView, FlatList, Keyboard, ScrollView
} from 'react-native';
import styles, { ThemeColors } from '../styles/main.style';
import { Images, Color } from '../utils'
import Spinner from 'react-native-spinkit';

export default function FooterListPagination({ listDataLength, ended, removeItem, loading }) {
    //return (
    if (listDataLength == 0 && ended)
        return (
            <View style={{
                padding: 10
            }}>
                <Text
                    style={{
                        textAlign: "center",
                    }}
                >
                    No records found to display.
                </Text>
            </View>
        );
    if (listDataLength == 0 && removeItem)
        return (
            <View style={{
                padding: 10
            }}>
                <Text
                    style={{
                        textAlign: "center",
                    }}
                >
                    No records found to display.
                </Text>
            </View>
        );
    // if (ended) return <View style={pagestyles.PersonList}><Text style={{
    //     textAlign: 'center'
    // }}>No more records found to display.</Text></View>;

    if (!loading) return null;

    return (
        <Spinner
            isVisible={true}
            size={30}
            type={'Wave'}
            color={Color.primaryColor}
            style={{
                alignSelf: 'center',
                marginTop: 10
            }}
        />
    )
    return (
        <ActivityIndicator
            style={{ color: "#000", padding: 20 }}
            color={Color.primaryColor}
        />
    );
    //)
}