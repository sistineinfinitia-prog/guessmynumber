// ── STATE ─────────────────────────────────────────────────────
let pollTimer=null, lastHash="", lastReactionCount=0;
let typingTimer=null, lastTypingState=false;
let roundHistory=[], lastChatCount=0;
let telepathyCooldown=false, telepathyCdTimer=null;

let S={screen:"home",username:"",roomCode:"",isHost:false,roomData:null,round:1};

const TAUNT_PRESETS=["not even close 💀","getting warmer 🔥","you'll never get it 😏","try harder babe 💅","lucky guess? 😤","I'm in your head 🧠","skill issue 💅","touch grass first 🌿"];
const EMOJI_LIST=["❤️","😤","💀","🫦","😏","🔥","💅","😘"];
const CHAT_EMOJIS=["💬","💕","✨","🌸","💭","🗨️","😏","❤️"];

const MAGIC8_HIGHER=["The stars say... higher 🔮","Look within... and go up","Concentrate and go higher","Signs point up ✨","Without a doubt — higher","Reply hazy, try higher"];
const MAGIC8_LOWER=["The mists say... lower 🌫️","As I see it — lower","All signs point down","Cannot predict, but go lower","It is certain... lower","My sources say lower 🎱"];
const MAGIC8_WILD=["Ask again later 🎱","Better not tell you now","Concentrate and ask again"];

// ── MODIFIER DEFINITIONS ──────────────────────────────────────
const VISUAL_MODS = [
  { id:"midnight", icon:"🌙", name:"Midnight Mode", type:"visual",
    desc:"UI goes pitch black. All text dims to 30%. Only active elements glow — eerie, haunted vibes." },
  { id:"sakura", icon:"🌸", name:"Sakura", type:"visual",
    desc:"Heart particles become falling pink cherry blossoms. Soft, floaty, and way prettier." },
  { id:"cupid", icon:"💘", name:"Cupid's Arrow", type:"visual",
    desc:"Every guess fires a little arrow animation shooting across the screen. Unavoidable." },
  { id:"colorflip", icon:"🎨", name:"Color Flip", type:"visual",
    desc:"The entire UI inverts to a light cream theme. Pink stays pink. Everything else is reversed." },
  { id:"retro", icon:"📺", name:"Retro CRT", type:"visual",
    desc:"Scanline overlay on the full screen. Monospace everything. Flickering CRT glow. Feels broken (in a good way)." },
  { id:"glitter", icon:"✨", name:"Glitter", type:"visual",
    desc:"Every guess, chat message, or emoji fires a sparkle burst at the point of interaction." },
  { id:"letter", icon:"💌", name:"Love Letter", type:"visual",
    desc:"Parchment texture, cursive/serif headings, cream and brown palette. Like writing by candlelight." },
  { id:"violet", icon:"💜", name:"Violet Bloom", type:"visual",
    desc:"Full purple color scheme overhaul — lavender petals, violet accents, deep indigo background." },
  { id:"drama", icon:"🎭", name:"Drama", type:"visual",
    desc:"Every higher/lower result triggers a full-screen flash and a brutal screen shake. Extremely dramatic." },
  { id:"rainbow", icon:"🌈", name:"Rainbow", type:"visual",
    desc:"The entire UI slowly hue-shifts through the spectrum. Everything cycles every 8 seconds." },
];

const GAMEPLAY_MODS = [
  { id:"scrambled", icon:"🔀", name:"Scrambled", type:"gameplay",
    desc:"Higher and lower responses are SWAPPED. Everything you know is wrong. Good luck." },
  { id:"peek", icon:"👁️", name:"Peek", type:"gameplay",
    desc:"Before guessing, you see 3 number ranges — 2 wrong, 1 containing the answer. It's a clue, not a gift." },
  { id:"telepathy", icon:"🫶", name:"Telepathy", type:"gameplay",
    desc:"No turns — both players guess simultaneously. 3-second cooldown per guess. First correct wins." },
  { id:"magic8", icon:"🎱", name:"Magic 8-Ball", type:"gameplay",
    desc:"Instead of higher/lower, you get cryptic vague responses. The ball knows. Maybe." },
  { id:"secret", icon:"🤫", name:"Secret Agent", type:"gameplay",
    desc:"Chat, taunts, and emojis are fully disabled. No communication. Pure cold silence." },
  { id:"shrinking", icon:"📉", name:"Shrinking", type:"gameplay",
    desc:"Every 3 total guesses, the number range shrinks 10% inward from each side. Race before it collapses." },
];