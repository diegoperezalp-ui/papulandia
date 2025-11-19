       const menuToggle = document.getElementById('menuToggle');

        const navLinks = document.getElementById('navLinks');

        menuToggle.addEventListener('click', () => {

            navLinks.classList.toggle('open');

        });

        const observer = new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add('revealed');

                }

            });

        }, { threshold: 0.1 });

        document.querySelectorAll('.module-card, .about').forEach(el => {

            observer.observe(el);

        }); 