// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title TeleKiosk Consent Management Smart Contract
 * @dev Manages digital consent for medical procedures and data sharing in Ghana's healthcare system
 * @author AI Integration Lead - TeleKiosk Team
 */
contract ConsentManagement is AccessControl, ReentrancyGuard {
    using ECDSA for bytes32;

    // Role definitions
    bytes32 public constant HEALTHCARE_PROVIDER_ROLE = keccak256("HEALTHCARE_PROVIDER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");

    // Consent types
    enum ConsentType {
        Treatment,           // Medical treatment consent
        DataSharing,         // Patient data sharing consent
        Research,           // Medical research participation
        Telemedicine,       // Telemedicine consultation consent
        EmergencyContact,   // Emergency contact authorization
        Insurance,          // Insurance claim processing
        ThirdPartyAccess,   // Third-party service access
        DataRetention       // Data retention and storage
    }

    enum ConsentStatus {
        Pending,            // Awaiting patient signature
        Active,             // Currently valid consent
        Expired,            // Consent has expired
        Revoked,            // Patient has revoked consent
        Superseded          // Replaced by newer consent
    }

    // Consent record structure
    struct ConsentRecord {
        string consentId;           // Unique consent identifier
        address patient;            // Patient's wallet address
        address provider;           // Healthcare provider's address
        ConsentType consentType;    // Type of consent
        ConsentStatus status;       // Current status
        string description;         // Human-readable consent description
        string termsHash;          // Hash of consent terms (IPFS)
        bytes patientSignature;    // Patient's digital signature
        bytes providerSignature;   // Provider's digital signature
        uint256 grantedTimestamp;  // When consent was granted
        uint256 expiryTimestamp;   // When consent expires (0 = no expiry)
        uint256 revokedTimestamp;  // When consent was revoked (0 = not revoked)
        string[] authorizedParties; // Additional authorized parties
        mapping(string => bool) permissions; // Specific permissions granted
        string metadata;           // Additional metadata (JSON)
    }

    // Consent template structure
    struct ConsentTemplate {
        string templateId;         // Template identifier
        ConsentType consentType;   // Type of consent this template covers
        string title;              // Template title
        string description;        // Template description
        string termsContent;       // Full terms content (IPFS hash)
        uint256 validityPeriod;    // Default validity period in seconds
        bool requiresWitness;      // Whether witness signature is required
        bool isActive;             // Whether template is currently active
        address creator;           // Template creator
        uint256 createdTimestamp;  // Template creation time
    }

    // Witness record for high-stakes consents
    struct WitnessRecord {
        address witness;           // Witness address
        string name;               // Witness name (encrypted)
        string role;               // Witness role/title
        bytes signature;           // Witness digital signature
        uint256 timestamp;         // Witness signature timestamp
    }

    // Storage mappings
    mapping(string => ConsentRecord) public consentRecords;
    mapping(address => string[]) public patientConsents;
    mapping(address => string[]) public providerConsents;
    mapping(string => ConsentTemplate) public consentTemplates;
    mapping(string => WitnessRecord[]) public consentWitnesses;
    mapping(bytes32 => bool) public usedSignatures; // Prevent signature replay
    
    // Consent type specific mappings
    mapping(ConsentType => string[]) public consentsByType;
    mapping(address => mapping(ConsentType => string[])) public patientConsentsByType;

    // Events
    event ConsentGranted(
        string indexed consentId,
        address indexed patient,
        address indexed provider,
        ConsentType consentType,
        uint256 timestamp
    );

    event ConsentRevoked(
        string indexed consentId,
        address indexed patient,
        string reason,
        uint256 timestamp
    );

    event ConsentExpired(
        string indexed consentId,
        address indexed patient,
        uint256 timestamp
    );

    event ConsentTemplateCreated(
        string indexed templateId,
        ConsentType consentType,
        address creator,
        uint256 timestamp
    );

    event WitnessAdded(
        string indexed consentId,
        address indexed witness,
        string role,
        uint256 timestamp
    );

    event ConsentUpdated(
        string indexed consentId,
        address indexed patient,
        string updateType,
        uint256 timestamp
    );

    // Modifiers
    modifier onlyPatientOrAuthorized(string memory consentId) {
        require(
            msg.sender == consentRecords[consentId].patient ||
            msg.sender == consentRecords[consentId].provider ||
            hasRole(ADMIN_ROLE, msg.sender),
            "Unauthorized access to consent record"
        );
        _;
    }

    modifier validConsentId(string memory consentId) {
        require(bytes(consentId).length > 0, "Invalid consent ID");
        require(consentRecords[consentId].grantedTimestamp > 0, "Consent does not exist");
        _;
    }

    modifier onlyHealthcareProvider() {
        require(
            hasRole(HEALTHCARE_PROVIDER_ROLE, msg.sender) || 
            hasRole(ADMIN_ROLE, msg.sender),
            "Only healthcare providers can perform this action"
        );
        _;
    }

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Create a new consent template
     * @param templateId Unique template identifier
     * @param consentType Type of consent
     * @param title Template title
     * @param description Template description
     * @param termsContent Terms content (IPFS hash)
     * @param validityPeriod Default validity period in seconds
     * @param requiresWitness Whether witness is required
     */
    function createConsentTemplate(
        string memory templateId,
        ConsentType consentType,
        string memory title,
        string memory description,
        string memory termsContent,
        uint256 validityPeriod,
        bool requiresWitness
    ) external onlyHealthcareProvider {
        require(bytes(templateId).length > 0, "Template ID cannot be empty");
        require(bytes(title).length > 0, "Title cannot be empty");
        require(consentTemplates[templateId].createdTimestamp == 0, "Template already exists");

        consentTemplates[templateId] = ConsentTemplate({
            templateId: templateId,
            consentType: consentType,
            title: title,
            description: description,
            termsContent: termsContent,
            validityPeriod: validityPeriod,
            requiresWitness: requiresWitness,
            isActive: true,
            creator: msg.sender,
            createdTimestamp: block.timestamp
        });

        emit ConsentTemplateCreated(templateId, consentType, msg.sender, block.timestamp);
    }

    /**
     * @dev Grant consent using a template
     * @param consentId Unique consent identifier
     * @param templateId Template to use
     * @param patient Patient's address
     * @param patientSignature Patient's digital signature
     * @param authorizedParties Additional authorized parties
     * @param customExpiryTimestamp Custom expiry (0 = use template default)
     */
    function grantConsent(
        string memory consentId,
        string memory templateId,
        address patient,
        bytes memory patientSignature,
        string[] memory authorizedParties,
        uint256 customExpiryTimestamp
    ) external onlyHealthcareProvider nonReentrant {
        require(bytes(consentId).length > 0, "Consent ID cannot be empty");
        require(patient != address(0), "Invalid patient address");
        require(consentRecords[consentId].grantedTimestamp == 0, "Consent already exists");
        require(consentTemplates[templateId].isActive, "Template is not active");

        ConsentTemplate memory template = consentTemplates[templateId];
        
        // Calculate expiry timestamp
        uint256 expiryTimestamp = customExpiryTimestamp;
        if (expiryTimestamp == 0 && template.validityPeriod > 0) {
            expiryTimestamp = block.timestamp + template.validityPeriod;
        }

        // Verify patient signature
        bytes32 messageHash = keccak256(abi.encodePacked(consentId, templateId, patient));
        require(!usedSignatures[keccak256(patientSignature)], "Signature already used");
        require(verifySignature(messageHash, patientSignature, patient), "Invalid patient signature");

        // Create provider signature
        bytes32 providerMessageHash = keccak256(abi.encodePacked(consentId, msg.sender, block.timestamp));
        bytes memory providerSignature = abi.encodePacked(providerMessageHash);

        // Create consent record
        ConsentRecord storage consent = consentRecords[consentId];
        consent.consentId = consentId;
        consent.patient = patient;
        consent.provider = msg.sender;
        consent.consentType = template.consentType;
        consent.status = ConsentStatus.Active;
        consent.description = template.description;
        consent.termsHash = template.termsContent;
        consent.patientSignature = patientSignature;
        consent.providerSignature = providerSignature;
        consent.grantedTimestamp = block.timestamp;
        consent.expiryTimestamp = expiryTimestamp;
        consent.revokedTimestamp = 0;
        consent.authorizedParties = authorizedParties;
        consent.metadata = "";

        // Mark signature as used
        usedSignatures[keccak256(patientSignature)] = true;

        // Update indexes
        patientConsents[patient].push(consentId);
        providerConsents[msg.sender].push(consentId);
        consentsByType[template.consentType].push(consentId);
        patientConsentsByType[patient][template.consentType].push(consentId);

        emit ConsentGranted(consentId, patient, msg.sender, template.consentType, block.timestamp);

        // Check if witness is required
        if (template.requiresWitness) {
            consent.status = ConsentStatus.Pending; // Wait for witness
        }
    }

    /**
     * @dev Add witness signature to consent
     * @param consentId Consent to witness
     * @param witnessName Witness name (encrypted)
     * @param witnessRole Witness role
     * @param witnessSignature Witness digital signature
     */
    function addWitness(
        string memory consentId,
        string memory witnessName,
        string memory witnessRole,
        bytes memory witnessSignature
    ) external validConsentId(consentId) nonReentrant {
        require(bytes(witnessName).length > 0, "Witness name required");
        require(bytes(witnessRole).length > 0, "Witness role required");
        
        ConsentRecord storage consent = consentRecords[consentId];
        require(consent.status == ConsentStatus.Pending, "Consent is not pending witness");

        // Verify witness signature
        bytes32 messageHash = keccak256(abi.encodePacked(consentId, msg.sender, witnessName));
        require(verifySignature(messageHash, witnessSignature, msg.sender), "Invalid witness signature");

        // Add witness record
        consentWitnesses[consentId].push(WitnessRecord({
            witness: msg.sender,
            name: witnessName,
            role: witnessRole,
            signature: witnessSignature,
            timestamp: block.timestamp
        }));

        // Activate consent
        consent.status = ConsentStatus.Active;

        emit WitnessAdded(consentId, msg.sender, witnessRole, block.timestamp);
    }

    /**
     * @dev Revoke consent
     * @param consentId Consent to revoke
     * @param reason Reason for revocation
     */
    function revokeConsent(
        string memory consentId,
        string memory reason
    ) external validConsentId(consentId) nonReentrant {
        ConsentRecord storage consent = consentRecords[consentId];
        require(
            msg.sender == consent.patient || 
            hasRole(ADMIN_ROLE, msg.sender),
            "Only patient or admin can revoke consent"
        );
        require(consent.status == ConsentStatus.Active, "Consent is not active");

        consent.status = ConsentStatus.Revoked;
        consent.revokedTimestamp = block.timestamp;

        emit ConsentRevoked(consentId, consent.patient, reason, block.timestamp);
    }

    /**
     * @dev Check if consent is currently valid
     * @param consentId Consent to check
     * @return Boolean indicating validity
     */
    function isConsentValid(string memory consentId) 
        external 
        view 
        validConsentId(consentId)
        returns (bool) 
    {
        ConsentRecord storage consent = consentRecords[consentId];
        
        if (consent.status != ConsentStatus.Active) {
            return false;
        }
        
        if (consent.expiryTimestamp > 0 && block.timestamp > consent.expiryTimestamp) {
            return false;
        }
        
        return true;
    }

    /**
     * @dev Get consent record
     * @param consentId Consent ID to retrieve
     * @return Consent record data
     */
    function getConsent(string memory consentId) 
        external 
        view 
        validConsentId(consentId)
        onlyPatientOrAuthorized(consentId)
        returns (
            address patient,
            address provider,
            ConsentType consentType,
            ConsentStatus status,
            string memory description,
            uint256 grantedTimestamp,
            uint256 expiryTimestamp,
            string[] memory authorizedParties
        ) 
    {
        ConsentRecord storage consent = consentRecords[consentId];
        return (
            consent.patient,
            consent.provider,
            consent.consentType,
            consent.status,
            consent.description,
            consent.grantedTimestamp,
            consent.expiryTimestamp,
            consent.authorizedParties
        );
    }

    /**
     * @dev Get patient's consents by type
     * @param patient Patient address
     * @param consentType Type of consent
     * @return Array of consent IDs
     */
    function getPatientConsentsByType(address patient, ConsentType consentType) 
        external 
        view 
        returns (string[] memory) 
    {
        require(
            msg.sender == patient || 
            hasRole(ADMIN_ROLE, msg.sender) ||
            hasRole(AUDITOR_ROLE, msg.sender),
            "Unauthorized access"
        );
        
        return patientConsentsByType[patient][consentType];
    }

    /**
     * @dev Get consent template
     * @param templateId Template ID
     * @return Template data
     */
    function getConsentTemplate(string memory templateId) 
        external 
        view 
        returns (ConsentTemplate memory) 
    {
        require(consentTemplates[templateId].createdTimestamp > 0, "Template does not exist");
        return consentTemplates[templateId];
    }

    /**
     * @dev Get witnesses for a consent
     * @param consentId Consent ID
     * @return Array of witness records
     */
    function getConsentWitnesses(string memory consentId) 
        external 
        view 
        validConsentId(consentId)
        onlyPatientOrAuthorized(consentId)
        returns (WitnessRecord[] memory) 
    {
        return consentWitnesses[consentId];
    }

    /**
     * @dev Set specific permission for a consent
     * @param consentId Consent ID
     * @param permission Permission name
     * @param granted Whether permission is granted
     */
    function setConsentPermission(
        string memory consentId,
        string memory permission,
        bool granted
    ) external validConsentId(consentId) {
        require(
            msg.sender == consentRecords[consentId].patient ||
            hasRole(ADMIN_ROLE, msg.sender),
            "Only patient or admin can set permissions"
        );
        
        consentRecords[consentId].permissions[permission] = granted;
        
        emit ConsentUpdated(consentId, consentRecords[consentId].patient, "permission_updated", block.timestamp);
    }

    /**
     * @dev Check if specific permission is granted
     * @param consentId Consent ID
     * @param permission Permission name
     * @return Boolean indicating if permission is granted
     */
    function hasPermission(string memory consentId, string memory permission) 
        external 
        view 
        validConsentId(consentId)
        returns (bool) 
    {
        return consentRecords[consentId].permissions[permission];
    }

    /**
     * @dev Batch expire consents (admin function)
     * @param consentIds Array of consent IDs to expire
     */
    function batchExpireConsents(string[] memory consentIds) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        for (uint i = 0; i < consentIds.length; i++) {
            if (consentRecords[consentIds[i]].grantedTimestamp > 0 && 
                consentRecords[consentIds[i]].status == ConsentStatus.Active) {
                
                consentRecords[consentIds[i]].status = ConsentStatus.Expired;
                
                emit ConsentExpired(
                    consentIds[i], 
                    consentRecords[consentIds[i]].patient, 
                    block.timestamp
                );
            }
        }
    }

    /**
     * @dev Verify digital signature
     * @param messageHash Hash of the signed message
     * @param signature Digital signature
     * @param signer Expected signer address
     * @return Boolean indicating signature validity
     */
    function verifySignature(
        bytes32 messageHash,
        bytes memory signature,
        address signer
    ) internal pure returns (bool) {
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        return ethSignedMessageHash.recover(signature) == signer;
    }

    /**
     * @dev Get consent statistics
     * @return Total consents, active consents, expired consents, revoked consents
     */
    function getConsentStatistics() 
        external 
        view 
        onlyRole(ADMIN_ROLE)
        returns (uint256, uint256, uint256, uint256) 
    {
        // This would require additional tracking in a full implementation
        return (0, 0, 0, 0); // Placeholder
    }

    /**
     * @dev Deactivate consent template
     * @param templateId Template to deactivate
     */
    function deactivateTemplate(string memory templateId) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        require(consentTemplates[templateId].createdTimestamp > 0, "Template does not exist");
        consentTemplates[templateId].isActive = false;
    }
}