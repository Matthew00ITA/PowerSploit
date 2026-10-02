const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const hud = {
  name: document.getElementById("cname"),
  stage: document.getElementById("stageTag"),
  age: document.getElementById("ageTxt"),
  bond: document.getElementById("bondTxt"),
  mood: document.getElementById("moodTxt"),
  bars: document.getElementById("bars"),
  log: document.getElementById("log"),
  narr: document.getElementById("narr"),
  hint: document.getElementById("micHint"),
  mic: document.getElementById("micBtn")
};

const SAVE_KEY = "seaman.sandbox.v1";
let W = 0;
let H = 0;
let DPR = 1;
let S = null;
let speed = 1;
let armed = null;
let flash = 0;
let saveTimer = 0;
let hintTimer = 0;
let narrTimer = 0;
let bugTimer = 0;
let rainTimer = 0;
let started = false;
const fx = new FX();
const world = { fx: fx, food: [], bugs: [], balloon: null, rain: [], pointer: null, creatureScreen: { x: 0, y: 0 }, S: null };
const TRAY_ICONS = { feed: "🍓", water: "💧", clean: "🫧", play: "🎈", sleep: "🌙", medicine: "💊" };

function resize() {
  DPR = Math.min(2, window.devicePixelRatio || 1);
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = Math.round(W * DPR);
  canvas.height = Math.round(H * DPR);
  canvas.style.width = W + "px";
  canvas.style.height = H + "px";
}

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    void e;
    return null;
  }
}

function storeSave() {
  try {
    if (S) localStorage.setItem(SAVE_KEY, JSON.stringify(S.save()));
  } catch (e) {
    void e;
  }
}

function log(text, cls) {
  const d = document.createElement("div");
  d.className = cls || "";
  d.textContent = text;
  hud.log.appendChild(d);
  while (hud.log.children.length > 6) hud.log.removeChild(hud.log.firstChild);
  setTimeout(() => {
    if (d.parentNode) d.parentNode.removeChild(d);
  }, 11000);
}

function narrate(text, speak) {
  hud.narr.textContent = text;
  hud.narr.classList.add("show");
  narrTimer = Math.max(5, Math.min(11, text.length * 0.055));
  if (speak !== false) Voice.narrate(text);
}

function hint(text) {
  hud.hint.textContent = text;
  hud.hint.classList.add("show");
  hintTimer = 3.6;
}

function mouthScreen() {
  const tk = Render.tank(W, H);
  const sc = Math.min(tk.h * 0.4, tk.w * 0.26) * S.scale;
  const f = S.built.face;
  return {
    x: tk.x + S.x * tk.w + f.x * sc,
    y: tk.y + S.y * tk.h + (f.y + f.r * 0.6) * sc + Math.sin(S.time * 1.5) * 0.006 * sc
  };
}

function tankPos(sx, sy) {
  const tk = Render.tank(W, H);
  return { x: clamp((sx - tk.x) / tk.w, 0, 0.98), y: clamp((sy - tk.y) / tk.h, 0, 0.98) };
}

function flyIn(icon, act, fromEl) {
  const m = mouthScreen();
  let sx;
  let sy;
  if (fromEl) {
    const r = fromEl.getBoundingClientRect();
    sx = r.left + r.width / 2;
    sy = r.top + r.height / 2;
  } else {
    sx = m.x;
    sy = H - 120;
  }
  world.food.push({
    icon: icon,
    act: act,
    sx: sx,
    sy: sy,
    x: sx,
    y: sy,
    t: 0,
    dur: 0.75 + Math.hypot(m.x - sx, m.y - sy) / 2600,
    size: 30,
    rot: 0,
    fade: 1
  });
  if (act === "feed" || act === "water" || act === "medicine") {
    world.food.push({
      icon: icon,
      act: null,
      sx: sx,
      sy: sy,
      x: sx,
      y: sy,
      t: 0.15,
      dur: 1.1,
      size: 18,
      rot: 0,
      fade: 0.5,
      trail: true
    });
  }
}

