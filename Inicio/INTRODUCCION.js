window.addEventListener('load', () => {
    // Respiración de Vader
    const breath = document.getElementById('vaderBreath');
    breath.volume = 0.4;
    breath.play();

    // Efecto de sable escribiendo el texto
    setTimeout(() => document.getElementById('title1').style.opacity =
'1', 1000);
    setTimeout(() => {
        document.getElementById('lightsaber').play();
        document.getElementById('title2').style.opacity = '1';
    }, 2000);
    setTimeout(() => document.getElementById('subtitle').style.opacity
= '1', 3000);
});

// Al hacer clic
document.getElementById('enterLink').addEventListener('click', (e) => {
    e.preventDefault();

    document.getElementById('lightsaber').play();

    // Vader desaparece con estilo
    document.getElementById('vader').style.transition = 'all 1s ease';
    document.getElementById('vader').style.transform =
'translate(-50%, -50%) scale(0) rotate(360deg)';
    document.getElementById('vader').style.opacity = '0';

    // Estrella explota
    document.getElementById('usaStar').style.transition = 'all 1.0s ease';
    document.getElementById('usaStar').style.transform =
'translate(-50%, -50%) scale(30)';
    document.getElementById('usaStar').style.opacity = '0';

    // Confeti rojo, blanco y azul
    confetti({ particleCount: 400, spread: 100, origin: { y: 0.6 },
colors: ['#ff0000', '#ffffff', '#0000ff'] });

    setTimeout(() => { window.location.href = "index.html"; }, 1800);
});
