import React, { useState, useEffect, useRef } from 'react';
import { Send, Calendar, DollarSign, Search, Phone, HelpCircle, TrendingUp, X, Mic, Minimize2, RotateCcw, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TeleKioskInterface = ({ onMinimize, onClose, isMinimized }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isContinuousVoiceMode, setIsContinuousVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [bookingStep, setBookingStep] = useState(null);
  const [bookingData, setBookingData] = useState({});
  const lastMessageRef = useRef(null);

  // Hospital contact numbers
  const HOSPITAL_CONTACTS = {
    emergency: '999', // Ghana emergency number
    reception: '+233501234567', // Hospital main line
    appointments: '+233501234568', // Appointments line
    information: '+233501234569' // Information line
  };

  // Call functionality
  const makeCall = (number, type = 'general') => {
    if (number) {
      // For mobile devices, use tel: protocol
      window.location.href = `tel:${number}`;
      
      // Track the call attempt
      try {
        // Analytics tracking would go here
        console.log(`Call initiated: ${type} - ${number}`);
      } catch (error) {
        console.error('Analytics tracking failed:', error);
      }
    }
  };


  // Continuous Voice Conversation Mode (like Siri/Alexa)
  const toggleContinuousVoiceMode = () => {
    const newMode = !isContinuousVoiceMode;
    setIsContinuousVoiceMode(newMode);
    
    if (newMode) {
      // Enable voice mode and auto-speaking  
      setShowQuickActions(false);
      
      // Add welcome message for voice mode
      const welcomeMessage = {
        role: 'assistant',
        content: 'Voice conversation mode activated. I\'m listening - you can start talking to me now!',
        timestamp: Date.now(),
        shouldSpeak: true
      };
      setMessages([welcomeMessage]);
      
      // Voice recognition will start automatically in useEffect
    } else {
      // Disable continuous mode
      setShowQuickActions(true);
      stopSpeaking();
    }
  };


  // Enhanced voice transcription handler for continuous mode
  const handleContinuousVoiceTranscription = (transcript) => {
    if (transcript && transcript.trim()) {
      setVoiceTranscript(transcript);
      setInput(transcript);
      
      // In continuous mode, auto-submit immediately with visual feedback
      if (isContinuousVoiceMode) {
        setIsListening(false);
        setTimeout(() => {
          handleVoiceSubmit(transcript);
          setVoiceTranscript('');
        }, 800); // Small delay to show the transcript
      }
    }
  };

  // Continuous Voice Recognition (like Siri/Alexa)
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (isContinuousVoiceMode && !recognitionRef.current) {
      const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
      
      if (supported) {
        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onstart = () => {
          setIsListening(true);
        };
        
        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
          
          // Show interim results
          if (!event.results[event.results.length - 1].isFinal) {
            setVoiceTranscript(transcript);
          } else {
            handleContinuousVoiceTranscription(transcript);
            
            // Restart listening after AI responds (handled in auto-speak effect)
          }
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
          // Don't auto-restart immediately - let the AI respond first
          // Restart will be handled after AI finishes speaking
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Continuous voice error:', event.error);
          if (event.error !== 'aborted' && isContinuousVoiceMode) {
            // Restart after error (except if manually aborted)
            setTimeout(() => {
              if (isContinuousVoiceMode && recognitionRef.current) {
                try {
                  recognitionRef.current.start();
                } catch (error) {
                  console.log('Voice recognition error restart:', error);
                }
              }
            }, 1000);
          }
        };
        
        // Start listening
        try {
          recognitionRef.current.start();
        } catch (error) {
          console.error('Failed to start continuous voice:', error);
        }
      }
    } else if (!isContinuousVoiceMode && recognitionRef.current) {
      // Stop continuous listening
      try {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      } catch (error) {
        console.log('Error stopping voice recognition:', error);
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (error) {
          console.log('Cleanup voice recognition:', error);
        }
      }
    };
  }, [isContinuousVoiceMode]);

  // Text-to-Speech functionality
  // Restart voice recognition after AI finishes speaking
  const restartListening = () => {
    if (isContinuousVoiceMode && recognitionRef.current) {
      setTimeout(() => {
        try {
          setIsListening(true);
          recognitionRef.current.start();
        } catch (error) {
          console.log('Voice recognition restart after speaking:', error);
          // If still in continuous mode, try again after a delay
          if (isContinuousVoiceMode) {
            setTimeout(restartListening, 1000);
          }
        }
      }, 1000);
    }
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window) || !text) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    utterance.lang = 'en-US';
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      // Restart listening after AI finishes speaking (Siri-like behavior)
      restartListening();
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      restartListening();
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Auto-speak new assistant messages when in continuous voice mode
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant' && lastMessage.shouldSpeak && !lastMessage.error) {
      setTimeout(() => {
        speakText(lastMessage.content);
      }, 500); // Small delay to ensure message is rendered
    }
  }, [messages]);

  // Appointment booking flow
  const bookingSteps = [
    {
      step: 'department',
      question: 'Which medical department do you need to visit?',
      options: ['General Medicine', 'Cardiology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'Gynecology'],
      field: 'department'
    },
    {
      step: 'date',
      question: 'What date would you prefer for your appointment?',
      instruction: 'Please provide your preferred date (e.g., "January 15, 2024" or "next Monday")',
      field: 'preferredDate'
    },
    {
      step: 'time',
      question: 'What time works best for you?',
      options: ['Morning (8:00 AM - 12:00 PM)', 'Afternoon (1:00 PM - 5:00 PM)', 'Evening (5:00 PM - 8:00 PM)'],
      field: 'preferredTime'
    },
    {
      step: 'name',
      question: 'Please provide your full name for the appointment',
      instruction: 'Enter your full name as it appears on your ID',
      field: 'patientName'
    },
    {
      step: 'phone',
      question: 'What is your phone number?',
      instruction: 'Please provide your phone number (e.g., +233501234567)',
      field: 'patientPhone'
    },
    {
      step: 'email',
      question: 'What is your email address? (Optional)',
      instruction: 'This will be used for appointment confirmations',
      field: 'patientEmail',
      optional: true
    },
    {
      step: 'urgency',
      question: 'How urgent is your appointment?',
      options: ['Routine (within 2-4 weeks)', 'Urgent (within 1 week)', 'Emergency (immediate attention)'],
      field: 'urgency'
    }
  ];

  const startAppointmentBooking = () => {
    setShowQuickActions(false);
    setBookingStep('department');
    setBookingData({});
    
    const welcomeMessage = {
      role: 'assistant',
      content: `🏥 Welcome to TeleKiosk Hospital Appointment Booking!\n\nI'll guide you through booking your appointment step by step. This will only take a few minutes.\n\n${bookingSteps[0].question}\n\nPlease choose from:\n${bookingSteps[0].options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}`,
      timestamp: Date.now(),
      shouldSpeak: isContinuousVoiceMode,
      isBookingFlow: true
    };
    
    setMessages([welcomeMessage]);
  };

  const quickActions = [
    {
      icon: Calendar,
      label: 'Book Appointment',
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-500',
      action: () => {
        // Close chat and navigate to booking page with doctor selection
        if (onClose) onClose();
        navigate('/book-now');
      }
    },
    {
      icon: DollarSign,
      label: 'Get Quote',
      iconColor: 'text-green-400',
      bgColor: 'bg-green-500',
      action: () => handleQuickAction('I need a quote for medical services')
    },
    {
      icon: Search,
      label: 'Search Content',
      iconColor: 'text-purple-400',
      bgColor: 'bg-purple-500',
      action: () => handleQuickAction('Help me search for medical information or doctors')
    },
    {
      icon: Phone,
      label: 'Schedule Call',
      iconColor: 'text-orange-400',
      bgColor: 'bg-orange-500',
      action: () => handleQuickAction('I want to schedule a consultation call')
    },
    {
      icon: HelpCircle,
      label: 'Quick Help',
      iconColor: 'text-cyan-400',
      bgColor: 'bg-cyan-500',
      action: () => handleQuickAction('I need quick help with hospital services')
    },
    {
      icon: TrendingUp,
      label: 'AI Trends',
      iconColor: 'text-yellow-400',
      bgColor: 'bg-yellow-500',
      action: () => handleQuickAction('Tell me about health and medical trends')
    }
  ];

  const handleQuickAction = async (message) => {
    setShowQuickActions(false);
    const userMessage = {
      role: 'user',
      content: message,
      timestamp: Date.now()
    };

    setMessages([userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3003/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are TeleKiosk Assistant, an advanced AI assistant for The Bank Hospital in Ghana. You help patients with appointment bookings, hospital information, emergency guidance, and healthcare services. Be empathetic, professional, and culturally sensitive to Ghanaian context.' },
            userMessage
          ]
        })
      });

      const result = await response.json();
      
      if (result.success) {
        const assistantMessage = {
          role: 'assistant',
          content: result.message || result.content,
          timestamp: Date.now(),
          shouldSpeak: isContinuousVoiceMode
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: 'I apologize, but I\'m having technical difficulties. Please try again.',
        timestamp: Date.now(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);
    setShowQuickActions(false);

    // Handle booking flow
    if (bookingStep) {
      setTimeout(() => {
        const nextStepMessage = processNextBookingStep(currentInput);
        setMessages(prev => [...prev, nextStepMessage]);
        setIsLoading(false);
        
        // Reset to quick actions if booking is complete
        if (nextStepMessage.isBookingComplete) {
          setTimeout(() => {
            setShowQuickActions(true);
          }, 3000);
        }
      }, 1000);
      return;
    }

    // Regular chat flow
    try {
      const response = await fetch('http://localhost:3003/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are TeleKiosk Assistant, an advanced AI assistant for The Bank Hospital in Ghana. You help patients with appointment bookings, hospital information, emergency guidance, and healthcare services. Be empathetic, professional, and culturally sensitive to Ghanaian context.' },
            ...messages,
            userMessage
          ]
        })
      });

      const result = await response.json();
      
      if (result.success) {
        const assistantMessage = {
          role: 'assistant',
          content: result.message || result.content,
          timestamp: Date.now(),
          shouldSpeak: isContinuousVoiceMode
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: 'I apologize, but I\'m having technical difficulties. Please try again.',
        timestamp: Date.now(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setShowQuickActions(true);
    setInput('');
    setBookingStep(null);
    setBookingData({});
  };

  const processNextBookingStep = (userInput) => {
    const currentStepIndex = bookingSteps.findIndex(step => step.step === bookingStep);
    const currentStep = bookingSteps[currentStepIndex];
    
    // Save user input
    const newBookingData = { ...bookingData, [currentStep.field]: userInput };
    setBookingData(newBookingData);
    
    const nextStepIndex = currentStepIndex + 1;
    
    if (nextStepIndex < bookingSteps.length) {
      // Move to next step
      const nextStep = bookingSteps[nextStepIndex];
      setBookingStep(nextStep.step);
      
      let responseContent = `✅ Got it! ${currentStep.field === 'department' ? 'Department' : currentStep.field === 'preferredDate' ? 'Date' : currentStep.field === 'preferredTime' ? 'Time' : currentStep.field === 'patientName' ? 'Name' : currentStep.field === 'patientPhone' ? 'Phone' : currentStep.field === 'patientEmail' ? 'Email' : 'Urgency'}: ${userInput}\n\n`;
      
      responseContent += `${nextStep.question}\n\n`;
      
      if (nextStep.options) {
        responseContent += `Please choose from:\n${nextStep.options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}`;
      } else if (nextStep.instruction) {
        responseContent += nextStep.instruction;
        if (nextStep.optional) {
          responseContent += '\n\n(You can type "skip" if you prefer not to provide this)';
        }
      }
      
      return {
        role: 'assistant',
        content: responseContent,
        timestamp: Date.now(),
        shouldSpeak: isContinuousVoiceMode,
        isBookingFlow: true
      };
    } else {
      // Booking complete
      setBookingStep(null);
      
      const summary = `🎉 Perfect! Your appointment booking is complete!\n\n📋 Appointment Summary:\n• Department: ${newBookingData.department}\n• Date: ${newBookingData.preferredDate}\n• Time: ${newBookingData.preferredTime}\n• Name: ${newBookingData.patientName}\n• Phone: ${newBookingData.patientPhone}${newBookingData.patientEmail ? `\n• Email: ${newBookingData.patientEmail}` : ''}\n• Urgency: ${newBookingData.urgency}\n\n✅ Your appointment request has been submitted to TeleKiosk Hospital. You will receive a confirmation call within 24 hours to confirm your appointment details.\n\n📞 If you need to make changes or have urgent concerns, please call: +233-599-211-311\n\nThank you for choosing TeleKiosk Hospital! 🏥`;
      
      return {
        role: 'assistant',
        content: summary,
        timestamp: Date.now(),
        shouldSpeak: isContinuousVoiceMode,
        isBookingComplete: true
      };
    }
  };


  const handleVoiceSubmit = async (voiceText) => {
    const userMessage = {
      role: 'user',
      content: voiceText.trim(),
      timestamp: Date.now(),
      isVoice: true
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowQuickActions(false);

    // Handle booking flow for voice input
    if (bookingStep) {
      setTimeout(() => {
        const nextStepMessage = processNextBookingStep(voiceText.trim());
        setMessages(prev => [...prev, nextStepMessage]);
        setIsLoading(false);
        
        // Reset to quick actions if booking is complete
        if (nextStepMessage.isBookingComplete) {
          setTimeout(() => {
            setShowQuickActions(true);
          }, 3000);
        }
      }, 1000);
      return;
    }

    try {
      const response = await fetch('http://localhost:3003/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are TeleKiosk Assistant, an advanced AI assistant for The Bank Hospital in Ghana. You help patients with appointment bookings, hospital information, emergency guidance, and healthcare services. Be empathetic, professional, and culturally sensitive to Ghanaian context.' },
            ...messages,
            userMessage
          ]
        })
      });

      const result = await response.json();
      
      if (result.success) {
        const assistantMessage = {
          role: 'assistant',
          content: result.message || result.content,
          timestamp: Date.now(),
          shouldSpeak: isContinuousVoiceMode
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: 'I apologize, but I\'m having technical difficulties. Please try again.',
        timestamp: Date.now(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite'
    }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-20 right-16 w-24 h-24 bg-green-500/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-20 w-28 h-28 bg-purple-500/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '6s'}}></div>
      </div>
      {/* Enhanced Header with Glassmorphism Effect */}
      <div className="flex items-center justify-between p-4 flex-shrink-0 backdrop-blur-md bg-white/10 border-b border-white/20 relative z-10">
        <div className="flex items-center space-x-3">
          {/* Enhanced Robot Avatar with Animation */}
          <div className="w-8 h-8 bg-gradient-to-br from-white to-blue-100 rounded-full flex items-center justify-center shadow-lg ring-2 ring-blue-400/30 animate-pulse">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center relative">
              <div className="w-4 h-4 bg-white rounded-full shadow-inner">
                <div className="w-2 h-2 bg-blue-500 rounded-full absolute top-1 left-1 animate-ping"></div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">TeleKiosk AI</h2>
            <p className="text-xs text-blue-200/80">Smart Healthcare Assistant</p>
          </div>
          
          {/* Green Phone Icon - matching the design */}
          <button
            onClick={toggleContinuousVoiceMode}
            className={`p-2 rounded-full transition-all duration-300 shadow-xl ml-3 transform hover:scale-110 ${
              isContinuousVoiceMode 
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse ring-4 ring-red-300/50' 
                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 ring-2 ring-green-300/30'
            }`}
            title={isContinuousVoiceMode ? "Stop Voice Conversation" : "Start Voice Conversation"}
          >
            <Phone className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="flex items-center space-x-1">
          {/* Refresh/Reset Icon - matching design */}
          <button 
            onClick={() => {
              setMessages([]);
              setShowQuickActions(true);
              setInput('');
              if (isContinuousVoiceMode) {
                toggleContinuousVoiceMode();
              }
            }}
            className="p-1.5 hover:bg-slate-600/50 rounded-full transition-colors"
            title="Reset Chat"
          >
            <RotateCcw className="w-4 h-4 text-gray-300" />
          </button>
          
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-slate-600/50 rounded-full transition-colors"
              title="Close Chat"
            >
              <X className="w-4 h-4 text-gray-300" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col px-4 min-h-0">
        {/* Enhanced Continuous Voice Mode Indicator with Glassmorphism */}
        {isContinuousVoiceMode && (
          <div className={`text-white p-4 rounded-xl mb-4 transition-all duration-500 backdrop-blur-lg border border-white/20 relative overflow-hidden ${
            isListening ? 'bg-gradient-to-r from-blue-600/80 to-blue-700/80 shadow-blue-500/25' : 
            isSpeaking ? 'bg-gradient-to-r from-green-600/80 to-emerald-700/80 shadow-green-500/25' : 
            'bg-gradient-to-r from-gray-600/80 to-gray-700/80 shadow-gray-500/25'
          } shadow-2xl`}>
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-shimmer"></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full relative ${
                  isListening ? 'bg-red-400 animate-pulse shadow-lg shadow-red-400/50' : 
                  isSpeaking ? 'bg-green-400 animate-bounce shadow-lg shadow-green-400/50' : 
                  'bg-blue-400 animate-pulse shadow-lg shadow-blue-400/50'
                }`}>
                  <div className={`absolute inset-0 rounded-full ${
                    isListening ? 'bg-red-300 animate-ping' :
                    isSpeaking ? 'bg-green-300 animate-ping' :
                    'bg-blue-300 animate-ping'
                  }`}></div>
                </div>
                <div>
                  <h3 className="font-bold">
                    {isListening ? '🎤 Listening...' : 
                     isSpeaking ? '🔊 Speaking...' : 
                     '💬 Voice Chat Active'}
                  </h3>
                  <p className="text-sm opacity-90">
                    {voiceTranscript && !isSpeaking ? 
                      `You said: "${voiceTranscript}"` : 
                      isListening ? 'Speak now - I\'m listening!' :
                      isSpeaking ? 'Let me respond...' :
                      'Speak naturally - I\'ll respond like Siri'
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={toggleContinuousVoiceMode}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-red-500/25 transform hover:scale-105 border border-red-400/30"
              >
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  Stop Voice
                </span>
              </button>
            </div>
          </div>
        )}

        {showQuickActions && messages.length === 0 && !isContinuousVoiceMode && (
          <div className="flex-1 flex flex-col justify-center min-h-0 py-2">
            {/* Enhanced Quick Actions Header with Animation */}
            <div className="text-center mb-6 relative">
              <h3 className="text-transparent bg-gradient-to-r from-blue-200 to-green-200 bg-clip-text font-semibold tracking-wide text-sm mb-2 animate-pulse">QUICK ACTIONS TO GET STARTED</h3>
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto animate-pulse"></div>
              
              {/* Enhanced Emergency Call Button */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => makeCall(HOSPITAL_CONTACTS.emergency, 'emergency')}
                  className="group flex items-center space-x-3 px-5 py-3 bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-700 hover:via-red-600 hover:to-red-700 text-white rounded-full transition-all duration-300 shadow-xl hover:shadow-red-500/30 transform hover:scale-105 border border-red-400/30 animate-pulse"
                >
                  <Phone className="w-4 h-4 animate-bounce" />
                  <span className="text-sm font-semibold">🚨 Emergency Call 999</span>
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                </button>
              </div>
            </div>
            
            {/* Enhanced Action Buttons Grid with Glassmorphism */}
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto flex-shrink-0">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="group flex flex-col items-center justify-center p-4 bg-slate-700/40 hover:bg-slate-600/60 backdrop-blur-sm rounded-2xl border border-slate-500/30 hover:border-blue-400/50 transition-all duration-300 text-center min-h-[85px] shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transform hover:scale-105 hover:-translate-y-1"
                >
                  <div className={`w-10 h-10 ${action.bgColor} bg-gradient-to-br from-${action.bgColor.split('-')[1]}-400 to-${action.bgColor.split('-')[1]}-600 rounded-xl flex items-center justify-center mb-2 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110 ring-2 ring-${action.bgColor.split('-')[1]}-400/20`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-semibold text-xs group-hover:text-blue-200 transition-colors">{action.label}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out"></div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Chat Messages with Better Styling */}
        {messages.length > 0 && (
          <div className="flex-1 overflow-y-auto mb-4 px-1" style={{scrollbarWidth: 'thin', scrollbarColor: '#475569 transparent'}}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl shadow-lg backdrop-blur-sm border transition-all duration-300 hover:shadow-xl focus-within:ring-2 focus-within:ring-blue-400/50 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-400/30 shadow-blue-500/20'
                      : message.error
                      ? 'bg-gradient-to-br from-red-600 to-red-700 text-white border-red-400/30 shadow-red-500/20'
                      : 'bg-slate-700/80 text-gray-100 border-slate-500/30 shadow-slate-900/20'
                  }`}
                  role={message.role === 'assistant' ? 'status' : undefined}
                  aria-live={message.role === 'assistant' ? 'polite' : undefined}
                >
                  <div className="flex items-start space-x-2">
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap leading-relaxed" aria-label={`${message.role === 'user' ? 'Your message' : 'AI assistant response'}: ${message.content}`}>
                        {message.content}
                      </p>
                    </div>
                    {/* Voice indicators */}
                    {message.isVoice && (
                      <Mic className="w-4 h-4 text-blue-300 flex-shrink-0" title="Voice message" />
                    )}
                    {message.role === 'assistant' && message.shouldSpeak && (
                      <Volume2 className="w-4 h-4 text-green-300 flex-shrink-0" title="Will be spoken" />
                    )}
                  </div>
                  <div className="text-xs mt-3 opacity-80 flex items-center justify-between border-t border-white/10 pt-2">
                    <span className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse"></div>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                    {message.role === 'assistant' && !message.error && (
                      <button
                        onClick={() => speakText(message.content)}
                        className="ml-2 p-1.5 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-110 focus:ring-2 focus:ring-white/20"
                        title="Speak this message"
                        aria-label="Read message aloud"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className={`p-4 rounded-2xl shadow-lg backdrop-blur-sm border transition-all duration-300 ${
                  isContinuousVoiceMode 
                    ? 'bg-gradient-to-br from-green-600/80 to-emerald-700/80 border-green-400/30 shadow-green-500/20' 
                    : 'bg-slate-700/80 border-slate-500/30 shadow-slate-900/20'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce shadow-lg"></div>
                      <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce shadow-lg" style={{animationDelay: '0.15s'}}></div>
                      <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce shadow-lg" style={{animationDelay: '0.3s'}}></div>
                    </div>
                    <span className="text-sm text-white font-medium">
                      {isContinuousVoiceMode ? '🎤 Processing your voice...' : '🤖 TeleKiosk AI is thinking...'}
                    </span>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  </div>
                </div>
              </div>
            )}

            {isSpeaking && (
              <div className="flex justify-start mb-4">
                <div className="bg-blue-600 p-4 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-4 h-4 text-white animate-pulse" />
                    <span className="text-sm text-white">TeleKiosk Assistant is speaking...</span>
                    <button
                      onClick={stopSpeaking}
                      className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                    >
                      Stop
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* User-Friendly Input Area */}
        <div className="flex-shrink-0 mt-3 pt-4 border-t border-slate-600/30 bg-slate-800/30 backdrop-blur-sm relative">
          <form onSubmit={handleSubmit} className="flex items-center space-x-3 px-1">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isContinuousVoiceMode ? "🎤 Voice mode active - speak to chat" : "Questions about our services?"}
                className={`w-full px-4 py-3.5 pr-12 rounded-xl border-2 focus:outline-none transition-all duration-200 text-base font-normal shadow-sm ${
                  isContinuousVoiceMode 
                    ? 'bg-blue-50 border-blue-200 text-blue-700 placeholder-blue-500 cursor-not-allowed opacity-75' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 hover:border-gray-400 focus:shadow-lg'
                }`}
                disabled={isLoading || isContinuousVoiceMode}
                autoComplete="off"
                spellCheck="true"
                aria-label="Type your message here"
                tabIndex={isContinuousVoiceMode ? -1 : 0}
              />
              {/* Input Icon */}
              <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors pointer-events-none ${
                isContinuousVoiceMode ? 'text-blue-500' : 'text-gray-400'
              }`}>
                {isContinuousVoiceMode ? <Mic className="w-5 h-5 animate-pulse" /> : <Send className="w-4 h-4" />}
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl transition-all duration-200 flex-shrink-0 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-blue-300 focus:ring-offset-1"
              aria-label="Send message"
              tabIndex={0}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Send className="w-5 h-5 text-white" />
              )}
            </button>
          </form>
          
          {/* Enhanced typing indicator */}
          {input.trim() && !isLoading && !isContinuousVoiceMode && (
            <div className="absolute -top-12 left-4 bg-white border border-gray-200 px-3 py-2 rounded-lg shadow-lg">
              <span className="text-xs text-gray-700 font-medium flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Press Enter to send
              </span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export const AssistantUIChat = (props) => {
  return <TeleKioskInterface {...props} />;
};