import {
    Modal,
    Text,
    View,
    TouchableOpacity,
    Image,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
    Colors,
    Icons,
    Font,
    windowWidth,
    LangProvider,
} from "../Provider/Utils/Utils";
import { useSelector } from "react-redux";
import { s, vs } from "react-native-size-matters";

const Alert = ({
    isVisible,
    onclose,
    title,
    message,
    positiveBtn,
    negativeBtn,
    onPositivePress = () => { },
    onNegativePress = () => { }
}) => {

    const { appLanguage, deviceToken, deviceType, contentAlign, languageIndex } = useSelector(state => state.StorageReducer)

    const [registerData, setRegisterData] = useState({
        code: '966',
        number: '',
        showCountries: false,
        country_name: "",
        registerModal: false,
        countryModal: false,
        countryList: '',
        message: "",
        country_short_code: "",
        status: false,
        isLoading: false
    })

    return (


        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={() => {
                onclose()
            }}
        >
            <View
                style={{
                    backgroundColor: "#00000080",
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 20,

                }}>
                <View
                    style={{
                        borderRadius: 20,
                        width: (windowWidth * 90) / 100,
                        position: "absolute",
                        alignSelf: "center",

                    }}
                >
                    <View
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: 10,
                            width: "100%",
                            paddingVertical: (windowWidth * 5) / 100,

                        }}
                    >
                        <View
                            style={{
                                alignSelf: "flex-start",
                                width: (windowWidth * 50) / 100,
                                paddingLeft: (windowWidth * 4) / 100,
                                flexDirection: "row",
                            }}
                        >
                            <Image
                                style={{
                                    width: (windowWidth * 6) / 100,
                                    height: (windowWidth * 6) / 100,
                                }}
                                source={Icons.logoPlain}
                            />
                            <Text
                                style={{
                                    fontFamily: Font.Medium,
                                    color: "#000",
                                    fontSize: (windowWidth * 5) / 100,
                                    paddingLeft: (windowWidth * 4) / 100,
                                }}
                            >
                                {title}
                            </Text>
                        </View>
                        <View
                            style={{
                                alignSelf: "flex-start",
                                paddingTop: (windowWidth * 1) / 100,
                                paddingHorizontal: s(16),
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop:s(5)
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: Font.Regular,
                                    color: "#000",
                                    fontSize: (windowWidth * 4) / 100,
                                }}
                            >
                                {message}
                            </Text>
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: 'space-between',
                                width: "55%",
                                marginTop: vs(15),
                                alignSelf: "flex-end",
                                paddingHorizontal:s(10)
                            }}
                        >
                            <TouchableOpacity
                            activeOpacity={0.8}
                                onPress={() => {
                                    onNegativePress()
                                }}
                                style={{
                                    width: '40%',
                                    alignSelf: "center",
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: Font.Regular,
                                        fontSize: (windowWidth * 4) / 100,
                                        color: Colors.Blue,
                                        alignSelf: "center",
                                    }}
                                >
                                    {negativeBtn}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    onPositivePress()
                                }}
                                activeOpacity={0.8}
                                style={{
                                    width: '40%',
                                    justifyContent: "center",
                                }}>
                                {

                                    // <SkypeIndicator color={Colors.Theme} size={20} />
                                    <Text
                                        style={{
                                            fontFamily: Font.Regular,
                                            fontSize: (windowWidth * 4) / 100,
                                            color: Colors.Blue,
                                            alignSelf: "center",
                                        }}>
                                        {positiveBtn}
                                    </Text>
                                }

                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>

    );

}

export default Alert;
