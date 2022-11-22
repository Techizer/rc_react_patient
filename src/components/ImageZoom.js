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
import ImageZoom from 'react-native-image-pan-zoom';

class ImageZoomScreen extends Component {
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
        //setTimeout(() => this.locationRef.focus(), 100)
    }


    closeModalAction = () => {
        this.props.closeZoomImage({
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
                            <View style={{
                                position: "absolute",
                                //right: 0,
                                bottom: 0,
                                zIndex: 1,
                                //padding: 15,
                                //marginTop: 85,
                                width: '100%',
                            }}>
                                <Text style={{
                                    // backgroundColor: 'red',
                                    textAlign: 'left',
                                    fontSize: 16, fontFamily: Fonts.semibold,
                                }}>{this.props.item?.name}</Text>
                                <Text style={{
                                    // backgroundColor: 'red',
                                    textAlign: 'left',
                                    fontSize: 16, fontFamily: Fonts.semibold,
                                }}>£{this.props.item?.price}</Text>
                                <Text style={{
                                    // backgroundColor: 'red',
                                    textAlign: 'left',
                                    fontSize: 16, fontFamily: Fonts.semibold,
                                }}>{this.props.item?.short_description}</Text>
                            </View>

                            <ImageZoom cropWidth={Dimensions.get('window').width}
                                cropHeight={Dimensions.get('window').height}
                                imageWidth={200}
                                imageHeight={200}
                                maxScale={1.5}
                            >
                                <Image style={{ width: 200, height: 200 }}
                                    source={{
                                        uri: this.props.showImageUrl //'https://beta.multimultistores.com/backend/assets/img/costic/default-login.jpg'
                                    }} />
                            </ImageZoom>
                        </View>
                    </View>
                </View>
                {/* </ScrollView> */}
            </Modal>
        );
    }
}

export default ImageZoomScreen;
