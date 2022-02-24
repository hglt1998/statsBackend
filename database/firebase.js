import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDs8CaWFY-Cun64ThymTiHcpD5achpDyV8",
    authDomain: "banda-database.firebaseapp.com",
    databaseURL: "https://banda-database-default-rtdb.firebaseio.com",
    projectId: "banda-database",
    storageBucket: "banda-database.appspot.com",
    messagingSenderId: "544289795038",
    appId: "1:544289795038:web:255e10d3dbf4442c6ecb4f",
    measurementId: "G-V036DKFVH5"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const app = firebase.initializeApp(firebaseConfig);
const database = getDatabase(app)

const db = firebase.firestore();
export default {
    firebase,
    db,
    database
}