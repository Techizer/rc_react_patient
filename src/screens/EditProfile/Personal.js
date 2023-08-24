import {
    Text,
    View,
    TouchableOpacity,
    Image,
    FlatList,
    Keyboard,
    Pressable,
    Platform,
} from "react-native";
import React, { Component, useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
    Colors,
    Icons,
    Font,
    config,
    LangProvider,
    apifuntion,
    msgProvider,
    Cameragallery,
    mediaprovider,
    AuthInputBoxSec,
    Button,
    windowWidth
} from "../../Provider/Utils/Utils";
import DateTimePicker from "react-native-modal-datetime-picker";
import { SvgXml } from "react-native-svg";
import { dummyUser, Edit } from "../../Icons/Index";
import { s, vs } from "react-native-size-matters";
import NationalityBottomSheet from "../../Components/ListBottomSheet";
import { useDispatch, useSelector } from "react-redux";
import { UserDetails, UserProfile } from "../../Redux/Actions";
import NoInternet from "../../Components/NoInternet";


const Personal = ({ navigation }) => {

    const { loggedInUserDetails, languageIndex, deviceConnection, userProfile } = useSelector(state => state.StorageReducer)
    const dispatch = useDispatch()
    const insets = useSafeAreaInsets()
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        user_id: '',
        country_code: '',
        work_area: '',
        address: '',
        identity: '',
        mobile: '',
        dob: '',
        nationality: '',
        gender: -1,
        profile_img: null,
        isLoading: false
    })
    const [mediamodal, setMediaModal] = useState(false)
    const [isCalendar, setIsCalendar] = useState(false)
    const [isNationality, setIsNationality] = useState(false)
    const [date, setDate] = useState(new Date(),)
    const [nationalityList, setNationalityList] = useState([])

    const nameRef = useRef()
    const numberRef = useRef()
    const emailRef = useRef()
    const addRef = useRef()

    useEffect(() => {
        if (deviceConnection) {
            getProfileDetails()
            getNationality()
        }
    }, [deviceConnection])

    const Camerapopen = async () => {
        mediaprovider
            .launchCamera(true)
            .then((obj) => {
                console.log(obj);
                setUserDetails(prevState => ({ ...prevState, profile_img: obj.path }))
                setMediaModal(false)
            })
            .catch((error) => {
                setMediaModal(false)
            });
    };
    const Galleryopen = () => {
        mediaprovider
            .launchGellery(true)
            .then((obj) => {
                console.log(obj);
                setUserDetails(prevState => ({ ...prevState, profile_img: obj.path }))
                setMediaModal(false)
            })
            .catch((error) => {
                setMediaModal(false)
            });
    };

    const getNationality = async () => {

        let url = config.baseURL + "api-getnationality";
        var data = new FormData();
        data.append("login_user_id", loggedInUserDetails?.user_id);

        apifuntion.postApi(url, data, 1)
            .then((obj) => {
                if (obj.status == true) {
                    setNationalityList(obj.result)
                } else {
                    return false;
                }
            })
            .catch((error) => {
                console.log("getNationality-error ------- " + error);
            });
    };

    const setDateOfBirth = (selectedDate) => {
        let check_month;
        let check_date;
        let date = selectedDate.getDate();
        let month = selectedDate.getMonth() + 1;
        let year = selectedDate.getFullYear();
        if (month < 9) {
            check_month = "0" + month;
        } else {
            check_month = month;
        }
        if (date < 9) {
            check_date = "0" + date;
        } else {
            check_date = date;
        }
        let date1 = year + "-" + check_month + "-" + check_date;
        setDate(new Date(date1))
        setUserDetails(prevState => ({ ...prevState, dob: date1 }))
        setIsCalendar(false)
    };


    const getProfileDetails = async () => {
        setUserDetails(prevState => ({ ...prevState, name: userProfile["first_name"] }))
        setUserDetails(prevState => ({ ...prevState, email: userProfile["email"] }))
        setUserDetails(prevState => ({ ...prevState, user_id: userProfile["user_id"] }))
        setUserDetails(prevState => ({ ...prevState, country_code: userProfile["country_code"] }))
        setUserDetails(prevState => ({ ...prevState, work_area: userProfile["work_area"] }))
        setUserDetails(prevState => ({ ...prevState, address: userProfile["address"] }))
        setUserDetails(prevState => ({ ...prevState, identity: userProfile["id_number"] }))

        if (userProfile["phone_number"] != null && userProfile["phone_number"] != "") {
            setUserDetails(prevState => ({ ...prevState, mobile: userProfile["phone_number"] }))
        }
        // if (userProfile["address"] != null && userProfile["address"] != "") {
        //     this.setState({ addressfocus: true });
        // }

        if (userProfile["dob"] != null && userProfile["dob"] != "") {
            setUserDetails(prevState => ({ ...prevState, dob: userProfile["dob"] }))
        }

        if (userProfile.nationality != null && userProfile.nationality != "") {
            setUserDetails(prevState => ({ ...prevState, nationality: userProfile["nationality"] }))
        }
        if (userProfile["gender"] != null && userProfile["gender"] != "") {
            if (userProfile["gender"] == "0") {
                setUserDetails(prevState => ({ ...prevState, gender: 0 }))
            } else {
                setUserDetails(prevState => ({ ...prevState, gender: 1 }))
            }
        }
        if (userProfile['image'] != null) {
            setUserDetails(prevState => ({ ...prevState, profile_img: config.img_url3 + userProfile['image'] }))
        }
    };

    const saveInfo = async () => {
        Keyboard.dismiss();
        if (userDetails.name.length <= 0 || userDetails.name.trim().length <= 0) {
            msgProvider.showError(LangProvider.emptyName[languageIndex]);
            return false;
        }

        let regemail =
            /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if (userDetails.email.length <= 0 || userDetails.email.trim().length <= 0) {
            msgProvider.showError(LangProvider.emptyEmail[languageIndex]);
            return false;
        }

        if (regemail.test(userDetails.email) !== true) {
            msgProvider.showError(LangProvider.validEmail[languageIndex]);
            return false;
        }

        if (userDetails.mobile.length <= 0 || userDetails.mobile.trim().length <= 0) {
            msgProvider.showError(LangProvider.emptymobileNumber[languageIndex]);
            return false;
        }
        if (userDetails.mobile.length < 9) {
            msgProvider.showError(LangProvider.validmobileNumber[languageIndex]);
            return false;
        }
        if (userDetails.mobile.length > 9) {
            msgProvider.showError(LangProvider.validmobileNumber[languageIndex]);
            return false;
        }
        if (
            userDetails.identity.length <= 0 ||
            userDetails.identity.trim().length <= 0
        ) {
            msgProvider.showError(LangProvider.emptyid[languageIndex]);
            return false;
        }

        setUserDetails(prevState => ({
            ...prevState,
            isLoading: true
        }))
        let url = config.baseURL + "api-edit-patient-profile-personal";
        var phone_number_send = userDetails.country_code + userDetails.mobile;
        var data = new FormData();
        data.append("user_id", loggedInUserDetails?.user_id);
        data.append("first_name", userDetails.name);
        data.append("phone_number", phone_number_send);
        data.append("gender", userDetails.gender);
        data.append("id_number", userDetails.identity);
        data.append("dob", userDetails.dob);
        data.append("address", userDetails.address);
        data.append("work_area", userDetails.work_area);
        data.append("nationality", userDetails.nationality);
        if (userDetails.profile_img != null) {
            data.append("image", {
                uri: userDetails.profile_img,
                type: "image/jpg",
                name: userDetails.profile_img,
            });
        }
        apifuntion
            .postApi(url, data)
            .then((obj) => {
                setUserDetails(prevState => ({
                    ...prevState,
                    isLoading: false
                }))
                // console.log("saveInfo-response....", obj);
                // console.log("saveInfo-response....", loggedInUserDetails);
                if (obj.status == true) {
                    dispatch(UserDetails(obj?.result))
                    dispatch(UserProfile(obj?.result))
                    setTimeout(() => {
                        msgProvider.showSuccess(obj.message);
                    }, 500);
                } else {
                    msgProvider.showError(obj.message);
                }
                return false;
            })
            .catch((error) => {
                msgProvider.showError(error);
                setUserDetails(prevState => ({
                    ...prevState,
                    isLoading: false
                }))
                console.log("saveInfo-error ------- " + error);
            });
    };
    return (
        <View
            pointerEvents={userDetails.isLoading ? 'none' : 'auto'}
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
                        width: "93%",
                        alignSelf: 'center',
                    }}>
                    {/* -----------Image Name---------- */}
                    <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', width: '24%', }}>
                            {
                                (userDetails.profile_img != '' && userDetails.profile_img != null) ?
                                    <Image source={{ uri: userDetails.profile_img }} style={{
                                        height: s(65),
                                        width: s(65),
                                        borderRadius: s(100),
                                        backgroundColor: Colors.backgroundcolor,
                                    }} />
                                    :
                                    <SvgXml xml={dummyUser} height={s(65)} width={s(65)} />
                            }
                            <TouchableOpacity
                                onPress={() => {
                                    setMediaModal(true)
                                }}
                                style={{ height: s(23), width: s(23), borderRadius: s(40), backgroundColor: Colors.White, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: vs(0), right: s(6), borderWidth: 1.2, borderColor: Colors.Blue }}>
                                <SvgXml xml={Edit} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginLeft: s(5) }}>
                            <Text
                                style={{
                                    color: Colors.darkText,
                                    fontFamily: Font.Medium,
                                    fontSize: Font.large,
                                    alignSelf: 'flex-start',
                                }} >
                                {userDetails.name}
                            </Text>

                            <Text
                                style={{
                                    color: Colors.lightGrey,
                                    fontFamily: Font.Regular,
                                    fontSize: Font.small,
                                    alignSelf: 'flex-start',
                                }} >
                                {userDetails.email}
                            </Text>
                        </View>

                    </View>

                    {/* ---------------Inputs---------------- */}

                    <AuthInputBoxSec
                        mainContainer={{ marginTop: vs(18), width: '100%' }}
                        lableText={LangProvider.textinputname[languageIndex]}
                        inputRef={nameRef}
                        onChangeText={(text) => setUserDetails(prevState => ({ ...prevState, name: text }))}
                        maxLength={50}
                        value={userDetails.name}
                        keyboardType="default"
                        autoCapitalize="none"
                        returnKeyLabel="next"
                        returnKeyType="next"
                        onSubmitEditing={() => {
                            numberRef.current.focus();
                        }}
                        blurOnSubmit={Platform.OS === 'ios' ? true : false}
                        editable
                    />

                    {/* ------------------------- */}

                    <AuthInputBoxSec
                        mainContainer={{ marginTop: vs(8), width: '100%' }}
                        // lableText={LangProvider.work_area[languageIndex]}
                        // inputRef={}
                        onChangeText={(text) => setUserDetails(prevState => ({ ...prevState, work_area: text }))}
                        maxLength={50}
                        value={userDetails.work_area}
                        keyboardType="default"
                        autoCapitalize="none"
                        returnKeyLabel="done"
                        returnKeyType="done"
                        onSubmitEditing={() => {
                            numberRef.current.focus()
                        }}
                        blurOnSubmit={Platform.OS === 'ios' ? true : false}
                        editable={false}
                    />

                    {/* ------------------------- */}

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: "100%",
                            alignSelf: "center",
                            marginTop: vs(4)
                        }}>
                        <View
                            style={{
                                width: "20%",
                            }}>
                            <AuthInputBoxSec
                                mainContainer={{ marginTop: vs(8), width: '100%' }}
                                lableText={LangProvider.CC_code[languageIndex]}
                                // inputRef={}
                                onChangeText={(text) => setUserDetails(prevState => ({ ...prevState, country_code: text }))}
                                maxLength={50}
                                value={userDetails.country_code}
                                keyboardType="default"
                                autoCapitalize="none"
                                returnKeyLabel="done"
                                returnKeyType="done"
                                onSubmitEditing={() => {
                                    //this.passwordInput.focus();
                                }}
                                blurOnSubmit={Platform.OS === 'ios' ? true : false}
                                editable={false}
                            />
                        </View>

                        <View
                            style={{
                                width: "78%",
                                alignSelf: "center",
                            }}>
                            <AuthInputBoxSec
                                mainContainer={{ marginTop: vs(8), width: '100%' }}
                                lableText={LangProvider.textinputnumber[languageIndex]}
                                inputRef={numberRef}
                                onChangeText={(text) => setUserDetails(prevState => ({ ...prevState, mobile: text }))}
                                maxLength={50}
                                value={userDetails.mobile}
                                keyboardType="default"
                                autoCapitalize="none"
                                returnKeyLabel="next"
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    emailRef.current.focus()
                                }}
                                blurOnSubmit={Platform.OS === 'ios' ? true : false}
                                editable
                            />
                            <Text
                                style={{
                                    alignSelf: 'flex-start',
                                    fontSize: Font.xsmall,
                                    fontFamily: Font.Regular,
                                    color: Colors.lightGrey,
                                    marginTop: vs(8)
                                }}>
                                {LangProvider.mobletexttitle[languageIndex]}
                            </Text>
                        </View>

                    </View>

                    {/* ------------------------- */}

                    <AuthInputBoxSec
                        mainContainer={{ marginTop: vs(8), width: '100%' }}
                        lableText={LangProvider.textinputemails[languageIndex]}
                        inputRef={emailRef}
                        onChangeText={(text) => setUserDetails(prevState => ({ ...prevState, email: text }))}
                        maxLength={50}
                        value={userDetails.email}
                        keyboardType="default"
                        autoCapitalize="none"
                        returnKeyLabel="next"
                        returnKeyType="next"
                        onSubmitEditing={() => {
                            addRef.current.focus()
                        }}
                        blurOnSubmit={Platform.OS === 'ios' ? true : false}
                        editable
                    />

                    {/* ------------------------- */}

                    <View
                        style={{
                            width: "100%",
                            height: 50,
                            alignSelf: "center",
                            marginTop: vs(13),
                            flexDirection: "row",
                            borderColor: isCalendar ? Colors.Theme : Colors.Border,
                            borderWidth: 1,
                            borderRadius: 3,
                            paddingHorizontal: s(9)
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                setIsCalendar(true)
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
                                        lineHeight: 48,
                                    }}>
                                    {userDetails.dob.length <= 0 ? LangProvider.dob[languageIndex] : userDetails.dob}
                                </Text>
                            </View>

                            <View
                                style={{
                                    width: "15%",
                                    alignItems: 'flex-end',
                                    justifyContent: 'center'
                                }}>
                                <Image
                                    source={Icons.Calendar}
                                    style={{ height: 25, width: 25 }}
                                ></Image>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* ------------------------- */}


                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginTop: vs(12), }}>

                        <Text
                            style={{
                                fontSize: Font.large,
                                fontFamily: Font.Regular,
                                alignSelf: 'flex-start',
                                color: Colors.darkText,
                                paddingRight: s(20)

                            }}>{LangProvider.Gender[languageIndex]}</Text>

                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            data={languageIndex == 0 ? ['Male', 'Female'] : ['ذكر', 'أنثى']}
                            ItemSeparatorComponent={() => {
                                return (
                                    <View style={{ width: s(25) }} />
                                )
                            }}
                            renderItem={({ item, index }) => {
                                return (
                                    <Pressable
                                        onPress={() => {
                                            setUserDetails(prevState => ({ ...prevState, gender: index }))
                                        }}
                                        style={{ flexDirection: 'row', alignItems: 'center' }}>

                                        <View
                                            style={{
                                                height: s(16),
                                                width: s(16),
                                                borderRadius: s(16),
                                                borderWidth: index === userDetails.gender ? 5 : 1,
                                                borderColor: index === userDetails.gender ? Colors.Blue : Colors.lightGrey
                                            }}>

                                        </View>
                                        <Text
                                            style={{
                                                fontSize: Font.small,
                                                fontFamily: Font.Regular,
                                                alignSelf: 'flex-start',
                                                color: Colors.darkText,
                                                marginLeft: s(8)

                                            }}>{item}</Text>
                                    </Pressable>

                                );
                            }}
                        />

                    </View>

                    {/* ------------------------- */}

                    <View
                        style={{
                            width: "100%",
                            height: 50,
                            alignSelf: "center",
                            marginTop: vs(10),
                            flexDirection: "row",
                            borderColor: isCalendar ? Colors.Theme : Colors.Border,
                            borderWidth: 1,
                            borderRadius: 3,
                            paddingHorizontal: s(9)
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                setIsNationality(true)
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
                                        lineHeight: 48,
                                    }}>
                                    {userDetails.nationality == '' ? LangProvider.nationality[languageIndex] : userDetails.nationality}
                                </Text>
                            </View>

                            <View
                                style={{
                                    width: "15%",
                                    alignItems: 'flex-end',
                                    justifyContent: 'center'
                                }}>
                                <Image
                                    source={Icons.downarrow}
                                    style={{ height: 18, width: 18 }}
                                ></Image>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* ------------------------- */}

                    <AuthInputBoxSec
                        mainContainer={{ marginTop: vs(8), width: '100%' }}
                        lableText={LangProvider.textinputaddress[languageIndex]}
                        inputRef={addRef}
                        onChangeText={(text) => setUserDetails(prevState => ({ ...prevState, address: text }))}
                        maxLength={50}
                        value={userDetails.address}
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

                    {/* ------------------------- */}

                    <AuthInputBoxSec
                        mainContainer={{ marginTop: vs(10), width: '100%' }}
                        lableText={LangProvider.textinputidentity[languageIndex]}
                        // inputRef={}
                        onChangeText={(text) => setUserDetails(prevState => ({ ...prevState, identity: text }))}
                        maxLength={50}
                        value={userDetails.identity}
                        keyboardType="default"
                        autoCapitalize="none"
                        returnKeyLabel="done"
                        returnKeyType="done"
                        onSubmitEditing={() => {
                            //this.passwordInput.focus();
                        }}
                        blurOnSubmit={Platform.OS === 'ios' ? true : false}
                        editable={false}
                    />
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
                    onPress={() => saveInfo()}
                    onLoading={userDetails.isLoading}
                />
            </View>

            <Cameragallery
                mediamodal={mediamodal}
                Camerapopen={() => {
                    Camerapopen();
                }}
                Galleryopen={() => {
                    Galleryopen();
                }}
                Canclemedia={() => {
                    setMediaModal(false)
                }}
            />

            <DateTimePicker
                isVisible={isCalendar}
                mode="date"
                value={date}
                maximumDate={new Date()}
                onConfirm={(date) => {
                    setDateOfBirth(date)
                }}
                onCancel={() => {
                    setIsCalendar(false)
                }}
            />

            <NationalityBottomSheet
                visible={isNationality}
                onRequestClose={() => {
                    setIsNationality(false)
                }}
                data={nationalityList}
                title={LangProvider.Select_Nationality[languageIndex]}
                selectedIssue={(val) => {
                    setUserDetails(prevState => ({ ...prevState, nationality: val }))
                }}
            />

        </View>
    )
}

export default Personal;


