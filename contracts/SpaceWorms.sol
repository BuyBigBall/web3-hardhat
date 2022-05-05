// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract SpaceWorms is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
	uint256 private price = 100000000000000000; // 0.1 BNB
	address payable private _owner;
	uint8 private cnstMaxTokenCount = 10;

    constructor() ERC721("SpaceWorms", "SWM") {
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://negociosytecnologias.net/erc721/";
    }

    function mint(address to) payable public returns (uint256)
    {

        console.log("msg.sender : ", msg.sender);
        console.log("msg.value : ",  msg.value);
        console.log("price : ",  price);
        console.log("compare result : ",  (msg.value == price) );
        // ### for only one by one contract ###
		require(balanceOf(to) <= 1, 'Each address can only have up to two NFTs');


        require(_tokenIdCounter.current() < cnstMaxTokenCount, 'All NFTs have been minted'); 

		require(msg.value == price, "You don't have enough BNB");

        _tokenIdCounter.increment();
        _safeMint(to, _tokenIdCounter.current());

        return _tokenIdCounter.current();
    }

	function withdraw(address payable recipient) public onlyOwner 
	{
        uint256 balance = address(this).balance;
        recipient.transfer(balance);
    }	

    function actualBalance() public view returns (uint256)
	{
        uint256 balance = address(this).balance;
        return balance;
    }

}