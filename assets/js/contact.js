// Contact Page Advanced Features

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

    // Copy to clipboard functionality
    window.copyToClipboard = function(text) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification(`Copied "${text}" to clipboard!`, 'success');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification(`Copied "${text}" to clipboard!`, 'success');
        });
    };

    // Advanced contact form handling
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.querySelector('.submit-btn');
    const btnText = document.querySelector('.btn-text');
    const btnLoading = document.querySelector('.btn-loading');

    // Form validation rules
    const validationRules = {
        firstName: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'First name must be at least 2 characters and contain only letters'
        },
        lastName: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'Last name must be at least 2 characters and contain only letters'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        phone: {
            pattern: /^(?:\+233|0)[1-9]\d{8}$/,
            message: 'Please enter a valid phone number starting with 0 or +233 followed by 9 digits'
        },
        service: {
            required: true,
            message: 'Please select a service'
        },
        message: {
            required: true,
            minLength: 10,
            maxLength: 1000,
            message: 'Message must be between 10 and 1000 characters'
        },
        privacy: {
            required: true,
            message: 'You must agree to the privacy policy'
        }
    };

    // Character counter for message field
    const messageField = document.getElementById('message');
    const charCount = document.getElementById('char-count');

    if (messageField && charCount) {
        messageField.addEventListener('input', function() {
            const count = this.value.length;
            charCount.textContent = count;
            
            if (count > 1000) {
                charCount.style.color = '#ef4444';
            } else if (count > 800) {
                charCount.style.color = '#f59e0b';
            } else {
                charCount.style.color = '#6b7280';
            }
        });
    }

    // Real-time form validation
    Object.keys(validationRules).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('blur', () => validateField(fieldName));
            field.addEventListener('input', () => clearFieldError(fieldName));
        }
    });

    function validateField(fieldName) {
        const field = document.getElementById(fieldName);
        if (!field) return true; // Skip validation if field doesn't exist
        
        const rule = validationRules[fieldName];
        if (!rule) return true; // Skip if no validation rule exists
        
        const errorElement = field.parentNode.querySelector('.form-error');
        if (!errorElement) return true; // Skip if no error element found
        
        let isValid = true;
        let errorMessage = '';

        // Check if field is required
        if (rule.required && (!field.value || field.value.trim() === '')) {
            isValid = false;
            errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
        }
        // Check pattern
        else if (field.value && rule.pattern && !rule.pattern.test(field.value)) {
            isValid = false;
            errorMessage = rule.message;
        }
        // Check minimum length
        else if (field.value && rule.minLength && field.value.length < rule.minLength) {
            isValid = false;
            errorMessage = rule.message;
        }
        // Check maximum length
        else if (field.value && rule.maxLength && field.value.length > rule.maxLength) {
            isValid = false;
            errorMessage = rule.message;
        }
        // Special validation for checkboxes
        else if (field.type === 'checkbox' && rule.required && !field.checked) {
            isValid = false;
            errorMessage = rule.message;
        }

        if (!isValid) {
            field.classList.add('error');
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
        } else {
            field.classList.remove('error');
            errorElement.classList.remove('show');
        }

        return isValid;
    }

    function clearFieldError(fieldName) {
        const field = document.getElementById(fieldName);
        if (!field) return;
        
        const errorElement = field.parentNode.querySelector('.form-error');
        if (!errorElement) return;
        
        if (field.classList.contains('error')) {
            field.classList.remove('error');
            errorElement.classList.remove('show');
        }
    }

    // Form submission with EmailJS
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate all fields that exist in the form
            let isFormValid = true;
            Object.keys(validationRules).forEach(fieldName => {
                const field = document.getElementById(fieldName);
                if (field) { // Only validate fields that exist in the form
                    if (!validateField(fieldName)) {
                        isFormValid = false;
                    }
                }
            });

            if (!isFormValid) {
                showNotification('Please fix the errors in the form before submitting.', 'error');
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            if (btnLoading) btnLoading.style.display = 'inline-flex';

            try {
                // Collect form data
                const formData = {
                    firstName: document.getElementById('firstName').value.trim(),
                    lastName: document.getElementById('lastName').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    phone: document.getElementById('phone').value.trim(),
                    service: document.getElementById('service').value,
                    message: document.getElementById('message').value.trim(),
                    privacy: document.getElementById('privacy').checked ? 'true' : 'false',
                    _subject: `New Contact Form Submission - ${document.getElementById('service').options[document.getElementById('service').selectedIndex].text}`
                };

                console.log('📧 Submitting contact form:', formData);

                // Show sending state
                if (btnText) btnText.textContent = 'Sending...';
                
                // Send the email using EmailJS
                const response = await emailjs.send(
                    'service_7x6h6v7', // Your EmailJS service ID
                    'template_b0fk0x9', // Your EmailJS template ID
                    {
                        to_email: 'christophermen60@gmail.com',
                        from_name: `${formData.firstName} ${formData.lastName}`,
                        from_email: formData.email,
                        phone: formData.phone,
                        service: formData.service,
                        message: formData.message,
                        reply_to: formData.email
                    }
                );
                
                // Show success message
                showNotification('Thank you! Your message has been sent successfully. We\'ll get back to you soon!', 'success');
                
                // Track successful submission
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'contact_form_submitted', {
                        'event_category': 'contact',
                        'event_label': 'Form submitted via EmailJS',
                        'value': 1
                    });
                }
                
                // Reset form
                contactForm.reset();
                if (charCount) charCount.textContent = '0';
                
            } catch (error) {
                console.error('❌ Email sending failed:', error);
                
                // Fallback to mailto: if EmailJS fails
                const email = 'christophermen60@gmail.com';
                const subject = encodeURIComponent(formData._subject || 'Contact Form Submission');
                const body = encodeURIComponent(
                    `Name: ${formData.firstName || ''} ${formData.lastName || ''}\n` +
                    `Email: ${formData.email || ''}\n` +
                    `Phone: ${formData.phone || ''}\n` +
                    `Service: ${formData.service || ''}\n` +
                    `Message:\n${formData.message || ''}\n\n`
                );
                
                // Show fallback message
                const userConfirmed = confirm('We had trouble sending your message. Would you like to try sending it through your email client instead?');
                
                if (userConfirmed) {
                    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
                    showNotification('Your email client has been opened. Please click Send to submit your message.', 'info');
                } else {
                    showNotification('You can also contact us directly at christophermen60@gmail.com', 'info');
                }
                
                // Track fallback usage
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'email_fallback_used', {
                        'event_category': 'contact',
                        'event_label': 'Email fallback used',
                        'value': 1
                    });
                }
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                if (btnText) {
                    btnText.style.display = 'inline';
                    btnText.textContent = 'Send Message';
                }
                if (btnLoading) btnLoading.style.display = 'none';
                
                // Clear any existing errors
                Object.keys(validationRules).forEach(fieldName => {
                    clearFieldError(fieldName);
                });
            }
            });
        }

    // Chat widget functionality
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatInputField = document.getElementById('chat-input-field');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');
    const chatNotification = document.querySelector('.chat-notification');

    let chatOpen = false;
    const botResponses = [
        "Thanks for reaching out! How can I help you today?",
        "I'd be happy to help you with information about our services.",
        "For detailed project discussions, I recommend scheduling a consultation call.",
        "You can also fill out our contact form for a comprehensive response.",
        "Is there a specific service you're interested in?",
        "Our team typically responds to inquiries within 24 hours.",
        "Would you like me to connect you with one of our specialists?"
    ];

    if (chatToggle) {
        chatToggle.addEventListener('click', function() {
            chatOpen = !chatOpen;
            if (chatOpen) {
                chatWindow.classList.add('active');
                chatNotification.style.display = 'none';
                chatInputField.focus();
            } else {
                chatWindow.classList.remove('active');
            }
        });
    }

    if (chatClose) {
        chatClose.addEventListener('click', function() {
            chatOpen = false;
            chatWindow.classList.remove('active');
        });
    }

    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${isUser ? 'fa-user' : 'fa-robot'}"></i>
            </div>
            <div class="message-content">
                <p>${content}</p>
                <span class="message-time">${timeString}</span>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendMessage() {
        const message = chatInputField.value.trim();
        if (message) {
            addMessage(message, true);
            chatInputField.value = '';
            
            // Simulate bot response
            setTimeout(() => {
                const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
                addMessage(randomResponse);
            }, 1000);
        }
    }

    if (chatSend) {
        chatSend.addEventListener('click', sendMessage);
    }

    if (chatInputField) {
        chatInputField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

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

    // Initialize all features
    initScrollProgress();
    initTypingEffect();

    // Add page transition effect
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Show chat notification after 5 seconds
    setTimeout(() => {
        if (!chatOpen && chatNotification) {
            chatNotification.style.display = 'flex';
        }
    }, 5000);

    // Add page leave transition
    window.addEventListener('beforeunload', function() {
        document.body.style.opacity = '0';
    });

    // Close any open tooltips when clicking outside
    if (document.documentElement) {
        document.documentElement.addEventListener('click', function() {
            const tooltips = document.querySelectorAll('.tooltip');
            tooltips.forEach(tooltip => tooltip.remove());
        });
    }
}); // End of DOMContentLoaded
