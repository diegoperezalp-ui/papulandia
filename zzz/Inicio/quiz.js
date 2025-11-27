// ==================== PREGUNTAS ====================
const questions = [
  { q: "I was cooking dinner ___ the phone rang.", options: ["while", "during", "because", "when"], answer: 3 },
  { q: "She was studying ___ her brother was playing video games.", options: ["when", "after", "while", "before"], answer: 2 },
  { q: "He broke his arm ___ he was skating.", options: ["while", "and", "during", "when"], answer: 3 },
  { q: "They were watching TV ___ their mom was making food.", options: ["while", "when", "before", "during"], answer: 0 },
  { q: "I was walking to school ___ I saw a big dog.", options: ["because", "after", "while", "when"], answer: 3 },
  { q: "___ I was eating, the lights went out.", options: ["When", "After", "Because", "While"], answer: 3 },
  { q: "He shouted ___ he was talking to his friend.", options: ["because", "when", "while", "after"], answer: 1 },
  { q: "The kids were playing outside ___ it started to rain.", options: ["before", "while", "during", "when"], answer: 3 },
  { q: "She was listening to music ___ she was doing her homework.", options: ["when", "while", "after", "because"], answer: 1 },
  { q: "___ I was running, I fell.", options: ["While", "Because", "After", "Then"], answer: 0 }
];

// ==================== VARIABLES ====================
let current = 0, score = 0, soundOn = true;

const elQuestion = document.getElementById('question-text');
const elOptions = document.getElementById('options-container');
const elScore = document.getElementById('score');
const elQnum = document.getElementById('qnum');
const elFeedback = document.getElementById('feedback');
const elStars = document.getElementById('stars');
const elProgressFill = document.getElementById('progress-fill');
const elEndActions = document.getElementById('end-actions');
const elEndTitle = document.getElementById('end-title');
const elEndText = document.getElementById('end-text');
const elGameOver = document.getElementById('game-over-message');

// ==================== BOTÓN MÁGICO CON ESTRELLAS PEQUEÑAS Y DISCRETAS ====================
function createMagicButton(text, isGhost = false) {
  const btn = document.createElement('button');
  btn.className = 'magic-btn';
  if (isGhost) btn.classList.add('ghost');

  btn.innerHTML = `
    <span class="btn-text">${text}</span>
    <span class="star star-1"><svg viewBox="0 0 14 14"><path class="fil0" d="M7 1.5l1.6 3.6 4 .3-3 2.7.8 4-3.4-2-3.4 2 .8-4-3-2.7 4-.3z"/></svg></span>
    <span class="star star-2"><svg viewBox="0 0 14 14"><path class="fil0" d="M7 1.5l1.6 3.6 4 .3-3 2.7.8 4-3.4-2-3.4 2 .8-4-3-2.7 4-.3z"/></svg></span>
    <span class="star star-3"><svg viewBox="0 0 14 14"><path class="fil0" d="M7 1.5l1.6 3.6 4 .3-3 2.7.8 4-3.4-2-3.4 2 .8-4-3-2.7 4-.3z"/></svg></span>
    <span class="star star-4"><svg viewBox="0 0 14 14"><path class="fil0" d="M7 1.5l1.6 3.6 4 .3-3 2.7.8 4-3.4-2-3.4 2 .8-4-3-2.7 4-.3z"/></svg></span>
    <span class="star star-5"><svg viewBox="0 0 14 14"><path class="fil0" d="M7 1.5l1.6 3.6 4 .3-3 2.7.8 4-3.4-2-3.4 2 .8-4-3-2.7 4-.3z"/></svg></span>
  `;

  return btn;
}

// ==================== ESTRELLAS DE PROGRESO ====================
function createStars() {
  elStars.innerHTML = '';
  for (let i = 0; i < questions.length; i++) {
    const s = document.createElement('div');
    s.className = 'star-progress';
    s.innerHTML = `<svg viewBox="0 0 24 24"><path fill="white" d="M12 2.5l3.1 6.3 6.9.9-5 4.9 1.2 6.9L12 17.8l-6.2 3.2 1.2-6.9-5-4.9 6.9-.9L12 2.5z"/></svg>`;
    elStars.appendChild(s);
  }
}

// ==================== SONIDO ====================
function beep(freq = 800, dur = 100) {
  if (!soundOn) return;
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(freq, ctx.currentTime);
  g.gain.setValueAtTime(0.08, ctx.currentTime);
  o.connect(g);
  g.connect(ctx.destination);
  o.start();
  o.stop(ctx.currentTime + dur / 1000);
}

// ==================== MOSTRAR PREGUNTA ====================
function renderQuestion() {
  elEndActions.hidden = true;
  elGameOver.classList.remove('visible');  // ← Siempre oculto al inicio
  elFeedback.textContent = '';

  const q = questions[current];
  elQuestion.textContent = q.q;
  elQnum.textContent = current + 1;

  elOptions.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = createMagicButton(opt);
    btn.onclick = () => selectAnswer(i, btn);
    elOptions.appendChild(btn);
  });
}

// ==================== RESPUESTA ====================
function selectAnswer(selected, btn) {
  [...elOptions.children].forEach(b => b.style.pointerEvents = 'none');

  const correct = questions[current].answer;

  if (selected === correct) {
    score++;
    elScore.textContent = score;
    btn.classList.add('correct');
    elFeedback.textContent = '¡CORRECTO!';
    beep(1000, 180);
    elStars.children[current].classList.add('active');
    elProgressFill.style.width = `${((current + 1) / questions.length) * 100}%`;

    setTimeout(() => {
      current++;
      if (current >= questions.length) finishGame();
      else renderQuestion();
    }, 900);

  } else {
    btn.classList.add('incorrect');
    elFeedback.textContent = '¡ERROR! Reiniciando...';
    beep(180, 600);
    elGameOver.classList.add('visible');  // ← SOLO aparece si pierdes
    setTimeout(resetGame, 2000);
  }
}

// ==================== GANAR ====================
function finishGame() {
  elEndActions.hidden = false;
  elEndTitle.textContent = '¡FELICIDADES!';
  elEndText.textContent = `Completaste el quiz: ${score}/${questions.length}`;
  beep(1200, 500);
}

// ==================== REINICIAR ====================
function resetGame() {
  current = 0;
  score = 0;
  elScore.textContent = '0';
  elQnum.textContent = '1';
  elProgressFill.style.width = '0%';
  [...elStars.children].forEach(s => s.classList.remove('active'));
  renderQuestion();
}

// ==================== BOTONES DEL MENÚ ====================
document.getElementById('btn-new').onclick = () => resetGame();
document.getElementById('btn-restart').onclick = () => resetGame();

document.getElementById('btn-sound').onclick = () => {
  soundOn = !soundOn;
  document.getElementById('btn-sound').querySelector('.btn-text').textContent = soundOn ? 'SONIDO: ON' : 'SONIDO: OFF';
};

document.getElementById('play-again').onclick = () => resetGame();

// ==================== INICIO ====================
createStars();
resetGame();