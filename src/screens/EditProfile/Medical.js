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
} from "react-native";
import React, { Component, useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { vs, s, } from "react-native-size-matters";

import {
    consolepro,
    Colors,
    Font,
    config,
    windowWidth,
    Lang_chg,
    localStorage,
    apifuntion,
    msgProvider,
    msgText,
    msgTitle,
    Button
} from "../../Provider/utilslib/Utils";
import AuthInputBoxSec from "../../components/AuthInputBoxSec";



const Medical = () => {

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
        chronicDiseaseName: ''
    })

    useEffect(() => {
        getMedical()
    }, [])
    const getMedical = async () => {
        let user_details = await localStorage.getItemObject("user_arr");
        console.log("user_details user_details", user_details);
        let user_id = user_details["user_id"];

        let url = config.baseURL + "api-patient-profile";
        var data = new FormData();
        data.append("user_id", user_id);

        apifuntion.postApi(url, data)
            .then((obj) => {
                consolepro.consolelog("getMedical...", obj);
                if (obj.status == true) {

                    let result = obj.result;

                    if (result["allergies_data"] != null && result["allergies_data"] != "") {
                        setMedicalDetails(prevState => ({ ...prevState, allergyName: result["allergies_data"] }))
                    }
                    if (result["allergies"] != null && result["allergies"] != "") {
                        if (result["allergies"] == "0") {
                            setMedicalDetails(prevState => ({ ...prevState, Allergic: 0 }))
                        } else {
                            setMedicalDetails(prevState => ({ ...prevState, Allergic: 1 }))
                        }
                    }

                    if (result["chronic_diseases_data"] != null && result["chronic_diseases_data"] != "") {
                        setMedicalDetails(prevState => ({ ...prevState, chronicDiseaseName: result["chronic_diseases_data"] }))
                    }
                    if (result["chronic_diseases"] != null && result["chronic_diseases"] != "") {
                        if (result["chronic_diseases"] == "0") {
                            setMedicalDetails(prevState => ({ ...prevState, chronicDisease: 0 }))
                        } else {
                            setMedicalDetails(prevState => ({ ...prevState, chronicDisease: 1 }))
                        }
                    }

                    if (result["current_medication_data"] != null && result["current_medication_data"] != "") {
                        setMedicalDetails(prevState => ({ ...prevState, currentMedName: result["current_medication_data"] }))
                    }
                    if (result["current_medication"] != null && result["current_medication"] != "") {
                        if (result["current_medication"] == "0") {
                            setMedicalDetails(prevState => ({ ...prevState, currentMed: 0 }))
                        } else {
                            setMedicalDetails(prevState => ({ ...prevState, currentMed: 1 }))
                        }
                    }

                    if (result["injuries_data"] != null && result["injuries_data"] != "") {
                        setMedicalDetails(prevState => ({ ...prevState, injuryName: result["injuries_data"] }))
                    }
                    if (result["injuries"] != null && result["injuries"] != "") {
                        if (result["injuries"] == "0") {
                            setMedicalDetails(prevState => ({ ...prevState, Injuries: 0 }))
                        } else {
                            setMedicalDetails(prevState => ({ ...prevState, Injuries: 1 }))
                        }
                    }

                    if (result["past_medication_data"] != null && result["past_medication_data"] != "") {
                        setMedicalDetails(prevState => ({ ...prevState, pastMedName: result["past_medication_data"] }))
                    }
                    if (result["past_medication"] != null && result["past_medication"] != "") {
                        if (result["past_medication"] == "0") {
                            setMedicalDetails(prevState => ({ ...prevState, pastMed: 0 }))
                        } else {
                            setMedicalDetails(prevState => ({ ...prevState, pastMed: 1 }))
                        }
                    }

                    if (result["surgeries_data"] != null && result["surgeries_data"] != "") {
                        setMedicalDetails(prevState => ({ ...prevState, surgeryName: result["surgeries_data"] }))
                    }
                    if (result["surgeries"] != null && result["surgeries"] != "") {
                        if (result["surgeries"] == "0") {
                            setMedicalDetails(prevState => ({ ...prevState, Surgeries: 0 }))
                        } else {
                            setMedicalDetails(prevState => ({ ...prevState, Surgeries: 1 }))
                        }
                    }

                } else {
                    msgProvider.alert(
                        msgTitle.information[config.language],
                        obj.message[config.language],
                        false
                    );

                    return false;
                }
            })
            .catch((error) => {
                consolepro.consolelog("getMedical-------- error ------- " + error);
                this.setState({ loading: false });
            });
    };

    const saveMedical = async () => {

        Keyboard.dismiss()
        if (medicalDetails.Allergic === 0 & medicalDetails.allergyName === '') {
            msgProvider.showError(msgText.allergyName[config.language]);
            return false;
        }
        if (medicalDetails.currentMed === 0 & medicalDetails.currentMedName === '') {
            msgProvider.showError(msgText.currentMedicine[config.language]);
            return false;
        }
        if (medicalDetails.pastMed === 0 & medicalDetails.pastMedName === '') {
            msgProvider.showError(msgText.pastMedicine[config.language]);
            return false;
        }
        if (medicalDetails.Injuries === 0 & medicalDetails.injuryName === '') {
            msgProvider.showError(msgText.injuries[config.language]);
            return false;
        }
        if (medicalDetails.Surgeries === 0 & medicalDetails.surgeryName === '') {
            msgProvider.showError(msgText.surgeries[config.language]);
            return false;
        }
        if (medicalDetails.chronicDisease === 0 & medicalDetails.chronicDiseaseName === '') {
            msgProvider.showError(msgText.chronicDisease[config.language]);
            return false;
        }

        let user_details = await localStorage.getItemObject("user_arr");
        let user_id = user_details["user_id"];
        let url = config.baseURL + "api-edit-patient-profile-medical";

        var data = new FormData();
        data.append("user_id", user_id);
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
                consolepro.consolelog("saveMedical-response...", obj);

                if (obj.status == true) {
                    let user_details = obj.result;
                    localStorage.setItemObject("user_arr", user_details);
                    msgProvider.showSuccess(obj.message);
                } else {
                    msgProvider.showError(obj.message);
                    return false;
                }
            })
            .catch((error) => {
                consolepro.consolelog("saveMedical-error ------- " + error);
            });
    };
    return (
        <View style={{ flex: 0.98, backgroundColor: Colors.White }}>


           

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
                                textAlign: config.textRotate,
                                marginBottom: vs(9)
                            }} >
                            {Lang_chg.allergies[config.language]}
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
                                    textAlign: config.textRotate,
                                }}>
                                {Lang_chg.q1[config.language]}
                            </Text>


                            <View style={{ width: '100%', height: vs(20), flexDirection: 'row', alignItems: 'center', marginTop: vs(10) }}>
                                <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    horizontal
                                    data={['Yes', 'No']}
                                    ItemSeparatorComponent={() => {
                                        return (
                                            <View style={{ width: s(25) }} />
                                        )
                                    }}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    onPress={() => {
                                                        setMedicalDetails(prevState => ({ ...prevState, Allergic: index }))
                                                        if (index === 1) setMedicalDetails(prevState => ({ ...prevState, allergyName: '' }))
                                                    }}
                                                    style={{
                                                        height: s(16),
                                                        width: s(16),
                                                        borderRadius: s(16),
                                                        borderWidth: index === medicalDetails.Allergic ? 5 : 1,
                                                        borderColor: index === medicalDetails.Allergic ? Colors.Blue : Colors.lightGrey
                                                    }}>

                                                </TouchableOpacity>
                                                <Text
                                                    style={{
                                                        fontSize: Font.small,
                                                        fontFamily: Font.Regular,
                                                        textAlign: config.textRotate,
                                                        color: Colors.darkText,
                                                        marginLeft: s(8)

                                                    }}>{item}</Text>
                                            </View>

                                        );
                                    }}
                                />

                            </View>

                            {medicalDetails.Allergic === 0 && (

                                <AuthInputBoxSec
                                    mainContainer={{ marginTop: vs(8), width: '100%' }}
                                    lableText={Lang_chg.textinputallergies[config.language]}
                                    onChangeText={(text) => setMedicalDetails(prevState => ({ ...prevState, allergyName: text }))}
                                    maxLength={50}
                                    value={medicalDetails.allergyName}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    returnKeyLabel="done"
                                    returnKeyType="done"
                                    onSubmitEditing={() => {
                                        //this.passwordInput.focus();
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
                                textAlign: config.textRotate,
                                marginBottom: vs(9)
                            }} >
                            {Lang_chg.current[config.language]}
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
                                    textAlign: config.textRotate,
                                }}>
                                {Lang_chg.q2[config.language]}
                            </Text>


                            <View style={{ width: '100%', height: vs(20), flexDirection: 'row', alignItems: 'center', marginTop: vs(10) }}>
                                <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    horizontal
                                    data={['Yes', 'No']}
                                    ItemSeparatorComponent={() => {
                                        return (
                                            <View style={{ width: s(25) }} />
                                        )
                                    }}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    onPress={() => {
                                                        setMedicalDetails(prevState => ({ ...prevState, currentMed: index }))
                                                        if (index === 1) setMedicalDetails(prevState => ({ ...prevState, currentMedName: '' }))
                                                    }}
                                                    style={{
                                                        height: s(16),
                                                        width: s(16),
                                                        borderRadius: s(16),
                                                        borderWidth: index === medicalDetails.currentMed ? 5 : 1,
                                                        borderColor: index === medicalDetails.currentMed ? Colors.Blue : Colors.lightGrey
                                                    }}>

                                                </TouchableOpacity>
                                                <Text
                                                    style={{
                                                        fontSize: Font.small,
                                                        fontFamily: Font.Regular,
                                                        textAlign: config.textRotate,
                                                        color: Colors.darkText,
                                                        marginLeft: s(8)

                                                    }}>{item}</Text>
                                            </View>

                                        );
                                    }}
                                />

                            </View>

                            {medicalDetails.currentMed === 0 && (

                                <AuthInputBoxSec
                                    mainContainer={{ marginTop: vs(8), width: '100%' }}
                                    lableText={Lang_chg.textinputcurrent[config.language]}
                                    onChangeText={(text) => setMedicalDetails(prevState => ({ ...prevState, currentMedName: text }))}
                                    maxLength={50}
                                    value={medicalDetails.currentMedName}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    returnKeyLabel="done"
                                    returnKeyType="done"
                                    onSubmitEditing={() => {
                                        // this.passwordInput.focus();
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
                                textAlign: config.textRotate,
                                marginBottom: vs(9)
                            }} >
                            {Lang_chg.pastmedication[config.language]}
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
                                    textAlign: config.textRotate,
                                }}>
                                {Lang_chg.q3[config.language]}
                            </Text>


                            <View style={{ width: '100%', height: vs(20), flexDirection: 'row', alignItems: 'center', marginTop: vs(10) }}>
                                <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    horizontal
                                    data={['Yes', 'No']}
                                    ItemSeparatorComponent={() => {
                                        return (
                                            <View style={{ width: s(25) }} />
                                        )
                                    }}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    onPress={() => {
                                                        setMedicalDetails(prevState => ({ ...prevState, pastMed: index }))
                                                        if (index === 1) setMedicalDetails(prevState => ({ ...prevState, pastMedName: '' }))
                                                    }}
                                                    style={{
                                                        height: s(16),
                                                        width: s(16),
                                                        borderRadius: s(16),
                                                        borderWidth: index === medicalDetails.pastMed ? 5 : 1,
                                                        borderColor: index === medicalDetails.pastMed ? Colors.Blue : Colors.lightGrey
                                                    }}>

                                                </TouchableOpacity>
                                                <Text
                                                    style={{
                                                        fontSize: Font.small,
                                                        fontFamily: Font.Regular,
                                                        textAlign: config.textRotate,
                                                        color: Colors.darkText,
                                                        marginLeft: s(8)

                                                    }}>{item}</Text>
                                            </View>

                                        );
                                    }}
                                />

                            </View>

                            {medicalDetails.pastMed === 0 && (

                                <AuthInputBoxSec
                                    mainContainer={{ marginTop: vs(8), width: '100%' }}
                                    lableText={Lang_chg.pastmedication[config.language]}
                                    onChangeText={(text) => setMedicalDetails(prevState => ({ ...prevState, pastMedName: text }))}
                                    maxLength={50}
                                    value={medicalDetails.pastMedName}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    returnKeyLabel="done"
                                    returnKeyType="done"
                                    onSubmitEditing={() => {
                                        //this.passwordInput.focus();
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
                                textAlign: config.textRotate,
                                marginBottom: vs(9)
                            }} >
                            {Lang_chg.injuries[config.language]}
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
                                    textAlign: config.textRotate,
                                }}>
                                {Lang_chg.q4[config.language]}
                            </Text>


                            <View style={{ width: '100%', height: vs(20), flexDirection: 'row', alignItems: 'center', marginTop: vs(10) }}>
                                <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    horizontal
                                    data={['Yes', 'No']}
                                    ItemSeparatorComponent={() => {
                                        return (
                                            <View style={{ width: s(25) }} />
                                        )
                                    }}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    onPress={() => {
                                                        setMedicalDetails(prevState => ({ ...prevState, Injuries: index }))
                                                        if (index === 1) setMedicalDetails(prevState => ({ ...prevState, injuryName: '' }))
                                                    }}
                                                    style={{
                                                        height: s(16),
                                                        width: s(16),
                                                        borderRadius: s(16),
                                                        borderWidth: index === medicalDetails.Injuries ? 5 : 1,
                                                        borderColor: index === medicalDetails.Injuries ? Colors.Blue : Colors.lightGrey
                                                    }}>

                                                </TouchableOpacity>
                                                <Text
                                                    style={{
                                                        fontSize: Font.small,
                                                        fontFamily: Font.Regular,
                                                        textAlign: config.textRotate,
                                                        color: Colors.darkText,
                                                        marginLeft: s(8)

                                                    }}>{item}</Text>
                                            </View>

                                        );
                                    }}
                                />

                            </View>

                            {medicalDetails.Injuries === 0 && (

                                <AuthInputBoxSec
                                    mainContainer={{ marginTop: vs(8), width: '100%' }}
                                    lableText={Lang_chg.injuries[config.language]}
                                    onChangeText={(text) => setMedicalDetails(prevState => ({ ...prevState, injuryName: text }))}
                                    maxLength={50}
                                    value={medicalDetails.injuryName}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    returnKeyLabel="done"
                                    returnKeyType="done"
                                    onSubmitEditing={() => {
                                        //this.passwordInput.focus();
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
                                textAlign: config.textRotate,
                                marginBottom: vs(9)
                            }} >
                            {Lang_chg.surgeries[config.language]}
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
                                    textAlign: config.textRotate,
                                }}>
                                {Lang_chg.q5[config.language]}
                            </Text>


                            <View style={{ width: '100%', height: vs(20), flexDirection: 'row', alignItems: 'center', marginTop: vs(10) }}>
                                <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    horizontal
                                    data={['Yes', 'No']}
                                    ItemSeparatorComponent={() => {
                                        return (
                                            <View style={{ width: s(25) }} />
                                        )
                                    }}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    onPress={() => {
                                                        setMedicalDetails(prevState => ({ ...prevState, Surgeries: index }))
                                                        if (index === 1) setMedicalDetails(prevState => ({ ...prevState, surgeryName: '' }))
                                                    }}
                                                    style={{
                                                        height: s(16),
                                                        width: s(16),
                                                        borderRadius: s(16),
                                                        borderWidth: index === medicalDetails.Surgeries ? 5 : 1,
                                                        borderColor: index === medicalDetails.Surgeries ? Colors.Blue : Colors.lightGrey
                                                    }}>

                                                </TouchableOpacity>
                                                <Text
                                                    style={{
                                                        fontSize: Font.small,
                                                        fontFamily: Font.Regular,
                                                        textAlign: config.textRotate,
                                                        color: Colors.darkText,
                                                        marginLeft: s(8)

                                                    }}>{item}</Text>
                                            </View>

                                        );
                                    }}
                                />

                            </View>

                            {medicalDetails.Surgeries === 0 && (

                                <AuthInputBoxSec
                                    mainContainer={{ marginTop: vs(8), width: '100%' }}
                                    lableText={Lang_chg.textinputsurgeries[config.language]}
                                    onChangeText={(text) => setMedicalDetails(prevState => ({ ...prevState, surgeryName: text }))}
                                    maxLength={50}
                                    value={medicalDetails.surgeryName}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    returnKeyLabel="done"
                                    returnKeyType="done"
                                    onSubmitEditing={() => {
                                        //this.passwordInput.focus();
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
                                textAlign: config.textRotate,
                                marginBottom: vs(9)
                            }} >
                            {Lang_chg.chronic[config.language]}
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
                                    textAlign: config.textRotate,
                                }}>
                                {Lang_chg.q6[config.language]}
                            </Text>


                            <View style={{ width: '100%', height: vs(20), flexDirection: 'row', alignItems: 'center', marginTop: vs(10) }}>
                                <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    horizontal
                                    data={['Yes', 'No']}
                                    ItemSeparatorComponent={() => {
                                        return (
                                            <View style={{ width: s(25) }} />
                                        )
                                    }}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    onPress={() => {
                                                        setMedicalDetails(prevState => ({ ...prevState, chronicDisease: index }))
                                                        if (index === 1) setMedicalDetails(prevState => ({ ...prevState, chronicDiseaseName: '' }))
                                                    }}
                                                    style={{
                                                        height: s(16),
                                                        width: s(16),
                                                        borderRadius: s(16),
                                                        borderWidth: index === medicalDetails.chronicDisease ? 5 : 1,
                                                        borderColor: index === medicalDetails.chronicDisease ? Colors.Blue : Colors.lightGrey
                                                    }}>

                                                </TouchableOpacity>
                                                <Text
                                                    style={{
                                                        fontSize: Font.small,
                                                        fontFamily: Font.Regular,
                                                        textAlign: config.textRotate,
                                                        color: Colors.darkText,
                                                        marginLeft: s(8)

                                                    }}>{item}</Text>
                                            </View>

                                        );
                                    }}
                                />

                            </View>

                            {medicalDetails.chronicDisease === 0 && (

                                <AuthInputBoxSec
                                    mainContainer={{ marginTop: vs(8), width: '100%' }}
                                    lableText={Lang_chg.textinputchronic[config.language]}
                                    onChangeText={(text) => setMedicalDetails(prevState => ({ ...prevState, chronicDiseaseName: text }))}
                                    maxLength={50}
                                    value={medicalDetails.chronicDiseaseName}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    returnKeyLabel="done"
                                    returnKeyType="done"
                                    onSubmitEditing={() => {
                                        //this.passwordInput.focus();
                                    }}
                                    blurOnSubmit={Platform.OS === 'ios' ? true : false}
                                    editable
                                />
                            )}
                        </View>

                    </View>

                </View>


                <View style={{ width: '93%', alignSelf: 'center' }}>
                    <Button
                        text={Lang_chg.submitbtntext[config.language]}
                        onPress={() => saveMedical()}
                        btnStyle={{ marginTop: vs(15) }}
                    />
                </View>

            </KeyboardAwareScrollView>
        </View>
    )
}

export default Medical;


