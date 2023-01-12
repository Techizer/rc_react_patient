import {
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native";
import React, { Component, useEffect, useRef, useState } from "react";
import {
  Colors,
  Font,
  msgProvider,
  msgText,
  config,
  localStorage,
  Lang_chg,
  apifuntion,
  msgTitle,
  consolepro,
  Icons,
  windowWidth,
  ScreenHeader,
  Button
} from "../Provider/utilslib/Utils";
import DropDownboxSec from '../components/DropDownboxSec'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { s, vs } from "react-native-size-matters";
import IssuesBottomSheet from "../components/ListBottomSheet";
import { useSelector } from "react-redux";



const NeedSupport = ({ navigation }) => {

  const {
    appLanguage,
    contentAlign,
    loggedInUserDetails,
  } = useSelector(state => state.StorageReducer)

  const [needSupportData, setNeedSupportData] = useState({
    issuesList: [],
    issuesModal: false,
    message: "",
    selectissuefocus: false,
    selectedIssue: "",
    successmodal: false,
    languageIndex: appLanguage == 'ar' ? 1 : 0,
    isLoading: false
  })

  const inputRef = useRef()
  useEffect(() => {
    getAllTopics()
  }, [])

  const getAllTopics = async () => {

    let url = config.baseURL + "api-patient-need-help-topic";
    var data = new FormData();
    data.append("login_user_id", loggedInUserDetails.user_id);

    apifuntion
      .postApi(url, data)
      .then((obj) => {
        consolepro.consolelog("obj", obj);
        if (obj.status == true) {
          console.log("result", obj.result);
          let result = obj.result;
          setNeedSupportData(prevState => ({
            ...prevState,
            issuesList: obj.result
          }))
        } else {
          msgProvider.alert(
            msgTitle.information[needSupportData.languageIndex],
            obj.message[needSupportData.languageIndex],
            false
          );

          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
      });
  };
  const submit_click = async () => {

    if (needSupportData.selectedIssue == '' || needSupportData.selectedIssue == null) {
      msgProvider.showError(msgText.emptySelecttopic[needSupportData.languageIndex]);
      return false;
    }
    if (needSupportData.message == '' || needSupportData.message == null) {
      msgProvider.showError(msgText.emptyMessage[needSupportData.languageIndex]);
      return false;
    }

    setNeedSupportData(prevState => ({
      ...prevState,
      isLoading: true
    }))
    let url = config.baseURL + "api-insert-need-help";
    var data = new FormData();
    data.append("user_id", loggedInUserDetails.user_id);
    data.append("issue_topic", needSupportData.selectedIssue);
    data.append("message", needSupportData.message);
    data.append("service_type", loggedInUserDetails.user_type);
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        setNeedSupportData(prevState => ({
          ...prevState,
          isLoading: false
        }))
        if (obj.status == true) {
          let result = obj.result;
          msgProvider.showSuccess(obj?.message)
          setTimeout(() => {
            navigation.pop()
          }, 450);
        } else {
          msgProvider.alert(
            msgTitle.information[needSupportData.languageIndex],
            obj.message[needSupportData.languageIndex],
            false
          );

          return false;
        }
      })
      .catch((error) => {
        setNeedSupportData(prevState => ({
          ...prevState,
          isLoading: false
        }))
        consolepro.consolelog("-------- error ------- " + error);
      });
  };

  return (
    <View
      pointerEvents={needSupportData.isLoading ? 'none' : 'auto'}
      style={{
        alignSelf: "center",
        flex: 1,
        backgroundColor: Colors.backgroundcolor,
      }} >

      <ScreenHeader
        title={Lang_chg.NeedSupport[needSupportData.languageIndex]}
        navigation={navigation}
        onBackPress={() => navigation.pop()}
        leftIcon
      />


      <KeyboardAwareScrollView
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{
          justifyContent: 'center',
          paddingBottom: vs(20),
          backgroundColor: Colors.White,
          marginTop: vs(7),
          paddingVertical: vs(9)
        }}
        showsVerticalScrollIndicator={false}>


        <View
          style={{
            width: "90%",
            alignSelf: "center",
          }}>
          <View
            style={{
              alignItems: "center",
              width: "100%",
              alignSelf: "center",
              flexDirection: "row",
            }}>
            <View style={{ width: "8%", alignSelf: "center" }}>
              <Image
                style={{ width: 20, height: 20, resizeMode: "contain" }}
                source={Icons.needsupportimg} />
            </View>

            <Text
              style={{
                alignSelf: 'flex-start',
                fontSize: Font.large,
                color: Colors.darkText,
                fontFamily: Font.Medium,
              }}>
              {Lang_chg.needsupport[needSupportData.languageIndex]}{" "}
            </Text>
          </View>

          <View style={{ width: '100%', alignSelf: 'center', height: 1.5, backgroundColor: Colors.backgroundcolor, marginVertical: vs(10) }}></View>



          <Text
            style={{
              alignSelf: 'flex-start',
              fontSize: Font.medium,
              color: Colors.DarkGrey,
              fontFamily: Font.Regular,
            }} >
            {Lang_chg.need_text[needSupportData.languageIndex]}{" "}
          </Text>

          <Text
            style={{
              alignSelf: 'flex-start',
              fontSize: Font.medium,
              color: Colors.darkText,
              fontFamily: Font.Medium,
              marginTop: vs(10)
            }} >
            {Lang_chg.select_topic_text[needSupportData.languageIndex]}{" "}
          </Text>


          <DropDownboxSec
            lableText={
              needSupportData.selectedIssue.length <= 0
                ? Lang_chg.select_issues_text[needSupportData.languageIndex]
                : needSupportData.selectedIssue
            }
            boxPressAction={() => {
              setNeedSupportData(prevState => ({
                ...prevState,
                issuesModal: true,
                selectissuefocus: false
              }))
            }}
            mainContainer={{ marginTop: vs(10) }}
          />

          <Pressable
            onPress={() => {
              inputRef.current.focus()
            }}
            style={{
              width: "100%",
              alignSelf: "center",
              marginTop: vs(15),
              borderColor: needSupportData.selectissuefocus ? Colors.Theme : Colors.Border,
              borderWidth: 1,
              borderRadius: 6,
              height: vs(125),
              paddingHorizontal: s(8),
              paddingVertical: s(4),
            }}>

            <TextInput
              ref={inputRef}
              style={{
                width: "100%",
                color: Colors.Black,
                fontSize: Font.medium,
                alignSelf: 'flex-start',
                fontFamily: Font.Regular,
              }}
              maxLength={250}
              multiline={true}
              placeholder={Lang_chg.text_input_topic[needSupportData.languageIndex]}
              placeholderTextColor={Colors.MediumGrey}
              onChangeText={(txt) => {
                setNeedSupportData(prevState => ({
                  ...prevState,
                  message: txt
                }))
              }}
              onFocus={() => {
                setNeedSupportData(prevState => ({
                  ...prevState,
                  selectissuefocus: true
                }))
              }}
              onBlur={() => {
                setNeedSupportData(prevState => ({
                  ...prevState,
                  selectissuefocus: needSupportData.message.length > 0 ? true : false,
                }))
              }}
              keyboardType="default"
              returnKeyLabel="done"
            />

          </Pressable>

          <Button
            text={Lang_chg.submitbtntext[needSupportData.languageIndex]}
            onPress={() => submit_click()}
            btnStyle={{ marginTop: vs(25) }}
            onLoading={needSupportData.isLoading}
          />

        </View>

      </KeyboardAwareScrollView>

      {/* <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.issuesModal}
          onRequestClose={() => { }}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              this.setState({ issuesModal: false });
            }}
            style={{
              flex: 1,
              alignSelf: "center",
              justifyContent: "center",
              backgroundColor: "#00000080",
              width: "100%",
              marginTop: (windowWidth * 3) / 100,
              paddingBottom: (windowWidth * 8) / 100,
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
                }}
              >
                <View
                  style={{ width: "45%", paddingVertical: (windowWidth * 3) / 100 }}
                >
                  <Text
                    style={{
                      textAlign: config.textalign,
                      fontFamily: Font.Regular,
                      fontSize: (windowWidth * 4) / 100,
                      alignSelf: "center",
                      color: Colors.White,
                    }}
                  >
                    {Lang_chg.select_topic_text[needSupportData.languageIndex]}
                  </Text>
                </View>
              </View>
              <View style={{ width: "100%" }}>
                <FlatList
                  data={this.state.issuesList}
                  renderItem={({ item, index }) => {
                    return (
                      <View>
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({
                              issuesModal: false,
                              selectedIssue: item.name,
                            });
                          }}
                        >
                          <View
                            style={{
                              width: "100%",
                              backgroundColor: "#fff",
                              alignSelf: "center",
                              justifyContent: "flex-end",
                            }}
                          >
                            <View
                              style={{
                                width: "95%",
                                borderBottomColor: "#0000001F",
                                borderBottomWidth: 1,
                                paddingVertical: (windowWidth * 2.5) / 100,
                                marginLeft: (windowWidth * 5) / 100,
                              }}
                            >
                              <Text
                                style={{
                                  color: Colors.Black,
                                  textAlign: config.textRotate,
                                  fontSize: (windowWidth * 4) / 100,
                                  paddingLeft: (windowWidth * 2) / 100,
                                }}
                              >
                                {item.name}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
        </Modal> */}

      <IssuesBottomSheet
        visible={needSupportData.issuesModal}
        onRequestClose={() => {
          setNeedSupportData(prevState => ({
            ...prevState,
            issuesModal: false,
          }))

        }}
        data={needSupportData.issuesList}
        title={Lang_chg.select_topic_text[needSupportData.languageIndex]}
        selectedIssue={(val) => {
          setNeedSupportData(prevState => ({
            ...prevState,
            selectedIssue: val
          }))
        }}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={needSupportData.successmodal}
        onRequestClose={() => { }}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            setNeedSupportData(prevState => ({
              ...prevState,
              successmodel: false
            }))
          }}
          style={{
            flex: 1,
            alignSelf: "center",
            justifyContent: "center",
            backgroundColor: "#00000080",
            width: "100%",
          }} >
          <View
            style={{
              width: "100%",
              backgroundColor: "White",
              borderRadius: (windowWidth * 4) / 100,
              position: "absolute",
              bottom: 0,
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: (windowWidth * 5) / 100,
              alignSelf: "center",
            }}
          >

            <Image
              style={{
                width: (windowWidth * 17) / 100,
                height: (windowWidth * 17) / 100,
                alignSelf: "center",
                marginTop: (windowWidth * -7) / 100,
                resizeMode: "contain",
              }}
              source={Icons.greenTick}
            />

            <Text
              style={{
                fontSize: (windowWidth * 8) / 100,
                marginTop: (windowWidth * 5) / 100,
                fontFamily: Font.Medium,
                alignSelf: 'flex-start',
              }}>
              {Lang_chg.thank[needSupportData.languageIndex]}
            </Text>
            <Text
              style={{
                fontSize: (windowWidth * 3.5) / 100,
                marginTop: (windowWidth * 5) / 100,
                fontFamily: Font.Medium,
                alignSelf: 'flex-start',
              }}
            >
              {Lang_chg.success[needSupportData.languageIndex]}
            </Text>

            <Text
              style={{
                fontSize: (windowWidth * 3) / 100,
                marginTop: (windowWidth * 2) / 100,
                fontFamily: Font.Medium,
                alignSelf: 'flex-start',
                color: Colors.textgray,
              }}
            >
              {Lang_chg.text_of_modal[needSupportData.languageIndex]}
            </Text>

            <TouchableOpacity
              onPress={() => {
                setNeedSupportData(prevState => ({
                  ...prevState,
                  successmodal: false
                }))
                navigation.pop();
              }}
              style={{
                width: "15%",
                alignSelf: "center",
                borderColor: Colors.Blue,
                borderWidth: 1,
                paddingVertical: (windowWidth * 2) / 100,
                marginTop: (windowWidth * 5) / 100,
                borderRadius: (windowWidth * 3) / 100,
              }}
            >
              <Text
                style={{
                  fontSize: (windowWidth * 3) / 100,
                  alignSelf: "center",
                  fontFamily: Font.Medium,
                  alignSelf: 'flex-start',
                  alignSelf: "center",
                  color: Colors.terms_text_color_blue,
                }}
              >
                {Lang_chg.close_txt[needSupportData.languageIndex]}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>


    </View>
  );

}

export default NeedSupport;