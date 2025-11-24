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
        alt_answers: ['b', 'B'] // Permite 'b' o 'B' para la opción de pregunta 4
    },
    q5: {
        answer: 'b', 
        explanation: 'En el contexto de interrupción (caminando cuando empezó a llover), **when** se usa para introducir la acción más corta (empezó a llover) que interrumpe la acción continua (estaba caminando). Por eso, la opción correcta es la **b**.',
        alt_answers: ['B', 'It introduces a shorter action that interrupts another.']
    }
};

function checkAnswers() {
    const form = document.getElementById('quizForm');
    const questions = document.querySelectorAll('.question');
    const resultDiv = document.getElementById('result');
    let score = 0;
    const totalQuestions = Object.keys(correctAnswers).length;

    // Limpiar clases y feedback anteriores
    questions.forEach(qDiv => {
        qDiv.classList.remove('correct-answer-border', 'incorrect-answer-border');
        qDiv.querySelector('.feedback').innerHTML = '';
        qDiv.querySelector('.feedback').classList.remove('correct', 'incorrect');
    });
    resultDiv.classList.remove('result-great', 'result-pass', 'result-fail');

    for (const [questionName, data] of Object.entries(correctAnswers)) {
        const userInput = form.elements[questionName].value.trim();
        const questionDiv = document.querySelector(`.question[data-q="${questionName}"]`);
        const feedbackDiv = document.getElementById(`feedback-${questionName}`);
        
        // Normalización y comparación de respuestas
        const normalizedInput = userInput.toLowerCase().replace(/[^a-z0-9]/g, '');
        const normalizedAnswer = data.answer.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        let isCorrect = false;

        // Comprobación de la respuesta principal
        if (normalizedInput === normalizedAnswer) {
            isCorrect = true;
        } 
        
        // Comprobación de respuestas alternativas (útil para mayúsculas/minúsculas o sinónimos simples)
        if (!isCorrect && data.alt_answers) {
             isCorrect = data.alt_answers.some(alt => {
                const normalizedAlt = alt.toLowerCase().replace(/[^a-z0-9]/g, '');
                return normalizedInput === normalizedAlt;
            });
        }

        if (isCorrect) {
            score++;
            questionDiv.classList.add('correct-answer-border');
            feedbackDiv.classList.add('correct');
            feedbackDiv.innerHTML = '¡**Correcto!**';
        } else {
            questionDiv.classList.add('incorrect-answer-border');
            feedbackDiv.classList.add('incorrect');
            
            // Retroalimentación detallada
            const correctAnswerDisplay = questionName === 'q5' ? `La respuesta correcta es **${data.answer.toUpperCase()}**` : `La respuesta correcta es: <span class="correct-answer-text">${data.answer}</span>`;
            
            feedbackDiv.innerHTML = `
                **¡Incorrecto!** Tu respuesta fue: "${userInput}".<br>
                ${correctAnswerDisplay}.<br>
                **Explicación:** ${data.explanation}
            `;
        }
    }

    // Cálculo y visualización del resultado final
    const percentage = (score / totalQuestions) * 100;
    let resultClass = '';
    let message = '';

    if (percentage === 100) {
        resultClass = 'result-great';
        message = '¡Excelente trabajo! ';
    } else if (percentage >= 70) {
        resultClass = 'result-pass';
        message = 'Bien hecho. ¡Sigue practicando! ';
    } else {
        resultClass = 'result-fail';
        message = 'Necesitas repasar. ¡No te rindas! ';
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
}