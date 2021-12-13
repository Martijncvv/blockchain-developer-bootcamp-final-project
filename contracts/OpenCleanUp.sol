// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

// import "./IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";

contract ERC20 is IERC20 {
    event GrantRole(bytes32 indexed role, address indexed account);
    event RevokeRole(bytes32 indexed role, address indexed account);
    event Transfer(address indexed sender, address indexed recipient, uint amount);
    event Burn(address indexed sender, address indexed recipient, uint amount);

    // token functionality
    uint32 public override totalSupply = 10000;
    mapping(address => uint) public override balanceOf;
    mapping(address => mapping(address => uint)) public override allowance;
    string public name = "OpenCleanUp";
    string public symbol = "OCU";
    uint8 public decimals = 18;

    address public foundation;


    // Ecosystem roles 
    mapping(bytes32 => mapping(address => bool)) public roles;
    bytes32 public constant FOUNDATION = keccak256(abi.encodePacked("FOUNDATION"));
    bytes32 public constant TOKEN_RECEIVER = keccak256(abi.encodePacked("TOKEN_RECEIVER"));
    bytes32 public constant TOKEN_DISTRIBUTER = keccak256(abi.encodePacked("TOKEN_DISTRIBUTER"));


    constructor() {
        balanceOf[msg.sender] = totalSupply;
        foundation = msg.sender;
        roles[FOUNDATION][msg.sender] = true;
    }

    modifier onlyRole(bytes32 _role) {
        require(roles[_role][msg.sender], "not authorized");
        _;
    }

    function grantRole(bytes32 _role, address _account) external onlyRole(FOUNDATION) {
           roles[_role][_account] = true;
        emit GrantRole(_role, _account);
    }

    function revokeRole(bytes32 _role, address _account) external onlyRole(FOUNDATION) {
        roles[_role][_account] = false;
        emit RevokeRole(_role, _account);
    }

    function transfer(address recipient, uint amount) external override returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint amount) external override returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external override returns (bool) {
        allowance[sender][msg.sender] -= amount;

        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

    function mint(uint amount) external onlyRole(FOUNDATION) {
        balanceOf[msg.sender] += amount;
        totalSupply += amount;
        emit Transfer(address(0), msg.sender, amount);
    }

    function burn(uint amount) external onlyRole(FOUNDATION) {
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        emit Burn(msg.sender, address(0), amount);
    }

    function distribute(address recipient, uint amount) external onlyRole(TOKEN_DISTRIBUTER) returns (bool) {
        balanceOf[foundation] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }
}

