/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-did-mount-set-state */
import React, { Component } from 'react';
import {
    Text,
    View,
    Modal,
    TouchableOpacity,
    ScrollView,
    Alert,
    Dimensions
} from 'react-native';
import { Actions } from 'react-native-router-flux';

class TermsConditionScreen extends Component {
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
                        onPress={() => {
                            Actions.pop();
                        }} 
                        style={{position:'absolute', right:10, top:10, zIndex:3,
                        width:25, height:25, backgroundColor:'#FF9933', padding:5,flexDirection:'row', justifyContent:'center'
                                        
                        }}><Text style={{fontSize:18, lineHeight:20, color:"#fff"}}>x</Text></TouchableOpacity>
                <View style={{
                    flex: 1,
                    justifyContent: "center", 
                    padding:20,
                    alignSelf:'flex-start',
                    alignItems:'flex-start', 
                    flexDirection:'row'
                }}>
                    {/* <Loader loading={this.state.apiLoader} /> */}

                    <Text>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual
                         form of a document or a typeface without relying on meaningful content. 
                        Lorem ipsum may be used as a placeholder before final copy is available.</Text>
                </View>
                {/* </ScrollView> */}
            </Modal>
        );
    }
}

export default TermsConditionScreen;
