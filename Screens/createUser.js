import React, { useState } from 'react'
import { View, Button, TextInput, ScrollView, StyleSheet } from 'react-native';
import firebase  from '../database/firebase'

const createUser = (props) => {

    const [state, setState] = useState({
        name: '',
        email: '',
        phone: '',
    });

    const handleChangeText = (name, value) => {
        setState({ ...state, [name]: value })
    }

    const addNewUser = async () => {
        if (state.email === '' || state.name === '' || state.phone === '') {
            alert('Please fill all fields in the form')
        } else {
            try {
                await firebase.db.collection('users').add({
                    name: state.name,
                    email: state.email,
                    phone: state.phone
                })

                firebase.database().ref('users/' + 1).set({
                    username: state.name,
                    email: state.email,
                    phone: state.phone
                });


                props.navigation.navigate('UsersList')
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.inputGroup}>
                <TextInput placeholder="Name user" onChangeText={(value) => handleChangeText('name', value)} />
            </View>
            <View style={styles.inputGroup}>
                <TextInput placeholder="Email user" autoCapitalize="none" autoCompleteType="email" onChangeText={(value) => handleChangeText('email', value)} />
            </View>
            <View style={styles.inputGroup}>
                <TextInput placeholder="Phone user" onChangeText={(value) => handleChangeText('phone', value)} />
            </View>
            <View>
                <Button title="Save user" onPress={() => addNewUser()} />
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
        borderBottomColor: '#cccccc'
    }
})

export default createUser