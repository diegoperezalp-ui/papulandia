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
            backgroundMusic.play().catch(error => {
                console.warn("Autoplay was blocked by the browser: ", error);
            });
        }
    }

    function stopMusic() {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0; 
    }

    
    let lives = 3; // Initial Lives/Shots
    let score = 0;
    let isGameOver = false;
    let isGrammarPhaseActive = true;
    let currentQuestion = {};
    let targetSpawnTimer = null;

    
    const grammarQuestions = [
        { text: "I **____** (Past Continuous) when the alarm rang.", correct: "was sleeping", options: ["was sleeping", "were sleeping", "is sleeping", "slept"] },
        { text: "We were talking **____** (Connector) he arrived.", correct: "when", options: ["when", "while", "but", "so"] },
        { text: "They were reading **____** (Connector) we were watching TV.", correct: "while", options: ["while", "when", "after", "before"] },
        { text: "She **____** (Past Continuous) when her dog barked.", correct: "was jogging", options: ["was jogging", "were jogging", "jogged", "is jogging"] },
        { text: "The thief was escaping **____** (Connector) the police arrived.", correct: "when", options: ["when", "while", "though", "unless"] }
    ];
    let questionsPool = [...grammarQuestions]; 

    // --- Game Flow Management ---
    function updateStatsDisplay() {
        livesDisplay.textContent = lives;
        scoreDisplay.textContent = score;
        triggerBtn.disabled = (lives <= 0);
        triggerBtn.textContent = `Use Shot (${lives})`; // Texto traducido
    }

    function loadGrammarPhase() {
        // ⭐️ CONTROL DE MÚSICA: Detenemos la música al volver a la fase de gramática.
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
        grammarMessage.textContent = 'Select the correct option to win a Shot.'; // Texto traducido
        grammarMessage.className = '';

        const shuffledOptions = [...currentQuestion.options].sort(() => Math.random() - 0.5);
        
        shuffledOptions.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.dataset.value = option;
            button.onclick = () => checkGrammarAnswer(option);
            optionsContainer.appendChild(button);
        });
    }

    function checkGrammarAnswer(answer) {
        if (isGameOver || !isGrammarPhaseActive) return;

        if (answer === currentQuestion.correct) {
            lives++; 
            grammarMessage.textContent = `✅ Correct! You won 1 Shot. (${answer})`; // Texto traducido
            grammarMessage.className = 'correct';
            // Se eliminó playMusic() de aquí
        } else {
            lives--; 
            grammarMessage.textContent = `❌ Incorrect! You lost 1 Life/Shot. The answer was ${currentQuestion.correct}.`; // Texto traducido
            grammarMessage.className = 'incorrect';
        }

        updateStatsDisplay();

        if (lives <= 0) {
            gameOver("grammar");
            return;
        }

        optionsContainer.querySelectorAll('button').forEach(btn => btn.disabled = true);
        setTimeout(loadSkillPhase, 1500);
    }
    
    function loadSkillPhase() {
        if (isGameOver) return;
        
        // ⭐️ CONTROL DE MÚSICA: INICIAMOS MÚSICA CADA VEZ QUE EMPIEZA LA FASE DE DISPARO ⭐️
        playMusic(); 

        isGrammarPhaseActive = false;
        grammarPhase.classList.add('hidden');
        skillPhase.classList.remove('hidden');
        skillMessage.textContent = '';
        triggerBtn.onclick = startSkillAttempt;
    }

    function startSkillAttempt() {
        if (isGameOver || isGrammarPhaseActive) return;

        if (lives <= 0) {
            gameOver("skill_no_lives");
            return;
        }

        lives--;
        updateStatsDisplay();
        triggerBtn.disabled = true;
        spawnTarget();

        targetSpawnTimer = setTimeout(() => {
            skillFailed("time_out");
        }, 1000);
    }
    
    function spawnTarget() {
        gameBoard.innerHTML = '';
        const target = document.createElement('div');
        target.classList.add('target');
        
        const imageSource = "PERRO%20DUCK%20HUNT.gif"; 

        target.innerHTML = `
            <img src="${imageSource}" alt="Blanco de habilidad" class="target-img-content">
        `;

        const targetWidth = 120; 
        const targetHeight = 70; 
        
        const maxX = gameBoard.clientWidth - targetWidth; 
        const maxY = gameBoard.clientHeight - targetHeight; 
        
        target.style.left = `${Math.random() * maxX}px`;
        target.style.top = `${Math.random() * maxY}px`;

        target.onclick = checkTargetClick;
        gameBoard.appendChild(target);
    }

    function checkTargetClick() {
        if (isGameOver) return;

        clearTimeout(targetSpawnTimer); 
        gameBoard.innerHTML = ''; 
        triggerBtn.disabled = false; 
        
        score++;
        updateStatsDisplay();
        skillMessage.textContent = `🎯 Success! You won 1 point.`; // Texto traducido
        skillMessage.className = 'correct';

        // ⭐️ CONTROL DE MÚSICA: Detenemos la música para volver a la gramática
        stopMusic();

        setTimeout(loadGrammarPhase, 1000);
    }

    function skillFailed(reason) {
        if (isGameOver) return;

        clearTimeout(targetSpawnTimer);
        gameBoard.innerHTML = ''; 
        triggerBtn.disabled = false; 

        if (reason === "time_out") {
            skillMessage.textContent = '⏱️ Too late! The target disappeared. Shot lost.'; // Texto traducido
        } else if (reason === "skill_no_lives") {
             skillMessage.textContent = '🚫 You need to recharge your grammatical battery!'; // Texto traducido
        }
        skillMessage.className = 'incorrect';
        
        // ⭐️ CONTROL DE MÚSICA: Detenemos la música para volver a la gramática
        stopMusic();

        setTimeout(loadGrammarPhase, 1000);
    }

    function gameOver(reason) {
        isGameOver = true;
        clearTimeout(targetSpawnTimer);
        triggerBtn.disabled = true;
        
        // ⭐️ CONTROL DE MÚSICA: Detenemos la música, el juego ha terminado
        stopMusic(); 
        
        let finalMessage = '';
        if (reason === "grammar") {
            finalMessage = `❌ GAME OVER! You ran out of Shots after failing the grammar. Final Score: ${score}`; // Texto traducido
        } else if (reason === "skill_no_lives") {
             finalMessage = `❌ GAME OVER! You need more Shots to continue. Final Score: ${score}`; // Texto traducido
        }

        grammarPhase.classList.remove('hidden');
        skillPhase.classList.add('hidden');
        grammarMessage.textContent = finalMessage;
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

    initGame();
});