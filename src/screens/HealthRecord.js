import React, { Component, useState, useEffect } from 'react';
import { Text, View, TouchableHighlight, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { Colors, Font, config, windowWidth, LangProvider, apifuntion, ScreenHeader, Button } from '../Provider/Utils/Utils';
import { s, vs } from 'react-native-size-matters';
import AddEditMembers from '../components/Add_Edit_Members'
import { Add } from '../Icons/Index';
import Member from '../components/Member';
import { useDispatch, useSelector } from 'react-redux';
import { SelectedProvider } from '../Redux/Actions';
import NoInternet from '../components/NoInternet';

const HealthRecord = (props) => {

  const { loggedInUserDetails, languageIndex, selectedProvider, deviceConnection } = useSelector(state => state.StorageReducer)
  const dispatch = useDispatch()
  const [isBottomSheet, setIsBottomSheet] = useState(false)
  const [type, setType] = useState('addMember')
  const [memberCount, setMemberCount] = useState(0)
  const [patientDetails, setPatientdetails] = useState([])
  const [memberdetails, setMemberdetails] = useState([])
  const [dummy, setDummy] = useState([1, 2, 3, 4, 5, 6, 7])
  const [selectedMember, setSelectedMember] = useState(-1)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditable, setIsEditable] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const insets = useSafeAreaInsets()

  useEffect(() => {
    // console.log("selectedProvider:: ", selectedProvider)
    if (deviceConnection) {
      getMember()
    }
  }, [deviceConnection]);

  useEffect(() => {
    // console.log("selectedProvider:: ", selectedProvider)
    if (deviceConnection && isRefreshing) {
      getMember()
    }
  }, [deviceConnection, isRefreshing]);

  const getMember = async () => {
    let url = config.baseURL + "api-patient-family-member";
    var data = new FormData();

    data.append("user_id", loggedInUserDetails?.user_id);

    // console.log("get_Services-query-data......", data);
    apifuntion.postApi(url, data, 1).then((res) => {
      // console.log("getMembers-response ", res);

      if (res.status == true) {
        setMemberCount(res.result.member_count)
        setPatientdetails(res.result.patient_details)
        setMemberdetails(res.result.memebr_details)

      }
    }).catch((error) => {
      setMemberdetails([])
      console.log("getMember-error ------- " + error);
    }).finally(() => {
      setIsLoading(false)
      setIsRefreshing(false),
        setDummy([])
    })
  };

  return (

    <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor, paddingBottom: insets.bottom }}>

      <ScreenHeader
        title={(selectedProvider != null && (selectedProvider?.currentScreen == "providerList" || selectedProvider.currentScreen == 'providerDetails')) ? LangProvider.Select_Member[languageIndex] : LangProvider.Manage_Members[languageIndex]}
        navigation={props.navigation}
        onBackPress={() => props.navigation.pop()}
        leftIcon
      />

      <View style={{ backgroundColor: Colors.White, marginTop: vs(7), paddingHorizontal: s(11), paddingVertical: vs(9), }}>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.Border, paddingBottom: vs(10), marginBottom: vs(10) }}>
          <Text
            style={{

              fontSize: Font.xsmall,
              fontFamily: Font.Medium,
              color: Colors.Blue,
            }}>{`${LangProvider.Members[languageIndex]} (${memberCount})`}</Text>

          {
            selectedProvider == null &&
            <TouchableOpacity
              underlayColor={Colors.Highlight}
              style={{ flexDirection: 'row', alignItems: 'center', height: (windowWidth * 7) / 100, }}
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
                }}>{LangProvider.Add_New_Member[languageIndex]}</Text>
            </TouchableOpacity>
          }

        </View>
        {

          <FlatList
            onLayout={(event) => {
              var { x, y, width, height } = event.nativeEvent.layout;

            }}
            showsVerticalScrollIndicator={false}
            data={isLoading ? dummy : memberdetails}
            ListHeaderComponent={() => {
              return (
                <Member
                  type={'mine'}
                  patientDetails={patientDetails[0]}
                  navigation={props.navigation}
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
            refreshing={isRefreshing}
            onRefresh={() => {
              if (!isLoading) {
                setMemberCount(0)
                setIsLoading(true)
                setIsRefreshing(true)
                setDummy([1, 2, 3, 4, 5, 6, 7])
              }
            }}
            contentContainerStyle={{ paddingBottom: (memberdetails.length > 6 )? (windowWidth * 50) / 100 : 0 }}
          />
        }



      </View>

      {
        (selectedProvider != null && (selectedProvider?.currentScreen == "providerList" || selectedProvider?.currentScreen == 'providerDetails') && !isLoading) &&
        <View
          style={{
            width: "100%",
            position: 'absolute',
            bottom: 0,
            paddingHorizontal: s(13),
            backgroundColor: Colors.White,
            paddingTop: (windowWidth * 2) / 100,
            paddingBottom: Platform.OS == 'ios' ? insets.bottom - 15 : (windowWidth * 2) / 100,
            alignItems: "center",
            borderTopWidth: 1,
            borderTopColor: Colors.Border,
          }}>
          <Button
            text={LangProvider.Continue_Booking[languageIndex]}
            onPress={() => {
              dispatch(SelectedProvider({
                ...selectedProvider,
                family_member_id: selectedMember === -1 ? 0 : memberdetails[selectedMember]?.id,
              }))
              setTimeout(() => {
                props.navigation.navigate("BookingIndex")
              }, 450);
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
