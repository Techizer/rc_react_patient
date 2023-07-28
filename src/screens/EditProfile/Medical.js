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
    Platform,
    Pressable,
} from "react-native";
import React, { Component, useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { vs, s, } from "react-native-size-matters";

import {
    Colors,
    Font,
    config,
    apifuntion,
    msgProvider,
    LangProvider,
    Button,
    windowWidth
} from "../../Provider/Utils/Utils";
import AuthInputBoxSec from "../../components/AuthInputBoxSec";
import { useDispatch, useSelector } from "react-redux";
import { UserDetails, UserProfile } from "../../Redux/Actions";
import NoInternet from "../../components/NoInternet";



const Medical = () => {

    const { loggedInUserDetails, appLanguage, languageIndex, deviceConnection, userProfile } = useSelector(state => state.StorageReducer)
    const dispatch = useDispatch()
    const insets = useSafeAreaInsets()
    const [medicalDetails, setMedicalDetails] = useState({
        Allergic: -1,
        allergyName: '',
        currentMed: -1,
        currentMedName: '',
        pastMed: -1,
        pastMedName: '',
        Injuries: -1,
        injuryName: '',
        Surgeries: -1,
        surgeryName: '',
        chronicDisease: -1,
        chronicDiseaseName: '',
        isLoading: false
    })

    useEffect(() => {
        if (deviceConnection) {
            getMedicalDetails()
        }
    }, [deviceConnection])

    const getMedicalDetails = async () => {

        if (userProfile["allergies_data"] != null && userProfile["allergies_data"] != "") {
            setMedicalDetails(prevState => ({ ...prevState, allergyName: userProfile["allergies_data"] }))
        }
        if (userProfile["allergies"] != null && userProfile["allergies"] != "") {
            if (userProfile["allergies"] == "0") {
                setMedicalDetails(prevState => ({ ...prevState, Allergic: 0 }))
            } else {
                setMedicalDetails(prevState => ({ ...prevState, Allergic: 1 }))
            }
        }

        if (userProfile["chronic_diseases_data"] != null && userProfile["chronic_diseases_data"] != "") {
            setMedicalDetails(prevState => ({ ...prevState, chronicDiseaseName: userProfile["chronic_diseases_data"] }))
        }
        if (userProfile["chronic_diseases"] != null && userProfile["chronic_diseases"] != "") {
            if (userProfile["chronic_diseases"] == "0") {
                setMedicalDetails(prevState => ({ ...prevState, chronicDisease: 0 }))
            } else {
                setMedicalDetails(prevState => ({ ...prevState, chronicDisease: 1 }))
            }
        }

        if (userProfile["current_medication_data"] != null && userProfile["current_medication_data"] != "") {
            setMedicalDetails(prevState => ({ ...prevState, currentMedName: userProfile["current_medication_data"] }))
        }
        if (userProfile["current_medication"] != null && userProfile["current_medication"] != "") {
            if (userProfile["current_medication"] == "0") {
                setMedicalDetails(prevState => ({ ...prevState, currentMed: 0 }))
            } else {
                setMedicalDetails(prevState => ({ ...prevState, currentMed: 1 }))
            }
        }

        if (userProfile["injuries_data"] != null && userProfile["injuries_data"] != "") {
            setMedicalDetails(prevState => ({ ...prevState, injuryName: userProfile["injuries_data"] }))
        }
        if (userProfile["injuries"] != null && userProfile["injuries"] != "") {
            if (userProfile["injuries"] == "0") {
                setMedicalDetails(prevState => ({ ...prevState, Injuries: 0 }))
            } else {
                setMedicalDetails(prevState => ({ ...prevState, Injuries: 1 }))
            }
        }

        if (userProfile["past_medication_data"] != null && userProfile["past_medication_data"] != "") {
            setMedicalDetails(prevState => ({ ...prevState, pastMedName: userProfile["past_medication_data"] }))
        }
        if (userProfile["past_medication"] != null && userProfile["past_medication"] != "") {
            if (userProfile["past_medication"] == "0") {
                setMedicalDetails(prevState => ({ ...prevState, pastMed: 0 }))
            } else {
                setMedicalDetails(prevState => ({ ...prevState, pastMed: 1 }))
            }
        }

        if (userProfile["surgeries_data"] != null && userProfile["surgeries_data"] != "") {
            setMedicalDetails(prevState => ({ ...prevState, surgeryName: userProfile["surgeries_data"] }))
        }
        if (userProfile["surgeries"] != null && userProfile["surgeries"] != "") {
            if (userProfile["surgeries"] == "0") {
                setMedicalDetails(prevState => ({ ...prevState, Surgeries: 0 }))
            } else {
                setMedicalDetails(prevState => ({ ...prevState, Surgeries: 1 }))
            }
        }


    };

    const saveMedical = async () => {

        Keyboard.dismiss()

        if (medicalDetails.Allergic === 0 & medicalDetails.allergyName === '') {
            msgProvider.showError(LangProvider.allergyName[languageIndex]);
            return false;
        }
        if (medicalDetails.currentMed === 0 & medicalDetails.currentMedName === '') {
            msgProvider.showError(LangProvider.currentMedicine[languageIndex]);
            return false;
        }
        if (medicalDetails.pastMed === 0 & medicalDetails.pastMedName === '') {
            msgProvider.showError(LangProvider.pastMedicine[languageIndex]);
            return false;
        }
        if (medicalDetails.Injuries === 0 & medicalDetails.injuryName === '') {
            msgProvider.showError(LangProvider.injuries[languageIndex]);
            return false;
        }
        if (medicalDetails.Surgeries === 0 & medicalDetails.surgeryName === '') {
            msgProvider.showError(LangProvider.surgeries[languageIndex]);
            return false;
        }
        if (medicalDetails.chronicDisease === 0 & medicalDetails.chronicDiseaseName === '') {
            msgProvider.showError(LangProvider.chronicDisease[languageIndex]);
            return false;
        }

        setMedicalDetails(prevState => ({
            ...prevState,
            isLoading: true
        }))
        let url = config.baseURL + "api-edit-patient-profile-medical";

        var data = new FormData();
        data.append("user_id", loggedInUserDetails?.user_id);
        data.append("allergies", medicalDetails.Allergic);
        data.append("allergies_data", medicalDetails.allergyName);
        data.append("current_medication", medicalDetails.currentMed);
        data.append("current_medication_data", medicalDetails.currentMedName);
        data.append("past_medication", medicalDetails.pastMed);
        data.append("past_medication_data", medicalDetails.pastMedName);
        data.append("injuries", medicalDetails.Injuries);
        data.append("injuries_data", medicalDetails.injuryName);
        data.append("surgeries", medicalDetails.Surgeries);
        data.append("surgeries_data", medicalDetails.surgeryName);
        data.append("chronic_diseases", medicalDetails.chronicDisease);
        data.append("chronic_diseases_data", medicalDetails.chronicDiseaseName);
        apifuntion
            .postApi(url, data)
            .then((obj) => {
                setMedicalDetails(prevState => ({
                    ...prevState,
                    isLoading: false
                }))
                // console.log("saveMedical-response...", obj);

                if (obj.status == true) {
                    // dispatch(UserDetails(obj?.result))
                    dispatch(UserProfile(obj?.result))
                    msgProvider.showSuccess(obj.message);
                } else {
                    msgProvider.showError(obj.message);
                    return false;
                }
            })
            .catch((error) => {
                msgProvider.showSuccess(error);
                setMedicalDetails(prevState => ({
                    ...prevState,
                    isLoading: false
                }))
                console.log("saveMedical-error ------- " + error);
            });
    };
    return (
        <View
            pointerEvents={medicalDetails.isLoading ? 'none' : 'auto'}
            style={{ flex: 1, backgroundColor: Colors.White }}>
            <KeyboardAwareScrollView
                // keyboardOpeningTime={200}
                extraScrollHeight={50}
                enableOnAndroid={true}
                keyboardShouldPersistTaps='handled'
                contentContainerStyle={{
                    justifyContent: 'center',
                    paddingTop: vs(10),
                    paddingBottom: vs(100),
                }}
                showsVerticalScrollIndicator={false}>


                <View
                    style={{
                        width: "100%",
                        backgroundColor: Colors.backgroundcolor,
                        paddingTop: vs(9),
                        marginBottom: vs(5)

                    }}>
                    {/* -------------Title----------- */}
                    <View style={{ width: '93%', alignSelf: 'center' }}>
                        <Text
                            style={{
                                color: Colors.darkText,
                                fontFamily: Font.Medium,
                                fontSize: Font.large,
                                marginBottom: vs(9),
                                alignSelf: 'flex-start'
                            }} >
                            {LangProvider.allergies[languageIndex]}
                        </Text>
                    </View>

                    {/* -------------Details----------- */}

                    <View style={{
                        width: '100%',
                        backgroundColor: Colors.White
                    }}>

                        <View style={{
                            width: '93%',
                            backgroundColor: Colors.White,
                            alignSelf: 'center',
                            paddingVertical: vs(9)
                        }}>
                            <Text
                                style={{
                                    color: Colors.DarkGrey,
                                    fontFamily: Font.Regular,
                                    fontSize: Font.medium,
                                    alignSelf: 'flex-start'
                                }}>
                                {LangProvider.q1[languageIndex]}
                            </Text>


                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginTop: vs(10) }}>
                                <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    horizontal
                                    data={languageIndex == 0 ? ['Yes', 'No'] : ['نعم', 'لا']}
                                    ItemSeparatorComponent={() => {
                                        return (
                                            <View style={{ width: s(25) }} />
                                        )
                                    }}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <Pressable
                                                onPress={() => {
                                                    setMedicalDetails(prevState => ({ ...prevState, Allergic: index }))
                                                    if (index === 1) setMedicalDetails(prevState => ({ ...prevState, allergyName: '' }))
                                                }}
                                                style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                <View
                                                    style={{
                                                        height: s(16),
                                                        width: s(16),
                                                        borderRadius: s(16),
                                                        borderWidth: index === medicalDetails.Allergic ? 5 : 1,
                                                        borderColor: index === medicalDetails.Allergic ? Colors.Blue : Colors.lightGrey
                                                    }}>

                                                </View>
                                                <Text
                                                    style={{
                                                        fontSize: Font.small,
                                                        fontFamily: Font.Regular,
                                                        color: Colors.darkText,
                                                        marginLeft: s(8)

                                                    }}>{item}</Text>
                                            </Pressable>

                                        );
                                    }}
                                />

                            </View>

                            {medicalDetails.Allergic === 0 && (

                                <AuthInputBoxSec
                                    mainContainer={{ marginTop: vs(8), width: '100%' }}
                                    lableText={LangProvider.textinputallergies[languageIndex]}
                                    onChangeText={(text) => setMedicalDetails(prevState => ({ ...prevState, allergyName: text }))}
                                    maxLength={50}
                                    value={medicalDetails.allergyName}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    returnKeyLabel="done"
                                    returnKeyType="done"
                                    onSubmitEditing={() => {
                                        Keyboard.dismiss()
                                    }}
                                    blurOnSubmit={Platform.OS === 'ios' ? true : false}
                                    editable
                                />
                            )}
                        </View>

                    </View>

                </View>

                {/* ---------------------------------------------------------------------------------------q2 */}

                <View
                    style={{
                        width: "100%",
                        backgroundColor: Colors.backgroundcolor,
                        paddingTop: vs(9),
                        marginBottom: vs(5)

                    }}>
                    {/* -------------Title----------- */}
                    <View style={{ width: '93%', alignSelf: 'center' }}>
                        <Text
                            style={{
                                color: Colors.darkText,
                                fontFamily: Font.Medium,
                                fontSize: Font.large,
                                alignSelf: 'flex-start',
                                marginBottom: vs(9)
                            }} >
                            {LangProvider.current[languageIndex]}
                        </Text>
                    </View>

                    {/* -------------Details----------- */}

                    <View style={{
                        width: '100%',
                        backgroundColor: Colors.White
                    }}>

                        <View style={{
                            width: '93%',
                            backgroundColor: Colors.White,
                            alignSelf: 'center',
                            paddingVertical: vs(9)
                        }}>
                            <Text
                                style={{
                                    color: Colors.DarkGrey,
                                    fontFamily: Font.Regular,
                                    fontSize: Font.medium,
                                    alignSelf: 'flex-start'
                                }}>
                                {LangProvider.q2[languageIndex]}
                            </Text>


                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginTop: vs(10) }}>
                                <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    horizontal
                                    data={languageIndex == 0 ? ['Yes', 'No'] : ['نعم', 'لا']}
                                    ItemSeparatorComponent={() => {
                                        return (
                                            <View style={{ width: s(25) }} />
                                        )
                                    }}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <Pressable
                                                onPress={() => {
                                                    setMedicalDetails(prevState => ({ ...prevState, currentMed: index }))
                                                    if (index === 1) setMedicalDetails(prevState => ({ ...prevState, currentMedName: '' }))
                                                }}
                                                style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                <View
                                                    style={{
                                                        height: s(16),
                                                        width: s(16),
                                                        borderRadius: s(16),
                                                        borderWidth: index === medicalDetails.currentMed ? 5 : 1,
                                                        borderColor: index === medicalDetails.currentMed ? Colors.Blue : Colors.lightGrey
                                                    }}>

                                                </View>
                                                <Text
                                                    style={{
                                                        fontSize: Font.small,
                                                        fontFamily: Font.Regular,
                                                        color: Colors.darkText,
                                                        marginLeft: s(8)

                                                    }}>{item}</Text>
                                            </Pressable>

                                        );
                                    }}
                                />

                            </View>

                            {medicalDetails.currentMed === 0 && (

                                <AuthInputBoxSec
                                    mainContainer={{ marginTop: vs(8), width: '100%' }}
                                    lableText={LangProvider.textinputcurrent[languageIndex]}
                                    onChangeText={(text) => setMedicalDetails(prevState => ({ ...prevState, currentMedName: text }))}
                                    maxLength={50}
                                    value={medicalDetails.currentMedName}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    returnKeyLabel="done"
                                    returnKeyType="done"
                                    onSubmitEditing={() => {
                                        Keyboard.dismiss()
                                    }}
                                    blurOnSubmit={Platform.OS === 'ios' ? true : false}
                                    editable
                                />
                            )}
                        </View>

                    </View>

                </View>

                {/* ---------------------------------------------------------------------------------------q3 */}

                <View
                    style={{
                        width: "100%",
                        backgroundColor: Colors.backgroundcolor,
                        paddingTop: vs(9),
                        marginBottom: vs(5)

                    }}>
                    {/* -------------Title----------- */}
                    <View style={{ width: '93%', alignSelf: 'center' }}>
                        <Text
                            style={{
                                color: Colors.darkText,
                                fontFamily: Font.Medium,
                                fontSize: Font.large,
                                alignSelf: 'flex-start',
                                marginBottom: vs(9)
                            }} >
                            {LangProvider.pastmedication[languageIndex]}
                        </Text>
                    </View>

                    {/* -------------Details----------- */}

                    <View style={{
                        width: '100%',
                        backgroundColor: Colors.White
                    }}>

                        <View style={{
                            width: '93%',
                            backgroundColor: Colors.White,
                            alignSelf: 'center',
                            paddingVertical: vs(9)
                        }}>
                            <Text
                                style={{
                                    color: Colors.DarkGrey,
                                    fontFamily: Font.Regular,
                                    fontSize: Font.medium,
                                    alignSelf: 'flex-start'
                                }}>
                                {LangProvider.q3[languageIndex]}
                            </Text>


                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginTop: vs(10) }}>
                                <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    horizontal
                                    data={languageIndex == 0 ? ['Yes', 'No'] : ['نعم', 'لا']}
                                    ItemSeparatorComponent={() => {
                                        return (
                                            <View style={{ width: s(25) }} />
                                        )
                                    }}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <Pressable
                                                onPress={() => {
                                                    setMedicalDetails(prevState => ({ ...prevState, pastMed: index }))
                                                    if (index === 1) setMedicalDetails(prevState => ({ ...prevState, pastMedName: '' }))
                                                }}
                                                style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                <View
                                                    style={{
                                                        height: s(16),
                                                        width: s(16),
                                                        borderRadius: s(16),
                                                        borderWidth: index === medicalDetails.pastMed ? 5 : 1,
                                                        borderColor: index === medicalDetails.pastMed ? Colors.Blue : Colors.lightGrey
                                                    }}>

                                                </View>
                                                <Text
                                                    style={{
                                                        fontSize: Font.small,
                                                        fontFamily: Font.Regular,
                                                        color: Colors.darkText,
                                                        marginLeft: s(8)

                                                    }}>{item}</Text>
                                            </Pressable>

                                        );
                                    }}
                                />

                            </View>

                            {medicalDetails.pastMed === 0 && (

                                <AuthInputBoxSec
                                    mainContainer={{ marginTop: vs(8), width: '100%' }}
                                    lableText={LangProvider.pastmedication[languageIndex]}
                                    onChangeText={(text) => setMedicalDetails(prevState => ({ ...prevState, pastMedName: text }))}
                                    maxLength={50}
                                    value={medicalDetails.pastMedName}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    returnKeyLabel="done"
                                    returnKeyType="done"
                                    onSubmitEditing={() => {
                                        Keyboard.dismiss()
                                    }}
                                    blurOnSubmit={Platform.OS === 'ios' ? true : false}
                                    editable
                                />
                            )}
                        </View>

                    </View>

                </View>

                {/* ---------------------------------------------------------------------------------------q4 */}

                <View
                    style={{
                        width: "100%",
                        backgroundColor: Colors.backgroundcolor,
                        paddingTop: vs(9),
                        marginBottom: vs(5)

                    }}>
                    {/* -------------Title----------- */}
                    <View style={{ width: '93%', alignSelf: 'center' }}>
                        <Text
                            style={{
                                color: Colors.darkText,
                                fontFamily: Font.Medium,
                                fontSize: Font.large,
                                alignSelf: 'flex-start',
                                marginBottom: vs(9)
                            }} >
                            {LangProvider.injuries[languageIndex]}
                        </Text>
                    </View>

                    {/* -------------Details----------- */}

                    <View style={{
                        width: '100%',
                        backgroundColor: Colors.White
                    }}>

                        <View style={{
                            width: '93%',
                            backgroundColor: Colors.White,
                            alignSelf: 'center',
                            paddingVertical: vs(9)
                        }}>
                            <Text
                                style={{
                                    color: Colors.DarkGrey,
                                    fontFamily: Font.Regular,
                                    fontSize: Font.medium,
                                    alignSelf: 'flex-start'
                                }}>
                                {LangProvider.q4[languageIndex]}
                            </Text>


                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginTop: vs(10) }}>
                                <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    horizontal
                                    data={languageIndex == 0 ? ['Yes', 'No'] : ['نعم', 'لا']}
                                    ItemSeparatorComponent={() => {
                                        return (
                                            <View style={{ width: s(25) }} />
                                        )
                                    }}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <Pressable
                                                onPress={() => {
                                                    setMedicalDetails(prevState => ({ ...prevState, Injuries: index }))
                                                    if (index === 1) setMedicalDetails(prevState => ({ ...prevState, injuryName: '' }))
                                                }}
                                                style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                <View
                                                    style={{
                                                        height: s(16),
                                                        width: s(16),
                                                        borderRadius: s(16),
                                                        borderWidth: index === medicalDetails.Injuries ? 5 : 1,
                                                        borderColor: index === medicalDetails.Injuries ? Colors.Blue : Colors.lightGrey
                                                    }}>

                                                </View>
                                                <Text
                                                    style={{
                                                        fontSize: Font.small,
                                                        fontFamily: Font.Regular,
                                                        color: Colors.darkText,
                                                        marginLeft: s(8)

                                                    }}>{item}</Text>
                                            </Pressable>

                                        );
                                    }}
                                />

                            </View>

                            {medicalDetails.Injuries === 0 && (

                                <AuthInputBoxSec
                                    mainContainer={{ marginTop: vs(8), width: '100%' }}
                                    lableText={LangProvider.injuries[languageIndex]}
                                    onChangeText={(text) => setMedicalDetails(prevState => ({ ...prevState, injuryName: text }))}
                                    maxLength={50}
                                    value={medicalDetails.injuryName}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    returnKeyLabel="done"
                                    returnKeyType="done"
                                    onSubmitEditing={() => {
                                        Keyboard.dismiss()
                                    }}
                                    blurOnSubmit={Platform.OS === 'ios' ? true : false}
                                    editable
                                />
                            )}
                        </View>

                    </View>

                </View>

                {/* ---------------------------------------------------------------------------------------q5 */}

                <View
                    style={{
                        width: "100%",
                        backgroundColor: Colors.backgroundcolor,
                        paddingTop: vs(9),
                        marginBottom: vs(5)

                    }}>
                    {/* -------------Title----------- */}
                    <View style={{ width: '93%', alignSelf: 'center' }}>
                        <Text
                            style={{
                                color: Colors.darkText,
                                fontFamily: Font.Medium,
                                fontSize: Font.large,
                                alignSelf: 'flex-start',
                                marginBottom: vs(9)
                            }} >
                            {LangProvider.surgeries[languageIndex]}
                        </Text>
                    </View>

                    {/* -------------Details----------- */}

                    <View style={{
                        width: '100%',
                        backgroundColor: Colors.White
                    }}>

                        <View style={{
                            width: '93%',
                            backgroundColor: Colors.White,
                            alignSelf: 'center',
                            paddingVertical: vs(9)
                        }}>
                            <Text
                                style={{
                                    color: Colors.DarkGrey,
                                    fontFamily: Font.Regular,
                                    fontSize: Font.medium,
                                    alignSelf: 'flex-start'
                                }}>
                                {LangProvider.q5[languageIndex]}
                            </Text>


                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginTop: vs(10) }}>
                                <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    horizontal
                                    data={languageIndex == 0 ? ['Yes', 'No'] : ['نعم', 'لا']}
                                    ItemSeparatorComponent={() => {
                                        return (
                                            <View style={{ width: s(25) }} />
                                        )
                                    }}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <Pressable
                                                onPress={() => {
                                                    setMedicalDetails(prevState => ({ ...prevState, Surgeries: index }))
                                                    if (index === 1) setMedicalDetails(prevState => ({ ...prevState, surgeryName: '' }))
                                                }} style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                <View
                                                    style={{
                                                        height: s(16),
                                                        width: s(16),
                                                        borderRadius: s(16),
                                                        borderWidth: index === medicalDetails.Surgeries ? 5 : 1,
                                                        borderColor: index === medicalDetails.Surgeries ? Colors.Blue : Colors.lightGrey
                                                    }}>

                                                </View>
                                                <Text
                                                    style={{
                                                        fontSize: Font.small,
                                                        fontFamily: Font.Regular,
                                                        color: Colors.darkText,
                                                        marginLeft: s(8)

                                                    }}>{item}</Text>
                                            </Pressable>

                                        );
                                    }}
                                />

                            </View>

                            {medicalDetails.Surgeries === 0 && (

                                <AuthInputBoxSec
                                    mainContainer={{ marginTop: vs(8), width: '100%' }}
                                    lableText={LangProvider.textinputsurgeries[languageIndex]}
                                    onChangeText={(text) => setMedicalDetails(prevState => ({ ...prevState, surgeryName: text }))}
                                    maxLength={50}
                                    value={medicalDetails.surgeryName}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    returnKeyLabel="done"
                                    returnKeyType="done"
                                    onSubmitEditing={() => {
                                        Keyboard.dismiss()
                                    }}
                                    blurOnSubmit={Platform.OS === 'ios' ? true : false}
                                    editable
                                />
                            )}
                        </View>

                    </View>

                </View>

                {/* ---------------------------------------------------------------------------------------q6 */}

                <View
                    style={{
                        width: "100%",
                        backgroundColor: Colors.backgroundcolor,
                        paddingTop: vs(9),
                        marginBottom: vs(5)

                    }}>
                    {/* -------------Title----------- */}
                    <View style={{ width: '93%', alignSelf: 'center' }}>
                        <Text
                            style={{
                                color: Colors.darkText,
                                fontFamily: Font.Medium,
                                fontSize: Font.large,
                                alignSelf: 'flex-start',
                                marginBottom: vs(9)
                            }} >
                            {LangProvider.chronic[languageIndex]}
                        </Text>
                    </View>

                    {/* -------------Details----------- */}

                    <View style={{
                        width: '100%',
                        backgroundColor: Colors.White
                    }}>

                        <View style={{
                            width: '93%',
                            backgroundColor: Colors.White,
                            alignSelf: 'center',
                            paddingVertical: vs(9)
                        }}>
                            <Text
                                style={{
                                    color: Colors.DarkGrey,
                                    fontFamily: Font.Regular,
                                    fontSize: Font.medium,
                                    alignSelf: 'flex-start'
                                }}>
                                {LangProvider.q6[languageIndex]}
                            </Text>


                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginTop: vs(10) }}>
                                <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    horizontal
                                    data={languageIndex == 0 ? ['Yes', 'No'] : ['نعم', 'لا']}
                                    ItemSeparatorComponent={() => {
                                        return (
                                            <View style={{ width: s(25) }} />
                                        )
                                    }}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <Pressable
                                                onPress={() => {
                                                    setMedicalDetails(prevState => ({ ...prevState, chronicDisease: index }))
                                                    if (index === 1) setMedicalDetails(prevState => ({ ...prevState, chronicDiseaseName: '' }))
                                                }}
                                                style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                <View
                                                    style={{
                                                        height: s(16),
                                                        width: s(16),
                                                        borderRadius: s(16),
                                                        borderWidth: index === medicalDetails.chronicDisease ? 5 : 1,
                                                        borderColor: index === medicalDetails.chronicDisease ? Colors.Blue : Colors.lightGrey
                                                    }}>

                                                </View>
                                                <Text
                                                    style={{
                                                        fontSize: Font.small,
                                                        fontFamily: Font.Regular,
                                                        color: Colors.darkText,
                                                        marginLeft: s(8)

                                                    }}>{item}</Text>
                                            </Pressable>

                                        );
                                    }}
                                />

                            </View>

                            {medicalDetails.chronicDisease === 0 && (

                                <AuthInputBoxSec
                                    mainContainer={{ marginTop: vs(8), width: '100%' }}
                                    lableText={LangProvider.textinputchronic[languageIndex]}
                                    onChangeText={(text) => setMedicalDetails(prevState => ({ ...prevState, chronicDiseaseName: text }))}
                                    maxLength={50}
                                    value={medicalDetails.chronicDiseaseName}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    returnKeyLabel="done"
                                    returnKeyType="done"
                                    onSubmitEditing={() => {
                                        Keyboard.dismiss()
                                    }}
                                    blurOnSubmit={Platform.OS === 'ios' ? true : false}
                                    editable
                                />
                            )}
                        </View>

                    </View>

                </View>





            </KeyboardAwareScrollView>

            <View
                style={{
                    width: "100%",
                    position: 'absolute',
                    bottom: 0,
                    paddingHorizontal: s(13),
                    backgroundColor: Colors.White,
                    paddingTop: (windowWidth * 2) / 100,
                    paddingBottom: Platform.OS == 'ios' ? insets.bottom - 15 : (windowWidth * 2) / 100,
                    alignItems: "center",
                    borderTopWidth: 1,
                    borderTopColor: Colors.Border,
                }}>
                <Button
                    text={LangProvider.submitbtntext[languageIndex]}
                    onPress={() => saveMedical()}
                    onLoading={medicalDetails.isLoading}
                />

            </View>

            <NoInternet
                visible={!deviceConnection}
            />
        </View>
    )
}

export default Medical;


