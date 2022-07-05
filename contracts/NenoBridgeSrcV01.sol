//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
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

contract NenoBridgeSrcV01 is Ownable{

    // AnyCall multichain protocol
    address public anyCallContract;
    uint256 public srcChainID;
    uint256 public destChainID;
    address public destContract;

    // to mint new tokens
    address public neToken;

    // tracks bridge's depositor's balance of tokens deposited (agnostic)
    // mapping (address => uint256) public balanceOf;

    // emergency pause
    bool public isPaused;


    event LogDeposit(address indexed token, uint amount);
    // event NewMsg(uint256 msg);

    constructor(address _anyCallContract, uint256 _srcChainID, uint256 _destChainID, bool _isPaused){
        anyCallContract = _anyCallContract;
        srcChainID = _srcChainID;
        destChainID = _destChainID;
        isPaused = _isPaused;
    }

    function setDestContract(address _newDestContract) public onlyOwner returns (bool){
        destContract = _newDestContract;
        return true;
    }
    
    function setPause(bool _isPaused) public onlyOwner returns(bool){
        isPaused = _isPaused;
        return true;
    }

    function deposit(address _token, uint256 _amount) public returns (bool) { //add prereq
        require(isPaused == false, "NenoBridgeSrcV01: DEPOSIT IS PAUSED");

        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        // balanceOf[msg.sender] += _amount;

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

        emit LogDeposit(_token,_amount);
        return true;
    }



    function anyExecute(bytes memory _data) external returns (bool){
        (address _to, uint256 _amount) = abi.decode(_data, (address, uint256));  

        // TODO: ADD REDEEM DEPOSITED TOKENS from bridge dest
        if(_to == address(0) && _amount>0){
            return false;
        }

        return true;
    }

    function emergencyWithdraw(address _token) public onlyOwner returns (bool){
        console.log(owner());
        IERC20(_token).transferFrom(address(this), owner(), IERC20(_token).balanceOf(address(this)));
        return true;
    }


}

