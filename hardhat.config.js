require('dotenv').config();
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-ethers");

const {API_URL, PRIVATE_KEY} = process.env;

require("./tasks/faucet");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.1",
  defaultNetwork: "polygon_mumbai",
  paths: { },
  networks: {
    hardhat: {},
    polygon_mumbai: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
};
