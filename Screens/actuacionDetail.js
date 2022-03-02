import React, { useEffect, useState } from 'react'
import { Button, ScrollView, Text, View, StyleSheet, Switch, TextInput } from "react-native";
import firebase from "../database/firebase";

const actuacionDetail = (props) => {
    const idActuacion = props.route.params.eventoId;

    const [nuevaMarcha, setNuevaMarcha] = useState()

    const initialState = {
        concepto: '',
        fecha: '',
        idActuacion: '',
        idRepertorio: '',
        isLive: Boolean,
        organizador1: '',
        organizador2: '',
        tipoActuacion: '',
        ubicacion: '',
        ciudad: ''
    }

    const [actuacion, setActuacion] = useState(initialState)

    const handleHome = async () => {
        await props.navigation.navigate('procesiones')
    }

    const handleChangeText = (name, value) => {
        setActuacion({ ...actuacion, [name]: value })
    }

    useEffect(() => {
        getActuacionByID(props.route.params.eventoId);
        console.log(props.route.params.eventoId)
    }, [])

    const getActuacionByID = async (id) => {
        const dbRef = firebase.db.collection('actuaciones').doc(id);
        const doc = await dbRef.get();
        const actuacion = doc.data()
        setActuacion({
            ...actuacion,
            idActuacion: id,
            idRepertorio: id
        })
        console.log(actuacion)
        return doc.data()
    }

    const handlerAddComposition = () => {
        console.log(nuevaMarcha);
    }

    const handleToggleSwitch = async (value) => {
        const dbRef = firebase.db.collection('actuaciones').doc(idActuacion);
        const doc = await dbRef.get()
        const actuacionScope = doc.data()
        await dbRef.set({
            ...actuacionScope,
            isLive: value
        })
        setActuacion(value)
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.topInfo}>
                <View style={styles.switch}>
                    <Text>En directo</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={actuacion.isLive ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={value => handleToggleSwitch(value)}
                        value={actuacion.isLive}
                    />
                </View>
                <Text>{actuacion.concepto}</Text>
                <Text>{actuacion.organizador1}</Text>
                <Text>{new Date(actuacion.fecha.seconds * 1000).toLocaleString().toString()}</Text>
            </View>
            <View>
                <View style={styles.inputs}>
                    <TextInput placeholder='Nº de composición' onChangeText={value => setNuevaMarcha(value)} value={nuevaMarcha} />
                    <Button title='Añadir composición' onPress={() => {
                        handlerAddComposition()
                        setNuevaMarcha('')
                    }} />
                </View>
            </View>

            <Button title={'Home'} onPress={handleHome} />
        </ScrollView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 35
    },
    text: {
        flex: 1,
        padding: 0,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#cccccc",
    },
    topInfo: {
        flexDirection: 'row',
        padding: 5,
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        fontWeight: 'bold',
        fontSize: 11
    },
    switch: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        color: 'red'
    },
    inputs: {
        flexDirection: 'row',
        alignContent: 'center',
        padding: 10,
        alignItems: 'center'
    }
})

export default actuacionDetail