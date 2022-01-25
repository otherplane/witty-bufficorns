// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./interfaces/IWittyBufficornsAdmin.sol";
import "./interfaces/IWittyBufficornsEvents.sol";
import "./interfaces/IWittyBufficornsSurrogates.sol";
import "./interfaces/IWittyBufficornsView.sol";

import "./interfaces/IWittyBufficornsDecorator.sol";

/// @title Witty Bufficorns Awards - ERC721 Token contract
/// @author Otherplane Labs, 2022.
contract WittyBufficornsToken
    is
        ERC721,
        Ownable,
        ReentrancyGuard,
        IWittyBufficornsAdmin,
        IWittyBufficornsEvents,
        IWittyBufficornsSurrogates,
        IWittyBufficornsView
{
    using Strings for uint256;

    modifier inStatus(WittyBufficorns.Status status) {
        require(
            __storage.status == status,
            "WittyBufficornsToken: bad mood"
        );
        _;
    }

    modifier onlySignator {
        require(
            msg.sender == __storage.signator,
            "WittyBufficornsToken: only signator"
        );
        _;
    }

    modifier tokenExists(uint256 _tokenId) {
        require(
            _exists(_tokenId),
            "WittyBufficornsToken: inexistent token"
        );
        _;
    }

    WittyBufficorns.Storage internal __storage;

    constructor(
            string memory _name,
            string memory _symbol,
            address _decorator
        )
        ERC721(_name, _symbol)
    {
        setDecorator(_decorator);
        __storage.signator = msg.sender;
        __storage.status = WittyBufficorns.Status.Breeding;
    }

    // ========================================================================
    // --- 'ERC721Metadata' overriden functions -------------------------------
    
    function baseURI()
        public view
        virtual
        returns (string memory)
    {
        return IWittyBufficornsDecorator(__storage.decorator).baseURI();
    }
    
    function metadata(uint256 _tokenId)
        external view
        virtual
        tokenExists(_tokenId)
        returns (string memory)
    {
        return toJSON(_tokenId);
    }

    function tokenURI(uint256 _tokenId)
        public view
        virtual override
        tokenExists(_tokenId)
        returns (string memory)
    {
        return string(abi.encodePacked(
            baseURI(),
            _tokenId.toString()
        ));
    }

    // ========================================================================
    // --- Implementation of 'IWittyBufficornsAdmin' --------------------------

    /// Returns decorator contract's address.
    function getDecorator()
        external view
        virtual override
        returns (address)
    {
        return __storage.decorator;
    }

    /// Returns signator's address.
    function getSignator()
        external view
        returns (address)
    {
        return __storage.signator;
    }

    /// Returns tender's current status
    function getStatus()
        external view
        returns (WittyBufficorns.Status)
    {
        return __storage.status;
    }

    /// Sets final scores for the given bufficorn.
    /// @dev Must be called from the signators's address.
    /// @dev Fails if not in Breeding status. 
    function setBufficornScores(
            uint256 _id,
            uint256 _ranchId,
            string calldata _name,
            uint256[6] calldata _scores
        )
        external
        onlySignator
        inStatus(WittyBufficorns.Status.Breeding)
    {
        WittyBufficorns.Ranch storage __ranch = __storage.ranches[_ranchId];
        require(
            bytes(__ranch.name).length > 0,
            "WittyBufficornsToken: ranch not set"
        );
        WittyBufficorns.Bufficorn storage __bufficorn = __storage.bufficorns[_id];
        if (bytes(_name).length > 0) {
            if (bytes(__bufficorn.name).length == 0) {
                __storage.stats.totalBufficorns ++;
            }
        }
        __bufficorn.ranchId = _ranchId;
        __bufficorn.scores = _scores;
        emit BufficornSet(_id, _name, _scores);
    }

    /// Sets Opensea-compliant Decorator contract
    /// @dev Must be called from the owner's address.
    function setDecorator(address _decorator)
        public
        virtual override
        onlyOwner
    {
        require(address(_decorator) != address(0), "WittyBufficornsToken: no decorator");
        __storage.decorator = _decorator;
        emit DecoratorSet(_decorator);
    }

    /// Sets a ranch's final score. 
    /// @dev Must be called from the signators's address.
    /// @dev Fails if not in Breeding status. 
    function setRanchScore(
            uint256 _id,
            string calldata _name,
            uint256 _score
        )
        external
        onlySignator
        inStatus(WittyBufficorns.Status.Breeding)
    {
        WittyBufficorns.Ranch storage __ranch = __storage.ranches[_id];
        if (bytes(_name).length > 0) {
            if (bytes(__ranch.name).length == 0) {
                __storage.stats.totalRanches ++;
            }
        }
        __ranch.name = _name;
        __ranch.score = _score;
        emit RanchSet(_id, _name, _score);
    }

    /// Sets externally owned account that is authorized to sign farmer awards.
    /// @dev Must be called from the owner's address.
    /// @dev Fails if not in Breeding status. 
    function setSignator(address _signator)
        public
        virtual override
        onlyOwner
        inStatus(WittyBufficorns.Status.Breeding)
    {
        require(_signator != address(0), "WittyBufficornsToken: no signator");
        __storage.signator = _signator;        
        emit SignatorSet(_signator);
    }

    /// Activates the minting of farmer awards. 
    /// @dev Must be called from the signator's address.
    /// @dev Fails if not in Breeding status.
    function startAwarding()
        external
        virtual override
        onlySignator
        inStatus(WittyBufficorns.Status.Breeding)
    {
        __storage.status = WittyBufficorns.Status.Awarding;
        emit AwardingBegins(owner());
    }


    // ========================================================================
    // --- Implementation of 'IWittyBufficornsSurrogates' ---------------------

    function mintFarmerAwards(
            address _tokenOwner,
            uint256 _ranchId,
            uint256 _farmerId,
            uint256 _farmerScore,
            string memory _farmerName,
            WittyBufficorns.Award[] calldata _farmerAwards,
            bytes memory _signature
        )
        public
        virtual override
        nonReentrant
        inStatus(WittyBufficorns.Status.Awarding)
    {
        require(_tokenOwner != address(0), "WittyBufficornsToken: no token owner");
        require(_farmerAwards.length > 0, "WittyBufficornsToken: no awards");

        WittyBufficorns.Ranch storage __ranch = __storage.ranches[_ranchId];
        WittyBufficorns.Farmer storage __farmer = __storage.farmers[_farmerId];

        require(__ranch.score > 0, "WittyBufficornsToken: no score ranch");
        require(__farmer.tokenIds.length == 0, "WittyBufficornsToken: already minted");
        
        _verifySignatorSignature(
            _tokenOwner,
            _ranchId,
            _farmerId,
            _farmerScore,
            _farmerName,
            _farmerAwards,
            _signature
        );

        // Set farmer's info for the first and only time:
        __farmer.name = _farmerName;
        __farmer.score = _farmerScore;
        __farmer.ranchId = _ranchId;

        // Set common parameters to all tokens minted within this call:
        WittyBufficorns.TokenInfo memory _tokenInfo;
        _tokenInfo.farmerId = _farmerId;
        _tokenInfo.timestamp = block.timestamp;

        // Loop: Mint one token per received award:
        bool[] memory _isChecked = new bool[](6);
        for (uint _ix = 0; _ix < _farmerAwards.length; _ix ++) {
            // Make sure there are no repeated award categories:
            uint8 _category = uint8(_farmerAwards[_ix].category);
            require(
                !_isChecked[_category],
                "WittyBufficornsToken: repeated category"
            );
            _isChecked[_category] = true;
            _tokenInfo.award = _farmerAwards[_ix];
            __mintFarmerAward(_tokenOwner, _tokenInfo, __farmer, __ranch);
        }

        // Increase total number of farmers that minted at least one award:
        __storage.stats.totalFarmers ++;
    }


    // ========================================================================
    // --- Implementation of 'IWittyBufficornsView' ---------------------------

    function getBufficorn(uint256 _bufficornId)
        external view
        override
        returns (WittyBufficorns.Bufficorn memory)
    {
        return __storage.bufficorns[_bufficornId];
    }

    function getFarmer(uint256 _farmerId)
        external view
        override
        returns (WittyBufficorns.Farmer memory)
    {
        return __storage.farmers[_farmerId];
    }

    function getRanch(uint256 _ranchId)
        external view
        override
        returns (WittyBufficorns.Ranch memory)
    {
        return __storage.ranches[_ranchId];
    }

    function getTokenInfo(uint256 _tokenId)
        external view 
        override
        tokenExists(_tokenId)
        returns (WittyBufficorns.TokenInfo memory)
    {
        return __storage.awards[_tokenId];
    }

    function toJSON(uint256 _tokenId)
        public view
        override
        tokenExists(_tokenId)
        returns (string memory)
    {
        WittyBufficorns.TokenInfo memory _token = __storage.awards[_tokenId];
        WittyBufficorns.Farmer memory _farmer = __storage.farmers[_token.farmerId];
        WittyBufficorns.Ranch memory _ranch = __storage.ranches[_farmer.ranchId];
        WittyBufficorns.Bufficorn memory _bufficorn;
        if (
            uint8(_token.award.category) >= uint8(WittyBufficorns.Awards.BestBufficorn)
        ) {
            _bufficorn = __storage.bufficorns[_token.award.bufficornId];
        }
        return IWittyBufficornsDecorator(__storage.decorator).toJSON(
            _token,
            _farmer,
            _ranch,
            _bufficorn
        );
    }

    function toSVG(uint256 _tokenId)
        public view
        override
        tokenExists(_tokenId)
        returns (string memory)
    {
        WittyBufficorns.TokenInfo memory _token = __storage.awards[_tokenId];
        WittyBufficorns.Farmer memory _farmer = __storage.farmers[_token.farmerId];
        WittyBufficorns.Ranch memory _ranch = __storage.ranches[_farmer.ranchId];
        WittyBufficorns.Bufficorn memory _bufficorn;
        if (
            uint8(_token.award.category) >= uint8(WittyBufficorns.Awards.BestBufficorn)
        ) {
            _bufficorn = __storage.bufficorns[_token.award.bufficornId];
        }
        return IWittyBufficornsDecorator(__storage.decorator).toSVG(
            _token,
            _farmer,
            _ranch,
            _bufficorn
        );
    }
    
    function totalBufficorns() public view override returns (uint256) {
        return __storage.stats.totalBufficorns;
    }

    function totalFarmers() public view override returns (uint256) {
        return __storage.stats.totalFarmers;
    }

    function totalRanches() public view override returns (uint256) {
        return __storage.stats.totalRanches;
    }

    function totalSupply() public view override returns (uint256) {
        return __storage.stats.totalSupply;
    }


    // ------------------------------------------------------------------------
    // --- INTERNAL METHODS ---------------------------------------------------
    // ------------------------------------------------------------------------

    function __doSafeMint(
            address _tokenOwner,
            WittyBufficorns.TokenInfo memory _tokenInfo
        )
        internal
        returns (uint256 _tokenId)
    {
        _tokenId = ++ __storage.stats.totalSupply;               
        __storage.awards[_tokenId] = _tokenInfo;
        _safeMint(_tokenOwner, _tokenId);
    }

    function __mintFarmerAward(
            address _tokenOwner,
            WittyBufficorns.TokenInfo memory _tokenInfo,
            WittyBufficorns.Farmer storage __farmer,
            WittyBufficorns.Ranch storage __ranch
        )
        internal
    {
        // Set, store and mint token info:
        uint256 _tokenId = __doSafeMint(_tokenOwner, _tokenInfo);

        // Add token id reference to Famers entity:
        __farmer.tokenIds.push(_tokenId);

        uint8 _category = uint8(_tokenInfo.award.category);
        if (_category > uint8(WittyBufficorns.Awards.ThanksForPlaying)) {
            require(
                _tokenInfo.award.ranking > 0,
                "WittyBufficornsToken: special award with no ranking"
            );
            if (_category >= uint8(WittyBufficorns.Awards.BestBufficorn)) {
                // Add token id reference to Bufficorns entity:
                __storage.bufficorns[
                    _tokenInfo.award.bufficornId
                ].tokenIds.push(_tokenId);                    
            } else {
                // Add token id reference to Ranches entity:
                __ranch.tokenIds.push(_tokenId);
            }
        }
    }

    function _verifySignatorSignature(
            address _tokenOwner,
            uint256 _ranchId,
            uint256 _farmerId,
            uint256 _farmerScore,
            string memory _farmerName,
            WittyBufficorns.Award[] memory _farmerAwards,
            bytes memory _signature
        )
        internal view
        virtual
    {
        // Verify signator:
        bytes32 _hash = keccak256(abi.encode(
            _tokenOwner,
            _ranchId,
            _farmerId,
            _farmerScore,
            _farmerName,
            _farmerAwards
        ));
        require(
            WittyBufficorns.recoverAddr(_hash, _signature) == __storage.signator,
            "WittyBufficornsToken: bad signature"
        );
    }
    
    // // ------------------------------------------------------------------------
    // // --- PRIVATE METHODS ----------------------------------------------------
    // // ------------------------------------------------------------------------

    // function _bytesToBytes32(bytes memory _bb)
    //     private pure
    //     returns (bytes32 _r)
    // {
    //     uint _len = _bb.length > 32 ? 32 : _bb.length;
    //     for (uint _i = 0; _i < _len; _i ++) {
    //         _r |= bytes32(_bb[_i] & 0xff) >> (_i * 8);
    //     }
    // }
}
