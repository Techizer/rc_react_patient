import React, { Component } from "react";
import {
  View,
  Dimensions,
  Modal,
  TouchableOpacity,
  Text,
} from "react-native";
import { useSelector } from "react-redux";
import { Colors, Font, LangProvider, windowWidth } from "./Utils/Utils";

const Cameragallery = ({
  mediamodal,
  onRequestClose,
  Canclemedia,
  Camerapopen,
  Galleryopen
}) => {
  const { languageIndex } = useSelector(state => state.StorageReducer)

  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={mediamodal}
      onRequestClose={onRequestClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "#00000030",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <View style={{ width: windowWidth }}>
          <View
            style={{
              width: "94%",
              backgroundColor: Colors.White,
              borderRadius: 5,
              paddingVertical: (windowWidth * 4) / 100,
              alignSelf: "center",
              marginTop: "3%",
            }}
          >
            <View style={{ width: "85%", alignSelf: "center" }}>
              <Text
                style={{
                  fontFamily: Font.Medium,
                  alignSelf: 'flex-start',
                  fontSize: (windowWidth * 5) / 100,
                  color: "#000",
                }}
              >
                {LangProvider.select_option[languageIndex]}
              </Text>

              <TouchableOpacity
                style={{ marginTop: "7%" }}
                activeOpacity={0.9}
                onPress={Camerapopen}
              >
                <Text
                  style={{
                    fontFamily: Font.Regular,
                    alignSelf: 'flex-start',
                    fontSize: (windowWidth * 4.5) / 100,
                    color: "#000",
                  }}
                >
                  {LangProvider.MediaCamera[languageIndex]}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginTop: "7%" }}
                onPress={Galleryopen}
              >
                <Text
                  style={{
                    fontFamily: Font.Regular,
                    alignSelf: 'flex-start',
                    fontSize: (windowWidth * 4.5) / 100,
                    color: "#000",
                  }}
                >
                  {LangProvider.Mediagallery[languageIndex]}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginTop: "7%" }}
                onPress={Canclemedia}
              >
                <Text
                  style={{
                    fontFamily: Font.Regular,
                    alignSelf: 'flex-start',
                    fontSize: (windowWidth * 4.5) / 100,
                    color: "#000",
                  }}
                >
                  {LangProvider.cancelmedia[languageIndex]}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

}

export default Cameragallery;
