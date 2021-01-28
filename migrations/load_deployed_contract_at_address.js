const A = artifacts

const load_contract = async (contract, contract_name, address) => {
  contract.setProvider(web3.currentProvider)
  const deployed_contract = await contract.at(address)
  deployed_contract.contract_name = contract_name
  console.log(`${ contract_name } loaded at ${ deployed_contract.address }`)
  return deployed_contract
}

module.exports = async (artifact_name, address) => {
  const contract = A.require(artifact_name),
        deployed_contract = await load_contract(contract, artifact_name, address)
  return deployed_contract
}