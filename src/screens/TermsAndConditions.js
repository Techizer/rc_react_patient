import React, { Component, useState } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { WebView } from "react-native-webview";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { ScreenHeader } from "../components/ScreenHeader";
import { leftArrow } from "../Icons/Index";
import {
  Colors,
  config,
  LangProvider,
  windowHeight,
  windowWidth,
} from "../Provider/Utils/Utils";


const TermsAndConditions = ({ navigation, route }) => {

  const { pagename, content_ar, content } = route?.params
  const {
    appLanguage,
    languageIndex
  } = useSelector(state => state.StorageReducer)
  const insets = useSafeAreaInsets()
  return (
    <View style={{ flex: 1, backgroundColor: Colors.White, paddingBottom: insets.bottom }}>

      <ScreenHeader
        title={pagename === 0 ? LangProvider.AboutRootscare[languageIndex] : pagename === 1 ? LangProvider.PrivacyPolicy[languageIndex] : LangProvider.TermsandConditions[languageIndex]}
        navigation={navigation}
        onBackPress={() => navigation.pop()}
        leftIcon
      />

      {languageIndex == 1 ? (
        <WebView
          style={styles.webview}
          source={{ uri: content_ar }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false}
          scalesPageToFit={true}
        />
      ) : (
        <WebView
          style={styles.webview}
          source={{ uri: content }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false}
          scalesPageToFit={true}
        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: Colors.White,
    width: windowWidth,
    height: windowHeight,
  },
  backarrow: {
    width: "15%",
  },
  headerText: {
    width: "70%",
  },
});

export default TermsAndConditions;