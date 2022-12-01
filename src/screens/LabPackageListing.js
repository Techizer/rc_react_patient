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
  Icons,
  localStorage,
  windowWidth,
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
            paddingVertical: (windowWidth * 2) / 100,
            borderBottomWidth: 1,
            borderBottomColor: Colors.Border,
          }}
        >
          <View
            style={{
              padding: (windowWidth * 2.5) / 100,
              flexDirection: "row",
              width: "99%",
              alignSelf: "center",
              paddingTop: (windowWidth * 3) / 100,
              backgroundColor: Colors.White,
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
                      ? Icons.arabic_back
                      : Icons.backarrow
                  }
                  style={{
                    resizeMode: "contain",
                    width: (windowWidth * 9) / 100,
                    alignSelf: "center",
                    height: (windowWidth * 9) / 100,
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
                  fontSize: (windowWidth * 4) / 100,
                }}
              >
                {Lang_chg.HealthPackages[config.language]}
              </Text>
            </View>
          </View>
        </View>
        {/* <View style={{ marginTop: (windowWidth * 3) / 100, flex: 1 }}> */}
        <View>
          <View
            style={{
              backgroundColor: "#fff",
              paddingBottom: (windowWidth * 5) / 100,
              paddingHorizontal: (windowWidth * 4) / 100,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                paddingVertical: (windowWidth * 1) / 100,
                marginTop: (windowWidth * 2) / 100,
              }}
            >
              {/* image and store name */}

              <View style={{ width: "28%" }}>
                <Image
                  source={
                    labData.image == "NA" ||
                    labData.image == null ||
                    labData.image == ""
                      ? Icons.p1
                      : { uri: config.img_url3 + labData.image }
                  }
                  style={{
                    width: (windowWidth * 20) / 100,
                    height: (windowWidth * 20) / 100,
                    borderWidth: 1,
                    borderColor: "#0888D1",
                    borderRadius: (windowWidth * 10) / 100,
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
                    paddingVertical: (windowWidth * 1.5) / 100,
                    fontFamily: Font.fontregular,
                    fontSize: Font.subtext,
                    color: Colors.Theme,
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
            paddingBottom: (windowWidth * 25) / 100,
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
                    width: (windowWidth * 100) / 100,
                    backgroundColor: "#fff",
                    alignSelf: "center",
                    alignItems: "flex-start",
                    marginTop: (windowWidth * 2) / 100,
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
                        marginTop: (windowWidth * 3) / 100,
                        paddingHorizontal: (windowWidth * 2) / 100,
                        color: "#000",
                        fontFamily: Font.fontmedium,
                        fontSize: (windowWidth * 4.5) / 100,
                        textAlign: "left",
                      }}
                    >
                      {item.name}
                    </Text>

                    <Text
                      style={{
                        paddingVertical: (windowWidth * 2) / 100,
                        paddingHorizontal: (windowWidth * 2) / 100,
                        fontFamily: Font.fontregular,
                        textAlign: "left",
                        color: Colors.lightGrey,
                        fontSize: Font.sregulartext_size,
                      }}
                    >
                      {item.test_count}
                    </Text>
                    <Text
                      style={{
                        paddingVertical: (windowWidth * 1.5) / 100,
                        paddingHorizontal: (windowWidth * 2) / 100,
                        fontFamily: Font.fontregular,
                        fontSize: Font.sregulartext_size,
                        color: Colors.Theme,
                        textAlign: config.textRotate,
                      }}
                    >
                      {item.task_details}
                    </Text>
                    <Text
                      style={{
                        paddingHorizontal: (windowWidth * 2) / 100,
                        fontFamily: Font.fontregular,
                        textAlign: "left",
                        fontSize: Font.sregulartext_size,
                        marginTop: (windowWidth * 3) / 100,
                        color: Colors.lightGrey,
                        textDecorationLine: "line-through",
                        textDecorationStyle: "solid",
                      }}
                    >
                      {item.maxrp}
                    </Text>
                    <View
                      style={{
                        paddingVertical: (windowWidth * 2) / 100,
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        paddingHorizontal: (windowWidth * 2) / 100,
                        alignItem: "center",
                      }}
                    >
                      <Text
                        style={{
                          textAlign: config.textalign,
                          fontFamily: Font.fontmedium,
                          fontSize: (windowWidth * 4) / 100,
                        }}
                      >
                        {item.price}
                      </Text>

                      <View
                        style={{
                          paddingVertical: (windowWidth * 0.5) / 100,
                          paddingHorizontal: (windowWidth * 3) / 100,
                          marginHorizontal: (windowWidth * 4) / 100,
                          borderColor: Colors.Green,
                          color: Colors.Green,
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
