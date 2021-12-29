// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

// import "./IERC20.sol";
// import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";
import "./OpenCleanUpRoles.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract OpenCleanUp is IERC20, OpenCleanUpRoles  {
    event Burn(address indexed sender, uint amount);
    event Mint(address indexed sender, uint amount);
    event Log(string func, address sender, uint value, bytes data);

    mapping(address => uint) public override balanceOf;
    mapping(address => mapping(address => uint)) public override allowance;
    string constant public name = "OpenCleanUp";
    string constant public symbol = "OCU";
    uint public override totalSupply = 10000 * (10**18);
    uint8 constant public decimals = 18;

    bool public isStopped = false;

    address immutable public foundation;


    constructor() {
        balanceOf[msg.sender] = totalSupply;
        foundation = msg.sender;
        roles[FOUNDATION][msg.sender] = true;
    }

    modifier stopInEmergency {
        require(!isStopped, "Contract stopped"); 
        _; 
    }

    fallback() external payable {
        emit Log("fallback", msg.sender, msg.value, msg.data);
    }
    receive() external payable {
        emit Log("receive", msg.sender, msg.value, "");
    }

    function withdraw(address payable _to, uint _amount) external onlyRole(FOUNDATION) {
        (bool sent, ) = _to.call{value: _amount}("");
        require(sent, "Failed to send ETH");
    }

    function stopContract() external onlyRole(FOUNDATION) {
        isStopped = true;
    }

    function resumeContract() external onlyRole(FOUNDATION) {
        isStopped = false;
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
        require(balanceOf[foundation] >= amount,"Not enough balance");
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        emit Burn(msg.sender, amount);
    }

    function distribute(address recipient, uint amount) external stopInEmergency onlyRole(TOKEN_DISTRIBUTER) returns (bool) {
        require(balanceOf[foundation] >= amount,"Not enough balance");
        balanceOf[foundation] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }
}

