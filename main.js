/* ============================================
   DR. EMILIO BEAS CLINIC — MAIN JS
   Animations, Interactions & Language Toggle
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- PRELOADER ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 2000);
    });
    // Fallback: hide preloader after 4s max
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 4000);

    // --- NAVBAR SCROLL ---
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // --- HAMBURGER MENU ---
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // --- SMOOTH SCROLL ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // --- ACTIVE NAV LINK ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const highlightNav = () => {
        const scrollPos = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    window.addEventListener('scroll', highlightNav);

    // --- REVEAL ON SCROLL ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation within siblings
                const siblings = entry.target.parentElement.querySelectorAll('.reveal');
                let delay = 0;
                siblings.forEach((sib, i) => {
                    if (sib === entry.target) delay = i * 100;
                });
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, Math.min(delay, 400));
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- COUNTER ANIMATION ---
    const statNumbers = document.querySelectorAll('.stat-number');
    let counterAnimated = false;

    const animateCounters = () => {
        if (counterAnimated) return;
        const statsSection = document.getElementById('stats');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            counterAnimated = true;
            statNumbers.forEach(num => {
                const target = parseInt(num.getAttribute('data-target'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        num.textContent = Math.floor(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        num.textContent = target.toLocaleString();
                    }
                };
                updateCounter();
            });
        }
    };

    window.addEventListener('scroll', animateCounters);
    animateCounters();

    // --- WHATSAPP FLOATING BUTTON ---
    const whatsappFloat = document.getElementById('whatsappFloat');

    const showWhatsapp = () => {
        if (window.scrollY > 400) {
            whatsappFloat.classList.add('visible');
        } else {
            whatsappFloat.classList.remove('visible');
        }
    };
    window.addEventListener('scroll', showWhatsapp);

    // --- REVIEWS SLIDER (mobile) ---
    const prevBtn = document.querySelector('.resena-prev');
    const nextBtn = document.querySelector('.resena-next');
    const cards = document.querySelectorAll('.resena-card');
    let currentReview = 0;

    const updateSlider = () => {
        if (window.innerWidth > 768) {
            cards.forEach(card => card.style.display = '');
            return;
        }
        cards.forEach((card, i) => {
            card.style.display = i === currentReview ? 'block' : 'none';
        });
    };

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentReview = (currentReview - 1 + cards.length) % cards.length;
            updateSlider();
        });

        nextBtn.addEventListener('click', () => {
            currentReview = (currentReview + 1) % cards.length;
            updateSlider();
        });
    }

    window.addEventListener('resize', updateSlider);
    updateSlider();

    // --- CONTACT FORM ---
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const phone = formData.get('phone');
            const email = formData.get('email');
            const service = formData.get('service');
            const message = formData.get('message') || 'Sin mensaje adicional';

            // Build WhatsApp message
            const waMessage = encodeURIComponent(
                `¡Hola! Soy ${name}.\n\n` +
                `Me interesa: ${service}\n` +
                `Teléfono: ${phone}\n` +
                `Correo: ${email}\n` +
                `Mensaje: ${message}\n\n` +
                `Enviado desde el sitio web.`
            );

            // Open WhatsApp with form data
            window.open(`https://wa.me/529991234567?text=${waMessage}`, '_blank');

            // Show success
            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';

            // Reset after 5s
            setTimeout(() => {
                contactForm.reset();
                contactForm.style.display = 'flex';
                formSuccess.style.display = 'none';
            }, 5000);
        });
    }

    // --- LANGUAGE TOGGLE ---
    const langToggle = document.getElementById('langToggle');
    let isEnglish = false;

    // Store original Spanish text
    const translatableElements = document.querySelectorAll('[data-en]');
    const originalTexts = new Map();
    translatableElements.forEach(el => {
        originalTexts.set(el, el.textContent);
    });

    langToggle.addEventListener('click', () => {
        isEnglish = !isEnglish;

        if (isEnglish) {
            langToggle.innerHTML = '<span class="lang-flag">🇲🇽</span> ES';
            document.documentElement.lang = 'en';
            translatableElements.forEach(el => {
                el.textContent = el.getAttribute('data-en');
            });
        } else {
            langToggle.innerHTML = '<span class="lang-flag">🇺🇸</span> EN';
            document.documentElement.lang = 'es';
            translatableElements.forEach(el => {
                el.textContent = originalTexts.get(el);
            });
        }
    });

    // --- PARALLAX on hero right image (subtle) ---
    const heroRightImg = document.querySelector('.hero-right img');
    if (heroRightImg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroRightImg.style.transform = `translateY(${scrolled * 0.15}px) scale(1.05)`;
            }
        });
    }

    // --- NAVBAR LINK UNDERLINE on scroll ---
    const allNavLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
    allNavLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transition = 'all 0.3s ease';
        });
    });

    // --- SERVICE CARDS TILT (subtle) ---
    const servicioCards = document.querySelectorAll('.servicio-card');
    servicioCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 30;
            const rotateY = (centerX - x) / 30;
            card.style.transform = `translateY(-6px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

});
