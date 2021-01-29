require('log-timestamp')
const fs = require('fs')
const { UMA_VOTING_ADDRESS } = require('../lib/constants')

module.exports = async ({ dataFile }) => {
  const claims = fs.readFileSync(dataFile).toString().split(/\r?\n/).filter(l => l),
        costs = await Promise.all(claims.map(async claim_data => {
          const voter = `0x${ claim_data.substr(34, 40) }` 
          return [voter, await web3.eth.estimateGas({
            from: voter,
            to: UMA_VOTING_ADDRESS,
            data: claim_data
          })]
        }))

  costs.sort((a, b) => a[0].localeCompare(b[0]))

  for (const c of costs)
    console.log(...c)
  console.log('Total', costs.reduce((out, c) => out + c[1], 0))
}