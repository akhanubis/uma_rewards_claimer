const { DEPLOYMENT_ACCOUNT_KEY, MAINNET_RPC_HTTP_URL, ARCHIVE_NODE_RPC_URL } = require('./lib/env')
require("@nomiclabs/hardhat-truffle5")
require("@nomiclabs/hardhat-waffle")
const { removeConsoleLog } = require('hardhat-preprocessor')

const custom_tasks = require('./tasks/index.js')
for (const t of custom_tasks) {
  const new_task = task(t.name, t.description)
  for (const p of t.params || [])
    if (p.default || p.default === 0)
      new_task.addOptionalParam(p.name, p.description, p.default)
    else
      new_task.addParam(p.name, p.description)
  new_task.setAction(t.action)
}

const accounts = [`0x${ DEPLOYMENT_ACCOUNT_KEY }`]

module.exports = {
  defaultNetwork: 'hardhat',
  preprocess: {
     eachLine: removeConsoleLog(_ => !process.env.SHOW_LOGS)
  },
  networks: {
    hardhat: {
      accounts: accounts.map(a => ({
        privateKey: a,
        balance: '1000000000000000000000000000'
      })),
      forking: {
        url: ARCHIVE_NODE_RPC_URL || 'No url',
        blockNumber: 11600511
      }
    },
    development:  {
	    url: "http://127.0.0.1:8545",
      gas: 6721975,
      accounts
    },
    mainnet: {
      url: MAINNET_RPC_HTTP_URL || 'No url',
      gas: "auto",
      gasPrice: 16000000000,
      gasMultiplier: 1.2,
      blockGasLimit: 8000000,
      network_id: "1",
      accounts
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200000
          }
        }
      }
    ]
  },
  paths: {
    sources: "./contracts"
  }
}