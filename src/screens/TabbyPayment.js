
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { TabbyPaymentWebView } from 'tabby-react-native-sdk';
import { apifuntion } from '../Provider/APIProvider';
import { config } from '../Provider/configProvider';
import { msgProvider } from '../Provider/messageProvider';
import { TabbyPaymentStatus } from '../Redux/Actions';

const TabbyPayment = ({ navigation, route }) => {

    const { loggedInUserDetails } = useSelector(state => state.StorageReducer)
    const dispatch = useDispatch()
    const { top, bottom: paddingBottom } = useSafeAreaInsets();
    const { url, serviceType, cartId, transactionId } = route.params;

    const back = () => {
        navigation.pop();
    };

    const TabbyPayment = async () => {
        let url = config.baseURL + "api-patient-insert-appointment";
        var data = new FormData();

        data.append("service_type", serviceType);
        data.append("login_user_id", loggedInUserDetails.user_id);
        data.append("cart_id", cartId);
        data.append("trid", transactionId);

        console.log('tabby request data', data);
        apifuntion
            .postApi(url, data, 1)
            .then((obj) => {
                if (obj.status == true) {
                    // console.log("obj", obj);
                    dispatch(TabbyPaymentStatus(true))
                    setTimeout(() => {
                        navigation.pop();
                    }, 1500);

                } else {
                    dispatch(TabbyPaymentStatus(false))
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

    const parseMessage = (msg: WebViewResult) => {
        console.log({ msg });
        if (msg === 'close' || msg === 'rejected') {
            msgProvider.showError('⛔️ You cancelled checkout process')
            // handleCancel();
            navigation.pop();
        }
        if (msg === 'authorized') {
            TabbyPayment()
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
