// Enhanced Emergency Detection Service with ML-based Analysis
// Advanced emergency detection using pattern recognition and context analysis

import { analyticsService } from './analyticsService';
import { multilingualService } from './multilingualService';

class EnhancedEmergencyService {
  constructor() {
    this.emergencyPatterns = this.initializeEmergencyPatterns();
    this.contextualFactors = {
      timeOfDay: null,
      previousMessages: [],
      symptomProgression: [],
      urgencyMarkers: []
    };
    
    // Machine learning-like scoring weights
    this.scoringWeights = {
      directSymptoms: 3.0,
      urgencyWords: 2.5,
      contextualClues: 2.0,
      symptomCombination: 2.8,
      timeProgression: 1.5,
      languageIntensity: 1.8
    };

    this.emergencyThresholds = {
      critical: 8.0,
      high: 6.0,
      medium: 4.0,
      low: 2.0
    };
  }

  /**
   * Initialize emergency patterns for different languages
   */
  initializeEmergencyPatterns() {
    return {
      // English patterns
      en: {
        critical: {
          symptoms: [
            'chest pain', 'heart attack', 'can\'t breathe', 'not breathing', 'unconscious',
            'severe bleeding', 'stroke', 'seizure', 'cardiac arrest', 'choking',
            'severe burns', 'poisoning', 'overdose', 'no pulse', 'collapsed'
          ],
          urgencyWords: [
            'emergency', 'urgent', 'immediate', 'help', 'dying', 'critical',
            'severe', 'intense', 'excruciating', 'unbearable'
          ],
          contextualClues: [
            'call ambulance', '999', '193', 'hospital now', 'emergency room',
            'can\'t wait', 'getting worse', 'very bad', 'extreme pain'
          ]
        },
        high: {
          symptoms: [
            'severe pain', 'difficulty breathing', 'severe headache', 'high fever',
            'vomiting blood', 'severe abdominal pain', 'confusion', 'dizziness',
            'severe allergic reaction', 'broken bone', 'deep cut'
          ],
          urgencyWords: [
            'very', 'really', 'extremely', 'terrible', 'awful', 'bad',
            'worried', 'scared', 'frightened'
          ],
          contextualClues: [
            'need doctor', 'see doctor', 'medical help', 'getting sick',
            'feel terrible', 'something wrong'
          ]
        },
        medium: {
          symptoms: [
            'headache', 'nausea', 'fever', 'pain', 'dizzy', 'tired',
            'cough', 'sore throat', 'stomachache', 'rash'
          ],
          urgencyWords: [
            'uncomfortable', 'unwell', 'sick', 'not feeling good'
          ],
          contextualClues: [
            'need medication', 'book appointment', 'see nurse',
            'health concern', 'medical advice'
          ]
        }
      },

      // Twi patterns
      tw: {
        critical: {
          symptoms: [
            'akoma mu yaw', 'akoma yareɛ', 'mentumi nna', 'minnyan',
            'mogya rebu', 'stroke', 'bɔne', 'akoma agyae', 'mogya pii'
          ],
          urgencyWords: [
            'prɛko', 'ntɛm', 'mmara', 'boa me', 'merewu', 'ɛyɛ den',
            'ɛyɛ yaw', 'minsɛe'
          ],
          contextualClues: [
            'frɛ ambulance', 'frɛ 999', 'kɔ ayaresabea', 'prɛko',
            'mmentumi twɛn', 'ɛreyɛ bɔne'
          ]
        },
        high: {
          symptoms: [
            'yaw kɛse', 'minsumi nna yie', 'ti yaw kɛse', 'huraeɛ',
            'metofe mogya', 'yafunu mu yaw', 'mi nkwa', 'me nko'
          ],
          urgencyWords: [
            'ɛyɛ', 'ampa', 'kɛse', 'yaw', 'ɛyɛ me ya', 'misuroe'
          ],
          contextualClues: [
            'mehia adɔkota', 'kɔhwɛ adɔkota', 'aduro', 'ayaresa'
          ]
        }
      },

      // Ga patterns  
      ga: {
        critical: {
          symptoms: [
            'akoma yaw', 'akoma yarɛɛ', 'mantumi naa', 'mi nnyen',
            'mogya bu', 'stroke', 'yɛɛ', 'akoma gyae'
          ],
          urgencyWords: [
            'prɛko', 'kaba', 'boa mi', 'mi wu', 'ɛyɛ bɔne', 'yaw kɛkɛ'
          ],
          contextualClues: [
            'frɛ ambulance', 'frɛ 999', 'kɔ ayarɛjɔɔ', 'prɛko'
          ]
        }
      },

      // Ewe patterns
      ee: {
        critical: {
          symptoms: [
            'dzi me ve', 'dzi ƒe dɔléle', 'nyemate ŋu gbɔ̃ o', 'ku',
            'ʋu dzadzɛ', 'stroke', 'dɔléle sesẽ'
          ],
          urgencyWords: [
            'gatagbagba', 'kaba', 'kpe ɖe ŋunye', 'meku', 'sesẽ'
          ],
          contextualClues: [
            'yɔ ambulance', 'yɔ 999', 'yi kɔdzi', 'gatagbagba'
          ]
        }
      }
    };
  }

