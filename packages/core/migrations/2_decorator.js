const fs = require("fs")
const addresses = require("./addresses.json")

const WittyBufficornsDecorator = artifacts.require("WittyBufficornsDecorator")
const WittyBufficornsLib = artifacts.require("WittyBufficornsLib")

module.exports = async function (deployer, network) {
  network = network.split("-")[0]
  if (network !== "test" && network !== "develop") {
    if (!addresses[network]) {
      addresses[network] = {}
    }
    if (!addresses[network].WittyBufficornsDecorator) {
      addresses[network].WittyBufficornsDecorator = ""
    }
    if (addresses[network].WittyBufficornsDecorator === "") {
      await deployer.link(WittyBufficornsLib, WittyBufficornsDecorator)
      await deployer.deploy(
        WittyBufficornsDecorator, 
        "https://bufficorns.com/"
      )
      addresses[network].WittyBufficornsDecorator = WittyBufficornsDecorator.address
      fs.writeFileSync(
        "./migrations/addresses.json",
        JSON.stringify(addresses, null, 4), 
        { flag: 'w+' }
      )
    } else {
      WittyBufficornsDecorator.address = addresses[network].WittyBufficornsDecorator
      console.info("   > WittyBufficornsDecorator: presumably deployed at", WittyBufficornsDecorator.address)
    }
  } else {
    await deployer.link(WittyBufficornsLib, WittyBufficornsDecorator)
    await deployer.deploy(
      WittyBufficornsDecorator, 
      "https://wittybufficorns.com/"
    );
  }
  let decorator = await WittyBufficornsDecorator.at(WittyBufficornsDecorator.address)
  let forged = await decorator.forged.call()
  if (!forged && network === "test") {
    await decorator.forge();
  }
};
