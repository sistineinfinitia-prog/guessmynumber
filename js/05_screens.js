// ── HOME ─────────────────────────────────────────────────────
function renderHome(){
  removeVisualMods();
  const screen=d("screen");
  screen.append(el("div",{class:"logo"},"GUESSR"),el("div",{class:"logo-hearts"},"♥ ♥ ♥"),el("div",{class:"tag"},"1v1 number duel"));
  const cc=d("card");
  cc.append(el("div",{class:"ctitle"},"HOST A DUEL"));
  const ni=el("input",{type:"text",placeholder:"Your username...",maxlength:"14",id:"cn"});
  const ng=d("ig"); ng.append(el("label",{},"Your Name"),ni);
  const presetsLabel=el("label",{style:"display:block;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--mut);margin-bottom:5px"},"Quick Range");
  const presets=d("presets");
  [{label:"Easy",sub:"1–50",min:1,max:50},{label:"Normal",sub:"1–100",min:1,max:100},{label:"Hard",sub:"1–500",min:1,max:500},{label:"Insane",sub:"1–1000",min:1,max:1000}].forEach(p=>{
    const btn=el("button",{class:"preset-btn",onClick:()=>{
      document.getElementById("cmin").value=p.min;document.getElementById("cmax").value=p.max;
      presets.querySelectorAll(".preset-btn").forEach(b=>b.classList.remove("active"));btn.classList.add("active");
    }});
    btn.innerHTML=`<strong>${p.label}</strong><br>${p.sub}`; presets.append(btn);
  });
  const rr=d("rr"); rr.append(el("input",{type:"number",value:"1",id:"cmin"}),el("input",{type:"number",value:"100",id:"cmax"}));
  const rg=d("ig"); rg.append(presetsLabel,presets,el("label",{style:"display:block;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--mut);margin-bottom:5px;margin-top:8px"},"Custom Range (min / max)"),rr);
  // Best-of-X selector
  const boLabel=el("label",{style:"display:block;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--mut);margin-bottom:5px;margin-top:10px"},"Series Mode");
  const boSel=el("select",{id:"cbestof",style:"width:100%;background:var(--sur2);border:1px solid var(--brd);color:var(--txt);padding:8px 10px;border-radius:6px;font-family:'DM Mono',monospace;font-size:12px;letter-spacing:1px"});
  [{v:"",l:"No limit — play forever"},{v:"1",l:"First to 1 win"},{v:"3",l:"First to 2 wins (Best of 3)"},{v:"5",l:"First to 3 wins (Best of 5)"},{v:"7",l:"First to 4 wins (Best of 7)"}].forEach(o=>{
    const opt=el("option",{value:o.v},o.l); boSel.append(opt);
  });
  const bog=d("ig"); bog.append(boLabel,boSel);
  const cerr=el("div",{class:"err",id:"cerr"});
  cc.append(ng,rg,bog,cerr,el("button",{class:"btn bp",onClick:createRoom},"CREATE ROOM 💕"));
  const jc=d("card");
  jc.append(el("div",{class:"ctitle"},"JOIN A DUEL"));
  const jni=el("input",{type:"text",placeholder:"Your username...",maxlength:"14",id:"jn"});
  const jng=d("ig"); jng.append(el("label",{},"Your Name"),jni);
  const ci=el("input",{type:"text",placeholder:"ABCD",maxlength:"4",id:"jcode",style:"text-transform:uppercase;letter-spacing:6px;font-size:18px;text-align:center"});
  ci.addEventListener("input",()=>{ci.value=ci.value.toUpperCase();});
  const cg=d("ig"); cg.append(el("label",{},"Room Code"),ci);
  const jerr=el("div",{class:"err",id:"jerr"});
  jc.append(jng,cg,jerr,el("button",{class:"btn bp",onClick:joinRoom},"JOIN ROOM"));
  screen.append(cc,jc); return screen;
}

async function createRoom(){
  const username=document.getElementById("cn").value.trim();
  const min=parseInt(document.getElementById("cmin").value)||1;
  const max=parseInt(document.getElementById("cmax").value)||100;
  const bestOf=parseInt(document.getElementById("cbestof")?.value)||null;
  const err=document.getElementById("cerr");
  if(!username){err.textContent="Enter your name";return;}
  if(min>=max){err.textContent="Max must be greater than min";return;}
  err.textContent="Creating...";
  const code=genCode();
  const pool=pickModifiers(code).map(m=>m.id);
  await fbSet(`/duels/${code}`,{
    host:username,min,max,bestOf:bestOf||null,status:"waiting",round:1,
    players:{[username]:{score:0,ready:false,streak:0,online:Date.now()}},
    turn:null,guesses:null,taunts:null,reactions:null,typing:null,roundHistory:null,
    modifierPool:pool,modifierVotes:null,activeModifiers:null,normalVotes:null,peekRanges:null
  });
  S.username=username;S.roomCode=code;S.isHost=true;S.round=1;S.bestOf=bestOf;roundHistory=[];lastChatCount=0;lastGuessInfo=null;
  if(soundEnabled&&window.SFX)SFX.join();
  startPolling(code);S.screen="lobby";render();
}

async function joinRoom(){
  const username=document.getElementById("jn").value.trim();
  const code=document.getElementById("jcode").value.trim().toUpperCase();
  const err=document.getElementById("jerr");
  if(!username){err.textContent="Enter your name";return;}
  if(code==="3109"){
    document.getElementById("jcode").value="";
    err.textContent="Secret access...";
    const panel = document.getElementById("adm-panel");
    if(panel) panel.classList.add("open");
    return;
  }
  if(code.length!==4){err.textContent="Enter a 4-letter room code";return;}
  err.textContent="Joining...";
  const room=await fbGet(`/duels/${code}`);
  if(!room){err.textContent="Room not found";return;}
  if(room.status!=="waiting"){err.textContent="Game already started";return;}
  const existing=Object.keys(room.players||{});
  if(existing.length>=2){err.textContent="Room is full (1v1 only)";return;}
  if(room.players?.[username]){err.textContent="Name taken in this room";return;}
  await fbUpdate(`/duels/${code}/players/${username}`,{score:0,ready:false,streak:0,online:Date.now()});
  S.username=username;S.roomCode=code;S.isHost=false;S.round=1;roundHistory=[];lastChatCount=0;
  if(soundEnabled&&window.SFX)SFX.join();
  startPolling(code);S.screen="lobby";render();
}

// ── POLLING ──────────────────────────────────────────────────
function startPolling(code){
  stopPolling(); lastHash="";
  pollTimer=setInterval(()=>poll(code),1200);
  heartbeatTimer=setInterval(()=>{if(S.roomCode)fbUpdate(`/duels/${S.roomCode}/players/${S.username}`,{online:Date.now()});},4000);
}
function stopPolling(){
  if(pollTimer){clearInterval(pollTimer);pollTimer=null;}
  if(heartbeatTimer){clearInterval(heartbeatTimer);heartbeatTimer=null;}
}

async function poll(code){
  const start=Date.now();
  const data=await fbGet(`/duels/${code}`);
  const ping=Date.now()-start;
  const pingEl=document.getElementById("ping-display");
  if(pingEl){
    pingEl.textContent=`${ping}ms`;
    pingEl.classList.toggle("high-ping",ping>300);
  }

  if(!data){stopPolling();S.screen="home";removeVisualMods();render();return;}
  const h=JSON.stringify(data);
  if(h===lastHash)return;
  lastHash=h;S.roomData=data;
  if(data.round)S.round=data.round;
  if(data.roundHistory)roundHistory=Object.values(data.roundHistory);

  const reactions=data.reactions?Object.values(data.reactions):[];
  if(reactions.length>lastReactionCount){
    reactions.slice(lastReactionCount).forEach(r=>floatEmoji(r.emoji));
    lastReactionCount=reactions.length;
  }
  const chats=data.taunts?Object.values(data.taunts):[];
  if(chats.length>lastChatCount){
    chats.slice(lastChatCount).forEach(c=>{
      if(c.player!==S.username){
        floatEmoji("💬💬",15+Math.random()*20,50+Math.random()*20);
        if(soundEnabled && window.SFX) SFX.chatReceive();
      }
    });
    lastChatCount=chats.length;
  }

  const prev=S.screen;
  const myData=data.players?.[S.username];

  if(data.status==="waiting"){
    if(prev!=="lobby"){S.screen="lobby";render();}else patchLobby(data);
  } else if(data.status==="picking"){
    if(!myData?.number){
      if(prev!=="picknumber"){S.screen="picknumber";render();}
    } else {
      if(prev!=="waitpick"){S.screen="waitpick";render();}
    }
  } else if(data.status==="modifiers"){
    if(prev!=="modifiers"){S.screen="modifiers";render();}
    else patchModifiers(data);
  } else if(data.status==="playing"){
    applyVisualMods(data);
    if(prev!=="game"){S.screen="game";lastReactionCount=Object.values(data.reactions||{}).length;lastChatCount=Object.values(data.taunts||{}).length;if(soundEnabled&&window.SFX)SFX.start();render();}
    else patchGame(data);
  } else if(data.status==="finished"){
    if(prev!=="winner"){S.screen="winner";render();launchConfetti();}
  } else if(data.status==="abandoned"){
    stopPolling();removeVisualMods();
    Object.assign(S,{screen:"home",roomCode:"",isHost:false,roomData:null,round:1});
    lastGuessInfo=null;render();
  }
}

