# Resend Email Service Setup Guide for TeleKiosk

This guide will help you configure Resend email service for your TeleKiosk booking system.

## Prerequisites

1. ✅ **Resend API Key**: `re_SesZDBJ9_7f3RPpVE1JyfNXBZJUTfHkEW` (Already configured)
2. ✅ **Backend Server**: Created to handle Resend API calls (avoids CORS issues)
3. ✅ **Admin Email**: `albertnartey824@gmail.com` (Already configured)

## Quick Start (Ready to Use!)

Your email service is already configured! Just follow these steps:

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Both Servers
```bash
# Option A: Start both servers simultaneously
npm run dev:full

# Option B: Start them separately (in different terminals)
# Terminal 1: Start the email server
npm run server

# Terminal 2: Start the React app
npm run dev
```

### Step 3: Test the System
1. Open `http://localhost:5173` in your browser
2. Book a test appointment
3. Check both:
   - Patient's email inbox (for confirmation)
   - `albertnartey824@gmail.com` (for admin notification)

## Step 3: Domain Verification (Recommended)

### Option A: Use Your Own Domain (Recommended)
1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `telekiosk.com`)
4. Add the required DNS records to your domain provider
5. Wait for verification
6. Update `fromEmail` in the config to use your domain:
   ```javascript
   fromEmail: 'TeleKiosk Hospital <noreply@telekiosk.com>'
   ```

### Option B: Use Resend's Default Domain (For Testing)
- Keep the default setup, but emails may go to spam
- Only use this for development/testing

## Step 4: Environment Variables (Recommended for Production)

For security, store your API key in environment variables:

1. Create a `.env` file in your project root:
```bash
VITE_RESEND_API_KEY=re_your_actual_api_key_here
VITE_FROM_EMAIL=TeleKiosk Hospital <noreply@yourdomain.com>
```

2. Update `resendEmailService.js` to use environment variables:
```javascript
const RESEND_CONFIG = {
  apiKey: import.meta.env.VITE_RESEND_API_KEY || 'YOUR_RESEND_API_KEY_HERE',
  apiUrl: 'https://api.resend.com/emails',
  fromEmail: import.meta.env.VITE_FROM_EMAIL || 'TeleKiosk Hospital <noreply@yourdomain.com>',
  hospitalAdminEmail: 'albertnartey824@gmail.com'
};
```

3. Add `.env` to your `.gitignore` file to keep secrets safe

## Step 5: Test the Email Service

1. Start your development server
2. Book a test appointment
3. Check that emails are sent to both:
   - The patient's email address
   - `albertnartey824@gmail.com` (admin)

## Step 6: Monitor Email Delivery

1. In Resend dashboard, go to **Logs**
2. Monitor email delivery status
3. Check for any failed emails and resolve issues

## Pricing Information

- **Free Tier**: 3,000 emails/month, 100 emails/day
- **Pro Plan**: $20/month for 50,000 emails/month
- **Business Plan**: $80/month for 200,000 emails/month

For a hospital booking system, the free tier should be sufficient initially.

## Troubleshooting

### Common Issues:

1. **API Key Error**: Ensure your API key is correct and starts with `re_`
2. **Domain Not Verified**: Verify your domain in Resend dashboard
3. **Emails Going to Spam**: Use a verified domain and proper email authentication
4. **Rate Limiting**: Don't exceed the API rate limits (check Resend docs)

### Error Handling:

The service includes built-in error handling that will:
- Log detailed error messages to console
- Return success/failure status
- Attempt to send both patient and admin emails independently

### Testing:

You can test individual email functions:

```javascript
import { sendBookingConfirmationEmails } from './services/resendEmailService.js';

// Test data
const testBookingData = {
  patientName: 'John Doe',
  patientEmail: 'john@example.com',
  date: '2025-07-26',
  time: '10:00 AM',
  doctor: 1,
  specialty: 'cardiology'
};

const testMeetingInfo = {
  meetingLink: 'https://meet.google.com/test-link',
  meetingId: 'test-123',
  calendarUrl: 'https://calendar.google.com/test'
};

// Send test emails
sendBookingConfirmationEmails(testBookingData, testMeetingInfo)
  .then(result => console.log('Email result:', result))
  .catch(error => console.error('Email error:', error));
```

## Email Templates

The service includes two professionally designed email templates:

### Patient Email Template:
- Confirmation message with appointment details
- Meeting join link and calendar integration
- Preparation instructions
- Professional TeleKiosk branding

### Admin Email Template:
- New appointment notification for hospital staff
- Patient contact information
- Meeting details for internal use
- Action items checklist

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for sensitive data
3. **Regularly rotate API keys**
4. **Monitor email logs** for suspicious activity
5. **Validate all input data** before sending emails

## Support

- Resend Documentation: [https://resend.com/docs](https://resend.com/docs)
- Resend Support: [https://resend.com/support](https://resend.com/support)
- TeleKiosk Email Service Code: `src/services/resendEmailService.js`

---

**Note**: This implementation replaces the previous EmailJS system with a more reliable and professional email service suitable for production use in a hospital environment.