// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./interfaces/IWittyBufficornsDecorator.sol";

/// @title Decorator contract providing specific art content for Liscon 2021.
/// @author Otherplane Labs, 2021.
contract WittyBufficornsDecorator
    is
        IWittyBufficornsDecorator,
        Ownable
{
    using Strings for uint256;

    string public override baseURI;

    constructor(string memory _baseURI) {
        bytes memory _rawURI = bytes(_baseURI);
        require(
            _rawURI.length > 0,
            "WittyBufficornsDecorator: empty URI"
        );
        require(
            _rawURI[_rawURI.length - 1] == "/",
            "WittyBufficornsDecorator: no trailing slash"
        );
        baseURI = _baseURI;
    }
   
    struct Item {
        string name;
        string svg;
    }

    bool public forged;

    modifier isForged {
        require(forged, "WittyBufficornsDecorator: not forged");
        _;
    }

    modifier notForged {
        require(!forged, "WittyBufficornsDecorator: already forged");
        _;
    }

    function forge()
        external virtual
        notForged
        onlyOwner
    {
        // TODO: requires
        forged = true;
    }

    function toSVG(
            WittyBufficorns.TokenInfo memory _award,
            WittyBufficorns.Farmer memory _farmer,
            WittyBufficorns.Ranch memory _ranch,
            WittyBufficorns.Bufficorn memory _bufficorn
        )
        public view
        virtual override
        isForged
        returns (string memory _json)
    {
        // TODO
    }

    function toJSON(
            WittyBufficorns.TokenInfo memory _award,
            WittyBufficorns.Farmer memory _farmer,
            WittyBufficorns.Ranch memory _ranch,
            WittyBufficorns.Bufficorn memory _bufficorn
        )
        public view
        virtual override
        isForged
        returns (string memory _svg)
    {
        // TODO
    }
}
