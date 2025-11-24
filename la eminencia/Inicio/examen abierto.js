const correctAnswers = {
    q1: {
        answer: 'when', 
        explanation: 'Se usa **when** para introducir una acción corta (el teléfono sonó) que interrumpe una acción más larga que estaba ocurriendo (estaba cocinando).',
        alt_answers: ['When']
    },
    q2: {
        answer: 'while', 
        explanation: 'Se usa **while** para conectar dos acciones largas que suceden al mismo tiempo (estudiar y jugar fútbol). Ambas están en pasado continuo.',
        alt_answers: ['While']
    },
    q3: {
        answer: 'when', 
        explanation: 'Se usa **when** para introducir una acción corta (mi mamá llegó) que interrumpe la acción larga de estar durmiendo.',
        alt_answers: ['When']
    },
    q4: {
        answer: 'While I was watching TV, my brother was doing homework.', 
        explanation: 'Esta oración es correcta porque usa **while** para conectar dos acciones que estaban sucediendo simultáneamente en el pasado (watching TV y doing homework), ambas usando la estructura del Pasado Continuo (was/were + verbo-ing).',
        alt_answers: ['b', 'B', 'while i was watching tv my brother was doing homework'] 
    },
    q5: {
        answer: 'b', 
        explanation: 'En el contexto de interrupción (caminando cuando empezó a llover), **when** se usa para introducir la acción más corta (empezó a llover) que interrumpe la acción continua (estaba caminando). Por eso, la opción correcta es la **b**.',
        alt_answers: ['B']
    },
    q6: {
        answer: 'when', 
        explanation: 'La entrada del profesor es una acción corta que interrumpe o finaliza la acción continua de "estar hablando". Se usa **when**.',
        alt_answers: ['When']
    },
    q7: {
        answer: 'while', 
        explanation: 'Ambas acciones ("manejar" y "leer un libro") son acciones largas que suceden en paralelo. Se usa **while**.',
        alt_answers: ['While']
    },
    q8: {
        answer: 'when', 
        explanation: 'La luz se apagó (acción corta) interrumpiendo la acción más larga de "estar viendo la película". Se usa **when**.',
        alt_answers: ['When']
    },
    q9: {
        answer: 'while', 
        explanation: '**While** es el conector principal para mostrar que dos acciones largas estaban ocurriendo al mismo tiempo (acciones simultáneas).',
        alt_answers: ['While']
    },
    q10: {
        answer: 'b', 
        explanation: 'En la estructura "Past Continuous + **when** + Simple Past", la acción que sigue a **when** (I fell down) está en **Pasado Simple** (opción b).',
        alt_answers: ['B']
    }
};

// Función para habilitar/deshabilitar todos los inputs de texto
function disableInputs(disabled) {
    const inputs = document.querySelectorAll('#quizForm input[type="text"]');
    inputs.forEach(input => {
        input.disabled = disabled;
    });
    // También deshabilita el botón de verificar
    document.querySelector('.primary-button').disabled = disabled;
}


