import React from 'react';
import { StyleSheet, TouchableOpacity, Dimensions, View, Image, Text, ActivityIndicator, Modal, FlatList, TextInput, TouchableWithoutFeedback } from "react-native";
import { COUNTRY_LIST } from '../utils/countrycode';
import PropTypes from 'prop-types';
const { height, width } = Dimensions.get('window');
{/**
 ====Props====
 visible-(Boolean) - flag to visible the page loader.
 handleSelectedEvent-(function event) - the function in which it will provide the selected field as a prop.


 How to use :
 render(){
   <CountrySelector visible={true/false} handleSelectedEvent={handleSelectedEvent}/>
 }
*/}


export const CountrySelector = props => {
    const { visible, handleSelectedEvent } = props;
    const { selectorLayout, mainView, } = props;
    const List = COUNTRY_LIST

 

    // const search_txt_placeholder = "Search here.."
    const empty_msg_txt = "No result found."

   

    const handleItem = (data) => { handleSelectedEvent(data) }

    // const handleTypingTxt = (TypedText) => {
    //     setSearchTxt(TypedText)
    //     setCountryList(COUNTRY_LIST.filter((ele) => {
    //         if (ele.dialCode.includes(TypedText) || ele.name.toUpperCase().includes(TypedText.toUpperCase())) {
    //             return true
    //         }
    //     }))
    // }

    const renderCountries = ({ item, index }) => {
        const { dialCode, name, icon } = item;
        return (
            <TouchableOpacity style={[styles.countryItemLayout,]} onPress={() => handleItem(item)}>
                <View style={[styles.dialCodeLayout,]}>
                    <Text style={[styles.dialCodeTxt]}>{dialCode ? dialCode : "-"}</Text>
                </View>
                {/* <View style={[styles.countryNameLayout,]}>
                    <Text style={[styles.countryNameTxt]}>{name ? name : "-"}</Text>
                </View>
                <View style={[styles.countryImgLayout,]}>
                    <Image source={icon} style={styles.flagImg} resizeMode='contain' />
                </View> */}
            </TouchableOpacity>
        )
    }

    if (visible) {
        return (
            <Modal visible={visible} transparent animationType="none" {...props}>
                <View style={[styles.mainView, mainView]}>
                    <View style={[styles.selectorLayout, selectorLayout]}>
                        {/* <View style={[styles.searchInputLayout]}>
                            <TextInput
                                // ref={adr_textinput}
                                style={styles.searchInput}
                                placeholder={search_txt_placeholder}
                                maxLength={20}
                                onChangeText={(txt) => handleTypingTxt(txt)}
                                value={searchTxt}
                            />
                        </View> */}
                        {
                            List.length > 0 ?
                                <FlatList
                                    data={List}
                                    renderItem={renderCountries}
                                    keyboardShouldPersistTaps='handled'
                                    extraData={List}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                                :
                                <View style={[styles.emptyMsgLayout]}>
                                    <Text style={[styles.emptytxt]}>{empty_msg_txt}</Text>
                                </View>
                        }
                    </View>
                </View>
            </Modal>
        )
    } else {
        return null;
    }
}

CountrySelector.propTypes = {
    visible: PropTypes.bool,
    handleSelectedEvent: PropTypes.func,
};

const styles = StyleSheet.create({
    mainView: { justifyContent: 'center', alignItems: 'center', flex: 1 },
    // searchInputLayout: {
    //     backgroundColor: "lightgrey",
    //     borderRadius: 5,
    //     marginVertical: 5
    // },
    // searchInput: {
    //     padding: 10,
    //     fontSize: 18,
    // },
    selectorLayout: {
        backgroundColor: 'White',
        padding: 10,
        height: height * 0.8,
        width: width * 0.99,
        borderRadius: 5,
    },
    countryItemLayout: {
        // flexDirection: "row",
        backgroundColor: '#FF9933', //"#FF7900",
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginVertical: 3,
        justifyContent: 'center',
        shadowColor: 'black',
        borderRadius: 5,
        shadowOffset: { width: 2, height: 2 },
        shadowRadius: 5,
        shadowOpacity: 1,
        elevation: 9,
        color: "White"

    },
    dialCodeLayout: {
        width: "17%",
        justifyContent: 'center',

    },
    dialCodeTxt: {
        fontSize: 16,
        fontWeight: 'bold',
        color: "White"

    },
    countryNameLayout: {
        width: "71%",
        justifyContent: 'center',
        color: "White"

    },
    countryNameTxt: {
        fontSize: 16,
        color: "White"
    },
    countryImgLayout: {
        width: "12%",
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    flagImg: { height: 22, width: 38 },
    emptyMsgLayout: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptytxt: {
        fontSize: 14,
        color: "White"
    }
})
export default CountrySelector