import React from "react";
import { StyleSheet, View } from "react-native";
import theme from "../theme";

export default () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  divider: {
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#eeeeee",
    width: theme.SIZES.MAX_WIDTH,
  },
});
