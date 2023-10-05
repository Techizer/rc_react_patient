import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet, ScrollView, TouchableWithoutFeedback, TouchableHighlight, Keyboard, FlatList, } from "react-native";
import Modal from "react-native-modal";

import { Colors, Font } from "../Provider/Colorsfont";
import { windowWidth, LangProvider, config, Icons, windowHeight, apifuntion, msgProvider } from "../Provider/Utils/Utils";
import { Cross, dummyUser, Edit } from "../Icons/Index";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";



const RescheduleBottomSheet = ({
    visible,
    onRequestClose,
    data,
}) => {

    const [requestData, setRequestData] = useState({
        appoinmentDate: '',
        taskType: '',
        currentTime: '',
        timeArray: '',
        dateArray: '',
        firstTimeArray: '',
        secondTimeArray: '',
        time_take_data: ''
    })



    const get_time_date = async () => {

        let url = config.baseURL + "api-patient-next-date-time";

        var bodyData = new FormData();
        bodyData.append("provider_id", data?.provideId);
        bodyData.append("date", requestData?.appoinmentDate != '' ? requestData?.appoinmentDate : data?.appoinmentDate);
        bodyData.append(" task_type", requestData?.taskType);
        bodyData.append("service_type", data?.providerType);

        console.log(bodyData);

        // return;
        apifuntion.postApi(url, data)
            .then((obj) => {
                if (obj.status == true) {
                    var current = new Date();
                    var timcurrent = current.getHours() + ":" + current.getMinutes();
                    setRequestData(prevState => ({
                        ...prevState,
                        currentTime: timcurrent
                    }))
                    console.log("get_time_date.response", obj.result);
                    if (data?.bookingType == "TASK_BOOKING") {
                        if (obj.result.task_time != "") {
                            var names = obj.result.task_time;
                            var nameArr = names.split(",");

                            const new_time_slot = [];
                            const Arr1 = [];
                            const Arr2 = [];
                            if (obj.result.task_time != "") {
                                for (let l = 0; l < nameArr.length; l++) {
                                    if (data?.checkCurrentdate == requestData.appoinmentDate) {
                                        const timeStr = nameArr[l];

                                        const convertTime = (timeStr) => {
                                            const [time, modifier] = timeStr.split(" ");
                                            let [hours, minutes] = time.split(":");
                                            if (hours === "12") {
                                                hours = "00";
                                            }
                                            if (modifier === "PM") {
                                                hours = parseInt(hours, 10) + 12;
                                            }
                                            return `${hours}:${minutes}`;
                                        };
                                        var finaltime = convertTime(timeStr);
                                        if (finaltime >= requestData?.currentTime) {
                                            new_time_slot.push({
                                                time: nameArr[l],
                                                time_status: false,
                                            });
                                            if ((l + 2) % 2 == 0) {
                                                Arr1.push({ time: nameArr[l], time_status: false });
                                            } else {
                                                Arr2.push({ time: nameArr[l], time_status: false });
                                            }
                                        }
                                    } else {
                                        new_time_slot.push({
                                            time: nameArr[l],
                                            time_status: false,
                                        });
                                        if ((l + 2) % 2 == 0) {
                                            Arr1.push({ time: nameArr[l], time_status: false });
                                        } else {
                                            Arr2.push({ time: nameArr[l], time_status: false });
                                        }
                                    }
                                }
                            }

                            setRequestData(prevState => ({
                                ...prevState,
                                timeArray: new_time_slot,
                                firstTimeArray: Arr1,
                                secondTimeArray: Arr2
                            }))
                        } else {
                            setRequestData(prevState => ({
                                ...prevState,
                                timeArray: obj.result.task_time,
                            }))
                        }
                    } else {
                        if (obj.result.hourly_time != "") {
                            var names_time = obj.result.hourly_time;
                            var nameArr_time = names_time.split(",");
                        }

                        const new_time_hourl = [];
                        const Arr_hour = [];
                        const Arr2_hour = [];
                        if (obj.result.hourly_time != "") {
                            for (let m = 0; m < nameArr_time.length; m++) {
                                const timeStr_hour = nameArr_time[m];
                                if (data?.checkCurrentdate == requestData.appoinmentDate) {
                                    const convertTime_hour = (timeStr_hour) => {
                                        const [time, modifier] = timeStr_hour.split(" ");
                                        let [hours, minutes] = time.split(":");
                                        if (hours === "12") {
                                            hours = "00";
                                        }
                                        if (modifier === "PM") {
                                            hours = parseInt(hours, 10) + 12;
                                        }
                                        return `${hours}:${minutes}`;
                                    };
                                    var finaltime_hour = convertTime_hour(timeStr_hour);
                                    if (finaltime_hour >= timcurrent) {
                                        new_time_hourl.push({
                                            time: nameArr_time[m],
                                            time_status: false,
                                        });

                                        if ((m + 2) % 2 == 0) {
                                            Arr_hour.push({
                                                time: nameArr_time[m],
                                                time_status: false,
                                            });
                                        } else {
                                            Arr2_hour.push({
                                                time: nameArr_time[m],
                                                time_status: false,
                                            });
                                        }
                                    }
                                } else {
                                    new_time_hourl.push({
                                        time: nameArr_time[m],
                                        time_status: false,
                                    });
                                    if ((m + 2) % 2 == 0) {
                                        Arr_hour.push({
                                            time: nameArr_time[m],
                                            time_status: false,
                                        });
                                    } else {
                                        Arr2_hour.push({
                                            time: nameArr_time[m],
                                            time_status: false,
                                        });
                                    }
                                }
                            }
                            setRequestData(prevState => ({
                                ...prevState,
                                timeArray: new_time_hourl,
                                firstTimeArray: Arr_hour,
                                secondTimeArray: Arr2_hour
                            }))
                        } else {
                            setRequestData(prevState => ({
                                ...prevState,
                                timeArray: obj.result.hourly_time,
                                firstTimeArray: Arr_hour,
                                secondTimeArray: Arr2_hour
                            }))
                        }
                    }
                } else {
                    return false;
                }
            })
            .catch((error) => {
                console.log(" get_time_date-error ------- " + error);
            });
    };

    const check_date = (item, index) => {
        let newData = data?.dateArray;
        // console.log("new data", newData);

        for (let i = 0; i < newData.length; i++) {
            if (i == index) {
                newData[i].tick = 1;
            } else {
                newData[i].tick = 0;
            }
        }
        setRequestData(prevState => ({
            ...prevState,
            dateArray: newData
        }))
    };

    const BookNewTime = async () => {
        if (requestData.time_take_data.length <= 0) {
            msgProvider.showError(LangProvider.EmptyTime[config.language]);
            return false;
        }


        let url = config.baseURL + "api-patient-update-reschedule-appointment";
        var bodyData = new FormData();

        bodyData.append("service_type", data?.providerType);
        bodyData.append("order_id", data?.orderId);
        bodyData.append("from_date", requestData?.appoinmentDate);
        bodyData.append("from_time", requestData.time_take_data);

        console.log(bodyData);

        // return

        apifuntion
            .postApi(url, data)
            .then((obj) => {
                if (obj.status == true) {
                    onRequestClose()
                    // setTimeout(() => { 
                    //     this.get_Services(1);
                    //     msgProvider.showSuccess(obj.message);
                    // }, 700);
                } else {
                    setTimeout(() => {
                        msgProvider.showError(obj.message);
                        //  msgProvider.alert('',obj.message, false);
                    }, 700);

                    return false;
                }
            })
            .catch((error) => {
                console.log("BookNewTime-error ------- " + error);
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

                    }}>{LangProvider.Reschedule[config.language]}</Text>

                {/* ----------------------Main------------------ */}



                <View style={{ marginTop: vs(15) }}>


                    <View
                        style={{
                            width: "100%",
                        }}>
                        {/* task booking section */}


                        <View
                            style={{
                                width: "90%",
                                alignSelf: "center",
                                paddingVertical: (windowWidth * 4) / 100,
                            }}
                        >
                            <View style={{ paddingBottom: (windowWidth * 1.5) / 100, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text
                                    style={{
                                        fontFamily: Font.Medium,
                                        fontSize: (windowWidth * 3.5) / 100,
                                        textAlign: config.textRotate,
                                        color: Colors.Theme,
                                    }} >
                                    {data?.orderId}
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: Font.Medium,
                                        fontSize: (windowWidth * 3.5) / 100,
                                        textAlign: config.textRotate,
                                        color: Colors.Theme,
                                    }} >
                                    {data?.data?.task_type}
                                </Text>
                            </View>

                            <View
                                style={[
                                    {
                                        paddingVertical: (windowWidth * 3) / 100,
                                        borderTopWidth: (windowWidth * 0.3) / 100,
                                        borderColor: Colors.bordercolor,
                                    },
                                    data?.taskDetails.length >= 3
                                        ? { height: (windowWidth * 40) / 100 }
                                        : { paddingVertical: (windowWidth * 1.5) / 100 },
                                ]}
                            >
                                {data?.bookingType == "TASK_BOOKING" ? (
                                    <FlatList
                                        data={data?.taskDetails}
                                        scrollEnabled={true}
                                        nestedScrollEnabled={true}
                                        renderItem={({ item, index }) => {
                                            if ((data?.taskDetails != "" && data?.taskDetails != null)) {
                                                return (
                                                    <View
                                                        style={{
                                                            alignItems: "center",
                                                            width: "100%",
                                                            alignSelf: "center",

                                                            paddingVertical: (windowWidth * 1.7) / 100,
                                                            flexDirection: "row",
                                                            marginTop: (windowWidth * 0.3) / 100,
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                width: "70%",
                                                                textAlign: config.textRotate,
                                                                alignSelf: "center",
                                                                fontSize: (windowWidth * 3.6) / 100,
                                                                fontFamily: Font.Regular,

                                                                color: "#000",
                                                            }}
                                                        >
                                                            {item.name}
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                width: "30%",

                                                                fontSize: (windowWidth * 3.6) / 100,
                                                                fontFamily: Font.Regular,
                                                                color: "#000",

                                                                textAlign: "right",
                                                            }}
                                                        >
                                                            {item.price}
                                                        </Text>
                                                    </View>
                                                );
                                            } else {
                                                return <View></View>;
                                            }
                                        }}
                                    ></FlatList>
                                ) : (
                                    <FlatList
                                        showsHorizontalScrollIndicator={false}
                                        horizontal={true}
                                        data={data?.taskDetails}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <View
                                                    style={{
                                                        borderRadius: (windowWidth * 2) / 100,
                                                        marginRight: (windowWidth * 2) / 100,
                                                        marginTop: (windowWidth * 2) / 100,
                                                        borderColor: "#0168B3",
                                                        borderWidth: 2,

                                                        width: (windowWidth * 30) / 100,
                                                        backgroundColor: "#fff",
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            backgroundColor: "#0168B3",

                                                            borderTopLeftRadius: (windowWidth * 1.2) / 100,
                                                            borderTopRightRadius: (windowWidth * 1.2) / 100,
                                                            width: "100%",
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                // backgroundColor:'red',
                                                                // paddingHorizontal: (windowWidth * 5) / 100,
                                                                paddingVertical: (windowWidth * 1.5) / 100,
                                                                color: Colors.White,
                                                                fontFamily: Font.Medium,
                                                                fontSize: (windowWidth * 3) / 100,
                                                                textAlign: "center",
                                                                textTransform: "uppercase",
                                                            }}
                                                        >
                                                            {item.name}
                                                        </Text>
                                                    </View>
                                                    <Text
                                                        style={{
                                                            paddingVertical: (windowWidth * 2) / 100,
                                                            fontFamily: Font.Medium,
                                                            textAlign: "center",
                                                            fontSize: Font.small,
                                                        }}
                                                    >
                                                        {item.price}
                                                    </Text>
                                                </View>
                                            );
                                        }}
                                    ></FlatList>
                                )}
                            </View>

                            {/* hourlybooking */}

                            <View
                                style={{
                                    width: "100%",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignSelf: "center",
                                    paddingTop: (windowWidth * 4) / 100,
                                    // paddingBottom: (windowWidth * 4) / 100,
                                    // borderBottomWidth: (windowWidth * 0.3) / 100,
                                    borderColor: Colors.gainsboro,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: Font.Medium,
                                        fontSize: Font.medium,
                                        textAlign: config.textRotate,
                                    }}
                                >
                                    {LangProvider.Appointmentschedule[config.language]}
                                </Text>
                                <View
                                    style={{ flexDirection: "row", alignItems: "center" }}
                                >
                                    <Image
                                        source={Icons.Calendar}
                                        style={{
                                            resizeMode: "contain",
                                            // backgroundColor: Colors.White,
                                            width: 20,
                                            height: 20,

                                            alignSelf: "center",
                                        }} />

                                    <Text
                                        style={{
                                            color: Colors.Theme,
                                            fontFamily: Font.Medium,
                                            fontSize: Font.medium,
                                            marginLeft: (windowWidth * 1) / 100,
                                        }}
                                    >
                                        {data?.appoinmentDate}
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={{
                                    borderWidth: 1,
                                    borderColor: Colors.gainsboro,
                                    width: "100%",
                                    marginTop: (windowWidth * 2) / 100,
                                }}
                            ></View>
                            <View
                                style={{
                                    width: "100%",
                                    alignSelf: "center",
                                    paddingTop: (windowWidth * 3) / 100,
                                    paddingBottom: (windowWidth * 3) / 100,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: Font.Regular,
                                        fontSize: Font.medium,
                                        color: "#000",
                                        textAlign: config.textRotate,
                                    }}
                                >
                                    {LangProvider.SelectDate[config.language]}
                                </Text>

                                <View style={{ width: "100%" }}>
                                    <FlatList
                                        horizontal={true}
                                        data={requestData.dateArray.length > 0 ? requestData?.dateArray : data?.dateArray}
                                        showsHorizontalScrollIndicator={false}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setRequestData(prevState => ({
                                                            ...prevState,
                                                            appoinmentDate: item.date1,
                                                            taskType: "task_base",
                                                            time_take_data: '',
                                                        }))
                                                        get_time_date()
                                                        // check_date(item, index);
                                                    }}
                                                    style={{ width: (windowWidth * 15) / 100 }} >
                                                    <Text
                                                        style={{
                                                            marginRight: (windowWidth * 3) / 100,
                                                            marginTop: (windowWidth * 3) / 100,
                                                            backgroundColor:
                                                                item.tick == 1 ? "#0787D2" : Colors.lightGrey,
                                                            color: item.tick == 1 ? "White" : "black",
                                                            textAlign: "center",
                                                            paddingVertical: (windowWidth * 2) / 100,
                                                            fontFamily: Font.Regular,
                                                            fontSize: Font.small,

                                                            lineHeight: (windowWidth * 5) / 100,
                                                        }}
                                                    >
                                                        {item.day}
                                                        {"\n"}

                                                        {item.datenew}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        }}
                                    ></FlatList>
                                </View>
                            </View>

                            <View
                                style={{
                                    borderWidth: 1,
                                    borderColor: Colors.gainsboro,
                                    width: "100%",
                                    marginTop: (windowWidth * 1.5) / 100,
                                    marginBottom: (windowWidth * 1.5) / 100,
                                }}
                            ></View>

                            <View
                                style={{
                                    width: "100%",
                                    alignSelf: "center",
                                    paddingVertical: (windowWidth * 3) / 100,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: Font.Regular,
                                        fontSize: Font.medium,
                                        textAlign: config.textRotate,
                                    }}
                                >
                                    {LangProvider.Select_start_time[config.language]}
                                </Text>

                                {/* -----------------Time Arrays----------------- */}
                                <ScrollView
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                >
                                    <View style={{ width: "100%" }}>
                                        {(requestData?.timeArray.length > 0 ? requestData?.timeArray : data?.timeArray) ? (
                                            <View style={{ width: "100%" }}>
                                                <View style={{ width: "100%" }}>
                                                    <FlatList
                                                        horizontal={true}
                                                        showsHorizontalScrollIndicator={false}
                                                        data={requestData.firstTimeArray.length > 0 ? requestData?.firstTimeArray : data?.firstTimeArray}
                                                        renderItem={({ item, index }) => {
                                                            return (
                                                                <TouchableOpacity
                                                                    onPress={() => {
                                                                        setRequestData(prevState => ({
                                                                            ...prevState,
                                                                            time_take_data: item?.time
                                                                        }))
                                                                    }}>
                                                                    <Text
                                                                        style={[
                                                                            {
                                                                                marginRight: (windowWidth * 3) / 100,
                                                                                marginTop: (windowWidth * 3) / 100,

                                                                                fontFamily: Font.Regular,
                                                                                fontSize: Font.small,
                                                                                padding: (windowWidth * 2) / 100,
                                                                                paddingHorizontal:
                                                                                    (windowWidth * 3.3) / 100,
                                                                            },
                                                                            item.time ==
                                                                                requestData.time_take_data
                                                                                ? {
                                                                                    backgroundColor:
                                                                                        Colors.Theme,
                                                                                    color: "#fff",
                                                                                }
                                                                                : {
                                                                                    backgroundColor: Colors.lightGrey,
                                                                                    color: "#000",
                                                                                },
                                                                        ]}
                                                                    >
                                                                        {item.time}
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            );
                                                        }}
                                                    ></FlatList>
                                                </View>
                                                <View style={{ width: "100%" }}>
                                                    <FlatList
                                                        horizontal={true}
                                                        showsHorizontalScrollIndicator={false}
                                                        data={requestData?.secondTimeArray.length > 0 ? requestData?.secondTimeArray : data?.secondTimeArray}
                                                        renderItem={({ item, index }) => {
                                                            return (
                                                                <TouchableOpacity
                                                                    onPress={() => {
                                                                        setRequestData(prevState => ({
                                                                            ...prevState,
                                                                            time_take_data: item?.time
                                                                        }))
                                                                    }}>
                                                                    <Text
                                                                        style={[
                                                                            {
                                                                                marginRight: (windowWidth * 3) / 100,
                                                                                marginTop: (windowWidth * 3) / 100,

                                                                                fontFamily: Font.Regular,
                                                                                fontSize: Font.small,
                                                                                padding: (windowWidth * 2) / 100,
                                                                                paddingHorizontal:
                                                                                    (windowWidth * 3.3) / 100,
                                                                            },
                                                                            item.time ==
                                                                                requestData.time_take_data
                                                                                ? {
                                                                                    backgroundColor:
                                                                                        Colors.Theme,
                                                                                    color: "#fff",
                                                                                }
                                                                                : {
                                                                                    backgroundColor: Colors.lightGrey,
                                                                                    color: "#000",
                                                                                },
                                                                        ]}
                                                                    >
                                                                        {item.time}
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            );
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                        ) : (
                                            <Text
                                                style={{
                                                    fontFamily: Font.MediumItalic,
                                                    fontSize: (windowWidth * 4) / 100,
                                                    alignSelf: "center",
                                                    marginTop: (windowWidth * 3) / 100,
                                                    textAlign: "center",
                                                    marginLeft: (windowWidth * 32) / 100,
                                                }}
                                            >
                                                {LangProvider.noTime[config.language]}
                                            </Text>
                                        )}
                                    </View>
                                </ScrollView>
                            </View>

                            <TouchableOpacity
                                onPress={() => {
                                    BookNewTime();
                                }}
                                style={{
                                    width: "98%",
                                    alignSelf: "center",
                                    borderRadius: (windowWidth * 2) / 100,
                                    backgroundColor: Colors.Theme,
                                    paddingVertical: (windowWidth * 2.8) / 100,
                                    marginVertical: (windowWidth * 6) / 100,
                                }}
                            >
                                <Text
                                    style={{
                                        color: Colors.White,
                                        fontFamily: Font.Medium,
                                        fontSize: Font.medium,
                                        alignSelf: "flex-end",
                                        textAlign: config.textalign,
                                        alignSelf: "center",
                                    }}
                                >
                                    {LangProvider.SAVECHANGERESCHEDULE[config.language]}
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>





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
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
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

export default RescheduleBottomSheet;


