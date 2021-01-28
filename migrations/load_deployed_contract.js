const fs = require('fs')
const A = artifacts

let network_id

const load_contract = async (contract, contract_name) => {
  const deployed_data = JSON.parse(fs.readFileSync(`./out/${ network_id }/${ contract_name }`).toString())
  contract.setProvider(web3.currentProvider)
  const deployed_contract = await contract.at(deployed_data.address)
  deployed_contract.contract_name = contract_name
  console.log(`${ contract_name } loaded at ${ deployed_contract.address }`)
  return deployed_contract
}

module.exports = async (artifact_name, contract_name) => {
  contract_name = contract_name || artifact_name
  
  network_id = await web3.eth.net.getId()

  if (!fs.existsSync(`./out/${ network_id }`))
    fs.mkdirSync(`./out/${ network_id }`)

  const contract = A.require(artifact_name),
        deployed_contract = await load_contract(contract, contract_name)
  return deployed_contract
}