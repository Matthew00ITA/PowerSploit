class FX {
  constructor() {
    this.items = [];
  }

  spawn(kind, x, y, count, data) {
    const d = data || {};
    for (let i = 0; i < (count || 1); i++) {
      const p = {
        kind: kind,
        x: x + (d.sx || 0) * (Math.random() - 0.5),
        y: y + (d.sy || 0) * (Math.random() - 0.5),
        vx: (d.vx || 0) + (Math.random() - 0.5) * (d.spread || 60),
        vy: (d.vy || 0) + (Math.random() - 0.5) * (d.spread || 60),
        r: (d.r || 5) * (0.6 + Math.random() * 0.8),
        life: 0,
        max: (d.life || 1.1) * (0.7 + Math.random() * 0.6),
        rot: Math.random() * 6.28,
        vr: (Math.random() - 0.5) * 6,
        g: d.g == null ? 0 : d.g
      };
      if (kind === "bubble") {
        p.vy = -(40 + Math.random() * 90);
        p.vx = (Math.random() - 0.5) * 30;
        p.max = 1.6 + Math.random() * 1.8;
      }
      if (kind === "zzz") {
        p.vy = -34 - Math.random() * 26;
        p.vx = 12 + Math.random() * 14;
        p.max = 2.2;
        p.r = 12;
      }
      if (kind === "splat") {
        p.vy = -20 - Math.random() * 40;
        p.g = 300;
        p.max = 1.4;
      }
      if (kind === "note") {
        p.vy = -60 - Math.random() * 30;
        p.vx = (Math.random() - 0.5) * 30;
        p.max = 1.8;
        p.r = 9;
      }
      this.items.push(p);
    }
    if (this.items.length > 900) this.items.splice(0, this.items.length - 900);
  }

  update(dt) {
    const keep = [];
    for (const p of this.items) {
      p.life += dt;
      if (p.life >= p.max) continue;
      p.vy += p.g * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      if (p.kind === "bubble") {
        p.vx += Math.sin(p.life * 6 + p.rot) * 26 * dt;
        p.vy = Math.min(p.vy, -18);
      }
      keep.push(p);
    }
    this.items = keep;
  }

  draw(ctx) {
    ctx.save();
    for (const p of this.items) {
      const k = 1 - p.life / p.max;
      ctx.globalAlpha = clamp(k, 0, 1) * (p.kind === "splat" ? 0.75 : 0.95);
      if (p.kind === "bubble") {
        ctx.strokeStyle = "rgba(190,240,255,0.75)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (1 + (1 - k) * 0.5), 0, 6.2832);
        ctx.stroke();
        ctx.fillStyle = "rgba(190,240,255,0.12)";
        ctx.fill();
      } else if (p.kind === "sparkle") {
        ctx.save();
        ctx.fillStyle = "#fff3c4";
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          const a = (i / 4) * 6.2832;
          const rr = i % 2 === 0 ? p.r * 2.1 : p.r * 0.55;
          ctx[i ? "lineTo" : "moveTo"](Math.cos(a) * rr, Math.sin(a) * rr);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else if (p.kind === "heart") {
        ctx.fillStyle = "#ff8fa8";
        ctx.beginPath();
        const s = p.r;
        ctx.moveTo(p.x, p.y + s * 0.6);
        ctx.bezierCurveTo(p.x - s * 1.4, p.y - s * 0.5, p.x - s * 0.5, p.y - s * 1.3, p.x, p.y - s * 0.45);
        ctx.bezierCurveTo(p.x + s * 0.5, p.y - s * 1.3, p.x + s * 1.4, p.y - s * 0.5, p.x, p.y + s * 0.6);
        ctx.fill();
      } else if (p.kind === "splat") {
        ctx.fillStyle = "#4d7f52";
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.r * 1.6, p.r, p.rot, 0, 6.2832);
        ctx.fill();
      } else if (p.kind === "zzz") {
        ctx.fillStyle = "#dff3ff";
        ctx.font = Math.round(p.r) + "px " + FONT_HAND;
        ctx.fillText("z", p.x, p.y);
      } else if (p.kind === "note") {
        ctx.fillStyle = "#ffe9a8";
        ctx.font = Math.round(p.r * 1.6) + "px sans-serif";
        ctx.fillText("♪", p.x, p.y);
      } else if (p.kind === "crumb") {
        ctx.fillStyle = "#ff7a7a";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.2832);
        ctx.fill();
      } else if (p.kind === "ring") {
        ctx.strokeStyle = "#ffe9a8";
        ctx.lineWidth = 2 * k;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + (1 - k) * 60, 0, 6.2832);
        ctx.stroke();
      } else {
        ctx.fillStyle = "#cdeeff";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.2832);
        ctx.fill();
      }
    }
    ctx.restore();
  }
}