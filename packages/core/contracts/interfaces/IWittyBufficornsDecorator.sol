// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../libs/WittyBufficornsLib.sol";

/// @title Witty Bufficorns Token's decorator interface.
/// @author Otherplane Labs, 2022.
interface IWittyBufficornsDecorator {
    function baseURI() external view returns (string memory);
    function lookupMedalString(uint256 _ranking) external pure returns (string memory);
    function lookupRanchResource(uint256 _ranchId) external pure returns (string memory);
    function toJSON(
            uint256 _tokenId,
            bytes32 _randomness,
            WittyBufficornsLib.TokenMetadata memory _metadata
        ) external view returns (string memory);
}
