// SPDX-License-Identifier: MIT
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract neBIDR is ERC20{
    using SafeERC20 for IERC20;

    address public owner;

    // set of minters, nenobridge or other bridges
    mapping(address => bool) public isMinter;
    address[] public minters;

    modifier onlyOwner{
        require(msg.sender == owner, "NeIDR: NOT OWNER");
        _;
    }
    modifier onlyAuth{
        require(isMinter[msg.sender], "NeIDR: NOT MINTER");
        _;
    }

    constructor() ERC20("neRupiah", "neIDR"){
        owner = msg.sender;
    }

    function mint(address _to, uint256 _amount) external onlyAuth{
        _mint(_to, _amount);
    }

    function burn(address _vault, uint256 _amount) external onlyAuth{
        _burn(_vault, _amount);
    }

    function addMinter(address _auth) external onlyOwner{
        minters.push(_auth);
        isMinter[_auth] = true;
    }

    function revokeMinter(address _auth) external onlyOwner {
        isMinter[_auth] = false;
    }    
    
    function ratifyMinter (address _auth) external onlyOwner {
        isMinter[_auth] = true;
    }

}