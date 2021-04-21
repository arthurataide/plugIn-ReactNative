import React, { useState, useEffect } from "react";
import { View, Button, StyleSheet, TextInput } from "react-native";
import theme from "../../../theme";
import DateTimePicker from "@react-native-community/datetimepicker";

export default () => {
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    console.log(currentDate)
    setShow(Platform.OS === "ios")
    setDate(currentDate)
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput style={styles.inputText} placeholder={"Title"} />
      </View>
      
      {/* <View>
        <Button onPress={showDatepicker} title="Show date picker!" />
      </View>
      <View>
        <Button onPress={showTimepicker} title="Show time picker!" />
      </View> */}
      {/* {show && (
        <DateTimePicker
          style={{ width:100, height:100 }}
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  inputContainer: {
    borderWidth: 2,
    borderColor: theme.COLORS.PRIMARY,
    borderRadius: 10,
    width: theme.SIZES.MAX_WIDTH,
    padding: 15,
  },
  inputText: {
    fontSize: 18,
    color: theme.COLORS.INNER_TEXT,
  },
});