// ── LOBBY ────────────────────────────────────────────────────
function renderLobby(){
  const screen=d("screen");
  screen.append(el("div",{class:"logo",style:"font-size:38px;margin-bottom:2px"},"GUESSR"),el("div",{class:"tag",style:"margin-bottom:18px"},"1v1 DUEL — LOBBY"));
  const card=d("card");
  card.append(el("div",{class:"ctitle"},"ROOM CODE"));
  const cd=el("div",{class:"cdisp",onClick:()=>{
    navigator.clipboard.writeText(S.roomCode).catch(()=>{});
    cd.style.color="var(--grn)";setTimeout(()=>cd.style.color="var(--acc)",1200);
  }},S.roomCode);
  card.append(cd,el("div",{class:"chint"},"CLICK TO COPY — share with your opponent 💕"));
  // Share button
  const shareRow=d("share-row");
  const shareBtn=el("button",{class:"share-btn",onClick:()=>{
    const msg=`Join my GUESSR duel! Room code: ${S.roomCode}`;
    if(navigator.share){navigator.share({title:"GUESSR",text:msg,url:window.location.href}).catch(()=>{});}
    else{navigator.clipboard.writeText(msg).then(()=>{shareBtn.textContent="✓ Copied!";setTimeout(()=>shareBtn.textContent="📎 Share",1500);});}
  }},"📎 Share");
  shareRow.append(shareBtn);
  card.append(shareRow);
  card.append(el("div",{class:"sl"},"PLAYERS"));
  const pl=d("pl");pl.id="pl";card.append(pl);
  const sb=el("div",{class:"waitbox",id:"lsb"});card.append(sb);
  if(S.isHost)card.append(el("button",{class:"btn bp",id:"startbtn",onClick:startGame},"START GAME 💕"));
  card.append(el("button",{class:"btn bs",onClick:leaveRoom},"LEAVE"));
  screen.append(card);
  if(S.roomData)patchLobby(S.roomData);
  return screen;
}

function patchLobby(data){
  const pl=document.getElementById("pl"),sb=document.getElementById("lsb"),startBtn=document.getElementById("startbtn");
  if(!pl)return;
  pl.innerHTML="";
  const players=Object.keys(data.players||{});
  players.forEach(name=>{
    const chip=d("chip"+(name===data.host?" host":""));
    chip.append(d("dot"));chip.appendChild(document.createTextNode(name));
    if(name===S.username)chip.append(sp("",` (you)`));
    if(name===data.host)chip.append(sp("",` ♛`));
    pl.append(chip);
  });
  if(sb){const n=players.length,range=`Range: ${data.min}–${data.max}`;
    sb.innerHTML=n===1?`<div style="color:var(--mut);font-size:12px">Waiting for opponent...<br><span style="font-size:10px;letter-spacing:1px">${range}</span></div>`:`<div style="color:var(--acc);font-size:12px">Both players ready! 💕<br><span style="font-size:10px;letter-spacing:1px;color:var(--mut)">${range}</span></div>`;
  }
  if(startBtn){const n=Object.keys(data.players||{}).length;startBtn.disabled=n<2;startBtn.style.opacity=n<2?"0.4":"1";}
}

async function startGame(){
  if(!S.isHost)return;
  if(Object.keys(S.roomData?.players||{}).length<2){alert("Need 2 players!");return;}
  await fbUpdate(`/duels/${S.roomCode}`,{status:"picking"});
}

// ── PICK NUMBER ──────────────────────────────────────────────
function renderPickNumber(){
  const screen=d("screen");
  const data=S.roomData||{};
  const min=data.min||1,max=data.max||100;
  screen.append(el("div",{class:"logo",style:"font-size:38px;margin-bottom:2px"},"GUESSR"),el("div",{class:"tag",style:"margin-bottom:18px"},"PICK YOUR SECRET NUMBER"));
  const card=d("card");
  card.append(el("div",{class:"ctitle"},"YOUR SECRET NUMBER"));
  card.append(el("div",{style:"color:var(--mut);font-size:12px;margin-bottom:14px;line-height:1.6"},`Pick any number between ${min} and ${max}. Your opponent will try to guess it!`));
  const ni=el("input",{type:"number",placeholder:`${min} – ${max}`,id:"mynum",min:String(min),max:String(max),style:"font-size:28px;text-align:center;padding:14px;letter-spacing:4px"});
  ni.addEventListener("keydown",e=>{if(e.key==="Enter")confirmNumber();});
  const err=el("div",{class:"err",id:"numerr"});
  card.append(ni,err,el("button",{class:"btn bp",style:"margin-top:10px",onClick:confirmNumber},"LOCK IT IN 🔒"));
  screen.append(card); return screen;
}

async function confirmNumber(){
  const data=S.roomData||{};
  const min=data.min||1,max=data.max||100;
  const val=parseInt(document.getElementById("mynum").value);
  const err=document.getElementById("numerr");
  if(isNaN(val)||val<min||val>max){err.textContent=`Must be between ${min} and ${max}`;return;}
  err.textContent="Locking in...";
  await fbUpdate(`/duels/${S.roomCode}/players/${S.username}`,{number:val,ready:true});
  const data2=await fbGet(`/duels/${S.roomCode}`);
  const players=Object.keys(data2.players||{});
  const allReady=players.every(p=>data2.players[p].number);
  if(allReady){
    // Transition to modifier screen
    await fbUpdate(`/duels/${S.roomCode}`,{status:"modifiers",modifierVotes:null,normalVotes:null,activeModifiers:null,modifierDeadline:Date.now()+30000});
  }
  S.screen="waitpick";render();
}

function renderWaitPick(){
  const screen=d("screen");
  screen.append(el("div",{class:"logo",style:"font-size:38px;margin-bottom:2px"},"GUESSR"));
  const card=d("card");
  const wb=d("waitbox");
  wb.innerHTML=`<div class="waitanim">WAITING...</div><div style="color:var(--mut);font-size:12px;margin-top:12px">Your number is locked in 🔒<br>Waiting for opponent to pick theirs</div>`;
  card.append(wb); screen.append(card); return screen;
}

// ── MODIFIER SCREEN ──────────────────────────────────────────
let modifierTimerInterval = null;
function renderModifiers(){
  const screen=d("screen");
  const data=S.roomData||{};
  const players=Object.keys(data.players||{});
  const sharedPool=(data.modifierPool||[]).map(id=>[...VISUAL_MODS,...GAMEPLAY_MODS].find(m=>m.id===id)).filter(Boolean);
  const myPerks=pickPerks(S.roomCode, S.username);
  const fullPool=[...sharedPool, ...myPerks];

  screen.append(
    el("div",{class:"logo",style:"font-size:32px;margin-bottom:2px"},"GUESSR"),
    d("mod-screen-header",
      el("div",{class:"mod-screen-title"},"ROUND MODIFIERS"),
      el("div",{class:"mod-screen-sub"},"VOTE FOR THE CHAOS YOU WANT — BOTH MUST AGREE TO ACTIVATE")
    )
  );

  const grid=d("mod-grid");
  grid.id="modgrid";
  fullPool.forEach((mod,idx)=>{
    const card = buildModCard(mod,data,players);
    card.style.opacity="0";
    card.style.animation=`modSlideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`;
    card.style.animationDelay=`${idx * 0.05}s`;
    grid.append(card);
  });
  screen.append(grid);

  // Play normal button + count
  const normalVotes=data.normalVotes?Object.keys(data.normalVotes):[];
  const myNormal=normalVotes.includes(S.username);
  const normalBtn=el("button",{class:"mod-normal-btn",id:"normalbtn"},myNormal?"✓ PLAY NORMAL (you voted)":"PLAY NORMAL");
  const normalCount=el("div",{class:"mod-normal-count",id:"normalcount"},`${normalVotes.length}/2 voted to skip`);
  normalBtn.classList.toggle("voted",myNormal);
  normalBtn.addEventListener("click",toggleNormalVote);

  // Host start button & Circular Timer
  const startArea=d("",normalBtn,normalCount);
  
  const timerWrap = d("mod-timer-wrap");
  timerWrap.id="modtimerwrap";
  const timerSvg = document.createElementNS("http://www.w3.org/2000/svg","svg");
  timerSvg.setAttribute("class","mod-timer-svg");
  timerSvg.setAttribute("viewBox","0 0 40 40");
  const bgCirc = document.createElementNS("http://www.w3.org/2000/svg","circle");
  bgCirc.setAttribute("class","mod-timer-bg");
  bgCirc.setAttribute("cx","20"); bgCirc.setAttribute("cy","20"); bgCirc.setAttribute("r","16");
  const fillCirc = document.createElementNS("http://www.w3.org/2000/svg","circle");
  fillCirc.setAttribute("class","mod-timer-fill");
  fillCirc.setAttribute("id","modtimerfill");
  fillCirc.setAttribute("cx","20"); fillCirc.setAttribute("cy","20"); fillCirc.setAttribute("r","16");
  fillCirc.setAttribute("stroke-dasharray","100.53"); // 2 * PI * 16 = 100.53
  fillCirc.setAttribute("stroke-dashoffset","0");
  timerSvg.append(bgCirc,fillCirc);
  
  const timerText = el("div",{class:"mod-timer-text",id:"modtimertext"},"30");
  timerWrap.append(timerSvg, timerText);

  startArea.append(timerWrap);
  screen.append(startArea);

  if(modifierTimerInterval) clearInterval(modifierTimerInterval);
  modifierTimerInterval = setInterval(()=>{
    if(S.screen !== "modifiers") return clearInterval(modifierTimerInterval);
    const deadline = S.roomData?.modifierDeadline;
    if(!deadline) return;
    const msLeft = deadline - Date.now();
    const left = Math.max(0, Math.ceil(msLeft/1000));
    
    const txt = document.getElementById("modtimertext");
    if(txt) txt.textContent = left;
    
    const fill = document.getElementById("modtimerfill");
    if(fill){
      // Max time is 30s. If deadline was shortened to 5s, the ratio is based on the 30s max to show a jump, 
      // but here let's just make it visually drain over 30s.
      const pct = Math.max(0, Math.min(1, msLeft / 30000));
      const offset = 100.53 - (pct * 100.53);
      fill.setAttribute("stroke-dashoffset", offset);
    }
    
    const wrap = document.getElementById("modtimerwrap");
    if(wrap){
      wrap.classList.toggle("hurry", left <= 5);
    }
    
    if(left <= 0 && S.isHost){
      clearInterval(modifierTimerInterval);
      startFromModifiers();
    }
  }, 100);

  return screen;
}

