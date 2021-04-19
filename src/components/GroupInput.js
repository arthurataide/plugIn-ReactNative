import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import theme from "../theme";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { SearchBar } from "react-native-elements";

const GroupInput = ({
  placeholder,
  icon,
  iconFontAwesome5,
  data,
  searchBarText,
  renderItem,
  onChangeText,
  onSubmitEditing,
}) => {
  const [flatListRef, setFlatListRef] = useState();
  return (
    <View style={styles.viewContainer}>
      <FlatList
        ref={(ref) => setFlatListRef(ref)}
        horizontal
        showsHorizontalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.scrollToEnd({ animated: true })}
        data={data}
        extraData={data}
        renderItem={renderItem}
        keyExtractor={(x) => `${x.id}`}
      />
      <SearchBar
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={searchBarText}
        containerStyle={styles.searchBarContainerStyle}
        inputContainerStyle={styles.searchBarInputContainerStyle}
        inputStyle={styles.searchBarInputStyle}
        placeholderTextColor="rgba(0,0,0, 0.2)"
        searchIcon={() => {
            if(iconFontAwesome5){
                return <FontAwesome5 name={iconFontAwesome5} size={22} color="#555" />;
            } else { 
                return <Ionicons name={icon} size={22} color="#555" />;
            }
        }}
        onSubmitEditing={onSubmitEditing}
        onBlur={onSubmitEditing}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    borderWidth: 1,
    borderColor: theme.COLORS.LIGHTGRAY,
    borderRadius: 5,
    padding: 3,
    marginVertical: 5,
  },
  searchBarContainerStyle: {
    backgroundColor: "transparent",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    padding: 0,
  },
  searchBarInputContainerStyle: {
    backgroundColor: "transparent",
  },
  searchBarInputStyle: {
    backgroundColor: "white",
    fontSize: 14,
  },
});

export default GroupInput;
