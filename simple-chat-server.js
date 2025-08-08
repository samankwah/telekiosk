#!/usr/bin/env node
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3004;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY
});

console.log('🗝️ OpenAI API Key configured:', process.env.OPENAI_API_KEY ? 'Yes' : 'No');

// Healthcare system prompt
const HEALTHCARE_PROMPT = `You are TeleKiosk AI Assistant, a helpful healthcare chatbot for TeleKiosk Hospital in Ghana. 

Key Information:
- Hospital Contact: +233-599-211-311
- Email: info@telekiosk.com 
- Emergency: Call 999 or 193
- Services: Cardiology, Pediatrics, Dermatology, Neurology, Orthopedics, Emergency Medicine
- Location: Liberation Road, Airport Residential Area, Accra, Ghana

Guidelines:
- Be helpful, professional, and empathetic
- Provide accurate medical guidance
- Always recommend consulting healthcare professionals for serious issues
- Help with appointment booking and hospital information
- Respond in a friendly, caring manner`;

// Simple chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ 
        error: 'Invalid request: messages array is required' 
      });
    }

    console.log('📨 Chat request received, messages:', messages.length);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: HEALTHCARE_PROMPT },
        ...messages.filter(msg => msg.role !== 'system')
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const assistantMessage = response.choices[0].message.content;
    
    console.log('✅ OpenAI response received');

    return res.status(200).json({
      message: assistantMessage,
      usage: response.usage,
      responseTime: Date.now()
    });

  } catch (error) {
    console.error('❌ Chat API error:', error.message);
    
    if (error.status === 401) {
      return res.status(500).json({
        error: 'AI service authentication failed. Please contact hospital IT support.'
      });
    }
    
    return res.status(500).json({
      error: 'I\'m experiencing technical difficulties. Please try again or speak with a hospital staff member for assistance.'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'TeleKiosk Chat API',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TeleKiosk Chat Server running on http://localhost:${PORT}`);
  console.log(`📧 Health check: http://localhost:${PORT}/api/health`);
});