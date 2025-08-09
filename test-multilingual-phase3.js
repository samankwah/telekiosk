// Phase 3: Enhanced Multilingual Service Test
// Tests the advanced language detection with healthcare context awareness

import { multilingualService } from './src/services/multilingualService.js';

console.log('🌍 TESTING PHASE 3: Enhanced Multilingual Service\n');

// Test cases for different scenarios
const testCases = [
  {
    name: 'English Medical Query',
    text: 'I need to see a doctor for chest pain',
    expectedLanguage: 'en',
    expectedContext: ['medical']
  },
  {
    name: 'Twi Medical Emergency',
    text: 'me ho yare prɛko, mehia ayaresa ntɛm',
    expectedLanguage: 'tw',
    expectedContext: ['medical', 'emergency']
  },
  {
    name: 'Ga Appointment Request',
    text: 'mehia dokita appointment berɛ',
    expectedLanguage: 'ga',
    expectedContext: ['medical', 'appointment']
  },
  {
    name: 'Ewe Emergency Situation',
    text: 'gatagbagba, dɔléle le ŋunye, kpe ɖe ŋunye',
    expectedLanguage: 'ee',
    expectedContext: ['emergency', 'medical']
  },
  {
    name: 'Twi Greeting with Medical',
    text: 'maakye, me yaw na mehia adɔkota',
    expectedLanguage: 'tw',
    expectedContext: ['medical']
  },
  {
    name: 'Code-switching Test',
    text: 'Hello, me ho yare and I need doctor',
    expectedLanguage: 'en', // Should detect primary language
    expectedContext: ['medical']
  },
  {
    name: 'Pure English Greeting',
    text: 'Good morning, how are you?',
    expectedLanguage: 'en',
    expectedContext: []
  },
  {
    name: 'Twi Medical Phrase',
    text: 'kɔ ayaresabea na hwɛ adɔkota',
    expectedLanguage: 'tw',
    expectedContext: ['medical']
  }
];

// Run tests
async function runMultilingualTests() {
  console.log('📊 Phase 3 Multilingual Detection Test Results:');
  console.log('='.repeat(70));
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n${i + 1}. ${testCase.name}`);
    console.log(`   Input: "${testCase.text}"`);
    
    try {
      const result = multilingualService.detectLanguage(testCase.text);
      
      console.log(`   🔍 Detected Language: ${result.language} (${multilingualService.getLanguageName(result.language)})`);
      console.log(`   🎯 Confidence: ${(result.confidence * 100).toFixed(1)}%`);
      
      if (result.context && result.context.detectedContext.length > 0) {
        console.log(`   📋 Context: ${result.context.detectedContext.join(', ')}`);
      } else {
        console.log(`   📋 Context: none detected`);
      }
      
      if (result.healthcareRelevant) {
        console.log(`   🏥 Healthcare Relevant: YES`);
      } else {
        console.log(`   🏥 Healthcare Relevant: NO`);
      }
      
      if (result.multiLanguage && result.multiLanguage.detected) {
        console.log(`   🌐 Code-switching: ${result.multiLanguage.languages.join(', ')}`);
      }
      
      if (result.recommendedResponse) {
        console.log(`   💡 Response Style: ${result.recommendedResponse.responseStyle}`);
        console.log(`   ⚠️ Urgency: ${result.recommendedResponse.urgency}`);
      }
      
      // Check if language matches expected
      const languageCorrect = result.language === testCase.expectedLanguage;
      console.log(`   ✅ Language Test: ${languageCorrect ? 'PASSED' : 'FAILED'} (Expected: ${testCase.expectedLanguage})`);
      
      // Check if context is detected correctly
      const contextCorrect = testCase.expectedContext.length === 0 ? 
        result.context.detectedContext.length === 0 :
        testCase.expectedContext.some(ctx => result.context.detectedContext.includes(ctx));
      console.log(`   ✅ Context Test: ${contextCorrect ? 'PASSED' : 'FAILED'} (Expected: ${testCase.expectedContext.join(', ') || 'none'})`);
      
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(70));
  
  // Test service status
  console.log('\n🔧 Service Status:');
  const status = multilingualService.getStatus();
  console.log(`   Phase: ${status.phase}`);
  console.log(`   Version: ${status.version}`);
  console.log(`   Languages: ${status.supportedLanguages.map(l => l.name).join(', ')}`);
  console.log(`   Healthcare Terms: ${status.patternStats.healthcareTermsCount}`);
  console.log(`   Medical Phrases: ${status.patternStats.medicalPhrasesCount}`);
  console.log(`   Context Patterns: Medical(${status.contextPatterns.medical}), Appointment(${status.contextPatterns.appointment}), Emergency(${status.contextPatterns.emergency})`);
  
  // Test specific healthcare capabilities
  console.log('\n🏥 Healthcare Capabilities:');
  const capabilities = status.capabilities;
  console.log(`   Healthcare Terminology: ${capabilities.healthcareTerminology ? 'ENABLED' : 'DISABLED'}`);
  console.log(`   Medical Phrase Recognition: ${capabilities.medicalPhraseRecognition ? 'ENABLED' : 'DISABLED'}`);
  console.log(`   Contextual Detection: ${capabilities.contextualDetection ? 'ENABLED' : 'DISABLED'}`);
  console.log(`   Code-switching Detection: ${capabilities.codeSwitchingDetection ? 'ENABLED' : 'DISABLED'}`);
  
  // Test different language greetings
  console.log('\n👋 Multilingual Greetings:');
  const languages = ['en', 'tw', 'ga', 'ee'];
  languages.forEach(lang => {
    const greeting = multilingualService.getGreeting(lang);
    console.log(`   ${multilingualService.getLanguageName(lang)}: ${greeting}`);
  });
  
  console.log('\n✅ Phase 3 Enhanced Multilingual Service Test Complete!');
  console.log('🌍 System ready for advanced multilingual healthcare support.');
}

// Run the tests
runMultilingualTests().catch(console.error);