function doAct(name, el) {
  if (!S) return;
  if (name === "feed" || name === "water" || name === "medicine") {
    flyIn(TRAY_ICONS[name], name, el);
    return;
  }
  if (name === "clean") {
    const tk = Render.tank(W, H);
    for (let i = 0; i < 4; i++) {
      fx.spawn("bubble", tk.x + tk.w * (0.15 + i * 0.23), tk.y + tk.h * (0.2 + Math.random() * 0.4), 26, { r: 7, spread: 40 });
    }
    const res = S.act("clean");
    Voice.sfx("clean");
    if (res.note) log(res.note, "sys");
    return;
  }
  if (name === "play") {
    if (!world.balloon) spawnBalloon();
    const res = S.act("play");
    Voice.sfx("play");
    if (res.note) log(res.note, "sys");
    return;
  }
  if (name === "sleep") {
    const res = S.act("sleep");
    Voice.sfx(S.asleep ? "sleep" : "wake");
    if (res.note) log(res.note, "sys");
    syncTray();
    return;
  }
}

function spawnBalloon() {
  const tk = Render.tank(W, H);
  world.balloon = {
    x: tk.x + tk.w * (0.25 + Math.random() * 0.5),
    y: tk.y + tk.h * 0.4,
    vx: (Math.random() - 0.5) * 40,
    vy: -30 - Math.random() * 30,
    size: 34,
    nudges: 0
  };
}

function spawnGift(sx, sy) {
  const kinds = [
    { icon: "🌟", bond: 4 },
    { icon: "🌸", bond: 3 },
    { icon: "🍬", bond: 2 },
    { icon: "💎", bond: 5 }
  ];
  const k = kinds[Math.floor(Math.random() * kinds.length)];
  const m = mouthScreen();
  world.food.push({
    icon: k.icon,
    act: "gift",
    bonus: k.bond,
    sx: sx,
    sy: sy,
    x: sx,
    y: sy,
    t: 0,
    dur: 0.9 + Math.hypot(m.x - sx, m.y - sy) / 2200,
    size: 34,
    rot: 0,
    fade: 1
  });
  Voice.sfx("gift");
  fx.spawn("sparkle", sx, sy, 12, { r: 6, life: 0.8 });
  S.bond = clamp(S.bond + k.bond, 0, 100);
  S.stats.gifts++;
}

function power(name) {
  if (!S) return;
  switch (name) {
    case "bless": {
      const m = mouthScreen();
      fx.spawn("sparkle", m.x, m.y, 40, { r: 7, life: 1.3, spread: 220 });
      fx.spawn("ring", m.x, m.y, 2, { r: 20, life: 1.1 });
      S.bond = clamp(S.bond + 6, 0, 100);
      S.needs.joy = clamp(S.needs.joy + 8, 0, 100);
      Voice.sfx("bless");
      narrate("You touch the water. Everything inside it is briefly the colour of light.");
      break;
    }
    case "gift":
      armed = armed === "gift" ? null : "gift";
      updateArmed();
      break;
    case "rain": {
      rainTimer = 5;
      const tk = Render.tank(W, H);
      for (let i = 0; i < 90; i++) {
        world.rain.push({ x: tk.x + Math.random() * tk.w, y: tk.y + Math.random() * tk.h, len: 8 + Math.random() * 16, vy: 260 + Math.random() * 260 });
      }
      S.needs.water = clamp(S.needs.water + 22, 0, 100);
      S.needs.clean = clamp(S.needs.clean + 6, 0, 100);
      Voice.sfx("drink");
      narrate("You make it rain, here, inside a closed room. It does not question this.");
      break;
    }
    case "revive":
      if (S.needs.health < 60 || S.sick) {
        S.resurrect();
        narrate("You reach in and put it back together. It does not remember having been any other way.");
      } else {
        narrate("Nothing needs mending. It is only tired, like everything else here.");
      }
      break;
    case "newborn":
      if (confirm("End this life and begin again? This cannot be undone.")) {
        try {
          localStorage.removeItem(SAVE_KEY);
        } catch (e) {
          void e;
        }
        reset();
        narrate("A new shape appears in the water. It has never been told anything by you.");
      }
      break;
    case "speed":
      speed = speed === 1 ? 2 : speed === 2 ? 4 : 1;
      syncPower();
      break;
    case "help":
      showVocabulary();
      break;
  }
}

