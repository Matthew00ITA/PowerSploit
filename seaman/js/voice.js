const Voice = {
  SR: window.SpeechRecognition || window.webkitSpeechRecognition,
  sr: null,
  supported: false,
  listening: false,
  onSpeech: null,
  onState: null,
  narratorOn: true,
  sfxOn: true,
  ac: null,
  lastHeard: "",
  lastHeardAt: 0,
  voices: [],

  init() {
    this.supported = !!this.SR;
    this.loadVoices();
    const unlock = () => this.audio();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
  },

  loadVoices() {
    if (!window.speechSynthesis) return;
    this.voices = window.speechSynthesis.getVoices() || [];
  },

  pickVoice(deep) {
    if (!this.voices.length) this.loadVoices();
    const en = this.voices.filter((v) => /^en/i.test(v.lang));
    const male = ["daniel", "alex", "david", "george", "mark", "guy", "google uk english male", "aaron", "fred"];
    for (const m of male) {
      const hit = en.find((v) => v.name.toLowerCase().indexOf(m) >= 0);
      if (hit) return hit;
    }
    return en[0] || this.voices[0] || null;
  },

  speak(text, opt) {
    if (!window.speechSynthesis || !text) return;
    const o = opt || {};
    if (o.narrator && !this.narratorOn) return;
    const utter = new SpeechSynthesisUtterance(text);
    const v = this.pickVoice(!!o.narrator);
    if (v) utter.voice = v;
    if (o.creature) {
      utter.pitch = 2.1;
      utter.rate = 1.35;
      utter.volume = o.volume == null ? 0.55 : o.volume;
    } else {
      utter.pitch = 0.35;
      utter.rate = 0.88;
      utter.volume = o.volume == null ? 0.9 : o.volume;
    }
    try {
      window.speechSynthesis.speak(utter);
    } catch (e) {
      void e;
    }
  },

  narrate(text) {
    this.speak(text, { narrator: true });
  },

  creature(text, mood) {
    this.speak(text, { creature: true });
    if (mood === "happy" && this.sfxOn) this.sfx("chirp");
  },

  start() {
    if (!this.supported) {
      if (this.onState) this.onState("unsupported");
      return false;
    }
    if (this.listening) return true;
    try {
      const sr = new this.SR();
      sr.continuous = true;
      sr.interimResults = false;
      sr.maxAlternatives = 3;
      sr.lang = navigator.language && /^en/i.test(navigator.language) ? navigator.language : "en-US";
      sr.onresult = (ev) => {
        for (let i = ev.resultIndex; i < ev.results.length; i++) {
          const res = ev.results[i];
          if (!res.isFinal) continue;
          let best = null;
          for (let j = 0; j < res.length; j++) {
            const alt = res[j];
            if (!best || alt.confidence > best.confidence) best = alt;
          }
          const text = (best.transcript || "").trim();
          if (!text) continue;
          const now = performance.now();
          if (text.toLowerCase() === this.lastHeard && now - this.lastHeardAt < 2500) continue;
          this.lastHeard = text.toLowerCase();
          this.lastHeardAt = now;
          if (this.onSpeech) this.onSpeech(text, best.confidence);
        }
      };
      sr.onerror = (ev) => {
        if (ev.error === "not-allowed" || ev.error === "service-not-allowed") {
          this.listening = false;
          if (this.onState) this.onState("denied");
        }
      };
      sr.onend = () => {
        if (this.listening) {
          try {
            sr.start();
          } catch (e) {
            void e;
          }
        } else if (this.onState) this.onState("idle");
      };
      sr.start();
      this.sr = sr;
      this.listening = true;
      if (this.onState) this.onState("live");
      return true;
    } catch (e) {
      void e;
      if (this.onState) this.onState("error");
      return false;
    }
  },

  stop() {
    this.listening = false;
    if (this.sr) {
      try {
        this.sr.stop();
      } catch (e) {
        void e;
      }
      this.sr = null;
    }
    if (this.onState) this.onState("idle");
  },

  toggle() {
    if (this.listening) {
      this.stop();
      return false;
    }
    return this.start();
  },

  audio() {
    if (this.ac) return this.ac;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    try {
      this.ac = new Ctx();
    } catch (e) {
      void e;
      return null;
    }
    return this.ac;
  },

  tone(freq, dur, type, gain, slideTo, delay) {
    const ac = this.audio();
    if (!ac) return;
    const t0 = ac.currentTime + (delay || 0);
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain || 0.12, t0 + Math.min(0.05, dur * 0.3));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  },

  noise(dur, gain, filter, freq) {
    const ac = this.audio();
    if (!ac) return;
    const n = Math.floor(ac.sampleRate * dur);
    const buf = ac.createBuffer(1, n, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = ac.createBufferSource();
    src.buffer = buf;
    const biq = ac.createBiquadFilter();
    biq.type = filter || "lowpass";
    biq.frequency.value = freq || 1200;
    const g = ac.createGain();
    g.gain.value = gain == null ? 0.06 : gain;
    src.connect(biq).connect(g).connect(ac.destination);
    src.start();
  },

  sfx(name) {
    if (!this.sfxOn || !this.audio()) return;
    switch (name) {
      case "feed":
        this.tone(240, 0.22, "sine", 0.14, 90);
        break;
      case "drink":
        this.tone(520, 0.14, "sine", 0.1, 900);
        this.tone(700, 0.2, "sine", 0.07, 1500, 0.12);
        break;
      case "clean":
        this.noise(0.5, 0.05, "highpass", 2200);
        break;
      case "play":
        this.tone(420, 0.12, "square", 0.07, 880);
        this.tone(660, 0.18, "square", 0.05, 1180, 0.1);
        break;
      case "sleep":
        this.tone(320, 0.5, "sine", 0.08, 130);
        break;
      case "wake":
        this.tone(520, 0.18, "sine", 0.08, 880);
        break;
      case "medicine":
        this.tone(380, 0.16, "triangle", 0.08, 620);
        break;
      case "chirp":
        this.tone(900 + Math.random() * 260, 0.09, "sine", 0.05, 1500);
        break;
      case "evolve":
        [392, 523, 659, 784].forEach((f, i) => this.tone(f, 0.5, "triangle", 0.08, f * 1.02, i * 0.09));
        break;
      case "finale":
        [261, 329, 392, 523, 659, 784, 1046].forEach((f, i) => this.tone(f, 1.2, "sine", 0.09, f, i * 0.13));
        break;
      case "bug":
        this.noise(0.16, 0.05, "bandpass", 500);
        break;
      case "gift":
        this.tone(880, 0.1, "sine", 0.07, 1320);
        break;
      case "bless":
        [523, 784, 1046].forEach((f, i) => this.tone(f, 0.8, "sine", 0.07, f, i * 0.1));
        break;
      case "tap":
        this.tone(660, 0.05, "sine", 0.04, 520);
        break;
    }
  },

  song(freqs) {
    if (!this.sfxOn) return;
    freqs.forEach((f, i) => this.tone(f, 0.22, "sine", 0.07, f * 1.02, i * 0.26));
  }
};