import {
    Modal,
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { StickyButton } from "../Components/StickyButton";
import { useDispatch, useSelector } from "react-redux";
import { s, vs } from "react-native-size-matters";
import { LangProvider } from "../Provider/Language_provider";
import { Icons } from "../Icons/Index";
import { Colors, Font } from "../Provider/Colorsfont";
import { windowWidth } from "../Provider/Utils/Utils";
import useBooking from "../APIs/useBooking";
import { FlatList } from "react-native";
import { setCustomBooking } from "../Redux/Actions";
import { SkypeIndicator } from "react-native-indicators";

const BookingSlots = ({
    selectedDate,
    onClose
}) => {

    const { customBookingDates, appLanguage, deviceToken, deviceType, contentAlign, languageIndex } = useSelector(state => state.StorageReducer)

    const [data, setData] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const { getTimeSlots } = useBooking();

    const dispatch = useDispatch();

    const customStyles = {
        container: {
            height: 40,
            width: 46,
            borderRadius: 0,
            backgroundColor: Colors.Theme
            // justifyContent: 'center'
        },
    }


    useEffect(() => {
        const getTime = async () => {
            try {
                const result = await getTimeSlots(selectedDate)
                // console.log({ result });
                if (result) {
                    const { newTimeSlot, Arr1, Arr2 } = result;
                    setData({
                        newTimeSlot,
                        Arr1,
                        Arr2
                    })
                }
                setIsLoading(false)

            } catch (error) {
                setIsLoading(false)
                console.log('getTime-error', error);
            }


        }
        getTime()
    }, [])

    return (
        <>
            <View style={{}}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: "100%",
                        alignSelf: "center",
                        paddingHorizontal: s(11)
                    }}
                >
                    <Text
                        style={{
                            fontFamily: Font.Medium,
                            fontSize: Font.medium,
                            width: "65%",
                            textAlign: 'left',
                            color: Colors.detailTitles
                        }}
                    >
                        {LangProvider.Appointmentschedule[languageIndex]}
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            width: "35%",
                            justifyContent: "flex-end",
                        }}
                    >
                        <View style={{ width: "20%", alignSelf: "center" }}>
                            <Image
                                style={{
                                    width: (windowWidth * 5) / 100,
                                    height: (windowWidth * 5) / 100,
                                    alignSelf: "center",
                                }}
                                source={Icons.Calendar}
                            />
                        </View>

                        <Text
                            style={{
                                color: Colors.Theme,
                                fontFamily: Font.Medium,
                                fontSize: Font.medium,
                                alignSelf: "center",
                                marginLeft: (windowWidth * 1) / 100,
                                textAlign: "right",
                            }}
                        >
                            {selectedDate}
                        </Text>
                    </View>
                </View>

                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={{ width: "100%", alignItems: "center" }}>
                        {
                            data && data?.newTimeSlot.length > 0 ?
                                (
                                    <View
                                        style={{
                                            width: "100%",
                                            alignItems: "center",
                                        }}
                                    >
                                        <View style={{ width: "100%", flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 }}>
                                            {
                                                data.Arr1.map((item, index) => {
                                                    return (
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                setSelectedSlot(item.time)
                                                            }}>
                                                            <Text
                                                                style={[
                                                                    {
                                                                        marginLeft: index == 0 ? 0 : 10,
                                                                        marginTop: (windowWidth * 3) / 100,
                                                                        fontFamily: Font.Regular,
                                                                        fontSize: Font.small,
                                                                        padding: (windowWidth * 2) / 100,
                                                                        paddingHorizontal: (windowWidth * 3.3) / 100,
                                                                        backgroundColor: selectedSlot == item.time ? Colors.Theme : '#E5E5E5',
                                                                        color: selectedSlot == item.time ? Colors.White : Colors.Black,
                                                                    },

                                                                ]}
                                                            >
                                                                {item.time}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )
                                                })
                                            }
                                        </View>

                                        <View style={{ width: "100%", flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 }}>
                                            {
                                                data.Arr2.map((item, index) => {
                                                    return (
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                setSelectedSlot(item.time)
                                                            }}
                                                        >
                                                            <Text
                                                                style={[
                                                                    {
                                                                        marginLeft: index == 0 ? 0 : 10,
                                                                        marginTop: (windowWidth * 3) / 100,
                                                                        fontFamily: Font.Regular,
                                                                        fontSize: Font.small,
                                                                        padding: (windowWidth * 2) / 100,
                                                                        paddingHorizontal: (windowWidth * 3.3) / 100,
                                                                        backgroundColor: selectedSlot == item.time ? Colors.Theme : '#E5E5E5',
                                                                        color: selectedSlot == item.time ? Colors.White : Colors.Black,
                                                                    },

                                                                ]}
                                                            >
                                                                {item.time}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                                )
                                :
                                isLoading ?
                                    (
                                        <View style={{ width: windowWidth, paddingVertical: (windowWidth * 10) / 100, }}>
                                            <SkypeIndicator color={Colors.Theme} size={20} />
                                        </View>
                                    )
                                    : (
                                        <Text
                                            style={{
                                                fontFamily: Font.MediumItalic,
                                                fontSize: Font.medium,
                                                alignSelf: "center",
                                                paddingVertical: (windowWidth * 10) / 100,
                                                textAlign: "center",
                                            }}
                                        >
                                            {LangProvider.noTime[languageIndex]}
                                        </Text>
                                    )
                        }
                    </View>
                </ScrollView>


            </View >

            {
                (!isLoading && data.newTimeSlot.length > 0 && selectedSlot != '') &&
                <StickyButton
                    text={'SAVE APPOINTMENT'}
                    container={{ width: '90%', alignSelf: 'center' }}
                    onPress={() => {
                        dispatch(setCustomBooking(
                            {
                                ...customBookingDates,
                                [selectedDate]: {
                                    selected: true,
                                    marked: true,
                                    dotColor: Colors.White,
                                    time: selectedSlot,
                                    customStyles: customStyles
                                },
                            }
                        ))
                        onClose()
                    }}
                />
            }
        </>
    );

}

export default BookingSlots;
