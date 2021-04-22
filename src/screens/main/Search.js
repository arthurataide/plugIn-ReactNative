import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { SearchBar } from "react-native-elements";
import theme from "../../theme";
import { getData } from "../../backend/FetchData";

export default (props) => {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  const [results, setResults] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    getData("/auth/user-info").then((x) => {
      setUsers(x);
    });
  };

  const searchUsers = (text) => {
    console.log(text);

    let filtered = users.filter((x) => {
      var result;
      if (x.name.toUpperCase().includes(text.toUpperCase())) {
        result = x.name.toUpperCase().includes(text.toUpperCase());
      } else if (x.title.toUpperCase().includes(text.toUpperCase())) {
        result = x.title.toUpperCase().includes(text.toUpperCase());
      }
      //console.log(searchCat(text))
      return result;
    });

    setResults(filtered);
    if (text == "") {
      console.log("Empty");
      setResults([]);
    }
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate("PageProfile", {userId: item._id})}>
        <Image source={{ uri: item.pictureUrl }} style={styles.img} />
        <View>
          <Text style={styles.title}>{item.title != "" ? item.title : item.name}</Text>
          <Text style={styles.descrip}>{item.role}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder={"Search here..."}
        onChangeText={(text) => {
          setSearch(text);
          searchUsers(text);
        }}
        value={search}
        containerStyle={styles.searchBarContainerStyle}
        inputContainerStyle={styles.searchBarInputContainerStyle}
        inputStyle={styles.searchBarInputStyle}
        placeholderTextColor="rgba(0,0,0, 0.2)"
        searchIcon={{ color: theme.COLORS.PRIMARY }}
      />
      <FlatList
        data={results}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={(x) => x._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchBarContainerStyle: {
    backgroundColor: "transparent",
    borderTopColor: "transparent",
    borderBottomColor: theme.COLORS.LIGHTGRAY,
    padding: 5,
  },
  searchBarInputContainerStyle: {
    backgroundColor: "transparent",
  },
  searchBarInputStyle: {
    backgroundColor: "white",
    fontSize: 17,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.LIGHTGRAY,
  },
  img: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  title: {
      fontSize: 15,
      fontWeight: 'bold'
  },
  descrip: {
    textTransform: 'capitalize'
  }
});
