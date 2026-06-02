document.addEventListener('DOMContentLoaded', () => {

    /* Initialize Lucide Icons */
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* ==========================================================================
       THEME TOGGLE (DARK / LIGHT)
       ========================================================================== */
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check local storage for preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
    } else {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        }
        // Update Lucide Icons for theme toggle
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });

    /* ==========================================================================
       MOBILE MENU DRAWER
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const menuOpenIcon = mobileToggle.querySelector('.menu-open');
    const menuCloseIcon = mobileToggle.querySelector('.menu-close');
    const navLinksList = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuOpenIcon.classList.toggle('hidden');
        menuCloseIcon.classList.toggle('hidden');
    });

    // Close mobile menu when clicking a link
    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuOpenIcon.classList.remove('hidden');
            menuCloseIcon.classList.add('hidden');
        });
    });

    /* ==========================================================================
       SCROLL INDICATOR & STICKY HEADER
       ========================================================================== */
    const scrollProgress = document.getElementById('scroll-progress');
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        // Scroll Progress
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (totalScroll > 0) {
            const percentage = (window.scrollY / totalScroll) * 100;
            scrollProgress.style.width = percentage + '%';
        }

        // Sticky Header class
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       TYPEWRITER EFFECT
       ========================================================================== */
    const typewriter = document.getElementById('typewriter');
    const words = [
        "Azure Data Engineer",
        "PySpark & Spark SQL Developer",
        "Medallion Architecture Designer",
        "Data Integration Specialist"
    ];
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeDelay = 100;

    function handleTypewriter() {
        const currentWord = words[wordIdx];
        
        if (isDeleting) {
            typewriter.textContent = currentWord.substring(0, charIdx - 1);
            charIdx--;
            typeDelay = 50; // Deleting is faster
        } else {
            typewriter.textContent = currentWord.substring(0, charIdx + 1);
            charIdx++;
            typeDelay = 100; // Normal typing
        }

        if (!isDeleting && charIdx === currentWord.length) {
            typeDelay = 2000; // Pause at the end of word
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            typeDelay = 500; // Pause before typing next word
        }

        setTimeout(handleTypewriter, typeDelay);
    }

    if (typewriter) {
        setTimeout(handleTypewriter, 1000);
    }

    /* ==========================================================================
       INTERSECTION OBSERVERS (SCROLL SPY, SKILL PROGRESS, STATS COUNTERS)
       ========================================================================== */
    
    // 1. Scroll Spy Highlight Navigation Links
    const spySections = document.querySelectorAll('.scroll-spy-section, #hero');
    const navLinks = document.querySelectorAll('.nav-links .nav-link');

    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.25,
        rootMargin: "-80px 0px 0px 0px" // Header offset
    });

    spySections.forEach(section => scrollSpyObserver.observe(section));

    // 2. Skill Progress Animate
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    const skillsSection = document.getElementById('skills');

    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillProgressBars.forEach(bar => {
                    const progress = bar.getAttribute('data-progress');
                    bar.style.width = progress;
                });
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    // 3. Stats Counter Animate
    const statCards = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.stats-section');
    let statsAnimated = false;

    function animateCounters() {
        statCards.forEach(card => {
            const target = parseInt(card.getAttribute('data-target'));
            let current = 0;
            const duration = 1500; // ms
            const stepTime = Math.max(Math.floor(duration / target), 15);
            
            const timer = setInterval(() => {
                current += Math.ceil(target / 50);
                if (current >= target) {
                    card.textContent = target;
                    clearInterval(timer);
                } else {
                    card.textContent = current;
                }
            }, stepTime);
        });
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                animateCounters();
                statsAnimated = true;
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    /* ==========================================================================
       PROJECTS FILTERING
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from other buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Add fade and scaling effects
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9) translateY(10px)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        card.classList.remove('hidden');
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1) translateY(0)';
                        }, 50);
                    } else {
                        card.classList.add('hidden');
                    }
                }, 200);
            });
        });
    });

    /* ==========================================================================
       CONTACT FORM VALIDATION & SIMULATION
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');

    if (contactForm) {
        const submitBtn = contactForm.querySelector('.submit-btn');
        const submitText = contactForm.querySelector('.submit-text');
        const submitIcon = contactForm.querySelector('.submit-icon');
        const spinner = contactForm.querySelector('.loading-spinner');

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            
            // Validate Inputs
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectSelect = document.getElementById('subject');
            const messageInput = document.getElementById('message');

            // Helper validation functions
            const validateField = (input, condition) => {
                const group = input.parentElement;
                if (condition) {
                    group.classList.remove('invalid');
                } else {
                    group.classList.add('invalid');
                    isValid = false;
                }
            };

            validateField(nameInput, nameInput.value.trim() !== '');
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            validateField(emailInput, emailRegex.test(emailInput.value.trim()));
            
            validateField(subjectSelect, subjectSelect.value !== '');
            validateField(messageInput, messageInput.value.trim() !== '');

            // Process Form
            if (isValid) {
                // Show loading states
                submitBtn.disabled = true;
                submitText.style.opacity = '0';
                submitIcon.style.opacity = '0';
                spinner.classList.remove('hidden');

                // Simulate API call timeout
                setTimeout(() => {
                    // Reset buttons
                    submitBtn.disabled = false;
                    submitText.style.opacity = '1';
                    submitIcon.style.opacity = '1';
                    spinner.classList.add('hidden');

                    // Show success modal
                    successModal.classList.add('active');
                    
                    // Reset form fields
                    contactForm.reset();
                    document.querySelectorAll('.input-group').forEach(grp => {
                        grp.classList.remove('invalid');
                    });
                }, 1500);
            }
        });

        // Modal dismissal
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                successModal.classList.remove('active');
            });
        }

        // Click outside modal content to close
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('active');
            }
        });
    }

    // Input elements error clearing on keyup
    const formControls = document.querySelectorAll('#contact-form input, #contact-form textarea, #contact-form select');
    formControls.forEach(ctrl => {
        ctrl.addEventListener('input', () => {
            ctrl.parentElement.classList.remove('invalid');
        });
        if (ctrl.tagName === 'SELECT') {
            ctrl.addEventListener('change', () => {
                ctrl.parentElement.classList.remove('invalid');
            });
        }
    });
});
