import { Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";

const TestFunction = (props) => {
  const [input, setInput] = useState("");
  const [arr, setArr] = useState([]);
  const testFunction = (pressedAction, value) => {
    if (pressedAction === "add") {
      if (!arr.includes(value)) {
        arr.push(value);
      }
      console.log("arr add ", arr);
      setInput("");
    } else if (pressedAction === "remove") {
      arr.pop(value);
      console.log("arr remove ", arr);
      setInput("");
    } else if (pressedAction === "display") {
      console.log("arr display ", arr);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignSelf: "center",
        alignContent: "center",
      }}
    >
      <View style={{ padding: 10 }}>
        <TextInput
          value={input}
          style={{ height: 40, backgroundColor: "white", fontSize: 20 }}
          placeholder="Enter Value"
          onChangeText={(text) => {
            setInput(text);
          }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          alignContent: "center",
          marginLeft: 10,
          marginRight: 10,
        }}
      >
        <TouchableOpacity
          style={{
            alignItems: "center",
            width: "30%",
            justifyContent: "center",
            alignContent: "center",
            height: 40,
            backgroundColor: "grey",
          }}
          onPress={() => {
            testFunction("add", input);
          }}
        >
          <Text style={{ textAlign: "center" }}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            alignItems: "center",
            width: "30%",
            justifyContent: "center",
            height: 40,
            alignContent: "center",
            backgroundColor: "grey",
          }}
          onPress={() => {
            testFunction("remove", input);
          }}
        >
          <Text style={{ textAlign: "center" }}>Remove</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            alignItems: "center",
            width: "30%",
            justifyContent: "center",
            alignContent: "center",
            height: 40,
            backgroundColor: "grey",
          }}
          onPress={() => {
            testFunction("display");
          }}
        >
          <Text style={{ textAlign: "center" }}>Display</Text>
        </TouchableOpacity>
      </View>
      <Text style={{ textAlign: "center", marginTop: 20, fontSize: 20 }}>
        {arr.toString()}
      </Text>
    </View>
  );
};
export default TestFunction;
