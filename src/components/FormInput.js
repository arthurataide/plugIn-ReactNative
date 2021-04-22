import React from "react";
import { StyleSheet, View, TextInput } from "react-native";
import theme from "../theme";

export default ({ placeholder, multiline = false }) => (
  <View style={styles.inputContainer}>
    <TextInput
      multiline={multiline}
      style={[styles.inputText, { height: multiline ? 150 : "auto" }]}
      placeholder={placeholder}
    />
  </View>
);

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 2,
    borderColor: theme.COLORS.PRIMARY,
    borderRadius: 10,
    width: theme.SIZES.MAX_WIDTH,
    padding: 15,
    marginVertical: 8,
  },
  inputText: {
    fontSize: 18,
    color: theme.COLORS.INNER_TEXT,
  },
});
