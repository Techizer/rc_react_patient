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
import ScreenHeader from "../components/ScreenHeader";
import { leftArrow } from "../icons/SvgIcons/Index";
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
      <View style={{ flex: 1, backgroundColor: Colors.White }}>

        <ScreenHeader
          title={this.state.pagename === 0 ? Lang_chg.AboutRootscare[config.language] : this.state.pagename === 1 ? Lang_chg.PrivacyPolicy[config.language] : Lang_chg.TermsandConditions[config.language]}
          navigation={this.props.navigation}
          onBackPress={() => this.props.navigation.pop()}
          leftIcon={leftArrow}
        />

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
    backgroundColor: Colors.White,
    width: deviceWidth,
    height: deviceHeight,
  },
  backarrow: {
    width: "15%",
  },
  headerText: {
    width: "70%",
  },
});
