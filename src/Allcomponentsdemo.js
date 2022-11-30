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
import { Colors, Font, windowWidth, Icons } from "./Provider/utilslib/Utils";
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
            paddingVertical: (windowWidth * 0.5) / 100,
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
              paddingTop: (windowWidth * 2) / 100,
            }}
          >
            <Image
              source={Icons.leftarrow}
              style={{
                resizeMode: "center",
                width: (windowWidth * 4.3) / 100,
                height: (windowWidth * 4.3) / 100,
                marginRight: (windowWidth * 0.5) / 100,
              }}
            ></Image>
            <Text
              style={{
                fontFamily: Font.fontbold,
                fontSize: (windowWidth * 4) / 100,
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
                marginRight: (windowWidth * 4) / 100,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={Icons.shareicon}
                style={{
                  resizeMode: "contain",
                  width: (windowWidth * 7) / 100,
                  height: (windowWidth * 7) / 100,
                }}
              ></Image>
              <Text
                style={{
                  fontFamily: Font.fontbold,
                  fontSize: (windowWidth * 4) / 100,
                  alignSelf: "center",
                  margin: (windowWidth * 3.5) / 100,
                  marginTop: (windowWidth * 5) / 100,
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
            paddingVertical: (windowWidth * 0.5) / 100,
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
              paddingTop: (windowWidth * 2) / 100,
            }}
          >
            <Image
              source={Icons.leftarrow}
              style={{
                resizeMode: "center",
                width: (windowWidth * 4.3) / 100,
                height: (windowWidth * 4.3) / 100,
                marginRight: (windowWidth * 0.5) / 100,
              }}
            ></Image>
            <Text
              style={{
                fontFamily: Font.fontbold,
                fontSize: (windowWidth * 4) / 100,
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
                marginRight: (windowWidth * 4) / 100,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={Icons.shareicon}
                style={{
                  resizeMode: "contain",
                  width: (windowWidth * 7) / 100,
                  height: (windowWidth * 7) / 100,
                }}
              ></Image>
              <Text
                style={{
                  fontFamily: Font.fontbold,
                  fontSize: (windowWidth * 4) / 100,
                  alignSelf: "center",
                  margin: (windowWidth * 3.5) / 100,
                  marginTop: (windowWidth * 5) / 100,
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
      //       paddingVertical: (windowWidth * 2.8) / 100,
      //     }}>
      <TouchableOpacity
        onPress={this.props.onPress}
        // onPress={navigation.navigate.goBack()}
        style={{
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-start",
          paddingTop: (windowWidth * 2) / 100,
        }}
      >
        <Image
          source={Icons.leftarrow}
          style={{
            resizeMode: "contain",
            width: (windowWidth * 4.3) / 100,
            height: (windowWidth * 4.3) / 100,
            marginRight: (windowWidth * 0.5) / 100,
          }}
        ></Image>
        <Text
          style={{
            fontFamily: Font.fontbold,
            fontSize: (windowWidth * 4) / 100,
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
          paddingVertical: (windowWidth * 6) / 100,
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
        source={Icons.c}
        style={{
          marginTop: (windowWidth * 7.5) / 100,
          marginBottom: (windowWidth * 5.5) / 100,
          width: (windowWidth * 22) / 100,
          height: (windowWidth * 22) / 100,
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: Colors.whiteColor,
            fontFamily: Font.fontextrabold,
            fontSize: (windowWidth * 8) / 100,
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
          marginVertical: (windowWidth * 0.5) / 100,
        }}
      >
        {/* search box */}

        <View
          style={{
            flexDirection: "row",
            borderColor: "#b4b8be",
            backgroundColor: Colors.white_smoke,
            borderRadius: Font.digi_inp_border_size,
            marginVertical: (windowWidth * 3) / 100,
            alignItems: "center",
            justifyContent: "flex-end",
            marginLeft: (windowWidth * 5) / 100,
            paddingHorizontal: (windowWidth * 2) / 100,
          }}
        >
          <View
            style={{
              width: "10%",
            }}
          >
            <Image
              source={Icons.search}
              style={{
                width: (windowWidth * 4.5) / 100,
                height: (windowWidth * 4.5) / 100,
              }}
            ></Image>
          </View>
          <View style={{ width: "88%" }}>
            <TextInput
              placeholder={props.placeholdervalue}
              DarkGrey={Colors.gray2}
              style={{
                color: Colors.gray1,
                paddingLeft: (windowWidth * 1) / 100,
                fontSize: Font.slightlymoresmallnormal,
                // paddingVertical:
                //   Platform.OS == 'ios'
                //     ? (windowWidth * 3) / 100
                //     : (windowWidth * 2) / 100,
                padding: 0,
                height: (windowWidth * 11) / 100,
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
            source={Icons.p4}
            style={{
              width: (windowWidth * 11) / 100,
              height: (windowWidth * 11) / 100,
              // (windowWidth * 5.5) / 100,
              borderRadius: (windowWidth * 5.5) / 100,
              marginLeft: (windowWidth * 4) / 100,
              alignSelf: "center",
            }}
          ></Image>
        </View>
      </View>
      <View
        style={{
          borderColor: "#EDEDED",
          borderBottomWidth: (windowWidth * 0.5) / 100,
          // elevation: (windowWidth * 0.3) / 100,
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
        paddingVertical: (windowWidth * 1.5) / 100,
        marginVertical: (windowWidth * 3.8) / 100,
        borderRadius: (windowWidth * 1) / 100,
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
          // marginVertical: (windowWidth * 2) / 100,

          // paddingVertical: (windowWidth * 5) / 100,
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
              width: (windowWidth * 8) / 100,
              height: (windowWidth * 8) / 100,
            }}
            source={Icons.rightarrow}
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
        <Image style={styles.checkboximg} source={Icons.checkedbox}></Image>
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
          source={Icons.uncheckedbox}
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
          source={Icons.uncheckedbox}
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
        fontSize: (windowWidth * 5) / 100,
        // marginTop: (windowWidth * mt) / 100,
        // marginBottom: (windowWidth * mb) / 100,
      }}
    >
      {title}
    </Text>
  );
}

export function Appaddoptionbox(props) {
  return (
    <View style={styles.profileinfowithimg}>
      <Image source={Icons.plusicon} style={styles.infoimgicon}></Image>
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
        paddingTop: (windowWidth * 9) / 100,
      }}
    >
      <Text
        style={{
          fontFamily: Font.fontextrabold,
          fontSize: (windowWidth * 4.3) / 100,
          paddingTop: (windowWidth * 1) / 100,
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
        source={Icons.blueimagebackground}
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
    width: (windowWidth * 13) / 100,
    height: (windowWidth * 13) / 100,
    borderRadius: (windowWidth * 5) / 50,
  },
  notebox: {
    backgroundColor: "#fff",
    padding: (windowWidth * 4) / 100,
    marginTop: (windowWidth * 2) / 100,
    borderRadius: (windowWidth * 2) / 100,
  },
  noteboxtxt: {
    fontFamily: Font.fontregular,
    lineHeight: (windowWidth * 5) / 100,
  },
  notecard: {
    paddingTop: (windowWidth * 3) / 100,
  },
  checkboxcontainer: {
    paddingTop: (windowWidth * 3) / 100,
  },
  allcheckbox: {
    width: "93%",
    alignSelf: "flex-end",
  },

  checkboxview: {
    // paddingVertical: (windowWidth * 1.5) / 100,

    alignItems: "center",
    alignSelf: "center",
    // backgroundColor: 'red',
    paddingVertical: (windowWidth * 1.3) / 100,
    flexDirection: "row",
    // alignItems: 'center',
    justifyContent: "space-between",
  },
  checkboximg: {
    width: (windowWidth * 7) / 100,
    height: (windowWidth * 7) / 100,
    borderRadius: (windowWidth * 0.4) / 100,
    marginRight: (windowWidth * 2) / 100,
    resizeMode: "contain",
    alignSelf: "flex-start",
    flex: 0.1,
  },
  uncheckboximg: {
    resizeMode: "contain",
    width: (windowWidth * 6) / 100,
    height: (windowWidth * 6) / 100,
    borderRadius: (windowWidth * 0.4) / 100,
    marginRight: (windowWidth * 2.9) / 100,
    marginLeft: (windowWidth * 0.6) / 100,
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
    marginVertical: (windowWidth * 9) / 100,
  },
  buttontext: {
    paddingVertical: (windowWidth * 3) / 100,
    paddingHorizontal: (windowWidth * 3) / 100,
    borderRadius: (windowWidth * 2) / 100,
    textAlign: "center",
    backgroundColor: "#4C94DB",
    textAlign: "center",
    color: Colors.whiteColor,
    fontFamily: Font.fontextrabold,
    fontSize: (windowWidth * 4.2) / 100,
  },

  profilecontainer: {
    marginVertical: (windowWidth * 1.2) / 100,
  },
  profileinfo: {
    backgroundColor: "#fff",
    marginVertical: (windowWidth * 1.2) / 100,
    padding: (windowWidth * 3) / 100,
    borderRadius: (windowWidth * 1) / 100,
  },
  profileinfowithimg: {
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "#fff",
    marginVertical: (windowWidth * 1.2) / 100,
    padding: (windowWidth * 3) / 100,
    paddingVertical: (windowWidth * 2) / 100,
    borderRadius: (windowWidth * 1) / 100,
    // backgroundColor: 'red',
  },
  infoimgicon: {
    resizeMode: "contain",
    width: (windowWidth * 8) / 100,
    height: (windowWidth * 8) / 100,
    borderRadius: (windowWidth * 10) / 100,
    marginRight: (windowWidth * 2) / 100,
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
    width: (windowWidth * 13) / 100,
    height: (windowWidth * 13) / 100,
    borderRadius: (windowWidth * 5) / 50,
  },
  notebox: {
    backgroundColor: "#fff",
    padding: (windowWidth * 6) / 100,
    marginTop: (windowWidth * 2) / 100,
    borderRadius: (windowWidth * 2) / 100,
  },
  noteboxtxt: {
    fontFamily: Font.fontbold,
    fontSize: (windowWidth * 3.8) / 100,
    lineHeight: (windowWidth * 5) / 100,
  },
  notecard: {
    paddingTop: (windowWidth * 3) / 100,
  },
  checkboxcontainer: {
    paddingTop: (windowWidth * 3) / 100,
  },

  notecardheading: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addoptioncontainer: { marginTop: (windowWidth * 9) / 100 },

  imgboxcontainer: {
    borderRadius: digisize.digi_5,
  },
  imgbox: {
    height: (windowWidth * 30) / 100,
    width: (windowWidth * 39) / 100,
    padding: (windowWidth * 2) / 100,
    borderWidth: (windowWidth * 0.6) / 100,
    borderRadius: (windowWidth * 3) / 100,
    borderColor: Colors.gainsboro,
    overflow: "hidden",
    marginRight: (windowWidth * 4) / 100,
    marginBottom: (windowWidth * 4) / 100,
  },
  imgboxstyle: { borderRadius: (windowWidth * 3) / 100 },
  insideview: {
    marginTop: (windowWidth * 2) / 100,
  },
  insideviewtext: {
    alignSelf: "flex-end",
    fontFamily: Font.fontextrabold,
    fontSize: Font.bigheadingfont,
    color: "#4B4B4B",
    marginRight: (windowWidth * 0.2) / 100,
  },
  insideviewimg: {
    alignSelf: "center",
    height: (windowWidth * 8.5) / 100,
    width: (windowWidth * 8.2) / 100,
    alignSelf: "center",
    marginBottom: (windowWidth * 2.5) / 100,
    resizeMode: "center",
  },
  insideviewname: {
    alignSelf: "center",
    fontFamily: Font.fontextrabold,
    fontSize: Font.mini,
    color: "#4B4B4B",
  },
});
