import React, {useEffect, useState} from "react";
import {View, ScrollView, StyleSheet, ActivityIndicator} from "react-native";
import Button from "../../components/Button";
import Divider from "../../components/Divider"
import EventList from "../../components/EventList";
import { getData } from "../../backend/FetchData";
import theme from "../../theme";
import { getAuthInfo } from "../../backend/AuthStorage";

export default ({ navigation })=>{
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState([])

    const loadData = async ()=>{
        setLoading(true)
        let data = await getData("/events/")
        data.sort((a, b) => a.datetime > b.datetime)
        setEvents(data)
        setLoading(false)
    }
    
    useEffect(()=>{
        loadData()
        getAuthInfo().then((x)=>{
            console.log(x)
            setUser(x)
        })
    }, [])

    useEffect(() => {
        console.log("useEffect Reload")
        navigation.addListener('focus', () => {
          console.log("Focus")
          loadData()
        });
    }, [navigation]);

    return (
    <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} >
            {   
                user.role == "musician" || user.role == "band" 
                ? 
                <>
                    <Button title={"New Event 🎸 "} onPress={()=>navigation.navigate("NewEvent")} />
                    <Divider/>
                </>
                :<></>
            }
            

            { loading 
            ? <ActivityIndicator color={theme.COLORS.PRIMARY} size={"large"} />
            : <EventList items={events} navigation={navigation} />
            }

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