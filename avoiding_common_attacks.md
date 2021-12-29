# Contract security measures

## Using Specific Compiler Pragma

Compiler pragma `0.8.0` used in contracts to avoid bugs due to outdated compilers.

## Integer Over / Underflow

The SafeMath library is shipped with Solidity 0.8.x.

## Use Modifiers Only for Validation

All modifiers only validate data with `require` statements.

## Protected Ether Withdrawal

### OpenCleanUp Contract

- ETH Withdrawal is protected by role based access control.

### OpenCleanUpRoles Contract

- ETH Withdrawal is protected by contract owner access control.

## Proper Use of Require, Assert and Revert

## Checks-Effects-Interactions

## Proper use of .call and .delegateCall
