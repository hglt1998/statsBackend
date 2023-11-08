import {
  getDatabase,
  increment,
  onValue,
  ref,
  set,
  update,
} from "firebase/database";
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
  Alert,
} from "react-native";
import firebase from "../database/firebase";
import DateTimePickerModal from "@react-native-community/datetimepicker";

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
    tipo: "",
    ubicacion: "",
    ciudad: "",
    enlazada: 0,
  };

  const idActuacion = props.route.params.eventoId;

  const [interpretacion, setNuevaInterpretacion] = useState("");

  const [actuacion, setActuacion] = useState(initialState);

  const [repertorios, setRepertorios] = useState([]);

  const [composicion, setComposicion] = useState([]);

  const [location, setLocation] = useState("");

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const [customDate, setCustomDate] = useState(new Date());

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

  const handleEdit = (id) => {
    Alert.alert("Acciones", "¿Qué acción deseas realizar?", [
      {
        text: "Editar calle",
        onPress: () => handleEditCalle(id),
      },
      {
        text: "Eliminar interpretacion",
        onPress: () => handleDelete(id),
      },
      {
        text: "Marcar como enlazada",
        onPress: () => handleEnlazada(id),
      },
    ]);
  };

  const handleEditCalle = (id) => {
    const dbRef = ref(getDatabase());
    Alert.prompt(
      "Nueva ubicación",
      "Introduzca la ubicación corregida",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel"),
        },
        {
          text: "Ok",
          onPress: (text) => {
            try {
              const updates = {};
              updates[`repertorios/${idActuacion}/${id}/ubicacion`] = text;
              update(dbRef, updates);
            } catch (error) {
              console.log(error);
            }
          },
        },
      ],
      "plain-text"
    );
  };

  const handleEnlazada = async (id) => {
    const dbRef = ref(getDatabase());
    try {
      const updates = {};
      updates[`repertorios/${idActuacion}/${id}/enlazada`] = increment(1);
      update(dbRef, updates);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Eliminar",
      "¿Estás seguro que deseas eliminar esta composición del repertorio?",
      [
        {
          text: "No",
          onPress: () => console.log("No selected"),
        },
        {
          text: "Sí",
          onPress: () => {
            const db = getDatabase();
            set(ref(db, "repertorios/" + idActuacion + "/" + id), null);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const generateID = () => {
    let newDate = new Date();
    isDatePickerVisible ? (newDate = customDate) : (newDate = new Date());
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

    const time = isDatePickerVisible
      ? customDate.toLocaleString()
      : new Date().toLocaleString();
    try {
      set(ref(db, "repertorios/" + idActuacion + "/" + id), {
        nMarcha: interpretacion,
        ubicacion: location ? location : "",
        time: time,
        idInterpretacion: id,
        tituloMarcha: composicion.titulo,
        compositor: composicion.compositor,
        idCompositor: composicion.idCompositor,
        enlazada: 1,
      });
      setNuevaInterpretacion("");
      setLocation("");
      setIsDatePickerVisible(false);
      setCustomDate(new Date());
    } catch (error) {
      console.error(error);
    }
  };

  const showDatePicker = () => {
    setIsDatePickerVisible(!isDatePickerVisible);
  };

  const handleChangeDate = (date) => {
    setCustomDate(new Date(date.nativeEvent.timestamp));
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
    setLocation(ubicacion);
  };

  // ----------------------------- VIEW -----------------------------

  return (
    <ScrollView style={styles.container}>
      <View
        style={[
          styles.card,
          actuacion.isLive
            ? { borderColor: "#d0342c", borderWidth: 2 }
            : { backgroundColor: "white" },
        ]}
        onTouchEnd={() => handleToggleSwitch(!actuacion.isLive)}
      >
        <View style={styles.textGroup}>
          <Text>{actuacion.concepto}</Text>
          <Text>
            {new Date(actuacion.fecha.seconds * 1000)
              .toLocaleString()
              .toString()
              .slice(0, -3)}
          </Text>
        </View>
        <Text>{actuacion.organizador1}</Text>
      </View>
      <View>
        <View style={styles.inputs}>
          <View style={styles.textInputs}>
            <TextInput
              style={{
                flexDirection: "row",
                justifyContent: "center",
                width: 150,
              }}
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
          {actuacion.tipo === "Procesión" ? (
            <View style={styles.textInputs}>
              <TextInput
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  width: 110,
                }}
                placeholderTextColor="#646FD4"
                autoCorrect={false}
                placeholder="Ubicación"
                onChangeText={(value) => {
                  setLocation(value);
                }}
                value={location}
              />
              <IconButton
                icon="backspace"
                onPress={() => setLocation("")}
                style={styles.iconButtonDelete}
              />
            </View>
          ) : (
            <></>
          )}
          <View style={styles.buttonDate}>
            <IconButton
              icon="clock-time-four-outline"
              iconColor="white"
              onPress={() => showDatePicker()}
              style={styles.iconButton}
            />
          </View>
        </View>
        <View style={styles.button}>
          <Button
            color="#FFFFFF"
            title="Añadir composición"
            onPress={() => {
              addInterpretacion();
            }}
          />
        </View>
        {isDatePickerVisible && (
          <DateTimePickerModal
            display="inline"
            style={styles.datePicker}
            textColor="#d03e3e"
            isDatePickerVisible={isDatePickerVisible}
            mode="datetime"
            value={customDate}
            onChange={(value) => {
              handleChangeDate(value);
            }}
          />
        )}
      </View>
      {repertorios.length == 0 ? (
        <Text>No Data</Text>
      ) : (
        <>
          <View style={styles.inputs}>
            <Text style={{ justifyContent: "center" }}>
              Total: {repertorios.length}
            </Text>
          </View>
          <View style={styles.table}>
            <View style={styles.tableHead}>
              <Text
                style={[styles.whitetext, { flexBasis: 50, flexShrink: 1 }]}
              >
                Nº
              </Text>
              <Text
                style={[
                  styles.whitetext,
                  { flexBasis: 200, flexGrow: 1, flexShrink: 1 },
                ]}
              >
                Composición
              </Text>
              {actuacion.tipo === "Procesión" ? (
                <Text
                  style={[
                    styles.whitetext,
                    { flexBasis: 200, flexGrow: 1, flexShrink: 1 },
                  ]}
                >
                  Ubicación
                </Text>
              ) : (
                <></>
              )}
              <Text
                style={[styles.whitetext, { flexBasis: 75, flexShrink: 1 }]}
              >
                Hora
              </Text>
              <Text
                style={[styles.whitetext, { flexBasis: 75, flexShrink: 1 }]}
              >
                Actions
              </Text>
            </View>
            {repertorios.map((repertorio) => {
              const time = String(repertorio.time).slice(0, -3);
              return (
                <View
                  style={
                    repertorio.enlazada % 2 == 0
                      ? styles.tableRowEnlazada
                      : styles.tableRow
                  }
                  key={repertorio.time}
                >
                  <Text style={{ flexBasis: 50, flexShrink: 1 }}>
                    {repertorio.nMarcha}
                  </Text>
                  <Text style={{ flexBasis: 200, flexGrow: 1, flexShrink: 1 }}>
                    {repertorio.tituloMarcha}
                  </Text>
                  {actuacion.tipo === "Procesión" ? (
                    <Text
                      onPress={() => handleSetLocation(repertorio.ubicacion)}
                      style={{ flexBasis: 200, flexGrow: 1, flexShrink: 1 }}
                    >
                      {repertorio.ubicacion}
                    </Text>
                  ) : (
                    <></>
                  )}
                  <Text style={{ flexBasis: 75, flexShrink: 1 }}>
                    {time.substring(time.indexOf(",") + 2, time.length)}
                  </Text>
                  <View
                    style={[
                      styles.iconButtonActions,
                      { flexBasis: 75, flexShrink: 1 },
                    ]}
                  >
                    <IconButton
                      icon="pencil"
                      onPress={() => handleEdit(repertorio.idInterpretacion)}
                      color="#0e606b"
                      style={styles.iconButtonActions}
                    />
                  </View>
                </View>
              );
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
  buttonDate: {
    width: 40,
    padding: 0,
    margin: 0,
    alignSelf: "center",
    backgroundColor: "#646FD4",
    borderRadius: 5,
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
  },
  container: {
    flex: 1,
    marginBottom: 40,
  },
  datePicker: {
    backgroundColor: "#2E3033",
    marginHorizontal: 10,
    marginVertical: 10,
    height: 380,
    color: "#DDDDD",
  },
  inputs: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 5,
  },
  iconButtonDelete: { margin: 0, padding: 0, height: 25 },
  iconButton: { margin: 0, marginVertical: 3 },
  iconButtonActions: { flexDirection: "row" },
  textInputs: {
    flexDirection: "row",
    alignContent: "center",
    padding: 10,
    justifyContent: "space-between",
    marginVertical: 20,
    marginRight: 0,
    borderRadius: 10,
    borderColor: "#646FD4",
    borderWidth: 1,
    width: 165,
    alignItems: "center",
  },
  tableHead: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#646FD4",
    paddingVertical: 5,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  table: {
    padding: 10,
  },
  whitetext: {
    color: "white",
  },
  tableRow: {
    flexDirection: "row",
    borderWidth: 0.8,
    borderRadius: 5,
    borderColor: "#646FD4",
    marginVertical: 1,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  tableRowEnlazada: {
    display: "flex",
    flexDirection: "row",
    borderWidth: 1.2,
    borderRadius: 7,
    borderColor: "#646FD4",
    textAlignVertical: "center",
    marginVertical: 1,
    backgroundColor: "#D7D7DE",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  textGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default actuacionDetail;
