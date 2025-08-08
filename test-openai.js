#!/usr/bin/env node
import dotenv from 'dotenv';
import { generateChatCompletion } from './src/services/openaiService.js';

// Load environment variables
dotenv.config();

console.log('🧪 Testing OpenAI Service...');

const testMessages = [
  { role: 'user', content: 'Hello, I need help with a medical appointment' }
];

try {
  const result = await generateChatCompletion(testMessages);
  console.log('✅ OpenAI Service Test Result:', result);
} catch (error) {
  console.error('❌ OpenAI Service Test Failed:', error.message);
  console.error('Stack:', error.stack);
}