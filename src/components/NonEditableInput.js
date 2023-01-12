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
import { s } from "react-native-size-matters";

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

const NonEditableInput = ({
  lableText,
  mainContainer,
  inputLayout,
  inputFieldStyle,
  inputRef,
  value,
  data,
  title,
  ...props
}) => {
  return (
    <>
      <View style={[styles.mainContainer]}>

        <View style={{
          width: '35%',
          justifyContent:'center',
          paddingHorizontal:s(13)
        }}>
          <Text style={styles.Title}>{title}</Text>
        </View>

        <View style={{
          width: '65%',
          justifyContent:'center',
          backgroundColor:Colors.gainsboro,
          paddingLeft: s(12),
          borderTopRightRadius:4,
          borderBottomRightRadius:4
        }}>
          <Text style={styles.Title}>{data}</Text>
        </View>

      </View>

    </>
  );
};
// };
NonEditableInput.defaultProps = { mainContainer: {} };

const styles = StyleSheet.create({
  textStyle: {
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    width: "100%",
    flexDirection: 'row',
    justifyContent: "center",
    alignSelf: "center",
    height: 43,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.Border,
    marginBottom: 7,
  },
  Title: {
    color: Colors.dullGrey,
    fontSize: Font.medium,
    alignSelf:'flex-start',
    textAlign:'left',
    fontFamily: Font.Regular,
    includeFontPadding: false,
  },
  Desc: {
    color: Colors.DarkGrey,
    fontSize: Font.medium,
    textAlign: config.textalign,
    fontFamily: Font.Regular,
    includeFontPadding: false,
  },
});
export default NonEditableInput;
