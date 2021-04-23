import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from "react-native";
import { getAuthInfo } from "../../../backend/AuthStorage";
import { getData, postData, updateData } from "../../../backend/FetchData";
import theme from "../../../theme";
import Divider from "../../../components/Divider";
import CustomModal from "../../../components/CustomModal";
import FormInput from "../../../components/FormInput";
import * as Toast from "../../../components/Toast";

//const img = require("./blink.jpeg");
//import img from "./blink.jpeg";

const { width } = Dimensions.get("window");

export default ({ navigation }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [user, setUser] = useState([]);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [applicationIndex, setApplicationIndex] = useState(-1);
  const [profileProperty, setProfileProperty] = useState("");

  const loadData = async (loggedUser) => {
    setLoading(true);

    const role = loggedUser.role    
    const path = `/vacancies/applications-by-${role === "musician" ? "applicant" : "band"}/${loggedUser._id}`
    let data = await getData(path);
    setApplications(data);

    setLoading(false);
  };

  useEffect(() => {
    getAuthInfo().then((x) => {
      setUser(x);
      loadData(x);

      if (x.role == "band"){
        setProfileProperty("applicantId")
      }else if (x.role == "musician"){
        setProfileProperty("bandId")
      }
      
    });
  }, []);

  useEffect(() => {
    navigation.addListener("focus", () => {
        getAuthInfo().then((x) => {
            setUser(x);
            loadData(x);
          });
    });
  }, [navigation]);

  const changeApplicationStatus = async (status) => {
    //setApplicationLoading(true);

    const updatedVacancyApplication = {
       ...applications[applicationIndex], 
       status
    };
     console.log(updatedVacancyApplication);

    const path = "/vacancies/applications/" + updatedVacancyApplication._id;
    console.log(path)

    const response = await updateData(
      path,
      updatedVacancyApplication
    );
    
    //
    if (response) {
      //Error
      console.log(response.status)
      if (response.status >= 400) {
        response.text().then((text) => {
          console.log(text);
          Toast.showError(text);
        });
      }

      if (response.status >= 200 && response.status <= 300) {
        Toast.show("Application updated successfully!");
        loadData(user)
      }
    }

    setModalVisibility(false);
  };

  const hideModal = () => {
    setModalVisibility(false);
  };

  const getStatusColor = (status) => {
    let color;

    switch (status){
        case "rejected":
            color = "red"
            break;
        case "approved":
            color = theme.COLORS.PRIMARY
            break;
        default:
            color = theme.COLORS.LIGHTGRAY
    }

    return color;
  };

  const ApplicationList = ({ items }) => {
    return (
      <>
        {items.map((item, key) => (
          <View key={key} style={{ alignItems: "center" }} >
            <View style={styles.cardContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("PageProfile", {userId: item[profileProperty]})}>
                    <Image
                    style={styles.cardImage}
                    source={{ uri: item.pictureUrl }}
                    />
                </TouchableOpacity>
              
              <View style={{ marginStart: 10 }}  >

                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubTitle}>{item.name}</Text>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>
                
              <TouchableOpacity onPress={() => {
                  if (user.role === "band"){
                    setApplicationIndex(key)
                    setModalVisibility(true)
                  }
                }} style={[styles.cardStatus, { backgroundColor: getStatusColor(item.status) }]}/>
            </View>
            <Divider />
          </View>
        ))}
      </>
    );
  };

  return (
    <View style={styles.container}>
    <ScrollView onScrollEndDrag = {()=>loadData(user)} >
    {loading ? (
        <ActivityIndicator color={theme.COLORS.PRIMARY} size={"large"} />
      ) : (
        <>
          <CustomModal
            title={"APPLICATION"}
            visible={modalVisibility}
            onCancel={() => hideModal()}
            onSave={() => changeApplicationStatus("approved")}
            loading={applicationLoading}
            saveText="APPROVE"
            secondaryText="REJECT"
            onSecondaryPress={()=>changeApplicationStatus("rejected")}
            />
            

          <ApplicationList items={applications} />
        </>
      )}
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  list: {
    alignSelf: "stretch",
  },
  cardImage: {
    height: 80,
    width: 80,
    borderRadius: 5,
  },
  cardContainer: {
    height: 90,
    width: theme.SIZES.MAX_WIDTH,
    alignSelf: "center",
    marginTop: 15,
    flexDirection: "row",
  },
  border: {
    borderWidth: 1,
    borderColor: "black",
  },
  cardTitle: {
    fontSize: 19,
    color: theme.COLORS.INNER_TEXT,
    fontWeight: "500",
  },
  cardSubTitle: {
    fontSize: 17,
    color: theme.COLORS.BLACK,
  },
  cardDescription: {
    fontStyle: "italic",
    maxWidth: 220,
  },
  cardButton: {
    position: "absolute",
    top: 25,
    right: 10,
    padding: 3,
  },
  cardButtonText: {
    fontSize: 18,
  },
  cardStatus:{
      borderRadius:50, 
      width: 20, 
      height:20, 
      position:"absolute", 
      top:10, 
      right:10
 }
});
