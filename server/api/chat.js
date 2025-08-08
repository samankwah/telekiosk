// Chat API endpoint for TeleKiosk AI Assistant
import OpenAI from 'openai';
import { HEALTHCARE_SYSTEM_PROMPT } from '../../src/components/chatbot/HealthcarePrompts.js';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Ensure system prompt is included
    const messagesWithSystem = [
      { role: 'system', content: HEALTHCARE_SYSTEM_PROMPT },
      ...messages.filter(msg => msg.role !== 'system')
    ];

    // Create chat completion
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messagesWithSystem,
      temperature: 0.3,
      max_tokens: 2000,
      stream: true
    });

    // Set up Server-Sent Events
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type'
    });

    // Stream the response
    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(content);
      }
    }

    res.end();

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Handle different types of errors
    if (error.code === 'rate_limit_exceeded') {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please try again in a moment.' 
      });
    } else if (error.code === 'invalid_api_key') {
      return res.status(401).json({ 
        error: 'Invalid API configuration.' 
      });
    } else {
      return res.status(500).json({ 
        error: 'An error occurred while processing your request.' 
      });
    }
  }
}