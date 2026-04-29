// ── FIREBASE ─────────────────────────────────────────────────
const DB="https://guessr-7c5b6-default-rtdb.firebaseio.com";
async function fbGet(p){try{const r=await fetch(DB+p+".json");return r.json();}catch{return null;}}
async function fbSet(p,d){await fetch(DB+p+".json",{method:"PUT",body:JSON.stringify(d)});}
async function fbUpdate(p,d){await fetch(DB+p+".json",{method:"PATCH",body:JSON.stringify(d)});}
async function fbPush(p,d){const r=await fetch(DB+p+".json",{method:"POST",body:JSON.stringify(d)});return r.json();}
async function fbDelete(p){await fetch(DB+p+".json",{method:"DELETE"});}