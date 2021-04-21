import React, { useEffect, useLayoutEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { getData } from "../../../backend/FetchData";
import theme from "../../../theme";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import Box from "../../../components/Box";

const { width } = Dimensions.get("window");

function App(props) {
  const [profile, setProfile] = useState({});

  const [loadind, setLoading] = useState(false);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: null,
      headerMode: "none",
    });
  }, [props.navigation]);

  useEffect(() => {
    onRefresh();
  }, [props.route.params]);

  const onRefresh = () => {
    setLoading(true);
    let { userId } = props.route.params;
    console.log(userId);
    getData("/auth/user-info/" + userId).then((x) => {
      setProfile(x);
      setLoading(false);
    });
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.imageContainer}>
        <Image
          style={styles.profileImg}
          source={{ uri: profile.pictureUrl }}
          resizeMode={"contain"}
        />
      </View>

      <ScrollView style={styles.informationContainer}>
        <Text style={styles.profileName}>{profile.name}</Text>
        <View style={styles.aboutContainer}>
          <Text style={{ justifyContent: "space-evenly" }}>
            {profile.about}
          </Text>
        </View>
        {profile.role === "fan" ? (
          <></>
        ) : (
          <>
            <Box title={"Genres"} items={profile.genres} />
            {profile.role == "musician" ? (
              <>
                <Box title={"Instruments"} items={profile.instruments} />
                <Box title={"Skills"} items={profile.skills} />
              </>
            ) : (
              <></>
            )}
          </>
        )}
      </ScrollView>
      <TouchableOpacity
        style={styles.contactBtn}
        onPress={() => console.log("contact")}
      >
        <FontAwesome5 name="phone" color={theme.COLORS.WHITE} size={20} />
        <Text style={{fontSize: 17, marginLeft: 10, color: theme.COLORS.WHITE}}>Contact</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.headerBackButton}
        onPress={() => props.navigation.goBack()}
      >
        <FontAwesome5 name="angle-left" color={theme.COLORS.WHITE} size={35} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.WHITE,
    paddingTop: Platform.OS === "android" ? 30 : 40,
  },
  headerBackButton: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    top: Platform.OS === "ios" ? 40 : 30,
    left: 10,
    height: 50,
    width: 50,
    backgroundColor: theme.COLORS.PRIMARY,
    borderRadius: 50,
  },
  contactBtn: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: Platform.OS == 'android' ? 15 : 20,
    backgroundColor: theme.COLORS.PRIMARY,
  },
  imageContainer: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: theme.COLORS.PRIMARY,
  },
  profileImg: {
    height: 300,
    width: width,
  },
  informationContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  profileName: {
    alignSelf: "center",
    fontSize: 22,
    fontWeight: "bold",
  },
  aboutContainer: {
    marginVertical: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: theme.COLORS.LIGHTGRAY,
    borderRadius: 5,
  },
});
export default App;
