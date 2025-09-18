const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { query } = require('../config/database');
const emailService = require('../services/email');

// Stricter rate limiting for contact form
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 contact form submissions per windowMs
    message: {
        error: 'Too many contact form submissions. Please try again later.',
        retryAfter: 900 // 15 minutes in seconds
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Validation rules for contact form
const contactValidation = [
    body('firstName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('First name must be 2-50 characters and contain only letters'),
    
    body('lastName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Last name must be 2-50 characters and contain only letters'),
    
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('phone')
        .optional()
        .trim()
        .matches(/^[\+]?[1-9][\d]{0,15}$/)
        .withMessage('Please provide a valid phone number'),
    
    body('service')
        .isIn(['web-development', 'graphic-design', 'it-consulting', 'database-solutions', 'other'])
        .withMessage('Please select a valid service'),
    
    body('message')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Message must be between 10 and 1000 characters'),
    
    body('privacy')
        .equals('true')
        .withMessage('You must agree to the privacy policy')
];

// Submit contact form
router.post('/submit', contactLimiter, contactValidation, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const {
            firstName,
            lastName,
            email,
            phone,
            service,
            message,
            privacy
        } = req.body;

        // Insert contact submission into database
        const insertQuery = `
            INSERT INTO contact_submissions (
                first_name, 
                last_name, 
                email, 
                phone, 
                service, 
                message, 
                ip_address,
                user_agent,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
            RETURNING id, created_at
        `;

        const values = [
            firstName,
            lastName,
            email,
            phone || null,
            service,
            message,
            req.ip,
            req.get('User-Agent')
        ];

        const result = await query(insertQuery, values);
        const submission = result.rows[0];

        // Log the submission
        console.log(`📧 New contact submission from ${firstName} ${lastName} (${email})`);

        // Send email notifications (async, don't wait for completion)
        setImmediate(async () => {
            try {
                const emailResult = await emailService.sendContactNotification({
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    phone,
                    service,
                    message,
                    created_at: submission.created_at,
                    ip_address: req.ip
                });
                
                console.log('📧 Email notification result:', emailResult);
                
                // Update submission with email status
                if (emailResult.success) {
                    await query(
                        'UPDATE contact_submissions SET email_sent = true WHERE id = $1',
                        [submission.id]
                    );
                }
            } catch (emailError) {
                console.error('❌ Email notification error:', emailError);
            }
        });

        // Send success response immediately
        res.status(201).json({
            success: true,
            message: 'Thank you for your message! We will get back to you within 24 hours.',
            submissionId: submission.id,
            timestamp: submission.created_at
        });
        
    } catch (error) {
        console.error('Contact form submission error:', error);
        
        res.status(500).json({
            success: false,
            message: 'There was an error processing your request. Please try again later.',
            error: process.env.NODE_ENV !== 'production' ? error.message : undefined
        });
    }
});

// Get contact submissions (admin only - would need authentication)
router.get('/submissions', async (req, res) => {
    try {
        // TODO: Add authentication middleware here
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        // Get total count
        const countQuery = 'SELECT COUNT(*) FROM contact_submissions';
        const countResult = await query(countQuery);
        const totalSubmissions = parseInt(countResult.rows[0].count);

        // Get submissions with pagination
        const submissionsQuery = `
            SELECT 
                id,
                first_name,
                last_name,
                email,
                phone,
                service,
                message,
                created_at,
                status
            FROM contact_submissions 
            ORDER BY created_at DESC 
            LIMIT $1 OFFSET $2
        `;

        const submissionsResult = await query(submissionsQuery, [limit, offset]);

        res.json({
            success: true,
            data: {
                submissions: submissionsResult.rows,
                pagination: {
                    page,
                    limit,
                    total: totalSubmissions,
                    totalPages: Math.ceil(totalSubmissions / limit)
                }
            }
        });

    } catch (error) {
        console.error('Error fetching contact submissions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching submissions',
            error: process.env.NODE_ENV !== 'production' ? error.message : undefined
        });
    }
});

// Update submission status (admin only)
router.patch('/submissions/:id/status', async (req, res) => {
    try {
        // TODO: Add authentication middleware here
        
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'in_progress', 'completed', 'archived'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const updateQuery = `
            UPDATE contact_submissions 
            SET status = $1, updated_at = NOW() 
            WHERE id = $2 
            RETURNING id, status, updated_at
        `;

        const result = await query(updateQuery, [status, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        res.json({
            success: true,
            message: 'Status updated successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Error updating submission status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating status',
            error: process.env.NODE_ENV !== 'production' ? error.message : undefined
        });
    }
});

module.exports = router;
