const { assert } = require("chai")
const truffleAssert = require("truffle-assertions")
const WittyBufficornsDecorator = artifacts.require("WittyBufficornsDecorator")
const WittyBufficornsToken = artifacts.require("WittyBufficornsToken")
const WitnetRandomnessMock = artifacts.require("WitnetRandomnessMock")

contract("WittyBufficornsToken", accounts => {
    let tender
    let owner = accounts[0]
    let stranger = accounts[1]
    let signator = accounts[4]
    let farmer0 = "0x184cc5908e1a3d29b4d31df67d99622c4baa7b71"
    let farmer1 = accounts[2]
    let farmer2 = accounts[3]
    
    before(async () => {
        tender = await WittyBufficornsToken.new(                 
            "Witty Bufficorns Test",
            "TEST",
            WitnetRandomnessMock.address,
            WittyBufficornsDecorator.address
        )
    })
    describe("State-machine happy path", async () => {
        describe("In status: 'Breeding'", async () => {
            beforeEach(async () => {
                let status = await tender.getStatus.call()
                assert.equal(status.toString(), "0")
            })
            describe("IWittyBufficornsSurrogates", async() => {
                describe("mintFarmerAwards(..)", async () => {
                    it("awards cannot be minted", async () => {
                        await truffleAssert.reverts(
                            tender.mintFarmerAwards(
                                farmer0,
                                0,
                                1,
                                800,
                                "farmer0",
                                [
                                    [ 0, 1, 0 ]
                                ],
                                "0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b"
                            ),
                            "bad mood"
                        )
                    })
                })
            })
            describe("IWittyBufficornsView", async () => {
                describe("getTokenInfo(..)", async () => {
                    it("getting inexistent token fails", async() => {
                        await truffleAssert.reverts(
                            tender.getTokenInfo.call(0),
                            "inexistent"
                        )
                        await truffleAssert.reverts(
                            tender.getTokenInfo.call(1),
                            "inexistent"
                        )
                    })
                })
            })
            describe("IWittyBufficornsAdmin", async() => {
                describe("setSignator(..)", async () => {
                    it("stranger cannot change signatorship", async () => {
                        await truffleAssert.reverts(
                            tender.setSignator(
                                signator,
                                { from: stranger }
                            ),
                            "Ownable"
                        )
                    })
                    it("owner can transfer signatorship", async () => {
                        await tender.setSignator(signator, { from: owner })
                        assert.equal(signator, await tender.getSignator.call())
                    })
                    it("signator cannot transfer signatorship", async () => {
                        await truffleAssert.reverts(
                            tender.setSignator(
                                stranger,
                                { from: signator }
                            ),
                            "Ownable"
                        )
                    })
                    it("signator cannot be set to zero", async () => {
                        await truffleAssert.reverts(
                            tender.setSignator(
                                "0x0000000000000000000000000000000000000000",
                                { from: owner }
                            ),
                            "no signator"
                        )
                    })
                })
                describe("setDecorator(..)", async () => {
                    it("stranger cannot change decorator", async() => {
                        await truffleAssert.reverts(
                            tender.setDecorator(stranger, { from: stranger }),
                            "Ownable"
                        )
                    })
                    it("decorator cannot be set to zero", async () => {
                        await truffleAssert.reverts(
                            tender.setDecorator(
                                "0x0000000000000000000000000000000000000000",
                                { from: owner }
                            ),
                            "no decorator"
                        )
                    })
                    it("signator cannot change decorator", async () => {
                        await truffleAssert.reverts(
                            tender.setDecorator(stranger, { from: signator }),
                            "Ownable"
                        )
                    })
                    it("owner can change decorator", async() => {
                        await tender.setDecorator(WittyBufficornsDecorator.address, { from: owner })
                        assert.equal(
                            WittyBufficornsDecorator.address, 
                            await tender.getDecorator.call()
                        )
                    })
                })                
                describe("setRanchScore(..)", async () => {
                    it("stranger cannot set ranch score", async() => {
                        await truffleAssert.reverts(
                            tender.setRanchScore(
                                0,
                                "Ranch.0",
                                12345,
                                { from: stranger }
                            ),
                            "only signator"
                        )
                    })
                    it("owner cannot set ranch score", async() => {
                        await truffleAssert.reverts(
                            tender.setRanchScore(
                                0,
                                "Ranch.0",
                                12345,
                                { from: stranger }
                            ),
                            "only signator"
                        )
                    })
                    it("ranch must be set with a name", async () => {
                        await truffleAssert.reverts(
                            tender.setRanchScore(
                                0,
                                "",
                                12345,
                                { from: signator }
                            ),
                            "no name"
                        )
                    })
                    it("signator can create new ranch", async () => {
                        await tender.setRanchScore(
                            0,
                            "Ranch.0",
                            12345,
                            { from: signator }
                        )
                        assert.equal(
                            1,
                            await tender.totalRanches.call()
                        )
                    })
                    it("signator can reset score of existent ranch", async () => {
                        await tender.setRanchScore(
                            0,
                            "Ranch.0",
                            10,
                            { from: signator }
                        )
                        assert.equal(
                            1,
                            await tender.totalRanches.call()
                        )
                        let ranch = await tender.getRanch.call(0)
                        assert.equal(
                            10,
                            ranch.score
                        )
                    })
                })
                describe("setBufficornScores(..)", async () => {
                    it("stranger cannot set bufficorn traits", async() => {
                        await truffleAssert.reverts(
                            tender.setBufficornScores(
                                0,
                                0,
                                "Bufficorn.0",
                                [ 1, 2, 3, 4, 5, 6 ],
                                { from: stranger }
                            ),
                            "only signator"
                        )
                    })
                    it("owner cannot set bufficorn traits", async() => {
                        await truffleAssert.reverts(
                            tender.setBufficornScores(
                                0,
                                0,
                                "Bufficorn.0",
                                [ 1, 2, 3, 4, 5, 6 ],
                                { from: owner }
                            ),
                            "only signator"
                        )
                    })
                    it("bufficorn must be set to an existent ranch", async () => {
                        await truffleAssert.reverts(
                            tender.setBufficornScores(
                                0,
                                1,
                                "Bufficorn.0",
                                [ 1, 2, 3, 4, 5, 6 ],
                                { from: signator }
                            ),
                            "inexistent ranch"
                        )
                    })
                    it("bufficorn must be set with a name", async () => {
                        await truffleAssert.reverts(
                            tender.setBufficornScores(
                                0,
                                0,
                                "",
                                [ 1, 2, 3, 4, 5, 6 ],
                                { from: signator }
                            ),
                            "no name"
                        )
                    })
                    it("bufficorn score cannot be lower than ranch'es", async () => {
                        await truffleAssert.reverts(
                            tender.setBufficornScores(
                                0,
                                0,
                                "Bufficorn.0",
                                [ 1, 2, 3, 4, 5, 6 ],
                                { from: signator }
                            ),
                            "score below"
                        )
                    })
                    it("signator can create new valid bufficorn", async () => {
                        await tender.setBufficornScores(
                            0,
                            0,
                            "Bufficorn.0",
                            [ 10, 20, 30, 40, 50, 60 ],
                            { from: signator }
                        )
                        assert.equal(
                            1,
                            await tender.totalBufficorns.call()
                        )
                    })
                    it("signator can reset data of existent bufficorn", async () => {
                        await tender.setBufficornScores(
                            0,
                            0,
                            "Buficornio Sánchez",
                            [ 60, 50, 40, 30, 20, 10 ],
                            { from: signator }
                        )
                        assert.equal(
                            1,
                            await tender.totalBufficorns.call()
                        )
                        let info = await tender.getBufficorn.call(0)
                        assert.equal(
                            10,
                            info.score
                        )
                    })
                })
                describe("startAwarding()", async () => {
                    it("awarding cannot start if breeding was not previously stopped", async () => {
                        await truffleAssert.reverts(
                            tender.startAwarding({ from: signator }),
                            "bad mood"
                        )
                    })
                })
                describe("stopBreeding(..)", async () => {
                    it("owner cannot stop breeding", async () => {
                        await truffleAssert.reverts(
                            tender.stopBreeding(
                                1, // _totalRanches
                                1, // _totalBufficorns
                                { from: owner, value: 10 ** 10 }
                            ),
                            "only signator"
                        )
                    })
                    it("stranger cannot stop breeding", async () => {
                        await truffleAssert.reverts(
                            tender.stopBreeding(
                                1, // _totalRanches
                                1, // _totalBufficorns
                                { from: stranger, value: 10 ** 10 }
                            ),
                            "only signator"
                        )
                    })
                    it("breeding cannot stop if wrong number of bufficorns is provided", async () => {
                        await truffleAssert.reverts(
                            tender.stopBreeding(
                                1,  // _totalRanches
                                24, // _totalBufficorns
                                {
                                    from: signator,
                                    value: 10 ** 10
                                }
                            ),
                            "bufficorns mismatch"
                        )
                    })
                    it("breeding cannot stop if wrong number of ranches is provided", async () => {
                        await truffleAssert.reverts(
                            tender.stopBreeding(
                                6, // _totalRanches
                                1, // _totalBufficorns
                                {
                                    from: signator,
                                    value: 10 ** 10 // 10 gwei
                                }
                            ),
                            "ranches mismatch"
                        )
                    })
                    it("stopping breeding of tender with no randomizer, turns to 'Awarding' status", async () => {
                        let tender2 = await WittyBufficornsToken.new(                 
                            "Witty Bufficorns Test",
                            "TEST",
                            "0x0000000000000000000000000000000000000000",
                            WittyBufficornsDecorator.address
                        )
                        await tender2.setRanchScore(0, "Ranch.0", 10)
                        await tender2.setBufficornScores(0, 0, "Bufficorn.0", [ 10, 20, 30, 40, 50, 60 ])
                        await tender2.stopBreeding(1, 1)
                        let status = await tender2.getStatus.call()
                        assert.equal(status.toString(), "2")
                    })
                    it("signator can exit breeding status", async () => {
                        await tender.stopBreeding(
                            1,
                            1,
                            {
                                from: signator,
                                value: 10 ** 10
                            }
                        )
                        // check status changed to 'Randomizing'
                        let status = await tender.getStatus.call()
                        assert.equal(status.toString(), "1")
                    })
                })
            })
        })

        describe("In status: 'Randomizing'", async () => {
            beforeEach(async () => {
                let status = await tender.getStatus.call()
                assert.equal(status.toString(), "1")
            })
            describe("IWittyBufficornsSurrogates", async() => {
                describe("mintFarmerAwards(..)", async () => {
                    it("awards cannot be minted", async () => {
                        await truffleAssert.reverts(
                            tender.mintFarmerAwards(
                                farmer0,
                                0,
                                1,
                                800,
                                "farmer0",
                                [
                                    [ 0, 1, 0 ]
                                ],
                                "0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b"
                            ),
                            "bad mood"
                        )
                    })
                })
            })
            describe("IWittyBufficornsView", async () => {
                describe("getTokenInfo(..)", async () => {
                    it("getting inexistent token fails", async() => {
                        await truffleAssert.reverts(
                            tender.getTokenInfo.call(0),
                            "inexistent"
                        )
                        await truffleAssert.reverts(
                            tender.getTokenInfo.call(1),
                            "inexistent"
                        )
                    })
                })
            })
            describe("IWittyBufficornsAdmin", async() => {
                describe("setSignator(..)", async () => {
                    it("stranger cannot change signatorship", async () => {
                        await truffleAssert.reverts(
                            tender.setSignator(
                                signator,
                                { from: stranger }
                            ),
                            "Ownable"
                        )
                    })
                    it("signator cannot transfer signatorship", async () => {
                        await truffleAssert.reverts(
                            tender.setSignator(
                                stranger,
                                { from: signator }
                            ),
                            "Ownable"
                        )
                    })
                    it("owner cannot transfer signatorship if not in 'Breeding' status", async () => {
                        await truffleAssert.reverts(
                            tender.setSignator(
                                signator,
                                { from: owner }
                            ),
                            "bad mood"
                        )
                    })                    
                })
                describe("setDecorator(..)", async () => {
                    it("stranger cannot change decorator", async() => {
                        await truffleAssert.reverts(
                            tender.setDecorator(stranger, { from: stranger }),
                            "Ownable"
                        )
                    })
                    it("decorator cannot be set to zero", async () => {
                        await truffleAssert.reverts(
                            tender.setDecorator(
                                "0x0000000000000000000000000000000000000000",
                                { from: owner }
                            ),
                            "no decorator"
                        )
                    })
                    it("signator cannot change decorator", async () => {
                        await truffleAssert.reverts(
                            tender.setDecorator(stranger, { from: signator }),
                            "Ownable"
                        )
                    })
                    it("owner can change decorator", async() => {
                        await tender.setDecorator(WittyBufficornsDecorator.address, { from: owner })
                        assert.equal(
                            WittyBufficornsDecorator.address, 
                            await tender.getDecorator.call()
                        )
                    })
                })
                describe("setRanchScore(..)", async () => {
                    it("stranger cannot set ranch score", async() => {
                        await truffleAssert.reverts(
                            tender.setRanchScore(
                                0,
                                "Ranch.0",
                                12345,
                                { from: stranger }
                            ),
                            "only signator"
                        )
                    })
                    it("owner cannot set ranch score", async() => {
                        await truffleAssert.reverts(
                            tender.setRanchScore(
                                0,
                                "Ranch.0",
                                12345,
                                { from: stranger }
                            ),
                            "only signator"
                        )
                    })
                    it("signator cannot add/edit ranches if not in 'Breeding' status", async () => {
                        await truffleAssert.reverts(
                            tender.setRanchScore(
                                0,
                                "Ranch.0",
                                10,
                                { from: signator }
                            ),
                            "bad mood"
                        )
                    })
                })
                describe("setBufficornScores(..)", async () => {
                    it("stranger cannot set bufficorn traits", async() => {
                        await truffleAssert.reverts(
                            tender.setBufficornScores(
                                0,
                                0,
                                "Bufficorn.0",
                                [ 1, 2, 3, 4, 5, 6 ],
                                { from: stranger }
                            ),
                            "only signator"
                        )
                    })
                    it("owner cannot set bufficorn traits", async() => {
                        await truffleAssert.reverts(
                            tender.setBufficornScores(
                                0,
                                0,
                                "Bufficorn.0",
                                [ 1, 2, 3, 4, 5, 6 ],
                                { from: owner }
                            ),
                            "only signator"
                        )
                    })
                    it("signator cannot add/edit bufficorns if not in 'Breeding' status", async () => {
                        await truffleAssert.reverts(
                            tender.setBufficornScores(
                                0,
                                0,
                                "Bufficorn.0",
                                [ 10, 20, 30, 40, 50, 60 ],
                                { from: signator }
                            ),
                            "bad mood"
                        )
                    })
                })
                describe("stopBreeding(..)", async () => {
                    it("breeding cannot be stopped twice", async () => {
                        await truffleAssert.reverts(
                            tender.stopBreeding(
                                1, // _totalRanches
                                1, // _totalBufficorns
                                { from: signator, value: 10 ** 10 }
                            ),
                            "bad mood"
                        )
                    })
                    it("fails it trying to stop twice a tender with no randomizer", async () => {
                        let tender2 = await WittyBufficornsToken.new(                 
                            "Witty Bufficorns Test",
                            "TEST",
                            "0x0000000000000000000000000000000000000000",
                            WittyBufficornsDecorator.address
                        )
                        await tender2.setRanchScore(0, "Ranch.0", 10)
                        await tender2.setBufficornScores(0, 0, "Bufficorn.0", [ 10, 20, 30, 40, 50, 60 ])
                        await tender2.stopBreeding(1, 1)
                        await truffleAssert.reverts(
                            tender2.stopBreeding(1, 1),
                            "bad mood"
                        )
                    })
                })
                describe("startAwarding()", async () => {
                    it("stranger cannot start awarding", async () => {
                        await truffleAssert.reverts(
                            tender.startAwarding({ from: stranger }),
                            "only signator"
                        )
                    })
                    it("owner cannot start awarding", async () => {
                        await truffleAssert.reverts(
                            tender.startAwarding({ from: owner }),
                            "only signator"
                        )
                    })
                    it("signator cannot start awarding if randomness was not solved yet", async () => {
                        await truffleAssert.reverts(
                            tender.startAwarding({ from: signator }),
                            ""
                        )
                    })
                    it("signator can start awarding if randomness is solved", async () => {
                        let randomizer = await WitnetRandomnessMock.at(WitnetRandomnessMock.address)
                        await randomizer.setRandomness()
                        await tender.startAwarding({ from: signator })
                        assert.equal("2", await tender.getStatus.call())
                    })
                })
            })
        })

        // describe("In status: 'Hatching'", async () => {
        //     beforeEach(async () => {
        //         let status = await tender.getStatus.call()
        //         assert.equal(status.toString(), "2")
        //     })
        //     describe("IWittyBufficornsAdmin", async() => {
        //         describe("setDecorator(..)", async () => {
        //             it("signator cannot change decorator", async () => {
        //                 await truffleAssert.reverts(
        //                     tender.setDecorator(stranger, { from: signator }),
        //                     "Ownable"
        //                 )
        //             })
        //             it("stranger cannot change decorator", async() => {
        //                 await truffleAssert.reverts(
        //                     tender.setDecorator(stranger, { from: stranger }),
        //                     "Ownable"
        //                 )
        //             })
        //             it("decorator cannot be set to zero", async () => {
        //                 await truffleAssert.reverts(
        //                     tender.setDecorator(
        //                         "0x0000000000000000000000000000000000000000",
        //                         { from: owner }
        //                     ),
        //                     "no decorator"
        //                 )
        //             })
        //             it("owner can change decorator", async() => {
        //                 await tender.setDecorator(WittyBufficornsDecorator.address, { from: owner })
        //             })
        //         })
        //         describe("setParameters(..)", async () => {
        //             it("owner cannot change valid parameters", async () => {
        //                 await truffleAssert.reverts(
        //                     tender.setParameters(
        //                         signator,
        //                         [10, 30, 60],
        //                         80640,
        //                         { from: owner }
        //                     ),
        //                     "not in Batching"
        //                 )
        //             })
        //             it("stranger cannot change parameters", async() => {
        //                 await truffleAssert.reverts(
        //                     tender.setParameters(
        //                         stranger,
        //                         [10, 30, 60],
        //                         80640,
        //                         { from: stranger }
        //                     ),
        //                     "Ownable"
        //                 )
        //             })
        //             it("signator cannot change parameters", async() => {
        //                 await truffleAssert.reverts(
        //                     tender.setParameters(
        //                         stranger,
        //                         [10, 30, 60],
        //                         80640,
        //                         { from: signator }
        //                     )
        //                 )
        //             })
        //         })
        //         describe("stopBatching()", async () => {
        //             it("signator cannot stop batching", async () => {
        //                 await truffleAssert.reverts(
        //                     tender.stopBatching({
        //                         from: signator,
        //                         value: 10 ** 10 // 10 gwei
        //                     }),
        //                     "Ownable"
        //                 )
        //             })
        //             it("stranger cannot stop batching", async () => {
        //                 await truffleAssert.reverts(
        //                     tender.stopBatching({
        //                         from: stranger,
        //                         value: 10 ** 10 // 10 gwei
        //                     }),
        //                     "Ownable"
        //                 )
        //             })
        //             it("owner cannot stop batching", async() => {
        //                 await truffleAssert.reverts(
        //                     tender.stopBatching({ 
        //                         from: owner,
        //                         value: 10 ** 10 // 10 gwei
        //                     }),
        //                     "not in Batching"
        //                 )
        //             })
        //         })
        //         describe("startHatching()", async () => {
        //             it("signator cannot re-start hatching", async() => {
        //                 await truffleAssert.reverts(
        //                     tender.startHatching({ from: signator }),
        //                     "Ownable"
        //                 )
        //             })
        //             it("stranger cannot re-start hatching", async() => {
        //                 await truffleAssert.reverts(
        //                     tender.startHatching({ from: stranger }),
        //                     "Ownable"
        //                 )
        //             })
        //             it("owner cannot re-start hatching", async() => {
        //                 await truffleAssert.reverts(
        //                     tender.startHatching({ from:owner }),
        //                     "not in Randomizing"
        //                 )
        //             })
        //         })
        //     })
        //     describe("IWittyBufficornsSurrogates", async() => {
        //         describe("mintFarmerAwards(..)", async () => {
        //             it("fails if trying to malleate egg owner when minting a new creature", async () => {
        //                 await truffleAssert.reverts(
        //                     tender.mintFarmerAwards(
        //                         stranger,   // _eggOwner
        //                         0,          // _eggIndex
        //                         1,          // _eggRanking
        //                         800,        // _eggScore
        //                         2,          // _totalEggs
        //                         "0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b"
        //                     ),
        //                     "bad signature"
        //                 )
        //             })
        //             it("fails if trying to malleate egg index when minting a new creature", async () => {
        //                 await truffleAssert.reverts(
        //                     tender.mintFarmerAwards(
        //                         eggOwner0,
        //                         1,
        //                         1,
        //                         800,
        //                         2,
        //                         "0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b"
        //                     ),
        //                     "bad signature"
        //                 )
        //             })
        //             it("fails if trying to malleate egg score when minting a new creature", async () => {
        //                 await truffleAssert.reverts(
        //                     tender.mintFarmerAwards(
        //                         eggOwner0,
        //                         0,
        //                         1,
        //                         1800,
        //                         2,
        //                         "0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b"
        //                     ),
        //                     "bad signature"
        //                 )
        //             })
        //             it("fails if trying to malleate egg ranking when minting a new creature", async () => {
        //                 await truffleAssert.reverts(
        //                     tender.mintFarmerAwards(
        //                         eggOwner0,
        //                         0,
        //                         2,
        //                         800,
        //                         2,
        //                         "0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b"
        //                     ),
        //                     "bad signature"
        //                 )
        //             })
        //             it("fails if trying to malleate totally claimed eggs when minting a new creature", async () => {
        //                 await truffleAssert.reverts(
        //                     tender.mintFarmerAwards(
        //                         eggOwner0,
        //                         0,
        //                         1,
        //                         800,
        //                         25,
        //                         "0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b"
        //                     ),
        //                     "bad signature"
        //                 )
        //             })
        //             it("common creature can be minted by anyone", async () => {
        //                 await tender.mintFarmerAwards(
        //                     eggOwner0,
        //                     0, // _eggIndex
        //                     1, // _eggRanking
        //                     800, // _eggScore
        //                     2, // _eggTotalClaimedEggs
        //                     // eslint-disable-next-line max-len
        //                     "0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b",
        //                     { from: stranger }
        //                 )
        //                 // checks that creature #0 is now in 'Alive' status:
        //                 let _status = await tender.getCreatureStatus.call(0)
        //                 assert.equal(_status.toString(), "3")
        //                 // checks the new creature was assigned 1 as tokenId:
        //                 let _data = await tender.getCreatureData.call(0)
        //                 assert.equal(_data.tokenId.toString(), "1")
        //                 // checks creature category is Common
        //                 assert.equal(_data.eggCategory.toString(), "2")
        //             })
        //             it("minted common creature cannot be minted twice", async () => {
        //                 truffleAssert.reverts(
        //                     tender.mintFarmerAwards(
        //                         eggOwner0,
        //                         0, // _eggIndex
        //                         1, // _eggRanking
        //                         800, // _eggScore
        //                         2, // _eggTotalClaimedEggs
        //                         // eslint-disable-next-line max-len
        //                         "0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b",
        //                         { from: stranger }
        //                     ),
        //                     "already minted"
        //                 )
        //             })
        //             it("legendary creature can be minted by anyone", async () => {
        //                 await tender.mintFarmerAwards(
        //                     eggOwner1,
        //                     1, // _eggIndex
        //                     10, // _eggRanking
        //                     800, // _eggScore
        //                     100, // _eggTotalClaimedEggs
        //                     // eslint-disable-next-line max-len
        //                     "0x6b880a72e2b1fc60100ef883e74235ac5eca355985a308ef60221e819a3f151a5eb421d0a3c352449afef51e572c491c8d905761844d7ff064bf4718294a0c181c",
        //                     { from: stranger }
        //                 )
        //                 // checks that creature #1 is now in 'Alive' status:
        //                 let _status = await tender.getCreatureStatus.call(1)
        //                 assert.equal(_status.toString(), "3")
        //                 // checks the new creature was assigned 2 as tokenId:
        //                 let _data = await tender.getCreatureData.call(1)
        //                 assert.equal(_data.tokenId.toString(), "2")
        //                 // checks creature category is Legendary
        //                 assert.equal(_data.eggCategory.toString(), "0")
        //             })
        //             it("rare creature can be minted by anyone", async () => {
        //                 await tender.mintFarmerAwards(
        //                     eggOwner2,
        //                     2,
        //                     40,
        //                     800,
        //                     100,
        //                     "0x3a59a87d0b07063fd5e968d70ce4446160fe8cbef3da7812afd1147b4fc2eabb7e2481fe85c77bc175bbd347291feb8adf25f489be409bcdf8759767761c16a81c"
        //                 )
        //                 // checks that creature #2 is now in 'Alive' status:
        //                 let status = await tender.getCreatureStatus.call(2)
        //                 assert.equal(status.toString(), "3")
        //                 // checks the new creature was assigned 3 as tokenId:
        //                 let data = await tender.getCreatureData.call(2)
        //                 assert.equal(data.tokenId.toString(), "3")
        //                 // checks creature category is Rare
        //                 assert.equal(data.eggCategory.toString(), "1")
        //             })
        //         })
        //         describe("previewCreature(..)", async() => {
        //             it("minted creature can be previewed by anyone", async () => {
        //                 tender.previewCreatureImage(
        //                     eggOwner0,
        //                     0, // _eggIndex
        //                     1, // _eggRanking
        //                     800, // _eggScore                            
        //                     2, // _eggTotalClaimedEggs
        //                     // eslint-disable-next-line max-len
        //                     "0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b",
        //                     { from: stranger }
        //                 )
        //                 // checks that creature #0 continues in 'Hatching' status:
        //                 let _status = await tender.getCreatureStatus.call(0)
        //                 assert.equal(_status.toString(), "3")
        //                 // console.log(
        //                     await tender.previewCreatureImage.call(
        //                         eggOwner0,
        //                         0, // _eggIndex
        //                         1, // _eggRanking
        //                         800, // _eggScore                                
        //                         2, // _eggTotalClaimedEggs
        //                         // eslint-disable-next-line max-len
        //                         "0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b",
        //                         { from: stranger }
        //                     )
        //                 // )
        //             })
        //             it("unminted creature can by previewed by anyone", async () => {
        //                 // console.log(
        //                     await tender.previewCreatureImage.call(
        //                         eggOwner2,
        //                         0, // _eggIndex
        //                         40, // _eggRanking
        //                         800, // _eggScore                                
        //                         100, // _eggTotalClaimedEggs
        //                         // eslint-disable-next-line max-len
        //                         "0x0d71bc5a298b7e945191ccaf7b3a5d8cfb4cd95c58adaadd8901b4fdeea7320e523dbf885bf88c3cbc286bfcb4c74ad4d017127ca2c4a36542015debb3957ff51b",
        //                         { from: stranger }
        //                     )
        //                 // )
        //             })
        //         })
        //     })
        //     describe("IWittyBufficornsView", async () => {
        //         describe("getCreatureData(_eggIndex)", async () => {
        //             it("data of a previously minted common creature should be valid", async () => {
        //                 let data = await tender.getCreatureData.call(0)
        //                 // console.log(data)
        //                 assert.equal(data.tokenId.toString(), "1")
        //                 assert.equal(data.eggIndex.toString(), "0")
        //                 assert.equal(data.eggScore.toString(), "800")
        //                 assert.equal(data.eggRanking.toString(), "1")
        //                 assert.equal(data.eggCategory.toString(), "2")
        //             })
        //             it("data of a previously minted legendary creature should be valid", async () => {
        //                 let data = await tender.getCreatureData.call(1)
        //                 // console.log(data)
        //                 // assert.equal(data.eggOwner, eggOwner1)
        //                 assert.equal(data.tokenId.toString(), "2")
        //                 assert.equal(data.eggIndex.toString(), "1")
        //                 assert.equal(data.eggScore.toString(), "800")
        //                 assert.equal(data.eggRanking.toString(), "10")
        //                 assert.equal(data.eggCategory.toString(), "0")
        //             })
        //         })
        //         describe("getCreatureImage(_eggIndex)", async () => {
        //             it("getting images from minted creatures works", async () => {
        //                 await tender.getCreatureImage.call(0)
        //                 await tender.getCreatureImage.call(1)
        //             })
        //             it("getting image from unminted creature fails", async () => {
        //                 await truffleAssert.reverts(
        //                     tender.getCreatureImage.call(11),
        //                     "not alive yet"
        //                 )
        //             })
        //         })
        //         describe("getCreatureStatus(_eggIndex)", async () => {
        //             it("common creature #0 is in 'Alive' status", async() => {
        //                 let cStatus = await tender.getCreatureStatus.call(0)
        //                 assert.equal(cStatus.toString(), "3")
        //             })
        //             it("legendary creature #1 is in 'Alive' status", async() => {
        //                 let cStatus = await tender.getCreatureStatus.call(1)
        //                 assert.equal(cStatus.toString(), "3")
        //             })
        //             it("rare creature #2 is in 'Alive' status", async() => {
        //                 let cStatus = await tender.getCreatureStatus.call(2)
        //                 assert.equal(cStatus.toString(), "3")
        //             })
        //             it("inexistent creature #3 is in 'Hatching' status", async() => {
        //                 let cStatus = await tender.getCreatureStatus.call(3)
        //                 assert.equal(cStatus.toString(), "2")
        //             })
        //         })
        //         describe("totalSupply()", async () => {
        //             it("totalSupply should have increased to 3", async() => {
        //                 let totalSupply = await tender.totalSupply.call()
        //                 assert.equal(totalSupply.toString(), "3")
        //             })
        //         })
        //     })
        //     describe("ERC721Metadata", async () => {
        //         describe("baseURI()", async () => {
        //             let baseURI
        //             it("returns no empty string", async () => {
        //                 baseURI = await tender.baseURI.call()
        //                 assert(baseURI.length > 0)
        //             })
        //             it("ends up with slash", () => {
        //                 assert(baseURI[baseURI.length - 1] === "/")
        //             })
        //         })
        //         describe("metadata(_tokenId)", async () => {
        //             it("metadata of a previously minted creature should be valid", async () => {
        //                 let metadata = await tender.metadata.call(1)
        //                 // remove non-printable and other non-valid JSON chars
        //                 metadata = JSON.parse(metadata)
        //                 assert.equal(metadata.external_url, "https://api-liscon21.wittycreatures.com/metadata/1")
        //             })
        //             it("getting metadata from inexistent token fails", async () => {
        //                 await truffleAssert.reverts(
        //                     tender.metadata.call(11),
        //                     "inexistent token"
        //                 )
        //             })
        //         })
        //         describe("tokenURI(_tokenId)", async () => {
        //             it("tokenURI of a previously minted creature should be valid", async () => {
        //                 let tokenURI = await tender.tokenURI.call(1)
        //                 assert.equal(tokenURI, "https://api-liscon21.wittycreatures.com/metadata/1")
        //                 tokenURI = await tender.tokenURI.call(2)
        //                 assert.equal(tokenURI, "https://api-liscon21.wittycreatures.com/metadata/2")
        //                 tokenURI = await tender.tokenURI.call(3)
        //                 assert.equal(tokenURI, "https://api-liscon21.wittycreatures.com/metadata/3")
        //             })
        //             it("getting tokenURI from inexistent token fails", async () => {
        //                 await truffleAssert.reverts(
        //                     tender.tokenURI.call(11),
        //                     "inexistent token"
        //                 )
        //             })
        //         })
        //     })
        //     describe("ERC721", async () => {
        //         describe("transferFrom(..), approve(..)", async () => {
        //             it("tender cannot transfer eggOwner0's token #1 to eggOwner1", async() => {
        //                 await truffleAssert.reverts(
        //                     tender.transferFrom(eggOwner0, eggOwner1, 1, { from: owner }),
        //                     "not owner nor approved"
        //                 )
        //             })
        //             it("eggOwner1 can transfer its token #2 to eggOwner2, without previous approval", async () => {
        //                 await tender.transferFrom(eggOwner1, eggOwner2, 2, { from: eggOwner1 })
        //                 let balance2 = await tender.balanceOf.call(eggOwner2)
        //                 assert.equal(balance2.toString(), "2")
        //             })
        //             it("tender cannot approve eggOwner1 concerning eggOwner2's token #3", async () => {
        //                 await truffleAssert.reverts(
        //                     tender.approve(eggOwner1, 3, { from: owner }),
        //                     "not owner nor approved"
        //                 )
        //             })
        //             it("eggOwner1 cannot transfer eggOwner2's token #3, without previous approval", async () => {
        //                 await truffleAssert.reverts(
        //                     tender.transferFrom(eggOwner2, eggOwner1, 3, { from: eggOwner1 }),
        //                     "not owner nor approved"
        //                 )
        //             })
        //             it("eggOwner2 can approve eggOwner1 concerning token #3", async () => {
        //                 await tender.approve(eggOwner1, 3, { from: eggOwner2 })
        //                 let approved = await tender.getApproved.call(3)
        //                 assert.equal(approved, eggOwner1)
        //             })
        //             it("eggOwner1 can transfer eggOwner2's token #3, after previous approval", async () => {
        //                 await tender.transferFrom(eggOwner2, eggOwner1, 3, { from: eggOwner1})
        //             })
        //         })
        //         describe("balanceOf(..)", async () => {
        //             it("eggOwner0 owns one token", async () => {
        //                 let balance0 = await tender.balanceOf.call(eggOwner0)
        //                 assert.equal(balance0.toString(), "1")
        //             })
        //             it("eggOwner1 owns one token", async () => {
        //                 let balance1 = await tender.balanceOf.call(eggOwner1)
        //                 assert.equal(balance1.toString(), "1")
        //             })
        //             it("eggOwner2 owns one token", async () => {
        //                 let balance2 = await tender.balanceOf.call(eggOwner2)
        //                 assert.equal(balance2.toString(), "1")
        //             })
        //             it("tender owner owns no tokens", async () => {
        //                 let balance = await tender.balanceOf.call(owner)
        //                 assert.equal(balance.toString(), "0")
        //             })
        //             it("signator owns no tokens", async () => {
        //                 let balance = await tender.balanceOf.call(signator)
        //                 assert.equal(balance.toString(), "0")
        //             })
        //         })
        //     })
        // })
    })
})