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

    const token = await ethers.getContractFactory("MockToken");
    bidr = await token.deploy('BIDR', 'BIDR', 18);
    idrt = await token.deploy('IDRT', 'IDRT', 2);

    // 1 million bidr
    await bidr.mint(user1.address, ethers.BigNumber.from("1000000000000000000000000"));
    await bidr.mint(user2.address, ethers.BigNumber.from("1000000000000000000000000"));
    await bidr.mint(user3.address, ethers.BigNumber.from("1000000000000000000000000"));

    // 1 million idrt
    await idrt.mint(user1.address, ethers.BigNumber.from("100000000"));
    await idrt.mint(user2.address, ethers.BigNumber.from("100000000"));
    await idrt.mint(user3.address, ethers.BigNumber.from("100000000"));

    await bidr.deployed();
    await idrt.deployed();
  });

  it("Deploy Bridge Source V01", async function () {
    const BridgeSrc = await ethers.getContractFactory("NenoBridgeSrcV01");
    bridgeSrc = await BridgeSrc.deploy('0x273a4fFcEb31B8473D51051Ad2a2EdbB7Ac8Ce02', 4, 4002, false);

    await bridgeSrc.deployed();
  });

});
