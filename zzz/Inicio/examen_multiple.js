document.getElementById('menuBtn').onclick = () => {
    document.getElementById('menuPanel').classList.toggle('active');
};

// Respuestas correctas (a = when, b = while)
const correctas = {q1:"a", q2:"b", q3:"b", q4:"a", q5:"b", q6:"a", q7:"a", q8:"a", q9:"b", q10:"a"};

const explicaciones = {
    q1: "Acción corta (doorbell rang) interrumpe una acción larga → <strong>when</strong>",
    q2: "Dos acciones largas simultáneas → <strong>while</strong>",
    q3: "Acción larga + acción corta puntual → <strong>while</strong>",
    q4: "Acción corta (lights went out) interrumpe → <strong>when</strong>",
    q5: "Dos acciones largas al mismo tiempo → <strong>while</strong>",
    q6: "Acción corta que interrumpe una larga → <strong>when</strong>",
    q7: "Acción larga interrumpida repentinamente → <strong>when</strong>",
    q8: "Acción corta (arrived) interrumpe → <strong>when</strong>",
    q9: "Dos acciones largas paralelas → <strong>while</strong>",
    q10: "Acción corta (called) interrumpe → <strong>when</strong>"
};

document.getElementById('enviar').onclick = () => {
    let buenas = 0;
    let todasContestadas = true;

    document.querySelectorAll('.card').forEach(card => {
        const name = card.querySelector('input').name;
        const seleccionado = card.querySelector('input:checked');
        const retro = card.querySelector('.retro');

        if (!seleccionado) {
            todasContestadas = false;
            retro.innerHTML = `<span style="color:#fbbf24;font-weight:700">Contesta esta pregunta para enviar</span>`;
            retro.classList.add('show');
            card.style.borderLeft = "12px solid #fbbf24";
            return;
        }

        const valor = seleccionado.value;
        card.querySelectorAll('input').forEach(i => i.disabled = true);

        if (valor === correctas[name]) {
            buenas++;
            card.style.borderLeft = "12px solid #22c55e";
            retro.innerHTML = `<span style="color:#22c55e">¡Correcto!</span><br>${explicaciones[name]}`;
        } else {
            card.style.borderLeft = "12px solid #ef4444";
            retro.innerHTML = `<span style="color:#ef4444">Incorrecto</span><br>Correcta: <strong>${correctas[name]==="a"?"when":"while"}</strong><br>${explicaciones[name]}`;
        }
        retro.classList.add('show');
    });

    if (!todasContestadas) return;

    const porcentaje = Math.round((buenas / 10) * 100);
    document.getElementById('resultado').innerHTML = `
        <h2 style="font-size:8rem;color:#fff;margin:0">${buenas}/10</h2>
        <h3 style="font-size:4.5rem;color:#ddd6fe">${porcentaje}%</h3>
        <p style="font-size:3rem;color:#fff;margin-top:40px">
            ${buenas === 10 ? '¡PERFECCIÓN ESTELAR!' : buenas >= 7 ? '¡Excelente trabajo!' : '¡Sigue practicando!'}
        </p>
    `;
    document.getElementById('resultado').classList.add('show');

    if (buenas === 10) {
        confetti({ particleCount: 500, spread: 130, origin: { y: 0.6 } });
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3');
        audio.play();
    }

    document.getElementById('enviar').disabled = true;
    document.getElementById('enviar').textContent = "Enviado";
};

document.getElementById('reiniciar').onclick = () => {
    if (confirm("¿Quieres reiniciar el examen?")) location.reload();
};