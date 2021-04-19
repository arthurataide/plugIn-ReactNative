import React, { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  ActivityIndicator,
  Text,
  Image,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from "react-native-indicators";
import * as Toast from "../../components/Toast";
import { SearchBar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import Input from "../../components/Input";
import theme from "../../theme";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";

export default function App({ route, navigation }) {
  let { info } = route.params;

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [picture, setPicture] = useState();

  const [skills, setSkills] = useState([]);
  const [skillString, setSkillString] = useState("");

  const [genres, setGenres] = useState([]);
  const [genreString, setGenreString] = useState("");

  const [flatListRef, setFlatListRef] = useState();

  const save = () => {
    setLoading(true);
    setTimeout(function () {
      setLoading(false);
    }, 7000);
  };

  const addSkill = () => {
    console.log("addSkill");
    if (skillString != "") {
      let index = skills.length != 0 ? skills[skills.length - 1].id + 1 : 0;
      console.log(index);
      let tmpArray = skills.filter((x) => x);
      tmpArray.push({ id: index, name: skillString });
      setSkills(tmpArray);
      console.log(skills);
      setSkillString("");
    }
  };

  const deleteSkill = (id) => {
    console.log(id);
    let array = [];
    if (skills.length > 1) {
      array = skills.filter((x) => x.id != id);
      setSkills(array);
      console.log("Item: " + skills.length);
      console.log(skills);
    } else if (skills.length == 1) {
      console.log("skill 1");
      setSkills([]);
    }
  };
  const addGenre = () => {
    console.log("addGenre");
    if (genreString != "") {
      let index = genres.length != 0 ? genres[genres.length - 1].id + 1 : 0;
      console.log(index);
      let tmpArray = genres.filter((x) => x);
      tmpArray.push({ id: index, name: genreString });
      setGenres(tmpArray);
      console.log(genres);
      setGenreString("");
    }
  };

  const deleteGenre = (id) => {
    console.log(id);
    let array = [];
    if (genres.length > 1) {
      array = genres.filter((x) => x.id != id);
      setGenres(array);
      console.log("Item: " + genres.length);
      console.log(genres);
    } else if (genres.length == 1) {
      console.log("skill 1");
      setGenres([]);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    if (!result.cancelled) {
      let newImg = {
        url: result.uri,
        base64string: "data:image/jpeg;base64," + result.base64,
      };
      setPicture(newImg);
    }
  };

  const renderSkill = (item) => {
    return (
      <View
        style={{
          padding: 3,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: theme.COLORS.LIGHTGRAY,
          flexDirection: "row",
          marginVertical: 5,
          marginHorizontal: 3,
        }}
      >
        <Text style={{ fontSize: 14 }}>{item.name}</Text>
        <TouchableOpacity onPress={() => deleteSkill(item.id)}>
          <Ionicons name={"close"} size={16} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderGenre = (item) => {
    return (
      <View
        style={{
          padding: 3,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: theme.COLORS.LIGHTGRAY,
          flexDirection: "row",
          marginVertical: 5,
          marginHorizontal: 3,
        }}
      >
        <Text style={{ fontSize: 14 }}>{item.name}</Text>
        <TouchableOpacity onPress={() => deleteGenre(item.id)}>
          <Ionicons name={"close"} size={16} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {loading ? (
        <View
          style={{ alignSelf: 'center' ,alignContent: "center", alignItems: 'center', height: 180 }}
        >
          <Image
            style={{ height: 100, width: 100 }}
            source={require("../../../assets/headPhoneWhite.png")}
          />
          <BarIndicator
            size={50}
            color={theme.COLORS.WHITE}
            count={7}
          />
        </View>
      ) : (
        <>
          <KeyboardAvoidingView
            enabled
            behavior={Platform.OS === "ios" ? "position" : null}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.titleContainer}>
                <View style={styles.img}>
                  <Image
                    style={{ width: 160, height: 160, borderRadius: 80 }}
                    source={{
                      uri: picture
                        ? picture.url
                        : "https://ui-avatars.com/api/?size=256&background=fff&color=f5b333&name=Plug IN",
                    }}
                  />
                </View>
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 68,
                    marginTop: 10,
                    alignSelf: "center",
                  }}
                  onPress={pickImage}
                >
                  <Ionicons name={"camera"} size={30} />
                </TouchableOpacity>
              </View>
              <View style={styles.mainContainer}>
                {info.role != "fan" ? (
                  <>
                    <Input
                      icon="person-add"
                      placeholder={
                        info.role == "musician" ? "Artistic Name" : "Band Name"
                      }
                      textContentType="name"
                      containerStyle={styles.inputContainer}
                      value={title}
                      onChangeText={(text) => setTitle(text)}
                    />
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: theme.COLORS.LIGHTGRAY,
                        borderRadius: 5,
                        padding: 3,
                      }}
                    >
                      <FlatList
                        ref={(ref) => setFlatListRef(ref)}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        onContentSizeChange={() =>
                          flatListRef.scrollToEnd({ animated: true })
                        }
                        onLayout={() =>
                          flatListRef.scrollToEnd({ animated: true })
                        }
                        data={genres}
                        extraData={genres}
                        renderItem={({ item }) => renderGenre(item)}
                        keyExtractor={(x) => `${x.id}`}
                      />
                      <SearchBar
                        placeholder="Add Genre..."
                        onChangeText={(text) => setGenreString(text)}
                        value={genreString}
                        containerStyle={{
                          backgroundColor: "transparent",
                          borderTopColor: "transparent",
                          borderBottomColor: "transparent",
                          padding: 0,
                        }}
                        inputContainerStyle={{ backgroundColor: "transparent" }}
                        inputStyle={{ backgroundColor: "white", fontSize: 14 }}
                        placeholderTextColor={"#C7C7CD"}
                        searchIcon={() => {
                          return (
                            <Ionicons
                              name={"musical-notes"}
                              size={22}
                              color="#555"
                            />
                          );
                        }}
                        onSubmitEditing={() => addGenre()}
                        onBlur={() => addGenre()}
                      />
                    </View>
                    {info.role == "musician" ? (
                      <>
                        <View
                          style={{
                            borderWidth: 1,
                            borderColor: theme.COLORS.LIGHTGRAY,
                            borderRadius: 5,
                            padding: 3,
                            marginTop: 6,
                          }}
                        >
                          <FlatList
                            ref={(ref) => setFlatListRef(ref)}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            onContentSizeChange={() =>
                              flatListRef.scrollToEnd({ animated: true })
                            }
                            onLayout={() =>
                              flatListRef.scrollToEnd({ animated: true })
                            }
                            data={skills}
                            extraData={skills}
                            renderItem={({ item }) => renderSkill(item)}
                            keyExtractor={(x) => `${x.id}`}
                          />
                          <SearchBar
                            placeholder="Add Skill..."
                            onChangeText={(text) => setSkillString(text)}
                            value={skillString}
                            containerStyle={{
                              backgroundColor: "transparent",
                              borderTopColor: "transparent",
                              borderBottomColor: "transparent",
                              padding: 0,
                            }}
                            inputContainerStyle={{
                              backgroundColor: "transparent",
                            }}
                            inputStyle={{
                              backgroundColor: "white",
                              fontSize: 14,
                            }}
                            placeholderTextColor={"#C7C7CD"}
                            searchIcon={() => {
                              return (
                                <Ionicons
                                  name={"construct"}
                                  size={22}
                                  color="#555"
                                />
                              );
                            }}
                            onSubmitEditing={() => addSkill()}
                            onBlur={() => addSkill()}
                          />
                        </View>
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                )}

                <Input
                  icon="document-text"
                  placeholder="Tell more about you..."
                  containerStyle={[styles.inputContainer, {}]}
                  multiline={true}
                  textInputStyle={{
                    height: 150,
                    textAlignVertical: "top",
                  }}
                  value={about}
                  onChangeText={(text) => setAbout(text)}
                />
              </View>
              <TouchableOpacity style={styles.button} onPress={() => save()}>
                <Text style={styles.text}>Register</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
          <TouchableOpacity
            style={styles.headerBackButton}
            onPress={() => navigation.goBack()}
          >
            <FontAwesome5
              name="angle-left"
              color={theme.COLORS.WHITE}
              size={35}
            />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.PRIMARY,
    justifyContent: 'center'
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
    marginBottom: 10,
  },
  img: {
    width: 160,
    height: 160,
    alignSelf: "center",
    borderRadius: 85,
  },
  title: {
    alignSelf: "center",
    color: "white",
    fontSize: 35,
    fontWeight: "700",
  },
  mainContainer: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginHorizontal: 25,
    paddingHorizontal: 20,
    paddingVertical: 20,
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
  activity: {
    alignSelf: "center",
  },
});
