import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Alert,
  TextInput,
} from "react-native";
import { digisize } from "./Provider/Colorsfont";
import { Colors, Font, mobileW, localimag } from "./Provider/utilslib/Utils";
import PropTypes from "prop-types";

class Arrowandbackwithedit extends Component {
  render() {
    return (
      <View style={{ backgroundColor: "#fff" }}>
        {/* goback  with exit*/}
        <View
          style={{
            flexDirection: "row",
            width: "90%",
            alignSelf: "center",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: (mobileW * 0.5) / 100,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("EditProfile");
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "82%",
              alignSelf: "center",
              paddingTop: (mobileW * 2) / 100,
            }}
          >
            <Image
              source={localimag.leftarrow}
              style={{
                resizeMode: "center",
                width: (mobileW * 4.3) / 100,
                height: (mobileW * 4.3) / 100,
                marginRight: (mobileW * 0.5) / 100,
              }}
            ></Image>
            <Text
              style={{
                fontFamily: Font.fontbold,
                fontSize: (mobileW * 4) / 100,
              }}
            >
              Back
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("EditProfile");
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "30%",
              alignSelf: "center",
            }}
          >
            <View
              style={{
                marginRight: (mobileW * 4) / 100,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={localimag.shareicon}
                style={{
                  resizeMode: "contain",
                  width: (mobileW * 7) / 100,
                  height: (mobileW * 7) / 100,
                }}
              ></Image>
              <Text
                style={{
                  fontFamily: Font.fontbold,
                  fontSize: (mobileW * 4) / 100,
                  alignSelf: "center",
                  margin: (mobileW * 3.5) / 100,
                  marginTop: (mobileW * 5) / 100,
                }}
              >
                Edit
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

class Arrowandbackwitheditprofile extends Component {
  render() {
    return (
      <View style={{ backgroundColor: "#fff" }}>
        {/* goback  with exit*/}
        <View
          style={{
            flexDirection: "row",
            width: "90%",
            alignSelf: "center",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: (mobileW * 0.5) / 100,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              Alert.alert("sdlkfjl");
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "82%",
              alignSelf: "center",
              paddingTop: (mobileW * 2) / 100,
            }}
          >
            <Image
              source={localimag.leftarrow}
              style={{
                resizeMode: "center",
                width: (mobileW * 4.3) / 100,
                height: (mobileW * 4.3) / 100,
                marginRight: (mobileW * 0.5) / 100,
              }}
            ></Image>
            <Text
              style={{
                fontFamily: Font.fontbold,
                fontSize: (mobileW * 4) / 100,
              }}
            >
              Back
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("EditProfile");
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "30%",
              alignSelf: "center",
            }}
          >
            <View
              style={{
                marginRight: (mobileW * 4) / 100,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={localimag.shareicon}
                style={{
                  resizeMode: "contain",
                  width: (mobileW * 7) / 100,
                  height: (mobileW * 7) / 100,
                }}
              ></Image>
              <Text
                style={{
                  fontFamily: Font.fontbold,
                  fontSize: (mobileW * 4) / 100,
                  alignSelf: "center",
                  margin: (mobileW * 3.5) / 100,
                  marginTop: (mobileW * 5) / 100,
                }}
              >
                Edit
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

class Arrowandback extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    // let navigation = props.onPress;
    return (
      // <View style={{backgroundColor: '#fff'}}>
      //   {/* goback  with exit*/}
      //   <View
      //     style={{
      //       flexDirection: 'row',
      //       width: '90%',
      //       alignSelf: 'center',
      //       justifyContent: 'space-between',
      //       alignItems: 'center',
      //       paddingVertical: (mobileW * 2.8) / 100,
      //     }}>
      <TouchableOpacity
        onPress={this.props.onPress}
        // onPress={navigation.navigate.goBack()}
        style={{
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-start",
          paddingTop: (mobileW * 2) / 100,
        }}
      >
        <Image
          source={localimag.leftarrow}
          style={{
            resizeMode: "contain",
            width: (mobileW * 4.3) / 100,
            height: (mobileW * 4.3) / 100,
            marginRight: (mobileW * 0.5) / 100,
          }}
        ></Image>
        <Text
          style={{
            fontFamily: Font.fontbold,
            fontSize: (mobileW * 4) / 100,
          }}
        >
          {" "}
          Back
        </Text>
      </TouchableOpacity>
      //   </View>
      // </View>
    );
  }
}

class Pageheading extends Component {
  render() {
    return (
      <View
        style={{
          // backgroundColor: '#fff',
          paddingVertical: (mobileW * 6) / 100,
        }}
      ></View>
    );
  }
}

Arrowandback.propTypes = {
  onPress: PropTypes.func.isRequired,
};

class Profilepic extends Component {
  render() {
    return (
      <ImageBackground
        resizeMode="contain"
        source={localimag.c}
        style={{
          marginTop: (mobileW * 7.5) / 100,
          marginBottom: (mobileW * 5.5) / 100,
          width: (mobileW * 22) / 100,
          height: (mobileW * 22) / 100,
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: Colors.whiteColor,
            fontFamily: Font.fontextrabold,
            fontSize: (mobileW * 8) / 100,
            width: "80%",
            textAlign: "center",
          }}
        >
          {this.props.title}
        </Text>
      </ImageBackground>
    );
  }
}

export function Searchbarandicon(props) {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          width: "80%",
          marginVertical: (mobileW * 0.5) / 100,
        }}
      >
        {/* search box */}

        <View
          style={{
            flexDirection: "row",
            borderColor: "#b4b8be",
            backgroundColor: Colors.white_smoke,
            borderRadius: Font.digi_inp_border_size,
            marginVertical: (mobileW * 3) / 100,
            alignItems: "center",
            justifyContent: "flex-end",
            marginLeft: (mobileW * 5) / 100,
            paddingHorizontal: (mobileW * 2) / 100,
          }}
        >
          <View
            style={{
              width: "10%",
            }}
          >
            <Image
              source={localimag.search}
              style={{
                width: (mobileW * 4.5) / 100,
                height: (mobileW * 4.5) / 100,
              }}
            ></Image>
          </View>
          <View style={{ width: "88%" }}>
            <TextInput
              placeholder={props.placeholdervalue}
              placeholderTextColor={Colors.gray2}
              style={{
                color: Colors.gray1,
                paddingLeft: (mobileW * 1) / 100,
                fontSize: Font.slightlymoresmallnormal,
                // paddingVertical:
                //   Platform.OS == 'ios'
                //     ? (mobileW * 3) / 100
                //     : (mobileW * 2) / 100,
                padding: 0,
                height: (mobileW * 11) / 100,
              }}
            ></TextInput>
          </View>
        </View>
        <View
          style={{
            alignSelf: "center",
          }}
        >
          <Image
            source={localimag.p4}
            style={{
              width: (mobileW * 11) / 100,
              height: (mobileW * 11) / 100,
              // (mobileW * 5.5) / 100,
              borderRadius: (mobileW * 5.5) / 100,
              marginLeft: (mobileW * 4) / 100,
              alignSelf: "center",
            }}
          ></Image>
        </View>
      </View>
      <View
        style={{
          borderColor: "#EDEDED",
          borderBottomWidth: (mobileW * 0.5) / 100,
          // elevation: (mobileW * 0.3) / 100,
        }}
      ></View>
    </View>
  );
}

export function Selectionboxandarrow(props) {
  return (
    <View
      style={{
        backgroundColor: props.backgroundColor,
        paddingVertical: (mobileW * 1.5) / 100,
        marginVertical: (mobileW * 3.8) / 100,
        borderRadius: (mobileW * 1) / 100,
      }}
    >
      <View
        style={{
          width: "95%",
          alignSelf: "flex-end",
          flexDirection: "row",
          alignItems: "center",
          // flex: 1,
          justifyContent: "space-between",
          // marginVertical: (mobileW * 2) / 100,

          // paddingVertical: (mobileW * 5) / 100,
        }}
      >
        <Text
          style={{
            fontFamily: Font.fontextrabold,
            fontSize: Font.headingfont,
          }}
        >
          {props.title}
        </Text>
        <TouchableOpacity
          style={{
            flexDirection: "row",
          }}
        >
          <Image
            style={{
              resizeMode: "contain",
              width: (mobileW * 8) / 100,
              height: (mobileW * 8) / 100,
            }}
            source={localimag.rightarrow}
          ></Image>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function Appcheckedbox(props) {
  return (
    <View style={styles.checkboxview}>
      <View style={{ flex: 0.1, alignSelf: "center" }}>
        <Image style={styles.checkboximg} source={localimag.checkedbox}></Image>
      </View>
      <Text style={styles.infosmalltext}>{props.title}</Text>
    </View>
  );
}

export function Appuncheckedbox(props) {
  return (
    <View style={styles.checkboxview}>
      <View style={{ flex: 0.1 }}>
        <Image
          style={styles.uncheckboximg}
          source={localimag.uncheckedbox}
        ></Image>
      </View>
      <Text style={styles.infosmalltext}>{props.title}</Text>
    </View>
  );
}

export function Appcheckedboxselectall(props) {
  return (
    <View style={styles.checkboxview}>
      <View style={{ flex: 0.1 }}>
        <Image
          style={styles.uncheckboximg}
          source={localimag.uncheckedbox}
        ></Image>
      </View>
      <Text style={[styles.checkboxtext, {}]}>Select All</Text>
    </View>
  );
}

export function Appheading({ title, mb, mt }) {
  return (
    <Text
      style={{
        fontFamily: Font.fontextrabold,
        fontSize: (mobileW * 5) / 100,
        // marginTop: (mobileW * mt) / 100,
        // marginBottom: (mobileW * mb) / 100,
      }}
    >
      {title}
    </Text>
  );
}

export function Appaddoptionbox(props) {
  return (
    <View style={styles.profileinfowithimg}>
      <Image source={localimag.plusicon} style={styles.infoimgicon}></Image>
      <Text style={styles.infosmalltext}>{props.title}</Text>
    </View>
  );
}

export function Appcenteredcontaint(props) {
  return <View style={{ alignSelf: "center" }}>{props}</View>;
}

export function Appaddnoteheading(props) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: (mobileW * 9) / 100,
      }}
    >
      <Text
        style={{
          fontFamily: Font.fontextrabold,
          fontSize: (mobileW * 4.3) / 100,
          paddingTop: (mobileW * 1) / 100,
        }}
      >
        Notes
      </Text>
      <TouchableOpacity style={{}}>
        <Text
          style={{
            fontFamily: Font.fontextrabold,
            textDecorationLine: "underline",
            color: Colors.blue_digi,
          }}
        >
          Add Note
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export function Appmainbox(props) {
  return (
    <TouchableOpacity
      onPress={() => {
        this.props.navigation.navigate("Enquiries");
      }}
    >
      <ImageBackground
        imageStyle={styles.imgboxstyle}
        style={styles.imgbox}
        source={localimag.blueimagebackground}
      >
        <View style={styles.insideview}>
          <Text style={styles.insideviewtext}>{props.count}</Text>
        </View>
        <Image source={props.icon} style={styles.insideviewimg}></Image>
        <Text style={styles.insideviewname}>{props.title}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
}

export {
  Arrowandbackwithedit,
  Arrowandbackwitheditprofile,
  Arrowandback,
  Profilepic,
  Pageheading,
  // Searchbarandicon,
  // Selectionboxandarrow,
};

const styles = StyleSheet.create({
  icons: {
    width: (mobileW * 13) / 100,
    height: (mobileW * 13) / 100,
    borderRadius: (mobileW * 5) / 50,
  },
  notebox: {
    backgroundColor: "#fff",
    padding: (mobileW * 4) / 100,
    marginTop: (mobileW * 2) / 100,
    borderRadius: (mobileW * 2) / 100,
  },
  noteboxtxt: {
    fontFamily: Font.fontregular,
    lineHeight: (mobileW * 5) / 100,
  },
  notecard: {
    paddingTop: (mobileW * 3) / 100,
  },
  checkboxcontainer: {
    paddingTop: (mobileW * 3) / 100,
  },
  allcheckbox: {
    width: "93%",
    alignSelf: "flex-end",
  },

  checkboxview: {
    // paddingVertical: (mobileW * 1.5) / 100,

    alignItems: "center",
    alignSelf: "center",
    // backgroundColor: 'red',
    paddingVertical: (mobileW * 1.3) / 100,
    flexDirection: "row",
    // alignItems: 'center',
    justifyContent: "space-between",
  },
  checkboximg: {
    width: (mobileW * 7) / 100,
    height: (mobileW * 7) / 100,
    borderRadius: (mobileW * 0.4) / 100,
    marginRight: (mobileW * 2) / 100,
    resizeMode: "contain",
    alignSelf: "flex-start",
    flex: 0.1,
  },
  uncheckboximg: {
    resizeMode: "contain",
    width: (mobileW * 6) / 100,
    height: (mobileW * 6) / 100,
    borderRadius: (mobileW * 0.4) / 100,
    marginRight: (mobileW * 2.9) / 100,
    marginLeft: (mobileW * 0.6) / 100,
    flex: 0.1,
  },
  checkboxtext: {
    color: "#666666",
    fontSize: Font.smalltextsize,
    fontFamily: Font.fontbold,
    // fontSize: Font.smalltextsize,
    fontFamily: Font.fontbold,
    flex: 0.88,
  },
  buttonstyle: {
    width: "70%",
    alignSelf: "center",
    marginVertical: (mobileW * 9) / 100,
  },
  buttontext: {
    paddingVertical: (mobileW * 3) / 100,
    paddingHorizontal: (mobileW * 3) / 100,
    borderRadius: (mobileW * 2) / 100,
    textAlign: "center",
    backgroundColor: "#4C94DB",
    textAlign: "center",
    color: Colors.whiteColor,
    fontFamily: Font.fontextrabold,
    fontSize: (mobileW * 4.2) / 100,
  },

  profilecontainer: {
    marginVertical: (mobileW * 1.2) / 100,
  },
  profileinfo: {
    backgroundColor: "#fff",
    marginVertical: (mobileW * 1.2) / 100,
    padding: (mobileW * 3) / 100,
    borderRadius: (mobileW * 1) / 100,
  },
  profileinfowithimg: {
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "#fff",
    marginVertical: (mobileW * 1.2) / 100,
    padding: (mobileW * 3) / 100,
    paddingVertical: (mobileW * 2) / 100,
    borderRadius: (mobileW * 1) / 100,
    // backgroundColor: 'red',
  },
  infoimgicon: {
    resizeMode: "contain",
    width: (mobileW * 8) / 100,
    height: (mobileW * 8) / 100,
    borderRadius: (mobileW * 10) / 100,
    marginRight: (mobileW * 2) / 100,
    alignSelf: "center",
  },
  infosmalltext: {
    // width: '90%',
    // alignSelf: 'flex-end',
    alignSelf: "center",
    fontSize: Font.smalltextsize,
    fontFamily: Font.fontbold,
    // backgroundColor: 'red',
    color: Colors.gray3,
    // color: 'red',
    flex: 0.86,
  },

  notes: {},

  icons: {
    width: (mobileW * 13) / 100,
    height: (mobileW * 13) / 100,
    borderRadius: (mobileW * 5) / 50,
  },
  notebox: {
    backgroundColor: "#fff",
    padding: (mobileW * 6) / 100,
    marginTop: (mobileW * 2) / 100,
    borderRadius: (mobileW * 2) / 100,
  },
  noteboxtxt: {
    fontFamily: Font.fontbold,
    fontSize: (mobileW * 3.8) / 100,
    lineHeight: (mobileW * 5) / 100,
  },
  notecard: {
    paddingTop: (mobileW * 3) / 100,
  },
  checkboxcontainer: {
    paddingTop: (mobileW * 3) / 100,
  },

  notecardheading: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addoptioncontainer: { marginTop: (mobileW * 9) / 100 },

  imgboxcontainer: {
    borderRadius: digisize.digi_5,
  },
  imgbox: {
    height: (mobileW * 30) / 100,
    width: (mobileW * 39) / 100,
    padding: (mobileW * 2) / 100,
    borderWidth: (mobileW * 0.6) / 100,
    borderRadius: (mobileW * 3) / 100,
    borderColor: Colors.gainsboro,
    overflow: "hidden",
    marginRight: (mobileW * 4) / 100,
    marginBottom: (mobileW * 4) / 100,
  },
  imgboxstyle: { borderRadius: (mobileW * 3) / 100 },
  insideview: {
    marginTop: (mobileW * 2) / 100,
  },
  insideviewtext: {
    alignSelf: "flex-end",
    fontFamily: Font.fontextrabold,
    fontSize: Font.bigheadingfont,
    color: "#4B4B4B",
    marginRight: (mobileW * 0.2) / 100,
  },
  insideviewimg: {
    alignSelf: "center",
    height: (mobileW * 8.5) / 100,
    width: (mobileW * 8.2) / 100,
    alignSelf: "center",
    marginBottom: (mobileW * 2.5) / 100,
    resizeMode: "center",
  },
  insideviewname: {
    alignSelf: "center",
    fontFamily: Font.fontextrabold,
    fontSize: Font.mini,
    color: "#4B4B4B",
  },
});
