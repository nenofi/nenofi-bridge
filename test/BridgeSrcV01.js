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
    // await bidr.mint(user1.address, ethers.BigNumber.from("1000000000000000000000000"));
    // await bidr.mint(user2.address, ethers.BigNumber.from("1000000000000000000000000"));
    // await bidr.mint(user3.address, ethers.BigNumber.from("1000000000000000000000000"));

    // 1 million idrt
    // await idrt.mint(user1.address, ethers.BigNumber.from("100000000"));
    // await idrt.mint(user2.address, ethers.BigNumber.from("100000000"));
    // await idrt.mint(user3.address, ethers.BigNumber.from("100000000"));

    await bidr.deployed();
    await idrt.deployed();
  });

  it("Mint BIDR and IDRT to user 1 to 3", async function () {

    // 1 million bidr
    await bidr.mint(user1.address, ethers.BigNumber.from("1000000000000000000000000"));
    await bidr.mint(user2.address, ethers.BigNumber.from("1000000000000000000000000"));
    await bidr.mint(user3.address, ethers.BigNumber.from("1000000000000000000000000"));

    // 1 million idrt
    await idrt.mint(user1.address, ethers.BigNumber.from("100000000"));
    await idrt.mint(user2.address, ethers.BigNumber.from("100000000"));
    await idrt.mint(user3.address, ethers.BigNumber.from("100000000"));

    expect(await idrt.balanceOf(user1.address)).to.equal(ethers.BigNumber.from("100000000"));
    expect(await bidr.balanceOf(user1.address)).to.equal(ethers.BigNumber.from("1000000000000000000000000"));
    expect(await idrt.balanceOf(user2.address)).to.equal(ethers.BigNumber.from("100000000"));
    expect(await bidr.balanceOf(user2.address)).to.equal(ethers.BigNumber.from("1000000000000000000000000"));
    expect(await idrt.balanceOf(user3.address)).to.equal(ethers.BigNumber.from("100000000"));
    expect(await bidr.balanceOf(user3.address)).to.equal(ethers.BigNumber.from("1000000000000000000000000"));
  });

  it("Deploy Bridge Source V01 (Rinkeby)", async function () {
    const BridgeSrc = await ethers.getContractFactory("NenoBridgeSrcV01");
    bridgeSrc = await BridgeSrc.deploy('0x273a4fFcEb31B8473D51051Ad2a2EdbB7Ac8Ce02', 4, 4002, false);

    await bridgeSrc.deployed();
  });

  it("Deposit BIDR and IDRT to Bridge Source", async function () {

    await idrt.connect(user1).approve(bridgeSrc.address, ethers.BigNumber.from("100000000"))
    await bidr.connect(user1).approve(bridgeSrc.address, ethers.BigNumber.from("1000000000000000000000000"))
    
    await bridgeSrc.connect(user1).deposit(idrt.address, ethers.BigNumber.from("100000000"))
    await bridgeSrc.connect(user1).deposit(bidr.address, ethers.BigNumber.from("1000000000000000000000000"))

    expect(await idrt.balanceOf(bridgeSrc.address)).to.equal(ethers.BigNumber.from("100000000"));
    expect(await bidr.balanceOf(bridgeSrc.address)).to.equal(ethers.BigNumber.from("1000000000000000000000000"));
  });

  it("Emergency withdrawal of IDRT from Bridge Source by exploiter", async function () {
    await expect(bridgeSrc.connect(exploiter).emergencyWithdraw(idrt.address)).to.be.reverted;
  });

  it("Emergency withdrawal of BIDR from Bridge Source by exploiter", async function () {
    await expect(bridgeSrc.connect(exploiter).emergencyWithdraw(bidr.address)).to.be.reverted;
  });

  // it("Emergency withdrawal approval of IDRT from Bridge Source by admin/owner", async function () {
  //   await bridgeSrc.emergencyWithdrawApproval(idrt.address)
  // });

  // it("Emergency withdrawal approval of BIDR from Bridge Source by admin/owner", async function () {
  //   await bridgeSrc.emergencyWithdrawApproval(bidr.address);
  // });

  it("Emergency withdrawal of IDRT from Bridge Source by admin/owner", async function () {
    await bridgeSrc.emergencyWithdraw(idrt.address);
  });

  it("Emergency withdrawal of BIDR from Bridge Source by admin/owner", async function () {
    await bridgeSrc.emergencyWithdraw(bidr.address);
  });

});
