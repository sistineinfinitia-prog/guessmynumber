function renderHome() {
  removeVisualMods();
  const screen = d("screen");
  screen.style.cssText = "display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100dvh;padding:20px;box-sizing:border-box";

  // Header
  const header = el("div", { style:"text-align:center;margin-bottom:36px" });
  header.append(
    el("div", { class:"logo", style:"font-size:clamp(42px,10vw,72px);margin-bottom:4px;letter-spacing:8px" }, "GUESSR"),
    el("div", { class:"logo-hearts", style:"font-size:clamp(12px,3vw,16px);letter-spacing:6px;margin-bottom:8px" }, "♥ ♥ ♥"),
    el("div", { class:"tag", style:"font-size:clamp(9px,2vw,11px);letter-spacing:3px" }, "1V1 NUMBER DUEL")
  );
  screen.append(header);

  // Action cards container
  const grid = el("div", { style:"display:flex;flex-direction:column;gap:12px;width:100%;max-width:380px" });

  // HOST card
  const hostCard = el("div", { style:"background:linear-gradient(135deg,rgba(255,107,157,0.12),rgba(255,107,157,0.04));border:1px solid rgba(255,107,157,0.3);border-radius:14px;padding:20px 22px;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:16px" });
  hostCard.innerHTML = `
    <div style="font-size:clamp(28px,7vw,36px);flex-shrink:0">👑</div>
    <div style="flex:1">
      <div style="font-family:'Bebas Neue',Impact,sans-serif;font-size:clamp(18px,5vw,22px);letter-spacing:3px;color:var(--acc);margin-bottom:3px">HOST A DUEL</div>
      <div style="font-family:'DM Mono',monospace;font-size:clamp(9px,2.5vw,11px);color:var(--mut);letter-spacing:1px">Create a room & wait for a challenger</div>
    </div>
    <div style="font-size:18px;color:var(--mut)">›</div>
  `;
  hostCard.onmouseenter = () => { hostCard.style.borderColor = "rgba(255,107,157,0.7)"; hostCard.style.background = "linear-gradient(135deg,rgba(255,107,157,0.2),rgba(255,107,157,0.08))"; hostCard.style.transform = "translateY(-2px)"; };
  hostCard.onmouseleave = () => { hostCard.style.borderColor = "rgba(255,107,157,0.3)"; hostCard.style.background = "linear-gradient(135deg,rgba(255,107,157,0.12),rgba(255,107,157,0.04))"; hostCard.style.transform = ""; };
  hostCard.onclick = openHostPopup;

  // QUICK JOIN card
  const quickCard = el("div", { style:"background:linear-gradient(135deg,rgba(30,215,96,0.1),rgba(30,215,96,0.03));border:1px solid rgba(30,215,96,0.25);border-radius:14px;padding:20px 22px;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:16px" });
  quickCard.innerHTML = `
    <div style="font-size:clamp(28px,7vw,36px);flex-shrink:0">🔍</div>
    <div style="flex:1">
      <div style="font-family:'Bebas Neue',Impact,sans-serif;font-size:clamp(18px,5vw,22px);letter-spacing:3px;color:#1ed760;margin-bottom:3px">QUICK JOIN</div>
      <div style="font-family:'DM Mono',monospace;font-size:clamp(9px,2.5vw,11px);color:var(--mut);letter-spacing:1px">Browse open lobbies & jump in instantly</div>
    </div>
    <div style="font-size:18px;color:var(--mut)">›</div>
  `;
  quickCard.onmouseenter = () => { quickCard.style.borderColor = "rgba(30,215,96,0.5)"; quickCard.style.background = "linear-gradient(135deg,rgba(30,215,96,0.18),rgba(30,215,96,0.07))"; quickCard.style.transform = "translateY(-2px)"; };
  quickCard.onmouseleave = () => { quickCard.style.borderColor = "rgba(30,215,96,0.25)"; quickCard.style.background = "linear-gradient(135deg,rgba(30,215,96,0.1),rgba(30,215,96,0.03))"; quickCard.style.transform = ""; };
  quickCard.onclick = openQuickJoin;

  // JOIN VIA CODE card
  const joinCard = el("div", { style:"background:linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01));border:1px solid rgba(255,255,255,0.12);border-radius:14px;padding:20px 22px;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:16px" });
  joinCard.innerHTML = `
    <div style="font-size:clamp(28px,7vw,36px);flex-shrink:0">🚪</div>
    <div style="flex:1">
      <div style="font-family:'Bebas Neue',Impact,sans-serif;font-size:clamp(18px,5vw,22px);letter-spacing:3px;color:var(--txt);margin-bottom:3px">JOIN VIA CODE</div>
      <div style="font-family:'DM Mono',monospace;font-size:clamp(9px,2.5vw,11px);color:var(--mut);letter-spacing:1px">Enter a room code to join a friend</div>
    </div>
    <div style="font-size:18px;color:var(--mut)">›</div>
  `;
  joinCard.onmouseenter = () => { joinCard.style.borderColor = "rgba(255,255,255,0.25)"; joinCard.style.background = "linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))"; joinCard.style.transform = "translateY(-2px)"; };
  joinCard.onmouseleave = () => { joinCard.style.borderColor = "rgba(255,255,255,0.12)"; joinCard.style.background = "linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))"; joinCard.style.transform = ""; };
  joinCard.onclick = openJoinPopup;

  grid.append(hostCard, quickCard, joinCard);
  screen.append(grid);
  return screen;
}

