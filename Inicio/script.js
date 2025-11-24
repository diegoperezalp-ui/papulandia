document.addEventListener('DOMContentLoaded', () => {

    const menuBtn = document.getElementById('menuBtn');
    const fullMenu = document.getElementById('fullMenu');
    const header = document.getElementById('header');

    // Menú hamburguesa
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        fullMenu.classList.toggle('active');
    });

    // Cerrar al hacer clic en enlace
    document.querySelectorAll('.full-menu a').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            fullMenu.classList.remove('active');
        });
    });

    // Header al hacer scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Animaciones de tarjetas
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.module-card').forEach(card => {
        observer.observe(card);
    });
});