// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WitnetRandomnessMock {
    function randomize() external payable returns (uint) {
        payable(msg.sender).transfer(msg.value);
        return 0;
    }
    function getRandomnessAfter(uint256) external view returns (bytes32) {
        return blockhash(block.number - 16);
    }
}
