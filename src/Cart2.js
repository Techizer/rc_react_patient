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
  windowWidth,
  Icons,
  Lang_chg,
} from './Provider/utilslib/Utils';
// import Footer from './src/Provider/Footer';
import Styles from './Styles';
import {
  AppHeader2,
} from './Allcomponents';
import Footer from './Footer';

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
           

            <View style={{backgroundColor:'#fff',marginTop:windowWidth*2/100,shadowOpacity: 0.3,
                        shadowColor:'#000',
                        shadowOffset:{width:1,height:1},
                        elevation:2,
                       
                        shadowRadius:2,}}>
              <View>
                {/* <View style={{width: '100%', alignSelf: 'center'}}> */}
                  <View
                    style={{alignItems:'center',
                      flexDirection: 'row',
                      paddingVertical:windowWidth*3/100,
                      width: '90%',
                      alignSelf: 'center',
                     
                      justifyContent: 'space-between',
                      // marginTop:windowWidth*2/100
                    
                    }}>
                    <View style={{flexDirection: 'row',width:"83%",alignItems:'center'}}>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize:windowWidth*3.9/100,
                          color:Colors.lightGrey
                        }}>Aisha A.
                     
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize:Font.cart2subtext,
                          color: Colors.Theme,
                          marginLeft:windowWidth*4/100
                         
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
                          source={Icons.cross}
                          style={{
                            resizeMode: 'contain',
                            backgroundColor: Colors.White,
                            width: (windowWidth * 4.5) / 100,
                            height: (windowWidth * 4.5) / 100,
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
                      
                      marginTop:windowWidth*1/100
                      // marginVertical: (windowWidth * 3) / 100,
                    
                    }}></View>
                  <View style={{width: '90%', alignSelf: 'center'}}>
                    <View>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: Font.cart2heading,
                          color: Colors.Theme,
                          paddingBottom: (windowWidth * 3.5) / 100,
                          paddingTop:windowWidth*2/100
                        }}>
                        Appointment
                      </Text>
                    </View>
                  
                          <View
                          style={{
                              backgroundColor: '#fff',
                              marginBottom: (windowWidth * 3.5) / 100,
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
                                      fontFamily: Font.Medium,
                                      color: Colors.Theme,
                                      fontSize:windowWidth*3.5/100,
                                    }}>
                                    Date
                                  </Text>
                                  <Text
                                    style={{
                                      fontFamily: Font.Medium,
                                      fontSize: Font.cart2subtext,
                                      color: Colors.DarkGrey,
                                      paddingTop: (windowWidth * 1) / 100,
                                    }}>SAT,26 MAR 2022
                                    
                                  </Text>

                                  <View
                                    style={{borderWidth:1,
                                    borderColor:Colors.Theme,
                                   
                                   marginTop:windowWidth*2/100,
                                     
                                     paddingVertical:windowWidth*1/100,
                                     width:'45%',
                                     justifyContent:'center',
                                      borderRadius: (windowWidth * 1) / 100,
                                    }}>
                                    <Text
                                      style={{
                                        fontFamily: Font.Medium,
                                        fontSize:windowWidth*3/100,
                                        color: Colors.Theme,
                                        textAlign:'center'
                                      }}>Task Base
                                    </Text>
                                  </View>
                                </View>

                                <View
                                  style={{
                                    width: '50%',
                                    marginRight: (windowWidth * 3) / 100,
                                  }}>
                                  <Text
                                    style={{
                                      fontFamily: Font.Medium,
                                      color: Colors.Theme,
                                      fontSize:windowWidth*3.5/100,
                                    }}>
                                    Time
                                  </Text>
                                  <Text
                                    style={{
                                      fontFamily: Font.Medium,
                                      fontSize: Font.cart2subtext,
                                      color: Colors.DarkGrey,
                                      paddingTop: (windowWidth * 1) / 100,
                                    }}>9:30 PM - 10:00 PM
                                    
                                  </Text>

                                  <View
                                    style={{
                                      width: '100%',
                                      flexDirection: 'row',
                                      paddingVertical: (windowWidth * 2) / 100,
                                      borderRadius: (windowWidth * 1) / 100,
                                      alignItems:'center',
                                      marginTop:windowWidth*1/100,
                                    }}>
                                    <Image
                                      source={Icons.clock}
                                      style={{tintColor:Colors.Theme,
                                        resizeMode: 'contain',
                                        width: (windowWidth * 4) / 100,
                                        height: (windowWidth * 4) / 100,
                                      }}></Image>

                                    <Text
                                      style={{
                                        color: Colors.Theme,
                                        fontFamily: Font.Regular,
                                        fontSize: (windowWidth * 3.3) / 100,
                                        marginLeft:windowWidth*1.5/100,
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
                
                    paddingVertical: (windowWidth * 3) / 100,
                  }}>
                  <View style={{width: '90%', alignSelf: 'center'}}>
                    <View>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: Font.cart2heading,
                          color: Colors.Theme,
                          paddingTop:windowWidth*1/100
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
                        marginTop:windowWidth*1/100,
                      }}>
                      <Text
                        style={{
                          fontFamily: Font.Regular,
                          fontSize:windowWidth*3.3/100,
                          color:'#000',
                        }}>
                       IV Cannula removal
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.Regular,
                          fontSize:windowWidth*3.3/100,
                          color:'#000',
                        }}>
                        120.0 SAR
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
                          fontFamily: Font.Regular,
                          fontSize:windowWidth*3.3/100,
                          color:'#000',
                        }}>
                        Distance Fare
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.Regular,
                          fontSize:windowWidth*3.3/100,
                          color:'#000',
                        }}>
                        5952.0 SAR
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
                          fontFamily: Font.Regular,
                          fontSize:windowWidth*3.3/100,
                          color:'#000',
                        }}>
                        VAT (10%)
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.Regular,
                          fontSize:windowWidth*3.3/100,
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
                        marginTop:windowWidth*2/100,
                        // paddingVertical: (windowWidth * 3) / 100,
                        // borderTopWidth: (windowWidth * 0.3) / 100,
                        // borderColor: Colors.bordercolor,
                        
                      }}>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize:windowWidth*3.5/100,
                          color: Colors.Theme,
                        }}>
                        Total
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize:windowWidth*3.5/100,
                          color: Colors.Theme,
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
                  borderRadius: (windowWidth * 2) / 100,
                  backgroundColor: Colors.Theme,
                  paddingVertical: (windowWidth * 4) / 100,
                  position: 'absolute',
                  bottom: (windowWidth * 25) / 100,
                }}>
                <Text
                  style={{
                    color: Colors.White,
                    fontFamily: Font.Medium,
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
                backgroundColor: 'White',
                borderRadius: (windowWidth * 4) / 100,
                position: 'absolute',
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
                paddingBottom: (windowWidth * 5) / 100,
                alignSelf: 'center',
              }}>
              <Image
                style={{
                  width: (windowWidth * 15) / 100,
                  height: (windowWidth * 15) / 100,
                  alignSelf: 'center',
                  marginTop: (windowWidth * -5) / 100,
                }}
                source={Icons.greentick}></Image>
              <Text
                style={{
                  fontSize: (windowWidth * 8) / 100,
                  marginTop: (windowWidth * 5) / 100,
                  fontFamily: Font.Medium,
                  textAlign: config.textalign,
                }}>
                {Lang_chg.thank[config.language]}
              </Text>
              <Text
                style={{
                  fontSize: (windowWidth * 3) / 100,
                  marginTop: (windowWidth * 5) / 100,
                  fontFamily: Font.Medium,
                  textAlign: config.textalign,
                }}>
                {Lang_chg.success[config.language]}
              </Text>

              <Text
                style={{
                  fontSize: (windowWidth * 3) / 100,
                  marginTop: (windowWidth * 1) / 100,
                  fontFamily: Font.Medium,
                  textAlign: config.textalign,
                  color: Colors.lightGrey,
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
                  borderColor: Colors.Blue,
                  borderWidth: 1,
                  padding: (windowWidth * 2) / 100,
                  paddingHorizontal: (windowWidth * 3) / 100,
                  marginTop: (windowWidth * 5) / 100,
                  borderRadius: (windowWidth * 2) / 100,
                }}>
                <Text
                  style={{
                    fontSize: (windowWidth * 3) / 100,
                    alignSelf: 'center',
                    fontFamily: Font.SemiBold,
                    textAlign: config.textalign,
                    alignSelf: 'center',
                    color: Colors.Theme,
                  }}>
                  Go to appointment
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

    
      </View>
    );
  }
}