  /**
   * Analyze text for emergency indicators with enhanced ML-like approach
   */
  analyzeEmergency(text, context = {}) {
    const analysisStart = Date.now();
    
    try {
      // Detect language first
      const languageDetection = multilingualService.detectLanguage(text);
      const language = languageDetection.language;
      const patterns = this.emergencyPatterns[language] || this.emergencyPatterns.en;

      // Initialize scoring
      let emergencyScore = 0;
      let detectedSymptoms = [];
      let detectedUrgencyWords = [];
      let detectedContextualClues = [];
      let severityLevel = 'none';

      const cleanText = text.toLowerCase().trim();
      
      // 1. Direct symptom analysis
      for (const [level, data] of Object.entries(patterns)) {
        const levelMultiplier = level === 'critical' ? 3 : level === 'high' ? 2 : 1;
        
        // Check symptoms
        data.symptoms?.forEach(symptom => {
          if (cleanText.includes(symptom)) {
            detectedSymptoms.push({ symptom, level, score: levelMultiplier * this.scoringWeights.directSymptoms });
            emergencyScore += levelMultiplier * this.scoringWeights.directSymptoms;
          }
        });

        // Check urgency words
        data.urgencyWords?.forEach(word => {
          if (cleanText.includes(word)) {
            detectedUrgencyWords.push({ word, level, score: levelMultiplier * this.scoringWeights.urgencyWords });
            emergencyScore += levelMultiplier * this.scoringWeights.urgencyWords;
          }
        });

        // Check contextual clues
        data.contextualClues?.forEach(clue => {
          if (cleanText.includes(clue)) {
            detectedContextualClues.push({ clue, level, score: levelMultiplier * this.scoringWeights.contextualClues });
            emergencyScore += levelMultiplier * this.scoringWeights.contextualClues;
          }
        });
      }

      // 2. Advanced pattern analysis
      emergencyScore += this.analyzeAdvancedPatterns(cleanText, context);

      // 3. Contextual factor analysis
      emergencyScore += this.analyzeContextualFactors(text, context);

      // 4. Symptom combination analysis
      emergencyScore += this.analyzeSymptomCombinations(detectedSymptoms);

      // 5. Language intensity analysis
      emergencyScore += this.analyzeLanguageIntensity(cleanText, language);

      // Determine severity level
      if (emergencyScore >= this.emergencyThresholds.critical) {
        severityLevel = 'critical';
      } else if (emergencyScore >= this.emergencyThresholds.high) {
        severityLevel = 'high';
      } else if (emergencyScore >= this.emergencyThresholds.medium) {
        severityLevel = 'medium';  
      } else if (emergencyScore >= this.emergencyThresholds.low) {
        severityLevel = 'low';
      }

      const analysisTime = Date.now() - analysisStart;

      const result = {
        detected: severityLevel !== 'none',
        severity: severityLevel,
        confidence: Math.min(emergencyScore / 10, 1.0),
        score: emergencyScore,
        language: language,
        detectedSymptoms,
        detectedUrgencyWords,
        detectedContextualClues,
        analysisTime,
        recommendations: this.generateRecommendations(severityLevel, detectedSymptoms),
        emergencyMessage: this.getEmergencyMessage(severityLevel, language)
      };

      // Track analysis
      analyticsService.trackEvent('enhanced_emergency_analysis', {
        severity: severityLevel,
        score: emergencyScore,
        language: language,
        analysisTime,
        symptomsCount: detectedSymptoms.length,
        confidence: result.confidence
      });

      return result;

    } catch (error) {
      console.error('❌ Enhanced emergency analysis error:', error);
      analyticsService.trackError(error, { service: 'enhancedEmergency' });
      
      // Fallback to basic detection
      return this.basicEmergencyDetection(text);
    }
  }

