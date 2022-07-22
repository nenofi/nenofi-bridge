const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NenoBridgeSrcV01", function () {
  
  let owner;
  let user1;
  let user2;
  let user3;
  let bridge;
  let exploiter;

  let nebBIDR;
  let nebIDRT;

  let bridgeSrc;

  it("Deploy Mock Tokens (nebIDRT and nebBIDR)", async function () {
    [owner, user1, user2, user3, bridge, exploiter] = await ethers.getSigners(4);

    const token = await ethers.getContractFactory("neToken");
    nebBIDR = await token.deploy('nebBIDR', 'nebBIDR', 18);
    nebIDRT = await token.deploy('nebIDRT', 'nebIDRT', 2);

    await nebBIDR.deployed();
    await nebIDRT.deployed();
  });

  it("Deploy IDRT Bridge Destination V01 (FTM testnet)", async function () {
    BridgeDest = await ethers.getContractFactory("NenoBridgeDestV01");
    bridgeDestIDRT = await BridgeDest.deploy('0xD7c295E399CA928A3a14b01D760E794f1AdF8990', 4, 4002, false, nebIDRT.address);

    await bridgeDestIDRT.deployed();
  });

  it("Deploy BIDR Bridge Destination V01 (FTM testnet)", async function () {
    BridgeDest = await ethers.getContractFactory("NenoBridgeDestV01");
    bridgeDestBIDR = await BridgeDest.deploy('0xD7c295E399CA928A3a14b01D760E794f1AdF8990', 4, 4002, false, nebBIDR.address);

    await bridgeDestBIDR.deployed();
  });

  it("Set IDRT bridge as nebIDRT minter", async function () {
    await nebIDRT.addMinter(bridgeDestIDRT.address);
    expect(await nebIDRT.isMinter(bridgeDestIDRT.address)).to.be.equal(true);
  });

  it("Set BIDR bridge as nebBIDR minter", async function () {
    await nebBIDR.addMinter(bridgeDestBIDR.address);
    expect(await nebBIDR.isMinter(bridgeDestBIDR.address)).to.be.equal(true);
  });

  it("Set admin/owner as nebIDRT minter", async function () {
    await nebIDRT.addMinter(owner.address);
    expect(await nebIDRT.isMinter(owner.address)).to.be.equal(true);
  });

  it("Set admin/owner bridge as nebBIDR minter", async function () {
    await nebBIDR.addMinter(owner.address);
    expect(await nebBIDR.isMinter(owner.address)).to.be.equal(true);
  });

  it("mint nebIDRT from admin/owner to user1", async function () {
    await nebIDRT.mint(user1.address, 1000000000);
    expect(await nebIDRT.balanceOf(user1.address)).to.be.equal(1000000000);
  });

  it("mint nebBIDR from admin/owner to user1", async function () {
    await nebBIDR.mint(user1.address, 1000000000);
    expect(await nebBIDR.balanceOf(user1.address)).to.be.equal(1000000000);
  });

  it("redeem nebIDRT from user1", async function () {
    await nebIDRT.connect(user1).approve(bridgeDestIDRT.address, 1000000000);
    await bridgeDestIDRT.connect(user1).redeem(nebIDRT.address, 1000000000)
    // expect(await nebIDRT.balanceOf(user1.address)).to.be.equal(0);
    expect(await nebIDRT.totalSupply()).to.be.equal(0);
  });

  it("redeem nebBIDR from user1", async function () {
    await nebBIDR.connect(user1).approve(bridgeDestBIDR.address, 1000000000);
    await bridgeDestBIDR.connect(user1).redeem(nebBIDR.address, 1000000000)
    // expect(await nebBIDR.balanceOf(user1.address)).to.be.equal(0);
    expect(await nebBIDR.totalSupply()).to.be.equal(0);
  });


});
