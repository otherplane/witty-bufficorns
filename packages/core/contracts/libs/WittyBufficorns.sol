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

        uint256 stopBreedingBlock;
        bytes32 stopBreedingRandomness;
        
        mapping (/* tokenId => FarmerAward */ uint256 => TokenInfo) awards;
        mapping (/* bufficornId => Bufficorn */ uint256 => Bufficorn) bufficorns;
        mapping (/* farmerId => Farmer */ uint256 => Farmer) farmers;
        mapping (/* ranchId => Ranch */ uint256 => Ranch) ranches;
    }


    // ========================================================================
    // --- Enums --------------------------------------------------------------

    enum Awards {
        /* 0 => */ BestBreeder,
        /* 1 => */ BestRanch,

        /* 2 => */ BestBufficorn,

        /* 3 => */ WarmestBufficorn,
        /* 4 => */ CoolestBufficorn,
        /* 5 => */ SmartestBufficorn,      
        /* 6 => */ FastestBufficorn,
        /* 7 => */ MostEnduringBufficorn,
        /* 8 => */ MostVigorousBufficorn
    }

    enum Status {
        /* 0 => */ Breeding,
        /* 1 => */ Randomizing,
        /* 2 => */ Awarding,
        /* 3 => */ Prizing,
        /* 4 => */ Finalized
    }

    enum Traits {
        /* 0 => */ Coat, 
        /* 1 => */ Coolness,
        /* 2 => */ Intelligence,
        /* 3 => */ Speed,
        /* 4 => */ Stamina,
        /* 5 => */ Strength
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
        uint256 score;
        uint256 ranchId;
        uint256[6] traits;
    }

    struct Farmer {
        string  name;
        uint256 score;
        uint256 ranchId;
    }

    struct Ranch {
        string  name;
        uint256 score;
        string  weatherDescription;
        bytes4  weatherStationAscii;
        uint256 weatherTimestamp;
        WitnetInfo witnet;
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
        uint256 inceptionTimestamp;
    }

    struct WitnetInfo {
        uint256 lastValidQueryId;
        uint256 latestQueryId;
        IWitnetRequest request;
    }


    // ========================================================================
    // --- Internal: 'Storage' selectors --------------------------------------

    function status(Storage storage self) internal view returns (Status) {
        if (self.stopBreedingRandomness != bytes32(0)) {
            return Status.Awarding;
        } else if (self.stopBreedingBlock > 0) {
            return Status.Randomizing;
        } else {
            return Status.Breeding;
        }
    }
    

    // ========================================================================
    // --- Internal: helper functions -----------------------------------------

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
