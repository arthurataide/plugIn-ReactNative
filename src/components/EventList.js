import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  Dimensions,
} from "react-native";
import theme from "../theme";
import Carousel from "react-native-snap-carousel";
import YoutubePlayer from "react-native-youtube-iframe";
import { TouchableOpacity } from "react-native-gesture-handler";
import Moment from "moment";

const { width } = Dimensions.get("window");

const PostList = ({ items, navigation }) => {
  const ref = useRef(null);

  const getVideoId = (url) => {
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
      return match[2];
    } else {
      //error
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <View>
        {item.type == "image" ? (
          <Image
            style={{ height: 240, width: width - 22, borderRadius: 10 }}
            source={{ uri: item.url }}
          />
        ) : (
          <YoutubePlayer
            webViewStyle={{ borderRadius: 10 }}
            height={240}
            width={width - 22}
            play={false}
            videoId={getVideoId(item.url)}
          />
        )}
      </View>
    );
  };
  return (
    <View style={styles.viewContainer}>
      {items.map((item, key) => (
        <View style={styles.postContainer} key={key}>
          <View style={styles.profilePostContainer}>
            <TouchableOpacity
              style={styles.profilePostContainer}
              onPress={() => navigation.navigate("PageProfile", {userId: item.userId})}
            >
              <Image
                style={styles.profileImg}
                source={{ uri: item.pictureUrl }}
              />
              <View>
                <Text style={styles.profileTitle}>{item.name}</Text>
                <Text>
                  {Moment(item.datetime).format("MMM D, YYYY, h:mm A")}
                </Text>
                <Text>{item.location}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.mediaContainer}>
            <Carousel
              ref={ref}
              style={{ height: 240 }}
              data={item.media}
              sliderWidth={width}
              sliderHeight={240}
              itemWidth={width}
              itemHeight={240}
              renderItem={renderItem}
              enableMomentum={true}
              decelerationRate={1}
            />
          </View>
          <View style={styles.separator} />
          <View style={styles.commentsContainer}>
            <Text style={styles.title}>{item.title}</Text>
          </View>
          <View style={styles.commentsContainer}>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    // flex: 1,
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
    marginHorizontal: 5,
    borderRadius: 5,
  },
  commentsContainer: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
  },
  separator: {
    borderTopColor: theme.COLORS.LIGHTGRAY,
    borderTopWidth: 1,
    marginVertical: 5,
  },
});

export default PostList;
