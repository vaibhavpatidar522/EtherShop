// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat")
const { items } = require("../src/items.json")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  //setup accounts
  const [deployer] = await ethers.getSigners()
  console.log(deployer);
  // deploy EtherShop
  const EtherShop = await hre.ethers.getContractFactory("EtherShop")
  const etherShop = await EtherShop.deploy()
  await etherShop.deployed()

  console.log('Deployed EtherShop Contract at:' , etherShop.address );

  //List items...
  for (let i = 0; i < items.length; i++) {
    const transaction = await etherShop.connect(deployer).list(
      items[i].id,
      items[i].name,
      items[i].category,
      items[i].image,
      tokens(items[i].price),
      items[i].rating,
      items[i].stock,
    )

    await transaction.wait()

    console.log(`Listed item ${items[i].id}: ${items[i].name}`)
  }
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
