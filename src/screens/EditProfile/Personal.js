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
import React, { Component, useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
    consolepro,
    Colors,
    Icons,
    Font,
    config,
    windowWidth,
    Lang_chg,
    localStorage,
    apifuntion,
    msgProvider,
    msgText,
    msgTitle,
    Cameragallery,
    mediaprovider,
    AuthInputBoxSec,
    Button
} from "../../Provider/utilslib/Utils";
import DateTimePicker from "react-native-modal-datetime-picker";
import { SvgXml } from "react-native-svg";
import { dummyUser, Edit } from "../../Icons/Index";
import { s, vs } from "react-native-size-matters";
import NationalityBottomSheet from "../../components/ListBottomSheet";



const bloodModal_arr = [
    {
        id: 1,
        blood: "A+",
        line: 0,
    },
    {
        id: 2,
        blood: "O+",
        line: 0,
    },
    {
        id: 3,
        blood: "B+",
        line: 0,
    },
    {
        id: 4,
        blood: "AB+",
        line: 0,
    },
    {
        id: 5,
        blood: "A-",
        line: 0,
    },
    {
        id: 5,
        blood: "B-",
        line: 0,
    },
    {
        id: 6,
        blood: "O-",
        line: 0,
    },
    {
        id: 7,
        blood: "AB-",
        line: 1,
    },
];

const occupation_arr = [
    {
        id: 1,
        name: "Technician",
        line: 0,
    },
    {
        id: 2,
        name: "Teacher",
        line: 0,
    },
    {
        id: 3,
        name: "Machinist",
        line: 0,
    },
    {
        id: 4,
        name: "Technologist",
        line: 0,
    },
    {
        id: 5,
        name: "Electrician",
        line: 0,
    },
    {
        id: 6,
        name: "Engineering technician",
        line: 0,
    },
    {
        id: 7,
        name: "Actuary",
        line: 0,
    },
    {
        id: 8,
        name: "Electrician",
        line: 0,
    },
    {
        id: 9,
        name: "Tradesman",
        line: 0,
    },
    {
        id: 10,
        name: "Mediacl laboratory scientist",
        line: 0,
    },
    {
        id: 11,
        name: "Quantity surveyor",
        line: 0,
    },
    {
        id: 12,
        name: "Prosthetist",
        line: 0,
    },
    {
        id: 13,
        name: "Paramedic",
        line: 0,
    },
    {
        id: 14,
        name: "Bricklayer",
        line: 0,
    },
    {
        id: 15,
        name: "Special Education Teacher",
        line: 0,
    },
    {
        id: 16,
        name: "Lawyer",
        line: 0,
    },
    {
        id: 17,
        name: "Physician",
        line: 0,
    },
    {
        id: 18,
        name: "other",
        line: 1,
    },
];

const activity_arr = [
    {
        id: 1,
        name: "Extremely inactive",
        line: 0,
    },
    {
        id: 2,
        name: "Sedentary",
        line: 0,
    },
    {
        id: 3,
        name: "Moderately active",
        line: 0,
    },
    {
        id: 4,
        name: "Vigorously active",
        line: 0,
    },
    {
        id: 5,
        name: "Extremely active",
        line: 1,
    },
];

const food_arr = [
    {
        id: 1,
        name: "Standard",
        line: 0,
    },
    {
        id: 2,
        name: "Pescetarian",
        line: 0,
    },
    {
        id: 3,
        name: "Vegetarian",
        line: 0,
    },
    {
        id: 3,
        name: "Lacto-vegetarian",
        line: 0,
    },
    {
        id: 3,
        name: "Vegan",
        line: 1,
    },
];

