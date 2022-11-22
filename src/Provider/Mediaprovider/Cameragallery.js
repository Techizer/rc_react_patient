import React, { Component } from "react";
import {
  View,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { Colors, Font, config, Lang_chg } from "../utilslib/Utils";
const screenHeight = Math.round(Dimensions.get("window").height);
const screenWidth = Math.round(Dimensions.get("window").width);

export default class Cameragallery extends Component {
  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.mediamodal}
        onRequestClose={() => {
          this.setState({ modalVisible: false });
        }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            this.props.Canclemedia();
          }}
          style={{
            flex: 1,
            backgroundColor: "#00000030",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ width: screenWidth }}>
            <View
              style={{
                width: "94%",
                backgroundColor: Colors.mediabackground,
                borderRadius: 5,
                paddingVertical: (screenWidth * 4) / 100,
                alignSelf: "center",
                marginTop: "3%",
              }}
            >
              <View style={{ width: "85%", alignSelf: "center" }}>
                <Text
                  style={{
                    fontFamily: Font.fontmedium,
                    textAlign: config.textRotate,
                    fontSize: (screenWidth * 5) / 100,
                    color: "#000",
                  }}
                >
                  {Lang_chg.select_option[config.language]}
                </Text>

                <TouchableOpacity
                  style={{ marginTop: "7%" }}
                  activeOpacity={0.9}
                  onPress={() => {
                    this.props.Camerapopen();
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Font.fontregular,
                      textAlign: config.textalign,
                      fontSize: (screenWidth * 4.5) / 100,
                      color: "#000",
                    }}
                  >
                    {Lang_chg.MediaCamera[config.language]}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginTop: "7%" }}
                  onPress={() => {
                    this.props.Galleryopen();
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Font.fontregular,
                      textAlign: config.textalign,
                      fontSize: (screenWidth * 4.5) / 100,
                      color: "#000",
                    }}
                  >
                    {Lang_chg.Mediagallery[config.language]}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginTop: "7%" }}
                  onPress={() => {
                    this.props.Canclemedia();
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Font.fontregular,
                      textAlign: config.textalign,
                      fontSize: (screenWidth * 4.5) / 100,
                      color: "#000",
                    }}
                  >
                    {Lang_chg.cancelmedia[config.language]}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    justifyContent: "center",
    backgroundColor: "#00000040",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },

  activityIndicatorWrapper: {
    height: 80,
    width: 80,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    borderRadius: 6,
    justifyContent: "space-around",
    alignItems: "center",
    alignSelf: "center",
  },
});