function openHostPopup() {
  const popup = d("qj-popup");
  Object.assign(popup.style, { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(15,5,8,0.95)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center" });
  const inner = el("div", { class: "card", style: "width: 90%; max-width: 400px; padding: 20px; position: relative;" });
  
  const header = el("div", { style: "margin-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.05);padding-bottom:12px;padding-right:30px" });
  header.append(el("div", { class: "ctitle", style: "margin:0;font-size:clamp(16px,4.5vw,20px);line-height:1;white-space:nowrap" }, "HOST A DUEL 👑"));
  const cbtn = el("button", { style: "position:absolute;top:15px;right:15px;background:transparent;border:none;color:var(--mut);font-size:24px;cursor:pointer;line-height:1;padding:5px;transition:color 0.2s" }, "✕");
  cbtn.onmouseenter = () => cbtn.style.color = "var(--acc)";
  cbtn.onmouseleave = () => cbtn.style.color = "var(--mut)";
  inner.append(cbtn);
  
  const content = el("div");
  content.innerHTML = `
    <div class="ig"><label>Your Name</label><input type="text" placeholder="Your username..." maxlength="14" id="cn" value="${S.username || ''}"></div>
    <label style="display:block;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--mut);margin-bottom:5px">Quick Range</label>
    <div class="presets" id="hp-presets">
      <button class="preset-btn active" data-min="1" data-max="100"><strong>Normal</strong><br>1-100</button>
      <button class="preset-btn" data-min="1" data-max="500"><strong>Hard</strong><br>1-500</button>
      <button class="preset-btn" data-min="1" data-max="1000"><strong>Insane</strong><br>1-1000</button>
    </div>
    <label style="display:block;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--mut);margin-bottom:5px;margin-top:8px">Custom Range</label>
    <div class="rr"><input type="number" value="1" id="cmin"><input type="number" value="100" id="cmax"></div>
    <label style="display:block;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--mut);margin-bottom:5px;margin-top:10px">Series Mode</label>
    <select id="cbestof" style="width:100%;background:var(--sur2);border:1px solid var(--brd);color:var(--txt);padding:8px 10px;border-radius:6px;font-family:'DM Mono',monospace;font-size:12px;letter-spacing:1px;margin-bottom:15px">
      <option value="">No limit — play forever</option>
      <option value="1">First to 1 win</option>
      <option value="3">First to 2 wins (Best of 3)</option>
      <option value="5">First to 3 wins (Best of 5)</option>
    </select>
    <div class="err" id="cerr"></div>
    <button class="btn bp" id="h-create">CREATE ROOM 💕</button>
  `;
  inner.append(header, content);
  popup.append(inner);
  document.body.append(popup);

  cbtn.onclick = () => popup.remove();
  
  content.querySelectorAll(".preset-btn").forEach(b => {
    b.onclick = () => {
      document.getElementById("cmin").value = b.dataset.min;
      document.getElementById("cmax").value = b.dataset.max;
      content.querySelectorAll(".preset-btn").forEach(x => x.classList.remove("active"));
      b.classList.add("active");
    };
  });
  
  document.getElementById("h-create").onclick = async () => {
    await createRoom();
    if (S.screen === "lobby") popup.remove();
  };
}

function openJoinPopup() {
  const popup = d("qj-popup");
  Object.assign(popup.style, { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(15,5,8,0.95)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center" });
  const inner = el("div", { class: "card", style: "width: 90%; max-width: 400px; padding: 20px; position: relative;" });
  
  const header = el("div", { style: "margin-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.05);padding-bottom:12px;padding-right:30px" });
  header.append(el("div", { class: "ctitle", style: "margin:0;font-size:clamp(16px,4.5vw,20px);line-height:1;white-space:nowrap" }, "JOIN A DUEL 🚪"));
  const cbtn = el("button", { style: "position:absolute;top:15px;right:15px;background:transparent;border:none;color:var(--mut);font-size:24px;cursor:pointer;line-height:1;padding:5px;transition:color 0.2s" }, "✕");
  cbtn.onmouseenter = () => cbtn.style.color = "var(--acc)";
  cbtn.onmouseleave = () => cbtn.style.color = "var(--mut)";
  inner.append(cbtn);
  
  const content = el("div");
  content.innerHTML = `
    <div class="ig"><label>Your Name</label><input type="text" placeholder="Your username..." maxlength="14" id="jn" value="${S.username || ''}"></div>
    <div class="ig"><label>Room Code</label><input type="text" placeholder="ABCD" maxlength="4" id="jcode" style="text-transform:uppercase;letter-spacing:6px;font-size:18px;text-align:center"></div>
    <div class="err" id="jerr"></div>
    <button class="btn bp" id="j-join">JOIN ROOM 💕</button>
  `;
  inner.append(header, content);
  popup.append(inner);
  document.body.append(popup);

  cbtn.onclick = () => popup.remove();
  
  const jcode = document.getElementById("jcode");
  jcode.addEventListener("input", () => jcode.value = jcode.value.toUpperCase());
  
  document.getElementById("j-join").onclick = async () => {
    await joinRoom();
    if (S.screen === "lobby") popup.remove();
  };
}

function askUsernamePopup(callback) {
  const popup = d("qj-popup");
  Object.assign(popup.style, { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(15,5,8,0.95)", zIndex: 10001, display: "flex", alignItems: "center", justifyContent: "center" });
  const inner = el("div", { class: "card", style: "width: 90%; max-width: 300px; padding: 20px;text-align:center" });
  
  inner.innerHTML = `
    <div class="ctitle" style="margin-bottom:15px;font-size:clamp(16px,4.5vw,20px);line-height:1;white-space:nowrap">ENTER USERNAME</div>
    <input type="text" id="pop-uname" placeholder="Your name..." maxlength="14" style="width:100%;margin-bottom:15px;text-align:center;font-size:16px" value="${S.username || ''}">
    <div style="display:flex;gap:10px">
      <button class="btn bs" id="pop-cancel" style="flex:1">CANCEL</button>
      <button class="btn bp" id="pop-ok" style="flex:1">OK</button>
    </div>
  `;
  popup.append(inner);
  document.body.append(popup);
  
  document.getElementById("pop-cancel").onclick = () => popup.remove();
  document.getElementById("pop-ok").onclick = () => {
    const val = document.getElementById("pop-uname").value.trim();
    if (val) {
      popup.remove();
      callback(val);
    }
  };
}

function openQuickJoin() {
  const popup = d("qj-popup");
  Object.assign(popup.style, {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    background: "rgba(15,5,8,0.95)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center"
  });
  const inner = el("div", { class: "card", style: "width: 90%; max-width: 400px; padding: 20px; position: relative;" });
  const header = el("div", { style: "margin-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.05);padding-bottom:12px;padding-right:30px" });
  header.append(el("div", { class: "ctitle", style: "margin:0;font-size:clamp(16px,4.5vw,20px);line-height:1;white-space:nowrap" }, "OPEN LOBBIES 🔍"));
  const cbtn = el("button", { style: "position:absolute;top:15px;right:15px;background:transparent;border:none;color:var(--mut);font-size:24px;cursor:pointer;line-height:1;padding:5px;transition:color 0.2s" }, "✕");
  cbtn.onmouseenter = () => cbtn.style.color = "var(--acc)";
  cbtn.onmouseleave = () => cbtn.style.color = "var(--mut)";
  inner.append(cbtn);
  const list = el("div", { id: "qjlist", style: "max-height:300px;overflow-y:auto;border:1px solid var(--brd);border-radius:6px;padding:10px" });
  list.innerHTML = `<div style="color:var(--mut);font-size:12px;text-align:center">Scanning for games...</div>`;
  inner.append(header, list);
  popup.append(inner);
  document.body.append(popup);

  let active = true;
  cbtn.onclick = () => { active = false; popup.remove(); };

  async function scan() {
    if (!active) return;
    const all = await fbGet(`/duels`);
    if (!active || !document.getElementById("qjlist")) return;
    list.innerHTML = "";
    let found = 0;
    if (all) {
      Object.entries(all).forEach(([code, data]) => {
        if (data.status === "waiting" && Object.keys(data.players || {}).length === 1) {
          const row = el("div", { style:"display:flex;justify-content:space-between;padding:10px;border-bottom:1px solid var(--sur2);align-items:center;background:var(--sur);border-radius:6px;margin-bottom:5px" });
          const info = el("div", { style:"font-family:'DM Mono',monospace;font-size:13px;color:var(--grn)" });
          info.innerHTML = `CODE: <span style="color:var(--txt)">${code}</span><br><span style="font-size:10px;color:var(--mut)">Range: ${data.min}-${data.max}</span>`;
          
          const jbtn = el("button", { class: "btn bp", style:"padding:6px 12px;font-size:11px" }, "JOIN");
          jbtn.onclick = () => { 
            let name = S.username || document.getElementById("jn")?.value?.trim() || document.getElementById("cn")?.value?.trim();
            if(!name) {
              askUsernamePopup(enteredName => {
                active = false; popup.remove(); 
                joinRoom(enteredName, code);
              });
            } else {
              active = false; popup.remove(); 
              joinRoom(name, code);
            }
          };
          row.append(info, jbtn);
          list.append(row);
          found++;
        }
      });
    }
    if(found === 0) list.innerHTML = "<div style='color:var(--mut);font-size:12px;text-align:center;padding:20px'>No open lobbies found.<br>Try hosting one!</div>";
    if(active) setTimeout(scan, 2500);
  }
  scan();
}

async function createRoom() {
  const username = document.getElementById("cn")?.value?.trim();
  const min = parseInt(document.getElementById("cmin")?.value) || 1;
  const max = parseInt(document.getElementById("cmax")?.value) || 100;
  const bestOf = parseInt(document.getElementById("cbestof")?.value) || null;
  const err = document.getElementById("cerr");
  if (!username) { if(err) err.textContent = "Enter your name"; return; }
  if (min >= max) { if(err) err.textContent = "Max must be greater than min"; return; }
  if(err) err.textContent = "Creating...";
  const code = genCode();
  const pool = pickModifiers(code).map(m => m.id);
  await fbSet(`/duels/${code}`, {
    host: username, min, max, bestOf: bestOf || null, status: "waiting", round: 1,
    players: { [username]: { score: 0, ready: false, streak: 0, online: Date.now() } },
    turn: null, guesses: null, taunts: null, reactions: null, typing: null, roundHistory: null,
    modifierPool: pool, modifierVotes: null, activeModifiers: null, normalVotes: null, peekRanges: null
  });
  S.username = username; S.roomCode = code; S.isHost = true; S.round = 1; S.bestOf = bestOf; roundHistory = []; lastChatCount = 0; lastGuessInfo = null;
  if (soundEnabled && window.SFX) SFX.join();
  startPolling(code); S.screen = "lobby"; render();
}

async function joinRoom(forcedName, forcedCode) {
  const code = forcedCode || document.getElementById("jcode")?.value?.trim().toUpperCase();
  if (code === "3109") {
    const popup = document.querySelector(".qj-popup");
    if (popup) popup.remove();
    const panel = document.getElementById("adm-panel");
    if (panel) {
      panel.classList.add("open");
      const pwInput = document.getElementById("adm-pw");
      if (pwInput) pwInput.focus();
    }
    return;
  }
  const username = forcedName || document.getElementById("jn")?.value?.trim();
  const err = document.getElementById("jerr");
  if (!username) { if(err) err.textContent = "Enter your name"; return; }
  if (!code || code.length !== 4) { if(err) err.textContent = "Enter a 4-letter room code"; return; }
  if(err) err.textContent = "Joining...";
  const room = await fbGet(`/duels/${code}`);
  if (!room) { if(err) err.textContent = "Room not found"; return; }
  if (room.status !== "waiting") { if(err) err.textContent = "Game already started"; return; }
  const existing = Object.keys(room.players || {});
  if (existing.length >= 2) { if(err) err.textContent = "Room is full (1v1 only)"; return; }
  if (room.players?.[username]) { if(err) err.textContent = "Name taken in this room"; return; }
  await fbUpdate(`/duels/${code}/players/${username}`, { score: 0, ready: false, streak: 0, online: Date.now() });
  S.username = username; S.roomCode = code; S.isHost = false; S.round = 1; roundHistory = []; lastChatCount = 0;
  if (soundEnabled && window.SFX) SFX.join();
  startPolling(code); S.screen = "lobby"; render();
}

// ── POLLING ──────────────────────────────────────────────────
function startPolling(code) {
  stopPolling(); lastHash = "";
  pollTimer = setInterval(() => poll(code), 1200);
  heartbeatTimer = setInterval(() => { if (S.roomCode) fbUpdate(`/duels/${S.roomCode}/players/${S.username}`, { online: Date.now() }); }, 4000);
}
function stopPolling() {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
  if (heartbeatTimer) { clearInterval(heartbeatTimer); heartbeatTimer = null; }
}

async function poll(code) {
  const start = Date.now();
  const data = await fbGet(`/duels/${code}`);
  const ping = Date.now() - start;
  const pingEl = document.getElementById("ping-display");
  if (pingEl) {
    pingEl.textContent = `${ping}ms`;
    pingEl.classList.toggle("high-ping", ping > 300);
  }

  if (!data) { stopPolling(); S.screen = "home"; removeVisualMods(); render(); return; }

  if (S.isHost && data.status === "playing" && Object.keys(data.players || {}).includes("DebugBot")) {
    handleBotAITick(data, code);
  }

  const h = JSON.stringify(data);
  if (h === lastHash) return;
  lastHash = h; S.roomData = data;
  if (data.round) S.round = data.round;
  if (data.roundHistory) roundHistory = Object.values(data.roundHistory);

  const reactions = data.reactions ? Object.values(data.reactions) : [];
  if (reactions.length > lastReactionCount) {
    reactions.slice(lastReactionCount).forEach(r => floatEmoji(r.emoji));
    lastReactionCount = reactions.length;
  }
  const chats = data.taunts ? Object.values(data.taunts) : [];
  if (chats.length > lastChatCount) {
    chats.slice(lastChatCount).forEach(c => {
      if (c.player !== S.username) {
        floatEmoji("💬💬", 15 + Math.random() * 20, 50 + Math.random() * 20);
        if (soundEnabled && window.SFX) SFX.chatReceive();
      }
    });
    lastChatCount = chats.length;
  }

  const prev = S.screen;
  const myData = data.players?.[S.username];
  
  if (!myData && prev !== "home") {
    showAlertPopup("You have been kicked from the lobby.");
    stopPolling(); removeVisualMods();
    Object.assign(S, { screen: "home", roomCode: "", isHost: false, roomData: null, round: 1 });
    render();
    return;
  }

  if (data.status === "waiting") {
    if (prev !== "lobby") { S.screen = "lobby"; render(); } else patchLobby(data);
  } else if (data.status === "picking") {
    if (S.isHost) {
      const players = Object.keys(data.players || {});
      const allReady = players.length >= 2 && players.every(p => data.players[p].number);
      if (allReady) {
        if (data.gameMode === "normal") {
          await fbUpdate(`/duels/${code}`, { status: "playing" });
        } else {
          await fbUpdate(`/duels/${code}`, { status: "modifiers", modifierVotes: null, normalVotes: null, activeModifiers: null, modifierDeadline: Date.now() + 30000 });
        }
        return;
      }
    }
    if (!myData?.number) {
      if (prev !== "picknumber") { S.screen = "picknumber"; render(); }
    } else {
      if (prev !== "waitpick") { S.screen = "waitpick"; render(); }
    }
  } else if (data.status === "modifiers") {
    if (prev !== "modifiers") { S.screen = "modifiers"; render(); }
    else patchModifiers(data);
  } else if (data.status === "playing") {
    applyVisualMods(data);
    if (prev !== "game") { S.screen = "game"; lastReactionCount = Object.values(data.reactions || {}).length; lastChatCount = Object.values(data.taunts || {}).length; if (soundEnabled && window.SFX) SFX.start(); render(); }
    else patchGame(data);
  } else if (data.status === "finished") {
    if (prev !== "winner") { S.screen = "winner"; render(); launchConfetti(); }
  } else if (data.status === "abandoned") {
    stopPolling(); removeVisualMods();
    Object.assign(S, { screen: "home", roomCode: "", isHost: false, roomData: null, round: 1 });
    lastGuessInfo = null; render();
  }
}

// ── POPUP UTILITIES ──────────────────────────────────────────
function showAlertPopup(msg) {
  const popup = el("div", { class:"qj-popup", style:"position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15,5,8,0.92);z-index:10002;display:flex;align-items:center;justify-content:center" });
  const inner = el("div", { class:"card", style:"max-width:320px;width:90%;padding:25px;text-align:center" });
  inner.append(
    el("div", { style:"font-size:22px;margin-bottom:12px" }, "⚠️"),
    el("div", { style:"color:var(--txt);font-family:'DM Mono',monospace;font-size:13px;line-height:1.6;margin-bottom:20px" }, msg),
    el("button", { class:"btn bp", style:"width:100%", onClick: () => popup.remove() }, "OK")
  );
  popup.append(inner);
  document.body.append(popup);
}

function showConfirmPopup(msg, onConfirm) {
  const popup = el("div", { class:"qj-popup", style:"position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15,5,8,0.92);z-index:10002;display:flex;align-items:center;justify-content:center" });
  const inner = el("div", { class:"card", style:"max-width:320px;width:90%;padding:25px;text-align:center" });
  const btns = el("div", { style:"display:flex;gap:10px;margin-top:20px" });
  const cancel = el("button", { class:"btn bs", style:"flex:1", onClick: () => popup.remove() }, "CANCEL");
  const confirm = el("button", { class:"btn bp", style:"flex:1;background:rgba(220,50,70,0.3);border-color:rgba(220,50,70,0.6)", onClick: () => { popup.remove(); onConfirm(); } }, "CONFIRM");
  btns.append(cancel, confirm);
  inner.append(
    el("div", { style:"font-size:22px;margin-bottom:12px" }, "❓"),
    el("div", { style:"color:var(--txt);font-family:'DM Mono',monospace;font-size:13px;line-height:1.6" }, msg),
    btns
  );
  popup.append(inner);
  document.body.append(popup);
}

// ── LOBBY ────────────────────────────────────────────────────
function renderLobby() {
  const screen = d("screen");
  screen.append(el("div", { class: "logo", style: "font-size:38px;margin-bottom:2px" }, "GUESSR"), el("div", { class: "tag", style: "margin-bottom:18px" }, "1v1 DUEL — LOBBY"));
  const card = d("card");
  card.append(el("div", { class: "ctitle" }, "ROOM CODE"));
  const cd = el("div", {
    class: "cdisp", onClick: () => {
      navigator.clipboard.writeText(S.roomCode).catch(() => { });
      cd.style.color = "var(--grn)"; setTimeout(() => cd.style.color = "var(--acc)", 1200);
    }
  }, S.roomCode);
  card.append(cd, el("div", { class: "chint" }, "CLICK TO COPY — share with your opponent 💕"));
  // Share button
  const shareRow = d("share-row");
  const shareBtn = el("button", {
    class: "share-btn", onClick: () => {
      const msg = `Join my GUESSR duel! Room code: ${S.roomCode}`;
      if (navigator.share) { navigator.share({ title: "GUESSR", text: msg, url: window.location.href }).catch(() => { }); }
      else { navigator.clipboard.writeText(msg).then(() => { shareBtn.textContent = "✓ Copied!"; setTimeout(() => shareBtn.textContent = "📎 Share", 1500); }); }
    }
  }, "📎 Share");
  shareRow.append(shareBtn);
  card.append(shareRow);
  card.append(el("div", { class: "sl" }, "PLAYERS"));
  const pl = d("pl"); pl.id = "pl"; card.append(pl);
  const sb = el("div", { class: "waitbox", id: "lsb" }); card.append(sb);
  if (S.isHost) {
    const modToggle = d("ig");
    modToggle.innerHTML = `<label style="display:block;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--mut);margin-bottom:5px">Game Mode</label>
      <select id="lmode" style="width:100%;background:var(--sur2);border:1px solid var(--brd);color:var(--txt);padding:8px 10px;border-radius:6px;font-family:'DM Mono',monospace;font-size:12px;letter-spacing:1px;margin-bottom:15px">
        <option value="chaos">Chaos (Modifiers & Perks)</option>
        <option value="normal">Normal (Pure Guessr)</option>
      </select>`;
    card.append(modToggle);
    // Sync mode to Firebase in real-time so the guest sees the update
    setTimeout(() => {
      const sel = document.getElementById("lmode");
      if (sel) sel.onchange = () => fbUpdate(`/duels/${S.roomCode}`, { gameMode: sel.value });
    }, 0);
    card.append(el("button", { class: "btn bp", id: "startbtn", onClick: startGame }, "START GAME 💕"));
  } else {
    card.append(el("div", { id: "lmode-disp", style:"color:var(--mut);font-size:11px;margin-bottom:10px;text-transform:uppercase;letter-spacing:1px;text-align:center" }, `Game Mode: ${S.roomData?.gameMode === "normal" ? "Normal (Pure Guessr)" : "Chaos (Modifiers & Perks)"}`));
  }
  card.append(el("button", { class: "btn bs", onClick: leaveRoom, style: S.isHost ? "margin-top:10px" : "" }, "LEAVE"));
  screen.append(card);
  if (S.roomData) patchLobby(S.roomData);
  return screen;
}

function patchLobby(data) {
  const pl = document.getElementById("pl"), sb = document.getElementById("lsb"), startBtn = document.getElementById("startbtn");
  if (!pl) return;
  pl.innerHTML = "";
  const players = Object.keys(data.players || {});
  players.forEach(name => {
    const chip = d("chip" + (name === data.host ? " host" : ""));
    chip.append(d("dot")); chip.appendChild(document.createTextNode(name));
    if (name === S.username) chip.append(sp("", ` (you)`));
    if (name === data.host) chip.append(sp("", ` ♛`));
    
    if (S.isHost && name !== S.username) {
      const kbtn = el("button", { style:"background:rgba(220,50,70,0.15);border:1px solid rgba(220,50,70,0.4);color:#ff6b8a;padding:3px 8px;border-radius:4px;cursor:pointer;font-size:10px;letter-spacing:1px;font-family:'DM Mono',monospace;margin-left:8px" }, "KICK");
      kbtn.onclick = () => {
        showConfirmPopup(`Kick ${name} from the lobby?`, () => fbDelete(`/duels/${S.roomCode}/players/${name}`));
      };
      chip.append(kbtn);
    }
    
    pl.append(chip);
  });
  
  if (!S.isHost) {
     const disp = document.getElementById("lmode-disp");
     if(disp) disp.textContent = `Game Mode: ${data.gameMode === "normal" ? "Normal" : "Chaos"}`;
  }
  if (sb) {
    const n = players.length, range = `Range: ${data.min}–${data.max}`;
    sb.innerHTML = n === 1 ? `<div style="color:var(--mut);font-size:12px">Waiting for opponent...<br><span style="font-size:10px;letter-spacing:1px">${range}</span></div>` : `<div style="color:var(--acc);font-size:12px">Both players ready! 💕<br><span style="font-size:10px;letter-spacing:1px;color:var(--mut)">${range}</span></div>`;
  }
  if (startBtn) { const n = Object.keys(data.players || {}).length; startBtn.disabled = n < 2; startBtn.style.opacity = n < 2 ? "0.4" : "1"; }
}

async function startGame() {
  if (!S.isHost) return;
  if (Object.keys(S.roomData?.players || {}).length < 2) { showAlertPopup("Need 2 players to start!"); return; }
  const modeSel = document.getElementById("lmode");
  const mode = modeSel ? modeSel.value : "chaos";
  await fbUpdate(`/duels/${S.roomCode}`, { status: "picking", gameMode: mode });
}

// ── PICK NUMBER ──────────────────────────────────────────────
function renderPickNumber() {
  const screen = d("screen");
  const data = S.roomData || {};
  const min = data.min !== undefined && data.min !== null ? Number(data.min) : 1;
  const max = data.max !== undefined && data.max !== null ? Number(data.max) : 100;
  screen.append(el("div", { class: "logo", style: "font-size:38px;margin-bottom:2px" }, "GUESSR"), el("div", { class: "tag", style: "margin-bottom:18px" }, "PICK YOUR SECRET NUMBER"));
  const card = d("card");
  card.append(el("div", { class: "ctitle" }, "YOUR SECRET NUMBER"));
  card.append(el("div", { style: "color:var(--mut);font-size:12px;margin-bottom:14px;line-height:1.6" }, `Pick any number between ${min} and ${max}. Your opponent will try to guess it!`));
  const ni = el("input", { type: "number", placeholder: `${min} – ${max}`, id: "mynum", min: String(min), max: String(max), style: "font-size:28px;text-align:center;padding:14px;letter-spacing:4px" });
  ni.addEventListener("keydown", e => { if (e.key === "Enter") confirmNumber(); });
  const err = el("div", { class: "err", id: "numerr" });
  card.append(ni, err, el("button", { class: "btn bp", style: "margin-top:10px", onClick: confirmNumber }, "LOCK IT IN 🔒"));
  screen.append(card); return screen;
}

async function confirmNumber() {
  const data = S.roomData || {};
  const min = data.min !== undefined && data.min !== null ? Number(data.min) : 1;
  const max = data.max !== undefined && data.max !== null ? Number(data.max) : 100;
  const val = parseInt(document.getElementById("mynum").value);
  const err = document.getElementById("numerr");
  if (isNaN(val) || val < min || val > max) { err.textContent = `Must be between ${min} and ${max}`; return; }
  err.textContent = "Locking in...";
  await fbUpdate(`/duels/${S.roomCode}/players/${S.username}`, { number: val, ready: true });
  const data2 = await fbGet(`/duels/${S.roomCode}`);
  const players = Object.keys(data2.players || {});
  const allReady = players.every(p => data2.players[p].number);
  if (allReady) {
    if (data2.gameMode === "normal") {
      await fbUpdate(`/duels/${S.roomCode}`, { status: "playing" });
    } else {
      // Transition to modifier screen
      await fbUpdate(`/duels/${S.roomCode}`, { status: "modifiers", modifierVotes: null, normalVotes: null, activeModifiers: null, modifierDeadline: Date.now() + 30000 });
    }
  }
  S.screen = "waitpick"; render();
}

function renderWaitPick() {
  const screen = d("screen");
  screen.append(el("div", { class: "logo", style: "font-size:38px;margin-bottom:2px" }, "GUESSR"));
  const card = d("card");
  const wb = d("waitbox");
  wb.innerHTML = `<div class="waitanim">WAITING...</div><div style="color:var(--mut);font-size:12px;margin-top:12px">Your number is locked in 🔒<br>Waiting for opponent to pick theirs</div>`;
  card.append(wb); screen.append(card); return screen;
}

// ── MODIFIER SCREEN ──────────────────────────────────────────
let modifierTimerInterval = null;
let pickPhaseTimer = null;
let _pickCenterDir = null; // randomised once per session
let lastResolvedPhase = null;

function renderModifiers() {
  const screen = d("screen");
  const data = S.roomData || {};
  _pickCenterDir = Math.random() < 0.5 ? "left" : "right";
  _pickCountdownActive = false;
  _perkCountdownQueued = false;
  _resolving = false;
  lastResolvedPhase = null;

  screen.append(
    el("div", { class: "logo", style: "font-size:32px;margin-bottom:2px" }, "GUESSR"),
    el("div", { class: "cinematic-header" },
      el("div", { class: "cinematic-title" }, "CHOOSE YOUR CHAOS"),
      el("div", { class: "cinematic-sub" }, "3 ROUNDS OF CARDS — YOUR FATE IS SEALED")
    )
  );

  // 3 black tray cards
  const tray = d("pick-tray"); tray.id = "picktray";
  const categories = [
    { id: "visual", icon: "🎨", label: "VISUAL\nCARDS", sub: "COSMETICS" },
    { id: "gameplay", icon: "🎮", label: "GAMEPLAY\nCARDS", sub: "RULES" },
    { id: "perks", icon: "⚡", label: "PERK\nCARDS", sub: "PERSONAL" },
  ];
  const dirs = ["left", _pickCenterDir === "left" ? "left" : "right", "right"];
  const delays = [0, 200, 100]; // left→center→right stagger feel
  categories.forEach((cat, i) => {
    const card = d("tray-card"); card.id = "traycard-" + cat.id;
    card.append(
      el("div", { class: "tray-card-icon" }, cat.icon),
      el("div", { class: "tray-card-label" }, cat.label),
      el("div", { class: "tray-card-sublabel" }, cat.sub)
    );
    card.style.opacity = "0";
    card.dataset.slideDir = dirs[i];
    setTimeout(() => {
      card.style.opacity = "1";
      card.classList.add("slide-" + dirs[i]);
    }, delays[i]);
    tray.append(card);
  });
  screen.append(tray);

  // Restore existing state if rejoining mid-pick
  const phase = data.pickingPhase || "tray";
  setTimeout(() => {
    syncPickPhase(data, phase);
    if (phase === "tray" && S.isHost) {
      fbUpdate(`/duels/${S.roomCode}`, { pickingPhase: "visual", modifierDeadline: Date.now() + 30000 });
    }
  }, 1100);

  return screen;
}

function syncPickPhase(data, phase) {
  if (S.screen !== "modifiers") return;
  // Mark tray cards done/active
  ["visual", "gameplay", "perks"].forEach(cat => {
    const tc = document.getElementById("traycard-" + cat);
    if (!tc) return;
    // Never touch done-phase cards
    if (tc.classList.contains("done-phase")) return;
    tc.classList.remove("active-phase");
    if (phase === "tray") return;
    const phaseOrder = ["visual", "gameplay", "perks", "countdown"];
    const phaseIdx = phaseOrder.indexOf(phase);
    const catIdx = phaseOrder.indexOf(cat);
    if (catIdx < phaseIdx) {
      revealTrayCard(tc, cat, data);
    }
    else if (catIdx === phaseIdx) tc.classList.add("active-phase");
  });

  const existingOverlay = document.getElementById("pickoverlay");
  const isCorrectPhaseOpen = existingOverlay && existingOverlay.dataset.phase === phase;

  if (phase === "visual" && !isCorrectPhaseOpen && !_resolving && lastResolvedPhase !== "visual") openPickPopup("visual", data);
  else if (phase === "gameplay" && !isCorrectPhaseOpen && !_resolving && lastResolvedPhase !== "gameplay") openPickPopup("gameplay", data);
  else if (phase === "perks" && !isCorrectPhaseOpen && !_resolving && lastResolvedPhase !== "perks") openPickPopup("perks", data);
  else if (phase === "countdown" && !_pickCountdownActive) startPickCountdown();
}

function patchModifiers(data) {
  if (!data) return;
  const phase = data.pickingPhase || "tray";
  syncPickPhase(data, phase);

  // If a popup is open, also update its vote tallies
  const overlay = document.getElementById("pickoverlay");
  if (!overlay) return;
  const curPhase = overlay.dataset.phase;
  if (curPhase === "visual" || curPhase === "gameplay") {
    patchPickVotes(data, curPhase);
  }
  if (curPhase === "perks") {
    patchPerkWaiting(data);
  }
}

// ── TRAY CARD FLIP REVEAL ─────────────────────────────────────
function revealTrayCard(tc, cat, data) {
  // Remove slide animation classes so they don't replay
  tc.classList.remove("slide-left", "slide-right");
  tc.classList.add("done-phase", "flip-in");
  tc.addEventListener("animationend", () => tc.classList.remove("flip-in"), { once: true });
  tc.innerHTML = "";
  if (cat === "visual") {
    const id = data.visualPick;
    const def = id && id !== "none" ? VISUAL_MODS.find(m => m.id === id) : null;
    tc.append(
      el("div", { class: "tray-card-icon" }, def ? def.icon : "❌"),
      el("div", { class: "tray-card-label" }, "VISUAL\nCARDS"),
      el("div", { class: "tray-card-result-name" }, def ? def.name : "SKIPPED")
    );
  } else if (cat === "gameplay") {
    const id = data.gameplayPick;
    const def = id && id !== "none" ? GAMEPLAY_MODS.find(m => m.id === id) : null;
    tc.append(
      el("div", { class: "tray-card-icon" }, def ? def.icon : "❌"),
      el("div", { class: "tray-card-label" }, "GAMEPLAY\nCARDS"),
      el("div", { class: "tray-card-result-name" }, def ? def.name : "SKIPPED")
    );
  } else if (cat === "perks") {
    const myPerk = data.players?.[S.username]?.perk;
    const def = myPerk ? PERK_MODS.find(m => m.id === myPerk) : null;
    tc.append(
      el("div", { class: "tray-card-icon" }, def ? def.icon : "⚡"),
      el("div", { class: "tray-card-label" }, "YOUR\nPERK"),
      el("div", { class: "tray-card-result-name" }, def ? def.name : "NONE")
    );
  }
}

// ── PHASE POPUP ───────────────────────────────────────────────
function openPickPopup(phase, data) {
  document.getElementById("pickoverlay")?.remove();
  const overlay = d("pick-overlay"); overlay.id = "pickoverlay"; overlay.dataset.phase = phase;

  if (phase === "perks") {
    buildPerkPickPopup(overlay, data);
  } else {
    buildVotePickPopup(overlay, phase, data);
  }
  document.body.append(overlay);
}

function buildVotePickPopup(overlay, phase, data) {
  const isVisual = phase === "visual";
  const pool = isVisual ?
    (data.modifierPool || []).map(id => VISUAL_MODS.find(m => m.id === id)).filter(Boolean) :
    (data.modifierPool || []).map(id => GAMEPLAY_MODS.find(m => m.id === id)).filter(Boolean);

  overlay.append(
    el("div", { class: "pick-overlay-title" }, isVisual ? "🎨 VISUAL CARD" : "🎮 GAMEPLAY CARD"),
    el("div", { class: "pick-overlay-sub" }, "VOTE TOGETHER — FIRST CONSENSUS WINS")
  );

  const grid = d("pick-popup-grid"); grid.id = "pickpopupgrid";
  pool.forEach(mod => {
    const votes = data.modifierVotes?.[mod.id] ? Object.keys(data.modifierVotes[mod.id]) : [];
    const myVoted = votes.includes(S.username);
    const bothVoted = votes.length >= 2;
    const card = d(`mod-card ${mod.type}-mod${bothVoted ? " both-voted" : ""}${myVoted && !bothVoted ? " single-voted" : ""}`);
    card.id = "modcard-" + mod.id;
    card.append(
      el("span", { class: `mod-type-badge ${mod.type}` }, mod.type.toUpperCase()),
      el("span", { class: "mod-icon" }, mod.icon),
      el("div", { class: "mod-name" }, mod.name),
      el("div", { class: "mod-desc" }, mod.desc)
    );
    const voteBtn = el("button", { class: "mod-vote-btn" + (myVoted ? " voted" : "") + (bothVoted ? " both" : "") },
      bothVoted ? "✓ ACTIVE 💕" : myVoted ? "✓ YOU VOTED" : "VOTE FOR THIS");
    voteBtn.addEventListener("click", () => castPickVote(mod.id, phase));
    const tally = el("div", { class: "mod-vote-tally" + (votes.length > 0 ? " has-votes" : "") }, `${votes.length}/2 picked this`);
    card.append(voteBtn, tally);
    grid.append(card);
  });
  overlay.append(grid);

  // Timer
  const timerRow = d("pick-timer-row"); timerRow.id = "picktimer";
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); svg.setAttribute("class", "pick-timer-svg"); svg.setAttribute("viewBox", "0 0 40 40");
  const bg = document.createElementNS("http://www.w3.org/2000/svg", "circle"); bg.setAttribute("class", "pick-timer-bg"); bg.setAttribute("cx", "20"); bg.setAttribute("cy", "20"); bg.setAttribute("r", "16");
  const fill = document.createElementNS("http://www.w3.org/2000/svg", "circle"); fill.setAttribute("class", "pick-timer-fill"); fill.setAttribute("id", "ptimerfill"); fill.setAttribute("cx", "20"); fill.setAttribute("cy", "20"); fill.setAttribute("r", "16"); fill.setAttribute("stroke-dasharray", "100.53"); fill.setAttribute("stroke-dashoffset", "0");
  svg.append(bg, fill);
  const txt = el("div", { class: "pick-timer-txt", id: "ptimernum" }, "30");
  const lbl = el("div", { style: "font-size:11px;color:var(--mut);letter-spacing:1px" }, "SEC LEFT");
  timerRow.append(svg, txt, lbl);

  // Normal/skip btn
  const normalVotes = data.normalVotes ? Object.keys(data.normalVotes) : [];
  const myNormal = normalVotes.includes(S.username);
  const normBtn = el("button", { class: "pick-normal-btn" + (myNormal ? " voted" : ""), id: "picknormalbtn" });
  normBtn.innerHTML = (myNormal ? "✓ GO NORMAL" : "SKIP — PLAY NORMAL") + ` <span class="norm-tally">${normalVotes.length}/2</span>`;
  normBtn.addEventListener("click", () => castNormalVote(phase));

  overlay.append(timerRow, normBtn);
  startPickTimer(data, phase);
}

function patchPickVotes(data, phase) {
  const pool = phase === "visual" ?
    (data.modifierPool || []).map(id => VISUAL_MODS.find(m => m.id === id)).filter(Boolean) :
    (data.modifierPool || []).map(id => GAMEPLAY_MODS.find(m => m.id === id)).filter(Boolean);
  pool.forEach(mod => {
    const card = document.getElementById("modcard-" + mod.id);
    if (!card) return;
    const votes = data.modifierVotes?.[mod.id] ? Object.keys(data.modifierVotes[mod.id]) : [];
    const myVoted = votes.includes(S.username);
    const bothVoted = votes.length >= 2;
    card.className = `mod-card ${mod.type}-mod${bothVoted ? " both-voted" : ""}${myVoted && !bothVoted ? " single-voted" : ""}`;
    const btn = card.querySelector(".mod-vote-btn");
    if (btn) { btn.textContent = bothVoted ? "✓ ACTIVE 💕" : myVoted ? "✓ YOU VOTED" : "VOTE FOR THIS"; btn.className = "mod-vote-btn" + (myVoted ? " voted" : "") + (bothVoted ? " both" : ""); }
    const tally = card.querySelector(".mod-vote-tally");
    if (tally) { tally.textContent = `${votes.length}/2 picked this`; tally.className = "mod-vote-tally" + (votes.length > 0 ? " has-votes" : ""); }

    if (bothVoted) resolvePickPhase(phase, data, mod.id);
  });
  const normalVotes = data.normalVotes ? Object.keys(data.normalVotes) : [];
  const myNormal = normalVotes.includes(S.username);
  const nb = document.getElementById("picknormalbtn");
  if (nb) {
    nb.innerHTML = (myNormal ? "✓ GO NORMAL" : "SKIP — PLAY NORMAL") + ` <span class="norm-tally">${normalVotes.length}/2</span>`;
    nb.classList.toggle("voted", myNormal);
  }
  if (normalVotes.length >= 2) resolvePickPhase(phase, data, "none");
}

let _resolving = false;
function resolvePickPhase(phase, data, chosenId) {
  if (_resolving) return; _resolving = true;
  lastResolvedPhase = phase;

  clearInterval(pickPhaseTimer);
  const grid = document.getElementById("pickpopupgrid");
  if (grid) {
    grid.querySelectorAll(".mod-card").forEach(c => {
      if (c.id === "modcard-" + chosenId) c.classList.add("fly-back");
      else c.classList.add("fade-out");
    });
  }
  setTimeout(async () => {
    document.getElementById("pickoverlay")?.remove();
    const tc = document.getElementById("traycard-" + phase);
    if (tc) revealTrayCard(tc, phase, { ...data, [phase === "visual" ? "visualPick" : "gameplayPick"]: chosenId });

    if (S.isHost) {
      const nextPhase = phase === "visual" ? "gameplay" : "perks";
      setTimeout(async () => {
        await fbUpdate(`/duels/${S.roomCode}`, {
          pickingPhase: nextPhase,
          [phase === "visual" ? "visualPick" : "gameplayPick"]: chosenId,
          modifierDeadline: Date.now() + 30000
        });
        _resolving = false;
      }, 2000); // 2s transition
    } else {
      setTimeout(() => { _resolving = false; }, 2000);
    }
  }, 450);
}

function startPickTimer(data, phase) {
  if (pickPhaseTimer) clearInterval(pickPhaseTimer);
  const deadline = data.modifierDeadline || Date.now() + 30000;
  pickPhaseTimer = setInterval(async () => {
    if (S.screen !== "modifiers") { clearInterval(pickPhaseTimer); return; }
    const msLeft = deadline - Date.now();
    const left = Math.max(0, Math.ceil(msLeft / 1000));
    const txt = document.getElementById("ptimernum");
    if (txt) txt.textContent = left;
    const fill = document.getElementById("ptimerfill");
    if (fill) fill.setAttribute("stroke-dashoffset", String(100.53 - (Math.max(0, Math.min(1, msLeft / 30000)) * 100.53)));
    const row = document.getElementById("picktimer");
    if (row) row.classList.toggle("hurry", left <= 5);
    if (left <= 0 && S.isHost) {
      clearInterval(pickPhaseTimer);
      // Auto-skip (go normal) when timer hits 0
      const freshData = await fbGet(`/duels/${S.roomCode}`);
      resolvePickPhase(phase, freshData, "none");
    }
  }, 200);
}

async function castPickVote(modId, phase) {
  // Optimistic UI
  const card = document.getElementById("modcard-" + modId);
  if (card) {
    const tDef = [...VISUAL_MODS, ...GAMEPLAY_MODS].find(m => m.id === modId);
    if (tDef) {
      document.querySelectorAll(`.mod-card.${tDef.type}-mod`).forEach(c => {
        c.classList.remove("single-voted");
        const b = c.querySelector(".mod-vote-btn");
        if (b && !b.classList.contains("both")) { b.textContent = "VOTE FOR THIS"; b.className = "mod-vote-btn"; }
      });
    }
    if (!card.classList.contains("both-voted")) {
      card.classList.add("single-voted");
      const btn = card.querySelector(".mod-vote-btn");
      if (btn && !btn.classList.contains("both")) { btn.textContent = "✓ YOU VOTED"; btn.className = "mod-vote-btn voted"; }
    }
  }
  const nb = document.getElementById("picknormalbtn");
  if (nb && nb.classList.contains("voted")) { nb.classList.remove("voted"); nb.innerHTML = `SKIP — PLAY NORMAL <span class="norm-tally">.../2</span>`; }

  const data = await fbGet(`/duels/${S.roomCode}`);
  const pool = data.modifierPool || [];
  // Remove own vote from same-type mods then set this
  const updates = { [`modifierVotes/${modId}/${S.username}`]: true, [`normalVotes/${S.username}`]: null };
  pool.forEach(pid => {
    if (pid === modId) return;
    if (data.modifierVotes?.[pid]?.[S.username]) {
      const pDef = [...VISUAL_MODS, ...GAMEPLAY_MODS].find(m => m.id === pid);
      const tDef = [...VISUAL_MODS, ...GAMEPLAY_MODS].find(m => m.id === modId);
      if (pDef && tDef && pDef.type === tDef.type) updates[`modifierVotes/${pid}/${S.username}`] = null;
    }
  });
  await fbUpdate(`/duels/${S.roomCode}`, updates);
  // DebugBot mirrors
  if (Object.keys(data.players || {}).includes("DebugBot")) {
    setTimeout(async () => {
      await fbUpdate(`/duels/${S.roomCode}/modifierVotes/${modId}`, { DebugBot: true });
    }, 1500);
  }
}

async function castNormalVote(phase) {
  // Optimistic UI
  const nb = document.getElementById("picknormalbtn");
  if (nb) {
    const wasVoted = nb.classList.contains("voted");
    if (wasVoted) {
      nb.classList.remove("voted");
      nb.innerHTML = `SKIP — PLAY NORMAL <span class="norm-tally">.../2</span>`;
    } else {
      nb.classList.add("voted");
      nb.innerHTML = `✓ GO NORMAL <span class="norm-tally">.../2</span>`;
      document.querySelectorAll(".mod-card.single-voted").forEach(c => {
        c.classList.remove("single-voted");
        const b = c.querySelector(".mod-vote-btn");
        if (b && !b.classList.contains("both")) { b.textContent = "VOTE FOR THIS"; b.className = "mod-vote-btn"; }
      });
    }
  }

  const data = await fbGet(`/duels/${S.roomCode}`);
  const existing = data.normalVotes?.[S.username];
  await fbUpdate(`/duels/${S.roomCode}/normalVotes`, { [S.username]: existing ? null : true });
  if (!existing && Object.keys(data.players || {}).includes("DebugBot")) {
    setTimeout(async () => {
      await fbUpdate(`/duels/${S.roomCode}/normalVotes`, { DebugBot: true });
    }, 1500);
  }
}

// ── PERKS POPUP ───────────────────────────────────────────────
function buildPerkPickPopup(overlay, data) {
  const myPerk = data.players?.[S.username]?.perk;
  const myPerkReady = !!data.players?.[S.username]?.perkReady;

  overlay.append(
    el("div", { class: "pick-overlay-title" }, "⚡ YOUR PERK"),
    el("div", { class: "pick-overlay-sub" }, "CHOOSE A MYSTERY CARD — YOUR FATE AWAITS")
  );

  if (myPerkReady) {
    // Already chose, waiting for opponent
    const def = myPerk ? PERK_MODS.find(m => m.id === myPerk) : null;
    overlay.append(
      el("div", { class: "pick-waiting-label" }, `✓ You got: ${def ? def.icon + " " + def.name : "a perk!"}`),
      el("div", { class: "pick-waiting-label", style: "opacity:0.5" }, "⏳ Waiting for opponent...")
    );
    return;
  }

  const grid = d("pick-popup-grid"); grid.id = "perkpickgrid";
  // 3 mystery cards
  for (let i = 0; i < 3; i++) {
    const mc = el("div", { class: "mystery-card" });
    mc.append(
      el("div", { class: "mystery-card-q" }, "🂠"),
      el("div", { class: "mystery-card-hint" }, "TAP TO REVEAL")
    );
    mc.addEventListener("click", () => chooseMysteryCard(mc, grid, data));
    grid.append(mc);
  }
  overlay.append(grid);
}

async function chooseMysteryCard(mc, grid, data) {
  if (mc.classList.contains("shaking") || mc.classList.contains("revealed")) return;
  // Disable all cards
  grid.querySelectorAll(".mystery-card").forEach(c => c.style.pointerEvents = "none");
  mc.classList.add("shaking");
  // Compute perk from seeded pool
  const perks = pickPerks(S.roomCode, S.username, S.round);
  const chosen = perks[Math.floor(Math.random() * perks.length)];
  await new Promise(r => setTimeout(r, 2800));
  mc.classList.remove("shaking");
  mc.innerHTML = "";
  mc.classList.add("revealed");
  mc.append(
    el("span", { class: "mod-icon" }, chosen.icon),
    el("div", { class: "mod-name" }, chosen.name),
    el("div", { class: "mod-desc-sm" }, chosen.desc)
  );
  // Fade unchosen
  grid.querySelectorAll(".mystery-card:not(.revealed)").forEach(c => c.classList.add("fade-out"));
  // Write to Firebase
  await fbUpdate(`/duels/${S.roomCode}/players/${S.username}`, { perk: chosen.id, perkReady: true });

  if (Object.keys(data.players || {}).includes("DebugBot")) {
    const botPerks = pickPerks(S.roomCode, "DebugBot", S.round);
    const botChosen = botPerks[Math.floor(Math.random() * botPerks.length)];
    await fbUpdate(`/duels/${S.roomCode}/players/DebugBot`, { perk: botChosen.id, perkReady: true });
  }

  // Show waiting label (will just be skipped if allReady triggers removal)
  setTimeout(() => {
    const overlay = document.getElementById("pickoverlay");
    if (!overlay) return;
    overlay.innerHTML = "";
    overlay.append(
      el("div", { class: "pick-overlay-title" }, "⚡ PERK LOCKED IN!"),
      el("div", { class: "pick-waiting-label" }, `You got: ${chosen.icon} ${chosen.name}`),
      el("div", { class: "pick-waiting-label", style: "opacity:0.5" }, "⏳ Waiting for opponent...")
    );
  }, 800);
}

let _perkCountdownQueued = false;
function patchPerkWaiting(data) {
  if (_perkCountdownQueued) return;
  const players = Object.keys(data.players || {});
  const allReady = players.length === 2 && players.every(p => data.players[p]?.perkReady);
  if (allReady && data.pickingPhase !== "countdown") {
    _perkCountdownQueued = true;
    _resolving = true; // Lock to prevent syncPickPhase from reopening popup
    lastResolvedPhase = "perks";

    // Fade and remove overlay so players can admire the tray
    const overlay = document.getElementById("pickoverlay");
    if (overlay) {
      overlay.style.animation = "overlayFadeOut 0.4s ease forwards";
      setTimeout(() => overlay.remove(), 400);
    }

    // Reveal perk tray card immediately
    const tc = document.getElementById("traycard-perks");
    if (tc && !tc.classList.contains("done-phase")) revealTrayCard(tc, "perks", data);

    if (S.isHost) {
      setTimeout(() => {
        fbUpdate(`/duels/${S.roomCode}`, { pickingPhase: "countdown" });
        _resolving = false;
      }, 3000); // 3 seconds to view the tray
    } else {
      setTimeout(() => { _resolving = false; }, 3000);
    }
  }
}

// ── COUNTDOWN ─────────────────────────────────────────────────
let _pickCountdownActive = false;
function startPickCountdown() {
  if (_pickCountdownActive) return;
  _pickCountdownActive = true;
  document.getElementById("pickoverlay")?.remove();
  let n = 5;
  const show = () => {
    if (S.screen !== "modifiers") { _pickCountdownActive = false; return; }
    document.querySelector(".countdown-overlay")?.remove();
    const ov = d("countdown-overlay");
    ov.append(
      el("div", { class: "countdown-num" }, n === 0 ? "GO!" : String(n)),
      el("div", { class: "countdown-label" }, n === 0 ? "GAME STARTS" : "STARTING IN")
    );
    document.body.append(ov);
    if (n <= 0) {
      setTimeout(() => {
        ov.remove();
        // DO NOT set _pickCountdownActive=false here, it causes race condition loop!
        if (S.isHost) startFromModifiers();
      }, 600);
      return;
    }
    n--; setTimeout(show, 1000);
  };
  show();
}

// Kept for compat — called by host after countdown
async function startFromModifiers() {
  if (!S.isHost) return;
  const data = await fbGet(`/duels/${S.roomCode}`);
  const players = Object.keys(data.players || {});
  const first = players[Math.floor(Math.random() * players.length)];

  // Collect active mods from the sequential picks
  const active = [];
  if (data.visualPick && data.visualPick !== "none") active.push(data.visualPick);
  if (data.gameplayPick && data.gameplayPick !== "none") active.push(data.gameplayPick);

  // Build peek ranges if peek active
  let peekRanges = null;
  if (active.includes("peek")) {
    peekRanges = {};
    players.forEach(p => {
      const opp = players.find(q => q !== p);
      const oppNum = data.players[opp].number;
      peekRanges[p] = buildPeekRanges(oppNum, data.min, data.max);
    });
  }

  const telepathyMode = active.includes("telepathy");

  await fbUpdate(`/duels/${S.roomCode}`, {
    status: "playing",
    turn: telepathyMode ? null : first,
    guesses: null, taunts: null, reactions: null, typing: null,
    activeModifiers: active.length > 0 ? active.reduce((acc, id, i) => { acc[i] = id; return acc; }, {}) : {},
    peekRanges: peekRanges || null,
    pickingPhase: null,
    visualPick: null,
    gameplayPick: null,
    normalVotes: null,
    modifierVotes: null,
  });
}


function buildPeekRanges(target, min, max) {
  const totalSpan = max - min + 1;
  // Span width: 10% of total span, at least 1, at most 12
  const span = Math.max(1, Math.min(12, Math.floor(totalSpan * 0.1)));
  const halfSpan = Math.floor(span / 2);
  
  const correctLo = Math.max(min, target - halfSpan);
  const correctHi = Math.min(max, target + halfSpan);
  
  const wrongRanges = [];
  let attempts = 0;
  
  // Attempt 1: Strict non-overlapping with correct range and other wrong ranges (with 2 unit gap)
  while (wrongRanges.length < 2 && attempts < 100) {
    attempts++;
    const center = min + Math.floor(Math.random() * (max - min + 1));
    const lo = Math.max(min, center - halfSpan);
    const hi = Math.min(max, center + halfSpan);
    
    // Must not overlap correct range
    if (hi < correctLo - 2 || lo > correctHi + 2) {
      // Must not overlap previously added wrong range
      const overlaps = wrongRanges.some(r => !(hi < r.lo - 2 || lo > r.hi + 2));
      if (!overlaps) wrongRanges.push({ lo, hi, correct: false });
    }
  }
  
  // Attempt 2: Relaxed (no gap, just non-overlapping)
  if (wrongRanges.length < 2) {
    attempts = 0;
    while (wrongRanges.length < 2 && attempts < 100) {
      attempts++;
      const center = min + Math.floor(Math.random() * (max - min + 1));
      const lo = Math.max(min, center - halfSpan);
      const hi = Math.min(max, center + halfSpan);
      
      if (hi < correctLo || lo > correctHi) {
        const overlaps = wrongRanges.some(r => !(hi < r.lo || lo > r.hi));
        if (!overlaps) wrongRanges.push({ lo, hi, correct: false });
      }
    }
  }
  
  // Attempt 3: Fallback (allow overlap, but MUST NOT contain the target number)
  if (wrongRanges.length < 2) {
    attempts = 0;
    while (wrongRanges.length < 2 && attempts < 100) {
      attempts++;
      const center = min + Math.floor(Math.random() * (max - min + 1));
      const lo = Math.max(min, center - halfSpan);
      const hi = Math.min(max, center + halfSpan);
      
      // Target must not be in the wrong range
      if (target < lo || target > hi) {
        // Ensure not a duplicate range of the correct one or previous wrong ones
        const isDuplicate = (lo === correctLo && hi === correctHi) || wrongRanges.some(r => r.lo === lo && r.hi === hi);
        if (!isDuplicate) wrongRanges.push({ lo, hi, correct: false });
      }
    }
  }
  
  // If we STILL don't have 2 wrong ranges (e.g. total span is 1 or 2), just generate dummy ranges outside of target
  while (wrongRanges.length < 2) {
    const dummyLo = target > min ? min : max;
    const dummyHi = target > min ? min : max;
    wrongRanges.push({ lo: dummyLo, hi: dummyHi, correct: false });
  }

  // Shuffle the 3 ranges
  const all = [{ lo: correctLo, hi: correctHi, correct: true }, ...wrongRanges];
  for (let i = all.length - 1; i > 0; i--) { 
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]]; 
  }
  return all;
}

// ── GAME ─────────────────────────────────────────────────────
function renderGame() {
  const screen = d("screen");
  const data = S.roomData || {};
  const players = Object.keys(data.players || {});
  const me = S.username;
  const opp = players.find(p => p !== me) || "Opponent";
  const telepathy = hasMod(data, "telepathy");
  const myTurn = telepathy ? true : data.turn === me;

  screen.append(d("gh",
    el("div", { class: "logo", style: "font-size:24px;letter-spacing:4px" }, "GUESSR 💕"),
    d("gh-right",
      el("button", {
        id: "sound-toggle", class: "sound-toggle", title: soundEnabled ? "Mute sounds" : "Unmute sounds", onClick: () => {
          soundEnabled = !soundEnabled;
          const btn = document.getElementById("sound-toggle");
          if (btn) btn.textContent = soundEnabled ? "🔊" : "🔇";
        }
      }, soundEnabled ? "🔊" : "🔇"),
      el("div", { id: "ping-display", class: "ping-display" }),
      el("div", { class: "rnd" }, `ROUND ${S.round}`)
    )
  ));

  // Active mod pills
  const mods = getActiveModifiers(data);
  if (mods.length > 0) {
    const strip = d("active-mods-strip");
    mods.forEach(id => {
      const def = [...VISUAL_MODS, ...GAMEPLAY_MODS].find(m => m.id === id);
      if (def) strip.append(d("active-mod-pill", el("span", {}, def.icon + " " + def.name)));
    });
    screen.append(strip);
  }

  // AFK detection
  const now = Date.now();
  const oppOnline = data.players?.[opp]?.online || 0;
  if (oppOnline) {
    const gap = now - oppOnline;
    if (gap > 720000) screen.append(d("dc-banner tier2", `👻 ${opp} is probably AFK — sit tight`));
    else if (gap > 240000) screen.append(d("dc-banner tier1", `⏳ ${opp} may be AFK`));
  }

  // Fire banner
  const myStreak = parseInt(data.players?.[me]?.streak) || 0;
  if (myStreak >= 2) screen.append(d("fire-banner", `🔥 YOU'RE ON FIRE — ${myStreak} ROUND STREAK`));

  // Peek ranges — button/popup, unlimited re-clicks
  if (hasMod(data, "peek") && data.peekRanges?.[me]) {
    const peekBtn = el("button", { class: "peek-action-btn", id: "peekbtn" }, "👁️ TAP TO PEEK — RANGE HINT");
    peekBtn.addEventListener("click", () => {
      // Remove existing overlay if already open
      document.querySelector(".peek-overlay")?.remove();
      const ranges = data.peekRanges[me];
      const overlay = d("peek-overlay");
      const box = d("peek-box");
      box.append(el("div", { class: "peek-box-title" }, "👁️ PEEK — ONE RANGE CONTAINS THE NUMBER"));
      const row = d("peek-ranges-row");
      ranges.forEach(r => row.append(el("span", { class: "peek-range-pill contains" }, `${r.lo}–${r.hi}`)));
      box.append(row);
      const closeBtn = el("button", { class: "peek-close-btn" }, "GOT IT ✔");
      closeBtn.addEventListener("click", () => overlay.remove());
      box.append(closeBtn);
      overlay.append(box);
      document.getElementById("app").append(overlay);
    });
    screen.append(peekBtn);
  }

  // Comeback mechanic
  const oppScore = data.players?.[opp]?.score || 0;
  const myScore = data.players?.[me]?.score || 0;
  if (oppScore - myScore >= 2 && !hasUsedComeback && myTurn) {
    const cbBtn = el("button", { class: "peek-action-btn", style: "border-color:#4ade80;color:#4ade80;background:rgba(74,222,128,0.15)" }, "🎁 COMEBACK: HALVE THE RANGE (50/50)");
    cbBtn.addEventListener("click", () => {
      if (hasUsedComeback) return;
      hasUsedComeback = true;
      cbBtn.textContent = "🎁 COMEBACK USED";
      cbBtn.classList.add("used");
      const { lo, hi } = computeRange(data, me, opp, false);
      const mid = Math.floor((lo + hi) / 2);
      const input = document.getElementById("gi");
      if (input) {
        input.value = String(mid);
        submitGuess();
      }
    });
    screen.append(cbBtn);
  }

  // Duel panels
  const blind = hasMod(data, "blind");
  const scrambledForBar = hasMod(data, "scrambled");
  const duel = d("duel");
  [me, opp].forEach((p, i) => {
    const isMe = i === 0;
    const pTurn = telepathy ? false : isMe ? myTurn : !myTurn;
    const pScore = (data.players?.[p]?.score) || 0;
    const pStreak = parseInt(data.players?.[p]?.streak) || 0;
    const side = d("pside" + (pTurn ? " active" : ""));
    side.id = isMe ? "myside" : "oppside";
    // Activity indicator for opponent
    const nowTs = Date.now();
    const pOnline = data.players?.[p]?.online || 0;
    const pGap = nowTs - pOnline;
    const actDot = el("span", { class: `act-dot ${pGap < 30000 ? "act-green" : pGap < 120000 ? "act-yellow" : "act-red"}` });
    const nameRow = d("pname-row", actDot, el("span", {}, p));
    side.append(
      nameRow,
      el("div", { class: "pturn", id: isMe ? "mypturn" : "oppturn" }, telepathy ? "" : ""),
      el("div", { class: "pnum", id: isMe ? "mypnum" : "opppnum" }, isMe ? `My #: ${data.players?.[me]?.number || "?"}` : "Their #: ???"),
    );
    if (!blind) {
      side.append(
        el("div", { class: "pranges", id: isMe ? "myrange" : "opprange" }, ""),
        buildRangeBar(isMe ? "myrangebar" : "opprangebar", data, p, isMe ? opp : me, data.min, data.max, scrambledForBar)
      );
    }
    side.append(
      el("div", { class: "pguesses", id: isMe ? "myguesscount" : "oppguesscount" }, ""),
      el("div", { class: "pscore" }, `Wins: ${pScore}`)
    );
    if (pStreak >= 2) side.append(el("div", { class: "pstreak-badge" }, `🔥 ${pStreak} STREAK`));
    duel.append(side);
  });
  screen.append(duel);

  // Win prob bar
  const probWrap = d("prob-bar-wrap"); probWrap.id = "probwrap";
  const labelRow = d("prob-bar-label-row");
  labelRow.append(el("span", {}, "← " + me), el("span", {}, opp + " →"));
  const track = d("prob-bar-track");
  const meBar = d("prob-bar-me"); meBar.id = "probme"; meBar.style.width = "50%";
  track.append(meBar, d("prob-bar-divider"));
  const pct = d("prob-bar-pct"); pct.id = "probpct"; pct.textContent = "50% · 50%";
  probWrap.append(labelRow, track, pct);
  screen.append(probWrap);

  screen.append(el("div", { class: "typing-indicator", id: "typingindicator" }, ""));

  // Guess card
  const gc = d("gcard" + (myTurn ? " my-turn" : ""));
  gc.id = "guesscard";
  renderGuessCard(gc, data, me, opp, myTurn);
  screen.append(gc);

  // Chat panel (hidden if secret agent)
  if (!hasMod(data, "secret")) {
    screen.append(buildChatPanel(data, me, opp));
  } else {
    screen.append(d("card", el("div", { style: "text-align:center;color:var(--mut);font-size:12px;padding:8px;letter-spacing:1px;font-style:italic" }, "🤫 Secret Agent active — no communication allowed")));
  }

  patchGame(data);
  return screen;
}

function buildChatPanel(data, me, opp) {
  const panel = d("chat-panel"); panel.style.position = "relative";
  const header = d("chat-header"); header.append(el("span", {}, "💬 CHAT"));
  const histBtn = el("button", { class: "chat-hist-btn" }, "📋 MY GUESSES");
  const histPop = d("hist-pop"); histPop.id = "histpop";
  histBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (histPop.classList.contains("open")) { histPop.classList.remove("open"); return; }
    histPop.classList.add("open"); renderHistPop(histPop, S.roomData || data, me);
    document.addEventListener("click", () => histPop.classList.remove("open"), { once: true });
  });
  header.append(histBtn); panel.append(header);
  const feed = d("chat-feed"); feed.id = "chatfeed"; panel.append(feed);
  const eb = d("emoji-bar");
  EMOJI_LIST.forEach(em => {
    const btn = el("button", { class: "emoji-btn" }); btn.textContent = em;
    btn.addEventListener("click", (evt) => sendReaction(em, evt)); eb.append(btn);
  });
  panel.append(eb);
  const inputRow = d("chat-input-row"); inputRow.style.position = "relative";
  const quickBtn = el("button", { class: "chat-quick-btn", title: "Quick taunts" }, "⚡");
  const ti = el("input", { type: "text", placeholder: "say something...", maxlength: "60", id: "tauntinput", autocomplete: "off", class: "chat-input" });
  const sendBtn = el("button", { class: "chat-send" }, "SEND");
  const doSend = (evt) => {
    const text = ti.value.trim(); if (!text) return;
    ti.value = "";
    floatEmoji("💬💬", 60 + Math.random() * 20, 50 + Math.random() * 20);
    if (document.body.classList.contains("mod-glitter") && evt) triggerGlitter(evt.clientX, evt.clientY);
    if (soundEnabled && window.SFX) SFX.chatSend();
    // Optimistic Chat UI
    const feed = document.getElementById("chatfeed");
    if (feed) {
      const placeholder = feed.querySelector(".chat-system");
      if (placeholder) placeholder.remove();
      const wrap = d("chat-msg mine"); wrap.append(d("chat-bubble", text));
      feed.append(wrap); feed.scrollTop = feed.scrollHeight;
      lastChatCount++; // Ignore the database echo
    }
    fbPush(`/duels/${S.roomCode}/taunts`, { player: S.username, text, ts: Date.now() });
  };
  ti.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); doSend(e); } });
  ti.addEventListener("input", () => broadcastTyping(true));
  ti.addEventListener("blur", () => broadcastTyping(false));
  sendBtn.addEventListener("click", doSend);
  const taunPop = d("taunt-pop"); taunPop.style.position = "absolute";
  TAUNT_PRESETS.forEach(t => {
    const btn = el("button", { class: "taunt-preset" }); btn.textContent = t;
    btn.addEventListener("click", () => {
      floatEmoji("💬💬", 60 + Math.random() * 20, 50 + Math.random() * 20);
      if (soundEnabled && window.SFX) SFX.chatSend();
      // Optimistic Preset UI
      const feed = document.getElementById("chatfeed");
      if (feed) {
        const placeholder = feed.querySelector(".chat-system");
        if (placeholder) placeholder.remove();
        const wrap = d("chat-msg mine"); wrap.append(d("chat-bubble", t));
        feed.append(wrap); feed.scrollTop = feed.scrollHeight;
        lastChatCount++;
      }
      fbPush(`/duels/${S.roomCode}/taunts`, { player: S.username, text: t, ts: Date.now() });
      taunPop.classList.remove("open");
    });
    taunPop.append(btn);
  });
  quickBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (taunPop.classList.contains("open")) { taunPop.classList.remove("open"); return; }
    taunPop.classList.add("open");
    document.addEventListener("click", () => taunPop.classList.remove("open"), { once: true });
  });
  inputRow.append(taunPop, histPop, quickBtn, ti, sendBtn);
  panel.append(inputRow);
  return panel;
}

