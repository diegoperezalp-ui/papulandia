document.addEventListener('DOMContentLoaded', () => {

    const livesDisplay = document.getElementById('lives');
    const scoreDisplay = document.getElementById('score');
    const grammarPhase = document.getElementById('grammar-phase');
    const skillPhase = document.getElementById('skill-phase');
    const questionText = document.getElementById('question-text');
    const wordPoolContainer = document.getElementById('word-pool-container');
    const sentenceDropArea = document.getElementById('sentence-drop-area');
    const checkButton = document.getElementById('check-sentence-btn');
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
    let grammarSuccess = false;

    // BANCO DE PREGUNTAS CON PALABRAS TRAMPA
    const grammarQuestions = [
        { 
            text: "Forma una oración con el Past Continuous y 'when'.", 
            correct: "I was sleeping when the alarm rang", 
            words: ["I", "was", "sleeping", "when", "the", "alarm", "rang", "tomorrow", "is"] // Trampas: tomorrow, is
        },
        { 
            text: "Forma una oración usando 'while'.", 
            correct: "They were reading while we were watching TV", 
            words: ["They", "were", "reading", "while", "we", "watching", "TV", "were", "always", "read"] // Trampas: always, read
        },
        { 
            text: "Estructura la pregunta con Past Continuous.", 
            correct: "Was she jogging when her dog barked?", 
            words: ["Was", "she", "jogging", "when", "her", "dog", "barked", "?", "did", "running"] // Trampas: did, running
        },
        { 
            text: "Ordena la frase sobre el ladrón.", 
            correct: "The thief was escaping when the police arrived", 
            words: ["The", "thief", "was", "escaping", "when", "the", "police", "arrived", "next", "escape"] // Trampas: next, escape
        },
        { 
            text: "Usa el Presente Perfecto y 'never'.", 
            correct: "She has never seen a shooting star", 
            words: ["She", "a", "star", "shooting", "has", "never", "seen", "saw", "will"] // Trampas: saw, will
        },
        { 
            text: "Forma una oración con el primer condicional.", 
            correct: "If it rains tomorrow we will stay home", 
            words: ["If", "it", "rains", "we", "will", "stay", "home", "tomorrow", "would", "had"] // Trampas: would, had
        },
        { 
            text: "Estructura la voz pasiva en Presente Simple.", 
            correct: "The book is written by a famous author", 
            words: ["The", "book", "is", "written", "by", "a", "famous", "author", "write", "has"] // Trampas: write, has
        },
        { 
            text: "Forma una oración de comparación usando un adjetivo largo.", 
            correct: "This car is more expensive than the old one", 
            words: ["This", "car", "is", "more", "expensive", "than", "the", "old", "one", "most", "beautiful"] // Trampas: most, beautiful
        },
        { 
            text: "Usa el futuro simple para predecir algo.", 
            correct: "I think he will win the next election", 
            words: ["I", "think", "he", "will", "win", "the", "next", "election", "won", "maybe"] // Trampas: won, maybe
        },
        { 
            text: "Tercer Condicional: Si hubiera estudiado...", 
            correct: "If I had studied I would have passed the exam", 
            words: ["If", "I", "had", "studied", "I", "would", "have", "passed", "the", "exam", "will", "can"] // Trampas: will, can
        },
        { 
            text: "Reported Speech: Dijo que estaba ocupado.", 
            correct: "He said that he was busy yesterday", 
            words: ["He", "said", "that", "he", "was", "busy", "yesterday", "says", "tomorrow"] // Trampas: says, tomorrow
        },
        { 
            text: "Construye una frase con 'used to'.", 
            correct: "We used to live near the beach", 
            words: ["We", "used", "to", "live", "near", "the", "beach", "use", "living"] // Trampas: use, living
        },
        { 
            text: "Usa el phrasal verb 'take off' (quitarse la ropa).", 
            correct: "You must take off your shoes before entering", 
            words: ["You", "must", "take", "off", "your", "shoes", "before", "entering", "took", "put on"] // Trampas: took, put on
        },
        { 
            text: "Voz Pasiva en Past Simple (negativo).", 
            correct: "The movie was not directed by Steven Spielberg", 
            words: ["The", "movie", "was", "not", "directed", "by", "Steven", "Spielberg", "direct", "is"] // Trampas: direct, is
        },
        { 
            text: "Forma una oración con 'too' (demasiado).", 
            correct: "The coffee is too hot to drink", 
            words: ["The", "coffee", "is", "too", "hot", "to", "drink", "very", "cold", "much"] // Trampas: very, cold, much
        }
    ];

    let questionsPool = [...grammarQuestions];

    function updateStatsDisplay() {
        livesDisplay.textContent = lives;
        scoreDisplay.textContent = score;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createWordToken(word) {
        const token = document.createElement('div');
        token.classList.add('word-token');
        token.textContent = word;
        token.draggable = true;

        token.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', word);
            e.dataTransfer.effectAllowed = 'move';
            token.classList.add('dragging');
        });

        token.addEventListener('dragend', () => {
            token.classList.remove('dragging');
        });

        token.addEventListener('click', () => {
            if (token.parentNode === wordPoolContainer) {
                sentenceDropArea.appendChild(token);
            } else {
                wordPoolContainer.appendChild(token);
            }
            updateCheckButtonState();
        });

        return token;
    }

    function updateCheckButtonState() {
        checkButton.disabled = sentenceDropArea.children.length === 0;
    }

    function handleDrop(e) {
        e.preventDefault();
        const draggedElement = document.querySelector('.dragging');
        if (draggedElement) {
            if (draggedElement.classList.contains('word-token')) {
                 const target = e.target.closest('#sentence-drop-area');
                if (target) {
                    const dropTarget = e.target.closest('.word-token');
                    if (dropTarget && dropTarget.parentNode === sentenceDropArea) {
                        sentenceDropArea.insertBefore(draggedElement, dropTarget);
                    } else {
                         sentenceDropArea.appendChild(draggedElement);
                    }
                } else if (e.target.closest('#word-pool-container')) {
                    wordPoolContainer.appendChild(draggedElement);
                }
            }
        }
        updateCheckButtonState();
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

        questionText.textContent = currentQuestion.text;
        grammarMessage.textContent = 'Arrastra las palabras correctas y en orden para formar la oración. ¡Cuidado con las trampas!';
        grammarMessage.className = 'msg';

        wordPoolContainer.innerHTML = '';
        sentenceDropArea.innerHTML = '';
        checkButton.disabled = true;
        sentenceDropArea.classList.remove('correct-answer'); 

        const shuffledWords = shuffleArray([...currentQuestion.words]);
        shuffledWords.forEach(word => {
            wordPoolContainer.appendChild(createWordToken(word));
        });

        sentenceDropArea.addEventListener('dragover', (e) => e.preventDefault());
        sentenceDropArea.addEventListener('drop', handleDrop);
        wordPoolContainer.addEventListener('drop', handleDrop);
        wordPoolContainer.addEventListener('dragover', (e) => e.preventDefault());

        checkButton.onclick = checkGrammarAnswer;
    }

    function checkGrammarAnswer() {
        if (isGameOver || !isGrammarPhaseActive) return;

        const playerSentence = Array.from(sentenceDropArea.children)
                                   .map(token => token.textContent.trim())
                                   .join(' ');
        
        const normalizedPlayer = playerSentence.toLowerCase().replace(/[\?\.\!]$/, '').trim();
        const normalizedCorrect = currentQuestion.correct.toLowerCase().replace(/[\?\.\!]$/, '').trim();


        if (normalizedPlayer === normalizedCorrect) {
            lives++;
            grammarMessage.textContent = `¡PERFECTO! ¡Respuesta correcta! Ganaste un disparo.`;
            grammarMessage.className = 'correct msg';
            sentenceDropArea.classList.add('correct-answer');
            grammarSuccess = true; 
        } else {
            lives--;
            grammarMessage.textContent = `¡Ups! Incorrecto. La estructura era: ${currentQuestion.correct}`;
            grammarMessage.className = 'incorrect msg';
            sentenceDropArea.style.animation = 'shake 0.5s';
            grammarSuccess = false; 
        }

        updateStatsDisplay();
        checkButton.disabled = true;

        if (lives <= 0) {
            gameOver();
            return;
        }

        Array.from(wordPoolContainer.children).forEach(token => token.style.pointerEvents = 'none');
        Array.from(sentenceDropArea.children).forEach(token => token.style.pointerEvents = 'none');

        setTimeout(loadSkillPhase, 2500);
    }

    function loadSkillPhase() {
        if (isGameOver) return;
        playMusic();
        isGrammarPhaseActive = false;
        grammarPhase.classList.add('hidden');
        skillPhase.classList.remove('hidden');
        
        // Mensaje y estado del botón de disparo
        if (grammarSuccess) {
             skillMessage.textContent = '¡Genial! Tienes un tiro ganado. ¡DISPARA!';
             skillMessage.className = "msg acierto";
             triggerBtn.disabled = false;
        } else {
             skillMessage.textContent = 'Respuesta incorrecta. No hay tiro por ahora. Volviendo a la Gramática...';
             skillMessage.className = "msg fallo-tiempo";
             triggerBtn.disabled = true;
             // Si falló, regresamos a la gramática después de un tiempo
             setTimeout(loadGrammarPhase, 3000);
        }

        triggerBtn.onclick = startSkillAttempt;
        updateStatsDisplay();
    }

    function startSkillAttempt() {
        if (isGameOver || lives <= 0) return;

        // Se consume el disparo que se ganó por la respuesta correcta
        lives--; 
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
        target.innerHTML = `<img src="PERRO%20DUCK%20HUNT.gif" alt="Perro">`;

        const size = 92;
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
        skillMessage.textContent = "¡ACERTASTE EL DISPARO! Ganas un punto extra.";
        skillMessage.className = "msg acierto";

        score++;
        updateStatsDisplay(); 
        stopMusic();

        setTimeout(() => {
            gameBoard.innerHTML = '';
            loadGrammarPhase();
        }, 1200);
    }

    function skillFailed() {
        if (isGameOver) return;
        clearTimeout(targetSpawnTimer);
        gameBoard.innerHTML = '';
        
        skillMessage.textContent = "¡FALLASTE! Se acabó el tiempo y perdiste el disparo.";
        skillMessage.className = "msg fallo-tiempo";
        triggerBtn.disabled = true; // No se puede disparar si se perdió el tiro

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
        grammarMessage.className = 'incorrect msg';
        questionText.textContent = '';
    }

    function initGame() {
        lives = 3;
        score = 0;
        isGameOver = false;
        questionsPool = [...grammarQuestions];
        updateStatsDisplay();
        loadGrammarPhase();
    }

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