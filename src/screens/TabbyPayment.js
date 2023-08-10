import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore'
import { useDispatch, useSelector } from 'react-redux';
import { TabbyPaymentWebView } from 'tabby-react-native-sdk';

import { apifuntion } from '../Provider/APIProvider';
import { config } from '../Provider/configProvider';
import { msgProvider } from '../Provider/messageProvider';
import { CartTime, TabbyPaymentStatus } from '../Redux/Actions';

const TabbyPayment = ({ navigation, route }) => {

    const { loggedInUserDetails } = useSelector(state => state.StorageReducer)
    const dispatch = useDispatch()
    const { top, bottom: paddingBottom } = useSafeAreaInsets();
    const { url, serviceType, cartId, transactionId, capturePayment, newRoom, cartTime } = route.params;

    // useFocusEffect(
    //     React.useCallback(() => {
    //         dispatch(CartTime(cartTime))
    //     }, [])
    //   )
    const back = () => {
        navigation.pop();
    };


    const CapturePayment = async () => {
        // console.log('././././././././././././.', capturePayment);
        let url = `https://api.tabby.ai/api/v1/payments/${transactionId}/captures`

        fetch(url, {
            method: "POST",
            headers: {
                'Authorization': `Bearer sk_test_97326f18-c970-46f3-83e2-a23799e60df2`,
                'Accept': "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(capturePayment),
        }).then((response) => {
            // console.log(response.status);
            return response.json()
        }).then((res) => {
            // console.log('CapturePayment-res', res);
        }).catch((error) => {
            console.log("CapturePayment-error", error);
        }).finally(() => {
            WebHooks()
        })
    };

    const WebHooks = async () => {
        let url = `https://api.tabby.ai/api/v1/webhooks`
        const body = {
            url: "http://example.com",
            is_test: true,
            header: {
                title: "string",
                value: "string"
            }
        }

        fetch(url, {
            method: "POST",
            headers: {
                'Authorization': `Bearer sk_test_97326f18-c970-46f3-83e2-a23799e60df2`,
                'Accept': "application/json",
                "Content-Type": "application/json",
                'X-Merchant-Code': loggedInUserDetails?.currency_symbol === 'AED' ? 'rootscareuae' : 'rootscare'
            },
            body: JSON.stringify(body),
        }).then((response) => {
            console.log(response.status);
            return response.json()
        }).then((res) => {
            console.log('WebHooks-res', res);
        }).catch((error) => {
            console.log("WebHooks-error", error);
        }).finally(() => {
            TabbyPayment()
        })
    };

    const TabbyPayment = async () => {
        let url = config.baseURL + "api-patient-insert-appointment";
        var data = new FormData();

        data.append("service_type", serviceType);
        data.append("login_user_id", loggedInUserDetails?.user_id);
        data.append("cart_id", cartId);
        data.append("trid", transactionId);

        console.log('tabby request data', data);
        apifuntion
            .postApi(url, data, 1)
            .then((obj) => {
                if (obj.status == true) {
                    // console.log("obj", obj);
                    dispatch(TabbyPaymentStatus(true))
                    firestore().collection(`Chats-${config.mode}`).doc(newRoom.MessageRoomDetails.ID).set(newRoom).finally(() => {
                        setTimeout(() => {
                            navigation.pop();
                        }, 1000);
                    })
                } else {
                    dispatch(TabbyPaymentStatus(false))
                    msgProvider.showError('Error in capturing payment')
                    setTimeout(() => {
                        navigation.pop();
                    }, 1500);
                    return false;
                }
            })
            .catch((error) => {
                console.log("TabbyPayment-error ------- " + error);
                dispatch(TabbyPaymentStatus(false))
                setTimeout(() => {
                    navigation.pop();
                }, 1500);
            });
    };

    const parseMessage = (msg) => {
        console.log({ msg });
        if (msg === 'close' || msg === 'rejected') {
            msgProvider.showError('⛔️ You cancelled checkout process')
            dispatch(TabbyPaymentStatus(false))
            navigation.pop();
        }
        if (msg === 'authorized') {
            CapturePayment()
            msgProvider.showSuccess('🎉 Payment done successfully')

        }
    };

    return (
        <View
            style={{ flex: 1, paddingTop: top || 12, paddingBottom, }}>
            <TabbyPaymentWebView onBack={back} url={url} onResult={parseMessage} />
        </View>
    );
};

export default TabbyPayment;

