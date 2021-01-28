const { deployContract, prepareNetwork } = require('../lib/deploy_utils')

module.exports = async options => {
  options.exit = options.exit === undefined ? true : options.exit
  options.version = options.version || 'VDefault'

  await prepareNetwork()

  console.log('Deploying contracts...')
  const deployed = await deployContract('Claimer', options.version)
  if (options.exit)
    process.exit(0)
  return deployed
}