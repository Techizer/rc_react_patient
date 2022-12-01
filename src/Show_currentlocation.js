import React, {Component} from 'react';
import { Text,PermissionsAndroid, View,ScrollView, StyleSheet, SafeAreaView, Image, TouchableOpacity, ImageBackground, TextInput, FlatList, Keyboard} from 'react-native';
import {Colors,Font,windowHeight,Mapprovider,msgProvider,msgText,config,windowWidth,localStorage,Icons, consolepro, handleback, Lang_chg, apifuntion, msgTitle,} from './Provider/utilslib/Utils';
import Geolocation from '@react-native-community/geolocation';
import Styles from './Styles';


global.post_location='NA'
export default class Show_currentlocation extends Component {
  _didFocusSubscription; 
  _willBlurSubscription; 

   constructor(props){ 
    super(props) 
    this.state = {
      
      nurse_data:'',
      message:'',
      provider_name:''
    }
    screens='Login';
  }
  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
 
     });    
  }
  update_adress=async()=>{
    let user_details = await localStorage.getItemObject('user_arr')
   
    let  user_id=user_details['user_id']
    let  address_arr    = await localStorage.getItemObject('address_arr')
    let url = config.baseURL + "api-patient-update-address";

    var data = new FormData();
    console.log('jdfhnehbfgh',data)
    data.append('id',user_id)
    data.append('lat',this.state.latitude)
    data.append('long',this.state.longitude)
    data.append('address',address_arr)

    apifuntion.postApi(url, data).then((obj) => {
      consolepro.consolelog("obj", obj)
      if (obj.status==true) {
       
          this.getProfile()
          
      
    
      
    } else {
    
    
    return false;
    }
    }).catch((error)=>{
    console.log("-------- error ------- " + error);
    })
    
    }
    getProfile=async()=>{
      let user_details = await localStorage.getItemObject('user_arr')
      console.log('chevck user_details',user_details)
      let  user_id=user_details['user_id']
     
      let url = config.baseURL + "api-patient-profile";
   
      var data = new FormData();
      data.append('user_id',user_id)
     
   
      apifuntion.postApi(url, data,1).then((obj) => {
   
        if (obj.status == true) {
       
          consolepro.consolelog("muskan", obj)
          let result =obj.result
          localStorage.setItemObject('user_arr',result);
            setTimeout(() => {
            this.props.navigation.navigate('Home');
             },700);
     
               } 
        else {
  
         
          
        
          return false;
        }
      }).catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
        this.setState({ loading: false });
      });
    }
  getlatlong=async()=>{
 
    let permission= await localStorage.getItemString('permission')
    if(permission!='denied')
     {
      var that =this;
      //Checking for the permission just after component loaded
      if(Platform.OS === 'ios'){
      this.callLocation(that);
    }else{
      // this.callLocation(that);
      async function requestLocationPermission() {
        try {
          const granted = await PermissionsAndroid.request(
               PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
              'title': 'Location Access Required',
              'message': 'This App needs to Access your location'
            }
          )
          console.log('granted',PermissionsAndroid.RESULTS.GRANTED)
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              that.callLocation(that);
          } else {
              let position={'coords':{'latitude':config.latitude,'longitude':config.latitude}}
              that.getalldata(position)
              localStorage.setItemString('permission','denied')                
             
        }} catch (err) { console.warn(err) }
          }
        requestLocationPermission();
      }
    } else{        
      let position={'coords':{'latitude':config.latitude,'longitude':config.longitude}}
      this.getalldata(position)
    }
   }

   callLocation=async(that)=>{
    this.setState({loading:true})
  localStorage.getItemObject('position').then((position)=>{
  
   if(position!=null)
   {
    var pointcheck1=0
     this.getalldata(position)
      Geolocation.getCurrentPosition(
        //Will give you the current location
            (position) => {

          localStorage.setItemObject('position',position)
          this.getalldata(position);
          pointcheck1=1
            },
          (error) => { let position={'coords':{'latitude':config.latitude,'longitude':config.longitude}}

          this.getalldata(position)},
          { enableHighAccuracy:true, timeout: 150000000, maximumAge: 1000 }
        );
        that.watchID = Geolocation.watchPosition((position) => {
      

           if(pointcheck1!=1)
           {
            localStorage.setItemObject('position',position)
            this.getalldata(position)
           }

         });

   }
   else{
 
    var pointcheck=0
      Geolocation.getCurrentPosition(
        //Will give you the current location
         (position) => {

         localStorage.setItemObject('position',position)

          this.getalldata(position)
          pointcheck=1
            },
          (
error) => {let position={'coords':{'latitude':config.latitude,'longitude':config.longitude}}

          this.getalldata(position)},
          { enableHighAccuracy:true, timeout: 150000000, maximumAge: 1000 }
        );
        that.watchID = Geolocation.watchPosition((position) => {
           //Will give you the location on location change
           console.log('data',position);

           if(pointcheck!=1)
           {

            localStorage.setItemObject('position',position)
            this.getalldata(position)
           }

         });
   }
  })
  }

  getalldata=(position)=>{
       
    let longitude=position.coords.longitude
    let latitude=position.coords.latitude
    console.log('positionlatitude',position.coords)
    console.log('positionlongitude',longitude)
    this.setState({latitude:latitude,longitude:longitude,loading:false})
    myLatitude = latitude,
    myLongitude =  longitude
    current_lat_long = position
   
    let event = {latitude:latitude,longitude:longitude,latitudeDelta:this.state.latdelta,longitudeDelta:this.state.longdelta}
    this.getadddressfromlatlong(event)
  this.update_adress()
 }

 getadddressfromlatlong=(event)=>{
  // alert('hi')

  fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + event.latitude + ',' + event.longitude + '&key=' + config.mapkey+'&language='+config.maplanguage)

  .then((response) => response.json())
          .then((resp) => {
            let responseJson=resp.results[0]
            let city='';
            let administrative_area_level_1='';
            for(let i=0; i<responseJson.address_components.length; i++)
            {
              if(responseJson.address_components[i].types[0]=="locality")
                {
                   city=responseJson.address_components[i].long_name
                     break;
                }
                else if(responseJson.address_components[i].types[0]=="administrative_area_level_2"){
                    city=responseJson.address_components[i].long_name
                }

            }
            for(let j=0; j<responseJson.address_components.length; j++)
            {
               if(responseJson.address_components[j].types[0]=="administrative_area_level_1"){
                  administrative_area_level_1=responseJson.address_components[j].long_name
                }

            }
            let details = responseJson
            let data2 = { 'latitude': details.geometry.location.lat, 'longitude': details.geometry.location.lng, 'address': details.formatted_address, 'city': city, 'administrative_area_level_1': administrative_area_level_1 }
            
            post_location=data2
            // consolepro.consolelog('responseJson1234', add_location)
             this.GooglePlacesRef && this.GooglePlacesRef.setAddressText(details.formatted_address)
            this.setState({latdelta:event.latitudeDelta,longdelta:event.longitudeDelta,latitude:event.latitude,longitude:event.longitude,addressselected:details.formatted_address})
            this.setState({add_my_location:data2})  
            localStorage.setItemObject('address_arr',post_location.address);
            console.log('dfhhdfgb',data2)                
            //   return  this.props.locationget(data2);

  })



  }



 
  render() {
    return (
      <View style={Styles.container1}>
     
          <View style={{backgroundColor:'#fff',flex:1}}>
            {/* <Text>Home</Text> */}
            
   {/* <ScrollView
          style={Styles.container2}
     
         > */}
       
     
         <View style={{backgroundColor: '#fff',flexDirection:'row',alignItems:'center',width:'95%',alignSelf:'center',marginTop:windowWidth*4/100}}>
         <TouchableOpacity
         style={{width:'10%',}}
            onPress={() => {
             this.props.navigation.goBack();
            }}>{config.textalign=='right'?
              <Image   source={require('./icons/arrow_right_search_right.png') }
               style={{
                resizeMode: 'contain',
                width:20,
                height:20,
                marginLeft:windowWidth*1/100
              }}></Image>:
              <Image   source={require('./icons/back-button.png') }
               style={{
                resizeMode: 'contain',
                width:20,
                height:20,
                marginLeft:windowWidth*1/100
              }}></Image>}
            {/* <Image
            
            source={config.textalign=='right'?require('./icons/arrow_right_search_right.png'): require('./icons/back-button.png')}
              style={{
                resizeMode: 'contain',
                width:30,
             
                height:30,
              }}></Image> */}
          </TouchableOpacity>
    
      <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Office_address')}}
        style={{
          flexDirection: 'row',
          width: '90%',
         paddingVertical:windowWidth*2/100,
          alignSelf: 'center',
          backgroundColor:'#F1F2F4',
          padding: (windowWidth * 1) / 100,
          borderRadius: (windowWidth * 1) / 100,
          alignItems:'center',
         
        }}>
        {/* search box */}

     
          <Text style={{
              color:Colors.searchPlaceholder,
              fontSize:windowWidth*4/100,
              width:'88%',
              marginLeft:windowWidth*1/100,
              
            
              textAlign: config.textRotate,
            }}> {Lang_chg.SearchLocation[config.language]}
         

</Text>
            
      <View >
        <View style={{alignSelf: 'center'}}>
       
          <Image
            source={Icons.searchiocn2}
            style={{
              width: (windowWidth *9.5) / 100,
              height: (windowWidth * 9.5) / 100,
              // (windowWidth * 5.5) / 100,
              borderRadius: (windowWidth * 1.5) / 100,
              alignSelf: 'center',
            }}></Image>
           
        </View>
        </View>
      </TouchableOpacity>
    </View>
   
            
         <TouchableOpacity onPress={()=>{this.getlatlong()}} style={{flexDirection:'row',width:'100%',marginTop:windowWidth*6/100, alignSelf:'center'}}>
<View style={{width:'9%',marginLeft:windowWidth*4/100}}>
<Image
             source={require('./icons/locations_current.png')}
            style={{
              width:18,
              height:18,
              marginTop:windowWidth*0.6/100
         
            }}></Image>
</View>
<View style={{width:'90%',borderBottomWidth:1,borderBottomColor:Colors.bordercolor,paddingBottom:windowWidth*3/100,}}>
       <Text style={{textAlign:config.textRotate,fontSize:windowWidth*3.8/100,fontFamily:Font.fontregular}}>{Lang_chg.Currentlocation[config.language]}</Text>
       <Text style={{textAlign:config.textRotate,fontSize:windowWidth*3/100,fontFamily:Font.fontregular,color:Colors.lightGrey}}>{Lang_chg.Using_gpsofyoudevice[config.language]}</Text>
       </View>
       
         </TouchableOpacity>

               
            {/* </ScrollView> */}
          </View>

      </View>
    );
  }
}
