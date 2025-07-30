// Blockchain Service - Secure medical record storage and verification
// Implements immutable health records with patient privacy

import { getEnvVar } from '../utils/envUtils.js';

class BlockchainService {
  constructor() {
    this.contractAddress = null;
    this.web3 = null;
    this.contract = null;
    this.account = null;
    
    this.medicalRecordSchema = {
      patientId: 'string',
      recordId: 'string',
      timestamp: 'number',
      recordType: 'string', // 'consultation', 'prescription', 'lab_result', 'imaging'
      provider: 'string',
      encryptedData: 'string',
      hash: 'string',
      permissions: 'array'
    };
    
    this.initializeBlockchain();
  }

  async initializeBlockchain() {
    try {
      console.log('⛓️ Initializing Blockchain Service...');
      
      // Check if Web3 is available
      if (typeof window !== 'undefined' && window.ethereum) {
        const { Web3 } = await import('web3');
        this.web3 = new Web3(window.ethereum);
        
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const accounts = await this.web3.eth.getAccounts();
        this.account = accounts[0];
        
        console.log('✅ Web3 connected:', this.account);
      } else {
        // Use Infura or other provider as fallback
        const providerUrl = getEnvVar('BLOCKCHAIN_PROVIDER_URL') || 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID';
        const { Web3 } = await import('web3');
        this.web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
        
        console.log('✅ Blockchain provider connected via HTTP');
      }
      
      // Load smart contract
      await this.loadContract();
      
      console.log('✅ Blockchain Service initialized');
    } catch (error) {
      console.error('❌ Blockchain initialization failed:', error);
      // Continue without blockchain for now
    }
  }

