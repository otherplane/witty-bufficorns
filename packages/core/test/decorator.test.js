const { assert } = require("chai")
const truffleAssert = require("truffle-assertions")
const WittyBufficornsDecorator = artifacts.require("WittyBufficornsDecorator")

contract("WittyBufficornsDecorator", _accounts => {
    let decorator, metadata, svg
    const randomness = "0xb754d49eec4434a3bd789100715ca6a0f7230fe7b66a2cd93457616128bbc5c2"

    before(async () => {
        decorator = await WittyBufficornsDecorator.deployed()
    })
  
    describe("IWittyBufficornsDecorator", async () => {
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
        describe("toJSON(..)", async () => {
            let farmerId = 1
            let farmerName = "Happy Flower"
            let farmerScore = 1234567
            let ranchId = 1
            let ranking = 1
            let tokenId = 123
            describe("Best Breeder awards", async () => {
                before(async () => {
                    metadata = await decorator.toJSON.call(
                        tokenId, // _tokenId
                        randomness,
                        _buildTokenMetadata(0, ranking, farmerId, farmerName, farmerScore, ranchId, 0)
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
                        _buildTokenMetadata(0, 1, farmerId, farmerName, farmerScore, ranchId, 0)
                    )
                    _gold_metadata = JSON.parse(_gold_metadata)
                    let _silver_metadata = await decorator.toJSON.call(
                        tokenId + 2, // _tokenId
                        randomness,
                        _buildTokenMetadata(0, 2, farmerId, farmerName, farmerScore, ranchId, 0)
                    )
                    _silver_metadata = JSON.parse(_silver_metadata)
                    let _bronze_metadata = await decorator.toJSON.call(
                        tokenId + 3, // _tokenId
                        randomness,
                        _buildTokenMetadata(0, 3, farmerId, farmerName, farmerScore, ranchId, 0)
                    )
                    _bronze_metadata = JSON.parse(_bronze_metadata)
                    let _diploma_metadata = await decorator.toJSON.call(
                        tokenId + 4, // _tokenId
                        randomness,
                        _buildTokenMetadata(0, 4, farmerId, farmerName, farmerScore, ranchId, 0)
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
                it ("contains no ranch name trait", async () => {
                    const _attrs = metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Ranch Name") {
                            return val;
                        }
                    })
                    assert(_attrs.length == 0, "contains a ranch name")
                })
                it ("contains no bufficorn name trait", async () => {
                    const _attrs = metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Bufficorn Name") {
                            return val;
                        }
                    })
                    assert(_attrs.length == 0, "contains a bufficorn name")
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
                                _buildTokenMetadata(
                                    0, // category
                                    _ranch_rank_[j], // ranking
                                    101 + j , // farmerId
                                    `Farmer.${101 + j}`, // farmerName
                                    1234567, // farmerScore
                                    j, // ranchId
                                    0, // bufficornId
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
                it.skip ("boosters frequency follows binomial distribution", async () => {
                    for (let i = 0; i < 5; i ++) {      
                        let freqs = [0, 0, 0, 0, 0, 0, 0 ]              
                        for (let j = 0 ; j < 100; j ++) {                            
                            const _metadata = JSON.parse(
                                await decorator.toJSON.call(
                                    200 + j, // _tokenId
                                    "0xb754d49eec4434a3bd789100715ca6a0f7230fe7b66a2cd93457616128bbc5" + i.toString(16),
                                    _buildTokenMetadata(
                                        0, // category
                                        200 + j, // ranking
                                        200 + j, // farmerId
                                        `Farmer.${200 + j}`, // farmerName
                                        1234567, // farmerScore
                                        j % 6, // ranchId
                                        0, // bufficornId
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
                        assert(freqs[1] >= 40, `only ${freqs[1]}% with just one booster`)
                        assert(freqs[2] >= 25, `only ${freqs[2]}% with two boosters`)
                        assert(freqs[3] >= 6, `only ${freqs[3]}% with three boosters`)
                        assert(freqs[3] >= freqs[4], `more with 4 boosters than 3`)
                        assert(freqs[4] >= freqs[5], `more with 5 boosters than 4`)
                        assert(freqs[5] >= freqs[6], `more with 6 boosters than 5`)
                    }
                })
            })
            describe("Best Ranch awards", async () => {
                let farmerId = 1111
                let farmerName = "Dirty Dancing"
                let farmerScore = 2234567
                let ranchId = 2
                let ranking = 3
                let tokenId = 223
                before(async () => {
                    metadata = await decorator.toJSON.call(
                        tokenId, // _tokenId
                        randomness,
                        _buildTokenMetadata(1, ranking, farmerId, farmerName, farmerScore, ranchId, 0)
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
                    // console.log(_attrs)
                    assert(_attrs.length < 2, "more than one")
                    assert(_attrs.length == 1, "none found")
                    assert(_attrs[0].value === "Best Ranch", "bad denomination")
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
                it ("contains Farmer Name trait", async () => {
                    const _attrs = metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Farmer Name") {
                            return val;
                        }
                    })
                    assert(_attrs.length < 2, "more than one farmer name")
                    assert(_attrs.length == 1, "no farmer name")
                    assert(_attrs[0].value === farmerName)
                })
                it("contains no Farmer Ranking attribute", async () => {
                    const _attrs = metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Farmer Ranking") {
                            return val;
                        }
                    })
                    assert(_attrs.length == 0, "farmer ranking found")
                })
                it ("contains Ranch Name trait", async () => {
                    const _attrs = metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Ranch Name") {
                            return val;
                        }
                    })
                    assert(_attrs.length < 2, "more than one ranch name")
                    assert(_attrs.length == 1, "no ranch name")
                    assert(_attrs[0].value === "Balancer Peak State")
                })
                it("contains just one Ranch Ranking attribute, and matches expected value", async () => {
                    const _attrs = metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Ranch Ranking") {
                            return val;
                        }
                    })
                    assert(_attrs.length < 2, "more than one")
                    assert(_attrs.length == 1, "none found")
                    assert(_attrs[0].value == ranking, "bad ranking")
                })
                it("contains just one Ranch Score attribute, and matches expected value", async () => {
                    const _attrs = metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Ranch Score") {
                            return val;
                        }
                    })
                    assert(_attrs.length < 2, "more than one")
                    assert(_attrs.length == 1, "none found")
                    assert(_attrs[0].value == 12345, "bad score")
                })
                it("contains just one Medal attribute, and matches expected values", async () => {
                    let _gold_metadata = await decorator.toJSON.call(
                        tokenId + 1, // _tokenId
                        randomness,
                        _buildTokenMetadata(1, 1, farmerId, farmerName, farmerScore, ranchId, 0)
                    )
                    _gold_metadata = JSON.parse(_gold_metadata)
                    let _silver_metadata = await decorator.toJSON.call(
                        tokenId + 2, // _tokenId
                        randomness,
                        _buildTokenMetadata(1, 2, farmerId, farmerName, farmerScore, ranchId, 0)
                    )
                    _silver_metadata = JSON.parse(_silver_metadata)
                    let _bronze_metadata = await decorator.toJSON.call(
                        tokenId + 3, // _tokenId
                        randomness,
                        _buildTokenMetadata(1, 3, farmerId, farmerName, farmerScore, ranchId, 0)
                    )
                    _bronze_metadata = JSON.parse(_bronze_metadata)
                    let _diploma_metadata = await decorator.toJSON.call(
                        tokenId + 4, // _tokenId
                        randomness,
                        _buildTokenMetadata(1, 4, farmerId, farmerName, farmerScore, ranchId, 0)
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
                it ("contains no boosters", async () => {
                    const _attrs = metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Bufficorn Name") {
                            return val;
                        }
                    })
                    assert(_attrs.length == 0, "contains a bufficorn name")
                })
                it ("contains no Bufficorn Name trait", async () => {
                    const _attrs = metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Bufficorn Name") {
                            return val;
                        }
                    })
                    assert(_attrs.length == 0, "contains a bufficorn name")
                })
                it ("contains no Bufficorn Ranking trait", async () => {
                    const _attrs = metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Bufficorn Ranking") {
                            return val;
                        }
                    })
                    assert(_attrs.length == 0, "contains a bufficorn ranking")
                })
                it ("contains no Bufficorn Score trait", async () => {
                    const _attrs = metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Bufficorn Score") {
                            return val;
                        }
                    })
                    assert(_attrs.length == 0, "contains a bufficorn score")
                })
            })
            describe("Best Bufficorns awards", async () => {
                let farmerId = 2222
                let farmerName = "Pepe Pepito"
                let farmerScore = 34567
                let ranchId = 3
                let ranking = 2
                let tokenId = 5321
                before(async () => {
                    metadata = await decorator.toJSON.call(
                        tokenId, // _tokenId
                        randomness,
                        _buildTokenMetadata(2, ranking, farmerId, farmerName, farmerScore, ranchId, 23)
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
                it("contains just one Award Category property, and matches expected denomination", async () => {
                    const _denom_ = [
                        "Best Overall Bufficorn",
                        "Warmest Bufficorn",
                        "Coolest Bufficorn",
                        "Smartest Bufficorn",
                        "Fastest Bufficorn",
                        "Most Enduring Bufficorn",
                        "Most Vigorous Bufficorn"
                    ]
                    for (let i = 0; i < 7; i ++) {
                        const _metadata = JSON.parse(
                                await decorator.toJSON.call(
                                tokenId,
                                randomness,
                                _buildTokenMetadata(
                                    i + 2,
                                    1 + Math.round(3 * Math.random()),
                                    farmerId,
                                    farmerName,
                                    farmerScore,
                                    ranchId,
                                    i + 1
                                )
                            )
                        )
                        // console.log(_metadata)
                        const _attrs = _metadata.attributes.filter(val => {
                            if (val.trait_type && val.trait_type === "Award Category") {
                                return val;
                            }
                        })
                        // console.log(_attrs)
                        assert(_attrs.length < 2, `more than one (category: ${i + 2})`)
                        assert(_attrs.length == 1, `none found (category: ${i + 2})`)
                        assert(_attrs[0].value === _denom_[i], `bad denomination (category: ${i + 2}): ${_attrs[0].value}`)
                    }
                })
                it ("contains just one Expedition Date property", async () => {
                    const _attrs = metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Expedition Date") {
                            return val;
                        }
                    })
                    assert(_attrs.length < 2, "more than one")
                    assert(_attrs.length == 1, "none found")
                })
                it ("contains Farmer Name property", async () => {
                    const _attrs = metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Farmer Name") {
                            return val;
                        }
                    })
                    assert(_attrs.length < 2, "more than one farmer name")
                    assert(_attrs.length == 1, "no farmer name")
                    assert(_attrs[0].value === farmerName)
                })
                it("contains no Farmer Ranking property", async () => {
                    const _attrs = metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Farmer Ranking") {
                            return val;
                        }
                    })
                    assert(_attrs.length == 0, "farmer ranking found")
                })
                it("contains no Farmer Score property", async () => {
                    const _attrs = metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Farmer Score") {
                            return val;
                        }
                    })
                    assert(_attrs.length == 0, "farmer score found")
                })
                it ("contains no Ranch Name property", async () => {
                    const _attrs = metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Ranch Name") {
                            return val;
                        }
                    })
                    // console.log(metadata)
                    assert(_attrs.length == 0, "contains a ranch name")
                })
                it("contains no Ranch Ranking property", async () => {
                    const _attrs = metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Ranch Ranking") {
                            return val;
                        }
                    })
                    assert(_attrs.length == 0, "ranch ranking found")
                })
                it("contains no Ranch Score property", async () => {
                    const _attrs = metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Ranch Score") {
                            return val;
                        }
                    })
                    assert(_attrs.length == 0, "ranch score found")
                })
                it("contains just one Bufficorn Score trait, and matches expected value", async () => {
                    const _attrs = metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Bufficorn Score") {
                            return val;
                        }
                    })
                    assert(_attrs.length < 2, "more than one")
                    assert(_attrs.length == 1, "none found")
                    assert(_attrs[0].value == 1110, "bad score")
                })                
                it ("contains Bufficorn Name trait, and matches expected value", async () => {
                    const _attrs = metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Bufficorn Name") {
                            return val;
                        }
                    })
                    assert(_attrs.length < 2, "more than one bufficorn name")
                    assert(_attrs.length == 1, "no bufficorn name")
                    assert(_attrs[0].value === `Bufficorn.23`, "bad name")
                })
                it ("contains just one Bufficorn Coat trait, and matches expected value", async () => {
                    const _attrs = metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Bufficorn Coat") {
                            return val;
                        }
                    })
                    assert(_attrs.length < 2, "more than one trait with same name")
                    assert(_attrs.length == 1, "none found")
                    assert(_attrs[0].value == 1110, "bad value")
                })
                it ("contains just one Bufficorn Coolness trait, and matches expected value", async () => {
                    const _attrs = metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Bufficorn Coolness") {
                            return val;
                        }
                    })
                    assert(_attrs.length < 2, "more than one trait with same name")
                    assert(_attrs.length == 1, "none found")
                    assert(_attrs[0].value == 1120, "bad value")
                })
                it ("contains just one Bufficorn Intelligence trait, and matches expected value", async () => {
                    const _attrs = metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Bufficorn Intelligence") {
                            return val;
                        }
                    })
                    assert(_attrs.length < 2, "more than one trait with same name")
                    assert(_attrs.length == 1, "none found")
                    assert(_attrs[0].value == 1130, "bad value")
                })
                it ("contains just one Bufficorn Speed trait, and matches expected value", async () => {
                    const _attrs = metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Bufficorn Speed") {
                            return val;
                        }
                    })
                    assert(_attrs.length < 2, "more than one trait with same name")
                    assert(_attrs.length == 1, "none found")
                    assert(_attrs[0].value == 1140, "bad value")
                })
                it ("contains just one Bufficorn Stamina trait, and matches expected value", async () => {
                    const _attrs = metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Bufficorn Stamina") {
                            return val;
                        }
                    })
                    assert(_attrs.length < 2, "more than one trait with same name")
                    assert(_attrs.length == 1, "none found")
                    assert(_attrs[0].value == 1150, "bad value")
                })
                it ("contains just one Bufficorn Strength trait, and matches expected value", async () => {
                    const _attrs = metadata.attributes.filter(val => {
                        if (val.trait_type && val.trait_type === "Bufficorn Strength") {
                            return val;
                        }
                    })
                    assert(_attrs.length < 2, "more than one trait with same name")
                    assert(_attrs.length == 1, "none found")
                    assert(_attrs[0].value == 1160, "bad value")
                })
                // TODO: fails if trying to produce metadata for a best bufficorn category with a ranking > 3 
            })
        })
    })
})

function _buildTokenMetadata(category, ranking, farmerId, farmerName, farmerScore, ranchId, bufficornId) {
    return [
        // TokenInfo
        [
            // Award
            [
                category,
                ranking, // Gold medal
                bufficornId, // bufficornId
            ],
            farmerId, // awarded farmer's id
            1643880506, // award expedition date
        ],
        // Farmer
        [
            farmerName, // farmer's name
            farmerScore, // farmer's score
            ranchId, // farmer's ranch id 
            0, // farmer's first token id
            0, // farmer's total awards
        ],
        // Ranch
        [
            // ranchNames[ranchId], // ranch name
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
            `Bufficorn.${bufficornId}`, // awarded bufficorn's name
            1110, // awarded bufficorn's overall score
            ranchId, // awarded bufficorn's ranch id
            [ 1110, 1120, 1130, 1140, 1150, 1160 ], // awarded bufficorn's traits
        ],
    ]    
}
