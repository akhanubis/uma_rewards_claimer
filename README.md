# uma_rewards_claimer
Contract and scripts to batch calculate and claim UMA rewards 

Setup `.env`

```
DEPLOYMENT_ACCOUNT_KEY=
ARCHIVE_NODE_RPC_URL=#for hardhat network support
MAINNET_RPC_HTTP_URL=
```

Install deps

`npm install`

Build claims and save to a file

`npx hardhat run:env --network mainnet --env-file .\.env --script .\scripts\list_rewards.js --args roundId=9327,fromBlock=11600000,expectedPrice=57116867441561170`

Estimate gas used by each voter claiming their rewards (after block 11745747, sample round 9327 will return low gas because rewards have already been claimed). Gas estimation is not exact, but you can compare the estimate of claiming separately vs the estimate returned by claim_rewards.js

`npx hardhat run:env --network mainnet --env-file .\.env --script .\scripts\cost_by_voter.js --args dataFile=.\data\9327.csv`

Estimate gas and build tx to claim rewards using Claimer contract (doesnt send tx to the network, only outputs tx fields)

`npx hardhat run:env --network mainnet --env-file .\.env --script .\scripts\claim_rewards.js --args dataFile=.\data\9327.csv,from=0xsomeaddresstouseasfrom`

It saves between 15%-25% gas compared to claiming separately, so not that much.

2021 MIT License,
Pablo Bianciotto
