import * as firebase from 'firebase-app';

import 'firebase-firestore';

// Pass in your own configuration options
const config = {
  apiKey: "AIzaSyCcVDWLlTCY9J8hNJNAB8RatW0mkeNBeLM",
  authDomain: "nihongo-renshuu.firebaseapp.com",
  databaseURL: "https://nihongo-renshuu.firebaseio.com",
  projectId: "nihongo-renshuu",
  storageBucket: "nihongo-renshuu.appspot.com",
  messagingSenderId: "459783235634"
};

if (!firebase.apps.length) {
    firebase.initializeApp(config)
}

export default firebase;
