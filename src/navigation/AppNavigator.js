import "react-native-gesture-handler";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import theme from "../theme";
import { deleteAuthInfo } from "../backend/AuthStorage";

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
import NewEventScreen from "../screens/main/Event/NewEvent";
import NewVacancyScreen from "../screens/main/Vacancy/NewVacancy";
import CommentsScreen from "../screens/main/Post/Comments";
import ProfileScreen from "../screens/main/Profile/Profile";
import ApplicationsScreen from "../screens/main/Vacancy/Applications";

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

const headerRight = (props, navigation, route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";
  if (routeName == "Profile") {
    return (
      <TouchableOpacity
        onPress={() => deleteAuthInfo().then(() => props.deleteAuth())}
      >
        <Ionicons
          name={"log-out-outline"}
          size={30}
          color={theme.COLORS.PRIMARY}
          style={{ marginRight: 15 }}
        />
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity onPress={() => navigation.navigate("Vacancies")}>
        <MaterialCommunityIcons
          name={"account-multiple-plus"}
          size={30}
          color={theme.COLORS.PRIMARY}
          style={{ marginRight: 15 }}
        />
      </TouchableOpacity>
    );
  }
};

const tabStackOptions = (props, navigation, route) => {
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
    headerRight: () => headerRight(props, navigation, route),
  };
};

function App(props) {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        headerMode={props.checkAuth.length > 0 ? "float" : "none"}
        mode="modal"
        screenOptions={{ headerTintColor: theme.COLORS.PRIMARY }}
      >
        {props.checkAuth.length > 0 ? (
          <>
            <Stack.Screen
              name="Home"
              component={TabNavigator}
              options={({ navigation, route }) =>
                tabStackOptions(props, navigation, route)
              }
            />
            <Stack.Screen name="Vacancies" component={VacanciesScreen} />
            <Stack.Screen
              name="Comments"
              component={CommentsScreen}
              options={theme.HORIZONTAL_ANIMATION}
            />
            <Stack.Screen
              name="PageProfile"
              component={ProfileScreen}
              options={(theme.HORIZONTAL_ANIMATION, { headerShown: false })}
            />
            <Stack.Screen
              name="NewEvent"
              component={NewEventScreen}
              options={{ ...theme.HORIZONTAL_ANIMATION, title: "New Event" }}
            />
            <Stack.Screen
              name="NewVacancy"
              component={NewVacancyScreen}
              options={{...theme.HORIZONTAL_ANIMATION, title:"New Vacancy"}}/>
            <Stack.Screen
              name="Applications"
              component={ApplicationsScreen}
              options={{...theme.HORIZONTAL_ANIMATION, title:"Applications"}}
          />
          </>
        ) : (
          <>
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
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
