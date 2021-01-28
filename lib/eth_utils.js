const nextNonce = (account, default_block = 'latest') => web3.eth.getTransactionCount(account.address, default_block)

const transferETH = async (account, to, value, options) => {
  const signed_tx = await account.signTransaction({
    nonce: await nextNonce(account),
    to,
    value,
    ...options
  })
  return await web3.eth.sendSignedTransaction(signed_tx.rawTransaction)
}

const keyToAccount = k => web3.eth.accounts.privateKeyToAccount(`0x${ k }`)

const sendTransaction = async (account, to, options = {}) => {
  const signed_tx = await account.account.signTransaction({ gas: 21000, value: '0x0', nonce: account.nonce, from: account.address, to, ...options })
  return await new Promise(r => {
    const a = web3.eth.sendSignedTransaction(signed_tx.rawTransaction)
    a.on('transactionHash', r)
  })
}

module.exports = {
  nextNonce,
  transferETH,
  keyToAccount,
  sendTransaction
}