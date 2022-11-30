import React, { Component } from 'react'
import { Modal, SafeAreaView, Text, View, StyleSheet, PermissionsAndroid, Alert, Platform, TouchableOpacity, Image } from 'react-native'
import { Colors, mediaprovider, Font, config, localStorage, Icons, consolepro, Currentltlg, Lang_chg, windowWidth, msgTitle } from './utilslib/Utils';
import Geolocation from '@react-native-community/geolocation';
import Icon2 from 'react-native-vector-icons/Entypo';
import MapView, { Marker, PROVIDER_GOOGLE, } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default class Mapprovider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      modalVisible1: false,
      latitude: config.latitude,
      longitude: config.longitude,
      latdelta: '0.0922',
      longdelta: '0.0421',
      isConnected: true,
      addressbar: false,
      addressbar2: false,
      addressselected: 'Search',
      makermove: 0,
      username: '',
      address: '',
    };
    // this.getlatlong();
  }
  callLocation=async(that)=>{
    this.setState({loading:true})
  localStorage.getItemObject('position').then((position)=>{
    console.log('position',position)
    if(position!=null)
    {
    var pointcheck1=0
    this.getalldata(position)
      Geolocation.getCurrentPosition(
        //Will give you the current location
            (position) => {
              console.log('position',position)
          localStorage.setItemObject('position',position)
          this.getalldata(position);
          pointcheck1=1
            },
          (error) => { 
            console.log('error',error)
            let position={'coords':{'latitude':config.latitude,'longitude':config.longitude}}

          this.getalldata(position)},
          
          { enableHighAccuracy:true, timeout: 15000, maximumAge: 10000 }
        );
        that.watchID = Geolocation.getCurrentPosition((position) => {
        //Will give you the location on location change
            console.log('data',position);

            if(pointcheck1!=1)
            {
            localStorage.setItemObject('position',position)
            this.getalldata(position)
            }

          });

    }
    else{
    console.log('helo gkjodi')

    
    var pointcheck=0
    console.log('granted config.latitude1',config.latitude)
      Geolocation.getCurrentPosition(
        //Will give you the current location
        
          (position) => {
            console.log('granted config.latitude',config.latitude)
          localStorage.setItemObject('position',position)

          this.getalldata(position)
          pointcheck=1
            },
          (error) => {
            console.log('granted config.latitude',error)
            
            let position={'coords':{'latitude':config.latitude,'longitude':config.longitude}}

          this.getalldata(position)},
          { enableHighAccuracy:true, timeout: 15000, maximumAge: 1000 }
        );
        that.watchID = Geolocation.getCurrentPosition((position) => {
            //Will give you the location on location change
            console.log('data',position);

            if(pointcheck!=1)
            {
              console.log('granted config.latitud positione',position)
            localStorage.setItemObject('position',position)
            this.getalldata(position)
            }
         
          });
    }
  })
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
          console.log('granted config.latitude',config.latitude)
            let position={'coords':{'latitude':that.state.latitude,'longitude':that.state.longitude}}
            localStorage.setItemString('permission','denied')
            that.getalldata(position)
      }} catch (err) { console.warn(err) }
        }
      requestLocationPermission();
    }
  } else{
    console.log('granted config.latitude',config.latitude)
    let position={'coords':{'latitude':config.latitude,'longitude':config.longitude}}
    this.getalldata(position)
  }
  }
  getalldata = (position) => {
    let longitude = position.coords.longitude
    let latitude = position.coords.latitude
    console.log('positionlatitude', latitude)
    console.log('positionlongitude', longitude)
    this.setState({ latitude: latitude, longitude: longitude, loading: false })
    //  if(address_map!='NA')
    //  {
    //    this.setState({latitude:address_map.latitude,longitude:address_map.longitude})
    //  }
    //  else if(filter_address!='NA')
    //  {
    //    this.setState({latitude:filter_address.latitude,longitude:filter_address.longitude})
    //  }
    //  else{
    //       this.setState({latitude:latitude,longitude:longitude})
    //  }

  }

  setMapRef = (map) => {
    this.map = map;
  }
  getCoordinates = (region) => {
    return ({
      latitude: parseFloat(this.state.latitude),
      longitude: parseFloat(this.state.longitude),
      latitudeDelta: parseFloat(this.state.latdelta),
      longitudeDelta: parseFloat(this.state.longdelta),
    }
    );
  }

  getadddressfromlatlong = (event) => {
    if (this.state.makermove != 0) {
      fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + event.latitude + ',' + event.longitude + '&key=' + config.mapkey + '&language=' + config.maplanguage)

        .then((response) => response.json())
        .then((resp) => {
          let responseJson = resp.results[0]
          let city = '';
          let administrative_area_level_1 = '';
          for (let i = 0; i < responseJson.address_components.length; i++) {
            if (responseJson.address_components[i].types[0] == "locality") {
              city = responseJson.address_components[i].long_name
              break;
            }
            else if (responseJson.address_components[i].types[0] == "administrative_area_level_2") {
              city = responseJson.address_components[i].long_name
            }

          }
          for (let j = 0; j < responseJson.address_components.length; j++) {
            if (responseJson.address_components[j].types[0] == "administrative_area_level_1") {
              administrative_area_level_1 = responseJson.address_components[j].long_name
            }

          }
          let details = responseJson
          let data2 = { 'latitude': details.geometry.location.lat, 'longitude': details.geometry.location.lng, 'address': details.formatted_address, 'city': city, 'administrative_area_level_1': administrative_area_level_1 }
          this.GooglePlacesRef && this.GooglePlacesRef.setAddressText(details.formatted_address)
          this.setState({ latdelta: event.latitudeDelta, longdelta: event.longitudeDelta, latitude: event.latitude, longitude: event.longitude, addressselected: details.formatted_address })
          return this.props.locationget(data2);
        })

    }
    else {
      this.setState({ makermove: 1 })
    }

  }

  render() {
    return (

      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.mapmodal}
        onRequestClose={() => {
          this.setState({ makermove: 0 })
          this.props.canclemap();
        }}>
        <View style={styles.container}>
          <View style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', paddingTop: 10, backgroundColor: Colors.Theme }}>
            <TouchableOpacity style={{ paddingVertical: 15, width: '20%', alignSelf: 'center', backgroundColor: Colors.Theme }} onPress={() => { this.setState({ makermove: 0 }); this.props.canclemap() }}>
              <View style={{ width: '100%', alignSelf: 'center' }}>
                <Image source={Icons.back} style={{ alignSelf: 'center', width: 25, height: 25 }} />
              </View>
            </TouchableOpacity>
            <View style={{ paddingVertical: 15, width: '60%' }}>
              <Text style={{ color: 'white', fontFamily: Font.FontSemiBold, fontSize: windowWidth * 5 / 100, textAlign: 'center' }}>{this.props.title}</Text>
            </View>
            <TouchableOpacity style={{ paddingVertical: 15, width: '20%', alignSelf: 'center' }} onPress={() => { this.state.profile == 'location' ? this.locationupdatebtn() : this.props.navigation.goBack() }}>
              <View style={{ width: '100%', alignSelf: 'center' }} >
                <Text style={{ color: Colors.Theme, fontFamily: Font.FontSemiBold, fontSize: 13, textAlign: 'center' }}></Text>
              </View>
            </TouchableOpacity>

          </View>
          {this.state.latitude != 'NA' &&
            <View style={{ flex: 1 }}>
              <MapView
                followsUserLocation={true}
                // onUserLocationChange={event =>this.getCoordinates(this)}

                style={{ flex: 1 }}
                region={
                  this.getCoordinates(this)
                }
                //  region={this.getCoordinates(this)}
                zoomEnabled={true}
                provider={PROVIDER_GOOGLE}
                minZoomLevel={2}
                maxZoomLevel={20}
                rotateEnabled={true}
                pitchEnabled={true}
                showsUserLocation={false}
                userLocationPriority='high'
                moveOnMarkerPress={true}
                // showsMyLocationButton={true}
                showsScale={false} // also this is not working
                // showsCompass={false} // and this is not working
                showsPointsOfInterest={true} // this is not working either
                showsBuildings={true} // and finally, this isn't working either

                onMapReady={this.onMapReady}
                // onRegionChangeComplete={(event)=>{this.getadddressfromlatlong(event)}}
                draggable

                //  customMapStyle={mapStyle}
                ref={this.setMapRef}
              >

                <Marker.Animated
                  coordinate={{
                    latitude: parseFloat(this.state.latitude),
                    longitude: parseFloat(this.state.longitude),
                    latitudeDelta: parseFloat(this.state.latdelta),
                    longitudeDelta: parseFloat(this.state.longdelta),
                  }}
                  isPreselected={true}

                  onDragEnd={(e) => { console.log("dragEnd", (e.nativeEvent.coordinate)) }}
                  draggable


                  title={this.state.username != null ? this.state.username : 'Guest user'}
                  description={'Your are here location'}

                >
                  <Image source={Icons.maplocation} style={{ height: 30, width: 30, resizeMode: 'contain', }} />
                </Marker.Animated>
              </MapView>
              <View style={{ position: 'absolute', width: '100%', top: 20 }}>
                <View style={{ flex: 1, paddingHorizontal: 20 }}>

                  <GooglePlacesAutocomplete
                    placeholder='Search'
                    minLength={1} // minimum length of text to search
                    autoFocus={false}
                    returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                    listViewDisplayed={this.state.addressbar2} // true/false/undefined
                    fetchDetails={true}
                    onFail={error => console.error(error)}
                    ref={(instance) => { this.GooglePlacesRef = instance }}
                    renderDescription={row => row.description} // custom description render
                    onPress={(data, details = null) => {
                      let city = 'unknown';
                      for (let i = 0; i < details.address_components.length; i++) {
                        if (details.address_components[i].types[0] == "locality") {
                          city = details.address_components[i].long_name
                        }
                      }
                      let data2 = { 'latitude': details.geometry.location.lat, 'longitude': details.geometry.location.lng, 'address': details.formatted_address, 'city': city }
                      let address_map = data2
                      let filter_address = data2
                      this.setState({ addressbar: true, latitude: details.geometry.location.lat, longitude: details.geometry.location.lng })
                
                      // this.GooglePlacesRef && this.GooglePlacesRef.setAddressText()
                      return this.props.locationget(data2);
                    }}
                    // getDefaultValue={() => {
                    //   return  selleraddress!='NA'?selleraddress.address:'' // text input default value
                    // }}
                    query={{
                      // available options: https://developers.google.com/places/web-service/autocomplete
                      key: config.mapkey,
                      language: config.maplanguage, // language of the results
                      //  types: '(cities)',  default: 'geocode'
                    }}
                    styles={{
                      textInputContainer: {
                        backgroundColor: 'white',
                        marginTop: 10,
                        //  borderWidth:1,

                        // boderColor:'gray',
                        alignSelf: 'center',
                        height: 42,
                        alignItems: 'flex-end',
                        borderRadius: 50
                      },
                      textInput: {
                        marginLeft: 7,
                        marginRight: 10,
                        textAlign: 'left',

                        height: 37,
                        borderRadius: 10,

                        // backgroundColor:'white',
                        color: '#5d5d5d',
                        fontSize: 16,
                      },
                      predefinedPlacesDescription: {
                        color: '#1faadb',

                      },
                      description: {
                        fontFamily: Font.regular_font,

                      },
                      container: {

                        borderRadius: 10
                      },
                      poweredContainer: {
                        backgroundColor: Colors.themecolor,
                        borderRadius: 25,
                        color: '#FFFFFF'
                      },
                      listView: {
                        backgroundColor: '#FFFFFF',
                        marginTop: 30
                      }

                    }}
                    currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
                    currentLocationLabel="Current location"
                    nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                    GoogleReverseGeocodingQuery={{
                      // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                    }}
                    GooglePlacesSearchQuery={{
                      // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                      rankby: 'distance',
                      types: 'food',
                    }}
                    filterReverseGeocodingByTypes={[
                      'locality',
                      'administrative_area_level_3',
                      'postal_code',
                      'sublocality',
                      'country'

                    ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                    //   predefinedPlaces={[homePlace, workPlace]}
                    debounce={100}
                    renderRightButton={() => (<TouchableOpacity style={{ alignSelf: 'center', paddingRight: 10 }} onPress={() => { this.GooglePlacesRef.setAddressText(""); this.setState({ addressselected: 'search' }) }}>
                      <Icon2 name='circle-with-cross' size={25} color='#c2cfc4' style={{ alignSelf: 'center' }} />
                    </TouchableOpacity>)}
                  //   <Image source={require('./icons/location.png')} style={{alignContent:'center',alignSelf:'center',resizeMode:'contain',width:20,height:20,marginLeft:10}}/>}
                  />
                </View>




              </View>
            </View>}
          {/* <View style={{ position: 'absolute', bottom: 15, width: windowWidth, paddingHorizontal: 30 }}>
            <View style={{ borderRadius: 10, height: 50, marginBottom: 10, backgroundColor: Colors.themecolor }} >
              <TouchableOpacity onPress={() => { this.props.canclemap(); }} style={{ justifyContent: 'center', alignItems: 'center', borderRadius: 10, height: 50, }}>
                <Text style={{ color: 'black', fontSize: 18, fontFamily: Font.bold_font }}>Continue</Text>
              </TouchableOpacity>
            </View>

          </View> */}

        </View>
        <View style={{ position: 'absolute', bottom: 15, width: windowWidth, paddingHorizontal: 30 }}>
          <View style={{ borderRadius: 10, height: 50, marginBottom: 10, backgroundColor: Colors.statusbarcolor }} >
            {/* {this.state.signuplocation=='changelocation' && <TouchableOpacity onPress={()=>{this.changeaddress()}} style={{justifyContent:'center',alignItems:'center',borderRadius: 10,height: 50, }}>
                       <Text style={{ color:Colorss.whiteColor, fontSize: 15,fontFamily:Fonts.fontbold
                       }}>{Lang_chg.Updatelocation[config.language]}</Text>
                   </TouchableOpacity>} */}
            <TouchableOpacity onPress={() => { this.props.setmap() }} style={{ justifyContent: 'center', alignItems: 'center', borderRadius: 10, height: 50, }}>
              <Text style={{
                fontSize: 15, fontFamily: Font.fontbold, color: Colors.whiteColor
              }}>Continue</Text>
            </TouchableOpacity>
          </View>

        </View>
      </Modal>

    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  button: {
    backgroundColor: '#00a1e4',
    width: 180,
    borderRadius: 45,
    paddingVertical: 10
  },
  searchbutton: {
    backgroundColor: '#00a1e4',

    borderRadius: 45,
    paddingVertical: 11,
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
    color: '#FFFFFF',
    position: "absolute", bottom: 10, width: '80%',
    alignSelf: 'center'
  },
  searchbar: {
    flexDirection: "row",
    width: '80%',
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    marginRight: 10,
    elevation: 10,
    borderRadius: 15,
    alignSelf: 'center',
    shadowOffset: {
      height: 7,
      width: 0
    },
    shadowColor: "rgba(0,0,0,1)",
    shadowOpacity: 0.49,
    shadowRadius: 5,

  }
})
