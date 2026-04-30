// ── FIREBASE ─────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyCAebrmpa0AnLx5K4hgM5ye_fH3k7Uq828",
  authDomain: "guess-my-number-44f1e.firebaseapp.com",
  databaseURL: "https://guess-my-number-44f1e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "guess-my-number-44f1e",
  storageBucket: "guess-my-number-44f1e.firebasestorage.app",
  messagingSenderId: "80052008148",
  appId: "1:80052008148:web:6bca3ce08a0bd07d84b741",
  measurementId: "G-J2CTJZMPFE"
};
const DB = firebaseConfig.databaseURL;
async function fbGet(p){try{const r=await fetch(DB+p+".json");return r.json();}catch{return null;}}
async function fbSet(p,d){await fetch(DB+p+".json",{method:"PUT",body:JSON.stringify(d)});}
async function fbUpdate(p,d){await fetch(DB+p+".json",{method:"PATCH",body:JSON.stringify(d)});}
async function fbPush(p,d){const r=await fetch(DB+p+".json",{method:"POST",body:JSON.stringify(d)});return r.json();}
async function fbDelete(p){await fetch(DB+p+".json",{method:"DELETE"});}