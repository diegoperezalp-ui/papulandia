document.addEventListener('DOMContentLoaded', () => {

    const questions = [
        {
            question: "Choose the correct Past Continuous form: 'I _____ (listen) to music when you arrived.'",
            answers: [
                { text: "was listen", correct: false },
                { text: "was listening", correct: true },
                { text: "am listening", correct: false }
            ]
        },
        {
            question: "What was he doing at 8 PM yesterday?",
            answers: [
                { text: "He watched TV.", correct: false },
                { text: "He was watching TV.", correct: true },
                { text: "He is watching TV.", correct: false }
            ]
        },
        {
            question: "Complete the sentence: 'While they _____ (talk), the teacher entered the classroom.'",
            answers: [
                { text: "were talking", correct: true },
                { text: "are talking", correct: false },
                { text: "talked", correct: false }
            ]
        },
        {
            question: "The students _____ (not study) when the fire alarm rang.",
            answers: [
                { text: "was not studying", correct: false },
                { text: "were not studying", correct: true },
                { text: "did not study", correct: false }
            ]
        },
        {
            question: "Translate: '¿Estaba ella durmiendo cuando llamaste?'",
            answers: [
                { text: "Did she sleep when you called?", correct: false },
                { text: "Was she sleeping when you called?", correct: true },
                { text: "Is she sleeping when you called?", correct: false }
            ]
        },
        {
            question: "My parents _____ (drive) home while I was reading a book.",
            answers: [
                { text: "drove", correct: false },
                { text: "were driving", correct: true },
                { text: "was driving", correct: false }
            ]
        },
        {
            question: "We _____ (not pay) attention during the lecture.",
            answers: [
                { text: "wasn't paying", correct: false },
                { text: "aren't paying", correct: false },
                { text: "weren't paying", correct: true }
            ]
        },
        {
            question: "The dog _____ (bark) all night long.",
            answers: [
                { text: "was barking", correct: true },
                { text: "is barking", correct: false },
                { text: "barked", correct: false }
            ]
        },
        {
            question: "_____ you _____ (clean) your room this morning?",
            answers: [
                { text: "Did / clean", correct: false },
                { text: "Were / cleaning", correct: true },
                { text: "Are / cleaning", correct: false }
            ]
        },
        {
            question: "I hurt my leg when I _____ (play) basketball.",
            answers: [
                { text: "was playing", correct: true },
                { text: "played", correct: false },
                { text: "am playing", correct: false }
            ]
        }
    ];

    const questionTextElement = document.getElementById('question-text');
    const answersContainer = document.getElementById('answers-container');
    const scoreElement = document.getElementById('current-score');
    const feedbackElement = document.getElementById('feedback');
    const nextButton = document.getElementById('next-button');

    let currentQuestionIndex = 0;
    let score = 0;
    const maxScore = 10;
    const scoreIncrement = maxScore / questions.length; // 1 punto por pregunta

    /** Actualiza el marcador visible */
    const updateScore = () => {
        scoreElement.textContent = score.toFixed(0);
    };

    /** Muestra la pregunta actual y sus respuestas */
    const showQuestion = () => {
        // Limpiar
        answersContainer.innerHTML = '';
        feedbackElement.textContent = '';
        nextButton.style.display = 'none';

        if (currentQuestionIndex >= questions.length) {
            endGame();
            return;
        }

        const currentQuestion = questions[currentQuestionIndex];
        questionTextElement.textContent = `Question ${currentQuestionIndex + 1}: ${currentQuestion.question}`;

        currentQuestion.answers.forEach(answer => {
            const button = document.createElement('button');
            button.textContent = answer.text;
            button.classList.add('answer-btn');
            button.dataset.correct = answer.correct;
            button.addEventListener('click', selectAnswer);
            answersContainer.appendChild(button);
        });
    };

    /** Lógica al seleccionar una respuesta */
    const selectAnswer = (e) => {
        const selectedButton = e.target;
        const isCorrect = selectedButton.dataset.correct === 'true';

        // 1. Deshabilitar todos los botones de respuesta
        Array.from(answersContainer.children).forEach(button => {
            button.disabled = true;
            if (button.dataset.correct === 'true') {
                button.classList.add('correct');
            }
        });

        // 2. Aplicar la lógica de puntuación y reinicio
        if (isCorrect) {
            score += scoreIncrement;
            selectedButton.classList.add('correct');
            feedbackElement.textContent = "Correct! Well done.";
            feedbackElement.style.color = '#28A745';
        } else {
            score = 0; // Reiniciar puntuación a 0
            selectedButton.classList.add('incorrect');
            feedbackElement.textContent = "Incorrect! Score reset to 0. Try again.";
            feedbackElement.style.color = '#DC3545';
        }
        
        updateScore();
        nextButton.textContent = "Next Question";
        nextButton.style.display = 'block';
    };

    /** Pasa a la siguiente pregunta */
    const handleNextButton = () => {
        currentQuestionIndex++;
        if (score === 0) {
            // Si la puntuación es 0, reiniciamos el juego desde la primera pregunta
            currentQuestionIndex = 0;
        }
        showQuestion();
    };

    /** Finaliza el juego */
    const endGame = () => {
        let message = '';
        if (score >= maxScore) {
            message = "Congratulations! You mastered the Past Continuous! Max Score: 10 points.";
            questionTextElement.style.color = '#28A745';
        } else {
            message = `Game Over. Final Score: ${score.toFixed(0)} points. Click 'Restart' to try again!`;
            questionTextElement.style.color = '#003366';
        }

        questionTextElement.textContent = message;
        answersContainer.innerHTML = '';
        feedbackElement.textContent = '';
        nextButton.textContent = "Restart Game";
        nextButton.style.display = 'block';

        currentQuestionIndex = 0; // Prepara para el reinicio
        score = 0;
        updateScore();
    };

    /** Maneja el flujo del botón Start/Next/Restart */
    nextButton.addEventListener('click', () => {
        if (nextButton.textContent === "Start Game" || nextButton.textContent === "Restart Game") {
            currentQuestionIndex = 0;
            score = 0;
            updateScore();
            showQuestion();
        } else {
            handleNextButton();
        }
    });

    // Iniciar el juego en modo "Start Game"
    questionTextElement.textContent = `Welcome to the Past Continuous Challenge! Answer 10 questions correctly to win. An incorrect answer resets your score to 0. Click 'Start Game' to begin.`;
    nextButton.textContent = "Start Game";
});