# Contract Security Measures

## Integer Over / Underflow (SWC-101)

- The SafeMath library is shipped with `Solidity 0.8.x`.

## Floating Pragma (SWC-103)

- Compiler pragma `0.8.0` used in contracts to avoid bugs due to outdated compilers.

## Unprotected Ether Withdrawal (SWC-105)

- Ether withdrawals are protected by role based access control.

## Use Modifiers Only for Validation

- All modifiers only validate data with `require` statements.

## Proper use of call and delegatecall instead of send, transfer

- The function `withdraw()` uses the `.cal` statement to withdraw Ether.

## Sensitive Data

- Sensitive data is stored in an env. file and added to the .gitignore file.
