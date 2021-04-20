import "react-native-gesture-handler";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { FontAwesome5 } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import theme from "../theme";

//Redux
import { connect } from "react-redux";

import HomeScreen from "../screens/main/Home";
import SignInScreen from "../screens/authentication/Signin";
import RegisterScreen from "../screens/authentication/Register";
import RegisterScreen2 from "../screens/authentication/RegisterInfo"

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

function App(props) {
  return (
    <NavigationContainer>
      <HomeNavigator/>
      {/* <StatusBar style="auto" />
      <Stack.Navigator headerMode={props.checkAuth.length > 0 ? "float" : "none"} mode="modal">
        {props.checkAuth.length > 0 ? (
          <>
            <Stack.Screen name="Home" component={HomeNavigator} />
          </>
        ) : (
          <>
          {console.log(props.checkAuth)}
            <Stack.Screen name="Signin" component={SignInScreen} options={theme.HORIZONTAL_ANIMATION}/>
            <Stack.Screen name="Register" component={RegisterScreen} options={theme.HORIZONTAL_ANIMATION}/>
            <Stack.Screen name="RegisterInfo" component={RegisterScreen2} options={theme.HORIZONTAL_ANIMATION}/>
          </>
        )}
      </Stack.Navigator>
      <Toast ref={(ref) => Toast.setRef(ref)} /> */}
    </NavigationContainer>
  );
}

export default connect(mapStateToProps)(App);
