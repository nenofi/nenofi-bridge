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

  it("Deploy Mock Tokens (IDRT and BIDR)", async function () {
    [owner, user1, user2, user3, bridge, exploiter] = await ethers.getSigners(4);

    const BridgeSrc = await ethers.getContractFactory("NenoBridgeSrcV01");
    bridgeSrc = await BridgeSrc.deploy('0x273a4fFcEb31B8473D51051Ad2a2EdbB7Ac8Ce02', 4, 4002, false);

    await bridgeSrc.deployed();
  });

  it("Deploy Bridge Source V01", async function () {
    const BridgeSrc = await ethers.getContractFactory("NenoBridgeSrcV01");
    bridgeSrc = await BridgeSrc.deploy('0x273a4fFcEb31B8473D51051Ad2a2EdbB7Ac8Ce02', 4, 4002, false);

    await bridgeSrc.deployed();
  });

});
