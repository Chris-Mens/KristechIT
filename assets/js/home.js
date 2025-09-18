// Home Page Advanced Features

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // Loading screen
    const loadingScreen = document.getElementById('loading-screen');
    
    // Hide loading screen after page loads
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 1000);
    });

    // Dark mode toggle (shared functionality)
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.toggle('dark-mode', savedTheme === 'dark');
        updateThemeIcon();
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcon();
        });
    }

    function updateThemeIcon() {
        if (themeIcon) {
            const isDark = body.classList.contains('dark-mode');
            themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // Typing effect for hero title
    function initTypingEffect() {
        const typingText = document.querySelector('.typing-text');
        if (typingText) {
            const text = typingText.textContent;
            typingText.textContent = '';
            typingText.style.borderRight = '2px solid white';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    typingText.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    setTimeout(() => {
                        typingText.style.borderRight = 'none';
                    }, 1000);
                }
            };
            
            setTimeout(typeWriter, 1500);
        }
    }

    // Animated counters for hero stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            // Start animation when element is in view
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

    // Floating elements parallax effect
    function initFloatingElements() {
        const floatingElements = document.querySelectorAll('.floating-element');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            floatingElements.forEach((element, index) => {
                const speed = parseFloat(element.getAttribute('data-speed')) || 1;
                const yPos = -(scrolled * speed * 0.1);
                element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
            });
        });
    }

    // Skill bars animation
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-fill');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillFill = entry.target;
                    const width = skillFill.getAttribute('data-width');
                    
                    setTimeout(() => {
                        skillFill.style.width = width + '%';
                    }, 500);
                    
                    observer.unobserve(entry.target);
                }
            });
        });
        
        skillBars.forEach(bar => {
            observer.observe(bar);
        });
    }

    // Tech icons floating animation
    function initTechIcons() {
        const techIcons = document.querySelectorAll('.tech-icon');
        
        techIcons.forEach((icon, index) => {
            // Add staggered animation delay
            icon.style.animationDelay = `${index * 0.2}s`;
            
            // Add hover effects
            icon.addEventListener('mouseenter', function() {
                const tech = this.getAttribute('data-tech');
                showTechTooltip(tech, this);
            });
            
            icon.addEventListener('mouseleave', function() {
                hideTechTooltip();
            });
        });
    }

    function showTechTooltip(tech, element) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tech-tooltip';
        tooltip.textContent = tech.charAt(0).toUpperCase() + tech.slice(1);
        tooltip.style.cssText = `
            position: absolute;
            background: #1f2937;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            font-size: 0.875rem;
            white-space: nowrap;
            z-index: 1000;
            pointer-events: none;
            transform: translate(-50%, -120%);
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        element.style.position = 'relative';
        element.appendChild(tooltip);
        
        setTimeout(() => {
            tooltip.style.opacity = '1';
        }, 100);
    }

    function hideTechTooltip() {
        const tooltip = document.querySelector('.tech-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    // Testimonial slider
    function initTestimonialSlider() {
        const slides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.querySelector('.testimonial-prev');
        const nextBtn = document.querySelector('.testimonial-next');
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            slides[index].classList.add('active');
            dots[index].classList.add('active');
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
        }
        
        // Event listeners
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });
        
        // Auto-play
        setInterval(nextSlide, 5000);
    }

    // Service cards hover effects
    function initServiceCards() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
                this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.08)';
            });
        });
    }

    // Portfolio items hover effects
    function initPortfolioItems() {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        portfolioItems.forEach(item => {
            const overlay = item.querySelector('.portfolio-overlay');
            
            item.addEventListener('mouseenter', function() {
                overlay.style.opacity = '1';
                overlay.style.transform = 'translateY(0)';
            });
            
            item.addEventListener('mouseleave', function() {
                overlay.style.opacity = '0';
                overlay.style.transform = 'translateY(20px)';
            });
        });
    }

    // Smooth scroll for anchor links
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    const offsetTop = target.offsetTop - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Scroll indicator click
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', function() {
                const servicesSection = document.querySelector('.services-preview');
                if (servicesSection) {
                    servicesSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    }

    // Add scroll progress indicator
    function initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            z-index: 10001;
            transition: width 0.1s ease;
        `;
        
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }

    // Button loading animations
    function initButtonAnimations() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // Intersection Observer for animations
    function initIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements that should animate on scroll
        const animateElements = document.querySelectorAll('.service-card, .portfolio-item, .blog-card, .testimonial-content');
        animateElements.forEach(el => {
            observer.observe(el);
        });
    }

    // Initialize all features
    initTypingEffect();
    animateCounters();
    initFloatingElements();
    animateSkillBars();
    initTechIcons();
    initTestimonialSlider();
    initServiceCards();
    initPortfolioItems();
    initSmoothScroll();
    initScrollProgress();
    initButtonAnimations();
    initIntersectionObserver();

    // Add page transition effect
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add page leave transition
window.addEventListener('beforeunload', function() {
    document.body.style.opacity = '0';
});

// Add CSS for additional animations
const homeStyles = document.createElement('style');
homeStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .floating-element {
        position: absolute;
        width: 100px;
        height: 100px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        animation: float 6s ease-in-out infinite;
    }
    
    .floating-element:nth-child(1) {
        top: 20%;
        left: 10%;
        animation-delay: 0s;
    }
    
    .floating-element:nth-child(2) {
        top: 60%;
        right: 15%;
        animation-delay: -2s;
    }
    
    .floating-element:nth-child(3) {
        bottom: 30%;
        left: 20%;
        animation-delay: -4s;
    }
    
    .floating-element:nth-child(4) {
        top: 40%;
        right: 30%;
        animation-delay: -1s;
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
    }
    
    .tech-icon {
        width: 60px;
        height: 60px;
        background: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        color: #2563eb;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: all 0.3s ease;
        animation: techFloat 4s ease-in-out infinite;
        position: absolute;
    }
    
    .tech-icon:nth-child(1) { top: 10%; left: 20%; }
    .tech-icon:nth-child(2) { top: 20%; right: 10%; }
    .tech-icon:nth-child(3) { top: 40%; left: 10%; }
    .tech-icon:nth-child(4) { top: 60%; right: 20%; }
    .tech-icon:nth-child(5) { bottom: 30%; left: 30%; }
    .tech-icon:nth-child(6) { bottom: 20%; right: 30%; }
    .tech-icon:nth-child(7) { top: 70%; left: 50%; }
    .tech-icon:nth-child(8) { bottom: 10%; right: 50%; }
    
    .tech-icon:hover {
        transform: scale(1.2);
        box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
    }
    
    @keyframes techFloat {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
    
    .skill-fill {
        height: 100%;
        background: linear-gradient(90deg, #667eea, #764ba2);
        border-radius: 5px;
        width: 0%;
        transition: width 1.5s ease-in-out;
    }
    
    .animate-in {
        animation: slideInUp 0.6s ease forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .portfolio-overlay {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
    }
    
    .scroll-indicator {
        cursor: pointer;
        animation: bounce 2s infinite;
    }
    
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
    }
    
    body.dark-mode .floating-element {
        background: rgba(255, 255, 255, 0.05);
    }
    
    body.dark-mode .tech-icon {
        background: #3d3d3d;
        color: #667eea;
    }
`;
document.head.appendChild(homeStyles);
