document.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('.fixed-menu');

    // Si por error seguiste usando class="menu", te avisa
    if (!menu) {
        console.error('ERROR: El menú debe tener class="fixed-menu" (no "menu")');
        return;
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            menu.classList.add('scrolled');
        } else {
            menu.classList.remove('scrolled');
        }
    });

    console.log("Menú fijo y efecto scroll activados correctamente");
});