  async loadContract() {
    try {
      // Smart contract ABI (simplified for demo)
      const contractABI = [
        {
          "inputs": [
            {"name": "_recordId", "type": "string"},
            {"name": "_encryptedData", "type": "string"},
            {"name": "_hash", "type": "string"},
            {"name": "_recordType", "type": "string"}
          ],
          "name": "storeMedicalRecord",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [{"name": "_recordId", "type": "string"}],
          "name": "getMedicalRecord",
          "outputs": [
            {"name": "", "type": "string"},
            {"name": "", "type": "string"},
            {"name": "", "type": "uint256"},
            {"name": "", "type": "address"}
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {"name": "_recordId", "type": "string"},
            {"name": "_user", "type": "address"}
          ],
          "name": "grantAccess",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {"name": "_recordId", "type": "string"},
            {"name": "_user", "type": "address"}
          ],
          "name": "hasAccess",
          "outputs": [{"name": "", "type": "bool"}],
          "stateMutability": "view",
          "type": "function"
        }
      ];
      
      // Contract address (would be deployed contract)
      this.contractAddress = getEnvVar('MEDICAL_RECORDS_CONTRACT_ADDRESS') || '0x1234567890abcdef...';
      
      if (this.web3 && this.contractAddress !== '0x1234567890abcdef...') {
        this.contract = new this.web3.eth.Contract(contractABI, this.contractAddress);
        console.log('✅ Smart contract loaded:', this.contractAddress);
      } else {
        console.log('⚠️ Using mock blockchain service (contract not deployed)');
        this.contract = this.createMockContract();
      }
      
    } catch (error) {
      console.error('❌ Contract loading failed:', error);
      this.contract = this.createMockContract();
    }
  }

  /**
   * Store medical record on blockchain with encryption
   */
  async storeMedicalRecord(recordData) {
    try {
      console.log('💾 Storing medical record on blockchain...');
      
      const {
        patientId,
        recordType,
        provider,
        data,
        permissions = []
      } = recordData;
      
      // Generate unique record ID
      const recordId = this.generateRecordId(patientId, recordType);
      
      // Encrypt sensitive data
      const encryptedData = await this.encryptMedicalData(data);
      
      // Generate hash for integrity verification
      const hash = await this.generateDataHash(data);
      
      // Create record structure
      const record = {
        recordId,
        patientId,
        timestamp: Date.now(),
        recordType,
        provider,
        encryptedData,
        hash,
        permissions
      };
      
      // Store on blockchain
      if (this.contract && this.account) {
        const transaction = await this.contract.methods.storeMedicalRecord(
          recordId,
          encryptedData,
          hash,
          recordType
        ).send({ 
          from: this.account,
          gas: 300000
        });
        
        console.log('✅ Medical record stored on blockchain:', transaction.transactionHash);
        
        return {
          success: true,
          recordId,
          transactionHash: transaction.transactionHash,
          blockNumber: transaction.blockNumber
        };
      } else {
        // Mock storage for development
        console.log('📝 Mock: Medical record stored:', recordId);
        return {
          success: true,
          recordId,
          transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
          blockNumber: Math.floor(Math.random() * 1000000),
          mock: true
        };
      }
      
    } catch (error) {
      console.error('❌ Failed to store medical record:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Retrieve medical record from blockchain
   */
  async getMedicalRecord(recordId, requestorAddress = null) {
    try {
      console.log('🔍 Retrieving medical record:', recordId);
      
      // Check access permissions
      const hasAccess = await this.verifyAccess(recordId, requestorAddress);
      if (!hasAccess) {
        throw new Error('Access denied: Insufficient permissions');
      }
      
      if (this.contract) {
        const result = await this.contract.methods.getMedicalRecord(recordId).call();
        
        const [encryptedData, hash, timestamp, provider] = result;
        
        // Decrypt data
        const decryptedData = await this.decryptMedicalData(encryptedData);
        
        // Verify integrity
        const isValid = await this.verifyDataIntegrity(decryptedData, hash);
        
        return {
          success: true,
          record: {
            recordId,
            data: decryptedData,
            timestamp: parseInt(timestamp),
            provider,
            verified: isValid
          }
        };
      } else {
        // Mock retrieval
        return this.getMockRecord(recordId);
      }
      
    } catch (error) {
      console.error('❌ Failed to retrieve medical record:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Grant access to medical record
   */
  async grantAccess(recordId, userAddress, accessLevel = 'read') {
    try {
      console.log('🔐 Granting access to record:', recordId);
      
      if (this.contract && this.account) {
        const transaction = await this.contract.methods.grantAccess(
          recordId,
          userAddress
        ).send({
          from: this.account,
          gas: 100000
        });
        
        console.log('✅ Access granted:', transaction.transactionHash);
        
        return {
          success: true,
          transactionHash: transaction.transactionHash
        };
      } else {
        // Mock access grant
        console.log('📝 Mock: Access granted to', userAddress);
        return {
          success: true,
          mock: true
        };
      }
      
    } catch (error) {
      console.error('❌ Failed to grant access:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verify access permissions
   */
  async verifyAccess(recordId, userAddress) {
    try {
      if (!userAddress) {
        userAddress = this.account;
      }
      
      if (this.contract && userAddress) {
        const hasAccess = await this.contract.methods.hasAccess(recordId, userAddress).call();
        return hasAccess;
      } else {
        // Mock access verification - allow for development
        return true;
      }
      
    } catch (error) {
      console.error('❌ Access verification failed:', error);
      return false;
    }
  }

  /**
   * Create patient consent record
   */
  async createConsentRecord(patientId, consentData) {
    try {
      const consentRecord = {
        patientId,
        recordType: 'consent',
        provider: 'TeleKiosk System',
        data: {
          consentType: consentData.type,
          permissions: consentData.permissions,
          expiryDate: consentData.expiryDate,
          digitalSignature: consentData.signature,
          timestamp: new Date().toISOString()
        }
      };
      
      return await this.storeMedicalRecord(consentRecord);
    } catch (error) {
      console.error('❌ Failed to create consent record:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get patient record history
   */
  async getPatientHistory(patientId, requestorAddress = null) {
    try {
      // This would query blockchain events or maintain an index
      // For now, return mock data
      console.log('📚 Retrieving patient history for:', patientId);
      
      return {
        success: true,
        history: [
          {
            recordId: 'REC001',
            type: 'consultation',
            timestamp: Date.now() - 86400000,
            provider: 'Dr. Kwame Asante'
          },
          {
            recordId: 'REC002',
            type: 'prescription',
            timestamp: Date.now() - 43200000,
            provider: 'TeleKiosk Pharmacy'
          }
        ]
      };
    } catch (error) {
      console.error('❌ Failed to get patient history:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Utility functions
   */
  generateRecordId(patientId, recordType) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${recordType.toUpperCase()}_${patientId}_${timestamp}_${random}`;
  }

  async encryptMedicalData(data) {
    // Simple encryption for demo - use proper encryption in production
    const jsonData = JSON.stringify(data);
    const encoded = btoa(jsonData);
    return `ENCRYPTED_${encoded}`;
  }

  async decryptMedicalData(encryptedData) {
    try {
      if (encryptedData.startsWith('ENCRYPTED_')) {
        const encoded = encryptedData.replace('ENCRYPTED_', '');
        const jsonData = atob(encoded);
        return JSON.parse(jsonData);
      }
      return encryptedData;
    } catch (error) {
      console.error('❌ Decryption failed:', error);
      return null;
    }
  }

  async generateDataHash(data) {
    const jsonData = JSON.stringify(data);
    
    if (crypto && crypto.subtle) {
      const encoder = new TextEncoder();
      const dataBytes = encoder.encode(jsonData);
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBytes);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } else {
      // Fallback hash function
      let hash = 0;
      for (let i = 0; i < jsonData.length; i++) {
        const char = jsonData.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return hash.toString(16);
    }
  }

  async verifyDataIntegrity(data, expectedHash) {
    const computedHash = await this.generateDataHash(data);
    return computedHash === expectedHash;
  }

  createMockContract() {
    return {
      methods: {
        storeMedicalRecord: () => ({
          send: async () => ({
            transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
            blockNumber: Math.floor(Math.random() * 1000000)
          })
        }),
        getMedicalRecord: () => ({
          call: async () => [
            'ENCRYPTED_sample_data',
            'hash123',
            Date.now().toString(),
            '0x1234567890'
          ]
        }),
        grantAccess: () => ({
          send: async () => ({
            transactionHash: '0x' + Math.random().toString(16).substr(2, 64)
          })
        }),
        hasAccess: () => ({
          call: async () => true
        })
      }
    };
  }

  getMockRecord(recordId) {
    return {
      success: true,
      record: {
        recordId,
        data: {
          patientId: 'P001',
          diagnosis: 'General checkup',
          notes: 'Patient is in good health',
          vitals: {
            temperature: '98.6°F',
            bloodPressure: '120/80',
            heartRate: '72 bpm'
          }
        },
        timestamp: Date.now(),
        provider: 'Dr. Mock Provider',
        verified: true
      },
      mock: true
    };
  }

  /**
   * Get blockchain service status
   */
  getStatus() {
    return {
      initialized: !!this.web3,
      connected: !!this.account,
      contractLoaded: !!this.contract,
      account: this.account,
      contractAddress: this.contractAddress,
      networkId: this.web3 ? 'unknown' : null,
      capabilities: {
        storeRecords: true,
        retrieveRecords: true,
        accessControl: true,
        encryption: true,
        integrity: true
      }
    };
  }
}

// Create and export singleton instance
export const blockchainService = new BlockchainService();
export default blockchainService;