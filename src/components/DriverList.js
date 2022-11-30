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

import FlushMsg from '../utils/FlushMsg';
import { Apis } from '../utils/Apis';
import Loader from '../utils/Loader';
import { FooterListPagination } from '../components'
import { Images, Dimen, Fonts, Color } from '../utils'
import Styles from '../utils/CommonStyles';
import OrderService from '../services/OrderService';
import homestyle from '../styles/home.style';
import VendorDriverService from '../services/VendorDriverService';
let ScreenHeight = Dimensions.get('window').height;

class DriverListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: [],
            listData: [],
            isVisible: true,
            loginUserData: JSON.parse(global.loginUserData),
            apiLoding: false,
            loading: true,
            ended: false,
            searchText: '',
            enableScrollViewScroll: true,
            selectItem: props.selectItem,
            selectIndex: props.selectIndex,
        };
    }

    componentDidMount() {
        this.allDriverListApi();
    }
    loaderShowHide = status => {
        this.setState({
            apiLoding: status,
        });
    };
    allDriverListApi = (loadingApi) => {
        this.loaderShowHide(loadingApi);
        var myData = {
            "storeID": this.props.selectItem?.storeID,
        };
        console.log(myData)
        VendorDriverService.getStoreDriverList(myData).then(
            function (result) {


                console.log('Your data: ' + JSON.stringify(result));
                this.loaderShowHide(false);
                if (result.status) {
                    if (result.data.length > 0) {
                        this.setState({
                            listData: [...this.state.listData, ...result.data],
                            totalCount: result.data.totalcount,
                            loading: false,
                            ended: false,
                        },
                            () => {
                                console.log('listData: ', this.state.listData);
                                this.arrayholder = this.state.listData;
                                global.countryList = this.arrayholder;
                                console.log("list", this.arrayholder)
                            },
                        )
                    } else {
                        this.setState({
                            listData: [...this.state.listData, ...result.data],
                            totalCount: result.data.totalcount,
                            loading: false,
                            ended: true,
                        },
                        () => {
                            console.log('listData: ', this.state.listData);
                            this.arrayholder = this.state.listData;
                            global.countryList = this.arrayholder;
                            console.log("list", this.arrayholder)
                        })
                    }
                } else {
                    //FlushMsg.showError(result.message);
                }
                console.log('result:: ', result)
            }.bind(this),
            function (result) {
                console.log('result:: ', result)
                //console.log('There was an error fetching the time');
                this.loaderShowHide(false);
                FlushMsg.showError(result.message);
            }.bind(this)
        )

    };


    renderFooter = () => {
        const { ended } = this.state;
        if (this.state.listData.length === 0 && ended)
            return (
                <View style={styles.PersonList}>
                    <Text
                        style={{
                            textAlign: 'center',
                        }}>
                        No Data Found
                    </Text>
                </View>
            );
        if (!this.state.loading) return null;
        return (
            <ActivityIndicator
                style={{ color: '#000', padding: 20 }}
                color="#001684"
            />
        );
    };
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

    handleSearch = text => {
        const newData = this.arrayholder.filter(item => {

            const itemData = `${item.city_name.toUpperCase()}`;

            const textData = text.toUpperCase();
            //console.log(itemData)
            return itemData.indexOf(textData) > -1;
        });

        this.setState({ listData: newData });
    };
    onEnableScroll = value => {
        this.setState({
            enableScrollViewScroll: value,
        });
    };
    renderHeaderView = () => {
        return (
            <View
                style={{
                    backgroundColor: '#fff',
                    padding: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    clearButtonMode="always"
                    value={this.state.searchText}
                    onChangeText={queryText => {
                        //console.log('queryText: ', queryText);
                        this.setState(
                            {
                                searchText: queryText,
                            },
                            () => {
                                this.handleSearch(queryText);
                            },
                        );
                    }}
                    placeholder={'search by City name'}
                    DarkGrey="#000"
                    style={{
                        //backgroundColor: 'red',
                        width: '100%',
                        height: 40,
                        paddingHorizontal: 20,
                        borderRadius: 25,
                        borderColor: '#0253B3',
                        borderWidth: 1,
                        backgroundColor: '#fff',
                    }}
                />
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
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    {/* <Loader loading={this.state.apiLoader} /> */}

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
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <Text style={{
                                // backgroundColor: 'red',
                                width: '90%',
                                textAlign: 'center',
                                paddingLeft: 30,
                                fontSize: 18
                            }}>Choose Driver</Text>
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
                        </View>


                        <View
                            style={{
                                //flex: 1,
                                backgroundColor: '#fff',
                                padding: 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <TextInput
                                autoCapitalize="none"
                                autoCorrect={false}
                                clearButtonMode="always"
                                value={this.state.searchText}
                                onChangeText={queryText => {
                                    this.setState(
                                        {
                                            searchText: queryText,
                                        },
                                        () => {
                                            this.handleSearch(queryText);
                                        },
                                    );
                                }}
                                placeholder="Search by driver name"
                                DarkGrey="#000"
                                style={{
                                    color: '#000',
                                    width: '100%',
                                    height: 40,
                                    paddingHorizontal: 20,
                                    borderRadius: 25,
                                    borderColor: '#0253B3',
                                    borderWidth: 1,
                                    backgroundColor: '#fff',
                                }}
                            />
                        </View>
                        <View>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                style={{
                                    marginBottom: 80
                                }}
                                onTouchStart={() => {
                                    this.onEnableScroll(false);
                                }}
                                onMomentumScrollEnd={() => {
                                    this.onEnableScroll(true);
                                }}
                                data={this.state.listData}
                                //ListHeaderComponent={this.renderHeaderView.bind(this)}
                                renderItem={({ item }) => {
                                    // var ivrTitle = item;

                                    return (

                                        <View
                                            style={{
                                                overflow: 'scroll', flexDirection: 'row',
                                                justifyContent: 'space-around',
                                                borderRadius: 10,
                                                marginTop: 5,
                                                marginBottom: 10,
                                                backgroundColor: Color.grayDash, //ThemeColors.LightgreenColor,
                                                shadowColor: ThemeColors.blackColor,
                                                shadowOpacity: 0.23,
                                                shadowRadius: 2.62,
                                                elevation: 4,
                                                shadowOffset: { height: 2, width: 0 },
                                            }}>
                                            <TouchableOpacity
                                                style={{
                                                    width: '100%',
                                                }}
                                                onPress={() => {
                                                    this.selectContact(item);
                                                }}>
                                                <View
                                                    style={[
                                                        {
                                                            width: '100%',
                                                        },
                                                    ]}>
                                                    <View
                                                        style={
                                                            {
                                                                width: '100%',
                                                                flexDirection: 'row',
                                                                // borderBottomWidth: 0.5,
                                                                // borderBottomColor: "grey",
                                                                padding: 15
                                                            }
                                                        }>
                                                        <Text
                                                            style={

                                                                {
                                                                    fontSize: 18,
                                                                    color: ThemeColors.blackColor,
                                                                    marginRight: 25,
                                                                    marginLeft: 4,
                                                                }
                                                            }>
                                                            {item.name}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                }}
                                //Setting the number of column
                                // ListFooterComponent={this.renderFooter.bind(this)}
                                ListFooterComponent={<FooterListPagination
                                    listDataLength={this.state.listData.length}
                                    ended={this.state.ended}
                                    removeItem={this.state.removeItem}
                                    loading={this.state.loading}
                                />}
                                numColumns={1}
                                keyExtractor={(item, index) => {
                                    return 'key-' + index.toString();
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

export default DriverListScreen;
