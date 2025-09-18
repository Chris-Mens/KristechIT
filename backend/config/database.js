const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Test database connection
pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle client', err);
    process.exit(-1);
});

// Helper function to execute queries
const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('📊 Executed query', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('❌ Database query error:', error);
        throw error;
    }
};

// Helper function to get a client from the pool
const getClient = async () => {
    try {
        const client = await pool.connect();
        return client;
    } catch (error) {
        console.error('❌ Error getting database client:', error);
        throw error;
    }
};

// Helper function to check database health
const checkHealth = async () => {
    try {
        const result = await query('SELECT NOW() as current_time');
        return {
            status: 'healthy',
            timestamp: result.rows[0].current_time,
            message: 'Database connection is working'
        };
    } catch (error) {
        return {
            status: 'unhealthy',
            error: error.message,
            message: 'Database connection failed'
        };
    }
};

module.exports = {
    pool,
    query,
    getClient,
    checkHealth
};
