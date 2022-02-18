const WittyBufficornsToken = artifacts.require("WittyBufficornsToken")

const ranches = require("../data/ranches").ranches
const bufficorns = require("../data/bufficorns").bufficorns
const witnetFee = 2660000000000000

module.exports = async function (_deployer, network) {
    console.log(`Running on ${network}...\n`)
    let token = await WittyBufficornsToken.at(WittyBufficornsToken.address)
    for (let i = 0 ; i < ranches.length; i ++) {
        console.info("-".repeat(80))
        console.info("Ranch: ", JSON.stringify(ranches[i]))
        const current = await token.getRanch(ranches[i].id)
        if (current.score === ranches[i].score.toString()) {
            console.info("=> Already set:\n", current)
        } else {
            const tx = await token.setRanch(ranches[i].id, ranches[i].score)
            console.info(tx)    
        }
        if (current.weatherDescription === "") {
            console.info("=> Setting up weather...")
            const tx = await token.updateRanchWeather(
                ranches[i].id,
                {
                    value: witnetFee
                }
            )
            console.info(tx)
        }
        console.info()
    }

    for (let j = 0; j < bufficorns.length; j ++) {
        console.info("-".repeat(80))
        console.info("Bufficorn: ", JSON.stringify(bufficorns[j]))
        const current = await token.getBufficorn(bufficorns[j].id)
        const currentTraits = current.traits.map(value => { return parseInt(value) })
        // console.log(currentTraits)
        if (
            current.name === bufficorns[j].name
                && current.ranchId === bufficorns[j].ranchId.toString()
                && currentTraits.every(score => bufficorns[j].traits.includes(score))  
                && bufficorns[j].traits.every(score => currentTraits.includes(score))
        ) {
            console.info("=> Already set:\n", current)
        } else {
            const tx = await token.setBufficorn(
                bufficorns[j].id,
                bufficorns[j].ranchId,
                bufficorns[j].name,
                bufficorns[j].traits
            )
            console.info(tx)
        }
        console.info()
    }
};
  

