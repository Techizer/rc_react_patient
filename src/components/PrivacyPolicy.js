/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-did-mount-set-state */
import React, { Component } from 'react';
import {
    Text,
    View,
    Modal,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
    Dimensions,
    ViewBase
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import styles, { ThemeColors } from '../styles/main.style';

import FlushMsg from '../utils/FlushMsg';
import { Apis } from '../utils/Apis';
import Loader from '../utils/Loader';
//import { Constants, Location, Permissions } from 'expo';
import { Images, Dimen, Fonts, Color } from '../utils'
import Styles from '../utils/CommonStyles';
import OrderService from '../services/OrderService';
import homestyle from '../styles/home.style';
import StateCityService from '../services/StateCityService';
import FooterListPagination from './FooterListPagination';
let ScreenHeight = Dimensions.get('window').height;

class PrivacyPolicyScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { 
        };
    }

    componentDidMount() {
        // this.getDeleType();
    }
    loaderShowHide = status => {
        this.setState({
            apiLoding: status,
        });
    };

    
     

    // renderFooter = () => {
    //     const { ended } = this.state;
    //     if (this.state.listData.length === 0 && ended)
    //         return (
    //             <View style={styles.PersonList}>
    //                 <Text
    //                     style={{
    //                         textAlign: 'center',
    //                     }}>
    //                     No Data Found
    //                 </Text>
    //             </View>
    //         );
    //     if (!this.state.loading) return null;
    //     return (
    //         <ActivityIndicator
    //             style={{ color: '#000', padding: 20 }}
    //             color="#001684"
    //         />
    //     );
    // };
    selectContact = item => {

        this.props.closeModal({
            ivrListVisible: false,
            showMsg: true,
            item: item,
        });
    };


    closeModalAction = () => {
        this.props.closeModal({
            ivrListVisible: false,
        });
    };



    loaderShowHide = status => {
        this.setState({
            apiLoader: status,
        });
    };

    /**
     * render() this the main function which used to display different view
     * and contain all view related information.
     */

    
    renderHeaderView = () => {
        return (
            <View
                style={{
                    backgroundColor: '#fff',
                    padding: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
               <Text>test</Text>
            </View>
        );
    };

    render() {
        const { enableScrollViewScroll } = this.state;

        return (
            <Modal
                propagateSwipe={50}
                animationType="slide"
                transparent={true}
                visible={true}
                coverScreen={true}
                onRequestClose={() => {
                }}>
                {/* <ScrollView
                    scrollEnabled={enableScrollViewScroll}
                    showsVerticalScrollIndicator={false}> */}
                   <TouchableOpacity
                            style={{
                                alignSelf: 'flex-end',
                                position: "absolute",
                                right: 18,
                                top: 18,
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
                <View style={{   
                    padding:20,
                    height:'100%',
                    backgroundColor:"#fff",
                    textAlign:'center'
                }}> 
                        <View style={{marginTop:30}}>
                            <Text style={{fontWeight:'bold', marginBottom:20, fontSize:20, textAlign:'center'}}>Privacy Policy</Text>
                        </View>
                        <View>
                            <Text>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual
                            form of a document or a typeface without relying on meaningful content. 
                            Lorem ipsum may be used as a placeholder before final copy is available.</Text>
                        </View> 
                </View>
                {/* </ScrollView> */}
            </Modal>
        );
    }
}

export default PrivacyPolicyScreen;
