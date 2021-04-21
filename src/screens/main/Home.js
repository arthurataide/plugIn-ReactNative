import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getData } from "../../backend/FetchData";

const { width } = Dimensions.get('window')

const ProfileItem = ({item}) =>  (
    <TouchableOpacity>
        {console.log(item)}
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

const PostList = ({ items }) => (
    <View>
        { 
            items.map((item, key) => (
                <Text key={key}>{item.name}</Text>
            ))
        }
    </View>
)

const PostCard = ({ item }) => (
    <View>
        {/* Insert your cart here */}
    </View>
)

export default function App() {
    const [posts, setPosts] = useState([])
    const [userProfiles, setUserProfiles] = useState([])

    //Get data
    useEffect(() => {
        getData('/posts/').then((x) =>setPosts(x))
        getData('/auth/user-info/').then((x) =>{
            setUserProfiles(
                x.filter(profile => profile.role === 'band' || profile.role === 'musician') //Show only bands and musicians
            )
        })
    }, [])

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.topSection}>
                    <Text style={styles.topText}>Trending</Text>
                    <FlatList style={styles.profileList}
                        data={userProfiles}
                        keyExtractor={x => x._id}
                        renderItem={({item}) => <ProfileItem item={item} />}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    />
                    <View style={styles.divider}/>
                </View>
                <PostList items={ posts } />
            </View>


        </ScrollView>
        
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
        alignSelf:'stretch',
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
