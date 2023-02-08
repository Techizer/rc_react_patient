import React from "react";
import {
  // TextInput,
  View,
  Image,
  StyleSheet,
} from "react-native";
import {
  TextInput,
} from "react-native-paper";

import {
  Colors,
  Icons,
  Font,
  windowHeight,
  config,

} from "../Provider/Utils/Utils";

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
  numberOfLines,
  multiline,
  blurOnSubmit,
  onSubmitEditing,
  onFocus,
  elementPosition=()=>{},
  ...props
}) => {

  let position = null

  return (
    <>
      <View
        onLayout={event => {
          position = event.nativeEvent.layout
          // console.log('event.nativeEvent.layout:', event.nativeEvent.layout);
        }}
        style={[styles.mainContainer, mainContainer]}>

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
            }} >

            <TextInput
              numberOfLines={numberOfLines}
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
              onFocus={() => {
                elementPosition(position)
              }}
              blurOnSubmit={blurOnSubmit}
              onSubmitEditing={onSubmitEditing}
              // maxLength={26}
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
    justifyContent: "center",
    alignSelf: "center",
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
