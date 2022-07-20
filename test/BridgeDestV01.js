const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NenoBridgeSrcV01", function () {
  
  let owner;
  let user1;
  let user2;
  let user3;
  let bridge;
  let exploiter;

  let bidr;
  let idrt;

  let bridgeSrc;

  it("Deploy Mock Tokens (nebIDRT and nebBIDR)", async function () {
    [owner, user1, user2, user3, bridge, exploiter] = await ethers.getSigners(4);

    const token = await ethers.getContractFactory("neToken");
    bidr = await token.deploy('nebBIDR', 'nebBIDR', 18);
    idrt = await token.deploy('nebIDRT', 'nebIDRT', 2);

    await bidr.deployed();
    await idrt.deployed();
  });

  it("Deploy Bridge Destination V01 (FTM testnet)", async function () {
    const BridgeDest = await ethers.getContractFactory("NenoBridgeDestV01");
    bridgeDest = await BridgeDest.deploy('0xD7c295E399CA928A3a14b01D760E794f1AdF8990', 4, 4002, false);

    await bridgeDest.deployed();
  });

});
