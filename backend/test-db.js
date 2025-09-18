require('dotenv').config();
const { Pool } = require('pg');

async function testConnection() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false // Only for development
        }
    });

    try {
        console.log('🔌 Testing database connection...');
        const client = await pool.connect();
        console.log('✅ Connected to database successfully!');
        
        // Test query
        const result = await client.query('SELECT version()');
        console.log('📊 Database version:', result.rows[0].version);
        
        // Test contact_submissions table
        try {
            const res = await client.query('SELECT COUNT(*) FROM contact_submissions');
            console.log(`📝 Found ${res.rows[0].count} contact submissions`);
        } catch (e) {
            console.warn('⚠️ contact_submissions table not found or empty');
        }
        
        client.release();
    } catch (err) {
        console.error('❌ Database connection failed!');
        console.error('Error details:', err.message);
        
        // More detailed error guidance
        if (err.message.includes('password authentication failed')) {
            console.error('\n🔑 Authentication failed. Please check:');
            console.error('1. Database username and password in DATABASE_URL');
            console.error('2. If using Neon, verify your database is running');
        } else if (err.message.includes('does not exist')) {
            console.error('\n🔍 Database not found. Please check:');
            console.error('1. Database name in DATABASE_URL');
            console.error('2. Run: npm run init-db');
        } else if (err.message.includes('connection')) {
            console.error('\n🌐 Connection failed. Please check:');
            console.error('1. Database host and port in DATABASE_URL');
            console.error('2. Your internet connection');
            console.error('3. If using Neon, check your project status');
        }
    } finally {
        await pool.end();
        process.exit();
    }
}

testConnection();
