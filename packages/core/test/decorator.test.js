const { assert } = require("chai")
const truffleAssert = require("truffle-assertions")
const WittyBufficornsDecorator = artifacts.require("WittyBufficornsDecorator")

contract("WittyBufficornsDecorator", _accounts => {
    let decorator, metadata, svg
    const randomness = "0xb754d49eec4434a3bd789100715ca6a0f7230fe7b66a2cd93457616128bbc5c2"

    before(async () => {
        decorator = await WittyBufficornsDecorator.deployed()
    })

    describe("WittyBufficornsDecoratorBase", async () => {
        describe("baseURI()", async () => {
            let baseURI
            it("returns no empty string", async () => {
                baseURI = await decorator.baseURI.call()
                assert(baseURI.length > 0)
            })
            it("ends up with slash", () => {
                assert(baseURI[baseURI.length - 1] === "/")
            })
        })
    })
  
    describe("IWittyBufficornsDecorator", async () => {
        describe("toJSON(..)", async () => {
            describe("Best Breeder awards", async () => {
                let farmerId = 1
                let farmerName = "Happy Flower"
                let farmerScore = 1234567
                let ranchId = 1
                let ranking = 1
                let tokenId = 123
                before(async () => {
                    metadata = await decorator.toJSON.call(
                        tokenId, // _tokenId
                        randomness,
                        _buildTokenBestBreader(ranking, farmerId, farmerName, farmerScore, ranchId)
                    )                    
                    // console.log(metadata)
                    metadata = JSON.parse(metadata)
                })
                it("name starts with farmer name", async () => {
                    assert(metadata.name.indexOf(farmerName) >= 0, "no farmer name")
                })
                it("name contains token id", async () => {
                    assert(metadata.name.indexOf(`${tokenId}`) > 0, "token id not found")
                })
                it("description contains ranking", async () => {
                    assert(metadata.description.indexOf(`#${ranking}`) > 0, "bad description")
                })
                it("external url contains token id", async () => {
                    assert(metadata.external_url.indexOf(`/${tokenId}`) > 0, "bad external url")
                })                
                it("image contains token id", async () => {
                    assert(metadata.image.indexOf(`/${tokenId}`) > 0, "bad external url")
                })                
                it("contains just one Award Category attribute, and matches expected denomination", async () => {
                    const _attrs = metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Award Category") {
                            return val;
                        }
                    })
                    assert(_attrs.length < 2, "more than one")
                    assert(_attrs.length == 1, "none found")
                    assert(_attrs[0].value === "Best Breeder", "bad denomination")
                })
                it("contains just one Expedition Date attribute", async () => {
                    const _attrs = metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Expedition Date") {
                            return val;
                        }
                    })
                    assert(_attrs.length < 2, "more than one")
                    assert(_attrs.length == 1, "none found")
                })
                it("contains just one Farmer Ranking attribute, and matches expected value", async () => {
                    const _attrs = metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Farmer Ranking") {
                            return val;
                        }
                    })
                    assert(_attrs.length < 2, "more than one")
                    assert(_attrs.length == 1, "none found")
                    assert(_attrs[0].value == ranking, "bad ranking")
                })
                it("contains just one Farmer Score attribute, and matches expected value", async () => {
                    const _attrs = metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Farmer Score") {
                            return val;
                        }
                    })
                    assert(_attrs.length < 2, "more than one")
                    assert(_attrs.length == 1, "none found")
                    assert(_attrs[0].value == farmerScore, "bad score")
                })
                it("contains just one Medal attribute, and matches expected values", async () => {
                    let _gold_metadata = await decorator.toJSON.call(
                        tokenId + 1, // _tokenId
                        randomness,
                        _buildTokenBestBreader(1, farmerId, farmerName, farmerScore, ranchId)
                    )
                    _gold_metadata = JSON.parse(_gold_metadata)
                    let _silver_metadata = await decorator.toJSON.call(
                        tokenId + 2, // _tokenId
                        randomness,
                        _buildTokenBestBreader(2, farmerId, farmerName, farmerScore, ranchId)
                    )
                    _silver_metadata = JSON.parse(_silver_metadata)
                    let _bronze_metadata = await decorator.toJSON.call(
                        tokenId + 3, // _tokenId
                        randomness,
                        _buildTokenBestBreader(3, farmerId, farmerName, farmerScore, ranchId)
                    )
                    _bronze_metadata = JSON.parse(_bronze_metadata)
                    let _diploma_metadata = await decorator.toJSON.call(
                        tokenId + 4, // _tokenId
                        randomness,
                        _buildTokenBestBreader(4, farmerId, farmerName, farmerScore, ranchId)
                    )
                    _diploma_metadata = JSON.parse(_diploma_metadata)

                    const _golds = _gold_metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Medal") {
                            return val;
                        }
                    })
                    assert(_golds.length < 2, "more than one gold")
                    assert(_golds.length == 1, "no golds")
                    assert(_golds[0].value === "Gold", "matches no \"Gold\"")

                    const _silvers = _silver_metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Medal") {
                            return val;
                        }
                    })
                    assert(_silvers.length < 2, "more than one silver")
                    assert(_silvers.length == 1, "no silvers")
                    assert(_silvers[0].value === "Silver", "silver matches no \"Silver\"")

                    const _bronzes = _bronze_metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Medal") {
                            return val;
                        }
                    })
                    assert(_bronzes.length < 2, "more than one bronze")
                    assert(_bronzes.length == 1, "no bronzes")
                    assert(_bronzes[0].value === "Bronze", "bronze matches no \"Bronze\"")

                    const _diplomas = _diploma_metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Medal") {
                            return val;
                        }
                    })
                    assert(_diplomas.length < 2, "more than one diploma")
                    assert(_diplomas.length == 1, "no diplomas")
                    assert(_diplomas[0].value === "Diploma", "diploma matches no \"Diploma\"")
                })
                it("contains at least one booster increase, matching ranch resource", async () => {
                    const _ranch_resource_ = [
                        "Warm Hay",
                        "Fresh Grass",
                        "Smart Sedge",
                        "Mighty Acorn",
                        "Tireless Water",
                        "Hearty Berry"
                    ]
                    const _ranch_rank_ = [ 9, 24, 25, 50, 99, 100 ]
                    const _ranch_expected_boost_ = [ 100, 100, 75, 50, 25, 10 ]
                    for (let j = 0; j < _ranch_rank_.length ; j ++) {
                        const _metadata = JSON.parse(
                            await decorator.toJSON.call(
                                101 + j, // tokenId
                                randomness, 
                                _buildTokenBestBreader(
                                    _ranch_rank_[j], // ranking
                                    101 + j , // farmerId
                                    `Farmer.${101 + j}`, // farmerName
                                    1234567, // farmerScore
                                    j, // ranchId
                                )
                            )
                        )
                        const _boosters = _metadata.attributes.filter(val => {
                            if (val.trait_type && val.trait_type.indexOf(_ranch_resource_[j]) >= 0) {
                                return val;
                            }
                        })
                        assert(_boosters.length < 2, "repeated booster " + _ranch_resource_[j] )
                        assert(_boosters.length == 1, "no booster " + _ranch_resource_[j])
                        assert(_boosters[0].value == _ranch_expected_boost_[j])
                    }
                })
                it("boosters frequency follows binomial distribution", async () => {
                    let freqs = [0, 0, 0, 0, 0, 0, 0 ]
                    for (let j = 0 ; j < 100; j ++) {
                        const _metadata = JSON.parse(
                            await decorator.toJSON.call(
                                200 + j, // _tokenId
                                randomness,
                                _buildTokenBestBreader(
                                    200 + j, // ranking
                                    200 + j, // farmerId
                                    `Farmer.${200 + j}`, // farmerName
                                    1234567, // farmerScore
                                    j % 6, // ranchId
                                )
                            )
                        )
                        const _boosters = _metadata.attributes.filter(val => {
                            if (val.trait_type && val.trait_type.indexOf("Increase") > 0) {
                                return val;
                            }
                        })
                        freqs[_boosters.length] ++
                    }
                    console.log("freqs =>", freqs)
                    assert(freqs[0] == 0, `${freqs[0]}% awards with no boosters`)
                    assert(freqs[1] > 40, `only ${freqs[1]}% with just one booster`)
                    assert(freqs[2] > 30, `only ${freqs[2]}% with two boosters`)
                    assert(freqs[3] > 6, `only ${freqs[3]}% with three boosters`)
                    assert(freqs[4] > 0, `no one with four boosters`)
                    assert(freqs[4] >= freqs[5], `more with 5 boosters than 4`)
                    assert(freqs[5] >= freqs[6], `more with 6 boosters than 5`)
                })
            })
            describe("Best Ranch awards", async () => {
            })
            describe("Best Bufficorns awards", async () => {
            })
        })
    })
})

