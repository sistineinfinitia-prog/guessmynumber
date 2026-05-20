// ── ADMIN DEBUG PANEL ────────────────────────────────────────
// Password: 3109   |   Slide-out panel fixed to the right edge
// ─────────────────────────────────────────────────────────────

(function(){
  const ADMIN_PW = "3109";
  const SESSION_KEY = "guessr_admin_unlocked";

  // ── Inject styles ────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    #adm-panel {
      position: fixed; right: -320px; top: 0; bottom: 0; width: 310px;
      background: rgba(10,3,6,0.97); border-left: 1px solid #3d1a25;
      z-index: 9001; display: flex; flex-direction: column;
      transition: right .28s cubic-bezier(0.4,0,0.2,1);
      font-family: 'DM Mono', monospace; overflow: hidden;
    }
    #adm-panel.open { right: 0; }
    #adm-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 14px; border-bottom: 1px solid #3d1a25;
      background: rgba(26,10,16,0.9); flex-shrink: 0;
    }
    #adm-title {
      font-family: 'Bebas Neue', Impact, sans-serif; font-size: 16px;
      letter-spacing: 3px; color: #ff6b9d;
    }
    #adm-close {
      background: none; border: none; color: #8a5568; font-size: 18px;
      cursor: pointer; padding: 0 2px; line-height: 1; transition: color .15s;
    }
    #adm-close:hover { color: #ff3358; }
    #adm-body { flex: 1; overflow-y: auto; padding: 10px 12px; }
    #adm-body::-webkit-scrollbar { width: 3px; }
    #adm-body::-webkit-scrollbar-thumb { background: #3d1a25; border-radius: 2px; }

    /* Gate screen */
    #adm-gate {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; height: 100%; gap: 12px; padding: 20px;
    }
    #adm-gate-icon { font-size: 36px; }
    #adm-gate-label {
      font-size: 10px; letter-spacing: 2px; color: #8a5568;
      text-transform: uppercase; text-align: center;
    }
    #adm-pw {
      width: 100%; background: rgba(15,5,8,0.9); border: 1px solid #3d1a25;
      color: #ffe8f0; font-family: 'DM Mono', monospace; font-size: 20px;
      padding: 10px 14px; border-radius: 6px; outline: none; text-align: center;
      letter-spacing: 8px; transition: border-color .2s;
    }
    #adm-pw:focus { border-color: #ff6b9d; }
    #adm-pw-btn {
      width: 100%; padding: 10px; background: #ff6b9d; color: #0f0508;
      border: none; border-radius: 6px; font-family: 'Bebas Neue', Impact, sans-serif;
      font-size: 16px; letter-spacing: 3px; cursor: pointer; transition: all .15s;
    }
    #adm-pw-btn:hover { background: #ff9ec4; }
    #adm-pw-err { font-size: 11px; color: #ff3358; min-height: 14px; text-align: center; }

    /* Content sections */
    .adm-section {
      margin-bottom: 12px; background: rgba(26,10,16,0.7);
      border: 1px solid #3d1a25; border-radius: 8px; overflow: hidden;
    }
    .adm-section-hd {
      font-size: 9px; letter-spacing: 2px; text-transform: uppercase;
      color: #8a5568; padding: 7px 12px; border-bottom: 1px solid #3d1a25;
      background: rgba(34,13,21,0.6);
    }
    .adm-section-body { padding: 8px 10px; display: flex; flex-direction: column; gap: 6px; }
    .adm-row { display: flex; gap: 6px; align-items: center; }
    .adm-btn {
      flex: 1; padding: 7px 8px; font-family: 'Bebas Neue', Impact, sans-serif;
      font-size: 13px; letter-spacing: 1.5px; border-radius: 5px; cursor: pointer;
      border: 1px solid #3d1a25; background: rgba(34,13,21,0.9); color: #8a5568;
      transition: all .15s; text-align: center; line-height: 1.2;
    }
    .adm-btn:hover { border-color: #ff6b9d; color: #ff6b9d; }
    .adm-btn.danger:hover { border-color: #ff3358; color: #ff3358; }
    .adm-btn.green:hover { border-color: #4ade80; color: #4ade80; }
    .adm-input {
      flex: 1; background: rgba(15,5,8,0.8); border: 1px solid #3d1a25;
      color: #ffe8f0; font-family: 'DM Mono', monospace; font-size: 12px;
      padding: 6px 8px; border-radius: 5px; outline: none;
    }
    .adm-input:focus { border-color: #ff6b9d; }
    .adm-select {
      flex: 1; background: rgba(15,5,8,0.8); border: 1px solid #3d1a25;
      color: #ffe8f0; font-family: 'DM Mono', monospace; font-size: 11px;
      padding: 6px 8px; border-radius: 5px; outline: none;
    }
    .adm-toast {
      position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
      background: rgba(255,107,157,0.18); border: 1px solid rgba(255,107,157,0.4);
      color: #ffd6e7; font-family: 'DM Mono', monospace; font-size: 11px;
      letter-spacing: 1px; padding: 8px 18px; border-radius: 20px;
      z-index: 9999; white-space: nowrap;
      animation: admToastIn .2s ease, admToastOut .3s ease 1.8s forwards;
    }
    @keyframes admToastIn { from{opacity:0;transform:translate(-50%,8px)} to{opacity:1;transform:translateX(-50%)} }
    @keyframes admToastOut { to{opacity:0;transform:translate(-50%,-6px)} }

    /* JSON dump */
    #adm-dump {
      font-size: 10px; color: #8a5568; line-height: 1.6;
      white-space: pre-wrap; word-break: break-all;
      max-height: 200px; overflow-y: auto; background: rgba(10,3,6,0.8);
      border: 1px solid #3d1a25; border-radius: 5px; padding: 8px; margin-top: 6px;
    }
    #adm-dump::-webkit-scrollbar{width:3px}
    #adm-dump::-webkit-scrollbar-thumb{background:#3d1a25;border-radius:2px}
    #adm-status-dot {
      width: 7px; height: 7px; border-radius: 50%; display: inline-block;
      margin-right: 5px; flex-shrink: 0;
      background: #8a5568;
    }
    #adm-status-dot.live { background: #4ade80; animation: pulse 2s infinite; }
    #adm-status-row {
      display: flex; align-items: center; font-size: 10px; color: #8a5568;
      letter-spacing: 1px; padding: 6px 0 2px;
    }
  `;
  document.head.appendChild(style);

  // ── Build DOM ────────────────────────────────────────────
  const panel = document.createElement("div");
  panel.id = "adm-panel";
  panel.innerHTML = `
    <div id="adm-header">
      <span id="adm-title">⚙ DEBUG PANEL</span>
      <button id="adm-close">✕</button>
    </div>
    <div id="adm-body">
      <div id="adm-gate">
        <div id="adm-gate-icon">🔒</div>
        <div id="adm-gate-label">Enter admin password</div>
        <input id="adm-pw" type="password" placeholder="····" maxlength="10" />
        <button id="adm-pw-btn">UNLOCK</button>
        <div id="adm-pw-err"></div>
      </div>
      <div id="adm-content" style="display:none"></div>
    </div>
  `;
  document.body.appendChild(panel);

  // ── Toggle ───────────────────────────────────────────────
  document.getElementById("adm-close").addEventListener("click", () => {
    panel.classList.remove("open");
  });

  // ── Auth ─────────────────────────────────────────────────
  function checkSession(){
    if(sessionStorage.getItem(SESSION_KEY)==="1") showContent();
  }

  document.getElementById("adm-pw-btn").addEventListener("click", attemptUnlock);
  document.getElementById("adm-pw").addEventListener("keydown", e => {
    if(e.key==="Enter") attemptUnlock();
  });

  function attemptUnlock(){
    const val = document.getElementById("adm-pw").value;
    if(val === ADMIN_PW){
      sessionStorage.setItem(SESSION_KEY,"1");
      showContent();
    } else {
      const err = document.getElementById("adm-pw-err");
      err.textContent = "wrong password";
      document.getElementById("adm-pw").value = "";
      setTimeout(()=>err.textContent="", 1800);
    }
  }

  // ── Build Content ────────────────────────────────────────
  function showContent(){
    document.getElementById("adm-gate").style.display = "none";
    const cont = document.getElementById("adm-content");
    cont.style.display = "block";
    cont.innerHTML = ""; // rebuild fresh each open
    cont.appendChild(buildStatusRow());
    cont.appendChild(buildRoomSection());
    cont.appendChild(buildGameSection());
    cont.appendChild(buildScoreSection());
    cont.appendChild(buildInspectSection());
  }

  // ── Toast ────────────────────────────────────────────────
  function toast(msg){
    document.querySelectorAll(".adm-toast").forEach(t=>t.remove());
    const t = document.createElement("div");
    t.className = "adm-toast";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(()=>t.remove(), 2200);
  }

  // ── Status Row ───────────────────────────────────────────
  function buildStatusRow(){
    const wrap = document.createElement("div");
    wrap.id = "adm-status-row";
    const dot = document.createElement("span"); dot.id = "adm-status-dot";
    const lbl = document.createElement("span"); lbl.id = "adm-status-lbl";
    wrap.append(dot, lbl);

    function refresh(){
      const inRoom = !!S.roomCode;
      dot.className = "adm-status-dot" + (inRoom?" live":"");
      if(inRoom){
        lbl.textContent = `${S.roomCode} · ${S.screen} · ${S.isHost?"host":"guest"}`;
      } else {
        lbl.textContent = "no active room";
      }
    }
    refresh();
    // Re-check every 2s while panel is open
    const iv = setInterval(()=>{
      if(!panel.classList.contains("open")){ clearInterval(iv); return; }
      refresh();
    }, 2000);
    return wrap;
  }

  // ── Room Section ─────────────────────────────────────────
  function buildRoomSection(){
    const sec = mkSection("ROOM");
    const body = sec.querySelector(".adm-section-body");

    // Solo-start: fake opponent so host can bypass waiting
    body.appendChild(mkBtn("SOLO START (add bot)", async ()=>{
      if(!S.roomCode){ toast("⚠ not in a room"); return; }
      const data = await fbGet(`/duels/${S.roomCode}`);
      const botName = "DebugBot";
      const min=data?.min||1, max=data?.max||100;
      const botNum=min+Math.floor(Math.random()*(max-min+1));
      await fbUpdate(`/duels/${S.roomCode}/players/${botName}`, {score:0, ready:true, streak:0, online:Date.now(), number:botNum});
      toast(`✓ added ${botName} (secret # = ${botNum})`);
    }));

    // Force status
    const row = document.createElement("div"); row.className = "adm-row";
    const sel = document.createElement("select"); sel.className = "adm-select";
    ["waiting","picking","modifiers","playing","finished"].forEach(s=>{
      const o = document.createElement("option"); o.value=s; o.textContent=s; sel.appendChild(o);
    });
    if(S.roomData?.status) sel.value = S.roomData.status;
    const setBtn = mkBtnRaw("SET STATUS");
    setBtn.addEventListener("click", async()=>{
      if(!S.roomCode){ toast("⚠ not in a room"); return; }
      await fbUpdate(`/duels/${S.roomCode}`, {status: sel.value});
      toast(`✓ status → ${sel.value}`);
    });
    row.append(sel, setBtn);
    body.appendChild(row);

    // Delete room
    body.appendChild(mkBtn("DELETE ROOM ☠", async ()=>{
      if(!S.roomCode){ toast("⚠ not in a room"); return; }
      if(!confirm(`Delete room ${S.roomCode}?`)) return;
      stopPolling();
      await fbDelete(`/duels/${S.roomCode}`);
      Object.assign(S,{screen:"home",roomCode:"",isHost:false,roomData:null,round:1});
      removeVisualMods(); render();
      toast("✓ room deleted");
    }, "danger"));

    return sec;
  }

  // ── Game Section ─────────────────────────────────────────
  function buildGameSection(){
    const sec = mkSection("GAME STATE");
    const body = sec.querySelector(".adm-section-body");

    // Force my turn
    body.appendChild(mkBtn("MY TURN ←", async ()=>{
      if(!S.roomCode||!S.username){ toast("⚠ not in a game"); return; }
      await fbUpdate(`/duels/${S.roomCode}`, {turn: S.username});
      toast("✓ it's your turn");
    }, "green"));

    // Force opponent's turn
    body.appendChild(mkBtn("OPP TURN →", async ()=>{
      const opp = getOpp(); if(!opp){ toast("⚠ no opponent"); return; }
      await fbUpdate(`/duels/${S.roomCode}`, {turn: opp});
      toast(`✓ ${opp}'s turn`);
    }));

    // Set my secret number
    const numRow = document.createElement("div"); numRow.className = "adm-row";
    const numIn = document.createElement("input");
    numIn.type="number"; numIn.className="adm-input"; numIn.placeholder="set my # …";
    const numBtn = mkBtnRaw("SET MY #");
    numBtn.addEventListener("click", async ()=>{
      if(!S.roomCode||!S.username){ toast("⚠ not in a game"); return; }
      const v = parseInt(numIn.value); if(isNaN(v)){ toast("⚠ enter a number"); return; }
      await fbUpdate(`/duels/${S.roomCode}/players/${S.username}`, {number:v});
      toast(`✓ your # = ${v}`);
    });
    numRow.append(numIn, numBtn);
    body.appendChild(numRow);

    // Set opponent's secret number
    const oppRow = document.createElement("div"); oppRow.className = "adm-row";
    const oppIn = document.createElement("input");
    oppIn.type="number"; oppIn.className="adm-input"; oppIn.placeholder="set opp # …";
    const oppBtn = mkBtnRaw("SET OPP #");
    oppBtn.addEventListener("click", async ()=>{
      const opp = getOpp(); if(!opp){ toast("⚠ no opponent"); return; }
      const v = parseInt(oppIn.value); if(isNaN(v)){ toast("⚠ enter a number"); return; }
      await fbUpdate(`/duels/${S.roomCode}/players/${opp}`, {number:v});
      toast(`✓ ${opp}'s # = ${v}`);
    });
    oppRow.append(oppIn, oppBtn);
    body.appendChild(oppRow);

    // Force win (trigger correct guess sequence)
    body.appendChild(mkBtn("FORCE WIN 🎉", async ()=>{
      if(!S.roomCode||!S.username){ toast("⚠ not in a game"); return; }
      const data = await fbGet(`/duels/${S.roomCode}`);
      if(!data){ toast("⚠ room not found"); return; }
      const players = Object.keys(data.players||{});
      const opp = players.find(p=>p!==S.username);
      if(!opp){ toast("⚠ no opponent"); return; }
      const oppNum = data.players[opp]?.number;
      if(!oppNum){ toast("⚠ opp has no number set"); return; }
      const newScore = (data.players[S.username]?.score||0)+1;
      const newStreak = (data.players[S.username]?.streak||0)+1;
      await fbPush(`/duels/${S.roomCode}/guesses`,{player:S.username,guess:oppNum,result:"correct",ts:Date.now()});
      await fbUpdate(`/duels/${S.roomCode}`,{
        status:"finished", winner:S.username, winnerStreak:newStreak,
        [`players/${S.username}/score`]:newScore,
        [`players/${S.username}/streak`]:newStreak,
        [`players/${opp}/streak`]:0
      });
      toast("✓ you win!");
    }, "green"));

    // Skip modifier vote — immediately start round
    body.appendChild(mkBtn("SKIP TO PLAYING", async ()=>{
      if(!S.roomCode){ toast("⚠ not in a room"); return; }
      const data = await fbGet(`/duels/${S.roomCode}`);
      if(!data){ toast("⚠ room not found"); return; }
      const players = Object.keys(data.players||{});
      const first = players[0];
      await fbUpdate(`/duels/${S.roomCode}`,{
        status:"playing", turn:first,
        guesses:null, taunts:null, reactions:null, typing:null,
        activeModifiers:{}, modifierVotes:null, normalVotes:null
      });
      toast("✓ jumped to playing");
    }));

    return sec;
  }

  // ── Score Section ────────────────────────────────────────
  function buildScoreSection(){
    const sec = mkSection("SCORES");
    const body = sec.querySelector(".adm-section-body");

    body.appendChild(mkBtn("+1 MY WIN", async ()=>{
      if(!S.roomCode||!S.username){ toast("⚠ not in a game"); return; }
      const data = await fbGet(`/duels/${S.roomCode}`);
      const cur = data?.players?.[S.username]?.score||0;
      await fbUpdate(`/duels/${S.roomCode}/players/${S.username}`,{score:cur+1});
      toast(`✓ your score: ${cur+1}`);
    }, "green"));

    body.appendChild(mkBtn("+1 OPP WIN", async ()=>{
      const opp = getOpp(); if(!opp){ toast("⚠ no opponent"); return; }
      const data = await fbGet(`/duels/${S.roomCode}`);
      const cur = data?.players?.[opp]?.score||0;
      await fbUpdate(`/duels/${S.roomCode}/players/${opp}`,{score:cur+1});
      toast(`✓ ${opp} score: ${cur+1}`);
    }));

    body.appendChild(mkBtn("RESET SCORES", async ()=>{
      if(!S.roomCode){ toast("⚠ not in a room"); return; }
      const data = await fbGet(`/duels/${S.roomCode}`);
      const players = Object.keys(data?.players||{});
      const patch = {};
      players.forEach(p=>{ patch[`players/${p}/score`]=0; patch[`players/${p}/streak`]=0; });
      await fbUpdate(`/duels/${S.roomCode}`, patch);
      toast("✓ scores reset");
    }, "danger"));

    return sec;
  }

  // ── Inspect Section ──────────────────────────────────────
  function buildInspectSection(){
    const sec = mkSection("INSPECT FIREBASE");
    const body = sec.querySelector(".adm-section-body");

    const dump = document.createElement("pre"); dump.id="adm-dump"; dump.textContent="—";
    body.appendChild(mkBtn("REFRESH DUMP", async ()=>{
      if(!S.roomCode){ dump.textContent="no active room"; return; }
      dump.textContent = "loading…";
      const data = await fbGet(`/duels/${S.roomCode}`);
      dump.textContent = data ? JSON.stringify(data, null, 2) : "null";
    }));
    body.appendChild(mkBtn("COPY JSON", ()=>{
      navigator.clipboard.writeText(dump.textContent).then(()=>toast("✓ copied!"));
    }));
    body.appendChild(dump);
    return sec;
  }

  // ── Helpers ──────────────────────────────────────────────
  function getOpp(){
    if(!S.roomCode||!S.username||!S.roomData) return null;
    const players = Object.keys(S.roomData.players||{});
    return players.find(p=>p!==S.username)||null;
  }

  function mkSection(title){
    const sec = document.createElement("div"); sec.className="adm-section";
    const hd  = document.createElement("div"); hd.className="adm-section-hd"; hd.textContent=title;
    const body= document.createElement("div"); body.className="adm-section-body";
    sec.append(hd, body);
    return sec;
  }

  // mkBtn returns a full-width button element directly (no extra wrapper)
  function mkBtn(label, onClick, variant=""){
    const b = document.createElement("button");
    b.className = "adm-btn" + (variant?" "+variant:"");
    b.textContent = label;
    if(onClick) b.addEventListener("click", onClick);
    return b;
  }

  // mkBtnRaw: raw button without full-width, for use inside .adm-row divs
  function mkBtnRaw(label){
    const b = document.createElement("button");
    b.className = "adm-btn"; b.textContent = label;
    return b;
  }

})();
