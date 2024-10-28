import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { IconButton } from "react-native-paper";
import { BUTTON } from "../Screens/variables";

function ModalExternalComposition({ isVisible, onClose, response }) {
	const [composicionInfo, setComposicionInfo] = useState({ titulo: "", compositor: "", ubicacion: "" });

	const handleChangeText = (name, value) => {
		setComposicionInfo({ ...composicionInfo, [name]: value });
	};

	const handleSubmit = () => {
		if (composicionInfo.compositor === "" || composicionInfo.titulo === "" || composicionInfo.ubicacion === "") {
			alert("Debe rellenar todos los campos");
		} else {
			response(composicionInfo);
		}
	};

	return (
		<Modal animationType="fade" transparent={false} visible={isVisible}>
			<View style={styles.modalContent}>
				<View style={styles.titleContainer}>
					<Text style={styles.title}>Inserta una composición externa</Text>
					<Pressable onPress={onClose}>
						<IconButton icon={"close"} iconColor="white" />
					</Pressable>
				</View>
				<View style={styles.inputsWrapper}>
					<TextInput autoCorrect={false} onChangeText={(value) => handleChangeText("titulo", value)} placeholder="Título" placeholderTextColor="#909497" style={styles.input} />
					<TextInput onChangeText={(value) => handleChangeText("compositor", value)} placeholder="Compositor" placeholderTextColor="#909497" style={styles.input} />
					<TextInput onChangeText={(value) => handleChangeText("ubicacion", value)} placeholder="Calle" placeholderTextColor="#909497" style={styles.input} />
				</View>
				<View style={styles.buttonWrapper}>
					<Pressable style={styles.button} onPress={handleSubmit}>
						<Text style={{ color: "white" }}>Guardar</Text>
					</Pressable>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	modalContent: {
		height: "25%",
		width: "100%",
		backgroundColor: "#25292e",
		borderTopRightRadius: 18,
		borderTopLeftRadius: 18,
		position: "absolute",
		top: 50
	},
	titleContainer: {
		height: "16%",
		backgroundColor: "#464C55",
		borderTopRightRadius: 10,
		borderTopLeftRadius: 10,
		paddingHorizontal: 20,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between"
	},
	title: {
		color: "#fff",
		fontSize: 16
	},
	inputsWrapper: {
		marginTop: 20,
		rowGap: 10,
		marginHorizontal: 10
	},
	input: {
		padding: 5,
		borderBottomColor: "gray",
		borderBottomWidth: 0.2,
		color: "white"
	},
	buttonWrapper: {
		display: "flex",
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		verticalAlign: "middle"
	},
	button: {
		backgroundColor: BUTTON.background,
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderRadius: 10
	}
});

export default ModalExternalComposition;
