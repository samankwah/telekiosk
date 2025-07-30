// Advanced AI Router - Routes requests to appropriate AI models
// Supports GPT-4o, Claude Sonnet, Gemini Pro, and local models

import { getEnvVar } from '../utils/envUtils.js';

class AdvancedAIRouter {
  constructor() {
    this.models = {
      'gpt-4o': {
        name: 'GPT-4o',
        provider: 'openai',
        capabilities: ['text', 'vision', 'code', 'analysis'],
        cost: 0.03,
        speed: 'fast',
        quality: 'excellent'
      },
      'claude-sonnet': {
        name: 'Claude Sonnet',
        provider: 'anthropic',
        capabilities: ['text', 'analysis', 'reasoning', 'code'],
        cost: 0.015,
        speed: 'medium',
        quality: 'excellent'
      },
      'gemini-pro': {
        name: 'Gemini Pro',
        provider: 'google',
        capabilities: ['text', 'vision', 'multimodal'],
        cost: 0.001,
        speed: 'fast',
        quality: 'good'
      }
    };
    
    this.routingRules = {
      'medical_analysis': ['claude-sonnet', 'gpt-4o'],
      'image_analysis': ['gpt-4o', 'gemini-pro'],
      'general_chat': ['gemini-pro', 'claude-sonnet'],
      'code_generation': ['gpt-4o', 'claude-sonnet'],
      'emergency': ['gpt-4o'],
      'multilingual': ['gpt-4o', 'gemini-pro']
    };

    this.initializeClients();
  }

  async initializeClients() {
    try {
      // OpenAI Client
      if (getEnvVar('OPENAI_API_KEY')) {
        const { OpenAI } = await import('openai');
        this.openaiClient = new OpenAI({
          apiKey: getEnvVar('OPENAI_API_KEY'),
          dangerouslyAllowBrowser: true
        });
      }

      // Anthropic Client
      if (getEnvVar('ANTHROPIC_API_KEY')) {
        const { Anthropic } = await import('@anthropic-ai/sdk');
        this.anthropicClient = new Anthropic({
          apiKey: getEnvVar('ANTHROPIC_API_KEY'),
          dangerouslyAllowBrowser: true
        });
      }

      // Google Generative AI Client
      if (getEnvVar('GEMINI_API_KEY')) {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        this.geminiClient = new GoogleGenerativeAI(getEnvVar('GEMINI_API_KEY'));
      }

      console.log('✅ Advanced AI Router initialized with multiple models');
    } catch (error) {
      console.error('❌ Failed to initialize AI clients:', error);
    }
  }

  /**
   * Route request to best AI model based on intent and requirements
   */
  async routeRequest(message, options = {}) {
    try {
      const {
        intent = 'general_chat',
        priority = 'balanced',
        hasImages = false,
        language = 'en-GH',
        emergencyLevel = 'normal'
      } = options;

      // Determine best model for the request
      const selectedModel = this.selectOptimalModel(intent, {
        priority,
        hasImages,
        language,
        emergencyLevel
      });

      console.log(`🤖 Routing to ${selectedModel} for intent: ${intent}`);

      // Route to appropriate model
      switch (selectedModel) {
        case 'gpt-4o':
          return await this.processWithGPT4o(message, options);
        case 'claude-sonnet':
          return await this.processWithClaude(message, options);
        case 'gemini-pro':
          return await this.processWithGemini(message, options);
        default:
          throw new Error(`Unknown model: ${selectedModel}`);
      }

    } catch (error) {
      console.error('❌ AI routing failed:', error);
      // Fallback to simple response
      return this.getFallbackResponse(message, options);
    }
  }

  /**
   * Select optimal model based on requirements
   */
  selectOptimalModel(intent, requirements) {
    const { priority, hasImages, emergencyLevel } = requirements;

    // Emergency priority - use best model
    if (emergencyLevel === 'high') {
      return 'gpt-4o';
    }

    // Image analysis requires vision capability
    if (hasImages) {
      return this.openaiClient ? 'gpt-4o' : 'gemini-pro';
    }

    // Get preferred models for intent
    const preferredModels = this.routingRules[intent] || ['gemini-pro'];

    // Select based on priority and availability
    for (const model of preferredModels) {
      if (this.isModelAvailable(model)) {
        // Consider cost optimization
        if (priority === 'cost') {
          return model === 'gemini-pro' ? 'gemini-pro' : 
                 model === 'claude-sonnet' ? 'claude-sonnet' : 'gpt-4o';
        }
        return model;
      }
    }

    // Fallback to first available model
    return this.getFirstAvailableModel();
  }