  /**
   * Analyze advanced patterns (multiple symptoms, progression, etc.)
   */
  analyzeAdvancedPatterns(text, context) {
    let advancedScore = 0;

    // Multiple symptom pattern
    const symptomCount = this.countSymptomMentions(text);
    if (symptomCount >= 3) {
      advancedScore += 2.0;
    } else if (symptomCount >= 2) {
      advancedScore += 1.0;
    }

    // Progression indicators
    const progressionWords = ['getting worse', 'worsening', 'spreading', 'increasing', 'more painful'];
    if (progressionWords.some(word => text.includes(word))) {
      advancedScore += 1.5;
    }

    // Time urgency indicators
    const timeUrgentWords = ['now', 'immediately', 'right away', 'can\'t wait', 'urgent'];
    if (timeUrgentWords.some(word => text.includes(word))) {
      advancedScore += 1.2;
    }

    // Intensity indicators
    const intensityWords = ['severe', 'extreme', 'unbearable', 'excruciating', '10/10', 'worst'];
    if (intensityWords.some(word => text.includes(word))) {
      advancedScore += 1.8;
    }

    return advancedScore;
  }

  /**
   * Analyze contextual factors
   */
  analyzeContextualFactors(text, context) {
    let contextScore = 0;

    // Time of day factor
    const hour = new Date().getHours();
    if (hour < 6 || hour > 22) {
      // Late night/early morning increases urgency
      contextScore += 0.5;
    }

    // Previous message context
    if (context.previousMessages && context.previousMessages.length > 0) {
      const recentMessages = context.previousMessages.slice(-3);
      const hasHealthConcerns = recentMessages.some(msg => 
        msg.content.toLowerCase().includes('pain') || 
        msg.content.toLowerCase().includes('sick') ||
        msg.content.toLowerCase().includes('hurt')
      );
      
      if (hasHealthConcerns) {
        contextScore += 1.0;
      }
    }

    // Repeat mentions (if same symptoms mentioned multiple times)
    if (context.symptomProgression && context.symptomProgression.length > 1) {
      contextScore += 0.8;
    }

    return contextScore;
  }

  /**
   * Analyze symptom combinations for higher risk patterns
   */
  analyzeSymptomCombinations(detectedSymptoms) {
    let combinationScore = 0;

    // High-risk combinations
    const riskyCombinations = [
      ['chest pain', 'difficulty breathing'],
      ['severe headache', 'confusion'],
      ['abdominal pain', 'vomiting blood'],
      ['high fever', 'difficulty breathing']
    ];

    const symptomTexts = detectedSymptoms.map(s => s.symptom);
    
    riskyCombinations.forEach(combination => {
      if (combination.every(symptom => 
        symptomTexts.some(detected => detected.includes(symptom))
      )) {
        combinationScore += 2.5;
      }
    });

    return combinationScore;
  }

  /**
   * Analyze language intensity and emotional markers
   */
  analyzeLanguageIntensity(text, language) {
    let intensityScore = 0;

    // Emotional intensity markers
    const intensityMarkers = {
      en: ['!', 'please', 'help', 'scared', 'worried', 'terrible', 'awful'],
      tw: ['!', 'mepa wo kyɛw', 'boa me', 'misuroe', 'ɛyɛ me ya'],
      ga: ['!', 'mepa wo kyɛw', 'boa mi', 'misuroe'],
      ee: ['!', 'meɖe kuku', 'kpe ɖe ŋunye', 'vɔvɔ̃m']
    };

    const markers = intensityMarkers[language] || intensityMarkers.en;
    
    markers.forEach(marker => {
      const count = (text.match(new RegExp(marker, 'gi')) || []).length;
      intensityScore += count * 0.3;
    });

    // ALL CAPS detection (indicates urgency)
    const capsWords = text.match(/[A-Z]{3,}/g);
    if (capsWords && capsWords.length > 0) {
      intensityScore += capsWords.length * 0.5;
    }

    return Math.min(intensityScore, 2.0); // Cap at 2.0
  }

  /**
   * Count symptom mentions in text
   */
  countSymptomMentions(text) {
    const allSymptoms = Object.values(this.emergencyPatterns.en)
      .flatMap(level => level.symptoms || []);
    
    return allSymptoms.filter(symptom => text.includes(symptom)).length;
  }

  /**
   * Generate recommendations based on severity
   */
  generateRecommendations(severity, symptoms) {
    const recommendations = {
      critical: [
        'Call emergency services immediately (999 or 193)',
        'Go to the nearest Emergency Department now',
        'Do not drive yourself - call an ambulance',
        'If symptoms worsen, call for immediate help'
      ],
      high: [
        'Seek immediate medical attention',
        'Call the hospital at +233-599-211-311',
        'Consider going to the Emergency Department',
        'Monitor symptoms closely'
      ],
      medium: [
        'Schedule an urgent appointment with a doctor',
        'Call the hospital for medical advice',
        'Monitor symptoms and seek help if they worsen',
        'Consider booking a same-day appointment'
      ],
      low: [
        'Schedule a routine appointment with a doctor',
        'Monitor symptoms for any changes',
        'Call if symptoms persist or worsen',
        'Consider self-care measures while monitoring'
      ]
    };

    return recommendations[severity] || recommendations.low;
  }

