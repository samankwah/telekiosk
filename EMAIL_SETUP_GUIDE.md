# TeleKiosk Email Service Setup Guide

The booking system is now configured to send real emails to patients. Choose one of the methods below:

## 🚀 Quick Setup Options

### Option 1: EmailJS (Recommended for Testing)
**Easiest setup, no backend required**

1. **Create EmailJS Account**
   - Go to [https://www.emailjs.com/](https://www.emailjs.com/)
   - Sign up for a free account

2. **Setup Email Service**
   - Add a new email service (Gmail, Outlook, etc.)
   - Follow EmailJS instructions to connect your email

3. **Create Email Template**
   - Create a new template with these variables:
     - `{{to_email}}` - Recipient email
     - `{{subject}}` - Email subject
     - `{{message_html}}` - HTML content
     - `{{meeting_link}}` - Google Meet link
     - `{{meeting_id}}` - Meeting ID
     - `{{calendar_link}}` - Calendar URL

4. **Update Configuration**
   - Edit `src/config/emailConfig.js`
   - Replace the EmailJS credentials:
   ```javascript
   emailjs: {
     serviceId: 'service_xxxxxxx',    // Your Service ID
     templateId: 'template_xxxxxxx',  // Your Template ID  
     publicKey: 'xxxxxxxxxxxxxxx',   // Your Public Key
   }
   ```

5. **Test the Integration**
   - Book an appointment
   - Check if email is received

### Option 2: Backend API (Production Ready)
**Most secure and reliable**

1. **Setup Backend Server**
   ```bash
   cd server
   npm install
   cp .env.example .env
   ```

2. **Configure Email Service**
   - Edit `.env` file with your email credentials
   - For Gmail: Enable 2FA and create App Password
   ```env
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-app-password
   ```

3. **Start Email API Server**
   ```bash
   npm run dev
   ```

4. **Update Frontend Configuration**
   - Edit `src/config/emailConfig.js`
   - Change method to 'api':
   ```javascript
   method: 'api'
   ```

### Option 3: Mailto Fallback (Basic)
**No setup required, opens email client**

1. **Update Configuration**
   - Edit `src/config/emailConfig.js`
   - Change method to 'mailto':
   ```javascript
   method: 'mailto'
   ```

## 📧 Email Service Providers

### Gmail Setup
1. Enable 2-Factor Authentication
2. Generate App Password: Google Account → Security → App passwords
3. Use the app password (not your regular password)

### SendGrid Setup
1. Create SendGrid account
2. Get API key from Settings → API Keys
3. Update backend configuration

### Mailgun Setup
1. Create Mailgun account
2. Add your domain
3. Get SMTP credentials

## 🔧 Configuration Files

### Frontend Configuration
File: `src/config/emailConfig.js`
```javascript
export const EMAIL_CONFIG = {
  method: 'emailjs', // Change to: 'emailjs', 'api', or 'mailto'
  
  emailjs: {
    serviceId: 'service_your_id',
    templateId: 'template_your_id', 
    publicKey: 'your_public_key'
  }
};
```

### Backend Configuration
File: `server/.env`
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=3001
```

## 🧪 Testing

1. **Book a Test Appointment**
   - Use your real email address
   - Complete the booking flow
   - Check your inbox

2. **Check Console Logs**
   - Open browser dev tools
   - Look for email service logs
   - Verify no errors

3. **Verify Email Content**
   - Meeting link should work
   - Calendar link should work
   - All details should be correct

## 🛠️ Troubleshooting

### EmailJS Issues
- Check service ID, template ID, and public key
- Verify template variables match
- Check EmailJS dashboard for usage limits

### Backend API Issues
- Verify server is running on port 3001
- Check email credentials in .env file
- Look at server console logs

### Gmail Issues
- Use App Password, not regular password
- Enable "Less secure app access" if needed
- Check Gmail SMTP settings

### Common Errors
```
Error: Invalid service ID
→ Check EmailJS service ID in config

Error: Template not found  
→ Verify template ID and variables

Error: Authentication failed
→ Check email credentials
```

## 📋 Next Steps

1. Choose your preferred email method
2. Follow the setup instructions above  
3. Test with a real booking
4. Monitor email delivery
5. Consider setting up email templates for different languages

## 🔒 Security Notes

- Never commit email credentials to git
- Use environment variables for sensitive data
- Consider rate limiting for production
- Monitor email usage and costs

## 📞 Support

If you encounter issues:
1. Check the console logs
2. Verify configuration files
3. Test with different email addresses
4. Check email provider documentation