import { View, Text, Modal, StyleSheet, Pressable } from "react-native";
import { IconButton, TextInput } from "react-native-paper";
import DateTimePickerModal from "@react-native-community/datetimepicker";
import { useState } from "react";
import { BUTTON } from "../Screens/variables";
import { getDatabase, ref, set } from "firebase/database";

export default function ModalTwit({ visible, setshowTwitInput, idActuacion }) {
	const initialState = {
		url: "",
		time: new Date()
	};
	const [twit, setTwit] = useState(initialState);

	const generateTwitID = () => {
		let newDate = new Date();
		newDate = twit.time;
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

	const addTwit = async () => {
		const db = getDatabase();
		const id = generateTwitID();

		try {
			set(ref(db, "repertorios/" + idActuacion + "/" + id), {
				url: twit.url,
				time: twit.time.toLocaleString(),
				idInterpretacion: id
			});
			setshowTwitInput();
			setTwit(initialState);
		} catch (error) {
			console.log(error);
		}
	};

	const handleChangeText = (name, value) => {
		setTwit({ ...twit, [name]: value });
	};
	return (
		<Modal visible={visible} transparent={false} animationType="slide">
			<View style={styles.modalView}>
				<IconButton
					icon="close"
					style={{ backgroundColor: "white", alignSelf: "flex-end", marginRight: 20 }}
					onPress={() => {
						setshowTwitInput(false);
					}}
				/>
				<View style={{ display: "flex", flexDirection: "row" }}>
					<TextInput onChangeText={(value) => handleChangeText("url", value)} style={styles.modalInput} autoFocus={true} placeholder="Url" autoCapitalize="none" autoCorrect={false}></TextInput>
					<Pressable style={styles.modalPressable} onPress={addTwit}>
						<Text style={{ color: "white" }}>Añadir</Text>
					</Pressable>
					{/* <View style={[styles.button, { width: "30%", height: 50 }]}>
									<Button color="#FFFFFF" title="Aceptar" onPress={() => addTwit()} />
								</View> */}
				</View>
				<DateTimePickerModal
					display="inline"
					isDatePickerVisible={true}
					mode="datetime"
					value={twit.time}
					themeVariant="dark"
					locale="es-ES"
					onChange={(value) => {
						handleChangeText("time", new Date(value.nativeEvent.timestamp));
					}}
					style={styles.dateTimePicker}
				/>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	modalView: {
		flex: 1,
		paddingTop: 50,
		backgroundColor: "black"
	},
	dateTimePicker: {
		height: "100%"
	},
	modalInput: {
		flex: 1,
		backgroundColor: "white",
		paddingVertical: 5,
		borderRadius: 5,
		height: 40,
		paddingLeft: 5,
		marginRight: 5
	},
	modalPressable: {
		backgroundColor: BUTTON.background,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 15,
		borderRadius: 5
	}
});
