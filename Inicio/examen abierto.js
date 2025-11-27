const correctAnswers = {
    q1: { answer: 'when', explanation: 'Se usa **when** para introducir una acción corta (el teléfono sonó) que interrumpe una acción más larga que estaba ocurriendo (estaba cocinando).', alt_answers: ['When'] },
    q2: { answer: 'while', explanation: 'Se usa **while** para conectar dos acciones largas que suceden al mismo tiempo (estudiar y jugar fútbol). Ambas están en pasado continuo.', alt_answers: ['While'] },
    q3: { answer: 'when', explanation: 'Se usa **when** para introducir una acción corta (mi mamá llegó) que interrumpe la acción larga de estar durmiendo.', alt_answers: ['When'] },
    q4: { answer: 'While I was watching TV, my brother was doing homework.', explanation: 'Esta oración es correcta porque usa **while** para conectar dos acciones que estaban sucediendo simultáneamente en el pasado (watching TV y doing homework), ambas usando la estructura del Pasado Continuo (was/were + verbo-ing).', alt_answers: ['b', 'B', 'while i was watching tv my brother was doing homework'] },
    q5: { answer: 'b', explanation: 'En el contexto de interrupción (caminando cuando empezó a llover), **when** se usa para introducir la acción más corta (empezó a llover) que interrumpe la acción continua (estaba caminando). Por eso, la opción correcta es la **b**.', alt_answers: ['B'] },
    q6: { answer: 'when', explanation: 'La entrada del profesor es una acción corta que interrumpe o finaliza la acción continua de "estar hablando". Se usa **when**.', alt_answers: ['When'] },
    q7: { answer: 'while', explanation: 'Ambas acciones ("manejar" y "leer un libro") son acciones largas que suceden en paralelo. Se usa **while**.', alt_answers: ['While'] },
    q8: { answer: 'when', explanation: '-Service light se apagó (acción corta) interrumpiendo la acción más larga de "estar viendo la película". Se usa **when**.', alt_answers: ['When'] },
    q9: { answer: 'while', explanation: '**While** es el conector principal para mostrar que dos acciones largas estaban ocurriendo al mismo tiempo (acciones simultáneas).', alt_answers: ['While'] },
    q10: { answer: 'b', explanation: 'En la estructura "Past Continuous + **when** + Simple Past", la acción que sigue a **when** (I fell down) está en **Pasado Simple** (opción b).', alt_answers: ['B'] }
};

// ==================== CONTROL DEL MENÚ HAMBURGUESA ====================
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebarMenu');
    const overlay = document.getElementById('overlay');

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Contador en vivo
    updateProgress();
    document.querySelectorAll('#quizForm input[type="text"]').forEach(input => {
        input.addEventListener('input', updateProgress);
    });
});

// ==================== CONTADOR Y BARRA DE PROGRESO EN VIVO ====================
function updateProgress() {
    const inputs = document.querySelectorAll('#quizForm input[type="text"]');
    const completed = Array.from(inputs).filter(i => i.value.trim() !== '').length;
    document.getElementById('completed').textContent = completed;
    document.getElementById('progressBar').style.width = (completed / 10 * 100) + '%';
}

// ==================== DESHABILITAR INPUTS ====================
function disableInputs(disabled) {
    document.querySelectorAll('#quizForm input[type="text"], .magic-btn').forEach(el => {
        el.disabled = disabled;
    });
}

