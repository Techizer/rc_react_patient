import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

import {
  Colors,
  Font,
  mobileH,
  Mapprovider,
  msgProvider,
  msgText,
  config,
  mobileW,
  localStorage,
  localimag,
  consolepro,
  handleback,
  Lang_chg,
  apifuntion,
  msgTitle,
} from './Provider/utilslib/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Styles from './Styles';
import {
  AppHeader2,
  Appheading,
  Searchbarandicon,
  Appbtn,
} from './Allcomponents';
import Footer from './Footer';
import HideWithKeyboard from 'react-native-hide-with-keyboard';

const neworders = [
  {
    id: 1,
    img: localimag.Nurse1,
    rating: '4.5',
    personname: 'Sunidhi Sharma',
    description:
      'Growth in Hypothyroidism presented at Asia Pacific Conference in §Austala 1992 Attendod training program i Diabetio Nephropathy n USA.2000 Attended Lilli Update in Bangkok, 2002 Attended Diabetic Update in |Amsterdam, 2008 Attended Novo Update n Pars, 2004 Attended Uil Update in Hong Kong, 2005 Worked on inheritance patterns in Diabetesand HLA Mochanism n ypothyroidism,',
    designation: 'General Physician',
    Qualification: 'MBBS,MD ',
    Experience: '8',
    Booking: '365',
    location: ' Within10km',
    availability: 'MON, TUE,WED, FRI',
    bookingcount: '585 Bookings',
  },
];

