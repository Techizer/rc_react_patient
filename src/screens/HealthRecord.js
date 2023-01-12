import React, { Component, useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { Colors, Font, config, windowWidth, Lang_chg, apifuntion, ScreenHeader, Button } from '../Provider/utilslib/Utils';
import { s, vs } from 'react-native-size-matters';
import AddEditMembers from '../components/Add_Edit_Members'
import { Add } from '../Icons/Index';
import Member from '../components/Member';
import { useSelector } from 'react-redux';

const HealthRecord = (props) => {

  const { loggedInUserDetails, appLanguage } = useSelector(state => state.StorageReducer)

  const [isBottomSheet, setIsBottomSheet] = useState(false)
  const [type, setType] = useState('addMember')
  const [memberCount, setMemberCount] = useState(0)
  const [patientDetails, setPatientdetails] = useState([])
  const [memberdetails, setMemberdetails] = useState([1, 2, 3, 4, 5, 6])
  const [selectedMember, setSelectedMember] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const [isEditable, setIsEditable] = useState(false)
  const insets = useSafeAreaInsets()
  const propsData = props.route.params

  useEffect(() => {
    // console.log("props:: ", propsData.indexPosition)
    getMember()
  }, []);

  const getMember = async () => {

    setIsLoading(true)
    let url = config.baseURL + "api-patient-family-member";
    var data = new FormData();

    data.append("user_id", loggedInUserDetails.user_id);

    // console.log("get_Services-query-data......", data);
    apifuntion.postApi(url, data, 1).then((res) => {
      console.log("getMembers-response ", res);
      setIsLoading(false)
      if (res.status == true) {
        setMemberCount(res.result.member_count)
        setPatientdetails(res.result.patient_details)
        setMemberdetails(res.result.memebr_details)

      }
    })
      .catch((error) => {
        setMemberdetails([])
        setIsLoading(false)
        console.log("getMember-error ------- " + error);
      });
  };

  return (

    <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor, paddingBottom: insets.bottom }}>

      <ScreenHeader
        title={(propsData.isPage == "providerList" || propsData.isPage == 'providerDetails') ? Lang_chg.Select_Member[appLanguage == 'en' ? 0 : 1] : Lang_chg.Manage_Members[appLanguage == 'en' ? 0 : 1]}
        navigation={props.navigation}
        onBackPress={() => props.navigation.pop()}
        leftIcon
      />

      <View style={{ backgroundColor: Colors.White, marginTop: vs(7), paddingHorizontal: s(11), paddingVertical: vs(15), }}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.Border, paddingBottom: vs(10), marginBottom: vs(10) }}>
          <Text
            style={{
              
              fontSize: Font.xsmall,
              fontFamily: Font.Medium,
              color: Colors.Blue,
            }}>{'MEMBERS (' + memberCount + ')'}</Text>

          {
            (propsData.isPage != "providerList" && propsData.isPage != 'providerDetails') &&
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => {
                setIsBottomSheet(true)
                setType('addMember')
              }}>
              <SvgXml xml={Add} />
              <Text
                style={{
                 
                  fontSize: Font.xsmall,
                  fontFamily: Font.Medium,
                  color: Colors.Blue,
                  marginLeft: s(5)
                }}>{Lang_chg.Add_New_Member[appLanguage == 'en' ? 0 : 1]}</Text>
            </TouchableOpacity>
          }

        </View>
        {

          <FlatList
            showsVerticalScrollIndicator={false}
            data={memberdetails}
            ListHeaderComponent={() => {
              return (
                <Member
                  type={'mine'}
                  patientDetails={patientDetails[0]}
                  navigation={props.navigation}
                  propsData={propsData}
                  selected={selectedMember}
                  selectedMember={(val) => {
                    setSelectedMember(val)
                  }}
                  isLoading={isLoading}
                />
              )
            }}
            renderItem={({ item, index }) => {
              return (
                <Member
                  index={index}
                  patientDetails={item}
                  propsData={propsData}
                  showModal={(val) => {
                    setIsBottomSheet(val)
                  }}
                  navigation={props.navigation}
                  selected={selectedMember}
                  selectedMember={(val) => {
                    // console.log('..............',val);
                    setSelectedMember(val)
                  }}
                  editable={(val) => {
                    setIsEditable(val)
                    setType('editMember')
                  }}
                  isLoading={isLoading}
                />
              );
            }}
          // contentContainerStyle={{ paddingBottom: memberdetails.length > 5 ? (windowWidth * 40) / 100 : 0 }}
          />
        }



      </View>

      {
        ((propsData.isPage == "providerList" || propsData.isPage == 'providerDetails') && !isLoading) &&
        <View
          style={{
            width: "100%",
            alignSelf: "center",
            backgroundColor: Colors.White,
            paddingHorizontal: (windowWidth * 5) / 100,
            paddingVertical: (windowWidth * 2) / 100,
            height: 80,
            justifyContent: "center",
            alignItems: "center",
            position: 'absolute',
            bottom: 0
          }}>
          <Button
            text={Lang_chg.Continue_Booking[appLanguage == 'en' ? 0 : 1]}
            onPress={() => {
              if (propsData && (propsData.isPage == "providerList" || propsData.isPage == 'providerDetails')) {
                props.navigation.navigate("Booking", {
                  providerType: propsData?.providerType,
                  providerId: propsData?.providerId,
                  family_member_id: selectedMember === -1 ? 0 : memberdetails[selectedMember]?.id,
                  isFromHospital: propsData?.isFromHospital,
                  hospitalId: propsData?.hospitalId,
                  display: propsData?.display,
                  indexPosition: propsData.indexPosition
                })
              }

              // console.log('....................' + propsData?.providerType);
              // console.log('....................' + propsData?.providerId);
              // console.log('....................', selectedMember === -1 ? memberdetails[0]?.patient_id : memberdetails[0]?.id);

            }} />
        </View>
      }

      <AddEditMembers
        visible={isBottomSheet}
        onRequestClose={(result) => {
          setIsBottomSheet(false)
          if (result && result.member_count != undefined) {
            setMemberCount(result.member_count)
            setPatientdetails(result.patient_details)
            setMemberdetails(result.memebr_details)
          }

        }}
        type={type}
        changeType={(type) => {
          setType(type)
          setIsEditable(true)
        }}
        isEditable={isEditable}
        selectedPatient={type === 'addMember' ? undefined : memberdetails[selectedMember]}
        deletedMember={(val) => {
          setMemberdetails(memberdetails.filter(item => {
            return item?.id != val
          }))
          setMemberCount(memberCount - 1)
        }}
        editMemberDetails={(details) => {
          console.log('........................', details);
          let newDetails = memberdetails
          let newObj = {
            'age': details.age,
            "appointment_count": details.appointment_count,
            "dc_count": details.dc_count,
            "gender": details.gender,
            "id": details.id,
            "image": details.image,
            "lab_count": details.lab_count,
            "name": details.name,
            "patient_id": details.patient_id
          }
          newDetails[selectedMember] = newObj
          setMemberdetails(newDetails)
        }}
      />

    </View>
  );

}

export default HealthRecord;
