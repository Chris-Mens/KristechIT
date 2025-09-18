const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = null;
        this.isConfigured = false;
        this.initializeTransporter();
    }

    initializeTransporter() {
        try {
            // Check if email configuration is available
            if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
                console.warn('⚠️ Email configuration missing. Email notifications disabled.');
                return;
            }

            this.transporter = nodemailer.createTransporter({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT) || 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            this.isConfigured = true;
            console.log('✅ Email service configured successfully');

        } catch (error) {
            console.error('❌ Email service configuration failed:', error);
            this.isConfigured = false;
        }
    }

    async verifyConnection() {
        if (!this.isConfigured) {
            throw new Error('Email service not configured');
        }

        try {
            await this.transporter.verify();
            console.log('✅ Email connection verified');
            return true;
        } catch (error) {
            console.error('❌ Email connection verification failed:', error);
            throw error;
        }
    }

    async sendContactNotification(submission) {
        if (!this.isConfigured) {
            console.warn('⚠️ Skipping email notification - service not configured');
            return { success: false, reason: 'Email service not configured' };
        }

        try {
            const { first_name, last_name, email, phone, service, message, created_at } = submission;

            // Email to admin
            const adminEmailOptions = {
                from: `"Kristech IT Website" <${process.env.SMTP_USER}>`,
                to: process.env.ADMIN_EMAIL || 'christophermen60@gmail.com',
                subject: `🔔 New Contact Form Submission - ${service}`,
                html: this.generateAdminEmailTemplate(submission),
                text: this.generateAdminEmailText(submission)
            };

            // Email to customer (auto-reply)
            const customerEmailOptions = {
                from: `"Christopher Mensah - Kristech IT" <${process.env.SMTP_USER}>`,
                to: email,
                subject: '✅ Thank you for contacting Kristech IT Solutions',
                html: this.generateCustomerEmailTemplate(submission),
                text: this.generateCustomerEmailText(submission)
            };

            // Send both emails
            const [adminResult, customerResult] = await Promise.allSettled([
                this.transporter.sendMail(adminEmailOptions),
                this.transporter.sendMail(customerEmailOptions)
            ]);

            console.log('📧 Email notifications sent:', {
                admin: adminResult.status,
                customer: customerResult.status
            });

            return {
                success: true,
                adminEmail: adminResult.status === 'fulfilled',
                customerEmail: customerResult.status === 'fulfilled',
                adminMessageId: adminResult.status === 'fulfilled' ? adminResult.value.messageId : null,
                customerMessageId: customerResult.status === 'fulfilled' ? customerResult.value.messageId : null
            };

        } catch (error) {
            console.error('❌ Email notification failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    generateAdminEmailTemplate(submission) {
        const { first_name, last_name, email, phone, service, message, created_at, ip_address } = submission;
        
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>New Contact Form Submission</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #555; }
                .value { margin-top: 5px; padding: 10px; background: white; border-radius: 5px; }
                .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
                .urgent { background: #ef4444; }
                .normal { background: #2563eb; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header ${service === 'urgent' ? 'urgent' : 'normal'}">
                    <h1>🔔 New Contact Form Submission</h1>
                    <p>Kristech IT Solutions Website</p>
                </div>
                
                <div class="content">
                    <div class="field">
                        <div class="label">👤 Name:</div>
                        <div class="value">${first_name} ${last_name}</div>
                    </div>
                    
                    <div class="field">
                        <div class="label">📧 Email:</div>
                        <div class="value"><a href="mailto:${email}">${email}</a></div>
                    </div>
                    
                    ${phone ? `
                    <div class="field">
                        <div class="label">📞 Phone:</div>
                        <div class="value"><a href="tel:${phone}">${phone}</a></div>
                    </div>
                    ` : ''}
                    
                    <div class="field">
                        <div class="label">🛠️ Service Requested:</div>
                        <div class="value">${this.formatServiceName(service)}</div>
                    </div>
                    
                    <div class="field">
                        <div class="label">💬 Message:</div>
                        <div class="value">${message.replace(/\n/g, '<br>')}</div>
                    </div>
                    
                    <div class="field">
                        <div class="label">🕒 Submitted:</div>
                        <div class="value">${new Date(created_at).toLocaleString()}</div>
                    </div>
                    
                    ${ip_address ? `
                    <div class="field">
                        <div class="label">🌐 IP Address:</div>
                        <div class="value">${ip_address}</div>
                    </div>
                    ` : ''}
                </div>
                
                <div class="footer">
                    <p>This email was automatically generated from your website contact form.</p>
                    <p><strong>Next Steps:</strong> Respond to the customer within 24 hours for best results.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    generateCustomerEmailTemplate(submission) {
        const { first_name, service } = submission;
        
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Thank you for contacting Kristech IT</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
                .cta { background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✅ Thank You, ${first_name}!</h1>
                    <p>Your message has been received</p>
                </div>
                
                <div class="content">
                    <p>Hi ${first_name},</p>
                    
                    <p>Thank you for reaching out to <strong>Kristech IT Solutions</strong> regarding our <strong>${this.formatServiceName(service)}</strong> services.</p>
                    
                    <p>I've received your message and will personally review it. You can expect a detailed response from me within <strong>24 hours</strong>.</p>
                    
                    <p><strong>What happens next?</strong></p>
                    <ul>
                        <li>I'll review your requirements carefully</li>
                        <li>Prepare a personalized response with recommendations</li>
                        <li>Schedule a consultation call if needed</li>
                        <li>Provide you with a detailed proposal</li>
                    </ul>
                    
                    <p>In the meantime, feel free to:</p>
                    <ul>
                        <li>📱 Call/WhatsApp me directly: <strong>+233 509 146 971</strong></li>
                        <li>📧 Reply to this email with any additional questions</li>
                        <li>🌐 Explore more of our work at <a href="https://kristechit.com">kristechit.com</a></li>
                    </ul>
                    
                    <center>
                        <a href="https://kristechit.com/pages/portfolio.html" class="cta">View Our Portfolio</a>
                    </center>
                    
                    <p>Best regards,<br>
                    <strong>Christopher Mensah</strong><br>
                    Founder & Lead Developer<br>
                    Kristech IT Solutions</p>
                </div>
                
                <div class="footer">
                    <p>📧 christophermen60@gmail.com | 📞 +233 509 146 971</p>
                    <p>🌐 <a href="https://kristechit.com">kristechit.com</a></p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    generateAdminEmailText(submission) {
        const { first_name, last_name, email, phone, service, message, created_at } = submission;
        
        return `
New Contact Form Submission - Kristech IT Solutions

Name: ${first_name} ${last_name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Service: ${this.formatServiceName(service)}
Submitted: ${new Date(created_at).toLocaleString()}

Message:
${message}

---
This email was automatically generated from your website contact form.
        `;
    }

    generateCustomerEmailText(submission) {
        const { first_name, service } = submission;
        
        return `
Thank You, ${first_name}!

Thank you for reaching out to Kristech IT Solutions regarding our ${this.formatServiceName(service)} services.

I've received your message and will personally review it. You can expect a detailed response from me within 24 hours.

Contact Information:
Phone/WhatsApp: +233 509 146 971
Email: christophermen60@gmail.com
Website: https://kristechit.com

Best regards,
Christopher Mensah
Founder & Lead Developer
Kristech IT Solutions
        `;
    }

    formatServiceName(service) {
        const serviceNames = {
            'web-development': 'Web Development',
            'graphic-design': 'Graphic Design',
            'it-consulting': 'IT Consulting',
            'database-solutions': 'Database Solutions',
            'other': 'Other Services'
        };
        
        return serviceNames[service] || service;
    }
}

module.exports = new EmailService();
