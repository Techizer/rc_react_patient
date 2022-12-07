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
  onChangeText,
  value,
  ...props
}) => {
  //console.log(props.onSubmitEditing)
  return (
    <>
      <View style={[styles.mainContainer, mainContainer]}>

        <View
          style={[
            styles.inputLayout,
            {
              width: disableImg ? "100%" : "100%",
            },
            inputLayout,
          ]}
        >

          <View
            style={{
              width: "100%",
              alignSelf: "center",
            }}
          >
            {/* <TextInput
              style={[
                styles.inputFieldStyle,
                inputFieldStyle,
                {
                  backgroundColor:
                    props.editable == false
                      ? Colors.tab_background_color
                      : "White",
                },
              ]}
              ref={inputRef}
              label={lableText}
              mode='outlined'
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
            /> */}

            <TextInput
              style={[styles.inputFieldStyle,
              {
                backgroundColor: props.editable ? Colors.White : Colors.backgroundcolor
              },
              inputFieldStyle
              ]}
              ref={inputRef}
              label={lableText}
              mode='outlined'
              outlineColor={Colors.Border}
              activeOutlineColor={Colors.Theme}
              autoCapitalize="none"
              onChangeText={onChangeText}
              value={value}
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
              {...props}
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
    height: 50,
  },
  inputFieldStyle: {
    height: '100%',
    width: "100%",
    height: 48,
    color: Colors.Black,
    fontSize: Font.medium,
    textAlign: config.textalign,
    fontFamily: Font.Regular,
    includeFontPadding: false,
    lineHeight: 48,
  },
  errorLayout: {
    backgroundColor: "red",
    marginVertical: 6,
    borderRadius: 8,
    padding: 5,
  },
  errorTxt: {
    color: "White",
    fontWeight: "bold",
    fontSize: 12,
  },
});
export default AuthInputBoxSec;
