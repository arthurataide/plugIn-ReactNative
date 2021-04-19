import "react-native-gesture-handler";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import theme from "../theme";

import { getAuthInfo, deleteAuthInfo } from "../backend/AuthStorage";

//Redux
import { connect } from "react-redux";
import * as actions from "../redux/actions/AuthActions";

import HomeScreen from "../screens/Home";
import SplashScreen from "../screens/authentication/SplashScreen";
import SignInScreen from "../screens/authentication/Signin";
import RegisterScreen from "../screens/authentication/Register";
import RegisterScreen2 from "../screens/authentication/RegisterInfo";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        title: ({ focused, color, size }) => {
          let title;
          if (route.name === "Home") {
            title = focused ? "Home" : "";
          } else if (route.name === "Signin") {
            title = focused ? "Sign In" : "";
          }
          return <Text style={{ color: color, fontSize: size }}>{title}</Text>;
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home";
          } else if (route.name === "Signin") {
            iconName = focused ? "user-alt" : "user";
          }
          return <FontAwesome5 name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: theme.COLORS.PRIMARY,
        inactiveTintColor: "lightgray",
        keyboardHidesTabBar: true,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Signin" component={HomeScreen} />
    </Tab.Navigator>
  );
}

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

function App(props) {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        headerMode={props.checkAuth.length > 0 ? "float" : "none"}
        mode="modal"
      >
        {props.checkAuth.length > 0 ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeNavigator}
              options={{
                headerRight: () => (
                  <TouchableOpacity
                    onPress={() => {
                      deleteAuthInfo().then(() => props.deleteAuth());
                    }}
                  >
                    <Ionicons
                      name={"log-out-outline"}
                      size={25}
                      color={theme.COLORS.PRIMARY}
                      style={{ marginRight: 10 }}
                    />
                  </TouchableOpacity>
                ),
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="SplashScreen"
              component={SplashScreen}
              options={theme.HORIZONTAL_ANIMATION}
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
