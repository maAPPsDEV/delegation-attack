const Delegate = artifacts.require("Delegate");
const Delegation = artifacts.require("Delegation");
const Hacker = artifacts.require("Hacker");
const { expect } = require("chai");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Hacker", function ([_owner, _hacker]) {
  it("should claim ownership", async function () {
    const delegationContract = await Delegation.deployed();
    const hackerContract = await Hacker.deployed();
    let delegationOwner = await delegationContract.owner();
    expect(delegationOwner).to.be.equal(_owner);
    const result = await hackerContract.attack(delegationContract.address, { from: _hacker });
    expect(result.receipt.status).to.be.equal(true);
    delegationOwner = await delegationContract.owner();
    expect(delegationOwner).to.be.equal(hackerContract.address);
  });
});
