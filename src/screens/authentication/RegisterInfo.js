import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { BarIndicator } from "react-native-indicators";
import * as Toast from "../../components/Toast";
import * as ImagePicker from "expo-image-picker";
import Input from "../../components/Input";
import GroupInput from "../../components/GroupInput";
import theme from "../../theme";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { getData, updateData, postData } from "../../backend/FetchData";
import { saveAuthInfo } from "../../backend/AuthStorage";

//Redux
import { connect } from "react-redux";
import * as actions from "../../redux/actions/AuthActions";

function App(props) {
  let { info } = props.route.params;

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [picture, setPicture] = useState({});

  const [skills, setSkills] = useState([]);
  const [skillString, setSkillString] = useState("");

  const [genres, setGenres] = useState([]);
  const [genreString, setGenreString] = useState("");

  const [instruments, setInstruments] = useState([]);
  const [instrumentString, setInstrumentString] = useState("");

  useEffect(() => {
    setPicture({
      url:
        "https://ui-avatars.com/api/?size=256&background=fff&color=f5b333&name=Plug IN",
    });
  }, []);

  const save = async () => {
    try {
      if (picture.base64string) {
        const promise = uploadImage(picture.base64string);
        promise.then((data) => {
          console.log(data);
          postUser(data);
        });
      } else {
        await postUser();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const postUser = async (uploadedImage) => {
    var pictures = [];
    //const oldPictures = dataImages;
    //console.log("PostUser----");
    //console.log(uploadedImage);

    if (picture.base64string) {
      if (uploadedImage != undefined && uploadedImage.status === 200) {
        pictures = {
          name: uploadedImage.data.id,
          url: uploadedImage.data.url,
        };
      }
    } else {
      pictures = picture;
    }
    //console.log("pictures")
    //console.log(pictures)

    const newUser = {
      username: info.username,
      name: info.fname,
      address: "",
      title: title,
      skills: skills,
      instruments: instruments,
      genres: genres,
      about: about,
      pictureUrl: pictures.url,
      status: "active",
    };
    console.log(newUser);
    try {
      const response = await updateData("/auth/user-info/", newUser);
      if (response) {
        //Error
        if (response.status >= 400) {
          response.text().then((text) => {
            Toast.showError(text);
            //console.log(text);
          });
          return;
        }
        if (response.status === 200) {
          signIn(info.username, info.password);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const register = async () => {
    setLoading(true);
    const newUser = {
      username: info.username,
      password: info.password,
      role: info.role,
    };
    try {
      const response = await postData("/auth/register", newUser);
      if (response) {
        //Error
        if (response.status >= 400) {
          response.text().then((text) => Toast.showError(text));
          props.navigation.navigation("SignIn");
        } else {
          save();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const signIn = async (username, pass) => {
    const authData = {
      username,
      password: pass,
    };
    const response = await postData("/auth/signin/", authData);
    try {
      if (response) {
        if (response.status >= 200 && response.status <= 300) {
          //success
          const data = await response.json();

          const userInfo = getData("/auth/user-info/" + data._id);
          userInfo.then((dataInfo) => {
            props.setAuth(dataInfo);
          });
          //saving auth information (id and token)
          await saveAuthInfo({ ...data, role: userInfo.role });

          setLoading(false);
        } else {
          //fail
          response.text().then((text) => Toast.showError(text));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Image Manipulation
  const uploadImage = async (base64String) => {
    try {
      var tmpImage = {
        folder: "profile",
        base64string: base64String,
      };
      const response = await postData("/storage/", tmpImage);
      if (response) {
        if (response.status == 200) {
          const data = await response.json();
          return {
            status: response.status,
            data,
          };
        } else {
          const text = await response.text();
          return {
            status: response.status,
            data: text,
          };
        }
      }
    } catch (error) {
      //console.error("ERROR ", error)
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

  const addFunc = (type) => {
    switch (type) {
      case "Genre": {
        if (genreString != "") {
          let index = genres.length != 0 ? genres[genres.length - 1].id + 1 : 0;
          let tmpArray = genres.filter((x) => x);
          tmpArray.push({ id: index, name: genreString });
          setGenres(tmpArray);
          setGenreString("");
        }
      }
      case "Instruments": {
        if (instrumentString != "") {
          let index =
            instruments.length != 0
              ? instruments[instruments.length - 1].id + 1
              : 0;
          let tmpArray = instruments.filter((x) => x);
          tmpArray.push({ id: index, name: instrumentString });
          setInstruments(tmpArray);
          setInstrumentString("");
        }
      }
      case "Skills": {
        if (skillString != "") {
          let index = skills.length != 0 ? skills[skills.length - 1].id + 1 : 0;
          let tmpArray = skills.filter((x) => x);
          tmpArray.push({ id: index, name: skillString });
          setSkills(tmpArray);
          setSkillString("");
        }
      }
    }
  };

  const deleteFunc = (id, type) => {
    let array = [];
    switch (type) {
      case "Genre": {
        if (genres.length > 1) {
          array = genres.filter((x) => x.id != id);
          setGenres(array);
        } else if (genres.length == 1) {
          setGenres([]);
        }
      }
      case "Instruments": {
        if (instruments.length > 1) {
          array = instruments.filter((x) => x.id != id);
          setInstruments(array);
        } else if (instruments.length == 1) {
          setInstruments([]);
        }
      }
      case "Skills": {
        if (skills.length > 1) {
          array = skills.filter((x) => x.id != id);
          setSkills(array);
        } else if (skills.length == 1) {
          setSkills([]);
        }
      }
    }
  };

  const renderItem = (item, type) => {
    return (
      <View style={styles.itemViewContainer}>
        <Text style={{ fontSize: 14 }}>{item.name}</Text>
        <TouchableOpacity onPress={() => deleteFunc(item.id, type)}>
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
          style={{
            alignSelf: "center",
            alignContent: "center",
            alignItems: "center",
            height: 180,
          }}
        >
          <Image
            style={{ height: 100, width: 100 }}
            source={require("../../../assets/headPhoneWhite.png")}
          />
          <BarIndicator size={50} color={theme.COLORS.WHITE} count={7} />
        </View>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            <KeyboardAvoidingView
              enabled
              behavior={Platform.OS === "ios" ? "position" : null}
            >
              <View>
                <View style={styles.titleContainer}>
                  <View style={styles.img}>
                    <Image
                      style={{ width: 160, height: 160, borderRadius: 80 }}
                      source={{
                        uri: picture.url,
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
                          info.role == "musician"
                            ? "Artistic Name"
                            : "Band Name"
                        }
                        textContentType="name"
                        containerStyle={styles.inputContainer}
                        value={title}
                        onChangeText={(text) => setTitle(text)}
                      />

                      <GroupInput
                        icon="musical-notes"
                        placeholder="Add Genre..."
                        data={genres}
                        searchBarText={genreString}
                        onChangeText={(text) => setGenreString(text)}
                        renderItem={({ item }) => renderItem(item, "Genre")}
                        onSubmitEditing={() => addFunc("Genre")}
                      />

                      {info.role == "musician" ? (
                        <>
                          <GroupInput
                            iconFontAwesome5="guitar"
                            placeholder="Add Instrument..."
                            data={instruments}
                            searchBarText={instrumentString}
                            onChangeText={(text) => setInstrumentString(text)}
                            renderItem={({ item }) =>
                              renderItem(item, "Instruments")
                            }
                            onSubmitEditing={() => addFunc("Instruments")}
                          />
                          <GroupInput
                            icon="construct"
                            placeholder="Add Skill..."
                            data={skills}
                            searchBarText={skillString}
                            onChangeText={(text) => setSkillString(text)}
                            renderItem={({ item }) =>
                              renderItem(item, "Skills")
                            }
                            onSubmitEditing={() => addFunc("Skills")}
                          />
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
                      height: 120,
                      textAlignVertical: "top",
                    }}
                    value={about}
                    onChangeText={(text) => setAbout(text)}
                  />
                </View>
              </View>
            </KeyboardAvoidingView>
            <TouchableOpacity style={styles.button} onPress={() => register()}>
              <Text style={styles.text}>Register</Text>
            </TouchableOpacity>
          </ScrollView>

          <TouchableOpacity
            style={styles.headerBackButton}
            onPress={() => props.navigation.goBack()}
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

const mapDispatchToProps = (dispatch) => {
  return {
    setAuth: (auth) => dispatch(actions.setAuth(auth)),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.PRIMARY,
    justifyContent: "center",
  },
  itemViewContainer: {
    padding: 3,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: theme.COLORS.LIGHTGRAY,
    flexDirection: "row",
    marginVertical: 5,
    marginHorizontal: 3,
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
    marginTop: 50,
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
    marginTop: 20,
    marginBottom: 30,
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

export default connect(null, mapDispatchToProps)(App);
