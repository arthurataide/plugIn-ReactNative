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
import BouncyCheckbox from "react-native-bouncy-checkbox";
import * as Toast from "../../components/Toast";
import Input from "../../components/Input";
import theme from "../../theme";

//Redux
import { connect } from "react-redux";
import * as actions from "../../redux/actions/AuthActions";

const { width } = Dimensions.get("screen");

function App({ navigation, props }) {
  const [isSelected, setSelection] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const checklogin = async () => {
    if (email != "" && password != "") {
      // if (email === "admin"){
      //   navigation.navigate('adminpanel')
      //   return;
      // }
      const authData = {
        email,
        password,
      };

      //attempt login
      const response = await postData("/auth/signin/", authData);
      try {
        if (response) {
          if (response.status >= 200 && response.status <= 300) {
            //success
            const data = await response.json();

            const userInfo = await getData("/auth/user-info/" + data._id);

            //saving auth information (id and token)
            await saveAuthInfo({ ...data, role: userInfo.role });

            console.log(userInfo);
            if (userInfo.role === "admin") {
              navigation.replace("adminpanel");
              return;
            }

            if (nextScreen != undefined) {
              navigation.replace(nextScreen, {
                cartData: cartData,
                userId: data._id,
              });
            } else {
              navigation.popToTop();
            }
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
                  value={email}
                  onChangeText={(email) => setEmail(email.toLowerCase())}
                />
                <Input
                  icon="key"
                  placeholder="Password"
                  secureEntry={true}
                  textContentType="password"
                  value={password}
                  onChangeText={(pass) => setPassword(pass.toLowerCase())}
                  autoCapitalize="none"
                />
                <View
                  style={[
                    styles.checkbox,
                    {
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginRight: 10,
                    },
                  ]}
                >
                  <BouncyCheckbox
                    textDecoration={true}
                    isChecked={false}
                    value={isSelected}
                    textColor="#000"
                    borderColor={theme.COLORS.PRIMARY}
                    fillColor={theme.COLORS.PRIMARY}
                    text="Remember me"
                    textStyle={{ fontSize: 15, textDecorationLine: "none" }}
                    onValueChange={setSelection}
                  />
                  <TouchableOpacity style={{ justifyContent: "center" }}>
                    <Text style={{ fontSize: 15, color: "#000" }}>
                      Forgot password ?
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    props.setAuthentication(props);
                  }}
                >
                  <Text style={styles.text}>Sign In</Text>
                </TouchableOpacity>
                <Text style={{ alignSelf: "center", marginVertical: 10 }}>
                  Don't have an account?
                </Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate("Register")}
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
    setAuthentication: (auth) => dispatch(actions.setAuth(true)),
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
  inputContainer: {
    marginVertical: 30,
  },
  checkbox: {
    marginVertical: 15,
  },
  button: {
    backgroundColor: theme.COLORS.PRIMARY,
    padding: 12,
    width: width / 1.2,
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
