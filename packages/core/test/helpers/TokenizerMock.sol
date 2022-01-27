// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../contracts/interfaces/IWittyBufficornsEvents.sol";
import "../../contracts/libs/WittyBufficorns.sol";

import "@openzeppelin/contracts/utils/Strings.sol";

contract TokenizerMock is IWittyBufficornsEvents {

    using WittyBufficorns for WittyBufficorns.Storage;

    WittyBufficorns.Storage internal __storage;

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
            WittyBufficorns.Award[] calldata _farmerAwards,
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
            WittyBufficorns.recoverAddr(_hash, _signature) == __storage.signator,
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