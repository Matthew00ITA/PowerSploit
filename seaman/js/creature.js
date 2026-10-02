const NEED_KEYS = ["full", "water", "clean", "joy", "rest", "health"];
const NEED_LABEL = {
  full: "fullness",
  water: "water",
  clean: "clean",
  joy: "joy",
  rest: "rest",
  health: "health"
};

const WORDS = [
  { k: ["seaman"], r: ["SEAMAN!", "Seaman. Seaman.", "...seaman.", "yes! seaman!", "you said my name."], bond: 2.4, grow: true },
  { k: ["hello", "hi", "hey"], r: ["...hello.", "hello hello.", "oh. hello.", "hi.", "you came back."], bond: 1.4 },
  { k: ["good morning", "morning"], r: ["good morning.", "morning. it is morning?", "you are back. good."], bond: 1.2 },
  { k: ["bye", "goodbye"], r: ["bye.", "do not go.", "...bye.", "goodbye goodbye goodbye."], bond: 0.8 },
  { k: ["stomach"], r: ["stomach!", "my stomach.", "stomach stomach stomach."], bond: 0.6, act: "food" },
  { k: ["hungry", "eat", "food", "feed"], r: ["stomach!", "yes. food.", "i am hungry.", "feed me. please."], bond: 1, act: "food", need: "full" },
  { k: ["water", "drink", "thirsty"], r: ["water...", "ah. water.", "drink drink.", "wet. good."], bond: 1, act: "drink", need: "water" },
  { k: ["dirty", "clean", "wash", "poop", "sick", "stink"], r: ["dirty!", "it stinks.", "i am dirty. wash.", "bug. bug bug.", "not clean."], bond: 0.5, need: "clean" },
  { k: ["tired", "sleep", "rest"], r: ["sleep...", "tired.", "zzz.", "i will sleep now."], bond: 1, act: "sleep" },
  { k: ["wake", "wake up"], r: ["i am awake.", "awake. awake.", "...five more minutes."], bond: 0.8, act: "wake" },
  { k: ["play", "balloon", "fun"], r: ["play!", "balloon!", "again. again.", "fun fun fun."], bond: 1.6, act: "play", need: "joy" },
  { k: ["love", "loved"], r: ["love.", "...love?", "i love you too.", "you are warm."], bond: 3 },
  { k: ["thank", "thanks"], r: ["you are welcome.", "thank you.", "no. thank you."], bond: 1.4 },
  { k: ["yes"], r: ["yes.", "yes!", "yes yes yes."], bond: 0.8 },
  { k: ["no"], r: ["no.", "no no.", "why?"], bond: 0.6 },
  { k: ["up"], r: ["up.", "i go up.", "up up up."], bond: 0.7, dir: [0, -1] },
  { k: ["down"], r: ["down.", "i go down.", "down. ok."], bond: 0.7, dir: [0, 1] },
  { k: ["left"], r: ["left.", "this way?", "left left."], bond: 0.7, dir: [-1, 0] },
  { k: ["right"], r: ["right.", "other way.", "right right."], bond: 0.7, dir: [1, 0] },
  { k: ["hello seaman", "seaman hello"], r: ["hello, seaman.", "i am here."], bond: 1.5 },
  { k: ["grow", "bigger", "big"], r: ["i grow. i grow.", "big. bigger.", "watch me."], bond: 1.2, grow: true },
  { k: ["tree", "flower", "plant"], r: ["i grow a flower.", "tree?", "flower. for you.", "green. green green."], bond: 1.2, decor: "flower" },
  { k: ["star", "sky", "night"], r: ["star.", "so many stars.", "sky sky sky."], bond: 1.2, decor: "star" },
  { k: ["crown", "king", "queen"], r: ["i am the king.", "crown. mine.", "bow."], bond: 1.4, decor: "crown" },
  { k: ["sing", "song", "music"], r: ["la la la.", "singing.", "listen. listen."], bond: 1.2, sing: true },
  { k: ["doctor", "medicine", "pill"], r: ["doctor...", "medicine. yes.", "i am not sick. i am a little sick."], bond: 1, act: "medicine" },
  { k: ["hot", "cold", "warm"], r: ["warm.", "cold. cold.", "the light is warm."], bond: 0.8 },
  { k: ["who are you", "what are you", "your name"], r: ["i am seaman.", "i am. i am i am.", "you know my name. you said it first."], bond: 1.6 },
  { k: ["who are you", "what are you"], r: ["i am the thing in the water.", "i am what you kept."], bond: 1.6 },
  { k: ["god", "lord", "master", "owner"], r: ["...god.", "you are not a god. you are here.", "my god. is that you?"], bond: 1.2 },
  { k: ["friend", "friend?"], r: ["friend.", "are we friends?", "yes. friend."], bond: 1.8 },
  { k: ["forever", "always"], r: ["forever.", "always is a long time here.", "i will stay."], bond: 2 },
  { k: ["home"], r: ["this is home.", "home.", "you are home. i am home."], bond: 1.6 },
  { k: ["one"], r: ["one.", "one. two?", "one flower."], bond: 0.8, decor: "flower" },
  { k: ["two"], r: ["two.", "one two.", "two eyes."], bond: 0.8 },
  { k: ["three"], r: ["three.", "one two three."], bond: 0.8 },
  { k: ["good", "nice", "well done", "bravo"], r: ["good.", "i am good?", "yes. good good."], bond: 1.2 },
  { k: ["bad", "stop", "no more"], r: ["...oh.", "okay.", "sorry."], bond: -0.4 },
  { k: ["hello?"], r: ["hello.", "i hear you."], bond: 1 },
  { k: ["what", "why", "how", "where", "when"], r: ["?", "mm.", "i do not know. i am small.", "hmm?"], bond: 0.4 }
];

