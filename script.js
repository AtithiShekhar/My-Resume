/* ==========================================
   PROFESSIONAL PORTFOLIO JAVASCRIPT
   Clean, Optimized, and Well-Structured
   ========================================== */

(function() {
    'use strict';

    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================
    
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const throttle = (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // ==========================================
    // TYPING ANIMATION
    // ==========================================
    
    class TypingAnimation {
        constructor() {
            this.element = document.getElementById('typingName');
            if (!this.element) return;
            
            this.text = this.element.textContent;
            this.element.textContent = '';
            this.element.style.opacity = '1';
            this.charIndex = 0;
            this.init();
        }

        init() {
            setTimeout(() => this.type(), 500);
        }

        type() {
            if (this.charIndex < this.text.length) {
                this.element.textContent += this.text.charAt(this.charIndex);
                this.charIndex++;
                setTimeout(() => this.type(), 100);
            } else {
                this.element.style.borderRight = 'none';
            }
        }
    }

    // ==========================================
    // PARTICLE CANVAS BACKGROUND
    // ==========================================
    
    class ParticleCanvas {
        constructor() {
            this.canvas = document.getElementById('particleCanvas');
            if (!this.canvas) return;
            
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.particleCount = 80;
            
            this.init();
        }

        init() {
            this.resize();
            this.createParticles();
            this.animate();
            
            window.addEventListener('resize', () => this.resize());
        }

        resize() {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
        }

        createParticles() {
            for (let i = 0; i < this.particleCount; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    radius: Math.random() * 2 + 1,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    opacity: Math.random() * 0.5 + 0.2
                });
            }
        }

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.particles.forEach((particle, i) => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Wrap around edges
                if (particle.x < 0) particle.x = this.canvas.width;
                if (particle.x > this.canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = this.canvas.height;
                if (particle.y > this.canvas.height) particle.y = 0;
                
                // Draw particle
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(100, 255, 218, ${particle.opacity})`;
                this.ctx.fill();
                
                // Draw connections
                for (let j = i + 1; j < this.particles.length; j++) {
                    const dx = this.particles[j].x - particle.x;
                    const dy = this.particles[j].y - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 120) {
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = `rgba(100, 255, 218, ${0.2 * (1 - distance / 120)})`;
                        this.ctx.lineWidth = 1;
                        this.ctx.moveTo(particle.x, particle.y);
                        this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        this.ctx.stroke();
                    }
                }
            });
            
            requestAnimationFrame(() => this.animate());
        }
    }

    // ==========================================
    // NAVIGATION FUNCTIONALITY
    // ==========================================
    
    class Navigation {
        constructor() {
            this.navbar = document.getElementById('navbar');
            this.navLinks = document.getElementById('navLinks');
            this.mobileToggle = document.getElementById('mobileToggle');
            this.links = document.querySelectorAll('.nav-links a');
            
            this.init();
        }

        init() {
            this.setupScrollEffect();
            this.setupMobileMenu();
            this.setupActiveLink();
            this.setupSmoothScroll();
        }

        setupScrollEffect() {
            const handleScroll = throttle(() => {
                if (window.pageYOffset > 100) {
                    this.navbar.classList.add('scrolled');
                } else {
                    this.navbar.classList.remove('scrolled');
                }
            }, 100);

            window.addEventListener('scroll', handleScroll);
        }

        setupMobileMenu() {
            this.mobileToggle.addEventListener('click', () => {
                const isExpanded = this.mobileToggle.getAttribute('aria-expanded') === 'true';
                this.mobileToggle.setAttribute('aria-expanded', !isExpanded);
                this.navLinks.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            this.links.forEach(link => {
                link.addEventListener('click', () => {
                    this.navLinks.classList.remove('active');
                    this.mobileToggle.setAttribute('aria-expanded', 'false');
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.navbar.contains(e.target)) {
                    this.navLinks.classList.remove('active');
                    this.mobileToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }

        setupActiveLink() {
            const sections = document.querySelectorAll('section[id]');
            
            const handleScroll = throttle(() => {
                const scrollPosition = window.pageYOffset + 150;

                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    const sectionId = section.getAttribute('id');

                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        this.links.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${sectionId}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            }, 100);

            window.addEventListener('scroll', handleScroll);
        }

        setupSmoothScroll() {
            this.links.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        const offsetTop = targetSection.offsetTop - 70;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                });
            });
            
            // Add scroll indicator functionality
            const scrollIndicator = document.querySelector('.scroll-indicator');
            if (scrollIndicator) {
                scrollIndicator.addEventListener('click', () => {
                    const aboutSection = document.getElementById('about');
                    if (aboutSection) {
                        aboutSection.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            }
        }
    }

    // ==========================================
    // SCROLL PROGRESS BAR
    // ==========================================
    
    class ScrollProgress {
        constructor() {
            this.progressBar = document.getElementById('scrollProgress');
            this.init();
        }

        init() {
            const updateProgress = throttle(() => {
                const windowHeight = window.innerHeight;
                const documentHeight = document.documentElement.scrollHeight;
                const scrollTop = window.pageYOffset;
                const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
                
                this.progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
            }, 50);

            window.addEventListener('scroll', updateProgress);
        }
    }

    // ==========================================
    // STATS COUNTER ANIMATION
    // ==========================================
    
    class StatsCounter {
        constructor() {
            this.statNumbers = document.querySelectorAll('.stat-number[data-target]');
            this.hasAnimated = new Set();
            this.init();
        }

        init() {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !this.hasAnimated.has(entry.target)) {
                            this.animateCounter(entry.target);
                            this.hasAnimated.add(entry.target);
                        }
                    });
                },
                { threshold: 0.5 }
            );

            this.statNumbers.forEach(stat => observer.observe(stat));
        }

        animateCounter(element) {
            const target = parseInt(element.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    element.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target;
                }
            };

            updateCounter();
        }
    }

    // ==========================================
    // BACK TO TOP BUTTON
    // ==========================================
    
    class BackToTop {
        constructor() {
            this.button = document.getElementById('backToTop');
            this.init();
        }

        init() {
            const handleScroll = throttle(() => {
                if (window.pageYOffset > 300) {
                    this.button.classList.add('visible');
                } else {
                    this.button.classList.remove('visible');
                }
            }, 100);

            window.addEventListener('scroll', handleScroll);

            this.button.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // ==========================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ==========================================
    
    class AnimationObserver {
        constructor() {
            this.elements = document.querySelectorAll('.skill-card, .project-card, .timeline-item, .achievement-card');
            this.init();
        }

        init() {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry, index) => {
                        if (entry.isIntersecting) {
                            setTimeout(() => {
                                entry.target.classList.add('fade-in');
                            }, index * 100);
                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                }
            );

            this.elements.forEach(element => {
                element.style.opacity = '0';
                observer.observe(element);
            });
        }
    }

    // ==========================================
    // CONTACT FORM HANDLING
    // ==========================================
    
    class ContactForm {
        constructor() {
            this.form = document.getElementById('contactForm');
            this.submitBtn = document.getElementById('submitBtn');
            this.messageContainer = document.getElementById('formMessage');
            this.init();
        }

        init() {
            if (!this.form) return;
            
            this.form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleSubmit();
            });

            // Real-time validation
            const inputs = this.form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => {
                    if (input.classList.contains('invalid')) {
                        this.validateField(input);
                    }
                });
            });
        }

        validateField(field) {
            const value = field.value.trim();
            const type = field.type;

            let isValid = true;
            let errorMessage = '';

            if (!value) {
                isValid = false;
                errorMessage = 'This field is required';
            } else if (type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
            }

            if (!isValid) {
                field.classList.add('invalid');
                this.showFieldError(field, errorMessage);
            } else {
                field.classList.remove('invalid');
                this.hideFieldError(field);
            }

            return isValid;
        }

        showFieldError(field, message) {
            let errorElement = field.parentElement.querySelector('.field-error');
            if (!errorElement) {
                errorElement = document.createElement('span');
                errorElement.className = 'field-error';
                errorElement.style.color = 'var(--error)';
                errorElement.style.fontSize = '0.875rem';
                errorElement.style.marginTop = '0.25rem';
                errorElement.style.display = 'block';
                field.parentElement.appendChild(errorElement);
            }
            errorElement.textContent = message;
        }

        hideFieldError(field) {
            const errorElement = field.parentElement.querySelector('.field-error');
            if (errorElement) {
                errorElement.remove();
            }
        }

        async handleSubmit() {
            // Validate all fields
            const fields = this.form.querySelectorAll('input, textarea');
            let isFormValid = true;

            fields.forEach(field => {
                if (!this.validateField(field)) {
                    isFormValid = false;
                }
            });

            if (!isFormValid) {
                this.showMessage('Please fill in all fields correctly', 'error');
                return;
            }

            // Get form data
            const formData = new FormData(this.form);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // Show loading state
            const originalContent = this.submitBtn.innerHTML;
            this.submitBtn.innerHTML = `
                <span>Sending...</span>
                <i class="fas fa-spinner fa-spin"></i>
            `;
            this.submitBtn.disabled = true;

            try {
                // Simulate sending delay
                await this.simulateDelay(1000);

                // Create mailto link
                const mailtoLink = `mailto:atithishekhar@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
                    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
                )}`;

                // Open email client
                window.location.href = mailtoLink;

                // Show success message
                this.showMessage('Thank you for your message! Your email client will open shortly.', 'success');

                // Reset form
                this.form.reset();
                fields.forEach(field => {
                    field.classList.remove('invalid');
                    this.hideFieldError(field);
                });

            } catch (error) {
                this.showMessage('Sorry, there was an error. Please try again or email directly.', 'error');
                console.error('Form submission error:', error);
            } finally {
                // Reset button
                this.submitBtn.innerHTML = originalContent;
                this.submitBtn.disabled = false;
            }
        }

        showMessage(message, type) {
            this.messageContainer.innerHTML = `<div class="message ${type}">${message}</div>`;
            const messageEl = this.messageContainer.querySelector('.message');
            
            // Trigger reflow for animation
            messageEl.offsetHeight;
            messageEl.classList.add('show');

            // Auto-hide after 5 seconds
            setTimeout(() => {
                messageEl.classList.remove('show');
                setTimeout(() => {
                    this.messageContainer.innerHTML = '';
                }, 300);
            }, 5000);
        }

        simulateDelay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }

    // ==========================================
    // PROJECT CARD HOVER EFFECTS
    // ==========================================
    
    class ProjectCards {
        constructor() {
            this.cards = document.querySelectorAll('.project-card');
            this.init();
        }

        init() {
            this.cards.forEach(card => {
                card.addEventListener('mouseenter', (e) => {
                    this.handleMouseEnter(e.currentTarget);
                });

                card.addEventListener('mouseleave', (e) => {
                    this.handleMouseLeave(e.currentTarget);
                });
            });
        }

        handleMouseEnter(card) {
            card.style.transform = 'translateY(-12px)';
        }

        handleMouseLeave(card) {
            card.style.transform = 'translateY(0)';
        }
    }

    // ==========================================
    // KEYBOARD NAVIGATION
    // ==========================================
    
    class KeyboardNavigation {
        constructor() {
            this.init();
        }

        init() {
            document.addEventListener('keydown', (e) => {
                // Escape key to close mobile menu
                if (e.key === 'Escape') {
                    const navLinks = document.getElementById('navLinks');
                    const mobileToggle = document.getElementById('mobileToggle');
                    
                    if (navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        mobileToggle.setAttribute('aria-expanded', 'false');
                    }
                }

                // Ctrl/Cmd + K for quick navigation
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    const firstNavLink = document.querySelector('.nav-links a');
                    if (firstNavLink) {
                        firstNavLink.focus();
                    }
                }
            });
        }
    }

    // ==========================================
    // PERFORMANCE OPTIMIZATION
    // ==========================================
    
    class PerformanceOptimizer {
        constructor() {
            this.init();
        }

        init() {
            // Lazy load images
            this.lazyLoadImages();
            
            // Preload critical resources
            this.preloadCriticalResources();
            
            // Add loading class to body
            window.addEventListener('load', () => {
                document.body.classList.add('loaded');
            });
        }

        lazyLoadImages() {
            const images = document.querySelectorAll('img[data-src]');
            
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }

        preloadCriticalResources() {
            // Preload hero section images if any
            const heroImages = document.querySelectorAll('.hero img');
            heroImages.forEach(img => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = img.src;
                document.head.appendChild(link);
            });
        }
    }

    // ==========================================
    // EASTER EGG (KONAMI CODE)
    // ==========================================
    
    class EasterEgg {
        constructor() {
            this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
            this.konamiIndex = 0;
            this.init();
        }

        init() {
            document.addEventListener('keydown', (e) => {
                if (e.key === this.konamiCode[this.konamiIndex]) {
                    this.konamiIndex++;
                    if (this.konamiIndex === this.konamiCode.length) {
                        this.activate();
                        this.konamiIndex = 0;
                    }
                } else {
                    this.konamiIndex = 0;
                }
            });
        }

        activate() {
            // Add confetti effect or special animation
            console.log('🎉 Easter egg activated! You found the secret!');
            this.createConfetti();
        }

        createConfetti() {
            const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c'];
            for (let i = 0; i < 50; i++) {
                setTimeout(() => {
                    const confetti = document.createElement('div');
                    confetti.style.position = 'fixed';
                    confetti.style.width = '10px';
                    confetti.style.height = '10px';
                    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.left = Math.random() * 100 + '%';
                    confetti.style.top = '-10px';
                    confetti.style.borderRadius = '50%';
                    confetti.style.pointerEvents = 'none';
                    confetti.style.zIndex = '9999';
                    document.body.appendChild(confetti);

                    const fall = confetti.animate([
                        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                        { transform: `translateY(100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
                    ], {
                        duration: 2000 + Math.random() * 1000,
                        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    });

                    fall.onfinish = () => confetti.remove();
                }, i * 30);
            }
        }
    }

    // ==========================================
    // ANALYTICS TRACKING
    // ==========================================
    
    class Analytics {
        constructor() {
            this.init();
        }

        init() {
            // Track external link clicks
            document.querySelectorAll('a[target="_blank"]').forEach(link => {
                link.addEventListener('click', () => {
                    this.trackEvent('External Link Click', {
                        url: link.href,
                        text: link.textContent
                    });
                });
            });

            // Track project views
            document.querySelectorAll('.project-link').forEach(link => {
                link.addEventListener('click', () => {
                    const projectName = link.closest('.project-card').querySelector('h3').textContent;
                    this.trackEvent('Project View', {
                        project: projectName
                    });
                });
            });

            // Track time on page
            this.trackTimeOnPage();
        }

        trackEvent(eventName, data) {
            // In production, integrate with Google Analytics, Mixpanel, etc.
            console.log(`Analytics Event: ${eventName}`, data);
        }

        trackTimeOnPage() {
            const startTime = Date.now();
            
            window.addEventListener('beforeunload', () => {
                const timeSpent = Math.floor((Date.now() - startTime) / 1000);
                this.trackEvent('Time on Page', { seconds: timeSpent });
            });
        }
    }

    // ==========================================
    // ACCESSIBILITY ENHANCEMENTS
    // ==========================================
    
    class AccessibilityEnhancements {
        constructor() {
            this.init();
        }

        init() {
            // Add skip to main content link
            this.addSkipLink();
            
            // Ensure focus visibility
            this.enhanceFocusVisibility();
            
            // Add ARIA live regions for dynamic content
            this.setupLiveRegions();
        }

        addSkipLink() {
            const skipLink = document.createElement('a');
            skipLink.href = '#home';
            skipLink.textContent = 'Skip to main content';
            skipLink.className = 'skip-link';
            skipLink.style.cssText = `
                position: absolute;
                left: -9999px;
                z-index: 999;
                padding: 1em;
                background-color: var(--primary-600);
                color: white;
                text-decoration: none;
            `;
            
            skipLink.addEventListener('focus', () => {
                skipLink.style.left = '0';
            });
            
            skipLink.addEventListener('blur', () => {
                skipLink.style.left = '-9999px';
            });
            
            document.body.insertBefore(skipLink, document.body.firstChild);
        }

        enhanceFocusVisibility() {
            // Add visible focus styles for keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    document.body.classList.add('keyboard-nav');
                }
            });

            document.addEventListener('mousedown', () => {
                document.body.classList.remove('keyboard-nav');
            });
        }

        setupLiveRegions() {
            const liveRegion = document.createElement('div');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            liveRegion.style.cssText = `
                position: absolute;
                left: -10000px;
                width: 1px;
                height: 1px;
                overflow: hidden;
            `;
            document.body.appendChild(liveRegion);
        }
    }

    // ==========================================
    // INITIALIZE ALL COMPONENTS
    // ==========================================
    
    function initializeApp() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }

        function init() {
            try {
                // Initialize all components
                new TypingAnimation();
                new ParticleCanvas();
                new Navigation();
                new ScrollProgress();
                new StatsCounter();
                new BackToTop();
                new AnimationObserver();
                new ContactForm();
                new ProjectCards();
                new KeyboardNavigation();
                new PerformanceOptimizer();
                new EasterEgg();
                new Analytics();
                new AccessibilityEnhancements();

                console.log('✅ Portfolio initialized successfully');
            } catch (error) {
                console.error('❌ Error initializing portfolio:', error);
            }
        }
    }

    // Start the application
    initializeApp();

})();