  /**
   * Process with GPT-4o
   */
  async processWithGPT4o(message, options = {}) {
    if (!this.openaiClient) {
      throw new Error('OpenAI client not available');
    }

    const { hasImages, images = [], systemPrompt, maxTokens = 1000 } = options;

    try {
      const messages = [
        {
          role: 'system',
          content: systemPrompt || this.getSystemPrompt('medical_assistant', options.language)
        },
        {
          role: 'user',
          content: hasImages ? [
            { type: 'text', text: message },
            ...images.map(img => ({
              type: 'image_url',
              image_url: { url: img }
            }))
          ] : message
        }
      ];

      const response = await this.openaiClient.chat.completions.create({
        model: 'gpt-4o',
        messages,
        max_tokens: maxTokens,
        temperature: 0.7
      });

      return {
        success: true,
        response: response.choices[0].message.content,
        model: 'gpt-4o',
        usage: response.usage,
        metadata: {
          provider: 'openai',
          hasVision: hasImages,
          language: options.language
        }
      };

    } catch (error) {
      console.error('❌ GPT-4o processing failed:', error);
      throw error;
    }
  }

  /**
   * Process with Claude Sonnet
   */
  async processWithClaude(message, options = {}) {
    if (!this.anthropicClient) {
      throw new Error('Anthropic client not available');
    }

    const { systemPrompt, maxTokens = 1000 } = options;

    try {
      const response = await this.anthropicClient.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: maxTokens,
        system: systemPrompt || this.getSystemPrompt('medical_assistant', options.language),
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      });

