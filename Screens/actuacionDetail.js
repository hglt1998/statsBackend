import { getDatabase, onValue, ref, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import {
  Button,
  ScrollView,
  Text,
  View,
  StyleSheet,
  Switch,
  TextInput,
} from "react-native";
import firebase from "../database/firebase";

import Geocode from "react-geocode";

import * as Location from "expo-location";

import cryptoRandomString from 'crypto-random-string'

const actuacionDetail = (props) => {

  // ----------------------------- STATES -----------------------------
  const initialState = {
    concepto: "",
    fecha: "",
    idActuacion: "",
    idRepertorio: "",
    isLive: Boolean,
    organizador1: "",
    organizador2: "",
    tipoActuacion: "",
    ubicacion: "",
    ciudad: "",
  };

  const idActuacion = props.route.params.eventoId;

  const [interpretacion, setNuevaInterpretacion] = useState('');

  const [actuacion, setActuacion] = useState(initialState);

  const [repertorios, setRepertorios] = useState([])

  // ----------------------------- USEEFFECT -----------------------------
  useEffect(() => {

    getActuacionByID(props.route.params.eventoId);
    loadData()
  }, []);


  // ----------------------------- HANDLERS -----------------------------

  const handleHome = async () => {
    await props.navigation.navigate("procesiones");
  };

  const handleChangeText = (name, value) => {
    setActuacion({ ...actuacion, [name]: value });
  };


  const handleToggleSwitch = async (value) => {
    const dbRef = firebase.db.collection("actuaciones").doc(idActuacion);
    const doc = await dbRef.get();
    const actuacionScope = doc.data();
    await dbRef.set({
      ...actuacionScope,
      isLive: value,
    });
    handleChangeText("isLive", value);
  };

  const handleCheck = () => {
    console.log(repertorios); 
  };

  const addInterpretacion = async () => {
    let direccion = "";
    Geocode.setApiKey("AIzaSyDDRl1F9xvqBdFIY8qgEynwizdgMqCHTRY");
    Geocode.setLanguage("es");
    Geocode.setRegion("es");
    Geocode.setLocationType("ROOFTOP");
    const db = getDatabase();

    const id = self.crypto.randomUUID();

    Location.installWebGeolocationPolyfill();

    navigator.geolocation.getCurrentPosition((position) => {
      Geocode.fromLatLng(
        position.coords.latitude,
        position.coords.longitude
      ).then((response) => {
        const time = new Date().toLocaleString().toString();
        if (Platform.OS === "web") {
          const newLocation = window.prompt(
            "Introduzca la localización:",
            "Localización"
          );
          set(ref(db, "repertorios/" + idActuacion + "/" + id), {
            nMarcha: interpretacion,
            ubicacion: newLocation,
            time: time,
          });
        } else {
          Alert.prompt(
            "Localización",
            `Confirme ${response.results[0].formatted_address} como la localización correcta. Introduzca la dirección en caso de localización incorrecta.`,
            [
              {
                text: "Correcta",
                onPress: () =>
                  set(ref(db, "repertorios/" + idActuacion + "/" + id), {
                    nMarcha: interpretacion,
                    ubicacion: response.results[0].formatted_address,
                    time: time,
                  }),
              },
              {
                text: "Nueva localización",
                onPress: (texto) => {
                  set(ref(db, "repertorios/" + idActuacion + "/" + id), {
                    nMarcha: interpretacion,
                    ubicacion: texto,
                    time: time,
                  });
                },
              },
            ],
            "plain-text"
          );
        }
      });
    });
    return direccion;
  };

  // ----------------------------- GETTERS -----------------------------

  const getActuacionByID = async (id) => {
    const dbRef = firebase.db.collection("actuaciones").doc(id);
    const doc = await dbRef.get();
    const actuacion = doc.data();
    setActuacion({
      ...actuacion,
      idActuacion: id,
      idRepertorio: id,
    });
    return doc.data();
  };

  const loadData = () => {
    const db = getDatabase()
    const repertorioRef = ref(db, 'repertorios/' + idActuacion);
    onValue(repertorioRef, (snapshot) => {
      const data = snapshot.val()
      repertorios.push(data)
      console.log(data);
      console.log('setRepertorios: ', repertorios);
    })
  }

  // ----------------------------- VIEW -----------------------------

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topInfo}>
        <View style={styles.switch}>
          <Text>En directo</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#FF0000" }}
            thumbColor={actuacion.isLive ? "#FFFFFF" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={value => handleToggleSwitch(value)}
            value={actuacion.isLive}
          />
        </View>
        <Text>{actuacion.concepto}</Text>
        <Text>{actuacion.organizador1}</Text>
        <Text>
          {new Date(actuacion.fecha.seconds * 1000).toLocaleString().toString()}
        </Text>
      </View>
      <View>
        <View style={styles.inputs}>
          <TextInput
            keyboardType="numeric"
            placeholder="Nº de composición"
            onChangeText={(value) => setNuevaInterpretacion(value)}
            value={interpretacion}
          />
          <Button
            title="Añadir composición"
            onPress={() => {
              addInterpretacion();
              setNuevaInterpretacion("");
            }}
          />
        </View>
      </View>

      <Button title={"Home"} onPress={handleHome} />
      <Button title={"Check"} onPress={handleCheck} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
  },
  text: {
    flex: 1,
    padding: 0,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  topInfo: {
    flexDirection: "row",
    padding: 5,
    flexWrap: "wrap",
    justifyContent: "space-between",
    fontWeight: "300",
    fontSize: 11,
  },
  switch: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    color: "#FF0000",
    alignItems: "center",
    alignContent: "space-between",
  },
  inputs: {
    flexDirection: "row",
    alignContent: "center",
    padding: 10,
    justifyContent: "center",
    borderWidth: 1,
    marginVertical: 10,
    borderRadius: 10,
  },
});

export default actuacionDetail;
