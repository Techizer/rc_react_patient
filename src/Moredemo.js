import { Text, View,Image ,TouchableOpacity} from 'react-native'
import React, { Component } from 'react'
import {Colors,Icons,Font,windowHeight,Mapprovider,msgProvider,msgText,config,windowWidth,localStorage, handleback, Lang_chg,apifuntion, msgTitle,consolepro} from './Provider/utilslib/Utils';


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
        backgroundColor:Colors.white}}>
           


                     <View style={{width:'90%',alignSelf:'center',marginTop:windowWidth*3/100,flexDirection:'row'}}>
                         <View style={{width:'5%'}}>
                         <TouchableOpacity onPress={()=>{
                           this.props.navigation.goBack()
                         }} style={{width:'100%',}}>
                         <Image style={{width:windowWidth*8/100,height:windowWidth*8/100,alignSelf:'center'}}
                         source={Icons.backarrow}>
                         </Image>
                         </TouchableOpacity>
                         </View>
                         <View style={{width:'95%',alignSelf:'center'}}>                       
                             <Text style={{textAlign:config.textalign,fontSize:windowWidth*4.5/100,color:Colors.textblack,fontFamily:Font.fontmedium,alignSelf:'center'}}>{Lang_chg.supporttext[config.language]} </Text> 
                             </View>
   
                     </View>
                   <Image   style={{height:windowWidth*35/100,width:windowWidth*45/100,resizeMode:'contain',alignSelf:'center'}}
                     source={Icons.Forgotlogo}>

                   </Image>


                      <View style={{width:'45%',alignSelf:'center',borderColor:Colors.bordercolor,borderWidth:windowWidth*0.3/100,marginTop:windowWidth*1/100}}>


                    </View>
         
                    <View style={{width:'40%',alignSelf:'center',marginTop:windowWidth*3/100}}>
                        <Text style={{textAlign:config.textalign,fontSize:windowWidth*4/100,color:Colors.lightGrey,fontFamily:Font.fontmedium,alignSelf:'center'}}>{Lang_chg.Splashtext1[config.language]} </Text> 
                    </View>

                     <View style={{width:'45%',alignSelf:'center',borderColor:Colors.bordercolor,borderWidth:windowWidth*0.3/100,marginTop:windowWidth*5/100}}>
                     </View>


                     <View style={{width:'40%',alignSelf:'center',marginTop:windowWidth*3/100}}>
                        <Text style={{textAlign:config.textalign,fontSize:windowWidth*4/100,color:Colors.Border,fontFamily:Font.fontregular,alignSelf:'center'}}>{Lang_chg.version[config.language]} </Text> 
                    </View>

                    <View style={{width:'90%',alignSelf:'center',marginTop:windowWidth*10/100,flexDirection:'row',justifyContent:'space-between'}}>
                       <View style={{width:'42%',alignSelf:'center'}}>
                       <Text style={{textAlign:config.textalign,fontSize:windowWidth*3.5/100,color:Colors.textblack,fontFamily:Font.fontmedium,alignSelf:'center'}}>{Lang_chg.languagetxt[config.language]} </Text> 
                        </View>



                        <View style={{width:'40%',alignSelf:'flex-end',flexDirection:'row',}}>
                        
                           <View 
                           style={{width:'50%',alignSelf:'center',backgroundColor:this.state.engbtn == true ? Colors.buttonbackgoungcolorlightblue : '#fff',borderColor: Colors.buttonbackgoungcolorlightblue,borderWidth:1,paddingVertical:windowWidth*2/100
                           ,borderBottomLeftRadius:windowWidth*3/100,borderTopLeftRadius:windowWidth*3/100}}>
                       <TouchableOpacity  onPress={()=>{this.setState({engbtn:true})}}
                               style={{width:'100%'}}>
                               <Text style={{textAlign:config.textalign,fontSize:windowWidth*4/100,color:Colors.textblack,fontFamily:Font.fontregular,alignSelf:'center'}}>ENG</Text> 
                          </TouchableOpacity>
                         
                           </View> 
  
                           



                           <View style={{width:'50%',alignSelf:'center',backgroundColor:this.state.engbtn == true ? '#fff' : Colors.buttonbackgoungcolorlightblue,borderColor:'#fff',borderColor:Colors.bordercolorblue,borderWidth:1,paddingVertical:windowWidth*2/100,borderTopRightRadius:windowWidth*3/100,borderBottomRightRadius:windowWidth*3/100}}>
                               <TouchableOpacity onPress={()=>{this.setState({engbtn:false})}} style={{width:'100%'}}>
                               <Text style={{textAlign:config.textalign,fontSize:windowWidth*4/100,color:Colors.textblack,fontFamily:Font.fontregular,alignSelf:'center'}}>AR</Text> 
                          </TouchableOpacity>
                           </View>
 
                        </View>
                    </View>

                    

                    <View style={{width:'90%',alignSelf:'center',borderColor:Colors.bordercolor,borderWidth:windowWidth*0.3/100,marginTop:windowWidth*5/100}}>
                     </View>
                           

                           <TouchableOpacity style={{width:'90%',alignSelf:'center',marginTop:windowWidth*5/100,flexDirection:'row'}}>
                     <View style={{width:'95%',}}>
                       <Text style={{textAlign:config.textalign,fontSize:windowWidth*3.5/100,color:Colors.textblack,fontFamily:Font.fontmedium,}}>{Lang_chg.termtxt[config.language]} </Text> 
                        </View>
                        <View style={{width:'5%',alignSelf:'center',}}>
                            <TouchableOpacity style={{width:'100%',alignSelf:'center'}}>
                            <Image style={{width:windowWidth*4/100,height:windowWidth*4/100,alignSelf:'center',resizeMode:'contain'}}
                         source={Icons.forwardarrow}>
                         </Image>

                            </TouchableOpacity>

                        </View>
                        
                        </TouchableOpacity>


                        <View style={{width:'90%',alignSelf:'center',borderColor:Colors.bordercolor,borderWidth:windowWidth*0.3/100,marginTop:windowWidth*5/100}}>
                     </View>



                     <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Tremsandcondition',{contantpage:0})}}
                      style={{width:'90%',alignSelf:'center',marginTop:windowWidth*5/100,flexDirection:'row'}}>
                     <View style={{width:'95%',}}>
                       <Text style={{textAlign:config.textalign,fontSize:windowWidth*3.5/100,color:Colors.textblack,fontFamily:Font.fontmedium,}}>{Lang_chg.aboutrootcare[config.language]} </Text> 
                        </View>
                        <View style={{width:'5%',alignSelf:'center',}}>
                            <TouchableOpacity style={{width:'100%',alignSelf:'center'}}>
                            <Image style={{width:windowWidth*4/100,height:windowWidth*4/100,alignSelf:'center',resizeMode:'contain'}}
                         source={Icons.forwardarrow}>
                         </Image>

                            </TouchableOpacity>

                        </View>
                        
                        </TouchableOpacity>



                        <View style={{width:'90%',alignSelf:'center',borderColor:Colors.bordercolor,borderWidth:windowWidth*0.3/100,marginTop:windowWidth*5/100}}>
                     </View>



                     <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Tremsandcondition',{contantpage:2})}}
                     style={{width:'90%',alignSelf:'center',marginTop:windowWidth*5/100,flexDirection:'row'}}>
                     <View style={{width:'95%',}}>
                       <Text style={{textAlign:config.textalign,fontSize:windowWidth*3.5/100,color:Colors.textblack,fontFamily:Font.fontmedium,}}>{Lang_chg.privacy[config.language]} </Text> 
                        </View>
                        <View style={{width:'5%',alignSelf:'center',}}>
                            <TouchableOpacity style={{width:'100%',alignSelf:'center'}}>
                            <Image style={{width:windowWidth*4/100,height:windowWidth*4/100,alignSelf:'center',resizeMode:'contain'}}
                         source={Icons.forwardarrow}>
                         </Image>

                            </TouchableOpacity>

                        </View>
                        
                        </TouchableOpacity>


                        <View style={{width:'90%',alignSelf:'center',borderColor:Colors.bordercolor,borderWidth:windowWidth*0.3/100,marginTop:windowWidth*5/100}}>
                     </View>


                     

                     <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Tremsandcondition',{contantpage:1})}}
                     style={{width:'90%',alignSelf:'center',marginTop:windowWidth*5/100,flexDirection:'row'}}>
                     <View style={{width:'10%',alignSelf:'center',}}>
                            <TouchableOpacity style={{width:'100%',alignSelf:'center'}}>
                            <Image style={{width:windowWidth*4/100,height:windowWidth*4/100,alignSelf:'center',resizeMode:'contain'}}
                         source={Icons.needsupportimg}>
                         </Image>

                            </TouchableOpacity>

                        </View>
                        
                     <View style={{width:'85%'}}>
                       <Text style={{textAlign:config.textalign,fontSize:windowWidth*3.5/100,color:Colors.textblack,fontFamily:Font.fontbold,}}>{Lang_chg.needsupport[config.language]} </Text> 
                        </View>
                        <View style={{width:'5%',alignSelf:'center',}}>
                            <TouchableOpacity style={{width:'100%',alignSelf:'center'}}>
                            <Image style={{width:windowWidth*4/100,height:windowWidth*4/100,alignSelf:'center',resizeMode:'contain'}}
                         source={Icons.forwardarrow}>
                         </Image>

                            </TouchableOpacity>

                        </View>
                        
                        </TouchableOpacity>




                        <View style={{width:'90%',alignSelf:'center',borderColor:Colors.bordercolor,borderWidth:windowWidth*0.3/100,marginTop:windowWidth*5/100}}>
                     </View>








                  </View>
         
    )
  }
}