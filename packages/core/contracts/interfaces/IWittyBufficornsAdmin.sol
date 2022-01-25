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

    /// Sets final scores for the given bufficorn.
    function setBufficornScores(
        uint256 _id,
        uint256 _ranchId,
        string calldata _name,
        uint256[6] calldata _scores
    ) external;

    /// Sets Opensea-compliant Decorator contract
    /// @param _decorator Decorating logic contract producing a creature's metadata, and picture.
    function setDecorator(address _decorator) external;

    /// Sets a ranch's final score. 
    function setRanchScore(
        uint256 _id,
        string calldata _name,
        uint256 _score
    ) external;
        
    /// Sets externally owned account that is authorized to sign farmer awards.
    function setSignator(address _signator) external;

    /// Activates the awarding/minting phase.
    function startAwarding() external;    
}
