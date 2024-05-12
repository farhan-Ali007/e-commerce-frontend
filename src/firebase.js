// import * as firebase from "firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDluMQsCeqEj_KMDa2cyDjN4vPk_TqdbRY",
    authDomain: "ecommerce-8bdb3.firebaseapp.com",
    projectId: "ecommerce-8bdb3",
    storageBucket: "ecommerce-8bdb3.appspot.com",
    messagingSenderId: "760733504901",
    appId: "1:760733504901:web:de804e7fe01660ce3b60ec",
};
// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);

// export
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();