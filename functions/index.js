const { onObjectFinalized } = require("firebase-functions/v2/storage");
const { getStorage, ref, getDownloadURL } = require("firebase/storage");
const admin = require("firebase-admin");
const functions = require("firebase-functions");

admin.initializeApp(functions.config().firebase);

exports.updateImageURL = onObjectFinalized(async (event) => {
	// const id = event.data.name.split("/")[1];
	// const storage = getStorage();
	// const imageRef = ref(storage, `actuaciones/${id}`);
	// getDownloadURL(imageRef)
	// 	.then(async (url) => {
	// 		await admin
	// 			.firestore()
	// 			.doc(`actuaciones/${id}`)
	// 			.update({ coverImage: url })
	// 			.then(() => {
	// 				console.log("Success");
	// 			})
	// 			.catch((error) => {
	// 				console.error(error);
	// 			});
	// 	})
	// 	.catch((error) => {
	// 		console.log("!!!ERROR", error);
	// 	});
});
