// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Badges is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct Badge {
        string name;
        string description;
        string courseCategory;
        uint256 courseId;
        uint256 createdAt;
    }

    mapping(uint256 => Badge) public badges;
    mapping(address => uint256[]) public userBadges;
    mapping(uint256 => bool) public tokenExists;

    event BadgeMinted(
        address indexed to,
        uint256 indexed tokenId,
        string name,
        string courseCategory,
        uint256 courseId
    );

    constructor() ERC721("Web3IDN Badges", "WEB3BADGE") {}

    function mintBadge(
        address to,
        string memory name,
        string memory description,
        string memory courseCategory,
        uint256 courseId,
        string memory tokenURI
    ) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        badges[tokenId] = Badge({
            name: name,
            description: description,
            courseCategory: courseCategory,
            courseId: courseId,
            createdAt: block.timestamp
        });

        userBadges[to].push(tokenId);
        tokenExists[tokenId] = true;

        emit BadgeMinted(to, tokenId, name, courseCategory, courseId);

        return tokenId;
    }

    function getUserBadges(address user) public view returns (uint256[] memory) {
        return userBadges[user];
    }

    function getBadgeDetails(uint256 tokenId) public view returns (Badge memory) {
        require(tokenExists[tokenId], "Token does not exist");
        return badges[tokenId];
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        
        // Update userBadges mapping on transfer
        if (from != address(0) && to != address(0)) {
            // Remove from sender's badges
            uint256[] storage senderBadges = userBadges[from];
            for (uint256 i = 0; i < senderBadges.length; i++) {
                if (senderBadges[i] == tokenId) {
                    senderBadges[i] = senderBadges[senderBadges.length - 1];
                    senderBadges.pop();
                    break;
                }
            }
            
            // Add to receiver's badges
            userBadges[to].push(tokenId);
        }
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}