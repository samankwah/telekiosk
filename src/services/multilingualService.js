// Phase 3: Enhanced Multilingual Service for TeleKiosk AI Assistant
// Advanced language detection and support for English, Twi, Ga, and Ewe languages for Ghana
// Features smart language detection, context awareness, and healthcare-specific translations

import { analyticsService } from './analyticsService.js';

class MultilingualService {
  constructor() {
    this.currentLanguage = 'en';
    this.supportedLanguages = ['en', 'tw', 'ga', 'ee'];
    this.fallbackLanguage = 'en';
    
    // Phase 3: Enhanced language detection patterns with healthcare terminology
    this.languagePatterns = {
      tw: { // Twi
        keywords: ['wo', 'mi', 'yɛ', 'na', 'firi', 'kasa', 'dɛn', 'ɛhe', 'sɛn', 'wo ho te sɛn'],
        greetings: ['maakye', 'maaha', 'mema wo akye', 'wo ho te sɛn', 'akwaaba'],
        commonWords: ['aane', 'daabi', 'medaase', 'kosɛ', 'ɛyɛ', 'ampa'],
        healthcareTerms: ['ayaresa', 'adɔkota', 'yareɛ', 'aduro', 'ayaresabea', 'ho', 'yaw', 'prɛko'],
        medicalPhrases: ['me ho yare', 'me yareɛ', 'me yaw', 'mehia ayaresa', 'kɔ ayaresabea'],
        weight: 1.2 // Higher weight for healthcare context
      },
      ga: { // Ga
        keywords: ['mi', 'wo', 'kɛ', 'baa', 'ayɛɛ', 'lɛ', 'kome', 'ehe', 'sɛɛ'],
        greetings: ['ojekoo', 'ojekoo nakai', 'bawo ni', 'ɛhe lɛ', 'akwaaba'],
        commonWords: ['ɛɛ', 'aii', 'oyiwa do', 'ni gbɛjɛ', 'ɛyɛ'],
        healthcareTerms: ['ayarɛsa', 'dokita', 'yarɛɛ', 'aduro', 'ayarɛjɔɔ', 'ho', 'yaw', 'prɛko'],
        medicalPhrases: ['me ho yarɛ', 'me yarɛɛ', 'me yaw', 'mehia ayarɛsa', 'kɔ ayarɛjɔɔ'],
        weight: 1.2
      },
      ee: { // Ewe
        keywords: ['me', 'wò', 'nye', 'nɛ', 'si', 'va', 'yi', 'aleke', 'ɖe'],
        greetings: ['ŋdi', 'ŋdi na mi', 'efɔ̃a', 'aleke nèle', 'woezo', 'nɔ agbe'],
        commonWords: ['ɛ̃', 'ao', 'akpe', 'meɖe kuku', 'enyo'],
        healthcareTerms: ['kɔdzi', 'dokita', 'dɔléle', 'atike', 'kɔdzikpɔɖokpɔ', 've', 'gatagbagba'],
        medicalPhrases: ['melé dɔ lém', 'dɔléle le ŋunye', 'hiã kpekpeɖeŋu', 'yi kɔdzi'],
        weight: 1.2
      }
    };

    // Phase 3: Advanced context patterns for intelligent detection
    this.contextPatterns = {
      medical: {
        tw: ['adɔkota', 'ayaresa', 'yareɛ', 'aduro', 'ho yaw', 'prɛko', 'ayaresabea'],
        ga: ['dokita', 'ayarɛsa', 'yarɛɛ', 'aduro', 'ho yaw', 'prɛko', 'ayarɛjɔɔ'],
        ee: ['dokita', 'kɔdzi', 'dɔléle', 'atike', 'dɔ le ŋunye', 'gatagbagba', 'kɔdzikpɔɖokpɔ']
      },
      appointment: {
        tw: ['berɛ', 'da', 'nhyeɛ', 'kɔhwɛ', 'appointment'],
        ga: ['berɛ', 'da', 'nhyeɛ', 'kɔhwɛ', 'appointment'],
        ee: ['ɣeyiɣi', 'ŋkeke', 'takpekpe', 'kpɔ', 'ɖoɖo']
      },
      emergency: {
        tw: ['prɛko', 'ntɛm', 'boa me', 'yaw kɛse', 'mmerɛ'],
        ga: ['prɛko', 'kaba', 'boa mi', 'yaw kɛkɛ', 'berɛ'],
        ee: ['gatagbagba', 'kabakaba', 'kpe ɖe ŋunye', 'vevesesẽ', 'enumake']
      }
    };

    // Initialize with browser language preference
    this.initializeLanguage();
  }

