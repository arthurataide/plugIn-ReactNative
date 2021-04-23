import React, { useLayoutEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { BarIndicator } from "react-native-indicators";
import { getAuthInfo } from "../../backend/AuthStorage";
import { getData } from "../../backend/FetchData";
import theme from "../../theme";

//Redux
import { connect } from "react-redux";
import * as actions from "../../redux/actions/AuthActions";

function App(props) {
  const checkAuthExists = async () => {
    let res = getAuthInfo();
    res.then((data) => {
      //console.log(data);
      if (data) {
        const userInfo = getData("/auth/user-info/" + data._id);
        userInfo.then((userInfo) => {
            props.setAuth(userInfo);
        })
      } else {
        props.navigation.navigate("Signin");
      }
    });
  };
  checkAuthExists();
  return (
    <View style={styles.container}>
      <StatusBar style="dark-content" />
      <View
        style={{
          alignSelf: "center",
          alignContent: "center",
          alignItems: "center",
          height: 180,
        }}
      >
        <Image
          style={{ height: 100, width: 100 }}
          source={require("../../../assets/headPhoneWhite.png")}
        />
        <BarIndicator size={50} color={theme.COLORS.WHITE} count={7} />
      </View>
    </View>
  );
}
const mapDispatchToProps = (dispatch) => {
  return {
    setAuth: (auth) => dispatch(actions.setAuth(auth)),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default connect(null, mapDispatchToProps)(App);
