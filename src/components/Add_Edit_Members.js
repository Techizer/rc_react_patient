import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableHighlight, Keyboard, FlatList, Alert, Platform, } from "react-native";
import Modal from "react-native-modal";

import { Colors, Font } from "../Provider/Colorsfont";
import {
    windowWidth, deviceHeight, Lang_chg, config,
    localStorage, Button, consolepro, msgText,
    Cameragallery, apifuntion, msgProvider, mediaprovider, windowHeight,
} from "../Provider/utilslib/Utils";
import { Cross, dummyUser, Edit } from "../Icons/Index";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import AuthInputBoxSec from "./AuthInputBoxSec";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import OutlinedButton from "./OutlinedButton";




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

    useEffect(() => {
        // console.log('selectedPatient............', selectedPatient);
        // console.log('type............', type);
        // console.log('isEditable............', isEditable);
        console.log('selectedPatient............', selectedPatient);
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
            Lang_chg.Delete_Member[config.language],
            Lang_chg.Sure_Delete[config.language],
            [
                {
                    text: Lang_chg.no_txt[config.language],
                },
                {
                    text: Lang_chg.yes_txt[config.language],
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
                consolepro.consolelog("deleteMember-response", obj);
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
                consolepro.consolelog("deleteMember-error ------- " + error);
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
        let user_details = await localStorage.getItemObject("user_arr");
        let user_id = user_details["user_id"];
        console.log("dfhvgrtdb ", user_details);
        Keyboard.dismiss();

        if (
            name.length <= 0 ||
            name.trim().length <= 0
        ) {
            msgProvider.showError(msgText.emptyPaitentName[config.language]);
            return false;
        }

        if (dob.length <= 0 || dob.trim().length <= 0) {
            msgProvider.showError(msgText.emptyAge[config.language]);
            return false;
        }
        if (gender == -1) {
            msgProvider.showError("Please select gender");
            return false;
        }

        let url = config.baseURL + "api-insert-patient-family";

        var data = new FormData();

        data.append("patient_id", user_id);
        data.append("first_name", name);
        data.append("last_name", "");
        data.append("gender", gender);
        data.append("age", dob);
        data.append("created_by", user_id);
        data.append("updated_by", user_id);
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
                consolepro.consolelog("obj", obj);
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
                consolepro.consolelog("-------- error ------- " + error);
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
                consolepro.consolelog("editMember-response", obj);
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
                consolepro.consolelog("editMember-error ------- " + error);
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
        <Modal
            isVisible={visible}
            statusBarTranslucent={true}
            animationIn='fadeInUpBig'
            animationOut='fadeOutDownBig'
            deviceWidth={windowWidth}
            animationInTiming={350}
            animationOutTimixng={350}
            // onBackButtonPress={onRequestClose}
            hasBackdrop={true}
            useNativeDriver={true}
            useNativeDriverForBackdrop={true}
            // backdropColor='rgba(0,0,0,0.8)'
            style={{ margin: 0 }} >


            <View pointerEvents={isLoading?.load ? 'none' : 'auto'} style={styles.modalContainer}>
                <TouchableHighlight
                    onPress={() => {
                        onRequestClose()
                        resetState()
                        changeType('addMember')
                    }}
                    underlayColor={Colors.Highlight}
                    style={styles.closeContainer}
                >
                    <SvgXml xml={Cross} height={vs(19)} width={s(18)} />
                </TouchableHighlight>

                <Text
                    style={{
                        fontSize: Font.large,
                        fontFamily: Font.SemiBold,
                        textAlign: config.textRotate,
                        color: Colors.darkText

                    }}>{type === 'addMember' ? Lang_chg.Add_New_Member[config.language] : type === 'editMember' ? Lang_chg.Edit_Member[config.language] : ''}</Text>

                <KeyboardAwareScrollView
                    // keyboardOpeningTime={200}
                    extraScrollHeight={50}
                    enableOnAndroid={true}
                    keyboardShouldPersistTaps='handled'
                    contentContainerStyle={{
                        justifyContent: 'center',
                        paddingBottom: vs(15),
                    }}
                    showsVerticalScrollIndicator={false}>



                    <View style={{ marginTop: vs(15) }}>

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
                                                <View style={{ height: s(23), width: s(23), borderRadius: s(40), backgroundColor: Colors.White, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 0, right: s(4), borderWidth: 1.2, borderColor: Colors.Blue }}>
                                                    <SvgXml xml={Edit} />
                                                </View>
                                            </View>

                                            <View style={{ width: '79%', justifyContent: 'center', paddingHorizontal: s(10) }}>
                                                <Text
                                                    style={{
                                                        fontSize: Font.small,
                                                        fontFamily: Font.Regular,
                                                        textAlign: config.textRotate,
                                                        color: Colors.darkText

                                                    }}>{Lang_chg.Upload_Photo[config.language]}</Text>
                                                <Text
                                                    style={{
                                                        fontSize: Font.xsmall,
                                                        fontFamily: Font.Regular,
                                                        textAlign: config.textRotate,
                                                        color: Colors.lightGrey,
                                                        marginTop: vs(2)

                                                    }}>{Lang_chg.Photo_Size[config.language]}</Text>
                                            </View>
                                        </View>
                                    </TouchableHighlight>
                                    <View style={{ marginTop: vs(10) }}>
                                        <AuthInputBoxSec
                                            mainContainer={{ width: '100%', }}
                                            inputFieldStyle={{ height: vs(35) }}
                                            lableText={Lang_chg.textinputname[config.language]}
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
                                            lableText={Lang_chg.PatientAge[config.language]}
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
                                                    textAlign: config.textRotate,
                                                    color: Colors.lightGrey,
                                                    paddingRight: s(20)

                                                }}>{Lang_chg.Gender[config.language]}</Text>

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
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

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
                                                                    textAlign: config.textRotate,
                                                                    color: Colors.darkText,
                                                                    marginLeft: s(8)

                                                                }}>{item}</Text>
                                                        </View>

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

                                                    <TouchableOpacity
                                                        activeOpacity={0.8}
                                                        onPress={() => setMediamodal(true)}
                                                        style={{ height: s(23), width: s(23), borderRadius: s(40), backgroundColor: Colors.White, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 0, right: s(4), borderWidth: 1.2, borderColor: Colors.Blue }}>
                                                        <SvgXml xml={Edit} />
                                                    </TouchableOpacity>

                                                </View>
                                            </View>

                                            <View style={{ width: '80%', borderBottomWidth: type ? 0 : 1, borderBottomColor: Colors.Border, paddingBottom: vs(20) }}>

                                                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                                    <View style={{ width: '94%', }}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <Text style={{ textAlign: config.textRotate, fontSize: Font.small, fontFamily: Font.Medium, color: Colors.darkText }}>{selectedPatient?.name}</Text>
                                                            <Text style={{ fontSize: 3.5, color: Colors.lightGrey, marginLeft: (windowWidth * 2) / 100 }}>{'\u2B24'}</Text>
                                                            <Text style={{ textAlign: config.textRotate, fontSize: Font.small, fontFamily: Font.Medium, color: Colors.lightGrey, marginLeft: (windowWidth * 2) / 100 }}>{(selectedPatient?.gender === '0' ? "Male" : 'Female') + ', ' + selectedPatient?.age + (' Year')}</Text>

                                                        </View>
                                                    </View>

                                                </View>

                                                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: vs(10) }}>
                                                    <View style={{ width: '94%', flexDirection: 'row' }}>
                                                        <View style={{ flex: 1, borderEndWidth: 1, borderEndColor: Colors.Border }}>
                                                            <Text style={{ textAlign: config.textRotate, fontSize: Font.xsmall, fontFamily: Font.Regular, color: Colors.lightGrey, height: vs(20) }}>{'Appointent Bookings'}</Text>
                                                            <Text style={{ textAlign: config.textRotate, fontSize: Font.medium, fontFamily: Font.Medium, marginTop: vs(4), color: Colors.detailTitles }}>{selectedPatient?.appointment_count}</Text>
                                                        </View>

                                                        <View style={{ flex: 1, borderEndWidth: 1, borderEndColor: Colors.Border, justifyContent: 'center', alignItems: 'center' }}>
                                                            <View style={{ width: '80%' }}>
                                                                <Text style={{ textAlign: config.textRotate, fontSize: Font.xsmall, fontFamily: Font.Regular, color: Colors.lightGrey, height: vs(20) }}>{'Doctor Consul.'}</Text>
                                                                <Text style={{ textAlign: config.textRotate, fontSize: Font.medium, fontFamily: Font.Medium, marginTop: vs(4), color: Colors.detailTitles }}>{selectedPatient?.dc_count}</Text>
                                                            </View>
                                                        </View>

                                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                            <View style={{ width: '80%' }}>
                                                                <Text style={{ textAlign: config.textRotate, fontSize: Font.xsmall, fontFamily: Font.Regular, color: Colors.lightGrey, height: vs(20) }}>{'Lab Tests'}</Text>
                                                                <Text style={{ textAlign: config.textRotate, fontSize: Font.medium, fontFamily: Font.Medium, marginTop: vs(4), color: Colors.detailTitles }}>{selectedPatient?.lab_count}</Text>
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
                                                    lableText={Lang_chg.textinputname[config.language]}
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
                                                    lableText={Lang_chg.PatientAge[config.language]}
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
                                                            textAlign: config.textRotate,
                                                            color: Colors.lightGrey,
                                                            paddingRight: s(20)

                                                        }}>{Lang_chg.Gender[config.language]}</Text>

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
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

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
                                                                            textAlign: config.textRotate,
                                                                            color: Colors.darkText,
                                                                            marginLeft: s(8)

                                                                        }}>{item}</Text>
                                                                </View>

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


                        <View style={{ marginTop: vs(25) }}>

                            {
                                (!isEditable && type === 'editMember') &&
                                <OutlinedButton
                                    text={Lang_chg.Edit[config.language]}
                                    onPress={() => { changeType('editMember') }}
                                />
                            }
                            <Button
                                text={type === 'addMember' ? Lang_chg.Add_Member[config.language] : Lang_chg.Save[config.language]}
                                onPress={() => {
                                    if (type === 'editMember') {
                                        editMember()
                                    } else {
                                        addMember()
                                    }
                                }}
                                btnStyle={{ marginTop: vs(10) }}
                                onLoading={(isLoading?.load && (isLoading?.type === 'add' || isLoading?.type === 'edit'))}
                            />
                        </View>

                        {
                            (type === 'editMember') &&

                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    confirmDelete()

                                }}>
                                <Text style={{
                                    fontSize: Font.small,
                                    fontFamily: Font.Medium,
                                    color: Colors.Theme,
                                    marginTop: (windowWidth * 5) / 100,
                                    alignSelf: 'center'
                                }}>{Lang_chg.Delete[config.language]}</Text>
                            </TouchableOpacity>


                        }

                    </View>


                </KeyboardAwareScrollView>
                <Cameragallery
                    mediamodal={mediamodal}
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

        </Modal>



    )
}
const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
        backdropColor: 'pink',
    },
    modalContainer: {
        width: windowWidth,
        height: windowHeight / 1.5,
        backgroundColor: Colors.White,
        borderRadius: 25,
        paddingTop: vs(40),
        paddingBottom: vs(20),
        paddingHorizontal: s(13),
        position: 'absolute',
        bottom: 0,
        zIndex: 999

    },
    closeContainer: {
        height: s(35),
        width: s(35),
        borderRadius: s(50),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: vs(30),
        right: s(11),
        zIndex: 999
    },
    Title: {
        fontSize: 20,
        fontFamily: Font.Regular,
        color: Colors.Black,
    },
    Desc: {
        fontSize: 16,
        fontFamily: Font.Regular,
        color: Colors.Secondary,
    },
});

export default AddandEditMembers;


