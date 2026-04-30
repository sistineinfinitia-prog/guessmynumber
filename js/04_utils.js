function genCode(){const c="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";return Array.from({length:4},()=>c[Math.floor(Math.random()*c.length)]).join("");}

function el(tag,attrs={},...kids){
  const e=document.createElement(tag);
  for(const[k,v]of Object.entries(attrs)){
    if(k==="class")e.className=v;
    else if(k==="style")e.style.cssText=v;
    else if(k.startsWith("on"))e.addEventListener(k.slice(2).toLowerCase(),v);
    else e.setAttribute(k,v);
  }
  for(const c of kids){if(c==null)continue;e.appendChild(typeof c==="string"?document.createTextNode(c):c);}
  return e;
}
const d=(cls,...c)=>el("div",{class:cls},...c);
const sp=(cls,t)=>el("span",{class:cls},t);

function render(){
  document.getElementById("app").innerHTML="";
  const screens={home:renderHome,lobby:renderLobby,picknumber:renderPickNumber,waitpick:renderWaitPick,modifiers:renderModifiers,game:renderGame,winner:renderWinner};
  document.getElementById("app").appendChild((screens[S.screen]||renderHome)());
}

// ── MODIFIER HELPERS ──────────────────────────────────────────
function getActiveModifiers(data){
  return data.activeModifiers ? Object.values(data.activeModifiers) : [];
}

function hasMod(data, id){
  return getActiveModifiers(data).includes(id);
}

function applyVisualMods(data){
  const mods=getActiveModifiers(data);
  const allModClasses=["mod-midnight","mod-sakura","mod-cupid","mod-colorflip","mod-retro","mod-glitter","mod-letter","mod-violet","mod-drama","mod-rainbow","mod-neon","mod-heartbeat"];
  allModClasses.forEach(c=>document.body.classList.remove(c));
  mods.forEach(m=>document.body.classList.add("mod-"+m));
  if(mods.includes("sakura")){
    heartSpawnSymbols=["🌸","🌸","🌸","🌸","🌺","🌷","🌸","✿"];
  } else {
    heartSpawnSymbols=["♥","♡","💕","❤","✦","🌸","✿","·","♥","♡"];
  }
}

function removeVisualMods(){
  ["mod-midnight","mod-sakura","mod-cupid","mod-colorflip","mod-retro","mod-glitter","mod-letter","mod-violet","mod-drama","mod-rainbow","mod-neon","mod-heartbeat"].forEach(c=>document.body.classList.remove(c));
  heartSpawnSymbols=["♥","♡","💕","❤","✦","🌸","✿","·","♥","♡"];
}

// Seeded random pick of 4 modifiers (2 visual, 2 gameplay) using room code as seed
function pickModifiers(roomCode){
  let seed=0;
  for(let i=0;i<roomCode.length;i++) seed=(seed*31+roomCode.charCodeAt(i))>>>0;
  function seededRand(max){ seed=(seed*1664525+1013904223)>>>0; return seed%max; }
  function shuffle(arr){
    const a=[...arr];
    for(let i=a.length-1;i>0;i--){ const j=seededRand(i+1); [a[i],a[j]]=[a[j],a[i]]; }
    return a;
  }
  const vis=shuffle(VISUAL_MODS).slice(0,3);
  const gp=shuffle(GAMEPLAY_MODS).slice(0,3);
  return [...vis,...gp];
}

// ── FLOATING EMOJI ────────────────────────────────────────────
function floatEmoji(em,x,y){
  const layer=document.getElementById("efloat");
  const floater=document.createElement("div"); floater.className="emoji-floater";
  floater.textContent=em;
  floater.style.left=(x||Math.random()*80+10)+"%";
  floater.style.top=(y||60)+"%";
  floater.style.animationDuration=(1.6+Math.random()*1.2)+"s";
  layer.append(floater); setTimeout(()=>floater.remove(),3000);
}

async function sendReaction(em, evt){
  if(S.roomData && hasMod(S.roomData,"secret")) return;
  floatEmoji(em);
  if(evt && document.body.classList.contains("mod-glitter")) triggerGlitter(evt.clientX, evt.clientY);
  await fbPush(`/duels/${S.roomCode}/reactions`,{emoji:em,player:S.username,ts:Date.now()});
}