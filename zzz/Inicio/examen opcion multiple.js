// Menú flotante
document.getElementById('menuBtn').addEventListener('click', () => {
    document.getElementById('menuPanel').classList.toggle('active');
});

// Respuestas correctas
const answers = {
    q1: "when", q2: "while", q3: "when",
    q4: "b", q5: "b", q6: "when",
    q7: "while", q8: "while", q9: "while", q10: "b"
};

document.getElementById('checkBtn').addEventListener('click', () => {
    let correct = 0;
    const total = 10;

    // Limpiar feedback
    document.querySelectorAll('.feedback').forEach(f => {
        f.classList.remove('show','correct','incorrect');
        f.innerHTML = '';
    });
    document.querySelectorAll('.question-card').forEach(c => c.classList.remove('correct','incorrect'));

    Object.keys(answers).forEach(key => {
        const card = document.querySelector(`[data-q="${key}"]`);
        const fb = document.getElementById(`fb-${key}`);
        let user = "";

        const text = card.querySelector('input[type="text"]');
        if (text) user = text.value.trim().toLowerCase();

        const radio = card.querySelector('input[type="radio"]:checked');
        if (radio) user = radio.value;

        if (user === answers[key]) {
            correct++;
            card.classList.add('correct');
            fb.innerHTML = 'Correcto';
            fb.classList.add('correct','show');
        } else if (user !== "") {
            card.classList.add('incorrect');
            fb.innerHTML = `Incorrecto<br>Correcta: <strong>${answers[key] === "b" ? "la opción correcta" : answers[key]}</strong>`;
            fb.classList.add('incorrect','show');
        }
    });

    const result = document.getElementById('result');
    result.innerHTML = `
        <div style="font-size:4rem;margin-bottom:20px;">${correct}/${total}</div>
        <div style="font-size:1.8rem;">${correct===10?'¡PERFECTO!' : correct>=7?'¡Muy bien!' : 'Sigue practicando'}</div>
    `;
    result.classList.add('show');
    document.getElementById('checkBtn').disabled = true;
});

document.getElementById('resetBtn').addEventListener('click', () => location.reload());