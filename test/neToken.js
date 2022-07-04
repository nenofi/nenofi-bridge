const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("neToken", function () {
  
  let owner;
  let user1;
  let user2;
  let user3;
  let bridge;
  let exploiter;

  it("Deploy neToken", async function () {
    [owner, user1, user2, user3, bridge, exploiter] = await ethers.getSigners(4);
    const token = await ethers.getContractFactory("neToken");
    neBidr = await token.deploy('neBIDR', 'neBIDR', 18);
    neIdrt = await token.deploy('neIDRT', 'neIDRT', 2);

    await neBidr.deployed();
    await neIdrt.deployed();
  });

  it("confirm neBIDR deployment", async function () {
    expect(await neBidr.name()).to.equal("neBIDR");
  });

  it("confirm neIDRT deployment", async function () {
      expect(await neIdrt.name()).to.equal("neIDRT");
  });

  it("confirm neBIDR decimals", async function () {
    expect(await neBidr.decimals()).to.equal(18);
  });

  it("confirm neIDRT decimals", async function () {
    expect(await neIdrt.decimals()).to.equal(2);
  });

  it("set bridge as minter for neBIDR", async function () {
    await neBidr.addMinter(bridge.address);
    expect(await neBidr.isMinter(bridge.address)).to.be.equal(true);
  });

  it("set bridge as minter for neIDRT", async function () {
    await neIdrt.addMinter(bridge.address);
    expect(await neIdrt.isMinter(bridge.address)).to.be.equal(true);
  });

  it("mint neBIDR from unauthorized user", async function () {
    await expect(neBidr.connect(exploiter).mint(exploiter.address, 1000000000)).to.be.reverted;
  });

  it("mint neIDRT from unauthorized user", async function () {
    await expect(neBidr.connect(exploiter).mint(exploiter.address, 1000000000)).to.be.reverted;
  });

  it("mint neBIDR from bridge to user1", async function () {
    await neBidr.connect(bridge).mint(user1.address, 1000000000);
    expect(await neBidr.balanceOf(user1.address)).to.be.equal(1000000000);
  });

  it("mint neIDRT from bridge to user1", async function () {
    await neIdrt.connect(bridge).mint(user1.address, 1000000000);
    expect(await neIdrt.balanceOf(user1.address)).to.be.equal(1000000000);
  });

  it("revoke bridge as minter for neBIDR", async function () {
    await neBidr.revokeMinter(bridge.address);
    expect(await neBidr.isMinter(bridge.address)).to.be.equal(false);
  });

  it("revoke bridge as minter for neIDRT", async function () {
    await neIdrt.revokeMinter(bridge.address);
    expect(await neIdrt.isMinter(bridge.address)).to.be.equal(false);
  });

  it("mint neBIDR from bridge after being revoked", async function () {
    await expect(neBidr.connect(bridge).mint(user1.address, 1000000000)).to.be.reverted;
  });

  it("mint neIDRT from bridge after being revoked", async function () {
    await expect(neIdrt.connect(bridge).mint(user1.address, 1000000000)).to.be.reverted;
  });

  it("ratify bridge as minter for neBIDR", async function () {
    await neBidr.ratifyMinter(bridge.address);
    expect(await neBidr.isMinter(bridge.address)).to.be.equal(true);
  });

  it("ratify bridge as minter for neIDRT", async function () {
    await neIdrt.ratifyMinter(bridge.address);
    expect(await neIdrt.isMinter(bridge.address)).to.be.equal(true);
  });

  it("mint neBIDR from bridge to user2", async function () {
    await neBidr.connect(bridge).mint(user2.address, 1000000000);
    expect(await neBidr.balanceOf(user2.address)).to.be.equal(1000000000);
  });

  it("mint neIDRT from bridge to user2", async function () {
    await neIdrt.connect(bridge).mint(user2.address, 1000000000);
    expect(await neIdrt.balanceOf(user2.address)).to.be.equal(1000000000);
  });

  // TODO: ADD TESTS FOR BURNING MECHANISM FROM THE BRIDGE
});
