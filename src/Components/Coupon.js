import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet, Modal, TouchableHighlight, Keyboard, Alert, Platform, FlatList, ActivityIndicator, } from "react-native";
import Toast from 'react-native-toast-message'
import { Colors, Font } from "../Provider/Colorsfont";
import {
    windowWidth, config, apifuntion, msgProvider, windowHeight,
} from "../Provider/Utils/Utils";
import { s, vs } from "react-native-size-matters";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";




const Coupon = ({
    Item,
    details,
    showCart=()=>{}
}) => {

    const [isApply, setIsApply] = useState(false)

    const ApplyCoupon = async (couponId) => {
        setIsApply(true)

        let url =
            config.baseURL + "api-apply-coupon"

        var data = new FormData();


        data.append("service_type", details.provider);
        data.append("carttotal", details.total);
        data.append("subtotal", details.subTotal);
        data.append("couponcodeid", couponId);
        data.append("userid", details.userId);
        data.append("cartid", details.cartId);

        console.log(data._parts);
        apifuntion.postApi(url, data, 1).then((res) => {
            setIsApply(false)
            console.log("apply-coupon-response ", res)
            if (res.status == true) {
                msgProvider.showSuccess('Coupon applied successfully!')
                showCart()
            } else {
                msgProvider.showError(res?.message)
            }
        }).catch((error) => {
            setIsApply(false)
            msgProvider.showError(error?.message)
            console.log("apply-coupon-error ------- " + error);
        })
    };

    return (
        <View style={{ paddingHorizontal: s(16), borderBottomWidth: 1.3, paddingVertical: vs(20), borderBottomColor: Colors.Highlight }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', }}>
                <Text style={{
                    fontSize: Font.xxlarge,
                    fontFamily: Font.SemiBold,
                    color: Colors.darkText,
                    textAlign: 'center'
                }}>{Item.ccname}</Text>

                <TouchableOpacity
                    disabled={isApply}
                    onPress={() => {
                        ApplyCoupon(Item.id)
                    }}
                    activeOpacity={0.6}
                    style={{
                        height: 25,
                    }}>
                    {
                        isApply ?
                            <ActivityIndicator size={'small'} color={Colors.Theme} />
                            :
                            <Text style={{
                                fontSize: Font.xlarge,
                                fontFamily: Font.Regular,
                                color: Colors.Theme,
                                textAlign: 'center'
                            }}>{'Apply'}</Text>
                    }
                </TouchableOpacity>

            </View>

            <Text style={{
                fontSize: Font.xlarge,
                fontFamily: Font.Regular,
                color: Colors.darkText,
                marginTop: vs(10)
            }}>{Item.ccdescription}</Text>

            <View style={{ marginTop: vs(5) }}>
                <Text style={{
                    fontSize: Font.xlarge,
                    fontFamily: Font.Regular,
                    color: Colors.lightGrey,
                }}>{'Coupon Code  '}
                    <Text style={{
                        fontSize: Font.xlarge,
                        fontFamily: Font.Regular,
                        color: Colors.darkText,
                    }}>{Item.ccode}</Text>
                </Text>
            </View>

            <View style={{ marginTop: vs(5) }}>
                <Text style={{
                    fontSize: Font.xlarge,
                    fontFamily: Font.Regular,
                    color: Colors.lightGrey,
                }}>{'Expires:  '}
                    <Text style={{
                        fontSize: Font.xlarge,
                        fontFamily: Font.Regular,
                        color: Colors.darkText,
                    }}>{Item.cedate}</Text>
                </Text>
            </View>


        </View>
    )
}


export default Coupon;