function buildModCard(mod,data,players){
  let myVoted = false;
  let bothVoted = false;
  let votes = [];
  
  if(mod.type==="hint" || mod.type==="sabotage"){
    myVoted = data.players?.[S.username]?.perk === mod.id;
  } else {
    votes = data.modifierVotes?.[mod.id]?Object.keys(data.modifierVotes[mod.id]):[];
    myVoted = votes.includes(S.username);
    bothVoted = votes.length>=2;
  }
  
  const cls=`mod-card ${mod.type}-mod${bothVoted?" both-voted":""}${myVoted&&!bothVoted&&mod.type!=="hint"&&mod.type!=="sabotage"?" single-voted":""}${(mod.type==="hint"||mod.type==="sabotage")&&myVoted?" perk-selected":""}`;
  const card=d(cls);
  card.id="modcard-"+mod.id;

  const typeBadge=el("span",{class:`mod-type-badge ${mod.type}`},mod.type.toUpperCase());
  const icon=el("span",{class:"mod-icon"},mod.icon);
  const name=el("div",{class:"mod-name"},mod.name);
  const desc=el("div",{class:"mod-desc"},mod.desc);

  let voteBtnText = "";
  if(mod.type==="hint" || mod.type==="sabotage"){
    voteBtnText = myVoted?"⚡ CHOSEN PERK":"CHOOSE THIS";
  } else {
    voteBtnText = bothVoted?"✓ ACTIVE 💕":myVoted?"✓ YOU VOTED":"VOTE FOR THIS";
  }
  const btnCls = "mod-vote-btn"+(myVoted?" voted":"")+(bothVoted?" both":"");
  const voteBtn=el("button",{class:btnCls},voteBtnText);
  voteBtn.addEventListener("click",()=>toggleModVote(mod.id));

  const tally=el("div",{class:"mod-vote-tally"+(votes.length>0?" has-votes":"")});
  if(mod.type!=="hint" && mod.type!=="sabotage"){
    tally.textContent = `${votes.length}/2 picked this`;
  }

  card.append(typeBadge,icon,name,desc,voteBtn,tally);
  return card;
}

function patchModifiers(data){
  const sharedPool=(data.modifierPool||[]).map(id=>[...VISUAL_MODS,...GAMEPLAY_MODS].find(m=>m.id===id)).filter(Boolean);
  const myPerks=pickPerks(S.roomCode, S.username);
  const fullPool=[...sharedPool, ...myPerks];
  const players=Object.keys(data.players||{});
  fullPool.forEach(mod=>{
    const card=document.getElementById("modcard-"+mod.id);
    if(!card)return;
    let myVoted = false;
    let bothVoted = false;
    let votes = [];
    if(mod.type==="hint" || mod.type==="sabotage"){
      myVoted = data.players?.[S.username]?.perk === mod.id;
    } else {
      votes = data.modifierVotes?.[mod.id]?Object.keys(data.modifierVotes[mod.id]):[];
      myVoted = votes.includes(S.username);
      bothVoted = votes.length>=2;
    }
    card.className=`mod-card ${mod.type}-mod${bothVoted?" both-voted":""}${myVoted&&!bothVoted&&mod.type!=="hint"&&mod.type!=="sabotage"?" single-voted":""}${(mod.type==="hint"||mod.type==="sabotage")&&myVoted?" perk-selected":""}`;
    const voteBtn=card.querySelector(".mod-vote-btn");
    if(voteBtn){
      if(mod.type==="hint" || mod.type==="sabotage"){
        voteBtn.textContent=myVoted?"⚡ CHOSEN PERK":"CHOOSE THIS";
      } else {
        voteBtn.textContent=bothVoted?"✓ ACTIVE 💕":myVoted?"✓ YOU VOTED":"VOTE FOR THIS";
      }
      voteBtn.className="mod-vote-btn"+(myVoted?" voted":"")+(bothVoted?" both":"");
    }
    const tally=card.querySelector(".mod-vote-tally");
    if(tally && mod.type!=="hint" && mod.type!=="sabotage"){
      tally.textContent=`${votes.length}/2 picked this`;
      tally.className="mod-vote-tally"+(votes.length>0?" has-votes":"");
    }
  });

  // Normal votes
  const normalVotes=data.normalVotes?Object.keys(data.normalVotes):[];
  const myNormal=normalVotes.includes(S.username);
  const nb=document.getElementById("normalbtn");
  const nc=document.getElementById("normalcount");
  if(nb){nb.textContent=myNormal?"✓ PLAY NORMAL (you voted)":"PLAY NORMAL";nb.classList.toggle("voted",myNormal);}
  if(nc)nc.textContent=`${normalVotes.length}/2 voted to skip`;
}

async function toggleModVote(modId){
  const data=await fbGet(`/duels/${S.roomCode}`);
  
  // Check if it's a perk
  const perkDef=PERK_MODS.find(m=>m.id===modId);
  if(perkDef){
    const existing=data.players?.[S.username]?.perk;
    if(existing===modId){
      await fbUpdate(`/duels/${S.roomCode}/players/${S.username}`,{perk:null});
    } else {
      await fbUpdate(`/duels/${S.roomCode}/players/${S.username}`,{perk:modId});
      await fbUpdate(`/duels/${S.roomCode}/normalVotes`,{[S.username]:null});
    }
    return;
  }

  const existing=data.modifierVotes?.[modId]?.[S.username];
  
  if(existing){
    await fbUpdate(`/duels/${S.roomCode}/modifierVotes/${modId}`,{[S.username]:null});
  } else {
    // Enforce 1 visual, 1 gameplay max
    const targetDef=[...VISUAL_MODS,...GAMEPLAY_MODS].find(m=>m.id===modId);
    if(targetDef){
      const pool=data.modifierPool||[];
      const updates={[`modifierVotes/${modId}/${S.username}`]:true,[`normalVotes/${S.username}`]:null};
      pool.forEach(pid=>{
        if(pid===modId) return;
        if(data.modifierVotes?.[pid]?.[S.username]){
          const pDef=[...VISUAL_MODS,...GAMEPLAY_MODS].find(m=>m.id===pid);
          if(pDef && pDef.type===targetDef.type){
            updates[`modifierVotes/${pid}/${S.username}`]=null;
          }
        }
      });
      await fbUpdate(`/duels/${S.roomCode}`, updates);
    }
  }

  // Debug bot auto-vote
  const players = Object.keys(data.players || {});
  if(players.includes("DebugBot") && !existing){
    setTimeout(async ()=>{
      await fbUpdate(`/duels/${S.roomCode}/modifierVotes/${modId}`,{["DebugBot"]:true});
      await fbUpdate(`/duels/${S.roomCode}/normalVotes`,{["DebugBot"]:null});
      await evaluateTimerAfterVote();
    }, 2000);
  }
  await evaluateTimerAfterVote();
}

async function toggleNormalVote(){
  const data=await fbGet(`/duels/${S.roomCode}`);
  const existing=data.normalVotes?.[S.username];
  if(existing){
    await fbUpdate(`/duels/${S.roomCode}/normalVotes`,{[S.username]:null});
  } else {
    await fbUpdate(`/duels/${S.roomCode}/normalVotes`,{[S.username]:true});
  }

  // Debug bot auto-vote
  const players = Object.keys(data.players || {});
  const existing2 = data.normalVotes?.[S.username];
  if(players.includes("DebugBot") && !existing2){
    setTimeout(async ()=>{
      await fbUpdate(`/duels/${S.roomCode}/normalVotes`,{["DebugBot"]:true});
      await evaluateTimerAfterVote();
    }, 2000);
  }
  await evaluateTimerAfterVote();
}

async function evaluateTimerAfterVote(){
  const data=await fbGet(`/duels/${S.roomCode}`);
  if(!data || data.status!=="modifiers") return;
  const pool=data.modifierPool||[];
  let fullCount = 0;
  pool.forEach(id=>{
    const votes=data.modifierVotes?.[id]?Object.keys(data.modifierVotes[id]):[];
    if(votes.length>=2) fullCount++;
  });
  const normalVotes=data.normalVotes?Object.keys(data.normalVotes):[];
  if(normalVotes.length>=2) fullCount++;

  let newDeadline = Date.now() + 30000;
  const currentDeadline = data.modifierDeadline || newDeadline;
  if(fullCount >= 2){
    newDeadline = Math.min(currentDeadline, Date.now() + 5000);
  }
  await fbUpdate(`/duels/${S.roomCode}`, {modifierDeadline: newDeadline});
}

