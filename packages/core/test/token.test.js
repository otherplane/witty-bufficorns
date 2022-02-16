const { assert } = require("chai")
const truffleAssert = require("truffle-assertions")
const WittyBufficornsDecorator = artifacts.require("WittyBufficornsDecorator")
const WittyBufficornsToken = artifacts.require("WittyBufficornsToken")
const WitnetRandomnessMock = artifacts.require("WitnetRandomnessMock")

contract("WittyBufficornsToken", accounts => {
  let tender
  const owner = accounts[0]
  const stranger = accounts[1]
  const signator1 = accounts[2]
  const signator2 = "0xF8A654C0328Ba4bAE1aF69EB5856Fc807C8E5731"
  const tokenOwner = "0x184cc5908e1a3d29b4d31df67d99622c4baa7b71"
  const farmerAddr = accounts[3]

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
        const status = await tender.getStatus.call()
        assert.equal(status.toString(), "0")
      })
      describe("IWittyBufficornsSurrogates", async () => {
        describe("mintFarmerAwards(..)", async () => {
          it("awards cannot be minted", async () => {
            await truffleAssert.reverts(
              tender.mintFarmerAwards(
                farmerAddr,
                0,
                1,
                800,
                "farmer0",
                [
                  [0, 1, 0],
                ],
                // eslint-disable-next-line max-len
                "0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b"
              ),
              "bad mood"
            )
          })
        })
      })
      describe("IWittyBufficornsView", async () => {
        describe("getTokenInfo(..)", async () => {
          it("getting inexistent token fails", async () => {
            await truffleAssert.reverts(
              tender.getTokenInfo.call(0),
              "inexistent"
            )
            await truffleAssert.reverts(
              tender.getTokenInfo.call(2),
              "inexistent"
            )
          })
        })
      })
      describe("IWittyBufficornsAdmin", async () => {
        describe("setSignator(..)", async () => {
          it("stranger cannot change signatorship", async () => {
            await truffleAssert.reverts(
              tender.setSignator(
                signator1,
                { from: stranger }
              ),
              "Ownable"
            )
          })
          it("owner can transfer signatorship", async () => {
            await tender.setSignator(signator1, { from: owner })
            assert.equal(signator1, await tender.getSignator.call())
          })
          it("signator cannot transfer signatorship", async () => {
            await truffleAssert.reverts(
              tender.setSignator(
                signator2,
                { from: signator1 }
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
          it("stranger cannot change decorator", async () => {
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
              tender.setDecorator(stranger, { from: signator1 }),
              "Ownable"
            )
          })
          it("owner can change decorator", async () => {
            await tender.setDecorator(WittyBufficornsDecorator.address, { from: owner })
            assert.equal(
              WittyBufficornsDecorator.address,
              await tender.getDecorator.call()
            )
          })
        })
        describe("setRanch(..)", async () => {
          it("stranger cannot set ranch score", async () => {
            await truffleAssert.reverts(
              tender.setRanch(
                0,
                12345,
                { from: stranger }
              ),
              "only signator"
            )
          })
          it("owner cannot set ranch score", async () => {
            await truffleAssert.reverts(
              tender.setRanch(
                0,
                12345,
                { from: stranger }
              ),
              "only signator"
            )
          })
          it("signator can create new ranch", async () => {
            await tender.setRanch(
              0,
              12345,
              { from: signator1 }
            )
            assert.equal(
              1,
              await tender.totalRanches.call()
            )
          })
          it("signator can reset score of existent ranch", async () => {
            await tender.setRanch(
              0,
              10,
              { from: signator1 }
            )
            assert.equal(
              1,
              await tender.totalRanches.call()
            )
            const ranch = await tender.getRanch.call(0)
            assert.equal(
              10,
              ranch.score
            )
          })
        })
        describe("setBufficorn(..)", async () => {
          it("stranger cannot set bufficorn traits", async () => {
            await truffleAssert.reverts(
              tender.setBufficorn(
                0,
                0,
                "Bufficorn.0",
                [1, 2, 3, 4, 5, 6],
                { from: stranger }
              ),
              "only signator"
            )
          })
          it("owner cannot set bufficorn traits", async () => {
            await truffleAssert.reverts(
              tender.setBufficorn(
                0,
                0,
                "Bufficorn.0",
                [1, 2, 3, 4, 5, 6],
                { from: owner }
              ),
              "only signator"
            )
          })
          it("bufficorn must be set with a name", async () => {
            await truffleAssert.reverts(
              tender.setBufficorn(
                0,
                0,
                "",
                [1, 2, 3, 4, 5, 6],
                { from: signator1 }
              ),
              "no name"
            )
          })
          it("bufficorn score cannot be lower than ranch'es", async () => {
            await truffleAssert.reverts(
              tender.setBufficorn(
                0,
                0,
                "Bufficorn.0",
                [1, 2, 3, 4, 5, 6],
                { from: signator1 }
              ),
              "score below"
            )
          })
          it("signator can create new valid bufficorn", async () => {
            await tender.setBufficorn(
              0,
              0,
              "Bufficorn.0",
              [10, 20, 30, 40, 50, 60],
              { from: signator1 }
            )
            assert.equal(
              1,
              await tender.totalBufficorns.call()
            )
          })
          it("signator can reset data of existent bufficorn", async () => {
            await tender.setBufficorn(
              0,
              0,
              "Buficornio Sánchez",
              [60, 50, 40, 30, 20, 10],
              { from: signator1 }
            )
            assert.equal(
              1,
              await tender.totalBufficorns.call()
            )
            const info = await tender.getBufficorn.call(0)
            assert.equal(
              10,
              info.score
            )
          })
        })
        describe("startAwarding()", async () => {
          it("awarding cannot start if breeding was not previously stopped", async () => {
            await truffleAssert.reverts(
              tender.startAwarding({ from: owner }),
              "bad mood"
            )
          })
        })
        describe("stopBreeding(..)", async () => {
          it("signator cannot stop breeding", async () => {
            await truffleAssert.reverts(
              tender.stopBreeding(
                1, // _totalRanches
                1, // _totalBufficorns
                { from: signator1, value: 10 ** 10 }
              ),
              "Ownable"
            )
          })
          it("stranger cannot stop breeding", async () => {
            await truffleAssert.reverts(
              tender.stopBreeding(
                1, // _totalRanches
                1, // _totalBufficorns
                { from: stranger, value: 10 ** 10 }
              ),
              "Ownable"
            )
          })
          it("breeding cannot stop if wrong number of bufficorns is provided", async () => {
            await truffleAssert.reverts(
              tender.stopBreeding(
                1, // _totalRanches
                24, // _totalBufficorns
                {
                  from: owner,
                  value: 10 ** 10,
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
                  from: owner,
                  value: 10 ** 10, // 10 gwei
                }
              ),
              "ranches mismatch"
            )
          })
          it("owner can exit breeding status", async () => {
            // last-minute change of signator
            await tender.setSignator(signator2, { from: owner })
            await tender.stopBreeding(
              1,
              1,
              {
                from: owner,
                value: 10 ** 10,
              }
            )
            // check status changed to 'Randomizing'
            const status = await tender.getStatus.call()
            assert.equal(status.toString(), "1")
          })
        })
      })
    })

    describe("In status: 'Randomizing'", async () => {
      beforeEach(async () => {
        const status = await tender.getStatus.call()
        assert.equal(status.toString(), "1")
      })
      describe("IWittyBufficornsSurrogates", async () => {
        describe("mintFarmerAwards(..)", async () => {
          it("awards cannot be minted", async () => {
            await truffleAssert.reverts(
              tender.mintFarmerAwards(
                farmerAddr,
                0,
                5,
                800,
                "farmer5",
                [
                  [0, 2, 0],
                ],
                // eslint-disable-next-line max-len
                "0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b"
              ),
              "bad mood"
            )
          })
        })
      })
      describe("IWittyBufficornsView", async () => {
        describe("getTokenInfo(..)", async () => {
          it("getting inexistent token fails", async () => {
            await truffleAssert.reverts(
              tender.getTokenInfo.call(0),
              "inexistent"
            )
            await truffleAssert.reverts(
              tender.getTokenInfo.call(27),
              "inexistent"
            )
          })
        })
      })
      describe("IWittyBufficornsAdmin", async () => {
        describe("setSignator(..)", async () => {
          it("owner cannot transfer signatorship if not in 'Breeding' status", async () => {
            await truffleAssert.reverts(
              tender.setSignator(
                signator2,
                { from: owner }
              ),
              "bad mood"
            )
          })
        })
        describe("setDecorator(..)", async () => {
          it("stranger cannot change decorator", async () => {
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
          it.skip("signator cannot change decorator", async () => {
            await truffleAssert.reverts(
              tender.setDecorator(stranger, { from: signator1 }),
              "Ownable"
            )
          })
          it("owner can change decorator", async () => {
            await tender.setDecorator(WittyBufficornsDecorator.address, { from: owner })
            assert.equal(
              WittyBufficornsDecorator.address,
              await tender.getDecorator.call()
            )
          })
        })
        describe("setRanch(..)", async () => {
          it("stranger cannot set ranch score", async () => {
            await truffleAssert.reverts(
              tender.setRanch(
                0,
                12345,
                { from: stranger }
              ),
              "only signator"
            )
          })
          it("owner cannot set ranch score", async () => {
            await truffleAssert.reverts(
              tender.setRanch(
                0,
                12345,
                { from: stranger }
              ),
              "only signator"
            )
          })
          it.skip("signator cannot add/edit ranches if not in 'Breeding' status", async () => {
            await truffleAssert.reverts(
              tender.setRanch(
                0,
                10,
                { from: signator1 }
              ),
              "bad mood"
            )
          })
        })
        describe("setBufficorn(..)", async () => {
          it("stranger cannot set bufficorn traits", async () => {
            await truffleAssert.reverts(
              tender.setBufficorn(
                0,
                0,
                "Bufficorn.0",
                [1, 2, 3, 4, 5, 6],
                { from: stranger }
              ),
              "only signator"
            )
          })
          it("owner cannot set bufficorn traits", async () => {
            await truffleAssert.reverts(
              tender.setBufficorn(
                0,
                0,
                "Bufficorn.0",
                [1, 2, 3, 4, 5, 6],
                { from: owner }
              ),
              "only signator"
            )
          })
          it.skip("signator cannot add/edit bufficorns if not in 'Breeding' status", async () => {
            await truffleAssert.reverts(
              tender.setBufficorn(
                0,
                0,
                "Bufficorn.0",
                [10, 20, 30, 40, 50, 60],
                { from: signator2 }
              ),
              "bad mood"
            )
          })
        })
        describe("stopBreeding(..)", async () => {
          it.skip ("breeding cannot be stopped twice", async () => {
            await truffleAssert.reverts(
              tender.stopBreeding(
                1, // _totalRanches
                1, // _totalBufficorns
                { from: owner, value: 10 ** 10 }
              ),
              "bad mood"
            )
          })
        })
        describe("startAwarding()", async () => {
          it("stranger cannot start awarding", async () => {
            await truffleAssert.reverts(
              tender.startAwarding({ from: stranger }),
              "Ownable"
            )
          })
          it.skip("signator cannot start awarding", async () => {
            await truffleAssert.reverts(
              tender.startAwarding({ from: signator2 }),
              "Ownable"
            )
          })
          it("owner cannot start awarding if randomness was not solved yet", async () => {
            await truffleAssert.reverts(
              tender.startAwarding({ from: owner }),
              "unset"
            )
          })
          it("owner can start awarding if randomness is solved", async () => {
            const randomizer = await WitnetRandomnessMock.at(WitnetRandomnessMock.address)
            await randomizer.setRandomness()
            await tender.startAwarding({ from: owner })
            assert.equal("2", await tender.getStatus.call())
          })
        })
      })
    })

    describe("In status: 'Awarding'", async () => {
      beforeEach(async () => {
        const status = await tender.getStatus.call()
        assert.equal(status.toString(), "2")
      })
      describe("IWittyBufficornsAdmin", async () => {
        describe("setSignator(..)", async () => {
          it("stranger cannot change signatorship", async () => {
            await truffleAssert.reverts(
              tender.setSignator(
                signator1,
                { from: stranger }
              ),
              "Ownable"
            )
          })
          it.skip("signator cannot transfer signatorship", async () => {
            await truffleAssert.reverts(
              tender.setSignator(
                stranger,
                { from: signator2 }
              ),
              "Ownable"
            )
          })
          it("owner cannot transfer signatorship if not in 'Breeding' status", async () => {
            await truffleAssert.reverts(
              tender.setSignator(
                signator2,
                { from: owner }
              ),
              "bad mood"
            )
          })
        })
        describe("setDecorator(..)", async () => {
          it("stranger cannot change decorator", async () => {
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
          it.skip("signator cannot change decorator", async () => {
            await truffleAssert.reverts(
              tender.setDecorator(stranger, { from: signator2 }),
              "Ownable"
            )
          })
          it("owner can change decorator", async () => {
            await tender.setDecorator(WittyBufficornsDecorator.address, { from: owner })
            assert.equal(
              WittyBufficornsDecorator.address,
              await tender.getDecorator.call()
            )
          })
        })
        describe("setRanch(..)", async () => {
          it("stranger cannot set ranch score", async () => {
            await truffleAssert.reverts(
              tender.setRanch(
                0,
                12345,
                { from: stranger }
              ),
              "only signator"
            )
          })
          it("owner cannot set ranch score", async () => {
            await truffleAssert.reverts(
              tender.setRanch(
                0,
                12345,
                { from: stranger }
              ),
              "only signator"
            )
          })
          it.skip("signator cannot add/edit ranches if not in 'Breeding' status", async () => {
            await truffleAssert.reverts(
              tender.setRanch(
                0,
                10,
                { from: signator2 }
              ),
              "bad mood"
            )
          })
        })
        describe("setBufficorn(..)", async () => {
          it("stranger cannot set bufficorn traits", async () => {
            await truffleAssert.reverts(
              tender.setBufficorn(
                0,
                0,
                "Bufficorn.0",
                [1, 2, 3, 4, 5, 6],
                { from: stranger }
              ),
              "only signator"
            )
          })
          it("owner cannot set bufficorn traits", async () => {
            await truffleAssert.reverts(
              tender.setBufficorn(
                0,
                0,
                "Bufficorn.0",
                [1, 2, 3, 4, 5, 6],
                { from: owner }
              ),
              "only signator"
            )
          })
          it.skip("signator cannot add/edit bufficorns if not in 'Breeding' status", async () => {
            await truffleAssert.reverts(
              tender.setBufficorn(
                0,
                0,
                "Bufficorn.0",
                [10, 20, 30, 40, 50, 60],
                { from: signator2 }
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
                { from: owner, value: 10 ** 10 }
              ),
              "bad mood"
            )
          })
        })
        describe("startAwarding()", async () => {
          it("stranger cannot start awarding", async () => {
            await truffleAssert.reverts(
              tender.startAwarding({ from: stranger }),
              "Ownable"
            )
          })
          it.skip("signator cannot start awarding", async () => {
            await truffleAssert.reverts(
              tender.startAwarding({ from: signator2 }),
              "Ownable"
            )
          })
          it("awarding cannot be started twice", async () => {
            await truffleAssert.reverts(
              tender.startAwarding({ from: owner }),
              "bad mood"
            )
          })
        })
      })
      describe("IWittyBufficornsSurrogates", async () => {
        describe("mintFarmerAwards(..)", async () => {
          it("fails if trying to mint awards from owner with a bad signature", async () => {
            await truffleAssert.reverts(
              tender.mintFarmerAwards(
                owner,
                0, // ranchId
                7, // farmerId
                12345, // farmerScore
                "farmer.7",
                [
                  [ 0, 1, 0 ], // => BestBreeder, Gold
                  [ 1, 3, 0 ], // => BestRach, Bronze 
                ],
                // eslint-disable-next-line max-len
                "0x28aac88b7de30e7e82929f2535e907352b45855f070afdc25fe58aa74867233a0ac88ae11cecaede573ecf43b689882a1798b54a8cb5d253d93dedc221fc80311b",
                { from: owner }
              ),
              "bad signature"
            )
          })
          it("awards with valid signature can be minted from stranger address", async () => {
            const tx = await tender.mintFarmerAwards(
              tokenOwner,
              0, // ranchId
              7, // farmerId
              12345, // farmerScore
              "farmer.7",
              [
                [ 0, 1, 0 ], // => BestBreeder, Gold
                [ 1, 3, 0 ], // => BestRach, Bronze 
              ],
              // eslint-disable-next-line max-len
              "0x28aac88b7de30e7e82929f2535e907352b45855f070afdc25fe58aa74867233a0ac88ae11cecaede573ecf43b689882a1798b54a8cb5d253d93dedc221fc80311b",
              { from: stranger }
            )
            assert.equal(2, tx.logs.length) 
          })
          it("awards cannot be minted twice", async () => {
            await truffleAssert.reverts(
              tender.mintFarmerAwards(
                tokenOwner,
                0, // ranchId
                7, // farmerId
                12345, // farmerScore
                "farmer.7",
                [
                  [ 0, 1, 0 ], // => BestBreeder, Gold
                  [ 1, 3, 0 ], // => BestRach, Bronze 
                ],
                // eslint-disable-next-line max-len
                "0x28aac88b7de30e7e82929f2535e907352b45855f070afdc25fe58aa74867233a0ac88ae11cecaede573ecf43b689882a1798b54a8cb5d253d93dedc221fc80311b",
                { from: stranger }
              ),
              "already minted"
            )
          })
        })
      })
      describe("IWittyBufficornsView", async () => {
        describe("getTokenInfo(..)", async () => {
          it("getting inexistent token fails", async () => {
            await truffleAssert.reverts(
              tender.getTokenInfo.call(0),
              "inexistent"
            )
            await truffleAssert.reverts(
              tender.getTokenInfo.call(27),
              "inexistent"
            )
          })
          it("gets existing token with valid data", async () => {
            const tokenInfo1 = await tender.getTokenInfo.call(1)
            assert.equal(7, tokenInfo1.farmerId)
            const tokenInfo2 = await tender.getTokenInfo.call(2)
            assert.equal(7, tokenInfo2.farmerId)
          })
          it("gets valid token ids from minted farmer", async () => {
            const tokenIds = await tender.getFarmerTokens.call(7)
            assert(tokenIds.length > 0,  "farmer refers no token ids after minting")
            assert(tokenIds.length == 2, "farmer refers too many tokens")
            assert(tokenIds[0].toString() === "1", "first token id should be \"1\"")
            assert(tokenIds[1].toString() === "2", "second token id should be \"2\"")
          })
        })
      })
    })
  })
  describe("ERC721Metadata", async () => {
    describe("baseURI()", async () => {
        let baseURI
        it("returns no empty string", async () => {
            baseURI = await tender.baseURI.call()
            assert(baseURI.length > 0)
        })
        it("ends up with slash", () => {
            assert(baseURI[baseURI.length - 1] === "/")
        })
    })
    describe("metadata(_tokenId)", async () => {
        it("metadata of a previously minted creature should be valid", async () => {
            let metadata = await tender.metadata.call(1)
            metadata = JSON.parse(metadata)
        })
        it("getting metadata from inexistent token fails", async () => {
            await truffleAssert.reverts(
                tender.metadata.call(11),
                "inexistent token"
            )
        })
    })
    describe("tokenURI(_tokenId)", async () => {
      it("tokenURI of a previously minted creature should be valid", async () => {
          let tokenURI = await tender.tokenURI.call(1)
          console.log(tokenURI)
          assert(tokenURI.endsWith("/metadata/1"))
      })
      it("getting tokenURI from inexistent token fails", async () => {
          await truffleAssert.reverts(
              tender.tokenURI.call(311),
              "inexistent token"
          )
      })
    })
  })
})
