import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StatusBar,
  ScrollView,
  Button,
  Text,
  RefreshControl,
  StyleSheet,
} from "react-native";
import firebase from "../database/firebase";
import { Avatar, ListItem } from "react-native-elements";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

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

  return (
    <ScrollView
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
        <Button
          color={"#FFFFFF"}
          title={"Crear actuación"}
          onPress={() => navigation.navigate("createActuacion")}
        />
      </View>
      <View style={styles.button}>
        <Button
          color={"#FFFFFF"}
          title={"Crear composición"}
          onPress={() => navigation.navigate("createComposicion")}
        />
      </View>
      <View style={styles.button}>
        <Button
          color={"#FFFFFF"}
          title={"Crear compositor"}
          onPress={() => navigation.navigate("createCompositor")}
        />
      </View>
      <View style={styles.button}>
        <Button
          color={"#FFFFFF"}
          title={"Organizadores"}
          onPress={() => navigation.navigate("manageOrganizadores")}
        />
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
    backgroundColor: "#646FD4",
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
});

export default events;
