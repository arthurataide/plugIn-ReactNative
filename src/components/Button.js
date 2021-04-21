import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import theme from "../theme";

export default ({ title, onPress }) => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {},
  button: {
    //backgroundColor: theme.COLORS.PRIMARY,
    padding: 16,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
    width: theme.SIZES.MAX_WIDTH,
    borderWidth: 1.5,
    borderColor: theme.COLORS.PRIMARY,
  },
  text: {
    alignSelf: "center",
    color: theme.COLORS.INNER_TEXT,
    fontSize: 18,
    fontWeight: "600",
  },
});
