// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../libs/WittyBufficorns.sol";

/// @title Witty Bufficorns Token's surrogating interface.
/// @author Otherplane Labs, 2022.
interface IWittyBufficornsSurrogates {
    function mintFarmerAwards(
        address _tokenOwner,
        uint256 _ranchId,
        uint256 _farmerId,
        uint256 _farmerScore,
        string calldata _farmerName,
        WittyBufficorns.Award[] calldata _awards,
        bytes calldata _signature
    ) external;
}
