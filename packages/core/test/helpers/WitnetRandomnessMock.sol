// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WitnetRandomnessMock {
    bytes32 internal __randomness;
    function randomize() external payable returns (uint) {
        payable(msg.sender).transfer(msg.value);
        return 0;
    }
    function setRandomness() external {
        __randomness = blockhash(block.number - 1);
    }
    function getRandomnessAfter(uint256) external view returns (bytes32) {
        require(__randomness != bytes32(0), "WitnetRandomnessMock: unset randomness");
        return __randomness;
    }
}
