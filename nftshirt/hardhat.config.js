require("@nomiclabs/hardhat-waffle");
const projectId ="6c2d5c57aebd41c4a8e78de92e1c88e3"
const fs =require("fs")
const privateKey = fs.readFileSync(".secret").toString()
module.exports = {
  networks:{
    hardhat:{
      chainId: 1337
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
      accounts: [privateKey]
    },
    mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/${projectId}`,
      accounts: [privateKey]
    } 
  },
  solidity: {
    version: '0.8.4',
    settings: {
      optimizer: {
        runs: 200,
        enabled: true
      }
    }
  },
};
