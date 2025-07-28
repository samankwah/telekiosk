// Website Content Scraper and Indexer Service
class WebsiteScraperService {
  constructor() {
    this.contentIndex = new Map();
    this.isIndexed = false;
    this.lastIndexTime = null;
    this.indexingInProgress = false;
    this.searchableContent = [];
  }

  // Initialize and index all website content
  async initializeContentIndex() {
    if (this.indexingInProgress) {
      return { success: false, message: 'Indexing already in progress' };
    }

    this.indexingInProgress = true;
    console.log('Starting website content indexing...');

    try {
      // Index static content from existing data structures
      await this.indexStaticContent();
      
      // Index dynamic page content
      await this.indexPageContent();
      
      // Index component content
      await this.indexComponentContent();
      
      this.isIndexed = true;
      this.lastIndexTime = new Date();
      this.indexingInProgress = false;
      
      console.log(`Website content indexed successfully. ${this.searchableContent.length} items indexed.`);
      
      return { 
        success: true, 
        message: 'Content indexed successfully',
        itemCount: this.searchableContent.length
      };
    } catch (error) {
      console.error('Error indexing website content:', error);
      this.indexingInProgress = false;
      return { success: false, message: 'Failed to index content', error };
    }
  }

  // Index static content from constants and data files
  async indexStaticContent() {
    try {
      // Import hospital data dynamically
      const { HOSPITAL_INFO, SERVICES } = await import('../constants/hospitalData.js');
      
      // Index hospital information
      this.addToIndex('hospital_info', 'Hospital Information', {
        name: HOSPITAL_INFO.name,
        address: HOSPITAL_INFO.address,
        phone: HOSPITAL_INFO.phone,
        emergency: HOSPITAL_INFO.emergency,
        email: HOSPITAL_INFO.email,
        type: 'contact_info',
        keywords: ['hospital', 'contact', 'address', 'phone', 'email', 'emergency', 'location']
      });

      // Index services
      SERVICES.forEach(service => {
        this.addToIndex(`service_${service.id}`, service.title, {
          ...service,
          type: 'service',
          keywords: [service.title.toLowerCase(), service.id, 'service', 'medical', 'treatment']
        });
      });

      // Index health and wellness data if available
      try {
        const healthData = await import('../constants/healthWellnessData.js');
        if (healthData.HEALTH_ARTICLES) {
          healthData.HEALTH_ARTICLES.forEach(article => {
            this.addToIndex(`article_${article.id}`, article.title, {
              ...article,
              type: 'health_article',
              keywords: ['health', 'wellness', 'article', 'tips', article.category?.toLowerCase()]
            });
          });
        }
      } catch (error) {
        console.log('Health wellness data not found, skipping...');
      }

      console.log('Static content indexed successfully');
    } catch (error) {
      console.error('Error indexing static content:', error);
    }
  }

  // Index page content by simulating DOM traversal
  async indexPageContent() {
    // Common page content that would be available
    const pageContent = [
      {
        id: 'homepage',
        title: 'TeleKiosk Hospital Homepage',
        content: 'Welcome to TeleKiosk Hospital. We provide comprehensive healthcare services with modern facilities and expert medical professionals.',
        type: 'page',
        keywords: ['home', 'welcome', 'hospital', 'healthcare', 'medical']
      },
      {
        id: 'about',
        title: 'About TeleKiosk Hospital',
        content: 'TeleKiosk Hospital is a leading healthcare institution providing quality medical care with state-of-the-art facilities and experienced doctors.',
        type: 'page',
        keywords: ['about', 'hospital', 'healthcare', 'medical', 'quality', 'doctors']
      },
      {
        id: 'services',
        title: 'Medical Services',
        content: 'We offer a wide range of medical services including cardiology, neurology, orthopedics, pediatrics, emergency care, and general medicine.',
        type: 'page',
        keywords: ['services', 'medical', 'cardiology', 'neurology', 'orthopedics', 'pediatrics', 'emergency']
      },
      {
        id: 'doctors',
        title: 'Our Medical Team',
        content: 'Our team consists of highly qualified doctors and specialists in various medical fields, committed to providing excellent patient care.',
        type: 'page',
        keywords: ['doctors', 'medical team', 'specialists', 'qualified', 'patient care']
      },
      {
        id: 'facilities',
        title: 'Hospital Facilities',
        content: 'Modern medical equipment, comfortable patient rooms, advanced diagnostic tools, emergency department, and specialized treatment areas.',
        type: 'page',
        keywords: ['facilities', 'equipment', 'rooms', 'diagnostic', 'emergency', 'treatment']
      },
      {
        id: 'booking',
        title: 'Appointment Booking',
        content: 'Easy online appointment booking system. Schedule consultations with our specialists, choose convenient time slots, and receive confirmation emails.',
        type: 'page',
        keywords: ['booking', 'appointment', 'schedule', 'consultation', 'specialists', 'time slots']
      },
      {
        id: 'contact',
        title: 'Contact Information',
        content: 'Located at Block F6, Shippi Road, Cantonments, Accra. Phone: 0302 739 373, Emergency: 0599 211 311, Email: info@telekiosk.com',
        type: 'page',
        keywords: ['contact', 'location', 'address', 'phone', 'emergency', 'email', 'accra', 'cantonments']
      },
      {
        id: 'visiting_hours',
        title: 'Visiting Hours',
        content: 'Regular visiting hours: 10:00 AM - 7:00 PM daily. Consultation hours: Monday-Friday 8:00 AM - 6:00 PM, Weekends 9:00 AM - 4:00 PM.',
        type: 'page',
        keywords: ['visiting hours', 'consultation hours', 'schedule', 'time', 'weekdays', 'weekends']
      }
    ];

    pageContent.forEach(page => {
      this.addToIndex(page.id, page.title, page);
    });

    console.log('Page content indexed successfully');
  }

