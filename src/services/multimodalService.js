// Multimodal Service - Handles text, image, voice, and video inputs
// Integrates with advanced AI router for optimal processing

import { advancedAIRouter } from './advancedAIRouter.js';
import { getEnvVar } from '../utils/envUtils.js';

class MultimodalService {
  constructor() {
    this.supportedFormats = {
      images: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      audio: ['mp3', 'wav', 'ogg', 'webm'],
      video: ['mp4', 'webm', 'avi'],
      documents: ['pdf', 'txt', 'doc', 'docx']
    };
    
    this.processingQueue = [];
    this.isProcessing = false;
    
    this.initializeServices();
  }

  async initializeServices() {
    try {
      console.log('🎭 Initializing Multimodal Service...');
      
      // Initialize media processing capabilities
      this.mediaRecorder = null;
      this.canvas = null;
      this.videoElement = null;
      
      console.log('✅ Multimodal Service initialized');
    } catch (error) {
      console.error('❌ Multimodal Service initialization failed:', error);
    }
  }

  /**
   * Process multimodal input (text + images/audio/video)
   */
  async processMultimodalInput(input) {
    try {
      const {
        text = '',
        images = [],
        audio = null,
        video = null,
        intent = 'general_analysis',
        language = 'en-GH',
        priority = 'balanced'
      } = input;

      console.log('🎭 Processing multimodal input:', {
        hasText: !!text,
        imageCount: images.length,
        hasAudio: !!audio,
        hasVideo: !!video,
        intent
      });

      // Validate inputs
      const validation = await this.validateInputs(input);
      if (!validation.valid) {
        throw new Error(`Invalid input: ${validation.errors.join(', ')}`);
      }

      // Process different media types
      const processedMedia = await this.preprocessMedia({
        images,
        audio,
        video
      });

      // Route to appropriate AI model
      const aiResponse = await advancedAIRouter.routeRequest(text, {
        intent: this.determineIntent(text, processedMedia),
        hasImages: processedMedia.images.length > 0,
        images: processedMedia.images,
        language,
        priority,
        multimodalContext: {
          mediaTypes: this.getMediaTypes(processedMedia),
          complexity: this.assessComplexity(input)
        }
      });

      // Post-process response
      const enhancedResponse = await this.enhanceResponse(aiResponse, {
        originalInput: input,
        processedMedia,
        language
      });

      return {
        success: true,
        response: enhancedResponse,
        metadata: {
          processingTime: Date.now(),
          mediaProcessed: processedMedia.summary,
          aiModel: aiResponse.model,
          multimodal: true
        }
      };

    } catch (error) {
      console.error('❌ Multimodal processing failed:', error);
      return {
        success: false,
        error: error.message,
        fallbackResponse: this.getFallbackResponse(input.language)
      };
    }
  }

