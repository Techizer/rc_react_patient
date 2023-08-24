import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Keyboard,
  TouchableHighlight,
} from "react-native";
import React, { Component, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Colors,
  Icons,
  Font,
  config,
  windowWidth,
  msgProvider,
  LangProvider,
  apifuntion,
  Button
} from "../Provider/Utils/Utils";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AuthInputBoxSec from "../Components/AuthInputBoxSec";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import { leftArrow, Logo, rightArrow } from "../Icons/Index";
import { useSelector } from "react-redux";

const ForgotPage = ({ navigation }) => {

  const { appLanguage, contentAlign, languageIndex} = useSelector(state => state.StorageReducer)

  const [forgotData, setForgotData] = useState({
    email: "",
    isLoading: false
  })
  const emailRef = useRef()
  const insets = useSafeAreaInsets()

  submit_click = async () => {
    Keyboard.dismiss();

    let regemail = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (forgotData.email == '' || forgotData.email == null || forgotData.email == undefined) {
      msgProvider.showError(LangProvider.emptyEmail[languageIndex]);
      return false;
    }

    if (regemail.test(forgotData.email) !== true) {
      msgProvider.showError(LangProvider.validEmail[languageIndex]);
      return false;
    }
    setForgotData(prevState => ({
      ...prevState,
      isLoading: true
    }))
    let url = config.baseURL + "api-forgot-password-email";

    var data = new FormData();
    data.append("emailId", forgotData.email);
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        setForgotData(prevState => ({
          ...prevState,
          isLoading: false
        }))
        console.log("submit_click", obj);
        if (obj.status == true) {
          setTimeout(() => {
            msgProvider.showSuccess(obj.message);
            navigation.navigate("ForgotOTP", { email: forgotData.email });
          }, 300);
        } else {
          setTimeout(() => {
            msgProvider.showError(obj.message);
          }, 300);
          return false;
        }
      })
      .catch((error) => {
        setForgotData(prevState => ({
          ...prevState,
          isLoading: false
        }))
        console.log("submit_click-error ------- " + error);
      });
  };


  return (
    <View
      pointerEvents={forgotData.isLoading ? 'none' : 'auto'}
      style={{ flex: 1, backgroundColor: Colors.White,  paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <KeyboardAwareScrollView
        // keyboardOpeningTime={200}
        extraScrollHeight={50}
        enableOnAndroid={true}
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{
          justifyContent: 'center',
          paddingBottom: vs(30),
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
              alignSelf: 'center',
              color: Colors.darkText
            }}>
            {LangProvider.Forgot[languageIndex]}
          </Text>

          <Text
            style={{
              textAlign: 'center',
              fontSize: Font.medium,
              fontFamily: Font.Regular,
              color: Colors.inActiveText,
              marginTop: vs(4)
            }}
          >
            {LangProvider.Forgottext[languageIndex]}
          </Text>


          <AuthInputBoxSec
            mainContainer={{ marginTop: vs(18), width: '100%' }}
            lableText={LangProvider.textinputregistered[languageIndex]}
            inputRef={emailRef}
            onChangeText={(val) => {
              setForgotData(prevState => ({
                ...prevState,
                email: val
              }))
            }}
            value={forgotData.email}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyLabel="done"
            returnKeyType="done"
            onSubmitEditing={() => {
              submit_click();
            }}
            editable
          />

          <Button
            text={LangProvider.forgotbtn[languageIndex]}
            onPress={() => submit_click()}
            btnStyle={{ marginTop: vs(30) }}
            onLoading={forgotData.isLoading}
          />

        </View>

      </KeyboardAwareScrollView>
    </View>
  );

}

export default ForgotPage;