const { assert } = require("chai")
const truffleAssert = require("truffle-assertions")
const WittyBufficornsDecorator = artifacts.require("WittyBufficornsDecorator")
const WittyBufficornsToken = artifacts.require("WittyBufficornsToken")
const WitnetRandomnessMock = artifacts.require("WitnetRandomnessMock")

contract("WittyBufficornsToken", accounts => {
  let tender
  const owner = accounts[0]
  const stranger = accounts[1]
  const signator = accounts[4]
  const farmer0 = "0x184cc5908e1a3d29b4d31df67d99622c4baa7b71"
  const farmer1 = accounts[2]
  //   const farmer2 = accounts[3]

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
                farmer0,
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
              tender.setDecorator(stranger, { from: signator }),
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
                "Ranch.0",
                web3.utils.asciiToHex("KDEN"),
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
                "Ranch.0",
                web3.utils.asciiToHex("KDEN"),
                { from: stranger }
              ),
              "only signator"
            )
          })
          it("ranch must be set with a name", async () => {
            await truffleAssert.reverts(
              tender.setRanch(
                0,
                12345,
                "",
                web3.utils.asciiToHex("KDEN"),
                { from: signator }
              ),
              "no name"
            )
          })
          it("signator can create new ranch", async () => {
            await tender.setRanch(
              0,
              12345,
              "Ranch.0",
              web3.utils.asciiToHex("KDEN"),
              { from: signator }
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
              "Ranch.0",
              web3.utils.asciiToHex("KDEN"),
              { from: signator }
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
          it("bufficorn must be set to an existent ranch", async () => {
            await truffleAssert.reverts(
              tender.setBufficorn(
                0,
                1,
                "Bufficorn.0",
                [1, 2, 3, 4, 5, 6],
                { from: signator }
              ),
              "inexistent ranch"
            )
          })
          it("bufficorn must be set with a name", async () => {
            await truffleAssert.reverts(
              tender.setBufficorn(
                0,
                0,
                "",
                [1, 2, 3, 4, 5, 6],
                { from: signator }
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
                { from: signator }
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
              { from: signator }
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
              { from: signator }
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
                1, // _totalRanches
                24, // _totalBufficorns
                {
                  from: signator,
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
                  from: signator,
                  value: 10 ** 10, // 10 gwei
                }
              ),
              "ranches mismatch"
            )
          })
          // it("stopping breeding of tender with no randomizer, turns to 'Awarding' status", async () => {
          //   const tender2 = await WittyBufficornsToken.new(
          //     "Witty Bufficorns Test",
          //     "TEST",
          //     "0x0000000000000000000000000000000000000000",
          //     WittyBufficornsDecorator.address
          //   )
          //   await tender2.setRanch(0, 10, "Ranch.0", web3.utils.asciiToHex("KDEN"))
          //   await tender2.setBufficorn(0, 0, "Bufficorn.0", [10, 20, 30, 40, 50, 60])
          //   await tender2.stopBreeding(1, 1)
          //   const status = await tender2.getStatus.call()
          //   assert.equal(status.toString(), "2")
          // })
          it("signator can exit breeding status", async () => {
            await tender.stopBreeding(
              1,
              1,
              {
                from: signator,
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
                farmer1,
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
              tender.setDecorator(stranger, { from: signator }),
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
                "Ranch.0",
                web3.utils.asciiToHex("KDEN"),
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
                "Ranch.0",
                web3.utils.asciiToHex("KDEN"),
                { from: stranger }
              ),
              "only signator"
            )
          })
          it("signator cannot add/edit ranches if not in 'Breeding' status", async () => {
            await truffleAssert.reverts(
              tender.setRanch(
                0,
                10,
                "Ranch.0",
                web3.utils.asciiToHex("KDEN"),
                { from: signator }
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
          it("signator cannot add/edit bufficorns if not in 'Breeding' status", async () => {
            await truffleAssert.reverts(
              tender.setBufficorn(
                0,
                0,
                "Bufficorn.0",
                [10, 20, 30, 40, 50, 60],
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
          // it("fails it trying to stop twice a tender with no randomizer", async () => {
          //   const tender2 = await WittyBufficornsToken.new(
          //     "Witty Bufficorns Test",
          //     "TEST",
          //     "0x0000000000000000000000000000000000000000",
          //     WittyBufficornsDecorator.address
          //   )
          //   await tender2.setRanch(0, 10, "Ranch.0", web3.utils.asciiToHex("KDEN"))
          //   await tender2.setBufficorn(0, 0, "Bufficorn.0", [10, 20, 30, 40, 50, 60])
          //   await tender2.stopBreeding(1, 1)
          //   await truffleAssert.reverts(
          //     tender2.stopBreeding(1, 1),
          //     "bad mood"
          //   )
          // })
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
            const randomizer = await WitnetRandomnessMock.at(WitnetRandomnessMock.address)
            await randomizer.setRandomness()
            await tender.startAwarding({ from: signator })
            assert.equal("2", await tender.getStatus.call())
          })
        })
      })
    })
  })
})