function renderHistPop(histPop, data, me) {
  histPop.innerHTML = "";
  const allG = data.guesses ? Object.values(data.guesses) : [];
  const myG = allG.filter(g => g.player === me).sort((a, b) => a.ts - b.ts);
  if (!myG.length) { histPop.append(el("div", { class: "hist-empty" }, "No guesses yet 💕")); return; }
  myG.forEach(g => {
    const cls = g.result === "higher" ? "h" : g.result === "lower" ? "l" : "c";
    const raw = g.result;
    const displayResult = g.result === "correct" ? "correct" : g.result;
    const row = d("hist-entry " + cls);
    row.append(
      el("span", { class: "hist-entry-num" }, String(g.guess)),
      el("span", { class: "hist-entry-ico" }, raw === "higher" ? "👆" : raw === "lower" ? "👇" : "💕"),
      el("span", { class: "hist-entry-who" }, displayResult.toUpperCase())
    );
    histPop.append(row);
  });
}

function renderGuessCard(gc, data, me, opp, myTurn) {
  gc.innerHTML = "";
  gc.className = "gcard" + (myTurn ? " my-turn" : "");
  const telepathy = hasMod(data, "telepathy");
  const scrambled = hasMod(data, "scrambled");
  const blind = hasMod(data, "blind");
  const hotcold = hasMod(data, "hotcold");

  if (myTurn || telepathy) {
    const { lo, hi } = computeRange(data, me, opp, scrambled);
    const label = hotcold ? "YOUR TURN — FEEL THE HEAT" : "YOUR TURN — GUESS THEIR NUMBER";
    gc.append(el("div", { class: "gtitle" }, label));
    const isCensored = data.players?.[me]?.sabotage?.type === "censor";
    if (!blind) gc.append(el("div", { class: "gtarget", id: "grange" }, isCensored ? `Possible: ???–???` : `Possible: ${lo}–${hi}`));
    else gc.append(el("div", { class: "gtarget blind-mode", id: "grange" }, "🙈 Blind mode — no range shown"));
    const ga = d("ga");
    const gi = el("input", { type: "number", placeholder: blind ? "Enter guess..." : (isCensored ? "???" : `${lo}–${hi}`), id: "gi", min: String(lo), max: String(hi), autocomplete: "off" });
    gi.addEventListener("keydown", e => { if (e.key === "Enter") submitGuess(); });
    gi.addEventListener("input", () => broadcastTyping(true));
    gi.addEventListener("blur", () => broadcastTyping(false));
    const gbtn = el("button", { class: "gbtn", id: "gbtn" }, "GUESS");
    gbtn.addEventListener("click", submitGuess);
    if (telepathy && telepathyCooldown) gbtn.disabled = true;
    ga.append(gi, gbtn); gc.append(ga);
    // Last guess display
    const lgEl = el("div", { id: "last-guess-el", class: "last-guess-info", style: "display:none" });
    gc.append(lgEl);
    if (lastGuessInfo) {
      lgEl.textContent = lastGuessInfo.hotLabel ? `Last: ${lastGuessInfo.guess} — ${lastGuessInfo.hotLabel}` : `Last: ${lastGuessInfo.guess} — ${lastGuessInfo.result === "higher" ? "↑ Higher" : "↓ Lower"}`;
      lgEl.style.display = "block";
    }
    if (telepathy) {
      const cdLabel = el("div", { class: "tele-cd" + (telepathyCooldown ? " active" : ""), id: "telecd" }, telepathyCooldown ? "⏳ 3s cooldown..." : "both guessing simultaneously 🫶");
      gc.append(cdLabel);
    }
    setTimeout(() => { const g = document.getElementById("gi"); if (g) g.focus(); }, 80);
  } else {
    gc.append(el("div", { class: "waiting-label" }, "Opponent's turn — sit tight... 💭"));
  }

  // Perk Button
  const myPerk = data.players?.[me]?.perk;
  const perkUsed = data.players?.[me]?.perkUsed;
  if (myPerk) {
    const pDef = PERK_MODS.find(m => m.id === myPerk);
    if (pDef) {
      const perkBtn = el("button", { class: "perk-action-btn", id: "perkbtn", title: pDef.desc }, perkUsed ? "⚡ PERK USED" : `⚡ USE ${pDef.name.toUpperCase()}`);
      if (perkUsed) perkBtn.disabled = true;
      else perkBtn.addEventListener("click", () => triggerPerk(myPerk));
      gc.append(perkBtn);
    }
  }

  // Oracle Hint
  const perkRes = data.players?.[me]?.perkResult;
  if (perkRes) {
    gc.append(el("div", { id: "live-perk-res", style: "color:#4ade80;font-size:12px;margin-top:8px;text-align:center;border:1px solid rgba(74,222,128,0.3);padding:6px;border-radius:6px;background:rgba(74,222,128,0.1);letter-spacing:1px;" }, perkRes));
  }
}

