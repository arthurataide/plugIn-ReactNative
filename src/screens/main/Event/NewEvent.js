import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import theme from "../../../theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import Button from "../../../components/Button";

export default () => {
  const [date, setDate] = useState(new Date());

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput style={styles.inputText} placeholder={"Title"} />
      </View>
      <View
        style={{
          width: theme.SIZES.MAX_WIDTH,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={styles.dateContainer}>
          <DateTimePicker
            style={{ backgroundColor: theme.COLORS.WHITE }}
            testID="dateTimePicker"
            value={date}
            mode={"date"}
            onChange={onChange}
          />
        </View>
        <View style={styles.dateContainer}>
          <DateTimePicker
            testID="dateTimePicker2"
            value={date}
            mode={"time"}
            is24Hour={true}
            onChange={onChange}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <TextInput style={styles.inputText} placeholder={"Address"} />
      </View>
      <View style={styles.inputContainer}>
          <TextInput multiline={true} style={[styles.inputText, {height: 120}]} placeholder={"Event Description"} />
      </View>
      <Button title={"SAVE"} layout={"filled"} />
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
    marginVertical: 8,
  },
  dateContainer: {
    borderWidth: 2,
    borderColor: theme.COLORS.PRIMARY,
    borderRadius: 10,
    width: theme.SIZES.MAX_WIDTH / 2 - 10,
    padding: 10,
    marginVertical: 2,
  },
  inputText: {
    fontSize: 18,
    color: theme.COLORS.INNER_TEXT,
  },
});
