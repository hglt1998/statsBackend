import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StatusBar,
  ScrollView,
  Text,
  RefreshControl,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import firebase from "../database/firebase";
import { Avatar, ListItem } from "react-native-elements";
import BUTTON from "./variables"
import { getDatabase, ref, set } from "firebase/database";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const db = getDatabase()

function events({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState([]);

  const loadData = () => {
    firebase.db
      .collection("actuaciones")
      .orderBy("fecha", "desc")
      .get()
      .then((querySnapshot) => {
        const events = [];

        querySnapshot.forEach((doc) => {
          const info = doc.data();

          events.push({
            id: info.idActuacion,
            concepto: info.concepto,
            organizador1: info.organizador1,
            fecha: info.fecha,
          });
        });
        setEvents(events);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id) => {
    Alert.alert("Eliminar", "¿Estás seguro que deseas eliminar esta actuación?",
    [{
      text: "Sí",
      onPress: () => {
        firebase.db.collection("actuaciones").doc(id).delete()
        set(ref(db, 'repertorios/' + id), null).finally(success => {
          
        })
        
      }
    },
  {
    text: "No",
    onPress: () => {
      console.log("Rejected");
    },
    style: "destructive"
  }])
  }

  return (
    <ScrollView
      style={{ backgroundColor: "#fffefb" }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadData} />
      }
    >
      <StatusBar
        animated={true}
        backgroundColor="#61dafb"
        barStyle={"dark-content"}
        showHideTransition={"fade"}
        hidden={false}
      />
      <View style={styles.button}>
        <Pressable onPress={() => navigation.navigate("createActuacion")}>
          <Text style={styles.textButton}>Crear actuación</Text>
        </Pressable>
      </View>
      <View style={styles.button}>
        <Pressable onPress={() => navigation.navigate("createComposicion")}>
          <Text style={styles.textButton}>Crear composición</Text>
        </Pressable>
      </View>
      <View style={styles.button}>
        <Pressable onPress={() => navigation.navigate("createCompositor")}>
          <Text style={styles.textButton}>Crear compositor</Text>
        </Pressable>
      </View>
      <View style={styles.button}>
        <Pressable onPress={() => navigation.navigate("manageOrganizadores")}>
          <Text style={styles.textButton}>Organizadores</Text>
        </Pressable>
      </View>

      {events.map((evento) => {
        const formatedDate = new Date(evento.fecha.seconds * 1000)
          .toLocaleString()
          .toString();
        return (
          <ListItem
            style={styles.item}
            key={evento.id}
            onPress={() => {
              navigation.navigate("actuacionDetail", {
                eventoId: evento.id,
              });
            }}
            onLongPress={() => handleDelete(evento.id)}
          >
            <ListItem.Chevron />
            <Avatar
              source={{
                uri: "https://municipaldemairena.com/wp-content/uploads/2020/10/ColorSinFondo-e1602318863442.png",
              }}
              rounded
            />
            <ListItem.Content>
              <ListItem.Title>{evento.concepto}</ListItem.Title>
              <ListItem.Subtitle>{evento.organizador1}</ListItem.Subtitle>
              <ListItem.Content>
                <Text>{formatedDate}</Text>
              </ListItem.Content>
            </ListItem.Content>
          </ListItem>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  textButton: {
    fontWeight: "bold",
    margin: "auto",
    textAlign: "center",
    paddingVertical: 8,
    fontSize: 18,
    color: BUTTON.text
  },
  item: {
    padding: 5,
    backgroundColor: "#FFFFFF",
    padding: 5,
    margin: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  button: {
    padding: 5,
    backgroundColor: BUTTON.background,
    padding: 5,
    margin: 5,
    borderRadius: 10,
  },
});

export default events;
