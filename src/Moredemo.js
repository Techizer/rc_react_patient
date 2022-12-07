import { Text, View,Image,StatusBar ,TouchableOpacity} from 'react-native'
import React, { Component } from 'react'
import {Colors,localimag,Font,mobileH,Mapprovider,msgProvider,msgText,config,mobileW,localStorage, handleback, Lang_chg,apifuntion, msgTitle,consolepro} from './Provider/utilslib/Utils';


export default class Supportandmore extends Component {
    constructor(props) {
        super(props)
        this.state = {
            engbtn: true,
           
          

        }

    }
  render() {
    return (
        <View style={{width:'100%',alignSelf:'center',flex:1,
        backgroundColor:Colors.white_color}}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor={Colors.statusbarcolor}
                hidden={false}
                translucent={false}
                networkActivityIndicatorVisible={true}
              /> 


                     <View style={{width:'90%',alignSelf:'center',marginTop:mobileW*3/100,flexDirection:'row'}}>
                         <View style={{width:'5%'}}>
                         <TouchableOpacity onPress={()=>{
                           this.props.navigation.goBack()
                         }} style={{width:'100%',}}>
                         <Image style={{width:mobileW*8/100,height:mobileW*8/100,alignSelf:'center'}}
                         source={localimag.backarrow}>
                         </Image>
                         </TouchableOpacity>
                         </View>
                         <View style={{width:'95%',alignSelf:'center'}}>                       
                             <Text style={{textAlign:config.textalign,fontSize:mobileW*4.5/100,color:Colors.Black,fontFamily:Font.Medium,alignSelf:'center'}}>{Lang_chg.supporttext[config.language]} </Text> 
                             </View>
   
                     </View>
                   <Image   style={{height:mobileW*35/100,width:mobileW*45/100,resizeMode:'contain',alignSelf:'center'}}
                     source={localimag.Forgotlogo}>

                   </Image>


                      <View style={{width:'45%',alignSelf:'center',borderColor:Colors.bordercolor,borderWidth:mobileW*0.3/100,marginTop:mobileW*1/100}}>


                    </View>
         
                    <View style={{width:'40%',alignSelf:'center',marginTop:mobileW*3/100}}>
                        <Text style={{textAlign:config.textalign,fontSize:mobileW*4/100,color:Colors.splashtextcolor,fontFamily:Font.Medium,alignSelf:'center'}}>{Lang_chg.Splashtext1[config.language]} </Text> 
                    </View>

                     <View style={{width:'45%',alignSelf:'center',borderColor:Colors.bordercolor,borderWidth:mobileW*0.3/100,marginTop:mobileW*5/100}}>
                     </View>


                     <View style={{width:'40%',alignSelf:'center',marginTop:mobileW*3/100}}>
                        <Text style={{textAlign:config.textalign,fontSize:mobileW*4/100,color:Colors.veriontextcolor,fontFamily:Font.Regular,alignSelf:'center'}}>{Lang_chg.version[config.language]} </Text> 
                    </View>

                    <View style={{width:'90%',alignSelf:'center',marginTop:mobileW*10/100,flexDirection:'row',justifyContent:'space-between'}}>
                       <View style={{width:'42%',alignSelf:'center'}}>
                       <Text style={{textAlign:config.textalign,fontSize:mobileW*3.5/100,color:Colors.Black,fontFamily:Font.Medium,alignSelf:'center'}}>{Lang_chg.languagetxt[config.language]} </Text> 
                        </View>



                        <View style={{width:'40%',alignSelf:'flex-end',flexDirection:'row',}}>
                        
                           <View 
                           style={{width:'50%',alignSelf:'center',backgroundColor:this.state.engbtn == true ? Colors.lightBlue : '#fff',borderColor: Colors.lightBlue,borderWidth:1,paddingVertical:mobileW*2/100
                           ,borderBottomLeftRadius:mobileW*3/100,borderTopLeftRadius:mobileW*3/100}}>
                       <TouchableOpacity  onPress={()=>{this.setState({engbtn:true})}}
                               style={{width:'100%'}}>
                               <Text style={{textAlign:config.textalign,fontSize:mobileW*4/100,color:Colors.Black,fontFamily:Font.Regular,alignSelf:'center'}}>ENG</Text> 
                          </TouchableOpacity>
                         
                           </View> 
  
                           



                           <View style={{width:'50%',alignSelf:'center',backgroundColor:this.state.engbtn == true ? '#fff' : Colors.lightBlue,borderColor:'#fff',borderColor:Colors.Blue,borderWidth:1,paddingVertical:mobileW*2/100,borderTopRightRadius:mobileW*3/100,borderBottomRightRadius:mobileW*3/100}}>
                               <TouchableOpacity onPress={()=>{this.setState({engbtn:false})}} style={{width:'100%'}}>
                               <Text style={{textAlign:config.textalign,fontSize:mobileW*4/100,color:Colors.Black,fontFamily:Font.Regular,alignSelf:'center'}}>AR</Text> 
                          </TouchableOpacity>
                           </View>
 
                        </View>
                    </View>

                    

                    <View style={{width:'90%',alignSelf:'center',borderColor:Colors.bordercolor,borderWidth:mobileW*0.3/100,marginTop:mobileW*5/100}}>
                     </View>
                           

                           <TouchableOpacity style={{width:'90%',alignSelf:'center',marginTop:mobileW*5/100,flexDirection:'row'}}>
                     <View style={{width:'95%',}}>
                       <Text style={{textAlign:config.textalign,fontSize:mobileW*3.5/100,color:Colors.Black,fontFamily:Font.Medium,}}>{Lang_chg.termtxt[config.language]} </Text> 
                        </View>
                        <View style={{width:'5%',alignSelf:'center',}}>
                            <TouchableOpacity style={{width:'100%',alignSelf:'center'}}>
                            <Image style={{width:mobileW*4/100,height:mobileW*4/100,alignSelf:'center',resizeMode:'contain'}}
                         source={localimag.forwardarrow}>
                         </Image>

                            </TouchableOpacity>

                        </View>
                        
                        </TouchableOpacity>


                        <View style={{width:'90%',alignSelf:'center',borderColor:Colors.bordercolor,borderWidth:mobileW*0.3/100,marginTop:mobileW*5/100}}>
                     </View>



                     <TouchableOpacity onPress={()=>{this.props.navigation.navigate('TermsAndConditions',{contantpage:0})}}
                      style={{width:'90%',alignSelf:'center',marginTop:mobileW*5/100,flexDirection:'row'}}>
                     <View style={{width:'95%',}}>
                       <Text style={{textAlign:config.textalign,fontSize:mobileW*3.5/100,color:Colors.Black,fontFamily:Font.Medium,}}>{Lang_chg.aboutrootcare[config.language]} </Text> 
                        </View>
                        <View style={{width:'5%',alignSelf:'center',}}>
                            <TouchableOpacity style={{width:'100%',alignSelf:'center'}}>
                            <Image style={{width:mobileW*4/100,height:mobileW*4/100,alignSelf:'center',resizeMode:'contain'}}
                         source={localimag.forwardarrow}>
                         </Image>

                            </TouchableOpacity>

                        </View>
                        
                        </TouchableOpacity>



                        <View style={{width:'90%',alignSelf:'center',borderColor:Colors.bordercolor,borderWidth:mobileW*0.3/100,marginTop:mobileW*5/100}}>
                     </View>



                     <TouchableOpacity onPress={()=>{this.props.navigation.navigate('TermsAndConditions',{contantpage:2})}}
                     style={{width:'90%',alignSelf:'center',marginTop:mobileW*5/100,flexDirection:'row'}}>
                     <View style={{width:'95%',}}>
                       <Text style={{textAlign:config.textalign,fontSize:mobileW*3.5/100,color:Colors.Black,fontFamily:Font.Medium,}}>{Lang_chg.privacy[config.language]} </Text> 
                        </View>
                        <View style={{width:'5%',alignSelf:'center',}}>
                            <TouchableOpacity style={{width:'100%',alignSelf:'center'}}>
                            <Image style={{width:mobileW*4/100,height:mobileW*4/100,alignSelf:'center',resizeMode:'contain'}}
                         source={localimag.forwardarrow}>
                         </Image>

                            </TouchableOpacity>

                        </View>
                        
                        </TouchableOpacity>


                        <View style={{width:'90%',alignSelf:'center',borderColor:Colors.bordercolor,borderWidth:mobileW*0.3/100,marginTop:mobileW*5/100}}>
                     </View>


                     

                     <TouchableOpacity onPress={()=>{this.props.navigation.navigate('TermsAndConditions',{contantpage:1})}}
                     style={{width:'90%',alignSelf:'center',marginTop:mobileW*5/100,flexDirection:'row'}}>
                     <View style={{width:'10%',alignSelf:'center',}}>
                            <TouchableOpacity style={{width:'100%',alignSelf:'center'}}>
                            <Image style={{width:mobileW*4/100,height:mobileW*4/100,alignSelf:'center',resizeMode:'contain'}}
                         source={localimag.needsupportimg}>
                         </Image>

                            </TouchableOpacity>

                        </View>
                        
                     <View style={{width:'85%'}}>
                       <Text style={{textAlign:config.textalign,fontSize:mobileW*3.5/100,color:Colors.Black,fontFamily:Font.Bold,}}>{Lang_chg.needsupport[config.language]} </Text> 
                        </View>
                        <View style={{width:'5%',alignSelf:'center',}}>
                            <TouchableOpacity style={{width:'100%',alignSelf:'center'}}>
                            <Image style={{width:mobileW*4/100,height:mobileW*4/100,alignSelf:'center',resizeMode:'contain'}}
                         source={localimag.forwardarrow}>
                         </Image>

                            </TouchableOpacity>

                        </View>
                        
                        </TouchableOpacity>




                        <View style={{width:'90%',alignSelf:'center',borderColor:Colors.bordercolor,borderWidth:mobileW*0.3/100,marginTop:mobileW*5/100}}>
                     </View>








                  </View>
         
    )
  }
}