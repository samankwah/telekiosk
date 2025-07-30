// Video Processing Service - Telemedicine video analysis and streaming
// Integrates with AI models for medical video assessment

import { advancedAIRouter } from './advancedAIRouter.js';
import { getEnvVar } from '../utils/envUtils.js';

class VideoProcessingService {
  constructor() {
    this.mediaStream = null;
    this.peerConnection = null;
    this.localVideo = null;
    this.remoteVideo = null;
    this.canvas = null;
    this.context = null;
    
    this.isRecording = false;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    
    this.analysisQueue = [];
    this.isAnalyzing = false;
    
    this.initializeVideoProcessing();
  }

  async initializeVideoProcessing() {
    try {
      console.log('📹 Initializing Video Processing Service...');
      
      // Initialize canvas for frame processing
      this.canvas = document.createElement('canvas');
      this.context = this.canvas.getContext('2d');
      
      // Set up WebRTC configuration
      this.rtcConfiguration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      };
      
      console.log('✅ Video Processing Service initialized');
    } catch (error) {
      console.error('❌ Video Processing initialization failed:', error);
    }
  }

  /**
   * Start video stream for telemedicine consultation
   */
  async startVideoStream(videoElement, options = {}) {
    try {
      console.log('🎥 Starting video stream...');
      
      const {
        video = { width: 1280, height: 720 },
        audio = true,
        facingMode = 'user'
      } = options;
      
      const constraints = {
        video: {
          ...video,
          facingMode
        },
        audio
      };
      
      this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoElement) {
        videoElement.srcObject = this.mediaStream;
        this.localVideo = videoElement;
        
        // Start real-time analysis if enabled
        if (options.enableAnalysis) {
          this.startRealTimeAnalysis();
        }
      }
      
      console.log('✅ Video stream started');
      return {
        success: true,
        stream: this.mediaStream,
        tracks: this.mediaStream.getTracks().map(track => ({
          kind: track.kind,
          enabled: track.enabled,
          settings: track.getSettings()
        }))
      };
      
    } catch (error) {
      console.error('❌ Failed to start video stream:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Stop video stream
   */
  stopVideoStream() {
    try {
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => {
          track.stop();
        });
        this.mediaStream = null;
      }
      
      if (this.localVideo) {
        this.localVideo.srcObject = null;
      }
      
      console.log('🛑 Video stream stopped');
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to stop video stream:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Start recording video for later analysis
   */
  async startRecording(options = {}) {
    try {
      if (!this.mediaStream) {
        throw new Error('No active media stream to record');
      }
      
      console.log('⏺️ Starting video recording...');
      
      const {
        mimeType = 'video/webm;codecs=vp9',
        videoBitsPerSecond = 2500000
      } = options;
      
      this.recordedChunks = [];
      
      this.mediaRecorder = new MediaRecorder(this.mediaStream, {
        mimeType,
        videoBitsPerSecond
      });
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };
      
      this.mediaRecorder.onstop = () => {
        console.log('🎬 Recording stopped');
        if (options.onStop) {
          const blob = new Blob(this.recordedChunks, { type: mimeType });
          options.onStop(blob);
        }
      };
      
      this.mediaRecorder.start(1000); // Collect data every second
      this.isRecording = true;
      
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to start recording:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Stop recording
   */
  stopRecording() {
    try {
      if (this.mediaRecorder && this.isRecording) {
        this.mediaRecorder.stop();
        this.isRecording = false;
        
        return {
          success: true,
          chunks: this.recordedChunks.length
        };
      }
      
      return { success: false, error: 'No active recording' };
    } catch (error) {
      console.error('❌ Failed to stop recording:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Analyze video frame for medical conditions
   */
  async analyzeVideoFrame(analysisType = 'general_health') {
    try {
      if (!this.localVideo || !this.mediaStream) {
        throw new Error('No active video stream for analysis');
      }
      
      console.log('🔍 Analyzing video frame...');
      
      // Capture current frame
      const frameData = this.captureCurrentFrame();
      
      // Prepare analysis request
      const analysisRequest = {
        image: frameData,
        analysisType,
        timestamp: Date.now(),
        metadata: {
          videoSettings: this.localVideo.videoWidth ? {
            width: this.localVideo.videoWidth,
            height: this.localVideo.videoHeight
          } : null
        }
      };
      
      // Route to AI for analysis
      const result = await advancedAIRouter.routeRequest(
        this.getAnalysisPrompt(analysisType),
        {
          intent: 'medical_image_analysis',
          hasImages: true,
          images: [frameData],
          priority: 'balanced',
          emergencyLevel: analysisType.includes('emergency') ? 'high' : 'normal'
        }
      );
      
      return {
        success: true,
        analysis: result.response,
        confidence: this.assessAnalysisConfidence(result),
        recommendations: this.generateRecommendations(result, analysisType),
        metadata: {
          model: result.model,
          timestamp: Date.now(),
          analysisType
        }
      };
      
    } catch (error) {
      console.error('❌ Video frame analysis failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Start real-time video analysis
   */
  startRealTimeAnalysis(options = {}) {
    try {
      const {
        interval = 5000, // Analyze every 5 seconds
        analysisTypes = ['general_health'],
        onAnalysis = null
      } = options;
      
      console.log('🔄 Starting real-time video analysis...');
      
      this.analysisInterval = setInterval(async () => {
        for (const analysisType of analysisTypes) {
          try {
            const result = await this.analyzeVideoFrame(analysisType);
            
            if (onAnalysis) {
              onAnalysis(result, analysisType);
            }
            
            // Check for emergency conditions
            if (this.detectEmergencyConditions(result)) {
              this.handleEmergencyDetection(result);
            }
            
          } catch (error) {
            console.error('❌ Real-time analysis error:', error);
          }
        }
      }, interval);
      
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to start real-time analysis:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Stop real-time analysis
   */
  stopRealTimeAnalysis() {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
      console.log('🛑 Real-time analysis stopped');
    }
  }

  /**
   * Capture current video frame as image
   */
  captureCurrentFrame() {
    try {
      if (!this.localVideo || !this.canvas) {
        throw new Error('Video or canvas not available');
      }
      
      // Set canvas dimensions to match video
      this.canvas.width = this.localVideo.videoWidth || 640;
      this.canvas.height = this.localVideo.videoHeight || 480;
      
      // Draw current video frame to canvas
      this.context.drawImage(this.localVideo, 0, 0, this.canvas.width, this.canvas.height);
      
      // Convert to data URL
      return this.canvas.toDataURL('image/jpeg', 0.8);
    } catch (error) {
      console.error('❌ Frame capture failed:', error);
      throw error;
    }
  }

  /**
   * Process recorded video for comprehensive analysis
   */
  async processRecordedVideo(videoBlob, options = {}) {
    try {
      console.log('🎞️ Processing recorded video...');
      
      const {
        extractFrames = true,
        frameInterval = 1000, // Extract frame every second
        analysisTypes = ['general_health', 'vital_signs']
      } = options;
      
      let frames = [];
      
      if (extractFrames) {
        frames = await this.extractFramesFromVideo(videoBlob, frameInterval);
      }
      
      const analysisResults = [];
      
      // Analyze each frame
      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        
        for (const analysisType of analysisTypes) {
          try {
            const result = await advancedAIRouter.routeRequest(
              this.getAnalysisPrompt(analysisType),
              {
                intent: 'medical_video_analysis',
                hasImages: true,
                images: [frame.dataUrl],
                priority: 'balanced'
              }
            );
            
            analysisResults.push({
              frameIndex: i,
              timestamp: frame.timestamp,
              analysisType,
              result: result.response,
              confidence: this.assessAnalysisConfidence(result)
            });
            
          } catch (error) {
            console.error(`❌ Frame ${i} analysis failed:`, error);
          }
        }
      }
      
      // Generate comprehensive report
      const report = this.generateVideoAnalysisReport(analysisResults, options);
      
      return {
        success: true,
        frames: frames.length,
        analysisResults,
        report,
        metadata: {
          processingTime: Date.now(),
          videoSize: videoBlob.size,
          analysisTypes
        }
      };
      
    } catch (error) {
      console.error('❌ Video processing failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Extract frames from video at specified intervals
   */
  async extractFramesFromVideo(videoBlob, interval = 1000) {
    return new Promise((resolve, reject) => {
      try {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const frames = [];
        
        video.src = URL.createObjectURL(videoBlob);
        
        video.onloadedmetadata = () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          const duration = video.duration * 1000; // Convert to milliseconds
          const frameCount = Math.floor(duration / interval);
          let currentFrame = 0;
          
          const extractFrame = () => {
            if (currentFrame >= frameCount) {
              URL.revokeObjectURL(video.src);
              resolve(frames);
              return;
            }
            
            const timestamp = currentFrame * interval;
            video.currentTime = timestamp / 1000;
            
            video.onseeked = () => {
              context.drawImage(video, 0, 0);
              const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
              
              frames.push({
                index: currentFrame,
                timestamp,
                dataUrl
              });
              
              currentFrame++;
              setTimeout(extractFrame, 100); // Small delay between extractions
            };
          };
          
          extractFrame();
        };
        
        video.onerror = (error) => {
          reject(new Error('Video loading failed: ' + error.message));
        };
        
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get analysis prompt for different medical assessments
   */
  getAnalysisPrompt(analysisType) {
    const prompts = {
      'general_health': `As a medical AI assistant, analyze this video frame for general health indicators. Look for:
        - Overall appearance and posture
        - Skin color and complexion
        - Eye clarity and alertness
        - Any visible distress or discomfort
        - General wellness indicators
        
        Provide observations without making diagnoses. Recommend professional consultation if needed.`,
      
      'vital_signs': `Analyze this video frame to estimate vital signs and physiological indicators:
        - Breathing patterns (if visible)
        - Skin color for circulation assessment
        - General alertness level
        - Any signs of distress or abnormal conditions
        
        Note: This is for preliminary assessment only. Professional measurement is required for accuracy.`,
      
      'skin_condition': `Examine this video frame for skin-related health indicators:
        - Skin color and texture
        - Any visible rashes, lesions, or abnormalities
        - Signs of jaundice, pallor, or cyanosis
        - Overall skin health appearance
        
        Provide observations for preliminary assessment. Professional dermatological consultation recommended for concerns.`,
      
      'emergency_assessment': `URGENT: Analyze this video frame for emergency medical conditions:
        - Signs of respiratory distress
        - Altered consciousness or awareness
        - Skin color indicating circulation issues
        - Any visible trauma or acute distress
        - Signs requiring immediate medical attention
        
        Flag any conditions that may require emergency care.`
    };
    
    return prompts[analysisType] || prompts['general_health'];
  }

  /**
   * Assess confidence level of AI analysis
   */
  assessAnalysisConfidence(result) {
    // Simple confidence assessment based on response characteristics
    const response = result.response.toLowerCase();
    
    if (response.includes('clearly') || response.includes('obvious')) {
      return 'high';
    } else if (response.includes('possible') || response.includes('may')) {
      return 'medium';
    } else if (response.includes('uncertain') || response.includes('unclear')) {
      return 'low';
    }
    
    return 'medium';
  }

  /**
   * Generate recommendations based on analysis
   */
  generateRecommendations(result, analysisType) {
    const recommendations = [];
    const response = result.response.toLowerCase();
    
    // Emergency recommendations
    if (response.includes('emergency') || response.includes('urgent')) {
      recommendations.push({
        priority: 'high',
        action: 'Seek immediate medical attention',
        reason: 'Potential emergency condition detected'
      });
    }
    
    // General recommendations
    if (analysisType === 'general_health') {
      recommendations.push({
        priority: 'medium',
        action: 'Schedule routine checkup',
        reason: 'Regular health monitoring recommended'
      });
    }
    
    return recommendations;
  }

  /**
   * Detect emergency conditions from analysis
   */
  detectEmergencyConditions(analysisResult) {
    if (!analysisResult.success) return false;
    
    const response = analysisResult.analysis.toLowerCase();
    const emergencyKeywords = [
      'emergency', 'urgent', 'critical', 'severe', 'acute',
      'distress', 'unconscious', 'breathing difficulty'
    ];
    
    return emergencyKeywords.some(keyword => response.includes(keyword));
  }

  /**
   * Handle emergency detection
   */
  handleEmergencyDetection(analysisResult) {
    console.log('🚨 EMERGENCY CONDITION DETECTED');
    
    // Trigger emergency protocols
    const emergencyData = {
      timestamp: Date.now(),
      analysis: analysisResult.analysis,
      confidence: analysisResult.confidence,
      recommendations: analysisResult.recommendations
    };
    
    // Emit emergency event
    window.dispatchEvent(new CustomEvent('medical-emergency-detected', {
      detail: emergencyData
    }));
  }

  /**
   * Generate comprehensive video analysis report
   */
  generateVideoAnalysisReport(analysisResults, options) {
    const report = {
      summary: {
        totalFrames: analysisResults.length,
        analysisTypes: [...new Set(analysisResults.map(r => r.analysisType))],
        overallConfidence: this.calculateOverallConfidence(analysisResults),
        emergencyFlags: analysisResults.filter(r => this.detectEmergencyConditions({ success: true, analysis: r.result })).length
      },
      findings: {},
      recommendations: [],
      timeline: []
    };
    
    // Group findings by analysis type
    const groupedResults = {};
    analysisResults.forEach(result => {
      if (!groupedResults[result.analysisType]) {
        groupedResults[result.analysisType] = [];
      }
      groupedResults[result.analysisType].push(result);
    });
    
    // Process each analysis type
    Object.entries(groupedResults).forEach(([type, results]) => {
      report.findings[type] = {
        frameCount: results.length,
        averageConfidence: results.reduce((sum, r) => sum + (r.confidence === 'high' ? 0.8 : r.confidence === 'medium' ? 0.6 : 0.4), 0) / results.length,
        keyFindings: results.slice(0, 3).map(r => r.result.substring(0, 200) + '...')
      };
    });
    
    return report;
  }

  calculateOverallConfidence(results) {
    const confidenceScores = results.map(r => 
      r.confidence === 'high' ? 0.8 : 
      r.confidence === 'medium' ? 0.6 : 0.4
    );
    
    const average = confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length;
    
    if (average > 0.7) return 'high';
    if (average > 0.5) return 'medium';
    return 'low';
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      initialized: true,
      hasActiveStream: !!this.mediaStream,
      isRecording: this.isRecording,
      isAnalyzing: this.isAnalyzing,
      capabilities: {
        videoStreaming: true,
        recording: true,
        frameAnalysis: true,
        realTimeAnalysis: true,
        emergencyDetection: true
      },
      mediaDevices: {
        video: this.localVideo ? {
          width: this.localVideo.videoWidth,
          height: this.localVideo.videoHeight
        } : null
      }
    };
  }
}

// Create and export singleton instance
export const videoProcessingService = new VideoProcessingService();
export default videoProcessingService;