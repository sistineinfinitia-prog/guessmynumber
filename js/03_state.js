// ── STATE ─────────────────────────────────────────────────────
let pollTimer = null, heartbeatTimer = null, lastHash = "", lastReactionCount = 0;
let typingTimer = null, lastTypingState = false;
let roundHistory = [], lastChatCount = 0;
let telepathyCooldown = false, telepathyCdTimer = null;
let lastGuessInfo = null, hasUsedComeback = false, soundEnabled = true;

let S = { screen: "home", username: "", roomCode: "", isHost: false, roomData: null, round: 1, bestOf: null, myPerk: null, myPerkUsed: false };

const TAUNT_PRESETS = ["not even close 💀", "getting warmer 🔥", "you'll never get it 😏", "try harder babe 💅", "lucky guess? 😤", "I'm in your head 🧠", "skill issue 💅", "touch grass first 🌿"];
const EMOJI_LIST = ["❤️", "😤", "💀", "🫦", "😏", "🔥", "💅", "😘"];
const CHAT_EMOJIS = ["💬", "💕", "✨", "🌸", "💭", "🗨️", "😏", "❤️"];

// ── MODIFIER DEFINITIONS ──────────────────────────────────────
const VISUAL_MODS = [
  {
    id: "midnight", icon: "🌙", name: "Midnight Mode", type: "visual",
    desc: "UI goes pitch black. All text dims to 30%. Only active elements glow — eerie, haunted vibes."
  },
  {
    id: "sakura", icon: "🌸", name: "Sakura", type: "visual",
    desc: "Heart particles become falling pink cherry blossoms. Soft, floaty, and way prettier."
  },
  {
    id: "cupid", icon: "💘", name: "Cupid's Arrow", type: "visual",
    desc: "Every guess fires 10 arrows shooting across the screen. Unavoidable chaos."
  },
  {
    id: "colorflip", icon: "🎨", name: "Color Flip", type: "visual",
    desc: "The entire UI inverts to a light cream theme. Pink stays pink. Everything else is reversed."
  },
  {
    id: "retro", icon: "📺", name: "Retro CRT", type: "visual",
    desc: "Scanline overlay on the full screen. Monospace everything. Flickering CRT glow. Feels broken (in a good way)."
  },
  {
    id: "glitter", icon: "✨", name: "Glitter", type: "visual",
    desc: "Every guess, chat message, or emoji fires a sparkle burst at the point of interaction."
  },
  {
    id: "letter", icon: "💌", name: "Love Letter", type: "visual",
    desc: "Warm candlelight palette, cursive headings, rich amber and brown tones. Cozy and romantic."
  },
  {
    id: "violet", icon: "💜", name: "Violet Bloom", type: "visual",
    desc: "Full purple color scheme overhaul — lavender petals, violet accents, deep indigo background."
  },
  {
    id: "drama", icon: "🎭", name: "Drama", type: "visual",
    desc: "Every higher/lower result triggers a full-screen flash and a brutal screen shake. Extremely dramatic."
  },
  {
    id: "rainbow", icon: "🌈", name: "Rainbow", type: "visual",
    desc: "The entire UI slowly hue-shifts through the spectrum. Everything cycles every 8 seconds."
  },
  {
    id: "neon", icon: "💡", name: "Neon", type: "visual",
    desc: "Electric neon glow on everything. Cyan/magenta borders pulse with light. Dark background, pure electric vibes."
  },
  {
    id: "heartbeat", icon: "💓", name: "Heartbeat", type: "visual",
    desc: "The game card pulses rhythmically like a heartbeat. Every 1.5 seconds — boom, boom."
  },
];

const GAMEPLAY_MODS = [
  {
    id: "peek", icon: "👁️", name: "Peek", type: "gameplay",
    desc: "A one-time hint button reveals 3 number ranges — 2 wrong, 1 containing the answer. Use it wisely."
  },
  {
    id: "telepathy", icon: "🫶", name: "Telepathy", type: "gameplay",
    desc: "No turns — both players guess simultaneously. 3-second cooldown per guess. First correct wins."
  },
  {
    id: "hotcold", icon: "🌡️", name: "Hot & Cold", type: "gameplay",
    desc: "No higher/lower — you get Freezing / Cold / Warm / Hot / Boiling based on distance from the number."
  },
  {
    id: "blind", icon: "🙈", name: "Blind", type: "gameplay",
    desc: "Your guess history is completely hidden. No ranges shown. You have to remember everything yourself."
  },
  {
    id: "secret", icon: "🤫", name: "Secret Agent", type: "gameplay",
    desc: "Chat, taunts, and emojis are fully disabled. No communication. Pure cold silence."
  }
];