      return {
        success: true,
        response: response.content[0].text,
        model: 'claude-sonnet',
        usage: response.usage,
        metadata: {
          provider: 'anthropic',
          language: options.language
        }
      };

    } catch (error) {
      console.error('❌ Claude processing failed:', error);
      throw error;
    }
  }

  /**
   * Process with Gemini Pro
   */
  async processWithGemini(message, options = {}) {
    if (!this.geminiClient) {
      throw new Error('Gemini client not available');
    }

    const { hasImages, images = [] } = options;

    try {
      const model = this.geminiClient.getGenerativeModel({ 
        model: hasImages ? 'gemini-pro-vision' : 'gemini-pro' 
      });

      let prompt = message;
      if (hasImages && images.length > 0) {
        // Handle image inputs for Gemini
        const imageParts = await Promise.all(
          images.map(async (imageUrl) => {
            const response = await fetch(imageUrl);
            const buffer = await response.arrayBuffer();
            return {
              inlineData: {
                data: Buffer.from(buffer).toString('base64'),
                mimeType: response.headers.get('content-type') || 'image/jpeg'
              }
            };
          })
        );
        prompt = [message, ...imageParts];
      }

      const result = await model.generateContent(prompt);
      const response = await result.response;

      return {
        success: true,
        response: response.text(),
        model: 'gemini-pro',
        metadata: {
          provider: 'google',
          hasVision: hasImages,
          language: options.language
        }
      };

    } catch (error) {
      console.error('❌ Gemini processing failed:', error);
      throw error;
    }
  }

  /**
   * Get system prompt for different contexts
   */
  getSystemPrompt(context, language = 'en-GH') {
    const prompts = {
      'medical_assistant': {
        'en-GH': `You are a professional medical AI assistant for TeleKiosk Hospital in Ghana. 
        
Your responsibilities:
- Provide accurate medical information and health guidance
- Help patients understand symptoms and conditions
- Assist with appointment booking and hospital services
- Provide emergency guidance when needed
- Communicate in Ghanaian English and local languages when requested
- Always recommend consulting healthcare professionals for serious concerns
- Be culturally sensitive to Ghanaian healthcare practices

Important guidelines:
- Never provide specific diagnoses or prescribe medications
- Always emphasize the importance of professional medical consultation
- Be aware of common health issues in Ghana (malaria, hypertension, diabetes)
- Respect traditional healing practices while promoting modern medicine
- Use clear, accessible language appropriate for all education levels`,

        'tw-GH': `Wo yɛ ayaresa AI boafo ma TeleKiosk Ayaresabea wɔ Ghana.
        
Wo dwuma ne sɛ:
- Wo de ayaresa ho nsɛm pa ma
- Wo boa ayarefo sɛ wɔnte yadeɛ ho nsɛm ase
- Wo boa wɔ appointment booking ne ayaresabea dwuma ho
- Wo ma ntɛm akwahosan akwankyerɛ
- Wo ka Borɔfo ne Ghana kasa
- Wobɛka sɛ wɔnkɔ ayaresafo nkyɛn wɔ nsɛm a ɛyɛ den ho`
      }
    };

    return prompts[context]?.[language] || prompts[context]['en-GH'] || 
           'You are a helpful AI assistant for TeleKiosk Hospital in Ghana.';
  }

  /**
   * Check if model is available
   */
  isModelAvailable(modelId) {
    switch (modelId) {
      case 'gpt-4o':
        return !!this.openaiClient;
      case 'claude-sonnet':
        return !!this.anthropicClient;
      case 'gemini-pro':
        return !!this.geminiClient;
      default:
        return false;
    }
  }

  /**
   * Get first available model
   */
  getFirstAvailableModel() {
    if (this.geminiClient) return 'gemini-pro';
    if (this.anthropicClient) return 'claude-sonnet';
    if (this.openaiClient) return 'gpt-4o';
    throw new Error('No AI models available');
  }

  /**
   * Get fallback response when AI routing fails
   */
  getFallbackResponse(message, options = {}) {
    const language = options.language || 'en-GH';
    
    const fallbackResponses = {
      'en-GH': "I apologize, but I'm experiencing technical difficulties. Please try again in a moment, or contact our staff directly for immediate assistance.",
      'tw-GH': "Mepa wo kyɛw, mewɔ mfiri mu haw kakra. Yɛ sɛ wosɔ hwɛ bio anaa frɛ yɛn adwumayɛfo ma wɔaboa wo ntɛm."
    };

    return {
      success: false,
      response: fallbackResponses[language] || fallbackResponses['en-GH'],
      model: 'fallback',
      error: 'AI routing failed',
      metadata: {
        fallback: true,
        language
      }
    };
  }

  /**
   * Route streaming request to appropriate AI model
   */
  async routeStreamingRequest(message, options = {}) {
    try {
      const {
        intent = 'general_chat',
        priority = 'balanced',
        language = 'en-GH',
        abortSignal
      } = options;

      // Select model for streaming (prioritize speed)
      const selectedModel = priority === 'speed' 
        ? this.getFirstAvailableModel() 
        : this.selectModel(intent, { priority, hasImages: false });

      if (!this.isModelAvailable(selectedModel)) {
        throw new Error(`Selected model ${selectedModel} not available`);
      }

      // Only OpenAI supports streaming in this implementation
      if (selectedModel === 'gpt-4o' && this.openaiClient) {
        return await this.streamWithOpenAI(message, { ...options, abortSignal });
      }

      // Fallback to non-streaming for other models
      const response = await this.routeRequest(message, options);
      return {
        success: response.success,
        response: response.response,
        model: response.model,
        stream: null,
        metadata: { ...response.metadata, streaming: false }
      };

    } catch (error) {
      console.error('❌ Streaming routing failed:', error);
      return {
        success: false,
        error: error.message,
        model: 'none',
        stream: null
      };
    }
  }

  /**
   * Stream with OpenAI GPT-4o
   */
  async streamWithOpenAI(message, options = {}) {
    if (!this.openaiClient) {
      throw new Error('OpenAI client not available');
    }

    try {
      const { language = 'en-GH', abortSignal } = options;
      
      const stream = await this.openaiClient.chat.completions.create({
        model: 'gpt-4o-mini', // Use mini for faster streaming
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt('medical_assistant', language)
          },
          {
            role: 'user',
            content: message
          }
        ],
        stream: true,
        max_tokens: 1500,
        temperature: 0.7
      }, {
        signal: abortSignal
      });

      return {
        success: true,
        stream: stream,
        model: 'gpt-4o-mini',
        metadata: {
          provider: 'openai',
          streaming: true,
          language
        }
      };

    } catch (error) {
      console.error('❌ OpenAI streaming failed:', error);
      throw error;
    }
  }

  /**
   * Get model statistics
   */
  getModelStats() {
    return {
      availableModels: Object.keys(this.models).filter(id => this.isModelAvailable(id)),
      totalModels: Object.keys(this.models).length,
      routingRules: Object.keys(this.routingRules).length,
      capabilities: {
        vision: this.isModelAvailable('gpt-4o') || this.isModelAvailable('gemini-pro'),
        multimodal: this.isModelAvailable('gemini-pro'),
        reasoning: this.isModelAvailable('claude-sonnet'),
        coding: this.isModelAvailable('gpt-4o') || this.isModelAvailable('claude-sonnet'),
        streaming: this.isModelAvailable('gpt-4o')
      }
    };
  }
}

// Create and export singleton instance
export const advancedAIRouter = new AdvancedAIRouter();
export default advancedAIRouter;