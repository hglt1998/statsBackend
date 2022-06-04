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

const createComposicion = (props) => {
  const initialState = {
    anoComposicion: 0,
    idFirebase: 0,
    genero: "Marcha de Procesión",
    idComposicion: 0,
    idCompositor: 0,
    idCompositor2: "",
    subtitulo: "",
    titulo: "",
    compositor: "",
  };

  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const ref4 = useRef();
  const ref5 = useRef();
  const ref6 = useRef();
  const ref7 = useRef();
  const ref8 = useRef();

  const [state, setState] = useState(initialState);

  const saveComposicion = async () => {
    if (
      state.anoComposicion === "" ||
      state.idComposicion === "" ||
      state.idFirebase === "" ||
      state.idCompositor === "" ||
      state.titulo === ""
    ) {
      alert("Hay campos sin rellernar");
    } else {
      try {
        await firebase.db
          .collection("composiciones")
          .doc(state.idFirebase)
          .set({
            anoComposicion: Number(state.anoComposicion),
            genero: state.genero,
            idComposicion: state.idComposicion,
            idCompositor: Number(state.idCompositor),
            idCompositor2: Number(state.idCompositor2),
            subtitulo: state.subtitulo,
            titulo: state.titulo,
            compositor: state.compositor,
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
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.textLabel}>Identificador en firebase</Text>
            <TextInput
              style={styles.placeholder}
              placeholder="XXX"
              placeholderTextColor="#46596B"
              onChangeText={(value) => handleChangeText("idFirebase", value)}
              ref={ref1}
              onSubmitEditing={() => ref2.current.focus()}
              returnKeyType="next"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.textLabel}>Identificador en lista</Text>
            <TextInput
              style={styles.placeholder}
              placeholder="XXX"
              placeholderTextColor="#46596B"
              onChangeText={(value) => handleChangeText("idComposicion", value)}
              ref={ref2}
              onSubmitEditing={() => ref3.current.focus()}
              returnKeyType="next"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.textLabel}>Título de la composición</Text>
            <TextInput
              style={styles.placeholder}
              placeholder="Título"
              placeholderTextColor="#46596B"
              onChangeText={(value) => handleChangeText("titulo", value)}
              ref={ref3}
              onSubmitEditing={() => ref4.current.focus()}
              returnKeyType="next"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.textLabel}>
              Subtítulo de la composición (Opcional)
            </Text>
            <TextInput
              style={styles.placeholder}
              placeholder="Subtítulo"
              placeholderTextColor="#46596B"
              onChangeText={(value) => handleChangeText("subtitulo", value)}
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
              placeholder="XXX"
              onChangeText={(value) => handleChangeText("idCompositor", value)}
              ref={ref5}
              onSubmitEditing={() => ref6.current.focus()}
              returnKeyType="next"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.textLabel}>
              Nombre abreviado del compositor
            </Text>
            <TextInput
              style={styles.placeholder}
              placeholder="Nombre del compositor"
              placeholderTextColor="#46596B"
              onChangeText={(value) => handleChangeText("compositor", value)}
              ref={ref6}
              onSubmitEditing={() => ref7.current.focus()}
              returnKeyType="next"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.textLabel}>ID del co-autor (Opcional)</Text>
            <TextInput
              style={styles.placeholder}
              keyboardType="numeric"
              placeholderTextColor="#46596B"
              placeholder="Id Compositor2"
              onChangeText={(value) => handleChangeText("idCompositor2", value)}
              ref={ref7}
              onSubmitEditing={() => ref8.current.focus()}
              returnKeyType="go"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.textLabel}>Año de composición (Opcional)</Text>
            <TextInput
              style={styles.placeholder}
              keyboardType="numeric"
              placeholderTextColor="#46596B"
              placeholder="XXXX"
              onChangeText={(value) =>
                handleChangeText("anoComposicion", value)
              }
              ref={ref8}
              returnKeyType="go"
            />
          </View>
          <View style={styles.button}>
            <Button color="#FFFFFF" title="Guardar" onPress={saveComposicion} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#646FD4",
    borderRadius: 5,
    marginVertical: 20,
    padding: 5,
  },
  container: {
    flex: 1,
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

export default createComposicion;
