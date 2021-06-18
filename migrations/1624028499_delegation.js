const Delegate = artifacts.require("Delegate");
const Delegation = artifacts.require("Delegation");

module.exports = function (_deployer, _network, _accounts) {
  const [owner] = _accounts;
  // Use deployer to state migration tasks.
  _deployer.deploy(Delegate, owner).then(async (delegate) => {
    await _deployer.deploy(Delegation, delegate.address);
  });
};
