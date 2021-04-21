import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import theme from "../theme";

const layoutTypes = {
    default: "default",
    filled: "filled",
}

export default ({ title, onPress, layout = layoutTypes.default }) => (
  <View style={styles.container}>
    <TouchableOpacity style={
        layout == layoutTypes.filled 
        ? styles.filledButton
        : styles.button
    } onPress={onPress}>
      <Text style={
        layout == layoutTypes.filled 
        ? styles.filledText
        : styles.text
    }>{title}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {},
  button: {
    padding: 16,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
    width: theme.SIZES.MAX_WIDTH,
    borderWidth: 1.5,
    borderColor: theme.COLORS.PRIMARY,
  },
  filledButton: {
    padding: 16,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
    width: theme.SIZES.MAX_WIDTH,
    backgroundColor: theme.COLORS.PRIMARY,
  },
  text: {
    alignSelf: "center",
    color: theme.COLORS.INNER_TEXT,
    fontSize: 18,
    fontWeight: "600",
  },
  filledText: {
    alignSelf: "center",
    color: theme.COLORS.WHITE,
    fontSize: 18,
    fontWeight: "600",
  },
});
