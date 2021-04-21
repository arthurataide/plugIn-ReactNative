import React from "react"
import { View,  Text, StyleSheet, Platform } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

//Screens
import HomeScreen from "../screens/main/Home";
import NewPostScreen from "../screens/main/NewPost";
import EventsScreen from "../screens/main/Events";
import SearchScreen from "../screens/main/Search";
import MyProfileScreen from "../screens/main/MyProfile";


import theme from "../theme";

const Tab = createBottomTabNavigator();

export default ()=> {
    return (
      <Tab.Navigator
        initialRouteName={"Home"}
        screenOptions={({ route }) => ({
          title: ({ focused, color, size }) => {
            
            if (route.name != "NewPost"){
                let title = focused ? route.name : ""
                return <Text style={{ color: color, fontSize: 13 }}>{title}</Text>;
            }
            
          },

          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "NewPost") {
              return (
                <View style={styles.addPostContainer}>
                    <Ionicons name={"add-circle"} size={Platform.OS === 'android' ? 70 :80} color={theme.COLORS.PRIMARY}/>
                </View>
             )

            } else if (route.name === "Profile") {
              iconName = focused ? "user-alt" : "user";
            }else if (route.name === "Events") {
              iconName = "guitar";
            }else if (route.name === "Search") {
              iconName = "search";
            }else if (route.name === "Home") {
              iconName = "home";
            }

            return <FontAwesome5 name={iconName} size={22} color={color}/>
          },
        })}
        tabBarOptions={{
          activeTintColor: theme.COLORS.PRIMARY,
          inactiveTintColor: "lightgray",
          keyboardHidesTabBar: true,
          tabStyle: {paddingTop: Platform.OS == 'android' ? 5 : 0}
        }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="NewPost" component={NewPostScreen} />
        <Tab.Screen name="Events" component={EventsScreen} />
        <Tab.Screen name="Profile" component={MyProfileScreen} />
      </Tab.Navigator>
    );
  }

  const styles = StyleSheet.create({
    addPostContainer: {
        height: 90,
        width: 90,
        borderRadius: 90,
        backgroundColor: 'transparent',
        alignItems: 'center',
    }
  })