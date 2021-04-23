import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { getAuthInfo } from "../../backend/AuthStorage";
import { getData, postData } from "../../backend/FetchData";
import theme from "../../theme";
import Divider from "../../components/Divider";
import Button from "../../components/Button";
import CustomModal from "../../components/CustomModal";
import FormInput from "../../components/FormInput";
import * as Toast from "../../components/Toast";

export default ({ navigation }) => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [user, setUser] = useState([]);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [applicationDescription, setApplicationDescription] = useState("");
  const [vacancy, setVacancy] = useState({});

  const loadData = async () => {
    setLoading(true);
    let data = await getData("/vacancies/");
    setVacancies(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    getAuthInfo().then((x) => {
      setUser(x);
    });
  }, []);

  useEffect(() => {
    navigation.addListener("focus", () => {
      loadData();
    });
  }, [navigation]);

  const submitApplication = async () => {
    setApplicationLoading(true);

    const vacancyApplication = {
      vacancyId: vacancy._id,
      bandId: vacancy.bandId,
      title: vacancy.title,
      applicantId: user._id,
      description: applicationDescription,
      status: "pending",
    };
    console.log(vacancyApplication);

    const response = await postData(
      "/vacancies/applications/",
      vacancyApplication
    );
    if (response) {
      //Error
      if (response.status >= 400) {
        response.text().then((text) => {
          console.log(text);
          Toast.showError(text);
        });
      }

      if (response.status === 200) {
        Toast.show("Application sent successfully!");
      }
    }

    setApplicationLoading(false);
    setApplicationDescription("");
    setModalVisibility(false);
  };

  const hideModal = () => {
    setModalVisibility(false);
  };

  const applyForVacancy = (vacancy) => {
    setVacancy(vacancy);
    setModalVisibility(true);
  };

  const VacancyList = ({ items }) => {
    return (
      <>
        {items.map((item, key) => (
          <View key={key} style={{ alignItems: "center" }}>
            <View style={styles.cardContainer}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("PageProfile", { userId: item.bandId })
                }
              >
                <Image
                  style={styles.cardImage}
                  source={{ uri: item.pictureUrl }}
                />
              </TouchableOpacity>
              <View style={{ marginStart: 10 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubTitle}>{item.name}</Text>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>

              {user.role == "musician" ? (
                <TouchableOpacity
                  style={styles.cardButton}
                  onPress={() => applyForVacancy(item)}
                >
                  <Text style={styles.cardButtonText}>Apply</Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}
            </View>
            <Divider />
          </View>
        ))}
      </>
    );
  };

  return (
    <View style={styles.container}>
      {user.role == "band" ? (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: theme.SIZES.MAX_WIDTH,
            marginTop: 10,
          }}
        >
          <Button
            title={"New Vacancy"}
            onPress={() => navigation.navigate("NewVacancy")}
            marginBottom={5}
            small={true}
          />
          <Button
            title={"Applications"}
            onPress={() => navigation.navigate("Applications")}
            marginBottom={5}
            small={true}
          />
        </View>
      ) : (
        <></>
      )}

      {user.role == "musician" ? (
        <>
          <Button
            title={"Applications"}
            onPress={() => navigation.navigate("Applications")}
            marginBottom={5}
          />
        </>
      ) : (
        <></>
      )}

      {loading ? (
        <ActivityIndicator color={theme.COLORS.PRIMARY} size={"large"} />
      ) : (
        <>
          <CustomModal
            title={"APPLICATION"}
            visible={modalVisibility}
            onCancel={() => hideModal()}
            onSave={() => {
              if (applicationDescription != "") {
                submitApplication();
              } else {
                Toast.showError("Description is required ! ");
              }
            }}
            loading={applicationLoading}
          >
            <FormInput
              value={applicationDescription}
              onChangeText={(text) => setApplicationDescription(text)}
              placeholder={"Description"}
              autoFocus={true}
            />
          </CustomModal>

          <VacancyList items={vacancies} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 10,
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
    color: theme.COLORS.BLACK,
    fontWeight: "bold",
  },
  cardSubTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: theme.COLORS.INNER_TEXT,
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
    borderRadius: 5,
    borderWidth: 1,
    borderColor: theme.COLORS.PRIMARY,
  },
  cardButtonText: {
    color: theme.COLORS.PRIMARY,
    fontSize: 18,
    textAlign: "center",
  },
});
