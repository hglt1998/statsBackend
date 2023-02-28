import React, { useState, useRef } from "react";
import {
  View,
  Button,
  TextInput,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  KeyboardAvoidingView,
} from "react-native";
import firebase from "../database/firebase";
import { SegmentedButtons } from 'react-native-paper'
import { tiposActuaciones } from "../database/constants";
import { getDatabase, set, ref } from "firebase/database";

const createActuacion = (props) => {
  const database = getDatabase();
  const [date] = useState(new Date());
  const [isLive, setIsLive] = useState(false);

  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const ref4 = useRef();
  const ref5 = useRef();
  const ref6 = useRef();

  const [state, setState] = useState({
    concepto: "",
    fecha: date,
    idActuacion: "",
    idRepertorio: "",
    isLive: false,
    organizador1: "",
    organizador2: "",
    tipoActuacion: "",
    ubicacion: "",
    ciudad: "",
  });

  const handleChangeText = (name, value) => {
    setState({ ...state, [name]: value });
  };

  const saveActuacion = async () => {
    if (
      state.concepto === "" ||
      state.organizador1 === "" ||
      state.tipoActuacion === "" ||
      state.ubicacion === ""
    ) {
      alert("Hay campos sin rellenar");
    } else {
      try {
        const actuacion = await firebase.db.collection("actuaciones").add({
          data: null,
        });

        const id = actuacion.id;

        await firebase.db
          .collection("actuaciones")
          .doc(actuacion.id)
          .set({
            idRepertorio: id,
            idActuacion: id,
            concepto: state.concepto,
            fecha: new Date(state.fecha),
            isLive: state.isLive,
            organizador1: state.organizador1,
            organizador2: state.organizador2,
            tipo: state.tipoActuacion,
            ubicacion: state.ubicacion,
            ciudad: state.ciudad,
          });

        await set(ref(database, "repertorios/" + id), {});

        setState({ ...state, idRepertorio: id });
        await props.navigation.navigate("actuacionDetail", { eventoId: id });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.switch}>
            <View style={styles.switchGroup}>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isLive ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(value) => handleChangeText("isLive", value)}
                value={state.isLive}
              />
              {state.isLive ? (
                <Text style={styles.switchFont}>DIRECTO</Text>
              ) : (
                <Text style={styles.switchFontFalse}>NO DIRECTO</Text>
              )}
            </View>
            <View style={styles.button}>
              <Button
                color="#FFFFFF"
                title={"Guardar"}
                onPress={saveActuacion}
              />
            </View>
          </View>
          <View style={styles.picker}>
            <SegmentedButtons
            value={state.tipoActuacion}
            onValueChange={(change) => {setState({...state, tipoActuacion: change})}}
            buttons={[
              {
                value: tiposActuaciones[0].value,
                label: tiposActuaciones[0].key
              },
              {
                value: tiposActuaciones[1].value,
                label: tiposActuaciones[1].key
              },
              {
                value: tiposActuaciones[2].value,
                label: tiposActuaciones[2].key
              }
            ]}
            density="regular"
            style={{width: 300}}
            >
            </SegmentedButtons>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.textLabel}>Concepto</Text>
            <TextInput
              style={styles.placeholder}
              placeholderTextColor="#46596B"
              placeholder="Concierto de..."
              onChangeText={(value) => handleChangeText("concepto", value)}
              ref={ref1}
              onSubmitEditing={() => ref2.current.focus()}
              returnKeyType="next"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.textLabel}>Fecha</Text>
            <TextInput
              style={styles.placeholder}
              placeholderTextColor="#46596B"
              placeholder="MM/DD/YYYY HH:MM"
              onChangeText={(value) => handleChangeText("fecha", value)}
              ref={ref2}
              onSubmitEditing={() => ref3.current.focus()}
              returnKeyType="next"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.textLabel}>Ubicación</Text>
            <TextInput
              style={styles.placeholder}
              placeholderTextColor="#46596B"
              placeholder="Lugar del evento"
              onChangeText={(value) => handleChangeText("ubicacion", value)}
              ref={ref3}
              onSubmitEditing={() => ref4.current.focus()}
              returnKeyType="next"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.textLabel}>Ciudad</Text>
            <TextInput
              style={styles.placeholder}
              placeholderTextColor="#46596B"
              placeholder="Ciudad del evento"
              onChangeText={(value) => handleChangeText("ciudad", value)}
              ref={ref4}
              onSubmitEditing={() => ref5.current.focus()}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.textLabel}>Organizador</Text>
            <TextInput
              style={styles.placeholder}
              placeholderTextColor="#46596B"
              placeholder={"Nombre del organizador"}
              onChangeText={(value) => handleChangeText("organizador1", value)}
              ref={ref5}
              onSubmitEditing={() => ref6.current.focus()}
              returnKeyType="next"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.textLabel}>2º organizador (Opcional)</Text>
            <TextInput
              style={styles.placeholder}
              placeholderTextColor="#46596B"
              placeholder={"Organizador 2"}
              onChangeText={(value) => handleChangeText("organizador2", value)}
              ref={ref6}
              returnKeyType="next"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  button: {
    marginRight: 0,
    backgroundColor: "#646FD4",
    borderRadius: 5,
  },
  container: {
    flex: 1,
    padding: 35,
    padding: 20,
  },
  inputGroup: {
    fontSize: 18,
    color: "#888",
    textDecorationColor: "#000000",
    flex: 1,
    padding: 0,
    marginBottom: 7,
    borderBottomColor: "#cccccc",
  },
  switch: {
    flexDirection: "row",
    marginBottom: 10,
    flex: 2,
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  switchGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchFont: {
    color: "#d03e3e",
    paddingLeft: 15,
  },
  switchFontFalse: {
    paddingLeft: 15,
  },
  placeholder: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    borderColor: "#646FD4",
    borderWidth: 0.5,
  },
  picker: {
    flex: 1,
    alignItems: "center",
    flexWrap: "nowrap"
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    marginBottom: 80,
  },
  textLabel: {
    left: 5,
    marginVertical: 7,
    color: "#646FD4",
  },
});

export default createActuacion;