// ==================== SCROLL SUAVE AL RESULTADO ====================
function scrollToResult() {
    document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ==================== REINICIAR EXAMEN ====================
function resetInputs() {
    document.getElementById('quizForm').reset();
    document.querySelectorAll('.question-card').forEach(q => {
        q.classList.remove('correct-answer-border', 'incorrect-answer-border');
        const fb = q.querySelector('.feedback');
        if (fb) {
            fb.innerHTML = '';
            fb.classList.remove('correct', 'incorrect', 'show');
            fb.style.display = 'none';
        }
    });
    document.getElementById('result').innerHTML = '';
    document.getElementById('result').className = '';
    document.getElementById('result').classList.remove('show');
    disableInputs(false);
    updateProgress();
}

// ==================== CORREGIR RESPUESTAS ====================
function checkAnswers() {
    const form = document.getElementById('quizForm');
    const resultDiv = document.getElementById('result');

    // Comprobar que todas están contestadas
    let allAnswered = true;
    for (const [name] of Object.entries(correctAnswers)) {
        const input = form.elements[name];
        if (!input || input.value.trim() === '') {
            allAnswered = false;
            break;
        }
    }

    if (!allAnswered) {
        resultDiv.className = 'result-fail show';
        resultDiv.innerHTML = `
            <div style="font-size:2em; font-weight:900; margin-bottom:16px;">
                ¡Faltan respuestas!
            </div>
            <p style="font-size:1.2em;">Completa las 10 preguntas antes de corregir.</p>
        `;
        scrollToResult();
        return;
    }

    // Corrección real
    let score = 0;
    const totalQuestions = Object.keys(correctAnswers).length;

    // Limpiar feedback anterior
    document.querySelectorAll('.question-card').forEach(qDiv => {
        qDiv.classList.remove('correct-answer-border', 'incorrect-answer-border');
        const feedbackDiv = qDiv.querySelector('.feedback');
        if (feedbackDiv) {
            feedbackDiv.innerHTML = '';
            feedbackDiv.classList.remove('correct', 'incorrect', 'show');
            feedbackDiv.style.display = 'none';
        }
    });
    resultDiv.className = '';
    resultDiv.classList.remove('show');

    for (const [questionName, data] of Object.entries(correctAnswers)) {
        const inputElement = form.elements[questionName];
        const userInput = inputElement.value.trim();
        const questionDiv = document.querySelector(`.question-card[data-q="${questionName}"]`);
        const feedbackDiv = document.getElementById(`feedback-${questionName}`);

        const normalizedInput = userInput.toLowerCase().replace(/[.,!?'"()/]/g, '').replace(/\s+/g, ' ').trim();
        const normalizedAnswer = data.answer.toLowerCase().replace(/[.,!?'"()/]/g, '').replace(/\s+/g, ' ').trim();

        let isCorrect = normalizedInput === normalizedAnswer ||
            (data.alt_answers && data.alt_answers.some(alt =>
                alt.toLowerCase().replace(/[.,!?'"()/]/g, '').replace(/\s+/g, ' ').trim() === normalizedInput
            ));

        if (isCorrect) {
            score++;
            questionDiv.classList.add('correct-answer-border');
            feedbackDiv.classList.add('correct', 'show');
            feedbackDiv.innerHTML = '¡Correcto!';
        } else {
            questionDiv.classList.add('incorrect-answer-border');
            feedbackDiv.classList.add('incorrect', 'show');

            let correctDisplay = (questionName === 'q4')
                ? data.answer
                : (questionName === 'q5' || questionName === 'q10')
                    ? data.answer.toUpperCase()
                    : data.answer;

            feedbackDiv.innerHTML = `
                <strong>Incorrecto</strong><br>
                Respuesta correcta: <strong>${correctDisplay}</strong><br><br>
                ${data.explanation}
            `;
        }
        feedbackDiv.style.display = 'block';
    }

    disableInputs(true);

    const percentage = (score / totalQuestions) * 100;
    const resultClass = percentage === 100 ? 'result-great' : percentage >= 70 ? 'result-pass' : 'result-fail';

    resultDiv.className = resultClass + ' show';
    resultDiv.innerHTML = `
        <div style="font-size:2.8em; margin-bottom:16px; font-weight:900;">
            ${percentage === 100 ? '¡PERFECTO!' : percentage >= 70 ? '¡MUY BIEN!' : 'SIGUE PRACTICANDO'}
        </div>
        <div style="font-size:6rem; margin:30px 0; font-weight:900;
             background: linear-gradient(90deg,#c084fc,#e0a3ff,#a78bfa);
             -webkit-background-clip:text; color:transparent;">
            ${score} / ${totalQuestions}
        </div>
        <div style="font-size:2em;">${percentage.toFixed(0)}% de aciertos</div>
    `;

    scrollToResult();
}