// Nueva función para un desplazamiento suave al resultado
function scrollToResult() {
    const resultDiv = document.getElementById('result');
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

// Función para resetear las entradas y el resultado
function resetInputs() {
    const form = document.getElementById('quizForm');
    const questions = document.querySelectorAll('.question');
    const resultDiv = document.getElementById('result');

    // 1. Habilitar inputs antes de resetear
    disableInputs(false); 

    // 2. Limpiar inputs
    form.reset();

    // 3. Limpiar clases y feedback
    questions.forEach(qDiv => {
        qDiv.classList.remove('correct-answer-border', 'incorrect-answer-border');
        const feedbackDiv = qDiv.querySelector('.feedback');
        feedbackDiv.innerHTML = '';
        feedbackDiv.classList.remove('correct', 'incorrect');
        feedbackDiv.style.display = 'none'; // Asegura que se oculte
    });

    // 4. Limpiar resultado
    resultDiv.innerHTML = '';
    resultDiv.className = '';
    resultDiv.style.removeProperty('animation');
}


function checkAnswers() {
    const form = document.getElementById('quizForm');
    const questions = document.querySelectorAll('.question');
    const resultDiv = document.getElementById('result');
    let score = 0;
    const totalQuestions = Object.keys(correctAnswers).length;

    // Limpiar clases y feedback anteriores (Dejar visible solo el feedback actual)
    questions.forEach(qDiv => {
        qDiv.classList.remove('correct-answer-border', 'incorrect-answer-border');
        const feedbackDiv = qDiv.querySelector('.feedback');
        feedbackDiv.innerHTML = '';
        feedbackDiv.classList.remove('correct', 'incorrect');
        feedbackDiv.style.display = 'none'; 
    });
    resultDiv.classList.remove('result-great', 'result-pass', 'result-fail');
    resultDiv.style.removeProperty('animation'); 

    for (const [questionName, data] of Object.entries(correctAnswers)) {
        const inputElement = form.elements[questionName];
        if (!inputElement) continue; 

        const userInput = inputElement.value.trim();
        const questionDiv = document.querySelector(`.question[data-q="${questionName}"]`);
        const feedbackDiv = document.getElementById(`feedback-${questionName}`);
        
        // Normalización de respuestas
        const normalizedInput = userInput.toLowerCase().replace(/[.,!?'"()/]/g, '').replace(/\s+/g, ' ').trim();
        const normalizedAnswer = data.answer.toLowerCase().replace(/[.,!?'"()/]/g, '').replace(/\s+/g, ' ').trim();
        
        let isCorrect = false;

        // Comprobación de la respuesta principal y alternativas
        if (normalizedInput === normalizedAnswer || (data.alt_answers && data.alt_answers.some(alt => {
            const normalizedAlt = alt.toLowerCase().replace(/[.,!?'"()/]/g, '').replace(/\s+/g, ' ').trim();
            return normalizedInput === normalizedAlt;
        }))) {
            isCorrect = true;
        }

        if (isCorrect) {
            score++;
            questionDiv.classList.add('correct-answer-border');
            feedbackDiv.classList.add('correct');
            feedbackDiv.innerHTML = '¡Correcto!✨';
        } else {
            questionDiv.classList.add('incorrect-answer-border');
            feedbackDiv.classList.add('incorrect');
            
            // Determina la forma de mostrar la respuesta correcta
            let correctAnswerDisplay;
            if (questionName === 'q4') {
                correctAnswerDisplay = `<span class="correct-answer-text">${data.answer}</span>`;
            } else if (questionName === 'q5' || questionName === 'q10') {
                 correctAnswerDisplay = `La respuesta correcta es **${data.answer.toUpperCase()}**`;
            } else {
                 correctAnswerDisplay = `La respuesta correcta es: <span class="correct-answer-text">${data.answer}</span>`;
            }

            feedbackDiv.innerHTML = `
                ❌ ¡Incorrecto! Tu respuesta fue: "${userInput}".<br>
                ${correctAnswerDisplay}.<br>
                Explicación: ${data.explanation}
            `;
        }
        
        // Mostrar el feedback
        feedbackDiv.style.display = 'block'; 
    }

    // 5. Deshabilitar inputs y botón de verificar después de la comprobación
    disableInputs(true); 

    // Cálculo y visualización del resultado final
    const percentage = (score / totalQuestions) * 100;
    let resultClass = '';
    let message = '';

    if (percentage === 100) {
        resultClass = 'result-great';
        message = '⭐ ¡Excelente trabajo! ¡Perfecto! ';
    } else if (percentage >= 70) {
        resultClass = 'result-pass';
        message = '👍 Bien hecho. ¡Sigue practicando! ';
    } else {
        resultClass = 'result-fail';
        message = '⚠️ Necesitas repasar. ¡No te rindas! ';
    }

    resultDiv.classList.add(resultClass);
    resultDiv.innerHTML = `
        ${message}
        <div style="font-size: 2.2em; margin-top: 10px; font-weight: 900;">
            ${score} / ${totalQuestions}
        </div>
        <div style="font-size: 1.1em; color: inherit;">
            Puntaje: ${percentage.toFixed(0)}%
        </div>
    `;
    
    // Desplazamiento al resultado final
    scrollToResult();
}