function updateArmed() {
  document.querySelectorAll("[data-power]").forEach((b) => {
    b.classList.toggle("armed", b.dataset.power === armed);
  });
}

function syncPower() {
  const b = document.querySelector('[data-power="speed"]');
  if (b) b.textContent = "time " + speed + "×";
}

function showVocabulary() {
  const w = S.def.words.slice(0, 12).join(", ");
  hint("right now it knows: " + w + " …");
  narrate("It only has a few words. Try the small ones: seaman, hello, water, up, love.", false);
}

function reset() {
  S = new Seaman(null);
  world.food.length = 0;
  world.bugs.length = 0;
  world.rain.length = 0;
  world.balloon = null;
  fx.items.length = 0;
  armed = null;
  updateArmed();
  narrate("Everything begins again with a small warm shape and no idea what you are.");
}

function handleSpeech(text, conf) {
  log("“" + text + "”", "sys");
  const res = S.hear(text, conf);
  if (!res.understood) {
    hint("it does not know that word yet");
    return;
  }
  if (S.pendingFood) {
    S.pendingFood = false;
    doAct("feed", null);
  }
  if (S.pendingDrink) {
    S.pendingDrink = false;
    doAct("water", null);
  }
  if (S.pendingPlay) {
    S.pendingPlay = false;
    doAct("play", null);
  }
  if (S.pendingMedicine) {
    S.pendingMedicine = false;
    doAct("medicine", null);
  }
}

const trayRefs = {};

function syncTray() {
  if (trayRefs.sleep) trayRefs.sleep.textContent = S.asleep ? "wake" : "sleep";
  if (trayRefs.medicine) trayRefs.medicine.classList.toggle("off", !S.sick);
}

function handleEvents() {
  for (const e of S.drain()) {
    if (e.type === "narr") {
      narrate(e.text);
    } else if (e.type === "voice") {
      Voice.creature(e.text, e.mood);
    } else if (e.type === "woke") {
      log("it opens its eyes", "sys");
      Voice.sfx("wake");
    } else if (e.type === "sing") {
      Voice.song(S.song);
      for (let i = 0; i < 8; i++) fx.spawn("note", mouthScreen().x, mouthScreen().y - 20, 1, { spread: 60 });
    } else if (e.type === "fx") {
      const m = mouthScreen();
      switch (e.kind) {
        case "gulp":
          fx.spawn("crumb", m.x, m.y, 12, { r: 3.4, spread: 120, vy: -60, life: 0.8 });
          Voice.sfx("feed");
          break;
        case "splash":
          fx.spawn("bubble", m.x, m.y, 26, { r: 6, spread: 120 });
          Voice.sfx("drink");
          break;
        case "bubbles":
          Voice.sfx("clean");
          break;
        case "sparkles":
          fx.spawn("sparkle", m.x, m.y, 18, { r: 6, life: 1, spread: 160 });
          break;
        case "zzz":
          fx.spawn("zzz", m.x + 18, m.y - 40, 5, {});
          Voice.sfx("sleep");
          break;
        case "sick":
          fx.spawn("splat", mouthScreen().x + 40, mouthScreen().y, 8, { r: 5, spread: 60 });
          break;
        case "evolve":
          fx.spawn("ring", m.x, m.y, 3, { r: 30, life: 1.6 });
          fx.spawn("sparkle", m.x, m.y, 46, { r: 8, life: 1.6, spread: 260 });
          flash = 1;
          Voice.sfx("evolve");
          break;
        case "finale":
          fx.spawn("ring", m.x, m.y, 4, { r: 20, life: 2.2 });
          fx.spawn("sparkle", m.x, m.y, 90, { r: 9, life: 2, spread: 340 });
          flash = 1.4;
          Voice.sfx("finale");
          break;
      }
    }
  }
}

