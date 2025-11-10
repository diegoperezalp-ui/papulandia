document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos DOM ---
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
    
    // --- Variables de Estado ---
    let lives = 3; // Intentos/Vidas iniciales
    let score = 0;
    let isGameOver = false;
    let isGrammarPhaseActive = true;
    let currentQuestion = {};
    let targetSpawnTimer = null;

    // --- Preguntas Gramaticales (Opción Múltiple) ---
    const grammarQuestions = [
        { text: "Yo **____** (Past Continuous) cuando la alarma sonó.", correct: "was sleeping", options: ["was sleeping", "were sleeping", "is sleeping", "slept"] },
        { text: "Nosotros estábamos hablando **____** (Conector) él llegó.", correct: "when", options: ["when", "while", "but", "so"] },
        { text: "Ellos estaban leyendo **____** (Conector) nosotros estábamos viendo TV.", correct: "while", options: ["while", "when", "after", "before"] },
        { text: "Ella **____** (Past Continuous) cuando su perro ladró.", correct: "was jogging", options: ["was jogging", "were jogging", "jogged", "is jogging"] },
        { text: "El ladrón estaba escapando **____** (Conector) la policía llegó.", correct: "when", options: ["when", "while", "though", "unless"] }
    ];
    let questionsPool = [...grammarQuestions]; // Copia de la lista para barajar

    // --- Game Flow Management ---
    function updateStatsDisplay() {
        livesDisplay.textContent = lives;
        scoreDisplay.textContent = score;
        triggerBtn.disabled = (lives <= 0);
        triggerBtn.textContent = `Usar Disparo (${lives})`;
    }

    function loadGrammarPhase() {
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
        grammarMessage.textContent = 'Selecciona la opción correcta para ganar un Disparo.';
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
            grammarMessage.textContent = `✅ ¡Correcto! Ganaste 1 Disparo. (${answer})`;
            grammarMessage.className = 'correct';
        } else {
            lives--; 
            grammarMessage.textContent = `❌ ¡Incorrecto! Perdiste 1 Vida/Disparo. La respuesta era ${currentQuestion.correct}.`;
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
    
    // --- FUNCIÓN MODIFICADA: IMPLEMENTANDO GIF (RUTA CON ESPACIOS CORREGIDA) ---
    function spawnTarget() {
        gameBoard.innerHTML = '';
        const target = document.createElement('div');
        target.classList.add('target');
        
        // ¡Ruta del GIF corregida para manejar los espacios!
        const imageSource = "PERRO%20DUCK%20HUNT.gif"; 

        target.innerHTML = `
            <img src="${imageSource}" alt="Blanco de habilidad" class="target-img-content">
        `;

        // COMENTARIO 5: TAMAÑO DEL BOTÓN USADO PARA POSICIONAMIENTO.
        const targetWidth = 120; 
        const targetHeight = 70; 
        
        const maxX = gameBoard.clientWidth - targetWidth; 
        const maxY = gameBoard.clientHeight - targetHeight; 
        
        target.style.left = `${Math.random() * maxX}px`;
        target.style.top = `${Math.random() * maxY}px`;

        target.onclick = checkTargetClick;
        gameBoard.appendChild(target);
    }
    // -------------------------------------------------------------------

    function checkTargetClick() {
        if (isGameOver) return;

        clearTimeout(targetSpawnTimer); 
        gameBoard.innerHTML = ''; 
        triggerBtn.disabled = false; 
        
        score++;
        updateStatsDisplay();
        skillMessage.textContent = `🎯 ¡Éxito! Ganaste 1 punto.`;
        skillMessage.className = 'correct';

        setTimeout(loadGrammarPhase, 1000);
    }

    function skillFailed(reason) {
        if (isGameOver) return;

        clearTimeout(targetSpawnTimer);
        gameBoard.innerHTML = ''; 
        triggerBtn.disabled = false; 

        if (reason === "time_out") {
            skillMessage.textContent = '⏱️ ¡Tarde! El blanco desapareció. Disparo perdido.';
        } else if (reason === "skill_no_lives") {
             skillMessage.textContent = '🚫 ¡Necesitas recargar tu batería gramatical!';
        }
        skillMessage.className = 'incorrect';
        
        setTimeout(loadGrammarPhase, 1000);
    }

    function gameOver(reason) {
        isGameOver = true;
        clearTimeout(targetSpawnTimer);
        triggerBtn.disabled = true;
        
        let finalMessage = '';
        if (reason === "grammar") {
            finalMessage = `❌ ¡GAME OVER! Te quedaste sin Disparos al fallar la gramática. Puntuación final: ${score}`;
        } else if (reason === "skill_no_lives") {
             finalMessage = `❌ ¡GAME OVER! Necesitas Disparos para continuar. Puntuación final: ${score}`;
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