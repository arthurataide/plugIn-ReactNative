import React, { useLayoutEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

function App(props) {
  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: null,
    });
  }, [props.navigation]);
  //console.log(props.route.params);
  return (
    <View style={styles.container}>
      <Text>Profile</Text>
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
export default App;
