import React, { Component, useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, TextInput, FlatList, } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Colors, Font, msgProvider, config, windowWidth, LangProvider, apifuntion, ScreenHeader } from '../Provider/Utils/Utils';
import { s, vs } from 'react-native-size-matters';
import { SvgXml } from 'react-native-svg';
import { Add } from '../Icons/Index';
import AddEditAddress from '../components/Add_Edit_Address';
import AddressContainer from '../components/AddressContainer';
import { useDispatch, useSelector } from 'react-redux';
import { Address } from '../Redux/Actions';
import NoInternet from '../components/NoInternet';



const ManageAddress = ({ navigation }) => {

  const { loggedInUserDetails, appLanguage, deviceConnection } = useSelector(state => state.StorageReducer)
  const dispatch = useDispatch()

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
    if (deviceConnection) {
      getAddresses()
    }
  }, [isFocused, deviceConnection])

  const getAddresses = async () => {
    let url = config.baseURL + "api-patient-list-address";
    var data = new FormData();
    data.append('login_user_id', loggedInUserDetails.user_id)


    apifuntion.postApi(url, data, 1).then((obj) => {
      // console.log("getAddresses-response...", obj)

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
      console.log("getAddresses-error ------- " + error);
    });
  }

  return (

    <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>

      <ScreenHeader
        title={LangProvider.Manage_Address[appLanguage == 'en' ? 0 : 1]}
        navigation={navigation}
        onBackPress={() => navigation.pop()}
        leftIcon
      />

      {/* <SearchInput
          navigation={this.props.navigation}
          placeholder={LangProvider.SearchLocation[config.language]}
        /> */}

      <View style={{ backgroundColor: Colors.White, marginTop: vs(7), paddingHorizontal: s(13), paddingVertical: vs(15) }}>

        <FlatList
          showsVerticalScrollIndicator={false}
          data={addressList}
          ListHeaderComponent={() => {
            return (
              <View
                style={{ flexDirection: 'row', width: '100%', alignSelf: 'center', paddingBottom: addressList.length > 0 ? vs(20) : 0 }}>

                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text
                    style={{
                      alignSelf: 'flex-start',
                      fontSize: Font.medium,
                      fontFamily: Font.SemiBold,
                      color: Colors.darkText,
                    }}>{LangProvider.Saved_Address[appLanguage == 'en' ? 0 : 1]}</Text>

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
                        fontSize: Font.xsmall,
                        fontFamily: Font.Medium,
                        color: Colors.Blue,
                        marginLeft: s(5)
                      }}>{LangProvider.Add_New_Address[appLanguage == 'en' ? 0 : 1]}</Text>
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
          // let newAddress = {
          //   latitude: addressList[selectedAddress]?.lat,
          //   longitude: addressList[selectedAddress]?.lng,
          //   address: addressList[selectedAddress]?.address,
          //   title: addressList[selectedAddress]?.title,
          // }
          // dispatch(Address(newAddress))
        }}
      />

      <NoInternet
        visible={!deviceConnection}
      />

    </View>
  );

}

export default ManageAddress;