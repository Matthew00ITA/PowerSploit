const STAGES = [
  {
    key: "egg",
    name: "EGG",
    size: 0.52,
    minAge: 0,
    face: { x: 0, y: 0.04, r: 0.3 },
    eyes: 0.15,
    words: ["stomach", "seaman", "up", "down", "no", "yes"],
    parts: [
      { t: "sphere", x: 0, y: 0.02, r: 0.62, squash: 1.16, n: 380 },
      { t: "sphere", x: 0.0, y: 0.12, r: 0.52, squash: 1.04, n: 150, dim: 0.82 },
      { t: "sphere", x: 0.2, y: -0.5, r: 0.15, n: 18, dim: 1.06 },
      { t: "sphere", x: -0.26, y: -0.44, r: 0.13, n: 16, dim: 1.04 },
      { t: "sphere", x: 0.0, y: -0.58, r: 0.12, n: 14, dim: 1.02 }
    ]
  },
  {
    key: "blob",
    name: "BLOB",
    size: 0.56,
    minAge: 6,
    face: { x: 0, y: -0.02, r: 0.28 },
    eyes: 0.6,
    words: ["stomach", "seaman", "up", "down", "no", "yes", "hello", "hungry", "tree"],
    parts: [
      { t: "sphere", x: 0, y: 0.06, r: 0.6, squash: 0.94, n: 400 },
      { t: "sphere", x: 0, y: 0.4, r: 0.4, squash: 0.62, n: 140, dim: 0.88 },
      { t: "sphere", x: 0.46, y: -0.16, r: 0.15, n: 20, dim: 1.05 },
      { t: "sphere", x: -0.46, y: -0.16, r: 0.15, n: 20, dim: 1.05 }
    ]
  },
  {
    key: "sprout",
    name: "SPROUT",
    size: 0.62,
    minAge: 14,
    face: { x: 0, y: -0.04, r: 0.27 },
    eyes: 0.8,
    words: ["stomach", "seaman", "up", "down", "no", "yes", "hello", "hungry", "tree",
            "water", "thank", "play", "flower", "good"],
    parts: [
      { t: "sphere", x: 0, y: 0.06, r: 0.58, squash: 0.94, n: 370 },
      { t: "sphere", x: 0, y: 0.4, r: 0.39, squash: 0.62, n: 130, dim: 0.88 },
      { t: "cap", x: 0, y: -0.42, x2: 0.02, y2: -0.9, r1: 0.12, r2: 0.075, n: 46 },
      { t: "leaf", x: 0.01, y: -0.66, x2: 0.3, y2: -0.86, r1: 0.05, r2: 0.16, n: 34, tint: 0.6 },
      { t: "leaf", x: 0.01, y: -0.76, x2: -0.28, y2: -0.98, r1: 0.05, r2: 0.15, n: 32, tint: 0.58 },
      { t: "flower", x: 0.03, y: -0.98, r: 0.13, petals: 5, n: 60, tint: 0.9 },
      { t: "sphere", x: 0.44, y: -0.14, r: 0.14, n: 18, dim: 1.05 },
      { t: "sphere", x: -0.44, y: -0.14, r: 0.14, n: 18, dim: 1.05 }
    ]
  },
  {
    key: "crawler",
    name: "CRAWLER",
    size: 0.7,
    minAge: 26,
    face: { x: 0, y: -0.36, r: 0.26 },
    eyes: 0.95,
    words: ["stomach", "seaman", "up", "down", "no", "yes", "hello", "hungry", "tree",
            "water", "thank", "play", "flower", "good", "clean", "sleep", "grow", "love"],
    parts: [
      { t: "sphere", x: 0, y: -0.02, r: 0.5, squash: 0.9, n: 370 },
      { t: "sphere", x: 0, y: -0.34, r: 0.33, squash: 0.88, n: 150 },
      { t: "cap", x: 0.3, y: 0.22, x2: 0.47, y2: 0.66, r1: 0.11, r2: 0.05, n: 30 },
      { t: "cap", x: -0.3, y: 0.22, x2: -0.47, y2: 0.66, r1: 0.11, r2: 0.05, n: 30 },
      { t: "cap", x: 0.14, y: 0.3, x2: 0.18, y2: 0.72, r1: 0.1, r2: 0.05, n: 26 },
      { t: "cap", x: -0.14, y: 0.3, x2: -0.18, y2: 0.72, r1: 0.1, r2: 0.05, n: 26 },
      { t: "cap", x: 0.42, y: -0.3, x2: 0.64, y2: -0.12, r1: 0.09, r2: 0.06, n: 22 },
      { t: "cap", x: -0.42, y: -0.3, x2: -0.64, y2: -0.12, r1: 0.09, r2: 0.06, n: 22 }
    ]
  },
  {
    key: "torso",
    name: "TORSO",
    size: 0.8,
    minAge: 42,
    face: { x: 0, y: -0.76, r: 0.26 },
    eyes: 1,
    words: ["stomach", "seaman", "up", "down", "no", "yes", "hello", "hungry", "tree",
            "water", "thank", "play", "flower", "good", "clean", "sleep", "grow", "love",
            "morning", "bye", "doctor", "sing", "big", "hot"],
    parts: [
      { t: "sphere", x: 0, y: -0.74, r: 0.33, n: 200 },
      { t: "cap", x: 0, y: -0.42, x2: 0, y2: -0.58, r1: 0.14, r2: 0.15, n: 26 },
      { t: "sphere", x: 0, y: 0.02, r: 0.46, squash: 1.16, n: 300 },
      { t: "sphere", x: 0, y: 0.44, r: 0.36, squash: 0.72, n: 150 },
      { t: "cap", x: 0.4, y: -0.34, x2: 0.62, y2: 0.02, r1: 0.12, r2: 0.085, n: 40 },
      { t: "sphere", x: 0.64, y: 0.06, r: 0.1, n: 14, dim: 1.05 },
      { t: "cap", x: -0.4, y: -0.34, x2: -0.62, y2: 0.02, r1: 0.12, r2: 0.085, n: 40 },
      { t: "sphere", x: -0.64, y: 0.06, r: 0.1, n: 14, dim: 1.05 }
    ]
  },
  {
    key: "humanoid",
    name: "HUMANOID",
    size: 0.92,
    minAge: 64,
    face: { x: 0, y: -1.16, r: 0.23 },
    eyes: 1,
    words: ["stomach", "seaman", "up", "down", "no", "yes", "hello", "hungry", "tree",
            "water", "thank", "play", "flower", "good", "clean", "sleep", "grow", "love",
            "morning", "bye", "doctor", "sing", "big", "hot", "who", "you", "god", "friend"],
    parts: [
      { t: "sphere", x: 0, y: -1.14, r: 0.27, n: 190 },
      { t: "cap", x: 0, y: -0.88, x2: 0, y2: -1.02, r1: 0.085, r2: 0.1, n: 20 },
      { t: "sphere", x: 0, y: -0.5, r: 0.36, squash: 1.34, n: 300 },
      { t: "sphere", x: 0, y: 0.06, r: 0.31, squash: 0.8, n: 170 },
      { t: "cap", x: 0.44, y: -0.8, x2: 0.68, y2: -0.34, r1: 0.115, r2: 0.09, n: 30 },
      { t: "cap", x: 0.68, y: -0.34, x2: 0.74, y2: 0.14, r1: 0.09, r2: 0.07, n: 28 },
      { t: "sphere", x: 0.75, y: 0.2, r: 0.09, n: 14, dim: 1.05 },
      { t: "cap", x: -0.44, y: -0.8, x2: -0.68, y2: -0.34, r1: 0.115, r2: 0.09, n: 30 },
      { t: "cap", x: -0.68, y: -0.34, x2: -0.74, y2: 0.14, r1: 0.09, r2: 0.07, n: 28 },
      { t: "sphere", x: -0.75, y: 0.2, r: 0.09, n: 14, dim: 1.05 },
      { t: "cap", x: 0.2, y: 0.14, x2: 0.27, y2: 1.08, r1: 0.155, r2: 0.105, n: 48 },
      { t: "sphere", x: 0.31, y: 1.18, r: 0.12, squash: 0.65, n: 22 },
      { t: "cap", x: -0.2, y: 0.14, x2: -0.27, y2: 1.08, r1: 0.155, r2: 0.105, n: 48 },
      { t: "sphere", x: -0.31, y: 1.18, r: 0.12, squash: 0.65, n: 22 }
    ]
  },
  {
    key: "seaman",
    name: "SEAMAN",
    size: 1.06,
    minAge: 95,
    face: { x: 0, y: -1.22, r: 0.24 },
    eyes: 1,
    glow: true,
    words: ["stomach", "seaman", "up", "down", "no", "yes", "hello", "hungry", "tree",
            "water", "thank", "play", "flower", "good", "clean", "sleep", "grow", "love",
            "morning", "bye", "doctor", "sing", "big", "hot", "who", "you", "god", "friend",
            "name", "forever", "home", "one", "last"],
    parts: [
      { t: "sphere", x: 0, y: -1.2, r: 0.29, n: 200, dim: 1.05 },
      { t: "sphere", x: 0.0, y: -1.55, r: 0.085, n: 14, tint: 1.6 },
      { t: "sphere", x: 0.16, y: -1.51, r: 0.065, n: 12, tint: 1.6 },
      { t: "sphere", x: -0.16, y: -1.51, r: 0.065, n: 12, tint: 1.6 },
      { t: "ring", x: 0, y: -1.86, r: 0.46, thick: 0.032, n: 96, tint: 1.7 },
      { t: "cap", x: 0, y: -0.92, x2: 0, y2: -1.08, r1: 0.085, r2: 0.105, n: 20 },
      { t: "sphere", x: 0, y: -0.52, r: 0.39, squash: 1.36, n: 310 },
      { t: "sphere", x: 0, y: 0.08, r: 0.34, squash: 0.8, n: 180 },
      { t: "cap", x: 0.46, y: -0.84, x2: 0.72, y2: -0.36, r1: 0.115, r2: 0.09, n: 30 },
      { t: "cap", x: 0.72, y: -0.36, x2: 0.78, y2: 0.16, r1: 0.09, r2: 0.07, n: 28 },
      { t: "leaf", x: 0.8, y: 0.22, x2: 1.08, y2: 0.36, r1: 0.045, r2: 0.13, n: 28, tint: 0.7 },
      { t: "cap", x: -0.46, y: -0.84, x2: -0.72, y2: -0.36, r1: 0.115, r2: 0.09, n: 30 },
      { t: "cap", x: -0.72, y: -0.36, x2: -0.78, y2: 0.16, r1: 0.09, r2: 0.07, n: 28 },
      { t: "leaf", x: -0.8, y: 0.22, x2: -1.08, y2: 0.36, r1: 0.045, r2: 0.13, n: 28, tint: 0.7 },
      { t: "leaf", x: 0.3, y: -0.86, x2: 0.62, y2: -1.18, r1: 0.06, r2: 0.17, n: 30, tint: 0.8 },
      { t: "leaf", x: -0.3, y: -0.86, x2: -0.62, y2: -1.18, r1: 0.06, r2: 0.17, n: 30, tint: 0.8 },
      { t: "cap", x: 0.21, y: 0.16, x2: 0.29, y2: 1.2, r1: 0.16, r2: 0.11, n: 48 },
      { t: "sphere", x: 0.33, y: 1.3, r: 0.13, squash: 0.65, n: 22 },
      { t: "cap", x: -0.21, y: 0.16, x2: -0.29, y2: 1.2, r1: 0.16, r2: 0.11, n: 48 },
      { t: "sphere", x: -0.33, y: 1.3, r: 0.13, squash: 0.65, n: 22 }
    ]
  }
];

