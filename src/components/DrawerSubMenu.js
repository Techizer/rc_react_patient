import React, { useEffect } from "react";
import { StyleSheet, Text, Image, TouchableOpacity, View } from "react-native";
// import Spinner from "react-native-spinkit";
// import { Colors } from "react-native/Libraries/NewAppScreen";
// import { color } from "react-native-reanimated";
// import { Color, Fonts } from "../utils";
// import { RF } from "../utils/responsive";
import { Colors, Icons, Font, windowHeight, config, windowWidth, Lang_chg, apifuntion, msgText, msgTitle, consolepro, msgProvider, localStorage } from '../Provider/utilslib/Utils';
const DrawerSubMenu = ({
  menuTitle,
  menuSubtitle,
  customStyles,
  onPress,
  iconImage,
  onLoading,
  isSingle,
  isBorderBottom,
}) => {
  return (
    <>
      {
        (menuSubtitle == undefined) ?
          <>
            <TouchableOpacity
              onPress={onPress}
              style={{
                // backgroundColor:'red',
                flexDirection: 'row',
                paddingTop: (windowWidth * 1) / 100,
                alignItems: 'center',
              }}>
              <View style={{ width: '15%' }}>
                <Image
                  style={styles.drawercardicon}
                  source={iconImage}></Image>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  width: '85%',
                  flexDirection: 'row',
                  marginLeft: windowWidth * 1 / 100,
                  borderBottomWidth: (isBorderBottom) ? 1 : 0,
                  borderColor: Colors.drawerblue,
                  paddingVertical: (windowWidth * 4) / 100,
                  justifyContent: 'space-between',
                }}>
                <View style={{ width: '83%', }} >
                  <Text
                    style={{
                      color: Colors.White,
                      fontFamily: Font.fontmedium,
                      fontSize: Font.headingfont_booking,
                      textAlign: config.textRotate,
                    }}>
                    {menuTitle}
                  </Text>
                </View>
                <View style={{ width: '12%', alignSelf: 'center' }}>
                  <Image
                    style={{
                      tintColor: Colors.arrowcolor,
                      alignSelf: 'center',
                      resizeMode: 'contain',
                      width: (windowWidth * 3.5) / 100,
                      height: (windowWidth * 3.5) / 100,
                    }}
                    source={config.textalign == 'right' ? Icons.arabic_next : Icons.rightarrow}></Image>
                </View>
              </View>
            </TouchableOpacity>
          </> :
          <>
            <TouchableOpacity
              onPress={onPress}
              style={{
                flexDirection: 'row',
                paddingTop: (windowWidth * 4) / 100,
              }}>
              <View style={{ width: '15%' }}>
                <Image
                  style={Styles.drawercardicon}
                  source={iconImage}></Image>
              </View>
              <View
                style={{
                  width: '85%',
                  flexDirection: 'row',
                  marginLeft: windowWidth * 1 / 100,
                  justifyContent: 'space-between',
                  borderBottomWidth: (isBorderBottom) ? 1 : 0,
                  borderColor: Colors.drawerblue,
                }}>
                <View >
                  <Text
                    style={{
                      color: Colors.White,
                      fontFamily: Font.fontmedium,
                      fontSize: Font.headingfont_booking,
                      textAlign: config.textRotate,
                    }}>
                    {menuTitle}
                  </Text>
                  <Text
                    style={{
                      color: Colors.gainsboro,
                      fontFamily: Font.fontregular,
                      fontSize: (windowWidth * 2.9) / 100, //</View>Font.textsize,
                      textAlign: config.textRotate,
                      marginVertical: (windowWidth * 1) / 100,
                      marginBottom: (windowWidth * 4) / 100,
                    }}>
                    {menuSubtitle}
                  </Text>
                </View>
                <View style={{ width: '12%', alignSelf: 'center' }}>
                  <Image
                    style={{
                      tintColor: Colors.arrowcolor,
                      alignSelf: 'center',
                      resizeMode: 'contain',
                      width: (windowWidth * 3.5) / 100,
                      height: (windowWidth * 3.5) / 100,
                      marginBottom: (windowWidth * 2) / 100,
                    }}
                    source={config.textalign == 'right' ? Icons.arabic_next : Icons.rightarrow}></Image>
                </View>
              </View>
            </TouchableOpacity>
          </>
      }




    </>
  );
};
DrawerSubMenu.defaultProps = { customStyles: {} };

const styles = StyleSheet.create({
  mainContainer: {
    width: '90%',
    alignSelf: 'center',
    borderRadius: (windowWidth * 2) / 100,
    backgroundColor: Colors.Theme,
    paddingVertical: (windowWidth * 4) / 100,
    marginTop: (windowWidth * 8) / 100,
  },
  mainContainer1: {
    width: '90%',
    alignSelf: 'center',
    borderColor: Colors.Blue,
    borderWidth: 2,
    borderRadius: (windowWidth * 2) / 100,
    backgroundColor: Colors.buttoncolorlight,
    paddingVertical: (windowWidth * 3) / 100,
    marginTop: (windowWidth * 4) / 100,
    marginBottom: (windowWidth * 4) / 100,
  },
  buttonText: {
    color: Colors.White,
    fontFamily: Font.fontmedium,
    fontSize: Font.buttontextsize,
    textAlign: config.textalign,
    alignSelf: 'center',
  },
  buttonText1: {
    color: Colors.Blue,
    fontFamily: Font.fontmedium,
    fontSize: Font.buttontextsize,
    textAlign: config.textalign,
    alignSelf: 'center',
  },
  img: {
    // width: 25,
    // height: 25,
    marginRight: 10,
  },
  drawercardicon: {
    //  alignSelf: 'center',
    resizeMode: 'contain',
    width: (windowWidth * 6.5) / 100,
    height: (windowWidth * 6.5) / 100,
    marginTop: (windowWidth * 1) / 100,
    alignSelf: 'center',
    // marginHorizontal: (windowWidth * 15) / 100, 
  },
});

export default DrawerSubMenu;
