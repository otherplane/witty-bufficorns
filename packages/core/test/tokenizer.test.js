const { assert } = require("chai")

// Contracts
const Tokenizer = artifacts.require("TokenizerMock")

contract("TokenizerMock", accounts => {
  describe("mintFarmerAward(..): ", () => {
    let tokenizer
    before(async () => {
      tokenizer = await Tokenizer.new(
        /* _signator */ "0xF8A654C0328Ba4bAE1aF69EB5856Fc807C8E5731"
      )
    })

    it("must mint one token per farmer award", async () => {
      const tx = await tokenizer.mintFarmerAwards(
        /* _tokenOwner   */ "0x184cc5908e1a3d29b4d31df67d99622c4baa7b71",
        /* _ranchId      */ 0,
        /* _farmerId     */ 7,
        /* _farmerScore  */ 12345,
        /* _farmerName   */ "farmer.7",
        /* _farmerAwards */ [
          [0, 1, 0], // => BestBreeder, Gold
          [1, 3, 0], // => BestRanch, Bronze
        ],
        // eslint-disable-next-line max-len
        "0x28aac88b7de30e7e82929f2535e907352b45855f070afdc25fe58aa74867233a0ac88ae11cecaede573ecf43b689882a1798b54a8cb5d253d93dedc221fc80311b"
      )
      // console.log(tx.logs)
      assert.equal(tx.logs.length, 2)
    })
  })
})
