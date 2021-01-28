require('log-timestamp')
const fs = require('fs')

module.exports = async ({ contractVersion, dataFile, from }) => {
  const Claimer = await require('../lib/claimer')(contractVersion || 'V1'),
        claims = fs.readFileSync(dataFile).toString().split(/\r?\n/).filter(l => l)
  console.log(await Claimer.estimateGasAndBuildTx(null, 'execute', { claims }, { from, gasPrice: process.env.FIXED_GAS_PRICE }))
}