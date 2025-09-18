// Services Page Advanced Features

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

    // Animated counters for stats
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

    // Service section toggle functionality
    const serviceToggleButtons = document.querySelectorAll('.toggle-btn');
    const serviceSections = document.querySelectorAll('.service-section');

    serviceToggleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const targetId = this.getAttribute('data-target');
            const serviceSection = this.closest('.service-section');
            
            toggleServiceSection(serviceSection);
        });
    });

    // Also allow clicking on service header to toggle
    document.querySelectorAll('.service-header').forEach(header => {
        header.addEventListener('click', function() {
            const serviceSection = this.closest('.service-section');
            toggleServiceSection(serviceSection);
        });
    });

    function toggleServiceSection(section) {
        const isActive = section.classList.contains('active');
        
        // Close all other sections
        serviceSections.forEach(s => {
            if (s !== section) {
                s.classList.remove('active');
            }
        });
        
        // Toggle current section
        if (isActive) {
            section.classList.remove('active');
        } else {
            section.classList.add('active');
            
            // Smooth scroll to section
            setTimeout(() => {
                section.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);
        }
    }

    // Floating service icons interaction
    const floatingIcons = document.querySelectorAll('.floating-service-icon');
    
    floatingIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const serviceType = this.getAttribute('data-service');
            const targetSection = document.getElementById(serviceType);
            
            if (targetSection) {
                // Open the corresponding service section
                targetSection.classList.add('active');
                
                // Scroll to the section
                setTimeout(() => {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
                
                // Add a highlight effect
                targetSection.style.boxShadow = '0 0 30px rgba(37, 99, 235, 0.3)';
                setTimeout(() => {
                    targetSection.style.boxShadow = '';
                }, 2000);
            }
        });
        
        // Add hover effect with service name tooltip
        icon.addEventListener('mouseenter', function() {
            const serviceType = this.getAttribute('data-service');
            const serviceName = serviceType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            // Create tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'service-tooltip';
            tooltip.textContent = serviceName;
            tooltip.style.cssText = `
                position: absolute;
                top: -40px;
                left: 50%;
                transform: translateX(-50%);
                background: #1f2937;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 5px;
                font-size: 0.875rem;
                white-space: nowrap;
                z-index: 10;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            this.style.position = 'relative';
            this.appendChild(tooltip);
            
            setTimeout(() => {
                tooltip.style.opacity = '1';
            }, 100);
        });
        
        icon.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('.service-tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });

    // FAQ functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(faq => {
                if (faq !== item) {
                    faq.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                // If it's a service section, open it first
                if (target.classList.contains('service-section')) {
                    target.classList.add('active');
                }
                
                const offsetTop = target.offsetTop - 100; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Pricing card hover effects
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
    });

    // Process step animation on scroll
    const processSteps = document.querySelectorAll('.process-step');
    
    const processObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    processSteps.forEach(step => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(50px)';
        step.style.transition = 'all 0.6s ease';
        processObserver.observe(step);
    });

    // Service section scroll spy
    function updateActiveNavigation() {
        const sections = document.querySelectorAll('.service-section');
        const scrollPos = window.scrollY + 200;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            const navLink = document.querySelector(`a[href="#${id}"]`);
            
            if (scrollPos >= top && scrollPos <= bottom) {
                // Remove active class from all nav links
                document.querySelectorAll('footer a[href^="#"]').forEach(link => {
                    link.classList.remove('active-service');
                });
                
                // Add active class to current nav link
                if (navLink) {
                    navLink.classList.add('active-service');
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavigation);

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

    // Add typing effect to page title
    function initTypingEffect() {
        const title = document.querySelector('.page-header h1');
        if (title) {
            const text = title.textContent;
            title.textContent = '';
            title.style.borderRight = '2px solid white';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    title.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    setTimeout(() => {
                        title.style.borderRight = 'none';
                    }, 1000);
                }
            };
            
            setTimeout(typeWriter, 500);
        }
    }

    // Parallax effect for floating icons
    function initParallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const floatingIcons = document.querySelectorAll('.floating-service-icon');
            
            floatingIcons.forEach((icon, index) => {
                const speed = 0.3 + (index * 0.1);
                const yPos = -(scrolled * speed);
                icon.style.transform += ` translateY(${yPos}px)`;
            });
        });
    }

    // Service comparison feature
    function initServiceComparison() {
        const compareButtons = document.createElement('div');
        compareButtons.className = 'service-compare-section';
        compareButtons.innerHTML = `
            <div class="container">
                <h3>Compare Services</h3>
                <div class="compare-grid">
                    <div class="compare-item" data-service="web-development">
                        <input type="checkbox" id="compare-web">
                        <label for="compare-web">Web Development</label>
                    </div>
                    <div class="compare-item" data-service="graphic-design">
                        <input type="checkbox" id="compare-design">
                        <label for="compare-design">Graphic Design</label>
                    </div>
                    <div class="compare-item" data-service="it-consulting">
                        <input type="checkbox" id="compare-consulting">
                        <label for="compare-consulting">IT Consulting</label>
                    </div>
                    <div class="compare-item" data-service="database-solutions">
                        <input type="checkbox" id="compare-database">
                        <label for="compare-database">Database Solutions</label>
                    </div>
                </div>
                <button class="btn btn-primary compare-btn" style="display: none;">Compare Selected</button>
            </div>
        `;
        
        // Add comparison section after main services
        const mainServices = document.querySelector('.main-services');
        mainServices.after(compareButtons);
        
        // Handle comparison logic
        const checkboxes = compareButtons.querySelectorAll('input[type="checkbox"]');
        const compareBtn = compareButtons.querySelector('.compare-btn');
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
                
                if (checkedCount >= 2) {
                    compareBtn.style.display = 'inline-block';
                } else {
                    compareBtn.style.display = 'none';
                }
            });
        });
        
        compareBtn.addEventListener('click', function() {
            const selectedServices = Array.from(checkboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.closest('.compare-item').getAttribute('data-service'));
            
            showServiceComparison(selectedServices);
        });
    }

    function showServiceComparison(services) {
        // Create comparison modal
        const modal = document.createElement('div');
        modal.className = 'comparison-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close"><i class="fas fa-times"></i></button>
                <h2>Service Comparison</h2>
                <div class="comparison-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Feature</th>
                                ${services.map(service => `<th>${service.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Starting Price</td>
                                <td>$2,500</td>
                                <td>$500</td>
                                <td>$150/hr</td>
                                <td>$1,200</td>
                            </tr>
                            <tr>
                                <td>Timeline</td>
                                <td>4-12 weeks</td>
                                <td>2-4 weeks</td>
                                <td>Ongoing</td>
                                <td>2-8 weeks</td>
                            </tr>
                            <tr>
                                <td>Revisions</td>
                                <td>3 rounds</td>
                                <td>Unlimited</td>
                                <td>N/A</td>
                                <td>2 rounds</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.classList.add('active');
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        
        closeBtn.addEventListener('click', () => modal.remove());
        overlay.addEventListener('click', () => modal.remove());
    }

    // Initialize all features
    animateCounters();
    initScrollProgress();
    initTypingEffect();
    initParallaxEffect();
    // initServiceComparison(); // Uncomment if you want the comparison feature

    // Add page transition effect
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Auto-open first service section after page load
    setTimeout(() => {
        const firstServiceSection = document.querySelector('.service-section');
        if (firstServiceSection) {
            firstServiceSection.classList.add('active');
        }
    }, 2000);
});

// Add page leave transition
window.addEventListener('beforeunload', function() {
    document.body.style.opacity = '0';
});

// Add CSS for comparison modal
const style = document.createElement('style');
style.textContent = `
    .service-compare-section {
        padding: 4rem 0;
        background: white;
        text-align: center;
    }
    
    .compare-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin: 2rem 0;
    }
    
    .compare-item {
        padding: 1rem;
        border: 2px solid #e5e7eb;
        border-radius: 10px;
        transition: all 0.3s ease;
    }
    
    .compare-item:has(input:checked) {
        border-color: #2563eb;
        background: #f0f9ff;
    }
    
    .comparison-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: none;
        align-items: center;
        justify-content: center;
    }
    
    .comparison-modal.active {
        display: flex;
    }
    
    .comparison-modal .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 20px;
        max-width: 90vw;
        max-height: 90vh;
        overflow: auto;
    }
    
    .comparison-table table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
    }
    
    .comparison-table th,
    .comparison-table td {
        padding: 1rem;
        border: 1px solid #e5e7eb;
        text-align: left;
    }
    
    .comparison-table th {
        background: #f9fafb;
        font-weight: 600;
    }
    
    .active-service {
        color: #2563eb !important;
        font-weight: 600;
    }
`;
document.head.appendChild(style);
