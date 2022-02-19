module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    "polygon.goerli": {
      host: "localhost",
      port: 8535,
      network_id: 80001,
      skipDryRun: true,
      gasPrice: 30 * 10 ** 9,
      confirmations: 3,
    },
    "polygon.mainnet": {
      host: "localhost",
      port: 9535,
      network_id: 137,
      skipDryRun: true,
      gasPrice: 20 * 10 ** 9,
      confirmations: 3,
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    timeout: 100000,
    useColors: true,
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.11",    // Fetch exact version from solc-bin (default: truffle's version)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200
        },
        outputSelection: {
          "*": {
            "*": ["evm.bytecode"],
          },
        },
      }
    }
  },

  db: {
    enabled: false
  }
};
