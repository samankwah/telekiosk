#!/usr/bin/env node
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    console.log('📨 Received chat request:', req.body);
    
    const { messages, ...options } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ 
        error: 'Invalid request: messages array is required' 
      });
    }

    // Import OpenAI service dynamically
    console.log('📦 Importing OpenAI service...');
    const { generateChatCompletion } = await import('./src/services/openaiService.js');

    console.log('🔄 Calling generateChatCompletion...');
    // Generate response using OpenAI service
    const result = await generateChatCompletion(messages, {
      allowFunctions: true,
      ...options
    });

    console.log('📤 OpenAI result:', result);

    if (result.success) {
      return res.status(200).json({
        message: result.message,
        usage: result.usage,
        responseTime: result.responseTime,
        functionResult: result.functionResult
      });
    } else {
      return res.status(500).json({
        error: result.error || 'Failed to generate response'
      });
    }

  } catch (error) {
    console.error('❌ Chat API error:', error);
    return res.status(500).json({
      error: 'Internal server error: ' + error.message
    });
  }
});

// Start test server
const PORT = 3003;
app.listen(PORT, () => {
  console.log(`🧪 Test server running on http://localhost:${PORT}`);
});