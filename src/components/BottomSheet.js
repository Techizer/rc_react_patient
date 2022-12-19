import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableHighlight, Keyboard, FlatList, } from "react-native";
import Modal from "react-native-modal";

import { Colors, Font } from "../Provider/Colorsfont";
import {
    windowWidth, deviceHeight, Lang_chg, config,
    localStorage, Icons, consolepro, msgText,
    Cameragallery, apifuntion, msgProvider,
} from "../Provider/utilslib/Utils";
import { Cross, dummyUser, Edit } from "../icons/SvgIcons/Index";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import AuthInputBoxSec from "./AuthInputBoxSec";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Button from "./Button";
import Member from "./Member";
import OutlinedButton from "./OutlinedButton";




const ManageAddressBottomSheet = ({
    visible,
    onRequestClose,
    type
}) => {

    const [title, setTitle] = useState('')
    const [googleAddress, setGoogleAddress] = useState('')
    const [nearest, setNearest] = useState('')
    const [building, setBuilding] = useState('')
    const [name, setName] = useState('')
    const [dob, setDOB] = useState('')
    const [gender, setGender] = useState(-1)
    const [defaultAddress, setDefaultAddress] = useState(false)
    const titleRef = useRef()
    const addressRef = useRef()
    const landmarkRef = useRef()
    const buildingRef = useRef()
    const nameRef = useRef()
    const dobRef = useRef()
    const [mediamodal, setMediamodal] = useState(false)

    const getNewAddress = async () => {
        let newAddress = await localStorage.getItemObject('address_arr');
        console.log({ newAddress });
    }

    useEffect(() => {
        getNewAddress()
    }, [])

    Camerapopen = async () => {
        mediaprovider
            .launchCamera(true)
            .then((obj) => {
                console.log(obj);
                console.log(obj.path);
                if (this.state.img_type == 0) {
                    this.setState({ cover_img: obj.path, mediamodal: false });
                } else {
                    this.setState({
                        profile_img: obj.path,
                        mediamodal: false,
                    });
                }
            })
            .catch((error) => {
                setMediamodal(false)
            });
    };
    Galleryopen = () => {
        mediaprovider
            .launchGellery(true)
            .then((obj) => {
                console.log(obj);
                console.log(obj.path);
                // this.editImage(obj.path);
                if (this.state.img_type == 0) {
                    this.setState({ cover_img: obj.path, mediamodal: false });
                } else {
                    this.setState({
                        profile_img: obj.path,
                        mediamodal: false,
                        profile_image: obj.path,
                    });
                }
            })
            .catch((error) => {
                setMediamodal(false)
            });
    };

    const submit_click = async () => {
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
        // if (
        //     this.state.last_name.length <= 0 ||
        //     this.state.last_name.trim().length <= 0
        // ) {
        //     msgProvider.showError(msgText.emptyPaitentLastName[config.language]);
        //     return false;
        // }
        if (dob.length <= 0 || dob.trim().length <= 0) {
            msgProvider.showError(msgText.emptyAge[config.language]);
            return false;
        }
        if (gender == -1) {
            msgProvider.showError("Please select gender");
            return false;
        }
        if (
            this.state.profile_img == "" ||
            this.state.profile_img == "NA" ||
            this.state.profile_img == null
        ) {
            msgProvider.showError(msgText.emptyImage[config.language]);
            return false;
            // }
        }

        let url = config.baseURL + "api-insert-patient-family";
        console.log("url", url);
        //         patient_id:470
        // first_name:Test
        // last_name:MJ
        // gender:Male
        // age:33
        // image:
        // created_date:2022-11-30
        // updated_date:2022-11-30
        // created_by:470
        // updated_by:470
        // status:1
        var data = new FormData();

        data.append("patient_id", user_id);
        data.append("first_name", name);
        data.append("last_name", "");
        data.append("gender", (gender == 0) ? "Male" : "Female");
        data.append("age", dob);
        data.append("created_date", "2022-11-30");
        data.append("updated_date", "2022-11-30");
        data.append("created_by", user_id);
        data.append("updated_by", user_id);
        data.append("status", "1");
        console.log("check data", data);
        // console.log("this.state.profile_img1234", this.state.profile_image);
        // if (this.state.profile_image != "") {
        //     data.append("image", {
        //         uri: this.state.profile_img,
        //         type: "image/jpg",
        //         name: this.state.profile_img,
        //     });
        // }

        consolepro.consolelog("data", data);
        //this.setState({ loading: true });
        apifuntion
            .postApi(url, data)
            .then((obj) => {
                consolepro.consolelog("obj", obj);
                //this.setState({ loading: false });
                if (obj.status == true) {
                    //this.props.navigation.goBack();
                    // msgProvider.showError(obj.message,'center')
                    onRequestClose(obj.result)
                } else {
                    msgProvider.alert("", obj.message, false);
                }
                return false;
            })
            .catch((error) => {
                consolepro.consolelog("-------- error ------- " + error);
                this.setState({ loading: false });
            });
    };

    return (
        <Modal
            isVisible={visible}
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


            <View style={styles.modalContainer}>
                <TouchableHighlight
                    onPress={onRequestClose}
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

                    }}
                >{type === 'addMember' ? Lang_chg.Add_New_Member[config.language] : type === 'editAddress' ? Lang_chg.Edit_Address[config.language] : type === 'addAddress' ? Lang_chg.Add_Address[config.language] : ''}</Text>

                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps='handled'
                    contentContainerStyle={{
                        justifyContent: 'center',
                        paddingBottom: vs(15),
                    }}
                    showsVerticalScrollIndicator={false}>



                    <View style={{ marginTop: vs(15) }}>

                        {
                            (type === 'addAddress' || type === 'editAddress' || type === 'addMember') ?
                                (
                                    type === 'addMember' ?
                                        <>
                                            <TouchableHighlight 
                                            underlayColor={Colors.Highlight}
                                            onPress={()=>{setMediamodal(true)}}>
                                                <View style={{ flexDirection: 'row', }}>
                                                    <View style={{ width: '21%', flexDirection: 'row', }}>
                                                        <SvgXml xml={dummyUser} height={vs(55)} width={s(55)} />
                                                        <View style={{ height: s(23), width: s(23), borderRadius: s(40), backgroundColor: Colors.White, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: vs(2), right: s(6), borderWidth: 1.2, borderColor: Colors.Blue }}>
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
                                        <>
                                            <AuthInputBoxSec
                                                mainContainer={{ width: '100%' }}
                                                inputFieldStyle={{ height: vs(35) }}
                                                lableText={Lang_chg.Address_Title[config.language]}
                                                inputRef={titleRef}
                                                onChangeText={(val) => setTitle(val)}
                                                value={title}
                                                keyboardType="default"
                                                autoCapitalize="none"
                                                returnKeyType="next"
                                                onSubmitEditing={() => {
                                                    addressRef.current.focus();
                                                }}
                                                editable
                                            />

                                            <AuthInputBoxSec
                                                mainContainer={{ marginTop: vs(5), width: '100%' }}
                                                inputFieldStyle={{ height: vs(35) }}
                                                lableText={Lang_chg.Google_Address[config.language]}
                                                inputRef={addressRef}
                                                onChangeText={(val) => setGoogleAddress(val)}
                                                value={googleAddress}
                                                keyboardType="default"
                                                autoCapitalize="none"
                                                returnKeyType="next"
                                                onSubmitEditing={() => {
                                                    landmarkRef.current.focus()
                                                }}
                                                editable
                                            />

                                            <AuthInputBoxSec
                                                mainContainer={{ marginTop: vs(5), width: '100%' }}
                                                inputFieldStyle={{ height: vs(35) }}
                                                lableText={Lang_chg.Nearest_Address[config.language]}
                                                inputRef={landmarkRef}
                                                onChangeText={(val) => setNearest(val)}
                                                value={nearest}
                                                keyboardType="default"
                                                autoCapitalize="none"
                                                returnKeyType="next"
                                                onSubmitEditing={() => {
                                                    buildingRef.current.focus()
                                                }}
                                                editable
                                            />

                                            <AuthInputBoxSec
                                                mainContainer={{ marginTop: vs(5), width: '100%' }}
                                                inputFieldStyle={{ height: vs(35) }}
                                                lableText={Lang_chg.Building_Name[config.language]}
                                                inputRef={buildingRef}
                                                onChangeText={(val) => setBuilding(val)}
                                                value={building}
                                                keyboardType="default"
                                                autoCapitalize="none"
                                                returnKeyType="done"
                                                onSubmitEditing={() => {
                                                    Keyboard.dismiss()
                                                }}
                                                editable
                                            />

                                            {
                                                type === 'editAddress' &&
                                                <View
                                                    style={{
                                                        width: "100%",
                                                        alignSelf: "center",
                                                        marginTop: vs(15),
                                                        flexDirection: "row",
                                                        alignItems: 'center'
                                                    }} >

                                                    <TouchableOpacity
                                                        activeOpacity={0.8}
                                                        style={{
                                                            width: "37%",
                                                            flexDirection: "row",
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                        }}
                                                        onPress={() => {
                                                            setDefaultAddress(!defaultAddress)
                                                        }}>


                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                setDefaultAddress(!defaultAddress)
                                                            }}
                                                            style={{
                                                                height: 20,
                                                                width: 20,
                                                                borderRadius: 5,
                                                                backgroundColor: defaultAddress ? Colors.Theme : Colors.White,
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                borderWidth: defaultAddress ? 0 : 1.3,
                                                                borderColor: Colors.Border
                                                            }}>
                                                            {
                                                                defaultAddress ?
                                                                    <Image
                                                                        style={{
                                                                            height: 14,
                                                                            width: 14,
                                                                            tintColor: Colors.White
                                                                        }}
                                                                        resizeMode="contain"
                                                                        source={Icons.Tick}
                                                                    />
                                                                    :
                                                                    null
                                                            }
                                                        </TouchableOpacity>
                                                        <Text
                                                            style={{
                                                                color: Colors.inActiveText,
                                                                fontFamily: Font.Regular,
                                                                fontSize: Font.medium,
                                                            }}>
                                                            {Lang_chg.Default_Address[config.language]}
                                                        </Text>

                                                    </TouchableOpacity>
                                                </View>
                                            }
                                        </>
                                )
                                :
                                (
                                    <Member
                                        type={'mine'}
                                    />
                                )
                        }


                        <View style={{ marginTop: vs(25) }}>
                            {
                                (type === 'editMember') &&
                                <OutlinedButton
                                    text={Lang_chg.Merge[config.language]}
                                    onPress={() => { }}
                                />
                            }
                            <Button
                                text={type === 'addMember' ? Lang_chg.Add_Member[config.language] : type === 'editMember' ? Lang_chg.Archive[config.language] : Lang_chg.Save_Address[config.language]}
                                onPress={() => { submit_click() }}
                                btnStyle={{ marginTop: vs(10) }}
                            />
                        </View>
                        {
                            type != 'addMember' &&
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={onRequestClose}>
                                <Text
                                    style={{
                                        fontSize: Font.small,
                                        fontFamily: Font.Medium,
                                        textAlign: config.textRotate,
                                        color: Colors.Theme,
                                        marginTop: vs(15),
                                        alignSelf: 'center'

                                    }}
                                >{Lang_chg.Delete[config.language]}</Text>
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
        height: deviceHeight - 300,
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

export default ManageAddressBottomSheet;


