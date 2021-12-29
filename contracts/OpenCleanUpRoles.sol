// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
    
contract OpenCleanUpRoles {
    event GrantRole(bytes32 indexed role, address indexed account);
    event RevokeRole(bytes32 indexed role, address indexed account);
    event Log(string func, address sender, uint value, bytes data);

    address public owner;
    // Ecosystem roles 
    mapping(bytes32 => mapping(address => bool)) public roles;
    // FOUNDATION 0x42c574c7286eda4a697031a50021e14becf19cc00ff83d93a7547d3809b37f72
    bytes32 public constant FOUNDATION = "0x42c574c7286eda4a697031a50021e14becf19cc00ff83d93a7547d3809b37f72";
    // TOKEN_RECEIVER 0x5256df45158a1b783d5d1b7eae366e43e8adc1ddfe02d99d60edbfba2f122ee1
    bytes32 public constant TOKEN_RECEIVER = "0x5256df45158a1b783d5d1b7eae366e43e8adc1ddfe02d99d60edbfba2f122ee1";
    // TOKEN_DISTRIBUTER 0xa8be2c61382bed6254f75e306150d63d18d487cc8453e448fff554cbc742e962
    bytes32 public constant TOKEN_DISTRIBUTER = "0xa8be2c61382bed6254f75e306150d63d18d487cc8453e448fff554cbc742e962";
    // NONE 0x1b489cce9d784ec074d286492a1ccc9efab255c8a4e6b74d2406b5b7674c6e74
    bytes32 public constant NONE = "1b489cce9d784ec074d286492a1ccc9efab255c8a4e6b74d2406b5b7674c6e74";
    // // FOUNDATION 0x42c574c7286eda4a697031a50021e14becf19cc00ff83d93a7547d3809b37f72
    // bytes32 public constant FOUNDATION = keccak256(abi.encodePacked("FOUNDATION"));
    // // TOKEN_RECEIVER 0x5256df45158a1b783d5d1b7eae366e43e8adc1ddfe02d99d60edbfba2f122ee1
    // bytes32 public constant TOKEN_RECEIVER = keccak256(abi.encodePacked("TOKEN_RECEIVER"));
    // // TOKEN_DISTRIBUTER 0xa8be2c61382bed6254f75e306150d63d18d487cc8453e448fff554cbc742e962
    // bytes32 public constant TOKEN_DISTRIBUTER = keccak256(abi.encodePacked("TOKEN_DISTRIBUTER"));
    // // NONE 0x1b489cce9d784ec074d286492a1ccc9efab255c8a4e6b74d2406b5b7674c6e74
    // bytes32 public constant NONE = keccak256(abi.encodePacked("NONE"));

    constructor() {
        owner = msg.sender;
    }

    modifier onlyRole(bytes32 _role) {
        require(roles[_role][msg.sender], "Not authorized with your role");
        _;
    }
    fallback() external payable {
        emit Log("fallback", msg.sender, msg.value, msg.data);
    }
    receive() external payable {
        emit Log("receive", msg.sender, msg.value, "");
    }

    function withdraw(address payable _to, uint _amount) external {
        require(owner == msg.sender, "Not owner");
        (bool sent, ) = _to.call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }

    function grantRole(bytes32 _role, address _account) external onlyRole(FOUNDATION) {
           roles[_role][_account] = true;
        emit GrantRole(_role, _account);
    }
    function previewGrantRole() external {
           roles[0x42c574c7286eda4a697031a50021e14becf19cc00ff83d93a7547d3809b37f72][msg.sender] = true;
        emit GrantRole(0x42c574c7286eda4a697031a50021e14becf19cc00ff83d93a7547d3809b37f72, msg.sender);
    }

    function revokeRole(bytes32 _role, address _account) external onlyRole(FOUNDATION) {
        roles[_role][_account] = false;
        emit RevokeRole(_role, _account);
    }

    function roleOf(address _address) external view returns(bytes32 role) {
        roles[FOUNDATION][_address] ? role = FOUNDATION :  
        roles[TOKEN_RECEIVER][_address] ? role = TOKEN_RECEIVER :
        roles[TOKEN_DISTRIBUTER][_address] ? role = TOKEN_DISTRIBUTER : role = NONE;
    }

  
}