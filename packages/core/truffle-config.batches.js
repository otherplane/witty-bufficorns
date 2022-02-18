module.exports = {
  
  migrations_directory: "./migrations/batches/",

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
      gasPrice: 30 * 10 ** 9,
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
