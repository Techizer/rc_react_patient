import {
    Text,
    View,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Image,
    Modal,
    FlatList,
    Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { Component, useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { vs, s } from "react-native-size-matters";
import {
    Colors,
    Icons,
    Font,
    config,
    apifuntion,
    msgProvider,
    LangProvider,
    Button,
    windowHeight
} from "../../Provider/Utils/Utils";
import ListBottomSheet from "../../components/ListBottomSheet";
import { useDispatch, useSelector } from "react-redux";
import { UserDetails } from "../../Redux/Actions";
import { SvgXml } from "react-native-svg";
import { rightArrow } from "../../Icons/Index";



const generalList = [
    {
        id: 1,
        name: "Yes",
    },
    {
        id: 2,
        name: "No",
    },
]
const bloodGroupList = [
    {
        id: 1,
        name: "A+",
    },
    {
        id: 2,
        name: "O+",
    },
    {
        id: 3,
        name: "B+",
    },
    {
        id: 4,
        name: "AB+",
    },
    {
        id: 5,
        name: "A-",
    },
    {
        id: 5,
        name: "B-",
    },
    {
        id: 6,
        name: "O-",
    },
    {
        id: 7,
        name: "AB-",
    },
];

const occupationList = [
    {
        id: 1,
        name: "Technician",
    },
    {
        id: 2,
        name: "Teacher",
    },
    {
        id: 3,
        name: "Machinist",
    },
    {
        id: 4,
        name: "Technologist",
    },
    {
        id: 5,
        name: "Electrician",
    },
    {
        id: 6,
        name: "Engineering technician",
    },
    {
        id: 7,
        name: "Actuary",
    },
    {
        id: 8,
        name: "Electrician",
    },
    {
        id: 9,
        name: "Tradesman",
    },
    {
        id: 10,
        name: "Mediacl laboratory scientist",
    },
    {
        id: 11,
        name: "Quantity surveyor",
    },
    {
        id: 12,
        name: "Prosthetist",
    },
    {
        id: 13,
        name: "Paramedic",
    },
    {
        id: 14,
        name: "Bricklayer",
    },
    {
        id: 15,
        name: "Special Education Teacher",
    },
    {
        id: 16,
        name: "Lawyer",
    },
    {
        id: 17,
        name: "Physician",
    },
    {
        id: 18,
        name: "other",
    },
];

const activityList = [
    {
        id: 1,
        name: "Extremely inactive",
    },
    {
        id: 2,
        name: "Sedentary",
    },
    {
        id: 3,
        name: "Moderately active",
    },
    {
        id: 4,
        name: "Vigorously active",
    },
    {
        id: 5,
        name: "Extremely active",
    },
];

const foodList = [
    {
        id: 1,
        name: "Standard",
    },
    {
        id: 2,
        name: "Pescetarian",
    },
    {
        id: 3,
        name: "Vegetarian",
    },
    {
        id: 4,
        name: "Lacto-vegetarian",
    },
    {
        id: 5,
        name: "Vegan",
    },
];

const LifeStyle = ({ navigation }) => {

    const { loggedInUserDetails, appLanguage, languageIndex } = useSelector(state => state.StorageReducer)
    const dispatch = useDispatch()
    const insets = useSafeAreaInsets()
    const [lifeStyleDetails, setLifeStyleDetails] = useState({
        smoking: '',
        smokingPopup: false,
        alcohol: '',
        alcoholPopup: false,
        bloodGroup: '',
        bloodGroupPopup: false,
        activity: '',
        activityPopup: false,
        food: '',
        foodPopup: false,
        occupation: '',
        occupationPopup: false,
        type: -1,
        isLoading: false
    })

    useEffect(() => {
        getLifeStyle()
    }, [])

    const saveLifeStyle = async () => {
        Keyboard.dismiss()
        setLifeStyleDetails(prevState => ({
            ...prevState,
            isLoading: true
        }))

        if (lifeStyleDetails.smoking === '') {
            msgProvider.showError(LangProvider.smoking_msg[languageIndex]);
            return false;
        }
        if (lifeStyleDetails.alcohol === '') {
            msgProvider.showError(LangProvider.alcohal_msg[languageIndex]);
            return false;
        }
        if (lifeStyleDetails.bloodGroup === '') {
            msgProvider.showError(LangProvider.bloodgrp_msg[languageIndex]);
            return false;
        }
        if (lifeStyleDetails.activity === '') {
            msgProvider.showError(LangProvider.activity_level[languageIndex]);
            return false;
        }
        if (lifeStyleDetails.food === '') {
            msgProvider.showError(LangProvider.food_preferance[languageIndex]);
            return false;
        }
        if (lifeStyleDetails.occupation === '') {
            msgProvider.showError(LangProvider.occuation[languageIndex]);
            return false;
        }

        let url = config.baseURL + "api-edit-patient-profile-style";

        var data = new FormData();
        data.append("user_id", loggedInUserDetails.user_id);
        data.append("smoking", lifeStyleDetails.smoking);
        data.append("alcohol", lifeStyleDetails.alcohol);
        data.append("blood_group", lifeStyleDetails.bloodGroup);
        data.append("activity_level", lifeStyleDetails.activity);
        data.append("food_preference", lifeStyleDetails.food);
        data.append("occupation", lifeStyleDetails.occupation);

        apifuntion
            .postApi(url, data)
            .then((obj) => {
                setLifeStyleDetails(prevState => ({
                    ...prevState,
                    isLoading: false
                }))
                console.log("saveLifeStyle-response----", obj);

                if (obj.status == true) {
                    dispatch(UserDetails(obj?.result))
                    msgProvider.showSuccess(obj.message);
                } else {
                    msgProvider.showError(obj.message);
                    return false;
                }
            })
            .catch((error) => {
                setLifeStyleDetails(prevState => ({
                    ...prevState,
                    isLoading: false
                }))
                console.log("saveLifeStyle-error ------- " + error);
            });
    };

    const getLifeStyle = async () => {

        let url = config.baseURL + "api-patient-profile";
        var data = new FormData();
        data.append("user_id", loggedInUserDetails.user_id);

        apifuntion.postApi(url, data)
            .then((obj) => {
                // console.log("getLifeStyle...", obj);
                if (obj.status == true) {

                    let result = obj.result;

                    if (result["smoking"] != null && result["smoking"] != "") {
                        setLifeStyleDetails(prevState => ({ ...prevState, smoking: result["smoking"] }))
                    }
                    if (result["blood_group"] != null && result["blood_group"] != "") {
                        setLifeStyleDetails(prevState => ({ ...prevState, bloodGroup: result["blood_group"] }))
                    }
                    if (result["food_preference"] != null && result["food_preference"] != '') {
                        setLifeStyleDetails(prevState => ({ ...prevState, food: result["food_preference"] }))
                    }
                    if (result["alcohol"] != null && result["alcohol"] != '') {
                        setLifeStyleDetails(prevState => ({ ...prevState, alcohol: result["alcohol"] }))
                    }
                    if (result["occupation"] != null && result["occupation"] != '') {
                        setLifeStyleDetails(prevState => ({ ...prevState, occupation: result["occupation"] }))
                    }
                    if (result["activity_level"] != null && result["activity_level"] != '') {
                        setLifeStyleDetails(prevState => ({ ...prevState, activity: result["activity_level"] }))
                    }

                } else {
                    msgProvider.alert(
                        LangProvider.information[languageIndex],
                        obj.message[languageIndex],
                        false
                    );

                    return false;
                }
            })
            .catch((error) => {
                console.log("getLifeStyle-------- error ------- " + error);
            });
    };
    return (
        <View
            pointerEvents={lifeStyleDetails.isLoading ? 'none' : 'auto'}
            style={{ flex: 1, backgroundColor: Colors.White, }}>

            <KeyboardAwareScrollView
                // keyboardOpeningTime={200}
                extraScrollHeight={50}
                enableOnAndroid={true}
                keyboardShouldPersistTaps='handled'
                contentContainerStyle={{
                    justifyContent: 'center',
                    paddingTop: vs(10),
                    paddingBottom: vs(30),
                }}
                showsVerticalScrollIndicator={false}>

                <View style={{
                    width: '93%',
                    alignSelf: 'center'
                }}>

                    {/* ----------------------------------------------------- */}
                    <View>
                        <Text
                            style={{
                                fontSize: Font.medium,
                                alignSelf: 'flex-start',
                                fontFamily: Font.Medium,
                                includeFontPadding: false,
                            }}>
                            {LangProvider.smoking[languageIndex]}
                        </Text>
                        <View
                            style={{
                                width: "100%",
                                height: 50,
                                alignSelf: "center",
                                marginTop: vs(8),
                                flexDirection: "row",
                                borderColor: lifeStyleDetails.smokingPopup ? Colors.Theme : Colors.Border,
                                borderWidth: 1,
                                borderRadius: 3,
                                paddingHorizontal: s(9)
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    setLifeStyleDetails(prevState => ({ ...prevState, smokingPopup: true, type: 1 }))
                                }}
                                style={{ width: "100%", flexDirection: "row" }}>
                                <View
                                    style={{
                                        width: "85%",
                                        height: '100%',
                                        justifyContent: "center",
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: Font.medium,
                                            alignSelf: 'flex-start',
                                            fontFamily: Font.Regular,
                                            includeFontPadding: false,
                                        }}>
                                        {lifeStyleDetails.smoking == '' ? LangProvider.smoking[languageIndex] : lifeStyleDetails.smoking}
                                    </Text>
                                </View>

                                <View
                                    style={{
                                        width: "15%",
                                        alignItems: 'flex-end',
                                        justifyContent: 'center',
                                        paddingHorizontal:5
                                    }}>
                                    <SvgXml
                                        xml={rightArrow}
                                        height={vs(17.11)}
                                        width={s(8)}
                                        fillOpacity={1}
                                        style={{ transform: [{ rotate: "90deg" }] }} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* ----------------------------------------------------- */}

                    <View style={{ marginTop: vs(15) }}>
                        <Text
                            style={{
                                fontSize: Font.medium,
                                alignSelf: 'flex-start',
                                fontFamily: Font.Medium,
                                includeFontPadding: false,
                            }}>
                            {LangProvider.Alcohol[languageIndex]}
                        </Text>
                        <View
                            style={{
                                width: "100%",
                                height: 50,
                                alignSelf: "center",
                                marginTop: vs(8),
                                flexDirection: "row",
                                borderColor: lifeStyleDetails.alcoholPopup ? Colors.Theme : Colors.Border,
                                borderWidth: 1,
                                borderRadius: 3,
                                paddingHorizontal: s(9)
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    setLifeStyleDetails(prevState => ({ ...prevState, alcoholPopup: true, type: 2 }))
                                }}
                                style={{ width: "100%", flexDirection: "row" }}>
                                <View
                                    style={{
                                        width: "85%",
                                        height: '100%',
                                        justifyContent: "center",
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: Font.medium,
                                            alignSelf: 'flex-start',
                                            fontFamily: Font.Regular,
                                            includeFontPadding: false,
                                        }}>
                                        {lifeStyleDetails.alcohol === '' ? LangProvider.Alcohol[languageIndex] : lifeStyleDetails.alcohol}
                                    </Text>
                                </View>

                                <View
                                    style={{
                                        width: "15%",
                                        alignItems: 'flex-end',
                                        justifyContent: 'center',
                                        paddingHorizontal:5
                                    }}>
                                    <SvgXml
                                        xml={rightArrow}
                                        height={vs(17.11)}
                                        width={s(8)}
                                        fillOpacity={1}
                                        style={{ transform: [{ rotate: "90deg" }] }} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* ----------------------------------------------------- */}

                    <View style={{ marginTop: vs(15) }}>
                        <Text
                            style={{
                                fontSize: Font.medium,
                                alignSelf: 'flex-start',
                                fontFamily: Font.Medium,
                                includeFontPadding: false,
                            }}>
                            {LangProvider.blood[languageIndex]}
                        </Text>
                        <View
                            style={{
                                width: "100%",
                                height: 50,
                                alignSelf: "center",
                                marginTop: vs(8),
                                flexDirection: "row",
                                borderColor: lifeStyleDetails.bloodGroupPopup ? Colors.Theme : Colors.Border,
                                borderWidth: 1,
                                borderRadius: 3,
                                paddingHorizontal: s(9)
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    setLifeStyleDetails(prevState => ({ ...prevState, bloodGroupPopup: true, type: 3 }))
                                }}
                                style={{ width: "100%", flexDirection: "row" }}>
                                <View
                                    style={{
                                        width: "85%",
                                        height: '100%',
                                        justifyContent: "center",
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: Font.medium,
                                            alignSelf: 'flex-start',
                                            fontFamily: Font.Regular,
                                            includeFontPadding: false,
                                        }}>
                                        {lifeStyleDetails.bloodGroup === '' ? LangProvider.blood[languageIndex] : lifeStyleDetails.bloodGroup}
                                    </Text>
                                </View>

                                <View
                                    style={{
                                        width: "15%",
                                        alignItems: 'flex-end',
                                        justifyContent: 'center',
                                        paddingHorizontal:5
                                    }}>
                                    <SvgXml
                                        xml={rightArrow}
                                        height={vs(17.11)}
                                        width={s(8)}
                                        fillOpacity={1}
                                        style={{ transform: [{ rotate: "90deg" }] }} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* ----------------------------------------------------- */}

                    <View style={{ marginTop: vs(15) }}>
                        <Text
                            style={{
                                fontSize: Font.medium,
                                alignSelf: 'flex-start',
                                fontFamily: Font.Medium,
                                includeFontPadding: false,
                            }}>
                            {LangProvider.activity[languageIndex]}
                        </Text>
                        <View
                            style={{
                                width: "100%",
                                height: 50,
                                alignSelf: "center",
                                marginTop: vs(8),
                                flexDirection: "row",
                                borderColor: lifeStyleDetails.activityPopup ? Colors.Theme : Colors.Border,
                                borderWidth: 1,
                                borderRadius: 3,
                                paddingHorizontal: s(9)
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    setLifeStyleDetails(prevState => ({ ...prevState, activityPopup: true, type: 4 }))
                                }}
                                style={{ width: "100%", flexDirection: "row" }}>
                                <View
                                    style={{
                                        width: "85%",
                                        height: '100%',
                                        justifyContent: "center",
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: Font.medium,
                                            alignSelf: 'flex-start',
                                            fontFamily: Font.Regular,
                                            includeFontPadding: false,
                                        }}>
                                        {lifeStyleDetails.activity === '' ? LangProvider.activity[languageIndex] : lifeStyleDetails.activity}
                                    </Text>
                                </View>

                                <View
                                    style={{
                                        width: "15%",
                                        justifyContent: 'center',
                                        alignItems:'flex-end',
                                        paddingHorizontal:5
                                    }}>
                                    <SvgXml
                                        xml={rightArrow}
                                        height={vs(17.11)}
                                        width={s(8)}
                                        fillOpacity={1}
                                        style={{ transform: [{ rotate: "90deg" }] }} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* ----------------------------------------------------- */}

                    <View style={{ marginTop: vs(15) }}>
                        <Text
                            style={{
                                fontSize: Font.medium,
                                alignSelf: 'flex-start',
                                fontFamily: Font.Medium,
                                includeFontPadding: false,
                            }}>
                            {LangProvider.food[languageIndex]}
                        </Text>
                        <View
                            style={{
                                width: "100%",
                                height: 50,
                                alignSelf: "center",
                                marginTop: vs(8),
                                flexDirection: "row",
                                borderColor: lifeStyleDetails.foodPopup ? Colors.Theme : Colors.Border,
                                borderWidth: 1,
                                borderRadius: 3,
                                paddingHorizontal: s(9)
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    setLifeStyleDetails(prevState => ({ ...prevState, foodPopup: true, type: 5 }))
                                }}
                                style={{ width: "100%", flexDirection: "row" }}>
                                <View
                                    style={{
                                        width: "85%",
                                        height: '100%',
                                        justifyContent: "center",
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: Font.medium,
                                            alignSelf: 'flex-start',
                                            fontFamily: Font.Regular,
                                            includeFontPadding: false,
                                        }}>
                                        {lifeStyleDetails.food === '' ? LangProvider.food[languageIndex] : lifeStyleDetails.food}
                                    </Text>
                                </View>

                                <View
                                    style={{
                                        width: "15%",
                                        alignItems: 'flex-end',
                                        justifyContent: 'center',
                                        paddingHorizontal:5
                                    }}>
                                    <SvgXml
                                        xml={rightArrow}
                                        height={vs(17.11)}
                                        width={s(8)}
                                        fillOpacity={1}
                                        style={{ transform: [{ rotate: "90deg" }] }} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* ----------------------------------------------------- */}

                    <View style={{ marginTop: vs(15) }}>
                        <Text
                            style={{
                                fontSize: Font.medium,
                                alignSelf: 'flex-start',
                                fontFamily: Font.Medium,
                                includeFontPadding: false,
                            }}>
                            {LangProvider.occupation[languageIndex]}
                        </Text>
                        <View
                            style={{
                                width: "100%",
                                height: 50,
                                alignSelf: "center",
                                marginTop: vs(8),
                                flexDirection: "row",
                                borderColor: lifeStyleDetails.occupationPopup ? Colors.Theme : Colors.Border,
                                borderWidth: 1,
                                borderRadius: 3,
                                paddingHorizontal: s(9)
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    setLifeStyleDetails(prevState => ({ ...prevState, occupationPopup: true, type: 6 }))
                                }}
                                style={{ width: "100%", flexDirection: "row" }}>
                                <View
                                    style={{
                                        width: "85%",
                                        height: '100%',
                                        justifyContent: "center",
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: Font.medium,
                                            alignSelf: 'flex-start',
                                            fontFamily: Font.Regular,
                                            includeFontPadding: false,
                                        }}>
                                        {lifeStyleDetails.occupation === '' ? LangProvider.occupation[languageIndex] : lifeStyleDetails.occupation}
                                    </Text>
                                </View>

                                <View
                                    style={{
                                        width: "15%",
                                        alignItems: 'flex-end',
                                        justifyContent: 'center',
                                        paddingHorizontal:5
                                    }}>
                                    <SvgXml
                                        xml={rightArrow}
                                        height={vs(17.11)}
                                        width={s(8)}
                                        fillOpacity={1}
                                        style={{ transform: [{ rotate: "90deg" }] }} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Button
                        text={LangProvider.submitbtntext[languageIndex]}
                        onPress={() => saveLifeStyle()}
                        btnStyle={{ marginTop: vs(15) }}
                        onLoading={lifeStyleDetails.isLoading}
                    />


                </View>


            </KeyboardAwareScrollView>

            <ListBottomSheet
                visible={lifeStyleDetails.smokingPopup || lifeStyleDetails.alcoholPopup || lifeStyleDetails.bloodGroupPopup || lifeStyleDetails.activityPopup || lifeStyleDetails.foodPopup || lifeStyleDetails.occupationPopup}
                onRequestClose={() => {
                    lifeStyleDetails.smokingPopup ?
                        setLifeStyleDetails(prevState => ({ ...prevState, smokingPopup: false }))
                        :
                        lifeStyleDetails.alcoholPopup ?
                            setLifeStyleDetails(prevState => ({ ...prevState, alcoholPopup: false }))
                            :
                            lifeStyleDetails.bloodGroupPopup ?
                                setLifeStyleDetails(prevState => ({ ...prevState, bloodGroupPopup: false }))
                                :
                                lifeStyleDetails.activityPopup ?
                                    setLifeStyleDetails(prevState => ({ ...prevState, activityPopup: false }))
                                    :
                                    lifeStyleDetails.foodPopup ?
                                        setLifeStyleDetails(prevState => ({ ...prevState, foodPopup: false }))
                                        :
                                        setLifeStyleDetails(prevState => ({ ...prevState, occupationPopup: false }))

                }}
                data={(lifeStyleDetails.type === 1 || lifeStyleDetails.type === 2) ? generalList : lifeStyleDetails.type === 3 ? bloodGroupList : lifeStyleDetails.type === 4 ? activityList : lifeStyleDetails.type === 5 ? foodList : lifeStyleDetails.type === 6 ? occupationList : null}
                style={{ height: (lifeStyleDetails.smokingPopup || lifeStyleDetails.alcoholPopup) ? windowHeight / 4 : windowHeight / 1.5 }}
                title={lifeStyleDetails.type === 1 ?
                    LangProvider.smoking[languageIndex]
                    : lifeStyleDetails.type === 2 ?
                        LangProvider.Alcohol[languageIndex]
                        : lifeStyleDetails.type === 3 ?
                            LangProvider.blood[languageIndex]
                            : lifeStyleDetails.type === 4 ?
                                LangProvider.activity[languageIndex]
                                : lifeStyleDetails.type === 5 ?
                                    LangProvider.food[languageIndex]
                                    : lifeStyleDetails.type === 6 ?
                                        LangProvider.occupation[languageIndex]
                                        : null}
                selectedIssue={(val) => {
                    lifeStyleDetails.type === 1 ?
                        setLifeStyleDetails(prevState => ({ ...prevState, smoking: val }))
                        :
                        lifeStyleDetails.type === 2 ?
                            setLifeStyleDetails(prevState => ({ ...prevState, alcohol: val }))
                            :
                            lifeStyleDetails.type === 3 ?
                                setLifeStyleDetails(prevState => ({ ...prevState, bloodGroup: val }))
                                :
                                lifeStyleDetails.type === 4 ?
                                    setLifeStyleDetails(prevState => ({ ...prevState, activity: val }))
                                    :
                                    lifeStyleDetails.type === 5 ?
                                        setLifeStyleDetails(prevState => ({ ...prevState, food: val }))
                                        :
                                        lifeStyleDetails.type === 6 ?
                                            setLifeStyleDetails(prevState => ({ ...prevState, occupation: val }))
                                            :
                                            null
                }}
            />

        </View>
    )
}

export default LifeStyle;


