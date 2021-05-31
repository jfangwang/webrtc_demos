import firebase from 'firebase';
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCd54FSEQiit25ckDbJC7F9j6QzxhmY40Q",
    authDomain: "project-yellow-ghost.firebaseapp.com",
    projectId: "project-yellow-ghost",
    storageBucket: "project-yellow-ghost.appspot.com",
    messagingSenderId: "318355821093",
    appId: "1:318355821093:web:32f328a2f1ad5ba2a225cc",
    measurementId: "G-VTVC3F31F5"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
// Google auth as a provider for this app, the popup
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, storage, provider };