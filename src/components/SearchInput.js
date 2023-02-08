import React, { Component, useRef, useState } from "react";
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    FlatList,
    Keyboard,
    Modal,
    ScrollView,
    Platform,
} from "react-native";
import {
    Colors,
    Font,
} from "../Provider/Utils/Utils";

import { Cross, Filter, Search } from "../Icons/Index";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import { useSelector } from "react-redux";



const SearchInput = ({
    placeholder,
    onChangeText,
    value,
    onSubmitEditing,
    onPressSearch,
    onCrossPress,
    isSearch,
    onFilterPress,
    navigation
}) => {
    const {appLanguage, languageIndex} = useSelector(state => state.StorageReducer)
    const inputRef = useRef()
    return (
        navigation ?
            (
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('FindAddress')}
                    style={{
                        flexDirection: "row",
                        justifyContent: 'space-between',
                        width: "92%",
                        height: vs(36),
                        marginTop: vs(7),
                        alignSelf: "center",
                        alignItems: "center",
                    }}>
                    {/* search box */}
                    <View style={{ width: '100%', height: '100%', flexDirection: 'row', borderRadius: 9, backgroundColor: Colors.White, alignItems: 'center' }}>
                        <View style={{ width: '86%', paddingHorizontal: s(8) }}>
                            <Text
                                style={[
                                    {
                                        width: "100%",
                                        fontFamily: Font.Regular,
                                        fontSize: Font.small,
                                        alignSelf:'flex-start',
                                        color: Colors.lightGrey
                                    },
                                ]}

                            >{placeholder}</Text>
                        </View>

                        <View style={{ width: '14%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{
                                height: '80%',
                                width: '80%',
                                borderRadius: 8,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: Colors.Green
                            }}>
                                <SvgXml xml={isSearch ? Cross : Search} height={vs(14)} width={s(14)} />
                            </View>
                        </View>

                    </View>
                </TouchableOpacity>
            )
            :
            (

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: 'space-between',
                        width: "92%",
                        height: vs(36),
                        marginTop: vs(7),
                        alignSelf: "center",
                        alignItems: "center",
                    }}>
                    {/* search box */}
                    <View style={{ width: '100%', height: '100%', flexDirection: 'row', borderRadius: 9, backgroundColor: Colors.White, alignItems: 'center' }}>
                        <View style={{ width: '86%', paddingHorizontal: s(8), }}>
                            <TextInput 
                                ref={inputRef}
                                placeholder={placeholder}
                                placeholderTextColor={Colors.lightGrey}
                                onChangeText={onChangeText}
                                value={value}
                                returnKeyLabel="done"
                                returnKeyType="done"
                                onSubmitEditing={onSubmitEditing}
                                style={[
                                    {
                                        // color: "#000",
                                        width: "100%",
                                        fontFamily: Font.Regular,
                                        fontSize: Font.small,
                                        textAlign: languageIndex == 0 ? 'left' : 'right',
                                    },
                                    // this.state.pass_status == "physiotherapy" || "caregiver"
                                    // ? { fontSize: (mobileW * 3.7) / 100 }
                                    // : { fontSize: (mobileW * 4) / 100 },
                                ]}
                            />
                        </View>

                        <View style={{ width: '14%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{
                                height: '80%',
                                width: '80%',
                                borderRadius: 8,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: Colors.Green
                            }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (isSearch) {
                                            onCrossPress()
                                            inputRef.current.blur()
                                        } else {
                                            onPressSearch()
                                        }
                                    }}>

                                    <SvgXml xml={isSearch ? Cross : Search} height={vs(14)} width={s(14)} />
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>



                </View>

            )
    )
}


export default SearchInput;



// <View style={{ width: '12%', height: '100%', borderRadius: 9, justifyContent: 'center', alignItems: 'center' }}>
// <View style={{
//     height: '80%',
//     width: '80%',
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: Colors.Blue
// }}>
//     <TouchableOpacity
//         onPress={onFilterPress}>

//         <SvgXml xml={Filter} height={vs(14)} width={s(17)} />
//     </TouchableOpacity>
// </View>
// </View>