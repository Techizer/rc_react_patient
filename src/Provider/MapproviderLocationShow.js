import React, { Component } from 'react'
import { Modal, SafeAreaView, Text, View, StyleSheet, PermissionsAndroid, Alert, Platform, TouchableOpacity, Image } from 'react-native'
import { Colors, mediaprovider, Font, config, localStorage, Icons, consolepro, Currentltlg, Lang_chg, windowWidth, msgTitle } from './utilslib/Utils';
import Geolocation from '@react-native-community/geolocation';
import Icon2 from 'react-native-vector-icons/Entypo';
import MapView, { Marker, PROVIDER_GOOGLE, } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default class MapproviderLocationShow extends Component {
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
  callLocation = async (that) => {
    this.setState({ loading: true })
    localStorage.getItemObject('position').then((position) => {
      console.log('position', position)
      if (position != null) {
        var pointcheck1 = 0
        this.getalldata(position)
        Geolocation.getCurrentPosition(
          //Will give you the current location
          (position) => {

            localStorage.setItemObject('position', position)
            this.getalldata(position);
            pointcheck1 = 1
          },
          (error) => {
            let position = { 'coords': { 'latitude': config.latitude, 'longitude': config.longitude } }

            this.getalldata(position)
          },
          { enableHighAccuracy: true, timeout: 150000, maximumAge: 10000 }
        );
        that.watchID = Geolocation.getCurrentPosition((position) => {
          //Will give you the location on location change
          console.log('data', position);

          if (pointcheck1 != 1) {
            localStorage.setItemObject('position', position)
            this.getalldata(position)
          }

        });

      }
      else {
        // console.log('helo gkjodi')
        //   Alert.alert(

        //     'Hold on!',

        //     'Kindly enable device location', [ {
        //         text: 'Yes',
        //         onPress: () => consolepro.consolelog('Cancel Pressed')
        //     }], {
        //     cancelable: false
        // }

        // );
        var pointcheck = 0
        // let position={'coords':{'latitude':that.state.latitude,'longitude':that.state.longitude}}
        // localStorage.setItemString('permission','denied')
        // that.getalldata(position)

        Geolocation.getCurrentPosition(
          //Will give you the current location
          (position) => {

            localStorage.setItemObject('position', position)

            this.getalldata(position)
            pointcheck = 1
          },
          (error) => {
            let position = { 'coords': { 'latitude': config.latitude, 'longitude': config.longitude } }

            this.getalldata(position)
          },
          { enableHighAccuracy: true, timeout: 1500000, maximumAge: 10000 }
        );
        that.watchID = Geolocation.getCurrentPosition((position) => {
          //Will give you the location on location change
          console.log('data', position);

          if (pointcheck != 1) {

            localStorage.setItemObject('position', position)
            this.getalldata(position)
          }

        });
      }
    })
  }
  getlatlong = async () => {

    let permission = await localStorage.getItemString('permission')
    if (permission != 'denied') {
      var that = this;
      //Checking for the permission just after component loaded
      if (Platform.OS === 'ios') {
        this.callLocation(that);
      } else {
        // this.callLocation(that);
        async function requestLocationPermission() {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
              'title': 'Location Access Required',
              'message': 'This App needs to Access your location'
            }
            )
            console.log('granted', PermissionsAndroid.RESULTS.GRANTED)
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              that.callLocation(that);
            } else {
              let position = { 'coords': { 'latitude': that.state.latitude, 'longitude': that.state.longitude } }
              localStorage.setItemString('permission', 'denied')
              that.getalldata(position)
            }
          } catch (err) { console.warn(err) }
        }
        requestLocationPermission();
      }
    } else {
      let position = { 'coords': { 'latitude': config.latitude, 'longitude': config.longitude } }
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
componentDidMount(){
    this.getValue();
}
getValue = () => {
    consolepro.consolelog('hii')
    consolepro.consolelog(this.props.latitude +'erfsdf'+ this.props.longitude)
    if(this.props.latitude!=null && this.props.longitude!=null )
    this.setState({latitude:this.props.latitude,longitude: this.props.longitude})
    consolepro.consolelog(this.state.latitude +'erfsdf'+ this.state.longitude)
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

    //   <Modal
    //     animationType="slide"
    //     transparent={true}
    //     visible={this.props.mapmodal}
    //     onRequestClose={() => {
    //       this.setState({ makermove: 0 })
    //       this.props.canclemap();
    //     }}>
        <View style={styles.container}>
          {/* <SafeAreaView style={{ flex: 0, backgroundColor: Colors.statusbarcolor }} /> */}
        
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
                  <Image source={Icons.location_green} style={{ height: 30, width: 30, resizeMode: 'contain', }} />
                </Marker.Animated>
              </MapView>
              <View style={{ position: 'absolute', width: '100%', top: 20 }}>
                <View style={{ flex: 1, paddingHorizontal: 20 }}>

                 
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
    
    //   </Modal>

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
