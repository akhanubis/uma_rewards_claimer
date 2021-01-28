const { DONT_SEND_TXS, SEND_SELF_TRADE } = require('./env')

const Contract = contract => {
  const method_instance = (m, p = {}) => contract.contract.methods[m](...Object.values(p))

  const invoke = (method, params) => method_instance(method, params).call()

  const estimateGas = async (method, params, options, multiplier = 1) => {
    if (SEND_SELF_TRADE)
      return 21000
    return await method_instance(method, params).estimateGas({ ...options }).then(g => Math.ceil(g * multiplier))
  }

  const signWith = async (account, method, params, options) => {
    return await account.signTransaction({
      to: contract.address,
      data: method_instance(method, params).encodeABI(),
      ...options
    })
  }

  const invokeFrom = async (account, method, params, options) => {
    const signed_tx = await signWith(account, method, params, options)
    if (DONT_SEND_TXS)
      console.log(`Invoking ${ method } on ${ contract.address } with ${ web3.utils.fromWei(options.gasPrice, 'gwei') } gasPrice and ${ options.gas } gasLimit \n${ JSON.stringify(params, null, 2) }`)
    else
      return await new Promise((resolve, reject) => {
        const tx = web3.eth.sendSignedTransaction(signed_tx.rawTransaction)
        tx.on('transactionHash', resolve)
        tx.on('error', reject)
      })
  }

  const invokeFromSync = async (account, method, params, options) => {
    const signed_tx = await signWith(account, method, params, options)
    if (DONT_SEND_TXS)
      console.log(`Invoking ${ method } on ${ address } with ${ web3.utils.fromWei(options.gasPrice, 'gwei') } gasPrice and ${ options.gas } gasLimit \n${ JSON.stringify(params, null, 2) }`)
    else
      return await web3.eth.sendSignedTransaction(signed_tx.rawTransaction).catch(console.log)
  }

  const estimateGasAndInvokeFrom = async (account, method, params, options = {}, gas_multiplier) => {
    options.from = account.address
    const gas = await estimateGas(method, params, options, gas_multiplier)
    return invokeFromSync(account, method, params, { gas, ...options })
  }

  const estimateGasAndBuildTx = async (account, method, params, options = {}, gas_multiplier) => {
    options.from = options.from || account.address
    const gas = await estimateGas(method, params, options, gas_multiplier)
    return {
      to: contract.address,
      data: method_instance(method, params).encodeABI(),
      ...options,
      gas
    }
  }

  const balanceOf = address => invoke('balanceOf', { address })

  return {
    invoke,
    estimateGas,
    signWith,
    invokeFrom,
    invokeFromSync,
    estimateGasAndInvokeFrom,
    estimateGasAndBuildTx,
    address: contract.address,
    balanceOf,
    contract 
  }
}

module.exports = Contract