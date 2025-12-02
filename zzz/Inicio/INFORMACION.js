// Archivo JavaScript único para todas las páginas
// Maneja funcionalidades comunes: navegación, interacciones, efectos

document.addEventListener('DOMContentLoaded', function() {
    console.log("Academic Grammar Pro - Cargado");
    
    // ============================================
    // 1. MENÚ MÓVIL (Funciona en todas las páginas)
    // ============================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            const isVisible = mobileMenu.style.display === 'flex';
            mobileMenu.style.display = isVisible ? 'none' : 'flex';
            
            // Cambiar ícono
            mobileMenuBtn.innerHTML = isVisible ? 
                '<span class="material-symbols-sharp">menu</span>' : 
                '<span class="material-symbols-sharp">close</span>';
        });
        
        // Cerrar menú al hacer clic en un enlace
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.style.display = 'none';
                mobileMenuBtn.innerHTML = '<span class="material-symbols-sharp">menu</span>';
            });
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(event) {
            if (mobileMenu.style.display === 'flex' && 
                !mobileMenu.contains(event.target) && 
                !mobileMenuBtn.contains(event.target)) {
                mobileMenu.style.display = 'none';
                mobileMenuBtn.innerHTML = '<span class="material-symbols-sharp">menu</span>';
            }
        });
    }
    
    // ============================================
    // 2. ELEMENTOS INTERACTIVOS COMUNES
    // ============================================
    
    // Toggle para contenido oculto (funciona en cualquier página)
    document.querySelectorAll('.interactive-element').forEach(element => {
        element.addEventListener('click', function() {
            const targetId = this.getAttribute('onclick')?.match(/toggleContent\('(.+?)'\)/)?.[1];
            if (targetId) {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const isVisible = targetElement.style.display === 'block';
                    targetElement.style.display = isVisible ? 'none' : 'block';
                    
                    // Cambiar ícono
                    const icon = this.querySelector('.material-symbols-sharp');
                    if (icon) {
                        icon.textContent = isVisible ? 'expand_more' : 'expand_less';
                    }
                }
            }
        });
    });
    
    // Función global para toggle de contenido
    window.toggleContent = function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = element.style.display === 'block' ? 'none' : 'block';
        }
    };
    
    // ============================================
    // 3. QUIZ INTERACTIVO (Funciona en cualquier página que tenga quiz)
    // ============================================
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', function() {
            const isCorrect = this.getAttribute('data-correct') === 'true';
            const quizItem = this.closest('.quiz-item');
            
            if (!quizItem) return;
            
            // Deshabilitar todos los botones en este quiz item
            const allOptions = quizItem.querySelectorAll('.quiz-option');
            allOptions.forEach(opt => {
                opt.style.pointerEvents = 'none';
                
                // Marcar respuesta correcta
                if (opt.getAttribute('data-correct') === 'true') {
                    opt.classList.add('correct');
                    opt.innerHTML += ' <span class="material-symbols-sharp">check</span>';
                }
                
                // Marcar respuesta incorrecta si fue la seleccionada
                if (opt === this && !isCorrect) {
                    opt.classList.add('incorrect');
                    opt.innerHTML += ' <span class="material-symbols-sharp">close</span>';
                }
            });
            
            // Mostrar feedback
            const feedback = quizItem.querySelector('.quiz-feedback');
            if (feedback) {
                feedback.classList.remove('hidden');
                
                if (isCorrect) {
                    feedback.style.backgroundColor = '#E8F5E9';
                    feedback.style.borderLeftColor = '#4CAF50';
                    createConfettiEffect(this); // Efecto visual
                } else {
                    feedback.style.backgroundColor = '#FFEBEE';
                    feedback.style.borderLeftColor = '#FF5252';
                }
            }
        });
    });
    
    // ============================================
    // 4. EFECTOS VISUALES COMUNES
    // ============================================
    
    // Efecto de confeti (reutilizable)
    function createConfettiEffect(element) {
        const colors = ['#7B5EFF', '#FF6BD6', '#10B981', '#06B6D4', '#9D4EDD'];
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < 15; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.left = (rect.left + rect.width / 2) + 'px';
            confetti.style.top = (rect.top + rect.height / 2) + 'px';
            confetti.style.zIndex = '1000';
            confetti.style.pointerEvents = 'none';
            
            document.body.appendChild(confetti);
            
            // Animación
            const angle = Math.random() * Math.PI * 2;
            const velocity = 2 + Math.random() * 2;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            let posX = 0;
            let posY = 0;
            let opacity = 1;
            
            function animate() {
                posX += vx;
                posY += vy + 0.1; // Gravedad
                opacity -= 0.02;
                
                confetti.style.transform = `translate(${posX}px, ${posY}px)`;
                confetti.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    confetti.remove();
                }
            }
            
            requestAnimationFrame(animate);
        }
    }
    
    // Línea de tiempo interactiva
    document.querySelectorAll('.timeline').forEach(timeline => {
        timeline.addEventListener('mouseenter', function() {
            const progress = this.querySelector('.timeline-progress');
            if (progress) {
                progress.style.width = '0%';
                setTimeout(() => {
                    const type = this.classList.contains('when-timeline') ? '50%' : '100%';
                    progress.style.width = type;
                }, 10);
            }
        });
        
        timeline.addEventListener('mouseleave', function() {
            const progress = this.querySelector('.timeline-progress');
            if (progress) {
                progress.style.width = '0%';
            }
        });
    });
    
    // ============================================
    // 5. BOTÓN PARA SUBIR AL INICIO (Global)
    // ============================================
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<span class="material-symbols-sharp">arrow_upward</span>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.position = 'fixed';
    scrollToTopBtn.style.bottom = '20px';
    scrollToTopBtn.style.right = '20px';
    scrollToTopBtn.style.backgroundColor = 'var(--primary)';
    scrollToTopBtn.style.color = 'white';
    scrollToTopBtn.style.border = 'none';
    scrollToTopBtn.style.borderRadius = '50%';
    scrollToTopBtn.style.width = '50px';
    scrollToTopBtn.style.height = '50px';
    scrollToTopBtn.style.fontSize = '1.5rem';
    scrollToTopBtn.style.cursor = 'pointer';
    scrollToTopBtn.style.boxShadow = '0 4px 15px rgba(123, 94, 255, 0.5)';
    scrollToTopBtn.style.zIndex = '100';
    scrollToTopBtn.style.display = 'none';
    scrollToTopBtn.style.transition = 'opacity 0.3s';
    scrollToTopBtn.style.alignItems = 'center';
    scrollToTopBtn.style.justifyContent = 'center';
    
    document.body.appendChild(scrollToTopBtn);
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', function() {
        scrollToTopBtn.style.display = window.scrollY > 500 ? 'flex' : 'none';
    });
    
    // ============================================
    // 6. EFECTO DE APARICIÓN AL SCROLL
    // ============================================
    const conceptModules = document.querySelectorAll('.concept-module');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('module-visible');
                
                // Efecto en títulos
                const headings = entry.target.querySelectorAll('h3');
                headings.forEach((heading, index) => {
                    setTimeout(() => {
                        heading.style.opacity = '1';
                        heading.style.transform = 'translateY(0)';
                    }, index * 200);
                });
            }
        });
    }, observerOptions);
    
    conceptModules.forEach(module => {
        module.style.opacity = '0.9';
        module.style.transition = 'opacity 0.5s, transform 0.5s';
        observer.observe(module);
        
        // Inicializar efectos en títulos
        const headings = module.querySelectorAll('h3');
        headings.forEach(heading => {
            heading.style.opacity = '0';
            heading.style.transform = 'translateY(20px)';
            heading.style.transition = 'opacity 0.5s, transform 0.5s';
        });
    });
    
    // ============================================
    // 7. MARCAR PÁGINA ACTIVA EN NAVEGACIÓN
    // ============================================
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
        
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage || 
                (currentPage === '' && linkPage === 'index.html') ||
                (currentPage.includes('informacion') && linkPage.includes('informacion'))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    setActiveNavLink();
    
    // ============================================
    // 8. ANIMACIÓN DE CARGA SUAVE
    // ============================================
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
    
    // ============================================
    // 9. PREVENIR COMPORTAMIENTOS POR DEFECTO
    // ============================================
    document.querySelectorAll('a[href="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
        });
    });
});