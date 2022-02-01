// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../libs/WittyBufficorns.sol";

/// @title Witty Bufficorns Token's events.
/// @author Otherplane Labs, 2022.
interface IWittyBufficornsEvents {
    event AwardingBegins(address signator, uint totalRanches, uint totalBufficorns);
    event BufficornSet(uint id, string name, uint score, uint[6] traits);
    event DecoratorSet(address decorator);
    event FarmerAward(uint indexed tokenId, uint indexed farmerId, WittyBufficorns.Awards indexed category, uint ranking);
    event RanchSet(uint id, string name, uint score, bytes4 weatherStation);
    event SignatorSet(address signator);
}
