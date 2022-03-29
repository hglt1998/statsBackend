import { getDatabase, onValue, ref, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { DataTable, IconButton } from "react-native-paper";
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

  const [interpretacion, setNuevaInterpretacion] = useState("");

  const [actuacion, setActuacion] = useState(initialState);

  const [repertorios, setRepertorios] = useState([]);

  const [composicion, setComposicion] = useState([]);

  const [compositor, setCompositor] = useState([]);

  // ----------------------------- USEEFFECT -----------------------------
  useEffect(() => {
    getActuacionByID(props.route.params.eventoId);
    loadData();
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

  const handleDelete = (id) => {
    const db = getDatabase();
    set(ref(db, "repertorios/" + idActuacion + "/" + id), null);
  };

  const generateID = () => {
    const newDate = new Date();
    const date = newDate
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/[^0-9]/g, "");

    const time = newDate.getTime().toString();

    return date + time;
  };

  const addInterpretacion = async () => {
    let direccion = "";
    Geocode.setApiKey("AIzaSyDDRl1F9xvqBdFIY8qgEynwizdgMqCHTRY");
    Geocode.setLanguage("es");
    Geocode.setRegion("es");
    Geocode.setLocationType("ROOFTOP");
    const db = getDatabase();

    const id = generateID();

    setDatosComposicion(interpretacion);

    Location.installWebGeolocationPolyfill();

    navigator.geolocation.getCurrentPosition((position) => {
      Geocode.fromLatLng(
        position.coords.latitude,
        position.coords.longitude
      ).then((response) => {
        const ubi = new String(response.results[0].formatted_address);
        const time = new Date().toLocaleString();
        const newUbi = ubi.substring(0, ubi.indexOf(","));

        if (Platform.OS === "web") {
          const newLocation = window.prompt(
            "Introduzca la localización:",
            "Localización"
          );
          console.log(compositor);

          set(ref(db, "repertorios/" + idActuacion + "/" + id), {
            nMarcha: interpretacion,
            ubicacion: newLocation,
            time: time,
            idInterpretacion: id,
            tituloMarcha: composicion.titulo,
            compositor: composicion.compositor,
            idCompositor: composicion.idCompositor,
          });
        } else {
          Alert.prompt(
            "Localización",
            `Confirme ${newUbi} como la localización correcta. Introduzca la dirección en caso de localización incorrecta.`,
            [
              {
                text: "Correcta",
                onPress: () => {
                  try {
                    set(ref(db, "repertorios/" + idActuacion + "/" + id), {
                      nMarcha: interpretacion,
                      ubicacion: newUbi,
                      time: time,
                      idInterpretacion: id,
                      tituloMarcha: composicion.titulo,
                      longitud: position.coords.longitude,
                      latitud: position.coords.latitude,
                      compositor: composicion.compositor,
                      idCompositor: composicion.idCompositor,
                    });
                  } catch (error) {
                    console.log(error);
                  }
                },
              },
              {
                text: "Nueva localización",
                onPress: (texto) => {
                  set(ref(db, "repertorios/" + idActuacion + "/" + id), {
                    nMarcha: interpretacion,
                    ubicacion: texto,
                    time: time,
                    idInterpretacion: id,
                    tituloMarcha: composicion.titulo,
                    compositor: composicion.compositor,
                    idCompositor: composicion.idCompositor,
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
    //GET REPERTORIOS
    const db = getDatabase();
    const repertorioRef = ref(db, "repertorios/" + idActuacion);
    onValue(repertorioRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setRepertorios(Object.values(data));
      }
    });
  };

  const setDatosComposicion = (nMarcha) => {
    const doc = firebase.db.collection("composiciones").doc(nMarcha);
    doc.get().then((info) => {
      const interpretacion = info.data();
      setComposicion(interpretacion);
    });
  };

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
            onValueChange={(value) => handleToggleSwitch(value)}
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
            onChangeText={(value) => {
              setNuevaInterpretacion(value);
              setDatosComposicion(value);
            }}
            value={interpretacion}
          />
          <Button
            title="Añadir composición"
            onPress={() => {
              addInterpretacion();
              setNuevaInterpretacion("");
              setCompositor(interpretacion.idCompositor);
            }}
          />
        </View>
      </View>
      {repertorios.length == 0 ? (
        <Text>No Data</Text>
      ) : (
        <DataTable title="Tabla" style={styles.table}>
          <DataTable.Header style={styles.table}>
            <DataTable.Title>Nº</DataTable.Title>
            <DataTable.Title>Composición</DataTable.Title>
            <DataTable.Title numeric>Ubicación</DataTable.Title>
            <DataTable.Title numeric>Hora</DataTable.Title>
            <DataTable.Title numeric>Actions</DataTable.Title>
          </DataTable.Header>
          {repertorios.map((repertorio) => {
            const time = String(repertorio.time);
            return (
              <DataTable.Row key={repertorio.time} style={styles.table}>
                <DataTable.Cell>{repertorio.nMarcha}</DataTable.Cell>
                <DataTable.Cell>{repertorio.tituloMarcha}</DataTable.Cell>
                <DataTable.Cell numeric>{repertorio.ubicacion}</DataTable.Cell>
                {/* <DataTable.Cell numeric>{`${new Date(repertorio.time)
                  .getHours()}:${String(new Date(repertorio.time)
                    .getMinutes())
                  }`}</DataTable.Cell> */}
                <DataTable.Cell numeric>
                  {time.substring(time.indexOf(",") + 2, time.length)}
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <IconButton
                    icon="delete"
                    onPress={() => handleDelete(repertorio.idInterpretacion)}
                  />
                </DataTable.Cell>
              </DataTable.Row>
            );
          })}
        </DataTable>
      )}

      <Button title={"Home"} onPress={handleHome} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  tableHead: {
    padding: 15,
  },
  table: {
    justifyContent: 'space-between'
  }
});

export default actuacionDetail;
