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
import { DataTable, IconButton } from 'react-native-paper'
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
            isLive: info.isLive
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
        set(ref(db, 'repertorios/' + id), null).catch((error) => console.log(error))
        
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

      {events.map((evento, index) => {
        const formatedDate = new Date(evento.fecha.seconds * 1000)
          .toLocaleString()
          .toString().slice(0, -3);
        return (
          <View key={index} style={styles.card}>
            <View style={styles.leftGroup}>
              <Text style={[styles.concept, {color: evento.isLive ? 'red' : 'black'}]}>{evento.concepto}</Text>
              <Text>{evento.organizador1}</Text>
              <Text>{formatedDate}</Text>
            </View>
            <View style={styles.actions}>
              <IconButton icon="delete-off" iconColor="#f44336" onPress={() => handleDelete(evento.id)}/>
              <IconButton icon="file-edit" onPress={() => navigation.navigate("actuacionDetail", {eventoId: evento.id})}/>
            </View>
          </View>
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
  button: {
    padding: 5,
    backgroundColor: BUTTON.background,
    padding: 5,
    margin: 5,
    borderRadius: 10,
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    margin: 5,
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  leftGroup: {
    fontSize: '15',
    width: '75%',
    paddingLeft: 20
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    width: '25%',
    paddingRight: 20
  },  
  concept: {
    fontWeight: 'bold',
    fontSize: '16'
  }
});

export default events;