async function triggerPerk(perkId) {
  const data = await fbGet(`/duels/${S.roomCode}`);
  const me = S.username;
  if (data.players?.[me]?.perkUsed) return;

  const opp = Object.keys(data.players || {}).find(p => p !== me) || "Opponent";
  const myTurn = data.turn === me;
  const telepathy = hasMod(data, "telepathy");

  if (perkId === "thief" && myTurn && !telepathy) {
    const btn = document.getElementById("perkbtn");
    if (btn) {
      const old = btn.textContent;
      btn.textContent = "ALREADY YOUR TURN!";
      setTimeout(() => btn.textContent = old, 1500);
    }
    return;
  }

  // Hint perks require it to be your turn
  const hintPerks = ["doubletap","oracle","lastdigit","sniper","safetynet","digitcheck","distance","half","magnet","secondchance"];
  if (hintPerks.includes(perkId) && !myTurn && !telepathy) {
    const btn = document.getElementById("perkbtn");
    if (btn) {
      const old = btn.textContent;
      btn.textContent = "WAIT FOR YOUR TURN!";
      setTimeout(() => btn.textContent = old, 1500);
    }
    return;
  }

  const btn = document.getElementById("perkbtn");
  if (btn) { btn.disabled = true; btn.textContent = "⚡ PERK USED"; }

  const pDef = PERK_MODS.find(m => m.id === perkId);
  const isSabotage = pDef?.type === "sabotage";
  const msg = pDef ? pDef.eventDesc.replace("[PLAYER]", me) : `⚠️ ${me} USED A PERK!`;

  const updates = {
    [`players/${me}/perkUsed`]: true,
    activeEvent: { perk: perkId, player: me, ts: Date.now(), msg: msg, type: pDef?.type || "hint" }
  };

  // ── HINT PERKS ──
  if (perkId === "thief") {
    if (!telepathy) updates.turn = me;
  } else if (perkId === "oracle") {
    const oppNum = data.players[opp].number;
    updates[`players/${me}/perkResult`] = `🔮 THE ORACLE SAYS: ${oppNum % 2 === 0 ? "EVEN" : "ODD"}`;
  } else if (perkId === "doubletap") {
    updates[`players/${me}/doubleTapActive`] = true;
  } else if (perkId === "lastdigit") {
    const oppNum = data.players[opp].number;
    updates[`players/${me}/perkResult`] = `🔢 LAST DIGIT: The number ends in ...${String(oppNum).slice(-1)}`;
  } else if (perkId === "sniper") {
    updates[`players/${me}/sniperActive`] = true;
    showPerkToast("🎯 SNIPER ARMED — Win instantly if within 3!");
  } else if (perkId === "safetynet") {
    updates[`players/${me}/safetyNetActive`] = true;
    showPerkToast("🕸️ SAFETY NET ARMED — Bad guess? Turn protected!");
  } else if (perkId === "digitcheck") {
    const oppNum = data.players[opp].number;
    const digits = [...new Set(String(oppNum).split(""))];
    const revealed = digits[Math.floor(Math.random() * digits.length)];
    updates[`players/${me}/perkResult`] = `🔍 DIGIT CHECK: The number contains the digit ${revealed}`;
  } else if (perkId === "distance") {
    const allPast = data.guesses ? Object.values(data.guesses) : [];
    const myLast = allPast.filter(g => g.player === me).sort((a,b) => b.ts - a.ts)[0];
    if (myLast) {
      const dist = Math.abs(myLast.guess - data.players[opp].number);
      const band = Math.ceil(dist / 10) * 10;
      updates[`players/${me}/perkResult`] = `📏 BALLPARK: You are roughly ${Math.max(0, band - 10)}–${band} away`;
    } else {
      updates[`players/${me}/perkResult`] = `📏 BALLPARK: Make a guess first to use this!`;
    }
  } else if (perkId === "half") {
    const { lo, hi } = computeRange(data, me, opp, hasMod(data, "scrambled"));
    const mid = Math.floor((lo + hi) / 2);
    const oppNum = data.players[opp].number;
    if (oppNum > mid) {
      updates[`players/${me}/halfLo`] = mid + 1;
    } else {
      updates[`players/${me}/halfHi`] = mid;
    }
    showPerkToast("🌓 50/50 — Half the range eliminated!");
  } else if (perkId === "magnet") {
    const allPast = data.guesses ? Object.values(data.guesses) : [];
    const myLast = allPast.filter(g => g.player === me).sort((a,b) => b.ts - a.ts)[0];
    if (myLast) {
      const oppNum = data.players[opp].number;
      const pulled = Math.round(myLast.guess + (oppNum - myLast.guess) * 0.15);
      updates[`players/${me}/perkResult`] = `🧲 MAGNET: Your ${myLast.guess} was pulled → ${pulled}`;
      updates[`players/${me}/magnetSuggest`] = pulled;
    } else {
      updates[`players/${me}/perkResult`] = `🧲 MAGNET: Make a guess first!`;
    }
  } else if (perkId === "secondchance") {
    updates[`players/${me}/secondChanceActive`] = true;
    showPerkToast("♻️ SECOND CHANCE ARMED — Next wrong guess won't lose your turn!");

  // ── SABOTAGE PERKS — target = opponent ──
  } else if (perkId === "ink") {
    updates[`players/${opp}/sabotage`] = { type: "ink", ts: Date.now() };
  } else if (perkId === "censor") {
    updates[`players/${opp}/sabotage`] = { type: "censor", ts: Date.now() };
  } else if (perkId === "earthquake") {
    updates[`players/${opp}/sabotage`] = { type: "earthquake", ts: Date.now() };
  } else if (perkId === "fakeout") {
    // Arms the fake out — fires when the opponent next guesses
    updates[`players/${opp}/fakeOutArmed`] = true;
  } else if (perkId === "flip") {
    updates[`players/${opp}/sabotage`] = { type: "flip", ts: Date.now() };
  } else if (perkId === "blackout") {
    updates[`players/${opp}/sabotage`] = { type: "blackout", ts: Date.now() };
  } else if (perkId === "bomb") {
    updates[`players/${opp}/sabotage`] = { type: "bomb", ts: Date.now() };
  } else if (perkId === "glitch") {
    updates[`players/${opp}/sabotage`] = { type: "glitch", ts: Date.now() };
  }

  await fbUpdate(`/duels/${S.roomCode}`, updates);
}

