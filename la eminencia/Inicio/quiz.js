document.addEventListener('DOMContentLoaded', () => {
    const questions = [
        { question: "I _____ (read) a book when the phone rang.", answers: ["was reading", "read", "am reading"], correct: 0 },
        { question: "They _____ (play) football at 5 PM yesterday.", answers: ["played", "were playing", "are playing"], correct: 1 },
        { question: "While we _____ (eat), it started to rain.", answers: ["ate", "were eating", "eat"], correct: 1 },
        { question: "She _____ (not watch) TV when I arrived.", answers: ["wasn't watching", "didn't watch", "doesn't watch"], correct: 0 },
        { question: "¿Qué hacías cuando sonó la alarma?", answers: ["What did you do?", "What were you doing?", "What do you do?"], correct: 1 },
        { question: "My brother _____ (sleep) while I was studying.", answers: ["slept", "was sleeping", "sleeps"], correct: 1 },
        { question: "We _____ (talk) when the teacher entered.", answers: ["talked", "were talking", "are talking"], correct: 1 },
        { question: "The kids _____ (run) in the park all afternoon.", answers: ["ran", "were running", "run"], correct: 1 },
        { question: "_____ you _____ (work) at 10 PM last night?", answers: ["Did / work", "Were / working", "Do / work"], correct: 1 },
        { question: "He fell while he _____ (ride) his bike.", answers: ["rode", "was riding", "rides"], correct: 1 }
    ];

    let current = 0;
    let score = 0;

    const questionEl = document.getElementById('question-text');
    const answersEl = document.getElementById('answers');
    const feedbackEl = document.getElementById('feedback');
    const nextBtn = document.getElementById('next-btn');
    const scoreEl = document.getElementById('score');

    const loadQuestion = () => {
        if (current >= questions.length) {
            endGame();
            return;
        }

        const q = questions[current];
        questionEl.textContent = `Pregunta ${current + 1}: ${q.question}`;
        answersEl.innerHTML = '';
        feedbackEl.textContent = '';

        q.answers.forEach((ans, i) => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.textContent = ans;
            btn.onclick = () => selectAnswer(i, q.correct);
            answersEl.appendChild(btn);
        });

        nextBtn.textContent = current === 0 ? "START MISSION" : "Next →";
        nextBtn.style.display = 'block';
    };

    const selectAnswer = (selected, correct) => {
        document.querySelectorAll('.answer-btn').forEach((b, i) => {
            b.disabled = true;
            if (i === correct) b.classList.add('correct');
            if (i === selected && i !== correct) b.classList.add('incorrect');
        });

        if (selected === correct) {
            score += 10;
            feedbackEl.textContent = "CORRECTO!";
            feedbackEl.style.color = '#16A34A';
        } else {
            score = 0;
            feedbackEl.textContent = "INCORRECTO → Puntuación reiniciada";
            feedbackEl.style.color = '#DC3545';
        }

        scoreEl.textContent = score.toString().padStart(3, '0');
        nextBtn.textContent = "Next →";
    };

    const endGame = () => {
        questionEl.textContent = score >= 100 
            ? "¡FELICIDADES! Dominaste el Past Continuous" 
            : `Juego terminado. Puntuación final: ${score}`;
        answersEl.innerHTML = '';
        feedbackEl.textContent = '';
        nextBtn.textContent = "Jugar de nuevo";
        current = -1;
    };

    nextBtn.onclick = () => {
        current++;
        if (current > 0) score = current === 0 ? 0 : score;
        loadQuestion();
    };

    loadQuestion();
});