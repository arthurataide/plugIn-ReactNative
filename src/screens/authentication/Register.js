import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Image, TextInput, View, ScrollView, Keyboard, TouchableOpacity, Platform, TouchableWithoutFeedback, KeyboardAvoidingView, Dimensions } from 'react-native';
import * as Toast from "../../components/Toast";
import Input from "../../components/Input";
import theme from "../../theme";
import {Ionicons, FontAwesome5} from '@expo/vector-icons';

const { width } = Dimensions.get("screen");


export default function App({navigation}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <View style={styles.container}>
            <StatusBar style='light'/>
            <KeyboardAvoidingView enabled behavior={Platform.OS === "ios" ? "position" : null }>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.titleContainer}>
                        <Image style={styles.img} source={require('../../../assets/PlugIn-icon.png')} />
                        <Text style={styles.title}>Register</Text>
                    </View>
                    <View style={styles.mainContainer}>
                        <View style={styles.inputContainer}>
                            <View style={styles.icon}>
                                <Ionicons
                                name={'mail'}
                                style={{ color: "#555" }}
                                size={22}
                                />
                            </View>
                            <TextInput 
                                style={{flex: 0.8, padding: 14}}
                                placeholder="Email"
                                keyboardType="email-address"
                                textContentType="emailAddress"
                                value={email}
                                onChangeText={(email) => setEmail(email.toLowerCase())}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <View style={styles.icon}>
                                <Ionicons
                                name={'key'}
                                style={{ color: "#555" }}
                                size={22}
                                />
                            </View>
                            <TextInput 
                                style={{flex: 0.8, padding: 14}}
                                placeholder="Password"
                                textContentType="password"
                                value={password}
                                onChangeText={(pass) => setPassword(pass.toLowerCase())}
                                autoCapitalize='none'
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <TouchableOpacity style={styles.headerBackButton} onPress={() => navigation.goBack()}>
                <FontAwesome5 name='angle-left' color={theme.COLORS.WHITE} size={35} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.COLORS.PRIMARY,
    },
    headerBackButton: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        top: Platform.OS === 'ios' ? 40 : 30,
        left: 10,
        height: 50,
        width: 50,
        backgroundColor: theme.COLORS.LIGHTGRAY,
        borderRadius: 50
    },
    titleContainer: {
        marginTop: 100,
        padding: 20
    },
    img: {
        width: 70,
        height: 70,
        alignSelf: 'center',
        margin: 10
    },  
    title: {
        alignSelf:'center',
        color: 'white',
        fontSize: 35,
        fontWeight: '700',
    },
    mainContainer: {
        backgroundColor: '#fff',
        borderRadius: 5,
        marginHorizontal: 25,
        padding: 20
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        marginVertical: 6,
    },
    icon: {
        flex: 0.1,
        padding: 15,
    },
    checkbox: {
        marginVertical: 15
    }, 
    button: {
        backgroundColor: theme.COLORS.PRIMARY,
        padding: 10,
        width: width / 1.2,
        paddingHorizontal: 10,
        borderRadius: 15,
        alignItems: "center",
    },
    text: {
        alignSelf: 'center',
        color: theme.COLORS.WHITE,
        fontSize: 18,
        fontWeight: "600",
    },
});
