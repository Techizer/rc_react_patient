import React, {Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {
  Colors,
  Font,
  config,
  mobileW,
  localimag,
  Lang_chg,
} from './Provider/utilslib/Utils';
// import Footer from './src/Provider/Footer';
import Styles from './Styles';
import {
  AppHeader2,
} from './Allcomponents';
import Footer from './Footer';
import HideWithKeyboard from 'react-native-hide-with-keyboard';

const Appointmentdata = [
  {
    id: 1,
    designation: 'DOCTOR',
    personname: 'Dr Sunidhi Sharma',
    description: 'Gastroenterologiest',
    patientname: 'Sanjay Biswas',
    bookeddate: '25 DEC 2021',

    orderid: 'ORD876543',
    appointmentdate: 'FRI, 25 DEC 2021',
    visit: 'Task Base',

    status: 'PENDING',
    time: '9:30 PM -10:00 PM',
    timetakes: '30 mins',

    price: '500',
  },
];

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

export default class Cart2 extends Component {
  constructor(props) {
    super(props);
    {
      this.state = {
        modalvisible: false,
      };
    }
  }
  render() {
    return (
      <View style={Styles.container1}>
     
          <View style={Styles.container3}>
            {/* <Text>Home</Text> */}
            <AppHeader2
              navigation={this.props.navigation}
              title={Lang_chg.CartItem[config.language]}
            />
               <ScrollView
          style={Styles.container2}
          contentContainerStyle={{flexGrow: 1}}
         
          showsVerticalScrollIndicator={false}>
           

            <View style={{backgroundColor:'#fff',marginTop:mobileW*2/100,shadowOpacity: 0.3,
                        shadowColor:'#000',
                        shadowOffset:{width:1,height:1},
                        elevation:2,
                       
                        shadowRadius:2,}}>
              <View>
                {/* <View style={{width: '100%', alignSelf: 'center'}}> */}
                  <View
                    style={{alignItems:'center',
                      flexDirection: 'row',
                      paddingVertical:mobileW*3/100,
                      width: '90%',
                      alignSelf: 'center',
                     
                      justifyContent: 'space-between',
                      // marginTop:mobileW*2/100
                    
                    }}>
                    <View style={{flexDirection: 'row',width:"83%",alignItems:'center'}}>
                      <Text
                        style={{
                          fontFamily: Font.fontmedium,
                          fontSize:mobileW*3.9/100,
                          color:Colors.gray4
                        }}>Aisha A.
                     
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.fontmedium,
                          fontSize:Font.cart2subtext,
                          color: Colors.theme_color,
                          marginLeft:mobileW*4/100
                         
                        }}>
                        Nurse
                      </Text>
                    </View>

                    <View style={{}}>
                      <View
                        style={{
                          alignSelf: 'center',
                          alignSelf: 'flex-end',
                          
                        }}>
                        <Image
                          source={localimag.cross}
                          style={{
                            resizeMode: 'contain',
                            backgroundColor: Colors.white_color,
                            width: (mobileW * 4.5) / 100,
                            height: (mobileW * 4.5) / 100,
                            alignSelf: 'center',
                          }}></Image>
                      </View>
                    </View>
                  </View>

                  {/* border */}
                  <View
                    style={{
                      borderTopWidth: 0.5,
                      borderColor: Colors.gainsboro,
                      
                      marginTop:mobileW*1/100
                      // marginVertical: (mobileW * 3) / 100,
                    
                    }}></View>
                  <View style={{width: '90%', alignSelf: 'center'}}>
                    <View>
                      <Text
                        style={{
                          fontFamily: Font.fontmedium,
                          fontSize: Font.cart2heading,
                          color: Colors.theme_color,
                          paddingBottom: (mobileW * 3.5) / 100,
                          paddingTop:mobileW*2/100
                        }}>
                        Appointment
                      </Text>
                    </View>
                  
                          <View
                          style={{
                              backgroundColor: '#fff',
                              marginBottom: (mobileW * 3.5) / 100,
                            }}>
                            <View style={{}}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                }}>
                                {/* image and store name */}

                                <View
                                  style={{
                                    width: '50%',
                                  }}>
                                  <Text
                                    style={{
                                      fontFamily: Font.fontmedium,
                                      color: Colors.theme_color,
                                      fontSize:mobileW*3.5/100,
                                    }}>
                                    Date
                                  </Text>
                                  <Text
                                    style={{
                                      fontFamily: Font.fontmedium,
                                      fontSize: Font.cart2subtext,
                                      color: Colors.darkgraytextheading,
                                      paddingTop: (mobileW * 1) / 100,
                                    }}>SAT,26 MAR 2022
                                    
                                  </Text>

                                  <View
                                    style={{borderWidth:1,
                                    borderColor:Colors.theme_color,
                                   
                                   marginTop:mobileW*2/100,
                                     
                                     paddingVertical:mobileW*1/100,
                                     width:'45%',
                                     justifyContent:'center',
                                      borderRadius: (mobileW * 1) / 100,
                                    }}>
                                    <Text
                                      style={{
                                        fontFamily: Font.fontmedium,
                                        fontSize:mobileW*3/100,
                                        color: Colors.theme_color,
                                        textAlign:'center'
                                      }}>Task Base
                                    </Text>
                                  </View>
                                </View>

                                <View
                                  style={{
                                    width: '50%',
                                    marginRight: (mobileW * 3) / 100,
                                  }}>
                                  <Text
                                    style={{
                                      fontFamily: Font.fontmedium,
                                      color: Colors.theme_color,
                                      fontSize:mobileW*3.5/100,
                                    }}>
                                    Time
                                  </Text>
                                  <Text
                                    style={{
                                      fontFamily: Font.fontmedium,
                                      fontSize: Font.cart2subtext,
                                      color: Colors.darkgraytextheading,
                                      paddingTop: (mobileW * 1) / 100,
                                    }}>9:30 PM - 10:00 PM
                                    
                                  </Text>

                                  <View
                                    style={{
                                      width: '100%',
                                      flexDirection: 'row',
                                      paddingVertical: (mobileW * 2) / 100,
                                      borderRadius: (mobileW * 1) / 100,
                                      alignItems:'center',
                                      marginTop:mobileW*1/100,
                                    }}>
                                    <Image
                                      source={localimag.clock}
                                      style={{tintColor:Colors.theme_color,
                                        resizeMode: 'contain',
                                        width: (mobileW * 4) / 100,
                                        height: (mobileW * 4) / 100,
                                      }}></Image>

                                    <Text
                                      style={{
                                        color: Colors.theme_color,
                                        fontFamily: Font.fontregular,
                                        fontSize: (mobileW * 3.3) / 100,
                                        marginLeft:mobileW*1.5/100,
                                      }}>30 mins
                                     
                                    
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                          </View>
                     
                  </View>
           

                <View
                  style={{
                   backgroundColor:'#F1F2F4',
                
                    paddingVertical: (mobileW * 3) / 100,
                  }}>
                  <View style={{width: '90%', alignSelf: 'center'}}>
                    <View>
                      <Text
                        style={{
                          fontFamily: Font.fontmedium,
                          fontSize: Font.cart2heading,
                          color: Colors.theme_color,
                          paddingTop:mobileW*1/100
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
                        marginTop:mobileW*1/100,
                      }}>
                      <Text
                        style={{
                          fontFamily: Font.fontregular,
                          fontSize:mobileW*3.3/100,
                          color:'#000',
                        }}>
                       IV Cannula removal
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.fontregular,
                          fontSize:mobileW*3.3/100,
                          color:'#000',
                        }}>
                        120.0 SAR
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
                          fontSize:mobileW*3.3/100,
                          color:'#000',
                        }}>
                        Distance Fare
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.fontregular,
                          fontSize:mobileW*3.3/100,
                          color:'#000',
                        }}>
                        5952.0 SAR
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
                          fontSize:mobileW*3.3/100,
                          color:'#000',
                        }}>
                        VAT (10%)
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.fontregular,
                          fontSize:mobileW*3.3/100,
                          color:'#000',
                        }}>
                        0.0 SAR
                      </Text>
                    </View>
                    <View
                      style={{
                        width:'100%',
                        
                        borderWidth:0.5,
                        borderColor: Colors.bordercolor,
                        
                      }}></View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop:mobileW*2/100,
                        // paddingVertical: (mobileW * 3) / 100,
                        // borderTopWidth: (mobileW * 0.3) / 100,
                        // borderColor: Colors.bordercolor,
                        
                      }}>
                      <Text
                        style={{
                          fontFamily: Font.fontmedium,
                          fontSize:mobileW*3.5/100,
                          color: Colors.theme_color,
                        }}>
                        Total
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.fontmedium,
                          fontSize:mobileW*3.5/100,
                          color: Colors.theme_color,
                        }}>
                       6070.0 SAR
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

            
            </View>
            <TouchableOpacity
                onPress={() => {
                  this.setState({modalvisible: true});
                }}
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  borderRadius: (mobileW * 2) / 100,
                  backgroundColor: Colors.buttoncolorblue,
                  paddingVertical: (mobileW * 4) / 100,
                  position: 'absolute',
                  bottom: (mobileW * 25) / 100,
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
              </TouchableOpacity>
            </ScrollView>
          </View>
     

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalvisible}
          onRequestClose={() => {}}>
          <View
            style={{
              flex: 1,
              alignSelf: 'center',
              justifyContent: 'center',
              backgroundColor: '#00000080',
              width: '100%',
            }}>
            <View
              style={{
                width: '100%',
                backgroundColor: 'white',
                borderRadius: (mobileW * 4) / 100,
                position: 'absolute',
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
                paddingBottom: (mobileW * 5) / 100,
                alignSelf: 'center',
              }}>
              <Image
                style={{
                  width: (mobileW * 15) / 100,
                  height: (mobileW * 15) / 100,
                  alignSelf: 'center',
                  marginTop: (mobileW * -5) / 100,
                }}
                source={localimag.greentick}></Image>
              <Text
                style={{
                  fontSize: (mobileW * 8) / 100,
                  marginTop: (mobileW * 5) / 100,
                  fontFamily: Font.fontmedium,
                  textAlign: config.textalign,
                }}>
                {Lang_chg.thank[config.language]}
              </Text>
              <Text
                style={{
                  fontSize: (mobileW * 3) / 100,
                  marginTop: (mobileW * 5) / 100,
                  fontFamily: Font.fontmedium,
                  textAlign: config.textalign,
                }}>
                {Lang_chg.success[config.language]}
              </Text>

              <Text
                style={{
                  fontSize: (mobileW * 3) / 100,
                  marginTop: (mobileW * 1) / 100,
                  fontFamily: Font.fontmedium,
                  textAlign: config.textalign,
                  color: Colors.textgray,
                }}>
                Your appointment has been booked Successfully.
              </Text>

              <TouchableOpacity
                onPress={() => {
                  this.setState({modalvisible:false})
                  this.props.navigation.navigate('Appointment');
                }}
                style={{
                  // width: '15%',
                  alignSelf: 'center',
                  borderColor: Colors.bordercolorblue,
                  borderWidth: 1,
                  padding: (mobileW * 2) / 100,
                  paddingHorizontal: (mobileW * 3) / 100,
                  marginTop: (mobileW * 5) / 100,
                  borderRadius: (mobileW * 2) / 100,
                }}>
                <Text
                  style={{
                    fontSize: (mobileW * 3) / 100,
                    alignSelf: 'center',
                    fontFamily: Font.fontsemibold,
                    textAlign: config.textalign,
                    alignSelf: 'center',
                    color: Colors.terms_text_color_blue,
                  }}>
                  Go to appointment
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <HideWithKeyboard>
          <Footer
            activepage="Cart"
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
              width:25,
              height:25,
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
