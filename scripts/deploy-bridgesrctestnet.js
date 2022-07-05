const { ethers } = require("hardhat");

async function main() {
// [owner, address1] = await ethers.getSigners(2);
const [deployer] = await ethers.getSigners();
console.log("deploying contract with account: " + deployer.address)
const BridgeSrc = await ethers.getContractFactory("NenoBridgeSrcV01");

//Rinkeby (4) to ftmtestnet (4002) 
bridgeSrc = await BridgeSrc.deploy('0x273a4fFcEb31B8473D51051Ad2a2EdbB7Ac8Ce02', 4, 4002, false);
console.log("bridge src address: " + bridgeSrc.address);
console.log("bridge from: " + await bridgeSrc.srcChainID() + " to " + await bridgeSrc.destChainID())

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

