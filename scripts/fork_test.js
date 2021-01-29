/* test at bn */
require('log-timestamp')
const { DEPLOYMENT_ACCOUNT_KEY } = require('../lib/env')
const { keyToAccount } = require('../lib/eth_utils')
const fs = require('fs')

module.exports = async ({ dataFile }) => {
  const owner = keyToAccount(DEPLOYMENT_ACCOUNT_KEY)
  const Claimer = await require('../lib/claimer')('V1'),
        claims = fs.readFileSync(dataFile).toString().split(/\r?\n/).filter(l => l)

  console.log(await Claimer.estimateGasAndInvokeFrom(owner, 'execute', { claims }, { gasPrice: process.env.FIXED_GAS_PRICE }))
}