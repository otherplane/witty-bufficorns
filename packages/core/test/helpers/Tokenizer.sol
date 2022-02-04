// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../contracts/interfaces/IWittyBufficornsEvents.sol";
import "../../contracts/libs/WittyBufficornsLib.sol";

import "@openzeppelin/contracts/utils/Strings.sol";

contract Tokenizer is IWittyBufficornsEvents {

    using WittyBufficornsLib for WittyBufficornsLib.Storage;

    WittyBufficornsLib.Storage internal __storage;

    constructor(
            address _signator // backend's EOA
        )
    {
        __storage.signator = _signator;
    }

    function mintFarmerAwards(
            address _tokenOwner,
            uint256 _ranchId,
            uint256 _farmerId,
            uint256 _farmerScore,
            string memory _farmerName,
            WittyBufficornsLib.Award[] calldata _farmerAwards,
            bytes memory _signature
        )
        external
    {
        // Calculate hash
        bytes32 _hash = keccak256(abi.encode(
            _tokenOwner,
            _ranchId,
            _farmerId,
            _farmerScore,
            _farmerName,
            _farmerAwards
        ));
        // Verify signator
        require(
            WittyBufficornsLib.recoverAddr(_hash, _signature) == __storage.signator,
            "WittyBufficornsToken: bad signature"
        );
        // Emit tokenization event
        for (uint _i = 0; _i < _farmerAwards.length; _i++) {
            emit FarmerAward(
                ++ __storage.stats.totalSupply,
                _farmerId,
                _farmerAwards[_i].category,
                _farmerAwards[_i].ranking
            );
        }
        __storage.stats.totalFarmers ++;
    }

}