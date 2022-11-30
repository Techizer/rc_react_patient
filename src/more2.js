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
  windowHeight,
  Mapprovider,
  msgProvider,
  msgText,
  config,
  windowWidth,
  localStorage,
  Icons,
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
    img: Icons.Nurse1,
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
                paddingVertical: (windowWidth * 3) / 100,
              }}></View>


            <View style={{ flex: 1 }}>

              <View>
                <View>
                  <View style={{ width: '90%', alignSelf: 'center' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: Colors.DarkGrey }}>
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
                          borderLeftWidth: (windowWidth * 0.3) / 100,
                          borderRightWidth: (windowWidth * 0.3) / 100,
                          borderColor: Colors.gainsboro,
                        }}>
                        <Text style={{ color: Colors.DarkGrey }}>
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
                            source={Icons.cross}
                            style={{
                              tintColor: '#fff',
                              width: (windowWidth * 3.3) / 100,
                              height: (windowWidth * 3.3) / 100,
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
                          color: Colors.Theme,
                        }}>
                        Appointment
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingVertical: (windowWidth * 3) / 100,
                        // borderBottomWidth: (windowWidth * 0.3) / 100,
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
                        paddingVertical: (windowWidth * 2) / 100,
                        // borderBottomWidth: (windowWidth * 0.3) / 100,
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
                        paddingVertical: (windowWidth * 2) / 100,
                        // borderBottomWidth: (windowWidth * 0.3) / 100,
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
                          color: Colors.Theme,
                          // borderTopWidth: (windowWidth * 0.3) / 100,
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
                        color: Colors.Theme,
                      }}>
                      Payment
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingVertical: (windowWidth * 3) / 100,
                      borderBottomWidth: (windowWidth * 0.3) / 100,
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
                      paddingVertical: (windowWidth * 2) / 100,
                      // borderBottomWidth: (windowWidth * 0.3) / 100,
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
                      paddingVertical: (windowWidth * 2) / 100,
                      // borderBottomWidth: (windowWidth * 0.3) / 100,
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
                      paddingVertical: (windowWidth * 3) / 100,
                      borderBottomWidth: (windowWidth * 0.3) / 100,
                      borderColor: Colors.bordercolor,
                    }}>
                    <Text
                      style={{
                        fontFamily: Font.fontsemibold,
                        fontSize: Font.headingfont,
                        color: Colors.Theme,
                      }}>
                      Total
                    </Text>
                    <Text
                      style={{
                        fontFamily: Font.fontsemibold,
                        fontSize: Font.headingfont,
                        color: Colors.Theme,
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
                  borderRadius: (windowWidth * 2) / 100,
                  backgroundColor: Colors.Theme,
                  paddingVertical: (windowWidth * 4) / 100,
                  position: 'absolute',
                  bottom: (windowWidth * 20) / 100,
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




        {/* <HideWithKeyboard>
          <Footer
            activepage="More"
            usertype={1}
            footerpage={[
              {
                name: 'Home',
                countshow: false,
                image: Icons.Home,
                activeimage: Icons.Home,
              },
              {
                name: 'Appointment',
                countshow: false,
                image: Icons.Appointment,
                activeimage: Icons.Appointment,
              },
              {
                name: 'Cart',
                countshow: false,
                image: Icons.Cart,
                activeimage: Icons.Cart,
              },
              {
                name: 'More',
                countshow: false,
                image: Icons.More,
                activeimage: Icons.More,
              },
            ]}
            navigation={this.props.navigation}
            imagestyle1={{
              width: (windowWidth * 4.7) / 100,
              height: (windowWidth * 4.7) / 100,
              paddingBottom: (windowWidth * 5.4) / 100,
              backgroundColor: 'white',
              countcolor: 'red',
              countbackground: 'red',
            }}
          />
        </HideWithKeyboard> */}
      </View>
    );
  }
}
