import React, { useEffect, useState } from "react";
import {
  useWindowDimensions,
  View,
} from "react-native";
import { vs } from "react-native-size-matters";
import { TabBar, TabView } from "react-native-tab-view";
import { useSelector } from "react-redux";
import { Colors, Font } from "../Provider/Colorsfont";
import { Lang_chg } from "../Provider/Language_provider";
import { windowWidth } from "../Provider/utilslib/Utils";

const LabAppointment = (props) => {

  // console.log("sound ::::", sound);
  const { address, loggedInUserDetails, guest, appLanguage } = useSelector(state => state.StorageReducer)

  const { navigation, indexPosition, sendData, data } = props;
  const TestSelection = () => <View style={{ flex: 1, }} />;

  const PackageSelection = () => <View style={{ flex: 1 }} />;
  const layout = useWindowDimensions();
  const [languageIndex, setLanguageIndex] = useState(appLanguage == 'en' ? 0 : 1,)
  const [index, setIndex] = useState(indexPosition ? indexPosition : 0);
  const [routes, setRoute] = useState([]);
  const [tabKey, setTabKey] = useState("test");

  useEffect(() => {
    setRoutes();
  }, []);

  const setRoutes = () => {
    let tabArray = [];
    if (data.task_base_task != null && data.task_base_task.length > 0) {
      tabArray.push({
        key: "test",
        title: Lang_chg.Tests[languageIndex],
      });
    }
    if (data.package_base_task != null && data.package_base_task.length > 0) {
      tabArray.push({
        key: "package",
        title: Lang_chg.HealthPackages[languageIndex],
      });
    }
    //set route here
    setRoute(tabArray);
  };

  const renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case "test":
        return (
          <TestSelection
            pageName={"test"}
            jumpTo={jumpTo}
            {...props}
            {...{ navigation }}
          />
        );
      case "package":
        return (
          <PackageSelection
            pageName={"package"}
            jumpTo={jumpTo}
            {...props}
            {...{ navigation }}
          />
        );
    }
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: Colors.Blue,
        height: (windowWidth * 1) / 100,
      }}
      activeColor={Colors.Blue}
      inactiveColor={Colors.lightGrey}
      style={{ backgroundColor: "#F1F2F4" }}
      labelStyle={{
        textTransform: "capitalize",
        fontSize: Font.large,
        alignSelf:'flex-start',
        fontFamily: Font.Medium,
        alignSelf: "center",
      }}
      onTabPress={({ route, preventDefault }) => {
        console.log(route);
        setTabKey(route.key);
        sendData({
          text: null,
          audio: null,
          tab: route.key === "test" ? 0 : 1,
          image: null,
        });
        if (route.key === "test") {
          // preventDefault();
          // Do something else
        }
      }}
    />
  );
  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={(val) => {
        setIndex(val)
        props.resetState()
      }}
      initialLayout={{
        width: layout.width,
        height: layout.height,

      }}
      style={{ height: 40, width: routes.length > 1 ? '98%' : '49%', }}
      renderTabBar={renderTabBar}
    />
  );
};
export default LabAppointment;
