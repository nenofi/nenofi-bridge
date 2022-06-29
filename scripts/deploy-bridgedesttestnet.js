const { ethers } = require("hardhat");

async function main() {
// [owner, address1] = await ethers.getSigners(2);
const [deployer] = await ethers.getSigners();
console.log("deploying contract with account: " + deployer.address)
const BridgeDest = await ethers.getContractFactory("NenoBridgeSrcV01");

//ftmtestnet (4002) to rinkeby (4) 
bridgeDest = await BridgeDest.deploy('0xD7c295E399CA928A3a14b01D760E794f1AdF8990', 4002, 4);
console.log("bridge dest address: " + bridgeDest.address);
console.log("bridge from: " + await bridgeDest.srcChainID() + " to " + await bridgeDest.destChainID())

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