const PERK_MODS = [
  // Hints
  { id: "oracle", icon: "🔮", name: "The Oracle", type: "hint", desc: "Reveals if the opponent's number is Odd or Even.", eventDesc: "🔮 [PLAYER] USED THE ORACLE: Found out if the answer is Odd or Even!" },
  { id: "doubletap", icon: "🔫", name: "Double Tap", type: "hint", desc: "Grants two back-to-back guesses in a single turn.", eventDesc: "🔫 [PLAYER] USED DOUBLE TAP: They stole an extra turn!" },
  { id: "lastdigit", icon: "🔢", name: "Last Digit", type: "hint", desc: "Reveals the exact last digit of the opponent's number.", eventDesc: "🔢 [PLAYER] USED LAST DIGIT: They know the final digit!" },
  { id: "sniper", icon: "🎯", name: "Sniper Scope", type: "hint", desc: "Arms a buff: If your next guess is within 3, you instantly win.", eventDesc: "🎯 [PLAYER] ARMED SNIPER SCOPE: Beware if they get close!" },
  { id: "safetynet", icon: "🕸️", name: "Safety Net", type: "hint", desc: "If your next guess is colder than your last, it blocks it and saves your turn.", eventDesc: "🕸️ [PLAYER] ARMED SAFETY NET: Their turn is protected!" },
  { id: "digitcheck", icon: "🔍", name: "Digit Check", type: "hint", desc: "Randomly reveals one of the digits inside the opponent's number.", eventDesc: "🔍 [PLAYER] USED DIGIT CHECK: A single digit was revealed!" },
  { id: "distance", icon: "📏", name: "Ballpark", type: "hint", desc: "Tells you roughly how far away your last guess was (rounded to 10s).", eventDesc: "📏 [PLAYER] USED BALLPARK: They measured their distance!" },
  { id: "half", icon: "🌓", name: "50/50", type: "hint", desc: "Permanently slices your allowed range in half, eliminating dead space.", eventDesc: "🌓 [PLAYER] USED 50/50: They eliminated half of the board!" },
  { id: "magnet", icon: "🧲", name: "Magnet", type: "hint", desc: "Pulls your previous guess 15% closer to the actual target.", eventDesc: "🧲 [PLAYER] USED MAGNET: Their previous guess was pulled closer!" },
  { id: "secondchance", icon: "♻️", name: "Second Chance", type: "hint", desc: "If your next guess is wrong, you get to guess again.", eventDesc: "♻️ [PLAYER] ARMED SECOND CHANCE: Their next mistake is forgiven!" },
  // Sabotages
  { id: "thief", icon: "🥷", name: "Thief", type: "sabotage", desc: "Instantly skips the opponent's current turn and steals it.", eventDesc: "🥷 [PLAYER] ACTIVATED THIEF: Opponent's turn is stolen!" },
  { id: "ink", icon: "🦑", name: "Ink Splatter", type: "sabotage", desc: "Splatter ink on the opponent's screen for 8 seconds.", eventDesc: "🦑 [PLAYER] DEPLOYED INK SPLATTER: Opponent's vision is ruined!" },
  { id: "censor", icon: "🚷", name: "Range Censor", type: "sabotage", desc: "Censors the opponent's range trackers for the rest of the round.", eventDesc: "🚷 [PLAYER] ACTIVATED CENSOR: Opponent's ranges are hidden!" },
  { id: "earthquake", icon: "💥", name: "Earthquake", type: "sabotage", desc: "Violently shakes the opponent's screen for 5 seconds.", eventDesc: "💥 [PLAYER] TRIGGERED EARTHQUAKE: Hold onto something!" },
  { id: "fakeout", icon: "🎭", name: "Fake Out", type: "sabotage", desc: "The next time they guess, they will get a fake 'YOU WIN!' screen.", eventDesc: "🎭 [PLAYER] PLANTED A FAKE OUT: The ultimate troll!" },
  { id: "flip", icon: "🙃", name: "Upside Down", type: "sabotage", desc: "Flips the opponent's entire screen upside down for 10 seconds.", eventDesc: "🙃 [PLAYER] USED UPSIDE DOWN: The world is inverted!" },
  { id: "blackout", icon: "🔦", name: "Blackout", type: "sabotage", desc: "Plunges the opponent's screen into darkness for 10 seconds.", eventDesc: "🔦 [PLAYER] CAUSED A BLACKOUT: Turn on your flashlight!" },
  { id: "bomb", icon: "💣", name: "Time Bomb", type: "sabotage", desc: "Spawns a 10s bomb. If they don't guess in time, their turn is skipped.", eventDesc: "💣 [PLAYER] PLANTED A TIME BOMB: Guess fast or lose your turn!" },
  { id: "glitch", icon: "👾", name: "The Glitch", type: "sabotage", desc: "Severely corrupts the opponent's screen with visual glitches.", eventDesc: "👾 [PLAYER] INFECTED YOU WITH A GLITCH: System critical!" }
];