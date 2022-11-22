import React, { useEffect, useState } from "react";
import {
  useWindowDimensions,
  View,
} from "react-native";
import { TabBar, TabView } from "react-native-tab-view";
import { Colors, Font } from "../Provider/Colorsfont";
import { config } from "../Provider/configProvider";
import { Lang_chg } from "../Provider/Language_provider";
import { mobileW } from "../Provider/utilslib/Utils";
const LabAppointment = (props) => {
  // console.log("sound ::::", sound);
  const { navigation, indexPosition, sendData, data } = props;
  const TestSelection = () => <View style={{ flex: 1 }} />;

  const PackageSelection = () => <View style={{ flex: 1 }} />;
  const layout = useWindowDimensions();
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
        title: Lang_chg.Tests[config.language],
      });
    }
    if (data.package_base_task != null && data.package_base_task.length > 0) {
      tabArray.push({
        key: "package",
        title: Lang_chg.HealthPackages[config.language],
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
        backgroundColor: Colors.textblue,
        height: (mobileW * 1) / 100,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
      }}
      activeColor={Colors.textblue}
      inactiveColor={Colors.tablightcolo}
      style={{ backgroundColor: "#F1F2F4" }}
      labelStyle={{
        textTransform: "capitalize",
        fontSize: (mobileW * 4) / 100,
        textAlign: config.textalign,
        fontFamily: Font.fontmedium,
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
    <View style={{ flex: 1 }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{
          width: layout.width,
          height: layout.height,
        }}
        renderTabBar={renderTabBar}
      />
    </View>
  );
};
export default LabAppointment;
