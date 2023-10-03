//SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.21;

contract PetAdoption {
    address public owner;

    constructor() {
        owner = msg.sender;
    }
}
