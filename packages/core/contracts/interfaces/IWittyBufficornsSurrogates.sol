// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../libs/WittyBufficornsLib.sol";

/// @title Witty Bufficorns Token's surrogating interface.
/// @author Otherplane Labs, 2022.
interface IWittyBufficornsSurrogates {

    /// @dev Called from front-end.
    function mintFarmerAwards(
        address _tokenOwner,
        uint256 _ranchId,
        uint256 _farmerId,
        uint256 _farmerScore,
        string calldata _farmerName,
        WittyBufficornsLib.Award[] calldata _farmerAwards,
        bytes calldata _signature
    ) external;
}
