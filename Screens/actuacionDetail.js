import { getDatabase, increment, onValue, ref, refFromURL, set, update } from "firebase/database";
import React, { Fragment, useEffect, useState } from "react";
import { ActivityIndicator, IconButton, ProgressBar } from "react-native-paper";
import { Button, ScrollView, Text, View, StyleSheet, TextInput, Alert, Dimensions, Pressable, Image, StatusBar, Modal, InputAccessoryView } from "react-native";
import firebase from "../database/firebase";
import DateTimePickerModal from "@react-native-community/datetimepicker";
import { Badge } from "react-native-elements";
import { BUTTON } from "./variables";
import { deleteObject, getDownloadURL, ref as sref, uploadBytesResumable } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import defaultImage from "../assets/actuacion-cover.webp";
import ModalExternalComposition from "../componentes/ModalExternalComposition";
import { addNewExternalComposicion } from "../services/ActuacionesService";
import ModalTwit from "../componentes/ModalTwit";
import { useNavigation } from "@react-navigation/native";

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
		coverImage: ""
	};

	const idActuacion = props.route.params.eventoId;

	const [interpretacion, setNuevaInterpretacion] = useState("");

	const [actuacion, setActuacion] = useState(initialState);

	const [repertorios, setRepertorios] = useState([]);

	const [composicion, setComposicion] = useState([]);

	const [location, setLocation] = useState("");

	const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

	const [customDate, setCustomDate] = useState(new Date());

	const [connection, setConnection] = useState(false);

	const [searchVisible, setsearchVisible] = useState(false);

	const [listado, setlistado] = useState([]);

	const [suggestions, setSuggestions] = useState([]);

	const [showTwitInput, setshowTwitInput] = useState(false);

	const [uploading, setUploading] = useState(false);

	const [uploadProgress, setUploadProgress] = useState(0);

	const [showModalExternalComposicion, setShowModalExternalComposicion] = useState(false);

	// ----------------------------- USEEFFECT -----------------------------
	useEffect(() => {
		StatusBar.setBarStyle("light-content");
		getActuacionByID(idActuacion);
		loadData();
		loadComposiciones();

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

	// ----------------------------- HANDLERS -----------------------------

	const handleHome = async () => {
		await props.navigation.navigate("procesiones");
	};

	const handleChangeText = (name, value) => {
		setActuacion({ ...actuacion, [name]: value });
	};

	const handleEdit = (id) => {
		Alert.alert("Acciones", "¿Qué acción deseas realizar?", [
			{
				text: "Editar calle",
				onPress: () => handleEditCalle(id)
			},
			{
				text: "Marcar como enlazada",
				onPress: () => handleEnlazada(id)
			},
			{
				text: "Eliminar interpretacion",
				onPress: () => handleDelete(id),
				style: "destructive"
			},
			{
				text: "Cancelar",
				onPress: () => console.log("Cancel pressed")
			}
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
					style: "destructive"
				},
				{
					text: "Confirmar",
					onPress: (text) => {
						try {
							const updates = {};
							updates[`repertorios/${idActuacion}/${id}/ubicacion`] = text;
							update(dbRef, updates);
						} catch (error) {
							console.log(error);
						}
					}
				}
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
					onPress: () => console.log("No selected")
				},
				{
					text: "Sí",
					onPress: () => {
						const db = getDatabase();
						set(ref(db, "repertorios/" + idActuacion + "/" + id), null);
					}
				}
			],
			{ cancelable: true }
		);
	};

	const handleDeleteTwit = (idTwit) => {
		Alert.alert(
			"Eliminar",
			"¿Estás seguro que deseas eliminar este twit?",
			[
				{
					text: "No",
					onPress: () => console.log("No selected")
				},
				{
					text: "Sí",
					onPress: () => {
						const db = getDatabase();
						set(ref(db, "repertorios/" + idActuacion + "/" + idTwit), null);
					}
				}
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
				day: "2-digit"
			})
			.replace(/[^0-9]/g, "");
		const time = newDate.getTime().toString();
		return date + time;
	};

	const addInterpretacion = async () => {
		const db = getDatabase();
		const id = generateID();
		setDatosComposicion(interpretacion);

		const time = isDatePickerVisible ? customDate.toLocaleString() : new Date().toLocaleString();
		try {
			set(ref(db, "repertorios/" + idActuacion + "/" + id), {
				nMarcha: interpretacion,
				ubicacion: location ? location : "",
				time: time,
				idInterpretacion: id,
				tituloMarcha: composicion.titulo,
				compositor: composicion.compositor,
				idCompositor: composicion.idCompositor,
				enlazada: 1
			}).finally((error) => {
				console.log(error);
			});
			setNuevaInterpretacion("");
			setLocation("");
			setIsDatePickerVisible(false);
			setCustomDate(new Date());
		} catch (error) {
			console.log(error);
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
		firebase.db
			.collection("actuaciones")
			.doc(id)
			.onSnapshot((doc) => {
				const actuacion = doc.data();
				setActuacion({ ...actuacion, idActuacion: id, idRepertorio: id });
			});
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

	const loadComposiciones = async () => {
		await firebase.db
			.collection("composiciones")
			.get()
			.then((querySnapshot) => {
				const listado = [];

				querySnapshot.forEach((doc) => {
					const info = doc.data();

					listado.push({
						compositor: info.compositor,
						titulo: info.titulo,
						idFirebase: doc.id,
						idComposicion: info.idComposicion
					});
				});
				setlistado(listado);
			});
	};

	const setDatosComposicion = (nMarcha) => {
		const doc = firebase.db.collection("composiciones").doc(nMarcha);
		doc.get().then((info) => {
			const interpretacion = info.data();
			setComposicion(interpretacion);
		});
	};

	const handleModalInput = (value) => {
		if (value.length > 3) {
			setSuggestions(listado.filter((marcha) => marcha.titulo.toLowerCase().includes(value.toLowerCase())));
		} else {
			setSuggestions([]);
		}
	};

	const convertToWebP = async (uri) => {
		let resultBlob;
		try {
			// Convertir la imagen a formato WEBP y comprimir
			const manipulatedImage = await ImageManipulator.manipulateAsync(
				uri, // Imagen original
				[], // No aplicar cambios (ej. resize)
				{ format: ImageManipulator.SaveFormat.WEBP, compress: 0.8 } // Convertir a WebP y comprimir
			);

			// Obtener el Blob desde la URI resultante
			const response = await fetch(manipulatedImage.uri);
			resultBlob = await response.blob(); // Convertir a Blob
		} catch (error) {
			console.error("Error al convertir la imagen:", error);
		}

		return resultBlob; // Devolver el Blob listo para subir a Firebase Storage
	};

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1
		});

		if (!result.canceled && result.assets[0].uri) {
			const resultConverted = await convertToWebP(result.assets[0].uri);

			try {
				const storageRef = sref(firebase.storage, `actuaciones/${actuacion.idActuacion}`);
				const uploadTask = await uploadBytesResumable(storageRef, resultConverted).catch((error) => console.error(error));
				setUploading(true);
				await getDownloadURL(uploadTask.ref).then(async (url) => {
					const docRef = firebase.db.collection("actuaciones").doc(actuacion.idActuacion);
					setUploading(false);
					await docRef.set({ ...actuacion, coverImage: url }).catch((error) => console.log(error));
				});
			} catch (error) {
				console.error(error);
			}
		}
	};

	const handleModificarImagen = () => {
		Alert.alert("Opciones", "Escoge la opción", [
			{
				text: "Modificar",
				onPress: () => pickImage()
			},
			{
				text: "Eliminar",
				onPress: () =>
					Alert.alert("Esta acción no se puede revocar", "¿Estás seguro?", [
						{
							text: "Sí",
							onPress: () => {
								const storageRef = sref(firebase.storage, "actuaciones/" + actuacion.idActuacion);
								deleteObject(storageRef);

								const docref = firebase.db.collection("actuaciones").doc(actuacion.idActuacion);
								docref.update({ coverImage: "" });
							}
						},
						{
							text: "No",
							style: "destructive",
							onPress: () => console.log("No seleccionado")
						}
					])
			}
		]);
	};

	const handleShowExternalComposicion = () => {
		setShowModalExternalComposicion(!showModalExternalComposicion);
	};

	const handleShowTwitInput = () => {
		setshowTwitInput(!showTwitInput);
	};

	const handleEditField = (field) => {
		Alert.prompt(
			"Modifica",
			`Introduce el nuevo valor para ${field}`,
			[
				{
					text: "Cancelar",
					style: "destructive",
					onPress: () => console.log("Cancel")
				},
				{
					text: "Confirmar",
					onPress: (response) => updateFieldInDocument(field, response)
				}
			],
			"plain-text",
			actuacion[field]
		);
	};

	const handleExternalComposicionResponse = (response) => {
		setShowModalExternalComposicion(false);
		addNewExternalComposicion(response.titulo, response.compositor, response.ubicacion, idActuacion);
	};

	const updateFieldInDocument = (key, value) => {
		const docref = firebase.db.collection("actuaciones").doc(actuacion.idActuacion);
		docref.update({ [key]: value });
	};

	const handleEditActuacionInfo = () => {
		Alert.alert("Modificar", "¿Qué elemento deseas modificar?", [
			{
				text: "Concepto",
				onPress: () => handleEditField("concepto")
			},
			{
				text: "Organizador",
				onPress: () => handleEditField("organizador1")
			},
			{
				text: "Ubicación",
				onPress: () => handleEditField("ubicacion")
			},
			{
				text: "Imagen",
				onPress: () => handleModificarImagen()
			},
			{
				text: "Cancelar",
				style: "destructive",
				onPress: () => console.log("Cancelado")
			}
		]);
	};

	// ----------------------------- VIEW -----------------------------

	return (
		<>
			{actuacion.concepto ? (
				<ScrollView keyboardShouldPersistTaps="never" style={styles.container}>
					{searchVisible && (
						<Modal presentationStyle="pageSheet" animationType="slide" visible={searchVisible}>
							<IconButton
								icon="close"
								style={{ backgroundColor: "white", alignSelf: "flex-end" }}
								onPress={() => {
									setsearchVisible(false);
									setSuggestions([]);
								}}
							/>
							<TextInput
								placeholder="Nombre de la composición"
								style={{ backgroundColor: "#76768012", margin: 20, padding: 8, color: "black", fontSize: 16, borderColor: "#767680", borderRadius: 8 }}
								clearButtonMode="while-editing"
								onChangeText={(value) => handleModalInput(value)}
								autoFocus
								autoCorrect={false}
							/>
							{suggestions.length >= 1 &&
								suggestions.map((marcha) => {
									return (
										<Pressable
											key={marcha.idComposicion}
											style={{ marginHorizontal: 20, marginVertical: 10, borderBottomColor: "#767680", borderBottomWidth: StyleSheet.hairlineWidth, paddingBottom: 15 }}
											onPress={() => {
												setNuevaInterpretacion(marcha.idFirebase);
												setDatosComposicion(marcha.idFirebase);
												setsearchVisible(false);
												setSuggestions([]);
											}}
										>
											<Text style={{ fontSize: 16 }}>
												{marcha.idComposicion} {marcha.titulo} | {marcha.compositor}
											</Text>
										</Pressable>
									);
								})}
						</Modal>
					)}
					<ModalTwit visible={showTwitInput} setshowTwitInput={handleShowTwitInput} idActuacion={idActuacion} />
					<ModalExternalComposition isVisible={showModalExternalComposicion} onClose={handleShowExternalComposicion} response={handleExternalComposicionResponse} />
					<View id="top-info">
						<View style={{ backgroundColor: "black", top: 0, left: 0, width: "auto", zIndex: 10, height: 220, opacity: 0.5 }}></View>
						<Image style={{ width: "auto", height: 220, zIndex: 1, marginTop: -220 }} blurRadius={6} source={{ uri: actuacion.coverImage || defaultImage }} />

						<View style={{ position: "absolute", top: 50, left: 30, right: 30, zIndex: 20 }}>
							<View style={{ display: "flex", width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
								<IconButton icon={"code-less-than"} iconColor="white" onPress={handleHome} />
								<View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
									<IconButton icon={"pencil"} iconColor="white" style={{ margin: 0 }} onPress={() => handleEditActuacionInfo()} />
									<IconButton
										animated={true}
										onPress={() => updateFieldInDocument("isLive", !actuacion.isLive)}
										icon={"access-point"}
										style={{ alignSelf: "flex-end", margin: 0 }}
										iconColor={actuacion.isLive ? "red" : "white"}
									/>
									<Badge status={connection ? "success" : "warning"} />
								</View>
							</View>
							<Text style={{ color: "white", fontWeight: "bold", fontSize: 25 }}>{actuacion.concepto}</Text>
							<Text style={{ color: "white", fontSize: 15 }}>· {actuacion.organizador1}</Text>
							<Text style={{ color: "white", fontSize: 15 }}>· {actuacion.ubicacion}</Text>
							<Text style={{ color: "white", fontSize: 15 }}>· {actuacion.ciudad}</Text>
							<Text style={{ color: "white", fontSize: 15, textTransform: "capitalize" }}>
								·{" "}
								{new Date(actuacion.fecha.seconds * 1000).toLocaleString("es-ES", { dayPeriod: "short", dateStyle: "full", hour: "2-digit", minute: "2-digit", timeStyle: "short", weekday: "short" })}
							</Text>
						</View>
					</View>
					<View>
						<View style={styles.inputs}>
							<View style={styles.textInputs}>
								<TextInput
									placeholderTextColor={BUTTON.background}
									keyboardType="numeric"
									placeholder="Nº de composición"
									onChangeText={(value) => {
										setNuevaInterpretacion(value);
										setDatosComposicion(value);
									}}
									value={interpretacion}
								/>
								<IconButton icon="magnify" onPress={() => setsearchVisible(true)} style={styles.iconButtonDelete} />
							</View>
							{actuacion.tipo === "Procesión" ? (
								<View style={styles.textInputs}>
									<TextInput
										placeholderTextColor={BUTTON.background}
										autoCorrect={false}
										placeholder="Ubicación"
										onChangeText={(value) => {
											setLocation(value);
										}}
										value={location}
									/>
									<IconButton icon="backspace" onPress={() => setLocation("")} style={styles.iconButtonDelete} />
								</View>
							) : (
								<></>
							)}
							<IconButton icon="clock-time-four-outline" iconColor="white" onPress={() => showDatePicker()} style={styles.buttonDate} />
						</View>
						<View style={{ marginHorizontal: 10, gap: 10, columnGap: 10 }}>
							<View style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
								<Pressable style={{ backgroundColor: BUTTON.text, borderRadius: 5 }} onPress={handleShowExternalComposicion}>
									<Text style={{ color: BUTTON.background, padding: 10, fontSize: 15 }}>Composición extra</Text>
								</Pressable>
								<Pressable style={{ backgroundColor: BUTTON.background, borderRadius: 5 }} onPress={() => setshowTwitInput(true)}>
									<Text style={{ color: BUTTON.text, padding: 10, fontSize: 15 }}>Añadir twit</Text>
								</Pressable>
							</View>
							<Pressable style={{ alignItems: "center", borderRadius: 5, backgroundColor: BUTTON.background, width: "auto" }} onPress={() => addInterpretacion()}>
								<Text style={{ fontWeight: "bold", fontSize: 18, color: BUTTON.text, padding: 10, borderRadius: 10 }}>Añadir composición</Text>
							</Pressable>
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
						<Fragment>
							<View style={styles.inputs}>
								<Text style={{ justifyContent: "center" }}>Total: {repertorios.filter((item) => !item.url).length}</Text>
							</View>
							<View style={styles.table}>
								<View style={styles.tableHead}>
									<Text style={[styles.whitetext, { flexBasis: 50, flexShrink: 1 }]}>Nº</Text>
									<Text style={[styles.whitetext, { flexBasis: 200, flexGrow: 1, flexShrink: 1 }]}>Composición</Text>
									{actuacion.tipo === "Procesión" ? <Text style={[styles.whitetext, { flexBasis: 200, flexGrow: 1, flexShrink: 1 }]}>Ubicación</Text> : null}
									<Text style={[styles.whitetext, { flexBasis: 75, flexShrink: 1 }]}>Hora</Text>
									<Text style={[styles.whitetext, { flexBasis: 80, flexShrink: 1, flex: 1 }]}>Actions</Text>
								</View>
								{repertorios.map((repertorio, index) => {
									const time = String(repertorio.time).slice(0, -3);
									return !repertorio.url ? (
										<View key={repertorio.idInterpretacion || index} style={repertorio.enlazada % 2 == 0 ? styles.tableRowEnlazada : styles.tableRow}>
											<Text style={{ flexBasis: 50, flexShrink: 1 }}>{repertorio.nMarcha}</Text>
											<Text style={{ flexBasis: 200, flexGrow: 1, flexShrink: 1 }}>{repertorio.tituloMarcha}</Text>
											{actuacion.tipo === "Procesión" ? (
												<Text onPress={() => setLocation(repertorio.ubicacion)} style={{ flexBasis: 200, flexGrow: 1, flexShrink: 1 }}>
													{repertorio.ubicacion}
												</Text>
											) : null}
											<Text style={{ flexBasis: 75, flexShrink: 1 }}>{time.substring(time.indexOf(",") + 2)}</Text>
											<View style={[styles.iconButtonActions, { flexBasis: 75, flexShrink: 1 }]}>
												<IconButton icon="pencil" onPress={() => handleEdit(repertorio.idInterpretacion)} iconColor="#3D5A80" style={styles.iconButtonActions} />
											</View>
										</View>
									) : (
										<View
											key={repertorio.url || repertorio.idInterpretacion || index}
											style={[
												styles.tableRow,
												{
													width: "100%",
													display: "flex",
													justifyContent: "space-between"
												}
											]}
										>
											<Text>{repertorio.url}</Text>
											<IconButton style={{ right: 0 }} icon="delete-off" onPress={() => handleDeleteTwit(repertorio.idInterpretacion)} />
										</View>
									);
								})}
							</View>
						</Fragment>
					)}
					{uploading && (
						<View style={styles.modalLoading}>
							<ProgressBar progress={uploadProgress} color="blue" style={{ marginHorizontal: 40, marginTop: 30 }} />
						</View>
					)}
					<Button title={"Home"} onPress={handleHome} />
				</ScrollView>
			) : (
				<ActivityIndicator animating={true} color={BUTTON.background} size={100} style={{ padding: 0, margin: "50%" }}></ActivityIndicator>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	button: {
		backgroundColor: BUTTON.background,
		borderRadius: 5,
		marginHorizontal: 10,
		padding: 5,
		marginVertical: 2
	},
	buttonDate: {
		width: 40,
		padding: 0,
		margin: 0,
		height: 40,
		alignSelf: "center",
		backgroundColor: BUTTON.background,
		borderRadius: 5
	},
	card: {
		display: "flex",
		flex: 1,
		flexDirection: "row",
		backgroundColor: "#FFFFFF",
		padding: 10,
		margin: 10,
		marginBottom: 0,
		borderRadius: 10,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3
		},
		shadowOpacity: 0.27,
		shadowRadius: 4.65,
		elevation: 6,
		justifyContent: "space-between"
	},
	container: {
		flex: 1,
		marginBottom: 40
	},
	datePicker: {
		backgroundColor: "#2E3033",
		marginHorizontal: 10,
		marginVertical: 10,
		height: 430,
		color: "#DDDDD"
	},
	editButton: {},
	info: {
		display: "flex",
		flexDirection: "row",
		paddingRight: 5,
		marginRight: 5
	},
	inputs: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-around",
		padding: 5
	},
	iconButtonDelete: {
		margin: 0,
		padding: 0,
		height: 25,
		position: "absolute",
		right: 0
	},
	iconButtonActions: { flexDirection: "row" },
	modalView: {
		position: "absolute",
		backgroundColor: "#00000090",
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height,
		justifyContent: "flex-start",
		zIndex: 1,
		paddingHorizontal: 20,
		paddingTop: 80
	},
	modalInput: {
		flex: 1,
		backgroundColor: "white",
		paddingVertical: 5,
		borderRadius: 5,
		paddingLeft: 5,
		marginRight: 5
	},
	modalPressable: {
		backgroundColor: BUTTON.background,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 15,
		borderRadius: 5,
		zIndex: 20
	},
	modalLoading: {
		position: "absolute",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		paddingTop: 50,
		flex: 1,
		height: "100%",
		width: "100%",
		backgroundColor: "black",
		opacity: 0.8
	},
	pressable: {
		backgroundColor: "beige",
		width: 150,
		borderRadius: 5,
		padding: 5
	},
	textInputs: {
		flexDirection: "row",
		alignContent: "center",
		padding: 10,
		justifyContent: "space-between",
		marginVertical: 20,
		borderRadius: 10,
		borderColor: BUTTON.background,
		borderWidth: 1,
		width: 170,
		alignItems: "center"
	},
	tableHead: {
		display: "flex",
		flexDirection: "row",
		backgroundColor: BUTTON.background,
		paddingVertical: 5,
		borderRadius: 5,
		paddingHorizontal: 10
	},
	table: {
		padding: 10
	},
	whitetext: {
		color: "white"
	},
	suggestionsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		rowGap: 5,
		columnGap: 5,
		overflow: "scroll"
	},
	tableRow: {
		flexDirection: "row",
		borderWidth: 0.8,
		borderRadius: 5,
		borderColor: BUTTON.background,
		marginVertical: 1,
		alignItems: "center",
		paddingHorizontal: 10
	},
	tableRowEnlazada: {
		display: "flex",
		flexDirection: "row",
		borderWidth: 1.2,
		borderRadius: 7,
		borderColor: BUTTON.background,
		textAlignVertical: "center",
		marginVertical: 1,
		backgroundColor: "#D7D7DE",
		alignItems: "center",
		paddingHorizontal: 10
	},
	textGroup: {
		flexDirection: "column",
		justifyContent: "space-between"
	}
});

export default actuacionDetail;
