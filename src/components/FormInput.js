import React, { useState } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import theme from "../theme";

export default ({
  placeholder,
  multiline = false,
  autoFocus = false,
  value,
  onChangeText,
}) => {
  const [borderColor, setBorderColor] = useState(theme.COLORS.TWITTER)

  const onFocus = () =>{
    setBorderColor(theme.COLORS.PRIMARY)
  }

  const onBlur = () =>{
    setBorderColor(theme.COLORS.TWITTER)
  }

  return (
    <View style={[styles.inputContainer, {borderColor: borderColor}]}>
      <TextInput
        multiline={multiline}
        style={[styles.inputText, { height: multiline ? 150 : "auto"}, ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        autoFocus={autoFocus}
        onFocus = {()=>onFocus()}
        onBlur = {()=>onBlur()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 2,
    borderRadius: 10,
    width: theme.SIZES.MAX_WIDTH,
    padding: 15,
    marginVertical: 8,
    
  },
  inputText: {
    fontSize: 16,
    color: theme.COLORS.INNER_TEXT,
  },
});
