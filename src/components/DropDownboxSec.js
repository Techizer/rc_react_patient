import React from "react";
import {
  // TextInput,
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity, Platform
} from "react-native";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import { rightArrow } from "../Icons/Index";
import { Colors, Icons, Font, windowHeight, windowWidth } from '../Provider/Utils/Utils';

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
          style={{
            width: '95%',
            alignSelf: 'center',
            height: 42,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.textBoxStyle}>{lableText}</Text>
          {
            (isDisabled) ? null :
              <SvgXml
                xml={rightArrow}
                height={vs(17.11)}
                width={s(8)}
                fillOpacity={1}
                style={{ transform: [{ rotate: "90deg" }],marginRight:5 }} />
          }
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
    width: '100%',
    alignSelf: 'center',
    marginTop: (windowWidth * 2) / 100,
    backgroundColor: Colors.tab_background_color, //Colors.optboxcolor,
    borderColor: Colors.Border,
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
    color: Colors.detailTitles,
    fontSize: Font.medium,
    justifyContent: 'center',
    fontFamily: Font.Regular,
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
