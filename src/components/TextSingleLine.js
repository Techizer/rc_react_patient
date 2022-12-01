import React, { useEffect } from 'react';
import { StyleSheet, Text, } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { color } from 'react-native-reanimated';
import { Color, Fonts } from '../utils';
import { RF } from '../utils/responsive';

const TextSingleLine = ({ text, customStyles, onPress, image, onLoading }) => {
    return (
        <Text 
        numberOfLines={1} 
        adjustsFontSizeToFit
        style={[customStyles.textStyle]}>{text}</Text>
    )
}
TextSingleLine.defaultProps = { customStyles: {} }

// const styles = StyleSheet.create({
//     mainContainer: {
//         width: '100%',
//         height: 50,
//         borderRadius: 10,
//         justifyContent: 'center',
//         alignItems: 'center',
//         alignSelf: "center",
//         backgroundColor: Color.orange, //Color.fFSeven,
//         marginVertical: 10,
//         flexDirection: 'row',
//     },
//     buttonText: {
//         fontSize: RF(18),
//         color: 'White', //Color.White,
//         fontFamily: Fonts.semiBold,
//     },
//     img: {
//         // width: 25,
//         // height: 25,
//         marginRight: 10
//     }
// })

export default TextSingleLine