# HashNet DOME Smart Contract
Contains modified smart contract running on HashNet blockchain needed for interaction with [DOME](https://dome-project.eu/) solution.
Original unmodified smart contract can be found [here](https://github.com/alastria/DOME-blockchain_smart_contracts).


## Overview
Short overview of example:
1. Prerequisites
2. Install dependencies
3. Build contract
4. Build contract deployment application
5. Deploy contract

### Step 1: Prerequisites
- [NodeJS](https://nodejs.org/) (LTS/Iron)
- [npm](https://www.npmjs.com/package/npm/v/10.8.2)
- [web3js 4.0 or higher](https://www.npmjs.com/package/web3)
- [solc](https://www.npmjs.com/package/solc)

### Step 2: Install dependencies
```bash
# Install
yarn install
```

### Step 3: Build contract
```bash
yarn build:contract
```

### Step 4: Build contract deployment application
```bash
yarn build
```

### Step 5: Deploy contract
```bash
node  node dist/index.js --contractDir=./contract_bin --providerUrl=https://jsongw.testnet.tolar.io/jsonrpc --networkId=2 --privateKey=0x67f3c68cedd11ef77ed6b92ca9fd82c699ccfc5f1fd96fa485b0ffeb2cf60fdf
```