window.addEventListener('scroll', () => {
    const menu = document.querySelector('.menu');
    if (window.scrollY > 100) {
        menu.style.background = 'rgba(0, 40, 104, 0.98)';
    } else {
        menu.style.background = 'rgba(0, 40, 104, 0.95)';
    }
});

console.log("Página de Past Continuous + When/While cargada correctamente");