function showPerkToast(msg) {
  const existing = document.querySelector(".perk-hint-toast");
  if (existing) existing.remove();
  const t = el("div", { class: "perk-hint-toast" }, msg);
  document.body.append(t);
  setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 500); }, 3000);
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

async function broadcastTyping(isTyping) {
  if (isTyping === lastTypingState) return;
  lastTypingState = isTyping;
  if (typingTimer) clearTimeout(typingTimer);
  await fbUpdate(`/duels/${S.roomCode}`, { [`typing/${S.username}`]: isTyping ? Date.now() : null });
  if (isTyping) typingTimer = setTimeout(() => broadcastTyping(false), 4000);
}

let lastProcessedEventTs = 0;
function patchGame(data) {
  if (!data) return;
  const players = Object.keys(data.players || {});
  const me = S.username;
  const opp = players.find(p => p !== me) || "Opponent";
  const telepathy = hasMod(data, "telepathy");
  const myTurn = telepathy ? true : data.turn === me;

  if (data.activeEvent && data.activeEvent.ts > lastProcessedEventTs) {
    lastProcessedEventTs = data.activeEvent.ts;
    const ev = data.activeEvent;
    const isSabotage = ev.type === "sabotage";
    const popup = el("div", { class: "global-perk-popup" + (isSabotage ? " sabotage" : "") });
    popup.append(el("div", { class: "gpp-title" }, isSabotage ? "😈 SABOTAGE!" : "⚡ PERK USED"));
    popup.append(el("div", { class: "gpp-desc" }, ev.msg));
    document.body.append(popup);
    if (soundEnabled && window.SFX) isSabotage ? SFX.blocked() : SFX.click();
    setTimeout(() => popup.remove(), 4000);

    if (ev.perk === "thief" && ev.player !== me) {
      document.body.classList.add("bw-pulsing");
    }
  }

  if (myTurn) {
    document.body.classList.remove("bw-pulsing");
  }

  // ── SABOTAGE VFX RECEIVER ──
  const mySab = data.players?.[me]?.sabotage;
  const lastSabTs = window._lastSabotageTs || 0;
  if (mySab && mySab.ts > lastSabTs) {
    window._lastSabotageTs = mySab.ts;
    applySabotage(mySab.type);
  }

  // ── FAKE OUT RECEIVER (fires on submit) ──
  // Handled inside submitGuess when fakeOutArmed detected

  const mypt = document.getElementById("mypturn"), oppt = document.getElementById("oppturn");
  const myside = document.getElementById("myside"), oppside = document.getElementById("oppside");
  const wasMine = !!document.getElementById("gi");
  if (!telepathy) {
    if (mypt) mypt.textContent = myTurn ? "← YOUR TURN" : "";
    if (oppt) oppt.textContent = myTurn ? "" : "← THEIR TURN";
    if (myside) myside.className = "pside" + (myTurn ? " active" : "");
    if (oppside) oppside.className = "pside" + (myTurn ? " active" : "");
    if (myTurn && !wasMine) SFX.yourTurn();
  }

  const mypnum = document.getElementById("mypnum"), opppnum = document.getElementById("opppnum");
  if (mypnum) mypnum.textContent = `My #: ${data.players?.[me]?.number || "?"}`;
  if (opppnum) opppnum.textContent = "Their #: ???";

  // AFK
  const now = Date.now();
  const oppOnline = data.players?.[opp]?.online || 0;
  const existingBanner = document.querySelector(".dc-banner");
  if (oppOnline) {
    const gap = now - oppOnline;
    if (gap > 720000) {
      if (!existingBanner || !existingBanner.classList.contains("tier2")) {
        if (existingBanner) existingBanner.remove();
        const banner = d("dc-banner tier2", `👻 ${opp} is probably AFK — sit tight`);
        document.querySelector(".duel")?.parentNode.insertBefore(banner, document.querySelector(".duel"));
      }
    } else if (gap > 240000) {
      if (!existingBanner) {
        const banner = d("dc-banner tier1", `⏳ ${opp} may be AFK`);
        document.querySelector(".duel")?.parentNode.insertBefore(banner, document.querySelector(".duel"));
      }
    } else if (existingBanner) existingBanner.remove();
  } else if (existingBanner) existingBanner.remove();

  // Typing
  const typingEl = document.getElementById("typingindicator");
  if (typingEl) {
    const oppTypingTs = data.typing?.[opp];
    const oppIsTyping = oppTypingTs && (Date.now() - oppTypingTs) < 5000;
    typingEl.innerHTML = oppIsTyping ? `<span style="color:var(--rose)">${opp} is typing</span> <span class="typing-dots"><span>•</span><span>•</span><span>•</span></span>` : "";
  }

  // Range bars
  const scrambled = hasMod(data, "scrambled");
  ["my", "opp"].forEach(who => {
    const bar = document.getElementById(who + "rangebar");
    if (!bar) return;
    const guesser = who === "my" ? me : opp, target = who === "my" ? opp : me;
    const { lo, hi } = computeRange(data, guesser, target, scrambled);
    const minVal = data.min !== undefined && data.min !== null ? Number(data.min) : 1;
    const maxVal = data.max !== undefined && data.max !== null ? Number(data.max) : 100;
    const total = maxVal - minVal;
    const pct = total > 0 ? Math.max(5, Math.round(((hi - lo) / total) * 100)) : 100;
    const fill = bar.querySelector(".range-bar-fill"), label = bar.querySelector(".range-label");
    const isCensored = data.players?.[guesser]?.sabotage?.type === "censor";
    if (fill) fill.style.width = pct + "%";
    if (label) label.textContent = isCensored ? `???–??? (??? possible)` : `${lo}–${hi} (${hi - lo + 1} possible)`;
  });

  // Win prob
  const probMe = document.getElementById("probme"), probPct = document.getElementById("probpct");
  if (probMe && probPct) {
    const myR = computeRange(data, me, opp, scrambled), oppR = computeRange(data, opp, me, scrambled);
    const mySpan = myR.hi - myR.lo + 1, oppSpan = oppR.hi - oppR.lo + 1, total = mySpan + oppSpan;
    const myPct = total > 0 ? Math.round((oppSpan / total) * 100) : 50;
    probMe.style.width = myPct + "%"; probPct.textContent = `${myPct}% · ${100 - myPct}%`;
  }

  const allGuesses = data.guesses ? Object.values(data.guesses) : [];
  const mgc = document.getElementById("myguesscount"), ogc = document.getElementById("oppguesscount");
  if (mgc) mgc.innerHTML = `Guesses: <span>${allGuesses.filter(g => g.player === me).length}</span>`;
  if (ogc) ogc.innerHTML = `Guesses: <span>${allGuesses.filter(g => g.player === opp).length}</span>`;
  const myrange = document.getElementById("myrange"), opprange = document.getElementById("opprange");
  if (myrange) { const { lo, hi } = computeRange(data, me, opp, scrambled); const isCensored = data.players?.[me]?.sabotage?.type === "censor"; myrange.innerHTML = isCensored ? `Guessing: <span>???–???</span>` : `Guessing: <span>${lo}–${hi}</span>`; }
  if (opprange) { const { lo, hi } = computeRange(data, opp, me, scrambled); const isCensored = data.players?.[opp]?.sabotage?.type === "censor"; opprange.innerHTML = isCensored ? `Opp range: <span>???–???</span>` : `Opp range: <span>${lo}–${hi}</span>`; }

  // Guess card update
  const gc = document.getElementById("guesscard");
  const hasInput = !!document.getElementById("gi");
  if (gc) {
    if (!telepathy) {
      if (myTurn !== hasInput) {
        renderGuessCard(gc, data, me, opp, myTurn);
      } else if (myTurn && hasInput) {
        const { lo, hi } = computeRange(data, me, opp, scrambled);
        const gr = document.getElementById("grange"), gi = document.getElementById("gi");
        const isCensored = data.players?.[me]?.sabotage?.type === "censor";
        const blind = hasMod(data, "blind");
        if (gr) {
          if (blind) gr.textContent = "🙈 Blind mode — no range shown";
          else gr.textContent = isCensored ? `Possible: ???–???` : `Possible: ${lo}–${hi}`;
        }
        if (gi) { gi.min = String(lo); gi.max = String(hi); gi.placeholder = blind ? "Enter guess..." : (isCensored ? "???" : `${lo}–${hi}`); }
      }
    }

    // Live-update perk result and button state regardless of turn (fixes perk update on opponent's turn)
    const perkRes = data.players?.[me]?.perkResult;
    if (perkRes) {
      let prDiv = document.getElementById("live-perk-res");
      if (!prDiv) {
        prDiv = el("div", { id: "live-perk-res", style: "color:#4ade80;font-size:12px;margin-top:8px;text-align:center;border:1px solid rgba(74,222,128,0.3);padding:6px;border-radius:6px;background:rgba(74,222,128,0.1);letter-spacing:1px;animation:fi .3s ease" });
        gc.append(prDiv);
      }
      prDiv.textContent = perkRes;
    }
    const pBtn = document.getElementById("perkbtn");
    if (pBtn && data.players?.[me]?.perkUsed) {
      pBtn.disabled = true; pBtn.textContent = "⚡ PERK USED";
    }
  }

  // Chat feed — append new messages only
  const feed = document.getElementById("chatfeed");
  if (feed) {
    const taunts = data.taunts ? Object.values(data.taunts).sort((a, b) => a.ts - b.ts) : [];
    // Remove the placeholder if real messages exist
    const placeholder = feed.querySelector(".chat-system");
    if (placeholder && taunts.length) placeholder.remove();
    const current = feed.children.length;
    if (current !== taunts.length) {
      taunts.slice(current).forEach(item => {
        const isMe = item.player === me;
        const wrap = d("chat-msg " + (isMe ? "mine" : "theirs"));
        if (!isMe) wrap.append(el("div", { class: "chat-name" }, item.player));
        wrap.append(d("chat-bubble", item.text));
        feed.append(wrap);
      });
      feed.scrollTop = feed.scrollHeight;
    }
    if (!taunts.length && !feed.children.length) feed.append(d("chat-system", "No messages yet — say something 💕"));
  }
}

