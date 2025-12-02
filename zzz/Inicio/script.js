document.addEventListener('DOMContentLoaded', () => {

    const header = document.getElementById('header');
    
    // Elementos del Mega-Menú
    const megaMenuToggle = document.getElementById('megaMenuToggle');
    const megaMenuTrigger = document.getElementById('megaMenuTrigger'); // El <li> padre
    
    // ====================================================
    // === LÓGICA DEL MEGA-MENU (CLIC) ===
    // ====================================================

    if (megaMenuToggle && megaMenuTrigger) {
        megaMenuToggle.addEventListener('click', (e) => {
            e.preventDefault(); // Previene la navegación
            e.stopPropagation(); // Evita que el evento burbujee al document y lo cierre inmediatamente
            
            // Alternar la clase 'open' en el elemento padre <li>
            megaMenuTrigger.classList.toggle('open');
        });

        // 2. Cerrar el menú cuando se hace clic fuera de él
        document.addEventListener('click', (e) => {
            // Si el clic no está contenido en el elemento <li> del menú
            if (!megaMenuTrigger.contains(e.target) && megaMenuTrigger.classList.contains('open')) {
                megaMenuTrigger.classList.remove('open');
            }
        });

        // 3. Cerrar el menú cuando se hace clic en un enlace interno
        document.querySelectorAll('.mega-menu a').forEach(item => {
            item.addEventListener('click', () => {
                // Pequeño retraso para que la navegación comience
                setTimeout(() => {
                    megaMenuTrigger.classList.remove('open');
                }, 100);
            });
        });
    }

    // ====================================================
    // === LÓGICA DE SCROLL Y TARJETAS (MANTENIDA) ===
    // ====================================================
    
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