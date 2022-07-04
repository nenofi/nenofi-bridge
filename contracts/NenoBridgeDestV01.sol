//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interface/IERC20.sol";

interface CallProxy{
    function anyCall(
        address _to,
        bytes calldata _data,
        address _fallback,
        uint256 _toChainID,
        uint256 _flags

    ) external;
}

interface IneToken{
    function mint(address, uint256) external;
    function burn(address, uint256) external;
}

contract NenoBridgeDestV01 is Ownable{

    // AnyCall multichain protocol
    address public anyCallContract;
    uint256 public srcChainID;
    uint256 public destChainID;
    address public destContract;

    // to mint new tokens
    address public neToken;

    event LogRedeem(address indexed token, uint amount);
    event LogMint(address indexed token, uint amount);


    constructor(address _anyCallContract, uint256 _srcChainID, uint256 _destChainID){
        anyCallContract = _anyCallContract;
        srcChainID = _srcChainID;
        destChainID = _destChainID;
    }

    function setDestContract(address _newDestContract) public onlyOwner returns (bool){
        destContract = _newDestContract;
        return true;
    }

    function anyExecute(bytes memory _data) external returns (bool){
        (address _to, uint256 _amount) = abi.decode(_data, (address, uint256));  

        // TODO: ADD MINT BRIDGED TOKENS to depositor from bridge src
        // Make sure when user deposit bidr they get nebidr or idrt they get neidrt
        IneToken(neToken).mint(_to, _amount);
        emit LogMint(_to,_amount);

        return true;
    }

    // PLEASE RECHECK REDEEMING LOGIC ESPECIALLY THE BURNING OF THE neTOKENS
    function redeem(address _token, uint256 _amount) public returns (bool) { //add prereq
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        // balanceOf[msg.sender] += _amount;
        IneToken(_token).burn(address(this), _amount);
        // INSERT CALL TO ANYCALL CONTRACT TO MINT ASSETS ON OTHER CHAIN
        CallProxy(anyCallContract).anyCall(
            // destContract
            destContract,

            // sending the encoded bytes of the string msg and decode on the destination chain
            abi.encode(msg.sender, _amount), 

            // 0x as fallback address because we don't have a fallback function
            address(0),

            // destination chain ID
            destChainID,

            // Using 2 flag to pay fee on current chain
            2
            );

        emit LogRedeem(_token,_amount);
        return true;
    }
}
