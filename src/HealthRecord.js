import React, { Component, useState } from 'react';
import { Text, PermissionsAndroid, View, ScrollView, StyleSheet, SafeAreaView, Image, TouchableOpacity, ImageBackground, TextInput, FlatList, Keyboard, TouchableHighlight } from 'react-native';
import { Colors, Font, windowHeight, Mapprovider, msgProvider, msgText, config, windowWidth, localStorage, Icons, consolepro, handleback, Lang_chg, apifuntion, msgTitle, deviceHeight, } from './Provider/utilslib/Utils';
import Geolocation from '@react-native-community/geolocation';
import Styles from './Styles';
import ScreenHeader from './components/ScreenHeader';
import SearchInput from './components/SearchInput';
import { s, vs } from 'react-native-size-matters';
import ManageAddressBottomSheet from './components/BottomSheet';
import { SvgXml } from 'react-native-svg';
import { Add, Address, Edit, Location } from './icons/SvgIcons/Index';
import BottomSheet from './components/BottomSheet';
import Member from './components/Member';





const HealthRecord = ({ navigation }) => {

  const [isBottomSheet, setIsBottomSheet] = useState(false)
  const [type, setType] = useState('')

  return (

    <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>

      <ScreenHeader
        title={Lang_chg.Manage_Members[config.language]}
        navigation={navigation}
        onBackPress={() => navigation.pop()}
        leftIcon
        rightIcon
      />



      <View style={{ backgroundColor: Colors.White, marginTop: vs(7), paddingHorizontal: s(11), paddingVertical: vs(15), }}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.Border, paddingBottom: vs(10), marginBottom: vs(10) }}>
          <Text
            style={{
              textAlign: config.textRotate,
              fontSize: Font.xsmall,
              fontFamily: Font.Medium,
              color: Colors.Blue,
            }}>{'MEMBERS (3)'}</Text>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => {
              setIsBottomSheet(true)
              setType('addMember')
            }}>
            <SvgXml xml={Add} />

            <Text
              style={{
                textAlign: config.textRotate,
                fontSize: Font.xsmall,
                fontFamily: Font.Medium,
                color: Colors.Blue,
                marginLeft: s(5)
              }}>{Lang_chg.Add_New_Member[config.language]}</Text>
          </TouchableOpacity>

        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={[1, 2, 3]}
          // contentContainerStyle={{ paddingBottom: vs(100) }}
          ListHeaderComponent={() => {
            return (
              <Member
                type={'mine'}
                showTitle
              />
            )
          }}
          renderItem={({ item, index }) => {
            return (
              <Member
                index={index}
                showTitle
                showModal={(val) => {
                  setIsBottomSheet(val)
                  setType('editMember')
                }}
              />
            );
          }}
        />
      </View>


      <BottomSheet
        visible={isBottomSheet}
        onRequestClose={() => {
          setIsBottomSheet(false)
        }}
        type={type}
      />

    </View>
  );

}

export default HealthRecord;
