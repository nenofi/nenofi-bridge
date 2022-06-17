//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

interface CallProxy{
    function anyCall(
        address _to,
        bytes calldata _data,
        address _fallback,
        uint256 _toChainID,
        uint256 _flags

    ) external;
}

contract NenoBridgeV01 {
    address public anyCall;
    uint256 public destChainID;
    uint256 public currChainID;
    address public destContract;

}
