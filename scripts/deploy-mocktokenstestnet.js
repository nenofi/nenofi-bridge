const { ethers } = require("hardhat");

async function main() {
// [owner, address1] = await ethers.getSigners(2);
const [deployer] = await ethers.getSigners();
console.log("deploying contract with account: " + deployer.address)
const token = await ethers.getContractFactory("MockToken");
bidr = await token.deploy('BIDR', 'BIDR', 18);
idrt = await token.deploy('IDRT', 'IDRT', 2);
console.log("bidr address: " + bidr.address + " decimals: " + await bidr.decimals());
console.log("idrt address: " + idrt.address+ " decimals: " + await idrt.decimals())

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