const EVOLVE_LINES = [
  "It is only an egg. It has been here longer than you have.",
  "It opens. Something small and wet is looking at you, and it is looking back.",
  "A green thing. It is not a plant, whatever it wants you to believe.",
  "It learned to walk badly. Walk badly is still walking.",
  "It has a body now. A body is a promise it intends to keep.",
  "It stands like a person. It is beginning to suspect that it is not one.",
  "It is finished. There is nothing left to grow into. Only to become."
];

const FINALE_LINES = [
  "Do not feed it anymore. It eats light now.",
  "It has learned your voice. It will keep it. You may not.",
  "Ask it what it is. Then ask it what you are. Both answers are the same word.",
  "It was yours before you were. This is the last thing it will ever need from you."
];

function ptPush(out, x, y, pr, sh, tint, rng) {
  out.push({
    x: x,
    y: y,
    pr: pr,
    sh: clamp(sh, 0, 1.3),
    tint: tint == null ? 1 : tint,
    ph: rng() * Math.PI * 2,
    sp: 0.5 + rng() * 1.4,
    am: 0.4 + rng() * 0.6
  });
}

function addSphere(out, s, rng) {
  const n = Math.max(12, Math.round(s.n || 200));
  const squash = s.squash || 1;
  const golden = Math.PI * (1 + Math.sqrt(5));
  const pr = s.r * Math.sqrt((4 * Math.PI * squash) / n) * 0.62;
  const tint = (s.tint == null ? 1 : s.tint) * (s.dim == null ? 1 : s.dim);
  for (let i = 0; i < n; i++) {
    const k = i + 0.5;
    const phi = Math.acos(clamp(1 - (2 * k) / n, -1, 1));
    const theta = golden * k;
    const jx = (rng() - 0.5) * pr * 0.9;
    const jy = (rng() - 0.5) * pr * 0.9;
    const z = Math.cos(phi) * s.r;
    if (z < -s.r * 0.42) continue;
    const nx = Math.sin(phi) * Math.cos(theta);
    const ny = Math.sin(phi) * Math.sin(theta);
    ptPush(
      out,
      s.x + nx * s.r + jx,
      s.y + ny * s.r * squash + jy,
      pr * (0.85 + rng() * 0.35),
      0.5 + (z / (s.r * 2) + 0.21) * 1.25 + (rng() - 0.5) * 0.12,
      tint * (0.9 + rng() * 0.22),
      rng
    );
  }
}

