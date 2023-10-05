
import React, { Component, useEffect, useState } from "react";
import {
  Platform,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  FlatList,
  StyleSheet,
  AppState,
  BackHandler
} from "react-native";
import { TabbyCheckoutSnippet, } from 'tabby-react-native-sdk';
import { SkypeIndicator } from "react-native-indicators";
import { useFocusEffect } from '@react-navigation/native';
import {
  Colors,
  Font,
  windowHeight,
  msgProvider,
  config,
  windowWidth,
  Icons,
  apifuntion,
  LangProvider,
  ScreenHeader,
  Button
} from "../Provider/Utils/Utils";
import { WebView } from "react-native-webview";
import firestore from '@react-native-firebase/firestore'
import { Tabby, Payment as TabbyPaymentData, TabbyCheckoutPayload, TabbyPaymentWebView } from "tabby-react-native-sdk";
import RNGoSell from "@tap-payments/gosell-sdk-react-native";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import { Clock, clockBlue, Cross, _Cross, Coupon, rightArrow, leftArrow } from "../Icons/Index";
import SuccessPopup from "../Components/SuccessPopup";
import moment from "moment";
import SimpleToast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import { CartTime, TabbyPaymentStatus, TodaysAppointments, TodaysConsultations, TodaysLabTests } from "../Redux/Actions";
import LoadingSkeleton from "../Components/LoadingSkeleton";
import PaymentOptionBottomSheet from "../Components/PaymentOptionBottomSheet";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NoInternet from "../Components/NoInternet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Message, MessageRoom } from "../Schemas/MessageRoomSchema";
import Coupons from "../Components/Coupons";


let startTime = null
let interval = null
const { Languages, PaymentTypes, AllowedCadTypes, TrxMode, SDKMode } =
  RNGoSell.goSellSDKModels;

const appCredentials = {
  production_secrete_key:
    Platform.OS == "ios"
      ? "sk_live_Ectf8odVHCWTl3ymhz9IM6vD"
      : "sk_live_6GPzSurWAK9ng1C7yUq8wOeh",
      // ? "sk_test_wvbqQkEMJCSXTDrt9Pay2pFg"
      // : "sk_test_KOfdbVzDXW7JreslyPL2g1nN",
  language: Languages.EN,
  sandbox_secrete_key:
    Platform.OS == "ios"
      ? "sk_test_wvbqQkEMJCSXTDrt9Pay2pFg"
      : "sk_test_KOfdbVzDXW7JreslyPL2g1nN",
  bundleID: Platform.OS == "ios" ? "com.patient.rootscare" : "com.rootscare",
};

