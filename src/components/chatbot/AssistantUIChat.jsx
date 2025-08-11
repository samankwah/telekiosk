import React, { useState, useEffect, useRef } from 'react';
import { Send, Calendar, DollarSign, Search, Phone, HelpCircle, TrendingUp, X, Mic, Minimize2, RotateCcw, Volume2, ArrowLeft, ArrowRight, Star, Check, Stethoscope, Heart, Activity } from 'lucide-react';
import { confirmBooking } from '../../services/meetingService';
import robotIcon from '../../assets/chat2.png';

const TeleKioskInterface = ({ onMinimize, onClose, isMinimized }) => {
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
  const [isInBookingFlow, setIsInBookingFlow] = useState(false);
  const [bookingCurrentStep, setBookingCurrentStep] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const lastMessageRef = useRef(null);
  const lastProcessedTranscriptRef = useRef(''); // Track last processed transcript
  
  // Integrated Booking States
  const [integratedBookingActive, setIntegratedBookingActive] = useState(false);
  const [integratedBookingStep, setIntegratedBookingStep] = useState(1);
  const [integratedBookingData, setIntegratedBookingData] = useState({
    specialty: '',
    doctor: '',
    date: '',
    time: '',
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    symptoms: ''
  });
  const [isBookingInProgress, setIsBookingInProgress] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  // Hospital contact numbers
  const HOSPITAL_CONTACTS = {
    emergency: '999', // Ghana emergency number
    reception: '+233501234567', // Hospital main line
    appointments: '+233501234568', // Appointments line
    information: '+233501234569' // Information line
  };

  // Booking data
  const specialties = [
    { id: 'cardiology', name: 'Cardiology', icon: '❤️', color: 'from-red-400 to-pink-500', description: 'Heart and cardiovascular care' },
    { id: 'neurology', name: 'Neurology', icon: '🧠', color: 'from-purple-400 to-indigo-500', description: 'Brain and nervous system' },
    { id: 'pediatrics', name: 'Pediatrics', icon: '👶', color: 'from-blue-400 to-cyan-500', description: 'Children\'s healthcare' },
    { id: 'dermatology', name: 'Dermatology', icon: '✨', color: 'from-yellow-400 to-orange-500', description: 'Skin and beauty care' },
    { id: 'orthopedics', name: 'Orthopedics', icon: '🦴', color: 'from-green-400 to-teal-500', description: 'Bone and joint care' },
    { id: 'emergency', name: 'Emergency', icon: '🚨', color: 'from-red-500 to-red-600', description: 'Urgent medical care' }
  ];

  const doctors = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'cardiology', rating: 4.9, experience: '15+ years', avatar: '👩‍⚕️', description: 'Specialist in heart diseases and interventional cardiology' },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'neurology', rating: 4.8, experience: '12+ years', avatar: '👨‍⚕️', description: 'Expert in neurological disorders and brain surgery' },
    { id: 3, name: 'Dr. Emily Brown', specialty: 'pediatrics', rating: 4.9, experience: '10+ years', avatar: '👩‍⚕️', description: 'Dedicated pediatrician specializing in child development' },
    { id: 4, name: 'Dr. James Wilson', specialty: 'dermatology', rating: 4.7, experience: '8+ years', avatar: '👨‍⚕️', description: 'Dermatologist focusing on skin conditions and cosmetic care' },
    { id: 5, name: 'Dr. Lisa Davis', specialty: 'orthopedics', rating: 4.8, experience: '14+ years', avatar: '👩‍⚕️', description: 'Orthopedic surgeon specializing in joint replacement' },
    { id: 6, name: 'Dr. Robert Ghana', specialty: 'emergency', rating: 4.9, experience: '20+ years', avatar: '👨‍⚕️', description: 'Emergency medicine specialist with trauma expertise' }
  ];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM'
  ];

  // Generate next 14 days for booking
  const generateDates = () => {
    const dates = [];
    for (let i = 1; i <= 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' })
      });
    }
    return dates;
  };

  const availableDates = generateDates();

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
      lastProcessedTranscriptRef.current = ''; // Clear processed transcript history
      setVoiceTranscript('');
    }
  };


  // Enhanced voice transcription handler for continuous mode
  const handleContinuousVoiceTranscription = (transcript) => {
    if (!transcript || !transcript.trim() || isLoading) {
      return; // Don't process empty transcripts or when already loading
    }

    const cleanTranscript = transcript.trim();
    
    // Prevent duplicate submissions of the same transcript
    if (cleanTranscript === voiceTranscript || cleanTranscript === lastProcessedTranscriptRef.current) {
      console.log('Duplicate transcript ignored:', cleanTranscript);
      return;
    }
    
    // Prevent submission of very short or incomplete utterances
    if (cleanTranscript.length < 3) {
      console.log('Transcript too short, waiting for more:', cleanTranscript);
      setVoiceTranscript(cleanTranscript);
      return;
    }

    setVoiceTranscript(cleanTranscript);
    setInput(cleanTranscript);
    
    // In continuous mode, auto-submit after validation
    if (isContinuousVoiceMode) {
      setIsListening(false);
      lastProcessedTranscriptRef.current = cleanTranscript; // Store the processed transcript
      setTimeout(() => {
        if (!isLoading) { // Double-check we're not already processing
          handleVoiceSubmit(cleanTranscript);
          setVoiceTranscript('');
        }
      }, 1000); // Longer delay to ensure complete speech
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
        
        recognitionRef.current.continuous = false; // Changed to false for better control
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.maxAlternatives = 1;
        
        recognitionRef.current.onstart = () => {
          setIsListening(true);
        };
        
        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
          
          console.log('Speech recognition result:', transcript, 'Final:', event.results[event.results.length - 1].isFinal);
          
          // Show interim results
          if (!event.results[event.results.length - 1].isFinal) {
            setVoiceTranscript(transcript);
          } else {
            // Only process final results that are meaningful
            if (transcript.trim().length > 2) {
              handleContinuousVoiceTranscription(transcript);
            } else {
              console.log('Ignoring short final transcript:', transcript);
              // Restart listening for short/meaningless results
              if (isContinuousVoiceMode) {
                setTimeout(() => restartListening(), 500);
              }
            }
          }
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
          // Don't auto-restart immediately - let the AI respond first
          // Restart will be handled after AI finishes speaking
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Continuous voice error:', event.error);
          setIsListening(false);
          
          // Only restart for specific recoverable errors, not all errors
          const recoverableErrors = ['network', 'audio-capture', 'not-allowed'];
          if (recoverableErrors.includes(event.error) && isContinuousVoiceMode && !isListening) {
            console.log('Attempting recovery from recoverable voice error:', event.error);
            setTimeout(() => {
              if (isContinuousVoiceMode && recognitionRef.current && !isListening) {
                try {
                  recognitionRef.current.start();
                  setIsListening(true);
                } catch (error) {
                  console.log('Voice recognition recovery failed:', error);
                  setIsListening(false);
                }
              }
            }, 2000);
          } else {
            console.log('Non-recoverable voice error or already listening, not restarting:', event.error);
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
  // Restart voice recognition after AI finishes speaking (with safeguards)
  const restartListening = () => {
    if (!isContinuousVoiceMode || !recognitionRef.current || isListening) {
      return; // Don't restart if not in continuous mode, no recognition available, or already listening
    }
    
    // Add a delay and safety check before restarting
    setTimeout(() => {
      if (isContinuousVoiceMode && recognitionRef.current && !isListening) {
        try {
          setIsListening(true);
          recognitionRef.current.start();
        } catch (error) {
          console.log('Voice recognition restart error:', error);
          setIsListening(false);
          // Don't auto-retry to prevent infinite loops
        }
      }
    }, 1500); // Increased delay to prevent rapid restarts
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

  // Individual service booking flows
  // Integrated Booking Functions
  const startIntegratedBooking = () => {
    setIntegratedBookingActive(true);
    setIntegratedBookingStep(1);
    setShowQuickActions(false);
    setIsInBookingFlow(true);
    
    const welcomeMessage = {
      role: 'assistant',
      content: `🏥 **Let's Book Your Medical Appointment!**\n\nI'll guide you through our easy 5-step booking process. Let's start by selecting the medical specialty you need.`,
      timestamp: Date.now(),
      shouldSpeak: isContinuousVoiceMode,
      integratedBooking: true,
      bookingStep: 1,
      showIntegratedBookingStep: true
    };
    
    setMessages([welcomeMessage]);
  };

  const updateIntegratedBookingData = (field, value) => {
    setIntegratedBookingData(prev => ({ ...prev, [field]: value }));
  };

  const proceedToNextBookingStep = () => {
    if (integratedBookingStep < 5) {
      const nextStep = integratedBookingStep + 1;
      setIntegratedBookingStep(nextStep);
      
      const stepMessages = {
        2: "✅ Great choice! Now let's pick the perfect date and time for your appointment.",
        3: "📅 Perfect! Now I need some basic information about you to complete the booking.",
        4: "📝 Almost done! Please review your appointment details before we confirm everything.",
        5: "🎉 Booking in progress..."
      };
      
      const nextStepMessage = {
        role: 'assistant',
        content: stepMessages[nextStep] || "Let's continue...",
        timestamp: Date.now(),
        shouldSpeak: isContinuousVoiceMode,
        integratedBooking: true,
        bookingStep: nextStep,
        showIntegratedBookingStep: true
      };
      
      setMessages(prev => [...prev, nextStepMessage]);
    }
  };

  const handleIntegratedBookingSubmit = async () => {
    if (integratedBookingStep !== 4) return;
    
    setIsBookingInProgress(true);
    setIntegratedBookingStep(5);
    
    try {
      const result = await confirmBooking(integratedBookingData);
      setBookingResult(result);
      
      const resultMessage = {
        role: 'assistant',
        content: result.success 
          ? "🎉 **Booking Confirmed!** Your appointment has been successfully scheduled."
          : `❌ **Booking Failed:** ${result.message || 'Please try again.'}`,
        timestamp: Date.now(),
        shouldSpeak: isContinuousVoiceMode,
        integratedBooking: true,
        bookingStep: 5,
        showIntegratedBookingStep: true,
        bookingResult: result
      };
      
      setMessages(prev => [...prev, resultMessage]);
      
      if (result.success) {
        setTimeout(() => {
          setShowQuickActions(true);
          setIntegratedBookingActive(false);
        }, 5000);
      }
      
    } catch (error) {
      console.error('Integrated booking error:', error);
      
      const errorMessage = {
        role: 'assistant',
        content: `❌ **Booking Error:** ${error.message || 'An unexpected error occurred. Please try again.'}`,
        timestamp: Date.now(),
        shouldSpeak: isContinuousVoiceMode,
        integratedBooking: true,
        bookingStep: 5,
        showIntegratedBookingStep: true,
        bookingResult: { success: false, message: error.message }
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsBookingInProgress(false);
    }
  };

  const startServiceBooking = (serviceType) => {
    if (serviceType === 'appointment') {
      startIntegratedBooking();
      return;
    }
    
    setShowQuickActions(false);
    setIsInBookingFlow(true);
    setBookingCurrentStep(1);
    
    const serviceConfigs = {
      appointment: {
        title: '🏥 **Medical Appointment Booking**',
        showSpecialtySelection: true
      },
      quote: {
        title: '🩺 **Medical Services & Pricing**',
        showQuoteSelection: true
      },
      search: {
        title: '🔍 **Find Medical Services**',
        showSearchCategories: true
      },
      call: {
        title: '📞 **Telemedicine Consultation**',
        showCallTypes: true
      },
      help: {
        title: '⚕️ **Medical Help & Support**',
        showHelpCategories: true
      },
      trends: {
        title: '❤️ **Health & Wellness Center**',
        showTrendCategories: true
      }
    };
    
    const config = serviceConfigs[serviceType];
    
    setMessages([
      {
        role: 'assistant',
        content: `${config.title}\n\nLet's get started:`,
        timestamp: Date.now(),
        shouldSpeak: isContinuousVoiceMode,
        isBookingFlow: true,
        serviceType: serviceType,
        ...config
      }
    ]);
  };

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
      action: () => startServiceBooking('appointment')
    },
    {
      icon: Stethoscope,
      label: 'Medical Quote',
      iconColor: 'text-green-400',
      bgColor: 'bg-green-500',
      action: () => startServiceBooking('quote')
    },
    {
      icon: Search,
      label: 'Find Services',
      iconColor: 'text-purple-400',
      bgColor: 'bg-purple-500',
      action: () => startServiceBooking('search')
    },
    {
      icon: Phone,
      label: 'Telemedicine',
      iconColor: 'text-orange-400',
      bgColor: 'bg-orange-500',
      action: () => startServiceBooking('call')
    },
    {
      icon: HelpCircle,
      label: 'Medical Help',
      iconColor: 'text-cyan-400',
      bgColor: 'bg-cyan-500',
      action: () => startServiceBooking('help')
    },
    {
      icon: Heart,
      label: 'Health & Wellness',
      iconColor: 'text-red-400',
      bgColor: 'bg-red-500',
      action: () => startServiceBooking('trends')
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
            { role: 'system', content: 'You are TeleKiosk Assistant, an advanced AI assistant for TeleKiosk Hospital in Ghana. You help patients with appointment bookings, hospital information, emergency guidance, and healthcare services. Be empathetic, professional, and culturally sensitive to Ghanaian context.' },
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
            { role: 'system', content: 'You are TeleKiosk Assistant, an advanced AI assistant for TeleKiosk Hospital in Ghana. You help patients with appointment bookings, hospital information, emergency guidance, and healthcare services. Be empathetic, professional, and culturally sensitive to Ghanaian context. When users want to book an appointment, ask if they would like to use our integrated booking system by responding with "INTEGRATED_BOOKING_START" to trigger the step-by-step booking process.' },
            ...messages,
            userMessage
          ]
        })
      });

      const result = await response.json();
      
      if (result.success) {
        const messageContent = result.message || result.content;
        
        // Check if AI wants to trigger integrated booking
        if (messageContent.includes('INTEGRATED_BOOKING_START')) {
          const modifiedContent = messageContent.replace('INTEGRATED_BOOKING_START', '').trim();
          
          const assistantMessage = {
            role: 'assistant',
            content: modifiedContent || '🏥 I can help you book an appointment! Let me start our integrated booking system.',
            timestamp: Date.now(),
            shouldSpeak: isContinuousVoiceMode
          };
          setMessages(prev => [...prev, assistantMessage]);
          
          // Start integrated booking after a short delay
          setTimeout(() => {
            startIntegratedBooking();
          }, 1000);
          
        } else {
          const assistantMessage = {
            role: 'assistant',
            content: messageContent,
            timestamp: Date.now(),
            shouldSpeak: isContinuousVoiceMode
          };
          setMessages(prev => [...prev, assistantMessage]);
        }
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
    // Reset integrated booking flow
    setIsInBookingFlow(false);
    setBookingCurrentStep(1);
    setSelectedSpecialty(null);
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTime(null);
    // Reset integrated booking states
    setIntegratedBookingActive(false);
    setIntegratedBookingStep(1);
    setIntegratedBookingData({
      specialty: '',
      doctor: '',
      date: '',
      time: '',
      patientName: '',
      patientEmail: '',
      patientPhone: '',
      symptoms: ''
    });
    setIsBookingInProgress(false);
    setBookingResult(null);
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
            { role: 'system', content: 'You are TeleKiosk Assistant, an advanced AI assistant for TeleKiosk Hospital in Ghana. You help patients with appointment bookings, hospital information, emergency guidance, and healthcare services. Be empathetic, professional, and culturally sensitive to Ghanaian context.' },
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
    <div className="h-full flex flex-col relative overflow-hidden pb-safe" style={{
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
      <div className="flex items-center justify-between p-3 sm:p-4 flex-shrink-0 backdrop-blur-md bg-white/10 border-b border-white/20 relative z-10">
        <div className="flex items-center space-x-3">
          {/* Robot Image from Assets */}
          <div className="w-8 h-8 flex items-center justify-center">
            <img 
              src={robotIcon}
              alt="TeleKiosk AI Robot"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">TeleKiosk AI</h2>
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
      <div className="flex-1 flex flex-col px-2 sm:px-4 min-h-0">
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
            <div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-xs sm:max-w-md mx-auto flex-shrink-0">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="group flex flex-col items-center justify-center p-3 sm:p-4 bg-slate-700/40 hover:bg-slate-600/60 backdrop-blur-sm rounded-2xl border border-slate-500/30 hover:border-blue-400/50 transition-all duration-300 text-center min-h-[75px] sm:min-h-[85px] shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transform hover:scale-105 hover:-translate-y-1"
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
                  className={`max-w-[90%] sm:max-w-[85%] p-3 sm:p-4 rounded-2xl shadow-lg backdrop-blur-sm border transition-all duration-300 hover:shadow-xl focus-within:ring-2 focus-within:ring-blue-400/50 ${
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
                  
                  {/* Integrated Booking Steps */}
                  {message.showIntegratedBookingStep && message.integratedBooking && (
                    <div className="mt-4">
                      {message.bookingStep === 1 && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-white">Step 1: Select Specialty & Doctor</h4>
                            <div className="bg-white/20 px-2 py-1 rounded text-xs">1/5</div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {specialties.map(specialty => (
                              <button
                                key={specialty.id}
                                onClick={() => {
                                  updateIntegratedBookingData('specialty', specialty.id);
                                  updateIntegratedBookingData('doctor', ''); // Reset doctor
                                }}
                                className={`p-3 rounded-xl border transition-all duration-200 text-left ${
                                  integratedBookingData.specialty === specialty.id
                                    ? 'border-white/60 bg-white/20 shadow-lg'
                                    : 'border-white/30 bg-white/10 hover:bg-white/15'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{specialty.icon}</span>
                                  <div>
                                    <div className="font-semibold text-white text-sm">{specialty.name}</div>
                                    <div className="text-xs text-white/80">{specialty.description}</div>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                          
                          {integratedBookingData.specialty && (
                            <div className="mt-4 space-y-2">
                              <h5 className="font-medium text-white">Available Doctors:</h5>
                              <div className="space-y-2">
                                {doctors.filter(doc => doc.specialty === integratedBookingData.specialty).map(doctor => (
                                  <button
                                    key={doctor.id}
                                    onClick={() => updateIntegratedBookingData('doctor', doctor.id)}
                                    className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                                      integratedBookingData.doctor === doctor.id
                                        ? 'border-white/60 bg-white/20'
                                        : 'border-white/30 bg-white/10 hover:bg-white/15'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="text-xl">{doctor.avatar}</span>
                                      <div className="flex-1">
                                        <div className="font-semibold text-white text-sm">{doctor.name}</div>
                                        <div className="flex items-center gap-2 text-xs text-white/80">
                                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                          <span>{doctor.rating}</span>
                                          <span>•</span>
                                          <span>{doctor.experience}</span>
                                        </div>
                                        <div className="text-xs text-white/70 mt-1">{doctor.description}</div>
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {integratedBookingData.specialty && integratedBookingData.doctor && (
                            <button
                              onClick={proceedToNextBookingStep}
                              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                            >
                              Continue to Date & Time Selection
                            </button>
                          )}
                        </div>
                      )}
                      
                      {message.bookingStep === 2 && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-white">Step 2: Select Date & Time</h4>
                            <div className="bg-white/20 px-2 py-1 rounded text-xs">2/5</div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-medium text-white mb-3">Choose Date:</h5>
                              <div className="grid grid-cols-4 gap-2">
                                {availableDates.slice(0, 8).map((date) => (
                                  <button
                                    key={date.date}
                                    onClick={() => updateIntegratedBookingData('date', date.date)}
                                    className={`p-2 rounded-lg text-center transition-all duration-200 text-xs ${
                                      integratedBookingData.date === date.date
                                        ? 'bg-green-600 text-white shadow-lg'
                                        : 'bg-white/20 hover:bg-white/30 text-white'
                                    }`}
                                  >
                                    <div className="text-xs opacity-80">{date.day}</div>
                                    <div className="font-semibold">{date.dayNum}</div>
                                    <div className="text-xs opacity-80">{date.month}</div>
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            {integratedBookingData.date && (
                              <div>
                                <h5 className="font-medium text-white mb-3">Choose Time:</h5>
                                <div className="grid grid-cols-3 gap-2">
                                  {timeSlots.slice(0, 9).map((time) => (
                                    <button
                                      key={time}
                                      onClick={() => updateIntegratedBookingData('time', time)}
                                      className={`p-2 rounded-lg text-center transition-all duration-200 text-xs ${
                                        integratedBookingData.time === time
                                          ? 'bg-purple-600 text-white shadow-lg'
                                          : 'bg-white/20 hover:bg-white/30 text-white'
                                      }`}
                                    >
                                      {time}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {integratedBookingData.date && integratedBookingData.time && (
                            <button
                              onClick={proceedToNextBookingStep}
                              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                            >
                              Continue to Patient Information
                            </button>
                          )}
                        </div>
                      )}
                      
                      {message.bookingStep === 3 && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-white">Step 3: Patient Information</h4>
                            <div className="bg-white/20 px-2 py-1 rounded text-xs">3/5</div>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="block text-white text-sm mb-2">Full Name *</label>
                              <input
                                type="text"
                                value={integratedBookingData.patientName}
                                onChange={(e) => updateIntegratedBookingData('patientName', e.target.value)}
                                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white/50"
                                placeholder="Enter your full name"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-white text-sm mb-2">Email Address *</label>
                              <input
                                type="email"
                                value={integratedBookingData.patientEmail}
                                onChange={(e) => updateIntegratedBookingData('patientEmail', e.target.value)}
                                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white/50"
                                placeholder="Enter your email"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-white text-sm mb-2">Phone Number *</label>
                              <input
                                type="tel"
                                value={integratedBookingData.patientPhone}
                                onChange={(e) => updateIntegratedBookingData('patientPhone', e.target.value)}
                                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white/50"
                                placeholder="Enter your phone number"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-white text-sm mb-2">Symptoms/Reason for Visit</label>
                              <textarea
                                value={integratedBookingData.symptoms}
                                onChange={(e) => updateIntegratedBookingData('symptoms', e.target.value)}
                                rows={3}
                                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white/50"
                                placeholder="Describe your symptoms or reason for the appointment"
                              />
                            </div>
                          </div>
                          
                          {integratedBookingData.patientName && integratedBookingData.patientEmail && integratedBookingData.patientPhone && (
                            <button
                              onClick={proceedToNextBookingStep}
                              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                            >
                              Continue to Review & Confirm
                            </button>
                          )}
                        </div>
                      )}
                      
                      {message.bookingStep === 4 && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-white">Step 4: Review & Confirm</h4>
                            <div className="bg-white/20 px-2 py-1 rounded text-xs">4/5</div>
                          </div>
                          
                          <div className="bg-white/20 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-white/80">Specialty:</span>
                              <span className="text-white font-medium">
                                {specialties.find(s => s.id === integratedBookingData.specialty)?.name}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-white/80">Doctor:</span>
                              <span className="text-white font-medium">
                                {doctors.find(d => d.id === integratedBookingData.doctor)?.name}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-white/80">Date:</span>
                              <span className="text-white font-medium">{integratedBookingData.date}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-white/80">Time:</span>
                              <span className="text-white font-medium">{integratedBookingData.time}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-white/80">Patient:</span>
                              <span className="text-white font-medium">{integratedBookingData.patientName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-white/80">Contact:</span>
                              <span className="text-white font-medium">{integratedBookingData.patientEmail}</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={handleIntegratedBookingSubmit}
                            disabled={isBookingInProgress}
                            className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            {isBookingInProgress ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Confirming Booking...
                              </>
                            ) : (
                              <>
                                <Check className="w-5 h-5" />
                                Confirm Booking
                              </>
                            )}
                          </button>
                        </div>
                      )}
                      
                      {message.bookingStep === 5 && message.bookingResult && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-white">Step 5: Booking Complete</h4>
                            <div className="bg-white/20 px-2 py-1 rounded text-xs">5/5</div>
                          </div>
                          
                          {message.bookingResult.success ? (
                            <div className="bg-green-600/80 rounded-lg p-4 space-y-3">
                              <div className="flex items-center gap-2">
                                <Check className="w-6 h-6 text-white" />
                                <h5 className="font-semibold text-white">Booking Confirmed!</h5>
                              </div>
                              
                              {message.bookingResult.meetingInfo && (
                                <div className="space-y-2">
                                  <p className="text-white text-sm">Meeting Link:</p>
                                  <a
                                    href={message.bookingResult.meetingInfo.meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full bg-white text-green-600 font-bold text-center py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                                  >
                                    🎥 Join Video Consultation
                                  </a>
                                  <p className="text-white/80 text-xs text-center">
                                    Meeting ID: {message.bookingResult.meetingInfo.meetingId}
                                  </p>
                                </div>
                              )}
                              
                              <p className="text-white/90 text-sm">
                                ✅ Confirmation email sent to {integratedBookingData.patientEmail}
                              </p>
                            </div>
                          ) : (
                            <div className="bg-red-600/80 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <X className="w-6 h-6 text-white" />
                                <h5 className="font-semibold text-white">Booking Failed</h5>
                              </div>
                              <p className="text-white/90 text-sm">
                                {message.bookingResult.message || 'An error occurred. Please try again.'}
                              </p>
                              <button
                                onClick={() => setIntegratedBookingStep(4)}
                                className="mt-3 w-full bg-white text-red-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                Try Again
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Service-Specific Booking Components */}
                  {message.showSpecialtySelection && message.serviceType === 'appointment' && (
                    <div className="mt-4 space-y-3">
                      <h4 className="font-semibold text-white mb-3">Select Medical Specialty:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {specialties.map(specialty => (
                          <button
                            key={specialty.id}
                            onClick={() => handleSpecialtySelect(specialty)}
                            className="p-3 bg-gradient-to-r hover:scale-105 transition-all duration-200 rounded-xl border border-white/20 text-left hover:border-white/40"
                            style={{ background: `linear-gradient(135deg, ${specialty.color.split(' ')[1]}, ${specialty.color.split(' ')[3]})` }}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{specialty.icon}</span>
                              <div>
                                <div className="font-semibold text-white text-sm">{specialty.name}</div>
                                <div className="text-xs text-white/80">{specialty.description}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Quote Service Selection */}
                  {message.showQuoteSelection && message.serviceType === 'quote' && (
                    <div className="mt-4 space-y-3">
                      <h4 className="font-semibold text-white mb-3">Select Medical Service for Pricing:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'consultation', name: 'Consultation', icon: '👨‍⚕️', desc: 'Doctor consultation fees' },
                          { id: 'surgery', name: 'Surgery', icon: '🏥', desc: 'Surgical procedure costs' },
                          { id: 'diagnostic', name: 'Diagnostics', icon: '🔬', desc: 'Lab tests & imaging' },
                          { id: 'treatment', name: 'Treatment', icon: '💊', desc: 'Therapy & medication' }
                        ].map(service => (
                          <button
                            key={service.id}
                            className="p-3 bg-green-600/80 hover:bg-green-600 rounded-xl border border-white/20 text-left hover:scale-105 transition-all"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{service.icon}</span>
                              <div>
                                <div className="font-semibold text-white text-sm">{service.name}</div>
                                <div className="text-xs text-white/80">{service.desc}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Search Categories */}
                  {message.showSearchCategories && message.serviceType === 'search' && (
                    <div className="mt-4 space-y-3">
                      <h4 className="font-semibold text-white mb-3">What medical service can I help you find?</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'doctors', name: 'Find Doctors', icon: '👩‍⚕️', desc: 'Search specialists' },
                          { id: 'services', name: 'Medical Services', icon: '🏥', desc: 'Available treatments' },
                          { id: 'facilities', name: 'Facilities', icon: '🏢', desc: 'Hospital departments' },
                          { id: 'health-info', name: 'Health Info', icon: '📊', desc: 'Medical guidance' }
                        ].map(category => (
                          <button
                            key={category.id}
                            className="p-3 bg-purple-600/80 hover:bg-purple-600 rounded-xl border border-white/20 text-left hover:scale-105 transition-all"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{category.icon}</span>
                              <div>
                                <div className="font-semibold text-white text-sm">{category.name}</div>
                                <div className="text-xs text-white/80">{category.desc}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Call Types */}
                  {message.showCallTypes && message.serviceType === 'call' && (
                    <div className="mt-4 space-y-3">
                      <h4 className="font-semibold text-white mb-3">Choose Your Telemedicine Option:</h4>
                      <div className="space-y-2">
                        {[
                          { id: 'video', name: 'Video Consultation', icon: '📹', desc: 'Face-to-face online consultation', price: 'GHS 50' },
                          { id: 'phone', name: 'Phone Consultation', icon: '📞', desc: 'Voice call with doctor', price: 'GHS 30' },
                          { id: 'emergency', name: 'Emergency Call', icon: '🚨', desc: 'Urgent medical consultation', price: 'GHS 100' }
                        ].map(callType => (
                          <button
                            key={callType.id}
                            className="w-full p-4 bg-orange-600/80 hover:bg-orange-600 rounded-xl border border-white/20 text-left hover:scale-105 transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-xl">{callType.icon}</span>
                                <div>
                                  <div className="font-semibold text-white">{callType.name}</div>
                                  <div className="text-xs text-white/80">{callType.desc}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-white">{callType.price}</div>
                                <div className="text-xs text-white/80">30 mins</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Help Categories */}
                  {message.showHelpCategories && message.serviceType === 'help' && (
                    <div className="mt-4 space-y-3">
                      <h4 className="font-semibold text-white mb-3">What medical assistance do you need?</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'emergency', name: 'Emergency', icon: '🚨', desc: 'Urgent medical help' },
                          { id: 'directions', name: 'Directions', icon: '🗺️', desc: 'Hospital navigation' },
                          { id: 'insurance', name: 'Insurance', icon: '💳', desc: 'Coverage questions' },
                          { id: 'general', name: 'General Info', icon: 'ℹ️', desc: 'Hospital information' }
                        ].map(helpType => (
                          <button
                            key={helpType.id}
                            className="p-3 bg-cyan-600/80 hover:bg-cyan-600 rounded-xl border border-white/20 text-left hover:scale-105 transition-all"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{helpType.icon}</span>
                              <div>
                                <div className="font-semibold text-white text-sm">{helpType.name}</div>
                                <div className="text-xs text-white/80">{helpType.desc}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Trend Categories */}
                  {message.showTrendCategories && message.serviceType === 'trends' && (
                    <div className="mt-4 space-y-3">
                      <h4 className="font-semibold text-white mb-3">Choose Health & Wellness Topic:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'wellness', name: 'Wellness Tips', icon: '✨', desc: 'Daily health advice' },
                          { id: 'nutrition', name: 'Nutrition', icon: '🥗', desc: 'Diet & healthy eating' },
                          { id: 'fitness', name: 'Fitness', icon: '💪', desc: 'Exercise & activity' },
                          { id: 'prevention', name: 'Prevention', icon: '🛡️', desc: 'Disease prevention' }
                        ].map(trend => (
                          <button
                            key={trend.id}
                            className="p-3 bg-red-600/80 hover:bg-red-600 rounded-xl border border-white/20 text-left hover:scale-105 transition-all"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{trend.icon}</span>
                              <div>
                                <div className="font-semibold text-white text-sm">{trend.name}</div>
                                <div className="text-xs text-white/80">{trend.desc}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {message.showDoctorSelection && message.availableDoctors && (
                    <div className="mt-4 space-y-3">
                      <h4 className="font-semibold text-white mb-3">Choose Your Doctor:</h4>
                      <div className="space-y-2">
                        {message.availableDoctors.map(doctor => (
                          <button
                            key={doctor.id}
                            onClick={() => handleDoctorSelect(doctor)}
                            className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-200 text-left"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{doctor.avatar}</span>
                              <div className="flex-1">
                                <div className="font-semibold text-white">{doctor.name}</div>
                                <div className="flex items-center gap-2 text-sm text-white/80">
                                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                  <span>{doctor.rating}</span>
                                  <span className="mx-1">•</span>
                                  <span>{doctor.experience}</span>
                                </div>
                                <div className="text-xs text-white/70 mt-1">{doctor.description}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {message.showDateSelection && (
                    <div className="mt-4 space-y-3">
                      <h4 className="font-semibold text-white mb-3">Select Date:</h4>
                      <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                        {availableDates.slice(0, 9).map((date, index) => (
                          <button
                            key={index}
                            onClick={() => handleDateSelect(date)}
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-200 text-center"
                          >
                            <div className="text-xs text-white/80">{date.day}</div>
                            <div className="font-semibold text-white">{date.dayNum}</div>
                            <div className="text-xs text-white/80">{date.month}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {message.showTimeSelection && (
                    <div className="mt-4 space-y-3">
                      <h4 className="font-semibold text-white mb-3">Choose Time:</h4>
                      <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                        {timeSlots.map(time => (
                          <button
                            key={time}
                            onClick={() => handleTimeSelect(time)}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 hover:border-white/40 transition-all duration-200 text-center"
                          >
                            <div className="text-sm font-medium text-white">{time}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {message.showContactForm && (
                    <div className="mt-4 space-y-3">
                      <h4 className="font-semibold text-white mb-3">Contact Information:</h4>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Full Name"
                          className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white/50"
                        />
                        <input
                          type="email"
                          placeholder="Email Address"
                          className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white/50"
                        />
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white/50"
                        />
                        <button
                          className="w-full p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                          onClick={() => {
                            const confirmMessage = {
                              role: 'assistant',
                              content: `🎉 **Booking Confirmed!**\n\n📋 **Appointment Details:**\n• **Specialty:** ${selectedSpecialty?.name}\n• **Doctor:** ${selectedDoctor?.name}\n• **Date:** ${selectedDate?.day}, ${selectedDate?.month} ${selectedDate?.dayNum}\n• **Time:** ${selectedTime}\n\n✅ Your appointment has been successfully booked! You will receive a confirmation email shortly.\n\n📞 For any changes, please call: ${HOSPITAL_CONTACTS.appointments}`,
                              timestamp: Date.now(),
                              shouldSpeak: isContinuousVoiceMode,
                              isBookingComplete: true
                            };
                            setMessages(prev => [...prev, confirmMessage]);
                            setTimeout(() => {
                              setShowQuickActions(true);
                              setIsInBookingFlow(false);
                            }, 3000);
                          }}
                        >
                          Confirm Booking
                        </button>
                      </div>
                    </div>
                  )}
                  
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


        {/* User-Friendly Input Area with Mobile-Optimized Spacing */}
        <div className="flex-shrink-0 mt-4 pt-4 pb-6 sm:pb-4 border-t border-slate-600/30 bg-slate-800/30 backdrop-blur-sm relative">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-1">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isContinuousVoiceMode ? "🎤 Voice mode active - speak to chat" : "Questions about our services?"}
                className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl border-2 focus:outline-none transition-all duration-200 text-sm sm:text-base font-normal shadow-sm ${
                  isContinuousVoiceMode 
                    ? 'bg-blue-50 border-blue-200 text-blue-700 placeholder-blue-500 cursor-not-allowed opacity-75 pr-10 sm:pr-12' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 hover:border-gray-400 focus:shadow-lg pr-3 sm:pr-4'
                }`}
                disabled={isLoading || isContinuousVoiceMode}
                autoComplete="off"
                spellCheck="true"
                aria-label="Type your message here"
                tabIndex={isContinuousVoiceMode ? -1 : 0}
              />
              {/* Voice Mode Icon Only */}
              {isContinuousVoiceMode && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 pointer-events-none">
                  <Mic className="w-5 h-5 animate-pulse" />
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-3 sm:p-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl transition-all duration-200 flex-shrink-0 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-blue-300 focus:ring-offset-1"
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