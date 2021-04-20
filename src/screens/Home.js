import React, { useLayoutEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { getAuthInfo } from "../backend/AuthStorage";
import theme from "../theme";


export default function App(props) {
  return (
    <View style={styles.container}>
      <StatusBar style="dark-content" />
      {console.log(getAuthInfo())}
      <Text>Home!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
