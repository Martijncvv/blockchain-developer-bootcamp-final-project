// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "./OpenCleanUpRoles.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title Contract for OpenCleanUp ecosystem
/// @author Martijncvv
/// @notice Allows individuals and enterprises to exchange value between ecosystem participants. 
/// @notice This is an experimental contract.
contract OpenCleanUp is IERC20, OpenCleanUpRoles  {

    /// @notice Emitted when tokens are burned
    /// @param sender Address that sent burn tx
    /// @param amount Amount burned
    event Burn(address indexed sender, uint amount);

    /// @notice Emitted when tokens are minted
    /// @param sender Address that sent mint tx
    /// @param amount Amount minted
    event Mint(address indexed sender, uint amount);

    /// @notice Emitted when Ether is sent to the contract
    /// @param func Function that was called
    /// @param sender Sender of the Ether
    /// @param value Amount of Ethere received
    /// @param data Data of the tx
    event Log(string func, address sender, uint value, bytes data);

    string constant public name = "OpenCleanUp";
    string constant public symbol = "OCU";
    uint public override totalSupply = 10000 * (10**18);
    uint8 constant public decimals = 18;

    mapping(address => uint) public override balanceOf;
    mapping(address => mapping(address => uint)) public override allowance;
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

    /// @notice Receives Ether if tx data was added
        fallback() external payable {
        emit Log("fallback", msg.sender, msg.value, msg.data);
    }

    /// @notice Receives Ether if no tx data was added
    receive() external payable {
        emit Log("receive", msg.sender, msg.value, "");
    }
    
    /// @notice Gives Foundation ability to withdraw Ether from contract
    /// @param to Address to send the funds to
    /// @param amount Amount of Ether to send
    function withdraw(address payable to, uint amount) external onlyRole(FOUNDATION) {
        (bool sent, ) = to.call{value: amount}("");
        require(sent, "Failed to send ETH");
    }

    /// @notice Gives Foundation ability to stop distribution functionality
    function stopContract() external onlyRole(FOUNDATION) {
        isStopped = true;
    }

    /// @notice Gives Foundation to resume distribution functionality
    function resumeContract() external onlyRole(FOUNDATION) {
        isStopped = false;
    }

    /// @notice Transfers OCU tokens between wallets
    /// @param recipient Address to send the funds to
    /// @param amount Amount of OCU to send
    /// @return Returns boolean value true if succesfull
    function transfer(address recipient, uint amount) external override returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Not enough balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    /// @notice ERC20 standard; Approve other acccount to send funds from the wallet 
    /// @param spender Address that's allowed to send funds
    /// @param amount Amount of OCU to send
    /// @return Returns boolean value true if succesfull
    function approve(address spender, uint amount) external override returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    /// @notice ERC20 functionality; Transfer OCU tokens from wallet that gave permission to transfer funds
    /// @param sender Address to send the OCU tokens from
    /// @param recipient OCU token receiver
    /// @param amount Amount of OCU to send
    /// @return Returns boolean value true if succesfull
    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external override returns (bool) {
        require(balanceOf[sender] >= amount, "Not enough balance");
        allowance[sender][msg.sender] -= amount;

        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

    /// @notice Mint OCU tokens with a Foundation wallet
    /// @param amount Amount of OCU to mint
    function mint(uint amount) external onlyRole(FOUNDATION) {
        balanceOf[msg.sender] += amount;
        totalSupply += amount;
        emit Mint(msg.sender, amount);
    }

    /// @notice Burn OCU tokens with a Foundation wallet
    /// @param amount Amount of OCU to mint
    function burn(uint amount) external onlyRole(FOUNDATION) {
        require(balanceOf[foundation] >= amount,"Not enough balance");
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        emit Burn(msg.sender, amount);
    }

    /// @notice Gives 'distributer' roles ability to transfer tokens from Foundation wallet
    /// @param recipient OCU token receiver
    /// @param amount Amount of OCU to send
    /// @return Returns boolean value true if succesfull
    function distribute(address recipient, uint amount) external stopInEmergency onlyRole(TOKEN_DISTRIBUTER) returns (bool) {
        require(balanceOf[foundation] >= amount,"Not enough balance");
        balanceOf[foundation] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }
}

