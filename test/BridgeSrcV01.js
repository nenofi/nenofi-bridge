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

  it("Deploy Bridge Source V01 IDRT (Rinkeby)", async function () {
    BridgeSrc = await ethers.getContractFactory("NenoBridgeSrcV01");
    bridgeSrcIDRT = await BridgeSrc.deploy('0x273a4fFcEb31B8473D51051Ad2a2EdbB7Ac8Ce02', 4, 4002, false, idrt.address);

    await bridgeSrcIDRT.deployed();
  });

  it("Deploy Bridge Source V01 BIDR (Rinkeby)", async function () {
    BridgeSrc = await ethers.getContractFactory("NenoBridgeSrcV01");
    bridgeSrcBIDR = await BridgeSrc.deploy('0x273a4fFcEb31B8473D51051Ad2a2EdbB7Ac8Ce02', 4, 4002, false, bidr.address);

    await bridgeSrcBIDR.deployed();
  });

  it("Deposit IDRT to BIDR Bridge Source from user 1", async function () {
    await idrt.connect(user1).approve(bridgeSrcBIDR.address, ethers.BigNumber.from("100000000"))
    await expect(bridgeSrcBIDR.connect(user1).deposit(idrt.address, ethers.BigNumber.from("100000000"))).to.be.reverted
  });
  
  it("Deposit IDRT to IDRT Bridge Source from user 1", async function () {
    await idrt.connect(user1).approve(bridgeSrcIDRT.address, ethers.BigNumber.from("100000000"))
    await bridgeSrcIDRT.connect(user1).deposit(idrt.address, ethers.BigNumber.from("100000000"))

    expect(await idrt.balanceOf(bridgeSrcIDRT.address)).to.equal(ethers.BigNumber.from("100000000"));
  });

  it("Deposit BIDR to IDRT Bridge Source from user 1", async function () {
    await bidr.connect(user1).approve(bridgeSrcIDRT.address, ethers.BigNumber.from("1000000000000000000000000"))
    await expect(bridgeSrcIDRT.connect(user1).deposit(bidr.address, ethers.BigNumber.from("1000000000000000000000000"))).to.be.reverted

  });

  it("Deposit BIDR to BIDR Bridge Source from user 1", async function () {
    await bidr.connect(user1).approve(bridgeSrcBIDR.address, ethers.BigNumber.from("1000000000000000000000000"))
    await bridgeSrcBIDR.connect(user1).deposit(bidr.address, ethers.BigNumber.from("1000000000000000000000000"))

    expect(await bidr.balanceOf(bridgeSrcBIDR.address)).to.equal(ethers.BigNumber.from("1000000000000000000000000"));
  });

  it("Emergency withdrawal of IDRT from IDRT Bridge Source by exploiter", async function () {
    await expect(bridgeSrcIDRT.connect(exploiter).emergencyWithdraw(idrt.address)).to.be.reverted;
  });

  it("Emergency withdrawal of BIDR from BIDR Bridge Source by exploiter", async function () {
    await expect(bridgeSrcBIDR.connect(exploiter).emergencyWithdraw(bidr.address)).to.be.reverted;
  });

  // it("Emergency withdrawal approval of IDRT from Bridge Source by admin/owner", async function () {
  //   await bridgeSrc.emergencyWithdrawApproval(idrt.address)
  // });

  // it("Emergency withdrawal approval of BIDR from Bridge Source by admin/owner", async function () {
  //   await bridgeSrc.emergencyWithdrawApproval(bidr.address);
  // });

  it("Emergency withdrawal of IDRT from IDRT Bridge Source by admin/owner", async function () {
    await bridgeSrcIDRT.emergencyWithdraw(idrt.address);
  });

  it("Emergency withdrawal of BIDR from BIDR Bridge Source by admin/owner", async function () {
    await bridgeSrcBIDR.emergencyWithdraw(bidr.address);
  });

  it("Pause the IDRT Bridge Source by exploiter", async function () {
    await expect(bridgeSrcIDRT.connect(exploiter).setPause(true)).to.be.reverted;
  });

  it("Pause the BIDR Bridge Source by exploiter", async function () {
    await expect(bridgeSrcBIDR.connect(exploiter).setPause(true)).to.be.reverted;
  });

  it("Pause the IDRT Bridge Source by admin/owner", async function () {
    await bridgeSrcIDRT.setPause(true);
  });

  it("Pause the BIDR Bridge Source by admin/owner", async function () {
    await bridgeSrcBIDR.setPause(true);
  });

  it("Deposit IDRT to IDRT Bridge Source from user 2 while bridge is paused", async function () {

    await idrt.connect(user2).approve(bridgeSrcIDRT.address, ethers.BigNumber.from("100000000"))
    
    await expect(bridgeSrcIDRT.connect(user2).deposit(idrt.address, ethers.BigNumber.from("100000000"))).to.be.reverted
  });

  it("Deposit BIDR to BIDR Bridge Source from user 2 while bridge is paused", async function () {

    await bidr.connect(user2).approve(bridgeSrcBIDR.address, ethers.BigNumber.from("1000000000000000000000000"))
    
    await expect(bridgeSrcBIDR.connect(user2).deposit(bidr.address, ethers.BigNumber.from("1000000000000000000000000"))).to.be.reverted
  });
});
