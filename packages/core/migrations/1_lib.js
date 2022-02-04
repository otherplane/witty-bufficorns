const fs = require("fs")
const addresses = require("./addresses.json")

const WittyBufficornsLib = artifacts.require("WittyBufficornsLib");

module.exports = async function (deployer, network) {  
  network = network.split("-")[0]
  if (network !== "test" && network !== "develop") {
    if (!addresses[network]) {
      addresses[network] = {}
    }
    if (!addresses[network].WittyBufficornsLib) {
      addresses[network].WittyBufficornsLib = ""
    }
  }
  if (
    network === "test"
      || addresses[network].WittyBufficornsLib === ""
  ) {
    await deployer.deploy(WittyBufficornsLib)
    if (network !== "test" && network !== "develop") {
      addresses[network].WittyBufficornsLib = WittyBufficornsLib.address
      fs.writeFileSync(
        "./migrations/addresses.json",
        JSON.stringify(addresses, null, 4),
        { flag: 'w+' }
      )
    }
    console.info("   > WittyBufficornsLib: just deployed as", WittyBufficornsLib.address)
  } else {
    WittyBufficornsLib.address = addresses[network].WittyBufficornsLib
    console.info("   > WittyBufficornsLib: presumably deployed at", WittyBufficornsLib.address)
  }  
};
