
import React, { Component } from 'react'
import { Platform, Text, View, Linking, PermissionsAndroid, BackHandler, Alert, SafeAreaView, Dimensions, Image, StyleSheet, TextInput, TouchableOpacity, Keyboard, TouchableHighlight, ImageBackground, FlatList, Modal } from 'react-native'
import { Currentltlg, msgProvider, msgText, Icons, msgTitle, localStorage, apifuntion, config, Lang_chg, AppProvider, Mapprovider, validation, Font, Colors, windowWidth, consolepro, windowHeight } from './Provider/utilslib/Utils'
import Icon2 from 'react-native-vector-icons/Entypo';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Callout, Marker, Circle, PROVIDER_GOOGLE, } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import LinearGradient from 'react-native-linear-gradient'
import HideWithKeyboard from 'react-native-hide-with-keyboard';


export default class Office_address extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    constructor(props) {

        super(props);
        this.state = {
            image: 'NA',
            latitude: config.latitude,
            longitude: config.longitude,
            latdelta: '0.0922',
            longdelta: '0.0421',
            add_new_location: false,
            modalVisible3: true,
            // add_location:'NA',
            addressbar: false,
            addressbar2: false,
            addressselected: 'Search',
            makermove: 0,
            username: '',
            address: '',
            map_arr: [],
            places_arr: 'NA',
            modalVisible: false,
            userdetails: 'NA',
            place_id: '',
            title: '',
            location: '',
            description: '',
            distance_away: '',
            distance: '',
            status: '',
            hideStatus: 'yes',
            radius: 0,
            userlocation: '',
            add_my_location: '',
            markers: [{
                title: 'hello',
                // image: require('./icons/location_setting.png'),
                coordinates: {
                    latitude: 22.7533,
                    longitude: 75.8937,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,

                },
            },
            {
                title: 'hello',
                // image: require('./icons/location_setting.png'),
                coordinates: {
                    latitude: 22.7244,
                    longitude: 75.8839,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,

                },
            },
            {
                title: 'hello',
                // image: require('./icons/location_setting.png'),
                coordinates: {
                    latitude: 22.7355,
                    longitude: 75.9074,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,

                },
            },
            {
                title: 'hello',
                // image: require('./icons/location_setting.png'),
                coordinates: {
                    latitude: 22.7617,
                    longitude: 75.9273,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,

                },

            },
            {
                title: 'hello',
                // image: require('./icons/location_setting.png'),
                coordinates: {
                    latitude: 22.7196,
                    longitude: 75.8577,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,

                },

            },
            {
                title: 'hello',
                // image: require('./icons/location_setting.png'),
                coordinates: {
                    latitude: 22.7193,
                    longitude: 75.8694,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,

                },

            },
            ]
        };

