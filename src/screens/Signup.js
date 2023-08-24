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

const Signup = ({ navigation }) => {

  const { appLanguage, deviceToken, deviceType, contentAlign, languageIndex } = useSelector(state => state.StorageReducer)

  const [registerData, setRegisterData] = useState({
    securePassword: true,
    confirmSecurePassword: true,
    name: "",
    email: "",
    number: "",
    id: "",
    country_name: "",
    password: "",
    confirmPass: "",
    fcm_token: deviceToken,
    registerModal: false,
    countryModal: false,
    countryList: '',
    message: "",
    countryCode: "",
    country_short_code: "",
    status: false,
    isLoading: false
  })

  const nameRef = useRef()
  const emailRef = useRef()
  const numberRef = useRef()
  const idRef = useRef()
  const passRef = useRef()
  const confirmPassRef = useRef()
  const insets = useSafeAreaInsets()
  useEffect(() => {
    getCountriesList()
  }, [])

  const registerUser = async () => {
    Keyboard.dismiss();

    var email = registerData.email.trim();
    var num = registerData.id;
    var digits = num.toString().split("");
    var realDigits = digits.map(Number);

    if (registerData.name.length <= 0 || registerData.name.trim().length <= 0) {
      msgProvider.showError(LangProvider.emptyName[languageIndex]);
      return false;
    }

    let regemail =
      /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (email <= 0) {
      msgProvider.showError(LangProvider.emptyEmail[languageIndex]);
      return false;
    }

    if (regemail.test(email) !== true) {
      msgProvider.showError(LangProvider.validEmail[languageIndex]);
      return false;
    }
    if (
      registerData.countryCode.length <= 0 ||
      registerData.countryCode.trim().length <= 0
    ) {
      msgProvider.showError(LangProvider.emptyCountrycode[languageIndex]);
      return false;
    }

    if (registerData.number.length <= 0 || registerData.number.trim().length <= 0) {
      msgProvider.showError(LangProvider.emptymobileNumber[languageIndex]);
      return false;
    }
    if (registerData.id.length <= 0 || registerData.id.trim().length <= 0) {
      msgProvider.showError(LangProvider.emptyid[languageIndex]);
      return false;
    }
    if (registerData.country_short_code == "UAE") {
      if (
        realDigits[0] == 0 ||
        realDigits[0] == 1 ||
        realDigits[0] == 2 ||
        realDigits[0] == 3 ||
        realDigits[0] == 4 ||
        realDigits[0] == 5 ||
        realDigits[0] == 6 ||
        realDigits[0] == 8 ||
        realDigits[0] == 9
      ) {
        msgProvider.showError(LangProvider.validIDnumberUAE[languageIndex]);
        return false;
      }
    } else {
      if (
        realDigits[0] == 0 ||
        realDigits[0] == 3 ||
        realDigits[0] == 4 ||
        realDigits[0] == 5 ||
        realDigits[0] == 6 ||
        realDigits[0] == 7 ||
        realDigits[0] == 8 ||
        realDigits[0] == 9
      ) {
        msgProvider.showError(LangProvider.validIDnumber[languageIndex]);
        return false;
      }
    }

    if (registerData.id.length <= 9) {
      msgProvider.showError(LangProvider.emptyIdValid[languageIndex]);
      return false;
    }

    if (registerData.password.length <= 0) {
      msgProvider.showError(LangProvider.validataionnewpass[languageIndex]);
      return false;
    }
    if (registerData.password.length <= 7) {
      msgProvider.showError(LangProvider.emptyPasswordValid[languageIndex]);
      return false;
    }

    if (registerData.confirmPass.length <= 0) {
      msgProvider.showError(LangProvider.emptyconfirmPassword[languageIndex]);
      return false;
    }
    if (registerData.confirmPass.length <= 7) {
      msgProvider.showError(LangProvider.emptyPasswordValid[languageIndex]);
      return false;
    }

    if (registerData.confirmPass != registerData.password) {
      msgProvider.showError(LangProvider.Password_notmatch[languageIndex]);
      return false;
    }

    setRegisterData(prevState => ({
      ...prevState,
      isLoading: true
    }))
    let url = config.baseURL + "api-patient-registration-otp-send";
    var phone_number_send = registerData.countryCode + registerData.number;
    var data = new FormData();
    data.append("first_name", registerData.name);
    data.append("email", registerData.email);
    data.append("phone_number", phone_number_send);
    data.append("work_area", registerData.country_name);
    data.append("id_number", registerData.id);
    data.append("last_name", "");
    data.append("password", registerData.password);
    data.append("confirm_password", registerData.confirmPass);
    data.append("device_type", deviceType);
    data.append("device_lang", appLanguage);
    data.append("fcm_token", deviceToken);

    // console.log("data", data);
    // return
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        setRegisterData(prevState => ({
          ...prevState,
          isLoading: false
        }))
        console.log("registerUser: ", obj);
        if (obj.status == true) {

          setTimeout(() => {
            setRegisterData(prevState => ({
              ...prevState,
              message: obj.message,
              status: obj.status,
              registerModal: true
            }))
          }, 300);
        } else {
          setTimeout(() => {
            setRegisterData(prevState => ({
              ...prevState,
              message: obj.message,
              status: obj.status,
              registerModal: true
            }))
          }, 300);
          // }
          return false;
        }
      })
      .catch((error) => {
        setRegisterData(prevState => ({
          ...prevState,
          isLoading: false
        }))
        console.log("registerUser-error ------- " + error);
      });
  };

  const getCountriesList = async () => {
    let url = config.baseURL + "api-medical-service-area";
    apifuntion.getApi(url, 1).then((obj) => {
      console.log("getCountriesList: ", obj);
      if (obj.status == true) {
        setRegisterData(prevState => ({
          ...prevState,
          countryList: obj.result,
          country_name: obj.result[0].name,
          countryCode: obj.result[0].country_code,
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
            <Image source={Icons.logo} style={{ height: windowWidth - 297, height: windowWidth - 297 }} resizeMode='contain' />

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


          {/* ---------------------------------------------------------------------fullname */}

          <AuthInputBoxSec
            mainContainer={{ marginTop: vs(18), width: '100%' }}
            lableText={LangProvider.textinputname[languageIndex]}
            inputRef={nameRef}
            onChangeText={(val) => {
              setRegisterData(prevState => ({
                ...prevState,
                name: val
              }))
            }}
            value={registerData.name}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => {
              emailRef.current.focus();
            }}
            blurOnSubmit={Platform.OS === 'ios' ? true : false}
            editable
          />


          {/* -----------------------------------------------------------------------------------email */}

          <AuthInputBoxSec
            mainContainer={{ marginTop: vs(8), width: '100%' }}
            lableText={LangProvider.textinputemails[languageIndex]}
            inputRef={emailRef}
            onChangeText={(val) => {
              setRegisterData(prevState => ({
                ...prevState,
                email: val
              }))
            }}
            value={registerData.email}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => {
              numberRef.current.focus();
            }}
            blurOnSubmit={Platform.OS === 'ios' ? true : false}
            editable
          />

          {/* -----------------------------------------------------------------------------Country Picker- */}


          <TouchableOpacity
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
          </TouchableOpacity>


          {/* -----------------------------------------------------------------------------no- */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              alignSelf: "center",
              marginTop: vs(4)
            }}>
            <View
              style={{
                width: "20%",
              }}>
              <AuthInputBoxSec
                mainContainer={{ width: "100%", }}
                lableText={LangProvider.CC_code[languageIndex]}
                // inputRef={emailRef}
                onChangeText={(val) => {
                  setRegisterData(prevState => ({
                    ...prevState,
                    countryCode: val
                  }))
                }}
                maxLength={3}
                editable={false}
                value={registerData.countryCode}
                keyboardType="number-pad"
                autoCapitalize="none"
                returnKeyType="next"
                // onSubmitEditing={() => {
                //   this.passwordInput.focus();
                // }}
                blurOnSubmit={Platform.OS === 'ios' ? true : false}
              />
            </View>

            <View
              style={{
                width: "78%",
                alignSelf: "center",
              }}>
              <AuthInputBoxSec
                mainContainer={{ width: '100%' }}
                lableText={LangProvider.textinputnumber[languageIndex]}
                inputRef={numberRef}
                onChangeText={(val) => {
                  setRegisterData(prevState => ({
                    ...prevState,
                    number: val
                  }))
                }}
                value={registerData.number}
                keyboardType="number-pad"
                maxLength={9}
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => {
                  idRef.current.focus();
                }}
                blurOnSubmit={Platform.OS === 'ios' ? true : false}
                editable
              />

              <Text
                style={{
                  textAlign: contentAlign,
                  fontSize: Font.xsmall,
                  fontFamily: Font.Regular,
                  color: Colors.lightGrey,
                  marginTop: vs(8),
                  alignSelf: 'flex-start'
                }}>
                {LangProvider.mobletexttitle[languageIndex]}
              </Text>
            </View>
          </View>
          {/* ---------------------------------------------------------------------------idno */}


          <AuthInputBoxSec
            mainContainer={{ marginTop: vs(8), width: "100%", }}
            // icon={layer9_icon}
            lableText={LangProvider.textinputnationalid[languageIndex]}
            inputRef={idRef}
            onChangeText={(val) => {
              setRegisterData(prevState => ({
                ...prevState,
                id: val
              }))
            }}
            value={registerData.id}
            keyboardType="number-pad"
            maxLength={15}
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => {
              passRef.current.focus();
            }}
            blurOnSubmit={Platform.OS === 'ios' ? true : false}
            editable
          />



          {/* --------------------------------------------------------------------------------text */}


          {registerData.country_short_code == "UAE" ? (
            <Text
              style={{
                textAlign: contentAlign,
                fontSize: Font.xsmall,
                fontFamily: Font.Regular,
                color: Colors.lightGrey,
                marginTop: vs(8),
                alignSelf: 'flex-start'
              }}
            >
              {LangProvider.ProvideUAE[languageIndex]}
            </Text>
          ) : (
            <Text
              style={{
                textAlign: contentAlign,
                fontSize: Font.xsmall,
                fontFamily: Font.Regular,
                color: Colors.lightGrey,
                marginTop: vs(8),
                alignSelf: 'flex-start'
              }}
            >
              {LangProvider.Signuptext2[languageIndex]}
            </Text>
          )}
          {/* ------------------------------------------------------password */}


          <AuthInputBoxSec
            mainContainer={{ marginTop: vs(5), width: "100%", }}
            lableText={LangProvider.password[languageIndex]}
            inputRef={passRef}
            onChangeText={(val) => {
              setRegisterData(prevState => ({
                ...prevState,
                password: val
              }))
            }}
            value={registerData.password}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="done"
            returnKeyType="next"
            secureTextEntry={registerData.securePassword}
            disableImg={true}
            iconName={registerData.securePassword ? "eye-off" : "eye"}
            iconPressAction={() => {
              setRegisterData(prevState => ({
                ...prevState,
                securePassword: !registerData.securePassword
              }))
            }}
            onSubmitEditing={() => {
              confirmPassRef.current.focus();
            }}
            blurOnSubmit={Platform.OS === 'ios' ? true : false}
            editable
          />

          {/* -----------------------------------------------------------text*/}

          <Text
            style={{
              textAlign: contentAlign,
              fontSize: Font.xsmall,
              fontFamily: Font.Regular,
              color: Colors.lightGrey,
              marginTop: vs(8),
              alignSelf: 'flex-start'
            }}
          >
            {LangProvider.Signuptext3[languageIndex]}
          </Text>

          {/* ----------------------------------------------------------------------confirmpasword */}


          <AuthInputBoxSec
            mainContainer={{ marginTop: vs(8), width: "100%", }}
            lableText={LangProvider.confirmpassword1[languageIndex]}
            inputRef={confirmPassRef}
            onChangeText={(val) => {
              setRegisterData(prevState => ({
                ...prevState,
                confirmPass: val
              }))
            }}
            value={registerData.confirmPass}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="next"
            returnKeyType="done"
            secureTextEntry={registerData.confirmSecurePassword}
            disableImg={true}
            iconName={registerData.confirmSecurePassword ? "eye-off" : "eye"}
            iconPressAction={() => {
              setRegisterData(prevState => ({
                ...prevState,
                confirmSecurePassword: !registerData.confirmSecurePassword
              }))
            }}
            onSubmitEditing={() => {
              Keyboard.dismiss()
            }}
            blurOnSubmit={Platform.OS === 'ios' ? true : false}
            editable
          />

          {/*   ---------------------------------------------------------------------------- */}


          <Text
            style={{
              textAlign: contentAlign,
              fontSize: Font.xsmall,
              fontFamily: Font.Regular,
              color: Colors.lightGrey,
              marginTop: vs(8),
              alignSelf: 'flex-start'
            }}
          >
            {LangProvider.Signuptext4[languageIndex]}
          </Text>

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
                    fontFamily: Font.Medium,
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
                    fontFamily: Font.Medium,
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

      </KeyboardAwareScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={registerData.countryModal}
        onRequestClose={() => { }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            setRegisterData(prevState => ({
              ...prevState,
              countryModal: false
            }))
          }}
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
              width: "70%",
              backgroundColor: "White",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            <View
              style={{
                width: "100%",
                backgroundColor: Colors.backgroundcolorblue,
                paddingVertical: (windowWidth * 2) / 100,
              }}
            >
              <Text
                style={{
                  paddingLeft: (windowWidth * 4.5) / 100,
                  paddingRight: (windowWidth * 4.5) / 100,
                  textAlign: contentAlign,
                  fontFamily: Font.Regular,
                  fontSize: (windowWidth * 4) / 100,
                  color: Colors.White,
                }}
              >
                {LangProvider.Country_code[languageIndex]}
              </Text>
            </View>

            <View style={{ width: "100%", alignSelf: "center" }}>
              <FlatList
                contentContainerStyle={{
                  paddingBottom: (windowWidth * 2) / 100,
                }}
                keyExtractor={(item, index) => index.toString()}
                data={registerData.countryList}
                renderItem={({ item, index }) => {
                  if (registerData.countryList != "" && registerData.countryList != null) {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          setRegisterData(prevState => ({
                            ...prevState,
                            countryModal: false,
                            countryCode: item.country_code,
                            country_name: item.name,
                            country_short_code: item.country_short_code,
                          }))
                        }} >
                        <View
                          style={{
                            width: "100%",
                            backgroundColor: "#fff",
                            alignSelf: "center",
                            justifyContent: "flex-end",
                          }}>
                          <View
                            style={[
                              {
                                width: "95%",
                                borderBottomWidth: 1,
                                paddingVertical: (windowWidth * 2) / 100,
                                marginLeft: (windowWidth * 5) / 100,
                                borderBottomColor: "#0000001F",
                              },
                            ]}>
                            <Text
                              style={{
                                color: Colors.Black,
                                fontSize: (windowWidth * 4) / 100,
                                paddingLeft: (windowWidth * 2) / 100,
                                textAlign: contentAlign,
                              }}>
                              {item.name}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  }
                }}
              ></FlatList>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={registerData.registerModal}
        onRequestClose={() => {
          setRegisterData(prevState => ({
            ...prevState,
            registerModal: false,
          }))
        }}>
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
            }}>
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 2,
                width: "100%",
              }}>
              <View
                style={{
                  alignSelf: "flex-start",
                  paddingVertical: (windowWidth * 3) / 100,
                  marginTop: (windowWidth * 2) / 100,
                  paddingLeft: (windowWidth * 4) / 100,
                  flexDirection: "row",
                  alignItems: "center",
                }}>
                <Image
                  style={{
                    width: (windowWidth * 6) / 100,
                    height: (windowWidth * 6) / 100,
                  }}
                  source={Icons.logo}
                ></Image>
                <Text
                  style={{
                    fontFamily: Font.Medium,
                    color: "#000",
                    fontSize: (windowWidth * 5) / 100,
                    paddingLeft: (windowWidth * 4) / 100,
                  }}
                >
                  {LangProvider.registration[languageIndex]}
                </Text>
              </View>

              <View
                style={{
                  alignSelf: "flex-start",
                  paddingLeft: (windowWidth * 4) / 100,
                  width: "90%",
                  marginTop: (windowWidth * 1.5) / 100,
                }}
              >
                <Text
                  style={{
                    fontFamily: Font.Light,
                    color: "#000",
                    fontSize: (windowWidth * 4) / 100,
                  }}
                >
                  {registerData.message}
                </Text>
              </View>

              <View
                style={{
                  paddingBottom: (windowWidth * 5) / 100,
                  marginTop: (windowWidth * 9) / 100,
                  alignSelf: "flex-end",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    if (registerData.status == true) {
                      setTimeout(() => {
                        setRegisterData(prevState => ({
                          ...prevState,
                          registerModal: false
                        }))
                        navigation.navigate("OTPPage", {
                          id_number: registerData.id,
                          password: registerData.password,
                          confirm_password: registerData.confirmPass,
                          phone_number: registerData.countryCode + registerData.number,
                          name: registerData.name,
                          email: registerData.email,
                          work_area: registerData.country_short_code,
                          country_name: registerData.country_name
                        });
                      }, 200);
                    } else {
                      setRegisterData(prevState => ({
                        ...prevState,
                        registerModal: false
                      }))
                    }
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
                      color: Colors.Theme,
                      alignSelf: "center",
                      textAlign: contentAlign,
                    }}
                  >
                    {LangProvider.OK[languageIndex]}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );

}

export default Signup;