export default class More extends Component {
  render() {
    return (
      <View style={Styles.container1}>
        <ScrollView
          style={Styles.container2}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}>
          <View style={Styles.container3}>
            {/* <Text>Home</Text> */}
            <AppHeader2
              navigation={this.props.navigation}
              title={Lang_chg.CartItem[config.language]}
            />
            <View
              style={{
                backgroundColor: Colors.backgroundcolor,
                paddingVertical: (mobileW * 3) / 100,
              }}></View>


            <View style={{ flex: 1 }}>

              <View>
                <View>
                  <View style={{ width: '90%', alignSelf: 'center' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: Colors.regulartextcolor }}>
                          Experience
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.fontsemibold,
                            fontSize: Font.regulartext_size,
                          }}>
                          YR
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          borderLeftWidth: (mobileW * 0.3) / 100,
                          borderRightWidth: (mobileW * 0.3) / 100,
                          borderColor: Colors.gainsboro,
                        }}>
                        <Text style={{ color: Colors.regulartextcolor }}>
                          Booking
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.fontsemibold,
                            fontSize: Font.regulartext_size,
                          }}></Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <View
                          style={{
                            backgroundColor: Colors.buttoncolorhgreen,
                            flexDirection: 'row',
                            alignSelf: 'flex-start',
                          }}>
                          <Image
                            source={localimag.cross}
                            style={{
                              tintColor: '#fff',
                              width: (mobileW * 3.3) / 100,
                              height: (mobileW * 3.3) / 100,
                              alignSelf: 'center',
                            }}></Image>
                        </View>
                      </View>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontFamily: Font.fontsemibold,
                          fontSize: Font.headingfont,
                          color: Colors.theme_color,
                        }}>
                        Appointment
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingVertical: (mobileW * 3) / 100,
                        // borderBottomWidth: (mobileW * 0.3) / 100,
                        borderColor: Colors.bordercolor,
                      }}>
                      <Text
                        style={{
                          fontFamily: Font.fontregular,
                          fontSize: Font.sregulartext_size,
                          color: Colors.gray4,
                        }}>
                        Blood Test
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.fontregular,
                          fontSize: Font.sregulartext_size,
                          color: Colors.gray4,
                        }}>
                        450 SAR
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingVertical: (mobileW * 2) / 100,
                        // borderBottomWidth: (mobileW * 0.3) / 100,
                        borderColor: Colors.bordercolor,
                      }}>
                      <Text
                        style={{
                          fontFamily: Font.fontregular,
                          fontSize: Font.sregulartext_size,
                          color: Colors.gray4,
                        }}>
                        Distance Fare
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.fontregular,
                          fontSize: Font.sregulartext_size,
                          color: Colors.gray4,
                        }}>
                        10 SAR
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingVertical: (mobileW * 2) / 100,
                        // borderBottomWidth: (mobileW * 0.3) / 100,
                        borderColor: Colors.bordercolor,
                      }}>
                      <Text
                        style={{
                          fontFamily: Font.fontregular,
                          fontSize: Font.sregulartext_size,
                          color: Colors.gray4,
                        }}>
                        VAT(10%)
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.fontregular,
                          fontSize: Font.sregulartext_size,
                          color: Colors.gray4,
                        }}>
                        10 SAR
                      </Text>
                    </View>

                    <View>
                      <Text
                        style={{
                          fontFamily: Font.fontsemibold,
                          fontSize: Font.headingfont,
                          color: Colors.theme_color,
                          // borderTopWidth: (mobileW * 0.3) / 100,
                          // borderColor: Colors.bordercolor,
                        }}>
                        Total
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{ width: '90%', alignSelf: 'center' }}>
                  <View>
                    <Text
                      style={{
                        fontFamily: Font.fontsemibold,
                        fontSize: Font.headingfont,
                        color: Colors.theme_color,
                      }}>
                      Payment
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingVertical: (mobileW * 3) / 100,
                      borderBottomWidth: (mobileW * 0.3) / 100,
                      borderColor: Colors.bordercolor,
                    }}>
                    <Text
                      style={{
                        fontFamily: Font.fontregular,
                        fontSize: Font.sregulartext_size,
                        color: Colors.gray4,
                      }}>
                      Blood Test
                    </Text>
                    <Text
                      style={{
                        fontFamily: Font.fontregular,
                        fontSize: Font.sregulartext_size,
                        color: Colors.gray4,
                      }}>
                      450 SAR
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingVertical: (mobileW * 2) / 100,
                      // borderBottomWidth: (mobileW * 0.3) / 100,
                      borderColor: Colors.bordercolor,
                    }}>
                    <Text
                      style={{
                        fontFamily: Font.fontregular,
                        fontSize: Font.sregulartext_size,
                        color: Colors.gray4,
                      }}>
                      Distance Fare
                    </Text>
                    <Text
                      style={{
                        fontFamily: Font.fontregular,
                        fontSize: Font.sregulartext_size,
                        color: Colors.gray4,
                      }}>
                      10 SAR
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingVertical: (mobileW * 2) / 100,
                      // borderBottomWidth: (mobileW * 0.3) / 100,
                      borderColor: Colors.bordercolor,
                    }}>
                    <Text
                      style={{
                        fontFamily: Font.fontregular,
                        fontSize: Font.sregulartext_size,
                        color: Colors.gray4,
                      }}>
                      VAT(10%)
                    </Text>
                    <Text
                      style={{
                        fontFamily: Font.fontregular,
                        fontSize: Font.sregulartext_size,
                        color: Colors.gray4,
                      }}>
                      10 SAR
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingVertical: (mobileW * 3) / 100,
                      borderBottomWidth: (mobileW * 0.3) / 100,
                      borderColor: Colors.bordercolor,
                    }}>
                    <Text
                      style={{
                        fontFamily: Font.fontsemibold,
                        fontSize: Font.headingfont,
                        color: Colors.theme_color,
                      }}>
                      Total
                    </Text>
                    <Text
                      style={{
                        fontFamily: Font.fontsemibold,
                        fontSize: Font.headingfont,
                        color: Colors.theme_color,
                      }}>
                      450 SAR
                    </Text>
                  </View>


                </View>
              </View>

              <TouchableOpacity
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  borderRadius: (mobileW * 2) / 100,
                  backgroundColor: Colors.buttoncolorblue,
                  paddingVertical: (mobileW * 4) / 100,
                  position: 'absolute',
                  bottom: (mobileW * 20) / 100,
                }}>
                <Text
                  style={{
                    color: Colors.textwhite,
                    fontFamily: Font.fontmedium,
                    fontSize: Font.buttontextsize,
                    alignSelf: 'flex-end',
                    textAlign: config.textalign,
                    alignSelf: 'center',
                  }}>
                  PROCEED TO PAYMENT
                </Text>
              </TouchableOpacity></View>


          </View>

        </ScrollView>




        <HideWithKeyboard>
          <Footer
            activepage="More"
            usertype={1}
            footerpage={[
              {
                name: 'Home',
                countshow: false,
                image: localimag.Home,
                activeimage: localimag.Home,
              },
              {
                name: 'Appointment',
                countshow: false,
                image: localimag.Appointment,
                activeimage: localimag.Appointment,
              },
              {
                name: 'Cart',
                countshow: false,
                image: localimag.Cart,
                activeimage: localimag.Cart,
              },
              {
                name: 'More',
                countshow: false,
                image: localimag.More,
                activeimage: localimag.More,
              },
            ]}
            navigation={this.props.navigation}
            imagestyle1={{
              width: (mobileW * 4.7) / 100,
              height: (mobileW * 4.7) / 100,
              paddingBottom: (mobileW * 5.4) / 100,
              backgroundColor: 'white',
              countcolor: 'red',
              countbackground: 'red',
            }}
          />
        </HideWithKeyboard>
      </View>
    );
  }
}
