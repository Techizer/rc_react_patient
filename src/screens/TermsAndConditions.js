import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { WebView } from "react-native-webview";
import {
  Colors,
  localimag,
  Font,
  mobileW,
  config,
  Lang_chg,
} from "../Provider/utilslib/Utils";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const content_arr = [
  {
    content_type: 0,
    content: config.about_url_eng,
    content_ar: config.about_url_ar,
  },
  {
    content_type: 1,
    content: config.privacy_url_eng,
    content_ar: config.privacy_url_ar,
  },
  {
    content_type: 2,
    content: config.term_url_eng,
    content_ar: config.term_url_ar,
  },
];
export default class TermsAndConditions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagename: this.props.route.params.contantpage,
      content_ar: this.props.route.params.content_ar,
      content: this.props.route.params.content,
    };
  }

  componentDidMount = () => {
    // this.getAllContent()
    console.log(this.state.pagename);
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={styles.header_view}>
          <View style={styles.backarrow}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}
            >
              <Image
                style={{ width: 30, height: 30, resizeMode: "contain" }}
                source={
                  config.textalign == "right"
                    ? localimag.backarrow
                    : localimag.backarrow
                }
              ></Image>
            </TouchableOpacity>
          </View>
          <View style={styles.headerText}>
            {this.state.pagename == 0 && (
              <Text
                style={{
                  width: "100%",
                  fontSize: (mobileW * 5) / 100,
                  fontFamily: Font.fontmedium,
                  textAlign: "center",
                  color: Colors.Black,
                }}
              >
                {Lang_chg.AboutRootscare[config.language]}
              </Text>
            )}
            {this.state.pagename == 2 && (
              <Text
                style={{
                  width: "100%",
                  fontSize: (mobileW * 5) / 100,
                  fontFamily: Font.fontmedium,
                  textAlign: "center",
                  color: Colors.Black,
                }}
              >
                {Lang_chg.TermsandConditions[config.language]}
              </Text>
            )}
            {this.state.pagename == 1 && (
              <Text
                style={{
                  width: "100%",
                  fontSize: (mobileW * 5) / 100,
                  fontFamily: Font.fontmedium,
                  textAlign: "center",
                  color: Colors.Black,
                }}
              >
                {Lang_chg.PrivacyPolicy[config.language]}
              </Text>
            )}
          </View>
        </View>

        {config.language == 1 ? (
          <WebView
            style={styles.webview}
            source={{ uri: this.state.content_ar }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={false}
            scalesPageToFit={true}
          />
        ) : (
          <WebView
            style={styles.webview}
            source={{ uri: this.state.content }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={false}
            scalesPageToFit={true}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: "#fff",
    width: deviceWidth,
    height: deviceHeight,
  },
  header_view: {
    backgroundColor: "#fff",
    paddingVertical: (mobileW * 3) / 100,
    borderBottomColor: Colors.LIGHT_CLIENT_BORDER,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: (mobileW * 1) / 100,
  },
  backarrow: {
    width: "15%",
  },
  headerText: {
    width: "70%",
  },
});
