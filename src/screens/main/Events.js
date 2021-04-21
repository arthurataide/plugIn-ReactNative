import React from "react";
import {View, ScrollView, StyleSheet} from "react-native";
import Button from "../../components/Button";
import Divider from "../../components/Divider"

export default ({ navigation })=>(
    <View style={styles.container}>
        <ScrollView>
            <Button title={"New Event 🎸 "} onPress={()=>navigation.navigate("NewEvent")} />
            <Divider/>
        </ScrollView>
    </View>
)

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingTop: 8,
      paddingHorizontal:12
    },
});