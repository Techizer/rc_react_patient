import {
  Keyboard,
  FlatList,
  Modal,
  Text,
  View,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  Platform,
} from "react-native";
import React, { Component, useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Colors,
  Icons,
  Font,
  config,
  windowWidth,
  apifuntion,
  msgProvider,
  LangProvider,
  Button
} from "../Provider/Utils/Utils";
import AuthInputBoxSec from "../Components/AuthInputBoxSec";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import { leftArrow, Logo, rightArrow } from "../Icons/Index";
import { useSelector } from "react-redux";
import NumberInput from "../Components/NumberInput";
import Alert from "../ModalContent/Alert"

const Signup = ({ navigation }) => {

  const { appLanguage, deviceToken, deviceType, contentAlign, languageIndex } = useSelector(state => state.StorageReducer)

  const [registerData, setRegisterData] = useState({
    code: '966',
    number: '',
    showCountries: false,
    country_name: "",
    registerModal: false,
    countryModal: false,
    countryList: '',
    message: "",
    country_short_code: "",
    isLoading: false
  })

  const insets = useSafeAreaInsets()


  useEffect(() => {
    // getCountriesList()
  }, [])


  const setState = (payload) => {
    setRegisterData(prev => ({
      ...prev,
      ...payload
    }))
  }

  const registerUser = async () => {
    Keyboard.dismiss();


    if (
      registerData.code.length <= 0 ||
      registerData.code.trim().length <= 0
    ) {
      msgProvider.showError(LangProvider.emptyCountrycode[languageIndex]);
      return false;
    }

    if (registerData.number.length <= 0 || registerData.number.trim().length <= 0) {
      msgProvider.showError(LangProvider.emptymobileNumber[languageIndex]);
      return false;
    }

    setState({ isLoading: true })

    let url = config.baseURL + "api-patient-registration-otp-send";
    var phone_number_send = registerData.code + registerData.number;
    var data = new FormData();

    data.append("countrycode", registerData.code);
    data.append("phone_number", `${registerData.code}${registerData.number}`);
    data.append("device_type", deviceType);
    data.append("device_lang", appLanguage);
    data.append("fcm_token", deviceToken);

    // console.log("data", data);
    // return
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        setState({ isLoading: false })

        console.log("registerUser: ", obj);
        if (obj.status == true) {
          setTimeout(() => {
            setState({ message: obj.message, registerModal: true })
          }, 300);
        } else {
          setTimeout(() => {
            msgProvider.showError(obj.message)
          }, 300);
          // }
          return false;
        }
      }).catch((error) => {
        setState({ isLoading: false })
        console.log("registerUser-error ------- " + error);
      });
  };

  const getCountriesList = async () => {
    let url = config.baseURL + "api-medical-service-area";
    apifuntion.getApi(url, 1).then((obj) => {
      // console.log("getCountriesList: ", obj);
      if (obj.status == true) {
        setRegisterData(prevState => ({
          ...prevState,
          countryList: obj.result,
          country_name: obj.result[0].name,
          code: obj.result[0].country_code,
          country_short_code: obj.result[0].country_short_code,
        }))
      } else {
        return false;
      }
    }).catch((error) => {
      console.log("getCountriesList-error ------- " + error);
    });
  };

  return (
    <View
      pointerEvents={registerData.isLoading ? 'none' : 'auto'}
      style={{ flex: 1, backgroundColor: Colors.White, paddingTop: insets.top, paddingBottom: insets.bottom }}>

      <KeyboardAwareScrollView
        // keyboardOpeningTime={200}
        extraScrollHeight={50}
        enableOnAndroid={true}
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{
          justifyContent: 'center',
          paddingBottom: vs(50),
        }}
        showsVerticalScrollIndicator={false}>

        <View
          style={{
            width: "100%",
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: vs(40),
          }}>
          <View style={{ justifyContent: 'center' }}>
            {/* <SvgXml xml={Logo} /> */}
            <Image source={Icons.logo} style={{ height: windowWidth - 320, height: windowWidth - 325 }} resizeMode='contain' />

          </View>

          <TouchableHighlight
            underlayColor={Colors.Highlight}
            onPress={() => {
              navigation.pop();
            }}
            style={{ position: 'absolute', left: 0, height: vs(40), width: s(40), justifyContent: 'center', alignItems: 'center' }}
          >
            <SvgXml xml={contentAlign == "right" ? rightArrow : leftArrow} height={vs(17.11)} width={s(9.72)} />
          </TouchableHighlight>
        </View>

        <View
          style={{
            width: "90%",
            alignSelf: "center",
            marginTop: vs(25)
          }}>

          <Text
            style={{
              fontSize: Font.xxxlarge,
              fontFamily: Font.Medium,
              // textAlign: contentAlign,
              alignSelf: 'flex-start',
              color: Colors.darkText
            }}>
            {LangProvider.Signup[languageIndex]}
          </Text>
          <Text
            style={{
              // textAlign: contentAlign,
              alignSelf: 'flex-start',
              fontSize: Font.medium,
              fontFamily: Font.Regular,
              color: Colors.inActiveText,
              marginTop: vs(4)
            }}
          >
            {LangProvider.Signuptext1[languageIndex]}
          </Text>

        </View>
        {/* -----------------------------------------------------------------------------Country Picker- */}


        {/* <TouchableOpacity
            onPress={() => {
              setRegisterData(prevState => ({
                ...prevState,
                countryModal: true
              }))
            }}
            style={{
              width: "100%",
              height: 48,
              alignSelf: "center",
              borderColor: Colors.Border,
              borderWidth: 1,
              backgroundColor: Colors.backgroundcolor,
              borderRadius: (windowWidth * 1) / 100,
              justifyContent: 'center',
              marginTop: vs(13),
            }}>
            <View
              style={{
                width: "95%",
                alignSelf: "center",
                flexDirection: "row",
                justifyContent: "space-between",
              }} >
              <Text
                style={{
                  fontSize: (windowWidth * 3.7) / 100,
                  fontFamily: Font.Regular,
                  textAlign: contentAlign,
                }}>
                {registerData.country_name.length <= 0
                  ? LangProvider.select[languageIndex]
                  : registerData.country_name}
              </Text>

              <View style={{ width: "20%", alignSelf: "center" }}>
                <Image
                  style={{
                    height: (windowWidth * 4) / 100,
                    width: (windowWidth * 4) / 100,
                    alignSelf: "flex-end",
                  }}
                  source={Icons.downarrow}
                ></Image>
              </View>
            </View>
          </TouchableOpacity> */}

        <NumberInput
          details={registerData}
          onOpen={() => {
            setState({ showCountries: !registerData.showCountries })
          }}
          onSelect={(item) => {
            setState({ showCountries: false, code: item.code })
          }}
          onChangeText={(val) => {
            setState({ number: val })
          }}
        />

        {/* ---------------------------------------------------------------------------idno */}

        <View
          style={{
            width: "90%",
            alignSelf: "center",
          }}>
          <Button
            text={LangProvider.btntext[languageIndex]}
            onPress={() => registerUser()}
            btnStyle={{ marginTop: vs(15) }}
            onLoading={registerData.isLoading}
          />

          <View
            style={{
              width: "90%",
              alignSelf: "center",
              marginTop: vs(12),
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center'
            }}>

            <Text
              style={{
                textAlign: contentAlign,
                fontSize: Font.small,
                fontFamily: Font.Regular,
                color: Colors.DarkGrey,
                textAlign: "center",
                alignSelf: "center",
              }}>
              {LangProvider.termsandconditiontext1[languageIndex]}
            </Text>

            <View style={{
              marginTop: vs(2),
              flexDirection: 'row',
              alignSelf: 'center',
            }}>
              <TouchableHighlight
                onPress={() => {
                  navigation.navigate("TermsAndConditions", {
                    contantpage: 2,
                    content: config.term_url_eng, //'https://teq-dev-var19.co.in/rootscare/terms-and-conditions/eng',
                    content_ar: config.term_url_ar, //'https://teq-dev-var19.co.in/rootscare/terms-and-conditions/ar'
                  });
                }}
                underlayColor={Colors.Highlight}>
                <Text
                  style={{
                    fontSize: Font.small,
                    fontFamily: Font.Regular,
                    color: Colors.Black,
                    textAlign: 'center'
                  }} >
                  {LangProvider.termsandconditiontext2[languageIndex]}
                </Text>
              </TouchableHighlight>
              <Text
                style={{
                  textAlign: contentAlign,
                  fontSize: Font.small,
                  fontFamily: Font.Regular,
                  color: Colors.DarkGrey,
                }}>
                {LangProvider.termsandconditiontext3[languageIndex]}
              </Text>
              <TouchableHighlight
                onPress={() => {
                  navigation.navigate("TermsAndConditions", {
                    contantpage: 1,
                    content: config.privacy_url_eng,
                    content_ar: config.privacy_url_ar
                  });
                }}
                underlayColor={Colors.Highlight}>
                <Text
                  style={{
                    textAlign: contentAlign,
                    fontSize: Font.small,
                    fontFamily: Font.Regular,
                    color: Colors.Black,
                  }}>
                  {LangProvider.termsandconditiontext4[languageIndex]}
                </Text>
              </TouchableHighlight>
            </View>

          </View>

          <View style={{ width: '100%', height: 1.5, backgroundColor: Colors.backgroundcolor, marginTop: vs(18), alignSelf: 'center' }}></View>

          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignSelf: "center",
              marginTop: vs(11),
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                textAlign: contentAlign,
                fontSize: Font.medium,
                fontFamily: Font.Regular,
                color: Colors.DarkGrey,
              }}
            >
              {LangProvider.allreadyhaveaccounttext[languageIndex]}
            </Text>

            <TouchableOpacity
              onPress={() => {
                navigation.pop()
              }}
            >
              <Text
                style={{
                  textAlign: contentAlign,
                  fontSize: Font.medium,
                  fontFamily: Font.Medium,
                  color: Colors.Blue,
                }}
              >
                {LangProvider.loginheretext[languageIndex]}
              </Text>
            </TouchableOpacity>
          </View>
          {/* -------------------End------------------ */}

        </View>

      </KeyboardAwareScrollView >


      <Alert
        isVisible={registerData.registerModal}
        onclose={() => {
          setState({ registerModal: false })
        }}
        title={'Registration'}
        message={registerData.message}
        positiveBtn={'Continue'}
        negativeBtn={'Cancel'}
        onPositivePress={() => {
          setState({ registerModal: false })
          navigation.navigate("OTPPage", {
            phone_number: registerData.code + registerData.number,
            code: registerData.code,
          });
        }}
        onNegativePress={() => {
          setState({ registerModal: false })
        }}
      />

    </View >
  );

}

export default Signup;
