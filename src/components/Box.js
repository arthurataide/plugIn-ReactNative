import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Text,
  Dimensions,
} from "react-native";
import theme from "../theme";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const Box = ({ title, items }) => {
  //console.log(items);
  return (
    <View style={styles.boxContainer}>
      <View style={styles.boxHeader}>
        <Text style={styles.boxHeaderTitle}>{title}</Text>
      </View>
      <View style={styles.boxBody}>
        {items != undefined ? (
          items.map((i, key) => (
            <View style={styles.itemContainer} key={i._id}>
              <Text>{i.name}</Text>
            </View>
          ))
        ) : (
          <></>
        )}
        {/* <FlatList
          data={items}
          columnWrapperStyle={{ flex: 1, justifyContent: "space-evenly" }}
          numColumns={3}
          keyExtractor={(x) => x._id}
          renderItem={({ item }) => renderItem(item)}
        /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  boxContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.COLORS.LIGHTGRAY,
    borderRadius: 5,
    marginBottom: 20,
  },
  boxHeader: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.LIGHTGRAY,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: theme.COLORS.LIGHTGRAY,
  },
  boxHeaderTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
  boxBody: {
    flex:1, 
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
  },
  itemContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: theme.COLORS.LIGHTGRAY,
  },
});

export default Box;
