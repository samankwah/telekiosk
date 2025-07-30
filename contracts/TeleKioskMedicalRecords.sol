// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title TeleKiosk Medical Records Smart Contract
 * @dev Secure, HIPAA-compliant medical record storage on blockchain
 * @author TeleKiosk AI Integration Team
 */
contract TeleKioskMedicalRecords is AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant DOCTOR_ROLE = keccak256("DOCTOR_ROLE");
    bytes32 public constant PATIENT_ROLE = keccak256("PATIENT_ROLE");
    bytes32 public constant EMERGENCY_ROLE = keccak256("EMERGENCY_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    struct MedicalRecord {
        string recordId;
        address patient;
        address provider;
        string encryptedData; // AES-256 encrypted medical data
        bytes32 dataHash; // Verification hash
        uint256 timestamp;
        string recordType; // consultation, diagnostic, prescription, etc.
        bool isEmergency;
        string[] attachedFiles; // IPFS hashes for images, videos, documents
    }

    struct AccessPermission {
        address user;
        uint256 expirationTime;
        bool canWrite;
        bool canDelete;
        string permissionType; // temporary, permanent, emergency
    }

    struct ConsentRecord {
        address patient;
        address provider;
        string consentType; // treatment, data_sharing, research
        bool isActive;
        uint256 grantedAt;
        uint256 expiresAt;
        string digitalSignature;
    }

    // Main storage mappings
    mapping(string => MedicalRecord) public medicalRecords;
    mapping(string => mapping(address => AccessPermission)) public accessPermissions;
    mapping(address => string[]) public patientRecords;
    mapping(address => ConsentRecord[]) public patientConsents;
    mapping(bytes32 => bool) public usedHashes; // Prevent duplicate records

    // Analytics and audit trails
    mapping(string => address[]) public recordAccessHistory;
    mapping(address => uint256) public userActivityCount;

    // Events for transparency and monitoring
    event MedicalRecordCreated(
        string indexed recordId,
        address indexed patient,
        address indexed provider,
        string recordType,
        uint256 timestamp
    );

    event AccessGranted(
        string indexed recordId,
        address indexed patient,
        address indexed grantedTo,
        string permissionType,
        uint256 expirationTime
    );

    event RecordAccessed(
        string indexed recordId,
        address indexed accessor,
        uint256 timestamp
    );

    event EmergencyAccess(
        string indexed recordId,
        address indexed emergencyUser,
        uint256 timestamp
    );

    event ConsentGranted(
        address indexed patient,
        address indexed provider,
        string consentType,
        uint256 expiresAt
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Store a new medical record with encryption and access control
     */
    function storeMedicalRecord(
        string memory _recordId,
        address _patient,
        string memory _encryptedData,
        bytes32 _dataHash,
        string memory _recordType,
        bool _isEmergency,
        string[] memory _attachedFiles
    ) public whenNotPaused nonReentrant {
        require(hasRole(DOCTOR_ROLE, msg.sender) || hasRole(ADMIN_ROLE, msg.sender), "Unauthorized");
        require(bytes(_recordId).length > 0, "Invalid record ID");
        require(_patient != address(0), "Invalid patient address");
        require(!usedHashes[_dataHash], "Duplicate record hash");
        require(medicalRecords[_recordId].timestamp == 0, "Record already exists");

        // Create the medical record
        medicalRecords[_recordId] = MedicalRecord({
            recordId: _recordId,
            patient: _patient,
            provider: msg.sender,
            encryptedData: _encryptedData,
            dataHash: _dataHash,
            timestamp: block.timestamp,
            recordType: _recordType,
            isEmergency: _isEmergency,
            attachedFiles: _attachedFiles
        });

        // Update patient record list
        patientRecords[_patient].push(_recordId);
        
        // Mark hash as used
        usedHashes[_dataHash] = true;

        // Automatically grant access to patient and provider
        _grantAccess(_recordId, _patient, "permanent", type(uint256).max, true, false);
        _grantAccess(_recordId, msg.sender, "permanent", type(uint256).max, true, true);

        emit MedicalRecordCreated(_recordId, _patient, msg.sender, _recordType, block.timestamp);

        // Handle emergency records
        if (_isEmergency) {
            emit EmergencyAccess(_recordId, msg.sender, block.timestamp);
        }
    }

    /**
     * @dev Grant access to a medical record
     */
    function grantAccess(
        string memory _recordId,
        address _user,
        string memory _permissionType,
        uint256 _expirationTime,
        bool _canWrite,
        bool _canDelete
    ) public {
        require(
            msg.sender == medicalRecords[_recordId].patient || 
            hasRole(DOCTOR_ROLE, msg.sender) || 
            hasRole(ADMIN_ROLE, msg.sender),
            "Not authorized to grant access"
        );
        
        _grantAccess(_recordId, _user, _permissionType, _expirationTime, _canWrite, _canDelete);
    }

    /**
     * @dev Internal function to grant access
     */
    function _grantAccess(
        string memory _recordId,
        address _user,
        string memory _permissionType,
        uint256 _expirationTime,
        bool _canWrite,
        bool _canDelete
    ) internal {
        accessPermissions[_recordId][_user] = AccessPermission({
            user: _user,
            expirationTime: _expirationTime,
            canWrite: _canWrite,
            canDelete: _canDelete,
            permissionType: _permissionType
        });

        emit AccessGranted(_recordId, medicalRecords[_recordId].patient, _user, _permissionType, _expirationTime);
    }

    /**
     * @dev Retrieve a medical record (with access control)
     */
    function getMedicalRecord(string memory _recordId) 
        public 
        view 
        returns (MedicalRecord memory) 
    {
        require(_hasAccess(_recordId, msg.sender), "Access denied");
        return medicalRecords[_recordId];
    }

    /**
     * @dev Emergency access to medical records
     */
    function emergencyAccess(string memory _recordId) 
        public 
        whenNotPaused 
        returns (MedicalRecord memory) 
    {
        require(hasRole(EMERGENCY_ROLE, msg.sender), "Not authorized for emergency access");
        
        MedicalRecord memory record = medicalRecords[_recordId];
        require(record.timestamp > 0, "Record does not exist");

        // Log emergency access
        recordAccessHistory[_recordId].push(msg.sender);
        userActivityCount[msg.sender]++;

        emit EmergencyAccess(_recordId, msg.sender, block.timestamp);
        
        return record;
    }

    /**
     * @dev Record patient consent
     */
    function recordConsent(
        address _patient,
        string memory _consentType,
        uint256 _expiresAt,
        string memory _digitalSignature
    ) public {
        require(hasRole(DOCTOR_ROLE, msg.sender) || hasRole(ADMIN_ROLE, msg.sender), "Unauthorized");
        
        patientConsents[_patient].push(ConsentRecord({
            patient: _patient,
            provider: msg.sender,
            consentType: _consentType,
            isActive: true,
            grantedAt: block.timestamp,
            expiresAt: _expiresAt,
            digitalSignature: _digitalSignature
        }));

        emit ConsentGranted(_patient, msg.sender, _consentType, _expiresAt);
    }

    /**
     * @dev Get patient's medical records
     */
    function getPatientRecords(address _patient) 
        public 
        view 
        returns (string[] memory) 
    {
        require(
            msg.sender == _patient || 
            hasRole(DOCTOR_ROLE, msg.sender) || 
            hasRole(ADMIN_ROLE, msg.sender) ||
            hasRole(EMERGENCY_ROLE, msg.sender),
            "Access denied"
        );
        
        return patientRecords[_patient];
    }

    /**
     * @dev Check if user has access to a record
     */
    function _hasAccess(string memory _recordId, address _user) 
        internal 
        view 
        returns (bool) 
    {
        MedicalRecord memory record = medicalRecords[_recordId];
        
        // Patient always has access to their own records
        if (_user == record.patient) return true;
        
        // Provider who created the record has access
        if (_user == record.provider) return true;
        
        // Check role-based access
        if (hasRole(ADMIN_ROLE, _user) || hasRole(EMERGENCY_ROLE, _user)) return true;
        
        // Check specific permissions
        AccessPermission memory permission = accessPermissions[_recordId][_user];
        if (permission.user == _user && 
            (permission.expirationTime == type(uint256).max || permission.expirationTime > block.timestamp)) {
            return true;
        }
        
        return false;
    }

    /**
     * @dev Verify record integrity
     */
    function verifyRecordIntegrity(string memory _recordId, bytes32 _expectedHash) 
        public 
        view 
        returns (bool) 
    {
        return medicalRecords[_recordId].dataHash == _expectedHash;
    }

    /**
     * @dev Get access history for a record
     */
    function getAccessHistory(string memory _recordId) 
        public 
        view 
        returns (address[] memory) 
    {
        require(_hasAccess(_recordId, msg.sender), "Access denied");
        return recordAccessHistory[_recordId];
    }

    /**
     * @dev Admin functions
     */
    function addDoctor(address _doctor) public onlyRole(ADMIN_ROLE) {
        grantRole(DOCTOR_ROLE, _doctor);
    }

    function addEmergencyResponder(address _responder) public onlyRole(ADMIN_ROLE) {
        grantRole(EMERGENCY_ROLE, _responder);
    }

    function pause() public onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @dev Revoke access to a record
     */
    function revokeAccess(string memory _recordId, address _user) 
        public 
    {
        require(
            msg.sender == medicalRecords[_recordId].patient || 
            hasRole(ADMIN_ROLE, msg.sender),
            "Not authorized to revoke access"
        );
        
        delete accessPermissions[_recordId][_user];
    }

    /**
     * @dev Get contract statistics
     */
    function getContractStats() 
        public 
        view 
        returns (uint256 totalRecords, uint256 totalPatients, uint256 totalProviders) 
    {
        // Note: In a real implementation, these would be maintained as state variables
        // for gas efficiency. This is a simplified version.
        return (0, 0, 0); // Placeholder implementation
    }

    /**
     * @dev Update encrypted data (for record amendments)
     */
    function updateRecordData(
        string memory _recordId,
        string memory _newEncryptedData,
        bytes32 _newDataHash
    ) public whenNotPaused {
        require(_hasAccess(_recordId, msg.sender), "Access denied");
        require(
            accessPermissions[_recordId][msg.sender].canWrite || 
            msg.sender == medicalRecords[_recordId].provider ||
            hasRole(ADMIN_ROLE, msg.sender),
            "Write access denied"
        );
        require(!usedHashes[_newDataHash], "Duplicate record hash");

        // Mark old hash as unused and new hash as used
        usedHashes[medicalRecords[_recordId].dataHash] = false;
        usedHashes[_newDataHash] = true;

        medicalRecords[_recordId].encryptedData = _newEncryptedData;
        medicalRecords[_recordId].dataHash = _newDataHash;

        // Log the access
        recordAccessHistory[_recordId].push(msg.sender);
        userActivityCount[msg.sender]++;

        emit RecordAccessed(_recordId, msg.sender, block.timestamp);
    }
}