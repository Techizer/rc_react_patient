import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, LocaleConfig, CalendarList } from 'react-native-calendars';

import { View, StyleSheet, Platform, Text, TouchableOpacity, Modal, FlatList, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { Colors, Font } from '../Provider/Colorsfont';
import { windowHeight, windowWidth } from '../Provider/Utils/Utils';
import { SvgXml } from "react-native-svg";
import { CrossWhite, Tick, leftArrow } from "../Icons/Index";
import { setCustomBooking, setIsMultiBooking } from "../Redux/Actions";
import SwipableModal from "../modalViews/SwipableModal";
import BookingSlots from "./BookingSlots";
import moment from "moment";
import { s, vs } from "react-native-size-matters";
import useBooking from "../APIs/useBooking";


const CustomRepeatBooking = ({
    onClose = () => { },
    onReset = () => { }

}) => {


    const { customBookingDates } = useSelector(state => state.StorageReducer)

    const { getTimeSlotAvailability } = useBooking();
    const [selectedDate, setSelectedDate] = useState('')
    const [isMultiple, setIsMultiple] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();
    const sheetRef = useRef(null)

    const frequency = [
        {
            id: '1',
            value: 'Daily'
        },
        {
            id: '2',
            value: 'Weekly'
        },
        {
            id: '3',
            value: 'Monthly'
        }
    ]

    const Slots = [
        {
            id: '1',
            value: '7 Slots'
        },
        {
            id: '2',
            value: '3 Slots'
        },
        {
            id: '3',
            value: '2 Slots'
        }
    ]

    const styles = useMemo(() => {
        return StyleSheet.create({
            mainContainer: {
                width: windowWidth,
                height: windowHeight,
                backgroundColor: Colors.light,
                zIndex: 9999,
                paddingBottom: windowHeight / 4

            },
            header: {
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                height: windowHeight / 9,
                backgroundColor: Colors.Theme,
                paddingTop: insets.top - 15
            },
            contentContainer: {
                flex: 1,
                paddingBottom: Platform.OS == 'ios' ? insets.bottom + (155) : insets.bottom - (30),
            },

            title: {
                color: Colors.White,
                fontSize: (16),
                fontFamily: Font.Medium,
                letterSpacing: 0.32
            },
            monthTitle: {
                color: Colors.detailTitles,
                fontSize: (14),
                fontFamily: Font.Regular,
            },
            insCon: {
                paddingHorizontal: 15,
                paddingVertical: 15,
                backgroundColor: Colors.backgroundcolor
            },
            insText: {
                color: Colors.precautionText,
                fontSize: (14),
                fontFamily: Font.Regular,
            },
            desc: {
                color: Colors.detailTitles,
                fontSize: (14),
                fontFamily: Font.Regular,
            },
            dayContainer: {
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
                borderWidth: 1,
                borderColor: 'transparent',
            },
            highlightedDay: {
                backgroundColor: 'yellow',
                borderColor: 'orange',
            },
            freqCon: {
                paddingVertical: vs(12),
                backgroundColor: Colors.White,
            },
            freqText: {
                color: Colors.Blue,
                fontSize: (14),
                fontFamily: Font.SemiBold,
            },
        });
    }, [])

    const getAvailabilityForEachDate = async () => {
        try {
            const result = await getTimeSlotAvailability();
            // console.log(`getAvailabilityForEachDate ~ response`, result);
            const existingObject = {
                customBookingDates: {
                    ...customBookingDates
                }
            }
            result.forEach(resultItem => {
                const { selectedDate, availability } = resultItem;

                const existingItem = customBookingDates[selectedDate];
                if (existingItem && availability) {
                    existingObject.customBookingDates[selectedDate] = {
                        ...existingObject.customBookingDates[selectedDate],
                        selected: true,
                        marked: true,
                        dotColor: Colors.White,
                        customStyles: {
                            container: {
                                height: 40,
                                width: 46,
                                borderRadius: 0,
                                backgroundColor: Colors.Theme
                            },
                        }
                    };
                } else {
                    existingObject.customBookingDates[selectedDate] = {
                        ...existingObject.customBookingDates[selectedDate],
                        customStyles: {
                            container: {
                                height: 40,
                                width: 46,
                                borderRadius: 0,
                                borderWidth: 1.6,
                                borderColor: 'red'
                            },
                        }
                    };
                }
            });
            dispatch(setCustomBooking({
                ...existingObject.customBookingDates
            }))
        } catch (error) {
            console.log(`getAvailabilityForEachDate ~ error`, error);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (customBookingDates) {
            getAvailabilityForEachDate()
            console.log('../././././.', customBookingDates);
            // const keys = Object.keys(customBookingDates);

            // if (keys.length > 1) {
            //     console.log('There are more than 1 selected slots');
            //     setIsMultiple(true);
            // } else {
            //     console.log('There is 1 selected slot');
            // }
        }
    }, [customBookingDates])


    const frequencyandSlotSelection = () => {
        return (
            <View style={{
                backgroundColor: Colors.Highlight,
                borderRadius: 6,
                paddingHorizontal: 6,
                paddingVertical: 7,
                position: 'absolute',
                top: 0,
                zIndex: 9999,
                right: s(90)
            }}>
                {
                    frequency.map((item, index) => {
                        return (
                            <View style={{
                                borderBottomWidth: 1,
                                borderBottomColor: Colors.Border,

                            }} >
                                <Text>{item.value}</Text>
                            </View>
                        )
                    })
                }
            </View>
        )
    }
    const monthHeader = (date) => {
        // console.log({ date: moment.utc(date).format('MMMM YYYY') });
        const monthName = new Date(date).toLocaleString('default', { month: 'long' });
        const year = new Date(date).getFullYear();
        return (

            <View style={{ width: '100%', alignItems: 'flex-start' }}>
                <Text style={styles.monthTitle}>{`${monthName} ${year}`}</Text>
            </View>

        );
    };


    const renderCustomDay = ({ date, state }) => {
        console.log({ state });
        const isHighlighted = state === 'selected';
        const customText = 'hehe';

        return (
            <View>
                <Text>{String(date.day)}</Text>
                {isHighlighted && <Text style={styles.customText}>{customText}</Text>}
            </View>
        );
    };

    const customStyles = {
        container: {
            height: 40,
            width: 46,
            borderRadius: 0,
            backgroundColor: (customBookingDates && customBookingDates[selectedDate]?.time) ? Colors.Theme : Colors.Highlight,
            // justifyContent: 'center'
        },
    }

    return (

        <>
            <View style={[styles.mainContainer]}>

                <View style={styles.header}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            dispatch(setCustomBooking(null))
                            dispatch(setIsMultiBooking(false))
                            onClose()
                            onReset()
                        }}
                        style={{
                            height: '100%',
                            width: '15%',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <SvgXml xml={CrossWhite} />
                    </TouchableOpacity>

                    <View style={{
                        height: '100%',
                        width: '70%',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={styles.title} >{'Custom Repeat Booking'}</Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            if (isMultiple) {
                                dispatch(setIsMultiBooking(true))
                                onClose()
                            }
                        }}
                        activeOpacity={0.7}
                        style={{
                            height: '100%',
                            width: '15%',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        {
                            isMultiple &&
                            <SvgXml xml={Tick} />

                        }
                    </TouchableOpacity>

                </View>

                {
                    isLoading ?
                        <View style={{
                            height: windowHeight,
                            width: windowWidth,
                            backgroundColor: 'transparent',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 99999
                        }} >
                            <ActivityIndicator size={'small'} color={Colors.Theme} />
                        </View>
                        :
                        <>


                            <View style={styles.insCon}>
                                <Text style={styles.insText} >{`Booking will occur based on selected dates as per the calendar below`}</Text>
                            </View>

                            <View style={styles.freqCon}>

                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    borderBottomWidth: 1,
                                    borderBottomColor: Colors.Border,
                                    paddingBottom: vs(7),
                                    marginLeft: s(15),
                                    paddingRight: s(15),
                                }}>
                                    <Text style={styles.insText} >{`Repeat Frequency`}</Text>
                                    <View style={{ width: vs(55), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View>
                                            <SvgXml xml={leftArrow} style={{ transform: [{ rotate: '90deg' }] }} />
                                            <SvgXml xml={leftArrow} style={{ marginTop: vs(1), transform: [{ rotate: '-90deg' }] }} />
                                        </View>
                                        <Text style={styles.freqText} >{`Weekly`}</Text>
                                    </View>

                                    {frequencyandSlotSelection()}
                                </View>
                                {/* --------------------------------- */}
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingTop: vs(7),
                                    marginLeft: s(15),
                                    paddingRight: s(15),
                                }}>
                                    <Text style={styles.insText} >{`Max. Repeat Slots`}</Text>
                                    <View style={{ width: vs(55), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View>
                                            <SvgXml xml={leftArrow} style={{ transform: [{ rotate: '90deg' }] }} />
                                            <SvgXml xml={leftArrow} style={{ marginTop: vs(1), transform: [{ rotate: '-90deg' }] }} />
                                        </View>
                                        <Text style={styles.freqText} >{`3 Slots`}</Text>
                                    </View>
                                </View>

                            </View>

                            <View style={{ width: '100%', height: vs(7), backgroundColor: Colors.backgroundcolor }} />

                            <View style={{ marginTop: vs(10) }}>
                                <CalendarList
                                    current={moment().format('YYYY-MM-DD')}
                                    minDate={moment().format('YYYY-MM-DD')}
                                    pastScrollRange={12}
                                    disablePastScroll={true}
                                    futureScrollRange={12}
                                    horizontal={false} // Set to true for horizontal mode, false for vertical mode
                                    // pagingEnabled={true}
                                    onDayPress={(day) => {
                                        // console.log('selected day', day);
                                        setSelectedDate(day.dateString)
                                        setTimeout(() => {
                                            sheetRef.current.open()
                                        }, 300);
                                        // dispatch(setCustomBooking({
                                        //     ...customBookingDates,
                                        //     [day.dateString]: {
                                        //         selected: true,
                                        //         marked: true,
                                        //         dotColor: Colors.White,
                                        //         time: '',
                                        //         customStyles: customStyles
                                        //     }
                                        // }))
                                    }}
                                    markedDates={customBookingDates}
                                    renderHeader={(date) => monthHeader(date)}
                                    // dayComponent={({ date, state }) => renderCustomDay({ date, state })}
                                    calendarHeight={315}
                                    markingType={'custom'}

                                    marking={{
                                        // selected: true,
                                        // marked: true,
                                        // customContainerStyle: {
                                        //     height: 20,
                                        //     width: 20,
                                        //     backgroundColor: Colors.Theme
                                        // },
                                        // customStyles: {
                                        //     container: {
                                        //         height: 40,
                                        //         width: 46,
                                        //         borderRadius: 0
                                        //     }
                                        // }
                                    }}
                                />
                            </View>
                        </>
                }

            </View>

            <SwipableModal
                sheetRef={sheetRef}
                height={235}
                onClose={() => sheetRef.current.close()}
            >
                <BookingSlots
                    selectedDate={selectedDate}
                    onClose={() => sheetRef.current.close()}
                />
            </SwipableModal>
        </>

    );
};

export default CustomRepeatBooking;