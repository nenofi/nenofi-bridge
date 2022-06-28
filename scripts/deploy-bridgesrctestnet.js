const { ethers } = require("hardhat");

async function main() {
// [owner, address1] = await ethers.getSigners(2);
const [deployer] = await ethers.getSigners();
console.log("deploying contract with account: " + deployer.address)
const BridgeSource = await ethers.getContractFactory("NenoBridgeSrcV01");

//Rinkeby (4) to ftmtestnet (4002) 
bridgeSource = await BridgeSource.deploy('0x273a4fFcEb31B8473D51051Ad2a2EdbB7Ac8Ce02', 4, 4002);
console.log("bridge source: " + bridgeSource.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

