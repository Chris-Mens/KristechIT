const { query, checkHealth } = require('../config/database');
require('dotenv').config();

async function initializeDatabase() {
    try {
        console.log('🚀 Starting database initialization...');

        // Check database connection
        const health = await checkHealth();
        if (health.status !== 'healthy') {
            throw new Error('Database connection failed: ' + health.error);
        }
        console.log('✅ Database connection verified');

        // Create contact_submissions table
        const createContactTable = `
            CREATE TABLE IF NOT EXISTS contact_submissions (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                service VARCHAR(50) NOT NULL,
                message TEXT NOT NULL,
                status VARCHAR(20) DEFAULT 'pending',
                email_sent BOOLEAN DEFAULT false,
                ip_address INET,
                user_agent TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `;

        await query(createContactTable);
        console.log('✅ Contact submissions table created/verified');

        // Create indexes for better performance
        const createIndexes = [
            'CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_submissions(email);',
            'CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_submissions(created_at);',
            'CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions(status);'
        ];

        for (const indexQuery of createIndexes) {
            await query(indexQuery);
        }
        console.log('✅ Database indexes created/verified');

        // Create newsletter_subscriptions table (for future use)
        const createNewsletterTable = `
            CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                status VARCHAR(20) DEFAULT 'active',
                subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                unsubscribed_at TIMESTAMP WITH TIME ZONE,
                ip_address INET,
                user_agent TEXT
            );
        `;

        await query(createNewsletterTable);
        console.log('✅ Newsletter subscriptions table created/verified');

        // Create blog_posts table (for future use)
        const createBlogTable = `
            CREATE TABLE IF NOT EXISTS blog_posts (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) UNIQUE NOT NULL,
                excerpt TEXT,
                content TEXT NOT NULL,
                featured_image VARCHAR(500),
                category VARCHAR(50),
                tags TEXT[],
                status VARCHAR(20) DEFAULT 'draft',
                author_name VARCHAR(100) DEFAULT 'Christopher Mensah',
                author_email VARCHAR(255) DEFAULT 'christophermen60@gmail.com',
                published_at TIMESTAMP WITH TIME ZONE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `;

        await query(createBlogTable);
        console.log('✅ Blog posts table created/verified');

        // Create projects table (for portfolio)
        const createProjectsTable = `
            CREATE TABLE IF NOT EXISTS projects (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) UNIQUE NOT NULL,
                description TEXT,
                long_description TEXT,
                featured_image VARCHAR(500),
                gallery_images TEXT[],
                technologies TEXT[],
                category VARCHAR(50),
                project_url VARCHAR(500),
                github_url VARCHAR(500),
                status VARCHAR(20) DEFAULT 'active',
                featured BOOLEAN DEFAULT FALSE,
                completed_at DATE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `;

        await query(createProjectsTable);
        console.log('✅ Projects table created/verified');

        // Insert sample data for testing (only in development)
        if (process.env.NODE_ENV !== 'production') {
            await insertSampleData();
        }

        console.log('🎉 Database initialization completed successfully!');
        console.log('📊 Tables created:');
        console.log('   - contact_submissions');
        console.log('   - newsletter_subscriptions');
        console.log('   - blog_posts');
        console.log('   - projects');

    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
}

async function insertSampleData() {
    try {
        // Check if sample data already exists
        const existingProjects = await query('SELECT COUNT(*) FROM projects');
        if (parseInt(existingProjects.rows[0].count) > 0) {
            console.log('📋 Sample data already exists, skipping insertion');
            return;
        }

        // Insert sample projects
        const sampleProjects = [
            {
                title: 'E-Commerce Platform',
                slug: 'ecommerce-platform',
                description: 'Full-stack web application for online retail',
                long_description: 'A comprehensive e-commerce solution built with modern technologies, featuring user authentication, payment processing, inventory management, and admin dashboard.',
                technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
                category: 'web-development',
                featured: true
            },
            {
                title: 'Brand Identity Design',
                slug: 'brand-identity-design',
                description: 'Complete branding package for startup company',
                long_description: 'Comprehensive brand identity design including logo, color palette, typography, business cards, and brand guidelines for a tech startup.',
                technologies: ['Adobe Illustrator', 'Photoshop', 'Figma'],
                category: 'graphic-design',
                featured: true
            },
            {
                title: 'Analytics Dashboard',
                slug: 'analytics-dashboard',
                description: 'Data visualization system for business intelligence',
                long_description: 'Interactive dashboard for visualizing business metrics and KPIs with real-time data updates and customizable charts.',
                technologies: ['Python', 'Django', 'Chart.js', 'PostgreSQL'],
                category: 'database-solutions',
                featured: false
            }
        ];

        for (const project of sampleProjects) {
            const insertProject = `
                INSERT INTO projects (title, slug, description, long_description, technologies, category, featured, status)
                VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')
            `;
            await query(insertProject, [
                project.title,
                project.slug,
                project.description,
                project.long_description,
                project.technologies,
                project.category,
                project.featured
            ]);
        }

        console.log('✅ Sample project data inserted');

    } catch (error) {
        console.error('❌ Error inserting sample data:', error);
    }
}

// Run initialization if this script is executed directly
if (require.main === module) {
    initializeDatabase()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error('Initialization failed:', error);
            process.exit(1);
        });
}

module.exports = { initializeDatabase };
