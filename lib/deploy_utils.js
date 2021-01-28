const fs = require('fs')

const deployContract = async (contract_name, version_name, ...args) => {
  version_name = version_name || contract_name
  const deployed = await artifacts.require(contract_name).new(...args)
  console.log(`${ contract_name } with version ${ version_name } deployed at ${ deployed.address }`)
  fs.writeFileSync(`./out/${ network_id }/${ version_name }`, JSON.stringify({ address: deployed.address, network_id: network_id }))
  return deployed
}

const prepareNetwork = async _ => {
  network_id = await web3.eth.net.getId()
  if (!fs.existsSync(`./out/${ network_id }`))
    fs.mkdirSync(`./out/${ network_id }`)
  return network_id
}

module.exports = {
  deployContract,
  prepareNetwork
}