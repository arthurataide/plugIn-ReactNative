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

import HomeScreen from "../screens/Home";
import SignInScreen from "../screens/authentication/Signin";
import RegisterScreen from "../screens/authentication/Register";

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
    const { checkAuth } = state;
    return {
        checkAuth: checkAuth,
    }
}

function App(props) {
  const [isSignedIn, setIsSignedIn] = useState(false);

  return (
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator headerMode={"none"} mode="modal">
          {props.checkAuth ? (
            <>
              <Stack.Screen name="Home" component={HomeNavigator} />
            </>
          ) : (
            <>
              <Stack.Screen name="Signin" component={SignInScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
        </Stack.Navigator>
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </NavigationContainer>
  );
}

export default connect(mapStateToProps)(App)
