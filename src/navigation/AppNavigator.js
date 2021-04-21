import "react-native-gesture-handler";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import theme from "../theme";

import { getAuthInfo, deleteAuthInfo } from "../backend/AuthStorage";

//Redux
import { connect } from "react-redux";
import * as actions from "../redux/actions/AuthActions";

//Navigators
import TabNavigator from "./TabNavigator";

//Screens
import SplashScreen from "../screens/authentication/SplashScreen";
import SignInScreen from "../screens/authentication/Signin";
import RegisterScreen from "../screens/authentication/Register";
import RegisterScreen2 from "../screens/authentication/RegisterInfo";
import VacanciesScreen from "../screens/main/Vacancies";
import CommentsScreen from "../screens/main/Post/Comments";
import ProfileScreen from "../screens/main/Profile/Profile"

const Stack = createStackNavigator();

const mapStateToProps = (state) => {
  const { authentication } = state;
  return {
    checkAuth: authentication,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAuth: (auth) => dispatch(actions.setAuth(auth)),
    deleteAuth: () => dispatch(actions.deleteAuth()),
  };
};

const headerRight = (props, navigation) => (
  <View style={{ flexDirection: "row" }}>
    <TouchableOpacity
      onPress={() => navigation.navigate('Vacancies')}
    >
      <MaterialCommunityIcons
        name={"account-multiple-plus"}
        size={25}
        color={theme.COLORS.PRIMARY}
        style={{ marginRight: 10 }}
      />
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => deleteAuthInfo().then(() => props.deleteAuth())}
    >
      <Ionicons
        name={"log-out-outline"}
        size={25}
        color={theme.COLORS.PRIMARY}
        style={{ marginRight: 10 }}
      />
    </TouchableOpacity>
  </View>
);

const tabStackOptions = (props, navigation) => {
  return {
    headerTitle: () => {
      return (
        <View style={{ flexDirection: "row" }}>
          <Image
            source={require("../../assets/PlugIn-icon.png")}
            style={{ height: 25, width: 25, marginRight: 10 }}
          />
          <Text style={styles.title}>Plug In</Text>
        </View>
      );
    },
    headerRight: () => headerRight(props, navigation),
  };
};

function App(props) {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        headerMode={props.checkAuth.length > 0 ? "float" : "none"}
        mode="modal"
        screenOptions={{headerTintColor: theme.COLORS.PRIMARY}}
      >
        {props.checkAuth.length > 0 ? (
        <>
          <Stack.Screen
            name="Home"
            component={TabNavigator}
            options={({navigation}) => tabStackOptions(props, navigation)}
          />
          <Stack.Screen
            name="Vacancies"
            component={VacanciesScreen}
          />
          <Stack.Screen
            name="Comments"
            component={CommentsScreen}
            options={theme.HORIZONTAL_ANIMATION}
          />
          <Stack.Screen
            name="PageProfile"
            component={ProfileScreen}
            options={theme.HORIZONTAL_ANIMATION, {headerShown: false}}
          />
        </>
        ) : (
          <>
            <Stack.Screen
              name="SplashScreen"
              component={SplashScreen}
            />
            <Stack.Screen
              name="Signin"
              component={SignInScreen}
              options={theme.HORIZONTAL_ANIMATION}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={theme.HORIZONTAL_ANIMATION}
            />
            <Stack.Screen
              name="RegisterInfo"
              component={RegisterScreen2}
              options={theme.HORIZONTAL_ANIMATION}
            />
          </>
        )}
      </Stack.Navigator>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.COLORS.PRIMARY,
    textTransform: "uppercase",
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
