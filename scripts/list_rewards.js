require('log-timestamp')
const fs = require('fs')
const { UMA_VOTING_ADDRESS, VOTE_REVEALED_TOPIC, UMA_CLAIM_FUNCTION_SIGNATURE } = require('../lib/constants')

/* TODO: read expectedPrice from chain */
module.exports = async ({ roundId, fromBlock, expectedPrice }) => {
  const round_topic = `0x${ `${ '0'.repeat(64) }${ parseInt(roundId).toString(16) }`.slice(-64) }`
  const logs = await web3.eth.getPastLogs({ fromBlock, address: UMA_VOTING_ADDRESS, topics: [VOTE_REVEALED_TOPIC, null, round_topic] })
  console.log(logs.length)
  expectedPrice = parseInt(expectedPrice)

  const logs_by_voter = {}
  for (const l of logs) {
    l.voter = `0x${ l.topics[1].substr(26) }`
    l.identifier = l.topics[3]
    l.time = parseInt(l.data.substr(0, 66))
    l.price = parseInt(`0x${ l.data.substr(66, 64) }`)
    if (l.price === expectedPrice) {
      logs_by_voter[l.voter] = logs_by_voter[l.voter] || []
      logs_by_voter[l.voter].push(l)
    }
  }

  fs.writeFileSync(`./data/${ roundId }.csv`, Object.values(logs_by_voter).map(logs_batch => {
    return `${ UMA_CLAIM_FUNCTION_SIGNATURE }${ web3.eth.abi.encodeParameters(['address', 'uint256', '(bytes32,uint256)[]'], [logs_batch[0].voter, roundId, logs_batch.map(l => [l.identifier, l.time])]).substr(2) }`
  }).join("\n"))
}