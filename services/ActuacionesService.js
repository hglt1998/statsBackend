import { getDatabase, ref, set } from "firebase/database";
import firebase from "../database/firebase";
import { generateID } from "../utils/helper";

const db = getDatabase();

export const searchAllRepertorios = async () => {
	try {
		const events = [];
		const actuacionesRef = firebase.db.collection("actuaciones").orderBy("fecha", "desc").limit(30);
		const snapshot = await actuacionesRef.get();

		snapshot.forEach((doc) => {
			events.push(doc.data());
		});

		return events;
	} catch (error) {
		console.error(error);
	}
};

export const addNewExternalComposicion = async (titulo, compositor, ubicacion, idActuacion) => {
	const id = generateID();
	const time = new Date().toLocaleString();
	try {
		set(ref(db, "repertorios/" + idActuacion + "/" + id), {
			nMarcha: -1,
			ubicacion: ubicacion,
			time: time,
			idInterpretacion: id,
			tituloMarcha: titulo,
			compositor: compositor,
			idCompositor: -1,
			enlazada: 1
		}).finally((error) => {
			console.log(error);
		});
	} catch (error) {
		console.error(error);
	}
};

export const deleteActuacion = async (idActuacion) => {
	firebase.db.collection("actuaciones").doc(id).delete();
	set(ref(db, "repertorios/" + idActuacion), null).catch((error) => console.log(error));
};
