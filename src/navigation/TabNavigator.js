import React from "react"
import { View,  Text, StyleSheet } from "react-native"
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
                return <Text style={{ color: color, fontSize: size }}>{title}</Text>;
            }
            
          },

          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "NewPost") {
              return (
                <View style={styles.addPostContainer}>
                    <Ionicons name={"add-circle"} size={90} color={theme.COLORS.PRIMARY}/>
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

            return <FontAwesome5 name={iconName} size={size} color={color}/>
          },
        })}
        tabBarOptions={{
          activeTintColor: theme.COLORS.PRIMARY,
          inactiveTintColor: "lightgray",
          keyboardHidesTabBar: true,
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
        height: 100,
        width: 100,
        borderRadius: 100,
        backgroundColor: 'transparent',
        alignItems: 'center',
    }
  })