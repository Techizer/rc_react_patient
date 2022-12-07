
import React, { Component } from 'react'
import { Platform, Text, View, Linking, PermissionsAndroid, BackHandler, Alert, SafeAreaView, Dimensions, Image, StyleSheet, TextInput, TouchableOpacity, Keyboard, TouchableHighlight, ImageBackground, FlatList, Modal } from 'react-native'
import { Currentltlg, msgProvider, msgText, Icons, msgTitle, localStorage, apifuntion, config, Lang_chg, AppProvider, Mapprovider, validation, Font, Colors, windowWidth, consolepro, windowHeight } from './Provider/utilslib/Utils'
import Icon2 from 'react-native-vector-icons/Entypo';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Callout, Marker, Circle, PROVIDER_GOOGLE, } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import ScreenHeader from './components/ScreenHeader';
import { s, vs } from 'react-native-size-matters';
import BottomSheet from './components/BottomSheet';


export default class FindAddress extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    constructor(props) {

        super(props);
        this.state = {
            latitude: config.latitude,
            longitude: config.longitude,
            latdelta: '0.0922',
            longdelta: '0.0421',
            add_new_location: false,
            addressbar: false,
            addressbar2: false,
            addressselected: 'Search',
            address: '',
            title: '',
            location: '',
            description: '',
            distance: '',
            status: '',
            radius: 0,
            add_my_location: '',
            addressSheet: false,
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
        localStorage.setItemObject('latitude', latitude);
        localStorage.setItemObject('longitude', longitude);
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
                // consolepro.consolelog('getadddressfromlatlong', add_location)
                this.GooglePlacesRef && this.GooglePlacesRef.setAddressText(details.formatted_address)
                this.setState({ latdelta: event.latitudeDelta, longdelta: event.longitudeDelta, latitude: event.latitude, longitude: event.longitude, addressselected: details.formatted_address })
                this.setState({ add_my_location: data2 })
            })




    }
    update_adress = async () => {
        let user_details = await localStorage.getItemObject('user_arr')
        let user_id = user_details['user_id']
        let address_arr = await localStorage.getItemObject('address_arr')
        let url = config.baseURL + "api-patient-update-address";
        var data = new FormData();
        data.append('id', user_id)
        data.append('lat', this.state.latitude)
        data.append('long', this.state.longitude)
        data.append('address', address_arr)

        apifuntion.postApi(url, data, 1).then((obj) => {
            consolepro.consolelog("update_adress", obj)
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
        let user_id = user_details['user_id']

        let url = config.baseURL + "api-patient-profile";
        var data = new FormData();
        data.append('user_id', user_id)

        apifuntion.postApi(url, data, 1).then((obj) => {
            // consolepro.consolelog("getProfile", obj)
            if (obj.status == true) {
                // console.log('result', obj.result)

                let result = obj.result
                localStorage.setItemObject('user_arr', result);
                // this.props.navigation.navigate('Home')
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

            <View style={{ flex: 1, backgroundColor: Colors.White, }}>

                <ScreenHeader
                    title={Lang_chg.Find_Location[config.language]}
                    navigation={this.props.navigation}
                    onBackPress={() => this.props.navigation.pop()}
                    leftIcon
                    rightIcon
                />

                <View style={{ marginTop: vs(10), flex: 1, width: '100%' }}>

                    <GooglePlacesAutocomplete
                        placeholder='Search'
                        minLength={1}
                        selectionColor={'#fff'}
                        autoFocus={false}
                        returnKeyType={'search'}
                        listViewDisplayed={this.state.addressbar2}
                        fetchDetails={true}
                        textInputProps={{
                            backgroundColor: Colors.White,
                            borderWidth: 1,
                            borderColor: Colors.Border,
                            fontFamily: Font.Regular,
                            fontSize: Font.large,
                            alignSelf: 'center'
                        }}


                        //  ref={(instance) => { this.GooglePlacesRef = instance }}
                        renderDescription={row => row.description}
                        onPress={(data, details = null) => {
                            console.log('datalocation', details)
                            let city = 'unknown';
                            this.setState({ addressSheet: true })
                            for (let i = 0; i < details.address_components.length; i++) {
                                if (details.address_components[i].types[0] == "locality") {
                                    city = details.address_components[i].long_name
                                }
                            }
                            let data2 = { 'latitude': details.geometry.location.lat, 'longitude': details.geometry.location.lng, 'address': details.formatted_address, 'city': city }
                            add_location = data2
                            post_location = data2
                            // console.log('add_location', add_location)
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
                            // textInputContainer: {
                            //     backgroundColor: 'pink',
                            //     height: vs(40),
                            //     width:'100%',
                            //     alignItems: 'center',
                            //     justifyContent: 'center',
                            //     // paddingHorizontal:s(10)
                            // },
                            textInput: {
                                textAlign: config.textalign,
                                height: vs(40),
                                borderRadius: 10,
                                color: Colors.Black,
                                alignSelf: 'center',
                                marginLeft: '3%',
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
                            container: {
                                borderRadius: 10
                            },

                            listView: {
                                backgroundColor: Colors.White,
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

                <BottomSheet
                    visible={this.state.addressSheet}
                    onRequestClose={() => {
                        this.setState({ addressSheet: false })
                    }}
                    type={'addAddress'}
                />


            </View>


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
        fontFamily: Font.Regular,
        paddingVertical: windowWidth * 2 / 100
    },

    ImageView: {

        width: '15%',
        justifyContent: 'center',

    },


})