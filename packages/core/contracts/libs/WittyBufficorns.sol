// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "witnet-solidity-bridge/contracts/interfaces/IWitnetRequest.sol";

/// @title WittyBufficorns Library: data model and helper functions
/// @author Otherplane Labs, 2022.
library WittyBufficorns {

    // ========================================================================
    // --- Storage layout -----------------------------------------------------

    struct Storage {
        address decorator;
        address signator;

        Stats   stats;
        Status  status;
        
        mapping (/* tokenId => FarmerAward */ uint256 => TokenInfo) awards;
        mapping (/* bufficornId => Bufficorn */ uint256 => Bufficorn) bufficorns;
        mapping (/* farmerId => Farmer */ uint256 => Farmer) farmers;
        mapping (/* ranchId => Ranch */ uint256 => Ranch) ranches;
    }


    // ========================================================================
    // --- Enums --------------------------------------------------------------

    enum Awards {
        ThanksForPlaying,

        BestBreeder,
        BestRanch,

        BestBufficorn,
        CoolestBufficorn,
        FastestBufficorn,
        MostVigorousBufficorn,
        MostEnduringBufficorn,
        MostAgileBufficorn,
        WarmestBufficorn
    }

    enum Status {
        Breeding,
        Awarding
    }

    enum Traits {
        Agility,    // 0
        Coat,       // 1
        Coolness,   // 2
        Speed,      // 3
        Stamina,    // 4
        Strength    // 5
    }
    
    // ========================================================================
    // --- Structs ------------------------------------------------------------

    struct Award {
        Awards  category;
        uint256 ranking;
        uint256 bufficornId;
    }

    struct Bufficorn {
        string name;
        uint256[6] scores;
        uint256 ranchId;
        uint256[] tokenIds;
    }

    struct Farmer {
        string  name;
        uint256 score;
        uint256 ranchId;
        uint256[] tokenIds;
    }

    struct Ranch {
        string  name;
        uint256 score;
        uint256[] tokenIds;
    }

    struct Stats {
        uint256 totalBufficorns;
        uint256 totalFarmers;
        uint256 totalRanches;
        uint256 totalSupply;
    }
    
    struct TokenInfo {
        Award   award;
        uint256 farmerId;  
        uint256 timestamp;
    }
    

    // ========================================================================
    // --- Internal: helper functions -----------------------------------------

    // /// Returns index of Most Significant Bit of given number, applying De Bruijn O(1) algorithm.
    // function msbDeBruijn32(uint32 _v)
    //     internal pure
    //     returns (uint8)
    // {
    //     uint8[32] memory _bitPosition = [
    //             0, 9, 1, 10, 13, 21, 2, 29, 11, 14, 16, 18, 22, 25, 3, 30,
    //             8, 12, 20, 28, 15, 17, 24, 7, 19, 27, 23, 6, 26, 5, 4, 31
    //         ];
    //     _v |= _v >> 1;
    //     _v |= _v >> 2;
    //     _v |= _v >> 4;
    //     _v |= _v >> 8;
    //     _v |= _v >> 16;
    //     return _bitPosition[
    //         uint32(_v * uint256(0x07c4acdd)) >> 27
    //     ];
    // }

    // /// Generates pseudo-random number uniformly distributed in range [0 .. _range).
    // function randomUint8(bytes32 _seed, uint256 _index, uint8 _range)
    //     internal pure
    //     returns (uint8)
    // {
    //     assert(_range > 0);
    //     uint8 _flagBits = uint8(255 - msbDeBruijn32(uint32(_range)));
    //     uint256 _number = uint256(keccak256(abi.encode(_seed, _index))) & uint256(2 ** _flagBits - 1);
    //     return uint8((_number * _range) >> _flagBits); 
    // }

    /// Recovers address from hash and signature.
    function recoverAddr(bytes32 _hash, bytes memory _signature)
        internal pure
        returns (address)
    {
        if (_signature.length != 65) {
            return (address(0));
        }
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := mload(add(_signature, 0x20))
            s := mload(add(_signature, 0x40))
            v := byte(0, mload(add(_signature, 0x60)))
        }
        if (uint256(s) > 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0) {
            return address(0);
        }
        if (v != 27 && v != 28) {
            return address(0);
        }
        return ecrecover(_hash, v, r, s);
    }    
}
