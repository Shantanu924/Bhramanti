import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {collection, getFirestore} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCyIXA229tj09HtkSQUNkPZmbP0G7iWqzY",
    authDomain: "bhramanti-2024.firebaseapp.com",
    projectId: "bhramanti-2024",
    storageBucket: "bhramanti-2024.appspot.com",
    messagingSenderId: "671555597189",
    appId: "1:671555597189:web:65f1f61db9db629a078aec",
    measurementId: "G-DY0F7KZ5Y1",
    collectionId:"bhramanti"
  };
  
const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.getAnalytics(firebaseConfig);
let db = firebase.getFirestore();

module.exports={app,analytics,db}