import React, { Component } from "react";
import {
  Platform,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from "react-native";

import {
  Colors,
  Font,
  mobileH,
  msgProvider,
  config,
  mobileW,
  localStorage,
  localimag,
  consolepro,
  Lang_chg,
  apifuntion,
  msgTitle,
} from "../Provider/utilslib/Utils";
import { WebView } from "react-native-webview";
import Styles from "../Styles";
import Footer from "../Footer";
import RNGoSell from "@tap-payments/gosell-sdk-react-native";
import HideWithKeyboard from "react-native-hide-with-keyboard";

const { Languages, PaymentTypes, AllowedCadTypes, TrxMode, SDKMode } =
  RNGoSell.goSellSDKModels;

const appCredentials = {
  production_secrete_key:
    Platform.OS == "ios"
      ? "sk_live_Ectf8odVHCWTl3ymhz9IM6vD"
      : "sk_live_6GPzSurWAK9ng1C7yUq8wOeh",
  language: Languages.EN,
  sandbox_secrete_key:
    Platform.OS == "ios"
      ? "sk_test_wvbqQkEMJCSXTDrt9Pay2pFg"
      : "sk_test_KOfdbVzDXW7JreslyPL2g1nN",
  bundleID:
    Platform.OS == "ios" ? "com.patient.rootscare" : "com.rootscare",
};

export default class Cart extends Component {
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
        customer: [],
        user_id: "",
        message: "",
        task_details: "",
        notification_count: "",
        transaction_id: "",
        payment_status: "true",
        currency_symbol: "",
        payment_mode_country: "sar",

        //-----payment start ------//

        appCredentials: {
          production_secrete_key:
            Platform.OS == "ios"
              ? "sk_live_Ectf8odVHCWTl3ymhz9IM6vD"
              : "sk_live_6GPzSurWAK9ng1C7yUq8wOeh",
          language: Languages.EN,
          sandbox_secrete_key:
            Platform.OS == "ios"
              ? "sk_test_wvbqQkEMJCSXTDrt9Pay2pFg"
              : "sk_test_KOfdbVzDXW7JreslyPL2g1nN",
          bundleID:
            Platform.OS == "ios"
              ? "com.patient.rootscare"
              : "com.rootscare",
        },

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
      screens = "Cart";
    }
    cart_customer = [];
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
  }
  componentDidMount() {
    this.props.navigation.addListener("focus", () => {
      this.get_cart();
      this.get_all_notification();
      this.get_paysttus();
    });
  }

  startSDK() {
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
        customer: cart_customer,
        isRequires3DSecure: true,
        receiptSettings: { id: null, email: false, sms: true },
        allowsToSaveSameCardMoreThanOnce: false,
        paymentReference: "null",
        // uiDisplayMode: UiDisplayModes.DARK
      },
    };

    //console.log('start SDK');
    //try {
    // console.log('iM')
    // if (require('expo-constants').default.appOwnership === 'expo') {
    // 	alert('PLEASE EJECT EXPO TO RUN native_modules');
    // 	return;
    // }
    //}// catch (error) {
    // console.log('i am here')
    //  console.log(error);

    // }
    //console.log(this.sdkModule);

    // startPayment(sdkConfigurations, terminationTimeoutInMilliseconds, this.handleResult)
    // Set terminationTimeoutInMilliseconds to 0 to prevent termination the session automatically

    //consolepro.consolelog('res',res)

    try {
      var res =
        this.sdkModule &&
        this.sdkModule.startPayment(appCredentialsLocal, 0, this.handleResult);
    } catch (e) {
      console.log("skkk");
      console.log(e);
    }
  }

  handleResult(error, status) {
    console.log("sumit");
    var myString = JSON.stringify(status);
    console.log("status is " + status.sdk_result);
    console.log(myString);
    var resultStr = String(status.sdk_result);
    switch (resultStr) {
      case "SUCCESS":
        this.handleSDKResult(status);
        this.submit_btn();
        break;
      case "FAILED":
        this.handleSDKResult(status);
        break;
      case "SDK_ERROR":
        console.log("sdk error............");
        console.log(status["sdk_error_code"]);
        console.log(status["sdk_error_message"]);
        console.log(status["sdk_error_description"]);
        console.log("sdk error............");
        break;
      case "NOT_IMPLEMENTED":
        break;
    }
    this.changeState(resultStr, myString, () => {
      console.log("done");
    });
  }

  handleSDKResult(result) {
    console.log("trx_mode::::", result);
    console.log(result["trx_mode"]);
    switch (result["trx_mode"]) {
      case "CHARGE":
        console.log("Charge");
        console.log(result);
        console.log(result.status);

        if (result.status == "CAPTURED") {
          this.setState({ transaction_id: result.charge_id });
        } else {
          // console.log('payment error', msgText.Payment_fail[config.language]);
          setTimeout(function () {
            msgProvider.showError(result.message);
            return false;
          }, 1000);
        }

        // this.printSDKResult(result);
        break;

      case "AUTHORIZE":
        this.printSDKResult(result);
        break;

      case "SAVE_CARD":
        this.printSDKResult(result);
        break;

      case "TOKENIZE":
        // Object.keys(result).map((key) => {
        //   if( key=='token')
        //   {
        //     console.log(`muskasn\t${key}:\t\t\t${result[key]}`);
        //     this.setState({transaction_id:result[key]})
        //   }

        // });

        break;
    }
  }

  printSDKResult(result) {
    if (!result) return;
    Object.keys(result).map((key) => {
      console.log(`${result["trx_mode"]}\t${key}:\t\t\t${result[key]}`);
    });
  }

  changeState(newName, resultValue, callback) {
    console.log("the new value is" + newName);
    this.setState(
      {
        statusNow: newName,
        result: resultValue,
      },
      callback
    );
  }

  get_paysttus = async () => {
    let user_details = await localStorage.getItemObject("user_arr");

    let url =
      "https://rootscare.net/application/payment/pages/rootscare_onoff.php";
    console.log("url", url);

    apifuntion
      .getApi(url, 1)
      .then((obj) => {
        consolepro.consolelog("obj", obj.success);
        if (obj.success == "true") {
          this.setState({ payment_status: obj.payment_status });
          console.log("paystatus", obj.payment_status);
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log("-------- error ------- " + error);
      });
  };
  get_all_notification = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    console.log("user_details user_details", user_details);
    let user_id = user_details["user_id"];

    let url = config.baseURL + "api-notification-count";
    console.log("url", url);
    var data = new FormData();
    data.append("login_user_id", user_id);

    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        consolepro.consolelog("obj", obj);
        if (obj.status == true) {
          this.setState({ notification_count: obj.result });
          console.log("obj nationaltity", obj);
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

    console.log("customer", customer);
    cart_customer = customer;
    this.setState({ user_id: user_id, customer: customer });
    let url = config.baseURL + "api-patient-cart-details";
    console.log("url", url);

    var data = new FormData();
    data.append("login_user_id", user_id);

    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        consolepro.consolelog("obj", obj);

        if (obj.status == true) {
          console.log("muskan test cart", obj.result[0]);
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
          localStorage.setItemObject("cart_sendarr", obj.result[0]);
        } else {
          this.setState({ cart_arr: obj.result });
          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
      });
  };

  remove_cart = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];
    let url = config.baseURL + "api-patient-remove-cart";
    console.log("url", url);

    var data = new FormData();
    data.append("cart_id", this.state.cart_id);

    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        consolepro.consolelog("obj", obj);

        if (obj.status == true) {
          console.log("hello hello", obj.result);
          this.get_cart();

          msgProvider.showSuccess(obj.message);
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
        console.log("file name muska", t);
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
    console.log("url", url);
    var data = new FormData();
    console.log("data", data);

    data.append("service_type", this.state.service_type);
    data.append("login_user_id", user_id);
    data.append("cart_id", this.state.cart_id);
    data.append("trid", transaction_id);
    // data.append('family_member_id',this.state.family_member_id)
    // data.append('provider_id',this.state.provider_id)

    apifuntion
      .postApi(url, data, 0)
      .then((obj) => {
        if (obj.status == true) {
          console.log("obj", obj);
          var message_new;
          if (obj.result == null) {
            message_new = obj.message;
          } else {
            message_new = obj.result;
          }

          this.setState({ payment_moodal: false });

          // PushNotification.localNotification({
          //   channelId:'rootscares1', //his must be same with channelid in createchannel
          //   title:'Appoinment Booking',
          //   message:message_new,
          //   priority: "high",
          // })
          setTimeout(() => {
            this.get_cart();
            this.setState({ modalvisible: true });
          }, 300);

          setTimeout(() => {
            this.setState({ modalvisible: false }, () => {
              this.props.navigation.navigate("Appointment");
            });

          }, 5000);

          global.username = "NA";
          global.amount_total = 1;
        } else {
          this.setState({ message: obj.message });
          setTimeout(() => {
            msgProvider.alert("", obj.message, false);
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
  ActivityIndicatorElement = () => {
    //making a view to show to while loading the webpage
    return (
      <ActivityIndicator
        color={Colors.theme_color}
        size="large"
        style={{
          position: "absolute",
          top: (mobileH * 40) / 100,
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
    //  var item = this.state.cart_arr
    consolepro.consolelog("show_data", show_data);
    //  consolepro.consolelog('muskan',item)
    return (
      <View style={Styles.container1}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            paddingBottom: (mobileW * 10) / 100,
          }}
        >
          {/* <Text>Home</Text> */}
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              alignSelf: "center",
              paddingVertical: (mobileW * 3) / 100,
              backgroundColor: Colors.white_color,
              borderBottomWidth: 1,
              borderBottomColor: Colors.LIGHT_CLIENT_BORDER,

              alignItems: "center",
            }}
          >
            <View
              style={{
                padding: (mobileW * 2.5) / 100,
                flexDirection: "row",
                width: "100%",

                alignSelf: "center",
                paddingTop: (mobileW * 3) / 100,
                backgroundColor: Colors.white_color,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: "10%",
                  // backgroundColor: 'pink',
                  alignSelf: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("Home");
                  }}
                >
                  <Image
                    source={
                      config.textalign == "right"
                        ? localimag.arabic_back
                        : localimag.backarrow
                    }
                    style={{
                      resizeMode: "contain",
                      width: (mobileW * 9) / 100,
                      alignSelf: "center",
                      height: (mobileW * 9) / 100,
                    }}
                  ></Image>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  // backgroundColor: 'yellow',
                  width: "80%",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontFamily: Font.fontmedium,
                    fontSize: (mobileW * 4) / 100,
                  }}
                >
                  {Lang_chg.CartItem[config.language]}
                </Text>
              </View>
              <View
                style={{
                  width: "10%",
                  alignSelf: "center",
                  // backgroundColor: 'red',
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("Notifications");
                  }}
                >
                  <Image
                    // tintColor="#fff"
                    source={
                      this.state.notification_count > 0
                        ? localimag.notifications
                        : localimag.notifications_sec
                    }
                    style={{
                      alignSelf: "center",
                      resizeMode: "contain",
                      width: (mobileW * 6) / 100,
                      height: (mobileW * 6) / 100,
                    }}
                  ></Image>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {this.state.cart_arr != "" && this.state.cart_arr != null && (
            <ScrollView
              style={{
                flex: 1,
                backgroundColor: "#fff",
              }}
              contentContainerStyle={{ paddingBottom: (mobileW * 2) / 100 }}
              showsVerticalScrollIndicator={false}
            >
              <View
                style={[
                  { backgroundColor: "#fff" },
                  this.state.task_details.length <= 3
                    ? { height: (mobileH * 77) / 100 }
                    : { height: (mobileH * 95) / 100 },
                ]}
              >
                <View
                  style={{
                    backgroundColor: "#fff",
                    marginBottom: (mobileW * 3) / 100,
                    marginTop: (mobileW * 2) / 100,
                    shadowOpacity: 0.3,
                    shadowColor: "#000",
                    shadowOffset: { width: 1, height: 1 },
                    elevation: 3,
                    shadowRadius: 2,
                  }}
                >
                  <View>
                    {/* <View style={{width: '100%', alignSelf: 'center'}}> */}
                    <View
                      style={{
                        alignItems: "center",
                        flexDirection: "row",
                        paddingVertical: (mobileW * 3) / 100,
                        width: "90%",
                        alignSelf: "center",
                        justifyContent: "space-between",
                        // marginTop:mobileW*2/100
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          width: "83%",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Font.fontmedium,
                            fontSize: (mobileW * 3.9) / 100,
                            color: Colors.gray4,
                          }}
                        >
                          {this.state.provider_name}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.fontmedium,
                            fontSize: Font.cart2subtext,
                            color: Colors.theme_color,
                            marginLeft: (mobileW * 4) / 100,
                          }}
                        >
                          {show_data.service_display_type}
                        </Text>
                      </View>

                      <View style={{}}>
                        <View
                          style={{
                            alignSelf: "center",
                            alignSelf: "flex-end",
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({ modalVisible3: true });
                            }}
                          >
                            <Image
                              source={localimag.cross}
                              style={{
                                resizeMode: "contain",
                                backgroundColor: Colors.white_color,
                                width: (mobileW * 5.5) / 100,
                                height: (mobileW * 5.5) / 100,
                                alignSelf: "center",
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>

                    {/* border */}
                    <View
                      style={{
                        borderTopWidth: 0.5,
                        borderColor: Colors.gainsboro,

                        marginTop: (mobileW * 1) / 100,
                        // marginVertical: (mobileW * 3) / 100,
                      }}
                    />
                    <View style={{ width: "90%", alignSelf: "center" }}>
                      <View>
                        <Text
                          style={{
                            fontFamily: Font.fontmedium,
                            fontSize: Font.cart2heading,
                            color: Colors.theme_color,
                            paddingBottom: (mobileW * 3.5) / 100,
                            paddingTop: (mobileW * 2) / 100,
                            textAlign: config.textRotate,
                          }}
                        >
                          {Lang_chg.Appointment_footer[config.language]}
                        </Text>
                      </View>

                      <View
                        style={{
                          backgroundColor: "#fff",
                          marginBottom: (mobileW * 3.5) / 100,
                        }}
                      >
                        <View style={{}}>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            {/* image and store name */}

                            <View
                              style={{
                                width: "50%",
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: Font.fontmedium,
                                  color: Colors.theme_color,
                                  fontSize: (mobileW * 3.5) / 100,
                                  textAlign: config.textRotate,
                                }}
                              >
                                {Lang_chg.Date[config.language]}
                              </Text>
                              <Text
                                style={{
                                  fontFamily: Font.fontmedium,
                                  fontSize: Font.cart2subtext,
                                  textTransform: "uppercase",
                                  color: Colors.darkgraytextheading,
                                  textAlign: config.textRotate,

                                  paddingTop: (mobileW * 1) / 100,
                                }}
                              >
                                {show_data.display_app_date}
                              </Text>

                              <View
                                style={{
                                  borderWidth: 1,
                                  borderColor: Colors.theme_color,
                                  marginTop: (mobileW * 2) / 100,
                                  paddingVertical: (mobileW * 1) / 100,
                                  width: "75%",
                                  justifyContent: "center",
                                  borderRadius: (mobileW * 1) / 100,
                                }}
                              >
                                <Text
                                  style={{
                                    fontFamily: Font.fontmedium,
                                    fontSize: (mobileW * 3) / 100,
                                    color: Colors.theme_color,
                                    textAlign: "center",
                                  }}
                                >
                                  {show_data.display_task_type}
                                </Text>
                              </View>
                            </View>

                            <View
                              style={{
                                width: "50%",
                                marginRight: (mobileW * 3) / 100,
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: Font.fontmedium,
                                  color: Colors.theme_color,
                                  fontSize: (mobileW * 3.5) / 100,
                                  textAlign: config.textRotate,
                                }}
                              >
                                {Lang_chg.Time[config.language]}
                              </Text>
                              <Text
                                style={{
                                  fontFamily: Font.fontmedium,
                                  fontSize: Font.cart2subtext,
                                  color: Colors.darkgraytextheading,
                                  textAlign: config.textRotate,
                                  paddingTop: (mobileW * 1) / 100,
                                }}
                              >
                                {show_data.from_time} - {show_data.to_time}
                              </Text>

                              <View
                                style={{
                                  width: "100%",
                                  flexDirection: "row",
                                  paddingVertical: (mobileW * 2) / 100,
                                  borderRadius: (mobileW * 1) / 100,
                                  alignItems: "center",
                                  marginTop: (mobileW * 1) / 100,
                                }}
                              >
                                {config.language == 0 ? (
                                  <Image
                                    source={localimag.clock}
                                    style={{
                                      tintColor: Colors.theme_color,
                                      resizeMode: "contain",
                                      width: (mobileW * 4) / 100,
                                      height: (mobileW * 4) / 100,
                                    }}
                                  ></Image>
                                ) : (
                                  <Image
                                    source={localimag.clock_arabic}
                                    style={{
                                      tintColor: Colors.theme_color,
                                      resizeMode: "contain",
                                      width: (mobileW * 4) / 100,
                                      height: (mobileW * 4) / 100,
                                    }}
                                  ></Image>
                                )}

                                <Text
                                  style={{
                                    color: Colors.theme_color,
                                    fontFamily: Font.fontregular,
                                    fontSize: (mobileW * 3.3) / 100,
                                    marginLeft: (mobileW * 1.5) / 100,
                                    textAlign: config.textRotate,
                                  }}
                                >
                                  {show_data.display_task_time}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View
                      style={{
                        backgroundColor: "#F1F2F4",

                        paddingVertical: (mobileW * 3) / 100,
                      }}
                    >
                      <View style={{ width: "90%", alignSelf: "center" }}>
                        <View>
                          <Text
                            style={{
                              fontFamily: Font.fontmedium,
                              fontSize: Font.cart2heading,
                              color: Colors.theme_color,
                              textAlign: config.textRotate,
                              paddingTop: (mobileW * 1) / 100,
                            }}
                          >
                            {Lang_chg.Payment[config.language]}
                          </Text>
                        </View>
                        <FlatList
                          data={show_data.task_details}
                          renderItem={({ item, index }) => {
                            consolepro.consolelog("helooo", item);
                            if (item.task_details != "") {
                              return (
                                <View
                                  style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    paddingVertical: (mobileW * 1.5) / 100,
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontFamily: Font.fontregular,
                                      fontSize: (mobileW * 3.3) / 100,
                                      textAlign: config.textRotate,
                                      color: "#000",
                                      width: "70%",
                                    }}
                                    numberOfLines={1}
                                  >
                                    {item.name}
                                  </Text>
                                  <Text
                                    style={{
                                      fontFamily: Font.fontregular,
                                      fontSize: (mobileW * 3.3) / 100,
                                      width: "30%",
                                      textAlign: "right",
                                      color: "#000",
                                    }}
                                  >
                                    {item.price}
                                  </Text>
                                </View>
                              );
                            }
                          }}
                        />
                        {show_data.display_task_type !==
                          "Online consultation" && (
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                paddingVertical: (mobileW * 2) / 100,
                                borderTopWidth: (mobileW * 0.3) / 100,
                                borderColor: Colors.bordercolor,
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: Font.fontregular,
                                  fontSize: (mobileW * 3.3) / 100,
                                  color: "#000",
                                }}
                              >
                                {show_data.distance_fare_text}
                              </Text>
                              <Text
                                style={{
                                  fontFamily: Font.fontregular,
                                  fontSize: (mobileW * 3.3) / 100,
                                  color: "#000",
                                }}
                              >
                                {show_data.distance_fare}
                              </Text>
                            </View>
                          )}
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingVertical: (mobileW * 2) / 100,
                            borderTopWidth: (mobileW * 0.3) / 100,
                            borderColor: Colors.bordercolor,
                            // marginTop: mobileW * 0.5 / 100,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: Font.fontmedium,
                              fontSize: (mobileW * 3.7) / 100,
                              color: Colors.theme_color,
                              // marginTop: mobileW * 1 / 100,
                            }}
                          >
                            {Lang_chg.subTotal[config.language]}
                          </Text>
                          <Text
                            style={{
                              fontFamily: Font.fontmedium,
                              fontSize: (mobileW * 3.7) / 100,
                              color: Colors.theme_color,
                              // marginTop: mobileW * 1 / 100,
                            }}
                          >
                            {show_data.sub_total_price}{" "}
                            {this.state.currency_symbol}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingVertical: (mobileW * 2) / 100,
                            // borderBottomWidth: (mobileW * 0.3) / 100,
                            borderColor: Colors.bordercolor,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: Font.fontregular,
                              fontSize: (mobileW * 3.3) / 100,
                              color: "#000",
                            }}
                          >
                            {show_data.vat_text}
                          </Text>
                          <Text
                            style={{
                              fontFamily: Font.fontregular,
                              fontSize: (mobileW * 3.3) / 100,
                              color: "#000",
                            }}
                          >
                            {show_data.vat_price}
                          </Text>
                        </View>
                        <View
                          style={{
                            width: "100%",

                            borderWidth: 0.5,
                            borderColor: Colors.bordercolor,
                          }}
                        />
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: (mobileW * 2) / 100,
                            // paddingVertical: (mobileW * 3) / 100,
                            // borderTopWidth: (mobileW * 0.3) / 100,
                            // borderColor: Colors.bordercolor,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: Font.fontmedium,
                              fontSize: (mobileW * 3.5) / 100,
                              color: Colors.theme_color,
                              textAlign: config.textRotate,
                            }}
                          >
                            {Lang_chg.Total[config.language]}
                          </Text>
                          <Text
                            style={{
                              fontFamily: Font.fontmedium,
                              fontSize: (mobileW * 3.5) / 100,
                              color: Colors.theme_color,
                            }}
                          >
                            {show_data.total_price} {this.state.currency_symbol}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
                {/* <TouchableOpacity
                  onPress={() => {
                    if (this.state.payment_status == "true") {
                      this.startSDK();
                      //     this.get_payment(),this.setState({total_price:show_data.total_price})
                    } else {
                      this.submit_btn(),
                        this.setState({ total_price: show_data.total_price });
                    }
                  }}
                  style={{
                    width: "90%",
                    alignSelf: "center",
                    borderRadius: (mobileW * 2) / 100,
                    backgroundColor: Colors.buttoncolorblue,
                    paddingVertical: (mobileW * 4) / 100,
                    position: "absolute",
                    bottom: 20,
                    marginBottom: (mobileW * 5) / 100,
                  }}
                >
                  <Text
                    style={{
                      color: Colors.textwhite,
                      fontFamily: Font.fontmedium,
                      fontSize: Font.buttontextsize,
                      alignSelf: "flex-end",
                      textAlign: config.textalign,
                      alignSelf: "center",
                    }}
                  >
                    {Lang_chg.PROCEEDTOPAYMENT[config.language]}
                  </Text>
                </TouchableOpacity> */}
              </View>
            </ScrollView>
          )}
          {this.state.cart_arr == "" ||
            (this.state.cart_arr == null && (
              <View
                style={{
                  width: "90%",
                  alignSelf: "center",
                  marginTop: (mobileW * 5) / 100,
                }}
              >
                <Image
                  style={{
                    width: (mobileW * 35) / 100,
                    height: (mobileW * 50) / 100,
                    alignSelf: "center",
                    resizeMode: "contain",
                  }}
                  source={localimag.Emptycart}
                />

                <Text
                  style={{
                    color: Colors.theme_color,
                    fontFamily: Font.fontregular,
                    fontSize: (mobileW * 4) / 100,
                    textAlign: "center",
                  }}
                >
                  Cart Details not found.
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.goBack();
                  }}
                  style={{
                    width: "90%",
                    alignSelf: "center",
                    borderRadius: (mobileW * 2) / 100,
                    backgroundColor: Colors.buttoncolorblue,
                    paddingVertical: (mobileW * 4) / 100,
                    marginTop: (mobileW * 8) / 100,
                  }}
                >
                  <Text
                    style={{
                      color: Colors.textwhite,
                      fontFamily: Font.fontmedium,
                      fontSize: Font.buttontextsize,
                      alignSelf: "flex-end",
                      textAlign: config.textalign,
                      alignSelf: "center",
                    }}
                  >
                    {Lang_chg.BOOKNOW[config.language]}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
        </View>
        <Modal
          animationType="slide"
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
            }}
          >
            <StatusBar
              backgroundColor={"#fff"}
              barStyle="default"
              hidden={false}
              translucent={false}
              networkActivityIndicatorVisible={true}
            />
            <View
              style={{
                borderRadius: 20,
                width: (mobileW * 90) / 100,
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
                    width: (mobileW * 50) / 100,
                    paddingVertical: (mobileW * 3) / 100,
                    marginTop: (mobileW * 2) / 100,
                    paddingLeft: (mobileW * 4) / 100,
                    flexDirection: "row",
                  }}
                >
                  <Image
                    style={{
                      width: (mobileW * 6) / 100,
                      height: (mobileW * 6) / 100,
                    }}
                    source={require("../icons/logo.png")}
                  />
                  <Text
                    style={{
                      fontFamily: Font.fontmedium,
                      color: "#000",
                      fontSize: (mobileW * 5) / 100,
                      paddingLeft: (mobileW * 4) / 100,
                    }}
                  >
                    {Lang_chg.confimation[config.language]}
                  </Text>
                </View>
                <View
                  style={{
                    alignSelf: "flex-start",
                    paddingVertical: (mobileW * 1) / 100,
                    paddingLeft: (mobileW * 4) / 100,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Font.fontregular,
                      color: "#000",
                      fontSize: (mobileW * 4) / 100,
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
                    paddingBottom: (mobileW * 5) / 100,
                    marginTop: (mobileW * 9) / 100,
                    alignSelf: "flex-end",
                    right: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ modalVisible3: false });
                    }}
                    style={{
                      width: (mobileW * 15) / 100,
                      flexDirection: "row",
                      alignSelf: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Font.fontregular,
                        fontSize: (mobileW * 4) / 100,
                        color: Colors.bordercolorblue,
                        alignSelf: "center",
                      }}
                    >
                      {Lang_chg.no_txt[config.language]}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ modalVisible3: false }),
                        this.remove_cart();
                    }}
                    activeOpacity={0.8}
                    style={{
                      width: (mobileW * 40) / 100,
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Font.fontregular,
                        fontSize: (mobileW * 4) / 100,
                        color: Colors.bordercolorblue,
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
          animationType="slide"
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalvisible}
          onRequestClose={() => { }}
        >
          <View
            style={{
              flex: 1,
              alignSelf: "center",
              justifyContent: "center",
              backgroundColor: "#00000080",
              width: "100%",
            }}
          >
            <View
              style={{
                width: "100%",
                backgroundColor: "white",
                borderRadius: (mobileW * 4) / 100,
                position: "absolute",
                bottom: 0,
                alignItems: "center",
                justifyContent: "center",
                paddingBottom: (mobileW * 5) / 100,
                alignSelf: "center",
              }}
            >
              <Image
                style={{
                  width: (mobileW * 15) / 100,
                  height: (mobileW * 15) / 100,
                  alignSelf: "center",
                  marginTop: (mobileW * -5) / 100,
                }}
                source={localimag.greentick}
              />
              <Text
                style={{
                  fontSize: (mobileW * 8) / 100,
                  marginTop: (mobileW * 5) / 100,
                  fontFamily: Font.fontmedium,
                  textAlign: config.textalign,
                }}
              >
                {Lang_chg.thank[config.language]}
              </Text>
              <Text
                style={{
                  fontSize: (mobileW * 3) / 100,
                  marginTop: (mobileW * 5) / 100,
                  fontFamily: Font.fontmedium,
                  textAlign: config.textalign,
                }}
              >
                {Lang_chg.success[config.language]}
              </Text>

              <Text
                style={{
                  fontSize: (mobileW * 3) / 100,
                  marginTop: (mobileW * 1) / 100,
                  fontFamily: Font.fontmedium,
                  textAlign: config.textalign,
                  color: Colors.textgray,
                }}
              >
                {Lang_chg.appoinment_aucess[config.language]}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  this.setState({ modalvisible: false });
                  this.props.navigation.navigate("Appointment");
                }}
                style={{
                  // width: '15%',
                  alignSelf: "center",
                  borderColor: Colors.bordercolorblue,
                  borderWidth: 1,
                  padding: (mobileW * 2) / 100,
                  paddingHorizontal: (mobileW * 3) / 100,
                  marginTop: (mobileW * 5) / 100,
                  borderRadius: (mobileW * 2) / 100,
                }}
              >
                <Text
                  style={{
                    fontSize: (mobileW * 3) / 100,
                    alignSelf: "center",
                    fontFamily: Font.fontsemibold,
                    textAlign: config.textalign,
                    alignSelf: "center",
                    color: Colors.terms_text_color_blue,
                  }}
                >
                  {Lang_chg.Gotoappointment[config.language]}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <HideWithKeyboard>
          {/* <Footer
            activepage="Cart"
            usertype={1}
            footerpage={[
              {
                name: "Home",
                fname: Lang_chg.home_footer[config.language],
                countshow: false,
                image: localimag.Home,
                activeimage: localimag.Home,
              },
              {
                name: "Appointment",
                fname: Lang_chg.Appointment_footer[config.language],
                countshow: false,
                image: localimag.Appointment,
                activeimage: localimag.Appointment,
              },
              {
                name: "Cart",
                fname: Lang_chg.Cart_footer[config.language],
                countshow: false,
                image: localimag.Cart,
                activeimage: localimag.Cart,
              },
              {
                name: "More",
                fname: Lang_chg.More_footer[config.language],
                countshow: false,
                image: localimag.More,
                activeimage: localimag.More,
              },
            ]}
            navigation={this.props.navigation}
            imagestyle1={{
              width: 25,
              height: 25,
              paddingBottom: (mobileW * 5.4) / 100,
              backgroundColor: "white",
              countcolor: "red",
              countbackground: "red",
            }}
          /> */}
        </HideWithKeyboard>
        {this.state.cart_arr != "" && this.state.cart_arr != null && (
          <View
            style={{
              width: "100%",
              alignSelf: "center",
              backgroundColor: Colors.white_color,
              paddingHorizontal: (mobileW * 5) / 100,
              paddingVertical: (mobileW * 2) / 100,
              height: 80,
              justifyContent: "center", //Centered horizontally
              alignItems: "center", //Centered vertically
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if (this.state.payment_status == "true") {
                  this.startSDK();
                  //     this.get_payment(),this.setState({total_price:show_data.total_price})
                } else {
                  this.submit_btn(),
                    this.setState({ total_price: show_data.total_price });
                }
              }}
              style={{
                width: "100%",
                alignSelf: "center",
                borderRadius: (mobileW * 2) / 100,
                backgroundColor: Colors.buttoncolorblue,
                paddingVertical: (mobileW * 4) / 100,
                position: "absolute",
                bottom: 20,
                marginBottom: (mobileW * 5) / 100,
              }}
            >
              <Text
                style={{
                  color: Colors.textwhite,
                  fontFamily: Font.fontmedium,
                  fontSize: Font.buttontextsize,
                  alignSelf: "flex-end",
                  textAlign: config.textalign,
                  alignSelf: "center",
                }}
              >
                {Lang_chg.PROCEEDTOPAYMENT[config.language]}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}
