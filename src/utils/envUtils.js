/**
 * Environment Utilities
 * Provides consistent environment variable access across browser and server
 */

/**
 * Get environment variable value
 * Supports both Node.js (process.env) and Vite (import.meta.env) environments
 */
export function getEnvVar(key) {
  // In browser with Vite, try VITE_ prefixed version first
  if (typeof window !== 'undefined') {
    try {
      const viteKey = key.startsWith('VITE_') ? key : `VITE_${key}`;
      return import.meta.env[viteKey] || import.meta.env[key];
    } catch (error) {
      console.warn('Could not access import.meta.env:', error);
    }
  }
  
  // Fallback to process.env for Node.js environments
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  
  return undefined;
}

/**
 * Check if we're in browser environment
 */
export function isBrowser() {
  return typeof window !== 'undefined';
}

/**
 * Check if we're in Node.js environment
 */
export function isNode() {
  return typeof process !== 'undefined' && process.versions?.node;
}

/**
 * Get API keys with proper fallbacks
 */
export function getAPIKeys() {
  return {
    openai: getEnvVar('OPENAI_API_KEY'),
    pinecone: getEnvVar('PINECONE_API_KEY'),
    elevenlabs: getEnvVar('ELEVENLABS_API_KEY'),
    anthropic: getEnvVar('ANTHROPIC_API_KEY'),
    gemini: getEnvVar('GEMINI_API_KEY')
  };
}

/**
 * Get configuration values
 */
export function getConfig() {
  return {
    enableMultimodal: getEnvVar('ENABLE_MULTIMODAL') !== 'false',
    nodeEnv: getEnvVar('NODE_ENV') || 'development',
    videoServerPort: getEnvVar('VIDEO_SERVER_PORT') || '3002',
    telehealthServerPort: getEnvVar('TELEHEALTH_SERVER_PORT') || '3003'
  };
}

export default {
  getEnvVar,
  isBrowser,
  isNode,
  getAPIKeys,
  getConfig
};