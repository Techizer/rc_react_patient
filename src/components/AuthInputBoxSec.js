import React from "react";
import {
  // TextInput,
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator,
} from "react-native";
import {
  TextInput,
  HelperText,
  useTheme,
  MD2Colors,
  MD3Colors,
  List,
} from "react-native-paper";
// import OutlineInput from 'react-native-outline-input';
import Icon from "react-native-vector-icons/MaterialIcons";
// import { hp, wp } from "../utils/responsive";
// import { RF } from "../utils/responsive";
// import Fonts, { fonts, fontSizes } from "../utils/Fonts";
// import { Color } from "../utils";
// const { height, width } = Dimensions.get("window");
import {
  Colors,
  Icons,
  Font,
  windowHeight,
  config,
  windowWidth,
  Lang_chg,
  apifuntion,
  msgText,
  msgTitle,
  consolepro,
  msgProvider,
  localStorage,
} from "../Provider/utilslib/Utils";

const AuthInputBoxSec = ({
  lableText,
  lblTxtInfo,
  icon,
  iconName,
  iconPressAction,
  name,
  disableImg,
  address,
  mainContainer,
  inputLayout,
  imgView,
  imgStyle,
  inputFieldStyle,
  refs,
  inputRef,
  showCode,
  iconColor,
  isEditable,
  ...props
}) => {
  //console.log(props.onSubmitEditing)
  return (
    <>
      <View style={[styles.mainContainer, mainContainer]}>
        {/* {lableText ? (
          <Text
            style={{
              fontFamily: Font.fontregular,
              fontSize: 14,
              marginBottom: 5,
              marginTop: 15,
              color: Colors.textblack,
            }}
          >
            {lableText} {lblTxtInfo ? "(" + lblTxtInfo + ")" : ""}
          </Text>
        ) : null} */}
        <View
          style={[
            styles.inputLayout,
            {
              width: disableImg ? "100%" : "100%",
            },
            inputLayout,
          ]}
        >
          {/* {showCode ? (
            <Text
              style={{
                // position: 'absolute',
                // top: '50%',
                // left: 0,
                marginTop: 10,
                marginRight: 10,
                color: "black", //"#7C7C7C",
                fontFamily: Font.fontregular,
                fontSize: 14,
              }}
            >
              +0
            </Text>
          ) : null} */}
          <View
            style={{
              width: "100%",
              alignSelf: "center",
              // backgroundColor: 'red'
            }}
          >
            <TextInput //OutlineInput
              style={[
                styles.inputFieldStyle,
                inputFieldStyle,
                {
                  backgroundColor:
                    props.editable == false
                      ? Colors.tab_background_color
                      : "white",
                },
              ]}
              ref={(r) => {
                inputRef && inputRef(r);
              }}
              label={lableText}
              mode="outlined"
              outlineColor={Colors.Border}
              activeOutlineColor={Colors.placholderactive}
              autoCapitalize="none"
              {...props}
              value={props.value}
              // editable={(editable) ? editable : true}
              right={
                disableImg && (
                  <TextInput.Icon
                    name={iconName}
                    onPress={iconPressAction}
                    forceTextInputFocus={false}
                    color={Colors.DarkGrey}
                    style={{
                      marginTop: 12
                    }}
                  />
                )
              }
            />
          </View>
         
        </View>
      </View>
      
    </>
  );
};
// };
AuthInputBoxSec.defaultProps = { mainContainer: {} };

const styles = StyleSheet.create({
  textStyle: {
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    width: "90%",
    //paddingLeft: 10,
    //paddingRight: 10,
    // borderBottomWidth: 0.5,
    // borderBottomColor: "lightgrey",
    //paddingVertical: 5,
    justifyContent: "center",
    alignSelf: "center",
    // marginBottom: 10,
  },
  imgView: {
    width: "15%",
    alignItems: "center",
  },
  img: {
    height: 30,
    width: 30,
  },
  inputLayout: {
    width: "100%",
    // flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  inputFieldStyle: {
    flex: 1,
    width: "100%",
    height: 48,
    color: Colors.textblack,
    fontSize: Font.placeholdersize,
    textAlign: config.textalign,
    //height: (windowWidth * 12) / 100,
    fontFamily: Font.placeholderfontfamily,
    borderRadius: 80,
    padding: 0,
    margin: 0,
    includeFontPadding: false,
    backgroundColor: "white",
    lineHeight: 48,
    // borderColor: 'red', //Colors.placeholder_border
  },
  errorLayout: {
    backgroundColor: "red",
    marginVertical: 6,
    borderRadius: 8,
    padding: 5,
  },
  errorTxt: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
});
export default AuthInputBoxSec;
