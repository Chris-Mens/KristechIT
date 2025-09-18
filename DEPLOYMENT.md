# 🚀 Kristech IT Solutions - Complete Deployment Guide

## 📋 Overview

This guide covers the complete deployment of your full-stack Kristech IT Solutions website with:
- **Frontend**: Static website (Netlify/Vercel)
- **Backend**: Node.js API (Heroku/Railway/Render)
- **Database**: PostgreSQL (Neon)
- **Email**: SMTP notifications

## 🔒 Security Setup (URGENT - Do This First!)

### 1. Secure Your Database
```bash
# 1. Go to your Neon dashboard
# 2. Reset your database password immediately
# 3. Update your connection string with the new password
```

### 2. Create Environment Variables
```bash
cd backend
cp .env.example .env
# Edit .env with your secure credentials
```

## 🏗️ Backend Deployment Options

### Option A: Heroku (Recommended)

1. **Install Heroku CLI**
2. **Create Heroku App**
   ```bash
   cd backend
   heroku create kristech-backend
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set DATABASE_URL="your_new_secure_database_url"
   heroku config:set NODE_ENV="production"
   heroku config:set JWT_SECRET="your-super-secret-jwt-key"
   heroku config:set FRONTEND_URL="https://your-frontend-domain.netlify.app"
   heroku config:set SMTP_HOST="smtp.gmail.com"
   heroku config:set SMTP_USER="christophermen60@gmail.com"
   heroku config:set SMTP_PASS="your-gmail-app-password"
   heroku config:set ADMIN_EMAIL="christophermen60@gmail.com"
   ```

4. **Deploy**
   ```bash
   git init
   git add .
   git commit -m "Initial backend deployment"
   heroku git:remote -a kristech-backend
   git push heroku main
   ```

### Option B: Railway

1. **Connect GitHub Repository**
2. **Set Environment Variables** in Railway dashboard
3. **Deploy automatically** from GitHub

### Option C: Render

1. **Connect GitHub Repository**
2. **Use render.yaml** configuration
3. **Set environment variables** in dashboard

## 🌐 Frontend Deployment

### Option A: Netlify (Recommended)

1. **Drag & Drop Deployment**
   - Zip your frontend files (exclude backend folder)
   - Drag to Netlify dashboard
   - Get deployment URL

2. **Update API URL**
   ```javascript
   // In assets/js/api-client.js
   // Update the production API URL with your backend URL
   return 'https://kristech-backend.herokuapp.com/api';
   ```

3. **Redeploy** with updated API URL

### Option B: Vercel

1. **Connect GitHub Repository**
2. **Deploy automatically**
3. **Update API URL** in api-client.js

## 📧 Email Setup (Gmail)

### 1. Enable 2-Factor Authentication
- Go to Google Account settings
- Enable 2FA

### 2. Generate App Password
- Go to Google Account → Security → App Passwords
- Generate password for "Mail"
- Use this password in SMTP_PASS

### 3. Test Email Configuration
```bash
# In your backend
npm run dev
# Check logs for email service status
```

## 🗄️ Database Setup

### 1. Initialize Database
```bash
cd backend
npm install
npm run init-db
```

### 2. Verify Tables Created
- Contact submissions
- Newsletter subscriptions
- Blog posts
- Projects

## 🧪 Testing Your Deployment

### 1. Backend Health Check
```bash
curl https://your-backend-url.herokuapp.com/api/health
```

### 2. Contact Form Test
- Visit your frontend
- Submit contact form
- Check admin dashboard: `https://your-backend-url.herokuapp.com/admin`

### 3. Email Test
- Submit contact form
- Check both admin and customer emails

## 📊 Admin Dashboard

Access your admin dashboard at:
```
https://your-backend-url.herokuapp.com/admin
```

Features:
- View all submissions
- Real-time statistics
- Email delivery status
- Auto-refresh every 30 seconds

## 🔧 Environment Variables Reference

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Server
PORT=3001
NODE_ENV=production

# Security
JWT_SECRET=your-super-secret-jwt-key

# CORS
FRONTEND_URL=https://your-domain.netlify.app

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=christophermen60@gmail.com
SMTP_PASS=your-gmail-app-password
ADMIN_EMAIL=christophermen60@gmail.com
```

## 🚀 Go Live Checklist

- [ ] Database password reset and secured
- [ ] Backend deployed and health check passing
- [ ] Frontend deployed with correct API URL
- [ ] Email notifications working
- [ ] Contact form submissions working
- [ ] Admin dashboard accessible
- [ ] SSL certificates active (automatic on most platforms)
- [ ] Domain configured (optional)

## 📈 Monitoring & Maintenance

### 1. Health Monitoring
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Monitor `/api/health` endpoint

### 2. Error Tracking
- Check application logs regularly
- Monitor email delivery rates

### 3. Database Maintenance
- Regular backups (Neon handles this automatically)
- Monitor storage usage

## 🆘 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Update FRONTEND_URL in backend environment
   - Redeploy backend

2. **Email Not Sending**
   - Check Gmail app password
   - Verify SMTP settings
   - Check backend logs

3. **Database Connection Issues**
   - Verify DATABASE_URL is correct
   - Check Neon dashboard for connection limits

4. **404 Errors**
   - Verify all file paths are correct
   - Check frontend deployment includes all files

## 📞 Support

If you encounter issues:
- Check backend logs in your deployment platform
- Test API endpoints individually
- Contact: christophermen60@gmail.com

## 🎉 Success!

Once deployed, you'll have:
- ✅ Professional website with working contact form
- ✅ Automatic email notifications
- ✅ Admin dashboard for managing submissions
- ✅ Secure, scalable backend API
- ✅ Production-ready infrastructure

Your Kristech IT Solutions website is now live and ready for business! 🚀
