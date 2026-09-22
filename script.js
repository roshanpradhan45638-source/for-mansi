nst sections = [...document.querySelectorAll('.screen')];
const loader = document.getElementById('loader');
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let current = document.getElementById('opening');

window.addEventListener('load', () => setTimeout(() => loader.classList.add('hide'), 900));

function showSection(id) {
  const next = document.getElementById(id);
  if (!next || next === current) return;
  current.classList.remove('active');
  next.classList.add('active');
  current = next;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('[data-next]').forEach(button => {
  button.addEventListener('click', () => showSection(button.dataset.next));
});

document.getElementById('yesButton').addEventListener('click', () => {
  showSection('response');
  document.getElementById('response').classList.add('celebrate');
  document.getElementById('responseIcon').textContent = '♥';
  document.getElementById('responseTitle').textContent = 'Okay... you just made me really, really happy. ❤️';
  document.getElementById('responseText').textContent = 'Maybe this is where our story actually begins. ✨';
  celebrate();
});

document.getElementById('thinkButton').addEventListener('click', () => {
  showSection('response');
  document.getElementById('responseIcon').textContent = '♡';
  document.getElementById('responseTitle').textContent = "That's okay. ❤️";
  document.getElementById('responseText').textContent = "Take your time.\nWhatever your answer is,\nI'll respect it.";
});

document.getElementById('restartButton').addEventListener('click', () => {
  document.getElementById('response').classList.remove('celebrate');
  showSection('opening');
});

// A tiny, local ambient tone: browsers require the first sound to follow a click.
let audioContext;
let musicOn = false;
const musicButton = document.getElementById('musicToggle');
function toggleMusic() {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (musicOn) { audioContext.suspend(); musicOn = false; musicButton.innerHTML = '♫ <span>sound off</span>'; return; }
  audioContext.resume();
  const notes = [261.63, 329.63, 392, 329.63];
  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.frequency.value = frequency; oscillator.type = 'sine';
    gain.gain.setValueAtTime(0, audioContext.currentTime + index * 1.4);
    gain.gain.linearRampToValueAtTime(.018, audioContext.currentTime + index * 1.4 + .1);
    gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + index * 1.4 + 1.25);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(audioContext.currentTime + index * 1.4); oscillator.stop(audioContext.currentTime + index * 1.4 + 1.3);
  });
  musicOn = true; musicButton.innerHTML = '♫ <span>sound on</span>';
}
musicButton.addEventListener('click', toggleMusic);

const particles = Array.from({length: 25}, () => ({x: Math.random(), y: Math.random(), size: 1 + Math.random() * 3, speed: .00015 + Math.random() * .0003, alpha: .15 + Math.random() * .35}));
function drawParticles() {
  canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  particles.forEach(p => { p.y -= p.speed; if (p.y < -.05) p.y = 1.05; ctx.beginPath(); ctx.arc(p.x * innerWidth, p.y * innerHeight, p.size, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${p.alpha})`; ctx.fill(); });
  requestAnimationFrame(drawParticles);
}
drawParticles();

function celebrate() {
  const symbols = ['♥', '✦', '♡'];
  for (let i = 0; i < 34; i++) {
    const heart = document.createElement('span'); heart.textContent = symbols[i % symbols.length]; heart.style.cssText = `position:fixed;z-index:10;left:${Math.random()*100}vw;top:105vh;color:${i%2?'#d88aaa':'#b895d4'};font-size:${14+Math.random()*20}px;pointer-events:none;animation:riseHeart ${2.5+Math.random()*2}s ease-out forwards;animation-delay:${Math.random()*.7}s`;
    document.body.appendChild(heart); setTimeout(() => heart.remove(), 5000);
  }
}
const style = document.createElement('style');
style.textContent = '@keyframes riseHeart{to{transform:translateY(-120vh) rotate(25deg);opacity:0}}';
document.head.appendChild(style);