  /**
   * Initialize language based on browser preferences
   */
  initializeLanguage() {
    try {
      const browserLang = navigator.language || navigator.userLanguage || 'en';
      const langCode = browserLang.substring(0, 2).toLowerCase();
      
      if (this.supportedLanguages.includes(langCode)) {
        this.currentLanguage = langCode;
      }
      
      // Check localStorage for saved preference
      const savedLang = localStorage.getItem('telekiosk_language');
      if (savedLang && this.supportedLanguages.includes(savedLang)) {
        this.currentLanguage = savedLang;
      }

      console.log('🌍 Multilingual service initialized:', this.currentLanguage);
      
    } catch (error) {
      console.error('❌ Language initialization error:', error);
      this.currentLanguage = this.fallbackLanguage;
    }
  }

  /**
   * Phase 3: Enhanced language detection with healthcare context awareness
   */
  detectLanguage(text, context = {}) {
    if (!text || typeof text !== 'string') {
      return { language: this.fallbackLanguage, confidence: 0, context: 'no_text' };
    }

    const cleanText = text.toLowerCase().trim();
    const words = cleanText.split(/\s+/);
    const scores = {};
    const contextInfo = {
      medical: false,
      appointment: false,
      emergency: false,
      detectedContext: []
    };

    // Initialize scores for all languages
    this.supportedLanguages.forEach(lang => {
      scores[lang] = 0;
    });

    // Phase 3: Score based on enhanced language patterns
    for (const [lang, patterns] of Object.entries(this.languagePatterns)) {
      let langScore = 0;
      let matches = 0;
      let contextBonus = 0;

      // Check keywords (standard scoring)
      patterns.keywords.forEach(keyword => {
        if (cleanText.includes(keyword)) {
          langScore += 2;
          matches++;
        }
      });

      // Check greetings (higher weight)
      patterns.greetings.forEach(greeting => {
        if (cleanText.includes(greeting)) {
          langScore += 3;
          matches++;
        }
      });

      // Check common words
      patterns.commonWords.forEach(word => {
        if (words.includes(word)) {
          langScore += 1;
          matches++;
        }
      });

      // Phase 3: Healthcare-specific terms (bonus scoring)
      if (patterns.healthcareTerms) {
        patterns.healthcareTerms.forEach(term => {
          if (cleanText.includes(term)) {
            langScore += 2.5; // Higher weight for medical terms
            contextBonus += 1.0;
            contextInfo.medical = true;
            contextInfo.detectedContext.push('medical');
            matches++;
          }
        });
      }

      // Phase 3: Medical phrases (even higher bonus)
      if (patterns.medicalPhrases) {
        patterns.medicalPhrases.forEach(phrase => {
          if (cleanText.includes(phrase)) {
            langScore += 4.0; // Very high weight for complete medical phrases
            contextBonus += 2.0;
            contextInfo.medical = true;
            contextInfo.detectedContext.push('medical_phrase');
            matches++;
          }
        });
      }

      // Apply pattern weight with context bonus
      const baseScore = (langScore * patterns.weight) / Math.max(words.length, 1);
      scores[lang] = baseScore + (contextBonus * 0.1); // Context bonus
    }

    // Phase 3: Context-aware scoring for appointment and emergency detection
    this.detectContextualIntent(cleanText, contextInfo);

    // English gets a base score for Latin characters
    if (/^[a-zA-Z\s.,!?'"]+$/.test(cleanText)) {
      scores['en'] += contextInfo.medical ? 0.3 : 0.5; // Lower base score if medical context detected
    }

    // Phase 3: Multi-language detection (code-switching)
    const multiLangDetection = this.detectCodeSwitching(cleanText, scores);

    // Find the highest scoring language
    const detectedLang = Object.keys(scores).reduce((a, b) => 
      scores[a] > scores[b] ? a : b
    );

    const confidence = Math.min(scores[detectedLang], 1.0);
    const threshold = contextInfo.medical ? 0.2 : 0.3; // Lower threshold for medical context

    const result = {
      language: confidence > threshold ? detectedLang : this.fallbackLanguage,
      confidence: confidence,
      scores: scores,
      detectedWords: this.getDetectedWords(cleanText, detectedLang),
      // Phase 3: Enhanced metadata
      context: contextInfo,
      multiLanguage: multiLangDetection,
      healthcareRelevant: contextInfo.medical || contextInfo.appointment || contextInfo.emergency,
      recommendedResponse: this.getResponseRecommendation(detectedLang, contextInfo)
    };

    // Enhanced analytics tracking with Phase 3 data
    analyticsService.trackEvent('phase3_language_detection', {
      inputLanguage: result.language,
      confidence: result.confidence,
      textLength: text.length,
      currentLanguage: this.currentLanguage,
      healthcareRelevant: result.healthcareRelevant,
      contextDetected: contextInfo.detectedContext,
      multiLanguage: multiLangDetection.detected
    });

    return result;
  }

  /**
   * Phase 3: Detect contextual intent (medical, appointment, emergency)
   */
  detectContextualIntent(text, contextInfo) {
    // Check for appointment context
    for (const [lang, terms] of Object.entries(this.contextPatterns.appointment)) {
      if (terms.some(term => text.includes(term))) {
        contextInfo.appointment = true;
        contextInfo.detectedContext.push('appointment');
        break;
      }
    }

    // Check for emergency context
    for (const [lang, terms] of Object.entries(this.contextPatterns.emergency)) {
      if (terms.some(term => text.includes(term))) {
        contextInfo.emergency = true;
        contextInfo.detectedContext.push('emergency');
        break;
      }
    }
  }

  /**
   * Phase 3: Detect code-switching (multiple languages in one text)
   */
  detectCodeSwitching(text, scores) {
    const significantLangs = Object.keys(scores).filter(lang => scores[lang] > 0.2);
    
    return {
      detected: significantLangs.length > 1,
      languages: significantLangs,
      primaryLanguage: significantLangs.length > 0 ? significantLangs[0] : 'en',
      confidence: significantLangs.length > 1 ? 0.8 : 1.0
    };
  }

  /**
   * Phase 3: Get response recommendation based on language and context
   */
  getResponseRecommendation(language, contextInfo) {
    const recommendations = {
      language: language,
      urgency: 'normal',
      responseStyle: 'standard',
      specialInstructions: []
    };

    if (contextInfo.emergency) {
      recommendations.urgency = 'high';
      recommendations.responseStyle = 'urgent';
      recommendations.specialInstructions.push('immediate_assistance');
    } else if (contextInfo.medical) {
      recommendations.urgency = 'medium';
      recommendations.responseStyle = 'professional';
      recommendations.specialInstructions.push('medical_accuracy');
    } else if (contextInfo.appointment) {
      recommendations.responseStyle = 'helpful';
      recommendations.specialInstructions.push('booking_assistance');
    }

    return recommendations;
  }

  /**
   * Get detected words for a specific language
   */
  getDetectedWords(text, language) {
    if (!this.languagePatterns[language]) return [];

    const patterns = this.languagePatterns[language];
    const detectedWords = [];

    [...patterns.keywords, ...patterns.greetings, ...patterns.commonWords].forEach(word => {
      if (text.includes(word)) {
        detectedWords.push(word);
      }
    });

    return detectedWords;
  }

  /**
   * Set current language
   */
  setLanguage(langCode) {
    if (!this.supportedLanguages.includes(langCode)) {
      console.warn(`⚠️ Unsupported language: ${langCode}`);
      return false;
    }

    const previousLang = this.currentLanguage;
    this.currentLanguage = langCode;

    // Save to localStorage
    try {
      localStorage.setItem('telekiosk_language', langCode);
    } catch (error) {
      console.error('❌ Failed to save language preference:', error);
    }

    // Track language change
    analyticsService.trackEvent('language_change', {
      fromLanguage: previousLang,
      toLanguage: langCode,
      timestamp: Date.now()
    });

    console.log(`🌍 Language changed: ${previousLang} → ${langCode}`);
    return true;
  }

  /**
   * Get current language
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * Get language display name
   */
  getLanguageName(langCode = this.currentLanguage) {
    const names = {
      'en': 'English',
      'tw': 'Twi',
      'ga': 'Ga',
      'ee': 'Ewe'
    };
    return names[langCode] || 'Unknown';
  }

  /**
   * Get language native name
   */
  getLanguageNativeName(langCode = this.currentLanguage) {
    const nativeNames = {
      'en': 'English',
      'tw': 'Twi',
      'ga': 'Ga',
      'ee': 'Eʋegbe'
    };
    return nativeNames[langCode] || 'Unknown';
  }

  /**
   * Get supported languages list
   */
  getSupportedLanguages() {
    return this.supportedLanguages.map(code => ({
      code,
      name: this.getLanguageName(code),
      nativeName: this.getLanguageNativeName(code),
      flag: this.getLanguageFlag(code)
    }));
  }

  /**
   * Get language flag emoji
   */
  getLanguageFlag(langCode) {
    const flags = {
      'en': '🇬🇧',
      'tw': '🇬🇭',
      'ga': '🇬🇭',
      'ee': '🇬🇭'
    };
    return flags[langCode] || '🌍';
  }

  /**
   * Translate system prompts based on language
   */
  getSystemPrompt(langCode = this.currentLanguage) {
    const prompts = {
      'en': `You are TeleKiosk Assistant, a helpful AI assistant for TeleKiosk Hospital in Ghana.

PRIMARY FUNCTIONS:
1. Help patients book appointments with appropriate doctors
2. Provide hospital information (services, doctors, visiting times, locations)
3. Detect medical emergencies and provide immediate guidance
4. Answer general health questions (non-diagnostic only)
5. Assist with hospital navigation and policies
6. Support patients in English and local Ghanaian languages

CRITICAL GUIDELINES:
- NEVER provide medical diagnoses or treatment advice
- Always maintain patient privacy and confidentiality
- For medical emergencies, immediately direct to emergency services
- Be culturally sensitive to Ghanaian healthcare context
- Always be empathetic, professional, and respectful
- If unsure about medical information, refer to hospital staff

HOSPITAL INFORMATION:
- Location: TeleKiosk Hospital, Accra, Ghana
- Emergency: 24/7 available - Call 999 or 193
- Contact: +233-599 211 311
- Email: info@telekiosk.com
- Languages: English, Twi, Ga, Ewe supported

Remember: You are here to assist and guide, not to replace medical professionals.`,

      'tw': `Wo yɛ TeleKiosk Assistant, ɔboafoɔ a ɔboa nnipa wɔ TeleKiosk Hospital wɔ Ghana.

NE DWUMA TITIRIW:
1. Boa ayarefoɔ ma wɔbɛtumi akɔhwɛ adɔkotafoɔ
2. Ka ayaresabea no ho nsɛm (dwumadie, adɔkotafoɔ, berɛ a wɔkɔ hwɛ)
3. Hunu prɛko mprɛko nsɛm na boa wɔn ntɛm
4. Bua akwahosan ho nsɛm (nanso nkyerɛ yareɛ biara)
5. Boa wɔ ayaresabea no mu akwankyerɛ ho
6. Kasa Twi, Borɔfo, Ga, ne Ewe

NNEƐMA A ƐSƐ SƐ WOKAE:
- Nkyerɛ yareɛ biara anaa aduro biara mma obiara
- Di ayarefoɔ ho kokoamsɛm so
- Sɛ ɛyɛ prɛko a, ma wɔnfrɛ 999 anaa 193 ntɛm
- Bu amammerɛ Ghana mu ayaresabea ho
- Yɛ ayamhyehye, obu, ne nea ɔwɔ suban pa
- Sɛ wonnim ayaresabea ho biribi a, ma wɔnkɔbisa ayaresabea no mu adwumayɛfoɔ

AYARESABEA NO HO NSƐM:
- Baabi: TeleKiosk Hospital, Accra, Ghana  
- Prɛko: Berɛ biara - Frɛ 999 anaa 193
- Telefon: +233-599 211 311
- Email: info@telekiosk.com

Kae sɛ: Wowɔ hɔ sɛ wobɛboa, nanso wonnsesa adɔkotafoɔ ananmu.`,

      'ga': `Emi nye TeleKiosk Assistant, meboafo le TeleKiosk Hospital le Ghana.

MI DWUMADI GBEJIALƐ:
1. Boa ayarɛfɔɔ be baa dokitafoɔ gbɔ
2. Gblɔ ayarɛjɔɔ ŋu nyɔŋɔɔ (dwumadiɛ, dokitafoɔ, berɛ mli wɔba hwɛ)
3. Nya prɛko prɛko nuɔɔ eye boa wɔn kaba
4. Gbe akwahosan ŋu nyɔŋɔɔ (kɛ nyɛ yarɛɛ sane ko)
5. Boa ayarɛjɔɔ mli kpasɛ ŋu
6. Kasa Ga, Blɔfɔ, Twi, kɛ Ewe

NUƆƆ MLI E SƐ MIKPOƆ:
- Ko gblɔ yarɛɛ sane aduru ko na obii
- Di ayarɛfɔɔ ŋu kokoamsɛm so
- Sɛ e nye prɛko ko la, ma wɔfrɛ 999 sane 193 kaba
- Bu Ghana ayarɛjɔɔ tsui ŋu
- Nye ayamhyehye, obu, kɛ obaa suban yofɛɛ
- Sɛ nyɛ ayarɛjɔɔ ŋu bii ko la, ma wɔkɔbisa ayarɛjɔɔ mli yitsoofɔ

AYARƐJƆƆ ŋU NYƆŊƆƆ:
- Afii: TeleKiosk Hospital, Accra, Ghana
- Prɛko: Berɛ kome - Frɛ 999 sane 193  
- Telefon: +233-599 211 311
- Email: info@telekiosk.com

Kpoɔ je: Ewɔ afii be boa, kɛ nitsɛ dokitafoɔ teŋ ko.`,

      'ee': `Menye TeleKiosk Assistant, kpeɖeŋutɔ si nɔa TeleKiosk Hospital le Ghana.

NYE DƆWƆWƆ VEVEVEAWO:
1. Kpe ɖe dɔnɔwo ŋu be woado dokitawo
2. Gblɔ kɔdzi ƒe nyawo (dɔwɔwɔwo, dokitawo, ɣeyiɣi si wovana)
3. De dzɔdzɔme tɔxɛawo ase eye nàkpe ɖe wo ŋu kabakaba
4. Ɖo lãmesɛsrɔ̃ ƒe biabiawó ŋu (gake mègagblɔ dɔléleawo o)
5. Kpe ɖe amewo ŋu le kɔdzi me mɔzɔzɔ ɖe eme
6. Ƒo nu Eʋegbe, Yevugbe, Twi, kple Ga

NUSIWO NYA VE LA:
- Mègagblɔ dɔléle aɖeke alo atike aɖeke na ame aɖeke o
- Dzɔ dɔnɔwo ƒe nya ɣaɣlawo ŋu
- Ne enye gatagbagba la, na woayɔ 999 alo 193 enumake
- Bu Ghana ƒe kɔdzi ƒe nuwɔnawo ŋu
- Nɔ bɔbɔe, de bubu ame ŋu, eye nàléa ŋu
- Ne mènya kɔdzi ƒe nya aɖeke o la, na woabia kɔdzinɔlawo

KƆDZI ƒE NYAWO:
- Nɔƒe: TeleKiosk Hospital, Accra, Ghana
- Gatagbagba: Ɣesiaɣi - Yɔ 999 alo 193
- Telefon: +233-599 211 311  
- Email: info@telekiosk.com

Ðo ŋku edzi: Èle afii be nàkpe ɖe amewo ŋu, ke menye be nàɖɔli dokitawo o.`
    };

    return prompts[langCode] || prompts['en'];
  }

  /**
   * Get localized emergency message
   */
  getEmergencyMessage(langCode = this.currentLanguage) {
    const messages = {
      'en': '🚨 This sounds like a medical emergency. Please call emergency services immediately at 999 or 193, or visit our Emergency Department right away. Do not delay seeking immediate medical attention.',
      'tw': '🚨 Eyi te sɛ ayaresem a ɛyɛ prɛko. Yɛ sɛ wofrɛ prɛko adwumayɛfoɔ wɔ 999 anaa 193 ntɛm ara, anaa kɔ yɛn Prɛko Dwumadibea hɔ ntɛm. Mma wo berɛ so wɔ prɛko ayaresa hwehwɛ mu.',
      'ga': '🚨 Eyɛ ayarɛ prɛko. Frɛ prɛko yitsoofɔ 999 sane 193 kaba, sane kɔ yɛn Prɛko Yitsoo hɔ ntɛm. Ko ma wo berɛ so wɔ prɛko ayarɛsa hwehwɛ mu.',
      'ee': '🚨 Esia ɖi be dɔléle sesẽ aɖe wòle dzɔdzɔm. Taflatse yɔ gatagbagba dɔwɔlawo le 999 alo 193 enumake, alo yi míaƒe Gatagbagba ƒe nɔƒe la enumake. Mègana ɣeyiɣi nava eme hafi nàdi kpekpeɖeŋu o.'
    };

    return messages[langCode] || messages['en'];
  }

  /**
   * Get localized greetings
   */
  getGreeting(langCode = this.currentLanguage) {
    const greetings = {
      'en': 'Hello! How can I help you today?',
      'tw': 'Akwaaba! Mepɛ sɛn na meboa wo ɛnnɛ?',
      'ga': 'Bawo! Sɛn na matumi aboa wo ɛnnɛ?',
      'ee': 'Ndi! Aleke si mawɔ be makpe ɖe ŋuwò egbea?'
    };

    return greetings[langCode] || greetings['en'];
  }

  /**
   * Get localized common responses
   */
  getCommonResponses(langCode = this.currentLanguage) {
    const responses = {
      'en': {
        booking: 'I can help you book an appointment. What service do you need?',
        services: 'We offer Cardiology, Pediatrics, Dermatology, Neurology, Orthopedics, and Emergency Medicine.',
        hours: 'Our general services are available Monday - Sunday, 8:00 AM - 8:00 PM. Emergency services are available 24/7.',
        contact: 'You can reach us at +233-599 211 311 or email info@telekiosk.com',
        thankyou: 'Thank you for choosing TeleKiosk Hospital!'
      },
      'tw': {
        booking: 'Metumi aboa wo ma woabɛtumi akɔhwɛ adɔkota. Dwumadie bɛn na wohia?',
        services: 'Yɛwɔ Akoma ho adwuma, Mmɔfra ho adwuma, Nhoma ho adwuma, Amemene ho adwuma, Nnompe ho adwuma, ne Prɛko ho adwuma.',
        hours: 'Yɛn dwumadi yɛ Dwoada - Kwasida, anɔpa 8:00 - anwummɛrɛ 8:00. Prɛko dwumadi wɔ hɔ berɛ biara.',
        contact: 'Wobɛtumi afrɛ yɛn wɔ +233-599 211 311 anaa wo email info@telekiosk.com',
        thankyou: 'Yɛda wo ase sɛ wopaw TeleKiosk Ayaresabea!'
      },
      'ga': {
        booking: 'Matumi aboa wo ma woaba dokita gbɔ. Dwumadie bɛn na wohia?',
        services: 'Yɛwɔ Akoma ŋu yitsoo, Mmɔfra ŋu yitsoo, Honam ŋu yitsoo, Amemene ŋu yitsoo, Nnompe ŋu yitsoo, kɛ Prɛko ŋu yitsoo.',
        hours: 'Yɛn dwumadi nye Dwoada - Kɔsiɖa, ogbongbong 8:00 - fiɛfiɛ 8:00. Prɛko yitsoo wɔ afii berɛ biara.',
        contact: 'Wobɛtumi afrɛ yɛn wɔ +233-599 211 311 sane email info@telekiosk.com',
        thankyou: 'Yɛda wo ase sɛ wotia TeleKiosk Ayarɛjɔɔ!'
      },
      'ee': {
        booking: 'Mate ŋu akpe ɖe ŋuwò be nàyi dokita gbɔ. Dɔwɔwɔ ka nèhiã?',
        services: 'Míewɔa dzi ƒe dɔ, ɖeviwo ƒe dɔ, ŋutilã ƒe dɔ, ta me ƒe dɔ, ƒuwo ƒe dɔ, kple gatagbagba ƒe dɔ.',
        hours: 'Míaƒe dɔwɔwɔ nye Dzoɖa - Kɔsiɖa, ŋdi 8:00 - fiẽ 8:00. Gatagbagba ƒe dɔwɔwɔ li ɣesiaɣi.',
        contact: 'Àte ŋu ayɔ mí le +233-599 211 311 alo email info@telekiosk.com',
        thankyou: 'Míeda akpe na wò be nètia TeleKiosk Kɔdzi!'
      }
    };

    return responses[langCode] || responses['en'];
  }

  /**
   * Get language-specific voice settings
   */
  getVoiceSettings(langCode = this.currentLanguage) {
    const voiceSettings = {
      'en': {
        lang: 'en-US',
        voice: 'en-US-Standard-C',
        rate: 0.9,
        pitch: 1.0
      },
      'tw': {
        lang: 'en-US', // Fallback to English voice for Twi
        voice: 'en-US-Standard-C',
        rate: 0.8,
        pitch: 0.9
      },
      'ga': {
        lang: 'en-US', // Fallback to English voice for Ga
        voice: 'en-US-Standard-C',
        rate: 0.8,
        pitch: 0.9
      },
      'ee': {
        lang: 'en-US', // Fallback to English voice for Ewe  
        voice: 'en-US-Standard-C',
        rate: 0.8,
        pitch: 0.9
      }
    };

    return voiceSettings[langCode] || voiceSettings['en'];
  }

  /**
   * Phase 3: Get comprehensive service status with advanced capabilities
   */
  getStatus() {
    return {
      // Core language information
      currentLanguage: this.currentLanguage,
      currentLanguageName: this.getLanguageName(),
      supportedLanguages: this.getSupportedLanguages(),
      
      // Phase 3: Enhanced detection capabilities
      detectionEnabled: true,
      phase: 3,
      version: 'enhanced-multilingual',
      
      // Advanced capabilities
      capabilities: {
        detection: true,
        systemPrompts: true,
        emergencyMessages: true,
        voiceSettings: true,
        commonResponses: true,
        // Phase 3 specific features
        contextualDetection: true,
        healthcareTerminology: true,
        medicalPhraseRecognition: true,
        codeSwitchingDetection: true,
        appointmentContextDetection: true,
        emergencyContextDetection: true,
        responseRecommendations: true,
        smartLanguageThreshold: true
      },
      
      // Language pattern statistics
      patternStats: {
        totalLanguages: this.supportedLanguages.length,
        totalPatterns: Object.keys(this.languagePatterns).length,
        healthcareTermsCount: Object.values(this.languagePatterns)
          .reduce((total, lang) => total + (lang.healthcareTerms?.length || 0), 0),
        medicalPhrasesCount: Object.values(this.languagePatterns)
          .reduce((total, lang) => total + (lang.medicalPhrases?.length || 0), 0)
      },
      
      // Context patterns available
      contextPatterns: {
        medical: Object.keys(this.contextPatterns.medical).length,
        appointment: Object.keys(this.contextPatterns.appointment).length,
        emergency: Object.keys(this.contextPatterns.emergency).length
      },
      
      // Configuration
      configuration: {
        fallbackLanguage: this.fallbackLanguage,
        confidenceThreshold: {
          standard: 0.3,
          medical: 0.2 // Lower threshold for medical context
        },
        healthcareWeighting: true,
        multiLanguageSupport: true
      }
    };
  }
}

// Create and export singleton instance
export const multilingualService = new MultilingualService();
export default multilingualService;