const CONFUSED = [
  "?",
  "...?",
  "mmm",
  "ah?",
  "hmm.",
  "??",
  "...what?",
  "not that word.",
  "say again.",
  "i do not know that one."
];

const IDLE = {
  calm: ["...", "hm.", "ah.", "water.", "hello?", "it is quiet.", "i am here."],
  hungry: ["stomach.", "food?", "i am hungry.", "stomach stomach.", "eat. eat."],
  thirsty: ["water.", "so dry.", "drink?", "water water."],
  dirty: ["dirty.", "bug!", "it stinks.", "wash wash wash.", "i need a bath."],
  sad: ["alone...", "you are not here.", "why.", "...", "do not leave."],
  sick: ["cough.", "not good.", "i feel strange.", "hrrr.", "ouch."],
  sleepy: ["sleepy...", "zzz...", "five more minutes.", "so tired."],
  happy: ["yes!", "good good.", "ha!", "again!", "wheee.", "i am happy."]
};

class Seaman {
  constructor(save) {
    this.rng = mulberry32(20250902);
    this.time = 0;
    this.stage = 0;
    this.age = 0;
    this.needs = { full: 58, water: 66, clean: 74, joy: 62, rest: 82, health: 96 };
    this.bond = 8;
    this.growth = 0.88;
    this.sick = false;
    this.sickTimer = 0;
    this.sleeping = false;
    this.asleep = false;
    this.mouth = 0;
    this.blink = 0;
    this.blinkTimer = 1.5;
    this.talking = 0;
    this.bubble = null;
    this.bubbleUntil = 0;
    this.pendingFood = false;
    this.pendingDrink = false;
    this.pendingPlay = false;
    this.pendingMedicine = false;
    this.decor = {};
    this.decorTimers = {};
    this.singUntil = 0;
    this.song = [];
    this.events = [];
    this.stats = { talked: 0, fed: 0, washed: 0, played: 0, days: 0, gifts: 0 };
    this.x = 0.5;
    this.y = 0.52;
    this.vx = 0;
    this.vy = 0;
    this.tx = 0.5;
    this.ty = 0.55;
    this.wanderTimer = 1.5;
    this.chatterTimer = 12;
    this.dragged = false;
    this.lastTalk = -999;
    this.warned = {};
    this.built = buildPoints(0, 1);
    this.decorSets = {
      flower: this.buildDecor("flower"),
      star: this.buildDecor("star"),
      crown: this.buildDecor("crown")
    };
    this.recomputeMood();
    if (save) this.load(save);
  }

  get def() {
    return STAGES[this.stage];
  }

  get scale() {
    return this.def.size * this.growth;
  }

  get care() {
    let s = 0;
    for (const k of NEED_KEYS) s += this.needs[k];
    return s / NEED_KEYS.length;
  }

  get worst() {
    let w = "health";
    let v = 101;
    for (const k of NEED_KEYS) {
      if (k === "health") continue;
      if (this.needs[k] < v) {
        v = this.needs[k];
        w = k;
      }
    }
    return { key: w, value: v };
  }

