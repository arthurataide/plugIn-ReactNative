import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import * as Toast from "../../components/Toast";
import Input from "../../components/Input";
import theme from "../../theme";

import { getData, postData } from "../../backend/FetchData";
import { saveAuthInfo } from "../../backend/AuthStorage";

//Redux
import { connect } from "react-redux";
import * as actions from "../../redux/actions/AuthActions";

function App(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const checklogin = async () => {
    if (email != "" && password != "") {
      const authData = {
        username: email,
        password,
      };

      //attempt login
      const response = await postData("/auth/signin/", authData);
      try {
        if (response.status) {
          //console.log(response)
          if (response.status >= 200 && response.status <= 300) {
            //success
            const data = await response.json();

            const userInfo = await getData("/auth/user-info/" + data._id);

            //saving auth information (id and token)
            await saveAuthInfo({ ...data, role: userInfo.role });
            props.setAuth(data);
          } else {
            //fail
            response.text().then((text) => Toast.showError(text));
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      Toast.showError("Email and Password are required");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        enabled
        behavior={Platform.OS === "ios" ? "position" : null}
      >
        <ScrollView style={{ margin: 0 }} showsVerticalScrollIndicator={false}>
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
            }}
          >
            <Image
              source={require("../../../assets/mainBand.jpeg")}
              style={styles.img}
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
            }}
          >
            <View style={styles.loginContainer}>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Text style={styles.title}>Login</Text>
              </View>
              <View style={styles.inputContainer}>
                <Input
                  icon="md-mail"
                  placeholder="Email"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  containerStyle={styles.inputStyle}
                  value={email}
                  onChangeText={(text) => setEmail(text.toLowerCase())}
                  autoCapitalize="characters"
                />
                <Input
                  icon="key"
                  placeholder="Password"
                  secureEntry={true}
                  textContentType="password"
                  containerStyle={styles.inputStyle}
                  value={password}
                  onChangeText={(pass) => setPassword(pass.toLowerCase())}
                  autoCapitalize="none"
                />
                <View style={styles.checkbox}>
                  <TouchableOpacity
                    style={{ justifyContent: "center", alignSelf: "center" }}
                  >
                    <Text style={{ fontSize: 15, color: "#000" }}>
                      Forgot password ?
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    checklogin();
                  }}
                >
                  <Text style={styles.text}>Sign In</Text>
                </TouchableOpacity>
                <Text style={{ alignSelf: "center", marginVertical: 10 }}>
                  Don't have an account?
                </Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => props.navigation.navigate("Register")}
                >
                  <Text style={styles.text}>Register</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  img: {
    height: 350,
    width: "100%",
    alignContent: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  loginContainer: {
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  title: {
    alignSelf: "center",
    fontSize: 26,
    fontWeight: "700",
  },
  inputStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ddd",
    borderRadius: 10,
    marginVertical: 6,
  },
  inputContainer: {
    marginVertical: 30,
  },
  checkbox: {
    marginTop: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: theme.COLORS.PRIMARY,
    padding: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  text: {
    alignSelf: "center",
    color: theme.COLORS.WHITE,
    fontSize: 18,
    fontWeight: "600",
  },
});

export default connect(null, mapDispatchToProps)(App);
