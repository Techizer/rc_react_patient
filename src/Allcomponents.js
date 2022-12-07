import React from "react";
import {
  Colors,
  Font,
  config,
  windowWidth,
  Icons,
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
          padding: (windowWidth * 2.5) / 100,
          flexDirection: "row",
          width: "95%",
          alignSelf: "center",
          // paddingTop: (windowWidth * 3) / 100,
          backgroundColor: Colors.White,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "10%",
            backgroundColor: "#fff",
            justifyContent: "center",
            alignSelf: "center",
            paddingTop: (windowWidth * 1.5) / 100,
          }}
        >
          <TouchableOpacity onPress={props.onPressEditProfile}>
            <Image
              source={Icons.p1}
              style={{
                resizeMode: "contain",
                width: (windowWidth * 9) / 100,
                height: (windowWidth * 9) / 100,
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
              source={Icons.notifications}
              style={{
                alignSelf: "flex-end",
                resizeMode: "contain",
                width: (windowWidth * 6) / 100,
                height: (windowWidth * 6) / 100,
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
          padding: (windowWidth * 2.5) / 100,
          flexDirection: "row",
          width: "99%",
          alignSelf: "center",
          paddingTop: (windowWidth * 3) / 100,
          backgroundColor: Colors.White,
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
                  ? Icons.arabic_back
                  : Icons.backarrow
              }
              style={{
                resizeMode: "contain",
                width: (windowWidth * 9) / 100,
                alignSelf: "center",
                height: (windowWidth * 9) / 100,
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
              source={Icons.notifications_sec}
              style={{
                alignSelf: "center",
                resizeMode: "contain",
                width: (windowWidth * 6) / 100,
                height: (windowWidth * 6) / 100,
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
          padding: (windowWidth * 2.5) / 100,
          flexDirection: "row",
          width: "99%",
          alignSelf: "center",
          paddingTop: (windowWidth * 3) / 100,
          backgroundColor: Colors.White,
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
                  ? Icons.arabic_back
                  : Icons.backarrow
              }
              style={{
                resizeMode: "contain",
                width: (windowWidth * 9) / 100,
                alignSelf: "center",
                height: (windowWidth * 9) / 100,
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
          paddingVertical: (windowWidth * 3) / 100,
          backgroundColor: Colors.White,
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
                  ? Icons.arabic_back
                  : Icons.backarrow
              }
              style={{
                resizeMode: "contain",
                width: (windowWidth * 9) / 100,
                alignSelf: "center",
                height: (windowWidth * 9) / 100,
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
              source={Icons.notifications}
              style={{
                alignSelf: "center",
                resizeMode: "contain",
                width: (windowWidth * 6) / 100,
                height: (windowWidth * 6) / 100,
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
          paddingVertical: (windowWidth * 3) / 100,
          backgroundColor: Colors.White,
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
                  ? Icons.arabic_back
                  : Icons.backarrow
              }
              style={{
                resizeMode: "contain",
                width: (windowWidth * 9) / 100,
                alignSelf: "center",
                height: (windowWidth * 9) / 100,
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
                width: (windowWidth * 6) / 100,
                height: (windowWidth * 6) / 100,
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
        borderRadius: (windowWidth * 2) / 100,
        backgroundColor: Colors.Theme,
        paddingVertical: (windowWidth * 4) / 100,
        marginTop: (windowWidth * 6) / 100,
        shadowColor: "#000",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 3,
      }}
    >
      <Text
        style={{
          color: Colors.White,
          fontFamily: Font.Medium,
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
        borderRadius: (windowWidth * 2) / 100,
        backgroundColor: props.bgcolor,
        paddingVertical: (windowWidth * 2.8) / 100,
        marginTop: (windowWidth * 4) / 100,
      }}
    >
      <Text
        style={{
          color: Colors.White,
          fontFamily: Font.Medium,
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
        borderRadius: (windowWidth * 2) / 100,
        backgroundColor: "#0068b3",
        paddingVertical: (windowWidth * 3) / 100,
        alignItems: "center",
        marginTop: (windowWidth * 6) / 100,
        shadowColor: "#000",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 3,
      }}
    >
      <Text
        style={{
          color: Colors.White,
          fontFamily: Font.Medium,
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
          marginTop: (windowWidth * 1.5) / 100,
          marginBottom: (windowWidth * 2) / 100,
          alignSelf: "center",
          backgroundColor: Colors.White,
          padding: (windowWidth * 1) / 100,
          borderRadius: (windowWidth * 1) / 100,
          alignItems: "center",
        }}
      >
        {/* search box */}

        <TextInput
          placeholder={props.placeholdervalue}
          DarkGrey={Colors.gray2}
          style={{
            color: Colors.gray1,
            fontSize: Font.slightlymoresmallnormal,
            width: "90%",

            paddingVertical: (windowWidth * 2) / 100,

            textAlign: config.textalign,
          }}
        />

        <View style={{ alignSelf: "center" }}>
          <Image
            source={Icons.searchiocn2}
            style={{
              width: (windowWidth * 8) / 100,
              height: (windowWidth * 8) / 100,
              // (windowWidth * 5.5) / 100,
              borderRadius: (windowWidth * 1.5) / 100,
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
        marginBottom: (windowWidth * 3) / 100,
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
        width: (windowWidth * 18) / 100,
        height: (windowWidth * 25) / 100,
        borderRadius: (windowWidth * 1) / 100,
        borderColor: Colors.Theme,
        justifyContent: "center",
        //   backgroundColor: '#d1e9f6',
      }}
    >
      <Image
        resizeMode="contain"
        source={Icons.p3}
        style={{
          alignSelf: "center",
          width: (windowWidth * 12) / 100,
          height: (windowWidth * 12) / 100,
          borderColor: Colors.Theme,
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
        paddingVertical: (windowWidth * 1.3) / 100,
        flexDirection: "row",
        // alignItems: 'center',
        justifyContent: "space-between",
      }}
    >
      <View style={{ flex: 0.2, alignSelf: "center" }}>
        <Image
          style={{
            width: (windowWidth * 5) / 100,
            height: (windowWidth * 5) / 100,
            borderRadius: (windowWidth * 0.4) / 100,
            marginRight: (windowWidth * 2) / 100,
            marginLeft: (windowWidth * 3) / 100,
            resizeMode: "contain",
            alignSelf: "flex-start",
            flex: 0.1,
          }}
          source={Icons.remembertick}
        />
      </View>
      <Text
        style={{
          // width: '90%',
          // alignSelf: 'flex-end',
          alignSelf: "center",
          fontSize: Font.ssregulartext_size,
          fontFamily: Font.Light,
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
          fontFamily: Font.Light,
          // backgroundColor: 'red',
          // color: Colors.gray3,
          // color: 'red',
          flex: 0.86,
          textAlign: "right",
          marginRight: (windowWidth * 3) / 100,
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
            width: (windowWidth * 5) / 100,
            height: (windowWidth * 5) / 100,
            borderRadius: (windowWidth * 0.4) / 100,
            marginRight: (windowWidth * 2) / 100,
            marginLeft: (windowWidth * 3) / 100,
            resizeMode: "contain",
            alignSelf: "flex-start",
            flex: 0.1,
          }}
          source={Icons.rememberdeactivate}
        />
      </View>
      <Text
        style={{
          // width: '90%',
          // alignSelf: 'flex-end',
          alignSelf: "center",
          fontSize: Font.ssregulartext_size,
          fontFamily: Font.Light,
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
          fontFamily: Font.Light,
          // backgroundColor: 'red',
          // color: Colors.gray3,
          // color: 'red',
          flex: 0.86,
          textAlign: "right",
          marginRight: (windowWidth * 3) / 100,
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
        backgroundColor: Colors.Theme,
        paddingVertical: (windowWidth * 0.8) / 100,
        flexDirection: "row",
        paddingHorizontal: (windowWidth * 1.5) / 100,
        // width: '30%',
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: (windowWidth * 1) / 100,
        marginRight: (windowWidth * 2) / 100,
      }}
    >
      <Text
        style={{
          color: Colors.White,
          fontSize: Font.textsize,
          fontFamily: Font.Light,
          // paddingHorizontal: (windowWidth * 2) / 100,
        }}
      >
        {props.title}
      </Text>
      <Image
        source={Icons.cross2}
        style={{
          alignSelf: "center",
          width: (windowWidth * 2) / 100,
          height: (windowWidth * 2) / 100,
          marginLeft: (windowWidth * 3) / 100,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerstyle: {
    backgroundColor: "#fff",
    paddingVertical: (windowWidth * 2) / 100,
    borderBottomWidth: 1,
    borderBottomColor: Colors.Border,
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
    paddingVertical: (windowWidth * 2) / 100,
  },
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
    fontFamily: Font.Regular,
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
    fontFamily: Font.Bold,
    // fontSize: Font.smalltextsize,
    fontFamily: Font.Bold,
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
    fontFamily: Font.ExtraBold,
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
    fontSize: Font.ssregulartext_size,
    fontFamily: Font.Light,
    // backgroundColor: 'red',
    // color: Colors.gray3,
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
    fontFamily: Font.Bold,
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
    borderRadius: (windowWidth * 1) / 100,
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
    fontFamily: Font.ExtraBold,
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
    fontFamily: Font.ExtraBold,
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
  marginTop: (windowWidth * 3) / 100,
  borderColor: Colors.bordercolor,
  borderWidth: (windowWidth * 0.3) / 100,
  borderRadius: (windowWidth * 2) / 100,
}}>
<View style={{width: '95%', alignSelf: 'center'}}>
  <TextInput
    style={{
      width: '100%',
      color: Colors.Black,
      fontSize: Font.placeholdersize,
      textAlign: config.textalign,
      paddingVertical: (windowWidth * 4) / 100,
      fontFamily: Font.Light,
    }}
    maxLength={50}
    placeholder={
      this.state.emailfocus != true
        ? Lang_chg.textinputemails[config.language]
        : null
    }
    DarkGrey={Colors.DarkGrey}
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
      backgroundColor: 'White',
      left: (windowWidth * 4) / 100,
      top: (-windowWidth * 2) / 100,
      paddingHorizontal: (windowWidth * 1) / 100,
    }}>
    <Text style={{color: '#0057A5'}}>
      {Lang_chg.textinputemails[config.language]}
    </Text>
  </View>
)}
</View> */
}