function updateWorld(dt) {
  const tk = Render.tank(W, H);

  for (let i = world.food.length - 1; i >= 0; i--) {
    const f = world.food[i];
    f.t += dt / f.dur;
    const m = mouthScreen();
    const p = clamp(f.t, 0, 1);
    const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    f.x = lerp(f.sx, m.x, e);
    f.y = lerp(f.sy, m.y, e) - Math.sin(e * Math.PI) * 40;
    f.rot = Math.sin(p * 8) * 0.25;
    if (f.t >= 1) {
      world.food.splice(i, 1);
      if (f.act === "gift") {
        fx.spawn("heart", m.x, m.y, 8, { r: 6, life: 1.2, vy: -70, spread: 60 });
        S.voice(pick(S.rng, ["a gift?", "for me?", "mine.", "oh, lovely."]), "happy");
        continue;
      }
      if (f.act) {
        const res = S.act(f.act);
        if (res.note) log(res.note, "sys");
      }
    }
  }

  bugTimer -= dt;
  if (S.needs.clean < 46 && bugTimer <= 0 && world.bugs.length < 7 && !S.asleep) {
    bugTimer = 2.2 + Math.random() * 2.5;
    const edge = Math.floor(Math.random() * 4);
    const x = edge === 0 ? tk.x + 8 : edge === 1 ? tk.x + tk.w - 8 : tk.x + Math.random() * tk.w;
    const y = edge === 2 ? tk.y + 8 : edge === 3 ? tk.y + tk.h - 8 : tk.y + Math.random() * tk.h;
    world.bugs.push({ x: x, y: y, r: 5 + Math.random() * 3, rot: 0, vx: (Math.random() - 0.5) * 22, vy: (Math.random() - 0.5) * 22, ph: Math.random() * 6.28 });
  }

  for (let i = world.bugs.length - 1; i >= 0; i--) {
    const b = world.bugs[i];
    b.ph += dt * 7;
    b.vx += Math.cos(b.ph) * 26 * dt;
    b.vy += Math.sin(b.ph * 1.3) * 26 * dt;
    const sp = Math.hypot(b.vx, b.vy);
    const max = 26;
    if (sp > max) {
      b.vx = (b.vx / sp) * max;
      b.vy = (b.vy / sp) * max;
    }
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.rot = Math.atan2(b.vy, b.vx);
    if (b.x < tk.x + 8) {
      b.x = tk.x + 8;
      b.vx *= -1;
    }
    if (b.x > tk.x + tk.w - 8) {
      b.x = tk.x + tk.w - 8;
      b.vx *= -1;
    }
    if (b.y < tk.y + 8) {
      b.y = tk.y + 8;
      b.vy *= -1;
    }
    if (b.y > tk.y + tk.h - 8) {
      b.y = tk.y + tk.h - 8;
      b.vy *= -1;
    }
    if (S.needs.clean > 70 && Math.random() < dt * 0.15) world.bugs.splice(i, 1);
  }

  if (world.balloon) {
    const b = world.balloon;
    const nr = tankPos(b.x, b.y);
    S.tx = nr.x;
    S.ty = nr.y;
    b.vy += -6 * dt;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    if (b.y < tk.y + 40) {
      b.y = tk.y + 40;
      b.vy *= -0.6;
    }
    if (b.x < tk.x + 30 || b.x > tk.x + tk.w - 30) b.vx *= -1;
    const m = mouthScreen();
    const d = Math.hypot(m.x - b.x, m.y - b.y);
    const reach = Math.min(tk.h * 0.4, tk.w * 0.26) * S.scale * 0.8;
    if (d < reach) {
      b.nudges++;
      b.vx = (b.x - m.x) * 2.4;
      b.vy = (b.y - m.y) * 2.4;
      S.needs.joy = clamp(S.needs.joy + 3.5, 0, 100);
      S.bond = clamp(S.bond + 0.2, 0, 100);
      fx.spawn("heart", b.x, b.y - 20, 1, { r: 4, life: 0.9, vy: -40 });
      if (b.nudges % 3 === 0) S.voice(pick(S.rng, ["balloon!", "again!", "ha!", "more more."]), "happy");
      Voice.sfx("chirp");
      if (b.nudges > 14) {
        world.balloon = null;
        S.stats.played++;
      }
    }
  }

  if (rainTimer > 0) {
    rainTimer -= dt;
    for (let i = world.rain.length - 1; i >= 0; i--) {
      const d = world.rain[i];
      d.y += d.vy * dt;
      if (d.y > tk.y + tk.h) world.rain.splice(i, 1);
    }
    if (Math.random() < dt * 3) {
      fx.spawn("bubble", tk.x + Math.random() * tk.w, tk.y + tk.h, 1, { r: 5 });
    }
    if (rainTimer <= 0) world.rain.length = 0;
  }
}

