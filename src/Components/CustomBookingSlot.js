import React, { Component } from "react";
import { Platform, Text } from "react-native";
import {
  View,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import Spinner from "react-native-spinkit";
import { useSelector } from "react-redux";
import { Colors, Font } from "../Provider/Colorsfont";
import moment from "moment";
import { SvgXml } from "react-native-svg";
import { Pencil, clockBlue } from "../Icons/Index";

const CustomBookingSlot = ({
  data,
  index,
  length,
  onEdit = () => { },
  nonEdit
}) => {

  const { customBookingDates } = useSelector(state => state.StorageReducer)

  const styles = StyleSheet.create({

    container: {
      backgroundColor: Colors.White,
      width: '100%',
      flexDirection: 'row',
      alignSelf: 'center',
      borderBottomWidth: index == length - 1 ? 0 : 1.5,
      borderBottomColor: Colors.Highlight,
      paddingVertical: 10
    },


  });

  return (
    <View style={styles.container}>

      <View style={{ width: '55%' }}>
        <Text style={{
          fontSize: 12,
          fontFamily: Font.Medium,
          color: Colors.DarkGrey
        }}>
          {'Date'}
        </Text>
        <Text style={{
          fontSize: 14,
          fontFamily: Font.Regular,
          color: Colors.DarkGrey,
          marginTop: 2
        }}>
          {moment(data).format('ddd, DD MMM YYYY')}
        </Text>
      </View>

      <View style={{ width: '35%' }}>
        <Text style={{
          fontSize: 12,
          fontFamily: Font.Medium,
          color: Colors.DarkGrey
        }}>
          {'Time'}
        </Text>
        <Text style={{
          fontSize: 14,
          fontFamily: Font.Regular,
          color: Colors.DarkGrey,
          marginTop: 2
        }}>
          {customBookingDates[data].time}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <SvgXml xml={clockBlue} />
          <Text style={{
            fontSize: 12,
            fontFamily: Font.Regular,
            color: Colors.Blue,
            marginLeft: 2
          }}>
            {'30 mins'}
          </Text>
        </View>

      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          onEdit()
        }}
        style={{ width: '10%', alignItems: 'flex-end', }}>
        {
          !nonEdit &&
          <SvgXml xml={Pencil} />
        }
      </TouchableOpacity>


    </View>
  );
}

export default CustomBookingSlot;

