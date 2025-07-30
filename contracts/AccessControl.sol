// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title TeleKiosk Access Control Smart Contract
 * @dev Advanced access control system for Ghana's healthcare blockchain infrastructure
 * @author AI Integration Lead - TeleKiosk Team
 */
contract TeleKioskAccessControl is AccessControl, ReentrancyGuard, Pausable {
    
    // Advanced role definitions for Ghana healthcare system
    bytes32 public constant SUPER_ADMIN_ROLE = keccak256("SUPER_ADMIN_ROLE");
    bytes32 public constant HOSPITAL_ADMIN_ROLE = keccak256("HOSPITAL_ADMIN_ROLE");
    bytes32 public constant DOCTOR_ROLE = keccak256("DOCTOR_ROLE");
    bytes32 public constant NURSE_ROLE = keccak256("NURSE_ROLE");
    bytes32 public constant PHARMACIST_ROLE = keccak256("PHARMACIST_ROLE");
    bytes32 public constant LAB_TECHNICIAN_ROLE = keccak256("LAB_TECHNICIAN_ROLE");
    bytes32 public constant PATIENT_ROLE = keccak256("PATIENT_ROLE");
    bytes32 public constant INSURANCE_ROLE = keccak256("INSURANCE_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");
    bytes32 public constant EMERGENCY_RESPONDER_ROLE = keccak256("EMERGENCY_RESPONDER_ROLE");
    bytes32 public constant RESEARCHER_ROLE = keccak256("RESEARCHER_ROLE");
    bytes32 public constant SYSTEM_ROLE = keccak256("SYSTEM_ROLE");

    // Permission levels
    enum PermissionLevel {
        None,           // No access
        Read,           // Read-only access
        Write,          // Read and write access
        Admin,          // Full administrative access
        Emergency       // Emergency override access
    }

    // Access context for fine-grained control
    struct AccessContext {
        string resourceType;        // Type of resource being accessed
        string resourceId;          // Specific resource identifier
        PermissionLevel required;   // Required permission level
        bool requiresConsent;       // Whether patient consent is needed
        bool allowEmergencyOverride; // Allow emergency access
        uint256 accessExpiry;       // When access expires (0 = no expiry)
        string[] restrictions;      // Additional access restrictions
    }

    // User profile with Ghana-specific information
    struct UserProfile {
        address userAddress;        // User's wallet address
        string userId;              // Ghana National ID or Medical Council ID
        string name;                // User's name (encrypted)
        string role;                // Primary role
        string institution;         // Hospital/clinic affiliation
        string specialization;      // Medical specialization (if applicable)
        bool isVerified;            // Verification status
        bool isActive;              // Account active status
        uint256 registrationTime;   // Account registration timestamp
        uint256 lastActivity;       // Last activity timestamp
        string[] certifications;    // Professional certifications
        mapping(string => PermissionLevel) resourcePermissions; // Resource-specific permissions
    }

    // Session management for enhanced security
    struct UserSession {
        address user;               // User address
        bytes32 sessionId;          // Unique session identifier
        uint256 startTime;          // Session start time
        uint256 lastActivity;       // Last activity in session
        uint256 expiryTime;         // Session expiry time
        string ipAddress;           // User's IP address (hashed)
        bool isActive;              // Session active status
        uint256 accessCount;        // Number of accesses in this session
    }

    // Audit log entry
    struct AuditLogEntry {
        address user;               // User who performed the action
        string action;              // Action performed
        string resourceId;          // Resource accessed
        string details;             // Additional details
        bool success;               // Whether action was successful
        uint256 timestamp;          // When action was performed
        bytes32 sessionId;          // Session ID
    }

    // Emergency access record
    struct EmergencyAccess {
        address requester;          // Who requested emergency access
        string resourceId;          // Resource accessed
        string justification;       // Justification for emergency access
        uint256 timestamp;          // When emergency access was granted
        uint256 duration;           // How long emergency access lasts
        address approver;           // Who approved (if required)
        bool isActive;              // Whether emergency access is still active
    }

    // Storage mappings
    mapping(address => UserProfile) public userProfiles;
    mapping(bytes32 => UserSession) public userSessions;
    mapping(address => bytes32[]) public userSessionHistory;
    mapping(string => AccessContext) public resourceAccessContexts;
    mapping(address => bool) public blockedUsers;
    mapping(string => EmergencyAccess) public emergencyAccesses;
    
    // Audit logging
    AuditLogEntry[] public auditLog;
    mapping(address => uint256[]) public userAuditHistory;
    
    // Role hierarchies for Ghana healthcare system
    mapping(bytes32 => bytes32[]) public roleHierarchy;
    mapping(address => uint256) public failedLoginAttempts;
    mapping(address => uint256) public lastFailedLogin;

    // Configuration
    uint256 public constant SESSION_DURATION = 8 hours;
    uint256 public constant MAX_FAILED_ATTEMPTS = 3;
    uint256 public constant LOCKOUT_DURATION = 1 hours;
    uint256 public constant EMERGENCY_ACCESS_DURATION = 1 hours;

    // Events
    event UserRegistered(
        address indexed user,
        string userId,
        string role,
        uint256 timestamp
    );

    event RoleGranted(
        address indexed user,
        bytes32 indexed role,
        address indexed granter,
        uint256 timestamp
    );

    event SessionCreated(
        address indexed user,
        bytes32 indexed sessionId,
        uint256 expiryTime
    );

    event AccessGranted(
        address indexed user,
        string resourceId,
        string action,
        uint256 timestamp
    );

    event AccessDenied(
        address indexed user,
        string resourceId,
        string reason,
        uint256 timestamp
    );

    event EmergencyAccessGranted(
        address indexed user,
        string resourceId,
        string justification,
        uint256 timestamp
    );

    event UserBlocked(
        address indexed user,
        string reason,
        uint256 timestamp
    );

    event AuditLogEntry(
        address indexed user,
        string indexed action,
        string resourceId,
        bool success,
        uint256 timestamp
    );

    // Modifiers
    modifier onlyVerifiedUser() {
        require(userProfiles[msg.sender].isVerified, "User not verified");
        require(userProfiles[msg.sender].isActive, "User account inactive");
        require(!blockedUsers[msg.sender], "User is blocked");
        _;
    }

    modifier validSession(bytes32 sessionId) {
        require(userSessions[sessionId].isActive, "Invalid or expired session");
        require(userSessions[sessionId].user == msg.sender, "Session does not belong to user");
        require(block.timestamp <= userSessions[sessionId].expiryTime, "Session expired");
        _;
        
        // Update last activity
        userSessions[sessionId].lastActivity = block.timestamp;
        userSessions[sessionId].accessCount++;
    }

    modifier notBlocked() {
        require(!blockedUsers[msg.sender], "User is blocked");
        require(
            failedLoginAttempts[msg.sender] < MAX_FAILED_ATTEMPTS ||
            block.timestamp > lastFailedLogin[msg.sender] + LOCKOUT_DURATION,
            "User is temporarily locked out"
        );
        _;
    }

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(SUPER_ADMIN_ROLE, msg.sender);
        
        // Set up role hierarchies
        setupRoleHierarchies();
    }

    /**
     * @dev Set up role hierarchies for Ghana healthcare system
     */
    function setupRoleHierarchies() internal {
        // Super Admin can grant all roles
        _setRoleAdmin(HOSPITAL_ADMIN_ROLE, SUPER_ADMIN_ROLE);
        _setRoleAdmin(DOCTOR_ROLE, HOSPITAL_ADMIN_ROLE);
        _setRoleAdmin(NURSE_ROLE, HOSPITAL_ADMIN_ROLE);
        _setRoleAdmin(PHARMACIST_ROLE, HOSPITAL_ADMIN_ROLE);
        _setRoleAdmin(LAB_TECHNICIAN_ROLE, HOSPITAL_ADMIN_ROLE);
        _setRoleAdmin(PATIENT_ROLE, HOSPITAL_ADMIN_ROLE);
        _setRoleAdmin(INSURANCE_ROLE, SUPER_ADMIN_ROLE);
        _setRoleAdmin(AUDITOR_ROLE, SUPER_ADMIN_ROLE);
        _setRoleAdmin(EMERGENCY_RESPONDER_ROLE, HOSPITAL_ADMIN_ROLE);
        _setRoleAdmin(RESEARCHER_ROLE, SUPER_ADMIN_ROLE);
        _setRoleAdmin(SYSTEM_ROLE, SUPER_ADMIN_ROLE);
    }

    /**
     * @dev Register a new user in the system
     * @param userAddress User's wallet address
     * @param userId Ghana National ID or Medical Council ID
     * @param name User's name (encrypted)
     * @param roleString Primary role
     * @param institution Hospital/clinic affiliation
     * @param specialization Medical specialization
     */
    function registerUser(
        address userAddress,
        string memory userId,
        string memory name,
        string memory roleString,
        string memory institution,
        string memory specialization
    ) external onlyRole(HOSPITAL_ADMIN_ROLE) {
        require(userAddress != address(0), "Invalid user address");
        require(bytes(userId).length > 0, "User ID required");
        require(!userProfiles[userAddress].isVerified, "User already registered");

        UserProfile storage profile = userProfiles[userAddress];
        profile.userAddress = userAddress;
        profile.userId = userId;
        profile.name = name;
        profile.role = roleString;
        profile.institution = institution;
        profile.specialization = specialization;
        profile.isVerified = false; // Requires separate verification
        profile.isActive = true;
        profile.registrationTime = block.timestamp;
        profile.lastActivity = block.timestamp;

        emit UserRegistered(userAddress, userId, roleString, block.timestamp);
    }

    /**
     * @dev Verify a registered user
     * @param userAddress User to verify
     * @param roleToGrant Role to grant after verification
     */
    function verifyUser(address userAddress, bytes32 roleToGrant) 
        external 
        onlyRole(HOSPITAL_ADMIN_ROLE) 
    {
        require(userProfiles[userAddress].registrationTime > 0, "User not registered");
        require(!userProfiles[userAddress].isVerified, "User already verified");

        userProfiles[userAddress].isVerified = true;
        _grantRole(roleToGrant, userAddress);

        emit RoleGranted(userAddress, roleToGrant, msg.sender, block.timestamp);
    }

    /**
     * @dev Create a new user session
     * @param ipAddressHash Hash of user's IP address
     * @return sessionId Generated session ID
     */
    function createSession(string memory ipAddressHash) 
        external 
        onlyVerifiedUser 
        notBlocked 
        nonReentrant 
        returns (bytes32) 
    {
        bytes32 sessionId = generateSessionId(msg.sender);
        
        userSessions[sessionId] = UserSession({
            user: msg.sender,
            sessionId: sessionId,
            startTime: block.timestamp,
            lastActivity: block.timestamp,
            expiryTime: block.timestamp + SESSION_DURATION,
            ipAddress: ipAddressHash,
            isActive: true,
            accessCount: 0
        });

        userSessionHistory[msg.sender].push(sessionId);
        userProfiles[msg.sender].lastActivity = block.timestamp;

        // Reset failed login attempts on successful session creation
        failedLoginAttempts[msg.sender] = 0;

        emit SessionCreated(msg.sender, sessionId, block.timestamp + SESSION_DURATION);
        
        logAuditEntry(msg.sender, "session_created", "", true, sessionId);
        
        return sessionId;
    }

    /**
     * @dev Check if user has permission to access a resource
     * @param user User address
     * @param resourceId Resource identifier
     * @param action Action being performed
     * @param sessionId User's session ID
     * @return bool Whether access is granted
     */
    function checkAccess(
        address user,
        string memory resourceId,
        string memory action,
        bytes32 sessionId
    ) external validSession(sessionId) returns (bool) {
        // Basic checks
        if (blockedUsers[user]) {
            logAuditEntry(user, action, resourceId, false, sessionId);
            emit AccessDenied(user, resourceId, "User blocked", block.timestamp);
            return false;
        }

        if (!userProfiles[user].isVerified || !userProfiles[user].isActive) {
            logAuditEntry(user, action, resourceId, false, sessionId);
            emit AccessDenied(user, resourceId, "User not verified or inactive", block.timestamp);
            return false;
        }

        // Check resource-specific permissions
        AccessContext memory context = resourceAccessContexts[resourceId];
        
        if (context.accessExpiry > 0 && block.timestamp > context.accessExpiry) {
            logAuditEntry(user, action, resourceId, false, sessionId);
            emit AccessDenied(user, resourceId, "Resource access expired", block.timestamp);
            return false;
        }

        // Check if user has required permission level
        PermissionLevel userLevel = getUserPermissionLevel(user, context.resourceType);
        if (userLevel < context.required) {
            // Check for emergency access
            if (context.allowEmergencyOverride && hasRole(EMERGENCY_RESPONDER_ROLE, user)) {
                return handleEmergencyAccess(user, resourceId, action, sessionId);
            }
            
            logAuditEntry(user, action, resourceId, false, sessionId);
            emit AccessDenied(user, resourceId, "Insufficient permissions", block.timestamp);
            return false;
        }

        // Check consent requirements (simplified - would integrate with consent contract)
        if (context.requiresConsent) {
            // In full implementation, this would check the consent management contract
            // For now, we'll assume consent is handled separately
        }

        // Access granted
        logAuditEntry(user, action, resourceId, true, sessionId);
        emit AccessGranted(user, resourceId, action, block.timestamp);
        return true;
    }

    /**
     * @dev Handle emergency access request
     * @param user User requesting access
     * @param resourceId Resource being accessed
     * @param action Action being performed
     * @param sessionId User's session ID
     * @return bool Whether emergency access is granted
     */
    function handleEmergencyAccess(
        address user,
        string memory resourceId,
        string memory action,
        bytes32 sessionId
    ) internal returns (bool) {
        string memory emergencyId = string(abi.encodePacked(resourceId, "_", uint2str(block.timestamp)));
        
        emergencyAccesses[emergencyId] = EmergencyAccess({
            requester: user,
            resourceId: resourceId,
            justification: string(abi.encodePacked("Emergency access for: ", action)),
            timestamp: block.timestamp,
            duration: EMERGENCY_ACCESS_DURATION,
            approver: address(0), // Auto-approved for emergency responders
            isActive: true
        });

        logAuditEntry(user, action, resourceId, true, sessionId);
        emit EmergencyAccessGranted(user, resourceId, "Emergency access", block.timestamp);
        return true;
    }

    /**
     * @dev Set resource access context
     * @param resourceId Resource identifier
     * @param resourceType Type of resource
     * @param required Required permission level
     * @param requiresConsent Whether consent is needed
     * @param allowEmergencyOverride Allow emergency access
     * @param accessExpiry When access expires (0 = no expiry)
     */
    function setResourceAccessContext(
        string memory resourceId,
        string memory resourceType,
        PermissionLevel required,
        bool requiresConsent,
        bool allowEmergencyOverride,
        uint256 accessExpiry
    ) external onlyRole(HOSPITAL_ADMIN_ROLE) {
        resourceAccessContexts[resourceId] = AccessContext({
            resourceType: resourceType,
            resourceId: resourceId,
            required: required,
            requiresConsent: requiresConsent,
            allowEmergencyOverride: allowEmergencyOverride,
            accessExpiry: accessExpiry,
            restrictions: new string[](0)
        });
    }

    /**
     * @dev Get user's permission level for a resource type
     * @param user User address
     * @param resourceType Type of resource
     * @return PermissionLevel User's permission level
     */
    function getUserPermissionLevel(address user, string memory resourceType) 
        public 
        view 
        returns (PermissionLevel) 
    {
        // Check role-based permissions
        if (hasRole(SUPER_ADMIN_ROLE, user)) return PermissionLevel.Admin;
        if (hasRole(HOSPITAL_ADMIN_ROLE, user)) return PermissionLevel.Admin;
        if (hasRole(DOCTOR_ROLE, user)) return PermissionLevel.Write;
        if (hasRole(NURSE_ROLE, user)) return PermissionLevel.Write;
        if (hasRole(PHARMACIST_ROLE, user)) return PermissionLevel.Write;
        if (hasRole(LAB_TECHNICIAN_ROLE, user)) return PermissionLevel.Write;
        if (hasRole(AUDITOR_ROLE, user)) return PermissionLevel.Read;
        if (hasRole(PATIENT_ROLE, user)) return PermissionLevel.Read;
        
        // Check resource-specific permissions
        return userProfiles[user].resourcePermissions[resourceType];
    }

    /**
     * @dev Block a user
     * @param user User to block
     * @param reason Reason for blocking
     */
    function blockUser(address user, string memory reason) 
        external 
        onlyRole(HOSPITAL_ADMIN_ROLE) 
    {
        blockedUsers[user] = true;
        userProfiles[user].isActive = false;
        
        // Deactivate all user sessions
        bytes32[] memory sessions = userSessionHistory[user];
        for (uint i = 0; i < sessions.length; i++) {
            userSessions[sessions[i]].isActive = false;
        }
        
        emit UserBlocked(user, reason, block.timestamp);
        logAuditEntry(msg.sender, "user_blocked", "", true, bytes32(0));
    }

    /**
     * @dev Unblock a user
     * @param user User to unblock
     */
    function unblockUser(address user) external onlyRole(SUPER_ADMIN_ROLE) {
        blockedUsers[user] = false;
        userProfiles[user].isActive = true;
        failedLoginAttempts[user] = 0;
        
        logAuditEntry(msg.sender, "user_unblocked", "", true, bytes32(0));
    }

    /**
     * @dev Record failed login attempt
     * @param user User who failed login
     */
    function recordFailedLogin(address user) external onlyRole(SYSTEM_ROLE) {
        failedLoginAttempts[user]++;
        lastFailedLogin[user] = block.timestamp;
        
        if (failedLoginAttempts[user] >= MAX_FAILED_ATTEMPTS) {
            logAuditEntry(user, "account_locked", "", true, bytes32(0));
        }
    }

    /**
     * @dev End user session
     * @param sessionId Session to end
     */
    function endSession(bytes32 sessionId) external {
        require(
            userSessions[sessionId].user == msg.sender || 
            hasRole(HOSPITAL_ADMIN_ROLE, msg.sender),
            "Cannot end this session"
        );
        
        userSessions[sessionId].isActive = false;
        logAuditEntry(userSessions[sessionId].user, "session_ended", "", true, sessionId);
    }

    /**
     * @dev Get user profile
     * @param user User address
     * @return User profile data
     */
    function getUserProfile(address user) 
        external 
        view 
        returns (
            string memory userId,
            string memory name,
            string memory role,
            string memory institution,
            bool isVerified,
            bool isActive,
            uint256 registrationTime
        ) 
    {
        require(
            msg.sender == user || 
            hasRole(HOSPITAL_ADMIN_ROLE, msg.sender) ||
            hasRole(AUDITOR_ROLE, msg.sender),
            "Unauthorized access to user profile"
        );
        
        UserProfile storage profile = userProfiles[user];
        return (
            profile.userId,
            profile.name,
            profile.role,
            profile.institution,
            profile.isVerified,
            profile.isActive,
            profile.registrationTime
        );
    }

    /**
     * @dev Get audit log entries for a user
     * @param user User to get audit log for
     * @param startIndex Starting index
     * @param count Number of entries to return
     * @return Array of audit log entry indices
     */
    function getUserAuditLog(address user, uint256 startIndex, uint256 count) 
        external 
        view 
        onlyRole(AUDITOR_ROLE)
        returns (uint256[] memory) 
    {
        uint256[] memory userEntries = userAuditHistory[user];
        uint256 endIndex = startIndex + count;
        if (endIndex > userEntries.length) {
            endIndex = userEntries.length;
        }
        
        uint256[] memory result = new uint256[](endIndex - startIndex);
        for (uint256 i = startIndex; i < endIndex; i++) {
            result[i - startIndex] = userEntries[i];
        }
        
        return result;
    }

    /**
     * @dev Log audit entry
     * @param user User performing action
     * @param action Action performed
     * @param resourceId Resource accessed
     * @param success Whether action was successful
     * @param sessionId Session ID
     */
    function logAuditEntry(
        address user,
        string memory action,
        string memory resourceId,
        bool success,
        bytes32 sessionId
    ) internal {
        uint256 entryIndex = auditLog.length;
        
        auditLog.push(AuditLogEntry({
            user: user,
            action: action,
            resourceId: resourceId,
            details: "",
            success: success,
            timestamp: block.timestamp,
            sessionId: sessionId
        }));
        
        userAuditHistory[user].push(entryIndex);
        
        emit AuditLogEntry(user, action, resourceId, success, block.timestamp);
    }

    /**
     * @dev Generate unique session ID
     * @param user User address
     * @return bytes32 Generated session ID
     */
    function generateSessionId(address user) internal view returns (bytes32) {
        return keccak256(abi.encodePacked(user, block.timestamp, block.prevrandao));
    }

    /**
     * @dev Convert uint to string
     * @param _i Integer to convert
     * @return String representation
     */
    function uint2str(uint _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    /**
     * @dev Pause contract (emergency stop)
     */
    function pause() external onlyRole(SUPER_ADMIN_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause contract
     */
    function unpause() external onlyRole(SUPER_ADMIN_ROLE) {
        _unpause();
    }
}