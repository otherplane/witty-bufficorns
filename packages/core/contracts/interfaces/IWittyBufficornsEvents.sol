// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Witty Bufficorns Token's events.
/// @author Otherplane Labs, 2022.
interface IWittyBufficornsEvents {
    event AwardingBegins(address signator);
    event BufficornSet(uint id, string name, uint[6] scores);
    event DecoratorSet(address decorator);
    event RanchSet(uint id, string name, uint score);
    event SignatorSet(address signator);
}
