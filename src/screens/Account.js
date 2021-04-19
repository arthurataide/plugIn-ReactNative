import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { getAuthInfo } from "../backend/AuthStorage";
import theme from "../theme";

//Redux
import { connect } from "react-redux";

function App(props) {
  const [pictureUrl, setPictureUrl] = useState();
  const [name, setName] = useState("");
  useEffect(() => {
    if (props.checkAuth) {
      setPictureUrl(props.checkAuth[0].pictureUrl);
      setName(
        props.checkAuth[0].title != ""
          ? props.checkAuth[0].title
          : props.checkAuth[0].name
      );
    }
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style="dark-content" />
      {props.checkAuth ? (
        <>
          <Image
            source={{
              uri: pictureUrl,
            }}
            style={styles.img}
          />
          <Text>{name}</Text>
        </>
      ) : (
        <> </>
      )}
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
  img: {
    height: 160,
    width: 160,
    borderRadius: 80,
  },
});

const mapStateToProps = (state) => {
  const { authentication } = state;
  return {
    checkAuth: authentication,
  };
};

export default connect(mapStateToProps, null)(App);
