// ------------------ MENU ------------------
const menuButton = document.getElementById("menuButton");
const menu = document.getElementById("menu");

menuButton.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});

// ------------------ DATA ------------------
const questions = [
  {
    question: "Choose the correct Past Continuous form: 'I _____ (listen) to music when you arrived.'",
    answers: ["was listen", "was listening", "am listening"],
    correct: 1
  },
  {
    question: "What was he doing at 8 PM yesterday?",
    answers: ["He watched TV.", "He was watching TV.", "He is watching TV."],
    correct: 1
  },
  {
    question: "Complete the sentence: 'While they _____ (talk), the teacher entered the classroom.'",
    answers: ["were talking", "are talking", "talked"],
    correct: 0
  },
  {
    question: "The students _____ (not study) when the fire alarm rang.",
    answers: ["was not studying", "were not studying", "did not study"],
    correct: 1
  },
  {
    question: "Translate: '¿Estaba ella durmiendo cuando llamaste?'",
    answers: ["Did she sleep when you called?", "Was she sleeping when you called?", "Is she sleeping when you called?"],
    correct: 1
  },
  {
    question: "My parents _____ (drive) home while I was reading a book.",
    answers: ["drove", "were driving", "was driving"],
    correct: 1
  },
  {
    question: "We _____ (not pay) attention during the lecture.",
    answers: ["wasn't paying", "aren't paying", "weren't paying"],
    correct: 2
  },
  {
    question: "The dog _____ (bark) all night long.",
    answers: ["was barking", "is barking", "barked"],
    correct: 0
  },
  {
    question: "_____ you _____ (clean) your room this morning?",
    answers: ["Did / clean", "Were / cleaning", "Are / cleaning"],
    correct: 1
  },
  {
    question: "I hurt my leg when I _____ (play) basketball.",
    answers: ["was playing", "played", "am playing"],
    correct: 0
  }
];

// ------------------ GAME STATE ------------------
let index = 0;
let score = 0;
let selected = null;

const gameContainer = document.getElementById("gameContainer");
const scoreDisplay = document.getElementById("scoreDisplay");

// ------------------ RENDER FUNCTIONS ------------------

function renderStart() {
  gameContainer.innerHTML = `
    <div class="text-center space-y-6">
      <p class="text-xl text-slate-300 px-4">
        Welcome to the Past Continuous Challenge! Answer 10 questions correctly to win.<br>
        An incorrect answer resets your score to 0.
      </p>

      <button id="startButton"
        class="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-4 rounded-xl font-bold text-xl border-4 border-yellow-400 shadow-lg hover:-translate-y-1 transition-all">
        ▶ START GAME
      </button>
    </div>
  `;

  document.getElementById("startButton").onclick = startGame;
}

function renderQuestion() {
  const q = questions[index];

  gameContainer.innerHTML = `
    <div class="bg-slate-700/50 border-2 border-blue-400 rounded-xl p-6 mb-8">
      <h2 class="text-xl md:text-2xl font-semibold text-blue-200">
        Question ${index + 1}: ${q.question}
      </h2>
    </div>

    <div id="answerList" class="grid gap-4 mb-8"></div>

    <div id="feedback" class="text-center text-xl font-bold uppercase tracking-wider mb-6"></div>
  `;

  const answerList = document.getElementById("answerList");

  q.answers.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.className =
      "bg-blue-700 hover:bg-blue-600 px-6 py-4 rounded-xl font-semibold text-lg border-4 border-blue-400 uppercase";
    btn.textContent = text;

    btn.onclick = () => handleAnswer(i, btn);

    answerList.appendChild(btn);
  });
}

function renderGameOver() {
  gameContainer.innerHTML = `
    <div class="text-center space-y-6">
      <p class="text-2xl font-bold text-blue-400">
        Game Over. Final Score: ${score}
      </p>

      <button id="restartBtn"
        class="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-4 rounded-xl font-bold text-xl border-4 border-yellow-400 shadow-lg hover:-translate-y-1 transition-all">
        ⟳ RESTART GAME
      </button>
    </div>
  `;

  document.getElementById("restartBtn").onclick = restartGame;
}

// ------------------ GAME LOGIC ------------------

function startGame() {
  index = 0;
  score = 0;
  scoreDisplay.textContent = "000";
  renderQuestion();
}

function restartGame() {
  startGame();
}

function handleAnswer(i, btn) {
  const q = questions[index];
  const feedback = document.getElementById("feedback");

  if (i === q.correct) {
    score++;
    scoreDisplay.textContent = score.toString().padStart(3, "0");

    btn.classList.add("bg-green-600", "border-green-400");
    feedback.classList.add("text-green-400");
    feedback.textContent = "Correct! Well done.";

    setTimeout(() => {
      index++;
      if (index >= questions.length) {
        renderGameOver();
      } else {
        renderQuestion();
      }
    }, 900);

  } else {
    score = 0;
    scoreDisplay.textContent = "000";

    btn.classList.add("bg-red-600", "border-red-400");
    feedback.classList.add("text-red-400");
    feedback.textContent = "Incorrect! Score reset to 0.";

    setTimeout(() => {
      index = 0;
      renderQuestion();
    }, 1000);
  }
}

// ------------------ INIT ------------------
renderStart();