  /**
   * Validate multimodal inputs
   */
  async validateInputs(input) {
    const errors = [];
    const { images, audio, video } = input;

    // Validate images
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (!this.isValidImageFormat(img)) {
          errors.push(`Invalid image format at index ${i}`);
        }
        if (await this.getImageSize(img) > 10 * 1024 * 1024) { // 10MB limit
          errors.push(`Image at index ${i} exceeds size limit`);
        }
      }
    }

    // Validate audio
    if (audio) {
      if (!this.isValidAudioFormat(audio)) {
        errors.push('Invalid audio format');
      }
    }

    // Validate video
    if (video) {
      if (!this.isValidVideoFormat(video)) {
        errors.push('Invalid video format');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Preprocess media files for AI consumption
   */
  async preprocessMedia(media) {
    const processed = {
      images: [],
      audio: null,
      video: null,
      summary: {}
    };

    try {
      // Process images
      if (media.images && media.images.length > 0) {
        processed.images = await Promise.all(
          media.images.map(async (img) => {
            const processedImg = await this.processImage(img);
            return processedImg;
          })
        );
        processed.summary.images = processed.images.length;
      }

      // Process audio
      if (media.audio) {
        processed.audio = await this.processAudio(media.audio);
        processed.summary.audio = 'processed';
      }

      // Process video
      if (media.video) {
        processed.video = await this.processVideo(media.video);
        processed.summary.video = 'processed';
      }

      return processed;
    } catch (error) {
      console.error('❌ Media preprocessing failed:', error);
      throw error;
    }
  }

  /**
   * Process image for AI analysis
   */
  async processImage(imageInput) {
    try {
      // Handle different image input types
      let imageUrl;
      
      if (typeof imageInput === 'string') {
        // URL or base64
        imageUrl = imageInput;
      } else if (imageInput instanceof File) {
        // File object
        imageUrl = await this.fileToDataURL(imageInput);
      } else if (imageInput instanceof Blob) {
        // Blob object
        imageUrl = await this.blobToDataURL(imageInput);
      }

      // Optional: Resize if too large
      const resizedImage = await this.resizeImageIfNeeded(imageUrl);
      
      return resizedImage;
    } catch (error) {
      console.error('❌ Image processing failed:', error);
      throw error;
    }
  }

  /**
   * Process audio for analysis
   */
  async processAudio(audioInput) {
    try {
      // Convert audio to format suitable for analysis
      const audioData = await this.convertAudioFormat(audioInput);
      
      // Optional: Extract features or transcribe
      const features = await this.extractAudioFeatures(audioData);
      
      return {
        data: audioData,
        features,
        duration: features.duration,
        format: features.format
      };
    } catch (error) {
      console.error('❌ Audio processing failed:', error);
      throw error;
    }
  }

  /**
   * Process video for analysis
   */
  async processVideo(videoInput) {
    try {
      // Extract frames for visual analysis
      const frames = await this.extractVideoFrames(videoInput, 5); // Extract 5 key frames
      
      // Extract audio track
      const audioTrack = await this.extractAudioFromVideo(videoInput);
      
      // Get video metadata
      const metadata = await this.getVideoMetadata(videoInput);
      
      return {
        frames,
        audio: audioTrack,
        metadata,
        keyFrames: frames.length
      };
    } catch (error) {
      console.error('❌ Video processing failed:', error);
      throw error;
    }
  }

  /**
   * Determine intent from multimodal input
   */
  determineIntent(text, processedMedia) {
    const textLower = text.toLowerCase();
    
    // Medical image analysis
    if (processedMedia.images.length > 0) {
      if (textLower.includes('symptom') || textLower.includes('rash') || 
          textLower.includes('wound') || textLower.includes('scan')) {
        return 'medical_image_analysis';
      }
      return 'image_analysis';
    }
    
    // Audio analysis
    if (processedMedia.audio) {
      if (textLower.includes('cough') || textLower.includes('heartbeat') || 
          textLower.includes('breathing')) {
        return 'medical_audio_analysis';
      }
      return 'audio_analysis';
    }
    
    // Video analysis
    if (processedMedia.video) {
      return 'video_analysis';
    }
    
    // Text-based intents
    if (textLower.includes('emergency') || textLower.includes('urgent')) {
      return 'emergency';
    }
    
    if (textLower.includes('book') || textLower.includes('appointment')) {
      return 'booking';
    }
    
    return 'general_chat';
  }

  /**
   * Get media types present in processed media
   */
  getMediaTypes(processedMedia) {
    const types = [];
    if (processedMedia.images.length > 0) types.push('images');
    if (processedMedia.audio) types.push('audio');
    if (processedMedia.video) types.push('video');
    return types;
  }

  /**
   * Assess complexity of multimodal input
   */
  assessComplexity(input) {
    let complexity = 'simple';
    
    const mediaCount = (input.images?.length || 0) + 
                      (input.audio ? 1 : 0) + 
                      (input.video ? 1 : 0);
    
    if (mediaCount > 2) complexity = 'complex';
    else if (mediaCount > 0) complexity = 'moderate';
    
    if (input.text && input.text.length > 500) {
      complexity = complexity === 'simple' ? 'moderate' : 'complex';
    }
    
    return complexity;
  }

  /**
   * Enhance AI response with multimodal context
   */
  async enhanceResponse(aiResponse, context) {
    try {
      const { originalInput, processedMedia, language } = context;
      
      let enhancedResponse = aiResponse.response;
      
      // Add media analysis summary
      if (processedMedia.images.length > 0) {
        const imageContext = this.getImageAnalysisContext(processedMedia.images, language);
        enhancedResponse = `${imageContext}\n\n${enhancedResponse}`;
      }
      
      // Add audio analysis if present
      if (processedMedia.audio) {
        const audioContext = this.getAudioAnalysisContext(processedMedia.audio, language);
        enhancedResponse = `${audioContext}\n\n${enhancedResponse}`;
      }
      
      // Add disclaimer for medical content
      if (this.containsMedicalContent(originalInput.text)) {
        const disclaimer = this.getMedicalDisclaimer(language);
        enhancedResponse = `${enhancedResponse}\n\n${disclaimer}`;
      }
      
      return enhancedResponse;
    } catch (error) {
      console.error('❌ Response enhancement failed:', error);
      return aiResponse.response;
    }
  }

  /**
   * Utility functions
   */
  isValidImageFormat(image) {
    if (typeof image === 'string') {
      return image.startsWith('data:image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(image);
    }
    return image instanceof File || image instanceof Blob;
  }

  isValidAudioFormat(audio) {
    if (typeof audio === 'string') {
      return audio.startsWith('data:audio/') || /\.(mp3|wav|ogg|webm)$/i.test(audio);
    }
    return audio instanceof File || audio instanceof Blob;
  }

  isValidVideoFormat(video) {
    if (typeof video === 'string') {
      return video.startsWith('data:video/') || /\.(mp4|webm|avi)$/i.test(video);
    }
    return video instanceof File || video instanceof Blob;
  }

  async fileToDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  containsMedicalContent(text) {
    const medicalKeywords = [
      'symptom', 'diagnosis', 'treatment', 'medicine', 'drug', 'prescription',
      'pain', 'fever', 'cough', 'rash', 'wound', 'injury', 'disease',
      'yadeɛ', 'aduru', 'ayaresa', 'huraeɛ'
    ];
    
    return medicalKeywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  getMedicalDisclaimer(language = 'en-GH') {
    const disclaimers = {
      'en-GH': '⚠️ **Medical Disclaimer**: This AI analysis is for informational purposes only and should not replace professional medical advice. Please consult with a qualified healthcare provider for proper diagnosis and treatment.',
      'tw-GH': '⚠️ **Ayaresa ho Kɔkɔbɔ**: Saa AI nhwehwɛmu yi yɛ nsɛm a wɔde kyerɛkyerɛ mu nko ara na ɛnsi odiyifo ayaresa akwankyerɛ ananmu. Yɛ sɛ wo kɔ odiyifo nkyɛn kɔgye ayaresa akwankyerɛ.'
    };
    
    return disclaimers[language] || disclaimers['en-GH'];
  }

  getFallbackResponse(language = 'en-GH') {
    const responses = {
      'en-GH': "I apologize, but I'm having difficulty processing your multimodal input. Please try again or contact our support team.",
      'tw-GH': "Mepa wo kyɛw, menwɔ mfir mu haw wɔ wo nsɛm a ɛka bɔ mu ho. Yɛ sɛ wosɔ hwɛ bio."
    };
    
    return responses[language] || responses['en-GH'];
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      initialized: true,
      supportedFormats: this.supportedFormats,
      processingQueue: this.processingQueue.length,
      isProcessing: this.isProcessing,
      capabilities: {
        imageAnalysis: true,
        audioProcessing: true,
        videoProcessing: true,
        multimodalFusion: true
      }
    };
  }
}

// Create and export singleton instance
export const multimodalService = new MultimodalService();
export default multimodalService;