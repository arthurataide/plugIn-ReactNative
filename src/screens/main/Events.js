import React, {useEffect, useState} from "react";
import {View, ScrollView, StyleSheet} from "react-native";
import Button from "../../components/Button";
import Divider from "../../components/Divider"
import EventList from "../../components/EventList";
import { getData } from "../../backend/FetchData";

export default ({ navigation })=>{
    const [events, setEvents] = useState([])
    useEffect(()=>{
        getData("/events/").then((x) => setEvents(x));
    }, [])
    //console.log(events)
    return (
    <View style={styles.container}>
        <ScrollView>
            <Button title={"New Event 🎸 "} onPress={()=>navigation.navigate("NewEvent")} />
            <Divider/>
            <EventList items={events} navigation={navigation} />
        </ScrollView>
    </View>
)}

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