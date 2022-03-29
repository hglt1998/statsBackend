import React, { useState } from "react";
import { Text, View, Button, TextInput, ScrollView, StyleSheet } from 'react-native'
import firebase from "../database/firebase";

const createCompositor = (props) => {

    const initialState = {
        anoDefuncion: 0,
        anoNacimiento: 0,
        apellidos: '',
        idCompositor: 0,
        nombre: '',
    }

    const [state, setState] = useState(initialState)

    const saveCompositor = async () => {
        if (state.idCompositor === '' || state.nombre === '' || state.apellidos === '') {
            alert('Hay campos sin rellernar')
            console.log(state);
        } else {
            try {
                await firebase.db.collection('compositores').doc(state.idCompositor).set({
                    anoDefuncion: Number(state.anoDefuncion),
                    anoNacimiento: Number(state.anoNacimiento),
                    apellidos: state.apellidos,
                    idCompositor: Number(state.idCompositor),
                    nombre: state.nombre,
                })

                setState(initialState)

                await props.navigation.navigate('procesiones')
            } catch (error) {
                console.error(error)
            }
        }

    }

    const handleChangeText = (name, value) => {
        setState({ ...state, [name]: value })
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.inputGroup}>
                <TextInput placeholder="Nombre" onChangeText={(value) => handleChangeText('nombre', value)} />
            </View>
            <View style={styles.inputGroup}>
                <TextInput placeholder="Apellidos" onChangeText={(value) => handleChangeText('apellidos', value)} />
            </View>
            <View style={styles.inputGroup}>
                <TextInput keyboardType="numeric" placeholder="Año de nacimiento" onChangeText={(value) => handleChangeText('anoNacimiento', value)} />
            </View>
            <View style={styles.inputGroup}>
                <TextInput keyboardType="numeric" placeholder="Año de defunción" onChangeText={(value) => handleChangeText('anoDefuncion', value)} />
            </View>
            <View style={styles.inputGroup}>
                <TextInput keyboardType="numeric" placeholder="Id Compositor" onChangeText={(value) => handleChangeText('idCompositor', value)} />
            </View>
            <View style={styles.inputGroup}>

                <Button
                    title="Guardar"
                    onPress={saveCompositor}
                />
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
        fontSize: 18,
        color: '#888',
        textDecorationColor: '#000000',
        flex: 1,
        padding: 0,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc'
    }
})

export default createCompositor