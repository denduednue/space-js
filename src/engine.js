import * as canvas from './canvas.js';

export default function Engine() {
  // The sequence and channel of obstacles
  var obstacles = [];

  var totalTicks = 100;
  var currentTick = 0;
  var tickAnim = 0;
  var anim = 0;

  this.update = (dT) => {
    anim += dT;
    tickAnim += dT * 2;
    if (tickAnim > 1) {
      tickAnim--;
      currentTick++;
      // TODO: handle round over
    }
  };

  this.render = (ctx) => {
    // Screen dimensions
    const w = canvas.width();
    const h = canvas.height();

    // Lane placements (PillWidth, PillHeight, Top, Mid, Bottom)
    const pw = w / 40;
    const ph = h / 5;
    const th = h * 0.1;
    const mh = th + ph;
    const bh = mh + ph;

    // Scale of the art
    const s = Math.min(ph, w/8) * 0.3;

    // Minimap
    // Progress path
    var pr=th/2*0.7;
    ctx.fillStyle = '#446';
    ctx.fillRect(15 + pw, th/2, w - 30 - 2*pw, 1);
    // Source planet
    ctx.fillStyle = '#446';
    ctx.beginPath();
    ctx.arc(15 + pr, th/2, pr, 0, 6.28);
    ctx.fill();
    // Dest planet
    ctx.fillStyle = '#446';
    ctx.beginPath();
    ctx.arc(w - 15 - pr, th/2, pr, 0, 6.28);
    ctx.fill();
    // Progress ship
    ctx.fillStyle = '#fff';
    var px = 15 + pw + (w - 30 - 2*pw) * ((currentTick + tickAnim)/totalTicks);
    ctx.beginPath();
    ctx.moveTo(px+pw/3, th/2);
    ctx.lineTo(px-pw/3, th/2-pw/3);
    ctx.lineTo(px-pw/3, th/2+pw/3);
    ctx.closePath();
    ctx.fill();

    // Draw the lanes
    ctx.fillStyle = '#f33'; ctx.fillRect(15, th, pw, ph);
    ctx.fillStyle = '#3f3'; ctx.fillRect(15, mh, pw, ph);
    ctx.fillStyle = '#33f'; ctx.fillRect(15, bh, pw, ph);
    ctx.fillStyle = '#311'; ctx.fillRect(w-15, th, -pw, ph);
    ctx.fillStyle = '#131'; ctx.fillRect(w-15, mh, -pw, ph);
    ctx.fillStyle = '#113'; ctx.fillRect(w-15, bh, -pw, ph);
    ctx.fillStyle = '#222';
    ctx.fillRect(15, th, w-30, 1);
    ctx.fillRect(15, mh, w-30, 1);
    ctx.fillRect(15, bh, w-30, 1);
    ctx.fillRect(15, bh+ph, w-30, 1);

    // Draw the main ship
    ctx.save();

    // base ship position
    ctx.translate(50 + pw + s, mh + ph/2);

    // ship flames
    for (let i = 5; i >= 0; i--) {
      if (i < 1) {
        ctx.fillStyle = '#fd6';
      } else if (i < 3) {
        ctx.fillStyle = '#fa1';
      } else {
        ctx.fillStyle = '#a41';
      }
      ctx.beginPath();
      var spot = (Math.sin(anim*(i+1)*20) * 0.2 + 0.5);
      ctx.arc(-s - s * i * 0.1, Math.sin(-anim*40+i)*i*s/30, (s * spot) / (1.5 + i*0.3), 0, 6.29);
      ctx.fill();
    }

    // ship body + shaking
    ctx.translate(Math.sin(anim*30) * s/60, Math.sin(anim*35) * s/40);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(s, 0);
    ctx.lineTo(-s*0.65,-s*0.8);
    ctx.lineTo(-s*0.65,-s*0.3);
    ctx.lineTo(-s,-s*0.5);
    ctx.lineTo(-s,s*0.5);
    ctx.lineTo(-s*0.65,s*0.3);
    ctx.lineTo(-s*0.65,s*0.8);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(-s*0.4,s*0.4,s,s*0.15);
    ctx.fillRect(-s*0.4,-s*0.4,s,-s*0.15);
    ctx.restore();
  };
};