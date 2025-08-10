// Sugrue Excavation Ltd - Main JavaScript
// Modern Interactive Features & Animations

class SugrueWebsite {
    constructor() {
        this.isLoaded = false;
        this.scrollPosition = 0;
        this.isScrolling = false;
        this.activeSection = 'home';
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initializeComponents();
        this.handleLoading();
    }
    
    setupEventListeners() {
        // DOM Content Loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.onDOMLoaded();
        });
        
        // Window Load
        window.addEventListener('load', () => {
            this.onWindowLoad();
        });
        
        // Scroll Events
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 16));
        
        // Resize Events
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
        
        // Navigation Events
        this.setupNavigation();
        
        // Form Events
        this.setupForms();
        
        // Interactive Elements
        this.setupInteractiveElements();
    }
    
    onDOMLoaded() {
        console.log('DOM Content Loaded');
        this.initializeAnimations();
        this.setupIntersectionObserver();
    }
    
    onWindowLoad() {
        console.log('Window Loaded');
        this.hideLoadingScreen();
        this.isLoaded = true;
        this.startCounterAnimations();
    }
    
    // Loading Screen
    handleLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (!loadingScreen) return;
        
        // Simulate loading progress
        const progressBar = loadingScreen.querySelector('.loading-progress');
        if (progressBar) {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                }
                progressBar.style.width = `${progress}%`;
            }, 100);
        }
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500);
            }, 1000);
        }
    }
    
    // Navigation
    setupNavigation() {
        const navbar = document.getElementById('navbar');
        const navLinks = document.querySelectorAll('.nav-link');
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        // Smooth scroll for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
                this.setActiveNavLink(link);
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    this.toggleMobileMenu();
                }
            });
        });
        
        // Mobile menu toggle
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
        
        // CTA Buttons
        const exploreBtn = document.getElementById('explore-btn');
        const contactBtn = document.getElementById('contact-btn');
        const quoteBtn = document.getElementById('quote-btn');
        
        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => {
                this.scrollToSection('capabilities');
            });
        }
        
        if (contactBtn) {
            contactBtn.addEventListener('click', () => {
                this.scrollToSection('contact');
            });
        }
        
        if (quoteBtn) {
            quoteBtn.addEventListener('click', () => {
                this.scrollToSection('contact');
            });
        }
    }
    
    toggleMobileMenu() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (mobileToggle && navMenu) {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        }
    }
    
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offsetTop = section.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
    
    setActiveNavLink(activeLink) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }
    
    // Scroll Handling
    handleScroll() {
        this.scrollPosition = window.pageYOffset;
        this.updateScrollProgress();
        this.updateNavbarState();
        this.updateActiveSection();
        this.handleParallaxEffects();
        
        if (!this.isScrolling) {
            this.isScrolling = true;
            requestAnimationFrame(() => {
                this.isScrolling = false;
            });
        }
    }
    
    updateScrollProgress() {
        const scrollProgress = document.getElementById('scroll-progress');
        if (scrollProgress) {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = (this.scrollPosition / documentHeight) * 100;
            scrollProgress.style.width = `${Math.min(scrolled, 100)}%`;
        }
    }
    
    updateNavbarState() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (this.scrollPosition > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }
    
    updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            
            if (this.scrollPosition >= sectionTop && 
                this.scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        if (currentSection && currentSection !== this.activeSection) {
            this.activeSection = currentSection;
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === currentSection) {
                    link.classList.add('active');
                }
            });
        }
    }
    
    handleParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
            const yPos = -(this.scrollPosition * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    // Intersection Observer for Animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Trigger specific animations
                    if (entry.target.classList.contains('timeline-item')) {
                        this.animateTimelineItem(entry.target);
                    }
                    
                    if (entry.target.classList.contains('capability-card')) {
                        this.animateCapabilityCard(entry.target);
                    }
                    
                    if (entry.target.classList.contains('value-card')) {
                        this.animateValueCard(entry.target);
                    }
                }
            });
        }, observerOptions);
        
        // Observe elements
        const animatedElements = document.querySelectorAll(
            '.timeline-item, .capability-card, .value-card, .equipment-item, .client-card'
        );
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    animateTimelineItem(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    }
    
    animateCapabilityCard(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px) rotateX(10deg)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0) rotateX(0)';
        }, 150);
    }
    
    animateValueCard(element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.9) translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            element.style.opacity = '1';
            element.style.transform = 'scale(1) translateY(0)';
        }, 200);
    }
    
    // Counter Animations
    startCounterAnimations() {
        const counters = document.querySelectorAll('[data-count]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target;
                } else {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                }
            };
            
            // Start animation when element is visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(counter);
        });
    }
    
    // Interactive Elements
    setupInteractiveElements() {
        this.setupProjectMap();
        this.setupEquipmentGallery();
        this.setupRippleEffects();
        this.setupHoverEffects();
    }
    
    setupProjectMap() {
        const projectMarkers = document.querySelectorAll('.project-marker');
        const projectInfo = document.getElementById('project-info');
        
        const projectData = {
            'cordal': {
                title: 'Cordal Wind Farm',
                location: 'Co Kerry',
                description: 'Major wind farm project featuring advanced site access roads and comprehensive cable trenching solutions.'
            },
            'grousemount': {
                title: 'Grousemount Wind Farm',
                location: 'Co Kerry',
                description: 'Complex mountain terrain project requiring specialized equipment and innovative engineering solutions.'
            },
            'silahertane': {
                title: 'Silahertane Wind Farm',
                location: 'Co Kerry',
                description: 'Challenging bog conditions overcome with floating road construction and specialized machinery.'
            },
            'kilgarvan': {
                title: 'Kilgarvan Wind Farm',
                location: 'Co Kerry',
                description: 'Comprehensive civil engineering project including hardstands capable of supporting 1000T cranes.'
            },
            'booltiagh': {
                title: 'Booltiagh Wind Farm',
                location: 'Co Clare',
                description: 'Multi-phase project featuring extensive roadway maintenance and environmental protection measures.'
            },
            'garracummer': {
                title: 'Garracummer Wind Farm',
                location: 'Co Tipperary',
                description: 'Large-scale grid connection project with complex cable trenching across varied terrain.'
            },
            'knockawarriga': {
                title: 'Knockawarriga Wind Farm',
                location: 'Co Limerick',
                description: 'Innovative project combining traditional excavation with modern environmental protection techniques.'
            }
        };
        
        projectMarkers.forEach(marker => {
            marker.addEventListener('mouseenter', () => {
                const projectId = marker.getAttribute('data-project');
                const project = projectData[projectId];
                
                if (project && projectInfo) {
                    const infoContent = projectInfo.querySelector('.info-content');
                    if (infoContent) {
                        infoContent.innerHTML = `
                            <h3 class="info-title">${project.title}</h3>
                            <p class="info-location">${project.location}</p>
                            <p class="info-description">${project.description}</p>
                        `;
                    }
                }
            });
            
            marker.addEventListener('click', () => {
                // Could expand to show more detailed project information
                marker.style.transform = 'scale(2)';
                setTimeout(() => {
                    marker.style.transform = 'scale(1.5)';
                }, 200);
            });
        });
    }
    
    setupEquipmentGallery() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.getElementById('main-equipment-image');
        const overlayTitle = document.querySelector('.overlay-title');
        const overlayDescription = document.querySelector('.overlay-description');
        
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', () => {
                // Remove active class from all thumbnails
                thumbnails.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked thumbnail
                thumbnail.classList.add('active');
                
                // Update main image and overlay
                const imageSrc = thumbnail.getAttribute('data-image');
                const title = thumbnail.getAttribute('data-title');
                const description = thumbnail.getAttribute('data-description');
                
                if (mainImage) {
                    mainImage.style.opacity = '0';
                    setTimeout(() => {
                        mainImage.src = imageSrc;
                        mainImage.style.opacity = '1';
                    }, 300);
                }
                
                if (overlayTitle) overlayTitle.textContent = title;
                if (overlayDescription) overlayDescription.textContent = description;
            });
        });
    }
    
    setupRippleEffects() {
        const buttons = document.querySelectorAll('.cta-button');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = button.querySelector('.button-ripple');
                if (ripple) {
                    const rect = button.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    const x = e.clientX - rect.left - size / 2;
                    const y = e.clientY - rect.top - size / 2;
                    
                    ripple.style.width = ripple.style.height = size + 'px';
                    ripple.style.left = x + 'px';
                    ripple.style.top = y + 'px';
                    
                    ripple.classList.add('animate');
                    
                    setTimeout(() => {
                        ripple.classList.remove('animate');
                    }, 600);
                }
            });
        });
    }
    
    setupHoverEffects() {
        // Magnetic effect for buttons
        const magneticElements = document.querySelectorAll('.cta-button, .nav-link');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0)';
            });
        });
        
        // 3D tilt effect for cards
        const tiltCards = document.querySelectorAll('.capability-card, .value-card');
        
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });
    }
    
    // Forms
    setupForms() {
        const contactForm = document.getElementById('contact-form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(contactForm);
            });
            
            // Form field animations
            const formInputs = contactForm.querySelectorAll('.form-input, .form-select, .form-textarea');
            
            formInputs.forEach(input => {
                input.addEventListener('focus', () => {
                    input.parentElement.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        input.parentElement.classList.remove('focused');
                    }
                });
                
                // Check if input has value on load
                if (input.value) {
                    input.parentElement.classList.add('focused');
                }
            });
        }
    }
    
    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.querySelector('span').textContent;
        
        submitButton.disabled = true;
        submitButton.querySelector('span').textContent = 'Sending...';
        
        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            form.reset();
            
            // Reset button
            submitButton.disabled = false;
            submitButton.querySelector('span').textContent = originalText;
            
            // Remove focused classes
            form.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('focused');
            });
        }, 2000);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });
    }
    
    removeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    // Resize Handling
    handleResize() {
        // Recalculate positions and sizes
        this.updateScrollProgress();
        
        // Reset any transforms that might be affected by resize
        const transformedElements = document.querySelectorAll('[style*="transform"]');
        transformedElements.forEach(element => {
            if (!element.classList.contains('permanent-transform')) {
                element.style.transform = '';
            }
        });
    }
    
    // Initialize Animations
    initializeComponents() {
        // Particle system for hero section
        this.initParticleSystem();
        
        // Typing animation for hero title
        this.initTypingAnimation();
        
        // Floating elements animation
        this.initFloatingElements();
    }
    
    initParticleSystem() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;
        
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(0, 212, 170, 0.6);
                border-radius: 50%;
                pointer-events: none;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float-particle ${5 + Math.random() * 10}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            
            particlesContainer.appendChild(particle);
        }
        
        // Add CSS animation for particles
        if (!document.getElementById('particle-styles')) {
            const style = document.createElement('style');
            style.id = 'particle-styles';
            style.textContent = `
                @keyframes float-particle {
                    0% {
                        transform: translateY(100vh) translateX(0px);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-100px) translateX(${Math.random() * 200 - 100}px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    initTypingAnimation() {
        // This could be enhanced with a typing effect for the hero title
        const titleLines = document.querySelectorAll('.title-line');
        titleLines.forEach((line, index) => {
            line.style.animationDelay = `${0.2 + index * 0.2}s`;
        });
    }
    
    initFloatingElements() {
        const floatingElements = document.querySelectorAll('.geo-element');
        floatingElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 2}s`;
        });
    }
    
    // Utility Functions
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
}

// Initialize the website
const sugrueWebsite = new SugrueWebsite();

