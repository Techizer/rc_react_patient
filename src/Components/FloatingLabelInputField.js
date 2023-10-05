import React, { Component } from 'react';

import {
    Platform,
    StyleSheet,
    TextInput,
    View,
    Text,
    TouchableOpacity,
    Image,
    Pressable,
} from 'react-native';
import { Colors, Font } from '../Provider/Colorsfont';
import { windowWidth } from '../Provider/Utils/Utils';


export default class FloatingLabelInputField extends Component {
    state = {
        isFocused: false
    }
    render() {
        const {
            inputContainer,
            onParentPress,
            inputStyle,
            fieldRef,
            value,
            placeholder,
            onChangeText,
            onSubmitEditing,
            onFocus,
            onKeyPress,
            placeholderTextColor,
            leftComponent
        } = this.props
        const { isFocused } = this.state

        return (
            <Pressable
                activeOpacity={0.6}
                onPress={() => {
                    if (this.textInputLocalRef) this.textInputLocalRef.focus()
                    if (onParentPress && typeof onParentPress == 'function') onParentPress()
                }}
                style={[styles.inputContainer, inputContainer,]}>

                <View style={{ height: 55, width: '100%', justifyContent: 'center', alignItems: 'center', }}>
                    <TextInput
                        {...this.props}
                        ref={ref => {
                            this.textInputLocalRef = ref
                            if (fieldRef && typeof fieldRef == 'function') fieldRef(ref)
                        }}
                        style={[{ color: isFocused ? Colors.Black : Colors.Black, fontFamily: Font.Regular, fontSize: 24, textAlign: 'center' }]}
                        value={value}
                        placeholder={isFocused ? '' : placeholder}
                        placeholderTextColor={placeholderTextColor ? placeholderTextColor : '#00B3EC'}
                        onChangeText={(text) => {
                            if (onChangeText && typeof onChangeText == 'function') onChangeText(text)
                        }}
                        onSubmitEditing={() => {
                            if (onSubmitEditing && typeof onSubmitEditing == 'function') onSubmitEditing()
                        }}
                        onFocus={(event: Event) => {
                            this.setState({ isFocused: true })
                            if (onFocus && typeof onFocus == 'function') onFocus(event)
                        }}
                        onBlur={(event: Event) => {
                            this.setState({ isFocused: false })
                        }}
                        onKeyPress={({ nativeEvent }) => { if (onKeyPress && typeof onKeyPress == 'function') onKeyPress(nativeEvent) }}
                    />
                    {/* <Text style={{fontSize:24}}>{'2'}</Text> */}
                </View>

            </Pressable >
        )
    }
}

const styles = StyleSheet.create({
    inputContainer: {
        height: 55,
        width: (windowWidth * 14) / 100,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
        backgroundColor: Colors.White,
        borderRadius: 8,
        borderWidth: 1.5,
    },
    labelContainerStyle: {
        // backgroundColor:'red'
    },
    inputStyle: {
        height: '100%'
    },
    iconStyle: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    }
})