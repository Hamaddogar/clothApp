import * as firebase from 'firebase';
// Production mode
// var config = {
//   apiKey: "AIzaSyDQ90XxSQEQGCuKpYG7LEMVYt8Vuzeupy8",
//   authDomain: "picasso-italino.firebaseapp.com",
//   databaseURL: "https://picasso-italino.firebaseio.com",
//   projectId: "picasso-italino",
//   storageBucket: "picasso-italino.appspot.com",
//   messagingSenderId: "297568861062"
// };



//Dev mode
// var config = {
//   apiKey: "AIzaSyBxjD2nsJAHSroGM18uHK7kh2igNh4WkJI",
//   authDomain: "fineclub-dev.firebaseapp.com",
//   databaseURL: "https://fineclub-dev.firebaseio.com",
//   projectId: "fineclub-dev",
//   storageBucket: "fineclub-dev.appspot.com",
//   messagingSenderId: "297568861062"
// };

 var config = {
  apiKey: "AIzaSyACqeCXOoCAfGZMC93VwhAjaEHccHTDryI",
  authDomain: "bloodbankbytuof.firebaseapp.com",
  databaseURL: "https://bloodbankbytuof.firebaseio.com",
  projectId: "bloodbankbytuof",
  storageBucket: "bloodbankbytuof.appspot.com",
  messagingSenderId: "118005688460",
  appId: "1:118005688460:web:e8324462a4690047b433a9"




  // apiKey: "AIzaSyBQli5usWddt9MKTIH75KeIvRLhr8ntd3Q",
  // authDomain: "fineclub-dev.firebaseapp.com",
  // databaseURL: "https://fineclub-dev.firebaseio.com",
  // projectId: "salesfsd19-bca17",

  // S@lesFsd19@
  // salesfsd@gmail.com
  // storageBucket: "fineclub-dev.appspot.com",
  // messagingSenderId: "297568861062"
};



  firebase.initializeApp(config);
  const db = firebase.firestore()
const settings = {timestampsInSnapshots: true}
db.settings(settings)
export {
  db
}