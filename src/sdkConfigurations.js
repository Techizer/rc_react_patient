import RNGoSell from "@tap-payments/gosell-sdk-react-native";
const { Languages, PaymentTypes, AllowedCadTypes, TrxMode, SDKMode } =
  RNGoSell.goSellSDKModels;
const transactionCurrency = "sar";

const paymentitems = [
  {
    amount_per_unit: 1,
    description: "Item 1 Apple",
    discount: {
      type: "F",
      value: 10,
      maximum_fee: 1,
      minimum_fee: 1,
    },
    name: "item1",
    quantity: {
      value: 1,
    },
    // taxes: [
    // 	{
    // 		name: 'tax1',
    // 		description: 'tax describtion',
    // 		amount: {
    // 			type: 'F',
    // 			value: 10,
    // 			maximum_fee: 10,
    // 			minimum_fee: 1
    // 		}
    // 	}
    // ],
    total_amount: 400,
  },
];

const taxes = [
  {
    name: "tax1",
    description: "tax describtion",
    amount: { type: "F", value: 10.0, maximum_fee: 10.0, minimum_fee: 1.0 },
  },
  // {
  // 	name: 'tax1',
  // 	description: 'tax describtion',
  // 	amount: { type: 'F', value: 10.0, maximum_fee: 10.0, minimum_fee: 1.0 }
  // }
];
const customer = {
  isdNumber: "965",
  number: "00000000",
  customerId: "",
  first_name: "test",
  middle_name: "test",
  last_name: "test",
  email: "test@test.com",
};
const paymentReference = {
  track: "track",
  payment: "payment",
  gateway: "gateway",
  acquirer: "acquirer",
  transaction: "trans_910101",
  order: "order_262625",
  gosellID: null,
};

const appCredentials = {
  production_secrete_key:
    Platform.OS == "ios" ? "iOS-Live-KEY" : "Android-Live-KEY",
  language: Languages.EN,
  sandbox_secrete_key:
    Platform.OS == "ios"
      ? "sk_test_GICMqeoag2RbjpQPfutyrms8"
      : "sk_test_GICMqeoag2RbjpQPfutyrms8",
  bundleID:
    Platform.OS == "ios" ? "com.rootscare.patient" : "com.rootscare.patient",
};

const allConfigurations = {
  appCredentials: appCredentials,
  sessionParameters: {
    paymentStatementDescriptor: "paymentStatementDescriptor",
    transactionCurrency: "sar",
    isUserAllowedToSaveCard: true,
    paymentType: PaymentTypes.ALL,
    amount: global.amount_total,

    allowedCadTypes: AllowedCadTypes.ALL,
    paymentitems: "null", //paymentitems,
    paymenMetaData: { a: "a meta", b: "b meta" },
    applePayMerchantID: "applePayMerchantID",
    authorizeAction: { timeInHours: 10, time: 10, type: "CAPTURE" },
    cardHolderName: global.username,
    editCardHolderName: false,
    postURL: "https://www.tap.company/sa/en",
    paymentDescription: "paymentDescription",
    destinations: "null",
    // Here we can set the transaction mode as on of the available options on this URL:
    // See [https://github.com/Tap-Payments/gosellSDK-ReactNative#transaction_modes] to get transaction modes
    trxMode: TrxMode.TOKENIZE_CARD,
    taxes: taxes, //taxes,
    merchantID: "",
    SDKMode: SDKMode.Sandbox,
    customer: "null", //customer,
    isRequires3DSecure: false,
    receiptSettings: { id: null, email: false, sms: true },
    allowsToSaveSameCardMoreThanOnce: false,
    paymentReference: "null", //paymentReference
  },
};

export default allConfigurations;
