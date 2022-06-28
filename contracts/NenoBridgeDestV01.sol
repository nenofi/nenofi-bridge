//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interface/IERC20.sol";

interface IneIDR{
    function mint(address, uint256) external;
    function burn(address, uint256) external;
}

contract NenoBridgeDestV01 is Ownable{
    // to mint new tokens
    address public neToken;

    function anyExecute(bytes memory _data) external returns (bool){
        (address _to, uint256 _amount) = abi.decode(_data, (address, uint256));  

        // TODO: ADD MINT BRIDGED TOKENS to depositor from bridge src
        IneIDR(neToken).mint(_to, _amount);

        return true;
    }
}