        global.props.hideLoader();
        this.getlatlong();
    }


    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            this.getlatlong();

        });
    }
    getcurrentlatlogn = async () => {
        let data = await Currentltlg.requestLocation()
        let latitude = data.coords.latitude;
        let longitude = data.coords.longitude;
        this.setState({ latitude: latitude, longitude: longitude })
        // var latLongData = { latitude: this.state.latitude, longitude: this.state.longitude};
        localStorage.setItemObject('latitude', latitude);
        localStorage.setItemObject('longitude', longitude);
        // consolepro.consolelog('latitude', this.state.latitude)
        // consolepro.consolelog('longitude', this.state.longitude)
    }
    callLocation = async (that) => {
        this.setState({ loading: true })
        localStorage.getItemObject('position').then((position) => {
            consolepro.consolelog('position', position)
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
                        let position = { 'coords': { 'latitude': this.state.latitude, 'longitude': this.state.longitude } }

                        this.getalldata(position)
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 1000 }
                );
                that.watchID = Geolocation.watchPosition((position) => {
                    //Will give you the location on location change
                    consolepro.consolelog('data', position);

                    if (pointcheck1 != 1) {
                        localStorage.setItemObject('position', position)
                        this.getalldata(position)
                    }

                });

            }
            else {
                consolepro.consolelog('helo gkjodi')
                var pointcheck = 0
                Geolocation.getCurrentPosition(
                    //Will give you the current location
                    (position) => {

                        localStorage.setItemObject('position', position)

                        this.getalldata(position)
                        pointcheck = 1
                    },
                    (error) => {
                        let position = { 'coords': { 'latitude': this.state.latitude, 'longitude': this.state.longitude } }

                        this.getalldata(position)
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 1000 }
                );
                that.watchID = Geolocation.watchPosition((position) => {
                    //Will give you the location on location change
                    consolepro.consolelog('data', position);

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
                        consolepro.consolelog('granted', PermissionsAndroid.RESULTS.GRANTED)

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
            let position = { 'coords': { 'latitude': this.state.latitude, 'longitude': this.state.longitude } }
            this.getalldata(position)
        }
    }

    getalldata = (position) => {
        let longitude = position.coords.longitude
        let latitude = position.coords.latitude
        consolepro.consolelog('positionlatitude', latitude)
        consolepro.consolelog('positionlongitude', longitude)
        this.setState({ latitude: latitude, longitude: longitude, loading: false })
        // this.get_data(latitude, longitude)
        let event = { latitude: latitude, longitude: longitude, latitudeDelta: this.state.latdelta, longitudeDelta: this.state.longdelta }
        this.getadddressfromlatlong(event)
        {
            this.state.add_new_location == true &&
            this.update_adress()
        }
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
        // alert('hihi')

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
                add_location = data2
                post_location = data2
                consolepro.consolelog('responseJson1234', add_location)
                this.GooglePlacesRef && this.GooglePlacesRef.setAddressText(details.formatted_address)
                this.setState({ latdelta: event.latitudeDelta, longdelta: event.longitudeDelta, latitude: event.latitude, longitude: event.longitude, addressselected: details.formatted_address })
                this.setState({ add_my_location: data2 })
                //    localStorage.setItemObject('address_arr',add_location.address);
                console.log('add_my_location', this.state.add_my_location)
            })




    }
    update_adress = async () => {
        let user_details = await localStorage.getItemObject('user_arr')
        console.log('user_details user_details', user_details)
        let user_id = user_details['user_id']
        let address_arr = await localStorage.getItemObject('address_arr')
        let url = config.baseURL + "api-patient-update-address";
        console.log("url", url)
        var data = new FormData();
        data.append('id', user_id)
        data.append('lat', this.state.latitude)
        data.append('long', this.state.longitude)
        data.append('address', address_arr)

        consolepro.consolelog('data', data)
        apifuntion.postApi(url, data, 1).then((obj) => {
            consolepro.consolelog("obj", obj)
            if (obj.status == true) {

                this.getProfile()


            } else {


                return false;
            }
        }).catch((error) => {
            console.log("-------- error ------- " + error);
        })

    }
    getProfile = async () => {
        let user_details = await localStorage.getItemObject('user_arr')
        console.log('user_details user_details', user_details)
        let user_id = user_details['user_id']

        let url = config.baseURL + "api-patient-profile";
        console.log("url", url)
        var data = new FormData();
        data.append('user_id', user_id)

        consolepro.consolelog('data', data)
        apifuntion.postApi(url, data, 1).then((obj) => {
            consolepro.consolelog("obj", obj)
            if (obj.status == true) {
                console.log('result', obj.result)

                let result = obj.result
                localStorage.setItemObject('user_arr', result);
                this.props.navigation.navigate('Home')
                this.setState({ modalVisible3: false })
            }
            else {




                return false;
            }
        }).catch((error) => {
            consolepro.consolelog("-------- error ------- " + error);
            this.setState({ loading: false });
        });
    }


    render() {
        return (

            <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => { Keyboard.dismiss() }}>


                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                   
                    <View style={{
                        width: windowWidth * 100 / 100,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        borderBottomWidth: 1,
                        borderBottomColor: Colors.Border,
                        paddingHorizontal: windowWidth * 1.5 / 100,
                        backgroundColor: Colors.statusbarcolor,

                        alignItems: 'center', height: windowHeight * 10 / 100
                    }}>

                        <View style={[config.language == 0 ? { width: '10%' } : { width: '10%' }]}>
                            {config.language == 0 &&
                                <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>


                                    <Image source={require('./icons/back-button.png')}
                                        style={{
                                            resizeMode: 'contain',
                                            width: 20,
                                            height: 20,
                                            marginLeft: windowWidth * 2 / 100,
                                            marginRight: windowWidth * 2 / 100,

                                        }}></Image>
                                </TouchableOpacity>
                            }
                        </View>
                        {config.language == 1 &&
                            <View style={{ width: '12%', alignItems: 'center' }}>

                                <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>

                                    <Image source={require('./icons/back-button.png')}
                                        style={{
                                            resizeMode: 'contain',
                                            width: 20,
                                            height: 20,

                                        }}></Image>

                                </TouchableOpacity>
                            </View>}
                    </View>
                    <View style={[{ position: 'absolute', top: 16, width: '90%' }, config.language == 1 ? { alignSelf: 'flex-start' } : { alignSelf: 'flex-end' }]}>
                        <View style={{ flex: 1 }}>

                            <GooglePlacesAutocomplete
                                placeholder='Search'

                                minLength={1}
                                selectionColor={'#fff'}
                                autoFocus={false}
                                returnKeyType={'search'}
                                listViewDisplayed={this.state.addressbar2}
                                fetchDetails={true}
                                textInputProps={{
                                    DarkGrey: '#515C6F',
                                    backgroundColor: '#F1F2F4',
                                    fontFamily: Font.fontregular,
                                    fontSize: windowWidth * 4.5 / 100,
                                    color: '#000'

                                }}


                                //  ref={(instance) => { this.GooglePlacesRef = instance }}
                                renderDescription={row => row.description}
                                onPress={(data, details = null) => {
                                    console.log('datalocation', details)
                                    let city = 'unknown';
                                    for (let i = 0; i < details.address_components.length; i++) {
                                        if (details.address_components[i].types[0] == "locality") {
                                            city = details.address_components[i].long_name
                                        }
                                    }
                                    let data2 = { 'latitude': details.geometry.location.lat, 'longitude': details.geometry.location.lng, 'address': details.formatted_address, 'city': city }
                                    //   address_map = data2
                                    add_location = data2
                                    post_location = data2
                                    console.log('123435645646', add_location)
                                    this.setState({ addressbar: true, latitude: details.geometry.location.lat, longitude: details.geometry.location.lng })
                                    localStorage.setItemObject('address_arr', add_location.address);
                                    this.setState({ add_new_location: true })
                                    this.update_adress()
                                }}
                                query={{

                                    key: config.mapkey,
                                    language: config.maplanguage,

                                }}
                                styles={{

                                    textInputContainer: {
                                        backgroundColor: '#fff',

                                        alignSelf: 'center',
                                        height: 50,
                                        alignItems: 'center',

                                    },
                                    textInput: {
                                        marginLeft: 7,
                                        marginRight: 10,
                                        textAlign: 'left',

                                        height: 45,
                                        borderRadius: 10,


                                        color: '#5d5d5d',
                                        fontSize: 16,
                                    },
                                    poweredContainer: {
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',

                                    },

                                    powered: {},
                                    predefinedPlacesDescription: {
                                        color: '#1faadb',

                                    },
                                    separator: {

                                        backgroundColor: '#fff',
                                    },
                                    // description: {
                                    //     fontFamily:Font.regular_font,

                                    //   },
                                    container: {
                                        borderRadius: 10
                                    },

                                    listView: {
                                        backgroundColor: '#FFFFFF',
                                        marginTop: 30,



                                    }

                                }}
                                currentLocation={false}
                                currentLocationLabel="Current location"
                                nearbyPlacesAPI="GooglePlacesSearch"
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

                                ]}
                                debounce={100}
                                renderRightButton={() => (<TouchableOpacity style={{ alignSelf: 'center', paddingRight: 10, }} onPress={() => { this.GooglePlacesRef.setAddressText(""); this.setState({ addressselected: 'search' }) }}>

                                </TouchableOpacity>
                                )}

                            />

                        </View>

                    </View>








                </View>

            </TouchableOpacity>

        )
    }
}
const styles = StyleSheet.create({

    backIcon: {
        width: '10%',

    },
    headerText: {
        width: '70%'
    },

    textInputView:
    {
        width: '84%',
        backgroundColor: Colors.whiteColor,
        justifyContent: 'center',
        paddingLeft: windowWidth * 3 / 100,
        alignSelf: 'center',
        fontSize: windowWidth * 4 / 100,
        borderRadius: windowWidth * 2 / 100,
        fontFamily: Font.fontregular,
        paddingVertical: windowWidth * 2 / 100
    },

    ImageView: {

        width: '15%',
        justifyContent: 'center',

    },


})