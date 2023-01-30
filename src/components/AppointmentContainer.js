import {
    FlatList,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    TouchableHighlight,
    Image,
    ScrollView,
} from "react-native";
import {
    SkypeIndicator,
} from 'react-native-indicators';
import React, { Component, useEffect, useState } from "react";
import { Icons, msgProvider, windowHeight } from "../Provider/Utils/Utils";
import moment from "moment-timezone";
import Modal from "react-native-modal";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";


import {
    Colors,
    Font,
    config,
    windowWidth,
    LangProvider,
    apifuntion,
    deviceHeight,
    Button
} from "../Provider/Utils/Utils";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import { Cross, VideoCall, whiteStar } from "../Icons/Index";
import RatingBottomSheet from "./RatingBottomSheet";
import StarRating from "react-native-star-rating";
import { useSelector } from "react-redux";

var videoCallButton = false;


const AppointmentContainer = ({
    Item,
    Index,
    navigation,
    isLoading
}) => {
    const { loggedInUserDetails, guest, appLanguage,languageIndex } = useSelector(state => state.StorageReducer)

    const [otp, setOtp] = useState([])
    const [rescheduleData, setRescheduleData] = useState({
        order_id: '',
        service_status: '',
        send_id: '',
        time_take_data: '',
        time_Arr: '',
        final_one: '',
        final_arr_two: '',
        set_date: '',
        newDate: '',
        rescdule_data: '',
        check_booking: '',
        message: '',
        task_details: '',
        date_array: '',
        set_task: '',
        check_currentdate: '',
        timcurrent_for_check: '',
        isRescheduleModal: false,
        isLoading: false,
        isScheduleagain: false,
    })

    const [ratingData, setRatingData] = useState({
        modalVisiblerating: false,
        rating: 0,
        review: ''
    })
    const [currency, setCurrency] = useState('')

    const getUserCountry = async () => {
        if (loggedInUserDetails?.work_area === 'UAE') {
            setCurrency('AED')
        } else {
            setCurrency('SAR')
        }
    }

    useEffect(() => {
        // console.log('**********************', rescheduleData.final_one);
        getDay()
    }, [rescheduleData.isRescheduleModal])

    useEffect(() => {
        splitOtp()
        getUserCountry()
        setRescheduleData(prevState => ({
            ...prevState,
            set_task: Item?.booking_type,
            service_status: Item?.provider_type,
        }))
        // console.log('************************', Item);
    }, [Item])



    const splitOtp = () => {
        let tempArr = []
        if (Item?.acceptance_status === 'Accepted') {
            if ((Item?.otp != null && Item?.otp != '')) {
                let OTP = Item?.otp?.split('')
                for (let index = 0; index < Item?.otp.length; index++) {
                    tempArr.push(OTP[index])
                }
                setOtp(tempArr)
                // console.log(tempArr);
            }
        }
    }
    const checkVideoCallStatus = () => {
        if (!isLoading) {
            // console.log('/////////////', Item.videoCall);
        }
    }

    const reschedule = async (Id, type) => {

        setRescheduleData(prevState => ({
            ...prevState,
            isLoading: true
        }))
        let url = config.baseURL + (type == 'doctor' ? "api-patient-doctor-reschedule-appointment" : type == 'lab' ? "api-patient-lab-reschedule-appointment" : "api-patient-reschedule-appointment");

        var data = new FormData();
        data.append("login_user_id", loggedInUserDetails.user_id);
        data.append("order_id", Id);
        data.append("service_type", type);
        if (type === 'lab') {
            data.append("task_type", rescheduleData?.set_task);
        }

        // console.log("reschedule-bodydata", data);
        return false /
            apifuntion
                .postApi(url, data)
                .then((obj) => {
                    // console.log("reschedule-response...", obj);
                    if (obj.status == true) {
                        var currentDate = new Date();
                        let min = currentDate.getMinutes() < 10 ? "0" + currentDate.getMinutes() : currentDate.getMinutes();
                        let hour = currentDate.getHours() < 10 ? "0" + currentDate.getHours() : currentDate.getHours();
                        var timcurrent = hour + ":" + min;
                        setRescheduleData(prevState => ({
                            ...prevState,
                            timcurrent_for_check: timcurrent
                        }))

                        if (obj.result.task_time != "") {

                            var names = obj.result.task_time;
                            var nameArr = names.split(",");
                            const new_time_slot = [];
                            const Arr1 = [];
                            const Arr2 = [];
                            var ar1 = false;
                            var ar2 = true

                            // console.log(
                            //     rescheduleData.check_currentdate,
                            //     rescheduleData.set_date
                            // );
                            if (obj.result.task_time != "") {
                                for (let l = 0; l < nameArr.length; l++) {
                                    if (rescheduleData.check_currentdate == rescheduleData.set_date) {
                                        // console.log(`rescheduleData.check_currentdate == rescheduleData.set_date, ${l}`);
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
                                        if (finaltime >= timcurrent) {
                                            console.log('finaltime >= rescheduleData.timcurrent_for_check', finaltime);
                                            console.log(timcurrent);
                                            new_time_slot.push({
                                                time: nameArr[l],
                                                time_status: false,
                                            });
                                            if (!ar1) {
                                                ar1 = true;
                                                ar2 = false;
                                                Arr1.push({ time: nameArr[l], time_status: false });
                                            } else {
                                                ar1 = false;
                                                ar2 = true;
                                                Arr2.push({ time: nameArr[l], time_status: false });
                                            }
                                            // console.log('???????????????????', Arr1);

                                        }
                                    } else {
                                        if (!ar1) {
                                            ar1 = true;
                                            ar2 = false;
                                            Arr1.push({ time: nameArr[l], time_status: false });
                                        } else {
                                            ar1 = false;
                                            ar2 = true;
                                            Arr2.push({ time: nameArr[l], time_status: false });
                                        }
                                        new_time_slot.push({ time: nameArr[l], time_status: false });
                                        console.log('???????????????????', Arr1);

                                    }
                                }

                            }
                            setRescheduleData(prevState => ({
                                ...prevState,
                                time_Arr: new_time_slot,
                                final_one: Arr1,
                                final_arr_two: Arr2,
                            }))

                            setTimeout(() => {
                                setRescheduleData(prevState => ({
                                    ...prevState,
                                    isLoading: false
                                }))
                            }, 500);
                            /////////////////Main If/////////////////////

                        } else {
                            setRescheduleData(prevState => ({
                                ...prevState,
                                time_Arr: [],
                                final_one: [],
                                final_arr_two: [],
                            }))

                        }

                        setRescheduleData(prevState => ({
                            ...prevState,
                            set_date: obj.result.app_date,
                            rescdule_data: obj.result,
                            check_booking: obj.result.slot_booking_id,
                            message: obj.message,
                            task_details: obj.result.task_details,

                        }))

                        setTimeout(() => {
                            setRescheduleData(prevState => ({
                                ...prevState,
                                isRescheduleModal: true
                            }))
                        }, 700);

                    } else {
                        console.log('else reschdule.....');
                        setRescheduleData(prevState => ({
                            ...prevState,
                            rescdule_data: obj.result,
                            message: obj.message,
                            // isRescheduleModal: true,

                        }))
                    }
                })
                .catch((error) => {
                    console.log("-------- error ------- " + error);
                });
    };

    const getDay = (Id) => {
        var today = new Date();
        var nextweek = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + 28
        );
        let datenew_show = today.getDate();
        var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let month_show = today.getMonth() + 1;
        let year_show = today.getFullYear();
        let show_month1 = "";
        let show_get_date = "";
        if (month_show <= 9) {
            show_month1 = "0" + month_show;
        } else {
            show_month1 = month_show;
        }
        if (datenew_show <= 9) {
            show_get_date = "0" + datenew_show;
        } else {
            show_get_date = datenew_show;
        }
        let date1_show = year_show + "-" + show_month1 + "-" + show_get_date;

        setRescheduleData(prevState => ({
            ...prevState,
            set_date: date1_show,
            check_currentdate: date1_show
        }))

        for (
            var arr = [], dt = new Date(today);
            dt <= new Date(nextweek);
            dt.setDate(dt.getDate() + 1)
        ) {
            let date_final = new Date(dt);
            let month = date_final.getMonth() + 1;
            let year = date_final.getFullYear();
            var dayName = days[date_final.getDay()];
            let final_date = date_final.getDate();
            let datenew = "";
            let show_month = "";
            if (final_date <= 9) {
                datenew = "0" + final_date;
            } else {
                datenew = final_date;
            }
            if (month <= 9) {
                show_month = "0" + month;
            } else {
                show_month = month;
            }
            let date1 = year + "-" + show_month + "-" + datenew;
            let tick = 0;
            if (date1 == date1_show) {
                tick = 1;
            }

            arr.push({ date1: date1, datenew: datenew, day: dayName, tick: tick });
        }
        setRescheduleData(prevState => ({
            ...prevState,
            date_array: arr
        }))
        // console.log("check date...", arr);
    };

    const getTimeDate = async (selectedDate, serviceType) => {

        setRescheduleData(prevState => ({
            ...prevState,
            isLoading: true
        }))
        let url = config.baseURL + (rescheduleData?.service_status == 'doctor' ? 'api-patient-doctor-next-date-time' : rescheduleData?.service_status == 'lab' ? 'api-patient-lab-next-date-time' : 'api-patient-next-date-time');

        var bodyData = new FormData();
        bodyData.append("provider_id", rescheduleData?.send_id);
        bodyData.append("date", selectedDate);
        // bodyData.append(" task_type", (rescheduleData?.service_status === 'doctor' ? 'doctorslot' : rescheduleData?.set_task));
        bodyData.append("service_type", rescheduleData?.service_status);

        // console.log(bodyData);
        // console.log(rescheduleData?.check_booking);
        console.log(serviceType, '............', rescheduleData?.set_task);

        // return;
        apifuntion.postApi(url, bodyData, 1)
            .then((obj) => {
                setRescheduleData(prevState => ({
                    ...prevState,
                    isLoading: false
                }))
                if (obj.status == true) {
                    var current = new Date();
                    var timcurrent = current.getHours() + ":" + current.getMinutes();
                    setRescheduleData(prevState => ({
                        ...prevState,
                        timcurrent_for_check: timcurrent
                    }))
                    console.log("get_time_date.response", obj.result);

                    // ---------------------------------------------------
                    if (serviceType == 'doctor' && rescheduleData?.set_task == 'online_task') {
                        console.log(serviceType, rescheduleData?.set_task);
                        if (obj.result.online_task_time != "") {
                            var names = obj.result.online_task_time;
                            var nameArr = names.split(",");

                            const new_time_slot = [];
                            const Arr1 = [];
                            const Arr2 = [];
                            if (obj.result.online_task_time != "") {
                                for (let l = 0; l < nameArr.length; l++) {
                                    if (rescheduleData?.check_currentdate == selectedDate) {
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
                                        if (finaltime >= rescheduleData?.timcurrent_for_check) {
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

                            setRescheduleData(prevState => ({
                                ...prevState,
                                time_Arr: new_time_slot,
                                final_one: Arr1,
                                final_arr_two: Arr2
                            }))
                        } else {
                            setRescheduleData(prevState => ({
                                ...prevState,
                                time_Arr: obj.result.online_task_time,
                            }))
                        }
                    }
                    // ----------------------------------------------

                    if (serviceType == 'doctor' && rescheduleData?.set_task == 'home_visit') {
                        console.log(serviceType, rescheduleData?.set_task);
                        if (obj.result.home_visit_time != "") {
                            var names = obj.result.home_visit_time;
                            var nameArr = names.split(",");

                            const new_time_slot = [];
                            const Arr1 = [];
                            const Arr2 = [];
                            if (obj.result.home_visit_time != "") {
                                for (let l = 0; l < nameArr.length; l++) {
                                    if (rescheduleData?.check_currentdate == selectedDate) {
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
                                        if (finaltime >= rescheduleData?.timcurrent_for_check) {
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

                            setRescheduleData(prevState => ({
                                ...prevState,
                                time_Arr: new_time_slot,
                                final_one: Arr1,
                                final_arr_two: Arr2
                            }))
                        } else {
                            setRescheduleData(prevState => ({
                                ...prevState,
                                time_Arr: obj.result.home_visit_time,
                            }))
                        }
                    }

                    // ----------------------------------------------

                    if (serviceType == 'lab' && (rescheduleData?.set_task == 'task_base' || rescheduleData?.set_task == 'package_base')) {
                        console.log(serviceType, rescheduleData?.set_task);
                        if (obj.result.task_time != "") {
                            var names = obj.result.task_time;
                            var nameArr = names.split(",");

                            const new_time_slot = [];
                            const Arr1 = [];
                            const Arr2 = [];
                            if (obj.result.task_time != "") {
                                for (let l = 0; l < nameArr.length; l++) {
                                    if (rescheduleData?.check_currentdate == selectedDate) {
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
                                        if (finaltime >= rescheduleData?.timcurrent_for_check) {
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

                            setRescheduleData(prevState => ({
                                ...prevState,
                                time_Arr: new_time_slot,
                                final_one: Arr1,
                                final_arr_two: Arr2
                            }))
                        } else {
                            setRescheduleData(prevState => ({
                                ...prevState,
                                time_Arr: obj.result.task_time,
                            }))
                        }
                    }

                    // ----------------------------------------------

                    if ((serviceType != 'doctor' && serviceType != 'lab') && rescheduleData?.set_task == 'task_base') {
                        console.log(serviceType, rescheduleData?.set_task);
                        console.log(serviceType, rescheduleData?.set_task);
                        if (obj.result.task_time != "") {
                            var names = obj.result.task_time;
                            var nameArr = names.split(",");

                            const new_time_slot = [];
                            const Arr1 = [];
                            const Arr2 = [];
                            if (obj.result.task_time != "") {
                                for (let l = 0; l < nameArr.length; l++) {
                                    if (rescheduleData?.check_currentdate == selectedDate) {
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
                                        if (finaltime >= rescheduleData?.timcurrent_for_check) {
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

                            setRescheduleData(prevState => ({
                                ...prevState,
                                time_Arr: new_time_slot,
                                final_one: Arr1,
                                final_arr_two: Arr2
                            }))
                        } else {
                            setRescheduleData(prevState => ({
                                ...prevState,
                                time_Arr: obj.result.task_time,
                            }))
                        }
                    }

                    // ----------------------------------------------

                    if ((serviceType != 'doctor' && serviceType != 'lab') && rescheduleData?.set_task == 'hour_base') {
                        console.log(serviceType, rescheduleData?.set_task);
                        if (obj.result.hourly_time != "") {
                            var names = obj.result.hourly_time;
                            var nameArr = names.split(",");

                            const new_time_slot = [];
                            const Arr1 = [];
                            const Arr2 = [];
                            if (obj.result.hourly_time != "") {
                                for (let l = 0; l < nameArr.length; l++) {
                                    if (rescheduleData?.check_currentdate == selectedDate) {
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
                                        if (finaltime >= rescheduleData?.timcurrent_for_check) {
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

                            setRescheduleData(prevState => ({
                                ...prevState,
                                time_Arr: new_time_slot,
                                final_one: Arr1,
                                final_arr_two: Arr2
                            }))
                        } else {
                            setRescheduleData(prevState => ({
                                ...prevState,
                                time_Arr: obj.result.hourly_time,
                            }))
                        }
                    }

                    // ----------------------------------------------------
                } else {
                    return false;
                }
            })
            .catch((error) => {
                setRescheduleData(prevState => ({
                    ...prevState,
                    isLoading: false
                }))
                console.log("-------- error ------- " + error);
            });
    };


    const check_date = (item, index) => {
        let newData = rescheduleData?.date_array;
        // console.log("new data", newData);

        for (let i = 0; i < newData.length; i++) {
            if (i == index) {
                newData[i].tick = 1;
            } else {
                newData[i].tick = 0;
            }
        }
        setRescheduleData(prevState => ({
            ...prevState,
            date_array: newData
        }))
    };

    const bookTime = async (orderId, serviceType) => {
        if (rescheduleData.time_take_data.length <= 0) {
            msgProvider.showError('Please select time');
            return false;
        }

        setRescheduleData(prevState => ({
            ...prevState,
            isScheduleagain: true
        }))

        let url = config.baseURL + (serviceType == 'doctor' ? 'api-patient-update-doctor-reschedule-appointment' : serviceType == 'lab' ? 'api-patient-update-lab-reschedule-appointment' : 'api-patient-update-reschedule-appointment')
        console.log(url);
        var bodyData = new FormData();

        bodyData.append("service_type", serviceType);
        bodyData.append("order_id", orderId);
        bodyData.append("from_date", rescheduleData?.set_date);
        bodyData.append("from_time", rescheduleData?.time_take_data);

        // console.log('bookTime-request body.......', bodyData);
        // return;
        apifuntion
            .postApi(url, bodyData)
            .then((obj) => {
                setRescheduleData(prevState => ({
                    ...prevState,
                    isScheduleagain: false
                }))
                if (obj.status == true) {
                    console.log('bookTime-response....', obj);
                    setRescheduleData(prevState => ({
                        order_id: '',
                        service_status: '',
                        send_id: '',
                        time_take_data: '',
                        time_Arr: '',
                        final_one: '',
                        final_arr_two: '',
                        set_date: '',
                        rescdule_data: '',
                        check_booking: '',
                        message: '',
                        task_details: '',
                        date_array: '',
                        set_task: '',
                        check_currentdate: '',
                        isRescheduleModal: false,
                        isScheduleagain: false
                    }))
                    setTimeout(() => {
                        msgProvider.showSuccess(obj.message);
                    }, 700);
                } else {
                    setRescheduleData(prevState => ({
                        order_id: '',
                        service_status: '',
                        send_id: '',
                        time_take_data: '',
                        time_Arr: '',
                        final_one: '',
                        final_arr_two: '',
                        set_date: '',
                        rescdule_data: '',
                        check_booking: '',
                        message: '',
                        task_details: '',
                        date_array: '',
                        set_task: '',
                        check_currentdate: '',
                        isRescheduleModal: false,
                        isScheduleagain: false
                    }))
                    setTimeout(() => {
                        msgProvider.showError(obj.message);
                        msgProvider.alert('', obj.message, false);
                    }, 700);

                    return false;
                }
            })
            .catch((error) => {
                console.log("-------- error ------- " + error);
            });
    };

    const rateProvider = async () => {
        let url = config.baseURL + "api-patient-insert-review";
        var data = new FormData();
        data.append("lgoin_user_id", loggedInUserDetails.user_id);
        data.append("service_type", Item?.provider_type);
        data.append("order_id", Item?.order_id);
        data.append("rating", ratingData.rating);
        data.append("review", ratingData.review);
        data.append("provider_id", Item?.provider_id);

        // console.log(data);
        // return;
        apifuntion
            .postApi(url, data)
            .then((obj) => {
                if (obj.status == true) {
                    setRatingData(prevState => ({
                        modalVisiblerating: false,
                        rating: 0,
                        review: ''
                    }))
                    setTimeout(() => {
                        msgProvider.showSuccess(obj.message);
                    }, 700);
                } else {
                    // if (obj.active_status == LangProvider.deactivate[languageIndex] || obj.msg[languageIndex] == LangProvider.usererr[languageIndex]) {
                    //   usernotfound.loginFirst(this.props, obj.msg[languageIndex])
                    // } else {

                    setTimeout(() => {
                        msgProvider.alert("", obj.message, false);
                    }, 700);
                    // }
                    return false;
                }
            })
            .catch((error) => {
                console.log("-------- error ------- " + error);
            });
    };
    return (

        isLoading ?
            <View style={{
                // height: vs(160),
                width: windowWidth,
                backgroundColor: Colors.White,
                paddingHorizontal: s(11),
                paddingVertical: vs(9)
            }}>

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: "100%",
                        alignSelf: "center",
                        borderBottomWidth: 1.5,
                        borderBottomColor: Colors.backgroundcolor,
                        paddingBottom: vs(5)
                    }} >
                    <SkeletonPlaceholder>
                        <SkeletonPlaceholder.Item width={(windowWidth * 25) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                    </SkeletonPlaceholder>

                    <SkeletonPlaceholder>
                        <SkeletonPlaceholder.Item width={(windowWidth * 25) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                    </SkeletonPlaceholder>
                </View>

                <View style={{
                    flexDirection: "row",
                    alignItems: 'center',
                    width: "100%",
                    alignSelf: "center",
                    borderBottomWidth: 1.5,
                    borderBottomColor: Colors.backgroundcolor,
                    marginTop: vs(7),
                    paddingBottom: vs(7)
                }}>
                    <View style={{ flex: 1.2, }}>

                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item width={(windowWidth * 30) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                        </SkeletonPlaceholder>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item width={(windowWidth * 25) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} marginTop={vs(4)} />
                        </SkeletonPlaceholder>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item width={(windowWidth * 25) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} marginTop={vs(4)} />
                        </SkeletonPlaceholder>
                    </View>

                    <View style={{ flex: 1, }}>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item width={(windowWidth * 23) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                        </SkeletonPlaceholder>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item width={(windowWidth * 18) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} marginTop={vs(4)} />
                        </SkeletonPlaceholder>
                    </View>

                    <View style={{ flex: 1, }}>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item width={(windowWidth * 23) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                        </SkeletonPlaceholder>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item width={(windowWidth * 18) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} marginTop={vs(4)} />
                        </SkeletonPlaceholder>
                    </View>
                </View>


                <View style={{
                    flexDirection: "row",
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: "100%",
                    alignSelf: "center",
                    marginTop: vs(7),
                }}>
                    <SkeletonPlaceholder>
                        <SkeletonPlaceholder.Item width={(windowWidth * 20) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} marginTop={vs(4)} />
                    </SkeletonPlaceholder>

                    <SkeletonPlaceholder>
                        <SkeletonPlaceholder.Item width={(windowWidth * 16) / 100} height={(windowWidth * 6) / 100} borderRadius={s(4)} marginTop={vs(4)} />
                    </SkeletonPlaceholder>
                </View>
            </View>
            :

            <>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        navigation.navigate(
                            "AppointmentDetails",
                            {
                                status: Item.provider_type,
                                appointment_id: Item.id,
                                send_id: Item.provider_id,
                            }
                        );
                    }}
                    style={{
                        backgroundColor: Colors.White,
                        width: '100%',
                        paddingHorizontal: s(11),
                        paddingVertical: vs(9)
                    }}>
                    {/* --------------------------- */}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: 'space-between',
                            width: "100%",
                            alignSelf: "center",
                            borderBottomWidth: 1.5,
                            borderBottomColor: Colors.backgroundcolor,
                            paddingBottom: vs(5)
                        }}>
                        {/*Status */}
                        <Text
                            style={{
                                fontSize: Font.medium,
                                fontFamily: Font.Medium,
                                color: Colors.Theme
                            }}
                        >{Item?.order_id}</Text>

                        <Text
                            style={{
                                fontSize: Font.small,
                                fontFamily: Font.Medium,
                                color: Item?.acceptance_status === 'Pending' ? Colors.Yellow : (Item?.acceptance_status === 'Completed' || Item?.acceptance_status === 'Accepted') ? Colors.Green : Colors.Red,
                                // textTransform: 'uppercase'

                            }}
                        >{Item?.acceptance_status}</Text>
                    </View>
                    {/* --------------------------- */}

                    <View style={{
                        flexDirection: "row",
                        width: "100%",
                        alignSelf: "center",
                        borderBottomWidth: 1.5,
                        borderBottomColor: Colors.backgroundcolor,
                        marginTop: vs(7),
                        paddingBottom: vs(7)
                    }}>
                        <View style={{ flex: 1.3 }}>
                            <Text
                                style={{
                                    fontSize: Font.small,
                                    fontFamily: Font.Medium,
                                    color: Colors.detailTitles,
                                    alignSelf: 'flex-start'
                                }}
                            >{Item?.dispaly_provider_type}</Text>
                            <Text
                                style={{
                                    fontSize: Font.medium,
                                    fontFamily: Font.Regular,
                                    color: Colors.detailTitles,
                                    alignSelf: 'flex-start',
                                    marginTop: vs(3)
                                }}
                            >{Item?.provider_name}</Text>
                            <Text
                                style={{
                                    fontSize: Font.small,
                                    fontFamily: Font.Regular,
                                    color: Colors.detailTitles,
                                    alignSelf: 'flex-start',
                                    marginTop: vs(3)
                                }}
                            >{Item?.speciality}</Text>
                        </View>

                        <View style={{ flex: 1, }}>
                            <Text
                                style={{
                                    fontSize: Font.small,
                                    fontFamily: Font.Medium,
                                    color: Colors.detailTitles,
                                    alignSelf: 'flex-start',
                                }}
                            >{LangProvider.Patient[languageIndex]}</Text>
                            <Text
                                style={{
                                    fontSize: Font.medium,
                                    fontFamily: Font.Regular,
                                    color: Colors.detailTitles,
                                    alignSelf: 'flex-start',
                                    marginTop: vs(3)
                                }}
                            >{Item?.patient_name}</Text>
                        </View>

                        <View style={{ flex: 1, }}>
                            <Text
                                style={{
                                    fontSize: Font.small,
                                    fontFamily: Font.Medium,
                                    color: Colors.detailTitles,
                                    alignSelf: 'flex-start',
                                }}
                            >{LangProvider.Booked[languageIndex]}</Text>
                            <Text
                                style={{
                                    fontSize: Font.medium,
                                    fontFamily: Font.Regular,
                                    color: Colors.detailTitles,
                                    alignSelf: 'flex-start',
                                    marginTop: vs(3)
                                }}
                            >{Item?.booking_date}</Text>
                        </View>

                    </View>
                    {/* --------------------------- */}

                    <View style={{
                        flexDirection: "row",
                        width: "100%",
                        alignSelf: "center",
                        borderBottomWidth: 1.5,
                        borderBottomColor: Colors.backgroundcolor,
                        marginTop: vs(7),
                        paddingBottom: vs(7)
                    }}>
                        <View style={{ flex: 1.3 }}>
                            <Text
                                style={{
                                    fontSize: Font.small,
                                    fontFamily: Font.Medium,
                                    color: Colors.detailTitles,
                                    alignSelf: 'flex-start',
                                }}
                            >{LangProvider.AppointmentDate[languageIndex]}</Text>
                            <Text
                                style={{
                                    fontSize: Font.medium,
                                    fontFamily: Font.Regular,
                                    color: Colors.detailTitles,
                                    alignSelf: 'flex-start',
                                    marginTop: vs(3)
                                }}
                            >{Item?.app_date}</Text>
                        </View>

                        <View style={{ flex: 1, }}>
                            <Text
                                style={{
                                    fontSize: Font.small,
                                    fontFamily: Font.Medium,
                                    color: Colors.detailTitles,
                                    alignSelf: 'flex-start',
                                }}
                            >{LangProvider.Time[languageIndex]}</Text>
                            <Text
                                style={{
                                    fontSize: Font.medium,
                                    fontFamily: Font.Regular,
                                    color: Colors.detailTitles,
                                    alignSelf: 'flex-start',
                                    marginTop: vs(3)
                                }}
                            >{Item?.app_time}</Text>
                        </View>

                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    fontSize: Font.small,
                                    fontFamily: Font.Medium,
                                    color: Colors.detailTitles,
                                    alignSelf: 'flex-start',
                                }}
                            >{LangProvider.Type[languageIndex]}</Text>
                            <Text
                                style={{
                                    fontSize: Font.medium,
                                    fontFamily: Font.Regular,
                                    color: Colors.detailTitles,
                                    alignSelf: 'flex-start',
                                    marginTop: vs(3)
                                }}
                            >{Item?.appointment_type}</Text>
                        </View>

                    </View>

                    {/* --------------------------- */}

                    {
                        (Item?.acceptance_status === 'Pending' || Item?.acceptance_status === 'Completed') ?
                            <View style={{
                                flexDirection: "row",
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: "100%",
                                alignSelf: "center",
                                marginTop: vs(7),
                            }}>
                                <Text
                                    style={{
                                        fontSize: Font.medium,
                                        fontFamily: Font.Regular,
                                        color: Colors.Theme,
                                    }}>{`${currency} `}
                                    <Text
                                        style={{
                                            fontSize: Font.medium,
                                            fontFamily: Font.Medium,
                                            color: Colors.Theme
                                        }}
                                    >{Item?.total_price}</Text>
                                </Text>

                                {Item?.acceptance_status === 'Pending' ?
                                    (
                                        rescheduleData.isLoading ?
                                            <View style={{
                                                paddingHorizontal: s(8),
                                                paddingVertical: vs(4),
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <SkypeIndicator color={Colors.Theme} size={20} />
                                            </View>
                                            :

                                            <TouchableOpacity
                                                onPress={() => {
                                                    reschedule(Item?.id, Item?.provider_type)
                                                    getDay()
                                                    setRescheduleData(prevState => ({
                                                        ...prevState,
                                                        send_id: Item?.provider_id,
                                                        service_status: Item?.provider_type,
                                                        order_id: Item?.id,
                                                        time_take_data: ''
                                                    }))
                                                }}
                                                activeOpacity={0.8}
                                                style={{
                                                    paddingHorizontal: s(8),
                                                    paddingVertical: vs(4),
                                                    borderWidth: 0.8,
                                                    borderColor: Colors.Green,
                                                    borderRadius: 5
                                                }} >

                                                <Text
                                                    style={{
                                                        fontSize: Font.small,
                                                        fontFamily: Font.Regular,
                                                        color: Colors.Green
                                                    }}
                                                >{LangProvider.Reschedule[languageIndex]}</Text>
                                            </TouchableOpacity>
                                    )
                                    :
                                    (Item?.acceptance_status === 'Completed' && Item.avg_rating != "" && Item.avg_rating != 0) ? (
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                            }}>
                                            <Text
                                                style={{
                                                    fontFamily: Font.Regular,
                                                    color: Colors.DarkGrey,
                                                    fontSize: Font.small,
                                                    marginRight: (windowWidth * 2) / 100,
                                                }}
                                            >
                                                {LangProvider.rated[languageIndex]}
                                            </Text>
                                            <StarRating
                                                disabled={false}
                                                fullStar={Icons.fillStar}
                                                emptyStar={Icons.outlineStar}
                                                maxStars={5}
                                                starSize={15}
                                                rating={parseInt(Item.avg_rating)}
                                            />
                                        </View>
                                    )
                                        :
                                        <TouchableOpacity
                                            onPress={() => {
                                                setRatingData(prevState => ({
                                                    ...prevState,
                                                    modalVisiblerating: true
                                                }))
                                            }}
                                            activeOpacity={0.8}
                                            style={{
                                                paddingHorizontal: s(8),
                                                paddingVertical: vs(4),
                                                backgroundColor: Colors.Yellow,
                                                borderRadius: 5,
                                                flexDirection: 'row',
                                                alignItems: 'center'
                                            }} >
                                            <SvgXml xml={whiteStar} />
                                            <Text
                                                style={{
                                                    fontSize: Font.small,
                                                    fontFamily: Font.SemiBold,
                                                    color: Colors.White,
                                                    marginLeft: s(7)
                                                }}
                                            >{LangProvider.Rate_Appointment[languageIndex]}</Text>
                                        </TouchableOpacity>


                                }

                            </View>
                            :

                            <View style={{
                                flexDirection: "row",
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: Item?.dispaly_provider_type === 'Doctor' ? '100%' : "83%",
                                marginTop: vs(7),
                            }}>
                                <View>
                                    <Text
                                        style={{
                                            fontSize: Font.medium,
                                            fontFamily: Font.Regular,
                                            color: Colors.Theme
                                        }}>{`${currency} `}
                                        <Text
                                            style={{
                                                fontSize: Font.medium,
                                                fontFamily: Font.Medium,
                                                color: Colors.Theme
                                            }}>{Item?.total_price + "   "}

                                            {
                                                Item.acceptance_status == "Rejected" &&
                                                Item.rf_text != "" && (

                                                    <Text
                                                        style={{
                                                            textAlign: "center",
                                                            color: Colors.Red,
                                                            fontFamily: Font.Medium,
                                                            fontSize: Font.xsmall,
                                                        }}>
                                                        {LangProvider.Refunded[languageIndex]}
                                                    </Text>

                                                )
                                            }
                                        </Text>
                                    </Text>
                                </View>


                                {
                                    (Item?.dispaly_provider_type != 'Doctor' && Item?.dispaly_provider_type != 'Lab') &&
                                    <View style={{ }}>
                                        {Item?.acceptance_status === 'Accepted' ?
                                            <View
                                                style={{
                                                    paddingHorizontal: s(8),
                                                    paddingVertical: vs(4),
                                                    flexDirection: 'row',
                                                    alignItems: 'center'
                                                }} >

                                                <Text
                                                    style={{
                                                        fontSize: Font.small,
                                                        fontFamily: Font.Regular,
                                                        color: Colors.Black
                                                    }}
                                                >{'OTP'}</Text>

                                                <FlatList
                                                    horizontal
                                                    data={otp}
                                                    renderItem={({ item, index }) => {
                                                        return (
                                                            <View style={{
                                                                height: 18,
                                                                width: 18,
                                                                borderRadius: 2,
                                                                backgroundColor: Colors.detailTitles,
                                                                justifyContent: 'center',
                                                                alignItems: 'center'
                                                            }}>
                                                                <Text
                                                                    style={{
                                                                        fontSize: Font.medium,
                                                                        fontFamily: Font.SemiBold,
                                                                        color: Colors.White
                                                                    }}
                                                                >{item}</Text>
                                                            </View>
                                                        )
                                                    }}
                                                    ItemSeparatorComponent={() => {
                                                        return (
                                                            <View style={{ width: s(3) }}></View>
                                                        )
                                                    }}
                                                    contentContainerStyle={{ paddingHorizontal: s(5), }}
                                                />
                                            </View>
                                            :
                                            null
                                        }
                                    </View>
                                }

                                {
                                    (Item?.dispaly_provider_type === 'Doctor' && Item.appointment_type == "Online consultation" && Item.videoCall == true) &&
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            navigation.navigate(
                                                "VideoCall",
                                                { item: Item }
                                            );
                                        }}
                                        style={{
                                            paddingHorizontal: s(8),
                                            paddingVertical: vs(4),
                                            backgroundColor: Colors.Green,
                                            borderRadius: 5,
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }} >
                                        <SvgXml xml={VideoCall} />
                                        <Text
                                            style={{
                                                fontSize: Font.small,
                                                fontFamily: Font.SemiBold,
                                                color: Colors.White,
                                                marginLeft: s(7)
                                            }}
                                        >{LangProvider.VIDEO_CALL[languageIndex]}</Text>
                                    </TouchableOpacity>
                                }

                            </View>
                    }
                </TouchableOpacity>

                {/* <RescheduleBottomSheet
                visible={rescheduleData.isRescheduleModal}
                onRequestClose={() => {
                    setRescheduleData(prevState => ({ ...prevState, isRescheduleModal: false }))
                }}
                data={rescheduleData}
            /> */}


                {/* -------------------Rate Appointment----------------- */}

                <RatingBottomSheet
                    visible={ratingData.modalVisiblerating}
                    onRequestClose={() => {
                        setRatingData(prevState => ({
                            ...prevState,
                            modalVisiblerating: false
                        }))
                    }}
                    value={ratingData.rating}
                    onSelectRating={(val) => {
                        setRatingData(prevState => ({
                            ...prevState,
                            rating: val
                        }))
                    }}
                    onChangeText={(txt) => {
                        setRatingData(prevState => ({
                            ...prevState,
                            review: txt
                        }))
                    }}
                    reviewValue={ratingData.review}
                    rateProvider={() => rateProvider()}
                />

                {/* -----------------BottomSheet---------------- */}

                <Modal
                    isVisible={rescheduleData?.isRescheduleModal}
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

                        {
                            rescheduleData?.isLoading &&
                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                // opacity: 0.8,
                                width: windowWidth,
                                height: windowHeight - 250,
                                borderRadius: 25,
                                position: 'absolute',
                                bottom: 0,
                                zIndex: 999,
                            }}>
                               <SkypeIndicator color={Colors.Theme} size={20} />
                            </View>
                        }

                        <ScrollView
                            pointerEvents={(rescheduleData.isLoading || rescheduleData.isScheduleagain) ? 'none' : 'auto'}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingBottom: (windowWidth * 7) / 100,
                                paddingTop: vs(35),
                            }}>

                            <TouchableHighlight
                                onPress={() => {
                                    setRescheduleData(prevState => ({
                                        ...prevState,
                                        isRescheduleModal: false
                                    }))
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
                                    alignSelf: 'flex-start',
                                    color: Colors.darkText

                                }}>{LangProvider.Reschedule[languageIndex]}</Text>

                            {/* ----------------------Main------------------ */}



                            <View style={{ marginTop: vs(15) }}>

                                <View
                                    style={{
                                        width: "100%",
                                    }}>
                                    {/* task booking section */}


                                    <View
                                        style={{
                                            width: "100%",
                                            alignSelf: "center",
                                        }}
                                    >
                                        <View style={{ paddingBottom: vs(9), flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text
                                                style={{
                                                    fontFamily: Font.Medium,
                                                    fontSize: Font.medium,
                                                    alignSelf: 'flex-start',
                                                    color: Colors.Theme,
                                                }} >
                                                {rescheduleData?.rescdule_data?.order_id}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontFamily: Font.Medium,
                                                    fontSize: Font.medium,
                                                    alignSelf: 'flex-start',
                                                    color: Colors.Theme,
                                                }} >
                                                {rescheduleData?.rescdule_data?.task_type}
                                            </Text>
                                        </View>

                                        <View
                                            style={[
                                                {
                                                    paddingVertical: vs(9),
                                                    borderTopWidth: 1.5,
                                                    borderColor: Colors.backgroundcolor,
                                                },
                                                rescheduleData?.task_details?.length >= 3
                                                    ? { height: (windowWidth * 40) / 100 }
                                                    : { paddingVertical: vs(5) },
                                            ]}
                                        >
                                            {rescheduleData?.rescdule_data?.slot_booking_id == "TASK_BOOKING" ? (
                                                <FlatList
                                                    data={rescheduleData?.task_details}
                                                    scrollEnabled={true}
                                                    nestedScrollEnabled={true}
                                                    renderItem={({ item, index }) => {
                                                        if ((rescheduleData?.task_details != '' && rescheduleData?.task_details != null)) {
                                                            return (
                                                                <View
                                                                    style={{
                                                                        alignItems: "center",
                                                                        width: "100%",
                                                                        alignSelf: "center",
                                                                        paddingVertical: (windowWidth * 1.7) / 100,
                                                                        flexDirection: "row",
                                                                        marginTop: (windowWidth * 0.3) / 100,
                                                                    }}>
                                                                    <Text
                                                                        style={{
                                                                            width: "70%",
                                                                            alignSelf: 'flex-start',
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
                                                    data={rescheduleData?.task_details}
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
                                                                }}>
                                                                <View
                                                                    style={{
                                                                        backgroundColor: "#0168B3",
                                                                        borderTopLeftRadius: (windowWidth * 1.2) / 100,
                                                                        borderTopRightRadius: (windowWidth * 1.2) / 100,
                                                                        width: "100%",
                                                                    }} >
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
                                                                        fontSize: Font.sregulartext_size,
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
                                                // borderBottomWidth: (windowWidth * 0.3) / 100,
                                                borderColor: Colors.gainsboro,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: Font.Medium,
                                                    fontSize: Font.name,
                                                    alignSelf: 'flex-start',
                                                }}
                                            >
                                                {LangProvider.Appointmentschedule[languageIndex]}
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
                                                        fontSize: Font.name,
                                                        marginLeft: (windowWidth * 1) / 100,
                                                    }}
                                                >
                                                    {rescheduleData?.set_date}
                                                </Text>
                                            </View>
                                        </View>



                                        <View
                                            style={{
                                                height: 2,
                                                backgroundColor: Colors.backgroundcolor,
                                                width: "100%",
                                                marginTop: (windowWidth * 2) / 100,
                                            }}
                                        />
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
                                                    fontSize: Font.subtext,
                                                    color: "#000",
                                                    alignSelf: 'flex-start',
                                                }}
                                            >
                                                {LangProvider.SelectDate[languageIndex]}
                                            </Text>

                                            <View style={{ width: "100%" }}>
                                                <FlatList
                                                    horizontal={true}
                                                    data={rescheduleData?.date_array}
                                                    showsHorizontalScrollIndicator={false}
                                                    renderItem={({ item, index }) => {
                                                        return (
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    console.log(rescheduleData?.service_status);
                                                                    setRescheduleData(prevState => ({
                                                                        ...prevState,
                                                                        set_date: item.date1,
                                                                        time_take_data: '',
                                                                    }))

                                                                    getTimeDate(item.date1, Item?.provider_type)
                                                                    check_date(item, index);
                                                                }}
                                                                style={{ width: (windowWidth * 15) / 100 }} >
                                                                <Text
                                                                    style={{
                                                                        marginRight: (windowWidth * 3) / 100,
                                                                        marginTop: (windowWidth * 3) / 100,
                                                                        backgroundColor: item.tick == 1 ? Colors.Blue : '#E5E5E5',
                                                                        color: item.tick == 1 ? Colors.White : Colors.Black,
                                                                        textAlign: "center",
                                                                        paddingVertical: (windowWidth * 2) / 100,
                                                                        fontFamily: Font.ques_fontfamily,
                                                                        fontSize: Font.sregulartext_size,
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
                                                />
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
                                                    fontSize: Font.subtext,
                                                    alignSelf: 'flex-start',
                                                }}
                                            >
                                                {LangProvider.Select_start_time[languageIndex]}
                                            </Text>

                                            {/* -----------------Time Arrays----------------- */}
                                            <ScrollView
                                                horizontal={true}
                                                showsHorizontalScrollIndicator={false}
                                            >
                                                <View style={{ width: "100%" }}>
                                                    {(rescheduleData?.time_Arr != '') ? (
                                                        <View style={{ width: "100%" }}>
                                                            <View style={{ width: "100%" }}>
                                                                <FlatList
                                                                    horizontal={true}
                                                                    showsHorizontalScrollIndicator={false}
                                                                    data={rescheduleData?.final_one}
                                                                    renderItem={({ item, index }) => {
                                                                        return (
                                                                            <TouchableOpacity
                                                                                onPress={() => {
                                                                                    setRescheduleData(prevState => ({
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
                                                                                            fontSize: Font.sregulartext_size,
                                                                                            padding: (windowWidth * 2) / 100,
                                                                                            paddingHorizontal:
                                                                                                (windowWidth * 3.3) / 100,
                                                                                        },
                                                                                        item.time ==
                                                                                            rescheduleData?.time_take_data
                                                                                            ? {
                                                                                                backgroundColor:
                                                                                                    Colors.Blue,
                                                                                                color: Colors.White,
                                                                                            }
                                                                                            : {
                                                                                                backgroundColor: '#E5E5E5',
                                                                                                color: Colors.Black,
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
                                                                    data={rescheduleData?.final_arr_two}
                                                                    renderItem={({ item, index }) => {
                                                                        return (
                                                                            <TouchableOpacity
                                                                                onPress={() => {
                                                                                    setRescheduleData(prevState => ({
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
                                                                                            fontSize: Font.sregulartext_size,
                                                                                            padding: (windowWidth * 2) / 100,
                                                                                            paddingHorizontal:
                                                                                                (windowWidth * 3.3) / 100,
                                                                                        },
                                                                                        item.time ==
                                                                                            rescheduleData?.time_take_data
                                                                                            ? {
                                                                                                backgroundColor:
                                                                                                    Colors.Blue,
                                                                                                color: Colors.White,
                                                                                            }
                                                                                            : {
                                                                                                backgroundColor: '#E5E5E5',
                                                                                                color: Colors.Black,
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
                                                            allowFontScaling={false}
                                                            style={{
                                                                fontFamily: Font.MediumItalic,
                                                                fontSize: (windowWidth * 4) / 100,
                                                                alignSelf: "center",
                                                                marginTop: (windowWidth * 3) / 100,
                                                                textAlign: "center",
                                                                marginLeft: (windowWidth * 32) / 100,
                                                            }}
                                                        >
                                                            {LangProvider.noTime[languageIndex]}
                                                        </Text>
                                                    )}
                                                </View>
                                            </ScrollView>
                                        </View>

                                        <Button
                                            text={LangProvider.SAVECHANGERESCHEDULE[languageIndex]}
                                            onPress={() => bookTime(Item?.id, Item?.provider_type)}
                                            btnStyle={{ marginTop: vs(25) }}
                                            onLoading={rescheduleData.isScheduleagain}
                                        />


                                    </View>
                                </View>
                            </View>

                        </ScrollView>
                    </View>

                </Modal>

            </>

    );
}

const styles = StyleSheet.create({

    modalContainer: {
        width: windowWidth,
        height: windowHeight - 250,
        backgroundColor: Colors.White,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingHorizontal: s(13),
        position: 'absolute',
        bottom: 0,
        zIndex: 999,
    },
    closeContainer: {
        height: s(35),
        width: s(35),
        borderRadius: s(50),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: vs(20),
        right: 0,
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

export default AppointmentContainer;