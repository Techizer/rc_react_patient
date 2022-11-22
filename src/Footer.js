import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Alert,
  FlatList,
  BackHandler,
} from "react-native";

import { mobileW, Colors, localStorage } from "./Provider/utilslib/Utils";
import DeviceInfo from "react-native-device-info";

// import { config } from './configProvider';
// import Icon1 from 'react-native-vector-icons/Entypo'
// import Loader from './Loader';
// import {firebaseprovider}  from './providers/FirebaseProvider';
// import { localStorage }  from './localStorageProvider';
//import { msgProvider, msgTitle, msgText } from './messageProvider';
const screenHeight = Math.round(Dimensions.get("window").height);
const screenWidth = Math.round(Dimensions.get("window").width);
export default class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "",
      modalVisible1: false,
      loading: false,
      isConnected: true,
      planModal: false,
      notch_check: DeviceInfo.hasNotch(),
    };
    BackHandler.removeEventListener("hardwareBackPress", () => {
      return true;
    });
  }
  componentDidMount() {
    // firebaseprovider.messagecountforfooter()
    console.log("moch", this.state.notch_check);
  }
  messagecountforfooter = async () => {
    console.log("getMyInboxAllDatagetinboxaccount");
    //   userdata= await localStorage.getItemObject('user_arr')
    //------------------------------ firbase code get user inbox ---------------
    if (userdata != null) {
      // alert("himanshu");
      var id = "u_" + userdata.user_id;
      if (inboxoffcheck > 0) {
        console.log("getMyInboxAllDatainboxoffcheck");
        var queryOffinbox = firebase
          .database()
          .ref("users/" + id + "/myInbox/")
          .child(userChatIdGlobal);
        //queryOff.off('child_added');
        queryOffinbox.off("child_changed");
      }

      var queryUpdatemyinbox = firebase
        .database()
        .ref("users/" + id + "/myInbox/");
      queryUpdatemyinbox.on("child_changed", (data) => {
        console.log("inboxkachildchange", data.toJSON());
        //  this.showUserInbox()
        firebaseprovider.firebaseUserGetInboxCount();
      });
    }
  };
  usercheckbtn = async (page) => {
    this.props.functionremove;
    const navigation = this.props.navigation;

    let userdata = await localStorage.getItemObject("user_arr");
    console.log("userdata", userdata);
    if (userdata != null) {
      if (this.props.usertype == 1) {
        navigation.navigate(page);
      } else {
        if (userdata.profile_complete == 0 && userdata.otp_verify == 1) {
          for (let i = 0; i < this.props.footerpage.length; i++) {
            if (page == this.props.footerpage[i].name) {
              navigation.navigate(page);
            }
          }
        } else {
          this.setState({ modalVisible1: true });
        }
      }
    } else {
      if (this.props.usertype == 1) {
        navigation.navigate(page);
      } else {
        this.setState({ modalVisible1: true });
      }
    }
  };
  Checkuser = () => {
    Alert.alert(
      "confirm",
      "please first login",
      [
        {
          text: msgTitle.cancel[0],
        },
        {
          text: msgTitle.ok[0],
          // onPress: () =>  this.btnPageLoginCall(),
          onPress: () => {
            this.props.navigation.navigate("Userlogin");
          },
        },
      ],
      { cancelable: false }
    );
  };

  render() {
    console.log("this.props.color", this.props.color + "/n");
    const navigation = this.props.navigation;

    let footerwidth = parseInt(100 / this.props.footerpage.length);
    return (
      <View
        style={[
          style1.footercontainer,
          this.state.notch_check == true
            ? {
                backgroundColor: this.props.imagestyle1.backgroundColor,
                paddingBottom: 15,
              }
            : {
                backgroundColor: this.props.imagestyle1.backgroundColor,
                paddingBottom: 2,
              },
        ]}
      >
        {/* <Loader loading={this.state.loading}/> */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible1}
          onRequestClose={() => {
            this.setState({ modalVisible1: false });
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "#00000040",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              this.setState({ modalVisible1: false });
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                width: (screenWidth * 100) / 100,
                alignContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  paddingHorizontal: 20,
                  paddingTop: 15,
                  alignContent: "center",
                  alignItems: "center",
                  elevation: 5,
                  borderRadius: 5,
                  width: (screenWidth * 80) / 100,
                }}
              >
                <View style={{ position: "absolute", left: -13, top: -13 }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "white",
                      borderRadius: 30,
                      alignSelf: "center",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      this.setState({ modalVisible1: false });
                    }}
                  >
                    {/* <Icon1 name='circle-with-cross' size={25} color={Colors.buttoncolor}  style={{alignSelf:'center',padding:1.5,paddingBottom:0}}/> */}
                  </TouchableOpacity>
                </View>

                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    color: "black",
                    alignSelf: "flex-start",
                  }}
                >
                  information
                </Text>
                <Text
                  style={{
                    color: "grey",
                    fontSize: 15,
                    paddingTop: 13,
                    lineHeight: 22,
                    alignSelf: "center",
                  }}
                >
                  Please login first
                </Text>
                <View
                  style={{
                    backgroundColor: Colors.buttoncolor,
                    marginVertical: 20,
                    width: "95%",
                    borderRadius: 40,
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                      this.setState({ modalVisible1: false });
                      this.props.navigation.navigate("Userlogin");
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        paddingVertical: 13,
                        color: "#FFFFFF",
                        fontFamily: "Poppins-SemiBold",
                        fontSize: 13.5,
                        letterSpacing: 1,
                      }}
                    >
                      Login
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* -------------------plan modal------------------------   */}

        {/* <Modal
                    animationType="slide"
                    transparent
                    visible={this.state.planModal}
                    onRequestClose={() => {
                        // console.log('Modal has been closed.');
                    }}>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: '#00000090',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 0,
                           
                        }}>
                    <View style={{justifyContent:'center',alignItems:'center',alignSelf:'center',width:screenWidth*81/100,
                    borderRadius: 10,
                    borderWidth:2,
                    borderColor:'#fff',
                    alignContent:'center',
                    backgroundColor:'#f9f9f9'}}>
                        
                       <View style={{alignItems:'center',backgroundColor:'#f9f9f9',paddingVertical:mobileW*6.5/100,width:screenWidth*80/100,alignSelf:'center',borderBottomWidth:2,borderBottomColor:'#9393ff'}}>
                        <Text style={{textAlign:'center',color:Colors.black_color,fontFamily:Font.fontbold,fontSize:mobileW*4.5/100}}>Buy Subscription Plan</Text>                       
                        </View>

                        <View style={{alignItems:'center',backgroundColor:'#f9f9f9',paddingVertical:mobileW*5.5/100,width:'100%',alignSelf:'center'}}>
                        <Text style={{textAlign:'center',color:Colors.black_color,fontFamily:Font.fontregular,fontSize:mobileW*12/100}}>$20</Text>
                        <Text style={{textAlign:'center',color:'blue',fontFamily:Font.fontbold,fontSize:mobileW*5/100,marginTop:mobileW*2/100}}>{Lang_chg.for_month[config.language]}</Text>
                        </View>
                        <View style={{width:'100%',alignSelf:'center',marginBottom:mobileW*5/100,backgroundColor:'#f9f9f9',}}>
                 <Text style={{textAlign:'justify',fontSize:mobileW*4/100,color:Colors.black_color,width:'90%',alignSelf:'center',lineHeight:25,fontFamily:Font.fontregular}}>
                 There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour,which not look even slightly believable
                 </Text>
                
                    <View style={{width:'95%',flexDirection:'row',justifyContent:'space-around',alignSelf:'center'}}>
                       
                     <TouchableOpacity onPress={()=>{this.setState({planModal:false})}} style={{ paddingVertical:mobileW*1.5/100,width:'35%',borderWidth:1,borderColor:Colors.border_color,
                      alignSelf:'center',
                      marginTop:mobileW*4/100,
                      borderRadius:mobileW*6/100,}} >
                     <Text style={{fontSize:mobileW*3/100,color:Colors.allmsg,textAlign:'center',fontFamily:Font.fontregular}}>{Lang_chg.cancel[config.language]}</Text>
                     </TouchableOpacity>

                     <LinearGradient
                     start={{ x: 0, y: 0.5 }}
                     end={{ x: 1, y: 0.5 }}
                     locations={[0, 0.5, 0.9]}
                     colors={['#01faff', '#019fff', '#0139ff']} style={style1.buttonView1} >
                     <TouchableOpacity onPress={()=>{
                         this.setState({planModal:false})
                         this.props.navigation.navigate('Payment')}}>
                     <Text style={{fontSize:mobileW*3/100,color:Colors.white_color,textAlign:'center',fontFamily:Font.fontregular}}>{Lang_chg.Pay_now[config.language]}</Text>
                     </TouchableOpacity>
                   </LinearGradient>  

                     </View>
                    </View>
                      
                        </View>
                    </View>
                </Modal> */}

        <FlatList
          data={this.props.footerpage}
          //    horizontal={true}
          scrollEnabled={false}
          numColumns={this.props.footerpage.length}
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  width: (screenWidth * footerwidth) / 100,
                  alignSelf: "center",
                  alignItems: "center",
                }}
              >
                {item.name == this.props.activepage ? (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={style1.footericon}
                    onPress={() => {
                      this.usercheckbtn(item.name);
                    }}
                  >
                    <View style={style1.footericonview}>
                      <Image
                        source={item.activeimage}
                        resizeMethod="resize"
                        style={[
                          style1.footerimage,
                          {
                            width: this.props.imagestyle1.width,
                            height: this.props.imagestyle1.height,
                            tintColor: "#0168B3",
                          },
                        ]}
                      />
                      <Text
                        style={{
                          alignSelf: "center",
                          fontSize: (mobileW * 3) / 100,
                          color: Colors.textblue,
                        }}
                      >
                        {item.fname}
                      </Text>

                      {item.countshow != true && (
                        <View
                          style={{
                            position: "absolute",
                            top: -5,
                            left: 20,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {item.countshow > 0 && (
                            <View
                              style={{
                                alignSelf: "center",
                                width: 23,
                                height: 18,
                                borderRadius: 5,
                                backgroundColor:
                                  this.props.imagestyle1.countbackground,
                                justifyContent: "center",
                                alignContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Text
                                style={{
                                  color: this.props.imagestyle1.countcolor,
                                  textAlign: "center",
                                  textAlignVertical: "center",
                                  fontSize: 15,
                                }}
                              >
                                {item.countshow > 9 ? "+9" : item.countshow}
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[style1.footericon]}
                    onPress={() => {
                      this.usercheckbtn(item.name);
                    }}
                  >
                    <View style={style1.footericonview}>
                      {/* {index == 2?
                                  <Image source={require('../icons/post-job-icon.png')} resizeMethod='resize' style={[style1.footerimage, {resizeMode:'contain',
                        width:35,
                        height:35
                      }]} />: */}
                      <Image
                        source={item.image}
                        resizeMethod="resize"
                        style={[
                          style1.footerimage,
                          {
                            width: this.props.imagestyle1.width,
                            height: this.props.imagestyle1.height,
                          },
                        ]}
                      />
                      {/* } */}
                      <Text
                        style={{
                          alignSelf: "center",
                          fontSize: (mobileW * 3) / 100,
                          color: Colors.gray4,
                        }}
                      >
                        {item.fname}
                      </Text>
                      {item.countshow != true && (
                        <View
                          style={{
                            position: "absolute",
                            top: -5,
                            left: 20,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {item.countshow > 0 && (
                            <View
                              style={{
                                alignSelf: "center",
                                width: 23,
                                height: 18,
                                borderRadius: 5,
                                backgroundColor:
                                  this.props.imagestyle1.countbackground,
                                justifyContent: "center",
                                alignContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Text
                                style={{
                                  color: this.props.imagestyle1.countcolor,
                                  textAlign: "center",
                                  textAlignVertical: "center",
                                  fontSize: 15,
                                }}
                              >
                                {item.countshow > 9 ? "+9" : item.countshow}
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
        />
      </View>
    );
  }
}
const style1 = StyleSheet.create({
  footercontainer: {
    flexDirection: "row",
    width: screenWidth,
    position: "absolute",
    borderTopWidth: 1,
    borderTopColor: Colors.LIGHT_CLIENT_BORDER,
    bottom: 0,

    paddingTop: 3.5,
  },
  footericon: {
    width: (screenWidth * 25) / 100,

    paddingBottom: 9,
  },
  footericonview: {
    alignSelf: "center",
    paddingVertical: 5,
  },
  footertext: {
    color: "gray",
    fontSize: 13,
  },
  footerimage: {
    alignSelf: "center",

    resizeMode: "contain",
  },
});
