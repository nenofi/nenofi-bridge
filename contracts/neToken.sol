// SPDX-License-Identifier: MIT
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract neToken is ERC20{
    using SafeERC20 for IERC20;

    address public owner;
    uint8 private curDecimals;

    // set of minters, nenobridge or other bridges
    mapping(address => bool) public isMinter;
    // address[] public minters;

    modifier onlyOwner{
        require(msg.sender == owner, "NeIDR: NOT OWNER");
        _;
    }
    modifier onlyAuth{
        require(isMinter[msg.sender], "NeIDR: NOT MINTER");
        _;
    }

    constructor(string memory _name, string memory _symbol, uint8 _decimals) ERC20(_name, _symbol){
        owner = msg.sender;
        curDecimals = _decimals;

    }

    function mint(address _to, uint256 _amount) external onlyAuth{
        _mint(_to, _amount);
    }

    // RECHECK THIS LOGIC WHEN USER TRY TO REDEEM THEIR neTOKENS TO ORIGINAL TOKENS
    function burn(address _vault, uint256 _amount) external onlyAuth{
        _burn(_vault, _amount);
    }

    function addMinter(address _auth) external onlyOwner{
        // minters.push(_auth);
        isMinter[_auth] = true;
    }

    function revokeMinter(address _auth) external onlyOwner {
        isMinter[_auth] = false;
    }    
    
    function ratifyMinter (address _auth) external onlyOwner {
        isMinter[_auth] = true;
    }

	function decimals() public view override returns (uint8) {
		return curDecimals;
	}
}