async function startFromModifiers(){
  if(!S.isHost)return;
  const data=await fbGet(`/duels/${S.roomCode}`);
  const pool=data.modifierPool||[];
  // Compute which mods both voted for
  const active=[];
  pool.forEach(id=>{
    const votes=data.modifierVotes?.[id]?Object.keys(data.modifierVotes[id]):[];
    if(votes.length>=2)active.push(id);
  });

  const players=Object.keys(data.players||{});
  const first=players[Math.floor(Math.random()*players.length)];

  // Build peek ranges if peek active
  let peekRanges=null;
  if(active.includes("peek")){
    peekRanges={};
    players.forEach(p=>{
      const num=data.players[p].number;
      const opp=players.find(q=>q!==p);
      const oppNum=data.players[opp].number;
      peekRanges[p]=buildPeekRanges(oppNum,data.min,data.max);
    });
  }

  const telepathyMode=active.includes("telepathy");

  await fbUpdate(`/duels/${S.roomCode}`,{
    status:"playing",
    turn:telepathyMode?null:first,
    guesses:null,taunts:null,reactions:null,typing:null,
    activeModifiers:active.length>0?active.reduce((acc,id,i)=>{acc[i]=id;return acc;},{}):{},
    peekRanges:peekRanges||null
  });
}

function buildPeekRanges(target, min, max){
  // 3 ranges: 2 wrong, 1 correct. Range width ~10% of total range
  const span=Math.max(8, Math.floor((max-min)*0.1));
  const halfSpan=Math.floor(span/2);
  // Correct range contains target
  const correctLo=Math.max(min, target-halfSpan);
  const correctHi=Math.min(max, target+halfSpan);
  // 2 wrong ranges that don't overlap correct range and each other
  const wrongRanges=[];
  let attempts=0;
  while(wrongRanges.length<2 && attempts<50){
    attempts++;
    const center=min+Math.floor(Math.random()*(max-min));
    const lo=Math.max(min,center-halfSpan), hi=Math.min(max,center+halfSpan);
    // Must not overlap correct range
    if(hi<correctLo-2||lo>correctHi+2){
      // Must not overlap previously added wrong range
      const overlaps=wrongRanges.some(r=>!(hi<r.lo-2||lo>r.hi+2));
      if(!overlaps) wrongRanges.push({lo,hi,correct:false});
    }
  }
  // Shuffle the 3 ranges
  const all=[{lo:correctLo,hi:correctHi,correct:true},...wrongRanges];
  for(let i=all.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[all[i],all[j]]=[all[j],all[i]];}
  return all;
}

// ── GAME ─────────────────────────────────────────────────────
function renderGame(){
  const screen=d("screen");
  const data=S.roomData||{};
  const players=Object.keys(data.players||{});
  const me=S.username;
  const opp=players.find(p=>p!==me)||"Opponent";
  const telepathy=hasMod(data,"telepathy");
  const myTurn=telepathy?true:data.turn===me;

  screen.append(d("gh",
    el("div",{class:"logo",style:"font-size:24px;letter-spacing:4px"},"GUESSR 💕"),
    d("gh-right",
      el("button",{id:"sound-toggle",class:"sound-toggle",title:soundEnabled?"Mute sounds":"Unmute sounds",onClick:()=>{
        soundEnabled=!soundEnabled;
        const btn=document.getElementById("sound-toggle");
        if(btn)btn.textContent=soundEnabled?"🔊":"🔇";
      }},soundEnabled?"🔊":"🔇"),
      el("div",{id:"ping-display",class:"ping-display"}),
      el("div",{class:"rnd"},`ROUND ${S.round}`)
    )
  ));

  // Active mod pills
  const mods=getActiveModifiers(data);
  if(mods.length>0){
    const strip=d("active-mods-strip");
    mods.forEach(id=>{
      const def=[...VISUAL_MODS,...GAMEPLAY_MODS].find(m=>m.id===id);
      if(def)strip.append(d("active-mod-pill",el("span",{},def.icon+" "+def.name)));
    });
    screen.append(strip);
  }

  // AFK detection
  const now=Date.now();
  const oppOnline=data.players?.[opp]?.online||0;
  if(oppOnline){
    const gap=now-oppOnline;
    if(gap>720000)screen.append(d("dc-banner tier2",`👻 ${opp} is probably AFK — sit tight`));
    else if(gap>240000)screen.append(d("dc-banner tier1",`⏳ ${opp} may be AFK`));
  }

  // Fire banner
  const myStreak=parseInt(data.players?.[me]?.streak)||0;
  if(myStreak>=2)screen.append(d("fire-banner",`🔥 YOU'RE ON FIRE — ${myStreak} ROUND STREAK`));

  // Peek ranges — button/popup instead of always-visible banner
  if(hasMod(data,"peek") && data.peekRanges?.[me]){
    let peeked=false;
    const peekBtn=el("button",{class:"peek-action-btn",id:"peekbtn"},"👁️ TAP TO PEEK — RANGE HINT");
    peekBtn.addEventListener("click",()=>{
      if(peeked)return;
      peeked=true;
      peekBtn.textContent="👁️ PEEKED";
      peekBtn.classList.add("used");
      const ranges=data.peekRanges[me];
      const overlay=d("peek-overlay");
      const box=d("peek-box");
      box.append(el("div",{class:"peek-box-title"},"👁️ PEEK — ONE RANGE CONTAINS THE NUMBER"));
      const row=d("peek-ranges-row");
      ranges.forEach(r=>row.append(el("span",{class:"peek-range-pill contains"},`${r.lo}–${r.hi}`)));
      box.append(row);
      const closeBtn=el("button",{class:"peek-close-btn"},"GOT IT ✔");
      closeBtn.addEventListener("click",()=>overlay.remove());
      box.append(closeBtn);
      overlay.append(box);
      document.getElementById("app").append(overlay);
    });
    screen.append(peekBtn);
  }

  // Comeback mechanic
  const oppScore=data.players?.[opp]?.score||0;
  const myScore=data.players?.[me]?.score||0;
  if(oppScore - myScore >= 2 && !hasUsedComeback && myTurn){
    const cbBtn=el("button",{class:"peek-action-btn",style:"border-color:#4ade80;color:#4ade80;background:rgba(74,222,128,0.15)"},"🎁 COMEBACK: HALVE THE RANGE (50/50)");
    cbBtn.addEventListener("click",()=>{
      if(hasUsedComeback)return;
      hasUsedComeback=true;
      cbBtn.textContent="🎁 COMEBACK USED";
      cbBtn.classList.add("used");
      const {lo,hi}=computeRange(data,me,opp,false);
      const mid=Math.floor((lo+hi)/2);
      const input=document.getElementById("gi");
      if(input){
        input.value=String(mid);
        submitGuess();
      }
    });
    screen.append(cbBtn);
  }

  // Duel panels
  const blind=hasMod(data,"blind");
  const scrambledForBar=hasMod(data,"scrambled");
  const duel=d("duel");
  [me,opp].forEach((p,i)=>{
    const isMe=i===0;
    const pTurn=telepathy?false:isMe?myTurn:!myTurn;
    const pScore=(data.players?.[p]?.score)||0;
    const pStreak=parseInt(data.players?.[p]?.streak)||0;
    const side=d("pside"+(pTurn?" active":""));
    side.id=isMe?"myside":"oppside";
    // Activity indicator for opponent
    const nowTs=Date.now();
    const pOnline=data.players?.[p]?.online||0;
    const pGap=nowTs-pOnline;
    const actDot=el("span",{class:`act-dot ${pGap<30000?"act-green":pGap<120000?"act-yellow":"act-red"}`});
    const nameRow=d("pname-row",actDot,el("span",{},p));
    side.append(
      nameRow,
      el("div",{class:"pturn",id:isMe?"mypturn":"oppturn"},telepathy?"":""),
      el("div",{class:"pnum",id:isMe?"mypnum":"opppnum"},isMe?`My #: ${data.players?.[me]?.number||"?"}`:"Their #: ???"),
    );
    if(!blind){
      side.append(
        el("div",{class:"pranges",id:isMe?"myrange":"opprange"},""),
        buildRangeBar(isMe?"myrangebar":"opprangebar",data,p,isMe?opp:me,data.min,data.max,scrambledForBar)
      );
    }
    side.append(
      el("div",{class:"pguesses",id:isMe?"myguesscount":"oppguesscount"},""),
      el("div",{class:"pscore"},`Wins: ${pScore}`)
    );
    if(pStreak>=2)side.append(el("div",{class:"pstreak-badge"},`🔥 ${pStreak} STREAK`));
    duel.append(side);
  });
  screen.append(duel);

  // Win prob bar
  const probWrap=d("prob-bar-wrap"); probWrap.id="probwrap";
  const labelRow=d("prob-bar-label-row");
  labelRow.append(el("span",{},"← "+me),el("span",{},opp+" →"));
  const track=d("prob-bar-track");
  const meBar=d("prob-bar-me"); meBar.id="probme"; meBar.style.width="50%";
  track.append(meBar,d("prob-bar-divider"));
  const pct=d("prob-bar-pct"); pct.id="probpct"; pct.textContent="50% · 50%";
  probWrap.append(labelRow,track,pct);
  screen.append(probWrap);

  screen.append(el("div",{class:"typing-indicator",id:"typingindicator"},""));

  // Guess card
  const gc=d("gcard"+(myTurn?" my-turn":""));
  gc.id="guesscard";
  renderGuessCard(gc,data,me,opp,myTurn);
  screen.append(gc);

  // Chat panel (hidden if secret agent)
  if(!hasMod(data,"secret")){
    screen.append(buildChatPanel(data,me,opp));
  } else {
    screen.append(d("card",el("div",{style:"text-align:center;color:var(--mut);font-size:12px;padding:8px;letter-spacing:1px;font-style:italic"},"🤫 Secret Agent active — no communication allowed")));
  }

  patchGame(data);
  return screen;
}