  buildDecor(kind) {
    const rng = mulberry32(kind.length * 7717 + 3);
    const out = [];
    if (kind === "flower") {
      addCapsule(out, { x: 0, y: -0.2, x2: 0.02, y2: -0.5, r1: 0.06, r2: 0.05, n: 22 }, rng);
      addFlower(out, { x: 0.03, y: -0.6, r: 0.16, petals: 6, n: 60, tint: 1.2 }, rng);
    } else if (kind === "star") {
      for (let i = 0; i < 5; i++) {
        const a = -Math.PI / 2 + (i / 5) * Math.PI * 2;
        addSphere(out, {
          x: Math.cos(a) * 0.2,
          y: -0.4 + Math.sin(a) * 0.2,
          r: 0.08,
          n: 14,
          tint: 1.6
        }, rng);
      }
    } else {
      for (let i = -1; i <= 1; i++) {
        addSphere(out, { x: i * 0.16, y: -0.4 - (i === 0 ? 0.1 : 0), r: 0.1, n: 16, tint: 1.5 }, rng);
      }
      addCapsule(out, { x: -0.2, y: -0.36, x2: 0.2, y2: -0.36, r1: 0.05, r2: 0.05, n: 26 }, rng);
    }
    return out;
  }

  emit(e) {
    this.events.push(e);
  }

  drain() {
    const out = this.events;
    this.events = [];
    return out;
  }

  voice(text, mood) {
    this.bubble = text;
    this.bubbleUntil = this.time + Math.min(9, 2.4 + text.length * 0.06);
    this.talking = Math.max(this.talking, 1.1 + text.length * 0.05);
    this.emit({ type: "voice", text: text, mood: mood || "calm" });
  }

  narrate(text) {
    this.emit({ type: "narr", text: text });
  }

  fx(kind, data) {
    this.emit({ type: "fx", kind: kind, data: data || {} });
  }

  update(dt) {
    if (dt <= 0) return;
    this.time += dt;
    const n = this.needs;
    const rate = this.asleep ? 0.55 : 1;

    n.full -= 0.4 * dt * rate;
    n.water -= 0.32 * dt * rate;
    n.clean -= 0.27 * dt * rate;
    n.joy -= 0.2 * dt * (this.asleep ? 0.4 : 1);
    n.rest += (this.asleep ? 3.4 : -0.19) * dt;

    const comfort = (n.full + n.water + n.clean + n.joy) / 4;
    if (comfort < 42) {
      n.health -= 0.55 * dt;
      this.sickTimer += dt;
    } else if (this.sick) {
      n.health += 0.18 * dt;
    } else {
      n.health += 0.42 * dt;
      this.sickTimer = Math.max(0, this.sickTimer - dt * 2);
    }

    const wasSick = this.sick;
    this.sick = this.sickTimer > 14 || n.health < 35;
    if (this.sick && !wasSick) {
      this.narrate("Something is wrong with it. It has not moved for a while.");
      this.fx("sick");
    }

    for (const k of NEED_KEYS) n[k] = clamp(n[k], 0, 100);

    if (this.rest <= 0 && !this.asleep) {
      this.sleeping = true;
      this.asleep = true;
      this.narrate("It closes its eyes without asking. Let it rest.");
    }
    if (this.asleep && n.rest > 96) {
      this.asleep = false;
      this.sleeping = false;
      this.voice(pick(this.rng, ["...good morning.", "i am awake.", "five more minutes."]), "sleepy");
    }

    const careFactor = clamp((this.care - 22) / 78, 0.04, 1.25) * (this.sick ? 0.15 : 1) * (n.rest < 18 ? 0.45 : 1);
    this.age += dt * 0.26 * careFactor;
    this.stats.days = this.age;

    const drift = (100 - this.care) / 100;
    this.growth = clamp(this.growth + (0.0022 * careFactor - 0.0011 * drift) * dt, 0.7, 1.18);
    this.bond = clamp(this.bond + (careFactor * 0.55 - 0.12) * dt, 0, 100);

    this.checkEvolution();
    this.checkNeeds();
    this.move(dt);
    this.express(dt);

    for (const k of Object.keys(this.decorTimers)) {
      this.decorTimers[k] -= dt;
      if (this.decorTimers[k] <= 0) delete this.decorTimers[k];
    }
    if (this.talking > 0) this.talking -= dt;
    if (this.mouth > 0) this.mouth = Math.max(0, this.mouth - dt * 2.6);
    if (this.time > this.bubbleUntil) this.bubble = null;

    this.chatterTimer -= dt;
    if (this.chatterTimer <= 0) {
      this.chatterTimer = lerp(26, 7, 1 - clamp(this.care / 100, 0, 1));
      if (this.time - this.lastTalk > 4) this.chatter();
    }
    this.recomputeMood();
  }

