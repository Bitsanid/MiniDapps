// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Marketplace is Ownable, ReentrancyGuard {
    IERC721 public nftContract;

    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool isActive;
        uint256 createdAt;
    }

    mapping(uint256 => Listing) public listings;
    uint256[] public activeListings;
    mapping(address => uint256[]) public userListings;

    uint256 public marketplaceFee = 250; // 2.5% in basis points
    uint256 public constant MAX_FEE = 1000; // 10% max fee

    event ItemListed(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price,
        uint256 timestamp
    );

    event ItemSold(
        uint256 indexed tokenId,
        address indexed seller,
        address indexed buyer,
        uint256 price,
        uint256 timestamp
    );

    event ListingCancelled(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 timestamp
    );

    constructor(address _nftContract) {
        nftContract = IERC721(_nftContract);
    }

    function listItem(uint256 tokenId, uint256 price) external nonReentrant {
        require(nftContract.ownerOf(tokenId) == msg.sender, "You must own the NFT to list it");
        require(price > 0, "Price must be greater than 0");
        require(listings[tokenId].isActive == false, "Item is already listed");

        // Transfer NFT to marketplace contract
        nftContract.transferFrom(msg.sender, address(this), tokenId);

        // Create listing
        listings[tokenId] = Listing({
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            isActive: true,
            createdAt: block.timestamp
        });

        activeListings.push(tokenId);
        userListings[msg.sender].push(tokenId);

        emit ItemListed(tokenId, msg.sender, price, block.timestamp);
    }

    function buyItem(uint256 tokenId) external payable nonReentrant {
        Listing storage listing = listings[tokenId];
        require(listing.isActive, "Item is not for sale");
        require(msg.value >= listing.price, "Insufficient payment");

        address seller = listing.seller;
        uint256 price = listing.price;

        // Calculate fees
        uint256 fee = (price * marketplaceFee) / 10000;
        uint256 sellerAmount = price - fee;

        // Update listing status
        listing.isActive = false;

        // Remove from active listings
        _removeFromActiveListings(tokenId);
        _removeFromUserListings(seller, tokenId);

        // Transfer NFT to buyer
        nftContract.transferFrom(address(this), msg.sender, tokenId);

        // Transfer payments
        payable(seller).transfer(sellerAmount);
        
        // Refund excess payment to buyer
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }

        emit ItemSold(tokenId, seller, msg.sender, price, block.timestamp);
    }

    function cancelListing(uint256 tokenId) external nonReentrant {
        Listing storage listing = listings[tokenId];
        require(listing.seller == msg.sender, "You are not the seller of this item");
        require(listing.isActive, "Listing is not active");

        // Update listing status
        listing.isActive = false;

        // Remove from active listings
        _removeFromActiveListings(tokenId);
        _removeFromUserListings(msg.sender, tokenId);

        // Transfer NFT back to seller
        nftContract.transferFrom(address(this), msg.sender, tokenId);

        emit ListingCancelled(tokenId, msg.sender, block.timestamp);
    }

    function updatePrice(uint256 tokenId, uint256 newPrice) external {
        Listing storage listing = listings[tokenId];
        require(listing.seller == msg.sender, "You are not the seller of this item");
        require(listing.isActive, "Listing is not active");
        require(newPrice > 0, "Price must be greater than 0");

        listing.price = newPrice;
    }

    function _removeFromActiveListings(uint256 tokenId) internal {
        for (uint256 i = 0; i < activeListings.length; i++) {
            if (activeListings[i] == tokenId) {
                activeListings[i] = activeListings[activeListings.length - 1];
                activeListings.pop();
                break;
            }
        }
    }

    function _removeFromUserListings(address user, uint256 tokenId) internal {
        uint256[] storage listings = userListings[user];
        for (uint256 i = 0; i < listings.length; i++) {
            if (listings[i] == tokenId) {
                listings[i] = listings[listings.length - 1];
                listings.pop();
                break;
            }
        }
    }

    function getActiveListings() external view returns (uint256[] memory) {
        return activeListings;
    }

    function getUserListings(address user) external view returns (uint256[] memory) {
        return userListings[user];
    }

    function getListing(uint256 tokenId) external view returns (Listing memory) {
        return listings[tokenId];
    }

    function setMarketplaceFee(uint256 newFee) external onlyOwner {
        require(newFee <= MAX_FEE, "Fee cannot exceed 10%");
        marketplaceFee = newFee;
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }
}