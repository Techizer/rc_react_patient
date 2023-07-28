import {
  Text,
  Modal,
  Alert,
  View,
  Image,
  TouchableOpacity,
  I18nManager,
  ScrollView
} from "react-native";
import React, { Component, useState } from "react";
import RNRestart from 'react-native-restart'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Colors,
  Icons,
  Font,
  msgProvider,
  config,
  windowWidth,
  apifuntion,
  LangProvider,
  ScreenHeader
} from "../Provider/Utils/Utils";
import { leftArrow, Logo, Notification, rightArrow, Splash_Logo } from "../Icons/Index";
import { SvgXml } from "react-native-svg";
import { s, vs } from "react-native-size-matters";
import { useDispatch, useSelector } from "react-redux";
import { AppLanguage, IsLanguageUpdated } from "../Redux/Actions";




const SupportandMore = ({ navigation }) => {

  const { appLanguage, loggedInUserDetails, languageIndex, guest } = useSelector(state => state.StorageReducer)
  const dispatch = useDispatch()
  const insets = useSafeAreaInsets()
  const [supportData, setSupportData] = useState({
    language: appLanguage,
    languageModal: false
  })

  const ChangeLanguage = () => {
    if (supportData.language == 'en') {
      console.log('English...');
      dispatch(IsLanguageUpdated(true))
      dispatch(AppLanguage('en'))
    } else {
      console.log('Arabic...');
      dispatch(IsLanguageUpdated(true))
      dispatch(AppLanguage('ar'))

    }

  }

  const Update = async (language) => {
    let url = config.baseURL + "api-language-update";
    var data = new FormData();
    data.append("login_user_id", loggedInUserDetails?.user_id);
    data.append("device_lang", supportData.language == 'en' ? 'ENG' : 'AR');
    console.log(data);
    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        console.log("UpdateLanguage", obj);
        if (obj.status == true) {
          dispatch(AppLanguage(language))
          // if (language == 'ar') {
          //   setTimeout(() => {
          //     RNRestart.Restart();
          //   }, 350);
          // }
        } else {
          msgProvider.alert(
            LangProvider.information[languageIndex],
            obj.message[languageIndex],
            false
          );

          return false;
        }
      })
      .catch((error) => {
        console.log("UpdateLanguage-error ------- " + error);
      });
  };

  const confirmDelete = (title, message, callbackOk, callbackCancel) => {
    Alert.alert(
      LangProvider.Delete_account[languageIndex],
      LangProvider.Are_you_sure[languageIndex],
      [
        {
          text: LangProvider.no_txt[languageIndex],
          onPress: () => {
            setSupportData(prevState => ({
              ...prevState,
              language: appLanguage
            }))
          }
        },
        {
          text: LangProvider.yes_txt[languageIndex],
          onPress: () => delete_click(),
        },
      ],
      { cancelable: false }
    );
  }
  const delete_click = async () => {

    let url = config.baseURL + "api-delete-user";
    console.log("url", url);
    var data = new FormData();
    data.append("user_id", loggedInUserDetails?.user_id);

    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        if (obj.status == true) {

          navigation.reset({
            index: 0,
            routes: [{ name: "AuthStack" }],
          });
        } else {
          msgProvider.alert(
            LangProvider.information[languageIndex],
            obj.message[languageIndex],
            false
          );

          return false;
        }
      })
      .catch((error) => {
        console.log("delete_click-error ------- " + error);
      });
  };

  return (
    <View
      style={{
        width: "100%",
        alignSelf: "center",
        flex: 1,
        backgroundColor: Colors.White,
      }}>

      <ScreenHeader
        title={LangProvider.supporttext[languageIndex]}
        navigation={navigation}
        onBackPress={() => navigation.pop()}
        leftIcon
      />


      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: (windowWidth * 20) / 100 }}>
        <View style={{ paddingVertical: vs(30), alignItems: 'center' }}>
          <SvgXml xml={Logo} />

          <View style={{ width: '50%', height: 1.5, backgroundColor: Colors.backgroundcolor, marginTop: vs(40) }}></View>

          <View
            style={{
              width: "50%",
              alignSelf: "center",
            }}>
            <Text
              style={{
                paddingVertical: vs(14),
                fontSize: Font.xlarge,
                color: Colors.lightGrey,
                fontFamily: Font.Regular,
                alignSelf: "center",
                textAlign: "center",
              }} >
              {LangProvider.Splashtext1[languageIndex]}{" "}
            </Text>
          </View>

          <View style={{ width: '50%', height: 1.5, backgroundColor: Colors.backgroundcolor }}></View>

          <Text
            style={{
              marginTop: vs(11),
              fontSize: Font.medium,
              color: Colors.Border,
              fontFamily: Font.Regular,
              alignSelf: "center",
              textAlign: "center",
            }} >
            {LangProvider.version[languageIndex]}{" "}
          </Text>
        </View>

        <View
          style={{
            width: "90%",
            alignSelf: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: (windowWidth * 3.8) / 100,
              color: Colors.DarkGrey,
              fontFamily: Font.Regular,
            }}
          >
            {LangProvider.languagetxt[languageIndex]}{" "}
          </Text>

          <View
            style={{
              width: "40%",
              alignSelf: "flex-end",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                if (appLanguage == 'en') {
                  null
                } else {
                  setSupportData(prevState => ({
                    ...prevState,
                    languageModal: true,
                    language: 'en'
                  }))
                }
              }}
              style={{
                width: "50%",
                alignSelf: "center",
                backgroundColor: (appLanguage || supportData.language) == 'en' ? Colors.lightBlue : Colors.White,
                borderColor: "black",
                borderBottomWidth: 1,
                borderTopWidth: 1,
                borderLeftWidth: 1,
                paddingVertical: (windowWidth * 1.5) / 100,
                borderBottomLeftRadius: (windowWidth * 1) / 100,
                borderTopLeftRadius: (windowWidth * 1) / 100,
              }}
            >
              <Text
                style={{
                  fontSize: (windowWidth * 3.5) / 100,
                  color: Colors.DarkGrey,
                  fontFamily: Font.Regular,
                  alignSelf: "center",
                }}
              >
                ENG
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                if (appLanguage == 'ar') {
                  null
                } else {
                  setSupportData(prevState => ({
                    ...prevState,
                    languageModal: true,
                    language: 'ar'
                  }))
                }
              }}
              style={{
                width: "50%",
                alignSelf: "center",
                backgroundColor: (appLanguage || supportData.language) == 'ar' ? Colors.lightBlue : Colors.White,
                borderColor: "#fff",
                borderColor: "black",
                borderWidth: 1,
                paddingVertical: (windowWidth * 1.5) / 100,
                borderTopRightRadius: (windowWidth * 1) / 100,
                borderBottomRightRadius: (windowWidth * 1) / 100,
              }}
            >
              <Text
                style={{
                  fontSize: (windowWidth * 3.5) / 100,
                  color: Colors.DarkGrey,
                  fontFamily: Font.Regular,
                  alignSelf: "center",
                }}
              >
                AR
              </Text>
            </TouchableOpacity>
          </View>
        </View>


        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Tremsandcondition", {
              contantpage: 2,
              content: config.term_url_eng, //'https://teq-dev-var19.co.in/rootscare/terms-and-conditions/eng',
              content_ar: config.term_url_ar,
            });
          }}
          style={{
            width: "95%",
            justifyContent: "space-between",
            alignItems: 'center',
            alignSelf: 'flex-end',
            marginTop: vs(10),
            flexDirection: "row",
            borderBottomWidth: 1.5,
            borderBottomColor: Colors.backgroundcolor,
            paddingBottom: vs(10),
            paddingRight: s(18)
          }}>
          <Text
            style={{
              textAlign: config.textalign,
              fontSize: (windowWidth * 3.8) / 100,
              color: Colors.DarkGrey,
              fontFamily: Font.Regular,
            }}>
            {LangProvider.termtxt[languageIndex]}{" "}
          </Text>
          <SvgXml xml={languageIndex == 1 ? leftArrow : rightArrow} height={vs(11)} width={s(7)} />

        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Tremsandcondition", {
              contantpage: 0,
              content: config.about_url_eng,
              content_ar: config.about_url_ar,
            });
          }}
          style={{
            width: "95%",
            justifyContent: "space-between",
            alignItems: 'center',
            alignSelf: 'flex-end',
            marginTop: vs(10),
            flexDirection: "row",
            borderBottomWidth: 1.5,
            borderBottomColor: Colors.backgroundcolor,
            paddingBottom: vs(10),
            paddingRight: s(18)

          }}
        >
          <Text
            style={{
              fontSize: Font.medium,
              color: Colors.DarkGrey,
              fontFamily: Font.Regular,
            }}
          >
            {LangProvider.aboutrootcare[languageIndex]}{" "}
          </Text>
          <SvgXml xml={languageIndex == 1 ? leftArrow : rightArrow} height={vs(11)} width={s(7)} />
        </TouchableOpacity>


        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Tremsandcondition", {
              contantpage: 1,
              content: config.privacy_url_eng,
              content_ar: config.privacy_url_ar,
            });
          }}
          style={{
            width: "95%",
            justifyContent: "space-between",
            alignItems: 'center',
            alignSelf: 'flex-end',
            marginTop: vs(10),
            flexDirection: "row",
            borderBottomWidth: 1.5,
            borderBottomColor: Colors.backgroundcolor,
            paddingBottom: vs(10),
            paddingRight: s(18)
          }}
        >
          <Text
            style={{
              fontSize: (windowWidth * 3.8) / 100,
              color: Colors.DarkGrey,
              fontFamily: Font.Regular,
            }}
          >
            {LangProvider.privacy[languageIndex]}{" "}
          </Text>

          <SvgXml xml={languageIndex == 1 ? leftArrow : rightArrow} height={vs(11)} width={s(7)} />
        </TouchableOpacity>


        {
          !guest &&
          <>
            <TouchableOpacity
              onPress={() => {
                confirmDelete();
              }}
              style={{
                width: "95%",
                justifyContent: "space-between",
                alignItems: 'center',
                alignSelf: 'flex-end',
                marginTop: vs(10),
                flexDirection: "row",
                borderBottomWidth: 1.5,
                borderBottomColor: Colors.backgroundcolor,
                paddingBottom: vs(10),
                paddingRight: s(18)
              }}>
              <Text
                style={{
                  fontSize: (windowWidth * 3.8) / 100,
                  color: Colors.DarkGrey,
                  fontFamily: Font.Regular,
                }}
              >
                {LangProvider.Delete_account[languageIndex]}{" "}
              </Text>
              <SvgXml xml={languageIndex == 1 ? leftArrow : rightArrow} height={vs(11)} width={s(7)} />
            </TouchableOpacity>


            <TouchableOpacity
              onPress={() => {
                navigation.navigate("NeedSupport");
              }}
              style={{
                width: "95%",
                justifyContent: "space-between",
                alignItems: 'center',
                alignSelf: 'flex-end',
                marginTop: vs(10),
                flexDirection: "row",
                borderBottomWidth: 1.5,
                borderBottomColor: Colors.backgroundcolor,
                paddingBottom: vs(10),
                paddingRight: s(18)
              }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    alignSelf: "center",
                    marginRight: (windowWidth * 3) / 100,
                  }}>
                  <Image
                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                    source={Icons.needsupportimg}
                  ></Image>
                </View>

                <Text
                  style={{
                    fontSize: (windowWidth * 4) / 100,
                    color: Colors.Black,
                    fontFamily: Font.Medium,
                  }}>
                  {LangProvider.needsupport[languageIndex]}{" "}
                </Text>
              </View>
              <SvgXml xml={languageIndex == 1 ? leftArrow : rightArrow} height={vs(11)} width={s(7)} />
            </TouchableOpacity>


          </>
        }
      </ScrollView>



      <Modal
        animationType="fade"
        transparent={true}
        visible={supportData.languageModal}
        onRequestClose={() => {
          setSupportData(prevState => ({
            ...prevState,
            languageModal: false
          }))
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
            }}>
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
                  width: (windowWidth * 60) / 100,
                  paddingVertical: (windowWidth * 3) / 100,
                  marginTop: (windowWidth * 2) / 100,
                  paddingLeft: (windowWidth * 4) / 100,
                  flexDirection: "row",
                  alignItems: 'center'
                }}
              >
                <Image
                  style={{
                    width: (windowWidth * 12) / 100,
                    height: (windowWidth * 12) / 100,
                  }}
                  resizeMode='contain'
                  source={Icons.logo}
                />
                <Text
                  style={{
                    fontFamily: Font.Medium,
                    color: "#000",
                    fontSize: (windowWidth * 5) / 100,
                    paddingLeft: (windowWidth * 3) / 100,
                  }}
                >
                  {LangProvider.Lang_change[languageIndex]}
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
                    paddingVertical: (windowWidth * 1) / 100,
                    fontFamily: Font.Regular,
                    color: "#000",
                    fontSize: (windowWidth * 4) / 100,
                    alignSelf: 'flex-start'
                  }}
                >
                  {LangProvider.Lang_change_msg[languageIndex]}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  width: "40%",
                  paddingBottom: (windowWidth * 5) / 100,
                  marginTop: (windowWidth * 7) / 100,
                  alignSelf: "flex-end",
                  right: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setSupportData(prevState => ({
                      ...prevState,
                      languageModal: false
                    }))
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
                    setSupportData(prevState => ({
                      ...prevState,
                      languageModal: false
                    }))
                    ChangeLanguage()
                  }}
                  activeOpacity={0.8}
                  style={{
                    width: (windowWidth * 20) / 100,
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
                    {LangProvider.Restart[languageIndex]}
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

export default SupportandMore;
