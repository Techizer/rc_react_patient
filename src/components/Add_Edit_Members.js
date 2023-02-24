import React, { useEffect, useRef, useState } from "react";
import { Modal, Text, TouchableOpacity, View, Image, StyleSheet, TouchableHighlight, Keyboard, FlatList, Alert, Platform, } from "react-native";
import { BlurView } from "@react-native-community/blur";
import { useSelector } from "react-redux";
import { SvgXml } from "react-native-svg";
import { s, vs } from "react-native-size-matters";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SkypeIndicator } from 'react-native-indicators';

import { Colors, Font } from "../Provider/Colorsfont";
import {
    windowWidth, LangProvider, config, Button,
    Cameragallery, apifuntion, msgProvider, mediaprovider, windowHeight,
} from "../Provider/Utils/Utils";
import { Cross, dummyUser, Edit } from "../Icons/Index";
import AuthInputBoxSec from "./AuthInputBoxSec";
import OutlinedButton from "./OutlinedButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";


const AddandEditMembers = ({
    visible,
    onRequestClose,
    type,
    changeType,
    isEditable,
    selectedPatient,
    deletedMember = () => { },
    editMemberDetails = () => { }
}) => {

    const { loggedInUserDetails, appLanguage, languageIndex } = useSelector(state => state.StorageReducer)
    const [name, setName] = useState('')
    const [dob, setDOB] = useState('')
    const [gender, setGender] = useState('')
    const [profileImg, setProfileImg] = useState(null)
    const nameRef = useRef()
    const dobRef = useRef()
    const [mediamodal, setMediamodal] = useState(false)
    const [isLoading, setIsLoading] = useState({
        load: false,
        type: ''
    })
    const insets = useSafeAreaInsets()
    useEffect(() => {
        // console.log('selectedPatient............', selectedPatient);
        // console.log('type............', type);
        // console.log('isEditable............', isEditable);
        // console.log('selectedPatient............', selectedPatient);
        if (selectedPatient != '' && selectedPatient != null && selectedPatient != undefined) {
            setName(selectedPatient.name != '' ? selectedPatient?.name : '')
            setDOB(selectedPatient.age != '' ? selectedPatient?.age : '')
            setGender(selectedPatient?.gender != '' ? parseInt(selectedPatient?.gender) : '')
            setProfileImg(selectedPatient?.image != '' ? (config.img_url3 + selectedPatient?.image) : null)
        }
    }, [type])



    const resetState = () => {
        setName('')
        setDOB('')
        setGender(-1)
        setProfileImg(null)
    }

    const Camerapopen = async () => {
        mediaprovider
            .launchCamera(true)
            .then((obj) => {
                console.log(obj);
                setProfileImg(obj.path)
                setMediamodal(false)
            })
            .catch((error) => {
                setMediamodal(false)
            });
    };
    const Galleryopen = () => {
        mediaprovider
            .launchGellery(true)
            .then((obj) => {
                // console.log('Galleryopen..............', obj);
                setProfileImg(obj.path)
                setMediamodal(false)
            })
            .catch((error) => {
                setMediamodal(false)
            });
    };


    const confirmDelete = (title, message, callbackOk, callbackCancel) => {
        Alert.alert(
            LangProvider.Delete_Member[languageIndex],
            LangProvider.Sure_Delete[languageIndex],
            [
                {
                    text: LangProvider.no_txt[languageIndex],
                },
                {
                    text: LangProvider.yes_txt[languageIndex],
                    onPress: () => deleteMember(),
                },
            ],
            { cancelable: false }
        );
    }

    const deleteMember = () => {

        let url = config.baseURL + "api-delete-patient-family-member";

        var data = new FormData();
        data.append("id", selectedPatient?.id);

        setIsLoading(prevState => ({
            ...prevState,
            load: true,
            type: 'delete'
        }))
        apifuntion
            .postApi(url, data)
            .then((obj) => {
                console.log("deleteMember-response", obj);
                setIsLoading(prevState => ({
                    ...prevState,
                    load: false,
                    type: 'delete'
                }))
                if (obj.status == true) {
                    msgProvider.showSuccess('Member deleted successfully')
                    setTimeout(() => {
                        onRequestClose()
                        resetState()
                        changeType('addMember')
                    }, 350);
                    deletedMember(selectedPatient?.id)
                } else {
                    msgProvider.alert("", obj.message, false);
                }
                return false;
            })
            .catch((error) => {
                console.log("deleteMember-error ------- " + error);
                setIsLoading(prevState => ({
                    ...prevState,
                    load: false,
                    type: 'delete'
                }))
                onRequestClose()
                resetState()
                changeType('addMember')
            });
    }
    const addMember = async () => {
        Keyboard.dismiss();

        if (
            name.length <= 0 ||
            name.trim().length <= 0
        ) {
            msgProvider.showError(LangProvider.emptyPaitentName[languageIndex]);
            return false;
        }

        if (dob.length <= 0 || dob.trim().length <= 0) {
            msgProvider.showError(LangProvider.emptyAge[languageIndex]);
            return false;
        }
        if (gender == -1) {
            msgProvider.showError("Please select gender");
            return false;
        }

        let url = config.baseURL + "api-insert-patient-family";

        var data = new FormData();

        data.append("patient_id", loggedInUserDetails.user_id);
        data.append("first_name", name);
        data.append("last_name", "");
        data.append("gender", gender);
        data.append("age", dob);
        data.append("created_by", loggedInUserDetails.user_id);
        data.append("updated_by", loggedInUserDetails.user_id);
        if (profileImg != '' && profileImg != null) {
            data.append('image', {
                uri: profileImg,
                type: "image/jpg",
                name: profileImg,
            })
        }

        setIsLoading(prevState => ({
            ...prevState,
            load: true,
            type: 'add'
        }))
        apifuntion
            .postApi(url, data)
            .then((obj) => {
                console.log("obj", obj);
                setIsLoading(prevState => ({
                    ...prevState,
                    load: false,
                    type: 'add'
                }))
                if (obj.status == true) {
                    onRequestClose(obj.result)
                    resetState()
                    changeType('addMember')
                } else {
                    msgProvider.alert("", obj.message, false);
                }
                return false;
            })
            .catch((error) => {
                console.log("addMember-error ------- " + error);
                setIsLoading(prevState => ({
                    ...prevState,
                    load: false,
                    type: 'add'
                }))
            });
    };

    const editMember = () => {

        let finalName = name.split(' ')
        let firstName = name[0]
        let lastName = name[1]

        let url = config.baseURL + "api-edit-patient-family";

        var data = new FormData();
        data.append("id", selectedPatient?.id);
        data.append("first_name", name);
        data.append("last_name", '');
        data.append("gender", gender);
        data.append("age", dob);
        if (profileImg != '' && profileImg != null) {
            data.append('image', {
                uri: profileImg,
                type: "image/jpg",
                name: profileImg,
            })
        }
        setIsLoading(prevState => ({
            ...prevState,
            load: true,
            type: 'edit'
        }))
        apifuntion
            .postApi(url, data)
            .then((obj) => {
                console.log("editMember-response", obj);
                setIsLoading(prevState => ({
                    ...prevState,
                    load: false,
                    type: 'edit'
                }))
                if (obj.status == true) {
                    msgProvider.showSuccess('Details updated successfully')
                    setTimeout(() => {
                        onRequestClose()
                        resetState()
                        changeType('addMember')
                    }, 350);
                    editMemberDetails(obj?.result?.memebr_details)
                } else {
                    msgProvider.showError(obj?.message)
                }
                return false;
            })
            .catch((error) => {
                console.log("editMember-error ------- " + error);
                msgProvider.showError(error?.message)
                setIsLoading(prevState => ({
                    ...prevState,
                    load: false,
                    type: 'edit'
                }))
                onRequestClose()
                resetState()
                changeType('addMember')
            });
    }

    return (

        <View style={{ flex: 1 }} pointerEvents={(isLoading || isDelete) ? 'none' : 'auto'}>
            <Modal
                animationType='slide'
                visible={visible}
                transparent
                presentationStyle='overFullScreen'
            >
                {/* <BlurView
                    style={{
                        flex: 1,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        // zIndex: 999
                    }}
                    blurType='ultraThinMaterialDark'
                    blurAmount={15}
                    reducedTransparencyFallbackColor="white"
                /> */}

                <View style={[styles.mainContainer]}>

                    <View style={[styles.subContainer, { height: (type === 'addMember' || isEditable) ? windowHeight / 1.35 : windowHeight / 2.1 }]}>

                        <TouchableOpacity
                            onPress={() => {
                                onRequestClose()
                                resetState()
                                changeType('addMember')
                            }}
                            style={styles.closeContainer}
                        >
                            <SvgXml xml={Cross} height={vs(12)} width={s(12)} />
                        </TouchableOpacity>

                        <View style={[styles.modalContainer, { height: (type === 'addMember' || isEditable) ? windowHeight / 1.5 : windowHeight / 2.5 }]}>

                            <KeyboardAwareScrollView
                                // keyboardOpeningTime={200}
                                extraScrollHeight={50}
                                enableOnAndroid={true}
                                keyboardShouldPersistTaps='handled'
                                contentContainerStyle={{
                                    justifyContent: 'center',
                                    paddingBottom: vs(15),
                                    paddingHorizontal: s(13),
                                }}
                                showsVerticalScrollIndicator={false}>

                                <Text
                                    style={{
                                        fontSize: Font.large,
                                        fontFamily: Font.SemiBold,
                                        alignSelf: 'flex-start',
                                        color: Colors.darkText

                                    }}>{type === 'addMember' ? LangProvider.Add_New_Member[languageIndex] : type === 'editMember' ? LangProvider.Edit_Member[languageIndex] : ''}</Text>


                                <View style={{ marginTop: vs(25) }}>

                                    {
                                        (type === 'addMember') ?
                                            <>
                                                <TouchableHighlight
                                                    underlayColor={Colors.Highlight}
                                                    onPress={() => { setMediamodal(true) }}>
                                                    <View style={{ flexDirection: 'row', }}>
                                                        <View style={{ width: '21%', flexDirection: 'row', }}>
                                                            {
                                                                (profileImg != '' && profileImg != null) ?
                                                                    <Image source={{ uri: profileImg }} style={{
                                                                        height: vs(55),
                                                                        width: vs(55),
                                                                        borderRadius: vs(55),
                                                                    }} />
                                                                    :
                                                                    <SvgXml xml={dummyUser} height={vs(55)} width={s(55)} />
                                                            }
                                                            <View style={{ height: s(23), width: s(23), borderRadius: s(40), backgroundColor: Colors.White, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 1, right: s(10), borderWidth: 1.2, borderColor: Colors.Border }}>
                                                                <SvgXml xml={Edit} />
                                                            </View>
                                                        </View>

                                                        <View style={{ width: '79%', justifyContent: 'center', paddingHorizontal: s(10) }}>
                                                            <Text
                                                                style={{
                                                                    fontSize: Font.small,
                                                                    fontFamily: Font.Regular,
                                                                    alignSelf: 'flex-start',
                                                                    color: Colors.darkText

                                                                }}>{LangProvider.Upload_Photo[languageIndex]}</Text>
                                                            <Text
                                                                style={{
                                                                    fontSize: Font.xsmall,
                                                                    fontFamily: Font.Regular,
                                                                    alignSelf: 'flex-start',
                                                                    color: Colors.lightGrey,
                                                                    marginTop: vs(2)

                                                                }}>{LangProvider.Photo_Size[languageIndex]}</Text>
                                                        </View>
                                                    </View>
                                                </TouchableHighlight>
                                                <View style={{ marginTop: vs(10) }}>
                                                    <AuthInputBoxSec
                                                        mainContainer={{ width: '100%', }}
                                                        inputFieldStyle={{ height: vs(35) }}
                                                        lableText={LangProvider.textinputname[languageIndex]}
                                                        inputRef={nameRef}
                                                        onChangeText={(val) => setName(val)}
                                                        value={name}
                                                        keyboardType="default"
                                                        autoCapitalize="none"
                                                        returnKeyType="next"
                                                        onSubmitEditing={() => {
                                                            dobRef.current.focus();
                                                        }}
                                                        blurOnSubmit={Platform.OS === 'ios' ? true : false}
                                                        editable
                                                    />

                                                    <AuthInputBoxSec
                                                        mainContainer={{ marginTop: vs(5), width: '100%' }}
                                                        inputFieldStyle={{ height: vs(35) }}
                                                        lableText={LangProvider.PatientAge[languageIndex]}
                                                        inputRef={dobRef}
                                                        onChangeText={(val) => setDOB(val)}
                                                        value={dob}
                                                        keyboardType={"decimal-pad"}
                                                        autoCapitalize="none"
                                                        returnKeyType="done"
                                                        onSubmitEditing={() => {
                                                            Keyboard.dismiss()
                                                        }}
                                                        blurOnSubmit={Platform.OS === 'ios' ? true : false}
                                                        editable
                                                    />

                                                    {/* ------------------Gender------------------ */}
                                                    <View style={{ width: '100%', height: vs(20), flexDirection: 'row', alignItems: 'center', marginTop: vs(20), paddingHorizontal: s(15) }}>

                                                        <Text
                                                            style={{
                                                                fontSize: Font.small,
                                                                fontFamily: Font.Regular,
                                                                color: Colors.lightGrey,
                                                                paddingRight: s(20)

                                                            }}>{LangProvider.Gender[languageIndex]}</Text>

                                                        <FlatList
                                                            showsHorizontalScrollIndicator={false}
                                                            horizontal
                                                            data={['Male', 'Female']}
                                                            ItemSeparatorComponent={() => {
                                                                return (
                                                                    <View style={{ width: s(25) }} />
                                                                )
                                                            }}
                                                            renderItem={({ item, index }) => {
                                                                return (
                                                                    <TouchableOpacity
                                                                        activeOpacity={0.8}
                                                                        onPress={() => {
                                                                            setGender(index)
                                                                        }}
                                                                        style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                                        <TouchableOpacity
                                                                            activeOpacity={0.8}
                                                                            onPress={() => {
                                                                                setGender(index)
                                                                            }}
                                                                            style={{
                                                                                height: s(16),
                                                                                width: s(16),
                                                                                borderRadius: s(16),
                                                                                borderWidth: index === gender ? 5 : 1,
                                                                                borderColor: index === gender ? Colors.Blue : Colors.lightGrey
                                                                            }}>

                                                                        </TouchableOpacity>
                                                                        <Text
                                                                            style={{
                                                                                fontSize: Font.small,
                                                                                fontFamily: Font.Regular,
                                                                                color: Colors.darkText,
                                                                                marginLeft: s(8)

                                                                            }}>{item}</Text>
                                                                    </TouchableOpacity>

                                                                );
                                                            }}
                                                        />

                                                    </View>

                                                </View>
                                            </>
                                            :
                                            (type === 'editMember') ?
                                                <>
                                                    <View style={{ flexDirection: 'row', width: '100%' }}>
                                                        <View style={{ width: '23%', flexDirection: 'row', height: vs(58) }}>
                                                            <View style={{ width: '90%', flexDirection: 'row', height: '100%' }}>
                                                                {
                                                                    (profileImg != '' && profileImg != null) ?
                                                                        <Image source={{ uri: profileImg }} style={{
                                                                            height: vs(55),
                                                                            width: vs(55),
                                                                            borderRadius: vs(55),
                                                                        }} />
                                                                        :
                                                                        <SvgXml xml={dummyUser} height={vs(55)} width={s(55)} />
                                                                }

                                                                {
                                                                    isEditable &&
                                                                    <TouchableOpacity
                                                                        activeOpacity={0.8}
                                                                        onPress={() => setMediamodal(true)}
                                                                        style={{ height: s(23), width: s(23), borderRadius: s(40), backgroundColor: Colors.White, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 1, right: s(10), borderWidth: 1.2, borderColor: Colors.Border }}>
                                                                        <SvgXml xml={Edit} />
                                                                    </TouchableOpacity>}

                                                            </View>
                                                        </View>

                                                        <View style={{ width: '80%', borderBottomWidth: type ? 0 : 1, borderBottomColor: Colors.Border, paddingBottom: vs(20) }}>

                                                            <View style={{ width: '80%' }}>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                                                                    <Text numberOfLines={1} style={{ maxWidth: '50%', alignSelf: 'flex-start', fontSize: Font.small, fontFamily: Font.Medium, color: Colors.darkText, }}>{selectedPatient?.name}</Text>
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                        <Text style={{ fontSize: 3.5, color: Colors.lightGrey, marginLeft: (windowWidth * 2) / 100 }}>{'\u2B24'}</Text>
                                                                        <Text style={{ alignSelf: 'flex-start', fontSize: Font.small, fontFamily: Font.Medium, color: Colors.lightGrey, marginLeft: (windowWidth * 2) / 100 }}>
                                                                            {(selectedPatient?.gender === '0' ? `${LangProvider.male[languageIndex]}, ` : `${LangProvider.female[languageIndex]}`)}
                                                                            {`${selectedPatient?.age} `}
                                                                            {`${LangProvider.Year[languageIndex]}`}
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                            </View>

                                                            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: vs(10) }}>
                                                                <View style={{ width: '94%', flexDirection: 'row' }}>
                                                                    <View style={{ flex: 1, borderEndWidth: 1, borderEndColor: Colors.Border }}>
                                                                        <Text style={{ alignSelf: 'flex-start', fontSize: Font.xsmall, fontFamily: Font.Regular, color: Colors.lightGrey, height: (windowWidth * 7) / 100 }}>{'Appointent Bookings'}</Text>
                                                                        <Text style={{ alignSelf: 'flex-start', fontSize: Font.medium, fontFamily: Font.Medium, marginTop: vs(4), color: Colors.detailTitles }}>{selectedPatient?.appointment_count}</Text>
                                                                    </View>

                                                                    <View style={{ flex: 1, borderEndWidth: 1, borderEndColor: Colors.Border, justifyContent: 'center', alignItems: 'center' }}>
                                                                        <View style={{ width: '80%' }}>
                                                                            <Text style={{ alignSelf: 'flex-start', fontSize: Font.xsmall, fontFamily: Font.Regular, color: Colors.lightGrey, height: (windowWidth * 7) / 100 }}>{'Doctor Consul.'}</Text>
                                                                            <Text style={{ alignSelf: 'flex-start', fontSize: Font.medium, fontFamily: Font.Medium, marginTop: vs(4), color: Colors.detailTitles }}>{selectedPatient?.dc_count}</Text>
                                                                        </View>
                                                                    </View>

                                                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                                        <View style={{ width: '80%' }}>
                                                                            <Text style={{ alignSelf: 'flex-start', fontSize: Font.xsmall, fontFamily: Font.Regular, color: Colors.lightGrey, height: (windowWidth * 7) / 100 }}>{'Lab Tests'}</Text>
                                                                            <Text style={{ alignSelf: 'flex-start', fontSize: Font.medium, fontFamily: Font.Medium, marginTop: vs(4), color: Colors.detailTitles }}>{selectedPatient?.lab_count}</Text>
                                                                        </View>
                                                                    </View>

                                                                </View>
                                                            </View>

                                                        </View>
                                                    </View>

                                                    {/* --------------------------------------- */}

                                                    {
                                                        (isEditable && type === 'editMember') &&

                                                        <View style={{ marginTop: vs(10) }}>
                                                            <AuthInputBoxSec
                                                                mainContainer={{ width: '100%', }}
                                                                inputFieldStyle={{ height: vs(35) }}
                                                                lableText={LangProvider.textinputname[languageIndex]}
                                                                inputRef={nameRef}
                                                                onChangeText={(val) => setName(val)}
                                                                value={name}
                                                                keyboardType="default"
                                                                autoCapitalize="none"
                                                                returnKeyType="next"
                                                                onSubmitEditing={() => {
                                                                    dobRef.current.focus();
                                                                }}
                                                                blurOnSubmit={Platform.OS === 'ios' ? true : false}
                                                                editable
                                                            />

                                                            <AuthInputBoxSec
                                                                mainContainer={{ marginTop: vs(5), width: '100%' }}
                                                                inputFieldStyle={{ height: vs(35) }}
                                                                lableText={LangProvider.PatientAge[languageIndex]}
                                                                inputRef={dobRef}
                                                                onChangeText={(val) => setDOB(val)}
                                                                value={dob}
                                                                keyboardType={"decimal-pad"}
                                                                autoCapitalize="none"
                                                                returnKeyType="done"
                                                                onSubmitEditing={() => {
                                                                    Keyboard.dismiss()
                                                                }}
                                                                blurOnSubmit={Platform.OS === 'ios' ? true : false}
                                                                editable
                                                            />

                                                            {/* ------------------Gender------------------ */}
                                                            <View style={{ width: '100%', height: vs(20), flexDirection: 'row', alignItems: 'center', marginTop: vs(20), paddingHorizontal: s(15) }}>

                                                                <Text
                                                                    style={{
                                                                        fontSize: Font.small,
                                                                        fontFamily: Font.Regular,
                                                                        color: Colors.lightGrey,
                                                                        paddingRight: s(20)

                                                                    }}>{LangProvider.Gender[languageIndex]}</Text>

                                                                <FlatList
                                                                    showsHorizontalScrollIndicator={false}
                                                                    horizontal
                                                                    data={['Male', 'Female']}
                                                                    ItemSeparatorComponent={() => {
                                                                        return (
                                                                            <View style={{ width: s(25) }} />
                                                                        )
                                                                    }}
                                                                    renderItem={({ item, index }) => {
                                                                        return (
                                                                            <TouchableOpacity
                                                                                activeOpacity={0.8}
                                                                                onPress={() => {
                                                                                    setGender(index)
                                                                                }}
                                                                                style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                                                <TouchableOpacity
                                                                                    activeOpacity={0.8}
                                                                                    onPress={() => {
                                                                                        setGender(index)
                                                                                    }}
                                                                                    style={{
                                                                                        height: s(16),
                                                                                        width: s(16),
                                                                                        borderRadius: s(16),
                                                                                        borderWidth: index === gender ? 5 : 1,
                                                                                        borderColor: index === gender ? Colors.Blue : Colors.lightGrey
                                                                                    }}>

                                                                                </TouchableOpacity>
                                                                                <Text
                                                                                    style={{
                                                                                        fontSize: Font.small,
                                                                                        fontFamily: Font.Regular,
                                                                                        color: Colors.darkText,
                                                                                        marginLeft: s(8)

                                                                                    }}>{item}</Text>
                                                                            </TouchableOpacity>

                                                                        );
                                                                    }}
                                                                />

                                                            </View>

                                                        </View>
                                                    }
                                                </>
                                                :
                                                null
                                    }





                                </View>


                            </KeyboardAwareScrollView>

                            <View style={{
                                width: "100%",
                                position: 'absolute',
                                bottom: Platform.OS == 'ios' ? insets.bottom - 15 : 0,
                                paddingHorizontal: s(13),
                                backgroundColor: Colors.White,
                                paddingVertical: (windowWidth * 2) / 100,
                                alignItems: "center",
                                borderTopWidth: 1,
                                borderTopColor: Colors.Border,
                            }}>

                                {
                                    (!isEditable && type === 'editMember') &&
                                    <OutlinedButton
                                        text={LangProvider.Edit[languageIndex]}
                                        onPress={() => { changeType('editMember') }}
                                        // btnStyle={{ marginBottom: vs(10) }}
                                    />
                                }
                                {
                                    ((isEditable && type === 'editMember') || (type === 'addMember')) &&
                                    <Button
                                        text={type === 'addMember' ? LangProvider.Add_Member[languageIndex] : LangProvider.Save[languageIndex]}
                                        onPress={() => {
                                            if (type === 'editMember') {
                                                editMember()
                                            } else {
                                                addMember()
                                            }
                                        }}

                                        onLoading={(isLoading?.load && (isLoading?.type === 'add' || isLoading?.type === 'edit'))}
                                    />
                                }


                                {
                                    (type === 'editMember') &&

                                    <TouchableOpacity
                                        style={{
                                            height: (windowWidth * 6) / 100,
                                            alignSelf: 'center',
                                            marginTop: (windowWidth * 2) / 100,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            confirmDelete()
                                        }}>
                                        {
                                            (isLoading?.load && isLoading?.type === 'delete') ?
                                                <SkypeIndicator color={Colors.Theme} size={20} />
                                                :
                                                <Text style={{
                                                    fontSize: Font.small,
                                                    fontFamily: Font.Medium,
                                                    color: Colors.Theme,

                                                }}>{LangProvider.Delete[languageIndex]}</Text>
                                        }

                                    </TouchableOpacity>
                                }
                            </View>

                            <Cameragallery
                                mediamodal={mediamodal}
                                onRequestClose={() => {
                                    setMediamodal(false)
                                }}
                                Camerapopen={() => {
                                    Camerapopen()
                                }}
                                Galleryopen={() => {
                                    Galleryopen()
                                }}
                                Canclemedia={() => {
                                    setMediamodal(false)
                                }}
                            />
                        </View>

                    </View>

                </View>
            </Modal>
        </View>




    )
}
const styles = StyleSheet.create({

    mainContainer: {
        width: windowWidth,
        height: windowHeight,
        position: 'absolute',
        bottom: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    subContainer: {
        width: windowWidth,
        height: windowHeight / 1.35,
        position: 'absolute',
        bottom: 0,
        zIndex: 9999,
    },
    modalContainer: {
        width: windowWidth,
        backgroundColor: Colors.White,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: vs(20),
        position: 'absolute',
        bottom: 0,
        zIndex: 9999

    },
    closeContainer: {
        height: s(35),
        width: s(35),
        borderRadius: s(50),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: Colors.LightBlack,
        zIndex: 999
    },
});

export default AddandEditMembers;


