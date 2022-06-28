const { ethers } = require("hardhat");

async function main() {
// [owner, address1] = await ethers.getSigners(2);
const [deployer] = await ethers.getSigners();
console.log("deploying contract with account: " + deployer.address)
const token = await ethers.getContractFactory("Token");
bidr = await token.deploy('BIDR', 'BIDR', 18, deployer.address);
idrt = await token.deploy('IDRT', 'IDRT', 2, deployer.address);
console.log("bidr address: " + bidr.address);
console.log("idrt address: " + idrt.address)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