  /**
   * Get emergency message in appropriate language
   */
  getEmergencyMessage(severity, language) {
    if (severity === 'none' || severity === 'low') return null;

    const messages = {
      critical: multilingualService.getEmergencyMessage(language),
      high: {
        en: '⚠️ Your symptoms require urgent medical attention. Please call our hospital at +233-599-211-311 or visit our Emergency Department.',
        tw: '⚠️ Wo yarɛɛ hwehwɛ prɛko ayaresa. Yɛ sɛ wofrɛ yɛn ayaresabea wɔ +233-599-211-311 anaa kɔ yɛn Prɛko Dwumadibea.',
        ga: '⚠️ Wo yarɛɛ hwehwɛ prɛko ayarɛsa. Frɛ yɛn ayarɛjɔɔ wɔ +233-599-211-311 sane kɔ yɛn Prɛko Yitsoo.',
        ee: '⚠️ Wò ƒe dɔléleawo hiã kpekpeɖeŋu kabakaba. Taflatse yɔ míaƒe kɔdzi le +233-599-211-311 alo yi míaƒe Gatagbagba ƒe nɔƒe.'
      },
      medium: {
        en: '⚠️ You should seek medical consultation for your symptoms. Please call +233-599-211-311 to book an appointment.',
        tw: '⚠️ Ɛsɛ sɛ wokɔhwɛ adɔkota wɔ wo yarɛɛ ho. Yɛ sɛ wofrɛ +233-599-211-311 na woabɛtumi akɔhwɛ adɔkota.',
        ga: '⚠️ Ɛsɛ sɛ wokɔhwɛ dokita wɔ wo yarɛɛ ho. Frɛ +233-599-211-311 na woaba dokita gbɔ.',
        ee: '⚠️ Ele be nàyi dokita gbɔ ɖe wò dɔléleawo ta. Taflatse yɔ +233-599-211-311 be nàɖo takpekpe.'
      }
    };

    const severityMessages = messages[severity];
    return severityMessages?.[language] || severityMessages?.en || null;
  }

  /**
   * Basic emergency detection fallback
   */
  basicEmergencyDetection(text) {
    const basicPatterns = ['emergency', 'urgent', 'help', 'pain', 'sick'];
    const detected = basicPatterns.some(pattern => text.toLowerCase().includes(pattern));
    
    return {
      detected,
      severity: detected ? 'medium' : 'none',
      confidence: detected ? 0.5 : 0,
      score: detected ? 3.0 : 0,
      language: 'en',
      detectedSymptoms: [],
      detectedUrgencyWords: [],
      detectedContextualClues: [],
      analysisTime: 0,
      recommendations: detected ? this.generateRecommendations('medium', []) : [],
      emergencyMessage: detected ? this.getEmergencyMessage('medium', 'en') : null
    };
  }

  /**
   * Update context for better analysis
   */
  updateContext(newMessage, messageHistory = []) {
    this.contextualFactors.previousMessages = messageHistory.slice(-5);
    this.contextualFactors.timeOfDay = new Date().getHours();
    
    // Track symptom progression
    const analysis = this.analyzeEmergency(newMessage.content);
    if (analysis.detectedSymptoms.length > 0) {
      this.contextualFactors.symptomProgression.push({
        timestamp: Date.now(),
        symptoms: analysis.detectedSymptoms,
        severity: analysis.severity
      });
      
      // Keep only recent progression (last 30 minutes)
      const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
      this.contextualFactors.symptomProgression = 
        this.contextualFactors.symptomProgression.filter(item => item.timestamp > thirtyMinutesAgo);
    }
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      initialized: true,
      supportedLanguages: Object.keys(this.emergencyPatterns),
      emergencyThresholds: this.emergencyThresholds,
      scoringWeights: this.scoringWeights,
      capabilities: {
        multilingualDetection: true,
        mlBasedScoring: true,
        contextualAnalysis: true,
        symptomCombination: true,
        progressionTracking: true,
        languageIntensity: true
      }
    };
  }
}

// Create and export singleton instance
export const enhancedEmergencyService = new EnhancedEmergencyService();
export default enhancedEmergencyService;