// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../libs/WittyBufficorns.sol";

/// @title  Witty Bufficorns Token's admin interface
/// @dev    Only callable be either the owner, or the signator.
/// @author Otherplane Labs, 2022.
interface IWittyBufficornsAdmin {
    /// Returns decorator contract's address.
    function getDecorator() external view returns (address);

    /// Returns signator's address.
    function getSignator() external view returns (address);

    /// Returns tender's current status
    function getStatus() external view returns (WittyBufficorns.Status);

    /// Sets name, ranch and final traits for the given bufficorn.
    function setBufficorn(
        uint256 _id,
        uint256 _ranchId,
        string calldata _name,
        uint256[6] calldata _traits
    ) external;

    /// Sets Opensea-compliant Decorator contract
    /// @param _decorator Decorating logic contract producing a creature's metadata, and picture.
    function setDecorator(address _decorator) external;

    /// Sets a ranch's data, final score and weather station.
    function setRanch(
        uint256 _id,
        uint256 _score,
        string calldata _name,
        bytes4 _weatherStationAscii
    ) external;
        
    /// Sets externally owned account that is authorized to sign farmer awards.
    function setSignator(address _signator) external;

    /// Stops Breeding phase, which means: (a) ranches and bufficorns' traits cannot be modified any more;
    /// and (b), randomness will be requested to the Witnet's oracle.
    /// @param _totalRanches Total of ranches that must have been previously set.
    /// @param _totalBufficorns Total of bufficorns that must have been previoustly set.
    function stopBreeding(uint256 _totalRanches, uint256 _totalBufficorns) external payable;

    /// Starts the Awarding phase, in which players will be able to mint their tokens.
    function startAwarding() external;    
}
