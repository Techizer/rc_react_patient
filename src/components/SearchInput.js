import React, { Component } from "react";
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
    config,
    windowWidth,
    Lang_chg,
} from "../Provider/utilslib/Utils";

import { Filter, Search } from "../icons/SvgIcons/Index";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";



const SearchInput = ({
    placeholder,
    onChangeText,
    onSubmitEditing,
    onPressSearch
}) => {
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: 'space-between',
                width: "92%",
                height: vs(36),
                marginTop: vs(7),
                alignSelf: "center",
                alignItems: "center",
            }}
        >
            {/* search box */}
            <View style={{ width: '87%', height: '100%', flexDirection: 'row', borderRadius: 9, backgroundColor: Colors.White, alignItems: 'center' }}>
                <View style={{ width: '86%', paddingHorizontal: s(8) }}>
                    <TextInput
                        placeholder={placeholder}
                        placeholderTextColor={Colors.lightGrey}
                        onChangeText={onChangeText}
                        returnKeyLabel="done"
                        returnKeyType="done"
                        onSubmitEditing={onSubmitEditing}
                        style={[
                            {
                                // color: "#000",
                                width: "100%",
                                fontFamily: Font.fontregular,
                                fontSize: Font.small,
                                textAlign: config.textalign,
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
                            onPress={onPressSearch}>

                            <SvgXml xml={Search} height={vs(14)} width={s(14)} />
                        </TouchableOpacity>
                    </View>
                </View>

            </View>

            <View style={{ width: '12%', height: '100%', borderRadius: 9, backgroundColor: Colors.Green, justifyContent: 'center', alignItems: 'center' }}>
                <SvgXml xml={Filter} height={vs(14)} width={s(20)} />
            </View>
        </View>
    )
}


export default SearchInput;