const CartDetails = ({ navigation }) => {

  const {
    loggedInUserDetails,
    languageIndex,
    deviceConnection,
    cartTime,
    selectedProvider,
    tabbyPayment,
    deviceToken
  } = useSelector(state => state.StorageReducer)
  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const state = {
    appState: AppState.currentState
  };

  var sdkModule = RNGoSell.goSellSDK;
  var sdkModels = RNGoSell.goSellSDKModels;
  const insets = useSafeAreaInsets()
  const [statesData, setStatesData] = useState({
    modalvisible: false,
    cartDetails: "",
    pay_condition: false,
    modalVisible3: false,
    payment_moodal: false,
    provider_name: "",
    provider_id: "",
    payment_url: "",
    total_price: "",
    user_id: "",
    message: "",
    task_details: "",
    notification_count: "",
    payment_status: "true",
    currency_symbol: loggedInUserDetails?.currency_symbol,
    booking_type: '',
    tabbyPaymentId: '',
    payment_mode_country: "sar",
    loadCart: true,
    isRemovingCart: false,
    isGoingBack: false,
    isLoading: false,
    appState: '',
    isPaymentInitiate: false,
    isPaymentDone: false,
    customerDetails: null,
    totalAmount: '',
    service_type: '',
    cartId: '',
    isPaymentOption: false,
    isShowCoupons: false,
    cartMsg: ''
  })
  const [timer, setTimer] = useState(120)

  // 'card.success@tabby.ai'
  // '500000001'
  const customerPayment = {
    payment: {
      amount: statesData.cartDetails?.total_price,
      currency: statesData.currency_symbol,
      buyer: {
        email: '',
        phone: loggedInUserDetails.phone_number,
        name: loggedInUserDetails.first_name,
        dob: loggedInUserDetails.dob,
      },
      buyer_history: {
        registered_since: '2019-08-24T14:15:22Z',
        loyalty_level: 0,
        wishlist_count: 0,
        is_social_networks_connected: true,
        is_phone_number_verified: true,
        is_email_verified: true,
      },
      order: {
        tax_amount: '0.00',
        shipping_amount: '0.00',
        discount_amount: '0.00',
        reference_id: statesData.cartDetails.order_id,
        items: [
          {
            title: statesData.cartDetails?.service_display_type,
            description: statesData.cartDetails.display_task_type,
            quantity: 1,
            unit_price: statesData.cartDetails?.total_price,
            reference_id: statesData.cartDetails.order_id,
            product_url: 'http://example.com',
            category: statesData.cartDetails?.service_display_type,
          },
        ],
      },
      order_history: [
        {
          purchased_at: '2019-08-24T14:15:22Z',
          amount: statesData.cartDetails?.total_price,
          payment_method: 'card',
          status: 'new',
          buyer: {
            email: '',
            phone: '',
            name: loggedInUserDetails.first_name,
            dob: loggedInUserDetails.dob,
          },
          shipping_address: {
            city: 'string',
            address: 'string',
            zip: 'string',
          },
          items: [
            {
              title: statesData.cartDetails?.service_display_type,
              description: statesData.cartDetails.display_task_type,
              quantity: 1,
              unit_price: statesData.cartDetails?.total_price,
              reference_id: statesData.cartDetails.order_id,
              product_url: 'http://example.com',
              category: statesData.cartDetails?.service_display_type,
            },
          ],
        },
      ],
    },
  };


  const CapturePayment = {
    amount: statesData.cartDetails?.total_price,
    tax_amount: "0.00",
    shipping_amount: "0.00",
    discount_amount: "0.00",
    created_at: statesData.cartDetails.date,
    items: [
      {
        title: statesData.cartDetails.service_display_type,
        description: "",
        quantity: 1,
        unit_price: statesData.cartDetails?.total_price,
        discount_amount: "0.00",
        reference_id: statesData.cartDetails.order_id,
        image_url: "",
        product_url: "",
        gender: loggedInUserDetails.gender === '0' ? 'Male' : 'Female',
        category: statesData.cartDetails.display_task_type,
        color: "",
        product_material: "",
        size_type: "",
        size: "",
        brand: ""
      }
    ]
  }
  const myTestPayment = { merchant_code: loggedInUserDetails?.currency_symbol === 'AED' ? 'rootscareuae' : 'rootscare', lang: 'en', ...customerPayment }

  const newRoom = new MessageRoom({
    AppointmentID: '',
    Created: new Date(),
    Expired: false,
    ID: statesData.cartDetails.order_id,
    LastOpened: new Date(),
    Messages: [
      new Message({
        Body: `Appointment created on ${moment().format('hh:mm A, ddd, DD MMM YYYY')}`,
        DateTime: new Date(),
        DocPaths: [],
        ImagePaths: [],
        Milliseconds: moment().valueOf(),
        NumChars: '',
        ReadBit: 1,
        ReceiverID: selectedProvider ? selectedProvider?.providerId : '',
        SenderID: loggedInUserDetails?.user_id,
        Shown: true,
        SYSTEM: true,
      }),
      new Message({
        Body: `Your consultation details will remain strictly confidential.\n\n- You are likely to receive a response after 9 am.\n- Your consultation will remain open for 3 days incase you have any follow-up questions.\n- In case of emergency, please rush to your nearest hospital.`,
        DateTime: new Date(),
        DocPaths: [],
        ImagePaths: [],
        Milliseconds: moment().valueOf(),
        NumChars: '',
        ReadBit: 1,
        ReceiverID: selectedProvider ? selectedProvider?.providerId : '',
        SenderID: loggedInUserDetails?.user_id,
        Shown: true,
        SYSTEM: true,
      })
    ],
    Patient: {
      ID: loggedInUserDetails?.user_id,
      Image: loggedInUserDetails?.image,
      IsTyping: false,
      FCM: deviceToken
    },
    Provider: {
      ID: selectedProvider ? selectedProvider?.providerId : '',
      Image: selectedProvider ? selectedProvider?.providerImg : '',
      IsTyping: false,
      FCM: null
    }
  })

  useEffect(() => {
    startTime = new Date().getTime()
    let appStateSubscription = AppState.addEventListener(
      "change",
      nextAppState => {
        console.log("nextAppState", nextAppState);
        setState({ appState: nextAppState });
        if (nextAppState == 'inactive' || nextAppState == 'background') {
          // interval = BackgroundTimer.runBackgroundTimer(() => {
          //   //code that will be called every second 
          //   setTimer((lastTimerCount) => {
          //     lastTimerCount <= 1 && (
          //       BackgroundTimer.stopBackgroundTimer(),
          //       clearInterval(interval)
          //     )
          //     console.log('tic tac...', lastTimerCount - 1);
          //     return lastTimerCount - 1
          //   })

          // }, 1000);
        }
        if (nextAppState === "active") {
          if (startTime != '') {
            console.log({ startTime });
            var endTime = new Date().getTime();
            console.log({ endTime });
            let diffInSeconds = (endTime - startTime) / 1000;
            diffInSeconds = Math.floor(diffInSeconds)
            console.log({ diffInSeconds });
            if (diffInSeconds >= 60) {
              setTimer(0)
            } else {
              setTimer(timer - diffInSeconds)
            }
          }
        }

      }
    );
    return () => appStateSubscription.remove()

  }, [])

  useEffect(() => {
    if (deviceConnection) {
      getCartInfo()
      getPayStatus();
    }
  }, [deviceConnection, statesData.isShowCoupons])

  useEffect(() => {
    if (tabbyPayment == true) {
      dispatch(TabbyPaymentStatus(false))
      resetState()
      clearInterval(interval)
      setState({ modalvisible: true });
      if (selectedProvider.providerType === 'doctor') {
        dispatch(TodaysConsultations(0))
      } else if (selectedProvider.providerType === 'lab') {
        dispatch(TodaysLabTests(0))
      } else {
        dispatch(TodaysAppointments(0))
      }
      setTimeout(() => {
        setState({ modalvisible: false })
      }, 1000);

      setTimeout(() => {
        navigation.navigate(selectedProvider.providerType === 'doctor' ? 'Consultation' : selectedProvider.providerType === 'lab' ? 'LabTest' : 'Apointment')
      }, 2000);
    }
  }, [isFocused, tabbyPayment])

  useFocusEffect(
    React.useCallback(() => {
      if (statesData.cartDetails) {
        Timer()
      }
      return () => {
        clearInterval(interval)
      }
    }, [statesData.cartDetails])
  )

  useEffect(() => {
    if (timer === 0) {
      setState({ isShowCoupons: false })
      remove_cart('auto')
    }
  }, [timer])


  const Timer = () => {
    interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        lastTimerCount <= 1 && (
          clearInterval(interval)
        )
        return lastTimerCount - 1
      })
    }, 1000)
  }



  const setState = payload => {
    setStatesData(prev => ({
      ...prev,
      ...payload
    }))
  }
  const resetState = () => {
    setState({
      modalvisible: false,
      cartDetails: "",
      pay_condition: false,
      modalVisible3: false,
      payment_moodal: false,
      provider_name: "",
      provider_id: "",
      payment_url: "",
      total_price: "",
      user_id: "",
      message: "",
      task_details: "",
      notification_count: "",
      payment_status: "true",
      currency_symbol: "",
      tabbyPaymentId: '',
      payment_mode_country: "sar",
      loadCart: false,
      isLoading: false,
      appState: '',
      customerDetails: null,
      isRemovingCart: false,
      isGoingBack: false,
      isPaymentOption: false
    })
  }



  const StartTabbySdk = async () => {
    try {
      const { sessionId, paymentId, availableProducts } = await Tabby.createSession(myTestPayment);
      // console.log({
      //   sessionId,
      // });
      // console.log({
      //   paymentId,
      // });
      // console.log({
      //   availableProducts
      // });
      setState({ tabbyPaymentId: paymentId, })
      // return
      setTimeout(() => {
        navigation.navigate('TabbyPayment',
          {
            url: availableProducts[0].webUrl,
            serviceType: statesData.service_type,
            cartId: statesData.cartId,
            transactionId: paymentId,
            capturePayment: CapturePayment,
            newRoom: newRoom,
            cartTime: timer
          })
      }, 750);
    } catch (error) {
      msgProvider.showError('Error creating session!')
      Timer()
      console.log('tabby error...', error);
    }
  }

  const startSDK = () => {
    setState({ isLoading: true, isPaymentInitiate: true })
    startTime = ''
    clearInterval(interval)
    var appCredentialsLocal = {
      appCredentials: appCredentials,
      sessionParameters: {
        paymentStatementDescriptor: "paymentStatementDescriptor",
        transactionCurrency: statesData.payment_mode_country,
        isUserAllowedToSaveCard: true,
        paymentType: PaymentTypes.ALL,
        amount: statesData.totalAmount,
        shipping: [],
        allowedCadTypes: AllowedCadTypes.ALL,
        paymentitems: [],
        paymenMetaData: { a: "a meta", b: "b meta" },
        applePayMerchantID: "applePayMerchantID",
        authorizeAction: { timeInHours: 10, time: 10, type: "CAPTURE" },
        cardHolderName: "",
        editCardHolderName: false,
        postURL: "https://tap.company",
        paymentDescription: "paymentDescription",
        destinations: "null",
        // Here we can set the transaction mode as on of the available options on this URL:
        // See [https://github.com/Tap-Payments/gosellSDK-ReactNative#transaction_modes] to get transaction modes
        trxMode: TrxMode.PURCHASE,
        taxes: [],
        merchantID: "",
        SDKMode: SDKMode.Production, //SDKMode.Production, //SDKMode.Production, SDKMode.Sandbox,
        customer: statesData.customerDetails,
        isRequires3DSecure: true,
        receiptSettings: { id: null, email: false, sms: true },
        allowsToSaveSameCardMoreThanOnce: false,
        paymentReference: "null",
      },
    };

    try {
      var res =
        sdkModule &&
        sdkModule.startPayment(appCredentialsLocal, 0, handleResult);
    } catch (e) {
      console.log(e);
    }
  }

  const handleResult = (error, status) => {
    console.log("status is..... " + status);
    var resultStr = String(status.sdk_result);
    switch (resultStr) {
      case "SUCCESS":
        handleSDKResult(status);
        break;
      case "CANCELLED":
        msgProvider.showError('Payment is cancelled')
        setState({ isLoading: false, isPaymentInitiate: false })
        Timer()
        break;
      case "FAILED":
        msgProvider.showError('Something went wrong, please contact admin')
        setState({ isLoading: false, isPaymentInitiate: false })
        Timer()
        break;
      case "SDK_ERROR":
        msgProvider.showError('Something went wrong, please contact admin')
        setState({ isLoading: false, isPaymentInitiate: false })
        Timer()
        console.log("sdk error............", status);
        break;
      case "NOT_IMPLEMENTED":
        break;
    }
  }

  const handleSDKResult = (result) => {
    // console.log("Payment sdk::::", result);

    switch (result["trx_mode"]) {
      case "CHARGE":
        if (result.status == "CAPTURED") {
          TapPayment(result.charge_id);
        } else {
          Timer()
          setTimeout(function () {
            msgProvider.showError(result.message);
            return false;
          }, 1000);
        }
        break;

      case "AUTHORIZE":
        printSDKResult(result);
        break;

      case "SAVE_CARD":
        printSDKResult(result);
        break;

      case "TOKENIZE":
        break;
    }
  }

  const TapPayment = async (paymentId) => {
    let url = config.baseURL + "api-patient-insert-appointment";
    var data = new FormData();

    data.append("service_type", statesData.service_type);
    data.append("login_user_id", loggedInUserDetails?.user_id);
    data.append("cart_id", statesData.cartId);
    data.append("trid", paymentId);

    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        if (obj.status == true) {
          console.log("TapPayment...", obj);
          firestore().collection(`Chats-${config.mode}`).doc(newRoom.MessageRoomDetails.ID).set(newRoom).finally(() => {
            resetState()
            if (selectedProvider.providerType === 'doctor') {
              dispatch(TodaysConsultations(0))
            } else if (selectedProvider.providerType === 'lab') {
              dispatch(TodaysLabTests(0))
            } else {
              dispatch(TodaysAppointments(0))
            }
            setState({ modalvisible: true, isLoading: false });
            setTimeout(() => {
              setState({ modalvisible: false })
            }, 1000);

            setTimeout(() => {
              navigation.navigate(selectedProvider.providerType === 'doctor' ? 'Consultation' : selectedProvider.providerType === 'lab' ? 'LabTest' : 'Apointment')
            }, 2000);
          })

        } else {
          setState({ message: obj.message, isLoading: false });
          setTimeout(() => {
            msgProvider.showError(obj.message);
          }, 700);
          // }
          return false;
        }
      })
      .catch((error) => {
        console.log("TapPayment-error ------- " + error);
        setState({ isLoading: false });
      });
  };

  const printSDKResult = (result) => {
    if (!result) return;
    Object.keys(result).map((key) => {
      console.log(`${result["trx_mode"]}\t${key}:\t\t\t${result[key]}`);
    });
  }

  const getPayStatus = async () => {

    let url = "https://rootscare.net/application/payment/pages/rootscare_onoff.php";
    apifuntion
      .getApi(url, 1)
      .then((obj) => {
        if (obj.success == "true") {
          setState({ payment_status: obj.payment_status });
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log("getPayStatus-error ------- " + error);
      });
  };


  const getCartInfo = async () => {
    if (statesData.currency_symbol == "AED") {
      setState({ payment_mode_country: "aed" });
    } else {
      setState({ payment_mode_country: "sar" });
    }

    let customer = {
      isdNumber: loggedInUserDetails?.user_id,
      number: "00000000",
      customerId: "",
      first_name: loggedInUserDetails.first_name,
      middle_name: "",
      last_name: loggedInUserDetails.last_name,
      email: loggedInUserDetails.email,
    };

    setState({
      user_id: loggedInUserDetails?.user_id,
      customerDetails: customer,
    });
    let url = config.baseURL + "api-patient-cart-details";

    var data = new FormData();
    data.append("login_user_id", loggedInUserDetails?.user_id);

    apifuntion
      .postApi(url, data)
      .then((obj) => {
        console.log("get_cart-response...", obj.result);
        if (obj.status == true) {
          AsyncStorage.setItem('cartId', obj.result[0].id)
          setState({
            family_member_id: obj.result[0].family_member_id,
            cartDetails: obj.result[0],
            service_type: obj.result[0].service_type,
            booking_type: obj.result[0].booking_type,
            cartId: obj.result[0].id,
            provider_name: obj.result[0].provider_details.provider_name,
            task_details: obj.result[0].task_details,
            totalAmount: obj.result[0].total_price,
            subTotal: obj.result[0].sub_total_price,
            coupon: obj.result[0].couponcode,
            couponId: obj.result[0].couponcodeid,
            couponPer: obj.result[0].coupondiscount,
            couponTotal: obj.result[0].couponamount,
          });
        } else {
          setState({ cartDetails: obj.result });
          return false;
        }
      }).catch((error) => {
        console.log("getCartInfo-error ------- " + error);
      }).finally(() => {
        setState({ loadCart: false })
      })
  };

  const remove_cart = async (type) => {
    let Id = await AsyncStorage.getItem('cartId')
    let url = config.baseURL + "api-patient-remove-cart";
    var data = new FormData();
    data.append("cart_id", statesData.cartId == '' ? Id : statesData.cartId);

    console.log(data);
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        setState({ modalVisible3: false, isRemovingCart: false })
        console.log("remove_cart-response...", obj);
        if (obj.status == true) {
          AsyncStorage.removeItem('cartId')
          dispatch(CartTime(0))
          if (type == 'auto') {
            msgProvider.showError('You cart is removed automatically by the system.');
            setTimeout(() => {
              navigation.pop()
            }, 300);
          } else {
            AsyncStorage.removeItem('cartId')
            msgProvider.showSuccess(obj.message);
          }
          resetState()

        } else {
          msgProvider.showError(obj.message);

          return false;
        }
      })
      .catch((error) => {
        AsyncStorage.removeItem('cartId')
        setState({ modalVisible3: false, isRemovingCart: false })
        console.log("remove_cart-error ------- " + error);
      });
  };

  const _onNavigationStateChange = (webViewState) => {
    webViewState.canGoBack = false;
    if (webViewState.loading == false) {
      console.log("webViewState", webViewState);
      console.log(webViewState.url);
      var t = webViewState.url.split("/").pop().split("?")[0];
      if (typeof t != null) {
        var p = webViewState.url.split("?").pop().split("&");
        if (t == "payment_success_final.php") {
          var payment_id = 0;
          console.log("p.length", p.length);
          console.log("p.length", p);

          for (var i = 0; i < p.length; i++) {
            var val = p[i].split("=");
            console.log("val", val);
            if (val[0] == "tap_id") {
              payment_id = val[1];
              console.log("val[1]", val[1]);
            }
          }
          console.log("payment_id", payment_id);
          if (statesData.pay_condition == false) {
            setState({ pay_condition: true });
            setTimeout(() => {
              TapPayment(payment_id);
            }, 500);
          }
        } else if (t == "payment_cancel.php") {
          navigation.navigate("Home");

          msgProvider.showError("Payment unsuccessful");
          return false;
        } else if (t == "payment_failed.php") {
          msgProvider.alert(
            LangProvider.information[languageIndex],
            "Payment unsuccessful",
            false
          );
          navigation.goBack();
        }
      }
    }
  }


  const ActivityIndicatorElement = () => {
    //making a view to show to while loading the webpage
    return (
      <ActivityIndicator
        color={Colors.Theme}
        size="large"
        style={{
          position: "absolute",
          top: (windowHeight * 40) / 100,
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          alignSelf: "center",
        }}
      />
    );
  };

  const RemoveCoupon = async (couponId) => {
    setState({ isRemoveCoupon: true })

    let url =
      config.baseURL + "api-remove-coupon"

    var data = new FormData();

    data.append("service_type", statesData.service_type);
    data.append("carttotal", statesData.totalAmount);
    data.append("subtotal", statesData.subTotal);
    data.append("couponcodeid", statesData.couponId);
    data.append("userid", loggedInUserDetails.user_id);
    data.append("cartid", statesData.cartId);
    data.append("couponamount", statesData.couponTotal);

    // console.log(data._parts);
    // return
    apifuntion.postApi(url, data, 1).then((res) => {
      setState({ isRemoveCoupon: false, modalVisible3: false })
      // console.log("api-remove-coupon ", res)
      if (res.status == true) {
        msgProvider.showSuccess('Coupon removed successfully!')
      } else {
        msgProvider.showError(res?.message)
      }
    }).catch((error) => {
      setState({ isRemoveCoupon: false, modalVisible3: false })
      msgProvider.showError(error?.message)
      console.log("remove-coupon-error ------- " + error);
    }).finally(() => {
      getCartInfo()
    })
  };

  var show_data = statesData.cartDetails;
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  return (
    <View
      pointerEvents={(statesData.isLoading || statesData.isRemovingCart) ? 'none' : 'auto'}
      style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>

      <ScreenHeader
        title={LangProvider.CartItem[languageIndex]}
        navigation={navigation}
        onBackPress={() => {
          if (statesData.cartDetails != "" && statesData.cartDetails != null) {
            setState({ isGoingBack: true })
            remove_cart('auto')
          } else {
            navigation.pop()
          }
        }}
        leftIcon
        isLoading={statesData.isGoingBack}
      />

      {
        (statesData.cartDetails != "" && statesData.cartDetails != null && !!!statesData.coupon) &&

        <View style={styles.couponContainer}>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SvgXml xml={Coupon} />
            <Text
              style={{
                fontFamily: Font.Medium,
                fontSize: Font.large,
                color: Colors.detailTitles,
                marginHorizontal: s(10)
              }}>
              {LangProvider.ApplyCoupon[languageIndex]}</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => setState({ isShowCoupons: true })}
            style={{
              height: s(25),
              width: s(25),
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Colors.Highlight
            }}>
            <SvgXml xml={languageIndex == 0 ? rightArrow : leftArrow} />
          </TouchableOpacity>

        </View>
      }
      <>
        {
          (statesData.cartDetails != "" && statesData.cartDetails != null) ?
            <View style={{ backgroundColor: Colors.White, paddingTop: vs(9), marginTop: vs(7) }}>

              <ScrollView
                contentContainerStyle={{ paddingBottom: (windowWidth * 70) / 100 }}
                keyboardDismissMode="interactive"
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}>

                {/* -----------Name------------- */}
                <View style={{ borderBottomWidth: 1.5, borderBottomColor: Colors.backgroundcolor, }}>
                  <View style={{ flexDirection: 'row', paddingHorizontal: s(13), alignItems: 'center' }}>

                    <View style={{ flexDirection: 'row', width: '90%', alignItems: 'center' }}>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: Font.large,
                          color: Colors.detailTitles,
                        }}>
                        {statesData.provider_name}
                      </Text>

                      <View style={{ height: vs(11), width: 1, backgroundColor: Colors.Border, marginLeft: vs(6) }}></View>
                      <Text
                        style={{
                          fontFamily: Font.Regular,
                          fontSize: Font.medium,
                          color: Colors.detailTitles,
                          marginLeft: vs(12)
                        }}>
                        {show_data?.service_display_type}
                      </Text>
                    </View>

                    <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
                      <TouchableHighlight
                        onPress={() => {
                          setState({ modalVisible3: true, cartMsg: LangProvider.remove_msg[languageIndex] });
                        }}
                        underlayColor={Colors.Highlight}
                        style={styles.closeContainer}>
                        <SvgXml xml={_Cross} height={vs(19)} width={s(18)} />
                      </TouchableHighlight>
                    </View>
                  </View>
                </View>

                {/* --------------------------------------- */}


                <View style={{ marginTop: vs(13), paddingHorizontal: s(13) }}>
                  <Text
                    style={{
                      fontFamily: Font.Medium,
                      fontSize: Font.large,
                      color: Colors.detailTitles,
                      alignSelf: 'flex-start'
                    }}>
                    {LangProvider.Appointment_footer[languageIndex]}
                  </Text>

                  <View style={{ flexDirection: 'row', marginTop: vs(15) }}>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: Font.small,
                          color: Colors.DarkGrey,
                          alignSelf: 'flex-start'
                        }}>
                        {LangProvider.Date[languageIndex]}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: Font.small,
                          color: Colors.DarkGrey,
                          alignSelf: 'flex-start',
                          marginTop: vs(2)
                        }}>
                        {show_data?.display_app_date}
                      </Text>
                      <View style={{ width: '60%', marginTop: vs(5), justifyContent: 'center', alignItems: 'center', paddingVertical: vs(2), backgroundColor: Colors.White, borderWidth: 1, borderColor: Colors.Theme, borderRadius: 4 }}>
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: Font.small,
                            color: Colors.Theme,
                            textAlign: 'left'
                          }}>
                          {show_data?.display_task_type}
                        </Text>
                      </View>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: Font.small,
                          color: Colors.DarkGrey,
                          alignSelf: 'flex-start'
                        }}>
                        {LangProvider.Time[languageIndex]}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: Font.small,
                          color: Colors.DarkGrey,
                          alignSelf: 'flex-start',
                          marginTop: vs(2)
                        }}>
                        {show_data?.from_time} - {show_data?.to_time}
                      </Text>
                      <View style={{ marginTop: vs(5), alignItems: 'center', flexDirection: 'row' }}>
                        <SvgXml xml={clockBlue} height={vs(16)} width={s(16)} />
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: Font.small,
                            color: Colors.Theme,
                            marginLeft: s(6)
                          }}>
                          {show_data?.display_task_time}
                        </Text>
                      </View>

                    </View>

                    {/* --------------------------------- */}
                  </View>
                </View>

                {/* ---------------------------------------- */}
                <View style={{ marginTop: vs(13), paddingHorizontal: s(13), backgroundColor: '#FBFBFB', paddingVertical: vs(10) }}>
                  <Text
                    style={{
                      fontFamily: Font.Medium,
                      fontSize: Font.large,
                      color: Colors.detailTitles,
                      alignSelf: 'flex-start'
                    }}>
                    {LangProvider.Payment[languageIndex]}
                  </Text>

                  <FlatList
                    data={show_data?.task_details}
                    renderItem={({ item, index }) => {
                      if (item.task_details != "") {
                        return (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: 'center',
                              justifyContent: "space-between",
                              paddingVertical: vs(5),
                            }}>
                            <Text
                              style={{
                                fontFamily: Font.Regular,
                                fontSize: Font.small,
                                color: Colors.detailTitles,
                              }}
                              numberOfLines={1}
                            >
                              {item.name}
                            </Text>
                            <Text
                              style={{
                                fontFamily: Font.Regular,
                                fontSize: Font.small,
                                color: Colors.detailTitles,
                              }} >
                              {item.price}
                            </Text>
                          </View>
                        );
                      }
                    }}
                  />

                  {/* ----------------Coupon--------------- */}

                  {
                    !!statesData.coupon &&
                    <View style={{
                      borderTopWidth: 1,
                      borderTopColor: '#00000029',
                      paddingBottom: vs(10),
                    }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: 'center',
                          // justifyContent: "space-between",
                          marginTop: vs(10),
                        }}>
                        <Text
                          style={{
                            fontFamily: Font.Regular,
                            fontSize: Font.small,
                            color: Colors.detailTitles,
                          }}>
                          {`${LangProvider.Coupon[languageIndex]}`}
                        </Text>

                        <TouchableOpacity
                          onPress={() => {
                            setState({ modalVisible3: true, cartMsg: LangProvider.removeCoupon[languageIndex] });
                          }}>
                          {/* <SvgXml xml={_Cross} height={vs(19)} width={s(18)} />
                           */}
                          <Text
                            style={{
                              fontFamily: Font.Regular,
                              fontSize: Font.small,
                              color: Colors.Red,
                              marginHorizontal: s(10)
                            }}>
                            {`Remove`}
                          </Text>
                        </TouchableOpacity>

                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: 'center',
                          justifyContent: "space-between",
                          marginTop: vs(5),
                        }}>
                        <Text
                          style={{
                            fontFamily: Font.Regular,
                            fontSize: Font.small,
                            color: Colors.detailTitles,
                          }}>
                          {`${statesData.coupon} (${statesData.couponPer + '%'})`}
                        </Text>

                        <Text
                          style={{
                            fontFamily: Font.Regular,
                            fontSize: Font.small,
                            color: Colors.detailTitles,
                          }}>
                          {`- ${statesData.couponTotal} ${statesData.currency_symbol}`}
                        </Text>
                      </View>


                    </View>
                  }

                  {/* ----------------------------------- */}
                  <View
                    style={{
                      paddingVertical: vs(10),
                      borderTopWidth: 1,
                      borderBottomWidth: 1,
                      borderColor: '#00000029',
                    }}>
                    {show_data?.display_task_type !== "Online consultation" && (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: 'center',
                          justifyContent: "space-between",
                        }}>
                        <Text
                          style={{
                            fontFamily: Font.Regular,
                            fontSize: Font.small,
                            color: Colors.detailTitles,
                          }}>
                          {/* {show_data?.distance_fare_text} */}
                          {`${show_data.distance_fare_text} ${show_data?.distancetext == '' ? '' : `(${show_data.distancetext})`}`}

                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.Regular,
                            fontSize: Font.small,
                            color: Colors.detailTitles,
                          }}>
                          {show_data?.distance_fare}
                        </Text>
                      </View>
                    )}

                    {
                      show_data?.vat_percent_used != '0' &&
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: 'center',
                          justifyContent: "space-between",
                          marginTop: (windowWidth * 2) / 100,
                        }} >
                        <Text
                          style={{
                            fontFamily: Font.Regular,
                            fontSize: Font.small,
                            color: Colors.detailTitles,
                          }}>
                          {show_data?.vat_text}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.Regular,
                            fontSize: Font.small,
                            color: Colors.detailTitles,
                          }}
                        >
                          {show_data?.vat_price}
                        </Text>
                      </View>

                    }

                  </View>

                  {/* -----------------Total------------------ */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: 'center',
                      justifyContent: "space-between",
                      marginTop: vs(10),
                    }}>
                    <Text
                      style={{
                        fontFamily: Font.Medium,
                        fontSize: Font.medium,
                        color: Colors.Theme,
                      }}>
                      {LangProvider.Total[languageIndex]}
                    </Text>
                    <Text
                      style={{
                        fontFamily: Font.Medium,
                        fontSize: Font.medium,
                        color: Colors.Theme,
                      }}>
                      {show_data?.total_price + ' ' + statesData.currency_symbol}
                    </Text>
                  </View>

                </View>

                <View style={{
                  paddingHorizontal: s(13),
                  paddingVertical: vs(10),
                  backgroundColor: '#FFF2D9'
                }}>
                  <View style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                    <Text
                      style={{
                        fontFamily: Font.Bold,
                        fontSize: Font.small,
                        color: Colors.precautionText,
                        width: '13%'
                      }}>
                      {formattedTime}
                    </Text>
                    <Text
                      style={{
                        fontFamily: Font.Medium,
                        fontSize: Font.small,
                        color: Colors.precautionText,
                      }}>
                      {LangProvider.CartTime[languageIndex]}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily: Font.Regular,
                      fontSize: Font.xsmall,
                      color: Colors.detailTitles,
                      textAlign: 'left',
                      marginTop: vs(5)
                    }}>
                    {LangProvider.CartInfo[languageIndex]}
                  </Text>
                </View>

                {/* ----------------Promo------------------- */}
                <TabbyCheckoutSnippet
                  lang={languageIndex == 0 ? 'en' : "ar"}
                  currency={loggedInUserDetails?.currency_symbol}
                  price={(show_data?.total_price != '' && show_data?.total_price != null) ? show_data?.total_price : '0'}
                  circleFillColor={[Colors.Theme, Colors.Theme, Colors.Theme, Colors.Theme, Colors.Theme]}
                // containerStyle={{ marginTop: vs(7) }}
                />
              </ScrollView>

            </View>
            :

            ((statesData.cartDetails == "" || statesData.cartDetails == null) && statesData.loadCart == false) ?

              <View
                style={{
                  width: "100%",
                  alignSelf: "center",
                  marginTop: (windowWidth * 5) / 100,
                  paddingHorizontal: s(13)
                }} >
                <Image
                  style={{
                    width: (windowWidth * 35) / 100,
                    height: (windowWidth * 50) / 100,
                    alignSelf: "center",
                    resizeMode: "contain",
                  }}
                  source={Icons.Emptycart}
                />

                <Text
                  style={{
                    color: Colors.Theme,
                    fontFamily: Font.Regular,
                    fontSize: (windowWidth * 4) / 100,
                    textAlign: "center",
                  }}
                >
                  Cart Details not found.
                </Text>

                <Button
                  text={LangProvider.BOOKNOW[languageIndex]}
                  btnStyle={{ marginTop: vs(20) }}
                  onPress={() => {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "DashboardStack" }],
                    });
                  }}
                />

              </View>
              :
              ((statesData.cartDetails == "" || statesData.cartDetails == null) && statesData.loadCart == true) ?
                <LoadingSkeleton />
                :
                null

        }
      </>



      {
        ((statesData.cartDetails != "" && statesData.cartDetails != null)) &&

        <View
          style={{
            width: "100%",
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: Colors.White,
            paddingTop: (windowWidth * 2) / 100,
            paddingBottom: Platform.OS == 'ios' ? insets.bottom - vs(5) : (windowWidth * 2) / 100,
            alignItems: "center",
            paddingHorizontal: '10%',
            borderTopWidth: 1,
            borderTopColor: Colors.Border,
            position: 'absolute',
            bottom: 0,
            zIndex: 9999
          }}>

          <View style={{ alignItems: 'flex-start' }}>
            <Text
              style={{
                fontFamily: Font.Medium,
                fontSize: Font.xxlarge,
                color: Colors.Theme,
              }}>
              {show_data?.total_price + ' ' + statesData.currency_symbol}
            </Text>
            <Text
              style={{
                fontFamily: Font.Regular,
                fontSize: Font.small,
                color: Colors.detailTitles,
              }}>
              {LangProvider.Amount_Payable[languageIndex]}
            </Text>
          </View>

          <Button
            onLoading={statesData.isLoading}
            btnStyle={{ width: windowWidth / 2.5 }}
            text={LangProvider.ProceedToPay[languageIndex]}
            onPress={() => {
              // startSDK();
              // StartTabbySdk()
              setState({ isPaymentOption: true })
              clearInterval(interval)
            }}
          />

        </View>


      }


      {/* ------------------------------Delete Modal-------------------------------------- */}

      <Modal
        animationType="fade"
        transparent={true}
        visible={statesData.modalVisible3}
        onRequestClose={() => {
          setState({ modalVisible3: false });
        }}
      >
        <View
          style={{
            backgroundColor: "#00000080",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
            marginTop: -50,
          }}>
          <View
            style={{
              borderRadius: 20,
              width: (windowWidth * 90) / 100,
              position: "absolute",
              alignSelf: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 10,
                width: "100%",
              }}
            >
              <View
                style={{
                  alignSelf: "flex-start",
                  width: (windowWidth * 50) / 100,
                  paddingVertical: (windowWidth * 3) / 100,
                  marginTop: (windowWidth * 2) / 100,
                  paddingLeft: (windowWidth * 4) / 100,
                  flexDirection: "row",
                }}
              >
                <Image
                  style={{
                    width: (windowWidth * 6) / 100,
                    height: (windowWidth * 6) / 100,
                  }}
                  source={Icons.logoPlain}
                />
                <Text
                  style={{
                    fontFamily: Font.Medium,
                    color: "#000",
                    fontSize: (windowWidth * 5) / 100,
                    paddingLeft: (windowWidth * 4) / 100,
                  }}
                >
                  {LangProvider.confimation[languageIndex]}
                </Text>
              </View>
              <View
                style={{
                  alignSelf: "flex-start",
                  paddingTop: (windowWidth * 1) / 100,
                  paddingHorizontal: s(16),
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: Font.Regular,
                    color: "#000",
                    fontSize: (windowWidth * 4) / 100,
                  }}
                >
                  {statesData.cartMsg}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  width: "40%",
                  paddingBottom: (windowWidth * 5) / 100,
                  marginTop: vs(15),
                  alignSelf: "flex-end",
                  right: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setState({ modalVisible3: false });
                  }}
                  style={{
                    width: (windowWidth * 15) / 100,
                    flexDirection: "row",
                    alignSelf: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Font.Regular,
                      fontSize: (windowWidth * 4) / 100,
                      color: Colors.Blue,
                      alignSelf: "center",
                    }}
                  >
                    {LangProvider.no_txt[languageIndex]}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    statesData.cartMsg == LangProvider.remove_msg[languageIndex] && setState({ isRemovingCart: true })
                    statesData.cartMsg == LangProvider.removeCoupon[languageIndex] ? RemoveCoupon() : remove_cart('manual');

                  }}
                  activeOpacity={0.8}
                  style={{
                    width: (windowWidth * 40) / 100,
                    justifyContent: "center",
                  }}>
                  {
                    (statesData.isRemovingCart || statesData.isRemoveCoupon) ?
                      <SkypeIndicator color={Colors.Theme} size={20} />
                      :
                      <Text
                        style={{
                          fontFamily: Font.Regular,
                          fontSize: (windowWidth * 4) / 100,
                          color: Colors.Blue,
                          alignSelf: "center",
                        }}>
                        {LangProvider.Delete[languageIndex]}
                      </Text>
                  }

                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>


      {/* ----------------------------------------------sucess model -------------------------- */}

      <SuccessPopup
        visible={statesData.modalvisible}
        onRequestClose={() => {
          setState({ modalvisible: false })
        }}
        type={selectedProvider?.providerType}
        navigation={navigation}
      />

      <PaymentOptionBottomSheet
        visible={statesData.isPaymentOption}
        onRequestClose={(val) => {
          setState({ isPaymentOption: false })
          if (val == false) {
            Timer()
          }

        }}
        data={show_data?.total_price + ' ' + statesData.currency_symbol}
        selectedPaymentMethod={(val) => {
          if (val == 1) {
            startSDK()
          } else {
            StartTabbySdk()
          }
        }}
      />

      <Coupons
        visible={statesData.isShowCoupons}
        onRequestClose={() => setState({ isShowCoupons: false })}
        details={{
          provider: statesData.service_type,
          country: loggedInUserDetails.work_area,
          task: statesData.booking_type,
          total: statesData.totalAmount,
          subTotal: statesData.subTotal,
          userId: loggedInUserDetails.user_id,
          cartId: statesData.cartId
        }}
      />

    </View>
  );

}

const styles = StyleSheet.create({

  closeContainer: {
    height: s(30),
    width: s(30),
    borderRadius: s(50),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  },
  couponContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: vs(8),
    paddingHorizontal: s(16),
    backgroundColor: Colors.White,
    // marginTop:vs(7)
  }

});
export default CartDetails;
