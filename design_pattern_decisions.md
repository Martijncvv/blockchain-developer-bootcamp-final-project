# Design Patterns Used

## Access Control

`Role-Based Access Control` design pattern are used in the following functions:

### OpenCleanUp Contract

These functions can only be used by accounts with a specific role.

- `stopContract()`
- `resumeContract()`
- `mint()`
- `burn()`
- `distribute()`

### OpenCleanUpRoles Contract

These functions can only be used by accounts that have a "Foundation" role.

- `grantRole()`
- `revokeRole()`

### Pausable

The `distribute()` function can be paused by someone with the "Foundation" role.

## Inheritance and Interfaces

The `OpenCleanUp` contract inherits the `IERC20` contract from OpenZeppelin and the `OpenCleanUpRoles` contract.

## Optimizing Gas

### General

- Made error messages smaller.
- Added `constant` to variables that won't change after compiling.
- Variables with the same data types and sizes are declared next to each other to pack them in the same storage slots as much as possible.

### OpenCleanUp Contract

- Added `immutable` to variables that won't change after construction.

### OpenCleanUpRoles Contract

- Added `view` to `RoleOf()` function.
- Stored 'role options' as `bytes32`s instead of `strings`.
- Wrote literal values instead of computed ones:

  `bytes32 public constant FOUNDATION = keccak256(abi.encodePacked("FOUNDATION"));`

  ->

  `bytes32 public constant FOUNDATION = 0x42c574c7286eda4a697031a50021e14becf19cc00ff83d93a7547d3809b37f72;`
