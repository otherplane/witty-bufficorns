const fs = require("fs")

const addresses = require("./addresses.json")
const witnetAddresses = require("witnet-solidity-bridge/migrations/witnet.addresses")

const WittyBufficornsToken = artifacts.require("WittyBufficornsToken")
const WittyBufficornsLib = artifacts.require("WittyBufficornsLib")
const WittyBufficornsDecorator = artifacts.require("WittyBufficornsDecorator")

const WitnetRandomness = artifacts.require("IWitnetRandomness")

module.exports = async function (deployer, network, accounts) {  
  network = network.split("-")[0]
  if (network !== "test" && network !== "develop") {
    if (!addresses[network]) {
      addresses[network] = {}
    }
    if (!addresses[network].WittyBufficornsToken) {
      addresses[network].WittyBufficornsToken = ""
    }
    WitnetRandomness.address = witnetAddresses.polygon[network].WitnetRandomness
    console.info("   > Using WitnetRandomness at", WitnetRandomness.address)
  } else {
    const WitnetRandomnessMock = artifacts.require("WitnetRandomnessMock")
    if (!WitnetRandomnessMock.isDeployed()) {
      await deployer.deploy(WitnetRandomnessMock)
    }
    WitnetRandomness.address = WitnetRandomnessMock.address;
    console.info("   > Using WitnetRandomnessMock at", WitnetRandomness.address)
  }
  if (
    network === "test"
      || addresses[network].WittyBufficornsToken === ""
  ) {
    await deployer.link(WittyBufficornsLib, WittyBufficornsToken)
    await deployer.deploy(
      WittyBufficornsToken,
      /* ERC-721 Token Name   */ "Witty Bufficorns - ETHDenver 2022", 
      /* ERC-721 Token Symbol */ "WB22", // ERC721 Token Symbol
      /* _witnetRandomness    */ WitnetRandomness.address,
      /* _wittyBufficornsDeco */ WittyBufficornsDecorator.address,
    )
    if (network !== "test" && network !== "develop") {
      addresses[network].WittyBufficornsToken = WittyBufficornsToken.address
      fs.writeFileSync(
        "./migrations/addresses.json",
        JSON.stringify(addresses, null, 4),
        { flag: 'w+' }
      )
    }
    console.info("   > WittyBufficornsToken: just deployed as", WittyBufficornsToken.address)
  } else {
    WittyBufficornsToken.address = addresses[network].WittyBufficornsToken
    console.info("   > WittyBufficornsToken: presumably deployed at", WittyBufficornsToken.address)
  }  
};
