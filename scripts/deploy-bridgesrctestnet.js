const { ethers } = require("hardhat");

async function main() {
// [owner, address1] = await ethers.getSigners(2);
const [deployer] = await ethers.getSigners();
console.log("deploying contract with account: " + deployer.address)
const BridgeSrc = await ethers.getContractFactory("NenoBridgeSrcV01");

idrtAddress = '0xe71a4e555fba233ab78C693b3B688d288696518F'
bidrAddress = '0xb04e7E640fa1789B4Ac08F4ceA5f6D95Fe757047'

// const IERC20IDRT = await ethers.getContractAt("IERC20", idrtAddress)
// const IERC20BIDR = await ethers.getContractAt("IERC20", bidrAddress)


//Rinkeby (4) to ftmtestnet (4002) 
bridgeSrcIDRT = await BridgeSrc.deploy('0x273a4fFcEb31B8473D51051Ad2a2EdbB7Ac8Ce02', 4, 4002, false, idrtAddress);
console.log("IDRT bridge src address: " + bridgeSrcIDRT.address);
console.log("IDRT address: " + await bridgeSrcIDRT.token());
console.log("bridge from: " + await bridgeSrcIDRT.srcChainID() + " to " + await bridgeSrcIDRT.destChainID())

bridgeSrcBIDR = await BridgeSrc.deploy('0x273a4fFcEb31B8473D51051Ad2a2EdbB7Ac8Ce02', 4, 4002, false, bidrAddress);
console.log("BIDR bridge src address: " + bridgeSrcBIDR.address);
console.log("BIDR address: " + await bridgeSrcBIDR.token());
console.log("bridge from: " + await bridgeSrcBIDR.srcChainID() + " to " + await bridgeSrcBIDR.destChainID())

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

