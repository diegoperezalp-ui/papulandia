const correctAnswers = {
    q1: { answer: 'when', explanation: 'Se usa **when** para introducir una acción corta (el teléfono sonó) que interrumpe una acción más larga que estaba ocurriendo (estaba cocinando).', alt_answers: ['When'] },
    q2: { answer: 'while', explanation: 'Se usa **while** para conectar dos acciones largas que suceden al mismo tiempo (estudiar y jugar fútbol). Ambas están en pasado continuo.', alt_answers: ['While'] },
    q3: { answer: 'when', explanation: 'Se usa **when** para introducir una acción corta (mi mamá llegó) que interrumpe la acción larga de estar durmiendo.', alt_answers: ['When'] },
    q4: { answer: 'While I was watching TV, my brother was doing homework.', explanation: 'Esta oración es correcta porque usa **while** para conectar dos acciones que estaban sucediendo simultáneamente en el pasado (watching TV y doing homework), ambas usando la estructura del Pasado Continuo (was/were + verbo-ing).', alt_answers: ['b', 'B', 'while i was watching tv my brother was doing homework'] },
    q5: { answer: 'b', explanation: 'En el contexto de interrupción (caminando cuando empezó a llover), **when** se usa para introducir la acción más corta (empezó a llover) que interrumpe la acción continua (estaba caminando). Por eso, la opción correcta es la **b**.', alt_answers: ['B'] },
    q6: { answer: 'when', explanation: 'La entrada del profesor es una acción corta que interrumpe o finaliza la acción continua de "estar hablando". Se usa **when**.', alt_answers: ['When'] },
    q7: { answer: 'while', explanation: 'Ambas acciones ("manejar" y "leer un libro") son acciones largas que suceden en paralelo. Se usa **while**.', alt_answers: ['While'] },
    q8: { answer: 'when', explanation: 'La luz se apagó (acción corta) interrumpiendo la acción más larga de "estar viendo la película". Se usa **when**.', alt_answers: ['When'] },
    q9: { answer: 'while', explanation: '**While** es el conector principal para mostrar que dos acciones largas estaban ocurriendo al mismo tiempo (acciones simultáneas).', alt_answers: ['While'] },
    q10: { answer: 'b', explanation: 'En la estructura "Past Continuous + **when** + Simple Past", la acción que sigue a **when** (I fell down) está en **Pasado Simple** (opción b).', alt_answers: ['B'] }
};

function disableInputs(disabled) {
    document.querySelectorAll('#quizForm input[type="text"]').forEach(input => input.disabled = disabled);
    document.querySelector('.primary-button').disabled = disabled;
}

function scrollToResult() {
    document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function resetInputs() {
    document.getElementById('quizForm').reset();
    document.querySelectorAll('.question').forEach(q => {
        q.classList.remove('correct-answer-border', 'incorrect-answer-border');
        const fb = q.querySelector('.feedback');
        fb.innerHTML = '';
        fb.classList.remove('correct', 'incorrect');
        fb.style.display = 'none';
    });
    document.getElementById('result').innerHTML = '';
    document.getElementById('result').className = '';
    disableInputs(false);
}

function checkAnswers() {
    const form = document.getElementById('quizForm');
    const resultDiv = document.getElementById('result');

    // Comprobar si TODAS las preguntas están contestadas
    let allAnswered = true;
    for (const [name] of Object.entries(correctAnswers)) {
        const input = form.elements[name];
        if (!input || input.value.trim() === '') {
            allAnswered = false;
            break;
        }
    }

    if (!allAnswered) {
        resultDiv.className = 'result-fail';
        resultDiv.innerHTML = `
            <div style="font-size: 1.7em; margin-bottom: 12px; font-weight: 700;">
                Por favor, responde TODAS las preguntas antes de verificar.
            </div>
            <p style="font-size: 1.1em; opacity: 0.9;">No se mostrarán las respuestas hasta completar el examen.</p>
        `;
        scrollToResult();
        return;
    }

    // Si está todo contestado → proceder con la corrección normal
    let score = 0;
    const totalQuestions = Object.keys(correctAnswers).length;

    document.querySelectorAll('.question').forEach(qDiv => {
        qDiv.classList.remove('correct-answer-border', 'incorrect-answer-border');
        const feedbackDiv = qDiv.querySelector('.feedback');
        feedbackDiv.innerHTML = '';
        feedbackDiv.classList.remove('correct', 'incorrect');
        feedbackDiv.style.display = 'none';
    });
    resultDiv.className = '';

    for (const [questionName, data] of Object.entries(correctAnswers)) {
        const inputElement = form.elements[questionName];
        const userInput = inputElement.value.trim();
        const questionDiv = document.querySelector(`.question[data-q="${questionName}"]`);
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
            feedbackDiv.classList.add('correct');
            feedbackDiv.innerHTML = 'Correcto';
        } else {
            questionDiv.classList.add('incorrect-answer-border');
            feedbackDiv.classList.add('incorrect');
            let correctDisplay = (questionName === 'q4')
                ? data.answer
                : (questionName === 'q5' || questionName === 'q10')
                    ? data.answer.toUpperCase()
                    : data.answer;

            feedbackDiv.innerHTML = `
                Incorrecto<br>
                Respuesta correcta: <strong>${correctDisplay}</strong><br>
                ${data.explanation}
            `;
        }
        feedbackDiv.style.display = 'block';
    }

    disableInputs(true);

    const percentage = (score / totalQuestions) * 100;
    const resultClass = percentage === 100 ? 'result-great' : percentage >= 70 ? 'result-pass' : 'result-fail';
    const messages = {
        'result-great': 'Excelente trabajo! Perfecto!',
        'result-pass': 'Bien hecho. Sigue practicando!',
        'result-fail': 'Necesitas repasar. No te rindas!'
    };

    resultDiv.className = resultClass;
    resultDiv.innerHTML = `
        <div style="font-size: 1.8em; margin-bottom: 8px;">${messages[resultClass]}</div>
        <div style="font-size: 2.6em; margin: 16px 0; font-weight: 900;">${score} / ${totalQuestions}</div>
        <div style="font-size: 1.3em;">Puntaje: ${percentage.toFixed(0)}%</div>
    `;

    scrollToResult();
}