function updateHud() {
  const def = S.def;
  hud.stage.textContent = def.name;
  hud.age.textContent = S.age.toFixed(1) + " days";
  hud.bond.textContent = "bond " + Math.round(S.bond) + (S.bond > 70 ? " · ♥" : "");
  hud.mood.textContent = S.mood;
  hud.mood.style.color = S.mood === "sick" || S.mood === "sad" ? "#ff9d7a" : S.mood === "happy" ? "#ffe08a" : "";
  const kids = hud.bars.children;
  for (let i = 0; i < NEED_KEYS.length; i++) {
    const k = NEED_KEYS[i];
    const row = kids[i];
    if (!row) continue;
    const v = Math.round(S.needs[k]);
    row.style.setProperty("--v", v + "%");
    row.style.setProperty("--c", v < 25 ? "#ff7a6a" : v < 50 ? "#ffc46a" : "#7fe3d0");
    row.classList.toggle("low", v < 22);
  }
}

function buildBars() {
  hud.bars.innerHTML = "";
  for (const k of NEED_KEYS) {
    const row = document.createElement("div");
    row.className = "bar";
    row.innerHTML = "<span>" + NEED_LABEL[k] + "</span><i></i>";
    hud.bars.appendChild(row);
  }
}

function frame(now) {
  requestAnimationFrame(frame);
  const raw = Math.min(0.05, (now - (frame.last || now)) / 1000);
  frame.last = now;
  const dt = started ? raw * speed : 0;

  if (dt > 0) {
    S.update(dt);
    fx.update(dt);
    updateWorld(dt);
    handleEvents();
    saveTimer -= dt;
    if (saveTimer <= 0) {
      saveTimer = 5;
      storeSave();
    }
  }

  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  world.S = S;
  world.creatureScreen = { x: W * S.x, y: H * S.y };
  const tk = Render.draw(ctx, world, W, H, raw, now / 1000);
  world.creatureScreen = {
    x: tk.x + S.x * tk.w,
    y: tk.y + S.y * tk.h
  };

  if (flash > 0) {
    flash = Math.max(0, flash - raw * 1.1);
    ctx.fillStyle = "rgba(255,240,200," + (flash * 0.4).toFixed(3) + ")";
    ctx.fillRect(0, 0, W, H);
  }

  if (hintTimer > 0) {
    hintTimer -= raw;
    if (hintTimer <= 0) hud.hint.classList.remove("show");
  }
  if (narrTimer > 0) {
    narrTimer -= raw;
    if (narrTimer <= 0) hud.narr.classList.remove("show");
  }

  hudTick += raw;
  if (hudTick > 0.2) {
    hudTick = 0;
    updateHud();
    syncTray();
  }
}

let hudTick = 0;

function pointerDown(ev) {
  Voice.audio();
  if (!started) return;
  const x = ev.clientX;
  const y = ev.clientY;
  for (let i = world.bugs.length - 1; i >= 0; i--) {
    const b = world.bugs[i];
    if (Math.hypot(b.x - x, b.y - y) < b.r * 2.6) {
      world.bugs.splice(i, 1);
      fx.spawn("splat", b.x, b.y, 7, { r: 5, spread: 90 });
      S.needs.clean = clamp(S.needs.clean + 4, 0, 100);
      Voice.sfx("bug");
      S.bond = clamp(S.bond + 0.3, 0, 100);
      return;
    }
  }
  if (armed === "gift") {
    spawnGift(x, y);
    armed = null;
    updateArmed();
    return;
  }
  const n = tankPos(x, y);
  S.tx = n.x;
  S.ty = n.y;
  S.dragged = true;
  if (ev.pointerType !== "mouse") ev.preventDefault();
}

