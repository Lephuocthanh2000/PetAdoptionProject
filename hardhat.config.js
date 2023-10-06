require('@nomicfoundation/hardhat-toolbox')

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // defaultNetwork: localhost,
  solidity: '0.8.21',
  networks: {
    localhost: {
      name: 'hardhat',
      chainId: 31337,
    },
  },
}
