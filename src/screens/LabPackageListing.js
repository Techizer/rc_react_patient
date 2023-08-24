import React, { useEffect, useState, useRef } from "react";
import { FlatList, Image, Text, TouchableOpacity } from "react-native";
import { View } from "react-native-animatable";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import { useSelector } from "react-redux";
import NoInternet from "../Components/NoInternet";
import { dummyUser, leftArrow, Notification } from "../Icons/Index";
import { config } from "../Provider/configProvider";
import {
  apifuntion,
  Colors,
  Font,
  LangProvider,
  Icons,
  windowWidth,
  msgProvider,
  ScreenHeader
} from "../Provider/Utils/Utils";

const LabPackageListing = ({ navigation, route }) => {

  const { loggedInUserDetails, deviceConnection,appLanguage, languageIndex } = useSelector(state => state.StorageReducer)

  const { providerId } = route?.params || '';
  const [labData, setLabData] = useState(null);

  useEffect(() => {
    if(deviceConnection){
      getPackageList();
    }
  }, [deviceConnection]);

  const getPackageList = async () => {
    let url = config.baseURL + "api-lab-package-list";

    var data = new FormData();
    data.append("lgoin_user_id", loggedInUserDetails?.user_id);
    data.append("provider_id", providerId);

    apifuntion
      .postApi(url, data, 0)
      .then((obj) => {
        console.log("getPackageList-response ---> ", JSON.stringify(obj));

        if (obj.status == true) {
          setLabData(obj.result);
        } else {
          msgProvider.showError(obj.message);
          return false;
        }
      })
      .catch((error) => {
        console.log("getPackageList-error ------- " + error);
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>

      <ScreenHeader
        title={LangProvider.HealthPackages[languageIndex]}
        navigation={navigation}
        onBackPress={() => navigation.pop()}
        leftIcon
      />

      <View
        style={{
          backgroundColor: Colors.White,
          paddingBottom: vs(15),
          paddingHorizontal: s(11),
          marginTop: vs(7)
        }}
      >
        <View
          style={{
            flexDirection: "row",
            paddingVertical: (windowWidth * 1) / 100,
            marginTop: (windowWidth * 2) / 100,
          }}
        >

          <View style={{ width: "28%" }}>
            {
              (labData?.image == "NA" || labData?.image == null || labData?.image == "") ?
                <SvgXml xml={dummyUser} height={vs(65)} width={s(65)} />
                :
                <Image
                  source={{ uri: config.img_url3 + labData?.image }}
                  style={{
                    width: s(65),
                    height: s(65),
                    borderWidth: 1,
                    borderColor: Colors.Border,
                    borderRadius: s(100),
                  }}
                />
            }

          </View>

          <View
            style={{
              width: "55%",
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                fontFamily: Font.Medium,
                fontSize: Font.medium,
                alignSelf: 'flex-start',
              }}
            >
              {labData?.provider_name}
            </Text>
            <Text
              style={{
                paddingVertical: (windowWidth * 1.5) / 100,
                fontFamily: Font.Regular,
                fontSize: Font.medium,
                color: Colors.Theme,
                alignSelf: 'flex-start',
              }}
            >
              {labData?.iso_text}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={labData?.package_base_task}
        contentContainerStyle={{
          paddingBottom: (windowWidth * 25) / 100,
          marginTop: vs(7)
        }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => {
          return (
            <View style={{ height: vs(7) }}></View>
          )
        }}
        renderItem={({ item, index }) => {
          if (
            labData?.package_base_task != "" &&
            labData?.package_base_task != null &&
            labData?.package_base_task.length !== 0
          ) {
            return (
              <View
                style={{
                  width: (windowWidth * 100) / 100,
                  backgroundColor: "#fff",
                  alignSelf: "center",
                  alignItems: "flex-start",
                  paddingHorizontal: s(11)
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
                      color: "#000",
                      fontFamily: Font.Medium,
                      fontSize: (windowWidth * 4.5) / 100,
                      textAlign: "left",
                    }}
                  >
                    {item.name}
                  </Text>

                  <Text
                    style={{
                      paddingVertical: (windowWidth * 2) / 100,
                      fontFamily: Font.Regular,
                      textAlign: "left",
                      color: Colors.lightGrey,
                      fontSize: Font.small,
                    }}
                  >
                    {item.test_count}
                  </Text>
                  <Text
                    style={{
                      paddingVertical: (windowWidth * 1.5) / 100,
                      fontFamily: Font.Regular,
                      fontSize: Font.small,
                      color: Colors.Theme,
                      alignSelf: 'flex-start'
                    }}
                  >
                    {item.task_details}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Font.Regular,
                      textAlign: "left",
                      fontSize: Font.small,
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
                      alignItem: "center",
                    }}
                  >
                    <Text
                      style={{
                        alignSelf: 'flex-start',
                        fontFamily: Font.Medium,
                        fontSize: (windowWidth * 4) / 100,
                      }}
                    >
                      {item.price}
                    </Text>

                    <View
                      style={{
                        paddingVertical: vs(3),
                        paddingHorizontal: s(3),
                        marginHorizontal: s(15),
                        borderColor: Colors.Green,
                        color: Colors.Green,
                        borderRadius: 5,
                        borderStyle: "dotted",
                        borderWidth: 1,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: Font.Regular,
                          textAlign: "left",
                          color: Colors.textGreenColor,
                          fontSize: Font.small,
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
  );
};

export default LabPackageListing;
