document.addEventListener('DOMContentLoaded', () => {

    const livesDisplay = document.getElementById('lives');
    const scoreDisplay = document.getElementById('score');
    const grammarPhase = document.getElementById('grammar-phase');
    const skillPhase = document.getElementById('skill-phase');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const grammarMessage = document.getElementById('grammar-message');
    const triggerBtn = document.getElementById('trigger-btn');
    const gameBoard = document.getElementById('game-board');
    const skillMessage = document.getElementById('skill-message');
    const backgroundMusic = document.getElementById('musicaFondo');

    backgroundMusic.loop = true;

    function playMusic() {
        if (backgroundMusic.paused) {
            backgroundMusic.play().catch(() => {});
        }
    }

    function stopMusic() {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }

    let lives = 3;
    let score = 0;
    let isGameOver = false;
    let isGrammarPhaseActive = true;
    let currentQuestion = {};
    let targetSpawnTimer = null;

    const grammarQuestions = [
        { text: "I **____** (Past Continuous) when the alarm rang.", correct: "was sleeping", options: ["was sleeping", "were sleeping", "is sleeping", "slept"] },
        { text: "We were talking **____** (Connector) he arrived.", correct: "when", options: ["when", "while", "but", "so"] },
        { text: "They were reading **____** (Connector) we were watching TV.", correct: "while", options: ["while", "when", "after", "before"] },
        { text: "She **____** (Past Continuous) when her dog barked.", correct: "was jogging", options: ["was jogging", "were jogging", "jogged", "is jogging"] },  // ← FIJADO: sin espacio
        { text: "The thief was escaping **____** (Connector) the police arrived.", correct: "when", options: ["when", "while", "though", "unless"] }
    ];

    let questionsPool = [...grammarQuestions];

    function updateStatsDisplay() {
        livesDisplay.textContent = lives;
        scoreDisplay.textContent = score;
        triggerBtn.disabled = (lives <= 0);
        triggerBtn.textContent = `Use Shot (${lives})`;
    }

    function loadGrammarPhase() {
        stopMusic();
        if (isGameOver) return;
        isGrammarPhaseActive = true;
        skillPhase.classList.add('hidden');
        grammarPhase.classList.remove('hidden');

        if (questionsPool.length === 0) {
            questionsPool = [...grammarQuestions];
        }
        const randomIndex = Math.floor(Math.random() * questionsPool.length);
        currentQuestion = questionsPool.splice(randomIndex, 1)[0];

        questionText.innerHTML = currentQuestion.text;
        optionsContainer.innerHTML = '';
        grammarMessage.textContent = 'Selecciona la opción correcta para ganar un disparo';
        grammarMessage.className = '';

        const shuffledOptions = [...currentQuestion.options].sort(() => Math.random() - 0.5);
        shuffledOptions.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            // ← FIJADO: function normal para pasar event
            button.onclick = function(e) { 
                checkGrammarAnswer(option, e.target); 
            };
            optionsContainer.appendChild(button);
        });
    }

    // ← FIJADO: recibe button como parámetro
    function checkGrammarAnswer(answer, clickedButton) {
        if (isGameOver || !isGrammarPhaseActive) return;

        if (answer === currentQuestion.correct) {
            lives++;  // ← +1 disparo por gramática correcta
            grammarMessage.textContent = `¡PERFECTO! ¡DISPARA!`;
            grammarMessage.className = 'correct msg';
            clickedButton.classList.add('correct-answer');
        } else {
            lives--;
            grammarMessage.textContent = `¡Ups! Intenta otra vez`;
            grammarMessage.className = 'incorrect msg';
            clickedButton.style.animation = 'shake 0.5s';
        }

        updateStatsDisplay();

        if (lives <= 0) {
            gameOver();
            return;
        }

        optionsContainer.querySelectorAll('button').forEach(btn => btn.disabled = true);
        setTimeout(loadSkillPhase, 1800);
    }

    function loadSkillPhase() {
        if (isGameOver) return;
        playMusic();
        isGrammarPhaseActive = false;
        grammarPhase.classList.add('hidden');
        skillPhase.classList.remove('hidden');
        skillMessage.textContent = '';
        triggerBtn.onclick = startSkillAttempt;
    }

    function startSkillAttempt() {
        if (isGameOver || lives <= 0) return;

        lives--;  // ← Gasta 1 disparo
        updateStatsDisplay();
        triggerBtn.disabled = true;
        spawnTarget();

        targetSpawnTimer = setTimeout(() => {
            skillFailed();
        }, 3000);
    }

    function spawnTarget() {
        gameBoard.innerHTML = '';
        const target = document.createElement('div');
        target.classList.add('target');
        // ← FIJADO: IMAGEN DEL PERRO (era vacío)
        target.innerHTML = `<img src="PERRO%20DUCK%20HUNT.gif" alt="Perro">`;

        const size = 92;  // Perro más grande
        const maxX = gameBoard.offsetWidth - size - 40;
        const maxY = gameBoard.offsetHeight - size - 40;

        const x = 20 + Math.random() * (maxX - 40);
        const y = 20 + Math.random() * (maxY - 40);

        target.style.left = x + 'px';
        target.style.top = y + 'px';

        target.onclick = () => {
            clearTimeout(targetSpawnTimer);
            acertarDisparo(target);
        };

        gameBoard.appendChild(target);
    }

    function acertarDisparo(target) {
        if (isGameOver) return;
        target.classList.add('hit');
        skillMessage.textContent = "¡ACERTASTE EL DISPARO!";
        skillMessage.className = "msg acierto";

        score++;     // ← +1 PUNTO
        lives++;     // ← +1 DISPARO (¡ESTO FALTABA!)
        updateStatsDisplay();  // Actualiza pantalla
        stopMusic();

        setTimeout(() => {
            gameBoard.innerHTML = '';
            triggerBtn.disabled = false;
            loadGrammarPhase();
        }, 1200);
    }

    function skillFailed() {
        if (isGameOver) return;
        clearTimeout(targetSpawnTimer);
        gameBoard.innerHTML = '';
        triggerBtn.disabled = false;

        skillMessage.textContent = "¡FALLASTE! Se acabó el tiempo";
        skillMessage.className = "msg fallo-tiempo";

        stopMusic();
        setTimeout(loadGrammarPhase, 1500);
    }

    function gameOver() {
        isGameOver = true;
        clearTimeout(targetSpawnTimer);
        triggerBtn.disabled = true;
        stopMusic();

        grammarPhase.classList.remove('hidden');
        skillPhase.classList.add('hidden');
        grammarMessage.textContent = `GAME OVER! Puntuación final: ${score}`;
        grammarMessage.className = 'incorrect';
    }

    function initGame() {
        lives = 3;
        score = 0;
        isGameOver = false;
        questionsPool = [...grammarQuestions];
        updateStatsDisplay();
        loadGrammarPhase();
    }

    // Animación shake
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
    `;
    document.head.appendChild(style);

    initGame();
});