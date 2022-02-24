import React, {useEffect, useState, Component} from 'react';
import {View, Button, TextInput, ScrollView, StyleSheet, Alert, Switch, Text} from "react-native";
import firebase from "../database/firebase";
import {Picker} from "@react-native-picker/picker";
import {tiposActuaciones} from "../database/constants"
import {getDatabase, set, ref} from "firebase/database";


const createActuacion = (props) => {

    const database = getDatabase()
    const [date] = useState(new Date())
    const [organizadores, setOrganizadores] = useState([])
    const [isLive, setIsLive] = useState(false);

    const [state, setState] = useState({
        concepto: '',
        fecha: date,
        idActuacion: '',
        idRepertorio: '',
        isLive: false,
        organizador1: '',
        organizador2: '',
        tipoActuacion: '',
        ubicacion: ''
    });

    const handleChangeText = (name, value) => {
        setState({...state, [name]: value})
    }


    useEffect(() => {
        firebase.db.collection('organizadores').onSnapshot(querySnapshot => {
            const organizadores = []

            console.log(querySnapshot.docs.length)

            try {

            handleChangeText('idActuacion', querySnapshot.docs.length)
            handleChangeText('idRepertorio', querySnapshot.docs.length)
            } catch (e) {
                console.log(e.message())
            }

            console.log('ESTADO: ', state)
            querySnapshot.docs.forEach(doc => {
                const {nombre, nombreCorto} = doc.data()
                organizadores.push({
                    nombre,
                    nombreCorto
                })
            });

            setOrganizadores(organizadores)
        })
    }, [])

    const saveActuacion = async () => {
        if (state.concepto === '' || state.organizador1 === '' || state.tipoActuacion === '' || state.ubicacion === "") {
            alert('Hay campos sin rellenar')
        } else {
            try {
                await firebase.db.collection('actuaciones').add({
                    concepto: state.concepto,
                    fecha: new Date(state.fecha),
                    idActuacion: state.idRepertorio,
                    idRepertorio: state.idRepertorio,
                    isLive: state.isLive,
                    organizador1: state.organizador1,
                    organizador2: state.organizador2,
                    tipo: state.tipoActuacion,
                    ubicacion: state.ubicacion
                })

                await set(ref(database, 'repertorios/' + state.idRepertorio), {
                    marcha: 'calle'
                })
            } catch (error) {
                console.log(error)
            }
        }
        await props.navigation.navigate('actuacionDetail', {id: state.idRepertorio})
        console.log(state)
    }


    return (
        <ScrollView style={styles.container}>
            <View style={styles.switch}>
                <Switch
                    trackColor={{false: "#767577", true: "#81b0ff"}}
                    thumbColor={isLive ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={value => handleChangeText('isLive', value)}
                    value={state.isLive}
                />
                <Text style={styles.switchFont}>EN DIRECTO</Text>
            </View>
            <View style={styles.inputGroup}>
                <TextInput placeholder={"Concepto"} onChangeText={(value) => handleChangeText('concepto', value)}/>
            </View>
            <View style={styles.inputGroup}>
                <TextInput placeholder={"MM/DD/YYYY HH:MM"} onChangeText={(value) => handleChangeText('fecha', value)}/>
            </View>
            <View style={styles.inputGroup}>
                <TextInput placeholder={"Ubicación"} onChangeText={(value) => handleChangeText('ubicacion', value)}/>
            </View>

            <View style={styles.inputGroup}>
                <TextInput placeholder={"Organizador 1"}
                           onChangeText={(value) => handleChangeText('organizador1', value)}/>
            </View>
            <View style={styles.inputGroup}>
                <TextInput placeholder={"Organizador 2"}
                           onChangeText={(value) => handleChangeText('organizador2', value)}/>
            </View>
            <View style={styles.picker}>
                <Picker
                    selectedValue={state.tipoActuacion}
                    onValueChange={(itemValue) => {
                        setState({...state, 'tipoActuacion': itemValue})
                    }}>
                    {
                        tiposActuaciones.map(tipo => {
                            return (
                                <Picker.Item key={tipo.key} label={tipo.key} value={tipo.value}/>
                            )
                        })
                    }
                </Picker>
            </View>

            <View style={styles.inputGroup}>
                <Button title={"Guardar procesión"} onPress={saveActuacion}/>
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
        textDecorationColor: "#000000",
        flex: 1,
        padding: 0,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
    },
    picker: {
        marginBottom: 15
    },
    switch: {
        flexDirection: "row",
        fontSize: 18,
        color: '#888',
        textDecorationColor: "#000000",
        flex: 1,
        padding: 0,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        alignItems: "center"
    },
    switchFont: {
        color: '#d03e3e',
        paddingLeft: 15
    }
})

export default createActuacion