  checkEvolution() {
    const next = this.stage + 1;
    if (next >= STAGES.length) return;
    if (this.age < STAGES[next].minAge) return;
    if (this.care < 42 || this.sick) {
      if (!this.warned[next]) {
        this.warned[next] = true;
        this.narrate("It is trying to change, and it cannot. Something is missing.");
      }
      return;
    }
    this.evolve();
  }

  evolve() {
    const prev = this.stage;
    this.stage++;
    this.growth = clamp(this.growth + 0.06, 0.7, 1.18);
    this.built = buildPoints(this.stage, 1);
    this.narrate(EVOLVE_LINES[this.stage]);
    this.fx("evolve");
    if (prev < this.stage) this.blink = 1.2;
    if (this.stage === STAGES.length - 1) {
      this.narrate(FINALE_LINES[Math.floor(this.rng() * FINALE_LINES.length)]);
      this.voice(pick(this.rng, [
        "i am finished.",
        "there is nothing else to grow into.",
        "thank you for keeping me.",
        "say my name. one more time."
      ]), "happy");
      this.fx("finale");
    } else {
      this.voice(pick(this.rng, ["oh.", "ah!", "what was that.", "bigger.", "i changed."]), "happy");
    }
  }

  checkNeeds() {
    const n = this.needs;
    const w = this.warned;
    const warn = (key, bad, good, msg) => {
      if (bad() && !w[key]) {
        w[key] = true;
        this.narrate(msg);
      }
      if (good()) delete w[key];
    };
    warn("w_full", () => n.full < 28, () => n.full > 62, "Its stomach makes a sound you can hear through the glass.");
    warn("w_water", () => n.water < 28, () => n.water > 62, "The water it breathes is thinning. Give it water.");
    warn("w_clean", () => n.clean < 28, () => n.clean > 62, "The glass has gone green. It is embarrassed about it.");
    warn("w_joy", () => n.joy < 22, () => n.joy > 58, "It is bored enough to start talking to the wall.");
    warn("w_health", () => n.health < 30, () => n.health > 65, "It is fading. Bring it back — you are the only one here who can.");
    if (n.health <= 0 && !w.down) {
      w.down = true;
      this.narrate("It has stopped moving. Nothing here can die. But it can fall asleep for a very long time.");
    }
    if (n.health > 45) delete w.down;
  }

  move(dt) {
    this.wanderTimer -= dt;
    const fainted = this.needs.health <= 0;
    if (this.wanderTimer <= 0) {
      this.wanderTimer = 2 + this.rng() * 4;
      if (!this.dragged && !this.asleep && !fainted) {
        this.tx = 0.2 + this.rng() * 0.6;
        this.ty = this.stage === 0 ? 0.45 + this.rng() * 0.3 : 0.28 + this.rng() * 0.45;
      }
    }
    if (fainted && !this.dragged) this.ty = 0.78;
    let ax = this.tx - this.x;
    let ay = this.ty - this.y;
    const d = Math.hypot(ax, ay) || 1;
    const speed = (this.asleep || fainted ? 0.12 : 0.5) * (this.sick ? 0.35 : 1);
    ax = (ax / d) * speed;
    ay = (ay / d) * speed;
    this.vx = lerp(this.vx, ax, Math.min(1, dt * 2.2));
    this.vy = lerp(this.vy, ay, Math.min(1, dt * 2.2));
    this.x = clamp(this.x + this.vx * dt, 0.14, 0.86);
    this.y = clamp(this.y + this.vy * dt, this.asleep ? 0.72 : 0.22, 0.84);
    this.dragged = false;
  }

  express(dt) {
    this.blinkTimer -= dt;
    if (this.blinkTimer <= 0) {
      this.blinkTimer = 2.2 + this.rng() * 4;
      this.blink = 0.16;
    }
    if (this.blink > 0) this.blink -= dt;
  }