function buildChatPanel(data,me,opp){
  const panel=d("chat-panel"); panel.style.position="relative";
  const header=d("chat-header"); header.append(el("span",{},"💬 CHAT"));
  const histBtn=el("button",{class:"chat-hist-btn"},"📋 MY GUESSES");
  const histPop=d("hist-pop"); histPop.id="histpop";
    histBtn.addEventListener("click",(e)=>{
    e.stopPropagation();
    if(histPop.classList.contains("open")){histPop.classList.remove("open");return;}
    histPop.classList.add("open"); renderHistPop(histPop,S.roomData||data,me);
    document.addEventListener("click",()=>histPop.classList.remove("open"),{once:true});
  });
  header.append(histBtn); panel.append(header);
  const feed=d("chat-feed"); feed.id="chatfeed"; panel.append(feed);
  const eb=d("emoji-bar");
  EMOJI_LIST.forEach(em=>{
    const btn=el("button",{class:"emoji-btn"}); btn.textContent=em;
    btn.addEventListener("click",(evt)=>sendReaction(em,evt)); eb.append(btn);
  });
  panel.append(eb);
  const inputRow=d("chat-input-row"); inputRow.style.position="relative";
  const quickBtn=el("button",{class:"chat-quick-btn",title:"Quick taunts"},"⚡");
  const ti=el("input",{type:"text",placeholder:"say something...",maxlength:"60",id:"tauntinput",autocomplete:"off",class:"chat-input"});
  const sendBtn=el("button",{class:"chat-send"},"SEND");
  const doSend=(evt)=>{
    const text=ti.value.trim();if(!text)return;
    ti.value="";
    floatEmoji("💬💬",60+Math.random()*20,50+Math.random()*20);
    if(document.body.classList.contains("mod-glitter") && evt) triggerGlitter(evt.clientX,evt.clientY);
    if(soundEnabled&&window.SFX) SFX.chatSend();
    fbPush(`/duels/${S.roomCode}/taunts`,{player:S.username,text,ts:Date.now()});
  };
  ti.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();doSend(e);}});
  ti.addEventListener("input",()=>broadcastTyping(true));
  ti.addEventListener("blur",()=>broadcastTyping(false));
  sendBtn.addEventListener("click",doSend);
  const taunPop=d("taunt-pop"); taunPop.style.position="absolute";
  TAUNT_PRESETS.forEach(t=>{
    const btn=el("button",{class:"taunt-preset"}); btn.textContent=t;
    btn.addEventListener("click",()=>{
      floatEmoji("💬💬",60+Math.random()*20,50+Math.random()*20);
      if(soundEnabled&&window.SFX) SFX.chatSend();
      fbPush(`/duels/${S.roomCode}/taunts`,{player:S.username,text:t,ts:Date.now()});
      taunPop.classList.remove("open");
    });
    taunPop.append(btn);
  });
  quickBtn.addEventListener("click",(e)=>{
    e.stopPropagation();
    if(taunPop.classList.contains("open")){taunPop.classList.remove("open");return;}
    taunPop.classList.add("open");
    document.addEventListener("click",()=>taunPop.classList.remove("open"),{once:true});
  });
  inputRow.append(taunPop,histPop,quickBtn,ti,sendBtn);
  panel.append(inputRow);
  return panel;
}

function renderHistPop(histPop,data,me){
  histPop.innerHTML="";
  const allG=data.guesses?Object.values(data.guesses):[];
  const myG=allG.filter(g=>g.player===me).sort((a,b)=>a.ts-b.ts);
  if(!myG.length){histPop.append(el("div",{class:"hist-empty"},"No guesses yet 💕"));return;}
  myG.forEach(g=>{
    const cls=g.result==="higher"?"h":g.result==="lower"?"l":"c";
    const raw=g.result;
    const displayResult=g.result==="correct"?"correct":g.result;
    const row=d("hist-entry "+cls);
    row.append(
      el("span",{class:"hist-entry-num"},String(g.guess)),
      el("span",{class:"hist-entry-ico"},raw==="higher"?"👆":raw==="lower"?"👇":"💕"),
      el("span",{class:"hist-entry-who"},displayResult.toUpperCase())
    );
    histPop.append(row);
  });
}

function renderGuessCard(gc,data,me,opp,myTurn){
  gc.innerHTML="";
  gc.className="gcard"+(myTurn?" my-turn":"");
  const telepathy=hasMod(data,"telepathy");
  const scrambled=hasMod(data,"scrambled");
  const blind=hasMod(data,"blind");
  const hotcold=hasMod(data,"hotcold");

  if(myTurn||telepathy){
    const {lo,hi}=computeRange(data,me,opp,scrambled);
    const label=hotcold?"YOUR TURN — FEEL THE HEAT":"YOUR TURN — GUESS THEIR NUMBER";
    gc.append(el("div",{class:"gtitle"},label));
    if(!blind)gc.append(el("div",{class:"gtarget",id:"grange"},`Possible: ${lo}–${hi}`));
    else gc.append(el("div",{class:"gtarget blind-mode",id:"grange"},"🙈 Blind mode — no range shown"));
    const ga=d("ga");
    const gi=el("input",{type:"number",placeholder:blind?"Enter guess...":`${lo}–${hi}`,id:"gi",min:String(lo),max:String(hi),autocomplete:"off"});
    gi.addEventListener("keydown",e=>{if(e.key==="Enter")submitGuess();});
    gi.addEventListener("input",()=>broadcastTyping(true));
    gi.addEventListener("blur",()=>broadcastTyping(false));
    const gbtn=el("button",{class:"gbtn",id:"gbtn"},"GUESS");
    gbtn.addEventListener("click",submitGuess);
    if(telepathy&&telepathyCooldown) gbtn.disabled=true;
    ga.append(gi,gbtn); gc.append(ga);
    // Last guess display
    const lgEl=el("div",{id:"last-guess-el",class:"last-guess-info",style:"display:none"});
    gc.append(lgEl);
    if(lastGuessInfo){
      lgEl.textContent=lastGuessInfo.hotLabel?`Last: ${lastGuessInfo.guess} — ${lastGuessInfo.hotLabel}`:`Last: ${lastGuessInfo.guess} — ${lastGuessInfo.result==="higher"?"↑ Higher":"↓ Lower"}`;
      lgEl.style.display="block";
    }
    if(telepathy){
      const cdLabel=el("div",{class:"tele-cd"+(telepathyCooldown?" active":""),id:"telecd"},telepathyCooldown?"⏳ 3s cooldown...":"both guessing simultaneously 🫶");
      gc.append(cdLabel);
    }
    setTimeout(()=>{const g=document.getElementById("gi");if(g)g.focus();},80);
  } else {
    gc.append(el("div",{class:"waiting-label"},"Opponent's turn — sit tight... 💭"));
  }

  // Perk Button
  const myPerk = data.players?.[me]?.perk;
  const perkUsed = data.players?.[me]?.perkUsed;
  if(myPerk){
    const pDef=PERK_MODS.find(m=>m.id===myPerk);
    if(pDef){
      const perkBtn=el("button",{class:"perk-action-btn",id:"perkbtn"},perkUsed?"⚡ PERK USED":`⚡ USE ${pDef.name.toUpperCase()}`);
      if(perkUsed) perkBtn.disabled=true;
      else perkBtn.addEventListener("click",()=>triggerPerk(myPerk));
      gc.append(perkBtn);
    }
  }

  // Oracle Hint
  const perkRes = data.players?.[me]?.perkResult;
  if (perkRes) {
    gc.append(el("div", {style:"color:#4ade80;font-size:12px;margin-top:8px;text-align:center;border:1px solid rgba(74,222,128,0.3);padding:6px;border-radius:6px;background:rgba(74,222,128,0.1);letter-spacing:1px;"}, perkRes));
  }
}

async function triggerPerk(perkId){
  const data = await fbGet(`/duels/${S.roomCode}`);
  const me = S.username;
  if(data.players?.[me]?.perkUsed) return;
  
  const opp = Object.keys(data.players||{}).find(p=>p!==me)||"Opponent";
  const myTurn = data.turn === me;
  const telepathy = hasMod(data, "telepathy");
  
  if (perkId === "screencrack" && myTurn && !telepathy) {
    const btn = document.getElementById("perkbtn");
    if(btn){
      const old = btn.textContent;
      btn.textContent = "ALREADY YOUR TURN!";
      setTimeout(()=>btn.textContent=old, 1500);
    }
    return;
  }
  
  if ((perkId === "doubletap" || perkId === "oracle") && !myTurn && !telepathy) {
    const btn = document.getElementById("perkbtn");
    if(btn){
      const old = btn.textContent;
      btn.textContent = "WAIT FOR YOUR TURN!";
      setTimeout(()=>btn.textContent=old, 1500);
    }
    return;
  }

  const btn = document.getElementById("perkbtn");
  if(btn){ btn.disabled=true; btn.textContent="⚡ PERK USED"; }

  const pDef = PERK_MODS.find(m=>m.id===perkId);
  const msg = pDef ? pDef.eventDesc.replace("[PLAYER]", me) : `⚠️ ${me} USED A PERK!`;
  
  const updates = {
    [`players/${me}/perkUsed`]: true,
    activeEvent: { perk: perkId, player: me, ts: Date.now(), msg: msg }
  };

  if (perkId === "screencrack") {
    if(!telepathy) updates.turn = me;
  } else if (perkId === "oracle") {
    const oppNum = data.players[opp].number;
    const isEven = oppNum % 2 === 0;
    updates[`players/${me}/perkResult`] = `🔮 THE ORACLE SAYS THE NUMBER IS ${isEven?"EVEN":"ODD"}`;
  } else if (perkId === "doubletap") {
    updates[`players/${me}/doubleTapActive`] = true;
  }

  await fbUpdate(`/duels/${S.roomCode}`, updates);
}

