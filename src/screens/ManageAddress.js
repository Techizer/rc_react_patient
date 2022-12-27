import React, { Component, useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, TextInput, FlatList, } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Colors, Font, msgProvider, config, windowWidth, localStorage, consolepro, Lang_chg, apifuntion, ScreenHeader } from '../Provider/utilslib/Utils';
import { s, vs } from 'react-native-size-matters';
import { SvgXml } from 'react-native-svg';
import { Add, Address, Edit, Location } from '../Icons/Index';
import AddEditAddress from '../components/Add_Edit_Address';
import AddressContainer from '../components/AddressContainer';



const ManageAddress = ({ navigation }) => {

  const [addressSheet, setAddressSheet] = useState(false)
  const [addressList, setAddressList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  const [selectedAddress, setSelectedAddress] = useState(-1)
  const [defaultAddress, setDefaultAddress] = useState('')
  const [type, setType] = useState('addAddress')
  const [isLoading, setIsLoading] = useState(true)
  const [isEditable, setIsEditable] = useState(false)
  const isFocused = useIsFocused()
  const sheetRef = React.useRef(null);

  useEffect(() => {
    getAddresses()
  }, [isFocused])

  const getAddresses = async () => {
    let user_details = await localStorage.getItemObject('user_arr')
    let user_id = user_details['user_id']

    let url = config.baseURL + "api-patient-list-address";
    var data = new FormData();
    data.append('login_user_id', user_id)


    apifuntion.postApi(url, data, 1).then((obj) => {
      consolepro.consolelog("getAddresses-response...", obj)

      if (obj.status == true) {
        setTimeout(() => {
          setIsLoading(false)
          setAddressList(obj?.result)
        }, 250);
        for (const iterator of obj?.result) {
          if (iterator?.defult == '0') {
            setDefaultAddress(iterator?.id)
          }
        }
      }
      else {
        setAddressList([])
        // msgProvider.showError(obj.message)
        setIsLoading(false)
      }
    }).catch((error) => {
      setIsLoading(false)
      setAddressList([])
      msgProvider.showError(obj.message)
      consolepro.consolelog("getAddresses-error ------- " + error);
    });
  }




  return (

    <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>

      <ScreenHeader
        title={Lang_chg.Manage_Address[config.language]}
        navigation={navigation}
        onBackPress={() => navigation.pop()}
        leftIcon
      />

      {/* <SearchInput
          navigation={this.props.navigation}
          placeholder={Lang_chg.SearchLocation[config.language]}
        /> */}

      <View style={{ backgroundColor: Colors.White, marginTop: vs(7), paddingHorizontal: s(13), paddingVertical: vs(15) }}>

        <FlatList
          showsVerticalScrollIndicator={false}
          data={addressList}
          ListHeaderComponent={() => {
            return (
              <View
                style={{ flexDirection: 'row', width: '100%', alignSelf: 'center', paddingBottom: vs(20) }}>

                <View style={{ width: '9%' }} />
                <View style={{ width: '90%', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text
                    style={{
                      textAlign: config.textRotate,
                      fontSize: Font.medium,
                      fontFamily: Font.SemiBold,
                      color: Colors.darkText,
                    }}>{Lang_chg.Saved_Address[config.language]}</Text>

                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => {
                      // setIsBottomSheet(true)
                      // setType('addAddress')
                      navigation.navigate('FindAddress')
                    }}>
                    <SvgXml xml={Add} />
                    <Text
                      style={{
                        textAlign: config.textRotate,
                        fontSize: Font.xsmall,
                        fontFamily: Font.Medium,
                        color: Colors.Blue,
                        marginLeft: s(5)
                      }}>{Lang_chg.Add_New_Address[config.language]}</Text>
                  </TouchableOpacity>
                </View>
              </View>

            )
          }}
          renderItem={({ item, index }) => {
            return (
              <AddressContainer
                index={index}
                addressDetails={item}
                showModal={(val) => {
                  setAddressSheet(val)
                  // sheetRef.current.snapTo(0)
                }}
                navigation={navigation}
                selected={selectedAddress}
                selectedAddress={(val) => {
                  // console.log('..............', val);
                  setSelectedAddress(val)
                }}
                editable={(val) => {
                  setIsEditable(val)
                  setType('editAddress')
                }}
                isLoading={isLoading}
                defaultAdd={defaultAddress}


              />
            );
          }}
          contentContainerStyle={{ paddingBottom: addressList.length > 5 ? (windowWidth * 40) / 100 : 0 }}

        />
      </View>


      <AddEditAddress
        visible={addressSheet}
        onRequestClose={() => {
          setAddressSheet(false)
        }}
        addressDetails={addressList[selectedAddress]}
        type={'editAddress'}
        deletedAddress={(val) => {
          setAddressList(addressList.filter(item => {
            return item?.id != val
          }))
        }}
        length={addressList.length}
        editedAddress={(val) => {
          getAddresses()
          let newAddress = {
            lat: addressList[selectedAddress]?.lat,
            lng: addressList[selectedAddress]?.lng,
            address: addressList[selectedAddress]?.address,
          }
          localStorage.setItemObject("addressDetails", newAddress);
        }}
      />



    </View>
  );

}

export default ManageAddress;