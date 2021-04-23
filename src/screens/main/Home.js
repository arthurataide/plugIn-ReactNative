import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getData } from "../../backend/FetchData";
import PostList from "../../components/Post";
import theme from "../../theme";

const { width } = Dimensions.get("window");

const ProfileItem = ({ item, navigation }) => (
  <TouchableOpacity onPress={() => navigation.navigate("PageProfile", {userId: item._id})}>
    <View style={styles.profileContainer}>
      <LinearGradient
        style={styles.profileImageContainer}
        colors={["#CA1D7E", "#E35157", "#F2703F"]}
        start={{ x: 0.0, y: 1.0 }}
        end={{ x: 1.0, y: 1.0 }}
      >
        <Image style={styles.profileImage} source={{ uri: item.pictureUrl }} />
      </LinearGradient>
      <Text numberOfLines={1} style={styles.profileName}>
        {item.name}
      </Text>
    </View>
  </TouchableOpacity>
);

export default function App(props, {navigation, route}) {
  const [posts, setPosts] = useState([]);
  const [userProfiles, setUserProfiles] = useState([]);
  let [loading, setLoading] = useState(false);

  //Get data
  useEffect(() => {
    onRefresh();
  }, []);

  useEffect(() => {
    //console.log(props.navigation)
    props.navigation.addListener('focus', () => {
      console.log("Focus - Home")
      onRefresh()
    })
  }, []);

  const onRefresh = () => {
    setLoading(true);
    getData("/posts/").then((x) => setPosts(x));
    getData("/auth/user-info/").then((x) => {
      setUserProfiles(
        x.filter(
          (profile) => profile.role === "band" || profile.role === "musician"
        ) //Show only bands and musicians
      );
      setLoading(false);
    });
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      <View style={styles.topSection}>
        <Text style={styles.topText}>Trending</Text>
        <FlatList
          style={styles.profileList}
          data={userProfiles}
          keyExtractor={(x) => x._id}
          renderItem={({ item }) => <ProfileItem item={item} navigation={props.navigation} />}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <PostList items={posts} navigation={props.navigation} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.WHITE,
    paddingTop: 5,
    paddingHorizontal: 5,
  },
  topSection: {
    height: 140,
    alignSelf: "stretch",
  },
  profileContainer: {
    flexDirection: "column",
    alignItems: "center",
    margin: 3,
  },
  profileImageContainer: {
    borderRadius: 77 / 2,
    width: 77,
    height: 77,
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
    borderColor: "#fff",
    borderWidth: 3,
  },
  profileName: {
    marginTop: 6,
  },
  profileList: {},
  topText: {
    alignSelf: "flex-start",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  divider: {
    borderWidth: 1,
    borderColor: "#eee",
  },
  postContainer: {
    borderWidth: 1,
    borderColor: theme.COLORS.LIGHTGRAY,
    borderRadius: 5,
    marginVertical: 3,
  },
  profilePostContainer: {
    flexDirection: "row",
    padding: 5,
  },
  profileImg: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profileTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  mediaContainer: {
    height: 240,
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 5,
  },
});
