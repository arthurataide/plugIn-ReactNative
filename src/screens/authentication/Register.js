import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import * as Toast from "../../components/Toast";
import Input from "../../components/Input";
import theme from "../../theme";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

export default function App({ navigation }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fName, setFName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmePassword] = useState("");

  const [selectedRole, setSelectedRole] = useState("fan");

  const checkToContinue = () => {
      const tmpObj = {
          email: email.toLowerCase(),
          username: username.toLowerCase(),
          fname: fName,
          password: password.toLowerCase(),
          role: selectedRole,
      }
      navigation.navigate("RegisterInfo", {info: tmpObj})
    //   if(email != '' && username != '' && fName != '' && password != '' && confirmPassword != ''){
    //     if(password === confirmPassword){
    //         navigation.navigate("RegisterInfo", {info: tmpObj})
    //     } else {
    //         Toast.showError("Password and Confirm password must match !");
    //     }
    //   } else {
    //     Toast.showError("All fields are required");
    //   }
  }

  const tabRole = () => {
    return (
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            {
              backgroundColor:
                selectedRole == "fan" ? "white" : theme.COLORS.PRIMARY,
            },
          ]}
          onPress={() => setSelectedRole("fan")}
        >
          <Text style={{ color: selectedRole == "fan" ? "black" : "white" }}>
            Fan
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabItem,
            {
              backgroundColor:
                selectedRole == "musician" ? "white" : theme.COLORS.PRIMARY,
            },
          ]}
          onPress={() => setSelectedRole("musician")}
        >
          <Text
            style={{ color: selectedRole == "musician" ? "black" : "white" }}
          >
            Musician
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabItem,
            {
              backgroundColor:
                selectedRole == "band" ? "white" : theme.COLORS.PRIMARY,
            },
          ]}
          onPress={() => setSelectedRole("band")}
        >
          <Text style={{ color: selectedRole == "band" ? "black" : "white" }}>
            Band
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        enabled
        behavior={Platform.OS === "ios" ? "position" : null}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.titleContainer}>
            <Image
              style={styles.img}
              source={require("../../../assets/PlugIn-icon.png")}
            />
            <Text style={styles.title}>Register</Text>
          </View>
          {tabRole()}
          <View style={styles.mainContainer}>
            <Input
              icon="md-mail"
              placeholder="Email"
              keyboardType="email-address"
              textContentType="emailAddress"
              containerStyle={styles.inputContainer}
              value={email}
              onChangeText={(text) => setEmail(text)}
              autoCapitalize = 'characters'
            />
            <Input
              icon="person-add"
              placeholder="Username"
              textContentType="username"
              containerStyle={styles.inputContainer}
              value={username}
              onChangeText={(username) => setUsername(username)}
            />
            <Input
              icon="person"
              placeholder="Full Name"
              textContentType="name"
              containerStyle={styles.inputContainer}
              value={fName}
              onChangeText={(fname) => setFName(fname)}
            />
            <Input
              icon="key"
              placeholder="Password"
              textContentType="newPassword"
              containerStyle={styles.inputContainer}
              secureEntry={true}
              value={password}
              onChangeText={(pass) => setPassword(pass)}
              autoCapitalize="none"
            />
            <Input
              icon="key"
              placeholder="Confirm Password"
              textContentType="newPassword"
              containerStyle={styles.inputContainer}
              secureEntry={true}
              value={confirmPassword}
              onChangeText={(pass) => setConfirmePassword(pass)}
              autoCapitalize="none"
            />
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => checkToContinue()}
          >
            <Text style={styles.text}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      <TouchableOpacity
        style={styles.headerBackButton}
        onPress={() => navigation.goBack()}
      >
        <FontAwesome5 name="angle-left" color={theme.COLORS.WHITE} size={35} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.PRIMARY,
  },
  headerBackButton: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    top: Platform.OS === "ios" ? 40 : 30,
    left: 10,
    height: 50,
    width: 50,
    backgroundColor: theme.COLORS.LIGHTGRAY,
    borderRadius: 50,
  },
  titleContainer: {
    marginTop: 70,
    padding: 25,
  },
  img: {
    width: 70,
    height: 70,
    alignSelf: "center",
    margin: 10,
  },
  title: {
    alignSelf: "center",
    color: "white",
    fontSize: 35,
    fontWeight: "700",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: theme.COLORS.PRIMARY,
    marginHorizontal: 25,
    borderTopStartRadius: 5,
    borderTopEndRadius: 5,
    borderWidth: 1,
    borderColor: "white",
  },
  tabItem: {
    alignItems: "center",
    width: "33.333%",
    padding: 10,
    borderTopStartRadius: 5,
    borderTopEndRadius: 5,
  },
  mainContainer: {
    backgroundColor: "#fff",
    borderBottomEndRadius: 5,
    borderBottomStartRadius: 5,
    marginHorizontal: 25,
    paddingHorizontal: 20,
    paddingVertical: 5
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginVertical: 6,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: theme.COLORS.LIGHTGRAY,
  },
  icon: {
    flex: 0.1,
    padding: 15,
  },
  checkbox: {
    marginVertical: 15,
  },
  button: {
    backgroundColor: theme.COLORS.WHITE,
    padding: 10,
    marginHorizontal: 25,
    marginVertical: 25,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignItems: "center",
  },
  text: {
    alignSelf: "center",
    color: theme.COLORS.BLACK,
    fontSize: 18,
    fontWeight: "600",
  },
});
