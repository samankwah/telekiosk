/**
 * Email Configuration for TeleKiosk
 * Choose your preferred email service method
 */

// Email service configuration
export const EMAIL_CONFIG = {
  // Method: 'emailjs', 'api', 'mailto'
  method: "emailjs", // Change this to your preferred method

  // EmailJS Configuration (Frontend email service - easiest to setup)
  emailjs: {
    serviceId: "service_88832qb", // Replace with your EmailJS service ID
    templateId: "template_9zvkq4r", // Replace with your EmailJS template ID
    publicKey: "r2YblugnsYiYMsZAT", // Replace with your EmailJS public key
    scriptUrl:
      "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js",
  },

  // API Configuration (Backend required)
  api: {
    endpoint: "/api/send-email",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  },

  // SMTP Configuration (for backend implementation)
  smtp: {
    // Example for Gmail
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "your-email@gmail.com",
      pass: "your-app-password",
    },
  },
};

// Email service providers setup instructions
export const SETUP_INSTRUCTIONS = {
  emailjs: {
    title: "EmailJS Setup (Recommended for Frontend)",
    steps: [
      "1. Go to https://www.emailjs.com/ and create a free account",
      "2. Create a new email service (Gmail, Outlook, etc.)",
      "3. Create an email template with variables: {{to_email}}, {{subject}}, {{message_html}}",
      "4. Get your Service ID, Template ID, and Public Key",
      "5. Update the emailjs config above with your credentials",
      "6. Add EmailJS script to your HTML or install via npm",
    ],
    pros: ["No backend required", "Free tier available", "Easy setup"],
    cons: ["Limited monthly emails", "Client-side credentials visible"],
  },

  api: {
    title: "Backend API Setup (Most Secure)",
    steps: [
      "1. Create a backend API endpoint at /api/send-email",
      "2. Use a service like SendGrid, Mailgun, or Nodemailer",
      "3. Implement email sending logic in your backend",
      "4. Handle authentication and rate limiting",
      "5. Return success/error responses to frontend",
    ],
    pros: ["Most secure", "Unlimited emails", "Full control"],
    cons: ["Requires backend", "More complex setup"],
  },

  mailto: {
    title: "Mailto Fallback (Basic)",
    steps: [
      "1. Opens user's default email client",
      "2. Pre-fills email content",
      "3. User manually sends the email",
    ],
    pros: ["No setup required", "Always works"],
    cons: ["Manual process", "Poor user experience"],
  },
};

// Load EmailJS script dynamically
export const loadEmailJS = () => {
  return new Promise((resolve, reject) => {
    if (window.emailjs) {
      resolve(window.emailjs);
      return;
    }

    const script = document.createElement("script");
    script.src = EMAIL_CONFIG.emailjs.scriptUrl;
    script.onload = () => {
      window.emailjs.init(EMAIL_CONFIG.emailjs.publicKey);
      resolve(window.emailjs);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};
