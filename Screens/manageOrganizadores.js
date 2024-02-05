import { View, Text, TextInput, Button } from "react-native";
import React, { useEffect, useState } from "react";
import firebase from "../database/firebase";
import { KeyboardAvoidingView } from "react-native";
import { StyleSheet } from "react-native";

const manageOrganizadores = () => {
  const initialState = {
    idOrganizador: "",
    nombre: "",
    nombreCorto: "",
    url: "",
  };
  const [organizadores, setOrganizadores] = useState([]);
  const [newOrganizador, setNewOrganizador] = useState(initialState);

  const loadData = () => {
    firebase.db
      .collection("organizadores")
      .orderBy("nombreCorto", "asc")
      .get()
      .then((querySnapshot) => {
        const organizadores = [];

        querySnapshot.forEach((doc) => {
          const info = doc.data();

          organizadores.push({
            nombre: info.nombre,
            nombreCorto: info.nombreCorto,
            url: info.url,
          });
        });
        setOrganizadores(organizadores);
      });
  };

  const handleGuardarOrganizador = async () => {
    if (
      newOrganizador.idOrganizdor === "" ||
      newOrganizador.nombre === "" ||
      newOrganizador.nombreCorto === ""
    ) {
      alert("Hay campos sin rellenar");
    } else {
      try {
        await firebase.db
          .collection("organizadores")
          .doc(newOrganizador.idOrganizador)
          .set({
            idOrganizador: newOrganizador.idOrganizador,
            nombre: newOrganizador.nombre,
            nombreCorto: newOrganizador.nombreCorto,
            url: newOrganizador.url,
          });
        setNewOrganizador(initialState);
        loadData();
        alert("Guardado");
      } catch (error) {
        console.error(error);
      }
    }
    
  };

  const handleChangeText = (name, value) => {
    setNewOrganizador({ ...newOrganizador, [name]: value });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <KeyboardAvoidingView behaviour="padding" style={{ flex: 1 }}>
      <View style={s.form}>
        <View style={s.group}>
          <Text style={s.label}>ID</Text>
          <TextInput
            value={newOrganizador.idOrganizador}
            style={s.input}
            placeholderTextColor={"#B3B3B3"}
            placeholder="Text"
            onChangeText={(value) => handleChangeText("idOrganizador", value)}
          ></TextInput>
        </View>
        <View style={s.group}>
          <Text style={s.label}>Nombre corto</Text>
          <TextInput
            value={newOrganizador.nombreCorto}
            style={s.input}
            placeholderTextColor={"#B3B3B3"}
            placeholder="Text"
            onChangeText={(value) => handleChangeText("nombreCorto", value)}
          ></TextInput>
        </View>
        <View style={s.group}>
          <Text style={s.label}>Nombre largo</Text>
          <TextInput
            value={newOrganizador.nombre}
            style={s.input}
            placeholderTextColor={"#B3B3B3"}
            placeholder="Text"
            onChangeText={(value) => handleChangeText("nombre", value)}
          ></TextInput>
        </View>
        <View style={s.group}>
          <Text style={s.label}>Escudo (png)</Text>
          <TextInput
            value={newOrganizador.url}
            style={s.input}
            placeholderTextColor={"#B3B3B3"}
            placeholder="URL"
            onChangeText={(value) => handleChangeText("url", value)}
          ></TextInput>
        </View>
        <Button
          title="Guardar organizador"
          onPress={handleGuardarOrganizador}
        />
      </View>
      <View style={s.list}>
        {organizadores.map((organizador, index) => {
          return (
            <View key={index} style={s.card}>
              <Text>{organizador.nombreCorto}</Text>
              <Text style={s.nombre}>{organizador.nombre}</Text>
            </View>
          );
        })}
      </View>
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({
  card: {
    borderRadius: 5,
    borderWidth: 1,
    marginHorizontal: 30,
    marginVertical: 5,
    padding: 5,
    borderColor: "#B9B9B9",
  },
  form: {
    flexDirection: "column",
    margin: 15,
    padding: 5,
    borderRadius: 5,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  group: {
    flexDirection: "row",
    padding: 10,
    borderBottomColor: "#B3B3B3",
    borderBottomWidth: 1,
    borderBottomEndRadius: 30,
  },
  input: {
    color: "#000000",
    fontSize: 15,
    flexWrap: "wrap",
    flexShrink: 0.1,
    flex: 1,
    paddingRight: 20,
  },
  label: { width: 100, fontSize: 15 },
  list: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
    margin: 15,
    marginTop: 5,
    borderRadius: 5,
    paddingTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nombre: {
    color: "#3C3C4C",
    opacity: 0.7,
  },
});
export default manageOrganizadores;
