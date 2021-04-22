import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import theme from "../../../theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import Button from "../../../components/Button";
import FormInput from "../../../components/FormInput";
import Carousel, { ParallaxImage } from "react-native-snap-carousel";
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const { width, height } = Dimensions.get("window");

export default () => {
  const [date, setDate] = useState(new Date());
  const [images, setImages] = useState([]);
  const ref = useRef(null);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const deleteImage = (index) => {
    // console.log("delete: " + index)
    // const newArray = dataImages;
    // if (index > -1) {
    //     newArray.splice(index, 1);
    // }
    // setActiveSlide(0);
    // setDataImages([]);
    // setDataImages(newArray);
    // if(newArray.length == 0){
    //     setDataImages([])
    // }
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
      //setDataImages([]);
      // let tmpImages = images;
      // tmpImages.push(newImg);
      // //console.log(tmpImages)

            setImages([]);
            setImages(newArray);
    }
  };

  const createImageArray = (newItem) => {
    const image = images;
    image.push(newItem);

    return image;
  };

  useEffect(()=>{
    console.log(images)
  }, [images])

  // const renderItem = ({ item, index }) => {
  //   return (
  //     <View>
  //       {console.log(item)}
  //         <Image
  //           style={{ height: 240, width: width - 40, borderRadius: 10 }}
  //           source={{ uri: item.url }}
  //         />
  //       <TouchableOpacity
  //         style={styles.trash}
  //         onPress={() => deleteImage(index)}
  //       >
  //         <FontAwesome5 name={"trash"} size={20} color={theme.COLORS.PRIMARY} />
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };

  const renderItem = useCallback(
    ({ item, index }, parallaxProps) => (
      <View style={styles.card} key={index}>
        <ParallaxImage
          source={{ uri: item.url }}
          containerStyle={styles.imageContainer}
          style={styles.image}
          parallaxFactor={0.2}
          shouldComponentUpdate={true}
          {...parallaxProps}
        />
        <TouchableOpacity style={styles.trash} onPress={() => deleteImg(index)}>
          <FontAwesome5 name={"trash"} size={20} color={theme.COLORS.PRIMARY} />
        </TouchableOpacity>
      </View>
    ),
    [images]
  );

  return (
    <View style={styles.mainContainer}>
      <ScrollView>
        <View style={styles.container}>
          <View style={{ height: 240 }}>
            <Carousel
              ref={ref}
              data={images}
              extraData={images}
              sliderWidth={width}
              sliderHeight={width}
              itemWidth={width - 60}
              renderItem={renderItem}
              hasParallaxImages={true}
              enableMomentum={true}
              decelerationRate={0.9}
              onSnapToItem={(index) => {}}
            />
            <TouchableOpacity style={styles.pickImg} onPress={pickImage}>
              <FontAwesome5
                name={"plus"}
                size={30}
                color={theme.COLORS.PRIMARY}
              />
            </TouchableOpacity>
          </View>

          <FormInput style={styles.inputText} placeholder={"Title"} />
          <View style={styles.row}>
            <View style={styles.dateContainer}>
              <DateTimePicker
                style={{ width: theme.SIZES.MAX_WIDTH / 2 - 20 }}
                testID="dateTimePicker"
                value={date}
                mode={"date"}
                onChange={onChange}
              />
            </View>
            <View style={styles.dateContainer}>
              <DateTimePicker
                testID="dateTimePicker2"
                value={date}
                mode={"time"}
                is24Hour={true}
                onChange={onChange}
              />
            </View>
          </View>
          <FormInput style={styles.inputText} placeholder={"Address"} />
          <FormInput
            style={styles.inputText}
            placeholder={"Event Description"}
            multiline={true}
          />
        </View>
      </ScrollView>

      <Button title={"SAVE"} layout={"filled"} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: theme.COLORS.WHITE,
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  container: {
    // flex: 1,
    // backgroundColor: "black",
    alignItems: "center",
    justifyContent: "flex-start",
    height: height - 190,
  },
  dateContainer: {
    borderWidth: 2,
    borderColor: theme.COLORS.PRIMARY,
    borderRadius: 10,
    width: theme.SIZES.MAX_WIDTH / 2 - 10,
    padding: 10,
    marginVertical: 2,
  },
  row: {
    width: theme.SIZES.MAX_WIDTH,
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
});
