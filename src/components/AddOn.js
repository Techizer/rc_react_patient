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
    Dimensions,
    TouchableWithoutFeedback,
    Button,
    SafeAreaView
} from 'react-native';
import styles, { ThemeColors } from '../styles/main.style';
import singlerestostyle from '../styles/singleresto.style';
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
import { Platform } from 'react-native';

class AddOnScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: [],
            listData: [],
            isVisible: true,
            item: this.props.item,
            addOnList: this.props.attrData,
            selectedAddon: []
            // loginUserData: JSON.parse(global.loginUserData),
        };
        console.log(this.props.attrData);
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
        const { selectedAddon } = this.state
        var selectAddonName = ''
        var selectAddonPrice = 0
        var sep = ''
        if (selectedAddon.length > 0) {
            for (var i = 0; i < selectedAddon.length; i++) {
                selectAddonName = selectAddonName + sep + selectedAddon[i]?.name
                selectAddonPrice = parseFloat(selectAddonPrice) + parseFloat(selectedAddon[i]?.options_total)
                sep = ', '
            }

        }


        return (
            <Modal
                //propagateSwipe={50}
                animationType="fade"
                transparent={true}
                visible={true}
                //coverScreen={true}
                //presentationStyle={'overFullScreen'}
                onRequestClose={() => {
                }}>
                {/* <TouchableWithoutFeedback
                    onPress={() => this.props.closeAddOn()}
                > */}
                <SafeAreaView />
                <View style={{
                    flex: 1,
                    //justifyContent: 'flex-end',
                    backgroundColor: 'transparent',
                    //opacity: 0.5
                }}>
                    <TouchableOpacity
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: Dimen.width,
                            height: Dimen.height,
                            backgroundColor: 'black',
                            opacity: 0.8
                        }}
                        onPress={() => {
                            let item = this.state.item
                            this.props.closeAddOn(item)
                        }}
                    />
                    <TouchableOpacity
                        style={{
                            //alignSelf: 'flex-end',
                            position: "absolute",
                            right: 15,
                            top: 15,
                            zIndex: 1,
                            justifyContent: 'center',
                            alignContent: 'center',
                            textAlign: 'center',
                        }}
                        onPress={() => {
                            let item = this.state.item
                            this.props.closeAddOn(item)
                        }}>
                        <Image
                            source={require('../assets/images/close.png')}
                            style={{ width: 30, height: 30 }}
                        />

                    </TouchableOpacity>
                    <View style={{
                        justifyContent: 'flex-end',
                        // alignItems: 'center',
                        // backgroundColor: 'transparent',
                        height: Dimen.height,
                        // backgroundColor: 'red',
                    }}>
                        <View style={{
                            //justifyContent: 'flex-start',
                            height: Dimen.height - 70,
                            backgroundColor: 'white',
                            borderWidth: 1,
                            borderColor: 'lightgray',
                            borderStyle: 'solid',

                            borderRadius: 10,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.8,
                            shadowRadius: 2,
                            elevation: 1
                        }}>


                            <View style={{
                                height: 80,
                                backgroundColor: Color.greyColor2,
                                borderTopLeftRadius: 10,
                                borderTopRightRadius: 10,
                                padding: 20
                            }}>
                                <Text>Choose Addon of "{this.props.item?.name}"</Text>
                                <Text>£{this.props.item?.price}</Text>
                            </View>
                            <View style={{
                                height: Dimen.height - 275,
                                backgroundColor: 'white',
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                            }}>
                                <FlatList
                                    data={this.state.addOnList}
                                    keyExtractor={(item, index) => {
                                        return "key-" + item?.rproductID + index.toString();
                                    }}
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    //ListHeaderComponent={this.renderHeaderView.bind(this)}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <>
                                                <View style={{
                                                    marginBottom: 10
                                                }}>
                                                    <Text style={{
                                                        fontSize: 16,
                                                        fontWeight: 'bold'
                                                    }}>* {item?.name} ({item?.attvalue.length + '/' + item?.attvalue.length})</Text>
                                                </View>
                                                <View>
                                                    {
                                                        item?.attvalue.map((data, aindex) => {
                                                            return (
                                                                <View style={{
                                                                    marginTop: 15,

                                                                }}>

                                                                    <TouchableOpacity
                                                                        style={{
                                                                            flexDirection: 'row',
                                                                        }}
                                                                        onPress={() => {
                                                                            //Actions.pastorderscreen();
                                                                            if (data.isTap == true) {
                                                                                let addonArray = this.state.selectedAddon;
                                                                                let addonFilterdArray = addonArray.filter(el => el.attribute_value_id !== data?.valueID);
                                                                                console.log('addonFilterdArray:: ', addonFilterdArray);
                                                                                data.isTap = false
                                                                                this.setState({
                                                                                    addOnList: [...this.state.addOnList],
                                                                                    selectedAddon: addonFilterdArray
                                                                                }, () => {
                                                                                    console.log("selectedAddon:: ", this.state.selectedAddon);
                                                                                })
                                                                            } else {
                                                                                let arrSelectAddon = []
                                                                                let objSelectAddon = {
                                                                                    "attribute_id": item?.attributeID,
                                                                                    "attribute_name": item?.name,
                                                                                    "attribute_value_id": data?.valueID,
                                                                                    "name": data?.name,
                                                                                    "options_total": data?.price,
                                                                                }
                                                                                arrSelectAddon.push(objSelectAddon)
                                                                                data.isTap = true
                                                                                this.setState({
                                                                                    addOnList: [...this.state.addOnList],
                                                                                    selectedAddon: [...this.state.selectedAddon, ...arrSelectAddon]
                                                                                }, () => {
                                                                                    console.log("selectedAddon:: ", this.state.selectedAddon);
                                                                                })
                                                                            }
                                                                        }}
                                                                    >
                                                                        <View style={{ marginRight: 10 }}>
                                                                            <Image
                                                                                source={(data?.isTap) ? Images.clickcheckbox : Images.checkbox}
                                                                            />
                                                                        </View>

                                                                        <Text style={{
                                                                            fontSize: 12,
                                                                            paddingTop: 4
                                                                        }}>{data?.name} £{data?.price}</Text>
                                                                    </TouchableOpacity>
                                                                </View>
                                                            )
                                                        })

                                                    }

                                                </View>
                                            </>
                                        )
                                    }}
                                />
                            </View>
                            <View style={{
                                position: 'absolute',
                                bottom: (Platform.OS == 'ios') ? 30 : 0,
                                // left: 0,
                                height: 100,
                                width: Dimen.width,
                                borderTopWidth: 1,
                                borderColor: Color.grayDash
                                //backgroundColor: 'red',
                                // marginBottom: 40
                            }}>
                                <View style={{
                                    paddingLeft: 15,
                                    paddingBottom: 6,
                                    paddingRight: 15,
                                    paddingTop: 6
                                }}>
                                    <Text style={{
                                        fontSize: 10,
                                        color: Color.greyColor
                                    }}>{selectAddonName}</Text>
                                </View>
                                <View style={[{
                                    backgroundColor: Color.greenColor,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    padding: 10,
                                    width: Dimen.width - 25,
                                    alignSelf: 'center',
                                    borderRadius: 6
                                }]}>
                                    <View>
                                        <Text style={singlerestostyle.cartext}>Item Total £{(parseFloat(this.props.item?.price) + selectAddonPrice).toFixed(2)}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => {
                                        let item = this.state.item
                                        item.addOn = this.state.selectedAddon
                                        this.props.selectAddItemAddOn(item)
                                    }} >
                                        <Text style={singlerestostyle.cartext1}>ADD ITEM</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                {/* </TouchableWithoutFeedback> */}
            </Modal>
        );
    }
}

export default AddOnScreen;