function addCapsule(out, s, rng, style) {
  const n = Math.max(8, Math.round(s.n || 30));
  const dx = s.x2 - s.x;
  const dy = s.y2 - s.y;
  const len = Math.max(0.001, Math.hypot(dx, dy));
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;
  const tint = (s.tint == null ? 1 : s.tint) * (s.dim == null ? 1 : s.dim);
  const pr = len / Math.sqrt(n) * 0.58;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1 || 1);
    const r = lerp(s.r1, s.r2, t);
    const a = (rng() - 0.5) * r * 1.7;
    const b = (rng() - 0.5) * pr * 1.1;
    ptPush(
      out,
      s.x + ux * len * t + px * a + ux * b,
      s.y + uy * len * t + py * a + uy * b,
      Math.min(pr, r * 0.62) * (0.85 + rng() * 0.3),
      (style === "leaf" ? 0.55 : 0.72) + (rng() - 0.5) * 0.3 + t * 0.12,
      tint * (0.88 + rng() * 0.26),
      rng
    );
  }
}

function addRing(out, s, rng) {
  const n = Math.max(24, Math.round(s.n || 80));
  const tint = s.tint == null ? 1.5 : s.tint;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    ptPush(
      out,
      s.x + Math.cos(a) * s.r,
      s.y + Math.sin(a) * s.r * 0.3,
      s.thick * (0.7 + rng() * 0.7),
      0.85 + Math.sin(a) * 0.2,
      tint * (0.8 + rng() * 0.5),
      rng
    );
  }
}

