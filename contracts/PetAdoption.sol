//SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.21;
import "hardhat/console.sol";

contract PetAdoption {
    address public owner;
    uint public indexPet = 0;
    uint[] public allAdoptedPets;

    mapping(uint => address) public petIdToOwnerAddress;
    mapping(address => uint[]) public owneAddressToPetList;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(uint initialPetIndex) {
        owner = msg.sender;
        indexPet = initialPetIndex;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function addPet() external onlyOwner returns (bool) {
        indexPet++;
        return true;
    }

    function adoptPet(uint adoptIdx) public {
        require(adoptIdx < indexPet, "Pet index out of bound");
        require(
            petIdToOwnerAddress[adoptIdx] == address(0),
            "Pet has already adopted"
        );
        console.log("Adopting pet: ", adoptIdx);
        console.log("new Owner: ", petIdToOwnerAddress[adoptIdx]);
        owneAddressToPetList[msg.sender].push(adoptIdx);
        allAdoptedPets.push(adoptIdx);
    }
}
