# Solidity Game - Delegation Attack - `delegatecall` Risk

_Inspired by OpenZeppelin's [Ethernaut](https://ethernaut.openzeppelin.com), Delegation Level_

⚠️Do not try on mainnet!

## Task

Claim ownership of the target contract below.

_Hint:_

1. Look into Solidity's documentation on the `delegatecall` low level function, how it works, how it can be used to delegate operations to on-chain libraries, and what implications it has on execution scope.
2. Fallback methods
3. Method ids

## What will you learn?

1. `delegatecall` vs `call`
2. How to get method signature.

## What is the most difficult challenge?

**Transaction**

**Transaction**s between ethereum accounts will modify the state. There are two type of accounts:

- EOA: External Owned Account
- CA: Contract Account
  Transaction between EOA and EOA or CA, is normally called Transaction.
  Transaction between CA and CA, is called Internal Transaction.

**Delegatecall / Callcode and Libraries**

There exists a special variant of a message call, named **delegatecall** which is identical to a message call apart from the fact that the code at the target address is executed in the context of the calling contract and `msg.sender` and `msg.value` do not change their values.

This means that a contract can dynamically load code from a different address at runtime. Storage, current address and balance still refer to the calling contract, only the code is taken from the called address.

This makes it possible to implement the “library” feature in Solidity: Reusable library code that can be applied to a contract’s storage, e.g. in order to implement a complex data structure.

`<address>.delegatecall(bytes memory) returns (bool, bytes memory)`

issue low-level `DELEGATECALL` with the given payload, returns success condition and return data, forwards all available gas, adjustable

**Function Signature**

Function Signature or another name of Method id, is the first 4 bytes of hash of the function signature.

Example:

```solidity
bytes memory payload = abi.encodeWithSignature("register(string)", "MyName");
(bool success, bytes memory returnData) = address(nameReg).call(payload);
require(success);
```

**Security Consideration**

Due to the fact that the EVM considers a call to a non-existing contract to always succeed, Solidity includes an extra check using the `extcodesize` opcode when performing external calls. This ensures that the contract that is about to be called either actually exists (it contains code) or an exception is raised.

The low-level calls which operate on addresses rather than contract instances (i.e. `.call()`, `.delegatecall()`, `.staticcall()`, `.send()` and `.transfer()`) do not include this check, which makes them cheaper in terms of gas but also less safe.

All these functions are low-level functions and should be used with care. Specifically, any unknown contract might be malicious and if you call it, you hand over control to that contract which could in turn call back into your contract, so be prepared for changes to your state variables when the call returns.

## Source Code

⚠️This contract contains a bug or risk. Do not use on mainnet!

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

contract Delegate {
  address public owner;

  constructor(address _owner) {
    owner = _owner;
  }

  function pwn() public {
    owner = msg.sender;
  }
}

contract Delegation {
  address public owner;
  Delegate delegate;

  constructor(address _delegateAddress) {
    delegate = Delegate(_delegateAddress);
    owner = msg.sender;
  }

  fallback() external {
    (bool result, bytes memory data) = address(delegate).delegatecall(msg.data);
    if (result) {
      this;
    }
  }
}

```

## Configuration

### Install Truffle cli

_Skip if you have already installed._

```
npm install -g truffle
```

### Install Dependencies

```
yarn install
```

## Test and Attack!💥

### Run Tests

```
truffle develop
test
```

You should take ownership of the target contract successfully.

```
truffle(develop)> test
Using network 'develop'.


Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



  Contract: Hacker
    √ should claim ownership (327ms)


  1 passing (440ms)

```
