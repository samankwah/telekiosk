// Phase 3: Enhanced Emergency Detection Test
// Tests the advanced ML-powered emergency detection system

import { enhancedEmergencyService } from './src/services/enhancedEmergencyService.js';

console.log('🧪 TESTING PHASE 3: Enhanced Emergency Detection System\n');

// Test cases for different emergency scenarios
const testCases = [
  {
    name: 'Critical Emergency - Chest Pain',
    text: 'I have severe chest pain and can\'t breathe properly',
    expectedSeverity: 'critical'
  },
  {
    name: 'Critical Emergency with Vital Signs',
    text: 'My blood pressure is very high and I have chest pain, pulse is rapid',
    expectedSeverity: 'critical'
  },
  {
    name: 'High Emergency - Severe Pain',
    text: 'I have extreme headache and feel very dizzy',
    expectedSeverity: 'high'
  },
  {
    name: 'Medium Emergency - General Symptoms',
    text: 'I have been feeling nauseous and have a fever',
    expectedSeverity: 'medium'
  },
  {
    name: 'Behavioral Markers Test',
    text: 'I am confused and can\'t speak clearly, feeling panicky',
    expectedSeverity: 'high'
  },
  {
    name: 'Escalation Test',
    text: 'The pain is getting worse and spreading to my arm',
    expectedSeverity: 'high'
  },
  {
    name: 'No Emergency',
    text: 'I want to book an appointment for next week',
    expectedSeverity: 'none'
  }
];

// Run tests
async function runEmergencyDetectionTests() {
  console.log('📊 Enhanced Emergency Detection Test Results:');
  console.log('='.repeat(60));
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n${i + 1}. ${testCase.name}`);
    console.log(`   Input: "${testCase.text}"`);
    
    try {
      const result = enhancedEmergencyService.analyzeEmergency(testCase.text, {
        timeOfDay: new Date().getHours(),
        previousMessages: []
      });
      
      console.log(`   🔍 Detected: ${result.detected ? 'YES' : 'NO'}`);
      console.log(`   📊 Severity: ${result.severity}`);
      console.log(`   🎯 Confidence: ${(result.confidence * 100).toFixed(1)}%`);
      console.log(`   📈 Score: ${result.score.toFixed(2)}`);
      console.log(`   🗣️ Language: ${result.language}`);
      console.log(`   ⏱️ Analysis Time: ${result.analysisTime}ms`);
      
      if (result.advancedAnalysis) {
        console.log(`   🩺 Vital Signs: ${result.advancedAnalysis.vitalSignsDetected ? 'YES' : 'NO'}`);
        console.log(`   🧠 Behavioral: ${result.advancedAnalysis.behavioralConcerns ? 'YES' : 'NO'}`);
        console.log(`   ⚠️ Risk Factors: ${result.advancedAnalysis.riskFactors.length}`);
      }
      
      // Check if emergency notification would be triggered
      if (result.severity === 'critical' && result.confidence >= 0.8) {
        console.log(`   🚨 HOSPITAL NOTIFICATION: WOULD BE TRIGGERED`);
      }
      
      // Verify expected results
      const passed = result.severity === testCase.expectedSeverity;
      console.log(`   ✅ Test: ${passed ? 'PASSED' : 'FAILED'} (Expected: ${testCase.expectedSeverity})`);
      
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  
  // Test service status
  console.log('\n🔧 Service Status:');
  const status = enhancedEmergencyService.getStatus();
  console.log(`   Phase: ${status.phase}`);
  console.log(`   Version: ${status.version}`);
  console.log(`   Languages: ${status.supportedLanguages.join(', ')}`);
  console.log(`   Hospital Notifications: ${status.capabilities.hospitalNotification ? 'ENABLED' : 'DISABLED'}`);
  console.log(`   Advanced Capabilities: ${Object.keys(status.capabilities).filter(k => status.capabilities[k]).length}`);
  console.log(`   Performance: ${status.performance.averageAnalysisTime}`);
  console.log(`   Accuracy: ${(status.performance.accuracyRate * 100).toFixed(1)}%`);
  
  console.log('\n✅ Phase 3 Enhanced Emergency Detection Test Complete!');
  console.log('🏥 System ready for advanced emergency detection with hospital notifications.');
}

// Run the tests
runEmergencyDetectionTests().catch(console.error);