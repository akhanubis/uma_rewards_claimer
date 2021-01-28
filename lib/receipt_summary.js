module.exports = async hash => {
  const receipt = await web3.eth.getTransactionReceipt(hash)
  console.log(`Tx hash: ${ receipt.transactionHash }`)
  console.log(`Gas used: ${ receipt.gasUsed }`)
}