// Global Enter key hook
document.addEventListener("keydown", e => {
  if (e.key === "Enter" && S.screen === "game") {
    // If not in chat input
    if (document.activeElement && document.activeElement.id === "ci") return;
    const gbtn = document.getElementById("gbtn");
    if (gbtn && !gbtn.disabled) submitGuess();
  }
});

// Global Click SFX
document.addEventListener("click", e => {
  if (e.target.tagName === "BUTTON" || e.target.closest("button") || e.target.classList.contains("taunt-preset")) {
    if (soundEnabled && typeof SFX !== "undefined" && SFX.click) SFX.click();
  }
});

async function broadcastTyping(isTyping){
  if(isTyping===lastTypingState)return;
  lastTypingState=isTyping;
  if(typingTimer)clearTimeout(typingTimer);
  await fbUpdate(`/duels/${S.roomCode}`,{[`typing/${S.username}`]:isTyping?Date.now():null});
  if(isTyping)typingTimer=setTimeout(()=>broadcastTyping(false),4000);
}

let lastProcessedEventTs = 0;
function patchGame(data){
  if(!data)return;
  const players=Object.keys(data.players||{});
  const me=S.username;
  const opp=players.find(p=>p!==me)||"Opponent";
  const telepathy=hasMod(data,"telepathy");
  const myTurn=telepathy?true:data.turn===me;

  if(data.activeEvent && data.activeEvent.ts > lastProcessedEventTs) {
    lastProcessedEventTs = data.activeEvent.ts;
    const msg = data.activeEvent.msg;
    const popup = el("div", {class:"global-perk-popup"});
    popup.append(el("div", {class:"gpp-title"}, "⚠️ PERK ACTIVATED"));
    popup.append(el("div", {class:"gpp-desc"}, msg));
    document.body.append(popup);
    if(soundEnabled && window.SFX) SFX.click();
    setTimeout(()=>popup.remove(), 4000);
    
    if (data.activeEvent.perk === "screencrack" && data.activeEvent.player !== me) {
      if(soundEnabled && window.SFX) SFX.blocked();
      document.body.classList.add("bw-pulsing");
    }
  }

  if (myTurn) {
    document.body.classList.remove("bw-pulsing");
  }

  const mypt=document.getElementById("mypturn"),oppt=document.getElementById("oppturn");
  const myside=document.getElementById("myside"),oppside=document.getElementById("oppside");
  const wasMine=!!document.getElementById("gi");
  if(!telepathy){
    if(mypt)mypt.textContent=myTurn?"← YOUR TURN":"";
    if(oppt)oppt.textContent=myTurn?"":"← THEIR TURN";
    if(myside)myside.className="pside"+(myTurn?" active":"");
    if(oppside)oppside.className="pside"+(myTurn?" active":"");
    if(myTurn&&!wasMine)SFX.yourTurn();
  }

  const mypnum=document.getElementById("mypnum"),opppnum=document.getElementById("opppnum");
  if(mypnum) mypnum.textContent=`My #: ${data.players?.[me]?.number||"?"}`;
  if(opppnum) opppnum.textContent="Their #: ???";

  // AFK
  const now=Date.now();
  const oppOnline=data.players?.[opp]?.online||0;
  const existingBanner=document.querySelector(".dc-banner");
  if(oppOnline){
    const gap=now-oppOnline;
    if(gap>720000){
      if(!existingBanner||!existingBanner.classList.contains("tier2")){
        if(existingBanner)existingBanner.remove();
        const banner=d("dc-banner tier2",`👻 ${opp} is probably AFK — sit tight`);
        document.querySelector(".duel")?.parentNode.insertBefore(banner,document.querySelector(".duel"));
      }
    } else if(gap>240000){
      if(!existingBanner){
        const banner=d("dc-banner tier1",`⏳ ${opp} may be AFK`);
        document.querySelector(".duel")?.parentNode.insertBefore(banner,document.querySelector(".duel"));
      }
    } else if(existingBanner)existingBanner.remove();
  } else if(existingBanner)existingBanner.remove();

  // Typing
  const typingEl=document.getElementById("typingindicator");
  if(typingEl){
    const oppTypingTs=data.typing?.[opp];
    const oppIsTyping=oppTypingTs&&(Date.now()-oppTypingTs)<5000;
    typingEl.innerHTML=oppIsTyping?`<span style="color:var(--rose)">${opp} is typing</span> <span class="typing-dots"><span>•</span><span>•</span><span>•</span></span>`:"";
  }

  // Range bars
  const scrambled=hasMod(data,"scrambled");
  ["my","opp"].forEach(who=>{
    const bar=document.getElementById(who+"rangebar");
    if(!bar)return;
    const guesser=who==="my"?me:opp, target=who==="my"?opp:me;
    const {lo,hi}=computeRange(data,guesser,target,scrambled);
    const total=(data.max||100)-(data.min||1);
    const pct=total>0?Math.max(5,Math.round(((hi-lo)/total)*100)):100;
    const fill=bar.querySelector(".range-bar-fill"),label=bar.querySelector(".range-label");
    if(fill)fill.style.width=pct+"%";
    if(label)label.textContent=`${lo}–${hi} (${hi-lo+1} possible)`;
  });

  // Win prob
  const probMe=document.getElementById("probme"),probPct=document.getElementById("probpct");
  if(probMe&&probPct){
    const myR=computeRange(data,me,opp,scrambled),oppR=computeRange(data,opp,me,scrambled);
    const mySpan=myR.hi-myR.lo+1,oppSpan=oppR.hi-oppR.lo+1,total=mySpan+oppSpan;
    const myPct=total>0?Math.round((oppSpan/total)*100):50;
    probMe.style.width=myPct+"%"; probPct.textContent=`${myPct}% · ${100-myPct}%`;
  }

  const allGuesses=data.guesses?Object.values(data.guesses):[];
  const mgc=document.getElementById("myguesscount"),ogc=document.getElementById("oppguesscount");
  if(mgc)mgc.innerHTML=`Guesses: <span>${allGuesses.filter(g=>g.player===me).length}</span>`;
  if(ogc)ogc.innerHTML=`Guesses: <span>${allGuesses.filter(g=>g.player===opp).length}</span>`;
  const myrange=document.getElementById("myrange"),opprange=document.getElementById("opprange");
  if(myrange){const{lo,hi}=computeRange(data,me,opp,scrambled);myrange.innerHTML=`Guessing: <span>${lo}–${hi}</span>`;}
  if(opprange){const{lo,hi}=computeRange(data,opp,me,scrambled);opprange.innerHTML=`Opp range: <span>${lo}–${hi}</span>`;}

  // Guess card update
  const gc=document.getElementById("guesscard");
  const hasInput=!!document.getElementById("gi");
  if(gc){
    if(!telepathy){
      if(myTurn!==hasInput) renderGuessCard(gc,data,me,opp,myTurn);
      else if(myTurn&&hasInput){
        const {lo,hi}=computeRange(data,me,opp,scrambled);
        const gr=document.getElementById("grange"),gi=document.getElementById("gi");
        if(gr)gr.textContent=`Possible: ${lo}–${hi}`;
        if(gi){gi.min=String(lo);gi.max=String(hi);gi.placeholder=`${lo}–${hi}`;}
      }
    }
  }

  // Chat feed — append new messages only
  const feed=document.getElementById("chatfeed");
  if(feed){
    const taunts=data.taunts?Object.values(data.taunts).sort((a,b)=>a.ts-b.ts):[];
    // Remove the placeholder if real messages exist
    const placeholder=feed.querySelector(".chat-system");
    if(placeholder&&taunts.length)placeholder.remove();
    const current=feed.children.length;
    if(current!==taunts.length){
      taunts.slice(current).forEach(item=>{
        const isMe=item.player===me;
        const wrap=d("chat-msg "+(isMe?"mine":"theirs"));
        if(!isMe)wrap.append(el("div",{class:"chat-name"},item.player));
        wrap.append(d("chat-bubble",item.text));
        feed.append(wrap);
      });
      feed.scrollTop=feed.scrollHeight;
    }
    if(!taunts.length&&!feed.children.length)feed.append(d("chat-system","No messages yet — say something 💕"));
  }
}

function computeRange(data, guesser, target, scrambled=false){
  let lo=data.min||1, hi=data.max||100;
  // Shrinking modifier
  if(hasMod(data,"shrinking")){
    const allG=data.guesses?Object.values(data.guesses):[];
    const shrinkSteps=Math.floor(allG.length/3);
    const shrinkAmt=Math.max(1,Math.floor((data.max-data.min)*0.1));
    const minFloor=Math.max(5,Math.floor((data.max-data.min)*0.05));
    for(let i=0;i<shrinkSteps;i++){
      if(hi-lo<=minFloor)break;
      lo=Math.min(lo+shrinkAmt,Math.floor((lo+hi)/2)-Math.floor(minFloor/2));
      hi=Math.max(hi-shrinkAmt,Math.ceil((lo+hi)/2)+Math.ceil(minFloor/2));
    }
  }
  const guesses=data.guesses?Object.values(data.guesses):[];
  guesses.filter(g=>g.player===guesser).forEach(g=>{
    // Scrambled: swap higher/lower interpretation
    const trueResult=scrambled?(g.result==="higher"?"lower":g.result==="lower"?"higher":g.result):g.result;
    if(trueResult==="higher"&&g.guess>=lo)lo=g.guess+1;
    if(trueResult==="lower"&&g.guess<=hi)hi=g.guess-1;
  });
  return{lo:Math.max(data.min||1,lo),hi:Math.min(data.max||100,hi)};
}

