// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../libs/WittyBufficorns.sol";

/// @title Witty Bufficorns Token's events.
/// @author Otherplane Labs, 2022.
interface IWittyBufficornsEvents {
    event AwardingBegins(address signator);
    event BufficornSet(uint id, string name, uint[6] scores);
    event DecoratorSet(address decorator);
    event FarmerAward(uint indexed tokenId, uint indexed farmerId, WittyBufficorns.Awards indexed awardCategory, uint awardRanking);
    event RanchSet(uint id, string name, uint score);
    event SignatorSet(address signator);
}
