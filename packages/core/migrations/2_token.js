const fs = require("fs")
const addresses = require("./addresses.json")
const witnetAddresses = require("witnet-solidity-bridge/migrations/witnet.addresses")
const WittyBufficornsToken = artifacts.require("WittyBufficornsToken");
const WittyBufficornsDecorator = artifacts.require("WittyBufficornsDecorator");
// const WitnetRequestBoard = artifacts.require("WitnetRequestBoard")
module.exports = async function (deployer, network, accounts) {  
  network = network.split("-")[0]
  if (network !== "test" && network !== "develop") {
    if (!addresses[network]) {
      addresses[network] = {}
    }
    if (!addresses[network].WittyBufficornsToken) {
      addresses[network].WittyBufficornsToken = ""
    }
    // WitnetRequestBoard.address = witnetAddresses.default[network].WitnetRequestBoard
    // console.info("   > Using WitnetRequestBoard at", WitnetRequestBoard.address)
  } else {
    // const WitnetRequestBoardMock = artifacts.require("WitnetRequestBoardMock")
    // if (!WitnetRequestBoardMock.isDeployed()) {
    //   await deployer.deploy(WitnetRequestBoardMock)
    // }
    // WitnetRequestBoard.address = WitnetRequestBoardMock.address;
    // console.info("   > Using WitnetRequestBoardMock at", WitnetRequestBoard.address)
  }
  if (
    network === "test"
      || addresses[network].WittyBufficornsToken === ""
  ) {
    await deployer.deploy(
      WittyBufficornsToken,
      "Witty Bufficorns - ETHDenver 2022", // ERC721 Token Name
      "WITTY22A", // ERC721 Token Symbol
      WittyBufficornsDecorator.address, // Decorator contract address
    )
    if (network !== "test" && network !== "develop") {
      addresses[network].WittyBufficornsToken = WittyBufficornsToken.address
      fs.writeFileSync(
        "./migrations/addresses.json",
        JSON.stringify(addresses, null, 4),
        { flag: 'w+' }
      )
    }
    console.info("   >> Deployed at", WittyBufficornsToken.address)
  } else {
    WittyBufficornsToken.address = addresses[network].WittyBufficornsToken
    console.info("   > Skipped: presumably deployed at", WittyBufficornsToken.address)
  }  
};