function buildRangeBar(id,data,guesser,target,minVal,maxVal,scrambled=false){
  const wrap=d("range-bar-wrap"); wrap.id=id;
  const {lo,hi}=computeRange(data,guesser,target,scrambled);
  const total=(maxVal||100)-(minVal||1);
  const pct=total>0?Math.max(5,Math.round(((hi-lo)/total)*100)):100;
  const track=d("range-bar-track"),fill=d("range-bar-fill");
  fill.style.width=pct+"%"; track.append(fill);
  const label=d("range-label"); label.textContent=`${lo}–${hi} (${hi-lo+1} possible)`;
  wrap.append(track,label); return wrap;
}

async function submitGuess(){
  const data=S.roomData;
  if(!data)return;
  const players=Object.keys(data.players||{});
  const opp=players.find(p=>p!==S.username);
  if(!opp)return;
  const telepathy=hasMod(data,"telepathy");
  const scrambled=hasMod(data,"scrambled");
  const cupid=hasMod(data,"cupid");
  const drama=hasMod(data,"drama");
  const glitter=hasMod(data,"glitter");
  const hotcold=hasMod(data,"hotcold");
  if(!telepathy&&data.turn!==S.username)return;
  if(telepathy&&telepathyCooldown)return;
  const input=document.getElementById("gi");
  if(!input)return;
  const guess=parseInt(input.value);
  const allPast=data.guesses?Object.values(data.guesses):[];
  const myPast=allPast.filter(g=>g.player===S.username).map(g=>g.guess);
  const {lo:validLo,hi:validHi}=computeRange(data,S.username,opp,scrambled);
  if(isNaN(guess)||guess<validLo||guess>validHi){
    if(soundEnabled)SFX.blocked();
    input.value="OUT OF RANGE";
    input.classList.remove("shake");void input.offsetWidth;input.classList.add("shake","guess-feedback","feedback-lower");
    setTimeout(()=>{input.value="";input.classList.remove("shake","guess-feedback","feedback-lower");},800);
    return;
  }

  // Local Guard to prevent double guesses bypassing Firebase
  if(!window._localGuesses) window._localGuesses = new Set();
  if(window._localGuesses.has(guess)){
    gi.value=""; toast("⚠ already guessed that"); return;
  }

  if(myPast.includes(guess)){
    SFX.blocked();input.classList.remove("shake");void input.offsetWidth;input.classList.add("shake");setTimeout(()=>input.classList.remove("shake"),500);
    const existing=document.getElementById("dup-msg");
    if(!existing){const msg=el("div",{id:"dup-msg",style:"font-size:10px;color:var(--red);text-align:center;margin-top:4px;letter-spacing:1px"},`already tried ${guess}!`);input.parentNode.parentNode.append(msg);setTimeout(()=>msg.remove(),1800);}
    return;
  }

  window._localGuesses.add(guess);

  if(cupid)triggerCupidArrow();
  if(glitter){const r=input.getBoundingClientRect();triggerGlitter(r.left+r.width/2,r.top);}
  broadcastTyping(false);

  const oppNum=data.players[opp].number;
  const trueResult=guess===oppNum?"correct":guess>oppNum?"lower":"higher";
  const storedResult=trueResult;
  const displayedResult=scrambled&&trueResult!=="correct"?(trueResult==="higher"?"lower":"higher"):trueResult;

  // Hot & Cold label
  let hotLabel="";
  if(hotcold&&trueResult!=="correct"){
    const range=(data.max||100)-(data.min||1);
    const dist=Math.abs(guess-oppNum);
    const pct=dist/range;
    if(pct<0.05)hotLabel="🌋 BOILING";
    else if(pct<0.15)hotLabel="🔥 HOT";
    else if(pct<0.30)hotLabel="😐 WARM";
    else if(pct<0.50)hotLabel="❄️ COLD";
    else hotLabel="🥶 FREEZING";
  }

  // Auto-clear feedback flash
  if(trueResult==="correct"){input.value="✓ GOT IT!";}
  else if(hotcold){input.value=hotLabel;}
  else{input.value=displayedResult==="higher"?"↑ HIGHER":"↓ LOWER";}
  input.classList.add("guess-feedback","feedback-"+trueResult);
  setTimeout(()=>{input.value="";input.classList.remove("guess-feedback","feedback-correct","feedback-higher","feedback-lower");},700);

  // Update last guess display
  lastGuessInfo={guess,result:displayedResult,hotLabel};
  const lgEl=document.getElementById("last-guess-el");
  if(lgEl){
    lgEl.textContent=hotcold?`Last: ${guess} — ${hotLabel}`:`Last: ${guess} — ${displayedResult==="higher"?"↑ Higher":"↓ Lower"}`;
    lgEl.style.display="block";
  }

  // Binary search detector
  if(!hotcold&&myPast.length>=2&&trueResult!=="correct"){
    const mid=Math.floor((validLo+validHi)/2);
    if(Math.abs(guess-mid)<=2&&!document.getElementById("bs-toast")){
      const t=el("div",{id:"bs-toast",class:"bs-toast"},"🤖 Optimal strategy!");
      document.body.append(t);setTimeout(()=>t.remove(),2500);
    }
  }

  // Telepathy cooldown
  if(telepathy){
    telepathyCooldown=true;
    const gbtn=document.getElementById("gbtn");
    const cdLabel=document.getElementById("telecd");
    if(gbtn)gbtn.disabled=true;
    if(cdLabel){cdLabel.textContent="⏳ 3s cooldown...";cdLabel.classList.add("active");}
    let secs=3;
    if(window.telepathyCdTimer) clearInterval(window.telepathyCdTimer);
    window.telepathyCdTimer=setInterval(()=>{
      secs--;
      const cl=document.getElementById("telecd");
      if(cl)cl.textContent=secs>0?`⏳ ${secs}s...`:"both guessing simultaneously 🫶";
      if(secs<=0){clearInterval(window.telepathyCdTimer);telepathyCooldown=false;const gb=document.getElementById("gbtn");if(gb)gb.disabled=false;const cdl=document.getElementById("telecd");if(cdl)cdl.classList.remove("active");}
    },1000);
  }

  if(soundEnabled){
    if(trueResult==="correct"){SFX.correct();triggerBurst();}
    else if(trueResult==="higher")SFX.higher();
    else SFX.lower();
  } else if(trueResult==="correct"){triggerBurst();}

  if(drama&&trueResult!=="correct")triggerDramaFlash(trueResult);

  // Hot/Cold in-card bubble
  if(hotcold&&hotLabel){
    document.getElementById("hcmsg")?.remove();
    const hcC={["🌋 BOILING"]:["#ff4400","Boiling"],["🔥 HOT"]:["#ff8800","Hot"],["😐 WARM"]:["#ffaa44","Warm"],["❄️ COLD"]:["#88bbff","Cold"],["🥶 FREEZING"]:["#bbddff","Freezing"]};
    const [col]=hcC[hotLabel]||["var(--acc)"];
    const m=el("div",{id:"hcmsg",style:`font-size:22px;font-family:'Bebas Neue',Impact,sans-serif;letter-spacing:3px;color:${col};text-align:center;margin-top:6px;animation:fi .3s ease`},hotLabel);
    const gc=document.getElementById("guesscard");if(gc)gc.append(m);
    setTimeout(()=>m.remove(),3500);
  }

  await fbPush(`/duels/${S.roomCode}/guesses`,{player:S.username,guess,result:storedResult,ts:Date.now()});

  if(trueResult==="correct"){
    const newScore=(data.players[S.username].score||0)+1;
    const newStreak=(data.players[S.username].streak||0)+1;
    const allGuesses=data.guesses?Object.values(data.guesses):[];
    const myG=allGuesses.filter(g=>g.player===S.username).length+1;
    const oppG=allGuesses.filter(g=>g.player===opp).length;
    const isLucky=myG===1;
    let isSeriesWinner=false;
    if(data.bestOf && newScore>=data.bestOf) isSeriesWinner=true;
    await fbPush(`/duels/${S.roomCode}/roundHistory`,{round:S.round,winner:S.username,myGuesses:myG,oppGuesses:oppG,myNum:data.players[S.username].number,oppNum:data.players[opp].number});
    await fbUpdate(`/duels/${S.roomCode}`,{
      status:"finished",winner:S.username,winnerStreak:newStreak,luckyShot:isLucky||null,
      seriesWinner:isSeriesWinner?S.username:null,
      [`players/${S.username}/score`]:newScore,[`players/${S.username}/streak`]:newStreak,[`players/${opp}/streak`]:0,
    });
  } else {
    if(data.players?.[S.username]?.doubleTapActive){
      await fbUpdate(`/duels/${S.roomCode}/players/${S.username}`,{doubleTapActive:null});
    } else if(!telepathy) {
      await fbUpdate(`/duels/${S.roomCode}`,{turn:opp});
    }
  }
}

