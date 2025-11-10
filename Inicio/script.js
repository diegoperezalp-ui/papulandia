document.addEventListener('DOMContentLoaded', () => {
    
    const menuToggle = document.getElementById('menu-toggle');
    const mainDropdown = document.getElementById('main-dropdown');

    menuToggle.addEventListener('click', () => {
        // Alternar la clase 'active' para mostrar/ocultar el menú
        mainDropdown.classList.toggle('active');
        // Alternar la clase 'open' para rotar la flecha
        menuToggle.classList.toggle('open');
    });

    const revealElements = document.querySelectorAll('.reveal-element');

    const checkVisibility = () => {
        const windowHeight = window.innerHeight;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight * 0.8) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); 
});