function init() {
  resize();
  window.addEventListener("resize", resize);
  Render.init();
  buildBars();
  S = new Seaman(loadSave());
  world.S = S;

  Voice.init();
  Voice.onSpeech = handleSpeech;
  Voice.onState = (st) => {
    hud.mic.classList.toggle("live", st === "live");
    if (st === "denied") hint("the microphone was refused — you can still type to it");
    if (st === "unsupported") hint("this browser has no speech recognition — type to it instead");
    if (st === "idle") hud.mic.classList.remove("live");
  };
  if (!Voice.supported) hud.mic.classList.add("dead");

  document.querySelectorAll("[data-act]").forEach((b) => {
    b.addEventListener("click", () => doAct(b.dataset.act, b));
    if (b.dataset.act === "sleep") trayRefs.sleep = b.querySelector("span:last-child");
    if (b.dataset.act === "medicine") trayRefs.medicine = b;
  });
  document.querySelectorAll("[data-power]").forEach((b) => {
    b.addEventListener("click", () => power(b.dataset.power));
  });
  document.querySelectorAll("[data-toggle]").forEach((b) => {
    b.addEventListener("click", () => {
      const k = b.dataset.toggle;
      if (k === "narrator") {
        Voice.narratorOn = !Voice.narratorOn;
        b.classList.toggle("on", Voice.narratorOn);
        if (Voice.narratorOn) Voice.narrate("I am still here.");
      } else {
        Voice.sfxOn = !Voice.sfxOn;
        b.classList.toggle("on", Voice.sfxOn);
      }
    });
  });
  hud.mic.addEventListener("click", () => {
    Voice.toggle();
  });
  document.getElementById("sayForm").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const input = document.getElementById("sayInput");
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    handleSpeech(text, null);
  });

  canvas.addEventListener("pointermove", (ev) => {
    world.pointer = { x: ev.clientX, y: ev.clientY };
    if (ev.buttons && started) {
      const n = tankPos(ev.clientX, ev.clientY);
      S.tx = n.x;
      S.ty = n.y;
      S.dragged = true;
    }
  });
  canvas.addEventListener("pointerleave", () => {
    world.pointer = null;
  });
  canvas.addEventListener("pointerdown", pointerDown);

  window.addEventListener("keydown", (ev) => {
    if (ev.target && ev.target.tagName === "INPUT") return;
    const map = { "1": "feed", "2": "water", "3": "clean", "4": "play", "5": "sleep", "6": "medicine" };
    if (map[ev.key]) {
      doAct(map[ev.key], document.querySelector('[data-act="' + map[ev.key] + '"]'));
      return;
    }
    const k = ev.key.toLowerCase();
    if (k === "m") Voice.toggle();
    else if (k === "b") power("bless");
    else if (k === "g") power("gift");
    else if (k === "r") power("rain");
    else if (k === "v") power("revive");
    else if (k === "n") power("newborn");
    else if (k === "t") power("speed");
    else if (k === "?" || k === "/") power("help");
    else if (ev.key === "Enter" && !started) begin();
  });

  window.addEventListener("beforeunload", storeSave);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) storeSave();
  });
  window.speechSynthesis && window.speechSynthesis.addEventListener && window.speechSynthesis.addEventListener("voiceschanged", () => Voice.loadVoices());

  syncPower();
  syncTray();
  updateHud();
  requestAnimationFrame(frame);
}

function begin() {
  if (started) return;
  started = true;
  document.getElementById("veil").classList.add("gone");
  Voice.audio();
  const resumed = S.age > 0;
  narrate(
    resumed
      ? "You come back. It is exactly where you left it, which is more than most things manage."
      : "Something has been growing in the water for a very long time. It is yours now, and you are all it has.",
    true
  );
  hint(S.stage === 0 ? "try: feed it, or just say hello" : "say its name: “seaman”");
}

document.getElementById("beginBtn").addEventListener("click", begin);
document.getElementById("veil").addEventListener("click", (ev) => {
  if (ev.target.id === "veil") begin();
});

init();