// ── APPLY SABOTAGE VFX (fires on the victim's client) ──
let _bombTimer = null;
function applySabotage(type) {
  const app = document.getElementById("app");
  if (type === "ink") {
    for (let i = 0; i < 3; i++) {
      const blob = el("div", { class: "ink-splat" });
      blob.style.left = (10 + Math.random() * 80) + "%";
      blob.style.top  = (10 + Math.random() * 70) + "%";
      blob.style.width  = (140 + Math.random() * 100) + "px";
      blob.style.height = (140 + Math.random() * 100) + "px";
      blob.style.transform = `rotate(${Math.random()*360}deg)`;
      document.body.append(blob);
      setTimeout(() => { blob.style.opacity = "0"; setTimeout(() => blob.remove(), 1000); }, 8000);
    }
  } else if (type === "earthquake") {
    app.classList.add("perk-shake");
    setTimeout(() => app.classList.remove("perk-shake"), 5000);
  } else if (type === "flip") {
    app.classList.add("perk-flip");
    setTimeout(() => app.classList.remove("perk-flip"), 10000);
  } else if (type === "blackout") {
    const mask = el("div", { class: "blackout-mask", id: "blackout-mask" });
    document.body.append(mask);
    const move = e => {
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      mask.style.setProperty("--x", cx + "px");
      mask.style.setProperty("--y", cy + "px");
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("touchmove", move);
    setTimeout(() => {
      mask.remove();
      document.removeEventListener("mousemove", move);
      document.removeEventListener("touchmove", move);
    }, 10000);
  } else if (type === "glitch") {
    app.classList.add("perk-glitch-active");
    setTimeout(() => app.classList.remove("perk-glitch-active"), 8000);
  } else if (type === "censor") {
    app.classList.add("perk-censored");
    // Persists until round reset (cleared in startNewRound)
  } else if (type === "bomb") {
    if (_bombTimer) { clearInterval(_bombTimer); document.getElementById("bomb-el")?.remove(); }
    const bombEl = el("div", { class: "time-bomb", id: "bomb-el" });
    const timerEl = el("div", { class: "bomb-timer" }, "10");
    bombEl.append(el("div", {}, "💣"), timerEl);
    document.body.append(bombEl);
    let secs = 10;
    _bombTimer = setInterval(async () => {
      secs--;
      timerEl.textContent = secs;
      if (secs <= 0) {
        clearInterval(_bombTimer); _bombTimer = null;
        bombEl.remove();
        // Skip the victim's turn if it's still theirs
        const snap = await fbGet(`/duels/${S.roomCode}`);
        if (snap && snap.turn === S.username) {
          const players = Object.keys(snap.players || {});
          const opp2 = players.find(p => p !== S.username) || "";
          if (opp2) await fbUpdate(`/duels/${S.roomCode}`, { turn: opp2 });
        }
      }
    }, 1000);
  }
}

function computeRange(data, guesser, target, scrambled = false, ignoreBlind = false) {
  const minVal = data && data.min !== undefined && data.min !== null ? Number(data.min) : 1;
  const maxVal = data && data.max !== undefined && data.max !== null ? Number(data.max) : 100;
  if (hasMod(data, "blind") && !ignoreBlind) {
    return { lo: minVal, hi: maxVal };
  }
  let lo = minVal, hi = maxVal;
  const guesses = data.guesses ? Object.values(data.guesses) : [];
  guesses.filter(g => g.player === guesser).forEach(g => {
    const trueResult = scrambled ? (g.result === "higher" ? "lower" : g.result === "lower" ? "higher" : g.result) : g.result;
    const gGuess = Number(g.guess);
    if (!isNaN(gGuess)) {
      if (trueResult === "higher" && gGuess >= lo) lo = gGuess + 1;
      if (trueResult === "lower" && gGuess <= hi) hi = gGuess - 1;
    }
  });
  // 50/50 perk — halfLo/halfHi narrows the range further for this player
  const halfLo = data.players?.[guesser]?.halfLo;
  const halfHi = data.players?.[guesser]?.halfHi;
  if (halfLo && Number(halfLo) > lo) lo = Number(halfLo);
  if (halfHi && Number(halfHi) < hi) hi = Number(halfHi);
  return { lo: Math.max(minVal, lo), hi: Math.min(maxVal, hi) };
}

function buildRangeBar(id, data, guesser, target, minVal, maxVal, scrambled = false) {
  const wrap = d("range-bar-wrap"); wrap.id = id;
  const { lo, hi } = computeRange(data, guesser, target, scrambled);
  const min = minVal !== undefined && minVal !== null ? Number(minVal) : 1;
  const max = maxVal !== undefined && maxVal !== null ? Number(maxVal) : 100;
  const total = max - min;
  const pct = total > 0 ? Math.max(5, Math.round(((hi - lo) / total) * 100)) : 100;
  const track = d("range-bar-track"), fill = d("range-bar-fill");
  fill.style.width = pct + "%"; track.append(fill);
  
  const isCensored = data.players?.[guesser]?.sabotage?.type === "censor";
  const label = d("range-label"); label.textContent = isCensored ? `???–??? (??? possible)` : `${lo}–${hi} (${hi - lo + 1} possible)`;
  wrap.append(track, label); return wrap;
}

async function submitGuess() {
  const data = S.roomData;
  if (!data) return;
  const players = Object.keys(data.players || {});
  const opp = players.find(p => p !== S.username);
  if (!opp) return;
  const telepathy = hasMod(data, "telepathy");
  const scrambled = hasMod(data, "scrambled");
  const cupid = hasMod(data, "cupid");
  const drama = hasMod(data, "drama");
  const glitter = hasMod(data, "glitter");
  const hotcold = hasMod(data, "hotcold");
  if (!telepathy && data.turn !== S.username) return;
  if (telepathy && telepathyCooldown) return;
  const input = document.getElementById("gi");
  if (!input) return;
  const guess = parseInt(input.value);
  const allPast = data.guesses ? Object.values(data.guesses) : [];
  const myPast = allPast.filter(g => g.player === S.username).map(g => g.guess);
  const { lo: validLo, hi: validHi } = computeRange(data, S.username, opp, scrambled, true);
  if (isNaN(guess) || guess < validLo || guess > validHi) {
    if (soundEnabled) SFX.blocked();
    input.value = "OUT OF RANGE";
    input.classList.remove("shake"); void input.offsetWidth; input.classList.add("shake", "guess-feedback", "feedback-lower");
    setTimeout(() => { input.value = ""; input.classList.remove("shake", "guess-feedback", "feedback-lower"); }, 800);
    return;
  }

  // Local Guard to prevent double guesses bypassing Firebase
  if (!window._localGuesses) window._localGuesses = new Set();
  if (window._localGuesses.has(guess)) {
    input.value = ""; showPerkToast("⚠ already guessed that"); return;
  }

  if (myPast.includes(guess)) {
    SFX.blocked(); input.classList.remove("shake"); void input.offsetWidth; input.classList.add("shake"); setTimeout(() => input.classList.remove("shake"), 500);
    const existing = document.getElementById("dup-msg");
    if (!existing) { const msg = el("div", { id: "dup-msg", style: "font-size:10px;color:var(--red);text-align:center;margin-top:4px;letter-spacing:1px" }, `already tried ${guess}!`); input.parentNode.parentNode.append(msg); setTimeout(() => msg.remove(), 1800); }
    return;
  }

  window._localGuesses.add(guess);

  // Optimistic UI for input
  input.value = "";
  input.blur();

  if (cupid) triggerCupidArrow();
  if (glitter) { const r = input.getBoundingClientRect(); triggerGlitter(r.left + r.width / 2, r.top); }
  broadcastTyping(false);

  const oppNum = data.players[opp].number;
  let trueResult = guess === oppNum ? "correct" : guess > oppNum ? "lower" : "higher";

  // ── SNIPER SCOPE: win if within 3 ──
  if (data.players?.[S.username]?.sniperActive && trueResult !== "correct" && Math.abs(guess - oppNum) <= 3) {
    trueResult = "correct";
  }

  // ── SAFETY NET: if guess is colder, block the turn loss ──
  const safetyActive = data.players?.[S.username]?.safetyNetActive;
  let safetyBlocked = false;
  if (safetyActive && trueResult !== "correct") {
    const allPast2 = data.guesses ? Object.values(data.guesses) : [];
    const myLast2 = allPast2.filter(g => g.player === S.username).sort((a,b) => b.ts - a.ts)[0];
    if (myLast2) {
      const prevDist = Math.abs(myLast2.guess - oppNum);
      const newDist  = Math.abs(guess - oppNum);
      if (newDist > prevDist) safetyBlocked = true;
    }
  }
  if (safetyBlocked) {
    showPerkToast("🕸️ SAFETY NET CAUGHT THAT — turn saved!");
    await fbUpdate(`/duels/${S.roomCode}/players/${S.username}`, { safetyNetActive: null });
    input.value = "BLOCKED 🕸️";
    input.classList.add("guess-feedback", "feedback-lower");
    setTimeout(() => { input.value = ""; input.classList.remove("guess-feedback", "feedback-lower"); }, 900);
    return;
  }

  const storedResult = trueResult;
  const displayedResult = scrambled && trueResult !== "correct" ? (trueResult === "higher" ? "lower" : "higher") : trueResult;

  // Hot & Cold label
  let hotLabel = "";
  if (hotcold && trueResult !== "correct") {
    const minVal = data.min !== undefined && data.min !== null ? Number(data.min) : 1;
    const maxVal = data.max !== undefined && data.max !== null ? Number(data.max) : 100;
    const range = maxVal - minVal;
    const dist = Math.abs(guess - oppNum);
    const pct = dist / range;
    if (pct < 0.05) hotLabel = "🌋 BOILING";
    else if (pct < 0.15) hotLabel = "🔥 HOT";
    else if (pct < 0.30) hotLabel = "😐 WARM";
    else if (pct < 0.50) hotLabel = "❄️ COLD";
    else hotLabel = "🥶 FREEZING";
  }

  // Auto-clear feedback flash
  if (trueResult === "correct") { input.value = "✓ GOT IT!"; }
  else if (hotcold) { input.value = hotLabel; }
  else { input.value = displayedResult === "higher" ? "↑ HIGHER" : "↓ LOWER"; }
  input.classList.add("guess-feedback", "feedback-" + trueResult);
  setTimeout(() => { input.value = ""; input.classList.remove("guess-feedback", "feedback-correct", "feedback-higher", "feedback-lower"); }, 700);

  // Update last guess display
  lastGuessInfo = { guess, result: displayedResult, hotLabel };
  const lgEl = document.getElementById("last-guess-el");
  if (lgEl) {
    lgEl.textContent = hotcold ? `Last: ${guess} — ${hotLabel}` : `Last: ${guess} — ${displayedResult === "higher" ? "↑ Higher" : "↓ Lower"}`;
    lgEl.style.display = "block";
  }

  // Binary search detector
  if (!hotcold && myPast.length >= 2 && trueResult !== "correct") {
    const mid = Math.floor((validLo + validHi) / 2);
    if (Math.abs(guess - mid) <= 2 && !document.getElementById("bs-toast")) {
      const t = el("div", { id: "bs-toast", class: "bs-toast" }, "🤖 Optimal strategy!");
      document.body.append(t); setTimeout(() => t.remove(), 2500);
    }
  }

  // Telepathy cooldown
  if (telepathy) {
    telepathyCooldown = true;
    const gbtn = document.getElementById("gbtn");
    const cdLabel = document.getElementById("telecd");
    if (gbtn) gbtn.disabled = true;
    if (cdLabel) { cdLabel.textContent = "⏳ 3s cooldown..."; cdLabel.classList.add("active"); }
    let secs = 3;
    if (window.telepathyCdTimer) clearInterval(window.telepathyCdTimer);
    window.telepathyCdTimer = setInterval(() => {
      secs--;
      const cl = document.getElementById("telecd");
      if (cl) cl.textContent = secs > 0 ? `⏳ ${secs}s...` : "both guessing simultaneously 🫶";
      if (secs <= 0) { clearInterval(window.telepathyCdTimer); telepathyCooldown = false; const gb = document.getElementById("gbtn"); if (gb) gb.disabled = false; const cdl = document.getElementById("telecd"); if (cdl) cdl.classList.remove("active"); }
    }, 1000);
  }

  if (soundEnabled) {
    if (trueResult === "correct") { SFX.correct(); triggerBurst(); }
    else if (trueResult === "higher") SFX.higher();
    else SFX.lower();
  } else if (trueResult === "correct") { triggerBurst(); }

  if (drama && trueResult !== "correct") triggerDramaFlash(trueResult);

  // Hot/Cold in-card bubble
  if (hotcold && hotLabel) {
    document.getElementById("hcmsg")?.remove();
    const hcC = { ["🌋 BOILING"]: ["#ff4400", "Boiling"], ["🔥 HOT"]: ["#ff8800", "Hot"], ["😐 WARM"]: ["#ffaa44", "Warm"], ["❄️ COLD"]: ["#88bbff", "Cold"], ["🥶 FREEZING"]: ["#bbddff", "Freezing"] };
    const [col] = hcC[hotLabel] || ["var(--acc)"];
    const m = el("div", { id: "hcmsg", style: `font-size:22px;font-family:'Bebas Neue',Impact,sans-serif;letter-spacing:3px;color:${col};text-align:center;margin-top:6px;animation:fi .3s ease` }, hotLabel);
    const gc = document.getElementById("guesscard"); if (gc) gc.append(m);
    setTimeout(() => m.remove(), 3500);
  }

  await fbPush(`/duels/${S.roomCode}/guesses`, { player: S.username, guess, result: storedResult, ts: Date.now() });

  if (trueResult === "correct") {
    const newScore = (data.players[S.username].score || 0) + 1;
    const newStreak = (data.players[S.username].streak || 0) + 1;
    const allGuesses = data.guesses ? Object.values(data.guesses) : [];
    const myG = allGuesses.filter(g => g.player === S.username).length + 1;
    const oppG = allGuesses.filter(g => g.player === opp).length;
    const isLucky = myG === 1;
    let isSeriesWinner = false;
    if (data.bestOf && newScore >= data.bestOf) isSeriesWinner = true;
    await fbPush(`/duels/${S.roomCode}/roundHistory`, { round: S.round, winner: S.username, myGuesses: myG, oppGuesses: oppG, myNum: data.players[S.username].number, oppNum: data.players[opp].number });
    await fbUpdate(`/duels/${S.roomCode}`, {
      status: "finished", winner: S.username, winnerStreak: newStreak, luckyShot: isLucky || null,
      seriesWinner: isSeriesWinner ? S.username : null,
      [`players/${S.username}/score`]: newScore, [`players/${S.username}/streak`]: newStreak, [`players/${opp}/streak`]: 0,
    });
  } else {
    // ── FAKE OUT: show on THIS player (the victim who just guessed) ──
    if (data.players?.[S.username]?.fakeOutArmed) {
      await fbUpdate(`/duels/${S.roomCode}/players/${S.username}`, { fakeOutArmed: null });
      // Show fake win screen
      const fakeEl = el("div", { class: "fake-win-overlay", id: "fakeout-el" });
      fakeEl.innerHTML = `<div style="font-family:'Bebas Neue',Impact,sans-serif;font-size:72px;color:#f5cb5c;text-shadow:0 0 40px #f5cb5c;animation:fi .3s ease">🏆 YOU WIN!</div><div style="font-size:18px;color:#fff;letter-spacing:3px;margin-top:10px">CONGRATULATIONS!</div>`;
      document.body.append(fakeEl);
      triggerBurst();
      if (soundEnabled && window.SFX) SFX.correct();
      setTimeout(() => fakeEl.remove(), 3000);
    }

    // ── SECOND CHANCE: protect turn on wrong guess ──
    if (data.players?.[S.username]?.secondChanceActive) {
      await fbUpdate(`/duels/${S.roomCode}/players/${S.username}`, { secondChanceActive: null });
      showPerkToast("♻️ SECOND CHANCE used — turn saved!");
      // Don't swap turn — just clear the flag
    } else if (data.players?.[S.username]?.doubleTapActive) {
      await fbUpdate(`/duels/${S.roomCode}/players/${S.username}`, { doubleTapActive: null });
    } else if (!telepathy) {
      await fbUpdate(`/duels/${S.roomCode}`, { turn: opp });
    }
  }

  // Clean up one-shot perk flags after correct result
  if (trueResult === "correct" || data.players?.[S.username]?.sniperActive) {
    await fbUpdate(`/duels/${S.roomCode}/players/${S.username}`, { sniperActive: null });
  }
}

// ── WINNER ───────────────────────────────────────────────────
function renderWinner() {
  removeVisualMods();
  const screen = d("screen");
  const data = S.roomData || {};
  const players = Object.keys(data.players || {});
  const me = S.username, opp = players.find(p => p !== me) || "Opponent";
  const winner = data.winner || opp, isMe = winner === me;
  const winnerStreak = data.winnerStreak || 1;
  const myNum = data.players?.[me]?.number, oppNum = data.players?.[opp]?.number;
  const allGuesses = data.guesses ? Object.values(data.guesses) : [];
  const myGuessCnt = allGuesses.filter(g => g.player === me).length;
  const oppGuessCnt = allGuesses.filter(g => g.player === opp).length;
  const seriesWinner = data.seriesWinner;
  const isSeriesOver = !!seriesWinner;

  if (isSeriesOver) {
    const headerWrapper = d("winner-header-wrap"); headerWrapper.style.textAlign = "center"; headerWrapper.style.marginBottom = "24px";
    headerWrapper.append(
      el("div", { class: "logo", style: "font-size:38px;letter-spacing:5px;line-height:1;margin-bottom:8px;color:var(--acc)" }, seriesWinner === me ? "YOU WON THE SERIES!" : `${seriesWinner.toUpperCase()} WON!`),
      el("div", { style: "font-family:'DM Mono',monospace;font-size:12px;letter-spacing:4px;color:var(--mut);text-transform:uppercase" }, "SERIES OVER")
    );
    screen.append(headerWrapper);
  } else {
    const headerWrapper = d("winner-header-wrap"); headerWrapper.style.textAlign = "center"; headerWrapper.style.marginBottom = "24px";
    headerWrapper.append(
      el("div", { class: "logo", style: "font-size:46px;letter-spacing:6px;line-height:1;margin-bottom:8px;color:" + (isMe ? "var(--acc)" : "var(--mut)") }, isMe ? "VICTORY 💕" : winner.toUpperCase() + " WINS"),
      el("div", { style: "font-family:'DM Mono',monospace;font-size:12px;letter-spacing:4px;color:var(--mut);text-transform:uppercase" }, isMe ? "YOU WIN!" : "YOU LOSE...")
    );
    screen.append(headerWrapper);
  }

  if (data.luckyShot && isMe) {
    const lucky = d("lucky-hero");
    lucky.append(el("span", { class: "lucky-icon" }, "🍀"), el("div", { class: "lucky-title" }, "LUCKY SHOT!"), el("div", { class: "lucky-sub" }, `${winner} got it on the very first guess`), el("span", { class: "lucky-badge" }, "✦ FIRST GUESS CORRECT ✦"));
    screen.append(lucky);
  } else {
    const hero = d("winner-hero");
    hero.append(el("span", { class: "winner-trophy-anim" }, isMe ? "💕" : "💀"), el("div", { class: "winner-label" }, isMe ? "YOU WIN" : "YOU LOSE"), el("div", { class: "winner-name" }, winner), el("div", { class: "winner-sub" }, "guessed the number!"));
    if (winnerStreak >= 2) hero.append(el("span", { class: "streak-badge" }, `🔥 ${winnerStreak}-ROUND STREAK`));
    screen.append(hero);
  }

  const sumCard = d("card");
  sumCard.append(el("div", { class: "ctitle" }, "ROUND SUMMARY"));
  const grid = d("summary-grid");
  [{ val: myGuessCnt, label: "Your Guesses", win: myGuessCnt <= oppGuessCnt && isMe }, { val: oppGuessCnt, label: `${opp}'s Guesses`, win: oppGuessCnt < myGuessCnt && !isMe }].forEach(s => {
    const cell = d("summary-stat");
    cell.append(el("div", { class: "summary-stat-val" }, String(s.val)), el("div", { class: "summary-stat-label" }, s.label));
    if (s.win) cell.append(el("div", { class: "summary-winner-tag" }, "✓ fewer guesses"));
    grid.append(cell);
  });
  sumCard.append(grid);

  sumCard.append(el("div", { class: "ctitle", style: "margin-top:14px;margin-bottom:10px" }, "NUMBER REVEAL"));
  const revealWrap = d("num-reveal-wrap");
  [[me, myNum, "Your Number"], [opp, oppNum, `${opp}'s Number`]].forEach(([name, num, label]) => {
    const card2 = d("num-reveal-card"); card2.append(el("div", { class: "num-reveal-label" }, label));
    const val = el("div", { class: "num-reveal-val" }, "—"); card2.append(val); revealWrap.append(card2);
    if (num) {
      const target = parseInt(num), duration = 900, steps = Math.min(target, 28), stepTime = duration / steps;
      let current = 0;
      const tick = () => { const jump = Math.max(1, Math.round((target - current) / (steps - Math.floor(current / (target / steps)) + 1))); current = Math.min(current + jump, target); val.textContent = String(current); val.classList.remove("num-reveal-tick"); void val.offsetWidth; val.classList.add("num-reveal-tick"); if (current < target) setTimeout(tick, stepTime); else card2.classList.add("revealed"); };
      setTimeout(tick, 200 + Math.random() * 150);
    }
  });
  sumCard.append(revealWrap);

  sumCard.append(el("div", { class: "sl", style: "margin-top:14px" }, "SERIES SCORE"));
  const sb = d("duel");
  players.forEach(p => {
    const streak = parseInt(data.players[p]?.streak) || 0, score = parseInt(data.players[p]?.score) || 0;
    const ps = d("pside" + (p === winner ? " active" : ""));
    ps.append(el("div", { class: "pname" }, p), el("div", { style: "font-family:Bebas Neue,Impact,sans-serif;font-size:32px;color:var(--acc);margin:4px 0" }, score + " 💕"));
    if (streak >= 2) ps.append(el("div", { class: "pstreak-badge" }, `🔥 ${streak} STREAK`));
    sb.append(ps);
  });
  sumCard.append(sb);

  if (isSeriesOver && S.isHost) {
    sumCard.append(el("button", {
      class: "btn rematch-btn", style: "margin-top:14px", onClick: () => {
        S.round = 0; Object.keys(S.roomData.players).forEach(p => {
          fbUpdate(`/duels/${S.roomCode}/players/${p}`, { score: 0, streak: 0 });
        });
        nextRound();
      }
    }, "💕 PLAY NEW SERIES"), el("button", { class: "btn bs", onClick: leaveRoom }, "LEAVE ROOM"));
  } else if (S.isHost) {
    sumCard.append(el("button", { class: "btn rematch-btn", style: "margin-top:14px", onClick: nextRound }, "💕 NEXT ROUND"), el("button", { class: "btn bs", onClick: leaveRoom }, "END GAME"));
  } else {
    sumCard.append(el("div", { style: "text-align:center;color:var(--mut);font-size:12px;margin-top:16px" }, "Waiting for host to continue... 💕"));
  }
  screen.append(sumCard);

  const allHistory = data.roundHistory ? Object.values(data.roundHistory) : [];
  if (allHistory.length > 0) {
    const rhCard = d("card");
    rhCard.append(el("div", { class: "ctitle" }, "ROUND HISTORY"));
    const toggle = el("button", { class: "rh-toggle" }, `▼ Show ${allHistory.length} round${allHistory.length > 1 ? "s" : ""}`);
    const list = d("rh-list"); let open = false;
    toggle.addEventListener("click", () => { open = !open; list.classList.toggle("open", open); toggle.textContent = (open ? "▲ Hide" : "▼ Show") + ` ${allHistory.length} round${allHistory.length > 1 ? "s" : ""}`; });
    allHistory.sort((a, b) => (a.round || 0) - (b.round || 0)).forEach(rh => {
      const row = d("rh-row"), myR = rh.winner === me;
      row.append(el("span", { class: "rh-round" }, `RND ${rh.round || "?"}`), el("span", { class: "rh-winner", style: myR ? "color:var(--acc)" : "color:var(--mut)" }, rh.winner || "?"), el("span", { class: "rh-detail" }, `${rh.myGuesses || "?"}g vs ${rh.oppGuesses || "?"}g`));
      list.append(row);
    });
    rhCard.append(toggle, list); screen.append(rhCard);
  }
  return screen;
}

async function nextRound() {
  if (!S.isHost) return;
  const data = S.roomData || {};
  const players = Object.keys(data.players || {});
  const playerReset = {};
  players.forEach(p => { 
    playerReset[`players/${p}/number`] = null; 
    playerReset[`players/${p}/ready`] = false; 
    playerReset[`players/${p}/perk`] = null;
    playerReset[`players/${p}/perkReady`] = null;
    playerReset[`players/${p}/perkUsed`] = null;
    playerReset[`players/${p}/perkResult`] = null;
    playerReset[`players/${p}/sabotage`] = null;
    playerReset[`players/${p}/doubleTapActive`] = null;
    playerReset[`players/${p}/sniperActive`] = null;
    playerReset[`players/${p}/safetyNetActive`] = null;
    playerReset[`players/${p}/fakeOutArmed`] = null;
    playerReset[`players/${p}/halfLo`] = null;
    playerReset[`players/${p}/halfHi`] = null;
    playerReset[`players/${p}/magnetSuggest`] = null;
    playerReset[`players/${p}/secondChanceActive`] = null;
  });
  lastReactionCount = 0; lastTypingState = false; lastChatCount = 0; lastGuessInfo = null; hasUsedComeback = false;
  if (window._localGuesses) window._localGuesses.clear();
  // Clear sabotage VFX state for new round
  document.body.classList.remove("bw-pulsing");
  document.getElementById("app")?.classList.remove("perk-censored", "perk-shake", "perk-flip", "perk-glitch-active");
  document.getElementById("blackout-mask")?.remove();
  document.getElementById("bomb-el")?.remove();
  if (_bombTimer) { clearInterval(_bombTimer); _bombTimer = null; }
  window._lastSabotageTs = 0;
  lastProcessedEventTs = 0;
  const newPool = pickModifiers(S.roomCode + (S.round + 1)).map(m => m.id);
  await fbUpdate(`/duels/${S.roomCode}`, {
    status: "picking", winner: null, winnerStreak: null, luckyShot: null, guesses: null, turn: null,
    taunts: null, reactions: null, typing: null, activeModifiers: null, modifierVotes: null, normalVotes: null,
    peekRanges: null, modifierPool: newPool, round: (S.round || 1) + 1, ...playerReset
  });
}

async function leaveRoom() {
  stopPolling(); broadcastTyping(false);
  if (S.isHost) {
    await fbDelete(`/duels/${S.roomCode}`);
  } else {
    const st = S.roomData?.status;
    if (st === "playing" || st === "modifiers" || st === "picking") {
      await fbUpdate(`/duels/${S.roomCode}`, { status: "abandoned", abandonedBy: S.username });
    }
    await fbDelete(`/duels/${S.roomCode}/players/${S.username}`);
  }
  Object.assign(S, { screen: "home", roomCode: "", isHost: false, roomData: null, round: 1, bestOf: null });
  lastReactionCount = 0; lastTypingState = false; roundHistory = []; lastChatCount = 0; lastGuessInfo = null; hasUsedComeback = false;
  if (window._localGuesses) window._localGuesses.clear();
  removeVisualMods(); render();
}

function launchConfetti() {
  const c = document.getElementById("conf"); c.innerHTML = "";
  const cols = ["#ff6b9d", "#ff3358", "#ffd6e7", "#c8385a", "#ff9ec4", "#fff0f5"];
  for (let i = 0; i < 110; i++) {
    const p = document.createElement("div"); p.className = "cp"; const s = 5 + Math.random() * 8;
    p.style.cssText = `left:${Math.random() * 100}%;top:0;background:${cols[Math.floor(Math.random() * cols.length)]};width:${s}px;height:${s}px;border-radius:${Math.random() > .4 ? "50%" : "2px"};animation-duration:${1.8 + Math.random() * 2}s;animation-delay:${Math.random() * .7}s;`;
    c.append(p); setTimeout(() => p.remove(), 6000);
  }
}

let botGuessPending = false;
let lastBotGuessTime = 0;

async function handleBotAITick(data, code) {
  const telepathy = hasMod(data, "telepathy");
  const hostName = S.username;
  const hostNum = data.players[hostName]?.number;
  if (!hostNum) return;
  
  if (telepathy) {
    const now = Date.now();
    if (now - lastBotGuessTime < 5500) return;
    lastBotGuessTime = now;
    await executeBotGuess(data, code, hostName, hostNum);
  } else {
    if (data.turn !== "DebugBot" || botGuessPending) return;
    botGuessPending = true;
    setTimeout(async () => {
      const freshData = await fbGet(`/duels/${code}`);
      if (freshData && freshData.status === "playing" && freshData.turn === "DebugBot") {
        await executeBotGuess(freshData, code, hostName, hostNum);
      }
      botGuessPending = false;
    }, 1800);
  }
}

async function executeBotGuess(data, code, hostName, hostNum) {
  const { lo, hi } = computeRange(data, "DebugBot", hostName, false, true);
  if (lo > hi) return;
  const guess = Math.floor((lo + hi) / 2);
  const botSniper = data.players?.DebugBot?.sniperActive;
  let trueResult = guess === hostNum ? "correct" : guess > hostNum ? "lower" : "higher";
  
  if (botSniper && trueResult !== "correct" && Math.abs(guess - hostNum) <= 3) {
    trueResult = "correct";
  }
  
  const storedResult = trueResult;
  
  await fbPush(`/duels/${code}/guesses`, { player: "DebugBot", guess, result: storedResult, ts: Date.now() });
  
  if (trueResult === "correct") {
    const newScore = (data.players.DebugBot.score || 0) + 1;
    const newStreak = (data.players.DebugBot.streak || 0) + 1;
    const allGuesses = data.guesses ? Object.values(data.guesses) : [];
    const myG = allGuesses.filter(g => g.player === "DebugBot").length + 1;
    const oppG = allGuesses.filter(g => g.player === hostName).length;
    const isLucky = myG === 1;
    let isSeriesWinner = false;
    if (data.bestOf && newScore >= data.bestOf) isSeriesWinner = true;
    
    await fbPush(`/duels/${code}/roundHistory`, { round: S.round, winner: "DebugBot", myGuesses: myG, oppGuesses: oppG, myNum: data.players.DebugBot.number, oppNum: hostNum });
    await fbUpdate(`/duels/${code}`, {
      status: "finished", winner: "DebugBot", winnerStreak: newStreak, luckyShot: isLucky || null,
      seriesWinner: isSeriesWinner ? "DebugBot" : null,
      [`players/DebugBot/score`]: newScore, [`players/DebugBot/streak`]: newStreak, [`players/${hostName}/streak`]: 0,
    });
  } else {
    if (data.players?.DebugBot?.secondChanceActive) {
      await fbUpdate(`/duels/${code}/players/DebugBot`, { secondChanceActive: null });
    } else if (data.players?.DebugBot?.doubleTapActive) {
      await fbUpdate(`/duels/${code}/players/DebugBot`, { doubleTapActive: null });
    } else if (!hasMod(data, "telepathy")) {
      await fbUpdate(`/duels/${code}`, { turn: hostName });
    }
  }
  
  if (trueResult === "correct" || botSniper) {
    await fbUpdate(`/duels/${code}/players/DebugBot`, { sniperActive: null });
  }
}