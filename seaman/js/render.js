const Render = {
  motes: [],
  shafts: [],

  init() {
    const rng = mulberry32(4242);
    for (let i = 0; i < 70; i++) {
      this.motes.push({ x: rng(), y: rng(), r: 0.4 + rng() * 1.9, sp: 0.01 + rng() * 0.05, ph: rng() * 6.28 });
    }
    for (let i = 0; i < 6; i++) {
      this.shafts.push({ x: 0.06 + i * 0.18, w: 0.05 + rng() * 0.08, sp: 0.04 + rng() * 0.05, ph: rng() * 6.28 });
    }
  },

  tank(W, H) {
    const padX = Math.max(14, W * 0.045);
    const top = Math.max(20, H * 0.085);
    const bottom = H - Math.max(112, H * 0.2);
    return { x: padX, y: top, w: Math.max(80, W - padX * 2), h: Math.max(120, bottom - top) };
  },

  toScreen(tk, nx, ny) {
    return { x: tk.x + nx * tk.w, y: tk.y + ny * tk.h };
  },

  roundRect(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w * 0.5, h * 0.5);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  },

  draw(ctx, v, W, H, dt, t) {
    const tk = this.tank(W, H);
    const S = v.S;
    this.background(ctx, W, H, t, dt);
    this.water(ctx, tk, t, S);
    this.items(ctx, v, tk, t);
    this.creature(ctx, S, v, tk, t, W, H);
    v.fx.draw(ctx);
    this.bubble(ctx, S, tk, t, W, H);
    if (S.asleep) {
      ctx.fillStyle = "rgba(2,8,18,0.35)";
      this.roundRect(ctx, tk.x, tk.y, tk.w, tk.h, 22);
      ctx.fill();
    }
    return tk;
  },

  background(ctx, W, H, t, dt) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#02060c");
    g.addColorStop(0.45, "#062030");
    g.addColorStop(1, "#010a12");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const s of this.shafts) {
      const x = (s.x + Math.sin(t * s.sp + s.ph) * 0.02) * W;
      const sw = s.w * W;
      const grad = ctx.createLinearGradient(x, 0, x + sw, H * 0.8);
      grad.addColorStop(0, "rgba(120,220,255,0.075)");
      grad.addColorStop(1, "rgba(120,220,255,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + sw, 0);
      ctx.lineTo(x + sw * 2.6, H * 0.85);
      ctx.lineTo(x + sw * 0.8, H * 0.85);
      ctx.closePath();
      ctx.fill();
    }
    for (const m of this.motes) {
      m.y -= m.sp * dt;
      if (m.y < -0.02) {
        m.y = 1.02;
        m.x = Math.random();
      }
      ctx.globalAlpha = 0.16 + 0.16 * Math.sin(t * 1.4 + m.ph);
      ctx.fillStyle = "#bfe9ff";
      ctx.beginPath();
      ctx.arc(m.x * W, m.y * H, m.r, 0, 6.2832);
      ctx.fill();
    }
    ctx.restore();
  },

  water(ctx, tk, t, S) {
    ctx.save();
    ctx.shadowColor = "rgba(0,180,220,0.35)";
    ctx.shadowBlur = 40;
    this.roundRect(ctx, tk.x, tk.y, tk.w, tk.h, 22);
    const g = ctx.createLinearGradient(0, tk.y, 0, tk.y + tk.h);
    g.addColorStop(0, "rgba(24,86,110,0.72)");
    g.addColorStop(0.55, "rgba(10,48,70,0.8)");
    g.addColorStop(1, "rgba(4,20,34,0.9)");
    ctx.fillStyle = g;
    ctx.fill();
    ctx.restore();

    ctx.save();
    this.roundRect(ctx, tk.x, tk.y, tk.w, tk.h, 22);
    ctx.clip();

    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = "rgba(150,235,255," + (0.05 - i * 0.012) + ")";
      ctx.lineWidth = 2 + i;
      ctx.beginPath();
      for (let x = 0; x <= tk.w; x += 12) {
        const y =
          tk.y +
          tk.h * (0.2 + i * 0.24) +
          Math.sin(x * 0.012 + t * (0.6 + i * 0.2)) * 10 +
          Math.sin(x * 0.031 - t * 0.9) * 4;
        if (x === 0) ctx.moveTo(tk.x + x, y);
        else ctx.lineTo(tk.x + x, y);
      }
      ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";

    const floorY = tk.y + tk.h * 0.9;
    ctx.fillStyle = "rgba(16,34,44,0.85)";
    ctx.beginPath();
    ctx.ellipse(tk.x + tk.w * 0.5, floorY + 30, tk.w * 0.62, 54, 0, 0, 6.2832);
    ctx.fill();
    ctx.fillStyle = "rgba(120,150,140,0.13)";
    ctx.beginPath();
    ctx.ellipse(tk.x + tk.w * 0.5, floorY + 12, tk.w * 0.55, 26, 0, 0, 6.2832);
    ctx.fill();

    this.plant(ctx, tk, t, S);

    ctx.strokeStyle = "rgba(190,240,255,0.28)";
    ctx.lineWidth = 2;
    this.roundRect(ctx, tk.x, tk.y, tk.w, tk.h, 22);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(tk.x + 10, tk.y + tk.h * 0.24);
    ctx.lineTo(tk.x + 10, tk.y + tk.h * 0.7);
    ctx.stroke();
    ctx.restore();
  },

  plant(ctx, tk, t, S) {
    const bx = tk.x + tk.w * 0.14;
    const by = tk.y + tk.h * 0.9;
    const leaves = 1 + S.stage;
    const h = 40 + S.stage * 16;
    const wilt = S.needs.clean < 35 ? 1 : 0;
    ctx.save();
    ctx.strokeStyle = wilt ? "rgba(96,110,70,0.6)" : "rgba(78,150,120,0.65)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.quadraticCurveTo(bx + Math.sin(t * 0.8) * 6, by - h * 0.6, bx + Math.sin(t * 0.8) * 10, by - h);
    ctx.stroke();
    for (let i = 0; i < leaves; i++) {
      const f = (i + 1) / (leaves + 1);
      const y = by - h * f;
      const sway = Math.sin(t * 1.1 + i) * 5;
      const dir = i % 2 ? 1 : -1;
      ctx.fillStyle = wilt ? "rgba(104,116,74,0.5)" : "rgba(86,166,132,0.5)";
      ctx.beginPath();
      ctx.ellipse(bx + sway + dir * 12, y, 15 - i * 1.6, 6, dir * 0.5, 0, 6.2832);
      ctx.fill();
    }
    ctx.restore();
  },

  items(ctx, v, tk, t) {
    for (const f of v.food) {
      ctx.save();
      ctx.globalAlpha = f.fade == null ? 1 : f.fade;
      ctx.translate(f.x, f.y);
      ctx.rotate(f.rot || 0);
      ctx.font = Math.round(f.size || 30) + "px " + FONT_UI;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(f.icon, 0, 0);
      ctx.restore();
    }
    if (v.balloon) {
      const b = v.balloon;
      ctx.save();
      ctx.font = Math.round(b.size) + "px " + FONT_UI;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.translate(b.x, b.y);
      ctx.rotate(Math.sin(t * 2) * 0.16);
      ctx.fillText("🎈", 0, 0);
      ctx.restore();
    }
    if (v.rain) {
      ctx.save();
      ctx.strokeStyle = "rgba(180,235,255,0.5)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      for (const d of v.rain) {
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 2, d.y + d.len);
      }
      ctx.stroke();
      ctx.restore();
    }
    for (const b of v.bugs) {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rot);
      ctx.fillStyle = "rgba(26,32,28,0.85)";
      ctx.beginPath();
      ctx.ellipse(0, 0, b.r * 1.25, b.r * 0.8, 0, 0, 6.2832);
      ctx.fill();
      ctx.strokeStyle = "rgba(26,32,28,0.8)";
      ctx.lineWidth = 1;
      for (let i = -1; i <= 1; i += 2) {
        for (let j = -1; j <= 1; j++) {
          ctx.beginPath();
          ctx.moveTo(i * b.r * 0.5, 0);
          ctx.lineTo(i * b.r * 0.9, j * b.r * 0.7);
          ctx.stroke();
        }
      }
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.beginPath();
      ctx.arc(-b.r * 0.3, -b.r * 0.2, b.r * 0.16, 0, 6.2832);
      ctx.fill();
      ctx.restore();
    }
  },

  creature(ctx, S, v, tk, t, W, H) {
    const unit = Math.min(tk.h * 0.4, tk.w * 0.26);
    const sc = unit * S.scale;
    const cx = tk.x + S.x * tk.w;
    const cy = tk.y + S.y * tk.h;
    const bob = Math.sin(t * 1.5) * 0.05 + Math.sin(t * 0.7) * 0.02;
    const tilt = clamp(S.vx * 0.55, -0.22, 0.22) + Math.sin(t * 0.9) * 0.03;

    if (S.def.glow || S.talking > 0) {
      const g = ctx.createRadialGradient(cx, cy, sc * 0.1, cx, cy, sc * 1.5);
      g.addColorStop(0, S.def.glow ? "rgba(255,232,170,0.2)" : "rgba(160,255,230,0.14)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, sc * 1.5, 0, 6.2832);
      ctx.fill();
    }

    ctx.save();
    ctx.translate(cx, cy + bob * sc * 0.12);
    ctx.rotate(tilt);
    ctx.scale(sc, sc);

    const hue = S.sick ? 96 : 8 + S.bond * 0.06;
    const sat = S.sick ? 34 : 62;
    const buckets = 6;
    const groups = [];
    for (let i = 0; i < buckets; i++) groups.push([]);

    const pts = S.built.points;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const px = p.x + Math.sin(t * p.sp + p.ph) * 0.02 * p.am;
      const py = p.y + Math.cos(t * p.sp * 0.83 + p.ph * 1.7) * 0.017 * p.am;
      const b = clamp(Math.floor(p.sh * 4.2), 0, buckets - 1);
      groups[b].push(px, py, p.pr);
    }

    for (let b = 0; b < buckets; b++) {
      const g = groups[b];
      if (!g.length) continue;
      const light = 26 + (b / (buckets - 1)) * 42;
      ctx.fillStyle = "hsl(" + hue.toFixed(1) + "," + sat + "%," + light.toFixed(1) + "%)";
      ctx.beginPath();
      for (let i = 0; i < g.length; i += 3) {
        ctx.moveTo(g[i] + g[i + 2], g[i + 1]);
        ctx.arc(g[i], g[i + 1], g[i + 2], 0, 6.2832);
      }
      ctx.fill();
    }

    for (const key in S.decorTimers) {
      const set = S.decorSets[key];
      if (!set) continue;
      const f = S.built.face;
      const oy = f.y - f.r * 1.15;
      const fade = clamp(S.decorTimers[key] / 2, 0, 1);
      ctx.globalAlpha = 0.35 + 0.65 * fade;
      ctx.fillStyle = "hsl(" + (key === "flower" ? 330 : 50) + ",80%," + (48 + Math.sin(t * 4) * 8) + "%)";
      ctx.beginPath();
      for (const p of set) {
        ctx.moveTo(p.x + p.pr, p.y + oy);
        ctx.arc(p.x, p.y + oy, p.pr, 0, 6.2832);
      }
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    this.face(ctx, S, t, v);
    ctx.restore();
  },

  face(ctx, S, t, v) {
    const f = S.built.face;
    const open = S.needs.health <= 0 ? 0 : clamp(1 - S.blink / 0.16, 0, 1) * S.def.eyes;
    const ex = f.r * 0.52;
    const ey = f.y - f.r * 0.1;
    const er = f.r * 0.36;

    if (open < 0.25) {
      ctx.strokeStyle = "rgba(60,30,30,0.8)";
      ctx.lineWidth = Math.max(0.012, f.r * 0.07);
      ctx.lineCap = "round";
      for (const s of [-1, 1]) {
        ctx.beginPath();
        ctx.arc(s * ex, ey + er * 0.5, er * 0.8, Math.PI * 1.08, Math.PI * 1.92);
        ctx.stroke();
      }
      if (S.def.eyes > 0.4) {
        ctx.strokeStyle = "rgba(70,30,32,0.75)";
        ctx.lineWidth = f.r * 0.09;
        ctx.beginPath();
        ctx.moveTo(-f.r * 0.22, f.y + f.r * 0.55);
        ctx.lineTo(f.r * 0.22, f.y + f.r * 0.55);
        ctx.stroke();
      }
      return;
    }

    let lookX = 0;
    let lookY = 0;
    if (v.pointer) {
      const dx = v.pointer.x - v.creatureScreen.x;
      const dy = v.pointer.y - v.creatureScreen.y;
      const d = Math.max(1, Math.hypot(dx, dy));
      lookX = clamp((dx / d) * er * 0.45, -er * 0.5, er * 0.5);
      lookY = clamp((dy / d) * er * 0.4, -er * 0.4, er * 0.4);
    }

    for (const s of [-1, 1]) {
      ctx.fillStyle = "#fdfaf6";
      ctx.beginPath();
      ctx.ellipse(s * ex, ey, er, er * (0.35 + open * 0.75), 0, 0, 6.2832);
      ctx.fill();
      ctx.fillStyle = "#1b1016";
      ctx.beginPath();
      ctx.arc(s * ex + lookX, ey + lookY, er * 0.46, 0, 6.2832);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.beginPath();
      ctx.arc(s * ex + lookX - er * 0.16, ey + lookY - er * 0.18, er * 0.13, 0, 6.2832);
      ctx.fill();
      if (S.mood === "happy" || S.bond > 65) {
        ctx.fillStyle = "rgba(255,120,140,0.3)";
        ctx.beginPath();
        ctx.ellipse(s * ex * 1.5, ey + er * 0.75, er * 0.5, er * 0.3, 0, 0, 6.2832);
        ctx.fill();
      }
    }

    const sad = S.mood === "sad" || S.mood === "sick";
    const mh = f.r * (0.05 + clamp(S.mouth + S.talking * 0.4, 0, 1) * 0.4);
    const mw = f.r * 0.34;
    const my = f.y + f.r * 0.62;
    ctx.strokeStyle = "rgba(70,26,32,0.9)";
    ctx.lineWidth = f.r * 0.1;
    ctx.lineCap = "round";
    ctx.beginPath();
    if (sad) {
      ctx.arc(0, my + mh * 1.6, mw, Math.PI * 1.18, Math.PI * 1.82);
    } else if (S.talking > 0) {
      ctx.ellipse(0, my, mw * 0.8, Math.max(mh, f.r * 0.1), 0, 0, 6.2832);
      ctx.fillStyle = "#5d1c2c";
      ctx.fill();
      ctx.fillStyle = "#e8708c";
      ctx.beginPath();
      ctx.ellipse(0, my + mh * 0.55, mw * 0.4, mh * 0.34, 0, 0, 6.2832);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.arc(0, my - mh * 0.6, mw, Math.PI * 0.2, Math.PI * 0.8);
    }
    ctx.stroke();
  },

  bubble(ctx, S, tk, t, W, H) {
    if (!S.bubble) return;
    const f = S.built.face;
    const sc = Math.min(tk.h * 0.4, tk.w * 0.26) * S.scale;
    const cx = tk.x + S.x * tk.w;
    const cy = tk.y + S.y * tk.h;
    const bx = cx + f.x * sc;
    const by = cy + (f.y - f.r * 1.5) * sc;

    const size = clamp(Math.min(W, H) * 0.024, 15, 26);
    ctx.save();
    ctx.font = size + "px " + FONT_HAND;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    const maxW = clamp(W * 0.24, 150, 280);
    const words = String(S.bubble).split(" ");
    const lines = [];
    let line = "";
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxW && line) {
        lines.push(line);
        line = w;
      } else line = test;
    }
    if (line) lines.push(line);

    const lh = size * 1.12;
    const wBox = Math.max(...lines.map((l) => ctx.measureText(l).width)) + size * 1.3;
    const hBox = lines.length * lh + size * 0.7;
    let x = clamp(bx - wBox / 2, tk.x + 6, tk.x + tk.w - wBox - 6);
    let y = clamp(by - hBox - size * 0.8, tk.y + 6, tk.y + tk.h - hBox - 6);
    if (S.asleep) y += 6;

    const age = clamp((S.bubbleUntil - S.time) / 0.6, 0, 1);
    ctx.globalAlpha = age;

    ctx.fillStyle = "rgba(248,252,255,0.94)";
    this.roundRect(ctx, x, y, wBox, hBox, size * 0.5);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(bx - size * 0.32, y + hBox - 1);
    ctx.lineTo(bx + size * 0.02, y + hBox + size * 0.5);
    ctx.lineTo(bx + size * 0.34, y + hBox - 1);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#20323f";
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], x + size * 0.65, y + size * 0.95 + i * lh);
    }
    ctx.restore();
  }
};