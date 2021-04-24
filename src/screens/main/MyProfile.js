import React, { useEffect, useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useScrollToTop } from "@react-navigation/native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import GroupInput from "../../components/GroupInput";
import { getAuthInfo } from "../../backend/AuthStorage";
import { updateData, postData, getData } from "../../backend/FetchData";
import { BarIndicator } from "react-native-indicators";
import Input from "../../components/Input";
import theme from "../../theme";
import * as Toast from "../../components/Toast"

//Redux
import { connect } from "react-redux";

function App(props) {
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const [role, setRole] = useState("");
  const [picture, setPicture] = useState({});
  const [email, setEmail] = useState("");
  const [fName, setFName] = useState("");
  const [address, setAddress] = useState("");
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");

  const [skills, setSkills] = useState([]);
  const [skillString, setSkillString] = useState("");

  const [genres, setGenres] = useState([]);
  const [genreString, setGenreString] = useState("");

  const [instruments, setInstruments] = useState([]);
  const [instrumentString, setInstrumentString] = useState("");

  const [scrollRef, setScrollRef] = useState(null);

  useEffect(() => {
    onRefresh();
  }, [props.checkAuth]);

  useEffect(() => {
    props.navigation.addListener("focus", () => {
      console.log("Focus - Profile");
      onRefresh();
      if (scrollRef != null) {
        if (Platform == "android") {
          scrollRef.scrollTo({ x: 0, y: 0, animated: true });
        } else {
          scrollRef.scrollTo({ x: 0, y: 0, animated: false });
        }
      }
    });
  }, [props.navigation]);

  const onRefresh = () => {
    setLoading(true);
    if (props.checkAuth[0] != undefined) {
      getAuthInfo().then((x) => {
        //console.log(x);
        setRole(x.role);
        getData("/auth/user-info/" + x._id).then((data) => {
          setPicture({ url: data.pictureUrl });
          setFName(data.name);
          setEmail(data.username);
          setAbout(data.about);
          setTitle(data.title);
          setAddress(data.address);
          setSkills(data.skills);
          setGenres(data.genres);
          setInstruments(data.instruments);
          setLoading(false);
        });
      });
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
          let index = Math.floor(Math.random() * 100 + 1);
          console.log(index);
          let tmpArray = genres.filter((x) => x);
          tmpArray.push({ _id: index, name: genreString });
          setGenres(tmpArray);
          setGenreString("");
          console.log(genres);
        }
        return;
      }
      case "Instruments": {
        if (instrumentString != "") {
          let index = Math.floor(Math.random() * 100 + 1);
          let tmpArray = instruments.filter((x) => x);
          tmpArray.push({ _id: index.toString(), name: instrumentString });
          setInstruments(tmpArray);
          setInstrumentString("");
        }
        return;
      }
      case "Skills": {
        if (skillString != "") {
          let index = Math.floor(Math.random() * 100 + 1);
          let tmpArray = skills.filter((x) => x);
          tmpArray.push({ _id: index, name: skillString });
          setSkills(tmpArray);
          setSkillString("");
        }
        return;
      }
    }
  };

  const deleteFunc = (id, type) => {
    let array = [];
    switch (type) {
      case "Genre": {
        if (genres.length > 1) {
          array = genres.filter((x) => x._id != id);
          setGenres(array);
        } else if (genres.length == 1) {
          setGenres([]);
        }
        return;
      }
      case "Instruments": {
        if (instruments.length > 1) {
          array = instruments.filter((x) => x._id != id);
          setInstruments(array);
        } else if (instruments.length == 1) {
          setInstruments([]);
        }
        return;
      }
      case "Skills": {
        if (skills.length > 1) {
          array = skills.filter((x) => x._id != id);
          setSkills(array);
        } else if (skills.length == 1) {
          setSkills([]);
        }
        return;
      }
    }
  };

  const save = async () => {
    setLoadingSave(true);
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
      username: email,
      name: fName,
      address: address,
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
          Toast.show("You Profile was updated succesfully !")
          setLoadingSave(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = (item, type) => {
    return (
      <View style={styles.itemViewContainer}>
        <Text style={{ fontSize: 14 }}>{item.name}</Text>
        <TouchableOpacity onPress={() => deleteFunc(item._id, type)}>
          <Ionicons name={"close"} size={16} />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flex: 1, marginTop: 0 }}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={false}
      >
        <ScrollView
          ref={(ref) => setScrollRef(ref)}
          scrollsToTop={true}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          
          <View style={styles.titleContainer}>
            <View style={styles.img}>
              <Image
                style={{ width: 180, height: 180, borderRadius: 90 }}
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
          <Input
            icon="md-mail"
            placeholder="Email"
            keyboardType="email-address"
            textContentType="emailAddress"
            containerStyle={styles.inputContainerFalse}
            value={email}
            onChangeText={(text) => setEmail(text)}
            autoCapitalize="characters"
            editable={false}
          />
          <Input
            icon="location"
            placeholder="Address"
            textContentType="fullStreetAddress"
            containerStyle={styles.inputContainer}
            value={address}
            onChangeText={(text) => setAddress(text)}
            autoCapitalize="characters"
          />
          <Input
            icon="person"
            placeholder="Full Name"
            textContentType="name"
            containerStyle={styles.inputContainer}
            value={fName}
            onChangeText={(fname) => setFName(fname)}
            autoCapitalize="characters"
          />

          {role != "fan" ? (
            <>
              <Input
                icon="person-add"
                placeholder={role == "musician" ? "Artistic Name" : "Band Name"}
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
                edit={true}
              />
              {role == "musician" ? (
                <>
                  <GroupInput
                    iconFontAwesome5="guitar"
                    placeholder="Add Instrument..."
                    data={instruments}
                    searchBarText={instrumentString}
                    onChangeText={(text) => setInstrumentString(text)}
                    renderItem={({ item }) => renderItem(item, "Instruments")}
                    onSubmitEditing={() => addFunc("Instruments")}
                    edit={true}
                  />
                  <GroupInput
                    icon="construct"
                    placeholder="Add Skill..."
                    data={skills}
                    searchBarText={skillString}
                    onChangeText={(text) => setSkillString(text)}
                    renderItem={({ item }) => renderItem(item, "Skills")}
                    onSubmitEditing={() => addFunc("Skills")}
                    edit={true}
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
              height: 80,
              textAlignVertical: "top",
            }}
            value={about}
            onChangeText={(text) => setAbout(text)}
          />
        </ScrollView>
        <TouchableOpacity style={styles.saveButton} onPress={() => save()}>
          {loadingSave ? (
            <BarIndicator size={25} color={theme.COLORS.WHITE} count={3} />
          ) : (
            <FontAwesome5 name="save" color={theme.COLORS.WHITE} size={25} />
          )}
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 5,
  },
  img: {
    height: 180,
    width: 180,
    borderRadius: 90,
    alignSelf: "center",
  },
  titleContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginVertical: 4,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: theme.COLORS.LIGHTGRAY,
  },
  inputContainerFalse: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.COLORS.LIGHTGRAY,
    marginVertical: 4,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: theme.COLORS.LIGHTGRAY,
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
  saveButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: theme.COLORS.PRIMARY,
  },
});

const mapStateToProps = (state) => {
  const { authentication } = state;
  return {
    checkAuth: authentication,
  };
};

export default connect(mapStateToProps, null)(App);
