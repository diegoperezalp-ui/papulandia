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
    // 2. MENÚ DESPLEGABLE FUNCIONAL
    // ============================================
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', function() {
            const dropdownContent = this.querySelector('.dropdown-content');
            if (dropdownContent) {
                dropdownContent.style.display = 'block';
            }
        });
        
        dropdown.addEventListener('mouseleave', function() {
            const dropdownContent = this.querySelector('.dropdown-content');
            if (dropdownContent) {
                dropdownContent.style.display = 'none';
            }
        });
    });
    
    // ============================================
    // 3. ELEMENTOS INTERACTIVOS COMUNES
    // ============================================
    
    // Toggle para contenido oculto
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
            const isVisible = element.style.display === 'block';
            element.style.display = isVisible ? 'none' : 'block';
            
            // Animar la apertura/cierre
            if (!isVisible) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(-10px)';
                element.style.transition = 'opacity 0.3s, transform 0.3s';
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 10);
            }
        }
    };
    
    // ============================================
    // 4. SISTEMA DE VIDEOS EMBEBIDOS
    // ============================================
    
    // Crear modal para videos
    const videoModal = document.createElement('div');
    videoModal.className = 'video-modal';
    videoModal.innerHTML = `
        <div class="video-modal-content">
            <span class="close-modal material-symbols-sharp">close</span>
            <div id="videoPlayer"></div>
        </div>
    `;
    document.body.appendChild(videoModal);
    
    // Función para abrir videos
    window.openVideo = function(videoUrl) {
        const videoId = videoUrl.split('/').pop();
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        
        document.getElementById('videoPlayer').innerHTML = `
            <iframe src="${embedUrl}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
            </iframe>
        `;
        
        videoModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevenir scroll
    };
    
    // Cerrar modal
    videoModal.querySelector('.close-modal').addEventListener('click', function() {
        videoModal.style.display = 'none';
        document.getElementById('videoPlayer').innerHTML = '';
        document.body.style.overflow = 'auto';
    });
    
    // Cerrar modal al hacer clic fuera
    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            videoModal.style.display = 'none';
            document.getElementById('videoPlayer').innerHTML = '';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Cerrar modal con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && videoModal.style.display === 'flex') {
            videoModal.style.display = 'none';
            document.getElementById('videoPlayer').innerHTML = '';
            document.body.style.overflow = 'auto';
        }
    });
    
    // ============================================
    // 5. QUIZ INTERACTIVO
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
                opt.style.transition = 'all 0.3s';
                
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
            
            // Mostrar feedback con animación
            const feedback = quizItem.querySelector('.quiz-feedback');
            if (feedback) {
                feedback.classList.remove('hidden');
                feedback.style.opacity = '0';
                feedback.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    feedback.style.transition = 'opacity 0.5s, transform 0.5s';
                    feedback.style.opacity = '1';
                    feedback.style.transform = 'translateY(0)';
                    
                    if (isCorrect) {
                        feedback.style.backgroundColor = '#E8F5E9';
                        feedback.style.borderLeftColor = '#4CAF50';
                        createConfettiEffect(this);
                    } else {
                        feedback.style.backgroundColor = '#FFEBEE';
                        feedback.style.borderLeftColor = '#FF5252';
                    }
                }, 10);
            }
        });
    });
    
    // ============================================
    // 6. EFECTOS VISUALES COMUNES
    // ============================================
    
    // Efecto de confeti
    function createConfettiEffect(element) {
        const colors = ['#7B5EFF', '#FF6BD6', '#10B981', '#06B6D4', '#9D4EDD'];
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < 20; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '12px';
            confetti.style.height = '12px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.left = (rect.left + rect.width / 2) + 'px';
            confetti.style.top = (rect.top + rect.height / 2) + 'px';
            confetti.style.zIndex = '1000';
            confetti.style.pointerEvents = 'none';
            confetti.style.opacity = '0.9';
            
            document.body.appendChild(confetti);
            
            // Animación
            const angle = Math.random() * Math.PI * 2;
            const velocity = 2 + Math.random() * 3;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            const rotation = Math.random() * 360;
            
            let posX = 0;
            let posY = 0;
            let opacity = 1;
            
            function animate() {
                posX += vx;
                posY += vy + 0.15; // Gravedad
                opacity -= 0.02;
                rotation += 5;
                
                confetti.style.transform = `translate(${posX}px, ${posY}px) rotate(${rotation}deg)`;
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
    // 7. BOTÓN PARA SUBIR AL INICIO
    // ============================================
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<span class="material-symbols-sharp">arrow_upward</span>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.display = 'none';
    
    document.body.appendChild(scrollToTopBtn);
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollToTopBtn.style.display = 'flex';
            setTimeout(() => {
                scrollToTopBtn.style.opacity = '1';
            }, 10);
        } else {
            scrollToTopBtn.style.opacity = '0';
            setTimeout(() => {
                if (window.scrollY <= 500) {
                    scrollToTopBtn.style.display = 'none';
                }
            }, 300);
        }
    });
    
    // ============================================
    // 8. EFECTO DE APARICIÓN AL SCROLL
    // ============================================
    const conceptModules = document.querySelectorAll('.concept-module');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
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
        module.style.opacity = '0';
        module.style.transform = 'translateY(30px)';
        module.style.transition = 'opacity 0.6s, transform 0.6s';
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
    // 9. MARCAR PÁGINA ACTIVA EN NAVEGACIÓN
    // ============================================
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a, .dropdown-content a');
        
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
    // 10. ANIMACIÓN DE CARGA SUAVE
    // ============================================
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
        
        // Iniciar animaciones de timeline
        setTimeout(() => {
            document.querySelectorAll('.timeline').forEach(timeline => {
                const progress = timeline.querySelector('.timeline-progress');
                if (progress) {
                    progress.style.width = '0%';
                    setTimeout(() => {
                        const type = timeline.classList.contains('when-timeline') ? '50%' : '100%';
                        progress.style.width = type;
                    }, 500);
                }
            });
        }, 1000);
    });
    
    // ============================================
    // 11. PREVENIR COMPORTAMIENTOS POR DEFECTO
    // ============================================
    document.querySelectorAll('a[href="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
        });
    });
    
    // ============================================
    // 12. RESALTAR SECCIÓN ACTIVA AL SCROLL
    // ============================================
    function highlightActiveSection() {
        const sections = document.querySelectorAll('.concept-module');
        const navHeight = document.querySelector('header').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 150;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                section.style.boxShadow = '0 0 0 3px rgba(123, 94, 255, 0.3), 0 20px 45px rgba(0, 0, 0, 0.2)';
                section.style.transform = 'translateY(-3px)';
            } else {
                section.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
                section.style.transform = 'translateY(0)';
            }
        });
    }
    
    window.addEventListener('scroll', highlightActiveSection);
    
    // ============================================
    // 13. MEJORAR INTERACTIVIDAD DE LA TABLA
    // ============================================
    document.querySelectorAll('.comparison-table tr').forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(123, 94, 255, 0.05)';
            this.style.transition = 'background-color 0.3s';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });
    
    // ============================================
    // 14. EFECTO DE COPIA PARA CÓDIGOS
    // ============================================
    document.querySelectorAll('.formula-code').forEach(code => {
        code.addEventListener('click', function() {
            const text = this.textContent;
            navigator.clipboard.writeText(text).then(() => {
                const originalText = this.textContent;
                const originalColor = this.style.color;
                this.textContent = '¡Copiado! ✓';
                this.style.color = 'var(--when-color)';
                this.style.fontWeight = '900';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.color = originalColor;
                    this.style.fontWeight = '';
                }, 1500);
            });
        });
        
        code.style.cursor = 'pointer';
        code.title = 'Haz clic para copiar el código';
        code.style.transition = 'color 0.3s';
    });
    
    // ============================================
    // 15. BARRA DE PROGRESO DE LECTURA
    // ============================================
    function createReadingProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.id = 'reading-progress';
        progressBar.style.position = 'fixed';
        progressBar.style.top = '0';
        progressBar.style.left = '0';
        progressBar.style.width = '0%';
        progressBar.style.height = '4px';
        progressBar.style.background = 'linear-gradient(90deg, var(--secondary) 0%, var(--primary) 100%)';
        progressBar.style.zIndex = '1001';
        progressBar.style.transition = 'width 0.3s';
        progressBar.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', function() {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }
    
    createReadingProgressBar();
    
    // ============================================
    // 16. MEJORAR EXPERIENCIA DE QUIZ CON SONIDO VISUAL
    // ============================================
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', function() {
            const allOptions = this.closest('.quiz-options').querySelectorAll('.quiz-option');
            
            // Animación de selección
            allOptions.forEach(opt => {
                opt.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    opt.style.transform = 'scale(1)';
                }, 150);
            });
            
            // Efecto visual adicional para respuesta correcta
            if (this.getAttribute('data-correct') === 'true') {
                const successEffect = document.createElement('div');
                successEffect.style.position = 'absolute';
                successEffect.style.top = '0';
                successEffect.style.left = '0';
                successEffect.style.right = '0';
                successEffect.style.bottom = '0';
                successEffect.style.background = 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)';
                successEffect.style.borderRadius = 'inherit';
                successEffect.style.pointerEvents = 'none';
                successEffect.style.animation = 'pulse 1s';
                
                this.appendChild(successEffect);
                setTimeout(() => successEffect.remove(), 1000);
            }
        });
    });
    
    // ============================================
    // 17. ANIMACIÓN CSS PARA EFECTOS
    // ============================================
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.05); opacity: 0.4; }
            100% { transform: scale(1); opacity: 0; }
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        /* Efecto de brillo en hover */
        .concept-module:hover {
            background: linear-gradient(135deg, #FFFFFF 0%, #F9FAFF 100%);
        }
        
        /* Mejorar legibilidad en móviles */
        @media (max-width: 768px) {
            body {
                font-size: 17px;
            }
            
            .concept-module p {
                text-align: justify;
                hyphens: auto;
            }
        }
    `;
    
    document.head.appendChild(style);
    
    // ============================================
    // 18. INICIALIZAR MEJORAS ADICIONALES
    // ============================================
    
    // Agregar IDs a las secciones para navegación
    const sections = document.querySelectorAll('.concept-module');
    sections.forEach((section, index) => {
        if (!section.id) {
            section.id = `section-${index + 1}`;
        }
    });
    
    // Mejorar botones de navegación
    const navButtons = document.querySelectorAll('.page-nav-btn');
    navButtons.forEach(button => {
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.gap = '15px';
        button.style.textDecoration = 'none';
    });
    
    // Mejorar títulos con iconos
    document.querySelectorAll('.concept-module h3').forEach(title => {
        const icon = title.querySelector('.material-symbols-sharp');
        if (icon) {
            icon.style.marginRight = '15px';
            icon.style.fontSize = '2.2rem';
        }
    });
    
    // ============================================
    // 19. SISTEMA DE NOTIFICACIONES VISUALES
    // ============================================
    window.showNotification = function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = '10px';
        notification.style.color = 'white';
        notification.style.fontWeight = '600';
        notification.style.zIndex = '2000';
        notification.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
        notification.style.transform = 'translateX(100%)';
        notification.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        
        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #10B981 0%, #0D8C68 100%)';
        } else if (type === 'error') {
            notification.style.background = 'linear-gradient(135deg, #FF5252 0%, #D32F2F 100%)';
        } else {
            notification.style.background = 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)';
        }
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 3000);
    };
    
    // ============================================
    // 20. INICIALIZAR TODO AL CARGAR
    // ============================================
    console.log("Todas las funcionalidades cargadas correctamente");
});