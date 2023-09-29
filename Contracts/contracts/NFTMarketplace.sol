// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/* IMPORTS */
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

interface INFT is IERC721, IERC721Metadata {
    function mintToken(
        address owner,
        string calldata tokenURI
    ) external returns (uint256);

    function getTokensMinted() external view returns (uint);
}

contract NFTMarketplace is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private tokensListed;
    Counters.Counter private nftsMinted;
    INFT nftContract;

    // Struct to represent an NFT listing
    struct NFTListing {
        address owner;
        uint256 tokenId;
        uint256 price; // Price in Ether
        bool isForSale;
    }
    uint[] public listedNFTsArray; // Use a dynamic array
    // Mapping from token ID to its listing information
    mapping(uint256 => NFTListing) public nftListings;

    // Mapping from owner's address to their list of owned NFTs
    mapping(address => uint256[]) public listedNFTs;

    mapping(address => uint256[]) public MintedNFTs;

    mapping(address => uint256[]) public NFTsBought;

    // Events to notify clients of actions
    event NFTMinted(
        address indexed owner,
        uint256 indexed tokenId,
        string name,
        string tokenURI
    );
    event NFTListed(uint256 indexed tokenId, uint256 price);
    event NFTSold(
        address indexed buyer,
        uint256 indexed tokenId,
        uint256 price
    );

    constructor(address _nftContract) {
        nftContract = INFT(_nftContract);
    }

    function mintNFT(string memory name, string calldata tokenURI) external {
        require(bytes(name).length > 0, "Name must not be empty");
        require(bytes(tokenURI).length > 0, "Token URI must not be empty");

        uint256 tokenId = nftContract.getTokensMinted() + 1;
        nftContract.mintToken(msg.sender, tokenURI);
        MintedNFTs[msg.sender].push(tokenId);

        nftsMinted.increment();
        emit NFTMinted(msg.sender, tokenId, name, tokenURI);
    }

    function listNFTForSale(
        uint256 tokenId,
        uint256 price
    ) external nonReentrant {
        require(
            IERC721(nftContract).ownerOf(tokenId) == msg.sender,
            "You can only list your own NFTs"
        );
        require(price > 0, "Price must be greater than zero");

        tokensListed.increment();

        nftListings[tokenId] = NFTListing({
            owner: msg.sender,
            tokenId: tokenId,
            price: price,
            isForSale: true
        });
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        listedNFTs[msg.sender].push(tokenId);
        listedNFTsArray.push(tokenId);
        emit NFTListed(tokenId, price);
    }

    // Purchase an NFT
    function purchaseNFT(uint256 tokenId) external payable nonReentrant {
        NFTListing memory listing = nftListings[tokenId];
        require(listing.isForSale, "NFT is not for sale");
        require(msg.value >= listing.price, "Insufficient Ether sent");

        address seller = listing.owner;

        tokensListed.decrement();

        // Transfer the NFT to the buyer
        nftContract.transferFrom(address(this), msg.sender, tokenId);

        // Transfer the Ether to the seller
        (bool success, ) = payable(seller).call{value: msg.value}("");
        require(success, "Transfer to seller failed");

        NFTsBought[msg.sender].push(tokenId);

        // Update the listing

        // Find and remove the tokenId from listedNFTsArray
        removeFromMapping(listedNFTsArray, tokenId);

        // Remove the token ID from the seller's listings
        removeFromMapping(listedNFTs[seller], tokenId);

        // Remove the token ID from the seller's MintedNFTs
        removeFromMapping(MintedNFTs[seller], tokenId);

        delete nftListings[tokenId];
        emit NFTSold(msg.sender, tokenId, listing.price);
    }

    function removeFromMapping(
        uint256[] storage data,
        uint256 tokenId
    ) internal {
        for (uint256 i = 0; i < data.length; i++) {
            if (data[i] == tokenId) {
                // Swap the last element with the element to be deleted and then pop
                if (i < data.length - 1) {
                    data[i] = data[data.length - 1];
                }
                data.pop();
                break;
            }
        }
    }

    // Get all NFTs listed for sale
    function getAllListedNFTs() external view returns (NFTListing[] memory) {
        NFTListing[] memory allListedNFTs = new NFTListing[](
            listedNFTsArray.length
        );

        if (listedNFTsArray.length == 0) {
            return allListedNFTs;
        }
        uint256 index = 0;
        for (uint256 i = 0; i < listedNFTsArray.length; i++) {
            if (nftListings[listedNFTsArray[i]].isForSale) {
                allListedNFTs[index] = nftListings[listedNFTsArray[i]];
                index++;
            }
        }
        return allListedNFTs;
    }

    // Get NFTs listed by a user
    function getOwnedListedNFTs(
        address user
    ) external view returns (uint256[] memory) {
        return listedNFTs[user];
    }

    // Get NFTs minted by a user
    function getNFTsMintedByUser(
        address user
    ) external view returns (uint256[] memory) {
        return MintedNFTs[user];
    }

    // Get NFTs bought by a user
    function getNFTsBoughtByUser(
        address user
    ) external view returns (uint256[] memory) {
        return NFTsBought[user];
    }
}
