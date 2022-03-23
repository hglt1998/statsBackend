import React, { useEffect, useState } from "react";
import { Text, View, Button, TextInput, ScrollView, StyleSheet } from 'react-native'
import { ListItem } from "react-native-elements";
import firebase from "../database/firebase";

const createComposicion = (props) => {

    const initialState = {
        anoComposicion: 0,
        idFirebase: 0,
        genero: 'Marcha de Procesión',
        idComposicion: 0,
        idCompositor: 0,
        idCompositor2: '',
        subtitulo: '',
        titulo: ''
    }

    const [state, setState] = useState(initialState)

    const saveComposicion = async () => {
        if (state.anoComposicion === '' || state.idComposicion === '' || state.idFirebase === '' || state.idCompositor === '' || state.titulo === '') {
            alert('Hay campos sin rellernar')
            console.log(state);
        } else {
            try {
                await firebase.db.collection('composiciones').doc(state.idFirebase).set({
                    anoComposicion: Number(state.anoComposicion),
                    genero: state.genero,
                    idComposicion: Number(state.idComposicion),
                    idCompositor: Number(state.idCompositor),
                    idCompositor2: Number(state.idCompositor2),
                    subtitulo: state.subtitulo,
                    titulo: state.titulo
                })

                console.log(state);

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
                <TextInput placeholder="Identificador en firebase" onChangeText={(value) => handleChangeText('idFirebase', value)} />
            </View>
            <View style={styles.inputGroup}>
                <TextInput placeholder="Identificador en lista" onChangeText={(value) => handleChangeText('idComposicion', value)} />
            </View>
            <View style={styles.inputGroup}>
                <TextInput  placeholder="Título" onChangeText={(value) => handleChangeText('titulo', value)} />
            </View>
            <View style={styles.inputGroup}>
                <TextInput placeholder="Subtítulo" onChangeText={(value) => handleChangeText('subtitulo', value)} />
            </View>
            <View style={styles.inputGroup}>
                <TextInput keyboardType="numeric" placeholder="Id Compositor" onChangeText={(value) => handleChangeText('idCompositor', value)} />
            </View>
            <View style={styles.inputGroup}>
                <TextInput keyboardType="numeric" placeholder="Id Compositor2" onChangeText={(value) => handleChangeText('idCompositor2', value)} />
            </View>
            <View style={styles.inputGroup}>
                <TextInput keyboardType="numeric" placeholder="Año de composición" onChangeText={(value) => handleChangeText('anoComposicion', value)} />
            </View>
            <View style={styles.inputGroup}>

                <Button
                    title="Botón"
                    onPress={saveComposicion}
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

export default createComposicion