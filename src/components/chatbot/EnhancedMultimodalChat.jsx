// Enhanced Multimodal Chat Interface
// Supports text, image, audio, and video interactions

import { useState, useRef, useEffect } from 'react';
import { useEnhancedChatbot } from '../../contexts/EnhancedChatbotContext';
import { multimodalService } from '../../services/multimodalService';
import EnhancedChatMessage from './EnhancedChatMessage';

function EnhancedMultimodalChat() {
  const { state, addMessage, clearMessages } = useEnhancedChatbot();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [recordingAudio, setRecordingAudio] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputText.trim() && uploadedFiles.length === 0) return;
    
    setIsLoading(true);
    
    try {
      // Add user message to chat
      const userMessage = {
        text: inputText,
        files: uploadedFiles,
        timestamp: new Date().toISOString()
      };
      
      addMessage(inputText || '[Media uploaded]', 'user', 'multimodal', {
        files: uploadedFiles
      });

      // Prepare multimodal input
      const multimodalInput = {
        text: inputText,
        images: uploadedFiles.filter(file => file.type.startsWith('image/')),
        audio: uploadedFiles.find(file => file.type.startsWith('audio/')),
        video: uploadedFiles.find(file => file.type.startsWith('video/')),
        intent: 'general_analysis',
        language: state.selectedLanguage || 'en-GH',
        priority: 'balanced'
      };

      // Process through multimodal service
      const response = await multimodalService.processMultimodalInput(multimodalInput);
      
      if (response.success) {
        addMessage(response.response, 'bot', 'multimodal', {
          metadata: response.metadata,
          aiModel: response.metadata?.aiModel
        });
      } else {
        addMessage(
          response.fallbackResponse || 'Sorry, I encountered an error processing your request.',
          'bot',
          'error'
        );
      }
      
    } catch (error) {
      console.error('❌ Multimodal chat error:', error);
      addMessage(
        'I apologize, but I encountered an error. Please try again.',
        'bot',
        'error'
      );
    } finally {
      setIsLoading(false);
      setInputText('');
      setUploadedFiles([]);
    }
  };

  const handleFileUpload = (files) => {
    const validFiles = Array.from(files).filter(file => {
      const isValid = file.type.startsWith('image/') || 
                     file.type.startsWith('audio/') || 
                     file.type.startsWith('video/');
      return isValid && file.size <= 50 * 1024 * 1024; // 50MB limit
    });
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const file = new File([blob], 'recording.webm', { type: 'audio/webm' });
        setUploadedFiles(prev => [...prev, file]);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecordingAudio(true);
    } catch (error) {
      console.error('❌ Recording failed:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setMediaRecorder(null);
      setRecordingAudio(false);
    }
  };

  const getFileTypeIcon = (file) => {
    if (file.type.startsWith('image/')) return '🖼️';
    if (file.type.startsWith('audio/')) return '🎵';
    if (file.type.startsWith('video/')) return '🎥';
    return '📎';
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat Messages */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Drag overlay */}
        {dragActive && (
          <div className="absolute inset-0 bg-blue-500/20 border-2 border-dashed border-blue-500 rounded-lg z-10 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📁</div>
              <div className="text-lg font-semibold text-blue-700">
                Drop your files here
              </div>
              <div className="text-sm text-blue-600">
                Images, audio, and video supported
              </div>
            </div>
          </div>
        )}

        {/* Welcome message */}
        {state.messages.length === 0 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Enhanced Multimodal Chat
            </h3>
            <p className="text-gray-600 text-sm">
              Send text, images, audio, or video for AI analysis
            </p>
            <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500">
              <span>📷 Image Analysis</span>
              <span>🎤 Audio Processing</span>
              <span>🎥 Video Analysis</span>
            </div>
          </div>
        )}

        {/* Messages */}
        {state.messages.map((message, index) => (
          <EnhancedChatMessage
            key={index}
            message={message}
            index={index}
          />
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center py-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              <span className="text-sm">Processing multimodal input...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* File Upload Area */}
      {uploadedFiles.length > 0 && (
        <div className="border-t bg-white p-3">
          <div className="text-xs text-gray-600 mb-2">Uploaded files:</div>
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                <span className="mr-2">{getFileTypeIcon(file)}</span>
                <span className="text-sm text-gray-700 truncate max-w-32">
                  {file.name}
                </span>
                <button
                  onClick={() => removeFile(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Text Input */}
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message, ask about uploaded media, or describe symptoms..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading || (!inputText.trim() && uploadedFiles.length === 0)}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-3 rounded-lg transition-colors duration-200"
            >
              {isLoading ? (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
                </svg>
              )}
            </button>
          </div>

          {/* Media Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* File Upload */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                title="Upload image, audio, or video"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
              </button>

              {/* Audio Recording */}
              <button
                type="button"
                onClick={recordingAudio ? stopRecording : startRecording}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  recordingAudio 
                    ? 'text-red-600 bg-red-50 animate-pulse' 
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                }`}
                title={recordingAudio ? 'Stop recording' : 'Record audio'}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  {recordingAudio ? (
                    <path d="M6,6H18V18H6V6Z" />
                  ) : (
                    <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
                  )}
                </svg>
              </button>

              {/* Clear Messages */}
              {state.messages.length > 0 && (
                <button
                  type="button"
                  onClick={clearMessages}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  title="Clear conversation"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                  </svg>
                </button>
              )}
            </div>

            <div className="text-xs text-gray-500">
              Supports: Images, Audio, Video (50MB max)
            </div>
          </div>
        </form>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,audio/*,video/*"
          onChange={(e) => handleFileUpload(e.target.files)}
          className="hidden"
        />
      </div>
    </div>
  );
}

export default EnhancedMultimodalChat;