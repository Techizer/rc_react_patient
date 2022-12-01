import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { RF } from "../utils/responsive";
import Fonts from "../utils/Fonts";
import { Color } from "../utils";
const { height, width } = Dimensions.get("window");
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ActionSheet from "react-native-actionsheet";
import Moment from "moment-timezone";

const WorkingHours = ({
  workingHours,
  workingHoursData,
  onChangeDataWorkingHours,
  iconName,
  iconPressAction,
  name,
  disableImg,
  address,
  mainContainer,
  inputLayout,
  imgView,
  imgStyle,
  inputFieldStyle,
  refs,
  inputRef,
  showCode,
  iconColor,
  ...props
}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [chooseIndex, setIndex] = useState(0);
  const [chooseStatus, setStatus] = useState("open");
  const ActionSheetPicker = useRef();
  const statusActionSheetPicker = ["Cancel", "Open", "Closed"];
  const CANCEL_INDEX = 0;

  const showDatePicker = (status, data, index) => {
    setIndex(index);
    setStatus(status);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    // console.log("A date has been picked: ", date);
    // console.log("A date has been picked hour: ", Moment(date).format("HH"));

    var arr = workingHours;
    var arrData = workingHoursData;
    // console.log("arrData: ", chooseIndex, arr);
    // console.log("arrData1: ", chooseIndex, arrData);
    if (chooseStatus == "open") {
      arr[chooseIndex].from_hour =
        Moment(date).format("hh") + ":00 " + Moment(date).format("A"); //date
      arrData[chooseIndex].from_hour = Moment(date).format("HH"); //date
    } else {
      arr[chooseIndex].to_hour =
        Moment(date).format("hh") + ":00 " + Moment(date).format("A"); //Moment(date).format("hh:mm A") //date
      arrData[chooseIndex].to_hour = Moment(date).format("HH"); //date
    }

    // console.log("arr2: ", arr);
    // console.log("arr21: ", arrData);

    onChangeDataWorkingHours({
      arr: arr,
      arrData: arrData,
    });

    hideDatePicker();
  };

  const showActionSheetPicker = (data, index) => {
    setIndex(index);
    ActionSheetPicker.current.show();
  };

  const handlePressPickerType = (index) => {
    // console.log("index:: ", index)
    var arr = workingHours;
    var arrData = workingHoursData;
    // console.log("arrData: ", chooseIndex, arr);
    // console.log("arrData1: ", chooseIndex, arrData);
    arr[chooseIndex].day_status =
      index == 0 ? arr[chooseIndex].day_status : index == 1 ? "1" : "0";
    arrData[chooseIndex].day_status =
      index == 0 ? arr[chooseIndex].day_status : index == 1 ? "1" : "0";

    // console.log("arr2: ", arr);
    // console.log("arr21: ", arrData);

    onChangeDataWorkingHours({
      arr: arr,
      arrData: arrData,
    });
  };

  //// console.log(props.onSubmitEditing)
  return (
    <>
      <View style={[styles.mainContainer, mainContainer]}>
        {workingHours.map((data, index) => {
          return (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingTop: 20,
                  paddingBottom: 20,
                  //paddingLeft: 5, paddingRight: 5
                }}
              >
                <View
                  style={{
                    width: "15%",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    {data?.dayName}
                  </Text>
                </View>
                <View
                  style={{
                    width: "35%",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      showDatePicker("open", data, index);
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {data?.from_hour == "" ? "Open Time" : data?.from_hour}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: "35%",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      showDatePicker("close", data, index);
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {data?.to_hour == "" ? "Close Time" : data?.to_hour}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: "15%",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      showActionSheetPicker(data, index);
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {data?.day_status == "1" ? "Open" : "Closed"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          );
        })}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="time"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <ActionSheet
          ref={ActionSheetPicker}
          options={statusActionSheetPicker}
          cancelButtonIndex={CANCEL_INDEX}
          onPress={(index) => {
            handlePressPickerType(index);
          }}
          tintColor={Color.primaryColor}
        />
      </View>
    </>
  );
};

WorkingHours.defaultProps = { mainContainer: {} };

const styles = StyleSheet.create({
  textStyle: {
    backgroundColor: "gray",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    width: "100%",
    //paddingLeft: 10,
    //paddingRight: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "lightgrey",
    paddingVertical: 5,
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 10,
  },
  imgView: {
    width: "15%",
    alignItems: "center",
  },
  img: {
    height: 30,
    width: 30,
  },
  inputLayout: {
    width: "100%",
    // flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  inputFieldStyle: {
    width: "100%",
    height: 40,
    paddingVertical: 5,
    fontSize: RF(14),
    color: Color.blackColor,
    fontFamily: Fonts.regular,
    // backgroundColor: 'red'
  },
  errorLayout: {
    backgroundColor: "red",
    marginVertical: 6,
    borderRadius: 5,
    padding: 5,
  },
  errorTxt: {
    color: "White",
    fontWeight: "bold",
    fontSize: RF(12),
  },
});
export default WorkingHours;
