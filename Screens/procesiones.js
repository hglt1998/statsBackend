import React, {useState, useEffect} from "react";
import {View, TextInput, ScrollView, Button, Text} from 'react-native';
import firebase from "../database/firebase";
import {Avatar, ListItem} from "react-native-elements";

const events = (props) => {

    const [events, setEvents] = useState([]);

    useEffect(() => {
        firebase.db.collection("actuaciones").get().then((querySnapshot) => {
            const events = [];

            querySnapshot.forEach((doc) => {
                const info = doc.data();

                events.push({
                    id: info.idActuacion,
                    concepto: info.concepto,
                    organizador: info.organizador,
                    fecha: info.fecha
                })
            })
            setEvents(events)
        })
    }, [])

    return (
        <ScrollView>
            <Button
                title={"Crear procesión"}
                onPress={() => props.navigation.navigate("createActuacion")} />

            {
                events.map(evento => {
                    console.log(evento)
                    return (
                        <ListItem
                        key={evento.id} bottomDivider onPress={() => {
                            props.navigation.navigate('eventDetail', {
                                eventID: evento.id
                            })
                        }}
                        >
                            <ListItem.Chevron/>
                            <Avatar source={{uri: "https://municipaldemairena.com/wp-content/uploads/2020/10/ColorSinFondo-e1602318863442.png",}} rounded />
                            <ListItem.Content>
                                <ListItem.Title>{evento.concepto}</ListItem.Title>
                                <ListItem.Subtitle>{evento.organizador}</ListItem.Subtitle>
                                <ListItem.Content>
                                    <Text>
                                        {evento.fecha}
                                    </Text>
                                </ListItem.Content>
                            </ListItem.Content>
                        </ListItem>
                    )
                })
            }
        </ScrollView>
    )
}

export default events