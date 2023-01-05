import React, { Component } from "react";
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
  ActivityIndicator,
  StyleSheet,
  AppState,
  BackHandler
} from "react-native";

import {
  Colors,
  Font,
  windowHeight,
  msgProvider,
  config,
  windowWidth,
  localStorage,
  Icons,
  consolepro,
  Lang_chg,
  apifuntion,
  msgTitle,
  ScreenHeader,
  Button
} from "../Provider/utilslib/Utils";
import { WebView } from "react-native-webview";
import RNGoSell from "@tap-payments/gosell-sdk-react-native";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import { Clock, clockBlue, Cross } from "../Icons/Index";
import SuccessPopup from "../components/SuccessPopup";
import moment from "moment";
import SimpleToast from "react-native-simple-toast";



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

export default class Cart extends Component {
  _didFocusSubscription;
  _willBlurSubscription;

  state = {
    appState: AppState.currentState
  };

  constructor(props) {
    super(props);
    {
      this.state = {
        modalvisible: false,
        cart_arr: "",
        pay_condition: false,
        modalVisible3: false,
        payment_moodal: false,
        provider_name: "",
        trid: "#PH3434654E03",
        provider_id: "",
        payment_url: "",
        total_price: "",
        user_id: "",
        message: "",
        task_details: "",
        notification_count: "",
        transaction_id: "",
        payment_status: "true",
        currency_symbol: "",
        payment_mode_country: "sar",
        loadCart: true,
        isLoading: false,
        appState: '',
        isPaymentInitiate: false,
        isPaymentDone: false,
        customerDetails: null,
        taxes: [
          {
            name: "tax1",
            description: "tax describtion",
            amount: {
              type: "F",
              value: 10.0,
              maximum_fee: 10.0,
              minimum_fee: 1.0,
            },
          },
        ],

        //-----payment end---------//
      };

    }

    this.changeState = this.changeState.bind(this);
    this.startSDK = this.startSDK.bind(this);
    this.handleResult = this.handleResult.bind(this);
    this.handleSDKResult = this.handleSDKResult.bind(this);
    this.printSDKResult = this.printSDKResult.bind(this);

    if (!this.sdkModule && RNGoSell && RNGoSell.goSellSDK) {
      this.sdkModule = RNGoSell.goSellSDK;
    }
    if (!this.sdkModule && RNGoSell && RNGoSell.goSellSDKModels) {
      this.sdkModels = RNGoSell.goSellSDKModels;
    }

    // this._didFocusSubscription = props.navigation.addListener(
    //   "focus",
    //   (_payload) =>
    //     BackHandler.addEventListener("hardwareBackPress", () => {
    //      return
    //     })
    // );
  }
  componentDidMount() {
    this.props.navigation.addListener("focus", () => {
      this.get_cart();
      this.get_paysttus();
      this.appStateSubscription = AppState.addEventListener(
        "change",
        nextAppState => {
          console.log("nextAppState", nextAppState);
          if (nextAppState == 'inactive' || nextAppState == 'background') {
            if (this.state.isPaymentInitiate == true) {
              localStorage.setItemString('cartTime', '')
            }
          }
          if (this.state.appState.match(/inactive|background/) && nextAppState === "active") {
            setTimeout(() => {
              this.removeExpiredCart()
            }, 450);
          }
          this.setState({ appState: nextAppState });
        }
      );

    });
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton)
    // this._willBlurSubscription = this.props.navigation.addListener(
    //   "blur",
    //   (_payload) =>
    //     BackHandler.removeEventListener(
    //       "hardwareBackPress",
    //       () => {
    //         if (this.state.cart_arr != "" && this.state.cart_arr != null) {
    //           this.remove_cart(true, 'auto')
    //         }
    //       }
    //     )
    // );
  }

  componentWillUnmount() {
    this.appStateSubscription.remove();
  }

  handleBackButton = () => {
    return true;

  }

  resetState = () => {
    this.setState({
      modalvisible: false,
      cart_arr: "",
      pay_condition: false,
      modalVisible3: false,
      payment_moodal: false,
      provider_name: "",
      trid: "#PH3434654E03",
      provider_id: "",
      payment_url: "",
      total_price: "",
      user_id: "",
      message: "",
      task_details: "",
      notification_count: "",
      transaction_id: "",
      payment_status: "true",
      currency_symbol: "",
      payment_mode_country: "sar",
      loadCart: false,
      isLoading: false,
      appState: '',
      customerDetails: null,
    })
  }

  saveCartInfoLocally = (Id) => {
    localStorage.setItemString('cartId', Id)
  }

  removeExpiredCart = async () => {
    let cartId = await localStorage.getItemString('cartId')
    let cartTime = await localStorage.getItemString('cartTime')
    let currentTime = moment().format('x')
    currentTime = JSON.parse(currentTime)
    currentTime = moment(currentTime).format('HH:mm:ss')
    cartTime = JSON.parse(cartTime)
    cartTime = moment(cartTime).format('HH:mm:ss')
    console.log('cart time...', cartTime);
    let currentSplitTime = currentTime.split(':')
    let cartSplitTime = cartTime.split(':')

    let hourDiff = currentSplitTime[0] - cartSplitTime[0]
    let minsDiff = currentSplitTime[1] - cartSplitTime[1]
    let secDiff = currentSplitTime[2] - cartSplitTime[2]

    // console.log(hourDiff);
    // console.log(minsDiff);
    // console.log(secDiff);
    // return false
    if (cartId != null && cartId != '' && cartId != undefined) {
      if (hourDiff > 0 || (minsDiff > 0)) {
        console.log('Time is greater than 1 min');
        this.remove_cart(false, 'auto').then(() => {
          localStorage.removeItem('cartId')
          localStorage.removeItem('cartTime')
        })
      }

    }
  }


  startSDK() {
    console.log('starting payment sdk....');
    this.setState({ isLoading: true, isPaymentInitiate: true })
    var appCredentialsLocal = {
      appCredentials: appCredentials,
      sessionParameters: {
        paymentStatementDescriptor: "paymentStatementDescriptor",
        transactionCurrency: this.state.payment_mode_country,
        isUserAllowedToSaveCard: true,
        paymentType: PaymentTypes.ALL,
        amount: global.amount_total,
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
        customer: this.state.customerDetails,
        isRequires3DSecure: true,
        receiptSettings: { id: null, email: false, sms: true },
        allowsToSaveSameCardMoreThanOnce: false,
        paymentReference: "null",
      },
    };

    try {
      var res =
        this.sdkModule &&
        this.sdkModule.startPayment(appCredentialsLocal, 0, this.handleResult);
    } catch (e) {
      console.log(e);
    }
  }

  handleResult(error, status) {
    // console.log("status is..... " + status);
    var resultStr = String(status.sdk_result);
    switch (resultStr) {
      case "SUCCESS":
        this.setState({ modalvisible: true, isLoading: false });
        this.handleSDKResult(status);
        break;
      case "CANCELLED":
        msgProvider.showError('Payment is cancelled')
        this.setState({ isLoading: false, isPaymentInitiate: false })
        setTimeout(() => {
          localStorage.setItemString('cartTime', moment().format('x'))
        }, 500);
        break;
      case "FAILED":
        msgProvider.showError('Something went wrong, please contact admin')
        this.setState({ isLoading: false, isPaymentInitiate: false })
        setTimeout(() => {
          localStorage.setItemString('cartTime', moment().format('x'))
        }, 500);
        break;
      case "SDK_ERROR":
        msgProvider.showError('Something went wrong, please contact admin')
        this.setState({ isLoading: false, isPaymentInitiate: false })
        setTimeout(() => {
          localStorage.setItemString('cartTime', moment().format('x'))
        }, 500);
        console.log("sdk error............", status);
        break;
      case "NOT_IMPLEMENTED":
        break;
    }
    // this.changeState(resultStr, myString, () => {
    // });
  }

  handleSDKResult(result) {
    console.log("Payment sdk::::", result);

    switch (result["trx_mode"]) {
      case "CHARGE":
        if (result.status == "CAPTURED") {
          this.setState({ transaction_id: result.charge_id });
          this.submit_btn();
        } else {
          // console.log('payment error', msgText.Payment_fail[config.language]);
          setTimeout(function () {
            msgProvider.showError(result.message);
            return false;
          }, 1000);
        }
        break;

      case "AUTHORIZE":
        this.printSDKResult(result);
        break;

      case "SAVE_CARD":
        this.printSDKResult(result);
        break;

      case "TOKENIZE":
        break;
    }
  }

  submit_btn = async (payment_id) => {
    let transaction_id = payment_id;
    if (this.state.payment_status == "false") {
      transaction_id = "#123PE874333";
    } else {
      transaction_id = this.state.transaction_id;
    }

    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];

    let url = config.baseURL + "api-patient-insert-appointment";
    var data = new FormData();

    data.append("service_type", this.state.service_type);
    data.append("login_user_id", user_id);
    data.append("cart_id", this.state.cart_id);
    data.append("trid", transaction_id);

    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        if (obj.status == true) {
          // console.log("obj", obj);
          var message_new;
          if (obj.result == null) {
            message_new = obj.message;
          } else {
            message_new = obj.result;
          }
          this.setState({ payment_moodal: false });

          this.resetState()

          setTimeout(() => {
            this.setState({ modalvisible: false }, () => {
              this.props.navigation.navigate(this.props?.route?.params?.providerType === 'doctor' ? 'Consultation' : this.props?.route?.params?.providerType === 'lab' ? 'LabTest' : 'Apointment')
            })
          }, 2500);

          global.username = "NA";
          global.amount_total = 1;
        } else {
          this.setState({ message: obj.message });
          setTimeout(() => {
            msgProvider.showError(obj.message);
          }, 700);
          // }
          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
        this.setState({ loading: false });
      });
  };

  printSDKResult(result) {
    if (!result) return;
    Object.keys(result).map((key) => {
      console.log(`${result["trx_mode"]}\t${key}:\t\t\t${result[key]}`);
    });
  }

  changeState(newName, resultValue, callback) {
    this.setState(
      {
        statusNow: newName,
        result: resultValue,
      },
      callback
    );
  }

  get_paysttus = async () => {

    let url = "https://rootscare.net/application/payment/pages/rootscare_onoff.php";
    apifuntion
      .getApi(url, 1)
      .then((obj) => {
        // consolepro.consolelog("obj", obj.success);
        if (obj.success == "true") {
          this.setState({ payment_status: obj.payment_status });
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log("-------- error ------- " + error);
      });
  };


  get_cart = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];
    this.setState({ currency_symbol: user_details["currency_symbol"] });
    if (user_details["currency_symbol"] == "AED") {
      this.setState({ payment_mode_country: "aed" });
    } else {
      this.setState({ payment_mode_country: "sar" });
    }

    let customer = {
      isdNumber: user_details["user_id"],
      number: "00000000",
      customerId: "",
      first_name: user_details["first_name"],
      middle_name: "",
      last_name: user_details["last_name"],
      email: user_details["email"],
    };

    this.setState({
      user_id: user_id,
      customerDetails: customer,
    });
    let url = config.baseURL + "api-patient-cart-details";

    var data = new FormData();
    data.append("login_user_id", user_id);

    apifuntion
      .postApi(url, data)
      .then((obj) => {
        consolepro.consolelog("get_cart-response...", obj);
        if (obj.status == true) {
          this.saveCartInfoLocally(obj.result[0].id)
          this.setState({
            family_member_id: obj.result[0].family_member_id,
            cart_arr: obj.result[0],
            service_type: obj.result[0].service_type,
            cart_id: obj.result[0].id,
            provider_name: obj.result[0].provider_details.provider_name,
            task_details: obj.result[0].task_details,
          });
          global.amount_total = obj.result[0].total_price;
          global.username = obj.result[0].provider_details.provider_name;
        } else {
          this.setState({ cart_arr: obj.result });
          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
      });
  };

  remove_cart = async (goBack, type) => {
    let user_details = await localStorage.getItemObject("user_arr");
    let url = config.baseURL + "api-patient-remove-cart";

    var data = new FormData();
    data.append("cart_id", this.state.cart_id);
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        consolepro.consolelog("remove_cart-response...", obj);
        if (obj.status == true) {
          localStorage.removeItem('cartId')
          localStorage.removeItem('cartTime')
          if (type == 'auto') {
            msgProvider.showSuccess('You cart is removed automatically by the system.');
            setTimeout(() => {
              this.props.navigation.pop()
            }, 300);
          } else {
            msgProvider.showSuccess(obj.message);
          }
          this.resetState()

        } else {
          msgProvider.showError(obj.message);

          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
      });
  };

  _onNavigationStateChange(webViewState) {
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
          if (this.state.pay_condition == false) {
            this.setState({ pay_condition: true });
            setTimeout(() => {
              this.submit_btn(payment_id);
            }, 500);
          }
        } else if (t == "payment_cancel.php") {
          this.props.navigation.navigate("Home");

          msgProvider.showError("Payment unsuccessful");
          return false;
        } else if (t == "payment_failed.php") {
          msgProvider.alert(
            msgTitle.information[config.language],
            "Payment unsuccessful",
            false
          );
          this.props.navigation.goBack();
        }
      }
    }
  }


  ActivityIndicatorElement = () => {
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

  render() {
    var show_data = this.state.cart_arr;
    return (
      <View pointerEvents={this.state.isLoading ? 'none' : 'auto'} style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>
        <ScreenHeader
          title={Lang_chg.CartItem[config.language]}
          navigation={this.props.navigation}
          onBackPress={() => {
            if (this.state.cart_arr != "" && this.state.cart_arr != null) {
              this.remove_cart(true, 'auto')
            } else {
              this.props.navigation.pop()
            }
          }}
          leftIcon
        />
        <>
          {
            (this.state.cart_arr != "" && this.state.cart_arr != null) ?
              <View style={{ backgroundColor: Colors.White, paddingTop: vs(9), marginTop: vs(7) }}>

                <ScrollView showsVerticalScrollIndicator={false}>

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
                          {this.state.provider_name}
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
                            this.setState({ modalVisible3: true });
                          }}
                          underlayColor={Colors.Highlight}
                          style={styles.closeContainer}>
                          <SvgXml xml={Cross} height={vs(19)} width={s(18)} />
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
                      }}>
                      {Lang_chg.Appointment_footer[config.language]}
                    </Text>

                    <View style={{ flexDirection: 'row', marginTop: vs(15) }}>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: Font.small,
                            color: Colors.DarkGrey,
                          }}>
                          {Lang_chg.Date[config.language]}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: Font.small,
                            color: Colors.DarkGrey,
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
                          }}>
                          {Lang_chg.Time[config.language]}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: Font.small,
                            color: Colors.DarkGrey,
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
                      }}>
                      {Lang_chg.Payment[config.language]}
                    </Text>

                    <FlatList
                      data={show_data?.task_details}
                      renderItem={({ item, index }) => {
                        if (item.task_details != "") {
                          return (
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                paddingVertical: vs(5),
                              }}>
                              <Text
                                style={{
                                  fontFamily: Font.Regular,
                                  fontSize: Font.small,
                                  textAlign: config.textRotate,
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
                                  textAlign: config.textRotate,
                                  color: Colors.detailTitles,
                                }} >
                                {item.price}
                              </Text>
                            </View>
                          );
                        }
                      }}
                    />
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
                            justifyContent: "space-between",
                          }}>
                          <Text
                            style={{
                              fontFamily: Font.Regular,
                              fontSize: Font.small,
                              textAlign: config.textRotate,
                              color: Colors.detailTitles,
                            }}>
                            {/* {show_data?.distance_fare_text} */}
                            {`${show_data.distance_fare_text} ${show_data?.distancetext == '' ? '' : `(${show_data.distancetext})`}`}

                          </Text>
                          <Text
                            style={{
                              fontFamily: Font.Regular,
                              fontSize: Font.small,
                              textAlign: config.textRotate,
                              color: Colors.detailTitles,
                            }}>
                            {show_data?.distance_fare}
                          </Text>
                        </View>
                      )}

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginTop: (windowWidth * 2) / 100,
                        }} >
                        <Text
                          style={{
                            fontFamily: Font.Regular,
                            fontSize: Font.small,
                            textAlign: config.textRotate,
                            color: Colors.detailTitles,
                          }}>
                          {show_data?.vat_text}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.Regular,
                            fontSize: Font.small,
                            textAlign: config.textRotate,
                            color: Colors.detailTitles,
                          }}
                        >
                          {show_data?.vat_price}
                        </Text>
                      </View>

                    </View>

                    {/* ----------------------------------- */}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: vs(10),
                      }}>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: Font.medium,
                          color: Colors.Theme,
                        }}>
                        {Lang_chg.Total[config.language]}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: Font.medium,
                          color: Colors.Theme,
                        }}>
                        {show_data?.total_price + ' ' + this.state.currency_symbol}
                      </Text>
                    </View>

                  </View>
                </ScrollView>

              </View>
              :

              ((this.state.cart_arr == "" || this.state.cart_arr == null) && this.state.loadCart == false) ?

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
                    text={Lang_chg.BOOKNOW[config.language]}
                    btnStyle={{ marginTop: vs(20) }}
                    onPress={() => {
                      this.props.navigation.reset({
                        index: 0,
                        routes: [{ name: "DashboardStack" }],
                      });
                    }}
                  />

                </View>
                :
                null

          }
        </>



        {
          ((this.state.cart_arr != "" && this.state.cart_arr != null)) &&

          <View
            style={{
              width: "100%",
              alignSelf: "center",
              backgroundColor: Colors.White,
              paddingHorizontal: (windowWidth * 5) / 100,
              paddingVertical: (windowWidth * 2) / 100,
              height: 80,
              justifyContent: "center",
              alignItems: "center",
              position: 'absolute',
              bottom: 0
            }}>
            <Button
              text={Lang_chg.PROCEEDTOPAYMENT[config.language]}
              onPress={() => {
                if (this.state.payment_status == "true") {
                  this.startSDK();
                  // this.get_payment(), this.setState({ total_price: show_data.total_price })
                } else {
                  this.submit_btn(),
                    this.setState({ total_price: show_data.total_price });
                }
              }}
              onLoading={this.state.isLoading}
            />
          </View>

        }


        {/* ------------------------------Delete Modal-------------------------------------- */}

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible3}
          onRequestClose={() => {
            this.setState({ modalVisible3: false });
          }}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              this.setState({ modalVisible3: false });
            }}
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
                  borderRadius: 2,
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
                    {Lang_chg.confimation[config.language]}
                  </Text>
                </View>
                <View
                  style={{
                    alignSelf: "flex-start",
                    paddingVertical: (windowWidth * 1) / 100,
                    paddingLeft: (windowWidth * 4) / 100,
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
                    {Lang_chg.remove_msg[config.language]}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    width: "40%",
                    paddingBottom: (windowWidth * 5) / 100,
                    marginTop: (windowWidth * 9) / 100,
                    alignSelf: "flex-end",
                    right: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ modalVisible3: false });
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
                      {Lang_chg.no_txt[config.language]}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ modalVisible3: false }),
                        this.remove_cart(false, 'manual');
                    }}
                    activeOpacity={0.8}
                    style={{
                      width: (windowWidth * 40) / 100,
                      justifyContent: "center",
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
                      {Lang_chg.Delete[config.language]}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* -------------------------------payment model-------------------------------- */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.payment_moodal}
          onRequestClose={() => {
            this.setState({ payment_moodal: false });
          }}
        >
          <WebView
            source={{ uri: this.state.payment_url }}
            onNavigationStateChange={this._onNavigationStateChange.bind(this)}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            renderLoading={() => this.ActivityIndicatorElement()}
            startInLoadingState={false}
          />
        </Modal>
        {/* ----------------------------------------------sucess model -------------------------- */}

        <SuccessPopup
          visible={this.state.modalvisible}
          onRequestClose={() => {
            this.setState({ modalvisible: false })
          }}
          type={this.props?.route?.params?.providerType}
          navigation={this.props.navigation}
        />



      </View>
    );
  }
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

});
