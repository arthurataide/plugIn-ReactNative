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
import { getData } from "../../backend/FetchData";
import theme from "../../theme";
import Divider from "../../components/Divider";
import Button from "../../components/Button";
import CustomModal from "../../components/CustomModal";

const { width } = Dimensions.get("window").width;

export default ({ navigation }) => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState([]);
  const [modalVisibility, setModalVisibility] = useState(false);

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

  const submitApplication = () => {
    setModalVisibility(false);
  };

  const hideModal = () => {
    setModalVisibility(false);
  };

  const VacancyList = ({ items }) => {
    return (
      <>
        {items.map((item, key) => (
          <View key={key} style={{ alignItems: "center" }}>
            <View style={styles.cardContainer}>
              <Image
                style={styles.cardImage}
                source={{ uri: item.pictureUrl }}
              />
              <View style={{ marginStart: 10 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubTitle}>{item.name}</Text>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>

              {user.role == "band" ? (
                <TouchableOpacity
                  style={styles.cardButton}
                  onPress={() => setModalVisibility(true)}
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
        <>
          <Button
            title={"New Vacancy 🥁 "}
            onPress={() => navigation.navigate("NewVacancy")}
            marginBottom={10}
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
            onSave={() => submitApplication()}>

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
    borderRadius: 5,
    borderWidth: 1,
    borderColor: theme.COLORS.PRIMARY,
  },
  cardButtonText: {
    color: theme.COLORS.PRIMARY,
    fontSize: 16,
  },
});
