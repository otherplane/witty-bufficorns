// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../libs/WittyBufficornsLib.sol";

/// @title Witty Bufficorns Token's decorator interface.
/// @author Otherplane Labs, 2022.
interface IWittyBufficornsDecorator {
    function baseURI() external view returns (string memory);
    function toJSON(
            WittyBufficorns.TokenInfo calldata _award,
            WittyBufficorns.Farmer calldata _farmer,
            WittyBufficorns.Ranch calldata _ranch,
            WittyBufficorns.Bufficorn calldata _bufficorn
        ) external view returns (string memory)
    ;
    function toSVG(
            WittyBufficorns.TokenInfo calldata _award,
            WittyBufficorns.Farmer calldata _farmer,
            WittyBufficorns.Ranch calldata _ranch,
            WittyBufficorns.Bufficorn calldata _bufficorn
        ) external view returns (string memory)
    ;
}
