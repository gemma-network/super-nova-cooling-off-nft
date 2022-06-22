require("@nomiclabs/hardhat-waffle");



require('dotenv').config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});


const { API_URL_RINKEBY, PRIVATE_KEY_RINKEBY } = process.env;

console.log(API_URL_RINKEBY)
console.log(PRIVATE_KEY_RINKEBY)

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "rinkeby",
  networks: {
    hardhat: {},
    rinkeby: {
       url: API_URL_RINKEBY,
       accounts: [`0x${PRIVATE_KEY_RINKEBY}`]
    }
 }
};
