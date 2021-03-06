// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../libs/WittyBufficornsLib.sol";

/// @title Witty Bufficorns Token's view interface.
/// @author Otherplane Labs, 2022.
interface IWittyBufficornsView {
    function getBufficorn(uint256 _bufficornId) external view returns (WittyBufficornsLib.Bufficorn memory);
    function getFarmer(uint256 _farmerId) external view returns (WittyBufficornsLib.Farmer memory);
    function getFarmerTokens(uint256 _farmerId) external view returns (uint256[] memory);
    function getRanch(uint256 _ranchId) external view returns (WittyBufficornsLib.Ranch memory);
    function getRanchWeather(uint256 _ranchId) external view returns (uint256, string memory);
    function getTokenInfo(uint256 _tokenId) external view returns (WittyBufficornsLib.TokenInfo memory);

    function previewFarmerAwards(
            uint256 _ranchId,
            uint256 _farmerId,
            uint256 _farmerScore,
            string calldata _farmerName,
            WittyBufficornsLib.Award[] calldata _farmerAwards
        ) external view returns (string[] memory _metadata);

    function stopBreedingBlock() external view returns (uint256);
    function stopBreedingRandomness() external view returns (bytes32);

    function toJSON(uint256 _tokenId) external view returns (string memory);

    function totalBufficorns() external view returns (uint256);
    function totalFarmers() external view returns (uint256);
    function totalRanches() external view returns (uint256);
    function totalSupply() external view returns (uint256);
}
