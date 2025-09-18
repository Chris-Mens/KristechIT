# Kristech IT Solutions - Backend API

A secure Node.js/Express backend API with PostgreSQL database integration for the Kristech IT Solutions website.

## 🚀 Features

- **Secure Contact Form API** with validation and rate limiting
- **PostgreSQL Database** integration with Neon
- **Health Check Endpoints** for monitoring
- **Security Best Practices** (Helmet, CORS, Rate Limiting)
- **Input Validation** with express-validator
- **Error Handling** and logging
- **Environment-based Configuration**

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database (Neon account)
- npm or yarn package manager

## ⚙️ Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file with your configuration:**
   ```env
   DATABASE_URL=your_neon_database_url_here
   PORT=3001
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=http://localhost:3000
   ADMIN_EMAIL=christophermen60@gmail.com
   ```

5. **Initialize the database:**
   ```bash
   npm run init-db
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run init-db` - Initialize database tables

## 📡 API Endpoints

### Health Check
- `GET /api/health` - Check API and database health
- `GET /api/health/system` - System information (dev only)

### Contact Form
- `POST /api/contact/submit` - Submit contact form
- `GET /api/contact/submissions` - Get all submissions (admin)
- `PATCH /api/contact/submissions/:id/status` - Update submission status

### Root
- `GET /` - API information and available endpoints

## 📊 Database Schema

### contact_submissions
- `id` (SERIAL PRIMARY KEY)
- `first_name` (VARCHAR(50))
- `last_name` (VARCHAR(50))
- `email` (VARCHAR(255))
- `phone` (VARCHAR(20), optional)
- `service` (VARCHAR(50))
- `message` (TEXT)
- `status` (VARCHAR(20), default: 'pending')
- `ip_address` (INET)
- `user_agent` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Prevent abuse
- **Input Validation** - Sanitize and validate inputs
- **SQL Injection Protection** - Parameterized queries
- **Environment Variables** - Secure configuration

## 🌐 Deployment

### Environment Variables for Production:
```env
DATABASE_URL=your_production_database_url
NODE_ENV=production
PORT=3001
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://your-domain.com
```

### Deploy to Heroku:
1. Create Heroku app
2. Set environment variables
3. Connect to GitHub repository
4. Deploy

### Deploy to Railway/Render:
1. Connect repository
2. Set environment variables
3. Deploy automatically

## 🧪 Testing

Test the API endpoints:

```bash
# Health check
curl http://localhost:3001/api/health

# Submit contact form
curl -X POST http://localhost:3001/api/contact/submit \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "service": "web-development",
    "message": "Hello, I need a website",
    "privacy": "true"
  }'
```

## 📝 API Response Format

### Success Response:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

## 🔧 Configuration

### Rate Limiting:
- Contact form: 5 submissions per 15 minutes per IP
- General API: 100 requests per 15 minutes per IP

### CORS:
- Configured for frontend domain
- Credentials enabled
- Specific methods allowed

## 📞 Support

For questions or issues:
- Email: christophermen60@gmail.com
- Phone: +233 509 146 971

## 📄 License

This project is for Kristech IT Solutions business use.
