// API Client for Kristech IT Solutions
class KristechAPI {
    constructor() {
        // Configuration
        this.baseURL = this.getAPIBaseURL();
        this.timeout = 10000; // 10 seconds
        
        // Request interceptors
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    getAPIBaseURL() {
        // Determine API URL based on environment
        const hostname = window.location.hostname;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:3001/api';
        } else if (hostname.includes('netlify.app') || hostname.includes('vercel.app')) {
            // Production API URL - update this with your deployed backend URL
            return 'https://your-backend-api.herokuapp.com/api';
        } else {
            // Custom domain
            return 'https://api.kristechit.com/api';
        }
    }

    async isBackendAvailable() {
        try {
            await this.makeRequest('/health', { method: 'HEAD' });
            return true;
        } catch (error) {
            console.log('Backend not available, falling back to email client');
            return false;
        }
    }

    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const config = {
            method: 'GET',
            headers: { ...this.defaultHeaders },
            ...options,
            // Don't throw on HTTP error status codes
            // We'll handle them in the response
            credentials: 'same-origin',
            mode: 'cors'
        };

        // Add timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        config.signal = controller.signal;

        try {
            console.log(`🌐 API Request: ${config.method} ${url}`);
            
            const response = await fetch(url, config);
            clearTimeout(timeoutId);

            // Parse response if it's JSON
            let data;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            }

            if (!response.ok) {
                const error = new Error(data?.message || `HTTP ${response.status}: ${response.statusText}`);
                error.status = response.status;
                error.data = data;
                throw error;
            }

            console.log(`✅ API Success: ${config.method} ${url}`, data);
            return data || { success: true };

        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                const timeoutError = new Error('Request timeout - please check your connection and try again');
                timeoutError.isNetworkError = true;
                throw timeoutError;
            }
            
            console.error(`❌ API Error: ${config.method} ${url}`, error);
            
            // Enhance the error with more context
            if (error instanceof TypeError) {
                error.isNetworkError = true;
                error.message = 'Unable to connect to the server. Please check your internet connection.';
            }
            
            throw error;
        }
    }

    // Health check
    async checkHealth() {
        return this.makeRequest('/health');
    }

    // Contact form submission
    async submitContactForm(formData) {
        return this.makeRequest('/contact/submit', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
    }

    // Newsletter subscription (future feature)
    async subscribeNewsletter(email) {
        return this.makeRequest('/newsletter/subscribe', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    }

    // Get blog posts (future feature)
    async getBlogPosts(page = 1, limit = 10) {
        return this.makeRequest(`/blog/posts?page=${page}&limit=${limit}`);
    }

    // Get projects (future feature)
    async getProjects(category = null) {
        const query = category ? `?category=${category}` : '';
        return this.makeRequest(`/projects${query}`);
    }
}

// Create global API instance
window.kristechAPI = new KristechAPI();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KristechAPI;
}
