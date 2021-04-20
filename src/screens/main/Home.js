import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import profiles from "../../data/profiles.json";
import { LinearGradient } from 'expo-linear-gradient';

//console.log(profiles)

const ProfileItem = ({item}) =>  (
    <TouchableOpacity>
        <View style={styles.profileContainer}>
            <LinearGradient style={styles.profileImageContainer}
                        colors={['#CA1D7E', '#E35157', '#F2703F']}
                        start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}} >
            <Image style={styles.profileImage}
                   source={{uri:item.pictureUrl}}/>
            </LinearGradient>
            <Text numberOfLines={1} style={styles.profileName} >{item.name}</Text>
        </View>
    </TouchableOpacity>
    
)


export default function App() {
    return (
        <View style={styles.container}>
            <View style={styles.topSection}>
                <Text style={styles.topText}>Trending</Text>
                <FlatList style={styles.profileList}
                    data={profiles}
                    keyExtractor={x => x.id}
                    renderItem={({item}) => <ProfileItem item={item} />}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    />
                <View style={styles.divider}/>
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop:5,
        paddingHorizontal: 12,
    },
    topSection: {
        height:160,
    },
    profileContainer:{
        flexDirection:'column',
        alignItems: 'center',
        margin: 5,
    },
    profileImageContainer:{
        borderRadius:87/2,
        width: 87,
        height: 87,
        padding: 3,
        alignItems:'center',
        justifyContent: 'center',
    },
    profileImage:{
        width: 80,
        height: 80,
        borderRadius:50,
        borderColor: '#fff',
        borderWidth: 3
    },
    profileName:{
        marginTop:6,
    },
    profileList:{
        
    },
    topText:{
        alignSelf:"flex-start",
        fontSize: 18,
        fontWeight:"600",
        marginBottom: 8,
    },
    divider:{
        borderWidth: 1,
        borderColor: "#eee",
    }
});
