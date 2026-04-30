// ── STATE ─────────────────────────────────────────────────────
let pollTimer=null, heartbeatTimer=null, lastHash="", lastReactionCount=0;
let typingTimer=null, lastTypingState=false;
let roundHistory=[], lastChatCount=0;
let telepathyCooldown=false, telepathyCdTimer=null;
let lastGuessInfo=null, hasUsedComeback=false, soundEnabled=true;

let S={screen:"home",username:"",roomCode:"",isHost:false,roomData:null,round:1,bestOf:null,myPerk:null,myPerkUsed:false};

const TAUNT_PRESETS=["not even close 💀","getting warmer 🔥","you'll never get it 😏","try harder babe 💅","lucky guess? 😤","I'm in your head 🧠","skill issue 💅","touch grass first 🌿"];
const EMOJI_LIST=["❤️","😤","💀","🫦","😏","🔥","💅","😘"];
const CHAT_EMOJIS=["💬","💕","✨","🌸","💭","🗨️","😏","❤️"];

// ── MODIFIER DEFINITIONS ──────────────────────────────────────
const VISUAL_MODS = [
  { id:"midnight", icon:"🌙", name:"Midnight Mode", type:"visual",
    desc:"UI goes pitch black. All text dims to 30%. Only active elements glow — eerie, haunted vibes." },
  { id:"sakura", icon:"🌸", name:"Sakura", type:"visual",
    desc:"Heart particles become falling pink cherry blossoms. Soft, floaty, and way prettier." },
  { id:"cupid", icon:"💘", name:"Cupid's Arrow", type:"visual",
    desc:"Every guess fires 10 arrows shooting across the screen. Unavoidable chaos." },
  { id:"colorflip", icon:"🎨", name:"Color Flip", type:"visual",
    desc:"The entire UI inverts to a light cream theme. Pink stays pink. Everything else is reversed." },
  { id:"retro", icon:"📺", name:"Retro CRT", type:"visual",
    desc:"Scanline overlay on the full screen. Monospace everything. Flickering CRT glow. Feels broken (in a good way)." },
  { id:"glitter", icon:"✨", name:"Glitter", type:"visual",
    desc:"Every guess, chat message, or emoji fires a sparkle burst at the point of interaction." },
  { id:"letter", icon:"💌", name:"Love Letter", type:"visual",
    desc:"Warm candlelight palette, cursive headings, rich amber and brown tones. Cozy and romantic." },
  { id:"violet", icon:"💜", name:"Violet Bloom", type:"visual",
    desc:"Full purple color scheme overhaul — lavender petals, violet accents, deep indigo background." },
  { id:"drama", icon:"🎭", name:"Drama", type:"visual",
    desc:"Every higher/lower result triggers a full-screen flash and a brutal screen shake. Extremely dramatic." },
  { id:"rainbow", icon:"🌈", name:"Rainbow", type:"visual",
    desc:"The entire UI slowly hue-shifts through the spectrum. Everything cycles every 8 seconds." },
  { id:"neon", icon:"💡", name:"Neon", type:"visual",
    desc:"Electric neon glow on everything. Cyan/magenta borders pulse with light. Dark background, pure electric vibes." },
  { id:"heartbeat", icon:"💓", name:"Heartbeat", type:"visual",
    desc:"The game card pulses rhythmically like a heartbeat. Every 1.5 seconds — boom, boom." },
];

const GAMEPLAY_MODS = [
  { id:"scrambled", icon:"🔀", name:"Scrambled", type:"gameplay",
    desc:"Higher and lower responses are SWAPPED. Everything you know is wrong. Good luck." },
  { id:"peek", icon:"👁️", name:"Peek", type:"gameplay",
    desc:"A one-time hint button reveals 3 number ranges — 2 wrong, 1 containing the answer. Use it wisely." },
  { id:"telepathy", icon:"🫶", name:"Telepathy", type:"gameplay",
    desc:"No turns — both players guess simultaneously. 3-second cooldown per guess. First correct wins." },
  { id:"hotcold", icon:"🌡️", name:"Hot & Cold", type:"gameplay",
    desc:"No higher/lower — you get Freezing / Cold / Warm / Hot / Boiling based on distance from the number." },
  { id:"blind", icon:"🙈", name:"Blind", type:"gameplay",
    desc:"Your guess history is completely hidden. No ranges shown. You have to remember everything yourself." },
  { id:"secret", icon:"🤫", name:"Secret Agent", type:"gameplay",
    desc:"Chat, taunts, and emojis are fully disabled. No communication. Pure cold silence." },
  { id:"shrinking", icon:"📉", name:"Shrinking", type:"gameplay",
    desc:"Every 3 total guesses, the number range shrinks 10% inward from each side. Race before it collapses." },
];

const PERK_MODS = [
  { id:"oracle", icon:"🔮", name:"The Oracle", type:"hint",
    desc:"Instantly reveals whether the opponent's secret number is Odd or Even.",
    eventDesc:"🔮 [PLAYER] USED THE ORACLE: Found out if the answer is Odd or Even!" },
  { id:"doubletap", icon:"🔫", name:"Double Tap", type:"hint",
    desc:"When activated, grants you two back-to-back guesses in a single turn.",
    eventDesc:"🔫 [PLAYER] USED DOUBLE TAP: They stole an extra turn!" },
  { id:"thief", icon:"🥷", name:"Thief", type:"sabotage",
    desc:"Instantly skips the opponent's current turn and steals it.",
    eventDesc:"🥷 [PLAYER] ACTIVATED THIEF: Opponent's turn is stolen!" }
];