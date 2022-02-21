import React, { useState } from 'react';
import { View, Button, TextInput, ScrollView, StyleSheet } from "react-native";
import firebase from "../database/firebase";
import DatePicker from "@dietime/react-native-date-picker";

const createActuacion = (props) => {

    const [date, setDate] = useState(new Date())

    const [state, setState] = useState({
        concepto: '',
        fecha: '',
        idActuacion: '',
        idRepertorio: '',
        isLive: true,
        organizador: '',
        tipo: '',
        ubicacion: ''
    });

    const handleChangeText = (name, value) => {
        setState({...state, [name]: value})
        console.log(state)
    }

    const addNewActuacion = async () => {
        for (const item of state) {
            console.log(item)
        }
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.inputGroup}>
                <TextInput placeholder={"Concepto"} onChangeText={(value) => handleChangeText('name', value)}/>
            </View>
            <View style={styles.inputGroup}>
                <DatePicker value={date} onChange={(value => setDate(value))} format={"dd-mm-yyyy"} />
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

export default createActuacion