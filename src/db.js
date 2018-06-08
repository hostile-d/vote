import Rebase from 're-base';
import firebase from 'firebase/app';
import 'firebase/database';

var app = firebase.initializeApp({
  apiKey: "AIzaSyDav_gThEHFoaeghPv8q3iNPzzSWQfSiRA",
  authDomain: "vote-69b12.firebaseapp.com",
  databaseURL: "https://vote-69b12.firebaseio.com",
  projectId: "vote-69b12",
  storageBucket: "vote-69b12.appspot.com",
  messagingSenderId: "476460080406"
});

var db = firebase.database(app);
var base = Rebase.createClass(db);

export default base;
