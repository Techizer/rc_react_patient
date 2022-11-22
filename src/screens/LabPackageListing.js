import React, { useEffect, useState, useRef } from "react";
import { FlatList, Image, Text, TouchableOpacity } from "react-native";
import { View } from "react-native-animatable";
import { config } from "../Provider/configProvider";
import {
  apifuntion,
  Colors,
  consolepro,
  Font,
  Lang_chg,
  localimag,
  localStorage,
  mobileW,
  msgProvider,
} from "../Provider/utilslib/Utils";
import Styles from "../Styles";

const LabPackageListing = (props) => {
  const { navigation } = props;
  const { providerId } = props.route.params;
  const [labData, setLabData] = useState({});
  console.log("providerId ", providerId);

  useEffect(() => {
    getPackageList();
  }, []);

  const getPackageList = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];
    let url = config.baseURL + "api-lab-package-list";
    console.log("url", url);

    var data = new FormData();
    data.append("lgoin_user_id", user_id);
    data.append("provider_id", providerId);

    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data, 0)
      .then((obj) => {
        consolepro.consolelog("response ---> ", JSON.stringify(obj));

        if (obj.status == true) {
          setLabData(obj.result);
        } else {
          msgProvider.showError(obj.message);
          return false;
        }
      })
      .catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
      });
  };

  return (
    <View style={Styles.container1}>
      <View style={{ backgroundColor: "#f1f2f4", flex: 1 }}>
        <View
          style={{
            backgroundColor: "#fff",
            paddingVertical: (mobileW * 2) / 100,
            borderBottomWidth: 1,
            borderBottomColor: Colors.LIGHT_CLIENT_BORDER,
          }}
        >
          <View
            style={{
              padding: (mobileW * 2.5) / 100,
              flexDirection: "row",
              width: "99%",
              alignSelf: "center",
              paddingTop: (mobileW * 3) / 100,
              backgroundColor: Colors.white_color,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: "10%",
                alignSelf: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
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
                />
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
                {Lang_chg.HealthPackages[config.language]}
              </Text>
            </View>
          </View>
        </View>
        {/* <View style={{ marginTop: (mobileW * 3) / 100, flex: 1 }}> */}
        <View>
          <View
            style={{
              backgroundColor: "#fff",
              paddingBottom: (mobileW * 5) / 100,
              paddingHorizontal: (mobileW * 4) / 100,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                paddingVertical: (mobileW * 1) / 100,
                marginTop: (mobileW * 2) / 100,
              }}
            >
              {/* image and store name */}

              <View style={{ width: "28%" }}>
                <Image
                  source={
                    labData.image == "NA" ||
                    labData.image == null ||
                    labData.image == ""
                      ? localimag.p1
                      : { uri: config.img_url3 + labData.image }
                  }
                  style={{
                    width: (mobileW * 20) / 100,
                    height: (mobileW * 20) / 100,
                    borderWidth: 1,
                    borderColor: "#0888D1",
                    borderRadius: (mobileW * 10) / 100,
                  }}
                />
              </View>

              <View
                style={{
                  width: "55%",
                  alignSelf: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: Font.fontmedium,
                    fontSize: Font.name,
                    textAlign: config.textRotate,
                  }}
                >
                  {labData.provider_name}
                </Text>
                <Text
                  style={{
                    paddingVertical: (mobileW * 1.5) / 100,
                    fontFamily: Font.fontregular,
                    fontSize: Font.subtext,
                    color: Colors.theme_color,
                    textAlign: config.textRotate,
                  }}
                >
                  {labData.iso_text}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* </View> */}
        <FlatList
          data={labData.package_base_task}
          contentContainerStyle={{
            paddingBottom: (mobileW * 25) / 100,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            if (
              labData.package_base_task != "" &&
              labData.package_base_task != null &&
              labData.package_base_task.length !== 0
            ) {
              return (
                <View
                  style={{
                    width: (mobileW * 100) / 100,
                    backgroundColor: "#fff",
                    alignSelf: "center",
                    alignItems: "flex-start",
                    marginTop: (mobileW * 2) / 100,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("LabPackageDetails", {
                        packageId: item.id,
                        providerId: providerId,
                      });
                    }}
                  >
                    <Text
                      style={{
                        width: "100%",
                        marginTop: (mobileW * 3) / 100,
                        paddingHorizontal: (mobileW * 2) / 100,
                        color: "#000",
                        fontFamily: Font.fontmedium,
                        fontSize: (mobileW * 4.5) / 100,
                        textAlign: "left",
                      }}
                    >
                      {item.name}
                    </Text>

                    <Text
                      style={{
                        paddingVertical: (mobileW * 2) / 100,
                        paddingHorizontal: (mobileW * 2) / 100,
                        fontFamily: Font.fontregular,
                        textAlign: "left",
                        color: Colors.tablightcolo,
                        fontSize: Font.sregulartext_size,
                      }}
                    >
                      {item.test_count}
                    </Text>
                    <Text
                      style={{
                        paddingVertical: (mobileW * 1.5) / 100,
                        paddingHorizontal: (mobileW * 2) / 100,
                        fontFamily: Font.fontregular,
                        fontSize: Font.sregulartext_size,
                        color: Colors.theme_color,
                        textAlign: config.textRotate,
                      }}
                    >
                      {item.task_details}
                    </Text>
                    <Text
                      style={{
                        paddingHorizontal: (mobileW * 2) / 100,
                        fontFamily: Font.fontregular,
                        textAlign: "left",
                        fontSize: Font.sregulartext_size,
                        marginTop: (mobileW * 3) / 100,
                        color: Colors.tablightcolo,
                        textDecorationLine: "line-through",
                        textDecorationStyle: "solid",
                      }}
                    >
                      {item.maxrp}
                    </Text>
                    <View
                      style={{
                        paddingVertical: (mobileW * 2) / 100,
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        paddingHorizontal: (mobileW * 2) / 100,
                        alignItem: "center",
                      }}
                    >
                      <Text
                        style={{
                          textAlign: config.textalign,
                          fontFamily: Font.fontmedium,
                          fontSize: (mobileW * 4) / 100,
                        }}
                      >
                        {item.price}
                      </Text>

                      <View
                        style={{
                          paddingVertical: (mobileW * 0.5) / 100,
                          paddingHorizontal: (mobileW * 3) / 100,
                          marginHorizontal: (mobileW * 4) / 100,
                          borderColor: Colors.buttoncolorhgreen,
                          color: Colors.buttoncolorhgreen,
                          borderRadius: 5,
                          borderStyle: "dotted",
                          borderWidth: 1,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Font.fontregular,
                            textAlign: "left",
                            color: Colors.textGreenColor,
                            fontSize: Font.sregulartext_size,
                          }}
                        >
                          {item.dis_off}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }
          }}
        />
      </View>
    </View>
  );
};

export default LabPackageListing;