const Personal = () => {

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
    })
    const [mediamodal, setMediaModal] = useState(false)
    const [isCalendar, setIsCalendar] = useState(false)
    const [isNationality, setIsNationality] = useState(false)
    const [date, setDate] = useState(new Date(),)
    const [nationalityList, setNationalityList] = useState([])

    useEffect(() => {
        getProfile()
        getNationality()
    }, [])

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
        let user_details = await localStorage.getItemObject("user_arr");
        let user_id = user_details["user_id"];

        let url = config.baseURL + "api-getnationality";
        var data = new FormData();
        data.append("login_user_id", user_id);

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


    const getProfile = async () => {
        let user_details = await localStorage.getItemObject("user_arr");
        console.log("user_details user_details", user_details);
        let user_id = user_details["user_id"];

        let url = config.baseURL + "api-patient-profile";
        var data = new FormData();
        data.append("user_id", user_id);

        apifuntion.postApi(url, data)
            .then((obj) => {
                consolepro.consolelog("getProfile...", obj);
                if (obj.status == true) {

                    let result = obj.result;
                    setUserDetails(prevState => ({ ...prevState, name: result["first_name"] }))
                    setUserDetails(prevState => ({ ...prevState, email: result["email"] }))
                    setUserDetails(prevState => ({ ...prevState, user_id: result["user_id"] }))
                    setUserDetails(prevState => ({ ...prevState, country_code: result["country_code"] }))
                    setUserDetails(prevState => ({ ...prevState, work_area: result["work_area"] }))
                    setUserDetails(prevState => ({ ...prevState, address: result["address"] }))
                    setUserDetails(prevState => ({ ...prevState, identity: result["id_number"] }))

                    if (result["phone_number"] != null && result["phone_number"] != "") {
                        setUserDetails(prevState => ({ ...prevState, mobile: result["phone_number"] }))
                    }
                    // if (result["address"] != null && result["address"] != "") {
                    //     this.setState({ addressfocus: true });
                    // }

                    if (result["dob"] != null && result["dob"] != "") {
                        setUserDetails(prevState => ({ ...prevState, dob: result["dob"] }))
                    }

                    if (result.nationality != null && result.nationality != "") {
                        setUserDetails(prevState => ({ ...prevState, nationality: result["nationality"] }))
                    }
                    if (result["gender"] != null && result["gender"] != "") {
                        if (result["gender"] == "0") {
                            setUserDetails(prevState => ({ ...prevState, gender: 0 }))
                        } else {
                            setUserDetails(prevState => ({ ...prevState, gender: 1 }))
                        }
                    }
                    if (result['image'] != null) {
                        setUserDetails(prevState => ({ ...prevState, profile_img: config.img_url3 + result['image'] }))
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
                consolepro.consolelog("-------- error ------- " + error);
                this.setState({ loading: false });
            });
    };

    const saveInfo = async () => {
        Keyboard.dismiss();

        let user_details = await localStorage.getItemObject("user_arr");
        let user_id = user_details["user_id"];

        if (userDetails.name.length <= 0 || userDetails.name.trim().length <= 0) {
            msgProvider.showError(msgText.emptyName[config.language]);
            return false;
        }

        let regemail =
            /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if (userDetails.email.length <= 0 || userDetails.email.trim().length <= 0) {
            msgProvider.showError(msgText.emptyEmail[config.language]);
            return false;
        }

        if (regemail.test(userDetails.email) !== true) {
            msgProvider.showError(msgText.validEmail[config.language]);
            return false;
        }

        if (userDetails.mobile.length <= 0 || userDetails.mobile.trim().length <= 0) {
            msgProvider.showError(msgText.emptymobileNumber[config.language]);
            return false;
        }
        if (userDetails.mobile.length < 9) {
            msgProvider.showError(msgText.validmobileNumber[config.language]);
            return false;
        }
        if (userDetails.mobile.length > 9) {
            msgProvider.showError(msgText.validmobileNumber[config.language]);
            return false;
        }
        if (
            userDetails.identity.length <= 0 ||
            userDetails.identity.trim().length <= 0
        ) {
            msgProvider.showError(msgText.emptyid[config.language]);
            return false;
        }

        let url = config.baseURL + "api-edit-patient-profile-personal";
        var phone_number_send = userDetails.country_code + userDetails.mobile;
        var data = new FormData();
        data.append("user_id", user_id);
        data.append("first_name", userDetails.name);
        data.append("phone_number", phone_number_send);
        data.append("gender", userDetails.gender);
        data.append("id_number", userDetails.identity);
        data.append("dob", userDetails.dob);
        data.append("address", userDetails.address);
        data.append("work_area", userDetails.work_area);
        data.append("nationality", userDetails.nationality);
        if (userDetails.profile_img != "") {
            data.append("image", {
                uri: userDetails.profile_img,
                type: "image/jpg",
                name: userDetails.profile_img,
            });
        }

        apifuntion
            .postApi(url, data)
            .then((obj) => {
                consolepro.consolelog("saveInfo-response....", obj);
                if (obj.status == true) {
                    let user_details = obj.result;
                    localStorage.setItemObject("user_arr", user_details);
                    setTimeout(() => {
                        msgProvider.showSuccess(obj.message);
                    }, 500);
                } else {
                    msgProvider.showError(obj.message);
                }
                return false;
            })
            .catch((error) => {
                consolepro.consolelog("saveInfo-error ------- " + error);
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
                                        borderRadius: s(100)
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
                                    textAlign: config.textRotate,
                                }} >
                                {userDetails.name}
                            </Text>

                            <Text
                                style={{
                                    color: Colors.lightGrey,
                                    fontFamily: Font.Regular,
                                    fontSize: Font.small,
                                    textAlign: config.textRotate,
                                }} >
                                {userDetails.email}
                            </Text>
                        </View>

                    </View>

                    {/* ---------------Inputs---------------- */}

                    <AuthInputBoxSec
                        mainContainer={{ marginTop: vs(18), width: '100%' }}
                        lableText={Lang_chg.textinputname[config.language]}
                        inputRef={(ref) => {
                            this.nameInput = ref;
                        }}
                        onChangeText={(text) => setUserDetails(prevState => ({ ...prevState, name: text }))}
                        maxLength={50}
                        value={userDetails.name}
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

                    {/* ------------------------- */}

                    <AuthInputBoxSec
                        mainContainer={{ marginTop: vs(8), width: '100%' }}
                        // lableText={Lang_chg.work_area[config.language]}
                        inputRef={(ref) => {
                            this.nameInput = ref;
                        }}
                        onChangeText={(text) => setUserDetails(prevState => ({ ...prevState, work_area: text }))}
                        maxLength={50}
                        value={userDetails.work_area}
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
                                lableText={Lang_chg.CC_code[config.language]}
                                inputRef={(ref) => {
                                    this.nameInput = ref;
                                }}
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
                                lableText={Lang_chg.textinputnumber[config.language]}
                                inputRef={(ref) => {
                                    this.nameInput = ref;
                                }}
                                onChangeText={(text) => setUserDetails(prevState => ({ ...prevState, mobile: text }))}
                                maxLength={50}
                                value={userDetails.mobile}
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
                            <Text
                                style={{
                                    textAlign: config.textRotate,
                                    fontSize: Font.textsize,
                                    fontFamily: Font.headingfontfamily,
                                    color: Colors.lightGrey,
                                    marginTop: vs(8)
                                }}>
                                {Lang_chg.mobletexttitle[config.language]}
                            </Text>
                        </View>

                    </View>

                    {/* ------------------------- */}

                    <AuthInputBoxSec
                        mainContainer={{ marginTop: vs(8), width: '100%' }}
                        lableText={Lang_chg.textinputemails[config.language]}
                        inputRef={(ref) => {
                            this.nameInput = ref;
                        }}
                        onChangeText={(text) => setUserDetails(prevState => ({ ...prevState, email: text }))}
                        maxLength={50}
                        value={userDetails.email}
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
                                        textAlign: config.textalign,
                                        fontFamily: Font.Regular,
                                        includeFontPadding: false,
                                        lineHeight: 48,
                                    }}>
                                    {userDetails.dob.length <= 0 ? Lang_chg.dob[config.language] : userDetails.dob}
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


                    <View style={{ width: '100%', height: vs(20), flexDirection: 'row', alignItems: 'center', marginTop: vs(12), }}>

                        <Text
                            style={{
                                fontSize: Font.large,
                                fontFamily: Font.Regular,
                                textAlign: config.textRotate,
                                color: Colors.darkText,
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
                                                setUserDetails(prevState => ({ ...prevState, gender: index }))
                                            }}
                                            style={{
                                                height: s(16),
                                                width: s(16),
                                                borderRadius: s(16),
                                                borderWidth: index === userDetails.gender ? 5 : 1,
                                                borderColor: index === userDetails.gender ? Colors.Blue : Colors.lightGrey
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
                                        textAlign: config.textalign,
                                        fontFamily: Font.Regular,
                                        includeFontPadding: false,
                                        lineHeight: 48,
                                    }}>
                                    {userDetails.nationality == '' ? Lang_chg.nationality[config.language] : userDetails.nationality}
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
                        lableText={Lang_chg.textinputaddress[config.language]}
                        inputRef={(ref) => {
                            this.nameInput = ref;
                        }}
                        onChangeText={(text) => setUserDetails(prevState => ({ ...prevState, address: text }))}
                        maxLength={50}
                        value={userDetails.address}
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

                    {/* ------------------------- */}

                    <AuthInputBoxSec
                        mainContainer={{ marginTop: vs(8), width: '100%' }}
                        lableText={Lang_chg.textinputidentity[config.language]}
                        inputRef={(ref) => {
                            this.nameInput = ref;
                        }}
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

                    <Button
                        text={Lang_chg.submitbtntext[config.language]}
                        onPress={() => saveInfo()}
                        btnStyle={{ marginTop: vs(15) }}
                    />

                </View>



            </KeyboardAwareScrollView>

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
                title={Lang_chg.Select_Nationality[config.language]}
                selectedIssue={(val) => {
                    setUserDetails(prevState => ({ ...prevState, nationality: val }))
                }}
            />
        </View>
    )
}

export default Personal;


