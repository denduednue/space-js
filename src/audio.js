import bus from './bus.js'

function Audio() {
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var sampleRate = audioCtx.sampleRate;

  var generate = (duration, fn) => {
    var audioBuffer = audioCtx.createBuffer(1, sampleRate * duration, sampleRate);
    var buffer = audioBuffer.getChannelData(0);
    var N = audioBuffer.length;
    var anim = 0;
    for (var i = 0; i < N; i++) {
      var p = i / N;
      buffer[i] = fn(i*44100/sampleRate) * (1-p);
      // anim += 1/(5 + 100 * p);
      // buffer[i] = Math.min(Math.max(Math.sin(anim) * 1000 * (1-p), -1), 1) * 0.3;
    }
    return audioBuffer;//source;
  }

  var sin = (i) => Math.min(Math.max(Math.sin(i), -1), 1)
  var saw = (i) => ((i % 6.28)-3.14)/6.28;
  var sqr = (i) => Math.min(Math.max(Math.sin(i) * 1000, -1), 1)
  var win = (i, ts, te) => {
    if (i<ts*44100 || i>te*44100) {return 0;}
    return 1 - ((i/44100) - ts)/(te - ts);
  }

  // Transition animation - Gate whirring close
  var gateCloseSound = generate(0.6, (i) => {
    return 0.05 * sqr(i/150) * (sqr(i/400)+1);
  });

  // Transition animation -  Gate whirring open + noise of steam
  var gateOpenSound = generate(1, (i) => {
    return 0.05 * sqr(i/130) * (sqr(i/400)+1) + 0.1 * Math.random() * Math.max(1 - i / 44100, 0);
  });

  // Buy an item (ding + ding)
  var buySound = generate(0.7, (i) => {
    return 0.1 * (saw(i/19) * win(i, 0, 0.15) + saw(i/11) * win(i, 0.1, 0.7));
  });

  var play = (audioBuffer) => {
    var source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start();
  };

  this.setup = () => {
    // bus.on('start', () => { source.start(); });
    bus.on('txn', () => { play(gateCloseSound); });
    bus.on('txn-done', () => { play(gateOpenSound); });
    bus.on('buy', () => { play(buySound); });
  };
}

export default new Audio();