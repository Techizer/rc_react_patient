import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet, Modal, TouchableHighlight, Keyboard, Alert, Platform, FlatList, ActivityIndicator, } from "react-native";
import Toast from 'react-native-toast-message'
import { Colors, Font } from "../Provider/Colorsfont";
import {
    windowWidth, LangProvider, config, Icons, Button, apifuntion, msgProvider, windowHeight, ScreenHeader,
} from "../Provider/Utils/Utils";
import { Cross, dummyUser, Edit } from "../Icons/Index";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import SearchInput from "./SearchInput";
import Coupon from "./Coupon";




const Coupons = ({
    visible,
    onRequestClose,
    details
}) => {

    const { loggedInUserDetails, languageIndex, contentAlign, appLanguage } = useSelector(state => state.StorageReducer)
    const dispatch = useDispatch()
    const navigation = useNavigation();

    const insets = useSafeAreaInsets()


    const [data, setData] = useState({
        coupons: [],
        filteredCupons: [],
        searchCoupon: "",
        isSearch: false,
        isApply: false,
        languageIndex: appLanguage == 'ar' ? 1 : 0,
    })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (visible) {
            getCouponsList()
        }
    }, [visible])

    useEffect(() => {
        if (data.searchCoupon) {
            setState({ isSearch: true })
            setIsLoading(true)
            clearTimeout(timeoutId);

            const timeoutId = setTimeout(() => {
                const filteredArray = data.coupons.filter(item =>
                (
                    item.ccname && item.ccname.toLowerCase().includes(data.searchCoupon.toLowerCase())

                )
                );
                setState({ filteredCupons: filteredArray });
                setIsLoading(false)
                setState({ isSearch: false })

            }, 300);
        }
    }, [data.searchCoupon]);


    const setState = (payload) => {
        setData(prev => ({ ...prev, ...payload }))
    }

    const resetState = () => {

    }

    const getCouponsList = async () => {
        let url =
            config.baseURL + "api-list-coupon"

        var data = new FormData();


        data.append("provider_type", details.provider);
        data.append("country", details.country);
        data.append("task_type", details.task);

        apifuntion.postApi(url, data, 1).then((res) => {
            // console.log("getCouponsList-response ", res)
            if (res.status == true) {
                setState({ coupons: res.result })

            }
        }).catch((error) => {
            setProvidersData(prevState => ({
                ...prevState,
                coupons: [],
                isLoading: false
            }))
            console.log("getCouponsList-error ------- " + error);
        }).finally(() => {
            setIsLoading(false)
        })
    };

    return (




            <Modal
                animationType='slide'
                visible={visible}
                transparent
                presentationStyle='overFullScreen'
            >


                <View style={styles.mainContainer}>



                    <View style={styles.modalContainer}>



                        <ScreenHeader
                            title={LangProvider.Coupons[languageIndex]}
                            navigation={navigation}
                            onBackPress={() => onRequestClose()}
                            leftIcon
                        />


                        <SearchInput
                            containerStyle={{ backgroundColor: Colors.Highlight }}
                            placeholder={LangProvider.SearchCoupon[languageIndex]}
                            onChangeText={(val) => {
                                setData(prevState => ({
                                    ...prevState,
                                    searchCoupon: val
                                }))
                            }}
                            value={data.searchCoupon}
                            onSubmitEditing={() => {
                                Keyboard.dismiss();
                            }}
                            onPressSearch={() => getCouponsList(data.searchCoupon)}
                            onCrossPress={() => {
                                setData(prevState => ({
                                    ...prevState,
                                    isSearch: false,
                                    searchCoupon: '',
                                }))
                                getCouponsList(null)
                            }}
                            isSearch={data.searchCoupon}
                            onFilterPress={() => {

                            }}
                        />

                        <Toast />
                        {
                            isLoading ?
                                <ActivityIndicator size={'small'} color={Colors.Theme} style={{ marginTop: vs(140) }} />
                                :
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={!!data.searchCoupon ? data.filteredCupons : data.coupons}
                                    keyExtractor={(item, index) => `coupon ${item.ccode}`}
                                    contentContainerStyle={{ paddingBottom: (windowWidth * 15) / 100, }}
                                    ListEmptyComponent={() => {
                                        if (!data.isSearch && !isLoading) {
                                            return (
                                                <View style={{ marginTop: vs(140), alignSelf: 'center', paddingHorizontal: '10%' }}>
                                                    <Text style={{
                                                        fontSize: Font.xlarge,
                                                        fontFamily: Font.Regular,
                                                        color: Colors.darkText,
                                                        textAlign: 'center'
                                                    }}>{'No Coupons found'}</Text>
                                                </View>
                                            )
                                        }
                                        return null
                                    }}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <Coupon
                                                Item={item}
                                                details={details}
                                                showCart={() => {
                                                    onRequestClose()
                                                }}
                                            />
                                        );
                                    }}
                                />
                        }

                    </View>

                </View>

            </Modal>


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
        height: windowHeight,
        backgroundColor: Colors.White,
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
    viewWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)'
    },

});

export default Coupons;


