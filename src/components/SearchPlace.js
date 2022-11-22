/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-did-mount-set-state */
import React, { Component } from 'react';
import {
    Text,
    View,
    Modal,
    TextInput,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Alert,
    Dimensions
} from 'react-native';

import styles, { ThemeColors } from '../styles/main.style';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import FlushMsg from '../utils/FlushMsg';
import { Apis } from '../utils/Apis';
import Loader from '../utils/Loader';
//import { Constants, Location, Permissions } from 'expo';
import { Images, Dimen, Fonts, Color } from '../utils'
import Styles from '../utils/CommonStyles';
import OrderService from '../services/OrderService';
import homestyle from '../styles/home.style';
import StateCityService from '../services/StateCityService';
let ScreenHeight = Dimensions.get('window').height;

class SearchPlaceScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: [],
            listData: [],
            isVisible: true,
            // loginUserData: JSON.parse(global.loginUserData),
        };
    }

    componentDidMount() {
        // this.locationRef.focus()
        setTimeout(() => this.locationRef.focus(), 100)
    }


    closeModalAction = () => {
        this.props.closeGooglePlace({
            ivrListVisible: false,
        });
    };

    /**
     * render() this the main function which used to display different view
     * and contain all view related information.
     */


    render() {

        return (
            <Modal
                propagateSwipe={50}
                animationType="fade"
                transparent={true}
                visible={true}
                coverScreen={true}
                onRequestClose={() => {
                }}>
                {/* <ScrollView
                    scrollEnabled={enableScrollViewScroll}
                    showsVerticalScrollIndicator={false}> */}
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <View style={{
                        margin: 0,
                        backgroundColor: ThemeColors.whiteColor,
                        borderRadius: 6,
                        padding: 15,
                        paddingTop: 40,
                        width: '100%',
                        height: ScreenHeight,
                        flex: 1
                    }}>
                        <TouchableOpacity
                            style={{
                                alignSelf: 'flex-end',
                                position: "relative",
                                right: 0,
                                top: 0,
                                zIndex: 1,
                                justifyContent: 'center',
                                alignContent: 'center',
                                textAlign: 'center',
                            }}
                            onPress={() => {
                                this.closeModalAction(false);
                            }}>
                            <Image
                                source={require('../assets/images/close.png')}
                                style={{ width: 30, height: 30 }}
                            />

                        </TouchableOpacity>

                        <View
                            style={{
                                flex: 1,
                                backgroundColor: '#fff',
                                padding: 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <GooglePlacesAutocomplete
                                ref={instance => {
                                    this.locationRef = instance;
                                }}
                                clearButtonMode={'while-editing'}
                                styles={[styles.formControl, {
                                    color: '#7C7C7C',
                                    //backgroundColor: 'red'
                                }]}
                                placeholder='Enter Postcode'
                                placeholderTextColor="#7C7C7C"
                                minLength={2}
                                autoFocus={true}
                                returnKeyType={'default'}
                                fetchDetails={true}
                                enablePoweredByContainer={false}
                                query={{
                                    key: 'AIzaSyDh_I54vPj40JriRJy4LBbS3zTBC41WXjk',//'AIzaSyAFnw06GvFjnUL-po_jmrQAwHyZ9trWO2Y',
                                    language: 'en',
                                    types: 'geocode', //<=== use this to only show country cities
                                    components: 'country:uk', //, <=== use this to restrict to country
                                }}
                                GooglePlacesDetailsQuery={{
                                    fields: 'formatted_address,geometry,address_components,types,adr_address,place_id,plus_code'
                                }}
                                textInputProps={{
                                    // ref: textInput => {

                                    //     if (this.props.autofocus) {
                                    //         textInput && textInput.focus();
                                    //     }
                                    //     if (this.state.showMap) {
                                    //         textInput && textInput.blur();
                                    //     }
                                    // },
                                    // ref: (textInput) => {
                                    //     setTimeout(() => textInput && textInput.focus(), 100);
                                    //   },
                                    placeholderTextColor: '#7C7C7C',
                                    backgroundColor: Color.greyApp,
                                    height: 40,
                                    fontFamily: Fonts.regular,
                                    fontSize: 14,
                                    //borderBottomWidth: 1,
                                    //borderBottomColor: "#7C7C7C",
                                    //borderBottomWidth: 0.5,
                                    //marginTop: 10
                                    color: Color.blackColor,
                                    // paddingRight:"20%"
                                }}
                                onFail={error => {
                                    //console.log('error ', error);
                                }}
                                onPress={(data, details = null) => {
                                    // 'details' is provided when fetchDetails = true
                                    console.log(data);
                                    console.log(details);
                                    this.setState(
                                        {
                                            latitude: details.geometry.location.lat,
                                            longitude: details.geometry.location.lng,
                                        },
                                        () => {
                                            // global.latitude = this.state.latitude;
                                            // global.longitude = this.state.longitude;
                                            console.log('latitude:: ', this.state.latitude)
                                            console.log('longitude:: ', this.state.longitude)

                                            // for (var i = 0; i < details.address_components.length; i++) {
                                            //     for (var j = 0; j < details.address_components[i].types.length; j++) {
                                            //       if (details.address_components[i].types[j] == "postal_code") {
                                            //         // document.getElementById('postal_code').innerHTML = details.address_components[i].long_name;
                                            //         console.log('details.address_components[i].long_name:: ', details.address_components[i].long_name)
                                            //       }
                                            //     }
                                            //   }
                                            // global.userAddress = data.description;
                                            // global.userLat = this.state.latitude;
                                            // global.userLong = this.state.longitude;
                                            this.props.selectGooglePlace({
                                                data,
                                                details,
                                                latitude: details.geometry.location.lat,
                                                longitude: details.geometry.location.lng,
                                            });
                                        },
                                    );
                                }}
                                styles={{
                                    textInputContainer: {
                                        width: '100%',
                                        // marginLeft: 5,

                                    },
                                    textInput: {
                                        color: Color.blackColor
                                        //lineHeight: 20,
                                        // fontSize: 14,
                                        // borderColor: '#f9fafe',
                                        // width: 50,
                                        //backgroundColor: 'green'
                                        //color: 'red', 
                                    },
                                    predefinedPlacesDescription: {
                                        color: '#000',
                                    },
                                    // listView: {
                                    //     position: 'absolute',
                                    //     top: 45,
                                    //     left: -10,
                                    //     width: Dimen.width - 30,
                                    //     height: 200,
                                    //     zIndex: 9999
                                    // },
                                    separator: {
                                        height: 0.5,
                                    },
                                    loader: {
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end',
                                        height: 20,
                                    },
                                }}
                            />
                        </View>
                    </View>
                </View>
                {/* </ScrollView> */}
            </Modal>
        );
    }
}

export default SearchPlaceScreen;