function _buildTokenBestBreader(ranking, farmerId, farmerName, farmerScore, ranchId) {
    const ranchNames = [ 
        "The Ol' Algoranch", 
        "Infinity Harmony Farm",
        "Balancer Peak Estate",
        "Gold Reef Company",
        "Vega Slopes Range",
        "Opolis Reservation"
    ]
    return [
        // TokenInfo
        [
            // Award
            [
                0, // Best Breeder
                ranking, // Gold medal
                0, // bufficornId
            ],
            farmerId, // awarded farmer's id
            1643880506, // award expedition date
        ],
        // Farmer
        [
            farmerName, // farmer's name
            farmerScore, // farmer's score
            ranchId, // farmer's ranch id 
        ],
        // Ranch
        [
            ranchNames[ranchId], // ranch name
            12345, // ranch score
            "Fog & Mist", // ranch weather
            "0x4b4c4858", // ranch weather station
            1644580206, // ranch date
            // WitnetInfo
            [
                0, // last valid query id
                0, // latest query id
                "0x0000000000000000000000000000000000000000", // iwitnetrequest address
            ],
        ],
        // Bufficorn
        [
            "", // awarded bufficorn's name
            0, // awarded bufficorn's overall score
            0, // awarded bufficorn's ranch id
            [ 0, 0, 0, 0, 0, 0 ], // awarded bufficorn's traits
        ],
    ]    
}