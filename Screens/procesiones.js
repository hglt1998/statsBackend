import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TextInput,
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

const events = (props) => {
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState([]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

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
      <View style={styles.buttons}>
        <Button
          title={"Crear actuación"}
          onPress={() => props.navigation.navigate("createActuacion")}
        />
      </View>
      <View style={styles.buttons}>
        <Button
          title={"Crear composición"}
          onPress={() => props.navigation.navigate("createComposicion")}
        />
      </View>
      <View style={styles.buttons}>
        <Button
          title={"Crear compositor"}
          onPress={() => props.navigation.navigate("createCompositor")}
        />
      </View>

      {events.map((evento) => {
        const formatedDate = new Date(evento.fecha.seconds * 1000)
          .toLocaleString()
          .toString();
        return (
          <ListItem style={styles.buttons}
            key={evento.id}
            bottomDivider
            onPress={() => {
              props.navigation.navigate("actuacionDetail", {
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
};

const styles = StyleSheet.create({
  buttons: {
    padding: 5,
  },
});

export default events;
