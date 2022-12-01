import React from "react";
import {
  // TextInput,
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator,
  TouchableOpacity, Platform
} from "react-native";
import {
  TextInput,
  HelperText,
  useTheme,
  MD2Colors,
  MD3Colors,
  List,
} from 'react-native-paper';
import Icon from "react-native-vector-icons/MaterialIcons";
// import { hp, wp } from "../utils/responsive";
// import { RF } from "../utils/responsive";
// import Fonts, { fonts, fontSizes } from "../utils/Fonts";
// import { Color } from "../utils";
// const { height, width } = Dimensions.get("window");
import { Colors, Icons, Font, windowHeight, config, windowWidth, Lang_chg, apifuntion, msgText, msgTitle, consolepro, msgProvider, localStorage } from '../Provider/utilslib/Utils';

const DropDownboxSec = ({
  lableText,
  lblTxtInfo,
  icon,
  iconName,
  boxPressAction,
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
  isDisabled,
  ...props
}) => {
  //console.log(props.onSubmitEditing)
  return (
    <>
      <View style={[styles.mainContainer, mainContainer]}>
        <TouchableOpacity
          onPress={boxPressAction}
          disabled={isDisabled}
        >
          <View style={{
            width: '95%', alignSelf: 'center', justifyContent: 'center',
            justifyContent: 'center',
            textAlignVertical: 'center',
            height: 48, //(windowWidth * 12) / 100,
          }}>
            {
              (isDisabled) ? null :
                <Image
                  style={{
                    height: (windowWidth * 4) / 100,
                    width: (windowWidth * 4) / 100,
                    position: "absolute",
                    top: 15,
                    right: 5,
                  }}
                  source={Icons.downarrow} />
            }
            <Text style={styles.textBoxStyle}>{lableText}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};
// };
DropDownboxSec.defaultProps = { mainContainer: {} };

const styles = StyleSheet.create({
  textStyle: {
    backgroundColor: "gray",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: (windowWidth * 2) / 100,
    backgroundColor: Colors.tab_background_color, //Colors.optboxcolor,
    borderColor: Colors.field_border_color, //Colors.Border,
    borderWidth: windowWidth * 0.3 / 100,
    borderRadius: (windowWidth * 1) / 100
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
  textBoxStyle: {
    width: '100%',
    color: Colors.DarkGrey_color,
    fontSize: Font.placeholdersize,
    textAlign: config.textalign,
    justifyContent: 'center',
    // alignItems: 'center',
    textAlignVertical: 'center',
    // height: 48, //(windowWidth * 12) / 100,
    fontFamily: Font.headingfontfamily,
    borderRadius: (windowWidth * 1) / 100,
    // paddingTop: ((windowWidth * 12) / 100) / 2.5,
    paddingLeft: 4,
    // backgroundColor: 'red'
  },
  errorLayout: {
    backgroundColor: "red",
    marginVertical: 6,
    borderRadius: 5,
    padding: 5,
  },
  errorTxt: {
    color: "White",
    fontWeight: "bold",
    fontSize: 12,
  },
});
export default DropDownboxSec;