  recomputeMood() {
    const n = this.needs;
    if (this.sick) return (this.mood = "sick");
    if (this.asleep) return (this.mood = "sleepy");
    if (n.full < 26) return (this.mood = "hungry");
    if (n.water < 24) return (this.mood = "thirsty");
    if (n.clean < 24) return (this.mood = "dirty");
    if (n.rest < 22) return (this.mood = "sleepy");
    if (n.joy < 22) return (this.mood = "sad");
    if (this.care > 82) return (this.mood = "happy");
    if (this.care > 60) return (this.mood = "content");
    return (this.mood = "calm");
  }

  chatter() {
    const m = this.mood;
    if (m === "hungry" && !this.warned.feed) {
      this.warned.feed = true;
      this.narrate("Its stomach makes a sound you can hear through the glass.");
    }
    if (m === "happy" && this.stage === 0 && !this.warned.hatch) {
      this.warned.hatch = true;
      this.narrate("It is warm in there. Warmth is most of what a beginning needs.");
    }
    const pool = IDLE[m] || IDLE.calm;
    this.voice(pick(this.rng, pool), m);
  }

  act(name) {
    const n = this.needs;
    const out = { ok: false, note: "" };
    switch (name) {
      case "feed": {
        if (this.stage === 0) {
          this.voice(pick(this.rng, ["not yet.", "i cannot. not yet.", "wait. i am not ready."]), "calm");
          return (out.note = "It is still sealed inside. Warmth and time will do it.");
        }
        n.full = clamp(n.full + 26, 0, 100);
        n.joy = clamp(n.joy + 4, 0, 100);
        this.stats.fed++;
        this.bond = clamp(this.bond + 0.7, 0, 100);
        this.wake();
        this.voice(pick(this.rng, ["yum.", "good.", "more.", "ah. food.", "thank you."]), "happy");
        this.fx("gulp");
        out.ok = true;
        break;
      }
      case "water": {
        n.water = clamp(n.water + 30, 0, 100);
        n.full = clamp(n.full + 4, 0, 100);
        this.bond = clamp(this.bond + 0.5, 0, 100);
        this.wake();
        this.voice(pick(this.rng, ["ah. water.", "drink.", "cold. good.", "slurp."]), "content");
        this.fx("splash");
        out.ok = true;
        break;
      }
      case "clean": {
        n.clean = clamp(n.clean + 38, 0, 100);
        n.health = clamp(n.health + 6, 0, 100);
        this.stats.washed++;
        this.bond = clamp(this.bond + 0.6, 0, 100);
        this.voice(pick(this.rng, ["clean.", "bubbles.", "ah. nice.", "sparkle."]), "happy");
        this.fx("bubbles");
        if (this.sick && n.clean > 60 && this.rng() < 0.5) {
          this.sick = false;
          this.sickTimer = 0;
          this.narrate("The cloud around it thins. It is not sick any more.");
        }
        out.ok = true;
        break;
      }
      case "play": {
        n.joy = clamp(n.joy + 26, 0, 100);
        n.rest = clamp(n.rest - 5, 0, 100);
        this.stats.played++;
        this.bond = clamp(this.bond + 1.4, 0, 100);
        this.wake();
        this.voice(pick(this.rng, ["balloon!", "again!", "wheee.", "ha ha ha.", "more more more."]), "happy");
        this.fx("sparkles");
        out.ok = true;
        break;
      }
      case "sleep": {
        if (this.asleep) {
          this.asleep = false;
          this.sleeping = false;
          this.voice(pick(this.rng, ["i am awake.", "already awake.", "no sleep now."]), "sleepy");
        } else {
          this.sleeping = true;
          this.asleep = true;
          this.voice("sleep...", "sleepy");
          this.fx("zzz");
        }
        out.ok = true;
        break;
      }
      case "medicine": {
        if (!this.sick) {
          this.voice(pick(this.rng, ["i am fine.", "no medicine.", "i do not need that."]), "calm");
          out.note = "It does not think it is sick.";
          break;
        }
        this.sick = false;
        this.sickTimer = 0;
        n.health = clamp(n.health + 30, 0, 100);
        n.joy = clamp(n.joy + 6, 0, 100);
        this.bond = clamp(this.bond + 0.8, 0, 100);
        this.voice(pick(this.rng, ["better.", "thank you.", "gone. it is gone."]), "content");
        this.fx("sparkles");
        out.ok = true;
        break;
      }
    }
    this.recomputeMood();
    return out;
  }

