const { deployContract, prepareNetwork } = require('../lib/deploy_utils')

module.exports = async (contract_name, version_name) => {
  await prepareNetwork()
  console.log('Deploying contract...')
  await deployContract(contract_name, version_name)
  process.exit(0)
}