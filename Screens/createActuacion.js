import React, { useState } from 'react';
import { View, Button, TextInput, ScrollView, StyleSheet } from "react-native";
import { Switch } from 'react-native-paper';
import firebase from "../database/firebase";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


const createActuacion = (props) => {

    const [date, setDate] = useState(new Date())

    const [state, setState] = useState({
        concepto: '',
        fecha: date,
        idActuacion: '',
        idRepertorio: '',
        isLive: '',
        organizador: '',
        tipo: '',
        ubicacion: ''
    });

    const handleChangeText = (name, value) => {
        setState({...state, [name]: value})
        console.log(state)
    }

    const handleSetDate = (date) => {
        setDate(date)
        console.log(date);
        console.log(state);
    }

    const saveProcesion = async () => {
        console.log(state);
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.inputGroup}>
                <TextInput placeholder={"Concepto"} onChangeText={(value) => handleChangeText('concepto', value)}/>
            </View>
            <View style={styles.inputGroup}>
                <DatePicker selected={date} onChange={(date) => handleSetDate(date)} showTimeSelect dateFormat="Pp"/>
            </View>
            <View style={styles.container}>
                <Switch />
            </View>
            <View>

            </View>
            <View>
                <Button title='Guardar procesión' onPress={() => saveProcesion()} />
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
        borderBottomColor: '#cccccc',
        zIndex: 1
    }
})

export default createActuacion