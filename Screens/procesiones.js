import React, { useState, useEffect } from "react";
import { View, StatusBar, ScrollView, Text, RefreshControl, StyleSheet, Alert, ActivityIndicator, Pressable } from "react-native";
import firebase from "../database/firebase";
import { FAB, IconButton, Portal } from "react-native-paper";
import { COLORS } from "./variables";
import { getDatabase, ref, set } from "firebase/database";
import { useIsFocused } from "@react-navigation/native";
import { useActuaciones } from "../hooks/useActuaciones";
import { deleteActuacion } from "../services/ActuacionesService";

function events({ navigation }) {
	const [refreshing, setRefreshing] = useState(false);
	const [state, setState] = useState({ open: false });
	const { open } = state;
	const isFocused = useIsFocused();
	const { actuaciones, getActuaciones, loading } = useActuaciones();

	const onStateChange = ({ open }) => setState({ open });

	const loadData = async () => {
		await getActuaciones();
	};

	const handleNavigate = (evento) => {
		navigation.navigate("actuacionDetail", { eventoId: evento.id, info: evento });
	};

	useEffect(() => {
		loadData();
	}, []);

	const handleDelete = (id) => {
		Alert.alert("Eliminar", "¿Estás seguro que deseas eliminar esta actuación?", [
			{
				text: "Sí",
				onPress: () => {
					deleteActuacion(id);
				},
				style: "destructive"
			},
			{
				text: "No",
				onPress: () => {
					return;
				}
			}
		]);
	};

	return (
		<View>
			{loading ? (
				<ActivityIndicator style={{ marginVertical: "auto", height: "100%" }} />
			) : (
				<ScrollView style={{ backgroundColor: "#fffefb" }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} />}>
					<StatusBar animated={true} backgroundColor="#61dafb" barStyle={"dark-content"} showHideTransition={"fade"} hidden={false} />
					{isFocused && (
						<Portal>
							<FAB.Group
								open={open}
								visible
								icon={"plus"}
								fabStyle={{ backgroundColor: COLORS.primary }}
								color="white"
								label="Crear"
								actions={[
									{
										icon: "music-note",
										onPress: () => navigation.navigate("createComposicion"),
										label: "Composición",
										color: "white",
										color: COLORS.primary,
										style: { backgroundColor: "white" }
									},
									{
										icon: "account",
										onPress: () => navigation.navigate("createCompositor"),
										label: "Compositor",
										color: COLORS.primary,
										style: { backgroundColor: "white" }
									},
									{
										icon: "file-document",
										onPress: () => navigation.navigate("createActuacion"),
										label: "Actuación",
										color: "white",
										color: COLORS.primary,
										style: { backgroundColor: "white" }
									}
								]}
								onStateChange={onStateChange}
							/>
						</Portal>
					)}

					<Text style={{ fontWeight: "bold", fontSize: 40, marginLeft: 5, paddingLeft: 30 }}>Actuaciones</Text>
					{actuaciones.map((evento, index) => {
						const formatedDate = new Date(evento.fecha.seconds * 1000).toLocaleString().toString().slice(0, -3);
						return (
							<Pressable key={index} style={styles.card} onPress={() => handleNavigate(evento)}>
								<View style={styles.leftGroup}>
									<Text style={[styles.concept, { color: evento.isLive ? "red" : "black" }]}>{evento.concepto}</Text>
									<Text>{evento.organizador1}</Text>
									<Text>{formatedDate}</Text>
								</View>
								<View style={styles.actions}>
									<IconButton icon="delete-off" iconColor="#f44336" onPress={() => handleDelete(evento.id)} />
									<IconButton icon="file-edit" onPress={() => handleNavigate(evento)} />
								</View>
							</Pressable>
						);
					})}
				</ScrollView>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	textButton: {
		fontWeight: "bold",
		margin: "auto",
		textAlign: "center",
		paddingVertical: 8,
		fontSize: 18,
		color: COLORS.secondary
	},
	button: {
		padding: 5,
		backgroundColor: COLORS.primary,
		padding: 5,
		margin: 5,
		borderRadius: 10
	},
	card: {
		display: "flex",
		flexDirection: "row",
		margin: 5,
		padding: 10,
		borderBottomWidth: StyleSheet.hairlineWidth
	},
	leftGroup: {
		fontSize: "15",
		width: "75%",
		paddingLeft: 20
	},
	actions: {
		display: "flex",
		flexDirection: "row",
		width: "25%",
		paddingRight: 20
	},
	concept: {
		fontWeight: "bold",
		fontSize: "16"
	}
});

export default events;
