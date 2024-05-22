import React, { useState, useEffect } from "react";
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
import { FAB, IconButton, Portal } from 'react-native-paper'
import BUTTON from "./variables"
import { getDatabase, ref, set } from "firebase/database";
import { useIsFocused } from "@react-navigation/native";

const db = getDatabase()

function events({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState([]);
  const [state, setState] = useState({ open: false });
  const { open } = state;
  const isFocused = useIsFocused()

  const onStateChange = ({ open }) => setState({ open });

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
      {isFocused && (
      <Portal>
        <FAB.Group
          open={open}
          visible
          icon={'plus'}
          fabStyle={{backgroundColor: BUTTON.background}}
          actions={[
            {
              icon: 'music-note', onPress: () => navigation.navigate("createComposicion"), label: 'Composición', color: 'white', color: BUTTON.background, style: {backgroundColor: 'white'}
            },
            {
              icon: 'account', onPress: () => navigation.navigate("createCompositor"), label: 'Compositor', color: BUTTON.background, style: {backgroundColor: 'white'}
            },
            {
              icon: 'file-document', onPress: () => navigation.navigate("createActuacion"), label: 'Actuación', color: 'white', color: BUTTON.background, style: {backgroundColor: 'white'}
            },
          ]}
          onStateChange={onStateChange}
         />
      </Portal>)

      }
      

      {events.map((evento, index) => {
        const formatedDate = new Date(evento.fecha.seconds * 1000)
          .toLocaleString()
          .toString().slice(0, -3);
        return (
          <View key={index} style={styles.card}>
            <View style={styles.leftGroup}>
              <Text style={[styles.concept, {color: evento.isLive ? 'red' : 'black'}]} onPress={() => navigation.navigate("actuacionDetail", {eventoId: evento.id})}>{evento.concepto}</Text>
              <Text onPress={() => navigation.navigate("actuacionDetail", {eventoId: evento.id})}>{evento.organizador1}</Text>
              <Text onPress={() => navigation.navigate("actuacionDetail", {eventoId: evento.id})}>{formatedDate}</Text>
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
