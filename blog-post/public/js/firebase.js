import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBHCd0MGZoGCOf60WeomPZUMADs5uEGLOU",
    authDomain: "bharamanti.firebaseapp.com",
    projectId: "bharamanti",
    storageBucket: "bharamanti.appspot.com",
    messagingSenderId: "124592706261",
    appId:"1:124592706261:web:6b41e4fa89f878eeed885c",
    measurementId: "G-QXZR37J8E0"
};

const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.getAnalytics(firebaseConfig);
let db = firebase.getFirestore();

module.exports={app,analytics,db}