// ── WINNER ───────────────────────────────────────────────────
function renderWinner(){
  removeVisualMods();
  const screen=d("screen");
  const data=S.roomData||{};
  const players=Object.keys(data.players||{});
  const me=S.username,opp=players.find(p=>p!==me)||"Opponent";
  const winner=data.winner||opp,isMe=winner===me;
  const winnerStreak=data.winnerStreak||1;
  const myNum=data.players?.[me]?.number,oppNum=data.players?.[opp]?.number;
  const allGuesses=data.guesses?Object.values(data.guesses):[];
  const myGuessCnt = allGuesses.filter(g => g.player === me).length;
  const oppGuessCnt = allGuesses.filter(g => g.player === opp).length;
  const seriesWinner=data.seriesWinner;
  const isSeriesOver=!!seriesWinner;

  if(isSeriesOver){
    const headerWrapper=d("winner-header-wrap"); headerWrapper.style.textAlign="center"; headerWrapper.style.marginBottom="24px";
    headerWrapper.append(
      el("div",{class:"logo",style:"font-size:38px;letter-spacing:5px;line-height:1;margin-bottom:8px;color:var(--acc)"},seriesWinner===me?"YOU WON THE SERIES!":`${seriesWinner.toUpperCase()} WON!`),
      el("div",{style:"font-family:'DM Mono',monospace;font-size:12px;letter-spacing:4px;color:var(--mut);text-transform:uppercase"},"SERIES OVER")
    );
    screen.append(headerWrapper);
  } else {
    const headerWrapper=d("winner-header-wrap"); headerWrapper.style.textAlign="center"; headerWrapper.style.marginBottom="24px";
    headerWrapper.append(
      el("div",{class:"logo",style:"font-size:46px;letter-spacing:6px;line-height:1;margin-bottom:8px;color:"+(isMe?"var(--acc)":"var(--mut)")},isMe?"VICTORY 💕":winner.toUpperCase()+" WINS"),
      el("div",{style:"font-family:'DM Mono',monospace;font-size:12px;letter-spacing:4px;color:var(--mut);text-transform:uppercase"},isMe?"YOU WIN!":"YOU LOSE...")
    );
    screen.append(headerWrapper);
  }

  if(data.luckyShot&&isMe){
    const lucky=d("lucky-hero");
    lucky.append(el("span",{class:"lucky-icon"},"🍀"),el("div",{class:"lucky-title"},"LUCKY SHOT!"),el("div",{class:"lucky-sub"},`${winner} got it on the very first guess`),el("span",{class:"lucky-badge"},"✦ FIRST GUESS CORRECT ✦"));
    screen.append(lucky);
  } else {
    const hero=d("winner-hero");
    hero.append(el("span",{class:"winner-trophy-anim"},isMe?"💕":"💀"),el("div",{class:"winner-label"},isMe?"YOU WIN":"YOU LOSE"),el("div",{class:"winner-name"},winner),el("div",{class:"winner-sub"},"guessed the number!"));
    if(winnerStreak>=2)hero.append(el("span",{class:"streak-badge"},`🔥 ${winnerStreak}-ROUND STREAK`));
    screen.append(hero);
  }

  const sumCard=d("card");
  sumCard.append(el("div",{class:"ctitle"},"ROUND SUMMARY"));
  const grid=d("summary-grid");
  [{val:myGuessCnt,label:"Your Guesses",win:myGuessCnt<=oppGuessCnt&&isMe},{val:oppGuessCnt,label:`${opp}'s Guesses`,win:oppGuessCnt<myGuessCnt&&!isMe}].forEach(s=>{
    const cell=d("summary-stat");
    cell.append(el("div",{class:"summary-stat-val"},String(s.val)),el("div",{class:"summary-stat-label"},s.label));
    if(s.win)cell.append(el("div",{class:"summary-winner-tag"},"✓ fewer guesses"));
    grid.append(cell);
  });
  sumCard.append(grid);

  sumCard.append(el("div",{class:"ctitle",style:"margin-top:14px;margin-bottom:10px"},"NUMBER REVEAL"));
  const revealWrap=d("num-reveal-wrap");
  [[me,myNum,"Your Number"],[opp,oppNum,`${opp}'s Number`]].forEach(([name,num,label])=>{
    const card2=d("num-reveal-card"); card2.append(el("div",{class:"num-reveal-label"},label));
    const val=el("div",{class:"num-reveal-val"},"—"); card2.append(val); revealWrap.append(card2);
    if(num){
      const target=parseInt(num),duration=900,steps=Math.min(target,28),stepTime=duration/steps;
      let current=0;
      const tick=()=>{const jump=Math.max(1,Math.round((target-current)/(steps-Math.floor(current/(target/steps))+1)));current=Math.min(current+jump,target);val.textContent=String(current);val.classList.remove("num-reveal-tick");void val.offsetWidth;val.classList.add("num-reveal-tick");if(current<target)setTimeout(tick,stepTime);else card2.classList.add("revealed");};
      setTimeout(tick,200+Math.random()*150);
    }
  });
  sumCard.append(revealWrap);

  sumCard.append(el("div",{class:"sl",style:"margin-top:14px"},"SERIES SCORE"));
  const sb=d("duel");
  players.forEach(p=>{
    const streak=parseInt(data.players[p]?.streak)||0,score=parseInt(data.players[p]?.score)||0;
    const ps=d("pside"+(p===winner?" active":""));
    ps.append(el("div",{class:"pname"},p),el("div",{style:"font-family:Bebas Neue,Impact,sans-serif;font-size:32px;color:var(--acc);margin:4px 0"},score+" 💕"));
    if(streak>=2)ps.append(el("div",{class:"pstreak-badge"},`🔥 ${streak} STREAK`));
    sb.append(ps);
  });
  sumCard.append(sb);

  if(isSeriesOver && S.isHost){
    sumCard.append(el("button",{class:"btn rematch-btn",style:"margin-top:14px",onClick:()=>{
      S.round=0; Object.keys(S.roomData.players).forEach(p=>{
        fbUpdate(`/duels/${S.roomCode}/players/${p}`,{score:0,streak:0});
      });
      nextRound();
    }},"💕 PLAY NEW SERIES"),el("button",{class:"btn bs",onClick:leaveRoom},"LEAVE ROOM"));
  } else if(S.isHost){
    sumCard.append(el("button",{class:"btn rematch-btn",style:"margin-top:14px",onClick:nextRound},"💕 NEXT ROUND"),el("button",{class:"btn bs",onClick:leaveRoom},"END GAME"));
  } else {
    sumCard.append(el("div",{style:"text-align:center;color:var(--mut);font-size:12px;margin-top:16px"},"Waiting for host to continue... 💕"));
  }
  screen.append(sumCard);

  const allHistory=data.roundHistory?Object.values(data.roundHistory):[];
  if(allHistory.length>0){
    const rhCard=d("card");
    rhCard.append(el("div",{class:"ctitle"},"ROUND HISTORY"));
    const toggle=el("button",{class:"rh-toggle"},`▼ Show ${allHistory.length} round${allHistory.length>1?"s":""}`);
    const list=d("rh-list"); let open=false;
    toggle.addEventListener("click",()=>{open=!open;list.classList.toggle("open",open);toggle.textContent=(open?"▲ Hide":"▼ Show")+` ${allHistory.length} round${allHistory.length>1?"s":""}`;});
    allHistory.sort((a,b)=>(a.round||0)-(b.round||0)).forEach(rh=>{
      const row=d("rh-row"),myR=rh.winner===me;
      row.append(el("span",{class:"rh-round"},`RND ${rh.round||"?"}`),el("span",{class:"rh-winner",style:myR?"color:var(--acc)":"color:var(--mut)"},rh.winner||"?"),el("span",{class:"rh-detail"},`${rh.myGuesses||"?"}g vs ${rh.oppGuesses||"?"}g`));
      list.append(row);
    });
    rhCard.append(toggle,list); screen.append(rhCard);
  }
  return screen;
}

async function nextRound(){
  if(!S.isHost)return;
  const data=S.roomData||{};
  const players=Object.keys(data.players||{});
  const playerReset={};
  players.forEach(p=>{playerReset[`players/${p}/number`]=null;playerReset[`players/${p}/ready`]=false;});
  lastReactionCount=0;lastTypingState=false;lastChatCount=0;lastGuessInfo=null;hasUsedComeback=false;
  if(window._localGuesses) window._localGuesses.clear();
  const newPool=pickModifiers(S.roomCode+(S.round+1)).map(m=>m.id);
  await fbUpdate(`/duels/${S.roomCode}`,{
    status:"picking",winner:null,winnerStreak:null,luckyShot:null,guesses:null,turn:null,
    taunts:null,reactions:null,typing:null,activeModifiers:null,modifierVotes:null,normalVotes:null,
    peekRanges:null,modifierPool:newPool,round:(S.round||1)+1,...playerReset
  });
}

async function leaveRoom(){
  stopPolling();broadcastTyping(false);
  if(S.isHost){
    await fbDelete(`/duels/${S.roomCode}`);
  } else {
    const st=S.roomData?.status;
    if(st==="playing"||st==="modifiers"||st==="picking"){
      await fbUpdate(`/duels/${S.roomCode}`,{status:"abandoned",abandonedBy:S.username});
    }
    await fbDelete(`/duels/${S.roomCode}/players/${S.username}`);
  }
  Object.assign(S,{screen:"home",roomCode:"",isHost:false,roomData:null,round:1,bestOf:null});
  lastReactionCount=0;lastTypingState=false;roundHistory=[];lastChatCount=0;lastGuessInfo=null;hasUsedComeback=false;
  if(window._localGuesses) window._localGuesses.clear();
  removeVisualMods();render();
}

function launchConfetti(){
  const c=document.getElementById("conf");c.innerHTML="";
  const cols=["#ff6b9d","#ff3358","#ffd6e7","#c8385a","#ff9ec4","#fff0f5"];
  for(let i=0;i<110;i++){
    const p=document.createElement("div");p.className="cp";const s=5+Math.random()*8;
    p.style.cssText=`left:${Math.random()*100}%;top:0;background:${cols[Math.floor(Math.random()*cols.length)]};width:${s}px;height:${s}px;border-radius:${Math.random()>.4?"50%":"2px"};animation-duration:${1.8+Math.random()*2}s;animation-delay:${Math.random()*.7}s;`;
    c.append(p);setTimeout(()=>p.remove(),6000);
  }
}