import * as ImageManipulator from "expo-image-manipulator";

export const generateID = () => {
	let newDate = new Date();
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

export const getWebPFromJPG = async (uri) => {
	let result;
	try {
		const manipulatedImage = await ImageManipulator.manipulateAsync(
			uri, // Imagen original
			[], // No aplicar cambios (ej. resize)
			{ format: ImageManipulator.SaveFormat.WEBP, compress: 0.8 } // Convertir a WebP y comprimir
		);
		result = manipulatedImage.uri; // Guardar la URI de la imagen WebP
	} catch (error) {
		alert(error);
	}

	return result;
};
