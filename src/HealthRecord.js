import React, { Component, useState, useEffect } from 'react';
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

const HealthRecord = (props) => {

  const [isBottomSheet, setIsBottomSheet] = useState(false)
  const [type, setType] = useState('')
  const [memberCount, setMemberCount] = useState('')
  const [patientDetails, setPatientdetails] = useState([])
  const [memberdetails, setMemberdetails] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const propsData = props.route.params

  useEffect(() => {
    console.log("props:: ", props, props.navigation)
    getMember()
  }, []);

  getMember = async () => {
    // this.setState({
    //   isLoading: true
    // })
    setIsLoading(true)
    let url = config.baseURL + "api-patient-family-member";
    var data = new FormData();

    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];

    data.append("user_id", user_id);

    console.log("url::", url)
    consolepro.consolelog("get_Services-query-data......", data);
    apifuntion.postApi(url, data, 1).then((res) => {
      consolepro.consolelog("get_Services-response ", JSON.stringify(res));
      setIsLoading(false)
      if (res.status == true) {
        console.log('if');
        //setTimeout(() => {
        setMemberCount(res.result.member_count)
        setPatientdetails(res.result.patient_details)
        setMemberdetails(res.result.memebr_details)
        // this.setState({
        //   message: res.message,
        //   isLoading: false,
        //   member_count: res.result.member_count,
        //   patient_details: res.result.patient_details,
        //   memebr_details: res.result.memebr_details
        // });
        // }, 2000);

      } else {
        console.log('else');
        this.setState({
          message: res.message,
          isLoading: false,
          member_count: 0,
          patient_details: [],
          memebr_details: []
        });
      }
    })
      .catch((error) => {
        setIsLoading(false)
        consolepro.consolelog("-------- error ------- " + error);
      });
  };

  return (

    <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>

      <ScreenHeader
        title={Lang_chg.Manage_Members[config.language]}
        navigation={props.navigation}
        onBackPress={() => props.navigation.pop()}
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
            }}>{'MEMBERS (' + memberCount + ')'}</Text>
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
        {
          (patientDetails.length > 0) &&
          <FlatList
            showsVerticalScrollIndicator={false}
            data={memberdetails}
            // contentContainerStyle={{ paddingBottom: vs(100) }}
            ListHeaderComponent={() => {
              return (
                <Member
                  type={'mine'}
                  showTitle
                  patientDetails={patientDetails[0]}
                  navigation={props.navigation}
                  propsData={propsData}
                />
              )
            }}
            renderItem={({ item, index }) => {
              return (
                <Member
                  index={index}
                  showTitle
                  patientDetails={item}
                  propsData={propsData}
                  showModal={(val) => {
                    setIsBottomSheet(val)
                    setType('editMember')
                  }}
                  navigation={props.navigation}
                />
              );
            }}
          />
        }

      </View>


      <BottomSheet
        visible={isBottomSheet}
        onRequestClose={(result) => {
          setIsBottomSheet(false)
          console.log("result:: ", result.member_count)
          if (result.member_count != undefined) {
            setMemberCount(result.member_count)
            setPatientdetails(result.patient_details)
            setMemberdetails(result.memebr_details)
          }

        }}
        type={type}
      />

    </View>
  );

}

export default HealthRecord;
