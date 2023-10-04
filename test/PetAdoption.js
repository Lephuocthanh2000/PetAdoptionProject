const { expect } = require('chai')
const { ethers } = require('hardhat')
const {
  Contract,
} = require('hardhat/internal/hardhat-network/stack-traces/model')

describe('Pet Adoption', () => {
  let contractAddress, _contract
  let ownerAddress
  let accountOther
  const petCount = 10
  async function deployContract() {
    const [owner, account] = await ethers.getSigners()
    const PetAdoption = await ethers.getContractFactory('PetAdoption')
    const contract = await PetAdoption.deploy(petCount)
    return { owner, contract, account }
  }
  before(async () => {
    const { owner, contract, account } = await deployContract()
    contractAddress = await contract.getOwner()
    ownerAddress = owner.address
    accountOther = account.address
    _contract = contract
  })
  describe('Deployment', () => {
    it('Should set the right owner ', async function () {
      expect(await contractAddress).to.equal(ownerAddress)
      console.log('Contract Owner: ' + contractAddress)
      console.log('Owner: ' + ownerAddress)
    })
    it('Should get the right owner ', async function () {
      expect(await contractAddress).to.equal(ownerAddress)
      console.log('Contract Owner: ' + contractAddress)
      console.log('Owner: ' + ownerAddress)
    })
  })
  describe('Add Pet', () => {
    it('Should revert with right error in case of orther account', () => {
      expect(_contract.connect(accountOther).addPet()).to.be.revertedWith(
        'Only a owner can add a new pet'
      )
    })
    it('Should increace pet index', async function () {
      await _contract.addPet()
      expect(await _contract.indexPet()).to.equal(petCount + 1)
    })
  })
  describe('Adopt Pet', () => {
    it('Should revert with right error in case of value out of bounds', () => {
      expect(_contract.adoptPet(petCount)).to.be.revertedWith(
        'Pet index out of bound'
      )
      expect(_contract.adoptPet(-1)).to.be.revertedWith('value out of bounds')
    })
    it('Should revert with right error in case of Pet has already adopted', async () => {
      await _contract.adoptPet(petCount - 1)
      expect(
        _contract.connect(accountOther).adoptPet(petCount - 1)
      ).to.be.revertedWith('Pet has already adopted')
    })
    it('Adopt Pet successfull ', async () => {
      await expect(_contract.adoptPet(1)).not.to.be.reverted
    })
  })
})
