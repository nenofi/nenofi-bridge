const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("nebToken", function () {
  
  let owner;
  let user1;
  let user2;
  let user3;
  let bridge;
  let exploiter;

  let nebBidr;
  let nebIdrt;

  it("Deploy nebToken", async function () {
    [owner, user1, user2, user3, bridge, exploiter] = await ethers.getSigners(4);
    const token = await ethers.getContractFactory("neToken");
    nebBidr = await token.deploy('nebBIDR', 'nebBIDR', 18);
    nebIdrt = await token.deploy('nebIDRT', 'nebIDRT', 2);

    await nebBidr.deployed();
    await nebIdrt.deployed();
  });

  it("confirm nebBIDR deployment", async function () {
    expect(await nebBidr.name()).to.equal("nebBIDR");
  });

  it("confirm nebIDRT deployment", async function () {
      expect(await nebIdrt.name()).to.equal("nebIDRT");
  });

  it("confirm nebBIDR decimals", async function () {
    expect(await nebBidr.decimals()).to.equal(18);
  });

  it("confirm nebIDRT decimals", async function () {
    expect(await nebIdrt.decimals()).to.equal(2);
  });

  it("set bridge as minter for nebBIDR", async function () {
    await nebBidr.addMinter(bridge.address);
    expect(await nebBidr.isMinter(bridge.address)).to.be.equal(true);
  });

  it("set bridge as minter for nebIDRT", async function () {
    await nebIdrt.addMinter(bridge.address);
    expect(await nebIdrt.isMinter(bridge.address)).to.be.equal(true);
  });

  it("mint nebBIDR from unauthorized user", async function () {
    await expect(nebBidr.connect(exploiter).mint(exploiter.address, 1000000000)).to.be.reverted;
  });

  it("mint nebIDRT from unauthorized user", async function () {
    await expect(nebBidr.connect(exploiter).mint(exploiter.address, 1000000000)).to.be.reverted;
  });

  it("mint nebBIDR from bridge to user1", async function () {
    await nebBidr.connect(bridge).mint(user1.address, 1000000000);
    expect(await nebBidr.balanceOf(user1.address)).to.be.equal(1000000000);
  });

  it("mint nebIDRT from bridge to user1", async function () {
    await nebIdrt.connect(bridge).mint(user1.address, 1000000000);
    expect(await nebIdrt.balanceOf(user1.address)).to.be.equal(1000000000);
  });

  it("revoke bridge as minter for nebBIDR", async function () {
    await nebBidr.revokeMinter(bridge.address);
    expect(await nebBidr.isMinter(bridge.address)).to.be.equal(false);
  });

  it("revoke bridge as minter for nebIDRT", async function () {
    await nebIdrt.revokeMinter(bridge.address);
    expect(await nebIdrt.isMinter(bridge.address)).to.be.equal(false);
  });

  it("mint nebBIDR from bridge after being revoked", async function () {
    await expect(nebBidr.connect(bridge).mint(user1.address, 1000000000)).to.be.reverted;
  });

  it("mint nebIDRT from bridge after being revoked", async function () {
    await expect(nebIdrt.connect(bridge).mint(user1.address, 1000000000)).to.be.reverted;
  });

  it("ratify bridge as minter for nebBIDR", async function () {
    await nebBidr.ratifyMinter(bridge.address);
    expect(await nebBidr.isMinter(bridge.address)).to.be.equal(true);
  });

  it("ratify bridge as minter for nebIDRT", async function () {
    await nebIdrt.ratifyMinter(bridge.address);
    expect(await nebIdrt.isMinter(bridge.address)).to.be.equal(true);
  });

  it("mint nebBIDR from bridge to user2", async function () {
    await nebBidr.connect(bridge).mint(user2.address, 1000000000);
    expect(await nebBidr.balanceOf(user2.address)).to.be.equal(1000000000);
  });

  it("mint nebIDRT from bridge to user2", async function () {
    await nebIdrt.connect(bridge).mint(user2.address, 1000000000);
    expect(await nebIdrt.balanceOf(user2.address)).to.be.equal(1000000000);
  });

  // TODO: ADD TESTS FOR BURNING MECHANISM FROM THE BRIDGE
});
