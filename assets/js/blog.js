// Blog Page Advanced Features

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

    // Blog data for detailed articles
    const blogData = {
        'future-web-development': {
            title: 'The Future of Web Development: Trends to Watch in 2025',
            category: 'Web Development',
            date: 'December 15, 2024',
            readTime: '8 min read',
            author: 'Kristech IT',
            views: '2.5K',
            likes: '89',
            comments: '23',
            content: `
                <p>The web development landscape is constantly evolving, and 2025 promises to bring exciting new technologies and methodologies that will reshape how we build and interact with web applications.</p>
                
                <h2>AI-Powered Development Tools</h2>
                <p>Artificial Intelligence is revolutionizing the development process. From code generation to automated testing, AI tools are becoming indispensable for modern developers.</p>
                
                <ul>
                    <li>GitHub Copilot and similar AI assistants</li>
                    <li>Automated code review and optimization</li>
                    <li>AI-driven testing and debugging</li>
                    <li>Natural language to code conversion</li>
                </ul>
                
                <h2>WebAssembly (WASM) Adoption</h2>
                <p>WebAssembly is gaining traction as a way to run high-performance applications in the browser. Expect to see more languages compiling to WASM and better tooling support.</p>
                
                <blockquote>
                    "WebAssembly represents the future of web performance, enabling near-native speed for web applications."
                </blockquote>
                
                <h2>Edge Computing and CDNs</h2>
                <p>Edge computing is moving processing closer to users, reducing latency and improving performance. This trend will continue to grow in 2025.</p>
                
                <h3>Key Benefits:</h3>
                <ul>
                    <li>Reduced latency for global applications</li>
                    <li>Better performance for real-time features</li>
                    <li>Improved user experience worldwide</li>
                </ul>
                
                <h2>Progressive Web Apps (PWAs) Evolution</h2>
                <p>PWAs are becoming more sophisticated, offering native app-like experiences while maintaining the accessibility of web applications.</p>
                
                <pre><code>// Example PWA service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
}</code></pre>
                
                <h2>Conclusion</h2>
                <p>The future of web development is bright, with new technologies making development more efficient and applications more powerful. Stay ahead by embracing these trends and continuously learning.</p>
            `
        },
        'react-best-practices': {
            title: 'React Best Practices for 2024',
            category: 'Web Development',
            date: 'December 10, 2024',
            readTime: '6 min read',
            author: 'Kristech IT',
            views: '1.8K',
            likes: '64',
            comments: '18',
            content: `
                <p>React continues to evolve, and with it, the best practices for building efficient and maintainable applications. Here are the key practices every React developer should follow in 2024.</p>
                
                <h2>1. Use Functional Components and Hooks</h2>
                <p>Functional components with hooks are now the standard. They're more concise and easier to test than class components.</p>
                
                <pre><code>// Good: Functional component with hooks
function UserProfile({ userId }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetchUser(userId).then(userData => {
            setUser(userData);
            setLoading(false);
        });
    }, [userId]);
    
    if (loading) return <div>Loading...</div>;
    return <div>{user.name}</div>;
}</code></pre>
                
                <h2>2. Optimize Performance with useMemo and useCallback</h2>
                <p>Prevent unnecessary re-renders by memoizing expensive calculations and callback functions.</p>
                
                <pre><code>// Memoize expensive calculations
const expensiveValue = useMemo(() => {
    return computeExpensiveValue(data);
}, [data]);

// Memoize callback functions
const handleClick = useCallback(() => {
    onItemClick(item.id);
}, [item.id, onItemClick]);</code></pre>
                
                <h2>3. Implement Proper Error Boundaries</h2>
                <p>Use error boundaries to gracefully handle errors and prevent your entire app from crashing.</p>
                
                <h2>4. Follow the Single Responsibility Principle</h2>
                <p>Keep your components focused on a single responsibility. This makes them easier to test, debug, and reuse.</p>
                
                <h2>5. Use TypeScript for Better Development Experience</h2>
                <p>TypeScript provides excellent tooling support and helps catch errors at compile time.</p>
                
                <blockquote>
                    "TypeScript is not just about catching bugs; it's about making your code more maintainable and your development experience more pleasant."
                </blockquote>
            `
        }
    };

    // Blog filtering and search functionality
    const searchInput = document.getElementById('blog-search');
    const searchClear = document.getElementById('search-clear');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const sortSelect = document.getElementById('sort-select');
    const blogCards = document.querySelectorAll('.blog-card');
    const featuredArticle = document.querySelector('.featured-article');
    const filteredPostsElement = document.getElementById('filtered-posts');
    const loadMoreBtn = document.getElementById('load-more-posts');

    let currentCategory = 'all';
    let currentSort = 'newest';
    let currentSearch = '';

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentSearch = this.value.toLowerCase();
            updateSearchClear();
            filterAndSortPosts();
        });
    }

    if (searchClear) {
        searchClear.addEventListener('click', function() {
            searchInput.value = '';
            currentSearch = '';
            updateSearchClear();
            filterAndSortPosts();
        });
    }

    function updateSearchClear() {
        if (searchClear) {
            if (currentSearch.length > 0) {
                searchClear.classList.add('visible');
            } else {
                searchClear.classList.remove('visible');
            }
        }
    }

    // Category filtering
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            currentCategory = this.getAttribute('data-category');
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            filterAndSortPosts();
        });
    });

    // Sorting
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            filterAndSortPosts();
        });
    }

    function filterAndSortPosts() {
        let visiblePosts = [];
        const allPosts = [...blogCards];
        
        // Add featured article to filtering if it matches
        if (featuredArticle) {
            allPosts.unshift(featuredArticle);
        }

        allPosts.forEach(post => {
            const category = post.getAttribute('data-category');
            const title = post.querySelector('h2, h3').textContent.toLowerCase();
            const description = post.querySelector('p').textContent.toLowerCase();
            
            // Check category filter
            const categoryMatch = currentCategory === 'all' || category === currentCategory;
            
            // Check search filter
            const searchMatch = currentSearch === '' || 
                               title.includes(currentSearch) || 
                               description.includes(currentSearch);
            
            if (categoryMatch && searchMatch) {
                post.classList.remove('filtered-out');
                visiblePosts.push(post);
            } else {
                post.classList.add('filtered-out');
            }
        });

        // Sort visible posts
        sortPosts(visiblePosts);
        
        // Update count
        updatePostCount(visiblePosts.length);
    }

    function sortPosts(posts) {
        const container = document.getElementById('blog-grid');
        const featuredContainer = document.querySelector('.featured-post');
        
        posts.sort((a, b) => {
            const dateA = new Date(a.getAttribute('data-date'));
            const dateB = new Date(b.getAttribute('data-date'));
            const popularityA = parseInt(a.getAttribute('data-popularity')) || 0;
            const popularityB = parseInt(b.getAttribute('data-popularity')) || 0;
            const titleA = a.querySelector('h2, h3').textContent;
            const titleB = b.querySelector('h2, h3').textContent;
            
            switch(currentSort) {
                case 'newest':
                    return dateB - dateA;
                case 'oldest':
                    return dateA - dateB;
                case 'popular':
                    return popularityB - popularityA;
                case 'alphabetical':
                    return titleA.localeCompare(titleB);
                default:
                    return 0;
            }
        });

        // Reorder posts in DOM
        posts.forEach((post, index) => {
            if (post === featuredArticle) {
                // Handle featured article separately
                if (post.classList.contains('filtered-out')) {
                    featuredContainer.style.display = 'none';
                } else {
                    featuredContainer.style.display = 'block';
                }
            } else {
                // Regular blog posts
                post.style.order = index;
            }
        });
    }

    function updatePostCount(count) {
        if (filteredPostsElement) {
            animateNumber(filteredPostsElement, parseInt(filteredPostsElement.textContent), count);
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

    // Blog modal functionality
    const blogModal = document.getElementById('blog-modal');
    const modalClose = document.querySelector('.blog-modal .modal-close');
    const modalOverlay = document.querySelector('.blog-modal .modal-overlay');
    const modalBody = document.getElementById('blog-modal-body');

    // Handle blog post clicks
    document.addEventListener('click', function(e) {
        if (e.target.closest('.read-more-btn, .read-more, .quick-read-btn')) {
            e.preventDefault();
            const button = e.target.closest('.read-more-btn, .read-more, .quick-read-btn');
            const postId = button.getAttribute('data-post');
            openBlogModal(postId);
        }
    });

    function openBlogModal(postId) {
        const post = blogData[postId];
        if (!post) {
            console.warn('Blog post not found:', postId);
            return;
        }
        
        modalBody.innerHTML = `
            <article class="blog-article">
                <header class="blog-article-header">
                    <div class="category-tag ${post.category.toLowerCase().replace(' ', '-')}">${post.category}</div>
                    <h1>${post.title}</h1>
                    <div class="blog-article-meta">
                        <span><i class="fas fa-calendar"></i> ${post.date}</span>
                        <span><i class="fas fa-clock"></i> ${post.readTime}</span>
                        <span><i class="fas fa-user"></i> ${post.author}</span>
                        <span><i class="fas fa-eye"></i> ${post.views} views</span>
                    </div>
                </header>
                <div class="blog-article-content">
                    ${post.content}
                </div>
            </article>
        `;
        
        blogModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeBlogModal() {
        blogModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (modalClose) modalClose.addEventListener('click', closeBlogModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeBlogModal);

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && blogModal.classList.contains('active')) {
            closeBlogModal();
        }
    });

    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                showNotification('Thank you for subscribing! You\'ll receive our latest updates.', 'success');
                this.reset();
            }
        });
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
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

    // Initialize filtering
    filterAndSortPosts();
});

// Add page leave transition
window.addEventListener('beforeunload', function() {
    document.body.style.opacity = '0';
});
