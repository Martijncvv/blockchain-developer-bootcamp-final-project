// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
    
/// @title Helper contract for OpenCleanUp ecosystem roles
/// @author Martijncvv
/// @notice Contract to keep track of wallet roles in the OpenCleanUp ecosystem
/// @notice This is an experimental contract.
contract OpenCleanUpRoles {

    /// @notice Emitted when role is granted
    /// @param role Roletype that was granded
    /// @param account Account that received the role
    event GrantRole(bytes32 indexed role, address indexed account);

    /// @notice Emitted when role is revoked
    /// @param role Roletype that was revoked
    /// @param account Account that lost the role
    event RevokeRole(bytes32 indexed role, address indexed account);

    // Ecosystem roles 
    mapping(bytes32 => mapping(address => bool)) public roles;
    bytes32 public constant FOUNDATION = 0x42c574c7286eda4a697031a50021e14becf19cc00ff83d93a7547d3809b37f72;
    bytes32 public constant TOKEN_RECEIVER = 0x5256df45158a1b783d5d1b7eae366e43e8adc1ddfe02d99d60edbfba2f122ee1;
    bytes32 public constant TOKEN_DISTRIBUTER = 0xa8be2c61382bed6254f75e306150d63d18d487cc8453e448fff554cbc742e962;
    bytes32 public constant NONE = 0x1b489cce9d784ec074d286492a1ccc9efab255c8a4e6b74d2406b5b7674c6e74;
    // bytes32 public constant NONE = keccak256(abi.encodePacked("x"));

    /// @notice Checks if address is authorized to change roles
    /// @param role Roletype that was granded
    modifier onlyRole(bytes32 role) {
        require(roles[role][msg.sender], "Not authorized with role");
        _;
    }

    /// @notice Grants role to address
    /// @param role Roletype that was granded
    /// @param account Account that received roletype
    function grantRole(bytes32 role, address account) external onlyRole(FOUNDATION) {
           roles[role][account] = true;
        emit GrantRole(role, account);
    }

    /// @notice Revokes role of address
    /// @param role Roletype that was granded
    /// @param account Account that received roletype
    function revokeRole(bytes32 role, address account) external onlyRole(FOUNDATION) {
        roles[role][account] = false;
        emit RevokeRole(role, account);
    }
    
    /// @notice Checks role of an address
    /// @param account Account to check roletype
    function roleOf(address account) external view returns(bytes32 role) {
        roles[FOUNDATION][account] ? role = FOUNDATION :  
        roles[TOKEN_RECEIVER][account] ? role = TOKEN_RECEIVER :
        roles[TOKEN_DISTRIBUTER][account] ? role = TOKEN_DISTRIBUTER : role = NONE;
    }

    /// @notice Function added for preview purposes; Grants Foundation role to message sender
    function previewGrantRole() external {
           roles[0x42c574c7286eda4a697031a50021e14becf19cc00ff83d93a7547d3809b37f72][msg.sender] = true;
        emit GrantRole(0x42c574c7286eda4a697031a50021e14becf19cc00ff83d93a7547d3809b37f72, msg.sender);
    }
  
}