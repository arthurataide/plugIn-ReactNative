import React, { useState } from "react";
import { View, TextInput, StyleSheet, Dimensions } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import theme from "../theme";
const { width, height } = Dimensions.get("screen");
TextInput.defaultProps.selectionColor = theme.COLORS.PRIMARY;

const Input = ({
  icon,
  size,
  placeholder,
  onChangeText,
  keyboardType,
  secureEntry,
  textContentType,
  containerStyle,
  returnKeyType,
  multiline,
  numberOfLines,
  textInputStyle,
  value,
}) => {
  const [inFocus, setInFocus] = useState(false);

  return (
    <View style={containerStyle} onPress={() => setInFocus(true)}>
      <View style={styles.icon}>
        <Ionicons
          name={icon}
          style={{ color: "#555" }}
          size={size ? size : 22}
        />
      </View>
      <View style={styles.input}>
        <TextInput
          textContentType={textContentType}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          secureTextEntry={secureEntry}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setInFocus(true)}
          onBlur={() => setInFocus(false)}
          placeholder={placeholder}
          onChangeText={onChangeText}
          value={value}
          style={textInputStyle}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    flex: 0.1,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  input: {
    flex: 0.8,
    paddingVertical: 14,
  },
});

export default Input;
