const correctAnswers = {
    q1: { answer: "a", explanation: "Una acción corta (lights went out) interrumpe una acción larga → usamos **when**." },
    q2: { answer: "a", explanation: "La acción corta (someone knocked) interrumpe la acción larga (Sarah was sleeping) → **when**." },
    q3: { answer: "b", explanation: "Dos acciones largas simultáneas (talking + doing homework) → **while**." },
    q4: { answer: "c", explanation: "Ambas son correctas: (a) = interrupción con when; (b) = acciones simultáneas con while." },
    q5: { answer: "b", explanation: "Con 'when' + acción corta que interrumpe, la acción larga va en Past Continuous: was watching." },
    q6: { answer: "b", explanation: "Estructura típica: Past Continuous + when + Past Simple (acción corta)." },
    q7: { answer: "a", explanation: "Pregunta típica con 'What were you doing when...' (interrupción)." },
    q8: { answer: "b", explanation: "Dos acciones largas al mismo tiempo → **while** es la opción natural." },
    q9: { answer: "b", explanation: "Encontrarse con alguien es una acción corta, pero aquí se usa **while** porque 'shopping' es larga y el encuentro ocurre durante ese tiempo." },
    q10: { answer: "b", explanation: "**While** es el conector típico para acciones largas simultáneas." }
};

function disableInputs(disabled) {
    document.querySelectorAll('input[type="radio"]').forEach(r => r.disabled = disabled);
    document.querySelector('.primary-button').disabled = disabled;
}

function scrollToResult() {
    document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function resetQuiz() {
    document.getElementById('quizForm').reset();
    document.querySelectorAll('.question').forEach(q => {
        q.classList.remove('correct-answer-border', 'incorrect-answer-border');
        const fb = q.querySelector('.feedback');
        fb.innerHTML = ''; fb.classList.remove('correct', 'incorrect'); fb.style.display = 'none';
    });
    document.getElementById('result').innerHTML = '';
    disableInputs(false);
}

function checkAnswers() {
    // Verificar que TODAS las preguntas tengan una opción seleccionada
    const total = Object.keys(correctAnswers).length;
    let answeredCount = 0;

    for (const q in correctAnswers) {
        if (document.querySelector(`input[name="${q}"]:checked`)) answeredCount++;
    }

    if (answeredCount < total) {
        document.getElementById('result').className = 'result-fail';
        document.getElementById('result').innerHTML = `
            <div style="font-size: 1.7em; margin-bottom: 12px; font-weight: 700;">
                Por favor, responde TODAS las preguntas antes de verificar.
            </div>
            <p style="font-size: 1.1em; opacity: 0.9;">Faltan ${total - answeredCount} pregunta(s).</p>
        `;
        scrollToResult();
        return;
    }

    // Si está completo → corregir normalmente
    let score = 0;

    document.querySelectorAll('.question').forEach(qDiv => {
        qDiv.classList.remove('correct-answer-border', 'incorrect-answer-border');
        const fb = qDiv.querySelector('.feedback');
        fb.innerHTML = ''; fb.classList.remove('correct', 'incorrect'); fb.style.display = 'none';

        const questionName = qDiv.dataset.q;
        const selected = document.querySelector(`input[name="${questionName}"]:checked`);
        const data = correctAnswers[questionName];

        if (selected && selected.value === data.answer) {
            score++;
            qDiv.classList.add('correct-answer-border');
            fb.classList.add('correct');
            fb.innerHTML = 'Correcto';
        } else {
            qDiv.classList.add('incorrect-answer-border');
            fb.classList.add('incorrect');
            fb.innerHTML = `Incorrecto<br>Respuesta correcta: <strong>${data.answer.toUpperCase()}</strong><br>${data.explanation}`;
        }
        fb.style.display = 'block';
    });

    disableInputs(true);

    const percentage = (score / total) * 100;
    const resultClass = percentage === 100 ? 'result-great' : percentage >= 70 ? 'result-pass' : 'result-fail';
    const messages = { 'result-great': 'Perfecto! Dominas when y while.', 'result-pass': 'Muy bien! Casi perfecto.', 'result-fail': 'Repasa un poco más! Tú puedes.' };

    document.getElementById('result').className = resultClass;
    document.getElementById('result').innerHTML = `
        <div style="font-size: 1.8em; margin-bottom: 8px;">${messages[resultClass]}</div>
        <div style="font-size: 2.6em; margin: 18px 0; font-weight: 900;">${score} / ${total}</div>
        <div style="font-size: 1.3em;">Puntaje: ${percentage.toFixed(0)}%</div>
    `;

    scrollToResult();
}