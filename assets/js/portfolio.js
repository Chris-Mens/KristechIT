// Portfolio Page Advanced Features

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

    // Portfolio filtering system
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const filteredCountElement = document.getElementById('filtered-count');
    let currentFilter = 'all';

    // Project data for detailed views
    const projectData = {
        'ecommerce-platform': {
            title: 'E-Commerce Platform',
            description: 'A comprehensive online store solution with advanced features including inventory management, payment processing, and customer analytics.',
            longDescription: 'This full-stack e-commerce platform was built to handle high-volume transactions with a focus on user experience and administrative efficiency. The system includes real-time inventory tracking, multiple payment gateway integrations, and comprehensive analytics dashboard.',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux', 'Express.js'],
            features: [
                'Responsive design optimized for all devices',
                'Real-time inventory management',
                'Multiple payment gateway integration',
                'Advanced search and filtering',
                'Customer review and rating system',
                'Admin dashboard with analytics',
                'Email notification system',
                'SEO optimization'
            ],
            challenges: [
                'Implementing real-time inventory updates across multiple concurrent users',
                'Optimizing database queries for large product catalogs',
                'Ensuring PCI compliance for payment processing',
                'Creating an intuitive admin interface for non-technical users'
            ],
            results: [
                '40% increase in conversion rates',
                '60% reduction in page load times',
                '99.9% uptime achieved',
                'Successfully processed over $500K in transactions'
            ],
            liveUrl: 'https://demo-ecommerce.com',
            client: 'TechMart Inc.',
            date: 'December 2024',
            duration: '3 months'
        },
        'analytics-dashboard': {
            title: 'Business Analytics Dashboard',
            description: 'Interactive data visualization platform providing real-time business insights and comprehensive reporting capabilities.',
            longDescription: 'A sophisticated analytics platform that transforms raw business data into actionable insights through interactive visualizations and automated reporting systems.',
            technologies: ['Vue.js', 'D3.js', 'Python', 'PostgreSQL', 'Flask', 'Chart.js'],
            features: [
                'Real-time data visualization',
                'Customizable dashboard layouts',
                'Automated report generation',
                'Data export capabilities',
                'Role-based access control',
                'Mobile-responsive design',
                'API integration capabilities',
                'Advanced filtering and drill-down'
            ],
            challenges: [
                'Processing large datasets efficiently',
                'Creating intuitive data visualizations',
                'Implementing real-time data updates',
                'Ensuring data security and privacy'
            ],
            results: [
                '50% faster decision-making process',
                '30% improvement in data accuracy',
                'Reduced reporting time by 80%',
                'Increased user engagement by 65%'
            ],
            liveUrl: 'https://demo-analytics.com',
            client: 'DataCorp',
            date: 'November 2024',
            duration: '4 months'
        },
        'learning-platform': {
            title: 'Online Learning Platform',
            description: 'Comprehensive Learning Management System with video streaming, progress tracking, and interactive assessments.',
            longDescription: 'A full-featured LMS designed to deliver engaging online education experiences with advanced tracking and assessment capabilities.',
            technologies: ['Angular', 'Express.js', 'MySQL', 'AWS', 'Socket.io', 'FFmpeg'],
            features: [
                'HD video streaming with adaptive bitrate',
                'Interactive quizzes and assessments',
                'Progress tracking and analytics',
                'Discussion forums and chat',
                'Certificate generation',
                'Multi-language support',
                'Offline content download',
                'Integration with third-party tools'
            ],
            challenges: [
                'Implementing scalable video streaming',
                'Creating engaging interactive content',
                'Ensuring cross-platform compatibility',
                'Building comprehensive progress tracking'
            ],
            results: [
                '95% student satisfaction rate',
                '40% improvement in course completion',
                'Supported 10,000+ concurrent users',
                '99.5% video streaming uptime'
            ],
            liveUrl: 'https://demo-learning.com',
            client: 'EduTech Solutions',
            date: 'October 2024',
            duration: '5 months'
        },
        'brand-identity': {
            title: 'Complete Brand Identity',
            description: 'Comprehensive brand identity package including logo design, business materials, and brand guidelines.',
            longDescription: 'A complete visual identity system designed to establish a strong, memorable brand presence across all touchpoints.',
            technologies: ['Adobe Illustrator', 'Adobe Photoshop', 'Adobe InDesign', 'Figma'],
            features: [
                'Custom logo design with variations',
                'Complete color palette and typography',
                'Business card and letterhead design',
                'Marketing material templates',
                'Brand guidelines document',
                'Social media templates',
                'Website mockups',
                'Packaging design concepts'
            ],
            challenges: [
                'Creating a unique identity in a competitive market',
                'Ensuring brand consistency across all materials',
                'Balancing creativity with business objectives',
                'Designing for various applications and sizes'
            ],
            results: [
                '300% increase in brand recognition',
                '45% improvement in customer trust',
                'Successful brand launch across 5 markets',
                'Award-winning logo design'
            ],
            client: 'Green Energy Co.',
            date: 'September 2024',
            duration: '2 months'
        },
        'ui-design': {
            title: 'Mobile App UI Design',
            description: 'Modern and intuitive user interface design for a comprehensive fitness tracking application.',
            longDescription: 'A complete UI/UX design system for a fitness app focusing on user engagement and ease of use.',
            technologies: ['Figma', 'Adobe XD', 'Principle', 'InVision'],
            features: [
                'Intuitive navigation system',
                'Custom iconography',
                'Interactive prototypes',
                'Responsive design system',
                'Accessibility compliance',
                'Dark mode support',
                'Micro-interactions',
                'User testing integration'
            ],
            challenges: [
                'Creating an intuitive fitness tracking interface',
                'Designing for various screen sizes',
                'Balancing feature richness with simplicity',
                'Ensuring accessibility for all users'
            ],
            results: [
                '4.8/5 app store rating',
                '60% increase in user engagement',
                '25% reduction in user onboarding time',
                'Featured in App Store'
            ],
            client: 'FitLife App',
            date: 'August 2024',
            duration: '6 weeks'
        },
        'inventory-system': {
            title: 'Inventory Management System',
            description: 'Comprehensive database solution for warehouse operations with real-time tracking and reporting.',
            longDescription: 'A robust inventory management system designed to streamline warehouse operations and provide real-time visibility into stock levels.',
            technologies: ['MySQL', 'PHP', 'Laravel', 'Vue.js', 'REST API'],
            features: [
                'Real-time inventory tracking',
                'Barcode scanning integration',
                'Automated reorder points',
                'Comprehensive reporting',
                'Multi-location support',
                'Supplier management',
                'Cost tracking and analysis',
                'Mobile app integration'
            ],
            challenges: [
                'Handling large volumes of inventory data',
                'Ensuring data accuracy across multiple locations',
                'Creating intuitive interfaces for warehouse staff',
                'Implementing robust backup and recovery systems'
            ],
            results: [
                '35% reduction in inventory errors',
                '50% faster stock counting process',
                '20% reduction in carrying costs',
                '99.9% system uptime achieved'
            ],
            client: 'LogiTech Warehouse',
            date: 'July 2024',
            duration: '4 months'
        },
        'task-app': {
            title: 'Task Management App',
            description: 'Cross-platform mobile application for team collaboration and project management.',
            longDescription: 'A comprehensive task management solution designed to improve team productivity and project coordination.',
            technologies: ['React Native', 'Firebase', 'Redux', 'Node.js', 'Socket.io'],
            features: [
                'Cross-platform compatibility',
                'Real-time collaboration',
                'Task assignment and tracking',
                'File sharing and comments',
                'Time tracking integration',
                'Push notifications',
                'Offline synchronization',
                'Advanced reporting'
            ],
            challenges: [
                'Ensuring smooth cross-platform performance',
                'Implementing real-time collaboration features',
                'Creating intuitive task management workflows',
                'Optimizing for offline usage'
            ],
            results: [
                '40% improvement in team productivity',
                '25% reduction in project completion time',
                '4.7/5 user rating',
                'Adopted by 500+ teams'
            ],
            client: 'ProductivePro',
            date: 'June 2024',
            duration: '3 months'
        }
    };

    // Initialize filtering
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items
            filterPortfolioItems(filter);
            currentFilter = filter;
        });
    });

    function filterPortfolioItems(filter) {
        let visibleCount = 0;
        
        portfolioItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                item.classList.remove('filtered-out');
                visibleCount++;
                
                // Add staggered animation
                setTimeout(() => {
                    item.style.transform = 'translateY(0)';
                    item.style.opacity = '1';
                }, visibleCount * 50);
            } else {
                item.classList.add('filtered-out');
            }
        });
        
        // Update filtered count
        if (filteredCountElement) {
            animateNumber(filteredCountElement, parseInt(filteredCountElement.textContent), visibleCount);
        }
    }

    function animateNumber(element, start, end) {
        const duration = 500;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.round(start + (end - start) * progress);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }

    // Lightbox functionality
    const lightboxModal = document.getElementById('lightbox-modal');
    const projectModal = document.getElementById('project-modal');
    const lightboxClose = document.querySelector('.lightbox-close');
    const modalClose = document.querySelector('.modal-close');
    const lightboxOverlay = document.querySelector('.lightbox-overlay');
    const modalOverlay = document.querySelector('.modal-overlay');

    // Portfolio item actions
    document.addEventListener('click', function(e) {
        if (e.target.closest('.action-btn')) {
            const actionBtn = e.target.closest('.action-btn');
            const action = actionBtn.getAttribute('data-action');
            const projectId = actionBtn.getAttribute('data-project');
            const url = actionBtn.getAttribute('data-url');
            
            switch(action) {
                case 'view':
                    openLightbox(projectId);
                    break;
                case 'info':
                    openProjectModal(projectId);
                    break;
                case 'link':
                    if (url) {
                        window.open(url, '_blank');
                    }
                    break;
            }
        }
    });

    function openLightbox(projectId) {
        const project = projectData[projectId];
        if (!project) return;
        
        // Update lightbox content
        document.getElementById('lightbox-title').textContent = project.title;
        document.getElementById('lightbox-description').textContent = project.description;
        
        // Update tags
        const tagsContainer = document.getElementById('lightbox-tags');
        tagsContainer.innerHTML = '';
        project.technologies.forEach(tech => {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.textContent = tech;
            tagsContainer.appendChild(tag);
        });
        
        // Update live link
        const liveLink = document.getElementById('lightbox-live-link');
        if (project.liveUrl) {
            liveLink.href = project.liveUrl;
            liveLink.style.display = 'flex';
        } else {
            liveLink.style.display = 'none';
        }
        
        // Show lightbox
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function openProjectModal(projectId) {
        const project = projectData[projectId];
        if (!project) return;
        
        // Create detailed project content
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <div class="project-details">
                <div class="project-header">
                    <h2>${project.title}</h2>
                    <p>${project.longDescription}</p>
                    <div class="project-meta" style="display: flex; justify-content: center; gap: 2rem; margin-top: 1rem; font-size: 0.9rem; color: #6b7280;">
                        <span><i class="fas fa-calendar"></i> ${project.date}</span>
                        <span><i class="fas fa-clock"></i> ${project.duration}</span>
                        <span><i class="fas fa-user"></i> ${project.client}</span>
                    </div>
                </div>
                
                <div class="project-section">
                    <h3><i class="fas fa-cogs"></i> Technologies Used</h3>
                    <div class="tech-grid">
                        ${project.technologies.map(tech => `
                            <div class="tech-item">
                                <i class="fas fa-code"></i>
                                <h4>${tech}</h4>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="project-section">
                    <h3><i class="fas fa-star"></i> Key Features</h3>
                    <ul>
                        ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="project-section">
                    <h3><i class="fas fa-exclamation-triangle"></i> Challenges Overcome</h3>
                    <ul>
                        ${project.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="project-section">
                    <h3><i class="fas fa-trophy"></i> Results Achieved</h3>
                    <ul>
                        ${project.results.map(result => `<li>${result}</li>`).join('')}
                    </ul>
                </div>
                
                ${project.liveUrl ? `
                    <div class="project-section" style="text-align: center; padding-top: 2rem; border-top: 1px solid #e5e7eb;">
                        <a href="${project.liveUrl}" target="_blank" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-external-link-alt"></i>
                            View Live Project
                        </a>
                    </div>
                ` : ''}
            </div>
        `;
        
        // Show modal
        projectModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close modals
    function closeModals() {
        lightboxModal.classList.remove('active');
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeModals);
    if (modalClose) modalClose.addEventListener('click', closeModals);
    if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeModals);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModals);

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModals();
        }
    });

    // Load more functionality
    const loadMoreBtn = document.getElementById('load-more-btn');
    let itemsToShow = 8;
    let currentlyShowing = Math.min(itemsToShow, portfolioItems.length);

    // Initially hide items beyond the limit
    function updateVisibleItems() {
        portfolioItems.forEach((item, index) => {
            if (index >= currentlyShowing && !item.classList.contains('filtered-out')) {
                item.style.display = 'none';
            } else {
                item.style.display = 'block';
            }
        });
        
        // Hide load more button if all items are visible
        const totalFilteredItems = Array.from(portfolioItems).filter(item => 
            !item.classList.contains('filtered-out')
        ).length;
        
        if (currentlyShowing >= totalFilteredItems) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-flex';
        }
    }

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            const remainingItems = portfolioItems.length - currentlyShowing;
            const itemsToAdd = Math.min(4, remainingItems);
            
            // Show next batch of items with animation
            for (let i = currentlyShowing; i < currentlyShowing + itemsToAdd; i++) {
                if (portfolioItems[i] && !portfolioItems[i].classList.contains('filtered-out')) {
                    portfolioItems[i].style.display = 'block';
                    portfolioItems[i].style.opacity = '0';
                    portfolioItems[i].style.transform = 'translateY(30px)';
                    
                    setTimeout(() => {
                        portfolioItems[i].style.opacity = '1';
                        portfolioItems[i].style.transform = 'translateY(0)';
                    }, (i - currentlyShowing) * 100);
                }
            }
            
            currentlyShowing += itemsToAdd;
            updateVisibleItems();
        });
    }

    // Initialize visible items
    updateVisibleItems();

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

    // Initialize scroll progress
    initScrollProgress();

    // Add page transition effect
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

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

    // Initialize typing effect
    initTypingEffect();
});

// Add page leave transition
window.addEventListener('beforeunload', function() {
    document.body.style.opacity = '0';
});
