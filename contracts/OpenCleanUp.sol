// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "./IERC20.sol";
// import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";
import "./OpenCleanUpRoles.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract OpenCleanUp is IERC20, OpenCleanUpRoles  {
    event Burn(address indexed sender, uint amount);
    event Mint(address indexed sender, uint amount);

    // token functionality
    uint public override totalSupply = 10000;
    mapping(address => uint) public override balanceOf;
    mapping(address => mapping(address => uint)) public override allowance;
    string public name = "OpenCleanUp";
    string public symbol = "OCU";
    uint8 public decimals = 18;

    address public foundation;


    constructor() {
        balanceOf[msg.sender] = totalSupply;
        foundation = msg.sender;
        roles[FOUNDATION][msg.sender] = true;
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
        emit Mint(msg.sender, amount);
    }

    function burn(uint amount) external onlyRole(FOUNDATION) {
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        emit Burn(msg.sender, amount);
    }

    function distribute(address recipient, uint amount) external onlyRole(TOKEN_DISTRIBUTER) returns (bool) {
        balanceOf[foundation] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }
}

