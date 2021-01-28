const loadDeployedContract = require('../migrations/load_deployed_contract')

module.exports = async (contract_version = 'Claimer') => {
  const c = await loadDeployedContract('Claimer', contract_version),
        instance = require('./contract')(c)
  return instance
}