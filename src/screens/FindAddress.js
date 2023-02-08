
import React, { Component, useEffect, useRef, useState } from 'react'
import { Platform, Text, View, Image, TouchableOpacity, ImageBackground, FlatList, Modal, ToastAndroid } from 'react-native'
import Geolocation from "react-native-geolocation-service";
import { msgProvider, Icons, config, LangProvider, Font, Colors, ScreenHeader } from '../Provider/Utils/Utils'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { s, vs } from 'react-native-size-matters';
import { request, check, PERMISSIONS, RESULTS } from "react-native-permissions";
import AddEditAddress from '../components/Add_Edit_Address';
import { useSelector } from 'react-redux';


const FindAddress = ({ navigation }) => {

    const { loggedInUserDetails, appLanguage,languageIndex } = useSelector(state => state.StorageReducer)

    let googlePlacesRef = useRef()

    const [addressData, setAddressData] = useState({
        latitude: '',
        longitude: '',
        latdelta: '',
        longdelta: '',
        address: '',
        type: '',
        addressBottomSheet: false,
        country: '',
    })
    const [isLoading, setIsLoading] = useState(false)


    const checkLocationPermission = () => {
        check(Platform.OS === 'ios' ? (PERMISSIONS.IOS.LOCATION_WHEN_IN_USE || PERMISSIONS.IOS.LOCATION_ALWAYS) : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
            .then((result) => {
                switch (result) {
                    case RESULTS.UNAVAILABLE:
                        console.log('This feature is not available (on this device / in this context)');
                        break;
                    case RESULTS.DENIED:
                        console.log('The permission has not been requested / is denied but requestable');
                        locationPermission()
                        break;
                    case RESULTS.LIMITED:
                        console.log('The permission is limited: some actions are possible');
                        break;
                    case RESULTS.GRANTED:
                        console.log('The permission is granted');
                        getCurrentLocation()
                        break;
                    case RESULTS.BLOCKED:
                        console.log('The permission is denied and not requestable anymore');
                        msgProvider.showError('Please grant location permission first')
                        break;
                }
            })
            .catch((error) => {
                console.log("locationPermission-error", error);
            });
    }

    const locationPermission = () => {
        request(Platform.OS === 'ios' ? (PERMISSIONS.IOS.LOCATION_WHEN_IN_USE || PERMISSIONS.IOS.LOCATION_ALWAYS) : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
            .then((result) => {
                switch (result) {
                    case RESULTS.UNAVAILABLE:
                        console.log('This feature is not available (on this device / in this context)');
                        break;
                    case RESULTS.DENIED:
                        console.log('The permission has not been requested / is denied but requestable');
                        break;
                    case RESULTS.LIMITED:
                        console.log('The permission is limited: some actions are possible');
                        break;
                    case RESULTS.GRANTED:
                        console.log('The permission is granted');
                        getCurrentLocation()
                        break;
                    case RESULTS.BLOCKED:
                        console.log('The permission is denied and not requestable anymore');
                        msgProvider.showError('Please grant location permission first')
                        break;
                }
            })
            .catch((error) => {
                console.log("locationPermission-error", error);
            });
    }

    const getCurrentLocation = async () => {
        try {
            Geolocation.getCurrentPosition(info => {
                // console.log('current location lat,long', info)
                getadddressfromlatlong(info)
            });
        } catch (err) {
            console.log('getCurrentLocation-error', err);
        }

    };


    const getadddressfromlatlong = (event) => {
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + event?.coords?.latitude + ',' + event?.coords?.longitude + '&key=' + config.mapkey + '&language=' + config.maplanguage)

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
                // console.log('address details........', responseJson);
                let data2 = { 'latitude': details.geometry.location.lat, 'longitude': details.geometry.location.lng, 'address': details.formatted_address, 'city': city, 'administrative_area_level_1': administrative_area_level_1 }
                add_location = data2
                post_location = data2
                // console.log('getadddressfromlatlong', add_location)
                googlePlacesRef && googlePlacesRef.setAddressText(details.formatted_address)
                setAddressData(prevState => ({
                    ...prevState,
                    latitude: event?.coords?.latitude,
                    longitude: event?.coords?.longitude,
                    address: details.formatted_address,
                    type: 'addAddress',
                    addressBottomSheet: true
                }))


                // this.setState({ latdelta: event.latitudeDelta, longdelta: event.longitudeDelta, latitude: event.latitude, longitude: event.longitude, addressselected: details.formatted_address })
                // this.setState({ add_my_location: data2 })
            })




    }


    return (

        <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor, }}>

            <ScreenHeader
                title={LangProvider.Find_Location[languageIndex]}
                navigation={navigation}
                onBackPress={() => navigation.pop()}
                leftIcon
            />
            {/* <View style={{ backgroundColor: Colors.White, marginTop: vs(7), paddingHorizontal: s(13), paddingVertical: vs(15) }}> */}

            <View style={{ marginTop: vs(7), paddingVertical: vs(9), flex: 1, width: '100%', backgroundColor: Colors.White }}>

                {/* -------------------Current Location---------------- */}
                <View style={{ paddingHorizontal: s(13), marginBottom: vs(7) }}>
                    <TouchableOpacity onPress={() => {
                        checkLocationPermission()
                    }} style={{ flexDirection: 'row', width: '100%', alignSelf: 'center' }}>
                        <View style={{ width: '9%' }}>
                            <Image
                                source={Icons.currentLoc}
                                style={{
                                    width: 18,
                                    height: 18,
                                }}></Image>
                        </View>
                        <View style={{ width: '91%', borderBottomWidth: 1, borderBottomColor: Colors.Border, paddingBottom: vs(12) }}>
                            <Text style={{ alignSelf: 'flex-start', fontSize: Font.medium, fontFamily: Font.SemiBold, color: Colors.darkText }}>{LangProvider.Currentlocation[languageIndex]}</Text>
                            <Text style={{ alignSelf: 'flex-start', fontSize: Font.small, fontFamily: Font.Regular, color: Colors.dullGrey, marginTop: vs(4) }}>{LangProvider.Using_gpsofyoudevice[languageIndex]}</Text>
                        </View>
                    </TouchableOpacity>
                </View>


                <GooglePlacesAutocomplete
                    placeholder='Search'
                    minLength={1}
                    selectionColor={'#fff'}
                    autoFocus={false}
                    returnKeyType={'search'}
                    // listViewDisplayed={this.state.addressbar2}
                    fetchDetails={true}
                    textInputProps={{
                        backgroundColor: Colors.White,
                        borderWidth: 1,
                        borderColor: Colors.Border,
                        fontFamily: Font.Regular,
                        fontSize: Font.large,
                        alignSelf: 'center'
                    }}

                    ref={ref => { googlePlacesRef = ref }}
                    renderDescription={row => row.description}
                    onPress={(data, details = null) => {
                        // console.log('datalocation', details)
                        let city = 'unknown';
                        // setAddressData(prevState => ({
                        //     ...prevState,
                        //     addressBottomSheet: true
                        // }))

                        // for (let i = 0; i < details.address_components.length; i++) {
                        //     if (details.address_components[i].types[0] == "locality") {
                        //         city = details.address_components[i].long_name
                        //     }
                        // }
                        let data2 = { 'latitude': details.geometry.location.lat, 'longitude': details.geometry.location.lng, 'address': details.formatted_address, 'city': city }
                        add_location = data2
                        post_location = data2

                        setAddressData(prevState => ({
                            ...prevState,
                            latitude: details?.geometry?.location?.lat,
                            longitude: details?.geometry?.location?.lng,
                            address: details.formatted_address,
                            type: 'addAddress',
                            addressBottomSheet: true
                        }))
                        // console.log('add_location', add_location)
                    }}
                    query={{

                        key: config.mapkey,
                        language: config.maplanguage,
                        components: `country:${loggedInUserDetails?.work_area === 'UAE' ? 'AE':'SA'}`

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
                            alignSelf: 'flex-start',
                            borderRadius: 10,
                            color: Colors.Black,
                            alignSelf: 'center',
                            marginHorizontal: '3%',
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
                // renderRightButton={() =>
                //  (
                //  <TouchableOpacity style={{ alignSelf: 'center', paddingRight: 10, }} onPress={() => { this.GooglePlacesRef.setAddressText(""); this.setState({ addressselected: 'search' }) }}>
                // </TouchableOpacity>
                // )}
                />


            </View>

            {/* </View> */}

            <AddEditAddress
                visible={addressData.addressBottomSheet}
                onRequestClose={(status) => {
                    setAddressData(prevState => ({
                        ...prevState,
                        addressBottomSheet: false,
                    }))

                    if (status) {
                        setTimeout(() => {
                            navigation.pop()
                        }, 450);
                    }
                }}
                addressDetails={addressData}
                type={addressData.type}
            />


        </View>


    )
}


export default FindAddress;