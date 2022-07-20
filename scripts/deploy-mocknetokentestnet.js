const { ethers } = require("hardhat");

async function main() {
// [owner, address1] = await ethers.getSigners(2);
const [deployer] = await ethers.getSigners();
console.log("deploying contract with account: " + deployer.address)
const token = await ethers.getContractFactory("neToken");
neBidr = await token.deploy('nebBIDR', 'nebBIDR', 18);
neIdrt = await token.deploy('nebIDRT', 'nebIDRT', 2);
console.log("nebBIDR address: " + nebBidr.address + " decimals: " + await neBidr.decimals());
console.log("nebIDRT address: " + nebIdrt.address+ " decimals: " + await neIdrt.decimals())

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
