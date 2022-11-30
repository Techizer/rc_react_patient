import React, { Component } from 'react'
import { Modal, Text, View, StyleSheet, Dimensions, TouchableOpacity, Image, TouchableHighlight, Alert, ImageBackground } from 'react-native'
import { Colors, mediaprovider, config, localStorage, Icons, Currentltlg, Lang_chg, windowWidth, windowHeight, Font } from './utilslib/Utils';
import Icon2 from 'react-native-vector-icons/Entypo';
import MapView, { Callout, Circle, Marker, PROVIDER_GOOGLE, } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Header from '../common/Header';
import Input from '../common/Input';
import StarRating from 'react-native-star-rating';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class MapproviderSearch extends Component {
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
      datamarker: false,
      loc_arr: [

        { 'latitude': '55.3781', 'longitude': '3.4360' },
        { 'latitude': '55.3781', 'longitude': '3.4360' },
        { 'latitude': '55.3781', 'longitude': '3.4360' },
        { 'latitude': '55.3781', 'longitude': '3.4360' },


      ],
      markers:
        [
          {
            title: 'hello',
            coordinates: {
              latitude: 55.447285,
              longitude: 3.631201
            },
          },
          {
            title: 'hello',
            coordinates: {
              latitude: 55.3781,
              longitude: 3.2860
            },
          },
          {
            title: 'hello',
            coordinates: {
              latitude: 55.2881,
              longitude: 3.1360
            },
          },
          {
            title: 'hello',
            coordinates: {
              latitude: 55.3681,
              longitude: 3.3760
            },
          }

        ]
    };
    //this.getcurrentlatlogn();
  }
  //   getcurrentlatlogn=async()=>{
  //     let data= await Currentltlg.requestLocation()
  //     let latitude=data.coords.latitude;
  //     let longitude=data.coords.longitude;
  //     if(this.props.address_arr!='NA')
  //     {
  //       this.setState({latitude:latitude,longitude:longitude})
  //     }
  //     else{
  //          this.setState({latitude:latitude,longitude:longitude})
  //     }

  // }
  componentDidMount() {
    this.getValue();

  }
  setimageerror = (index) => {
    let data = markers;
    data[index].provider_image = 'NA'
    setdata_recommended([data])

  }
  getValue = () => {
    console.log('this.props.mapdataCallout', this.props.mapdataCallout)
    setTimeout(() => {
      if (this.props.mapdataCallout != 'null' || this.props.mapdataCallout != 'NA') {
        this.setState({ markers: this.props.mapdataCallout, datamarker: true })
        console.log('MArker', this.state.markers)
      }
    }, 70);

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

      // <Modal
      //   animationType="slide"
      //   transparent={true}
      //   visible={this.props.mapmodal}
      //   onRequestClose={() => {
      //     this.setState({ makermove: 0 })
      //     this.props.canclemap();
      //   }}>
      <View style={styles.container}>
        {/* <View style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', paddingTop: 10, backgroundColor: '#d15252' }}>
            <TouchableOpacity style={{ paddingVertical: 15, width: '20%', alignSelf: 'center', backgroundColor: Colors.Theme }} onPress={() => { this.setState({ makermove: 0 }); this.props.canclemap() }}>
              <View style={{ width: '100%', alignSelf: 'center' }}>
                <Image source={Icons.back} style={{ alignSelf: 'center', width: 25, height: 25 }} />
              </View>
            </TouchableOpacity>
            <View style={{ paddingVertical: 15, width: '60%' }}>
              <Text style={{ color: 'white', fontFamily:Font.FontSemiBold, fontSize: windowWidth * 5 / 100, textAlign: 'center' }}>{Lang_chg.titlesearchlocation[config.language]}</Text>
            </View>
            <TouchableOpacity style={{ paddingVertical: 15, width: '20%', alignSelf: 'center' }} onPress={() => { this.state.profile == 'location' ? this.locationupdatebtn() : this.props.navigation.goBack() }}>
              <View style={{ width: '100%', alignSelf: 'center' }} >
                <Text style={{ color: Colors.Theme, fontFamily: Font.FontSemiBold, fontSize: 13, textAlign: 'center' }}></Text>
              </View>
            </TouchableOpacity>

          </View> */}

        <View style={{ flex: 1 }}>
          <MapView
            followsUserLocation={true}
            style={{ flex: 1 }}
            region={
              this.getCoordinates(this)
            }
            zoomEnabled={true}
            provider={PROVIDER_GOOGLE}
            minZoomLevel={2}
            maxZoomLevel={20}
            rotateEnabled={true}
            pitchEnabled={true}
            showsUserLocation={true}
            userLocationPriority='high'
            moveOnMarkerPress={true}
            showsMyLocationButton={true}
            showsScale={true} // also this is not working
            showsCompass={true} // and this is not working
            showsPointsOfInterest={true} // this is not working either
            showsBuildings={true} // and finally, this isn't working either
            onMapReady={this.onMapReady}
            // onRegionChangeComplete={(event) => { this.getadddressfromlatlong(event) }}
            draggable
            ref={this.setMapRef}
          // onCalloutPress={()=>alert("Hello")}
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


              <Image source={Icons.maplocation} style={{ height: 35, width: 35, resizeMode: 'contain', }} />
            </Marker.Animated>

            <Circle
              center={{
                latitude: parseFloat(this.state.latitude),
                longitude: parseFloat(this.state.longitude),
                latitudeDelta: parseFloat(this.state.latdelta),
                longitudeDelta: parseFloat(this.state.longdelta),
              }}
              radius={2000}

              zIndex={0}
              strokeColor={Colors.Theme}
              fillColor='rgba(1,0.1,40,0.3)'

            >
              {/* fillColor={'#d1525200'}> */}

            </Circle>
            {this.state.datamarker == true && this.state.markers != null
              && this.state.markers != 'NA' && this.state.markers != 'undefined' && this.state.markers != undefined &&
              this.state.markers.map(item => (
                <Marker.Animated
                  coordinate={item.coordinates}
                  isPreselected={true}
                  // onDragEnd={(e) => { console.log("dragEnd", (e.nativeEvent.coordinate)) }}
                  draggable
                  // image={Icons.location_tags}
                  title={this.state.username != null ? this.state.username : 'Guest user'}
                  description={'Your are here location'}
                  on

                //onPress={()=>console.log('gdfg')}
                >
                  <ImageBackground source={Icons.location_tags} imageStyle={{ tintColor: item.chat_status == 0 && 'red' }} style={{ resizeMode: 'contain', width: windowWidth * 0.11, height: windowWidth * 0.11, alignItems: 'center' }} >
                    {
                      item.provider_image == 'NA' || item.provider_image == '' || item.provider_image == null
                        ?
                        <Image style={{ resizeMode: 'cover', marginTop:windowWidth * 0.007, alignSelf: 'center', width: windowWidth * 0.060, height: windowWidth * 0.060, borderRadius: windowWidth * 0.025 }}
                          source={Icons.pro}></Image>
                        :
                        <Image source={{ uri: config.img_url + item.provider_image }} style={{ resizeMode: 'cover', marginTop:windowWidth * 0.007, alignSelf: 'center', width: windowWidth * 0.060, height: windowWidth * 0.060, borderRadius: windowWidth * 0.025 }} />
                    }
                  </ImageBackground>

                  <Callout onPress={() => { }} >

                    <View style={{ width: windowWidth * 45 / 100, height: windowHeight * 8 / 100, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }} >
                      <View style={{ width: windowWidth * 44 / 100, height: windowHeight * 8 / 100, alignSelf: 'center', flexDirection: 'row' }}>
                        <View style={{ width: windowWidth * 12 / 100, height: windowHeight * 12 / 100, }}>
                          <Text style={{ width: '100%', height: '100%', marginTop:config.device_type=='ios'?-14: -30 }}>
                            {
                              item.provider_image == 'NA' || item.provider_image == '' || item.provider_image == null
                                ?
                                <Image style={{ width: windowWidth * 10 / 100, height: windowHeight * 10 / 100, resizeMode: 'contain', }}
                                  source={Icons.pro}></Image>
                                :
                                <Image onError={(error) => { this.setimageerror(index) }} style={{ width: windowWidth * 10 / 100, height: windowHeight * 10 / 100, resizeMode: 'contain', }}
                                  source={{ uri: config.img_url + item.provider_image }}></Image>

                            }
                          </Text></View>
                        <View style={{}}><Text style={{ color: Colors.textcolor, fontFamily: Font.FontBold, fontSize: windowHeight * 2 / 100 }} numberOfLines={1}>Name-{item.provider_name}</Text>
                          <Text style={{ color: Colors.textcolor, fontFamily: Font.FontBold, fontSize: windowHeight * 2 / 100 }}>{item.provider_dist} miles</Text>
                          {/* <View style={{ flexDirection: 'row', width: '65%', justifyContent: 'space-evenly' }}>
                            <Text><Image style={{ marginTop: 2, width: windowWidth * 2 / 100, height: windowHeight * 1.5 / 100 }} source={Icons.star}></Image></Text>
                            <Text><Image style={{ marginTop: 2, width: windowWidth * 2 / 100, height: windowHeight * 1.5 / 100 }} source={Icons.star}></Image></Text>
                            <Text><Image style={{ marginTop: 2, width: windowWidth * 2 / 100, height: windowHeight * 1.5 / 100 }} source={Icons.star}></Image></Text>
                            <Text><Image style={{ marginTop: 2, width: windowWidth * 2 / 100, height: windowHeight * 1.5 / 100 }} source={Icons.star}></Image></Text>
                            <Text><Image style={{ marginTop: 2, width: windowWidth * 2 / 100, height: windowHeight * 1.5 / 100 }} source={Icons.star}></Image></Text>
                            <Text style={{ marginStart: 5, fontFamily: Font.FontMedium, fontSize: windowWidth * 2.5 / 100, }}>(5.0)</Text>
                          </View>*/}

                        </View>
                      </View>
                    </View>

                  </Callout>



                </Marker.Animated>
              ))}
          </MapView>
         
        </View>
      </View>


    )
  }
}
const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
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

  },
  customtab:
  {
    width: windowWidth,
    flexDirection: 'row',
    alignSelf: 'center', alignContent: 'center',
    backgroundColor: Colors.whiteColor,
    paddingVertical: windowWidth * 0.03,
    justifyContent: 'space-evenly',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  Tabtextstyle:
  {
    fontSize: windowWidth * 0.045,
    fontFamily: Font.FontRegular,
    marginLeft: windowWidth * 0.02

  },

  TabTextView:
  {
    width: '40%',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center'

  },
})
