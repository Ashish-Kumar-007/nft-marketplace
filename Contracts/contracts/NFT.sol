// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address marketAddress;

    event tokenCreated(uint indexed tokenId, address tokenOwner);

    constructor() ERC721("NFTMarketplace", "NFTM") {}
    
    modifier onlyMarketplace(){
        require(msg.sender == marketAddress, "Only Market can call this!");
    _;
    }
    function mintToken(address _owner, string calldata tokenURI) external onlyMarketplace returns (uint) {
        _tokenIds.increment();
        uint tokenId = _tokenIds.current();

        _mint(_owner, tokenId);
        _setTokenURI(tokenId, tokenURI);
        emit tokenCreated(tokenId, _owner);
        return tokenId;
    }

    function getTokensMinted() external onlyMarketplace view returns (uint) {
        return _tokenIds.current() > 0 ? _tokenIds.current() : 0;
    }

    function setMarketAddress(address _marketAddress) external onlyOwner {
        marketAddress = _marketAddress;
    }
}
