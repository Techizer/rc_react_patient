import React, { Component } from 'react';
import {
    Platform, KeyboardAvoidingView, SafeAreaView, FlatList, Keyboard, ScrollView
} from 'react-native';
import styles, { ThemeColors } from '../styles/main.style';

export default function MainContainer(props) {
    return (
        <>
            <SafeAreaView style={{
                flex: 0,
                backgroundColor: ThemeColors.orange,
            }} />
            <SafeAreaView>
                <KeyboardAvoidingView
                    style={{
                        //flex: 1
                    }}
                    keyboardVerticalOffset={20}
                    behavior={Platform.OS == "ios" ? "padding" : "height"}
                >
                    {props.children}
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    )
}