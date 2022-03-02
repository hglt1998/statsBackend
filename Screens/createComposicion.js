import { getDatabase, onChildAdded, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { Text, View, Button, TextInput, ScrollView, StyleSheet } from 'react-native'
import { ListItem } from "react-native-elements";
import firebase from "../database/firebase";

const createComposicion = (props) => {

    const [nuevaComposicion, setNuevaComposicion] = useState()
    const [repertorio, setRepertorio] = useState([])


    const handleButton = () => {
        console.log(repertorio);

    }

    const loadData = () => {
        const db = getDatabase();
        const dbRef = ref(db, 'repertorios/' + 'JRxJgKdHtAkLUMeoHTrW');
        // onChildAdded(dbRef, (data) => {
        //     repertorio.push({
        //         marcha: data.val().nMarcha,
        //         ubicacion: data.val().ubicacion
        //     })
        // })

        onValue(dbRef, (snapshot) => {
            const arrayRepertorio = []
            // console.log('SNAPSHOT: ', snapshot.val());
            // console.log('SNAPSHOTKEY: ', snapshot.key);
            snapshot.forEach((childSnapshot) => {
                console.log('Childsnapshot: ', childSnapshot);
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val()
                arrayRepertorio.push({childData, key: childKey})
                setRepertorio(arrayRepertorio)
            })
        })
    }

    useEffect(() => {
        loadData()
    }, [])



    return (
        <ScrollView>
            <View>
                <TextInput placeholder="Nº de marcha" />
            <Button
                title="Botón"
                onPress={value => handleButton(value)} />
            </View>
            
            {
                repertorio.map(interpretacion => {
                    console.log(interpretacion.childData.nmarcha);
                    console.log(interpretacion.key);
                    return (
                        <ListItem
                            key={interpretacion.nMarcha} bottomDivider
                        >
                            <ListItem.Content>
                                <ListItem.Title>{interpretacion.nMarcha}</ListItem.Title>

                            </ListItem.Content>
                        </ListItem>
                    )
                })
            }

        </ScrollView>
    )
}

export default createComposicion