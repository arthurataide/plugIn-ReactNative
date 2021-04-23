import React, { useState} from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import theme from "../../../theme";
import Button from "../../../components/Button";
import FormInput from "../../../components/FormInput";
import { postData } from "../../../backend/FetchData";
import * as Toast from "../../../components/Toast";
import { getAuthInfo } from "../../../backend/AuthStorage";

const { height } = Dimensions.get("window");

export default ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const saveData = async () => {
    if(title.trim() == '' || description.trim() == ''){
      Toast.showError("Please complete all required fields!")
      return;
    }

    setLoading(true)
    await postVacancy()
    setLoading(false)
  };

  const postVacancy = async ()=>{
    const user = await getAuthInfo()
    console.log(user)

    const newVacancy = {
      bandId: user._id,
      title,
      description,
      status:"active"
    };
    console.log(newVacancy);

    const response = await postData('/vacancies/', newVacancy);
    if (response) {
      //Error
      if (response.status >= 400) {
        response.text().then((text) => Toast.showError(text));
        return;
      }
      if (response.status === 200) {
        Toast.show("Category created successfully!")
        navigation.goBack()
      }
    }
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView>
        <View style={styles.container}>
          <FormInput
            value={title}
            onChangeText={(text) => setTitle(text)}
            style={styles.inputText}
            placeholder={"Title"}
            autoFocus={true}
          />
          <FormInput
            value={description}
            onChangeText={(text) => setDescription(text)}
            style={styles.inputText}
            placeholder={"Event Description"}
            multiline={true}
          />
        </View>
      </ScrollView>

      <Button loading={loading} title={"SAVE"} layout={"filled"} onPress={() => saveData()} marginBottom = {30} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: theme.COLORS.WHITE,
    flex: 1,
    padding: 5

  },
  container: {

  },

});
