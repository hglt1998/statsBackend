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

import MapView, { Marker } from "react-native-maps";

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

  const location = {
    longitude: 37.372807,
    latitude: -5.75104,
  };

  const [pin, setPin] = useState({
    latitude: 37.372807,
    longitude: -5.75104,
  });

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
    Geocode.setApiKey("AIzaSyAv75F1CKLscQG92dkSR_3oMTl1CHSE0l8");
    Geocode.setLanguage("es");
    Geocode.setRegion("es");
    Geocode.setLocationType("ROOFTOP");
    Geocode.enableDebug(true);
    const db = getDatabase();

    const id = generateID();

    setDatosComposicion(interpretacion);

    try {
      Geocode.fromLatLng(pin.latitude, pin.longitude).then((response) => {
        const ubi = new String(response.results[0].formatted_address);
        const time = new Date().toLocaleString();
        const newUbi = ubi.substring(0, ubi.indexOf(","));

        if (Platform.OS === "web") {
          const newLocation = window.prompt(
            "Introduzca la localización:",
            "Localización"
          );

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
          try {
            set(ref(db, "repertorios/" + idActuacion + "/" + id), {
              nMarcha: interpretacion,
              ubicacion: newUbi,
              time: time,
              idInterpretacion: id,
              tituloMarcha: composicion.titulo,
              longitud: pin.longitude,
              latitud: pin.latitude,
              compositor: composicion.compositor,
              idCompositor: composicion.idCompositor,
            });
          } catch (error) {
            console.error(error);
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
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
        setRepertorios(Object.values(data).reverse());
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
      <View style={styles.card}>
        <View style={styles.switchGroup}>
          <Switch
            style={styles.switch}
            trackColor={{ false: "#767577", true: "#FF0000" }}
            thumbColor={actuacion.isLive ? "#FFFFFF" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(value) => handleToggleSwitch(value)}
            value={actuacion.isLive}
          />
          {actuacion.isLive ? (
            <Text style={styles.switchFont}>DIRECTO</Text>
          ) : (
            <Text style={styles.switchFontFalse}>NO DIRECTO</Text>
          )}
        </View>
        <Text>{actuacion.organizador1}</Text>
        <Text>{actuacion.concepto}</Text>
        <Text>
          {new Date(actuacion.fecha.seconds * 1000).toLocaleString().toString()}
        </Text>
      </View>
      <View>
        <View style={styles.inputs}>
          <View style={styles.textInputs}>
            <TextInput
              style={{ flexDirection: "row", justifyContent: "center" }}
              placeholderTextColor="#646FD4"
              keyboardType="numeric"
              placeholder="Nº de composición"
              onChangeText={(value) => {
                setNuevaInterpretacion(value);
                setDatosComposicion(value);
              }}
              value={interpretacion}
            />
          </View>
          <View style={styles.button}>
            <Button
              color="#FFFFFF"
              title="Añadir composición"
              onPress={() => {
                addInterpretacion();
                setNuevaInterpretacion("");
                setCompositor(interpretacion.idCompositor);
              }}
            />
          </View>
        </View>
        <MapView
          style={{ height: 300 }}
          initialRegion={{
            latitude: 37.372796,
            longitude: -5.75108,
            longitudeDelta: 0.01,
            latitudeDelta: 0.01,
          }}
          provider="google"
        >
          <Marker
            draggable
            coordinate={pin}
            onDragEnd={(e) => {
              setPin({
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
              });
            }}
          />
        </MapView>
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
  button: {
    backgroundColor: "#646FD4",
    borderRadius: 5,
    marginVertical: 20,
    padding: 5,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    margin: 10,
    marginBottom: 0,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    justifyContent: "space-between",
    flexWrap: "wrap",
    flexDirection: "row",
    alignContent: "space-between",
  },
  container: {
    flex: 1,
  },
  textInputs: {
    flexDirection: "row",
    alignContent: "center",
    padding: 10,
    justifyContent: "space-between",
    marginVertical: 20,
    borderRadius: 10,
    borderColor: "#646FD4",
    borderWidth: 1,
    width: 200,
    alignItems: "center",
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
  switchGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  switchFont: {
    color: "#d03e3e",
    paddingLeft: 15,
  },
  switchFontFalse: {
    paddingLeft: 15,
  },
  switch: {
    height: 30,
  },
  inputs: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 5,
  },
  tableHead: {
    padding: 15,
  },
  table: {
    justifyContent: "space-between",
  },
});

export default actuacionDetail;
