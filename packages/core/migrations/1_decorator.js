const fs = require("fs")
const addresses = require("./addresses.json")
const WittyBufficornsDecorator = artifacts.require("WittyBufficornsDecorator");
module.exports = async function (deployer, network) {
  network = network.split("-")[0]
  if (network !== "test") {
    if (!addresses[network]) {
      addresses[network] = {}
    }
    if (!addresses[network].WittyBufficornsDecorator) {
      addresses[network].WittyBufficornsDecorator = ""
    }
    if (addresses[network].WittyBufficornsDecorator === "") {
      await deployer.deploy(
        WittyBufficornsDecorator, 
        "https://api-ethdenver2022.wittybufficorns.com/metadata/"
      )
      addresses[network].WittyBufficornsDecorator = WittyBufficornsDecorator.address
      fs.writeFileSync(
        "./migrations/addresses.json",
        JSON.stringify(addresses, null, 4), 
        { flag: 'w+' }
      )
    } else {
      WittyBufficornsDecorator.address = addresses[network].WittyBufficornsDecorator
      console.info("   > Skipped: presumably deployed at", WittyBufficornsDecorator.address)
    }
  } else {
    await deployer.deploy(
      WittyBufficornsDecorator, 
      "https://api-ethdenver2022.wittybufficorns.com/metadata/"
    );
  }
  let tx, gasUsed = 0
  let decorator = await WittyBufficornsDecorator.at(WittyBufficornsDecorator.address)
  let forged = await decorator.forged.call()
  if (!forged) {
    // let artItems
    // console.info("   > Setting missing art pieces:")
    // let baseColors = [
    //   ["Green", "080"],
    //   ["Grey", "333"],
    //   ["Red", "f00"],
    //   ["Purple", "627"],
    //   ["White", "eee"],
    //   ["Yellow", "fd2"],
    //   ["Blue", "00d"]
    // ]
    // artItems = await decorator.getArtBaseColors.call()
    // if (artItems.length < baseColors.length) {
    //   console.info("     >> Base colors...")
    //   for (let j = artItems.length; j < baseColors.length; j ++) {
    //     console.info(baseColors[j])
    //     tx = await decorator.pushArtBaseColor(baseColors[j])
    //     gasUsed += tx.receipt.gasUsed
    //   }
    // }
    // let traitColors = [
    //   ["Chocolate", "c17d11"],
    //   ["Orange", "f57900"],
    //   ["Chamaleon", "73d216"],
    //   ["Sky Blue", "3465a4"],
    //   ["Scarlet Red", "cc0000"],
    //   ["Plum", "75507b"],
    //   ["Butter", "edd400"],
    //   ["Aluminium", "d3d7cf"],
    // ]
    // artItems = await decorator.getArtTraitColors.call()
    // if (artItems.length < traitColors.length) {
    //   console.info("     >> Trait colors...")
    //   for (let j = artItems.length; j < traitColors.length; j ++) {
    //     console.info(traitColors[j])
    //     tx = await decorator.pushArtTraitColor(traitColors[j])
    //     gasUsed += tx.receipt.gasUsed
    //   }
    // }
    
    console.info("     >> Cumuled gas used:", gasUsed)
    console.info()
  }
};
