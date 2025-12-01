document.getElementById('menuBtn').onclick = () => {
    document.getElementById('menuPanel').classList.toggle('active');
};

const correctas = {
    q1: ["when"], q2: ["while"], q3: ["when"], q4: ["while i was watching tv my brother was doing homework"],
    q5: ["acción corta", "interrumpe", "acción corta que interrumpe", "corta"], q6: ["when"], q7: ["while"], q8: ["when"], q9: ["while"], q10: ["simple past", "past simple"]
};

const explicaciones = {
    q1: "Acción corta → <strong>when</strong>",
    q2: "Acciones largas simultáneas → <strong>while</strong>",
    q3: "Acción corta → <strong>when</strong>",
    q4: "La única frase 100% correcta",
    q5: "<strong>when</strong> introduce una acción corta que interrumpe",
    q6: "Entrada del profesor → <strong>when</strong>",
    q7: "Acciones paralelas → <strong>while</strong>",
    q8: "Luz se apagó → <strong>when</strong>",
    q9: "Acciones simultáneas → <strong>while</strong>",
    q10: "Después de <strong>when</strong> → <strong>Simple Past</strong>"
};

document.getElementById('enviar').onclick = () => {
    let buenas = 0;
    let todas = true;

    document.querySelectorAll('.card').forEach(card => {
        const input = card.querySelector('input');
        const retro = card.querySelector('.retro');
        if (!input.value.trim()) {
            todas = false;
            retro.innerHTML = `<span style="color:#fbbf24">¡Falta responder!</span>`;
            retro.classList.add('show');
            card.style.borderLeft = "8px solid #fbbf24";
            return;
        }

        const respuesta = input.value.trim().toLowerCase()
            .replace(/[.,!¡¿?"'()]/g, '').replace(/\s+/g, ' ');

        const esCorrecta = correctas[input.name].some(c => 
            c.toLowerCase().replace(/[.,!¡¿?"'()]/g, '').replace(/\s+/g, ' ') === respuesta
        );

        input.disabled = true;

        if (esCorrecta) {
            buenas++;
            card.style.borderLeft = "8px solid #22c55e";
            retro.innerHTML = `<span style="color:#22c55e">¡Correcto!</span><br>${explicaciones[input.name]}`;
        } else {
            card.style.borderLeft = "8px solid #ef4444";
            retro.innerHTML = `<span style="color:#ef4444">Incorrecto</span><br>Correcta: <strong>${correctas[input.name][0]}</strong><br>${explicaciones[input.name]}`;
        }
        retro.classList.add('show');
    });

    if (!todas) return;

    const porc = Math.round((buenas / 10) * 100);
    document.getElementById('resultado').innerHTML = `
        <h2 style="font-size:8rem;color:#a78bfa">${buenas}/10</h2>
        <h3 style="font-size:4rem;color:#ddd6fe">${porc}%</h3>
        <p style="font-size:2.8rem;color:#fff">${buenas===10?'¡PERFECCIÓN ESTELAR!':'¡Sigue practicando!'}</p>
    `;
    document.getElementById('resultado').classList.add('show');

    if (buenas === 10) {
        confetti({ particleCount: 700, spread: 150, origin: { y: 0.55 } });
        new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3').play();
    }

    document.getElementById('enviar').disabled = true;
};

document.getElementById('reiniciar').onclick = () => location.reload();