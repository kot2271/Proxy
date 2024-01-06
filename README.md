# Proxy

## Installation

Clone the repository using the following command:
Install the dependencies using the following command:
```shell
npm i
```

## Deployment

Fill in all the required environment variables(copy .env-example to .env and fill it). 

Deploy contract to the chain (polygon-mumbai):
### ERC721CloneFactory:

```shell
npx hardhat run scripts/deploy/ERC721CloneFactoryDeploy.ts --network polygonMumbai
```

### ERC721Upgradeable:

```shell
npx hardhat run scripts/deploy/ERC721UpgradeableDeploy.ts --network polygonMumbai
```

## Verify

Verify the installation by running the following command:
```shell
npx hardhat verify --network polygonMumbai {CONTRACT_ADDRESS}
```

## Tasks

### ERC721CloneFactory

Create a new task(s) and save it(them) in the folder "tasks". Add a new task_name in the file "tasks/index.ts"

Running a deployERC721Clone task:
```shell
npx hardhat deployERC721Clone --contract {ERC721_CLONE_FACTORY_CONTRACT_ADDRESS} --implementation-contract {IMPLEMENTATION_CONTRACT_ADDRESS} --name {ERC721_CLONE_NAME} --symbol {ERC721_CLONE_SYMBOL} --owner {ERC721_CLONE_OWNER} --network polygonMumbai
```

### ERC721Upgradeable:

Running a mint task:
```shell
npx hardhat mint --contract {MyERC721V1_CONTRACT_ADDRESS} --to {ADDRES_TO_MINT} --token-id {TOKEN_ID} --network polygonMumbai
```

Running a burn task:
```shell
npx hardhat burn --contract {MyERC721V1_CONTRACT_ADDRESS} --token-id {TOKEN_ID} --network polygonMumbai
```

Running a supportsInterface task:
```shell
npx hardhat supportsInterface --contract {MyERC721V2_CONTRACT_ADDRESS} --interface-id {INTERFACE_ID_IN_BYTES} --network polygonMumbai
```

Running a mintWithTokenURI task:
```shell
npx hardhat mintWithTokenURI --contract {MyERC721V2_CONTRACT_ADDRESS} --to {ADDRES_TO_MINT} --token-id {TOKEN_ID} --token-uri {TOKEN_URI} --network polygonMumbai
```

Running a burnToken task:
```shell
npx hardhat burnToken --contract {MyERC721V2_CONTRACT_ADDRESS} --token-id {TOKEN_ID} --network polygonMumbai
```

Running a setTokenUri task:
```shell
npx hardhat setTokenUri --contract {MyERC721V2_CONTRACT_ADDRESS} --token-id {TOKEN_ID} --token-uri {TOKEN_URI} --network polygonMumbai
```

Running a tokenURI task:
```shell
npx hardhat tokenURI --contract {MyERC721V2_CONTRACT_ADDRESS} --token-id {TOKEN_ID} --network polygonMumbai
```