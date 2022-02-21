import React, { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Alert } from 'react-native';
import { View, TextInput, ScrollView, Button } from 'react-native';
import { State } from 'react-native-gesture-handler';
import firebase from '../database/firebase'

const userDetail = (props) => {

    const initialState = {
        id: "",
        name: "",
        email: "",
        phone: ""
    }

    const [user, setUser] = useState(initialState);
    const [loading, setLoading] = useState(true)

    const getUserById = async (id) => {
        const dbRef = firebase.db.collection('users').doc(id)
        const doc = await dbRef.get();
        const user = doc.data();
        setUser({
            ...user,
            id: doc.id
        });
        setLoading(false)
    };

    useEffect(() => {
        getUserById(props.route.params.userId);
    }, []);

    const handleChangeText = (name, value) => {
        setUser({ ...user, [name]: value });
    };

    const deleteUserById = async () => {
        setLoading(true);
        const dbRef = firebase.db.collection('users').doc(props.route.params.userId);
        await dbRef.delete();
        setLoading(false);
        props.navigation.navigate('UsersList')
    }

    const updateUser = async () => {
        const dbRef = firebase.db.collection('users').doc(user.id);
        await dbRef.set({
            name: user.name,
            email: user.email,
            phone: user.phone
        })
        setUser(initialState)
        props.navigation.navigate('UsersList')
    }

    const openConfirmationAlert = () => {
        Alert.alert('Remove user', 'Are you sure?', [
            { text: 'Yes', onPress: () => deleteUserById() },
            { text: 'No', onPress: () => console.log('NO SELECTED') },
        ])
    }

    if (loading) {
        return (
            <View>
                <ActivityIndicator size="large" color="#9e9e9e" />
            </View>
        )
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.inputGroup}>
                <TextInput value={user.name} placeholder="Name user" onChangeText={(value) => handleChangeText('name', value)} />
            </View>
            <View style={styles.inputGroup}>
                <TextInput value={user.email} placeholder="Email user" autoCapitalize="none" autoCompleteType="email" onChangeText={(value) => handleChangeText('email', value)} />
            </View>
            <View style={styles.inputGroup}>
                <TextInput value={user.phone} placeholder="Phone user" onChangeText={(value) => handleChangeText('phone', value)} />
            </View>
            <View>
                <Button color="#19AC52" title="Update user" onPress={() => updateUser()} />
            </View>
            <View>
                <Button color="#E37399" title="Delete user" onPress={() => openConfirmationAlert()} />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 35
    },
    inputGroup: {
        flex: 1,
        padding: 0,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#cccccc",
    }
})

export default userDetail