  // Index component-specific content
  async indexComponentContent() {
    const componentContent = [
      {
        id: 'navigation',
        title: 'Website Navigation',
        content: 'Navigate through Home, Services, Doctors, About Us, Contact, Booking, and other hospital sections.',
        type: 'navigation',
        keywords: ['navigation', 'menu', 'sections', 'pages']
      },
      {
        id: 'emergency_info',
        title: 'Emergency Information',
        content: 'For medical emergencies, call 0599 211 311 immediately. Our emergency department is available 24/7.',
        type: 'emergency',
        keywords: ['emergency', '24/7', 'urgent', 'critical', 'immediate help']
      },
      {
        id: 'appointment_process',
        title: 'Appointment Process',
        content: 'Book appointments online, select your preferred doctor and time slot, provide patient information, and receive email confirmation.',
        type: 'process',
        keywords: ['appointment process', 'booking steps', 'online booking', 'confirmation']
      }
    ];

    componentContent.forEach(content => {
      this.addToIndex(content.id, content.title, content);
    });

    console.log('Component content indexed successfully');
  }

  // Add content to searchable index
  addToIndex(id, title, data) {
    const indexItem = {
      id,
      title,
      content: data.content || data.description || '',
      type: data.type || 'general',
      keywords: data.keywords || [],
      data: data,
      searchableText: this.createSearchableText(title, data)
    };

    this.contentIndex.set(id, indexItem);
    this.searchableContent.push(indexItem);
  }

  // Create searchable text from content
  createSearchableText(title, data) {
    const searchableParts = [
      title,
      data.content || '',
      data.description || '',
      data.name || '',
      data.address || '',
      data.phone || '',
      data.email || '',
      ...(data.keywords || [])
    ].filter(Boolean);

    return searchableParts.join(' ').toLowerCase();
  }

  // Search content with advanced matching
  searchContent(query, options = {}) {
    if (!this.isIndexed) {
      console.warn('Content not indexed yet. Please wait for indexing to complete.');
      return [];
    }

    const {
      limit = 10,
      type = null,
      fuzzyMatch = true,
      minScore = 0.1
    } = options;

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
    const results = [];

    for (const item of this.searchableContent) {
      if (type && item.type !== type) continue;

      let score = this.calculateRelevanceScore(item, searchTerms, fuzzyMatch);
      
      if (score >= minScore) {
        results.push({
          ...item,
          relevanceScore: score,
          matchedTerms: this.getMatchedTerms(item, searchTerms)
        });
      }
    }

    // Sort by relevance score
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return results.slice(0, limit);
  }

  // Calculate relevance score for search results
  calculateRelevanceScore(item, searchTerms, fuzzyMatch = true) {
    let score = 0;
    const searchableText = item.searchableText;

    searchTerms.forEach(term => {
      // Exact match in title (highest weight)
      if (item.title.toLowerCase().includes(term)) {
        score += 3;
      }

      // Exact match in content
      if (searchableText.includes(term)) {
        score += 2;
      }

      // Keyword match
      if (item.keywords.some(keyword => keyword.includes(term))) {
        score += 1.5;
      }

      // Fuzzy matching
      if (fuzzyMatch) {
        const fuzzyMatches = this.findFuzzyMatches(searchableText, term);
        score += fuzzyMatches * 0.5;
      }
    });

    // Normalize score
    return Math.min(score / searchTerms.length, 1);
  }

  // Find fuzzy matches using simple string similarity
  findFuzzyMatches(text, term) {
    let matches = 0;
    const words = text.split(' ');
    
    words.forEach(word => {
      if (this.calculateSimilarity(word, term) > 0.7) {
        matches++;
      }
    });

    return matches;
  }

  // Calculate string similarity (simple Levenshtein-based)
  calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  // Levenshtein distance calculation
  levenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  // Get matched terms for highlighting
  getMatchedTerms(item, searchTerms) {
    const matchedTerms = [];
    const searchableText = item.searchableText;

    searchTerms.forEach(term => {
      if (searchableText.includes(term)) {
        matchedTerms.push(term);
      }
    });

    return matchedTerms;
  }

  // Get content by type
  getContentByType(type) {
    return this.searchableContent.filter(item => item.type === type);
  }

  // Get all indexed content
  getAllContent() {
    return this.searchableContent;
  }

  // Get specific content by ID
  getContentById(id) {
    return this.contentIndex.get(id);
  }

  // Update content index (for real-time updates)
  updateContent(id, newData) {
    if (this.contentIndex.has(id)) {
      const existingItem = this.contentIndex.get(id);
      const updatedItem = {
        ...existingItem,
        ...newData,
        searchableText: this.createSearchableText(newData.title || existingItem.title, newData)
      };

      this.contentIndex.set(id, updatedItem);
      
      // Update in searchable content array
      const index = this.searchableContent.findIndex(item => item.id === id);
      if (index !== -1) {
        this.searchableContent[index] = updatedItem;
      }

      return true;
    }
    return false;
  }

  // Get indexing status
  getIndexingStatus() {
    return {
      isIndexed: this.isIndexed,
      isIndexing: this.indexingInProgress,
      lastIndexTime: this.lastIndexTime,
      itemCount: this.searchableContent.length
    };
  }

  // Force re-index
  async reIndex() {
    this.contentIndex.clear();
    this.searchableContent = [];
    this.isIndexed = false;
    this.lastIndexTime = null;
    
    return await this.initializeContentIndex();
  }
}

// Create singleton instance
export const websiteScraperService = new WebsiteScraperService();

// Auto-initialize on import
websiteScraperService.initializeContentIndex().catch(console.error);

export default websiteScraperService;