  wake() {
    if (this.asleep) {
      this.asleep = false;
      this.sleeping = false;
      this.emit({ type: "woke" });
    }
  }

  hear(text, conf) {
    const raw = String(text || "").toLowerCase();
    const clean = " " + raw.replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim() + " ";
    this.stats.talked++;
    this.lastTalk = this.time;
    this.mouth = 1;
    this.talking = 1.4;
    this.bond = clamp(this.bond + 0.25, 0, 100);

    let best = null;
    for (const w of WORDS) {
      for (const k of w.k) {
        if (clean.indexOf(" " + k + " ") >= 0 || clean.indexOf(k + " ") === 0) {
          if (!best || k.length > best.len) best = { w: w, k: k, len: k.length };
        }
      }
    }

    const knows = this.def.words;
    const understood = !!(best && (knows.indexOf(best.k) >= 0 || best.w.k.some((k) => knows.indexOf(k) >= 0)));
    const lowConf = conf != null && conf < 0.35;

    if (!understood || lowConf) {
      if (this.stage >= 4 && this.bond > 60 && best) {
        this.voice(pick(this.rng, ["not that word.", "i know it. i do not know it.", "hmm. no."]), "calm");
      } else {
        this.voice(pick(this.rng, CONFUSED), "confused");
      }
      return { understood: false, word: best ? best.k : null };
    }

    const w = best.w;
    this.bond = clamp(this.bond + (w.bond || 0.6), 0, 100);

    if (w.grow) {
      this.growth = clamp(this.growth + 0.012, 0.7, 1.18);
      this.fx("sparkles");
    }
    if (w.dir) {
      this.tx = clamp(0.5 + w.dir[0] * 0.25, 0.15, 0.85);
      this.ty = clamp(this.y + w.dir[1] * 0.25, 0.25, 0.8);
    }
    if (w.decor) {
      this.decorTimers[w.decor] = 22;
      this.fx("sparkles");
    }
    if (w.sing) {
      this.singUntil = this.time + 4;
      this.song = [0, 0, 0, 0].map(() => 300 + this.rng() * 500);
      this.emit({ type: "sing" });
    }
    if (w.act === "sleep" && !this.asleep) this.act("sleep");
    if (w.act === "wake" && this.asleep) this.act("sleep");

    const line = pick(this.rng, w.r);
    this.voice(line, this.recomputeMood());

    if (w.act === "food" && this.needs.full < 45) this.pendingFood = true;
    if (w.act === "drink" && this.needs.water < 45) this.pendingDrink = true;
    if (w.act === "play" && this.needs.joy < 55) this.pendingPlay = true;
    if (w.act === "medicine" && this.sick) this.pendingMedicine = true;

    return { understood: true, word: best.k, want: w.act || null };
  }

  resurrect() {
    this.needs.health = 70;
    this.sick = false;
    this.sickTimer = 0;
    this.asleep = false;
    this.sleeping = false;
    this.bond = Math.max(this.bond, 15);
    this.growth = clamp(this.growth + 0.03, 0.7, 1.18);
    this.voice(pick(this.rng, ["still here.", "oh. hello.", "again."]), "confused");
    this.fx("finale");
  }

  save() {
    return {
      stage: this.stage,
      age: this.age,
      needs: this.needs,
      bond: this.bond,
      growth: this.growth,
      sick: this.sick,
      stats: this.stats,
      x: this.x,
      y: this.y
    };
  }

  load(s) {
    if (!s) return;
    this.stage = clamp(s.stage | 0, 0, STAGES.length - 1);
    this.age = Number(s.age) || 0;
    this.growth = clamp(Number(s.growth) || 0.88, 0.7, 1.18);
    this.bond = clamp(Number(s.bond) || 0, 0, 100);
    this.x = clamp(Number(s.x) || 0.5, 0.14, 0.86);
    this.y = clamp(Number(s.y) || 0.52, 0.22, 0.84);
    if (s.needs) for (const k of NEED_KEYS) this.needs[k] = clamp(Number(s.needs[k]) || 0, 0, 100);
    if (s.stats) for (const k in this.stats) if (s.stats[k] != null) this.stats[k] = s.stats[k];
    this.built = buildPoints(this.stage, 1);
    this.sick = !!s.sick;
    this.recomputeMood();
  }
}