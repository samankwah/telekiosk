import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Dimensions,
  Platform
} from 'react-native';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import services
import { offlineAIService } from '../services/offlineAI';
import { cameraService } from '../services/cameraService';
import { voiceService } from '../services/voiceService';
import { syncService } from '../services/syncService';

const { width, height } = Dimensions.get('window');

const AIHealthAssistant = () => {
  // State management
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-GH');
  
  // Camera and media states
  const [cameraVisible, setCameraVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [analysisMode, setAnalysisMode] = useState('general'); // general, symptom, wound, vitals
  
  // Audio states
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  
  // UI states
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showAnalysisModes, setShowAnalysisModes] = useState(false);
  
  // Refs
  const scrollViewRef = useRef(null);
  const cameraRef = useRef(null);

  // Language options for Ghana
  const languages = [
    { code: 'en-GH', name: 'English (Ghana)', flag: '🇬🇭' },
    { code: 'tw-GH', name: 'Twi', flag: '🇬🇭' },
    { code: 'ee-GH', name: 'Ewe', flag: '🇬🇭' },
    { code: 'ga-GH', name: 'Ga', flag: '🇬🇭' },
    { code: 'ha-GH', name: 'Hausa', flag: '🇬🇭' }
  ];

  // Analysis modes
  const analysisModes = [
    { 
      id: 'general', 
      name: 'General Health', 
      icon: 'medical-outline',
      description: 'Overall health assessment'
    },
    { 
      id: 'symptom', 
      name: 'Symptom Check', 
      icon: 'thermometer-outline',
      description: 'Analyze symptoms from images'
    },
    { 
      id: 'skin', 
      name: 'Skin Analysis', 
      icon: 'eye-outline',
      description: 'Skin condition assessment'
    },
    { 
      id: 'wound', 
      name: 'Wound Assessment', 
      icon: 'bandage-outline',
      description: 'Track wound healing progress'
    }
  ];

  // Initial health assistant message
  const initialMessage = {
    id: Date.now(),
    text: "Akwaaba! I'm your TeleKiosk Health Assistant. I can help you with medical questions, analyze photos, and provide health guidance in your preferred language. How can I assist you today?",
    isUser: false,
    timestamp: new Date(),
    type: 'text'
  };

  // Initialize component
  useEffect(() => {
    initializeAssistant();
    requestPermissions();
    loadChatHistory();
  }, []);

  const initializeAssistant = async () => {
    try {
      // Initialize offline AI
      await offlineAIService.initialize();
      
      // Check online status
      checkOnlineStatus();
      
      // Set initial message if no chat history
      const history = await AsyncStorage.getItem('chatHistory');
      if (!history) {
        setMessages([initialMessage]);
      }
      
      console.log('📱 AI Health Assistant initialized');
    } catch (error) {
      console.error('❌ Assistant initialization failed:', error);
    }
  };

  const requestPermissions = async () => {
    try {
      // Camera permission
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      
      // Audio permission
      const { status: audioStatus } = await Audio.requestPermissionsAsync();
      
      // Image picker permission
      const { status: imageStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      setHasPermission({
        camera: cameraStatus === 'granted',
        audio: audioStatus === 'granted',
        images: imageStatus === 'granted'
      });
      
      if (cameraStatus !== 'granted' || audioStatus !== 'granted' || imageStatus !== 'granted') {
        Alert.alert(
          'Permissions Required',
          'TeleKiosk needs camera and microphone access to provide full health assistance.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('❌ Permission request failed:', error);
    }
  };

  const checkOnlineStatus = async () => {
    try {
      // Simple network check - in production, use NetInfo
      const response = await fetch('https://api.telekiosk.com/health', { 
        timeout: 5000 
      });
      setIsOnline(response.ok);
    } catch (error) {
      setIsOnline(false);
      console.log('📱 Operating in offline mode');
    }
  };

  const loadChatHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('chatHistory');
      if (history) {
        setMessages(JSON.parse(history));
      }
    } catch (error) {
      console.error('❌ Failed to load chat history:', error);
    }
  };

  const saveChatHistory = async (newMessages) => {
    try {
      await AsyncStorage.setItem('chatHistory', JSON.stringify(newMessages));
    } catch (error) {
      console.error('❌ Failed to save chat history:', error);
    }
  };

  const sendMessage = async (text = inputText, image = null, audioUri = null) => {
    if (!text.trim() && !image && !audioUri) return;

    const userMessage = {
      id: Date.now(),
      text: text || '',
      isUser: true,
      timestamp: new Date(),
      type: image ? 'image' : audioUri ? 'audio' : 'text',
      image: image,
      audioUri: audioUri
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      let response;
      
      if (isOnline) {
        // Online AI processing
        response = await processWithOnlineAI({
          text: text || '',
          image: image,
          audio: audioUri,
          language: selectedLanguage,
          analysisMode: analysisMode
        });
      } else {
        // Offline AI processing
        response = await offlineAIService.processHealthQuery({
          text: text || '',
          image: image,
          language: selectedLanguage,
          analysisMode: analysisMode
        });
      }

      const aiMessage = {
        id: Date.now() + 1,
        text: response.message,
        isUser: false,
        timestamp: new Date(),
        type: 'text',
        confidence: response.confidence,
        emergency: response.emergency,
        recommendations: response.recommendations
      };

      const updatedMessages = [...newMessages, aiMessage];
      setMessages(updatedMessages);
      saveChatHistory(updatedMessages);

      // Handle emergency situations
      if (response.emergency) {
        handleEmergencyResponse(response);
      }

      // Queue for sync if offline
      if (!isOnline) {
        await syncService.queueMessage(userMessage, aiMessage);
      }

    } catch (error) {
      console.error('❌ Message processing failed:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: isOnline 
          ? "I'm having trouble processing your request. Please try again."
          : "I'm working in offline mode with limited capabilities. Your message will be synced when connected.",
        isUser: false,
        timestamp: new Date(),
        type: 'error'
      };

      const updatedMessages = [...newMessages, errorMessage];
      setMessages(updatedMessages);
      saveChatHistory(updatedMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const processWithOnlineAI = async (input) => {
    // This would connect to the main TeleKiosk AI router
    const response = await fetch('https://api.telekiosk.com/ai/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await AsyncStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        ...input,
        platform: 'mobile',
        deviceId: await AsyncStorage.getItem('deviceId')
      })
    });

    if (!response.ok) {
      throw new Error('Online AI processing failed');
    }

    return await response.json();
  };

  const handleEmergencyResponse = (response) => {
    Alert.alert(
      '⚠️ Emergency Detected',
      `${response.message}\n\nWould you like to contact emergency services?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call Emergency', 
          style: 'destructive',
          onPress: () => {
            // In Ghana, emergency number is 191 for ambulance
            if (Platform.OS === 'ios') {
              Linking.openURL('tel:191');
            } else {
              Linking.openURL('tel:191');
            }
          }
        }
      ]
    );
  };

  const startVoiceRecording = async () => {
    if (!hasPermission?.audio) {
      Alert.alert('Permission Required', 'Microphone access is needed for voice input.');
      return;
    }

    try {
      setIsListening(true);
      
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      
      setRecording(recording);
      
      // Start voice recognition
      const result = await voiceService.startListening(selectedLanguage);
      
      if (result.text) {
        setInputText(result.text);
      }
      
    } catch (error) {
      console.error('❌ Voice recording failed:', error);
      Alert.alert('Error', 'Failed to start voice recording.');
    } finally {
      setIsListening(false);
    }
  };

  const stopVoiceRecording = async () => {
    if (!recording) return;

    try {
      setIsListening(false);
      await recording.stopAndUnloadAsync();
      
      const uri = recording.getURI();
      setRecording(null);
      
      // Process audio with AI
      await sendMessage('', null, uri);
      
    } catch (error) {
      console.error('❌ Voice recording stop failed:', error);
    }
  };

  const takePicture = async () => {
    if (!hasPermission?.camera) {
      Alert.alert('Permission Required', 'Camera access is needed to analyze images.');
      return;
    }

    setCameraVisible(true);
  };

  const captureImage = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
          exif: false
        });

        setCapturedImage(photo);
        setCameraVisible(false);

        // Analyze the image
        await analyzeImage(photo);
        
      } catch (error) {
        console.error('❌ Image capture failed:', error);
        Alert.alert('Error', 'Failed to capture image.');
      }
    }
  };

  const selectFromGallery = async () => {
    if (!hasPermission?.images) {
      Alert.alert('Permission Required', 'Photo library access is needed.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true
      });

      if (!result.canceled && result.assets[0]) {
        const image = result.assets[0];
        setCapturedImage(image);
        await analyzeImage(image);
      }
    } catch (error) {
      console.error('❌ Gallery selection failed:', error);
    }
  };

  const analyzeImage = async (image) => {
    const analysisText = `Please analyze this ${analysisMode} image and provide health insights.`;
    await sendMessage(analysisText, image);
  };

  const clearChat = () => {
    Alert.alert(
      'Clear Chat History',
      'Are you sure you want to clear all messages?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            setMessages([initialMessage]);
            await AsyncStorage.removeItem('chatHistory');
          }
        }
      ]
    );
  };

  const renderMessage = (message) => {
    const isUser = message.isUser;
    
    return (
      <View key={message.id} style={[
        styles.messageContainer,
        isUser ? styles.userMessage : styles.aiMessage
      ]}>
        {message.type === 'image' && message.image && (
          <Image source={{ uri: message.image.uri }} style={styles.messageImage} />
        )}
        
        <Text style={[
          styles.messageText,
          isUser ? styles.userMessageText : styles.aiMessageText
        ]}>
          {message.text}
        </Text>
        
        {message.emergency && (
          <View style={styles.emergencyBadge}>
            <Ionicons name="warning" size={16} color="#fff" />
            <Text style={styles.emergencyText}>Emergency Detected</Text>
          </View>
        )}
        
        {message.confidence && (
          <Text style={styles.confidenceText}>
            Confidence: {Math.round(message.confidence * 100)}%
          </Text>
        )}
        
        <Text style={styles.timestamp}>
          {message.timestamp.toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  const renderLanguageModal = () => (
    <Modal
      visible={showLanguageModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowLanguageModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Language</Text>
          
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageOption,
                selectedLanguage === lang.code && styles.selectedLanguage
              ]}
              onPress={() => {
                setSelectedLanguage(lang.code);
                setShowLanguageModal(false);
              }}
            >
              <Text style={styles.languageFlag}>{lang.flag}</Text>
              <Text style={styles.languageName}>{lang.name}</Text>
              {selectedLanguage === lang.code && (
                <Ionicons name="checkmark" size={20} color="#FF6B35" />
              )}
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setShowLanguageModal(false)}
          >
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderAnalysisModesModal = () => (
    <Modal
      visible={showAnalysisModes}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowAnalysisModes(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Analysis Mode</Text>
          
          {analysisModes.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={[
                styles.analysisModeOption,
                analysisMode === mode.id && styles.selectedAnalysisMode
              ]}
              onPress={() => {
                setAnalysisMode(mode.id);
                setShowAnalysisModes(false);
              }}
            >
              <Ionicons name={mode.icon} size={24} color="#FF6B35" />
              <View style={styles.analysisModeText}>
                <Text style={styles.analysisModeName}>{mode.name}</Text>
                <Text style={styles.analysisModeDescription}>{mode.description}</Text>
              </View>
              {analysisMode === mode.id && (
                <Ionicons name="checkmark-circle" size={20} color="#FF6B35" />
              )}
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setShowAnalysisModes(false)}
          >
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderCameraModal = () => (
    <Modal
      visible={cameraVisible}
      animationType="slide"
      onRequestClose={() => setCameraVisible(false)}
    >
      <View style={styles.cameraContainer}>
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={Camera.Constants.Type.back}
          ratio="4:3"
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraHeader}>
              <TouchableOpacity
                style={styles.cameraCloseButton}
                onPress={() => setCameraVisible(false)}
              >
                <Ionicons name="close" size={30} color="#fff" />
              </TouchableOpacity>
              
              <Text style={styles.cameraTitle}>
                {analysisModes.find(m => m.id === analysisMode)?.name} Analysis
              </Text>
            </View>
            
            <View style={styles.cameraControls}>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={captureImage}
              >
                <Ionicons name="camera" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </Camera>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>AI Health Assistant</Text>
          <View style={styles.statusIndicator}>
            <View style={[
              styles.statusDot, 
              { backgroundColor: isOnline ? '#4CAF50' : '#FF9800' }
            ]} />
            <Text style={styles.statusText}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowLanguageModal(true)}
          >
            <Ionicons name="language" size={20} color="#FF6B35" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.headerButton}
            onPress={clearChat}
          >
            <Ionicons name="trash-outline" size={20} color="#FF6B35" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
      >
        {messages.map(renderMessage)}
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#FF6B35" />
            <Text style={styles.loadingText}>AI is thinking...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        {/* Analysis Mode Selector */}
        <TouchableOpacity
          style={styles.analysisModeButton}
          onPress={() => setShowAnalysisModes(true)}
        >
          <Ionicons 
            name={analysisModes.find(m => m.id === analysisMode)?.icon} 
            size={20} 
            color="#FF6B35" 
          />
        </TouchableOpacity>

        {/* Text Input */}
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask about your health..."
          placeholderTextColor="#999"
          multiline
          maxLength={500}
        />

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={takePicture}
          >
            <Ionicons name="camera" size={20} color="#FF6B35" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={selectFromGallery}
          >
            <Ionicons name="image" size={20} color="#FF6B35" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.actionButton,
              isListening && styles.listeningButton
            ]}
            onPressIn={startVoiceRecording}
            onPressOut={stopVoiceRecording}
          >
            <Ionicons 
              name={isListening ? "mic" : "mic-outline"} 
              size={20} 
              color={isListening ? "#fff" : "#FF6B35"} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() && !capturedImage) && styles.sendButtonDisabled
            ]}
            onPress={() => sendMessage()}
            disabled={!inputText.trim() && !capturedImage}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modals */}
      {renderLanguageModal()}
      {renderAnalysisModesModal()}
      {renderCameraModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  headerLeft: {
    flex: 1
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6
  },
  statusText: {
    fontSize: 12,
    color: '#666'
  },
  headerButtons: {
    flexDirection: 'row'
  },
  headerButton: {
    padding: 8,
    marginLeft: 8
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16
  },
  messagesContent: {
    paddingVertical: 16
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%'
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF6B35',
    borderRadius: 18,
    borderBottomRightRadius: 4,
    padding: 12
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22
  },
  userMessageText: {
    color: '#fff'
  },
  aiMessageText: {
    color: '#333'
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 8
  },
  emergencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f44336',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 8
  },
  emergencyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4
  },
  confidenceText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 4
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  loadingText: {
    marginLeft: 8,
    color: '#666'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  analysisModeButton: {
    padding: 8,
    marginRight: 8
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    maxHeight: 100,
    fontSize: 16
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  actionButton: {
    padding: 8,
    marginLeft: 4
  },
  listeningButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 20
  },
  sendButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    padding: 12,
    marginLeft: 8
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: width * 0.8,
    maxHeight: height * 0.7
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8
  },
  selectedLanguage: {
    backgroundColor: '#FFF3F0'
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 12
  },
  languageName: {
    flex: 1,
    fontSize: 16
  },
  analysisModeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8
  },
  selectedAnalysisMode: {
    backgroundColor: '#FFF3F0'
  },
  analysisModeText: {
    flex: 1,
    marginLeft: 12
  },
  analysisModeName: {
    fontSize: 16,
    fontWeight: '600'
  },
  analysisModeDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2
  },
  modalCloseButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center'
  },
  modalCloseText: {
    fontSize: 16,
    color: '#333'
  },
  cameraContainer: {
    flex: 1
  },
  camera: {
    flex: 1
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between'
  },
  cameraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20
  },
  cameraCloseButton: {
    padding: 8
  },
  cameraTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  },
  cameraControls: {
    alignItems: 'center',
    paddingBottom: 50
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff'
  }
});

export default AIHealthAssistant;