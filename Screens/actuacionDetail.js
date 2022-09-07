import { getDatabase, onValue, ref, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import { IconButton } from "react-native-paper";
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

  const [location, setLocation] = useState("");

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
    const db = getDatabase();

    const id = generateID();

    setDatosComposicion(interpretacion);

    const time = new Date().toLocaleString();
    try {
      set(ref(db, "repertorios/" + idActuacion + "/" + id), {
        nMarcha: interpretacion,
        ubicacion: location,
        time: time,
        idInterpretacion: id,
        tituloMarcha: composicion.titulo,
        compositor: composicion.compositor,
        idCompositor: composicion.idCompositor,
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

  const handleSetLocation = (ubicacion) => {
    setLocation(ubicacion)
  }

  // ----------------------------- VIEW -----------------------------

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.switchGroup}>
          <Switch
            style={styles.switch}
            trackColor={{ false: "#646FD4", true: "#FF0000" }}
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
              style={{ flexDirection: "row", justifyContent: "center", width: 150 }}
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
          <View style={styles.textInputs}>
            <TextInput
              style={{ flexDirection: "row", justifyContent: "center", width: 117 }}
              placeholderTextColor="#646FD4"
              autoCorrect={false}
              placeholder="Ubicación"
              onChangeText={(value) => {
                setLocation(value);
              }}
              value={location}
            />
            <IconButton icon="backspace" onPress={() => setLocation("")} style={{margin: 0, padding: 0, height: 25}} color="#646FD4" />
          </View>
        </View>
          <View style={styles.button}>
            <Button
              color="#FFFFFF"
              title="Añadir composición"
              onPress={() => {
                addInterpretacion();
                setNuevaInterpretacion("");
                setLocation("")
                setCompositor(interpretacion.idCompositor);
              }}
            />
          </View>
      </View>
      {repertorios.length == 0 ? (
        <Text>No Data</Text>
      ) : (
        <>
          <View style={styles.inputs}>
            <Text style={{justifyContent: "center"}}>Total: {repertorios.length}</Text>
          </View>
          <View style={styles.table}>
            <View style={styles.tableHead}>
              <View style={styles.column1}>
                <Text style={styles.headText}>Nº</Text>
              </View>
              <View style={styles.column2}>
                <Text style={styles.headText}>Composición</Text>
              </View>
              <View style={styles.column3}>
                <Text style={styles.headText}>Ubicación</Text>
              </View>
              <View style={styles.column4}>
                <Text style={styles.headText}>Hora</Text>
              </View>
              <View style={styles.column5}>
                <Text style={styles.headText}>Actions</Text>
              </View>
            </View>
            {repertorios.map((repertorio) => {
              const time = String(repertorio.time);
              return (
                <View style={styles.tableRow} key={repertorio.time}>
                  <View style={styles.column1}>
                    <Text style={styles.viewText}>{repertorio.nMarcha}</Text>
                  </View>
                  <View style={styles.column2}>
                    <Text>{repertorio.tituloMarcha}</Text>
                  </View>
                  <View style={styles.column3}>
                    <Text onPress={()=> handleSetLocation(repertorio.ubicacion)}>{repertorio.ubicacion}</Text>
                  </View>
                  <View style={styles.column4}>
                    <Text>{time.substring(time.indexOf(",") + 2, time.length)}</Text>
                  </View>
                  <View style={styles.column5}>
                    <IconButton icon="delete" onPress={() => handleDelete(repertorio.idInterpretacion)} color="#0e606b" />
                  </View>
                </View>
              )
            })}
          </View>
        </>
        )}
        
        <Button title={"Home"} onPress={handleHome} />
        </ScrollView>
        );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#646FD4",
    borderRadius: 5,
    marginHorizontal: 10,
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
    marginBottom: 40
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
    width: 170,
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
    display: "flex",
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#646FD4",
    paddingVertical: 10,
    borderRadius: 5
  },
  table: {
    width: "100%",
    padding: 10
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    borderWidth: 0.8,
    borderRadius: 5,
    borderColor: "#646FD4",
    textAlignVertical:"center",
    marginVertical: 1
  },
  column1: {
    paddingLeft: 5,
    width: "8%",
    justifyContent: "center"
  },
  column2: {
    paddingLeft: 5,
    width: "30%",
    justifyContent: "center"
  },
  column3: {
    paddingLeft: 15,
    width: "30%",
    justifyContent: "center"
  },
  column4: {
    paddingLeft: 10,
    width: "19%",
    justifyContent: "center"
  },
  column5: {
    paddingRight: 10,
    width: "15%",
    justifyContent: "center"
  },
  viewText: {
    alignItems: "center",
    textAlignVertical: "center"
  },
  headText: {
    color: "#FFFFFF"
  }
});

export default actuacionDetail;
