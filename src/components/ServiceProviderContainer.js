import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Keyboard,
  Modal,
  ScrollView,
} from "react-native";
import {
  Colors,
  Font,
  config,
  windowWidth,
  localStorage,
  consolepro,
  Lang_chg,
  apifuntion,
} from "../Provider/utilslib/Utils";
import { vs, s } from "react-native-size-matters";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { SvgXml } from "react-native-svg";
import { dummyUser, Star, Location, Clock, Capsule } from "../icons/SvgIcons/Index";


const ServiceProviderContainer = ({
  Item,
  navigation,
  isLoading,
  providerType,
  Index
}) => {
  return (


    isLoading ?
      <View style={{
        height: vs(160),
        width: windowWidth,
        backgroundColor: Colors.White,
        alignItems: "center",
        marginTop: vs(7),
        paddingVertical: vs(8)
      }}>

        <View
          style={{
            width: "100%",
            height: '79%',
            flexDirection: "row",
            alignSelf: "center",
            paddingHorizontal: s(11)
          }}
        >
          <View style={{ width: "40%" }}>
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item width={s(95)} height={s(95)} borderRadius={s(90)} />
            </SkeletonPlaceholder>

            <View style={{ width: '90%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: vs(9) }}>

              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item width={s(30)} height={s(12)} borderRadius={s(4)} />
              </SkeletonPlaceholder>

              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item width={s(70)} height={s(12)} borderRadius={s(4)} />
              </SkeletonPlaceholder>

            </View>
          </View>

          <View
            style={{
              width: "60%",
              height: '100%',
            }}>

            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item width={s(90)} height={s(12)} borderRadius={s(4)} />
            </SkeletonPlaceholder>

            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item width={s(90)} height={s(12)} borderRadius={s(4)} marginTop={vs(4)} />
            </SkeletonPlaceholder>

            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item width={s(100)} height={s(12)} borderRadius={s(4)} marginTop={vs(3)} />
            </SkeletonPlaceholder>

            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item width={s(100)} height={s(12)} borderRadius={s(4)} marginTop={vs(15)} />
            </SkeletonPlaceholder>

            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item width={s(130)} height={s(12)} borderRadius={s(4)} marginTop={vs(6)} />
            </SkeletonPlaceholder>
          </View>

        </View>

        <View style={{ width: '100%', height: '4%', }}>
          <View style={{ width: '100%', height: 1.5, backgroundColor: Colors.backgroundcolor }}></View>
        </View>
        <View
          style={{
            width: "100%",
            height: '17%',
            alignItems: "center",
            flexDirection: "row",
            justifyContent: 'space-between',
            paddingHorizontal: s(11),
          }}>

          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item width={s(80)} height={s(12)} borderRadius={s(4)} marginTop={vs(6)} />
          </SkeletonPlaceholder>

          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item width={s(100)} height={s(24)} borderRadius={s(4)} marginTop={vs(6)} />
          </SkeletonPlaceholder>
        </View>

      </View>
      :
      (
        <View style={{
          // height: vs(160),
          width: windowWidth,
          backgroundColor: Colors.White,
          alignItems: "center",
          marginTop: vs(7),
          paddingVertical: vs(8)
        }}>

          {/* ----------Info Container--------- */}

          <View
          key={Index}
            style={{
              width: "100%",
              // height: '79%',
              flexDirection: "row",
              alignSelf: "center",
              paddingHorizontal: s(11),
            }}>
            <View style={{ width: "40%" }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(
                    "ServiceProviderDetails",
                    {
                      providerType: providerType,
                      providerId: Item.user_id,
                      isFromHospital: false,
                      hospitalId: Item?.hospital_id,
                    }
                  );
                }}
                style={{ width: "100%" }}
              >
                {
                  (Item.image == "NA" || Item.image == null || Item.image == "") ?
                    <SvgXml xml={dummyUser} height={s(95)} width={s(95)} style={{ borderColor: Colors.Border, marginLeft: s(5) }} />
                    :
                    <Image
                      source={{ uri: config.img_url3 + Item.image }}
                      style={{
                        borderWidth: 2,
                        borderColor: Colors.Border,
                        width: s(95),
                        height: s(95),
                        borderRadius: s(95),
                        marginLeft: s(5)
                      }}
                    />
                }
              </TouchableOpacity>

              <View style={{ width: '90%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: vs(9) }}>

                <View
                  style={{
                    width: "36%",
                    justifyContent: 'center',
                    paddingHorizontal: s(5),
                    backgroundColor: Colors.Green,
                    flexDirection: "row",
                    // paddingHorizontal: (windowWidth * 1.5) / 100,
                    paddingVertical: (windowWidth * 0.5) / 100,
                    borderRadius: 4,
                    alignItems: "center",
                  }}
                >
                  <SvgXml xml={Star} height={vs(10)} width={s(10)} />
                  <Text
                    style={{
                      fontFamily: Font.Regular,
                      fontSize: Font.small,
                      color: Colors.White,
                      marginLeft: s(5)
                    }}
                  >
                    {`${Item?.avg_rating}.0`}
                  </Text>
                </View>

                <Text
                  style={{
                    fontFamily: Font.Regular,
                    fontSize: Font.small,
                    color: Colors.darkText,
                  }}>
                  {Item?.booking_count}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: "60%",
                height: '100%',
              }}>

              <Text
                numberOfLines={1}
                style={{
                  fontFamily: Font.Medium,
                  fontSize: Font.large,
                  textAlign: config.textRotate,
                  color: Colors.darkText,
                  width: '80%'
                }}>

                {Item.provider_name}
              </Text>

              {
                providerType === 'lab' &&
                <View style={{ flexDirection: 'row', marginTop: vs(5), alignItems:'center' }}>
                  <SvgXml xml={Capsule} height={vs(18)} width={s(55)} />
                  <Text
                    style={{
                      fontFamily: Font.Regular,
                      color: Colors.Blue,
                      fontSize: Font.small,
                      textAlign: config.textRotate,
                      paddingHorizontal: vs(8)
                    }}
                  >
                    {Item?.iso_certificate}
                  </Text>
                </View>
              }

              {
                ((providerType === 'doctor' || providerType === 'lab') && Item.hospital_name != '') &&
                <Text
                  style={{
                    fontFamily: Font.Bold,
                    color: Colors.Blue,
                    fontSize: Font.small,
                    textAlign: config.textRotate,
                    marginTop: vs(3)
                  }}
                >
                  {Item.hospital_name}
                </Text>
              }

              {
                providerType != 'lab' &&
                <Text
                  style={{
                    fontFamily: Font.Bold,
                    color: Colors.DarkGrey,
                    fontSize: Font.small,
                    textAlign: config.textRotate,
                    marginTop: vs(3)
                  }}
                >
                  {Item.speciality}
                </Text>
              }

              {
                providerType != 'lab' &&
                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    style={{
                      fontFamily: Font.Medium,
                      color: Colors.DarkGrey,
                      fontSize: Font.small,
                      textAlign: config.textRotate,
                      marginTop: vs(2)
                    }}
                  >
                    {Item.experience}
                  </Text>

                  <Text style={{ fontSize: 3.5, marginTop: 2, color: Colors.DarkGrey }}>{'     \u2B24     '}</Text>

                  <Text
                    style={{
                      fontFamily: Font.Medium,
                      color: Colors.DarkGrey,
                      fontSize: Font.small,
                      textAlign: config.textRotate,
                      marginTop: vs(2)
                    }}
                  >
                    {Item.qualification}
                  </Text>
                </View>
              }

              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: vs(15)
              }}>
                <SvgXml xml={Location} height={vs(12)} width={s(12)} />
                <Text
                  style={{
                    fontFamily: Font.Medium,
                    color: Colors.DarkGrey,
                    fontSize: Font.small,
                    textAlign: config.textRotate,
                    paddingHorizontal: s(7)
                  }}
                >
                  {Lang_chg.NearBy[config.language]}
                </Text>

                <Text
                  style={{
                    fontFamily: Font.Medium,
                    color: Colors.Blue,
                    fontSize: Font.small,
                    textAlign: config.textRotate,
                  }}
                >
                  {`${Item.service_radius} km`}
                </Text>

              </View>

              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: vs(6),
                width: '100%',
              }}>
                <SvgXml xml={Clock} height={vs(12)} width={s(12)} />
                <Text
                  style={{
                    width: '35%',
                    fontFamily: Font.Medium,
                    color: Colors.DarkGrey,
                    fontSize: Font.small,
                    textAlign: config.textRotate,
                    paddingHorizontal: s(7)
                  }}
                >
                  {'Available'}
                </Text>

                <View style={{ width: '60%', flexWrap: 'wrap', flexDirection: 'row', }}>
                  {
                    Item?.availability.map((item, index) => {
                      return (
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            color: Colors.Blue,
                            fontSize: Font.small,
                            textAlign: config.textRotate,
                          }}
                        >
                          {index === Item?.availability.length - 1 ? `${item?.slot_day}` : `${item?.slot_day}, `}
                        </Text>
                      )
                    })
                  }
                </View>

              </View>
            </View>

          </View>

          <View style={{ width: '100%', paddingVertical: vs(6) }}>
            <View style={{ width: '100%', height: 1.5, backgroundColor: Colors.backgroundcolor }}></View>
          </View>


          {/* ----------Bottom--------- */}

          <View
            style={{
              width: "100%",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: 'space-between',
              paddingHorizontal: s(11),
            }}>

            <Text
              style={{
                color: Colors.Green,
                fontSize: Font.small,
                fontFamily: Font.Regular,
                textAlign: config.textRotate
              }}
            >
              {Item.bavi_text}
            </Text>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Booking", {
                  pass_status: "doctor",
                  nurse_id: Item.user_id,
                  indexPosition: 0,
                  isFromHospital: true,
                  // hospitalId: this.state.hospitalId,
                });
              }}
              style={{
                height: vs(25),
                width: '40%',
                backgroundColor: Colors.Blue,
                borderRadius: 6,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: Colors.White,
                  fontSize: Font.small,
                  fontFamily: Font.Medium,
                  textAlign: "center",
                }}
              >
                {providerType === 'nurse' ? Lang_chg.BOOKAPPOINTMENT[config.language] : providerType === 'lab' ? Lang_chg.BOOKTEST[config.language] :  Lang_chg.BookConsultation[config.language]}
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      )
  )
}

export default ServiceProviderContainer;


