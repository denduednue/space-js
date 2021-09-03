import * as canvas from './canvas.js';
import bus from './bus.js';

function Asteroid(engine, tick, slot) {
  var anim = Math.random() * 100;
  this.update = (dT) => {
    anim += dT * 0.1;
    if (engine.getTick() > tick + 6) {
      this.destroyed = true;
    }
    if (engine.closeToShip(tick, slot, 2)) {
      this.destroyed = true;
      bus.emit('hit', 1);
    }
  }
  this.render = (ctx) => {
    ctx.save();
    ctx.translate(engine.laneX(tick), engine.laneY(slot));
    var s = engine.laneScale() * 1.0;
    ctx.fillStyle = '#963';
    // debris trail
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.arc(
        (i + 0.7) * s * 0.3 + Math.sin(anim*3+i*i*4)*s*0.6,
        Math.sin(anim*5+i*i*4)*s*0.7,
        s * 0.6 / (1.0 + i * 1.0),
        0, 6.29);
      ctx.fill();
    }
    // asteroid
    ctx.beginPath();
    ctx.arc(0, 0, s, 0, 6.29);
    ctx.fill();
    ctx.restore();
  }
}
export default Asteroid;