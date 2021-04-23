import React from "react";
import { StyleSheet, View, TextInput } from "react-native";
import theme from "../theme";

export default ({ placeholder, multiline = false, value, onChangeText }) => (
  <View style={styles.inputContainer}>
    <TextInput
      multiline={multiline}
      style={[styles.inputText, { height: multiline ? 150 : "auto" }]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: theme.COLORS.LIGHTGRAY,
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
  },
  inputText: {
    fontSize: 16,
    color: theme.COLORS.INNER_TEXT,
  },
});
