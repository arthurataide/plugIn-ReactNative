import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import theme from "../../theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Button from "../../components/Button";
import Input from "../../components/Input";
import GroupInput from "../../components/GroupInput";
import Carousel, { ParallaxImage } from "react-native-snap-carousel";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { postData } from "../../backend/FetchData";
import * as Toast from "../../components/Toast";
import { getAuthInfo } from "../../backend/AuthStorage";

const { width, height } = Dimensions.get("window");

export default ({ navigation }) => {
  const [description, setDescription] = useState("");
  const [videos, setVideos] = useState([]);
  const [videosString, setVideosString] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState();
  const ref = useRef(null);

  // useEffect(()=>{
  //   getAuthInfo().then((user)=>console.log(user._id))
  // },[])

  const deleteImage = (index) => {
    console.log("delete: " + index);
    const newArray = images;
    if (index > -1) {
      newArray.splice(index, 1);
    }
    setActiveSlide(0);

    //setImages([]);
    if (newArray.length == 0) {
      setImages([]);
    } else {
      setImages(newArray);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      let newImg = {
        type: "image",
        url: result.uri,
        base64string: "data:image/jpeg;base64," + result.base64,
      };
      let newArray = createImageArray(newImg);
      setImages([]);
      setImages(newArray);
    }
  };

  const createImageArray = (newItem) => {
    const image = images;
    image.push(newItem);

    return image;
  };

  const saveData = async () => {
    if (
      description.trim() == "" ||
      (images.length == 0 && videos.length == 0)
    ) {
      Toast.showError(
        "Please, your post must have at least an Image or Video and a description !"
      );
      return;
    }

    setLoading(true);
    let uploadedImages = await uploadBatchImages();
    await createPost(uploadedImages);
    setLoading(false);
  };

  const createPost = async (uploadedImages) => {
    const user = await getAuthInfo();
    console.log(user);

    let media = [];

    uploadedImages.forEach((i) => {
      if (i != undefined && i.status === 200) {
        media.push({
          type: "image",
          url: i.data.url,
        });
      }
    });
    videos.forEach((v) => {
      media.push({
        type: v.type,
        url: v.url,
      });
    });

    const newPost = {
      userId: user._id,
      description,
      media,
    };

    const response = await postData("/posts/", newPost);
    if (response) {
      //Error
      if (response.status >= 400) {
        response.text().then((text) => Toast.showError(text));
        return;
      }
      if (response.status === 200) {
        Toast.show("Post created successfully!");
        // setReadyDataImages([])
        // setLoading(false)
        navigation.navigate("Home");
      }
    }
  };

  const uploadBatchImages = async () => {
    //setLoading(true)
    console.log("HERE");

    try {
      //const urlArray = images.filter((x) => !x.base64string);
      const newArray = images.filter((x) => x.base64string);
      const promises = newArray.map((image) => uploadImage(image.base64string));
      const resultUploadImage = await Promise.all(promises);
      return resultUploadImage;
      //await postProduct(resultUploadImage, urlArray);
    } catch (error) {
      console.error(error);
    } finally {
      //setLoading(false)
    }
  };

  const uploadImage = async (base64String) => {
    try {
      var tmpImage = {
        folder: "events",
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

  const renderItem = useCallback(
    ({ item, index }, parallaxProps) => (
      <View style={styles.card} key={index}>
        {console.log(item.url)}
        <ParallaxImage
          source={{ uri: item.url }}
          containerStyle={styles.imageContainer}
          style={styles.image}
          parallaxFactor={0.2}
          shouldComponentUpdate={true}
          {...parallaxProps}
        />
        <TouchableOpacity
          style={styles.trash}
          onPress={() => deleteImage(index)}
        >
          <FontAwesome5 name={"trash"} size={20} color={theme.COLORS.PRIMARY} />
        </TouchableOpacity>
      </View>
    ),
    [images]
  );

  const getVideoId = (url) => {
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
      return match[2];
    } else {
      //error
    }
  };

  const addFunc = () => {
    if (videosString != "") {
      const videoId = getVideoId(videosString);
      if (videoId != undefined) {
        let index = Math.floor(Math.random() * 100 + 1);
        console.log(index);
        let tmpArray = videos.filter((x) => x);
        tmpArray.push({ _id: index, url: videosString, type: "video" });
        setVideos(tmpArray);
        setVideosString("");
      } else {
        Toast.showError("Video Url is not Valid");
      }
    }
  };

  const deleteFunc = (id) => {
    let array = [];
    if (videos.length > 1) {
      array = videos.filter((x) => x._id != id);
      setVideos(array);
    } else if (videos.length == 1) {
      setVideos([]);
    }
  };
  const renderVideos = (item) => {
    return (
      <View style={styles.itemViewContainer}>
        <Text style={{ fontSize: 14 }}>{item.url}</Text>
        <TouchableOpacity
          style={{ position: "absolute", right: 5 }}
          onPress={() => deleteFunc(item._id)}
        >
          <Ionicons name={"close"} size={20} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.mainContainer}
        resetScrollToCoords={{ x: 0, y: 0 }}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Create your post</Text>
          <View
            style={{
              height: 240,
              borderTopWidth: 1,
              borderTopColor: theme.COLORS.LIGHTGRAY,
              marginTop: 10,
            }}
          >
            <Carousel
              ref={ref}
              data={images}
              extraData={images}
              sliderWidth={width}
              sliderHeight={width}
              itemWidth={width - 30}
              renderItem={renderItem}
              hasParallaxImages={true}
              enableMomentum={true}
              decelerationRate={1}
              onSnapToItem={(index) => setActiveSlide(index)}
            />
            <TouchableOpacity style={styles.pickImg} onPress={pickImage}>
              <FontAwesome5
                name={"plus"}
                size={30}
                color={theme.COLORS.PRIMARY}
              />
            </TouchableOpacity>
          </View>
          <GroupInput
            icon="film"
            placeholder="Youtube Video URL..."
            searchBarText={videosString}
            data={videos}
            onChangeText={(text) => setVideosString(text)}
            renderItem={({ item }) => renderVideos(item)}
            onSubmitEditing={() => addFunc()}
            flatListVertical={true}
            edit={true}
          />

          <Input
            icon="chatbox"
            value={description}
            onChangeText={(text) => setDescription(text)}
            placeholder={"Tell everyone what you want..."}
            containerStyle={styles.inputContainer}
            textInputStyle={{
              height: 200,
              textAlignVertical: "top",
            }}
            multiline={true}
          />
          <Button
            loading={loading}
            title={"Post"}
            layout={"filled"}
            onPress={() => saveData()}
          />
        </ScrollView>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: theme.COLORS.WHITE,
    flex: 1,
    padding: 5,
  },
  title: {
    fontSize: 20,
    alignSelf: "center",
    fontWeight: "bold",
    color: theme.COLORS.TITLE,
  },
  pickImg: {
    position: "absolute",
    bottom: 10,
    right: 10,
    height: 50,
    width: 50,
    borderRadius: 30,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  trash: {
    position: "absolute",
    top: 10,
    right: 10,
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: width - 60,
    height: 400,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: theme.COLORS.WHITE,
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginVertical: 5,
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
    alignItems: "center",
    marginVertical: 5,
    marginHorizontal: 5,
  },
});
