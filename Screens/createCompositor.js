import React, { useState, useRef } from "react";
import {
  Text,
  View,
  Button,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import firebase from "../database/firebase";
import BUTTON from "./variables"

const createCompositor = (props) => {
  const initialState = {
    anoDefuncion: 0,
    anoNacimiento: 0,
    apellidos: "",
    idCompositor: 0,
    nombre: "",
  };

  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const ref4 = useRef();
  const ref5 = useRef();

  const [state, setState] = useState(initialState);

  const saveCompositor = async () => {
    if (
      state.idCompositor === "" ||
      state.nombre === "" ||
      state.apellidos === ""
    ) {
      alert("Hay campos sin rellernar");
    } else {
      try {
        await firebase.db
          .collection("compositores")
          .doc(state.idCompositor)
          .set({
            anoDefuncion: Number(state.anoDefuncion),
            anoNacimiento: Number(state.anoNacimiento),
            apellidos: state.apellidos,
            idCompositor: Number(state.idCompositor),
            nombre: state.nombre,
          });

        setState(initialState);

        await props.navigation.navigate("procesiones");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleChangeText = (name, value) => {
    setState({ ...state, [name]: value });
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.textLabel}>Nombre</Text>
            <TextInput
              style={styles.placeholder}
              placeholder="Nombre del compositor"
              placeholderTextColor="#46596B"
              onChangeText={(value) => handleChangeText("nombre", value)}
              ref={ref1}
              onSubmitEditing={() => ref2.current.focus()}
              returnKeyType="next"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.textLabel}>Apellidos</Text>
            <TextInput
              style={styles.placeholder}
              placeholder="Apellidos del compositor"
              placeholderTextColor="#46596B"
              onChangeText={(value) => handleChangeText("apellidos", value)}
              ref={ref2}
              onSubmitEditing={() => ref3.current.focus()}
              returnKeyType="next"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.textLabel}>Año de nacimiento (Opcional)</Text>
            <TextInput
              style={styles.placeholder}
              keyboardType="numeric"
              placeholderTextColor="#46596B"
              placeholder="XXXX"
              onChangeText={(value) => handleChangeText("anoNacimiento", value)}
              ref={ref3}
              onSubmitEditing={() => ref4.current.focus()}
              returnKeyType="next"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.textLabel}>Año de defunción (Opcional)</Text>
            <TextInput
              style={styles.placeholder}
              keyboardType="numeric"
              placeholderTextColor="#46596B"
              placeholder="XXXX"
              onChangeText={(value) => handleChangeText("anoDefuncion", value)}
              ref={ref4}
              onSubmitEditing={() => ref5.current.focus()}
              returnKeyType="next"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.textLabel}>ID del compositor</Text>
            <TextInput
              style={styles.placeholder}
              keyboardType="numeric"
              placeholderTextColor="#46596B"
              placeholder="Id Compositor"
              onChangeText={(value) => handleChangeText("idCompositor", value)}
              ref={ref5}
            />
          </View>
          <View style={styles.button}>
            <Button color="#FFFFFF" title="Guardar" onPress={saveCompositor} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  textLabel: {
    left: 5,
    marginVertical: 7,
    color: BUTTON.background,
  },
  button: {
    marginRight: 0,
    backgroundColor: BUTTON.background,
    borderRadius: 5,
  },
  inputGroup: {
    fontSize: 18,
    color: "#888",
    textDecorationColor: "#000000",
    flex: 1,
    padding: 0,
    marginBottom: 15,
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
    borderColor: BUTTON.background,
    borderWidth: 0.4,
  },
});

export default createCompositor;
