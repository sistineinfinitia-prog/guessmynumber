// ── HEARTS BACKGROUND ─────────────────────────────────────────
let heartSpawnSymbols = ["♥","♡","💕","❤","✦","🌸","✿","·","♥","♡"];
(function spawnHearts(){
  const bg=document.getElementById("heartsBg");
  function spawn(){
    const h=document.createElement("div");
    h.className="heart-particle";
    h.textContent=heartSpawnSymbols[Math.floor(Math.random()*heartSpawnSymbols.length)];
    const sz=6+Math.random()*16;
    const isSakura=document.body.classList.contains("mod-sakura");
    const col=isSakura
      ?`rgba(255,${Math.floor(150+Math.random()*50)},${Math.floor(180+Math.random()*50)},${0.4+Math.random()*0.3})`
      :`rgba(255,${Math.floor(80+Math.random()*70)},${Math.floor(110+Math.random()*80)},${0.3+Math.random()*0.3})`;
    h.style.cssText=`left:${Math.random()*100}%;font-size:${sz}px;animation-duration:${10+Math.random()*14}s;animation-delay:${Math.random()*8}s;color:${col};`;
    bg.append(h);
    setTimeout(()=>h.remove(),(24+Math.random()*14)*1000);
  }
  for(let i=0;i<28;i++) setTimeout(spawn,i*280);
  setInterval(spawn,900);
})();

// ── PARALLAX ─────────────────────────────────────────────────
(function(){
  const bg=document.getElementById("heartsBg");
  document.addEventListener("mousemove",e=>{
    const mx=(e.clientX/window.innerWidth-0.5)*18;
    const my=(e.clientY/window.innerHeight-0.5)*10;
    bg.style.transform=`translate(${mx}px,${my}px) scale(1.04)`;
  });
})();

// ── EFFECTS ──────────────────────────────────────────────────
function triggerBurst(){
  const layer=document.getElementById("burstLayer");
  const cx=window.innerWidth/2, cy=window.innerHeight/2;
  const bsyms=["💕","✦","♥","🌸","💗","❤️","✨"];
  for(let i=0;i<18;i++){
    const b=document.createElement("div"); b.className="burst-heart";
    const angle=(i/18)*Math.PI*2, dist=80+Math.random()*160;
    b.textContent=bsyms[Math.floor(Math.random()*bsyms.length)];
    b.style.cssText=`left:${cx}px;top:${cy}px;--tx:translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist-100}px);animation-duration:${0.7+Math.random()*0.5}s;animation-delay:${Math.random()*0.15}s;font-size:${18+Math.random()*18}px;`;
    layer.append(b); setTimeout(()=>b.remove(),1200);
  }
}

function triggerCupidArrow(){
  const layer=document.getElementById("arrowLayer");
  const a=document.createElement("div"); a.className="cupid-arrow";
  const y=20+Math.random()*60;
  a.style.cssText=`top:${y}%;left:0;animation-duration:${0.7+Math.random()*0.4}s;`;
  a.textContent="💘";
  layer.append(a); setTimeout(()=>a.remove(),1500);
}

function triggerDramaFlash(type){
  const flash=document.createElement("div"); flash.className="drama-flash";
  flash.style.background=type==="higher"?"rgba(100,160,255,0.35)":"rgba(255,80,80,0.35)";
  document.body.append(flash);
  document.getElementById("app").style.animation="screenShake 0.4s ease";
  setTimeout(()=>{flash.remove();document.getElementById("app").style.animation="";},500);
}

function triggerGlitter(x,y){
  const layer=document.getElementById("efloat");
  const syms=["✨","⭐","💫","✦","★"];
  for(let i=0;i<6;i++){
    const g=document.createElement("div"); g.className="emoji-floater";
    g.textContent=syms[Math.floor(Math.random()*syms.length)];
    g.style.cssText=`left:${x+(Math.random()-0.5)*60}px;top:${y-20}px;font-size:${14+Math.random()*12}px;animation-duration:${0.9+Math.random()*0.5}s;`;
    layer.append(g); setTimeout(()=>g.remove(),1800);
  }
}



// ── SOUND ────────────────────────────────────────────────────
const SFX=(()=>{
  let ctx=null;
  function getCtx(){if(!ctx)ctx=new(window.AudioContext||window.webkitAudioContext)();return ctx;}
  function tone(freq,type,vol,dur,delay=0){
    try{const c=getCtx(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(0,c.currentTime+delay);g.gain.linearRampToValueAtTime(vol,c.currentTime+delay+0.01);g.gain.exponentialRampToValueAtTime(0.0001,c.currentTime+delay+dur);o.start(c.currentTime+delay);o.stop(c.currentTime+delay+dur+0.05);}catch(e){}
  }
  return{
    higher(){tone(440,'sine',0.18,0.12);tone(600,'sine',0.12,0.1,0.1);},
    lower(){tone(440,'sine',0.18,0.12);tone(300,'sine',0.12,0.1,0.1);},
    correct(){[523,659,784,1047].forEach((f,i)=>tone(f,'sine',0.2,0.18,i*0.1));},
    yourTurn(){tone(880,'sine',0.15,0.08);tone(1100,'sine',0.1,0.08,0.1);},
    blocked(){tone(200,'sawtooth',0.1,0.15);},
  };
})();