import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  TextInput,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  KeyboardAvoidingView,
  Image
} from "react-native";
import firebase from "../database/firebase";
import DateTimePickerModal from "@react-native-community/datetimepicker";
import { ActivityIndicator, SegmentedButtons, ProgressBar } from 'react-native-paper'
import { tagsActuacion, tiposActuaciones } from "../database/constants";
import { getDatabase, set, ref, onValue } from "firebase/database";
import {COLORS} from "./variables"
import { Badge } from "react-native-elements";
import * as ImagePicker from 'expo-image-picker'
import { getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { ref as sref } from 'firebase/storage';

const createActuacion = (props) => {
  const database = getDatabase();
  const [isLive, setIsLive] = useState(false);
  const [organizadores, setOrganizadores] = useState([]);
  const [connection, setConnection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0)

  const [state, setState] = useState({
    concepto: "",
    fecha: new Date(),
    idActuacion: "",
    idRepertorio: "",
    isLive: false,
    organizador1: "",
    organizador2: "",
    tipoActuacion: "",
    ubicacion: "",
    ciudad: "",
    tagActuacion: "",
    coverImage: ""
  });

  useEffect(() => {
    getOrganizadores();

    const db = getDatabase();
    const connectionRef = ref(db, ".info/connected");
    onValue(connectionRef, (snap) => {
      if (snap.val() === true) {
        setConnection(true);
      } else {
        setConnection(false);
      }
    });
  }, []);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result.assets[0].uri);

    if (!result.canceled) {
      handleChangeText("coverImage", result.assets[0].uri)
    }
  };

  const getOrganizadores = () => {
    firebase.db
      .collection("organizadores")
      .orderBy("nombre", "asc")
      .get()
      .then((querySnapshot) => {
        const organizadores = [];

        querySnapshot.forEach((doc) => {
          const info = doc.data();

          organizadores.push({
            id: info.idOrganizador,
            nombreCorto: info.nombreCorto,
            nombre: info.nombre,
            url: info.url,
          });
        });
        setOrganizadores(organizadores);
      });
  };

  const handleChangeText = (name, value) => {
    setState({ ...state, [name]: value });
  };

  const saveActuacion = async () => {
		if (state.concepto === "" || state.organizador1 === "" || state.tipoActuacion === "" || state.ubicacion === "" || state.ciudad === "") {
			alert("Hay campos sin rellenar");
		} else {
			try {
				// Crear referencia a la actuación
				const actuacion = await firebase.db.collection("actuaciones").add({
					data: null
				});
				const id = actuacion.id;

				// Subida imagen cover
				if (state.coverImage) {
					const response = await fetch(state.coverImage);
					const blob = await response.blob();

					const storageRef = sref(firebase.storage, "actuaciones/" + id);
					const uploadTask = uploadBytesResumable(storageRef, blob);

					uploadTask.on(
						"state_changed",
						(snapshot) => {
							const progress = snapshot.bytesTransferred / snapshot.totalBytes;
							switch (snapshot.state) {
								case "running":
									setLoading(true);
									setUploadProgress(progress.toFixed());
								case "paused":
								case "success":
								case "canceled":
								case "error":
							}
						},
						(error) => {
							console.log(error.code);
						},
						() => {
							getDownloadURL(uploadTask.snapshot.ref)
								.then(async (downloadUrl) => {
									firebase.db
										.collection("actuaciones")
										.doc(actuacion.id)
										.set({
											idRepertorio: id,
											idActuacion: id,
											concepto: state.concepto,
											fecha: state.fecha,
											isLive: state.isLive,
											organizador1: state.organizador1,
											organizador2: state.organizador2,
											tipo: state.tipoActuacion,
											ubicacion: state.ubicacion,
											ciudad: state.ciudad,
											tagActuacion: state.tagActuacion ? state.tagActuacion : null,
											coverImage: downloadUrl
										});

									await set(ref(database, "repertorios/" + id), {});

									setState({ ...state, idRepertorio: id });
									setLoading(false);
									await props.navigation.navigate("actuacionDetail", { eventoId: id });
								})
								.catch((error) => console.log(error));
						}
					);
				} else {
					firebase.db
						.collection("actuaciones")
						.doc(actuacion.id)
						.set({
							idRepertorio: id,
							idActuacion: id,
							concepto: state.concepto,
							fecha: state.fecha,
							isLive: state.isLive,
							organizador1: state.organizador1,
							organizador2: state.organizador2,
							tipo: state.tipoActuacion,
							ubicacion: state.ubicacion,
							ciudad: state.ciudad,
							tagActuacion: state.tagActuacion ? state.tagActuacion : null,
							coverImage: ""
						});

					await set(ref(database, "repertorios/" + id), {});

					setState({ ...state, idRepertorio: id });
					setLoading(false);
					await props.navigation.navigate("actuacionDetail", { eventoId: id });
				}
			} catch (error) {
				setLoading(false);
				console.log(error);
			}
		}
	};

  return (
    <>
      {!loading ? (
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
                {connection ? (
                  <Badge status="success"></Badge>
                ) : (
                  <Badge status="error"></Badge>
                )}
              </View>
              <View style={styles.picker}>
                <SegmentedButtons
                  value={state.tipoActuacion}
                  onValueChange={(change) => {
                    setState({ ...state, tipoActuacion: change });
                  }}
                  buttons={tiposActuaciones}
                  density="regular"
                  style={{ width: 300 }}
                  theme={{ roundness: 0 }}
                ></SegmentedButtons>
              </View>
              <View style={styles.picker}>
                <SegmentedButtons
                  value={state.tagActuacion}
                  onValueChange={(change) => {
                    setState({ ...state, tagActuacion: change });
                  }}
                  buttons={tagsActuacion}
                  density="regular"
                  style={{ width: 300 }}
                  theme={{ roundness: 0 }}
                ></SegmentedButtons>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.textLabel}>Concepto</Text>
                <TextInput
                  style={styles.placeholder}
                  placeholderTextColor="#46596B"
                  placeholder="Concierto de..."
                  onChangeText={(value) => handleChangeText("concepto", value)}
                  returnKeyType="next"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.textLabel}>Fecha</Text>
                <DateTimePickerModal 
                  mode="datetime"
                  value={state.fecha}
                  themeVariant="light"
                  onChange={(value) => handleChangeText('fecha', new Date(value.nativeEvent.timestamp))}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.textLabel}>Imagen cover</Text>
                <Button title="Selecciona una imagen" onPress={pickImage}/>
                {state.coverImage && <Image source={{ uri: state.coverImage }} style={styles.image} />}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.textLabel}>Ubicación</Text>
                <TextInput
                  style={styles.placeholder}
                  placeholderTextColor="#46596B"
                  placeholder="Lugar del evento"
                  onChangeText={(value) => handleChangeText("ubicacion", value)}
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
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.textLabel}>Organizador</Text>
                <TextInput
                  style={styles.placeholder}
                  placeholderTextColor="#46596B"
                  placeholder={"Nombre del organizador"}
                  onChangeText={(value) =>
                    handleChangeText("organizador1", value)
                  }
                  returnKeyType="next"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.textLabel}>2º organizador (Opcional)</Text>
                <TextInput
                  style={styles.placeholder}
                  placeholderTextColor="#46596B"
                  placeholder={"Organizador 2"}
                  onChangeText={(value) =>
                    handleChangeText("organizador2", value)
                  }
                  returnKeyType="next"
                />
              </View>
            </View>
          </ScrollView>
          {/* {loading && (
            <View style={styles.modalView}>
              <Text style={{color: 'white', justifyContent: 'center'}}>Subiendo imagen</Text>
              <ProgressBar progress={uploadProgress} color='white' style={{marginHorizontal: 40, marginTop: 30}}/>
            </View>
          )} */}
        </KeyboardAvoidingView>
      ) : (
        <View style={styles.modalView}>
          <ProgressBar progress={uploadProgress} color='white' style={{marginHorizontal: 40, marginTop: 30}}/>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    marginRight: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  container: {
    flex: 1,
    padding: 35,
    padding: 20,
  },
  inputGroup: {
    fontSize: 18,
    color: COLORS.primary,
    textDecorationColor: "#000000",
    flex: 1,
    padding: 0,
    marginBottom: 7,
    borderBottomColor: "#cccccc",
  },
  image: {
    width: 50,
    height: 50,
  },
  modalView: {
    position: 'absolute', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    paddingTop: 50,
    flex: 1, 
    height: '100%', 
    width: '100%',
    backgroundColor: 'black', 
    opacity: 0.8
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
    borderColor: COLORS.primary,
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
    color: COLORS.primary,
  },
});

export default createActuacion;
