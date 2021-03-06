import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Platform,
  Text,
} from "react-native";
import theme from "../../../theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Button from "../../../components/Button";
import FormInput from "../../../components/FormInput";
import Carousel, { ParallaxImage } from "react-native-snap-carousel";
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { postData } from "../../../backend/FetchData";
import * as Toast from "../../../components/Toast";
import { getAuthInfo } from "../../../backend/AuthStorage";
import Moment from "moment";

const { width, height } = Dimensions.get("window");

export default ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const ref = useRef(null);


  useEffect(()=>{
    setShowDatePicker(Platform.OS === 'ios')
    setShowTimePicker(Platform.OS === 'ios')

    setIsAndroid(Platform.OS === 'android')
  },[])

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    
    if (isAndroid){
      if (showDatePicker) setShowDatePicker(false)
      if (showTimePicker) setShowTimePicker(false)
    }

    console.log(selectedDate)
    setDate(currentDate);
  };

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
    if (title.trim() == "" || address.trim() == "" || address.trim() == "") {
      Toast.showError("Please complete all required fields!");
      return;
    }

    setLoading(true);
    let uploadedImages = await uploadBatchImages();
    await postEvents(uploadedImages);
    setLoading(false);
  };

  const postEvents = async (uploadedImages) => {
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

    const newEvent = {
      userId: user._id,
      title,
      datetime: date,
      location: address,
      description,
      media,
    };
    console.log(newEvent);

    const response = await postData("/events/", newEvent);
    if (response) {
      //Error
      if (response.status >= 400) {
        response.text().then((text) => Toast.showError(text));
        return;
      }
      if (response.status === 200) {
        Toast.show("Category created successfully!");
        // setReadyDataImages([])
        // setLoading(false)
        navigation.goBack();
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

  return (
    <View style={styles.mainContainer}>
      <ScrollView showsVerticalScrollIndicator = {false}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.mainContainer}
        resetScrollToCoords={{ x: 0, y: 0 }}
      >
        <View style={styles.container}>
          <View style={{ height: 240 }}>
            <Carousel
              ref={ref}
              data={images}
              extraData={images}
              sliderWidth={width}
              sliderHeight={width}
              itemWidth={width - 10}
              renderItem={renderItem}
              hasParallaxImages={true}
              enableMomentum={true}
              decelerationRate={0.9}
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

          <FormInput
            value={title}
            onChangeText={(text) => setTitle(text)}
            style={styles.inputText}
            placeholder={"Title"}
            autoFocus={true}
          />
          <View style={styles.row}>
            <View style={styles.dateContainer}>
              {showDatePicker && (
                <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={"date"}
                onChange={(event, date) => onChange(event, date)}
              />
              )}

              {isAndroid && (
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.androidDatePicker} >{Moment(date).format("MMM D, YYYY")}</Text>
                </TouchableOpacity>
                
              )}
              
            </View>

            <View style={styles.dateContainer}>
            {showTimePicker && (
                <DateTimePicker
                  testID="dateTimePicker2"
                  value={date}
                  mode={"time"}
                  is24Hour={true}
                  onChange={(event, date) => onChange(event, date)}
              />
              )}

              {isAndroid && (
                <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                  <Text style={styles.androidDatePicker} >{Moment(date).format("h:mm A")}</Text>
                </TouchableOpacity>
                
              )}
              
            </View>
          </View>
          <FormInput
            value={address}
            onChangeText={(text) => setAddress(text)}
            style={styles.inputText}
            placeholder={"Address"}
          />
          <FormInput
            value={description}
            onChangeText={(text) => setDescription(text)}
            style={styles.inputText}
            placeholder={"Event Description"}
            multiline={true}
          />
          <Button
            loading={loading}
            title={"SAVE"}
            layout={"filled"}
            onPress={() => saveData()}
          />
        </View>
      </KeyboardAwareScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: theme.COLORS.WHITE,
    flex: 1,
    padding: 5,
  },
  dateContainer: {
    borderWidth: 2,
    borderColor: theme.COLORS.LIGHTGRAY,
    borderRadius: 10,
    width: "49%",
    padding: 15,
    marginVertical: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    width: width - 30,
    height: 240,
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
  androidDatePicker:{
    backgroundColor:"#efeff0", 
    color:"#0285ff", 
    margin:2, 
    alignSelf:'flex-start'
  
  }
});
