import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
} from "react-native";
import {
  getData,
  postData,
  updateData,
  deleteData,
} from "../../../backend/FetchData";
import { SearchBar } from "react-native-elements";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import theme from "../../../theme";

//Redux
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  const { authentication } = state;
  return {
    checkAuth: authentication,
  };
};

function App(props) {
  const [comments, setComments] = useState([]);
  const [actualPostId, setActualPostId] = useState("");
  const [addComment, setAddComment] = useState("");

  const [create, setCreate] = useState(true);
  const [editId, setEditId] = useState("");

  const [loading, setLoading] = useState(false);

  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const onKeyboardShow = (event) =>
    setKeyboardOffset(event.endCoordinates.height);
  const onKeyboardHide = () => setKeyboardOffset(0);
  const keyboardDidShowListener = useRef();
  const keyboardDidHideListener = useRef();

  const [flatList, setFlatList] = useState();
  const [searchBar, setSearchBar] = useState();

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: "Post Comments",
    });
  }, [props.navigation]);

  useEffect(() => {
    onRefresh();
    console.log(props.checkAuth[0]._id);
  }, [props.route.params]);

  useEffect(() => {
    keyboardDidShowListener.current = Keyboard.addListener(
      "keyboardWillShow",
      onKeyboardShow
    );
    keyboardDidHideListener.current = Keyboard.addListener(
      "keyboardWillHide",
      onKeyboardHide
    );

    return () => {
      keyboardDidShowListener.current.remove();
      keyboardDidHideListener.current.remove();
    };
  }, []);

  const onRefresh = () => {
    setLoading(true);
    let { postId } = props.route.params;
    setActualPostId(postId);
    //console.log(postId);
    getData("/posts/comments-by-post/" + postId).then((x) => {
      setComments(x);
      setLoading(false);
    });
  };

  const postComment = () => {
    setLoading(true);
    console.log("Post");
    if (create) {
      let tmpComment = {
        postId: actualPostId,
        comment: addComment,
        userId: props.checkAuth[0]._id,
      };
      console.log(tmpComment);
      postData("/posts/comments/", tmpComment).then((x) => {
        setAddComment("");
        onRefresh();
      });
    } else {
      let tmpComment = {
        postId: actualPostId,
        comment: addComment,
        userId: props.checkAuth[0]._id,
      };
      console.log(tmpComment);
      updateData("/posts/comments/" + editId, tmpComment).then((x) => {
        setAddComment("");
        onRefresh();
      });
    }
  };

  const editComment = (id, comment, userId) => {
    if (props.checkAuth[0]._id === userId) {
      setAddComment(comment);
      searchBar.focus();
      setCreate(false);
      setEditId(id);
    }
  };

  const deleteComment = (id) => {
    Alert.alert("Delete Comment", "Are you sure you want to delete this comment ?", [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => {
          deleteData("/posts/comments/" + id).then((x) => {
            onRefresh();
          });
        },
      },
    ]);
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity
        style={styles.commentContainer}
        onLongPress={() => editComment(item._id, item.comment, item.userId)}
        activeOpacity={props.checkAuth[0]._id === item.userId ? 0.7 : 1}
      >
        <View style={styles.profileContainer}>
          <Image style={styles.profileImg} source={{ uri: item.pictureUrl }} />
          <Text style={styles.profileTitle}>{item.name}</Text>
        </View>
        <View style={styles.commentBody}>
          <Text style={{ fontSize: 15 }}>{item.comment}</Text>
        </View>
        {props.checkAuth[0]._id === item.userId ? (
          <View style={styles.commentIcon}>
            <TouchableOpacity onPress={() => deleteComment(item._id)}>
              <Entypo name={"trash"} size={20} color={theme.COLORS.PRIMARY} />
            </TouchableOpacity>
          </View>
        ) : (
          <></>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        enabled
        behavior={Platform.OS === "ios" ? "position" : "height"}
        keyboardVerticalOffset={165 - 80}
      >
        <FlatList
          style={{ marginBottom: 80, paddingBottom: 5 }}
          ref={(ref) => setFlatList(ref)}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }
          onContentSizeChange={() => flatList.scrollToEnd({ animated: true })}
          onLayout={() => flatList.scrollToEnd({ animated: true })}
          data={comments}
          extraData={comments}
          keyExtractor={(x) => x._id}
          renderItem={({ item }) => renderItem(item)}
        />
      </KeyboardAvoidingView>
      <SearchBar
        ref={(ref) => setSearchBar(ref)}
        placeholder="Add a comment..."
        onChangeText={(text) => setAddComment(text)}
        value={addComment}
        containerStyle={[
          styles.searchBarContainerStyle,
          { bottom: keyboardOffset },
        ]}
        inputContainerStyle={styles.searchBarInputContainerStyle}
        inputStyle={styles.searchBarInputStyle}
        placeholderTextColor="rgba(0,0,0, 0.2)"
        searchIcon={() => {
          return <FontAwesome5 name={"comment"} size={22} color="#fff" />;
        }}
        onSubmitEditing={() => postComment()}
        showLoading={loading}
        loadingProps={{ color: theme.COLORS.WHITE }}
        onBlur={() => {
          if (!create) {
            setAddComment("");
            setCreate(true);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  commentContainer: {
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.LIGHTGRAY,
    padding: 10,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImg: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  profileTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  commentBody: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  commentIcon: {
    position: "absolute",
    right: 10,
    top: 20,
    width: 30,
  },
  searchBarContainerStyle: {
    position: "absolute",
    height: 70,
    width: "100%",
    backgroundColor: theme.COLORS.PRIMARY,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    padding: 0,
  },
  searchBarInputContainerStyle: {
    backgroundColor: "transparent",
  },
  searchBarInputStyle: {
    backgroundColor: "white",
    padding: 5,
    fontSize: 14,
    borderRadius: 10,
    marginRight: 10,
  },
});
export default connect(mapStateToProps, null)(App);
