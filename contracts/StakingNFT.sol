// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract StakingNFT is Ownable, ReentrancyGuard {
    IERC721 public nftContract;

    struct Stake {
        address owner;
        uint256 tokenId;
        uint256 stakedAt;
        uint256 lastClaimedAt;
        bool isActive;
    }

    mapping(uint256 => Stake) public stakes;
    mapping(address => uint256[]) public userStakedTokens;

    uint256 public constant POINTS_PER_DAY = 3;
    uint256 public constant SECONDS_PER_DAY = 86400;

    event NftStaked(address indexed owner, uint256 indexed tokenId, uint256 timestamp);
    event NftUnstaked(address indexed owner, uint256 indexed tokenId, uint256 timestamp);
    event PointsClaimed(address indexed owner, uint256 indexed tokenId, uint256 points, uint256 timestamp);

    constructor(address _nftContract) {
        nftContract = IERC721(_nftContract);
    }

    function stake(uint256 tokenId) external nonReentrant {
        require(nftContract.ownerOf(tokenId) == msg.sender, "You must own the NFT to stake it");
        require(stakes[tokenId].isActive == false, "NFT is already staked");

        // Transfer NFT to this contract
        nftContract.transferFrom(msg.sender, address(this), tokenId);

        // Create stake record
        stakes[tokenId] = Stake({
            owner: msg.sender,
            tokenId: tokenId,
            stakedAt: block.timestamp,
            lastClaimedAt: block.timestamp,
            isActive: true
        });

        userStakedTokens[msg.sender].push(tokenId);

        emit NftStaked(msg.sender, tokenId, block.timestamp);
    }

    function unstake(uint256 tokenId) external nonReentrant {
        require(stakes[tokenId].owner == msg.sender, "You are not the owner of this staked NFT");
        require(stakes[tokenId].isActive == true, "NFT is not staked");

        // Claim pending points first
        _claimPoints(tokenId);

        // Update stake record
        stakes[tokenId].isActive = false;

        // Remove from user's staked tokens
        uint256[] storage userTokens = userStakedTokens[msg.sender];
        for (uint256 i = 0; i < userTokens.length; i++) {
            if (userTokens[i] == tokenId) {
                userTokens[i] = userTokens[userTokens.length - 1];
                userTokens.pop();
                break;
            }
        }

        // Transfer NFT back to owner
        nftContract.transferFrom(address(this), msg.sender, tokenId);

        emit NftUnstaked(msg.sender, tokenId, block.timestamp);
    }

    function claimPoints(uint256 tokenId) external nonReentrant {
        require(stakes[tokenId].owner == msg.sender, "You are not the owner of this staked NFT");
        require(stakes[tokenId].isActive == true, "NFT is not staked");

        _claimPoints(tokenId);
    }

    function _claimPoints(uint256 tokenId) internal {
        Stake storage stake = stakes[tokenId];
        uint256 pendingPoints = _calculatePendingPoints(tokenId);
        
        if (pendingPoints > 0) {
            stake.lastClaimedAt = block.timestamp;
            emit PointsClaimed(stake.owner, tokenId, pendingPoints, block.timestamp);
        }
    }

    function _calculatePendingPoints(uint256 tokenId) internal view returns (uint256) {
        Stake memory stake = stakes[tokenId];
        if (!stake.isActive) return 0;

        uint256 timePassed = block.timestamp - stake.lastClaimedAt;
        uint256 daysPassed = timePassed / SECONDS_PER_DAY;
        
        return daysPassed * POINTS_PER_DAY;
    }

    function getPendingPoints(uint256 tokenId) external view returns (uint256) {
        return _calculatePendingPoints(tokenId);
    }

    function getUserStakedTokens(address user) external view returns (uint256[] memory) {
        return userStakedTokens[user];
    }

    function getStakeInfo(uint256 tokenId) external view returns (Stake memory) {
        return stakes[tokenId];
    }

    function isStaked(uint256 tokenId) external view returns (bool) {
        return stakes[tokenId].isActive;
    }
}