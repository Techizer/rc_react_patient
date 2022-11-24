import React from "react";
import {
  Colors,
  Font,
  config,
  mobileW,
  localimag,
} from "./Provider/utilslib/Utils";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import Styles from "./Styles";

export function AppHeader(props) {
  return (
    <View style={styles.headerstyle}>
      <View
        style={{
          padding: (mobileW * 2.5) / 100,
          flexDirection: "row",
          width: "95%",
          alignSelf: "center",
          // paddingTop: (mobileW * 3) / 100,
          backgroundColor: Colors.white_color,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "10%",
            backgroundColor: "#fff",
            justifyContent: "center",
            alignSelf: "center",
            paddingTop: (mobileW * 1.5) / 100,
          }}
        >
          <TouchableOpacity onPress={props.onPressEditProfile}>
            <Image
              source={localimag.p1}
              style={{
                resizeMode: "contain",
                width: (mobileW * 9) / 100,
                height: (mobileW * 9) / 100,
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ width: "80%", alignSelf: "center" }}>
          <Text style={Styles.headertext}>{props.title}</Text>
        </View>
        <View
          style={{
            width: "10%",

            justifyContent: "center",
          }}
        >
          <TouchableOpacity onPress={props.onPresshandler2}>
            <Image
              // tintColor="#fff"
              source={localimag.notifications}
              style={{
                alignSelf: "flex-end",
                resizeMode: "contain",
                width: (mobileW * 6) / 100,
                height: (mobileW * 6) / 100,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export function AppHeader2(props) {
  return (
    <View style={styles.headerstyle}>
      <View
        style={{
          padding: (mobileW * 2.5) / 100,
          flexDirection: "row",
          width: "99%",
          alignSelf: "center",
          paddingTop: (mobileW * 3) / 100,
          backgroundColor: Colors.white_color,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "10%",
            // backgroundColor: 'pink',
            alignSelf: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              props.navigation.goBack();
            }}
          >
            <Image
              source={
                config.textalign == "right"
                  ? localimag.arabic_back
                  : localimag.backarrow
              }
              style={{
                resizeMode: "contain",
                width: (mobileW * 9) / 100,
                alignSelf: "center",
                height: (mobileW * 9) / 100,
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            // backgroundColor: 'yellow',
            width: "80%",
          }}
        >
          <Text style={Styles.headertext}>{props.title}</Text>
        </View>
        <View
          style={{
            width: "10%",
            alignSelf: "center",
            // backgroundColor: 'red',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("Notifications");
            }}
          >
            <Image
              // tintColor="#fff"
              source={localimag.notifications_sec}
              style={{
                alignSelf: "center",
                resizeMode: "contain",
                width: (mobileW * 6) / 100,
                height: (mobileW * 6) / 100,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
export function CarAppHeader2(props) {
  return (
    <View style={styles.headerstyle}>
      <View
        style={{
          padding: (mobileW * 2.5) / 100,
          flexDirection: "row",
          width: "99%",
          alignSelf: "center",
          paddingTop: (mobileW * 3) / 100,
          backgroundColor: Colors.white_color,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "10%",
            // backgroundColor: 'pink',
            alignSelf: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              props.navigation.goBack();
            }}
          >
            <Image
              source={
                config.textalign == "right"
                  ? localimag.arabic_back
                  : localimag.backarrow
              }
              style={{
                resizeMode: "contain",
                width: (mobileW * 9) / 100,
                alignSelf: "center",
                height: (mobileW * 9) / 100,
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            // backgroundColor: 'yellow',
            width: "80%",
          }}
        >
          <Text style={Styles.headertext}>{props.title}</Text>
        </View>
        <View
          style={{
            width: "10%",
            alignSelf: "center",
            // backgroundColor: 'red',
          }}
        />
      </View>
    </View>
  );
}
export function AppHeader3(props) {
  return (
    <View style={styles.headerstyle}>
      <View
        style={{
          flexDirection: "row",
          width: "95%",
          alignSelf: "center",
          paddingVertical: (mobileW * 3) / 100,
          backgroundColor: Colors.white_color,
          alignItems: "center",
          // backgroundColor: 'red',
        }}
      >
        <View
          style={{
            width: "10%",
            // backgroundColor: 'pink',
            alignSelf: "center",
          }}
        >
          <TouchableOpacity onPress={props.handlarrowpress}>
            <Image
              source={
                config.textalign == "right"
                  ? localimag.arabic_back
                  : localimag.backarrow
              }
              style={{
                resizeMode: "contain",
                width: (mobileW * 9) / 100,
                alignSelf: "center",
                height: (mobileW * 9) / 100,
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            // backgroundColor: 'yellow',
            width: "80%",
          }}
        >
          <Text style={Styles.headertext}>{props.title}</Text>
        </View>
        <View
          style={{
            width: "10%",
            alignSelf: "center",
            // backgroundColor: 'red',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("Notification");
            }}
          >
            <Image
              // tintColor="#fff"
              source={localimag.notifications}
              style={{
                alignSelf: "center",
                resizeMode: "contain",
                width: (mobileW * 6) / 100,
                height: (mobileW * 6) / 100,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// without notifications icon

export function AppHeader4(props) {
  return (
    <View style={styles.headerstyle}>
      <View
        style={{
          flexDirection: "row",
          width: "95%",
          alignSelf: "center",
          paddingVertical: (mobileW * 3) / 100,
          backgroundColor: Colors.white_color,
          alignItems: "center",
          // backgroundColor: 'red',
        }}
      >
        <View
          style={{
            width: "10%",
            // backgroundColor: 'pink',
            alignSelf: "center",
          }}
        >
          <TouchableOpacity onPress={props.handlarrowpress}>
            <Image
              source={
                config.textalign == "right"
                  ? localimag.arabic_back
                  : localimag.backarrow
              }
              style={{
                resizeMode: "contain",
                width: (mobileW * 9) / 100,
                alignSelf: "center",
                height: (mobileW * 9) / 100,
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            // backgroundColor: 'yellow',
            width: "80%",
          }}
        >
          <Text style={Styles.headertext}>{props.title}</Text>
        </View>
        <View
          style={{
            width: "10%",
            alignSelf: "center",
            // backgroundColor: 'red',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("Notification");
            }}
          >
            <Image
              // tintColor="#fff"

              style={{
                alignSelf: "center",
                resizeMode: "contain",
                width: (mobileW * 6) / 100,
                height: (mobileW * 6) / 100,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export function Appbtn(props) {
  return (
    <TouchableOpacity
      onPress={props.onPresshandler}
      style={{
        width: "100%",
        alignSelf: "center",
        borderRadius: (mobileW * 2) / 100,
        backgroundColor: Colors.buttoncolorblue,
        paddingVertical: (mobileW * 4) / 100,
        marginTop: (mobileW * 6) / 100,
        shadowColor: "#000",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 3,
      }}
    >
      <Text
        style={{
          color: Colors.textwhite,
          fontFamily: Font.fontmedium,
          fontSize: Font.buttontextsize,
          alignSelf: "flex-end",
          textAlign: config.textalign,
          alignSelf: "center",
        }}
      >
        {props.title}
      </Text>
    </TouchableOpacity>
  );
}

export function Appbtn2(props) {
  return (
    <TouchableOpacity
      onPress={props.onPressHandler}
      style={{
        width: "99%",
        alignSelf: "center",
        borderRadius: (mobileW * 2) / 100,
        backgroundColor: props.bgcolor,
        paddingVertical: (mobileW * 2.8) / 100,
        marginTop: (mobileW * 4) / 100,
      }}
    >
      <Text
        style={{
          color: Colors.textwhite,
          fontFamily: Font.fontmedium,
          fontSize: Font.subtext,
          alignSelf: "flex-end",
          textAlign: config.textalign,
          alignSelf: "center",
        }}
      >
        {props.title}
      </Text>
    </TouchableOpacity>
  );
}

export function Appbtn3(props) {
  return (
    <TouchableOpacity
      onPress={props.handlarrowpress}
      style={{
        width: "90%",
        alignSelf: "center",
        borderRadius: (mobileW * 2) / 100,
        backgroundColor: "#0068b3",
        paddingVertical: (mobileW * 3) / 100,
        alignItems: "center",
        marginTop: (mobileW * 6) / 100,
        shadowColor: "#000",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 3,
      }}
    >
      <Text
        style={{
          color: Colors.textwhite,
          fontFamily: Font.fontmedium,
          fontSize: Font.buttontextsize,
          alignSelf: "center",
        }}
      >
        {props.title}
      </Text>
    </TouchableOpacity>
  );
}

export function Searchbarandicon(props) {
  return (
    <View style={{ backgroundColor: "#f1f2f4" }}>
      <View
        style={{
          flexDirection: "row",
          width: "90%",
          marginTop: (mobileW * 1.5) / 100,
          marginBottom: (mobileW * 2) / 100,
          alignSelf: "center",
          backgroundColor: Colors.textwhite,
          padding: (mobileW * 1) / 100,
          borderRadius: (mobileW * 1) / 100,
          alignItems: "center",
        }}
      >
        {/* search box */}

        <TextInput
          placeholder={props.placeholdervalue}
          placeholderTextColor={Colors.gray2}
          style={{
            color: Colors.gray1,
            fontSize: Font.slightlymoresmallnormal,
            width: "90%",

            paddingVertical: (mobileW * 2) / 100,

            textAlign: config.textalign,
          }}
        />

        <View style={{ alignSelf: "center" }}>
          <Image
            source={localimag.searchiocn2}
            style={{
              width: (mobileW * 8) / 100,
              height: (mobileW * 8) / 100,
              // (mobileW * 5.5) / 100,
              borderRadius: (mobileW * 1.5) / 100,
              alignSelf: "center",
            }}
          />
        </View>
      </View>
    </View>
  );
}

export function Appheading(props) {
  return (
    <View
      style={{
        marginTop: (mobileW * 3) / 100,
        marginBottom: (mobileW * 3) / 100,
        textalign: config.textRotate,
      }}
    >
      <Text style={Styles.headingtext}>{props.title}</Text>
    </View>
  );
}

export function Inactivecard(props) {
  return (
    <View
      style={{
        width: (mobileW * 18) / 100,
        height: (mobileW * 25) / 100,
        borderRadius: (mobileW * 1) / 100,
        borderColor: Colors.theme_color,
        justifyContent: "center",
        //   backgroundColor: '#d1e9f6',
      }}
    >
      <Image
        resizeMode="contain"
        source={localimag.p3}
        style={{
          alignSelf: "center",
          width: (mobileW * 12) / 100,
          height: (mobileW * 12) / 100,
          borderColor: Colors.theme_color,
        }}
      />
      <Text style={{ alignSelf: "center" }}>{props.title}</Text>
    </View>
  );
}

export function Appcheckedbox(props) {
  return (
    <View
      style={{
        alignItems: "center",
        alignSelf: "center",
        // backgroundColor: 'red',
        paddingVertical: (mobileW * 1.3) / 100,
        flexDirection: "row",
        // alignItems: 'center',
        justifyContent: "space-between",
      }}
    >
      <View style={{ flex: 0.2, alignSelf: "center" }}>
        <Image
          style={{
            width: (mobileW * 5) / 100,
            height: (mobileW * 5) / 100,
            borderRadius: (mobileW * 0.4) / 100,
            marginRight: (mobileW * 2) / 100,
            marginLeft: (mobileW * 3) / 100,
            resizeMode: "contain",
            alignSelf: "flex-start",
            flex: 0.1,
          }}
          source={localimag.remembertick}
        />
      </View>
      <Text
        style={{
          // width: '90%',
          // alignSelf: 'flex-end',
          alignSelf: "center",
          fontSize: Font.ssregulartext_size,
          fontFamily: Font.fontlight,
          // backgroundColor: 'red',
          // color: Colors.gray3,
          // color: 'red',
          flex: 0.86,
        }}
      >
        {props.title}
      </Text>
      <Text
        style={{
          // width: '90%',
          alignSelf: "flex-end",
          alignSelf: "center",
          fontSize: Font.ssregulartext_size,
          fontFamily: Font.fontlight,
          // backgroundColor: 'red',
          // color: Colors.gray3,
          // color: 'red',
          flex: 0.86,
          textAlign: "right",
          marginRight: (mobileW * 3) / 100,
        }}
      >
        {props.price}
      </Text>
    </View>
  );
}

export function Appuncheckedbox(props) {
  return (
    <View style={styles.checkboxview}>
      <View style={{ flex: 0.2, alignSelf: "center" }}>
        <Image
          style={{
            width: (mobileW * 5) / 100,
            height: (mobileW * 5) / 100,
            borderRadius: (mobileW * 0.4) / 100,
            marginRight: (mobileW * 2) / 100,
            marginLeft: (mobileW * 3) / 100,
            resizeMode: "contain",
            alignSelf: "flex-start",
            flex: 0.1,
          }}
          source={localimag.rememberdeactivate}
        />
      </View>
      <Text
        style={{
          // width: '90%',
          // alignSelf: 'flex-end',
          alignSelf: "center",
          fontSize: Font.ssregulartext_size,
          fontFamily: Font.fontlight,
          // backgroundColor: 'red',
          // color: Colors.gray3,
          // color: 'red',
          flex: 0.86,
        }}
      >
        {props.title}
      </Text>
      <Text
        style={{
          // width: '90%',
          alignSelf: "flex-end",
          alignSelf: "center",
          fontSize: Font.ssregulartext_size,
          fontFamily: Font.fontlight,
          // backgroundColor: 'red',
          // color: Colors.gray3,
          // color: 'red',
          flex: 0.86,
          textAlign: "right",
          marginRight: (mobileW * 3) / 100,
        }}
      >
        {props.price}
      </Text>
    </View>
  );
}

export function Taskbooking(props) {
  return (
    <View
      style={{
        backgroundColor: Colors.theme_color,
        paddingVertical: (mobileW * 0.8) / 100,
        flexDirection: "row",
        paddingHorizontal: (mobileW * 1.5) / 100,
        // width: '30%',
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: (mobileW * 1) / 100,
        marginRight: (mobileW * 2) / 100,
      }}
    >
      <Text
        style={{
          color: Colors.white_color,
          fontSize: Font.textsize,
          fontFamily: Font.fontlight,
          // paddingHorizontal: (mobileW * 2) / 100,
        }}
      >
        {props.title}
      </Text>
      <Image
        source={localimag.cross2}
        style={{
          alignSelf: "center",
          width: (mobileW * 2) / 100,
          height: (mobileW * 2) / 100,
          marginLeft: (mobileW * 3) / 100,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerstyle: {
    backgroundColor: "#fff",
    paddingVertical: (mobileW * 2) / 100,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_CLIENT_BORDER,
    // shadowOpacity: 0.3,
    // shadowColor:'#000',
    // shadowOffset: {width:1,height:1},
    // elevation:5,
  },
  headerstyle_new: {
    backgroundColor: "red",
    shadowOpacity: 0.3,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    elevation: 10,
    width: "100%",
    paddingVertical: (mobileW * 2) / 100,
  },
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
    fontSize: Font.ssregulartext_size,
    fontFamily: Font.fontlight,
    // backgroundColor: 'red',
    // color: Colors.gray3,
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
    borderRadius: (mobileW * 1) / 100,
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

// email: '',
// emailfocus: '',

{
  /* <View
style={{
  width: '90%',
  alignSelf: 'center',
  marginTop: (mobileW * 3) / 100,
  borderColor: Colors.bordercolor,
  borderWidth: (mobileW * 0.3) / 100,
  borderRadius: (mobileW * 2) / 100,
}}>
<View style={{width: '95%', alignSelf: 'center'}}>
  <TextInput
    style={{
      width: '100%',
      color: Colors.textblack,
      fontSize: Font.placeholdersize,
      textAlign: config.textalign,
      paddingVertical: (mobileW * 4) / 100,
      fontFamily: Font.fontlight,
    }}
    maxLength={50}
    placeholder={
      this.state.emailfocus != true
        ? Lang_chg.textinputemails[config.language]
        : null
    }
    placeholderTextColor={Colors.placeholder_text}
    onChangeText={txt => {
      this.setState({email: txt});
    }}
    value={this.state.email}
    onFocus={() => {
      this.setState({emailfocus: true});
    }}
    onBlur={() => {
      this.setState({
        emailfocus: this.state.email.length > 0 ? true : false,
      });
    }}
    keyboardType="email-address"
    returnKeyLabel="done"
    returnKeyType="done"
  />
</View>
{this.state.emailfocus == true && (
  <View
    style={{
      position: 'absolute',
      backgroundColor: 'white',
      left: (mobileW * 4) / 100,
      top: (-mobileW * 2) / 100,
      paddingHorizontal: (mobileW * 1) / 100,
    }}>
    <Text style={{color: '#0057A5'}}>
      {Lang_chg.textinputemails[config.language]}
    </Text>
  </View>
)}
</View> */
}