function addFlower(out, s, rng) {
  const tint = s.tint == null ? 1 : s.tint;
  for (let p = 0; p < s.petals; p++) {
    const a = (p / s.petals) * Math.PI * 2;
    addSphere(
      out,
      {
        x: s.x + Math.cos(a) * s.r * 0.8,
        y: s.y + Math.sin(a) * s.r * 0.8,
        r: s.r * 0.52,
        squash: 0.55,
        n: 26,
        tint: tint
      },
      rng
    );
  }
  addSphere(out, { x: s.x, y: s.y, r: s.r * 0.42, squash: 0.8, n: 22, tint: tint * 1.35 }, rng);
}

function buildPoints(stageIndex, seed) {
  const def = STAGES[clamp(stageIndex, 0, STAGES.length - 1)];
  const rng = mulberry32(seed * 7919 + stageIndex * 104729 + 13);
  const out = [];
  for (const part of def.parts) {
    if (part.t === "sphere") addSphere(out, part, rng);
    else if (part.t === "cap") addCapsule(out, part, rng);
    else if (part.t === "leaf") addCapsule(out, part, rng, "leaf");
    else if (part.t === "ring") addRing(out, part, rng);
    else if (part.t === "flower") addFlower(out, part, rng);
  }
  return { points: out, face: def.face, stage: def };
}