/* test at bn */
require('log-timestamp')
const { DEPLOYMENT_ACCOUNT_KEY } = require('../lib/env')
const { keyToAccount } = require('../lib/eth_utils')
const fs = require('fs')
const { UMA_VOTING_ADDRESS } = require('../lib/constants')

module.exports = async ({ dataFile }) => {
  const owner = keyToAccount(DEPLOYMENT_ACCOUNT_KEY)
  const claims = fs.readFileSync(dataFile).toString().split(/\r?\n/).filter(l => l)

  let total = 0
  for (const c of claims) {
    const result = await web3.eth.sendTransaction({ from: owner.address, to: UMA_VOTING_ADDRESS, data: c, gas: 1000000 })
    total += result.gasUsed
    console.log(result.gasUsed, total)
  }
  console.log("END")
}